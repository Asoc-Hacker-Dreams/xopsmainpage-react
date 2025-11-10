import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAgenda } from './useAgenda';
import * as agendaDB from '../services/agendaDB';

// Mock the agendaDB service
vi.mock('../services/agendaDB', () => ({
  getAgendaFromDB: vi.fn(),
  saveAgendaToDB: vi.fn(),
  getMetadata: vi.fn(),
  saveMetadata: vi.fn()
}));

// Mock fetch
global.fetch = vi.fn();

describe('useAgenda Hook', () => {
  const mockAgendaData = [
    {
      id: 1,
      speaker: 'John Doe',
      talk: 'Test Talk 1',
      timeISO: '2025-11-21T09:30',
      room: 'Main Hall'
    },
    {
      id: 2,
      speaker: 'Jane Smith',
      talk: 'Test Talk 2',
      timeISO: '2025-11-21T10:30',
      room: 'Room A'
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

  it('should load agenda from IndexedDB immediately', async () => {
    agendaDB.getAgendaFromDB.mockResolvedValue(mockAgendaData);
    agendaDB.getMetadata.mockResolvedValue('2024-11-04T10:00:00Z');
    
    // Mock fetch to never resolve during initial load
    let resolveFetch;
    global.fetch.mockReturnValue(new Promise((resolve) => {
      resolveFetch = resolve;
    }));

    const { result } = renderHook(() => useAgenda());

    // Initially loading
    expect(result.current.loading).toBe(true);

    // Wait for cache load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.agenda).toEqual(mockAgendaData);
    expect(result.current.isStale).toBe(true);
    expect(agendaDB.getAgendaFromDB).toHaveBeenCalled();
    
    // Clean up pending fetch
    if (resolveFetch) {
      resolveFetch({
        ok: true,
        status: 200,
        json: async () => mockAgendaData,
        headers: new Map([['etag', 'abc123']])
      });
    }
  });

  it('should revalidate data in the background', async () => {
    const updatedData = [...mockAgendaData, {
      id: 3,
      speaker: 'Bob Johnson',
      talk: 'New Talk',
      timeISO: '2025-11-21T11:30',
      room: 'Room B'
    }];

    agendaDB.getAgendaFromDB.mockResolvedValue(mockAgendaData);
    agendaDB.getMetadata
      .mockResolvedValueOnce('2024-11-04T10:00:00Z') // lastSyncAt
      .mockResolvedValueOnce('etag-old') // etag
      .mockResolvedValueOnce(JSON.stringify(mockAgendaData)); // sourceVersion

    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => updatedData,
      headers: new Map([['etag', 'etag-new']])
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

    expect(global.fetch).toHaveBeenCalled();
    expect(agendaDB.saveAgendaToDB).toHaveBeenCalledWith(updatedData);
    expect(agendaDB.saveMetadata).toHaveBeenCalledWith('lastSyncAt', expect.any(String));
    expect(agendaDB.saveMetadata).toHaveBeenCalledWith('sourceVersion', JSON.stringify(updatedData));
  });

  it('should handle 304 Not Modified response', async () => {
    agendaDB.getAgendaFromDB.mockResolvedValue(mockAgendaData);
    agendaDB.getMetadata
      .mockResolvedValueOnce('2024-11-04T10:00:00Z')
      .mockResolvedValueOnce('etag-123')
      .mockResolvedValueOnce(JSON.stringify(mockAgendaData));

    global.fetch.mockResolvedValue({
      status: 304,
      headers: new Map()
    });

    const { result } = renderHook(() => useAgenda());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.isStale).toBe(false);
    });

    expect(agendaDB.saveAgendaToDB).not.toHaveBeenCalled();
    expect(agendaDB.saveMetadata).toHaveBeenCalledWith('lastSyncAt', expect.any(String));
  });

  it('should handle offline scenario gracefully', async () => {
    agendaDB.getAgendaFromDB.mockResolvedValue(mockAgendaData);
    agendaDB.getMetadata.mockResolvedValue('2024-11-04T10:00:00Z');
    
    global.fetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAgenda());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should still have cached data
    expect(result.current.agenda).toEqual(mockAgendaData);
    
    // Wait for revalidation to complete
    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
    }, { timeout: 3000 });
  });

  it('should work when no cached data exists', async () => {
    agendaDB.getAgendaFromDB.mockResolvedValue([]);
    agendaDB.getMetadata
      .mockResolvedValueOnce(null) // lastSyncAt
      .mockResolvedValueOnce(null) // etag
      .mockResolvedValueOnce(null); // sourceVersion

    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockAgendaData,
      headers: new Map([['etag', 'new-etag']])
    });

    const { result } = renderHook(() => useAgenda());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Wait for fetch to complete
    await waitFor(() => {
      expect(result.current.agenda).toEqual(mockAgendaData);
    }, { timeout: 3000 });

    expect(agendaDB.saveAgendaToDB).toHaveBeenCalledWith(mockAgendaData);
  });

  it('should not update when data is identical', async () => {
    agendaDB.getAgendaFromDB.mockResolvedValue(mockAgendaData);
    agendaDB.getMetadata
      .mockResolvedValueOnce('2024-11-04T10:00:00Z')
      .mockResolvedValueOnce('etag-123')
      .mockResolvedValueOnce(JSON.stringify(mockAgendaData));

    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockAgendaData,
      headers: new Map([['etag', 'etag-123']])
    });

    const { result } = renderHook(() => useAgenda());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.isStale).toBe(false);
    }, { timeout: 3000 });

    // Should not save if data hasn't changed
    expect(agendaDB.saveAgendaToDB).not.toHaveBeenCalled();
  });

  it('should handle custom schedule URL', async () => {
    const customUrl = '/api/custom-schedule.json';
    
    agendaDB.getAgendaFromDB.mockResolvedValue([]);
    agendaDB.getMetadata.mockResolvedValue(null);
    
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockAgendaData,
      headers: new Map()
    });

    renderHook(() => useAgenda(customUrl));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        customUrl,
        expect.any(Object)
      );
    }, { timeout: 3000 });
  });
});
