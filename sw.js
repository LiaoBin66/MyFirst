const CACHE_NAME = 'compound-calculator-v1';
const urlsToCache = [
  '/MyFirst/',
  '/MyFirst/index.html',
  '/MyFirst/style.css',
  '/MyFirst/script.js',
  '/MyFirst/manifest.json',
  '/MyFirst/logo.png',
  '/MyFirst/icons/icon.png',
  '/MyFirst/icons/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/chart.js'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
  );
});