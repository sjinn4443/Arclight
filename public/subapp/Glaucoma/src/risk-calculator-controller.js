import { $, $$ } from "./dom-utils.js";
import { DEFAULT_DISC_SIZE } from "./risk-config.js";
import {
  buildReasoningHtml,
  calculateRiskOutcome,
  canCalculateRisk,
} from "./risk-engine.js";

function readCheckedValue(name, root) {
  const selected = root.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : null;
}

function readToggleableFlag(name, root) {
  const selected = root.querySelector(`input[name="${name}"]`);
  return Boolean(selected && selected.checked);
}

function readCheckedValues(name, root) {
  return $$(`input[name="${name}"]:checked`, root).map((input) => input.value);
}

function initializeToggleableRadios(root) {
  const toggleableRadios = $$(
    'input[type="radio"][data-toggleable="true"]',
    root,
  );

  toggleableRadios.forEach((radio) => {
    radio.addEventListener("click", () => {
      if (radio.checked && radio.dataset.toggled === "true") {
        radio.checked = false;
        radio.dataset.toggled = "false";
        radio.dispatchEvent(new Event("change", { bubbles: true }));
        return;
      }

      $$(`input[name="${radio.name}"]`, root).forEach((peer) => {
        peer.dataset.toggled = "false";
      });
      radio.dataset.toggled = "true";
    });
  });
}

export function createQuestionnaireChangeHandler({
  clearPalpationSelection,
  recalculateRisk,
}) {
  return (event) => {
    const target = event?.target;
    if (target?.name === "iop" && target.checked) {
      clearPalpationSelection();
    }
    recalculateRisk();
  };
}

