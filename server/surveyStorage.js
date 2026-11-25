import ExcelJS from 'exceljs';
import { access, mkdir } from 'node:fs/promises';
import path from 'node:path';
export { normalizeSurveySubmission } from './surveyValidation.js';

const SHEET_NAME = 'Réponses';
const COLUMNS = [
  { header: 'Date de réception', key: 'submittedAt', width: 22 },
  { header: 'Niveau d’études', key: 'studyLevel', width: 22 },
  { header: 'Domaine', key: 'fieldOfStudy', width: 32 },
  { header: 'Établissement', key: 'schoolName', width: 28 },
  { header: 'Ville', key: 'city', width: 20 },
  { header: 'Poste recherché', key: 'targetRole', width: 30 },
  { header: 'Début souhaité', key: 'targetStart', width: 22 },
  { header: 'État de la recherche', key: 'searchStatus', width: 34 },
  { header: 'Heures par semaine', key: 'timeSpent', width: 20 },
  { header: 'Candidatures le mois dernier', key: 'applicationsLastMonth', width: 25 },
  { header: 'Entretiens le mois dernier', key: 'interviewsLastMonth', width: 25 },
  { header: 'Obstacle principal', key: 'mainObstacle', width: 42 },
  { header: 'Canaux de recherche', key: 'searchChannels', width: 48 },
  { header: 'Fonctionnalités prioritaires', key: 'priorityFeatures', width: 56 },
  { header: 'Frein à l’utilisation de l’IA', key: 'trustConcern', width: 42 },
  { header: 'Préférence de prix', key: 'pricingPreference', width: 54 },
  { header: 'Autre besoin', key: 'otherNeed', width: 48 },
  { header: 'Souhaite tester', key: 'wantsToTest', width: 18 },
  { header: 'Nom', key: 'fullName', width: 28 },
  { header: 'E-mail', key: 'email', width: 34 },
  { header: 'Accord de contact', key: 'contactConsent', width: 20 },
  { header: 'Accord étude', key: 'consentResearch', width: 16 },
  { header: 'Commentaire', key: 'additionalFeedback', width: 48 }
];

export async function appendSurveySubmission(submission, workbookPath) {
  await mkdir(path.dirname(workbookPath), { recursive: true });

  const workbook = new ExcelJS.Workbook();
  let workbookExists = true;
  try {
    await access(workbookPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      workbookExists = false;
    } else {
      throw error;
    }
  }

  if (workbookExists) await workbook.xlsx.readFile(workbookPath);

  let worksheet = workbook.getWorksheet(SHEET_NAME);
  if (!worksheet) worksheet = workbook.addWorksheet(SHEET_NAME);

  if (worksheet.rowCount === 0) {
    worksheet.columns = COLUMNS;
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FF312E81' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEEF2FF' }
    };
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
  } else {
    const headersMatch = COLUMNS.every(
      (column, index) => worksheet.getRow(1).getCell(index + 1).value === column.header
    );
    if (!headersMatch) {
      throw new Error('Le fichier Excel existant ne correspond pas au format attendu.');
    }
    worksheet.columns = COLUMNS;
  }

  const row = worksheet.addRow(submission);
  row.getCell(1).numFmt = 'dd/mm/yyyy hh:mm';
  await workbook.xlsx.writeFile(workbookPath);
}
