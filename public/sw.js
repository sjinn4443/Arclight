/* sw.js — Arclight PWA service worker */
/* global __BUILD_CACHE_NAME__ */
const CACHE_NAME =
  typeof __BUILD_CACHE_NAME__ === "undefined"
    ? "arclight-static-v108"
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
async function matchPack(cache, request, { allowStale = false } = {}) {
  const response = await matchCachedUrl(cache, request);
  if (!response) return null;
  const url = new URL(
    typeof request === "string" ? request : request.url,
    self.location.origin,
  );
  const expected = (await packRevisions())[url.pathname];
  // A shell update must not make an already downloaded lesson unavailable.
  // Only download/resume requires the current revision; playback can use the
  // retained download until the user refreshes that content.
  return allowStale ||
    !expected ||
    response.headers.get("X-Arclight-Revision") === expected
    ? response
    : null;
}

async function matchCachedUrl(cache, request) {
  const response = await cache.match(request);
  if (response) return response;
  const url = new URL(
    typeof request === "string" ? request : request.url,
    self.location.origin,
  );
  if (!url.search) return null;
  // Download manifests use canonical URLs. Look up that exact key rather than
  // scanning a large media cache with ignoreSearch on every file or request.
  url.search = "";
  return cache.match(url.href);
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

function canCacheDownload(url, response) {
  if (!canCacheResponse(response) || response.status !== 200) return false;
  if (/\.(?:mp4|m4a)(?:\?|$)/i.test(url)) {
    // Some static hosts return their HTML fallback with 200 for missing media.
    // That response must never be reported as a downloaded video.
    const type = response.headers.get("Content-Type") || "";
    if (/text\/html|application\/json/i.test(type)) return false;
    if (response.headers.get("Content-Length") === "0") return false;
  }
  return true;
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
    [/_720p(?=\.mp4$)/i, "_240p"],
    [/_(?:220|240)p(?=\.mp4$)/i, "_720p"],
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
    (await matchPack(packs, request, { allowStale: true })) ||
    (await matchCachedUrl(cache, request));
  if (cached) return cached;

  for (const alternateUrl of getAlternateMp4Urls(request.url)) {
    const alternate =
      (await matchPack(packs, alternateUrl, { allowStale: true })) ||
      (await matchCachedUrl(cache, alternateUrl));
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
  const controller = new AbortController();
  if (port) {
    port.onmessage = (event) => {
      if (event.data?.type === "CACHE_CANCEL") controller.abort();
    };
    port.start?.();
  }
  const cache = await caches.open(PACK_CACHE);
  const shellCache = await caches.open(CACHE_NAME);
  const revisions = await packRevisions();
  const normalized = normalizeCacheMessageUrls(urls);
  let cached = 0;
  const failed = [...normalized.rejected];
  const total = normalized.total;

  for (const [index, url] of normalized.safe.entries()) {
    if (controller.signal.aborted) break;
    try {
      const requestUrl = new URL(url, self.location.origin).href;
      const request = new Request(requestUrl, {
        cache: "no-store",
        signal: controller.signal,
      });
      const revision = revisions[new URL(requestUrl).pathname];
      const targetCache = revision ? cache : shellCache;
      const stored = await matchPack(targetCache, requestUrl);
      const existing = canCacheDownload(requestUrl, stored) ? stored : null;
      const res = existing || (await fetch(request));
      if (controller.signal.aborted) break;
      if (canCacheDownload(requestUrl, res)) {
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
          // Some storage failures can acknowledge a write without leaving a
          // readable entry. Never turn that into a successful offline download.
          const saved = await matchPack(targetCache, requestUrl);
          const readable = canCacheDownload(requestUrl, saved);
          saved?.body?.cancel().catch(() => {});
          if (!readable)
            throw new Error("Downloaded file could not be read from storage");
        }
        existing?.body?.cancel().catch(() => {});
        cached += 1;
      } else {
        failed.push(url);
      }
    } catch {
      if (controller.signal.aborted) break;
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

  if (port) port.onmessage = null;
  return { cached, failed, total, paused: controller.signal.aborted };
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
 * - Installed shell and downloaded content: cache-first, including navigations.
 * - Missing content: network. Shell updates are installed in a new versioned
 *   cache; explicit downloads refresh packs by revision.
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

  // Downloaded HLS must also work when the network stalls rather than rejects.
  if (isChildhoodPilotHlsAsset) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const packs = await caches.open(PACK_CACHE);
        const cached =
          (await matchPack(packs, req, { allowStale: true })) ||
          (await matchCachedUrl(cache, req));
        if (cached) return cached;
        try {
          const fresh = await fetch(req, { cache: "no-store" });
          if (canCacheResponse(fresh)) {
            event.waitUntil(cache.put(req, fresh.clone()).catch(() => {}));
          }
          return fresh;
        } catch {
          return Response.error();
        }
      })(),
    );
    return;
  }

  if (req.mode === "navigate") {
    // Reopening an installed app must not depend on a network timeout. Only
    // top-level app entry URLs may fall back to index; an iframe needs its own
    // downloaded HTML document, not the parent app inside the iframe.
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const packs = await caches.open(PACK_CACHE);
        const cached =
          (await matchCachedUrl(cache, req)) ||
          (await matchPack(packs, req, { allowStale: true })) ||
          (["/", "/index.html"].includes(url.pathname)
            ? await cache.match("/index.html")
            : null);
        if (cached) return cached;
        try {
          const fresh = await fetch(req);
          if (canCacheResponse(fresh)) {
            event.waitUntil(cache.put(req, fresh.clone()).catch(() => {}));
          }
          return fresh;
        } catch {
          return Response.error();
        }
      })(),
    );
    return;
  }

  // Shell modules, route fragments, images and downloaded lesson data must be
  // readable immediately, even if onLine is true with an unusable connection.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const packs = await caches.open(PACK_CACHE);
      const cached =
        (await matchCachedUrl(cache, req)) ||
        (await matchPack(packs, req, { allowStale: true }));
      if (cached) return cached;
      try {
        const fresh = await fetch(req, { cache: "no-store" });
        if (canCacheResponse(fresh)) {
          event.waitUntil(cache.put(req, fresh.clone()).catch(() => {}));
        }
        return fresh;
      } catch {
        return Response.error();
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
      postCacheProgress(port, {
        type: result.paused ? "CACHE_PAUSED" : "CACHE_DONE",
        ...result,
      });
    } catch (err) {
      postCacheProgress(port, { type: "CACHE_ERROR", error: String(err) });
    }
  }
}

/* --------- Pre-cache on demand via postMessage from the app ---------- */
self.addEventListener("message", (event) => {
  event.waitUntil(handleMessage(event));
});
