// public/scripts/index.js
import {
  initializeLocation,
  refineWithBrowserLocation,
  _getCurrentCountryCode,
} from "./location-service.js";
import { _pushLocalStorageToServer } from "./home-data.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Get the element where we show the location
  const locEl = document.getElementById("profileLocation");

  // Helper to safely update the text
  const updateLocationText = (payload = {}) => {
    if (!locEl || !payload.iso2) return;
    const city =
      payload.area ||
      payload.city ||
      payload.town ||
      payload.locality ||
      payload.region;
    const text = city
      ? `Location: ${city}, ${payload.iso2}`
      : `Location: ${payload.iso2}`;
    locEl.textContent = text;
    locEl.style.visibility = "visible";
  };

  try {
    const data = await initializeLocation();
    console.warn("initializeLocation() →", data);
    updateLocationText(data);
  } catch (err) {
    console.warn("initializeLocation() failed:", err);
  }

  document.addEventListener("location:updated", (ev) => {
    const el = document.getElementById("profileLocation");
    if (!el) return;

    const geo = ev.detail || {};
    const city = geo.city && String(geo.city).trim();
    const country = (geo.country || geo.iso2 || "").toString().trim();

    let text = "Location: —";
    if (city && country) {
      text = `Location: ${city}, ${country}`;
    } else if (country) {
      text = `Location: ${country}`;
    } else if (city) {
      text = `Location: ${city}`;
    }

    el.textContent = text;
    el.style.visibility = "visible";
  });
});

// Optional: wire a button to request precise location later
// e.g. <button id="btnPreciseLocation">Use precise location</button>
const preciseBtn = document.getElementById("btnPreciseLocation");
if (preciseBtn) {
  preciseBtn.addEventListener("click", async () => {
    try {
      await refineWithBrowserLocation();
      // Optionally send to server after user consent
      // await pushLocalStorageToServer();
    } catch (e) {
      // No-op; user may have denied permission
      console.warn("Precise location denied or failed", e);
    }
  });
}
