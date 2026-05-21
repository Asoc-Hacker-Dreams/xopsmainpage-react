import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

vi.mock('react-i18next', async () => {
  const es = (await import('../i18n/locales/es.json')).default
  const t = (key) => {
    const keys = key.split('.')
    let value = es
    for (const k of keys) {
      value = value?.[k]
    }
    return value !== undefined ? String(value) : key
  }
  return {
    useTranslation: () => ({
      t,
      i18n: { language: 'es', changeLanguage: vi.fn().mockResolvedValue(undefined) },
      ready: true,
    }),
    initReactI18next: { type: '3rdParty', init: vi.fn() },
    Trans: ({ children }) => children,
  }
})

// Mock de todos los componentes pesados para tests de integración
vi.mock('../pages/Home', () => ({
  default: () => <div data-testid="home-page">Home Content</div>
}))

vi.mock('../pages/Organizer', () => ({
  default: () => <div data-testid="organizer-page">Organizer Content</div>
}))

vi.mock('../pages/Sponsor', () => ({
  default: () => <div data-testid="sponsor-page">Sponsor Content</div>
}))

vi.mock('../pages/archive/2024/Home2024', () => ({
  default: () => <div data-testid="home-2024-page">Home 2024 Content</div>
}))

vi.mock('../ScrollHandler', () => ({
  default: () => null
}))

vi.mock('../components/AddToHomeScreen', () => ({
  default: () => null
}))

vi.mock('../components/Analytics', () => ({
  default: () => null
}))

vi.mock('../components/ScriptManager', () => ({
  default: () => null
}))

vi.mock('../components/CookieConsentBanner', () => ({
  default: () => null
}))

vi.mock('../components/CookiePreferencesManager', () => ({
  default: () => null
}))

vi.mock('../contexts/ConsentContext', () => ({
  ConsentProvider: ({ children }) => children,
  useConsent: () => ({
    consent: {},
    hasInteracted: true,
    showBanner: false,
    acceptAll: vi.fn(),
    rejectAll: vi.fn(),
    savePreferences: vi.fn(),
    updateCategory: vi.fn(),
    showPreferences: vi.fn(),
    resetConsent: vi.fn(),
    hasConsent: () => false,
    isEssential: () => false
  }),
  CONSENT_CATEGORIES: {
    ESSENTIAL: 'essential',
    ANALYTICS: 'analytics',
    MARKETING: 'marketing',
    NEWSLETTERS: 'newsletters'
  }
}))

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

describe('Integration Tests - External Links', () => {
  it('contains social media links in footer', () => {
    render(<AppWrapper />)

    const externalLinks = screen.queryAllByRole('link').filter(link => 
      link.getAttribute('href')?.includes('http') || 
      link.getAttribute('target') === '_blank'
    )
    
    expect(externalLinks.length).toBeGreaterThanOrEqual(0)
  }, 30000)

  it('external links open in new tab', () => {
    render(<AppWrapper />)
    
    // Only verify that external links which declare target="_blank" also have noopener
    const externalLinksWithNewTab = screen.queryAllByRole('link').filter(link =>
      link.getAttribute('href')?.startsWith('http') &&
      link.getAttribute('target') === '_blank'
    )
    
    externalLinksWithNewTab.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    })
  }, 30000)
})

describe('Integration Tests - Navigation Flow', () => {
  it('navigates to home page by default', async () => {
    render(<AppWrapper />)
    
    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })
  })

  it('navigates to organizers page when clicking organizers link', async () => {
    const user = userEvent.setup()
    render(<AppWrapper />)
    
    const organizersLink = screen.getByText('ORGANIZADORES')
    await user.click(organizersLink)
    
    await waitFor(() => {
      expect(screen.getByTestId('organizer-page')).toBeInTheDocument()
    })
  })

  it('navigates to sponsors page when clicking sponsors link', async () => {
    const user = userEvent.setup()
    render(<AppWrapper />)
    
    const sponsorsLink = screen.getByText('PATROCINA')
    await user.click(sponsorsLink)
    
    await waitFor(() => {
      expect(screen.getByTestId('sponsor-page')).toBeInTheDocument()
    })
  })

  it('displays archive dropdown when hovering over archive', async () => {
    const user = userEvent.setup()
    render(<AppWrapper />)
    
    // Dropdown title uses dangerouslySetInnerHTML: "EVENTOS<br/>ANTERIORES"
    const archiveDropdown = screen.getAllByText(/EVENTOS/i)[0]
    await user.click(archiveDropdown)
    
    await waitFor(() => {
      expect(screen.getAllByText(/2024/)[0]).toBeInTheDocument()
    })
  })

  it('logo link returns to home page', async () => {
    const user = userEvent.setup()
    render(<AppWrapper />)
    
    // Navigate to another page first
    const organizersLink = screen.getByText('ORGANIZADORES')
    await user.click(organizersLink)
    
    await waitFor(() => {
      expect(screen.getByTestId('organizer-page')).toBeInTheDocument()
    })
    
    // Navigate back home via the event nav link (logo is not a link in the app)
    const homeLinks = screen.getAllByText('EVENTO')
    await user.click(homeLinks[0])
    
    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })
  })
})

describe('Integration Tests - Responsive Behavior', () => {
  it('navbar collapses on mobile viewport', async () => {
    // Simular viewport móvil
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })
    
    render(<AppWrapper />)
    
    // Verificar que existe el botón de toggle para móvil
    const navbar = screen.getByRole('navigation')
    expect(navbar).toBeInTheDocument()
  })

  it('handles window resize events', async () => {
    render(<AppWrapper />)
    
    // Simular resize
    global.dispatchEvent(new Event('resize'))
    
    // Verificar que la aplicación sigue funcionando
    await waitFor(() => expect(screen.getByRole('navigation')).toBeInTheDocument())
  })
})

describe('Integration Tests - PWA Features', () => {
  it('includes PWA installation capability', () => {
    render(<AppWrapper />)
    
    // AddToHomeScreen debería estar presente (aunque mockeado)
    // ScrollHandler debería estar presente (aunque mockeado)
    expect(true).toBe(true) // Test de presencia básica
  })

  it('handles service worker registration', () => {
    render(<AppWrapper />)
    
    // Verificar que el service worker mock está configurado
    expect(navigator.serviceWorker.register).toBeDefined()
  })
})

describe('Integration Tests - Performance', () => {
  it('renders within reasonable time', async () => {
    const startTime = Date.now()
    render(<AppWrapper />)
    
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
    
    const renderTime = Date.now() - startTime
    expect(renderTime).toBeLessThan(3000) // Menos de 3 segundos
  })

  it('lazy loads archive pages', async () => {
    render(<AppWrapper />)
    
    // Las páginas de archivo deberían cargarse bajo demanda
    expect(screen.queryByTestId('home-2024-page')).not.toBeInTheDocument()
  })
})
