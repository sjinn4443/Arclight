/**
 * @fileoverview Core client-side logic for the Arclight app. Handles global initialization, navigation, splash screen flow, and dynamic page loading.
 */

import { loadPage, initializePageNavigation } from "./navigation.js";
import { initializeMenu, closeMenu, openMenu } from "./menu.js";
import { initializePWA } from "./pwa.js";
import { wireGlobalNavigation } from "./navigation.js";
import { initializeVideoPlayers, initializeToolbar } from "./video.js";

// === App bootstrap ===
/**
 * Initializes global systems and sets up event listeners for page loading.
 * This function runs once the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Init global systems once
  initializeMenu();

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".menuBtn");
    if (!btn) return;
    e.preventDefault();
    openMenu();
  });

  initializePageNavigation();
  initializePWA();

  /**
   * Event listener for 'page:loaded' custom event.
   * Dynamically imports and initializes page-specific JavaScript based on the route name.
   * @param {CustomEvent} e - The custom 'page:loaded' event.
   */
  window.addEventListener("page:loaded", async (e) => {
    const routeName = e?.detail?.routeName;
    if (routeName === "eyes") {
      const { initializeEyes } = await import("./eyes.js");
      initializeEyes?.(); // calls initializeEyesCatalog()
      return;
    }

    if (routeName === "mylearning") {
      const { initializeMyLearning } = await import("./mylearning.js");
      initializeMyLearning?.();
      return;
    }

    if (routeName === "videos") {
      const { initializeVideos } = await import("./videos.js");
      initializeVideos?.();

      // Also (re)attach toolbar + video listeners now that the fragment is in the DOM
      initializeToolbar();
      initializeVideoPlayers();
      return;
    }
  });
});

/**
 * Another event listener for 'page:loaded' custom event, specifically for the 'liked' route.
 * Dynamically imports and initializes the 'My Learning' page.
 * @param {CustomEvent} e - The custom 'page:loaded' event.
 */
window.addEventListener("page:loaded", async (e) => {
  const routeName = e?.detail?.routeName;
  if (routeName === "mylearning" || routeName === "liked") {
    // support both names
    const { initializeMyLearning } = await import("./mylearning.js");
    initializeMyLearning?.();
  }
});

// Direct-open a requested subpage inside videos.html (e.g., pupilsPage)
window.addEventListener("page:loaded", (e) => {
  if (e?.detail?.routeName !== "videos") return;

  const target = sessionStorage.getItem("gotoSubPage");
  if (!target) return;
  sessionStorage.removeItem("gotoSubPage");

  // Hide all .page sections, then show the requested one
  const allPages = document.querySelectorAll(".page");
  allPages.forEach((p) => (p.style.display = "none"));

  const host = document.getElementById(target);
  if (host) host.style.display = "";

  try {
    const { openMenu } = require("./menu.js");
    document.querySelectorAll("#pupilsPage .menuBtn").forEach((btn) =>
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        openMenu();
      }),
    );
  } catch {}
});

/**
 * Handles the initial splash screen display and transitions to the language installation page.
 * This function runs once the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  wireGlobalNavigation();

  // Baseline parity: Splash → LanguageInstall after ~1.8s
  const splashContainer = document.getElementById("splashScreenContainer");
  if (splashContainer) {
    fetch("html/splashscreen.html")
      .then((response) => response.text())
      .then((html) => {
        splashContainer.innerHTML = html;
        splashContainer.classList.add("active");

        const logo = splashContainer.querySelector(".logo-one");

        // Safety fallback in case animation doesn't fire (e.g., prefers-reduced-motion)
        const MAX_WAIT_MS = 8000;
        const fallback = setTimeout(done, MAX_WAIT_MS);

        /**
         * Handles the 'animationend' event for the splash screen logo.
         * Specifically listens for the 'shiftRight' animation to complete.
         * @param {AnimationEvent} e - The animation event object.
         */
        function onAnimationEnd(e) {
          if (e.animationName === "shiftRight") {
            logo.removeEventListener("animationend", onAnimationEnd);
            clearTimeout(fallback);
            done();
          }
        }

        /**
         * Completes the splash screen sequence by fading out the overlay
         * and navigating to the language installation page.
         */
        function done() {
          splashContainer.classList.remove("active");
          splashContainer.classList.add("fade-out");
          loadPage("languageinstall");
        }

        // If we find the animated element, wait for the final anim to end.
        // Otherwise, just fall back immediately.
        if (logo) {
          logo.addEventListener("animationend", onAnimationEnd, {
            once: false,
          });
        } else {
          clearTimeout(fallback);
          done();
        }
      })
      .catch((error) => {
        console.error("Failed to load splashscreen.html:", error);
        loadPage("languageinstall"); // fallback if splash not present
      });
  } else {
    // fallback if no splash container present
    loadPage("languageinstall");
  }
});

const routeName =
  document.body?.dataset?.route ||
  (location.pathname.split("/").pop() || "index.html").replace(
    /\.html$/i,
    "",
  ) ||
  "index";

// === Per-route initializers ===
/**
 * Global event listener for 'page:loaded' custom event.
 * Closes the menu on navigation and dynamically imports and initializes
 * page-specific JavaScript based on the loaded page's route name.
 * @param {CustomEvent} e - The custom 'page:loaded' event.
 */
