// Data directly inspired by Yassir Msaad's SNEE presentation & Aurore's mentor feedback

export const AI_AGENTS = [
  {
    id: 'orion',
    name: 'Orion',
    codeName: 'Orchestration Agent',
    role: 'Chef d\'orchestre du parcours',
    description: 'Coordonne l\'ensemble des 5 agents spécialisés, planifie les étapes, gère le flux de données et garantit qu\'aucun point de contact n\'est oublié.',
    color: 'from-indigo-500 to-indigo-600',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    avatar: '🧭',
    status: 'Actif en continu',
    sampleAction: 'Synchronisation des 5 agents pour Sara (M1 Informatique) · Déclenchement de l\'analyse de marché.',
    capabilities: [
      'Orchestration multi-agents asynchrone',
      'Contrôle qualité avant soumission',
      'Suivi des jalons et relances automatisées',
      'Synthèse globale pour le tableau de bord'
    ]
  },
  {
    id: 'atlas',
    name: 'Atlas',
    codeName: 'Profile Agent',
    role: 'Expert Carrière & Compétences',
    description: 'Analyse en profondeur ton parcours académique, tes projets GitHub/scolaires, tes hard & soft skills, et tes critères géographiques et sectoriels.',
    color: 'from-indigo-500 to-violet-500',
    badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    avatar: '👤',
    status: 'Profil 100% calibré',
    sampleAction: 'Extraction des compétences clés : Python, Machine Learning, SQL · Détection des axes à fort potentiel.',
    capabilities: [
      'Parsing de CV multimodal (PDF, LinkedIn, GitHub)',
      'Détection automatique des compétences sous-estimées',
      'Définition des critères idéaux de stage',
      'Mise à jour incrémentale continue'
    ]
  },
  {
    id: 'scout',
    name: 'Scout',
    codeName: 'Job Search Agent',
    role: 'Traqueur d\'Opportunités & Veilleur',
    description: 'Collecte et filtre les offres d\'emploi en temps réel sur des dizaines de plateformes (Jobboards, sites carrières d\'entreprises, réseaux professionnels et marché caché).',
    color: 'from-emerald-500 to-teal-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    avatar: '🔍',
    status: '124 offres scannées / jour',
    sampleAction: 'Scraping intelligent & dédoublonnage de 42 nouvelles offres de stage M1 Data / Web en Île-de-France.',
    capabilities: [
      'Veille multi-sources 24/7 (Indeed, WTTJ, LinkedIn, Career sites)',
      'Élimination automatique des fausses offres de stage',
      'Filtrage selon la date de publication et la localisation',
      'Alertes instantanées dès parution'
    ]
  },
  {
    id: 'nexus',
    name: 'Nexus',
    codeName: 'Matching Agent',
    role: 'Algorithme de Compatibilité & Scoring',
    description: 'Attribue un score de compatibilité précis (ex: 85%) entre ton profil et chaque annonce, identifie les exigences manquantes et te suggère les points à valoriser.',
    color: 'from-purple-500 to-indigo-500',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    avatar: '⚡',
    status: 'Calcul sémantique avancé',
    sampleAction: 'Calcul du match : 85% avec "Stage Data Scientist Junior chez Qonto" · Atouts: Python, SQL · À développer: TensorFlow.',
    capabilities: [
      'Matching sémantique par embeddings vectoriels',
      'Décomposition des exigences requises vs souhaitées',
      'Explication claire du score à l\'étudiant',
      'Recommandations d\'apprentissage rapide'
    ]
  },
  {
    id: 'plume',
    name: 'Plume',
    codeName: 'CV & Lettre Agent',
    role: 'Rédacteur Stratégique Personnalisé',
    description: 'Génère un CV optimisé pour les robots ATS et une lettre de motivation sur-mesure pour chaque entreprise, sans clichés ni phrases génériques.',
    color: 'from-pink-500 to-rose-500',
    badgeBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    avatar: '✍️',
    status: 'Format ATS compliant',
    sampleAction: 'Rédaction d\'une lettre contextualisée valorisant le projet M1 IA de Sara et alignée sur la culture de l\'entreprise cible.',
    capabilities: [
      'Alignement sémantique avec les mots-clés de l\'annonce',
      'Ton professionnel, concis et adapté à l\'industrie',
      'Mise en page épurée compatible 100% ATS',
      'Export PDF prêt en un clic'
    ]
  },
  {
    id: 'hermes',
    name: 'Hermes',
    codeName: 'Email & Relay Agent (NOUVEAU)',
    role: 'Ambassadeur & Envoi aux RH',
    description: 'Identifie le bon recruteur ou responsable RH, prépare l\'e-mail d\'accompagnement et gère l\'envoi DIRECT. L\'étudiant valide toujours chaque envoi avant le départ.',
    color: 'from-indigo-500 to-indigo-600',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    avatar: '📬',
    status: 'Validation étudiant requise',
    sampleAction: 'Email prêt pour "talent@startup.io". Objet percutant. En attente du feu vert de Sara avant transmission.',
    capabilities: [
      'Détection automatique de l\'adresse de contact RH',
      'Objet d\'email calibré pour un taux d\'ouverture > 60%',
      'Bouton de validation obligatoire par l\'étudiant',
      'Accusé de réception & relance planifiée'
    ]
  }
];

