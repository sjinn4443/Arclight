import { loadPage } from "./navigation.js";
import { openMenu } from "./menu.js";
import { initializeDiabeticScreeningScrollLessons } from "./diabeticRetinopathyWorkshop.js";
import { initializeMedicalAnteriorSegmentCaseStudy } from "./medicalAnteriorSegmentCaseStudy.js";

const PAGE_ID = "medicalStudentsWorkshopPage";
const RAPD_RETURN_KEY = "medicalStudentsWorkshop:rapdReturn";
const RESTORE_FOLDER_KEY = "medicalStudentsWorkshop:restoreFolder";
const RESTORE_NESTED_KEY = "medicalStudentsWorkshop:restoreNestedFolder";
const RESTORE_TARGET_KEY = "medicalStudentsWorkshop:restoreTarget";
const FLOW_ENABLED_KEY = "medicalStudentsWorkshop:nextFlowEnabled";
const INTERACTIVE_LEARNING_RETURN_KEY = "interactiveLearning:returnTarget";
const NEXT_HOST_CLASS = "medical-next-host";
const MEDICAL_PROGRESS_EVENT = "medicalStudentsWorkshop:progress-changed";

const INTERNAL_TARGETS = new Set([
  "medicalOverviewPage",
  "medicalObjectivesPage",
  "medicalTimetableContentPage",
  "medicalPatientJourneyPage",
  "medicalBarriersPage",
  "medicalDiagnosisEyeDiseasePage",
  "medicalBlindnessPage",
  "medicalVisualSystemPage",
  "medicalVisualDevelopmentScrollPage",
  "medicalHistoryTakingPage",
  "medicalArclightScrollPage",
  "medicalVisualAcuityPracticePage",
  "medicalPupilsAnteriorPracticePage",
  "medicalFundalDirectPracticePage",
  "medicalAnteriorSegmentPage",
]);

const MEDICAL_TARGET_ROUTES = Object.freeze({
  mumVisionPage: "videos",
  howToUseArclightVideoPage: "videos",
  visualAcuityPdfPage: "visualAcuityPdf",
  pupilsPecPdfPage: "pupilsPecPdf",
  pupilFullExamPage: "videos",
  pupilsAdvancedPdfPage: "pupilsAdvancedPdf",
  frontOfEyePdfPage: "frontOfEyePdf",
  feFullAnteriorSegmentPage: "videos",
  fundalExamPage: "videos",
  fundalReflexPdfPage: "fundalReflexPdf",
  directOphthalmoscopyVideoPage: "videos",
  directOphthalmoscopyPdfPage: "directOphthalmoscopyPdf",
  fundalReflexSimulatorPage: "videos",
  morphSimulatorPage: "videos",
  swollenDiscsInteractivePage: "videos",
});

const VIDEO_TARGETS = new Set(
  Object.entries(MEDICAL_TARGET_ROUTES)
    .filter(([, route]) => route === "videos")
    .map(([target]) => target),
);
const FLOW_ROUTES = new Set([
  "medicalStudentsWorkshop",
  "glaucomaScrollImages",
  ...Object.values(MEDICAL_TARGET_ROUTES),
]);

const FOCUS = {
  introductionOverview: {
    type: "focus",
    section: "introduction",
    nested: "introductionOverview",
  },
  eyeDiseaseBlindness: {
    type: "focus",
    section: "introduction",
    nested: "eyeDiseaseBlindness",
  },
  anatomyVision: {
    type: "focus",
    section: "introduction",
    nested: "anatomyVision",
  },
  historyTaking: {
    type: "focus",
    section: "introduction",
    target: "medicalHistoryTakingPage",
  },
  examinationTools: {
    type: "focus",
    section: "introduction",
    nested: "examinationTools",
  },
  visualAcuity: {
    type: "focus",
    section: "examineEachOther",
    nested: "visualAcuity",
  },
  pupilsAnterior: {
    type: "focus",
    section: "examineEachOther",
    nested: "pupilsAnterior",
  },
  fundalDirect: {
    type: "focus",
    section: "examineEachOther",
    nested: "fundalDirect",
  },
  training: {
    type: "focus",
    section: "trainOnSimTools",
  },
  pupilApp: {
    type: "focus",
    section: "trainOnSimTools",
    nested: "pupilApp",
  },
  discApp: {
    type: "focus",
    section: "trainOnSimTools",
    nested: "discApp",
  },
};

