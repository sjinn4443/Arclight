/*
 * MCQ trainer runtime for Squint app.
 * Fields-style flow: full question list + single submit.
 */

const MCQ_BANK = (globalThis.McqData && globalThis.McqData.MCQ_BANK) || {};

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
  return shuffle(bank).map((q, qIndex) => {
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
      options: shuffle(options),
    };
  });
}

function resetResultUI(ui) {
  if (!ui.result) return;
  ui.result.textContent = "";
  ui.result.classList.remove("pass", "fail");
  if (ui.submitBtn) ui.submitBtn.disabled = false;
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

  let score = 0;
  let missing = false;
  const missed = [];

  MCQ_STATE.questions.forEach((question, index) => {
    const inputSelector = `input[name="q-${index}"]`;
    const options = Array.from(ui.form.querySelectorAll(inputSelector));
    options.forEach((input) => {
      const optionEl = input.closest(".mcq-option");
      if (optionEl) optionEl.classList.remove("is-correct", "is-wrong");
    });

    const selected = ui.form.querySelector(`${inputSelector}:checked`);
    if (!selected) {
      missing = true;
      return;
    }

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
  });

  if (missing) {
    ui.result.textContent = "Answer all questions first.";
    ui.result.classList.remove("pass");
    ui.result.classList.add("fail");
    return;
  }

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
  MCQ_STATE.submitted = true;
}

function openMcqLevel(level) {
  const ui = getMcqElements();
  if (!ui.card) return;
  buildQuiz(level);
  document.body.classList.add("mcq-open");
  ui.card.hidden = false;
}

function closeMcq() {
  const ui = getMcqElements();
  document.body.classList.remove("mcq-open");
  if (ui.card) ui.card.hidden = true;
}

function initMcq() {
  const ui = getMcqElements();
  if (!ui.card) return;

  ui.closeBtn?.addEventListener("click", closeMcq);
  ui.submitBtn?.addEventListener("click", handleSubmit);
  ui.restartBtn?.addEventListener("click", () => buildQuiz(MCQ_STATE.level));

  ui.card.addEventListener("click", (event) => {
    if (event.target === ui.card) closeMcq();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMcq();
  });
}

document.addEventListener("DOMContentLoaded", initMcq);
window.openMcqLevel = openMcqLevel;
