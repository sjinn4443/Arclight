const PASS_RATIO = 0.75;
const ROUNDS_PER_SET = 4;
const STAR_TIERS = Object.freeze([
  { name: 'Primary', className: 'primary-star' },
  { name: 'Intermediate', className: 'intermediate-star' },
  { name: 'Advanced', className: 'advanced-star' }
]);
const DEFAULT_ROUND_SECONDS = 5;
const TIMED_SAFE_FOV_DEGREES = Object.freeze({
  undilated: 8,
  dilated: 15
});
const TIMED_TEST_MAX_CATARACT_LEVEL = 1;
const DEFAULT_ROUND_PROFILE = Object.freeze({
  seconds: DEFAULT_ROUND_SECONDS,
  isDilated: false,
  fovDegrees: TIMED_SAFE_FOV_DEGREES.undilated,
  cataractLevel: 0
});
const TIMED_AUGMENTATION_PROFILES = Object.freeze([
  {
    rotateMaxDegrees: 2.4,
    rotateMinDegrees: 0.9,
    scaleMin: 0.94,
    scaleMax: 1.07,
    minScaleDelta: 0.02,
    panMaxRatio: 0.025,
    panMinRatio: 0.008,
    brightnessJitter: 0.035,
    brightnessMinJitter: 0.015,
    contrastJitter: 0.035,
    contrastMinJitter: 0.015,
    saturationJitter: 0.03,
    saturationMinJitter: 0.01,
    verticalFlipChance: 0.18
  },
  {
    rotateMaxDegrees: 4.2,
    rotateMinDegrees: 1.6,
    scaleMin: 0.91,
    scaleMax: 1.1,
    minScaleDelta: 0.03,
    panMaxRatio: 0.04,
    panMinRatio: 0.012,
    brightnessJitter: 0.06,
    brightnessMinJitter: 0.025,
    contrastJitter: 0.06,
    contrastMinJitter: 0.025,
    saturationJitter: 0.06,
    saturationMinJitter: 0.025,
    verticalFlipChance: 0.28
  },
  {
    rotateMaxDegrees: 5.2,
    rotateMinDegrees: 1.9,
    scaleMin: 0.89,
    scaleMax: 1.12,
    minScaleDelta: 0.04,
    panMaxRatio: 0.048,
    panMinRatio: 0.015,
    brightnessJitter: 0.07,
    brightnessMinJitter: 0.03,
    contrastJitter: 0.07,
    contrastMinJitter: 0.03,
    saturationJitter: 0.07,
    saturationMinJitter: 0.03,
    verticalFlipChance: 0.38
  }
]);
const TIMED_MOTION_PROFILES = Object.freeze([
  {
    jitterMultiplierMin: 1.9,
    jitterMultiplierMax: 2.4,
    shiftDistanceMin: 1.15,
    shiftDistanceMax: 1.45,
    shiftDurationMinMs: 580,
    shiftDurationMaxMs: 800
  },
  {
    jitterMultiplierMin: 2.3,
    jitterMultiplierMax: 2.9,
    shiftDistanceMin: 1.35,
    shiftDistanceMax: 1.7,
    shiftDurationMinMs: 540,
    shiftDurationMaxMs: 760
  },
  {
    jitterMultiplierMin: 2.6,
    jitterMultiplierMax: 3.1,
    shiftDistanceMin: 1.45,
    shiftDistanceMax: 1.9,
    shiftDurationMinMs: 520,
    shiftDurationMaxMs: 740
  }
]);

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

function randomSignedWithMinimum(maxAbs, minAbs) {
  const safeMax = Math.max(0, Number(maxAbs) || 0);
  const safeMin = Math.max(0, Math.min(safeMax, Number(minAbs) || 0));
  if (safeMax === 0) {
    return 0;
  }

  const magnitude = randomInRange(safeMin, safeMax);
  return Math.random() >= 0.5 ? magnitude : -magnitude;
}

