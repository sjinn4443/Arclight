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

  const modalTemplate = document.getElementById("guestGateModalTemplate");
  if (!modalTemplate) return;

  const modal = modalTemplate.content
    .querySelector("#guestGateModal")
    ?.cloneNode(true);
  if (!modal) return;

  document.body.appendChild(modal);
  try {
    window.I18N?.applyTranslations?.(modal);
  } catch {
    void 0;
  }

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
      "button, a, .card, [role='button'], [data-track], [data-clickable]",
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
  true, // capture
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
document.addEventListener("page:shown", () => {
  applyGuestFeatureGating(document);
});

// Also run once on initial load (if the app bootstraps without dispatching)
if (document.readyState !== "loading") {
  applyGuestFeatureGating(document);
} else {
  document.addEventListener("DOMContentLoaded", () =>
    applyGuestFeatureGating(document),
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
window.addEventListener("page:loaded", (_e) => {
  const routeName = _e?.detail?.routeName;
  document.body?.removeAttribute("data-interactive-subapp-open");
  updateGlobalBackVisibility(routeName);
});

function hydrateLazyIframes(root) {
  root?.querySelectorAll?.("iframe[data-src]").forEach((iframe) => {
    if (!iframe.getAttribute("src")) {
      iframe.setAttribute("src", iframe.getAttribute("data-src"));
    }
    wireInteractiveSubappFrame(iframe);
  });
}

function syncInteractiveSubappOpenState(target) {
  if (!document.body) return;
  const isInteractiveSubapp =
    target?.classList?.contains("interactive-subapp-page") === true;

  if (isInteractiveSubapp) {
    document.body.setAttribute("data-interactive-subapp-open", "true");
  } else {
    document.body.removeAttribute("data-interactive-subapp-open");
  }
}

function getInteractiveSubappChromeMetrics(iframe) {
  const viewportWidth = window.innerWidth || 0;
  const iframeRect = iframe?.getBoundingClientRect?.() || {
    left: 0,
    right: viewportWidth,
    width: viewportWidth,
  };
  const pageRect = iframe?.closest?.(".page")?.getBoundingClientRect?.() || {
    left: 0,
  };
  const isDesktop = viewportWidth >= 1024;
  const desktopInset = isDesktop
    ? (viewportWidth >= 1440 ? viewportWidth * 0.22 : viewportWidth * 0.07) - 4
    : 0;
  const desiredBackLeft = isDesktop ? pageRect.left + desktopInset + 10 : 12;
  const desiredMenuRight = isDesktop
    ? viewportWidth - (desktopInset + 20)
    : viewportWidth - 12;
  const leftInset = Math.max(12, desiredBackLeft - iframeRect.left);
  const rightInset = Math.max(12, iframeRect.right - desiredMenuRight);
  const controlSize = isDesktop ? 36 : 44;
  const globalBackBtn = document.getElementById("backBtnGlobal");
  const globalBackIconStyle = globalBackBtn
    ? getComputedStyle(globalBackBtn, "::before")
    : null;
  const standardMenuBtn =
    document.querySelector("#interactiveLearningPage .eyes-topbar .menuBtn") ||
    document.querySelector("#videos .page .eyes-topbar .menuBtn") ||
    document.querySelector(".eyes-topbar .menuBtn, .eyes-top .menuBtn");
  const standardMenuStyle = standardMenuBtn
    ? getComputedStyle(standardMenuBtn)
    : null;

  return {
    topbarHeight: isDesktop ? "62px" : "58px",
    leftInset: `${Math.round(leftInset)}px`,
    rightInset: `${Math.round(rightInset)}px`,
    controlSize: `${controlSize}px`,
    backIcon: {
      width: globalBackIconStyle?.width || (isDesktop ? "33px" : "24px"),
      height: globalBackIconStyle?.height || (isDesktop ? "33px" : "24px"),
      webkitMaskImage:
        globalBackIconStyle?.webkitMaskImage &&
        globalBackIconStyle.webkitMaskImage !== "none"
          ? globalBackIconStyle.webkitMaskImage
          : INTERACTIVE_SUBAPP_BACK_MASK,
      webkitMaskPosition: globalBackIconStyle?.webkitMaskPosition || "center",
      webkitMaskSize: globalBackIconStyle?.webkitMaskSize || "contain",
      webkitMaskRepeat: globalBackIconStyle?.webkitMaskRepeat || "no-repeat",
      maskImage:
        globalBackIconStyle?.maskImage &&
        globalBackIconStyle.maskImage !== "none"
          ? globalBackIconStyle.maskImage
          : INTERACTIVE_SUBAPP_BACK_MASK,
      maskPosition: globalBackIconStyle?.maskPosition || "center",
      maskSize: globalBackIconStyle?.maskSize || "contain",
      maskRepeat: globalBackIconStyle?.maskRepeat || "no-repeat",
    },
    menuGlyph: standardMenuBtn?.textContent?.trim() || "\u2630",
    menuFont: {
      family: standardMenuStyle?.fontFamily || "Arial, sans-serif",
      size: standardMenuStyle?.fontSize || (isDesktop ? "20px" : "25px"),
      weight: standardMenuStyle?.fontWeight || "400",
      lineHeight: standardMenuStyle?.lineHeight || "1",
      letterSpacing: standardMenuStyle?.letterSpacing || "normal",
    },
    gap: "8px",
  };
}

const INTERACTIVE_SUBAPP_BACK_MASK =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23000' d='M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z'/></svg>\")";

function injectInteractiveSubappChrome(iframe) {
  let doc = null;
  try {
    doc = iframe.contentDocument;
  } catch {
    return;
  }
  if (!doc?.documentElement || !doc.body) return;

  const appBar =
    doc.querySelector(".app-bar, #appBar") ||
    doc.getElementById("burger-icon")?.closest("header");
  if (!appBar) return;

  const applyStyles = (element, styles) => {
    if (!element) return;
    Object.entries(styles).forEach(([property, value]) => {
      element.style.setProperty(property, value, "important");
    });
  };

  doc.documentElement.classList.add("arclight-embedded-subapp");
  doc.body.classList.add("arclight-embedded-subapp");

  let style = doc.getElementById("arclightEmbeddedSubappChromeStyle");
  if (!style) {
    style = doc.createElement("style");
    style.id = "arclightEmbeddedSubappChromeStyle";
    style.textContent = `
      html.arclight-embedded-subapp,
      body.arclight-embedded-subapp {
        margin: 0 !important;
      }

      .app-bar {
        position: sticky !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        z-index: 1000 !important;
        display: grid !important;
        grid-template-columns: var(--arclight-embedded-control-size, 36px) minmax(0, 1fr) auto !important;
        grid-template-rows: 1fr !important;
        align-items: center !important;
        height: var(--arclight-embedded-topbar-height, 62px) !important;
        min-height: var(--arclight-embedded-topbar-height, 62px) !important;
        padding: 0 var(--arclight-embedded-right-inset, 20px) 0 var(--arclight-embedded-left-inset, 20px) !important;
        box-sizing: border-box !important;
      }

      .app-bar h1 {
        grid-column: 2 !important;
        justify-self: center !important;
        min-width: 0 !important;
        margin: 0 !important;
        text-align: center !important;
      }

      .arclight-embedded-back,
      .app-bar .icon-button {
        position: static !important;
      }

      .arclight-embedded-back {
        grid-column: 1 !important;
        grid-row: 1 !important;
        justify-self: start !important;
        appearance: none !important;
        border: 0 !important;
        background: transparent !important;
        color: var(--arclight-embedded-control-color, currentColor) !important;
        font: inherit !important;
        font-size: 0 !important;
        line-height: 0 !important;
        cursor: pointer !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      .arclight-embedded-actions {
        grid-column: 3 !important;
        grid-row: 1 !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: var(--arclight-embedded-action-gap, 8px) !important;
        justify-self: end !important;
        align-self: center !important;
        width: auto !important;
        height: auto !important;
      }

      .arclight-embedded-actions #info-icon {
        order: 1 !important;
      }

      .arclight-embedded-actions [data-arclight-embedded-menu-button="true"] {
        order: 2 !important;
      }

      .arclight-embedded-actions #info-icon,
      .arclight-embedded-actions [data-arclight-embedded-menu-button="true"] {
        position: static !important;
        inset: auto !important;
        grid-column: auto !important;
        grid-row: auto !important;
        justify-self: center !important;
        align-self: center !important;
        flex: 0 0 var(--arclight-embedded-control-size, 36px) !important;
        width: var(--arclight-embedded-control-size, 36px) !important;
        height: var(--arclight-embedded-control-size, 36px) !important;
        margin: 0 !important;
        transform: none !important;
      }

      .arclight-embedded-actions [data-arclight-embedded-menu-button="true"] {
        appearance: none !important;
        border: 0 !important;
        background: transparent !important;
        color: var(--arclight-embedded-control-color, currentColor) !important;
        font-size: 0 !important;
        line-height: 0 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        overflow: hidden !important;
      }

      .arclight-embedded-actions [data-arclight-embedded-menu-button="true"] > :not(.arclight-embedded-menu-icon) {
        display: none !important;
      }
    `;
    doc.head?.appendChild(style);
  }

  let backBtn = doc.getElementById("arclightEmbeddedBackButton");
  if (!backBtn) {
    backBtn = doc.createElement("button");
    backBtn.id = "arclightEmbeddedBackButton";
    backBtn.className = "icon-button arclight-embedded-back";
    backBtn.type = "button";
    backBtn.textContent = "";
    backBtn.setAttribute("aria-label", "Back");
    backBtn.setAttribute("data-i18n", "i18nLiteral.Back:aria-label");
    backBtn.addEventListener("click", (event) => {
      event.preventDefault();
      if (goToStoredInteractiveLearningReturn()) return;
      loadPage("videos", {
        replace: true,
        force: currentRoute === "videos",
        recordHistory: false,
        subPageId: "interactiveLearningPage",
      });
    });
    appBar.insertBefore(backBtn, appBar.firstChild);
  }

  let backIcon = backBtn.querySelector(":scope > .arclight-embedded-back-icon");
  if (!backIcon) {
    backIcon = doc.createElement("span");
    backIcon.className = "arclight-embedded-back-icon";
    backIcon.setAttribute("aria-hidden", "true");
    backBtn.appendChild(backIcon);
  }

  let actions = appBar.querySelector(".arclight-embedded-actions");
  if (!actions) {
    actions = doc.createElement("div");
    actions.className = "arclight-embedded-actions";
    appBar.appendChild(actions);
  }

  const infoIcon = doc.getElementById("info-icon");
  const burgerIcon =
    doc.getElementById("burger-icon") ||
    doc.getElementById("sidebar-toggle") ||
    appBar.querySelector(
      '[aria-label="Open menu"], [aria-label="Open MCQ menu"], .appbar-button-left',
    );
  burgerIcon?.setAttribute("data-arclight-embedded-menu-button", "true");
  if (infoIcon && infoIcon.parentElement !== actions) {
    actions.appendChild(infoIcon);
  }
  if (burgerIcon && burgerIcon.parentElement !== actions) {
    actions.appendChild(burgerIcon);
  }

  const metrics = getInteractiveSubappChromeMetrics(iframe);
  let menuIcon = null;
  if (burgerIcon) {
    menuIcon = burgerIcon.querySelector(
      ":scope > .arclight-embedded-menu-icon",
    );
    if (!menuIcon) {
      menuIcon = doc.createElement("span");
      menuIcon.className = "arclight-embedded-menu-icon";
      menuIcon.setAttribute("aria-hidden", "true");
      burgerIcon.appendChild(menuIcon);
    }
    menuIcon.textContent = metrics.menuGlyph;
    Array.from(burgerIcon.children).forEach((child) => {
      if (child !== menuIcon) {
        child.style.setProperty("display", "none", "important");
      }
    });
  }

  const titleEl = appBar.querySelector("h1");
  const controlColorSource = burgerIcon || infoIcon || appBar;
  const controlColor =
    doc.defaultView?.getComputedStyle?.(controlColorSource)?.color ||
    "currentColor";

  doc.documentElement.style.setProperty(
    "--arclight-embedded-topbar-height",
    metrics.topbarHeight,
  );
  doc.documentElement.style.setProperty(
    "--arclight-embedded-left-inset",
    metrics.leftInset,
  );
  doc.documentElement.style.setProperty(
    "--arclight-embedded-right-inset",
    metrics.rightInset,
  );
  doc.documentElement.style.setProperty(
    "--arclight-embedded-control-size",
    metrics.controlSize,
  );
  doc.documentElement.style.setProperty(
    "--arclight-embedded-action-gap",
    metrics.gap,
  );
  doc.documentElement.style.setProperty(
    "--arclight-embedded-control-color",
    controlColor,
  );

  applyStyles(doc.documentElement, {
    margin: "0",
    padding: "0",
  });

  applyStyles(doc.body, {
    margin: "0",
    padding: "0",
    "padding-top": "0",
  });

  applyStyles(appBar, {
    position: "sticky",
    top: "0",
    left: "0",
    right: "0",
    width: "100%",
    "z-index": "1000",
    display: "grid",
    "grid-template-columns": `${metrics.controlSize} minmax(0, 1fr) auto`,
    "grid-template-rows": "1fr",
    "align-items": "center",
    height: metrics.topbarHeight,
    "min-height": metrics.topbarHeight,
    padding: `0 ${metrics.rightInset} 0 ${metrics.leftInset}`,
    "box-sizing": "border-box",
  });

  applyStyles(titleEl, {
    "grid-column": "2",
    "grid-row": "1",
    "justify-self": "center",
    "min-width": "0",
    margin: "0",
    "text-align": "center",
  });

  applyStyles(backBtn, {
    position: "static",
    inset: "auto",
    "grid-column": "1",
    "grid-row": "1",
    "justify-self": "start",
    appearance: "none",
    border: "0",
    background: "transparent",
    color: controlColor,
    cursor: "pointer",
    display: "inline-flex",
    "align-items": "center",
    "justify-content": "center",
    "font-size": "0",
    "line-height": "0",
    width: metrics.controlSize,
    height: metrics.controlSize,
    margin: "0",
    padding: "0",
    transform: "none",
  });

  applyStyles(backIcon, {
    display: "block",
    width: metrics.backIcon.width,
    height: metrics.backIcon.height,
    background: "currentColor",
    "-webkit-mask-image": metrics.backIcon.webkitMaskImage,
    "-webkit-mask-position": metrics.backIcon.webkitMaskPosition,
    "-webkit-mask-size": metrics.backIcon.webkitMaskSize,
    "-webkit-mask-repeat": metrics.backIcon.webkitMaskRepeat,
    "mask-image": metrics.backIcon.maskImage,
    "mask-position": metrics.backIcon.maskPosition,
    "mask-size": metrics.backIcon.maskSize,
    "mask-repeat": metrics.backIcon.maskRepeat,
  });

  applyStyles(actions, {
    "grid-column": "3",
    "grid-row": "1",
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    "justify-content": "flex-end",
    gap: metrics.gap,
    "justify-self": "end",
    "align-self": "center",
    width: "auto",
    height: "auto",
  });

  applyStyles(infoIcon, {
    order: "1",
    position: "static",
    inset: "auto",
    "grid-column": "auto",
    "grid-row": "auto",
    "justify-self": "center",
    "align-self": "center",
    flex: `0 0 ${metrics.controlSize}`,
    width: metrics.controlSize,
    height: metrics.controlSize,
    margin: "0",
    transform: "none",
  });

  applyStyles(burgerIcon, {
    order: "2",
    position: "static",
    inset: "auto",
    "grid-column": "auto",
    "grid-row": "auto",
    "justify-self": "center",
    "align-self": "center",
    flex: `0 0 ${metrics.controlSize}`,
    width: metrics.controlSize,
    height: metrics.controlSize,
    margin: "0",
    transform: "none",
    appearance: "none",
    border: "0",
    background: "transparent",
    color: controlColor,
    "font-size": "0",
    "line-height": "0",
    overflow: "hidden",
  });

  applyStyles(menuIcon, {
    display: "inline-block",
    width: "auto",
    height: "auto",
    background: "transparent",
    color: "currentColor",
    "font-family": metrics.menuFont.family,
    "font-size": metrics.menuFont.size,
    "font-weight": metrics.menuFont.weight,
    "line-height": metrics.menuFont.lineHeight,
    "letter-spacing": metrics.menuFont.letterSpacing,
    "-webkit-mask": "none",
    mask: "none",
  });
}

function wireInteractiveSubappFrame(iframe) {
  if (!iframe?.closest?.(".interactive-subapp-container")) return;

  if (iframe.dataset.interactiveSubappChromeWired !== "1") {
    iframe.dataset.interactiveSubappChromeWired = "1";
    iframe.addEventListener("load", () =>
      injectInteractiveSubappChrome(iframe),
    );
  }

  injectInteractiveSubappChrome(iframe);
}

/**
 * A minimal page display function that hides all elements with the class 'page'
 * and then displays the element with the given ID.
 * Also attempts to update a bottom navigation bar if `window.updateBottomNavBar` is defined.
 * @param {string} id - The ID of the page element to display.
 */
function minimalShowPage(id) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((p) => {
    p.classList.remove("active");
    p.style.display = "none";
  });
  const target = document.getElementById(id);
  if (!target) return;
  target.classList.add("active");
  target.style.display = "block";
  hydrateLazyIframes(target);
  syncInteractiveSubappOpenState(target);
}

// Expose minimalShowPage globally for legacy/inline usage
window.minimalShowPage = window.minimalShowPage || minimalShowPage;

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

document.addEventListener("page:shown", (event) => {
  const shownId = String(event.detail?.id || "");
  if (!shownId) return;
  const target = document.getElementById(shownId);
  hydrateLazyIframes(target);
  syncInteractiveSubappOpenState(target);
  recordShownSubPage(shownId);
});

/**
 * Handles click events on elements with a 'data-page' attribute,
 * triggering page navigation to the specified target ID.
 * @param {Event} e - The click event object.
 */
function handleNavClick(e) {
  const el = e.target.closest("[data-page]");
  if (!el) return;

  const targetId = el.getAttribute("data-page");
  if (!targetId) return;
  if (targetId === "videos" && el.id === "videos") return;

  e.preventDefault();

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
const pageHistoryStack = [];
const MY_LEARNING_RETURN_KEY = "myLearningReturnTarget";
const INTERACTIVE_LEARNING_RETURN_KEY = "interactiveLearning:returnTarget";
const MEDICAL_STUDENTS_RAPD_RETURN_KEY = "medicalStudentsWorkshop:rapdReturn";
const PROFILE_RETURN_KEY = "profileReturnTarget";

let currentRoute = null; // Add the currentRoute guard
let isWritingRouteHash = false;
let isApplyingBackNavigation = false;
let lastRouteHistoryRecord = null;
const HASH_ROUTE_PREFIX = "#/";

function safeDecodeHashSegment(value) {
  const raw = String(value ?? "");
  if (!raw) return "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function normalizeRouteName(value) {
  const routeName = String(value ?? "").trim();
  if (!routeName) return null;
  return Object.prototype.hasOwnProperty.call(ROUTES, routeName)
    ? routeName
    : null;
}

function normalizeSubPageId(value) {
  const subPageId = String(value ?? "").trim();
  return subPageId || null;
}

function samePageHistoryEntry(a, b) {
  return (
    a?.routeName === b?.routeName &&
    normalizeSubPageId(a?.subPageId) === normalizeSubPageId(b?.subPageId)
  );
}

function updateRouteHistory(routeName, replace) {
  if (!routeName) return;

  if (replace && historyStack.length > 0) {
    historyStack[historyStack.length - 1] = routeName;
    if (
      historyStack.length > 1 &&
      historyStack[historyStack.length - 2] === routeName
    ) {
      historyStack.pop();
    }
    return;
  }

  if (historyStack[historyStack.length - 1] !== routeName) {
    historyStack.push(routeName);
  }
}

function updatePageHistory(routeName, subPageId = null, replace = false) {
  const normalizedRoute = normalizeRouteName(routeName);
  if (!normalizedRoute) return;

  const entry = {
    routeName: normalizedRoute,
    subPageId: normalizeSubPageId(subPageId),
  };

  if (replace && pageHistoryStack.length > 0) {
    pageHistoryStack[pageHistoryStack.length - 1] = entry;
    if (
      pageHistoryStack.length > 1 &&
      samePageHistoryEntry(pageHistoryStack[pageHistoryStack.length - 2], entry)
    ) {
      pageHistoryStack.pop();
    }
    return;
  }

  if (
    !samePageHistoryEntry(pageHistoryStack[pageHistoryStack.length - 1], entry)
  ) {
    pageHistoryStack.push(entry);
  }
}

function removePageHistoryEntry(entry) {
  if (!entry?.routeName) return;
  const normalizedEntry = {
    routeName: normalizeRouteName(entry.routeName),
    subPageId: normalizeSubPageId(entry.subPageId),
  };
  if (!normalizedEntry.routeName) return;

  for (let i = pageHistoryStack.length - 1; i >= 0; i -= 1) {
    if (samePageHistoryEntry(pageHistoryStack[i], normalizedEntry)) {
      pageHistoryStack.splice(i, 1);
      return;
    }
  }
}

function rememberMyLearningReturnTarget(nextRouteName) {
  if (normalizeRouteName(nextRouteName) !== "mylearning") return;

  const routeName = normalizeRouteName(currentPageName || currentRoute);
  if (!routeName || routeName === "mylearning") return;

  const activeSubPageId = getActivePageId();
  const subPageId =
    activeSubPageId && activeSubPageId !== "likedPage" ? activeSubPageId : null;

  try {
    sessionStorage.setItem(
      MY_LEARNING_RETURN_KEY,
      JSON.stringify({ routeName, subPageId }),
    );
  } catch {
    void 0;
  }
}

function rememberProfileReturnTarget(nextRouteName) {
  if (normalizeRouteName(nextRouteName) !== "myprofile") return;

  const routeName = normalizeRouteName(currentPageName || currentRoute);
  if (!routeName || PROFILE_HISTORY_BACK_ROUTES.has(routeName)) return;

  const currentHash = getRouteFromHash();
  const activeSubPageId = getActivePageId();
  const subPageId =
    currentHash?.routeName === routeName
      ? currentHash.subPageId
      : activeSubPageId && activeSubPageId !== routeName
        ? activeSubPageId
        : null;

  try {
    sessionStorage.setItem(
      PROFILE_RETURN_KEY,
      JSON.stringify({ routeName, subPageId }),
    );
  } catch {
    void 0;
  }
}

function consumeMyLearningReturnTarget() {
  try {
    const raw = sessionStorage.getItem(MY_LEARNING_RETURN_KEY);
    sessionStorage.removeItem(MY_LEARNING_RETURN_KEY);
    const parsed = JSON.parse(raw || "null");
    return normalizeStructuralBackTarget(parsed);
  } catch {
    return null;
  }
}

function consumeProfileReturnTarget() {
  try {
    const raw = sessionStorage.getItem(PROFILE_RETURN_KEY);
    sessionStorage.removeItem(PROFILE_RETURN_KEY);
    const parsed = JSON.parse(raw || "null");
    return normalizeStructuralBackTarget(parsed);
  } catch {
    return null;
  }
}

function consumeInteractiveLearningReturnTarget() {
  try {
    const raw = sessionStorage.getItem(INTERACTIVE_LEARNING_RETURN_KEY);
    sessionStorage.removeItem(INTERACTIVE_LEARNING_RETURN_KEY);
    const parsed = JSON.parse(raw || "null");
    return normalizeStructuralBackTarget(parsed);
  } catch {
    return null;
  }
}

function consumeMedicalStudentsRapdReturn() {
  const pageMarkedForReturn =
    document.getElementById("glaucomaRAPDFullSwingInteractive")?.dataset
      .medicalStudentsReturn === "true";
  try {
    const shouldReturn =
      sessionStorage.getItem(MEDICAL_STUDENTS_RAPD_RETURN_KEY) === "1";
    sessionStorage.removeItem(MEDICAL_STUDENTS_RAPD_RETURN_KEY);
    return pageMarkedForReturn || shouldReturn;
  } catch {
    return pageMarkedForReturn;
  }
}

function goToStoredInteractiveLearningReturn() {
  const returnTarget = consumeInteractiveLearningReturnTarget();
  if (!returnTarget?.routeName) return false;

  const currentHash = getRouteFromHash();
  removePageHistoryEntry({
    routeName: currentHash?.routeName || currentPageName,
    subPageId: currentHash?.subPageId || getActivePageId(),
  });

  isApplyingBackNavigation = true;
  loadPage(returnTarget.routeName, {
    replace: true,
    force: returnTarget.routeName === currentRoute,
    recordHistory: false,
    subPageId: returnTarget.subPageId,
  }).finally(() => {
    isApplyingBackNavigation = false;
  });

  return true;
}

function recordShownSubPage(id) {
  if (isApplyingBackNavigation) return;

  const normalizedRoute = normalizeRouteName(currentPageName);
  if (!normalizedRoute || !id) return;

  const subPageId = normalizeSubPageId(id);
  if (!subPageId) return;

  const top = pageHistoryStack[pageHistoryStack.length - 1];
  const nextEntry = { routeName: normalizedRoute, subPageId };
  if (samePageHistoryEntry(top, nextEntry)) return;

  const isImmediateSubPageAfterRouteLoad =
    top?.routeName === normalizedRoute &&
    !top.subPageId &&
    lastRouteHistoryRecord?.routeName === normalizedRoute &&
    Date.now() - lastRouteHistoryRecord.time < 1200;

  if (isImmediateSubPageAfterRouteLoad) {
    pageHistoryStack[pageHistoryStack.length - 1] = nextEntry;
    return;
  }

  pageHistoryStack.push(nextEntry);
}

const STRUCTURAL_BACK_TARGETS = {
  atomscard: { routeName: "dashboard" },
  atomsHandout1: { routeName: "childhoodEyeScreeningWorkshop" },
  atomsHandout2: { routeName: "childhoodEyeScreeningWorkshop" },
  behavioursquiz: { routeName: "childhoodEyeScreeningWorkshop" },
  binocularIndirectOphthalmoscopyPdf: {
    routeName: "diabeticRetinopathyWorkshop",
  },
  visualAcuityPdf: { routeName: "videos", subPageId: "visualAcuityPage" },
  pupilsPecPdf: { routeName: "videos", subPageId: "pupilsPage" },
  pupilsAdvancedPdf: { routeName: "videos", subPageId: "pupilsPage" },
  frontOfEyePdf: { routeName: "videos", subPageId: "frontOfEyePage" },
  childhoodAskQuestionsObservePage: {
    routeName: "childhoodEyeScreeningWorkshop",
  },
  childhoodEyeBrainImages: { routeName: "childhoodEyeScreeningWorkshop" },
  childhoodEyeScreeningWorkshop: { routeName: "eyes" },
  childhoodFundalAfterExamination: {
    routeName: "childhoodEyeScreeningWorkshop",
  },
  childhoodFundalExamination: { routeName: "childhoodEyeScreeningWorkshop" },
  childhoodFundalNewbornEyesClosed: {
    routeName: "childhoodEyeScreeningWorkshop",
  },
  childhoodFundalNewbornEyesOpen: {
    routeName: "childhoodEyeScreeningWorkshop",
  },
  childhoodFundalPossibleFinding: {
    routeName: "childhoodEyeScreeningWorkshop",
  },
  childhoodFundalPreparation: { routeName: "childhoodEyeScreeningWorkshop" },
  childhoodFundalUnclearFindings: {
    routeName: "childhoodEyeScreeningWorkshop",
  },
  childhoodIntroVisualDevelopmentPage: {
    routeName: "childhoodEyeScreeningWorkshop",
  },
  childhoodNormalVisualDevelopmentPage: {
    routeName: "childhoodEyeScreeningWorkshop",
  },
  childhoodRefer: { routeName: "childhoodEyeScreeningWorkshop" },
  diabeticRetinopathyWorkshop: { routeName: "eyes" },
  directOphthalmoscopyPdf: { routeName: "diabeticRetinopathyWorkshop" },
  editProfile: { routeName: "myprofile" },
  eyes: { routeName: "dashboard" },
  fundalReflexPdf: { routeName: "childhoodEyeScreeningWorkshop" },
  glaucomaHistoryCaseStudy: { routeName: "glaucomaWorkshop" },
  glaucomaQuizCaseStudy: { routeName: "glaucomaWorkshop" },
  glaucomaScrollImages: { routeName: "glaucomaWorkshop" },
  glaucomaWorkshop: { routeName: "eyes" },
  medicalStudentsWorkshop: { routeName: "eyes" },
  settings: { routeName: "myprofile" },
  signsVICases: { routeName: "childhoodEyeScreeningWorkshop" },
  visualImpairment: { routeName: "childhoodEyeScreeningWorkshop" },
  visualsystemeyesbrain: { routeName: "childhoodEyeScreeningWorkshop" },
};

const STRUCTURAL_BACK_SUBPAGES = {
  visualAcuityPage: { routeName: "eyes" },
  pupilsPage: { routeName: "eyes" },
  frontOfEyePage: { routeName: "eyes" },
  fundalExamPage: {
    routeName: "videos",
    subPageId: "fundalReflexPage",
  },
  directOphthalmoscopyScrollPage: {
    routeName: "videos",
    subPageId: "arclightPage",
  },
  fundalReflexExaminationScrollPage: {
    routeName: "videos",
    subPageId: "fundalReflexPage",
  },
  binocularIndirectOphthalmoscopyScrollPage: {
    routeName: "videos",
    subPageId: "holoOverviewPage",
  },
  assessmentVisionPage: { routeName: "childhoodEyeScreeningWorkshop" },
  mumVisionPage: { routeName: "childhoodEyeScreeningWorkshop" },
  usaidHowToUseArclightPage: { routeName: "childhoodEyeScreeningWorkshop" },
  usaidFundalReflexExamPage: { routeName: "childhoodEyeScreeningWorkshop" },
  usaidNormalAbnormalPage: { routeName: "childhoodEyeScreeningWorkshop" },
};

const HISTORY_FIRST_BACK_ROUTES = new Set([
  "binocularIndirectOphthalmoscopyPdf",
  "directOphthalmoscopyPdf",
  "fundalReflexPdf",
]);

const PROFILE_HISTORY_BACK_ROUTES = new Set([
  "myprofile",
  "editProfile",
  "settings",
]);

function popPreviousPageHistoryEntry() {
  if (pageHistoryStack.length <= 1) return null;
  pageHistoryStack.pop();
  return pageHistoryStack[pageHistoryStack.length - 1] || null;
}

function discardCurrentRouteHistoryEntries(routeName) {
  const normalizedRoute = normalizeRouteName(routeName);
  if (!normalizedRoute) return;

  while (
    pageHistoryStack.length &&
    pageHistoryStack[pageHistoryStack.length - 1]?.routeName === normalizedRoute
  ) {
    pageHistoryStack.pop();
  }
}

function popPreviousDistinctRouteHistoryEntry(routeName) {
  const currentRouteName = normalizeRouteName(routeName);
  if (!currentRouteName || pageHistoryStack.length <= 1) return null;

  while (pageHistoryStack.length > 1) {
    pageHistoryStack.pop();
    const previousEntry = pageHistoryStack[pageHistoryStack.length - 1] || null;
    if (
      previousEntry?.routeName &&
      previousEntry.routeName !== currentRouteName
    ) {
      return previousEntry;
    }
  }

  return null;
}

function getActivePageId() {
  const activePages = Array.from(
    document.querySelectorAll("#page-content .page.active"),
  );
  const active = activePages[activePages.length - 1];
  return normalizeSubPageId(active?.id);
}

function isDesktopViewport() {
  return !!(
    typeof window !== "undefined" &&
    window.matchMedia?.("(min-width: 1024px)")?.matches
  );
}

function normalizeStructuralBackTarget(target) {
  if (!target) return null;
  const routeName = normalizeRouteName(target.routeName || target);
  if (!routeName) return null;
  return {
    routeName,
    subPageId: normalizeSubPageId(target.subPageId),
  };
}

function getStructuralBackTarget(routeName, subPageId = null) {
  const normalizedRoute = normalizeRouteName(routeName);
  if (!normalizedRoute) return null;

  const normalizedSubPage = normalizeSubPageId(subPageId);
  return normalizeStructuralBackTarget(
    STRUCTURAL_BACK_SUBPAGES[normalizedSubPage] ||
      STRUCTURAL_BACK_TARGETS[normalizedRoute],
  );
}

function replaceHistoryWithStructuralTarget(target) {
  const structuralTarget = normalizeStructuralBackTarget(target);
  if (!structuralTarget?.routeName) return;

  updateRouteHistory(structuralTarget.routeName, true);
  updatePageHistory(
    structuralTarget.routeName,
    structuralTarget.subPageId,
    true,
  );
  lastRouteHistoryRecord = {
    routeName: structuralTarget.routeName,
    time: Date.now(),
  };
}

function buildHashFromRoute(routeName, subPageId = null) {
  const normalizedRoute = normalizeRouteName(routeName);
  if (!normalizedRoute) return "";

  const normalizedSubPage = normalizeSubPageId(subPageId);
  if (normalizedSubPage) {
    return `${HASH_ROUTE_PREFIX}${encodeURIComponent(
      normalizedRoute,
    )}/${encodeURIComponent(normalizedSubPage)}`;
  }
  return `${HASH_ROUTE_PREFIX}${encodeURIComponent(normalizedRoute)}`;
}

export function getRouteFromHash(
  hash = typeof window !== "undefined" ? window.location.hash : "",
) {
  const rawHash = String(hash ?? "").trim();
  if (!rawHash || rawHash === "#") return null;

  let path = rawHash.startsWith("#") ? rawHash.slice(1) : rawHash;
  if (path.startsWith("/")) path = path.slice(1);
  if (!path) return null;

  const [routePart, subPagePart] = path
    .split("/")
    .filter(Boolean)
    .map((part) => safeDecodeHashSegment(part));

  const routeName = normalizeRouteName(routePart);
  if (!routeName) return null;

  return {
    routeName,
    subPageId: normalizeSubPageId(subPagePart),
  };
}

function primeVideosSubPage(subPageId) {
  const normalizedSubPage = normalizeSubPageId(subPageId);
  if (!normalizedSubPage) return;
  try {
    window.__videosPendingTarget = normalizedSubPage;
    sessionStorage.setItem("gotoSubPage", normalizedSubPage);
  } catch {
    void 0;
  }
}

function showSubPageIfPresent(subPageId) {
  const normalizedSubPage = normalizeSubPageId(subPageId);
  if (!normalizedSubPage) return false;

  const target = document.getElementById(normalizedSubPage);
  if (!target) return false;

  if (typeof window.showPage === "function") {
    window.showPage(normalizedSubPage);
  } else {
    minimalShowPage(normalizedSubPage);
    document.dispatchEvent(
      new CustomEvent("page:shown", {
        detail: { id: normalizedSubPage },
      }),
    );
  }

  return true;
}

function showRoutePageIfPresent(routeName) {
  const normalizedRoute = normalizeRouteName(routeName);
  if (!normalizedRoute) return false;

  const target = document.getElementById(normalizedRoute);
  if (!target || !target.classList?.contains("page")) return false;

  if (typeof window.showPage === "function") {
    window.showPage(normalizedRoute);
  } else {
    minimalShowPage(normalizedRoute);
    document.dispatchEvent(
      new CustomEvent("page:shown", {
        detail: { id: normalizedRoute },
      }),
    );
  }

  return true;
}

export function syncRouteHash(routeName, options = {}) {
  if (typeof window === "undefined") return;
  const normalizedRoute = normalizeRouteName(routeName);
  if (!normalizedRoute) return;

  const replace = options?.replace === true;
  const hash = buildHashFromRoute(normalizedRoute, options?.subPageId);
  if (!hash || window.location.hash === hash) return;

  isWritingRouteHash = true;
  if (replace) {
    history.replaceState(
      history.state,
      "",
      `${window.location.pathname}${window.location.search}${hash}`,
    );
  } else {
    window.location.hash = hash;
  }

  window.setTimeout(() => {
    isWritingRouteHash = false;
  }, 0);
}

/**
 * Loads a new page fragment into the '#page-content' container based on the given route name.
 * Manages history, closes the menu, and dispatches a 'page:loaded' custom event.
 * @param {string} routeName - The name of the route to load (key in ROUTES object).
 * @param {Object} [options={}] - Options for page loading, e.g., `{ replace: true }` for history replacement.
 */
export async function loadPage(routeName, options = {}) {
  const replace = options?.replace === true;
  const force = options?.force === true;
  const recordHistory = options?.recordHistory !== false;
  const syncHash = options?.syncHash !== false;
  const subPageId = normalizeSubPageId(options?.subPageId);

  if (recordHistory) {
    rememberMyLearningReturnTarget(routeName);
    rememberProfileReturnTarget(routeName);
  }

  if (!replace && !force && routeName === currentRoute) {
    if (!showSubPageIfPresent(subPageId)) {
      showRoutePageIfPresent(routeName);
    }
    if (syncHash) {
      syncRouteHash(routeName, {
        replace,
        subPageId,
      });
    }
    if (recordHistory && subPageId) {
      updatePageHistory(routeName, subPageId, replace);
    }
    return; // Add the guard
  }
  currentRoute = routeName; // Update currentRoute

  if (routeName === "videos" && subPageId) {
    primeVideosSubPage(subPageId);
  }

  const container = document.getElementById("page-content");
  const url = ROUTES[routeName];

  // Set currentPageName early. This ensures it's always set when loadPage is called,
  // even if the route is not found or fetch fails. This helps with tests that check currentPageName.
  currentPageName = routeName;
  if (document.body) {
    delete document.body.dataset.route;
    document.body.dataset.currentRoute = routeName;
  }

  if (!container) {
    console.error("#page-content not found");
    // Dispatch events even for errors to signal completion of the attempt.
    window.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName, error: true } }),
    );
    window.dispatchEvent(
      new CustomEvent("page:rendered", { detail: { routeName, error: true } }),
    );
    return;
  }
  if (!url) {
    console.error(`Route "${routeName}" not found in ROUTES.`);
    container.textContent = "";
    const notFoundWrap = document.createElement("div");
    notFoundWrap.className = "container";
    const notFoundText = document.createElement("p");
    notFoundText.textContent = `Page not found: ${routeName}`;
    notFoundWrap.appendChild(notFoundText);
    container.appendChild(notFoundWrap);
    // Dispatch events even for errors to signal completion of the attempt.
    window.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName, error: true } }),
    );
    window.dispatchEvent(
      new CustomEvent("page:rendered", { detail: { routeName, error: true } }),
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
    container.textContent = "";
    const failedWrap = document.createElement("div");
    failedWrap.className = "container";
    const failedText = document.createElement("p");
    failedText.textContent = `Failed to load page: ${routeName}`;
    failedWrap.appendChild(failedText);
    container.appendChild(failedWrap);
    // Dispatch events even for fetch errors.
    window.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName, error: true } }),
    );
    window.dispatchEvent(
      new CustomEvent("page:rendered", { detail: { routeName, error: true } }),
    );
    return;
  }

  // Inject the fetched HTML
  container.innerHTML = html;

  // ✅ Always reset scroll position on route change
  try {
    container.scrollTop = 0;
  } catch {
    void 0;
  }

  try {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  } catch {
    void 0;
  }

  try {
    closeMenu();
  } catch {
    void 0;
  }

  // Debug (optional)
  console.warn("[router] loaded route:", routeName, "bytes=", html.length);
  console.warn(
    "[router] .page count:",
    container.querySelectorAll(".page").length,
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
      "[router] No .page found; wrapped content in a new .page element.",
    );
  }

  const suppressInitialVideoDefault =
    routeName === "videos" && Boolean(subPageId);
  if (suppressInitialVideoDefault) {
    const videosRoot =
      pageElement.id === "videos"
        ? pageElement
        : pageElement.querySelector("#videos");
    if (videosRoot) {
      videosRoot.style.visibility = "hidden";
      videosRoot.querySelectorAll(".page").forEach((page) => {
        page.classList.remove("active");
        page.style.display = "none";
      });
    }
  }

  // Apply the 'active' class to the first .page element found or the newly created wrapper.
  // Prioritize elements with data-default="true".
  const defaultActive = pageElement.querySelector('[data-default="true"]');
  if (defaultActive && !suppressInitialVideoDefault) {
    defaultActive.classList.add("active");
  } else {
    pageElement.classList.add("active"); // Apply active class to the main page element
  }

  if (recordHistory) {
    updateRouteHistory(routeName, replace);
    updatePageHistory(routeName, subPageId, replace);
    lastRouteHistoryRecord = {
      routeName,
      time: Date.now(),
    };
  }

  currentPageName = routeName; // Ensure currentPageName is set after successful load

  if (syncHash) {
    syncRouteHash(routeName, {
      replace,
      subPageId,
    });
  }

  // Notify initializers
  window.dispatchEvent(
    new CustomEvent("page:loaded", { detail: { routeName } }),
  );

  // Notify that the page has been rendered and is ready for translations
  window.dispatchEvent(
    new CustomEvent("page:rendered", { detail: { routeName } }),
  );

  if (!showSubPageIfPresent(subPageId)) {
    showRoutePageIfPresent(routeName);
  }

  // Toggle fixed UI (optional)
  const searchContainer = document.getElementById("fixedSearchContainer");
  if (searchContainer) {
    searchContainer.style.display = ["dashboard", "earsDashboard"].includes(
      routeName,
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
  if (currentPageName === "mylearning") {
    const returnTarget = consumeMyLearningReturnTarget();
    if (returnTarget?.routeName) {
      isApplyingBackNavigation = true;
      loadPage(returnTarget.routeName, {
        replace: true,
        force: returnTarget.routeName === currentRoute,
        recordHistory: false,
        subPageId: returnTarget.subPageId,
      }).finally(() => {
        isApplyingBackNavigation = false;
      });
      return;
    }
  }

  const activeSubPageId = getActivePageId();
  const currentRouteForBack = normalizeRouteName(currentPageName);

  if (
    currentRouteForBack === "glaucomaScrollImages" &&
    activeSubPageId === "glaucomaRAPDFullSwingInteractive" &&
    consumeMedicalStudentsRapdReturn()
  ) {
    discardCurrentRouteHistoryEntries(currentRouteForBack);
    isApplyingBackNavigation = true;
    loadPage("medicalStudentsWorkshop", {
      replace: true,
      recordHistory: false,
    }).finally(() => {
      isApplyingBackNavigation = false;
    });
    return;
  }

  const currentHash = getRouteFromHash();
  const isAlreadyAtInteractiveLearning =
    currentHash?.routeName === "videos" &&
    normalizeSubPageId(currentHash?.subPageId) === "interactiveLearningPage";
  if (
    !isAlreadyAtInteractiveLearning &&
    goToStoredInteractiveLearningReturn()
  ) {
    return;
  }

  if (currentRouteForBack === "myprofile") {
    const returnTarget = consumeProfileReturnTarget();
    if (returnTarget?.routeName) {
      discardCurrentRouteHistoryEntries(currentRouteForBack);
      isApplyingBackNavigation = true;
      loadPage(returnTarget.routeName, {
        replace: true,
        force: returnTarget.routeName === currentRoute,
        recordHistory: false,
        subPageId: returnTarget.subPageId,
      }).finally(() => {
        isApplyingBackNavigation = false;
      });
      return;
    }
  }

  if (PROFILE_HISTORY_BACK_ROUTES.has(currentRouteForBack)) {
    const previousEntry =
      popPreviousDistinctRouteHistoryEntry(currentRouteForBack);
    if (previousEntry?.routeName) {
      isApplyingBackNavigation = true;
      loadPage(previousEntry.routeName, {
        replace: true,
        force: previousEntry.routeName === currentRoute,
        recordHistory: false,
        subPageId: previousEntry.subPageId,
      }).finally(() => {
        isApplyingBackNavigation = false;
      });
      return;
    }
  }

  if (HISTORY_FIRST_BACK_ROUTES.has(currentRouteForBack)) {
    const previousEntry = popPreviousPageHistoryEntry();
    if (previousEntry?.routeName) {
      isApplyingBackNavigation = true;
      loadPage(previousEntry.routeName, {
        replace: true,
        force: previousEntry.routeName === currentRoute,
        recordHistory: false,
        subPageId: previousEntry.subPageId,
      }).finally(() => {
        isApplyingBackNavigation = false;
      });
      return;
    }
  }

  const structuralTarget = getStructuralBackTarget(
    currentPageName,
    activeSubPageId,
  );
  if (structuralTarget?.routeName) {
    replaceHistoryWithStructuralTarget(structuralTarget);
    isApplyingBackNavigation = true;
    loadPage(structuralTarget.routeName, {
      replace: true,
      force: structuralTarget.routeName === currentRoute,
      recordHistory: false,
      subPageId: structuralTarget.subPageId,
    }).finally(() => {
      isApplyingBackNavigation = false;
    });
    return;
  }

  // Special-case: if we're on videos and pupilsPage is active, prefer explicit return route
  if (currentPageName === "videos") {
    if (activeSubPageId === "fundalReflexPage" && isDesktopViewport()) {
      loadPage("eyes", { replace: true, recordHistory: false });
      return;
    }

    try {
      const ret = sessionStorage.getItem("fromRoute");
      if (ret) {
        sessionStorage.removeItem("fromRoute");
        loadPage(ret, { replace: true, recordHistory: false });
        return;
      }
    } catch {
      /* fall through */
    }
  }

  const previousEntry = popPreviousPageHistoryEntry();

  if (previousEntry?.routeName) {
    isApplyingBackNavigation = true;
    loadPage(previousEntry.routeName, {
      replace: true,
      force: previousEntry.routeName === currentRoute,
      recordHistory: false,
      subPageId: previousEntry.subPageId,
    }).finally(() => {
      isApplyingBackNavigation = false;
    });
    return;
  }

  // Default stack-based behavior
  if (historyStack.length > 1) {
    historyStack.pop(); // current
  }
  const routeToLoad = historyStack[historyStack.length - 1] || "dashboard";

  loadPage(routeToLoad, { replace: true, recordHistory: false });
}

/**
 * Initializes page navigation by setting up a global click listener for elements
 * with 'data-route' attributes and an event listener for a global back button.
 */
export function initializePageNavigation() {
  window.addEventListener("hashchange", () => {
    if (isWritingRouteHash) return;

    const deepLink = getRouteFromHash();
    if (!deepLink?.routeName) return;

    void loadPage(deepLink.routeName, {
      replace: true,
      force:
        deepLink.routeName === currentRoute ||
        (deepLink.routeName === "videos" && !!deepLink.subPageId),
      subPageId: deepLink.subPageId,
      syncHash: false,
    });
  });

  window.addEventListener("click", (e) => {
    const el = e.target.closest?.("[data-route]");
    if (!el) return;
    const route = el.getAttribute("data-route");
    if (route) {
      e.preventDefault();
      const myLearningTab = el.getAttribute("data-my-learning-tab");
      if (route === "mylearning" && myLearningTab) {
        try {
          sessionStorage.setItem("myLearningActiveTab", myLearningTab);
          localStorage.setItem("myLearningActiveTab", myLearningTab);
        } catch {
          void 0;
        }
      }
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
    // 1) quizzes 프래그먼트를 먼저 로드해서 placeholder div가 DOM에 있도록 보장
    if (typeof window.loadPage === "function") {
      await loadPage("quizzes");
    } else {
      console.warn("loadPage() not found; cannot navigate to quizzes");
      return;
    }

    // 2) 퀴즈 UI 생성/렌더링은 quiz-launcher.js의 전역 엔트리로 통일
    //    (이 함수가 directOphthalmoscopyQuizPage를 채우고 showPage까지 함)
    if (typeof window.launchQuiz === "function") {
      window.launchQuiz();
    }

    // 3) Ensure the target quiz page is actually visible (avoid blank page)
    const pages = document.querySelectorAll("#page-content .page");
    pages.forEach((p) => {
      p.classList.remove("active");
      p.style.display = "none";
    });

    const target = document.getElementById(TARGET_ID);
    if (target) {
      target.classList.add("active");
      target.style.display = "block";
    } else {
      console.warn("Quiz target not found:", TARGET_ID);
    }

    // 3) 혹시 launchQuiz가 없을 때만 최후의 fallback으로 showPage
    const show = (id) => {
      if (typeof window.showPage === "function") return window.showPage(id);
      if (typeof window.minimalShowPage === "function")
        return window.minimalShowPage(id);
      console.warn("No showPage() available");
    };

    return show("directOphthalmoscopyQuizPage");
  }

  // Bind to the Take Quiz button (supports either id or data-action)
  document.addEventListener(
    "click",
    function (e) {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const direct = target.closest?.('#quizBtn, [data-action="take-quiz"]');

      const path = typeof e.composedPath === "function" ? e.composedPath() : [];
      const fromPath = path.find(
        (n) =>
          n instanceof Element &&
          n.matches?.('#quizBtn, [data-action="take-quiz"]'),
      );

      const btn = direct || fromPath;
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      goToDirectOphthalmoscopyQuiz();
    },
    true,
  );

  // 키보드(Enter/Space)도 quizBtn처럼 동작하게
  document.addEventListener(
    "keydown",
    function (e) {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const direct = target.closest?.('#quizBtn, [data-action="take-quiz"]');

      const path = typeof e.composedPath === "function" ? e.composedPath() : [];
      const fromPath = path.find(
        (n) =>
          n instanceof Element &&
          n.matches?.('#quizBtn, [data-action="take-quiz"]'),
      );

      const btn = direct || fromPath;
      if (!btn) return;

      if (e.key !== "Enter" && e.key !== " ") return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      goToDirectOphthalmoscopyQuiz();
    },
    true,
  );

  // Also expose a global for manual triggering / compatibility with old.zip
  window.launchQuiz =
    window.launchQuiz || (() => goToDirectOphthalmoscopyQuiz());
})();

// Custom event listener for "myprofile" route to show "myProfilePage"
document.addEventListener("page:loaded", (e) => {
  if (e.detail?.routeName === "myprofile") {
    if (typeof window.showPage === "function") {
      window.showPage("myProfilePage");
    } else {
      minimalShowPage("myProfilePage");
    }
    window.dispatchEvent(
      new CustomEvent("app:navigate", {
        detail: { pageId: "myProfilePage" },
      }),
    );
  }
});

// Expose loadPage globally for compatibility with legacy code / inline handlers
window.loadPage = window.loadPage || loadPage;
