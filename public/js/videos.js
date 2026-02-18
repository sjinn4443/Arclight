/**
 * @fileoverview This file contains videos related functions and logic.
 */

import { initializeVideoPlayers, initializeToolbar } from "./videoplayer.js";
import { loadPage } from "./navigation.js";

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

function dispatchWorkshopProgressChanged(targetPageId) {
  if (!targetPageId) return;
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
      percent: Math.min(100, (maxTime / duration) * 100),
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
  return readVideoProgress(progressKeyForTarget(targetPageId));
}

function writeProgressForTarget(targetPageId, data) {
  writeVideoProgress(progressKeyForTarget(targetPageId), data);
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
      percent: Math.min(100, (maxTime / duration) * 100),
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

function applyVideoPageMode(pageId, mode, { preserveTime = true } = {}) {
  const cfg = VIDEO_PAGE_SOURCES[pageId];
  if (!cfg) return;
  if (!GENERIC_VIDEO_MODES.includes(mode)) mode = "low";

  const page = document.getElementById(pageId);
  if (!page) return;

  const toggle = page.querySelector(".tri-toggle");
  if (toggle) setTriToggleUI(toggle, mode);

  const container = page.querySelector(cfg.containerSelector);
  if (!container) return;

  const video = container.querySelector(cfg.videoSelector);
  const existingIframe = container.querySelector(`iframe.${cfg.iframeClass}`);

  let currentTime = 0;
  if (preserveTime && video) {
    currentTime = video.currentTime || 0;
  }

  if (mode === "online") {
    if (!cfg.sources?.online) {
      console.warn(`[videos] ${pageId}: no online source, falling back to low`);
      mode = "low";
      if (toggle) setTriToggleUI(toggle, mode);
    }

    // Pause and hide local video
    if (video) {
      try {
        video.pause();
      } catch {}
      video.style.display = "none";
    }

    const embedUrl = toYouTubeEmbed(cfg.sources.online);

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

    return;
  }

  // low / high modes
  if (existingIframe) {
    existingIframe.remove();
  }

  if (!video) return;
  video.style.display = "block";

  const sourceEl = video.querySelector("source");
  const src = cfg.sources[mode];
  if (sourceEl) {
    sourceEl.src = src;
  } else {
    const s = document.createElement("source");
    s.src = src;
    s.type = "video/mp4";
    video.prepend(s);
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
  const onlineBtn = toggle.querySelector(
    '.tri-toggle__btn[data-mode="online"]',
  );
  const hasOnline = !!(cfg.sources && cfg.sources.online);

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
  let initialMode = readGenericVideoMode(cfg.key);

  // online 없는데 localStorage에 online 저장돼있으면 high로 강제
  if (initialMode === "online" && !hasOnline) {
    initialMode = "high";
    writeGenericVideoMode(cfg.key, initialMode);
  }

  setTriToggleUI(toggle, initialMode);
  applyVideoPageMode(pageId, initialMode, { preserveTime: false });

  // ---- bind interactions (click / keyboard) ----
  const onPickMode = (mode) => {
    if (!mode) return;

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
  document.dispatchEvent(new CustomEvent("page:shown", { detail: { id } }));

  // ✅ ensure we start at the top when switching video subpages
  try {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  } catch {}

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

  // Refresh lesson progress bars when switching sections
  updateLessonProgressBars(id);
  updateAllLessonDurations();

  // [ADD] Re-bind video/share UI now that the target subpage is in the DOM
  initializeVideoPlayers();
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
    // ✅ videos route가 DOM에 없으면 아무 것도 하지 않기
    if (!document.getElementById("videos")) return;

    const row = e.target.closest(".lesson-row[data-target]");
    if (!row) return;

    const target = row.getAttribute("data-target");
    if (!target) return;

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
