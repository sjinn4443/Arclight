import { loadPage } from "./navigation.js";

export function initializeChildhoodEyeScreeningWorkshop() {
  const page = document.getElementById("childhoodEyeScreeningWorkshopPage");
  if (!page) return;

  // 1. 기존 data-target 기반 로우들 연결
  const rows = page.querySelectorAll(".lesson-row[data-target]");
  rows.forEach((row) => {
    if (row.dataset.wired === "1") return;
    row.dataset.wired = "1";

    row.addEventListener("click", async (event) => {
      event.preventDefault();
      const target = row.getAttribute("data-target");
      if (!target) return;

      if (target === "childhoodAssessmentPage") {
        await loadPage("childhoodAssessment");
      } else if (target === "behavioursquizPage") {
        await loadPage("behavioursquiz");
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
