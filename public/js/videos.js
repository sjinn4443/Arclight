/**
 * @fileoverview This file contains videos related functions and logic.
 */

import { initializeVideoPlayers, initializeToolbar } from "./videoplayer.js";
import { loadPage, syncRouteHash, getRouteFromHash } from "./navigation.js";
import { showExperimentalMiniAppNoticeForPage } from "./experimentalMiniAppNotice.js";

// Keep track of the currently active subpage element within videos.html
let currentPageElement = null;

const __videosGlobalBoundKey = "__videosGlobalBound";
if (window[__videosGlobalBoundKey] == null) {
  window[__videosGlobalBoundKey] = false;
}

const EXTERNAL_GLAUCOMA_SCROLL_TARGETS = new Set([
  "glaucomaACDInteractive",
  "glaucomaRAPDFullSwingInteractive",
]);
let externalGlaucomaNavInFlight = false;
const CHILDHOOD_WORKSHOP_PROGRESS_PREFIX = "childhoodWorkshop:progress:";
const DIABETIC_WORKSHOP_PROGRESS_PREFIX = "diabeticWorkshop:progress:";
const CHILDHOOD_WORKSHOP_PROGRESS_EVENT = "childhoodWorkshop:progress-changed";
const DIABETIC_WORKSHOP_PROGRESS_EVENT = "diabeticWorkshop:progress-changed";
const CHILDHOOD_WORKSHOP_ROUTE_COMPLETE_EVENT =
  "childhoodWorkshop:route-complete";
const FUNDAL_REFLEX_EXAMINATION_SCROLL_PAGE_ID =
  "fundalReflexExaminationScrollPage";
const FUNDAL_REFLEX_EXAMINATION_SCROLL_ROUTE = "fundalReflexExaminationScroll";
const FUNDAL_REFLEX_EXAMINATION_PROGRESS_CAP = 95;
const VIDEO_PROGRESS_COMPLETION_WINDOW_MIN_SECONDS = 5;
const VIDEO_PROGRESS_COMPLETION_WINDOW_MAX_SECONDS = 15;
const VIDEO_PROGRESS_COMPLETION_WINDOW_RATIO = 0.1;
const VIDEO_PROGRESS_COMPLETION_MIN_WATCH_RATIO = 0.8;

// -------------------------
// Video progress (Pupils)
// -------------------------
const VIDEO_PROGRESS_KEYS = {
  pupilFullExamVideo: "videoProgress:pupilFullExamVideo",
};

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function readVideoProgress(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function clampStoredProgressPercent(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.min(100, num));
}

function clampStoredProgressTimestamp(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return 0;
  return Math.round(num);
}

function getVideoProgressCompletionTargetTime(duration) {
  const safeDuration = Number(duration);
  if (!Number.isFinite(safeDuration) || safeDuration <= 0) return 0;

  const completionWindow = Math.min(
    VIDEO_PROGRESS_COMPLETION_WINDOW_MAX_SECONDS,
    Math.max(
      VIDEO_PROGRESS_COMPLETION_WINDOW_MIN_SECONDS,
      safeDuration * VIDEO_PROGRESS_COMPLETION_WINDOW_RATIO,
    ),
  );

  return Math.max(
    0,
    Math.max(
      safeDuration - completionWindow,
      safeDuration * VIDEO_PROGRESS_COMPLETION_MIN_WATCH_RATIO,
    ),
  );
}

function calculateVideoProgressPercent(maxTime, duration) {
  const safeDuration = Number(duration);
  if (!Number.isFinite(safeDuration) || safeDuration <= 0) return 0;

  const safeMaxTime = Math.max(0, Math.min(safeDuration, Number(maxTime) || 0));

  if (safeMaxTime >= getVideoProgressCompletionTargetTime(safeDuration)) {
    return 100;
  }

  return Math.min(100, (safeMaxTime / safeDuration) * 100);
}

function normalizeProgressRecord(record) {
  return {
    percent: clampStoredProgressPercent(record?.percent),
    updatedAt: clampStoredProgressTimestamp(record?.updatedAt),
  };
}

function writeVideoProgress(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

function workshopProgressKeyForTarget(targetPageId) {
  return `${CHILDHOOD_WORKSHOP_PROGRESS_PREFIX}${targetPageId}`;
}

function readWorkshopProgressForTarget(targetPageId) {
  return normalizeProgressRecord(
    readVideoProgress(workshopProgressKeyForTarget(targetPageId)),
  );
}

function diabeticWorkshopProgressKeyForTarget(targetPageId) {
  return `${DIABETIC_WORKSHOP_PROGRESS_PREFIX}${targetPageId}`;
}

function readDiabeticWorkshopProgressForTarget(targetPageId) {
  return normalizeProgressRecord(
    readVideoProgress(diabeticWorkshopProgressKeyForTarget(targetPageId)),
  );
}

function writeWorkshopProgressForTarget(
  targetPageId,
  percent,
  { mode = "max" } = {},
) {
  if (!targetPageId) return 0;

  const storageKey = workshopProgressKeyForTarget(targetPageId);
  const previousRaw = readVideoProgress(storageKey);
  const previous = normalizeProgressRecord(previousRaw);
  const next = clampStoredProgressPercent(percent);
  const finalPercent =
    mode === "replace" ? next : Math.max(previous.percent, next);

  if (
    finalPercent !== previous.percent ||
    !Number.isFinite(Number(previousRaw?.percent))
  ) {
    writeVideoProgress(storageKey, {
      percent: finalPercent,
      updatedAt: Date.now(),
    });
  }

  document.dispatchEvent(
    new CustomEvent(CHILDHOOD_WORKSHOP_PROGRESS_EVENT, {
      detail: { target: targetPageId, percent: finalPercent },
    }),
  );

  return finalPercent;
}

function dispatchWorkshopProgressChanged(targetPageId) {
  if (!targetPageId) return;
  document.dispatchEvent(
    new CustomEvent(DIABETIC_WORKSHOP_PROGRESS_EVENT, {
      detail: { target: targetPageId },
    }),
  );
  document.dispatchEvent(
    new CustomEvent("glaucomaWorkshop:progress-changed", {
      detail: { target: targetPageId },
    }),
  );
}

function wirePupilFullExamProgress() {
  const video = document.getElementById("pupilFullExamVideo");
  if (!video || video.dataset.progressWired === "1") return;

  video.dataset.progressWired = "1";

  const storageKey = progressKeyForTarget("pupilFullExamPage");

  const save = () => {
    const duration = video.duration || 0;
    if (!duration) return;

    const prev = readVideoProgress(storageKey) || {};
    const maxTime = Math.max(prev.maxTime || 0, video.currentTime || 0);

    writeVideoProgress(storageKey, {
      maxTime,
      duration,
      percent: calculateVideoProgressPercent(maxTime, duration),
      updatedAt: Date.now(),
    });

    updateLessonProgressBars();
    dispatchWorkshopProgressChanged("pupilFullExamPage");
  };

  video.addEventListener("loadedmetadata", save);
  video.addEventListener("timeupdate", save);
  video.addEventListener("ended", () => {
    if (!video.duration) return;
    writeVideoProgress(storageKey, {
      maxTime: video.duration,
      duration: video.duration,
      percent: 100,
      updatedAt: Date.now(),
    });
    updateLessonProgressBars();
    dispatchWorkshopProgressChanged("pupilFullExamPage");
  });
}

// -------------------------
// Video progress (Generic: all toggle video pages)
// -------------------------
function progressKeyForTarget(targetPageId) {
  return `videoProgress:${targetPageId}`;
}

function readProgressForTarget(targetPageId) {
  const progressRecords = [
    normalizeProgressRecord(
      readVideoProgress(progressKeyForTarget(targetPageId)),
    ),
    readWorkshopProgressForTarget(targetPageId),
    readDiabeticWorkshopProgressForTarget(targetPageId),
  ];

  return progressRecords.reduce((best, current) => {
    if (current.percent > best.percent) return current;
    if (current.percent < best.percent) return best;

    return {
      percent: best.percent,
      updatedAt: Math.max(best.updatedAt, current.updatedAt),
    };
  });
}

function writeProgressForTarget(targetPageId, data) {
  writeVideoProgress(progressKeyForTarget(targetPageId), data);
}

function getWindowScrollMetrics() {
  const doc = document.documentElement;
  const body = document.body;
  return {
    scrollTop: window.scrollY ?? doc?.scrollTop ?? body?.scrollTop ?? 0,
    viewport: window.innerHeight ?? doc?.clientHeight ?? 0,
    fullHeight: Math.max(doc?.scrollHeight || 0, body?.scrollHeight || 0),
  };
}

function getPreferredScrollMetrics() {
  const windowMetrics = getWindowScrollMetrics();
  const pageContent = document.getElementById("page-content");
  if (!pageContent) return windowMetrics;

  const pageMetrics = {
    scrollTop: pageContent.scrollTop || 0,
    viewport: pageContent.clientHeight || 0,
    fullHeight: pageContent.scrollHeight || 0,
  };

  const pageRange = Math.max(0, pageMetrics.fullHeight - pageMetrics.viewport);
  const windowRange = Math.max(
    0,
    windowMetrics.fullHeight - windowMetrics.viewport,
  );

  if (pageRange > 1 && windowRange <= 1) return pageMetrics;
  if (windowRange > 1 && pageRange <= 1) return windowMetrics;
  if (pageMetrics.scrollTop > 0 && windowMetrics.scrollTop <= 0) {
    return pageMetrics;
  }
  if (windowMetrics.scrollTop > 0 && pageMetrics.scrollTop <= 0) {
    return windowMetrics;
  }

  const pageProgress = pageRange > 0 ? pageMetrics.scrollTop / pageRange : 0;
  const windowProgress =
    windowRange > 0 ? windowMetrics.scrollTop / windowRange : 0;

  return pageProgress >= windowProgress ? pageMetrics : windowMetrics;
}

function syncFundalReflexExaminationScrollProgress() {
  const page = document.getElementById(
    FUNDAL_REFLEX_EXAMINATION_SCROLL_PAGE_ID,
  );
  if (!page) return;
  if (
    currentPageElement?.id !== FUNDAL_REFLEX_EXAMINATION_SCROLL_PAGE_ID &&
    page.style.display === "none"
  ) {
    return;
  }

  const { scrollTop, viewport, fullHeight } = getPreferredScrollMetrics();
  const scrollRange = Math.max(0, fullHeight - viewport);
  if (scrollRange <= 1) return;

  const percent = Math.min(
    FUNDAL_REFLEX_EXAMINATION_PROGRESS_CAP,
    (Math.max(0, scrollTop) / scrollRange) *
      FUNDAL_REFLEX_EXAMINATION_PROGRESS_CAP,
  );

  writeWorkshopProgressForTarget(
    FUNDAL_REFLEX_EXAMINATION_SCROLL_PAGE_ID,
    percent,
  );
}

function scheduleFundalReflexExaminationScrollProgressSync() {
  requestAnimationFrame(() => {
    syncFundalReflexExaminationScrollProgress();
  });
}

// Get a colour that matches the level cap (Primary/Intermediate) for the row
function getLevelColourForRow(row) {
  const level = row.closest(".pupil-level");
  if (!level) return "";

  const cap = level.querySelector(".pupil-level__cap");
  if (!cap) return "";

  const bg = getComputedStyle(cap).backgroundColor;
  // ignore transparent
  if (!bg || bg === "rgba(0, 0, 0, 0)" || bg === "transparent") return "";
  return bg;
}

function updateLessonProgressBars() {
  // Update ALL lesson rows that point to a video page
  const rows = document.querySelectorAll(".lesson-row[data-target]");
  rows.forEach((row) => {
    const target = row.getAttribute("data-target");
    if (!target) return;

    const fill = row.querySelector(".lesson-progress__fill");
    if (!fill) return;

    const prog = readProgressForTarget(target);
    const percent = prog?.percent ?? 0;

    fill.style.width = `${percent}%`;
    fill.setAttribute("aria-valuenow", String(Math.round(percent)));
    fill.title = `${Math.round(percent)}% watched`;

    // Colour match: Primary uses its green, Intermediate uses its orange
    const c = getLevelColourForRow(row);
    if (c) fill.style.backgroundColor = c;
  });
}

const INTERACTIVE_FOLDER_ITEM_COUNTS_ENABLED = false;

function clearInteractiveFolderItemBadges(page) {
  page.querySelectorAll(".diabetic-folder-item-count").forEach((badge) => {
    badge.remove();
  });
  page
    .querySelectorAll(".interactive-folder-row[data-item-count]")
    .forEach((row) => {
      row.removeAttribute("data-item-count");
    });
}

function updateInteractiveFolderItemBadges(page) {
  if (!INTERACTIVE_FOLDER_ITEM_COUNTS_ENABLED) {
    clearInteractiveFolderItemBadges(page);
    return;
  }

  const folderRows = page.querySelectorAll(
    "#interactiveDemoQuizzesFolders .interactive-folder-row[data-folder]",
  );

  folderRows.forEach((row) => {
    const sectionKey = row.getAttribute("data-folder");
    if (!sectionKey) return;

    const section = page.querySelector(
      `.interactive-section-card[data-section="${sectionKey}"]`,
    );
    if (!section) return;

    const itemCount = section.querySelectorAll(
      ".lesson-row[data-lesson], .lesson-row[data-target]",
    ).length;
    const thumb = row.querySelector(".thumb");
    if (!thumb) return;

    let badge = thumb.querySelector(".diabetic-folder-item-count");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "diabetic-folder-item-count";
      thumb.appendChild(badge);
    }

    badge.textContent = String(itemCount);
    row.setAttribute("data-item-count", String(itemCount));
  });
}

