import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SponsorDetail from './SponsorDetail';

// Mock the sponsors data
vi.mock('../data/sponsors.json', () => ({
  default: {
    sponsors: [
      {
        id: 'test-sponsor',
        slug: 'test-sponsor',
        name: 'Test Sponsor',
        tier: 'oro',
        logo: '/test-logo.png',
        description: 'This is a test sponsor description.',
        website: 'https://example.com',
        ctas: [
          { text: 'Visit Website', url: 'https://example.com', type: 'primary' },
        ],
        socialMedia: {
          twitter: 'https://twitter.com/test',
        },
        assets: [],
      },
    ],
  },
}));

const renderWithRouter = (slug) => {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[`/sponsors/${slug}`]}>
        <SponsorDetail />
      </MemoryRouter>
    </HelmetProvider>
  );
};

describe('SponsorDetail', () => {
  it('renders sponsor details for valid slug', () => {
    // Mock useParams to return test-sponsor
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({ slug: 'test-sponsor' }),
      };
    });

    render(
      <HelmetProvider>
        <BrowserRouter>
          <SponsorDetail />
        </BrowserRouter>
      </HelmetProvider>
    );

    expect(screen.getByText('Test Sponsor')).toBeInTheDocument();
    expect(screen.getByText('This is a test sponsor description.')).toBeInTheDocument();
  });

  it('renders 404 message for invalid slug', () => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({ slug: 'invalid-slug' }),
      };
    });

    render(
      <HelmetProvider>
        <BrowserRouter>
          <SponsorDetail />
        </BrowserRouter>
      </HelmetProvider>
    );

    expect(screen.getByText(/patrocinador no encontrado/i)).toBeInTheDocument();
  });

  it('has back to sponsors link', () => {
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({ slug: 'test-sponsor' }),
      };
    });

    render(
      <HelmetProvider>
        <BrowserRouter>
          <SponsorDetail />
        </BrowserRouter>
      </HelmetProvider>
    );

    const backLink = screen.getByRole('button', { name: /ver todos los patrocinadores/i });
    expect(backLink).toBeInTheDocument();
  });
});
