import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PrivacyPolicy from './PrivacyPolicy';

function mount(path = '/politica-de-privacidad/madrid') {
  window.history.pushState({}, '', path);
  return render(<HelmetProvider><BrowserRouter><PrivacyPolicy /></BrowserRouter></HelmetProvider>);
}

describe('PrivacyPolicy bilingual edition notices', () => {
  it('renders the Madrid GDPR notice with controller identity', () => {
    mount();
    expect(screen.getByRole('heading', { level: 1, name: /Política de privacidad/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Responsable del tratamiento/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Finalidades y bases jurídicas/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Transferencias internacionales/i })).toBeInTheDocument();
    expect(screen.getAllByText(/G56643158/).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', {name: /info@xopsconference.com/i}).length).toBeGreaterThan(0);
  });

  it('renders separate UAE PDPL rights, recipients and transfer sections', () => {
    mount('/politica-de-privacidad/dubai');
    expect(screen.getByRole('heading', { level: 1, name: /Dubái/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Marco normativo aplicable/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Derechos y marketing directo/i })).toBeInTheDocument();
  });
});
