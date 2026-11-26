import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './MagicBento.css';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const THEMES = {
  dark: {
    '--mb-surface': 'linear-gradient(180deg, #161A28 0%, #0F1320 100%)',
    '--mb-edge': 'rgba(255, 255, 255, 0.08)',
    '--mb-highlight': 'rgba(255, 255, 255, 0.06)',
    '--mb-shadow': '0 24px 48px -28px rgba(0, 0, 0, 0.85), 0 8px 18px -12px rgba(0, 0, 0, 0.6)',
    '--mb-tile': 'linear-gradient(180deg, #2A334B 0%, #1A2134 100%)',
    '--mb-tile-edge': 'rgba(255, 255, 255, 0.09)',
    '--mb-tile-highlight': 'rgba(255, 255, 255, 0.15)',
    '--mb-tile-shadow': '0 4px 10px -4px rgba(0, 0, 0, 0.7)',
    '--mb-well': 'rgba(255, 255, 255, 0.03)',
    '--mb-well-edge': 'rgba(255, 255, 255, 0.06)',
    '--mb-ink': '#f4f4f5',
    '--mb-muted': 'rgba(244, 244, 245, 0.65)',
    '--mb-faint': 'rgba(244, 244, 245, 0.3)',
    '--mb-line': 'rgba(244, 244, 245, 0.1)',
    '--mb-secondary': '#a1a1aa',
    '--mb-secondary-ink': '#121016',
    '--mb-cursor-stroke': 'rgba(18, 16, 22, 0.9)',
    '--mb-ring': 'rgba(18, 16, 22, 0.85)',
    '--mb-focus': 'rgba(79, 70, 229, 0.5)',
    '--mb-glow-alpha': 0.85,
    '--mb-spot-alpha': 0.09
  },
  light: {
    '--mb-surface': 'linear-gradient(180deg, #ffffff 0%, #f7f7f9 100%)',
    '--mb-edge': 'rgba(24, 24, 27, 0.08)',
    '--mb-highlight': 'rgba(255, 255, 255, 1)',
    '--mb-shadow': '0 24px 48px -30px rgba(24, 24, 27, 0.28), 0 8px 18px -14px rgba(24, 24, 27, 0.16)',
    '--mb-tile': 'linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)',
    '--mb-tile-edge': 'rgba(24, 24, 27, 0.08)',
    '--mb-tile-highlight': 'rgba(255, 255, 255, 1)',
    '--mb-tile-shadow': '0 4px 10px -5px rgba(24, 24, 27, 0.22)',
    '--mb-well': 'rgba(24, 24, 27, 0.025)',
    '--mb-well-edge': 'rgba(24, 24, 27, 0.06)',
    '--mb-ink': '#18181b',
    '--mb-muted': 'rgba(24, 24, 27, 0.6)',
    '--mb-faint': 'rgba(24, 24, 27, 0.3)',
    '--mb-line': 'rgba(24, 24, 27, 0.08)',
    '--mb-secondary': '#71717a',
    '--mb-secondary-ink': '#ffffff',
    '--mb-cursor-stroke': '#6366f1',
    '--mb-ring': 'rgba(79, 70, 229, 0.4)',
    '--mb-focus': 'rgba(79, 70, 229, 0.3)',
    '--mb-glow-alpha': 0.5,
    '--mb-spot-alpha': 0.035
  }
};

const INK = { dark: [79, 70, 229], light: [79, 70, 229] };
const MIN_CELL = 150;
const MIN_PAIR = 200;
const STAGGER = 80;
const TILT = 6;
const MAGNET = 6;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const vars = values => values;

const parseRgb = value => {
  if (!value) return null;
  const text = String(value).trim();
  const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text);
  if (hex) {
    const full = hex[1].length === 3 ? hex[1].replace(/./g, digit => digit + digit) : hex[1];
    return [0, 2, 4].map(index => parseInt(full.slice(index, index + 2), 16));
  }
  const numbers = text.match(/[\d.]+/g);
  if (numbers && numbers.length >= 3 && /^(rgba?\(|[\d.\s,]+$)/i.test(text)) {
    return numbers.slice(0, 3).map(channel => clamp(Math.round(parseFloat(channel)), 0, 255));
  }
  return null;
};

const inkFor = rgb => {
  const [r, g, b] = rgb.map(channel => channel / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55 ? '#121016' : '#ffffff';
};

// SVG Icons to avoid bulky external dependencies
const GitBranchSvg = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="15"></line>
    <circle cx="18" cy="6" r="3"></circle>
    <circle cx="6" cy="18" r="3"></circle>
    <path d="M18 9a9 9 0 0 1-9 9"></path>
  </svg>
);

const CheckSvg = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const SparklesSvg = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);

const KeySvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5"></circle>
    <path d="m21 2-9.6 9.6"></path>
    <path d="m15.5 7.5 3 3L22 7l-3-3"></path>
  </svg>
);

const FingerprintSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"></path>
    <path d="M14 13.12c0 2.38 0 6.38-1 8.88"></path>
    <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"></path>
    <path d="M2 12a10 10 0 0 1 18-6"></path>
    <path d="M2 16h.01"></path>
    <path d="M21.8 16c.2-2 .131-5.354 0-6"></path>
    <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"></path>
    <path d="M8.65 22c.21-.66.45-1.32.57-2"></path>
    <path d="M9 6.8a6 6 0 0 1 9 5.2v2"></path>
  </svg>
);

const BriefcaseSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const MailSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const SearchSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const FileCodeSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <path d="m10 13-2 2 2 2"></path>
    <path d="m14 17 2-2-2-2"></path>
  </svg>
);

// Chart Curve Generator
const CHART = [62, 68, 71, 75, 78, 82, 85, 87, 89, 92, 94, 96];

const curve = (values, width, height) => {
  const top = 6;
  const bottom = 2;
  const low = Math.min(...values) * 0.7;
  const high = Math.max(...values);
  const points = values.map((value, index) => [
    (index / (values.length - 1)) * width,
    top + (1 - (value - low) / (high - low)) * (height - top - bottom)
  ]);
  const count = points.length;
  const slopes = [];
  for (let i = 0; i < count - 1; i++) {
    slopes.push((points[i + 1][1] - points[i][1]) / (points[i + 1][0] - points[i][0]));
  }
  const tangents = points.map((_, i) => {
    if (i === 0) return slopes[0];
    if (i === count - 1) return slopes[count - 2];
    return slopes[i - 1] * slopes[i] > 0 ? (slopes[i - 1] + slopes[i]) / 2 : 0;
  });
  for (let i = 0; i < count - 1; i++) {
    if (slopes[i] === 0) {
      tangents[i] = 0;
      tangents[i + 1] = 0;
      continue;
    }
    const a = tangents[i] / slopes[i];
    const b = tangents[i + 1] / slopes[i];
    const length = a * a + b * b;
    if (length > 9) {
      const scale = 3 / Math.sqrt(length);
      tangents[i] = scale * a * slopes[i];
      tangents[i + 1] = scale * b * slopes[i];
    }
  }
  let line = `M${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`;
  const samples = [];
  for (let i = 0; i < count - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const third = (x1 - x0) / 3;
    const c1 = [x0 + third, y0 + tangents[i] * third];
    const c2 = [x1 - third, y1 - tangents[i + 1] * third];
    line += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${x1.toFixed(2)},${y1.toFixed(2)}`;
    for (let step = 0; step < 12; step++) {
      const t = step / 12;
      const u = 1 - t;
      samples.push([
        u * u * u * x0 + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * x1,
        u * u * u * y0 + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * y1
      ]);
    }
  }
  samples.push(points[count - 1]);
  const area = `${line} L${width.toFixed(2)},${height.toFixed(2)} L0,${height.toFixed(2)} Z`;
  return { line, area, samples };
};

const sampleAt = (samples, x) => {
  let index = 1;
  while (index < samples.length - 1 && samples[index][0] < x) index++;
  const [x0, y0] = samples[index - 1];
  const [x1, y1] = samples[index];
  const t = x1 === x0 ? 0 : clamp((x - x0) / (x1 - x0), 0, 1);
  return y0 + (y1 - y0) * t;
};

const AnalyticsVisual = () => {
  const chartRef = useRef(null);
  const plotRef = useRef(null);
  const scrubRef = useRef(null);
  const dotRef = useRef(null);
  const valueRef = useRef(null);
  const noteRef = useRef(null);
  const [size, setSize] = useState(null);

  useIsomorphicLayoutEffect(() => {
    const plot = plotRef.current;
    if (!plot) return;
    const update = () => {
      const next = { width: plot.clientWidth, height: plot.clientHeight };
      setSize(previous =>
        previous && previous.width === next.width && previous.height === next.height ? previous : next
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(plot);
    return () => observer.disconnect();
  }, []);

  const shape = useMemo(
    () => (size && size.width > 4 && size.height > 4 ? curve(CHART, size.width, size.height) : null),
    [size]
  );

  const scrub = event => {
    const plot = plotRef.current;
    const chart = chartRef.current;
    const line = scrubRef.current;
    const dot = dotRef.current;
    const label = valueRef.current;
    const note = noteRef.current;
    if (!shape || !plot || !chart || !line || !dot || !label || !note) return;
    const rect = plot.getBoundingClientRect();
    const x = clamp(event.clientX - rect.left, 0, rect.width);
    const y = sampleAt(shape.samples, x);
    const position = (x / Math.max(1, rect.width)) * (CHART.length - 1);
    const index = Math.floor(position);
    const next = Math.min(CHART.length - 1, index + 1);
    const value = CHART[index] + (CHART[next] - CHART[index]) * (position - index);
    chart.dataset.scrub = '';
    line.style.transform = `translateX(${x.toFixed(1)}px)`;
    dot.style.transform = `translateY(${y.toFixed(1)}px)`;
    label.textContent = `${Math.round(value)}%`;
    note.textContent = `Match Nexus`;
  };

  const rest = () => {
    if (chartRef.current) delete chartRef.current.dataset.scrub;
    if (valueRef.current) valueRef.current.textContent = `88%`;
    if (noteRef.current) noteRef.current.textContent = 'Match Nexus';
  };

  return (
    <div
      ref={chartRef}
      className="magic-bento__chart"
      onPointerMove={scrub}
      onPointerDown={scrub}
      onPointerLeave={rest}
    >
      <div className="magic-bento__figure">
        <span ref={valueRef} className="magic-bento__figure-value text-emerald-400">
          88%
        </span>
        <span ref={noteRef} className="magic-bento__figure-note text-indigo-400">
          Match Nexus
        </span>
      </div>
      <div ref={plotRef} className="magic-bento__plot">
        {shape && size && (
          <svg viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true">
            <path className="magic-bento__chart-area" d={shape.area} />
            <path className="magic-bento__chart-line" d={shape.line} pathLength="1" />
          </svg>
        )}
        <span ref={scrubRef} className="magic-bento__scrub">
          <span ref={dotRef} className="magic-bento__scrub-dot" />
        </span>
      </div>
    </div>
  );
};

const BARS = [35, 55, 45, 75, 60, 92, 85];

const DashboardVisual = () => (
  <div className="magic-bento__bars">
    <div className="magic-bento__figure">
      <span className="magic-bento__figure-value text-brand-400 font-mono">18h</span>
      <span className="magic-bento__figure-note">gagnées / sem.</span>
    </div>
    <div className="magic-bento__bars-plot">
      {BARS.map((height, index) => (
        <span
          key={index}
          className="magic-bento__bar"
          data-peak={height === Math.max(...BARS) ? '' : undefined}
          style={vars({ '--h': height / 100, '--i': index })}
        />
      ))}
    </div>
  </div>
);

const ARROW = (
  <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true">
    <path
      d="M2.2 1.6 13.4 9.9c.5.4.3 1.2-.4 1.3l-4.6.6-2.2 4.2c-.3.6-1.2.5-1.4-.1L1.2 2.4c-.2-.6.5-1.1 1-.8Z"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

const CollaborationVisual = () => (
  <div className="magic-bento__collab magic-bento__well">
    <span className="magic-bento__doc-title">Plume · Lettre sur-mesure ATS</span>
    <div className="magic-bento__lines">
      <span className="magic-bento__line" style={vars({ '--w': '94%' })} />
      <span className="magic-bento__line" style={vars({ '--w': '80%' })} />
      <span className="magic-bento__line" style={vars({ '--w': '88%' })} />
      <span className="magic-bento__line" style={vars({ '--w': '50%' })} />
      <span className="magic-bento__line magic-bento__line--gap" style={vars({ '--w': '90%' })} />
      <span className="magic-bento__line" style={vars({ '--w': '72%' })}>
        <span className="magic-bento__selection" style={vars({ '--from': '15%', '--span': '65%' })}>
          <span className="magic-bento__caret" />
        </span>
      </span>
      <span className="magic-bento__line" style={vars({ '--w': '84%' })} />
    </div>
    <span
      className="magic-bento__cursor magic-bento__cursor--primary"
      style={vars({ '--x': '58%', '--y': '52%', '--i': 0, '--path': 'magic-bento-path-a' })}
    >
      {ARROW}
      <span className="magic-bento__cursor-name">Plume IA</span>
    </span>
    <span
      className="magic-bento__cursor magic-bento__cursor--secondary"
      style={vars({ '--x': '30%', '--y': '24%', '--i': 1, '--path': 'magic-bento-path-b' })}
    >
      {ARROW}
      <span className="magic-bento__cursor-name">Sara (M1)</span>
    </span>
  </div>
);

const STEPS = [
  { label: 'Profil Atlas', time: '1 clic' },
  { label: 'Scout Search', time: '124 offres' },
  { label: 'Nexus Match', time: '88% match' },
  { label: 'Hermes Envoi', time: 'Validé RH' }
];

const AutomationVisual = () => (
  <div className="magic-bento__flow" style={vars({ '--n': STEPS.length })}>
    <div className="magic-bento__flow-trigger magic-bento__tile">
      <span className="magic-bento__flow-glyph text-brand-400">
        <GitBranchSvg />
      </span>
      <span className="magic-bento__flow-copy">
        <span className="magic-bento__flow-name">Cycle Orion Coordonné</span>
        <span className="magic-bento__flow-meta magic-bento__flow-hash">job_flow_#2026</span>
      </span>
    </div>
    <ol className="magic-bento__steps magic-bento__well">
      <span className="magic-bento__rail" aria-hidden="true">
        <span className="magic-bento__rail-fill" />
      </span>
      {STEPS.map((step, index) => (
        <li key={step.label} className="magic-bento__step" style={vars({ '--i': index })}>
          <span className="magic-bento__status">
            <span className="magic-bento__pending" />
            <span className="magic-bento__spinner" />
            <span className="magic-bento__done">
              <CheckSvg />
            </span>
          </span>
          <span className="text-xs font-medium">{step.label}</span>
          <span className="magic-bento__step-time font-mono">{step.time}</span>
        </li>
      ))}
    </ol>
  </div>
);

const APPS = [
  { icon: BriefcaseSvg, x: '17%', y: '24%' },
  { icon: SearchSvg, x: '83%', y: '24%' },
  { icon: FileCodeSvg, x: '17%', y: '78%' },
  { icon: MailSvg, x: '83%', y: '78%' }
];

const IntegrationVisual = () => (
  <div className="magic-bento__hub">
    <svg className="magic-bento__hub-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {APPS.map(app => (
        <line key={app.x + app.y} x1={parseFloat(app.x)} y1={parseFloat(app.y)} x2="50" y2="51" pathLength="1" />
      ))}
    </svg>
    {APPS.map((app, index) => (
      <span
        key={`packet-${index}`}
        className="magic-bento__packet"
        style={vars({ '--x': app.x, '--y': app.y, '--i': index })}
      />
    ))}
    {APPS.map((app, index) => {
      const Icon = app.icon;
      return (
        <span
          key={app.x + app.y}
          className="magic-bento__hub-node magic-bento__tile text-brand-400"
          style={vars({ '--x': app.x, '--y': app.y, '--s': '26px', '--i': index + 1 })}
        >
          <Icon />
        </span>
      );
    })}
    <span
      className="magic-bento__hub-node magic-bento__tile text-indigo-400"
      style={vars({ '--x': '50%', '--y': '51%', '--s': '34px', '--i': 0 })}
    >
      <SparklesSvg />
    </span>
  </div>
);

const SETTINGS = [
  { icon: KeySvg, label: 'Validation 1-Clic' },
  { icon: FingerprintSvg, label: 'Contrôle 100% Étudiant' }
];

const SecurityVisual = () => (
  <div className="magic-bento__shield">
    {SETTINGS.map((setting, index) => {
      const Icon = setting.icon;
      return (
        <div key={setting.label} className="magic-bento__setting magic-bento__tile">
          <span className="text-brand-400"><Icon /></span>
          <span className="magic-bento__setting-label text-xs">{setting.label}</span>
          <span className="magic-bento__switch" style={vars({ '--i': index })} />
        </div>
      );
    })}
  </div>
);

const VISUALS = {
  analytics: AnalyticsVisual,
  dashboard: DashboardVisual,
  collaboration: CollaborationVisual,
  automation: AutomationVisual,
  integration: IntegrationVisual,
  security: SecurityVisual
};

const REPLAY = new Set([
  'magic-bento-draw',
  'magic-bento-fade',
  'magic-bento-grow',
  'magic-bento-pop',
  'magic-bento-select',
  'magic-bento-wait',
  'magic-bento-run',
  'magic-bento-check',
  'magic-bento-rail',
  'magic-bento-switch-track',
  'magic-bento-switch-knob'
]);

const FLOW = new Set([
  'magic-bento-wait',
  'magic-bento-run',
  'magic-bento-check',
  'magic-bento-rail',
  'magic-bento-fade'
]);

const finite = animation => {
  const timing = animation.effect?.getTiming?.();
  return timing ? timing.iterations !== Infinity : false;
};

const nameOf = animation => animation.animationName || '';

// Default items tailored specifically to AvenirGo
export const AVENIRGO_BENTO_ITEMS = [
  {
    title: 'Matching Sémantique Nexus',
    description: 'Score de compatibilité précis et détection des compétences requises',
    visual: 'analytics',
    icon: '⚡',
    label: 'Scoring IA'
  },
  {
    title: 'Gain de 18h / Semaine',
    description: 'Fini le travail à plein temps pour écumer 15 sites de stages',
    visual: 'dashboard',
    icon: '⏳',
    label: 'Productivité'
  },
  {
    title: 'Plume · Rédacteur Stratégique ATS',
    description: 'CV optimisé mots-clés et lettre de motivation sur-mesure pour chaque entreprise cible',
    visual: 'collaboration',
    colSpan: 2,
    rowSpan: 2,
    icon: '✍️',
    label: 'Candidature Sur-Mesure'
  },
  {
    title: 'Orchestration Multi-Agents Asynchrone',
    description: 'Du scan de ton profil jusqu’à l’envoi de l’email avec ton feu vert',
    visual: 'automation',
    colSpan: 2,
    rowSpan: 2,
    icon: '🧭',
    label: 'Workflow Étudiant'
  },
  {
    title: 'Agrégation Multi-Sources',
    description: 'Veille unifiée sur LinkedIn, Indeed, WTTJ, GitHub et marchés cachés',
    visual: 'integration',
    icon: '🔍',
    label: 'Scout 24/7'
  },
  {
    title: 'Hermes · Contrôle & Sécurité RH',
    description: 'L’étudiant valide chaque envoi avant le départ du mail. Zéro spam',
    visual: 'security',
    icon: '📬',
    label: 'Garantie SNEE'
  }
];

const MagicBento = ({
  items = AVENIRGO_BENTO_ITEMS,
  columns = 4,
  rowHeight = 200,
  gap = 12,
  radius = 20,
  theme = 'dark',
  glowColor = '#6366f1',
  textAutoHide = true,
  enableBorderGlow = true,
  enableSpotlight = true,
  spotlightRadius = 300,
  enableStars = false,
  particleCount = 24,
  enableTilt = false,
  enableMagnetism = false,
  clickEffect = true,
  intro = true,
  disableAnimations = false,
  onItemClick,
  className = '',
  style
}) => {
  const rootRef = useRef(null);
  const cellRefs = useRef([]);
  const cardRefs = useRef([]);
  const starRefs = useRef([]);
  const engineRef = useRef(null);
  const [cols, setCols] = useState(Math.max(1, Math.round(columns)));

  const palette = theme === 'light' ? 'light' : 'dark';
  const glow = parseRgb(glowColor) ?? INK[palette];
  const settings = {
    items,
    columns: Math.max(1, Math.round(columns)),
    gap: Math.max(0, gap),
    enableBorderGlow,
    enableSpotlight,
    spotlightRadius: Math.max(40, spotlightRadius),
    enableStars,
    particleCount: clamp(Math.round(particleCount), 0, 120),
    enableTilt,
    enableMagnetism,
    clickEffect,
    intro,
    disableAnimations,
    onItemClick,
    glow
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motion = !settingsRef.current.disableAnimations && !reduced;
    const playIntro = motion && settingsRef.current.intro;
    if (motion) root.dataset.motion = '';
    else delete root.dataset.motion;
    if (playIntro) root.dataset.intro = '';
    else delete root.dataset.intro;

    const pointer = { x: -1e5, y: -1e5, inside: false, down: -1 };
    const light = { x: -1e5, y: -1e5, near: 0, ready: false };
    const states = [];
    const wave = { x: 0, y: 0, t: -1, duration: 1.1, reach: 800 };
    let rects = [];
    let bounds = null;
    let dirty = true;
    let raf = 0;
    let last = 0;
    let visible = true;
    let entered = !playIntro;
    let settleTimer = 0;
    let introTimer = 0;
    const lastFlow = [];

    const stateFor = index => {
      if (!states[index]) {
        states[index] = {
          hot: 0,
          rx: 0,
          ry: 0,
          tx: 0,
          ty: 0,
          vrx: 0,
          vry: 0,
          vtx: 0,
          vty: 0,
          press: 1,
          vpress: 0,
          stars: 0,
          particles: null,
          active: false,
          written: {}
        };
      }
      return states[index];
    };

    const write = (element, state, name, value) => {
      if (state.written[name] === value) return;
      state.written[name] = value;
      element.style.setProperty(name, value);
    };

    const measure = () => {
      dirty = false;
      bounds = root.getBoundingClientRect();
      rects = cellRefs.current.map(cell => (cell ? cell.getBoundingClientRect() : null));
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      starRefs.current.forEach((canvas, index) => {
        const rect = rects[index];
        if (!canvas || !rect) return;
        const width = Math.max(1, Math.round(rect.width * ratio));
        const height = Math.max(1, Math.round(rect.height * ratio));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
      });
    };

    const seed = (index, rect) => {
      const count = settingsRef.current.particleCount;
      const state = stateFor(index);
      if (state.particles && state.particles.length === count) return state.particles;
      state.particles = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 6,
        vy: -4 - Math.random() * 10,
        size: 0.6 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        rate: 1.2 + Math.random() * 2.4
      }));
      return state.particles;
    };

    const drawStars = (index, rect, state, lx, ly, dt, now) => {
      const canvas = starRefs.current[index];
      if (!canvas) return;
      const context = canvas.getContext('2d');
      if (!context) return;
      const ratio = canvas.width / Math.max(1, rect.width);
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (state.stars < 0.004) return;
      const s = settingsRef.current;
      const particles = seed(index, rect);
      const reach = s.spotlightRadius * 0.75;
      const [r, g, b] = s.glow;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      for (const particle of particles) {
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        if (particle.y < -4) {
          particle.y = rect.height + 4;
          particle.x = Math.random() * rect.width;
        }
        if (particle.x < -4) particle.x = rect.width + 4;
        if (particle.x > rect.width + 4) particle.x = -4;
        const distance = Math.hypot(particle.x - lx, particle.y - ly) / reach;
        if (distance >= 1) continue;
        const falloff = 1 - distance * distance * (3 - 2 * distance);
        const twinkle = 0.55 + 0.45 * Math.sin(now * 0.001 * particle.rate + particle.phase);
        const alpha = state.stars * falloff * twinkle;
        if (alpha < 0.01) continue;
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }
    };

    const replay = (card, filter) => {
      if (!motion || !card.getAnimations) return;
      for (const animation of card.getAnimations({ subtree: true })) {
        if (!filter.has(nameOf(animation)) || !finite(animation)) continue;
        const target = animation.effect instanceof KeyframeEffect ? animation.effect.target : null;
        if (target instanceof Element && target.classList.contains('magic-bento__cursor')) continue;
        animation.currentTime = 0;
        animation.play();
      }
    };

    const startWave = (x, y, duration) => {
      if (!motion || !bounds) return;
      wave.x = x;
      wave.y = y;
      wave.t = 0;
      wave.duration = duration;
      wave.reach =
        Math.max(
          Math.hypot(x - bounds.left, y - bounds.top),
          Math.hypot(x - bounds.right, y - bounds.top),
          Math.hypot(x - bounds.left, y - bounds.bottom),
          Math.hypot(x - bounds.right, y - bounds.bottom)
        ) + 140;
    };

    const frame = now => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      if (dirty) measure();
      const s = settingsRef.current;
      const cards = cardRefs.current;
      let busy = false;

      const margin = s.spotlightRadius * 0.5;
      const near =
        pointer.inside &&
        bounds &&
        pointer.x > bounds.left - margin &&
        pointer.x < bounds.right + margin &&
        pointer.y > bounds.top - margin &&
        pointer.y < bounds.bottom + margin
          ? 1
          : 0;
      if (!light.ready && near) {
        light.x = pointer.x;
        light.y = pointer.y;
        light.ready = true;
      }
      const follow = 1 - Math.exp(-dt / 0.05);
      light.x += (pointer.x - light.x) * follow;
      light.y += (pointer.y - light.y) * follow;
      const fade = 1 - Math.exp(-dt / (near > light.near ? 0.12 : 0.4));
      light.near += (near - light.near) * fade;
      if (Math.abs(near - light.near) < 0.002) light.near = near;
      else busy = true;
      if (Math.abs(pointer.x - light.x) + Math.abs(pointer.y - light.y) > 0.3) busy = true;

      let waveRadius = 0;
      let waveAlpha = 0;
      if (wave.t >= 0) {
        wave.t += dt;
        const progress = Math.min(1, wave.t / wave.duration);
        waveRadius = wave.reach * (1 - Math.pow(1 - progress, 2.2));
        waveAlpha = Math.pow(1 - progress, 1.3);
        if (progress >= 1) {
          wave.t = -1;
          waveAlpha = 0;
        } else busy = true;
      }

      cards.forEach((card, index) => {
        const rect = rects[index];
        if (!card || !rect) return;
        const state = stateFor(index);
        const lx = light.x - rect.left;
        const ly = light.y - rect.top;
        const px = pointer.x - rect.left;
        const py = pointer.y - rect.top;
        const inside = pointer.inside && entered && px >= 0 && py >= 0 && px <= rect.width && py <= rect.height;

        if (inside !== state.active) {
          state.active = inside;
          if (inside) {
            card.dataset.active = '';
            if (now - (lastFlow[index] || -1e9) > 3200 && card.querySelector('.magic-bento__steps')) {
              lastFlow[index] = now;
              replay(card, FLOW);
            }
          } else delete card.dataset.active;
        }

        const hotTarget = inside && s.enableSpotlight ? 1 : 0;
        state.hot += (hotTarget - state.hot) * (1 - Math.exp(-dt / (hotTarget > state.hot ? 0.14 : 0.32)));
        if (Math.abs(hotTarget - state.hot) < 0.002) state.hot = hotTarget;
        else busy = true;

        const u = clamp(px / Math.max(1, rect.width), 0, 1) - 0.5;
        const v = clamp(py / Math.max(1, rect.height), 0, 1) - 0.5;
        const tilt = inside && s.enableTilt && motion;
        const magnet = inside && s.enableMagnetism && motion;
        const targets = [
          tilt ? -v * 2 * TILT : 0,
          tilt ? u * 2 * TILT : 0,
          magnet ? u * 2 * MAGNET : 0,
          magnet ? v * 2 * MAGNET : 0
        ];
        const keys = [
          ['rx', 'vrx'],
          ['ry', 'vry'],
          ['tx', 'vtx'],
          ['ty', 'vty']
        ];
        const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
        const h = dt / steps;
        keys.forEach(([key, velocity], k) => {
          for (let step = 0; step < steps; step++) {
            state[velocity] += (170 * (targets[k] - state[key]) - 20 * state[velocity]) * h;
            state[key] += state[velocity] * h;
          }
          if (Math.abs(targets[k] - state[key]) < 0.002 && Math.abs(state[velocity]) < 0.01) {
            state[key] = targets[k];
            state[velocity] = 0;
          } else busy = true;
        });
        const pressTarget = pointer.down === index && s.clickEffect && motion ? 0.985 : 1;
        for (let step = 0; step < steps; step++) {
          state.vpress += (420 * (pressTarget - state.press) - 28 * state.vpress) * h;
          state.press += state.vpress * h;
        }
        if (Math.abs(pressTarget - state.press) < 0.0002 && Math.abs(state.vpress) < 0.001) {
          state.press = pressTarget;
          state.vpress = 0;
        } else busy = true;

        write(card, state, '--mb-x', `${lx.toFixed(1)}px`);
        write(card, state, '--mb-y', `${ly.toFixed(1)}px`);
        write(card, state, '--mb-near', (s.enableBorderGlow ? light.near : 0).toFixed(3));
        write(card, state, '--mb-hot', state.hot.toFixed(3));
        write(card, state, '--mb-rx', `${state.rx.toFixed(3)}deg`);
        write(card, state, '--mb-ry', `${state.ry.toFixed(3)}deg`);
        write(card, state, '--mb-tx', `${state.tx.toFixed(2)}px`);
        write(card, state, '--mb-ty', `${state.ty.toFixed(2)}px`);
        write(card, state, '--mb-press', state.press.toFixed(4));
        write(card, state, '--mb-wx', `${(wave.x - rect.left).toFixed(1)}px`);
        write(card, state, '--mb-wy', `${(wave.y - rect.top).toFixed(1)}px`);
        write(card, state, '--mb-wr', `${waveRadius.toFixed(1)}px`);
        write(card, state, '--mb-wa', waveAlpha.toFixed(3));

        if (s.enableStars && starRefs.current[index]) {
          const starTarget = inside && motion ? 1 : 0;
          state.stars += (starTarget - state.stars) * (1 - Math.exp(-dt / (starTarget ? 0.3 : 0.5)));
          if (state.stars < 0.004 && !starTarget) state.stars = 0;
          if (state.stars > 0 || starTarget) {
            drawStars(index, rect, state, lx, ly, dt, now);
            state.drawn = true;
            busy = true;
          } else if (state.drawn) {
            drawStars(index, rect, state, lx, ly, dt, now);
            state.drawn = false;
          }
        }
      });

      if (busy && visible) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const cardIndex = target => {
      if (!(target instanceof Element)) return -1;
      const card = target.closest('.magic-bento__card');
      return card instanceof HTMLElement ? cardRefs.current.indexOf(card) : -1;
    };

    const onPointerMove = event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
      wake();
    };

    const onPointerOut = event => {
      if (event.relatedTarget) return;
      pointer.inside = false;
      pointer.down = -1;
      wake();
    };

    const onPointerDown = event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
      pointer.down = cardIndex(event.target);
      wake();
    };

    const release = () => {
      if (pointer.down < 0) return;
      pointer.down = -1;
      wake();
    };

    const activate = (index, x, y) => {
      const s = settingsRef.current;
      const card = cardRefs.current[index];
      if (!card) return;
      if (s.clickEffect) {
        if (dirty) measure();
        startWave(x, y, 1.1);
        replay(card, REPLAY);
        lastFlow[index] = performance.now();
      }
      wake();
    };

    const onClick = event => {
      const index = cardIndex(event.target);
      const card = cardRefs.current[index];
      if (!card) return;
      if (event.detail === 0) {
        const rect = card.getBoundingClientRect();
        activate(index, rect.left + rect.width / 2, rect.top + rect.height / 2);
      } else activate(index, event.clientX, event.clientY);
    };

    const onKeyDown = event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const card = cardRefs.current[cardIndex(event.target)];
      if (!card || event.target !== card || card.tagName === 'A') return;
      event.preventDefault();
      card.click();
    };

    const onScroll = () => {
      dirty = true;
      wake();
    };

    const resizeObserver = new ResizeObserver(() => {
      const s = settingsRef.current;
      const width = root.clientWidth;
      const cell = count => (width - s.gap * (count - 1)) / count;
      const next = cell(s.columns) >= MIN_CELL ? s.columns : s.columns >= 2 && cell(2) >= MIN_PAIR ? 2 : 1;
      setCols(next);
      dirty = true;
      wake();
    });
    resizeObserver.observe(root);

    const enter = () => {
      entered = true;
      let order = 0;
      cellRefs.current.forEach(cell => {
        if (!cell) return;
        cell.style.setProperty('--mb-delay', `${order++ * STAGGER}ms`);
        cell.dataset.state = 'in';
      });
      if (dirty) measure();
      introTimer = window.setTimeout(() => {
        if (bounds) startWave(bounds.left, bounds.top, 1.7);
        wake();
      }, 260);
      settleTimer = window.setTimeout(
        () => {
          cellRefs.current.forEach(cell => cell?.style.setProperty('--mb-delay', '0ms'));
        },
        order * STAGGER + 2600
      );
      wake();
    };

    let gate = null;
    if (playIntro && typeof IntersectionObserver !== 'undefined') {
      gate = new IntersectionObserver(
        (entries, observer) => {
          if (!entries.some(entry => entry.isIntersecting)) return;
          observer.disconnect();
          enter();
        },
        { threshold: 0.15 }
      );
      gate.observe(root);
    } else {
      cellRefs.current.forEach(cell => {
        if (!cell) return;
        cell.style.setProperty('--mb-delay', '0ms');
        cell.dataset.state = 'in';
      });
      if (motion) {
        for (const animation of root.getAnimations ? root.getAnimations({ subtree: true }) : []) {
          if (REPLAY.has(nameOf(animation)) && finite(animation)) animation.finish();
        }
      }
    }

    const visibility = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) {
        dirty = true;
        wake();
      }
    });
    visibility.observe(root);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', release, { passive: true });
    window.addEventListener('pointercancel', release, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', onScroll, { passive: true });
    document.removeEventListener('pointerout', onPointerOut);
    root.addEventListener('click', onClick);
    root.addEventListener('keydown', onKeyDown);

    engineRef.current = {
      sync: () => {
        cellRefs.current.forEach(cell => {
          if (!cell || (!entered && playIntro)) return;
          if (cell.dataset.state !== 'in') {
            cell.style.setProperty('--mb-delay', '0ms');
            cell.dataset.state = 'in';
          }
        });
        dirty = true;
        wake();
      }
    };

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settleTimer);
      window.clearTimeout(introTimer);
      gate?.disconnect();
      visibility.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('pointerout', onPointerOut);
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKeyDown);
      engineRef.current = null;
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    engineRef.current?.sync();
  }, [items, cols, rowHeight, gap, radius, enableStars, enableSpotlight, enableBorderGlow]);

  const ink = INK[palette];
  const accent = parseRgb(glowColor) ?? ink;
  const corner = Math.max(0, radius);
  const span = Math.max(1, cols);

  cellRefs.current.length = items.length;
  cardRefs.current.length = items.length;
  starRefs.current.length = items.length;

  return (
    <div
      ref={rootRef}
      className={`magic-bento ${className}`.trim()}
      data-autohide={textAutoHide ? '' : undefined}
      data-motion={disableAnimations ? undefined : ''}
      data-intro={intro && !disableAnimations ? '' : undefined}
      style={{
        ...vars({
          ...THEMES[palette],
          '--mb-glow-rgb': glow.join(', '),
          '--mb-accent-rgb': accent.join(', '),
          '--mb-accent-ink': inkFor(accent),
          '--mb-radius': `${corner}px`,
          '--mb-inner-radius': `${Math.round(clamp(corner * 0.5, 6, 12))}px`,
          '--mb-pad': `${Math.round(clamp(corner * 0.85, 14, 20))}px`,
          '--mb-spot-size': `${Math.max(40, spotlightRadius)}px`,
          '--mb-border-size': `${Math.round(Math.max(40, spotlightRadius) * 0.75)}px`
        }),
        gridTemplateColumns: `repeat(${span}, minmax(0, 1fr))`,
        gridAutoRows: span === 1 ? `minmax(${rowHeight}px, auto)` : `${rowHeight}px`,
        gap: `${Math.max(0, gap)}px`,
        ...style
      }}
    >
      {items.map((item, index) => {
        const entry = item ?? {};
        const Visual = typeof entry.visual === 'string' ? VISUALS[entry.visual] : null;
        const visual = Visual ? <Visual /> : typeof entry.visual === 'string' ? null : entry.visual;
        const clickable = Boolean(entry.href || entry.onClick || onItemClick);
        const handleClick = event => {
          entry.onClick?.(event);
          onItemClick?.(entry, index);
        };
        const cardProps = {
          ref: element => {
            cardRefs.current[index] = element;
          },
          className: 'magic-bento__card',
          'data-clickable': clickable ? '' : undefined,
          'data-image': entry.image ? '' : undefined,
          onClick: clickable ? handleClick : undefined
        };
        const body = (
          <>
            {entry.image && <img className="magic-bento__image" src={entry.image} alt="" draggable={false} />}
            {entry.image && <span className="magic-bento__scrim" />}
            {enableSpotlight && <span className="magic-bento__light" />}
            {enableStars && (
              <canvas
                ref={element => {
                  starRefs.current[index] = element;
                }}
                className="magic-bento__stars"
                aria-hidden="true"
              />
            )}
            <div className="magic-bento__content">
              {entry.content ?? (
                <>
                  {(entry.icon || entry.label) && (
                    <div className="magic-bento__header">
                      {entry.icon && <span className="magic-bento__icon">{entry.icon}</span>}
                      {entry.label && <span className="magic-bento__label">{entry.label}</span>}
                    </div>
                  )}
                  {visual && (
                    <div className="magic-bento__visual" aria-hidden="true">
                      {visual}
                    </div>
                  )}
                  {(entry.title || entry.description) && (
                    <div className="magic-bento__text">
                      {entry.title && <h3 className="magic-bento__title">{entry.title}</h3>}
                      {entry.description && <p className="magic-bento__description">{entry.description}</p>}
                    </div>
                  )}
                </>
              )}
            </div>
            <span className="magic-bento__rim" />
            <span className="magic-bento__border" />
          </>
        );

        return (
          <div
            key={entry.id ?? index}
            ref={element => {
              cellRefs.current[index] = element;
            }}
            className="magic-bento__cell"
            style={{
              gridColumn: `span ${Math.min(span, Math.max(1, Math.round(entry.colSpan ?? 1)))}`,
              gridRow: `span ${Math.max(1, Math.round(entry.rowSpan ?? 1))}`
            }}
          >
            {entry.href ? (
              <a {...cardProps} href={entry.href} target={entry.target} rel={entry.rel}>
                {body}
              </a>
            ) : (
              <div
                {...cardProps}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                aria-label={clickable ? entry.title : undefined}
              >
                {body}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MagicBento;
