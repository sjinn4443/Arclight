import {
  beginPrimaryWorkshopLesson,
  initializePrimaryWorkshopProgress,
  updateActivePrimaryWorkshopLesson,
} from "./primaryWorkshopProgress.js";
import { loadPage } from "./navigation.js";
import { openMenu } from "./menu.js";
import { initializeDiabeticScreeningScrollLessons } from "./diabeticRetinopathyWorkshop.js";

import {
  appendWorkshopImages,
  appendInterpretationWorksheet,
} from "./workshopLessonMedia.js";

const RESTORE_KEY = "pecWorkshop:restore";
const MEDICAL_REUSE_KEY = "pecWorkshop:medicalReuse";
const EXTERNAL_REUSE_KEY = "pecWorkshop:externalReuse";
const LESSON_KEY = "pecWorkshop:lesson";
const SEQUENCE_KEY = "pecWorkshop:sequence";
const ACTIVE_ENTRY_KEY = "pecWorkshop:activeEntry";
const COMPLETED_FOLDERS_KEY = "pecWorkshop:completedFolders";
const PROCEDURE_VIDEO_KEY = "pecWorkshop:procedureVideo";
const PROCEDURE_VIDEO_FILES = Object.freeze({
  pupil_presentation_video: "PupilExaminationPresentation",
  front_presentation_video: "FrontOfEyePresentation",
  fundal_interpretation_video: "FundalReflexInterpretation",
  fundal_demonstration_video: "FundalReflexDemonstration",
  fundal_simulation_video: "FundalReflexSimulation",
  live_fundoscopy_video: "LiveFundoscopy",
  optic_disc_cases_video: "OpticDiscCases",
  cup_to_disc_video: "CupToDiscAssessment",
  optic_disc_appearances_video: "OpticDiscAppearances",
  simulation_stations_video: "/videos/Workshop/Shared/SimulationStations",
  simulation_findings_video: "/videos/Workshop/Shared/SimulationFindings",
  clean_eye: "1.Cleananeye",
  warm_compress: "2.Warmcompress",
  irrigate_eye: "3.Irrigateaneye",
  remove_foreign_body: "4.ForeignBodyRemoval",
  remove_eyelashes: "5.RemoveEyeLash",
  instil_medication: "6.InstileyedropsNointment",
  make_eye_pad: "7.MakepadNshield",
  apply_eye_pad: "8.Applypadandshield",
  visual_acuity_procedure: "9.VisualAcuity",
  assess_near_vision: "10.AssessNearVisionNDispenseGlasses",
  guide_sight_loss: "11.GuideBlindPerson",
});
const PROCEDURE_KEYS = [
  "irrigate_eye",
  "remove_eyelashes",
  "remove_foreign_body",
  "instil_medication",
  "make_eye_pad",
  "apply_eye_pad",
  "visual_acuity_procedure",
  "assess_near_vision",
  "guide_sight_loss",
];
let externalBackHandlerInstalled = false;
let navigationLifecycleInstalled = false;
let pecSequence = [];

