import { loadPage } from "./navigation.js";
import { getGlaucomaLessonProgress } from "./glaucomaWorkshopProgress.js";

const WORKSHOP_HOME = "__glaucomaWorkshopHome__";
const FLOW_INDEX_KEY = "glaucomaWorkshop:nextFlowIndex";
const FLOW_ENABLED_KEY = "glaucomaWorkshop:nextFlowEnabled";
const FLOW_EVENT = "glaucomaWorkshop:nextflow-changed";
const PROGRESS_EVENT = "glaucomaWorkshop:progress-changed";
const NEXT_HOST_CLASS = "glaucoma-next-host";

const TARGET_ALIASES = {
  glaucomaVisualFieldExamVideo: "glaucomaVisualFieldExamVideoPage",
};

const SCROLL_TARGETS = new Set([
  "glaucomaWhatIs",
  "glaucomaTypes",
  "glaucomaDiagnosis",
  "glaucomaIntro",
  "glaucomaPOAGACAG",
  "glaucomaVisionIntro",
  "glaucomaTestingVisualAcuity",
  "glaucomaFieldsIntro",
  "glaucomaFieldsExam",
  "glaucomaQuadrantsFingers",
  "glaucomaQuadrantsRed",
  "glaucomaAssessRecord",
  "glaucomaPupilReactions",
  "glaucomaSwingRAPD",
  "glaucomaRAPDFullSwingInteractive",
  "frontOfEyePage",
  "glaucomaFrontFindings",
  "glaucomaACDInteractive",
  "glaucomaACDScroll",
  "glaucomaHighIOP",
  "fundalReflexPage",
  "glaucomaOpticNerve",
  "glaucomaCupping",
  "glaucomaSummaryScrolly",
]);

const VIDEO_TARGETS = new Set([
  "vaWhoPage",
  "vaNearVisionPage",
  "glaucomaVisualFieldExamVideoPage",
  "pupilFullExamPage",
  "glaucomaPupilReactionsVideoPage",
  "feFullAnteriorSegmentPage",
  "glaucomaSignsOfGlaucomaVideoPage",
  "glaucomaAnteriorChamberDepthVideoPage",
  "glaucomaACAGCaseWorkshopVideoPage",
  "glaucomaFundalReflexDiseaseVideoPage",
  "directOphthalmoscopyVideoPage",
  "glaucomaDirectOphthalmoscopyDiscsAnnotatedVideoPage",
  "glaucomaOpticDiscAnatomyVideoPage",
  "glaucomaMarginVideoPage",
  "glaucomaDiscCuppingVideoPage",
  "glaucomaOtherOpticNerveDiseasesVideoPage",
]);

const QUIZ_ROUTE_TARGETS = new Set([
  "glaucomaQuizCaseStudy",
  "glaucomaSecondaryCauseQuizPage",
]);

const HISTORY_ROUTE_TARGETS = new Set(["glaucomaHistoryCaseStudy"]);

const WORKSHOP_INTERNAL_TARGETS = new Set([
  "glaucomaFundusSummaryAtomsPage",
  "glaucomaGlaucomaSummaryAtomsPage",
]);

