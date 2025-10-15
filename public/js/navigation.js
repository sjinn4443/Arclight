/**
 * @fileoverview This file handles client-side page navigation, including loading HTML fragments, managing browser history, and dispatching custom events for page transitions.
 */

import { ROUTES } from "./config.js";
import { closeMenu } from "./menu.js";

// === Guest Mode Guard ===
const MAX_GUEST_CLICKS = 10;

// Identify guest mode
function isGuestMode() {
  return localStorage.getItem("guestMode") === "true";
}

function getGuestClicks() {
  const n = parseInt(localStorage.getItem("guestClicks") || "0", 10);
  return Number.isFinite(n) ? n : 0;
}

function setGuestClicks(n) {
  localStorage.setItem("guestClicks", String(n));
}

// When a guest tries to do something after cap, show modal
function ensureGuestModal() {
  // Prevent duplicates
  if (document.getElementById("guestGateModal")) return;

  const modal = document.createElement("div");
  modal.id = "guestGateModal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  modal.innerHTML = `
    <div class="guest-modal">
      <button id="guestModalClose" class="guest-modal__close" aria-label="Close">&times;</button>
      <h2 class="guest-modal__title">Enjoying Arclight?</h2>
      <p class="guest-modal__text">
        You’ve reached the end of guest access.<br> 
        Create a free account to keep exploring all features without limits.
      </p>
      <button id="guestSignupBtn" class="guest-modal__cta btn-primary">
        Create Account
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  // Cache elements
  const signupBtn = modal.querySelector("#guestSignupBtn");
  const closeBtn = modal.querySelector("#guestModalClose");

  // === CREATE ACCOUNT ===
  signupBtn?.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      // Reset/mark guest path states
      localStorage.setItem("guestMode", "false");
      localStorage.removeItem("guestClicks");
      localStorage.setItem("cameFromSkipPath", "true");

      // Close modal visually
      modal.classList.add("fade-out");
      setTimeout(async () => {
        modal.remove();

        // Navigate directly to onboarding using the local function
        await loadPage("onboarding");
      }, 250);
    } catch (err) {
      console.error("Navigation to onboarding failed:", err);
    }
  });

  // === CLOSE MODAL (X button) ===
  closeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("fade-out");
    setTimeout(() => modal.remove(), 250);
  });
}

// Increment the guest click count; returns true if allowed, false if blocked
function guestClickAllowed() {
  if (!isGuestMode()) return true;

  const current = getGuestClicks();
  if (current >= MAX_GUEST_CLICKS) {
    ensureGuestModal();
    return false;
  }
  setGuestClicks(current + 1);
  return true;
}

// Decide which UI interactions count as a "click"
function isCountableClick(target) {
  if (!target) return false;

  // Never count (or block) clicks inside the guest modal itself
  if (target.closest("#guestGateModal")) return false;

  // If developer explicitly marks an element as free for guests
  // (e.g., onboarding, language install, Help, etc.), don't count it
  if (target.closest("[data-guest-free='true']")) return false;

  // Count clicks on buttons, links, cards, and any element with data-track
  if (
    target.closest(
      "button, a, .card, [role='button'], [data-track], [data-clickable]"
    )
  ) {
    return true;
  }
  return false;
}

// Block action if over cap (capture phase to stop early)
document.addEventListener(
  "click",
  (e) => {
    if (!isGuestMode()) return;

    const t = e.target;
    if (!isCountableClick(t)) return;

    // If over cap, prevent the action and show modal
    const current = getGuestClicks();
    if (current >= MAX_GUEST_CLICKS) {
      e.preventDefault();
      e.stopPropagation();
      ensureGuestModal();
      return;
    }

    // Otherwise, increment and allow
    setGuestClicks(current + 1);
  },
  true // capture
);

// === Feature Gating: disable anything marked with data-requires-auth ===
function applyGuestFeatureGating(root = document) {
  if (!isGuestMode()) return;
  const gated = root.querySelectorAll("[data-requires-auth]");
  gated.forEach((el) => {
    el.setAttribute("aria-disabled", "true");
    el.setAttribute("tabindex", "-1");
    // Visual treatment
    el.style.pointerEvents = "none";
    el.style.opacity = "0.5";
    el.style.filter = "grayscale(40%)";
    // Optional: add a tooltip-like title
    if (!el.getAttribute("title")) {
      el.setAttribute("title", "Sign up to use this feature");
    }
  });
}

// Run gating whenever a page shows
document.addEventListener("page:shown", (e) => {
  applyGuestFeatureGating(document);
});

