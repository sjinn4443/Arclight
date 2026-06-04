import {
  checkOrangeFlag,
  transposePrescription,
} from "../prescription-logic.js?v=20260310-17";
import { computePrescriptionCase } from "../prescription-engine.js?v=20260310-17";
import {
  getSignedValue,
  readAxisValue,
  setSignedValue,
  updateOutputWithSign,
  writeAxisValue,
} from "./sign-fields.js?v=20260310-16";
import { syncVisualPlaceholder } from "./visual-placeholders.js?v=20260310-14";

const SECTION_NAMES = ["current", "objective"];
const EYE_NAMES = ["re", "le"];

export function createPrescriptionFormController() {
  function init() {
    attachRecalculationListeners();
    attachTransposeButton();
    recalcPrescription();
  }

  function attachRecalculationListeners() {
    document.querySelectorAll("input").forEach((input) => {
      input.addEventListener("change", recalcPrescription);
      input.addEventListener("input", recalcPrescription);
    });
  }

  function attachTransposeButton() {
    const transposeButton = document.getElementById("transpose-btn");
    if (!transposeButton) {
      return;
    }

    transposeButton.addEventListener("click", () => {
      handleTranspose();
    });
  }

  function handleTranspose() {
    SECTION_NAMES.forEach((section) => {
      EYE_NAMES.forEach((eye) => {
        transposeInputGroup(section, eye);
      });
    });

    SECTION_NAMES.forEach((section) => {
      normalizeSectionCylinderSigns(section);
    });

    recalcPrescription();
  }

  function transposeInputGroup(section, eye) {
    const prescription = buildEyePrescription(section, eye);
    if (
      [prescription.sph, prescription.cyl, prescription.axis].some((value) =>
        Number.isNaN(value),
      )
    ) {
      return;
    }

    const transposed = transposePrescription(prescription);
    writeEyePrescription(section, eye, transposed);
  }

  function normalizeSectionCylinderSigns(section) {
    const rightEye = buildEyePrescription(section, "re");
    const leftEye = buildEyePrescription(section, "le");

    if (
      Number.isNaN(rightEye.cyl) ||
      Number.isNaN(leftEye.cyl) ||
      rightEye.cyl * leftEye.cyl >= 0
    ) {
      return;
    }

    const normalizedRightEye =
      rightEye.cyl > 0 ? transposePrescription(rightEye) : rightEye;
    const normalizedLeftEye =
      leftEye.cyl > 0 ? transposePrescription(leftEye) : leftEye;

    writeEyePrescription(section, "re", normalizedRightEye);
    writeEyePrescription(section, "le", normalizedLeftEye);
  }

  function writeEyePrescription(section, eye, prescription) {
    setSignedValue(`${section}-${eye}-sph`, prescription.sph, {
      dispatch: false,
    });
    setSignedValue(`${section}-${eye}-cyl`, prescription.cyl, {
      dispatch: false,
    });
    writeAxisValue(`${section}-${eye}-axis`, prescription.axis, {
      dispatch: false,
    });
  }

  function buildEyePrescription(section, eye) {
    return {
      sph: getSignedValue(`${section}-${eye}-sph`),
      cyl: getSignedValue(`${section}-${eye}-cyl`),
      axis: readAxisValue(`${section}-${eye}-axis`),
    };
  }

  function buildContextState() {
    return {
      vaGood: isChecked("toggle-va-good"),
      precise: isChecked("toggle-precise"),
      accurate: isChecked("toggle-accurate"),
      health: isChecked("toggle-health"),
    };
  }

  function isChecked(inputId) {
    return Boolean(document.getElementById(inputId)?.checked);
  }

  function recalcPrescription() {
    const context = buildContextState();
    const currentRightEye = buildEyePrescription("current", "re");
    const currentLeftEye = buildEyePrescription("current", "le");
    const objectiveRightEye = buildEyePrescription("objective", "re");
    const objectiveLeftEye = buildEyePrescription("objective", "le");
    const ageValue = document.getElementById("age")?.value;
    const output = computePrescriptionCase({
      age: ageValue,
      context,
      currentRightEye,
      currentLeftEye,
      objectiveRightEye,
      objectiveLeftEye,
      currentAdd: getSignedValue("current-le-add"),
      objectiveAdd: getSignedValue("objective-le-add"),
    });

    updateOutputWithSign("output-re-sph", output.rightEye.sph);
    updateOutputWithSign("output-re-cyl", output.rightEye.cyl);
    updateOutputWithSign("output-le-sph", output.leftEye.sph);
    updateOutputWithSign("output-le-cyl", output.leftEye.cyl);
    updateOutputWithSign("output-le-add", output.readingAdd);

    updateOutputAxis("output-re-axis", output.rightEye.axis);
    updateOutputAxis("output-le-axis", output.leftEye.axis);
    updateOrangeState(output.rightEye.sph, output.leftEye.sph, context.precise);
  }

  function updateOutputAxis(outputId, axis) {
    const outputField = document.getElementById(outputId);
    if (!outputField) {
      return;
    }

    outputField.value =
      axis === null || Number.isNaN(axis) ? "" : String(Math.round(axis));
    syncVisualPlaceholder(outputField);
  }

  function updateOrangeState(rightSphere, leftSphere, precise) {
    const outputFields = document.querySelectorAll(
      ".results-section input[readonly]",
    );
    const shouldHighlight =
      !precise && checkOrangeFlag(rightSphere) && checkOrangeFlag(leftSphere);

    outputFields.forEach((field) => {
      field.classList.toggle("orange-bg", shouldHighlight);
    });
  }

  function applyBestMeanSphereAll() {
    SECTION_NAMES.forEach((section) => {
      EYE_NAMES.forEach((eye) => {
        applyBestMeanSphereToEye(section, eye);
      });
    });

    recalcPrescription();
  }

  function applyBestMeanSphereToEye(section, eye) {
    const sphereId = `${section}-${eye}-sph`;
    const cylinderId = `${section}-${eye}-cyl`;
    const sphereValue = getSignedValue(sphereId);
    const cylinderValue = getSignedValue(cylinderId);

    if (Number.isNaN(sphereValue) || Number.isNaN(cylinderValue)) {
      return;
    }

    setSignedValue(sphereId, sphereValue + cylinderValue / 2, {
      dispatch: false,
    });
  }

  return {
    init,
    recalcPrescription,
    applyBestMeanSphereAll,
  };
}
