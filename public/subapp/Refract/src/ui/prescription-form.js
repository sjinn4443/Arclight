import {
  checkOrangeFlag,
  transposePrescription,
} from "../prescription-logic.js?v=20260310-17";
import { computePrescriptionCase } from "../prescription-engine.js?v=20260310-17";
import { RULE_CATALOGUE } from "../prescribing-rule-catalogue.js";
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

export function formatRuleSentences(ids, catalogue = RULE_CATALOGUE) {
  return ids
    .map((id) => {
      const rule = catalogue.find((entry) => entry[0] === id);
      const description = (rule ? rule[2] : id).trim();
      return /[.!?]$/.test(description) ? description : `${description}.`;
    })
    .join(" ");
}

export function prescriptionInputSignature(root = document) {
  return JSON.stringify(
    [...root.querySelectorAll("main input:not([readonly]), main select")].map(
      (input) => [
        input.id,
        input.value,
        Boolean(input.checked),
        input.closest(".spinner-container")?.dataset.sign ?? "",
      ],
    ),
  );
}

export function readPrescriptionContext(root = document) {
  const checked = (id) => Boolean(root.getElementById(id)?.checked);
  const optionalBoolean = (id) => {
    const value = root.getElementById(id)?.value;
    return value === "1" ? true : value === "0" ? false : null;
  };
  const optionalQuality = (id) => {
    const value = root.getElementById(id)?.value;
    if (value === "" || value === undefined || value === null) return null;
    const score = Number(value);
    return Number.isInteger(score) && score >= 0 && score <= 10 ? score : null;
  };
  return {
    simple: !checked("toggle-simple"),
    vaGood: checked("toggle-va-good"),
    precise: checked("toggle-precise"),
    accurate: checked("toggle-accurate"),
    health: checked("toggle-health"),
    repeat: optionalBoolean("context-repeat"),
    calm: optionalBoolean("context-calm"),
    rightQuality: optionalQuality("quality-right"),
    leftQuality: optionalQuality("quality-left"),
  };
}

export function createPrescriptionFormController() {
  const advancedValues = new Map();
  let renderedInputSignature = null;
  function init() {
    attachRecalculationListeners();
    attachTransposeButton();
    recalcPrescription();
  }

  function attachRecalculationListeners() {
    document.querySelectorAll("input, select").forEach((input) => {
      if (input.tagName !== "SELECT")
        input.addEventListener("input", recalcPrescription);
      // Legacy sign and validation helpers dispatch change without input.
      // The input signature below avoids recalculating twice for both events.
      input.addEventListener("change", recalcPrescription);
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

  function recalcPrescription() {
    const inputSignature = prescriptionInputSignature();
    if (inputSignature === renderedInputSignature) return;
    renderedInputSignature = inputSignature;
    const context = readPrescriptionContext();
    const qualityState = document.getElementById("measurement-quality-state");
    if (qualityState) {
      qualityState.textContent =
        context.rightQuality === null && context.leftQuality === null
          ? ""
          : `RE ${context.rightQuality ?? "switch"} · LE ${context.leftQuality ?? "switch"}`;
    }
    const readEye = (section, eye) => {
      const rx = buildEyePrescription(section, eye);
      return context.simple ? { sph: rx.sph, cyl: NaN, axis: NaN } : rx;
    };
    const currentRightEye = readEye("current", "re");
    const currentLeftEye = readEye("current", "le");
    const objectiveRightEye = readEye("objective", "re");
    const objectiveLeftEye = readEye("objective", "le");
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
    const hasData = [
      currentRightEye,
      currentLeftEye,
      objectiveRightEye,
      objectiveLeftEye,
    ].some((rx) => Number.isFinite(rx.sph));
    const review = document.getElementById("prescribing-review");
    if (review) {
      review.textContent = hasData ? output.review.join(" ") : "";
      review.hidden = !review.textContent;
    }
    const details = document.getElementById("prescribing-rules");
    const list = document.getElementById("prescribing-rule-list");
    if (details && list) {
      details.hidden = !hasData;
      list.replaceChildren();
      for (const [side, ids] of Object.entries(output.trace)) {
        const item = document.createElement("p");
        item.textContent = `${side === "right" ? "RE" : side === "left" ? "LE" : "Add"}: ${formatRuleSentences(ids)}`;
        list.append(item);
      }
    }
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

  function changeEntryMode(advanced) {
    SECTION_NAMES.forEach((section) => {
      EYE_NAMES.forEach((eye) => {
        const key = `${section}-${eye}`;
        const rx = buildEyePrescription(section, eye);
        if (!advanced) {
          const projected = Number.isFinite(rx.sph)
            ? Math.round(
                (rx.sph + (Number.isFinite(rx.cyl) ? rx.cyl / 2 : 0)) * 4,
              ) / 4
            : NaN;
          advancedValues.set(key, { rx, projected });
          setSignedValue(`${key}-sph`, projected, { dispatch: false });
        } else if (advancedValues.has(key)) {
          const saved = advancedValues.get(key);
          const unchanged =
            Object.is(rx.sph, saved.projected) || rx.sph === saved.projected;
          writeEyePrescription(
            section,
            eye,
            unchanged ? saved.rx : { sph: rx.sph, cyl: NaN, axis: NaN },
          );
          advancedValues.delete(key);
        }
      });
    });

    recalcPrescription();
  }

  return {
    init,
    recalcPrescription,
    changeEntryMode,
  };
}
