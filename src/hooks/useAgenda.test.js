import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAgenda, useTalk } from './useAgenda';
import DAL from '../data/dal';

// Mock the DAL module
vi.mock('../data/dal', () => ({
  default: {
    getAgenda: vi.fn(),
    getTalk: vi.fn(),
  }
}));

describe('useAgenda hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch agenda data on mount', async () => {
    const mockTalks = [
      { id: '1', talk: 'Test Talk 1', speaker: 'Speaker 1' },
      { id: '2', talk: 'Test Talk 2', speaker: 'Speaker 2' }
    ];

    DAL.getAgenda.mockResolvedValue(mockTalks);

    const { result } = renderHook(() => useAgenda());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.talks).toEqual([]);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.talks).toEqual(mockTalks);
    expect(result.current.error).toBeNull();
    expect(DAL.getAgenda).toHaveBeenCalledWith({});
  });

  it('should apply filters when provided', async () => {
    const mockTalks = [{ id: '1', talk: 'Test Talk', speaker: 'Speaker' }];
    DAL.getAgenda.mockResolvedValue(mockTalks);

    const filters = { day: '2025-11-21', track: 'main' };
    renderHook(() => useAgenda(filters));

    await waitFor(() => {
      expect(DAL.getAgenda).toHaveBeenCalledWith(filters);
    });
  });

  it('should handle errors gracefully', async () => {
    const errorMessage = 'Failed to load agenda';
    DAL.getAgenda.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAgenda());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.talks).toEqual([]);
  });

  it('should provide refetch function', async () => {
    const mockTalks = [{ id: '1', talk: 'Test Talk', speaker: 'Speaker' }];
    DAL.getAgenda.mockResolvedValue(mockTalks);

    const { result } = renderHook(() => useAgenda());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Clear mock calls
    DAL.getAgenda.mockClear();

    // Call refetch
    await result.current.refetch();

    expect(DAL.getAgenda).toHaveBeenCalledTimes(1);
  });
});

describe('useTalk hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch talk data by ID', async () => {
    const mockTalk = { id: '1', talk: 'Test Talk', speaker: 'Speaker' };
    DAL.getTalk.mockResolvedValue(mockTalk);

    const { result } = renderHook(() => useTalk('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.talk).toEqual(mockTalk);
    expect(result.current.error).toBeNull();
    expect(DAL.getTalk).toHaveBeenCalledWith('1');
  });

  it('should handle non-existent talk', async () => {
    DAL.getTalk.mockResolvedValue(null);

    const { result } = renderHook(() => useTalk('non-existent'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.talk).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should not fetch if idOrSlug is not provided', async () => {
    const { result } = renderHook(() => useTalk(null));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(DAL.getTalk).not.toHaveBeenCalled();
    expect(result.current.talk).toBeNull();
  });

  it('should handle errors gracefully', async () => {
    const errorMessage = 'Failed to load talk';
    DAL.getTalk.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTalk('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.talk).toBeNull();
  });
});
