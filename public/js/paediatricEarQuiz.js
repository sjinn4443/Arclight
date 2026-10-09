import { setLessonProgress } from "./lessonProgress.js";
import {
  PAEDIATRIC_EAR_IMAGES,
  PAEDIATRIC_COPY,
} from "./paediatricWorkshopData.js";

const STORAGE_KEY = "paediatricSurgicalEyeEarWorkshop:earQuiz:v1";
const ui = (key, fallback) =>
  window.I18N?.t?.(`medicalStudentsWorkshop.quizUi.${key}`, fallback) ||
  fallback;

function shuffled(items) {
  const order = [...items];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  // Avoid the source sequence and simple rotations that still reveal a pattern.
  const offset = items.indexOf(order[0]);
  if (order.every((id, index) => id === items[(index + offset) % items.length]))
    [order[0], order[1]] = [order[1], order[0]];
  return order;
}

export function initializePaediatricEarQuiz(page) {
  if (!page || page.dataset.earQuizWired === "1") return;
  page.dataset.earQuizWired = "1";
  const form = page.querySelector("[data-ear-quiz-form]");
  const submit = page.querySelector("[data-ear-quiz-submit]");
  const dialog = page.querySelector("dialog");
  const review = page.querySelector("[data-ear-quiz-review]");
  const restart = page.querySelector("[data-ear-quiz-restart]");
  const progress = page.querySelector("[data-ear-quiz-progress]");
  const status = page.querySelector("[data-ear-quiz-status]");
  const ids = PAEDIATRIC_EAR_IMAGES.map((image) => image.id);
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    /* optional storage */
  }
  let answers = Object.fromEntries(
    ids.map((id) => [
      id,
      ids.includes(saved?.answers?.[id]) ? saved.answers[id] : null,
    ]),
  );
  let submitted = saved?.submitted === true && ids.every((id) => answers[id]);
  let reviewing = submitted && saved?.reviewing === true;
  const validOrder = (order) =>
    Array.isArray(order) &&
    order.length === ids.length &&
    new Set(order).size === ids.length &&
    order.every((id) => ids.includes(id));
  let questionOrder;
  let optionOrders;

  function mixQuestions() {
    questionOrder = shuffled(ids);
    // Assign a different correct-answer letter to every image, in mixed order.
    const positions = shuffled(ids.map((_, index) => index));
    optionOrders = Object.fromEntries(
      questionOrder.map((id, index) => {
        const options = shuffled(ids);
        const correct = options.indexOf(id);
        const position = positions[index];
        [options[correct], options[position]] = [
          options[position],
          options[correct],
        ];
        return [id, options];
      }),
    );
  }
  function applyOrder() {
    const questions = form.querySelector(".medical-test-quiz-questions");
    questionOrder.forEach((id, index) => {
      const card = form.querySelector(`[data-ear-question="${id}"]`);
      card.querySelector(".quiz-card-number").textContent = String(
        index + 1,
      ).padStart(2, "0");
      card.querySelector("img").alt =
        `${PAEDIATRIC_COPY.image_case} ${index + 1}`;
      const options = card.querySelector(".options");
      optionOrders[id].forEach((value, optionIndex) => {
        const label = card
          .querySelector(`input[value="${value}"]`)
          .closest(".opt");
        label.querySelector(".opt-prefix").textContent =
          `${String.fromCharCode(65 + optionIndex)}.`;
        options.append(label);
      });
      questions.append(card);
    });
  }
  if (
    validOrder(saved?.questionOrder) &&
    ids.every((id) => validOrder(saved?.optionOrders?.[id]))
  ) {
    questionOrder = saved.questionOrder;
    optionOrders = saved.optionOrders;
  } else mixQuestions();
  applyOrder();

  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          answers,
          submitted,
          reviewing,
          questionOrder,
          optionOrders,
        }),
      );
    } catch {
      /* optional storage */
    }
  }
  function update() {
    const answered = ids.filter((id) => answers[id]).length;
    progress.textContent = `${answered} / ${ids.length}`;
    submit.textContent = ui(
      submitted ? "seeResults" : "submitAnswers",
      submitted ? "See Results" : "Submit Answers",
    );
    setLessonProgress(page.id, submitted ? 100 : (answered / ids.length) * 90);
    form.querySelectorAll("input[type=radio]").forEach((input) => {
      input.checked = answers[input.name.slice(4)] === input.value;
      input.disabled = submitted;
      input
        .closest(".opt")
        .classList.toggle(
          "correct",
          reviewing && input.value === input.name.slice(4),
        );
      input
        .closest(".opt")
        .classList.toggle(
          "wrong",
          reviewing && input.checked && input.value !== input.name.slice(4),
        );
    });
    PAEDIATRIC_EAR_IMAGES.forEach((image) => {
      const explanation = form.querySelector(
        `[data-ear-question="${image.id}"] .quiz-explanation`,
      );
      explanation.hidden = !reviewing;
      explanation.textContent = `Source label: ${PAEDIATRIC_COPY[image.label]}`;
    });
    persist();
  }
  function showResults() {
    const correct = ids.filter((id) => answers[id] === id).length;
    page.querySelector("[data-ear-quiz-score]").textContent =
      `${correct} / ${ids.length}`;
    review.textContent = ui(
      correct === ids.length ? "review" : "seeWhy",
      correct === ids.length ? "Review" : "See why",
    );
    restart.textContent = ui("restart", "Restart");
    if (!dialog.open) dialog.showModal();
  }
  form.addEventListener("change", () => {
    if (submitted) return;
    for (const id of ids)
      answers[id] =
        form.querySelector(`input[name="ear-${id}"]:checked`)?.value || null;
    status.textContent = "";
    update();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const missing = questionOrder.find((id) => !answers[id]);
    if (missing) {
      status.textContent = "Answer all five questions before submitting.";
      const question = form.querySelector(`[data-ear-question="${missing}"]`);
      question.scrollIntoView({ block: "center" });
      question.querySelector("input").focus({ preventScroll: true });
      return;
    }
    submitted = true;
    update();
    showResults();
  });
  review.addEventListener("click", () => {
    reviewing = true;
    dialog.close();
    update();
    form.querySelector("fieldset").scrollIntoView({ block: "start" });
  });
  restart.addEventListener("click", () => {
    answers = Object.fromEntries(ids.map((id) => [id, null]));
    submitted = false;
    reviewing = false;
    dialog.close();
    status.textContent = "";
    mixQuestions();
    applyOrder();
    update();
    form.querySelector("input").focus();
  });
  page.querySelector("#paediatric-quiz-results-title").textContent = ui(
    "results",
    "Results",
  );
  // A route change must not leave the native modal above another lesson.
  window.addEventListener("page:loaded", () => dialog.open && dialog.close());
  update();
}
