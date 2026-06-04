import { initCataractController } from "./cataract-controller.js?v=20260511-6";
import { initImagePreviewController } from "./image-preview-controller.js?v=20260511-5";
import { initInfoPopupController } from "./info-popup-controller.js?v=20260511-6";
import { initMcqController } from "./mcq-controller.js?v=20260511-6";

function initializeApp() {
  initInfoPopupController();
  initMcqController();
  initCataractController();
  initImagePreviewController();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
} else {
  initializeApp();
}
