import React from 'react';
import { Check, Minus, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { COMPARISON_DATA } from '../data/mockData';
import './Comparison.css';

export default function Comparison() {
  const reduceMotion = useReducedMotion();

  const reveal = delay => reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }
      };

  return (
    <section id="comparatif" className="comparison-section">
      <div className="comparison-shell">
        <motion.header className="comparison-header" {...reveal(0)}>
          <span className="comparison-eyebrow">
            <Sparkles aria-hidden="true" />
            Différenciation stratégique
          </span>
          <h2>
            Plus qu’une liste d’offres.
            <span> Un accompagnement complet.</span>
          </h2>
          <p>
            Les espaces de recherche classiques servent surtout à publier des annonces.
            Jobinz accompagne toute la démarche, de la sélection jusqu’au suivi.
          </p>
        </motion.header>

        <motion.div className="comparison-table-wrap" {...reveal(0.08)}>
          <div className="comparison-table-scroll">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th scope="col">Fonctionnalités clés</th>
                  <th scope="col" className="comparison-classic-column">
                    Recherche classique
                  </th>
                  <th scope="col" className="comparison-jobinz-column">
                    Jobinz
                    <span>6 agents IA</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.map((row, index) => (
                  <motion.tr
                    key={row.feature}
                    {...(reduceMotion
                      ? {}
                      : {
                          initial: { opacity: 0, y: 8 },
                          whileInView: { opacity: 1, y: 0 },
                          viewport: { once: true, amount: 0.3 },
                          transition: { duration: 0.42, delay: 0.12 + index * 0.045 }
                        })}
                  >
                    <td>
                      <strong>{row.feature}</strong>
                      <span>{row.note}</span>
                    </td>
                    <td className="comparison-status-cell comparison-classic-column">
                      {row.linkedin ? (
                        <span className="comparison-status comparison-status--partial" aria-label="Partiellement disponible">
                          <Minus aria-hidden="true" />
                        </span>
                      ) : (
                        <span className="comparison-status comparison-status--missing" aria-label="Non disponible">
                          <Minus aria-hidden="true" />
                        </span>
                      )}
                    </td>
                    <td className="comparison-status-cell comparison-jobinz-column">
                      <span className="comparison-status comparison-status--available" aria-label="Disponible">
                        <Check aria-hidden="true" />
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
