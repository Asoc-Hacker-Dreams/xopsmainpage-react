import { openDB } from 'idb';

const DB_NAME = 'xops-agenda';
const DB_VERSION = 1;
const STORE_NAME = 'favorites';

/**
 * Initialize the IndexedDB database
 * @returns {Promise<IDBDatabase>}
 */
async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

/**
 * Get all favorite talk IDs
 * @returns {Promise<Set<string>>}
 */
export async function getFavorites() {
  try {
    const db = await initDB();
    const favorites = await db.get(STORE_NAME, 'favorites');
    return new Set(favorites || []);
  } catch (error) {
    console.error('Error getting favorites:', error);
    return new Set();
  }
}

/**
 * Add a talk to favorites
 * @param {string} talkId - The ID of the talk to favorite
 * @returns {Promise<Set<string>>}
 */
export async function addFavorite(talkId) {
  try {
    const db = await initDB();
    const favorites = await getFavorites();
    favorites.add(talkId);
    await db.put(STORE_NAME, Array.from(favorites), 'favorites');
    return favorites;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
}

/**
 * Remove a talk from favorites
 * @param {string} talkId - The ID of the talk to unfavorite
 * @returns {Promise<Set<string>>}
 */
export async function removeFavorite(talkId) {
  try {
    const db = await initDB();
    const favorites = await getFavorites();
    favorites.delete(talkId);
    await db.put(STORE_NAME, Array.from(favorites), 'favorites');
    return favorites;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
}

/**
 * Toggle a talk favorite status
 * @param {string} talkId - The ID of the talk to toggle
 * @returns {Promise<{favorites: Set<string>, isFavorite: boolean}>}
 */
export async function toggleFavorite(talkId) {
  try {
    const favorites = await getFavorites();
    const isFavorite = favorites.has(talkId);
    
    if (isFavorite) {
      await removeFavorite(talkId);
      favorites.delete(talkId);
    } else {
      await addFavorite(talkId);
      favorites.add(talkId);
    }
    
    return { favorites, isFavorite: !isFavorite };
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}

/**
 * Clear all favorites
 * @returns {Promise<void>}
 */
export async function clearFavorites() {
  try {
    const db = await initDB();
    await db.put(STORE_NAME, [], 'favorites');
  } catch (error) {
    console.error('Error clearing favorites:', error);
    throw error;
  }
}