const MEDICAL_STANDALONE_HOME = {
  glaucomaRAPDFullSwingInteractive: FOCUS.pupilApp,
  medicalAnteriorSegmentPage: FOCUS.training,
  fundalReflexSimulatorPage: FOCUS.training,
  morphSimulatorPage: FOCUS.discApp,
  swollenDiscsInteractivePage: FOCUS.discApp,
};

const MEDICAL_EMBEDDED_RETURN_TARGETS = new Set([
  "fundalReflexSimulatorPage",
  "morphSimulatorPage",
  "swollenDiscsInteractivePage",
]);

const MEDICAL_NAV_CONFIG = {
  medicalOverviewPage: {
    previous: FOCUS.introductionOverview,
    next: { type: "target", target: "medicalObjectivesPage" },
    home: FOCUS.introductionOverview,
  },
  medicalObjectivesPage: {
    previous: { type: "target", target: "medicalOverviewPage" },
    next: { type: "target", target: "medicalTimetableContentPage" },
    home: FOCUS.introductionOverview,
  },
  medicalTimetableContentPage: {
    previous: { type: "target", target: "medicalObjectivesPage" },
    next: FOCUS.introductionOverview,
    home: FOCUS.introductionOverview,
  },
  medicalPatientJourneyPage: {
    previous: FOCUS.eyeDiseaseBlindness,
    next: { type: "target", target: "medicalBarriersPage" },
    home: FOCUS.eyeDiseaseBlindness,
  },
  medicalBarriersPage: {
    previous: { type: "target", target: "medicalPatientJourneyPage" },
    next: { type: "target", target: "medicalDiagnosisEyeDiseasePage" },
    home: FOCUS.eyeDiseaseBlindness,
  },
  medicalDiagnosisEyeDiseasePage: {
    previous: { type: "target", target: "medicalBarriersPage" },
    next: { type: "target", target: "medicalBlindnessPage" },
    home: FOCUS.eyeDiseaseBlindness,
  },
  medicalBlindnessPage: {
    previous: { type: "target", target: "medicalDiagnosisEyeDiseasePage" },
    next: FOCUS.eyeDiseaseBlindness,
    home: FOCUS.eyeDiseaseBlindness,
  },
  medicalVisualSystemPage: {
    previous: FOCUS.anatomyVision,
    next: { type: "target", target: "medicalVisualDevelopmentScrollPage" },
    home: FOCUS.anatomyVision,
  },
  medicalVisualDevelopmentScrollPage: {
    previous: { type: "target", target: "medicalVisualSystemPage" },
    next: { type: "target", target: "mumVisionPage" },
    home: FOCUS.anatomyVision,
  },
  mumVisionPage: {
    previous: {
      type: "target",
      target: "medicalVisualDevelopmentScrollPage",
    },
    next: FOCUS.anatomyVision,
    home: FOCUS.anatomyVision,
  },
  medicalHistoryTakingPage: {
    previous: FOCUS.historyTaking,
    next: FOCUS.historyTaking,
    home: FOCUS.historyTaking,
  },
  medicalArclightScrollPage: {
    previous: FOCUS.examinationTools,
    next: { type: "target", target: "howToUseArclightVideoPage" },
    home: FOCUS.examinationTools,
  },
  howToUseArclightVideoPage: {
    previous: { type: "target", target: "medicalArclightScrollPage" },
    next: FOCUS.examinationTools,
    home: FOCUS.examinationTools,
  },
  visualAcuityPdfPage: {
    previous: FOCUS.visualAcuity,
    next: { type: "target", target: "medicalVisualAcuityPracticePage" },
    home: FOCUS.visualAcuity,
  },
  medicalVisualAcuityPracticePage: {
    previous: { type: "target", target: "visualAcuityPdfPage" },
    next: FOCUS.visualAcuity,
    home: FOCUS.visualAcuity,
  },
  pupilsPecPdfPage: {
    previous: FOCUS.pupilsAnterior,
    next: { type: "target", target: "pupilFullExamPage" },
    home: FOCUS.pupilsAnterior,
  },
  pupilFullExamPage: {
    previous: { type: "target", target: "pupilsPecPdfPage" },
    next: { type: "target", target: "pupilsAdvancedPdfPage" },
    home: FOCUS.pupilsAnterior,
  },
  pupilsAdvancedPdfPage: {
    previous: { type: "target", target: "pupilFullExamPage" },
    next: { type: "target", target: "frontOfEyePdfPage" },
    home: FOCUS.pupilsAnterior,
  },
  frontOfEyePdfPage: {
    previous: { type: "target", target: "pupilsAdvancedPdfPage" },
    next: { type: "target", target: "feFullAnteriorSegmentPage" },
    home: FOCUS.pupilsAnterior,
  },
  feFullAnteriorSegmentPage: {
    previous: { type: "target", target: "frontOfEyePdfPage" },
    next: { type: "target", target: "medicalPupilsAnteriorPracticePage" },
    home: FOCUS.pupilsAnterior,
  },
  medicalPupilsAnteriorPracticePage: {
    previous: { type: "target", target: "feFullAnteriorSegmentPage" },
    next: FOCUS.pupilsAnterior,
    home: FOCUS.pupilsAnterior,
  },
  fundalExamPage: {
    previous: FOCUS.fundalDirect,
    next: { type: "target", target: "fundalReflexPdfPage" },
    home: FOCUS.fundalDirect,
  },
  fundalReflexPdfPage: {
    previous: { type: "target", target: "fundalExamPage" },
    next: { type: "target", target: "directOphthalmoscopyVideoPage" },
    home: FOCUS.fundalDirect,
  },
  directOphthalmoscopyVideoPage: {
    previous: { type: "target", target: "fundalReflexPdfPage" },
    next: { type: "target", target: "directOphthalmoscopyPdfPage" },
    home: FOCUS.fundalDirect,
  },
  directOphthalmoscopyPdfPage: {
    previous: { type: "target", target: "directOphthalmoscopyVideoPage" },
    next: { type: "target", target: "medicalFundalDirectPracticePage" },
    home: FOCUS.fundalDirect,
  },
  medicalFundalDirectPracticePage: {
    previous: { type: "target", target: "directOphthalmoscopyPdfPage" },
    next: FOCUS.fundalDirect,
    home: FOCUS.fundalDirect,
  },
  medicalAnteriorSegmentPage: {
    previous: { type: "rapd", mode: "test" },
    next: { type: "target", target: "fundalReflexSimulatorPage" },
    home: FOCUS.training,
  },
  fundalReflexSimulatorPage: {
    previous: { type: "target", target: "medicalAnteriorSegmentPage" },
    next: { type: "target", target: "morphSimulatorPage" },
    home: FOCUS.training,
  },
  morphSimulatorPage: {
    previous: { type: "target", target: "fundalReflexSimulatorPage" },
    next: { type: "target", target: "swollenDiscsInteractivePage" },
    home: FOCUS.discApp,
  },
  swollenDiscsInteractivePage: {
    previous: { type: "target", target: "morphSimulatorPage" },
    next: FOCUS.discApp,
    home: FOCUS.discApp,
  },
};

