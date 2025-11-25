/**
 * @fileoverview This file contains intro related functions and logic, handling navigation to the dashboard when either the "See What's New" or "Skip" buttons are clicked.
 */

import { loadPage } from "./navigation.js";

/**
 * Initializes the introduction page.
 * Sets up click listeners for the 'See What's New' and 'Skip' buttons,
 * both of which navigate to the dashboard page.
 */
export function initializeIntro() {
  const seeWhatBtn = document.getElementById("seeWhatBtn");
  const skipBtn = document.getElementById("skipBtn");

  const go = () => loadPage("dashboard"); // pre-split behavior: both go to dashboard

  if (seeWhatBtn) seeWhatBtn.addEventListener("click", go);
  if (skipBtn) skipBtn.addEventListener("click", go);
}

/*Placeholder Page*/
(function () {
  const EXPLORE_BTN_ID = "exploreBtn";
  const TARGET_ID = "introExplorePage";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  async function goToExplore() {
    // Prefer router if available
    if (typeof window.showPage === "function") {
      window.showPage(TARGET_ID);
      return;
    }
    if (typeof window.loadPage === "function") {
      await window.loadPage(TARGET_ID);
      return;
    }

    // Fallback: manual show/hide (no router)
    const target = document.getElementById(TARGET_ID);
    if (!target) return;
    document.querySelectorAll(".page").forEach((el) => {
      if (el === target) {
        el.removeAttribute("hidden");
        // Force visibility even if global CSS sets `.page { display: none; }`
        el.style.display = "block";
      } else {
        el.setAttribute("hidden", "");
        el.style.display = "none";
      }
    });

    // Update helpers
    try {
      window.currentPageName = TARGET_ID;
    } catch (_) {
      void 0;
    }
    try {
      window.historyStack && window.historyStack.push(TARGET_ID);
    } catch (_) {
      void 0;
    }
    try {
      typeof window.updateBottomNavBar === "function" &&
        window.updateBottomNavBar(TARGET_ID);
    } catch (_) {
      void 0;
    }
  }

  function onExploreClick(ev) {
    ev.preventDefault();
    goToExplore();
  }

  ready(() => {
    const arrowRightBtn = document.querySelector(
      "#introPage .intro-arrow-right",
    );

    function isGuestMode() {
      return localStorage.getItem("guestMode") === "true";
    }

    function ensureGuestButtons() {
      const skipBtn = document.getElementById("skipBtn");
      if (!skipBtn) return;

      // If not guest, strip guest UI if it exists
      if (!isGuestMode()) {
        document.getElementById("createAccountBtn")?.remove();
        document.getElementById("continueAsGuestBtn")?.remove();
        document.getElementById(EXPLORE_BTN_ID)?.remove();
        return;
      }

      // Guest mode: remove Explore button if still around
      document.getElementById(EXPLORE_BTN_ID)?.remove();

      // Don’t duplicate if already inserted
      if (document.getElementById("createAccountBtn")) return;

      // Create Account button
      const createBtn = document.createElement("button");
      createBtn.id = "createAccountBtn";
      createBtn.className = "onb-cta intro-primary";
      createBtn.setAttribute("data-i18n", "intro.create_account_button");
      createBtn.textContent = "Create Account";
      createBtn.addEventListener("click", () => {
        // Optional: keep behaviour consistent with onboarding skip-path
        localStorage.setItem("cameFromSkipPath", "true");
        loadPage("onboarding");
      });

      // Continue as Guest button (same as Explore / > arrow)
      const guestBtn = document.createElement("button");
      guestBtn.id = "continueAsGuestBtn";
      guestBtn.className = "btn-outline intro-outline";
      guestBtn.setAttribute("data-i18n", "intro.continue_as_guest_button");
      guestBtn.textContent = "Continue as Guest";
      guestBtn.addEventListener("click", onExploreClick, { passive: false });

      // Insert both where Explore used to be (before skipBtn)
      skipBtn.parentNode.insertBefore(createBtn, skipBtn);
      skipBtn.parentNode.insertBefore(guestBtn, skipBtn);
    }

    // Run on load
    ensureGuestButtons();

    // Also re-run whenever intro page is shown via router/showPage
    document.addEventListener("page:shown", (e) => {
      if (e?.detail?.id === "introPage") ensureGuestButtons();
    });

    // Keep > arrow behaviour
    if (arrowRightBtn) {
      arrowRightBtn.addEventListener("click", onExploreClick, {
        passive: false,
      });
    }
  });
})();
