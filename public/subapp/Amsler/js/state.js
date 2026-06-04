import { TOOL_STYLES } from "./constants.js";

export function createInitialState() {
  return {
    flashDot: false,
    dotVisible: true,
    dotInterval: null,
    redMode: false,
    diagMode: false,
    strokes: {
      RE: [],
      LE: [],
    },
    currentStroke: null,
    isDrawing: false,
    currentEye: "RE",
    currentTool: "pen",
    penLineWidth: TOOL_STYLES.pen.lineWidth,
    lastAnalysisResults: null,
    analysisDirty: true,
  };
}

export function markAnalysisDirty(app) {
  app.state.analysisDirty = true;
  app.state.lastAnalysisResults = null;
  app.setReportButtonEnabled(false);
}