let medicalNextInfraWired = false;

function activateOnKeyboard(element, callback) {
  element.addEventListener("click", callback);
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") callback(event);
  });
}

function addCloseToggle(title, close) {
  if (!title) return;
  title.querySelector(".see-all-toggle")?.remove();
  const toggle = document.createElement("span");
  toggle.className = "see-all-toggle";
  toggle.setAttribute("role", "button");
  toggle.setAttribute("tabindex", "0");
  toggle.textContent = "Close ^";
  activateOnKeyboard(toggle, (event) => {
    event.preventDefault();
    event.stopPropagation();
    close();
  });
  title.appendChild(toggle);
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
  } catch {
    /* ignore storage failures */
  }
}

function resetViewportToTop() {
  try {
    const pageContent = document.getElementById("page-content");
    if (pageContent) pageContent.scrollTop = 0;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  } catch {
    /* ignore scroll failures */
  }
}

function resetViewportToTopSoon() {
  resetViewportToTop();
  requestAnimationFrame(resetViewportToTop);
}

function getVisiblePageId() {
  const pages = Array.from(
    document.querySelectorAll("#page-content .page, body > .page"),
  );
  const visible = pages.find((candidate) => {
    if (!candidate?.id) return false;
    return getComputedStyle(candidate).display !== "none";
  });
  return visible?.id || "";
}

