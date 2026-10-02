const CACHE_PREFIX = "arclight-trauma-";
const CACHE_NAME = `${CACHE_PREFIX}v1.1-20260929-ots1-info-20260929-ui20260930-fleetui2`;
const SHELL = [
  "../i18n-lo.js?v=20260901-2",
  "./",
  "./index.html",
  "./fleet-ui-refinements.css?v=20260930-ui2",
  "./styles.css?v=20260928-ui1",
  "./cup-achievement.css",
  "./scoring-engine.js?v=20260929-ots1",
  "./script.js?v=20260929-ots1",
  "./shell-controller.js?v=20260726-refactor1",
  "./cup-achievement.js?v=20260723-round1",
  "./pwa.js",
  "./favicon.svg",
  "./manifest.webmanifest",
  "./assets/fonts/inter-latin-400-800.woff2",
  "./assets/fonts/quicksand-latin-700.woff2",
  "./assets/images/globe.webp",
  "./assets/images/hypo.webp",
  "./assets/images/hook.webp",
  "./assets/images/retd.webp",
  "./assets/images/rapd.webp",
];
self.addEventListener("install", (event) =>
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))),
);
self.addEventListener("activate", (event) =>
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter(
              (name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME,
            )
            .map((name) => caches.delete(name)),
        ),
      ),
  ),
);
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
              : undefined,
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
