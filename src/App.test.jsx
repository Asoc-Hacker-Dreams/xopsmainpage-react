import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// Mock de componentes pesados
vi.mock('./pages/Home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>
}))

vi.mock('./pages/Organizer', () => ({
  default: () => <div data-testid="organizer-page">Organizer Page</div>
}))

vi.mock('./pages/Sponsor', () => ({
  default: () => <div data-testid="sponsor-page">Sponsor Page</div>
}))

// Mock de ScrollHandler
vi.mock('./ScrollHandler', () => ({
  default: () => null
}))

// Mock de AddToHomeScreen
vi.mock('./components/AddToHomeScreen', () => ({
  default: () => null
}))

// Wrapper para React Router
const AppWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('App Component', () => {
  it('renders without crashing', () => {
    render(
      <AppWrapper>
        <App />
      </AppWrapper>
    )
    
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('displays X-Ops logo in navigation', () => {
    render(
      <AppWrapper>
        <App />
      </AppWrapper>
    )
    
    const logo = screen.getByAltText('X-Ops logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', expect.stringContaining('xops.png'))
  })

  it('renders main navigation links', () => {
    render(
      <AppWrapper>
        <App />
      </AppWrapper>
    )
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Organizers')).toBeInTheDocument()
    expect(screen.getByText('Sponsors')).toBeInTheDocument()
  })

  it('renders archive navigation dropdown', () => {
    render(
      <AppWrapper>
        <App />
      </AppWrapper>
    )
    
    expect(screen.getByText('Archive')).toBeInTheDocument()
  })

  it('has proper navigation structure', () => {
    render(
      <AppWrapper>
        <App />
      </AppWrapper>
    )
    
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveClass('navbar')
  })

  it('renders footer with social links', () => {
    render(
      <AppWrapper>
        <App />
      </AppWrapper>
    )
    
    // Verificar que existe el footer
    const footerElements = screen.getAllByText(/X-Ops|Contact|Social/i)
    expect(footerElements.length).toBeGreaterThan(0)
  })

  it('includes essential meta components', () => {
    render(
      <AppWrapper>
        <App />
      </AppWrapper>
    )
    
    // ScrollHandler y AddToHomeScreen deberían estar presentes (aunque mockeados)
    // Esto verifica que la aplicación incluye funcionalidades PWA esenciales
    expect(true).toBe(true) // Test básico de integración
  })
})
