const CACHE_NAME = 'ineleg-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles/styles.css',
  '/assets/js/modules/theme-bootstrap.js',
  '/assets/js/modules/components.js',
  '/assets/js/modules/theme-manager.js',
  '/assets/js/modules/ui-enhancements.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  const request = event.request;
  const isNavigation = request.mode === 'navigate';

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached && !isNavigation) {
        return cached;
      }

      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const cloned = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
        return response;
      }).catch(() => {
        if (cached) {
          return cached;
        }
        if (isNavigation) {
          return caches.match('/index.html');
        }
        return undefined;
      });
    })
  );
});
