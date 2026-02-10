/**
 * @fileoverview This file contains quizzes related functions and logic. Including launching quizzes, rendering questions, and displaying results.
 */

export function initializeQuizzes() {
  // placeholder for quiz logic

  try {
    initializeQuizzesImpl();
  } catch (e) {
    console.error(e);
  }
}

// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: initializeQuizzes, launchQuiz, renderQuestion, updateButtons, showScore, buildReview

function initializeQuizzesImpl() {
  // This function could be expanded if more quizzes are added.
  // For now, the quiz logic is self-contained in _launchQuiz and the IIFE.
}

function _launchQuiz() {
  const previousPage =
    document.querySelector(".page.active")?.id || "dashboard";
  const quizPageId = "directOphthalmoscopyQuizPage";

  // ✅ quizzes.html에 이미 있는 placeholder를 재사용하되,
  // 비어 있으면(처음 실행이면) 내용을 채운다.
  let quizPage = document.getElementById(quizPageId);

  const needsInit =
    !quizPage ||
    !quizPage.dataset.initialised ||
    quizPage.innerHTML.trim() === "";

  if (!quizPage) {
    quizPage = document.createElement("div");
    quizPage.id = quizPageId;
    quizPage.className = "page";

    // appRoot가 있으면 거기에, 없으면 body에 붙이기
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

  // ✅ 항상 퀴즈 페이지로 이동
  show(quizPageId);

  const questions = [
    {
      q: "1. When starting direct ophthalmoscopy, what is the ideal distance between the examiner and the patient?",
      options: ["5 cm", "10 cm", "15 cm", "Arm’s length"],
      answer: 3,
    },
    {
      q: "2. Which of the options describe the best condition to get the view of the retina?",
      options: [
        "Outdoors with bright sunlight, dilated pupil",
        "Deem room with dilated pupil",
        "Indoors with bright light, dilated pupil",
        "Deem room with constricted pupil",
      ],
      answer: 1,
    },
    {
      q: "3. Which eye should you use to examine the patient’s right eye?",
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
  questions.forEach((q, i) => {
    const block =
      blockTemplate?.content.firstElementChild?.cloneNode(true) ||
      document.createElement("div");
    block.classList.add("quiz-block");

    const question = block.querySelector(".quiz-question");
    if (question) question.textContent = q.q;

    const optionsWrap = block.querySelector(".quiz-options");
    q.options.forEach((opt, j) => {
      const option =
        optionTemplate?.content.firstElementChild?.cloneNode(true) ||
        document.createElement("label");
      option.classList.add("radio-label");

      const input =
        option.querySelector("input") || document.createElement("input");
      input.type = "radio";
      input.name = `q${i}`;
      input.value = String(j);

      const span =
        option.querySelector(".quiz-option-text") ||
        option.querySelector("span") ||
        document.createElement("span");
      span.textContent = opt;

      if (!option.contains(input)) option.prepend(input);
      if (!option.contains(span)) option.appendChild(span);

      if (optionsWrap) optionsWrap.appendChild(option);
      else block.appendChild(option);
    });

    const answer = block.querySelector(".answer");
    if (answer) {
      answer.textContent = `Correct answer: ${q.options[q.answer]}`;
    }

    quizForm.appendChild(block);
  });

  quizForm.onsubmit = (e) => {
    e.preventDefault();
    let correct = 0;
    questions.forEach((q, i) => {
      const radios = quizForm.querySelectorAll(`input[name="q${i}"]`);
      const answer = q.answer;
      let selected = null;
      radios.forEach((r) => {
        r.disabled = true;
        if (r.checked) selected = parseInt(r.value);
      });
      const labels = radios[0].closest(".quiz-block").querySelectorAll("label");
      labels.forEach((label, index) => {
        if (index === answer) label.classList.add("correct");
        else if (parseInt(label.querySelector("input").value) === selected)
          label.classList.add("wrong");
      });
      if (selected === answer) correct++;
    });
    quizPage.querySelector("#quizScoreText").innerText =
      `You got ${correct} out of ${questions.length} correct.`;
    quizPage.querySelector("#quizModal").classList.remove("hidden");
  };

  quizPage.querySelector("#seeWhyBtn").addEventListener("click", () => {
    quizPage.querySelector("#quizModal").classList.add("hidden");
    quizPage
      .querySelectorAll(".answer")
      .forEach((a) => (a.style.display = "block"));
  });

  quizPage.querySelector("#backToVideoBtn").addEventListener("click", () => {
    show(previousPage);
  });

  show(quizPageId);
}

function _renderQuestion(caseIndex, questionIndex) {
  const c = cases[caseIndex];
  const q = c.questions[questionIndex];
  elements.caseTitle.textContent = `Case ${caseIndex + 1}`;
  elements.caseSubtitle.textContent = c.title;
  elements.caseImage.src = c.image;
  elements.quizForm.textContent = "";
  const questionTemplate = document.getElementById(
    "quizzesCaseQuestionTemplate",
  );
  const optionTemplate = document.getElementById("quizzesCaseOptionTemplate");
  const div =
    questionTemplate?.content.firstElementChild?.cloneNode(true) ||
    document.createElement("div");
  div.classList.add("question");

  const title =
    div.querySelector(".question-title") || document.createElement("h3");
  title.textContent = `${questionIndex + 1}. ${q.question}`;
  if (!div.contains(title)) div.prepend(title);

  const optionsList =
    div.querySelector(".options") || document.createElement("ul");
  if (!div.contains(optionsList)) div.appendChild(optionsList);
  q.options.forEach((opt, optIndex) => {
    const li =
      optionTemplate?.content.firstElementChild?.cloneNode(true) ||
      document.createElement("li");
    const input = li.querySelector("input") || document.createElement("input");
    const label = li.querySelector("label") || document.createElement("label");
    const inputId = `c${caseIndex}q${questionIndex}o${optIndex}`;
    input.type = "radio";
    input.name = `q${questionIndex}`;
    input.id = inputId;
    input.value = String(optIndex);
    label.setAttribute("for", inputId);
    label.textContent = opt;
    if (!li.contains(input)) li.prepend(input);
    if (!li.contains(label)) li.appendChild(label);
    if (answers[caseIndex][questionIndex] === optIndex) input.checked = true;
    input.onchange = () => {
      answers[caseIndex][questionIndex] = parseInt(input.value);
      updateButtons();
    };
    optionsList.appendChild(li);
  });
  elements.quizForm.appendChild(div);
  updateButtons();
}

function updateButtons() {
  elements.prevQuestionBtn.disabled = currentQuestionIndex === 0;
  elements.nextQuestionBtn.disabled =
    currentQuestionIndex === cases[currentCaseIndex].questions.length - 1;
  const allAnswered = !answers[currentCaseIndex].some((a) => a === null);
  elements.nextCaseBtn.style.display = allAnswered ? "block" : "none";
}

function _showScore() {
  elements.quizCard.style.display = "none";
  elements.scoreCard.style.display = "block";
  let correctCount = 0;
  cases.forEach((c, caseIdx) => {
    c.questions.forEach((q, qIdx) => {
      if (answers[caseIdx]?.[qIdx] === q.correctIndex) correctCount++;
    });
  });
  elements.scoreText.textContent = `You scored ${correctCount} out of ${
    cases.flatMap((c) => c.questions).length
  } correct.`;
}

function _buildReview() {
  elements.reviewContent.textContent = "";
  const caseTemplate = document.getElementById("quizzesReviewCaseTemplate");
  const questionTemplate = document.getElementById(
    "quizzesReviewQuestionTemplate",
  );
  const optionTemplate = document.getElementById("quizzesReviewOptionTemplate");
  cases.forEach((c, caseIdx) => {
    const caseDiv =
      caseTemplate?.content.firstElementChild?.cloneNode(true) ||
      document.createElement("div");
    caseDiv.classList.add("review-case");

    const caseTitle =
      caseDiv.querySelector(".review-case-title") ||
      document.createElement("h2");
    caseTitle.textContent = `Case ${caseIdx + 1}`;
    if (!caseDiv.contains(caseTitle)) caseDiv.prepend(caseTitle);

    const subtitle =
      caseDiv.querySelector(".review-case-subtitle") ||
      document.createElement("div");
    subtitle.textContent = c.title;
    if (!caseDiv.contains(subtitle)) caseDiv.appendChild(subtitle);

    const image =
      caseDiv.querySelector("img.case-image") || document.createElement("img");
    image.classList.add("case-image");
    image.src = c.image;
    image.alt = c.title;
    if (!caseDiv.contains(image)) caseDiv.appendChild(image);

    c.questions.forEach((q, qIdx) => {
      const qDiv =
        questionTemplate?.content.firstElementChild?.cloneNode(true) ||
        document.createElement("div");
      qDiv.classList.add("review-question");

      const qTitle =
        qDiv.querySelector(".review-question-title") ||
        document.createElement("h3");
      qTitle.textContent = `${qIdx + 1}. ${q.question}`;
      if (!qDiv.contains(qTitle)) qDiv.prepend(qTitle);

      const optionsList =
        qDiv.querySelector(".review-options") || document.createElement("ul");
      if (!qDiv.contains(optionsList)) qDiv.appendChild(optionsList);

      q.options.forEach((opt, optIdx) => {
        const li =
          optionTemplate?.content.firstElementChild?.cloneNode(true) ||
          document.createElement("li");
        li.classList.add("review-option");
        li.textContent = opt;
        if (optIdx === q.correctIndex) li.classList.add("correct");
        if (answers[caseIdx][qIdx] === optIdx)
          li.classList.add("user-selected");
        optionsList.appendChild(li);
      });
      caseDiv.appendChild(qDiv);
    });
    elements.reviewContent.appendChild(caseDiv);
  });
}

// --- Make quiz launch callable from anywhere + auto-run on quizzes route ---
(function () {
  // expose for navigation.js (and old-style calls)
  window.launchQuiz = () => _launchQuiz();

  // when the quizzes route is loaded, immediately build + show the quiz UI
  window.addEventListener("page:loaded", (e) => {
    const routeName = e?.detail?.routeName;
    if (routeName !== "quizzes") return;

    // build + show the quiz page (fills #directOphthalmoscopyQuizPage)
    window.launchQuiz();
  });
})();
