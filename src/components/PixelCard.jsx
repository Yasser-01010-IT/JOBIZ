import React, { useEffect, useRef, useState } from 'react';
import './PixelCard.css';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const smoothstep = (edge0, edge1, value) => {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

export default function PixelCard({
  colors = ['#f8fafc', '#f1f5f9', '#cbd5e1'],
  gap = 5,
  speed = 35,
  pixelSize = 2,
  shape = 'square',
  origin = 'center',
  revealDuration = 600,
  spotlight = 0.5,
  glow = 0.5,
  glowColor = '#cbd5e1',
  opacity = 0.35,
  fade = 0.7,
  trigger = 'hover',
  clickPulse = true,
  intro = true,
  theme = 'dark',
  radius = 24,
  className = '',
  style,
  children,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!container || !canvas || !context) return undefined;

    const palette = Array.isArray(colors) ? colors : [colors];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const state = {
      width: 0,
      height: 0,
      ratio: 1,
      pixels: [],
      progress: 0,
      target: 0,
      transitionStart: 0,
      transitionFrom: 0,
      pointerX: 0,
      pointerY: 0,
      originX: 0,
      originY: 0,
      pulseAt: 0,
      pulseX: 0,
      pulseY: 0,
      raf: 0,
      last: 0,
      alive: true,
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      state.width = rect.width;
      state.height = rect.height;
      state.ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(state.width * state.ratio));
      canvas.height = Math.max(1, Math.round(state.height * state.ratio));
      state.pixels = [];
      const step = Math.max(3, gap);
      state.originX = state.width / 2;
      state.originY = state.height / 2;
      const maxDistance = Math.hypot(state.width, state.height) / 2 || 1;

      for (let x = step / 2; x < state.width; x += step) {
        for (let y = step / 2; y < state.height; y += step) {
          state.pixels.push({
            x,
            y,
            distance: Math.hypot(x - state.originX, y - state.originY) / maxDistance,
            size: pixelSize * (0.4 + Math.random() * 0.6),
            color: palette[Math.floor(Math.random() * palette.length)],
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
      draw();
    };

    const draw = (now = performance.now()) => {
      context.setTransform(state.ratio, 0, 0, state.ratio, 0, 0);
      context.clearRect(0, 0, state.width, state.height);
      const progress = state.progress;

      if (progress > 0) {
        for (const pixel of state.pixels) {
          const reveal = 1 - smoothstep(progress - 0.12, progress + 0.12, pixel.distance);
          if (reveal <= 0.01) continue;

          const edge = Math.min(
            pixel.x,
            state.width - pixel.x,
            pixel.y,
            state.height - pixel.y,
          );
          const edgeFade = 1 - fade * (1 - smoothstep(0, Math.min(state.width, state.height) * 0.12, edge));
          const twinkle = reducedMotion ? 1 : 0.78 + Math.sin(now / 450 + pixel.phase) * 0.22;
          context.globalAlpha = reveal * edgeFade * opacity * twinkle;
          context.fillStyle = pixel.color;
          if (shape === 'diamond') {
            context.beginPath();
            context.moveTo(pixel.x, pixel.y - pixel.size);
            context.lineTo(pixel.x + pixel.size, pixel.y);
            context.lineTo(pixel.x, pixel.y + pixel.size);
            context.lineTo(pixel.x - pixel.size, pixel.y);
            context.closePath();
            context.fill();
          } else if (shape === 'circle') {
            context.beginPath();
            context.arc(pixel.x, pixel.y, pixel.size / 2, 0, Math.PI * 2);
            context.fill();
          } else {
            context.fillRect(
              pixel.x - pixel.size / 2,
              pixel.y - pixel.size / 2,
              pixel.size,
              pixel.size,
            );
          }
        }

        if (glow > 0 && spotlight > 0) {
          const glowRadius = Math.max(state.width, state.height) * spotlight;
          const gradient = context.createRadialGradient(
            state.pointerX,
            state.pointerY,
            0,
            state.pointerX,
            state.pointerY,
            glowRadius,
          );
          gradient.addColorStop(0, `${glowColor}33`);
          gradient.addColorStop(1, `${glowColor}00`);
          context.globalAlpha = glow;
          context.fillStyle = gradient;
          context.fillRect(0, 0, state.width, state.height);
        }
      }

      if (clickPulse && state.pulseAt) {
        const elapsed = now - state.pulseAt;
        if (elapsed < 500) {
          context.globalAlpha = (1 - elapsed / 500) * 0.45;
          context.strokeStyle = glowColor;
          context.lineWidth = 1;
          context.beginPath();
          context.arc(state.pulseX, state.pulseY, elapsed * 0.22, 0, Math.PI * 2);
          context.stroke();
        } else {
          state.pulseAt = 0;
        }
      }

      context.globalAlpha = 1;
    };

    const animate = now => {
      state.raf = 0;
      if (!state.alive) return;
      const duration = Math.max(1, revealDuration);
      const elapsed = now - state.transitionStart;
      const amount = reducedMotion ? 1 : clamp(elapsed / duration, 0, 1);
      state.progress = state.transitionFrom + (state.target - state.transitionFrom) * amount;
      draw(now);

      if (
        amount < 1 ||
        (state.target > 0 && !reducedMotion && speed > 0) ||
        (clickPulse && state.pulseAt > 0)
      ) {
        state.raf = requestAnimationFrame(animate);
      } else {
        state.last = 0;
      }
    };

    const wake = () => {
      if (!state.raf && state.alive) state.raf = requestAnimationFrame(animate);
    };

    const setReveal = (value, x = state.width / 2, y = state.height / 2) => {
      state.transitionFrom = state.progress;
      state.target = value ? 1 : 0;
      state.transitionStart = performance.now();
      if (value) {
        state.pointerX = x;
        state.pointerY = y;
        if (origin === 'pointer') {
          state.originX = x;
          state.originY = y;
          const maxDistance = Math.hypot(state.width, state.height) || 1;
          state.pixels.forEach(pixel => {
            pixel.distance = Math.hypot(pixel.x - x, pixel.y - y) / maxDistance;
          });
        }
      }
      setActive(value);
      wake();
    };

    const localPoint = event => {
      const rect = container.getBoundingClientRect();
      return [event.clientX - rect.left, event.clientY - rect.top];
    };
    const onEnter = event => {
      const [x, y] = localPoint(event);
      if (trigger === 'hover') setReveal(true, x, y);
    };
    const onMove = event => {
      [state.pointerX, state.pointerY] = localPoint(event);
      wake();
    };
    const onLeave = () => {
      if (trigger === 'hover') setReveal(false);
    };
    const onDown = event => {
      const [x, y] = localPoint(event);
      if (trigger === 'click') setReveal(!state.target, x, y);
      if (clickPulse) {
        state.pulseX = x;
        state.pulseY = y;
        state.pulseAt = performance.now();
        wake();
      }
    };
    const onFocus = () => {
      if (trigger === 'hover') setReveal(true);
    };
    const onBlur = event => {
      if (trigger === 'hover' && !container.contains(event.relatedTarget)) setReveal(false);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    container.addEventListener('pointerenter', onEnter);
    container.addEventListener('pointermove', onMove);
    container.addEventListener('pointerleave', onLeave);
    container.addEventListener('pointerdown', onDown);
    container.addEventListener('focusin', onFocus);
    container.addEventListener('focusout', onBlur);

    let introTimer;
    const visibilityObserver = new IntersectionObserver(entries => {
      if (!intro || reducedMotion || !entries.some(entry => entry.isIntersecting)) return;
      setReveal(true);
      introTimer = window.setTimeout(() => {
        if (trigger === 'hover') setReveal(false);
      }, revealDuration + 300);
      visibilityObserver.disconnect();
    });
    visibilityObserver.observe(container);

    return () => {
      state.alive = false;
      cancelAnimationFrame(state.raf);
      window.clearTimeout(introTimer);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      container.removeEventListener('pointerenter', onEnter);
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerleave', onLeave);
      container.removeEventListener('pointerdown', onDown);
      container.removeEventListener('focusin', onFocus);
      container.removeEventListener('focusout', onBlur);
    };
  }, [
    colors,
    gap,
    speed,
    pixelSize,
    shape,
    origin,
    revealDuration,
    spotlight,
    glow,
    glowColor,
    opacity,
    fade,
    trigger,
    clickPulse,
    intro,
  ]);

  return (
    <div
      ref={containerRef}
      className={`pixel-card ${className}`.trim()}
      data-theme={theme === 'light' ? 'light' : 'dark'}
      data-active={active || undefined}
      style={{ '--pixel-card-radius': `${radius}px`, ...style }}
      tabIndex={0}
    >
      <canvas className="pixel-card-canvas" aria-hidden="true" ref={canvasRef} />
      {children}
    </div>
  );
}