const FLOW_SECTIONS = [
  ["glaucomaWhatIs", "glaucomaTypes", "glaucomaDiagnosis"],
  ["glaucomaIntro", "glaucomaPOAGACAG", "glaucomaHistoryCaseStudy"],
  [
    "glaucomaVisionIntro",
    "glaucomaTestingVisualAcuity",
    "vaWhoPage",
    "vaNearVisionPage",
  ],
  [
    "glaucomaFieldsIntro",
    "glaucomaFieldsExam",
    "glaucomaQuadrantsFingers",
    "glaucomaQuadrantsRed",
    "glaucomaAssessRecord",
    "glaucomaVisualFieldExamVideoPage",
    "glaucomaPupilReactions",
    "pupilFullExamPage",
    "glaucomaPupilReactionsVideoPage",
    "glaucomaSwingRAPD",
    "glaucomaRAPDFullSwingInteractive",
  ],
  [
    "frontOfEyePage",
    "feFullAnteriorSegmentPage",
    "glaucomaFrontFindings",
    "glaucomaSignsOfGlaucomaVideoPage",
    "glaucomaACDInteractive",
    "glaucomaAnteriorChamberDepthVideoPage",
    "glaucomaSecondaryCauseQuizPage",
    "glaucomaACDScroll",
    "glaucomaHighIOP",
    "glaucomaACAGCaseWorkshopVideoPage",
  ],
  [
    "fundalReflexPage",
    "glaucomaFundalReflexDiseaseVideoPage",
    "directOphthalmoscopyVideoPage",
    "glaucomaDirectOphthalmoscopyDiscsAnnotatedVideoPage",
    "glaucomaOpticNerve",
    "glaucomaOpticDiscAnatomyVideoPage",
    "glaucomaMarginVideoPage",
    "glaucomaDiscCuppingVideoPage",
    "glaucomaCupping",
    "glaucomaDiscCuppingVideoPage",
    "glaucomaOtherOpticNerveDiseasesVideoPage",
    "glaucomaQuizCaseStudy",
  ],
  [
    "glaucomaSummaryScrolly",
    "glaucomaFundusSummaryAtomsPage",
    "glaucomaGlaucomaSummaryAtomsPage",
  ],
];

const FLOW = [];
const TARGET_TO_INDICES = new Map();

for (const section of FLOW_SECTIONS) {
  for (let i = 0; i < section.length; i += 1) {
    const target = section[i];
    FLOW.push({
      target,
      previous: section[i - 1] || WORKSHOP_HOME,
      next: section[i + 1] || WORKSHOP_HOME,
    });
  }
}

FLOW.forEach((entry, idx) => {
  const arr = TARGET_TO_INDICES.get(entry.target) || [];
  arr.push(idx);
  TARGET_TO_INDICES.set(entry.target, arr);
});

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
  const canon = canonicalTarget(target);
  if (!canon) return null;

  const arr = TARGET_TO_INDICES.get(canon) || [];
  const first = arr[0] ?? null;
  if (first == null) return null;

  if (!isFlowEnabled()) {
    setFlowEnabled(true);
    setStoredFlowIndex(first);
    return first;
  }

  const stored = getStoredFlowIndex();
  if (stored != null && FLOW[stored]?.target === canon) return stored;

  setStoredFlowIndex(first);
  return first;
}

function showPageFallback(id) {
  document.querySelectorAll(".page").forEach((p) => {
    p.style.display = "none";
  });
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
  document.dispatchEvent(new CustomEvent("page:shown", { detail: { id } }));
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
  return getComputedStyle(el).display !== "none";
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

  // Last-resort fallback: force-show target inside videos route.
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
}

async function navigateToTarget(target) {
  if (target === WORKSHOP_HOME) {
    await loadPage("glaucomaWorkshop");
    resetViewportToTopSoon();
    document.dispatchEvent(new CustomEvent(FLOW_EVENT));
    return;
  }

  if (SCROLL_TARGETS.has(target)) {
    await loadPage("glaucomaScrollImages");
    if (typeof window.showPage === "function") window.showPage(target);
    else showPageFallback(target);
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

    // If videos route is not present yet, load it first.
    if (!document.getElementById("videos")) {
      await loadPage("videos");
    }

    // Always force-show the exact videos subpage to avoid blank transitions.
    await showVideosTarget(target);
    resetViewportToTopSoon();
    document.dispatchEvent(new CustomEvent(FLOW_EVENT));
    return;
  }

  if (HISTORY_ROUTE_TARGETS.has(target)) {
    await loadPage("glaucomaHistoryCaseStudy");
    if (typeof window.showPage === "function") window.showPage(target);
    else showPageFallback(target);
    resetViewportToTopSoon();
    document.dispatchEvent(new CustomEvent(FLOW_EVENT));
    return;
  }

  if (QUIZ_ROUTE_TARGETS.has(target)) {
    await loadPage("glaucomaQuizCaseStudy");
    if (typeof window.showPage === "function") window.showPage(target);
    else showPageFallback(target);
    resetViewportToTopSoon();
    document.dispatchEvent(new CustomEvent(FLOW_EVENT));
    return;
  }

  if (WORKSHOP_INTERNAL_TARGETS.has(target)) {
    await loadPage("glaucomaWorkshop");
    if (typeof window.showPage === "function") window.showPage(target);
    else showPageFallback(target);
    resetViewportToTopSoon();
    document.dispatchEvent(new CustomEvent(FLOW_EVENT));
    return;
  }
}