function isPageVisible(id) {
  const element = document.getElementById(id);
  if (!element) return false;
  let node = element;
  while (node) {
    const style = getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") return false;
    node = node.parentElement;
  }
  return true;
}

function showPageFallback(id) {
  document.querySelectorAll("#page-content .page").forEach((candidate) => {
    candidate.classList.remove("active");
    candidate.style.display = "none";
  });
  const target = document.getElementById(id);
  if (!target) return;
  target.classList.add("active");
  target.style.display = "block";
  document.dispatchEvent(new CustomEvent("page:shown", { detail: { id } }));
}

function removeMedicalNextButtons() {
  document.querySelectorAll(".medical-next-wrap").forEach((wrap) => {
    wrap.parentElement?.classList.remove(NEXT_HOST_CLASS);
    wrap.remove();
  });
}

function isMedicalNextReady() {
  return true;
}

function syncMedicalNextReady(targetId) {
  const page = document.getElementById(targetId);
  const next = page?.querySelector(".medical-next-btn");
  if (!next) return;
  const ready = isMedicalNextReady(targetId);
  next.classList.toggle("is-ready", ready);
  next.disabled = !ready;
  next.setAttribute("aria-disabled", ready ? "false" : "true");
}

function writeMedicalVideoProgress(targetId, video, forceComplete = false) {
  const duration = Number(video?.duration || 0);
  if (!duration) return;
  let previous = {};
  try {
    previous =
      JSON.parse(localStorage.getItem(`videoProgress:${targetId}`) || "null") ||
      {};
  } catch {
    previous = {};
  }
  const maxTime = Math.max(
    Number(previous.maxTime || 0),
    Number(video.currentTime || 0),
  );
  const percent = forceComplete
    ? 100
    : Math.max(
        Number(previous.percent || 0),
        Math.min(99, Math.floor((maxTime / duration) * 100)),
      );
  try {
    localStorage.setItem(
      `videoProgress:${targetId}`,
      JSON.stringify({ maxTime, duration, percent, updatedAt: Date.now() }),
    );
  } catch {
    /* ignore storage failures */
  }
  document.dispatchEvent(
    new CustomEvent(MEDICAL_PROGRESS_EVENT, {
      detail: { target: targetId, percent },
    }),
  );
}

function wireMedicalEmbeddedVideoProgress() {
  const video = document.querySelector(
    "#medicalVisualSystemPage .medical-learning-video",
  );
  if (!video || video.dataset.medicalProgressWired === "1") return;
  video.dataset.medicalProgressWired = "1";
  video.addEventListener("timeupdate", () => {
    writeMedicalVideoProgress("medicalVisualSystemPage", video);
  });
  video.addEventListener("ended", () => {
    writeMedicalVideoProgress("medicalVisualSystemPage", video, true);
  });
}

function startMedicalVisualDevelopmentVideoAtRequestedOffset(targetId) {
  if (targetId !== "mumVisionPage") return;
  const video = document.getElementById("mumVisionVideo");
  if (!video || video.dataset.medicalStartOffsetWired === "1") return;
  video.dataset.medicalStartOffsetWired = "1";
  const seekPastIntro = () => {
    if (!isFlowEnabled() || video.currentTime >= 12.75) return;
    try {
      video.currentTime = 13;
    } catch {
      /* wait for loadedmetadata */
    }
  };
  video.addEventListener("loadedmetadata", seekPastIntro);
  video.addEventListener("durationchange", seekPastIntro);
  seekPastIntro();
}

