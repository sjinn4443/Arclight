/**
 * @fileoverview This file provides robust rendering for the "My Learnings" page, displaying liked items with masonry layout, search functionality, and cross-tab/same-tab synchronization.
 */

import { ROUTES } from "./config.js";
import { loadPage } from "./navigation.js";
import { EYES_INDEX } from "./catalog-index.js";
import { LESSON_PROGRESS_EVENT, readLessonProgress } from "./lessonProgress.js";

// ---- Likes store compatibility (prefer global getters if present) ----
// Canonical storage key (baseline-compatible) for liked items.
const PRIMARY_KEY = "likedItems";
// Legacy keys to support older saved data formats.
const LEGACY_KEYS = ["eyesLikes", "likedItems", "liked"];
const MY_LEARNING_EMPTY_FALLBACK =
  "No saved items yet. Tap the heart on any Eyes card to add it here.";
const MY_LEARNING_UNMATCHED_FALLBACK =
  "Your saved items couldn't be matched. Try liking a new item.";
const MY_LEARNING_EMPTY_I18N_KEY = "i18nExtra.my_learning_empty";
const MY_LEARNING_UNMATCHED_I18N_KEY = "i18nExtra.my_learning_unmatched";
const MY_LEARNING_TAB_KEY = "myLearningActiveTab";
const MY_LEARNING_DEFAULT_TAB = "liked";
const MY_LEARNING_IN_PROGRESS_EMPTY_FALLBACK =
  "No in-progress items yet. Start any lesson and it will appear here.";
const MY_LEARNING_TABS = Object.freeze(["inProgress", "liked", "notes"]);
const MY_LEARNING_PROGRESS_EVENTS = Object.freeze([
  LESSON_PROGRESS_EVENT,
  "childhoodWorkshop:progress-changed",
  "diabeticWorkshop:progress-changed",
  "glaucomaWorkshop:progress-changed",
]);
const MY_LEARNING_PROGRESS_PREFIXES = Object.freeze([
  "lessonProgress:",
  "videoProgress:",
  "childhoodWorkshop:progress:",
  "diabeticWorkshop:progress:",
  "glaucomaWorkshop:progress:",
]);
const MY_LEARNING_LABEL_I18N_OVERRIDES = Object.freeze({
  "Eye Movements/Squint": "eyes.card_label.eye_movements/squint",
  "WHO PEC": "eyes.card_label.who_pec",
});
const MY_LEARNING_TAG_I18N_KEYS = Object.freeze({
  "Coming Soon": "eyes.tag_coming_soon",
  Video: "eyes.tag_video",
  "Case Study": "eyes.tag_case_study",
  Quiz: "eyes.tag_quiz",
  "Mini Apps": "eyes.tag_mini_apps",
  "Mini App": "eyes.tag_mini_app",
});
const MY_LEARNING_EYES_IMAGE_MAP = Object.freeze({
  "History Taking": "images/icon/eyes/core/car_history.webp",
  "Visual Acuity": "images/icon/eyes/core/car_visualacuity.webp",
  Pupils: "images/icon/eyes/core/car_pupils.webp",
  "Front of Eye": "images/icon/eyes/core/car_frontofeye.webp",
  "Fundal Reflex": "images/icon/eyes/core/car_fundalreflex.webp",
  Ophthalmoscopy: "images/icon/eyes/core/car_ophth.webp",
  "Interactive Learning": "images/icon/eyes/core/car_miniapp.webp",
  "Uncorrected Refractive Error": "images/icon/eyes/disease/car_uncor.webp",
  Cataract: "images/icon/eyes/disease/car_cataract.webp",
  Glaucoma: "images/icon/eyes/disease/car_glaucoma.webp",
  "Diabetic Retinopathy": "images/icon/eyes/disease/car_diabetic.webp",
  "Corneal Disease": "images/icon/eyes/disease/car_corneal.webp",
  "Childhood Eye Screening": "images/icon/eyes/disease/car_childhood.webp",
  "Retinopathy of Prematurity": "images/icon/eyes/disease/car_rop.webp",
  "Retinal Disease": "images/icon/eyes/disease/car_retinal.webp",
  "Optic Nerve Disease": "images/icon/eyes/disease/car_opticnerv.webp",
  "WHO PEC": "images/icon/eyes/workshop/car_who.webp",
  Ptosis: "images/icon/eyes/extended/car_ptosis.webp",
  Proptosis: "images/icon/eyes/extended/car_proptosis.webp",
  "Eye Movements/Squint": "images/icon/eyes/extended/car_squint.webp",
  "Cranial Nerve Examination": "images/icon/eyes/extended/car_cranial.webp",
  "Arclight Overview": "images/icon/eyes/tools/car_arclight.webp",
  "Holo Overview": "images/icon/eyes/tools/car_holo.webp",
});

