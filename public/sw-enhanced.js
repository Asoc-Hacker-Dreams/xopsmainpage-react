// Service Worker for X-Ops Conference PWA - Enhanced Version
const SHELL_CACHE_NAME = 'xops-shell-v2';
const CONTENT_CACHE_NAME = 'xops-content-v2';
const DATA_CACHE_NAME = 'xops-data-v1';
const WHITELISTED_CACHES = [SHELL_CACHE_NAME, CONTENT_CACHE_NAME, DATA_CACHE_NAME];

// App Shell - Static assets to cache immediately
const shellUrlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512x512.png',
];

// Content URLs to cache for offline use
const contentUrlsToCache = [
  '/api/agenda',
  '/api/speakers',
  '/api/venue',
];

// Data that changes frequently - use network first with cache fallback
const dynamicDataUrls = [
  '/api/tickets',
  '/api/user',
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache shell resources
      caches.open(SHELL_CACHE_NAME)
        .then((cache) => {
          console.log('[SW] Caching app shell');
          return cache.addAll(shellUrlsToCache);
        }),
      // Pre-cache content if available
      caches.open(CONTENT_CACHE_NAME)
        .then((cache) => {
          console.log('[SW] Pre-caching content');
          return Promise.allSettled(
            contentUrlsToCache.map(url => 
              fetch(url)
                .then(response => {
                  if (response.ok) {
                    return cache.put(url, response);
                  }
                })
                .catch(() => console.log('[SW] Content URL not available:', url))
            )
          );
        })
    ]).then(() => {
      console.log('[SW] Installation complete, skipping waiting');
      return self.skipWaiting();
    })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!WHITELISTED_CACHES.includes(cacheName)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - implement cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const requestUrl = new URL(event.request.url);

  // Ignore non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Ignore chrome-extension and other non-http(s) requests
  if (!requestUrl.protocol.startsWith('http')) {
    return;
  }

  // Strategy: Network First for API calls (fresh data when online)
  if (requestUrl.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, DATA_CACHE_NAME));
    return;
  }

  // Strategy: Stale-While-Revalidate for content.json and similar files
  if (requestUrl.pathname.includes('content.json') || 
      requestUrl.pathname.includes('schedule') ||
      requestUrl.pathname.includes('speakers')) {
    event.respondWith(staleWhileRevalidate(request, CONTENT_CACHE_NAME));
    return;
  }

  // Strategy: Cache First for static assets (images, CSS, JS)
  if (requestUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?)$/)) {
    event.respondWith(cacheFirst(request, CONTENT_CACHE_NAME));
    return;
  }

  // Strategy: Network First for navigation (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request, SHELL_CACHE_NAME)
        .catch(() => caches.match('/'))
    );
    return;
  }

  // Default: Network with cache fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        // Clone and cache valid responses
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CONTENT_CACHE_NAME)
            .then(cache => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Cache Strategies

// Cache First - Good for static assets that don't change often
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache First failed:', error);
    // Return offline placeholder for images
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#ddd" width="200" height="200"/><text fill="#999" x="50%" y="50%" text-anchor="middle">Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    throw error;
  }
}

// Network First - Good for API calls and dynamic content
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network First - falling back to cache');
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate - Good for content that updates but can be stale briefly
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse && networkResponse.status === 200) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// Background Sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'feedback-sync') {
    event.waitUntil(syncFeedback());
  }
  if (event.tag === 'cfp-sync') {
    event.waitUntil(syncCFP());
  }
});

async function syncFeedback() {
  try {
    const pendingFeedback = await getPendingData('pending-feedback');
    for (const feedback of pendingFeedback) {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });
    }
    await clearPendingData('pending-feedback');
    console.log('[SW] Feedback synced successfully');
  } catch (error) {
    console.error('[SW] Feedback sync failed:', error);
  }
}

async function syncCFP() {
  try {
    const pendingCFP = await getPendingData('pending-cfp');
    for (const cfp of pendingCFP) {
      await fetch('/api/cfp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfp),
      });
    }
    await clearPendingData('pending-cfp');
    console.log('[SW] CFP synced successfully');
  } catch (error) {
    console.error('[SW] CFP sync failed:', error);
  }
}

// IndexedDB helpers for pending data
async function getPendingData(storeName) {
  // Simplified - in production, use IndexedDB properly
  return [];
}

async function clearPendingData(storeName) {
  // Simplified - in production, use IndexedDB properly
}

// Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'Nueva actualización de X-Ops Conference',
    icon: '/icon-512x512.png',
    badge: '/icon-512x512.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
    },
    actions: [
      {
        action: 'view',
        title: 'Ver',
        icon: '/icon-512x512.png',
      },
      {
        action: 'close',
        title: 'Cerrar',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'X-Ops Conference',
      options
    )
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    const urlToOpen = event.notification.data?.url || '/';
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Focus existing window if open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if no existing window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Message handling for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CONTENT_CACHE_NAME)
        .then(cache => cache.addAll(event.data.urls))
    );
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => 
        Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)))
      )
    );
  }
});

console.log('[SW] Service Worker loaded');
