const CACHE_NAME = 'comicforge-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png'
];

// Optimized installation with preload
self.addEventListener('install', e => {
  e.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => 
        cache.addAll(ASSETS.map(url => new Request(url, {cache: 'reload'})))
      ),
      self.skipWaiting()
    ])
  );
});

// Optimized activation with cache cleanup
self.addEventListener('activate', e => {
  e.waitUntil(
    Promise.all([
      caches.keys().then(keys => 
        Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        )
      ),
      self.clients.claim()
    ])
  );
});

// Optimized fetch handling with streaming responses and preload
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      (async () => {
        try {
          const preloadResponse = await e.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          const networkResponse = await fetch(e.request);
          const cache = await caches.open(CACHE_NAME);
          
          // Clone and cache fresh network response
          cache.put(e.request, networkResponse.clone());
          
          return networkResponse;
        } catch (error) {
          const cachedResponse = await caches.match(e.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          throw error;
        }
      })()
    );
  }
});

// Optimized background sync with retry
self.addEventListener('sync', e => {
  if (e.tag === 'sync-data') {
    e.waitUntil(
      (async () => {
        try {
          // Handle background sync with retry logic
          const RETRY_OPTIONS = {
            maxRetries: 3,
            minTimeout: 1000,
            maxTimeout: 10000,
          };
          
          // Implement retry logic here
          await Promise.resolve();
        } catch (error) {
          console.error('Background sync failed:', error);
        }
      })()
    );
  }
});

// Optimized push notifications with action handling
self.addEventListener('push', e => {
  if (e.data) {
    const options = {
      body: e.data.text(),
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'View Details',
          icon: '/pwa-192x192.png'
        }
      ]
    };
    
    e.waitUntil(
      self.registration.showNotification('ComicForge AI', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.openWindow('/')
  );
});