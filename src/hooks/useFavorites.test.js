import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useFavorites from './useFavorites';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useFavorites hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with empty favorites', () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.favorites).toEqual([]);
    expect(result.current.count).toBe(0);
  });

  it('should add a favorite', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite('talk-1');
    });

    expect(result.current.favorites).toContain('talk-1');
    expect(result.current.count).toBe(1);
    expect(result.current.isFavorite('talk-1')).toBe(true);
  });

  it('should not add duplicate favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite('talk-1');
      result.current.addFavorite('talk-1');
    });

    expect(result.current.favorites).toEqual(['talk-1']);
    expect(result.current.count).toBe(1);
  });

  it('should remove a favorite', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite('talk-1');
      result.current.addFavorite('talk-2');
    });

    expect(result.current.count).toBe(2);

    act(() => {
      result.current.removeFavorite('talk-1');
    });

    expect(result.current.favorites).not.toContain('talk-1');
    expect(result.current.favorites).toContain('talk-2');
    expect(result.current.count).toBe(1);
  });

  it('should toggle a favorite', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite('talk-1');
    });

    expect(result.current.isFavorite('talk-1')).toBe(true);

    act(() => {
      result.current.toggleFavorite('talk-1');
    });

    expect(result.current.isFavorite('talk-1')).toBe(false);
  });

  it('should check if a talk is favorite', () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.isFavorite('talk-1')).toBe(false);

    act(() => {
      result.current.addFavorite('talk-1');
    });

    expect(result.current.isFavorite('talk-1')).toBe(true);
    expect(result.current.isFavorite('talk-2')).toBe(false);
  });

  it('should clear all favorites', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite('talk-1');
      result.current.addFavorite('talk-2');
      result.current.addFavorite('talk-3');
    });

    expect(result.current.count).toBe(3);

    act(() => {
      result.current.clearFavorites();
    });

    expect(result.current.favorites).toEqual([]);
    expect(result.current.count).toBe(0);
  });

  it('should persist favorites to localStorage', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.addFavorite('talk-1');
      result.current.addFavorite('talk-2');
    });

    const stored = localStorage.getItem('xops-favorites');
    expect(stored).toBeDefined();
    expect(JSON.parse(stored)).toEqual(['talk-1', 'talk-2']);
  });

  it('should load favorites from localStorage on mount', () => {
    // Pre-populate localStorage
    localStorage.setItem('xops-favorites', JSON.stringify(['talk-1', 'talk-2']));

    const { result } = renderHook(() => useFavorites());

    expect(result.current.favorites).toEqual(['talk-1', 'talk-2']);
    expect(result.current.count).toBe(2);
    expect(result.current.isFavorite('talk-1')).toBe(true);
    expect(result.current.isFavorite('talk-2')).toBe(true);
  });

  it('should handle corrupted localStorage data gracefully', () => {
    // Set invalid JSON in localStorage
    localStorage.setItem('xops-favorites', 'invalid json');

    const { result } = renderHook(() => useFavorites());

    // Should initialize with empty array
    expect(result.current.favorites).toEqual([]);
    expect(result.current.count).toBe(0);
  });

  it('should provide accurate count of favorites', () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.addFavorite('talk-1');
    });
    expect(result.current.count).toBe(1);

    act(() => {
      result.current.addFavorite('talk-2');
    });
    expect(result.current.count).toBe(2);

    act(() => {
      result.current.removeFavorite('talk-1');
    });
    expect(result.current.count).toBe(1);
  });
});
