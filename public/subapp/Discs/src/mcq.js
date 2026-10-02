import {
  MCQ_BANKS,
  MCQ_LEVEL_META,
} from "./mcq-data.js?v=20260518-findingdropdown";
import {
  closeModal,
  openModal,
} from "./ui-shell.js?v=20260518-findingdropdown";

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function prepareQuestion(question) {
  const options = question.options.map((label, index) => ({
    label,
    originalIndex: index,
  }));
  const shuffledOptions = shuffle(options);
  return {
    ...question,
    options: shuffledOptions,
    answer: shuffledOptions.findIndex(
      (option) => option.originalIndex === question.answer,
    ),
  };
}

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

export function validateMcqBanks() {
  return Object.entries(MCQ_LEVEL_META).map(([level, meta]) => {
    const bank = MCQ_BANKS[level] || [];
    const invalidAnswers = bank.filter((question) => {
      return (
        !Array.isArray(question.options) ||
        question.answer < 0 ||
        question.answer >= question.options.length
      );
    });
    const invalidMetadata = bank.filter((question) => {
      return (
        !question.id ||
        !question.explanation ||
        !Array.isArray(question.sourceIds) ||
        question.sourceIds.length === 0 ||
        !question.reviewStatus
      );
    });
    return {
      level,
      expected: meta.targetBankSize,
      actual: bank.length,
      invalidAnswers: invalidAnswers.length,
      invalidMetadata: invalidMetadata.length,
    };
  });
}

export function evaluateMcqAttempt(questions, selectedIndexes, passMark) {
  const answers = Array.isArray(selectedIndexes) ? selectedIndexes : [];
  const isComplete =
    questions.length > 0 &&
    answers.length === questions.length &&
    answers.every(Number.isInteger);
  const score = questions.reduce((total, question, questionIndex) => {
    return total + (answers[questionIndex] === question.answer ? 1 : 0);
  }, 0);

  return {
    isComplete,
    score,
    passed: isComplete && score >= passMark,
    missedTopics: questions
      .filter(
        (question, questionIndex) => answers[questionIndex] !== question.answer,
      )
      .map((question) => question.topic),
  };
}

export function createMcqController(elements) {
  let currentQuestions = [];
  let currentMeta = null;
  let currentLevel = null;

  function close() {
    closeModal(elements.modal);
  }

  function renderQuestion(question, questionIndex) {
    const card = makeElement("fieldset", "mcq-question");
    card.dataset.questionId = question.id;
    const legend = makeElement(
      "legend",
      "mcq-question-title",
      `${questionIndex + 1}. ${question.question}`,
    );
    card.append(legend);

    question.options.forEach((option, optionIndex) => {
      const label = makeElement("label", "mcq-option");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `mcq_${question.id}`;
      input.value = String(optionIndex);
      const text = makeElement("span", "", option.label);
      label.append(input, text);
      card.append(label);
    });

    const feedback = makeElement("p", "mcq-question-feedback");
    feedback.hidden = true;
    card.append(feedback);

    return card;
  }

  function buildAttempt(level, focusFirst = false) {
    const meta = MCQ_LEVEL_META[level];
    const bank = MCQ_BANKS[level];
    if (!meta || !bank) return;

    currentLevel = level;
    currentMeta = meta;
    currentQuestions = shuffle(bank)
      .slice(0, meta.questionCount)
      .map(prepareQuestion);
    elements.title.textContent = `${meta.title} MCQ`;
    elements.intro.textContent = `${meta.questionCount} questions. Pass mark ${meta.passMark}.`;
    elements.result.textContent = "";
    elements.result.className = "mcq-result";
    elements.submit.disabled = false;
    elements.submit.hidden = false;
    elements.restart.hidden = true;
    elements.container.replaceChildren(...currentQuestions.map(renderQuestion));
    if (focusFirst) {
      elements.container.querySelector("input")?.focus();
    }
  }

  function open(level) {
    buildAttempt(level);
    openModal(elements.modal, elements.modalContent);
  }

  function submit() {
    if (!currentMeta) return;

    const selectedIndexes = currentQuestions.map((question) => {
      const selected = elements.container.querySelector(
        `input[name="mcq_${question.id}"]:checked`,
      );
      return selected ? Number(selected.value) : null;
    });
    const evaluation = evaluateMcqAttempt(
      currentQuestions,
      selectedIndexes,
      currentMeta.passMark,
    );

    if (!evaluation.isComplete) {
      elements.result.textContent =
        "Please answer all questions before submitting.";
      elements.result.className = "mcq-result is-review";
      const firstUnansweredIndex = selectedIndexes.findIndex(
        (index) => !Number.isInteger(index),
      );
      elements.container
        .querySelector(
          `input[name="mcq_${currentQuestions[firstUnansweredIndex].id}"]`,
        )
        ?.focus();
      return;
    }

    currentQuestions.forEach((question, questionIndex) => {
      const selectedIndex = selectedIndexes[questionIndex];
      const questionCard = elements.container.querySelector(
        `[data-question-id="${question.id}"]`,
      );
      const optionLabels = questionCard.querySelectorAll(
        `input[name="mcq_${question.id}"]`,
      );
      optionLabels.forEach((input) => {
        input.disabled = true;
        const label = input.closest(".mcq-option");
        label.classList.remove("is-correct", "is-wrong");
        const value = Number(input.value);
        if (value === question.answer) {
          label.classList.add("is-correct");
        }
        if (value === selectedIndex && value !== question.answer) {
          label.classList.add("is-wrong");
        }
      });
      const feedback = questionCard.querySelector(".mcq-question-feedback");
      const isCorrect = selectedIndex === question.answer;
      feedback.hidden = false;
      feedback.replaceChildren(
        makeElement("strong", "", isCorrect ? "Correct. " : "Incorrect. "),
        document.createTextNode(question.explanation),
      );
    });

    const resultHeading = makeElement(
      "strong",
      "mcq-result-heading",
      evaluation.passed ? "Pass" : "Review and retry",
    );
    const resultScore = makeElement(
      "span",
      "mcq-result-score",
      `Score ${evaluation.score}/${currentMeta.questionCount}.`,
    );
    elements.result.replaceChildren(resultHeading, resultScore);
    if (evaluation.missedTopics.length > 0) {
      const topics = makeElement(
        "p",
        "mcq-topics",
        `Review: ${[...new Set(evaluation.missedTopics)].join(", ")}.`,
      );
      elements.result.append(topics);
    }
    elements.result.classList.toggle("is-pass", evaluation.passed);
    elements.result.classList.toggle("is-review", !evaluation.passed);
    elements.submit.disabled = true;
    elements.submit.hidden = true;
    elements.restart.hidden = false;
    elements.result.focus();
  }

  function restart() {
    if (!currentLevel) return;
    buildAttempt(currentLevel, true);
  }

  elements.close.addEventListener("click", close);
  elements.submit.addEventListener("click", submit);
  elements.restart.addEventListener("click", restart);

  return {
    open,
    close,
    restart,
  };
}
