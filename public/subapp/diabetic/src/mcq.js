import {
  MCQ_BANKS,
  MCQ_LEVEL_META,
} from "./mcq-data.js?v=20260518-findingdropdown";

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
    return {
      level,
      expected: meta.targetBankSize,
      actual: bank.length,
      invalidAnswers: invalidAnswers.length,
    };
  });
}

export function createMcqController(elements) {
  let currentQuestions = [];
  let currentMeta = null;

  function close() {
    elements.modal.setAttribute("aria-hidden", "true");
    elements.modal.hidden = true;
  }

  function renderQuestion(question, questionIndex) {
    const card = makeElement("fieldset", "mcq-question");
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

    return card;
  }

  function open(level) {
    const meta = MCQ_LEVEL_META[level];
    const bank = MCQ_BANKS[level];
    if (!meta || !bank) return;

    currentMeta = meta;
    currentQuestions = shuffle(bank)
      .slice(0, meta.questionCount)
      .map(prepareQuestion);
    elements.title.textContent = `${meta.title} MCQ`;
    elements.intro.textContent = `${meta.questionCount} questions. Pass mark ${meta.passMark}.`;
    elements.result.textContent = "";
    elements.result.className = "mcq-result";
    elements.submit.disabled = false;
    elements.container.replaceChildren(...currentQuestions.map(renderQuestion));
    elements.modal.hidden = false;
    elements.modal.setAttribute("aria-hidden", "false");
    elements.modalContent.focus();
  }

  function submit() {
    if (!currentMeta) return;

    let score = 0;
    const missedTopics = new Set();

    currentQuestions.forEach((question, questionIndex) => {
      const selected = elements.container.querySelector(
        `input[name="mcq_${questionIndex}"]:checked`,
      );
      const selectedIndex = selected ? Number(selected.value) : -1;
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

      if (selectedIndex === question.answer) {
        score += 1;
      } else {
        missedTopics.add(question.topic);
      }
    });

    const passed = score >= currentMeta.passMark;
    elements.result.textContent = `Score ${score}/${currentMeta.questionCount}. ${passed ? "Pass." : "Review and retry."}`;
    if (missedTopics.size > 0) {
      const topics = makeElement(
        "p",
        "mcq-topics",
        `Review: ${[...missedTopics].join(", ")}.`,
      );
      elements.result.append(topics);
    }
    elements.result.classList.toggle("is-pass", passed);
    elements.result.classList.toggle("is-review", !passed);
    elements.submit.disabled = true;
  }

  elements.close.addEventListener("click", close);
  elements.submit.addEventListener("click", submit);

  return {
    open,
    close,
  };
}
