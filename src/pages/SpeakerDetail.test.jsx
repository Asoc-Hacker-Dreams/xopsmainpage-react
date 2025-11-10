/**
 * Tests for SpeakerDetail component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SpeakerDetail from './SpeakerDetail';

// Mock the speaker DAL
vi.mock('../services/speakerDAL', () => ({
  getSpeaker: (slug) => {
    if (slug === 'john-doe') {
      return {
        id: 'john-doe',
        slug: 'john-doe',
        name: 'John Doe',
        title: 'Senior Engineer',
        company: 'Tech Corp',
        bio: 'A passionate engineer with years of experience',
        image: 'john.png',
        social: {
          twitter: 'https://twitter.com/johndoe',
          linkedin: 'https://linkedin.com/in/johndoe'
        },
        talks: [
          {
            id: 'talk-1',
            title: 'Introduction to DevOps',
            description: 'Learn the basics of DevOps',
            track: 'main',
            type: 'keynote',
            room: 'Aula magna',
            durationMinutes: 45,
            durationHuman: '45m',
            timeISO: '2025-11-21T10:00:00',
            startTime: new Date('2025-11-21T10:00:00'),
            speakers: ['John Doe']
          }
        ]
      };
    }
    return null;
  }
}));

const renderWithRouter = (initialPath = '/speakers/john-doe') => {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/speakers/:slug" element={<SpeakerDetail />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  );
};

describe('SpeakerDetail', () => {
  it('renders speaker information', () => {
    renderWithRouter();
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/Senior Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/Tech Corp/i)).toBeInTheDocument();
    expect(screen.getByText(/A passionate engineer with years of experience/i)).toBeInTheDocument();
  });

  it('displays speaker talks', () => {
    renderWithRouter();
    
    expect(screen.getByText(/Charlas \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText('Introduction to DevOps')).toBeInTheDocument();
    expect(screen.getByText(/Learn the basics of DevOps/i)).toBeInTheDocument();
  });

  it('shows social media links when available', () => {
    renderWithRouter();
    
    expect(screen.getByText(/Redes Sociales/i)).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
  });

  it('displays talk metadata correctly', () => {
    renderWithRouter();
    
    expect(screen.getByText(/Principal/i)).toBeInTheDocument(); // Track badge
    expect(screen.getByText(/keynote/i)).toBeInTheDocument(); // Type badge
    expect(screen.getByText(/Aula magna/i)).toBeInTheDocument(); // Room
  });

  it('has back button to speakers list', () => {
    renderWithRouter();
    
    const backButton = screen.getByText(/Volver a ponentes/i);
    expect(backButton).toBeInTheDocument();
    expect(backButton.closest('a')).toHaveAttribute('href', '/speakers');
  });
});
