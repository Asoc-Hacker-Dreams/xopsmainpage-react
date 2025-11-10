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
