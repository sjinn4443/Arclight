import { loadPage } from "./navigation.js";

const WORKSHOP_HOME = "__diabeticWorkshopHome__";
const WORKSHOP_PAGE_ID = "diabeticRetinopathyWorkshopPage";
const NEXT_HOST_CLASS = "diabetic-next-host";
const RESTORE_OPEN_KEY = "diabeticWorkshop:restoreOpenFolder";
const OPEN_FOLDER_KEY = "diabeticWorkshop:openFolderKey";
const FOCUS_SELECTOR_KEY = "diabeticWorkshop:focusSelector";

const INTERNAL_TARGETS = new Set([
  "diabeticPragmaticScreeningPage",
  "diabeticArclightPackagePage",
]);

const VIDEO_TARGETS = new Set([
  "diabeticIntroductionToArclightVideoPage",
  "diabeticCausesOfVisionLossVideoPage",
  "diabeticSimpleSafeScalableVideoPage",
]);

const FLOW_ROUTES = new Set(["diabeticRetinopathyWorkshop", "videos"]);

const DIABETIC_NAV_CONFIG = {
  diabeticPragmaticScreeningPage: {
    previous: { type: "home" },
    next: { type: "target", target: "diabeticArclightPackagePage" },
  },
  diabeticArclightPackagePage: {
    previous: { type: "target", target: "diabeticPragmaticScreeningPage" },
    next: { type: "target", target: "diabeticIntroductionToArclightVideoPage" },
  },
  diabeticIntroductionToArclightVideoPage: {
    previous: { type: "target", target: "diabeticArclightPackagePage" },
    next: {
      type: "focus",
      folderKey: "introduction",
      focusSelector: '.lesson-row[data-lesson="screening-in-ncd-clinics"]',
    },
  },
  diabeticCausesOfVisionLossVideoPage: {
    previous: {
      type: "focus",
      folderKey: "whatIsDiabetes",
      focusSelector: '.lesson-row[data-lesson="vision-loss"]',
    },
    next: {
      type: "focus",
      folderKey: "ncdClinicFlow",
      focusSelector: '.lesson-row[data-lesson="ncd-introduction"]',
    },
  },
  diabeticSimpleSafeScalableVideoPage: {
    previous: {
      type: "focus",
      folderKey: "ncdClinicFlow",
      focusSelector: '.lesson-row[data-lesson="simple-safe-scalable-scroll"]',
    },
    next: {
      type: "focus",
      folderKey: "protocol",
      focusSelector: '.lesson-row[data-lesson="protocol-overview"]',
    },
  },
};

let diabeticNextInfraWired = false;

function resetViewportToTop() {
  try {
    const pageContent = document.getElementById("page-content");
    if (pageContent) pageContent.scrollTop = 0;
  } catch {
    /* ignore scroll reset failures */
  }

  try {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  } catch {
    /* ignore scroll reset failures */
  }
}

function resetViewportToTopSoon() {
  resetViewportToTop();
  requestAnimationFrame(() => {
    resetViewportToTop();
  });
}

function removeNextButtons() {
  document.querySelectorAll(".diabetic-next-wrap").forEach((el) => {
    try {
      el.parentElement?.classList.remove(NEXT_HOST_CLASS);
    } catch {
      /* ignore host cleanup failures */
    }
    el.remove();
  });
}

function getVisiblePageId() {
  const pages = Array.from(document.querySelectorAll(".page"));
  const visible = pages.find((page) => {
    if (!page?.id) return false;
    return getComputedStyle(page).display !== "none";
  });
  return visible?.id || "";
}

function isPageVisible(id) {
  if (!id) return false;
  const el = document.getElementById(id);
  if (!el) return false;

  let node = el;
  while (node) {
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") {
      return false;
    }
    node = node.parentElement;
  }

  return true;
}

function showPageFallback(id) {
  document.querySelectorAll(".page").forEach((page) => {
    page.style.display = "none";
  });

  const target = document.getElementById(id);
  if (!target) return;
  target.style.display = "block";
  document.dispatchEvent(new CustomEvent("page:shown", { detail: { id } }));
}

function ensurePageShownEvent(id) {
  if (!id) return;
  document.dispatchEvent(new CustomEvent("page:shown", { detail: { id } }));
}

async function navigateToWorkshopSection(folderKey, focusSelector) {
  try {
    sessionStorage.setItem(RESTORE_OPEN_KEY, "1");
    sessionStorage.setItem(OPEN_FOLDER_KEY, folderKey);
    if (focusSelector) {
      sessionStorage.setItem(FOCUS_SELECTOR_KEY, focusSelector);
    } else {
      sessionStorage.removeItem(FOCUS_SELECTOR_KEY);
    }
  } catch {
    /* ignore session storage failures */
  }

  removeNextButtons();
  await loadPage("diabeticRetinopathyWorkshop");
  resetViewportToTopSoon();
}

