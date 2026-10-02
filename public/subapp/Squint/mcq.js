/*
 * MCQ trainer runtime for Squint app.
 * Fields-style flow: full question list + single submit.
 */

const MCQ_BANK = (globalThis.McqData && globalThis.McqData.MCQ_BANK) || {};
const MCQ_SOURCE_REFERENCES =
  (globalThis.McqData && globalThis.McqData.MCQ_SOURCE_REFERENCES) || {};

const MCQ_STATE = {
  level: "primary",
  questions: [],
  submitted: false,
};

const MCQ_LEVEL_LABELS = {
  primary: "Primary",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const MCQ_QUESTION_COUNTS = {
  primary: 5,
  intermediate: 6,
  advanced: 8,
};

function shuffle(items) {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getPassMark(level, total) {
  if (level === "advanced") return Math.ceil(total * 0.75);
  if (level === "intermediate") return Math.ceil(total * 0.67);
  return Math.ceil(total * 0.6);
}

function getMcqElements() {
  return {
    card: document.getElementById("mcq-card"),
    title: document.getElementById("mcq-title"),
    meta: document.getElementById("mcq-meta"),
    form: document.getElementById("mcq-form"),
    submitBtn: document.getElementById("mcq-submit"),
    restartBtn: document.getElementById("mcq-restart"),
    result: document.getElementById("mcq-result"),
    closeBtn: document.getElementById("mcq-close-btn"),
  };
}

function buildQuestions(level) {
  const bank = MCQ_BANK[level] || MCQ_BANK.primary || [];
  const questionCount = Math.min(MCQ_QUESTION_COUNTS[level] || 5, bank.length);
  return shuffle(bank)
    .slice(0, questionCount)
    .map((q, qIndex) => {
      const options = (q.options || []).map((label, index) => ({
        id: `${q.id || `${level}-${qIndex + 1}`}-o${index + 1}`,
        key: index,
        label,
      }));
      return {
        id: q.id || `${level}-${qIndex + 1}`,
        prompt: q.question || "",
        answerKey: Number.isInteger(q.answer) ? q.answer : -1,
        explanation: q.explanation || "",
        source: q.source || "",
        reviewStatus: q.reviewStatus || "",
        options: shuffle(options),
      };
    });
}

function resetResultUI(ui) {
  if (!ui.result) return;
  ui.result.textContent = "";
  ui.result.classList.remove("pass", "fail");
  if (ui.submitBtn) ui.submitBtn.disabled = false;
  if (ui.restartBtn) {
    ui.restartBtn.hidden = true;
    ui.restartBtn.textContent = "Try again";
  }
}

function renderMeta(ui) {
  const label = MCQ_LEVEL_LABELS[MCQ_STATE.level] || MCQ_LEVEL_LABELS.primary;
  if (ui.title) ui.title.textContent = `MCQ - ${label}`;
  if (ui.meta)
    ui.meta.textContent = `${label} | ${MCQ_STATE.questions.length} questions`;
}

function renderQuestions(ui) {
  if (!ui.form) return;
  ui.form.innerHTML = "";

  MCQ_STATE.questions.forEach((question, index) => {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "mcq-question";
    fieldset.dataset.questionId = question.id;

    const legend = document.createElement("legend");
    legend.textContent = `${index + 1}. ${question.prompt}`;
    fieldset.appendChild(legend);

    const optionsWrap = document.createElement("div");
    optionsWrap.className = "mcq-options";

    question.options.forEach((option) => {
      const label = document.createElement("label");
      label.className = "mcq-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q-${index}`;
      input.value = String(option.key);
      label.appendChild(input);

      const body = document.createElement("span");
      body.className = "mcq-option-body";
      body.textContent = option.label;
      label.appendChild(body);

      optionsWrap.appendChild(label);
    });

    fieldset.appendChild(optionsWrap);
    const review = document.createElement("div");
    review.className = "mcq-item-review";
    review.hidden = true;
    const explanation = document.createElement("p");
    explanation.className = "mcq-item-feedback";
    explanation.textContent = `Why: ${question.explanation}`;
    const source = document.createElement("p");
    source.className = "mcq-item-source";
    const sourceMeta = MCQ_SOURCE_REFERENCES[question.source];
    source.textContent = `Source: ${sourceMeta?.label || question.source}. Status: ${question.reviewStatus}.`;
    review.append(explanation, source);
    fieldset.appendChild(review);
    ui.form.appendChild(fieldset);
  });
}

function buildQuiz(level) {
  const safeLevel = MCQ_BANK[level] ? level : "primary";
  const ui = getMcqElements();
  if (!ui.card) return;

  MCQ_STATE.level = safeLevel;
  MCQ_STATE.questions = buildQuestions(safeLevel);
  MCQ_STATE.submitted = false;

  renderMeta(ui);
  renderQuestions(ui);
  resetResultUI(ui);
}

function handleSubmit() {
  if (MCQ_STATE.submitted) return;
  const ui = getMcqElements();
  if (!ui.form || !ui.result) return;

  const selectedInputs = MCQ_STATE.questions.map((_, index) =>
    ui.form.querySelector(`input[name="q-${index}"]:checked`),
  );
  const firstUnansweredIndex = selectedInputs.findIndex((input) => !input);

  if (firstUnansweredIndex >= 0) {
    ui.result.textContent = "Answer all questions first.";
    ui.result.classList.remove("pass");
    ui.result.classList.add("fail");
    ui.form.querySelector(`input[name="q-${firstUnansweredIndex}"]`)?.focus();
    return;
  }

  let score = 0;
  const missed = [];

  MCQ_STATE.questions.forEach((question, index) => {
    const inputSelector = `input[name="q-${index}"]`;
    const options = Array.from(ui.form.querySelectorAll(inputSelector));
    options.forEach((input) => {
      const optionEl = input.closest(".mcq-option");
      if (optionEl) optionEl.classList.remove("is-correct", "is-wrong");
    });

    const selected = selectedInputs[index];

    const correctInput = options.find(
      (input) => input.value === String(question.answerKey),
    );
    if (correctInput) {
      const correctOption = correctInput.closest(".mcq-option");
      if (correctOption) correctOption.classList.add("is-correct");
    }

    if (selected.value === String(question.answerKey)) {
      score += 1;
    } else {
      missed.push(index + 1);
      const selectedOption = selected.closest(".mcq-option");
      if (selectedOption) selectedOption.classList.add("is-wrong");
    }
    const review = ui.form.querySelector(
      `[data-question-id="${question.id}"] .mcq-item-review`,
    );
    if (review) review.hidden = false;
  });

  const total = MCQ_STATE.questions.length;
  const passMark = getPassMark(MCQ_STATE.level, total);
  const pass = score >= passMark;
  const missedText = missed.length ? ` Missed: ${missed.join(", ")}.` : "";

  ui.result.textContent = `Score ${score}/${total}. ${pass ? "Pass" : "Review and retry"} (Pass ${passMark}/${total}).${missedText}`;
  ui.result.classList.toggle("pass", pass);
  ui.result.classList.toggle("fail", !pass);

  ui.form.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.disabled = true;
  });
  if (ui.submitBtn) ui.submitBtn.disabled = true;
  if (ui.restartBtn) {
    ui.restartBtn.hidden = false;
    ui.restartBtn.textContent = pass ? "New attempt" : "Try again";
  }
  MCQ_STATE.submitted = true;
}

