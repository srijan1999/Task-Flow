const BASE = "/Task-Flow/";
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
＜/dyad-write>

Now I should also check index.html: it references "/manifest.json" and "/icon.svg" etc. With base path, Vite will rewrite absolute paths? Actually Vite only rewrites assets referenced in index.html that are processed. The manifest link is `<link rel="manifest" href="/manifest.json" />`. With base "/Task-Flow/", Vite will transform `/manifest.json` to `/Task-Flow/manifest.json`? Vite does handle public assets referenced with absolute paths from base? Actually Vite's `base` option affects how assets are served. For `<link href="/manifest.json">`, Vite will not automatically prefix it unless it's imported. But public dir files are served at root by default; with base, they are served under base. The link should be `href="/Task-Flow/manifest.json"` or relative `href="manifest.json"`. To be safe, I can change index.html to use relative paths or include base. But the user already has `/manifest.json`. With base set, Vite will actually rewrite `/manifest.json`? Let me recall: Vite transforms URLs in index.html that start with `/` by prepending base? I think Vite does NOT transform arbitrary absolute URLs in index.html unless they are part of the module graph. However, for `<link rel="manifest" href="/manifest.json">`, Vite might leave it as is, causing 404 on project page. Better to change to relative `manifest.json` or `/Task-Flow/manifest.json`. Since the file is in public, it will be copied to dist root, and with base, the server serves at `/Task-Flow/manifest.json`. So we should reference `/Task-Flow/manifest.json` or `./manifest.json`. Let me update index.html to use relative paths for manifest and maybe theme-color is fine.

Also the service worker registration in main.tsx: `navigator.serviceWorker.register("/sw.js")` - should be `/Task-Flow/sw.js` or `./sw.js`. Let me update main.tsx to register relative `./sw.js`? Actually with base, the sw.js is at `/Task-Flow/sw.js`. The register path should match. I'll change to `/Task-Flow/sw.js` or use import.meta.env.BASE_URL. Better: `navigator.serviceWorker.register(import.meta.env.BASE_URL + "sw.js")`. That's robust. Let me update main.tsx.

Also index.html manifest link: use `href="%BASE_URL%manifest.json"`? Vite supports `%BASE_URL%` placeholder in index.html. Yes! Vite replaces `%BASE_URL%` in index.html. So I can set `<link rel="manifest" href="%BASE_URL%manifest.json" />`. That's the proper way.

Let me update index.html accordingly.

Also the apple touch icons etc not needed.

Let me rewrite index.html with %BASE_URL% for manifest.

<dyad-write path="index.html" description="Using Vite BASE_URL placeholder for manifest link">
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>dyad-generated-app</title>
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="theme-color" content="#6366f1" />
    <link rel="manifest" href="%BASE_URL%manifest.json" />
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
＜/dyad-write>

Now main.tsx service worker registration:

<dyad-write path="src/main.tsx" description="Updating service worker registration to use BASE_URL">
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

createRoot(document.getElementById("root")!).render(<App />);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(import.meta.env.BASE_URL + "sw.js")
      .then((registration) => {
        console.log("ServiceWorker registration successful with scope: ", registration.scope);
      })
      .catch((error) => {
        console.error("ServiceWorker registration failed: ", error);
      });
  });
}