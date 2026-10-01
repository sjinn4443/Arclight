import { readLessonProgress } from "./lessonProgress.js";
import { syncLessonCompletionTick } from "./lessonCompletionTick.js";

const COLOUR = "#15e115";
const INTERMEDIATE_COLOUR = "#f25600";
const ACTIVE_KEY = "primaryWorkshop:activeLesson";
const WORKSHOPS = {
  pecWorkshop: "pecWorkshopPage",
  primaryEarCareWorkshop: "primaryEarCareWorkshopPage",
};
let wired = false;
let frame = null;
const read = (storage, key) => {
  try {
    return JSON.parse(storage.getItem(key) || "null");
  } catch {
    return null;
  }
};
const write = (storage, key, value) => {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    /* optional storage */
  }
};
const keyFor = (workshop, key) => `primaryWorkshop:progress:${workshop}:${key}`;
const percent = (value) => Math.max(0, Math.min(100, Number(value) || 0));
let active = read(sessionStorage, ACTIVE_KEY);

function rowColour(workshop, row) {
  return workshop === "pecWorkshop" &&
    row.dataset.pecTarget === "fundalReflexQuizPage"
    ? INTERMEDIATE_COLOUR
    : COLOUR;
}

function setProgress(context, value) {
  const key = keyFor(context.workshop, context.key);
  const previous = percent(read(localStorage, key)?.percent);
  const next = Math.max(previous, percent(value));
  if (next !== previous)
    write(localStorage, key, { percent: next, updatedAt: Date.now() });
  refreshPrimaryWorkshopProgress();
}

export function beginPrimaryWorkshopLesson(context) {
  initializeInfra();
  active = context;
  write(sessionStorage, ACTIVE_KEY, active);
}

function rowPercent(workshop, row) {
  const saved = percent(
    read(localStorage, keyFor(workshop, row.dataset.lesson))?.percent,
  );
  const external = row.dataset.primaryProgressTarget;
  return Math.max(saved, external ? readLessonProgress(external).percent : 0);
}

export function refreshPrimaryWorkshopProgress() {
  Object.entries(WORKSHOPS).forEach(([workshop, pageId]) => {
    const page = document.getElementById(pageId);
    if (!page) return;
    page.querySelectorAll(".lesson-row[data-lesson]").forEach((row) => {
      const value = rowPercent(workshop, row);
      const colour = rowColour(workshop, row);
      const bar = row.querySelector(".lesson-progress");
      if (bar) {
        bar.setAttribute("aria-valuenow", String(Math.round(value)));
        const fill = bar.querySelector(".lesson-progress__fill");
        fill.style.width = `${value}%`;
        fill.style.backgroundColor = colour;
      }
      syncLessonCompletionTick(row, value, colour);
    });
    page
      .querySelectorAll(".pec-folder-row, .pec-nested-folder-row")
      .forEach((row) => {
        const container = row.dataset.nestedFolder
          ? page.querySelector(
              `[data-nested-section="${row.dataset.nestedFolder}"]`,
            )
          : page.querySelector(`[data-section="${row.dataset.folder}"]`);
        const lessons = Array.from(
          container?.querySelectorAll(".lesson-row[data-lesson]") || [],
        );
        const complete =
          lessons.length > 0 &&
          lessons.every((lesson) => rowPercent(workshop, lesson) >= 100);
        row
          .querySelectorAll(".pec-folder-complete")
          .forEach((tick) => tick.remove());
        container?.querySelector(":scope > h3 .pec-folder-complete")?.remove();
        row.classList.toggle("is-pec-complete", complete);
        syncLessonCompletionTick(row, complete ? 100 : 0, COLOUR);
      });
  });
}

export function initializePrimaryWorkshopProgress(workshop) {
  initializeInfra();
  const page = document.getElementById(WORKSHOPS[workshop]);
  if (read(sessionStorage, `${workshop}:resetFolders`)) {
    resetFolders(workshop, false);
    try {
      sessionStorage.removeItem(`${workshop}:resetFolders`);
    } catch {
      /* optional storage */
    }
  }
  page?.querySelectorAll(".lesson-row[data-lesson]").forEach((row) => {
    if (row.querySelector(".lesson-progress")) return;
    const bar = document.createElement("div");
    bar.className = "lesson-progress";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute(
      "aria-label",
      row.querySelector(".lesson-type")?.textContent || "Lesson progress",
    );
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    const fill = document.createElement("div");
    fill.className = "lesson-progress__fill";
    fill.style.backgroundColor = rowColour(workshop, row);
    bar.append(fill);
    row.querySelector(".lesson-main")?.append(bar);
  });
  refreshPrimaryWorkshopProgress();
  updateActivePrimaryWorkshopLesson();
}

function visibleLesson() {
  if (!active || document.body.dataset.currentRoute !== active.route)
    return null;
  const page = document.getElementById(active.target);
  return page && getComputedStyle(page).display !== "none" ? page : null;
}

