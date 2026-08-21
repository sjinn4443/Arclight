import { getReflexColor, parseRGB } from "./color.js?v=20260308-103";
import { getCaseTeachingMetadata } from "./case-teaching-metadata.js?v=20260430-6";
import {
  CASE_LEVELS,
  DEFAULT_REFRACTION_VALUE,
  REFRACTION_GROUPS,
} from "./constants.js?v=20260430-6";
import { buildClinicalInterpretation } from "./clinical-interpreter.js?v=20260430-7";
import { createConditionContextController } from "./condition-context-controls.js?v=20260430-1";
import { getDomRefs } from "./dom.js?v=20260501-1";
import { createEyesController } from "./eyes.js?v=20260821-1";
import { initInfoModal } from "./info-modal.js?v=20260501-1";
import { initLearnModal } from "./learn-modal.js?v=20260502-1";
import { initMenuMcq } from "./menu-mcq.js?v=20260430-2";
import { initVisualCaseMenu } from "./menu-visual-cases.js?v=20260430-9";
import { prefersReducedMotion } from "./motion.js";
import { createObservationGuideController } from "./observation-guide.js?v=20260430-1";
import { createRetinoscopyController } from "./retinoscopy.js?v=20260430-11";
import { createAppState } from "./state.js?v=20260430-2";
import { createStreakControlsController } from "./streak-controls.js?v=20260430-1";
import { createTestModeController } from "./test-mode.js?v=20260430-1";

const CASE_NYSTAGMUS_SETTINGS = {
  "bilateral-aniridia": {
    direction: "horizontal",
    level: 46,
    rate: "slow",
    wave: "pendular",
  },
};

const PRIMARY_CASE_VALUE_SET = new Set(
  CASE_LEVELS.find((level) => level.value === "primary")?.values || [],
);

function populateRefractionOptions(selectElement) {
  if (!selectElement) {
    return;
  }

  selectElement.replaceChildren();
  REFRACTION_GROUPS.forEach((group) => {
    if (group.separator) {
      const separatorOption = document.createElement("option");
      separatorOption.value = "";
      separatorOption.textContent = "--------------";
      separatorOption.disabled = true;
      separatorOption.dataset.cat = "separator";
      selectElement.appendChild(separatorOption);
      return;
    }

    if (!group.options?.length) {
      return;
    }

    const optionParent = group.label
      ? document.createElement("optgroup")
      : document.createDocumentFragment();

    if ("label" in optionParent) {
      optionParent.label = group.label;
    }

    group.options.forEach((optionConfig) => {
      const option = document.createElement("option");
      option.value = optionConfig.value;
      option.textContent = optionConfig.label;
      option.dataset.cat = group.category;
      option.selected = optionConfig.value === DEFAULT_REFRACTION_VALUE;
      optionParent.appendChild(option);
    });

    selectElement.appendChild(optionParent);
  });
}

function runStartupEyeAnimation({
  dom,
  eyesController,
  retinoscopyController,
}) {
  if (!prefersReducedMotion()) {
    dom.irises.forEach((iris) => {
      iris.style.transform = "translate(0, 0)";
      iris.style.transition = "";
    });
  }

  eyesController.startAmbientAnimations();
  retinoscopyController.scheduleRetinoscopy(true);
}

