/**
 * @fileoverview Quiz launch and review helpers.
 */

export function initializeQuizzes() {
  try {
    initializeQuizzesImpl();
  } catch (error) {
    console.error(error);
  }
}

function initializeQuizzesImpl() {
  // Quiz logic is handled by the exported helpers below.
}

function translateNode(node) {
  try {
    window.I18N?.applyTranslations?.(node);
  } catch {
    void 0;
  }
}

function setCorrectAnswerLine(target, optionText) {
  if (!target) return;
  target.textContent = "";
  target.appendChild(document.createTextNode("Correct answer:"));
  target.appendChild(document.createTextNode(" "));
  target.appendChild(document.createTextNode(optionText));
}

function setScoreSummary(target, introText, correct, total) {
  if (!target) return;
  target.textContent = "";
  target.appendChild(document.createTextNode(introText));
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

function setCaseLabel(target, index) {
  if (!target) return;
  target.textContent = "";
  target.appendChild(document.createTextNode("Case"));
  target.appendChild(document.createTextNode(` ${index}`));
}

function setNumberedTitle(target, index, text) {
  if (!target) return;
  target.textContent = "";
  target.appendChild(document.createTextNode(`${index}. `));
  target.appendChild(document.createTextNode(text));
}

function _launchQuiz() {
  const previousPage =
    document.querySelector(".page.active")?.id || "dashboard";
  const quizPageId = "directOphthalmoscopyQuizPage";

  let quizPage = document.getElementById(quizPageId);
  const needsInit =
    !quizPage ||
    !quizPage.dataset.initialised ||
    quizPage.innerHTML.trim() === "";

  if (!quizPage) {
    quizPage = document.createElement("div");
    quizPage.id = quizPageId;
    quizPage.className = "page";

    const host =
      document.getElementById("page-content") ||
      document.querySelector(".page")?.parentElement ||
      document.body;
    host.appendChild(quizPage);
  }

  if (needsInit) {
    quizPage.dataset.initialised = "1";
    const layoutTemplate = document.getElementById("quizzesLayoutTemplate");
    if (layoutTemplate) {
      quizPage.replaceChildren(layoutTemplate.content.cloneNode(true));
    } else {
      const container = document.createElement("div");
      container.className = "quiz-container";

      const header = document.createElement("div");
      header.className = "quiz-header small";
      const headerRow = document.createElement("div");
      headerRow.className = "quiz-header-row centered";
      const title = document.createElement("h2");
      title.textContent = "Quiz";
      title.setAttribute("data-i18n", "auto.quizzes.quiz");
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
  }

  show(quizPageId);

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
  const blockTemplate = document.getElementById("quizzesBlockTemplate");
  const optionTemplate = document.getElementById("quizzesOptionTemplate");
  if (!quizForm) return;

  quizForm.textContent = "";
  questions.forEach((questionData, questionIndex) => {
    const block =
      blockTemplate?.content.firstElementChild?.cloneNode(true) ||
      document.createElement("div");
    block.classList.add("quiz-block");

    const question = block.querySelector(".quiz-question");
    if (question) question.textContent = questionData.q;

    const optionsWrap = block.querySelector(".quiz-options");
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

      if (optionsWrap) optionsWrap.appendChild(option);
      else block.appendChild(option);
    });

    const answer = block.querySelector(".answer");
    if (answer) {
      setCorrectAnswerLine(answer, questionData.options[questionData.answer]);
    }

    quizForm.appendChild(block);
  });

  translateNode(quizPage);
  translateNode(quizForm);

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
      setScoreSummary(scoreText, "You got", correct, questions.length);
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

function _renderQuestion(caseIndex, questionIndex) {
  const currentCase = cases[caseIndex];
  const questionData = currentCase.questions[questionIndex];

  setCaseLabel(elements.caseTitle, caseIndex + 1);
  elements.caseSubtitle.textContent = currentCase.title;
  elements.caseImage.src = currentCase.image;
  elements.caseImage.alt = "Case image";
  elements.quizForm.textContent = "";

  const questionTemplate = document.getElementById(
    "quizzesCaseQuestionTemplate",
  );
  const optionTemplate = document.getElementById("quizzesCaseOptionTemplate");
  const questionWrap =
    questionTemplate?.content.firstElementChild?.cloneNode(true) ||
    document.createElement("div");
  questionWrap.classList.add("question");

  const title =
    questionWrap.querySelector(".question-title") ||
    document.createElement("h3");
  setNumberedTitle(title, questionIndex + 1, questionData.question);
  if (!questionWrap.contains(title)) questionWrap.prepend(title);

  const optionsList =
    questionWrap.querySelector(".options") || document.createElement("ul");
  if (!questionWrap.contains(optionsList))
    questionWrap.appendChild(optionsList);

  questionData.options.forEach((optionText, optionIndex) => {
    const li =
      optionTemplate?.content.firstElementChild?.cloneNode(true) ||
      document.createElement("li");
    const input = li.querySelector("input") || document.createElement("input");
    const label = li.querySelector("label") || document.createElement("label");
    const inputId = `c${caseIndex}q${questionIndex}o${optionIndex}`;
    input.type = "radio";
    input.name = `q${questionIndex}`;
    input.id = inputId;
    input.value = String(optionIndex);
    label.setAttribute("for", inputId);
    label.textContent = optionText;
    if (!li.contains(input)) li.prepend(input);
    if (!li.contains(label)) li.appendChild(label);
    if (answers[caseIndex][questionIndex] === optionIndex) input.checked = true;
    input.onchange = () => {
      answers[caseIndex][questionIndex] = Number.parseInt(input.value, 10);
      updateButtons();
    };
    optionsList.appendChild(li);
  });

  elements.quizForm.appendChild(questionWrap);
  translateNode(questionWrap);
  updateButtons();
}

function updateButtons() {
  elements.prevQuestionBtn.disabled = currentQuestionIndex === 0;
  elements.nextQuestionBtn.disabled =
    currentQuestionIndex === cases[currentCaseIndex].questions.length - 1;
  const allAnswered = !answers[currentCaseIndex].some(
    (answer) => answer === null,
  );
  elements.nextCaseBtn.style.display = allAnswered ? "block" : "none";
}

function _showScore() {
  elements.quizCard.style.display = "none";
  elements.scoreCard.style.display = "block";

  let correctCount = 0;
  cases.forEach((currentCase, caseIndex) => {
    currentCase.questions.forEach((questionData, questionIndex) => {
      if (answers[caseIndex]?.[questionIndex] === questionData.correctIndex) {
        correctCount += 1;
      }
    });
  });

  const totalQuestions = cases.flatMap(
    (currentCase) => currentCase.questions,
  ).length;
  setScoreSummary(
    elements.scoreText,
    "You scored",
    correctCount,
    totalQuestions,
  );
  translateNode(elements.scoreText);
}

function _buildReview() {
  elements.reviewContent.textContent = "";
  const caseTemplate = document.getElementById("quizzesReviewCaseTemplate");
  const questionTemplate = document.getElementById(
    "quizzesReviewQuestionTemplate",
  );
  const optionTemplate = document.getElementById("quizzesReviewOptionTemplate");

  cases.forEach((currentCase, caseIndex) => {
    const caseDiv =
      caseTemplate?.content.firstElementChild?.cloneNode(true) ||
      document.createElement("div");
    caseDiv.classList.add("review-case");

    const caseTitle =
      caseDiv.querySelector(".review-case-title") ||
      document.createElement("h2");
    setCaseLabel(caseTitle, caseIndex + 1);
    if (!caseDiv.contains(caseTitle)) caseDiv.prepend(caseTitle);

    const subtitle =
      caseDiv.querySelector(".review-case-subtitle") ||
      document.createElement("div");
    subtitle.textContent = currentCase.title;
    if (!caseDiv.contains(subtitle)) caseDiv.appendChild(subtitle);

    const image =
      caseDiv.querySelector("img.case-image") || document.createElement("img");
    image.classList.add("case-image");
    image.src = currentCase.image;
    image.alt = "Case image";
    if (!caseDiv.contains(image)) caseDiv.appendChild(image);

    currentCase.questions.forEach((questionData, questionIndex) => {
      const questionDiv =
        questionTemplate?.content.firstElementChild?.cloneNode(true) ||
        document.createElement("div");
      questionDiv.classList.add("review-question");

      const questionTitle =
        questionDiv.querySelector(".review-question-title") ||
        document.createElement("h3");
      setNumberedTitle(questionTitle, questionIndex + 1, questionData.question);
      if (!questionDiv.contains(questionTitle))
        questionDiv.prepend(questionTitle);

      const optionsList =
        questionDiv.querySelector(".review-options") ||
        document.createElement("ul");
      if (!questionDiv.contains(optionsList))
        questionDiv.appendChild(optionsList);

      questionData.options.forEach((optionText, optionIndex) => {
        const li =
          optionTemplate?.content.firstElementChild?.cloneNode(true) ||
          document.createElement("li");
        li.classList.add("review-option");
        li.textContent = optionText;
        if (optionIndex === questionData.correctIndex)
          li.classList.add("correct");
        if (answers[caseIndex][questionIndex] === optionIndex) {
          li.classList.add("user-selected");
        }
        optionsList.appendChild(li);
      });

      caseDiv.appendChild(questionDiv);
      translateNode(questionDiv);
    });

    elements.reviewContent.appendChild(caseDiv);
    translateNode(caseDiv);
  });
}

(function exposeQuizLaunch() {
  window.launchQuiz = () => _launchQuiz();

  window.addEventListener("page:loaded", (event) => {
    const routeName = event?.detail?.routeName;
    if (routeName !== "quizzes") return;
    window.launchQuiz();
  });
})();
