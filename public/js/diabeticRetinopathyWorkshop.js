import { loadPage } from "./navigation.js";
import {
  initializeDiabeticWorkshopProgressInfra,
  setDiabeticLessonProgress,
  updateDiabeticWorkshopProgressBars,
} from "./diabeticWorkshopProgress.js";
import { rememberDiabeticWorkshopFlowFromRow } from "./diabeticWorkshopNextFlow.js";

const DIABETIC_WORKSHOP_OPEN_FOLDER_KEY = "diabeticWorkshop:openFolderKey";
const DIABETIC_WORKSHOP_RESTORE_OPEN_KEY = "diabeticWorkshop:restoreOpenFolder";
const DIABETIC_WORKSHOP_FOCUS_SELECTOR_KEY = "diabeticWorkshop:focusSelector";

const HISTORY_IMAGE_MATCH_CASES = Object.freeze([
  {
    id: "case1",
    label: "Cataract",
    imageSrc: "/images/casestudy/case1_eye.webp",
    historyLines: ["Slow vision loss over months", "No pain, only shadows"],
    answerLines: [
      "Vision worsened slowly without pain.",
      "No red eye or discharge suggests cataract.",
    ],
  },
  {
    id: "case2",
    label: "Retinoblastoma",
    imageSrc: "/images/casestudy/case2_eye.webp",
    historyLines: ["White pupil in a baby", "Poor visual attention"],
    answerLines: [
      "A white pupil in a baby is a danger sign.",
      "Poor visual attention supports retinoblastoma.",
    ],
  },
  {
    id: "case3",
    label: "Gonococcal/Chlamydial conjunctivitis",
    imageSrc: "/images/casestudy/case3_eye.webp",
    historyLines: [
      "Pink sticky eyes, yellow discharge",
      "Started in one eye, then both",
    ],
    answerLines: [
      "Thick yellow discharge suggests bacterial conjunctivitis.",
      "This pattern fits gonococcal/chlamydial infection.",
    ],
  },
  {
    id: "case4",
    label: "Trachomatous trichiasis with corneal scarring",
    imageSrc: "/images/casestudy/case4_eye.webp",
    historyLines: ["Long gritty painful eyes", "Blur + chronic surface damage"],
    answerLines: [
      "Long gritty pain suggests chronic surface damage.",
      "This pattern fits trichiasis with corneal scarring.",
    ],
  },
  {
    id: "case5",
    label: "Bacterial / fungal corneal ulcer",
    imageSrc: "/images/casestudy/case5_eye.webp",
    historyLines: ["Bush scratch before pain", "Sticky red eye, only shadows"],
    answerLines: [
      "Severe pain after bush trauma suggests corneal ulcer.",
      "Discharge and very poor vision support infection.",
    ],
  },
  {
    id: "case6",
    label: "Herpes simplex keratitis",
    imageSrc: "/images/casestudy/case6_eye.webp",
    historyLines: ["Painful photophobic red eye", "Recent lip sores"],
    answerLines: [
      "One painful light-sensitive eye suggests keratitis.",
      "Recent lip sores support herpes simplex keratitis.",
    ],
  },
  {
    id: "case7",
    label: "Anterior Uveitis",
    imageSrc: "/images/casestudy/case7_eye.webp",
    historyLines: [
      "One painful photophobic eye",
      "Blur, similar episodes before",
    ],
    answerLines: [
      "Photophobia and pain suggest uveitis.",
      "Repeated similar episodes support anterior uveitis.",
    ],
  },
  {
    id: "case8",
    label: "Pterygium",
    imageSrc: "/images/casestudy/case8_eye.webp",
    historyLines: ["Slow pink growth on eye", "Outdoor UV exposure"],
    answerLines: [
      "A slow-growing pink patch suggests pterygium.",
      "Long outdoor work makes this diagnosis likely.",
    ],
  },
  {
    id: "case9",
    label: "Corneal foreign body with early infection",
    imageSrc: "/images/casestudy/case9_eye.webp",
    historyLines: [
      "Metal work before symptoms",
      "Photophobia, blur, infection",
    ],
    answerLines: [
      "Metal work suggests a corneal foreign body.",
      "Blur and photophobia suggest early infection.",
    ],
  },
  {
    id: "case10",
    label: "Traumatic hyphaema",
    imageSrc: "/images/casestudy/case10_eye.webp",
    historyLines: ["Blunt trauma, sudden blur", "Red eye, shadow vision"],
    answerLines: [
      "Sudden blur after blunt trauma suggests hyphaema.",
      "Painful red watering eye supports the diagnosis.",
    ],
  },
  {
    id: "case11",
    label: "Penetrating corneal laceration with iris prolapse",
    imageSrc: "/images/casestudy/case11_eye.webp",
    historyLines: [
      "Stick injury, worsening pain",
      "Open globe / iris prolapse",
    ],
    answerLines: [
      "Stick injury with worsening blur suggests open globe.",
      "This pattern fits corneal laceration with iris prolapse.",
    ],
  },
  {
    id: "case12",
    label: "Penetrating injury causing traumatic cataract",
    imageSrc: "/images/casestudy/case12_eye.webp",
    historyLines: ["Recent stick injury", "Painful red eye, fast vision loss"],
    answerLines: [
      "Severe vision loss after stick trauma suggests penetration.",
      "Painful red eye with fast decline supports traumatic cataract.",
    ],
  },
]);

const HISTORY_IMAGE_MATCH_LOOKUP = new Map(
  HISTORY_IMAGE_MATCH_CASES.map((item) => [item.id, item]),
);

const HISTORY_IMAGE_MATCH_ROUND_SIZE = 4;

const RETINAL_STRUCTURE_TAP_STEPS = Object.freeze([
  {
    id: "optic-disc",
    label: "Optic Disc",
    tip: "The optic disc is the bright circular area where the vessels meet.",
    explanation:
      "The optic disc is the pale nerve head on the nasal side of the retina.",
    target: { cx: 0.286, cy: 0.441, rx: 0.104, ry: 0.122 },
  },
  {
    id: "fovea",
    label: "Fovea",
    tip: "The fovea is the darker spot temporal to the optic disc.",
    explanation:
      "The fovea is the small dark central pit temporal to the optic disc.",
    target: { cx: 0.884, cy: 0.482, rx: 0.075, ry: 0.075 },
  },
  {
    id: "nasal-retina",
    label: "Nasal Retina",
    tip: "Nasal retina sits on the same side as the optic disc.",
    explanation:
      "The nasal retina is the retinal area on the optic-disc side of the fundus.",
    target: { cx: 0.109, cy: 0.63, rx: 0.15, ry: 0.2 },
  },
  {
    id: "superior-temporal-vessels",
    label: "Superior Temporal Vessels",
    tip: "Follow the upper vascular arcade running temporally from the disc.",
    explanation:
      "The superior temporal vessels form the upper arcade curving away from the disc.",
    target: { cx: 0.515, cy: 0.145, rx: 0.205, ry: 0.095 },
  },
  {
    id: "inferior-temporal-vessels",
    label: "Inferior Temporal Vessels",
    tip: "Follow the lower vascular arcade running temporally from the disc.",
    explanation:
      "The inferior temporal vessels form the lower arcade curving away from the disc.",
    target: { cx: 0.64, cy: 0.79, rx: 0.25, ry: 0.11 },
  },
]);

const REVIEW_VIDEO_QUIZ_OPTIONS = Object.freeze([
  "Margin",
  "Neuro-retinal rim",
  "Fovea",
  "Cup",
  "Blood vessels (veins and arteries)",
]);

const REVIEW_VIDEO_QUIZ_STEPS = Object.freeze([
  {
    id: "main-parts",
    pauseAt: 13,
    question:
      "Which of the following is NOT a main part of the optic nerve head?",
    options: REVIEW_VIDEO_QUIZ_OPTIONS,
    correctIndex: 2,
    explanation: "Fovea belongs to the macula, not to the optic nerve head.",
  },
  {
    id: "highlighted-margin",
    pauseAt: 18,
    question: "What is the name of the highlighted area?",
    options: REVIEW_VIDEO_QUIZ_OPTIONS,
    correctIndex: 0,
    explanation: "The highlighted edge of the optic disc is the margin.",
  },
]);

const FINDINGS_GROUP_TWO_ITEMS = Object.freeze([
  {
    id: "patient-a-va",
    label: "Visual acuity: perception of light",
    zone: "patient-a",
  },
  { id: "patient-a-white-pupil", label: "White pupil", zone: "patient-a" },
  {
    id: "patient-a-white-conjunctiva",
    label: "White conjunctiva",
    zone: "patient-a",
  },
  { id: "patient-a-clear-cornea", label: "Clear cornea", zone: "patient-a" },
  { id: "patient-b-va", label: "Visual acuity: 6/9", zone: "patient-b" },
  { id: "patient-b-photophobia", label: "Photophobia", zone: "patient-b" },
  { id: "patient-b-watery", label: "Watery", zone: "patient-b" },
  {
    id: "patient-b-pink-conjunctiva",
    label: "Pink conjunctiva",
    zone: "patient-b",
  },
  {
    id: "patient-b-white-spots",
    label: "White spots on inner cornea",
    zone: "patient-b",
  },
]);

const CONNECT_QUIZ_GROUPS = Object.freeze([
  {
    id: "mature-cataract",
    diagnosisId: "diag-mature-cataract",
    diagnosis: "Mature Cataract",
    findings: [
      {
        id: "finding-all-vision",
        label: "Painless loss of all vision",
      },
      {
        id: "finding-white-pupil",
        label: "White Pupil",
      },
      {
        id: "finding-loss-red-reflex",
        label: "Loss of red reflex",
      },
    ],
    tone: "violet",
  },
  {
    id: "primary-open-glaucoma",
    diagnosisId: "diag-primary-open-glaucoma",
    diagnosis: "Primary Open Glaucoma",
    findings: [
      {
        id: "finding-peripheral-vision",
        label: "Painless loss of peripheral vision",
      },
      {
        id: "finding-cupped-disc",
        label: "Cupped Optic Disc",
      },
      {
        id: "finding-rim-thinning",
        label: "Neuroretinal rim thinning",
      },
    ],
    tone: "gold",
  },
  {
    id: "diabetic-maculopathy",
    diagnosisId: "diag-diabetic-maculopathy",
    diagnosis: "Diabetic Maculopathy",
    findings: [
      {
        id: "finding-central-vision",
        label: "Painless loss of central vision",
      },
      {
        id: "finding-hard-exudate",
        label: "Hard Exudate at macula",
      },
      {
        id: "finding-microaneurysms",
        label: "Microaneurysms near macula",
      },
    ],
    tone: "teal",
  },
]);

const CONNECT_QUIZ_FINDINGS = Object.freeze(
  CONNECT_QUIZ_GROUPS.flatMap((group) =>
    group.findings.map((finding) => ({
      ...finding,
      diagnosisId: group.diagnosisId,
      tone: group.tone,
    })),
  ),
);

const CONNECT_QUIZ_FINDING_LOOKUP = new Map(
  CONNECT_QUIZ_FINDINGS.map((finding) => [finding.id, finding]),
);

