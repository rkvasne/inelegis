const CACHE_NAME = 'inelegis-v0.0.9';
const ASSETS = [
  './',
  './index.html',
  './consulta.html',
  './sobre.html',
  './faq.html',
  './landing.html',
  './styles.css',
  './script.js',
  './data.js',
  './logo.png',
  './favicon.ico'
];

// Instalação: Cacheia arquivos essenciais
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching assets v0.0.9');
        return cache.addAll(ASSETS);
      })
      .catch(err => console.error('[SW] Falha ao cachear:', err))
  );
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('[SW] Removendo cache antigo:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
    ])
  );
});

// Fetch: Network First para HTML, Cache First para assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Para arquivos HTML: sempre buscar da rede primeiro
  if (event.request.mode === 'navigate' || 
      url.pathname.endsWith('.html') || 
      url.pathname === '/' ||
      !url.pathname.includes('.')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Atualiza o cache com a nova versão
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback para cache se offline
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Para assets (CSS, JS, imagens): Cache First
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Atualiza em background
          fetch(event.request).then((response) => {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response);
            });
          });
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
  );
});
