// Runtime validation coverage for the AvenirGo landing page render.
import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../App.jsx';

describe('AvenirGo landing page', () => {
  it('renders the main page and questionnaire sections', () => {
    const markup = renderToStaticMarkup(React.createElement(App));

    expect(markup).toContain('AvenirGo');
    expect(markup).toContain('questionnaire');
    expect(markup).toContain('Ce que AvenirGo t’apporte');
    expect(markup).toContain('Les services proposés par AvenirGo');
    expect(markup).not.toContain('Recherche classique');
  });
});
