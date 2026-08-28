import {
  setLessonProgress,
  updateLessonProgressRows,
} from "./lessonProgress.js";

export const MEDICAL_STUDENTS_TEST_QUIZZES = Object.freeze({
  visualAcuity: {
    pageId: "medicalVisualAcuityTestPage",
    questions: [
      {
        prompt:
          "The vision of a patient has been recorded as 6/60 in their right eye. What was the most likely distance between the patient and the chart when their vision was tested?",
        options: ["60 metres", "3 metres", "6 metres", "0.1 metres"],
        answerIndex: 2,
        explanation:
          "Snellen acuity is recorded as distance tested / line seen. Therefore, 6/60 means the patient was tested at 6 metres from the chart and saw line 60, typically the largest letter at the top of the chart.",
      },
      {
        prompt:
          "A patient was found to have visual acuity unaided of 6/24 but when tested with a pinhole it improved to 6/9. What is the most likely reason for this?",
        options: ["Myopia", "Cataract", "Glaucoma", "Presbyopia"],
        answerIndex: 0,
        explanation:
          "If visual acuity improves when looking through a pinhole, the most likely reason is a refractive error such as myopia. Narrow parallel rays of light entering the eye are much less affected by refractive surfaces, so they pass through to the retina still in focus.",
      },
      {
        prompt:
          "When testing vision the patient could not see the biggest letter on the top line. What is the next step in testing their vision?",
        options: [
          "Test the fellow eye",
          "Try counting fingers or hand movements",
          "Move the chart closer to the patient",
          "Ask the patient to look through a pinhole",
        ],
        answerIndex: 2,
        explanation:
          "If the patient cannot see the largest letter on the top line, halve the testing distance and see whether this allows them to see any letters. For example, if they cannot see line 60 at 6 metres, move to 3 metres. If they can then see the top line, record the visual acuity as 3/60.",
      },
      {
        prompt:
          "A patient read line ‘6’ on a chart when tested at 3 metres. Which visual acuity below records this most accurately?",
        options: ["6/12", "3/12", "3/60", "6/3"],
        answerIndex: 0,
        explanation:
          "This patient has visual acuity of 3/6 (distance tested / line seen). The equivalent visual acuity would be 6/12, which is the same ratio and so is the most accurate.",
      },
      {
        prompt:
          "A patient’s visual acuity was recorded as NPL in the right eye and 6/6 in the left eye. What sight impairment category would they meet?",
        options: [
          "Subnormal Vision",
          "Severely Sight Impaired (SSI)",
          "Normal Vision",
          "Blind",
        ],
        answerIndex: 2,
        explanation:
          "Sight impairment categories are based on binocular vision. Even if someone is ‘blind’ in one eye, if they have normal vision in the other eye they are categorised as having normal vision.",
      },
    ],
  },
  pupils: {
    pageId: "medicalPupilsTestPage",
    questions: [
      {
        prompt: "What is the technique used to test for an RAPD?",
        options: [
          "The direct light test",
          "The indirect light test",
          "The swinging light test",
          "The light test",
        ],
        answerIndex: 2,
        explanation:
          "There are three ways to test the pupil light response: direct, by viewing the pupil on which the light is shining; indirect or consensual, by observing the fellow pupil; and the swinging light test, by observing the pupil as the light arrives to look for an RAPD.",
      },
      {
        prompt: "What does RAPD stand for?",
        options: [
          "Rapid Afferent Pupil Defect",
          "Relatively Affective Pupil Defect",
          "Relative Afferent Pupil Defect",
          "Relative Affective Pupil Defective",
        ],
        answerIndex: 2,
        explanation:
          "RAPD is tested using the swinging light test. This lets the examiner compare the afferent systems of both eyes while examining one eye, making it a relative way to identify whether one afferent system is defective compared with the other.",
      },
      {
        prompt: "What is the clinical sign seen in an RAPD?",
        options: [
          "Poor constriction of the pupil when light is shone on it",
          "Dilation of the pupil when light is shone on it",
          "No constriction when the light is shone on it",
          "Dilation of the pupil when light is shone on the other eye",
        ],
        answerIndex: 1,
        explanation:
          "The pupil will typically constrict when light is shone on it. During the swinging light test, paradoxical dilation when the light reaches an eye indicates that an RAPD is present on that side.",
      },
      {
        prompt:
          "When we test for an RAPD what parts of the visual pathway are we assessing?",
        options: [
          "The occipital lobe (vision centre) of the brain",
          "The visual pathways from the midbrain to the occipital lobe",
          "The retina and optic nerve",
          "The lens, retina and optic nerve",
        ],
        answerIndex: 2,
        explanation:
          "The retina and optic nerve form the anterior parts of the afferent system, taking information from the eye to the midbrain to initiate the motor or efferent response that changes pupil size.",
      },
      {
        prompt: "What can cause an RAPD?",
        options: [
          "Cataract",
          "Cerebrovascular Accident (stroke)",
          "Posterior Capsule Opacification",
          "Central Retinal Vein Occlusion",
        ],
        answerIndex: 3,
        explanation:
          "Any disease of the retina or optic nerve that affects its afferent function can lead to an RAPD, including a vascular event affecting the retina.",
      },
    ],
  },
  fundalReflex: {
    pageId: "medicalFundalReflexTestPage",
    questions: [
      {
        prompt:
          "Which of the following is the main purpose of the fundal ‘red’ reflex test in a newborn baby?",
        options: [
          "Test visual acuity",
          "Identify disease obstructing the visual axis",
          "Assess the health of the optic nerve",
          "Look for ocular misalignment",
        ],
        answerIndex: 1,
        explanation:
          "In a newborn, the main purpose is to identify disease blocking light from entering the eye. This can include disease of the cornea, lens, vitreous, retina or optic nerve.",
      },
      {
        prompt:
          "A 3-month-old infant has a bright fundal ‘red’ reflex in the left eye but a much duller reflex in the right eye. What is the most appropriate action?",
        options: [
          "Reassure the parents",
          "Repeat the test in 3 months",
          "Arrange urgent referral to an eye specialist",
          "Arrange routine referral to an eye specialist",
        ],
        answerIndex: 2,
        explanation:
          "Any abnormality on this test requires urgent assessment by an eye specialist because serious disease, such as cataract or retinoblastoma, may be present.",
      },
      {
        prompt:
          "A 9-month-old baby born at 36 weeks’ gestation presents with poor visual development and absent fundal reflexes in both eyes. What is the most likely cause of these findings?",
        options: [
          "Occipital lobe stroke",
          "Retinoblastoma",
          "Cataract",
          "Retinopathy of Prematurity",
        ],
        answerIndex: 2,
        explanation:
          "Loss of the fundal reflex is caused by something blocking light entering the eye. Retinopathy of Prematurity can cause retinal detachment, but is more common in babies born before 34 weeks. Retinoblastoma can cause loss of the reflex but is very rare, occurring in around 1 in 15,000 births. Cataract is the most common cause in babies and infants, occurring in around 1 in every 1,000 to 2,000 births.",
      },
      {
        prompt:
          "Which of the following conditions in an adult is least likely to cause an abnormal fundal ‘red’ reflex?",
        options: [
          "Cataract",
          "Vitreous Haemorrhage",
          "Corneal opacity",
          "Occipital lobe stroke",
        ],
        answerIndex: 3,
        explanation:
          "Occipital lobe stroke is least likely. Although it causes loss of vision, this results from brain damage rather than disease affecting the clarity of the ocular media.",
      },
      {
        prompt:
          "What structures, and in what order, does light pass through to illuminate the fundus and produce the fundal ‘red’ reflex?",
        options: [
          "Vitreous – Lens – Cornea",
          "Lens – Cornea – Vitreous",
          "Cornea – Lens – Vitreous – Retina",
          "Cornea – Lens – Vitreous",
        ],
        answerIndex: 2,
        explanation:
          "Light passes through the cornea, lens and vitreous to reach the retina, a clear membrane overlying the choroid of the fundus from which light is reflected. Disease of the cornea, lens, vitreous, retina or choroid can therefore cause an abnormal fundal reflex test.",
      },
    ],
  },
});

