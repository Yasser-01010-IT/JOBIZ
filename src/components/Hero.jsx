import React from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Check,
  Globe,
  Sparkles,
  Zap
} from 'lucide-react';
import Hyperspeed from './Hyperspeed';
import './HeroShowcase.css';

export default function Hero({ onOpenSurvey }) {
  return (
    <section className="relative overflow-hidden pt-0">
      
      {/* ============================================================== */}
      {/* HYPERSPEED 3D BACKGROUND WITH CENTERED HERO CONTENT            */}
      {/* ============================================================== */}
      <div className="hero-stage relative w-full overflow-hidden border-b border-white/10">
        <Hyperspeed
          curve="winding"
          curvature={1}
          speed={1}
          boost={3}
          fov={90}
          boostFov={130}
          lanes={3}
          roadWidth={10}
          medianWidth={2}
          density={40}
          trailLength={1}
          lightSize={1}
          poles={20}
          dust={100}
          glow={0.6}
          reflections={0.5}
          roadOpacity={0.24}
          steer={0.35}
          tailColors={["#6366f1", "#4f46e5", "#8b5cf6"]}
          headColors={["#8b5cf6", "#6366f1", "#3730a3"]}
          poleColors={["#6366f1"]}
          interactive
          roadColor="#08080a"
          lineColor="#25252d"
        />

        {/* Centered hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 z-10 pointer-events-none">
          
          <h1 className="mt-4 sm:mt-6 font-sans text-[clamp(2.75rem,5vw,5.5rem)] text-white font-normal tracking-[-0.045em] max-w-[18ch] leading-[1.04]">
            Trouver ton stage ne devrait plus être un <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-500">parcours du combattant</span>.
          </h1>

          <p className="font-sans italic text-base sm:text-lg lg:text-xl text-slate-200 mt-6 max-w-[58ch] leading-relaxed">
            AvenirGo orchestre six intelligences artificielles complémentaires pour profiler vos atouts, dénicher les opportunités cachées et envoyer vos candidatures sur-mesure.
          </p>

          {/* Center Call to Actions */}
          <div className="pointer-events-auto flex flex-col sm:flex-row items-center gap-4 mt-8">
            <a
              href="#questionnaire"
              onClick={onOpenSurvey}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white font-sans font-bold text-sm sm:text-base shadow-2xl shadow-brand-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 group"
            >
              <span>Participer à l'étude & Tester l'IA</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#agents"
              className="px-7 py-4 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 font-sans font-semibold text-sm border border-indigo-200 hover:border-indigo-400 shadow-sm hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Découvrir les 6 Agents IA
            </a>
          </div>

        </div>
      </div>

      <div className="showcase-section">
        <div className="showcase-shell">
          <div className="showcase-heading">
            <div className="showcase-heading-copy">
              <div className="showcase-eyebrow">
                <Sparkles aria-hidden="true" />
                <span>AvenirGo · L’espace de ta recherche</span>
              </div>
              <h2 className="showcase-title">
                Le bon stage.
                <span>Une recherche orchestrée de bout en bout.</span>
              </h2>
              <p className="showcase-intro">
                Six agents spécialisés travaillent ensemble pour transformer chaque étape de ta recherche en un parcours clair, ciblé et maîtrisé.
              </p>
            </div>
          </div>

          <div className="showcase-grid">
            <article className="showcase-card showcase-card--journey">
              <div className="showcase-card-heading">
                <span className="showcase-kicker">Flux de candidature</span>
                <span className="showcase-live"><span />En temps réel</span>
              </div>
              <h3>De ton profil au recruteur, rien ne se perd.</h3>
              <p>Chaque agent prend le relais au bon moment. Tu gardes la validation finale.</p>
              <div className="showcase-flow" aria-label="Étapes du parcours de candidature">
                <div className="showcase-flow-step">
                  <span className="showcase-flow-number">01</span>
                  <strong>Atlas</strong>
                  <small>Profil</small>
                </div>
                <div className="showcase-flow-step">
                  <span className="showcase-flow-number">02</span>
                  <strong>Scout</strong>
                  <small>Recherche</small>
                </div>
                <div className="showcase-flow-step">
                  <span className="showcase-flow-number">03</span>
                  <strong>Nexus</strong>
                  <small>Matching</small>
                </div>
                <div className="showcase-flow-step">
                  <span className="showcase-flow-number">04</span>
                  <strong>Hermes</strong>
                  <small>Envoi validé</small>
                </div>
              </div>
              <div className="showcase-card-footnote">
                <Check aria-hidden="true" />
                <span>Un parcours coordonné, sous ton contrôle</span>
              </div>
            </article>

            <article className="showcase-card showcase-card--matching">
              <div className="showcase-card-heading">
                <span className="showcase-kicker">Matching intelligent</span>
                <ArrowUpRight className="showcase-card-arrow" aria-hidden="true" />
              </div>
              <div className="showcase-metric">88<span>%</span></div>
              <h3>Une compatibilité qui a du sens.</h3>
              <p>Nexus compare tes compétences aux critères réels de chaque offre.</p>
              <div className="showcase-progress" aria-label="Exemple de score de compatibilité">
                <span />
              </div>
              <span className="showcase-card-caption"><Activity aria-hidden="true" /> Score de compatibilité</span>
            </article>

            <article className="showcase-card showcase-card--time">
              <div className="showcase-card-heading">
                <span className="showcase-kicker">Temps retrouvé</span>
              </div>
              <div className="showcase-time-metric">18<span>h</span></div>
              <h3>Gagnées chaque semaine.</h3>
              <p>Moins de recherche manuelle sur des dizaines de sites.</p>
              <div className="showcase-bars" aria-hidden="true">
                {[34, 52, 43, 69, 58, 84, 100].map((height, index) => (
                  <span key={index} style={{ '--bar-height': `${height}%` }} />
                ))}
              </div>
            </article>

            <article className="showcase-card showcase-card--writing">
              <div className="showcase-card-heading">
                <span className="showcase-kicker">Candidature sur-mesure</span>
              </div>
              <h3>Chaque candidature, pensée pour l’offre.</h3>
              <p>Plume adapte ton CV et rédige une lettre de motivation ciblée, optimisée ATS.</p>
              <div className="showcase-tags">
                <span><Check aria-hidden="true" /> CV optimisé</span>
                <span><Check aria-hidden="true" /> Lettre adaptée</span>
              </div>
            </article>

            <article className="showcase-card showcase-card--sources">
              <div className="showcase-card-heading">
                <span className="showcase-kicker">Veille continue</span>
              </div>
              <h3>Les bonnes offres, au même endroit.</h3>
              <p>Scout rassemble les opportunités visibles et les marchés cachés.</p>
              <div className="showcase-source-list">
                <span><Globe aria-hidden="true" /> LinkedIn</span>
                <span>Indeed</span>
                <span>WTTJ</span>
                <span>GitHub</span>
                <span>+ marchés cachés</span>
              </div>
            </article>

            <article className="showcase-card showcase-card--control">
              <div className="showcase-card-heading">
                <span className="showcase-kicker">Contrôle étudiant</span>
              </div>
              <h3>Tu gardes toujours la main.</h3>
              <p>Aucune candidature ne part sans ton accord. Pas d’envoi automatique.</p>
              <div className="showcase-approval">
                <span className="showcase-approval-check"><Check aria-hidden="true" /></span>
                <span><strong>Approbation requise</strong><small>Envoi sécurisé</small></span>
                <Zap aria-hidden="true" className="showcase-approval-zap" />
              </div>
            </article>
          </div>
        </div>
      </div>

    </section>
  );
}
