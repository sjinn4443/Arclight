// public/js/childhoodEyeScreeningWorkshop.js
import { loadPage } from "./navigation.js";
import {
  initializeChildhoodWorkshopProgressInfra,
  updateChildhoodWorkshopProgressBars,
} from "./childhoodWorkshopProgress.js";
import {
  assignChildhoodWorkshopFlowIndices,
  initializeChildhoodWorkshopNextFlowInfra,
  rememberChildhoodWorkshopFlowFromRow,
} from "./childhoodWorkshopNextFlow.js";

function normaliseVideosSubpageId(raw) {
  if (!raw) return "";

  let t = String(raw).trim();

  // allow "#fundalExamPage" style
  if (t.startsWith("#")) t = t.slice(1);

  // If workshop uses short aliases, map them to the real ids in videos.html
  const ALIASES = {
    visualAcuity: "visualAcuityPage",
    vaWho: "vaWhoPage",
    vaNearVision: "vaNearVisionPage",
    mumVision: "mumVisionPage",

    fundalReflex: "fundalReflexPage",
    fundalExam: "fundalExamPage",
    fundalStill: "fundalStillPage",
    fundalReal: "fundalRealPage",

    pupils: "pupilsPage",
    pupilExamPEC: "pupilExamPECPage",
    pupilFullExam: "pupilFullExamPage",
    pupilPathways: "pupilPathwaysPage",

    rapdTestVideo: "rapdTestVideoPage",
    directOphthalmoscopy: "directOphthalmoscopyVideoPage",
    directOphthalmoscopyVideo: "directOphthalmoscopyVideoPage",

    childhoodEyeScreening: "childhoodEyeScreeningPage",
    howToArclight: "howToArclightPage",
    assessmentVision: "assessmentVisionPage",
    normalAbnormal: "normalAbnormalPage",
    frontOfEye: "frontOfEyePage",
    assessingVisualFunction: "assessingVisualFunctionPage",
  };

  if (ALIASES[t]) return ALIASES[t];

  // If it already looks like a real id, keep it
  if (t.endsWith("Page")) return t;

  // Common case: workshop uses "fundalExam" but videos.html uses "fundalExamPage"
  return `${t}Page`;
}

function showPageWithFallbackAndEvent(id) {
  if (!id) return false;

  const el = document.getElementById(id);
  if (!el) return false;

  const hasShowPage = typeof window.showPage === "function";
  const needsManualDispatch =
    !hasShowPage || window.__pageShownPatched !== true;

  if (typeof window.showPage === "function") {
    window.showPage(id);
  } else {
    document.querySelectorAll(".page").forEach((p) => {
      p.style.display = "none";
    });
    el.style.display = "block";
  }

  if (needsManualDispatch) {
    document.dispatchEvent(new CustomEvent("page:shown", { detail: { id } }));
  }
  return true;
}

function refreshWorkshopTranslations(root = document) {
  window.I18N?.applyTranslations?.(root);
}

const NUMBERED_CHILDHOOD_LABEL_KEYS = [
  "auto.childhoodeyescreeningworkshop.the_visual_system",
  "auto.childhoodeyescreeningworkshop.visual_development",
  "auto.childhoodeyescreeningworkshop.causes_of_visual_impairment",
  "auto.childhoodeyescreeningworkshop.signs_of_visual_impairment",
  "auto.childhoodeyescreeningworkshop.childhood_eye_screening",
];

function stripLeadingStepNumber(text) {
  return String(text || "").replace(/^\s*\d+\.\s*/, "");
}

function normalizeChildhoodWorkshopLabels(root = document) {
  const selector = NUMBERED_CHILDHOOD_LABEL_KEYS.map(
    (key) => `[data-i18n="${key}"]`,
  ).join(", ");
  if (!selector) return;

  root.querySelectorAll(selector).forEach((el) => {
    // Keep numeric prefixes only for the collapsed folder buttons.
    if (el.closest("#childhoodWorkshopFolders .childhood-folder-row")) return;
    const next = stripLeadingStepNumber(el.textContent);
    if (next !== el.textContent) el.textContent = next;
  });

  const cap = root.querySelector(
    "#childhoodEyeScreeningWorkshopPage .pupil-level__cap--childhood-workshop",
  );
  if (cap) {
    const next = stripLeadingStepNumber(cap.textContent);
    if (next !== cap.textContent) cap.textContent = next;
  }
}

