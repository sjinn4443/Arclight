/*
 * Squint app bootstrap.
 * Wires modular controllers together.
 */

const AppStateRef = globalThis.AppState;
const OutputWriterRef = globalThis.OutputWriter;
const EyeControllerRef = globalThis.EyeController;
const GazeControllerRef = globalThis.GazeController;
const ControlsControllerRef = globalThis.ControlsController;
const UiShellRef = globalThis.UiShell;

function assertModulesReady() {
  if (!AppStateRef) throw new Error("AppState module missing");
  if (!OutputWriterRef) throw new Error("OutputWriter module missing");
  if (!EyeControllerRef) throw new Error("EyeController module missing");
  if (!GazeControllerRef) throw new Error("GazeController module missing");
  if (!ControlsControllerRef)
    throw new Error("ControlsController module missing");
  if (!UiShellRef) throw new Error("UiShell module missing");
}

function init() {
  assertModulesReady();

  document.querySelectorAll(".iris").forEach((iris) => {
    iris.manualOffset = { x: 0, y: 0 };
    iris.presetOffset = { x: 0, y: 0 };
    iris.gazeOffset = { x: 0, y: 0 };
    iris.liveGazeOffset = { x: 0, y: 0 };
    iris.coverOffset = { x: 0, y: 0 };
    iris.microOffset = { x: 0, y: 0 };
    iris.backgroundOffset = { x: 0, y: 0 };
    iris.nystagmusOffset = { x: 0, y: 0 };
    iris.isDragging = false;
    iris.conditionApplied = false;
    EyeControllerRef.initDraggable(iris);
  });

  document
    .querySelectorAll(".slider[data-eye]")
    .forEach(EyeControllerRef.initPupilSlider);
  document
    .querySelectorAll(".vertical-eye-slider")
    .forEach(EyeControllerRef.initPtosisSlider);
  document
    .querySelectorAll(".fade-button")
    .forEach(EyeControllerRef.initFadeButton);

  ControlsControllerRef.setupReflexControls();
  GazeControllerRef.setupGazePad();
  UiShellRef.setupSidebar();
  UiShellRef.setupInfoPopup();
  UiShellRef.renderPresetList(AppStateRef.state.activePresetLevel);
  ControlsControllerRef.updateIrisColour();
  OutputWriterRef.updateAllOutputs();
  EyeControllerRef.setupInitialEyeAnimation();
}

document.addEventListener("DOMContentLoaded", init);

// Keep compatibility entry points for existing tooling/UI hooks.
window.applyCondition = ControlsControllerRef.applyCondition;
window.CONDITION_LIBRARY = AppStateRef?.CONDITION_LIBRARY;
