const PREFIX = 'arclight-swollen-discs';
const CACHE = `${PREFIX}-v1.1-20260929-logic1-ui20260930-fleetui2-perf1`;
const ASSETS = [
  '../i18n-lo.js?v=20260901-2',
  './',
  './index.html',
  './fleet-ui-refinements.css?v=20260930-ui2',
  './styles.css?v=20260929-logic1',
  './app.bundle.js?v=20260929-logic1-ui20260930-perf1',
  './fleet-enhancements.js?v=20260723-v11',
  './manifest.webmanifest',
  './favicon.svg',
  './assets/fonts/inter-latin-400-800.woff2',
  './assets/fonts/quicksand-latin-700.woff2',
  './assets/images/phone.webp',
  './assets/images/ret180.webp',
  './assets/images/ret180_2.webp',
  './assets/images/ret180_4.webp',
  './assets/images/ret180_2048.webp',
  './assets/images/ret180_2_2048.webp',
  './assets/images/ret180_4_2048.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(PREFIX) && key !== CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const hostUrl = new URL(event.request.url);
  const hostScope = new URL('./', self.location.href);
  if (hostUrl.origin !== hostScope.origin) return;
  const sharedLocale =
    hostUrl.pathname === new URL('../i18n-lo.js', hostScope).pathname ||
    hostUrl.pathname.startsWith('/translation/');
  if (sharedLocale && event.request.method === 'GET') {
    event.respondWith(
      matchAppCache(event.request, { ignoreSearch: true })
        .then((cached) => cached || caches.match(event.request))
        .then((cached) => cached || fetch(event.request))
    );
    return;
  }
  if (!hostUrl.pathname.startsWith(hostScope.pathname)) return;

  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const scopePath = new URL('./', self.location.href).pathname;
  if (url.origin !== self.location.origin || !url.pathname.startsWith(scopePath)) return;
  event.respondWith(
    matchAppCache(event.request, { ignoreSearch: true }).then(
      (cached) =>
        cached ||
        fetch(event.request)
          .then((response) => {
            if (response.ok)
              caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
            return response;
          })
          .catch(() =>
            event.request.mode === 'navigate' ? matchAppCache('./index.html') : Response.error()
          )
    )
  );
});

// Prefer this app's installed assets over older copies in the host's cache.
async function matchAppCache(request, options) {
  for (const name of [CACHE]) {
    const cached = await (await caches.open(name)).match(request, options);
    if (cached) return cached;
  }
}