export function updateActivePrimaryWorkshopLesson() {
  const page = visibleLesson();
  if (!page) return;
  const external = active.externalTarget;
  if (external) setProgress(active, readLessonProgress(external).percent);
  if (active.type === "pdf") {
    setProgress(active, 100);
    return;
  }
  if (active.type === "video") {
    const videos = Array.from(page.querySelectorAll("video"));
    if (!videos.length) return;
    const values = videos.map((video) => {
      const source = (
        video.querySelector("source")?.getAttribute("src") ||
        video.getAttribute("src") ||
        ""
      ).replace(/_(220p|720p)/, "");
      const key = `${keyFor(active.workshop, active.key)}:media:${source}`;
      const previous = percent(read(localStorage, key)?.percent);
      const current = video.ended
        ? 100
        : video.duration > 0
          ? Math.min(99, (video.currentTime / video.duration) * 100)
          : 0;
      const value = Math.max(previous, current);
      if (value !== previous) write(localStorage, key, { percent: value });
      return value;
    });
    setProgress(
      active,
      values.reduce((sum, value) => sum + value, 0) / values.length,
    );
    return;
  }
  if (active.type === "quiz" || active.type === "interactive") return;
  const root = document.scrollingElement || document.documentElement;
  const scrollRoot = document.getElementById("page-content");
  const nestedScroll =
    scrollRoot &&
    scrollRoot.scrollHeight > scrollRoot.clientHeight + 1 &&
    root.scrollHeight <= innerHeight + 1;
  const top = nestedScroll ? scrollRoot.scrollTop : window.scrollY;
  const height = nestedScroll ? scrollRoot.scrollHeight : root.scrollHeight;
  const viewport = nestedScroll ? scrollRoot.clientHeight : innerHeight;
  if (height <= 0 || viewport <= 0) return;
  const imagesReady = Array.from(page.querySelectorAll("img")).every(
    (image) => image.complete && image.naturalWidth > 0,
  );
  setProgress(
    active,
    top + viewport >= height - 8 && imagesReady
      ? 100
      : Math.min(99, ((top + viewport) / height) * 100),
  );
}

function scheduleUpdate() {
  if (frame !== null) return;
  frame = requestAnimationFrame(() => {
    frame = null;
    updateActivePrimaryWorkshopLesson();
  });
}

function resetFolders(workshop, pending = true) {
  if (pending) write(sessionStorage, `${workshop}:resetFolders`, true);
  try {
    sessionStorage.removeItem(`${workshop}:restore`);
  } catch {
    /* optional storage */
  }
  const page = document.getElementById(WORKSHOPS[workshop]);
  page
    ?.querySelectorAll(".pec-section-card, .pec-nested-section-card")
    .forEach((card) => {
      card.hidden = true;
      card.classList.remove("pec-nested-folder-open");
    });
  page
    ?.querySelectorAll(".pec-folder-row, .pec-nested-folder-row")
    .forEach((row) => {
      row.hidden = false;
      row.setAttribute("aria-expanded", "false");
    });
  page?.classList.remove("pec-folder-open");
}

function initializeInfra() {
  if (wired) return;
  wired = true;
  window.addEventListener("page:loaded", (event) => {
    const route = event.detail?.routeName;
    Object.keys(WORKSHOPS).forEach((workshop) => {
      if (
        route !== workshop &&
        !(active?.workshop === workshop && route === active.route)
      )
        resetFolders(workshop);
    });
    if (active && route !== active.workshop && route !== active.route) {
      active = null;
      try {
        sessionStorage.removeItem(ACTIVE_KEY);
      } catch {
        /* optional storage */
      }
    }
    scheduleUpdate();
  });
  document.addEventListener("page:shown", (event) => {
    if (active && event.detail?.id === WORKSHOPS[active.workshop]) {
      active = null;
      try {
        sessionStorage.removeItem(ACTIVE_KEY);
      } catch {
        /* optional storage */
      }
      refreshPrimaryWorkshopProgress();
    }
    scheduleUpdate();
  });
  ["scroll", "resize"].forEach((name) =>
    window.addEventListener(name, scheduleUpdate, { passive: true }),
  );
  document.addEventListener("scroll", scheduleUpdate, {
    passive: true,
    capture: true,
  });
  ["timeupdate", "ended", "loadedmetadata", "change", "load"].forEach((name) =>
    document.addEventListener(name, scheduleUpdate, true),
  );
  [
    "arclight:lesson-progress-changed",
    "medicalStudentsWorkshop:progress-changed",
    "glaucomaWorkshop:progress-changed",
    "diabeticWorkshop:progress-changed",
    "childhoodWorkshop:route-complete",
  ].forEach((name) =>
    document.addEventListener(name, () => {
      refreshPrimaryWorkshopProgress();
      scheduleUpdate();
    }),
  );
  document.addEventListener("primaryWorkshop:worksheet-saved", (event) => {
    if (
      active?.workshop === "pecWorkshop" &&
      active.key === "pec-fundal-interpretation-test"
    )
      setProgress(active, event.detail?.percent);
  });
  window.addEventListener("storage", () => {
    refreshPrimaryWorkshopProgress();
    scheduleUpdate();
  });
}
