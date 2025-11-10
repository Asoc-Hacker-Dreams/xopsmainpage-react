/**
 * IndexedDB service for agenda data with stale-while-revalidate pattern
 * Provides offline-first capability with background sync
 */

const DB_NAME = 'xops-agenda-db';
const DB_VERSION = 1;
const STORE_NAME = 'agenda';
const META_STORE_NAME = 'metadata';

/**
 * Initialize IndexedDB database
 * @returns {Promise<IDBDatabase>}
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create agenda store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const agendaStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        agendaStore.createIndex('speaker', 'speaker', { unique: false });
        agendaStore.createIndex('timeISO', 'timeISO', { unique: false });
        agendaStore.createIndex('room', 'room', { unique: false });
      }

      // Create metadata store for tracking sync state
      if (!db.objectStoreNames.contains(META_STORE_NAME)) {
        db.createObjectStore(META_STORE_NAME, { keyPath: 'key' });
      }
    };
  });
};

/**
 * Get all agenda items from IndexedDB
 * @returns {Promise<Array>}
 */
export const getAgendaFromDB = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = () => {
        reject(new Error('Failed to get agenda from IndexedDB'));
      };
    });
  } catch (error) {
    console.error('Error reading from IndexedDB:', error);
    return [];
  }
};

/**
 * Save agenda items to IndexedDB
 * @param {Array} agendaItems - Array of agenda items
 * @returns {Promise<void>}
 */
export const saveAgendaToDB = async (agendaItems) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Clear existing data
    await new Promise((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => reject(new Error('Failed to clear store'));
    });

    // Add new items
    const addPromises = agendaItems.map((item) => {
      return new Promise((resolve, reject) => {
        const request = store.add(item);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error('Failed to add item'));
      });
    });

    await Promise.all(addPromises);
  } catch (error) {
    console.error('Error saving to IndexedDB:', error);
    throw error;
  }
};

/**
 * Get metadata from IndexedDB
 * @param {string} key - Metadata key
 * @returns {Promise<any>}
 */
export const getMetadata = async (key) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([META_STORE_NAME], 'readonly');
    const store = transaction.objectStore(META_STORE_NAME);
    const request = store.get(key);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result?.value || null);
      };
      request.onerror = () => {
        reject(new Error('Failed to get metadata'));
      };
    });
  } catch (error) {
    console.error('Error reading metadata from IndexedDB:', error);
    return null;
  }
};

/**
 * Save metadata to IndexedDB
 * @param {string} key - Metadata key
 * @param {any} value - Metadata value
 * @returns {Promise<void>}
 */
export const saveMetadata = async (key, value) => {
  try {
    const db = await initDB();
    const transaction = db.transaction([META_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(META_STORE_NAME);
    const request = store.put({ key, value });

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to save metadata'));
    });
  } catch (error) {
    console.error('Error saving metadata to IndexedDB:', error);
    throw error;
  }
};

/**
 * Clear all agenda data from IndexedDB
 * @returns {Promise<void>}
 */
export const clearAgendaDB = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME, META_STORE_NAME], 'readwrite');
    
    await Promise.all([
      new Promise((resolve, reject) => {
        const request = transaction.objectStore(STORE_NAME).clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject();
      }),
      new Promise((resolve, reject) => {
        const request = transaction.objectStore(META_STORE_NAME).clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject();
      })
    ]);
  } catch (error) {
    console.error('Error clearing IndexedDB:', error);
    throw error;
  }
};
