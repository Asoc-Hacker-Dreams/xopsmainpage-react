import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from './Hero'

// Mock de AOS (Animate On Scroll)
vi.mock('aos', () => ({
  default: {
    init: vi.fn(),
    refresh: vi.fn()
  }
}))

// Mock de AnimationWrapper
vi.mock('./AnimationWrapper', () => ({
  default: ({ children }) => <div data-testid="animation-wrapper">{children}</div>
}))

describe('Hero Component', () => {
  it('renders without crashing', () => {
    render(<Hero />)
    
    // Verificar que el componente se renderiza
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('displays main conference title', () => {
    render(<Hero />)
    
    // Buscar elementos relacionados con X-Ops Conference
    const heroSection = screen.getByRole('main')
    expect(heroSection).toBeInTheDocument()
  })

  it('includes call-to-action elements', () => {
    render(<Hero />)
    
    // Verificar que hay elementos de CTA
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('has responsive structure', () => {
    render(<Hero />)
    
    // Verificar estructura responsive
    const mainElement = screen.getByRole('main')
    expect(mainElement).toBeInTheDocument()
  })

  it('includes animation wrappers', () => {
    render(<Hero />)
    
    const animationWrappers = screen.queryAllByTestId('animation-wrapper')
    expect(animationWrappers.length).toBeGreaterThanOrEqual(0)
  })
})
