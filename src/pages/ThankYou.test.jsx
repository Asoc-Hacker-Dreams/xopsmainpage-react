import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ThankYou from './ThankYou';
import * as analytics from '../utils/analytics';

// Mock the analytics module
vi.mock('../utils/analytics', () => ({
  trackLeadSubmit: vi.fn()
}));

// Mock AnimationWrapper to avoid animation complexity in tests
vi.mock('../components/AnimationWrapper', () => ({
  default: ({ children }) => <div>{children}</div>
}));

// Mock SEO component
vi.mock('../components/SEO', () => ({
  default: () => null
}));

const renderWithRouter = (ui, { route = '/thank-you' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  
  return render(
    <HelmetProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </HelmetProvider>
  );
};

describe('ThankYou Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render thank you message', () => {
    renderWithRouter(<ThankYou />);
    
    expect(screen.getByText('¡Gracias por tu interés!')).toBeInTheDocument();
    expect(screen.getByText(/Tu solicitud ha sido enviada correctamente/i)).toBeInTheDocument();
  });

  it('should track lead submission with sponsor information from URL params', () => {
    const route = '/thank-you?sponsor_id=acme-corp-2025&tier=platinum&sponsor_name=ACME Corporation';
    renderWithRouter(<ThankYou />, { route });

    expect(analytics.trackLeadSubmit).toHaveBeenCalledWith({
      sponsor_id: 'acme-corp-2025',
      tier: 'platinum',
      sponsor_name: 'ACME Corporation'
    });
  });

  it('should display sponsor name when provided in URL params', () => {
    const route = '/thank-you?sponsor_id=acme-corp-2025&tier=platinum&sponsor_name=ACME Corporation';
    renderWithRouter(<ThankYou />, { route });

    expect(screen.getByText(/El equipo de/i)).toBeInTheDocument();
    expect(screen.getByText('ACME Corporation')).toBeInTheDocument();
  });

  it('should display resource link when provided in URL params', () => {
    const resourceUrl = 'https://example.com/resources';
    const route = `/thank-you?sponsor_id=acme-corp-2025&tier=platinum&resource_url=${encodeURIComponent(resourceUrl)}`;
    renderWithRouter(<ThankYou />, { route });

    const resourceLink = screen.getByText(/Ver recursos del patrocinador/i).closest('a');
    expect(resourceLink).toHaveAttribute('href', resourceUrl);
    expect(resourceLink).toHaveAttribute('target', '_blank');
  });

  it('should not track event when sponsor_id or tier is missing', () => {
    const route = '/thank-you?sponsor_id=acme-corp-2025';
    renderWithRouter(<ThankYou />, { route });

    expect(analytics.trackLeadSubmit).not.toHaveBeenCalled();
  });

  it('should render navigation links', () => {
    renderWithRouter(<ThankYou />);

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Ponentes')).toBeInTheDocument();
    expect(screen.getByText('Agenda')).toBeInTheDocument();
  });

  it('should render link to all sponsors', () => {
    const route = '/thank-you?sponsor_id=acme-corp-2025&tier=platinum';
    renderWithRouter(<ThankYou />, { route });

    const sponsorsLink = screen.getByText('Ver todos los patrocinadores').closest('a');
    expect(sponsorsLink).toHaveAttribute('href', '/Sponsor');
  });

  it('should show success icon', () => {
    renderWithRouter(<ThankYou />);
    
    // Check for the success checkmark
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('should display resources section only when sponsor info is present', () => {
    const { rerender } = renderWithRouter(<ThankYou />);
    
    // Without sponsor info
    expect(screen.queryByText('Recursos del Patrocinador')).not.toBeInTheDocument();
    
    // Unmount and render with sponsor info
    const route = '/thank-you?sponsor_id=acme-corp-2025&tier=platinum';
    renderWithRouter(<ThankYou />, { route });
    
    expect(screen.getByText('Recursos del Patrocinador')).toBeInTheDocument();
  });

  it('should handle different sponsor tiers correctly', () => {
    const tiers = ['platinum', 'gold', 'silver', 'community'];
    
    tiers.forEach(tier => {
      vi.clearAllMocks();
      const route = `/thank-you?sponsor_id=sponsor-${tier}&tier=${tier}&sponsor_name=Test Sponsor`;
      
      const { unmount } = renderWithRouter(<ThankYou />, { route });
      
      expect(analytics.trackLeadSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          tier,
          sponsor_id: `sponsor-${tier}`
        })
      );
      
      unmount();
    });
  });
});
