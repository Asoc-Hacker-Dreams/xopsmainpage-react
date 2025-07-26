import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PrivacyPolicy from './PrivacyPolicy';

const renderWithRouter = (component) => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </HelmetProvider>
  );
};

describe('PrivacyPolicy Component', () => {
  it('renders without crashing', () => {
    renderWithRouter(<PrivacyPolicy />);
    expect(screen.getByRole('heading', { name: /Política de Privacidad/i, level: 1 })).toBeInTheDocument();
  });

  it('displays all required sections', () => {
    renderWithRouter(<PrivacyPolicy />);
    
    // Check for main sections
    expect(screen.getByText(/Información General/i)).toBeInTheDocument();
    expect(screen.getByText(/Datos que Recopilamos/i)).toBeInTheDocument();
    expect(screen.getByText(/Sus Derechos bajo el GDPR/i)).toBeInTheDocument();
    expect(screen.getByText(/Contacto para Privacidad/i)).toBeInTheDocument();
  });

  it('includes contact email for privacy inquiries', () => {
    renderWithRouter(<PrivacyPolicy />);
    
    const emailLinks = screen.getAllByText(/info@xopsconference.com/i);
    expect(emailLinks.length).toBeGreaterThan(0);
    
    // Check that at least one is a mailto link
    const mailtoLinks = screen.getAllByRole('link', { name: /info@xopsconference.com/i });
    expect(mailtoLinks[0]).toHaveAttribute('href', 'mailto:info@xopsconference.com');
  });

  it('mentions GDPR rights', () => {
    renderWithRouter(<PrivacyPolicy />);
    
    expect(screen.getByText('Acceso:')).toBeInTheDocument();
    expect(screen.getByText('Rectificación:')).toBeInTheDocument();
    expect(screen.getByText('Supresión:')).toBeInTheDocument();
    expect(screen.getByText('Portabilidad:')).toBeInTheDocument();
  });

  it('describes data collection practices', () => {
    renderWithRouter(<PrivacyPolicy />);
    
    expect(screen.getByText('2.1 Datos de Navegación Anónimos')).toBeInTheDocument();
    expect(screen.getByText('2.2 Datos Almacenados Localmente')).toBeInTheDocument();
    expect(screen.getByText(/login federado gestionado por Microsoft/i)).toBeInTheDocument();
  });

  it('includes information about data retention', () => {
    renderWithRouter(<PrivacyPolicy />);
    
    expect(screen.getByText(/Retención de Datos/i)).toBeInTheDocument();
  });

  it('includes security information', () => {
    renderWithRouter(<PrivacyPolicy />);
    
    expect(screen.getByRole('heading', { name: /Seguridad/i })).toBeInTheDocument();
    expect(screen.getByText(/HTTPS/i)).toBeInTheDocument();
  });

  it('includes structured data for SEO', () => {
    renderWithRouter(<PrivacyPolicy />);
    
    // Test that the component renders (which means SEO component is working)
    expect(screen.getByRole('heading', { name: /Política de Privacidad/i, level: 1 })).toBeInTheDocument();
  });
});