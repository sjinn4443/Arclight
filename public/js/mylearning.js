/**
 * @fileoverview This file provides robust rendering for the "My Learnings" page, displaying liked items with masonry layout, search functionality, and cross-tab/same-tab synchronization.
 */

import { loadPage } from "./navigation.js";
import { EYES_INDEX } from "./catalog-index.js";

// ---- Likes store compatibility (prefer global getters if present) ----
// Canonical storage key (baseline-compatible) for liked items.
const PRIMARY_KEY = "likedItems";
// Legacy keys to support older saved data formats.
const LEGACY_KEYS = ["eyesLikes", "likedItems", "liked"];
const MY_LEARNING_EMPTY_FALLBACK =
  "No saved items yet. Tap the heart on any Eyes card to add it here.";
const MY_LEARNING_UNMATCHED_FALLBACK =
  "Your saved items couldn't be matched. Try liking a new item.";
const MY_LEARNING_EMPTY_I18N_KEY = "i18nExtra.my_learning_empty";
const MY_LEARNING_UNMATCHED_I18N_KEY = "i18nExtra.my_learning_unmatched";

/**
 * Reads liked items from localStorage for a given key and returns them as a Set.
 * Handles potential JSON parsing errors.
 * @param {string} key - The localStorage key to read from.
 * @returns {Set<string>} A Set containing the liked item IDs.
 */
function readLikesFrom(key) {
  try {
    return new Set(JSON.parse(localStorage.getItem(key)) || []);
  } catch {
    return new Set();
  }
}

/**
 * Writes a Set of liked item IDs to localStorage under the PRIMARY_KEY.
 * @param {Set<string>} set - The Set of liked item IDs to write.
 */
function writeLikes(set) {
  try {
    localStorage.setItem(PRIMARY_KEY, JSON.stringify([...set]));
  } catch {}
}

/**
 * Merges liked items from all known (primary and legacy) localStorage keys
 * into a single Set and normalizes them to the PRIMARY_KEY for future reads.
 * @returns {Set<string>} A unified Set of all liked item IDs.
 */
function getUnifiedLikesLocal() {
  const merged = new Set();
  // primary
  for (const l of readLikesFrom(PRIMARY_KEY)) merged.add(String(l));
  // legacy
  for (const k of LEGACY_KEYS)
    for (const l of readLikesFrom(k)) merged.add(String(l));
  // normalize to PRIMARY for future reads
  writeLikes(merged);
  return merged;
}

// Prefer likes.js exports if available (eyes + others already use them)
/**
 * Resolves the appropriate function to get liked items.
 * Prefers global `window.getLikes` or `window.readLikes` if available,
 * otherwise falls back to `getUnifiedLikesLocal`.
 * @returns {Function} A function that returns a Set of liked item IDs.
 */
function resolveLikesGetter() {
  if (typeof window.getLikes === "function") {
    return () => window.getLikes(); // expected Set<string>
  }
  if (typeof window.readLikes === "function") {
    return () => window.readLikes(); // expected Set<string>
  }
  return () => getUnifiedLikesLocal(); // fallback
}
const getLikes = resolveLikesGetter();

/**
 * Navigates to a specified target page.
 * Prefers `window.showPage` if available (for baseline compatibility), otherwise uses `loadPage`.
 * @param {string} target - The ID or route name of the page to navigate to.
 */
function go(target) {
  const t = String(target || "").trim();
  if (!t) return;

  const VIDEO_PAGE_IDS = new Set([
    "learningModules",
    "coreClinicalOphthalmicExamination",
    "diseasesPage",
    "arclightPage",
    "childhoodEyeScreeningPage",
    "howToUseArclightVideoPage",
    "directOphthalmoscopy",
    "anteriorSegmentVideoPage",
    "frontOfEyePage",
    "pupilsPage",
    "rapdTestVideoPage",
    "phoneAttachmentVideoPage",
    "visualAcuityPage",
    "fundalReflexPage",
    "interactiveLearningPage",
    "assessmentVisionPage",
    "normalAbnormalPage",
    "fundalReflexInteractivePage",
    "traumaInteractivePage",
    "amslerInteractivePage",
    "miresPage",
    "morphPage",
    "squintPalsyPage",
    "cataractPage",
  ]);

  // Deep-link into Videos route if target is a videos subpage
  if (t === "pupilsPage" || VIDEO_PAGE_IDS.has(t)) {
    try {
      sessionStorage.setItem(
        "fromRoute",
        window.currentPageName || "mylearning",
      );
    } catch {}
    (async () => {
      await loadPage("videos");
      try {
        const mod = await import("./videos.js");
        if (t === "pupilsPage" && typeof mod.goToPupilsSection === "function") {
          mod.goToPupilsSection();
        } else if (typeof mod.goToVideosSection === "function") {
          mod.goToVideosSection(t);
        } else {
          sessionStorage.setItem("gotoSubPage", t);
        }
      } catch {
        sessionStorage.setItem("gotoSubPage", t);
      }
    })();
    return;
  }

  // Non-video targets
  if (typeof window.showPage === "function") window.showPage(t);
  else loadPage(t);
}

