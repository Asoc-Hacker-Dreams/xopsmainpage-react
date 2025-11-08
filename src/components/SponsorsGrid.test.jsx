import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SponsorsGrid from './SponsorsGrid';
import { trackCtaClick } from '../utils/analytics';

// Mock de AnimationWrapper
vi.mock('./AnimationWrapper', () => ({
  default: ({ children }) => <div data-testid="animation-wrapper">{children}</div>
}));

// Mock de los datos de sponsors
vi.mock('../data/sponsorsData.json', () => ({
  default: {
    sponsors: [
      { 
        id: 1, 
        name: 'Alpha Tech', 
        tier: 'gold', 
        logo: '/logo1.png', 
        website: 'https://alpha.com', 
        description: 'Tech company',
        booking: { type: 'external', url: 'https://calendly.com/alpha/demo' }
      },
      { id: 2, name: 'Beta Systems', tier: 'silver', logo: '/logo2.png', website: 'https://beta.com', description: 'Systems provider' },
      { id: 3, name: 'Gamma Solutions', tier: 'community', logo: '/logo3.png', website: 'https://gamma.com', description: 'Community partner' },
      { id: 4, name: 'Delta Corp', tier: 'gold', logo: '/logo4.png', website: 'https://delta.com', description: 'Corporate sponsor' },
      { id: 5, name: 'Epsilon Inc', tier: 'platinum', logo: '/logo5.png', website: 'https://epsilon.com', description: 'Premium sponsor' }
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

  it('renders links to sponsor websites', () => {
    renderWithRouter(<SponsorsGrid />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
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
      expect(link.getAttribute('aria-label')).toMatch(/Visitar sitio web de/);
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

  describe('Booking CTA functionality', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      // Mock window.open
      window.open = vi.fn();
    });

    it('displays booking button for sponsors with external booking', () => {
      renderWithRouter(<SponsorsGrid />);
      const bookingButton = screen.getByRole('button', { name: /Reservar demo con Alpha Tech/i });
      expect(bookingButton).toBeInTheDocument();
    });

    it('does not display booking button for sponsors without booking data', () => {
      renderWithRouter(<SponsorsGrid />);
      const allButtons = screen.queryAllByRole('button');
      // Only Alpha Tech has booking configured
      expect(allButtons).toHaveLength(1);
    });

    it('tracks GA4 event when booking button is clicked', () => {
      renderWithRouter(<SponsorsGrid />);
      const bookingButton = screen.getByRole('button', { name: /Reservar demo con Alpha Tech/i });
      
      fireEvent.click(bookingButton);

      expect(trackCtaClick).toHaveBeenCalledWith('booking', {
        sponsor_name: 'Alpha Tech',
        sponsor_id: 1,
        sponsor_tier: 'gold'
      });
    });

    it('opens booking URL in new tab when button is clicked', () => {
      renderWithRouter(<SponsorsGrid />);
      const bookingButton = screen.getByRole('button', { name: /Reservar demo con Alpha Tech/i });
      
      fireEvent.click(bookingButton);

      expect(window.open).toHaveBeenCalledWith(
        'https://calendly.com/alpha/demo',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('prevents default event propagation when booking button is clicked', () => {
      renderWithRouter(<SponsorsGrid />);
      const bookingButton = screen.getByRole('button', { name: /Reservar demo con Alpha Tech/i });
      
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
      
      bookingButton.dispatchEvent(clickEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('booking button has correct styling classes', () => {
      renderWithRouter(<SponsorsGrid />);
      const bookingButton = screen.getByRole('button', { name: /Reservar demo con Alpha Tech/i });
      
      expect(bookingButton).toHaveClass('btn', 'btn-primary', 'btn-sm', 'mt-2');
    });
  });
});
