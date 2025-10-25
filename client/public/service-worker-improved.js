// Service Worker Melhorado com Cache Busting e Atualização Automática
// Versão: 2.1 - Incluindo timestamp para forçar atualizações

const VERSION = '2';
const BUILD_TIMESTAMP = '1729896000000'; // Atualizar em cada deploy
const CACHE_NAME = `carmigui-cache-v${VERSION}-${BUILD_TIMESTAMP}`;

const ASSETS_TO_CACHE = [
  '/',
  '/attached_assets/Component 1_1760554140338.webp',
  '/attached_assets/Component 3 (1)_1760555027927.png'
];

// Install - Cache assets críticos
self.addEventListener('install', (event) => {
  console.log('[SW] Install - Versão:', CACHE_NAME);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cacheando assets críticos');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('[SW] Assets cacheados com sucesso');
        // Forçar ativação imediata da nova versão
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Erro ao cachear assets:', error);
      })
  );
});

// Activate - Limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate - Limpando caches antigos');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Deletar todos os caches que não são a versão atual
            if (cacheName.startsWith('carmigui-cache') && cacheName !== CACHE_NAME) {
              console.log('[SW] Deletando cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Caches antigos limpos');
        // Assumir controle imediatamente de todas as abas
        return self.clients.claim();
      })
  );
});

// Fetch - Estratégia Cache First com Network Fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Ignorar requisições de outros domínios
  if (url.origin !== location.origin) {
    return;
  }
  
  // Ignorar requisições de API (sempre usar network)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Se encontrado no cache, retornar
        if (cachedResponse) {
          console.log('[SW] Cache hit:', url.pathname);
          return cachedResponse;
        }

        // Se não, buscar da rede
        console.log('[SW] Cache miss, buscando da rede:', url.pathname);
        
        return fetch(event.request)
          .then((response) => {
            // Verificar se é uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar a resposta (pode ser lida apenas uma vez)
            const responseToCache = response.clone();

            // Cachear dinamicamente apenas assets estáticos
            if (shouldCacheDynamically(url.pathname)) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  console.log('[SW] Cacheando dinamicamente:', url.pathname);
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch((error) => {
            console.error('[SW] Fetch falhou:', url.pathname, error);
            
            // Retornar página offline se disponível
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            throw error;
          });
      })
  );
});

// Função helper para determinar se deve cachear
function shouldCacheDynamically(pathname) {
  const cacheableExtensions = [
    '.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif',
    '.woff', '.woff2', '.ttf', '.otf',
    '.css', '.js'
  ];
  
  return cacheableExtensions.some(ext => pathname.endsWith(ext));
}

// Message - Permitir skip waiting manual
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Skip waiting solicitado pelo cliente');
    self.skipWaiting();
  }
});

// Notificar clientes sobre nova versão
self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'SW_UPDATED',
          version: VERSION,
          cacheName: CACHE_NAME
        });
      });
    })
  );
});

console.log('[SW] Service Worker carregado - Versão:', CACHE_NAME);
