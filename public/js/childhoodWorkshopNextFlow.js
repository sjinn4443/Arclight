import { loadPage } from "./navigation.js";
import { isChildhoodLessonReadyForNext } from "./childhoodWorkshopProgress.js";

const WORKSHOP_HOME = "__childhoodWorkshopHome__";
const FLOW_INDEX_KEY = "childhoodWorkshop:nextFlowIndex";
const FLOW_ENABLED_KEY = "childhoodWorkshop:nextFlowEnabled";
const FLOW_EVENT = "childhoodWorkshop:nextflow-changed";
const PROGRESS_EVENT = "childhoodWorkshop:progress-changed";
const EXTERNAL_VIDEO_PROGRESS_EVENT = "glaucomaWorkshop:progress-changed";
const NEXT_HOST_CLASS = "childhood-next-host";

const TARGET_ALIASES = {
  childhoodAssessmentPage: "childhoodAssessmentQuizPage",
};

const VIDEO_TARGETS = new Set([
  "mumVisionPage",
  "assessingVisualFunctionPage",
  "assessmentVisionPage",
  "usaidHowToUseArclightPage",
  "usaidFundalReflexExamPage",
  "usaidNormalAbnormalPage",
]);

const TARGET_ROUTES = {
  childhoodEyeBrainImagesPage: "childhoodEyeBrainImages",
  childhoodIntroVisualDevelopmentPage: "childhoodEyeBrainImages",
  childhoodNormalVisualDevelopmentPage: "childhoodEyeBrainImages",
  childhoodAskQuestionsObservePage: "childhoodEyeBrainImages",
  visualImpairmentPage: "visualImpairment",
  signsVICasesPage: "signsVICases",
  childhoodReferPage: "childhoodRefer",
  childhoodFundalPreparationPage: "childhoodFundalPreparation",
  childhoodFundalExaminationPage: "childhoodFundalExamination",
  childhoodFundalNewbornEyesOpenPage: "childhoodFundalNewbornEyesOpen",
  childhoodFundalNewbornEyesClosedPage: "childhoodFundalNewbornEyesClosed",
  childhoodFundalUnclearFindingsPage: "childhoodFundalUnclearFindings",
  childhoodFundalPossibleFindingPage: "childhoodFundalPossibleFinding",
  childhoodFundalAfterExaminationPage: "childhoodFundalAfterExamination",
  atomsHandout1Page: "atomsHandout1",
  atomsHandout2Page: "atomsHandout2",
  fundalReflexPdfPage: "fundalReflexPdf",
  behavioursquizPage: "behavioursquiz",
  childhoodAssessmentQuizPage: "childhoodAssessment",
};

const FLOW_SECTIONS = [
  ["childhoodEyeBrainImagesPage"],
  [
    "atomsHandout1Page",
    "childhoodIntroVisualDevelopmentPage",
    "childhoodNormalVisualDevelopmentPage",
    "mumVisionPage",
    "assessingVisualFunctionPage",
  ],
  ["visualImpairmentPage"],
  ["signsVICasesPage", "behavioursquizPage"],
  [
    "childhoodAskQuestionsObservePage",
    "assessmentVisionPage",
    "atomsHandout2Page",
    "childhoodReferPage",
    "usaidHowToUseArclightPage",
    "usaidFundalReflexExamPage",
    "fundalReflexPdfPage",
    "childhoodFundalPreparationPage",
    "childhoodFundalExaminationPage",
    "childhoodFundalNewbornEyesOpenPage",
    "childhoodFundalNewbornEyesClosedPage",
    "childhoodFundalUnclearFindingsPage",
    "childhoodFundalPossibleFindingPage",
    "childhoodFundalAfterExaminationPage",
    "usaidNormalAbnormalPage",
    "childhoodAssessmentQuizPage",
  ],
];

const FLOW = [];
const TARGET_TO_INDICES = new Map();

for (const section of FLOW_SECTIONS) {
  for (let i = 0; i < section.length; i += 1) {
    const target = section[i];
    FLOW.push({
      target,
      next: section[i + 1] || WORKSHOP_HOME,
    });
  }
}

FLOW.forEach((entry, idx) => {
  const arr = TARGET_TO_INDICES.get(entry.target) || [];
  arr.push(idx);
  TARGET_TO_INDICES.set(entry.target, arr);
});

const FLOW_ROUTES = new Set([
  "childhoodEyeScreeningWorkshop",
  "videos",
  "childhoodEyeBrainImages",
  "visualImpairment",
  "signsVICases",
  "childhoodRefer",
  "childhoodFundalPreparation",
  "childhoodFundalExamination",
  "childhoodFundalNewbornEyesOpen",
  "childhoodFundalNewbornEyesClosed",
  "childhoodFundalUnclearFindings",
  "childhoodFundalPossibleFinding",
  "childhoodFundalAfterExamination",
  "atomsHandout1",
  "atomsHandout2",
  "fundalReflexPdf",
  "behavioursquiz",
  "childhoodAssessment",
]);