// ---- Catalog access (no imports from other files) ----
/**
 * Retrieves all "Eyes" related items from a global `window.EYES_SECTIONS` object.
 * Flattens the sections into a single array of items.
 * @returns {Array<Object>} An array of all "Eyes" items.
 */
function getAllEyesItems() {
  // Prefer eyes.js provider if loaded on this route
  if (typeof window.getAllEyesItems === "function") {
    try {
      return window.getAllEyesItems() || [];
    } catch {
      /* fall through */
    }
  }
  // Fallback: derive a flat list from EYES_INDEX (label -> pageId)
  if (typeof EYES_INDEX === "object" && EYES_INDEX) {
    return Object.entries(EYES_INDEX).map(([label, target]) => ({
      label,
      target,
    }));
  }
  // Final fallback: if EYES_SECTIONS exists
  const sections = window.EYES_SECTIONS || {};
  const flat = [];
  Object.values(sections).forEach((list) => {
    (list || []).forEach((i) => flat.push(i));
  });
  return flat;
}

// ---- Helpers ----
/**
 * Converts a value to a normalized lowercase string key.
 * @param {any} v - The value to convert.
 * @returns {string} The normalized string key.
 */
function toKey(v) {
  return v == null ? "" : String(v).trim().toLowerCase();
}

/**
 * Extracts a normalized key from an item object, trying various common fields.
 * @param {Object} item - The item object.
 * @returns {string} The normalized key for the item.
 */
function getItemKey(item) {
  // Try common fields used around the app
  return toKey(
    item?.label || item?.id || item?.key || item?.slug || item?.dataLabel,
  );
}

/**
 * Randomly picks a size class ('size-s', 'size-m', 'size-l') for a masonry card.
 * @returns {string} The selected size class.
 */
function pickSize() {
  const r = Math.random();
  if (r < 0.45) return "size-s";
  if (r < 0.8) return "size-m";
  return "size-l";
}

/**
 * Ensures a container element exists within the given page for rendering liked items.
 * If no known container is found, a default one is created and appended.
 * @param {HTMLElement} page - The page element.
 * @returns {HTMLElement} The container element for liked items.
 */
function ensureContainer(page) {
  // Try any of the known containers
  let el = page.querySelector("#likedMasonry, #myLearningsList, #m1-masonry");
  if (el) return el;

  // None found: create a safe default container
  el = document.createElement("div");
  el.id = "myLearningsList";
  // rely on existing CSS (we're not adding styles)
  page.appendChild(el);
  return el;
}

// ---- Public init (called when route hits liked page) ----
/**
 * Initializes the "My Learnings" page.
 * Renders the liked items, sets up event listeners for cross-tab and same-tab storage changes,
 * and observes page visibility for dynamic updates.
 */
