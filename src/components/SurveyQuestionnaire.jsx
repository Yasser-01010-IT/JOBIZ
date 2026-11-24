import React, { cloneElement, isValidElement, useId, useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, CheckCircle2, Sparkles } from 'lucide-react';
import Stepper, { Step } from './Stepper';
import Threads from './Threads';
import './SurveyQuestionnaire.css';

const STEPS = [
  {
    title: 'Ton profil',
    description: 'Ton cursus, ton projet et ton calendrier.'
  },
  {
    title: 'Ta recherche',
    description: 'Ce que tu fais aujourd’hui et ce qui te bloque.'
  },
  {
    title: 'Tes besoins',
    description: 'Les aides qui auraient le plus de valeur pour toi.'
  },
  {
    title: 'Bêta test',
    description: 'Choisis librement si tu souhaites tester Jobinz.'
  }
];

const STUDY_LEVELS = [
  'BTS / BUT / DUT',
  'Licence 1 ou 2',
  'Licence 3 / Bachelor',
  'Master 1',
  'Master 2 / PFE',
  'École d’ingénieurs',
  'École de commerce',
  'Autre'
];

const STUDY_FIELDS = [
  'Informatique, tech, data ou IA',
  'Commerce, vente ou marketing',
  'Finance, comptabilité ou gestion',
  'Droit, sciences politiques ou RH',
  'Ingénierie, industrie ou BTP',
  'Santé, biologie ou chimie',
  'Art, design ou audiovisuel',
  'Autre domaine'
];

const SEARCH_STATUSES = [
  'Je n’ai pas encore commencé',
  'Je commence ma recherche',
  'Je candidate depuis moins de 3 mois',
  'Je cherche depuis 3 mois ou plus',
  'J’ai des entretiens, mais pas encore d’offre'
];

const OBSTACLES = [
  'Trouver des offres récentes adaptées à mon profil',
  'Savoir quelles offres valent vraiment la peine',
  'Adapter mon CV et ma lettre à chaque offre',
  'Obtenir une réponse après avoir postulé',
  'Contacter le bon recruteur au bon moment',
  'Organiser mes candidatures et mes relances',
  'Manquer d’expérience ou ne pas savoir me démarquer'
];

const SEARCH_CHANNELS = [
  'Sites d’offres d’emploi',
  'Sites carrières des entreprises',
  'Espace carrière de mon établissement',
  'Candidatures spontanées par e-mail',
  'Réseau personnel ou anciens élèves',
  'Salons, événements ou forums'
];

const PRIORITY_FEATURES = [
  'Trouver des offres vraiment adaptées à mon profil',
  'Comprendre pourquoi une offre me correspond',
  'Adapter mon CV et ma lettre à chaque candidature',
  'Suivre mes candidatures et savoir quand relancer',
  'Préparer un e-mail au recruteur, à valider avant envoi',
  'M’entraîner aux entretiens'
];

const TRUST_CONCERNS = [
  'La protection de mes données personnelles',
  'Des offres ou conseils qui ne correspondent pas à mon profil',
  'Des candidatures envoyées sans mon accord',
  'Des CV ou messages trop génériques',
  'La prise en main ou le temps nécessaire',
  'Le prix d’un abonnement',
  'Rien en particulier'
];

const PRICE_PREFERENCES = [
  'Je préfère une version gratuite, même avec des limites',
  '4,99 € par mois me sembleraient raisonnables si le service m’aide vraiment',
  'Je préférerais payer uniquement pendant ma recherche',
  'Mon école ou mon université devrait prendre en charge le service',
  'Je ne paierais pas pour ce type de service'
];

const INITIAL_FORM_DATA = {
  studyLevel: '',
  fieldOfStudy: '',
  schoolName: '',
  city: '',
  targetRole: '',
  targetStart: '',
  searchStatus: '',
  timeSpent: '',
  applicationsLastMonth: '',
  interviewsLastMonth: '',
  mainObstacle: '',
  searchChannels: [],
  priorityFeatures: [],
  trustConcern: '',
  pricingPreference: '',
  otherNeed: '',
  wantsToTest: null,
  fullName: '',
  email: '',
  contactConsent: false,
  consentResearch: false,
  additionalFeedback: ''
};

