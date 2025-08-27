/* sw.js — Arclight PWA service worker */
const CACHE_NAME = 'arclight-static-v1';
const CORE_ASSETS = [
  '.', 'index.html', 'style.css',
  'js/main.js','js/navigation.js','js/onboarding.js',
  'js/dashboard.js','js/toc.js','js/video.js',
  'js/quiz.js','js/learning.js','js/catalog.js','js/pwa.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

/**
 * Strategy:
 * - HTML navigations: network-first (fallback to cache)
 * - Static assets (css/js/images): cache-first (fallback to network)
 */
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle same-origin GET
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  if (req.mode === 'navigate') {
    // HTML navigation: try network, fallback to cached shell
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone()).catch(()=>{});
          return fresh;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(req) || await cache.match('/index.html');
          return cached || Response.error();
        }
      })()
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const fresh = await fetch(req);
        cache.put(req, fresh.clone()).catch(()=>{});
        return fresh;
      } catch {
        return cached || Response.error();
      }
    })()
  );
});

/* --------- Pre-cache on demand via postMessage from the app ---------- */
self.addEventListener('message', async (event) => {
  const { data, ports } = event;
  if (!data || !data.type) return;

  if (data.type === 'CACHE_URLS') {
    const urls = data.payload || [];
    const cacheName = data.cacheName || CACHE_NAME;
    try {
      const cache = await caches.open(cacheName);
      await Promise.all(urls.map(async (url) => {
        try {
          const res = await fetch(url, { mode: 'no-cors' });
          if (res && (res.ok || res.type === 'opaque')) await cache.put(url, res.clone());
        } catch {}
      }));
      ports?.[0]?.postMessage?.({ type: 'CACHE_DONE' });
    } catch (err) {
      ports?.[0]?.postMessage?.({ type: 'CACHE_ERROR', error: String(err) });
    }
  }
});
