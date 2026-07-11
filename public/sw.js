// Detect the base path dynamically from the service worker registration scope
const BASE = self.registration ? new URL(self.registration.scope).pathname : "/";
const CACHE_NAME = "taskflow-v1";
const ASSETS_TO_CACHE = [
  BASE,
  BASE + "index.html",
  BASE + "icon.svg",
  BASE + "manifest.json",
  BASE + "favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Return cached response if found
      if (cached) return cached;

      // Otherwise fetch from network and cache successful responses
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cached index.html for navigation requests when offline
          if (event.request.mode === "navigate") {
            return caches.match(BASE + "index.html");
          }
        });
    })
  );
});