const CACHE_NAME = 'ineleg-app-v0.0.3';
const ASSETS = [
  './',
  './index.html',
  './styles-compact.css',
  './script.js',
  './data.js',
  './js/utils.js',
  './js/parser.js',
  './js/search.js',
  './js/ui.js',
  './js/config.js',
  './icons/apple-touch-icon.png',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
