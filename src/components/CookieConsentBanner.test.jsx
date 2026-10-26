import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CookieConsentBanner from './CookieConsentBanner';
import { ConsentProvider } from '../contexts/ConsentContext';

const useConsentMock = vi.hoisted(() => vi.fn());

// Mock the consent context with configurable mock
vi.mock('../contexts/ConsentContext', async () => {
  const actual = await vi.importActual('../contexts/ConsentContext');
  return {
    ...actual,
    useConsent: useConsentMock
  };
});

describe('CookieConsentBanner', () => {
  beforeEach(() => {
    useConsentMock.mockReturnValue({
      showBanner: true,
      acceptAll: vi.fn(),
      rejectAll: vi.fn(),
      savePreferences: vi.fn()
    });
  });

  it('should render banner when showBanner is true', () => {
    render(
      <ConsentProvider>
        <CookieConsentBanner />
      </ConsentProvider>
    );

    expect(screen.getByText('Privacidad y cookies')).toBeInTheDocument();
    expect(screen.getByText(/Usamos almacenamiento necesario/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aceptar todo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rechazar todo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Personalizar' })).toBeInTheDocument();
  });

  it('should not render when showBanner is false', () => {
    useConsentMock.mockReturnValueOnce({
      showBanner: false,
      acceptAll: vi.fn(),
      rejectAll: vi.fn(),
      savePreferences: vi.fn()
    });

    const { container } = render(<CookieConsentBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('should open preferences modal when Personalizar is clicked', () => {
    render(
      <ConsentProvider>
        <CookieConsentBanner />
      </ConsentProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Personalizar' }));

    expect(screen.getByText('Preferencias de privacidad')).toBeInTheDocument();
    expect(screen.getByText('Necesarias')).toBeInTheDocument();
    expect(screen.getByText('Analítica')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
  });

  it('should show correct descriptions for cookie categories', () => {
    render(
      <ConsentProvider>
        <CookieConsentBanner />
      </ConsentProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Personalizar' }));

    expect(screen.getByText(/Guardan tu elección de privacidad/)).toBeInTheDocument();
    expect(screen.getByText(/Google Analytics: medición de visitas/)).toBeInTheDocument();
    expect(screen.getByText(/Reserva esta preferencia/)).toBeInTheDocument();
  });

  it('should have essential cookies disabled by default', () => {
    render(
      <ConsentProvider>
        <CookieConsentBanner />
      </ConsentProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Personalizar' }));

    const essentialCheckbox = screen.getByRole('checkbox', { name: /Cookies Esenciales/i });
    expect(essentialCheckbox).toBeChecked();
    expect(essentialCheckbox).toBeDisabled();
  });

  it('should include link to cookie policy', () => {
    render(
      <ConsentProvider>
        <CookieConsentBanner />
      </ConsentProvider>
    );

    const policyLink = screen.getByRole('link', { name: 'Política de cookies' });
    expect(policyLink).toBeInTheDocument();
    expect(policyLink).toHaveAttribute('href', '/politica-de-cookies');
    expect(policyLink).toHaveAttribute('target', '_blank');
  });

  it('should be accessible with proper ARIA labels', () => {
    render(
      <ConsentProvider>
        <CookieConsentBanner />
      </ConsentProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Personalizar' }));

    // Check modal accessibility
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();

    // Check form accessibility
    const switches = screen.getAllByRole('checkbox');
    expect(switches.length).toBeGreaterThan(0);
  });
});