export function initializeMyLearning() {
  renderMyLearnings(); // initial

  // Cross-tab refresh
  window.addEventListener("storage", (e) => {
    if (!e.key || e.key === PRIMARY_KEY || LEGACY_KEYS.includes(e.key)) {
      renderMyLearnings();
    }
  });

  // Same-tab refresh (requires likes.js to dispatch 'likes:changed' after writes)
  window.addEventListener("likes:changed", renderMyLearnings);

  window.addEventListener("app:navigate", (e) => {
    const pid = e?.detail?.pageId || e?.detail;
    if (pid === "likedPage" || pid === "myLearnings") renderMyLearnings();
  });

  // Also watch visibility toggles if no router event
  const liked =
    document.getElementById("likedPage") ||
    document.getElementById("myLearnings");
  if (liked && window.MutationObserver) {
    const obs = new MutationObserver(() => {
      const active =
        liked.classList.contains("active") || liked.style.display !== "none";
      if (active) renderMyLearnings();
    });
    obs.observe(liked, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
  }

  // First-load fallback (deep links)
  document.addEventListener("DOMContentLoaded", () => {
    const current = document.querySelector(".page.active");
    if (current && (current.id === "likedPage" || current.id === "myLearnings"))
      renderMyLearnings();
  });
}

// ---- Render ----
/**
 * Renders the liked items on the "My Learnings" page.
 * Fetches liked items, filters them from the full catalog, and displays them
 * as clickable cards with search and chip filtering functionality.
 */
function renderMyLearnings() {
  const page =
    document.getElementById("likedPage") ||
    document.getElementById("myLearnings");
  if (!page) return;

  const listEl = ensureContainer(page);

  // Read likes; tolerate Set or Array
  const raw = getLikes();
  const likedIds = Array.isArray(raw)
    ? raw.map((v) => toKey(v))
    : Array.from(raw instanceof Set ? raw : new Set(), (v) => toKey(v));

  const cardTemplate = document.getElementById("mlCardTemplate");
  if (!cardTemplate) return;

  if (!likedIds.length) {
    listEl.textContent = "";
    const empty = document.createElement("p");
    empty.className = "note";
    empty.setAttribute("role", "status");
    empty.setAttribute("aria-live", "polite");
    empty.textContent = MY_LEARNING_EMPTY_FALLBACK;
    empty.setAttribute("data-i18n", MY_LEARNING_EMPTY_I18N_KEY);
    listEl.appendChild(empty);
    try {
      window.I18N?.applyTranslations?.(empty);
    } catch {
      void 0;
    }
    return;
  }

  const allItems = getAllEyesItems();
  const likedSet = new Set(likedIds);

  // Match liked IDs to items using multiple candidate keys (label/id/key/slug)
  const likedItems = allItems.filter((it) => likedSet.has(getItemKey(it)));

  // Render
  /**
   * Renders a single liked item as a card.
   * @param {Object} item - The item object to render.
   * @returns {HTMLElement} The DOM node for the item card.
   */
  const renderCard = (item) => {
    const title = item.label || item.name || "Untitled";
    const target = item.target || item.pageId || "comingSoon";
    const size = pickSize();
    const card = cardTemplate.content.querySelector(".ml-card").cloneNode(true);
    card.classList.add(size);
    card.dataset.target = target;

    const titleEl = card.querySelector("h4");
    if (titleEl) titleEl.textContent = title;

    const badgesWrap = card.querySelector(".ml-badges");
    if (badgesWrap) {
      badgesWrap.textContent = "";
      (item.tags || []).slice(0, 3).forEach((t) => {
        const badge = document.createElement("span");
        badge.className = "ml-badge";
        badge.textContent = t;
        badgesWrap.appendChild(badge);
      });
    }

    return card;
  };

  listEl.textContent = "";
  if (likedItems.length) {
    likedItems.map(renderCard).forEach((card) => listEl.appendChild(card));
  } else {
    const empty = document.createElement("p");
    empty.className = "note";
    empty.setAttribute("role", "status");
    empty.setAttribute("aria-live", "polite");
    empty.textContent = MY_LEARNING_UNMATCHED_FALLBACK;
    empty.setAttribute("data-i18n", MY_LEARNING_UNMATCHED_I18N_KEY);
    listEl.appendChild(empty);
    try {
      window.I18N?.applyTranslations?.(empty);
    } catch {
      void 0;
    }
  }

  // Card navigation
  listEl.onclick = (e) => {
    const card = e.target.closest?.(".ml-card");
    if (!card) return;
    const target = card.getAttribute("data-target") || "comingSoon";
    go(target);
  };

  // Search filter (if present)
  const search = page.querySelector("#mlSearch");
  if (search && !search._mlBound) {
    search._mlBound = true;
    search.addEventListener("input", () => {
      const q = (search.value || "").toLowerCase();
      listEl.querySelectorAll(".ml-card").forEach((card) => {
        const title = (
          card.querySelector("h4")?.textContent || ""
        ).toLowerCase();
        card.style.display = title.includes(q) ? "" : "none";
      });
    });
  }

  // Chips - cosmetic toggles
  const chips = page.querySelectorAll(".ml-chip");
  chips.forEach((chip) => {
    if (chip._mlBound) return;
    chip._mlBound = true;
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
    });
  });
}
