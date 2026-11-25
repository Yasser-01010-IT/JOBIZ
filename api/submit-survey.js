import { normalizeSurveySubmission } from '../server/surveyValidation.js';

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(payload));
}

function hasSameOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return true;

  try {
    const requestHost = request.headers['x-forwarded-host'] || request.headers.host;
    return new URL(origin).host === requestHost;
  } catch {
    return false;
  }
}

export default async function submitSurvey(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendJson(response, 405, { ok: false, message: 'Méthode non autorisée.' });
    return;
  }

  if (!hasSameOrigin(request)) {
    sendJson(response, 403, { ok: false, message: 'Origine de requête non autorisée.' });
    return;
  }

  if (!request.headers['content-type']?.includes('application/json')) {
    sendJson(response, 415, { ok: false, message: 'Le formulaire doit être envoyé en JSON.' });
    return;
  }

  if (Number(request.headers['content-length'] || 0) > 64 * 1024) {
    sendJson(response, 413, { ok: false, message: 'La réponse est trop volumineuse.' });
    return;
  }

  let submission;
  try {
    submission = normalizeSurveySubmission(request.body);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    sendJson(response, statusCode, { ok: false, message: error.message });
    return;
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
  if (!scriptUrl || !sharedSecret) {
    console.error('Survey storage is not configured on Vercel.');
    sendJson(response, 503, {
      ok: false,
      message: 'Le stockage des réponses n’est pas encore configuré. Réessaie plus tard.'
    });
    return;
  }

  let parsedScriptUrl;
  try {
    parsedScriptUrl = new URL(scriptUrl);
  } catch {
    console.error('The configured Google Apps Script URL is invalid.');
    sendJson(response, 503, {
      ok: false,
      message: 'Le stockage des réponses est temporairement indisponible.'
    });
    return;
  }

  if (
    parsedScriptUrl.protocol !== 'https:'
    || parsedScriptUrl.hostname !== 'script.google.com'
    || !/^\/macros\/s\/[^/]+\/exec$/.test(parsedScriptUrl.pathname)
  ) {
    console.error('The configured Google Apps Script URL is not an HTTPS deployment URL.');
    sendJson(response, 503, {
      ok: false,
      message: 'Le stockage des réponses est temporairement indisponible.'
    });
    return;
  }

  try {
    const upstreamResponse = await fetch(parsedScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...submission, secret: sharedSecret })
    });
    const upstreamBody = await upstreamResponse.text();
    let result;

    try {
      result = JSON.parse(upstreamBody);
    } catch {
      result = null;
    }

    if (!upstreamResponse.ok || result?.ok !== true) {
      console.error('Google Sheets rejected a survey submission:', upstreamResponse.status);
      sendJson(response, 502, {
        ok: false,
        message: 'La réponse n’a pas pu être enregistrée. Réessaie plus tard.'
      });
      return;
    }

    sendJson(response, 201, { ok: true, message: 'Réponse enregistrée.' });
  } catch (error) {
    console.error('Google Sheets survey submission failed:', error.message);
    sendJson(response, 502, {
      ok: false,
      message: 'La réponse n’a pas pu être enregistrée. Réessaie plus tard.'
    });
  }
}
