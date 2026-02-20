const CACHE_NAME = "ineleg-cache-v4";
const ASSETS = [
  "/",
  "/index.html",
  "/styles/styles.css?v=0.3.25",
  "/assets/js/components/theme-bootstrap.js?v=0.3.25",
  "/assets/js/components/components.js?v=0.3.25",
  "/assets/js/components/theme-manager.js?v=0.3.25",
  "/assets/js/ui/ui-enhancements.js?v=0.3.25",
  "/assets/js/utils/sanitizer.js?v=0.3.25",
  "/assets/js/services/storage.js?v=0.3.25",
  "/assets/js/components/modal-manager.js?v=0.3.25",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const request = event.request;
  const url = new URL(request.url);

  // Ignorar requisições externas (fonts, APIs, etc.) para evitar CSP violations
  if (url.origin !== self.location.origin) {
    return;
  }

  const isNavigation = request.mode === "navigate";

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached && !isNavigation) {
        return cached;
      }

      return fetch(request)
        .then((response) => {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
          return response;
        })
        .catch(() => {
          if (cached) {
            return cached;
          }
          if (isNavigation) {
            return caches.match("/index.html");
          }
          return undefined;
        });
    }),
  );
});
