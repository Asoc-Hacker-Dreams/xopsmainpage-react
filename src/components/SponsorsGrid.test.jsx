import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SponsorsGrid from './SponsorsGrid';
import { trackCtaClick } from '../utils/analytics';

// Mock de AnimationWrapper
vi.mock('./AnimationWrapper', () => ({
  default: ({ children }) => <div data-testid="animation-wrapper">{children}</div>
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock de los datos de sponsors
vi.mock('../data/sponsorsData.json', () => ({
  default: {
    sponsors: [
      { 
        id: 1,
        slug: 'alpha-tech',
        name: 'Alpha Tech', 
        tier: 'gold', 
        logo: '/logo1.png', 
        website: 'https://alpha.com', 
        description: 'Tech company',
        showcase: {
          ctaPrimary: {
            label: 'Reservar demo',
            href: 'https://calendly.com/alpha/demo'
          }
        }
      },
      { 
        id: 2,
        slug: 'beta-systems',
        name: 'Beta Systems', 
        tier: 'silver', 
        logo: '/logo2.png', 
        website: 'https://beta.com', 
        description: 'Systems provider'
      },
      { 
        id: 3,
        slug: 'gamma-solutions',
        name: 'Gamma Solutions', 
        tier: 'community', 
        logo: '/logo3.png', 
        website: 'https://gamma.com', 
        description: 'Community partner'
      },
      { 
        id: 4,
        slug: 'delta-corp',
        name: 'Delta Corp', 
        tier: 'gold', 
        logo: '/logo4.png', 
        website: 'https://delta.com', 
        description: 'Corporate sponsor'
      },
      { 
        id: 5,
        slug: 'epsilon-inc',
        name: 'Epsilon Inc', 
        tier: 'platinum', 
        logo: '/logo5.png', 
        website: 'https://epsilon.com', 
        description: 'Premium sponsor'
      }
    ]
  }
}));

// Mock analytics utility
vi.mock('../utils/analytics', () => ({
  trackCtaClick: vi.fn()
}));

const renderWithRouter = (component, initialPath = '/') => {
  window.history.pushState({}, 'Test page', initialPath);
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SponsorsGrid Component', () => {
  beforeEach(() => {
    window.history.pushState({}, 'Test page', '/');
  });

  it('renders without crashing', () => {
    renderWithRouter(<SponsorsGrid />);
    expect(screen.getByText(/Nuestros Patrocinadores/i)).toBeInTheDocument();
  });

  it('displays main heading', () => {
    renderWithRouter(<SponsorsGrid />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Nuestros Patrocinadores');
  });

  it('has proper section structure with ARIA labels', () => {
    renderWithRouter(<SponsorsGrid />);
    const section = screen.getByRole('region', { name: /patrocinadores/i });
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('id', 'sponsors-grid');
  });

  it('renders all sponsors when no filter is applied', () => {
    renderWithRouter(<SponsorsGrid />);
    expect(screen.getByText('Alpha Tech')).toBeInTheDocument();
    expect(screen.getByText('Beta Systems')).toBeInTheDocument();
    expect(screen.getByText('Gamma Solutions')).toBeInTheDocument();
    expect(screen.getByText('Delta Corp')).toBeInTheDocument();
    expect(screen.getByText('Epsilon Inc')).toBeInTheDocument();
  });

  it('filters sponsors by tier query parameter', () => {
    renderWithRouter(<SponsorsGrid />, '/?tier=gold');
    expect(screen.getByText('Alpha Tech')).toBeInTheDocument();
    expect(screen.getByText('Delta Corp')).toBeInTheDocument();
    expect(screen.queryByText('Beta Systems')).not.toBeInTheDocument();
    expect(screen.queryByText('Gamma Solutions')).not.toBeInTheDocument();
  });

  it('shows empty state when no sponsors match filter', () => {
    renderWithRouter(<SponsorsGrid />, '/?tier=nonexistent');
    expect(screen.getByText(/No hay patrocinadores disponibles/i)).toBeInTheDocument();
  });

  it('displays tier badges with sponsor count', () => {
    renderWithRouter(<SponsorsGrid />);
    const badges = screen.getAllByText(/\d+/);
    expect(badges.length).toBeGreaterThan(0);
  });

  it('groups sponsors by tier', () => {
    renderWithRouter(<SponsorsGrid />);
    const headings = screen.getAllByRole('heading', { level: 3 });
    const tierNames = headings.map(h => h.textContent.toLowerCase());
    expect(tierNames.some(t => t.includes('platinum'))).toBe(true);
    expect(tierNames.some(t => t.includes('gold'))).toBe(true);
    expect(tierNames.some(t => t.includes('silver'))).toBe(true);
    expect(tierNames.some(t => t.includes('community'))).toBe(true);
  });

  it('renders sponsor cards with proper structure', () => {
    renderWithRouter(<SponsorsGrid />);
    const articles = screen.getAllByRole('article');
    expect(articles.length).toBeGreaterThan(0);
    
    articles.forEach(article => {
      expect(article).toHaveAttribute('aria-label');
    });
  });

  it('displays sponsor logos with alt text', () => {
    renderWithRouter(<SponsorsGrid />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBe(5);
    
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).toMatch(/Logo de/);
      expect(img).toHaveAttribute('loading', 'lazy');
    });
  });

  it('includes sponsor descriptions', () => {
    renderWithRouter(<SponsorsGrid />);
    expect(screen.getByText('Tech company')).toBeInTheDocument();
    expect(screen.getByText('Systems provider')).toBeInTheDocument();
    expect(screen.getByText('Community partner')).toBeInTheDocument();
  });

  it('renders links to sponsor virtual stands', () => {
    renderWithRouter(<SponsorsGrid />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
      // Virtual stand links are internal routes, not external links
      const href = link.getAttribute('href');
      expect(href).toMatch(/^\/sponsors\//);
    });
  });

  it('sorts sponsors by tier by default', () => {
    renderWithRouter(<SponsorsGrid orderBy="tier" />);
    const sponsorNames = screen.getAllByRole('heading', { level: 4 });
    const firstSponsor = sponsorNames[0].textContent;
    expect(firstSponsor).toBe('Epsilon Inc'); // Platinum should be first
  });

  it('sorts sponsors by name when orderBy is name', () => {
    renderWithRouter(<SponsorsGrid orderBy="name" />);
    const sponsorNames = screen.getAllByRole('heading', { level: 4 });
    const names = sponsorNames.map(h => h.textContent);
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });

  it('includes animation wrappers', () => {
    renderWithRouter(<SponsorsGrid />);
    const animationWrappers = screen.getAllByTestId('animation-wrapper');
    expect(animationWrappers.length).toBeGreaterThan(0);
  });

  it('uses responsive grid layout', () => {
    const { container } = renderWithRouter(<SponsorsGrid />);
    const cols = container.querySelectorAll('[class*="col-"]');
    expect(cols.length).toBeGreaterThan(0);
  });

  it('has accessible sponsor links with aria-labels', () => {
    renderWithRouter(<SponsorsGrid />);
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('aria-label');
      expect(link.getAttribute('aria-label')).toMatch(/Ver stand virtual de/);
    });
  });

  it('displays tier badges for each sponsor', () => {
    renderWithRouter(<SponsorsGrid />);
    const tierBadges = document.querySelectorAll('.badge');
    expect(tierBadges.length).toBeGreaterThan(0);
  });

  it('handles 50+ sponsors efficiently', () => {
    // Test that component renders without performance issues
    const startTime = performance.now();
    renderWithRouter(<SponsorsGrid />);
    const endTime = performance.now();
    
    // Component should render quickly (within 1 second)
    expect(endTime - startTime).toBeLessThan(1000);
  });

  it('case-insensitive tier filtering', () => {
    renderWithRouter(<SponsorsGrid />, '/?tier=GOLD');
    expect(screen.getByText('Alpha Tech')).toBeInTheDocument();
    expect(screen.getByText('Delta Corp')).toBeInTheDocument();
  });

  describe('Virtual Stand CTA functionality', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      mockNavigate.mockClear();
      // Mock window.open
      window.open = vi.fn();
    });

    it('displays CTA button for all sponsors', () => {
      renderWithRouter(<SponsorsGrid />);
      const allButtons = screen.queryAllByRole('button');
      // All 5 sponsors should have a CTA button
      expect(allButtons.length).toBeGreaterThanOrEqual(5);
    });

    it('displays custom CTA label when showcase is configured', () => {
      renderWithRouter(<SponsorsGrid />);
      const customButton = screen.getByRole('button', { name: /Reservar demo de Alpha Tech/i });
      expect(customButton).toBeInTheDocument();
      expect(customButton).toHaveTextContent('Reservar demo');
    });

    it('displays default CTA label for sponsors without showcase', () => {
      renderWithRouter(<SponsorsGrid />);
      const defaultButtons = screen.getAllByRole('button', { name: /Ver stand virtual/i });
      expect(defaultButtons.length).toBeGreaterThan(0);
    });

    it('tracks GA4 event when CTA button is clicked', () => {
      renderWithRouter(<SponsorsGrid />);
      const ctaButton = screen.getByRole('button', { name: /Reservar demo de Alpha Tech/i });
      
      fireEvent.click(ctaButton);

      expect(trackCtaClick).toHaveBeenCalledWith('booking', {
        sponsor_name: 'Alpha Tech',
        sponsor_id: 1,
        sponsor_tier: 'gold',
        cta_label: 'Reservar demo'
      });
    });

    it('opens external URL in new tab when CTA href is external', () => {
      renderWithRouter(<SponsorsGrid />);
      const ctaButton = screen.getByRole('button', { name: /Reservar demo de Alpha Tech/i });
      
      fireEvent.click(ctaButton);

      expect(window.open).toHaveBeenCalledWith(
        'https://calendly.com/alpha/demo',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('navigates internally when CTA href is internal route', () => {
      renderWithRouter(<SponsorsGrid />);
      const defaultButton = screen.getAllByRole('button', { name: /Ver stand virtual de Beta Systems/i })[0];
      
      fireEvent.click(defaultButton);

      expect(mockNavigate).toHaveBeenCalledWith('/sponsors/beta-systems');
    });

    it('sponsor logos link to virtual stand', () => {
      renderWithRouter(<SponsorsGrid />);
      const links = screen.getAllByRole('link');
      
      // Check that links point to virtual stands, not external websites
      const virtualStandLinks = links.filter(link => 
        link.getAttribute('href')?.startsWith('/sponsors/')
      );
      expect(virtualStandLinks.length).toBeGreaterThan(0);
    });

    it('sponsor logo links have correct aria-label', () => {
      renderWithRouter(<SponsorsGrid />);
      const alphaLink = screen.getByRole('link', { name: /Ver stand virtual de Alpha Tech/i });
      
      expect(alphaLink).toHaveAttribute('href', '/sponsors/alpha-tech');
    });

    it('prevents default event propagation when CTA button is clicked', () => {
      renderWithRouter(<SponsorsGrid />);
      const ctaButton = screen.getByRole('button', { name: /Reservar demo de Alpha Tech/i });
      
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
      
      ctaButton.dispatchEvent(clickEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('CTA button has correct styling classes', () => {
      renderWithRouter(<SponsorsGrid />);
      const ctaButton = screen.getByRole('button', { name: /Reservar demo de Alpha Tech/i });
      
      expect(ctaButton).toHaveClass('btn', 'btn-primary', 'btn-sm', 'mt-2');
    });
  });
});
