const CACHE_NAME = 'cavinte-work-log-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Note: Caching of dynamically imported modules from CDNs is handled by browser/CDN headers.
  // This service worker primarily ensures the app shell is available offline.
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // We only handle navigation requests for the app shell (index.html).
  // Other assets (JS, CSS from CDN, API calls) are network-first.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  } else {
    // For non-navigation requests, go to the network first.
    event.respondWith(
      fetch(event.request).catch(() => {
        // If network fails, try to serve from cache if it exists.
        return caches.match(event.request);
      })
    );
  }
});


self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});