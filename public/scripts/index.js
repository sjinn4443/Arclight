// public/scripts/index.js
import {
  initializeLocation,
  refineWithBrowserLocation,
  getCurrentCountryCode,
} from "./location-service.js";
import { pushLocalStorageToServer } from "./home-data.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Seed from IP
  await initializeLocation();
  // Update menu immediately if it's already in the DOM
  const locEl = document.getElementById("profileLocation");
  if (locEl) locEl.textContent = `Location: ${getCurrentCountryCode()}`;

  // Optionally push to server (guarded)
  // await pushLocalStorageToServer();
});

// Keep UI in sync if location changes later (e.g., after precise geolocation)
document.addEventListener("location:updated", (ev) => {
  const locEl = document.getElementById("profileLocation");
  if (locEl && ev.detail?.iso2) {
    locEl.textContent = `Location: ${ev.detail.iso2}`;
  }
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
