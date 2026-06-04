const PATIENT_INTRO_CONFIG = {
  holdMs: 900,
  fadeMs: 900,
  collapseDelayMs: 900,
  collapseAnimMs: 500,
  offsetXPx: -14,
  scaleAdjust: 0.97,
  tiltDeg: 1,
  // Relative coordinates based on the source portrait composition.
  // "Subject right eye" is visually on the left side of the image.
  imageSubjectRightEyeRatio: { x: 0.4344, y: 0.383 },
  imageSubjectLeftEyeRatio: { x: 0.5528, y: 0.3815 },
};

function getCenterInContainer(element, container) {
  const elRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return {
    x: elRect.left - containerRect.left + elRect.width / 2,
    y: elRect.top - containerRect.top + elRect.height / 2,
  };
}

function alignPatientIntroImage(
  container,
  imageEl,
  rightEyeCircle,
  leftEyeCircle,
) {
  if (!imageEl.naturalWidth || !imageEl.naturalHeight) return false;

  const sourceRightEye = {
    x: PATIENT_INTRO_CONFIG.imageSubjectRightEyeRatio.x * imageEl.naturalWidth,
    y: PATIENT_INTRO_CONFIG.imageSubjectRightEyeRatio.y * imageEl.naturalHeight,
  };
  const sourceLeftEye = {
    x: PATIENT_INTRO_CONFIG.imageSubjectLeftEyeRatio.x * imageEl.naturalWidth,
    y: PATIENT_INTRO_CONFIG.imageSubjectLeftEyeRatio.y * imageEl.naturalHeight,
  };
  const rightEyeCenter = getCenterInContainer(rightEyeCircle, container);
  const leftEyeCenter = getCenterInContainer(leftEyeCircle, container);
  const sourceEyeDelta = sourceLeftEye.x - sourceRightEye.x;
  const targetEyeDelta = leftEyeCenter.x - rightEyeCenter.x;

  if (sourceEyeDelta <= 0 || targetEyeDelta <= 0) return false;

  const scale =
    (targetEyeDelta / sourceEyeDelta) * (PATIENT_INTRO_CONFIG.scaleAdjust || 1);
  const scaledWidth = imageEl.naturalWidth * scale;
  const scaledHeight = imageEl.naturalHeight * scale;
  const leftOffset =
    rightEyeCenter.x -
    sourceRightEye.x * scale +
    (PATIENT_INTRO_CONFIG.offsetXPx || 0);
  const topOffset = rightEyeCenter.y - sourceRightEye.y * scale;

  imageEl.style.width = `${scaledWidth}px`;
  imageEl.style.height = `${scaledHeight}px`;
  imageEl.style.left = `${leftOffset}px`;
  imageEl.style.top = `${topOffset}px`;
  imageEl.style.transform = `rotate(${PATIENT_INTRO_CONFIG.tiltDeg || 0}deg)`;
  return true;
}