function ChoiceCards({ name, options, value, onChange, multiple = false, columns = 2 }) {
  return (
    <div className={`survey-choices survey-choices--${columns}`}>
      {options.map(option => {
        const item = typeof option === 'string'
          ? { value: option, label: option }
          : option;
        const selected = multiple ? value.includes(item.value) : value === item.value;

        return (
          <label
            className={`survey-choice${selected ? ' is-selected' : ''}`}
            key={item.value}
          >
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={name}
              value={item.value}
              checked={selected}
              onChange={() => onChange(item.value)}
            />
            <span className="survey-choice__marker" aria-hidden="true">
              {selected && <Check />}
            </span>
            <span className="survey-choice__label">{item.label}</span>
          </label>
        );
      })}
    </div>
  );
}

function Field({ label, hint, children }) {
  const controlId = useId();
  const isChoiceGroup = isValidElement(children) && children.type === ChoiceCards;

  if (isChoiceGroup) {
    return (
      <fieldset className="survey-field">
        <legend className="survey-field__label">{label}</legend>
        {hint && <span className="survey-field__hint">{hint}</span>}
        {children}
      </fieldset>
    );
  }

  return (
    <div className="survey-field">
      <div className="survey-field__heading">
        <label className="survey-field__label" htmlFor={controlId}>{label}</label>
        {hint && <span className="survey-field__hint">{hint}</span>}
      </div>
      {cloneElement(children, { id: controlId })}
    </div>
  );
}