function shuffleItems(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function chunkItems(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function clampWorkshopProgress(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function mixWorkshopProgress(progress, start, end) {
  if (end <= start) return progress >= end ? 1 : 0;
  return clampWorkshopProgress((progress - start) / (end - start));
}

function holdWorkshopProgress(
  progress,
  fadeInStart,
  fadeInEnd,
  fadeOutStart,
  fadeOutEnd,
) {
  return (
    mixWorkshopProgress(progress, fadeInStart, fadeInEnd) *
    (1 - mixWorkshopProgress(progress, fadeOutStart, fadeOutEnd))
  );
}

function getWorkshopScrollRoot(node) {
  let current = node?.parentElement ?? null;

  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY || style.overflow;
    if (/(auto|scroll|overlay)/.test(overflowY)) {
      return current;
    }
    current = current.parentElement;
  }

  return window;
}

function getWorkshopRootMetrics(scrollRoot) {
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

function formatWorkshopCssNumber(value) {
  return Number.isFinite(value) ? value.toFixed(4) : "0";
}

function setPackageElementState(
  element,
  { opacity = 0, x = 0, y = 0, scale = 1 } = {},
) {
  if (!element) return;

  const visible = opacity > 0.001;
  element.style.setProperty(
    "--opacity",
    formatWorkshopCssNumber(clampWorkshopProgress(opacity)),
  );
  element.style.setProperty("--x", `${formatWorkshopCssNumber(x)}px`);
  element.style.setProperty("--y", `${formatWorkshopCssNumber(y)}px`);
  element.style.setProperty("--scale", formatWorkshopCssNumber(scale));
  element.style.visibility = visible ? "visible" : "hidden";
}

function setPackageLabelState(element, { opacity = 0, x = 0, y = 0 } = {}) {
  if (!element) return;

  const visible = opacity > 0.001;
  element.style.setProperty(
    "--opacity",
    formatWorkshopCssNumber(clampWorkshopProgress(opacity)),
  );
  element.style.setProperty("--x", `${formatWorkshopCssNumber(x)}px`);
  element.style.setProperty("--y", `${formatWorkshopCssNumber(y)}px`);
  element.style.visibility = visible ? "visible" : "hidden";
}

function renderArclightPackageScene(elements, rawProgress) {
  const progress = clampWorkshopProgress(rawProgress);
  const cueEnterOpacity = mixWorkshopProgress(rawProgress, -0.006, 0.012);
  const cueExitOpacity = 1 - mixWorkshopProgress(progress, 0.045, 0.075);
  const cueOpacity = cueEnterOpacity * cueExitOpacity;
  const contentOpacity = 1;
  const visualPhase = mixWorkshopProgress(progress, 0.04, 0.58);
  const devicePhase = mixWorkshopProgress(progress, 0.62, 1);
  const visualDistanceOnlyOpacity = holdWorkshopProgress(
    visualPhase,
    0.02,
    0.16,
    0.26,
    0.4,
  );
  const visualNearPersistentOpacity = mixWorkshopProgress(
    visualPhase,
    0.42,
    0.56,
  );
  const visualBothOpacity = mixWorkshopProgress(visualPhase, 0.82, 0.88);
  const distanceHighlightOpacity = Math.max(
    visualDistanceOnlyOpacity,
    visualBothOpacity,
  );
  const nearHighlightOpacity = visualNearPersistentOpacity;
  const deviceLoupeOnlyOpacity = holdWorkshopProgress(
    devicePhase,
    0.02,
    0.16,
    0.3,
    0.44,
  );
  const deviceOphthalmoscopeOpacity = mixWorkshopProgress(
    devicePhase,
    0.34,
    0.48,
  );
  const deviceBothRevealOpacity = mixWorkshopProgress(devicePhase, 0.9, 0.99);
  const loupeHighlightOpacity = Math.max(
    deviceLoupeOnlyOpacity,
    deviceBothRevealOpacity,
  );
  const ophthalmoscopeHighlightOpacity = deviceOphthalmoscopeOpacity;

  setPackageElementState(elements.scrollCue, {
    opacity: cueOpacity,
    y: 16 * (1 - cueOpacity),
    scale: 0.98 + cueOpacity * 0.02,
  });

  setPackageElementState(elements.toolsCopy, {
    opacity: contentOpacity,
    y: 0,
    scale: 1,
  });
  setPackageElementState(elements.nearFigure, {
    opacity: contentOpacity,
    y: 0,
    scale: 1,
  });
  setPackageLabelState(elements.distanceLabel, {
    opacity: distanceHighlightOpacity,
    x: -6 * (1 - distanceHighlightOpacity),
    y: 10 * (1 - distanceHighlightOpacity),
  });
  setPackageLabelState(elements.nearLabel, {
    opacity: nearHighlightOpacity,
    x: 6 * (1 - nearHighlightOpacity),
    y: 10 * (1 - nearHighlightOpacity),
  });

  setPackageElementState(elements.deviceCopy, {
    opacity: contentOpacity,
    y: 0,
    scale: 1,
  });
  setPackageElementState(elements.deviceFigure, {
    opacity: contentOpacity,
    y: 0,
    scale: 1,
  });
  setPackageLabelState(elements.loupeHighlight, {
    opacity: loupeHighlightOpacity,
    x: -4 * (1 - loupeHighlightOpacity),
    y: 8 * (1 - loupeHighlightOpacity),
  });
  setPackageLabelState(elements.ophthalmoscopeHighlight, {
    opacity: ophthalmoscopeHighlightOpacity,
    x: 4 * (1 - ophthalmoscopeHighlightOpacity),
    y: 8 * (1 - ophthalmoscopeHighlightOpacity),
  });
  setPackageLabelState(elements.loupeLabel, {
    opacity: loupeHighlightOpacity,
    x: -10 * (1 - loupeHighlightOpacity),
    y: 10 * (1 - loupeHighlightOpacity),
  });
  setPackageLabelState(elements.ophthalmoscopeLabel, {
    opacity: ophthalmoscopeHighlightOpacity,
    x: 10 * (1 - ophthalmoscopeHighlightOpacity),
    y: 10 * (1 - ophthalmoscopeHighlightOpacity),
  });
}

let didBindArclightPackagePageShownListener = false;

function bindArclightPackagePageShownListener() {
  if (didBindArclightPackagePageShownListener) return;
  didBindArclightPackagePageShownListener = true;

  document.addEventListener("page:shown", (event) => {
    if (event.detail?.id !== "diabeticArclightPackagePage") return;

    const page = document.getElementById("diabeticArclightPackagePage");
    const scheduleRender = page?._diabeticArclightPackageScheduleRender;
    if (typeof scheduleRender !== "function") return;

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        scheduleRender();
      });
    });
  });
}

function initializeDiabeticArclightPackagePage() {
  const page = document.getElementById("diabeticArclightPackagePage");
  if (!page) return;

  if (typeof page._diabeticArclightPackageCleanup === "function") {
    page._diabeticArclightPackageCleanup();
  }

  const story = page.querySelector("[data-dr-package-story]");
  if (!story) return;

  const elements = {
    scrollCue: page.querySelector('[data-dr-package="scrollCue"]'),
    toolsCopy: page.querySelector('[data-dr-package="toolsCopy"]'),
    nearFigure: page.querySelector('[data-dr-package="nearFigure"]'),
    distanceLabel: page.querySelector('[data-dr-package="distanceLabel"]'),
    nearLabel: page.querySelector('[data-dr-package="nearLabel"]'),
    deviceCopy: page.querySelector('[data-dr-package="deviceCopy"]'),
    deviceFigure: page.querySelector('[data-dr-package="deviceFigure"]'),
    loupeHighlight: page.querySelector('[data-dr-package="loupeHighlight"]'),
    ophthalmoscopeHighlight: page.querySelector(
      '[data-dr-package="ophthalmoscopeHighlight"]',
    ),
    loupeLabel: page.querySelector('[data-dr-package="loupeLabel"]'),
    ophthalmoscopeLabel: page.querySelector(
      '[data-dr-package="ophthalmoscopeLabel"]',
    ),
  };

  const requiredElements = [
    elements.scrollCue,
    elements.toolsCopy,
    elements.nearFigure,
    elements.distanceLabel,
    elements.nearLabel,
    elements.deviceCopy,
    elements.deviceFigure,
    elements.loupeHighlight,
    elements.ophthalmoscopeHighlight,
    elements.loupeLabel,
    elements.ophthalmoscopeLabel,
  ];

  if (requiredElements.some((element) => !element)) return;

  const controller = new AbortController();
  const { signal } = controller;
  const scrollRoot = getWorkshopScrollRoot(page);

  let rafId = 0;
  let lastProgress = -1;

  const scheduleRender = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = 0;

      const rootMetrics = getWorkshopRootMetrics(scrollRoot);
      const storyRect = story.getBoundingClientRect();
      const travel = Math.max(storyRect.height - rootMetrics.height, 1);
      const rawProgress = (rootMetrics.top - storyRect.top) / travel;
      const progress = clampWorkshopProgress(rawProgress);

      if (Math.abs(rawProgress - lastProgress) < 0.0005) return;
      lastProgress = rawProgress;
      renderArclightPackageScene(elements, rawProgress);
    });
  };

  const listen = (target, type, handler, options = {}) => {
    if (!target?.addEventListener) return;
    target.addEventListener(type, handler, { ...options, signal });
  };

  if (scrollRoot === window) {
    listen(window, "scroll", scheduleRender, { passive: true });
  } else {
    listen(scrollRoot, "scroll", scheduleRender, { passive: true });
  }

  listen(window, "resize", scheduleRender, { passive: true });
  listen(window, "orientationchange", scheduleRender, { passive: true });

  page.querySelectorAll("img").forEach((img) => {
    if (img.complete) return;
    listen(img, "load", scheduleRender, { once: true });
  });

  page._diabeticArclightPackageScheduleRender = () => {
    lastProgress = -1;
    scheduleRender();
  };
  page._diabeticArclightPackageCleanup = () => {
    controller.abort();
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
    delete page._diabeticArclightPackageCleanup;
    delete page._diabeticArclightPackageScheduleRender;
  };

  renderArclightPackageScene(elements, -1);
  bindArclightPackagePageShownListener();
}

