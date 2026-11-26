import React from 'react';
import { AlertCircle, Check, Clock, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import SpotlightCard from './SpotlightCard';
import FlipCard from './FlipCard';
import PaperCrumple from './PaperCrumple';
import './CaseStudySara.css';

const COMPARISON = {
  without: {
    title: 'Sans AvenirGo',
    subtitle: 'Parcours classique',
    time: '~18 heures',
    unit: 'par semaine',
    result: "Stress intense, retards sur les projets d'études et baisse de moral.",
    points: [
      {
        title: 'Dizaines de sites éparpillés',
        description: 'Sara passe 3h chaque soir à jongler entre LinkedIn, Indeed, Monster et WTTJ.'
      },
      {
        title: 'Réécriture permanente',
        description: 'Relit chaque annonce et réécrit son CV et sa lettre de motivation à chaque candidature.'
      },
      {
        title: 'Perte de suivi',
        description: 'Aucun outil de suivi, candidatures oubliées, zéros relances au bon interlocuteur.'
      },
      {
        title: 'Découragement',
        description: '50 candidatures envoyées dans le vide pour 2 refus automatiques.'
      }
    ]
  },
  with: {
    title: 'Avec AvenirGo',
    subtitle: 'L’étudiant + 6 agents IA',
    time: '~45 minutes',
    unit: 'par semaine',
    result: '6 entretiens décrochés et du temps pour les réviser.',
    points: [
      {
        title: 'Profil renseigné une seule fois',
        description: 'Atlas extrait ses projets GitHub, compétences (Python, React, SQL) et préférences géographiques.'
      },
      {
        title: 'Offres classées avec un score précis',
        description: 'Nexus note chaque offre (85% de match) et identifie les compétences à valoriser.'
      },
      {
        title: 'CV & lettre sur-mesure',
        description: "Plume génère instantanément les pièces adaptées aux mots-clés de l'entreprise."
      },
      {
        title: 'Validation et envoi direct aux RH',
        description: "Hermes prépare l'email et Sara valide en 1 clic sur son téléphone."
      }
    ]
  }
};

const getRevealProps = (reduceMotion, delay = 0) => reduceMotion
  ? {}
  : {
      initial: { opacity: 0, y: 18 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.15 },
      transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }
    };

function ComparisonFace({ variant }) {
  const isAvenirGo = variant === 'with';
  const content = COMPARISON[variant];

  return (
    <SpotlightCard
      theme="dark"
      spotlightColor="#a78bfa"
      intensity={0.16}
      spotlightSize={300}
      softness={0.82}
      shape="circle"
      borderGlow={0.45}
      proximity={100}
      smoothing={0.25}
      grain={0}
      ambient={false}
      flare
      className="sara-panel"
    >
      <div className="sara-panel-content">
        <div className="sara-panel-heading">
          <div className="sara-panel-identity">
            <div>
              <h3>{content.title}</h3>
              <p>{content.subtitle}</p>
            </div>
          </div>
          <div className="sara-time">
            <Clock aria-hidden="true" />
            <span>
              <strong>{content.time}</strong>
              <small>{content.unit}</small>
            </span>
          </div>
        </div>

        <ul className="sara-points">
          {content.points.map(point => (
            <li key={point.title}>
              <span className={`sara-point-icon${isAvenirGo ? ' sara-point-icon--positive' : ''}`}>
                {isAvenirGo ? <Check aria-hidden="true" /> : <AlertCircle aria-hidden="true" />}
              </span>
              <p>
                <strong>{point.title}</strong>
                <span>{point.description}</span>
              </p>
            </li>
          ))}
        </ul>

        <div className={`sara-result${isAvenirGo ? ' sara-result--positive' : ''}`}>
          <span className="sara-result-label">Résultat</span>
          <p>{content.result}</p>
          {isAvenirGo && <Sparkles aria-hidden="true" />}
        </div>
      </div>
    </SpotlightCard>
  );
}