// Also run once on initial load (if the app bootstraps without dispatching)
if (document.readyState !== "loading") {
  applyGuestFeatureGating(document);
} else {
  document.addEventListener("DOMContentLoaded", () =>
    applyGuestFeatureGating(document)
  );
}

// Routes where the top-left back button should be hidden
const EXCLUDED_BACK_ROUTES = [
  "splashscreen",
  "languageinstall",
  "onboarding",
  "interest",
  "intro",
  "dashboard",
];

function updateGlobalBackVisibility(routeName) {
  const btn = document.getElementById("backBtnGlobal");
  if (!btn) return;
  // Show on all pages except the excluded ones
  btn.style.display = EXCLUDED_BACK_ROUTES.includes(routeName)
    ? "none"
    : "flex";
}

// Keep the back button visible only on allowed routes
window.addEventListener("page:loaded", (e) => {
  const routeName = e?.detail?.routeName;
  updateGlobalBackVisibility(routeName);
});

/**
 * A minimal page display function that hides all elements with the class 'page'
 * and then displays the element with the given ID.
 * Also attempts to update a bottom navigation bar if `window.updateBottomNavBar` is defined.
 * @param {string} id - The ID of the page element to display.
 */
function minimalShowPage(id) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((p) => (p.style.display = "none"));
  const target = document.getElementById(id);
  if (target) target.style.display = "";
}

(function () {
  if (window.__pageShownPatched) return;
  const orig = window.showPage;
  if (typeof orig === "function") {
    window.showPage = function (id) {
      const res = orig.apply(this, arguments);
      document.dispatchEvent(new CustomEvent("page:shown", { detail: { id } }));
      return res;
    };
    window.__pageShownPatched = true;
  }
})();

/**
 * Handles click events on elements with a 'data-page' attribute,
 * triggering page navigation to the specified target ID.
 * @param {Event} e - The click event object.
 */
function handleNavClick(e) {
  const el = e.target.closest("[data-page]");
  if (!el) return;

  e.preventDefault();
  const targetId = el.getAttribute("data-page");
  if (!targetId) return;

  if (typeof window.showPage === "function") {
    window.showPage(targetId); // baseline behavior
  } else {
    minimalShowPage(targetId); // safe fallback
  }
}

/**
 * Wires up global navigation by adding a click event listener to the document
 * to handle elements with 'data-page' attributes.
 * This function is exported so `main.js` can wire it up.
 */
export function wireGlobalNavigation() {
  document.removeEventListener("click", handleNavClick, false);
  document.addEventListener("click", handleNavClick, false);
}

document.addEventListener("DOMContentLoaded", () => {
  wireGlobalNavigation();
});

export let currentPageName = null;
export const historyStack = [];

/**
 * Loads a new page fragment into the '#page-content' container based on the given route name.
 * Manages history, closes the menu, and dispatches a 'page:loaded' custom event.
 * @param {string} routeName - The name of the route to load (key in ROUTES object).
 * @param {Object} [options={}] - Options for page loading, e.g., `{ replace: true }` for history replacement.
 */
