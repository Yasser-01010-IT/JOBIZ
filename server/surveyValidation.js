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
