import { EYE_CARE_PROCEDURES } from "./eyeCareProcedureData.js";
import { getRouteFromHash, loadPage } from "./navigation.js";
import { openMenu } from "./menu.js";
import { renderProcedureVideo } from "./pecWorkshop.js";

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

export function initializeEyeCareProcedure(route) {
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
  const requested = getRouteFromHash()?.subPageId;
  const videoKey = procedure.videos.find(
    (key) => requested === `eyeCareVideo-${key}`,
  );
  if (videoKey) {
    if (procedure.folder) lessons.querySelector("[data-nested-folder]").click();
    showProcedurePage(requested);
    renderProcedureVideo(videoKey, requested);
  } else showProcedurePage(route);
}
