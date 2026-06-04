import { initMcqController } from "./src/mcq-controller.js?v=20260511-2";
import { initPopupController } from "./src/popup-controller.js?v=20260511-2";
import { initRiskCalculator } from "./src/risk-calculator-controller.js?v=20260511-2";

function initializeApp() {
  initRiskCalculator(document);
  initPopupController(document);
  initMcqController(document);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
} else {
  initializeApp();
}
