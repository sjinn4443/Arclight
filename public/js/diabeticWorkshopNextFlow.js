import { loadPage } from "./navigation.js";

const NEXT_HOST_CLASS = "diabetic-next-host";
const RESTORE_OPEN_KEY = "diabeticWorkshop:restoreOpenFolder";
const OPEN_FOLDER_KEY = "diabeticWorkshop:openFolderKey";
const FOCUS_SELECTOR_KEY = "diabeticWorkshop:focusSelector";

const VIDEO_NAV_CONFIG = {
  diabeticIntroductionToArclightVideoPage: {
    folderKey: "introduction",
    previousFocusSelector: '.lesson-row[data-lesson="arclight-package"]',
    nextFocusSelector: '.lesson-row[data-lesson="screening-in-ncd-clinics"]',
  },
};

let diabeticNextInfraWired = false;

function resetViewportToTop() {
  try {
    const pageContent = document.getElementById("page-content");
    if (pageContent) pageContent.scrollTop = 0;
  } catch {
    /* ignore scroll reset failures */
  }

  try {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  } catch {
    /* ignore scroll reset failures */
  }
}

function removeNextButtons() {
  document.querySelectorAll(".diabetic-next-wrap").forEach((el) => {
    try {
      el.parentElement?.classList.remove(NEXT_HOST_CLASS);
    } catch {
      /* ignore host cleanup failures */
    }
    el.remove();
  });
}

function getVisiblePageId() {
  const pages = Array.from(document.querySelectorAll(".page"));
  const visible = pages.find((page) => {
    if (!page?.id) return false;
    return getComputedStyle(page).display !== "none";
  });
  return visible?.id || "";
}

async function navigateToWorkshopSection(folderKey, focusSelector) {
  try {
    sessionStorage.setItem(RESTORE_OPEN_KEY, "1");
    sessionStorage.setItem(OPEN_FOLDER_KEY, folderKey);
    if (focusSelector) {
      sessionStorage.setItem(FOCUS_SELECTOR_KEY, focusSelector);
    } else {
      sessionStorage.removeItem(FOCUS_SELECTOR_KEY);
    }
  } catch {
    /* ignore session storage failures */
  }

  removeNextButtons();
  await loadPage("diabeticRetinopathyWorkshop");
  resetViewportToTop();
}

function renderNextButtonForTarget(targetId) {
  const config = VIDEO_NAV_CONFIG[targetId];
  if (!config) {
    removeNextButtons();
    return;
  }

  const page = document.getElementById(targetId);
  if (!page) return;

  removeNextButtons();

  const host =
    page.querySelector(".container.pupils-container") ||
    page.querySelector(".container") ||
    page;
  host.classList.add(NEXT_HOST_CLASS);

  const wrap = document.createElement("div");
  wrap.className = "diabetic-next-wrap";

  const previousBtn = document.createElement("button");
  previousBtn.type = "button";
  previousBtn.className = "diabetic-prev-btn";
  previousBtn.textContent = "< Previous";
  previousBtn.setAttribute("data-i18n", "i18nLiteral.< Previous");
  previousBtn.addEventListener("click", async () => {
    await navigateToWorkshopSection(
      config.folderKey,
      config.previousFocusSelector,
    );
  });

  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "diabetic-next-btn is-ready";
  nextBtn.textContent = "Next >";
  nextBtn.setAttribute("data-i18n", "i18nLiteral.Next >");
  nextBtn.addEventListener("click", async () => {
    await navigateToWorkshopSection(config.folderKey, config.nextFocusSelector);
  });

  wrap.appendChild(previousBtn);
  wrap.appendChild(nextBtn);
  host.appendChild(wrap);
  window.I18N?.applyTranslations?.(wrap);
}

export function initializeDiabeticWorkshopNextFlowInfra() {
  if (diabeticNextInfraWired) return;
  diabeticNextInfraWired = true;

  document.addEventListener("page:shown", (event) => {
    const shownId = String(event.detail?.id || "");
    if (!shownId) return;
    renderNextButtonForTarget(shownId);
  });

  window.addEventListener("page:loaded", (event) => {
    const routeName = String(event.detail?.routeName || "");
    if (routeName === "diabeticRetinopathyWorkshop") {
      removeNextButtons();
      return;
    }

    if (routeName === "videos") {
      const visibleId = getVisiblePageId();
      renderNextButtonForTarget(visibleId);
      return;
    }

    removeNextButtons();
  });

  renderNextButtonForTarget(getVisiblePageId());
}
