const CACHE_PREFIX = "arclight-glaucoma-";
const CACHE_NAME = `${CACHE_PREFIX}v1.1-20260930-clinical2-perf1`;
const ASSETS = [
  "../i18n-lo.js?v=20260901-2",
  "./",
  "./index.html",
  "./fleet-ui-refinements.css?v=20260930-ui2",
  "./styles.css?v=20260929-logic1",
  "./styles/base.css?v=20260725-report2",
  "./styles/layout.css?v=20260726-refactor1",
  "./styles/components.css?v=20260726-refactor1",
  "./styles/responsive.css?v=20260727-audit1",
  "./app.bundle.js?v=20260930-clinical2-perf1",
  "./cup-achievement.css",
  "./cup-achievement.js?v=20260723-round1",
  "./favicon.svg",
  "./manifest.webmanifest",
  "./assets/fonts/inter-latin-400-800.woff2",
  "./assets/fonts/quicksand-latin-700.woff2",
  "./assets/images/01.webp",
  "./assets/images/04.webp",
  "./assets/images/07.webp",
  "./assets/images/09.webp",
  "./assets/images/rim.webp",
  "./assets/images/size.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)),
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

  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (
    url.origin !== self.location.origin ||
    !url.pathname.startsWith(new URL(self.registration.scope).pathname)
  )
    return;
  event.respondWith(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.match(event.request))
      .then(
        (cached) =>
          cached ||
          fetch(event.request)
            .then((response) => {
              if (response.ok)
                caches
                  .open(CACHE_NAME)
                  .then((cache) => cache.put(event.request, response.clone()));
              return response;
            })
            .catch(() =>
              event.request.mode === "navigate"
                ? matchAppCache("./index.html")
                : Promise.reject(),
            ),
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