const MY_LEARNING_PROGRESS_SOURCES = Object.freeze([
  {
    route: "childhoodEyeScreeningWorkshop",
    title: "Childhood Eye Screening Workshop",
    image: "images/icon/eyes/workshop/car_childhoodscreen.webp",
  },
  {
    route: "diabeticRetinopathyWorkshop",
    title: "Diabetic Retinopathy Workshop",
    image: "images/icon/eyes/disease/car_diabetic.webp",
  },
  {
    route: "glaucomaWorkshop",
    title: "Glaucoma Workshop",
    image: "images/icon/eyes/disease/car_glaucoma.webp",
  },
  {
    route: "casestudy",
    title: "Case Studies",
    image: "images/icon/eyes/core/car_history.webp",
  },
  {
    route: "videos",
    title: "Core Examinations and Quizzes",
    image: "images/icon/eyes/core/car_pupils.webp",
  },
]);

const CHILDHOOD_TARGET_ROUTES = Object.freeze({
  assessmentVisionPage: { route: "videos", subPageId: "assessmentVisionPage" },
  childhoodAskQuestionsObservePage: {
    route: "childhoodAskQuestionsObservePage",
  },
  childhoodEyeBrainImagesPage: {
    route: "childhoodEyeBrainImages",
    subPageId: "childhoodEyeBrainImagesPage",
  },
  childhoodFundalAfterExaminationPage: {
    route: "childhoodFundalAfterExamination",
  },
  childhoodFundalExaminationPage: { route: "childhoodFundalExamination" },
  childhoodFundalNewbornEyesClosedPage: {
    route: "childhoodFundalNewbornEyesClosed",
  },
  childhoodFundalNewbornEyesOpenPage: {
    route: "childhoodFundalNewbornEyesOpen",
  },
  childhoodFundalPossibleFindingPage: {
    route: "childhoodFundalPossibleFinding",
  },
  childhoodFundalPreparationPage: { route: "childhoodFundalPreparation" },
  childhoodFundalUnclearFindingsPage: {
    route: "childhoodFundalUnclearFindings",
  },
  childhoodIntroVisualDevelopmentPage: {
    route: "childhoodIntroVisualDevelopmentPage",
    subPageId: "childhoodIntroVisualDevelopmentPage",
  },
  childhoodNormalVisualDevelopmentPage: {
    route: "childhoodNormalVisualDevelopmentPage",
    subPageId: "childhoodNormalVisualDevelopmentPage",
  },
  childhoodReferPage: { route: "childhoodRefer" },
  fundalReflexPdfPage: { route: "fundalReflexPdf" },
  signsVICasesPage: { route: "signsVICases" },
  atomsHandout1Page: { route: "atomsHandout1" },
  atomsHandout2Page: { route: "atomsHandout2" },
  visualImpairmentPage: { route: "visualImpairment" },
});

const GLAUCOMA_TARGET_ROUTES = Object.freeze({
  glaucomaACDInteractive: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaACDInteractive",
  },
  glaucomaACDScroll: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaACDScroll",
  },
  glaucomaAssessRecord: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaAssessRecord",
  },
  glaucomaCupping: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaCupping",
  },
  glaucomaDiagnosis: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaDiagnosis",
  },
  glaucomaFieldsExam: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaFieldsExam",
  },
  glaucomaFieldsIntro: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaFieldsIntro",
  },
  glaucomaFrontFindings: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaFrontFindings",
  },
  glaucomaFundusSummaryAtomsPage: { route: "glaucomaWorkshop" },
  glaucomaGlaucomaSummaryAtomsPage: { route: "glaucomaWorkshop" },
  glaucomaHighIOP: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaHighIOP",
  },
  glaucomaHistoryCaseStudy: {
    route: "glaucomaHistoryCaseStudy",
    subPageId: "glaucomaHistoryCaseStudy",
  },
  glaucomaIntro: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaIntro",
  },
  glaucomaOpticNerve: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaOpticNerve",
  },
  glaucomaPOAGACAG: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaPOAGACAG",
  },
  glaucomaPupilReactions: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaPupilReactions",
  },
  glaucomaQuadrantsFingers: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaQuadrantsFingers",
  },
  glaucomaQuadrantsRed: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaQuadrantsRed",
  },
  glaucomaQuizCaseStudy: {
    route: "glaucomaQuizCaseStudy",
    subPageId: "glaucomaQuizCaseStudy",
  },
  glaucomaRAPDFullSwingInteractive: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaRAPDFullSwingInteractive",
  },
  glaucomaSecondaryCauseQuizPage: {
    route: "glaucomaQuizCaseStudy",
    subPageId: "glaucomaSecondaryCauseQuizPage",
  },
  glaucomaSummaryScrolly: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaSummaryScrolly",
  },
  glaucomaSwingRAPD: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaSwingRAPD",
  },
  glaucomaTestingVisualAcuity: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaTestingVisualAcuity",
  },
  glaucomaTypes: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaTypes",
  },
  glaucomaVisionIntro: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaVisionIntro",
  },
  glaucomaWhatIs: {
    route: "glaucomaScrollImages",
    subPageId: "glaucomaWhatIs",
  },
  fundalReflexPage: {
    route: "glaucomaScrollImages",
    subPageId: "fundalReflexPage",
  },
});

