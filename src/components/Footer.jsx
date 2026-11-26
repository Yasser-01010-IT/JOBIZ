import React from 'react';
import { ShieldCheck } from 'lucide-react';
import Threads from './Threads';
import './Footer.css';

export default function Footer({ onOpenAdmin }) {
  return (
    <footer className="site-footer border-t border-white/10 pt-16 pb-12 relative text-left isolate overflow-hidden">
      <div className="site-footer__threads" aria-hidden="true">
        <Threads
          color="#ffffff"
          lineCount={90}
          thickness={0.6}
          softness={1.3}
          amplitude={1.7}
          distance={0.4}
          waves={1.05}
          speed={0.6}
          split={0.04}
          fray={0.5}
          angle={25}
          taper={0.85}
          brightness={1.4}
          parting={0}
          enableMouseInteraction
          fade={0}
          opacity={1}
          seed={0}
        />
      </div>
      <div className="site-footer__content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand Info (Col 5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E2538] to-[#121624] border border-white/15 flex items-center justify-center">
                <img src="/logo-icon.svg" alt="" className="w-full h-full rounded-xl object-cover" />
              </div>
              <span className="site-footer__brand-name text-2xl font-bold tracking-tight">
                Avenir<span>Go</span>
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              L'assistant IA coordonné qui accompagne les étudiants de l'enseignement supérieur, de la recherche d'offres jusqu'à l'envoi validé de la candidature.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-brand-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Projet SNEE · Yassir MSAAD</span>
            </div>
          </div>

          {/* Quick Nav (Col 3) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-[0.12em]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#obstacles" className="hover:text-white transition-colors">Le Constat</a></li>
              <li><a href="#agents" className="hover:text-white transition-colors">Les 6 Agents IA</a></li>
              <li><a href="#journey" className="hover:text-white transition-colors">Parcours Étudiant</a></li>
              <li><a href="#cas-sara" className="hover:text-white transition-colors">Cas Sara (M1)</a></li>
              <li><a href="#accompagnement" className="hover:text-white transition-colors">Accompagnement AvenirGo</a></li>
              <li><a href="#modele-economique" className="hover:text-white transition-colors">Modèle Économique</a></li>
            </ul>
          </div>

          {/* SNEE & Mentor Info (Col 4) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-[0.12em]">
              Accompagnement & Validation
            </h4>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-violet-200 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Statut National Étudiant-Entrepreneur</span>
              </div>
              <p>
                Dossier suivi avec la référente <strong>Aurore</strong> via la plateforme officielle Pépite / Pepitizy.
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={onOpenAdmin}
                  className="text-brand-400 hover:text-brand-300 font-bold underline underline-offset-2"
                >
                  Infos sur la collecte
                </button>
                <span className="text-[11px] text-slate-400">Pepitizy 2026</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 AvenirGo. Tous droits réservés. Conçu avec passion pour les étudiants.</p>
          <div className="flex items-center gap-4">
            <a href="https://data.inpi.fr/" target="_blank" rel="noreferrer" className="hover:text-slate-400 transition-colors">
              Base INPI
            </a>
            <span>•</span>
            <a href="#questionnaire" className="hover:text-slate-400 transition-colors">
              Rejoindre les testeurs
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
