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

export function initRiskCalculator(root = document) {
  const questionnaire = $(".questionnaire", root);
  const finalMessage = $("#final-message", root);
  const reasoningWindow = $("#reasoning-window", root);
  const iopRadios = $$('input[name="iop"]', root);
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
    selectedRatio: null,
    selectedSize: selectedDiscButton?.dataset.size ?? DEFAULT_DISC_SIZE,
    selectedPalpation: null,
  };

  initializeToggleableRadios(root);

  function clearRenderedRisk() {
    riskCells.forEach((cell) => cell.classList.remove("highlight"));
    finalMessage.textContent = "";
    finalMessage.style.color = "black";
    reasoningWindow.textContent = "";
  }

  function clearPalpationSelection() {
    state.selectedPalpation = null;
    palpationButtons.forEach((button) => button.classList.remove("is-active"));
  }

  function clearMeasuredIopSelection() {
    iopRadios.forEach((radio) => {
      radio.checked = false;
    });
  }

  function readRiskInputs() {
    return {
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

  function renderRiskOutcome(outcome) {
    riskCells.forEach((cell) => cell.classList.remove("highlight"));

    if (outcome.cellId) {
      const targetCell = root.getElementById(outcome.cellId);
      if (targetCell) {
        targetCell.classList.add("highlight");
      }
    }

    finalMessage.textContent = outcome.urgencyMessage;
    finalMessage.style.color = outcome.urgencyTextColour;
    reasoningWindow.innerHTML = buildReasoningHtml(outcome);
  }

  function maybeRecalculateRisk() {
    const inputs = readRiskInputs();
    if (!canCalculateRisk(inputs)) {
      clearRenderedRisk();
      return;
    }
    const outcome = calculateRiskOutcome(inputs);
    renderRiskOutcome(outcome);
  }

  ratioButtons.forEach((button) => {
    button.addEventListener("click", () => {
      ratioButtons.forEach((peer) => peer.classList.remove("selected"));
      button.classList.add("selected");
      state.selectedRatio = button.dataset.ratio;
      maybeRecalculateRisk();
    });
  });

  discButtons.forEach((button) => {
    button.addEventListener("click", () => {
      discButtons.forEach((peer) => peer.classList.remove("selected"));
      button.classList.add("selected");
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
      } else {
        clearMeasuredIopSelection();
        palpationButtons.forEach((peer) => peer.classList.remove("is-active"));
        button.classList.add("is-active");
        state.selectedPalpation = value;
      }
      maybeRecalculateRisk();
    });
  });

  iopRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        clearPalpationSelection();
      }
      maybeRecalculateRisk();
    });
  });

  questionnaire.addEventListener("change", maybeRecalculateRisk);
  maybeRecalculateRisk();
}