let nextInfraWired = false;

function resetViewportToTop() {
  try {
    const pageContent = document.getElementById("page-content");
    if (pageContent) pageContent.scrollTop = 0;
  } catch {}

  try {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  } catch {}
}

function resetViewportToTopSoon() {
  resetViewportToTop();
  requestAnimationFrame(() => {
    resetViewportToTop();
  });
}

function canonicalTarget(raw) {
  if (!raw) return "";
  return TARGET_ALIASES[raw] || raw;
}

function getStoredFlowIndex() {
  try {
    const raw = sessionStorage.getItem(FLOW_INDEX_KEY);
    const idx = Number(raw);
    if (Number.isInteger(idx) && idx >= 0 && idx < FLOW.length) return idx;
  } catch {}
  return null;
}

function setStoredFlowIndex(idx) {
  try {
    if (Number.isInteger(idx) && idx >= 0 && idx < FLOW.length) {
      sessionStorage.setItem(FLOW_INDEX_KEY, String(idx));
    } else {
      sessionStorage.removeItem(FLOW_INDEX_KEY);
    }
  } catch {}
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
  } catch {}
}

function findFlowIndexByOccurrence(target, occurrence) {
  const arr = TARGET_TO_INDICES.get(target) || [];
  return arr[occurrence - 1] ?? null;
}

function resolveFlowIndexForCurrentTarget(target) {
  if (!isFlowEnabled()) return null;

  const canon = canonicalTarget(target);
  if (!canon) return null;

  const stored = getStoredFlowIndex();
  if (stored != null && FLOW[stored]?.target === canon) return stored;

  const arr = TARGET_TO_INDICES.get(canon) || [];
  return arr[0] ?? null;
}

function showPageFallback(id) {
  document.querySelectorAll(".page").forEach((p) => {
    p.style.display = "none";
  });
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
  document.dispatchEvent(new CustomEvent("page:shown", { detail: { id } }));
}

function ensurePageShownEvent(id) {
  if (!id) return;
  if (window.__pageShownPatched === true) return;
  document.dispatchEvent(new CustomEvent("page:shown", { detail: { id } }));
}

function clearWorkshopReturnFlags() {
  try {
    sessionStorage.removeItem("childhoodWorkshop:restoreOpenFolder");
    sessionStorage.removeItem("childhoodWorkshop:openFolderKey");
  } catch {}
}

function shouldForceBackToWorkshopHome() {
  if (!isFlowEnabled()) return false;
  const visibleId = getVisiblePageId();
  if (!visibleId) return false;
  if (visibleId === "childhoodEyeScreeningWorkshopPage") return false;
  return resolveFlowIndexForCurrentTarget(visibleId) != null;
}

async function navigateBackToWorkshopHome() {
  setStoredFlowIndex(null);
  setFlowEnabled(false);
  clearWorkshopReturnFlags();
  removeNextButtons();
  await loadPage("childhoodEyeScreeningWorkshop", { replace: true });
}

