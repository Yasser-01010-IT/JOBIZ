import React from 'react';
import { MARKET_STATS } from '../data/mockData';
import './MarketStats.css';

const ROMAN_NUMERALS = ['I', 'II', 'III'];

function formatStatValue(value) {
  const match = value.match(/^(.*)\s(M|%)$/);

  if (!match) return value;

  return (
    <>
      {match[1]}
      <span className="market-stat-value__unit"> {match[2]}</span>
    </>
  );
}

export default function MarketStats() {
  return (
    <section className="market-section">
      <div className="market-shell">
        <header className="market-header">
          <h2 className="market-title">
            Trois millions d’étudiants.
            <span>Un enjeu qui nous concerne tous.</span>
          </h2>
          <p className="market-intro">
            Les chiffres du marché montrent l’urgence de rendre la recherche du premier stage plus accessible et mieux accompagnée.
          </p>
        </header>

        <div className="market-stats-grid">
          {MARKET_STATS.map((stat, index) => (
            <article
              key={stat.label}
              className={`market-stat-card${stat.highlight ? ' market-stat-card--featured' : ''}`}
            >
              <div className="market-stat-top">
                <span className="market-stat-index">{ROMAN_NUMERALS[index] ?? index + 1}</span>
                {stat.highlight && <span className="market-stat-badge">Cible principale</span>}
              </div>
              <p className="market-stat-value">{formatStatValue(stat.value)}</p>
              <h3>{stat.label}</h3>
              <p className="market-stat-description">{stat.sublabel}</p>
              <div className="market-stat-source">
                <span>Source</span>
                <cite>{stat.source}</cite>
              </div>
            </article>
          ))}
        </div>

        <aside className="market-takeaway">
          <div className="market-takeaway-copy">
            <span className="market-takeaway-label">L’enjeu</span>
            <p>
              <strong>1,67 million d’étudiants à l’université</strong>
              <span>Le plus grand vivier, souvent le moins accompagné dans sa recherche de stage.</span>
            </p>
          </div>
          <a className="market-cta" href="#questionnaire">
            Contribuer à l’étude nationale <span aria-hidden="true">→</span>
          </a>
        </aside>
      </div>
    </section>
  );
}
