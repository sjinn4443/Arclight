import { FUNDAL_REFLEX_CASES } from "./fundalReflexQuiz.js";

const STORAGE_KEY = "pecWorkshop:fundalInterpretationAnswers";

export function appendFundalInterpretationQuiz(stack, translate) {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    /* optional persistence */
  }
  const answers = FUNDAL_REFLEX_CASES.map((_, index) =>
    ["Normal", "Abnormal"].includes(saved?.answers?.[index])
      ? saved.answers[index]
      : null,
  );
  let submitted = Boolean(saved?.submitted && answers.every(Boolean));
  const cards = [];
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    element.className = className;
    if (text) element.textContent = text;
    return element;
  };
  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, submitted }));
    } catch {
      /* optional persistence */
    }
  };
  FUNDAL_REFLEX_CASES.forEach((item, index) => {
    const card = make(
      "article",
      "diabetic-screening-panel diabetic-screening-panel--content-fit pec-interpretation-card",
    );
    card.dataset.diabeticScrollStep = "";
    card.dataset.question = String(index + 1);
    const heading = make("h3", "pec-interpretation-number", String(index + 1));
    heading.setAttribute("aria-label", `${translate("question")} ${index + 1}`);
    const image = make("img", "pec-interpretation-image");
    image.src = `/images/quiz/fundal-reflex/case-${index + 1}.webp`;
    image.alt = `${translate("fundal_test_images")} ${index + 1}`;
    image.width = 640;
    image.height = 360;
    image.loading = "lazy";
    const choices = make("div", "pec-interpretation-choices");
    choices.setAttribute("role", "group");
    choices.setAttribute("aria-label", `${translate("question")} ${index + 1}`);
    ["Normal", "Abnormal"].forEach((value) => {
      const button = make(
        "button",
        "pec-interpretation-choice",
        translate(value.toLowerCase()),
      );
      button.type = "button";
      button.dataset.answer = value;
      button.addEventListener("click", () => {
        if (submitted) return;
        answers[index] = value;
        persist();
        refresh();
      });
      choices.append(button);
    });
    const result = make("p", "pec-interpretation-result");
    result.setAttribute("role", "status");
    card.append(heading, image, choices, result);
    stack.append(card);
    cards.push({
      choices,
      result,
      correct: item.normal === "Yes" ? "Normal" : "Abnormal",
    });
  });
  const actions = make("div", "pec-interpretation-actions frq-mount");
  const status = make("p", "pec-interpretation-status");
  status.setAttribute("role", "status");
  const submit = make(
    "button",
    "pec-interpretation-submit frq-button frq-primary",
    translate("submit_answers"),
  );
  submit.type = "button";
  const retry = make(
    "button",
    "pec-interpretation-retry frq-button",
    translate("try_again"),
  );
  retry.type = "button";
  const buttons = make("div", "frq-actions");
  buttons.append(submit, retry);
  actions.append(status, buttons);
  stack.append(actions);
  const updateWidth = () =>
    actions.style.setProperty(
      "--pec-quiz-container-width",
      `${document.body.clientWidth}px`,
    );
  updateWidth();
  const sizing = new ResizeObserver(updateWidth);
  sizing.observe(document.body);
  const lifecycle = new AbortController();
  window.addEventListener(
    "page:loaded",
    () => {
      if (!actions.isConnected) {
        sizing.disconnect();
        lifecycle.abort();
      }
    },
    { signal: lifecycle.signal },
  );

  function refresh() {
    cards.forEach(({ choices, result, correct }, index) => {
      choices.querySelectorAll("button").forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          String(answers[index] === button.dataset.answer),
        );
        button.disabled = submitted;
      });
      result.hidden = !submitted;
      const isCorrect = answers[index] === correct;
      result.classList.toggle("is-correct", submitted && isCorrect);
      result.classList.toggle("is-incorrect", submitted && !isCorrect);
      result.textContent = submitted
        ? `${isCorrect ? "✓" : "✕"} ${translate(isCorrect ? "correct" : "incorrect")} · ${translate("correct_answer")}: ${translate(correct.toLowerCase())}`
        : "";
    });
    const complete = answers.every(Boolean);
    submit.disabled = !complete;
    submit.hidden = submitted;
    retry.hidden = !submitted;
    status.hidden = submitted || complete;
    status.textContent = translate("answer_all_images");
  }
  submit.addEventListener("click", () => {
    if (!answers.every(Boolean) || submitted) return;
    submitted = true;
    persist();
    refresh();
    document.dispatchEvent(
      new CustomEvent("primaryWorkshop:worksheet-saved", {
        detail: { key: "fundalInterpretation", percent: 100 },
      }),
    );
  });
  retry.addEventListener("click", () => {
    submitted = false;
    answers.fill(null);
    persist();
    refresh();
  });
  refresh();
}