async function showVideosTarget(targetId) {
  try {
    const { goToVideosSection, showVideosPageById } =
      await import("./videos.js");
    goToVideosSection?.(targetId, { skipDefault: true });
    if (!isPageVisible(targetId)) showVideosPageById?.(targetId);
  } catch {
    /* use the fallback below */
  }

  if (!isPageVisible(targetId)) showPageFallback(targetId);
  if (isPageVisible(targetId)) {
    startMedicalVisualDevelopmentVideoAtRequestedOffset(targetId);
    document.dispatchEvent(
      new CustomEvent("page:shown", { detail: { id: targetId } }),
    );
  }
}

async function openVideosSubpage(targetId) {
  window.__videosPendingTarget = targetId;
  window.__videosSuppressFlash = true;
  try {
    sessionStorage.setItem("gotoSubPage", targetId);
  } catch {
    /* ignore storage failures */
  }
  await loadPage("videos", { subPageId: targetId });
  await showVideosTarget(targetId);
}

function primeEmbeddedReturn(targetId) {
  if (!MEDICAL_EMBEDDED_RETURN_TARGETS.has(targetId)) return;
  const home = MEDICAL_STANDALONE_HOME[targetId];
  try {
    sessionStorage.setItem(
      INTERACTIVE_LEARNING_RETURN_KEY,
      JSON.stringify({ routeName: "medicalStudentsWorkshop" }),
    );
    if (home?.section) sessionStorage.setItem(RESTORE_FOLDER_KEY, home.section);
    if (home?.nested) sessionStorage.setItem(RESTORE_NESTED_KEY, home.nested);
  } catch {
    /* ignore storage failures */
  }
}

async function navigateToWorkshopFocus(step) {
  if (!step) return;
  try {
    sessionStorage.setItem(RESTORE_FOLDER_KEY, step.section || "introduction");
    if (step.nested) sessionStorage.setItem(RESTORE_NESTED_KEY, step.nested);
    else sessionStorage.removeItem(RESTORE_NESTED_KEY);
    if (step.target) sessionStorage.setItem(RESTORE_TARGET_KEY, step.target);
    else sessionStorage.removeItem(RESTORE_TARGET_KEY);
  } catch {
    /* ignore storage failures */
  }
  removeMedicalNextButtons();
  setFlowEnabled(false);
  await loadPage("medicalStudentsWorkshop", {
    force: true,
    replace: true,
  });
  resetViewportToTopSoon();
}

async function navigateToTarget(targetId) {
  removeMedicalNextButtons();
  setFlowEnabled(true);

  if (INTERNAL_TARGETS.has(targetId)) {
    await loadPage("medicalStudentsWorkshop", { subPageId: targetId });
    if (!isPageVisible(targetId)) showPageFallback(targetId);
    resetViewportToTopSoon();
    return;
  }

  const route = MEDICAL_TARGET_ROUTES[targetId];
  if (VIDEO_TARGETS.has(targetId)) {
    primeEmbeddedReturn(targetId);
    await openVideosSubpage(targetId);
    resetViewportToTopSoon();
    return;
  }

  if (route) {
    await loadPage(route, { subPageId: targetId });
    if (!isPageVisible(targetId)) showPageFallback(targetId);
    resetViewportToTopSoon();
  }
}

async function navigateByStep(step) {
  if (!step) return;
  if (step.type === "target") await navigateToTarget(step.target);
  else if (step.type === "focus") await navigateToWorkshopFocus(step);
  else if (step.type === "rapd") {
    await openRapdExperience(
      "glaucomaRAPDFullSwingInteractive",
      step.mode || "practice",
      FOCUS.pupilApp.section,
      FOCUS.pupilApp.nested,
    );
  }
}

