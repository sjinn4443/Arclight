/**
 * @fileoverview This file manages the application's global overlay menu. Handles menu initialization, opening, and closing, including fetching menu content and setting up event listeners.
 */

import { loadPage } from "./navigation.js";
import {
  getCurrentCountryCode,
  getCurrentArea,
  updateLocationUI,
} from "./location-service.js";

let overlay, closeBtn;
let cachedVersionDateIso = null;
let versionDateRequest = null;

function formatVersionDate(isoDate) {
  if (!isoDate || typeof isoDate !== "string") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return null;
  return `${m[3]}.${m[2]}.${m[1]}`;
}

async function fetchVersionDateIso() {
  const endpoints = ["/api/app/version", "/version.json"];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!res.ok) continue;

      const payload = await res.json();
      const value =
        typeof payload?.versionDate === "string"
          ? payload.versionDate.slice(0, 10)
          : "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    } catch (err) {
      console.error(`[menu] version date fetch failed (${url}):`, err);
    }
  }

  return null;
}

async function getVersionDateIso() {
  if (cachedVersionDateIso) return cachedVersionDateIso;
  if (!versionDateRequest) {
    versionDateRequest = fetchVersionDateIso().finally(() => {
      versionDateRequest = null;
    });
  }
  const value = await versionDateRequest;
  if (value) cachedVersionDateIso = value;
  return value;
}

async function renderMenuVersionDate() {
  const el = overlay?.querySelector("#menuVersionDate");
  if (!el) return;

  const versionDateIso = await getVersionDateIso();
  const formatted = formatVersionDate(versionDateIso);

  if (!formatted) {
    el.textContent = "ver --.--.----";
    el.removeAttribute("datetime");
    return;
  }

  el.textContent = `ver ${formatted}`;
  el.dateTime = versionDateIso;
}

// --- Render the profile location from localStorage (prefer precise) ---
function renderProfileLocation() {
  // Try ID first; fall back to class (in case ID changed)
  const el =
    document.getElementById("profileLocation") ||
    document.querySelector(".profile-location");
  if (!el) return;

  // Read the caches we maintain
  let profGeo = null;
  let userLoc = null;
  try {
    profGeo = JSON.parse(localStorage.getItem("profileGeo") || "null");
    userLoc = JSON.parse(localStorage.getItem("userLocation") || "null");
  } catch {
    /* ignore parse errors */
  }

  // Determine the best label to show: area [, region] , ISO
  const iso = (profGeo?.iso2 || getCurrentCountryCode() || "GB").toUpperCase();

  // Prefer the most recent precise area first
  const area =
    (profGeo?.isPrecise && (profGeo?.area || profGeo?.city)) ||
    userLoc?.area ||
    profGeo?.area ||
    profGeo?.city ||
    null;

  // Optional region/state if present (helps get "Scotland" in e.g. Glasgow, Scotland, GB)
  const region =
    profGeo?.region ||
    profGeo?.state ||
    profGeo?.admin1 ||
    profGeo?.admin ||
    null;

  const labelParts = [area, region, iso].filter(Boolean);
  const label = labelParts.length ? labelParts.join(", ") : iso;

  // Use the shared renderer so all location badges stay in sync
  updateLocationUI(label, "cache");

  // Ensure the profile location becomes visible if the HTML hid it
  if (el.id === "profileLocation") {
    el.style.visibility = "visible";
  }
}

/**
 * Initializes the global overlay menu.
 * Fetches the menu HTML, appends it to the body, and sets up event listeners
 * for closing the menu (via button, outside click, or Escape key).
 * Ensures the menu is initialized only once.
 */
