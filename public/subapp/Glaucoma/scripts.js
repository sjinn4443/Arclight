import { initMcqController } from "./src/mcq-controller.js?v=20260725-safety1";
import { initPopupController } from "./src/popup-controller.js?v=20260511-2";
import { initRiskCalculator } from "./src/risk-calculator-controller.js?v=20260725-report2";
import { initReportController } from "./src/report-controller.js?v=20260725-report2";
import { registerServiceWorker } from "./src/pwa.js?v=20260723-v1.1";

function initAssessmentReset(riskController) {
  const button = document.getElementById("newAssessmentButton");
  const status = document.getElementById("newAssessmentStatus");
  if (!button || !status || !riskController) return;
  let pending = false;
  let timer = null;
  const cancel = () => {
    pending = false;
    button.textContent = "New assessment";
    status.textContent = "";
    if (timer) window.clearTimeout(timer);
    timer = null;
  };
  button.addEventListener("click", () => {
    if (!pending) {
      pending = true;
      button.textContent = "Confirm new assessment";
      status.textContent = "Press again to clear the assessment.";
      timer = window.setTimeout(cancel, 8000);
      return;
    }
    if (timer) window.clearTimeout(timer);
    timer = null;
    riskController.resetAssessment();
    pending = false;
    button.textContent = "New assessment";
    status.textContent = "Assessment cleared.";
  });
}

function initializeApp() {
  const riskController = initRiskCalculator(document);
  initReportController(riskController, document);
  initPopupController(document);
  initMcqController(document);
  initAssessmentReset(riskController);
  registerServiceWorker();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
} else {
  initializeApp();
}
