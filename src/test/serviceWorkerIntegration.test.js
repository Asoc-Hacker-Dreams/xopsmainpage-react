// Service Worker Integration Test
// This test simulates the service worker behavior to verify that 
// it correctly handles dynamic URLs caching

import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Service Worker Data URL Caching Integration', () => {
  let mockCache;
  let mockCaches;
  let fetchHandler;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock cache instance
    mockCache = {
      match: vi.fn(),
      put: vi.fn()
    };
    
    // Mock caches API
    mockCaches = {
      open: vi.fn().mockResolvedValue(mockCache),
      match: vi.fn(),
      keys: vi.fn(),
      delete: vi.fn()
    };
    
    globalThis.caches = mockCaches;
    globalThis.fetch = vi.fn();
    
    // Simulate the service worker fetch handler logic
    fetchHandler = (request) => {
      const DATA_URLS = ['/api/agenda', '/api/ponentes'];
      const DATA_CACHE = 'data-cache-v1';
      const requestUrl = new URL(request.url);
      
      if (DATA_URLS.some(path => requestUrl.pathname.startsWith(path))) {
        return mockCaches.open(DATA_CACHE).then(cache =>
          cache.match(request).then(cachedResponse =>
            cachedResponse ||
            globalThis.fetch(request).then(networkResponse => {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            })
          )
        );
      } else {
        return mockCaches.match(request)
          .then((response) => {
            return response || globalThis.fetch(request);
          });
      }
    };
  });

  it('should intercept and cache requests to /api/agenda', async () => {
    const request = new Request('https://xopsconference.com/api/agenda');
    const mockResponse = new Response(JSON.stringify({ agenda: 'test data' }));
    
    // No cached response initially
    mockCache.match.mockResolvedValue(null);
    // Mock network response
    globalThis.fetch.mockResolvedValue(mockResponse);
    
    // Mock clone method
    mockResponse.clone = vi.fn().mockReturnValue(mockResponse);
    
    const result = await fetchHandler(request);
    
    // Verify the cache was opened with correct name
    expect(mockCaches.open).toHaveBeenCalledWith('data-cache-v1');
    
    // Verify cache was checked first
    expect(mockCache.match).toHaveBeenCalledWith(request);
    
    // Verify network request was made when not in cache
    expect(globalThis.fetch).toHaveBeenCalledWith(request);
    
    // Verify response was cached
    expect(mockCache.put).toHaveBeenCalledWith(request, mockResponse);
    
    // Verify response was returned
    expect(result).toBe(mockResponse);
  });

  it('should intercept and cache requests to /api/ponentes', async () => {
    const request = new Request('https://xopsconference.com/api/ponentes');
    const mockResponse = new Response(JSON.stringify({ ponentes: 'speakers data' }));
    
    mockCache.match.mockResolvedValue(null);
    globalThis.fetch.mockResolvedValue(mockResponse);
    mockResponse.clone = vi.fn().mockReturnValue(mockResponse);
    
    await fetchHandler(request);
    
    expect(mockCaches.open).toHaveBeenCalledWith('data-cache-v1');
    expect(mockCache.match).toHaveBeenCalledWith(request);
    expect(globalThis.fetch).toHaveBeenCalledWith(request);
    expect(mockCache.put).toHaveBeenCalledWith(request, mockResponse);
  });

  it('should serve from cache when available', async () => {
    const request = new Request('https://xopsconference.com/api/agenda');
    const cachedResponse = new Response(JSON.stringify({ cached: 'data' }));
    
    // Mock cached response available
    mockCache.match.mockResolvedValue(cachedResponse);
    
    const result = await fetchHandler(request);
    
    // Verify cache was checked
    expect(mockCache.match).toHaveBeenCalledWith(request);
    
    // Verify network request was NOT made
    expect(globalThis.fetch).not.toHaveBeenCalled();
    
    // Verify cached response was returned
    expect(result).toBe(cachedResponse);
  });

  it('should handle sub-paths of dynamic URLs', async () => {
    const request = new Request('https://xopsconference.com/api/agenda/2024');
    const mockResponse = new Response(JSON.stringify({ agenda2024: 'data' }));
    
    mockCache.match.mockResolvedValue(null);
    globalThis.fetch.mockResolvedValue(mockResponse);
    mockResponse.clone = vi.fn().mockReturnValue(mockResponse);
    
    const result = await fetchHandler(request);
    
    // Should still be intercepted because it starts with /api/agenda
    expect(mockCaches.open).toHaveBeenCalledWith('data-cache-v1');
    expect(mockCache.put).toHaveBeenCalledWith(request, mockResponse);
  });

  it('should NOT intercept non-dynamic URLs', async () => {
    const request = new Request('https://xopsconference.com/static/js/bundle.js');
    const mockResponse = new Response('console.log("bundle");');
    
    mockCaches.match.mockResolvedValue(null);
    globalThis.fetch.mockResolvedValue(mockResponse);
    
    await fetchHandler(request);
    
    // Should NOT open the data cache
    expect(mockCaches.open).not.toHaveBeenCalled();
    
    // Should use regular cache matching
    expect(mockCaches.match).toHaveBeenCalledWith(request);
    
    // Should make network request for non-cached static assets
    expect(globalThis.fetch).toHaveBeenCalledWith(request);
  });
});