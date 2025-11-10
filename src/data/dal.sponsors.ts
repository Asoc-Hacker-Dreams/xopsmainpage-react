import type { Sponsor } from '../types/sponsor';

/**
 * IndexedDB database name and version
 */
const DB_NAME = 'xops-sponsors-db';
const DB_VERSION = 1;
const STORE_NAME = 'sponsors';
const METADATA_STORE = 'metadata';

/**
 * Data source configuration
 * Set VITE_SPONSORS_SOURCE=cms in environment to use CMS instead of JSON
 */
const DATA_SOURCE = import.meta.env.VITE_SPONSORS_SOURCE || 'json';

/**
 * Initialize IndexedDB database
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create sponsors store
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('slug', 'slug', { unique: true });
        store.createIndex('tier', 'tier', { unique: false });
      }

      // Create metadata store for tracking last update
      if (!db.objectStoreNames.contains(METADATA_STORE)) {
        db.createObjectStore(METADATA_STORE, { keyPath: 'key' });
      }
    };
  });
}

/**
 * Get all sponsors from IndexedDB
 */
async function getSponsorsFromIDB(): Promise<Sponsor[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const sponsors = request.result as Sponsor[];
      resolve(sponsors); // Return as-is, sorting will be done by sortSponsorsByTier
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get a single sponsor from IndexedDB by slug
 */
async function getSponsorFromIDB(slug: string): Promise<Sponsor | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('slug');
    const request = index.get(slug);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save sponsors to IndexedDB
 */
async function saveSponsorsToIDB(sponsors: Sponsor[]): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Clear existing data
    store.clear();

    // Add all sponsors
    sponsors.forEach((sponsor) => {
      store.add(sponsor);
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(new Error('Transaction aborted'));
  });
}

/**
 * Update last fetch timestamp in metadata store
 */
async function updateLastFetchTime(): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([METADATA_STORE], 'readwrite');
    const store = transaction.objectStore(METADATA_STORE);
    store.put({ key: 'lastFetch', timestamp: Date.now() });

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(new Error('Transaction aborted'));
  });
}

/**
 * Get last fetch timestamp from metadata store
 */
async function getLastFetchTime(): Promise<number | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([METADATA_STORE], 'readonly');
    const store = transaction.objectStore(METADATA_STORE);
    const request = store.get('lastFetch');

    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? result.timestamp : null);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Fetch sponsors from JSON file
 */
