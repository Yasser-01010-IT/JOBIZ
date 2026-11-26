import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { appendSurveySubmission, normalizeSurveySubmission } from './server/surveyStorage.js';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const workbookPath = path.join(projectRoot, 'data', 'jobinz-survey-responses.xlsx');

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > 64 * 1024) {
      const error = new Error('La réponse est trop volumineuse.');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('Le format des réponses est invalide.');
    error.statusCode = 400;
    throw error;
  }
}

function localSurveyStoragePlugin() {
  let writeQueue = Promise.resolve();

  return {
    name: 'avenirgo-local-survey-storage',
    configureServer(server) {
      server.middlewares.use('/api/submit-survey', async (request, response) => {
        if (request.method !== 'POST') {
          response.setHeader('Allow', 'POST');
          sendJson(response, 405, { message: 'Méthode non autorisée.' });
          return;
        }

        const origin = request.headers.origin;
        if (origin) {
          try {
            if (new URL(origin).host !== request.headers.host) {
              sendJson(response, 403, { message: 'Origine de requête non autorisée.' });
              return;
            }
          } catch {
            sendJson(response, 403, { message: 'Origine de requête invalide.' });
            return;
          }
        }

        if (!request.headers['content-type']?.includes('application/json')) {
          sendJson(response, 415, { message: 'Le formulaire doit être envoyé en JSON.' });
          return;
        }

        try {
          const submission = normalizeSurveySubmission(await readJsonBody(request));
          const write = writeQueue.then(() => appendSurveySubmission(submission, workbookPath));
          writeQueue = write.catch(() => {});
          await write;
          sendJson(response, 201, { ok: true, message: 'Réponse enregistrée dans le fichier Excel.' });
        } catch (error) {
          const statusCode = error.statusCode || 500;
          if (statusCode >= 500) {
            console.error('Local survey Excel write failed:', error.message);
          }
          sendJson(response, statusCode, {
            ok: false,
            message: statusCode >= 500
              ? 'Le fichier Excel ne peut pas être écrit. Vérifie que le dossier data du projet est accessible.'
              : error.message
          });
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), localSurveyStoragePlugin()]
});
