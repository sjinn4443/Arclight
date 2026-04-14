// FILE: public/js/behavioursquiz.js
// Simple: inject quiz into existing #behavioursquizPage only (no page creation, no appRoot append)
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

export function initializeBehavioursQuiz() {
  const mount = document.getElementById("behavioursquizPage");
  if (!mount) return;

  initializeChildhoodWorkshopProgressInfra();

  // prevent double-build
  if (mount.dataset.built === "1") return;
  mount.dataset.built = "1";

  const LETTERS = ["A", "B", "C", "D"];

  const questions = [
    {
      q: "1. This 2 year old child is visually impaired. What characteristic behaviour of visual impairment is she displaying ?",
      img: "/images/quiz/workshop/childhood/vi1.png",
      options: [
        "Not fixing & following",
        "Light Staring",
        "Eye Poking",
        "Closing rye to bright light",
      ],
      answer: 1, // B
    },
    {
      q: "2. This 3 year old child is visually impaired. What characteristic behaviour of visual impairment is he displaying ?",
      img: "/images/quiz/workshop/childhood/vi2.png",
      options: [
        "Squeezing eyes to light",
        "Light Staring",
        "Eye Poking",
        "Not fixing & following",
      ],
      answer: 3, // D
    },
    {
      q: "3. This 2 year old child is visually impaired. What characteristic behaviour of visual impairment is he displaying ?",
      img: "/images/quiz/workshop/childhood/vi3.png",
      options: [
        "Not fixing & following",
        "Light Staring",
        "Eye Poking",
        "Closing Eyes to Bright Light",
      ],
      answer: 2, // C
    },
    {
      q: "4. This child cannot fix on faces and return a silent smile. Based on your observations what answer below most likely describes the reason for the poor vision?",
      img: "/images/quiz/workshop/childhood/vi4.png",
      options: [
        "Congenital Glaucoma & Cataract",
        "Retinoblastoma & Glaucoma",
        "Cataract & Cerebral Visual Impairment",
        "Refractive error & cataract",
      ],
      answer: 2, // C
    },
    {
      q: "5. This child cannot fix on faces and return a silent smile. Based on your observations what answer below most likely describes the reason for the poor vision?",
      img: "/images/quiz/workshop/childhood/vi5.png",
      options: [
        "Congenital Glaucoma",
        "Congenital Cataract",
        "Refractive error",
        "Cerebral Visual Impairment",
      ],
      answer: 3, // D
    },
    {
      q: "6. This is the left eye of a child with Nystagmus and visual impairment. Both eyes are affected in the same way. Based on your observations what answer below most likely describes the reason for the poor vision?",
      img: "/images/quiz/workshop/childhood/vi6.png",
      options: [
        "Congenital Glaucoma & Cataract",
        "Retinoblastoma & Glaucoma",
        "Cataract & Cerebral Visual Impairment",
        "Corneal scar & cataract",
      ],
      answer: 3, // D
    },
    {
      q: "7. This child has two conditions. Based on your observations what answer below most likely describes the conditions?",
      img: "/images/quiz/workshop/childhood/vi7.jpg",
      options: [
        "Congenital Glaucoma & Cataract",
        "Cataract & Squint",
        "Cataract & Cerebral Visual Impairment",
        "Corneal scar & cataract",
      ],
      answer: 1, // B
    },
  ];

  const layoutTemplate = document.getElementById(
    "behavioursQuizLayoutTemplate",
  );
  const blockTemplate = document.getElementById("behavioursQuizBlockTemplate");
  const optionTemplate = document.getElementById(
    "behavioursQuizOptionTemplate",
  );

  if (!layoutTemplate || !blockTemplate || !optionTemplate) return;

  mount.textContent = "";
  mount.appendChild(layoutTemplate.content.cloneNode(true));

  const form = mount.querySelector("#behavioursQuizForm");
  if (!form) return;

  const updateProgressFromAnswers = () => {
    const answered = questions.reduce((count, _q, index) => {
      const checked = form.querySelector(`input[name="q${index}"]:checked`);
      return count + (checked ? 1 : 0);
    }, 0);
    const inProgressPercent = (answered / questions.length) * 90;
    setChildhoodLessonProgress("behavioursquizPage", inProgressPercent);
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

    const scoreText = mount.querySelector("#behavioursQuizScoreText");
    if (scoreText) {
      scoreText.textContent = "";
      const scoreLine = document.createElement("span");
      setScoreSummary(scoreLine, score, questions.length);
      scoreText.appendChild(scoreLine);
      scoreText.appendChild(document.createElement("br"));
      const hint = document.createElement("small");
      hint.className = "quiz-hint";
      hint.textContent = "Answers are highlighted in green.";
      scoreText.appendChild(hint);
      translateNode(scoreText);
    }
    setChildhoodLessonProgress("behavioursquizPage", 100);
    mount.querySelector("#behavioursQuizModal").classList.remove("hidden");
  });

  mount.querySelector("#behavioursSeeWhyBtn").addEventListener("click", () => {
    mount.querySelector("#behavioursQuizModal").classList.add("hidden");
    mount
      .querySelectorAll(".answer")
      .forEach((a) => (a.style.display = "block"));
  });

  translateNode(mount);
}
