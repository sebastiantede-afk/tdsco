const CACHE_NAME = 'finanzas-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // URLs de los iconos
  'https://placehold.co/192x192/4f46e5/ffffff?text=F',
  'https://placehold.co/512x512/4f46e5/ffffff?text=F',
  // URL del CSS de Tailwind
  'https://cdn.tailwindcss.com'
];

// Evento de instalación: cachea los archivos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de fetch: sirve los archivos desde el cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el archivo del cache si existe
        if (response) {
          return response;
        }

        // Si no está en el cache, hace la solicitud a la red
        return fetch(event.request).then(
          function(response) {
            // Verifica si recibimos una respuesta válida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona la respuesta para guardarla en el cache
            var responseToCache = response.clone();
            caches.open(CACHE_NAME).then(
              function(cache) {
                cache.put(event.request, responseToCache);
              }
            );

            return response;
          }
        );
      })
  );
});
