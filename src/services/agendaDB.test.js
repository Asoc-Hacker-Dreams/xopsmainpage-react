import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  initDB,
  getAgendaFromDB,
  saveAgendaToDB,
  getMetadata,
  saveMetadata,
  clearAgendaDB
} from '../services/agendaDB';

// Mock IndexedDB
class IDBRequestMock {
  constructor() {
    this.result = null;
    this.error = null;
    this.onsuccess = null;
    this.onerror = null;
  }

  triggerSuccess(result) {
    this.result = result;
    if (this.onsuccess) {
      this.onsuccess({ target: this });
    }
  }

  triggerError(error) {
    this.error = error;
    if (this.onerror) {
      this.onerror({ target: this });
    }
  }
}

describe('agendaDB Service', () => {
  let mockDB;
  let mockStore;
  let mockTransaction;
  let mockIndex;

  beforeEach(() => {
    // Setup mock objects
    mockIndex = {
      get: vi.fn(() => new IDBRequestMock()),
      getAll: vi.fn(() => new IDBRequestMock())
    };

    mockStore = {
      add: vi.fn(() => new IDBRequestMock()),
      put: vi.fn(() => new IDBRequestMock()),
      get: vi.fn(() => new IDBRequestMock()),
      getAll: vi.fn(() => new IDBRequestMock()),
      clear: vi.fn(() => new IDBRequestMock()),
      createIndex: vi.fn(() => mockIndex)
    };

    mockTransaction = {
      objectStore: vi.fn(() => mockStore)
    };

    mockDB = {
      transaction: vi.fn(() => mockTransaction),
      objectStoreNames: {
        contains: vi.fn(() => false)
      },
      createObjectStore: vi.fn(() => mockStore)
    };

    // Mock indexedDB
    global.indexedDB = {
      open: vi.fn(() => {
        const request = new IDBRequestMock();
        setTimeout(() => {
          if (request.onupgradeneeded) {
            request.onupgradeneeded({ target: { result: mockDB } });
          }
          request.triggerSuccess(mockDB);
        }, 0);
        return request;
      })
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initDB', () => {
    it('should initialize the database successfully', async () => {
      const db = await initDB();
      expect(db).toBeDefined();
      expect(global.indexedDB.open).toHaveBeenCalledWith('xops-agenda-db', 1);
    });

    it('should create object stores on upgrade', async () => {
      await initDB();
      expect(mockDB.createObjectStore).toHaveBeenCalledWith('agenda', { keyPath: 'id', autoIncrement: true });
      expect(mockDB.createObjectStore).toHaveBeenCalledWith('metadata', { keyPath: 'key' });
    });
  });

  describe('getAgendaFromDB', () => {
    it('should retrieve agenda items from IndexedDB', async () => {
      const mockAgenda = [
        { id: 1, speaker: 'John Doe', talk: 'Test Talk' },
        { id: 2, speaker: 'Jane Smith', talk: 'Another Talk' }
      ];

      const getAllRequest = new IDBRequestMock();
      mockStore.getAll.mockReturnValue(getAllRequest);

      const promise = getAgendaFromDB();
      setTimeout(() => getAllRequest.triggerSuccess(mockAgenda), 0);

      const result = await promise;
      expect(result).toEqual(mockAgenda);
    });

    it('should return empty array when IndexedDB fails', async () => {
      // Mock indexedDB.open to fail immediately
      global.indexedDB.open = vi.fn(() => {
        const request = new IDBRequestMock();
        setTimeout(() => request.triggerError(new Error('DB Error')), 0);
        return request;
      });

      const result = await getAgendaFromDB();
      expect(result).toEqual([]);
    });
  });

  describe('saveAgendaToDB', () => {
    it('should save agenda items to IndexedDB', async () => {
      const mockAgenda = [
        { speaker: 'John Doe', talk: 'Test Talk' },
        { speaker: 'Jane Smith', talk: 'Another Talk' }
      ];

      const clearRequest = new IDBRequestMock();
      const addRequest1 = new IDBRequestMock();
      const addRequest2 = new IDBRequestMock();

      mockStore.clear.mockReturnValue(clearRequest);
      mockStore.add.mockReturnValueOnce(addRequest1).mockReturnValueOnce(addRequest2);

      const promise = saveAgendaToDB(mockAgenda);
      
      // Trigger clear first, then both adds
      setTimeout(() => {
        clearRequest.triggerSuccess();
      }, 0);
      
      setTimeout(() => {
        addRequest1.triggerSuccess();
        addRequest2.triggerSuccess();
      }, 10);

      await promise;

      expect(mockStore.clear).toHaveBeenCalled();
      expect(mockStore.add).toHaveBeenCalledTimes(2);
    }, 10000);
  });

  describe('getMetadata', () => {
    it('should retrieve metadata value by key', async () => {
      const mockValue = '2024-11-04T10:00:00Z';
      const getRequest = new IDBRequestMock();
      mockStore.get.mockReturnValue(getRequest);

      const promise = getMetadata('lastSyncAt');
      setTimeout(() => getRequest.triggerSuccess({ key: 'lastSyncAt', value: mockValue }), 0);

      const result = await promise;
      expect(result).toBe(mockValue);
    });

    it('should return null when metadata not found', async () => {
      const getRequest = new IDBRequestMock();
      mockStore.get.mockReturnValue(getRequest);

      const promise = getMetadata('nonexistent');
      setTimeout(() => getRequest.triggerSuccess(undefined), 0);

      const result = await promise;
      expect(result).toBeNull();
    });
  });

  describe('saveMetadata', () => {
    it('should save metadata with key and value', async () => {
      const putRequest = new IDBRequestMock();
      mockStore.put.mockReturnValue(putRequest);

      const promise = saveMetadata('lastSyncAt', '2024-11-04T10:00:00Z');
      setTimeout(() => putRequest.triggerSuccess(), 0);

      await promise;

      expect(mockStore.put).toHaveBeenCalledWith({
        key: 'lastSyncAt',
        value: '2024-11-04T10:00:00Z'
      });
    });
  });

  describe('clearAgendaDB', () => {
    it('should clear all data from both stores', async () => {
      const clearRequest1 = new IDBRequestMock();
      const clearRequest2 = new IDBRequestMock();
      
      mockStore.clear
        .mockReturnValueOnce(clearRequest1)
        .mockReturnValueOnce(clearRequest2);

      const promise = clearAgendaDB();
      
      setTimeout(() => {
        clearRequest1.triggerSuccess();
        clearRequest2.triggerSuccess();
      }, 0);

      await promise;

      expect(mockStore.clear).toHaveBeenCalledTimes(2);
    });
  });
});