export function initApp() {
  const dom = getDomRefs();
  const state = createAppState();
  const conditionContextController = createConditionContextController({
    container: dom.modifierContextBar,
    state,
    onChange: () => renderInterpretationUi(),
  });

  function revealInitialControls() {
    if (dom.controlsDeck) {
      dom.controlsDeck.hidden = false;
    }

    if (dom.retStreakVisual) {
      dom.retStreakVisual.hidden = false;
    }

    if (dom.retStreak) {
      dom.retStreak.hidden = false;
    }

    dom.body?.classList.add("app-ready");
  }

  function renderResults() {
    if (!dom.resultsSummary || !dom.resultsSite || !dom.resultsUrgency) {
      return;
    }

    const interpretation = buildClinicalInterpretation({
      caseValue: state.currentRefraction,
      isBabyMode: state.isBabyMode,
      onsetMode: state.contextOnsetMode,
      glareOn: state.contextGlareOn,
      isTestMode: state.isTestMode,
      isTestRevealed: state.isTestRevealed,
    });

    dom.resultsSummary.textContent = interpretation.likely;
    dom.resultsSite.textContent = interpretation.site;
    dom.resultsUrgency.textContent = interpretation.referral;
    dom.resultsUrgency.dataset.tone = interpretation.tone;
  }

  function renderResultsWhy() {
    if (!dom.resultsWhy) {
      return;
    }

    if (state.isTestMode && !state.isTestRevealed) {
      dom.resultsWhy.textContent = "Why: hidden during test mode";
      return;
    }

    const teaching = getCaseTeachingMetadata(state.currentRefraction);
    dom.resultsWhy.textContent = `Why: ${teaching.why}`;
  }

  function renderTestRevealClue() {
    if (!dom.testClueText) {
      return;
    }

    if (!state.isTestMode || !state.isTestRevealed) {
      dom.testClueText.hidden = true;
      dom.testClueText.textContent = "";
      return;
    }

    const caseValue = state.testConditionValue || state.currentRefraction;
    const teaching = getCaseTeachingMetadata(caseValue);
    dom.testClueText.textContent = `Key clue: ${teaching.keyClue}`;
    dom.testClueText.hidden = false;
  }

  function renderInterpretationUi() {
    renderResults();
    renderResultsWhy();
    renderTestRevealClue();
  }

  function initAdvancedDock() {
    if (!dom.advancedDockToggle || !dom.advancedPanel) {
      return;
    }

    const syncAdvancedDock = (isOpen) => {
      dom.advancedPanel.hidden = !isOpen;
      dom.advancedDockToggle.classList.toggle("is-open", isOpen);
      dom.advancedDockToggle.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false",
      );

      const label = isOpen
        ? "Close advanced controls"
        : "Open advanced controls";

      dom.advancedDockToggle.setAttribute("aria-label", label);
      dom.advancedDockToggle.title = label;
    };

    syncAdvancedDock(false);

    dom.advancedDockToggle.addEventListener("click", () => {
      syncAdvancedDock(dom.advancedPanel.hidden);
    });
  }

  populateRefractionOptions(dom.refractionStateSelect);
  if (dom.refractionStateSelect) {
    dom.refractionStateSelect.value = state.currentRefraction;
  }
  conditionContextController.applyDefaults(state.currentRefraction);
  conditionContextController.render();
  renderInterpretationUi();

  const retinoscopyController = createRetinoscopyController({ state, dom });
  const streakControlsController = createStreakControlsController({
    state,
    dom,
    onLargeLightMove: () => eyesController?.blinkOnce?.(),
    retinoscopyController,
  });
  const eyesController = createEyesController({
    state,
    dom,
    onEyeGeometryChange: ({
      includePosition = true,
      immediate = false,
    } = {}) => {
      if (immediate) {
        retinoscopyController.renderNow(includePosition);
        return;
      }

      retinoscopyController.scheduleRetinoscopy(includePosition);
    },
  });
  const observationGuideController = createObservationGuideController({
    dom,
    state,
    isPrimaryCase: (caseValue) => PRIMARY_CASE_VALUE_SET.has(caseValue),
  });
  const testModeController = createTestModeController({
    state,
    dom,
    eyesController,
    retinoscopyController,
    setConditionContext: (conditionValue) => {
      conditionContextController.applyDefaults(conditionValue);
      conditionContextController.render();
      renderInterpretationUi();
      observationGuideController?.syncForCurrentCase();
    },
    onTestStateChange: () => {
      renderInterpretationUi();
      observationGuideController?.syncForCurrentCase();
    },
  });

  eyesController.init();
  const infoModalController = initInfoModal(dom);
  streakControlsController.init();
  testModeController.init();
  initAdvancedDock();
  conditionContextController.init();
  observationGuideController?.init();
  initMenuMcq({
    state,
    dom,
    onBeforeOpenMcq: () => testModeController.closeTestMode(),
  });
  const caseMenuController = initVisualCaseMenu({
    state,
    dom,
    onBeforeSelectCase: () => testModeController.closeTestMode(),
  });
  initLearnModal({
    dom,
    onBeforeOpen: () => infoModalController?.close?.({ restoreFocus: false }),
    onSelectCase: (caseValue) => caseMenuController?.selectCase(caseValue),
  });

  if (dom.reflexColorSlider) {
    dom.reflexColorSlider.addEventListener("input", (event) => {
      const sliderValue = parseInt(event.target.value, 10);
      const newColor = getReflexColor(sliderValue);
      eyesController.applyReflexColor(newColor);
      state.baseReflexColor = parseRGB(newColor);
    });
    dom.reflexColorSlider.dispatchEvent(new Event("input"));
  }

  if (dom.babyToggle) {
    dom.babyToggle.checked = state.isBabyMode;
    dom.babyToggle.addEventListener("change", (event) => {
      eyesController.setBabyMode(event.target.checked);
      caseMenuController?.setBabyMode();
      renderInterpretationUi();
    });
    eyesController.setBabyMode(state.isBabyMode);
    caseMenuController?.setBabyMode();
  }

  if (dom.dilatedToggle) {
    dom.dilatedToggle.checked = state.isDilatedMode;
    dom.dilatedToggle.addEventListener("change", (event) => {
      eyesController.setDilatedMode(event.target.checked);
    });
    eyesController.setDilatedMode(state.isDilatedMode);
  }

  if (dom.liveToggle) {
    dom.liveToggle.checked = state.isLiveMotionEnabled;
    dom.liveToggle.addEventListener("change", (event) => {
      eyesController.setLiveMotionEnabled(event.target.checked);
      syncNystagmusControls();
    });
    eyesController.setLiveMotionEnabled(state.isLiveMotionEnabled);
  }

  if (dom.irisColourSelect) {
    dom.irisColourSelect.value = state.irisColour;
    dom.irisColourSelect.addEventListener("change", (event) => {
      eyesController.setIrisColour(event.target.value);
    });
    eyesController.setIrisColour(state.irisColour);
  }

  if (dom.manualEyeMoveToggle) {
    dom.manualEyeMoveToggle.addEventListener("change", (event) => {
      eyesController.setManualEyeMoveEnabled(event.target.checked);
    });
    dom.manualEyeMoveToggle.checked = state.isManualEyeMoveEnabled;
    eyesController.setManualEyeMoveEnabled(state.isManualEyeMoveEnabled);
  }

  if (dom.refractionStateSelect) {
    dom.refractionStateSelect.addEventListener("change", (event) => {
      retinoscopyController.setRefraction(event.target.value);
      conditionContextController.applyDefaults(event.target.value);
      conditionContextController.render();
      renderInterpretationUi();
      observationGuideController?.syncForCurrentCase();
      eyesController.syncRefractionPose();
      syncNystagmusControls();
    });
  }

  if (dom.cataractSlider) {
    dom.cataractSlider.addEventListener("input", (event) => {
      const value = parseInt(event.target.value, 10);
      eyesController.setCataractLevel(value);
      retinoscopyController.setCataractLevel(value);
    });
    dom.cataractSlider.dispatchEvent(new Event("input"));
  }

  let isManualNystagmusEnabled = state.nystagmusLevel > 0;

  const getActiveCaseNystagmusSettings = () =>
    CASE_NYSTAGMUS_SETTINGS[state.currentRefraction] || null;

  const syncNystagmusConfig = () => {
    eyesController.setNystagmusConfig({
      direction:
        dom.nystagmusDirectionSelect?.value || state.nystagmusDirection,
      wave: dom.nystagmusWaveSelect?.value || state.nystagmusWave,
      rate: dom.nystagmusRateSelect?.value || state.nystagmusRate,
    });
  };

  const syncNystagmusControls = () => {
    const caseSettings = getActiveCaseNystagmusSettings();
    const isAutoCaseEnabled =
      Boolean(caseSettings) && !isManualNystagmusEnabled;

    if (isAutoCaseEnabled) {
      eyesController.setNystagmusConfig(caseSettings);
      eyesController.setNystagmusLevel(caseSettings.level);
    } else {
      eyesController.setNystagmusEnabled(isManualNystagmusEnabled);
      syncNystagmusConfig();
    }

    [
      dom.nystagmusDirectionSelect,
      dom.nystagmusWaveSelect,
      dom.nystagmusRateSelect,
    ].forEach((control) => {
      if (control) {
        control.disabled = !isManualNystagmusEnabled;
      }
    });
  };

  if (dom.nystagmusToggle) {
    dom.nystagmusToggle.checked = state.nystagmusLevel > 0;
    isManualNystagmusEnabled = dom.nystagmusToggle.checked;
    dom.nystagmusToggle.addEventListener("change", () => {
      isManualNystagmusEnabled = dom.nystagmusToggle.checked;
      syncNystagmusControls();
    });
  }

  if (dom.nystagmusDirectionSelect) {
    dom.nystagmusDirectionSelect.value = state.nystagmusDirection;
    dom.nystagmusDirectionSelect.addEventListener(
      "change",
      syncNystagmusConfig,
    );
  }

  if (dom.nystagmusWaveSelect) {
    dom.nystagmusWaveSelect.value = state.nystagmusWave;
    dom.nystagmusWaveSelect.addEventListener("change", syncNystagmusConfig);
  }

  if (dom.nystagmusRateSelect) {
    dom.nystagmusRateSelect.value = state.nystagmusRate;
    dom.nystagmusRateSelect.addEventListener("change", syncNystagmusConfig);
  }

  syncNystagmusControls();

  runStartupEyeAnimation({ dom, eyesController, retinoscopyController });
  retinoscopyController.renderNow(true);
  revealInitialControls();

  const isShortcutTargetEditable = () => {
    const activeElement = document.activeElement;
    if (!(activeElement instanceof HTMLElement)) {
      return false;
    }

    if (activeElement.isContentEditable) {
      return true;
    }

    const tagName = activeElement.tagName;
    return (
      tagName === "INPUT" || tagName === "SELECT" || tagName === "TEXTAREA"
    );
  };

  const isAnyModalOpen = () =>
    dom.infoModal?.getAttribute("aria-hidden") === "false" ||
    dom.mcqModal?.getAttribute("aria-hidden") === "false" ||
    dom.learnModal?.getAttribute("aria-hidden") === "false" ||
    dom.visualCaseModal?.getAttribute("aria-hidden") === "false" ||
    dom.visualCasePhotoModal?.getAttribute("aria-hidden") === "false";

  window.addEventListener("keydown", (event) => {
    if (
      event.defaultPrevented ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    if (state.isTestMode || isAnyModalOpen() || isShortcutTargetEditable()) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      caseMenuController?.selectAdjacentCase(-1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      caseMenuController?.selectAdjacentCase(1);
      return;
    }

    if (event.key.toLowerCase() === "c") {
      event.preventDefault();
      caseMenuController?.openCasePicker();
      return;
    }
  });

  window.addEventListener("resize", () => {
    retinoscopyController.scheduleRetinoscopy(true);
  });
}
