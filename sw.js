const CACHE_NAME = 'rockwool-v5'; // Tæl denne op (v6, v7...) hver gang du retter i index.html
const ASSETS = [
  'index.html',
  'manifest.json'
  // Tilføj evt. ikon-stier her, hvis du har dem, f.eks. 'icon.png'
];

// Installér Service Worker og gem filer i cachen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  // Tvinger den nye Service Worker til at blive aktiv med det samme
  self.skipWaiting();
});

// Ryd op i gamle caches, når den nye vinder frem
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  // Sikrer at alle faner/apps bliver styret af den nye SW med det samme
  self.clients.claim();
});

// Hent filer fra cachen (Offline support)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
