// Runtime validation coverage for the Jobinz landing page render.
import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import App from '../App.jsx';

describe('Jobinz landing page', () => {
  it('renders the main page and questionnaire sections', () => {
    const markup = renderToStaticMarkup(React.createElement(App));

    expect(markup).toContain('Jobinz');
    expect(markup).toContain('questionnaire');
  });
});
