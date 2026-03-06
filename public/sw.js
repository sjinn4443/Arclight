/* sw.js — Arclight PWA service worker */
const CACHE_NAME = "arclight-static-v4";
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/style/base.css",
  "/style/components.css",
  "/style/pages.css",
  "/style/responsive.css",
  "/js/main.js",
  "/js/navigation.js",
  "/js/onboarding.js",
  "/js/dashboard.js",
  "/js/toc.js",
  "/js/videoplayer.js",
  "/js/quiz.js",
  "/js/mylearning.js",
  "/js/catalog.js",
  "/js/pwa.js",
  "/html/interest.html", // Added for interest page
  "/js/interest.js", // Added for interest page script
  "/favicons/favicon-32x32.png", // Added favicon
  "/favicons/favicon-16x16.png", // Added favicon
  "/favicons/site.webmanifest", // Added manifest
  "/favicons/apple-touch-icon.png", // Added favicon
  "/favicons/android-chrome-192x192.png", // Added favicon
  "/favicons/android-chrome-512x512.png", // Added favicon
  "/favicons/favicon.ico", // Added favicon
  "/favicons/pwa-install-narrow.png",
  "/favicons/pwa-install-wide.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch(() => {}),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

/**
 * Strategy:
 * - HTML navigations: network-first (fallback to cache)
 * - Static assets (css/js/images): cache-first (fallback to network)
 */
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Bypass service worker for non-GET requests and the /track path
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) {
    // Bypass service worker for non-GET requests or cross-origin requests
    return;
  }
  // Always bypass the API
  if (
    url.pathname.startsWith("/api/app/") ||
    url.pathname.startsWith("/api/dev/")
  ) {
    return;
  }

  if (
    url.pathname === "/track" ||
    url.pathname === "/reports.html" ||
    url.pathname === "/html/reports.html" ||
    url.pathname.startsWith("/api/dev/")
  ) {
    // Bypass service worker for /track endpoint, reports pages, and dev API calls
    return;
  }

  // ---- MP4 handling (avoid breaking cache with Range requests) ----
  const isMp4 = url.pathname.endsWith(".mp4");

  // If the browser requests a byte range, serve from cache if possible,
  // otherwise fall back to network. Do NOT cache the ranged response.
  if (isMp4 && req.headers.has("range")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(req, { ignoreSearch: true });
        if (cached) return cached;
        return fetch(req);
      })(),
    );
    return;
  }

  // For full MP4 requests, prefer cache first (offline stability)
  if (isMp4) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(req, { ignoreSearch: true });
        if (cached) return cached;

        const fresh = await fetch(req);
        cache.put(req, fresh.clone()).catch(() => {});
        return fresh;
      })(),
    );
    return;
  }

  if (req.mode === "navigate") {
    // HTML navigation: try network, fallback to cached shell
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone()).catch(() => {});
          return fresh;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          const cached =
            (await cache.match(req)) || (await cache.match("/index.html"));
          return cached || Response.error();
        }
      })(),
    );
    return;
  }

  // Static assets: network-first (fallback to cache)
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      try {
        const fresh = await fetch(req, { cache: "no-store" });
        cache.put(req, fresh.clone()).catch(() => {});
        return fresh;
      } catch {
        const cached = await cache.match(req);
        return cached || Response.error();
      }
    })(),
  );
});

/* --------- Pre-cache on demand via postMessage from the app ---------- */
self.addEventListener("message", async (event) => {
  const { data, ports } = event;
  if (!data || !data.type) return;

  if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
    ports?.[0]?.postMessage?.({ type: "SKIP_WAITING_DONE" });
    return;
  }

  if (data.type === "CACHE_URLS") {
    const urls = data.payload || [];
    const cacheName = data.cacheName || CACHE_NAME;
    try {
      const cache = await caches.open(cacheName);
      await Promise.all(
        urls.map(async (url) => {
          try {
            const res = await fetch(url, { mode: "no-cors" });
            if (res && (res.ok || res.type === "opaque"))
              await cache.put(url, res.clone());
          } catch {}
        }),
      );
      ports?.[0]?.postMessage?.({ type: "CACHE_DONE" });
    } catch (err) {
      ports?.[0]?.postMessage?.({ type: "CACHE_ERROR", error: String(err) });
    }
  }
});
