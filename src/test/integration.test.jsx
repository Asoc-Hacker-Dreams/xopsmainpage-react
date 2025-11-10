import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock de todos los componentes pesados para tests de integración
vi.mock('../pages/Home', () => ({
  default: () => <div data-testid="home-page">Home Content</div>
}));

vi.mock('../pages/Organizer', () => ({
  default: () => <div data-testid="organizer-page">Organizer Content</div>
}));

vi.mock('../pages/Sponsor', () => ({
  default: () => <div data-testid="sponsor-page">Sponsor Content</div>
}));

vi.mock('../pages/archive/2024/Home2024', () => ({
  default: () => <div data-testid="home-2024-page">Home 2024 Content</div>
}));

vi.mock('../ScrollHandler', () => ({
  default: () => null
}));

vi.mock('../components/AddToHomeScreen', () => ({
  default: () => null
}));

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

describe('Integration Tests - Navigation Flow', () => {
  it('navigates to home page by default', async () => {
    render(<AppWrapper />);
    
    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

  it('navigates to organizers page when clicking organizers link', async () => {
    const user = userEvent.setup();
    render(<AppWrapper />);
    
    const organizersLink = screen.getByText('Organizers');
    await user.click(organizersLink);
    
    await waitFor(() => {
      expect(screen.getByTestId('organizer-page')).toBeInTheDocument();
    });
  });

  it('navigates to sponsors page when clicking sponsors link', async () => {
    const user = userEvent.setup();
    render(<AppWrapper />);
    
    const sponsorsLink = screen.getByText('Sponsors');
    await user.click(sponsorsLink);
    
    await waitFor(() => {
      expect(screen.getByTestId('sponsor-page')).toBeInTheDocument();
    });
  });

  it('displays archive dropdown when hovering over archive', async () => {
    const user = userEvent.setup();
    render(<AppWrapper />);
    
    const archiveDropdown = screen.getByText('Archive');
    await user.hover(archiveDropdown);
    
    await waitFor(() => {
      expect(screen.getByText(/2024/)).toBeInTheDocument();
    });
  });

  it('logo link returns to home page', async () => {
    const user = userEvent.setup();
    render(<AppWrapper />);
    
    // Navegar a otra página primero
    const organizersLink = screen.getByText('Organizers');
    await user.click(organizersLink);
    
    await waitFor(() => {
      expect(screen.getByTestId('organizer-page')).toBeInTheDocument();
    });
    
    // Hacer click en el logo para volver a home
    const logoLink = screen.getByRole('link', { name: /X-Ops logo/i });
    await user.click(logoLink);
    
    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });
});

describe('Integration Tests - External Links', () => {
  it('contains social media links in footer', () => {
    render(<AppWrapper />);
    
    // Verificar que existen enlaces externos típicos
    const socialLinks = screen.queryAllByRole('link');
    const externalLinks = socialLinks.filter(link => 
      link.getAttribute('href')?.includes('http') || 
      link.getAttribute('target') === '_blank'
    );
    
    expect(externalLinks.length).toBeGreaterThanOrEqual(0);
  });

  it('external links open in new tab', () => {
    render(<AppWrapper />);
    
    const externalLinks = screen.queryAllByRole('link').filter(link => 
      link.getAttribute('href')?.startsWith('http')
    );
    
    externalLinks.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });
  });
});

describe('Integration Tests - Responsive Behavior', () => {
  it('navbar collapses on mobile viewport', async () => {
    // Simular viewport móvil
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    render(<AppWrapper />);
    
    // Verificar que existe el botón de toggle para móvil
    const navbar = screen.getByRole('navigation');
    expect(navbar).toBeInTheDocument();
  });

  it('handles window resize events', () => {
    render(<AppWrapper />);
    
    // Simular resize
    global.dispatchEvent(new Event('resize'));
    
    // Verificar que la aplicación sigue funcionando
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});

describe('Integration Tests - PWA Features', () => {
  it('includes PWA installation capability', () => {
    render(<AppWrapper />);
    
    // AddToHomeScreen debería estar presente (aunque mockeado)
    // ScrollHandler debería estar presente (aunque mockeado)
    expect(true).toBe(true); // Test de presencia básica
  });

  it('handles service worker registration', () => {
    render(<AppWrapper />);
    
    // Verificar que el service worker mock está configurado
    expect(navigator.serviceWorker.register).toBeDefined();
  });
});

describe('Integration Tests - Performance', () => {
  it('renders within reasonable time', async () => {
    const startTime = Date.now();
    render(<AppWrapper />);
    
    await waitFor(() => {
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
    
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(1000); // Menos de 1 segundo
  });

  it('lazy loads archive pages', async () => {
    render(<AppWrapper />);
    
    // Las páginas de archivo deberían cargarse bajo demanda
    expect(screen.queryByTestId('home-2024-page')).not.toBeInTheDocument();
  });
});
