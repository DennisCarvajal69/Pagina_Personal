const CACHE = 'denilson-pwa-v3';

const ARCHIVOS = [
  './',
  'index.html',
  'styles.css',
  'script.js',
  'manifest.json',
  'img/icon-192.png',
  'img/icon-512.png',
  'img/fotoperfil.png',
  'img/foto1.png',
  'img/foto2.png',
  'img/foto3.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
  'https://code.jquery.com/jquery-3.7.1.min.js'
];

// Instalación: guarda cada archivo; si uno falta, no rompe los demás
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return Promise.allSettled(ARCHIVOS.map(function (a) { return cache.add(a); }));
    })
  );
  self.skipWaiting();
});

// Activación: borra cachés viejos
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (claves) {
      return Promise.all(
        claves.filter(function (k) { return k !== CACHE; })
              .map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Peticiones
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET' || !e.request.url.startsWith('http')) return;

  const mismoOrigen = new URL(e.request.url).origin === self.location.origin;

  if (mismoOrigen) {
    // Tus archivos: primero internet (siempre lo más nuevo), si no hay red usa el caché
    e.respondWith(
      fetch(e.request).then(function (resp) {
        if (resp.ok) {
          const copia = resp.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copia); });
        }
        return resp;
      }).catch(function () {
        return caches.match(e.request).then(function (guardado) {
          return guardado || (e.request.mode === 'navigate' ? caches.match('index.html') : Response.error());
        });
      })
    );
  } else {
    // Librerías externas: primero el caché
    e.respondWith(
      caches.match(e.request).then(function (guardado) {
        return guardado || fetch(e.request).then(function (resp) {
          const copia = resp.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copia); });
          return resp;
        });
      })
    );
  }
});
