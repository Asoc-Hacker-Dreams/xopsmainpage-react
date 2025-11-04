import { useState, useEffect, useCallback } from 'react';
import { getFavorites, toggleFavorite as toggleFavoriteDB } from '../services/favoritesDB';

/**
 * Custom hook for managing talk favorites
 * @returns {Object} Favorites management object
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Load favorites from IndexedDB on mount
  useEffect(() => {
    async function loadFavorites() {
      try {
        const favs = await getFavorites();
        setFavorites(favs);
      } catch (error) {
        console.error('Failed to load favorites:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, []);

  /**
   * Toggle favorite status for a talk
   * Uses optimistic UI - updates immediately, then syncs with DB
   * @param {string} talkId - The ID of the talk to toggle
   */
  const toggleFavorite = useCallback(async (talkId) => {
    // Optimistic UI update
    const newFavorites = new Set(favorites);
    const wasFavorite = newFavorites.has(talkId);
    
    if (wasFavorite) {
      newFavorites.delete(talkId);
    } else {
      newFavorites.add(talkId);
    }
    
    setFavorites(newFavorites);

    // Sync with IndexedDB
    try {
      await toggleFavoriteDB(talkId);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Rollback on error
      setFavorites(favorites);
    }
  }, [favorites]);

  /**
   * Check if a talk is favorited
   * @param {string} talkId - The ID of the talk to check
   * @returns {boolean}
   */
  const isFavorite = useCallback((talkId) => {
    return favorites.has(talkId);
  }, [favorites]);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
  };
}
