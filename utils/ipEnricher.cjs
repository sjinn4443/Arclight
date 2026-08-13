const crypto = require("crypto");
const net = require("net");

const DEFAULT_LOOKUP_TIMEOUT_MS = 3000;
const DEFAULT_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const DEFAULT_CACHE_MAX_ENTRIES = 1000;
const ENABLED_VALUES = new Set(["1", "true", "yes", "on"]);
const lookupCache = new Map();

function normalizeIp(value) {
  const raw = String(value || "")
    .trim()
    .toLowerCase();
  return raw.startsWith("::ffff:") ? raw.slice(7) : raw;
}

function isPrivateIp(value) {
  const ip = normalizeIp(value);
  return (
    !net.isIP(ip) ||
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("169.254.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip) ||
    ip.startsWith("fc") ||
    ip.startsWith("fd") ||
    ip.startsWith("fe80:")
  );
}

function isLookupEnabled(env = process.env) {
  return ENABLED_VALUES.has(
    String(env.ENABLE_IP_LOCATION_LOOKUP || "")
      .trim()
      .toLowerCase(),
  );
}

function countryNameFromCode(code) {
  const iso2 = String(code || "")
    .trim()
    .toUpperCase();
  if (!iso2) return null;

  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(iso2) || iso2;
  } catch {
    return iso2;
  }
}

function parseIpInfoPayload(payload) {
  const countryCode = String(payload?.country || "")
    .trim()
    .toUpperCase();
  const countryName = countryNameFromCode(countryCode);

  return {
    source: "ipinfo",
    country: countryName,
    countryName,
    countryCode: countryCode || null,
    error: null,
  };
}

function parseBigDataCloudPayload(payload) {
  const countryCode = String(payload?.countryCode || "")
    .trim()
    .toUpperCase();
  const countryName =
    String(payload?.countryName || "").trim() ||
    countryNameFromCode(countryCode);

  return {
    source: "bigdatacloud",
    country: countryName || null,
    countryName: countryName || null,
    countryCode: countryCode || null,
    error: null,
  };
}

function emptyResult(source, error) {
  return {
    source,
    country: null,
    countryName: null,
    countryCode: null,
    error,
  };
}

function cacheKeyForIp(ip) {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

function readCachedResult(key, now) {
  const cached = lookupCache.get(key);
  if (!cached) return null;
  if (cached.expiresAt <= now) {
    lookupCache.delete(key);
    return null;
  }
  return { ...cached.result };
}

function writeCachedResult(key, result, now, ttlMs, maxEntries) {
  if (lookupCache.has(key)) lookupCache.delete(key);
  lookupCache.set(key, {
    expiresAt: now + ttlMs,
    result: { ...result },
  });
  while (lookupCache.size > maxEntries) {
    const oldestKey = lookupCache.keys().next().value;
    lookupCache.delete(oldestKey);
  }
}

async function fetchJson(fetchImpl, url, signal) {
  const response = await fetchImpl(url, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) throw new Error(`upstream ${response.status}`);
  return await response.json();
}

async function enrichIp(ip, options = {}) {
  const normalizedIp = normalizeIp(ip);
  if (isPrivateIp(normalizedIp)) return emptyResult("private", "private_ip");

  const lookupEnabled =
    options.lookupEnabled === undefined
      ? isLookupEnabled(options.env || process.env)
      : Boolean(options.lookupEnabled);
  if (!lookupEnabled) return emptyResult("disabled", "lookup_disabled");

  const now = Number.isFinite(options.now) ? options.now : Date.now();
  const cacheEnabled = options.cache !== false;
  const cacheKey = cacheKeyForIp(normalizedIp);
  if (cacheEnabled) {
    const cached = readCachedResult(cacheKey, now);
    if (cached) return cached;
  }

  const fetchImpl =
    options.fetchImpl ||
    (typeof global.fetch === "function"
      ? global.fetch.bind(global)
      : require("node-fetch"));
  const timeoutMs =
    Number.isFinite(options.timeoutMs) && options.timeoutMs > 0
      ? options.timeoutMs
      : DEFAULT_LOOKUP_TIMEOUT_MS;
  const cacheTtlMs =
    Number.isFinite(options.cacheTtlMs) && options.cacheTtlMs > 0
      ? options.cacheTtlMs
      : DEFAULT_CACHE_TTL_MS;
  const cacheMaxEntries =
    Number.isSafeInteger(options.cacheMaxEntries) && options.cacheMaxEntries > 0
      ? options.cacheMaxEntries
      : DEFAULT_CACHE_MAX_ENTRIES;
  const token = String(
    options.ipinfoToken ?? process.env.IPINFO_TOKEN ?? "",
  ).trim();
  const encodedIp = encodeURIComponent(normalizedIp);
  const candidates = [];

  if (token) {
    candidates.push({
      url: `https://ipinfo.io/${encodedIp}/json?token=${encodeURIComponent(token)}`,
      parser: parseIpInfoPayload,
    });
  }
  candidates.push(
    {
      url: `https://ipinfo.io/${encodedIp}/json`,
      parser: parseIpInfoPayload,
    },
    {
      url: `https://api.bigdatacloud.net/data/ip-geolocation?ip=${encodedIp}&localityLanguage=en`,
      parser: parseBigDataCloudPayload,
    },
  );

  const controller = new AbortController();
  let timer;
  const timeoutPromise = new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error("lookup timeout"));
    }, timeoutMs);
  });

  let result = null;
  try {
    for (const candidate of candidates) {
      try {
        const payload = await Promise.race([
          fetchJson(fetchImpl, candidate.url, controller.signal),
          timeoutPromise,
        ]);
        const parsed = candidate.parser(payload);
        if (parsed.countryName || parsed.countryCode) {
          result = parsed;
          break;
        }
      } catch {
        if (controller.signal.aborted) break;
      }
    }
  } finally {
    clearTimeout(timer);
  }

  result = result || emptyResult("unavailable", "lookup_failed");
  if (cacheEnabled) {
    writeCachedResult(cacheKey, result, now, cacheTtlMs, cacheMaxEntries);
  }
  return { ...result };
}

function clearLookupCache() {
  lookupCache.clear();
}

module.exports = {
  clearLookupCache,
  countryNameFromCode,
  enrichIp,
  isLookupEnabled,
  isPrivateIp,
  normalizeIp,
  parseBigDataCloudPayload,
  parseIpInfoPayload,
};
