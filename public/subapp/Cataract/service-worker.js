const CACHE_PREFIX = "arclight-cataract-";
const RELEASE_VERSION = "20260930-clinical2-perf1";
const CACHE_NAME = `${CACHE_PREFIX}v1.1-${RELEASE_VERSION}`;

const APP_SHELL = [
  "../i18n-lo.js?v=20260901-2",
  "./",
  "./index.html",
  "./fleet-ui-refinements.css?v=20260930-ui2",
  "./style.css?v=20260930-clinical2-perf1",
  "./mcq-ui.css?v=20260726-mcqquality2",
  "./cup-achievement.css",
  "./app.bundle.js?v=20260930-clinical2-perf1",
  "./cup-achievement.js",
  "./pwa-register.js",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./assets/fonts/inter-latin-400-800.woff2",
  "./assets/fonts/quicksand-latin-700.woff2",
  "./assets/images/normal.webp",
  "./assets/images/dark.webp",
  "./assets/images/patches.webp",
  "./assets/images/spots.webp",
  "./assets/images/white.webp",
  "./assets/images/normal2.webp",
  "./assets/images/cupping.webp",
  "./assets/images/drscar.webp",
  "./assets/images/detached.webp",
  "./assets/images/poorview.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const hostUrl = new URL(event.request.url);
  const hostScope = new URL("./", self.location.href);
  if (hostUrl.origin !== hostScope.origin) return;
  const sharedLocale =
    hostUrl.pathname === new URL("../i18n-lo.js", hostScope).pathname ||
    hostUrl.pathname.startsWith("/translation/");
  if (sharedLocale && event.request.method === "GET") {
    event.respondWith(
      matchAppCache(event.request, { ignoreSearch: true })
        .then((cached) => cached || caches.match(event.request))
        .then((cached) => cached || fetch(event.request)),
    );
    return;
  }
  if (!hostUrl.pathname.startsWith(hostScope.pathname)) return;

  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        matchAppCache("./index.html", { ignoreSearch: true }),
      ),
    );
    return;
  }

  event.respondWith(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.match(request))
      .then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(request).then((response) => {
          if (!response || !response.ok) {
            return response;
          }
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        });
      }),
  );
});

// Prefer this app's installed assets over older copies in the host's cache.
async function matchAppCache(request, options) {
  for (const name of [CACHE_NAME]) {
    const cached = await (await caches.open(name)).match(request, options);
    if (cached) return cached;
  }
}