function removeNextButtons() {
  document.querySelectorAll(".glaucoma-next-wrap").forEach((el) => {
    try {
      el.parentElement?.classList.remove(NEXT_HOST_CLASS);
    } catch {}
    el.remove();
  });
}

function renderNextButtonForTarget(target) {
  const targetId = canonicalTarget(target);
  const pageEl =
    document.getElementById(targetId) || document.getElementById(target);
  if (!pageEl) return;
  if (pageEl.dataset.medicalStudentsReturn === "true") {
    removeNextButtons();
    return;
  }

  const idx = resolveFlowIndexForCurrentTarget(target);
  if (idx == null) {
    removeNextButtons();
    return;
  }

  const current = FLOW[idx];

  removeNextButtons();

  const host =
    pageEl.querySelector(".container.pupils-container") ||
    pageEl.querySelector(".container") ||
    pageEl;
  host.classList.add(NEXT_HOST_CLASS);

  const wrap = document.createElement("div");
  wrap.className = "glaucoma-next-wrap";

  const previousBtn = document.createElement("button");
  previousBtn.type = "button";
  previousBtn.className = "glaucoma-prev-btn";
  previousBtn.textContent = "< Previous";
  previousBtn.setAttribute("data-i18n", "i18nLiteral.< Previous");
  previousBtn.addEventListener("click", async () => {
    try {
      sessionStorage.setItem("glaucomaWorkshop:restoreOpenFolder", "1");
    } catch {}

    if (current.previous === WORKSHOP_HOME) {
      setStoredFlowIndex(null);
    } else if (FLOW[idx - 1] && FLOW[idx - 1].target === current.previous) {
      setStoredFlowIndex(idx - 1);
    } else {
      const previousIndices = TARGET_TO_INDICES.get(current.previous) || [];
      setStoredFlowIndex(previousIndices[0] ?? null);
    }

    await navigateToTarget(current.previous);
  });

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "glaucoma-next-btn";
  btn.textContent = current.next === WORKSHOP_HOME ? "Next >" : "Next >";
  btn.setAttribute("data-i18n", "i18nLiteral.Next >");
  const ready = getGlaucomaLessonProgress(targetId) >= 100;
  btn.classList.toggle("is-ready", ready);

  btn.addEventListener("click", async () => {
    try {
      sessionStorage.setItem("glaucomaWorkshop:restoreOpenFolder", "1");
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

  wrap.appendChild(previousBtn);
  wrap.appendChild(btn);
  host.appendChild(wrap);
  window.I18N?.applyTranslations?.(wrap);
}

export function initializeGlaucomaWorkshopNextFlowInfra() {
  if (nextInfraWired) return;
  nextInfraWired = true;

  document.addEventListener("page:shown", (e) => {
    const shownId = e?.detail?.id;
    if (!shownId) return;
    renderNextButtonForTarget(shownId);
  });

  window.addEventListener("page:loaded", (e) => {
    const routeName = e?.detail?.routeName;
    const flowRoutes = new Set([
      "glaucomaWorkshop",
      "glaucomaScrollImages",
      "videos",
      "glaucomaQuizCaseStudy",
      "glaucomaHistoryCaseStudy",
    ]);
    if (!flowRoutes.has(routeName)) {
      setFlowEnabled(false);
      setStoredFlowIndex(null);
      removeNextButtons();
      return;
    }
    if (routeName === "glaucomaWorkshop") removeNextButtons();

    requestAnimationFrame(() => {
      const visibleId = getVisiblePageId();
      if (!visibleId) return;
      renderNextButtonForTarget(visibleId);
    });
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

  requestAnimationFrame(() => {
    const visibleId = getVisiblePageId();
    if (!visibleId) return;
    renderNextButtonForTarget(visibleId);
  });
}

export function assignGlaucomaWorkshopFlowIndices(page) {
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

export function rememberGlaucomaWorkshopFlowFromRow(row) {
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
