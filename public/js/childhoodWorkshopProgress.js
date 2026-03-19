const WORKSHOP_PROGRESS_PREFIX = "childhoodWorkshop:progress:";
const WORKSHOP_PROGRESS_EVENT = "childhoodWorkshop:progress-changed";
const WORKSHOP_FOLDER_COMPLETED_PREFIX = "childhoodWorkshop:folderCompletedAt:";
const WORKSHOP_ROUTE_COMPLETE_EVENT = "childhoodWorkshop:route-complete";
const EXTERNAL_VIDEO_PROGRESS_EVENT = "glaucomaWorkshop:progress-changed";

const FOLDER_COMPLETE_STAR_SVG =
  '<svg class="childhood-folder-complete-star" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2.5l2.93 5.94 6.56.95-4.74 4.62 1.12 6.53L12 17.46l-5.87 3.08 1.12-6.53L2.5 9.39l6.56-.95L12 2.5z"/></svg>';
const FOLDER_COMPLETE_DATE_CLASS = "childhood-folder-complete-rank-date";

const SCROLL_TARGETS = new Set([
  "childhoodEyeBrainImagesPage",
  "childhoodIntroVisualDevelopmentPage",
  "childhoodNormalVisualDevelopmentPage",
  "childhoodAskQuestionsObservePage",
  "visualImpairmentPage",
  "signsVICasesPage",
  "childhoodReferPage",
  "childhoodFundalPreparationPage",
  "childhoodFundalExaminationPage",
  "childhoodFundalNewbornEyesOpenPage",
  "childhoodFundalNewbornEyesClosedPage",
  "childhoodFundalUnclearFindingsPage",
  "childhoodFundalPossibleFindingPage",
  "childhoodFundalAfterExaminationPage",
  "fundalReflexExaminationScrollPage",
]);

const ROUTE_COMPLETE_ONLY_TARGETS = new Set([
  "childhoodFundalPreparationPage",
  "childhoodFundalExaminationPage",
  "childhoodFundalNewbornEyesOpenPage",
  "childhoodFundalNewbornEyesClosedPage",
  "childhoodFundalUnclearFindingsPage",
  "childhoodFundalPossibleFindingPage",
  "childhoodFundalAfterExaminationPage",
  "fundalReflexExaminationScrollPage",
]);

const PDF_TARGETS = new Set([
  "atomsHandout1Page",
  "atomsHandout2Page",
  "fundalReflexPdfPage",
]);

const SCROLL_ROUTES = new Set([
  "childhoodEyeBrainImages",
  "childhoodAskQuestionsObservePage",
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
  "fundalReflexExaminationScroll",
]);

let infraWired = false;
let activeScrollTarget = null;
const scrollReadyTargets = new Set();
const FIT_CLASS = "childhood-scroll-fit";

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

