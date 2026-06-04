export function wireUiEvents(app) {
  const {
    canvas,
    reTab,
    leTab,
    flashToggleBtn,
    redToggleBtn,
    diagToggleBtn,
    burgerIcon,
    sideMenu,
    sideMenuBackdrop,
    mcqPrimaryBtn,
    mcqIntermediateBtn,
    mcqAdvancedBtn,
    mcqModal,
    closeMcqModal,
    mcqSubmitBtn,
    mcqRestartBtn,
    toolPen,
    toolErase,
    toolHaemorrhage,
    strokeSettingsToggle,
    strokeSettingsPanel,
    penWidthSlider,
    penWidthValue,
    analyzeBtn,
    reportBtn,
    infoIcon,
    infoModal,
    closeInfoModal,
    patientInfoToggle,
    patientInfoModal,
    closePatientInfo,
    savePatientInfo,
  } = app.elements;

  const toolButtons = {
    pen: toolPen,
    erase: toolErase,
    haemorrhage: toolHaemorrhage,
  };

  function setToggleButtonState(button, isActive) {
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }

  function setActiveTool(tool) {
    app.state.currentTool = tool;
    Object.keys(toolButtons).forEach((name) => {
      const isActive = name === tool;
      toolButtons[name].classList.toggle("active", isActive);
      toolButtons[name].setAttribute("aria-pressed", String(isActive));
    });
  }

  function openModal(modalElement) {
    modalElement.style.display = "block";
  }

  function closeModal(modalElement) {
    modalElement.style.display = "none";
  }

  function toggleModal(modalElement) {
    modalElement.style.display =
      modalElement.style.display === "block" ? "none" : "block";
  }

  function setStrokeSettingsOpen(isOpen) {
    strokeSettingsPanel.hidden = !isOpen;
    strokeSettingsToggle.classList.toggle("active", isOpen);
    strokeSettingsToggle.setAttribute("aria-expanded", String(isOpen));
  }

  function syncPenWidthUi() {
    const penWidth = app.state.penLineWidth;
    penWidthSlider.value = String(penWidth);
    penWidthValue.textContent = `${penWidth}px`;
  }

  canvas.addEventListener("mousedown", app.canvasController.startDrawing);
  canvas.addEventListener("touchstart", app.canvasController.startDrawing);
  canvas.addEventListener("mousemove", app.canvasController.draw);
  canvas.addEventListener("touchmove", app.canvasController.draw);
  canvas.addEventListener("mouseup", app.canvasController.endDrawing);
  canvas.addEventListener("touchend", app.canvasController.endDrawing);

  flashToggleBtn.addEventListener("click", () => {
    app.state.flashDot = !app.state.flashDot;
    setToggleButtonState(flashToggleBtn, app.state.flashDot);

    if (app.state.flashDot) {
      app.state.dotInterval = window.setInterval(() => {
        app.state.dotVisible = !app.state.dotVisible;
        app.canvasController.redraw();
      }, 100);
    } else {
      window.clearInterval(app.state.dotInterval);
      app.state.dotInterval = null;
      app.state.dotVisible = true;
      app.canvasController.redraw();
    }
  });

  redToggleBtn.addEventListener("click", () => {
    app.state.redMode = !app.state.redMode;
    setToggleButtonState(redToggleBtn, app.state.redMode);
    app.canvasController.redraw();
  });

  diagToggleBtn.addEventListener("click", () => {
    app.state.diagMode = !app.state.diagMode;
    setToggleButtonState(diagToggleBtn, app.state.diagMode);
    app.canvasController.redraw();
  });

  reTab.addEventListener("click", () => {
    app.state.currentEye = "RE";
    reTab.classList.add("active");
    leTab.classList.remove("active");
    app.canvasController.redraw();
  });

  leTab.addEventListener("click", () => {
    app.state.currentEye = "LE";
    leTab.classList.add("active");
    reTab.classList.remove("active");
    app.canvasController.redraw();
  });

  infoIcon.addEventListener("click", () => {
    toggleModal(infoModal);
  });

  burgerIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    app.mcqController.toggleSideMenu();
  });

  sideMenu.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  sideMenuBackdrop.addEventListener(
    "click",
    app.mcqController.handleBackdropClick,
  );

  mcqPrimaryBtn.addEventListener("click", () => {
    app.mcqController.startLevel("primary");
  });

  mcqIntermediateBtn.addEventListener("click", () => {
    app.mcqController.startLevel("intermediate");
  });

  mcqAdvancedBtn.addEventListener("click", () => {
    app.mcqController.startLevel("advanced");
  });

  closeMcqModal.addEventListener("click", app.mcqController.closeModal);
  mcqSubmitBtn.addEventListener("click", app.mcqController.submitLevel);
  mcqRestartBtn.addEventListener("click", app.mcqController.restartLevel);

  strokeSettingsToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setStrokeSettingsOpen(strokeSettingsPanel.hidden);
  });

  strokeSettingsPanel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  penWidthSlider.addEventListener("input", (event) => {
    const nextWidth = Number.parseInt(event.target.value, 10);
    if (Number.isNaN(nextWidth)) {
      return;
    }

    app.state.penLineWidth = nextWidth;
    penWidthValue.textContent = `${nextWidth}px`;
    app.canvasController.redraw();
  });

  closeInfoModal.addEventListener("click", () => {
    closeModal(infoModal);
  });

  patientInfoToggle.addEventListener("click", () => {
    openModal(patientInfoModal);
  });

  closePatientInfo.addEventListener("click", () => {
    closeModal(patientInfoModal);
  });

  savePatientInfo.addEventListener("click", () => {
    closeModal(patientInfoModal);
  });

  window.addEventListener("click", (event) => {
    if (event.target === infoModal) {
      closeModal(infoModal);
    }

    if (event.target === patientInfoModal) {
      closeModal(patientInfoModal);
    }

    app.mcqController.handleModalBackdropClick(event);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      app.mcqController.handleEscape();
    }
  });

  toolPen.addEventListener("click", () => setActiveTool("pen"));
  toolErase.addEventListener("click", () => setActiveTool("erase"));
  toolHaemorrhage.addEventListener("click", () => setActiveTool("haemorrhage"));

  analyzeBtn.addEventListener("click", app.analysisController.analyzeDrawing);
  reportBtn.addEventListener("click", app.reportController.generateReport);

  window.addEventListener("resize", app.canvasController.resizeCanvas);

  setToggleButtonState(flashToggleBtn, app.state.flashDot);
  setToggleButtonState(redToggleBtn, app.state.redMode);
  setToggleButtonState(diagToggleBtn, app.state.diagMode);
  app.mcqController.setSideMenuOpen(false);
  setStrokeSettingsOpen(false);
  syncPenWidthUi();
  setActiveTool(app.state.currentTool);
  app.setReportButtonEnabled(false);
  app.canvasController.resizeCanvas();
}
