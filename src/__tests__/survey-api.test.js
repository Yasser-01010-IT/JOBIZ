import { afterEach, describe, expect, it, vi } from 'vitest';
import submitSurvey from '../../api/submit-survey.js';

const originalScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
const originalScriptSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET;

afterEach(() => {
  if (originalScriptUrl === undefined) delete process.env.GOOGLE_APPS_SCRIPT_URL;
  else process.env.GOOGLE_APPS_SCRIPT_URL = originalScriptUrl;

  if (originalScriptSecret === undefined) delete process.env.GOOGLE_APPS_SCRIPT_SECRET;
  else process.env.GOOGLE_APPS_SCRIPT_SECRET = originalScriptSecret;

  vi.unstubAllGlobals();
});

function createRequest(overrides = {}) {
  return {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      host: 'avenirgo.example',
      origin: 'https://avenirgo.example'
    },
    body: {
      studyLevel: 'M1',
      fieldOfStudy: 'Informatique',
      targetRole: 'Stage développeuse',
      targetStart: 'Dans 3 mois',
      searchStatus: 'Je commence',
      timeSpent: '2 à 5 heures',
      applicationsLastMonth: '1 à 5',
      interviewsLastMonth: 'Aucun',
      mainObstacle: 'Trouver des offres adaptées',
      priorityFeatures: ['Matching'],
      trustConcern: 'La confidentialité des données',
      pricingPreference: 'Freemium',
      consentResearch: true,
      wantsToTest: false
    },
    ...overrides
  };
}

function createResponse() {
  return {
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(body) {
      this.body = JSON.parse(body);
    }
  };
}

describe('Vercel survey endpoint', () => {
  it('forwards a validated response to the private Google Sheets receiver', async () => {
    process.env.GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/test-deployment/exec';
    process.env.GOOGLE_APPS_SCRIPT_SECRET = 'test-secret';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ ok: true })
    });
    vi.stubGlobal('fetch', fetchMock);
    const response = createResponse();

    await submitSurvey(createRequest(), response);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [, options] = fetchMock.mock.calls[0];
    expect(JSON.parse(options.body)).toMatchObject({
      secret: 'test-secret',
      studyLevel: 'M1',
      wantsToTest: 'Non'
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.ok).toBe(true);
  });

  it('rejects invalid submissions without forwarding them', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const response = createResponse();

    await submitSurvey(createRequest({ body: {} }), response);

    expect(response.statusCode).toBe(400);
    expect(response.body.ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
