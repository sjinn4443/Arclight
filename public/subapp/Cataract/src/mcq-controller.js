import { $, $$ } from "./dom-utils.js";
import {
  MCQ_LEVELS,
  MCQ_SOURCE_REFERENCES,
  MCQ_STORAGE_KEY,
} from "./mcq-data.js?v=20260726-mcqquality2";
import {
  evaluateMcqAnswers,
  normalizeProgress,
  shuffleArray,
} from "./mcq-engine.js";
import { safeLoadJson, safeSaveJson } from "./storage-utils.js";

const DEFAULT_PROGRESS = { unlockedLevelIndex: 0, completedLevels: [] };

function prepareQuestion(question) {
  const options = shuffleArray(
    question.options.map((label, originalIndex) => ({ label, originalIndex })),
  );
  return {
    ...question,
    options: options.map((option) => option.label),
    answerIndex: options.findIndex(
      (option) => option.originalIndex === question.answerIndex,
    ),
  };
}

export function initMcqController() {
  const burgerIcon = $("#burger-icon");
  const sideMenu = $("#sideMenu");
  const mcqLevelButtons = $$(".mcq-level-button");
  const mcqModal = $("#mcqModal");
  const closeMcqModalButton = $("#closeMcqModal");
  const mcqTitle = $("#mcqTitle");
  const mcqTimer = $("#mcqTimer");
  const mcqContainer = $("#mcqContainer");
  const submitMcqButton = $("#submitMcqButton");
  const mcqResult = $("#mcqResult");
  const infoPopup = $("#info-popup");
  const infoIcon = $("#info-icon");

  let mcqProgress = normalizeProgress(
    safeLoadJson(MCQ_STORAGE_KEY, DEFAULT_PROGRESS),
    MCQ_LEVELS.length,
  );
  let activeMcqLevelIndex = null;
  let activeMcqQuestions = [];
  let mcqTimerId = null;
  let mcqRemainingSeconds = 0;
  let modalReturnFocus = null;
  let isMcqGraded = false;

  function getModalFocusables() {
    if (!mcqModal) {
      return [];
    }
    return Array.from(
      mcqModal.querySelectorAll(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter(
      (element) => !element.hidden && element.getClientRects().length > 0,
    );
  }

  function saveMcqProgress() {
    safeSaveJson(MCQ_STORAGE_KEY, mcqProgress);
  }

  function isMcqLevelUnlocked(levelIndex) {
    return levelIndex <= mcqProgress.unlockedLevelIndex;
  }

  function isMcqLevelCompleted(levelIndex) {
    return mcqProgress.completedLevels.includes(levelIndex);
  }

  function renderMcqLevelButtons() {
    mcqLevelButtons.forEach((button) => {
      const levelIndex = Number(button.dataset.levelIndex);
      const unlocked = isMcqLevelUnlocked(levelIndex);
      const completed = isMcqLevelCompleted(levelIndex);
      button.disabled = !unlocked;
      button.classList.toggle("is-complete", completed);
    });
  }

  function setSideMenuOpen(isOpen) {
    if (!sideMenu) {
      return;
    }
    if (isOpen && infoPopup) {
      infoPopup.hidden = true;
      if (infoIcon) {
        infoIcon.setAttribute("aria-expanded", "false");
      }
    }
    sideMenu.classList.toggle("open", isOpen);
    sideMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
    if (isOpen) {
      sideMenu.removeAttribute("inert");
      sideMenu
        .querySelector("button:not([disabled])")
        ?.focus({ preventScroll: true });
    } else {
      sideMenu.setAttribute("inert", "");
    }
    if (burgerIcon) {
      burgerIcon.setAttribute("aria-expanded", isOpen ? "true" : "false");
      burgerIcon.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu",
      );
    }
  }

  function toggleSideMenu() {
    if (!sideMenu) {
      return;
    }
    setSideMenuOpen(!sideMenu.classList.contains("open"));
  }

  function stopMcqTimer() {
    if (mcqTimerId !== null) {
      clearInterval(mcqTimerId);
      mcqTimerId = null;
    }
  }

  function updateMcqTimerText() {
    if (!mcqTimer) {
      return;
    }
    const mins = Math.floor(mcqRemainingSeconds / 60);
    const secs = mcqRemainingSeconds % 60;
    const level = MCQ_LEVELS[activeMcqLevelIndex];
    const passText = level
      ? `Pass ${level.passScore}/${level.totalQuestions}`
      : "";
    mcqTimer.textContent = `${passText} · ${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function handleSubmitMcq(allowUnanswered = false) {
    const level = MCQ_LEVELS[activeMcqLevelIndex];
    if (!level || !mcqResult) {
      return;
    }
    if (isMcqGraded) {
      openMcqLevel(activeMcqLevelIndex);
      return;
    }
    const selectedAnswers = collectSelectedAnswers();
    const evaluation = evaluateMcqAnswers(
      activeMcqQuestions,
      selectedAnswers,
      Boolean(allowUnanswered),
    );

    if (!evaluation.isComplete) {
      mcqResult.textContent = "Please answer all questions before submitting.";
      mcqResult.className = "mcq-result is-review";
      const firstUnansweredIndex = selectedAnswers.findIndex(
        (answer) => !Number.isInteger(answer),
      );
      mcqContainer
        ?.querySelector(`input[name="mcq_q_${firstUnansweredIndex}"]`)
        ?.focus();
      return;
    }

    stopMcqTimer();
    const passed =
      evaluation.unansweredCount === 0 && evaluation.score >= level.passScore;
    if (passed) {
      markLevelComplete(activeMcqLevelIndex);
      renderMcqLevelButtons();
    }

    mcqResult.textContent = `${level.name}: ${evaluation.score}/${evaluation.total}. ${passed ? "Pass." : "Review and retry."}`;
    mcqResult.className = `mcq-result ${passed ? "is-pass" : "is-review"}`;
    activeMcqQuestions.forEach((question, questionIndex) => {
      const selectedAnswer = selectedAnswers[questionIndex];
      const questionCard = mcqContainer?.querySelector(
        `[data-question-id="${question.id}"]`,
      );
      questionCard?.querySelectorAll('input[type="radio"]').forEach((input) => {
        input.disabled = true;
        const label = input.closest(".mcq-option");
        const optionIndex = Number(input.value);
        label?.classList.toggle(
          "is-correct",
          optionIndex === question.answerIndex,
        );
        label?.classList.toggle(
          "is-wrong",
          optionIndex === selectedAnswer &&
            optionIndex !== question.answerIndex,
        );
      });
      const explanation = questionCard?.querySelector(".mcq-explanation");
      if (explanation) {
        explanation.hidden = false;
      }
    });
    isMcqGraded = true;
    if (submitMcqButton) {
      submitMcqButton.disabled = false;
      submitMcqButton.textContent = passed ? "New attempt" : "Try again";
    }
  }

  function startMcqTimer(level) {
    stopMcqTimer();
    if (!mcqTimer) {
      return;
    }

    const timeSeconds = Number(level.timeSeconds) || 0;
    if (timeSeconds <= 0) {
      mcqTimer.hidden = true;
      mcqTimer.textContent = "";
      return;
    }

    mcqRemainingSeconds = timeSeconds;
    mcqTimer.hidden = false;
    updateMcqTimerText();
    mcqTimerId = setInterval(() => {
      mcqRemainingSeconds -= 1;
      updateMcqTimerText();
      if (mcqRemainingSeconds <= 0) {
        stopMcqTimer();
        handleSubmitMcq(true);
      }
    }, 1000);
  }

  function openMcqModal() {
    if (!mcqModal) {
      return;
    }
    modalReturnFocus = burgerIcon;
    mcqModal.classList.add("open");
    mcqModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    window.requestAnimationFrame(() => closeMcqModalButton?.focus());
  }

  function closeMcqModal() {
    if (!mcqModal) {
      return;
    }
    stopMcqTimer();
    mcqModal.classList.remove("open");
    mcqModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    activeMcqLevelIndex = null;
    activeMcqQuestions = [];
    isMcqGraded = false;
    if (submitMcqButton) {
      submitMcqButton.textContent = "Submit";
      submitMcqButton.disabled = false;
    }
    modalReturnFocus?.focus();
    modalReturnFocus = null;
  }

  function renderMcqQuestions(questions) {
    if (!mcqContainer) {
      return;
    }
    mcqContainer.innerHTML = "";
    questions.forEach((question, questionIndex) => {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "mcq-question";
      fieldset.dataset.questionId = question.id;

      const legend = document.createElement("legend");
      legend.textContent = `${questionIndex + 1}. ${question.prompt}`;
      fieldset.appendChild(legend);

      question.options.forEach((optionText, optionIndex) => {
        const optionLabel = document.createElement("label");
        optionLabel.className = "mcq-option";

        const optionInput = document.createElement("input");
        optionInput.type = "radio";
        optionInput.name = `mcq_q_${questionIndex}`;
        optionInput.value = String(optionIndex);

        const optionSpan = document.createElement("span");
        optionSpan.textContent = optionText;

        optionLabel.appendChild(optionInput);
        optionLabel.appendChild(optionSpan);
        fieldset.appendChild(optionLabel);
      });

      const explanation = document.createElement("p");
      explanation.className = "mcq-explanation";
      explanation.textContent = `Why: ${question.explanation}`;
      explanation.hidden = true;
      explanation.setAttribute("aria-live", "polite");
      fieldset.appendChild(explanation);

      mcqContainer.appendChild(fieldset);
    });
  }

  function openMcqLevel(levelIndex) {
    const level = MCQ_LEVELS[levelIndex];
    if (!level) {
      return;
    }

    activeMcqLevelIndex = levelIndex;
    isMcqGraded = false;
    activeMcqQuestions = shuffleArray(level.questions)
      .slice(0, level.totalQuestions)
      .map(prepareQuestion);

    if (mcqTitle) {
      mcqTitle.textContent = `${level.name} MCQ`;
    }
    if (mcqResult) {
      mcqResult.textContent = "";
      mcqResult.className = "mcq-result";
    }
    if (submitMcqButton) {
      submitMcqButton.textContent = "Submit";
      submitMcqButton.disabled = false;
    }

    renderMcqQuestions(activeMcqQuestions);
    openMcqModal();
    startMcqTimer(level);
  }

  function collectSelectedAnswers() {
    return activeMcqQuestions.map((question, questionIndex) => {
      const selectedInput = document.querySelector(
        `input[name="mcq_q_${questionIndex}"]:checked`,
      );
      return selectedInput ? Number(selectedInput.value) : null;
    });
  }

  function markLevelComplete(levelIndex) {
    if (!mcqProgress.completedLevels.includes(levelIndex)) {
      mcqProgress.completedLevels.push(levelIndex);
    }
    mcqProgress.unlockedLevelIndex = Math.max(
      mcqProgress.unlockedLevelIndex,
      Math.min(MCQ_LEVELS.length - 1, levelIndex + 1),
    );
    saveMcqProgress();
  }

  if (burgerIcon) {
    burgerIcon.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleSideMenu();
    });
  }

  mcqLevelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const levelIndex = Number(button.dataset.levelIndex);
      if (!isMcqLevelUnlocked(levelIndex)) {
        return;
      }
      setSideMenuOpen(false);
      openMcqLevel(levelIndex);
    });
  });

  if (submitMcqButton) {
    submitMcqButton.addEventListener("click", () => {
      handleSubmitMcq(false);
    });
  }

  if (closeMcqModalButton) {
    closeMcqModalButton.addEventListener("click", closeMcqModal);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && mcqModal?.classList.contains("open")) {
      const focusables = getModalFocusables();
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (first && last) {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
          return;
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
          return;
        }
      }
    }
    if (event.key !== "Escape") {
      return;
    }
    if (mcqModal && mcqModal.classList.contains("open")) {
      closeMcqModal();
      return;
    }
    if (sideMenu && sideMenu.classList.contains("open")) {
      setSideMenuOpen(false);
      burgerIcon?.focus({ preventScroll: true });
    }
  });

  document.addEventListener("click", (event) => {
    if (sideMenu && sideMenu.classList.contains("open")) {
      const clickedInsideMenu = sideMenu.contains(event.target);
      const clickedMenuIcon = burgerIcon && burgerIcon.contains(event.target);
      if (!clickedInsideMenu && !clickedMenuIcon) {
        setSideMenuOpen(false);
      }
    }
    if (
      mcqModal &&
      mcqModal.classList.contains("open") &&
      event.target === mcqModal
    ) {
      closeMcqModal();
    }
  });

  renderMcqLevelButtons();
  MCQ_LEVELS.forEach((level) => {
    level.questions.forEach((question) => {
      if (
        !question.id ||
        !question.explanation ||
        !MCQ_SOURCE_REFERENCES[question.source]
      ) {
        console.warn(`Invalid MCQ metadata: ${question.id || question.prompt}`);
      }
    });
  });

  return {
    closeMcqModal,
    setSideMenuOpen,
  };
}