function readStoredJson(key) {
  try {
    return JSON.parse(sessionStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function clearActiveEntry() {
  document
    .getElementById("glaucomaQuizCaseStudy")
    ?.classList.remove("pec-primary-quiz");
  try {
    sessionStorage.removeItem(ACTIVE_ENTRY_KEY);
  } catch {
    /* storage may be unavailable */
  }
}

function folderKey(restore) {
  return `${restore?.section || ""}:${restore?.nested || ""}`;
}

function markFolderComplete(restore) {
  const completed = new Set(readStoredJson(COMPLETED_FOLDERS_KEY) || []);
  completed.add(folderKey(restore));
  try {
    sessionStorage.setItem(
      COMPLETED_FOLDERS_KEY,
      JSON.stringify([...completed]),
    );
  } catch {
    /* storage may be unavailable */
  }
}

function showCompletedFolders(page) {
  const completed = new Set(readStoredJson(COMPLETED_FOLDERS_KEY) || []);
  const addTick = (host, key) => {
    host.classList.toggle("is-pec-complete", completed.has(key));
    host.querySelector(":scope > .pec-folder-complete")?.remove();
    if (!completed.has(key)) return;
    const tick = document.createElement("span");
    tick.className = "pec-folder-complete";
    tick.textContent = "✓";
    tick.setAttribute("aria-label", translated("completed"));
    host.insertBefore(tick, host.querySelector(":scope > .see-all-toggle"));
  };
  page
    .querySelectorAll(".pec-folder-row, .pec-nested-folder-row")
    .forEach((row) => {
      const section = row.closest("[data-section]")?.dataset.section;
      const key = row.matches(".pec-nested-folder-row")
        ? folderKey({ section, nested: row.dataset.nestedFolder })
        : folderKey({ section: row.dataset.folder });
      const label = row.querySelector(".lesson-top");
      if (label) addTick(label, key);
      row.classList.toggle("is-pec-complete", completed.has(key));
      const card = row.matches(".pec-nested-folder-row")
        ? page.querySelector(
            `[data-nested-section="${row.dataset.nestedFolder}"]`,
          )
        : page.querySelector(`[data-section="${row.dataset.folder}"]`);
      const heading = card?.querySelector(":scope > h3");
      if (heading) addTick(heading, key);
    });
}

async function returnToWorkshop() {
  clearActiveEntry();
  try {
    sessionStorage.removeItem(MEDICAL_REUSE_KEY);
    sessionStorage.removeItem(EXTERNAL_REUSE_KEY);
  } catch {
    /* storage may be unavailable */
  }
  await loadPage("pecWorkshop", {
    subPageId: "pecWorkshopPage",
    replace: true,
    recordHistory: false,
  });
}

function installExternalBackHandler() {
  if (externalBackHandlerInstalled) return;
  externalBackHandlerInstalled = true;
  document.addEventListener(
    "click",
    (event) => {
      if (
        !(event.target instanceof Element) ||
        !event.target.closest("#backBtnGlobal")
      )
        return;
      const nativeLesson = ["pecEyeLessonPage", "pecProcedureVideoPage"].some(
        (id) => {
          const page = document.getElementById(id);
          return page && getComputedStyle(page).display !== "none";
        },
      );
      if (
        document.body.dataset.currentRoute === "pecWorkshop" &&
        nativeLesson
      ) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        void returnToWorkshop();
        return;
      }
      let reuse;
      try {
        reuse = JSON.parse(
          sessionStorage.getItem(EXTERNAL_REUSE_KEY) || "null",
        );
      } catch {
        return;
      }
      if (!reuse || document.body.dataset.currentRoute !== reuse.route) return;
      const target = document.getElementById(reuse.target);
      if (!target || getComputedStyle(target).display === "none") return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      void returnToWorkshop();
    },
    true,
  );
}

const EXAMINATION_ROWS = Object.freeze({
  pupilsAnterior: [
    {
      label: "pupil_presentation_video",
      video: "pupil_presentation_video",
      type: "video",
    },
    {
      label: "front_presentation_video",
      video: "front_presentation_video",
      type: "video",
    },
    {
      label: "front_of_eye_video",
      target: "feFullAnteriorSegmentPage",
      route: "videos",
      type: "video",
    },
    {
      label: "front_of_eye_guide",
      target: "frontOfEyePdfPage",
      route: "frontOfEyePdf",
      type: "pdf",
    },
    {
      label: "front_of_eye_cases",
      target: "medicalAnteriorSegmentPage",
      type: "interactive",
    },
    {
      label: "pupil_examination_video",
      target: "pupilFullExamPage",
      route: "videos",
      type: "video",
    },
    {
      label: "pupil_examination_guide",
      target: "pupilsPecPdfPage",
      route: "pupilsPecPdf",
      type: "pdf",
    },
    {
      label: "pupils_practice",
      target: "medicalPupilsAnteriorPracticePage",
      type: "scroll",
    },
  ],
  historyTaking: [
    {
      label: "medical_history_taking",
      target: "medicalHistoryTakingPage",
      type: "scroll",
    },
    { label: "eye_history_checklist", lesson: "history", type: "scroll" },
    {
      label: "case_study",
      target: "caseStudyChatPagePrimary",
      route: "casestudy",
      type: "interactive",
      caseStudy: "primary",
    },
    {
      label: "case_study",
      target: "caseStudyChatPage",
      route: "casestudy",
      type: "interactive",
      caseStudy: "intermediate",
    },
  ],
  visualAcuity: [
    {
      label: "visual_acuity_guide",
      target: "visualAcuityPdfPage",
      route: "visualAcuityPdf",
      type: "pdf",
    },
    {
      label: "visual_acuity_practice",
      target: "medicalVisualAcuityPracticePage",
      type: "scroll",
    },
    {
      label: "visual_acuity_animation",
      target: "visualAcuityFullAnimationVideoPage",
      route: "videos",
      type: "video",
    },
    {
      label: "visual_acuity_checklist",
      lesson: "visualAcuity",
      type: "scroll",
    },
  ],
  fundalReflex: [
    {
      label: "fundal_reflex_animation",
      target: "fundalReflexExaminationScrollPage",
      route: "videos",
      type: "scroll",
    },
    {
      label: "fundal_source_guide",
      lesson: "fundalSourceGuide",
      type: "scroll",
    },
    { label: "real_cases", lesson: "realCases", type: "video" },
    {
      label: "fundal_interpretation_test",
      lesson: "fundalInterpretation",
      type: "quiz",
    },
    {
      label: "fundal_demonstration_video",
      video: "fundal_demonstration_video",
      type: "video",
    },
    {
      label: "fundal_simulation_video",
      video: "fundal_simulation_video",
      type: "video",
    },
    {
      label: "fundal_reflex_video",
      target: "fundalExamPage",
      route: "videos",
      type: "video",
    },
    {
      label: "fundal_reflex_guide",
      target: "fundalReflexPdfPage",
      route: "fundalReflexPdf",
      type: "pdf",
    },
    {
      label: "fundal_reflex_practice",
      target: "medicalFundalDirectPracticePage",
      type: "scroll",
    },
    {
      label: "Test",
      target: "fundalReflexQuizPage",
      route: "fundalReflexQuiz",
      type: "quiz",
    },
  ],
  fundoscopy: [
    {
      label: "fundoscopy_video",
      target: "directOphthalmoscopyVideoPage",
      route: "videos",
      type: "video",
    },
    {
      label: "fundoscopy_guide",
      target: "directOphthalmoscopyPdfPage",
      route: "directOphthalmoscopyPdf",
      type: "pdf",
    },
    { label: "fundoscopy_findings", lesson: "fundoscopy", type: "scroll" },
    {
      label: "fundoscopy_practice",
      target: "medicalFundalDirectPracticePage",
      type: "scroll",
    },
    {
      label: "live_fundoscopy_video",
      video: "live_fundoscopy_video",
      type: "video",
    },
    {
      label: "optic_nerve_quiz",
      target: "glaucomaQuizCaseStudy",
      route: "glaucomaQuizCaseStudy",
      type: "quiz",
    },
    { label: "cup_to_disc_video", video: "cup_to_disc_video", type: "video" },
    {
      label: "optic_disc_appearances_video",
      video: "optic_disc_appearances_video",
      type: "video",
    },
    {
      label: "simulation_stations_video",
      video: "simulation_stations_video",
      type: "video",
    },
    {
      label: "simulation_findings_video",
      video: "simulation_findings_video",
      type: "video",
    },
    {
      label: "cataract_identification_video",
      lesson: "cataractIdentification",
      type: "video",
    },
  ],
  lidHygiene: ["clean_eye", "warm_compress"].map((key) => ({
    label: key,
    video: key,
    type: "video",
  })),
  procedures: PROCEDURE_KEYS.map((key) => ({
    label: key,
    video: key,
    type: "video",
  })),
});

const EYE_LESSONS = Object.freeze({
  objectives: {
    title: "objectives",
    sections: [
      ["objectives", ["objective_one", "objective_two"]],
      [
        "exam_objectives",
        [
          "history",
          "visual_acuity",
          "pupils",
          "front_of_eye",
          "fundal_reflex",
          "fundoscopy",
          "diagnosis_and_action",
        ],
      ],
      [
        "care_procedures",
        [
          "warm_compress",
          "irrigate_eye",
          "remove_eyelashes",
          "remove_foreign_body",
          "instil_medication",
          "make_eye_pad",
          "apply_eye_pad",
          "guide_sight_loss",
        ],
      ],
    ],
  },
  aim: {
    title: "aim",
    sections: [
      [
        "aim_heading",
        ["aim_competent", "aim_see", "aim_engagement", "aim_formula"],
      ],
    ],
  },
  history: {
    title: "eye_history_checklist",
    sections: [
      [
        "history_questions",
        [
          "history_problem",
          "history_when",
          "history_how",
          "history_pain",
          "history_redness",
          "history_vision",
          "history_progress",
          "history_treatment",
          "history_else",
        ],
      ],
    ],
  },
  visualAcuity: {
    title: "visual_acuity_checklist",
    sections: [
      [
        "visual_acuity_practice",
        [
          "acuity_cover",
          "acuity_pinhole",
          "acuity_record",
          "acuity_near",
          "acuity_reading_glasses",
        ],
      ],
    ],
  },
  fundoscopy: {
    title: "fundoscopy_findings",
    sections: [
      [
        "disc_appearances",
        [
          "disc_normal",
          "disc_swollen",
          "disc_pale",
          "disc_cupped",
          "disc_new_vessels",
        ],
      ],
      [
        "fundoscopy_practice",
        ["fundoscopy_each_other", "fundoscopy_simulation"],
      ],
    ],
  },
  realCases: {
    title: "real_cases",
    videos: ["Realcase1", "Realcase2", "Realcase3"],
  },
  fundalSourceGuide: {
    title: "fundal_source_guide",
    images: [
      {
        src: "/images/learning/PEC/image57.png",
        caption: "fundal_source_guide",
      },
      {
        src: "/images/learning/PEC/image67.png",
        caption: "fundal_test_images",
      },
      {
        src: "/images/learning/PEC/image68.png",
        caption: "fundal_test_images",
      },
      {
        src: "/images/learning/PEC/image69.png",
        caption: "fundal_test_images",
      },
    ],
  },
  fundalInterpretation: {
    title: "fundal_interpretation_test",
    videos: ["FundalReflexInterpretationQuestions_220p"],
    trailingVideos: ["FundalReflexInterpretationAnswers_220p"],
    images: [
      {
        src: "/images/learning/PEC/image64.png",
        caption: "fundal_test_images",
        rotate: true,
      },
    ],
    worksheet: true,
  },
  cataractIdentification: {
    title: "cataract_identification_video",
    videos: ["/videos/Cataract/Cataract Identification PEC 20MB.mp4"],
  },
});

function translated(key) {
  const path = `pecWorkshop.${key}`;
  const fallback = key.replaceAll("_", " ");
  return window.I18N?.t?.(path, fallback) || fallback;
}

function makeTranslated(tag, key) {
  const element = document.createElement(tag);
  element.dataset.i18n = `pecWorkshop.${key}`;
  element.textContent = translated(key);
  return element;
}

function captureLessonSequence(page) {
  const rows = Array.from(
    page.querySelectorAll(
      ".pec-workshop-folders [data-pec-lesson], .pec-workshop-folders [data-medical-target], .pec-workshop-folders [data-pec-route]",
    ),
  );
  pecSequence = rows.map((row, index) => {
    row.dataset.pecIndex = String(index);
    const externalTarget =
      row.dataset.pecLesson || row.dataset.pecVideo
        ? null
        : row.dataset.pecCaseStudy === "primary"
          ? "caseStudyChatPagePrimary"
          : row.dataset.pecCaseStudy === "intermediate"
            ? "caseStudyChatPage"
            : row.dataset.pecTarget || row.dataset.medicalTarget;
    if (externalTarget) row.dataset.primaryProgressTarget = externalTarget;
    return {
      key: row.dataset.lesson,
      type: /lesson-row--(\w+)/.exec(row.className)?.[1] || "scroll",
      externalTarget,
      lesson: row.dataset.pecLesson || null,
      video: row.dataset.pecVideo || null,
      route:
        row.dataset.pecRoute ||
        (row.dataset.medicalTarget ? "medicalStudentsWorkshop" : "pecWorkshop"),
      target:
        row.dataset.pecTarget ||
        row.dataset.medicalTarget ||
        "pecEyeLessonPage",
      caseStudy: row.dataset.pecCaseStudy || null,
      restore: {
        section: row.closest("[data-section]")?.dataset.section || null,
        nested:
          row.closest(".pec-nested-section-card")?.dataset.nestedSection ||
          null,
      },
    };
  });
  try {
    sessionStorage.setItem(SEQUENCE_KEY, JSON.stringify(pecSequence));
  } catch {
    /* storage may be unavailable */
  }
}

function getLessonSequence() {
  return pecSequence.length ? pecSequence : readStoredJson(SEQUENCE_KEY) || [];
}

function ensurePecNavigation() {
  const active = readStoredJson(ACTIVE_ENTRY_KEY);
  const sequence = getLessonSequence();
  if (
    !active ||
    !sequence[active.index] ||
    document.body.dataset.currentRoute !== active.route
  )
    return;
  const page = document.getElementById(active.target);
  if (!page || getComputedStyle(page).display === "none") return;
  if (active.target === "glaucomaQuizCaseStudy")
    page.classList.add("pec-primary-quiz");
  if (active.caseStudy === "primary")
    page.classList.add("pec-case-study-primary");
  const host =
    active.caseStudy === "intermediate"
      ? page.querySelector(".casechat-footer")
      : page.querySelector(".container.pupils-container") ||
        page.querySelector(".container") ||
        page;
  if (!host) return;
  const existing = host.querySelector(":scope > .pec-flow-nav");
  if (existing?.dataset.pecIndex === String(active.index)) return;
  existing?.remove();
  page.classList.add("pec-flow-target");
  const nav = document.createElement("nav");
  nav.className = "pec-flow-nav";
  nav.dataset.pecIndex = String(active.index);
  nav.setAttribute("aria-label", translated("lesson_navigation"));
  const previous = document.createElement("button");
  previous.type = "button";
  previous.className = "pec-flow-prev";
  previous.append(
    document.createTextNode("< "),
    makeTranslated("span", "previous"),
  );
  previous.addEventListener(
    "click",
    () => void navigateWithinFolder(active.index, -1),
  );
  const next = document.createElement("button");
  next.type = "button";
  next.className = "pec-flow-next";
  next.append(makeTranslated("span", "next"), document.createTextNode(" >"));
  next.addEventListener(
    "click",
    () => void navigateWithinFolder(active.index, 1),
  );
  nav.append(previous, next);
  host.append(nav);
  window.I18N?.applyTranslations?.(nav);
}

export function restorePecNavigation() {
  if (!navigationLifecycleInstalled) {
    navigationLifecycleInstalled = true;
    document.addEventListener("page:shown", (event) => {
      if (event.detail?.id === "pecWorkshopPage") clearActiveEntry();
      else requestAnimationFrame(ensurePecNavigation);
    });
    window.addEventListener("page:loaded", (event) => {
      const active = readStoredJson(ACTIVE_ENTRY_KEY);
      if (
        active &&
        event.detail?.routeName !== active.route &&
        event.detail?.routeName !== "pecWorkshop"
      ) {
        clearActiveEntry();
      }
    });
  }
  requestAnimationFrame(ensurePecNavigation);
}

async function navigateWithinFolder(index, direction) {
  const sequence = getLessonSequence();
  const current = sequence[index];
  const next = sequence[index + direction];
  if (next && folderKey(current?.restore) === folderKey(next.restore)) {
    await navigateToPecIndex(index + direction);
    return;
  }
  if (current && direction > 0) markFolderComplete(current.restore);
  await returnToWorkshop();
}

async function navigateToPecIndex(index) {
  const sequence = getLessonSequence();
  const entry = sequence[index];
  if (!entry) {
    await returnToWorkshop();
    return;
  }
  beginPrimaryWorkshopLesson({
    workshop: "pecWorkshop",
    key: entry.key,
    route: entry.route,
    target: entry.target,
    type: entry.type,
    externalTarget: entry.externalTarget,
  });
  const active = {
    index,
    route: entry.route,
    target: entry.target,
    caseStudy: entry.caseStudy,
  };
  try {
    sessionStorage.setItem(ACTIVE_ENTRY_KEY, JSON.stringify(active));
    sessionStorage.setItem(RESTORE_KEY, JSON.stringify(entry.restore));
    sessionStorage.removeItem(MEDICAL_REUSE_KEY);
    sessionStorage.removeItem(EXTERNAL_REUSE_KEY);
  } catch {
    /* storage may be unavailable */
  }
  restorePecNavigation();

  if (entry.video) {
    try {
      sessionStorage.setItem(PROCEDURE_VIDEO_KEY, entry.video);
    } catch {
      /* storage may be unavailable */
    }
    await loadPage("pecWorkshop", { subPageId: "pecProcedureVideoPage" });
    renderProcedureVideo(entry.video);
    ensurePecNavigation();
  } else if (entry.lesson) {
    try {
      sessionStorage.setItem(LESSON_KEY, entry.lesson);
    } catch {
      /* storage may be unavailable */
    }
    await loadPage("pecWorkshop", { subPageId: "pecEyeLessonPage" });
    renderEyeLesson(entry.lesson);
    ensurePecNavigation();
  } else if (entry.route === "medicalStudentsWorkshop") {
    try {
      sessionStorage.setItem(
        MEDICAL_REUSE_KEY,
        JSON.stringify({ ...entry.restore, target: entry.target }),
      );
    } catch {
      /* storage may be unavailable */
    }
    await loadPage(entry.route, { subPageId: entry.target });
    document
      .getElementById(entry.target)
      ?.classList.add("pec-reused-medical-page");
    ensurePecNavigation();
  } else {
    try {
      sessionStorage.setItem(
        EXTERNAL_REUSE_KEY,
        JSON.stringify({ route: entry.route, target: entry.target }),
      );
    } catch {
      /* storage may be unavailable */
    }
    if (entry.caseStudy) {
      await loadPage("casestudy", { subPageId: "casestudyPage" });
      if (entry.caseStudy === "primary") {
        const { initializeCaseStudyPrimary } =
          await import("./casestudy_primary.js");
        initializeCaseStudyPrimary();
      } else {
        const { initializeCaseStudy } = await import("./casestudy.js");
        initializeCaseStudy();
      }
      await new Promise((resolve) => requestAnimationFrame(resolve));
      document
        .getElementById(
          entry.caseStudy === "primary"
            ? "caseStudyPrimaryCard"
            : "caseStudyIntermediateCard",
        )
        ?.click();
    } else {
      await loadPage(entry.route, { subPageId: entry.target });
    }
    ensurePecNavigation();
  }
  window.scrollTo(0, 0);
  updateActivePrimaryWorkshopLesson();
}

function populateExaminationRows(page) {
  Object.entries(EXAMINATION_ROWS).forEach(([sectionName, rows]) => {
    const section = page.querySelector(
      `[data-nested-section="${sectionName}"]`,
    );
    if (!section) return;
    rows.forEach((entry) => {
      const row = document.createElement("div");
      row.className = `lesson-row lesson-row--${entry.type}`;
      row.dataset.lesson = `pec-${entry.label.replaceAll("_", "-")}`;
      if (entry.video) {
        row.dataset.pecVideo = entry.video;
        row.dataset.pecRoute = "pecWorkshop";
        row.dataset.pecTarget = "pecProcedureVideoPage";
      } else if (entry.lesson) row.dataset.pecLesson = entry.lesson;
      else if (entry.route) {
        row.dataset.pecRoute = entry.route;
        row.dataset.pecTarget = entry.target;
        if (entry.caseStudy) row.dataset.pecCaseStudy = entry.caseStudy;
      } else row.dataset.medicalTarget = entry.target;
      row.setAttribute("role", "button");
      row.tabIndex = 0;
      const thumb = document.createElement("div");
      thumb.className = "thumb";
      thumb.setAttribute("aria-hidden", "true");
      const main = document.createElement("div");
      main.className = "lesson-main";
      const top = document.createElement("div");
      top.className = "lesson-top";
      const title = makeTranslated("span", entry.label);
      title.className = "lesson-type";
      if (entry.caseStudy) {
        top.append(makeTranslated("span", entry.caseStudy));
      }
      top.append(title);
      if (entry.caseStudy) {
        top.firstElementChild.className = "pec-case-study-level";
        top.classList.add("pec-case-study-label");
        row.dataset.pecCaseStudy = entry.caseStudy;
      }
      main.append(top);
      const cta = makeTranslated(
        "span",
        entry.type === "video" ? "watch" : "start",
      );
      cta.className = "lesson-cta";
      row.append(thumb, main, cta);
      section.append(row);
    });
  });
}

function renderProcedureVideo(key) {
  const filename = PROCEDURE_VIDEO_FILES[key];
  const page = document.getElementById("pecProcedureVideoPage");
  const video = page?.querySelector(".pec-procedure-video");
  const source = video?.querySelector("source");
  const toggle = page?.querySelector(".tri-toggle");
  if (!filename || !page || !video || !source || !toggle) return;
  page.dataset.pecRenderedVideo = key;
  const title = page.querySelector(".pec-procedure-video-title");
  if (title) {
    title.dataset.i18n = `pecWorkshop.${key}`;
    title.textContent = translated(key);
    window.I18N?.applyTranslations?.(title);
  }
  const selectMode = (mode, preserveTime = true) => {
    if (mode !== "low" && mode !== "high") return;
    const file = PROCEDURE_VIDEO_FILES[page.dataset.pecRenderedVideo];
    const base = file.startsWith("/") ? file : `/videos/Workshop/PEC/${file}`;
    const nextSrc = `${base}_${mode === "low" ? "220p" : "720p"}.mp4`;
    const previousTime = preserveTime ? video.currentTime || 0 : 0;
    const wasPlaying = preserveTime && !video.paused;
    toggle.dataset.active = mode;
    toggle.style.setProperty("--tri-cols", "2");
    toggle.querySelectorAll(".tri-toggle__btn").forEach((button) => {
      button.setAttribute("aria-checked", String(button.dataset.mode === mode));
    });
    if (source.getAttribute("src") === nextSrc) return;
    source.src = nextSrc;
    video.load();
    if (previousTime > 0)
      video.addEventListener(
        "loadedmetadata",
        () => {
          video.currentTime = Math.min(
            previousTime,
            video.duration || previousTime,
          );
          if (wasPlaying) void video.play().catch(() => {});
        },
        { once: true },
      );
  };
  if (toggle.dataset.pecWired !== "1") {
    toggle.dataset.pecWired = "1";
    toggle.addEventListener("click", (event) => {
      const button = event.target.closest(".tri-toggle__btn");
      if (button) selectMode(button.dataset.mode);
    });
  }
  selectMode("low", false);
}

function renderEyeLesson(key) {
  const lesson = EYE_LESSONS[key];
  const page = document.getElementById("pecEyeLessonPage");
  const content = page?.querySelector(".pec-eye-lesson-content");
  if (!lesson || !content) return false;
  content.replaceChildren();
  const section = document.createElement("section");
  section.className =
    "diabetic-screening-lesson diabetic-screening-lesson--tight-hero pec-scroll-lesson";
  section.dataset.diabeticScrollLesson = "";
  const cue = document.createElement("div");
  cue.className = "diabetic-screening-scroll-cue";
  cue.dataset.diabeticScrollCue = "";
  cue.setAttribute("aria-hidden", "true");
  section.append(cue);
  const header = document.createElement("header");
  header.className = "diabetic-screening-hero";
  header.dataset.diabeticScrollStep = "";
  const eyebrow = makeTranslated("p", "title");
  eyebrow.className = "diabetic-screening-eyebrow";
  header.append(eyebrow, makeTranslated("h2", lesson.title));
  section.append(header);
  const stack = document.createElement("div");
  stack.className = "diabetic-screening-stack";
  (lesson.sections || []).forEach(([heading, items], index) => {
    const panel = document.createElement("article");
    panel.className = "diabetic-screening-panel";
    panel.dataset.diabeticScrollStep = "";
    const intro = document.createElement("div");
    intro.className = "diabetic-screening-panel__text";
    const number = document.createElement("span");
    number.className = "diabetic-screening-step";
    number.textContent = String(index + 1).padStart(2, "0");
    intro.append(number, makeTranslated("h3", heading));
    panel.append(intro);
    const list = document.createElement("ul");
    list.className = "medical-overview-list";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.append(makeTranslated("span", item));
      list.append(li);
    });
    panel.append(list);
    stack.append(panel);
  });
  if (key === "aim" || key === "visualAcuity") {
    const visual = document.createElement("article");
    visual.className = "diabetic-screening-panel";
    visual.dataset.diabeticScrollStep = "";
    const stages = document.createElement("div");
    stages.className = "medical-workshop-arc";
    const keys =
      key === "aim"
        ? ["aim_competent", "aim_see", "aim_engagement", "aim_formula"]
        : ["acuity_cover", "acuity_pinhole", "acuity_record"];
    keys.forEach((stage) => {
      const step = makeTranslated("span", stage);
      step.className = "medical-workshop-arc__stage";
      stages.append(step);
    });
    visual.append(stages);
    stack.append(visual);
  }
  const appendVideo = (name, index) => {
    const panel = document.createElement("article");
    panel.className = "diabetic-screening-panel pec-real-case-panel";
    panel.dataset.diabeticScrollStep = "";
    const video = document.createElement("video");
    video.className = "medical-learning-video";
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute(
      "aria-label",
      `${translated("real_cases")} ${index + 1}`,
    );
    const source = document.createElement("source");
    source.src = name.startsWith("/")
      ? name
      : `/videos/Workshop/PEC/${name}.mp4`;
    source.type = "video/mp4";
    video.append(source);
    panel.append(video);
    stack.append(panel);
  };
  (lesson.videos || []).forEach(appendVideo);
  appendWorkshopImages(stack, lesson.images || [], translated);
  if (lesson.worksheet) appendInterpretationWorksheet(stack, key, translated);
  (lesson.trailingVideos || []).forEach(appendVideo);
  section.append(stack);
  content.append(section);
  page.dataset.pecRenderedLesson = key;
  window.I18N?.applyTranslations?.(page);
  initializeDiabeticScreeningScrollLessons();
  return true;
}

