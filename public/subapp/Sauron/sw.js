const CACHE_PREFIX = "arclight-sauron-";
const CACHE_NAME = `${CACHE_PREFIX}v1.1-20260929-logic2-info-20260929-ui20260930-fleetui2-perf1`;
const SHELL = [
  "../i18n-lo.js?v=20260901-2",
  "./",
  "./index.html",
  "./fleet-ui-refinements.css?v=20260930-ui2",
  "./style.css?v=20260928-ui1",
  "./cup-achievement.css",
  "./app.bundle.js?v=20260929-logic2-perf1",
  "./cup-achievement.js?v=20260723-round1",
  "./favicon.svg",
  "./manifest.webmanifest",
  "./assets/fonts/inter-latin-400-800.woff2",
  "./assets/fonts/quicksand-latin-700.woff2",
  "./assets/images/ret-rotate-cue.webp",
  "./assets/images/ret-sweep-cue.webp",
  "./assets/case-thumbnails/zero.webp",
  "./assets/case-thumbnails/plus.webp",
  "./assets/case-thumbnails/minus.webp",
  "./assets/case-thumbnails/low-cylinder.webp",
  "./assets/case-thumbnails/high-cylinder.webp",
  "./assets/case-thumbnails/anisometropia.webp",
  "./assets/case-thumbnails/high-plus.webp",
  "./assets/case-thumbnails/high-minus.webp",
  "./assets/case-thumbnails/small-scissors.webp",
  "./assets/case-thumbnails/keratoconus.webp",
  "./assets/case-thumbnails/small-pupils.webp",
  "./assets/case-thumbnails/acg.webp",
  "./assets/case-thumbnails/aniridia.webp",
  "./assets/case-thumbnails/aphakia.webp",
  "./assets/case-thumbnails/nasal-coloboma.webp",
  "./assets/case-thumbnails/iris-transillumination.webp",
  "./assets/case-thumbnails/corneal-scar.webp",
  "./assets/case-thumbnails/poor-tear-film.webp",
  "./assets/case-thumbnails/floaters.webp",
  "./assets/case-thumbnails/small-cortical-cataract.webp",
  "./assets/case-thumbnails/big-cortical-cataract.webp",
  "./assets/case-thumbnails/central-sub-cortical-cataract.webp",
  "./assets/case-thumbnails/posterior-pole-cataract.webp",
  "./assets/case-thumbnails/posterior-capsular-thickening.webp",
  "./assets/case-thumbnails/dense-cataract.webp",
  "./assets/case-thumbnails/vitreous-haemorrhage.webp",
  "./assets/case-thumbnails/leucocoria.webp",
  "./assets/case-thumbnails/partial-retinal-detachment.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
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

  const requestUrl = new URL(event.request.url);
  if (
    event.request.method !== "GET" ||
    requestUrl.origin !== self.location.origin
  )
    return;
  if (requestUrl.search) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok)
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, response.clone()));
          return response;
        })
        .catch(() => matchAppCache(event.request, { ignoreSearch: true })),
    );
    return;
  }
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
