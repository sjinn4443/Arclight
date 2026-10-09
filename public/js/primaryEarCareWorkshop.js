import {
  beginPrimaryWorkshopLesson,
  initializePrimaryWorkshopProgress,
  updateActivePrimaryWorkshopLesson,
} from "./primaryWorkshopProgress.js";
import { initializePrimaryEarCareOtoscopePdf } from "./fundalReflexPdf.js";
import { loadPage } from "./navigation.js";
import { openMenu } from "./menu.js";
import { initializeDiabeticScreeningScrollLessons } from "./diabeticRetinopathyWorkshop.js";
import { appendWorkshopImages } from "./workshopLessonMedia.js";

const ROUTE = "primaryEarCareWorkshop";
const LESSON_KEY = `${ROUTE}:lesson`;
const RESTORE_KEY = `${ROUTE}:restore`;
const COMPLETED_KEY = `${ROUTE}:completedFolders`;
let backInstalled = false;
const image = (name, caption) => ({
  src: `/images/learning/PrimaryEarCare/${name}.png`,
  caption,
});
const sharedVideo = (name) => `/videos/Workshop/Shared/${name}_220p.mp4`;

const LESSONS = {
  objectives: {
    sections: [
      ["objectives", ["objective_one", "objective_two"]],
      [
        "ear_examination",
        ["history", "test_hearing", "examine_ears", "diagnosis", "action"],
      ],
      ["care_procedures", ["ear_irrigation", "dry_mopping", "ear_drops"]],
    ],
  },
  aim: {
    sections: [
      ["aim", ["aim_competent", "aim_hear", "aim_engagement", "aim_formula"]],
    ],
  },
  arclight: {
    sections: [["arclight", ["arclight_guide"]]],
    images: [image("image5", "arclight_package")],
    videos: ["/videos/Workshop/PEC/WhatisArclight.mp4"],
  },
  earHealth: {
    images: [
      { src: "/images/Ears/HealthandDeafness.jpg", caption: "ear_health" },
      image("image104", "hearing_loss_causes"),
    ],
  },
  earAnatomy: {
    images: [
      image("image105", "ear_anatomy"),
      image("image108", "tympanic_membrane"),
    ],
  },
  history: {
    sections: [
      [
        "assessment_sequence",
        ["history", "test_hearing", "examine_ears", "diagnosis", "action"],
      ],
    ],
    images: [image("image118", "assessment_sequence")],
  },
  hearing: {
    sections: [["test_hearing", ["hearing_practice"]]],
    images: [
      image("image123", "child_hearing_development"),
      image("image121", "child_hearing_test"),
    ],
  },
  hearingVideo: {
    videos: ["/videos/Workshop/PrimaryEarCare/ChildVisualDevelopment_220p.mp4"],
  },
  examination: {
    sections: [["examination", ["observe", "palpate", "otoscopy"]]],
    images: [image("image119", "examination")],
  },
  otoscopyVideo: {
    videos: ["/videos/Otoscopy/Otoscopy_Instructional_Video_051124_720p.mp4"],
  },
  otoscopyGuide: { pdf: true },
  earConditions: {
    images: [
      { src: "/images/Ears/TeachingPoster.jpg", caption: "ear_conditions" },
      image("image130", "external_ear_findings"),
    ],
  },
  otoscopyPractice: {
    sections: [
      [
        "otoscopy_practice",
        ["practice_each_other", "practice_structures", "practice_discuss"],
      ],
    ],
    images: [
      image("image128", "tympanic_membrane"),
      image("image130", "external_ear_findings"),
    ],
  },
  simulation: {
    sections: [
      [
        "simulation_stations",
        [
          "station_reflex",
          "station_fundoscopy",
          "station_otoscopy",
          "station_duration",
        ],
      ],
    ],
    videos: [
      sharedVideo("SimulationStations"),
      sharedVideo("SimulationFindings"),
    ],
  },
  earIrrigation: {
    sections: [
      [
        "ear_irrigation",
        [
          "irrigation_practice",
          "procedure_demonstration",
          "procedure_practice",
        ],
      ],
    ],
  },
  dryMopping: {
    sections: [
      [
        "dry_mopping",
        ["mopping_practice", "procedure_demonstration", "procedure_practice"],
      ],
    ],
  },
  earDrops: {
    sections: [
      [
        "ear_drops",
        ["drops_practice", "procedure_demonstration", "procedure_practice"],
      ],
    ],
  },
};
const GROUPS = [
  [
    "introduction",
    "introduction",
    [
      [
        "gettingStarted",
        "getting_started",
        [
          ["objectives", "objectives"],
          ["aim", "aim"],
          ["arclight", "arclight", "video"],
        ],
      ],
      [
        "earHealth",
        "ear_health",
        [
          ["earHealth", "ear_health"],
          ["earAnatomy", "ear_anatomy"],
        ],
      ],
    ],
  ],
  [
    "earExamination",
    "ear_examination_folder",
    [
      ["history", "history", [["history", "history"]]],
      [
        "hearing",
        "test_hearing",
        [
          ["hearing", "child_hearing_test"],
          ["hearingVideo", "hearing_video", "video"],
        ],
      ],
      [
        "otoscopy",
        "otoscopy",
        [
          ["otoscopyGuide", "otoscope_pdf", "pdf"],
          ["examination", "examination"],
          ["otoscopyVideo", "otoscopy_video", "video"],
          ["earConditions", "ear_conditions", "pdf"],
          ["otoscopyPractice", "otoscopy_practice"],
          ["simulation", "simulation_stations", "video"],
        ],
      ],
    ],
  ],
  [
    "procedures",
    "procedures_folder",
    [
      [
        "earIrrigation",
        "ear_irrigation",
        [["earIrrigation", "ear_irrigation"]],
      ],
      ["dryMopping", "dry_mopping", [["dryMopping", "dry_mopping"]]],
      ["earDrops", "ear_drops", [["earDrops", "ear_drops"]]],
    ],
  ],
];
function t(key) {
  return (
    window.I18N?.t?.(
      `primaryEarCareWorkshop.${key}`,
      key.replaceAll("_", " "),
    ) || key
  );
}
function translated(tag, key, className) {
  const node = document.createElement(tag);
  node.dataset.i18n = `primaryEarCareWorkshop.${key}`;
  node.textContent = t(key);
  if (className) node.className = className;
  return node;
}
function read(key, fallback) {
  try {
    return JSON.parse(sessionStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* optional persistence */
  }
}
function activate(node, action) {
  node.addEventListener("click", action);
  node.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  });
}
function row(label, type, dataset) {
  const node = document.createElement("div");
  node.className = `lesson-row lesson-row--${type}`;
  Object.assign(node.dataset, dataset);
  node.setAttribute("role", "button");
  node.tabIndex = 0;
  const thumb = document.createElement("div");
  thumb.className = "thumb";
  thumb.setAttribute("aria-hidden", "true");
  const main = document.createElement("div");
  main.className = "lesson-main";
  const top = document.createElement("div");
  top.className = "lesson-top";
  top.append(translated("span", label, "lesson-type"));
  main.append(top);
  node.append(
    thumb,
    main,
    translated(
      "span",
      type === "folder" ? "see_all" : type === "video" ? "watch" : "start",
      "lesson-cta",
    ),
  );
  if (type === "folder") node.setAttribute("aria-expanded", "false");
  return node;
}
function card(label, className, dataset, closeAction) {
  const node = document.createElement("div");
  node.className = className;
  Object.assign(node.dataset, dataset);
  node.hidden = true;
  const h3 = document.createElement("h3");
  const close = translated("button", "close", "see-all-toggle");
  close.type = "button";
  close.addEventListener("click", closeAction);
  h3.append(translated("span", label), close);
  node.append(h3);
  return node;
}
function restoreFolders(page) {
  const restore = read(RESTORE_KEY, null);
  if (restore) {
    page.querySelector(`[data-folder="${restore.section}"]`)?.click();
    page.querySelector(`[data-nested-folder="${restore.nested}"]`)?.click();
  }
}
async function returnToWorkshop() {
  document
    .querySelectorAll("#primaryEarCareLessonPage video")
    .forEach((video) => video.pause());
  await loadPage(ROUTE, {
    subPageId: "primaryEarCareWorkshopPage",
    replace: true,
    recordHistory: false,
  });
  const page = document.getElementById("primaryEarCareWorkshopPage");
  if (page) restoreFolders(page);
}
async function openLesson(key, section, nested) {
  const entry = GROUPS.find((g) => g[0] === section)?.[2]
    .find((g) => g[0] === nested)?.[2]
    .find((entry) => entry[0] === key);
  beginPrimaryWorkshopLesson({
    workshop: ROUTE,
    key: `ear-${key}`,
    route: ROUTE,
    target: "primaryEarCareLessonPage",
    type: entry?.[2] || "scroll",
  });
  write(LESSON_KEY, key);
  write(RESTORE_KEY, { section, nested });
  document
    .querySelectorAll("#primaryEarCareLessonPage video")
    .forEach((video) => video.pause());
  await loadPage(ROUTE, { subPageId: "primaryEarCareLessonPage" });
  renderLesson(key);
  window.scrollTo(0, 0);
  updateActivePrimaryWorkshopLesson();
}
// Shared launches keep the calling workshop's progress and return context.
export async function openPrimaryEarCareSharedLesson(key) {
  if (!LESSONS[key]) return;
  write(LESSON_KEY, key);
  await loadPage(ROUTE, { subPageId: "primaryEarCareLessonPage" });
  initializePrimaryEarCareWorkshop();
  renderLesson(key);
}
function renderLesson(key) {
  const lesson = LESSONS[key];
  const page = document.getElementById("primaryEarCareLessonPage");
  const content = page?.querySelector(".primary-ear-lesson-content");
  if (!lesson || !content) return;
  content.replaceChildren();
  const isPdf = Boolean(lesson.pdf);
  page.classList.toggle("core-examination-pdf-page", isPdf);
  page.classList.toggle("pec-eye-lesson-page", !isPdf);
  page.classList.toggle("primary-ear-lesson-page", !isPdf);
  content.classList.toggle("pec-eye-lesson-content", !isPdf);
  const container = page.querySelector(".container.pupils-container");
  container.classList.toggle("diabetic-screening-page", !isPdf);
  container.classList.toggle("medical-students-screening-page", !isPdf);
  page.querySelector(".primary-ear-pdf-download").hidden = !isPdf;
  const title = page.querySelector(".eyes-topbar__title");
  title.dataset.i18n = `primaryEarCareWorkshop.${isPdf ? "otoscope_pdf" : "title"}`;
  title.textContent = t(isPdf ? "otoscope_pdf" : "title");
  if (isPdf) page.dataset.pdfTitle = t("otoscope_pdf");
  const section = document.createElement("section");
  section.className =
    "diabetic-screening-lesson diabetic-screening-lesson--tight-hero";
  section.dataset.diabeticScrollLesson = "";
  const header = document.createElement("header");
  header.className = "diabetic-screening-hero";
  header.dataset.diabeticScrollStep = "";
  const label = GROUPS.flatMap((group) => group[2])
    .flatMap((group) => group[2])
    .find((entry) => entry[0] === key)?.[1];
  header.append(
    translated("p", "title", "diabetic-screening-eyebrow"),
    translated("h2", label || key),
  );
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
    intro.append(number, translated("h3", heading));
    const list = document.createElement("ul");
    list.className = "medical-overview-list";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.append(translated("span", item));
      list.append(li);
    });
    panel.append(intro, list);
    stack.append(panel);
  });
  appendWorkshopImages(stack, lesson.images || [], t, "primaryEarCareWorkshop");
  (lesson.videos || []).forEach((src, index) => {
    const panel = document.createElement("article");
    panel.className =
      "diabetic-screening-panel diabetic-screening-panel--content-fit";
    panel.dataset.diabeticScrollStep = "";
    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.className = "medical-learning-video";
    video.setAttribute("aria-label", `${t(label)} ${index + 1}`);
    const source = document.createElement("source");
    source.src = src;
    source.type = "video/mp4";
    video.append(source);
    panel.append(video);
    stack.append(panel);
  });
  section.append(header, stack);
  if (isPdf) {
    const viewer = document.createElement("div");
    viewer.id = "primaryEarCarePdfViewer";
    viewer.className = "core-examination-pdf-viewer";
    viewer.setAttribute("aria-label", t("otoscope_pdf"));
    content.append(viewer);
    initializePrimaryEarCareOtoscopePdf();
  } else content.append(section);
  const restore = read(RESTORE_KEY, {});
  const entries =
    GROUPS.find((g) => g[0] === restore.section)?.[2].find(
      (g) => g[0] === restore.nested,
    )?.[2] || [];
  const index = entries.findIndex((entry) => entry[0] === key);
  const nav = document.createElement("nav");
  nav.className = "pec-flow-nav";
  nav.setAttribute("aria-label", t("lesson_navigation"));
  [
    [-1, "previous", "pec-flow-prev"],
    [1, "next", "pec-flow-next"],
  ].forEach(([direction, text, className]) => {
    const button = translated("button", text, className);
    button.type = "button";
    button.addEventListener("click", () => {
      const next = entries[index + direction];
      if (next) void openLesson(next[0], restore.section, restore.nested);
      else {
        if (direction > 0) {
          const completed = new Set(read(COMPLETED_KEY, []));
          completed.add(restore.nested);
          write(COMPLETED_KEY, [...completed]);
          const folder = document.querySelector(
            `#primaryEarCareWorkshopPage [data-nested-folder="${restore.nested}"]`,
          );
          folder?.classList.add("is-pec-complete");
          if (folder && !folder.querySelector(".pec-folder-complete")) {
            const tick = document.createElement("span");
            tick.className = "pec-folder-complete";
            tick.textContent = "✓";
            tick.setAttribute("aria-label", t("completed"));
            folder.querySelector(".lesson-top")?.append(tick);
          }
        }
        void returnToWorkshop();
      }
    });
    nav.append(button);
  });
  content.append(nav);
  window.I18N?.applyTranslations?.(page);
  if (!isPdf) initializeDiabeticScreeningScrollLessons();
}
export function initializePrimaryEarCareWorkshop() {
  const page = document.getElementById("primaryEarCareWorkshopPage");
  if (!page) return;
  if (page.dataset.inited === "1") {
    initializePrimaryWorkshopProgress(ROUTE);
    return;
  }
  page.dataset.inited = "1";
  const folders = page.querySelector(".pec-workshop-folders");
  const closeAll = () => {
    folders
      .querySelectorAll(".pec-section-card, .pec-nested-section-card")
      .forEach((node) => {
        node.hidden = true;
      });
    folders
      .querySelectorAll(".pec-folder-row, .pec-nested-folder-row")
      .forEach((node) => {
        node.hidden = false;
        node.setAttribute("aria-expanded", "false");
      });
    folders
      .querySelectorAll(".pec-section-card")
      .forEach((node) => node.classList.remove("pec-nested-folder-open"));
    page.classList.remove("pec-folder-open");
  };
  GROUPS.forEach(([sectionKey, sectionLabel, nestedGroups]) => {
    const folder = row(sectionLabel, "folder", { folder: sectionKey });
    folder.classList.add("pec-folder-row");
    const section = card(
      sectionLabel,
      "pec-section-card",
      { section: sectionKey },
      closeAll,
    );
    const closeNested = () => {
      section.querySelectorAll(".pec-nested-section-card").forEach((node) => {
        node.hidden = true;
      });
      section.querySelectorAll(".pec-nested-folder-row").forEach((node) => {
        node.hidden = false;
        node.setAttribute("aria-expanded", "false");
      });
      section.classList.remove("pec-nested-folder-open");
    };
    activate(folder, () => {
      closeAll();
      folder.hidden = true;
      folder.setAttribute("aria-expanded", "true");
      section.hidden = false;
      page.classList.add("pec-folder-open");
    });
    nestedGroups.forEach(([nestedKey, nestedLabel, lessons]) => {
      const nestedFolder = row(nestedLabel, "folder", {
        nestedFolder: nestedKey,
      });
      nestedFolder.classList.add("pec-nested-folder-row");
      const nested = card(
        nestedLabel,
        "pec-nested-section-card",
        { nestedSection: nestedKey },
        closeNested,
      );
      activate(nestedFolder, () => {
        closeNested();
        nestedFolder.hidden = true;
        nestedFolder.setAttribute("aria-expanded", "true");
        nested.hidden = false;
        section.classList.add("pec-nested-folder-open");
      });
      lessons.forEach(([key, label, type = "scroll"]) => {
        const lesson = row(label, type, {
          lesson: `ear-${key}`,
          earLesson: key,
        });
        activate(lesson, () => void openLesson(key, sectionKey, nestedKey));
        nested.append(lesson);
      });
      if (read(COMPLETED_KEY, []).includes(nestedKey)) {
        nestedFolder.classList.add("is-pec-complete");
        const tick = document.createElement("span");
        tick.className = "pec-folder-complete";
        tick.textContent = "✓";
        tick.setAttribute("aria-label", t("completed"));
        nestedFolder.querySelector(".lesson-top").append(tick);
      }
      section.append(nestedFolder, nested);
    });
    folders.append(folder, section);
  });
  document
    .querySelectorAll(
      "#primaryEarCareWorkshopPage .menuBtn, #primaryEarCareLessonPage .menuBtn",
    )
    .forEach((button) => activate(button, openMenu));
  if (!backInstalled) {
    backInstalled = true;
    document.addEventListener(
      "click",
      (event) => {
        if (
          !event.target.closest?.("#backBtnGlobal") ||
          document.body.dataset.currentRoute !== ROUTE ||
          read("paediatricSurgicalEyeEarWorkshop:activeLesson", null)
        )
          return;
        const lessonPage = document.getElementById("primaryEarCareLessonPage");
        if (!lessonPage || getComputedStyle(lessonPage).display === "none")
          return;
        event.preventDefault();
        event.stopImmediatePropagation();
        void returnToWorkshop();
      },
      true,
    );
    document.addEventListener("page:shown", (event) => {
      if (event.detail?.id !== "primaryEarCareLessonPage")
        document
          .querySelectorAll("#primaryEarCareLessonPage video")
          .forEach((video) => video.pause());
    });
  }
  const saved = read(LESSON_KEY, null);
  if (
    saved &&
    (!LESSONS[saved]?.pdf ||
      getComputedStyle(document.getElementById("primaryEarCareLessonPage"))
        .display !== "none")
  )
    renderLesson(saved);
  restoreFolders(page);
  window.I18N?.applyTranslations?.(page);
  initializePrimaryWorkshopProgress(ROUTE);
}