const PROGRESS_TARGET_ROUTES = Object.freeze({
  ...CHILDHOOD_TARGET_ROUTES,
  ...GLAUCOMA_TARGET_ROUTES,
  atomsHandout1Page: { route: "atomsHandout1" },
  atomsHandout2Page: { route: "atomsHandout2" },
  binocularIndirectOphthalmoscopyPdfPage: {
    route: "binocularIndirectOphthalmoscopyPdf",
  },
  binocularIndirectOphthalmoscopyScrollPage: {
    route: "videos",
    subPageId: "binocularIndirectOphthalmoscopyScrollPage",
  },
  directOphthalmoscopyPdfPage: { route: "directOphthalmoscopyPdf" },
  directOphthalmoscopyQuizPage: {
    route: "quizzes",
    subPageId: "directOphthalmoscopyQuizPage",
  },
  fundalReflexExaminationScrollPage: {
    route: "videos",
    subPageId: "fundalReflexExaminationScrollPage",
  },
  fundalReflexPdfPage: { route: "fundalReflexPdf" },
});

let myLearningListenersBound = false;
let myLearningRenderToken = 0;

/**
 * Reads liked items from localStorage for a given key and returns them as a Set.
 * Handles potential JSON parsing errors.
 * @param {string} key - The localStorage key to read from.
 * @returns {Set<string>} A Set containing the liked item IDs.
 */
function readLikesFrom(key) {
  try {
    return new Set(JSON.parse(localStorage.getItem(key)) || []);
  } catch {
    return new Set();
  }
}

/**
 * Writes a Set of liked item IDs to localStorage under the PRIMARY_KEY.
 * @param {Set<string>} set - The Set of liked item IDs to write.
 */
function writeLikes(set) {
  try {
    localStorage.setItem(PRIMARY_KEY, JSON.stringify([...set]));
  } catch {
    void 0;
  }
}

/**
 * Merges liked items from all known (primary and legacy) localStorage keys
 * into a single Set and normalizes them to the PRIMARY_KEY for future reads.
 * @returns {Set<string>} A unified Set of all liked item IDs.
 */
function getUnifiedLikesLocal() {
  const merged = new Set();
  // primary
  for (const l of readLikesFrom(PRIMARY_KEY)) merged.add(String(l));
  // legacy
  for (const k of LEGACY_KEYS)
    for (const l of readLikesFrom(k)) merged.add(String(l));
  // normalize to PRIMARY for future reads
  writeLikes(merged);
  return merged;
}

// Prefer likes.js exports if available (eyes + others already use them)
/**
 * Resolves the appropriate function to get liked items.
 * Prefers global `window.getLikes` or `window.readLikes` if available,
 * otherwise falls back to `getUnifiedLikesLocal`.
 * @returns {Function} A function that returns a Set of liked item IDs.
 */
function resolveLikesGetter() {
  if (typeof window.getLikes === "function") {
    return () => window.getLikes(); // expected Set<string>
  }
  if (typeof window.readLikes === "function") {
    return () => window.readLikes(); // expected Set<string>
  }
  return () => getUnifiedLikesLocal(); // fallback
}
const getLikes = resolveLikesGetter();

/**
 * Navigates to a specified target page.
 * Prefers `window.showPage` if available (for baseline compatibility), otherwise uses `loadPage`.
 * @param {string} target - The ID or route name of the page to navigate to.
 */
function go(target) {
  const t = String(target || "").trim();
  if (!t) return;

  const VIDEO_PAGE_IDS = new Set([
    "learningModules",
    "coreClinicalOphthalmicExamination",
    "diseasesPage",
    "arclightPage",
    "holoOverviewPage",
    "childhoodEyeScreeningPage",
    "howToUseArclightVideoPage",
    "directOphthalmoscopy",
    "anteriorSegmentVideoPage",
    "frontOfEyePage",
    "pupilsPage",
    "rapdTestVideoPage",
    "phoneAttachmentVideoPage",
    "visualAcuityPage",
    "fundalReflexPage",
    "fundalReflexExaminationScrollPage",
    "binocularIndirectOphthalmoscopyScrollPage",
    "interactiveLearningPage",
    "assessmentVisionPage",
    "normalAbnormalPage",
    "fundalReflexInteractivePage",
    "traumaInteractivePage",
    "amslerInteractivePage",
    "miresPage",
    "morphPage",
    "squintPalsyPage",
    "cataractPage",
  ]);

  // Deep-link into Videos route if target is a videos subpage
  if (t === "pupilsPage" || VIDEO_PAGE_IDS.has(t)) {
    try {
      sessionStorage.setItem(
        "fromRoute",
        window.currentPageName || "mylearning",
      );
    } catch {
      void 0;
    }
    (async () => {
      await loadPage("videos");
      try {
        const mod = await import("./videos.js");
        if (t === "pupilsPage" && typeof mod.goToPupilsSection === "function") {
          mod.goToPupilsSection();
        } else if (typeof mod.goToVideosSection === "function") {
          mod.goToVideosSection(t);
        } else {
          sessionStorage.setItem("gotoSubPage", t);
        }
      } catch {
        sessionStorage.setItem("gotoSubPage", t);
      }
    })();
    return;
  }

  // Non-video targets
  if (typeof window.showPage === "function") window.showPage(t);
  else loadPage(t);
}

