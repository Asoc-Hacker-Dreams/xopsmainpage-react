import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SponsorAbout from './SponsorAbout';

describe('SponsorAbout', () => {
  it('renders description', () => {
    render(
      <SponsorAbout
        description="This is a test description"
      />
    );
    
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('renders heading', () => {
    render(
      <SponsorAbout
        description="Test description"
      />
    );
    
    expect(screen.getByRole('heading', { name: /acerca de/i })).toBeInTheDocument();
  });

  it('renders social media links when provided', () => {
    render(
      <SponsorAbout
        description="Test description"
        socialMedia={{
          twitter: 'https://twitter.com/test',
          linkedin: 'https://linkedin.com/company/test',
        }}
      />
    );
    
    const twitterLink = screen.getByRole('link', { name: /twitter/i });
    expect(twitterLink).toBeInTheDocument();
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/test');
    
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/company/test');
  });

  it('does not render social media section when not provided', () => {
    render(
      <SponsorAbout
        description="Test description"
      />
    );
    
    expect(screen.queryByRole('heading', { name: /síguenos/i })).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <SponsorAbout
        description="Test description"
      />
    );
    
    const section = screen.getByLabelText(/acerca de/i);
    expect(section).toBeInTheDocument();
  });
});
