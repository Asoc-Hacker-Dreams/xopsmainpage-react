import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Events from './Events';
import * as useAgendaHook from '../../hooks/useAgenda';

// Mock the useAgenda hook
vi.mock('../../hooks/useAgenda', () => ({
  useAgenda: vi.fn()
}));

describe('Events Component', () => {
  const mockScheduleData = [
    {
      id: 1,
      speaker: 'Juan Vicente Herrera Ruiz de Alejo',
      talk: 'Keynote de Bienvenida',
      description: 'Bienvenida oficial al evento',
      timeRaw: '2025-11-21 09:30:00',
      timeISO: '2025-11-21T09:30',
      durationMinutes: 30,
      durationHuman: '30m',
      room: 'Aula magna',
      type: 'keynote',
      track: 'main'
    },
    {
      id: 2,
      speaker: 'Luis Guirigay',
      talk: 'Keynote del track exclusivo de AWS',
      description: 'Track AWS',
      timeRaw: '2025-11-21 10:30:00',
      timeISO: '2025-11-21T10:30',
      durationMinutes: 30,
      durationHuman: '30m',
      room: 'Hyperscalers',
      type: 'keynote',
      track: 'hyperscalers'
    },
    {
      id: 3,
      speaker: 'Carlos Polop',
      talk: 'GCP Vulnerabilities',
      description: 'Security talk',
      timeRaw: '2025-11-22 10:30:00',
      timeISO: '2025-11-22T10:30',
      durationMinutes: 60,
      durationHuman: '1h 0m',
      room: 'Bsides Madrid',
      track: 'bsides'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state when no cached data exists', () => {
    useAgendaHook.useAgenda.mockReturnValue({
      agenda: [],
      loading: true,
      error: null,
      isStale: false,
      lastSync: null
    });

    render(<Events />);
    
    expect(screen.getByText(/Cargando horario del evento/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render schedule data from IndexedDB immediately', async () => {
    useAgendaHook.useAgenda.mockReturnValue({
      agenda: mockScheduleData,
      loading: false,
      error: null,
      isStale: true,
      lastSync: '2024-11-04T10:00:00Z'
    });

    render(<Events />);
    
    await waitFor(() => {
      expect(screen.getByText(/Horario del Evento 2025/i)).toBeInTheDocument();
    });
    
    // Should show the update notification
    expect(screen.getByText(/Actualizando horario/i)).toBeInTheDocument();
    
    // Should show event data
    expect(screen.getByText('Keynote de Bienvenida')).toBeInTheDocument();
  });

  it('should not show loading spinner when cached data is available', () => {
    useAgendaHook.useAgenda.mockReturnValue({
      agenda: mockScheduleData,
      loading: false,
      error: null,
      isStale: false,
      lastSync: '2024-11-04T10:00:00Z'
    });

    render(<Events />);
    
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Keynote de Bienvenida')).toBeInTheDocument();
  });

  it('should show error message when fetch fails and no cached data', () => {
    useAgendaHook.useAgenda.mockReturnValue({
      agenda: [],
      loading: false,
      error: 'Network error',
      isStale: false,
      lastSync: null
    });

    render(<Events />);
    
    expect(screen.getByText(/No se pudo cargar el horario del evento/i)).toBeInTheDocument();
  });

  it('should show warning when fetch fails but cached data exists', () => {
    useAgendaHook.useAgenda.mockReturnValue({
      agenda: mockScheduleData,
      loading: false,
      error: 'Network error',
      isStale: false,
      lastSync: '2024-11-04T10:00:00Z'
    });

    render(<Events />);
    
    expect(screen.getByText(/No se pudo actualizar el horario/i)).toBeInTheDocument();
    expect(screen.getByText(/Mostrando datos guardados/i)).toBeInTheDocument();
    
    // Data should still be visible
    expect(screen.getByText('Keynote de Bienvenida')).toBeInTheDocument();
  });

  it('should filter events by day', async () => {
    const user = userEvent.setup();
    
    useAgendaHook.useAgenda.mockReturnValue({
      agenda: mockScheduleData,
      loading: false,
      error: null,
      isStale: false,
      lastSync: '2024-11-04T10:00:00Z'
    });

    render(<Events />);
    
    // Initially shows first day events
    expect(screen.getByText('Keynote de Bienvenida')).toBeInTheDocument();
    expect(screen.queryByText('GCP Vulnerabilities')).not.toBeInTheDocument();
    
    // Click on second day button
    const dayButtons = screen.getAllByRole('button');
    const day2Button = dayButtons.find(btn => btn.textContent.includes('22/11'));
    
    if (day2Button) {
      await user.click(day2Button);
      
      await waitFor(() => {
        expect(screen.queryByText('Keynote de Bienvenida')).not.toBeInTheDocument();
        expect(screen.getByText('GCP Vulnerabilities')).toBeInTheDocument();
      });
    }
  });

  it('should filter events by track', async () => {
    const user = userEvent.setup();
    
    useAgendaHook.useAgenda.mockReturnValue({
      agenda: mockScheduleData,
      loading: false,
      error: null,
      isStale: false,
      lastSync: '2024-11-04T10:00:00Z'
    });

    render(<Events />);
    
    // Find and click the "Hyperscalers" track button
    const hyperscalersButton = screen.getByRole('button', { name: /Hyperscalers/i });
    await user.click(hyperscalersButton);
    
    await waitFor(() => {
      // Only hyperscalers track events should be visible
      expect(screen.queryByText('Keynote de Bienvenida')).not.toBeInTheDocument();
      expect(screen.getByText('Keynote del track exclusivo de AWS')).toBeInTheDocument();
    });
  });

  it('should open modal with event details', async () => {
    const user = userEvent.setup();
    
    useAgendaHook.useAgenda.mockReturnValue({
      agenda: mockScheduleData,
      loading: false,
      error: null,
      isStale: false,
      lastSync: '2024-11-04T10:00:00Z'
    });

    render(<Events />);
    
    // Find and click "Más Detalles" button for first event
    const detailButtons = screen.getAllByRole('button', { name: /Más Detalles/i });
    await user.click(detailButtons[0]);
    
    // Modal should open with event details
    await waitFor(() => {
      expect(screen.getByText('Bienvenida oficial al evento')).toBeInTheDocument();
      expect(screen.getByText(/Ponente:/i)).toBeInTheDocument();
      // Check for duration which is unique to modal
      expect(screen.getByText(/Duración:/i)).toBeInTheDocument();
    });
  });

  it('should handle empty schedule data gracefully', () => {
    useAgendaHook.useAgenda.mockReturnValue({
      agenda: [],
      loading: false,
      error: null,
      isStale: false,
      lastSync: null
    });

    render(<Events />);
    
    // Should show title but no events
    expect(screen.getByText(/Horario del Evento 2025/i)).toBeInTheDocument();
    expect(screen.queryByText(/Más Detalles/i)).not.toBeInTheDocument();
  });

  it('should remove update notification when revalidation completes', () => {
    const { rerender } = render(<Events />);
    
    // Initial state with isStale = true
    useAgendaHook.useAgenda.mockReturnValue({
      agenda: mockScheduleData,
      loading: false,
      error: null,
      isStale: true,
      lastSync: '2024-11-04T10:00:00Z'
    });
    
    rerender(<Events />);
    expect(screen.getByText(/Actualizando horario/i)).toBeInTheDocument();
    
    // After revalidation: isStale = false
    useAgendaHook.useAgenda.mockReturnValue({
      agenda: mockScheduleData,
      loading: false,
      error: null,
      isStale: false,
      lastSync: '2024-11-04T10:05:00Z'
    });
    
    rerender(<Events />);
    expect(screen.queryByText(/Actualizando horario/i)).not.toBeInTheDocument();
  });
});
