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

function setupWorkshopFolders(page) {
  const folders = page.querySelectorAll(
    "#childhoodWorkshopFolders .childhood-folder-row",
  );
  const sectionCards = page.querySelectorAll(".childhood-section-card");

  const foldersContainer = page.querySelector("#childhoodWorkshopFolders");
  if (!foldersContainer) return;

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

export function initializeChildhoodEyeScreeningWorkshop() {
  const page = document.getElementById("childhoodEyeScreeningWorkshopPage");
  if (!page) return;

  initializeChildhoodWorkshopProgressInfra();
  initializeChildhoodWorkshopNextFlowInfra();
  setupWorkshopFolders(page);
  assignChildhoodWorkshopFlowIndices(page);
  updateChildhoodWorkshopProgressBars();

  const rows = page.querySelectorAll(".lesson-row[data-target]");
  rows.forEach((row) => {
    if (row.dataset.wired === "1") return;
    row.dataset.wired = "1";

    row.addEventListener("click", async (event) => {
      event.preventDefault();

      const targetRaw = row.getAttribute("data-target");
      if (!targetRaw) return;

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
        childhoodIntroVisualDevelopmentPage: "childhoodEyeBrainImages",
        childhoodNormalVisualDevelopmentPage: "childhoodEyeBrainImages",
        childhoodAskQuestionsObservePage: "childhoodEyeBrainImages",
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
        await loadPage(route);

        // ✅ 같은 route 안에 targetRaw 페이지 섹션이 있으면 그걸 정확히 보여주기
        const fallbackId =
          targetRaw === "childhoodAssessmentPage"
            ? "childhoodAssessmentQuizPage"
            : targetRaw;
        showPageWithFallbackAndEvent(fallbackId);

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

    const setOpenState = (open) => {
      fundalSubRows.style.display = open ? "" : "none";
      fundalFolderRow.setAttribute("aria-expanded", open ? "true" : "false");
      if (cta) cta.textContent = open ? "Close ^" : "See all >";
      page.classList.toggle("fundal-reflex-open", open);
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