function startPatientFacingIntro(onComplete) {
  const container = document.querySelector(".eye-container");
  const overlay = document.getElementById("patient-overlay");
  const imageEl = document.getElementById("patient-overlay-image");
  const rightEyeCircle = document.getElementById("right-eye");
  const leftEyeCircle = document.getElementById("left-eye");
  const instructionCard = document.querySelector(".instruction-card");

  let completeFired = false;

  function fireComplete() {
    if (completeFired) return;
    completeFired = true;
    if (typeof onComplete === "function") {
      onComplete();
    }
  }

  if (!container || !overlay || !imageEl || !rightEyeCircle || !leftEyeCircle) {
    fireComplete();
    return false;
  }

  let done = false;
  let played = false;
  let fadeTimer = null;
  let hideTimer = null;
  let collapseTimer = null;

  function collapseInstructionCard() {
    if (!instructionCard || instructionCard.classList.contains("is-collapsed"))
      return;
    instructionCard.classList.add("is-collapsing");
    window.setTimeout(() => {
      instructionCard.classList.add("is-collapsed");
    }, PATIENT_INTRO_CONFIG.collapseAnimMs);
  }

  function finishIntro() {
    if (done) return;
    done = true;

    if (fadeTimer) window.clearTimeout(fadeTimer);
    if (hideTimer) window.clearTimeout(hideTimer);

    overlay.classList.remove("is-fading");
    overlay.hidden = true;
    container.classList.remove("eye-container-intro-active");
    window.removeEventListener("resize", handleResize);
    fireComplete();

    if (played) {
      collapseTimer = window.setTimeout(
        collapseInstructionCard,
        PATIENT_INTRO_CONFIG.collapseDelayMs,
      );
    }
  }

  function handleResize() {
    if (done || overlay.hidden) return;
    alignPatientIntroImage(container, imageEl, rightEyeCircle, leftEyeCircle);
  }

  function playIntro() {
    if (done) return;
    if (
      !alignPatientIntroImage(container, imageEl, rightEyeCircle, leftEyeCircle)
    ) {
      finishIntro();
      return;
    }

    overlay.hidden = false;
    overlay.classList.remove("is-fading");
    container.classList.add("eye-container-intro-active");
    played = true;

    fadeTimer = window.setTimeout(() => {
      overlay.classList.add("is-fading");
    }, PATIENT_INTRO_CONFIG.holdMs);

    hideTimer = window.setTimeout(
      () => {
        finishIntro();
      },
      PATIENT_INTRO_CONFIG.holdMs + PATIENT_INTRO_CONFIG.fadeMs + 20,
    );
  }

  window.addEventListener("resize", handleResize);
  imageEl.addEventListener("error", finishIntro, { once: true });

  if (imageEl.complete && imageEl.naturalWidth > 0) {
    window.requestAnimationFrame(playIntro);
  } else {
    imageEl.addEventListener(
      "load",
      () => {
        window.requestAnimationFrame(playIntro);
      },
      { once: true },
    );
  }

  return true;
}

function initPathwayPhotoToggle() {
  const openButton = document.getElementById("pathway-photo-open");
  const closeButton = document.getElementById("pathway-photo-close");
  const viewport = document.querySelector(".pathway-viewport");
  const canvas = document.getElementById("pathway-canvas");
  const photoView = document.getElementById("pathway-photo-view");
  const photoImage = photoView
    ? photoView.querySelector(".pathway-photo-image")
    : null;

  if (!openButton || !closeButton || !viewport || !canvas || !photoView) return;

  function openPhotoView() {
    canvas.hidden = true;
    photoView.hidden = false;
    viewport.classList.add("photo-mode");
    openButton.setAttribute("aria-expanded", "true");
  }

  function closePhotoView() {
    viewport.classList.remove("photo-mode");
    photoView.hidden = true;
    canvas.hidden = false;
    openButton.setAttribute("aria-expanded", "false");
  }

  closePhotoView();

  openButton.addEventListener("click", () => {
    if (photoView.hidden) {
      openPhotoView();
      return;
    }
    closePhotoView();
  });
  closeButton.addEventListener("click", closePhotoView);
  if (photoImage) {
    photoImage.addEventListener("click", closePhotoView);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || photoView.hidden) return;
    closePhotoView();
  });
}

let contextAutoCloseTimer = null;

function queueMobileContextAutoClose() {
  const contextPanel = document.getElementById("context-panel");
  if (!contextPanel || !contextPanel.open) return;
  if (!window.matchMedia("(max-width: 420px)").matches) return;

  if (contextAutoCloseTimer) {
    window.clearTimeout(contextAutoCloseTimer);
  }

  contextAutoCloseTimer = window.setTimeout(() => {
    contextPanel.open = false;
    contextAutoCloseTimer = null;
  }, 240);
}