async function goToRouteTarget(route, subPageId = "") {
  const normalizedRoute = String(route || "").trim();
  const normalizedSubPage = String(subPageId || "").trim();
  if (!normalizedRoute) return;

  if (normalizedRoute === "videos" && normalizedSubPage) {
    try {
      window.__videosPendingTarget = normalizedSubPage;
      sessionStorage.setItem("gotoSubPage", normalizedSubPage);
    } catch {
      void 0;
    }

    await loadPage("videos", { subPageId: normalizedSubPage });
    try {
      const mod = await import("./videos.js");
      mod.goToVideosSection?.(normalizedSubPage, { skipDefault: true });
    } catch {
      try {
        sessionStorage.setItem("gotoSubPage", normalizedSubPage);
      } catch {
        void 0;
      }
    }
    return;
  }

  await loadPage(
    normalizedRoute,
    normalizedSubPage ? { subPageId: normalizedSubPage } : undefined,
  );

  if (normalizedSubPage && typeof window.showPage === "function") {
    window.showPage(normalizedSubPage);
  }

  if (
    normalizedRoute === "quizzes" &&
    normalizedSubPage === "directOphthalmoscopyQuizPage"
  ) {
    try {
      const mod = await import("./quiz-launcher.js");
      mod.launchQuiz?.();
    } catch {
      window.launchQuiz?.();
    }
  }
}

// ---- Catalog access (no imports from other files) ----
/**
 * Retrieves all "Eyes" related items from a global `window.EYES_SECTIONS` object.
 * Flattens the sections into a single array of items.
 * @returns {Array<Object>} An array of all "Eyes" items.
 */
function getAllEyesItems() {
  // Prefer eyes.js provider if loaded on this route
  if (typeof window.getAllEyesItems === "function") {
    try {
      return window.getAllEyesItems() || [];
    } catch {
      /* fall through */
    }
  }
  // Fallback: derive a flat list from EYES_INDEX (label -> pageId)
  if (typeof EYES_INDEX === "object" && EYES_INDEX) {
    return Object.entries(EYES_INDEX).map(([label, target]) => ({
      label,
      target,
    }));
  }
  // Final fallback: if EYES_SECTIONS exists
  const sections = window.EYES_SECTIONS || {};
  const flat = [];
  Object.values(sections).forEach((list) => {
    (list || []).forEach((i) => flat.push(i));
  });
  return flat;
}

// ---- Helpers ----
/**
 * Converts a value to a normalized lowercase string key.
 * @param {any} v - The value to convert.
 * @returns {string} The normalized string key.
 */
function toKey(v) {
  return v == null ? "" : String(v).trim().toLowerCase();
}

function getEyesCardLabelI18nKey(label) {
  const raw = String(label || "").trim();
  if (!raw) return null;
  if (MY_LEARNING_LABEL_I18N_OVERRIDES[raw]) {
    return MY_LEARNING_LABEL_I18N_OVERRIDES[raw];
  }

  const slug = raw
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9/]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");

  return slug ? `eyes.card_label.${slug}` : null;
}

/**
 * Extracts a normalized key from an item object, trying various common fields.
 * @param {Object} item - The item object.
 * @returns {string} The normalized key for the item.
 */
function getItemKey(item) {
  // Try common fields used around the app
  return toKey(
    item?.label || item?.id || item?.key || item?.slug || item?.dataLabel,
  );
}

/**
 * Randomly picks a size class ('size-s', 'size-m', 'size-l') for a masonry card.
 * @returns {string} The selected size class.
 */
function pickSize() {
  const r = Math.random();
  if (r < 0.45) return "size-s";
  if (r < 0.8) return "size-m";
  return "size-l";
}

function getLearningCardImageSrc(item, title, target) {
  if (item?.image) return item.image;
  if (target === "childhoodEyeScreeningWorkshop") {
    return "images/icon/eyes/workshop/car_childhoodscreen.webp";
  }
  return MY_LEARNING_EYES_IMAGE_MAP[title] || "";
}

/**
 * Ensures a container element exists within the given page for rendering liked items.
 * If no known container is found, a default one is created and appended.
 * @param {HTMLElement} page - The page element.
 * @returns {HTMLElement} The container element for liked items.
 */
function ensureContainer(page) {
  // Try any of the known containers
  let el = page.querySelector("#likedMasonry, #myLearningsList, #m1-masonry");
  if (el) return el;

  // None found: create a safe default container
  el = document.createElement("div");
  el.id = "myLearningsList";
  // rely on existing CSS (we're not adding styles)
  page.appendChild(el);
  return el;
}

function normalizeMyLearningTab(value) {
  const normalized = String(value || "").trim();
  return MY_LEARNING_TABS.includes(normalized)
    ? normalized
    : MY_LEARNING_DEFAULT_TAB;
}

function readMyLearningTab() {
  try {
    return normalizeMyLearningTab(
      sessionStorage.getItem(MY_LEARNING_TAB_KEY) ||
        localStorage.getItem(MY_LEARNING_TAB_KEY),
    );
  } catch {
    return MY_LEARNING_DEFAULT_TAB;
  }
}

