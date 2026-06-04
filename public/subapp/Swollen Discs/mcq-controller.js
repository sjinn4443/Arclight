const DEFAULT_MCQ_TIER = {
  name: 'Advanced',
  className: 'advanced-star',
  questionCount: 7,
  optionCount: 5,
  passRatio: 0.7,
  timeLimitSeconds: 0,
  questionIds: [],
  questionPrompts: []
};

function normalizeTierConfig(rawTier, index) {
  const tier = rawTier && typeof rawTier === 'object' ? rawTier : {};
  const normalizedName = String(tier.name || `Level ${index + 1}`);
  const normalizedClassName = String(tier.className || '');
  const normalizedQuestionCount = Math.max(1, Number(tier.questionCount) || 7);
  const normalizedOptionCount = Math.max(2, Number(tier.optionCount) || 5);
  const normalizedPassRatio = Math.min(1, Math.max(0.5, Number(tier.passRatio) || 0.7));
  const normalizedTimeLimitSeconds = Math.max(0, Number(tier.timeLimitSeconds) || 0);
  const normalizedQuestionIds = Array.isArray(tier.questionIds)
    ? tier.questionIds.filter(
        (questionId) => typeof questionId === 'string' && questionId.trim().length > 0
      )
    : [];
  const normalizedQuestionPrompts = Array.isArray(tier.questionPrompts)
    ? tier.questionPrompts.filter(
        (prompt) => typeof prompt === 'string' && prompt.trim().length > 0
      )
    : [];

  return {
    name: normalizedName,
    className: normalizedClassName,
    questionCount: normalizedQuestionCount,
    optionCount: normalizedOptionCount,
    passRatio: normalizedPassRatio,
    timeLimitSeconds: normalizedTimeLimitSeconds,
    questionIds: normalizedQuestionIds,
    questionPrompts: normalizedQuestionPrompts
  };
}

function normalizeProgressState(rawState, tierCount) {
  const safeTierCount = Math.max(1, Number(tierCount) || 1);
  const rawNextTierIndex = Number(rawState?.nextTierIndex);
  const rawUnlockedTierIndex = Number(rawState?.unlockedTierIndex);

  const nextTierIndex = Number.isFinite(rawNextTierIndex)
    ? Math.max(0, Math.min(safeTierCount, Math.floor(rawNextTierIndex)))
    : 0;
  const maxUnlockedForNext =
    nextTierIndex >= safeTierCount ? safeTierCount - 1 : Math.max(-1, nextTierIndex - 1);
  const unlockedTierIndex = Number.isFinite(rawUnlockedTierIndex)
    ? Math.min(
        maxUnlockedForNext,
        Math.max(-1, Math.min(safeTierCount - 1, Math.floor(rawUnlockedTierIndex)))
      )
    : -1;

  return {
    nextTierIndex,
    unlockedTierIndex
  };
}

function buildQuestionCatalog(questionBank) {
  if (!Array.isArray(questionBank)) {
    return [];
  }

  return questionBank
    .map((sourceQuestion, index) => {
      if (!sourceQuestion || typeof sourceQuestion !== 'object') {
        return null;
      }

      const fallbackId = `q${String(index + 1).padStart(2, '0')}`;
      const id =
        typeof sourceQuestion.id === 'string' && sourceQuestion.id.trim().length > 0
          ? sourceQuestion.id
          : fallbackId;
      const prompt = typeof sourceQuestion.question === 'string' ? sourceQuestion.question : '';

      return {
        id,
        prompt,
        sourceQuestion
      };
    })
    .filter(Boolean);
}

