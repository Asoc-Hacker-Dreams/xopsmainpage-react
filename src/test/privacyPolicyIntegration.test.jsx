import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '../App';

// Mock all the heavy components and hooks to avoid conflicts
vi.mock('../pages/Home', () => ({
  default: () => <div data-testid="home-page">Home Content</div>
}));

vi.mock('../pages/Organizer', () => ({
  default: () => <div data-testid="organizer-page">Organizer Content</div>
}));

vi.mock('../pages/Sponsor', () => ({
  default: () => <div data-testid="sponsor-page">Sponsor Content</div>
}));

vi.mock('../pages/archive/2024/Speakers2024', () => ({
  default: () => <div data-testid="speakers-2024-page">Speakers 2024 Content</div>
}));

vi.mock('../pages/archive/2024/Sponsor2024', () => ({
  default: () => <div data-testid="sponsor-2024-page">Sponsor 2024 Content</div>
}));

vi.mock('../pages/archive/2023/Speakers2023', () => ({
  default: () => <div data-testid="speakers-2023-page">Speakers 2023 Content</div>
}));

vi.mock('../ScrollHandler', () => ({
  default: () => null
}));

vi.mock('../components/AddToHomeScreen', () => ({
  default: () => null
}));

vi.mock('../hooks/usePWA', () => ({
  usePWA: () => ({
    canPrompt: false,
    promptInstall: vi.fn()
  })
}));

const AppWrapper = () => (
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);

describe('Privacy Policy Integration', () => {
  it('displays privacy policy link in footer', () => {
    render(<AppWrapper />);
    
    const privacyLink = screen.getByRole('link', { name: /Política de Privacidad/i });
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute('href', '/politica-de-privacidad');
  });

  it('navigates to privacy policy page when clicking the link', async () => {
    const user = userEvent.setup();
    render(<AppWrapper />);
    
    const privacyLink = screen.getByRole('link', { name: /Política de Privacidad/i });
    await user.click(privacyLink);
    
    // Check that we navigated to the privacy policy page
    expect(window.location.pathname).toBe('/politica-de-privacidad');
  });

  it('privacy policy page is accessible via direct URL', () => {
    // Test that the route exists
    window.history.pushState({}, 'Privacy Policy', '/politica-de-privacidad');
    render(<AppWrapper />);
    
    // The privacy policy page should render
    expect(screen.getByRole('heading', { name: /Política de Privacidad/i, level: 1 })).toBeInTheDocument();
  });

  it('privacy policy page contains required GDPR information', () => {
    window.history.pushState({}, 'Privacy Policy', '/politica-de-privacidad');
    render(<AppWrapper />);
    
    // Check for GDPR sections
    expect(screen.getByText(/Sus Derechos bajo el GDPR/i)).toBeInTheDocument();
    expect(screen.getByText(/Contacto para Privacidad/i)).toBeInTheDocument();
    
    // Check for contact email (there will be multiple instances)
    const emailElements = screen.getAllByText(/info@xopsconference.com/i);
    expect(emailElements.length).toBeGreaterThan(0);
  });

  it('privacy policy page contains contact information', () => {
    window.history.pushState({}, 'Privacy Policy', '/politica-de-privacidad');
    render(<AppWrapper />);
    
    // Check for contact information
    const emailLinks = screen.getAllByRole('link', { name: /info@xopsconference.com/i });
    expect(emailLinks.length).toBeGreaterThan(0);
    expect(emailLinks[0]).toHaveAttribute('href', 'mailto:info@xopsconference.com');
  });
});