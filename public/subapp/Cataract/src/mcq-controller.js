import { $, $$ } from "./dom-utils.js";
import { MCQ_LEVELS, MCQ_STORAGE_KEY } from "./mcq-data.js?v=20260511-2";
import {
  evaluateMcqAnswers,
  normalizeProgress,
  shuffleArray,
} from "./mcq-engine.js";
import { safeLoadJson, safeSaveJson } from "./storage-utils.js";

const DEFAULT_PROGRESS = { unlockedLevelIndex: 0, completedLevels: [] };

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
    mcqTimer.textContent = `Time: ${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function handleSubmitMcq(allowUnanswered = false) {
    const level = MCQ_LEVELS[activeMcqLevelIndex];
    if (!level || !mcqResult) {
      return;
    }
    const evaluation = evaluateMcqAnswers(
      activeMcqQuestions,
      collectSelectedAnswers(),
      Boolean(allowUnanswered),
    );

    if (!evaluation.isComplete) {
      mcqResult.textContent = "Please answer all questions before submitting.";
      return;
    }

    stopMcqTimer();
    const passed = evaluation.score >= level.passScore;
    if (passed) {
      markLevelComplete(activeMcqLevelIndex);
      renderMcqLevelButtons();
    }

    mcqResult.textContent = `${level.name}: ${evaluation.score}/${evaluation.total}. ${passed ? "Pass." : "Try again."}`;
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
    mcqModal.classList.add("open");
    mcqModal.setAttribute("aria-hidden", "false");
  }

  function closeMcqModal() {
    if (!mcqModal) {
      return;
    }
    stopMcqTimer();
    mcqModal.classList.remove("open");
    mcqModal.setAttribute("aria-hidden", "true");
    activeMcqLevelIndex = null;
    activeMcqQuestions = [];
  }

  function renderMcqQuestions(questions) {
    if (!mcqContainer) {
      return;
    }
    mcqContainer.innerHTML = "";
    questions.forEach((question, questionIndex) => {
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

      mcqContainer.appendChild(fieldset);
    });
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

    if (mcqTitle) {
      mcqTitle.textContent = `MCQ - ${level.name}`;
    }
    if (mcqResult) {
      mcqResult.textContent = "";
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
    if (event.key !== "Escape") {
      return;
    }
    if (mcqModal && mcqModal.classList.contains("open")) {
      closeMcqModal();
      return;
    }
    if (sideMenu && sideMenu.classList.contains("open")) {
      setSideMenuOpen(false);
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

  return {
    closeMcqModal,
    setSideMenuOpen,
  };
}
