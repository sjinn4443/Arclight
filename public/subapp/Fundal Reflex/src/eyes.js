import { createAmbientEyeController } from "./eyes-ambient.js?v=20260430-8";
import {
  initDraggable,
  initPupilSlider,
  initVerticalEyelidSliders,
} from "./eyes-controls.js?v=20260308-134";
import {
  applyBabyModeState,
  applyCataractToPupils,
  applyIrisLayoutPosition,
  applyManualEyeMoveState,
  applyPupilFill,
  getBrightenedReflexFillValue,
  getCaseEyeOffset,
  getEffectiveBaseReflexColorCss,
  getIrisColourValue,
  syncDeviationDrivenReflexBoost,
  updateIrisTransform,
} from "./eyes-layout.js?v=20260430-1";
import { REFRACTION_VALUES } from "./retinoscopy-case-metadata.js?v=20260430-3";

export function createEyesController({ state, dom, onEyeGeometryChange }) {
  const NORMAL_PUPIL_SIZE = 32;
  const DILATED_PUPIL_SIZE = 46;
  const ambientController = createAmbientEyeController({
    dom,
    notifyEyeGeometryChange,
    state,
    updateIrisTransform,
  });

  function notifyEyeGeometryChange(options = true) {
    const normalizedOptions =
      typeof options === "boolean"
        ? { includePosition: options, immediate: false }
        : {
            includePosition:
              options?.includePosition === undefined
                ? true
                : Boolean(options.includePosition),
            immediate: Boolean(options?.immediate),
          };

    if (typeof onEyeGeometryChange === "function") {
      onEyeGeometryChange(normalizedOptions);
    }
  }

  function applyCaseEyePosture({ includePosition = true } = {}) {
    dom.irises.forEach((iris) => {
      const eyeType = iris.closest(".eye")?.dataset.eye;
      const { x, y } = getCaseEyeOffset(state.currentRefraction, eyeType);
      iris.caseOffset = { x, y };
      applyIrisLayoutPosition(iris);
      syncDeviationDrivenReflexBoost(iris);
    });

    notifyEyeGeometryChange(includePosition);
  }

  function setIrisColour(value) {
    const nextValue = String(value || "").trim();
    const normalizedValue = nextValue || "dark-brown";
    const irisColourValue = getIrisColourValue(normalizedValue);

    state.irisColour = normalizedValue;
    dom.irises.forEach((iris) => {
      iris.style.background = irisColourValue;
    });
  }

  function applyReflexColor(color) {
    const effectiveColor =
      state.currentRefraction === REFRACTION_VALUES.BILATERAL_BLUE_NORMAL
        ? getEffectiveBaseReflexColorCss(
            state.currentRefraction,
            state.baseReflexColor,
          )
        : color;
    dom.irises.forEach((iris) => {
      applyPupilFill(iris, effectiveColor);
    });
    applyCataractToPupils({
      irises: dom.irises,
      cataractLevel: state.cataractLevel,
    });
  }

  function setCataractLevel(value) {
    const parsed = Number.isFinite(value) ? value : parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return;
    }

    state.cataractLevel = Math.max(0, Math.min(100, parsed));
    applyCataractToPupils({
      irises: dom.irises,
      cataractLevel: state.cataractLevel,
    });
  }

  function setManualEyeMoveEnabled(isEnabled) {
    state.isManualEyeMoveEnabled = Boolean(isEnabled);
    if (!state.isManualEyeMoveEnabled || state.isTestMode) {
      dom.irises.forEach((iris) => {
        if (typeof iris.cancelManualDrag === "function") {
          iris.cancelManualDrag();
        }
      });
    }
    applyManualEyeMoveState({
      irises: dom.irises,
      isManualEyeMoveEnabled: state.isManualEyeMoveEnabled,
    });
  }

  function setBabyMode(isEnabled) {
    const nextValue = Boolean(isEnabled);
    const previousValue = state.isBabyMode;
    state.isBabyMode = nextValue;

    dom.irises.forEach((iris) => {
      if (typeof iris.cancelManualDrag === "function") {
        iris.cancelManualDrag();
      }
    });

    applyBabyModeState({
      eyesWrapper: dom.eyesWrapper,
      isBabyMode: state.isBabyMode,
    });
    applyCaseEyePosture({ includePosition: true });
    if (previousValue !== nextValue) {
      ambientController.resetBlinkSchedule();
    }
  }

  function setDilatedMode(isEnabled) {
    state.isDilatedMode = Boolean(isEnabled);
    const targetSize = state.isDilatedMode
      ? DILATED_PUPIL_SIZE
      : NORMAL_PUPIL_SIZE;

    dom.pupilSizeSliders.forEach((slider) => {
      slider.value = String(targetSize);
      slider.dispatchEvent(new Event("input"));
    });

    notifyEyeGeometryChange({ includePosition: true, immediate: true });
  }

  function syncRefractionPose() {
    applyCaseEyePosture({ includePosition: true });
  }

  function init() {
    dom.irises.forEach((iris) => {
      iris.nystagmusOffset = { x: 0, y: 0 };
      iris.caseOffset = { x: 0, y: 0 };
      iris.manualOffset = { x: 0, y: 0 };
      syncDeviationDrivenReflexBoost(iris);
    });

    dom.irises.forEach((iris) => {
      initDraggable({
        draggable: iris,
        state,
        applyIrisLayoutPosition,
        applyPupilFill,
        getBrightenedDragFillValue: (factor) =>
          getBrightenedReflexFillValue({
            currentRefraction: state.currentRefraction,
            baseReflexColor: state.baseReflexColor,
            factor,
          }),
        notifyEyeGeometryChange,
        syncDeviationDrivenReflexBoost,
      });
    });

    dom.pupilSizeSliders.forEach((slider) => {
      initPupilSlider({ slider, notifyEyeGeometryChange });
    });
    initVerticalEyelidSliders({
      eyelidSliders: dom.eyelidSliders,
      notifyEyeGeometryChange,
    });
    applyCataractToPupils({
      irises: dom.irises,
      cataractLevel: state.cataractLevel,
    });
    applyManualEyeMoveState({
      irises: dom.irises,
      isManualEyeMoveEnabled: state.isManualEyeMoveEnabled,
    });
    applyBabyModeState({
      eyesWrapper: dom.eyesWrapper,
      isBabyMode: state.isBabyMode,
    });
    setIrisColour(state.irisColour);
    applyCaseEyePosture({ includePosition: false });
  }

  return {
    init,
    applyReflexColor,
    setBabyMode,
    setDilatedMode,
    setIrisColour,
    setCataractLevel,
    blinkOnce: ambientController.blinkOnce,
    setLiveMotionEnabled: ambientController.setLiveMotionEnabled,
    setManualEyeMoveEnabled,
    setNystagmusConfig: ambientController.setNystagmusConfig,
    setNystagmusEnabled: ambientController.setNystagmusEnabled,
    setNystagmusLevel: ambientController.setNystagmusLevel,
    syncRefractionPose,
    startAmbientAnimations: ambientController.startAmbientAnimations,
  };
}
