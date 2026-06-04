import {
  getFolderCompletionColourForRow,
  syncLessonCompletionTick,
} from "./lessonCompletionTick.js";

const WORKSHOP_PROGRESS_PREFIX = "glaucomaWorkshop:progress:";
const WORKSHOP_PROGRESS_EVENT = "glaucomaWorkshop:progress-changed";
const WORKSHOP_FOLDER_COMPLETED_PREFIX = "glaucomaWorkshop:folderCompletedAt:";
const FOLDER_COMPLETE_COLOUR = "#15e115";

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

const INTERMEDIATE_SCROLL_TARGETS = new Set([
  "glaucomaFieldsExam",
  "glaucomaQuadrantsFingers",
  "glaucomaQuadrantsRed",
  "glaucomaAssessRecord",
  "glaucomaACDScroll",
  "glaucomaHighIOP",
  "glaucomaOpticNerve",
  "glaucomaCupping",
]);

const PDF_TARGETS = new Set([
  "glaucomaFundusSummaryAtomsPage",
  "glaucomaGlaucomaSummaryAtomsPage",
]);

let infraWired = false;
let activeScrollTarget = null;
const FIT_CLASS = "glaucoma-scroll-fit";

function getScrollyScrollRoot(node) {
  let current = node?.parentElement ?? null;

  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY || style.overflow;
    if (/(auto|scroll|overlay)/.test(overflowY)) return current;
    current = current.parentElement;
  }

  return window;
}

function getScrollyRootMetrics(scrollRoot) {
  if (scrollRoot === window) {
    return {
      top: 0,
      height: window.innerHeight || document.documentElement.clientHeight || 1,
    };
  }

  const rect = scrollRoot.getBoundingClientRect();
  return {
    top: rect.top,
    height: scrollRoot.clientHeight || rect.height || 1,
  };
}

function isScrollyPageShown(page) {
  let node = page;
  while (node) {
    const style = window.getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") return false;
    node = node.parentElement;
  }
  return true;
}

function applyGlaucomaScrollyLevel(page) {
  page.dataset.glaucomaLevel = INTERMEDIATE_SCROLL_TARGETS.has(page.id)
    ? "intermediate"
    : "primary";
}

function initializeGlaucomaScrollyPage(page) {
  if (!page?.classList?.contains("glaucoma-scrolly-page")) return;

  applyGlaucomaScrollyLevel(page);

  if (typeof page._glaucomaScrollyCleanup === "function") {
    page._glaucomaScrollyCleanup();
  }

  const steps = Array.from(
    page.querySelectorAll("[data-glaucoma-scroll-step]"),
  );
  if (!steps.length) return;

  const controller = new AbortController();
  const { signal } = controller;
  const initialScrollRoot = getScrollyScrollRoot(page);
  let rafId = 0;

  const render = () => {
    rafId = 0;
    if (!isScrollyPageShown(page)) return;

    const scrollRoot = getScrollyScrollRoot(page);
    const rootMetrics = getScrollyRootMetrics(scrollRoot);
    const revealTop = rootMetrics.top + rootMetrics.height * 0.12;
    const revealBottom = rootMetrics.top + rootMetrics.height * 0.84;
    let hasCurrent = false;

    steps.forEach((step, index) => {
      const rect = step.getBoundingClientRect();
      const intersects = rect.top < revealBottom && rect.bottom > revealTop;
      const shouldReveal =
        intersects || (index === 0 && rect.top < revealBottom);

      if (shouldReveal) step.classList.add("is-visible");

      if (intersects && !hasCurrent) {
        step.classList.add("is-current");
        hasCurrent = true;
      } else {
        step.classList.remove("is-current");
      }
    });
  };

  const scheduleRender = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(render);
  };

  const listen = (target, type, handler, options = {}) => {
    if (!target?.addEventListener) return;
    target.addEventListener(type, handler, { ...options, signal });
  };

  listen(window, "scroll", scheduleRender, { passive: true });
  const pageContent = document.getElementById("page-content");
  listen(pageContent, "scroll", scheduleRender, { passive: true });
  if (initialScrollRoot !== window && initialScrollRoot !== pageContent) {
    listen(initialScrollRoot, "scroll", scheduleRender, { passive: true });
  }

  listen(window, "resize", scheduleRender, { passive: true });
  listen(window, "orientationchange", scheduleRender, { passive: true });

  page.querySelectorAll("img").forEach((img) => {
    if (img.complete) return;
    listen(img, "load", scheduleRender, { once: true });
    listen(img, "error", scheduleRender, { once: true });
  });

  page._glaucomaScrollyCleanup = () => {
    controller.abort();
    if (rafId) window.cancelAnimationFrame(rafId);
    delete page._glaucomaScrollyCleanup;
  };

  window.requestAnimationFrame(scheduleRender);
}

export function initializeGlaucomaScrollyPages(root = document) {
  root
    .querySelectorAll?.(".glaucoma-scrolly-page")
    .forEach((page) => initializeGlaucomaScrollyPage(page));
}

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

