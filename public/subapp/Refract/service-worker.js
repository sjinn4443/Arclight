const CACHE_NAME =
  "refract-v1-1-20260930-weighted3-ui20260930-fleetui3-perf1-loading1-host20261002-1";
const APP_SHELL = [
  "../i18n-lo.js?v=20260901-2",
  "./",
  "./index.html",
  "./fleet-ui-refinements.css?v=20260930-ui3",
  "./styles.css?v=20260930-weighted3-ui1-loading1",
  "./app.bundle.js?v=20261002-host1",
  "./cup-achievement.css",
  "./cup-achievement.js",
  "./favicon.svg",
  "./manifest.webmanifest",
  "./mcq.bundle.js?v=20261002-host1",
  "./src/mcq-data.js",
  "./styles/tokens.css",
  "./styles/base.css",
  "./styles/header.css",
  "./styles/layout.css",
  "./styles/forms.css",
  "./styles/overlays.css?v=20260930-ui1",
  "./styles/responsive.css",
  "./assets/fonts/inter-latin-400-800.woff2",
  "./assets/fonts/quicksand-latin-700.woff2",
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
            .filter((key) => key.startsWith("refract-") && key !== CACHE_NAME)
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

  if (
    event.request.method !== "GET" ||
    new URL(event.request.url).origin !== self.location.origin
  )
    return;
  event.respondWith(
    matchAppCache(event.request, { ignoreSearch: true }).then(
      (cached) =>
        cached ||
        fetch(event.request).then((response) => {
          if (response.ok)
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, response.clone()));
          return response;
        }),
    ),
  );
});

// Prefer this app's installed assets over older copies in the host's cache.
async function matchAppCache(request, options) {
  for (const name of [CACHE_NAME]) {
    const cached = await (await caches.open(name)).match(request, options);
    if (cached) return cached;
  }
}