function randomScaleWithMinimumDelta(minScale, maxScale, minDelta) {
  const lower = Math.min(Number(minScale) || 1, Number(maxScale) || 1);
  const upper = Math.max(Number(minScale) || 1, Number(maxScale) || 1);
  const requiredDelta = Math.max(0, Number(minDelta) || 0);

  if (lower === upper) {
    return lower;
  }

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = randomInRange(lower, upper);
    if (Math.abs(candidate - 1) >= requiredDelta) {
      return candidate;
    }
  }

  return Math.abs(lower - 1) >= Math.abs(upper - 1) ? lower : upper;
}

function randomToneValue(maxJitter, minJitter) {
  return 1 + randomSignedWithMinimum(maxJitter, minJitter);
}

function clampTimedCataractLevel(level) {
  const numericLevel = Number(level);
  const roundedLevel = Number.isFinite(numericLevel)
    ? Math.round(numericLevel)
    : DEFAULT_ROUND_PROFILE.cataractLevel;
  return Math.max(0, Math.min(TIMED_TEST_MAX_CATARACT_LEVEL, roundedLevel));
}

function normalizeProgressState(rawState, tierCount) {
  const safeTierCount = Math.max(1, Number(tierCount) || 1);
  const rawNextTierIndex = Number(rawState?.nextTierIndex);
  const rawUnlockedTierIndex = Number(rawState?.unlockedTierIndex);

  const next = Number.isFinite(rawNextTierIndex)
    ? Math.max(0, Math.min(safeTierCount, Math.floor(rawNextTierIndex)))
    : 0;
  const maxUnlockedForNext = next >= safeTierCount ? safeTierCount - 1 : Math.max(-1, next - 1);
  const unlocked = Number.isFinite(rawUnlockedTierIndex)
    ? Math.min(
        maxUnlockedForNext,
        Math.max(-1, Math.min(safeTierCount - 1, Math.floor(rawUnlockedTierIndex)))
      )
    : -1;

  return {
    nextTierIndex: next,
    unlockedTierIndex: unlocked
  };
}

