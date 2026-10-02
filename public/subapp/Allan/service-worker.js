const CACHE_PREFIX = "allan-";
const CACHE_NAME = "allan-v1.2-20260929-audit2-fleetui2-loading1";
const APP_ASSETS = [
  "../i18n-lo.js?v=20260901-2",
  "./index.html",
  "./fleet-ui-refinements.css?v=20260930-ui2",
  "./styles.css?v=20260929-audit2",
  "./script.js?v=20260930-loading1",
  "./assets/thumbnails/abcde-su-preview_light.webp",
  "./assets/thumbnails/abcde-su-preview_dark.webp",
  "./assets/thumbnails/abcde-su-card_light.webp",
  "./assets/thumbnails/abcde-su-card_dark.webp",
  "./assets/thumbnails/chaos_light.webp",
  "./assets/thumbnails/chaos_dark.webp",
  "./assets/thumbnails/chaos-card_light.webp",
  "./assets/thumbnails/chaos-card_dark.webp",
  "./assets/thumbnails/dpic-r_raised-bumps_light.webp",
  "./assets/thumbnails/dpic-r_raised-bumps_dark.webp",
  "./assets/thumbnails/uv-reference.webp",
  "./assets/thumbnails/chaos-clues-01_light.webp",
  "./assets/thumbnails/chaos-clues-01_dark.webp",
  "./assets/thumbnails/chaos-clues-02_light.webp",
  "./assets/thumbnails/chaos-clues-02_dark.webp",
  "./assets/thumbnails/chaos-clues-03_light.webp",
  "./assets/thumbnails/chaos-clues-03_dark.webp",
  "./assets/thumbnails/chaos-clues-04_light.webp",
  "./assets/thumbnails/chaos-clues-04_dark.webp",
  "./assets/thumbnails/chaos-clues-05_light.webp",
  "./assets/thumbnails/chaos-clues-05_dark.webp",
  "./photo-file-store.js",
  "./referral-logic.js",
  "./mcq-bank.js",
  "./favicon.svg",
  "./manifest.webmanifest",
  "./variations/abcde-su-variation-01_dark.webp",
  "./variations/abcde-su-variation-01_light.webp",
  "./variations/abcde-su-variation-02_dark.webp",
  "./variations/abcde-su-variation-02_light.webp",
  "./variations/abcde-su-variation-03_dark.webp",
  "./variations/abcde-su-variation-03_light.webp",
  "./variations/abcde-su-variation-04_dark.webp",
  "./variations/abcde-su-variation-04_light.webp",
  "./variations/abcde-su-variation-05_dark.webp",
  "./variations/abcde-su-variation-05_light.webp",
  "./dermoscopy-examples/chaos-clues-01_dark.webp",
  "./dermoscopy-examples/chaos-clues-01_light.webp",
  "./dermoscopy-examples/chaos-clues-02_dark.webp",
  "./dermoscopy-examples/chaos-clues-02_light.webp",
  "./dermoscopy-examples/chaos-clues-03_dark.webp",
  "./dermoscopy-examples/chaos-clues-03_light.webp",
  "./dermoscopy-examples/chaos-clues-04_dark.webp",
  "./dermoscopy-examples/chaos-clues-04_light.webp",
  "./dermoscopy-examples/chaos-clues-05_dark.webp",
  "./dermoscopy-examples/chaos-clues-05_light.webp",
  "./assets/fonts/quicksand-latin-700.woff2",
  "./assets/fonts/inter-latin-400-800.woff2",
  "./assets/fonts/fontawesome-solid-900.woff2",
  "./assets/images/abcde-su-card_dark.webp",
  "./assets/images/abcde-su-card_light.webp",
  "./assets/images/abcde-su-preview_dark.webp",
  "./assets/images/abcde-su-preview_light.webp",
  "./assets/images/abcde-su_dark.webp",
  "./assets/images/abcde-su_light.webp",
  "./assets/images/chaos-card_dark.webp",
  "./assets/images/chaos-card_light.webp",
  "./assets/images/chaos_dark.webp",
  "./assets/images/chaos_light.webp",
  "./assets/images/dpic-r_blisters-pustules_dark.webp",
  "./assets/images/dpic-r_blisters-pustules_light.webp",
  "./assets/images/dpic-r_eczema-dermatitis_dark.webp",
  "./assets/images/dpic-r_eczema-dermatitis_light.webp",
  "./assets/images/dpic-r_flat-patches_dark.webp",
  "./assets/images/dpic-r_flat-patches_light.webp",
  "./assets/images/dpic-r_psoriasis-plaques_dark.webp",
  "./assets/images/dpic-r_psoriasis-plaques_light.webp",
  "./assets/images/dpic-r_raised-bumps_dark.webp",
  "./assets/images/dpic-r_raised-bumps_light.webp",
  "./assets/images/uv-reference.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_ASSETS))
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

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => matchAppCache("./index.html", { ignoreSearch: true })),
    );
    return;
  }

  if (requestUrl.search) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => matchAppCache(request, { ignoreSearch: true })),
    );
    return;
  }

  event.respondWith(
    matchAppCache(request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
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
