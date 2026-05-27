function translateNode(node) {
  try {
    window.I18N?.applyTranslations?.(node);
  } catch {
    void 0;
  }
}

function ensureDirectQuizTopbar(page) {
  if (!page || page.querySelector(".direct-quiz-topbar")) return;
  page.classList.add("has-eyes-topbar");

  const topbar = document.createElement("div");
  topbar.className = "eyes-topbar direct-quiz-topbar";
  topbar.style.display = "none";
  topbar.innerHTML = `
    <div class="eyes-topbar__title" data-i18n="auto.quizzes.quiz">Quiz</div>
    <div class="eyes-topbar__icons">
      <span
        class="icon menuBtn"
        aria-label="Menu"
        data-i18n="i18nExtra.menu_aria_label:aria-label"
      >☰</span>
    </div>
  `;
  page.prepend(topbar);
}

const LEADING_QUESTION_NUMBER_RE =
  /^\s*[\d\uff10-\uff19\u0660-\u0669\u06f0-\u06f9\u0966-\u096f\u09e6-\u09ef\u0c66-\u0c6f]+(?:[.)\u0964\u06d4\uff0e\u3001:])?\s*/;

function removeQuestionNumber(target) {
  if (!target) return;
  target.textContent = target.textContent.replace(
    LEADING_QUESTION_NUMBER_RE,
    "",
  );
}

