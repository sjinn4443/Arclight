const net = require("net");

const DEFAULT_LOOKUP_TIMEOUT_MS = 3000;
const DISABLED_VALUES = new Set(["0", "false", "off", "no"]);

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
  const configured = String(env.ENABLE_IP_LOCATION_LOOKUP || "")
    .trim()
    .toLowerCase();
  return !DISABLED_VALUES.has(configured);
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
  const [rawLatitude, rawLongitude] = String(payload?.loc || "")
    .split(",")
    .map((value) => Number.parseFloat(value));
  const countryCode = String(payload?.country || "")
    .trim()
    .toUpperCase();
  const countryName = countryNameFromCode(countryCode);

  return {
    source: "ipinfo",
    country: countryName,
    countryName,
    countryCode: countryCode || null,
    city: String(payload?.city || "").trim() || null,
    latitude: Number.isFinite(rawLatitude) ? rawLatitude : null,
    longitude: Number.isFinite(rawLongitude) ? rawLongitude : null,
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
  const rawLatitude = Number.parseFloat(payload?.latitude);
  const rawLongitude = Number.parseFloat(payload?.longitude);

  return {
    source: "bigdatacloud",
    country: countryName || null,
    countryName: countryName || null,
    countryCode: countryCode || null,
    city:
      String(
        payload?.city ||
          payload?.locality ||
          payload?.principalSubdivisionLocality ||
          "",
      ).trim() || null,
    latitude: Number.isFinite(rawLatitude) ? rawLatitude : null,
    longitude: Number.isFinite(rawLongitude) ? rawLongitude : null,
    error: null,
  };
}

function emptyResult(source, error) {
  return {
    source,
    country: null,
    countryName: null,
    countryCode: null,
    city: null,
    latitude: null,
    longitude: null,
    error,
  };
}

async function fetchJson(fetchImpl, url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`upstream ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function enrichIp(ip, options = {}) {
  const normalizedIp = normalizeIp(ip);
  if (isPrivateIp(normalizedIp)) return emptyResult("private", "private_ip");

  const lookupEnabled =
    options.lookupEnabled === undefined
      ? isLookupEnabled(options.env || process.env)
      : Boolean(options.lookupEnabled);
  if (!lookupEnabled) return emptyResult("disabled", "lookup_disabled");

  const fetchImpl =
    options.fetchImpl ||
    (typeof global.fetch === "function"
      ? global.fetch.bind(global)
      : require("node-fetch"));
  const timeoutMs =
    Number.isFinite(options.timeoutMs) && options.timeoutMs > 0
      ? options.timeoutMs
      : DEFAULT_LOOKUP_TIMEOUT_MS;
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

  for (const candidate of candidates) {
    try {
      const payload = await fetchJson(fetchImpl, candidate.url, timeoutMs);
      const result = candidate.parser(payload);
      if (result.countryName || result.countryCode || result.city)
        return result;
    } catch {
      // Try the next provider without logging the IP or upstream URL.
    }
  }

  return emptyResult("unavailable", "lookup_failed");
}

module.exports = {
  countryNameFromCode,
  enrichIp,
  isLookupEnabled,
  isPrivateIp,
  normalizeIp,
  parseBigDataCloudPayload,
  parseIpInfoPayload,
};