function countTopLevelSectionRows(sectionCard) {
  if (!sectionCard) return 0;
  return Array.from(sectionCard.children).filter((child) =>
    child.classList?.contains("lesson-row"),
  ).length;
}

function updateWorkshopFolderItemBadges(page) {
  const rows = page.querySelectorAll(
    "#childhoodWorkshopFolders .childhood-folder-row[data-folder]",
  );

  rows.forEach((row) => {
    const sectionKey = row.getAttribute("data-folder");
    if (!sectionKey) return;

    const sectionCard = page.querySelector(
      `.childhood-section-card[data-section="${sectionKey}"]`,
    );
    const itemCount = countTopLevelSectionRows(sectionCard);
    const thumb = row.querySelector(".thumb");
    if (!thumb) return;

    let badge = thumb.querySelector(".childhood-folder-item-count");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "childhood-folder-item-count";
      badge.setAttribute("aria-hidden", "true");
      thumb.appendChild(badge);
    }
    badge.textContent = String(itemCount);
    row.setAttribute("data-item-count", String(itemCount));
  });
}

function updateFundalReflexFolderItemBadge(page) {
  const folderRow = page.querySelector("#fundalReflexFolderRow");
  const subRowsContainer = page.querySelector("#fundalReflexSubRows");
  if (!folderRow || !subRowsContainer) return;

  const itemCount = Array.from(subRowsContainer.children).filter((child) =>
    child.classList?.contains("lesson-row"),
  ).length;

  const thumb = folderRow.querySelector(".thumb");
  if (!thumb) return;

  let badge = thumb.querySelector(".childhood-folder-item-count");
  if (itemCount <= 0) {
    if (badge) badge.remove();
    folderRow.removeAttribute("data-item-count");
    return;
  }

  if (!badge) {
    badge = document.createElement("span");
    badge.className = "childhood-folder-item-count";
    badge.setAttribute("aria-hidden", "true");
    thumb.appendChild(badge);
  }

  badge.textContent = String(itemCount);
  folderRow.setAttribute("data-item-count", String(itemCount));
}

function setupWorkshopFolders(page) {
  const folders = page.querySelectorAll(
    "#childhoodWorkshopFolders .childhood-folder-row",
  );
  const sectionCards = page.querySelectorAll(".childhood-section-card");

  const foldersContainer = page.querySelector("#childhoodWorkshopFolders");
  if (!foldersContainer) return;
  updateWorkshopFolderItemBadges(page);
  updateFundalReflexFolderItemBadge(page);

  const SS_OPEN_KEY = "childhoodWorkshop:openFolderKey";
  const SS_RESTORE_FLAG = "childhoodWorkshop:restoreOpenFolder";

  const ssGet = (k) => {
    try {
      return sessionStorage.getItem(k);
    } catch {
      return null;
    }
  };

  const ssSet = (k, v) => {
    try {
      sessionStorage.setItem(k, v);
    } catch {}
  };

  const ssRemove = (k) => {
    try {
      sessionStorage.removeItem(k);
    } catch {}
  };

  const hideAllSectionCards = () => {
    sectionCards.forEach((card) => {
      card.style.display = "none";

      const titleEl = card.querySelector("h3");
      if (!titleEl) return;

      const existingToggle = titleEl.querySelector(".see-all-toggle");
      if (existingToggle) existingToggle.remove();
    });
  };

  const showSectionByKey = (key) => {
    const card = page.querySelector(
      `.childhood-section-card[data-section="${key}"]`,
    );
    if (!card) return;

    const openFolderRow = page.querySelector(
      `#childhoodWorkshopFolders .childhood-folder-row[data-folder="${key}"]`,
    );
    if (!openFolderRow) return;

    hideAllSectionCards();
    folders.forEach((r) => (r.style.display = ""));

    openFolderRow.style.display = "none";
    ssSet(SS_OPEN_KEY, key);
    page.classList.add("childhood-folder-open");

    openFolderRow.insertAdjacentElement("afterend", card);
    card.style.display = "";

    const titleEl = card.querySelector("h3");
    if (!titleEl) return;

    refreshWorkshopTranslations(titleEl);
    titleEl.textContent = stripLeadingStepNumber(titleEl.textContent);

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
    toggle.style.marginRight = "15px";
    toggle.style.whiteSpace = "nowrap";

    const closeNow = (e) => {
      e.preventDefault();
      e.stopPropagation();

      card.style.display = "none";

      const existingToggle = titleEl.querySelector(".see-all-toggle");
      if (existingToggle) existingToggle.remove();

      openFolderRow.style.display = "";
      ssRemove(SS_OPEN_KEY);
      ssRemove(SS_RESTORE_FLAG);
      page.classList.remove("childhood-folder-open");
    };

    toggle.addEventListener("click", closeNow);
    toggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") closeNow(e);
    });

    titleEl.appendChild(toggle);
  };

  hideAllSectionCards();
  folders.forEach((r) => (r.style.display = ""));
  foldersContainer.style.display = "";
  page.classList.remove("childhood-folder-open");

  const shouldRestore = ssGet(SS_RESTORE_FLAG) === "1";
  const savedKey = ssGet(SS_OPEN_KEY);

  if (shouldRestore && savedKey) {
    ssRemove(SS_RESTORE_FLAG);
    showSectionByKey(savedKey);
  } else {
    ssRemove(SS_OPEN_KEY);
    ssRemove(SS_RESTORE_FLAG);
    page.classList.remove("childhood-folder-open");
  }

  folders.forEach((row) => {
    if (row.dataset.wired === "1") return;
    row.dataset.wired = "1";

    const key = row.getAttribute("data-folder");
    if (!key) return;

    const openNow = (e) => {
      e.preventDefault();
      e.stopPropagation();
      showSectionByKey(key);
    };

    row.addEventListener("click", openNow);
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openNow(e);
    });
  });
}

