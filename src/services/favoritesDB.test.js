import { describe, it, expect, beforeEach, vi } from 'vitest';
import { openDB } from 'idb';

// Mock idb
vi.mock('idb', () => ({
  openDB: vi.fn(),
}));

describe('favoritesDB', () => {
  let mockDB;

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks();

    // Create mock DB
    mockDB = {
      get: vi.fn(),
      put: vi.fn(),
      objectStoreNames: {
        contains: vi.fn(() => false),
      },
      createObjectStore: vi.fn(),
    };

    openDB.mockResolvedValue(mockDB);

    // Clear the module cache to reset the database state
    vi.resetModules();
  });

  describe('getFavorites', () => {
    it('returns empty Set when no favorites exist', async () => {
      mockDB.get.mockResolvedValue(undefined);
      
      const { getFavorites } = await import('./favoritesDB');
      const favorites = await getFavorites();

      expect(favorites).toBeInstanceOf(Set);
      expect(favorites.size).toBe(0);
    });

    it('returns Set with favorites when they exist', async () => {
      mockDB.get.mockResolvedValue(['talk-1', 'talk-2']);
      
      const { getFavorites } = await import('./favoritesDB');
      const favorites = await getFavorites();

      expect(favorites).toBeInstanceOf(Set);
      expect(favorites.size).toBe(2);
      expect(favorites.has('talk-1')).toBe(true);
      expect(favorites.has('talk-2')).toBe(true);
    });

    it('handles errors gracefully', async () => {
      mockDB.get.mockRejectedValue(new Error('DB Error'));
      
      const { getFavorites } = await import('./favoritesDB');
      const favorites = await getFavorites();

      expect(favorites).toBeInstanceOf(Set);
      expect(favorites.size).toBe(0);
    });
  });

  describe('addFavorite', () => {
    it('adds a talk to favorites', async () => {
      mockDB.get.mockResolvedValue(['talk-1']);
      mockDB.put.mockResolvedValue(undefined);
      
      const { addFavorite } = await import('./favoritesDB');
      const favorites = await addFavorite('talk-2');

      expect(favorites.has('talk-1')).toBe(true);
      expect(favorites.has('talk-2')).toBe(true);
      expect(mockDB.put).toHaveBeenCalledWith(
        'favorites',
        expect.arrayContaining(['talk-1', 'talk-2']),
        'favorites'
      );
    });
  });

  describe('removeFavorite', () => {
    it('removes a talk from favorites', async () => {
      mockDB.get.mockResolvedValue(['talk-1', 'talk-2']);
      mockDB.put.mockResolvedValue(undefined);
      
      const { removeFavorite } = await import('./favoritesDB');
      const favorites = await removeFavorite('talk-1');

      expect(favorites.has('talk-1')).toBe(false);
      expect(favorites.has('talk-2')).toBe(true);
      expect(mockDB.put).toHaveBeenCalledWith(
        'favorites',
        ['talk-2'],
        'favorites'
      );
    });
  });

  describe('toggleFavorite', () => {
    it('adds a talk if not favorited', async () => {
      mockDB.get.mockResolvedValue([]);
      mockDB.put.mockResolvedValue(undefined);
      
      const { toggleFavorite } = await import('./favoritesDB');
      const result = await toggleFavorite('talk-1');

      expect(result.isFavorite).toBe(true);
      expect(result.favorites.has('talk-1')).toBe(true);
    });

    it('removes a talk if already favorited', async () => {
      mockDB.get.mockResolvedValue(['talk-1']);
      mockDB.put.mockResolvedValue(undefined);
      
      const { toggleFavorite } = await import('./favoritesDB');
      const result = await toggleFavorite('talk-1');

      expect(result.isFavorite).toBe(false);
      expect(result.favorites.has('talk-1')).toBe(false);
    });
  });

  describe('clearFavorites', () => {
    it('clears all favorites', async () => {
      mockDB.put.mockResolvedValue(undefined);
      
      const { clearFavorites } = await import('./favoritesDB');
      await clearFavorites();

      expect(mockDB.put).toHaveBeenCalledWith('favorites', [], 'favorites');
    });
  });
});
