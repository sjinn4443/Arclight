// FILE: public/js/behavioursquiz.js
// Simple: inject quiz into existing #behavioursquizPage only (no page creation, no appRoot append)

export function initializeBehavioursQuiz() {
  const mount = document.getElementById("behavioursquizPage");
  if (!mount) return;

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

  // components.css quiz styles reused via classnames
  mount.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-scroll">
        <form id="behavioursQuizForm"></form>
      </div>

      <div class="quiz-footer">
        <button type="submit" form="behavioursQuizForm" class="start-btn">See Results</button>
      </div>

      <div id="behavioursQuizModal" class="quiz-modal hidden">
        <div class="quiz-modal-content">
          <p id="behavioursQuizScoreText"></p>
          <button id="behavioursSeeWhyBtn">Check Answer</button>
        </div>
      </div>
    </div>
  `;

  const form = mount.querySelector("#behavioursQuizForm");

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

    mount.querySelector("#behavioursQuizScoreText").innerHTML =
      `You got ${score} out of ${questions.length} correct.<br>
   <small class="quiz-hint">Answers are highlighted in green.</small>`;
    mount.querySelector("#behavioursQuizModal").classList.remove("hidden");
  });

  mount.querySelector("#behavioursSeeWhyBtn").addEventListener("click", () => {
    mount.querySelector("#behavioursQuizModal").classList.add("hidden");
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