export default function SurveyQuestionnaire() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepperKey, setStepperKey] = useState(0);
  const [responseError, setResponseError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field, value) => {
    setFormData(previous => ({ ...previous, [field]: value }));
    setResponseError('');
  };

  const toggleSelection = (field, value, maximum = Infinity) => {
    const selected = formData[field];
    if (selected.includes(value)) {
      updateField(field, selected.filter(item => item !== value));
    } else if (selected.length >= maximum) {
      setResponseError(`Choisis au maximum ${maximum} options.`);
    } else {
      updateField(field, [...selected, value]);
    }
  };

  const getStepError = step => {
    if (step === 1) {
      if (!formData.studyLevel || !formData.fieldOfStudy) {
        return 'Indique ton niveau d’études et ton domaine.';
      }
      if (!formData.targetRole.trim() || !formData.targetStart) {
        return 'Précise le type de poste recherché et quand tu souhaites commencer.';
      }
    }

    if (step === 2) {
      if (
        !formData.searchStatus
        || !formData.timeSpent
        || !formData.applicationsLastMonth
        || !formData.interviewsLastMonth
        || !formData.mainObstacle
      ) {
        return 'Réponds aux questions obligatoires sur ta recherche actuelle.';
      }
    }

    if (step === 3) {
      if (!formData.priorityFeatures.length || !formData.trustConcern || !formData.pricingPreference) {
        return 'Choisis au moins une priorité, une préoccupation et une préférence de prix.';
      }
    }

    if (step === 4) {
      if (typeof formData.wantsToTest !== 'boolean') {
        return 'Indique si tu souhaites participer au bêta test.';
      }
      if (!formData.consentResearch) {
        return 'Ton accord est nécessaire pour enregistrer tes réponses dans le cadre de l’étude.';
      }
      if (formData.wantsToTest) {
        const email = formData.email.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return 'Saisis une adresse e-mail valide pour être recontacté(e).';
        }
        if (!formData.contactConsent) {
          return 'Confirme que Jobinz peut te contacter au sujet du bêta test.';
        }
      }
    }

    return '';
  };

  const handleSubmit = async () => {
    const error = getStepError(4);
    if (error) {
      setResponseError(error);
      return;
    }

    setIsSubmitting(true);
    setResponseError('');

    try {
      const response = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      let result = null;
      try {
        result = await response.json();
      } catch {
        const contentType = response.headers.get('content-type') || '';
        throw new Error(contentType.includes('application/json')
          ? 'Le serveur a renvoyé une réponse invalide.'
          : 'Le stockage Excel est disponible uniquement quand le serveur de développement Vite du projet est lancé.');
      }

      if (!response.ok || result?.ok !== true) {
        throw new Error(result?.message || 'La réponse n’a pas pu être enregistrée. Réessaie plus tard.');
      }

      setSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.62 },
        colors: ['#6366f1', '#8b5cf6', '#a78bfa']
      });
    } catch (error) {
      console.error('Survey submission failed:', error);
      setResponseError(
        error instanceof TypeError
          ? 'Le serveur de développement local est inaccessible. Relance-le puis réessaie.'
          : error.message || 'La réponse n’a pas pu être envoyée. Réessaie plus tard.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(1);
    setResponseError('');
    setSubmitted(false);
    setStepperKey(previous => previous + 1);
  };

  return (
    <section id="questionnaire" className="survey-section">
      <div className="survey-threads" aria-hidden="true">
        <Threads
          color="#ffffff"
          lineCount={90}
          thickness={0.6}
          softness={1.3}
          amplitude={1.7}
          distance={0.4}
          waves={1.05}
          speed={0.6}
          split={0.04}
          fray={0.5}
          angle={25}
          taper={0.85}
          brightness={1.4}
          parting={0}
          enableMouseInteraction
          fade={0}
          opacity={1}
          seed={0}
        />
      </div>
      <div className="survey-shell">
        <header className="survey-header">
          <span className="survey-kicker">
            <Sparkles aria-hidden="true" />
            <span className="survey-kicker__text">Étude & bêta test Jobinz</span>
          </span>
          <h2 className="survey-title">
            Dis-nous ce qui te <span>serait vraiment utile.</span>
          </h2>
          <p>
            Tes réponses nous aideront à concevoir un outil qui répond à tes vrais besoins.
            Environ 5 minutes. Tu peux répondre sans t’inscrire au bêta test.
          </p>
        </header>

        {submitted ? (
          <div className="survey-success" role="status">
            <span className="survey-success__icon">
              <CheckCircle2 aria-hidden="true" />
            </span>
            <p className="survey-success__eyebrow">Réponse enregistrée</p>
            <h3>Merci de nous aider à améliorer Jobinz.</h3>
            <p>
              {formData.wantsToTest
                ? `Ta demande pour tester l’application est notée. Nous pourrons te recontacter à ${formData.email}.`
                : 'Ta réponse a été enregistrée sans adresse e-mail.'}
            </p>
            <button type="button" className="survey-reset" onClick={resetForm}>
              Envoyer une autre réponse
            </button>
          </div>
        ) : (
          <form
            onSubmit={event => event.preventDefault()}
            className="survey-form"
            noValidate
          >
            <Stepper
              key={stepperKey}
              initialStep={1}
              onStepChange={step => {
                setCurrentStep(step);
                setResponseError('');
              }}
              onFinalStepCompleted={handleSubmit}
              onInvalid={() => setResponseError(getStepError(currentStep))}
              canContinue={!getStepError(currentStep)}
              errorMessage={responseError}
              isSubmitting={isSubmitting}
              backButtonText="Retour"
              nextButtonText="Continuer"
              indicator="numbers"
              orientation="horizontal"
              transition="slide"
              width="100%"
              radius={24}
              frame
              linear
              showFooter
              completeButtonText="Envoyer mes réponses"
            >
              <Step title={STEPS[0].title} description={STEPS[0].description}>
                <div className="survey-fields">
                  <div className="survey-grid survey-grid--two">
                    <Field label="Quel est ton niveau d’études ?" >
                      <select
                        value={formData.studyLevel}
                        onChange={event => updateField('studyLevel', event.target.value)}
                      >
                        <option value="">Choisir une option</option>
                        {STUDY_LEVELS.map(option => <option key={option}>{option}</option>)}
                      </select>
                    </Field>
                    <Field label="Dans quel domaine étudies-tu ?">
                      <select
                        value={formData.fieldOfStudy}
                        onChange={event => updateField('fieldOfStudy', event.target.value)}
                      >
                        <option value="">Choisir un domaine</option>
                        {STUDY_FIELDS.map(option => <option key={option}>{option}</option>)}
                      </select>
                    </Field>
                    <Field label="Quel poste ou domaine de stage vises-tu ?">
                      <input
                        type="text"
                        maxLength={180}
                        placeholder="Ex. : développeur web, contrôle de gestion…"
                        value={formData.targetRole}
                        onChange={event => updateField('targetRole', event.target.value)}
                      />
                    </Field>
                    <Field label="Quand souhaites-tu commencer ?">
                      <select
                        value={formData.targetStart}
                        onChange={event => updateField('targetStart', event.target.value)}
                      >
                        <option value="">Choisir une période</option>
                        <option>Dans moins d’un mois</option>
                        <option>Dans 1 à 3 mois</option>
                        <option>Dans 3 à 6 mois</option>
                        <option>Dans plus de 6 mois</option>
                        <option>Je ne sais pas encore</option>
                      </select>
                    </Field>
                    <Field label="École ou université" hint="Facultatif">
                      <input
                        type="text"
                        maxLength={180}
                        placeholder="Le nom de ton établissement"
                        value={formData.schoolName}
                        onChange={event => updateField('schoolName', event.target.value)}
                      />
                    </Field>
                    <Field label="Ville de recherche" hint="Facultatif">
                      <input
                        type="text"
                        maxLength={120}
                        placeholder="Ville ou recherche à distance"
                        value={formData.city}
                        onChange={event => updateField('city', event.target.value)}
                      />
                    </Field>
                  </div>
                </div>
              </Step>

              <Step title={STEPS[1].title} description={STEPS[1].description}>
                <div className="survey-fields">
                  <Field label="Où en es-tu dans ta recherche ?">
                    <ChoiceCards
                      name="searchStatus"
                      options={SEARCH_STATUSES}
                      value={formData.searchStatus}
                      onChange={value => updateField('searchStatus', value)}
                      columns={2}
                    />
                  </Field>

                  <div className="survey-grid survey-grid--three">
                    <Field label="Combien de temps y consacres-tu par semaine ?">
                      <ChoiceCards
                        name="timeSpent"
                        options={['Moins de 2 h', '2 à 5 h', '6 à 10 h', 'Plus de 10 h']}
                        value={formData.timeSpent}
                        onChange={value => updateField('timeSpent', value)}
                      />
                    </Field>
                    <Field label="Combien de candidatures as-tu envoyées le mois dernier ?">
                      <ChoiceCards
                        name="applicationsLastMonth"
                        options={['Aucune', '1 à 5', '6 à 15', '16 ou plus']}
                        value={formData.applicationsLastMonth}
                        onChange={value => updateField('applicationsLastMonth', value)}
                      />
                    </Field>
                    <Field label="Combien d’entretiens as-tu obtenus le mois dernier ?">
                      <ChoiceCards
                        name="interviewsLastMonth"
                        options={['Aucun', '1', '2 à 3', '4 ou plus', 'Je préfère ne pas répondre']}
                        value={formData.interviewsLastMonth}
                        onChange={value => updateField('interviewsLastMonth', value)}
                      />
                    </Field>
                  </div>

                  <Field label="Quel est le principal obstacle pour toi ?">
                    <ChoiceCards
                      name="mainObstacle"
                      options={OBSTACLES}
                      value={formData.mainObstacle}
                      onChange={value => updateField('mainObstacle', value)}
                      columns={2}
                    />
                  </Field>

                  <Field label="Par quels canaux cherches-tu des offres ?" hint="Plusieurs choix possibles">
                    <ChoiceCards
                      name="searchChannels"
                      options={SEARCH_CHANNELS}
                      value={formData.searchChannels}
                      onChange={value => toggleSelection('searchChannels', value)}
                      multiple
                      columns={2}
                    />
                  </Field>
                </div>
              </Step>

              <Step title={STEPS[2].title} description={STEPS[2].description}>
                <div className="survey-fields">
                  <Field label="Quelles fonctions t’aideraient le plus ?" hint="Choisis jusqu’à 3 priorités">
                    <ChoiceCards
                      name="priorityFeatures"
                      options={PRIORITY_FEATURES}
                      value={formData.priorityFeatures}
                      onChange={value => toggleSelection('priorityFeatures', value, 3)}
                      multiple
                      columns={2}
                    />
                  </Field>

                  <Field label="Qu’est-ce qui te ferait hésiter à utiliser un assistant IA ?">
                    <ChoiceCards
                      name="trustConcern"
                      options={TRUST_CONCERNS}
                      value={formData.trustConcern}
                      onChange={value => updateField('trustConcern', value)}
                      columns={2}
                    />
                  </Field>

                  <Field label="Quel modèle de prix te conviendrait le mieux ?">
                    <ChoiceCards
                      name="pricingPreference"
                      options={PRICE_PREFERENCES}
                      value={formData.pricingPreference}
                      onChange={value => updateField('pricingPreference', value)}
                      columns={2}
                    />
                  </Field>

                  <Field label="Y a-t-il un besoin important que nous n’avons pas cité ?" hint="Facultatif">
                    <textarea
                      rows={3}
                      maxLength={2000}
                      placeholder="Décris une difficulté ou une fonction que tu aimerais vraiment avoir."
                      value={formData.otherNeed}
                      onChange={event => updateField('otherNeed', event.target.value)}
                    />
                  </Field>
                </div>
              </Step>

              <Step title={STEPS[3].title} description={STEPS[3].description}>
                <div className="survey-fields">
                  <Field label="Souhaites-tu faire partie des premiers testeurs de Jobinz ?">
                    <ChoiceCards
                      name="wantsToTest"
                      options={[
                        { value: 'yes', label: 'Oui, je veux tester l’application en avant-première.' },
                        { value: 'no', label: 'Pas pour le moment ; je souhaite répondre sans être recontacté(e).' }
                      ]}
                      value={formData.wantsToTest === null ? '' : formData.wantsToTest ? 'yes' : 'no'}
                      onChange={value => {
                        const wantsToTest = value === 'yes';
                        setFormData(previous => ({
                          ...previous,
                          wantsToTest,
                          ...(wantsToTest ? {} : {
                            fullName: '',
                            email: '',
                            contactConsent: false
                          })
                        }));
                        setResponseError('');
                      }}
                      columns={1}
                    />
                  </Field>

                  {formData.wantsToTest && (
                    <div className="survey-grid survey-grid--two survey-contact">
                      <Field label="Ton prénom ou nom" hint="Facultatif">
                        <input
                          type="text"
                          maxLength={120}
                          autoComplete="name"
                          placeholder="Comment pouvons-nous t’appeler ?"
                          value={formData.fullName}
                          onChange={event => updateField('fullName', event.target.value)}
                        />
                      </Field>
                      <Field label="Ton adresse e-mail">
                        <input
                          type="email"
                          maxLength={254}
                          autoComplete="email"
                          placeholder="toi@exemple.fr"
                          value={formData.email}
                          onChange={event => updateField('email', event.target.value)}
                        />
                      </Field>
                      <label className="survey-consent survey-consent--contact">
                        <input
                          type="checkbox"
                          checked={formData.contactConsent}
                          onChange={event => updateField('contactConsent', event.target.checked)}
                        />
                        <span>
                          J’accepte d’être contacté(e) à cette adresse au sujet du bêta test de Jobinz.
                        </span>
                      </label>
                    </div>
                  )}

                  <Field label="Un dernier commentaire ?" hint="Facultatif">
                    <textarea
                      rows={3}
                      maxLength={2000}
                      placeholder="Une remarque, une attente ou une question à partager ?"
                      value={formData.additionalFeedback}
                      onChange={event => updateField('additionalFeedback', event.target.value)}
                    />
                  </Field>

                  <label className="survey-consent">
                    <input
                      type="checkbox"
                      checked={formData.consentResearch}
                      onChange={event => updateField('consentResearch', event.target.checked)}
                    />
                    <span>
                      J’accepte l’enregistrement de mes réponses dans le fichier Excel de l’étude afin d’améliorer Jobinz.
                      Mon e-mail est enregistré uniquement si je choisis de devenir testeur.
                    </span>
                  </label>
                  <p className="survey-privacy-note">
                    Les réponses sont écrites dans le fichier Excel du projet, sur l’ordinateur qui héberge le serveur de développement Vite. Aucun service externe ni base de données n’est utilisé.
                  </p>
                </div>
              </Step>
            </Stepper>
          </form>
        )}

      
      </div>
    </section>
  );
}
