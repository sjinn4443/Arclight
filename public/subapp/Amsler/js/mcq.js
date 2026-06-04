import { MCQ_LEVELS } from "./mcq-data.js";

function shuffleItems(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function shuffleQuestionOptions(question) {
  const options = shuffleItems(
    question.options.map((text, index) => ({
      text,
      isCorrect: index === question.answerIndex,
    })),
  );

  return {
    ...question,
    options: options.map((option) => option.text),
    answerIndex: options.findIndex((option) => option.isCorrect),
  };
}

function sampleLevelQuestions(level) {
  const questionCount = Math.min(
    level.questionCount ?? level.questions.length,
    level.questions.length,
  );
  return shuffleItems(level.questions)
    .slice(0, questionCount)
    .map(shuffleQuestionOptions);
}

function setFeedbackText(container, label, text) {
  container.replaceChildren();

  const strong = document.createElement("strong");
  strong.textContent = label;
  container.append(strong, ` ${text}`);
}

export function createMcqController(app) {
  const {
    sideMenu,
    sideMenuBackdrop,
    mcqModal,
    mcqTitle,
    mcqProgress,
    mcqList,
    mcqFeedback,
    mcqSubmitBtn,
    mcqRestartBtn,
  } = app.elements;

  let activeLevel = null;
  let questions = [];
  let isSubmitted = false;

  function setSideMenuOpen(isOpen) {
    sideMenu.classList.toggle("open", isOpen);
    sideMenuBackdrop.hidden = !isOpen;
  }

  function toggleSideMenu() {
    setSideMenuOpen(!sideMenu.classList.contains("open"));
  }

  function openModal() {
    mcqModal.style.display = "block";
  }

  function closeModal() {
    mcqModal.style.display = "none";
  }

  function renderQuestionList() {
    if (!activeLevel || questions.length === 0) {
      return;
    }

    isSubmitted = false;
    mcqTitle.textContent = `${activeLevel.label} MCQs`;
    mcqProgress.textContent = `${questions.length} questions`;
    mcqFeedback.textContent = "";
    mcqSubmitBtn.disabled = false;
    mcqSubmitBtn.hidden = false;
    mcqRestartBtn.hidden = true;
    mcqList.replaceChildren();

    questions.forEach((question, questionIndex) => {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "mcq-item";
      fieldset.dataset.questionIndex = String(questionIndex);

      const legend = document.createElement("legend");
      legend.textContent = `${questionIndex + 1}. ${question.prompt}`;
      fieldset.appendChild(legend);

      const optionsWrap = document.createElement("div");
      optionsWrap.className = "mcq-item-options";

      question.options.forEach((optionText, optionIndex) => {
        const optionLabel = document.createElement("label");
        optionLabel.className = "mcq-option-label";
        optionLabel.dataset.optionIndex = String(optionIndex);

        const input = document.createElement("input");
        input.type = "radio";
        input.name = `mcq-q-${questionIndex}`;
        input.value = String(optionIndex);

        const textSpan = document.createElement("span");
        textSpan.textContent = optionText;

        optionLabel.appendChild(input);
        optionLabel.appendChild(textSpan);
        optionsWrap.appendChild(optionLabel);
      });

      const itemFeedback = document.createElement("p");
      itemFeedback.className = "mcq-item-feedback";
      itemFeedback.hidden = true;

      fieldset.appendChild(optionsWrap);
      fieldset.appendChild(itemFeedback);
      mcqList.appendChild(fieldset);
    });
  }

  function startLevel(levelId) {
    const selectedLevel = MCQ_LEVELS.find((level) => level.id === levelId);
    if (!selectedLevel) {
      return;
    }

    activeLevel = selectedLevel;
    questions = sampleLevelQuestions(selectedLevel);
    isSubmitted = false;
    setSideMenuOpen(false);
    openModal();
    renderQuestionList();
  }

  function submitLevel() {
    if (!activeLevel || isSubmitted) {
      return;
    }

    let score = 0;
    let unansweredCount = 0;

    const fieldsets = Array.from(mcqList.querySelectorAll(".mcq-item"));
    fieldsets.forEach((fieldset, questionIndex) => {
      const question = questions[questionIndex];
      const selectedInput = fieldset.querySelector("input:checked");
      const selectedIndex = selectedInput
        ? Number.parseInt(selectedInput.value, 10)
        : -1;
      const isCorrect = selectedIndex === question.answerIndex;
      if (isCorrect) {
        score += 1;
      }
      if (selectedIndex < 0) {
        unansweredCount += 1;
      }

      const optionLabels = Array.from(
        fieldset.querySelectorAll(".mcq-option-label"),
      );
      optionLabels.forEach((label) => {
        const optionIndex = Number.parseInt(label.dataset.optionIndex, 10);
        const input = label.querySelector("input");
        if (input) {
          input.disabled = true;
        }

        if (optionIndex === question.answerIndex) {
          label.classList.add("correct");
        } else if (optionIndex === selectedIndex) {
          label.classList.add("incorrect");
        }
      });

      const itemFeedback = fieldset.querySelector(".mcq-item-feedback");
      if (itemFeedback) {
        const resultWord = isCorrect ? "Correct." : "Incorrect.";
        itemFeedback.hidden = false;
        setFeedbackText(itemFeedback, resultWord, question.explanation);
      }
    });

    const total = questions.length;
    const scorePct = total > 0 ? Math.round((score / total) * 100) : 0;
    const unansweredText =
      unansweredCount > 0 ? ` Unanswered: ${unansweredCount}.` : "";
    setFeedbackText(
      mcqFeedback,
      "Score:",
      `${score}/${total} (${scorePct}%).${unansweredText}`,
    );
    mcqProgress.textContent = `${activeLevel.label} complete`;
    mcqSubmitBtn.disabled = true;
    mcqRestartBtn.hidden = false;
    isSubmitted = true;
  }

  function restartLevel() {
    if (!activeLevel) {
      return;
    }
    startLevel(activeLevel.id);
  }

  function handleBackdropClick(event) {
    if (event.target === sideMenuBackdrop) {
      setSideMenuOpen(false);
    }
  }

  function handleModalBackdropClick(event) {
    if (event.target === mcqModal) {
      closeModal();
    }
  }

  function handleEscape() {
    if (mcqModal.style.display === "block") {
      closeModal();
      return;
    }
    if (sideMenu.classList.contains("open")) {
      setSideMenuOpen(false);
    }
  }

  return {
    startLevel,
    closeModal,
    toggleSideMenu,
    setSideMenuOpen,
    submitLevel,
    restartLevel,
    handleBackdropClick,
    handleModalBackdropClick,
    handleEscape,
  };
}
