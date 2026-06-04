export function initSimulator() {
  const mires = document.getElementById("mires");
  const blueCircle = document.getElementById("blueCircle");
  const toggleButton = document.getElementById("toggleButton");
  const topSemiCircle = document.querySelector(".semi-circle.top");
  const bottomSemiCircle = document.querySelector(".semi-circle.bottom");

  const jitterSlider = document.getElementById("jitterSlider");
  const jitterValue = document.getElementById("jitterValue");
  const suddenSlider = document.getElementById("suddenSlider");
  const suddenValue = document.getElementById("suddenValue");
  const driftSlider = document.getElementById("driftSlider");
  const driftValue = document.getElementById("driftValue");
  const thicknessSlider = document.getElementById("thicknessSlider");
  const thicknessValue = document.getElementById("thicknessValue");
  const separationControlRow = document.getElementById("separationControlRow");
  const separationSlider = document.getElementById("separationSlider");
  const zoomSlider = document.getElementById("zoomSlider");
  const resetControlsButton = document.getElementById("resetControlsButton");
  const appBar = document.getElementById("appBar");
  const gameArea = document.getElementById("gameArea");
  const controlDock = document.getElementById("controlDock");
  const advancedControls = document.getElementById("advancedControls");
  const advancedMotionButton = document.getElementById("advancedMotionButton");
  const newtonPanelToggle = document.getElementById("newtonPanelToggle");
  const newtonPanelClose = document.getElementById("newtonPanelClose");
  const newtonPanel = document.getElementById("newtonPanel");
  const newtonStatus = document.getElementById("newtonStatus");
  const newtonResult = document.getElementById("newtonResult");
  const newtonPointButtons = Array.from(
    document.querySelectorAll("[data-newton-point]"),
  );
  const newtonGuessButtons = Array.from(
    document.querySelectorAll("[data-newton-guess]"),
  );
  const newtonNewCaseButton = document.getElementById("newtonNewCaseButton");
  const newtonSubmitButton = document.getElementById("newtonSubmitButton");
  const casePanelToggle = document.getElementById("casePanelToggle");
  const casePanelClose = document.getElementById("casePanelClose");
  const casePanel = document.getElementById("casePanel");
  const iopValue = document.getElementById("iopValue");
  const caseStatus = document.getElementById("caseStatus");
  const centerStatus = document.getElementById("centerStatus");
  const edgeStatus = document.getElementById("edgeStatus");
  const caseTierGroup = document.getElementById("caseTierGroup");
  const caseRangeHint = document.getElementById("caseRangeHint");
  const caseTierButtons = Array.from(
    document.querySelectorAll("[data-case-tier]"),
  );
  const newCaseButton = document.getElementById("newCaseButton");

  if (
    !mires ||
    !blueCircle ||
    !toggleButton ||
    !topSemiCircle ||
    !bottomSemiCircle ||
    !jitterSlider ||
    !jitterValue ||
    !suddenSlider ||
    !suddenValue ||
    !driftSlider ||
    !driftValue ||
    !thicknessSlider ||
    !thicknessValue ||
    !gameArea ||
    !separationSlider ||
    !zoomSlider ||
    !resetControlsButton
  ) {
    return;
  }

  const defaults = Object.freeze({
    positionTop: 0,
    positionLeft: 0,
    separation: parseFloat(separationSlider.value),
    minSeparation: parseFloat(separationSlider.min),
    maxSeparation: parseFloat(separationSlider.max),
    isBlueLightOn: true,
    scale: parseFloat(zoomSlider.value),
    jitterFactor: parseFloat(jitterSlider.value),
    suddenFactor: parseFloat(suddenSlider.value),
    driftFactor: parseFloat(driftSlider.value),
    thickness: parseFloat(thicknessSlider.value),
  });

  const state = {
    miresPosition: { top: defaults.positionTop, left: defaults.positionLeft },
    separation: defaults.separation,
    minSeparation: defaults.minSeparation,
    maxSeparation: defaults.maxSeparation,
    isBlueLightOn: defaults.isBlueLightOn,
    scale: defaults.scale,
    jitterFactor: defaults.jitterFactor,
    suddenFactor: defaults.suddenFactor,
    driftFactor: defaults.driftFactor,
  };

  const modes = Object.freeze({
    VARIABLE: "variable",
    NEWTON: "newton",
  });
  let activeMode = modes.VARIABLE;

  const training = {
    activeTier: "primary",
    targetIop: 20,
    isRevealed: false,
    isCentered: false,
    isInnerEdgeTouching: false,
    hasUserAdjusted: false,
    pendingRevealFlash: false,
    lockMs: 0,
    requiredLockMs: 700,
    centerToleranceRatio: 0.15,
    centerToleranceHoldMultiplier: 1.35,
    innerEdgeTolerancePx: 3.2,
    innerEdgeHoldMultiplier: 1.35,
    pxPerMmHg: 1.15,
    mireDiameterPx: 100,
    lockDecayFactor: 0.45,
  };

  const newton = {
    minIop: 10,
    maxIop: 50,
    targetIop: 23,
    selectedPoint: 20,
    selectedGuess: null,
    isRevealed: false,
    lastErrorMmHg: null,
    lastIsCorrect: null,
    lastIsClose: null,
    pxPerMmHg: 2.05,
  };

  const newtonScoring = Object.freeze({
    correctToleranceMmHg: 2,
    closeToleranceMmHg: 3,
  });

  const newtonBands = Object.freeze([
    { id: "very_below_20", label: "<16", min: 10, max: 15 },
    { id: "just_below_20", label: "16-19", min: 16, max: 19 },
    { id: "exactly_20", label: "20", min: 20, max: 20 },
    { id: "range_21_24", label: "21-24", min: 21, max: 24 },
    { id: "exactly_25", label: "25", min: 25, max: 25 },
    { id: "range_26_29", label: "26-29", min: 26, max: 29 },
    { id: "exactly_30", label: "30", min: 30, max: 30 },
    { id: "above_30_bit", label: "31-34", min: 31, max: 34 },
    { id: "well_above", label: "35+", min: 35, max: 50 },
  ]);

  const caseTiers = Object.freeze({
    primary: { label: "Primary", minIop: 10, maxIop: 30 },
    intermediate: { label: "Intermediate", minIop: 8, maxIop: 40 },
    advanced: { label: "Advanced", minIop: 8, maxIop: 60 },
  });

  const samplingState = {
    caseUsageByTier: {
      primary: [0, 0, 0],
      intermediate: [0, 0, 0],
      advanced: [0, 0, 0],
    },
    lastCaseIopByTier: {
      primary: null,
      intermediate: null,
      advanced: null,
    },
    newtonUsage: [0, 0, 0, 0],
    lastNewtonIop: null,
  };

  function isMobileDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  function getActiveCaseTier() {
    return caseTiers[training.activeTier] ?? caseTiers.primary;
  }

  function buildIopBuckets(minIop, maxIop, bucketCount) {
    const safeCount = Math.max(1, Math.floor(bucketCount));
    const total = maxIop - minIop + 1;
    const baseSize = Math.floor(total / safeCount);
    let remainder = total % safeCount;
    let cursor = minIop;
    const buckets = [];

    for (let index = 0; index < safeCount; index += 1) {
      const size = baseSize + (remainder > 0 ? 1 : 0);
      const bucketMin = cursor;
      const bucketMax = cursor + size - 1;
      buckets.push({ min: bucketMin, max: bucketMax });
      cursor = bucketMax + 1;
      if (remainder > 0) {
        remainder -= 1;
      }
    }

    return buckets;
  }

  function pickLeastUsedBucket(usage) {
    const minUsage = Math.min(...usage);
    const candidates = [];
    usage.forEach((count, index) => {
      if (count === minUsage) {
        candidates.push(index);
      }
    });
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function sampleBucketValue(bucket, lastValue) {
    const span = bucket.max - bucket.min + 1;
    let value = bucket.min + Math.floor(Math.random() * span);

    if (span <= 1) {
      return value;
    }

    // Avoid immediate repeats to keep learning cases feeling varied.
    for (let attempt = 0; attempt < 4 && value === lastValue; attempt += 1) {
      value = bucket.min + Math.floor(Math.random() * span);
    }
    return value;
  }

  function sampleCaseIop() {
    const tierKey = training.activeTier;
    const tier = getActiveCaseTier();
    const usage = samplingState.caseUsageByTier[tierKey] ?? [0, 0, 0];
    const buckets = buildIopBuckets(tier.minIop, tier.maxIop, usage.length);
    const selectedBucketIndex = pickLeastUsedBucket(usage);
    const selectedBucket = buckets[selectedBucketIndex];
    const sampledIop = sampleBucketValue(
      selectedBucket,
      samplingState.lastCaseIopByTier[tierKey],
    );

    usage[selectedBucketIndex] += 1;
    samplingState.caseUsageByTier[tierKey] = usage;
    samplingState.lastCaseIopByTier[tierKey] = sampledIop;

    return sampledIop;
  }

  function sampleNewtonIop() {
    const usage = samplingState.newtonUsage;
    const buckets = buildIopBuckets(newton.minIop, newton.maxIop, usage.length);
    const selectedBucketIndex = pickLeastUsedBucket(usage);
    const selectedBucket = buckets[selectedBucketIndex];
    const sampledIop = sampleBucketValue(
      selectedBucket,
      samplingState.lastNewtonIop,
    );

    usage[selectedBucketIndex] += 1;
    samplingState.newtonUsage = usage;
    samplingState.lastNewtonIop = sampledIop;

    return sampledIop;
  }

  function classifyNewtonBand(iop) {
    const matchedBand = newtonBands.find(
      (band) => iop >= band.min && iop <= band.max,
    );
    return matchedBand ?? newtonBands[newtonBands.length - 1];
  }

  function getNewtonBandById(id) {
    return newtonBands.find((band) => band.id === id) ?? null;
  }

  function getNewtonGuessErrorMmHg(actualIop, guessId) {
    const guessBand = getNewtonBandById(guessId);
    if (!guessBand) {
      return null;
    }
    if (actualIop < guessBand.min) {
      return guessBand.min - actualIop;
    }
    if (actualIop > guessBand.max) {
      return actualIop - guessBand.max;
    }
    return 0;
  }

  function evaluateNewtonSubmission(actualIop, selectedGuess) {
    const errorMmHg = getNewtonGuessErrorMmHg(actualIop, selectedGuess);
    const isCorrect =
      typeof errorMmHg === "number" &&
      errorMmHg <= newtonScoring.correctToleranceMmHg;
    const isClose =
      typeof errorMmHg === "number" &&
      errorMmHg === newtonScoring.closeToleranceMmHg;

    return {
      errorMmHg,
      isCorrect,
      isClose,
    };
  }

  function getActiveTargetIop() {
    return activeMode === modes.NEWTON ? newton.targetIop : training.targetIop;
  }

  function getActiveDialIop() {
    return activeMode === modes.NEWTON
      ? newton.selectedPoint
      : state.separation;
  }

  function getTouchSeparationPx() {
    const strokeWidthPx =
      parseFloat(thicknessSlider.value) || defaults.thickness;
    return (training.mireDiameterPx - strokeWidthPx) / 2;
  }

  function getRenderedSeparationPx() {
    const dialDeltaMmHg = getActiveDialIop() - getActiveTargetIop();
    const pxPerMmHg =
      activeMode === modes.NEWTON ? newton.pxPerMmHg : training.pxPerMmHg;
    return getTouchSeparationPx() + dialDeltaMmHg * pxPerMmHg;
  }

  function setTextIfChanged(element, nextText) {
    if (element && element.textContent !== nextText) {
      element.textContent = nextText;
    }
  }

  function updateCasePanel() {
    if (!casePanel || !iopValue || !caseStatus) {
      return;
    }

    casePanel.classList.toggle("is-revealed", training.isRevealed);
    updateCaseTierUi();

    if (training.isRevealed) {
      iopValue.textContent = `IOP: ${training.targetIop} mmHg`;
      if (training.pendingRevealFlash) {
        triggerRevealFlash();
        training.pendingRevealFlash = false;
      }
      if (centerStatus && edgeStatus) {
        setTextIfChanged(centerStatus, "Centre OK");
        setTextIfChanged(edgeStatus, "Touch steady, IOP shown");
      } else {
        setTextIfChanged(caseStatus, "Solved. Tap New Case.");
      }
      return;
    }

    iopValue.textContent = "IOP: Hidden";
    if (centerStatus && edgeStatus) {
      const centerLabel = training.isCentered ? "Centre OK" : "Centre adjust";
      let edgeLabel = training.isInnerEdgeTouching
        ? "Touch OK"
        : "Touch: adjust separation";

      if (
        training.lockMs > 0 &&
        training.isCentered &&
        training.isInnerEdgeTouching
      ) {
        edgeLabel = "Touch steady, hold";
      }

      setTextIfChanged(centerStatus, centerLabel);
      setTextIfChanged(edgeStatus, edgeLabel);
      return;
    }

    setTextIfChanged(caseStatus, "Centre + touch inner edges.");
  }

  function updateCaseTierUi() {
    const tier = getActiveCaseTier();
    if (caseRangeHint) {
      caseRangeHint.textContent = `${tier.minIop}-${tier.maxIop} mmHg`;
    }
    if (caseTierGroup) {
      caseTierGroup.dataset.activeTier = training.activeTier;
    }

    caseTierButtons.forEach((button) => {
      const isActive = button.dataset.caseTier === training.activeTier;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function setCaseTier(nextTier) {
    if (!caseTiers[nextTier]) {
      return;
    }
    training.activeTier = nextTier;
    updateCaseTierUi();
    startNewCase();
  }

  function setActiveMode(nextMode) {
    activeMode = nextMode;
    const isNewtonMode = activeMode === modes.NEWTON;
    if (separationControlRow) {
      separationControlRow.hidden = isNewtonMode;
    }
    separationSlider.disabled = isNewtonMode;
    updateSeparation();
  }

  function updateNewtonUi() {
    newtonPointButtons.forEach((button) => {
      const point = Number(button.dataset.newtonPoint || 20);
      const isActive = point === newton.selectedPoint;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
      button.disabled = newton.isRevealed;
      button.setAttribute("aria-disabled", String(newton.isRevealed));
    });

    newtonGuessButtons.forEach((button) => {
      const guess = button.dataset.newtonGuess || "";
      const isActive = guess === newton.selectedGuess;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
      button.disabled = newton.isRevealed;
      button.setAttribute("aria-disabled", String(newton.isRevealed));
    });

    if (newtonSubmitButton) {
      newtonSubmitButton.disabled = newton.isRevealed || !newton.selectedGuess;
    }

    if (newtonStatus) {
      newtonStatus.textContent = "Estimate closest IOP.";
    }

    if (newtonResult) {
      if (newton.isRevealed) {
        const band = classifyNewtonBand(newton.targetIop);
        let outcome = "Recheck";
        let outcomeClass = "is-recheck";
        if (newton.lastIsCorrect) {
          outcome = "Correct";
          outcomeClass = "is-correct";
        } else if (newton.lastIsClose) {
          outcome = "Close";
          outcomeClass = "is-close";
        }
        const outcomeElement = document.createElement("span");
        outcomeElement.className = `newton-outcome${outcomeClass ? ` ${outcomeClass}` : ""}`;
        outcomeElement.textContent = outcome;
        const detailElement = document.createElement("span");
        detailElement.className = "newton-result-detail";
        detailElement.textContent = `Actual: ${newton.targetIop} mmHg (${band.label})`;
        newtonResult.replaceChildren(outcomeElement, detailElement);
      } else {
        newtonResult.replaceChildren();
      }
    }
  }

  function startNewtonCase() {
    newton.targetIop = sampleNewtonIop();
    newton.selectedGuess = null;
    newton.isRevealed = false;
    newton.lastErrorMmHg = null;
    newton.lastIsCorrect = null;
    newton.lastIsClose = null;
    updateNewtonUi();
    updateSeparation();
  }

  function submitNewtonGuess() {
    if (newton.isRevealed || !newton.selectedGuess || !newtonResult) {
      return;
    }

    const evaluation = evaluateNewtonSubmission(
      newton.targetIop,
      newton.selectedGuess,
    );
    newton.isRevealed = true;
    newton.lastErrorMmHg = evaluation.errorMmHg;
    newton.lastIsCorrect = evaluation.isCorrect;
    newton.lastIsClose = evaluation.isClose;
    updateNewtonUi();
  }

  function triggerRevealFlash() {
    if (!iopValue) {
      return;
    }

    iopValue.classList.remove("flash-reveal");
    void iopValue.offsetWidth;
    iopValue.classList.add("flash-reveal");
    iopValue.addEventListener(
      "animationend",
      () => {
        iopValue.classList.remove("flash-reveal");
      },
      { once: true },
    );
  }

  function startNewCase(forcedIop = null) {
    const tier = getActiveCaseTier();
    if (typeof forcedIop === "number") {
      training.targetIop = Math.max(
        tier.minIop,
        Math.min(tier.maxIop, Math.round(forcedIop)),
      );
    } else {
      training.targetIop = sampleCaseIop();
    }
    training.isRevealed = false;
    training.isCentered = false;
    training.isInnerEdgeTouching = false;
    training.hasUserAdjusted = false;
    training.pendingRevealFlash = false;
    training.lockMs = 0;
    if (iopValue) {
      iopValue.classList.remove("flash-reveal");
    }
    updateSeparation();
    updateCasePanel();
  }

  function getCenterTolerancePx() {
    const circleRect = blueCircle.getBoundingClientRect();
    const radius = Math.min(circleRect.width, circleRect.height) / 2;
    return Math.max(10, radius * training.centerToleranceRatio);
  }

  function getInnerEdgeGapPx() {
    const renderedSeparationPx = getRenderedSeparationPx();
    const centreLineGapPx =
      training.mireDiameterPx - 2 * Math.abs(renderedSeparationPx);
    const strokeWidthPx =
      parseFloat(thicknessSlider.value) || defaults.thickness;
    return centreLineGapPx - strokeWidthPx;
  }

  function updateTrainingProgress(dtMs) {
    if (activeMode !== modes.VARIABLE || training.isRevealed) {
      return;
    }

    const centerTolerancePx = getCenterTolerancePx();
    const centerError = Math.max(
      Math.abs(state.miresPosition.left),
      Math.abs(state.miresPosition.top),
    );
    const centerAcquireThreshold = centerTolerancePx;
    const centerHoldThreshold =
      centerTolerancePx * training.centerToleranceHoldMultiplier;

    if (training.isCentered) {
      training.isCentered = centerError <= centerHoldThreshold;
    } else {
      training.isCentered = centerError <= centerAcquireThreshold;
    }

    const innerEdgeGapPx = getInnerEdgeGapPx();
    const edgeError = Math.abs(innerEdgeGapPx);
    const edgeAcquireThreshold = training.innerEdgeTolerancePx;
    const edgeHoldThreshold =
      training.innerEdgeTolerancePx * training.innerEdgeHoldMultiplier;

    if (training.isInnerEdgeTouching) {
      training.isInnerEdgeTouching = edgeError <= edgeHoldThreshold;
    } else {
      training.isInnerEdgeTouching = edgeError <= edgeAcquireThreshold;
    }

    const isAligned = training.isCentered && training.isInnerEdgeTouching;

    if (!training.hasUserAdjusted) {
      training.lockMs = 0;
    } else if (isAligned) {
      training.lockMs += dtMs;
      if (training.lockMs >= training.requiredLockMs) {
        training.isRevealed = true;
        training.pendingRevealFlash = true;
        training.lockMs = training.requiredLockMs;
      }
    } else {
      const isNearTarget =
        centerError <= centerHoldThreshold * 1.25 &&
        edgeError <= edgeHoldThreshold * 1.25;
      if (training.lockMs > 0 && isNearTarget) {
        training.lockMs = Math.max(
          0,
          training.lockMs - dtMs * training.lockDecayFactor,
        );
      } else {
        training.lockMs = 0;
      }
    }

    updateCasePanel();
  }

  function updateMiresTransform() {
    mires.style.transform = `translate(${state.miresPosition.left}px, ${state.miresPosition.top}px) scale(${state.scale})`;
  }

  function markVariableAdjustment() {
    if (activeMode === modes.VARIABLE) {
      training.hasUserAdjusted = true;
    }
  }

  function setCasePanelOpen(isOpen) {
    if (!casePanel) {
      return;
    }

    if (isOpen) {
      setNewtonPanelOpen(false);
      setActiveMode(modes.VARIABLE);
    }

    casePanel.classList.toggle("is-open", isOpen);
    if (casePanelToggle) {
      casePanelToggle.classList.toggle("is-panel-open", isOpen);
      casePanelToggle.setAttribute("aria-expanded", String(isOpen));
    }
    syncDrawerToggleVisibility();

    window.requestAnimationFrame(updateFieldOffset);
  }

  function setNewtonPanelOpen(isOpen) {
    if (!newtonPanel) {
      return;
    }

    if (isOpen) {
      if (casePanel) {
        casePanel.classList.remove("is-open");
      }
      if (casePanelToggle) {
        casePanelToggle.classList.remove("is-panel-open");
        casePanelToggle.setAttribute("aria-expanded", "false");
      }
      setActiveMode(modes.NEWTON);
    } else {
      setActiveMode(modes.VARIABLE);
    }

    newtonPanel.classList.toggle("is-open", isOpen);
    if (newtonPanelToggle) {
      newtonPanelToggle.classList.toggle("is-panel-open", isOpen);
      newtonPanelToggle.setAttribute("aria-expanded", String(isOpen));
    }
    syncDrawerToggleVisibility();

    window.requestAnimationFrame(updateFieldOffset);
  }

  function syncDrawerToggleVisibility() {
    const isCaseOpen = casePanel?.classList.contains("is-open") ?? false;
    const isNewtonOpen = newtonPanel?.classList.contains("is-open") ?? false;

    if (casePanelToggle) {
      casePanelToggle.classList.toggle(
        "is-hidden-for-other-open",
        isNewtonOpen,
      );
    }
    if (newtonPanelToggle) {
      newtonPanelToggle.classList.toggle(
        "is-hidden-for-other-open",
        isCaseOpen,
      );
    }
  }

  function setAdvancedControlsOpen(isOpen) {
    if (!advancedControls || !advancedMotionButton) {
      return;
    }

    advancedControls.hidden = !isOpen;
    advancedMotionButton.setAttribute("aria-expanded", String(isOpen));
    window.requestAnimationFrame(updateFieldOffset);
  }

  function updateFieldOffset() {
    if (!appBar || !gameArea || !controlDock) {
      return;
    }

    const appBarRect = appBar.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();
    const controlDockRect = controlDock.getBoundingClientRect();
    const isCaseOpen = casePanel?.classList.contains("is-open") ?? false;
    const isNewtonOpen = newtonPanel?.classList.contains("is-open") ?? false;
    let topBoundary = appBarRect.bottom + 30;
    if (isCaseOpen && casePanel) {
      topBoundary = Math.max(
        topBoundary,
        casePanel.getBoundingClientRect().bottom + 14,
      );
    }
    if (isNewtonOpen && newtonPanel) {
      topBoundary = Math.max(
        topBoundary,
        newtonPanel.getBoundingClientRect().bottom + 14,
      );
    }
    const desiredCenterY = (topBoundary + controlDockRect.top) / 2;
    const currentCenterY = gameAreaRect.top + gameAreaRect.height / 2;
    const unclampedOffset = desiredCenterY - currentCenterY;
    const maxDownShift = isCaseOpen || isNewtonOpen ? 220 : 80;
    const offset = Math.max(-260, Math.min(maxDownShift, unclampedOffset));

    gameArea.style.setProperty("--field-offset-y", `${offset.toFixed(1)}px`);
  }

  function updateZoomReadout() {
    zoomSlider.value = String(state.scale);
  }

  function applyThickness() {
    const thickness = parseFloat(thicknessSlider.value);
    thicknessValue.textContent = thickness.toFixed(0);
    document.querySelectorAll(".semi-circle").forEach((element) => {
      element.style.strokeWidth = String(thicknessSlider.value);
    });
  }

  function applyBlueLightState() {
    if (state.isBlueLightOn) {
      blueCircle.style.backgroundColor = "blue";
      blueCircle.style.border = "5px solid rgb(47, 255, 47)";
      document.querySelectorAll(".semi-circle").forEach((element) => {
        element.style.stroke = "rgb(3, 228, 3)";
        element.style.fill = "rgba(3, 228, 3, 0.2)";
        element.style.filter = "drop-shadow(0 0 10px rgb(23, 127, 19))";
      });
      toggleButton.classList.remove("off");
      toggleButton.classList.add("on");
      toggleButton.textContent = "Blue light + NaFl";
      return;
    }

    blueCircle.style.backgroundColor = "white";
    blueCircle.style.border = "none";
    document.querySelectorAll(".semi-circle").forEach((element) => {
      element.style.stroke = "lightgrey";
      element.style.fill = "rgba(211, 211, 211, 0.3)";
      element.style.filter = "none";
    });
    toggleButton.classList.remove("on");
    toggleButton.classList.add("off");
    toggleButton.textContent = "Blue light + NaFl";
  }

  function resetControls() {
    state.miresPosition.top = defaults.positionTop;
    state.miresPosition.left = defaults.positionLeft;
    state.separation = defaults.separation;
    state.scale = defaults.scale;
    state.jitterFactor = defaults.jitterFactor;
    state.suddenFactor = defaults.suddenFactor;
    state.driftFactor = defaults.driftFactor;
    state.isBlueLightOn = defaults.isBlueLightOn;

    jitterSlider.value = String(defaults.jitterFactor);
    suddenSlider.value = String(defaults.suddenFactor);
    driftSlider.value = String(defaults.driftFactor);
    thicknessSlider.value = String(defaults.thickness);
    separationSlider.value = String(defaults.separation);
    zoomSlider.value = String(defaults.scale);

    jitterValue.textContent = defaults.jitterFactor.toFixed(1);
    suddenValue.textContent = defaults.suddenFactor.toFixed(1);
    driftValue.textContent = defaults.driftFactor.toFixed(1);
    thicknessValue.textContent = defaults.thickness.toFixed(0);

    initialPinchDistance = null;
    isTouchSessionActive = false;
    applyBlueLightState();
    applyThickness();
    updateSeparation();
    constrainMiresToCircle();
    updateMiresTransform();
    updateZoomReadout();
    updateFieldOffset();
  }

  function updateSeparation() {
    const renderedSeparationPx = getRenderedSeparationPx();
    topSemiCircle.setAttribute(
      "transform",
      `translate(${renderedSeparationPx}, 0)`,
    );
    bottomSemiCircle.setAttribute(
      "transform",
      `translate(${-renderedSeparationPx}, 0)`,
    );
    separationSlider.value = String(state.separation);
  }

  function constrainMiresToCircle() {
    const blueCircleRect = blueCircle.getBoundingClientRect();
    const miresRect = mires.getBoundingClientRect();
    const centreX = blueCircleRect.width / 2;
    const centreY = blueCircleRect.height / 2;

    if (state.miresPosition.top < -centreY + miresRect.height / 2) {
      state.miresPosition.top = -centreY + miresRect.height / 2;
    }
    if (state.miresPosition.top > centreY - miresRect.height / 2) {
      state.miresPosition.top = centreY - miresRect.height / 2;
    }
    if (state.miresPosition.left < -centreX + miresRect.width / 2) {
      state.miresPosition.left = -centreX + miresRect.width / 2;
    }
    if (state.miresPosition.left > centreX - miresRect.width / 2) {
      state.miresPosition.left = centreX - miresRect.width / 2;
    }
  }

  function updateMiresPosition() {
    const tickMs = 100;

    if (!isMobileDevice() && activeMode === modes.VARIABLE) {
      state.separation += state.driftFactor * 0.2;
      if (state.separation > state.maxSeparation)
        state.separation = state.maxSeparation;
      if (state.separation < state.minSeparation)
        state.separation = state.minSeparation;
      updateSeparation();
    }

    const blueCircleRect = blueCircle.getBoundingClientRect();
    const miresRect = mires.getBoundingClientRect();
    const distanceFromCentre = Math.hypot(
      state.miresPosition.left,
      state.miresPosition.top,
    );
    const maxDistance = Math.max(
      1,
      blueCircleRect.width / 2 - miresRect.width / 2,
    );
    const minDriftSpeed = 5;
    const maxDriftSpeed = 10;
    const driftSpeed =
      minDriftSpeed +
      (maxDriftSpeed - minDriftSpeed) * (distanceFromCentre / maxDistance);

    const offsetX = (Math.random() - 0.5) * driftSpeed * state.jitterFactor;
    const offsetY = (Math.random() - 0.5) * driftSpeed * state.jitterFactor;
    state.miresPosition.left += offsetX;
    state.miresPosition.top += offsetY;

    if (Math.random() < 0.1) {
      const suddenX = (Math.random() - 0.5) * driftSpeed * state.suddenFactor;
      const suddenY = (Math.random() - 0.5) * driftSpeed * state.suddenFactor;
      state.miresPosition.left += suddenX;
      state.miresPosition.top += suddenY;
    }

    constrainMiresToCircle();
    updateMiresTransform();
    updateTrainingProgress(tickMs);
  }

  function shouldIgnoreKeyPress(event) {
    const target = event.target;
    if (!(target instanceof Element)) {
      return false;
    }

    if (document.body.classList.contains("modal-open")) {
      return true;
    }

    if (document.getElementById("sideMenu")?.classList.contains("open")) {
      return true;
    }

    if (
      target.closest("input") ||
      target.closest("button") ||
      target.closest("textarea") ||
      target.closest("select") ||
      target.closest('[contenteditable="true"]')
    ) {
      return true;
    }

    return false;
  }

  function handleKeyPress(event) {
    if (shouldIgnoreKeyPress(event)) {
      return;
    }

    const key = event.key.toLowerCase();
    const step = 20;

    if (event.altKey) {
      switch (key) {
        case "arrowup":
          state.jitterFactor += 0.1;
          if (state.jitterFactor > parseFloat(jitterSlider.max))
            state.jitterFactor = parseFloat(jitterSlider.max);
          jitterSlider.value = String(state.jitterFactor);
          jitterValue.textContent = state.jitterFactor.toFixed(1);
          return;
        case "arrowdown":
          state.jitterFactor -= 0.1;
          if (state.jitterFactor < parseFloat(jitterSlider.min))
            state.jitterFactor = parseFloat(jitterSlider.min);
          jitterSlider.value = String(state.jitterFactor);
          jitterValue.textContent = state.jitterFactor.toFixed(1);
          return;
        case "arrowright":
          state.suddenFactor += 0.1;
          if (state.suddenFactor > parseFloat(suddenSlider.max))
            state.suddenFactor = parseFloat(suddenSlider.max);
          suddenSlider.value = String(state.suddenFactor);
          suddenValue.textContent = state.suddenFactor.toFixed(1);
          return;
        case "arrowleft":
          state.suddenFactor -= 0.1;
          if (state.suddenFactor < parseFloat(suddenSlider.min))
            state.suddenFactor = parseFloat(suddenSlider.min);
          suddenSlider.value = String(state.suddenFactor);
          suddenValue.textContent = state.suddenFactor.toFixed(1);
          return;
        default:
          break;
      }
    }

    switch (key) {
      case "arrowup":
        markVariableAdjustment();
        state.miresPosition.top -= step;
        break;
      case "arrowdown":
        markVariableAdjustment();
        state.miresPosition.top += step;
        break;
      case "arrowleft":
        markVariableAdjustment();
        state.miresPosition.left -= step;
        break;
      case "arrowright":
        markVariableAdjustment();
        state.miresPosition.left += step;
        break;
      case "r":
        if (activeMode !== modes.VARIABLE) break;
        markVariableAdjustment();
        state.separation += 5;
        if (state.separation > state.maxSeparation)
          state.separation = state.maxSeparation;
        updateSeparation();
        break;
      case "f":
        if (activeMode !== modes.VARIABLE) break;
        markVariableAdjustment();
        state.separation -= 5;
        if (state.separation < state.minSeparation)
          state.separation = state.minSeparation;
        updateSeparation();
        break;
      case "z":
        state.scale += 0.1;
        if (state.scale > parseFloat(zoomSlider.max))
          state.scale = parseFloat(zoomSlider.max);
        updateZoomReadout();
        break;
      case "x":
        state.scale -= 0.1;
        if (state.scale < parseFloat(zoomSlider.min))
          state.scale = parseFloat(zoomSlider.min);
        updateZoomReadout();
        break;
      default:
        return;
    }

    constrainMiresToCircle();
    updateMiresTransform();
  }

  jitterSlider.addEventListener("input", () => {
    state.jitterFactor = parseFloat(jitterSlider.value);
    jitterValue.textContent = state.jitterFactor.toFixed(1);
  });

  suddenSlider.addEventListener("input", () => {
    state.suddenFactor = parseFloat(suddenSlider.value);
    suddenValue.textContent = state.suddenFactor.toFixed(1);
  });

  driftSlider.addEventListener("input", () => {
    state.driftFactor = parseFloat(driftSlider.value);
    driftValue.textContent = state.driftFactor.toFixed(1);
  });

  thicknessSlider.addEventListener("input", () => {
    applyThickness();
  });

  separationSlider.addEventListener("input", () => {
    markVariableAdjustment();
    state.separation = parseFloat(separationSlider.value);
    updateSeparation();
  });

  zoomSlider.addEventListener("input", () => {
    state.scale = parseFloat(zoomSlider.value);
    updateZoomReadout();
    updateMiresTransform();
  });

  toggleButton.addEventListener("click", () => {
    state.isBlueLightOn = !state.isBlueLightOn;
    applyBlueLightState();
  });

  let initialPinchDistance = null;
  let initialScale = state.scale;
  let touchStartX = 0;
  let touchStartY = 0;
  let isTouchSessionActive = false;

  function getDistance(touch1, touch2) {
    return Math.hypot(touch1.pageX - touch2.pageX, touch1.pageY - touch2.pageY);
  }

  function shouldIgnoreTouchEvent(event) {
    const target = event.target;
    if (!(target instanceof Element)) {
      return true;
    }

    if (document.body.classList.contains("modal-open")) {
      return true;
    }

    if (!gameArea.contains(target)) {
      return true;
    }

    if (
      target.closest("#controlDock") ||
      target.closest("#casePanel") ||
      target.closest("#newtonPanel") ||
      target.closest("#sideMenu") ||
      target.closest("input") ||
      target.closest("button") ||
      target.closest("textarea") ||
      target.closest("select") ||
      target.closest('[contenteditable="true"]')
    ) {
      return true;
    }

    return false;
  }

  function handleTouchStart(event) {
    if (shouldIgnoreTouchEvent(event)) {
      isTouchSessionActive = false;
      initialPinchDistance = null;
      return;
    }
    isTouchSessionActive = true;

    if (event.touches.length === 2) {
      initialPinchDistance = getDistance(event.touches[0], event.touches[1]);
      initialScale = state.scale;
      return;
    }

    if (event.touches.length === 1) {
      touchStartX = event.touches[0].pageX;
      touchStartY = event.touches[0].pageY;
    }
  }

  function handleTouchMove(event) {
    if (!isTouchSessionActive) {
      return;
    }

    if (event.touches.length === 2 && initialPinchDistance !== null) {
      const newPinchDistance = getDistance(event.touches[0], event.touches[1]);
      const pinchChange = newPinchDistance - initialPinchDistance;
      state.scale = initialScale + pinchChange * 0.01;
      if (state.scale < parseFloat(zoomSlider.min))
        state.scale = parseFloat(zoomSlider.min);
      if (state.scale > parseFloat(zoomSlider.max))
        state.scale = parseFloat(zoomSlider.max);
      updateZoomReadout();
      updateMiresTransform();
      return;
    }

    if (event.touches.length === 1) {
      const touchEndX = event.touches[0].pageX;
      const touchEndY = event.touches[0].pageY;
      const moveX = touchEndX - touchStartX;
      const moveY = touchEndY - touchStartY;
      markVariableAdjustment();
      state.miresPosition.left += moveX;
      state.miresPosition.top += moveY;
      touchStartX = touchEndX;
      touchStartY = touchEndY;
      constrainMiresToCircle();
      updateMiresTransform();
    }
  }

  function handleTouchEnd(event) {
    if (event.touches.length < 2) {
      initialPinchDistance = null;
    }
    if (event.touches.length === 0) {
      isTouchSessionActive = false;
    }
  }

  function handleTouchCancel() {
    initialPinchDistance = null;
    isTouchSessionActive = false;
  }

  resetControlsButton.addEventListener("click", resetControls);
  if (newCaseButton) {
    newCaseButton.addEventListener("click", () => {
      startNewCase();
    });
  }

  if (casePanelToggle) {
    casePanelToggle.addEventListener("click", () => {
      const isOpen = casePanel?.classList.contains("is-open");
      setCasePanelOpen(!isOpen);
    });
  }

  if (casePanelClose) {
    casePanelClose.addEventListener("click", () => {
      setCasePanelOpen(false);
    });
  }

  if (newtonPanelToggle) {
    newtonPanelToggle.addEventListener("click", () => {
      const isOpen = newtonPanel?.classList.contains("is-open");
      setNewtonPanelOpen(!isOpen);
    });
  }

  if (newtonPanelClose) {
    newtonPanelClose.addEventListener("click", () => {
      setNewtonPanelOpen(false);
    });
  }

  newtonPointButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const point = Number(button.dataset.newtonPoint || 20);
      if (!Number.isFinite(point)) {
        return;
      }
      newton.selectedPoint = point;
      updateNewtonUi();
      updateSeparation();
    });
  });

  newtonGuessButtons.forEach((button) => {
    button.addEventListener("click", () => {
      newton.selectedGuess = button.dataset.newtonGuess || null;
      updateNewtonUi();
    });
  });

  if (newtonNewCaseButton) {
    newtonNewCaseButton.addEventListener("click", () => {
      startNewtonCase();
    });
  }

  if (newtonSubmitButton) {
    newtonSubmitButton.addEventListener("click", () => {
      submitNewtonGuess();
    });
  }

  caseTierButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setCaseTier(button.dataset.caseTier || "primary");
    });
  });
  if (advancedMotionButton) {
    advancedMotionButton.addEventListener("click", () => {
      const isOpen =
        advancedMotionButton.getAttribute("aria-expanded") === "true";
      setAdvancedControlsOpen(!isOpen);
    });
  }

  if (typeof ResizeObserver === "function") {
    const observer = new ResizeObserver(() => {
      updateFieldOffset();
    });
    if (appBar) observer.observe(appBar);
    if (gameArea) observer.observe(gameArea);
    if (controlDock) observer.observe(controlDock);
  }

  document.addEventListener("keydown", handleKeyPress);
  document.addEventListener("touchstart", handleTouchStart, { passive: true });
  document.addEventListener("touchmove", handleTouchMove, { passive: true });
  document.addEventListener("touchend", handleTouchEnd, { passive: true });
  document.addEventListener("touchcancel", handleTouchCancel, {
    passive: true,
  });
  window.addEventListener("resize", updateFieldOffset);

  setAdvancedControlsOpen(false);
  setCasePanelOpen(false);
  setNewtonPanelOpen(false);
  resetControls();
  updateCaseTierUi();
  updateNewtonUi();
  startNewtonCase();
  startNewCase();
  window.setInterval(updateMiresPosition, 100);
}