export default function CaseStudySara() {
  const [viewMode, setViewMode] = React.useState('without');
  const [paperStage, setPaperStage] = React.useState('idle');
  const [paperTriggerKey, setPaperTriggerKey] = React.useState(0);
  const reduceMotion = useReducedMotion();
  const transitionTimer = React.useRef(null);

  React.useEffect(() => () => window.clearTimeout(transitionTimer.current), []);

  const revealAvenirGo = () => {
    setViewMode('with');
    setPaperStage('revealing');
    window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(
      () => setPaperStage('idle'),
      reduceMotion ? 0 : 650
    );
  };

  const selectMode = mode => {
    if (mode === 'with') {
      if (viewMode === 'with' || paperStage !== 'idle') return;
      setPaperStage('crumpling');
      setPaperTriggerKey(key => key + 1);
      return;
    }

    window.clearTimeout(transitionTimer.current);
    setPaperStage('idle');
    setViewMode('without');
  };

  const handlePaperStateChange = state => {
    if (state === 'crumpled' && paperStage === 'crumpling') revealAvenirGo();
  };

  const handlePaperError = error => {
    console.error('PaperCrumple animation failed; showing the AvenirGo comparison without it.', error);
    if (paperStage === 'crumpling') revealAvenirGo();
  };

  return (
    <section id="cas-sara" className="sara-case">
      <div className="sara-case-shell">
        <motion.header className="sara-case-header" {...getRevealProps(reduceMotion)}>
          <h2>
            Cas étudiant : <span>Sara, M1 Informatique</span>
          </h2>
          <p>
            Recherche d’un stage de fin d’études de 6 mois en Développement Web &amp; IA en Île-de-France.
          </p>
        </motion.header>

        <div
          className="sara-comparison-switch"
          role="group"
          aria-label="Choisir le parcours à afficher"
          aria-busy={paperStage === 'crumpling' || paperStage === 'revealing'}
        >
          {[
            { id: 'without', label: 'Sans AvenirGo' },
            { id: 'with', label: 'Avec AvenirGo · 6 agents IA' }
          ].map(option => (
            <button
              key={option.id}
              type="button"
              aria-pressed={viewMode === option.id}
              className={viewMode === option.id ? 'is-selected' : ''}
              disabled={option.id === 'with' && paperStage !== 'idle'}
              onClick={() => selectMode(option.id)}
            >
              {viewMode === option.id && (
                <motion.span
                  className="sara-switch-indicator"
                  layoutId="sara-switch-indicator"
                  transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span>{option.label}</span>
            </button>
          ))}
        </div>

        <motion.div className="sara-card-stage" {...getRevealProps(reduceMotion, 0.08)}>
          <FlipCard
            front={<ComparisonFace variant="without" />}
            back={<ComparisonFace variant="with" />}
            flipped={viewMode === 'with'}
            onFlipChange={flipped => setViewMode(flipped ? 'with' : 'without')}
            axis="y"
            flipOnClick={false}
            keyboardFlip={false}
            draggable={false}
            tilt
            glare
            glareOpacity={0.14}
            hoverScale={1.015}
            perspective={1100}
            stiffness={170}
            damping={20}
            width={840}
            height={520}
            radius={24}
            background="#0b1220"
            color="#f5f8ff"
            shadow
            shadowColor="#000000"
            shadowOpacity={0.42}
            disabled={paperStage === 'crumpling'}
            ariaLabel={`${COMPARISON[viewMode].title}. Utilisez les boutons de comparaison pour changer de parcours.`}
            className={`sara-flip-card${paperStage === 'crumpling' ? ' sara-flip-card--crumpling' : ''}`}
          />
          {paperStage !== 'idle' && (
            <div
              className={`sara-crumple-overlay${paperStage === 'revealing' ? ' sara-crumple-overlay--leaving' : ''}`}
              aria-hidden="true"
            >
              <PaperCrumple
                src="/sara-without-card.svg"
                alt="Carte Sans AvenirGo qui se froisse"
                width={840}
                height={520}
                sceneHeight="100%"
                releaseBehavior="stay"
                crumpleAmount={0.85}
                crumpleDuration={reduceMotion ? 0 : 0.55}
                releaseDuration={0.4}
                foldCount={6}
                foldSharpness={0.6}
                wrinkleDepth={0.65}
                creaseStrength={0.18}
                paperColor="#0b1220"
                paperTexture={0.08}
                draggable={false}
                returnToOrigin
                imageFit="contain"
                roughness={0.92}
                lightIntensity={1.8}
                lightAngle={-35}
                shadow
                shadowOpacity={0.16}
                seed={7}
                detail={64}
                decorative
                triggerKey={paperTriggerKey}
                onStateChange={handlePaperStateChange}
                onError={handlePaperError}
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
