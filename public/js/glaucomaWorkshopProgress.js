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
const FIT_CLASS = "glaucoma-scroll-fit";

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

function getSectionLessonTargets(page, sectionKey) {
  if (!page || !sectionKey) return [];
  const section = page.querySelector(
    `.glaucoma-section-card[data-section="${sectionKey}"]`,
  );
  if (!section) return [];

  return Array.from(section.querySelectorAll(".lesson-row[data-target]"))
    .map((row) => row.getAttribute("data-target"))
    .filter(Boolean);
}

function updateGlaucomaFolderCompletionStamps(page) {
  if (!page) return;

  const folderRows = page.querySelectorAll(
    "#glaucomaWorkshopFolders .glaucoma-folder-row[data-folder]",
  );

  folderRows.forEach((row) => {
    const sectionKey = row.getAttribute("data-folder");
    const targets = getSectionLessonTargets(page, sectionKey);
    const isComplete =
      targets.length > 0 &&
      targets.every((target) => getGlaucomaLessonProgress(target) >= 100);

    row.classList.toggle("is-complete", isComplete);
  });
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

  updateGlaucomaFolderCompletionStamps(page);
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

function clearScrollFitState() {
  document.querySelectorAll(`.${FIT_CLASS}`).forEach((el) => {
    el.classList.remove(FIT_CLASS);
  });
}

function getImageOnlyContentBlock(pageEl) {
  if (!pageEl) return null;
  const container = pageEl.querySelector(".container.pupils-container");
  if (!container) return null;

  const children = Array.from(container.children).filter(
    (el) =>
      !el.classList.contains("eyes-topbar") &&
      el.tagName !== "STYLE" &&
      el.tagName !== "SCRIPT",
  );
  if (children.length !== 1) return null;

  const block = children[0];
  const imgs = Array.from(block.querySelectorAll(":scope > img"));
  if (!imgs.length) return null;

  const nonImg = Array.from(block.children).filter(
    (el) => el.tagName !== "IMG",
  );
  if (nonImg.length) return null;

  return block;
}

function evaluateScrollFitForTarget(target) {
  const pageEl = document.getElementById(target);
  if (!pageEl) return;
  pageEl.classList.remove(FIT_CLASS);

  const block = getImageOnlyContentBlock(pageEl);
  if (!block) return;

  const container = pageEl.querySelector(".container.pupils-container");
  const topbar = container?.querySelector(".eyes-topbar");

  const pageStyle = getComputedStyle(pageEl);
  const topbarHeight = topbar?.getBoundingClientRect().height || 0;
  const containerStyle = getComputedStyle(container);
  const blockStyle = getComputedStyle(block);

  let contentHeight = 0;
  block.querySelectorAll(":scope > img").forEach((img) => {
    const rect = img.getBoundingClientRect();
    const style = getComputedStyle(img);
    contentHeight +=
      rect.height +
      (parseFloat(style.marginTop) || 0) +
      (parseFloat(style.marginBottom) || 0);
  });

  const totalHeight =
    (parseFloat(pageStyle.paddingTop) || 0) +
    (parseFloat(pageStyle.paddingBottom) || 0) +
    topbarHeight +
    (parseFloat(containerStyle.paddingTop) || 0) +
    (parseFloat(containerStyle.paddingBottom) || 0) +
    (parseFloat(blockStyle.paddingTop) || 0) +
    (parseFloat(blockStyle.paddingBottom) || 0) +
    contentHeight;

  if (totalHeight <= (window.innerHeight || 0) - 8) {
    pageEl.classList.add(FIT_CLASS);
  }
}

function scheduleScrollFitEvaluation(target) {
  if (!target) return;
  requestAnimationFrame(() => {
    evaluateScrollFitForTarget(target);
    maybeCompleteActiveScrollLesson();
  });
}

function wireScrollFitRecheckOnImages(target) {
  const pageEl = document.getElementById(target);
  if (!pageEl) return;
  pageEl.querySelectorAll("img").forEach((img) => {
    if (img.complete) return;
    img.addEventListener(
      "load",
      () => {
        scheduleScrollFitEvaluation(target);
      },
      { once: true },
    );
    img.addEventListener(
      "error",
      () => {
        scheduleScrollFitEvaluation(target);
      },
      { once: true },
    );
  });
}

export function initializeGlaucomaWorkshopProgressInfra() {
  if (infraWired) return;
  infraWired = true;

  window.addEventListener("page:loaded", (e) => {
    const routeName = e?.detail?.routeName;
    if (routeName !== "glaucomaScrollImages") {
      activeScrollTarget = null;
      clearScrollFitState();
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
      scheduleScrollFitEvaluation(shownId);
      wireScrollFitRecheckOnImages(shownId);
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
  window.addEventListener(
    "resize",
    () => {
      scheduleScrollFitEvaluation(activeScrollTarget);
    },
    { passive: true },
  );
}
