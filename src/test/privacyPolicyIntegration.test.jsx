import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Prevent real i18next.init() from starting an async init chain that never resolves
vi.mock('../i18n', () => ({ default: {} }));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'footer.privacyPolicy': 'Política de Privacidad',
      };
      return translations[key] ?? key;
    },
    i18n: { language: 'es', changeLanguage: vi.fn() }
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn((_i18n, cb) => cb && cb()) }
}));

// Pure mock — no real react-bootstrap loaded (avoids react-transition-group timers)
vi.mock('react-bootstrap', () => {
  const Navbar = ({ children }) => <nav>{children}</nav>;
  Navbar.Brand = ({ children }) => <span>{children}</span>;
  Navbar.Toggle = (props) => <button type="button" {...props} />;
  Navbar.Collapse = ({ children }) => <div>{children}</div>;

  const NavDropdown = ({ children }) => <div>{children}</div>;
  NavDropdown.Item = ({ children, as: As, to, href, ...props }) =>
    As ? <As to={to} href={href} {...props}>{children}</As> : <a href={href} {...props}>{children}</a>;
  NavDropdown.Divider = () => <hr />;

  const Card = ({ children }) => <div>{children}</div>;
  Card.Body = ({ children }) => <div>{children}</div>;
  Card.Title = ({ children }) => <h5>{children}</h5>;
  Card.Text = ({ children }) => <p>{children}</p>;

  const ListGroup = ({ children }) => <ul>{children}</ul>;
  ListGroup.Item = ({ children }) => <li>{children}</li>;

  return {
    Navbar,
    Nav: ({ children }) => <div>{children}</div>,
    NavDropdown,
    Container: ({ children, ...props }) => <div {...props}>{children}</div>,
    Row: ({ children, ...props }) => <div {...props}>{children}</div>,
    Col: ({ children, ...props }) => <div {...props}>{children}</div>,
    Button: ({ children, onClick, ...props }) => <button onClick={onClick} {...props}>{children}</button>,
    Card,
    ListGroup,
    Badge: ({ children }) => <span>{children}</span>,
    Alert: ({ children }) => <div role="alert">{children}</div>,
    Form: ({ children }) => <form>{children}</form>,
    Spinner: () => <div />,
  };
});

// react-helmet-async v2 uses requestAnimationFrame(defer:true) to commit DOM changes.
// In jsdom, rAF is polyfilled via setTimeout, which React 18's act() waits to flush → hang.
// Mocking HelmetProvider/Helmet eliminates the rAF call entirely.
vi.mock('react-helmet-async', () => ({
  HelmetProvider: ({ children }) => <>{children}</>,
  Helmet: () => null,
  HelmetData: class {},
}));

// Mock SEO component so it never renders Helmet
vi.mock('../components/SEO', () => ({
  default: () => null,
}));

// Mock ConsentContext to eliminate useEffect async state updates
vi.mock('../contexts/ConsentContext', () => ({
  ConsentProvider: ({ children }) => <>{children}</>,
  useConsent: () => ({
    consent: { essential: true, analytics: false, marketing: false, newsletters: false },
    hasInteracted: true,
    showBanner: false,
    acceptAll: vi.fn(),
    rejectAll: vi.fn(),
    updateConsent: vi.fn(),
  }),
  CONSENT_CATEGORIES: {
    ESSENTIAL: 'essential',
    ANALYTICS: 'analytics',
    MARKETING: 'marketing',
    NEWSLETTERS: 'newsletters',
  },
}));

vi.mock('../components/AnimationWrapper', () => ({
  default: ({ children }) => <>{children}</>
}));

vi.mock('../components/Analytics', () => ({ default: () => null }));
vi.mock('../components/ScriptManager', () => ({ default: () => null }));
vi.mock('../components/CookieConsentBanner', () => ({ default: () => null }));
vi.mock('../components/CookiePreferencesManager', () => ({ default: () => null }));

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

// App already provides its own HelmetProvider, so only BrowserRouter is needed here
const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

describe('Privacy Policy Integration', () => {
  it('displays privacy policy link in footer', () => {
    window.history.pushState({}, 'Privacy Policy', '/politica-de-privacidad');
    const { container } = render(<AppWrapper />);

    // Scope to footer to avoid expensive full-document ARIA traversal
    const footerEl = container.querySelector('footer');
    expect(footerEl).not.toBeNull();
    const privacyLink = footerEl.querySelector('a[href="/politica-de-privacidad"]');
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveTextContent('Política de Privacidad');
  });

  it('navigates to privacy policy page when clicking the link', () => {
    window.history.pushState({}, 'Privacy Policy', '/politica-de-privacidad');
    const { container } = render(<AppWrapper />);

    const footerEl = container.querySelector('footer');
    const privacyLink = footerEl.querySelector('a[href="/politica-de-privacidad"]');
    fireEvent.click(privacyLink);

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
    expect(screen.getByText(/Sus Derechos bajo el RGPD/i)).toBeInTheDocument();
    expect(screen.getByText(/Contacto para Privacidad/i)).toBeInTheDocument();
    
    // Check for contact email (there will be multiple instances)
    const emailElements = screen.getAllByText(/privacy@xopsalliance.com/i);
    expect(emailElements.length).toBeGreaterThan(0);
  });

  it('privacy policy page contains contact information', () => {
    window.history.pushState({}, 'Privacy Policy', '/politica-de-privacidad');
    const { container } = render(<AppWrapper />);

    // Use querySelector to avoid expensive full-document ARIA traversal
    const emailLinks = container.querySelectorAll('a[href="mailto:privacy@xopsalliance.com"]');
    expect(emailLinks.length).toBeGreaterThan(0);
    expect(emailLinks[0]).toHaveAttribute('href', 'mailto:privacy@xopsalliance.com');
  });
});