import { loadPage } from "./navigation.js";
import { openMenu } from "./menu.js";
import { initializeDiabeticScreeningScrollLessons } from "./diabeticRetinopathyWorkshop.js";
import {
  beginPrimaryWorkshopLesson,
  initializePrimaryWorkshopProgress,
  updateActivePrimaryWorkshopLesson,
  refreshPrimaryWorkshopProgress,
} from "./primaryWorkshopProgress.js";
import { initializePaediatricEarQuiz } from "./paediatricEarQuiz.js";
import {
  PAEDIATRIC_ROUTE as ROUTE,
  PAEDIATRIC_PAGE as PAGE,
  PAEDIATRIC_COPY_PREFIX as COPY_PREFIX,
  PAEDIATRIC_COPY as COPY,
  PAEDIATRIC_LESSONS as LESSONS,
  PAEDIATRIC_LOCAL_PAGES as LOCAL_PAGES,
} from "./paediatricWorkshopData.js";

const ACTIVE_KEY = `${ROUTE}:activeLesson`;
const RESTORE_KEY = `${ROUTE}:restore`;
let wired = false;
let busy = false;
let scheduled = false;

function read(storage, key, fallback = null) {
  try {
    return JSON.parse(storage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
function write(storage, key, value) {
  try {
    if (value == null) storage.removeItem(key);
    else storage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage is optional */
  }
}
function t(key) {
  return (
    window.I18N?.t?.(`${COPY_PREFIX}.${key}`, COPY[key] || key) ||
    COPY[key] ||
    key
  );
}
function commonNode(tag, key, fallback) {
  const node = document.createElement(tag);
  node.dataset.i18n =
    key === "previous" ? "i18nLiteral.Previous" : "i18nLiteral.Next";
  node.textContent = window.I18N?.t?.(node.dataset.i18n, fallback) || fallback;
  return node;
}
function hydrate(page) {
  page.querySelectorAll("[data-paediatric-common]").forEach((node) => {
    node.dataset.i18n = `primaryEarCareWorkshop.${node.dataset.paediatricCommon}`;
  });
  page.querySelectorAll("[data-paediatric-copy]").forEach((node) => {
    node.dataset.i18n = `${COPY_PREFIX}.${node.dataset.paediatricCopy}`;
    node.textContent = t(node.dataset.paediatricCopy);
  });
  page.querySelectorAll("[data-paediatric-alt]").forEach((node) => {
    node.dataset.i18n = `${COPY_PREFIX}.${node.dataset.paediatricAlt}:alt`;
    node.alt = t(node.dataset.paediatricAlt);
  });
  window.I18N?.applyTranslations?.(page);
}
function visible(node) {
  return (
    node?.isConnected &&
    getComputedStyle(node).display !== "none" &&
    getComputedStyle(node).visibility !== "hidden"
  );
}
function entryFor(id) {
  return LESSONS.find((entry) => entry.id === id && !entry.unavailable);
}
function activeEntry() {
  return entryFor(read(sessionStorage, ACTIVE_KEY)?.id);
}

function showFolders(page, path = {}) {
  if (!page) return;
  page
    .querySelectorAll(".pec-section-card, .pec-nested-section-card")
    .forEach((card) => {
      card.hidden = true;
      card.classList.remove("pec-nested-folder-open");
    });
  page
    .querySelectorAll(".pec-folder-row, .pec-nested-folder-row")
    .forEach((row) => {
      row.hidden = false;
      row.setAttribute("aria-expanded", "false");
    });
  page.classList.remove("pec-folder-open");
  const folder = page.querySelector(`[data-folder="${path.section}"]`);
  const card = page.querySelector(`[data-section="${path.section}"]`);
  if (!folder || !card) return;
  folder.hidden = true;
  folder.setAttribute("aria-expanded", "true");
  card.hidden = false;
  page.classList.add("pec-folder-open");
  const nestedRow = card.querySelector(`[data-nested-folder="${path.nested}"]`);
  const nestedCard = card.querySelector(
    `[data-nested-section="${path.nested}"]`,
  );
  if (nestedRow && nestedCard) {
    nestedRow.hidden = true;
    nestedRow.setAttribute("aria-expanded", "true");
    nestedCard.hidden = false;
    card.classList.add("pec-nested-folder-open");
  }
}

function removeNavigation() {
  document
    .querySelectorAll(".paediatric-flow-nav")
    .forEach((nav) => nav.remove());
  document
    .querySelectorAll(".paediatric-flow-target")
    .forEach((page) => page.classList.remove("paediatric-flow-target"));
}
function clearContext() {
  write(sessionStorage, ACTIVE_KEY, null);
  if (
    read(sessionStorage, "interactiveLearning:returnTarget")?.routeName ===
    ROUTE
  )
    write(sessionStorage, "interactiveLearning:returnTarget", null);
  removeNavigation();
}
function pauseCurrentMedia() {
  const entry = activeEntry();
  const page = entry && document.getElementById(entry.target);
  page?.querySelectorAll("video, audio").forEach((media) => media.pause());
}

async function returnToWorkshop() {
  if (busy) return;
  busy = true;
  const entry = activeEntry();
  const restore = entry
    ? { section: entry.folder, nested: entry.nested }
    : read(sessionStorage, RESTORE_KEY, {});
  pauseCurrentMedia();
  clearContext();
  try {
    await loadPage(ROUTE, {
      subPageId: PAGE,
      replace: true,
      recordHistory: false,
    });
    initializePaediatricSurgicalEyeEarWorkshop();
    const page = document.getElementById(PAGE);
    write(sessionStorage, RESTORE_KEY, restore);
    showFolders(page, restore);
    const row =
      entry && page?.querySelector(`[data-paediatric-lesson="${entry.id}"]`);
    row?.focus({ preventScroll: true });
    row?.scrollIntoView({ block: "nearest" });
  } finally {
    busy = false;
    scheduleNavigation();
  }
}
function lessonContext(entry) {
  return {
    workshop: ROUTE,
    key: entry.id,
    route: entry.route,
    target: entry.target,
    type: entry.type,
    externalTarget: entry.earLesson ? null : entry.target,
    progressTarget: entry.route === ROUTE ? entry.target : null,
  };
}
async function showIntermediateCase(entry) {
  const { initializeCaseStudy } = await import("./casestudy.js");
  initializeCaseStudy();
  await new Promise((resolve) => requestAnimationFrame(resolve));
  document.getElementById("caseStudyIntermediateCard")?.click();
  await loadPage("casestudy", { subPageId: entry.target });
  const page = document.getElementById(entry.target);
  if (page) page.dataset.paediatricCaseOpened = "1";
}
async function restoreIntermediateCase(entry) {
  if (busy) return;
  busy = true;
  try {
    await showIntermediateCase(entry);
  } finally {
    busy = false;
    scheduleNavigation();
  }
}
async function openLesson(id) {
  const entry = entryFor(id);
  if (!entry || busy) return;
  busy = true;
  pauseCurrentMedia();
  removeNavigation();
  write(sessionStorage, ACTIVE_KEY, { id });
  write(sessionStorage, RESTORE_KEY, {
    section: entry.folder,
    nested: entry.nested,
  });
  // Previous workshop contexts must not take ownership of this shared launch.
  [
    "pecWorkshop:activeEntry",
    "pecWorkshop:externalReuse",
    "pecWorkshop:medicalReuse",
    "medicalStudentsWorkshop:nextFlowEnabled",
    "videos:contextualReturn:v1",
    "interactiveLearning:returnTarget",
  ].forEach((key) => {
    write(sessionStorage, key, null);
  });
  beginPrimaryWorkshopLesson(lessonContext(entry));
  // Embedded mini-app Back buttons consume the host's existing return bridge.
  if (entry.route === "videos" && entry.type === "interactive") {
    write(sessionStorage, "interactiveLearning:returnTarget", {
      routeName: ROUTE,
      subPageId: PAGE,
    });
  }
  try {
    if (entry.earLesson) {
      const { openPrimaryEarCareSharedLesson } =
        await import("./primaryEarCareWorkshop.js");
      await openPrimaryEarCareSharedLesson(entry.earLesson);
    } else if (entry.caseStudy) {
      await loadPage("casestudy", { subPageId: "casestudyPage" });
      await showIntermediateCase(entry);
    } else {
      const reuseVideos =
        entry.route === "videos" &&
        document.body.dataset.currentRoute === "videos";
      await loadPage(entry.route, { subPageId: entry.target });
      if (reuseVideos) {
        const { showVideosPageById } = await import("./videos.js");
        showVideosPageById(entry.target);
      }
    }
    if (entry.route === ROUTE) initializePaediatricSurgicalEyeEarWorkshop();
    ensureNavigation();
    window.scrollTo(0, 0);
    updateActivePrimaryWorkshopLesson();
  } finally {
    busy = false;
    scheduleNavigation();
  }
}
async function navigateAdjacent(entry, direction) {
  const group = LESSONS.filter(
    (item) =>
      !item.unavailable &&
      item.folder === entry.folder &&
      item.nested === entry.nested,
  );
  const next =
    group[group.findIndex((item) => item.id === entry.id) + direction];
  if (next) await openLesson(next.id);
  else await returnToWorkshop();
}
function ensureNavigation() {
  let entry = activeEntry();
  const route = document.body.dataset.currentRoute;
  if (!entry && route === ROUTE) {
    entry = LESSONS.find(
      (item) =>
        item.route === ROUTE && visible(document.getElementById(item.target)),
    );
    if (entry) {
      write(sessionStorage, ACTIVE_KEY, { id: entry.id });
      write(sessionStorage, RESTORE_KEY, {
        section: entry.folder,
        nested: entry.nested,
      });
      beginPrimaryWorkshopLesson(lessonContext(entry));
    }
  }
  if (!entry || route !== entry.route) return;
  const page = document.getElementById(entry.target);
  if (entry.caseStudy && page && page.dataset.paediatricCaseOpened !== "1") {
    void restoreIntermediateCase(entry);
    return;
  }
  if (!visible(page)) return;
  page.classList.add("paediatric-flow-target");
  const host =
    page.querySelector(".container.pupils-container") ||
    page.querySelector(".container") ||
    page;
  const old = host.querySelector(".paediatric-flow-nav");
  if (old?.dataset.lesson === entry.id) return;
  old?.remove();
  const nav = document.createElement("nav");
  nav.className = "pec-flow-nav paediatric-flow-nav";
  nav.dataset.lesson = entry.id;
  nav.setAttribute(
    "aria-label",
    window.I18N?.t?.(
      "primaryEarCareWorkshop.lesson_navigation",
      "Lesson navigation",
    ) || "Lesson navigation",
  );
  const previous = document.createElement("button");
  previous.type = "button";
  previous.className = "pec-flow-prev";
  previous.append(
    document.createTextNode("< "),
    commonNode("span", "previous", "Previous"),
  );
  previous.addEventListener("click", () => void navigateAdjacent(entry, -1));
  const next = document.createElement("button");
  next.type = "button";
  next.className = "pec-flow-next";
  next.append(
    commonNode("span", "next", "Next"),
    document.createTextNode(" >"),
  );
  next.addEventListener("click", () => void navigateAdjacent(entry, 1));
  nav.append(previous, next);
  host.append(nav);
  window.I18N?.applyTranslations?.(nav);
}
function scheduleNavigation() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    if (!busy) ensureNavigation();
  });
}