function writeMyLearningTab(tab) {
  const normalized = normalizeMyLearningTab(tab);
  try {
    sessionStorage.setItem(MY_LEARNING_TAB_KEY, normalized);
    localStorage.setItem(MY_LEARNING_TAB_KEY, normalized);
  } catch {
    void 0;
  }
  return normalized;
}

function setActiveTabUI(page, tab) {
  page.querySelectorAll(".ml-tab").forEach((button) => {
    const buttonTab = normalizeMyLearningTab(button.dataset.mlTab);
    button.classList.toggle("active", buttonTab === tab);
    button.setAttribute("aria-selected", String(buttonTab === tab));
  });
}

function bindMyLearningControls(page) {
  page.querySelectorAll(".ml-tab").forEach((button) => {
    if (button.dataset.mlBound === "1") return;
    button.dataset.mlBound = "1";
    button.addEventListener("click", () => {
      writeMyLearningTab(button.dataset.mlTab);
      void renderMyLearnings();
    });
  });
}

// ---- Public init (called when route hits liked page) ----
/**
 * Initializes the "My Learnings" page.
 * Renders the liked items, sets up event listeners for cross-tab and same-tab storage changes,
 * and observes page visibility for dynamic updates.
 */
export function initializeMyLearning() {
  void renderMyLearnings(); // initial

  if (myLearningListenersBound) return;
  myLearningListenersBound = true;

  // Cross-tab refresh
  window.addEventListener("storage", (e) => {
    if (
      !e.key ||
      e.key === PRIMARY_KEY ||
      e.key === MY_LEARNING_TAB_KEY ||
      LEGACY_KEYS.includes(e.key) ||
      e.key.startsWith?.("lessonProgress:") ||
      e.key.startsWith?.("videoProgress:") ||
      e.key.startsWith?.("childhoodWorkshop:progress:") ||
      e.key.startsWith?.("diabeticWorkshop:progress:") ||
      e.key.startsWith?.("glaucomaWorkshop:progress:")
    ) {
      void renderMyLearnings();
    }
  });

  // Same-tab refresh (requires likes.js to dispatch 'likes:changed' after writes)
  window.addEventListener("likes:changed", () => void renderMyLearnings());
  MY_LEARNING_PROGRESS_EVENTS.forEach((eventName) => {
    document.addEventListener(eventName, () => void renderMyLearnings());
  });

  window.addEventListener("app:navigate", (e) => {
    const pid = e?.detail?.pageId || e?.detail;
    if (pid === "likedPage" || pid === "myLearnings") void renderMyLearnings();
  });

  // Also watch visibility toggles if no router event
  const liked =
    document.getElementById("likedPage") ||
    document.getElementById("myLearnings");
  if (liked && window.MutationObserver) {
    const obs = new MutationObserver(() => {
      const active =
        liked.classList.contains("active") || liked.style.display !== "none";
      if (active) void renderMyLearnings();
    });
    obs.observe(liked, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
  }

  // First-load fallback (deep links)
  document.addEventListener("DOMContentLoaded", () => {
    const current = document.querySelector(".page.active");
    if (current && (current.id === "likedPage" || current.id === "myLearnings"))
      void renderMyLearnings();
  });
}

// ---- Render ----
function renderNote(listEl, message, i18nKey = "") {
  listEl.textContent = "";
  const empty = document.createElement("p");
  empty.className = "note";
  empty.setAttribute("role", "status");
  empty.setAttribute("aria-live", "polite");
  empty.textContent = message;
  if (i18nKey) empty.setAttribute("data-i18n", i18nKey);
  listEl.appendChild(empty);
  try {
    window.I18N?.applyTranslations?.(empty);
  } catch {
    void 0;
  }
}

function createLikedCard(item, cardTemplate) {
  const title = item.label || item.name || "Untitled";
  const target = item.target || item.pageId || "comingSoon";
  const size = pickSize();
  const card = cardTemplate.content.querySelector(".ml-card").cloneNode(true);
  card.classList.add(size);
  card.dataset.target = target;
  card.dataset.mlSearchText = `${title} ${(item.tags || []).join(" ")}`;
  const imageSrc = getLearningCardImageSrc(item, title, target);
  const imageEl = card.querySelector(".ml-card-bg");
  if (imageEl && imageSrc) {
    card.classList.add("ml-card--image");
    imageEl.src = imageSrc;
    imageEl.alt = title;
    const imageI18nKey = getEyesCardLabelI18nKey(title);
    if (imageI18nKey) imageEl.setAttribute("data-i18n", `${imageI18nKey}:alt`);
  } else if (imageEl) {
    imageEl.remove();
  }

  const titleEl = card.querySelector("h4");
  if (titleEl) {
    titleEl.textContent = title;
    const titleI18nKey = getEyesCardLabelI18nKey(title);
    if (titleI18nKey) titleEl.setAttribute("data-i18n", titleI18nKey);
  }

  const heartEl = card.querySelector(".ml-heart");
  if (heartEl) card.appendChild(heartEl);

  const badgesWrap = card.querySelector(".ml-badges");
  if (badgesWrap) {
    badgesWrap.textContent = "";
    (item.tags || []).slice(0, 3).forEach((t) => {
      const badge = document.createElement("span");
      badge.className = "ml-badge";
      badge.textContent = t;
      const tagI18nKey = MY_LEARNING_TAG_I18N_KEYS[t];
      if (tagI18nKey) badge.setAttribute("data-i18n", tagI18nKey);
      badgesWrap.appendChild(badge);
    });
  }

  return card;
}

function renderLikedItems(listEl) {
  const raw = getLikes();
  const likedIds = Array.isArray(raw)
    ? raw.map((v) => toKey(v))
    : Array.from(raw instanceof Set ? raw : new Set(), (v) => toKey(v));

  const cardTemplate = document.getElementById("mlCardTemplate");
  if (!cardTemplate) return;

  if (!likedIds.length) {
    renderNote(listEl, MY_LEARNING_EMPTY_FALLBACK, MY_LEARNING_EMPTY_I18N_KEY);
    return;
  }

  const likedSet = new Set(likedIds);
  const likedItems = getAllEyesItems().filter((it) =>
    likedSet.has(getItemKey(it)),
  );

  listEl.textContent = "";
  if (likedItems.length) {
    likedItems
      .map((item) => createLikedCard(item, cardTemplate))
      .forEach((card) => listEl.appendChild(card));
  } else {
    renderNote(
      listEl,
      MY_LEARNING_UNMATCHED_FALLBACK,
      MY_LEARNING_UNMATCHED_I18N_KEY,
    );
  }
}

function getCleanText(el) {
  if (!el) return "";
  const clone = el.cloneNode(true);
  clone.querySelectorAll?.(".lesson-complete-tick").forEach((tick) => {
    tick.remove();
  });
  return String(clone.textContent || "")
    .replace(/\s+/g, " ")
    .trim();
}

function getRowSectionText(doc, row) {
  const section = row.closest("[data-section], [data-nested-section]");
  const sectionTitle = getCleanText(section?.querySelector("h3"));
  const parentId = String(row.parentElement?.id || "").trim();
  let folderTitle = "";

  if (parentId) {
    const controller = Array.from(doc.querySelectorAll("[aria-controls]")).find(
      (candidate) => candidate.getAttribute("aria-controls") === parentId,
    );
    folderTitle = getCleanText(controller?.querySelector(".lesson-type"));
  }

  return [sectionTitle, folderTitle]
    .filter(Boolean)
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .join(" - ");
}

function getRowKindLabel(row) {
  if (row.classList.contains("lesson-row--pdf")) return "PDF";
  if (row.classList.contains("lesson-row--video")) return "Video";
  if (row.classList.contains("lesson-row--quiz")) return "Quiz";
  if (row.classList.contains("lesson-row--scroll")) return "Scrolly";
  return "Lesson";
}

function inferProgressNavigationFromTarget(target, fallbackRoute = "") {
  if (PROGRESS_TARGET_ROUTES[target]) return PROGRESS_TARGET_ROUTES[target];
  if (ROUTES[target]) return { route: target, subPageId: "" };

  const withoutPage = target.replace(/Page$/, "");
  if (ROUTES[withoutPage]) return { route: withoutPage, subPageId: target };

  if (fallbackRoute === "videos") return { route: "videos", subPageId: target };
  if (fallbackRoute && ROUTES[fallbackRoute]) {
    return { route: fallbackRoute, subPageId: target };
  }

  return { route: "videos", subPageId: target };
}

function inferProgressNavigation(row, source, target) {
  const explicitRoute = String(row.getAttribute("data-route") || "").trim();
  if (explicitRoute === "videos") return { route: "videos", subPageId: target };
  if (explicitRoute) return { route: explicitRoute, subPageId: "" };

  return inferProgressNavigationFromTarget(target, source.route);
}

async function loadProgressSourceDocument(source) {
  const url = ROUTES[source.route];
  if (!url) return null;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    const html = await response.text();
    return new DOMParser().parseFromString(html, "text/html");
  } catch {
    return null;
  }
}

