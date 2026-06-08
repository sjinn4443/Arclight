import {
  getInteractiveLearningQuiz,
  getInteractiveLearningQuizPageIds,
} from "./interactiveLearningQuizData.js";

const LESSON_PROGRESS_PREFIX = "lessonProgress:";
const LESSON_PROGRESS_EVENT = "arclight:lesson-progress-changed";

function translateNode(node) {
  try {
    window.I18N?.applyTranslations?.(node);
  } catch {
    void 0;
  }
}

function clampProgressPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function readJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function writeLessonProgress(target, percent, { mode = "max" } = {}) {
  if (!target) return 0;

  const key = `${LESSON_PROGRESS_PREFIX}${target}`;
  const next = clampProgressPercent(percent);
  const previousRaw = readJSON(key) || {};
  const previous = clampProgressPercent(previousRaw.percent);
  const finalPercent = mode === "replace" ? next : Math.max(previous, next);

  if (
    finalPercent !== previous ||
    !Number.isFinite(Number(previousRaw.percent)) ||
    finalPercent >= 100
  ) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          percent: finalPercent,
          updatedAt: Date.now(),
        }),
      );
    } catch {
      void 0;
    }
  }

  document.dispatchEvent(
    new CustomEvent(LESSON_PROGRESS_EVENT, {
      detail: { target, percent: finalPercent },
    }),
  );

  return finalPercent;
}

function ensureQuestionHeading(block) {
  let heading = block.querySelector(".quiz-question-heading");
  let badge = block.querySelector(".quiz-question-badge");
  let question = block.querySelector(".quiz-question");

  if (!question) {
    question = document.createElement("p");
    question.className = "quiz-question";
  }

  if (!heading) {
    heading = document.createElement("div");
    heading.className = "quiz-question-heading";
    block.prepend(heading);
  }

  if (!badge) {
    badge = document.createElement("span");
    badge.className = "quiz-question-badge";
    badge.setAttribute("aria-hidden", "true");
  }

  if (!heading.contains(badge)) heading.prepend(badge);
  if (!heading.contains(question)) heading.appendChild(question);
  return { badge, question };
}

function setScoreSummary(target, correct, total) {
  if (!target) return;
  target.textContent = `You got ${correct} out of ${total} correct.`;
}

function setCorrectAnswerLine(target, question) {
  if (!target) return;

  const answerText = question.options[question.answerIndex] || "";
  target.textContent = "";
  target.appendChild(document.createTextNode("Correct answer: "));
  target.appendChild(document.createTextNode(answerText));

  if (question.explanation) {
    target.appendChild(document.createElement("br"));
    const explanation = document.createElement("span");
    explanation.textContent = question.explanation;
    target.appendChild(explanation);
  }
}

function updateQuizInProgress(form, pageId, totalQuestions) {
  if (!form || !totalQuestions) return;

  let answered = 0;
  for (let i = 0; i < totalQuestions; i += 1) {
    if (form.querySelector(`input[name="q${i}"]:checked`)) answered += 1;
  }

  writeLessonProgress(pageId, (answered / totalQuestions) * 95);
}

function createQuizLayout(pageId) {
  const fragment = document.createDocumentFragment();

  const topbar = document.createElement("div");
  topbar.className = "eyes-topbar interactive-topic-quiz-topbar";
  const topbarTitle = document.createElement("div");
  topbarTitle.className = "eyes-topbar__title";
  topbarTitle.setAttribute("data-i18n", "auto.videos.eyes");
  topbarTitle.textContent = "Eyes";
  const icons = document.createElement("div");
  icons.className = "eyes-topbar__icons";
  const menu = document.createElement("span");
  menu.className = "icon menuBtn";
  menu.setAttribute("aria-label", "Menu");
  menu.setAttribute("data-i18n", "i18nExtra.menu_aria_label:aria-label");
  menu.textContent = "☰";
  icons.appendChild(menu);
  topbar.appendChild(topbarTitle);
  topbar.appendChild(icons);

  const container = document.createElement("div");
  container.className = "quiz-container";

  const scroll = document.createElement("div");
  scroll.className = "quiz-scroll";
  const form = document.createElement("form");
  scroll.appendChild(form);

  const footer = document.createElement("div");
  footer.className = "quiz-footer";
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "start-btn";
  submitBtn.textContent = "Check Answer";
  footer.appendChild(submitBtn);

  const modal = document.createElement("div");
  modal.className = "quiz-modal hidden";
  const modalContent = document.createElement("div");
  modalContent.className = "quiz-modal-content";
  const scoreText = document.createElement("p");
  const seeWhyBtn = document.createElement("button");
  seeWhyBtn.textContent = "Check Answer";
  modalContent.appendChild(scoreText);
  modalContent.appendChild(seeWhyBtn);
  modal.appendChild(modalContent);

  container.appendChild(scroll);
  container.appendChild(footer);
  container.appendChild(modal);
  fragment.appendChild(topbar);
  fragment.appendChild(container);

  const prefix = `${pageId}-`;
  form.id = `${prefix}quizForm`;
  submitBtn.setAttribute("form", form.id);
  modal.id = `${prefix}quizModal`;
  scoreText.id = `${prefix}quizScoreText`;
  seeWhyBtn.id = `${prefix}seeWhyBtn`;

  return fragment;
}