export async function loadPage(routeName, options = {}) {
  const container = document.getElementById("page-content");
  const url = ROUTES[routeName];

  // Set currentPageName early. This ensures it's always set when loadPage is called,
  // even if the route is not found or fetch fails. This helps with tests that check currentPageName.
  currentPageName = routeName;

  if (!container) {
    console.error("#page-content not found");
    // Dispatch events even for errors to signal completion of the attempt.
    window.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName, error: true } })
    );
    window.dispatchEvent(
      new CustomEvent("page:rendered", { detail: { routeName, error: true } })
    );
    return;
  }
  if (!url) {
    console.error(`Route "${routeName}" not found in ROUTES.`);
    container.innerHTML = `<div class="container"><p>Page not found: ${routeName}</p></div>`;
    // Dispatch events even for errors to signal completion of the attempt.
    window.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName, error: true } })
    );
    window.dispatchEvent(
      new CustomEvent("page:rendered", { detail: { routeName, error: true } })
    );
    return;
  }

  // Load the page fragment
  let html = "";
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      // Check for HTTP errors
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    html = await res.text();
  } catch (err) {
    console.error("Failed to load route", routeName, url, err);
    container.innerHTML = `<div class="container"><p>Failed to load page: ${routeName}</p></div>`;
    // Dispatch events even for fetch errors.
    window.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName, error: true } })
    );
    window.dispatchEvent(
      new CustomEvent("page:rendered", { detail: { routeName, error: true } })
    );
    return;
  }

  // Inject the fetched HTML
  container.innerHTML = html;

  try {
    closeMenu();
  } catch {}

  // Debug (optional)
  console.log("[router] loaded route:", routeName, "bytes=", html.length);
  console.log(
    "[router] .page count:",
    container.querySelectorAll(".page").length
  );

  // 🔑 Make something visible
  // Ensure the loaded content is wrapped in a .page element if it's not already.
  // This helps standardize the DOM structure for subsequent operations.
  let pageElement = container.querySelector(".page");
  if (!pageElement) {
    // If no .page element exists, create one and append the existing content to it.
    const wrapper = document.createElement("div");
    wrapper.className = "page"; // Add the base 'page' class
    while (container.firstChild) {
      wrapper.appendChild(container.firstChild);
    }
    container.appendChild(wrapper);
    pageElement = wrapper; // The new wrapper is now our page element
    console.warn(
      "[router] No .page found; wrapped content in a new .page element."
    );
  }

  // Apply the 'active' class to the first .page element found or the newly created wrapper.
  // Prioritize elements with data-default="true".
  const defaultActive = pageElement.querySelector('[data-default="true"]');
  if (defaultActive) {
    defaultActive.classList.add("active");
  } else {
    pageElement.classList.add("active"); // Apply active class to the main page element
  }

  // Basic history management
  if (!options.replace) {
    historyStack.push(routeName);
  } else {
    // If replacing, ensure the current entry is removed before pushing the new one
    // This is crucial for correct back navigation.
    if (historyStack.length > 0) {
      historyStack.pop();
    }
    historyStack.push(routeName);
  }

  currentPageName = routeName; // Ensure currentPageName is set after successful load

  // Notify initializers
  window.dispatchEvent(
    new CustomEvent("page:loaded", { detail: { routeName } })
  );

  // Notify that the page has been rendered and is ready for translations
  window.dispatchEvent(
    new CustomEvent("page:rendered", { detail: { routeName } })
  );

  // Toggle fixed UI (optional)
  const searchContainer = document.getElementById("fixedSearchContainer");
  if (searchContainer) {
    searchContainer.style.display = ["dashboard", "earsDashboard"].includes(
      routeName
    )
      ? "block"
      : "none";
  }
}

/**
 * Navigates back in the application's history stack.
 * If there's a previous page, it loads it; otherwise, it defaults to the dashboard.
 */
export function goBack() {
  // Special-case: if we're on videos and pupilsPage is active, prefer explicit return route
  if (currentPageName === "videos") {
    try {
      const ret = sessionStorage.getItem("fromRoute");
      if (ret) {
        sessionStorage.removeItem("fromRoute");
        loadPage(ret, { replace: true });
        return;
      }
    } catch (e) {
      /* fall through */
    }
  }
  // Default stack-based behavior
  historyStack.pop(); // current
  let prev = historyStack.pop(); // previous

  // Ensure 'prev' is a valid route name before calling loadPage
  // If 'prev' is null/undefined, default to 'dashboard'
  const routeToLoad = prev || "dashboard";

  loadPage(routeToLoad, { replace: true });
}

/**
 * Initializes page navigation by setting up a global click listener for elements
 * with 'data-route' attributes and an event listener for a global back button.
 */
export function initializePageNavigation() {
  window.addEventListener("click", (e) => {
    const el = e.target.closest?.("[data-route]");
    if (!el) return;
    const route = el.getAttribute("data-route");
    if (route) {
      e.preventDefault();
      loadPage(route);
    }
  });

  const backBtn = document.getElementById("backBtnGlobal");
  backBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    goBack();
  });
}

(function () {
  const TARGET_ID = "directOphthalmoscopyQuizPage";

  async function goToDirectOphthalmoscopyQuiz() {
    const show = (id) => {
      if (typeof window.showPage === "function") return window.showPage(id);
      if (typeof window.minimalShowPage === "function")
        return window.minimalShowPage(id);
      console.warn("No showPage() available");
    };

    // If the quiz section is already in the DOM, just show it.
    if (document.getElementById(TARGET_ID)) return show(TARGET_ID);

    // Otherwise load the quizzes fragment, then show the target section.
    if (typeof window.loadPage === "function") {
      await loadPage("quizzes");
      return show(TARGET_ID);
    } else {
      console.warn("loadPage() not found; cannot navigate to quizzes");
    }
  }

  // Bind to the Take Quiz button (supports either id or data-action)
  document.addEventListener(
    "click",
    function (e) {
      const btn = e.target.closest('#quizBtn, [data-action="take-quiz"]');
      if (!btn) return;
      e.preventDefault();
      goToDirectOphthalmoscopyQuiz();
    },
    true
  );

  // Also expose a global for manual triggering / compatibility with old.zip
  window.launchQuiz = () => goToDirectOphthalmoscopyQuiz();
})();