function translateNode(node) {
  try {
    window.I18N?.applyTranslations?.(node);
  } catch {
    void 0;
  }
}

function translate(path, fallback, variables = {}) {
  try {
    const translated = window.I18N?.t?.(path, fallback, variables) ?? fallback;
    return String(translated).replace(
      /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g,
      (_, key) => String(variables[key] ?? ""),
    );
  } catch {
    return String(fallback).replace(
      /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g,
      (_, key) => String(variables[key] ?? ""),
    );
  }
}

function setTranslatedText(element, path, fallback) {
  if (!element) return;
  element.setAttribute("data-i18n", path);
  element.textContent = translate(path, fallback);
}

function setScoreSummary(target, correct, total) {
  if (!target) return;
  target.textContent = translate(
    "medicalStudentsWorkshop.quizUi.scoreTemplate",
    "You got {{correct}} out of {{total}} correct.",
    { correct, total },
  );
}

function updateWorkshopProgressRows() {
  const workshop = document.getElementById("medicalStudentsWorkshopPage");
  if (!workshop) return;
  updateLessonProgressRows(workshop);
}

function setQuizProgress(pageId, percent) {
  setLessonProgress(pageId, percent);
  updateWorkshopProgressRows();
  document.dispatchEvent(
    new CustomEvent("medicalStudentsWorkshop:progress-changed", {
      detail: { target: pageId, percent },
    }),
  );
}

