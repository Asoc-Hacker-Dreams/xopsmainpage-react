import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import React from 'react';

// Mock Dexie before importing components
vi.mock('../../src/storage/idb/db', () => {
  const talks = [
    {
      id: 'talk-1',
      title: 'Keynote Test',
      description: 'A test keynote',
      day: '2025-11-21',
      startTime: '09:30',
      endTime: '10:00',
      track: 'main',
      room: 'Aula magna',
      speakerIds: ['speaker-1'],
      tags: ['keynote'],
    },
    {
      id: 'talk-2',
      title: 'Security Talk',
      description: 'About security',
      day: '2025-11-22',
      startTime: '10:30',
      endTime: '11:30',
      track: 'bsides',
      room: 'Bsides Madrid',
      speakerIds: ['speaker-2'],
      tags: [],
    },
  ];

  return {
    db: {
      talks: {
        orderBy: () => ({ toArray: () => Promise.resolve(talks) }),
        where: (field: string) => ({
          equals: (val: string) => ({
            sortBy: () => Promise.resolve(talks.filter((t: any) => (t as any)[field] === val)),
          }),
        }),
        bulkPut: vi.fn().mockResolvedValue(undefined),
        toArray: () => Promise.resolve(talks),
      },
      speakers: {
        orderBy: () => ({ toArray: () => Promise.resolve([]) }),
        bulkPut: vi.fn().mockResolvedValue(undefined),
      },
      favorites: {
        toArray: () => Promise.resolve([]),
        get: () => Promise.resolve(undefined),
        put: vi.fn().mockResolvedValue(undefined),
        delete: vi.fn().mockResolvedValue(undefined),
      },
    },
    XopsDatabase: vi.fn(),
  };
});

vi.mock('../../src/data/talks2025', () => ({ talks2025: [] }));
vi.mock('../../src/data/speakers2025', () => ({ speakers2025: [] }));

import Agenda from '../../src/pages/Agenda';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <HelmetProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </HelmetProvider>
  );
}

describe('Agenda Page', () => {
  it('renders the agenda heading', async () => {
    renderWithProviders(<Agenda />);
    expect(screen.getByText('Agenda')).toBeDefined();
  });

  it('shows talks after loading', async () => {
    renderWithProviders(<Agenda />);
    await waitFor(() => {
      expect(screen.getByText('Keynote Test')).toBeDefined();
      expect(screen.getByText('Security Talk')).toBeDefined();
    });
  });

  it('shows filter dropdowns', async () => {
    renderWithProviders(<Agenda />);
    await waitFor(() => {
      expect(screen.getByLabelText('Filtrar por día')).toBeDefined();
      expect(screen.getByLabelText('Filtrar por track')).toBeDefined();
      expect(screen.getByLabelText('Filtrar por sala')).toBeDefined();
    });
  });

  it('filters by search', async () => {
    renderWithProviders(<Agenda />);
    await waitFor(() => screen.getByText('Keynote Test'));

    const searchInput = screen.getByLabelText('Buscar charla');
    fireEvent.change(searchInput, { target: { value: 'Security' } });

    await waitFor(() => {
      expect(screen.getByText('Security Talk')).toBeDefined();
      expect(screen.queryByText('Keynote Test')).toBeNull();
    });
  });

  it('has export ICS button', async () => {
    renderWithProviders(<Agenda />);
    await waitFor(() => {
      expect(screen.getByText('📥 Exportar ICS')).toBeDefined();
    });
  });

  it('has link to Mi Agenda', async () => {
    renderWithProviders(<Agenda />);
    await waitFor(() => {
      expect(screen.getByText('⭐ Mi Agenda')).toBeDefined();
    });
  });
});
