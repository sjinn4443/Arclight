const CACHE_PREFIX = "arclight-diabetic-";
const CACHE_NAME = `${CACHE_PREFIX}v1.1-20260929-engine1-info-20260929-ui20260930-fleetui2-perf1`;

const CASE_ASSETS = Array.from({ length: 10 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  const root = `./assets/images/diabetic/case-${number}`;
  return [
    `${root}.webp`,
    `${root}_thumb.webp`,
    ...(number === "08" ? [] : [`${root}_dark.webp`]),
  ];
}).flat();

const SHELL_ASSETS = [
  "../i18n-lo.js?v=20260901-2",
  "./",
  "./index.html",
  "./fleet-ui-refinements.css?v=20260930-ui2",
  "./styles.css?v=20260929-engine1",
  "./app.bundle.js?v=20260929-engine1-perf1",
  "./cup-achievement.css",
  "./cup-achievement.js?v=20260723-round1",
  "./favicon.svg",
  "./manifest.webmanifest",
  "./assets/fonts/inter-latin-400-800.woff2",
  "./assets/fonts/quicksand-latin-700.woff2",
  ...CASE_ASSETS,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)),
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
  const requestUrl = new URL(event.request.url);
  if (
    requestUrl.origin !== self.location.origin ||
    !requestUrl.pathname.startsWith(new URL(self.registration.scope).pathname)
  )
    return;

  event.respondWith(
    matchAppCache(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, copy));
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
