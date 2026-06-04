/*
 * Shared mutable state and core references for Squint.
 */

(function attachState(globalObj) {
  const SimCoreRef = globalObj.SimCore || {
    BASE_PUPIL_SIZE: 32,
    CONDITION_LIBRARY: {
      primary: [],
      intermediate: [],
      advanced: [],
    },
    parseRGB() {
      return { r: 0, g: 0, b: 0 };
    },
    brightenColor(color) {
      return color;
    },
    getReflexColor() {
      return "rgb(0, 0, 0)";
    },
  };

  const PresetRunnerRef = globalObj.PresetRunner || {
    runPresetCase() {
      return false;
    },
  };

  const state = {
    activePresetLevel: "primary",
    activeMcqLevel: "primary",
    baseReflexColor: {
      r: Math.round(218 * 0.7),
      g: Math.round(58 * 0.7),
      b: 0,
    },
    pupilReactivityByEye: { left: 1, right: 1 },
    pupilModelByEye: { left: "normal", right: "normal" },
    activeLightSide: "none",
    lightPillSide: "right",
    lightPillPos: 0.5,
    ambientLevel: 100,
    rapdValue: 0,
    infoPopupOpen: false,
    coverEye: "none",
    isApplyingPreset: false,
    isBabyMode: false,
    activeDiagnosticHints: { left: "", right: "" },
    presetFlashHoldTimer: null,
    presetFlashClearTimer: null,
    testMeActive: false,
    testMeCurrentLabel: "",
    testMeCurrentLevel: "primary",
    testMeLastIndexByLevel: {
      primary: -1,
      intermediate: -1,
      advanced: -1,
    },
    testMeQueueByLevel: {
      primary: [],
      intermediate: [],
      advanced: [],
    },
    activePresetKey: "",
    isLiveMotionEnabled: false,
    gazeShiftTimerId: 0,
    gazeDirection: "primary",
    gazeVector: { x: 0, y: 0 },
    gazePatternCue: "",
    gazeSamples: {
      primary: null,
      up: null,
      down: null,
    },
  };

  function clearDiagnosticHints() {
    state.activeDiagnosticHints = { left: "", right: "" };
  }

  function setDiagnosticHint(eyeType, hint) {
    if (eyeType !== "left" && eyeType !== "right") return;
    state.activeDiagnosticHints[eyeType] = String(hint || "").trim();
  }

  function clearGazeSamples() {
    state.gazeVector = { x: 0, y: 0 };
    state.gazeSamples = {
      primary: null,
      up: null,
      down: null,
    };
    state.gazePatternCue = "";
  }

  function markManualInteraction() {
    if (!state.isApplyingPreset) {
      clearDiagnosticHints();
      state.activePresetKey = "";
    }
  }

  function getConditionLabel(conditionValue) {
    const key = String(conditionValue || "")
      .toLowerCase()
      .trim();
    if (!key) return "";
    const groups = Object.values(SimCoreRef.CONDITION_LIBRARY);
    for (const group of groups) {
      for (const item of group) {
        if (String(item.value || "").toLowerCase() === key) {
          return item.label || "";
        }
      }
    }
    return "";
  }

  globalObj.AppState = {
    state,
    BASE_PUPIL_SIZE: SimCoreRef.BASE_PUPIL_SIZE,
    CONDITION_LIBRARY: SimCoreRef.CONDITION_LIBRARY,
    parseRGB: SimCoreRef.parseRGB,
    brightenColor: SimCoreRef.brightenColor,
    getReflexColor: SimCoreRef.getReflexColor,
    PresetRunner: PresetRunnerRef,
    clearDiagnosticHints,
    setDiagnosticHint,
    clearGazeSamples,
    markManualInteraction,
    getConditionLabel,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
