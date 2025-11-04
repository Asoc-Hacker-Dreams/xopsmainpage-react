/**
 * Shared IndexedDB mock setup for tests
 */

// Mock IndexedDB
class MockIDBRequest {
  constructor() {
    this.result = null;
    this.error = null;
    this.onsuccess = null;
    this.onerror = null;
  }

  simulateSuccess(result) {
    this.result = result;
    if (this.onsuccess) {
      this.onsuccess({ target: this });
    }
  }

  simulateError(error) {
    this.error = error;
    if (this.onerror) {
      this.onerror({ target: this });
    }
  }
}

class MockIDBTransaction {
  constructor(storeNames, mode) {
    this.storeNames = storeNames;
    this.mode = mode;
    this.oncomplete = null;
    this.onerror = null;
    this.stores = {};
    this._pendingRequests = 0;
  }

  objectStore(name) {
    // eslint-disable-next-line security/detect-object-injection
    if (!this.stores[name]) {
      // eslint-disable-next-line security/detect-object-injection
      this.stores[name] = new MockIDBObjectStore(name, this);
    }
    // eslint-disable-next-line security/detect-object-injection
    return this.stores[name];
  }

  _addRequest() {
    this._pendingRequests++;
  }

  _completeRequest() {
    this._pendingRequests--;
    if (this._pendingRequests === 0) {
      setTimeout(() => {
        if (this.oncomplete) {
          this.oncomplete();
        }
      }, 0);
    }
  }

  simulateComplete() {
    if (this.oncomplete) {
      this.oncomplete();
    }
  }

  simulateError(error) {
    if (this.onerror) {
      this.onerror({ target: { error } });
    }
  }
}

class MockIDBIndex {
  constructor(name, keyPath) {
    this.name = name;
    this.keyPath = keyPath;
  }

  getAll(key) {
    const request = new MockIDBRequest();
    setTimeout(() => {
      const store = global.mockIndexedDBData['agenda'] || [];
      let results;

      if (Array.isArray(key)) {
        // Composite key
        if (this.name === 'day_track') {
          results = store.filter(item => item.day === key[0] && item.track === key[1]);
        } else if (this.name === 'day_room') {
          results = store.filter(item => item.day === key[0] && item.room === key[1]);
        } else {
          results = store;
        }
      } else if (key !== undefined) {
        // Single key
        if (this.name === 'day') {
          results = store.filter(item => item.day === key);
        } else if (this.name === 'track') {
          results = store.filter(item => item.track === key);
        } else if (this.name === 'room') {
          results = store.filter(item => item.room === key);
        } else {
          results = store;
        }
      } else {
        results = store;
      }

      request.simulateSuccess(results);
    }, 0);
    return request;
  }
}

class MockIDBObjectStore {
  constructor(name, transaction) {
    this.name = name;
    this.transaction = transaction;
    this.autoIncrement = true;
    this.indices = {
      'day': new MockIDBIndex('day', 'day'),
      'track': new MockIDBIndex('track', 'track'),
      'room': new MockIDBIndex('room', 'room'),
      'startTime': new MockIDBIndex('startTime', 'startTime'),
      'day_track': new MockIDBIndex('day_track', ['day', 'track']),
      'day_room': new MockIDBIndex('day_room', ['day', 'room'])
    };
  }

  index(name) {
    // eslint-disable-next-line security/detect-object-injection
    return this.indices[name];
  }

  add(item) {
    const request = new MockIDBRequest();
    if (this.transaction) this.transaction._addRequest();
    setTimeout(() => {
      if (!global.mockIndexedDBData[this.name]) {
        global.mockIndexedDBData[this.name] = [];
      }
      const newItem = { ...item, id: global.mockIndexedDBData[this.name].length + 1 };
      global.mockIndexedDBData[this.name].push(newItem);
      request.simulateSuccess(newItem.id);
      if (this.transaction) this.transaction._completeRequest();
    }, 0);
    return request;
  }

  getAll() {
    const request = new MockIDBRequest();
    if (this.transaction) this.transaction._addRequest();
    setTimeout(() => {
      const results = global.mockIndexedDBData[this.name] || [];
      request.simulateSuccess([...results]);
      if (this.transaction) this.transaction._completeRequest();
    }, 0);
    return request;
  }

  clear() {
    const request = new MockIDBRequest();
    if (this.transaction) this.transaction._addRequest();
    setTimeout(() => {
      global.mockIndexedDBData[this.name] = [];
      request.simulateSuccess();
      if (this.transaction) this.transaction._completeRequest();
    }, 0);
    return request;
  }

  createIndex(name, keyPath) {
    // eslint-disable-next-line security/detect-object-injection
    this.indices[name] = new MockIDBIndex(name, keyPath);
    // eslint-disable-next-line security/detect-object-injection
    return this.indices[name];
  }
}

class MockIDBDatabase {
  constructor() {
    this.objectStoreNames = {
      // eslint-disable-next-line no-unused-vars
      contains: (name) => true
    };
  }

  transaction(storeNames, mode) {
    return new MockIDBTransaction(storeNames, mode);
  }

  createObjectStore(name, options) {
    return new MockIDBObjectStore(name);
  }

  close() {
    // Mock close
  }
}

class MockIDBOpenDBRequest extends MockIDBRequest {
  constructor() {
    super();
    this.onupgradeneeded = null;
  }

  simulateUpgradeNeeded(db) {
    if (this.onupgradeneeded) {
      this.onupgradeneeded({ target: { result: db } });
    }
  }
}

// Setup global IndexedDB mock
export function setupIndexedDBMock() {
  global.mockIndexedDBData = {};

  global.indexedDB = {
    open: (name, version) => {
      const request = new MockIDBOpenDBRequest();
      setTimeout(() => {
        const db = new MockIDBDatabase();
        if (version > 1 || !global.mockIndexedDBData._initialized) {
          request.simulateUpgradeNeeded(db);
          global.mockIndexedDBData._initialized = true;
        }
        request.simulateSuccess(db);
      }, 0);
      return request;
    }
  };
}

// Initialize the mock on import
setupIndexedDBMock();
