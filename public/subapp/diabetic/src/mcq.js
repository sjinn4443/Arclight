import {
  MCQ_BANKS,
  MCQ_LEVEL_META,
  MCQ_SOURCE_REFERENCES,
} from "./mcq-data.js?v=20260726-mcq2";

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
  const seenIds = new Set();
  const seenPrompts = new Set();
  return Object.entries(MCQ_LEVEL_META).map(([level, meta]) => {
    const bank = MCQ_BANKS[level] || [];
    const invalidAnswers = bank.filter((question) => {
      return (
        !Array.isArray(question.options) ||
        question.answer < 0 ||
        question.answer >= question.options.length
      );
    });
    const invalidQuestions = bank.filter((question) => {
      const normalisedPrompt = question.question.trim().toLocaleLowerCase();
      const normalisedOptions = question.options.map((option) =>
        option.trim().toLocaleLowerCase(),
      );
      const invalid =
        !question.id ||
        seenIds.has(question.id) ||
        !question.question.trim() ||
        seenPrompts.has(normalisedPrompt) ||
        new Set(normalisedOptions).size !== normalisedOptions.length ||
        !question.explanation?.trim() ||
        !MCQ_SOURCE_REFERENCES[question.source];
      seenIds.add(question.id);
      seenPrompts.add(normalisedPrompt);
      return invalid;
    });
    return {
      level,
      expected: meta.targetBankSize,
      actual: bank.length,
      invalidAnswers: invalidAnswers.length,
      invalidQuestions: invalidQuestions.length,
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
  let isGraded = false;

  function close() {
    elements.closeModal(elements.modal);
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
      input.name = `mcq_${questionIndex}`;
      input.value = String(optionIndex);
      const text = makeElement("span", "", option.label);
      label.append(input, text);
      card.append(label);
    });

    const explanation = makeElement("p", "mcq-explanation");
    explanation.hidden = true;
    explanation.setAttribute("aria-live", "polite");
    card.append(explanation);

    return card;
  }

  function open(level) {
    const meta = MCQ_LEVEL_META[level];
    const bank = MCQ_BANKS[level];
    if (!meta || !bank) return;

    currentLevel = level;
    currentMeta = meta;
    isGraded = false;
    currentQuestions = shuffle(bank)
      .slice(0, meta.questionCount)
      .map(prepareQuestion);
    elements.title.textContent = `${meta.title} MCQ`;
    elements.intro.textContent = `${meta.questionCount} questions. Pass mark ${meta.passMark}.`;
    elements.result.textContent = "";
    elements.result.className = "mcq-result";
    elements.submit.textContent = "Submit";
    elements.submit.disabled = false;
    elements.container.replaceChildren(...currentQuestions.map(renderQuestion));
    elements.openModal(
      elements.modal,
      elements.modalContent,
      elements.returnFocus,
    );
  }

  function submit() {
    if (!currentMeta) return;
    if (isGraded) {
      open(currentLevel);
      return;
    }

    const selectedIndexes = currentQuestions.map((question, questionIndex) => {
      const selected = elements.container.querySelector(
        `input[name="mcq_${questionIndex}"]:checked`,
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
        .querySelector(`input[name="mcq_${firstUnansweredIndex}"]`)
        ?.focus();
      return;
    }

    currentQuestions.forEach((question, questionIndex) => {
      const selectedIndex = selectedIndexes[questionIndex];
      const questionCard = elements.container.querySelector(
        `[data-question-id="${question.id}"]`,
      );
      const optionLabels = elements.container.querySelectorAll(
        `input[name="mcq_${questionIndex}"]`,
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
      const explanation = questionCard?.querySelector(".mcq-explanation");
      if (explanation) {
        explanation.textContent = `Why: ${question.explanation}`;
        explanation.hidden = false;
      }
    });

    elements.result.textContent = `Score ${evaluation.score}/${currentMeta.questionCount}. ${evaluation.passed ? "Pass." : "Review and retry."}`;
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
    isGraded = true;
    elements.submit.textContent = evaluation.passed
      ? "New attempt"
      : "Try again";
    elements.submit.disabled = false;
  }

  elements.close.addEventListener("click", close);
  elements.submit.addEventListener("click", submit);

  return {
    open,
    close,
  };
}
