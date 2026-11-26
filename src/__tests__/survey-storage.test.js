import { mkdtemp, rm, rmdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import ExcelJS from 'exceljs';
import { afterEach, describe, expect, it } from 'vitest';
import { appendSurveySubmission, normalizeSurveySubmission } from '../../server/surveyStorage.js';

const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(async directory => {
    await rm(path.join(directory, 'responses.xlsx'), { force: true });
    await rmdir(directory);
  }));
});

function createSubmission(overrides = {}) {
  return {
    studyLevel: 'M1',
    fieldOfStudy: 'Informatique',
    schoolName: 'Université',
    city: 'Paris',
    targetRole: 'Stage développeuse',
    targetStart: 'Dans 3 mois',
    searchStatus: 'Je commence',
    timeSpent: '2 à 5 heures',
    applicationsLastMonth: '1 à 5',
    interviewsLastMonth: 'Aucun',
    mainObstacle: 'Trouver des offres adaptées',
    searchChannels: ['Sites d’emploi', 'Réseau'],
    priorityFeatures: ['Matching', 'CV'],
    trustConcern: 'La confidentialité des données',
    pricingPreference: 'Freemium',
    otherNeed: '',
    wantsToTest: false,
    fullName: '',
    email: '',
    contactConsent: false,
    consentResearch: true,
    additionalFeedback: '',
    ...overrides
  };
}

describe('local Excel survey storage', () => {
  it('creates a workbook and appends later responses without evaluating spreadsheet formulas', async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'avenirgo-survey-'));
    temporaryDirectories.push(directory);
    const workbookPath = path.join(directory, 'responses.xlsx');

    const first = normalizeSurveySubmission(createSubmission({
      targetRole: '=HYPERLINK("https://example.com")'
    }));
    await appendSurveySubmission(first, workbookPath);
    await appendSurveySubmission(
      normalizeSurveySubmission(createSubmission({ targetRole: 'Stage en développement' })),
      workbookPath
    );

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(workbookPath);
    const worksheet = workbook.getWorksheet('Réponses');

    expect(worksheet.rowCount).toBe(3);
    expect(worksheet.getRow(2).getCell(6).value).toBe('\'=HYPERLINK("https://example.com")');
    expect(worksheet.getRow(2).getCell(20).value).toBe('');
    expect(worksheet.getRow(3).getCell(6).value).toBe('Stage en développement');
  });

  it('requires an address and contact consent only when someone volunteers to test', () => {
    expect(() => normalizeSurveySubmission(createSubmission({
      wantsToTest: true,
      contactConsent: true
    }))).toThrow('Une adresse e-mail valide est requise');

    expect(() => normalizeSurveySubmission(createSubmission({
      wantsToTest: true,
      email: 'test@example.com'
    }))).toThrow('L’accord de contact est requis');
  });
});