function initializeDiabeticScreeningScrollLessons() {
  const lessons = document.querySelectorAll("[data-diabetic-scroll-lesson]");

  lessons.forEach((lesson) => {
    if (lesson.dataset.diabeticScrollInited === "1") return;

    const page = lesson.closest(".page");
    const steps = Array.from(
      lesson.querySelectorAll("[data-diabetic-scroll-step]"),
    );
    if (!page || steps.length === 0) return;

    lesson.dataset.diabeticScrollInited = "1";
    const scrollRoot = getWorkshopScrollRoot(lesson);
    const cue = lesson.querySelector("[data-diabetic-scroll-cue]");
    const controller = new AbortController();
    const { signal } = controller;

    let rafId = 0;

    if (cue && cue.dataset.diabeticCueUpgraded !== "1") {
      cue.dataset.diabeticCueUpgraded = "1";
      cue.innerHTML = `
        <div class="diabetic-screening-scroll-cue__pill">
          <span class="diabetic-screening-scroll-cue__label">scroll<br>down</span>
          <div class="diabetic-screening-scroll-cue__stack">
            <img
              class="diabetic-screening-scroll-cue__down"
              src="/scrolly/workshop/childhood/eyesbrain/down.png"
              alt=""
              loading="eager"
              draggable="false"
            >
            <img
              class="diabetic-screening-scroll-cue__hand"
              src="/scrolly/workshop/childhood/eyesbrain/hand.png"
              alt=""
              loading="eager"
              draggable="false"
            >
            <span class="diabetic-screening-scroll-cue__chev"></span>
            <span class="diabetic-screening-scroll-cue__chev"></span>
            <span class="diabetic-screening-scroll-cue__chev"></span>
          </div>
        </div>
      `;
    }

    const isPageShown = () => {
      let node = page;
      while (node) {
        const style = window.getComputedStyle(node);
        if (style.display === "none" || style.visibility === "hidden") {
          return false;
        }
        node = node.parentElement;
      }
      return true;
    };

    const render = () => {
      rafId = 0;
      if (!isPageShown()) return;

      const rootMetrics = getWorkshopRootMetrics(scrollRoot);
      const revealTop = rootMetrics.top + rootMetrics.height * 0.12;
      const revealBottom = rootMetrics.top + rootMetrics.height * 0.84;
      let hasCurrent = false;
      let currentIndex = 0;

      steps.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        const intersects = rect.top < revealBottom && rect.bottom > revealTop;
        const shouldReveal =
          intersects || (index === 0 && rect.top < revealBottom);

        if (shouldReveal) step.classList.add("is-visible");

        if (intersects && !hasCurrent) {
          step.classList.add("is-current");
          hasCurrent = true;
          currentIndex = index;
        } else {
          step.classList.remove("is-current");
        }
      });

      lesson
        .querySelectorAll("[data-diabetic-visible-class]")
        .forEach((trigger) => {
          const className = trigger.dataset.diabeticVisibleClass;
          if (!className) return;

          const rect = trigger.getBoundingClientRect();
          const target =
            trigger.closest("[data-diabetic-scroll-step]") || trigger;
          target.classList.toggle(
            className,
            rect.top < revealBottom && rect.bottom > revealTop,
          );
        });

      lesson.dataset.diabeticCurrentStep = String(currentIndex);

      if (cue) {
        const lessonRect = lesson.getBoundingClientRect();
        const travel = Math.max(lessonRect.height - rootMetrics.height, 1);
        const progress = clampWorkshopProgress(
          (rootMetrics.top - lessonRect.top) / travel,
        );
        cue.classList.toggle("is-hidden", progress > 0.035);
      }

      lesson.querySelectorAll("[data-diabetic-zoom]").forEach((zoom) => {
        const rect = zoom.getBoundingClientRect();
        const progress = clampWorkshopProgress(
          (rootMetrics.height * 0.78 - rect.top + rootMetrics.top) /
            Math.max(rect.height + rootMetrics.height * 0.28, 1),
        );
        zoom.style.setProperty("--zoom-progress", progress.toFixed(4));
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

    lesson.querySelectorAll("[data-diabetic-wheel-zoom]").forEach((zoom) => {
      if (zoom.dataset.diabeticWheelZoomWired === "1") return;
      zoom.dataset.diabeticWheelZoomWired = "1";
      zoom.style.setProperty("--zoom-progress", "0");

      listen(
        zoom,
        "wheel",
        (event) => {
          event.preventDefault();
          const current = Number.parseFloat(
            zoom.style.getPropertyValue("--zoom-progress") || "0",
          );
          const direction = event.deltaY > 0 ? 1 : -1;
          const next = clampWorkshopProgress(current + direction * 0.08);
          zoom.style.setProperty("--zoom-progress", next.toFixed(4));
        },
        { passive: false },
      );
    });

    lesson
      .querySelectorAll("video[data-diabetic-video-start]")
      .forEach((video) => {
        if (video.dataset.diabeticClipWired === "1") return;
        video.dataset.diabeticClipWired = "1";

        const start = Number.parseFloat(
          video.dataset.diabeticVideoStart || "0",
        );
        const end = Number.parseFloat(video.dataset.diabeticVideoEnd || "0");

        const seekToStart = () => {
          if (!Number.isFinite(start) || start <= 0) return;
          if (
            video.currentTime >= start - 0.1 &&
            (!Number.isFinite(end) || end <= 0 || video.currentTime < end)
          ) {
            return;
          }
          try {
            video.currentTime = start;
          } catch {
            /* ignore media seek failures */
          }
        };

        listen(video, "loadedmetadata", seekToStart);
        listen(video, "play", seekToStart);
        listen(video, "timeupdate", () => {
          if (!Number.isFinite(end) || end <= 0) return;
          if (video.currentTime < end) return;
          try {
            video.pause();
            video.currentTime = end;
          } catch {
            /* ignore media pause failures */
          }
        });
      });

    steps[0]?.classList.add("is-visible");

    if (scrollRoot === window) {
      listen(window, "scroll", scheduleRender, { passive: true });
    } else {
      listen(scrollRoot, "scroll", scheduleRender, { passive: true });
    }
    listen(window, "resize", scheduleRender, { passive: true });
    listen(window, "orientationchange", scheduleRender, { passive: true });
    listen(document, "page:shown", (event) => {
      if (event.detail?.id !== page.id) return;
      steps[0]?.classList.add("is-visible");
      cue?.classList.remove("is-hidden");
      lesson
        .querySelectorAll("video[data-diabetic-video-start]")
        .forEach((video) => {
          const start = Number.parseFloat(
            video.dataset.diabeticVideoStart || "0",
          );
          if (!Number.isFinite(start) || start <= 0) return;
          try {
            video.pause();
            video.currentTime = start;
          } catch {
            /* ignore media reset failures */
          }
        });
      scheduleRender();
      window.requestAnimationFrame(scheduleRender);
    });

    page._diabeticScreeningScrollCleanup = () => {
      controller.abort();
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      delete page._diabeticScreeningScrollCleanup;
    };

    scheduleRender();
  });
}

function showPageById(id) {
  if (!id) return;

  if (typeof window.showPage === "function") {
    window.showPage(id);
  } else if (typeof window.minimalShowPage === "function") {
    window.minimalShowPage(id);
    document.dispatchEvent(new CustomEvent("page:shown", { detail: { id } }));
  } else {
    document.querySelectorAll(".page").forEach((page) => {
      page.classList.remove("active");
      page.style.display = "none";
    });
    const target = document.getElementById(id);
    if (!target) return;
    target.classList.add("active");
    target.style.display = "block";
    document.dispatchEvent(new CustomEvent("page:shown", { detail: { id } }));
  }

  try {
    window.scrollTo(0, 0);
  } catch {}
}

function readDiabeticWorkshopSessionValue(key) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeDiabeticWorkshopSessionValue(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* ignore session storage failures */
  }
}

function removeDiabeticWorkshopSessionValue(key) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* ignore session storage failures */
  }
}

function restoreFocusedLesson(card) {
  const selector = readDiabeticWorkshopSessionValue(
    DIABETIC_WORKSHOP_FOCUS_SELECTOR_KEY,
  );
  if (!selector || !card) return;

  const target = card.querySelector(selector);
  removeDiabeticWorkshopSessionValue(DIABETIC_WORKSHOP_FOCUS_SELECTOR_KEY);
  if (!target) return;

  window.requestAnimationFrame(() => {
    try {
      target.scrollIntoView({ block: "center", behavior: "smooth" });
    } catch {
      target.scrollIntoView();
    }

    target.classList.add("diabetic-restored-focus");
    window.setTimeout(() => {
      target.classList.remove("diabetic-restored-focus");
    }, 1800);

    target.focus?.({ preventScroll: true });
  });
}

async function openVideosSubpage(targetId) {
  if (!targetId) return;

  try {
    window.__videosPendingTarget = targetId;
    window.__videosSuppressFlash = true;
    sessionStorage.setItem("gotoSubPage", targetId);
  } catch {
    /* ignore session storage failures */
  }

  await loadPage("videos");

  try {
    const { goToVideosSection } = await import("./videos.js");
    if (typeof goToVideosSection === "function") {
      goToVideosSection(targetId, { skipDefault: true });
      return;
    }
  } catch {
    /* ignore videos helper import failures */
  }

  showPageById(targetId);
}

