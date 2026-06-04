function shuffle(array) {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function formatSeconds(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(safeSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function closeAllModals() {
  document.querySelectorAll(".modal.is-open").forEach((modal) => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  });
  document.body.classList.remove("modal-open");
}

export function initMcqUi({ questionBank, tiers }) {
  if (
    !Array.isArray(questionBank) ||
    questionBank.length === 0 ||
    !Array.isArray(tiers) ||
    tiers.length === 0
  ) {
    return;
  }

  const burgerIcon = document.getElementById("burger-icon");
  const sideMenu = document.getElementById("sideMenu");
  const sideMenuClose = document.getElementById("sideMenuClose");
  const menuBackdrop = document.getElementById("menuBackdrop");
  const infoIcon = document.getElementById("info-icon");
  const infoModal = document.getElementById("infoModal");
  const closeInfoModal = document.getElementById("closeInfoModal");

  const testModal = document.getElementById("testModal");
  const closeTestModal = document.getElementById("closeTestModal");
  const testModalTitle = document.getElementById("testModalTitle");
  const mcqTimer = document.getElementById("mcqTimer");
  const mcqQuestionProgress = document.getElementById("mcqQuestionProgress");
  const testContainer = document.getElementById("testContainer");
  const submitTestButton = document.getElementById("submitTestButton");
  const saveResultButton = document.getElementById("saveResultButton");
  const testResult = document.getElementById("testResult");

  const levelButtons = Array.from(
    document.querySelectorAll(".mcq-level-button"),
  );

  if (
    !burgerIcon ||
    !sideMenu ||
    !sideMenuClose ||
    !menuBackdrop ||
    !infoIcon ||
    !infoModal ||
    !closeInfoModal ||
    !testModal ||
    !closeTestModal ||
    !testModalTitle ||
    !mcqTimer ||
    !mcqQuestionProgress ||
    !testContainer ||
    !submitTestButton ||
    !saveResultButton ||
    !testResult ||
    levelButtons.length === 0
  ) {
    return;
  }

  const state = {
    activeTierIndex: 0,
    selectedQuestions: [],
    lastResult: null,
    timerId: null,
    secondsRemaining: 0,
  };

  function setBodyModalState() {
    const hasOpenModal = Boolean(document.querySelector(".modal.is-open"));
    document.body.classList.toggle("modal-open", hasOpenModal);
  }

  function setModalOpen(modal, isOpen) {
    if (isOpen) {
      setSideMenuOpen(false);
      closeAllModals();
    }

    modal.classList.toggle("is-open", isOpen);
    modal.setAttribute("aria-hidden", isOpen ? "false" : "true");
    setBodyModalState();
  }

  function setSideMenuOpen(isOpen) {
    sideMenu.classList.toggle("open", isOpen);
    sideMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
    burgerIcon.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuBackdrop.hidden = !isOpen;
    menuBackdrop.classList.toggle("is-visible", isOpen);
  }

  function renderLevelButtons() {
    levelButtons.forEach((button) => {
      const tierIndex = Number(button.dataset.levelIndex);
      const tier = tiers[tierIndex];

      button.textContent = `Level ${tierIndex + 1}: ${tier.name}`;
      button.removeAttribute("data-locked");
      button.setAttribute("aria-disabled", "false");
      button.disabled = false;
    });
  }

  function clearTimer() {
    if (state.timerId !== null) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function updateTimerUi() {
    const tier = tiers[state.activeTierIndex];
    if (!tier || tier.timeLimitSeconds <= 0 || state.lastResult) {
      mcqTimer.hidden = true;
      mcqTimer.classList.remove("is-warning");
      mcqTimer.textContent = "";
      return;
    }

    mcqTimer.hidden = false;
    mcqTimer.textContent = `Time left: ${formatSeconds(state.secondsRemaining)}`;
    mcqTimer.classList.toggle("is-warning", state.secondsRemaining <= 20);
  }

  function startTimer() {
    clearTimer();

    const tier = tiers[state.activeTierIndex];
    state.secondsRemaining = Math.max(0, Number(tier.timeLimitSeconds) || 0);
    updateTimerUi();

    if (state.secondsRemaining <= 0) {
      return;
    }

    state.timerId = window.setInterval(() => {
      state.secondsRemaining -= 1;
      updateTimerUi();

      if (state.secondsRemaining > 0) {
        return;
      }

      clearTimer();
      submitCurrentTest({ autoSubmitted: true });
    }, 1000);
  }

  function getTierPool(tier) {
    const allowedIds = new Set(
      Array.isArray(tier.questionIds) ? tier.questionIds : [],
    );
    const rawPool = questionBank.filter((question) =>
      allowedIds.has(question.id),
    );
    return rawPool;
  }

  function buildTierQuestions(tier) {
    const pool = getTierPool(tier);
    if (pool.length === 0) {
      return [];
    }

    const questionCount = Math.min(tier.questionCount, pool.length);
    return shuffle(pool)
      .slice(0, questionCount)
      .map((question) => {
        const optionCount = Math.min(tier.optionCount, question.choices.length);
        const shuffledChoices = shuffle(question.choices).slice(0, optionCount);

        if (
          !shuffledChoices.some((choice) => choice.id === question.correctId)
        ) {
          const correctChoice = question.choices.find(
            (choice) => choice.id === question.correctId,
          );
          if (correctChoice) {
            shuffledChoices[shuffledChoices.length - 1] = correctChoice;
          }
        }

        return {
          ...question,
          choices: shuffle(shuffledChoices),
        };
      });
  }

  function renderQuestions() {
    testContainer.replaceChildren();

    state.selectedQuestions.forEach((question, questionIndex) => {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "question";

      const legend = document.createElement("legend");
      legend.textContent = `${questionIndex + 1}. ${question.prompt}`;
      fieldset.appendChild(legend);

      const options = document.createElement("div");
      options.className = "options";

      question.choices.forEach((choice) => {
        const label = document.createElement("label");
        const radio = document.createElement("input");
        const text = document.createElement("span");

        radio.type = "radio";
        radio.name = `question-${questionIndex}`;
        radio.value = choice.id;
        radio.addEventListener("change", updateQuestionProgress);

        text.textContent = choice.text;

        label.appendChild(radio);
        label.appendChild(text);
        options.appendChild(label);
      });

      fieldset.appendChild(options);
      testContainer.appendChild(fieldset);
    });
  }

  function getAnsweredCount() {
    return state.selectedQuestions.reduce((count, _, questionIndex) => {
      const selected = testContainer.querySelector(
        `input[name="question-${questionIndex}"]:checked`,
      );
      return count + (selected ? 1 : 0);
    }, 0);
  }

  function areAllQuestionsAnswered() {
    return (
      state.selectedQuestions.length > 0 &&
      getAnsweredCount() === state.selectedQuestions.length
    );
  }

  function updateQuestionProgress() {
    const total = state.selectedQuestions.length;
    const tier = tiers[state.activeTierIndex];
    const passThreshold = tier ? Math.ceil(total * tier.passRatio) : 0;
    mcqQuestionProgress.textContent = `${total} questions. Pass mark ${passThreshold}.`;

    if (!state.lastResult) {
      submitTestButton.disabled = total === 0;
      testResult.textContent = "";
      testResult.style.color = "";
    }
  }

  function openTierTest(tierIndex) {
    if (tierIndex < 0 || tierIndex >= tiers.length) {
      return;
    }

    const tier = tiers[tierIndex];
    state.activeTierIndex = tierIndex;
    state.selectedQuestions = buildTierQuestions(tier);
    state.lastResult = null;

    testModalTitle.textContent = `${tier.name} MCQ`;
    testResult.textContent = "";
    testResult.style.color = "";
    submitTestButton.hidden = false;
    submitTestButton.disabled = false;
    saveResultButton.hidden = true;

    renderQuestions();
    updateQuestionProgress();
    startTimer();
    setModalOpen(testModal, true);

    const firstInput = testContainer.querySelector('input[type="radio"]');
    if (firstInput instanceof HTMLInputElement) {
      firstInput.focus();
    }
  }

  function closeTest() {
    clearTimer();
    setModalOpen(testModal, false);
    testContainer.replaceChildren();
    state.selectedQuestions = [];
    state.lastResult = null;
    mcqQuestionProgress.textContent = "0 questions.";
    updateTimerUi();
  }

  function evaluateSubmission() {
    const results = state.selectedQuestions.map((question, questionIndex) => {
      const selected = testContainer.querySelector(
        `input[name="question-${questionIndex}"]:checked`,
      );
      const selectedChoiceId = selected ? selected.value : null;
      const isCorrect = selectedChoiceId === question.correctId;
      return {
        index: questionIndex,
        selectedChoiceId,
        correctChoiceId: question.correctId,
        isCorrect,
      };
    });

    const score = results.filter((result) => result.isCorrect).length;
    const maxScore = state.selectedQuestions.length;
    const tier = tiers[state.activeTierIndex];
    const passThreshold = Math.ceil(maxScore * tier.passRatio);
    const passed = score >= passThreshold;

    return {
      score,
      maxScore,
      passThreshold,
      passed,
      details: results,
    };
  }

  function markAnswers(result) {
    result.details.forEach((detail) => {
      const question = state.selectedQuestions[detail.index];
      const fieldset = testContainer.children[detail.index];
      const selectedLabel =
        detail.selectedChoiceId &&
        testContainer.querySelector(
          `input[name="question-${detail.index}"][value="${detail.selectedChoiceId}"]`,
        )?.parentElement;
      const correctLabel = testContainer.querySelector(
        `input[name="question-${detail.index}"][value="${detail.correctChoiceId}"]`,
      )?.parentElement;

      if (selectedLabel && !detail.isCorrect) {
        selectedLabel.classList.add("wrong-answer-label");
      }

      if (correctLabel) {
        correctLabel.classList.add("correct-answer-label");
      }

      if (fieldset instanceof HTMLElement) {
        const correctChoiceText =
          question.choices.find(
            (choice) => choice.id === detail.correctChoiceId,
          )?.text || "";

        const feedback = document.createElement("p");
        feedback.className = `question-feedback ${detail.isCorrect ? "is-correct" : "is-incorrect"}`;
        if (detail.isCorrect) {
          feedback.textContent = "Correct.";
        } else {
          feedback.textContent = `Incorrect. Correct answer: ${correctChoiceText}`;
        }
        fieldset.appendChild(feedback);
      }
    });

    testContainer.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.disabled = true;
    });
  }

  function getResultMessage(passed) {
    return passed ? "Pass recorded." : "Review the feedback and try again.";
  }

  function submitCurrentTest({ autoSubmitted = false } = {}) {
    if (state.selectedQuestions.length === 0 || state.lastResult) {
      return;
    }

    if (!autoSubmitted && !areAllQuestionsAnswered()) {
      testResult.textContent = "Please answer all questions before submitting.";
      testResult.style.color = "#c4171d";
      return;
    }

    const result = evaluateSubmission();
    markAnswers(result);
    clearTimer();

    const tier = tiers[state.activeTierIndex];
    const resultMessage = getResultMessage(result.passed);

    state.lastResult = {
      ...result,
      tierName: tier.name,
      tierIndex: state.activeTierIndex,
      completedAt: new Date().toISOString(),
      timedOut: autoSubmitted,
    };

    submitTestButton.hidden = true;
    saveResultButton.hidden = false;

    const summary = document.createElement("p");
    summary.className = "result-summary";
    let summaryText = `Level ${state.lastResult.tierIndex + 1} (${state.lastResult.tierName}): ${state.lastResult.score}/${state.lastResult.maxScore}. `;
    summaryText += state.lastResult.passed ? "Pass. " : "Fail. ";

    if (state.lastResult.timedOut) {
      summaryText += "Time expired. ";
    }

    summaryText += resultMessage;
    summary.textContent = summaryText;

    testResult.style.color = state.lastResult.passed ? "#0f9644" : "#c4171d";
    testResult.replaceChildren(summary);

    updateQuestionProgress();
    updateTimerUi();
  }

  function saveResult() {
    if (!state.lastResult) {
      return;
    }

    const contentLines = [
      "Newton MCQ Result",
      `Tier: ${state.lastResult.tierName}`,
      `Score: ${state.lastResult.score}/${state.lastResult.maxScore}`,
      `Pass Mark: ${state.lastResult.passThreshold}`,
      `Outcome: ${state.lastResult.passed ? "Pass" : "Fail"}`,
      `Completed: ${new Date(state.lastResult.completedAt).toLocaleString()}`,
      state.lastResult.timedOut ? "Timed Out: Yes" : "Timed Out: No",
    ];

    const blob = new Blob([contentLines.join("\n")], { type: "text/plain" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const safeTierName = state.lastResult.tierName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    link.href = url;
    link.download = `newton_mcq_${safeTierName}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  burgerIcon.addEventListener("click", () => {
    setSideMenuOpen(!sideMenu.classList.contains("open"));
  });

  sideMenuClose.addEventListener("click", () => {
    setSideMenuOpen(false);
  });

  menuBackdrop.addEventListener("click", () => {
    setSideMenuOpen(false);
  });

  infoIcon.addEventListener("click", () => {
    setSideMenuOpen(false);
    setModalOpen(infoModal, !infoModal.classList.contains("is-open"));
  });

  closeInfoModal.addEventListener("click", () => {
    setModalOpen(infoModal, false);
  });

  closeTestModal.addEventListener("click", closeTest);
  submitTestButton.addEventListener("click", () =>
    submitCurrentTest({ autoSubmitted: false }),
  );
  saveResultButton.addEventListener("click", saveResult);

  levelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tierIndex = Number(button.dataset.levelIndex);
      openTierTest(tierIndex);
      setSideMenuOpen(false);
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    if (
      sideMenu.classList.contains("open") &&
      !sideMenu.contains(target) &&
      !burgerIcon.contains(target)
    ) {
      setSideMenuOpen(false);
    }

    if (target === infoModal) {
      setModalOpen(infoModal, false);
    }

    if (target === testModal) {
      closeTest();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (testModal.classList.contains("is-open")) {
      closeTest();
      return;
    }

    if (infoModal.classList.contains("is-open")) {
      setModalOpen(infoModal, false);
      return;
    }

    if (sideMenu.classList.contains("open")) {
      setSideMenuOpen(false);
    }
  });

  renderLevelButtons();
  setSideMenuOpen(false);
  updateTimerUi();
}