function clampPositiveInt(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.floor(n);
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

function folderCompletedAtKey(sectionKey) {
  return `${WORKSHOP_FOLDER_COMPLETED_PREFIX}${sectionKey}`;
}

function readProgressFromStorageKey(key) {
  const data = readJSON(key);
  return {
    percent: clampPercent(data?.percent ?? 0),
    updatedAt: clampTimestamp(data?.updatedAt),
  };
}

function getGlaucomaLessonProgressSnapshot(target) {
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

function readStoredFolderCompletion(sectionKey) {
  if (!sectionKey) return { count: 0, completedAt: 0 };
  const data = readJSON(folderCompletedAtKey(sectionKey));
  const completedAt = clampTimestamp(data?.completedAt);
  const countRaw = clampPositiveInt(data?.count);

  // Backward compatibility: old format stored only completedAt.
  const count = countRaw || (completedAt ? 1 : 0);
  return { count, completedAt };
}

function writeStoredFolderCompletion(sectionKey, { count, completedAt }) {
  if (!sectionKey) return;
  const safeCount = clampPositiveInt(count);
  const safeTimestamp = clampTimestamp(completedAt);
  if (!safeCount || !safeTimestamp) return;
  writeJSON(folderCompletedAtKey(sectionKey), {
    count: safeCount,
    completedAt: safeTimestamp,
  });
}

function clearFolderCompletionMeta(metaEl) {
  if (!metaEl) return;
  metaEl.textContent = "";
  metaEl.classList.remove("glaucoma-folder-complete-meta");
}

function setFolderCompletionMeta(row, isComplete) {
  const meta = row?.querySelector(".lesson-meta");
  if (meta) clearFolderCompletionMeta(meta);
  syncLessonCompletionTick(
    row,
    isComplete ? 100 : 0,
    getFolderCompletionColourForRow(row, FOLDER_COMPLETE_COLOUR),
  );
}

function clearFolderCompletionDate(row) {
  row
    ?.querySelectorAll?.(".glaucoma-folder-complete-rank-date")
    .forEach((dateEl) => dateEl.remove());
}

function setFolderCompletionDate(row) {
  clearFolderCompletionDate(row);
}

export function getGlaucomaLessonProgress(target) {
  return getGlaucomaLessonProgressSnapshot(target).percent;
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

  syncLessonCompletionTick(row, safe);
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
    const targetProgress = targets.map((target) =>
      getGlaucomaLessonProgressSnapshot(target),
    );
    const isComplete =
      targets.length > 0 &&
      targetProgress.every((state) => state.percent >= 100);

    const latestLessonCompletedAt = targetProgress.reduce(
      (latest, state) => Math.max(latest, state.updatedAt),
      0,
    );
    const stored = readStoredFolderCompletion(sectionKey);
    let completionCount = stored.count;
    let completedAt = stored.completedAt;
    let shouldPersist = false;

    if (isComplete) {
      if (!completionCount || !completedAt) {
        completionCount = 1;
        completedAt = latestLessonCompletedAt || Date.now();
        shouldPersist = true;
      } else {
        const allLessonsRecompletedAfterLastFolderCompletion =
          targetProgress.length > 0 &&
          targetProgress.every((state) => state.updatedAt > completedAt);

        if (allLessonsRecompletedAfterLastFolderCompletion) {
          completionCount += 1;
          completedAt = latestLessonCompletedAt || Date.now();
          shouldPersist = true;
        }
      }
    }

    if (shouldPersist) {
      writeStoredFolderCompletion(sectionKey, {
        count: completionCount,
        completedAt,
      });
    }

    row.classList.toggle("is-complete", isComplete);
    setFolderCompletionMeta(row, isComplete);
    setFolderCompletionDate(row, isComplete, completedAt, completionCount);
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

function isWindowAtBottom(threshold = 8) {
  const { scrollTop, viewport, fullHeight } = getScrollState();
  return scrollTop + viewport >= fullHeight - threshold;
}

function getViewedScrollPercent() {
  const { scrollTop, viewport, fullHeight } = getScrollState();
  if (fullHeight <= 0 || viewport <= 0) return 0;

  if (fullHeight <= viewport + 1) return 100;
  return clampPercent(((scrollTop + viewport) / fullHeight) * 100);
}

function maybeCompleteActiveScrollLesson() {
  if (!activeScrollTarget) return;

  const viewedPercent = getViewedScrollPercent();
  if (viewedPercent <= 0) return;

  if (isWindowAtBottom()) {
    markGlaucomaLessonComplete(activeScrollTarget);
    return;
  }

  setGlaucomaLessonProgress(activeScrollTarget, Math.min(99, viewedPercent));
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
    if (routeName === "glaucomaScrollImages") {
      initializeGlaucomaScrollyPages();
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
      initializeGlaucomaScrollyPage(document.getElementById(shownId));
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

  const pageContent = document.getElementById("page-content");
  pageContent?.addEventListener("scroll", maybeCompleteActiveScrollLesson, {
    passive: true,
  });
}
