import React, { useState, useEffect } from 'react';
import { X, Download, Trash2, Users, RefreshCw } from 'lucide-react';

const LEGACY_SURVEY_STORAGE_KEY = 'Jobinz_survey_submissions';
const surveySpreadsheetUrl = import.meta.env.VITE_SURVEY_SPREADSHEET_URL;

export default function AdminSurveyModal({ isOpen, onClose }) {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    try {
      const data = JSON.parse(localStorage.getItem(LEGACY_SURVEY_STORAGE_KEY) || '[]');
      setSubmissions(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClear = () => {
    if (confirm('Voulez-vous vraiment effacer les anciennes réponses enregistrées sur ce navigateur ?')) {
      localStorage.removeItem(LEGACY_SURVEY_STORAGE_KEY);
      setSubmissions([]);
    }
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) {
      alert('Aucune ancienne réponse locale à exporter.');
      return;
    }

    const headers = [
      'Date', 'VIP Code', 'Nom', 'Email', 'Téléphone', 'Niveau', 'Domaine', 'École', 'Ville', 'Obstacle Principal', 'Temps / Semaine', 'Outils Actuels', 'Agent Souhaité', 'Intérêt Payer', 'Interview 15min', 'Feedback'
    ];

    const rows = submissions.map((s) => [
      s.submittedAt || '',
      s.vipCode || '',
      `"${s.fullName || ''}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.studyLevel || ''}"`,
      `"${s.fieldOfStudy || ''}"`,
      `"${s.schoolName || ''}"`,
      `"${s.city || ''}"`,
      `"${s.mainObstacle || ''}"`,
      `"${s.timeSpent || ''}"`,
      `"${(s.currentTools || []).join('; ')}"`,
      `"${s.desiredAgent || ''}"`,
      `"${s.willingnessToPay || ''}"`,
      s.readyForInterview ? 'OUI' : 'NON',
      `"${(s.userFeedback || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Jobinz_Etude_Marche_SNEE_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0F1424] border border-white/15 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-left">
        
        {/* Modal Header */}
        <div className="p-6 bg-[#151D33] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Collecte des réponses de l’étude
              </h3>
              <p className="text-xs text-slate-400">
                En production, les nouvelles réponses sont enregistrées dans Google Sheets. Cette liste contient uniquement l’ancienne archive locale de ce navigateur.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 bg-[#111728] border-b border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-semibold text-white">{submissions.length}</span> ancienne(s) réponse(s) locale(s)
          </div>

          <div className="flex items-center gap-2">
            {surveySpreadsheetUrl && (
              <a
                href={surveySpreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold transition-colors"
              >
                Ouvrir les réponses Google Sheets
              </a>
            )}
            <button
              onClick={loadData}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Actualiser</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold flex items-center gap-1.5 transition-all shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter l’archive locale (CSV)</span>
            </button>
            {submissions.length > 0 && (
              <button
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center gap-1.5 transition-colors"
                title="Effacer les réponses"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Submissions List / Table */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {submissions.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Users className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-sm">
                Aucune ancienne réponse locale sur cet appareil.
              </p>
              <p className="text-xs text-slate-500">
                En production, les nouvelles réponses sont consultables dans la feuille Google Sheets configurée pour ce projet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-[#161E33] border border-white/5 hover:border-white/15 transition-all space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {sub.fullName || 'Étudiant Anonyme'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 font-mono text-[10px]">
                        {sub.vipCode}
                      </span>
                      {sub.readyForInterview && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                          OK Interview 15min
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString('fr-FR') : ''}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-2 text-slate-300">
                    <div>
                      <span className="text-slate-500">Cursus :</span> {sub.studyLevel} ({sub.fieldOfStudy})
                    </div>
                    <div>
                      <span className="text-slate-500">Établissement :</span> {sub.schoolName || 'Non précisé'} · {sub.city || ''}
                    </div>
                    <div>
                      <span className="text-slate-500">Contact :</span> {sub.email} {sub.phone ? `(${sub.phone})` : ''}
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-black/20 text-slate-300 space-y-1">
                    <div>
                      <strong className="text-slate-400">Obstacle majeur :</strong> {sub.mainObstacle}
                    </div>
                    <div>
                      <strong className="text-slate-400">Agent le plus attendu :</strong> {sub.desiredAgent}
                    </div>
                    {sub.userFeedback && (
                      <div>
                        <strong className="text-slate-400">Remarque de l'étudiant :</strong> "{sub.userFeedback}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#111728] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Les réponses précédentes de cette liste restent une archive locale séparée.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
}
