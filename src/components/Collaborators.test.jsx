import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Collaborators from './Collaborators'

// Mock de AnimationWrapper
vi.mock('./AnimationWrapper', () => ({
  default: ({ children }) => <div data-testid="animation-wrapper">{children}</div>
}))

describe('Collaborators Component', () => {
  it('renders without crashing', () => {
    render(<Collaborators />)
    
    expect(screen.getAllByText(/Colaboradores/i).length).toBeGreaterThan(0)
  })

  it('displays collaborators section title', () => {
    render(<Collaborators />)
    
    const titles = screen.getAllByRole('heading', { level: 2 })
    expect(titles.length).toBeGreaterThan(0)
    expect(titles.some(title => title.textContent.match(/colaboradores/i))).toBeTruthy()
  })

  it('renders collaborator logos', () => {
    render(<Collaborators />)
    
    // Verificar que existen imágenes de colaboradores
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('has proper section structure', () => {
    render(<Collaborators />)
    
    const section = screen.getByRole('region')
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute('id', 'colaboradores')
  })

  it('includes community description', () => {
    render(<Collaborators />)
    
    // Verificar que hay descripción sobre la comunidad
    const description = screen.getByText(/comunidad/i)
    expect(description).toBeInTheDocument()
  })

  it('displays sponsor logos with proper alt text', () => {
    render(<Collaborators />)
    
    const images = screen.getAllByRole('img')
    images.forEach(img => {
      expect(img).toHaveAttribute('alt')
      expect(img.getAttribute('alt')).not.toBe('')
    })
  })

  it('includes animation wrappers for visual effects', () => {
    render(<Collaborators />)
    
    const animationWrappers = screen.getAllByTestId('animation-wrapper')
    expect(animationWrappers.length).toBeGreaterThan(0)
  })
})
