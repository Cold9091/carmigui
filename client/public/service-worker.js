const CACHE_NAME = 'carmigui-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/attached_assets/Component 1_1760554140338.webp',
  '/attached_assets/Component 3 (1)_1760555027927.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        
        const url = new URL(event.request.url);
        if (
          url.pathname.endsWith('.jpg') || 
          url.pathname.endsWith('.jpeg') || 
          url.pathname.endsWith('.png') || 
          url.pathname.endsWith('.webp') ||
          url.pathname.endsWith('.svg') ||
          url.pathname.endsWith('.woff2') ||
          url.pathname.endsWith('.woff') ||
          url.pathname.endsWith('.ttf') ||
          url.pathname.endsWith('.css') ||
          url.pathname.endsWith('.js')
        ) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      });
    })
  );
});
