/**
 * @fileoverview This file manages the application's global overlay menu. Handles menu initialization, opening, and closing, including fetching menu content and setting up event listeners.
 */

import { loadPage } from "./navigation.js";
import { getCurrentCountryCode, updateLocationUI } from "./location-service.js";

let overlay, closeBtn;
let cachedVersionInfo = null;
let versionInfoRequest = null;
let menuInitRequest = null;
let menuEscapeHandlerBound = false;

function formatVersionDate(isoDate) {
  if (!isoDate || typeof isoDate !== "string") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return null;
  return `${m[3]}.${m[2]}.${m[1]}`;
}

function parsePositiveInt(value) {
  const raw = String(value ?? "").trim();
  if (!/^\d+$/.test(raw)) return null;
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) return null;
  return parsed;
}

function normalizeVersionPayload(payload) {
  const versionDateIso =
    typeof payload?.versionDate === "string"
      ? payload.versionDate.slice(0, 10)
      : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(versionDateIso)) return null;

  const versionSequence =
    parsePositiveInt(
      payload?.versionSequence ?? payload?.pushNumber ?? payload?.buildNumber,
    ) || 1;

  return {
    versionDateIso,
    versionSequence,
  };
}

async function fetchVersionInfo() {
  const endpoints = ["/api/app/version", "/version.json"];
  let best = null;
  const requestStamp = Date.now();

  for (const baseUrl of endpoints) {
    const sep = baseUrl.includes("?") ? "&" : "?";
    const url = `${baseUrl}${sep}vts=${requestStamp}`;
    try {
      const res = await fetch(url, {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!res.ok) continue;

      const payload = await res.json();
      const value = normalizeVersionPayload(payload);
      if (!value) continue;

      if (!best) {
        best = value;
        continue;
      }

      if (value.versionDateIso > best.versionDateIso) {
        best = value;
        continue;
      }

      if (
        value.versionDateIso === best.versionDateIso &&
        value.versionSequence > best.versionSequence
      ) {
        best = value;
      }
    } catch (err) {
      console.error(`[menu] version metadata fetch failed (${url}):`, err);
    }
  }

  return best;
}

async function getVersionInfo(options = {}) {
  const forceRefresh = options?.forceRefresh === true;
  if (forceRefresh) cachedVersionInfo = null;
  if (cachedVersionInfo) return cachedVersionInfo;
  if (!versionInfoRequest) {
    versionInfoRequest = fetchVersionInfo().finally(() => {
      versionInfoRequest = null;
    });
  }
  const value = await versionInfoRequest;
  if (value) cachedVersionInfo = value;
  return value;
}

async function renderMenuVersionDate() {
  const el = overlay?.querySelector("#menuVersionDate");
  if (!el) return;

  const versionInfo = await getVersionInfo({ forceRefresh: true });
  const versionDateIso = versionInfo?.versionDateIso || null;
  const formatted = formatVersionDate(versionDateIso);

  if (!formatted) {
    el.textContent = "ver --.--.----";
    el.removeAttribute("datetime");
    return;
  }

  const versionSequence = parsePositiveInt(versionInfo?.versionSequence) || 1;
  el.textContent = `ver ${formatted}.${versionSequence}`;
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

function sanitizeMenuOverlay(root) {
  if (!root) return;

  const legacyAtomsSection = root
    .querySelector("#atomsCardEyesBtn, #atomsCardEarsBtn")
    ?.closest(".menu-section");
  legacyAtomsSection?.remove();

  root
    .querySelector('[data-i18n="menu.alan_section_title"]')
    ?.closest(".menu-section")
    ?.classList.add("menu-section--tight-top");

  root
    .querySelector('[data-route="languageinstall"]')
    ?.closest(".menu-section")
    ?.classList.add("menu-section--tight-top");
}

function setActiveMenuTab(root, targetId) {
  if (!root || !targetId) return;

  const target = Array.from(root.querySelectorAll(".menu-tab-content")).find(
    (content) => content.id === targetId,
  );
  if (!target) return;

  root
    .querySelectorAll(".menu-tabs .tab[data-menu-tab-target]")
    .forEach((tab) => {
      tab.classList.toggle(
        "active",
        tab.getAttribute("data-menu-tab-target") === targetId,
      );
    });

  root.querySelectorAll(".menu-tab-content").forEach((content) => {
    content.classList.toggle("hidden", content.id !== targetId);
  });
}

function wireMenuTabs(root) {
  if (!root) return;

  const tabs = root.querySelectorAll(".menu-tabs .tab[data-menu-tab-target]");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    if (tab.dataset.menuTabWired === "1") return;
    tab.dataset.menuTabWired = "1";
    tab.addEventListener("click", () => {
      setActiveMenuTab(root, tab.getAttribute("data-menu-tab-target"));
    });
  });

  const activeTarget =
    root
      .querySelector(".menu-tabs .tab.active[data-menu-tab-target]")
      ?.getAttribute("data-menu-tab-target") ||
    tabs[0]?.getAttribute("data-menu-tab-target");
  setActiveMenuTab(root, activeTarget);
}