export function initializePaediatricWorkshopFlowInfra() {
  if (wired) return;
  wired = true;
  window.addEventListener(
    "click",
    (event) => {
      if (!event.target.closest?.("#backBtnGlobal, #caseChatBackBtn")) return;
      const entry = activeEntry();
      const isLesson =
        entry &&
        document.body.dataset.currentRoute === entry.route &&
        visible(document.getElementById(entry.target));
      if (!isLesson) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      void returnToWorkshop();
    },
    true,
  );
  window.addEventListener("page:loaded", (event) => {
    const route = event.detail?.routeName;
    if (route && route !== document.body.dataset.currentRoute) return;
    const entry = activeEntry();
    if (!busy && route !== ROUTE && route !== entry?.route) {
      clearContext();
      write(sessionStorage, RESTORE_KEY, null);
    }
    scheduleNavigation();
  });
  document.addEventListener("page:shown", (event) => {
    if (event.detail?.id === PAGE) clearContext();
    scheduleNavigation();
  });
  // Shared quizzes/videos can replace their content after the route event.
  // Reconcile the caller's controls after those asynchronous renders too.
  const mount = document.getElementById("page-content");
  if (mount) {
    new MutationObserver(() => {
      if (activeEntry()) scheduleNavigation();
    }).observe(mount, { childList: true, subtree: true });
  }
  // On shared-page reload the primary progress module restores its own active
  // context. Reinstall only the new workshop's navigation, never change the page.
  if (activeEntry()) beginPrimaryWorkshopLesson(lessonContext(activeEntry()));
  scheduleNavigation();
}

