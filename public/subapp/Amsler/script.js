import { createCanvasController } from "./js/canvas.js";
import { createAnalysisController } from "./js/analysis.js";
import { createReportController } from "./js/report.js";
import { createMcqController } from "./js/mcq.js";
import { createInitialState, markAnalysisDirty } from "./js/state.js";
import { wireUiEvents } from "./js/ui.js";

function getRequiredElements() {
  const canvas = document.getElementById("gridCanvas");
  const ctx = canvas.getContext("2d");

  return {
    canvas,
    ctx,
    analyzeBtn: document.getElementById("analyzeBtn"),
    reportBtn: document.getElementById("reportBtn"),
    resultText: document.querySelector(".results p"),
    flashToggleBtn: document.getElementById("flashToggle"),
    redToggleBtn: document.getElementById("redToggle"),
    diagToggleBtn: document.getElementById("diagToggle"),
    burgerIcon: document.getElementById("burger-icon"),
    sideMenu: document.getElementById("sideMenu"),
    sideMenuBackdrop: document.getElementById("sideMenuBackdrop"),
    mcqPrimaryBtn: document.getElementById("mcqPrimaryBtn"),
    mcqIntermediateBtn: document.getElementById("mcqIntermediateBtn"),
    mcqAdvancedBtn: document.getElementById("mcqAdvancedBtn"),
    mcqModal: document.getElementById("mcqModal"),
    closeMcqModal: document.getElementById("closeMcqModal"),
    mcqTitle: document.getElementById("mcqTitle"),
    mcqProgress: document.getElementById("mcqProgress"),
    mcqList: document.getElementById("mcqList"),
    mcqFeedback: document.getElementById("mcqFeedback"),
    mcqSubmitBtn: document.getElementById("mcqSubmitBtn"),
    mcqRestartBtn: document.getElementById("mcqRestartBtn"),
    reTab: document.getElementById("reTab"),
    leTab: document.getElementById("leTab"),
    infoIcon: document.getElementById("info-icon"),
    infoModal: document.getElementById("infoModal"),
    closeInfoModal: document.getElementById("closeModal"),
    patientInfoToggle: document.getElementById("patientInfoToggle"),
    patientInfoModal: document.getElementById("patientInfoModal"),
    closePatientInfo: document.getElementById("closePatientInfo"),
    savePatientInfo: document.getElementById("savePatientInfo"),
    toolPen: document.getElementById("toolPen"),
    toolErase: document.getElementById("toolErase"),
    toolHaemorrhage: document.getElementById("toolHaemorrhage"),
    strokeSettingsToggle: document.getElementById("strokeSettingsToggle"),
    strokeSettingsPanel: document.getElementById("strokeSettingsPanel"),
    penWidthSlider: document.getElementById("penWidthSlider"),
    penWidthValue: document.getElementById("penWidthValue"),
    patientName: document.getElementById("patientName"),
    patientDate: document.getElementById("patientDate"),
    reportSection: document.getElementById("reportSection"),
  };
}

function createApp() {
  const app = {
    elements: getRequiredElements(),
    state: createInitialState(),
  };

  app.setReportButtonEnabled = (isEnabled) => {
    app.elements.reportBtn.disabled = !isEnabled;
  };

  app.markAnalysisDirty = () => {
    markAnalysisDirty(app);
  };

  app.canvasController = createCanvasController(app);
  app.analysisController = createAnalysisController(app);
  app.reportController = createReportController(app);
  app.mcqController = createMcqController(app);

  return app;
}

const app = createApp();
wireUiEvents(app);
