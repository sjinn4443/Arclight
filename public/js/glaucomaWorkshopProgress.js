const WORKSHOP_PROGRESS_PREFIX = "glaucomaWorkshop:progress:";
const WORKSHOP_PROGRESS_EVENT = "glaucomaWorkshop:progress-changed";

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
  "glaucomaACDScroll",
  "glaucomaHighIOP",
  "glaucomaACDInteractive",
  "fundalReflexPage",
  "glaucomaOpticNerve",
  "glaucomaCupping",
  "glaucomaSummaryScrolly",
]);

const PDF_TARGETS = new Set([
  "glaucomaFundusSummaryAtomsPage",
  "glaucomaGlaucomaSummaryAtomsPage",
]);

let infraWired = false;
let activeScrollTarget = null;

function clampPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
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
  } catch {}
}

function workshopProgressKey(target) {
  return `${WORKSHOP_PROGRESS_PREFIX}${target}`;
}

function videoProgressKey(target) {
  return `videoProgress:${target}`;
}

function readPercentFromStorageKey(key) {
  const data = readJSON(key);
  return clampPercent(data?.percent ?? 0);
}

export function getGlaucomaLessonProgress(target) {
  if (!target) return 0;
  const customPercent = readPercentFromStorageKey(workshopProgressKey(target));
  const videoPercent = readPercentFromStorageKey(videoProgressKey(target));
  return Math.max(customPercent, videoPercent);
}

export function setGlaucomaLessonProgress(
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

  if (finalPercent !== prev || !Number.isFinite(prevObj?.percent)) {
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

export function markGlaucomaLessonComplete(target) {
  return setGlaucomaLessonProgress(target, 100);
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
    fill.setAttribute("aria-valuenow", String(rounded));
    fill.title = `${rounded}% complete`;
  }

  const bar = row.querySelector('.lesson-progress[role="progressbar"]');
  if (bar) {
    bar.setAttribute("aria-valuenow", String(rounded));
  }
}

export function updateGlaucomaWorkshopProgressBars(root = document) {
  const page =
    root?.querySelector?.("#glaucomaWorkshopPage") ||
    document.getElementById("glaucomaWorkshopPage");
  if (!page) return;

  page.querySelectorAll(".lesson-row[data-target]").forEach((row) => {
    const target = row.getAttribute("data-target");
    if (!target) return;
    setRowProgressUI(row, getGlaucomaLessonProgress(target));
  });
}

function isWindowAtBottom(threshold = 8) {
  const doc = document.documentElement;
  const body = document.body;
  const scrollTop = window.scrollY ?? doc?.scrollTop ?? body?.scrollTop ?? 0;
  const viewport = window.innerHeight ?? doc?.clientHeight ?? 0;
  const fullHeight = Math.max(doc?.scrollHeight || 0, body?.scrollHeight || 0);
  return scrollTop + viewport >= fullHeight - threshold;
}

function maybeCompleteActiveScrollLesson() {
  if (!activeScrollTarget) return;
  if (isWindowAtBottom()) {
    markGlaucomaLessonComplete(activeScrollTarget);
  }
}

export function initializeGlaucomaWorkshopProgressInfra() {
  if (infraWired) return;
  infraWired = true;

  window.addEventListener("page:loaded", (e) => {
    const routeName = e?.detail?.routeName;
    if (routeName !== "glaucomaScrollImages") {
      activeScrollTarget = null;
    }
    if (routeName === "glaucomaWorkshop") {
      updateGlaucomaWorkshopProgressBars();
    }
  });

  document.addEventListener("page:shown", (e) => {
    const shownId = e?.detail?.id;
    if (!shownId) return;

    if (PDF_TARGETS.has(shownId)) {
      markGlaucomaLessonComplete(shownId);
    }

    if (SCROLL_TARGETS.has(shownId)) {
      activeScrollTarget = shownId;
      requestAnimationFrame(maybeCompleteActiveScrollLesson);
      return;
    }

    activeScrollTarget = null;
  });

  document.addEventListener(WORKSHOP_PROGRESS_EVENT, () => {
    updateGlaucomaWorkshopProgressBars();
  });

  window.addEventListener("scroll", maybeCompleteActiveScrollLesson, {
    passive: true,
  });
  window.addEventListener("resize", maybeCompleteActiveScrollLesson, {
    passive: true,
  });
}
