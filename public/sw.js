// Service Worker for X-Ops Conference PWA
const SHELL_CACHE_NAME = 'xops-shell-v1';
const CONTENT_CACHE_NAME = 'xops-content-v1';
const WHITELISTED_CACHES = [SHELL_CACHE_NAME, CONTENT_CACHE_NAME];

const shellUrlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-512x512.png'
];

// Dynamic API URLs to cache for offline functionality
const contentUrlsToCache = [
  '/api/agenda',
  '/api/ponentes'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache shell resources
      caches.open(SHELL_CACHE_NAME)
        .then((cache) => {
          console.log('Opened shell cache');
          return cache.addAll(shellUrlsToCache);
        }),
      // Cache content/API resources (if available)
      caches.open(CONTENT_CACHE_NAME)
        .then((cache) => {
          console.log('Opened content cache');
          // Try to cache content URLs, but don't fail if they're not available
          return Promise.allSettled(
            contentUrlsToCache.map(url => 
              fetch(url).then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
              }).catch(() => {
                // Ignore network errors during install
                console.log('Content URL not available during install:', url);
              })
            )
          );
        })
    ]).catch((error) => {
      console.log('Cache installation failed:', error);
    })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If found in cache, return it
        if (response) {
          return response;
        }

        // Clone the request for fetch
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response for cache
          const responseToCache = response.clone();

          // Determine which cache to use based on request
          const isAPIRequest = event.request.url.includes('/api/');
          const cacheName = isAPIRequest ? CONTENT_CACHE_NAME : SHELL_CACHE_NAME;

          caches.open(cacheName)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Return offline page if available
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!WHITELISTED_CACHES.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle background sync (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
  }
});

// Handle push notifications (optional)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización de X-Ops Conference',
    icon: '/icon-512x512.png',
    badge: '/icon-512x512.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalles',
        icon: '/icon-512x512.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icon-512x512.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('X-Ops Conference', options)
  );
});