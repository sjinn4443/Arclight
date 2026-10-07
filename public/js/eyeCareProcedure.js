import { EYE_CARE_PROCEDURES } from "./eyeCareProcedureData.js";
import { getRouteFromHash, loadPage } from "./navigation.js";
import { openMenu } from "./menu.js";
import { renderProcedureVideo } from "./pecWorkshop.js";
import {
  EYE_PAD_SHIELD_SCROLL_PAGE,
  EYE_PAD_SHIELD_SCROLL_ROUTE,
} from "./eyePadShieldScroll.js";
import { primeExaminationNarration } from "./examinationScrollTiming.js";
import {
  setLessonProgress,
  updateLessonProgressRows,
  LESSON_PROGRESS_EVENT,
} from "./lessonProgress.js";

let padShieldInitialization = Promise.resolve();
const pendingPadShieldPages = new WeakMap();
function initializePadShieldScroll() {
  const page = document.getElementById(EYE_PAD_SHIELD_SCROLL_PAGE);
  if (!page) return Promise.resolve();
  if (pendingPadShieldPages.has(page)) return pendingPadShieldPages.get(page);
  // A WebKit hash refresh can replace the fragment while imports are pending.
  // Serialise initialisation and coalesce requests for the same live page.
  const task = padShieldInitialization
    .catch(() => {})
    .then(async () => {
      const { initializeChildhoodFundalReflexScrollPage } =
        await import("./childhoodFundalPreparation.js");
      if (
        document.body.dataset.currentRoute !== "eyePadShield" ||
        document.getElementById(EYE_PAD_SHIELD_SCROLL_PAGE) !== page ||
        page.style.display === "none"
      )
        return;
      await initializeChildhoodFundalReflexScrollPage(
        EYE_PAD_SHIELD_SCROLL_ROUTE,
      );
    });
  padShieldInitialization = task;
  pendingPadShieldPages.set(page, task);
  return task.finally(() => pendingPadShieldPages.delete(page));
}

// The engine owns playback and cleanup; this route owns earned progress.
document.addEventListener("childhoodWorkshop:route-complete", (event) => {
  if (event.detail?.target === EYE_PAD_SHIELD_SCROLL_PAGE)
    setLessonProgress(EYE_PAD_SHIELD_SCROLL_PAGE, 100);
});
document.addEventListener(LESSON_PROGRESS_EVENT, () => {
  updateLessonProgressRows(document.getElementById("eyePadShield"));
});
let scrollUpdateQueued = false;
function syncPadShieldScrollProgress() {
  if (scrollUpdateQueued) return;
  scrollUpdateQueued = true;
  requestAnimationFrame(() => {
    scrollUpdateQueued = false;
    const page = document.getElementById(EYE_PAD_SHIELD_SCROLL_PAGE);
    if (
      document.body.dataset.currentRoute !== "eyePadShield" ||
      !page ||
      page.style.display === "none"
    )
      return;
    const host = document.getElementById("page-content");
    const containerScrolls = host && host.scrollHeight > host.clientHeight + 1;
    const scrollTop = containerScrolls ? host.scrollTop : window.scrollY;
    const range = containerScrolls
      ? host.scrollHeight - host.clientHeight
      : document.documentElement.scrollHeight - window.innerHeight;
    if (range > 1)
      setLessonProgress(
        EYE_PAD_SHIELD_SCROLL_PAGE,
        Math.min(95, (95 * scrollTop) / range),
      );
  });
}
window.addEventListener("scroll", syncPadShieldScrollProgress, {
  passive: true,
});
window.addEventListener("resize", syncPadShieldScrollProgress, {
  passive: true,
});
document.addEventListener("scroll", syncPadShieldScrollProgress, {
  passive: true,
  capture: true,
});

function showProcedurePage(id) {
  if (typeof window.showPage === "function") window.showPage(id);
  else {
    window.minimalShowPage(id);
    document.dispatchEvent(new CustomEvent("page:shown", { detail: { id } }));
  }
}

function translatedSpan(key, fallback, className) {
  const span = document.createElement("span");
  span.dataset.i18n = key;
  span.textContent = window.I18N?.t?.(key, fallback) || fallback;
  span.className = className;
  return span;
}

function lessonRow(key, type, activate) {
  const row = document.createElement("button");
  row.type = "button";
  row.className = `lesson-row lesson-row--${type}`;
  row.dataset.lesson = `pec-${key.replaceAll("_", "-")}`;
  const thumb = document.createElement("div");
  thumb.className = "thumb";
  thumb.setAttribute("aria-hidden", "true");
  const main = document.createElement("div");
  main.className = "lesson-main";
  const top = document.createElement("div");
  top.className = "lesson-top";
  top.append(
    translatedSpan(
      `pecWorkshop.${key}`,
      key.replaceAll("_", " "),
      "lesson-type",
    ),
  );
  main.append(top);
  row.append(
    thumb,
    main,
    translatedSpan(
      `pecWorkshop.${type === "folder" ? "see_all" : "watch"}`,
      type === "folder" ? "See all >" : "Watch >",
      "lesson-cta",
    ),
  );
  row.addEventListener("click", activate);
  return row;
}