export const OBSTACLES = [
  {
    number: '01',
    title: 'Offres dispersées',
    description: 'Des dizaines de sites à consulter (LinkedIn, Indeed, Welcome to the Jungle, Monster...). Une perte de temps épuisante chaque jour.',
    icon: 'Layers',
    stat: '15+ sites visités / semaine',
  },
  {
    number: '02',
    title: 'Mauvais ciblage',
    description: 'Des offres qui ne correspondent pas au niveau réel d\'études (offres juniors demandant 3 ans d\'expérience). Déceptions garanties.',
    icon: 'Target',
    stat: '72% des annonces hors-cible',
  },
  {
    number: '03',
    title: 'CV & Lettre non adaptés',
    description: 'Une lettre et un CV à réécrire pour chaque candidature. Répéter le même effort pour 50 entreprises conduit au découragement.',
    icon: 'FileText',
    stat: '45 min gaspillées / candidature',
  },
  {
    number: '04',
    title: 'Suivi perdu',
    description: 'Dates limites oubliées, candidatures fantômes, aucune relance au bon moment, pas de vue d\'ensemble sur les retours.',
    icon: 'Clock',
    stat: '80% des candidatures sans suivi',
  }
];

export const MARKET_STATS = [
  {
    value: '3,05 M',
    label: 'Étudiants inscrits',
    sublabel: 'Dans l\'enseignement supérieur en 2025-2026 (+1,1 % en un an)',
    source: 'MESRE-SIES, Note flash n°17 (juillet 2026)',
    highlight: true,
  },
  {
    value: '21,0 %',
    label: 'Chômage des 15-24 ans',
    sublabel: 'Au 3e trimestre 2026, contre 8,2 % pour l\'ensemble de la population',
    source: 'Insee, Informations rapides n°270 (10 nov. 2026)',
    highlight: false,
  },
  {
    value: '1,67 M',
    label: 'Étudiants à l\'université',
    sublabel: 'Le plus grand groupe d\'étudiants à accompagner dans leur recherche de stage',
    source: 'MESRE-SIES · Données officielles',
    highlight: false,
  }
];