let mcqReturnFocus = null;

function openMcqLevel(level) {
  const ui = getMcqElements();
  if (!ui.card) return;
  mcqReturnFocus =
    document.getElementById("sidebar-toggle") || document.activeElement;
  buildQuiz(level);
  document.body.classList.add("mcq-open");
  ui.card.hidden = false;
  ui.card.setAttribute("aria-hidden", "false");
  ui.card.scrollTop = 0;
  window.requestAnimationFrame(() => {
    ui.card.scrollTop = 0;
    ui.closeBtn?.focus({ preventScroll: true });
  });
}

function restartMcqAttempt() {
  const ui = getMcqElements();
  buildQuiz(MCQ_STATE.level);
  if (!ui.card) return;
  ui.card.scrollTop = 0;
  window.requestAnimationFrame(() => {
    ui.card.scrollTop = 0;
    ui.closeBtn?.focus({ preventScroll: true });
  });
}

function closeMcq() {
  const ui = getMcqElements();
  const returnFocus = mcqReturnFocus;
  mcqReturnFocus = null;
  document.body.classList.remove("mcq-open");
  if (ui.card) {
    ui.card.hidden = true;
    ui.card.setAttribute("aria-hidden", "true");
  }
  if (returnFocus?.isConnected) {
    window.requestAnimationFrame(() => returnFocus.focus());
  }
}

function initMcq() {
  const ui = getMcqElements();
  if (!ui.card) return;

  ui.closeBtn?.addEventListener("click", closeMcq);
  ui.submitBtn?.addEventListener("click", handleSubmit);
  ui.restartBtn?.addEventListener("click", restartMcqAttempt);

  ui.card.addEventListener("click", (event) => {
    if (event.target === ui.card) closeMcq();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && !ui.card.hidden) {
      const controls = [
        ...ui.card.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((element) => element.offsetParent !== null);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    if (event.key === "Escape") closeMcq();
  });
}

document.addEventListener("DOMContentLoaded", initMcq);
window.openMcqLevel = openMcqLevel;