export function initializePaediatricSurgicalEyeEarWorkshop() {
  initializePaediatricWorkshopFlowInfra();
  const page = document.getElementById(PAGE);
  if (!page) return;
  if (page.dataset.inited !== "1") {
    page.dataset.inited = "1";
    page
      .querySelectorAll("[data-folder], [data-nested-folder]")
      .forEach((row) => {
        const action = () => {
          const section =
            row.dataset.folder || row.closest("[data-section]").dataset.section;
          const path = { section, nested: row.dataset.nestedFolder || null };
          write(sessionStorage, RESTORE_KEY, path);
          showFolders(page, path);
          const card = document.getElementById(
            row.getAttribute("aria-controls"),
          );
          card
            ?.querySelector(".see-all-toggle")
            ?.focus({ preventScroll: true });
        };
        row.addEventListener("click", action);
        row.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            action();
          }
        });
      });
    page.querySelectorAll("[data-paediatric-close]").forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest("[data-nested-section], [data-section]");
        const nested = card.dataset.nestedSection;
        const path = nested
          ? { section: card.closest("[data-section]").dataset.section }
          : {};
        write(sessionStorage, RESTORE_KEY, path);
        showFolders(page, path);
        page
          .querySelector(
            nested
              ? `[data-nested-folder="${nested}"]`
              : `[data-folder="${card.dataset.section}"]`,
          )
          ?.focus({ preventScroll: true });
      });
    });
    page
      .querySelectorAll("[data-paediatric-lesson]:not([aria-disabled])")
      .forEach((row) => {
        const action = () => void openLesson(row.dataset.paediatricLesson);
        row.addEventListener("click", action);
        row.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            action();
          }
        });
      });
  }
  hydrate(page);
  Object.keys(LOCAL_PAGES).forEach((id) => {
    const local = document.getElementById(id);
    if (!local) return;
    hydrate(local);
    if (local.dataset.inited === "1") return;
    local.dataset.inited = "1";
    if (LOCAL_PAGES[id].quiz) initializePaediatricEarQuiz(local);
  });
  document
    .querySelectorAll(
      ".paediatric-workshop-page .menuBtn, .paediatric-scrolly-page .menuBtn, .paediatric-quiz-page .menuBtn",
    )
    .forEach((button) => {
      if (button.dataset.paediatricMenuWired) return;
      button.dataset.paediatricMenuWired = "1";
      button.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openMenu();
        }
      });
    });
  initializePrimaryWorkshopProgress(ROUTE);
  showFolders(page, read(sessionStorage, RESTORE_KEY, {}));
  initializeDiabeticScreeningScrollLessons();
  refreshPrimaryWorkshopProgress();
  scheduleNavigation();
}