window.addEventListener("page:loaded", async (e) => {
  // Always close the overlay menu on navigation (baseline behavior)
  try {
    closeMenu();
  } catch {}

  const page = e.detail?.routeName;

  if (page === "languageinstall") {
    const { initializeLanguageInstall } = await import("./languageinstall.js");
    initializeLanguageInstall?.();
    return;
  }

  if (page === "onboarding") {
    const { initializeOnboarding } = await import("./onboarding.js");
    initializeOnboarding?.();
    return;
  }

  if (page === "interest") {
    const { initializeInterest } = await import("./interest.js");
    initializeInterest?.();
    return;
  }

  if (page === "intro") {
    const { initializeIntro } = await import("./intro.js");
    initializeIntro?.();
    return;
  }

  if (page === "dashboard") {
    const { initializeDashboard } = await import("./dashboard.js");
    initializeDashboard?.();
    return;
  }

  if (page === "eyes") {
    const { initializeEyes } = await import("./eyes.js");
    initializeEyes?.();
    return;
  }

  if (page === "offline") {
    const { initializeOffline } = await import("./offline.js");
    initializeOffline?.();
    return;
  }

  if (routeName === "mylearning") {
    const { initializeMyLearning } = await import("./mylearning.js");
    initializeMyLearning?.();
    return;
  }
});

/**
 * Event listener for 'page:loaded' custom event, specifically for the 'atomsCardPage'.
 * Dynamically imports and initializes the Atoms Card module.
 * @param {CustomEvent} e - The custom 'page:loaded' event.
 */
window.addEventListener("page:loaded", async (e) => {
  const routeName = e?.detail?.routeName;
  if (routeName === "atomscard") {
    const { initializeAtomsCard } = await import("./atomscard.js");
    initializeAtomsCard?.();
  }
});

window.addEventListener("page:loaded", async (e) => {
  const routeName = e?.detail?.routeName;

  if (routeName === "ears") {
    const { initializeEars } = await import("./ears.js");
    initializeEars?.();
  }
});

function initializePupilsMenu() {
  const root = document.getElementById("pupilsPage");
  if (!root || root.dataset.menuWired === "1") return;

  const menuBtn = root.querySelector(".menuBtn");
  if (menuBtn) {
    menuBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await initializeMenu(); // ensure #menuOverlay exists (fetch+append)
        openMenu(); // then show it
      } catch (err) {
        console.error("[pupils] openMenu failed:", err);
      }
    });
    root.dataset.menuWired = "1";
  }
}

document.addEventListener("DOMContentLoaded", initializePupilsMenu);

(function () {
  const IMAGES_BASE = "images/";
  const PREFIX = "car_";
  const EXT = ".webp";

  // Find the Eyes page container (covers a few common IDs), else fall back to document
  const eyesRoot =
    document.getElementById("eyesCatalogPage") ||
    document.getElementById("eyesPage") ||
    document.getElementById("eyes") ||
    document;

  const cards = eyesRoot.querySelectorAll(
    "[data-card-id], [data-key], [data-image-name], .eyes-card, .card",
  );

  function normalizeName(s) {
    return (s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "") // strip spaces, hyphens, etc.
      .trim();
  }

  function deriveNameFromTitle(card) {
    // Try a few common title locations
    const titleEl =
      card.querySelector("[data-title]") ||
      card.querySelector(".card-title") ||
      card.querySelector("h1, h2, h3, h4, h5, h6");

    return titleEl ? titleEl.textContent : "";
  }

  function chosenBaseName(card) {
    // 1) explicit override
    const explicit = card.getAttribute("data-image-name");
    if (explicit) {
      // allow either a raw base like "pupils" or full like "car_pupils.webp"
      const hasPrefix = explicit.startsWith(PREFIX);
      const hasExt = explicit.toLowerCase().endsWith(EXT);
      if (hasPrefix && hasExt) return explicit; // already full filename
      const base = hasPrefix ? explicit.slice(PREFIX.length) : explicit;
      const normalized = normalizeName(
        base.replace(new RegExp(EXT + "$", "i"), ""),
      );
      return PREFIX + normalized + EXT;
    }

    // 2) data-card-id / data-key
    const keyish =
      card.getAttribute("data-card-id") || card.getAttribute("data-key");
    if (keyish) return PREFIX + normalizeName(keyish) + EXT;

    // 3) fallback to visible title text
    const title = deriveNameFromTitle(card);
    return PREFIX + normalizeName(title) + EXT;
  }

  function applyImage(card, filename) {
    const fullPath = IMAGES_BASE + filename;

    // Prefer dedicated <img>
    const imgEl = card.querySelector("[data-card-img], .card-img, img");
    if (imgEl && imgEl.tagName === "IMG") {
      imgEl.setAttribute("src", fullPath);
      imgEl.setAttribute(
        "alt",
        imgEl.getAttribute("alt") ||
          filename.replace(/^car_/, "").replace(/\.webp$/i, ""),
      );
      return;
    }

    // Then a thumbnail div
    const thumbEl = card.querySelector(".card-thumb, [data-thumb]");
    if (thumbEl) {
      thumbEl.style.backgroundImage = `url("${fullPath}")`;
      thumbEl.style.backgroundSize = thumbEl.style.backgroundSize || "cover";
      thumbEl.style.backgroundPosition =
        thumbEl.style.backgroundPosition || "center";
      thumbEl.style.backgroundRepeat = "no-repeat";
      return;
    }

    // Finally, set on the card itself
    card.style.backgroundImage = `url("${fullPath}")`;
    card.style.backgroundSize = card.style.backgroundSize || "cover";
    card.style.backgroundPosition = card.style.backgroundPosition || "center";
    card.style.backgroundRepeat = "no-repeat";
  }

  function processCards() {
    cards.forEach((card) => {
      const filename = chosenBaseName(card);
      // Only touch cards that resolve to a "car_*.webp"
      if (!/^car_[a-z0-9]+\.webp$/i.test(filename)) return;
      applyImage(card, filename);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", processCards);
  } else {
    processCards();
  }
})();