function getVisiblePageId() {
  const pages = Array.from(document.querySelectorAll(".page"));
  const visible = pages.find((p) => {
    if (!p?.id) return false;
    return getComputedStyle(p).display !== "none";
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

function ensureVideosRootVisible() {
  const videosRoot = document.getElementById("videos");
  if (!videosRoot) return;
  if (getComputedStyle(videosRoot).visibility === "hidden") {
    videosRoot.style.visibility = "visible";
  }
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
  } catch {}

  if (!isPageVisible(target)) {
    const videosRoot = document.getElementById("videos");
    if (videosRoot) {
      videosRoot.querySelectorAll(".page").forEach((p) => {
        p.style.display = "none";
      });
    }

    const targetEl = document.getElementById(target);
    if (targetEl) {
      targetEl.style.display = "block";
      document.dispatchEvent(
        new CustomEvent("page:shown", { detail: { id: target } }),
      );
    }
  }

  if (isPageVisible(target)) {
    ensurePageShownEvent(target);
  }
  ensureVideosRootVisible();
}

async function navigateToTarget(target) {
  if (target === WORKSHOP_HOME) {
    await loadPage("childhoodEyeScreeningWorkshop");
    resetViewportToTopSoon();
    document.dispatchEvent(new CustomEvent(FLOW_EVENT));
    return;
  }

  if (VIDEO_TARGETS.has(target)) {
    try {
      window.__videosPendingTarget = target;
      window.__videosSuppressFlash = true;
      sessionStorage.setItem("gotoSubPage", target);
    } catch {}

    if (!document.getElementById("videos")) {
      await loadPage("videos");
    }

    await showVideosTarget(target);
    if (!isPageVisible(target)) {
      try {
        window.__videosPendingTarget = target;
        sessionStorage.setItem("gotoSubPage", target);
      } catch {}
      await loadPage("videos", { replace: true });
      await showVideosTarget(target);
    }
    resetViewportToTopSoon();
    document.dispatchEvent(new CustomEvent(FLOW_EVENT));
    return;
  }

  const route = TARGET_ROUTES[target];
  if (route) {
    await loadPage(route);
    if (typeof window.showPage === "function") {
      window.showPage(target);
      ensurePageShownEvent(target);
    } else {
      showPageFallback(target);
    }
    resetViewportToTopSoon();
    document.dispatchEvent(new CustomEvent(FLOW_EVENT));
  }
}

function removeNextButtons() {
  document.querySelectorAll(".childhood-next-wrap").forEach((el) => {
    try {
      el.parentElement?.classList.remove(NEXT_HOST_CLASS);
    } catch {}
    el.remove();
  });
}

function renderNextButtonForTarget(target) {
  const idx = resolveFlowIndexForCurrentTarget(target);
  if (idx == null) {
    removeNextButtons();
    return;
  }

  const current = FLOW[idx];
  const targetId = canonicalTarget(target);
  const pageEl =
    document.getElementById(targetId) || document.getElementById(target);
  if (!pageEl) return;

  removeNextButtons();

  const host =
    pageEl.querySelector(".container.pupils-container") ||
    pageEl.querySelector(".container") ||
    pageEl;
  host.classList.add(NEXT_HOST_CLASS);

  const wrap = document.createElement("div");
  wrap.className = "childhood-next-wrap";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "childhood-next-btn";
  btn.textContent = "Next >";
  const ready = isChildhoodLessonReadyForNext(targetId);
  btn.classList.toggle("is-ready", ready);
  btn.disabled = !ready;
  btn.setAttribute("aria-disabled", ready ? "false" : "true");

  btn.addEventListener("click", async () => {
    if (!isChildhoodLessonReadyForNext(targetId)) return;

    try {
      sessionStorage.setItem("childhoodWorkshop:restoreOpenFolder", "1");
    } catch {}

    const nextIdx = idx + 1;
    if (FLOW[nextIdx] && FLOW[nextIdx].target === current.next) {
      setStoredFlowIndex(nextIdx);
    } else if (current.next === WORKSHOP_HOME) {
      setStoredFlowIndex(null);
    } else {
      const indices = TARGET_TO_INDICES.get(current.next) || [];
      setStoredFlowIndex(indices[0] ?? null);
    }

    await navigateToTarget(current.next);
  });

  wrap.appendChild(btn);
  host.appendChild(wrap);
}

export function initializeChildhoodWorkshopNextFlowInfra() {
  if (nextInfraWired) return;
  nextInfraWired = true;

  document.addEventListener(
    "click",
    (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (!target.closest("#backBtnGlobal")) return;
      if (!shouldForceBackToWorkshopHome()) return;

      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") {
        e.stopImmediatePropagation();
      }
      void navigateBackToWorkshopHome();
    },
    true,
  );

  document.addEventListener("page:shown", (e) => {
    const shownId = e?.detail?.id;
    if (!shownId) return;
    renderNextButtonForTarget(shownId);
  });

  window.addEventListener("page:loaded", (e) => {
    const routeName = e?.detail?.routeName;
    if (!FLOW_ROUTES.has(routeName)) {
      setFlowEnabled(false);
      setStoredFlowIndex(null);
      removeNextButtons();
      return;
    }
    if (routeName === "childhoodEyeScreeningWorkshop") removeNextButtons();
  });

  document.addEventListener(FLOW_EVENT, () => {
    const visibleId = getVisiblePageId();
    if (!visibleId) return;
    renderNextButtonForTarget(visibleId);
  });

  document.addEventListener(PROGRESS_EVENT, () => {
    const visibleId = getVisiblePageId();
    if (!visibleId) return;
    renderNextButtonForTarget(visibleId);
  });

  document.addEventListener(EXTERNAL_VIDEO_PROGRESS_EVENT, () => {
    const visibleId = getVisiblePageId();
    if (!visibleId) return;
    renderNextButtonForTarget(visibleId);
  });
}

export function assignChildhoodWorkshopFlowIndices(page) {
  if (!page) return;

  const occurMap = new Map();
  page.querySelectorAll(".lesson-row[data-target]").forEach((row) => {
    const raw = row.getAttribute("data-target");
    const target = canonicalTarget(raw);
    if (!target) return;

    const nextOcc = (occurMap.get(target) || 0) + 1;
    occurMap.set(target, nextOcc);

    const idx = findFlowIndexByOccurrence(target, nextOcc);
    if (idx != null) row.dataset.nextFlowIndex = String(idx);
  });
}

export function rememberChildhoodWorkshopFlowFromRow(row) {
  if (!row) return;
  setFlowEnabled(true);

  const idx = Number(row.dataset.nextFlowIndex);
  if (Number.isInteger(idx) && idx >= 0 && idx < FLOW.length) {
    setStoredFlowIndex(idx);
    return;
  }

  const raw = row.getAttribute("data-target");
  const target = canonicalTarget(raw);
  if (!target) return;
  const indices = TARGET_TO_INDICES.get(target) || [];
  setStoredFlowIndex(indices[0] ?? null);
}
