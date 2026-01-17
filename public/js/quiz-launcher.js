function _launchQuiz() {
  const previousPage =
    document.querySelector(".page.active")?.id || "dashboard";
  const quizPageId = "directOphthalmoscopyQuizPage";

  const show = (id) => {
    if (typeof window.showPage === "function") return window.showPage(id);
    if (typeof window.minimalShowPage === "function")
      return window.minimalShowPage(id);

    // 마지막 fallback (혹시 둘 다 없을 때)
    document
      .querySelectorAll(".page")
      .forEach((p) => (p.style.display = "none"));
    const el = document.getElementById(id);
    if (el) el.style.display = "block";
  };

  // Avoid creating duplicate quiz pages
  const existing = document.getElementById(quizPageId);
  if (existing) {
    // 이미 placeholder div가 있을 수 있으니, 내용이 없으면 채운다
    const hasQuizUI = existing.querySelector?.(".quiz-container");
    if (hasQuizUI) {
      show(quizPageId);
      return;
    }
    // 내용이 없으면 아래 로직으로 채우기 위해 계속 진행
  }

  const quizPage = existing || document.createElement("div");
  quizPage.id = quizPageId;
  quizPage.className = "page";
  quizPage.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-header small">
        <div class="quiz-header-row centered">
          <button id="backToVideoBtn" class="back-icon" title="Go back"></button>
          <h2>Quiz</h2>
        </div>
      </div>
      <div class="quiz-scroll"><form id="quizForm"></form></div>
      <div class="quiz-footer">
        <button type="submit" form="quizForm" class="start-btn">See Results</button>
      </div>
      <div id="quizModal" class="quiz-modal hidden">
        <div class="quiz-modal-content">
          <p id="quizScoreText"></p>
          <button id="seeWhyBtn">See why?</button>
        </div>
      </div>
    </div>`;
  if (!existing) {
    document.getElementById("appRoot").appendChild(quizPage);
  }

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
  questions.forEach((q, i) => {
    let block = `<div class="quiz-block"><p>${q.q}</p>`;
    q.options.forEach((opt, j) => {
      block += `<label class="radio-label"><input type="radio" name="q${i}" value="${j}" /><span>${opt}</span></label>`;
    });
    block += `<p class="answer" style="display:none; margin-top:5px; font-style:italic;">Correct answer: ${
      q.options[q.answer]
    }</p></div>`;
    quizForm.innerHTML += block;
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

window.launchQuiz = _launchQuiz;
