/*
 * Eye interaction and animation controller.
 */

(function attachEyeController(globalObj) {
  const AppStateRef = globalObj.AppState;
  const OutputWriterRef = globalObj.OutputWriter;
  const HEAD_TILT_ANGLE_DEG = 8;

  function getCoverController() {
    return globalObj.CoverController || null;
  }

  function computeFixationOffset(iris) {
    return getCoverController()?.computeFixationOffset(iris) || { x: 0, y: 0 };
  }

  function updateIrisTransform(iris) {
    if (!iris) return;
    const fixationOffset = computeFixationOffset(iris);
    const totalX =
      (iris.manualOffset?.x || 0) +
      (iris.presetOffset?.x || 0) +
      (iris.gazeOffset?.x || 0) +
      (iris.liveGazeOffset?.x || 0) +
      (fixationOffset.x || 0) +
      (iris.coverOffset?.x || 0) +
      (iris.microOffset?.x || 0) +
      (iris.backgroundOffset?.x || 0);
    const totalY =
      (iris.manualOffset?.y || 0) +
      (iris.presetOffset?.y || 0) +
      (iris.gazeOffset?.y || 0) +
      (iris.liveGazeOffset?.y || 0) +
      (fixationOffset.y || 0) +
      (iris.coverOffset?.y || 0) +
      (iris.microOffset?.y || 0) +
      (iris.backgroundOffset?.y || 0) +
      (iris.nystagmusOffset?.y || 0);
    const xWithNyst = totalX + (iris.nystagmusOffset?.x || 0);
    iris.style.transform = `translate(calc(-50% + ${xWithNyst}px), calc(-50% + ${totalY}px))`;

    const eye = iris.closest(".eye");
    if (eye) {
      eye.style.setProperty(
        "--corneal-reflex-micro-x",
        `${(xWithNyst * 0.08).toFixed(2)}px`,
      );
      eye.style.setProperty(
        "--corneal-reflex-micro-y",
        `${(totalY * 0.06).toFixed(2)}px`,
      );
    }
  }

  function initDraggable(iris) {
    const eye = iris.closest(".eye");
    if (!eye) return;

    let dragging = false;
    let eyeRect;
    let centreX;
    let centreY;
    let maxOffsetX;
    let maxOffsetY;

    function startDrag(event) {
      const manualEyeMoveToggle = document.getElementById(
        "manual-eye-move-toggle",
      );
      if (manualEyeMoveToggle && !manualEyeMoveToggle.checked) return;
      event.preventDefault();
      AppStateRef.markManualInteraction();
      dragging = true;
      iris.isDragging = true;
      iris.conditionApplied = false;
      eyeRect = eye.getBoundingClientRect();
      centreX = eyeRect.left + eyeRect.width / 2;
      centreY = eyeRect.top + eyeRect.height / 2;
      maxOffsetX = (eyeRect.width / 2 - iris.offsetWidth / 2) * 0.8;
      maxOffsetY = 30 * 0.8;

      if (event.type === "touchstart") {
        document.addEventListener("touchmove", onDrag, { passive: false });
        document.addEventListener("touchend", endDrag);
        return;
      }

      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", endDrag);
    }

    function onDrag(event) {
      if (!dragging) return;

      let pointerX;
      let pointerY;
      if (event.type === "touchmove") {
        pointerX = event.touches[0].clientX;
        pointerY = event.touches[0].clientY;
      } else {
        pointerX = event.clientX;
        pointerY = event.clientY;
      }

      let dx = pointerX - centreX;
      let dy = pointerY - centreY;

      if (Math.abs(dx) > maxOffsetX) dx = Math.sign(dx) * maxOffsetX;
      if (Math.abs(dy) > maxOffsetY) dy = Math.sign(dy) * maxOffsetY;

      iris.manualOffset = { x: dx, y: dy };
      updateIrisTransform(iris);

      if (document.body.classList.contains("reflex-on")) {
        const pupil = iris.querySelector(".pupil");
        if (pupil) {
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = Math.sqrt(
            maxOffsetX * maxOffsetX + maxOffsetY * maxOffsetY,
          );
          const factor = 1 + Math.min(distance / Math.max(maxDistance, 1), 1);
          const bright = AppStateRef.brightenColor(
            AppStateRef.state.baseReflexColor,
            factor,
          );
          pupil.style.background = `rgb(${bright.r}, ${bright.g}, ${bright.b})`;
        }
      }
    }

    function endDrag(event) {
      dragging = false;
      iris.isDragging = false;

      if (event.type === "touchend") {
        document.removeEventListener("touchmove", onDrag);
        document.removeEventListener("touchend", endDrag);
      } else {
        document.removeEventListener("mousemove", onDrag);
        document.removeEventListener("mouseup", endDrag);
      }

      OutputWriterRef.updateOutputForEye(eye);
    }

    iris.addEventListener("mousedown", startDrag);
    iris.addEventListener("touchstart", startDrag, { passive: false });
  }

  function cycloToAngle(eyeType, direction) {
    const value = String(direction || "none").toLowerCase();
    // Legacy compatibility for older preset keys.
    if (value === "up") return -12;
    if (value === "down") return 12;
    // Patient-facing mapping:
    // DOM left eye = patient RE, DOM right eye = patient LE.
    if (value === "in") return eyeType === "left" ? 12 : -12;
    if (value === "out") return eyeType === "left" ? -12 : 12;
    return 0;
  }

  function applyCycloVisual(eyeType, direction) {
    const iris = document.querySelector(`.eye[data-eye="${eyeType}"] .iris`);
    if (!iris) return;
    const baseDeg = cycloToAngle(eyeType, direction);
    iris.cycloBaseDeg = baseDeg;
    iris.classList.toggle("cyclo-active", baseDeg !== 0);
    iris.style.setProperty("--cyclo-angle", `${baseDeg}deg`);
  }

  function refreshCoverVisualState() {
    getCoverController()?.refreshCoverVisualState(updateIrisTransform);
  }

  function refreshCoverOffsets() {
    getCoverController()?.refreshCoverOffsets(updateIrisTransform);
  }

  function applyCoverState(eyeType, options = {}) {
    getCoverController()?.applyCoverState(
      eyeType,
      updateIrisTransform,
      options,
    );
  }

  function toggleCover(eyeType, options = {}) {
    getCoverController()?.toggleCover(eyeType, updateIrisTransform, options);
  }

  function getLightController() {
    return globalObj.LightController || null;
  }

  function setupLightPillControl() {
    getLightController()?.setupLightPillControl();
  }

  function refreshLightVisualState() {
    getLightController()?.refreshLightVisualState();
  }

  function refreshLightPupilResponse() {
    getLightController()?.refreshLightPupilResponse();
  }

  function setLightState(side, options = {}) {
    getLightController()?.setLightState(side, options);
  }

  function setRapdValue(value, options = {}) {
    getLightController()?.setRapdValue(value, options);
  }

  function setAmbientLevel(value, options = {}) {
    getLightController()?.setAmbientLevel(value, options);
  }

  function getEffectsController() {
    return globalObj.EyeEffectsController || null;
  }

  function startCycloJitterEngine() {
    getEffectsController()?.startCycloJitterEngine();
  }

  function startNystagmusEngine() {
    getEffectsController()?.startNystagmusEngine(updateIrisTransform);
  }

  function initPupilSlider(slider) {
    function updatePupil() {
      AppStateRef.markManualInteraction();
      refreshLightPupilResponse();
      OutputWriterRef.updateAllOutputs();
    }

    function snapToCenter() {
      const current = parseInt(slider.value, 10);
      if (Math.abs(current - AppStateRef.BASE_PUPIL_SIZE) <= 3) {
        slider.value = AppStateRef.BASE_PUPIL_SIZE;
        updatePupil();
      }
    }

    slider.addEventListener("input", updatePupil);
    slider.addEventListener("change", snapToCenter);
    slider.addEventListener("mouseup", snapToCenter);
    slider.addEventListener("touchend", snapToCenter);
    updatePupil();
  }

  function initPtosisSlider(slider) {
    slider.addEventListener("input", () => {
      AppStateRef.markManualInteraction();
      const eye = document.querySelector(
        `.eye[data-eye="${slider.dataset.eye}"]`,
      );
      const upperLid = eye?.querySelector(".upper-eyelid");
      if (!eye || !upperLid) return;
      upperLid.style.height = `${parseFloat(slider.value) * 1.5}px`;
      OutputWriterRef.updateOutputForEye(eye);
    });
  }

  function initFadeButton(button) {
    button.addEventListener("click", () => {
      AppStateRef.markManualInteraction();
      const eye = document.querySelector(
        `.eye[data-eye="${button.dataset.eye}"]`,
      );
      const iris = eye?.querySelector(".iris");
      if (!eye || !iris) return;
      iris.classList.toggle("faded");
      button.classList.toggle("active");
      OutputWriterRef.updateOutputForEye(eye);
    });
  }

  function blinkEyes() {
    getEffectsController()?.blinkEyes();
  }

  function startMicroSaccades() {
    getEffectsController()?.startMicroSaccades(updateIrisTransform);
  }

  function startBackgroundJitter() {
    getEffectsController()?.startBackgroundJitter(updateIrisTransform);
  }

  function setupInitialEyeAnimation() {
    const irises = Array.from(document.querySelectorAll(".iris"));
    if (!irises.length) return;

    const randomX = Math.random() * 60 - 30;
    const randomY = Math.random() * 60 - 30;

    irises.forEach((iris) => {
      iris.style.transition = "transform 0.2s ease-out";
      iris.style.transform = `translate(calc(-50% + ${randomX}px), calc(-50% + ${randomY}px))`;
    });

    setTimeout(() => {
      irises.forEach((iris) => {
        if (!iris.conditionApplied) {
          iris.style.transform = "translate(-50%, -50%)";
        }
      });

      setTimeout(() => {
        irises.forEach((iris) => {
          iris.style.transition = "";
        });
        startMicroSaccades();
        startBackgroundJitter();
        startNystagmusEngine();
        startCycloJitterEngine();
        refreshCoverVisualState();
        refreshCoverOffsets();
        refreshLightVisualState();
        refreshLightPupilResponse();
        setInterval(blinkEyes, 5000);
      }, 220);
    }, 260);
  }

  function applyHeadTiltVisual(direction) {
    const eyesContainer = document.querySelector(".eyes-container");
    if (!eyesContainer) return;

    const value = String(direction || "none").toLowerCase();
    let angle = 0;
    if (value === "right") angle = HEAD_TILT_ANGLE_DEG;
    if (value === "left") angle = -HEAD_TILT_ANGLE_DEG;

    eyesContainer.style.setProperty("--head-tilt-angle", `${angle}deg`);
  }

  globalObj.EyeController = {
    updateIrisTransform,
    initDraggable,
    initPupilSlider,
    initPtosisSlider,
    initFadeButton,
    setupLightPillControl,
    setupInitialEyeAnimation,
    applyHeadTiltVisual,
    applyCycloVisual,
    applyCoverState,
    toggleCover,
    setLightState,
    setRapdValue,
    setAmbientLevel,
    refreshLightPupilResponse,
    refreshCoverOffsets,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
