import React from 'react';
import { Flag, CircleDot, ShieldCheck, Users, Rocket, Clock3 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import WebThreads from './WebThreads';
import './RoadmapSNEE.css';

const STEPS = [
  {
    step: '01',
    title: 'Valider le Besoin',
    period: 'Phase actuelle',
    status: 'in_progress',
    icon: Users,
    items: [
      'Diffusion du questionnaire auprès d’étudiants universitaires et d’écoles',
      'Interviews qualitatives de 15 min avec les premiers candidats',
      'Validation des irritants clés : absence de réponse et temps de rédaction',
      'Vérification du nom de marque sur la base de données INPI'
    ]
  },
  {
    step: '02',
    title: 'MVP Fonctionnel',
    period: 'Prochaine étape',
    status: 'pending',
    icon: CircleDot,
    items: [
      'Mise en ligne du module Profil unifié (Atlas)',
      'Moteur de collecte et filtres intelligents (Scout)',
      'Algorithme de calcul du score de matching sémantique (Nexus)',
      'Générateur de CV et lettres de motivation ATS (Plume)'
    ]
  },
  {
    step: '03',
    title: 'Phase Pilote',
    period: 'Bêta fermée',
    status: 'pending',
    icon: Rocket,
    items: [
      'Déploiement auprès de 50 étudiants testeurs sélectionnés',
      'Validation de l’agent Hermes pour l’envoi direct aux RH avec accord',
      'Mesure du taux de conversion et du temps hebdomadaire économisé',
      'Second point d’étape sur Pepitizy avec Aurore et les mentors'
    ]
  },
  {
    step: '04',
    title: 'Lancement & Écosystème',
    period: 'Déploiement',
    status: 'pending',
    icon: Flag,
    items: [
      'Ouverture des abonnements Premium étudiants',
      'Partenariats pilotes avec les services carrières d’universités',
      'Offres sponsorisées pour PME et startups partenaires'
    ]
  }
];

export default function RoadmapSNEE() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="roadmap-section">
      <div className="roadmap-threads" aria-hidden="true">
        <WebThreads
          colors={['#6366f1', '#a78bfa', '#ddd6fe']}
          coreColor="#ffffff"
          backgroundColor="transparent"
          threadCount={6}
          spread={0.18}
          lightMode={false}
          speed={0.2}
          frequency={5}
          taper={1}
          position={0.5}
          pinch={0.5}
          nodes={1}
          angle={0}
          glow={0.02}
          falloff={0.6}
          thickness={1.1}
          brightness={0.6}
          opacity={0.72}
          depth={0}
          pulses={0}
          mirror
          shimmer={false}
          fade={0}
          grain={0.04}
          intro
          mouseInteraction
          mouseStrength={0.35}
          pulseOnClick
          paused={reduceMotion}
          dpr={1.5}
        />
      </div>

      <div className="roadmap-shell">
        <motion.header
          className="roadmap-header"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="roadmap-eyebrow">
            <ShieldCheck aria-hidden="true" />
            Feuille de route & engagement SNEE
          </span>
          <h2>
            Prochaines étapes :
            <span>du terrain au lancement.</span>
          </h2>
          <p>
            Une progression par étapes pour confronter l’idée aux besoins réels avant tout développement à grande échelle.
          </p>
        </motion.header>

        <div className="roadmap-grid">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCurrent = step.status === 'in_progress';
            return (
              <motion.article
                key={step.step}
                className={`roadmap-card${isCurrent ? ' roadmap-card--current' : ' roadmap-card--pending'}`}
                aria-label={`Étape ${step.step} : ${step.title}, ${isCurrent ? 'en cours' : 'à venir'}`}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={reduceMotion ? undefined : { opacity: isCurrent ? 1 : 0.58, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.48, delay: reduceMotion ? 0 : index * 0.08 }}
              >
                {!isCurrent && <span className="roadmap-upcoming-label">À venir</span>}
                <div className="roadmap-card-top">
                  <span className="roadmap-step-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <span className={`roadmap-period${isCurrent ? ' roadmap-period--current' : ''}`}>
                    {step.period}
                  </span>
                </div>

                <div className="roadmap-card-title">
                  <span>Jalon {step.step}</span>
                  <h3>{step.title}</h3>
                </div>

                <ul className="roadmap-items">
                  {step.items.map(item => (
                    <li key={item}>
                      <span aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent && (
                  <div className="roadmap-current-status">
                    <span className="roadmap-status-dot" />
                    <span>Enquête actuellement ouverte</span>
                  </div>
                )}
                {!isCurrent && (
                  <div className="roadmap-pending-status">
                    <Clock3 aria-hidden="true" />
                    À planifier
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