export async function initializeMenu() {
  if (overlay) return; // already initialized

  // 1) Fetch the template
  const res = await fetch("html/menu.html");
  const html = await res.text();

  // 2) Parse and extract the overlay element
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  const found = tmp.querySelector("#menuOverlay");
  if (!found) {
    console.error("[menu] #menuOverlay not found in html/menu.html");
    return;
  }

  // 3) Ensure it starts hidden & append under <body>
  found.classList.add("hidden");
  document.body.appendChild(found);

  // 4) Wire refs AFTER appending
  overlay = found;
  closeBtn = overlay.querySelector("#closeMenuBtn");

  // 5) Populate username now that overlay exists
  const nameEl = overlay.querySelector("#menuUsername");
  const name = (localStorage.getItem("username") || "").trim();
  if (nameEl) {
    nameEl.textContent = name || "Your name";
  }
  void renderMenuVersionDate();

  // 5b) Wire the "i" info button to open the info popup
  const infoBtn = overlay.querySelector(".info-icon");
  infoBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    showInfoModal();
  });

  // 6) Handlers
  closeBtn?.addEventListener("click", closeMenu);

  overlay.addEventListener("click", (e) => {
    // click outside the panel closes
    if (e.target === overlay) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  overlay.addEventListener("click", (e) => {
    const routeEl = e.target.closest("[data-route]");
    const linkEl = e.target.closest("a,[data-close-menu]");

    if (routeEl) {
      const route = routeEl.getAttribute("data-route");
      if (!route) return;

      // Always use the router for data-route items
      loadPage(route);

      closeMenu();
      return;
    }

    if (linkEl) closeMenu();
  });
}

// ---- Event listeners for location updates and rendering ----

// A) When the app fires our custom "location:updated" event (IP seed or precise GPS)
// This listener is now handled by location-service.js itself, which calls updateLocationUI.
// We keep this here to ensure it's called when the menu is opened.

// B) When pages/partials are shown (your app’s nav lifecycle).
// If your app emits 'page:shown' with detail.pageId === 'menu' (or similar),
// update when the menu overlay appears.
document.addEventListener("page:shown", (e) => {
  // If you know the page/overlay id, check it here; otherwise just render if the node exists.
  // Example guard (adjust to your real page id if you have one):
  // if (e.detail?.pageId !== 'menu') return;
  renderProfileLocation();
});

// C) Also try right after DOM is ready (covers cases where menu HTML is already in DOM)
document.addEventListener("DOMContentLoaded", renderProfileLocation);

// Re-render whenever location changes anywhere in the app
document.addEventListener("location:updated", () => {
  renderProfileLocation();
});

/**
 * Opens the global overlay menu.
 * Adds a 'data-menu-open' attribute to the body and removes the 'hidden' class from the overlay.
 */
export function openMenu() {
  if (!overlay) return;

  const nameEl = overlay.querySelector("#menuUsername");
  const name = (localStorage.getItem("username") || "").trim();
  if (nameEl) {
    nameEl.textContent = name || "Your name";
  }

  // D) Call renderProfileLocation at the end of openMenu() to ensure it's updated when menu opens
  renderProfileLocation();
  void renderMenuVersionDate();

  document.body.setAttribute("data-menu-open", "true");
  overlay.classList.remove("hidden");

  const panel = overlay?.querySelector(".menu-panel");
  if (panel) wireMenuSearchToggle(panel);
}

/**
 * Closes the global overlay menu.
 * Removes the 'data-menu-open' attribute from the body and adds the 'hidden' class to the overlay.
 */
export function closeMenu() {
  if (!overlay) return;
  document.body.removeAttribute("data-menu-open");
  overlay.classList.add("hidden");
}

function wireMenuSearchToggle(panelRoot) {
  const searchWrap = panelRoot.querySelector(
    ".menu-search-wrap.search-wrap--compact",
  );
  const toggleBtn = panelRoot.querySelector("#menuSearchToggle");

  if (!searchWrap || !toggleBtn) return;
  if (toggleBtn.dataset.wired === "1") return;
  toggleBtn.dataset.wired = "1";
  const input = searchWrap.querySelector('input[type="search"]');

  toggleBtn.addEventListener("click", () => {
    if (searchWrap.classList.contains("search-collapsed")) {
      searchWrap.classList.remove("search-collapsed");
      searchWrap.classList.add("search-expanded");
      // optional: focus input
      input?.focus();
    } else {
      searchWrap.classList.remove("search-expanded");
      searchWrap.classList.add("search-collapsed");
      input?.blur();
    }
  });
}

function showInfoModal() {
  // Prevent duplicates
  if (document.getElementById("infoModalOverlay")) return;

  const modalTemplate = document.getElementById("menuInfoModalTemplate");
  if (!modalTemplate) return;

  const modal = modalTemplate.content
    .querySelector("#infoModalOverlay")
    ?.cloneNode(true);
  if (!modal) return;

  document.body.appendChild(modal);

  const close = () => {
    modal.classList.add("fade-out");
    setTimeout(() => modal.remove(), 250); // match guest modal timing
  };

  // Close on ×, OK, or clicking the dim background
  modal.querySelector(".guest-modal__close")?.addEventListener("click", close);
  modal.querySelector(".guest-modal__cta")?.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
}
