import { createPrescriptionFormController } from "./src/ui/prescription-form.js?v=20260310-17";
import { initShellControls } from "./src/ui/shell-controls.js?v=20260310-14";
import { initSpinnerInputs } from "./src/ui/spinner-inputs.js?v=20260310-14";
import { initCaseReset } from "./src/ui/case-reset.js?v=20260723-1";
import { registerServiceWorker } from "./src/pwa.js?v=20260723-1";

function initApp() {
  const prescriptionForm = createPrescriptionFormController();
  initSpinnerInputs({
    onModeChange: prescriptionForm.changeEntryMode,
  });
  prescriptionForm.init();
  initShellControls();
  initCaseReset();
  registerServiceWorker();
}

document.addEventListener("DOMContentLoaded", initApp);
