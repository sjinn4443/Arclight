const WORKSHOP_PROGRESS_PREFIX = "diabeticWorkshop:progress:";
const WORKSHOP_PROGRESS_EVENT = "diabeticWorkshop:progress-changed";
const DIABETIC_PROGRESS_COLOR = "#f25600";
const AUTO_COMPLETE_TARGETS = new Set(["diabeticPragmaticScreeningPage"]);
const SCROLL_TARGETS = new Set([
  "diabeticArclightPackagePage",
  "diabeticNcdClinicScreeningPage",
  "diabeticOtherEyeDiseasesScreeningPage",
  "diabeticWhatIsDiabetesPage",
  "diabeticTypesOfDiabetesPage",
  "diabeticWhatIsRetinopathyPage",
  "diabeticVisionLossInDiabetesPage",
  "diabeticNcdFlowIntroductionPage",
  "diabeticProliferativeOtherDiseasePage",
  "diabeticSimpleSafeScalableScrollPage",
  "diabeticProtocolOverviewPage",
  "diabeticProtocolPhaseAPage",
  "diabeticProtocolPhaseBPage",
  "diabeticProtocolNcdConsultationPage",
  "diabeticProtocolPhaseCPage",
  "diabeticProtocolFinalDecisionsPage",
]);

let infraWired = false;
let activeScrollTarget = null;

function clampPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function clampTimestamp(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n);
}

function readJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    void 0;
  }
}

function workshopProgressKey(target) {
  return `${WORKSHOP_PROGRESS_PREFIX}${target}`;
}

function videoProgressKey(target) {
  return `videoProgress:${target}`;
}

function readProgressFromStorageKey(key) {
  const data = readJSON(key);
  return {
    percent: clampPercent(data?.percent ?? 0),
    updatedAt: clampTimestamp(data?.updatedAt),
  };
}

function getDiabeticLessonProgressSnapshot(target) {
  if (!target) return { percent: 0, updatedAt: 0 };

  const custom = readProgressFromStorageKey(workshopProgressKey(target));
  const video = readProgressFromStorageKey(videoProgressKey(target));

  if (custom.percent > video.percent) return custom;
  if (video.percent > custom.percent) return video;

  return {
    percent: custom.percent,
    updatedAt: Math.max(custom.updatedAt, video.updatedAt),
  };
}

export function getDiabeticLessonProgress(target) {
  return getDiabeticLessonProgressSnapshot(target).percent;
}

export function setDiabeticLessonProgress(
  target,
  percent,
  { mode = "max" } = {},
) {
  if (!target) return 0;

  const next = clampPercent(percent);
  const key = workshopProgressKey(target);
  const prevObj = readJSON(key) || {};
  const prev = clampPercent(prevObj?.percent ?? 0);
  const finalPercent = mode === "replace" ? next : Math.max(prev, next);
  const shouldRefreshCompletedAt = next >= 100 && finalPercent >= 100;

  if (
    finalPercent !== prev ||
    !Number.isFinite(prevObj?.percent) ||
    shouldRefreshCompletedAt
  ) {
    writeJSON(key, {
      percent: finalPercent,
      updatedAt: Date.now(),
    });
  }

  document.dispatchEvent(
    new CustomEvent(WORKSHOP_PROGRESS_EVENT, {
      detail: { target, percent: finalPercent },
    }),
  );

  return finalPercent;
}

export function markDiabeticLessonComplete(target) {
  return setDiabeticLessonProgress(target, 100);
}

function setRowProgressUI(row, percent) {
  if (!row) return;

  const safe = clampPercent(percent);
  const rounded = Math.round(safe);

  const fill =
    row.querySelector(".lesson-progress__fill") ||
    row.querySelector(".progress-fill");
  if (fill) {
    fill.style.width = `${safe}%`;
    fill.style.backgroundColor = DIABETIC_PROGRESS_COLOR;
    fill.setAttribute("aria-valuenow", String(rounded));
    fill.title = `${rounded}% complete`;
  }

  const bar = row.querySelector('.lesson-progress[role="progressbar"]');
  if (bar) {
    bar.setAttribute("aria-valuenow", String(rounded));
  }
}

export function updateDiabeticWorkshopProgressBars(root = document) {
  const page =
    root?.querySelector?.("#diabeticRetinopathyWorkshopPage") ||
    document.getElementById("diabeticRetinopathyWorkshopPage");
  if (!page) return;

  page.querySelectorAll(".lesson-row[data-target]").forEach((row) => {
    const target = row.getAttribute("data-target");
    if (!target) return;
    setRowProgressUI(row, getDiabeticLessonProgress(target));
  });
}