function updateWorkshopFolderItemBadges(page) {
  const folderRows = page.querySelectorAll(
    "#diabeticWorkshopFolders .diabetic-folder-row[data-folder]",
  );

  folderRows.forEach((row) => {
    const sectionKey = row.getAttribute("data-folder");
    if (!sectionKey) return;

    const section = page.querySelector(
      `.diabetic-section-card[data-section="${sectionKey}"]`,
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

function setupWorkshopFolders(page) {
  const folders = page.querySelectorAll(
    "#diabeticWorkshopFolders .diabetic-folder-row",
  );
  const sectionCards = page.querySelectorAll(".diabetic-section-card");
  const foldersContainer = page.querySelector("#diabeticWorkshopFolders");
  if (!foldersContainer) return;

  updateWorkshopFolderItemBadges(page);

  const hideAllSectionCards = () => {
    sectionCards.forEach((card) => {
      card.style.display = "none";
      const titleEl = card.querySelector("h3");
      titleEl?.querySelector(".see-all-toggle")?.remove();
    });
  };

  const showSectionByKey = (key) => {
    const card = page.querySelector(
      `.diabetic-section-card[data-section="${key}"]`,
    );
    const openFolderRow = page.querySelector(
      `#diabeticWorkshopFolders .diabetic-folder-row[data-folder="${key}"]`,
    );
    if (!card || !openFolderRow) return;

    hideAllSectionCards();
    folders.forEach((row) => {
      row.style.display = "";
    });

    openFolderRow.style.display = "none";
    writeDiabeticWorkshopSessionValue(DIABETIC_WORKSHOP_OPEN_FOLDER_KEY, key);
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
      removeDiabeticWorkshopSessionValue(DIABETIC_WORKSHOP_OPEN_FOLDER_KEY);
      removeDiabeticWorkshopSessionValue(DIABETIC_WORKSHOP_RESTORE_OPEN_KEY);
      page.classList.remove("diabetic-folder-open");
    };

    toggle.addEventListener("click", closeNow);
    toggle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") closeNow(event);
    });

    titleEl.appendChild(toggle);
    restoreFocusedLesson(card);
  };

  page.__showSectionByKey = showSectionByKey;

  hideAllSectionCards();
  folders.forEach((row) => {
    row.style.display = "";
  });
  foldersContainer.style.display = "";
  page.classList.remove("diabetic-folder-open");

  const shouldRestore =
    readDiabeticWorkshopSessionValue(DIABETIC_WORKSHOP_RESTORE_OPEN_KEY) ===
    "1";
  const savedKey = readDiabeticWorkshopSessionValue(
    DIABETIC_WORKSHOP_OPEN_FOLDER_KEY,
  );

  if (shouldRestore && savedKey) {
    removeDiabeticWorkshopSessionValue(DIABETIC_WORKSHOP_RESTORE_OPEN_KEY);
    showSectionByKey(savedKey);
  } else {
    removeDiabeticWorkshopSessionValue(DIABETIC_WORKSHOP_OPEN_FOLDER_KEY);
    removeDiabeticWorkshopSessionValue(DIABETIC_WORKSHOP_RESTORE_OPEN_KEY);
    removeDiabeticWorkshopSessionValue(DIABETIC_WORKSHOP_FOCUS_SELECTOR_KEY);
  }

  folders.forEach((row) => {
    if (row.dataset.wired === "1") return;
    row.dataset.wired = "1";

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

function initializeHistoryImageMatchPage(workshopPage) {
  const page = document.getElementById("diabeticHistoryImageMatchPage");
  if (!page || page.dataset.inited === "1") return;

  const imageBank = page.querySelector("#diabeticHistoryImageMatchBank");
  const promptList = page.querySelector("#diabeticHistoryImageMatchSlots");
  const hint = page.querySelector("#diabeticHistoryImageMatchHint");
  const progress = page.querySelector("#diabeticHistoryImageMatchProgress");
  const progressLabel = page.querySelector(
    "#diabeticHistoryImageMatchProgressLabel",
  );
  const submitButton = page.querySelector("#diabeticHistoryImageMatchSubmit");
  const feedback = page.querySelector("#diabeticHistoryImageMatchFeedback");
  const introModal = page.querySelector("#diabeticHistoryImageMatchIntroModal");
  const resultsModal = page.querySelector(
    "#diabeticHistoryImageMatchResultsModal",
  );
  const resultsSummary = page.querySelector(
    "#diabeticHistoryImageMatchResultsSummary",
  );
  const resultsList = page.querySelector(
    "#diabeticHistoryImageMatchResultsList",
  );
  const introCloseButtons = page.querySelectorAll(
    "[data-history-match-modal-close]",
  );
  const resultsCloseButtons = page.querySelectorAll(
    "[data-history-match-results-close]",
  );

  if (
    !imageBank ||
    !promptList ||
    !hint ||
    !progress ||
    !progressLabel ||
    !submitButton ||
    !feedback ||
    !introModal ||
    !resultsModal ||
    !resultsSummary ||
    !resultsList
  ) {
    return;
  }

  page.dataset.inited = "1";
  page
    .querySelectorAll(".diabetic-history-match__modal-close")
    .forEach((button) => {
      button.innerHTML = "&times;";
    });

  const state = {
    rounds: [],
    currentRoundIndex: 0,
    hasCompletedQuiz: false,
    dragImageId: null,
    dragPointerId: null,
    dragSourceEl: null,
    dragGhostEl: null,
    dragCleanup: null,
    dropPromptId: null,
    dropRowEl: null,
  };

  const buildRounds = () =>
    chunkItems(HISTORY_IMAGE_MATCH_CASES, HISTORY_IMAGE_MATCH_ROUND_SIZE).map(
      (items) => ({
        items,
        imageOrder: items.map((item) => item.id),
        promptOrder: shuffleItems(items.map((item) => item.id)),
        assignments: new Map(),
      }),
    );

  const getCurrentRound = () => state.rounds[state.currentRoundIndex] || null;

  const getAssignedPromptId = (imageId) => {
    const round = getCurrentRound();
    if (!round) return null;

    for (const [promptId, assignedImageId] of round.assignments.entries()) {
      if (assignedImageId === imageId) return promptId;
    }
    return null;
  };

  const clearAssignmentForImage = (imageId) => {
    const promptId = getAssignedPromptId(imageId);
    if (!promptId) return;

    getCurrentRound()?.assignments.delete(promptId);
  };

  const setFeedback = (text = "", variant = "") => {
    feedback.textContent = "";
    feedback.className = "diabetic-history-match__feedback";
    if (!text) return;

    feedback.textContent = text;
    if (variant) feedback.classList.add(variant);
  };

  const setHint = (text, isActive = false) => {
    hint.textContent = text;
    hint.classList.toggle("is-active", isActive);
  };

  const openIntroModal = () => {
    introModal.classList.add("is-open");
    introModal.setAttribute("aria-hidden", "false");
  };

  const closeIntroModal = () => {
    introModal.classList.remove("is-open");
    introModal.setAttribute("aria-hidden", "true");
  };

  const openResultsModal = () => {
    resultsModal.classList.add("is-open");
    resultsModal.setAttribute("aria-hidden", "false");
  };

  const closeResultsModal = () => {
    resultsModal.classList.remove("is-open");
    resultsModal.setAttribute("aria-hidden", "true");
  };

  const clearDropTarget = () => {
    if (state.dropRowEl) {
      state.dropRowEl.classList.remove("is-drop-target");
    }
    state.dropRowEl = null;
    state.dropPromptId = null;
  };

  const removeDragGhost = () => {
    state.dragGhostEl?.remove();
    state.dragGhostEl = null;
  };

  const updateDragGhostPosition = (event) => {
    if (!state.dragGhostEl) return;
    state.dragGhostEl.style.left = `${event.clientX - 42}px`;
    state.dragGhostEl.style.top = `${event.clientY - 42}px`;
  };

  const createDragGhost = (imageId) => {
    const item = HISTORY_IMAGE_MATCH_LOOKUP.get(imageId);
    if (!item) return null;

    const ghost = document.createElement("div");
    ghost.className = "diabetic-history-match__drag-ghost";

    const image = document.createElement("img");
    image.src = item.imageSrc;
    image.alt = "";
    image.setAttribute("aria-hidden", "true");

    ghost.appendChild(image);
    document.body.appendChild(ghost);
    state.dragGhostEl = ghost;
    return ghost;
  };

  const getImageNumber = (imageId) => {
    const round = getCurrentRound();
    if (!round) return 0;
    return round.imageOrder.indexOf(imageId) + 1;
  };

  const renderProgress = () => {
    progress.innerHTML = "";

    state.rounds.forEach((_, index) => {
      const step = document.createElement("span");
      step.className = "diabetic-history-match__progress-step";

      if (state.hasCompletedQuiz || index < state.currentRoundIndex) {
        step.classList.add("is-complete");
      } else if (index === state.currentRoundIndex) {
        step.classList.add("is-active");
      }

      progress.appendChild(step);
    });

    const currentStep = Math.min(
      state.currentRoundIndex + 1,
      state.rounds.length || 1,
    );
    progressLabel.textContent = `Set ${currentStep} of ${state.rounds.length}`;
  };

  const updateLessonProgress = () => {
    const totalItems = HISTORY_IMAGE_MATCH_CASES.length || 1;
    const placedCount = state.rounds.reduce(
      (sum, round) => sum + round.assignments.size,
      0,
    );
    const percent = state.hasCompletedQuiz
      ? 100
      : (placedCount / totalItems) * 90;

    setDiabeticLessonProgress("diabeticHistoryImageMatchPage", percent);
  };

  const updateDropTarget = (clientX, clientY) => {
    const hit = document.elementFromPoint(clientX, clientY);
    const row = hit?.closest?.(".diabetic-history-match__row[data-prompt-id]");

    if (!row || !promptList.contains(row)) {
      clearDropTarget();
      return;
    }

    const promptId = row.getAttribute("data-prompt-id");
    if (!promptId) {
      clearDropTarget();
      return;
    }

    if (state.dropRowEl === row && state.dropPromptId === promptId) return;

    clearDropTarget();
    state.dropRowEl = row;
    state.dropPromptId = promptId;
    row.classList.add("is-drop-target");
  };

  const assignImageToPrompt = (imageId, promptId) => {
    const round = getCurrentRound();
    if (!round) return;

    clearAssignmentForImage(imageId);
    round.assignments.set(promptId, imageId);
    setFeedback("");
    setHint("Placed. Drag a filled photo to change a match.", true);
    render();
  };

  const finishDrag = ({ applyDrop }) => {
    if (applyDrop && state.dragImageId && state.dropPromptId) {
      assignImageToPrompt(state.dragImageId, state.dropPromptId);
    } else if (!state.hasCompletedQuiz) {
      setHint("Drag an image onto the matching history card.");
    }

    state.dragCleanup?.();
    state.dragCleanup = null;

    if (state.dragSourceEl) {
      state.dragSourceEl.classList.remove("is-dragging");
    }

    removeDragGhost();
    clearDropTarget();
    state.dragImageId = null;
    state.dragPointerId = null;
    state.dragSourceEl = null;
  };

  const startDrag = (imageId, event, sourceEl) => {
    if (typeof event.button === "number" && event.button !== 0) return;
    event.preventDefault();

    finishDrag({ applyDrop: false });

    state.dragImageId = imageId;
    state.dragPointerId = event.pointerId;
    state.dragSourceEl = sourceEl;

    sourceEl.classList.add("is-dragging");
    createDragGhost(imageId);
    updateDragGhostPosition(event);
    updateDropTarget(event.clientX, event.clientY);
    setHint("Drop on the matching history card.", true);

    try {
      sourceEl.setPointerCapture(event.pointerId);
    } catch {}

    const handlePointerMove = (moveEvent) => {
      if (moveEvent.pointerId !== state.dragPointerId) return;
      updateDragGhostPosition(moveEvent);
      updateDropTarget(moveEvent.clientX, moveEvent.clientY);
    };

    const handlePointerUp = (upEvent) => {
      if (upEvent.pointerId !== state.dragPointerId) return;
      updateDragGhostPosition(upEvent);
      updateDropTarget(upEvent.clientX, upEvent.clientY);
      finishDrag({ applyDrop: true });
    };

    const handlePointerCancel = (cancelEvent) => {
      if (cancelEvent.pointerId !== state.dragPointerId) return;
      finishDrag({ applyDrop: false });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);

    state.dragCleanup = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);

      try {
        sourceEl.releasePointerCapture?.(event.pointerId);
      } catch {}
    };
  };

  const renderImageBank = () => {
    imageBank.innerHTML = "";
    const round = getCurrentRound();
    if (!round) return;

    const createImageButton = (imageId, className = "") => {
      const item = HISTORY_IMAGE_MATCH_LOOKUP.get(imageId);
      if (!item) return null;

      const button = document.createElement("button");
      button.type = "button";
      button.className =
        `diabetic-history-match__image-button ${className}`.trim();
      button.setAttribute(
        "aria-label",
        `Drag image ${getImageNumber(imageId)}`,
      );
      button.draggable = false;

      button.addEventListener("pointerdown", (event) =>
        startDrag(imageId, event, button),
      );
      button.addEventListener("dragstart", (event) => event.preventDefault());

      const order = document.createElement("span");
      order.className = "diabetic-history-match__image-order";
      order.textContent = String(getImageNumber(imageId));

      const image = document.createElement("img");
      image.className = "diabetic-history-match__image";
      image.src = item.imageSrc;
      image.alt = item.label;
      image.loading = "lazy";
      image.draggable = false;

      button.appendChild(order);
      button.appendChild(image);
      return button;
    };

    round.imageOrder.forEach((imageId) => {
      if (getAssignedPromptId(imageId)) return;

      const button = createImageButton(
        imageId,
        "diabetic-history-match__image-button--bank",
      );
      if (!button) return;
      imageBank.appendChild(button);
    });
  };

  const renderPromptList = () => {
    promptList.innerHTML = "";
    const round = getCurrentRound();
    if (!round) return;

    round.promptOrder.forEach((promptId, index) => {
      const item = HISTORY_IMAGE_MATCH_LOOKUP.get(promptId);
      if (!item) return;

      const assignedImageId = round.assignments.get(promptId) || null;
      const assignedItem = assignedImageId
        ? HISTORY_IMAGE_MATCH_LOOKUP.get(assignedImageId)
        : null;

      const row = document.createElement("div");
      row.className = "diabetic-history-match__row";
      row.setAttribute("data-prompt-id", promptId);
      row.setAttribute("aria-label", `History card ${index + 1}`);

      if (assignedItem) row.classList.add("is-filled");

      const slot = document.createElement("div");
      slot.className = "diabetic-history-match__slot";

      if (assignedItem) {
        const button = document.createElement("button");
        button.type = "button";
        button.className =
          "diabetic-history-match__image-button diabetic-history-match__image-button--slot";
        button.setAttribute(
          "aria-label",
          `Drag image ${getImageNumber(assignedImageId)}`,
        );
        button.draggable = false;
        button.addEventListener("pointerdown", (event) =>
          startDrag(assignedImageId, event, button),
        );
        button.addEventListener("dragstart", (event) => event.preventDefault());

        const order = document.createElement("span");
        order.className = "diabetic-history-match__image-order";
        order.textContent = String(getImageNumber(assignedImageId));

        const image = document.createElement("img");
        image.className = "diabetic-history-match__image";
        image.src = assignedItem.imageSrc;
        image.alt = assignedItem.label;
        image.loading = "lazy";
        image.draggable = false;

        button.appendChild(order);
        button.appendChild(image);
        slot.appendChild(button);
      } else {
        const placeholder = document.createElement("span");
        placeholder.className = "diabetic-history-match__slot-placeholder";
        placeholder.textContent = "Drop";
        slot.appendChild(placeholder);
      }

      const card = document.createElement("div");
      card.className = "diabetic-history-match__card";

      const meta = document.createElement("div");
      meta.className = "diabetic-history-match__card-meta";

      const number = document.createElement("span");
      number.className = "diabetic-history-match__card-label";
      number.textContent = `History ${index + 1}`;
      meta.appendChild(number);

      const list = document.createElement("ul");
      list.className = "diabetic-history-match__history-list";
      item.historyLines.forEach((line) => {
        const bullet = document.createElement("li");
        bullet.textContent = line;
        list.appendChild(bullet);
      });

      card.appendChild(meta);
      card.appendChild(list);
      row.appendChild(slot);
      row.appendChild(card);
      promptList.appendChild(row);
    });
  };

  const render = () => {
    renderProgress();
    renderImageBank();
    renderPromptList();
    updateLessonProgress();
    submitButton.textContent =
      state.currentRoundIndex === state.rounds.length - 1
        ? "Submit answer"
        : "Next case";
  };

  const appendSummary = (target, correct, total) => {
    target.textContent = "";
    target.appendChild(document.createTextNode("You got "));
    const correctValue = document.createElement("b");
    correctValue.textContent = String(correct);
    target.appendChild(correctValue);
    target.appendChild(document.createTextNode(" out of "));
    const totalValue = document.createElement("b");
    totalValue.textContent = String(total);
    target.appendChild(totalValue);
    target.appendChild(document.createTextNode(" correct."));
  };

  const renderResults = () => {
    let correct = 0;
    const total = HISTORY_IMAGE_MATCH_CASES.length;

    resultsList.innerHTML = "";

    state.rounds.forEach((round, roundIndex) => {
      const section = document.createElement("section");
      section.className = "diabetic-history-match__results-section";

      const sectionTitle = document.createElement("h4");
      sectionTitle.className = "diabetic-history-match__results-section-title";
      sectionTitle.textContent = `Set ${roundIndex + 1}`;
      section.appendChild(sectionTitle);

      round.promptOrder.forEach((promptId) => {
        const item = HISTORY_IMAGE_MATCH_LOOKUP.get(promptId);
        if (!item) return;

        const assignedImageId = round.assignments.get(promptId) || null;
        const isCorrect = assignedImageId === promptId;
        if (isCorrect) correct += 1;

        const row = document.createElement("div");
        row.className = "diabetic-history-match__result-row";

        const thumb = document.createElement("img");
        thumb.className = "diabetic-history-match__result-thumb";
        thumb.src = item.imageSrc;
        thumb.alt = item.label;
        thumb.loading = "lazy";

        const body = document.createElement("div");
        body.className = "diabetic-history-match__result-body";

        const head = document.createElement("div");
        head.className = "diabetic-history-match__result-head";

        const title = document.createElement("p");
        title.className = "diabetic-history-match__result-title";
        title.textContent = item.label;

        const status = document.createElement("span");
        status.className = "diabetic-history-match__result-status";
        if (isCorrect) {
          status.classList.add("is-correct");
          status.textContent = "Correct";
        } else {
          status.classList.add("is-wrong");
          status.textContent = "Wrong";
        }

        const list = document.createElement("ul");
        list.className = "diabetic-history-match__result-list";
        item.answerLines.forEach((line) => {
          const bullet = document.createElement("li");
          bullet.textContent = line;
          list.appendChild(bullet);
        });

        head.appendChild(title);
        head.appendChild(status);
        body.appendChild(head);
        body.appendChild(list);
        row.appendChild(thumb);
        row.appendChild(body);
        section.appendChild(row);
      });

      resultsList.appendChild(section);
    });

    appendSummary(resultsSummary, correct, total);
    return correct;
  };

  const resetQuiz = () => {
    finishDrag({ applyDrop: false });
    state.rounds = buildRounds();
    state.currentRoundIndex = 0;
    state.hasCompletedQuiz = false;
    closeResultsModal();
    setFeedback("");
    setHint("Drag an image onto the matching history card.");
    render();
  };

  submitButton.addEventListener("click", () => {
    const round = getCurrentRound();
    if (!round) return;

    if (round.assignments.size !== round.items.length) {
      setFeedback(
        `Match all ${round.items.length} histories before continuing.`,
        "is-reviewed",
      );
      setHint("Complete all matches to continue.", true);
      return;
    }

    setFeedback("");

    if (state.currentRoundIndex < state.rounds.length - 1) {
      state.currentRoundIndex += 1;
      setHint("Drag an image onto the matching history card.");
      render();
      try {
        window.scrollTo(0, 0);
      } catch {}
      return;
    }

    state.hasCompletedQuiz = true;
    render();
    renderResults();
    openResultsModal();
  });

  introCloseButtons.forEach((button) => {
    if (button.dataset.wired === "1") return;
    button.dataset.wired = "1";
    button.addEventListener("click", closeIntroModal);
  });

  introModal.addEventListener("click", (event) => {
    if (event.target === introModal) closeIntroModal();
  });

  resultsCloseButtons.forEach((button) => {
    if (button.dataset.wired === "1") return;
    button.dataset.wired = "1";
    button.addEventListener("click", closeResultsModal);
  });

  resultsModal.addEventListener("click", (event) => {
    if (event.target === resultsModal) closeResultsModal();
  });

  if (page.dataset.shownWired !== "1") {
    page.dataset.shownWired = "1";
    document.addEventListener("page:shown", (event) => {
      if (event.detail?.id !== "diabeticHistoryImageMatchPage") return;
      resetQuiz();
      openIntroModal();
    });
  }

  resetQuiz();
}

function initializeRetinalStructureTapPage() {
  const page = document.getElementById("diabeticRetinalStructureTapPage");
  if (!page || page.dataset.inited === "1") return;

  const progress = page.querySelector("#retinalStructureTapProgress");
  const progressLabel = page.querySelector("#retinalStructureTapProgressLabel");
  const prompt = page.querySelector("#retinalStructureTapPrompt");
  const promptCard = page.querySelector("#retinalStructureTapPromptCard");
  const stage = page.querySelector("#retinalStructureTapStage");
  const overlay = page.querySelector("#retinalStructureTapOverlay");
  const idle = page.querySelector("#retinalStructureTapIdle");
  const tip = page.querySelector("#retinalStructureTapTip");
  const result = page.querySelector("#retinalStructureTapResult");
  const banner = page.querySelector("#retinalStructureTapBanner");
  const bannerBadge = page.querySelector("#retinalStructureTapBannerBadge");
  const bannerTitle = page.querySelector("#retinalStructureTapBannerTitle");
  const bannerCopy = page.querySelector("#retinalStructureTapBannerCopy");
  const explanation = page.querySelector("#retinalStructureTapExplanation");
  const nextButton = page.querySelector("#retinalStructureTapNext");
  const introModal = page.querySelector("#retinalStructureTapIntroModal");
  const resultsModal = page.querySelector("#retinalStructureTapResultsModal");
  const resultsSummary = page.querySelector(
    "#retinalStructureTapResultsSummary",
  );
  const resultsList = page.querySelector("#retinalStructureTapResultsList");
  const introCloseButtons = page.querySelectorAll(
    "[data-retinal-structure-modal-close]",
  );
  const resultsCloseButtons = page.querySelectorAll(
    "[data-retinal-structure-results-close]",
  );

  if (
    !progress ||
    !progressLabel ||
    !prompt ||
    !promptCard ||
    !stage ||
    !overlay ||
    !idle ||
    !tip ||
    !result ||
    !banner ||
    !bannerBadge ||
    !bannerTitle ||
    !bannerCopy ||
    !explanation ||
    !nextButton ||
    !introModal ||
    !resultsModal ||
    !resultsSummary ||
    !resultsList
  ) {
    return;
  }

  page.dataset.inited = "1";
  page
    .querySelectorAll(".retinal-structure-tap__modal-close")
    .forEach((button) => {
      button.innerHTML = "&times;";
    });

  const state = {
    currentIndex: 0,
    answers: [],
    hasAnsweredCurrent: false,
    isComplete: false,
  };

  const getCurrentStep = () => RETINAL_STRUCTURE_TAP_STEPS[state.currentIndex];

  const getCurrentAnswer = () => state.answers[state.currentIndex] || null;

  const setModalState = (modal, isOpen) => {
    modal.classList.toggle("is-open", isOpen);
    modal.setAttribute("aria-hidden", isOpen ? "false" : "true");
  };

  const openIntroModal = () => setModalState(introModal, true);
  const closeIntroModal = () => setModalState(introModal, false);
  const openResultsModal = () => setModalState(resultsModal, true);
  const closeResultsModal = () => setModalState(resultsModal, false);

  const renderProgress = () => {
    progress.innerHTML = "";

    RETINAL_STRUCTURE_TAP_STEPS.forEach((_, index) => {
      const stepEl = document.createElement("span");
      stepEl.className = "retinal-structure-tap__progress-step";

      if (state.isComplete || index < state.currentIndex) {
        stepEl.classList.add("is-complete");
      } else if (index === state.currentIndex) {
        stepEl.classList.add("is-active");
      }

      progress.appendChild(stepEl);
    });

    const current = Math.min(
      state.currentIndex + 1,
      RETINAL_STRUCTURE_TAP_STEPS.length,
    );
    progressLabel.textContent = `Structure ${current} of ${RETINAL_STRUCTURE_TAP_STEPS.length}`;
  };

  const updateLessonProgress = () => {
    const answeredCount = state.answers.filter(Boolean).length;
    const percent = state.isComplete
      ? 100
      : (answeredCount / RETINAL_STRUCTURE_TAP_STEPS.length) * 90;

    setDiabeticLessonProgress("diabeticRetinalStructureTapPage", percent);
  };

  const appendTargetArea = (target, className) => {
    const area = document.createElement("span");
    area.className = `retinal-structure-tap__target ${className}`.trim();
    area.style.left = `${(target.cx - target.rx) * 100}%`;
    area.style.top = `${(target.cy - target.ry) * 100}%`;
    area.style.width = `${target.rx * 200}%`;
    area.style.height = `${target.ry * 200}%`;
    overlay.appendChild(area);
  };

  const appendTapMarker = (tapX, tapY) => {
    const marker = document.createElement("span");
    marker.className = "retinal-structure-tap__tap-marker";
    marker.style.left = `${tapX * 100}%`;
    marker.style.top = `${tapY * 100}%`;
    overlay.appendChild(marker);
  };

  const renderOverlay = () => {
    overlay.innerHTML = "";

    if (!state.hasAnsweredCurrent) return;

    const step = getCurrentStep();
    const answer = getCurrentAnswer();
    if (!step || !answer) return;

    appendTargetArea(
      step.target,
      answer.correct
        ? "retinal-structure-tap__target--correct"
        : "retinal-structure-tap__target--answer",
    );
    appendTapMarker(answer.tapX, answer.tapY);
  };

  const renderResult = () => {
    const step = getCurrentStep();
    const answer = getCurrentAnswer();
    if (!step || !answer) return;

    banner.classList.remove("is-correct", "is-wrong");
    bannerBadge.classList.remove("is-correct", "is-wrong");

    if (answer.correct) {
      banner.classList.add("is-correct");
      bannerBadge.classList.add("is-correct");
      bannerBadge.textContent = "✓";
      bannerTitle.textContent = "Correct!";
      bannerCopy.textContent = "You tapped the correct structure.";
    } else {
      banner.classList.add("is-wrong");
      bannerBadge.classList.add("is-wrong");
      bannerBadge.textContent = "!";
      bannerTitle.textContent = "Not quite";
      bannerCopy.textContent = "Your tap was outside the correct area.";
    }

    explanation.textContent = step.explanation;
    nextButton.textContent =
      state.currentIndex === RETINAL_STRUCTURE_TAP_STEPS.length - 1
        ? "See results"
        : "Next >";
  };

  const renderPrompt = () => {
    const step = getCurrentStep();
    if (!step) return;

    prompt.textContent = step.label;
    tip.textContent = step.tip;
    promptCard.classList.toggle("is-answered", state.hasAnsweredCurrent);
  };

  const renderResultsList = () => {
    let correctCount = 0;
    resultsList.innerHTML = "";

    RETINAL_STRUCTURE_TAP_STEPS.forEach((step, index) => {
      const answer = state.answers[index];
      if (answer?.correct) correctCount += 1;

      const row = document.createElement("div");
      row.className = "retinal-structure-tap__results-row";

      const number = document.createElement("span");
      number.className = "retinal-structure-tap__results-number";
      number.textContent = String(index + 1);

      const body = document.createElement("div");
      body.className = "retinal-structure-tap__results-body";

      const title = document.createElement("p");
      title.className = "retinal-structure-tap__results-title";
      title.textContent = step.label;

      const copy = document.createElement("p");
      copy.className = "retinal-structure-tap__results-copy";
      copy.textContent = step.explanation;

      const status = document.createElement("span");
      status.className = "retinal-structure-tap__results-status";
      if (answer?.correct) {
        status.classList.add("is-correct");
        status.textContent = "Correct";
      } else {
        status.classList.add("is-wrong");
        status.textContent = "Wrong";
      }

      body.appendChild(title);
      body.appendChild(copy);
      row.appendChild(number);
      row.appendChild(body);
      row.appendChild(status);
      resultsList.appendChild(row);
    });

    resultsSummary.textContent = `You got ${correctCount} out of ${RETINAL_STRUCTURE_TAP_STEPS.length} correct.`;
  };

  const render = () => {
    renderProgress();
    renderPrompt();
    renderOverlay();
    updateLessonProgress();

    idle.style.display = state.hasAnsweredCurrent ? "none" : "";
    result.style.display = state.hasAnsweredCurrent ? "" : "none";
    nextButton.style.display = state.hasAnsweredCurrent ? "" : "none";
    stage.disabled = state.hasAnsweredCurrent;

    if (state.hasAnsweredCurrent) {
      renderResult();
    }
  };

  const isInsideTarget = (tapX, tapY, target) => {
    const dx = (tapX - target.cx) / target.rx;
    const dy = (tapY - target.cy) / target.ry;
    return dx * dx + dy * dy <= 1;
  };

  const resetQuiz = () => {
    state.currentIndex = 0;
    state.answers = [];
    state.hasAnsweredCurrent = false;
    state.isComplete = false;
    closeResultsModal();
    render();
  };

  stage.addEventListener("pointerup", (event) => {
    if (state.hasAnsweredCurrent) return;

    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const tapX = (event.clientX - rect.left) / rect.width;
    const tapY = (event.clientY - rect.top) / rect.height;
    const step = getCurrentStep();
    if (!step) return;

    state.answers[state.currentIndex] = {
      tapX,
      tapY,
      correct: isInsideTarget(tapX, tapY, step.target),
    };
    state.hasAnsweredCurrent = true;
    render();
  });

  nextButton.addEventListener("click", () => {
    if (!state.hasAnsweredCurrent) return;

    if (state.currentIndex < RETINAL_STRUCTURE_TAP_STEPS.length - 1) {
      state.currentIndex += 1;
      state.hasAnsweredCurrent = false;
      render();
      try {
        window.scrollTo(0, 0);
      } catch {}
      return;
    }

    state.isComplete = true;
    render();
    renderResultsList();
    openResultsModal();
  });

  introCloseButtons.forEach((button) => {
    if (button.dataset.wired === "1") return;
    button.dataset.wired = "1";
    button.addEventListener("click", closeIntroModal);
  });

  resultsCloseButtons.forEach((button) => {
    if (button.dataset.wired === "1") return;
    button.dataset.wired = "1";
    button.addEventListener("click", closeResultsModal);
  });

  introModal.addEventListener("click", (event) => {
    if (event.target === introModal) closeIntroModal();
  });

  resultsModal.addEventListener("click", (event) => {
    if (event.target === resultsModal) closeResultsModal();
  });

  if (page.dataset.shownWired !== "1") {
    page.dataset.shownWired = "1";
    document.addEventListener("page:shown", (event) => {
      if (event.detail?.id !== "diabeticRetinalStructureTapPage") return;
      resetQuiz();
      openIntroModal();
    });
  }

  resetQuiz();
}

function initializeReviewVideoQuizPage() {
  const page = document.getElementById("diabeticReviewVideoQuizPage");
  if (!page || page.dataset.inited === "1") return;

  const video = page.querySelector("#reviewVideoQuizPlayer");
  const progress = page.querySelector("#reviewVideoQuizProgress");
  const progressLabel = page.querySelector("#reviewVideoQuizProgressLabel");
  const status = page.querySelector("#reviewVideoQuizStatus");
  const waitingCard = page.querySelector("#reviewVideoQuizWaiting");
  const waitingLabel = page.querySelector("#reviewVideoQuizWaitingLabel");
  const waitingTitle = page.querySelector("#reviewVideoQuizWaitingTitle");
  const waitingCopy = page.querySelector("#reviewVideoQuizWaitingCopy");
  const questionCard = page.querySelector("#reviewVideoQuizQuestionCard");
  const questionLabel = page.querySelector("#reviewVideoQuizQuestionLabel");
  const question = page.querySelector("#reviewVideoQuizQuestion");
  const options = page.querySelector("#reviewVideoQuizOptions");
  const feedback = page.querySelector("#reviewVideoQuizFeedback");
  const feedbackTitle = page.querySelector("#reviewVideoQuizFeedbackTitle");
  const feedbackCopy = page.querySelector("#reviewVideoQuizFeedbackCopy");
  const actionButton = page.querySelector("#reviewVideoQuizAction");
  const completeCard = page.querySelector("#reviewVideoQuizComplete");
  const summary = page.querySelector("#reviewVideoQuizSummary");
  const replayButton = page.querySelector("#reviewVideoQuizReplay");

  if (
    !video ||
    !progress ||
    !progressLabel ||
    !status ||
    !waitingCard ||
    !waitingLabel ||
    !waitingTitle ||
    !waitingCopy ||
    !questionCard ||
    !questionLabel ||
    !question ||
    !options ||
    !feedback ||
    !feedbackTitle ||
    !feedbackCopy ||
    !actionButton ||
    !completeCard ||
    !summary ||
    !replayButton
  ) {
    return;
  }

  page.dataset.inited = "1";

  const state = {
    nextIndex: 0,
    activeIndex: null,
    selectedIndex: null,
    answers: [],
    hasCheckedCurrent: false,
    isComplete: false,
  };

  const getStep = (index) => REVIEW_VIDEO_QUIZ_STEPS[index] || null;

  const setStatus = (text, variant = "") => {
    status.textContent = text;
    status.className = "review-video-quiz__status";
    if (variant) status.classList.add(variant);
  };

  const getCorrectCount = () =>
    state.answers.filter((answer) => answer?.correct).length;

  const renderProgress = () => {
    progress.innerHTML = "";

    REVIEW_VIDEO_QUIZ_STEPS.forEach((_, index) => {
      const stepEl = document.createElement("span");
      stepEl.className = "review-video-quiz__progress-step";

      if (state.answers[index]) {
        stepEl.classList.add("is-complete");
      } else if (state.activeIndex === index || state.nextIndex === index) {
        stepEl.classList.add("is-active");
      }

      progress.appendChild(stepEl);
    });

    if (state.isComplete) {
      progressLabel.textContent = "Review complete";
      return;
    }

    const displayIndex =
      state.activeIndex ??
      Math.min(state.nextIndex, REVIEW_VIDEO_QUIZ_STEPS.length - 1);
    progressLabel.textContent = `Question ${displayIndex + 1} of ${REVIEW_VIDEO_QUIZ_STEPS.length}`;
  };

  const updateLessonProgress = () => {
    const answeredCount = state.answers.filter(Boolean).length;
    const percent = state.isComplete
      ? 100
      : (answeredCount / REVIEW_VIDEO_QUIZ_STEPS.length) * 90;

    setDiabeticLessonProgress("diabeticReviewVideoQuizPage", percent);
  };

  const renderWaitingCard = () => {
    if (state.nextIndex === 0 && video.currentTime < 0.25) {
      waitingLabel.textContent = "Video prompt";
      waitingTitle.textContent = "Start the video";
      waitingCopy.textContent =
        "Press play to begin. The video will pause automatically for each review question.";
      return;
    }

    waitingLabel.textContent = "Keep watching";
    waitingTitle.textContent = "Continue to the next pause";
    waitingCopy.textContent =
      "The video will stop again when the next question is ready.";
  };

  const renderQuestionOptions = (step) => {
    options.innerHTML = "";

    step.options.forEach((optionText, index) => {
      const optionId = `reviewVideoQuizOption-${step.id}-${index}`;

      const label = document.createElement("label");
      label.className = "review-video-quiz__option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "reviewVideoQuizAnswer";
      input.id = optionId;
      input.value = String(index);
      input.checked = state.selectedIndex === index;
      input.disabled = state.hasCheckedCurrent;
      input.addEventListener("change", () => {
        if (state.hasCheckedCurrent) return;
        state.selectedIndex = index;
        actionButton.disabled = false;
      });

      const text = document.createElement("span");
      text.className = "review-video-quiz__option-text";
      text.textContent = optionText;

      if (state.hasCheckedCurrent && index === step.correctIndex) {
        label.classList.add("is-correct");
      } else if (
        state.hasCheckedCurrent &&
        state.selectedIndex === index &&
        index !== step.correctIndex
      ) {
        label.classList.add("is-wrong");
      }

      label.appendChild(input);
      label.appendChild(text);
      options.appendChild(label);
    });
  };

  const renderQuestionCard = () => {
    const step = getStep(state.activeIndex);
    if (!step) return;

    questionLabel.textContent = `Question ${state.activeIndex + 1}`;
    question.textContent = step.question;
    renderQuestionOptions(step);

    feedback.hidden = !state.hasCheckedCurrent;
    feedback.className = "review-video-quiz__feedback";

    if (state.hasCheckedCurrent) {
      const answer = state.answers[state.activeIndex];
      if (answer?.correct) {
        feedback.classList.add("is-correct");
        feedbackTitle.textContent = "Correct";
        feedbackCopy.textContent = step.explanation;
      } else {
        feedback.classList.add("is-wrong");
        feedbackTitle.textContent = `Correct answer: ${step.options[step.correctIndex]}`;
        feedbackCopy.textContent = step.explanation;
      }
    }

    actionButton.disabled =
      !state.hasCheckedCurrent && state.selectedIndex == null;
    actionButton.textContent = state.hasCheckedCurrent
      ? state.activeIndex === REVIEW_VIDEO_QUIZ_STEPS.length - 1
        ? "See results"
        : "Next >"
      : "Check answer";
  };

  const renderCompleteCard = () => {
    summary.textContent = `You answered ${getCorrectCount()} out of ${REVIEW_VIDEO_QUIZ_STEPS.length} correctly.`;
  };

  const render = () => {
    renderProgress();
    updateLessonProgress();

    waitingCard.hidden = state.activeIndex !== null || state.isComplete;
    questionCard.hidden = state.activeIndex === null;
    completeCard.hidden = !state.isComplete;

    if (!state.isComplete && state.activeIndex === null) {
      renderWaitingCard();
    }

    if (state.activeIndex !== null) {
      renderQuestionCard();
      setStatus("Video paused for a question.", "is-alert");
      return;
    }

    if (state.isComplete) {
      renderCompleteCard();
      setStatus(
        "Review complete. Replay the clip if you want to go through it again.",
        "is-complete",
      );
      return;
    }

    setStatus(
      state.nextIndex === 0 && video.currentTime < 0.25
        ? "Press play. The video will pause when a question appears."
        : "Continue the video to reach the next question.",
    );
  };

  const maybePauseForQuestion = () => {
    if (state.isComplete || state.activeIndex !== null) return;

    const step = getStep(state.nextIndex);
    if (!step || video.currentTime + 0.05 < step.pauseAt) return;

    video.pause();
    state.activeIndex = state.nextIndex;
    state.selectedIndex = null;
    state.hasCheckedCurrent = false;
    render();
  };

  const resetQuiz = () => {
    state.nextIndex = 0;
    state.activeIndex = null;
    state.selectedIndex = null;
    state.answers = [];
    state.hasCheckedCurrent = false;
    state.isComplete = false;

    try {
      video.pause();
    } catch {}

    try {
      video.currentTime = 0;
    } catch {}

    render();
  };

  actionButton.addEventListener("click", () => {
    const step = getStep(state.activeIndex);
    if (!step) return;

    if (!state.hasCheckedCurrent) {
      if (state.selectedIndex == null) return;

      state.answers[state.activeIndex] = {
        selectedIndex: state.selectedIndex,
        correct: state.selectedIndex === step.correctIndex,
      };
      state.hasCheckedCurrent = true;
      render();
      return;
    }

    if (state.activeIndex < REVIEW_VIDEO_QUIZ_STEPS.length - 1) {
      state.nextIndex = state.activeIndex + 1;
      state.activeIndex = null;
      state.selectedIndex = null;
      state.hasCheckedCurrent = false;
      render();

      try {
        window.scrollTo(0, 0);
      } catch {}

      const playPromise = video.play();
      playPromise?.catch?.(() => {});
      return;
    }

    state.nextIndex = REVIEW_VIDEO_QUIZ_STEPS.length;
    state.activeIndex = null;
    state.selectedIndex = null;
    state.hasCheckedCurrent = false;
    state.isComplete = true;

    try {
      video.pause();
    } catch {}

    render();
  });

  replayButton.addEventListener("click", () => {
    resetQuiz();
  });

  video.addEventListener("timeupdate", maybePauseForQuestion);
  video.addEventListener("seeked", maybePauseForQuestion);
  video.addEventListener("play", () => {
    if (state.activeIndex === null) return;

    const pauseNow = () => {
      try {
        video.pause();
      } catch {}
    };

    if (typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(pauseNow);
    } else {
      window.setTimeout(pauseNow, 0);
    }
  });

  if (page.dataset.shownWired !== "1") {
    page.dataset.shownWired = "1";
    document.addEventListener("page:shown", (event) => {
      if (event.detail?.id !== "diabeticReviewVideoQuizPage") return;
      resetQuiz();
    });
  }

  resetQuiz();
}

function initializeFindingsGroupTwoPage() {
  const page = document.getElementById("diabeticFindingsGroupTwoPage");
  if (!page || page.dataset.inited === "1") return;

  const bank = page.querySelector("#findingsGroupQuizBank");
  const submitButton = page.querySelector("#findingsGroupQuizSubmit");
  const feedback = page.querySelector("#findingsGroupQuizFeedback");
  const zoneBodies = Array.from(
    page.querySelectorAll(".findings-group-quiz__zone-body"),
  );

  if (!bank || !submitButton || !feedback || zoneBodies.length !== 2) {
    return;
  }

  page.dataset.inited = "1";

  const state = new Map();
  const dragState = {
    chip: null,
    pointerId: null,
    startX: 0,
    startY: 0,
    hoverZone: null,
    cleanup: null,
  };

  const setFeedback = (text = "", variant = "") => {
    feedback.textContent = text;
    feedback.className = "findings-group-quiz__feedback";
    if (variant) feedback.classList.add(variant);
  };

  const updateLessonProgress = () => {
    const placedCount = FINDINGS_GROUP_TWO_ITEMS.filter(
      (item) => state.get(item.id) && state.get(item.id) !== "bank",
    ).length;
    const percent = submitButton.disabled
      ? 100
      : (placedCount / FINDINGS_GROUP_TWO_ITEMS.length) * 90;

    setDiabeticLessonProgress("diabeticFindingsGroupTwoPage", percent);
  };

  const updateZoneState = () => {
    zoneBodies.forEach((body) => {
      const hasChip = !!body.querySelector(".findings-group-quiz__chip");
      body.classList.toggle("is-filled", hasChip);
    });
    updateLessonProgress();
  };

  const clearZoneHighlights = () => {
    page
      .querySelectorAll(".findings-group-quiz__zone")
      .forEach((zone) => zone.classList.remove("is-over"));
    dragState.hoverZone = null;
  };

  const getZoneAtPoint = (clientX, clientY) => {
    const zone = Array.from(
      page.querySelectorAll(".findings-group-quiz__zone"),
    ).find((zoneEl) => {
      const body = zoneEl.querySelector(".findings-group-quiz__zone-body");
      if (!body) return false;
      const rect = body.getBoundingClientRect();
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    });

    return zone || null;
  };

  const updateHoveredZone = (clientX, clientY) => {
    const zone = getZoneAtPoint(clientX, clientY);
    if (dragState.hoverZone === zone) return zone;

    clearZoneHighlights();
    if (zone) {
      zone.classList.add("is-over");
      dragState.hoverZone = zone;
    }

    return zone;
  };

  const moveChipTo = (chip, destination) => {
    const itemId = chip.getAttribute("data-item-id");
    if (!itemId) return;

    if (destination === "bank") {
      bank.appendChild(chip);
      state.set(itemId, "bank");
      updateZoneState();
      return;
    }

    const zoneBody = page.querySelector(
      `.findings-group-quiz__zone[data-zone="${destination}"] .findings-group-quiz__zone-body`,
    );
    if (!zoneBody) return;

    zoneBody.appendChild(chip);
    state.set(itemId, destination);
    updateZoneState();
  };

  const makeChip = (item) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "findings-group-quiz__chip";
    chip.textContent = item.label;
    chip.setAttribute("data-item-id", item.id);
    chip.setAttribute("data-correct-zone", item.zone);

    chip.addEventListener("pointerdown", (event) => {
      if (submitButton.disabled) return;
      event.preventDefault();

      dragState.chip = chip;
      dragState.pointerId = event.pointerId;
      dragState.startX = event.clientX;
      dragState.startY = event.clientY;
      chip.style.zIndex = "5";
      chip.style.position = "relative";
      chip.style.transform = "translate(0, 0)";
      chip.classList.add("is-dragging");

      try {
        chip.setPointerCapture(event.pointerId);
      } catch {}

      const handlePointerMove = (moveEvent) => {
        if (
          dragState.pointerId !== moveEvent.pointerId ||
          dragState.chip !== chip ||
          submitButton.disabled
        ) {
          return;
        }

        const dx = moveEvent.clientX - dragState.startX;
        const dy = moveEvent.clientY - dragState.startY;
        chip.style.transform = `translate(${dx}px, ${dy}px)`;
        updateHoveredZone(moveEvent.clientX, moveEvent.clientY);
      };

      const finishPointerDrag = (endEvent) => {
        if (
          dragState.pointerId !== endEvent.pointerId ||
          dragState.chip !== chip
        ) {
          return;
        }

        chip.style.transform = "";
        chip.style.zIndex = "";
        chip.style.position = "";
        chip.classList.remove("is-dragging");

        const hitZone = updateHoveredZone(endEvent.clientX, endEvent.clientY);
        if (hitZone) {
          moveChipTo(chip, hitZone.getAttribute("data-zone"));
        } else {
          const bankRect = bank.getBoundingClientRect();
          const overBank =
            endEvent.clientX >= bankRect.left &&
            endEvent.clientX <= bankRect.right &&
            endEvent.clientY >= bankRect.top &&
            endEvent.clientY <= bankRect.bottom;

          if (overBank) moveChipTo(chip, "bank");
        }

        clearZoneHighlights();

        try {
          chip.releasePointerCapture(endEvent.pointerId);
        } catch {}

        dragState.cleanup?.();
        dragState.cleanup = null;
        dragState.chip = null;
        dragState.pointerId = null;
      };

      const handlePointerCancel = (cancelEvent) => {
        if (
          dragState.pointerId !== cancelEvent.pointerId ||
          dragState.chip !== chip
        ) {
          return;
        }

        chip.style.transform = "";
        chip.style.zIndex = "";
        chip.style.position = "";
        chip.classList.remove("is-dragging");
        clearZoneHighlights();

        try {
          chip.releasePointerCapture(cancelEvent.pointerId);
        } catch {}

        dragState.cleanup?.();
        dragState.cleanup = null;
        dragState.chip = null;
        dragState.pointerId = null;
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", finishPointerDrag);
      window.addEventListener("pointercancel", handlePointerCancel);

      dragState.cleanup = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", finishPointerDrag);
        window.removeEventListener("pointercancel", handlePointerCancel);
      };
    });

    return chip;
  };

  const wireDropTarget = (element, destination) => {
    element.addEventListener("dragover", (event) => {
      if (submitButton.disabled) return;
      event.preventDefault();
    });

    element.addEventListener("drop", (event) => {
      if (submitButton.disabled) return;
      event.preventDefault();
      const itemId = event.dataTransfer?.getData("text/plain");
      if (!itemId) return;
      const chip = page.querySelector(
        `.findings-group-quiz__chip[data-item-id="${itemId}"]`,
      );
      if (!chip) return;
      moveChipTo(chip, destination);
      page
        .querySelectorAll(".findings-group-quiz__zone")
        .forEach((zone) => zone.classList.remove("is-over"));
    });
  };

  zoneBodies.forEach((body) => {
    const zone = body.closest(".findings-group-quiz__zone");
    const destination = zone?.getAttribute("data-zone");
    if (!zone || !destination) return;

    wireDropTarget(body, destination);

    body.addEventListener("dragenter", () => zone.classList.add("is-over"));
    body.addEventListener("dragleave", () => zone.classList.remove("is-over"));
    body.addEventListener("drop", () => zone.classList.remove("is-over"));
  });

  wireDropTarget(bank, "bank");

  const resetQuiz = () => {
    dragState.cleanup?.();
    dragState.cleanup = null;
    dragState.chip = null;
    dragState.pointerId = null;
    clearZoneHighlights();

    state.clear();
    bank.innerHTML = "";
    zoneBodies.forEach((body) => {
      body.innerHTML =
        '<span class="findings-group-quiz__zone-placeholder">Drag findings here</span>';
    });

    shuffleItems(FINDINGS_GROUP_TWO_ITEMS).forEach((item) => {
      state.set(item.id, "bank");
      bank.appendChild(makeChip(item));
    });

    submitButton.disabled = false;
    setFeedback("");
    updateZoneState();
  };

  submitButton.addEventListener("click", () => {
    const unplaced = FINDINGS_GROUP_TWO_ITEMS.filter(
      (item) => state.get(item.id) === "bank",
    );

    if (unplaced.length > 0) {
      setFeedback("Place all findings before submitting.", "is-warning");
      return;
    }

    let correct = 0;
    FINDINGS_GROUP_TWO_ITEMS.forEach((item) => {
      const chip = page.querySelector(
        `.findings-group-quiz__chip[data-item-id="${item.id}"]`,
      );
      if (!chip) return;

      chip.classList.remove("is-correct", "is-wrong");
      const placedZone = state.get(item.id);
      const isCorrect = placedZone === item.zone;

      if (isCorrect) {
        correct += 1;
        chip.classList.add("is-correct");
      } else {
        chip.classList.add("is-wrong");
      }
    });

    submitButton.disabled = true;

    if (correct === FINDINGS_GROUP_TWO_ITEMS.length) {
      setFeedback("Correct!", "is-success");
    } else {
      setFeedback(
        `You got ${correct} out of ${FINDINGS_GROUP_TWO_ITEMS.length} correct.`,
        "is-warning",
      );
    }
  });

  if (page.dataset.shownWired !== "1") {
    page.dataset.shownWired = "1";
    document.addEventListener("page:shown", (event) => {
      if (event.detail?.id !== "diabeticFindingsGroupTwoPage") return;
      resetQuiz();
    });
  }

  resetQuiz();
}

function initializeConnectQuizPage() {
  const page = document.getElementById("diabeticConnectQuizPage");
  if (!page || page.dataset.inited === "1") return;

  const hint = page.querySelector("#connectQuizHint");
  const board = page.querySelector("#connectQuizBoard");
  const diagnoses = page.querySelector("#connectQuizDiagnoses");
  const answers = page.querySelector("#connectQuizAnswers");
  const summary = page.querySelector("#connectQuizSummary");
  const answerList = page.querySelector("#connectQuizAnswerList");
  const submitButton = page.querySelector("#connectQuizSubmit");
  const feedback = page.querySelector("#connectQuizFeedback");

  if (
    !hint ||
    !board ||
    !diagnoses ||
    !answers ||
    !summary ||
    !answerList ||
    !submitButton ||
    !feedback
  ) {
    return;
  }

  page.dataset.inited = "1";

  const state = {
    findingOrder: [],
    activeDiagnosisId: null,
    assignments: new Map(),
    findingOwners: new Map(),
    submitted: false,
  };

  const setFeedback = (text = "", variant = "") => {
    feedback.textContent = text;
    feedback.className = "connect-quiz__feedback";
    if (variant) feedback.classList.add(variant);
  };

  const getGroup = (diagnosisId) =>
    CONNECT_QUIZ_GROUPS.find((group) => group.diagnosisId === diagnosisId) ||
    null;

  const getAssignedFindingIds = (diagnosisId) =>
    state.assignments.get(diagnosisId) || [];

  const removeFindingFromOwner = (findingId) => {
    const ownerDiagnosisId = state.findingOwners.get(findingId);
    if (!ownerDiagnosisId) return;

    const updated = getAssignedFindingIds(ownerDiagnosisId).filter(
      (id) => id !== findingId,
    );
    state.assignments.set(ownerDiagnosisId, updated);
    state.findingOwners.delete(findingId);
  };

  const assignFindingToDiagnosis = (findingId, diagnosisId) => {
    removeFindingFromOwner(findingId);
    const updated = [...getAssignedFindingIds(diagnosisId), findingId];
    state.assignments.set(diagnosisId, updated);
    state.findingOwners.set(findingId, diagnosisId);
  };

  const getCorrectCount = () => {
    return CONNECT_QUIZ_GROUPS.filter((group) => {
      const assigned = getAssignedFindingIds(group.diagnosisId);
      const correctSet = new Set(group.findings.map((finding) => finding.id));
      return (
        assigned.length === group.findings.length &&
        assigned.every((findingId) => correctSet.has(findingId))
      );
    }).length;
  };

  const updateLessonProgress = () => {
    const assignedCount = state.findingOwners.size;
    const percent = state.submitted
      ? 100
      : (assignedCount / CONNECT_QUIZ_FINDINGS.length) * 90;

    setDiabeticLessonProgress("diabeticConnectQuizPage", percent);
  };

  const renderAnswers = () => {
    answerList.innerHTML = "";

    CONNECT_QUIZ_GROUPS.forEach((group) => {
      const card = document.createElement("article");
      card.className = `connect-quiz__answer-card connect-quiz__answer-card--${group.tone}`;

      const title = document.createElement("p");
      title.className = "connect-quiz__answer-title";
      title.textContent = group.diagnosis;

      const selectedBlock = document.createElement("div");
      selectedBlock.className = "connect-quiz__answer-findings";

      const selectedLabel = document.createElement("p");
      selectedLabel.className = "connect-quiz__answer-kicker";
      selectedLabel.textContent = "Your findings";
      selectedBlock.appendChild(selectedLabel);

      const assignedIds = getAssignedFindingIds(group.diagnosisId);
      const correctSet = new Set(group.findings.map((finding) => finding.id));
      const isCorrect =
        assignedIds.length === group.findings.length &&
        assignedIds.every((findingId) => correctSet.has(findingId));

      assignedIds.forEach((findingId) => {
        const finding = CONNECT_QUIZ_FINDING_LOOKUP.get(findingId);
        if (!finding) return;
        const line = document.createElement("p");
        line.className = "connect-quiz__answer-line";
        line.textContent = finding.label;
        line.classList.add(
          correctSet.has(findingId) ? "is-correct" : "is-wrong",
        );
        selectedBlock.appendChild(line);
      });

      if (!assignedIds.length) {
        const line = document.createElement("p");
        line.className = "connect-quiz__answer-line is-empty";
        line.textContent = "No findings selected.";
        selectedBlock.appendChild(line);
      }

      card.appendChild(title);
      card.appendChild(selectedBlock);

      if (!isCorrect) {
        const correctBlock = document.createElement("div");
        correctBlock.className = "connect-quiz__correct-block";

        const correctLabel = document.createElement("p");
        correctLabel.className = "connect-quiz__answer-kicker";
        correctLabel.textContent = "Correct findings";
        correctBlock.appendChild(correctLabel);

        group.findings.forEach((finding) => {
          const line = document.createElement("p");
          line.className = "connect-quiz__correct-line";
          line.textContent = finding.label;
          correctBlock.appendChild(line);
        });

        card.appendChild(correctBlock);
      }
      answerList.appendChild(card);
    });

    summary.textContent = `You connected ${getCorrectCount()} out of ${CONNECT_QUIZ_GROUPS.length} diagnoses correctly.`;
  };

  const renderDiagnosisDock = () => {
    diagnoses.innerHTML = "";

    CONNECT_QUIZ_GROUPS.forEach((group) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `connect-quiz__diagnosis connect-quiz__diagnosis--${group.tone}`;
      if (state.activeDiagnosisId === group.diagnosisId && !state.submitted) {
        button.classList.add("is-active");
      }
      if (
        getAssignedFindingIds(group.diagnosisId).length ===
        group.findings.length
      ) {
        button.classList.add("is-complete");
      }
      button.setAttribute(
        "aria-pressed",
        state.activeDiagnosisId === group.diagnosisId ? "true" : "false",
      );

      const label = document.createElement("span");
      label.className = "connect-quiz__diagnosis-label";
      label.textContent = group.diagnosis;

      const toggle = document.createElement("span");
      toggle.className = "connect-quiz__diagnosis-toggle";
      toggle.setAttribute("aria-hidden", "true");

      const toggleThumb = document.createElement("span");
      toggleThumb.className = "connect-quiz__diagnosis-thumb";
      toggle.appendChild(toggleThumb);

      button.appendChild(label);
      button.appendChild(toggle);

      button.addEventListener("click", () => {
        if (state.submitted) return;

        state.activeDiagnosisId =
          state.activeDiagnosisId === group.diagnosisId
            ? null
            : group.diagnosisId;
        setFeedback(
          state.activeDiagnosisId
            ? `Now choosing findings for ${group.diagnosis}.`
            : "Choose a diagnosis, then tap 3 matching findings.",
          state.activeDiagnosisId ? "is-success" : "",
        );
        render();
      });

      diagnoses.appendChild(button);
    });
  };

  const renderBoard = () => {
    board.innerHTML = "";

    state.findingOrder.forEach((findingId) => {
      const finding = CONNECT_QUIZ_FINDING_LOOKUP.get(findingId);
      if (!finding) return;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "connect-quiz__card";
      button.textContent = finding.label;

      const ownerDiagnosisId = state.findingOwners.get(findingId) || null;
      if (ownerDiagnosisId) {
        const ownerGroup = getGroup(ownerDiagnosisId);
        if (ownerGroup) {
          button.classList.add("is-assigned", `is-tone-${ownerGroup.tone}`);
        }
      }

      button.addEventListener("click", () => {
        if (state.submitted) return;

        if (!state.activeDiagnosisId) {
          setFeedback("Choose a diagnosis first.", "is-warning");
          return;
        }

        const activeGroup = getGroup(state.activeDiagnosisId);
        if (!activeGroup) return;

        const ownerDiagnosisId = state.findingOwners.get(findingId) || null;
        const activeAssigned = getAssignedFindingIds(state.activeDiagnosisId);

        if (ownerDiagnosisId === state.activeDiagnosisId) {
          removeFindingFromOwner(findingId);
          setFeedback(`Removed from ${activeGroup.diagnosis}.`, "is-warning");
          render();
          return;
        }

        if (activeAssigned.length >= activeGroup.findings.length) {
          setFeedback(
            `${activeGroup.diagnosis} already has 3 findings. Tap one of its colored findings to remove it first.`,
            "is-warning",
          );
          return;
        }

        assignFindingToDiagnosis(findingId, state.activeDiagnosisId);
        const updatedCount = getAssignedFindingIds(
          state.activeDiagnosisId,
        ).length;

        if (updatedCount === activeGroup.findings.length) {
          state.activeDiagnosisId = null;
          setFeedback(
            `${activeGroup.diagnosis} saved. Choose the next diagnosis.`,
            "is-success",
          );
        } else {
          setFeedback(
            `${activeGroup.diagnosis}: ${updatedCount} of 3 findings selected.`,
            "is-success",
          );
        }

        render();
      });

      board.appendChild(button);
    });
  };

  const render = () => {
    renderDiagnosisDock();

    hint.textContent = state.submitted
      ? "Your selected findings are shown below. Red means wrong, green means correct."
      : state.activeDiagnosisId
        ? `Selected diagnosis: ${getGroup(state.activeDiagnosisId)?.diagnosis || ""}. Tap 3 findings.`
        : "Tap a diagnosis below, then choose 3 matching findings.";

    board.hidden = state.submitted;
    diagnoses.hidden = state.submitted;
    answers.hidden = !state.submitted;
    submitButton.textContent = state.submitted ? "Try again" : "Submit";
    updateLessonProgress();

    if (state.submitted) {
      renderAnswers();
      return;
    }

    renderBoard();
  };

  const resetQuiz = () => {
    state.findingOrder = shuffleItems(
      CONNECT_QUIZ_FINDINGS.map((finding) => finding.id),
    );
    state.activeDiagnosisId = null;
    state.assignments.clear();
    state.findingOwners.clear();
    state.submitted = false;

    CONNECT_QUIZ_GROUPS.forEach((group) => {
      state.assignments.set(group.diagnosisId, []);
    });

    setFeedback("");
    render();
  };

  submitButton.addEventListener("click", () => {
    if (state.submitted) {
      resetQuiz();
      return;
    }

    const isComplete = CONNECT_QUIZ_GROUPS.every(
      (group) =>
        getAssignedFindingIds(group.diagnosisId).length ===
        group.findings.length,
    );

    if (
      !isComplete ||
      state.findingOwners.size !== CONNECT_QUIZ_FINDINGS.length
    ) {
      setFeedback(
        "Assign 3 findings to each diagnosis before submitting.",
        "is-warning",
      );
      return;
    }

    state.activeDiagnosisId = null;
    state.submitted = true;
    setFeedback("");
    render();
  });

  if (page.dataset.shownWired !== "1") {
    page.dataset.shownWired = "1";
    document.addEventListener("page:shown", (event) => {
      if (event.detail?.id !== "diabeticConnectQuizPage") return;
      resetQuiz();
    });
  }

  resetQuiz();
}

