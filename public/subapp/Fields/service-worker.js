const CACHE_PREFIX = "arclight-fields-";
const CACHE_NAME = `${CACHE_PREFIX}20260928-logic1-info-20260929-ui20260930-fleetui3`;
const APP_SHELL = [
  "../i18n-lo.js?v=20260901-2",
  "./",
  "./index.html",
  "./fleet-ui-refinements.css?v=20260930-ui3",
  "./home.html",
  "./manifest.webmanifest?v=20260722-3",
  "./styles.css?v=20260928-ui1",
  "./cup-achievement.css?v=20260722-3",
  "./favicon.svg",
  "./assets/fonts/inter-latin-400-800.woff2",
  "./assets/fonts/quicksand-latin-700.woff2",
  "./assets/images/eye-field.webp",
  "./assets/images/JCIS-11-19-g001.webp",
  "./src/field-core.js?v=20260722-3",
  "./src/assessment-state.js?v=20260928-logic1",
  "./src/state.js?v=20260928-logic1",
  "./src/rules/helpers.js?v=20260722-3",
  "./src/rules/anterior.js?v=20260928-logic1",
  "./src/rules/chiasmal.js?v=20260928-logic1",
  "./src/rules/posterior.js?v=20260722-3",
  "./src/rules.js?v=20260722-3",
  "./src/summary.js?v=20260928-logic1",
  "./src/pathway.js?v=20260928-logic1",
  "./src/output-text-rules.js?v=20260928-logic1",
  "./src/output-lesion-map.js?v=20260928-logic1",
  "./src/output.js?v=20260928-logic1",
  "./src/popup.js?v=20260722-3",
  "./src/mcq-data/core.js?v=20260726-mcq2",
  "./src/mcq-data/library.js?v=20260726-mcq2",
  "./src/mcq-data/sets.js?v=20260726-mcq2",
  "./src/mcq-data.js?v=20260726-mcq2",
  "./src/mcq.js?v=20260930-ui1",
  "./src/main.js?v=20260726-refactor1",
  "./cup-achievement.js?v=20260723-round1",
  "./pwa-register.js?v=20260722-3",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
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
      )
      .then(() => self.clients.claim()),
  );
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
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => matchAppCache("./home.html")),
    );
    return;
  }

  event.respondWith(
    matchAppCache(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
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
