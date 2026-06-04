import { $, $$ } from "./dom-utils.js";
import {
  evaluateMcqAnswers,
  markLevelComplete,
  normalizeProgress,
  shuffleArray,
} from "./mcq-engine.js";
import { MCQ_LEVELS, MCQ_STORAGE_KEY } from "./mcq-data.js";

function loadMcqProgress() {
  const fallback = { unlockedLevelIndex: 0, completedLevels: [] };
  try {
    const rawValue = localStorage.getItem(MCQ_STORAGE_KEY);
    if (!rawValue) {
      return fallback;
    }
    return normalizeProgress(JSON.parse(rawValue), MCQ_LEVELS.length);
  } catch {
    return fallback;
  }
}

function saveMcqProgress(progress) {
  try {
    localStorage.setItem(MCQ_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // non-fatal in private mode / blocked storage
  }
}

export function initMcqController(root = document) {
  const burgerIcon = $("#burger-icon", root);
  const sideMenu = $("#sideMenu", root);
  const mcqLevelButtons = $$(".mcq-level-button", root);
  const mcqModal = $("#mcqModal", root);
  const closeMcqModalButton = $("#closeMcqModal", root);
  const mcqTitle = $("#mcqTitle", root);
  const mcqTimer = $("#mcqTimer", root);
  const mcqContainer = $("#mcqContainer", root);
  const submitMcqButton = $("#submitMcqButton", root);
  const mcqResult = $("#mcqResult", root);
  const infoPopup = $("#info-popup", root);
  const infoIcon = $("#info-icon", root);

  if (
    !sideMenu ||
    !mcqModal ||
    !mcqContainer ||
    !submitMcqButton ||
    !mcqResult
  ) {
    return;
  }

  let mcqProgress = loadMcqProgress();
  let activeMcqLevelIndex = null;
  let activeMcqQuestions = [];
  let mcqTimerId = null;
  let mcqRemainingSeconds = 0;

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
    if (isOpen && infoPopup) {
      infoPopup.classList.remove("active");
      infoIcon?.setAttribute("aria-expanded", "false");
    }
    sideMenu.classList.toggle("open", isOpen);
    sideMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
    if (isOpen) {
      sideMenu.removeAttribute("inert");
    } else {
      sideMenu.setAttribute("inert", "");
    }
    sideMenu.inert = !isOpen;
    burgerIcon?.setAttribute("aria-expanded", isOpen ? "true" : "false");
    burgerIcon?.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  function toggleSideMenu() {
    setSideMenuOpen(!sideMenu.classList.contains("open"));
  }

  function openMcqModal() {
    mcqModal.classList.add("open");
    mcqModal.setAttribute("aria-hidden", "false");
  }

  function stopMcqTimer() {
    if (mcqTimerId !== null) {
      clearInterval(mcqTimerId);
      mcqTimerId = null;
    }
  }

  function closeMcqModal() {
    stopMcqTimer();
    mcqModal.classList.remove("open");
    mcqModal.setAttribute("aria-hidden", "true");
    activeMcqLevelIndex = null;
    activeMcqQuestions = [];
  }

  function updateMcqTimerText() {
    if (!mcqTimer) {
      return;
    }
    const mins = Math.floor(mcqRemainingSeconds / 60);
    const secs = mcqRemainingSeconds % 60;
    mcqTimer.textContent = `Time: ${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
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
        handleSubmitMcq({ allowUnanswered: true });
      }
    }, 1000);
  }

  function renderMcqQuestions(questions) {
    const renderedQuestions = questions.map((question, questionIndex) => {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "mcq-question";

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

      return fieldset;
    });
    mcqContainer.replaceChildren(...renderedQuestions);
  }

  function openMcqLevel(levelIndex) {
    const level = MCQ_LEVELS[levelIndex];
    if (!level) {
      return;
    }

    activeMcqLevelIndex = levelIndex;
    activeMcqQuestions = shuffleArray(level.questions).slice(
      0,
      level.totalQuestions,
    );
    mcqTitle.textContent = `MCQ - ${level.name}`;
    mcqResult.textContent = "";

    renderMcqQuestions(activeMcqQuestions);
    openMcqModal();
    startMcqTimer(level);
  }

  function collectSelectedAnswers() {
    return activeMcqQuestions.map((question, questionIndex) => {
      const selectedInput = root.querySelector(
        `input[name="mcq_q_${questionIndex}"]:checked`,
      );
      if (!selectedInput) {
        return null;
      }
      return Number(selectedInput.value);
    });
  }

  function handleSubmitMcq(options = {}) {
    const level = MCQ_LEVELS[activeMcqLevelIndex];
    if (!level) {
      return;
    }

    const evaluation = evaluateMcqAnswers({
      questions: activeMcqQuestions,
      selectedAnswers: collectSelectedAnswers(),
      allowUnanswered: Boolean(options.allowUnanswered),
    });

    if (!evaluation.isComplete) {
      mcqResult.textContent = "Please answer all questions before submitting.";
      return;
    }

    stopMcqTimer();
    const passed = evaluation.score >= level.passScore;

    if (passed) {
      mcqProgress = markLevelComplete(
        mcqProgress,
        activeMcqLevelIndex,
        MCQ_LEVELS.length,
      );
      saveMcqProgress(mcqProgress);
      renderMcqLevelButtons();
    }

    mcqResult.textContent = `${level.name}: ${evaluation.score}/${evaluation.total}. ${
      passed ? "Pass." : "Try again."
    }`;
  }

  if (burgerIcon) {
    burgerIcon.addEventListener("click", (event) => {
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

  submitMcqButton.addEventListener("click", () => handleSubmitMcq());

  if (closeMcqModalButton) {
    closeMcqModalButton.addEventListener("click", closeMcqModal);
  }

  root.addEventListener("click", (event) => {
    if (sideMenu.classList.contains("open")) {
      const clickedInsideMenu = sideMenu.contains(event.target);
      const clickedMenuIcon = Boolean(
        burgerIcon && burgerIcon.contains(event.target),
      );
      if (!clickedInsideMenu && !clickedMenuIcon) {
        setSideMenuOpen(false);
      }
    }

    if (mcqModal.classList.contains("open") && event.target === mcqModal) {
      closeMcqModal();
    }
  });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (mcqModal.classList.contains("open")) {
      closeMcqModal();
      return;
    }

    if (sideMenu.classList.contains("open")) {
      setSideMenuOpen(false);
    }
  });

  renderMcqLevelButtons();
}
