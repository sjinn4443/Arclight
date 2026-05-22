import { loadPage } from "./navigation.js";

const WORKSHOP_HOME = "__diabeticWorkshopHome__";
const WORKSHOP_PAGE_ID = "diabeticRetinopathyWorkshopPage";
const NEXT_HOST_CLASS = "diabetic-next-host";
const FLOW_ENABLED_KEY = "diabeticWorkshop:nextFlowEnabled";
const RESTORE_OPEN_KEY = "diabeticWorkshop:restoreOpenFolder";
const OPEN_FOLDER_KEY = "diabeticWorkshop:openFolderKey";
const FOCUS_SELECTOR_KEY = "diabeticWorkshop:focusSelector";

const INTERNAL_TARGETS = new Set([
  "diabeticPragmaticScreeningPage",
  "diabeticNcdClinicScreeningPage",
  "diabeticOtherEyeDiseasesScreeningPage",
  "diabeticWhatIsDiabetesPage",
  "diabeticTypesOfDiabetesPage",
  "diabeticWhatIsRetinopathyPage",
  "diabeticVisionLossInDiabetesPage",
  "diabeticNcdFlowIntroductionPage",
  "diabeticProliferativeOtherDiseasePage",
  "diabeticSimpleSafeScalableScrollPage",
  "diabeticArclightPackagePage",
  "diabeticProtocolOverviewPage",
  "diabeticProtocolPhaseAPage",
  "diabeticProtocolPhaseBPage",
  "diabeticProtocolNcdConsultationPage",
  "diabeticProtocolPhaseCPage",
  "diabeticProtocolFinalDecisionsPage",
]);

const VIDEO_TARGETS = new Set([
  "diabeticIntroductionToArclightVideoPage",
  "diabeticCausesOfVisionLossVideoPage",
  "diabeticSimpleSafeScalableVideoPage",
]);

const SCROLLYTELLING_TARGETS = new Set([
  "diabeticObservationFundalReflexPage",
  "diabeticPositioningFlightPathPage",
  "diabeticHowToExaminePage",
  "diabeticBioPreparationPage",
  "diabeticBioFundoscopySittingPage",
  "diabeticBioFundoscopyIndentationPage",
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
    next: { type: "target", target: "diabeticNcdClinicScreeningPage" },
  },
  diabeticNcdClinicScreeningPage: {
    previous: {
      type: "target",
      target: "diabeticIntroductionToArclightVideoPage",
    },
    next: { type: "target", target: "diabeticOtherEyeDiseasesScreeningPage" },
  },
  diabeticOtherEyeDiseasesScreeningPage: {
    previous: { type: "target", target: "diabeticNcdClinicScreeningPage" },
    next: { type: "focus", folderKey: "introduction" },
  },
  diabeticWhatIsDiabetesPage: {
    previous: { type: "home" },
    next: { type: "target", target: "diabeticTypesOfDiabetesPage" },
  },
  diabeticTypesOfDiabetesPage: {
    previous: { type: "target", target: "diabeticWhatIsDiabetesPage" },
    next: { type: "target", target: "diabeticWhatIsRetinopathyPage" },
  },
  diabeticWhatIsRetinopathyPage: {
    previous: { type: "target", target: "diabeticTypesOfDiabetesPage" },
    next: { type: "target", target: "diabeticVisionLossInDiabetesPage" },
  },
  diabeticVisionLossInDiabetesPage: {
    previous: { type: "target", target: "diabeticWhatIsRetinopathyPage" },
    next: { type: "focus", folderKey: "whatIsDiabetes" },
  },
  diabeticNcdFlowIntroductionPage: {
    previous: { type: "home" },
    next: { type: "target", target: "diabeticProliferativeOtherDiseasePage" },
  },
  diabeticProliferativeOtherDiseasePage: {
    previous: { type: "target", target: "diabeticNcdFlowIntroductionPage" },
    next: { type: "target", target: "diabeticSimpleSafeScalableScrollPage" },
  },
  diabeticSimpleSafeScalableScrollPage: {
    previous: {
      type: "target",
      target: "diabeticProliferativeOtherDiseasePage",
    },
    next: { type: "target", target: "diabeticSimpleSafeScalableVideoPage" },
  },
  diabeticSimpleSafeScalableVideoPage: {
    previous: {
      type: "target",
      target: "diabeticSimpleSafeScalableScrollPage",
    },
    next: { type: "focus", folderKey: "ncdClinicFlow" },
  },
  diabeticProtocolOverviewPage: {
    previous: { type: "home" },
    next: { type: "target", target: "diabeticProtocolPhaseAPage" },
  },
  diabeticProtocolPhaseAPage: {
    previous: { type: "target", target: "diabeticProtocolOverviewPage" },
    next: { type: "target", target: "diabeticProtocolPhaseBPage" },
  },
  diabeticProtocolPhaseBPage: {
    previous: { type: "target", target: "diabeticProtocolPhaseAPage" },
    next: { type: "target", target: "diabeticProtocolNcdConsultationPage" },
  },
  diabeticProtocolNcdConsultationPage: {
    previous: { type: "target", target: "diabeticProtocolPhaseBPage" },
    next: { type: "target", target: "diabeticProtocolPhaseCPage" },
  },
  diabeticProtocolPhaseCPage: {
    previous: { type: "target", target: "diabeticProtocolNcdConsultationPage" },
    next: { type: "target", target: "diabeticProtocolFinalDecisionsPage" },
  },
  diabeticProtocolFinalDecisionsPage: {
    previous: { type: "target", target: "diabeticProtocolPhaseCPage" },
    next: { type: "focus", folderKey: "protocol" },
  },
};

