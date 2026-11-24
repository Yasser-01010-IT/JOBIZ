import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Folder.css';

export default function Folder({
  label,
  items = [],
  icon,
  number,
  color = '#8b5cf6',
  paperColor = '#ffffff',
  layout = 'spread',
  size = 1,
  mode = 'flap',
  variant = 'solid',
  tabPosition = 'right',
  openOn = 'click',
  peek = true,
  intro = true,
  draggable = false,
  zoomOnClick = true,
  frost = 0.25,
  tilt = 0.5,
  speed = 1,
  bounce = 0.4,
  theme = 'dark',
  onItemClick,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [expandedItem, setExpandedItem] = useState(null);
  const sheetDialogRef = useRef(null);
  const scale = Math.max(0.7, Math.min(1.3, Number(size) || 1));
  const transitionSpeed = Math.max(0.2, 0.55 / Math.max(0.2, speed));

  useEffect(() => {
    if (expandedItem && sheetDialogRef.current && !sheetDialogRef.current.open) {
      sheetDialogRef.current.showModal();
    }
  }, [expandedItem]);

  const toggle = () => {
    if (openOn !== 'hover') setIsOpen(open => !open);
  };

  return (
    <div
      className={`folder-root${intro ? ' folder-intro' : ''}`}
      data-mode={mode}
      data-variant={variant}
      data-layout={layout}
      data-tab-position={tabPosition}
      data-theme={theme}
      data-open={isOpen || undefined}
      data-peek={peek || undefined}
      data-draggable={draggable || undefined}
      style={{
        '--folder-color': color,
        '--folder-paper': paperColor,
        '--folder-frost': `${1.5 + Math.max(0, Math.min(1, frost)) * 10}px`,
        '--folder-scale': scale,
        '--folder-tilt': `${tilt * 5}deg`,
        '--folder-speed': `${transitionSpeed}s`,
        '--folder-bounce': bounce,
      }}
    >
      <div className="folder-ground" aria-hidden="true" />
      <div className="folder-stage">
        <div className="folder-back">
          <div className="folder-documents" aria-hidden={!isOpen}>
            {items.slice(0, 3).map((item, index) => (
              <button
                key={`${item.title}-${index}`}
                type="button"
                className={`folder-document${selectedIndex === index ? ' folder-document-selected' : ''}`}
                disabled={!isOpen}
                tabIndex={isOpen ? 0 : -1}
                onClick={() => {
                  if (zoomOnClick) {
                    setSelectedIndex(selected => selected === index ? -1 : index);
                  } else {
                    setIsOpen(false);
                  }
                  onItemClick?.(item, index);
                  setExpandedItem(item);
                }}
                draggable={draggable && isOpen}
                onDragStart={event => {
                  event.dataTransfer.setData('text/plain', item.title ?? '');
                  event.dataTransfer.effectAllowed = 'copy';
                }}
                onDragEnd={() => {
                  setIsOpen(false);
                  setSelectedIndex(-1);
                }}
              >
                <span className="folder-doc-title">{item.title}</span>
                {item.description && <span className="folder-doc-text">{item.description}</span>}
                {item.stat && (
                  <span className="folder-doc-stat">
                    <span>Impact réel</span>
                    <strong>{item.stat}</strong>
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="folder-front"
            onClick={toggle}
            aria-expanded={isOpen}
            aria-label={`${isOpen ? 'Fermer' : 'Ouvrir'} le dossier ${label}`}
          >
            <span className="folder-number">{number}</span>
            {icon && <span className="folder-icon">{icon}</span>}
          </button>
        </div>
        <span className="folder-tab">{label}</span>
      </div>
      {expandedItem && createPortal(
        <dialog
          ref={sheetDialogRef}
          className="folder-sheet-dialog"
          aria-labelledby={`folder-sheet-title-${number ?? 'item'}`}
          onClose={() => {
            setExpandedItem(null);
            setSelectedIndex(-1);
          }}
          onClick={event => {
            if (event.target === event.currentTarget) event.currentTarget.close();
          }}
        >
          <article className="folder-sheet">
            <div className="folder-sheet-header">
              <span className="folder-sheet-kicker">
                DOSSIER {number && `· ${number}`}
              </span>
              <button
                type="button"
                className="folder-sheet-close"
                onClick={() => sheetDialogRef.current?.close()}
                aria-label="Fermer la feuille"
              >
                ×
              </button>
            </div>
            <h2 id={`folder-sheet-title-${number ?? 'item'}`}>{expandedItem.title}</h2>
            {expandedItem.description && <p>{expandedItem.description}</p>}
            {expandedItem.stat && (
              <div className="folder-sheet-stat">
                <span>Impact réel</span>
                <strong>{expandedItem.stat}</strong>
              </div>
            )}
          </article>
        </dialog>,
        document.body,
      )}
    </div>
  );
}
