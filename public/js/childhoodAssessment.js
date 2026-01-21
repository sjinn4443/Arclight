// FILE: public/js/childhoodAssessment.js
// Simple: inject quiz into existing #childhoodAssessmentQuizPage only (no page creation, no appRoot append)

export function initializeChildhoodAssessment() {
  const mount = document.getElementById("childhoodAssessmentQuizPage");
  if (!mount) return;

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

  // ✅ quiz-launcher.js CSS 재사용용: 같은 클래스 구조 사용
  mount.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-scroll">
        <form id="childhoodQuizForm"></form>
      </div>

      <div class="quiz-footer">
        <button type="submit" form="childhoodQuizForm" class="start-btn">See Results</button>
      </div>

      <div id="childhoodQuizModal" class="quiz-modal hidden">
        <div class="quiz-modal-content">
          <p id="childhoodQuizScoreText"></p>
          <button id="childhoodSeeWhyBtn">Check Answer</button>
        </div>
      </div>
    </div>
  `;

  const form = mount.querySelector("#childhoodQuizForm");

  questions.forEach((q, i) => {
    const correctLetter = LETTERS[q.answer] || "";
    let html = `<div class="quiz-block"><p>${escapeHtml(q.q)}</p>`;

    html += `
  <img class="quiz-image" src="${q.img}" alt="" loading="lazy" />
`;

    q.options.forEach((opt, j) => {
      html += `
        <label class="radio-label">
          <input type="radio" name="q${i}" value="${j}">
          <span>${LETTERS[j]}. ${escapeHtml(opt)}</span>
        </label>
      `;
    });

    html += `
      <p class="answer" style="display:none; margin-top:5px; font-style:italic;">
        Correct answer: ${correctLetter}. ${escapeHtml(q.options[q.answer])}
      </p>
    </div>`;

    form.insertAdjacentHTML("beforeend", html);
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

    mount.querySelector("#childhoodQuizScoreText").innerHTML =
      `You got ${score} out of ${questions.length} correct.<br>
   <small>Answers are highlighted in green.</small>`;

    mount.querySelector("#childhoodQuizModal").classList.remove("hidden");
  });

  mount.querySelector("#childhoodSeeWhyBtn").addEventListener("click", () => {
    mount.querySelector("#childhoodQuizModal").classList.add("hidden");
    mount
      .querySelectorAll(".answer")
      .forEach((a) => (a.style.display = "block"));
  });
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
