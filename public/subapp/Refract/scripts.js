import { createPrescriptionFormController } from "./src/ui/prescription-form.js?v=20260310-17";
import { initShellControls } from "./src/ui/shell-controls.js?v=20260310-14";
import { initSpinnerInputs } from "./src/ui/spinner-inputs.js?v=20260310-14";

function initApp() {
  const prescriptionForm = createPrescriptionFormController();
  initSpinnerInputs({
    onSimpleModeDisabled: prescriptionForm.applyBestMeanSphereAll,
  });
  prescriptionForm.init();
  initShellControls();
}

document.addEventListener("DOMContentLoaded", initApp);