export function initRiskCalculator(root = document) {
  const questionnaire = $(".questionnaire", root);
  const finalMessage = $("#final-message", root);
  const reasoningWindow = $("#reasoning-window", root);
  const reportButton = $("#reportButton", root);
  const iopRadios = $$('input[name="iop"]', root);
  const eyeButtons = $$(".eye-button", root);
  const ratioButtons = $$(".ratio-button", root);
  const discButtons = $$(".disc-button", root);
  const palpationButtons = $$(".palpation-button", root);
  const riskCells = $$(".risk-cell", root);
  const visionSelect = $("#vision", root);

  if (!questionnaire || !finalMessage || !reasoningWindow) {
    return;
  }

  const selectedDiscButton = discButtons.find((button) =>
    button.classList.contains("selected"),
  );
  const state = {
    selectedEye: null,
    selectedRatio: null,
    selectedSize: selectedDiscButton?.dataset.size ?? DEFAULT_DISC_SIZE,
    selectedPalpation: null,
  };
  let lastReportData = null;

  initializeToggleableRadios(root);

  function clearRenderedRisk() {
    riskCells.forEach((cell) => cell.classList.remove("highlight"));
    finalMessage.textContent = "";
    finalMessage.style.color = "black";
    reasoningWindow.textContent = "";
    lastReportData = null;
    if (reportButton) reportButton.disabled = true;
  }

  function clearPalpationSelection() {
    state.selectedPalpation = null;
    palpationButtons.forEach((button) => {
      button.classList.remove("is-active");
      button.setAttribute("aria-pressed", "false");
    });
  }

  function clearMeasuredIopSelection() {
    iopRadios.forEach((radio) => {
      radio.checked = false;
    });
  }

  function resetAssessment() {
    state.selectedEye = null;
    state.selectedRatio = null;
    state.selectedSize = DEFAULT_DISC_SIZE;
    state.selectedPalpation = null;
    eyeButtons.forEach((button) => {
      button.classList.remove("selected");
      button.setAttribute("aria-pressed", "false");
    });
    delete questionnaire.dataset.eye;
    ratioButtons.forEach((button) => {
      button.classList.remove("selected");
      button.setAttribute("aria-pressed", "false");
    });
    discButtons.forEach((button) => {
      const selected = button.dataset.size === DEFAULT_DISC_SIZE;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    palpationButtons.forEach((button) => {
      button.classList.remove("is-active");
      button.setAttribute("aria-pressed", "false");
    });
    $$("input", questionnaire).forEach((input) => {
      if (input.type === "radio" || input.type === "checkbox")
        input.checked = false;
      if (input.dataset.toggled) input.dataset.toggled = "false";
    });
    if (visionSelect) visionSelect.value = "";
    clearRenderedRisk();
  }

  function readRiskInputs() {
    return {
      eye: state.selectedEye,
      iop: readCheckedValue("iop", root),
      palpation: state.selectedPalpation,
      cupDiscRatio: state.selectedRatio,
      discSize: state.selectedSize,
      thinRim: readToggleableFlag("thin_rims", root),
      suspiciousFields: readToggleableFlag("field_of_vision_problem", root),
      suspiciousPupils: readToggleableFlag("suspect_pupils", root),
      vision: visionSelect ? visionSelect.value : "",
      riskFactors: readCheckedValues("other_risk_factors", root),
    };
  }

  function renderRiskOutcome(outcome, inputs) {
    riskCells.forEach((cell) => cell.classList.remove("highlight"));

    if (outcome.cellId) {
      const targetCell = root.getElementById(outcome.cellId);
      if (targetCell) {
        targetCell.classList.add("highlight");
      }
    }

    finalMessage.textContent = outcome.urgencyMessage;
    finalMessage.style.color = outcome.urgencyTextColour;
    reasoningWindow.innerHTML = buildReasoningHtml({
      ...outcome,
      eye: state.selectedEye,
    });
    lastReportData = {
      inputs: { ...inputs, riskFactors: [...inputs.riskFactors] },
      outcome: {
        ...outcome,
        reasoningDetails: [...outcome.reasoningDetails],
        riskFactorStrings: [...outcome.riskFactorStrings],
      },
    };
    if (reportButton) reportButton.disabled = false;
  }

  function maybeRecalculateRisk() {
    const inputs = readRiskInputs();
    if (!canCalculateRisk(inputs)) {
      clearRenderedRisk();
      return;
    }
    const outcome = calculateRiskOutcome(inputs);
    renderRiskOutcome(outcome, inputs);
  }

  eyeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      eyeButtons.forEach((peer) => {
        const selected = peer === button;
        peer.classList.toggle("selected", selected);
        peer.setAttribute("aria-pressed", String(selected));
      });
      state.selectedEye = button.dataset.eye ?? null;
      if (state.selectedEye) {
        questionnaire.dataset.eye = state.selectedEye;
      } else {
        delete questionnaire.dataset.eye;
      }
      maybeRecalculateRisk();
    });
  });

  ratioButtons.forEach((button) => {
    button.addEventListener("click", () => {
      ratioButtons.forEach((peer) => {
        const selected = peer === button;
        peer.classList.toggle("selected", selected);
        peer.setAttribute("aria-pressed", String(selected));
      });
      state.selectedRatio = button.dataset.ratio;
      maybeRecalculateRisk();
    });
  });

  discButtons.forEach((button) => {
    button.addEventListener("click", () => {
      discButtons.forEach((peer) => peer.classList.remove("selected"));
      discButtons.forEach((peer) => peer.setAttribute("aria-pressed", "false"));
      button.classList.add("selected");
      button.setAttribute("aria-pressed", "true");
      state.selectedSize = button.dataset.size ?? DEFAULT_DISC_SIZE;
      maybeRecalculateRisk();
    });
  });

  palpationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.palpation ?? null;
      if (state.selectedPalpation === value) {
        state.selectedPalpation = null;
        button.classList.remove("is-active");
        button.setAttribute("aria-pressed", "false");
      } else {
        clearMeasuredIopSelection();
        palpationButtons.forEach((peer) => {
          peer.classList.remove("is-active");
          peer.setAttribute("aria-pressed", "false");
        });
        button.classList.add("is-active");
        button.setAttribute("aria-pressed", "true");
        state.selectedPalpation = value;
      }
      maybeRecalculateRisk();
    });
  });

  questionnaire.addEventListener(
    "change",
    createQuestionnaireChangeHandler({
      clearPalpationSelection,
      recalculateRisk: maybeRecalculateRisk,
    }),
  );
  maybeRecalculateRisk();
  return {
    resetAssessment,
    readRiskInputs,
    getReportData: () => lastReportData,
  };
}
