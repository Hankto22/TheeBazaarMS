const CACHE_NAME = 'bazaar-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/demo-data/services.json',
  '/demo-data/customers.json'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        if (event.request.url.includes('/carwash/services')) {
          return caches.match('/demo-data/services.json');
        }
        if (event.request.url.includes('/carwash/customers')) {
          return caches.match('/demo-data/customers.json');
        }
      });
    })
  );
});