function getChildhoodLessonProgressSnapshot(target) {
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

function formatFolderCompletedDate(timestamp) {
  const safeTimestamp = clampTimestamp(timestamp);
  if (!safeTimestamp) return "";

  const date = new Date(safeTimestamp);
  if (Number.isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function formatOrdinal(n) {
  const num = Math.trunc(Number(n));
  if (!Number.isFinite(num) || num <= 0) return "";

  const mod100 = num % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${num}th`;

  const mod10 = num % 10;
  if (mod10 === 1) return `${num}st`;
  if (mod10 === 2) return `${num}nd`;
  if (mod10 === 3) return `${num}rd`;
  return `${num}th`;
}

function clearFolderCompletionMeta(metaEl) {
  if (!metaEl) return;
  metaEl.textContent = "";
  metaEl.classList.remove("childhood-folder-complete-meta");
}

function setFolderCompletionMeta(row, isComplete) {
  const meta = row?.querySelector(".lesson-meta");
  if (!meta) return;

  if (!isComplete) {
    clearFolderCompletionMeta(meta);
    return;
  }

  const completionMarkup = FOLDER_COMPLETE_STAR_SVG;
  if (meta.innerHTML !== completionMarkup) {
    meta.innerHTML = completionMarkup;
  }
  meta.classList.add("childhood-folder-complete-meta");
}

function getFolderCompletionDateElement(row) {
  if (!row) return null;
  const existing = row.querySelector(`.${FOLDER_COMPLETE_DATE_CLASS}`);
  if (existing) return existing;

  const lessonMain = row.querySelector(".lesson-main");
  if (!lessonMain) return null;

  const dateEl = document.createElement("span");
  dateEl.className = FOLDER_COMPLETE_DATE_CLASS;
  lessonMain.appendChild(dateEl);
  return dateEl;
}

function clearFolderCompletionDate(row) {
  const dateEl = row?.querySelector(`.${FOLDER_COMPLETE_DATE_CLASS}`);
  if (!dateEl) return;
  dateEl.remove();
}

function setFolderCompletionDate(
  row,
  isComplete,
  completedAt,
  completionCount,
) {
  if (!isComplete) {
    clearFolderCompletionDate(row);
    return;
  }

  const ordinal = formatOrdinal(completionCount);
  const completedDate = formatFolderCompletedDate(completedAt);
  if (!ordinal || !completedDate) {
    clearFolderCompletionDate(row);
    return;
  }

  const dateEl = getFolderCompletionDateElement(row);
  if (!dateEl) return;

  const label = `${ordinal} ${completedDate}`;
  if (dateEl.textContent !== label) {
    dateEl.textContent = label;
  }

  const ariaLabel = `Completed ${ordinal} time on ${completedDate}`;
  dateEl.setAttribute("aria-label", ariaLabel);
  dateEl.title = ariaLabel;
}

export function getChildhoodLessonProgress(target) {
  return getChildhoodLessonProgressSnapshot(target).percent;
}

function isScrollLessonTarget(target) {
  return SCROLL_TARGETS.has(target);
}

export function isChildhoodLessonReadyForNext(target) {
  if (!target) return false;
  if (isScrollLessonTarget(target)) {
    return (
      scrollReadyTargets.has(target) ||
      getChildhoodLessonProgress(target) >= 100
    );
  }
  return getChildhoodLessonProgress(target) >= 100;
}

export function setChildhoodLessonProgress(
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

export function markChildhoodLessonComplete(target) {
  return setChildhoodLessonProgress(target, 100);
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
    `.childhood-section-card[data-section="${sectionKey}"]`,
  );
  return getLessonTargets(section);
}

function getLessonTargets(container) {
  if (!container) return [];

  return Array.from(container.querySelectorAll(".lesson-row[data-target]"))
    .map((row) => row.getAttribute("data-target"))
    .filter(Boolean);
}

function getFolderCompletionDescriptors(page) {
  if (!page) return [];

  const topLevelFolders = Array.from(
    page.querySelectorAll(
      "#childhoodWorkshopFolders .childhood-folder-row[data-folder]",
    ),
  ).map((row) => {
    const sectionKey = row.getAttribute("data-folder");
    return {
      row,
      sectionKey,
      targets: getSectionLessonTargets(page, sectionKey),
    };
  });

  const nestedFolders = Array.from(
    page.querySelectorAll(".lesson-row--folder[aria-controls]"),
  )
    .map((row) => {
      const controlledId = String(
        row.getAttribute("aria-controls") || "",
      ).trim();
      if (!controlledId) return null;

      const controlledEl = document.getElementById(controlledId);
      if (!controlledEl || !page.contains(controlledEl)) return null;

      const sectionKey = String(
        row.getAttribute("data-folder-progress-key") || row.id || controlledId,
      ).trim();
      if (!sectionKey) return null;

      return {
        row,
        sectionKey,
        targets: getLessonTargets(controlledEl),
      };
    })
    .filter(Boolean);

  return [...topLevelFolders, ...nestedFolders];
}

function updateChildhoodFolderCompletionStamps(page) {
  if (!page) return;

  const folderRows = getFolderCompletionDescriptors(page);

  folderRows.forEach(({ row, sectionKey, targets }) => {
    const targetProgress = targets.map((target) =>
      getChildhoodLessonProgressSnapshot(target),
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

export function updateChildhoodWorkshopProgressBars(root = document) {
  const page =
    root?.querySelector?.("#childhoodEyeScreeningWorkshopPage") ||
    document.getElementById("childhoodEyeScreeningWorkshopPage");
  if (!page) return;

  page.querySelectorAll(".lesson-row[data-target]").forEach((row) => {
    const target = row.getAttribute("data-target");
    if (!target) return;
    setRowProgressUI(row, getChildhoodLessonProgress(target));
  });

  updateChildhoodFolderCompletionStamps(page);
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

function hasScrolledFromTop(minScroll = 24) {
  const { scrollTop } = getScrollState();
  return scrollTop >= minScroll;
}

function hasScrollableRange(minRange = 8) {
  const { viewport, fullHeight } = getScrollState();
  return fullHeight - viewport > minRange;
}

function maybeCompleteActiveScrollLesson() {
  if (!activeScrollTarget) return;
  if (ROUTE_COMPLETE_ONLY_TARGETS.has(activeScrollTarget)) return;
  // Prevent instant auto-complete before the learner has actually scrolled
  // when there is a meaningful scroll range.
  if (hasScrollableRange() && !hasScrolledFromTop()) return;
  if (isWindowAtBottom()) {
    scrollReadyTargets.add(activeScrollTarget);
    markChildhoodLessonComplete(activeScrollTarget);
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

function updateFromExternalVideoProgress() {
  updateChildhoodWorkshopProgressBars();
}

export function initializeChildhoodWorkshopProgressInfra() {
  if (infraWired) return;
  infraWired = true;

  window.addEventListener("page:loaded", (e) => {
    const routeName = e?.detail?.routeName;
    if (!SCROLL_ROUTES.has(routeName)) {
      activeScrollTarget = null;
      clearScrollFitState();
    }
    if (routeName === "childhoodEyeScreeningWorkshop") {
      updateChildhoodWorkshopProgressBars();
    }
  });

  document.addEventListener("page:shown", (e) => {
    const shownId = e?.detail?.id;
    if (!shownId) return;

    if (PDF_TARGETS.has(shownId)) {
      markChildhoodLessonComplete(shownId);
    }

    if (SCROLL_TARGETS.has(shownId)) {
      // Re-arm per-visit scroll checks while still honoring persisted completion.
      scrollReadyTargets.delete(shownId);
      activeScrollTarget = shownId;
      scheduleScrollFitEvaluation(shownId);
      wireScrollFitRecheckOnImages(shownId);
      return;
    }

    activeScrollTarget = null;
  });

  document.addEventListener(WORKSHOP_ROUTE_COMPLETE_EVENT, (e) => {
    const target = e?.detail?.target;
    if (!target) return;
    markChildhoodLessonComplete(target);
  });

  document.addEventListener(WORKSHOP_PROGRESS_EVENT, () => {
    updateChildhoodWorkshopProgressBars();
  });

  document.addEventListener(
    EXTERNAL_VIDEO_PROGRESS_EVENT,
    updateFromExternalVideoProgress,
  );

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
