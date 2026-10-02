import {
  MCQ_LEVELS,
  MCQ_SOURCE_REFERENCES,
  MCQ_STORAGE_KEY,
} from "./mcq-data.js";

const shuffle = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
};

const prepareQuestion = (question) => {
  const options = shuffle(
    question.options.map((label, originalIndex) => ({ label, originalIndex })),
  );
  return {
    ...question,
    options: options.map((option) => option.label),
    answerIndex: options.findIndex(
      (option) => option.originalIndex === question.answerIndex,
    ),
  };
};

function loadProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(MCQ_STORAGE_KEY) || "null");
    return {
      unlockedLevelIndex: Math.max(
        0,
        Math.min(2, Number(value?.unlockedLevelIndex) || 0),
      ),
      completedLevels: Array.isArray(value?.completedLevels)
        ? value.completedLevels
        : [],
    };
  } catch {
    return { unlockedLevelIndex: 0, completedLevels: [] };
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(MCQ_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage is optional on restricted file launches.
  }
}

export function initMcqController(root = document) {
  const levelButtons = [...root.querySelectorAll(".mcq-level-button")];
  const modal = root.getElementById("mcqModal");
  const panel = modal?.querySelector(".mcq-modal-content");
  const closeButton = root.getElementById("closeMcqModal");
  const title = root.getElementById("mcqModalTitle");
  const intro = root.getElementById("mcqModalIntro");
  const form = root.getElementById("mcqForm");
  const submitButton = root.getElementById("submitMcqButton");
  const retryButton = root.getElementById("newMcqButton");
  const result = root.getElementById("mcqResult");
  const menuButton = root.getElementById("burger-icon");
  if (!modal || !form || !submitButton || !result) return;

  let progress = loadProgress();
  let activeLevelIndex = 0;
  let activeQuestions = [];
  let returnFocus = null;

  function renderLevelButtons() {
    levelButtons.forEach((button, index) => {
      const unlocked = index <= progress.unlockedLevelIndex;
      const complete = progress.completedLevels.includes(index);
      button.disabled = !unlocked;
      button.classList.toggle("is-complete", complete);
      button.dataset.complete = complete ? "true" : "false";
    });
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    if (returnFocus?.isConnected) returnFocus.focus();
    returnFocus = null;
  }

  function renderQuestions() {
    form.innerHTML = "";
    activeQuestions.forEach((question, questionIndex) => {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "mcq-question";
      fieldset.dataset.questionId = question.id;
      const legend = document.createElement("legend");
      legend.textContent = `${questionIndex + 1}. ${question.prompt}`;
      fieldset.appendChild(legend);
      question.options.forEach((option, optionIndex) => {
        const label = document.createElement("label");
        label.className = "mcq-option";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `refract-mcq-${questionIndex}`;
        input.value = String(optionIndex);
        label.append(input, document.createTextNode(option));
        fieldset.appendChild(label);
      });
      const feedback = document.createElement("p");
      feedback.className = "mcq-item-feedback";
      feedback.hidden = true;
      fieldset.appendChild(feedback);
      const source = document.createElement("p");
      source.className = "mcq-item-source";
      const sourceMeta = MCQ_SOURCE_REFERENCES[question.source];
      source.textContent = `Source: ${sourceMeta?.label || question.source}. Status: ${question.reviewStatus}.`;
      source.hidden = true;
      fieldset.appendChild(source);
      form.appendChild(fieldset);
    });
  }

  function startLevel(levelIndex) {
    const level = MCQ_LEVELS[levelIndex];
    if (!level || levelIndex > progress.unlockedLevelIndex) return;
    activeLevelIndex = levelIndex;
    activeQuestions = shuffle(level.questions)
      .slice(0, level.questionCount)
      .map(prepareQuestion);
    returnFocus = menuButton || levelButtons[levelIndex];
    title.textContent = `${level.name} MCQ`;
    intro.textContent = `${level.questionCount} questions. Pass mark ${level.passScore}/${level.questionCount}.`;
    result.textContent = "";
    result.className = "mcq-result";
    retryButton.hidden = true;
    retryButton.textContent = "Try again";
    submitButton.disabled = false;
    renderQuestions();
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    modal.scrollTop = 0;
    requestAnimationFrame(() => {
      if (modal.classList.contains("open")) panel?.focus();
    });
  }

  function submit() {
    const selected = activeQuestions.map((_, index) =>
      form.querySelector(`input[name="refract-mcq-${index}"]:checked`),
    );
    if (selected.some((input) => !input)) {
      result.textContent = "Answer all questions before submitting.";
      result.className = "mcq-result is-review";
      const firstUnansweredIndex = selected.findIndex((input) => !input);
      form
        .querySelector(`input[name="refract-mcq-${firstUnansweredIndex}"]`)
        ?.focus();
      return;
    }
    let score = 0;
    activeQuestions.forEach((question, index) => {
      const selectedIndex = Number(selected[index].value);
      const fieldset = form.children[index];
      const labels = [...fieldset.querySelectorAll(".mcq-option")];
      labels.forEach((label, optionIndex) => {
        label.classList.toggle(
          "is-correct",
          optionIndex === question.answerIndex,
        );
        label.classList.toggle(
          "is-incorrect",
          optionIndex === selectedIndex && optionIndex !== question.answerIndex,
        );
        label.querySelector("input").disabled = true;
      });
      if (selectedIndex === question.answerIndex) score += 1;
      const feedback = fieldset.querySelector(".mcq-item-feedback");
      feedback.hidden = false;
      feedback.textContent = `${selectedIndex === question.answerIndex ? "Correct." : "Incorrect."} Why: ${question.explanation}`;
      const source = fieldset.querySelector(".mcq-item-source");
      if (source) source.hidden = false;
    });
    const level = MCQ_LEVELS[activeLevelIndex];
    const passed = score >= level.passScore;
    result.textContent = `${level.name}: ${score}/${activeQuestions.length}. ${passed ? "Pass." : "Review and retry."}`;
    result.className = `mcq-result ${passed ? "is-pass" : "is-review"}`;
    if (passed) {
      progress.completedLevels = [
        ...new Set([...progress.completedLevels, activeLevelIndex]),
      ];
      progress.unlockedLevelIndex = Math.max(
        progress.unlockedLevelIndex,
        Math.min(MCQ_LEVELS.length - 1, activeLevelIndex + 1),
      );
      saveProgress(progress);
      renderLevelButtons();
    }
    submitButton.disabled = true;
    retryButton.hidden = false;
    retryButton.textContent = passed ? "New attempt" : "Try again";
  }

  levelButtons.forEach((button, index) =>
    button.addEventListener("click", () => startLevel(index)),
  );
  closeButton?.addEventListener("click", closeModal);
  submitButton.addEventListener("click", submit);
  retryButton?.addEventListener("click", () => startLevel(activeLevelIndex));
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  modal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || !modal.classList.contains("open")) return;
    const focusable = [
      ...modal.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      ),
    ].filter((element) => element.getClientRects().length > 0);
    if (!focusable.length) {
      event.preventDefault();
      panel?.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open"))
      closeModal();
  });
  renderLevelButtons();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initMcqController(), {
    once: true,
  });
} else {
  initMcqController();
}
