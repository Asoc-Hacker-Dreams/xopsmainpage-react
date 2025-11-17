/**
 * IndexedDB wrapper for X-Ops Conference data storage
 * Provides database initialization and basic operations
 */

const DB_NAME = 'XOpsConferenceDB';
const DB_VERSION = 1;

export const STORES = {
  AGENDA: 'agenda'
};

/**
 * Opens or creates the IndexedDB database
 * @returns {Promise<IDBDatabase>} Database instance
 */
export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open database'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create agenda store if it doesn't exist
      if (!db.objectStoreNames.contains(STORES.AGENDA)) {
        const agendaStore = db.createObjectStore(STORES.AGENDA, {
          keyPath: 'id',
          autoIncrement: true
        });

        // Create indices for efficient filtering and sorting
        agendaStore.createIndex('day', 'day', { unique: false });
        agendaStore.createIndex('track', 'track', { unique: false });
        agendaStore.createIndex('room', 'room', { unique: false });
        agendaStore.createIndex('startTime', 'startTime', { unique: false });
        
        // Composite indices for common filter combinations
        agendaStore.createIndex('day_track', ['day', 'track'], { unique: false });
        agendaStore.createIndex('day_room', ['day', 'room'], { unique: false });
      }
    };
  });
}

/**
 * Closes the database connection
 * @param {IDBDatabase} db - Database instance to close
 */
export function closeDatabase(db) {
  if (db) {
    db.close();
  }
}

/**
 * Clears all data from a specific store
 * @param {string} storeName - Name of the store to clear
 * @returns {Promise<void>}
 */
export async function clearStore(storeName) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => {
      closeDatabase(db);
      resolve();
    };

    request.onerror = () => {
      closeDatabase(db);
      reject(new Error(`Failed to clear store: ${storeName}`));
    };
  });
}

/**
 * Adds multiple items to a store
 * @param {string} storeName - Name of the store
 * @param {Array} items - Items to add
 * @returns {Promise<void>}
 */
export async function bulkAdd(storeName, items) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    transaction.oncomplete = () => {
      closeDatabase(db);
      resolve();
    };

    transaction.onerror = () => {
      closeDatabase(db);
      reject(new Error(`Failed to add items to ${storeName}`));
    };

    items.forEach(item => {
      store.add(item);
    });
  });
}

export default {
  openDatabase,
  closeDatabase,
  clearStore,
  bulkAdd,
  STORES
};