let diabeticNextInfraWired = false;

function clearWorkshopReturnFlags() {
  try {
    sessionStorage.removeItem(RESTORE_OPEN_KEY);
    sessionStorage.removeItem(OPEN_FOLDER_KEY);
    sessionStorage.removeItem(FOCUS_SELECTOR_KEY);
  } catch {
    /* ignore session storage failures */
  }
}

function isFlowEnabled() {
  try {
    return sessionStorage.getItem(FLOW_ENABLED_KEY) === "1";
  } catch {
    return false;
  }
}

function setFlowEnabled(enabled) {
  try {
    if (enabled) sessionStorage.setItem(FLOW_ENABLED_KEY, "1");
    else sessionStorage.removeItem(FLOW_ENABLED_KEY);
  } catch {
    /* ignore session storage failures */
  }
}

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
    if (el.getAttribute("data-fundal-inline-nav") === "1") return;
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
  setFlowEnabled(false);
  await loadPage("diabeticRetinopathyWorkshop", {
    force: true,
    replace: true,
  });
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
    clearWorkshopReturnFlags();

    setFlowEnabled(false);
    await loadPage("diabeticRetinopathyWorkshop", {
      force: true,
      replace: true,
    });

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
    setFlowEnabled(true);
    clearWorkshopReturnFlags();

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
    setFlowEnabled(true);
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

function shouldUseDiabeticStructuralBack() {
  const visibleId = getVisiblePageId();
  return (
    visibleId === WORKSHOP_PAGE_ID ||
    INTERNAL_TARGETS.has(visibleId) ||
    VIDEO_TARGETS.has(visibleId) ||
    SCROLLYTELLING_TARGETS.has(visibleId)
  );
}

async function navigateBackByDiabeticStructure() {
  const visibleId = getVisiblePageId();
  removeNextButtons();
  setFlowEnabled(false);

  if (visibleId === WORKSHOP_PAGE_ID) {
    clearWorkshopReturnFlags();
    await loadPage("eyes", { replace: true, force: true });
    resetViewportToTopSoon();
    return;
  }

  await navigateToTarget(WORKSHOP_HOME);
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
  if (!config || !isFlowEnabled()) {
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

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest("#backBtnGlobal")) return;
      if (!shouldUseDiabeticStructuralBack()) return;

      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }
      void navigateBackByDiabeticStructure();
    },
    true,
  );

  document.addEventListener("page:shown", (event) => {
    const shownId = String(event.detail?.id || "");
    if (!shownId) return;
    renderNextButtonForTarget(shownId);
  });

  window.addEventListener("page:loaded", (event) => {
    const routeName = String(event.detail?.routeName || "");
    if (!FLOW_ROUTES.has(routeName)) {
      removeNextButtons();
      setFlowEnabled(false);
      return;
    }

    requestAnimationFrame(() => {
      const visibleId = getVisiblePageId();
      if (!visibleId) return;
      if (
        routeName === "diabeticRetinopathyWorkshop" &&
        DIABETIC_NAV_CONFIG[visibleId]
      ) {
        setFlowEnabled(true);
      }
      renderNextButtonForTarget(visibleId);
    });
  });

  renderNextButtonForTarget(getVisiblePageId());
}

export function rememberDiabeticWorkshopFlowFromRow(row) {
  if (!row) return;
  const target = String(row.getAttribute("data-target") || "").trim();
  if (DIABETIC_NAV_CONFIG[target]) {
    setFlowEnabled(true);
  }
}