async function showVideosTarget(target) {
  try {
    const { goToVideosSection, showVideosPageById } =
      await import("./videos.js");
    if (typeof goToVideosSection === "function") {
      goToVideosSection(target, { skipDefault: true });
    }
    if (!isPageVisible(target) && typeof showVideosPageById === "function") {
      showVideosPageById(target);
    }
  } catch {
    /* ignore videos helper import failures */
  }

  if (!isPageVisible(target)) {
    const videosRoot = document.getElementById("videos");
    if (videosRoot) {
      videosRoot.querySelectorAll(".page").forEach((page) => {
        page.style.display = "none";
      });
    }

    const targetEl = document.getElementById(target);
    if (targetEl) {
      targetEl.style.display = "block";
      ensurePageShownEvent(target);
    }
  }

  if (isPageVisible(target)) {
    ensurePageShownEvent(target);
  }
}

async function navigateToTarget(target) {
  removeNextButtons();

  if (target === WORKSHOP_HOME) {
    try {
      sessionStorage.removeItem(RESTORE_OPEN_KEY);
      sessionStorage.removeItem(OPEN_FOLDER_KEY);
      sessionStorage.removeItem(FOCUS_SELECTOR_KEY);
    } catch {
      /* ignore session storage failures */
    }

    await loadPage("diabeticRetinopathyWorkshop");

    if (typeof window.showPage === "function") {
      window.showPage(WORKSHOP_PAGE_ID);
    } else if (typeof window.minimalShowPage === "function") {
      window.minimalShowPage(WORKSHOP_PAGE_ID);
      ensurePageShownEvent(WORKSHOP_PAGE_ID);
    } else {
      showPageFallback(WORKSHOP_PAGE_ID);
    }

    resetViewportToTopSoon();
    return;
  }

  if (INTERNAL_TARGETS.has(target)) {
    try {
      sessionStorage.removeItem(RESTORE_OPEN_KEY);
      sessionStorage.removeItem(OPEN_FOLDER_KEY);
      sessionStorage.removeItem(FOCUS_SELECTOR_KEY);
    } catch {
      /* ignore session storage failures */
    }

    await loadPage("diabeticRetinopathyWorkshop");

    if (typeof window.showPage === "function") {
      window.showPage(target);
    } else if (typeof window.minimalShowPage === "function") {
      window.minimalShowPage(target);
      ensurePageShownEvent(target);
    } else {
      showPageFallback(target);
    }

    resetViewportToTopSoon();
    return;
  }

  if (VIDEO_TARGETS.has(target)) {
    try {
      window.__videosPendingTarget = target;
      window.__videosSuppressFlash = true;
      sessionStorage.setItem("gotoSubPage", target);
    } catch {
      /* ignore session storage failures */
    }

    if (!document.getElementById("videos")) {
      await loadPage("videos");
    }

    await showVideosTarget(target);
    if (!isPageVisible(target)) {
      await loadPage("videos", { replace: true });
      await showVideosTarget(target);
    }

    resetViewportToTopSoon();
  }
}

async function navigateByConfig(step) {
  if (!step) return;

  if (step.type === "home") {
    await navigateToTarget(WORKSHOP_HOME);
    return;
  }

  if (step.type === "target" && step.target) {
    await navigateToTarget(step.target);
    return;
  }

  if (step.type === "focus") {
    await navigateToWorkshopSection(step.folderKey, step.focusSelector);
  }
}

function renderNextButtonForTarget(targetId) {
  const config = DIABETIC_NAV_CONFIG[targetId];
  if (!config) {
    removeNextButtons();
    return;
  }

  const page = document.getElementById(targetId);
  if (!page) return;

  removeNextButtons();

  const host =
    page.querySelector(".container.pupils-container") ||
    page.querySelector(".container") ||
    page;
  host.classList.add(NEXT_HOST_CLASS);

  const wrap = document.createElement("div");
  wrap.className = "diabetic-next-wrap";

  const previousBtn = document.createElement("button");
  previousBtn.type = "button";
  previousBtn.className = "diabetic-prev-btn";
  previousBtn.textContent = "< Previous";
  previousBtn.setAttribute("data-i18n", "i18nLiteral.< Previous");
  previousBtn.addEventListener("click", async () => {
    await navigateByConfig(config.previous);
  });

  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "diabetic-next-btn is-ready";
  nextBtn.textContent = "Next >";
  nextBtn.setAttribute("data-i18n", "i18nLiteral.Next >");
  nextBtn.addEventListener("click", async () => {
    await navigateByConfig(config.next);
  });

  wrap.appendChild(previousBtn);
  wrap.appendChild(nextBtn);
  host.appendChild(wrap);
  window.I18N?.applyTranslations?.(wrap);
}

export function initializeDiabeticWorkshopNextFlowInfra() {
  if (diabeticNextInfraWired) return;
  diabeticNextInfraWired = true;

  document.addEventListener("page:shown", (event) => {
    const shownId = String(event.detail?.id || "");
    if (!shownId) return;
    renderNextButtonForTarget(shownId);
  });

  window.addEventListener("page:loaded", (event) => {
    const routeName = String(event.detail?.routeName || "");
    if (!FLOW_ROUTES.has(routeName)) {
      removeNextButtons();
      return;
    }

    requestAnimationFrame(() => {
      const visibleId = getVisiblePageId();
      if (!visibleId) return;
      renderNextButtonForTarget(visibleId);
    });
  });

  renderNextButtonForTarget(getVisiblePageId());
}
