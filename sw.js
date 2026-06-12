// ============================================================
//  FITPRO v3.3 — Service Worker
//  © 2025 RémiRodriguez
//  Cache-first strategy : fonctionne 100% hors-ligne
// ============================================================

const CACHE_NAME = 'fitpro-v3.3';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './data.js',
  // Google Fonts — mise en cache au premier chargement
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap'
];

// ---- INSTALL : pré-cache tous les assets ----
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Les fonts Google peuvent échouer en offline lors de l'install — on les ignore
      return Promise.allSettled(
        ASSETS.map(url =>
          cache.add(url).catch(() => console.warn('[SW] Impossible de cacher :', url))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// ---- ACTIVATE : supprime les vieux caches ----
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ---- FETCH : cache-first, réseau en fallback ----
self.addEventListener('fetch', event => {
  // Ignore les requêtes non-GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      // Pas en cache → réseau, puis on met en cache
      return fetch(event.request).then(response => {
        // Ne cache que les réponses valides
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        return response;
      }).catch(() => {
        // Offline et pas en cache → page de fallback si HTML demandé
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