async function openMenuDownloadOptions() {
  closeMenu();

  const {
    cacheOfflineUrls,
    fetchAllOfflineAssetUrls,
    resolveOfflineDownloadSelection,
    showDownloadAppModal,
    showDownloadErrorModal,
  } = await import("./languageinstall.js");

  try {
    const manifest = await fetchAllOfflineAssetUrls();
    const choice = await showDownloadAppModal(manifest);
    if (!choice) return;

    const selection = resolveOfflineDownloadSelection(manifest, choice);
    await navigator.serviceWorker.ready;
    await cacheOfflineUrls(selection);
  } catch (err) {
    console.warn("[menu] could not download offline content:", err);
    showDownloadErrorModal(err);
  }
}

function ensureDownloadedContentsModal() {
  let modal = document.getElementById("downloadedContentsModal");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "downloadedContentsModal";
  modal.className = "modal-overlay hidden";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "downloadedContentsTitle");
  modal.innerHTML = `
    <div class="modal-box download-modal">
      <div class="modal-header">
        <span id="downloadedContentsTitle">Downloaded Contents</span>
        <button
          type="button"
          class="modal-close"
          id="closeDownloadedContentsModalBtn"
          aria-label="Close"
        >&times;</button>
      </div>
      <div class="modal-content"></div>
      <div class="modal-footer">
        <button type="button" id="downloadedContentsCloseBtn">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  const close = () => modal.classList.add("hidden");
  modal
    .querySelector("#closeDownloadedContentsModalBtn")
    ?.addEventListener("click", close);
  modal
    .querySelector("#downloadedContentsCloseBtn")
    ?.addEventListener("click", close);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });

  return modal;
}

function setDownloadedContentsModalContent(html) {
  const modal = ensureDownloadedContentsModal();
  const content = modal.querySelector(".modal-content");
  if (content) content.innerHTML = html;
  modal.classList.remove("hidden");
}

async function getCachedManifestUrls(assets) {
  const cached = new Set();
  if (!("caches" in window)) return cached;

  const batchSize = 50;
  for (let i = 0; i < assets.length; i += batchSize) {
    const batch = assets.slice(i, i + batchSize);
    const matches = await Promise.all(
      batch.map(async (asset) => {
        try {
          const href = new URL(asset.url, window.location.origin).href;
          const response = await caches.match(href, { ignoreSearch: true });
          return response ? asset.url : "";
        } catch {
          return "";
        }
      }),
    );

    matches.filter(Boolean).forEach((url) => cached.add(url));
  }

  return cached;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderDownloadedContentsSummary(groups, totalCached, totalAssets) {
  const visibleGroups = groups.filter((group) => group.cachedCount > 0);
  if (!visibleGroups.length) {
    return `
      <p>No downloaded contents found.</p>
      <p>Downloaded files: ${totalCached} of ${totalAssets}.</p>
    `;
  }

  const items = visibleGroups
    .map((group) => {
      const complete = group.cachedCount >= group.totalCount;
      const status = complete ? "Downloaded" : "Partly downloaded";
      return `
        <li class="downloaded-content-item${complete ? " is-complete" : ""}">
          <span class="downloaded-content-item__title">${escapeHtml(group.label)}</span>
          <span class="downloaded-content-item__meta">${status} - ${group.cachedCount} of ${group.totalCount} files</span>
        </li>
      `;
    })
    .join("");

  return `
    <p>Downloaded files: ${totalCached} of ${totalAssets}.</p>
    <ul class="downloaded-content-list">${items}</ul>
  `;
}

async function openDownloadedContentsModal() {
  closeMenu();
  setDownloadedContentsModalContent("<p>Checking downloaded contents...</p>");

  try {
    const {
      OFFLINE_CATALOG_OPTIONS,
      fetchAllOfflineAssetUrls,
      formatDownloadSize,
      getOfflineManifestAssets,
      matchesOfflineCatalog,
    } = await import("./languageinstall.js");
    const manifest = await fetchAllOfflineAssetUrls();
    const assets = getOfflineManifestAssets(manifest);
    const cachedUrls = await getCachedManifestUrls(assets);
    const groupedUrls = new Set();
    const groups = OFFLINE_CATALOG_OPTIONS.map((option) => {
      const groupAssets = assets.filter((asset) =>
        matchesOfflineCatalog(asset.url, option.id),
      );
      groupAssets.forEach((asset) => groupedUrls.add(asset.url));
      return {
        cachedCount: groupAssets.filter((asset) => cachedUrls.has(asset.url))
          .length,
        label: option.label,
        totalCount: groupAssets.length,
      };
    }).filter((group) => group.totalCount > 0);

    const sharedAssets = assets.filter((asset) => !groupedUrls.has(asset.url));
    const sharedCachedCount = sharedAssets.filter((asset) =>
      cachedUrls.has(asset.url),
    ).length;
    if (sharedAssets.length) {
      groups.unshift({
        cachedCount: sharedCachedCount,
        label: "App shell and shared assets",
        totalCount: sharedAssets.length,
      });
    }

    const cachedBytes = assets
      .filter((asset) => cachedUrls.has(asset.url))
      .reduce((sum, asset) => sum + (Number(asset.bytes) || 0), 0);

    const html = `${renderDownloadedContentsSummary(
      groups,
      cachedUrls.size,
      assets.length,
    )}<p class="downloaded-content-size">Approx. cached size: ${formatDownloadSize(
      cachedBytes,
    )}.</p>`;
    setDownloadedContentsModalContent(html);
  } catch (err) {
    console.warn("[menu] could not inspect downloaded contents:", err);
    setDownloadedContentsModalContent(
      `<p>Could not check downloaded contents.</p><p>${escapeHtml(
        err?.message || err,
      )}</p>`,
    );
  }
}

function wireMenuContentActions(root) {
  if (!root) return;

  const startDownloadBtn = root.querySelector("#startDownloadBtn");
  if (startDownloadBtn && startDownloadBtn.dataset.wired !== "1") {
    startDownloadBtn.dataset.wired = "1";
    startDownloadBtn.addEventListener("click", () => {
      void openMenuDownloadOptions();
    });
  }

  const downloadedContentsBtn = root.querySelector("#downloadedContentsBtn");
  if (downloadedContentsBtn && downloadedContentsBtn.dataset.wired !== "1") {
    downloadedContentsBtn.dataset.wired = "1";
    downloadedContentsBtn.addEventListener("click", () => {
      void openDownloadedContentsModal();
    });
  }
}

/**
 * Initializes the global overlay menu.
 * Fetches the menu HTML, appends it to the body, and sets up event listeners
 * for closing the menu (via button, outside click, or Escape key).
 * Ensures the menu is initialized only once.
 */
export async function initializeMenu() {
  if (overlay) {
    sanitizeMenuOverlay(overlay);
    return;
  }
  if (menuInitRequest) return menuInitRequest;

  menuInitRequest = (async () => {
    // 1) Fetch the template
    const res = await fetch("html/menu.html", {
      credentials: "same-origin",
      cache: "no-store",
    });
    const html = await res.text();

    // 2) Parse and extract the overlay element
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const found = tmp.querySelector("#menuOverlay");
    if (!found) {
      console.error("[menu] #menuOverlay not found in html/menu.html");
      return;
    }

    sanitizeMenuOverlay(found);
    wireMenuTabs(found);
    wireMenuContentActions(found);

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
    window.I18N?.applyTranslations?.(overlay);
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

    if (!menuEscapeHandlerBound) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
      });
      menuEscapeHandlerBound = true;
    }

    overlay.addEventListener("click", (e) => {
      const routeEl = e.target.closest("[data-route]");
      const linkEl = e.target.closest("a,[data-close-menu]");

      if (routeEl) {
        const route = routeEl.getAttribute("data-route");
        if (!route) return;
        const myLearningTab = routeEl.getAttribute("data-my-learning-tab");
        if (route === "mylearning" && myLearningTab) {
          try {
            sessionStorage.setItem("myLearningActiveTab", myLearningTab);
            localStorage.setItem("myLearningActiveTab", myLearningTab);
          } catch {
            void 0;
          }
        }

        // Always use the router for data-route items
        loadPage(route);

        closeMenu();
        return;
      }

      if (linkEl) closeMenu();
    });
  })().finally(() => {
    menuInitRequest = null;
  });

  return menuInitRequest;
}

// ---- Event listeners for location updates and rendering ----

// A) When the app fires our custom "location:updated" event (IP seed or precise GPS)
// This listener is now handled by location-service.js itself, which calls updateLocationUI.
// We keep this here to ensure it's called when the menu is opened.

// B) When pages/partials are shown (your app’s nav lifecycle).
// If your app emits 'page:shown' with detail.pageId === 'menu' (or similar),
// update when the menu overlay appears.
document.addEventListener("page:shown", () => {
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
export async function openMenu() {
  if (!overlay) await initializeMenu();
  if (!overlay) return;

  sanitizeMenuOverlay(overlay);
  wireMenuTabs(overlay);
  wireMenuContentActions(overlay);

  const nameEl = overlay.querySelector("#menuUsername");
  const name = (localStorage.getItem("username") || "").trim();
  if (nameEl) {
    nameEl.textContent = name || "Your name";
  }
  window.I18N?.applyTranslations?.(overlay);

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
  window.I18N?.applyTranslations?.(modal);

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