function activateOnKeyboard(element, callback) {
  element.addEventListener("click", callback);
  element.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    callback(event);
  });
}

export function initializePecWorkshop() {
  const page = document.getElementById("pecWorkshopPage");
  if (!page) return;
  if (page.dataset.inited === "1") {
    initializePrimaryWorkshopProgress("pecWorkshop");
    return;
  }
  page.dataset.inited = "1";
  installExternalBackHandler();

  populateExaminationRows(page);
  captureLessonSequence(page);
  showCompletedFolders(page);
  restorePecNavigation();
  try {
    const lessonKey = sessionStorage.getItem(LESSON_KEY);
    if (
      lessonKey &&
      document.getElementById("pecEyeLessonPage")?.dataset.pecRenderedLesson !==
        lessonKey
    )
      renderEyeLesson(lessonKey);
    const videoKey = sessionStorage.getItem(PROCEDURE_VIDEO_KEY);
    if (
      videoKey &&
      document.getElementById("pecProcedureVideoPage")?.dataset
        .pecRenderedVideo !== videoKey
    )
      renderProcedureVideo(videoKey);
  } catch {
    /* storage may be unavailable */
  }

  page.querySelectorAll(".menuBtn").forEach((button) => {
    button.addEventListener("click", openMenu);
    button.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      button.click();
    });
  });

  document
    .getElementById("pecEyeLessonPage")
    ?.querySelectorAll(".menuBtn")
    .forEach((button) => {
      button.addEventListener("click", openMenu);
      button.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        button.click();
      });
    });

  const folders = Array.from(page.querySelectorAll(".pec-folder-row"));
  const sections = Array.from(page.querySelectorAll(".pec-section-card"));

  const closeNested = (section) => {
    section.querySelectorAll(".pec-nested-section-card").forEach((nested) => {
      nested.hidden = true;
    });
    section.querySelectorAll(".pec-nested-folder-row").forEach((folder) => {
      folder.hidden = false;
      folder.setAttribute("aria-expanded", "false");
    });
    section.classList.remove("pec-nested-folder-open");
  };

  const closeSections = () => {
    sections.forEach((section) => {
      closeNested(section);
      section.hidden = true;
    });
    folders.forEach((folder) => {
      folder.hidden = false;
      folder.setAttribute("aria-expanded", "false");
    });
    page.classList.remove("pec-folder-open");
  };

  folders.forEach((folder) => {
    activateOnKeyboard(folder, () => {
      const section = sections.find(
        (candidate) => candidate.dataset.section === folder.dataset.folder,
      );
      if (!section) return;
      closeSections();
      folder.hidden = true;
      folder.setAttribute("aria-expanded", "true");
      folder.insertAdjacentElement("afterend", section);
      section.hidden = false;
      page.classList.add("pec-folder-open");
    });
  });

  sections.forEach((section) => {
    section
      .querySelector("[data-close-section]")
      ?.addEventListener("click", closeSections);
    section.querySelectorAll(".pec-nested-folder-row").forEach((folder) => {
      activateOnKeyboard(folder, () => {
        const nested = Array.from(
          section.querySelectorAll(".pec-nested-section-card"),
        ).find(
          (candidate) =>
            candidate.dataset.nestedSection === folder.dataset.nestedFolder,
        );
        if (!nested) return;
        closeNested(section);
        folder.hidden = true;
        folder.setAttribute("aria-expanded", "true");
        folder.insertAdjacentElement("afterend", nested);
        nested.hidden = false;
        section.classList.add("pec-nested-folder-open");
      });
    });
    section.querySelectorAll("[data-close-nested]").forEach((button) => {
      button.addEventListener("click", () => closeNested(section));
    });
  });

  page
    .querySelectorAll(
      "[data-pec-lesson], [data-medical-target], [data-pec-route]",
    )
    .forEach((row) => {
      activateOnKeyboard(
        row,
        () => void navigateToPecIndex(Number(row.dataset.pecIndex)),
      );
    });

  try {
    const restore = JSON.parse(sessionStorage.getItem(RESTORE_KEY) || "null");
    if (restore?.section) {
      page.querySelector(`[data-folder="${restore.section}"]`)?.click();
      if (restore.nested) {
        page.querySelector(`[data-nested-folder="${restore.nested}"]`)?.click();
      }
    }
  } catch {
    /* storage may be unavailable */
  }
  initializePrimaryWorkshopProgress("pecWorkshop");
}
