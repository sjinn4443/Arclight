import { MCQ_BANK } from "./mcq-bank.js?v=20260430-2";

function shuffledCopy(items) {
  return items
    .map((item) => ({ item, sortKey: Math.random() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map((entry) => entry.item);
}

function shuffleQuestionOptions(question) {
  const correctOption = question.options[question.answer];
  const options = shuffledCopy(question.options);

  return {
    ...question,
    options,
    answer: options.indexOf(correctOption),
  };
}

export function sampleQuestions(level, count = 5) {
  const source = MCQ_BANK[level] || [];
  const shuffled = shuffledCopy(source);

  return shuffled
    .slice(0, Math.min(count, shuffled.length))
    .map(shuffleQuestionOptions);
}

export function renderMcqQuestions(container, questions) {
  if (!container) {
    return;
  }

  const fragment = document.createDocumentFragment();

  questions.forEach((question, questionIndex) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "question";

    const legend = document.createElement("legend");
    legend.textContent = `${questionIndex + 1}. ${question.question}`;
    fieldset.appendChild(legend);

    const options = document.createElement("div");
    options.className = "options";

    question.options.forEach((option, optionIndex) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `mcq_q_${questionIndex}`;
      input.value = String(optionIndex);

      label.append(input, document.createTextNode(` ${option}`));
      options.appendChild(label);
    });

    fieldset.appendChild(options);
    fragment.appendChild(fieldset);
  });

  container.replaceChildren(fragment);
}

export function getMcqAnswers(questions) {
  const answers = [];
  for (let i = 0; i < questions.length; i += 1) {
    const selected = document.querySelector(`input[name="mcq_q_${i}"]:checked`);
    if (!selected) {
      return null;
    }

    answers.push(parseInt(selected.value, 10));
  }

  return answers;
}

export function gradeMcq(questions, answers) {
  let score = 0;
  questions.forEach((question, index) => {
    if (answers[index] === question.answer) {
      score += 1;
    }
  });

  return score;
}

export function revealMcqFeedback(container, questions, answers) {
  if (!container || !Array.isArray(questions) || !Array.isArray(answers)) {
    return;
  }

  const questionBlocks = Array.from(
    container.querySelectorAll("fieldset.question"),
  );
  questionBlocks.forEach((questionBlock, questionIndex) => {
    const optionLabels = Array.from(
      questionBlock.querySelectorAll(".options label"),
    );
    optionLabels.forEach((label) => {
      label.classList.remove("correct-answer-label", "wrong-answer-label");
    });

    const correctOptionIndex = questions[questionIndex]?.answer;
    const selectedOptionIndex = answers[questionIndex];
    const correctLabel = optionLabels[correctOptionIndex];
    if (correctLabel) {
      correctLabel.classList.add("correct-answer-label");
    }

    if (
      Number.isInteger(selectedOptionIndex) &&
      selectedOptionIndex !== correctOptionIndex
    ) {
      const selectedLabel = optionLabels[selectedOptionIndex];
      if (selectedLabel) {
        selectedLabel.classList.add("wrong-answer-label");
      }
    }

    questionBlock.querySelectorAll("input[type='radio']").forEach((input) => {
      input.disabled = true;
    });
  });
}