function formatSeconds(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(safeSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function createMcqController({
  state,
  stateMachine,
  questionBank,
  buildMcqTest,
  evaluateMcqSubmission,
  generatePassCode,
  formatMcqResultText,
  setModalState,
  testModal,
  triggerButton,
  testContainer,
  submitTestButton,
  saveResultButton,
  testResultDiv,
  testModalTitle,
  mcqTimer,
  mcqTierConfigs,
  initialProgressState,
  onProgressChange
}) {
  const doc = testContainer.ownerDocument || document;
  const tierConfigs =
    Array.isArray(mcqTierConfigs) && mcqTierConfigs.length > 0
      ? mcqTierConfigs.map((tier, index) => normalizeTierConfig(tier, index))
      : [DEFAULT_MCQ_TIER];
  const questionCatalog = buildQuestionCatalog(questionBank);
  const normalizedInitialProgress = normalizeProgressState(
    initialProgressState,
    tierConfigs.length
  );

  let activeTierIndex = Math.min(normalizedInitialProgress.nextTierIndex, tierConfigs.length - 1);
  let unlockedTierIndex = normalizedInitialProgress.unlockedTierIndex;
  let nextTierIndex = normalizedInitialProgress.nextTierIndex;
  let mcqCountdownTimerId = null;
  let secondsRemaining = 0;

  function getQuestionsByIds(questionIds) {
    if (questionCatalog.length === 0) {
      return [];
    }

    const allowedIds = new Set(questionIds);
    return questionCatalog
      .filter((entry) => allowedIds.has(entry.id))
      .map((entry) => entry.sourceQuestion);
  }

  function getQuestionsByPrompts(questionPrompts) {
    if (questionCatalog.length === 0) {
      return [];
    }

    const allowedPrompts = new Set(questionPrompts);
    return questionCatalog
      .filter((entry) => allowedPrompts.has(entry.prompt))
      .map((entry) => entry.sourceQuestion);
  }

  function validateTierQuestionPools() {
    tierConfigs.forEach((tierConfig) => {
      const hasQuestionIds =
        Array.isArray(tierConfig.questionIds) && tierConfig.questionIds.length > 0;
      const hasQuestionPrompts =
        Array.isArray(tierConfig.questionPrompts) && tierConfig.questionPrompts.length > 0;

      if (!hasQuestionIds && !hasQuestionPrompts) {
        return;
      }

      const configuredPool = hasQuestionIds
        ? getQuestionsByIds(tierConfig.questionIds)
        : getQuestionsByPrompts(tierConfig.questionPrompts);
      if (configuredPool.length < tierConfig.questionCount) {
        throw new Error(
          `MCQ tier "${tierConfig.name}" has ${configuredPool.length} configured questions but requires at least ${tierConfig.questionCount}.`
        );
      }
    });
  }

  validateTierQuestionPools();

  function notifyProgressChange() {
    if (typeof onProgressChange === 'function') {
      onProgressChange(getLevelProgress());
    }
  }

  function resolveRequestedTierIndex(tierIndex) {
    const fallbackTierIndex = Math.min(nextTierIndex, tierConfigs.length - 1);
    const requestedTierIndex = typeof tierIndex === 'number' ? tierIndex : fallbackTierIndex;

    if (!Number.isInteger(requestedTierIndex)) {
      return null;
    }

    if (requestedTierIndex < 0 || requestedTierIndex >= tierConfigs.length) {
      return null;
    }

    if (requestedTierIndex > nextTierIndex) {
      return null;
    }

    return requestedTierIndex;
  }

  function getActiveTierConfig() {
    return tierConfigs[Math.min(activeTierIndex, tierConfigs.length - 1)] || DEFAULT_MCQ_TIER;
  }

  function clearMcqTimer() {
    if (mcqCountdownTimerId) {
      clearInterval(mcqCountdownTimerId);
      mcqCountdownTimerId = null;
    }
  }

  function updateTimerDisplay() {
    if (!mcqTimer) {
      return;
    }

    const tierConfig = getActiveTierConfig();
    if (tierConfig.timeLimitSeconds <= 0 || state.mcq.lastResult) {
      mcqTimer.hidden = true;
      mcqTimer.textContent = '';
      mcqTimer.classList.remove('is-warning');
      return;
    }

    mcqTimer.hidden = false;
    mcqTimer.textContent = `Time left: ${formatSeconds(secondsRemaining)}`;
    mcqTimer.classList.toggle('is-warning', secondsRemaining <= 15);
  }

  function startMcqTimer() {
    clearMcqTimer();

    const tierConfig = getActiveTierConfig();
    secondsRemaining = Math.max(0, Number(tierConfig.timeLimitSeconds) || 0);
    updateTimerDisplay();

    if (secondsRemaining <= 0) {
      return;
    }

    mcqCountdownTimerId = setInterval(() => {
      secondsRemaining -= 1;
      updateTimerDisplay();

      if (secondsRemaining > 0) {
        return;
      }

      clearMcqTimer();
      handleSubmitTest({ autoSubmitted: true });
    }, 1000);
  }

  function applyTierUiState() {
    if (!testModalTitle) {
      return;
    }

    const tierConfig = getActiveTierConfig();
    testModalTitle.textContent = `MCQ Test - ${tierConfig.name}`;
  }

  function openTestModal({ beforeOpen, tierIndex } = {}) {
    if (typeof beforeOpen === 'function') {
      beforeOpen();
    }

    if (!stateMachine.beginMcqSession()) {
      return false;
    }

    const requestedTierIndex = resolveRequestedTierIndex(tierIndex);
    if (requestedTierIndex === null) {
      stateMachine.endMcqSession();
      return false;
    }

    activeTierIndex = requestedTierIndex;
    testResultDiv.textContent = '';
    submitTestButton.hidden = false;
    submitTestButton.disabled = false;
    saveResultButton.hidden = true;

    applyTierUiState();
    generateTest();
    startMcqTimer();
    notifyProgressChange();

    setModalState(testModal, true, triggerButton);
    return true;
  }

  function closeTestModal() {
    stateMachine.endMcqSession();
    clearMcqTimer();
    setModalState(testModal, false, null);
    testContainer.innerHTML = '';
    updateTimerDisplay();
  }

  function generateTest() {
    const tierConfig = getActiveTierConfig();
    const sourceQuestionPool = getQuestionPoolForTier(tierConfig);
    state.mcq.selectedQuestions = buildMcqTest(
      sourceQuestionPool,
      tierConfig.questionCount,
      Math.random,
      tierConfig.optionCount
    );
    renderQuestions();
  }

  function getQuestionPoolForTier(tierConfig) {
    if (!Array.isArray(questionBank) || questionBank.length === 0) {
      return [];
    }

    if (Array.isArray(tierConfig.questionIds) && tierConfig.questionIds.length > 0) {
      return getQuestionsByIds(tierConfig.questionIds);
    }

    if (!Array.isArray(tierConfig.questionPrompts) || tierConfig.questionPrompts.length === 0) {
      return questionBank;
    }

    return getQuestionsByPrompts(tierConfig.questionPrompts);
  }

  function renderQuestions() {
    testContainer.innerHTML = '';

    state.mcq.selectedQuestions.forEach((question, index) => {
      const questionFieldset = doc.createElement('fieldset');
      questionFieldset.className = 'question';

      const prompt = doc.createElement('legend');
      prompt.textContent = `${index + 1}. ${question.prompt}`;
      questionFieldset.appendChild(prompt);

      const optionsDiv = doc.createElement('div');
      optionsDiv.className = 'options';

      question.choices.forEach((choice, choiceIndex) => {
        const label = doc.createElement('label');
        const radio = doc.createElement('input');
        const optionPrefix = String.fromCharCode(65 + choiceIndex);
        const optionText = doc.createElement('span');

        radio.type = 'radio';
        radio.name = `question${index}`;
        radio.value = choice.id;

        label.appendChild(radio);
        optionText.textContent = ` ${optionPrefix}) ${choice.text}`;
        label.appendChild(optionText);
        optionsDiv.appendChild(label);
      });

      questionFieldset.appendChild(optionsDiv);
      testContainer.appendChild(questionFieldset);
    });
  }

  function calculateTierProgression({ passed, score, maxScore, passThreshold }) {
    let starLine = '';
    let progressionChanged = false;

    if (passed && activeTierIndex === nextTierIndex && nextTierIndex < tierConfigs.length) {
      unlockedTierIndex = Math.max(unlockedTierIndex, nextTierIndex);
      starLine = `Unlocked ${tierConfigs[nextTierIndex].name} star.`;
      nextTierIndex += 1;
      progressionChanged = true;
    } else if (nextTierIndex >= tierConfigs.length) {
      unlockedTierIndex = tierConfigs.length - 1;
      starLine = 'All MCQ levels already unlocked.';
    } else {
      const nextTier = tierConfigs[Math.min(nextTierIndex, tierConfigs.length - 1)];
      starLine = `Need ${passThreshold}/${maxScore} to unlock ${nextTier.name}.`;
    }

    if (!passed) {
      starLine = `Scored ${score}/${maxScore}. ${starLine}`;
    }

    if (progressionChanged) {
      notifyProgressChange();
    }

    return { starLine };
  }

  function renderUnlockedTierStars() {
    const unlockedTiers = tierConfigs.slice(0, unlockedTierIndex + 1);
    return unlockedTiers
      .map((tier) => {
        return `<span class="${tier.className}" aria-label="${tier.name} star">&#9733; ${tier.name}</span>`;
      })
      .join(' ');
  }

  function handleSubmitTest({ autoSubmitted = false } = {}) {
    if (state.mcq.selectedQuestions.length === 0 || state.mcq.lastResult) {
      return;
    }

    const selectedChoiceIds = state.mcq.selectedQuestions.map((_, index) => {
      const chosen = testContainer.querySelector(`input[name="question${index}"]:checked`);
      return chosen ? chosen.value : null;
    });

    const tierConfig = getActiveTierConfig();
    const evaluation = evaluateMcqSubmission(
      state.mcq.selectedQuestions,
      selectedChoiceIds,
      tierConfig.passRatio
    );

    evaluation.details.forEach((detail) => {
      if (detail.selectedChoiceId && !detail.isCorrect) {
        const selectedRadio = testContainer.querySelector(
          `input[name="question${detail.index}"][value="${detail.selectedChoiceId}"]`
        );
        if (selectedRadio) {
          selectedRadio.parentElement.classList.add('wrong-answer-label');
        }
      }

      const correctRadio = testContainer.querySelector(
        `input[name="question${detail.index}"][value="${detail.correctChoiceId}"]`
      );

      if (correctRadio) {
        correctRadio.parentElement.classList.add('correct-answer-label');
      }
    });

    const allRadios = testContainer.querySelectorAll('input[type="radio"]');
    allRadios.forEach((radio) => {
      radio.disabled = true;
    });

    clearMcqTimer();

    state.mcq.lastResult = {
      ...evaluation,
      passCode: evaluation.passed ? generatePassCode(8) : null,
      completedAt: new Date().toISOString(),
      tierName: tierConfig.name,
      tierIndex: activeTierIndex,
      timed: tierConfig.timeLimitSeconds > 0,
      timedOut: autoSubmitted
    };

    const progression = calculateTierProgression({
      passed: evaluation.passed,
      score: evaluation.score,
      maxScore: evaluation.maxScore,
      passThreshold: evaluation.passThreshold
    });

    submitTestButton.hidden = true;
    showTestResult(state.mcq.lastResult, progression.starLine);
    saveResultButton.hidden = false;
    updateTimerDisplay();
  }

  function handleSaveResult() {
    if (!state.mcq.lastResult) {
      return;
    }

    const content = formatMcqResultText(state.mcq.lastResult);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = doc.createElement('a');

    a.href = url;
    a.download = getResultFilename(state.mcq.lastResult.completedAt);
    doc.body.appendChild(a);
    a.click();
    doc.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function showTestResult(result, starLine) {
    const unlockedStarsMarkup = renderUnlockedTierStars();
    let resultText = `Level ${result.tierIndex + 1} (${result.tierName}): ${result.score}/${
      result.maxScore
    }. `;

    if (result.passed) {
      resultText += 'Pass. ';
      if (result.passCode) {
        resultText += `Code: ${result.passCode}. `;
      }
    } else {
      resultText += 'Fail. ';
    }

    if (result.timed && result.timedOut) {
      resultText += 'Time expired. ';
    }

    resultText += starLine;

    if (unlockedStarsMarkup) {
      resultText += `<br>${unlockedStarsMarkup}`;
    }

    testResultDiv.innerHTML = resultText;
  }

  function getResultFilename(completedAtIsoString) {
    const timestamp = completedAtIsoString
      ? completedAtIsoString.replace(/[:-]/g, '').replace(/\.\d{3}Z$/, 'Z')
      : 'unknown';

    return `mcq_result_${timestamp}.txt`;
  }

  function getLevelProgress() {
    return tierConfigs.map((tier, index) => ({
      index,
      name: tier.name,
      unlocked: index <= nextTierIndex,
      completed: index <= unlockedTierIndex,
      active: index === Math.min(nextTierIndex, tierConfigs.length - 1)
    }));
  }

  function getProgressState() {
    return {
      nextTierIndex,
      unlockedTierIndex
    };
  }

  return {
    openTestModal,
    closeTestModal,
    handleSubmitTest,
    handleSaveResult,
    getLevelProgress,
    getProgressState,
    destroy: () => {
      clearMcqTimer();
      stateMachine.endMcqSession();
      testContainer.innerHTML = '';
      testResultDiv.textContent = '';
      updateTimerDisplay();
      unlockedTierIndex = -1;
      nextTierIndex = 0;
      activeTierIndex = 0;
      notifyProgressChange();
    }
  };
}