function removeQuestionNumbers(root) {
  root
    ?.querySelectorAll?.(".quiz-question")
    .forEach((question) => removeQuestionNumber(question));
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

    if (question.parentElement === block) {
      block.insertBefore(heading, question);
    } else {
      block.prepend(heading);
    }
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

function isNepaliLanguage() {
  try {
    return window.I18N?.getLanguage?.() === "ne";
  } catch {
    return document.documentElement?.getAttribute?.("lang") === "ne";
  }
}

function setCorrectAnswerLine(target, optionText) {
  if (!target) return;
  target.textContent = "";
  target.appendChild(document.createTextNode("Correct answer:"));
  target.appendChild(document.createTextNode(" "));
  target.appendChild(document.createTextNode(optionText));
}

function setScoreSummary(target, correct, total) {
  if (!target) return;
  target.textContent = "";
  if (isNepaliLanguage()) {
    const totalValue = document.createElement("b");
    totalValue.textContent = String(total);
    target.appendChild(totalValue);
    target.appendChild(document.createTextNode(" मध्ये "));
    const correctValue = document.createElement("b");
    correctValue.textContent = String(correct);
    target.appendChild(correctValue);
    target.appendChild(document.createTextNode(" सही गर्नुभयो।"));
    return;
  }
  target.appendChild(document.createTextNode("You got"));
  target.appendChild(document.createTextNode(" "));
  const correctValue = document.createElement("b");
  correctValue.textContent = String(correct);
  target.appendChild(correctValue);
  target.appendChild(document.createTextNode(" "));
  target.appendChild(document.createTextNode("out of"));
  target.appendChild(document.createTextNode(" "));
  const totalValue = document.createElement("b");
  totalValue.textContent = String(total);
  target.appendChild(totalValue);
  target.appendChild(document.createTextNode(" "));
  target.appendChild(document.createTextNode("correct."));
}

function _launchQuiz() {
  const previousPage =
    document.querySelector(".page.active")?.id || "dashboard";
  const quizPageId = "directOphthalmoscopyQuizPage";

  const show = (id) => {
    if (typeof window.showPage === "function") return window.showPage(id);
    if (typeof window.minimalShowPage === "function") {
      return window.minimalShowPage(id);
    }

    document
      .querySelectorAll(".page")
      .forEach((pageEl) => (pageEl.style.display = "none"));
    const el = document.getElementById(id);
    if (el) el.style.display = "block";
  };

  const existing = document.getElementById(quizPageId);
  if (existing) {
    const hasQuizUI = existing.querySelector?.(".quiz-container");
    if (hasQuizUI) {
      ensureDirectQuizTopbar(existing);
      show(quizPageId);
      translateNode(existing);
      return;
    }
  }

  const quizPage = existing || document.createElement("div");
  quizPage.id = quizPageId;
  quizPage.className = "page has-eyes-topbar";

  const layoutTemplate = document.getElementById("quizLauncherLayoutTemplate");
  if (layoutTemplate) {
    quizPage.replaceChildren(layoutTemplate.content.cloneNode(true));
  } else {
    const container = document.createElement("div");
    container.className = "quiz-container";

    const header = document.createElement("div");
    header.className = "quiz-header small";
    const headerRow = document.createElement("div");
    headerRow.className = "quiz-header-row centered";
    const backBtn = document.createElement("button");
    backBtn.id = "backToVideoBtn";
    backBtn.className = "back-icon";
    backBtn.title = "Go back";
    backBtn.setAttribute("data-i18n", "i18nLiteral.Go back:title");
    const title = document.createElement("h2");
    title.textContent = "Quiz";
    title.setAttribute("data-i18n", "auto.quizzes.quiz");
    headerRow.appendChild(backBtn);
    headerRow.appendChild(title);
    header.appendChild(headerRow);

    const scroll = document.createElement("div");
    scroll.className = "quiz-scroll";
    const form = document.createElement("form");
    form.id = "quizForm";
    scroll.appendChild(form);

    const footer = document.createElement("div");
    footer.className = "quiz-footer";
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.setAttribute("form", "quizForm");
    submitBtn.className = "start-btn";
    submitBtn.textContent = "See Results";
    submitBtn.setAttribute("data-i18n", "i18nExtra.see_results");
    footer.appendChild(submitBtn);

    const modal = document.createElement("div");
    modal.id = "quizModal";
    modal.className = "quiz-modal hidden";
    const modalContent = document.createElement("div");
    modalContent.className = "quiz-modal-content";
    const scoreText = document.createElement("p");
    scoreText.id = "quizScoreText";
    const whyBtn = document.createElement("button");
    whyBtn.id = "seeWhyBtn";
    whyBtn.textContent = "Check Answer";
    whyBtn.setAttribute("data-i18n", "i18nLiteral.Check Answer");
    modalContent.appendChild(scoreText);
    modalContent.appendChild(whyBtn);
    modal.appendChild(modalContent);

    container.appendChild(header);
    container.appendChild(scroll);
    container.appendChild(footer);
    container.appendChild(modal);
    quizPage.replaceChildren(container);
  }

  ensureDirectQuizTopbar(quizPage);

  if (!existing) {
    document.getElementById("appRoot")?.appendChild(quizPage);
  }

  const questions = [
    {
      q: "1. When starting direct ophthalmoscopy, what is the ideal distance between the examiner and the patient?",
      options: ["5 cm", "10 cm", "15 cm", "Arm's length"],
      answer: 3,
    },
    {
      q: "2. Which of the options describe the best condition to get the view of the retina?",
      options: [
        "Outdoors with bright sunlight, dilated pupil",
        "Dim room with dilated pupil",
        "Indoors with bright light, dilated pupil",
        "Dim room with constricted pupil",
      ],
      answer: 1,
    },
    {
      q: "3. Which eye should you use to examine the patient's right eye?",
      options: ["Left eye", "Either eye", "Right eye", "Dominant eye"],
      answer: 2,
    },
    {
      q: "4. During ophthalmoscopy, which part of the back of the eye should you identify first?",
      options: ["Macula", "Optic disc", "Retinal periphery", "Fovea"],
      answer: 1,
    },
    {
      q: "5. What is the name given to pale optic disc?",
      options: [
        "Normal finding",
        "Cataract",
        "Optic atrophy",
        "Raised intraocular pressure",
      ],
      answer: 2,
    },
    {
      q: "6. Which lighting condition is recommended for performing ophthalmoscopy with the Arclight?",
      options: [
        "Bright daylight",
        "Dim or darkened room",
        "Bright room",
        "Ambient light",
      ],
      answer: 1,
    },
    {
      q: "7. What does a cup-to-disc ratio (CDR) of 0.7 or greater typically suggest on fundus examination?",
      options: [
        "Glaucoma",
        "Macular degeneration",
        "Diabetic retinopathy",
        "Retinal detachment",
      ],
      answer: 0,
    },
  ];

  const quizForm = quizPage.querySelector("#quizForm");
  const blockTemplate = document.getElementById("quizLauncherBlockTemplate");
  const optionTemplate = document.getElementById("quizLauncherOptionTemplate");
  if (!quizForm) return;

  quizForm.textContent = "";
  questions.forEach((questionData, questionIndex) => {
    const block =
      blockTemplate?.content.firstElementChild?.cloneNode(true) ||
      document.createElement("div");
    block.classList.add("quiz-block");

    const { badge, question } = ensureQuestionHeading(block);
    badge.textContent = String(questionIndex + 1).padStart(2, "0");
    question.textContent = questionData.q;

    let optionsWrap = block.querySelector(".quiz-options");
    if (!optionsWrap) {
      optionsWrap = document.createElement("div");
      optionsWrap.className = "quiz-options";
      block.appendChild(optionsWrap);
    }

    questionData.options.forEach((optionText, optionIndex) => {
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
    setCorrectAnswerLine(answer, questionData.options[questionData.answer]);

    quizForm.appendChild(block);
  });

  translateNode(quizPage);
  translateNode(quizForm);
  removeQuestionNumbers(quizForm);

  quizForm.onsubmit = (event) => {
    event.preventDefault();
    let correct = 0;

    questions.forEach((questionData, questionIndex) => {
      const radios = quizForm.querySelectorAll(
        `input[name="q${questionIndex}"]`,
      );
      const answer = questionData.answer;
      let selected = null;

      radios.forEach((radio) => {
        radio.disabled = true;
        if (radio.checked) selected = Number.parseInt(radio.value, 10);
      });

      const block = radios[0]?.closest(".quiz-block");
      const labels = block?.querySelectorAll("label") || [];
      labels.forEach((label, index) => {
        if (index === answer) {
          label.classList.add("correct");
        } else if (
          Number.parseInt(label.querySelector("input")?.value || "", 10) ===
          selected
        ) {
          label.classList.add("wrong");
        }
      });

      if (selected === answer) correct += 1;
    });

    const scoreText = quizPage.querySelector("#quizScoreText");
    if (scoreText) {
      setScoreSummary(scoreText, correct, questions.length);
      scoreText.appendChild(document.createElement("br"));
      const note = document.createElement("small");
      note.textContent = "Answers are highlighted in green.";
      scoreText.appendChild(note);
      translateNode(scoreText);
    }

    quizPage.querySelector("#quizModal")?.classList.remove("hidden");
  };

  quizPage.querySelector("#seeWhyBtn")?.addEventListener("click", () => {
    quizPage.querySelector("#quizModal")?.classList.add("hidden");
    quizPage
      .querySelectorAll(".answer")
      .forEach((answerEl) => (answerEl.style.display = "block"));
  });

  quizPage.querySelector("#backToVideoBtn")?.addEventListener("click", () => {
    show(previousPage);
  });

  show(quizPageId);
}

window.launchQuiz = _launchQuiz;
