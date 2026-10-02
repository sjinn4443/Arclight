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
    newAssessmentBtn,
    assessmentResetStatus,
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
  const modalTriggers = new Map();
  let resetConfirmTimer = null;

  function getFocusable(container) {
    return Array.from(
      container.querySelectorAll(
        "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])",
      ),
    ).filter(
      (element) => !element.hidden && element.getClientRects().length > 0,
    );
  }

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

  function openModal(modalElement, trigger) {
    modalTriggers.set(modalElement, trigger || document.activeElement);
    modalElement.hidden = false;
    modalElement.style.display = "block";
    const focusTarget = getFocusable(modalElement)[0];
    focusTarget?.focus();
  }

  function closeModal(modalElement, restoreFocus = true) {
    modalElement.style.display = "none";
    modalElement.hidden = true;
    if (restoreFocus) {
      modalTriggers.get(modalElement)?.focus?.();
    }
    modalTriggers.delete(modalElement);
  }

  function toggleModal(modalElement, trigger) {
    if (modalElement.hidden) {
      openModal(modalElement, trigger);
    } else {
      closeModal(modalElement);
    }
  }

  function trapModalFocus(event, modalElement) {
    if (event.key !== "Tab" || modalElement.hidden) return;
    const focusable = getFocusable(modalElement);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
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

  canvas.addEventListener("pointerdown", app.canvasController.startDrawing);
  canvas.addEventListener("pointermove", app.canvasController.draw);
  canvas.addEventListener("pointerup", app.canvasController.endDrawing);
  canvas.addEventListener("pointercancel", app.canvasController.endDrawing);
  canvas.addEventListener(
    "lostpointercapture",
    app.canvasController.endDrawing,
  );

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
    app.invalidateReport();
    app.state.redMode = !app.state.redMode;
    setToggleButtonState(redToggleBtn, app.state.redMode);
    app.canvasController.redraw();
  });

  diagToggleBtn.addEventListener("click", () => {
    app.invalidateReport();
    app.state.diagMode = !app.state.diagMode;
    setToggleButtonState(diagToggleBtn, app.state.diagMode);
    app.canvasController.redraw();
  });

  reTab.addEventListener("click", () => {
    app.state.currentEye = "RE";
    reTab.classList.add("active");
    leTab.classList.remove("active");
    reTab.setAttribute("aria-selected", "true");
    leTab.setAttribute("aria-selected", "false");
    app.canvasController.redraw();
  });

  leTab.addEventListener("click", () => {
    app.state.currentEye = "LE";
    leTab.classList.add("active");
    reTab.classList.remove("active");
    leTab.setAttribute("aria-selected", "true");
    reTab.setAttribute("aria-selected", "false");
    app.canvasController.redraw();
  });

  infoIcon.addEventListener("click", () => {
    toggleModal(infoModal, infoIcon);
    infoIcon.setAttribute("aria-expanded", String(!infoModal.hidden));
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
    infoIcon.setAttribute("aria-expanded", "false");
  });

  patientInfoToggle.addEventListener("click", () => {
    openModal(patientInfoModal, patientInfoToggle);
    patientInfoToggle.setAttribute("aria-expanded", "true");
  });

  closePatientInfo.addEventListener("click", () => {
    closeModal(patientInfoModal);
    patientInfoToggle.setAttribute("aria-expanded", "false");
  });

  savePatientInfo.addEventListener("click", () => {
    closeModal(patientInfoModal);
    patientInfoToggle.setAttribute("aria-expanded", "false");
  });

  app.elements.patientName.addEventListener("input", app.invalidateReport);
  app.elements.patientDate.addEventListener("input", app.invalidateReport);

  window.addEventListener("click", (event) => {
    if (event.target === infoModal) {
      closeModal(infoModal);
      infoIcon.setAttribute("aria-expanded", "false");
    }

    if (event.target === patientInfoModal) {
      closeModal(patientInfoModal);
      patientInfoToggle.setAttribute("aria-expanded", "false");
    }

    app.mcqController.handleModalBackdropClick(event);
  });

  window.addEventListener("keydown", (event) => {
    trapModalFocus(event, infoModal);
    trapModalFocus(event, patientInfoModal);
    if (event.key === "Escape") {
      if (!infoModal.hidden) {
        closeModal(infoModal);
        infoIcon.setAttribute("aria-expanded", "false");
      } else if (!patientInfoModal.hidden) {
        closeModal(patientInfoModal);
        patientInfoToggle.setAttribute("aria-expanded", "false");
      } else {
        app.mcqController.handleEscape();
      }
    }
  });

  function restoreExaminationUi() {
    app.resetExaminationState();
    setToggleButtonState(flashToggleBtn, false);
    setToggleButtonState(redToggleBtn, false);
    setToggleButtonState(diagToggleBtn, false);
    setActiveTool("pen");
    reTab.classList.add("active");
    leTab.classList.remove("active");
    reTab.setAttribute("aria-selected", "true");
    leTab.setAttribute("aria-selected", "false");
    setStrokeSettingsOpen(false);
    syncPenWidthUi();
    app.elements.patientName.value = "";
    app.elements.patientDate.value = "";
    app.elements.resultText.textContent = "Results:";
    app.elements.reportSection.replaceChildren();
    app.elements.reportSection.hidden = true;
    app.setReportButtonEnabled(false);
    app.canvasController.resizeCanvas();
  }

  newAssessmentBtn.addEventListener("click", () => {
    if (newAssessmentBtn.dataset.confirmReset !== "true") {
      newAssessmentBtn.dataset.confirmReset = "true";
      newAssessmentBtn.textContent = "Confirm new assessment";
      assessmentResetStatus.textContent =
        "Select again to clear this examination.";
      window.clearTimeout(resetConfirmTimer);
      resetConfirmTimer = window.setTimeout(() => {
        newAssessmentBtn.dataset.confirmReset = "false";
        newAssessmentBtn.textContent = "New assessment";
        assessmentResetStatus.textContent = "";
      }, 5000);
      return;
    }

    window.clearTimeout(resetConfirmTimer);
    restoreExaminationUi();
    newAssessmentBtn.dataset.confirmReset = "false";
    newAssessmentBtn.textContent = "New assessment";
    assessmentResetStatus.textContent = "New assessment ready.";
    app.mcqController.setSideMenuOpen(false);
    burgerIcon.focus();
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