function getProgressSourceByRoute(route) {
  return (
    MY_LEARNING_PROGRESS_SOURCES.find((source) => source.route === route) ||
    null
  );
}

function getProgressSourceByPrefix(prefix) {
  if (prefix === "childhoodWorkshop:progress:") {
    return getProgressSourceByRoute("childhoodEyeScreeningWorkshop");
  }
  if (prefix === "diabeticWorkshop:progress:") {
    return getProgressSourceByRoute("diabeticRetinopathyWorkshop");
  }
  if (prefix === "glaucomaWorkshop:progress:") {
    return getProgressSourceByRoute("glaucomaWorkshop");
  }
  if (prefix === "videoProgress:") return getProgressSourceByRoute("videos");
  return null;
}

function inferProgressSource(target, prefix, navigation) {
  const byPrefix = getProgressSourceByPrefix(prefix);
  if (byPrefix && prefix !== "videoProgress:") return byPrefix;

  if (
    CHILDHOOD_TARGET_ROUTES[target] ||
    target.startsWith("childhood") ||
    target === "fundalReflexPdfPage" ||
    target === "fundalReflexExaminationScrollPage" ||
    target.startsWith("atomsHandout")
  ) {
    return getProgressSourceByRoute("childhoodEyeScreeningWorkshop");
  }

  if (
    target.startsWith("diabetic") ||
    target === "directOphthalmoscopyPdfPage" ||
    target === "directOphthalmoscopyQuizPage" ||
    target === "binocularIndirectOphthalmoscopyPdfPage" ||
    target === "binocularIndirectOphthalmoscopyScrollPage"
  ) {
    return getProgressSourceByRoute("diabeticRetinopathyWorkshop");
  }

  if (
    GLAUCOMA_TARGET_ROUTES[target] ||
    target.startsWith("glaucoma") ||
    target === "frontOfEyePage" ||
    target === "fundalReflexPage"
  ) {
    return getProgressSourceByRoute("glaucomaWorkshop");
  }

  if (target.startsWith("caseStudy") || navigation.route === "casestudy") {
    return getProgressSourceByRoute("casestudy");
  }

  return (
    getProgressSourceByRoute(navigation.route) ||
    byPrefix ||
    getProgressSourceByRoute("videos")
  );
}

