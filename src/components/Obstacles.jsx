import React, { useEffect, useRef, useState } from 'react';
import { OBSTACLES } from '../data/mockData';
import './Obstacles.css';

export default function Obstacles() {
  const [selectedObstacle, setSelectedObstacle] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (selectedObstacle && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, [selectedObstacle]);

  return (
    <section id="obstacles" className="obstacles-section">
      <div className="obstacles-shell">
        <header className="obstacles-header">
          <h2 className="obstacles-title">
            Chercher un stage ne devrait pas être un parcours du combattant.
            <span>Voici les 4 obstacles à dépasser.</span>
          </h2>
          <p className="obstacles-intro">
            Des offres dispersées, des candidatures répétitives et un suivi difficile transforment la recherche en travail à plein temps.
          </p>
        </header>

        <div className="obstacles-grid">
          {OBSTACLES.map(obstacle => (
            <button
              key={obstacle.number}
              type="button"
              className="obstacle-card"
              onClick={() => setSelectedObstacle(obstacle)}
              aria-haspopup="dialog"
              aria-label={`Lire le détail de l'obstacle ${obstacle.number} : ${obstacle.title}`}
            >
              <span className="obstacle-card-top">
                <span className="obstacle-number">{obstacle.number}</span>
                <span className="obstacle-open-label">Lire le constat <span aria-hidden="true">↗</span></span>
              </span>
              <span className="obstacle-card-title">{obstacle.title}</span>
              <span className="obstacle-card-description">{obstacle.description}</span>
              <span className="obstacle-card-impact">
                <span className="obstacle-impact-label">Impact observé</span>
                <span className="obstacle-impact-value">{obstacle.stat}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedObstacle && (
        <dialog
          ref={dialogRef}
          className="obstacles-dialog"
          aria-labelledby="obstacle-dialog-title"
          onClose={() => setSelectedObstacle(null)}
          onClick={event => {
            if (event.target === event.currentTarget) event.currentTarget.close();
          }}
        >
          <article className="obstacles-dialog-content">
            <div className="obstacles-dialog-top">
              <span className="obstacles-dialog-number">Obstacle {selectedObstacle.number}</span>
              <button
                type="button"
                className="obstacles-dialog-close"
                onClick={() => dialogRef.current?.close()}
                aria-label="Fermer le détail"
              >
                ×
              </button>
            </div>
            <h2 id="obstacle-dialog-title">{selectedObstacle.title}</h2>
            <p>{selectedObstacle.description}</p>
            <div className="obstacles-dialog-impact">
              <span>Impact observé</span>
              <strong>{selectedObstacle.stat}</strong>
            </div>
          </article>
        </dialog>
      )}
    </section>
  );
}
