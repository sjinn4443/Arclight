import {
  TEST_REFRACTION_OPTIONS,
  TEST_COUNTDOWN_SEQUENCE,
} from "./constants.js?v=20260430-6";

function dispatchInput(element) {
  if (!element) {
    return;
  }

  element.dispatchEvent(new Event("input", { bubbles: true }));
}

function dispatchChange(element) {
  if (!element) {
    return;
  }

  element.dispatchEvent(new Event("change", { bubbles: true }));
}

function sampleRandomCondition(lastValue) {
  const candidates =
    TEST_REFRACTION_OPTIONS.length > 1
      ? TEST_REFRACTION_OPTIONS.filter((option) => option.value !== lastValue)
      : TEST_REFRACTION_OPTIONS;

  const pool = candidates.length ? candidates : TEST_REFRACTION_OPTIONS;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

function getCountdownForRound(roundIndex) {
  const safeIndex = Math.max(
    0,
    Math.min(roundIndex, TEST_COUNTDOWN_SEQUENCE.length - 1),
  );
  return TEST_COUNTDOWN_SEQUENCE[safeIndex];
}

export function createTestModeController({
  state,
  dom,
  eyesController,
  retinoscopyController,
  setConditionContext,
  onTestStateChange,
}) {
  const {
    sideMenu,
    testModeButton,
    testStatusBanner,
    testCountdownValue,
    testAnswerText,
    testClueText,
    testNextButton,
    reflexColorSlider,
    modifierContextBar,
    liveToggle,
    babyToggle,
    dilatedToggle,
    irisColourSelect,
    manualEyeMoveToggle,
    refractionShell,
    refractionMaskLabel,
    refractionStateSelect,
    visualCaseTrigger,
    casePrevButton,
    caseNextButton,
    cataractSlider,
    nystagmusToggle,
    nystagmusDirectionSelect,
    nystagmusWaveSelect,
    nystagmusRateSelect,
    pupilSizeSliders,
    eyelidSliders,
  } = dom;

  const lockableControls = [
    reflexColorSlider,
    liveToggle,
    babyToggle,
    dilatedToggle,
    irisColourSelect,
    manualEyeMoveToggle,
    refractionStateSelect,
    visualCaseTrigger,
    casePrevButton,
    caseNextButton,
    cataractSlider,
    nystagmusToggle,
    nystagmusDirectionSelect,
    nystagmusWaveSelect,
    nystagmusRateSelect,
    ...pupilSizeSliders,
    ...eyelidSliders,
  ].filter(Boolean);

  function clearTestTimer() {
    if (!state.testTimerId) {
      return;
    }

    window.clearInterval(state.testTimerId);
    state.testTimerId = 0;
  }

  function setSideMenuOpen(isOpen) {
    if (!sideMenu) {
      return;
    }

    sideMenu.classList.toggle("open", isOpen);
    sideMenu.setAttribute("aria-hidden", String(!isOpen));
    if (isOpen) {
      sideMenu.removeAttribute("inert");
    } else {
      sideMenu.setAttribute("inert", "");
    }
    if (dom.burgerIcon) {
      dom.burgerIcon.setAttribute("aria-expanded", String(isOpen));
      dom.burgerIcon.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu",
      );
    }
  }

  function setTestTriggerLabel() {
    if (!testModeButton) {
      return;
    }

    testModeButton.textContent = state.isTestMode ? "stop test" : "test me";
  }

  function setRefractionMask(isMasked) {
    if (!refractionShell || !refractionMaskLabel || !refractionStateSelect) {
      return;
    }

    refractionShell.classList.toggle("is-masked", isMasked);
    refractionMaskLabel.textContent = isMasked ? "Condition hidden" : "";
  }

  function setObservationLock(isLocked) {
    lockableControls.forEach((control) => {
      control.disabled = isLocked;
    });
    modifierContextBar?.querySelectorAll("input").forEach((control) => {
      control.disabled = isLocked;
    });
  }

  function renderBanner() {
    if (!testStatusBanner || !testCountdownValue || !testAnswerText) {
      return;
    }

    testStatusBanner.hidden = !state.isTestMode;
    if (!state.isTestMode) {
      if (testClueText) {
        testClueText.hidden = true;
        testClueText.textContent = "";
      }
      return;
    }

    testCountdownValue.textContent = String(state.testCountdown);
    if (state.isTestRevealed) {
      testAnswerText.hidden = false;
      testAnswerText.textContent = state.testRevealLabel;
      if (testNextButton) {
        testNextButton.hidden = false;
      }
      return;
    }

    testAnswerText.hidden = true;
    testAnswerText.textContent = "";
    if (testClueText) {
      testClueText.hidden = true;
      testClueText.textContent = "";
    }
    if (testNextButton) {
      testNextButton.hidden = true;
    }
  }

  function captureSnapshot() {
    return {
      corticalCataractPattern: state.corticalCataractPattern
        ? JSON.parse(JSON.stringify(state.corticalCataractPattern))
        : null,
      currentRefraction: state.currentRefraction,
      cylinderAxisDeg: state.cylinderAxisDeg,
      retStreakOffset: state.retStreakOffset,
      retStreakOffsetY: state.retStreakOffsetY,
      reflexColorValue: reflexColorSlider?.value ?? "",
      cataractValue: cataractSlider?.value ?? "",
      nystagmusEnabled: Boolean(nystagmusToggle?.checked),
      nystagmusDirectionValue: nystagmusDirectionSelect?.value ?? "",
      nystagmusWaveValue: nystagmusWaveSelect?.value ?? "",
      nystagmusRateValue: nystagmusRateSelect?.value ?? "",
      pupilValues: pupilSizeSliders.map((slider) => slider.value),
      eyelidValues: eyelidSliders.map((slider) => slider.value),
    };
  }

  function restoreSnapshot() {
    const snapshot = state.testPreviousState;
    if (!snapshot) {
      return;
    }

    if (reflexColorSlider && snapshot.reflexColorValue !== "") {
      reflexColorSlider.value = snapshot.reflexColorValue;
      dispatchInput(reflexColorSlider);
    }

    pupilSizeSliders.forEach((slider, index) => {
      if (snapshot.pupilValues[index] === undefined) {
        return;
      }

      slider.value = snapshot.pupilValues[index];
      dispatchInput(slider);
    });

    eyelidSliders.forEach((slider, index) => {
      if (snapshot.eyelidValues[index] === undefined) {
        return;
      }

      slider.value = snapshot.eyelidValues[index];
      dispatchInput(slider);
    });

    if (cataractSlider && snapshot.cataractValue !== "") {
      cataractSlider.value = snapshot.cataractValue;
      dispatchInput(cataractSlider);
    }

    if (nystagmusDirectionSelect && snapshot.nystagmusDirectionValue !== "") {
      nystagmusDirectionSelect.value = snapshot.nystagmusDirectionValue;
    }

    if (nystagmusWaveSelect && snapshot.nystagmusWaveValue !== "") {
      nystagmusWaveSelect.value = snapshot.nystagmusWaveValue;
    }

    if (nystagmusRateSelect && snapshot.nystagmusRateValue !== "") {
      nystagmusRateSelect.value = snapshot.nystagmusRateValue;
    }

    if (nystagmusToggle) {
      nystagmusToggle.checked = Boolean(snapshot.nystagmusEnabled);
      dispatchChange(nystagmusToggle);
    }

    if (nystagmusDirectionSelect && snapshot.nystagmusDirectionValue !== "") {
      dispatchChange(nystagmusDirectionSelect);
    }

    if (nystagmusWaveSelect && snapshot.nystagmusWaveValue !== "") {
      dispatchChange(nystagmusWaveSelect);
    }

    if (nystagmusRateSelect && snapshot.nystagmusRateValue !== "") {
      dispatchChange(nystagmusRateSelect);
    }

    retinoscopyController.setRefraction(snapshot.currentRefraction);
    if (typeof setConditionContext === "function") {
      setConditionContext(snapshot.currentRefraction);
    }
    eyesController.syncRefractionPose();
    state.cylinderAxisDeg = snapshot.cylinderAxisDeg;
    state.corticalCataractPattern = snapshot.corticalCataractPattern
      ? JSON.parse(JSON.stringify(snapshot.corticalCataractPattern))
      : null;
    if (refractionStateSelect) {
      refractionStateSelect.value = snapshot.currentRefraction;
      dispatchChange(refractionStateSelect);
    }

    retinoscopyController.setRetStreakOffset(
      snapshot.retStreakOffset,
      snapshot.retStreakOffsetY ?? 0,
    );
  }

  function buildRevealLabel(option) {
    if (typeof state.cylinderAxisDeg === "number") {
      if (option.value === "low-cylinder" || option.value === "high-cylinder") {
        return `Answer: ${option.label}, - cyl axis ${state.cylinderAxisDeg} deg`;
      }

      return `Answer: ${option.label}, axis ${state.cylinderAxisDeg} deg`;
    }

    return `Answer: ${option.label}`;
  }

  function revealAnswer() {
    clearTestTimer();
    state.isTestRevealed = true;
    state.testCountdown = 0;
    setRefractionMask(false);
    renderBanner();
    if (typeof onTestStateChange === "function") {
      onTestStateChange();
    }
  }

  function startCountdown() {
    clearTestTimer();
    state.testTimerId = window.setInterval(() => {
      if (state.testCountdown <= 1) {
        revealAnswer();
        return;
      }

      state.testCountdown -= 1;
      renderBanner();
    }, 1000);
  }

  function startTestRound() {
    if (!state.testPreviousState) {
      state.testPreviousState = captureSnapshot();
      state.testRoundIndex = 0;
    } else {
      state.testRoundIndex = Math.min(
        state.testRoundIndex + 1,
        TEST_COUNTDOWN_SEQUENCE.length - 1,
      );
    }

    const nextCondition = sampleRandomCondition(state.testLastRefraction);
    if (!nextCondition) {
      return;
    }

    state.isTestMode = true;
    state.isTestRevealed = false;
    state.testConditionValue = nextCondition.value;
    state.testCountdown = getCountdownForRound(state.testRoundIndex);
    state.testLastRefraction = nextCondition.value;

    setObservationLock(true);
    setRefractionMask(true);
    retinoscopyController.setRefraction(nextCondition.value);
    if (typeof setConditionContext === "function") {
      setConditionContext(nextCondition.value);
    }
    eyesController.syncRefractionPose();
    if (refractionStateSelect) {
      refractionStateSelect.value = nextCondition.value;
      dispatchChange(refractionStateSelect);
    }
    setObservationLock(true);

    state.testRevealLabel = buildRevealLabel(nextCondition);
    renderBanner();
    setTestTriggerLabel();
    setSideMenuOpen(false);
    if (typeof onTestStateChange === "function") {
      onTestStateChange();
    }
    startCountdown();
  }

  function closeTestMode() {
    if (!state.isTestMode && !state.testPreviousState) {
      return;
    }

    clearTestTimer();
    setObservationLock(false);
    setRefractionMask(false);
    restoreSnapshot();

    state.isTestMode = false;
    state.isTestRevealed = false;
    state.testCountdown = 0;
    state.testConditionValue = null;
    state.testRevealLabel = "";
    state.testPreviousState = null;
    state.testRoundIndex = 0;

    if (typeof setConditionContext === "function" && state.currentRefraction) {
      setConditionContext(state.currentRefraction);
    }

    renderBanner();
    setTestTriggerLabel();
    setSideMenuOpen(false);
    if (typeof onTestStateChange === "function") {
      onTestStateChange();
    }
  }

  function handleTestRequest() {
    if (state.isTestMode) {
      closeTestMode();
      return;
    }

    startTestRound();
  }

  function init() {
    if (testModeButton) {
      testModeButton.addEventListener("click", handleTestRequest);
    }

    if (testNextButton) {
      testNextButton.addEventListener("click", startTestRound);
    }

    renderBanner();
    setTestTriggerLabel();
  }

  return {
    closeTestMode,
    init,
    startTestRound,
  };
}
