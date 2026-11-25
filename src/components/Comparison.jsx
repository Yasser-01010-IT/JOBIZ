import React from 'react';
import { BarChart3, FileCheck, MailCheck, Search, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { JOBINZ_FEATURES } from '../data/mockData';
import './Comparison.css';

const featureIcons = {
  search: Search,
  profile: UserCheck,
  documents: FileCheck,
  send: MailCheck,
  tracking: BarChart3,
  agents: ShieldCheck
};

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
    <section id="accompagnement" className="comparison-section">
      <div className="comparison-shell">
        <motion.header className="comparison-header" {...reveal(0)}>
          <span className="comparison-eyebrow">
            <Sparkles aria-hidden="true" />
            Ce que Jobinz t’apporte
          </span>
          <h2>
            Ta recherche de stage,
            <span> accompagnée de A à Z.</span>
          </h2>
          <p>
            Des offres pertinentes, des candidatures personnalisées et un suivi clair — avec toi aux commandes à chaque étape.
          </p>
        </motion.header>

        <motion.div className="comparison-table-wrap" {...reveal(0.08)}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col">Les services Jobinz</th>
                <th scope="col">Ce que ça t’apporte</th>
              </tr>
            </thead>
            <tbody>
              {JOBINZ_FEATURES.map((feature, index) => {
                const Icon = featureIcons[feature.icon];

                return (
                  <motion.tr
                    key={feature.feature}
                    {...(reduceMotion
                      ? {}
                      : {
                          initial: { opacity: 0, y: 8 },
                          whileInView: { opacity: 1, y: 0 },
                          viewport: { once: true, amount: 0.3 },
                          transition: { duration: 0.42, delay: 0.1 + index * 0.045 }
                        })}
                  >
                    <td>
                      <span className="comparison-feature-name">
                        <span className="comparison-feature-icon">
                          <Icon aria-hidden="true" />
                        </span>
                        <strong>{feature.feature}</strong>
                      </span>
                    </td>
                    <td>{feature.note}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
