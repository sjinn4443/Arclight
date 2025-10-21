// public/js/location-service.js

const GEO_CACHE_KEY = "profileGeo"; // stores { iso2, country, city, lat, lon, area, classification, ts }
const GEO_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ---------- City normalizer ----------
function normalizeCity(fromIp, fromReverse) {
  const pick = (obj) => {
    if (!obj || typeof obj !== "object") return null;
    return (
      obj.city ||
      obj.locality ||
      obj.town ||
      obj.village ||
      obj.principalSubdivisionLocality ||
      null
    );
  };
  return pick(fromReverse) || pick(fromIp) || null;
}

// ---------- Classification ----------
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
  ]);
  const VLI = new Set(["SS", "SO", "YE"]);
  if (VLI.has(iso2)) return "VLI";
  if (LI.has(iso2)) return "LI";
  if (HI.has(iso2)) return "HI";
  return "MI";
}

// ---------- Storage ----------
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

// ---------- Reverse geocode (BigDataCloud, no key) ----------
async function reverseGeocode(lat, lon, lang = "en") {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&localityLanguage=${encodeURIComponent(lang)}`,
      { signal: ctrl.signal }
    );
    if (!res.ok) throw new Error(`Reverse geocode failed: ${res.status}`);
    return await res.json(); // { city, locality, principalSubdivision, countryName, countryCode, ... }
  } finally {
    clearTimeout(timeout);
  }
}

// ---------- Core: initialize from IP (and refine if lat/lon present) ----------
export async function initializeLocation() {
  // 1) Serve fresh cache if present
  const cached = getCachedGeo();
  if (cached) {
    dispatchLocationUpdated(cached);
    return cached;
  }

  // 2) Seed from ipinfo
  let base = null;
  try {
    const res = await fetch("https://ipinfo.io/json?token=90ea1cfb8870ee");
    if (!res.ok) throw new Error("ipinfo failed");
    const info = await res.json(); // { country: "GB", loc: "56.46,-2.97", city: "Dundee", ... }

    const iso2 = (
      info && info.country ? String(info.country) : "GB"
    ).toUpperCase();
    const [rawLat, rawLon] = info?.loc
      ? info.loc.split(",").map((v) => parseFloat(v))
      : [null, null];
    const lat = Number.isFinite(rawLat) ? rawLat : null;
    const lon = Number.isFinite(rawLon) ? rawLon : null;

    // Try to get proper country name & improved city via reverse geocode when coords exist
    let reverse = null;
    if (lat != null && lon != null) {
      try {
        reverse = await reverseGeocode(lat, lon);
      } catch (e) {
        /* non-fatal */
      }
    }

    // Make a readable country name from ISO2 (e.g., "GB" -> "United Kingdom")
    let countryName = null;
    try {
      countryName =
        new Intl.DisplayNames(["en"], { type: "region" }).of(iso2) || iso2;
    } catch {
      countryName = iso2; // fallback if Intl not supported
    }

    // Prefer reverse-geocoded locality; fall back to ipinfo city
    const city = normalizeCity({ city: info?.city || null }, reverse);
    const friendlyCountry = reverse?.countryName || countryName;

    const payload = {
      iso2, // "GB"
      country: friendlyCountry, // "United Kingdom"
      city: city || null, // "Dundee"
      lat,
      lon,
      area: city || null, // back-compat
      classification: classifyCountry(iso2),
      ts: Date.now(),
    };

    _writeCache(payload);
    dispatchLocationUpdated(payload);
    return payload; // <-- important: return the object you just saved/dispatched
  } catch (err) {
    // 3) Fallback (no IP info)
    const fallback = {
      iso2: "GB",
      country: "GB",
      city: null,
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

// ---------- Precise browser geolocation path (ONE definition) ----------
export async function refineWithBrowserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn("geolocation unsupported");
      return resolve(null);
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        let reverse = null;
        try {
          reverse = await reverseGeocode(lat, lon); // BigDataCloud
        } catch (e) {
          console.warn("Reverse geocode failed", e);
        }

        const saved = JSON.parse(localStorage.getItem("profileGeo") || "{}");

        // ISO2 from reverse (preferred) or saved cache, then convert to readable name
        const iso2 = (reverse?.countryCode || saved.iso2 || "GB").toUpperCase();

        let countryName;
        try {
          countryName =
            new Intl.DisplayNames(["en"], { type: "region" }).of(iso2) || iso2;
        } catch {
          countryName = iso2;
        }

        // Prefer reverse-geocoded locality for city; fall back to saved city
        const city =
          (reverse?.city ||
            reverse?.locality ||
            reverse?.principalSubdivisionLocality ||
            null) ??
          saved.city ??
          null;

        const merged = {
          ...saved,
          iso2,
          country: reverse?.countryName || countryName, // prefer BigDataCloud’s full name
          city,
          lat,
          lon,
          area: city ?? saved.area ?? null, // keep "area" for back-compat
          classification: classifyCountry(iso2),
          ts: Date.now(),
        };

        localStorage.setItem("profileGeo", JSON.stringify(merged));
        document.dispatchEvent(
          new CustomEvent("location:updated", { detail: merged })
        );
        resolve(merged);
      },
      (err) => {
        console.warn("Browser geolocation denied/failed", err);
        resolve(null);
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 0 }
    );
  });
}

// ---------- Read helpers for UI ----------
export function getCurrentCountryCode() {
  return getCachedGeo()?.iso2 || "GB";
}
export function getCurrentArea() {
  const g = getCachedGeo();
  return g?.city || g?.area || null; // prefer city
}
export function getCurrentClassification() {
  return getCachedGeo()?.classification || null;
}

// ---------- Event dispatcher ----------
export function dispatchLocationUpdated(detail) {
  document.dispatchEvent(new CustomEvent("location:updated", { detail }));
}
