// public/scripts/location-service.js

const GEO_CACHE_KEY = "profileGeo"; // stores { iso2, country, lat, lon, area, classification, ts }
const GEO_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ---- Classification: HI/MI/LI/VLI (starter set; extend as needed) ----
function classifyCountry(iso2) {
  if (!iso2) return "MI";
  const HI = new Set([
    "GB",
    "US",
    "CA",
    "DE",
    "FR",
    "SE",
    "NO",
    "DK",
    "NL",
    "FI",
    "AU",
    "NZ",
    "JP",
    "KR",
    "SG",
    "IE",
    "CH",
    "AT",
    "BE",
    "LU",
    "IS",
    "IT",
    "ES",
    "PT",
  ]);
  const LI = new Set([
    "AF",
    "CF",
    "SO",
    "SS",
    "ML",
    "NE",
    "TD",
    "BI",
    "CD",
    "ET",
    "LR",
    "MG",
    "MW",
    "MZ",
    "NI",
    "PK",
    "SL",
    "SY",
    "UG",
    "YE",
    "ZM",
  ]); // example
  const VLI = new Set(["SS", "SO", "YE"]);
  if (VLI.has(iso2)) return "VLI";
  if (LI.has(iso2)) return "LI";
  if (HI.has(iso2)) return "HI";
  return "MI";
}

// ---- Storage helpers ----
function _readCache() {
  try {
    return JSON.parse(localStorage.getItem(GEO_CACHE_KEY) || "null");
  } catch {
    return null;
  }
}
function _writeCache(obj) {
  try {
    localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(obj));
  } catch {}
}
function getCachedGeo() {
  const data = _readCache();
  if (!data) return null;
  if (!data.ts || Date.now() - data.ts > GEO_CACHE_TTL_MS) return null;
  return data;
}

// ---- Stage 1: Seed from IP (ipinfo.io) ----
export async function initializeLocation() {
  // Return cached (fresh) if available
  const cached = getCachedGeo();
  if (cached) {
    dispatchLocationUpdated(cached);
    return cached;
  }

  try {
    const res = await fetch("https://ipinfo.io/json?token="); // add token if you have one; works w/out for light usage
    if (!res.ok) throw new Error("ipinfo failed");
    const info = await res.json();
    // ipinfo: { country: "GB", loc: "lat,lon", city: "Dundee", ... }
    const iso2 = (info && info.country) || "GB";
    const [lat, lon] =
      info && info.loc ? info.loc.split(",").map(parseFloat) : [null, null];
    const area = info && info.city ? info.city : null;
    const classification = classifyCountry(iso2);
    const payload = {
      iso2,
      country: iso2,
      lat: Number.isFinite(lat) ? lat : null,
      lon: Number.isFinite(lon) ? lon : null,
      area, // rough city from IP
      classification,
      ts: Date.now(),
    };
    _writeCache(payload);
    dispatchLocationUpdated(payload);
    return payload;
  } catch (err) {
    // fallback to GB for styling
    const fallback = {
      iso2: "GB",
      country: "GB",
      lat: null,
      lon: null,
      area: null,
      classification: "HI",
      ts: Date.now(),
    };
    _writeCache(fallback);
    dispatchLocationUpdated(fallback);
    return fallback;
  }
}

// ---- Stage 2: precise browser geolocation + reverse geocode ----
export async function refineWithBrowserLocation() {
  const pos = await new Promise((resolve, reject) => {
    if (!navigator.geolocation)
      return reject(new Error("geolocation unsupported"));
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
    });
  });

  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  // Reverse geocode (no key required for this endpoint)
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&localityLanguage=en`;
  const r = await fetch(url);
  const data = await r.json();

  // BigDataCloud fields: { countryCode, countryName, city, locality, principalSubdivision, ... }
  const iso2 = (data && data.countryCode) || getCachedGeo()?.iso2 || "GB";
  const area =
    data?.city || data?.locality || data?.principalSubdivision || null;
  const classification = classifyCountry(iso2);

  const merged = {
    ...(getCachedGeo() || {}),
    iso2,
    country: iso2,
    lat,
    lon,
    area,
    classification,
    ts: Date.now(),
  };

  _writeCache(merged);
  dispatchLocationUpdated(merged);
  return merged;
}

// ---- Utils to read current values for UI ----
export function getCurrentCountryCode() {
  return getCachedGeo()?.iso2 || "GB";
}
export function getCurrentArea() {
  return getCachedGeo()?.area || null;
}
export function getCurrentClassification() {
  return getCachedGeo()?.classification || null;
}

// ---- Event to notify UI pieces ----
export function dispatchLocationUpdated(detail) {
  document.dispatchEvent(new CustomEvent("location:updated", { detail }));
}
