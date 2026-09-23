/* sw.js — Arclight PWA service worker */
const CACHE_NAME =
  typeof __BUILD_CACHE_NAME__ === "undefined"
    ? "arclight-static-v72"
    : __BUILD_CACHE_NAME__;
const MAX_MESSAGE_CACHE_URLS = 10000;
const SHELL_MANIFEST = "/shell-assets.json";
const PACK_CACHE = "arclight-packs-v1";
let revisionsPromise;
async function packRevisions() {
  if (!revisionsPromise)
    revisionsPromise = (async () => {
      const shell = await caches.open(CACHE_NAME);
      const response = await shell.match(SHELL_MANIFEST);
      return response ? (await response.json()).revisions || {} : {};
    })().catch(() => ({}));
  return revisionsPromise;
}
async function matchPack(cache, request) {
  const response = await cache.match(request, { ignoreSearch: true });
  if (!response) return null;
  const url = new URL(
    typeof request === "string" ? request : request.url,
    self.location.origin,
  );
  const expected = (await packRevisions())[url.pathname];
  return !expected || response.headers.get("X-Arclight-Revision") === expected
    ? response
    : null;
}

function isSensitivePath(pathname) {
  return (
    pathname.startsWith("/api/") ||
    pathname === "/track" ||
    pathname === "/healthz" ||
    pathname === "/reports.html" ||
    pathname === "/html/reports.html" ||
    pathname === "/js/reports.js"
  );
}

function canCacheResponse(response) {
  if (!response?.ok) return false;
  const cacheControl = String(response.headers?.get("cache-control") || "")
    .trim()
    .toLowerCase();
  return !/(?:^|,)\s*(?:no-store|private)(?:\s|,|$)/.test(cacheControl);
}

function normalizeCacheMessageUrls(payload) {
  const values = Array.isArray(payload)
    ? payload.slice(0, MAX_MESSAGE_CACHE_URLS)
    : [];
  const safe = [];
  const rejected = [];
  const seen = new Set();

  for (const value of values) {
    try {
      if (typeof value !== "string" || value.length > 2048) throw new Error();
      const url = new URL(value, self.location.origin);
      if (
        url.origin !== self.location.origin ||
        !["http:", "https:"].includes(url.protocol) ||
        isSensitivePath(url.pathname)
      ) {
        throw new Error();
      }
      if (!seen.has(url.href)) {
        seen.add(url.href);
        safe.push(url.href);
      }
    } catch {
      rejected.push(String(value || ""));
    }
  }

  if (Array.isArray(payload) && payload.length > MAX_MESSAGE_CACHE_URLS) {
    rejected.push("[cache request limit exceeded]");
  }
  return { rejected, safe, total: rejected.length + safe.length };
}

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

function getAlternateMp4Urls(requestUrl) {
  const url = new URL(requestUrl);
  const alternates = [];
  const replacements = [
    [/_720p(?=\.mp4$)/i, "_220p"],
    [/_220p(?=\.mp4$)/i, "_720p"],
  ];

  replacements.forEach(([pattern, replacement]) => {
    if (!pattern.test(url.pathname)) return;
    const alternateUrl = new URL(url.href);
    alternateUrl.pathname = alternateUrl.pathname.replace(pattern, replacement);
    alternates.push(alternateUrl.href);
  });

  return alternates;
}

async function matchCachedMedia(cache, request) {
  const packs = await caches.open(PACK_CACHE);
  const cached =
    (await matchPack(packs, request)) ||
    (await cache.match(request, { ignoreSearch: true }));
  if (cached) return cached;

  for (const alternateUrl of getAlternateMp4Urls(request.url)) {
    const alternate =
      (await matchPack(packs, alternateUrl)) ||
      (await cache.match(alternateUrl, { ignoreSearch: true }));
    if (alternate) return alternate;
  }

  return null;
}

function postCacheProgress(port, payload) {
  try {
    port?.postMessage?.(payload);
  } catch {
    void 0;
  }
}

