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
  let modalReturnFocus = null;

  function getFocusable(container) {
    return Array.from(
      container.querySelectorAll(
        "button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])",
      ),
    ).filter(
      (element) => !element.hidden && element.getClientRects().length > 0,
    );
  }

  function setSideMenuOpen(isOpen) {
    sideMenu.classList.toggle("open", isOpen);
    sideMenuBackdrop.hidden = !isOpen;
    sideMenu.hidden = !isOpen;
    app.elements.burgerIcon.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      getFocusable(sideMenu)[0]?.focus();
    }
  }

  function toggleSideMenu() {
    setSideMenuOpen(!sideMenu.classList.contains("open"));
  }

  function openModal() {
    modalReturnFocus = app.elements.burgerIcon;
    mcqModal.hidden = false;
    mcqModal.style.display = "block";
    getFocusable(mcqModal)[0]?.focus();
  }

  function closeModal() {
    mcqModal.style.display = "none";
    mcqModal.hidden = true;
    modalReturnFocus?.focus?.();
    modalReturnFocus = null;
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
      fieldset.dataset.questionId = question.id;

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
        input.name = `mcq-${question.id}`;
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
    fieldsets.forEach((fieldset) => {
      if (!fieldset.querySelector("input:checked")) {
        unansweredCount += 1;
      }
    });
    if (unansweredCount > 0) {
      setFeedbackText(
        mcqFeedback,
        "Not submitted:",
        `answer all ${questions.length} questions first.`,
      );
      mcqFeedback.classList.remove("pass", "fail");
      fieldsets
        .find((fieldset) => !fieldset.querySelector("input:checked"))
        ?.querySelector("input")
        ?.focus();
      return;
    }

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
    const passScore = Math.min(
      activeLevel.passScore ?? Math.ceil(total * 0.75),
      total,
    );
    const passed = score >= passScore;
    setFeedbackText(
      mcqFeedback,
      "Score:",
      `${score}/${total} (${scorePct}%). ${passed ? "Pass." : "Review and retry."} Pass mark ${passScore}/${total}.`,
    );
    mcqFeedback.classList.toggle("pass", passed);
    mcqFeedback.classList.toggle("fail", !passed);
    const levelButton = document.querySelector(
      `[data-level="${activeLevel.id}"]`,
    );
    levelButton?.classList.toggle("is-complete", passed);
    if (levelButton) {
      levelButton.dataset.complete = passed ? "true" : "false";
    }
    mcqProgress.textContent = `${activeLevel.label}: ${passed ? "passed" : "not yet passed"}`;
    mcqSubmitBtn.disabled = true;
    mcqSubmitBtn.hidden = true;
    mcqRestartBtn.hidden = false;
    isSubmitted = true;
    mcqFeedback.focus();
  }

  function restartLevel() {
    if (!activeLevel) {
      return;
    }
    questions = sampleLevelQuestions(activeLevel);
    renderQuestionList();
    mcqList.querySelector("input")?.focus();
  }

  function handleBackdropClick(event) {
    if (event.target === sideMenuBackdrop) {
      setSideMenuOpen(false);
      app.elements.burgerIcon.focus();
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
      app.elements.burgerIcon.focus();
    }
  }

  function handleFocusTrap(event) {
    if (event.key !== "Tab" || mcqModal.hidden) return;
    const focusable = getFocusable(mcqModal);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  document.addEventListener("keydown", handleFocusTrap);

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
