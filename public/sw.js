const CACHE_NAME = 'comicforge-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png'
];

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

self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      (async () => {
        try {
          const preloadResponse = await e.preloadResponse;
          if (preloadResponse) return preloadResponse;
          
          const networkResponse = await fetch(e.request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          const cachedResponse = await caches.match(e.request);
          return cachedResponse || Promise.reject(error);
        }
      })()
    );
  }
});

self.addEventListener('push', e => {
  if (e.data) {
    self.registration.showNotification('ComicForge AI', {
      body: e.data.text(),
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [100, 50, 100],
      data: { dateOfArrival: Date.now() },
      actions: [{ action: 'open', title: 'Open App' }]
    });
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});