function setupInteractiveLearningFolders() {
  const page = document.getElementById("interactiveLearningPage");
  if (!page) return;

  const folders = page.querySelectorAll(
    "#interactiveDemoQuizzesFolders .interactive-folder-row",
  );
  const sectionCards = page.querySelectorAll(".interactive-section-card");
  const foldersContainer = page.querySelector("#interactiveDemoQuizzesFolders");
  if (!foldersContainer) return;

  updateInteractiveFolderItemBadges(page);

  const hideAllSectionCards = () => {
    sectionCards.forEach((card) => {
      card.style.display = "none";
      const titleEl = card.querySelector("h3");
      titleEl?.querySelector(".see-all-toggle")?.remove();
    });
  };

  const showSectionByKey = (key) => {
    const card = page.querySelector(
      `.interactive-section-card[data-section="${key}"]`,
    );
    const openFolderRow = page.querySelector(
      `#interactiveDemoQuizzesFolders .interactive-folder-row[data-folder="${key}"]`,
    );
    if (!card || !openFolderRow) return;

    hideAllSectionCards();
    folders.forEach((row) => {
      row.style.display = "";
    });

    openFolderRow.style.display = "none";
    page.classList.add("diabetic-folder-open");
    openFolderRow.insertAdjacentElement("afterend", card);
    card.style.display = "";

    const titleEl = card.querySelector("h3");
    if (!titleEl) return;

    titleEl.style.display = "flex";
    titleEl.style.alignItems = "center";
    titleEl.style.width = "100%";

    const toggle = document.createElement("span");
    toggle.className = "see-all-toggle";
    toggle.setAttribute("role", "button");
    toggle.setAttribute("tabindex", "0");
    toggle.setAttribute("aria-expanded", "true");
    toggle.textContent = "Close ^";
    toggle.style.marginLeft = "auto";
    toggle.style.marginRight = "30px";
    toggle.style.whiteSpace = "nowrap";

    const closeNow = (event) => {
      event.preventDefault();
      event.stopPropagation();
      card.style.display = "none";
      toggle.remove();
      openFolderRow.style.display = "";
      page.classList.remove("diabetic-folder-open");
    };

    toggle.addEventListener("click", closeNow);
    toggle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") closeNow(event);
    });

    titleEl.appendChild(toggle);
  };

  hideAllSectionCards();
  folders.forEach((row) => {
    row.style.display = "";
  });
  foldersContainer.style.display = "flex";
  page.classList.remove("diabetic-folder-open");

  folders.forEach((row) => {
    if (row.dataset.interactiveFolderWired === "1") return;
    row.dataset.interactiveFolderWired = "1";

    const key = row.getAttribute("data-folder");
    if (!key) return;

    const openNow = (event) => {
      event.preventDefault();
      event.stopPropagation();
      showSectionByKey(key);
    };

    row.addEventListener("click", openNow);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") openNow(event);
    });
  });
}