export function createTimedTestController({
  state,
  stateMachine,
  timedImages,
  timedRoundsPerCategory,
  timedTotalRounds,
  timedRoundProfiles,
  initialProgressState,
  onProgressChange,
  closeTestModal,
  setModalState,
  infoModal,
  infoIcon,
  explanationDiv,
  timedGuessBox,
  timedMessage,
  timedCountdown,
  submitTimedGuessButton,
  timedTestResult,
  viewer
}) {
  const guessQuery = 'input[name="timedGuess"]';
  const roundProfiles = Array.isArray(timedRoundProfiles) ? timedRoundProfiles : [];
  const totalRounds = Math.max(1, Number(timedTotalRounds) || ROUNDS_PER_SET);
  const roundsPerCategory = Math.max(1, Number(timedRoundsPerCategory) || 1);
  const normalizedInitialProgress = normalizeProgressState(initialProgressState, STAR_TIERS.length);

  let viewerStateBeforeTimed = null;
  let timedRoundQueue = [];
  let timedRoundEyes = [];
  let unlockedTierIndex = normalizedInitialProgress.unlockedTierIndex;
  let nextTierIndex = normalizedInitialProgress.nextTierIndex;
  let activeTierIndex = Math.min(normalizedInitialProgress.nextTierIndex, STAR_TIERS.length - 1);
  let revealIsActive = false;
  let timedSetFlipApplied = false;
  const timedGuessListenerDisposers = [];

  function notifyProgressChange() {
    if (typeof onProgressChange === 'function') {
      onProgressChange(getLevelProgress());
    }
  }

  function startTimedTest({ tierIndex } = {}) {
    if (!stateMachine.beginTimedSession()) {
      return false;
    }

    closeTestModal();
    setModalState(infoModal, false, infoIcon);

    clearTimedTimers();
    clearTimedGuessSelections();
    if (typeof viewer.clearTimedAugmentation === 'function') {
      viewer.clearTimedAugmentation();
    }
    if (typeof viewer.clearTimedMotionProfile === 'function') {
      viewer.clearTimedMotionProfile();
    }

    viewerStateBeforeTimed = {
      fovDegrees: typeof viewer.getFovDegrees === 'function' ? viewer.getFovDegrees() : null,
      isDilated: typeof viewer.getIsDilated === 'function' ? viewer.getIsDilated() : false,
      cataractLevel: typeof viewer.getCataractLevel === 'function' ? viewer.getCataractLevel() : 0,
      isRightEye: typeof viewer.getIsRightEye === 'function' ? viewer.getIsRightEye() : true
    };
    const requestedTierIndex = resolveRequestedTierIndex(tierIndex);
    if (requestedTierIndex === null) {
      stateMachine.endTimedSession();
      return false;
    }

    timedRoundQueue = buildTimedRoundQueue(timedImages, roundsPerCategory, totalRounds);
    timedRoundEyes = buildTimedEyeSequence(timedRoundQueue.length || totalRounds);
    activeTierIndex = requestedTierIndex;
    revealIsActive = false;
    timedSetFlipApplied = false;

    viewer.setDiscVisible(true);

    timedTestResult.innerHTML = '';
    timedMessage.textContent = '';
    timedCountdown.textContent = '';

    timedGuessBox.hidden = false;
    explanationDiv.hidden = true;

    viewer.setViewerControlsDisabled(true);
    disableTimedGuess(true);

    notifyProgressChange();
    nextTimedRound();
    return true;
  }

  function nextTimedRound() {
    state.timed.round += 1;
    const activeTotalRounds = getTotalRounds();

    if (state.timed.round > activeTotalRounds) {
      finishTimedTest();
      return;
    }

    const roundProfile = getRoundProfile();
    const roundEye = timedRoundEyes[state.timed.round - 1];
    applyRoundProfile(roundProfile, roundEye);
    const roundSeconds = Math.max(1, Number(roundProfile.seconds) || DEFAULT_ROUND_SECONDS);

    const pick =
      timedRoundQueue[state.timed.round - 1] ||
      timedImages[Math.floor(Math.random() * timedImages.length)];
    state.timed.currentLabel = pick.label;

    if (typeof viewer.setTimedAugmentation === 'function') {
      viewer.setTimedAugmentation(
        buildTimedRoundAugmentation(activeTierIndex, state.timed.round - 1, activeTotalRounds)
      );
    }
    if (typeof viewer.setTimedMotionProfile === 'function') {
      viewer.setTimedMotionProfile(buildTimedRoundMotionProfile(activeTierIndex));
    }

    viewer.setDiscVisible(true);
    viewer.setImageSource(pick.src);
    if (typeof viewer.doGazeShift === 'function' && !state.viewer.shiftInProgress) {
      viewer.doGazeShift();
    }

    timedMessage.textContent = `Round ${state.timed.round}/${activeTotalRounds}`;
    timedCountdown.textContent = String(roundSeconds);
    revealIsActive = true;
    disableTimedGuess(false);

    let remain = roundSeconds;
    const countdownId = setInterval(() => {
      remain -= 1;
      timedCountdown.textContent = String(remain);

      if (remain <= 0) {
        clearCountdownTimer();
        viewer.setDiscVisible(false);
        revealIsActive = false;

        timedMessage.textContent = 'Which disc was shown?';
        timedCountdown.textContent = '';
      }
    }, 1000);

    stateMachine.setTimedCountdownTimer(countdownId);
  }

  function submitTimedGuess() {
    if (!state.timed.isActive) {
      return;
    }

    const guess = getSelectedTimedGuess();
    if (!guess) {
      timedMessage.textContent = 'Select an answer before submitting.';
      syncSubmitGuessAvailability();
      return;
    }

    if (revealIsActive) {
      clearCountdownTimer();
      viewer.setDiscVisible(false);
      revealIsActive = false;
      timedCountdown.textContent = '';
    }

    const isCorrect = guess.value === state.timed.currentLabel;

    if (isCorrect) {
      state.timed.score += 1;
      guess.parentElement.classList.add('correct-answer-label');
    } else {
      guess.parentElement.classList.add('wrong-answer-label');

      const correctRadio = timedGuessBox.querySelector(
        `input[name="timedGuess"][value="${state.timed.currentLabel}"]`
      );

      if (correctRadio) {
        correctRadio.parentElement.classList.add('correct-answer-label');
      }
    }

    disableTimedGuess(true);

    const feedbackId = setTimeout(() => {
      clearTimedGuessSelections();
      nextTimedRound();
    }, 1200);
    stateMachine.setTimedFeedbackTimer(feedbackId);
  }

  function finishTimedTest() {
    clearTimedTimers();
    clearTimedGuessSelections();
    disableTimedGuess(true);
    timedGuessBox.hidden = true;
    revealIsActive = false;

    const resultSummary = buildTimedResultSummary(
      state.timed.score,
      getTotalRounds(),
      activeTierIndex
    );
    timedTestResult.innerHTML = resultSummary.html;

    if (!stateMachine.endTimedSession()) {
      return;
    }

    restoreStandardView({ clearResult: false });
  }

  function exitTimedMode() {
    if (!stateMachine.endTimedSession()) {
      return;
    }
    restoreStandardView({ clearResult: true });
  }

  function restoreStandardView({ clearResult }) {
    viewer.setDiscVisible(true);

    clearTimedTimers();
    clearTimedGuessSelections();
    disableTimedGuess(true);

    timedGuessBox.hidden = true;
    explanationDiv.hidden = false;
    timedMessage.textContent = '';
    timedCountdown.textContent = '';
    revealIsActive = false;

    if (clearResult) {
      timedTestResult.innerHTML = '';
    }

    restoreViewerStateAfterTimed();

    viewer.setViewerControlsDisabled(false);
    viewer.setImageSource(viewer.getActiveConditionImagePath());
  }

  function resolveRequestedTierIndex(tierIndex) {
    const fallbackTierIndex = Math.min(nextTierIndex, STAR_TIERS.length - 1);
    const requestedTierIndex = typeof tierIndex === 'number' ? tierIndex : fallbackTierIndex;

    if (!Number.isInteger(requestedTierIndex)) {
      return null;
    }

    if (requestedTierIndex < 0 || requestedTierIndex >= STAR_TIERS.length) {
      return null;
    }

    if (requestedTierIndex > nextTierIndex) {
      return null;
    }

    return requestedTierIndex;
  }

  function getRoundProfile() {
    if (roundProfiles.length === 0) {
      return DEFAULT_ROUND_PROFILE;
    }

    const profileIndex = Math.min(activeTierIndex, roundProfiles.length - 1);
    const profile = roundProfiles[profileIndex];
    if (!profile || typeof profile !== 'object') {
      return DEFAULT_ROUND_PROFILE;
    }

    const isDilated = Boolean(profile.isDilated);

    return {
      seconds: Number(profile.seconds) || DEFAULT_ROUND_PROFILE.seconds,
      isDilated,
      fovDegrees: isDilated ? TIMED_SAFE_FOV_DEGREES.dilated : TIMED_SAFE_FOV_DEGREES.undilated,
      cataractLevel: clampTimedCataractLevel(profile.cataractLevel)
    };
  }

  function getTotalRounds() {
    return timedRoundQueue.length > 0 ? timedRoundQueue.length : totalRounds;
  }

  function buildTimedRoundAugmentation(tierIndex, roundIndex, setTotalRounds) {
    const profileIndex = Math.max(
      0,
      Math.min(Number.isInteger(tierIndex) ? tierIndex : 0, TIMED_AUGMENTATION_PROFILES.length - 1)
    );
    const profile = TIMED_AUGMENTATION_PROFILES[profileIndex];
    const verticalFlipChance = Math.max(0, Math.min(1, Number(profile.verticalFlipChance) || 0));
    const safeTotalRounds = Math.max(1, Number(setTotalRounds) || 1);
    const safeRoundIndex = Math.max(
      0,
      Math.min(safeTotalRounds - 1, Number.isFinite(Number(roundIndex)) ? Number(roundIndex) : 0)
    );
    let flipVertical = Math.random() < verticalFlipChance;

    // Guarantee at least one vertical flip per timed set to prevent no-flip runs.
    if (!timedSetFlipApplied && safeRoundIndex >= safeTotalRounds - 1) {
      flipVertical = true;
    }
    if (flipVertical) {
      timedSetFlipApplied = true;
    }

    return {
      rotateDegrees: randomSignedWithMinimum(
        profile.rotateMaxDegrees,
        profile.rotateMinDegrees || 0
      ),
      scale: randomScaleWithMinimumDelta(
        profile.scaleMin,
        profile.scaleMax,
        profile.minScaleDelta || 0
      ),
      panXRatio: randomSignedWithMinimum(profile.panMaxRatio, profile.panMinRatio || 0),
      panYRatio: randomSignedWithMinimum(profile.panMaxRatio, profile.panMinRatio || 0),
      brightness: randomToneValue(profile.brightnessJitter, profile.brightnessMinJitter || 0),
      contrast: randomToneValue(profile.contrastJitter, profile.contrastMinJitter || 0),
      saturation: randomToneValue(profile.saturationJitter, profile.saturationMinJitter || 0),
      flipVertical
    };
  }

  function buildTimedRoundMotionProfile(tierIndex) {
    const profileIndex = Math.max(
      0,
      Math.min(Number.isInteger(tierIndex) ? tierIndex : 0, TIMED_MOTION_PROFILES.length - 1)
    );
    const profile = TIMED_MOTION_PROFILES[profileIndex];

    return {
      jitterMultiplier: randomInRange(profile.jitterMultiplierMin, profile.jitterMultiplierMax),
      shiftDistanceMultiplier: randomInRange(profile.shiftDistanceMin, profile.shiftDistanceMax),
      shiftDurationMs: Math.round(
        randomInRange(profile.shiftDurationMinMs, profile.shiftDurationMaxMs)
      )
    };
  }

  function buildTimedRoundQueue(images, perCategory, targetRounds) {
    if (!Array.isArray(images) || images.length === 0) {
      return [];
    }

    const desiredCount = Math.max(1, Number(targetRounds) || ROUNDS_PER_SET);
    const inventory = images.map((image) => ({
      image,
      remaining: Math.max(1, Number(perCategory) || 1)
    }));
    const queue = [];
    let previousLabel = null;

    while (queue.length < desiredCount) {
      let candidates = inventory.filter(
        (entry) => entry.remaining > 0 && entry.image.label !== previousLabel
      );

      if (candidates.length === 0) {
        candidates = inventory.filter((entry) => entry.remaining > 0);
      }

      if (candidates.length === 0) {
        inventory.forEach((entry) => {
          entry.remaining = Math.max(1, Number(perCategory) || 1);
        });
        candidates = inventory.filter(
          (entry) => entry.remaining > 0 && entry.image.label !== previousLabel
        );
        if (candidates.length === 0) {
          candidates = inventory.filter((entry) => entry.remaining > 0);
        }
      }

      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      queue.push(pick.image);
      pick.remaining -= 1;
      previousLabel = pick.image.label;
    }

    return queue;
  }

  function buildTimedEyeSequence(targetRounds) {
    const desiredCount = Math.max(1, Number(targetRounds) || ROUNDS_PER_SET);
    const startingEye =
      typeof viewer.getIsRightEye === 'function' ? !viewer.getIsRightEye() : Math.random() >= 0.5;
    const sequence = [];
    let nextIsRightEye = startingEye;

    for (let round = 0; round < desiredCount; round += 1) {
      sequence.push(nextIsRightEye);
      nextIsRightEye = !nextIsRightEye;
    }

    return sequence;
  }

  function applyRoundProfile(roundProfile, isRightEye) {
    applyViewerFovState(roundProfile);

    if (typeof viewer.setCataractLevel === 'function') {
      viewer.setCataractLevel(clampTimedCataractLevel(roundProfile.cataractLevel));
    }

    if (typeof isRightEye === 'boolean' && typeof viewer.setRightEye === 'function') {
      viewer.setRightEye(isRightEye);
    }
  }

  function restoreViewerStateAfterTimed() {
    if (typeof viewer.clearTimedAugmentation === 'function') {
      viewer.clearTimedAugmentation();
    }
    if (typeof viewer.clearTimedMotionProfile === 'function') {
      viewer.clearTimedMotionProfile();
    }

    if (!viewerStateBeforeTimed) {
      return;
    }

    applyViewerFovState(viewerStateBeforeTimed);

    if (typeof viewer.setCataractLevel === 'function') {
      viewer.setCataractLevel(viewerStateBeforeTimed.cataractLevel);
    }

    if (typeof viewer.setRightEye === 'function') {
      viewer.setRightEye(viewerStateBeforeTimed.isRightEye);
    }

    viewerStateBeforeTimed = null;
  }

  function buildTimedResultSummary(score, total, tierIndex) {
    const ratio = total > 0 ? score / total : 0;
    const passThreshold = Math.ceil(total * PASS_RATIO);
    const passedSet = score >= passThreshold;
    let guidance = 'Revise vessel obscuration and disc margin blur, then retry.';

    if (ratio === 1) {
      guidance = 'Excellent recognition. Keep this speed and consistency.';
    } else if (ratio >= PASS_RATIO) {
      guidance = 'Strong result. One more round should lock this in.';
    } else if (ratio >= 0.5) {
      guidance = 'Good start. Focus on swollen vs suspicious differences.';
    }

    const activeTier = STAR_TIERS[Math.min(tierIndex, STAR_TIERS.length - 1)];
    let starLine = '';
    let progressionChanged = false;

    if (passedSet && tierIndex === nextTierIndex && nextTierIndex < STAR_TIERS.length) {
      unlockedTierIndex = Math.max(unlockedTierIndex, nextTierIndex);
      starLine = `Unlocked ${STAR_TIERS[nextTierIndex].name} star.`;
      nextTierIndex += 1;
      progressionChanged = true;
    } else if (nextTierIndex >= STAR_TIERS.length) {
      unlockedTierIndex = STAR_TIERS.length - 1;
      starLine = 'All star tiers already unlocked.';
    } else {
      const nextTier = STAR_TIERS[Math.min(nextTierIndex, STAR_TIERS.length - 1)];
      starLine = `Need ${passThreshold}/${total} to unlock ${nextTier.name} star.`;
    }

    const unlockedTiers = STAR_TIERS.slice(0, unlockedTierIndex + 1);
    const starsMarkup = unlockedTiers
      .map(
        (tier) =>
          `<span class="${tier.className}" aria-label="${tier.name} star">&#9733; ${tier.name}</span>`
      )
      .join(' ');

    if (progressionChanged) {
      notifyProgressChange();
    }

    return {
      html: `Set ${Math.min(tierIndex + 1, STAR_TIERS.length)}/${STAR_TIERS.length} (${
        activeTier.name
      }): ${score}/${total}. ${guidance}<br>${starLine}${starsMarkup ? ` ${starsMarkup}` : ''}`
    };
  }

  function getLevelProgress() {
    return STAR_TIERS.map((tier, index) => ({
      index,
      name: tier.name,
      unlocked: index <= nextTierIndex,
      completed: index <= unlockedTierIndex,
      active: index === Math.min(nextTierIndex, STAR_TIERS.length - 1)
    }));
  }

  function getProgressState() {
    return {
      nextTierIndex,
      unlockedTierIndex
    };
  }

  function applyViewerFovState(viewerProfile) {
    const isDilated = Boolean(viewerProfile?.isDilated);
    const fovDegrees = Number(viewerProfile?.fovDegrees);
    if (typeof viewer.setFovDegrees === 'function') {
      const fallbackFov = isDilated
        ? TIMED_SAFE_FOV_DEGREES.dilated
        : TIMED_SAFE_FOV_DEGREES.undilated;
      viewer.setFovDegrees(Number.isFinite(fovDegrees) ? fovDegrees : fallbackFov);
      return;
    }
    if (typeof viewer.setDilated === 'function') {
      viewer.setDilated(isDilated);
      return;
    }
    if (!isDilated && typeof viewer.ensureUndilated === 'function') {
      viewer.ensureUndilated();
    }
  }

  function clearCountdownTimer() {
    if (state.timed.countdownTimer) {
      clearInterval(state.timed.countdownTimer);
      stateMachine.setTimedCountdownTimer(null);
    }
  }

  function clearTimedTimers() {
    clearCountdownTimer();

    if (state.timed.feedbackTimer) {
      clearTimeout(state.timed.feedbackTimer);
      stateMachine.setTimedFeedbackTimer(null);
    }
  }

  function disableTimedGuess(disable) {
    timedGuessBox.querySelectorAll(guessQuery).forEach((radio) => {
      radio.disabled = disable;
    });

    if (disable) {
      submitTimedGuessButton.disabled = true;
      return;
    }

    syncSubmitGuessAvailability();
  }

  function getSelectedTimedGuess() {
    return timedGuessBox.querySelector(`${guessQuery}:checked`);
  }

  function syncSubmitGuessAvailability() {
    const radios = timedGuessBox.querySelectorAll(guessQuery);
    const hasEnabledOptions = Array.from(radios).some((radio) => !radio.disabled);
    if (!hasEnabledOptions) {
      submitTimedGuessButton.disabled = true;
      return;
    }

    submitTimedGuessButton.disabled = getSelectedTimedGuess() === null;
  }

  timedGuessBox.querySelectorAll(guessQuery).forEach((radio) => {
    if (typeof radio.addEventListener === 'function') {
      radio.addEventListener('change', syncSubmitGuessAvailability);
      timedGuessListenerDisposers.push(() => {
        if (typeof radio.removeEventListener === 'function') {
          radio.removeEventListener('change', syncSubmitGuessAvailability);
        }
      });
    }
  });

  function clearTimedGuessSelections() {
    timedGuessBox.querySelectorAll(guessQuery).forEach((radio) => {
      radio.checked = false;
      radio.parentElement.classList.remove('correct-answer-label', 'wrong-answer-label');
    });

    syncSubmitGuessAvailability();
  }

  return {
    startTimedTest,
    submitTimedGuess,
    exitTimedMode,
    getLevelProgress,
    getProgressState,
    destroy: () => {
      timedGuessListenerDisposers.splice(0).forEach((dispose) => {
        dispose();
      });
      stateMachine.endTimedSession();
      restoreStandardView({ clearResult: true });
      timedRoundQueue = [];
      timedRoundEyes = [];
      unlockedTierIndex = -1;
      nextTierIndex = 0;
      activeTierIndex = 0;
      revealIsActive = false;
      timedSetFlipApplied = false;
      state.timed.round = 0;
      state.timed.score = 0;
      state.timed.currentLabel = '';
      notifyProgressChange();
    }
  };
}
