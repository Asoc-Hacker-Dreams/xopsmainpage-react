import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAgenda } from '../hooks/useAgenda';
import * as agendaDB from '../services/agendaDB';

// This test suite demonstrates the stale-while-revalidate pattern
// and offline capabilities of the useAgenda hook

vi.mock('../services/agendaDB');

describe('Offline Scenario Integration Tests', () => {
  const mockCachedData = [
    {
      id: 1,
      speaker: 'Cached Speaker 1',
      talk: 'Cached Talk 1',
      timeISO: '2025-11-21T09:30',
      room: 'Room A',
      track: 'main'
    },
    {
      id: 2,
      speaker: 'Cached Speaker 2',
      talk: 'Cached Talk 2',
      timeISO: '2025-11-21T10:30',
      room: 'Room B',
      track: 'hyperscalers'
    }
  ];

  const mockFreshData = [
    ...mockCachedData,
    {
      id: 3,
      speaker: 'New Speaker',
      talk: 'New Talk',
      timeISO: '2025-11-21T11:30',
      room: 'Room C',
      track: 'bsides'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
    console.log = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Given offline: When I open PWA, Then I see agenda from IDB without errors', async () => {
    // Setup: IndexedDB has cached data
    agendaDB.getAgendaFromDB.mockResolvedValue(mockCachedData);
    agendaDB.getMetadata.mockResolvedValue('2024-11-04T10:00:00Z');
    
    // Setup: Network is offline (fetch fails)
    global.fetch = vi.fn().mockRejectedValue(new Error('Network request failed'));

    const { result } = renderHook(() => useAgenda());

    // Wait for initial load from cache
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify: Data loaded from cache
    expect(result.current.agenda).toEqual(mockCachedData);
    expect(result.current.agenda.length).toBe(2);
    expect(result.current.agenda[0].speaker).toBe('Cached Speaker 1');

    // Verify: No critical errors, just network error is captured
    await waitFor(() => {
      expect(result.current.error).toBe('Network request failed');
    }, { timeout: 3000 });

    // Verify: Still showing cached data despite error
    expect(result.current.agenda).toEqual(mockCachedData);
  });

  it('Given cached data: When network returns fresh data, Then UI updates without flashing', async () => {
    // Setup: IndexedDB has cached data
    agendaDB.getAgendaFromDB.mockResolvedValue(mockCachedData);
    agendaDB.getMetadata
      .mockResolvedValueOnce('2024-11-04T10:00:00Z') // lastSyncAt
      .mockResolvedValueOnce('etag-old') // etag
      .mockResolvedValueOnce(JSON.stringify(mockCachedData)); // sourceVersion
    
    // Setup: Network returns fresh data with a slight delay
    let resolveFetch;
    global.fetch = vi.fn().mockImplementation(() => new Promise((resolve) => {
      resolveFetch = () => resolve({
        ok: true,
        status: 200,
        json: async () => mockFreshData,
        headers: new Map([['etag', 'etag-new']])
      });
    }));

    const { result } = renderHook(() => useAgenda());

    // Step 1: Data loads instantly from cache
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.isStale).toBe(true);
    });

    // Verify: User sees cached data immediately (no loading state)
    expect(result.current.agenda.length).toBe(2);
    expect(result.current.agenda).toEqual(mockCachedData);

    // Step 2: Resolve the fetch to simulate network response
    resolveFetch();

    // Step 3: Background revalidation completes
    await waitFor(() => {
      expect(result.current.isStale).toBe(false);
    }, { timeout: 3000 });

    // Step 4: UI updates with fresh data
    await waitFor(() => {
      expect(result.current.agenda.length).toBe(3);
    }, { timeout: 3000 });

    // Verify: Fresh data is now available
    expect(result.current.agenda).toEqual(mockFreshData);
    expect(result.current.agenda[2].speaker).toBe('New Speaker');

    // Verify: Data was saved to IndexedDB
    expect(agendaDB.saveAgendaToDB).toHaveBeenCalledWith(mockFreshData);
    expect(agendaDB.saveMetadata).toHaveBeenCalledWith('lastSyncAt', expect.any(String));
  });

  it('Given no cached data and offline: When I open PWA, Then I see loading state', async () => {
    // Setup: No cached data
    agendaDB.getAgendaFromDB.mockResolvedValue([]);
    agendaDB.getMetadata.mockResolvedValue(null);
    
    // Setup: Network is offline
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAgenda());

    // Verify: Initially shows loading
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verify: No data available
    expect(result.current.agenda).toEqual([]);
    
    // Verify: Error is set
    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
    }, { timeout: 3000 });
  });

  it('Given stale data: When network returns 304 Not Modified, Then cache is reused', async () => {
    // Setup: IndexedDB has cached data
    agendaDB.getAgendaFromDB.mockResolvedValue(mockCachedData);
    agendaDB.getMetadata
      .mockResolvedValueOnce('2024-11-04T10:00:00Z')
      .mockResolvedValueOnce('etag-123')
      .mockResolvedValueOnce(JSON.stringify(mockCachedData));
    
    // Setup: Server returns 304 Not Modified
    global.fetch = vi.fn().mockResolvedValue({
      status: 304,
      headers: new Map()
    });

    const { result } = renderHook(() => useAgenda());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Wait for revalidation
    await waitFor(() => {
      expect(result.current.isStale).toBe(false);
    }, { timeout: 3000 });

    // Verify: Still using cached data
    expect(result.current.agenda).toEqual(mockCachedData);
    
    // Verify: No save to IndexedDB since data didn't change
    expect(agendaDB.saveAgendaToDB).not.toHaveBeenCalled();
    
    // Verify: lastSyncAt was updated
    expect(agendaDB.saveMetadata).toHaveBeenCalledWith('lastSyncAt', expect.any(String));
  });

  it('Given multiple rapid renders: When revalidating, Then only one fetch occurs', async () => {
    agendaDB.getAgendaFromDB.mockResolvedValue(mockCachedData);
    agendaDB.getMetadata.mockResolvedValue('2024-11-04T10:00:00Z');
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockFreshData,
      headers: new Map([['etag', 'etag-new']])
    });

    // Render hook multiple times
    const { rerender } = renderHook(() => useAgenda());
    rerender();
    rerender();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    }, { timeout: 3000 });
  });
});
