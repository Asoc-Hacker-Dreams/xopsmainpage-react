import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import React from 'react';

const mockFavorites: any[] = [];

vi.mock('../../src/storage/idb/db', () => {
  const talks = [
    {
      id: 'talk-1',
      title: 'Favorite Talk',
      description: 'Test',
      day: '2025-11-21',
      startTime: '09:30',
      endTime: '10:00',
      track: 'main',
      room: 'Aula magna',
      speakerIds: [],
      tags: [],
    },
  ];

  return {
    db: {
      talks: {
        orderBy: () => ({ toArray: () => Promise.resolve(talks) }),
        where: () => ({
          equals: () => ({
            sortBy: () => Promise.resolve(talks),
          }),
        }),
        bulkPut: vi.fn().mockResolvedValue(undefined),
      },
      speakers: {
        orderBy: () => ({ toArray: () => Promise.resolve([]) }),
        bulkPut: vi.fn().mockResolvedValue(undefined),
      },
      favorites: {
        toArray: () => Promise.resolve([...mockFavorites]),
        get: (id: string) => Promise.resolve(mockFavorites.find(f => f.id === id)),
        put: vi.fn().mockImplementation((fav) => {
          mockFavorites.push(fav);
          return Promise.resolve();
        }),
        delete: vi.fn().mockImplementation((id) => {
          const idx = mockFavorites.findIndex(f => f.id === id);
          if (idx >= 0) mockFavorites.splice(idx, 1);
          return Promise.resolve();
        }),
      },
    },
    XopsDatabase: vi.fn(),
  };
});

vi.mock('../../src/data/talks2025', () => ({ talks2025: [] }));
vi.mock('../../src/data/speakers2025', () => ({ speakers2025: [] }));

import MyAgenda from '../../src/pages/MyAgenda';
import Agenda from '../../src/pages/Agenda';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <HelmetProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </HelmetProvider>
  );
}

describe('Favorites / MyAgenda', () => {
  beforeEach(() => {
    mockFavorites.length = 0;
  });

  it('shows empty state when no favorites', async () => {
    renderWithProviders(<MyAgenda />);
    await waitFor(() => {
      expect(screen.getByText('No tienes charlas favoritas aún.')).toBeDefined();
    });
  });

  it('shows explore link in empty state', async () => {
    renderWithProviders(<MyAgenda />);
    await waitFor(() => {
      expect(screen.getByText('Explorar agenda')).toBeDefined();
    });
  });

  it('has ICS export button (disabled when empty)', async () => {
    renderWithProviders(<MyAgenda />);
    await waitFor(() => {
      const btn = screen.getByText('📥 Exportar ICS');
      expect(btn).toBeDefined();
      expect((btn as HTMLButtonElement).disabled).toBe(true);
    });
  });

  it('shows favorite talks when present', async () => {
    mockFavorites.push({ id: 'fav-talk-1', talkId: 'talk-1', addedAt: new Date().toISOString() });
    renderWithProviders(<MyAgenda />);
    await waitFor(() => {
      expect(screen.getByText('Favorite Talk')).toBeDefined();
    });
  });
});

describe('ICS generation', () => {
  it('generates valid ICS content', async () => {
    const { generateICS } = await import('../../src/utils/ics');
    const talks = [
      {
        id: 'test-talk',
        title: 'Test Talk',
        description: 'Hello',
        day: '2025-11-21',
        startTime: '09:30',
        endTime: '10:00',
        track: 'main',
        room: 'Aula magna',
      },
    ];
    const ics = generateICS(talks as any);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('SUMMARY:Test Talk');
    expect(ics).toContain('DTSTART;TZID=Europe/Madrid:20251121T093000');
    expect(ics).toContain('DTEND;TZID=Europe/Madrid:20251121T100000');
    expect(ics).toContain('LOCATION:Aula magna');
  });
});
