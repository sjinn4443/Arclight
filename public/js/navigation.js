/**
 * @fileoverview This file handles client-side page navigation, including loading HTML fragments, managing browser history, and dispatching custom events for page transitions.
 */

import { ROUTES } from "./config.js";
import { closeMenu } from "./menu.js";

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
const historyStack = [];

/**
 * Loads a new page fragment into the '#page-content' container based on the given route name.
 * Manages history, closes the menu, and dispatches a 'page:loaded' custom event.
 * @param {string} routeName - The name of the route to load (key in ROUTES object).
 * @param {Object} [options={}] - Options for page loading, e.g., `{ replace: true }` for history replacement.
 */
export async function loadPage(routeName, options = {}) {
  const container = document.getElementById("page-content");
  const url = ROUTES[routeName];

  if (!container) {
    console.error("#page-content not found");
    return;
  }
  if (!url) {
    container.innerHTML = `<div class="container"><p>Page not found: ${routeName}</p></div>`;
    return;
  }

  // Load the page fragment
  let html = "";
  try {
    const res = await fetch(url, { cache: "no-store" });
    html = await res.text();
  } catch (err) {
    console.error("Failed to load route", routeName, err);
    container.innerHTML = `<div class="container"><p>Failed to load page: ${routeName}</p></div>`;
    return;
  }

  // Inject
  container.innerHTML = html;
  currentPageName = routeName;

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
  const firstActive =
    container.querySelector('.page[data-default="true"]') ||
    container.querySelector(".page");
  if (firstActive) {
    firstActive.classList.add("active");
  } else {
    // Fallback: ensure something is visible even if fragment lacks .page
    const wrapper = document.createElement("div");
    wrapper.className = "page active";
    while (container.firstChild) wrapper.appendChild(container.firstChild);
    container.appendChild(wrapper);
    console.warn("[router] No .page found; wrapped content in .page.active");
  }

  // Basic history
  if (!options.replace) historyStack.push(routeName);

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
  const prev = historyStack.pop(); // previous
  if (prev) loadPage(prev, { replace: true });
  else loadPage("dashboard", { replace: true });
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
