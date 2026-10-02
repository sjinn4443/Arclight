const CACHE_NAME =
  "squint-v1-1-20260929-logic2-info-20260929-ui20260930-fleetui2";
const APP_SHELL = [
  "../i18n-lo.js?v=20260901-2",
  "./",
  "./index.html",
  "./fleet-ui-refinements.css?v=20260930-ui2",
  "./style.css?v=20260928-ui1",
  "./analysis.js?v=20260929-logic2",
  "./mcq.js?v=20260726-mcqquality2",
  "./script.js?v=20260929-logic2",
  "./session-reset.js",
  "./pwa.js",
  "./cup-achievement.css",
  "./cup-achievement.js?v=20260723-round1",
  "./favicon.svg",
  "./manifest.webmanifest",
  "./assets/fonts/inter-latin-400-800.woff2",
  "./assets/fonts/quicksand-latin-700.woff2",
  "./src/sim-core.js?v=20260929-logic2",
  "./src/preset-runner.js?v=20260929-logic2",
  "./src/state.js?v=20260929-logic2",
  "./src/output-writer.js?v=20260929-logic2",
  "./src/light-controller.js?v=20260929-logic2",
  "./src/eye-effects-controller.js?v=20260929-logic2",
  "./src/cover-controller.js?v=20260929-logic2",
  "./src/eye-controller.js?v=20260929-logic2",
  "./src/gaze-controller.js?v=20260929-logic2",
  "./src/controls-controller.js?v=20260929-logic2",
  "./src/ui-shell.js?v=20260929-logic2",
  "./src/analysis-core.js?v=20260929-logic2",
  "./src/mcq-data.js?v=20260726-mcqquality2",
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
            .filter((key) => key.startsWith("squint-") && key !== CACHE_NAME)
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
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put("./index.html", response.clone()));
          }
          return response;
        })
        .catch(() => matchAppCache("./index.html")),
    );
    return;
  }
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