function hasDiabeticLessonRow(target) {
  const page = document.getElementById("diabeticRetinopathyWorkshopPage");
  if (!page || !target) return false;

  return Array.from(page.querySelectorAll(".lesson-row[data-target]")).some(
    (row) => row.getAttribute("data-target") === target,
  );
}

function getWindowScrollState() {
  const doc = document.documentElement;
  const body = document.body;
  return {
    scrollTop: window.scrollY ?? doc?.scrollTop ?? body?.scrollTop ?? 0,
    viewport: window.innerHeight ?? doc?.clientHeight ?? 0,
    fullHeight: Math.max(doc?.scrollHeight || 0, body?.scrollHeight || 0),
  };
}

function getScrollState() {
  const windowState = getWindowScrollState();
  const pageContent = document.getElementById("page-content");
  if (!pageContent) return windowState;

  const pageState = {
    scrollTop: pageContent.scrollTop || 0,
    viewport: pageContent.clientHeight || 0,
    fullHeight: pageContent.scrollHeight || 0,
  };

  const pageRange = Math.max(0, pageState.fullHeight - pageState.viewport);
  const windowRange = Math.max(
    0,
    windowState.fullHeight - windowState.viewport,
  );
  const pageHasRange = pageRange > 1;
  const windowHasRange = windowRange > 1;

  if (pageHasRange && !windowHasRange) return pageState;
  if (windowHasRange && !pageHasRange) return windowState;

  if (pageState.scrollTop > 0 && windowState.scrollTop <= 0) return pageState;
  if (windowState.scrollTop > 0 && pageState.scrollTop <= 0) return windowState;

  if (!pageHasRange && !windowHasRange) return windowState;

  const pageProgress = pageHasRange ? pageState.scrollTop / pageRange : 0;
  const windowProgress = windowHasRange
    ? windowState.scrollTop / windowRange
    : 0;
  return pageProgress >= windowProgress ? pageState : windowState;
}

function isAtBottom(threshold = 8) {
  const { scrollTop, viewport, fullHeight } = getScrollState();
  return scrollTop + viewport >= fullHeight - threshold;
}

function hasScrolledFromTop(minScroll = 24) {
  const { scrollTop } = getScrollState();
  return scrollTop >= minScroll;
}

function maybeCompleteActiveScrollLesson() {
  if (!activeScrollTarget) return;
  if (!hasScrolledFromTop()) return;
  if (!isAtBottom()) return;
  markDiabeticLessonComplete(activeScrollTarget);
}

export function initializeDiabeticWorkshopProgressInfra() {
  if (infraWired) return;
  infraWired = true;

  window.addEventListener("page:loaded", (event) => {
    const routeName = event?.detail?.routeName;
    if (routeName === "diabeticRetinopathyWorkshop") {
      updateDiabeticWorkshopProgressBars();
      return;
    }

    if (routeName !== "videos" && routeName !== "glaucomaQuizCaseStudy") {
      activeScrollTarget = null;
    }
  });

  document.addEventListener("page:shown", (event) => {
    const shownId = event?.detail?.id;
    if (!shownId) return;

    if (AUTO_COMPLETE_TARGETS.has(shownId)) {
      markDiabeticLessonComplete(shownId);
      activeScrollTarget = null;
      return;
    }

    if (SCROLL_TARGETS.has(shownId)) {
      activeScrollTarget = shownId;
      requestAnimationFrame(() => {
        maybeCompleteActiveScrollLesson();
      });
      return;
    }

    if (shownId === "diabeticRetinopathyWorkshopPage") {
      updateDiabeticWorkshopProgressBars();
    }

    activeScrollTarget = null;
  });

  document.addEventListener(WORKSHOP_PROGRESS_EVENT, () => {
    updateDiabeticWorkshopProgressBars();
  });

  window.addEventListener("scroll", maybeCompleteActiveScrollLesson, {
    passive: true,
  });
  window.addEventListener("resize", maybeCompleteActiveScrollLesson, {
    passive: true,
  });

  const pageContent = document.getElementById("page-content");
  pageContent?.addEventListener("scroll", maybeCompleteActiveScrollLesson, {
    passive: true,
  });
}

export function syncDiabeticLessonProgressFromExternalTarget(target, percent) {
  if (!hasDiabeticLessonRow(target)) return 0;
  if (Number.isFinite(Number(percent))) {
    return setDiabeticLessonProgress(target, percent);
  }
  updateDiabeticWorkshopProgressBars();
  return getDiabeticLessonProgress(target);
}