function renderMedicalNavigation(targetId) {
  const config = MEDICAL_NAV_CONFIG[targetId];
  if (!config || !isFlowEnabled()) {
    removeMedicalNextButtons();
    return;
  }

  const page = document.getElementById(targetId);
  if (!page) return;
  page.dataset.medicalStudentsReturn = "true";
  removeMedicalNextButtons();
  document
    .querySelectorAll(
      ".childhood-next-wrap, .glaucoma-next-wrap, .diabetic-next-wrap",
    )
    .forEach((wrap) => wrap.remove());

  const host =
    page.querySelector(".container.pupils-container") ||
    page.querySelector(".container") ||
    page;
  host.classList.add(NEXT_HOST_CLASS);

  const wrap = document.createElement("div");
  wrap.className = "medical-next-wrap";

  const previous = document.createElement("button");
  previous.type = "button";
  previous.className = "medical-prev-btn";
  previous.textContent = "< Previous";
  previous.setAttribute("data-i18n", "i18nLiteral.< Previous");
  previous.addEventListener(
    "click",
    () => void navigateByStep(config.previous),
  );

  const next = document.createElement("button");
  next.type = "button";
  next.className = "medical-next-btn";
  next.textContent = "Next >";
  next.setAttribute("data-i18n", "i18nLiteral.Next >");
  const ready = isMedicalNextReady(targetId);
  next.classList.toggle("is-ready", ready);
  next.disabled = !ready;
  next.setAttribute("aria-disabled", ready ? "false" : "true");
  next.addEventListener("click", () => {
    if (!isMedicalNextReady(targetId)) return;
    void navigateByStep(config.next);
  });

  wrap.append(previous, next);
  host.appendChild(wrap);
  window.I18N?.applyTranslations?.(wrap);
}

function renderMedicalRapdNavigation(targetId, mode) {
  const page = document.getElementById(targetId);
  if (!page || page.dataset.medicalStudentsReturn !== "true") return;

  removeMedicalNextButtons();
  document.querySelectorAll(".glaucoma-next-wrap").forEach((wrap) => {
    wrap.parentElement?.classList.remove("glaucoma-next-host");
    wrap.remove();
  });

  const host =
    page.querySelector(".container.pupils-container") ||
    page.querySelector(".container") ||
    page;
  host.classList.add(NEXT_HOST_CLASS);

  const wrap = document.createElement("div");
  wrap.className = "medical-next-wrap medical-rapd-next-wrap";

  const previous = document.createElement("button");
  previous.type = "button";
  previous.className = "medical-prev-btn";
  previous.textContent = "< Previous";
  previous.setAttribute("data-i18n", "i18nLiteral.< Previous");
  previous.addEventListener("click", () => {
    void navigateToWorkshopFocus(FOCUS.pupilApp);
  });

  const next = document.createElement("button");
  next.type = "button";
  next.className = "medical-next-btn is-ready";
  next.textContent = "Next >";
  next.setAttribute("data-i18n", "i18nLiteral.Next >");
  next.addEventListener("click", () => {
    if (mode === "practice") {
      void openRapdExperience(
        targetId,
        "test",
        FOCUS.pupilApp.section,
        FOCUS.pupilApp.nested,
      );
      return;
    }
    void navigateToTarget("medicalAnteriorSegmentPage");
  });

  wrap.append(previous, next);
  host.appendChild(wrap);
  window.I18N?.applyTranslations?.(wrap);
}

