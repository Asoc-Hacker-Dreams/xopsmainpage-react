import db from './db.js';
import dayjs from 'dayjs';

/**
 * Data Access Layer - Abstraction for data sources
 * Supports multiple data sources: JSON (default) or CMS
 */

// Get data source from environment variable (default: json)
const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE || 'json';

/**
 * Generate a slug from a string (for use as unique identifier)
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Normalize schedule data to Talk format with unique IDs and slugs
 */
function normalizeScheduleData(scheduleData) {
  return scheduleData.map((item, index) => ({
    id: `talk-${index + 1}`,
    slug: generateSlug(item.talk),
    speaker: item.speaker,
    talk: item.talk,
    description: item.description,
    timeRaw: item.timeRaw,
    timeISO: item.timeISO,
    durationMinutes: item.durationMinutes,
    durationHuman: item.durationHuman,
    room: item.room,
    type: item.type,
    track: item.track,
    day: item.timeISO.split('T')[0] // Extract day from ISO timestamp
  }));
}

/**
 * Extract unique speakers from schedule data
 */
function extractSpeakers(scheduleData) {
  const speakerMap = new Map();
  
  scheduleData.forEach((item) => {
    const speakerNames = item.speaker.split(',').map(s => s.trim());
    
    speakerNames.forEach((name) => {
      if (!speakerMap.has(name)) {
        speakerMap.set(name, {
          id: `speaker-${speakerMap.size + 1}`,
          slug: generateSlug(name),
          name: name
        });
      }
    });
  });
  
  return Array.from(speakerMap.values());
}

/**
 * JSON Data Provider - Loads data from schedule2025.json
 */
class JSONDataProvider {
  constructor() {
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      // Check if data is already in IndexedDB
      const lastSync = await db.metadata.get('lastSync');
      const talksCount = await db.talks.count();
      
      // If data exists and was synced recently (within 24 hours), skip reload
      if (lastSync && talksCount > 0) {
        const hoursSinceSync = dayjs().diff(dayjs(lastSync.value), 'hour');
        if (hoursSinceSync < 24) {
          this.initialized = true;
          return;
        }
      }

      // Load data from JSON file
      const scheduleModule = await import('./schedule2025.json');
      const scheduleData = scheduleModule.default;

      // Normalize data
      const talks = normalizeScheduleData(scheduleData);
      const speakers = extractSpeakers(scheduleData);

      // Clear existing data and save to IndexedDB
      await db.transaction('rw', db.talks, db.speakers, db.metadata, async () => {
        await db.talks.clear();
        await db.speakers.clear();
        
        await db.talks.bulkAdd(talks);
        await db.speakers.bulkAdd(speakers);
        
        await db.metadata.put({ key: 'lastSync', value: new Date().toISOString() });
      });

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing JSON data provider:', error);
      throw error;
    }
  }

  async getAgenda(filters = {}) {
    await this.init();
    
    let query = db.talks.toCollection();
    
    // Apply filters
    if (filters.day) {
      query = query.filter(talk => talk.day === filters.day);
    }
    if (filters.track && filters.track !== 'all') {
      query = query.filter(talk => talk.track === filters.track);
    }
    if (filters.type) {
      query = query.filter(talk => talk.type === filters.type);
    }
    if (filters.room) {
      query = query.filter(talk => talk.room === filters.room);
    }
    
    // Sort by time
    const talks = await query.toArray();
    return talks.sort((a, b) => a.timeISO.localeCompare(b.timeISO));
  }

  async getTalk(idOrSlug) {
    await this.init();
    
    // Try to find by ID first
    let talk = await db.talks.get(idOrSlug);
    
    // If not found, try by slug
    if (!talk) {
      talk = await db.talks.where('slug').equals(idOrSlug).first();
    }
    
    return talk || null;
  }

  async getSpeakers(filters = {}) {
    await this.init();
    
    let query = db.speakers.toCollection();
    
    // Apply filters if any
    if (filters.name) {
      query = query.filter(speaker => 
        speaker.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    const speakers = await query.toArray();
    return speakers.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getSpeaker(idOrSlug) {
    await this.init();
    
    // Try to find by ID first
    let speaker = await db.speakers.get(idOrSlug);
    
    // If not found, try by slug
    if (!speaker) {
      speaker = await db.speakers.where('slug').equals(idOrSlug).first();
    }
    
    return speaker || null;
  }
}

/**
 * CMS Data Provider - Placeholder for future CMS integration
 */
class CMSDataProvider {
  constructor() {
    this.baseUrl = import.meta.env.VITE_CMS_API_URL || '/api';
  }

  async getAgenda(filters = {}) {
    // Placeholder: In the future, this will make a REST/GraphQL call to the CMS
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseUrl}/agenda?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch agenda from CMS');
    }
    
    return response.json();
  }

  async getTalk(idOrSlug) {
    // Placeholder: In the future, this will make a REST/GraphQL call to the CMS
    const response = await fetch(`${this.baseUrl}/talks/${idOrSlug}`);
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  }

  async getSpeakers(filters = {}) {
    // Placeholder: In the future, this will make a REST/GraphQL call to the CMS
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseUrl}/speakers?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch speakers from CMS');
    }
    
    return response.json();
  }

  async getSpeaker(idOrSlug) {
    // Placeholder: In the future, this will make a REST/GraphQL call to the CMS
    const response = await fetch(`${this.baseUrl}/speakers/${idOrSlug}`);
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  }
}

/**
 * Factory function to get the appropriate data provider
 */
function getDataProvider() {
  switch (DATA_SOURCE) {
    case 'cms':
      return new CMSDataProvider();
    case 'json':
    default:
      return new JSONDataProvider();
  }
}

// Create singleton instance
const dataProvider = getDataProvider();

/**
 * DAL Interface - Public API for accessing data
 */
export const DAL = {
  /**
   * Get agenda/schedule with optional filters
   * @param {Object} filters - Optional filters: { day, track, type, room }
   * @returns {Promise<Array>} Array of Talk objects
   */
  getAgenda: (filters) => dataProvider.getAgenda(filters),

  /**
   * Get a specific talk by ID or slug
   * @param {string} idOrSlug - Talk ID or slug
   * @returns {Promise<Object|null>} Talk object or null if not found
   */
  getTalk: (idOrSlug) => dataProvider.getTalk(idOrSlug),

  /**
   * Get speakers with optional filters
   * @param {Object} filters - Optional filters: { name }
   * @returns {Promise<Array>} Array of Speaker objects
   */
  getSpeakers: (filters) => dataProvider.getSpeakers(filters),

  /**
   * Get a specific speaker by ID or slug
   * @param {string} idOrSlug - Speaker ID or slug
   * @returns {Promise<Object|null>} Speaker object or null if not found
   */
  getSpeaker: (idOrSlug) => dataProvider.getSpeaker(idOrSlug)
};

export default DAL;
