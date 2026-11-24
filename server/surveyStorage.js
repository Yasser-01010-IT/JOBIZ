import ExcelJS from 'exceljs';
import { access, mkdir } from 'node:fs/promises';
import path from 'node:path';

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

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function cleanText(value, maxLength = 2000) {
  if (typeof value !== 'string') return '';
  const text = value.trim().slice(0, maxLength);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function cleanList(value, field, maxItems) {
  if (value === undefined) return [];
  if (
    !Array.isArray(value)
    || value.length > maxItems
    || value.some(item => typeof item !== 'string')
  ) {
    throw validationError(`La réponse « ${field} » est invalide.`);
  }
  return value.map(item => cleanText(item, 180)).filter(Boolean);
}

function requiredText(data, field, maxLength) {
  if (typeof data[field] !== 'string' || !data[field].trim()) {
    throw validationError('Certaines réponses obligatoires sont manquantes.');
  }
  return cleanText(data[field], maxLength);
}

export function normalizeSurveySubmission(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw validationError('Les réponses reçues sont invalides.');
  }

  const studyLevel = requiredText(data, 'studyLevel', 100);
  const fieldOfStudy = requiredText(data, 'fieldOfStudy', 150);
  const targetRole = requiredText(data, 'targetRole', 180);
  const targetStart = requiredText(data, 'targetStart', 100);
  const searchStatus = requiredText(data, 'searchStatus', 150);
  const timeSpent = requiredText(data, 'timeSpent', 100);
  const applicationsLastMonth = requiredText(data, 'applicationsLastMonth', 100);
  const interviewsLastMonth = requiredText(data, 'interviewsLastMonth', 100);
  const mainObstacle = requiredText(data, 'mainObstacle', 250);
  const trustConcern = requiredText(data, 'trustConcern', 180);
  const pricingPreference = requiredText(data, 'pricingPreference', 180);
  const priorityFeatures = cleanList(data.priorityFeatures, 'priorityFeatures', 3);

  if (priorityFeatures.length === 0) {
    throw validationError('Choisis au moins une fonctionnalité prioritaire.');
  }

  if (data.consentResearch !== true || typeof data.wantsToTest !== 'boolean') {
    throw validationError('Le consentement et le choix de participation sont obligatoires.');
  }

  const email = cleanText(data.email, 254);
  if (data.wantsToTest) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw validationError('Une adresse e-mail valide est requise pour participer au bêta test.');
    }
    if (data.contactConsent !== true) {
      throw validationError('L’accord de contact est requis pour participer au bêta test.');
    }
  }

  return {
    submittedAt: new Date(),
    studyLevel,
    fieldOfStudy,
    schoolName: cleanText(data.schoolName, 180),
    city: cleanText(data.city, 120),
    targetRole,
    targetStart,
    searchStatus,
    timeSpent,
    applicationsLastMonth,
    interviewsLastMonth,
    mainObstacle,
    searchChannels: cleanList(data.searchChannels, 'searchChannels', 12).join(' | '),
    priorityFeatures: priorityFeatures.join(' | '),
    trustConcern,
    pricingPreference,
    otherNeed: cleanText(data.otherNeed),
    wantsToTest: data.wantsToTest ? 'Oui' : 'Non',
    fullName: data.wantsToTest ? cleanText(data.fullName, 120) : '',
    email: data.wantsToTest ? email : '',
    contactConsent: data.wantsToTest ? 'Oui' : 'Non',
    consentResearch: 'Oui',
    additionalFeedback: cleanText(data.additionalFeedback)
  };
}

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
