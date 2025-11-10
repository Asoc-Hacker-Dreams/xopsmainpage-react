import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SponsorCTAs from './SponsorCTAs';

describe('SponsorCTAs', () => {
  it('renders CTAs when provided', () => {
    const ctas = [
      { text: 'Visit Website', url: 'https://example.com', type: 'primary' },
      { text: 'Contact Us', url: 'https://example.com/contact', type: 'secondary' },
    ];
    
    render(<SponsorCTAs ctas={ctas} />);
    
    expect(screen.getByRole('button', { name: 'Visit Website' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Contact Us' })).toBeInTheDocument();
  });

  it('does not render when no CTAs provided', () => {
    const { container } = render(<SponsorCTAs ctas={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders CTAs with correct links', () => {
    const ctas = [
      { text: 'Visit Website', url: 'https://example.com', type: 'primary' },
    ];
    
    render(<SponsorCTAs ctas={ctas} />);
    
    const button = screen.getByRole('button', { name: 'Visit Website' });
    expect(button).toHaveAttribute('href', 'https://example.com');
    expect(button).toHaveAttribute('target', '_blank');
    expect(button).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders internal links without target blank', () => {
    const ctas = [
      { text: 'About', url: '/about', type: 'primary' },
    ];
    
    render(<SponsorCTAs ctas={ctas} />);
    
    const button = screen.getByRole('button', { name: 'About' });
    expect(button).toHaveAttribute('href', '/about');
    expect(button).toHaveAttribute('target', '_self');
  });

  it('has proper accessibility attributes', () => {
    const ctas = [
      { text: 'Visit Website', url: 'https://example.com', type: 'primary' },
    ];
    
    render(<SponsorCTAs ctas={ctas} />);
    
    expect(screen.getByLabelText(/conoce más/i)).toBeInTheDocument();
  });
});
