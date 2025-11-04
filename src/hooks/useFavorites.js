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
    // Store previous state for rollback
    const previousFavorites = new Set(favorites);
    
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
      // Rollback on error using previous state
      setFavorites(previousFavorites);
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
import { useState, useEffect } from 'react';

/**
 * Hook to manage user's favorite talks
 * Stores favorites in localStorage for persistence
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    // Initialize from localStorage
    try {
      const stored = localStorage.getItem('xops-favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  });

  // Save to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem('xops-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  /**
   * Add a talk to favorites
   */
  const addFavorite = (talkId) => {
    setFavorites(prev => {
      if (!prev.includes(talkId)) {
        return [...prev, talkId];
      }
      return prev;
    });
  };

  /**
   * Remove a talk from favorites
   */
  const removeFavorite = (talkId) => {
    setFavorites(prev => prev.filter(id => id !== talkId));
  };

  /**
   * Toggle a talk's favorite status
   */
  const toggleFavorite = (talkId) => {
    setFavorites(prev => {
      if (prev.includes(talkId)) {
        return prev.filter(id => id !== talkId);
      }
      return [...prev, talkId];
    });
  };

  /**
   * Check if a talk is favorited
   */
  const isFavorite = (talkId) => {
    return favorites.includes(talkId);
  };

  /**
   * Clear all favorites
   */
  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.length
  };
}

export default useFavorites;