function markRestoreOpenFolder() {
  try {
    sessionStorage.setItem("childhoodWorkshop:restoreOpenFolder", "1");
  } catch {}
}

let fundalWarmupScheduled = false;
const FUNDAL_EARLY_WARMUP_ROUTES = [
  "childhoodFundalPreparation",
  "childhoodFundalExamination",
  "childhoodFundalNewbornEyesOpen",
];
const FUNDAL_SCROLL_ROUTE_SET = new Set([
  "childhoodFundalPreparation",
  "childhoodFundalExamination",
  "childhoodFundalNewbornEyesOpen",
  "childhoodFundalNewbornEyesClosed",
  "childhoodFundalUnclearFindings",
  "childhoodFundalPossibleFinding",
  "childhoodFundalAfterExamination",
]);
const FUNDAL_TARGET_TO_ROUTE = {
  childhoodFundalPreparationPage: "childhoodFundalPreparation",
  childhoodFundalExaminationPage: "childhoodFundalExamination",
  childhoodFundalNewbornEyesOpenPage: "childhoodFundalNewbornEyesOpen",
  childhoodFundalNewbornEyesClosedPage: "childhoodFundalNewbornEyesClosed",
  childhoodFundalUnclearFindingsPage: "childhoodFundalUnclearFindings",
  childhoodFundalPossibleFindingPage: "childhoodFundalPossibleFinding",
  childhoodFundalAfterExaminationPage: "childhoodFundalAfterExamination",
};
const fundalIntentWarmupCache = new Set();

function isConstrainedMobileFundalWarmupDevice() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const isMobileViewport =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(max-width: 37.5em)").matches
      : Number(window.innerWidth || 0) <= 600;
  if (!isMobileViewport) return false;

  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  const effectiveType = String(connection?.effectiveType || "").toLowerCase();
  const saveDataEnabled = connection?.saveData === true;
  const isSlowNetwork =
    effectiveType.includes("2g") || effectiveType.includes("3g");

  const deviceMemory = Number(navigator.deviceMemory || 0);
  const isLowMemoryDevice =
    Number.isFinite(deviceMemory) && deviceMemory > 0 && deviceMemory <= 2;

  const cpuCores = Number(navigator.hardwareConcurrency || 0);
  const isLowCpuDevice =
    Number.isFinite(cpuCores) && cpuCores > 0 && cpuCores <= 4;

  return (
    saveDataEnabled || isSlowNetwork || isLowMemoryDevice || isLowCpuDevice
  );
}

function warmupFundalRouteOnIntent(routeName) {
  const normalized = String(routeName || "").trim();
  if (!FUNDAL_SCROLL_ROUTE_SET.has(normalized)) return;
  if (fundalIntentWarmupCache.has(normalized)) return;
  fundalIntentWarmupCache.add(normalized);

  void import("./childhoodFundalPreparation.js")
    .then((module) => {
      module.prewarmChildhoodFundalRouteAssets?.([normalized], {
        mode: "route",
        loadLottie: true,
      });
    })
    .catch((err) => {
      console.warn("[childhoodWorkshop] fundal intent warmup skipped", err);
    });
}