async function cacheUrls(urls, port) {
  const cache = await caches.open(PACK_CACHE);
  const shellCache = await caches.open(CACHE_NAME);
  const revisions = await packRevisions();
  const normalized = normalizeCacheMessageUrls(urls);
  let cached = 0;
  const failed = [...normalized.rejected];
  const total = normalized.total;

  for (const [index, url] of normalized.safe.entries()) {
    try {
      const requestUrl = new URL(url, self.location.origin).href;
      const request = new Request(requestUrl, { cache: "no-store" });
      const revision = revisions[new URL(requestUrl).pathname];
      const targetCache = revision ? cache : shellCache;
      const existing = await matchPack(targetCache, requestUrl);
      const res = existing || (await fetch(request));
      if (canCacheResponse(res)) {
        if (!existing) {
          const headers = new Headers(res.headers);
          if (revision) headers.set("X-Arclight-Revision", revision);
          await targetCache.put(
            requestUrl,
            new Response(res.body, {
              status: res.status,
              statusText: res.statusText,
              headers,
            }),
          );
        }
        cached += 1;
      } else {
        failed.push(url);
      }
    } catch {
      failed.push(url);
    }

    const processed = Math.min(index + 1 + normalized.rejected.length, total);
    if (processed > 0) {
      postCacheProgress(port, {
        type: "CACHE_PROGRESS",
        cached,
        failed: failed.length,
        processed,
        total,
      });
    }
  }

  return { cached, failed, total };
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const response = await fetch(SHELL_MANIFEST, { cache: "no-store" });
      if (!response.ok)
        throw new Error("Offline shell manifest could not be loaded");
      const manifest = await response.json();
      if (
        !Array.isArray(manifest.urls) ||
        !manifest.urls.includes("/index.html")
      )
        throw new Error("Invalid shell manifest");
      const normalized = normalizeCacheMessageUrls(manifest.urls);
      if (normalized.rejected.length) throw new Error("Unsafe shell manifest");
      const cache = await caches.open(CACHE_NAME);
      try {
        await cache.addAll(normalized.safe);
        await cache.put(
          SHELL_MANIFEST,
          new Response(JSON.stringify(manifest), {
            headers: { "Content-Type": "application/json" },
          }),
        );
      } catch (error) {
        await caches.delete(CACHE_NAME);
        throw error;
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("arclight-static-") && k !== CACHE_NAME)
          .map((k) => caches.delete(k)),
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
  // Sensitive and personalized responses must never enter a shared device cache.
  if (isSensitivePath(url.pathname)) return;

  // ---- MP4/M4A handling (avoid breaking cache with Range requests) ----
  const isRangeMedia =
    url.pathname.endsWith(".mp4") || url.pathname.endsWith(".m4a");
  const isChildhoodPilotHlsAsset =
    url.pathname.startsWith("/video-hls/childhood-eye-screening/") &&
    (url.pathname.endsWith(".m3u8") ||
      url.pathname.endsWith(".ts") ||
      url.pathname.endsWith(".vtt"));

  // Safari media playback is sensitive to malformed range responses, so only
  // answer range requests when a full cached media file is available.
  if (isRangeMedia && req.headers.has("range")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await matchCachedMedia(cache, req);
        if (cached) return createRangeResponse(req, cached);
        return fetch(req);
      })(),
    );
    return;
  }

  // For full MP4/M4A requests, prefer cache first (offline stability)
  if (isRangeMedia) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await matchCachedMedia(cache, req);
        if (cached) return cached;

        const fresh = await fetch(req);
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
          if (canCacheResponse(fresh)) {
            cache.put(req, fresh.clone()).catch(() => {});
          }
          return fresh;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          const packs = await caches.open(PACK_CACHE);
          const cached =
            (await matchPack(packs, req)) ||
            (await cache.match(req, { ignoreSearch: true }));
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
          if (canCacheResponse(fresh)) {
            cache.put(req, fresh.clone()).catch(() => {});
          }
          return fresh;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          const packs = await caches.open(PACK_CACHE);
          const cached =
            (await cache.match(req)) ||
            (await matchPack(packs, req)) ||
            (await cache.match("/index.html"));
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
        if (canCacheResponse(fresh)) {
          cache.put(req, fresh.clone()).catch(() => {});
        }
        return fresh;
      } catch {
        const packs = await caches.open(PACK_CACHE);
        const cached =
          (await cache.match(req)) || (await matchPack(packs, req));
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
    const port = ports?.[0];
    try {
      const result = await cacheUrls(urls, port);
      postCacheProgress(port, { type: "CACHE_DONE", ...result });
    } catch (err) {
      postCacheProgress(port, { type: "CACHE_ERROR", error: String(err) });
    }
  }
}

/* --------- Pre-cache on demand via postMessage from the app ---------- */
self.addEventListener("message", (event) => {
  event.waitUntil(handleMessage(event));
});
