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

// Definir URLs dinámicas a cachear para uso offline:
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
    ]).then(() => self.skipWaiting()).catch((error) => {
      console.log('Cache installation failed:', error);
    })
  );
});

// Fetch event - implement advanced cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const requestUrl = new URL(event.request.url);

  // Ignore non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Strategy: Stale-While-Revalidate for content.json files
  if (request.url.includes('content.json')) {
    event.respondWith(
      caches.open(CONTENT_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Network failed, return cached version if available
            return cachedResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Strategy: Network First for dynamic content URLs (API endpoints)
  if (contentUrlsToCache.some(path => requestUrl.pathname.startsWith(path))) {
    event.respondWith(
      caches.open(CONTENT_CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          // Always try to fetch fresh data first
          const fetchPromise = fetch(event.request).then(networkResponse => {
            // Cache the fresh response
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Network failed, return cached version if available
            return cachedResponse;
          });
          
          // Return cached response immediately if available, otherwise wait for network
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Strategy: Cache First for App Shell and other assets with dynamic image caching
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

          // Dynamic caching for images
          if (request.url.match(/\.(png|jpg|jpeg|gif)$/)) {
            caches.open(CONTENT_CACHE_NAME).then(cache => cache.put(event.request, responseToCache.clone()));
          } else {
            // Use shell cache for static assets
            caches.open(SHELL_CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
          }

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
    }).then(() => self.clients.claim())
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