function humanizeProgressTarget(target) {
  return String(target || "Lesson")
    .replace(/Page$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\bdr\b/gi, "DR")
    .replace(/\bncd\b/gi, "NCD")
    .replace(/\bbio\b/gi, "BIO")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function getStoredProgressTargets() {
  const targets = [];

  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index) || "";
      const prefix = MY_LEARNING_PROGRESS_PREFIXES.find((candidate) =>
        key.startsWith(candidate),
      );
      if (!prefix) continue;

      const target = key.slice(prefix.length).trim();
      if (target) targets.push({ target, prefix });
    }
  } catch {
    return targets;
  }

  return targets;
}

async function getInProgressGroups() {
  const seenTargets = new Set();
  const targetCatalog = new Map();
  const groups = new Map();
  const loadedSources = await Promise.all(
    MY_LEARNING_PROGRESS_SOURCES.map(async (source) => ({
      source,
      doc: await loadProgressSourceDocument(source),
    })),
  );

  function getGroup(source) {
    const key = source?.route || source?.title || "videos";
    if (!groups.has(key)) {
      groups.set(key, {
        ...(source || getProgressSourceByRoute("videos")),
        items: [],
      });
    }
    return groups.get(key);
  }

  function addInProgressItem(item, source) {
    if (!item?.target || seenTargets.has(item.target)) return;
    if (item.percent <= 0 || item.percent >= 100) return;

    seenTargets.add(item.target);
    getGroup(source).items.push(item);
  }

  loadedSources.forEach(({ source, doc }) => {
    if (!doc) return;

    Array.from(doc.querySelectorAll(".lesson-row[data-target]")).forEach(
      (row) => {
        const target = String(row.getAttribute("data-target") || "").trim();
        if (!target) return;

        const navigation = inferProgressNavigation(row, source, target);
        const title =
          getCleanText(row.querySelector(".lesson-type")) ||
          humanizeProgressTarget(target);
        const section = getRowSectionText(doc, row);
        const kind = getRowKindLabel(row);
        const catalogEntry = {
          target,
          title,
          section,
          kind,
          source,
          route: navigation.route,
          subPageId: navigation.subPageId || "",
        };
        if (!targetCatalog.has(target)) targetCatalog.set(target, catalogEntry);

        addInProgressItem(
          {
            ...catalogEntry,
            percent: readLessonProgress(target).percent,
          },
          source,
        );
      },
    );
  });

  getStoredProgressTargets().forEach(({ target, prefix }) => {
    if (seenTargets.has(target)) return;

    const progress = readLessonProgress(target).percent;
    if (progress <= 0 || progress >= 100) return;

    const catalogEntry = targetCatalog.get(target);
    const sourceHint =
      catalogEntry?.source ||
      inferProgressSource(target, prefix, { route: "", subPageId: "" });
    const navigation = catalogEntry
      ? {
          route: catalogEntry.route,
          subPageId: catalogEntry.subPageId,
        }
      : inferProgressNavigationFromTarget(target, sourceHint?.route);
    const source =
      catalogEntry?.source || inferProgressSource(target, prefix, navigation);

    addInProgressItem(
      {
        target,
        title: catalogEntry?.title || humanizeProgressTarget(target),
        section: catalogEntry?.section || "",
        kind: catalogEntry?.kind || "Lesson",
        percent: progress,
        route: navigation.route,
        subPageId: navigation.subPageId || "",
      },
      source,
    );
  });

  return Array.from(groups.values())
    .filter((group) => group.items.length)
    .map((group) => ({
      ...group,
      percent:
        group.items.reduce((total, item) => total + item.percent, 0) /
        group.items.length,
    }));
}

