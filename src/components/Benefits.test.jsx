import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Benefits from './Benefits'

// Mock de AnimationWrapper
vi.mock('./AnimationWrapper', () => ({
  default: ({ children }) => <div data-testid="animation-wrapper">{children}</div>
}))

// Mock de react-icons
vi.mock('react-icons/bs', () => ({
  BsMegaphone: () => <div data-testid="megaphone-icon">🔊</div>,
  BsGlobe: () => <div data-testid="globe-icon">🌐</div>
}))

describe('Benefits Component', () => {
  it('renders without crashing', () => {
    render(<Benefits />)
    
    expect(screen.getByText(/Colaboración y Patrocinio/i)).toBeInTheDocument()
  })

  it('displays main sponsorship heading', () => {
    render(<Benefits />)
    
    const heading = screen.getByText('Colaboración y Patrocinio')
    expect(heading).toBeInTheDocument()
    expect(heading.tagName).toBe('H2')
  })

  it('includes X-Ops Conference branding', () => {
    render(<Benefits />)
    
    expect(screen.getByText(/X-Ops Conference/i)).toBeInTheDocument()
  })

  it('displays sponsorship question heading', () => {
    render(<Benefits />)
    
    expect(screen.getByText(/¿Por qué patrocinar la X-Ops Conference?/i)).toBeInTheDocument()
  })

  it('includes value proposition for sponsors', () => {
    render(<Benefits />)
    
    expect(screen.getByText(/posicionarte como líder/i)).toBeInTheDocument()
    expect(screen.getByText(/visibilidad ante una audiencia/i)).toBeInTheDocument()
  })

  it('renders sponsor conference image', () => {
    render(<Benefits />)
    
    const bannerImg = screen.getByAltText('Sponsor Conference')
    expect(bannerImg).toBeInTheDocument()
    expect(bannerImg).toHaveAttribute('src', expect.stringContaining('banner'))
  })

  it('has proper section structure', () => {
    render(<Benefits />)
    
    const section = screen.getByRole('region')
    expect(section).toHaveAttribute('id', 'patrocinio')
    expect(section).toHaveClass('collaboration-sponsorship-section')
  })

  it('includes animation wrappers', () => {
    render(<Benefits />)
    
    const animationWrappers = screen.getAllByTestId('animation-wrapper')
    expect(animationWrappers.length).toBeGreaterThan(0)
  })

  it('displays benefits list with icons', () => {
    render(<Benefits />)
    
    // Verificar que los iconos están presentes
    const megaphoneIcon = screen.getByTestId('megaphone-icon')
    const globeIcon = screen.getByTestId('globe-icon')
    
    expect(megaphoneIcon).toBeInTheDocument()
    expect(globeIcon).toBeInTheDocument()
  })

  it('has responsive grid layout', () => {
    render(<Benefits />)
    
    const rowElements = document.querySelectorAll('.row')
    expect(rowElements.length).toBeGreaterThan(0)
    
    const colElements = document.querySelectorAll('[class*="col-"]')
    expect(colElements.length).toBeGreaterThan(0)
  })

  it('includes call to action for sponsors', () => {
    render(<Benefits />)
    
    expect(screen.getByText(/No te pierdas la oportunidad/i)).toBeInTheDocument()
    expect(screen.getByText(/fortalecer tu presencia en el mercado/i)).toBeInTheDocument()
  })
})