async function fetchSponsorsFromJSON(): Promise<Sponsor[]> {
  const response = await fetch('/data/sponsors.json');
  if (!response.ok) {
    throw new Error(`Failed to fetch sponsors: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch sponsors from CMS (placeholder implementation)
 * This is a placeholder for future CMS integration
 */
async function fetchSponsorsFromCMS(): Promise<Sponsor[]> {
  // Placeholder: In a real implementation, this would fetch from a headless CMS
  const cmsEndpoint = import.meta.env.VITE_CMS_SPONSORS_ENDPOINT;
  
  if (!cmsEndpoint) {
    console.warn('CMS endpoint not configured, falling back to JSON');
    return fetchSponsorsFromJSON();
  }

  try {
    const response = await fetch(cmsEndpoint, {
      headers: {
        'Content-Type': 'application/json',
        // Add authorization headers if needed
        ...(import.meta.env.VITE_CMS_API_KEY && {
          'Authorization': `Bearer ${import.meta.env.VITE_CMS_API_KEY}`
        })
      }
    });

    if (!response.ok) {
      throw new Error(`CMS fetch failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching from CMS, falling back to JSON:', error);
    return fetchSponsorsFromJSON();
  }
}

/**
 * Fetch sponsors from the configured data source
 */
async function fetchSponsorsFromSource(): Promise<Sponsor[]> {
  if (DATA_SOURCE === 'cms') {
    return fetchSponsorsFromCMS();
  }
  return fetchSponsorsFromJSON();
}

/**
 * Revalidate sponsors data in the background
 * This implements the "revalidate" part of stale-while-revalidate
 */
async function revalidateSponsors(): Promise<void> {
  try {
    const freshSponsors = await fetchSponsorsFromSource();
    await saveSponsorsToIDB(freshSponsors);
    await updateLastFetchTime();
  } catch (error) {
    console.error('Error revalidating sponsors:', error);
    // Don't throw - we're in the background, just log the error
  }
}

/**
 * Check if cached data is stale (older than 5 minutes)
 */
async function isCacheStale(): Promise<boolean> {
  const lastFetch = await getLastFetchTime();
  if (!lastFetch) return true;
  
  const STALE_TIME = 5 * 60 * 1000; // 5 minutes
  return Date.now() - lastFetch > STALE_TIME;
}

/**
 * Sort sponsors by tier priority (platinum > gold > silver > community)
 */
function sortSponsorsByTier(sponsors: Sponsor[]): Sponsor[] {
  const tierPriority: Record<string, number> = {
    'platinum': 1,
    'gold': 2,
    'silver': 3,
    'community': 4,
  };
  
  return [...sponsors].sort((a, b) => {
    const aPriority = tierPriority[a.tier] || 999;
    const bPriority = tierPriority[b.tier] || 999;
    return aPriority - bPriority;
  });
}

/**
 * Get all sponsors with stale-while-revalidate strategy
 * 
 * @returns Promise<Sponsor[]> Array of sponsors sorted by tier
 * 
 * Strategy:
 * 1. Try to return cached data from IndexedDB immediately
 * 2. If cache is stale, trigger background revalidation
 * 3. If no cache exists, fetch fresh data and cache it
 */
export async function getSponsors(): Promise<Sponsor[]> {
  try {
    // Try to get from cache first (stale-while-revalidate)
    const cachedSponsors = await getSponsorsFromIDB();

    if (cachedSponsors.length > 0) {
      // We have cached data, check if we need to revalidate
      const isStale = await isCacheStale();
      
      if (isStale) {
        // Cache is stale, trigger background revalidation
        // Don't await this - let it happen in the background
        revalidateSponsors().catch(console.error);
      }

      // Return cached data immediately (sorted by tier priority)
      return sortSponsorsByTier(cachedSponsors);
    }

    // No cache, fetch fresh data
    const freshSponsors = await fetchSponsorsFromSource();
    await saveSponsorsToIDB(freshSponsors);
    await updateLastFetchTime();
    
    return sortSponsorsByTier(freshSponsors);
  } catch (error) {
    console.error('Error getting sponsors:', error);
    
    // Try to return cached data even if it's stale as a fallback
    try {
      const cachedSponsors = await getSponsorsFromIDB();
      if (cachedSponsors.length > 0) {
        return sortSponsorsByTier(cachedSponsors);
      }
    } catch (cacheError) {
      console.error('Error getting cached sponsors:', cacheError);
    }
    
    // If all else fails, return empty array
    return [];
  }
}

/**
 * Get a single sponsor by slug with stale-while-revalidate strategy
 * 
 * @param slug - URL-friendly slug of the sponsor
 * @returns Promise<Sponsor|null> Sponsor object or null if not found
 * 
 * Strategy:
 * 1. Try to return cached sponsor from IndexedDB immediately
 * 2. If cache is stale, trigger background revalidation
 * 3. If no cache exists, fetch all sponsors and cache them
 */
export async function getSponsorBySlug(slug: string): Promise<Sponsor | null> {
  try {
    // Try to get from cache first
    const cachedSponsor = await getSponsorFromIDB(slug);

    if (cachedSponsor) {
      // We have cached data, check if we need to revalidate
      const isStale = await isCacheStale();
      
      if (isStale) {
        // Cache is stale, trigger background revalidation
        revalidateSponsors().catch(console.error);
      }

      // Return cached data immediately
      return cachedSponsor;
    }

    // No cache, fetch fresh data
    const freshSponsors = await fetchSponsorsFromSource();
    await saveSponsorsToIDB(freshSponsors);
    await updateLastFetchTime();
    
    const sponsor = freshSponsors.find(s => s.slug === slug);
    return sponsor || null;
  } catch (error) {
    console.error('Error getting sponsor by slug:', error);
    
    // Try to return cached data as a fallback
    try {
      const cachedSponsor = await getSponsorFromIDB(slug);
      return cachedSponsor || null;
    } catch (cacheError) {
      console.error('Error getting cached sponsor:', cacheError);
    }
    
    return null;
  }
}