export function initializeMedicalStudentsWorkshopFlowInfra() {
  if (medicalNextInfraWired) return;
  medicalNextInfraWired = true;

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest("#backBtnGlobal")) return;
      if (!isFlowEnabled()) return;
      const visibleId = getVisiblePageId();
      const config = MEDICAL_NAV_CONFIG[visibleId];
      const home = config?.home || MEDICAL_STANDALONE_HOME[visibleId];
      if (!home) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      void navigateToWorkshopFocus(home);
    },
    true,
  );

  document.addEventListener("page:shown", (event) => {
    const shownId = String(event.detail?.id || "");
    if (shownId) {
      startMedicalVisualDevelopmentVideoAtRequestedOffset(shownId);
      renderMedicalNavigation(shownId);
    }
  });

  [
    MEDICAL_PROGRESS_EVENT,
    "diabeticWorkshop:progress-changed",
    "glaucomaWorkshop:progress-changed",
  ].forEach((eventName) => {
    document.addEventListener(eventName, (event) => {
      const targetId = String(event.detail?.target || getVisiblePageId());
      if (targetId) syncMedicalNextReady(targetId);
    });
  });

  window.addEventListener("page:loaded", (event) => {
    const routeName = String(event.detail?.routeName || "");
    if (!FLOW_ROUTES.has(routeName)) {
      removeMedicalNextButtons();
      setFlowEnabled(false);
      return;
    }
    requestAnimationFrame(() => {
      const visibleId = getVisiblePageId();
      if (visibleId) renderMedicalNavigation(visibleId);
    });
  });
}

async function openRapdExperience(targetId, mode, folderKey, nestedKey) {
  setFlowEnabled(true);
  try {
    sessionStorage.setItem("rapdExperience:launchMode", mode || "practice");
    sessionStorage.setItem(RAPD_RETURN_KEY, "1");
    if (folderKey) sessionStorage.setItem(RESTORE_FOLDER_KEY, folderKey);
    if (nestedKey) sessionStorage.setItem(RESTORE_NESTED_KEY, nestedKey);
  } catch {
    /* ignore storage failures */
  }
  await loadPage("glaucomaScrollImages", { force: true, replace: true });
  const target = document.getElementById(targetId);
  if (!target) return;
  target.dataset.medicalStudentsReturn = "true";
  const { initializeGlaucomaScrollInteractiveTarget } =
    await import("./glaucomaWorkshop.js");
  initializeGlaucomaScrollInteractiveTarget?.(targetId);
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
  document.querySelectorAll(".page").forEach((candidate) => {
    candidate.classList.remove("active");
    candidate.style.display = "none";
  });
  target.classList.add("active");
  target.style.display = "block";
  document.dispatchEvent(
    new CustomEvent("page:shown", { detail: { id: targetId } }),
  );
  renderMedicalRapdNavigation(targetId, mode || "practice");
  resetViewportToTopSoon();
}

