import {
  CATARACT_QUIZ_CASES,
  CATARACT_QUIZ_IMAGES,
  CATARACT_QUIZ_BACK_SOURCE_EYES,
  getCataractQuizEyeFindings,
  getCataractQuizRetinalView,
} from "./cataractCaseQuizData.js";
import { setLessonProgress } from "./lessonProgress.js";

export const CATARACT_CASE_QUIZ_ID = "cataractCaseQuizPage";
export const CATARACT_CASE_QUIZ_LEVELS = {
  cataractCaseQuizPrimaryPage: {
    level: "primary",
    name: "Primary",
    seconds: 0,
  },
  [CATARACT_CASE_QUIZ_ID]: {
    level: "intermediate",
    name: "Intermediate",
    seconds: 90,
  },
  cataractCaseQuizAdvancedPage: {
    level: "advanced",
    name: "Advanced",
    seconds: 30,
  },
};
const controllers = new Map();

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function button(text, className, action) {
  const node = element("button", className, text);
  node.type = "button";
  node.addEventListener("click", action);
  return node;
}

function feedbackParagraph(text, summary = false) {
  const paragraph = element("p", "casechat-resultWhy");
  if (summary) paragraph.classList.add("cataract-quiz-feedback-summary");
  const content = summary ? element("strong") : paragraph;
  const urgentTerms =
    /\burgent review\b|\burgent\b|\breferrals?\b|\brefer(?:red|ring)?\b|\bsame-day\b/gi;
  let offset = 0;
  for (const match of text.matchAll(urgentTerms)) {
    content.append(document.createTextNode(text.slice(offset, match.index)));
    content.append(element("span", "cataract-quiz-urgent-term", match[0]));
    offset = match.index + match[0].length;
  }
  content.append(document.createTextNode(text.slice(offset)));
  if (summary) paragraph.append(content);
  return paragraph;
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function syncCataractCaseQuiz(pageId) {
  for (const [id, controller] of controllers)
    controller.setActive(pageId === id);
}

export function initializeCataractCaseQuiz({ showPage } = {}) {
  for (const [id, config] of Object.entries(CATARACT_CASE_QUIZ_LEVELS)) {
    const page = document.getElementById(id);
    if (!page || controllers.get(id)?.page === page) continue;
    controllers.get(id)?.dispose();
    controllers.set(id, createQuiz(page, config, showPage));
  }
}

function createQuiz(page, config, showPage) {
  const primary = config.level === "primary";
  const advanced = config.level === "advanced";
  page.dataset.level = config.level;
  page.querySelector(".eyes-topbar__title").textContent =
    `Cataract Quiz · ${config.name}`;
  const log = page.querySelector(".casechat-log");
  const timer = page.querySelector(".caseTimer");
  const timerText = timer.querySelector("text");
  const timerRing = timer.querySelector(".caseTimer__fg");
  timer.hidden = primary;
  const modal = page.querySelector(".casechat-modal");
  const modalCard = modal.querySelector(".casechat-modalCard");
  modalCard.classList.add("casechat-modal__content");
  const footer = element("div", "cataract-quiz-footer");
  log.after(footer);
  let pool = shuffle(CATARACT_QUIZ_CASES);
  const makeSessions = () =>
    pool.map((item) => ({
      item,
      elapsed: 0,
      revealed: 0,
      attempts: 2,
      options: shuffle([item.answer, ...item.distractors]),
      wrongAnswers: [],
      selected: null,
      outcome: null,
    }));
  let sessions = makeSessions();
  let index = 0;
  let started = false;
  let active = false;
  let interval = null;
  let lastTick = 0;
  let submit;
  let inlineChoices;
  let historyBubbles = [];
  let returnFocus;
  let reviewMode = false;
  let modalMode = "";
  const current = () => sessions[index];
  const completed = () => sessions.filter((s) => s.outcome);
  const score = () => completed().filter((s) => s.outcome.ok).length;
  const eyeCopy = (text) =>
    primary
      ? text
      : text
          .replace(/\bright[ -]eye\b/gi, "R.E.")
          .replace(/\bleft[ -]eye\b/gi, "L.E.");

  function translate(node) {
    window.I18N?.applyTranslations?.(node);
  }

  function bubble(text, kind = "system", container = log) {
    const wrap = element("div", `casechat-bubble casechat-bubble--${kind}`);
    wrap.append(
      element(
        "div",
        kind === "system" ? "casechat-system" : "casechat-text",
        text,
      ),
    );
    container.append(wrap);
    translate(wrap);
    return wrap;
  }

  function stop() {
    clearInterval(interval);
    interval = null;
  }

  function renderTimer() {
    if (primary) return;
    const left = Math.max(
      0,
      config.seconds - Math.floor((current()?.elapsed || 0) / 1000),
    );
    timerText.textContent = String(left);
    timer.setAttribute("aria-label", `Case timer: ${left} seconds remaining`);
    timerRing.style.strokeDasharray = "100 100";
    timerRing.style.strokeDashoffset = String(
      (1 - left / config.seconds) * 100,
    );
    timerRing.style.stroke = left <= 10 ? "#e41e26" : "#777";
    timerText.style.fill = left <= 10 ? "#e41e26" : "#777";
  }

  function closeModal({ restoreFocus = true } = {}) {
    modal.hidden = true;
    modalMode = "";
    if (restoreFocus && returnFocus?.isConnected) returnFocus.focus();
    resume();
  }

  function openModal(title, mode, dismissible = false) {
    if (modal.hidden) returnFocus = document.activeElement;
    stop();
    modalMode = mode;
    modalCard.classList.toggle("cataract-quiz-onboarding", mode === "intro");
    modalCard.replaceChildren();
    const top = element("div", "casechat-modal__top");
    const heading = element("h2", "casechat-modal__title", title);
    heading.id = `${page.id}DialogTitle`;
    modal.setAttribute("aria-labelledby", heading.id);
    top.append(heading);
    if (dismissible) {
      const close = button("✕", "casechat-modal__close", () => closeModal());
      close.setAttribute("aria-label", "Close");
      top.append(close);
    }
    modalCard.append(top);
    modal.hidden = false;
    return modalCard;
  }

  function focusModal() {
    translate(modalCard);
    (
      modalCard.querySelector('[role="radio"]:not(:disabled)') ||
      modalCard.querySelector("button")
    )?.focus({ preventScroll: true });
  }

  function images(item) {
    const panel = element("div", "cataract-quiz-findings");
    const eyes = getCataractQuizEyeFindings(item);
    for (const [kind, title] of [
      ["fundal", "Fundal Reflex"],
      ["back", "Back of Eye"],
    ]) {
      const figure = element("figure");
      figure.className = `cataract-quiz-exam cataract-quiz-exam--${kind}`;
      figure.append(element("figcaption", "", title));
      const pair = element("div", "cataract-quiz-eye-pair");
      for (const [side, label] of [
        ["right", primary ? "Right eye" : "R.E."],
        ["left", primary ? "Left eye" : "L.E."],
      ]) {
        const selection = eyes[side][kind];
        const eye = element("figure", "cataract-quiz-eye");
        eye.dataset.eye = side;
        eye.dataset.finding = selection;
        const view = element(
          "div",
          `cataract-quiz-eye-view cataract-quiz-eye-view--${kind}`,
        );
        const image = element("img");
        image.src = CATARACT_QUIZ_IMAGES[kind][selection];
        image.alt = `${label}: ${title} examination image`;
        image.width = kind === "fundal" ? 344 : 300;
        image.height = kind === "fundal" ? 125 : 300;
        // Fundal Reflex's teaching previews contain both eyes. Show the
        // corresponding half, keeping the patient's right eye on the left.
        if (kind === "fundal") {
          image.className = side === "left" ? "is-left-half" : "is-right-half";
        }
        // Preserve disc/macula laterality for each source's orientation.
        if (
          kind === "back" &&
          side !== CATARACT_QUIZ_BACK_SOURCE_EYES[selection]
        )
          image.classList.add("is-mirrored");
        if (kind === "back") {
          view.dataset.clarity = getCataractQuizRetinalView(item, side);
          if (view.dataset.clarity === "obscured") {
            view.setAttribute("role", "img");
            view.setAttribute(
              "aria-label",
              `${label}: retinal view is obscured`,
            );
          }
        }
        view.append(image);
        if (kind === "back" && advanced && !reviewMode)
          addViewingWindow(view, label);
        eye.append(element("span", "cataract-quiz-eye-label", label), view);
        if (primary && kind === "back" && view.dataset.clarity === "obscured")
          eye.append(
            element("figcaption", "cataract-quiz-eye-note", "Poor view"),
          );
        pair.append(eye);
      }
      figure.append(pair);
      panel.append(figure);
    }
    return panel;
  }

  function addViewingWindow(view, label) {
    const mask = element("div", "cataract-quiz-viewing-window");
    mask.tabIndex = 0;
    mask.setAttribute("role", "group");
    mask.setAttribute(
      "aria-label",
      `${label}: drag to explore the retina, or use the arrow keys`,
    );
    let x = 50,
      y = 50,
      pointer = null;
    const move = (nextX, nextY) => {
      x = Math.max(0, Math.min(100, nextX));
      y = Math.max(0, Math.min(100, nextY));
      mask.style.setProperty("--view-x", `${x}%`);
      mask.style.setProperty("--view-y", `${y}%`);
    };
    const drag = (event) => {
      const bounds = view.getBoundingClientRect();
      if (bounds.width && bounds.height)
        move(
          ((event.clientX - bounds.left) / bounds.width) * 100,
          ((event.clientY - bounds.top) / bounds.height) * 100,
        );
    };
    mask.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || pointer !== null) return;
      event.preventDefault();
      pointer = event.pointerId;
      mask.setPointerCapture(pointer);
      mask.focus({ preventScroll: true });
      drag(event);
    });
    mask.addEventListener("pointermove", (event) => {
      if (event.pointerId === pointer) drag(event);
    });
    const release = () => {
      pointer = null;
    };
    mask.addEventListener("pointerup", release);
    mask.addEventListener("pointercancel", release);
    mask.addEventListener("lostpointercapture", release);
    mask.addEventListener("keydown", (event) => {
      const deltas = {
        ArrowLeft: [-5, 0],
        ArrowRight: [5, 0],
        ArrowUp: [0, -5],
        ArrowDown: [0, 5],
      };
      if (!deltas[event.key]) return;
      event.preventDefault();
      move(x + deltas[event.key][0], y + deltas[event.key][1]);
    });
    view.append(mask);
  }

  function revealLines() {
    const state = current();
    if (!state || state.outcome || reviewMode) return;
    while (
      state.revealed < state.item.lines.length &&
      state.elapsed >= 1000 + state.revealed * 2000
    ) {
      revealHistoryLine(state);
    }
    if (
      primary &&
      state.revealed === state.item.lines.length &&
      inlineChoices?.hidden
    ) {
      inlineChoices.hidden = false;
      renderChoices(inlineChoices, true);
      submit.disabled = !state.selected;
    }
  }

  function revealHistoryLine(state) {
    const node = historyBubbles[state.revealed++];
    node.classList.remove("casechat-bubble--pending");
    node.removeAttribute("aria-hidden");
    if (active && modal.hidden && !state.outcome && window.innerWidth <= 767) {
      node.scrollIntoView({
        block: "end",
        behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)")
          .matches
          ? "auto"
          : "smooth",
      });
    }
  }

  function resume() {
    stop();
    if (
      !active ||
      !started ||
      !current() ||
      current().outcome ||
      !modal.hidden ||
      reviewMode ||
      document.hidden
    )
      return;
    lastTick = Date.now();
    interval = setInterval(() => {
      const state = current();
      if (
        !page.isConnected ||
        !active ||
        !state ||
        state.outcome ||
        reviewMode
      ) {
        stop();
        return;
      }
      const now = Date.now();
      state.elapsed += now - lastTick;
      lastTick = now;
      revealLines();
      renderTimer();
      if (!primary && state.elapsed >= config.seconds * 1000)
        finish(false, "Time is up.", "No answer (time expired)");
    }, 250);
  }

  function navigate(direction) {
    stop();
    closeModal({ restoreFocus: false });
    index = Math.max(0, index + direction);
    if (index >= sessions.length) completion();
    else renderCase();
  }

  function appendCaseNavigation(container) {
    const nav = element("div", "casechat-case-navigation");
    const previous = button(
      "< Previous",
      "casechat-nextcase casechat-previouscase",
      () => navigate(-1),
    );
    previous.disabled = index === 0;
    nav.append(
      previous,
      button("Next >", "casechat-nextcase", () => navigate(1)),
    );
    container.append(nav);
  }

  function gradeAnswer(answer) {
    const state = current();
    if (
      !state ||
      state.outcome ||
      !answer ||
      state.wrongAnswers.includes(answer)
    )
      return;
    state.selected = answer;
    if (answer === state.item.answer) finish(true, "", answer);
    else {
      state.attempts -= 1;
      state.wrongAnswers.push(answer);
      state.selected = null;
      if (state.attempts === 0) finish(false, "", answer);
      else if (primary) {
        renderChoices(inlineChoices, true);
        const retry = element(
          "p",
          "casechat-tryagain",
          "Try again · Attempts left: 1",
        );
        retry.setAttribute("role", "status");
        inlineChoices.append(retry);
        submit.disabled = true;
      } else answerChoices();
    }
  }

  function renderChoices(container, inline = false) {
    const state = current();
    const choices = element("div", "casechat-dxlist");
    choices.setAttribute("role", "radiogroup");
    choices.setAttribute("aria-label", "Choose your answer");
    if (inline)
      choices.addEventListener("keydown", (event) => {
        if (
          !["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(
            event.key,
          )
        )
          return;
        event.preventDefault();
        const radios = [
          ...choices.querySelectorAll('[role="radio"]:not(:disabled)'),
        ];
        const offset = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
        radios[
          (radios.indexOf(event.target) + offset + radios.length) %
            radios.length
        ]?.focus();
      });
    state.options.forEach((answer) => {
      const wrong = state.wrongAnswers.includes(answer);
      const selected = state.selected === answer && !wrong;
      const right = state.outcome && answer === state.item.answer;
      const choice = button(null, "casechat-dxitem", () => {
        if (state.outcome || wrong) return;
        if (inline) {
          state.selected = answer;
          renderChoices(container, true);
          submit.disabled = false;
          [...container.querySelectorAll('[role="radio"]')]
            .find((node) => node.getAttribute("aria-checked") === "true")
            ?.focus({ preventScroll: true });
        } else {
          gradeAnswer(answer);
        }
      });
      choice.setAttribute("role", "radio");
      choice.setAttribute("aria-checked", String(selected));
      choice.classList.toggle("is-selected", selected);
      choice.classList.toggle("is-wrong", wrong);
      choice.classList.toggle("is-correct", Boolean(right));
      choice.disabled = Boolean(state.outcome) || wrong;
      if (state.outcome && !right && !wrong)
        choice.classList.add("is-disabled");
      const radio = element("span", "casechat-radio");
      radio.setAttribute("aria-hidden", "true");
      choice.append(radio, element("span", "casechat-dxlabel", answer));
      choices.append(choice);
    });
    if (inline) {
      container.classList.add("casechat-bubble", "casechat-bubble--user");
      container.replaceChildren(
        element(
          "p",
          "cataract-quiz-diagnosis-prompt",
          "My working diagnosis is…",
        ),
        choices,
      );
    } else container.replaceChildren(choices);
    translate(container);
  }

  function answerFeedback(state) {
    const feedback = element("div", "cataract-quiz-answer-feedback");
    feedback.setAttribute("aria-live", "polite");
    if (state.outcome) {
      feedback.append(
        feedbackParagraph(`Correct answer: ${state.item.answer}.`, true),
        feedbackParagraph(eyeCopy(state.item.explanation)),
      );
      if (state.outcome.message)
        feedback.prepend(
          element("p", "casechat-resultWhy", state.outcome.message),
        );
      const nextStep = feedbackParagraph(
        `Next step: ${state.item.nextStep || state.item.result.actionText}`,
        true,
      );
      nextStep.classList.add("cataract-quiz-next-step");
      feedback.append(nextStep);
    } else if (state.wrongAnswers.length) {
      feedback.append(element("div", "casechat-tryagain", "Try again"));
    }
    return feedback;
  }

  function primaryResult({ focus = true } = {}) {
    log.querySelector(".cataract-quiz-inline-feedback")?.remove();
    const feedback = answerFeedback(current());
    feedback.classList.add("cataract-quiz-inline-feedback");
    log.append(feedback);
    footer.replaceChildren();
    appendCaseNavigation(footer);
    translate(feedback);
    translate(footer);
    if (focus) {
      feedback.tabIndex = -1;
      feedback.focus({ preventScroll: true });
      feedback.scrollIntoView({ block: "nearest", behavior: "auto" });
    }
  }

  function answerChoices({ focus = true } = {}) {
    const state = current();
    if (!state) return;
    const card = openModal("Answer", "answer", true);
    if (!state.outcome && state.attempts > 0)
      card.append(
        element(
          "div",
          "casechat-modal__dxHint",
          state.attempts === 2
            ? "You only get 2 attempts"
            : `Attempts left: ${state.attempts}`,
        ),
      );
    const choices = element("div");
    renderChoices(choices);
    const feedback = answerFeedback(state);
    if (state.outcome) appendCaseNavigation(feedback);
    card.append(choices, feedback);
    translate(card);
    if (focus) {
      if (state.outcome)
        card
          .querySelector(".casechat-case-navigation button:not(:disabled)")
          ?.focus({ preventScroll: true });
      else focusModal();
    }
  }

  function finish(ok, message, answer) {
    const state = current();
    if (!state || state.outcome) return;
    stop();
    state.outcome = { ok, message, answer };
    while (state.revealed < state.item.lines.length) revealHistoryLine(state);
    setLessonProgress(page.id, (completed().length / pool.length) * 100);
    if (primary) {
      inlineChoices.hidden = false;
      renderChoices(inlineChoices, true);
      primaryResult();
    } else answerChoices();
  }

  function renderCase() {
    stop();
    log.replaceChildren();
    reviewMode = false;
    started = true;
    const state = current();
    if (advanced) state.revealed = state.item.lines.length;
    page.dataset.caseId = state.item.id;
    const header = bubble(`Case ${index + 1} (${index + 1}/${pool.length})`);
    header.classList.add("cataract-quiz-case-heading");
    bubble("Look at both eyes and read the patient's history.");
    log.append(images(state.item));
    // Reserve every line's final height so Submit Answer stays in its final
    // position while the clinician's history is progressively revealed.
    historyBubbles = state.item.lines.map((line, i) => {
      const node = bubble(eyeCopy(line), "bot");
      if (i >= state.revealed) {
        node.classList.add("casechat-bubble--pending");
        node.setAttribute("aria-hidden", "true");
      }
      return node;
    });
    inlineChoices = null;
    if (primary) {
      inlineChoices = element("div", "cataract-quiz-inline-choices");
      inlineChoices.hidden = state.revealed < state.item.lines.length;
      log.append(inlineChoices);
      if (!inlineChoices.hidden) renderChoices(inlineChoices, true);
    }
    submit = button(
      "Submit Answer",
      "casechat-confirm__btn is-ok cataract-quiz-submit",
      () => {
        if (primary && !state.outcome) gradeAnswer(state.selected);
        else answerChoices();
      },
    );
    if (primary) {
      submit.disabled =
        !state.outcome && (inlineChoices.hidden || !state.selected);
    }
    footer.replaceChildren(submit);
    renderTimer();
    translate(log);
    resume();
    page.scrollIntoView({ block: "start" });
    if (state.outcome) {
      if (primary) primaryResult({ focus: false });
      else answerChoices();
    }
  }

  function returnToFolder() {
    closeModal({ restoreFocus: false });
    showPage?.("interactiveLearningPage");
    const folder = document.querySelector(
      '#interactiveLearningPage [data-folder="cataract"]',
    );
    if (folder?.getAttribute("aria-expanded") !== "true") folder?.click();
  }

  function review() {
    reviewMode = true;
    closeModal({ restoreFocus: false });
    stop();
    log.replaceChildren();
    footer.replaceChildren();
    log.append(scoreSummary());
    sessions.forEach(({ item, outcome }, i) => {
      const section = element("section", "cataract-quiz-review");
      section.append(
        element(
          "h3",
          "",
          `Case ${i + 1} · ${outcome?.ok ? "Correct" : "Incorrect"}`,
        ),
        images(item),
      );
      const history = element("div", "cataract-quiz-review-history");
      history.append(element("h4", "", "Patient history"));
      item.lines.forEach((line) => bubble(eyeCopy(line), "bot", history));
      const response = element("div", "cataract-quiz-review-response");
      response.classList.toggle("is-correct", Boolean(outcome?.ok));
      response.append(
        element("h4", "", "Your answer"),
        element("p", "", outcome?.answer || "No answer"),
      );
      const explanation = answerFeedback({ item, outcome });
      explanation.classList.add("cataract-quiz-review-explanation");
      explanation.prepend(element("h4", "", "Answer and explanation"));
      section.append(history, response, explanation);
      log.append(section);
    });
    log.append(
      button("Restart", "casechat-nextcase", restart),
      button("Back to Cataract", "casechat-nextcase", returnToFolder),
    );
    translate(log);
    page.scrollIntoView({ block: "start" });
  }

  function scoreSummary() {
    const summary = element("p", "casechat-resultWhy cataract-quiz-score");
    summary.append(
      element("span", "", "You got"),
      document.createTextNode("\u00a0"),
      element(
        "strong",
        "cataract-quiz-score-correct",
        `${score()} out of ${pool.length} correct.`,
      ),
    );
    return summary;
  }

  function completion() {
    stop();
    const card = openModal("All Cases Completed", "completion");
    card.append(scoreSummary());
    const actions = element(
      "div",
      "casechat-confirm__actions cataract-quiz-completion-actions",
    );
    actions.append(
      button("Review", "casechat-confirm__btn", review),
      button("Restart", "casechat-confirm__btn is-ok", restart),
      button("Quit", "casechat-confirm__btn is-cancel", returnToFolder),
    );
    card.append(actions);
    focusModal();
  }

  function restart() {
    closeModal({ restoreFocus: false });
    stop();
    pool = shuffle(CATARACT_QUIZ_CASES);
    sessions = makeSessions();
    index = 0;
    renderCase();
  }

  function intro(step = 0) {
    const steps = [
      [
        "Compare both eyes",
        advanced
          ? "Drag the viewing window over each Back of Eye image to explore the retina. You can also use the arrow keys."
          : "Check the reflex and retina",
        "eyes",
      ],
      ["Read the history", "Look for the key clues", "history"],
      [
        "Choose your answer",
        primary
          ? "No time limit · 2 attempts per case. After the history appears, choose an answer below it, then press Submit Answer."
          : `${config.seconds} seconds · 2 attempts per case`,
        "answer",
      ],
    ];
    const [title, hint, visual] = steps[step];
    const card = openModal(`Cataract Quiz · ${config.name}`, "intro");
    card.dataset.step = String(step + 1);
    const dots = element("div", "cataract-quiz-intro-dots");
    dots.setAttribute("aria-label", `Step ${step + 1} of ${steps.length}`);
    steps.forEach((_, i) =>
      dots.append(element("span", i === step ? "is-current" : "")),
    );
    const preview = element("div", `cataract-quiz-intro-visual is-${visual}`);
    preview.setAttribute("aria-hidden", "true");
    if (visual === "eyes") {
      const reflex = element("img");
      reflex.src = CATARACT_QUIZ_IMAGES.fundal.normal;
      reflex.alt = "";
      const retinaPair = element("div", "cataract-quiz-intro-retinas");
      for (const side of ["right", "left"]) {
        const retina = element("img", side === "left" ? "is-mirrored" : "");
        retina.src = CATARACT_QUIZ_IMAGES.back.normal;
        retina.alt = "";
        if (advanced) {
          const demo = element("div", "cataract-quiz-intro-viewer");
          demo.append(
            retina,
            element(
              "div",
              "cataract-quiz-viewing-window cataract-quiz-demo-window",
            ),
          );
          if (side === "right")
            demo.append(element("span", "cataract-quiz-demo-hand", "☝"));
          retinaPair.append(demo);
        } else retinaPair.append(retina);
      }
      preview.append(reflex, retinaPair);
    } else if (visual === "history") {
      [
        "This patient is 74 years old",
        "Gradual blur in both eyes",
        "No pain or redness",
      ].forEach((line) =>
        preview.append(element("div", "cataract-quiz-intro-bubble", line)),
      );
    } else {
      const stats = element("div", "cataract-quiz-intro-stats");
      stats.append(
        element(
          "span",
          "cataract-quiz-intro-clock",
          primary ? "∞" : `${config.seconds}s`,
        ),
        element("span", "cataract-quiz-intro-attempts", "2 tries"),
      );
      const options = element("div", "cataract-quiz-intro-options");
      ["Nuclear cataract", "Cortical cataract", "Subcapsular cataract"].forEach(
        (label, i) => {
          const row = element(
            "div",
            `casechat-dxitem${i === 1 ? " is-demo-selected" : ""}`,
          );
          row.append(
            element("span", "casechat-radio"),
            element("span", "casechat-dxlabel", label),
          );
          options.append(row);
        },
      );
      options.append(element("span", "cataract-quiz-intro-pointer"));
      preview.append(stats, options);
    }
    card.append(
      dots,
      preview,
      element("span", "cataract-quiz-intro-step", `STEP ${step + 1}`),
      element("h3", "cataract-quiz-intro-title", title),
      element("p", "cataract-quiz-intro-hint", hint),
    );
    const actions = element("div", "cataract-quiz-intro-actions");
    const back = button("Back", "cataract-quiz-intro-back", () =>
      intro(step - 1),
    );
    back.disabled = step === 0;
    const next = button(
      step === 2 ? "Start" : "Next",
      "casechat-confirm__btn is-ok",
      () => {
        if (step < 2) intro(step + 1);
        else {
          closeModal({ restoreFocus: false });
          renderCase();
        }
      },
    );
    actions.append(back, next);
    card.append(actions);
    translate(card);
    next.focus({ preventScroll: true });
  }

  function modalKeyboard(event) {
    if (modal.hidden) return;
    if (event.key === "Escape" && modalMode === "answer") {
      event.preventDefault();
      closeModal();
      return;
    }
    if (
      ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(event.key) &&
      event.target.matches('[role="radio"]')
    ) {
      event.preventDefault();
      const radios = [
        ...modalCard.querySelectorAll('[role="radio"]:not(:disabled)'),
      ];
      const offset = ["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1;
      radios[
        (radios.indexOf(event.target) + offset + radios.length) % radios.length
      ]?.focus();
    }
    if (event.key !== "Tab") return;
    const buttons = [...modalCard.querySelectorAll("button:not(:disabled)")];
    const first = buttons[0],
      last = buttons.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
  modal.addEventListener("keydown", modalKeyboard);
  function visibility() {
    if (document.hidden) stop();
    else resume();
  }
  document.addEventListener("visibilitychange", visibility);
  return {
    page,
    setActive(value) {
      active = value;
      if (!value) {
        stop();
        return;
      }
      try {
        sessionStorage.setItem(
          "interactiveLearning:returnTarget",
          JSON.stringify({
            routeName: "videos",
            subPageId: "interactiveLearningPage",
          }),
        );
        sessionStorage.setItem("interactiveLearning:cataractFolderOpen", "1");
      } catch {}
      if (!started) intro();
      else resume();
    },
    dispose() {
      stop();
      document.removeEventListener("visibilitychange", visibility);
    },
  };
}