function createProgressCard(group) {
  const card = document.createElement("article");
  card.className = "ml-card ml-progress-card size-m";
  card.dataset.mlSearchText = [
    group.title,
    ...group.items.flatMap((item) => [item.title, item.section, item.kind]),
  ].join(" ");

  if (group.image) {
    card.classList.add("ml-card--image");
    const image = document.createElement("img");
    image.className = "ml-card-bg";
    image.alt = "";
    image.decoding = "async";
    image.draggable = false;
    image.src = group.image;
    card.appendChild(image);
  }

  const summary = document.createElement("button");
  summary.type = "button";
  summary.className = "ml-progress-card__summary";
  summary.setAttribute("aria-expanded", "false");

  const title = document.createElement("h4");
  title.textContent = group.title;

  const meta = document.createElement("span");
  meta.className = "ml-progress-card__meta";
  meta.textContent = `${group.items.length} in progress`;

  summary.append(title, meta);

  const itemsWrap = document.createElement("div");
  itemsWrap.className = "ml-progress-items";
  itemsWrap.hidden = true;

  group.items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ml-progress-item";
    button.dataset.route = item.route;
    button.dataset.subPageId = item.subPageId;

    const textWrap = document.createElement("span");
    textWrap.className = "ml-progress-item__text";

    const itemTitle = document.createElement("span");
    itemTitle.className = "ml-progress-item__title";
    itemTitle.textContent = item.title;

    const itemMeta = document.createElement("span");
    itemMeta.className = "ml-progress-item__meta";
    itemMeta.textContent = [item.section, item.kind]
      .filter(Boolean)
      .join(" - ");

    textWrap.append(itemTitle, itemMeta);

    const itemPercent = document.createElement("span");
    itemPercent.className = "ml-progress-item__percent";
    itemPercent.textContent = `${Math.round(item.percent)}%`;

    const track = document.createElement("span");
    track.className = "ml-progress-item__track";
    const fill = document.createElement("span");
    fill.className = "ml-progress-item__fill";
    fill.style.width = `${Math.max(0, Math.min(100, item.percent))}%`;
    track.appendChild(fill);

    button.append(textWrap, itemPercent, track);
    itemsWrap.appendChild(button);
  });

  card.append(summary, itemsWrap);
  return card;
}

function toggleProgressCard(card) {
  if (!card) return;

  const summary = card.querySelector(".ml-progress-card__summary");
  const items = card.querySelector(".ml-progress-items");
  const isOpen = !card.classList.contains("is-open");
  card.classList.toggle("is-open", isOpen);
  summary?.setAttribute("aria-expanded", String(isOpen));
  if (items) items.hidden = !isOpen;
}

async function renderInProgressItems(listEl, isCurrent = () => true) {
  listEl.textContent = "";
  const loading = document.createElement("p");
  loading.className = "note";
  loading.textContent = "Loading in-progress items...";
  listEl.appendChild(loading);

  const groups = await getInProgressGroups();
  if (!isCurrent()) return;

  listEl.textContent = "";

  if (!groups.length) {
    renderNote(listEl, MY_LEARNING_IN_PROGRESS_EMPTY_FALLBACK);
    return;
  }

  groups.map(createProgressCard).forEach((card) => listEl.appendChild(card));
}

function bindSearchAndChips(page, listEl) {
  const search = page.querySelector("#mlSearch");
  if (search && !search._mlBound) {
    search._mlBound = true;
    search.addEventListener("input", () => {
      const q = (search.value || "").toLowerCase();
      listEl.querySelectorAll(".ml-card, .ml-progress-card").forEach((card) => {
        const searchText = (
          card.dataset.mlSearchText ||
          card.querySelector("h4")?.textContent ||
          ""
        ).toLowerCase();
        card.style.display = searchText.includes(q) ? "" : "none";
      });
    });
  }

  const chips = page.querySelectorAll(".ml-chip");
  chips.forEach((chip) => {
    if (chip._mlBound) return;
    chip._mlBound = true;
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
    });
  });
}

/**
 * Renders the active "My Learnings" tab.
 */
async function renderMyLearnings() {
  const page =
    document.getElementById("likedPage") ||
    document.getElementById("myLearnings");
  if (!page) return;

  const token = ++myLearningRenderToken;
  const listEl = ensureContainer(page);
  const activeTab = readMyLearningTab();

  bindMyLearningControls(page);
  setActiveTabUI(page, activeTab);
  bindSearchAndChips(page, listEl);

  if (activeTab === "inProgress") {
    await renderInProgressItems(listEl, () => token === myLearningRenderToken);
  } else if (activeTab === "liked") {
    renderLikedItems(listEl);
  } else {
    renderNote(listEl, "Notes are not available yet.");
  }

  if (token !== myLearningRenderToken) return;

  try {
    window.I18N?.applyTranslations?.(listEl);
  } catch {
    void 0;
  }

  listEl.onclick = (e) => {
    const progressItem = e.target.closest?.(".ml-progress-item");
    if (progressItem) {
      void goToRouteTarget(
        progressItem.dataset.route,
        progressItem.dataset.subPageId,
      );
      return;
    }

    const summary = e.target.closest?.(".ml-progress-card__summary");
    if (summary) {
      toggleProgressCard(summary.closest(".ml-progress-card"));
      return;
    }

    const progressCard = e.target.closest?.(".ml-progress-card");
    if (progressCard) {
      toggleProgressCard(progressCard);
      return;
    }

    const card = e.target.closest?.(".ml-card[data-target]");
    if (!card) return;
    const target = card.getAttribute("data-target") || "comingSoon";
    go(target);
  };
}
