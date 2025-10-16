// public/scripts/index.js
import {
  initializeLocation,
  refineWithBrowserLocation,
  getCurrentCountryCode,
} from "./location-service.js";
import { pushLocalStorageToServer } from "./home-data.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Get the user’s location from IP
  const data = await initializeLocation();

  // Update the visible text
  const locEl = document.getElementById("profileLocation");
  if (locEl && data?.iso2) {
    locEl.textContent = `Location: ${data.iso2}`;
    locEl.style.visibility = "visible";
  }

  // Optionally push to server (guarded)
  // await pushLocalStorageToServer();
});

// Keep UI in sync if location changes later (e.g., after precise geolocation)
document.addEventListener("location:updated", (e) => {
  const locEl = document.getElementById("profileLocation");
  if (locEl && e.detail?.iso2) {
    // If we also have city name, show both
    if (e.detail.area) {
      locEl.textContent = `Location: ${e.detail.area}, ${e.detail.iso2}`;
    } else {
      locEl.textContent = `Location: ${e.detail.iso2}`;
    }
    locEl.style.visibility = "visible";
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
