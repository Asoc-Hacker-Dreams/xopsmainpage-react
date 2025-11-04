import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AgendaList from './AgendaList';

// Mock the useFavorites hook
vi.mock('../hooks/useFavorites', () => ({
  useFavorites: vi.fn(() => ({
    favorites: new Set(),
    loading: false,
    toggleFavorite: vi.fn(),
    isFavorite: vi.fn(() => false),
  })),
}));

// Mock react-window
vi.mock('react-window', () => ({
  FixedSizeList: vi.fn(({ children, itemCount }) => {
    // Render a simplified version for testing
    return (
      <div data-testid="virtualized-list">
        {Array.from({ length: Math.min(itemCount, 5) }, (_, index) => 
          children({ index, style: {} })
        )}
      </div>
    );
  }),
}));

describe('AgendaList', () => {
  const mockTalks = [
    {
      speaker: 'John Doe',
      talk: 'Test Talk 1',
      description: 'Test description 1',
      timeISO: '2025-11-21T10:00',
      durationMinutes: 30,
      durationHuman: '30m',
      room: 'Room A',
      type: 'keynote',
      track: 'main',
    },
    {
      speaker: 'Jane Smith',
      talk: 'Test Talk 2',
      description: 'Test description 2',
      timeISO: '2025-11-21T11:00',
      durationMinutes: 45,
      durationHuman: '45m',
      room: 'Room A',
      type: 'talk',
      track: 'main',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<AgendaList talks={mockTalks} />);
    expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
  });

  it('shows message when no talks match filters', () => {
    render(<AgendaList talks={[]} />);
    expect(screen.getByText(/no hay sesiones disponibles/i)).toBeInTheDocument();
  });

  it('displays talk information', () => {
    render(<AgendaList talks={mockTalks} />);
    expect(screen.getByText('Test Talk 1')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('applies filters correctly', () => {
    const filters = { track: 'main' };
    render(<AgendaList talks={mockTalks} filters={filters} />);
    expect(screen.getByTestId('virtualized-list')).toBeInTheDocument();
  });

  it('shows favorites count', () => {
    render(<AgendaList talks={mockTalks} />);
    expect(screen.getByText(/0 favoritas/i)).toBeInTheDocument();
  });
});
