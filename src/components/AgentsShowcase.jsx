import React, { useState } from 'react';
import { ArrowUpRight, Bookmark } from 'lucide-react';
import { AI_AGENTS } from '../data/mockData';
import SpotlightCard from './SpotlightCard';
import './AgentsShowcase.css';

function AgentCard({ agent, index }) {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <SpotlightCard
      className="agent-card"
      theme="dark"
      spotlightColor="#ffffff"
      intensity={0.15}
      spotlightSize={240}
      softness={0.7}
      shape="circle"
      borderGlow={0.6}
      proximity={80}
      smoothing={0.3}
      grain={0}
      ambient={false}
      flare
    >
      <div className="agent-card-top">
        <span className="agent-avatar" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <button
          type="button"
          className="agent-open-button"
          onClick={() => setExpanded(open => !open)}
          aria-label={`${expanded ? 'Masquer' : 'Afficher'} les détails de ${agent.name}`}
          aria-expanded={expanded}
        >
          <ArrowUpRight aria-hidden="true" />
        </button>
      </div>

      <h3 className="agent-card-name">{agent.name}</h3>
      <p className="agent-card-role">{agent.role}</p>

      <div className="agent-card-tags" aria-label="Compétences principales">
        {[agent.codeName, ...agent.capabilities.slice(0, 1)].map(tag => (
          <span key={tag} title={tag}>{tag}</span>
        ))}
      </div>

      <div className="agent-card-metrics">
        <div>
          <strong>{String(agent.capabilities.length).padStart(2, '0')}</strong>
          <span>Capacités</span>
        </div>
        <div>
          <strong>01</strong>
          <span>Mission</span>
        </div>
        <div className="agent-card-status">
          <strong title={agent.status}>{agent.status}</strong>
          <span>Statut</span>
        </div>
      </div>

      <div className="agent-card-actions">
        <button
          type="button"
          className="agent-primary-action"
          onClick={() => setExpanded(open => !open)}
          aria-expanded={expanded}
        >
          {expanded ? 'Réduire les détails' : 'Découvrir l’agent'}
        </button>
        <button
          type="button"
          className={`agent-save-action${saved ? ' is-saved' : ''}`}
          onClick={() => setSaved(value => !value)}
          aria-label={`${saved ? 'Retirer' : 'Ajouter'} ${agent.name} ${saved ? 'des' : 'aux'} favoris`}
          aria-pressed={saved}
        >
          <Bookmark aria-hidden="true" fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {expanded && (
        <div className="agent-card-details">
          <p>{agent.description}</p>
          <span className="agent-details-label">Capacités de l’agent</span>
          <ul>
            {agent.capabilities.map(capability => <li key={capability}>{capability}</li>)}
          </ul>
          <span className="agent-details-label">Exemple d’action</span>
          <p>{agent.sampleAction}</p>
        </div>
      )}
    </SpotlightCard>
  );
}

export default function AgentsShowcase() {
  return (
    <section id="agents" className="agents-section">
      <div className="agents-shell">
        <header className="agents-header">
          <span className="agents-eyebrow">Une équipe, six expertises</span>
          <h2 className="agents-title">
            6 agents IA.
            <span>Un parcours orchestré en continu.</span>
          </h2>
          <p className="agents-intro">
            Chaque agent maîtrise une étape précise de ta recherche. Ensemble, ils t’accompagnent du profil jusqu’à la candidature.
          </p>
        </header>

        <div className="agents-grid">
          {AI_AGENTS.map((agent, index) => (
            <AgentCard key={agent.id} agent={agent} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
