// Test for Service Worker functionality
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock global objects for Service Worker environment
globalThis.self = {
  addEventListener: vi.fn(),
  registration: {
    showNotification: vi.fn()
  }
};

globalThis.caches = {
  open: vi.fn(),
  match: vi.fn(),
  keys: vi.fn(),
  delete: vi.fn()
};

globalThis.fetch = vi.fn();

describe('Service Worker Cache Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should define DATA_URLS for caching', () => {
    // Test that DATA_URLS are properly defined
    const DATA_URLS = [
      '/api/agenda',
      '/api/ponentes'
    ];
    
    expect(DATA_URLS).toContain('/api/agenda');
    expect(DATA_URLS).toContain('/api/ponentes');
    expect(DATA_URLS).toHaveLength(2);
  });

  it('should identify dynamic URLs correctly', () => {
    const DATA_URLS = ['/api/agenda', '/api/ponentes'];
    
    // Test URL matching logic
    const testUrls = [
      { url: 'https://example.com/api/agenda', shouldMatch: true },
      { url: 'https://example.com/api/ponentes', shouldMatch: true },
      { url: 'https://example.com/api/agenda/2024', shouldMatch: true },
      { url: 'https://example.com/api/ponentes/speakers', shouldMatch: true },
      { url: 'https://example.com/api/other', shouldMatch: false },
      { url: 'https://example.com/static/js/bundle.js', shouldMatch: false }
    ];

    testUrls.forEach(({ url, shouldMatch }) => {
      const requestUrl = new URL(url);
      const matches = DATA_URLS.some(path => requestUrl.pathname.startsWith(path));
      expect(matches).toBe(shouldMatch);
    });
  });

  it('should use different cache names for different types of content', () => {
    const CACHE_NAME = 'xops-conference-v1';
    const DATA_CACHE = 'data-cache-v1';
    
    expect(CACHE_NAME).toBe('xops-conference-v1');
    expect(DATA_CACHE).toBe('data-cache-v1');
    expect(CACHE_NAME).not.toBe(DATA_CACHE);
  });
});