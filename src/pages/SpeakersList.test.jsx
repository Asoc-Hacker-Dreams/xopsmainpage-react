/**
 * Tests for SpeakersList component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SpeakersList from './SpeakersList';

// Mock the speaker DAL
vi.mock('../services/speakerDAL', () => ({
  getAllSpeakers: () => [
    {
      id: 'john-doe',
      slug: 'john-doe',
      name: 'John Doe',
      title: 'Senior Engineer',
      company: 'Tech Corp',
      bio: 'A passionate engineer',
      image: 'john.png',
      talks: [
        { id: 'talk-1', title: 'Talk 1', track: 'main', startTime: new Date('2025-11-21T10:00:00') }
      ]
    },
    {
      id: 'jane-smith',
      slug: 'jane-smith',
      name: 'Jane Smith',
      title: 'DevOps Lead',
      company: 'Cloud Inc',
      bio: 'DevOps expert',
      image: 'jane.png',
      talks: [
        { id: 'talk-2', title: 'Talk 2', track: 'hyperscalers', startTime: new Date('2025-11-21T11:00:00') }
      ]
    }
  ],
  getSpeakersByTrack: (track) => {
    const allSpeakers = [
      {
        id: 'john-doe',
        slug: 'john-doe',
        name: 'John Doe',
        title: 'Senior Engineer',
        company: 'Tech Corp',
        bio: 'A passionate engineer',
        image: 'john.png',
        talks: [
          { id: 'talk-1', title: 'Talk 1', track: 'main', startTime: new Date('2025-11-21T10:00:00') }
        ]
      }
    ];
    return track === 'main' ? allSpeakers : [];
  },
  getAllTracks: () => ['main', 'hyperscalers', 'bsides']
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <HelmetProvider>
        {component}
      </HelmetProvider>
    </BrowserRouter>
  );
};

describe('SpeakersList', () => {
  it('renders without crashing', () => {
    renderWithRouter(<SpeakersList />);
    expect(screen.getByText(/Nuestros Ponentes/i)).toBeInTheDocument();
  });

  it('displays all speakers by default', () => {
    renderWithRouter(<SpeakersList />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('shows track filter dropdown', () => {
    renderWithRouter(<SpeakersList />);
    const filterLabel = screen.getByText(/Filtrar por track/i);
    expect(filterLabel).toBeInTheDocument();
  });

  it('displays speaker cards with correct information', () => {
    renderWithRouter(<SpeakersList />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/Senior Engineer @ Tech Corp/i)).toBeInTheDocument();
    const talkCounts = screen.getAllByText(/1 charla/i);
    expect(talkCounts.length).toBeGreaterThan(0);
  });

  it('has links to speaker detail pages', () => {
    renderWithRouter(<SpeakersList />);
    
    const links = screen.getAllByText('Ver perfil');
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute('href', '/speakers/john-doe');
  });
});