export const STUDENT_JOURNEY_STEPS = [
  {
    step: 1,
    title: 'Profil',
    agent: 'Atlas',
    detail: 'Renseigné une seule fois : cursus, compétences, ambitions.',
    badge: '1 seule fois'
  },
  {
    step: 2,
    title: 'Recherche',
    agent: 'Scout',
    detail: 'Scan permanent du web pour dénicher les offres parfaites.',
    badge: 'Multi-sources'
  },
  {
    step: 3,
    title: 'Matching',
    agent: 'Nexus',
    detail: 'Score de compatibilité algorithmique et explications claires.',
    badge: 'Score %'
  },
  {
    step: 4,
    title: 'CV + Lettre',
    agent: 'Plume',
    detail: 'Génération instantanée adaptée aux mots-clés du recruteur.',
    badge: 'Sur-mesure'
  },
  {
    step: 5,
    title: 'Envoi E-mail',
    agent: 'Hermes',
    detail: 'Validation en 1 clic par l\'étudiant avant transmission au RH.',
    badge: 'Contrôle total'
  },
  {
    step: 6,
    title: 'Suivi',
    agent: 'Orion',
    detail: 'Tableau de bord centralisé, rappels d\'entretiens et relances.',
    badge: 'Vue 360°'
  }
];

export const JOBINZ_FEATURES = [
  {
    feature: 'Offres rassemblées au même endroit',
    icon: 'search',
    note: 'Retrouve les opportunités de plusieurs jobboards au même endroit'
  },
  {
    feature: 'Matching selon le profil réel & compétences',
    icon: 'profile',
    note: 'Analyse sémantique fine des projets et cours suivis'
  },
  {
    feature: 'CV & Lettre adaptés automatiquement',
    icon: 'documents',
    note: 'Générés à la volée pour chaque fiche de poste'
  },
  {
    feature: 'Envoi automatisé via e-mail avec validation étudiant',
    icon: 'send',
    note: 'Hermes transmet directement au recruteur avec ton accord'
  },
  {
    feature: 'Suivi des candidatures et relances',
    icon: 'tracking',
    note: 'Visualise tes démarches et les prochaines étapes depuis un seul espace'
  },
  {
    feature: 'Coordination de 6 agents IA spécialisés',
    icon: 'agents',
    note: 'Des agents spécialisés se coordonnent à chaque étape de ta recherche'
  }
];

export const PRICING_TIERS = [
  {
    id: 'freemium',
    title: 'Freemium Étudiant',
    price: '0 €',
    period: 'Gratuit pour toujours',
    description: 'L\'essentiel pour démarrer sereinement et découvrir la puissance de Jobinz.',
    features: [
      'Création et scan du profil complet (Atlas)',
      'Recherche et agrégation d\'offres (Scout)',
      'Jusqu\'à 5 matchings précis par mois',
      'Tableau de bord de suivi basique',
      'Support communautaire'
    ],
    cta: 'Démarrer gratuitement',
    popular: false,
  },
  {
    id: 'premium',
    title: 'Premium Étudiant',
    price: '4,99 €',
    period: 'par mois (sans engagement)',
    description: 'Le turbo complet pour décrocher le stage de tes rêves en un temps record.',
    features: [
      'Matchings illimités avec explication détaillée (Nexus)',
      'Génération illimitée de CV et lettres ATS (Plume)',
      'Envoi e-mail direct aux RH avec validation (Hermes)',
      'Alertes prioritaires marchés cachés & startups',
      'Préparation aux entretiens personnalisée par IA',
      'Accès prioritaire aux recruteurs partenaires'
    ],
    cta: 'Accès Beta Prioritaire',
    popular: true,
  },
  {
    id: 'b2b-ecoles',
    title: 'B2B Écoles & Universités',
    price: 'Sur devis',
    period: 'Licence annuelle par établissement',
    description: 'Pour les services carrières et responsables d\'insertion professionnelle.',
    features: [
      'Tableau de bord de suivi de l\'insertion par filière',
      'Statistiques d\'employabilité en temps réel',
      'Aide aux étudiants en difficulté de recherche',
      'Mise en relation directe avec les entreprises partenaires',
      'Conformité RGPD et hébergement souverain'
    ],
    cta: 'Demander une démo école',
    popular: false,
  }
];