function initMobileContextAutoClose() {
  const contextPanel = document.getElementById("context-panel");
  if (!contextPanel) return;

  contextPanel.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element) || !target.closest(".modifier-option"))
      return;
    queueMobileContextAutoClose();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const infoIcon = document.getElementById("info-icon");
  const infoClose = document.getElementById("info-close");
  const mcqController =
    typeof createMcqController === "function" ? createMcqController() : null;

  if (infoIcon) {
    infoIcon.addEventListener("click", () => toggleInfoBox());
  }
  if (infoClose) {
    infoClose.addEventListener("click", () => toggleInfoBox(false));
  }
  document.addEventListener("click", closeIfClickedOutside);

  document.querySelectorAll(".color-button").forEach((button) => {
    button.addEventListener("click", () => cycleColor(button));
    applyButtonState(button, 0);
  });

  if (typeof setRapdState === "function") {
    setRapdState("none");
  }
  document.querySelectorAll(".rapd-segment").forEach((button) => {
    button.addEventListener("click", () => {
      if (typeof setRapdState === "function") {
        setRapdState(button.getAttribute("data-rapd") || "none");
      }
      const eyeState = updateOutput();
      updateAnalysisOutput(eyeState);
    });
  });

  if (typeof setOnsetState === "function") {
    setOnsetState("none");
  }
  document
    .querySelectorAll("#onset-switch .modifier-option[data-onset]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (
          typeof setOnsetState === "function" &&
          typeof getOnsetState === "function"
        ) {
          const target = button.getAttribute("data-onset") || "none";
          const current = getOnsetState();
          setOnsetState(current === target ? "none" : target);
        }
        const eyeState = updateOutput();
        updateAnalysisOutput(eyeState);
      });
    });

  if (typeof setNeuroFlagsState === "function") {
    setNeuroFlagsState("no");
  }
  document
    .querySelectorAll("#neuro-flags-switch .modifier-option[data-value]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (
          typeof setNeuroFlagsState === "function" &&
          typeof getNeuroFlagsState === "function"
        ) {
          const next = getNeuroFlagsState() === "yes" ? "no" : "yes";
          setNeuroFlagsState(next);
        }
        const eyeState = updateOutput();
        updateAnalysisOutput(eyeState);
      });
    });

  if (typeof setKnownOldDefectState === "function") {
    setKnownOldDefectState("no");
  }
  document
    .querySelectorAll("#old-defect-switch .modifier-option[data-value]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (
          typeof setKnownOldDefectState === "function" &&
          typeof getKnownOldDefectState === "function"
        ) {
          const next = getKnownOldDefectState() === "yes" ? "no" : "yes";
          setKnownOldDefectState(next);
        }
        const eyeState = updateOutput();
        updateAnalysisOutput(eyeState);
      });
    });

  if (typeof setNightVisionPoorState === "function") {
    setNightVisionPoorState("no");
  }
  document
    .querySelectorAll("#night-vision-switch .modifier-option[data-value]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (
          typeof setNightVisionPoorState === "function" &&
          typeof getNightVisionPoorState === "function"
        ) {
          const next = getNightVisionPoorState() === "yes" ? "no" : "yes";
          setNightVisionPoorState(next);
        }
        const eyeState = updateOutput();
        updateAnalysisOutput(eyeState);
      });
    });

  if (typeof setFlashesCurtainState === "function") {
    setFlashesCurtainState("no");
  }
  document
    .querySelectorAll("#flashes-curtain-switch .modifier-option[data-value]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (
          typeof setFlashesCurtainState === "function" &&
          typeof getFlashesCurtainState === "function"
        ) {
          const next = getFlashesCurtainState() === "yes" ? "no" : "yes";
          setFlashesCurtainState(next);
        }
        const eyeState = updateOutput();
        updateAnalysisOutput(eyeState);
      });
    });

  if (typeof setColourFadeState === "function") {
    setColourFadeState("no");
  }
  document
    .querySelectorAll("#colour-fade-switch .modifier-option[data-value]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (
          typeof setColourFadeState === "function" &&
          typeof getColourFadeState === "function"
        ) {
          const next = getColourFadeState() === "yes" ? "no" : "yes";
          setColourFadeState(next);
        }
        const eyeState = updateOutput();
        updateAnalysisOutput(eyeState);
      });
    });

  if (typeof initResultModeToggle === "function") {
    initResultModeToggle();
  }

  if (mcqController && typeof mcqController.init === "function") {
    mcqController.init();
  }

  initPathwayPhotoToggle();
  initMobileContextAutoClose();
  if (typeof setSectionLocksEnabled === "function") {
    setSectionLocksEnabled(false);
  }

  const eyeState = updateOutput();
  updateAnalysisOutput(eyeState);
  startPatientFacingIntro(() => {
    if (typeof setSectionLocksEnabled === "function") {
      setSectionLocksEnabled(true);
    }

    const nextEyeState = updateOutput();
    updateAnalysisOutput(nextEyeState);
  });
});
