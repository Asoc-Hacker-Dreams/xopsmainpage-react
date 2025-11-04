import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SponsorHeader from './SponsorHeader';

describe('SponsorHeader', () => {
  it('renders sponsor name and tier', () => {
    render(
      <SponsorHeader
        name="Test Sponsor"
        tier="oro"
        website="https://example.com"
      />
    );
    
    expect(screen.getByText('Test Sponsor')).toBeInTheDocument();
    expect(screen.getByText('Patrocinador Oro')).toBeInTheDocument();
  });

  it('renders logo when provided', () => {
    render(
      <SponsorHeader
        name="Test Sponsor"
        tier="plata"
        logo="/test-logo.png"
        website="https://example.com"
      />
    );
    
    const logo = screen.getByAltText('Logo de Test Sponsor');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/test-logo.png');
  });

  it('renders website link when provided', () => {
    render(
      <SponsorHeader
        name="Test Sponsor"
        tier="colaborador"
        website="https://example.com"
      />
    );
    
    const link = screen.getByRole('link', { name: /visitar sitio web/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('does not render website link for # urls', () => {
    render(
      <SponsorHeader
        name="Test Sponsor"
        tier="oro"
        website="#"
      />
    );
    
    expect(screen.queryByRole('link', { name: /visitar sitio web/i })).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <SponsorHeader
        name="Test Sponsor"
        tier="oro"
        website="https://example.com"
      />
    );
    
    const banner = screen.getByRole('banner');
    expect(banner).toBeInTheDocument();
    
    const heading = screen.getByRole('heading', { name: 'Test Sponsor' });
    expect(heading).toHaveAttribute('tabIndex', '0');
  });
});