function initializeQuizPage(page, quiz) {
  if (!page || !quiz || page.dataset.wired === "1") return;
  page.dataset.wired = "1";

  const mount = page.querySelector(".medical-test-quiz-mount");
  const layoutTemplate = document.getElementById(
    "medicalTestQuizLayoutTemplate",
  );
  const cardTemplate = document.getElementById("medicalTestQuizCardTemplate");
  const optionTemplate = document.getElementById(
    "medicalTestQuizOptionTemplate",
  );
  if (!mount || !layoutTemplate || !cardTemplate || !optionTemplate) return;

  const questions = quiz.questions;
  const userAnswers = new Array(questions.length).fill(null);
  let submitted = false;

  mount.textContent = "";
  mount.appendChild(layoutTemplate.content.cloneNode(true));

  const progress = mount.querySelector(".medical-test-quiz-progress");
  const allQuestions = mount.querySelector(".medical-test-quiz-questions");
  const resultsButton = mount.querySelector(".medical-test-quiz-results");
  const modal = mount.querySelector(".medical-test-quiz-modal");
  const score = mount.querySelector(".medical-test-quiz-score");
  const reviewButton = mount.querySelector(".medical-test-quiz-review");
  const restartButton = mount.querySelector(".medical-test-quiz-restart");

  if (
    !progress ||
    !allQuestions ||
    !resultsButton ||
    !modal ||
    !score ||
    !reviewButton ||
    !restartButton
  ) {
    return;
  }

  function updateProgress() {
    const answered = userAnswers.filter((answer) => answer !== null).length;
    progress.textContent = `${answered} / ${questions.length}`;
    resultsButton.disabled = false;
    setQuizProgress(page.id, (answered / questions.length) * 90);
  }

  function renderAll() {
    allQuestions.textContent = "";
    setTranslatedText(
      resultsButton,
      submitted
        ? "medicalStudentsWorkshop.quizUi.seeResults"
        : "medicalStudentsWorkshop.quizUi.submitAnswers",
      submitted ? "See Results" : "Submit Answers",
    );

    questions.forEach((question, questionIndex) => {
      const questionKey = `medicalStudentsWorkshop.quiz.${page.dataset.medicalTestTopic}.questions.${questionIndex}`;
      const card = cardTemplate.content
        .querySelector(".quiz-card")
        .cloneNode(true);
      card.dataset.questionIndex = String(questionIndex);

      const number = card.querySelector(".quiz-card-number");
      const prompt = card.querySelector(".quiz-question");
      const options = card.querySelector(".options");
      const explanationAnswer = card.querySelector(".quiz-explanation-answer");
      const explanation = card.querySelector(".quiz-explanation-text");

      if (number)
        number.textContent = String(questionIndex + 1).padStart(2, "0");
      setTranslatedText(prompt, `${questionKey}.prompt`, question.prompt);
      if (explanationAnswer) {
        explanationAnswer.textContent = `${String.fromCharCode(
          65 + question.answerIndex,
        )}. ${question.options[question.answerIndex]}`;
      }
      setTranslatedText(
        explanation,
        `${questionKey}.explanation`,
        question.explanation,
      );

      question.options.forEach((optionLabel, optionIndex) => {
        const option = optionTemplate.content
          .querySelector(".opt")
          .cloneNode(true);
        const input = option.querySelector("input");
        const prefix = option.querySelector(".opt-prefix");
        const label = option.querySelector(".opt-label");
        const inputId = `${page.id}-q${questionIndex}-o${optionIndex}`;

        option.setAttribute("for", inputId);
        option.dataset.optionIndex = String(optionIndex);

        if (input) {
          input.id = inputId;
          input.name = `${page.id}-q${questionIndex}`;
          input.value = String(optionIndex);
          input.checked = userAnswers[questionIndex] === optionIndex;
        }
        if (prefix)
          prefix.textContent = `${String.fromCharCode(65 + optionIndex)}.`;
        setTranslatedText(
          label,
          `${questionKey}.options.${optionIndex}`,
          optionLabel,
        );

        options?.appendChild(option);
      });

      allQuestions.appendChild(card);
      translateNode(card);
    });

    allQuestions.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.addEventListener("change", (event) => {
        const input = event.currentTarget;
        const card = input.closest(".quiz-card");
        const questionIndex = Number(card?.dataset.questionIndex);
        if (!Number.isInteger(questionIndex)) return;
        userAnswers[questionIndex] = Number(input.value);
        updateProgress();
      });
    });

    updateProgress();
  }

  function closeModal() {
    modal.style.display = "none";
  }

  function showIncompleteSubmitPopup(firstUnansweredIndex) {
    window.alert(
      translate(
        "medicalStudentsWorkshop.quizUi.incomplete",
        "Please answer all {{count}} questions before submitting.",
        { count: questions.length },
      ),
    );
    const firstCard = allQuestions.querySelector(
      `[data-question-index="${firstUnansweredIndex}"]`,
    );
    firstCard?.scrollIntoView?.({ block: "center", behavior: "smooth" });
    firstCard
      ?.querySelector?.('input[type="radio"]')
      ?.focus?.({ preventScroll: true });
  }

  function openModal() {
    const correct = userAnswers.reduce(
      (total, answer, index) =>
        total + (answer === questions[index].answerIndex ? 1 : 0),
      0,
    );
    setScoreSummary(score, correct, questions.length);
    setTranslatedText(
      reviewButton,
      correct === questions.length
        ? "medicalStudentsWorkshop.quizUi.review"
        : "medicalStudentsWorkshop.quizUi.seeWhy",
      correct === questions.length ? "Review" : "See why",
    );
    translateNode(score);
    modal.style.display = "flex";
    setQuizProgress(page.id, 100);
  }

  function submitAnswers() {
    submitted = true;
    allQuestions.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.disabled = true;
    });
    setTranslatedText(
      resultsButton,
      "medicalStudentsWorkshop.quizUi.seeResults",
      "See Results",
    );
    setQuizProgress(page.id, 100);
  }

  function highlightAll() {
    questions.forEach((question, questionIndex) => {
      const chosen = userAnswers[questionIndex];
      const card = allQuestions.querySelector(
        `[data-question-index="${questionIndex}"]`,
      );
      const explanation = card?.querySelector(".quiz-explanation");
      if (explanation) explanation.hidden = false;
      card?.querySelectorAll(".opt").forEach((option) => {
        const optionIndex = Number(option.dataset.optionIndex);
        option.classList.remove("correct", "wrong");
        if (optionIndex === question.answerIndex)
          option.classList.add("correct");
        if (optionIndex === chosen && chosen !== question.answerIndex) {
          option.classList.add("wrong");
        }
      });
    });
    closeModal();
  }

  resultsButton.addEventListener("click", () => {
    if (submitted) {
      openModal();
      return;
    }

    const firstUnansweredIndex = userAnswers.findIndex(
      (answer) => answer === null,
    );
    if (firstUnansweredIndex !== -1) {
      showIncompleteSubmitPopup(firstUnansweredIndex);
      return;
    }
    submitAnswers();
    openModal();
  });

  reviewButton.addEventListener("click", highlightAll);
  restartButton.addEventListener("click", () => {
    userAnswers.fill(null);
    submitted = false;
    closeModal();
    renderAll();
  });
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  renderAll();
  translateNode(page);
}

export function initializeMedicalStudentsTestQuizzes() {
  document.querySelectorAll(".medical-test-quiz-page").forEach((page) => {
    const quiz = MEDICAL_STUDENTS_TEST_QUIZZES[page.dataset.medicalTestTopic];
    initializeQuizPage(page, quiz);
  });
  updateWorkshopProgressRows();
}
