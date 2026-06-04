import { getReflexColor, parseRGB } from "./color.js";
import {
  DEFAULT_REFRACTION_VALUE,
  REFRACTION_GROUPS,
} from "./constants.js?v=20260506-2";
import {
  getCaseList,
  getFallbackBabyCase,
} from "./case-catalog.js?v=20260507-1";
import { getDomRefs } from "./dom.js?v=20260506-4";
import { createEyesController } from "./eyes.js?v=20260506-5";
import { initInfoModal } from "./info-modal.js";
import { initMenuMcq } from "./menu-mcq.js?v=20260506-9";
import { createVisualCasesController } from "./menu-visual-cases.js?v=20260507-1";
import { prefersReducedMotion } from "./motion.js";
import { createRetinoscopyController } from "./retinoscopy.js?v=20260506-8";
import { createAppState } from "./state.js?v=20260506-2";
import { createStreakControlsController } from "./streak-controls.js";
import { createTestModeController } from "./test-mode.js?v=20260506-3";

function populateRefractionOptions(selectElement) {
  if (!selectElement) {
    return;
  }

  selectElement.replaceChildren();
  REFRACTION_GROUPS.forEach((group) => {
    const optGroup = document.createElement("optgroup");
    optGroup.label = group.label;

    group.options.forEach((optionConfig) => {
      const option = document.createElement("option");
      option.value = optionConfig.value;
      option.textContent = optionConfig.label;
      option.dataset.cat = group.category;
      option.selected = optionConfig.value === DEFAULT_REFRACTION_VALUE;
      optGroup.appendChild(option);
    });

    selectElement.appendChild(optGroup);
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
  retinoscopyController.renderNow(true);
}

export function initApp() {
  const dom = getDomRefs();
  const state = createAppState();
  populateRefractionOptions(dom.refractionStateSelect);
  if (dom.refractionStateSelect) {
    dom.refractionStateSelect.value = state.currentRefraction;
  }

  const retinoscopyController = createRetinoscopyController({ state, dom });
  const streakControlsController = createStreakControlsController({
    state,
    dom,
    retinoscopyController,
  });
  const testModeController = createTestModeController({
    state,
    dom,
    retinoscopyController,
    onCaseChange: setCurrentRefraction,
  });
  const eyesController = createEyesController({
    state,
    dom,
    onEyeGeometryChange: ({ includePosition = true } = {}) =>
      retinoscopyController.scheduleRetinoscopy(includePosition),
  });

  let visualCasesController = null;

  function setCurrentRefraction(value) {
    retinoscopyController.setRefraction(value);
    if (dom.refractionStateSelect) {
      dom.refractionStateSelect.value = value;
    }
    if (visualCasesController) {
      visualCasesController.update();
    }
  }

  function setModifierButtonState(button, isPressed) {
    if (!button) {
      return;
    }

    button.checked = isPressed;
  }

  function syncModifierButtons() {
    setModifierButtonState(dom.gazeToggle, state.isGazeMode);
    setModifierButtonState(dom.dilatedToggle, state.isDilatedMode);
    setModifierButtonState(dom.babyToggle, state.isBabyMode);
  }

  eyesController.init();
  initInfoModal(dom);
  streakControlsController.init();
  testModeController.init();
  initMenuMcq({
    state,
    dom,
    onBeforeOpenMcq: () => testModeController.closeTestMode(),
  });

  visualCasesController = createVisualCasesController({
    state,
    dom,
    onBeforeOpen: () => testModeController.closeTestMode(),
    onSelectCase: setCurrentRefraction,
  });
  visualCasesController.init();

  dom.retEyeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      retinoscopyController.setActiveRetEye(button.dataset.retEye);
    });
  });
  retinoscopyController.setActiveRetEye(state.activeRetEye);

  if (dom.reflexColorSlider) {
    dom.reflexColorSlider.addEventListener("input", (event) => {
      const sliderValue = parseInt(event.target.value, 10);
      const newColor = getReflexColor(sliderValue);
      eyesController.applyReflexColor(newColor);
      state.baseReflexColor = parseRGB(newColor);
    });
    dom.reflexColorSlider.dispatchEvent(new Event("input"));
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
      setCurrentRefraction(event.target.value);
    });
  }

  if (dom.gazeToggle) {
    dom.gazeToggle.addEventListener("change", (event) => {
      eyesController.setGazeMode(event.target.checked);
      syncModifierButtons();
    });
  }

  if (dom.dilatedToggle) {
    dom.dilatedToggle.addEventListener("change", (event) => {
      eyesController.setDilatedMode(event.target.checked);
      syncModifierButtons();
    });
  }

  if (dom.babyToggle) {
    dom.babyToggle.addEventListener("change", (event) => {
      eyesController.setBabyMode(event.target.checked);
      const visibleCases = getCaseList({ babyOnly: state.isBabyMode });
      const currentCaseVisible = visibleCases.some(
        (caseItem) => caseItem.value === state.currentRefraction,
      );
      if (!currentCaseVisible) {
        const fallbackCase = getFallbackBabyCase();
        if (fallbackCase) {
          setCurrentRefraction(fallbackCase.value);
        }
      }
      syncModifierButtons();
      visualCasesController.update();
    });
  }

  if (dom.retinoscopySlider) {
    dom.retinoscopySlider.addEventListener("input", (event) => {
      retinoscopyController.setRetStreakOffset(
        parseInt(event.target.value, 10),
      );
    });
  }

  if (dom.retinoscopyRotationSlider) {
    dom.retinoscopyRotationSlider.addEventListener("input", (event) => {
      retinoscopyController.setRetStreakRotation(
        parseInt(event.target.value, 10),
      );
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

  if (dom.nystagmusSlider) {
    dom.nystagmusSlider.addEventListener("input", (event) => {
      eyesController.setNystagmusLevel(parseInt(event.target.value, 10));
    });
    dom.nystagmusSlider.dispatchEvent(new Event("input"));
  }

  runStartupEyeAnimation({ dom, eyesController, retinoscopyController });
  syncModifierButtons();

  window.addEventListener("resize", () => {
    retinoscopyController.scheduleRetinoscopy(true);
  });
}
