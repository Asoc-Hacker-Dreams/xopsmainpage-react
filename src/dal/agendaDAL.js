/**
 * Data Access Layer for Agenda
 * Provides filtering and sorting capabilities for conference schedule
 */

import { openDatabase, closeDatabase, STORES } from './db.js';

/**
 * Extracts the date (day) from an ISO datetime string
 * @param {string} timeISO - ISO datetime string (e.g., "2025-11-21T09:30")
 * @returns {string} Date in YYYY-MM-DD format
 */
function extractDay(timeISO) {
  if (!timeISO) return '';
  return timeISO.split('T')[0];
}

/**
 * Normalizes agenda item by adding computed fields
 * @param {Object} item - Raw agenda item
 * @returns {Object} Normalized agenda item with day and startTime fields
 */
function normalizeAgendaItem(item) {
  return {
    ...item,
    day: extractDay(item.timeISO),
    startTime: item.timeISO || ''
  };
}

/**
 * Initializes the agenda store with data
 * @param {Array} agendaData - Array of agenda items
 * @returns {Promise<void>}
 */
export async function initializeAgenda(agendaData) {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.AGENDA], 'readwrite');
    const store = transaction.objectStore(STORES.AGENDA);
    
    // Clear existing data first
    const clearRequest = store.clear();
    
    clearRequest.onsuccess = () => {
      // Add normalized items
      agendaData.forEach(item => {
        const normalized = normalizeAgendaItem(item);
        store.add(normalized);
      });
    };
    
    transaction.oncomplete = () => {
      closeDatabase(db);
      resolve();
    };
    
    transaction.onerror = () => {
      closeDatabase(db);
      reject(new Error('Failed to initialize agenda'));
    };
  });
}

/**
 * Retrieves agenda items with optional filtering and sorting
 * @param {Object} filters - Filter options
 * @param {string} filters.day - Filter by day (YYYY-MM-DD format)
 * @param {string} filters.track - Filter by track
 * @param {string} filters.room - Filter by room
 * @returns {Promise<Array>} Filtered and sorted agenda items
 */
export async function getAgenda(filters = {}) {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.AGENDA], 'readonly');
    const store = transaction.objectStore(STORES.AGENDA);
    
    let request;
    
    // Determine which index to use based on filters
    if (filters.day && filters.track) {
      // Use composite index for day+track
      const index = store.index('day_track');
      request = index.getAll([filters.day, filters.track]);
    } else if (filters.day && filters.room) {
      // Use composite index for day+room
      const index = store.index('day_room');
      request = index.getAll([filters.day, filters.room]);
    } else if (filters.day) {
      // Use day index
      const index = store.index('day');
      request = index.getAll(filters.day);
    } else if (filters.track) {
      // Use track index
      const index = store.index('track');
      request = index.getAll(filters.track);
    } else if (filters.room) {
      // Use room index
      const index = store.index('room');
      request = index.getAll(filters.room);
    } else {
      // No filters, get all items
      request = store.getAll();
    }
    
    request.onsuccess = () => {
      let results = request.result;
      
      // Apply additional filters if needed (for combinations not covered by composite indices)
      if (filters.day && filters.track && filters.room) {
        // Filter by all three dimensions
        results = results.filter(item => 
          item.day === filters.day && 
          item.track === filters.track && 
          item.room === filters.room
        );
      } else if (filters.track && filters.room && !filters.day) {
        // Filter by track and room (day not specified)
        results = results.filter(item => 
          item.track === filters.track && 
          item.room === filters.room
        );
      }
      // Note: Single filters and day+track / day+room combinations are already
      // handled efficiently by IndexedDB indices above
      
      // Sort by startTime in ascending order
      results.sort((a, b) => {
        if (a.startTime < b.startTime) return -1;
        if (a.startTime > b.startTime) return 1;
        return 0;
      });
      
      closeDatabase(db);
      resolve(results);
    };
    
    request.onerror = () => {
      closeDatabase(db);
      reject(new Error('Failed to retrieve agenda'));
    };
  });
}

/**
 * Clears all agenda data from the database
 * @returns {Promise<void>}
 */
export async function clearAgenda() {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.AGENDA], 'readwrite');
    const store = transaction.objectStore(STORES.AGENDA);
    const request = store.clear();
    
    request.onsuccess = () => {
      closeDatabase(db);
      resolve();
    };
    
    request.onerror = () => {
      closeDatabase(db);
      reject(new Error('Failed to clear agenda'));
    };
  });
}

export default {
  initializeAgenda,
  getAgenda,
  clearAgenda
};
