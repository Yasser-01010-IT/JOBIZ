import React, { useState } from 'react';
import { Check, Sparkles, Building2, GraduationCap, UserRound } from 'lucide-react';
import { PRICING_TIERS } from '../data/mockData';
import PixelCard from './PixelCard';
import './PricingBusinessModel.css';

const PIXEL_CARD_OPTIONS = {
  colors: ['#ddd6fe', '#a78bfa', '#6366f1'],
  glowColor: '#8b5cf6',
  shape: 'square',
  origin: 'center',
  gap: 5,
  pixelSize: 2,
  speed: 35,
  revealDuration: 600,
  spotlight: 0.5,
  glow: 0.5,
  opacity: 0.22,
  fade: 0.7,
  trigger: 'hover',
  radius: 24,
  clickPulse: true,
  intro: true,
  theme: 'dark'
};

function PricingCard({ tier, onOpenSurvey }) {
  return (
    <PixelCard
      {...PIXEL_CARD_OPTIONS}
      className={`pricing-pixel-card${tier.popular ? ' pricing-pixel-card--featured' : ''}`}
    >
      <div className="pricing-card-content">
        {tier.popular && (
          <span className="pricing-featured-badge">
            <Sparkles aria-hidden="true" />
            Le plus demandé
          </span>
        )}

        <div className="pricing-card-main">
          <div className="pricing-card-heading">
            <h3>{tier.title}</h3>
            <p>{tier.description}</p>
          </div>

          <div className="pricing-price">
            <strong>{tier.price}</strong>
            <span>{tier.period}</span>
          </div>

          <ul className="pricing-features">
            {tier.features.map(feature => (
              <li key={feature}>
                <Check aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <a
          href="#questionnaire"
          onClick={onOpenSurvey}
          className={`pricing-cta${tier.popular ? ' pricing-cta--primary' : ''}`}
        >
          {tier.cta}
        </a>
      </div>
    </PixelCard>
  );
}

function BusinessCard({ type, icon: Icon, title, need, value, revenue }) {
  return (
    <PixelCard {...PIXEL_CARD_OPTIONS} className="pricing-pixel-card pricing-pixel-card--business">
      <div className="pricing-business-content">
        <div className="pricing-business-mark">
          <Icon aria-hidden="true" />
        </div>
        <div>
          <span className="pricing-card-kicker">{type}</span>
          <h3>{title}</h3>
        </div>
        <div className="pricing-business-details">
          <p>
            <strong>Besoin</strong>
            {need}
          </p>
          <p>
            <strong>Ce que AvenirGo apporte</strong>
            {value}
          </p>
        </div>
        <p className="pricing-revenue">
          <span>Modèle de revenu</span>
          {revenue}
        </p>
      </div>
    </PixelCard>
  );
}

export default function PricingBusinessModel({ onOpenSurvey }) {
  const [activeSegment, setActiveSegment] = useState('students');

  return (
    <section id="modele-economique" className="pricing-section">
      <div className="pricing-shell">
        <header className="pricing-header">
          <span className="pricing-eyebrow">
            <Sparkles aria-hidden="true" />
            Modèle économique & viabilité
          </span>
          <h2>
            4 sources de revenus,
            <span>pensées pour durer.</span>
          </h2>
          <p>
            Un modèle équilibré : gratuit pour l’insertion de base des étudiants, monétisé par les fonctionnalités d’accélération et les licences B2B pour universités et recruteurs.
          </p>
        </header>

        <div className="pricing-segment" role="group" aria-label="Choisir une offre">
          <button
            type="button"
            className={activeSegment === 'students' ? 'is-selected' : ''}
            aria-pressed={activeSegment === 'students'}
            onClick={() => setActiveSegment('students')}
          >
            <UserRound aria-hidden="true" />
            <span>Étudiants <small>B2C</small></span>
          </button>
          <button
            type="button"
            className={activeSegment === 'b2b' ? 'is-selected' : ''}
            aria-pressed={activeSegment === 'b2b'}
            onClick={() => setActiveSegment('b2b')}
          >
            <Building2 aria-hidden="true" />
            <span>Écoles & entreprises <small>B2B</small></span>
          </button>
        </div>

        {activeSegment === 'students' ? (
          <div className="pricing-grid">
            {PRICING_TIERS.slice(0, 2).map(tier => (
              <PricingCard key={tier.id} tier={tier} onOpenSurvey={onOpenSurvey} />
            ))}
          </div>
        ) : (
          <div className="pricing-grid">
            <BusinessCard
              type="Écosystème éducatif"
              icon={GraduationCap}
              title="Service carrières — université ou école"
              need="Suivre l’insertion réelle des étudiants et mesurer l’efficacité de l’accompagnement pédagogique."
              value="Un tableau de bord par filière : candidatures envoyées, entretiens obtenus et offres adaptées."
              revenue="Licence annuelle par établissement."
            />
            <BusinessCard
              type="Recrutement responsable"
              icon={Building2}
              title="PME & startups qui recrutent"
              need="Trouver rapidement des profils qualifiés sans recourir à un cabinet de recrutement coûteux."
              value="La mise en avant d’offres et la suggestion de profils compatibles, avec l’accord préalable de l’étudiant."
              revenue="Packs de mise en relation et sponsoring d’annonces."
            />
          </div>
        )}
      </div>
    </section>
  );
}
