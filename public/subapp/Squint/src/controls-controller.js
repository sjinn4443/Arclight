/*
 * Controls, reset, and preset application controller.
 */

(function attachControlsController(globalObj) {
  const AppStateRef = globalObj.AppState;
  const OutputWriterRef = globalObj.OutputWriter;

  function updateIrisColour() {
    if (document.body.classList.contains("reflex-on")) return;

    const irisSelect = document.getElementById("iris-colour");
    const root = getComputedStyle(document.documentElement);
    let colour = root.getPropertyValue("--iris-green").trim();

    switch (irisSelect?.value) {
      case "dark-brown":
        colour = root.getPropertyValue("--iris-dark-brown").trim();
        break;
      case "light-brown":
        colour = root.getPropertyValue("--iris-light-brown").trim();
        break;
      case "blue":
        colour = root.getPropertyValue("--iris-blue").trim();
        break;
      default:
        colour = root.getPropertyValue("--iris-green").trim();
        break;
    }

    document.querySelectorAll(".iris").forEach((iris) => {
      iris.style.backgroundColor = colour;
    });
  }

  function updateReflexSliderVisual(value) {
    const slider = document.getElementById("reflex-color-slider");
    if (!slider) return;
    slider.style.backgroundColor = AppStateRef.getReflexColor(value);
  }

  function setupReflexControls() {
    const irisSelect = document.getElementById("iris-colour");
    const suddenToggle = document.getElementById("toggle-sudden");
    const suddenLabel = document.getElementById("sudden-label");
    const reflexSlider = document.getElementById("reflex-color-slider");
    const painToggle = document.getElementById("toggle-pain");
    const traumaToggle = document.getElementById("toggle-trauma");
    const fatigableToggle = document.getElementById("toggle-fatigable");
    const diplopiaToggle = document.getElementById("toggle-diplopia");
    const headTilt = document.getElementById("head-tilt");
    const cycloRight = document.getElementById("cyclo-re");
    const cycloLeft = document.getElementById("cyclo-le");
    const nystToggle = document.getElementById("toggle-nystagmus");
    const nystDirection = document.getElementById("nyst-direction");
    const nystWave = document.getElementById("nyst-wave");
    const nystRate = document.getElementById("nyst-rate");
    const gazeToggle = document.getElementById("gaze-toggle");
    const dilatedToggle = document.getElementById("toggle-dilated");
    const babyToggle = document.getElementById("baby-toggle");
    const manualEyeMoveToggle = document.getElementById(
      "manual-eye-move-toggle",
    );
    const advancedSignsToggle = document.getElementById(
      "advanced-signs-toggle",
    );
    const advancedSignsGlyph = document.getElementById("advanced-signs-glyph");
    const advancedSignsPanel = document.getElementById("advanced-signs-panel");
    const coverReBtn = document.getElementById("cover-re-btn");
    const coverLeBtn = document.getElementById("cover-le-btn");
    const ambientToggle = document.getElementById("ambient-toggle");

    irisSelect?.addEventListener("change", () => {
      AppStateRef.markManualInteraction();
      if (document.body.classList.contains("reflex-on")) {
        document.body.classList.remove("reflex-on");
        document.querySelectorAll(".pupil").forEach((pupil) => {
          pupil.style.background = "#000";
        });
      }
      updateIrisColour();
      OutputWriterRef.updateAllOutputs();
    });

    suddenToggle?.addEventListener("change", () => {
      AppStateRef.markManualInteraction();
      suddenLabel?.classList.toggle("is-on", suddenToggle.checked);
      OutputWriterRef.updateAllOutputs();
    });

    painToggle?.addEventListener("change", () => {
      OutputWriterRef.updateAllOutputs();
    });

    traumaToggle?.addEventListener("change", () => {
      OutputWriterRef.updateAllOutputs();
    });

    fatigableToggle?.addEventListener("change", () => {
      OutputWriterRef.updateAllOutputs();
    });

    diplopiaToggle?.addEventListener("change", () => {
      OutputWriterRef.updateAllOutputs();
    });

    headTilt?.addEventListener("change", () => {
      globalObj.EyeController?.applyHeadTiltVisual(headTilt.value);
      OutputWriterRef.updateAllOutputs();
    });

    cycloRight?.addEventListener("change", () => {
      AppStateRef.markManualInteraction();
      globalObj.EyeController?.applyCycloVisual("left", cycloRight.value);
      OutputWriterRef.updateAllOutputs();
    });

    cycloLeft?.addEventListener("change", () => {
      AppStateRef.markManualInteraction();
      globalObj.EyeController?.applyCycloVisual("right", cycloLeft.value);
      OutputWriterRef.updateAllOutputs();
    });

    const nystUpdate = () => {
      AppStateRef.markManualInteraction();
      OutputWriterRef.updateAllOutputs();
    };
    nystToggle?.addEventListener("change", nystUpdate);
    nystDirection?.addEventListener("change", nystUpdate);
    nystWave?.addEventListener("change", nystUpdate);
    nystRate?.addEventListener("change", nystUpdate);

    function syncLiveGazeMode() {
      const enabled = Boolean(gazeToggle?.checked);
      document.body.classList.toggle("is-live-gaze-enabled", enabled);
      globalObj.GazeController?.setLiveMotionEnabled(enabled);
    }

    function applyDilatedMode(isEnabled) {
      const targetSize = isEnabled ? 50 : AppStateRef.BASE_PUPIL_SIZE;
      document.body.classList.toggle("is-dilated-mode", Boolean(isEnabled));
      document.querySelectorAll(".slider[data-eye]").forEach((slider) => {
        slider.value = String(targetSize);
        slider.dispatchEvent(new Event("input"));
      });
    }

    function updateOutputsAfterLayout() {
      const refreshOutputs = () => {
        OutputWriterRef.updateAllOutputs();
      };
      requestAnimationFrame(() => {
        refreshOutputs();
      });
      setTimeout(refreshOutputs, 280);
    }

    function syncBabyMode() {
      const enabled = Boolean(babyToggle?.checked);
      AppStateRef.state.isBabyMode = enabled;
      document
        .querySelector(".eyes-card")
        ?.classList.toggle("is-baby-mode", enabled);
      document.body.classList.toggle("is-baby-mode", enabled);
    }

    function syncManualEyeMove() {
      const enabled = manualEyeMoveToggle ? manualEyeMoveToggle.checked : true;
      document.body.classList.toggle("is-manual-eye-move-enabled", enabled);
      document.querySelectorAll(".iris").forEach((iris) => {
        iris.classList.toggle("is-manual-drag-enabled", enabled);
      });
    }

    babyToggle?.addEventListener("change", () => {
      AppStateRef.markManualInteraction();
      syncBabyMode();
      if (AppStateRef.state.isLiveMotionEnabled) {
        globalObj.GazeController?.setLiveMotionEnabled(true);
      }
      OutputWriterRef.updateAllOutputs();
    });

    gazeToggle?.addEventListener("change", () => {
      syncLiveGazeMode();
      updateOutputsAfterLayout();
    });

    dilatedToggle?.addEventListener("change", () => {
      AppStateRef.markManualInteraction();
      applyDilatedMode(dilatedToggle.checked);
      OutputWriterRef.updateAllOutputs();
    });

    manualEyeMoveToggle?.addEventListener("change", () => {
      AppStateRef.markManualInteraction();
      syncManualEyeMove();
    });

    function setAdvancedSignsOpen(isOpen) {
      if (!advancedSignsToggle || !advancedSignsPanel) return;
      const open = Boolean(isOpen);
      advancedSignsPanel.hidden = !open;
      advancedSignsToggle.classList.toggle("is-open", open);
      advancedSignsToggle.setAttribute(
        "aria-expanded",
        open ? "true" : "false",
      );
      if (advancedSignsGlyph) {
        advancedSignsGlyph.textContent = open ? "-" : "+";
      }
    }

    advancedSignsToggle?.addEventListener("click", () => {
      setAdvancedSignsOpen(advancedSignsPanel?.hidden);
    });

    coverReBtn?.addEventListener("click", () => {
      // Patient-facing mapping: RE = DOM left eye.
      globalObj.EyeController?.toggleCover("left");
    });

    coverLeBtn?.addEventListener("click", () => {
      // Patient-facing mapping: LE = DOM right eye.
      globalObj.EyeController?.toggleCover("right");
    });

    ambientToggle?.addEventListener("change", () => {
      const value = ambientToggle.checked ? 100 : 0;
      globalObj.EyeController?.setAmbientLevel(value);
    });

    reflexSlider?.addEventListener("input", () => {
      AppStateRef.markManualInteraction();
      const value = parseInt(reflexSlider.value, 10);
      const color = AppStateRef.getReflexColor(value);
      updateReflexSliderVisual(value);
      AppStateRef.state.baseReflexColor = AppStateRef.parseRGB(color);
      document.body.classList.add("reflex-on");
      document.querySelectorAll(".iris").forEach((iris) => {
        iris.style.backgroundColor = "#000";
      });
      document.querySelectorAll(".pupil").forEach((pupil) => {
        pupil.style.background = color;
      });
      OutputWriterRef.updateAllOutputs();
    });

    updateReflexSliderVisual(parseInt(reflexSlider?.value || "66", 10));
    globalObj.EyeController?.applyHeadTiltVisual(headTilt?.value || "none");
    globalObj.EyeController?.applyCycloVisual(
      "left",
      cycloRight?.value || "none",
    );
    globalObj.EyeController?.applyCycloVisual(
      "right",
      cycloLeft?.value || "none",
    );
    globalObj.EyeController?.applyCoverState("none", { silent: true });
    globalObj.EyeController?.setupLightPillControl();
    AppStateRef.state.lightPillSide = "right";
    AppStateRef.state.lightPillPos = 0.5;
    globalObj.EyeController?.setRapdValue(0, { silent: true });
    globalObj.EyeController?.setLightState("none", {
      allowToggle: false,
      silent: true,
    });
    if (ambientToggle) {
      ambientToggle.checked =
        Number(AppStateRef.state.ambientLevel ?? 100) >= 50;
    }
    globalObj.EyeController?.setAmbientLevel(
      AppStateRef.state.ambientLevel ?? 100,
      { silent: true },
    );
    syncLiveGazeMode();
    if (dilatedToggle?.checked) applyDilatedMode(true);
    syncBabyMode();
    syncManualEyeMove();
    setAdvancedSignsOpen(false);
  }

  function resetEyes() {
    AppStateRef.clearDiagnosticHints();
    AppStateRef.state.activePresetKey = "";
    AppStateRef.state.pupilReactivityByEye.left = 1;
    AppStateRef.state.pupilReactivityByEye.right = 1;
    AppStateRef.state.pupilModelByEye.left = "normal";
    AppStateRef.state.pupilModelByEye.right = "normal";
    AppStateRef.clearGazeSamples?.();
    document.body.classList.remove("reflex-on");
    document.querySelectorAll(".pupil").forEach((pupil) => {
      pupil.style.background = "#000";
    });
    if (globalObj.GazeController?.resetToPrimary) {
      globalObj.GazeController.resetToPrimary({ silent: true });
    }
    clearModifiersOnly();

    document.querySelectorAll(".eye").forEach((eye) => {
      const eyeType = eye.dataset.eye;
      const iris = eye.querySelector(".iris");
      if (iris) {
        iris.manualOffset = { x: 0, y: 0 };
        iris.presetOffset = { x: 0, y: 0 };
        iris.gazeOffset = { x: 0, y: 0 };
        iris.liveGazeOffset = { x: 0, y: 0 };
        iris.coverOffset = { x: 0, y: 0 };
        iris.nystagmusOffset = { x: 0, y: 0 };
        iris.microOffset = { x: 0, y: 0 };
        iris.backgroundOffset = { x: 0, y: 0 };
        iris.conditionApplied = false;
        iris.isDragging = false;
        iris.classList.remove("faded");
        globalObj.EyeController?.updateIrisTransform(iris);
      }

      const fadeButton = document.querySelector(
        `.fade-button[data-eye="${eyeType}"]`,
      );
      fadeButton?.classList.remove("active");

      const ptosisSlider = document.querySelector(
        `.vertical-eye-slider[data-eye="${eyeType}"]`,
      );
      if (ptosisSlider) {
        ptosisSlider.value = "0";
        ptosisSlider.dispatchEvent(new Event("input"));
      }

      const pupilSlider = document.querySelector(
        `.slider[data-eye="${eyeType}"]`,
      );
      if (pupilSlider) {
        pupilSlider.value = String(AppStateRef.BASE_PUPIL_SIZE);
        pupilSlider.dispatchEvent(new Event("input"));
      }
    });

    globalObj.EyeController?.applyCoverState("none", { silent: true });
    AppStateRef.state.lightPillSide = "right";
    AppStateRef.state.lightPillPos = 0.5;
    globalObj.EyeController?.setRapdValue(0, { silent: true });
    globalObj.EyeController?.setLightState("none", {
      allowToggle: false,
      silent: true,
    });
    updateIrisColour();
  }

  function clearModifiersOnly() {
    const suddenToggle = document.getElementById("toggle-sudden");
    const suddenLabel = document.getElementById("sudden-label");
    const painToggle = document.getElementById("toggle-pain");
    const traumaToggle = document.getElementById("toggle-trauma");
    const gazeToggle = document.getElementById("gaze-toggle");
    const dilatedToggle = document.getElementById("toggle-dilated");
    const fatigableToggle = document.getElementById("toggle-fatigable");
    const diplopiaToggle = document.getElementById("toggle-diplopia");
    const headTilt = document.getElementById("head-tilt");
    const cycloRight = document.getElementById("cyclo-re");
    const cycloLeft = document.getElementById("cyclo-le");
    const nystToggle = document.getElementById("toggle-nystagmus");
    const nystDirection = document.getElementById("nyst-direction");
    const nystWave = document.getElementById("nyst-wave");
    const nystRate = document.getElementById("nyst-rate");
    if (suddenToggle) suddenToggle.checked = false;
    suddenLabel?.classList.remove("is-on");
    if (painToggle) painToggle.checked = false;
    if (traumaToggle) traumaToggle.checked = false;
    if (gazeToggle) gazeToggle.checked = false;
    globalObj.GazeController?.setLiveMotionEnabled(false);
    if (dilatedToggle) dilatedToggle.checked = false;
    document.body.classList.remove("is-dilated-mode");
    if (fatigableToggle) fatigableToggle.checked = false;
    if (diplopiaToggle) diplopiaToggle.checked = false;
    if (headTilt) headTilt.value = "none";
    if (cycloRight) cycloRight.value = "none";
    if (cycloLeft) cycloLeft.value = "none";
    if (nystToggle) nystToggle.checked = false;
    if (nystDirection) nystDirection.value = "horizontal";
    if (nystWave) nystWave.value = "jerk";
    if (nystRate) nystRate.value = "slow";
    globalObj.EyeController?.applyHeadTiltVisual("none");
    globalObj.EyeController?.applyCycloVisual("left", "none");
    globalObj.EyeController?.applyCycloVisual("right", "none");
  }

  function setEyeTransform(eyeType, x, y) {
    const iris = document.querySelector(`.eye[data-eye="${eyeType}"] .iris`);
    if (!iris) return;
    iris.manualOffset = { x: 0, y: 0 };
    iris.presetOffset = { x, y };
    globalObj.EyeController?.updateIrisTransform(iris);
    iris.conditionApplied = true;
  }

  function setPtosis(eyeType, value) {
    const slider = document.querySelector(
      `.vertical-eye-slider[data-eye="${eyeType}"]`,
    );
    if (!slider) return;
    slider.value = String(value);
    slider.dispatchEvent(new Event("input"));
  }

  function setPupil(eyeType, value) {
    const slider = document.querySelector(`.slider[data-eye="${eyeType}"]`);
    if (!slider) return;
    slider.value = String(value);
    slider.dispatchEvent(new Event("input"));
  }

  function setFaded(eyeType, active) {
    const iris = document.querySelector(`.eye[data-eye="${eyeType}"] .iris`);
    const button = document.querySelector(
      `.fade-button[data-eye="${eyeType}"]`,
    );
    if (iris) {
      iris.classList.toggle("faded", active);
      if (active) iris.conditionApplied = true;
    }
    button?.classList.toggle("active", active);
  }

  function setCyclo(eyeType, direction) {
    const controlId = eyeType === "right" ? "cyclo-re" : "cyclo-le";
    const control = document.getElementById(controlId);
    if (control) control.value = String(direction || "none");
    const domEye = eyeType === "right" ? "left" : "right";
    globalObj.EyeController?.applyCycloVisual(domEye, direction);
  }

  function setNystagmus(
    enabled,
    direction = "horizontal",
    wave = "jerk",
    rate = "slow",
  ) {
    const nystToggle = document.getElementById("toggle-nystagmus");
    const nystDirection = document.getElementById("nyst-direction");
    const nystWave = document.getElementById("nyst-wave");
    const nystRate = document.getElementById("nyst-rate");
    if (nystToggle) nystToggle.checked = Boolean(enabled);
    if (nystDirection) nystDirection.value = direction;
    if (nystWave) nystWave.value = wave;
    if (nystRate) nystRate.value = rate;
  }

  function setPupilReactivity(eyeType, gain) {
    const key = String(eyeType || "").toLowerCase();
    if (key !== "left" && key !== "right") return;
    const value = Number(gain);
    if (!Number.isFinite(value)) return;
    const clamped = Math.min(Math.max(value, 0), 1);
    AppStateRef.state.pupilReactivityByEye[key] = clamped;
  }

  function setPupilModel(eyeType, model) {
    const key = String(eyeType || "").toLowerCase();
    if (key !== "left" && key !== "right") return;
    const raw = String(model || "normal").toLowerCase();
    const normalised = raw.replace(/_/g, "-");
    const allowed = new Set([
      "normal",
      "horner",
      "adie",
      "peaked",
      "argyll-robertson",
      "acute-angle-closure",
      "pharmacological-mydriasis",
      "pharmacological-miosis",
      "traumatic-mydriasis",
      "traumatic-miotic",
    ]);
    if (!allowed.has(normalised)) return;
    AppStateRef.state.pupilModelByEye[key] = normalised;
  }

  function applyCondition(conditionValue, displayLabel, options = {}) {
    const key = String(conditionValue || "")
      .toLowerCase()
      .trim();
    if (!key) return;
    if (!options.suppressFlash) {
      globalObj.UiShell?.showConditionFlashLabel(
        displayLabel || AppStateRef.getConditionLabel(key),
      );
    }

    AppStateRef.state.isApplyingPreset = true;
    resetEyes();
    AppStateRef.state.activePresetKey = key;
    AppStateRef.state.pupilReactivityByEye.left = 1;
    AppStateRef.state.pupilReactivityByEye.right = 1;
    AppStateRef.state.pupilModelByEye.left = "normal";
    AppStateRef.state.pupilModelByEye.right = "normal";
    AppStateRef.clearGazeSamples?.();

    AppStateRef.PresetRunner.runPresetCase(key, {
      enableSudden() {
        const suddenToggle = document.getElementById("toggle-sudden");
        suddenToggle.checked = true;
        document.getElementById("sudden-label")?.classList.add("is-on");
      },
      enablePain() {
        const painToggle = document.getElementById("toggle-pain");
        if (painToggle) painToggle.checked = true;
      },
      enableTrauma() {
        const traumaToggle = document.getElementById("toggle-trauma");
        if (traumaToggle) traumaToggle.checked = true;
      },
      setEyeTransform,
      setPtosis,
      setPupil,
      setFaded,
      setCyclo,
      setNystagmus,
      setPupilReactivity,
      setPupilModel,
      setRapdValue(value) {
        globalObj.EyeController?.setRapdValue(value, { silent: true });
      },
      setDiagnosticHint: AppStateRef.setDiagnosticHint,
    });

    AppStateRef.state.isApplyingPreset = false;
    if (globalObj.GazeController?.applyDirectionFromPreset) {
      globalObj.GazeController.applyDirectionFromPreset("primary");
    }
    OutputWriterRef.updateAllOutputs();
  }

  globalObj.ControlsController = {
    updateIrisColour,
    setupReflexControls,
    resetEyes,
    setEyeTransform,
    setPtosis,
    setPupil,
    setFaded,
    applyCondition,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
