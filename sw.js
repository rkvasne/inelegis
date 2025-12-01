const CACHE_NAME = 'inelegis-v0.0.6';
const ASSETS = [
  './',
  './index',
  './consulta',
  './sobre',
  './faq',
  './landing',
  './styles.css',
  './script.js',
  './data.js',
  './icons/apple-touch-icon.png'
];

// Instalação: Cacheia arquivos essenciais
self.addEventListener('install', (event) => {
  // Força o SW a assumir o controle imediatamente (skipWaiting)
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching assets');
        return cache.addAll(ASSETS);
      })
      .catch(err => console.error('[SW] Falha ao cachear assets:', err))
  );
});

// Ativação: Limpa caches antigos e assume controle das abas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Assume controle de todos os clientes abertos imediatamente
      self.clients.claim(),
      // Limpa caches antigos
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

// Fetch: Estratégia Stale-While-Revalidate para melhor performance e atualização
self.addEventListener('fetch', (event) => {
  // Ignora requisições não-GET ou para outros domínios (opcional, mas seguro)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Se tiver no cache, retorna ele
        if (cachedResponse) {
          // Opcional: Atualiza o cache em background (Stale-While-Revalidate)
          // fetch(event.request).then(response => {
          //   caches.open(CACHE_NAME).then(cache => cache.put(event.request, response));
          // });
          return cachedResponse;
        }

        // Se não tiver no cache, busca na rede
        return fetch(event.request)
          .then((response) => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta para salvar no cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
      .catch(() => {
        // Fallback offline (opcional: retornar página offline customizada)
        console.log('[SW] Falha no fetch e sem cache:', event.request.url);
      })
  );
});
