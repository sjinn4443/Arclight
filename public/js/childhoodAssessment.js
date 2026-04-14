// FILE: public/js/childhoodAssessment.js
// Simple: inject quiz into existing #childhoodAssessmentQuizPage only (no page creation, no appRoot append)
import {
  initializeChildhoodWorkshopProgressInfra,
  setChildhoodLessonProgress,
} from "./childhoodWorkshopProgress.js";

function translateNode(node) {
  try {
    window.I18N?.applyTranslations?.(node);
  } catch {
    void 0;
  }
}

function isNepaliLanguage() {
  try {
    return window.I18N?.getLanguage?.() === "ne";
  } catch {
    return document.documentElement?.getAttribute?.("lang") === "ne";
  }
}

function setCorrectAnswerLine(target, letter, optionText) {
  if (!target) return;
  target.textContent = "";
  target.appendChild(document.createTextNode("Correct answer:"));
  target.appendChild(document.createTextNode(" "));
  target.appendChild(document.createTextNode(`${letter}. `));
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

export function initializeChildhoodAssessment() {
  const mount = document.getElementById("childhoodAssessmentQuizPage");
  if (!mount) return;

  initializeChildhoodWorkshopProgressInfra();

  // prevent double-build
  if (mount.dataset.built === "1") return;
  mount.dataset.built = "1";

  const LETTERS = ["A", "B", "C", "D"];

  const questions = [
    {
      q: "1. What structure(s) is the yellow arrow pointing at",
      img: "/images/quiz/workshop/childhood/01.png",
      options: [
        "Lens & Cornea",
        "Retina",
        "Pupil & Cornea",
        "Conjunctiva & Sclera",
      ],
      answer: 3,
    },
    {
      q: "2. What structure is the yellow arrow pointing at?",
      img: "/images/quiz/workshop/childhood/02.png",
      options: ["Cornea", "Sclera", "Lens", "Conjunctiva"],
      answer: 2,
    },
    {
      q: "3. What structure is the yellow arrow pointing at?",
      img: "/images/quiz/workshop/childhood/03.png",
      options: ["Optic Nerve", "Retina", "Brain", "Conjunctiva"],
      answer: 0,
    },
    {
      q: "4. This is an Arclight device. The yellow arrow is pointing at one end of the device. What is the function of that end?",
      img: "/images/quiz/workshop/childhood/04.png",
      options: [
        "Direct Ophthalmoscope",
        "Anterior Segment Loupe",
        "Otoscope",
        "Pupillometer",
      ],
      answer: 0,
    },
    {
      q: "5. Describe the squint in the photograph",
      img: "/images/quiz/workshop/childhood/05.png",
      options: [
        "Right outward turning (exotropia)",
        "Left outward turning (exotropia)",
        "Left inward turning (esotropia)",
        "Right inward turning (esotropia)",
      ],
      answer: 2,
    },
    {
      q: "6. Describe the squint in the photograph",
      img: "/images/quiz/workshop/childhood/06.png",
      options: [
        "Right inward turning (esotropia)",
        "Right outward turning (exotropia)",
        "Left outward turning (exotropia)",
        "Left inward turning (esotropia)",
      ],
      answer: 0,
    },
    {
      q: "7. Describe the squint in the photograph",
      img: "/images/quiz/workshop/childhood/07.png",
      options: [
        "Right outward turning (exotropia)",
        "Right inward turning (esotropia)",
        "Left outward turning (exotropia)",
        "Left inward turning (esotropia)",
      ],
      answer: 1,
    },
    {
      q: "8. Describe the squint in the photograph",
      img: "/images/quiz/workshop/childhood/08.png",
      options: [
        "Right outward turning (exotropia)",
        "Right inward turning (esotropia)",
        "Left outward turning (exotropia)",
        "Left inward turning (esotropia)",
      ],
      answer: 3,
    },
    {
      q: "9. Describe the squint in the photograph",
      img: "/images/quiz/workshop/childhood/09.png",
      options: [
        "Right outward turning (exotropia)",
        "Right inward turning (esotropia)",
        "Left outward turning (exotropia)",
        "Left inward turning (esotropia)",
      ],
      answer: 2,
    },
  ];

  const layoutTemplate = document.getElementById(
    "childhoodAssessmentLayoutTemplate",
  );
  const blockTemplate = document.getElementById(
    "childhoodAssessmentBlockTemplate",
  );
  const optionTemplate = document.getElementById(
    "childhoodAssessmentOptionTemplate",
  );

  if (!layoutTemplate || !blockTemplate || !optionTemplate) return;

  mount.textContent = "";
  mount.appendChild(layoutTemplate.content.cloneNode(true));

  const form = mount.querySelector("#childhoodQuizForm");
  if (!form) return;

  const setAssessmentProgress = (percent, { mode = "max" } = {}) => {
    setChildhoodLessonProgress("childhoodAssessmentPage", percent, { mode });
    setChildhoodLessonProgress("childhoodAssessmentQuizPage", percent, {
      mode,
    });
  };

  const updateProgressFromAnswers = () => {
    const answered = questions.reduce((count, _q, index) => {
      const checked = form.querySelector(`input[name="q${index}"]:checked`);
      return count + (checked ? 1 : 0);
    }, 0);
    const inProgressPercent = (answered / questions.length) * 90;
    setAssessmentProgress(inProgressPercent);
  };

  questions.forEach((q, i) => {
    const block = blockTemplate.content
      .querySelector(".quiz-block")
      .cloneNode(true);
    const correctLetter = LETTERS[q.answer] || "";

    const question = block.querySelector(".quiz-question");
    if (question) question.textContent = q.q;

    const image = block.querySelector(".quiz-image");
    if (image) image.src = q.img;

    const optionsWrap = block.querySelector(".quiz-options");
    if (optionsWrap) {
      q.options.forEach((opt, j) => {
        const option = optionTemplate.content
          .querySelector(".radio-label")
          .cloneNode(true);
        const input = option.querySelector("input");
        if (input) {
          input.type = "radio";
          input.name = `q${i}`;
          input.value = String(j);
        }
        const text = option.querySelector(".quiz-option-text");
        if (text) {
          text.textContent = "";
          text.appendChild(document.createTextNode(`${LETTERS[j]}. `));
          text.appendChild(document.createTextNode(opt));
        }
        optionsWrap.appendChild(option);
      });
    }

    const answer = block.querySelector(".answer");
    if (answer) {
      setCorrectAnswerLine(answer, correctLetter, q.options[q.answer]);
    }

    form.appendChild(block);
    translateNode(block);
  });

  form.addEventListener("change", (e) => {
    if (!(e.target instanceof HTMLInputElement)) return;
    if (e.target.type !== "radio") return;
    updateProgressFromAnswers();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let score = 0;

    questions.forEach((q, i) => {
      const radios = form.querySelectorAll(`input[name="q${i}"]`);
      let selected = null;

      radios.forEach((r) => {
        r.disabled = true;
        if (r.checked) selected = Number(r.value);
      });

      const block = radios[0]?.closest(".quiz-block");
      if (!block) return;

      const labels = block.querySelectorAll("label");
      labels.forEach((label) => label.classList.remove("correct", "wrong"));

      labels.forEach((label) => {
        const val = Number(label.querySelector("input")?.value);
        if (val === q.answer) label.classList.add("correct");
        else if (val === selected) label.classList.add("wrong");
      });

      if (selected === q.answer) score += 1;
    });

    const scoreText = mount.querySelector("#childhoodQuizScoreText");
    if (scoreText) {
      scoreText.textContent = "";
      const scoreLine = document.createElement("span");
      setScoreSummary(scoreLine, score, questions.length);
      scoreText.appendChild(scoreLine);
      scoreText.appendChild(document.createElement("br"));
      const hint = document.createElement("small");
      hint.textContent = "Answers are highlighted in green.";
      scoreText.appendChild(hint);
      translateNode(scoreText);
    }

    setAssessmentProgress(100);
    mount.querySelector("#childhoodQuizModal").classList.remove("hidden");
  });

  mount.querySelector("#childhoodSeeWhyBtn").addEventListener("click", () => {
    mount.querySelector("#childhoodQuizModal").classList.add("hidden");
    mount
      .querySelectorAll(".answer")
      .forEach((a) => (a.style.display = "block"));
  });

  translateNode(mount);
}
