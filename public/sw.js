// 🚀 **Advanced Service Worker - Universal PWA Support**
// Enables offline functionality, caching, and background sync

const CACHE_NAME = 'royal-springs-resort-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache for offline access
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  // All hero images
  '/bed-hero.jpg',
  '/bathroom-hero2.webp',
  '/apartment-hero.JPG',
  '/green-hero.JPG',
  '/hero-hotel-view.JPG',
  '/bedHhero1.jpg',
  '/bedhero2.jpg',
  // All gallery images
  '/bed-1.JPG',
  '/bed-2.JPG',
  '/bed-4.JPG',
  '/bed-5.JPG',
  '/bed2.jpg',
  '/bed4.jpg',
  '/hotel-house1.webp',
  '/hotel-house2.webp',
  '/hotel-house3.webp',
  '/hotel-house4.webp',
  '/hotel-house5.webp',
  '/hotel-house6.webp',
  '/hotel-house8.webp',
  '/hotel-road.JPG',
  '/hotel-view.JPG',
  '/bathroom1.webp',
  '/water-spring.webp',
  '/apartment-view.JPG',
  '/cahir$table-in-garden1.JPG',
  '/conference-room1.JPG',
  '/free-garden.JPG',
  '/garden-greens.JPG',
  '/garden-view.JPG',
  '/garden1.JPG',
  '/road-post.JPG',
  '/road-to-apartment.JPG',
  '/road-view.JPG',
  '/waterfall1.JPG',
  '/waterfall2.JPG',
  '/waterfall3.JPG'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('🚀 Royal Springs Resort PWA Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return Promise.all(
        STATIC_ASSETS.map((url) => {
          return cache.add(url).catch((error) => {
            console.warn(`Failed to cache ${url}:`, error);
          });
        })
      );
    }).then(() => {
      console.log('✅ Static assets cached successfully');
      self.skipWaiting();
    })
  );
});
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Some assets failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== RUNTIME_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fall back to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Strategy: Network first for API calls, cache first for static assets
  if (url.pathname.includes('/api/')) {
    // Network first for API - always try fresh data
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const cache = caches.open(RUNTIME_CACHE);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Fall back to cached response
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || new Response('Offline - API unavailable', { status: 503 });
          });
        })
    );
  } else if (
    url.pathname.includes('/images/') ||
    url.pathname.includes('.webp') ||
    url.pathname.includes('.png') ||
    url.pathname.includes('.jpg') ||
    url.pathname.includes('.jpeg')
  ) {
    // Cache first for images
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(request).then((response) => {
            if (response.ok && response.status === 200) {
              const cache = caches.open(IMAGE_CACHE);
              cache.then((c) => c.put(request, response.clone()));
            }
            return response;
          }).catch(() => {
            // Return placeholder image on error
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#e2e8f0" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" fill="#64748b">Image Offline</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          })
        );
      })
    );
  } else {
    // Cache first for other static assets
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(request).then((response) => {
            if (response.ok && response.status === 200) {
              const cache = caches.open(RUNTIME_CACHE);
              cache.then((c) => c.put(request, response.clone()));
            }
            return response;
          }).catch(() => {
            return new Response('Offline - Resource unavailable', { status: 503 });
          })
        );
      })
    );
  }
});

// Message event - for cache management from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHES') {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }
});
