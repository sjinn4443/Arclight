/**
 * @fileoverview This file contains videos related functions and logic.
 */

import { initializeVideoPlayers, initializeToolbar } from "./video.js";

// Keep track of the currently active subpage element within videos.html
let currentPageElement = null;

const __videosGlobalBoundKey = "__videosGlobalBound";
if (window[__videosGlobalBoundKey] == null) {
  window[__videosGlobalBoundKey] = false;
}

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

function writeVideoProgress(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

function wirePupilFullExamProgress() {
  const video = document.getElementById("pupilFullExamVideo");
  if (!video || video.dataset.progressWired === "1") return;

  video.dataset.progressWired = "1";

  const storageKey = VIDEO_PROGRESS_KEYS.pupilFullExamVideo;

  const save = () => {
    const duration = video.duration || 0;
    if (!duration) return;

    const prev = readVideoProgress(storageKey) || {};
    const maxTime = Math.max(prev.maxTime || 0, video.currentTime || 0);

    writeVideoProgress(storageKey, {
      maxTime,
      duration,
      percent: Math.min(100, (maxTime / duration) * 100),
      updatedAt: Date.now(),
    });

    updateLessonProgressBars();
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
  });
}

function updateLessonProgressBars(activePageId) {
  // We only need to update when Pupils list is visible,
  // but it’s cheap enough to run safely whenever.
  const pupilsPage = document.getElementById("pupilsPage");
  if (!pupilsPage) return;

  const row = pupilsPage.querySelector(
    '.lesson-row[data-target="pupilFullExamPage"]',
  );
  if (!row) return;

  const fill = row.querySelector(".lesson-progress__fill");
  const meta = row.querySelector(".lesson-meta");

  const prog = readVideoProgress(VIDEO_PROGRESS_KEYS.pupilFullExamVideo);
  const percent = prog?.percent ?? 0;
  const maxTime = prog?.maxTime ?? 0;

  if (fill) {
    fill.style.width = `${percent}%`;
    fill.setAttribute("aria-valuenow", String(Math.round(percent)));
    fill.title = `${Math.round(percent)}% watched`;
  }

  if (meta) {
    meta.textContent = `| ${formatTime(maxTime)}`;
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

  const prog = readVideoProgress(VIDEO_PROGRESS_KEYS.pupilFullExamVideo);
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
  const newPageElement = document.getElementById(id);
  if (!newPageElement) {
    console.warn(`[videos.js] Page element with ID "${id}" not found.`);
    return;
  }

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

  // Auto-resume full pupil exam video from last watched time
  if (id === "pupilFullExamPage") {
    wireTriToggle();
    resumePupilFullExamIfNeeded();
  }

  // Refresh lesson progress bars when switching sections
  updateLessonProgressBars(id);
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

  // Wire video progress tracking (safe to call even if DOM not ready yet)
  wirePupilFullExamProgress();

  // Resolve the target (global → sessionStorage)
  let pending = window.__videosPendingTarget || "";
  if (!pending) {
    try {
      pending = sessionStorage.getItem("gotoSubPage") || "";
    } catch (_e) {}
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
      if (target) show(target);
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
    const row = e.target.closest(".lesson-row[data-target]");
    if (!row) return;

    const target = row.getAttribute("data-target");
    if (!target) return;

    // Directly show the target subpage within the already loaded videos.html
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

  // Re-run on page transitions; also pause the video when leaving this page
  window.addEventListener("page:loaded", (e) => {
    const pageId = e?.detail?.pageId;

    if (pageId === "directOphthalmoscopy") {
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
    if (pageId === "directOphthalmoscopy") {
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
  anteriorSegmentCard: "frontOfEyePage",
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

// --- Direct Ophthalmoscopy toolbar wiring + nav-aware pausing ---
function bindDirectOphthalmoscopyToolbar() {
  const page = document.getElementById("directOphthalmoscopy");
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
    page.innerHTML = `<div style="padding:16px">
      Couldn’t find <code>AnteriorSegmentQuiz/html/index.html</code> from here.<br/>
      Make sure the <code>AnteriorSegmentQuiz/</code> folder is deployed next to your app root.
    </div>`;
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