export function initializeDiabeticRetinopathyWorkshop() {
  const page = document.getElementById("diabeticRetinopathyWorkshopPage");
  if (!page) return;
  initializeDiabeticWorkshopProgressInfra();
  setupWorkshopFolders(page);
  updateDiabeticWorkshopProgressBars();

  const rows = page.querySelectorAll(".lesson-row[data-target]");
  rows.forEach((row) => {
    if (row.dataset.wired === "1") return;
    row.dataset.wired = "1";

    const activate = async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const targetId = row.getAttribute("data-target");
      if (!targetId) return;
      rememberDiabeticWorkshopFlowFromRow(row);

      const routeName = row.getAttribute("data-route");
      if (routeName === "videos") {
        await openVideosSubpage(targetId);
        return;
      }

      if (routeName) {
        await loadPage(routeName);
      }

      if (!document.getElementById(targetId)) return;
      showPageById(targetId);
    };

    row.addEventListener("click", activate);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") activate(event);
    });
  });

  initializeHistoryImageMatchPage(page);
  initializeRetinalStructureTapPage();
  initializeReviewVideoQuizPage();
  initializeFindingsGroupTwoPage();
  initializeConnectQuizPage();
  initializeDiabeticArclightPackagePage();
  initializeDiabeticScreeningScrollLessons();
}
