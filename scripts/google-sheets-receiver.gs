const SHEET_NAME = 'Réponses';
const HEADERS = [
  'Date de réception',
  'Niveau d’études',
  'Domaine',
  'Établissement',
  'Ville',
  'Poste recherché',
  'Début souhaité',
  'État de la recherche',
  'Heures par semaine',
  'Candidatures le mois dernier',
  'Entretiens le mois dernier',
  'Obstacle principal',
  'Canaux de recherche',
  'Fonctionnalités prioritaires',
  'Frein à l’utilisation de l’IA',
  'Préférence de prix',
  'Autre besoin',
  'Souhaite tester',
  'Nom',
  'E-mail',
  'Accord de contact',
  'Accord étude',
  'Commentaire'
];
const FIELD_KEYS = [
  'submittedAt',
  'studyLevel',
  'fieldOfStudy',
  'schoolName',
  'city',
  'targetRole',
  'targetStart',
  'searchStatus',
  'timeSpent',
  'applicationsLastMonth',
  'interviewsLastMonth',
  'mainObstacle',
  'searchChannels',
  'priorityFeatures',
  'trustConcern',
  'pricingPreference',
  'otherNeed',
  'wantsToTest',
  'fullName',
  'email',
  'contactConsent',
  'consentResearch',
  'additionalFeedback'
];

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(event) {
  let submission;
  try {
    submission = JSON.parse(event?.postData?.contents || '{}');
  } catch {
    return jsonResponse({ ok: false, message: 'Invalid payload' });
  }

  const expectedSecret = PropertiesService
    .getScriptProperties()
    .getProperty('JOBINZ_SHARED_SECRET');

  if (!expectedSecret || submission.secret !== expectedSecret) {
    return jsonResponse({ ok: false, message: 'Unauthorized' });
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const row = FIELD_KEYS.map(key => submission[key] ?? '');
    row[0] = submission.submittedAt ? new Date(submission.submittedAt) : new Date();
    sheet.appendRow(row);
    sheet.getRange(sheet.getLastRow(), 1).setNumberFormat('dd/mm/yyyy hh:mm');

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error('Unable to append the survey response:', error);
    return jsonResponse({ ok: false, message: 'Unable to save the response' });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}
