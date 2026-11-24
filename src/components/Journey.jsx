import React from 'react';
import { UserCheck, Search, Zap, FileCheck, MailCheck, BarChart3, ShieldCheck } from 'lucide-react';
import { STUDENT_JOURNEY_STEPS } from '../data/mockData';
import FlipCard from './FlipCard';
import './Journey.css';

const getStepIcon = step => {
  const iconProps = { 'aria-hidden': true };
  switch (step) {
    case 1: return <UserCheck {...iconProps} />;
    case 2: return <Search {...iconProps} />;
    case 3: return <Zap {...iconProps} />;
    case 4: return <FileCheck {...iconProps} />;
    case 5: return <MailCheck {...iconProps} />;
    case 6: return <BarChart3 {...iconProps} />;
    default: return <UserCheck {...iconProps} />;
  }
};

const StepFace = ({ step, back = false }) => (
  <div className={`journey-face${back ? ' journey-face--back' : ' journey-face--front'}`}>
    <div className="journey-face-top">
      <span className="journey-step-number">{String(step.step).padStart(2, '0')}</span>
      <span className="journey-step-badge">{step.badge}</span>
    </div>

    {back ? (
      <>
        <span className="journey-back-eyebrow">Étape {String(step.step).padStart(2, '0')} · Agent spécialisé</span>
        <h3>{step.title}</h3>
        <p className="journey-back-detail">{step.detail}</p>
        <div className="journey-agent-panel">
          <span>Cette étape est gérée par</span>
          <strong>{step.agent}</strong>
        </div>
        {step.step === 5 && (
          <div className="journey-validation-note">
            <ShieldCheck aria-hidden="true" />
            <span>Envoi uniquement après validation de l’étudiant.</span>
          </div>
        )}
        <span className="journey-flip-hint">Cliquer pour revenir</span>
      </>
    ) : (
      <>
        <span className="journey-step-icon">{getStepIcon(step.step)}</span>
        <h3>{step.title}</h3>
        <span className="journey-agent-name">Agent · {step.agent}</span>
        <p className="journey-front-detail">{step.detail}</p>
        {step.step === 5 && (
          <span className="journey-front-validation">
            <ShieldCheck aria-hidden="true" />
            Envoi sous validation
          </span>
        )}
        <span className="journey-flip-hint">Cliquer ou glisser pour découvrir <span aria-hidden="true">↻</span></span>
      </>
    )}
  </div>
);

export default function Journey() {
  return (
    <section id="journey" className="journey-section">
      <div className="journey-shell">
        <header className="journey-header">
          <span className="journey-eyebrow">Workflow étudiant</span>
          <h2 className="journey-title">
            Le parcours de l’étudiant
            <span>en 6 étapes fluides.</span>
          </h2>
          <p className="journey-intro">
            De la définition initiale de tes critères jusqu’au suivi après envoi, l’étudiant est libéré de toutes les tâches répétitives.
          </p>
        </header>

        <div className="journey-grid">
          {STUDENT_JOURNEY_STEPS.map(step => (
            <FlipCard
              key={step.step}
              front={<StepFace step={step} />}
              back={<StepFace step={step} back />}
              axis="y"
              flipOnClick
              draggable
              dragDistance={0}
              tilt
              tiltMax={12}
              glare
              glareOpacity={0.22}
              hoverScale={1.03}
              perspective={1100}
              stiffness={170}
              damping={20}
              width={380}
              height={390}
              radius={24}
              background="#0b1220"
              color="#f5f8ff"
              shadow
              shadowColor="#000000"
              shadowOpacity={0.45}
              ariaLabel={`Étape ${step.step} : ${step.title}. Cliquer ou glisser pour retourner la carte.`}
              className="journey-flip-card"
            />
          ))}
        </div>

      </div>
    </section>
  );
}
