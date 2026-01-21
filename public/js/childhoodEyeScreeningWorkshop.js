// public/js/childhoodEyeScreeningWorkshop.js
import { loadPage } from "./navigation.js";

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

export function initializeChildhoodEyeScreeningWorkshop() {
  const page = document.getElementById("childhoodEyeScreeningWorkshopPage");
  if (!page) return;

  const rows = page.querySelectorAll(".lesson-row[data-target]");
  rows.forEach((row) => {
    if (row.dataset.wired === "1") return;
    row.dataset.wired = "1";

    row.addEventListener("click", async (event) => {
      event.preventDefault();

      const targetRaw = row.getAttribute("data-target");
      if (!targetRaw) return;

      // ✅ quizzes that are separate routes
      if (targetRaw === "childhoodAssessmentPage") {
        await loadPage("childhoodAssessment");
        return;
      }
      if (targetRaw === "behavioursquizPage") {
        await loadPage("behavioursquiz");
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

        // Signs of visual impairment → Cases
        signsVICasesPage: "signsVICases",

        // Childhood eye screening → Refer
        childhoodReferPage: "childhoodRefer",

        // (안전망)
        visualImpairmentPage: "visualImpairment",
      };

      if (DIRECT_ROUTES[targetRaw]) {
        const route = DIRECT_ROUTES[targetRaw];
        await loadPage(route);

        // ✅ [ADD] 같은 route 안에서, 눌렀던 "정확한 pageId"를 보여주기
        if (typeof window.showPage === "function") {
          window.showPage(targetRaw);
        } else {
          // 최소 안전장치 (showPage가 없는 경우)
          const el = document.getElementById(targetRaw);
          if (el) {
            document
              .querySelectorAll(".page")
              .forEach((p) => (p.style.display = "none"));
            el.style.display = "block";
          }
        }

        // 상단으로 스크롤
        try {
          window.scrollTo(0, 0);
        } catch {}
        return;
      }
    });
  });

  // 2. Visual Impairment 버튼 연결 (추가된 부분)
  const viRow = document.getElementById("visualImpairmentRow");
  if (viRow && viRow.dataset.wired !== "1") {
    viRow.dataset.wired = "1";
    viRow.addEventListener("click", async (e) => {
      e.preventDefault();
      await loadPage("visualImpairment");
    });
  }

  // 3. PDF 관련 버튼들 (Atoms, Fundal 등)
  const pdfLinks = [
    { id: "atomsHandout1Row", route: "atomsHandout1" },
    { id: "atomsHandout2Row", route: "atomsHandout2" },
    { id: "fundalReflexPdfRow", route: "fundalReflexPdf" },
  ];

  pdfLinks.forEach((link) => {
    const el = document.getElementById(link.id);
    if (el && el.dataset.wiredPdf !== "1") {
      el.dataset.wiredPdf = "1";
      el.addEventListener("click", async (e) => {
        e.preventDefault();
        await loadPage(link.route);
      });
    }
  });
}
