const CACHE_NAME = 'comicforge-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png'
];

// Optimize installation
self.addEventListener('install', e => {
  e.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)),
      self.skipWaiting()
    ])
  );
});

// Optimize activation
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

// Optimize fetch handling with streaming responses
self.addEventListener('fetch', e => {
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
});

// Optimize background sync
self.addEventListener('sync', e => {
  if (e.tag === 'sync-data') {
    e.waitUntil(
      // Handle background sync
      Promise.resolve()
    );
  }
});

// Optimize push notifications
self.addEventListener('push', e => {
  if (e.data) {
    const options = {
      body: e.data.text(),
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png'
    };
    
    e.waitUntil(
      self.registration.showNotification('ComicForge AI', options)
    );
  }
});