function applyScopedIds(page, pageId) {
  const prefix = `${pageId}-`;
  const backBtn = page.querySelector("#backToVideoBtn, .back-icon");
  const form = page.querySelector("#quizForm, form");
  const submitBtn = page.querySelector(".quiz-footer .start-btn");
  const modal = page.querySelector("#quizModal, .quiz-modal");
  const scoreText = page.querySelector("#quizScoreText, .quiz-modal-content p");
  const seeWhyBtn = page.querySelector(
    "#seeWhyBtn, .quiz-modal-content button",
  );

  if (backBtn) backBtn.id = `${prefix}backToVideoBtn`;
  if (form) form.id = `${prefix}quizForm`;
  if (submitBtn && form) {
    submitBtn.setAttribute("form", form.id);
    submitBtn.textContent = "Check Answer";
    submitBtn.setAttribute("data-i18n", "i18nLiteral.Check Answer");
  }
  if (modal) modal.id = `${prefix}quizModal`;
  if (scoreText) scoreText.id = `${prefix}quizScoreText`;
  if (seeWhyBtn) seeWhyBtn.id = `${prefix}seeWhyBtn`;

  return { backBtn, form, modal, scoreText, seeWhyBtn };
}

function createQuizBlock(question, questionIndex, pageId) {
  const blockTemplate = document.getElementById("quizLauncherBlockTemplate");
  const optionTemplate = document.getElementById("quizLauncherOptionTemplate");
  const block =
    blockTemplate?.content.firstElementChild?.cloneNode(true) ||
    document.createElement("div");

  block.classList.add("quiz-block");

  const { badge, question: questionEl } = ensureQuestionHeading(block);
  badge.textContent = String(questionIndex + 1).padStart(2, "0");
  questionEl.textContent = question.prompt;

  let optionsWrap = block.querySelector(".quiz-options");
  if (!optionsWrap) {
    optionsWrap = document.createElement("div");
    optionsWrap.className = "quiz-options";
    block.appendChild(optionsWrap);
  }
  optionsWrap.textContent = "";

  question.options.forEach((optionText, optionIndex) => {
    const option =
      optionTemplate?.content.firstElementChild?.cloneNode(true) ||
      document.createElement("label");
    option.classList.add("radio-label");

    const input =
      option.querySelector("input") || document.createElement("input");
    input.type = "radio";
    input.name = `q${questionIndex}`;
    input.value = String(optionIndex);

    const span =
      option.querySelector(".quiz-option-text") ||
      option.querySelector("span") ||
      document.createElement("span");
    span.textContent = optionText;

    if (!option.contains(input)) option.prepend(input);
    if (!option.contains(span)) option.appendChild(span);
    optionsWrap.appendChild(option);
  });

  let answer = block.querySelector(".answer");
  if (!answer) {
    answer = document.createElement("p");
    answer.className = "answer";
    answer.style.display = "none";
    answer.style.marginTop = "5px";
    answer.style.fontStyle = "italic";
    block.appendChild(answer);
  }
  answer.id = `${pageId}-answer-${questionIndex}`;
  setCorrectAnswerLine(answer, question);

  return block;
}

function renderQuizPage(page, config, showPage) {
  page.className = "page has-eyes-topbar interactive-topic-quiz-page";
  page.dataset.quizPageId = config.pageId;
  page.dataset.quizTopic = config.topicKey;
  page.dataset.quizLevel = config.levelKey;
  page.replaceChildren(createQuizLayout(config.pageId));

  const { backBtn, form, modal, scoreText, seeWhyBtn } = applyScopedIds(
    page,
    config.pageId,
  );

  if (!form) return;
  form.textContent = "";
  config.questions.forEach((question, index) => {
    form.appendChild(createQuizBlock(question, index, config.pageId));
  });

  form.addEventListener("change", () => {
    updateQuizInProgress(form, config.pageId, config.questions.length);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let correct = 0;
    config.questions.forEach((question, questionIndex) => {
      const radios = form.querySelectorAll(`input[name="q${questionIndex}"]`);
      let selected = null;

      radios.forEach((radio) => {
        radio.disabled = true;
        if (radio.checked) selected = Number.parseInt(radio.value, 10);
      });

      const block = radios[0]?.closest(".quiz-block");
      const labels = block?.querySelectorAll("label") || [];
      labels.forEach((label) => {
        const optionValue = Number.parseInt(
          label.querySelector("input")?.value || "",
          10,
        );
        label.classList.toggle("correct", optionValue === question.answerIndex);
        label.classList.toggle(
          "wrong",
          Number.isInteger(selected) &&
            optionValue === selected &&
            selected !== question.answerIndex,
        );
      });

      if (selected === question.answerIndex) correct += 1;
    });

    if (scoreText) {
      setScoreSummary(scoreText, correct, config.questions.length);
      scoreText.appendChild(document.createElement("br"));
      const hint = document.createElement("small");
      hint.textContent = "Answers are highlighted in green.";
      scoreText.appendChild(hint);
    }

    modal?.classList.remove("hidden");
    writeLessonProgress(config.pageId, 100);
  });

  seeWhyBtn?.addEventListener("click", () => {
    modal?.classList.add("hidden");
    page
      .querySelectorAll(".answer")
      .forEach((answerEl) => (answerEl.style.display = "block"));
  });

  backBtn?.addEventListener("click", () => {
    if (typeof showPage === "function") showPage(config.returnPageId);
  });

  translateNode(page);
}

export function initializeInteractiveLearningTopicQuizzes({ showPage } = {}) {
  const root = document.getElementById("videos");
  if (!root) return;

  getInteractiveLearningQuizPageIds().forEach((pageId) => {
    const config = getInteractiveLearningQuiz(pageId);
    if (!config) return;

    let page = document.getElementById(pageId);
    if (!page) {
      page = document.createElement("div");
      page.id = pageId;
      page.style.display = "none";
      root.appendChild(page);
    }

    renderQuizPage(page, config, showPage);
  });
}

export { getInteractiveLearningQuiz, getInteractiveLearningQuizPageIds };
