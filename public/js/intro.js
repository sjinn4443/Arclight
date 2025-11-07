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
    const btn =
      document.getElementById(EXPLORE_BTN_ID) ||
      document.querySelector("#introPage .primary"); // backup selector
    if (btn) btn.addEventListener("click", onExploreClick, { passive: false });
  });
})();