function scheduleFundalRouteWarmup() {
  if (fundalWarmupScheduled) return;
  fundalWarmupScheduled = true;
  const constrainedMobile = isConstrainedMobileFundalWarmupDevice();
  const warmupRoutes = constrainedMobile
    ? [FUNDAL_EARLY_WARMUP_ROUTES[0]]
    : FUNDAL_EARLY_WARMUP_ROUTES;

  const warmup = () => {
    void import("./childhoodFundalPreparation.js")
      .then((module) => {
        module.prewarmChildhoodFundalRouteAssets?.(warmupRoutes, {
          mode: "idle",
          // On constrained mobiles, avoid executing lottie during idle warmup.
          loadLottie: !constrainedMobile,
        });
      })
      .catch((err) => {
        console.warn("[childhoodWorkshop] fundal warmup skipped", err);
      });
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(() => warmup(), { timeout: 320 });
    return;
  }
  window.setTimeout(warmup, 80);
}

export function initializeChildhoodEyeScreeningWorkshop() {
  const page = document.getElementById("childhoodEyeScreeningWorkshopPage");
  if (!page) return;

  initializeChildhoodWorkshopProgressInfra();
  initializeChildhoodWorkshopNextFlowInfra();
  setupWorkshopFolders(page);
  assignChildhoodWorkshopFlowIndices(page);
  updateChildhoodWorkshopProgressBars();
  scheduleFundalRouteWarmup();
  normalizeChildhoodWorkshopLabels(document);
  if (typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(() =>
      normalizeChildhoodWorkshopLabels(document),
    );
  }

  const rows = page.querySelectorAll(".lesson-row[data-target]");
  rows.forEach((row) => {
    if (row.dataset.wired === "1") return;
    row.dataset.wired = "1";
    const rowTarget = String(row.getAttribute("data-target") || "").trim();
    const intentFundalRoute = FUNDAL_TARGET_TO_ROUTE[rowTarget];
    if (intentFundalRoute) {
      const onIntentWarmup = () => {
        warmupFundalRouteOnIntent(intentFundalRoute);
      };
      row.addEventListener("pointerdown", onIntentWarmup, { passive: true });
      row.addEventListener("touchstart", onIntentWarmup, { passive: true });
    }

    row.addEventListener("click", async (event) => {
      event.preventDefault();

      const targetRaw = row.getAttribute("data-target");
      if (!targetRaw) return;
      const explicitFundalRoute = FUNDAL_TARGET_TO_ROUTE[targetRaw];
      if (explicitFundalRoute) {
        warmupFundalRouteOnIntent(explicitFundalRoute);
      }

      rememberChildhoodWorkshopFlowFromRow(row);
      markRestoreOpenFolder();

      // ✅ quizzes that are separate routes
      if (
        targetRaw === "childhoodAssessmentPage" ||
        targetRaw === "childhoodAssessmentQuizPage"
      ) {
        await loadPage("childhoodAssessment");
        showPageWithFallbackAndEvent("childhoodAssessmentQuizPage");
        return;
      }
      if (targetRaw === "behavioursquizPage") {
        await loadPage("behavioursquiz");
        showPageWithFallbackAndEvent("behavioursquizPage");
        return;
      }

      // ✅ scroll/standalone pages that are separate routes (NOT videos subpages)
      // public/js/childhoodEyeScreeningWorkshop.js

      // ...중략...

      const DIRECT_ROUTES = {
        // Eye & Brain
        visualsystemeyesbrainPage: "visualsystemeyesbrain",
        childhoodEyeBrainImagesPage: "childhoodEyeBrainImages",

        // ✅ [ADD] Visual development + QnO도 childhoodEyeBrainImages route로!
        childhoodIntroVisualDevelopmentPage:
          "childhoodIntroVisualDevelopmentPage",
        childhoodNormalVisualDevelopmentPage:
          "childhoodNormalVisualDevelopmentPage",
        childhoodAskQuestionsObservePage: "childhoodAskQuestionsObservePage",
        childhoodFundalPreparationPage: "childhoodFundalPreparation",
        childhoodFundalExaminationPage: "childhoodFundalExamination",
        childhoodFundalNewbornEyesOpenPage: "childhoodFundalNewbornEyesOpen",
        childhoodFundalNewbornEyesClosedPage:
          "childhoodFundalNewbornEyesClosed",
        childhoodFundalUnclearFindingsPage: "childhoodFundalUnclearFindings",
        childhoodFundalPossibleFindingPage: "childhoodFundalPossibleFinding",
        childhoodFundalAfterExaminationPage: "childhoodFundalAfterExamination",

        // Signs of visual impairment → Cases
        signsVICasesPage: "signsVICases",

        // Childhood eye screening → Refer
        childhoodReferPage: "childhoodRefer",

        // PDFs
        atomsHandout1Page: "atomsHandout1",
        atomsHandout2Page: "atomsHandout2",
        fundalReflexPdfPage: "fundalReflexPdf",

        // (안전망)
        visualImpairmentPage: "visualImpairment",
      };

      if (DIRECT_ROUTES[targetRaw]) {
        const route = DIRECT_ROUTES[targetRaw];
        const fallbackId =
          targetRaw === "childhoodAssessmentPage"
            ? "childhoodAssessmentQuizPage"
            : targetRaw;
        const subPageId =
          route === "childhoodEyeBrainImages" ? fallbackId : null;
        if (FUNDAL_SCROLL_ROUTE_SET.has(route)) {
          warmupFundalRouteOnIntent(route);
        }
        await loadPage(route, subPageId ? { subPageId } : undefined);

        // ✅ 같은 route 안에 targetRaw 페이지 섹션이 있으면 그걸 정확히 보여주기
        if (!subPageId) {
          showPageWithFallbackAndEvent(fallbackId);
        }

        try {
          window.scrollTo(0, 0);
        } catch {}
        return;
      }

      // ✅ videos.html 안의 서브페이지(비디오)로 보내기
      const target = normaliseVideosSubpageId(targetRaw);

      // target이 비디오 페이지 id처럼 생겼으면 videos route로 이동해서 열기
      if (target && target.endsWith("Page")) {
        try {
          // videos.js가 사용하는 딥링크 방식에 맞춰 세팅
          window.__videosPendingTarget = target;
          window.__videosSuppressFlash = true;
          sessionStorage.setItem("gotoSubPage", target);
        } catch {
          // sessionStorage가 막혀도 최소한 loadPage는 되게
        }

        await loadPage("videos");

        // 가능하면 videos.js의 helper로 즉시 해당 섹션 보여주기
        try {
          const { goToVideosSection } = await import("./videos.js");
          if (typeof goToVideosSection === "function") {
            goToVideosSection(target, { skipDefault: true });
          } else {
            // fallback: videos.js가 sessionStorage 읽어서 열도록 둠
            sessionStorage.setItem("gotoSubPage", target);
          }
        } catch {
          // fallback 유지
          try {
            sessionStorage.setItem("gotoSubPage", target);
          } catch {}
        }
        return;
      }
    });
  });

  // 4. Fundal reflex folder toggle (inside Childhood Eye Screening section)
  const fundalFolderRow = document.getElementById("fundalReflexFolderRow");
  const fundalSubRows = document.getElementById("fundalReflexSubRows");
  if (
    fundalFolderRow &&
    fundalSubRows &&
    fundalFolderRow.dataset.wiredFolder !== "1"
  ) {
    fundalFolderRow.dataset.wiredFolder = "1";
    const cta = fundalFolderRow.querySelector(".lesson-cta");
    const closedCtaI18nKey = "auto.childhoodeyescreeningworkshop.see_all";

    const setOpenState = (open) => {
      fundalSubRows.style.display = open ? "" : "none";
      fundalFolderRow.setAttribute("aria-expanded", open ? "true" : "false");
      if (cta) {
        if (open) {
          cta.removeAttribute("data-i18n");
          cta.textContent = "Close ^";
        } else {
          cta.setAttribute("data-i18n", closedCtaI18nKey);
          cta.textContent = "See all >";
        }
      }
      page.classList.toggle("fundal-reflex-open", open);
      refreshWorkshopTranslations(fundalFolderRow);
    };

    // default closed
    setOpenState(false);

    const toggleOpenState = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = fundalSubRows.style.display !== "none";
      setOpenState(!isOpen);
    };

    fundalFolderRow.addEventListener("click", toggleOpenState);
    fundalFolderRow.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") toggleOpenState(e);
    });
  }
}
