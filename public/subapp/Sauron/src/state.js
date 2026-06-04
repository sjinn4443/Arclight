import {
  DEFAULT_BASE_REFLEX_COLOR,
  DEFAULT_RETINOSCOPY_STATE,
} from "./constants.js";

export function createAppState() {
  return {
    baseReflexColor: { ...DEFAULT_BASE_REFLEX_COLOR },
    ...DEFAULT_RETINOSCOPY_STATE,
    retinoscopyRafId: 0,
    retinoscopyNeedsPosition: true,
    activeMcqLevel: "primary",
    activeMcqQuestions: [],
    corticalCataractPattern: null,
    microSaccadeIntervalId: 0,
    backgroundJitterIntervalId: 0,
    blinkIntervalId: 0,
    gazeIntervalId: 0,
    gazeReturnTimeoutId: 0,
    gazeShiftTimerId: 0,
    lastBlinkAtMs: 0,
    nystagmusRafId: 0,
    isManualEyeMoveEnabled: false,
    isGazeMode: false,
    isDilatedMode: false,
    isBabyMode: false,
    dilatedPreviousPupilValues: null,
    isTestMode: false,
    isTestRevealed: false,
    testCountdown: 0,
    testTimerId: 0,
    testConditionValue: null,
    testRevealLabel: "",
    testPreviousState: null,
    testLastRefraction: null,
    testRoundIndex: 0,
  };
}