// Wire progress tracking for a given pageId's local <video> (low/high only)
function wireProgressForVideoElement(videoEl, targetPageId) {
  if (!videoEl) return;

  const wiredKey = `progressWired_${String(targetPageId).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
  if (videoEl.dataset[wiredKey] === "1") return;
  videoEl.dataset[wiredKey] = "1";

  const save = () => {
    const duration = videoEl.duration || 0;
    if (!duration) return;

    const storageKey = progressKeyForTarget(targetPageId);
    const prev = readVideoProgress(storageKey) || {};
    const maxTime = Math.max(prev.maxTime || 0, videoEl.currentTime || 0);

    writeVideoProgress(storageKey, {
      maxTime,
      duration,
      percent: calculateVideoProgressPercent(maxTime, duration),
      updatedAt: Date.now(),
    });

    updateLessonProgressBars();
    dispatchWorkshopProgressChanged(targetPageId);
  };

  videoEl.addEventListener("loadedmetadata", save);
  videoEl.addEventListener("timeupdate", save);
  videoEl.addEventListener("ended", () => {
    if (!videoEl.duration) return;
    writeVideoProgress(progressKeyForTarget(targetPageId), {
      maxTime: videoEl.duration,
      duration: videoEl.duration,
      percent: 100,
      updatedAt: Date.now(),
    });
    updateLessonProgressBars();
    dispatchWorkshopProgressChanged(targetPageId);
  });
}

// -------------------------
// Lesson durations (Auto-fill | 00:00)
// -------------------------
const __durationCache = new Map();

function setLessonMetaForTarget(targetPageId, text) {
  document
    .querySelectorAll(`.lesson-row[data-target="${targetPageId}"] .lesson-meta`)
    .forEach((el) => {
      el.textContent = `| ${text}`;
    });
}

function getLowSrcForTarget(targetPageId) {
  // 1) toggle-driven pages: use VIDEO_PAGE_SOURCES low
  const cfg = VIDEO_PAGE_SOURCES[targetPageId];
  if (cfg?.sources?.low) return cfg.sources.low;

  // 2) fallback: look for a <video><source src="..."> inside that page
  const page = document.getElementById(targetPageId);
  if (!page) return "";
  const srcEl = page.querySelector("video source[src]");
  return srcEl?.getAttribute("src") || "";
}

function probeDuration(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(0);

    // Cache by src
    if (__durationCache.has(src)) return resolve(__durationCache.get(src));

    const v = document.createElement("video");
    v.preload = "metadata";
    v.muted = true;
    v.playsInline = true;

    const done = (d) => {
      const dur = Number.isFinite(d) ? d : 0;
      __durationCache.set(src, dur);
      resolve(dur);
      // cleanup
      v.removeAttribute("src");
      v.load();
    };

    v.addEventListener("loadedmetadata", () => done(v.duration || 0), {
      once: true,
    });
    v.addEventListener("error", () => done(0), { once: true });

    v.src = src;
  });
}

async function updateAllLessonDurations() {
  const rows = Array.from(
    document.querySelectorAll(".lesson-row[data-target]"),
  );
  const uniqueTargets = Array.from(
    new Set(rows.map((r) => r.getAttribute("data-target")).filter(Boolean)),
  );

  for (const target of uniqueTargets) {
    const lowSrc = getLowSrcForTarget(target);
    if (!lowSrc) continue;

    // Only fill if currently placeholder-like (00:00 etc) or empty
    // (optional: you can remove this guard to always overwrite)
    const dur = await probeDuration(lowSrc);
    if (dur > 0) setLessonMetaForTarget(target, formatTime(dur));
  }
}

function showPageFallback(id) {
  document.querySelectorAll(".page").forEach((p) => {
    p.style.display = "none";
  });
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
  document.dispatchEvent(new CustomEvent("page:shown", { detail: { id } }));

  if (id === "fundalReflexPage") {
    removeFundalReflexListFlowButtons();
    requestAnimationFrame(() => removeFundalReflexListFlowButtons());
    window.setTimeout(() => removeFundalReflexListFlowButtons(), 0);
  }

  if (id === FUNDAL_REFLEX_EXAMINATION_SCROLL_PAGE_ID) {
    syncFundalReflexExaminationTopbar();
    void initializeFundalReflexExaminationScrollGuide();
    scheduleFundalReflexExaminationScrollProgressSync();
  }
}

async function openExternalGlaucomaInteractive(targetId) {
  if (!EXTERNAL_GLAUCOMA_SCROLL_TARGETS.has(targetId)) return;
  if (externalGlaucomaNavInFlight) return;
  externalGlaucomaNavInFlight = true;

  try {
    try {
      sessionStorage.removeItem("glaucomaWorkshop:nextFlowEnabled");
      sessionStorage.removeItem("glaucomaWorkshop:nextFlowIndex");
    } catch {}

    document
      .querySelectorAll(".glaucoma-next-wrap")
      .forEach((el) => el.remove());

    await loadPage("glaucomaScrollImages");

    if (typeof window.showPage === "function") window.showPage(targetId);
    else showPageFallback(targetId);
    showExperimentalMiniAppNoticeForPage(targetId);

    try {
      const { initializeGlaucomaScrollInteractiveTarget } =
        await import("./glaucomaWorkshop.js");
      initializeGlaucomaScrollInteractiveTarget?.(targetId);
    } catch {}

    try {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch {}
  } finally {
    externalGlaucomaNavInFlight = false;
  }
}

function removeFundalReflexListFlowButtons() {
  const page = document.getElementById("fundalReflexPage");
  if (!page || !page.closest("#videos")) return;

  page
    .querySelectorAll(".childhood-next-wrap, .glaucoma-next-wrap")
    .forEach((el) => el.remove());
  page
    .querySelectorAll(".childhood-next-host, .glaucoma-next-host")
    .forEach((el) => {
      el.classList.remove("childhood-next-host", "glaucoma-next-host");
    });
}

function syncFundalReflexExaminationTopbar() {
  const page = document.getElementById(
    FUNDAL_REFLEX_EXAMINATION_SCROLL_PAGE_ID,
  );
  if (!page) return;

  const titleEl = page.querySelector(".eyes-topbar__title");
  if (titleEl) {
    titleEl.setAttribute("data-i18n", "auto.videos.fundal_reflex_examination");
    titleEl.textContent = "Fundal Reflex Examination";
  }

  const menuBtn = page.querySelector(".icon.menuBtn");
  if (menuBtn) {
    menuBtn.textContent = "\u2630";
  }

  window.I18N?.applyTranslations?.(page.querySelector(".eyes-topbar"));
}

async function initializeFundalReflexExaminationScrollGuide() {
  syncFundalReflexExaminationTopbar();
  try {
    const { initializeChildhoodFundalReflexScrollPage } =
      await import("./childhoodFundalPreparation.js");
    await initializeChildhoodFundalReflexScrollPage?.(
      FUNDAL_REFLEX_EXAMINATION_SCROLL_ROUTE,
    );
    scheduleFundalReflexExaminationScrollProgressSync();
  } catch (err) {
    console.error(
      "[videos] failed to initialize Fundal Reflex Examination guide",
      err,
    );
  }
}

// ----- Internal helper to show a specific videos subpage -----
// -------------------------
// 3-way toggle state (Pupil Full Exam)
// -------------------------
const PUPIL_MODE_KEY = "pupilFullExam:mode";
const PUPIL_MODES = ["low", "high", "online"];

function readPupilMode() {
  const m = localStorage.getItem(PUPIL_MODE_KEY);
  return PUPIL_MODES.includes(m) ? m : "low";
}

function writePupilMode(mode) {
  if (!PUPIL_MODES.includes(mode)) mode = "low";
  localStorage.setItem(PUPIL_MODE_KEY, mode);
}

function setTriToggleUI(root, mode) {
  if (!root) return;
  root.dataset.active = mode;
  const btns = root.querySelectorAll(".tri-toggle__btn");
  btns.forEach((btn) => {
    const isActive = btn.dataset.mode === mode;
    btn.setAttribute("aria-checked", isActive ? "true" : "false");
  });
}

// -------------------------
// Apply Pupil Full Exam mode (low/high/online)
// -------------------------
const PUPIL_VIDEO_SOURCES = {
  low: "videos/Core/Pupils/Pupils_Full_220p.mp4",
  high: "videos/Core/Pupils/Pupils_Full_720p.mp4",
  online: "https://www.youtube.com/embed/19pN7jSYHMw",
};

// -------------------------
// 3-way toggle state (Generic video pages)
// -------------------------
const GENERIC_VIDEO_MODES = ["low", "high", "online"];
const LANGUAGE_SPECIFIC_ONLINE_VIDEO_SOURCES = Object.freeze({
  vaWhoPage: {
    ne: "https://www.youtube.com/watch?v=xT3YChTq9Hw&list=PLGgJeAmXVYhYrF4j14zMBzhbdLmyWlHUQ&index=9",
  },
  vaNearVisionPage: {
    ne: "https://youtu.be/eU6zyT-SGTg?si=B-rLyEm95eyZEP6m",
  },
  assessmentVisionPage: {
    ne: "https://youtu.be/eU6zyT-SGTg?si=B-rLyEm95eyZEP6m",
  },
});

const VIDEO_PAGE_LANGUAGE_ALIASES = Object.freeze({
  english: "en",
  amharic: "am",
  arabic: "ar",
  bangla: "bn",
  chichewa: "ny",
  chinese: "zh",
  french: "fr",
  hausa: "ha",
  hindi: "hi",
  nepali: "ne",
  igbo: "ig",
  indonesian: "id",
  kinyarwanda: "rw",
  korean: "ko",
  telugu: "te",
  lingala: "ln",
  persian: "fa",
  portuguese: "pt",
  shona: "sn",
  spanish: "es",
  swahili: "sw",
  urdu: "ur",
  yoruba: "yo",
  zulu: "zu",
});

function normalizeVideoPageLanguage(lang) {
  const normalized = String(lang || "")
    .trim()
    .toLowerCase();
  return VIDEO_PAGE_LANGUAGE_ALIASES[normalized] || normalized;
}

function getCurrentAppLanguage() {
  try {
    const fromI18n = window.I18N?.getLanguage?.();
    if (fromI18n) return normalizeVideoPageLanguage(fromI18n);
  } catch {
    /* ignore */
  }

  try {
    const fromStorage = localStorage.getItem("prefLang");
    if (fromStorage) return normalizeVideoPageLanguage(fromStorage);
  } catch {
    /* ignore */
  }

  return normalizeVideoPageLanguage(
    document.documentElement.getAttribute("lang") || "en",
  );
}

function resolveVideoPageOnlineSource(pageId, fallbackSource = "") {
  const language = getCurrentAppLanguage();
  return (
    LANGUAGE_SPECIFIC_ONLINE_VIDEO_SOURCES[pageId]?.[language] || fallbackSource
  );
}

// Per-page sources for toggle-driven video pages
const VIDEO_PAGE_SOURCES = {
  // --- Visual Acuity subpages (NEW) ---
  vaWhoPage: {
    key: "videoMode:vaWhoPage",
    containerSelector: "#vaWhoContainer",
    videoSelector: "#vaWhoVideo",
    sources: {
      low: "videos/Core/VisualAcuity/VA_PEC1_220p.mp4",
      high: "videos/Core/VisualAcuity/VA_PEC1_720p.mp4",
      online: "https://youtu.be/R7z8_VxOO1U?si=v8Ft8bIZwaHIyXFl",
    },
    onlineTitle: "WHO Visual Acuity (online)",
    iframeClass: "videos-yt-va-who",
  },

  vaNearVisionPage: {
    key: "videoMode:vaNearVisionPage",
    containerSelector: "#vaNearVisionContainer",
    videoSelector: "#vaNearVisionVideo",
    sources: {
      low: "videos/Core/VisualAcuity/VA_NearDIst_220p.mp4",
      high: "videos/Core/VisualAcuity/VA_NearDIst_720p.mp4",
      online: "https://youtu.be/ji-ddMKnBa0?si=eW_M4JGarrFvGNi2",
    },
    onlineTitle: "Near Vision (online)",
    iframeClass: "videos-yt-va-near",
  },

  assessmentVisionPage: {
    key: "videoMode:assessmentVisionPage",
    containerSelector: "#assessmentVisionContainer",
    videoSelector: "#assessmentVisionVideo",
    sources: {
      low: "videos/Core/VisualAcuity/VA_Assessment_220p.mp4",
      high: "videos/Core/VisualAcuity/VA_Assessment_720p.mp4",
      online: "https://youtu.be/y1FIuL0lsPI?si=wpZZPIgtArTmY8Vi",
    },
    onlineTitle: "Assessment of Eyes and Vision (online)",
    iframeClass: "videos-yt-assess",
  },

  mumVisionPage: {
    key: "videoMode:mumVisionPage",
    containerSelector: "#mumVisionContainer",
    videoSelector: "#mumVisionVideo",
    sources: {
      low: "videos/Core/VisualAcuity/VA_Mum_220p.mp4",
      high: "videos/Core/VisualAcuity/VA_Mum_720p.mp4",
      online: "https://www.youtube.com/watch?v=OU8ueHEyfBA",
    },
    onlineTitle: "Visual Development (online)",
    iframeClass: "videos-yt-mum",
  },

  assessingVisualFunctionPage: {
    key: "videoMode:assessingVisualFunctionPage",
    containerSelector: "#assessingVisualFunctionPage .video-container",
    videoSelector: "#assessingVisualFunctionVideo",
    // This page is single-video (no toggle); keep low/high identical so
    // shared progress wiring can still track it by target id.
    sources: {
      low: "images/pdf/Workshop/Childhood/VisualDevelopment/01_ios.mp4",
      high: "images/pdf/Workshop/Childhood/VisualDevelopment/01_ios.mp4",
    },
    onlineTitle: "Assessing Visual Function (online)",
    iframeClass: "videos-yt-assessing-visual-function",
  },

  // --- Pupils: make these toggle-driven too (optional but aligns with your goal) ---
  pupilExamPECPage: {
    key: "videoMode:pupilExamPECPage",
    containerSelector: "#pupilExamPECPage .video-container",
    videoSelector: "#pupilExamPECVideo",
    sources: {
      low: "videos/Core/Pupils/Pupils_PEC_220p.mp4",
      high: "videos/Core/Pupils/Pupils_PEC_720p.mp4",
    },
    onlineTitle: "Pupil Exam PEC (online)",
    iframeClass: "videos-yt-pec",
  },

  rapdTestVideoPage: {
    key: "videoMode:rapdTestVideoPage",
    containerSelector: "#rapdTestVideoPage .video-container",
    videoSelector: "#rapdTestVideo",
    sources: {
      low: "videos/Core/Pupils/Pupils_RAPD24_220p.mp4",
      high: "videos/Core/Pupils/Pupils_RAPD24_720p.mp4",
      // online optional
    },
    onlineTitle: "RAPD Test Video (online)",
    iframeClass: "videos-yt-rapd",
  },

  fundalExamPage: {
    key: "videoMode:fundalExamPage",
    containerSelector: "#fundalExamContainer",
    videoSelector: "#fundalExamVideo",
    sources: {
      low: "videos/Core/FundalReflex/FR_Scotland_220p.mp4",
      high: "videos/Core/FundalReflex/FR_Scotland_720p.mp4",
      online:
        "https://www.youtube.com/watch?v=wCdbRxsWa6U&list=PLkZBIZv_vTvnjaOebDsMcV2c9sRzXkyU-&index=3",
    },
    onlineTitle: "Fundal Reflex Examination (online)",
    iframeClass: "videos-yt-fundal-exam",
  },

  fePecAnteriorSegmentPage: {
    key: "videoMode:fePecAnteriorSegmentPage",
    containerSelector: "#fePecAnteriorSegmentContainer",
    videoSelector: "#fePecAnteriorSegmentVideo",
    sources: {
      low: "videos/Core/FrontofEye/FE_PEC_220p.mp4",
      high: "videos/Core/FrontofEye/FE_PEC_720p.mp4",
    },
    onlineTitle: "PEC Anterior Segment (online)",
    iframeClass: "videos-yt-fe-pec",
  },

  feFullAnteriorSegmentPage: {
    key: "videoMode:feFullAnteriorSegmentPage",
    containerSelector: "#feFullAnteriorSegmentContainer",
    videoSelector: "#feFullAnteriorSegmentVideo",
    sources: {
      low: "videos/Core/FrontofEye/FE_Full_220p.mp4",
      high: "videos/Core/FrontofEye/FE_Full_720p.mp4",
    },
    onlineTitle: "Full Anterior Segment (online)",
    iframeClass: "videos-yt-fe-full",
  },

  fundalStillPage: {
    key: "videoMode:fundalStillPage",
    containerSelector: "#fundalStillContainer",
    videoSelector: "#fundalStillVideo",
    sources: {
      low: "videos/Core/FundalReflex/FRT Testing Tools/FR_Stillimg_220p.mp4",
      high: "videos/Core/FundalReflex/FRT Testing Tools/FR_Stillimg_720p.mp4",
    },
    onlineTitle: "Still Images (online)",
    iframeClass: "videos-yt-fundal-still",
  },

  fundalRealPage: {
    key: "videoMode:fundalRealPage",
    containerSelector: "#fundalRealContainer",
    videoSelector: "#fundalRealVideo",
    sources: {
      low: "videos/Core/FundalReflex/FRT Testing Tools/FR_SREN_220p.mp4",
      high: "videos/Core/FundalReflex/FRT Testing Tools/FR_SREN_720p.mp4",
    },
    onlineTitle: "Real Fundal Reflex Examinations (online)",
    iframeClass: "videos-yt-fundal-real",
  },

  // --- Direct Ophthalmoscopy video page (NEW id) ---
  directOphthalmoscopyVideoPage: {
    key: "videoMode:directOphthalmoscopyVideoPage",
    containerSelector: "#directOphthalmoscopyContainer",
    videoSelector: "#customVideo",
    sources: {
      low: "videos/Core/Ophthalmoscopy/DirectOphth_220p.mp4",
      high: "videos/Core/Ophthalmoscopy/DirectOphth_720p.mp4",
      online: "https://www.youtube.com/watch?v=rG99iRufXfU&t=41s",
    },
    onlineTitle: "Direct Ophthalmoscopy (online)",
    iframeClass: "videos-yt-do",
  },

  usaidHowToUseArclightPage: {
    key: "videoMode:usaidHowToUseArclightPage",
    containerSelector: "#usaidHowToUseArclightContainer",
    videoSelector: "#usaidHowToUseArclightVideo",
    sources: {
      low: "videos/USAID Childhood eye screening/1. How to use the Arclight - ENGLISH - HD_220p.mp4",
      high: "videos/USAID Childhood eye screening/1. How to use the Arclight - ENGLISH - HD_720p.mp4",
      online: "https://youtu.be/ibzvXsRfLiI?si=DI2MKpa0nuCgGz-k",
    },
    onlineTitle: "How to use the Arclight (online)",
    iframeClass: "videos-yt-usaid-howto",
  },

  usaidFundalReflexExamPage: {
    key: "videoMode:usaidFundalReflexExamPage",
    containerSelector: "#usaidFundalReflexExamContainer",
    videoSelector: "#usaidFundalReflexExamVideo",
    sources: {
      low: "videos/USAID Childhood eye screening/FundalReflexUSAID_220p.mp4",
      high: "videos/USAID Childhood eye screening/FundalReflexUSAID_720p.mp4",
    },
    onlineTitle: "Fundal Reflex Exam (online)",
    iframeClass: "videos-yt-usaid-fundal",
  },

  usaidNormalAbnormalPage: {
    key: "videoMode:usaidNormalAbnormalPage",
    containerSelector: "#usaidNormalAbnormalContainer",
    videoSelector: "#usaidNormalAbnormalVideo",
    sources: {
      low: "videos/USAID Childhood eye screening/4. Normal and Abnormal findings - ENGLISH - HD_220p.mp4",
      high: "videos/USAID Childhood eye screening/4. Normal and Abnormal findings - ENGLISH - HD_720p.mp4",
      online: "https://youtu.be/n837_zt_Vaw?si=VnQDItAVB1tZx-M0",
    },
    onlineTitle: "Normal and Abnormal findings (online)",
    iframeClass: "videos-yt-usaid-normal",
  },

  diabeticIntroductionToArclightVideoPage: {
    key: "videoMode:diabeticIntroductionToArclightVideoPage",
    containerSelector: "#diabeticIntroductionToArclightVideoContainer",
    videoSelector: "#diabeticIntroductionToArclightVideo",
    sources: {
      low: "videos/Workshop/Diabetic/1.ArclightIntroduction_eyesOnly_220p.mp4",
      high: "videos/Workshop/Diabetic/1.ArclightIntroduction_eyesOnly_720p.mp4",
    },
  },

  diabeticCausesOfVisionLossVideoPage: {
    key: "videoMode:diabeticCausesOfVisionLossVideoPage",
    containerSelector: "#diabeticCausesOfVisionLossVideoContainer",
    videoSelector: "#diabeticCausesOfVisionLossVideo",
    sources: {
      low: "videos/Workshop/Diabetic/3.DR_LossofVisionCause_220p.mp4",
      high: "videos/Workshop/Diabetic/3.DR_LossofVisionCause_720p.mp4",
    },
  },

  diabeticSimpleSafeScalableVideoPage: {
    key: "videoMode:diabeticSimpleSafeScalableVideoPage",
    containerSelector: "#diabeticSimpleSafeScalableVideoContainer",
    videoSelector: "#diabeticSimpleSafeScalableVideo",
    sources: {
      low: "videos/Workshop/Diabetic/4.DRSinNCDClinicflow_220p.mp4",
      high: "videos/Workshop/Diabetic/4.DRSinNCDClinicflow_720p.mp4",
    },
  },

  binocularIndirectOphthalmoscopyVideoPage: {
    key: "videoMode:binocularIndirectOphthalmoscopyVideoPage",
    containerSelector: "#binocularIndirectOphthalmoscopyVideoContainer",
    videoSelector: "#binocularIndirectOphthalmoscopyVideo",
    sources: {
      low: "videos/Tools/BIOvideo_220p.mp4",
      high: "videos/Tools/BIOvideo_720p.mp4",
      online: "https://www.youtube.com/watch?v=XrczPv4HkwY",
    },
    onlineTitle: "Binocular Indirect Ophthalmoscopy (online)",
    iframeClass: "videos-yt-bio",
  },

  glaucomaPupilReactionsVideoPage: {
    key: "videoMode:glaucomaPupilReactionsVideoPage",
    videoMode: "triToggle",
    containerSelector: "#glaucomaPupilReactionsVideoContainer",
    videoSelector: "#glaucomaPupilReactionsVideo",
    sources: {
      low: "videos/Workshop/Glaucoma/pupilreaction_220p.mp4",
      high: "videos/Workshop/Glaucoma/pupilreaction_720p.mp4",
    },
  },

  glaucomaSignsOfGlaucomaVideoPage: {
    key: "videoMode:glaucomaSignsOfGlaucomaVideoPage",
    videoMode: "triToggle",
    containerSelector: "#glaucomaSignsOfGlaucomaVideoContainer",
    videoSelector: "#glaucomaSignsOfGlaucomaVideo",
    sources: {
      low: "videos/Workshop/Glaucoma/FRsignsglaucoma_220p.mp4",
      high: "videos/Workshop/Glaucoma/FRsignsglaucoma_720p.mp4",
    },
  },

  glaucomaAnteriorChamberDepthVideoPage: {
    key: "videoMode:glaucomaAnteriorChamberDepthVideoPage",
    videoMode: "triToggle",
    containerSelector: "#glaucomaAnteriorChamberDepthVideoContainer",
    videoSelector: "#glaucomaAnteriorChamberDepthVideo",
    sources: {
      low: "videos/Workshop/Glaucoma/FRACD_220p.mp4",
      high: "videos/Workshop/Glaucoma/FRACD_720p.mp4",
    },
  },

  glaucomaACAGCaseWorkshopVideoPage: {
    key: "videoMode:glaucomaACAGCaseWorkshopVideoPage",
    videoMode: "triToggle",
    containerSelector: "#glaucomaACAGCaseWorkshopVideoContainer",
    videoSelector: "#glaucomaACAGCaseWorkshopVideo",
    sources: {
      low: "videos/Workshop/Glaucoma/FRACAG_220p.mp4",
      high: "videos/Workshop/Glaucoma/FRACAG_720p.mp4",
    },
  },

  glaucomaFundalReflexDiseaseVideoPage: {
    key: "videoMode:glaucomaFundalReflexDiseaseVideoPage",
    videoMode: "triToggle",
    containerSelector: "#glaucomaFundalReflexDiseaseVideoContainer",
    videoSelector: "#glaucomaFundalReflexDiseaseVideo",
    sources: {
      low: "videos/Workshop/Glaucoma/FRDisease_220p.mp4",
      high: "videos/Workshop/Glaucoma/FRDisease_720p.mp4",
    },
  },

  glaucomaOtherOpticNerveDiseasesVideoPage: {
    key: "videoMode:glaucomaOtherOpticNerveDiseasesVideoPage",
    videoMode: "triToggle",
    containerSelector: "#glaucomaOtherOpticNerveDiseasesVideoContainer",
    videoSelector: "#glaucomaOtherOpticNerveDiseasesVideo",
    sources: {
      low: "videos/Workshop/Glaucoma/opticdiseases_220p.mp4",
      high: "videos/Workshop/Glaucoma/opticdiseases_720p.mp4",
    },
  },

  glaucomaVisualFieldExamVideoPage: {
    key: "videoMode:glaucomaVisualFieldExamVideoPage",
    videoMode: "triToggle",
    containerSelector: "#glaucomaVisualFieldExamVideoContainer",
    videoSelector: "#glaucomaVisualFieldExamVideo",
    sources: {
      low: "videos/Workshop/Glaucoma/opticdiseases_220p.mp4",
      high: "videos/Workshop/Glaucoma/opticdiseases_720p.mp4",
    },
  },

  glaucomaDirectOphthalmoscopyDiscsAnnotatedVideoPage: {
    key: "videoMode:glaucomaDirectOphthalmoscopyDiscsAnnotatedVideoPage",
    videoMode: "triToggle",
    containerSelector: "#directOphthalmoscopyDiscsAnnotatedVideoContainer",
    videoSelector: "#directOphthalmoscopyDiscsAnnotatedVideo",
    sources: {
      low: "videos/Workshop/Glaucoma/DO_discsannotated_220p.mp4",
      high: "videos/Workshop/Glaucoma/DO_discsannotated_720p.mp4",
    },
  },

  glaucomaOpticDiscAnatomyVideoPage: {
    key: "videoMode:glaucomaOpticDiscAnatomyVideoPage",
    videoMode: "triToggle",
    containerSelector: "#opticDiscAnatomyVideoContainer",
    videoSelector: "#opticDiscAnatomyVideo",
    sources: {
      low: "videos/Workshop/Glaucoma/BE_opticdiscanatomy_220p.mp4",
      high: "videos/Workshop/Glaucoma/BE_opticdiscanatomy_720p.mp4",
    },
  },

  glaucomaMarginVideoPage: {
    key: "videoMode:glaucomaMarginVideoPage",
    videoMode: "triToggle",
    containerSelector: "#marginVideoContainer",
    videoSelector: "#marginVideo",
    sources: {
      low: "videos/Workshop/Glaucoma/BE_Margin_220p.mp4",
      high: "videos/Workshop/Glaucoma/BE_Margin_720p.mp4",
    },
  },

  glaucomaDiscCuppingVideoPage: {
    key: "videoMode:glaucomaDiscCuppingVideoPage",
    videoMode: "triToggle",
    containerSelector: "#discCuppingVideoContainer",
    videoSelector: "#discCuppingVideo",
    sources: {
      low: "videos/Workshop/Glaucoma/BE_disccuppingonly_220p.mp4",
      high: "videos/Workshop/Glaucoma/BE_disccuppingonly_720p.mp4",
    },
  },
};

const CHILDHOOD_EYE_SCREENING_SUBTITLE_CATALOG_URL =
  "/video-localization/childhood-eye-screening.json";
const VIDEO_PAGE_ACTION_ROW_SELECTOR = "[data-video-page-actions='true']";
const CHILDHOOD_EYE_SCREENING_SUBTITLE_PAGE_IDS = new Set([
  "assessmentVisionPage",
  "mumVisionPage",
  "usaidHowToUseArclightPage",
  "usaidFundalReflexExamPage",
  "usaidNormalAbnormalPage",
  "diabeticIntroductionToArclightVideoPage",
]);
const IOS_HLS_PREFERRED_SUBTITLE_PAGE_IDS = new Set([
  "assessmentVisionPage",
  "mumVisionPage",
  "usaidHowToUseArclightPage",
  "usaidFundalReflexExamPage",
  "usaidNormalAbnormalPage",
]);
const CHILDHOOD_EYE_SCREENING_SUBTITLE_LANGUAGES = {
  en: { label: "English" },
  am: { label: "Amharic" },
  ar: { label: "Arabic" },
  bn: { label: "Bangla" },
  ne: { label: "Nepali" },
  ny: { label: "Chichewa" },
  zh: { label: "Chinese" },
  fr: { label: "French" },
  ha: { label: "Hausa" },
  hi: { label: "Hindi" },
  ig: { label: "Igbo" },
  id: { label: "Indonesian" },
  rw: { label: "Kinyarwanda" },
  ko: { label: "Korean" },
  ln: { label: "Lingala" },
  fa: { label: "Persian" },
  pt: { label: "Portuguese" },
  sn: { label: "Shona" },
  es: { label: "Spanish" },
  sw: { label: "Swahili" },
  te: { label: "Telugu" },
  ur: { label: "Urdu" },
  yo: { label: "Yoruba" },
  zu: { label: "Zulu" },
};
const CHILDHOOD_EYE_SCREENING_HLS_MIME_TYPE = "application/vnd.apple.mpegurl";

let childhoodEyeScreeningSubtitleCatalogPromise = null;
const childhoodPilotSubtitleCueCache = new Map();
const childhoodPilotSubtitleOverlayStates = new WeakMap();
const childhoodPilotIosHlsStates = new WeakMap();

function isVideosRootDataPageElement(element) {
  return (
    element?.id === "videos" &&
    element?.getAttribute?.("data-page") === "videos"
  );
}

function normalizeChildhoodPilotSubtitleLanguage(lang) {
  const normalized = String(lang || "")
    .trim()
    .toLowerCase();
  return Object.prototype.hasOwnProperty.call(
    CHILDHOOD_EYE_SCREENING_SUBTITLE_LANGUAGES,
    normalized,
  )
    ? normalized
    : "en";
}

function isChildhoodEyeScreeningSubtitlePilotPage(pageId) {
  return CHILDHOOD_EYE_SCREENING_SUBTITLE_PAGE_IDS.has(
    String(pageId || "").trim(),
  );
}

function shouldKeepChildhoodPilotInlinePlayback(pageId) {
  return (
    isIOSChildhoodPilotDevice() &&
    isChildhoodEyeScreeningSubtitlePilotPage(pageId)
  );
}

function syncChildhoodPilotInlinePlaybackPreference(video, pageId) {
  if (!video) return;

  if (shouldKeepChildhoodPilotInlinePlayback(pageId)) {
    video.dataset.preventAutoFullscreen = "true";
    video.dataset.preferContainerFullscreen = "true";
    return;
  }

  delete video.dataset.preventAutoFullscreen;
  delete video.dataset.preferContainerFullscreen;
}

function getCurrentUiLanguage() {
  try {
    const fromI18n = window.I18N?.getLanguage?.();
    if (fromI18n) {
      return normalizeChildhoodPilotSubtitleLanguage(fromI18n);
    }
  } catch {
    /* ignore */
  }

  try {
    const stored = localStorage.getItem("prefLang");
    if (stored) {
      return normalizeChildhoodPilotSubtitleLanguage(stored);
    }
  } catch {
    /* ignore */
  }

  return normalizeChildhoodPilotSubtitleLanguage(
    document.documentElement.getAttribute("lang") || "en",
  );
}

function getChildhoodPilotSubtitleLabel(lang) {
  return (
    CHILDHOOD_EYE_SCREENING_SUBTITLE_LANGUAGES[
      normalizeChildhoodPilotSubtitleLanguage(lang)
    ]?.label || "English"
  );
}

function resolveChildhoodPilotSubtitleLanguage(
  availableLanguages,
  { prefLang = getCurrentUiLanguage(), defaultLang = "en" } = {},
) {
  const available = Array.from(
    new Set(
      (availableLanguages || [])
        .map((lang) => normalizeChildhoodPilotSubtitleLanguage(lang))
        .filter(Boolean),
    ),
  );

  if (!available.length) {
    return normalizeChildhoodPilotSubtitleLanguage(defaultLang);
  }

  const candidates = [prefLang, defaultLang, "en"]
    .map((lang) => {
      const raw = String(lang || "").trim();
      return raw ? normalizeChildhoodPilotSubtitleLanguage(raw) : "";
    })
    .filter(Boolean);

  for (const candidate of candidates) {
    if (available.includes(candidate)) return candidate;
  }

  return available[0];
}

function sanitizeChildhoodEyeScreeningSubtitleCatalog(rawCatalog = {}) {
  const sanitized = {};

  CHILDHOOD_EYE_SCREENING_SUBTITLE_PAGE_IDS.forEach((pageId) => {
    const entry = rawCatalog?.[pageId];
    if (!entry || typeof entry !== "object") return;

    const subtitles = {};
    Object.entries(entry.subtitles || {}).forEach(([lang, src]) => {
      if (typeof src !== "string" || !src.trim()) return;
      subtitles[normalizeChildhoodPilotSubtitleLanguage(lang)] = src;
    });

    if (!Object.keys(subtitles).length) return;

    const defaultSubtitleLang = resolveChildhoodPilotSubtitleLanguage(
      Object.keys(subtitles),
      {
        prefLang: normalizeChildhoodPilotSubtitleLanguage(
          entry.defaultSubtitleLang || "en",
        ),
        defaultLang: "en",
      },
    );

    const iosHlsLanguages = Array.from(
      new Set(
        (entry.iosHls?.subtitleLanguages || Object.keys(subtitles))
          .map((lang) => normalizeChildhoodPilotSubtitleLanguage(lang))
          .filter((lang) => Boolean(subtitles[lang])),
      ),
    );

    sanitized[pageId] = {
      subtitles,
      audioVariants:
        entry.audioVariants && typeof entry.audioVariants === "object"
          ? entry.audioVariants
          : {},
      defaultSubtitleLang,
      defaultAudioLang: normalizeChildhoodPilotSubtitleLanguage(
        entry.defaultAudioLang || "en",
      ),
      iosHls:
        entry.iosHls && typeof entry.iosHls === "object"
          ? {
              masterManifest:
                typeof entry.iosHls.masterManifest === "string"
                  ? entry.iosHls.masterManifest
                  : "",
              preferredMode:
                entry.iosHls.preferredMode === "online" ? "online" : "low",
              offlineFallbackMode:
                entry.iosHls.offlineFallbackMode === "high" ? "high" : "low",
              subtitleLanguages: iosHlsLanguages,
            }
          : {
              masterManifest: "",
              preferredMode: "low",
              offlineFallbackMode: "low",
              subtitleLanguages: Object.keys(subtitles),
            },
      localSources:
        entry.localSources && typeof entry.localSources === "object"
          ? entry.localSources
          : {},
    };
  });

  return sanitized;
}

async function loadChildhoodEyeScreeningSubtitleCatalog() {
  if (!childhoodEyeScreeningSubtitleCatalogPromise) {
    childhoodEyeScreeningSubtitleCatalogPromise = (async () => {
      try {
        const response = await fetch(
          CHILDHOOD_EYE_SCREENING_SUBTITLE_CATALOG_URL,
          { cache: "no-store" },
        );
        if (!response.ok) {
          throw new Error(
            `failed to load subtitle catalog: ${response.status}`,
          );
        }
        const rawCatalog = await response.json();
        return sanitizeChildhoodEyeScreeningSubtitleCatalog(rawCatalog);
      } catch (err) {
        console.warn("[videos] subtitle catalog unavailable", err);
        return {};
      }
    })();
  }

  return childhoodEyeScreeningSubtitleCatalogPromise;
}

async function getChildhoodPilotCatalogEntry(pageId) {
  if (!isChildhoodEyeScreeningSubtitlePilotPage(pageId)) return null;
  const catalog = await loadChildhoodEyeScreeningSubtitleCatalog();
  return catalog?.[pageId] || null;
}

function getVideoPageElement(pageId) {
  return document.getElementById(pageId);
}

function getVideoPageLocalVideoElement(pageId) {
  const page = getVideoPageElement(pageId);
  if (!page) return null;

  const selector = VIDEO_PAGE_SOURCES[pageId]?.videoSelector;
  return selector ? page.querySelector(selector) : page.querySelector("video");
}

function getVideoPageContainer(pageId) {
  const page = getVideoPageElement(pageId);
  if (!page) return null;

  const selector = VIDEO_PAGE_SOURCES[pageId]?.containerSelector;
  return selector
    ? page.querySelector(selector)
    : page.querySelector(".video-container");
}

function getVisibleVideoPageMediaElement(page) {
  const container = page?.querySelector(".video-container");
  if (!container) return null;

  const candidates = Array.from(container.querySelectorAll("video, iframe"));
  return (
    candidates.find((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && element.offsetParent !== null;
    }) ||
    candidates[0] ||
    null
  );
}

function alignVideoPageShareButton(pageId) {
  const page = getVideoPageElement(pageId);
  if (!page || page.style.display === "none") return;

  const shareButton = page.querySelector(".video-container + .video-share-btn");
  if (!shareButton) return;

  const mediaElement = getVisibleVideoPageMediaElement(page);
  if (!mediaElement) return;

  const navButtons = Array.from(
    page.querySelectorAll(
      ".childhood-next-btn, .glaucoma-next-btn, .diabetic-next-btn, .childhood-prev-btn, .glaucoma-prev-btn, .diabetic-prev-btn",
    ),
  ).filter((element) => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && element.offsetParent !== null;
  });
  if (!navButtons.length) return;

  if (!shareButton.dataset.baseMarginTop) {
    shareButton.dataset.baseMarginTop = String(
      parseFloat(getComputedStyle(shareButton).marginTop) || 0,
    );
  }

  const baseMarginTop = parseFloat(shareButton.dataset.baseMarginTop) || 0;
  shareButton.style.marginTop = `${baseMarginTop}px`;

  const mediaRect = mediaElement.getBoundingClientRect();
  const shareRect = shareButton.getBoundingClientRect();
  const navTop = Math.min(
    ...navButtons.map((element) => element.getBoundingClientRect().top),
  );
  const availableSpace = navTop - mediaRect.bottom - shareRect.height;
  if (!Number.isFinite(availableSpace)) return;

  const desiredGap = Math.max(0, availableSpace / 2);
  const desiredTop = mediaRect.bottom + desiredGap;
  const adjustedMarginTop = baseMarginTop + (desiredTop - shareRect.top);
  shareButton.style.marginTop = `${adjustedMarginTop}px`;
}

function scheduleVideoPageShareButtonAlignment(pageId) {
  if (!pageId) return;

  const run = () => alignVideoPageShareButton(pageId);
  run();
  window.requestAnimationFrame(run);
  window.setTimeout(run, 0);
  window.setTimeout(run, 120);
}

function alignVisibleVideoPageShareButtons() {
  document.querySelectorAll("#videos .page").forEach((page) => {
    if (page.style.display === "none") return;
    scheduleVideoPageShareButtonAlignment(page.id);
  });
}

function getVideoPageActionRow(page) {
  return page?.querySelector(VIDEO_PAGE_ACTION_ROW_SELECTOR) || null;
}

function ensureVideoPageMenuButtonForPage(pageId) {
  const page = getVideoPageElement(pageId);
  if (!page || page.querySelector(".eyes-topbar")) return null;

  const host =
    page.querySelector(".tri-toggle") ||
    page.querySelector(".video-header") ||
    page.querySelector(".video-container");
  if (!host?.parentNode) return null;

  let actionRow = getVideoPageActionRow(page);
  if (!actionRow) {
    actionRow = document.createElement("div");
    actionRow.className = "video-page-actions";
    actionRow.setAttribute("data-video-page-actions", "true");
    host.parentNode.insertBefore(actionRow, host);
  }

  const triToggle = page.querySelector(".tri-toggle");
  if (triToggle && triToggle.parentNode !== actionRow) {
    actionRow.appendChild(triToggle);
  }

  let menuBtn = actionRow.querySelector(".menuBtn");
  if (!menuBtn) {
    menuBtn = document.createElement("span");
    menuBtn.className = "icon menuBtn video-page-menu-btn";
    menuBtn.setAttribute("aria-label", "Menu");
    menuBtn.setAttribute("role", "button");
    menuBtn.setAttribute("tabindex", "0");
    menuBtn.textContent = "\u2630";
    actionRow.appendChild(menuBtn);
  }

  return actionRow;
}

function isVideoPageCurrentlyOnline(pageId) {
  const page = getVideoPageElement(pageId);
  if (page?.dataset?.currentVideoMode) {
    return page.dataset.currentVideoMode === "online";
  }
  const container = getVideoPageContainer(pageId);
  const iframe = container?.querySelector("iframe");
  return Boolean(iframe && iframe.style.display !== "none");
}

function refreshLanguageSpecificOnlineVideoSources() {
  Object.keys(LANGUAGE_SPECIFIC_ONLINE_VIDEO_SOURCES).forEach((pageId) => {
    if (!isVideoPageCurrentlyOnline(pageId)) return;
    void applyVideoPageMode(pageId, "online", { preserveTime: false });
  });
}

function prepareVideoForChildhoodPilotSubtitles(video) {
  if (!video) return;

  try {
    video.playsInline = true;
  } catch {
    /* ignore */
  }

  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  if (!video.getAttribute("crossorigin")) {
    video.setAttribute("crossorigin", "anonymous");
  }
  if (video.getAttribute("controlslist") === "nofullscreen noremoteplayback") {
    video.removeAttribute("controlslist");
  }
}

function isIOSChildhoodPilotDevice() {
  const nav = window.navigator;
  const userAgent = String(nav?.userAgent || "");
  const platform = String(nav?.platform || "");
  const maxTouchPoints = Number(nav?.maxTouchPoints || 0);

  return (
    /iP(hone|od|ad)/i.test(userAgent) ||
    (/Mac/i.test(platform) && maxTouchPoints > 1)
  );
}

function isDesktopSafariBrowser() {
  const nav = window.navigator;
  const userAgent = String(nav?.userAgent || "");
  const platform = String(nav?.platform || "");
  const maxTouchPoints = Number(nav?.maxTouchPoints || 0);
  return (
    /Safari/i.test(userAgent) &&
    !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS|Android|Mobile|iP(hone|od|ad)/i.test(
      userAgent,
    ) &&
    (/Macintosh/i.test(userAgent) ||
      (/Mac/i.test(platform) && maxTouchPoints === 0))
  );
}

function shouldUseChildhoodPilotSubtitlePanel() {
  return isDesktopSafariBrowser();
}

function shouldUseChildhoodPilotSubtitleOverlay() {
  return isIOSChildhoodPilotDevice();
}

function shouldUseIOSChildhoodPilotHls(pageId, entry = null) {
  const iosHls = entry?.iosHls || null;
  return Boolean(
    isIOSChildhoodPilotDevice() &&
    isChildhoodEyeScreeningSubtitlePilotPage(pageId) &&
    iosHls?.masterManifest,
  );
}

function shouldPreferOnlineIOSChildhoodPilotMode(pageId) {
  return (
    isIOSChildhoodPilotDevice() &&
    IOS_HLS_PREFERRED_SUBTITLE_PAGE_IDS.has(String(pageId || "").trim())
  );
}

function isNavigatorOnline() {
  return typeof navigator.onLine !== "boolean" ? true : navigator.onLine;
}

function getChildhoodPilotIosHlsState(video) {
  let state = childhoodPilotIosHlsStates.get(video);
  if (state) return state;
  state = {
    fallbackTimer: 0,
    requestToken: 0,
    trackList: null,
    trackListHandler: null,
  };
  childhoodPilotIosHlsStates.set(video, state);
  return state;
}

function clearChildhoodPilotIosHlsFallback(video) {
  const state = childhoodPilotIosHlsStates.get(video);
  if (!state?.fallbackTimer) return;
  window.clearTimeout(state.fallbackTimer);
  state.fallbackTimer = 0;
}

function detachChildhoodPilotIosHlsTrackList(video) {
  const state = childhoodPilotIosHlsStates.get(video);
  if (!state?.trackList || !state.trackListHandler) return;
  try {
    state.trackList.removeEventListener("addtrack", state.trackListHandler);
    state.trackList.removeEventListener("change", state.trackListHandler);
  } catch {
    /* ignore */
  }
  state.trackList = null;
  state.trackListHandler = null;
}

function resetChildhoodPilotIosHlsState(video) {
  clearChildhoodPilotIosHlsFallback(video);
  detachChildhoodPilotIosHlsTrackList(video);
}

function selectChildhoodPilotIosHlsSubtitleTrack(
  video,
  availableLanguages,
  preferredLang = getCurrentUiLanguage(),
) {
  if (!video) return "";

  const targetLang = resolveChildhoodPilotSubtitleLanguage(availableLanguages, {
    prefLang: preferredLang,
    defaultLang: "en",
  });

  try {
    let matched = false;
    const activeMode = getChildhoodPilotSubtitleActiveTrackMode(video);
    Array.from(video.textTracks || []).forEach((track) => {
      const kind = String(track.kind || "").toLowerCase();
      if (kind !== "subtitles" && kind !== "captions") return;
      const trackLang = normalizeChildhoodPilotSubtitleLanguage(
        track.language || track.srclang || "",
      );
      const shouldShow = trackLang === targetLang;
      track.mode = shouldShow ? activeMode : "disabled";
      if (shouldShow) matched = true;
    });

    if (!matched) {
      const firstSubtitleTrack = Array.from(video.textTracks || []).find(
        (track) => {
          const kind = String(track.kind || "").toLowerCase();
          return kind === "subtitles" || kind === "captions";
        },
      );
      if (firstSubtitleTrack) {
        firstSubtitleTrack.mode = activeMode;
      }
    }
  } catch {
    /* ignore */
  }

  return targetLang;
}

function scheduleChildhoodPilotIosHlsSubtitleSelection(
  video,
  availableLanguages,
  preferredLang,
) {
  if (!video) return;

  const apply = () =>
    selectChildhoodPilotIosHlsSubtitleTrack(
      video,
      availableLanguages,
      preferredLang,
    );

  [0, 120, 500, 1200, 2500].forEach((delay) => {
    window.setTimeout(apply, delay);
  });

  const events = [
    "loadedmetadata",
    "loadeddata",
    "canplay",
    "play",
    "playing",
    "webkitbeginfullscreen",
  ];
  events.forEach((eventName) => {
    video.addEventListener(eventName, apply, { once: true });
  });

  const state = getChildhoodPilotIosHlsState(video);
  detachChildhoodPilotIosHlsTrackList(video);

  if (
    video.textTracks &&
    typeof video.textTracks.addEventListener === "function"
  ) {
    state.trackList = video.textTracks;
    state.trackListHandler = apply;
    state.trackList.addEventListener("addtrack", apply);
    state.trackList.addEventListener("change", apply);
  }
}

function armChildhoodPilotIosHlsFallback(
  video,
  pageId,
  fallbackMode,
  requestToken,
) {
  if (!video) return;

  const state = getChildhoodPilotIosHlsState(video);
  clearChildhoodPilotIosHlsFallback(video);
  state.requestToken = requestToken;

  const clear = () => clearChildhoodPilotIosHlsFallback(video);
  ["loadedmetadata", "loadeddata", "canplay", "playing"].forEach(
    (eventName) => {
      video.addEventListener(eventName, clear, { once: true });
    },
  );

  state.fallbackTimer = window.setTimeout(() => {
    const page = getVideoPageElement(pageId);
    if (!page) return;
    if (page.dataset.videoModeRequestToken !== requestToken) return;
    if (page.dataset.currentVideoMode !== "online") return;
    void applyVideoPageMode(pageId, fallbackMode, { preserveTime: true });
  }, 8000);

  video.addEventListener(
    "error",
    () => {
      const page = getVideoPageElement(pageId);
      if (!page) return;
      if (page.dataset.videoModeRequestToken !== requestToken) return;
      if (page.dataset.currentVideoMode !== "online") return;
      clearChildhoodPilotIosHlsFallback(video);
      void applyVideoPageMode(pageId, fallbackMode, { preserveTime: true });
    },
    { once: true },
  );
}

function getChildhoodPilotSubtitleOverlayState(video) {
  let state = childhoodPilotSubtitleOverlayStates.get(video);
  if (state) return state;

  state = {
    currentText: "",
    cues: [],
    enabled: false,
    fullscreen: false,
    lang: "en",
    overlay: null,
    panel: null,
    requestToken: 0,
    wired: false,
  };
  childhoodPilotSubtitleOverlayStates.set(video, state);
  return state;
}

function ensureChildhoodPilotSubtitleOverlay(video) {
  if (!video) return null;

  const state = getChildhoodPilotSubtitleOverlayState(video);
  const container = video.closest(".video-container") || video.parentElement;
  if (!container) return null;

  container.classList.add("childhood-pilot-subtitle-host");

  let overlay = state.overlay;
  if (!overlay || !overlay.isConnected) {
    overlay = document.createElement("div");
    overlay.className = "childhood-pilot-subtitle-overlay";
    overlay.setAttribute("data-childhood-pilot-subtitle-overlay", "true");
    overlay.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    container.appendChild(overlay);
    state.overlay = overlay;
  }

  if (!state.wired) {
    const render = () => renderChildhoodPilotSubtitleOverlay(video);
    [
      "timeupdate",
      "seeking",
      "seeked",
      "loadedmetadata",
      "play",
      "pause",
      "ended",
    ].forEach((eventName) => {
      video.addEventListener(eventName, render);
    });
    video.addEventListener("webkitbeginfullscreen", () => {
      const nextState = getChildhoodPilotSubtitleOverlayState(video);
      nextState.fullscreen = true;
      showChildhoodPilotSubtitleTrack(video, nextState.lang);
      renderChildhoodPilotSubtitleOverlay(video);
    });
    video.addEventListener("webkitendfullscreen", () => {
      const nextState = getChildhoodPilotSubtitleOverlayState(video);
      nextState.fullscreen = false;
      showChildhoodPilotSubtitleTrack(video, nextState.lang);
      renderChildhoodPilotSubtitleOverlay(video);
    });
    state.wired = true;
  }

  return overlay;
}

function ensureChildhoodPilotSubtitlePanel(video) {
  if (!video) return null;

  const state = getChildhoodPilotSubtitleOverlayState(video);
  const container = video.closest(".video-container") || video.parentElement;
  if (!container) return null;

  let panel = state.panel;
  const needsInsert =
    !panel ||
    !panel.isConnected ||
    panel.parentElement !== container ||
    panel.previousElementSibling !== video;

  if (!panel || !panel.isConnected) {
    panel = document.createElement("div");
    panel.className = "childhood-pilot-subtitle-panel";
    panel.setAttribute("data-childhood-pilot-subtitle-panel", "true");
    panel.setAttribute("aria-live", "polite");
    panel.setAttribute("aria-atomic", "true");
    state.panel = panel;
  }

  if (needsInsert) {
    video.insertAdjacentElement("afterend", panel);
  }

  return panel;
}

function resetChildhoodPilotSubtitleOverlay(video) {
  if (!video) return;

  const state = childhoodPilotSubtitleOverlayStates.get(video);
  if (!state) return;

  state.currentText = "";
  state.cues = [];
  state.enabled = false;
  state.requestToken += 1;

  if (state.overlay) {
    state.overlay.hidden = true;
    state.overlay.textContent = "";
  }

  if (state.panel) {
    state.panel.hidden = true;
    state.panel.textContent = "";
  }
}

function getChildhoodPilotSubtitleActiveTrackMode(video) {
  const state = childhoodPilotSubtitleOverlayStates.get(video);
  return state?.enabled && !state.fullscreen ? "hidden" : "showing";
}

function parseChildhoodPilotSubtitleTimestamp(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) return Number.NaN;

  const parts = value.split(":");
  if (parts.length < 2 || parts.length > 3) return Number.NaN;

  const secondsParts = String(parts.pop() || "").split(".");
  if (secondsParts.length !== 2) return Number.NaN;

  const seconds = Number(secondsParts[0]);
  const milliseconds = Number(secondsParts[1].padEnd(3, "0").slice(0, 3));
  const minutes = Number(parts.pop() || 0);
  const hours = Number(parts.pop() || 0);

  if (
    [hours, minutes, seconds, milliseconds].some(
      (part) => !Number.isFinite(part),
    )
  ) {
    return Number.NaN;
  }

  return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}

function parseChildhoodPilotSubtitleVtt(vttText) {
  const normalized = String(vttText || "")
    .replace(/\uFEFF/g, "")
    .replace(/\r\n?/g, "\n")
    .trim();

  if (!normalized) return [];

  const cues = [];

  normalized.split(/\n{2,}/).forEach((block) => {
    const lines = block
      .split("\n")
      .map((line) => line.trimEnd())
      .filter(Boolean);

    if (!lines.length) return;
    if (/^WEBVTT\b/i.test(lines[0])) return;
    if (/^(NOTE|STYLE|REGION)\b/i.test(lines[0])) return;

    const timeLineIndex = lines.findIndex((line) => line.includes("-->"));
    if (timeLineIndex === -1) return;

    const timeLine = lines[timeLineIndex];
    const [startRaw, endWithSettings] = timeLine.split("-->");
    if (!startRaw || !endWithSettings) return;

    const start = parseChildhoodPilotSubtitleTimestamp(startRaw);
    const end = parseChildhoodPilotSubtitleTimestamp(
      endWithSettings.trim().split(/\s+/)[0],
    );

    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      return;
    }

    const text = lines
      .slice(timeLineIndex + 1)
      .map((line) => line.trim())
      .filter(Boolean)
      .join("\n");

    if (!text) return;
    cues.push({ start, end, text });
  });

  return cues;
}

async function loadChildhoodPilotSubtitleCues(src) {
  const normalizedSrc = String(src || "").trim();
  if (!normalizedSrc) return [];

  if (!childhoodPilotSubtitleCueCache.has(normalizedSrc)) {
    childhoodPilotSubtitleCueCache.set(
      normalizedSrc,
      fetch(normalizedSrc)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`failed to load subtitles: ${response.status}`);
          }
          return parseChildhoodPilotSubtitleVtt(await response.text());
        })
        .catch((err) => {
          childhoodPilotSubtitleCueCache.delete(normalizedSrc);
          console.warn("[videos] subtitle cue overlay unavailable", err);
          return [];
        }),
    );
  }

  return childhoodPilotSubtitleCueCache.get(normalizedSrc);
}

function renderChildhoodPilotSubtitleOverlay(video) {
  if (!video) return;

  const state = childhoodPilotSubtitleOverlayStates.get(video);
  const overlay = state?.overlay;
  const panel = state?.panel;
  if (!state || (!overlay && !panel)) return;

  if (!state.enabled || video.style.display === "none" || !state.cues.length) {
    state.currentText = "";
    if (overlay) {
      overlay.hidden = true;
      overlay.textContent = "";
    }
    if (panel) {
      panel.hidden = true;
      panel.textContent = "";
    }
    return;
  }

  const currentTime = Math.max(0, Number(video.currentTime) || 0);
  const activeText = state.cues
    .filter((cue) => currentTime >= cue.start && currentTime < cue.end)
    .map((cue) => cue.text)
    .join("\n");

  state.currentText = activeText;

  if (overlay) {
    if (state.fullscreen || !activeText) {
      overlay.hidden = true;
      overlay.textContent = "";
    } else {
      overlay.textContent = "";
      const cueNode = document.createElement("span");
      cueNode.className = "childhood-pilot-subtitle-overlay__cue";
      cueNode.textContent = activeText;
      overlay.appendChild(cueNode);
      overlay.hidden = false;
    }
  }

  if (panel) {
    if (state.fullscreen) {
      panel.hidden = true;
      panel.textContent = "";
      return;
    }

    panel.hidden = false;
    panel.textContent = "";

    if (activeText) {
      const cueNode = document.createElement("span");
      cueNode.className = "childhood-pilot-subtitle-panel__cue";
      cueNode.textContent = activeText;
      panel.appendChild(cueNode);
    }
  }
}

async function syncChildhoodPilotSubtitleOverlay(video, { lang, src }) {
  if (!video) return;

  const normalizedLang = normalizeChildhoodPilotSubtitleLanguage(lang);
  const state = getChildhoodPilotSubtitleOverlayState(video);
  state.lang = normalizedLang;
  const usePanel = shouldUseChildhoodPilotSubtitlePanel();
  const useOverlay = shouldUseChildhoodPilotSubtitleOverlay();

  if (!usePanel && !useOverlay) {
    resetChildhoodPilotSubtitleOverlay(video);
    showChildhoodPilotSubtitleTrack(video, normalizedLang);
    return;
  }

  const surface = usePanel
    ? ensureChildhoodPilotSubtitlePanel(video)
    : ensureChildhoodPilotSubtitleOverlay(video);
  if (!surface) return;

  if (usePanel && state.overlay) {
    state.overlay.hidden = true;
    state.overlay.textContent = "";
  }
  if (useOverlay && state.panel) {
    state.panel.hidden = true;
    state.panel.textContent = "";
  }

  const token = state.requestToken + 1;
  state.requestToken = token;

  const cues = await loadChildhoodPilotSubtitleCues(src);
  if (state.requestToken !== token) return;

  if (!cues.length) {
    resetChildhoodPilotSubtitleOverlay(video);
    showChildhoodPilotSubtitleTrack(video, normalizedLang);
    return;
  }

  state.cues = cues;
  state.currentText = "";
  state.enabled = true;
  showChildhoodPilotSubtitleTrack(video, normalizedLang);
  renderChildhoodPilotSubtitleOverlay(video);
}

function scheduleChildhoodPilotSubtitleResync(video, lang) {
  if (!video) return;

  const sync = () => {
    showChildhoodPilotSubtitleTrack(video, lang);
  };

  [0, 120, 360, 900].forEach((delay) => {
    window.setTimeout(sync, delay);
  });

  ["loadedmetadata", "canplay", "play", "loadeddata"].forEach((eventName) => {
    video.addEventListener(eventName, sync, { once: true });
  });

  video.addEventListener("webkitbeginfullscreen", sync, { once: true });
}

function primeChildhoodPilotNativeTrack(video, lang) {
  if (!video || !shouldUseChildhoodPilotSubtitleOverlay()) return;
  if (video.dataset.preventAutoFullscreen === "true") return;
  if (!video.paused) return;
  if ((Number(video.currentTime) || 0) > 0.1) return;

  const restoreTrack = () => {
    delete video.dataset.childhoodPilotNativeTrackPriming;
    showChildhoodPilotSubtitleTrack(video, lang);
  };

  if (video.dataset.childhoodPilotNativeTrackPriming === "1") return;
  video.dataset.childhoodPilotNativeTrackPriming = "1";

  video.addEventListener("loadedmetadata", restoreTrack, { once: true });
  video.addEventListener("loadeddata", restoreTrack, { once: true });

  try {
    video.load();
  } catch {
    restoreTrack();
  }
}

function removeChildhoodPilotSubtitleTracks(video) {
  if (!video) return;

  resetChildhoodPilotSubtitleOverlay(video);

  video
    .querySelectorAll("track[data-childhood-pilot-subtitle='true']")
    .forEach((trackEl) => trackEl.remove());

  try {
    Array.from(video.textTracks || []).forEach((track) => {
      track.mode = "disabled";
    });
  } catch {
    /* ignore */
  }
}

function showChildhoodPilotSubtitleTrack(video, lang) {
  if (!video) return;

  const activeLang = normalizeChildhoodPilotSubtitleLanguage(lang);
  let matched = false;

  try {
    Array.from(video.textTracks || []).forEach((track) => {
      const trackLang = normalizeChildhoodPilotSubtitleLanguage(
        track.language || track.srclang || "",
      );
      const shouldShow = trackLang === activeLang;
      track.mode = shouldShow
        ? getChildhoodPilotSubtitleActiveTrackMode(video)
        : "disabled";
      if (shouldShow) matched = true;
    });

    if (!matched && video.textTracks?.[0]) {
      video.textTracks[0].mode =
        getChildhoodPilotSubtitleActiveTrackMode(video);
    }
  } catch {
    /* ignore */
  }
}

function applyChildhoodPilotSubtitleTrack(video, { lang, src }) {
  if (!video || !src) return;

  prepareVideoForChildhoodPilotSubtitles(video);
  removeChildhoodPilotSubtitleTracks(video);

  const trackEl = document.createElement("track");
  trackEl.kind = "captions";
  trackEl.label = getChildhoodPilotSubtitleLabel(lang);
  trackEl.srclang = normalizeChildhoodPilotSubtitleLanguage(lang);
  trackEl.src = src;
  trackEl.default = true;
  trackEl.setAttribute("kind", "captions");
  trackEl.setAttribute("default", "");
  trackEl.setAttribute("data-childhood-pilot-subtitle", "true");
  trackEl.addEventListener(
    "load",
    () => {
      showChildhoodPilotSubtitleTrack(video, lang);
      try {
        if (trackEl.track) {
          trackEl.track.mode = "showing";
        }
      } catch {
        /* ignore */
      }
    },
    { once: true },
  );

  video.appendChild(trackEl);
  showChildhoodPilotSubtitleTrack(video, lang);
  scheduleChildhoodPilotSubtitleResync(video, lang);
  primeChildhoodPilotNativeTrack(video, lang);
  void syncChildhoodPilotSubtitleOverlay(video, { lang, src });
}

async function syncChildhoodPilotSubtitlesForPage(
  pageId,
  { preferredLang } = {},
) {
  if (!isChildhoodEyeScreeningSubtitlePilotPage(pageId)) return "";

  const page = getVideoPageElement(pageId);
  if (!page) return "";

  const video = getVideoPageLocalVideoElement(pageId);
  if (video) {
    prepareVideoForChildhoodPilotSubtitles(video);
    syncChildhoodPilotInlinePlaybackPreference(video, pageId);
  }

  const entry = await getChildhoodPilotCatalogEntry(pageId);
  if (!entry) return "";

  const availableLanguages = Object.keys(entry.subtitles || {});
  if (!availableLanguages.length) return "";

  const resolvedLang = resolveChildhoodPilotSubtitleLanguage(
    availableLanguages,
    {
      prefLang: preferredLang || getCurrentUiLanguage(),
      defaultLang: entry.defaultSubtitleLang || "en",
    },
  );
  const trackSrc =
    entry.subtitles[resolvedLang] ||
    entry.subtitles[entry.defaultSubtitleLang] ||
    entry.subtitles.en ||
    "";

  const isOnline = isVideoPageCurrentlyOnline(pageId);
  const useSubtitlePanel = shouldUseChildhoodPilotSubtitlePanel();
  const useSubtitleOverlay = shouldUseChildhoodPilotSubtitleOverlay();

  if (!video) {
    return resolvedLang;
  }

  if (isOnline && shouldUseIOSChildhoodPilotHls(pageId, entry)) {
    removeChildhoodPilotSubtitleTracks(video);
    if (trackSrc) {
      await syncChildhoodPilotSubtitleOverlay(video, {
        lang: resolvedLang,
        src: trackSrc,
      });
    }
    scheduleChildhoodPilotIosHlsSubtitleSelection(
      video,
      entry.iosHls?.subtitleLanguages || availableLanguages,
      resolvedLang,
    );
    return resolvedLang;
  }

  if (isOnline) {
    removeChildhoodPilotSubtitleTracks(video);
    resetChildhoodPilotSubtitleOverlay(video);
    return resolvedLang;
  }

  if (useSubtitlePanel) {
    removeChildhoodPilotSubtitleTracks(video);
    if (trackSrc) {
      await syncChildhoodPilotSubtitleOverlay(video, {
        lang: resolvedLang,
        src: trackSrc,
      });
    } else {
      resetChildhoodPilotSubtitleOverlay(video);
    }
    return resolvedLang;
  }

  if (useSubtitleOverlay) {
    prepareVideoForChildhoodPilotSubtitles(video);

    if (!trackSrc) {
      resetChildhoodPilotSubtitleOverlay(video);
      return resolvedLang;
    }

    applyChildhoodPilotSubtitleTrack(video, {
      lang: resolvedLang,
      src: trackSrc,
    });
    return resolvedLang;
  }

  prepareVideoForChildhoodPilotSubtitles(video);

  if (!trackSrc) {
    resetChildhoodPilotSubtitleOverlay(video);
    return resolvedLang;
  }

  applyChildhoodPilotSubtitleTrack(video, {
    lang: resolvedLang,
    src: trackSrc,
  });

  return resolvedLang;
}

async function ensureChildhoodPilotSubtitleControlsForPage(pageId) {
  return syncChildhoodPilotSubtitlesForPage(pageId);
}

async function refreshChildhoodPilotSubtitlesForLanguageChange() {
  const preferredLang = getCurrentUiLanguage();

  for (const pageId of CHILDHOOD_EYE_SCREENING_SUBTITLE_PAGE_IDS) {
    const page = getVideoPageElement(pageId);
    if (!page) continue;
    await syncChildhoodPilotSubtitlesForPage(pageId, { preferredLang });
  }
}

function resetChildhoodPilotSubtitleCatalogForTests() {
  childhoodEyeScreeningSubtitleCatalogPromise = null;
}

function readGenericVideoMode(storageKey) {
  try {
    const m = localStorage.getItem(storageKey);
    return GENERIC_VIDEO_MODES.includes(m) ? m : "low";
  } catch {
    return "low";
  }
}

function writeGenericVideoMode(storageKey, mode) {
  try {
    if (!GENERIC_VIDEO_MODES.includes(mode)) mode = "low";
    localStorage.setItem(storageKey, mode);
  } catch {
    /* ignore */
  }
}

function toYouTubeEmbed(url) {
  // Accept youtu.be/<id>, youtube.com/watch?v=<id>, or already-embed URLs.
  // Return an embed URL without extra query params.
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    // Already embed
    if (host === "youtube.com" && u.pathname.startsWith("/embed/")) {
      return `https://www.youtube.com${u.pathname}`;
    }

    // youtu.be/<id>
    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    // youtube.com/watch?v=<id>
    const id = u.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}`;
  } catch {
    /* ignore */
  }

  // fallback: return as-is
  return url;
}

async function applyVideoPageMode(pageId, mode, { preserveTime = true } = {}) {
  const cfg = VIDEO_PAGE_SOURCES[pageId];
  if (!cfg) return;
  if (!GENERIC_VIDEO_MODES.includes(mode)) mode = "low";

  const page = document.getElementById(pageId);
  if (!page) return;
  const childhoodPilotEntry = await getChildhoodPilotCatalogEntry(pageId);
  const canUseIosHls = shouldUseIOSChildhoodPilotHls(
    pageId,
    childhoodPilotEntry,
  );
  const iosHlsFallbackMode =
    childhoodPilotEntry?.iosHls?.offlineFallbackMode || "low";
  if (canUseIosHls && mode === "high") mode = iosHlsFallbackMode;
  if (canUseIosHls && mode === "online" && !isNavigatorOnline()) {
    mode = iosHlsFallbackMode;
  }
  const requestToken = String(
    (Number(page.dataset.videoModeRequestToken || 0) || 0) + 1,
  );
  page.dataset.videoModeRequestToken = requestToken;
  page.dataset.currentVideoMode = mode;

  const toggle = page.querySelector(".tri-toggle");
  if (toggle) setTriToggleUI(toggle, mode);

  const container = page.querySelector(cfg.containerSelector);
  if (!container) return;

  const video = container.querySelector(cfg.videoSelector);
  const existingIframe = container.querySelector(`iframe.${cfg.iframeClass}`);
  syncChildhoodPilotInlinePlaybackPreference(video, pageId);

  let currentTime = 0;
  if (preserveTime && video) {
    currentTime = video.currentTime || 0;
  }

  if (mode === "online") {
    const languageSpecificOnlineSource = resolveVideoPageOnlineSource(
      pageId,
      "",
    );
    const iosHlsManifest = childhoodPilotEntry?.iosHls?.masterManifest || "";
    if (canUseIosHls && iosHlsManifest && !languageSpecificOnlineSource) {
      if (existingIframe) {
        existingIframe.remove();
      }

      if (!video) return;
      video.style.display = "block";
      resetChildhoodPilotIosHlsState(video);
      removeChildhoodPilotSubtitleTracks(video);

      const sourceEl = video.querySelector("source");
      if (sourceEl) {
        sourceEl.src = iosHlsManifest;
        sourceEl.type = CHILDHOOD_EYE_SCREENING_HLS_MIME_TYPE;
      } else {
        const source = document.createElement("source");
        source.src = iosHlsManifest;
        source.type = CHILDHOOD_EYE_SCREENING_HLS_MIME_TYPE;
        video.prepend(source);
      }

      const resolvedLang = await syncChildhoodPilotSubtitlesForPage(pageId, {
        preferredLang: getCurrentUiLanguage(),
      });
      if (page.dataset.videoModeRequestToken !== requestToken) return;

      armChildhoodPilotIosHlsFallback(
        video,
        pageId,
        iosHlsFallbackMode,
        requestToken,
      );

      try {
        video.load();
      } catch {}

      scheduleChildhoodPilotIosHlsSubtitleSelection(
        video,
        childhoodPilotEntry?.iosHls?.subtitleLanguages || [resolvedLang, "en"],
        resolvedLang,
      );

      const restore = () => {
        if (!preserveTime) return;
        const prog = readProgressForTarget(pageId);
        const savedTime = prog?.maxTime ?? 0;
        const targetTime = savedTime > 0 ? savedTime : currentTime;
        try {
          if (video.currentTime < 0.5 && targetTime > 0) {
            video.currentTime = Math.min(
              targetTime,
              Math.max(0, (video.duration || targetTime) - 1),
            );
          }
        } catch {}
      };

      if (video.readyState >= 1) restore();
      else video.addEventListener("loadedmetadata", restore, { once: true });
      return;
    }

    if (!cfg.sources?.online) {
      console.warn(`[videos] ${pageId}: no online source, falling back to low`);
      mode = "low";
      page.dataset.currentVideoMode = mode;
      if (toggle) setTriToggleUI(toggle, mode);
    }

    // Pause and hide local video
    if (video) {
      resetChildhoodPilotIosHlsState(video);
      try {
        video.pause();
      } catch {}
      video.style.display = "none";
    }

    const embedUrl = toYouTubeEmbed(
      languageSpecificOnlineSource || cfg.sources.online,
    );

    if (!existingIframe) {
      const iframe = document.createElement("iframe");
      iframe.className = cfg.iframeClass;
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.width = "100%";
      iframe.style.minHeight = "45vh";
      iframe.style.border = "none";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.title = cfg.onlineTitle || `${pageId} (online)`;
      iframe.src = embedUrl;
      container.appendChild(iframe);
    } else {
      existingIframe.src = embedUrl;
      existingIframe.style.display = "block";
    }

    void syncChildhoodPilotSubtitlesForPage(pageId);
    return;
  }

  // low / high modes
  if (existingIframe) {
    existingIframe.remove();
  }

  if (!video) return;
  video.style.display = "block";
  resetChildhoodPilotIosHlsState(video);

  if (isChildhoodEyeScreeningSubtitlePilotPage(pageId)) {
    prepareVideoForChildhoodPilotSubtitles(video);
  }

  const sourceEl = video.querySelector("source");
  const src = cfg.sources[mode];
  if (sourceEl) {
    sourceEl.src = src;
    sourceEl.type = "video/mp4";
  } else {
    const s = document.createElement("source");
    s.src = src;
    s.type = "video/mp4";
    video.prepend(s);
  }

  if (isChildhoodEyeScreeningSubtitlePilotPage(pageId)) {
    await syncChildhoodPilotSubtitlesForPage(pageId);
    if (page.dataset.videoModeRequestToken !== requestToken) return;
  } else {
    removeChildhoodPilotSubtitleTracks(video);
  }

  try {
    video.load();
  } catch {}

  const restore = () => {
    if (!preserveTime) return;

    // Prefer stored progress if available
    const prog = readProgressForTarget(pageId);
    const savedTime = prog?.maxTime ?? 0;

    // If we have a saved time, use that, otherwise use carried currentTime
    const targetTime = savedTime > 0 ? savedTime : currentTime;

    try {
      if (video.currentTime < 0.5 && targetTime > 0) {
        video.currentTime = Math.min(
          targetTime,
          Math.max(0, (video.duration || targetTime) - 1),
        );
      }
    } catch {}
  };

  if (video.readyState >= 1) restore();
  else video.addEventListener("loadedmetadata", restore, { once: true });
}

function wireVideoPageTriToggle(pageId) {
  const cfg = VIDEO_PAGE_SOURCES[pageId];
  if (!cfg) return;

  const page = document.getElementById(pageId);
  if (!page) return;

  const toggle = page.querySelector(".tri-toggle");
  if (!toggle || toggle.dataset.wired === "1") return;
  toggle.dataset.wired = "1";
  // ---- tri-toggle button count(2 or 3) + initial mode clamp ----
  const preferIosHls = shouldPreferOnlineIOSChildhoodPilotMode(pageId);
  const highBtn = toggle.querySelector('.tri-toggle__btn[data-mode="high"]');
  const onlineBtn = toggle.querySelector(
    '.tri-toggle__btn[data-mode="online"]',
  );
  const hasOnline = !!(cfg.sources && cfg.sources.online) || preferIosHls;

  if (highBtn) {
    highBtn.hidden = preferIosHls;
  }

  if (onlineBtn) {
    // online 소스 없으면 버튼 자체를 숨김
    onlineBtn.hidden = !hasOnline;
  }

  // visible 버튼 개수(2 or 3) 계산해서 CSS 변수로 전달
  const visibleCount = Array.from(
    toggle.querySelectorAll(".tri-toggle__btn"),
  ).filter((b) => !b.hidden).length;

  // CSS는 --tri-cols 로 폭 계산함 (base.css에서 var(--tri-cols) 사용) :contentReference[oaicite:3]{index=3}
  toggle.style.setProperty("--tri-cols", String(Math.max(1, visibleCount)));

  // ---- initial mode ----
  let initialMode = preferIosHls
    ? isNavigatorOnline()
      ? "online"
      : "low"
    : readGenericVideoMode(cfg.key);

  // online 없는데 localStorage에 online 저장돼있으면 high로 강제
  if (initialMode === "online" && !hasOnline) {
    initialMode = "high";
    writeGenericVideoMode(cfg.key, initialMode);
  }

  if (preferIosHls) {
    writeGenericVideoMode(cfg.key, initialMode);
  }

  setTriToggleUI(toggle, initialMode);
  applyVideoPageMode(pageId, initialMode, { preserveTime: false });

  // ---- bind interactions (click / keyboard) ----
  const onPickMode = (mode) => {
    if (!mode) return;
    if (preferIosHls && mode === "high") mode = "low";

    // online 버튼이 숨김이면 무시
    const btn = toggle.querySelector(`.tri-toggle__btn[data-mode="${mode}"]`);
    if (btn && btn.hidden) return;

    writeGenericVideoMode(cfg.key, mode);
    setTriToggleUI(toggle, mode);
    // 클릭으로 바꿀 때는 재생 위치 유지하는 편이 UX가 좋음
    applyVideoPageMode(pageId, mode, { preserveTime: true });
  };

  toggle.addEventListener("click", (e) => {
    const btn = e.target.closest(".tri-toggle__btn");
    if (!btn || !toggle.contains(btn)) return;

    e.preventDefault();
    e.stopPropagation();

    onPickMode(btn.dataset.mode);
  });

  // 접근성: Enter/Space로도 토글 변경
  toggle.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;

    const btn = e.target.closest(".tri-toggle__btn");
    if (!btn || !toggle.contains(btn)) return;

    e.preventDefault();
    e.stopPropagation();

    onPickMode(btn.dataset.mode);
  });
}

function applyPupilMode(mode, { preserveTime = true } = {}) {
  if (!PUPIL_MODES.includes(mode)) mode = "low";

  const page = document.getElementById("pupilFullExamPage");
  if (!page) return;

  const container = page.querySelector("#pupilFullExamContainer");
  if (!container) return;

  const video = container.querySelector("#pupilFullExamVideo");
  const existingIframe = container.querySelector("iframe.pupil-full-yt");

  // Save current time if we’re on a local video and switching away
  let currentTime = 0;
  if (preserveTime && video && !video.paused) {
    currentTime = video.currentTime || 0;
  } else if (preserveTime && video) {
    currentTime = video.currentTime || 0;
  }
  if (mode === "online") {
    if (!PUPIL_VIDEO_SOURCES.online) {
      console.warn(
        "[videos] pupilFullExamPage: no online source, falling back to low",
      );
      mode = "low";
    }

    // Pause and hide local video
    if (video) {
      try {
        video.pause();
      } catch {}
      video.style.display = "none";
    }

    // Create iframe if not present
    if (!existingIframe) {
      const iframe = document.createElement("iframe");
      iframe.className = "pupil-full-yt";
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.width = "100%";
      iframe.style.minHeight = "45vh";
      iframe.style.border = "none";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.title = "Pupil Full Examination (online)";
      iframe.src = PUPIL_VIDEO_SOURCES.online;
      container.appendChild(iframe);
    } else {
      existingIframe.src = PUPIL_VIDEO_SOURCES.online;
      existingIframe.style.display = "block";
    }

    return;
  }

  // low / high modes:
  // Remove/hide iframe if we’re leaving online
  if (existingIframe) {
    existingIframe.remove();
  }

  if (!video) return;

  // Show video element
  video.style.display = "block";

  // Swap mp4 source
  const sourceEl = video.querySelector("source");
  if (sourceEl) {
    sourceEl.src = PUPIL_VIDEO_SOURCES[mode];
  } else {
    // fallback: if source missing, create one
    const s = document.createElement("source");
    s.src = PUPIL_VIDEO_SOURCES[mode];
    s.type = "video/mp4";
    video.prepend(s);
  }

  // Reload and restore time
  try {
    video.load();
  } catch {}

  const restore = () => {
    if (!preserveTime) return;

    // Prefer stored maxTime if it exists, else use carried currentTime
    const prog = readProgressForTarget("pupilFullExamPage");
    const targetTime = (prog?.maxTime ?? currentTime) || 0;

    try {
      if (video.currentTime < 0.5 && targetTime > 0) {
        video.currentTime = Math.min(
          targetTime,
          Math.max(0, (video.duration || targetTime) - 1),
        );
      }
    } catch {}
  };

  if (video.readyState >= 1) {
    restore();
  } else {
    video.addEventListener("loadedmetadata", restore, { once: true });
  }
}

function wireTriToggle() {
  const page = document.getElementById("pupilFullExamPage");
  if (!page) return;

  const toggle = page.querySelector(".tri-toggle");
  if (!toggle || toggle.dataset.wired === "1") return;
  toggle.dataset.wired = "1";

  // init UI to stored mode
  const initialMode = readPupilMode();
  setTriToggleUI(toggle, initialMode);

  toggle.addEventListener("click", (e) => {
    const btn = e.target.closest(".tri-toggle__btn");
    if (!btn) return;

    const mode = btn.dataset.mode;
    writePupilMode(mode);
    setTriToggleUI(toggle, mode);

    // NEW: swap the video/iframe
    applyPupilMode(mode);

    // broadcast in case other code wants to swap sources etc.
    document.dispatchEvent(
      new CustomEvent("pupil:mode-changed", {
        detail: { mode },
      }),
    );
  });
}

function resumePupilFullExamIfNeeded() {
  const video = document.getElementById("pupilFullExamVideo");
  if (!video || video.dataset.autoResumed === "1") return;

  const prog = readProgressForTarget("pupilFullExamPage");
  const startAt = prog?.maxTime ?? 0;

  if (startAt <= 0) {
    video.dataset.autoResumed = "1";
    return;
  }

  const seekToSavedTime = () => {
    const duration = video.duration || 0;
    if (!duration) return;

    // Don’t jump right to the very end
    const safeTime = Math.min(startAt, Math.max(0, duration - 1));

    // Only seek if we're basically at the start
    if (video.currentTime < 0.5) {
      try {
        video.currentTime = safeTime;
      } catch {}
    }

    video.dataset.autoResumed = "1";
  };

  if (video.readyState >= 1) {
    seekToSavedTime();
  } else {
    video.addEventListener("loadedmetadata", seekToSavedTime, { once: true });
  }
}

// ----- Internal helper to show a specific videos subpage -----
function show(id) {
  if (
    EXTERNAL_GLAUCOMA_SCROLL_TARGETS.has(id) &&
    !document.getElementById(id)
  ) {
    void openExternalGlaucomaInteractive(id);
    return;
  }

  if (String(id || "").trim() === "videos") {
    if (
      currentPageElement &&
      !isVideosRootDataPageElement(currentPageElement)
    ) {
      currentPageElement.style.display = "block";
    }
    return;
  }

  const newPageElement = document.getElementById(id);
  if (!newPageElement) {
    console.warn(`[videos.js] Page element with ID "${id}" not found.`);
    return;
  }

  // [ADD] Always close the global video share panel when switching subpages
  const sharePanel = document.querySelector("[data-video-share-panel]");
  if (sharePanel) sharePanel.hidden = true;

  const nativeShareBtn = document.querySelector("[data-video-share-native]");
  if (nativeShareBtn) nativeShareBtn.hidden = true;

  // Lazy-load any iframes inside the page the first time it is shown
  newPageElement.querySelectorAll("iframe[data-src]").forEach((f) => {
    if (!f.src) {
      f.src = f.getAttribute("data-src");
    }
  });

  // Pause any videos that are NOT inside the target page
  document.querySelectorAll("video").forEach((v) => {
    if (!newPageElement.contains(v) && !v.paused) {
      try {
        v.pause();
      } catch {}
    }
  });

  // Hide the currently active page, if any
  if (currentPageElement && currentPageElement !== newPageElement) {
    currentPageElement.style.display = "none";
  }

  // Show the new page
  newPageElement.style.display = "block";
  currentPageElement = newPageElement;
  syncRouteHash("videos", { replace: true, subPageId: id });
  showExperimentalMiniAppNoticeForPage(id);
  document.dispatchEvent(new CustomEvent("page:shown", { detail: { id } }));

  if (id === "fundalReflexPage") {
    removeFundalReflexListFlowButtons();
    requestAnimationFrame(() => removeFundalReflexListFlowButtons());
    window.setTimeout(() => removeFundalReflexListFlowButtons(), 0);
  }

  if (id === FUNDAL_REFLEX_EXAMINATION_SCROLL_PAGE_ID) {
    syncFundalReflexExaminationTopbar();
    void initializeFundalReflexExaminationScrollGuide();
    scheduleFundalReflexExaminationScrollProgressSync();
  }

  // ✅ ensure we start at the top when switching video subpages
  try {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  } catch {}

  ensureVideoPageMenuButtonForPage(id);

  // Auto-resume full pupil exam video from last watched time
  if (id === "pupilFullExamPage") {
    wireTriToggle();

    const mode = readPupilMode();
    applyPupilMode(mode, { preserveTime: false });

    // Only auto-resume for local video modes
    if (mode !== "online") {
      resumePupilFullExamIfNeeded();
    }
  }

  // Toggle-driven video pages (Visual Acuity / Ant Seg / Fundal Reflex / DO)
  if (Object.prototype.hasOwnProperty.call(VIDEO_PAGE_SOURCES, id)) {
    wireVideoPageTriToggle(id);

    const cfg = VIDEO_PAGE_SOURCES[id];
    const page = document.getElementById(id);
    const videoEl = page?.querySelector(cfg?.videoSelector || "");
    wireProgressForVideoElement(videoEl, id);
  }

  if (!Object.prototype.hasOwnProperty.call(VIDEO_PAGE_SOURCES, id)) {
    void ensureChildhoodPilotSubtitleControlsForPage(id);
  }

  // Refresh lesson progress bars when switching sections
  updateLessonProgressBars(id);
  updateAllLessonDurations();

  // [ADD] Re-bind video/share UI now that the target subpage is in the DOM
  initializeVideoPlayers();
  scheduleVideoPageShareButtonAlignment(id);
}

// ----- Public initializer: called by router when 'videos' is loaded -----
// videos.js
export function initializeVideos() {
  // Root of the Videos route
  const root =
    document.getElementById("videos") ||
    document.querySelector('[data-page="videos"]') ||
    document.body;

  // Always hide first; we’ll reveal only when the target section exists.
  if (root) root.style.visibility = "hidden";

  // [ADD] videos route 들어올 때, videos 안의 모든 subpage를 일단 숨김 (기본으로 떠있는 visualAcuityPage 방지)
  const videosRoot =
    document.getElementById("videos") ||
    document.querySelector('[data-page="videos"]');

  if (videosRoot) {
    videosRoot.querySelectorAll(".page").forEach((p) => {
      p.style.display = "none";
    });
  }

  // [ADD] 첫 show()에서 기존 페이지를 확실히 새로 잡도록 초기화
  currentPageElement = null;

  // Wire video progress tracking (safe to call even if DOM not ready yet)
  wirePupilFullExamProgress();
  setupInteractiveLearningFolders();

  // Resolve the target (global → sessionStorage)
  let pending = window.__videosPendingTarget || "";
  if (!pending) {
    try {
      pending = sessionStorage.getItem("gotoSubPage") || "";
    } catch (_e) {}
  }
  if (!pending) {
    const deepLink = getRouteFromHash();
    if (deepLink?.routeName === "videos" && deepLink.subPageId) {
      pending = deepLink.subPageId;
    }
  }

  // Utility: wait until an element with this id exists (then resolve).
  const waitForId = (id, { timeout = 4000 } = {}) =>
    new Promise((resolve, reject) => {
      const start = performance.now();
      (function tick() {
        if (document.getElementById(id)) return resolve();
        if (performance.now() - start > timeout)
          return reject(new Error("timeout waiting for " + id));
        requestAnimationFrame(tick);
      })();
    });

  const reveal = () => {
    try {
      sessionStorage.removeItem("gotoSubPage");
    } catch (_e) {}
    window.__videosPendingTarget = "";
    window.__videosSuppressFlash = false;

    // Update bars when the route becomes visible
    updateLessonProgressBars();
    updateAllLessonDurations();

    if (root) {
      requestAnimationFrame(() => {
        root.style.visibility = "visible";
      });
    }
  };
  if (pending) {
    // Show nothing until the requested section exists.
    waitForId(pending)
      .then(() => {
        show(pending);
        reveal();
      })
      .catch(() => {
        // If the target never appears, stay blank (as requested) but still unfreeze UI.
        reveal();
      });
  } else {
    // No explicit target: keep it blank and just reveal the root shell.
    // (No default section will be shown.)
    reveal();
  }
}

if (!window[__videosGlobalBoundKey]) {
  window[__videosGlobalBoundKey] = true;

  // Delegate: elements with data-page can jump within videos
  const pc = document.getElementById("page-content") || document;
  pc.addEventListener(
    "click",
    (e) => {
      const hit = e.target && e.target.closest("[data-page]");
      if (!hit) return;
      const target = hit.getAttribute("data-page");
      if (!target || isVideosRootDataPageElement(hit)) return;
      show(target);
    },
    { passive: true },
  );

  // --- delegated listener on the card (ID is case-sensitive) ---
  document.addEventListener("click", (e) => {
    if (e.target.closest("#caseBasedLearningCard")) {
      openAnteriorSegmentQuiz().catch((err) =>
        console.error("Failed to open Anterior Segment Quiz:", err),
      );
    }
  });

  // Make lesson rows act like carousel cards (deep-link to a video page)
  document.addEventListener("click", (e) => {
    // ✅ videos route가 DOM에 없으면 아무 것도 하지 않기
    if (!document.getElementById("videos")) return;

    const row = e.target.closest(".lesson-row[data-target]");
    if (!row) return;

    const target = row.getAttribute("data-target");
    if (!target) return;

    const routeName = row.getAttribute("data-route");
    if (routeName && routeName !== "videos") {
      e.preventDefault();
      void loadPage(routeName, { subPageId: target });
      return;
    }

    show(target);
  });

  // Keyboard activation (Enter/Space)
  document.addEventListener("keydown", (e) => {
    const row = e.target.closest(".lesson-row[data-target]");
    if (!row) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      row.click();
    }
  });

  // Ensure video players are initialized after load
  document.addEventListener("DOMContentLoaded", () => {
    try {
      initializeVideoPlayers();
    } catch (_e) {}
  });

  // Initialize on first load (in case the page starts here)
  document.addEventListener(
    "DOMContentLoaded",
    bindDirectOphthalmoscopyToolbar,
  );

  document.addEventListener(CHILDHOOD_WORKSHOP_PROGRESS_EVENT, () => {
    updateLessonProgressBars();
  });

  document.addEventListener(DIABETIC_WORKSHOP_PROGRESS_EVENT, () => {
    updateLessonProgressBars();
  });

  document.addEventListener(CHILDHOOD_WORKSHOP_ROUTE_COMPLETE_EVENT, (e) => {
    const target = e?.detail?.target;
    if (target !== FUNDAL_REFLEX_EXAMINATION_SCROLL_PAGE_ID) return;
    writeWorkshopProgressForTarget(target, 100, { mode: "replace" });
  });

  window.addEventListener("i18n:languageChanged", () => {
    void refreshChildhoodPilotSubtitlesForLanguageChange();
    refreshLanguageSpecificOnlineVideoSources();
  });

  window.addEventListener(
    "scroll",
    () => {
      syncFundalReflexExaminationScrollProgress();
    },
    { passive: true },
  );

  window.addEventListener(
    "resize",
    () => {
      scheduleFundalReflexExaminationScrollProgressSync();
      alignVisibleVideoPageShareButtons();
    },
    { passive: true },
  );

  window.addEventListener("arclight:video-fullscreen-exit", (e) => {
    const pageId = String(e?.detail?.pageId || "").trim();
    if (!pageId) return;

    const videosRoot = document.getElementById("videos");
    const page = document.getElementById(pageId);
    if (!videosRoot || !page || !videosRoot.contains(page)) return;

    window.requestAnimationFrame(() => {
      if (currentPageElement?.id === pageId && page.style.display !== "none") {
        return;
      }
      show(pageId);
    });
  });

  const pageContent = document.getElementById("page-content");
  pageContent?.addEventListener(
    "scroll",
    () => {
      syncFundalReflexExaminationScrollProgress();
    },
    { passive: true },
  );

  // Re-run on page transitions; also pause the video when leaving this page
  window.addEventListener("page:loaded", (e) => {
    const pageId = e?.detail?.pageId;

    if (pageId === "directOphthalmoscopyVideoPage") {
      bindDirectOphthalmoscopyToolbar();
    } else {
      const vid = document.querySelector("#directOphthalmoscopy #customVideo");
      if (vid && !vid.paused) vid.pause();
    }
  });

  // Boot on hard refresh / first load
  document.addEventListener("DOMContentLoaded", () => {
    initializeToolbar();
    initializeVideoPlayers();
  });

  // Re-run on route changes and pause when leaving the page
  window.addEventListener("page:loaded", (e) => {
    const pageId = e?.detail?.pageId;
    if (pageId === "directOphthalmoscopyVideoPage") {
      initializeToolbar();
      initializeVideoPlayers();
    } else {
      const vid = document.querySelector("#directOphthalmoscopy #customVideo");
      if (vid && !vid.paused) vid.pause();
    }
  });
}

// Baseline-style direct card IDs inside Core Clinical Ophthalmic Examination
const byId = (id) => document.getElementById(id);
const bindings = {
  visualacuityCard: "visualAcuityPage",
  pupilsCard: "pupilsPage",
  anteriorSegmentCard: "anteriorSegmentVideoPage",
  ophthalmoscopyCard: "directOphthalmoscopy",
  interactiveLearningCard: "interactiveLearningPage",
};
Object.entries(bindings).forEach(([cardId, pageId]) => {
  const el = byId(cardId);
  if (el) el.onclick = () => show(pageId);
});

// Section buttons at top of the "intermediate" videos page
const showCoreBtn = document.getElementById(
  "showCoreClinicalOphthalmicExaminationBtn",
);
const showDiseasesBtn = document.getElementById("showDiseasesBtn");
const showArclightBtn = document.getElementById("showArclightBtn");

if (showCoreBtn)
  showCoreBtn.onclick = () => show("coreClinicalOphthalmicExamination");
if (showDiseasesBtn) showDiseasesBtn.onclick = () => show("diseasesPage");
if (showArclightBtn) showArclightBtn.onclick = () => show("arclightPage");

// ----- Called from eyes.js after loadPage('videos') -----
export function goToVideosSection(sectionId, opts = {}) {
  const { skipDefault = false } = opts;

  // If section exists, show it immediately
  if (sectionId && document.getElementById(sectionId)) {
    show(sectionId);
  } else if (!skipDefault && document.getElementById("learningModules")) {
    // Only show default if not skipping
    show("learningModules");
  }

  // Clear the pending hint once we navigated
  try {
    delete window.__videosPendingTarget;
  } catch {
    window.__videosPendingTarget = null;
  }
}

export function showVideosPageById(sectionId) {
  if (!sectionId) return;
  show(sectionId);
}

export {
  calculateVideoProgressPercent,
  ensureChildhoodPilotSubtitleControlsForPage,
  ensureVideoPageMenuButtonForPage,
  isChildhoodEyeScreeningSubtitlePilotPage,
  loadChildhoodEyeScreeningSubtitleCatalog,
  refreshChildhoodPilotSubtitlesForLanguageChange,
  resolveChildhoodPilotSubtitleLanguage,
  sanitizeChildhoodEyeScreeningSubtitleCatalog,
  syncChildhoodPilotSubtitlesForPage,
  resetChildhoodPilotSubtitleCatalogForTests,
};

// --- Direct Ophthalmoscopy toolbar wiring + nav-aware pausing ---
function bindDirectOphthalmoscopyToolbar() {
  const page = document.getElementById("directOphthalmoscopyVideoPage");
  if (!page || page.style.display === "none") return;

  const video = page.querySelector("#customVideo");
  const tsBtn = page.querySelector("#timestampBtn");
  const noteBtn = page.querySelector("#noteBtn");
  const folderBtn = page.querySelector("#folderBtn");

  const wire = (el, handler) => {
    if (!el || el.__wired) return;
    el.__wired = true;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      if (video) video.pause(); // ensure button actions pause the video first
      handler();
    });
  };

  wire(tsBtn, () => {
    if (!video) return;
    const t = Math.floor(video.currentTime || 0);
    console.warn("Timestamp:", t);
    try {
      if (navigator.clipboard) navigator.clipboard.writeText(String(t));
    } catch {
      /* ignore */
    }
  });

  wire(noteBtn, () => {
    alert("Note-taking feature coming soon.");
  });

  wire(folderBtn, () => {
    alert("Learning folder feature coming soon.");
  });
}

// Util: wait for an element to appear
function _waitForEl(selector, timeout = 4000) {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);
    const obs = new MutationObserver(() => {
      const node = document.querySelector(selector);
      if (node) {
        obs.disconnect();
        resolve(node);
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => {
      obs.disconnect();
      reject(new Error(`Timed out waiting for ${selector}`));
    }, timeout);
  });
}

// --- util: HEAD-probe a few path variants to find the quiz index ---
async function resolveQuizUrl() {
  const base = window.location.pathname.replace(/\/[^/]*$/, "/");
  const candidates = [
    "AnteriorSegmentQuiz/html/index.html",
    "./AnteriorSegmentQuiz/html/index.html",
    base + "AnteriorSegmentQuiz/html/index.html",
    "/AnteriorSegmentQuiz/html/index.html",
  ];
  for (const url of candidates) {
    try {
      const r = await fetch(url, { method: "HEAD" });
      if (r.ok) return url;
    } catch {
      /* ignore */
    }
  }
  return null;
}

// --- util: try several fragment keys; ignore failures ---
async function tryLoadQuizFragment() {
  if (typeof window.loadPage !== "function") return;
  const keys = ["quizzes", "quiz", "quizzes.html", "quizPage"];
  for (const key of keys) {
    try {
      await window.loadPage(key);
      // tiny breath for DOM injection
      await new Promise((r) => setTimeout(r, 0));
      if (document.getElementById("anteriorSegmentQuizPage")) return;
    } catch {
      // keep trying the next key
    }
  }
}

// --- util: find a reasonable container to append a .page section into ---
function findPagesHost() {
  return (
    document.querySelector("#pages") ||
    document.querySelector("#app") ||
    (document.querySelector(".page") &&
      document.querySelector(".page").parentElement) ||
    document.body
  );
}

// --- ensure we have the quiz page in the DOM; create it if missing ---
function ensureQuizPage() {
  let page = document.getElementById("anteriorSegmentQuizPage");
  if (!page) {
    page = document.createElement("section");
    page.id = "anteriorSegmentQuizPage";
    page.className = "page";
    page.style.height = "100vh";
    page.style.display = "none";
    page.innerHTML = `
      <iframe id="anteriorQuizFrame"
              title="Anterior Segment Quiz"
              style="width:100%;height:100%;border:none;"></iframe>
    `;
    const host = findPagesHost();
    host.appendChild(page);
  }
  const iframe =
    page.querySelector("#anteriorQuizFrame") || page.querySelector("iframe");
  return { page, iframe };
}

// --- main: open the quiz page reliably ---
async function openAnteriorSegmentQuiz() {
  await tryLoadQuizFragment();

  const { page, iframe } = ensureQuizPage();

  const quizUrl = await resolveQuizUrl();
  if (!quizUrl) {
    const box = document.createElement("div");
    box.style.padding = "16px";
    box.appendChild(document.createTextNode("Couldn't find "));
    const codePath = document.createElement("code");
    codePath.textContent = "AnteriorSegmentQuiz/html/index.html";
    box.appendChild(codePath);
    box.appendChild(document.createTextNode(" from here."));
    box.appendChild(document.createElement("br"));
    box.appendChild(document.createTextNode("Make sure the "));
    const codeFolder = document.createElement("code");
    codeFolder.textContent = "AnteriorSegmentQuiz/";
    box.appendChild(codeFolder);
    box.appendChild(
      document.createTextNode(" folder is deployed next to your app root."),
    );
    page.replaceChildren(box);
  } else {
    iframe.onload = () => console.warn("Quiz iframe loaded:", quizUrl);
    iframe.onerror = () => console.error("Quiz iframe failed:", quizUrl);
    iframe.src = quizUrl;
  }

  if (typeof window.showPage === "function") {
    window.showPage("anteriorSegmentQuizPage");
  } else {
    // fallback: manual show/hide
    document
      .querySelectorAll(".page")
      .forEach((p) => (p.style.display = "none"));
    page.style.display = "block";
  }
}

// Debug helpers (safe to keep, or remove later)
window.initializeVideos = initializeVideos;
window.__videosShow = (id) => {
  try {
    window.__videosPendingTarget = id;
  } catch {}
  // 내부 show는 스코프 안이라 직접 노출이 필요하면 아래도 같이 붙일 수 있음
};