export function initializeMedicalStudentsWorkshop() {
  const page = document.getElementById(PAGE_ID);
  if (!page || page.dataset.inited === "1") return;
  page.dataset.inited = "1";
  initializeMedicalStudentsWorkshopFlowInfra();
  initializeDiabeticScreeningScrollLessons();
  initializeMedicalAnteriorSegmentCaseStudy();
  wireMedicalEmbeddedVideoProgress();

  document
    .querySelectorAll(
      ".medical-students-workshop-page .menuBtn, .medical-students-scroll-page .menuBtn",
    )
    .forEach((button) => button.addEventListener("click", openMenu));

  const folders = Array.from(page.querySelectorAll(".medical-folder-row"));
  const sections = Array.from(page.querySelectorAll(".medical-section-card"));

  const closeSections = () => {
    sections.forEach((section) => {
      section.classList.remove("medical-nested-folder-open");
      section.hidden = true;
      section.querySelector(":scope > h3 .see-all-toggle")?.remove();
      section
        .querySelectorAll(".medical-nested-section-card")
        .forEach((nested) => {
          nested.hidden = true;
          nested.querySelector("h3 .see-all-toggle")?.remove();
        });
      section.querySelectorAll(".medical-nested-folder-row").forEach((row) => {
        row.hidden = false;
      });
    });
    folders.forEach((folder) => (folder.hidden = false));
    page.classList.remove("medical-folder-open");
  };

  const showSection = (folder) => {
    if (!folder || folder.getAttribute("aria-disabled") === "true") {
      return null;
    }
    const section = page.querySelector(
      `.medical-section-card[data-section="${folder?.dataset.folder}"]`,
    );
    if (!section) return null;
    closeSections();
    folder.hidden = true;
    folder.insertAdjacentElement("afterend", section);
    section.hidden = false;
    page.classList.add("medical-folder-open");
    addCloseToggle(section.querySelector(":scope > h3"), closeSections);
    return section;
  };

  const showNested = (folder) => {
    const section = folder?.closest(".medical-section-card");
    const nested = section?.querySelector(
      `.medical-nested-section-card[data-nested-section="${folder?.dataset.nestedFolder}"]`,
    );
    if (!section || !nested) return null;
    section.classList.add("medical-nested-folder-open");
    section.querySelectorAll(".medical-nested-folder-row").forEach((row) => {
      row.hidden = row === folder;
    });
    section.querySelectorAll(".medical-nested-section-card").forEach((card) => {
      card.hidden = card !== nested;
      card.querySelector("h3 .see-all-toggle")?.remove();
    });
    folder.insertAdjacentElement("afterend", nested);
    nested.hidden = false;
    addCloseToggle(nested.querySelector("h3"), () => {
      nested.hidden = true;
      nested.querySelector("h3 .see-all-toggle")?.remove();
      folder.hidden = false;
      section.classList.remove("medical-nested-folder-open");
    });
    return nested;
  };

  const showPath = ({ sectionKey, nestedKey, targetId } = {}) => {
    const folder = folders.find(
      (candidate) => candidate.dataset.folder === sectionKey,
    );
    const section = showSection(folder);
    if (!section) return;
    if (nestedKey) {
      showNested(
        section.querySelector(
          `.medical-nested-folder-row[data-nested-folder="${nestedKey}"]`,
        ),
      );
    }
    if (targetId) {
      requestAnimationFrame(() => {
        const row = page.querySelector(
          `.lesson-row[data-target="${targetId}"]`,
        );
        row?.scrollIntoView?.({ block: "center" });
        row?.focus?.({ preventScroll: true });
      });
    }
  };

  folders.forEach((folder) => {
    if (folder.getAttribute("aria-disabled") === "true") return;
    activateOnKeyboard(folder, (event) => {
      event.preventDefault();
      showSection(folder);
    });
  });

  page.querySelectorAll(".medical-nested-folder-row").forEach((folder) => {
    activateOnKeyboard(folder, (event) => {
      event.preventDefault();
      event.stopPropagation();
      showNested(folder);
    });
  });

  page.querySelectorAll(".lesson-row[data-target]").forEach((row) => {
    activateOnKeyboard(row, async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const targetId = row.dataset.target;
      const route = row.dataset.route;

      if (INTERNAL_TARGETS.has(targetId)) {
        setFlowEnabled(true);
        await navigateToTarget(targetId);
      } else if (targetId === "glaucomaRAPDFullSwingInteractive") {
        await openRapdExperience(
          targetId,
          row.dataset.rapdLaunchMode,
          row.closest(".medical-section-card")?.dataset.section,
          row.closest(".medical-nested-section-card")?.dataset.nestedSection,
        );
      } else if (
        MEDICAL_NAV_CONFIG[targetId] ||
        MEDICAL_TARGET_ROUTES[targetId]
      ) {
        setFlowEnabled(true);
        await navigateToTarget(targetId);
      } else if (route) {
        await loadPage(route);
      }
    });
  });

  try {
    const restoreFolder = sessionStorage.getItem(RESTORE_FOLDER_KEY);
    const restoreNested = sessionStorage.getItem(RESTORE_NESTED_KEY);
    const restoreTarget = sessionStorage.getItem(RESTORE_TARGET_KEY);
    sessionStorage.removeItem(RESTORE_FOLDER_KEY);
    sessionStorage.removeItem(RESTORE_NESTED_KEY);
    sessionStorage.removeItem(RESTORE_TARGET_KEY);
    if (restoreFolder) {
      showPath({
        sectionKey: restoreFolder,
        nestedKey: restoreNested,
        targetId: restoreTarget,
      });
    }
  } catch {
    /* ignore storage failures */
  }

  const visibleId = getVisiblePageId();
  if (MEDICAL_NAV_CONFIG[visibleId]) {
    setFlowEnabled(true);
    renderMedicalNavigation(visibleId);
  }
}
