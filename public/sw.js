/* sw.js — Arclight PWA service worker */
const CACHE_NAME = "arclight-static-v18";
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/style/base.css",
  "/style/components.css",
  "/style/pages.css",
  "/style/responsive.css",
  "/js/runtime-bootstrap.js",
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
  "/video-localization/childhood-eye-screening.json",
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

function parseRangeHeader(rangeHeader, size) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader || "");
  if (!match) return null;

  let start = match[1] ? Number(match[1]) : 0;
  let end = match[2] ? Number(match[2]) : size - 1;

  if (!match[1] && match[2]) {
    const suffixLength = Number(match[2]);
    start = Math.max(size - suffixLength, 0);
    end = size - 1;
  }

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    end < start ||
    start >= size
  ) {
    return null;
  }

  return {
    start,
    end: Math.min(end, size - 1),
  };
}

async function createRangeResponse(request, cachedResponse) {
  const blob = await cachedResponse.blob();
  const range = parseRangeHeader(request.headers.get("range"), blob.size);

  if (!range) {
    return new Response(null, {
      status: 416,
      headers: {
        "Content-Range": `bytes */${blob.size}`,
      },
    });
  }

  const chunk = blob.slice(range.start, range.end + 1);
  const headers = new Headers(cachedResponse.headers);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Length", String(chunk.size));
  headers.set(
    "Content-Range",
    `bytes ${range.start}-${range.end}/${blob.size}`,
  );

  return new Response(chunk, {
    status: 206,
    statusText: "Partial Content",
    headers,
  });
}

async function cacheUrls(urls) {
  const cache = await caches.open(CACHE_NAME);
  let cached = 0;
  const failed = [];

  for (const url of urls) {
    try {
      const requestUrl = new URL(url, self.location.origin).href;
      const request = new Request(requestUrl, { cache: "no-store" });
      const res = await fetch(request);
      if (res && res.ok) {
        await cache.put(requestUrl, res.clone());
        cached += 1;
      } else {
        failed.push(url);
      }
    } catch {
      failed.push(url);
    }
  }

  return { cached, failed };
}

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
  const isChildhoodPilotHlsAsset =
    url.pathname.startsWith("/video-hls/childhood-eye-screening/") &&
    (url.pathname.endsWith(".m3u8") ||
      url.pathname.endsWith(".ts") ||
      url.pathname.endsWith(".vtt"));

  // Safari media playback is sensitive to malformed range responses, so only
  // answer range requests when a full cached MP4 is available.
  if (isMp4 && req.headers.has("range")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(req, { ignoreSearch: true });
        if (cached) return createRangeResponse(req, cached);
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

  // Prefer direct HLS loading when online, but keep cached HLS assets usable
  // after the all-assets install download has completed.
  if (isChildhoodPilotHlsAsset) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req, { cache: "no-store" });
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone()).catch(() => {});
          return fresh;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(req, { ignoreSearch: true });
          return cached || Response.error();
        }
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

async function handleMessage(event) {
  const { data, ports } = event;
  if (!data || !data.type) return;

  if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
    ports?.[0]?.postMessage?.({ type: "SKIP_WAITING_DONE" });
    return;
  }

  if (data.type === "CACHE_URLS" || data.type === "CACHE_ASSETS") {
    const urls = data.payload || [];
    try {
      const result = await cacheUrls(urls);
      ports?.[0]?.postMessage?.({ type: "CACHE_DONE", ...result });
    } catch (err) {
      ports?.[0]?.postMessage?.({ type: "CACHE_ERROR", error: String(err) });
    }
  }
}

/* --------- Pre-cache on demand via postMessage from the app ---------- */
self.addEventListener("message", (event) => {
  event.waitUntil(handleMessage(event));
});
