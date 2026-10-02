const PREFIX = "arclight-mires",
  CACHE = `${PREFIX}-v1.1-20260929-logic1-info-20260929-ui20260930-fleetui2-perf1`,
  ASSETS = [
    "../i18n-lo.js?v=20260901-2",
    "./",
    "./index.html",
    "./fleet-ui-refinements.css?v=20260930-ui2",
    "./styles.css?v=20260929-logic1",
    "./cup-achievement.css",
    "./app.bundle.js?v=20260929-logic1-perf1",
    "./cup-achievement.js?v=20260723-round1",
    "./manifest.webmanifest",
    "./favicon.svg",
    "./assets/fonts/inter-latin-400-800.woff2",
    "./assets/fonts/quicksand-latin-700.woff2",
  ];
self.addEventListener("install", (e) =>
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting()),
  ),
);
self.addEventListener("activate", (e) =>
  e.waitUntil(
    caches
      .keys()
      .then((ks) =>
        Promise.all(
          ks
            .filter((k) => k.startsWith(PREFIX) && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  ),
);
self.addEventListener("fetch", (e) => {
  const hostUrl = new URL(e.request.url);
  const hostScope = new URL("./", self.location.href);
  if (hostUrl.origin !== hostScope.origin) return;
  const sharedLocale =
    hostUrl.pathname === new URL("../i18n-lo.js", hostScope).pathname ||
    hostUrl.pathname.startsWith("/translation/");
  if (sharedLocale && e.request.method === "GET") {
    e.respondWith(
      matchAppCache(e.request, { ignoreSearch: true })
        .then((cached) => cached || caches.match(e.request))
        .then((cached) => cached || fetch(e.request)),
    );
    return;
  }
  if (!hostUrl.pathname.startsWith(hostScope.pathname)) return;
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (
    u.origin !== self.location.origin ||
    !u.pathname.startsWith(new URL("./", self.location.href).pathname)
  )
    return;
  e.respondWith(
    matchAppCache(e.request, { ignoreSearch: true }).then(
      (h) =>
        h ||
        fetch(e.request)
          .then((r) => {
            if (r.ok)
              caches.open(CACHE).then((c) => c.put(e.request, r.clone()));
            return r;
          })
          .catch(() =>
            e.request.mode === "navigate"
              ? matchAppCache("./index.html")
              : Response.error(),
          ),
    ),
  );
});

// Prefer this app's installed assets over older copies in the host's cache.
async function matchAppCache(request, options) {
  for (const name of [CACHE]) {
    const cached = await (await caches.open(name)).match(request, options);
    if (cached) return cached;
  }
}
