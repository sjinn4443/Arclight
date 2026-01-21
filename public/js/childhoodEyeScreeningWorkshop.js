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

      // ✅ EVERYTHING ELSE: treat as a videos subpage id (normalised)
      const target = normaliseVideosSubpageId(targetRaw);
      if (!target) return;

      try {
        sessionStorage.setItem("gotoSubPage", target);
        try {
          window.__videosPendingTarget = target;
          window.__videosSuppressFlash = true;
        } catch (_e) {}

        sessionStorage.setItem("fromRoute", "childhoodEyeScreeningWorkshop");
      } catch (_e) {}

      console.log(
        "[Workshop → Videos] targetRaw =",
        targetRaw,
        "→ target =",
        target,
      );

      await loadPage("videos");
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
