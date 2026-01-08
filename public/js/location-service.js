/**
 * @fileoverview This file manages location services, including IP-based geolocation,
 * precise browser geolocation, reverse geocoding, and updating UI elements related to location.
 * It also handles caching of location data and dispatching location update events.
 */

import { bumpRefresh, saveProfile } from "./telemetry.js";

// ---------- Constants ----------
const GEO_CACHE_KEY = "profileGeo"; // stores { iso2, country, city, lat, lon, area, classification, ts, isPrecise }
const GEO_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// LocalStorage key used by the app for user-selected location
const LS_KEY_USER_LOCATION = "userLocation"; // { lat, lon, area, source, ts }

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
    "UK",
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
  } catch {
    void 0;
  }
}
function getCachedGeo() {
  const data = _readCache();
  if (!data) return null;
  // If a precise location was set, always return it regardless of TTL
  if (data.isPrecise) return data;
  // Otherwise, apply TTL for non-precise (IP-based) data
  if (!data.ts || Date.now() - data.ts > GEO_CACHE_TTL_MS) return null;
  return data;
}

// ---------- Reverse geocode (BigDataCloud, no key) ----------
async function reverseGeocode(lat, lon, lang = "en") {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&localityLanguage=${encodeURIComponent(lang)}`;
  const r = await fetch(url, { method: "GET" });
  if (!r.ok) throw new Error("reverse geocode failed");
  const d = await r.json();

  // Compose a friendly area string (e.g., “Shoreditch, London, GB”)
  const parts = [
    d.locality || d.city || d.localityInfo?.administrative?.[0]?.name,
    d.principalSubdivision || d.region,
    d.countryCode,
  ].filter(Boolean);

  return {
    area: parts.join(", "),
    // fields expected elsewhere in the code:
    countryName: d.countryName,
    countryCode: d.countryCode,
    city: d.city || d.locality || d.principalSubdivisionLocality || null,
    locality: d.locality ?? null,
    principalSubdivisionLocality: d.principalSubdivisionLocality ?? null,
    region: d.principalSubdivision || d.region || null,
    raw: d,
  };
}

// ---------- Core: initialize from IP (and refine if lat/lon present) ----------
export async function initializeLocation() {
  // 1) Check for a previously saved precise location
  const rawCached = _readCache();
  if (rawCached?.isPrecise) {
    dispatchLocationUpdated(rawCached);
    return rawCached;
  }

  // 2) If no precise location, seed from ipinfo (always fresh)
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
      } catch (_) {
        /* non-fatal */
        void 0;
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
        const merged = {
          ...saved,
          iso2,
          country: reverse?.countryName || countryName, // prefer BigDataCloud’s full name
          city: reverse?.city || saved.city || null, // prefer reverse geocoded city
          lat,
          lon,
          area: reverse?.area ?? saved.area ?? null, // Use the detailed area from reverseGeocode
          classification: classifyCountry(iso2),
          ts: Date.now(),
          isPrecise: true, // Mark this as a precise, user-confirmed location
        };

        localStorage.setItem("profileGeo", JSON.stringify(merged));
        saveProfile({
          country: merged.country || null,
          area: merged.area || merged.city || null,
          lat: merged.lat ?? null,
          lon: merged.lon ?? null,
        });

        document.dispatchEvent(
          new CustomEvent("location:updated", { detail: merged }),
        );
        resolve(merged);
      },
      (_) => {
        console.warn("Browser geolocation denied/failed", _);
        resolve(null);
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 0 },
    );
  });
}

// ---------- Read helpers for UI ----------
export function getCurrentCountryCode() {
  const data = _readCache(); // Directly read from localStorage
  return data?.iso2 || "GB";
}
export function getCurrentArea() {
  const data = _readCache(); // Directly read from localStorage
  return data?.area || data?.city || null; // Prefer area, then city
}
export function getCurrentClassification() {
  return getCachedGeo()?.classification || null;
}

// ---------- Event dispatcher ----------
export function dispatchLocationUpdated(detail) {
  document.dispatchEvent(new CustomEvent("location:updated", { detail }));
}

// ===== Precise Location Flow =====

// Set UI busy state (e.g., disable button, show spinner)
function setUIBusy(isBusy) {
  const btn = document.querySelector(
    '#checkLocationBtn, [data-action="checklocation"]',
  );
  if (!btn) return;
  btn.disabled = !!isBusy;
  btn.dataset.loading = isBusy ? "1" : "0"; // if you style [data-loading="1"] as a spinner

  // Add/remove animation classes
  if (isBusy) {
    btn.classList.add("checking-location");
  } else {
    btn.classList.remove("checking-location");
  }
}

// Update the UI elements that display location information.
// This function now also handles making the profile location visible and highlighting it.
export function updateLocationUI(area, from = "gps") {
  const nodes = [
    document.querySelector("#ipLocationText"),
    document.querySelector('[data-role="ip-location-text"]'),
    document.querySelector(".ip-location .text"),
    document.querySelector("#locationText"),
    document.querySelector("#profileLocation"), // Target the menu label element
  ].filter(Boolean);

  nodes.forEach((n) => {
    n.textContent = normaliseAreaForDisplay(area) || "Location unavailable";
    // Ensure the profile location becomes visible if the HTML hid it
    if (n.id === "profileLocation") {
      n.style.visibility = "visible";
    }
  });

  // Tiny inline feedback toast
  const toast = document.createElement("span");
  toast.textContent = from === "gps" ? " ✓ updated" : " ✓";
  toast.style.marginLeft = "6px";
  toast.style.opacity = "0.85";
  // Append toast to the first valid node found
  if (nodes.length > 0) {
    nodes[0].appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
  }

  // Highlight the profile location briefly on successful GPS update
  if (from === "gps" && area) {
    const profileLocationEl = document.querySelector("#profileLocation");
    if (profileLocationEl) {
      profileLocationEl.classList.add("highlighted");
      setTimeout(() => {
        profileLocationEl.classList.remove("highlighted");
      }, 1000); // Highlight for 1 second
    }
  }
}

// Safe wrapper to store the latest user-selected location
function saveUserLocationToLocalStorage({ lat, lon, area, source }) {
  try {
    const payload = {
      lat,
      lon,
      area,
      source, // 'gps' | 'ip'
      ts: Date.now(),
    };
    localStorage.setItem(LS_KEY_USER_LOCATION, JSON.stringify(payload));
  } catch (_) {
    void 0;
  }
}

// Main entry when user clicks "Check Location"
export async function handleCheckLocationClick() {
  try {
    setUIBusy(true);

    // 1) Get precise GPS
    const coords = await requestPreciseLocation();

    // 2) Reverse-geocode to a readable area
    const { area, countryCode, countryName, city } = await reverseGeocode(
      coords.latitude,
      coords.longitude,
    );

    // 3) Save precise location to localStorage for userLocation
    saveUserLocationToLocalStorage({
      lat: coords.latitude,
      lon: coords.longitude,
      area,
      source: "gps",
    });

    // 4) ALSO update profileGeo (the menu reads this) and dispatch the app-wide event
    const prev = JSON.parse(localStorage.getItem(GEO_CACHE_KEY) || "{}");
    const iso2 = (countryCode || prev.iso2 || "GB").toUpperCase();

    let countryDisplayName;
    try {
      countryDisplayName =
        new Intl.DisplayNames(["en"], { type: "region" }).of(iso2) || iso2;
    } catch {
      countryDisplayName = iso2;
    }

    const precise = {
      ...prev,
      iso2,
      country: countryName || countryDisplayName, // prefer BigDataCloud’s full name
      city: city || prev.city || null, // prefer reverse geocoded city
      lat: coords.latitude,
      lon: coords.longitude,
      area: area ?? prev.area ?? null, // Use the detailed area from reverseGeocode
      classification: classifyCountry(iso2),
      ts: Date.now(),
      isPrecise: true, // persist as the authoritative, user-confirmed location
    };

    localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(precise));
    document.dispatchEvent(
      new CustomEvent("location:updated", { detail: precise }),
    );

    // Notify backend so Dev Dashboard reflects the new location
    try {
      await bumpRefresh({
        reason: "location_precise",
        geo: {
          iso2: precise.iso2,
          country: precise.country,
          city: precise.city || null,
          lat: precise.lat,
          lon: precise.lon,
          area: precise.area || null,
          isPrecise: true,
          ts: precise.ts,
        },
      });
      // Optional: let the app know telemetry finished
      document.dispatchEvent(new CustomEvent("telemetry:refreshed"));
    } catch (e) {
      console.warn("bumpRefresh failed after precise location update:", e);
    }

    // 5) Update the visible UI immediately
    updateLocationUI(area, "gps");

    // 6) Mark button as used and fade it out
    markPreciseLocationButtonUsed();
  } catch (err) {
    console.error("checklocation failed:", err);
    updateLocationUI("Unable to get precise location");
  } finally {
    setUIBusy(false);
  }
}

const LS_KEY_PRECISE_BTN_USED = "preciseLocationButtonUsed";

function markPreciseLocationButtonUsed() {
  try {
    localStorage.setItem(LS_KEY_PRECISE_BTN_USED, "1");
  } catch (_) {
    /* noop */
  }

  const btn = document.querySelector("#checkLocationBtn");
  if (!btn) return;

  btn.classList.add("fading-out");
  // After fade, remove from layout
  setTimeout(() => {
    btn.classList.add("is-hidden");
  }, 420);
}

// Event listener for the "Check Location" button
document.addEventListener("click", (e) => {
  const t = e.target;
  if (t.matches('#checkLocationBtn, [data-action="checklocation"]')) {
    e.preventDefault();
    handleCheckLocationClick();
  }
});

// ---------- Helper to request precise browser location ----------
async function requestPreciseLocation() {
  if (!("geolocation" in navigator)) {
    throw new Error("Geolocation not supported");
  }
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => reject(err),
      {
        enableHighAccuracy: true,
        timeout: 15000, // 15s
        maximumAge: 0,
      },
    );
  });
}

// ---- Hydrate the menu label from cache on load (prefer precise) ----
function hydrateProfileLocationFromCache() {
  try {
    const userLoc = JSON.parse(
      localStorage.getItem(LS_KEY_USER_LOCATION) || "null",
    );
    const profGeo = JSON.parse(localStorage.getItem(GEO_CACHE_KEY) || "null");

    // Prefer the most recent precise/user-confirmed area, then any cached area/city
    const area =
      (profGeo?.isPrecise && profGeo?.area) ||
      userLoc?.area ||
      profGeo?.area ||
      profGeo?.city ||
      null;

    if (area) {
      updateLocationUI(area, "cache"); // Use 'cache' to indicate source
    }

    // If a precise location was already saved, hide the button
    if (
      profGeo?.isPrecise ||
      localStorage.getItem(LS_KEY_PRECISE_BTN_USED) === "1"
    ) {
      const btn = document.querySelector("#checkLocationBtn");
      btn?.classList.add("is-hidden");
    }
  } catch (e) {
    console.error("Failed to hydrate profile location from cache:", e);
    /* noop */
  }
}

// Run hydrate once the DOM is ready
document.addEventListener("DOMContentLoaded", hydrateProfileLocationFromCache);

// Also listen for app-wide location updates to refresh the menu label if needed
document.addEventListener("location:updated", (e) => {
  const newest = e?.detail;
  if (!newest) return;
  const area = newest.area || newest.city || null;
  if (area) {
    // Use 'event' to indicate source, or 'cache' if it's from profileGeo.isPrecise
    const source = newest.isPrecise ? "cache" : "event";
    updateLocationUI(area, source);
  }
});

function normaliseAreaForDisplay(area) {
  if (!area) return area;
  // Swap trailing ", GB" or standalone "GB" to "UK"
  return area.replace(/,\s*GB\b/g, ", UK").replace(/\bGB\b/g, "UK");
}
