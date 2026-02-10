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
    const title = document.createElement("h2");
    title.textContent = "Quiz";
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
  const blockTemplate = document.getElementById("quizLauncherBlockTemplate");
  const optionTemplate = document.getElementById("quizLauncherOptionTemplate");
  if (!quizForm) return;
  quizForm.textContent = "";
  questions.forEach((q, i) => {
    const block =
      blockTemplate?.content.firstElementChild?.cloneNode(true) ||
      document.createElement("div");
    block.classList.add("quiz-block");

    let question = block.querySelector(".quiz-question");
    if (!question) {
      question = document.createElement("p");
      question.className = "quiz-question";
      block.appendChild(question);
    }
    question.textContent = q.q;

    let optionsWrap = block.querySelector(".quiz-options");
    if (!optionsWrap) {
      optionsWrap = document.createElement("div");
      optionsWrap.className = "quiz-options";
      block.appendChild(optionsWrap);
    }
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

    let answer = block.querySelector(".answer");
    if (!answer) {
      answer = document.createElement("p");
      answer.className = "answer";
      answer.style.display = "none";
      answer.style.marginTop = "5px";
      answer.style.fontStyle = "italic";
      block.appendChild(answer);
    }
    answer.textContent = `Correct answer: ${q.options[q.answer]}`;

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
    const scoreText = quizPage.querySelector("#quizScoreText");
    if (scoreText) {
      scoreText.textContent = `You got ${correct} out of ${questions.length} correct.`;
      const lineBreak = document.createElement("br");
      const note = document.createElement("small");
      note.textContent = "Answers are highlighted in green.";
      scoreText.appendChild(lineBreak);
      scoreText.appendChild(note);
    }
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