export async function initializeEyeCareProcedure(route) {
  const procedure = EYE_CARE_PROCEDURES[route];
  const root = document.getElementById("eyeCareProcedurePage");
  if (!procedure || !root || document.body.dataset.currentRoute !== route)
    return;
  root.id = route;
  const cap = root.querySelector(".eye-care-procedure-cap");
  cap.dataset.i18n = procedure.titleKey;
  cap.textContent = procedure.label;
  const lessons = root.querySelector(".eye-care-procedure-lessons");
  const videoTemplate = document.getElementById(
    "eyeCareProcedureVideoTemplate",
  );
  const videoRows = document.createElement("div");
  videoRows.className = "eye-care-procedure-video-rows";
  procedure.videos.forEach((key) => {
    const videoPage = videoTemplate.content.firstElementChild.cloneNode(true);
    videoPage.id = `eyeCareVideo-${key}`;
    const category = videoPage.querySelector(
      ".eye-care-procedure-video-category",
    );
    category.dataset.i18n = procedure.titleKey;
    category.textContent = procedure.label;
    root.parentElement.append(videoPage);
    const row = lessonRow(key, "video", async () => {
      await loadPage(route, { subPageId: videoPage.id });
      renderProcedureVideo(key, videoPage.id);
    });
    row.dataset.pecVideo = key;
    videoRows.append(row);
    if (route === "eyePadShield" && key === "make_eye_pad") {
      const scrollTemplate = document.getElementById(
        "eyePadShieldScrollTemplate",
      );
      root.parentElement.append(
        scrollTemplate.content.firstElementChild.cloneNode(true),
      );
      const scrollRow = lessonRow(key, "scroll", async () => {
        primeExaminationNarration(EYE_PAD_SHIELD_SCROLL_PAGE, "en");
        await loadPage(route, { subPageId: EYE_PAD_SHIELD_SCROLL_PAGE });
        await initializePadShieldScroll();
      });
      scrollRow.dataset.lesson = "make-eye-pad-shield-scroll";
      scrollRow.dataset.target = EYE_PAD_SHIELD_SCROLL_PAGE;
      const title = scrollRow.querySelector(".lesson-type");
      title.id = "eyePadShield-scroll-lesson-title";
      const cta = scrollRow.querySelector(".lesson-cta");
      cta.removeAttribute("data-i18n");
      cta.replaceChildren(
        translatedSpan("auto.diabeticretinopathyworkshop.scroll", "scroll", ""),
        document.createTextNode(" >"),
      );
      const progress = document.createElement("div");
      progress.className = "lesson-progress";
      progress.setAttribute("role", "progressbar");
      progress.setAttribute("aria-labelledby", title.id);
      progress.setAttribute("aria-valuemin", "0");
      progress.setAttribute("aria-valuemax", "100");
      progress.setAttribute("aria-valuenow", "0");
      const fill = document.createElement("div");
      fill.className = "lesson-progress__fill";
      progress.append(fill);
      scrollRow.querySelector(".lesson-main").append(progress);
      videoRows.append(scrollRow);
    }
  });

  if (procedure.folder) {
    const folder = lessonRow(procedure.folder, "folder", () => {
      folder.hidden = true;
      folder.setAttribute("aria-expanded", "true");
      panel.hidden = false;
    });
    folder.dataset.nestedFolder = "lidHygiene";
    folder.setAttribute("aria-expanded", "false");
    folder.setAttribute("aria-controls", "eyeCareLidHygieneLessons");
    const panel = document.createElement("div");
    panel.id = "eyeCareLidHygieneLessons";
    panel.className = "eye-care-procedure-folder-content";
    panel.hidden = true;
    const heading = document.createElement("h2");
    heading.append(
      translatedSpan(`pecWorkshop.${procedure.folder}`, procedure.label, ""),
    );
    const close = document.createElement("button");
    close.type = "button";
    close.className = "see-all-toggle";
    close.append(translatedSpan("pecWorkshop.close", "Close ^", ""));
    close.addEventListener("click", () => {
      panel.hidden = true;
      folder.hidden = false;
      folder.setAttribute("aria-expanded", "false");
      folder.focus();
    });
    heading.append(close);
    panel.append(heading, videoRows);
    lessons.append(folder, panel);
  } else lessons.append(videoRows);

  root.parentElement.querySelectorAll(".menuBtn").forEach((button) => {
    button.addEventListener("click", openMenu);
    button.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      button.click();
    });
  });
  window.I18N?.applyTranslations?.(root.parentElement);
  updateLessonProgressRows(root);
  const requested = getRouteFromHash()?.subPageId;
  const videoKey = procedure.videos.find(
    (key) => requested === `eyeCareVideo-${key}`,
  );
  if (route === "eyePadShield" && requested === EYE_PAD_SHIELD_SCROLL_PAGE) {
    showProcedurePage(requested);
    await initializePadShieldScroll();
  } else if (videoKey) {
    if (procedure.folder) lessons.querySelector("[data-nested-folder]").click();
    showProcedurePage(requested);
    renderProcedureVideo(videoKey, requested);
  } else showProcedurePage(route);
}
