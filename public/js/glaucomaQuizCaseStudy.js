// public/js/glaucomaQuizCaseStudy.js

export function initializeGlaucomaQuizCaseStudy() {
  const page = document.getElementById("glaucomaQuizCaseStudy");
  if (!page) return;

  if (page.dataset.wired === "1") return;
  page.dataset.wired = "1";

  const mount = page.querySelector("#glaucomaQuizMount");
  if (!mount) return;

  const LABELS = [
    "Normal",
    "Glaucoma",
    "NVD",
    "Temporal pallor",
    "Disc oedema",
    "Optic atrophy/pale disc-total",
    "Hypoplastic disc",
    "Myelinated nerve fibres",
  ];

  const QUESTIONS = [
    {
      video: "/videos/Workshop/Glaucoma/NormalAbnormal/case1_720p.mp4",
      answer: "Normal",
    },
    {
      video: "/videos/Workshop/Glaucoma/NormalAbnormal/case2_720p.mp4",
      answer: "Optic atrophy/pale disc-total",
    },
    {
      video: "/videos/Workshop/Glaucoma/NormalAbnormal/case3_720p.mp4",
      answer: "Disc oedema",
    },
    {
      video: "/videos/Workshop/Glaucoma/NormalAbnormal/case4_720p.mp4",
      answer: "Glaucoma",
    },
    {
      video: "/videos/Workshop/Glaucoma/NormalAbnormal/case5_720p.mp4",
      answer: "Disc oedema",
    },
    {
      video: "/videos/Workshop/Glaucoma/NormalAbnormal/case6_720p.mp4",
      answer: "NVD",
    },
    {
      video: "/videos/Workshop/Glaucoma/NormalAbnormal/case7_720p.mp4",
      answer: "Normal",
    },
    {
      video: "/videos/Workshop/Glaucoma/NormalAbnormal/case8_720p.mp4",
      answer: "Hypoplastic disc",
    },
    {
      video: "/videos/Workshop/Glaucoma/NormalAbnormal/case9_720p.mp4",
      answer: "Glaucoma",
    },
    {
      video: "/videos/Workshop/Glaucoma/NormalAbnormal/case10_720p.mp4",
      answer: "Temporal pallor",
    },
    {
      video: "/videos/Workshop/Glaucoma/NormalAbnormal/case11_720p.mp4",
      answer: "Myelinated nerve fibres",
    },
    {
      video: "/videos/Workshop/Glaucoma/NormalAbnormal/case12_720p.mp4",
      answer: "Optic atrophy/pale disc-total",
    },
  ];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildOptions(correct) {
    const pool = LABELS.filter((x) => x !== correct);
    const picks = shuffle(pool).slice(0, 3);
    return shuffle([correct, ...picks]);
  }

  // 각 문항의 보기(4개) 고정 캐시: 페이지 리렌더/리뷰에서도 바뀌지 않게
  const optionsCache = QUESTIONS.map((q) => buildOptions(q.answer));

  // 사용자가 선택한 답
  const userAnswers = new Array(QUESTIONS.length).fill(null);

  const layoutTemplate = document.getElementById("glaucomaQuizLayoutTemplate");
  if (!layoutTemplate) return;

  mount.textContent = "";
  mount.appendChild(layoutTemplate.content.cloneNode(true));

  const progressEl = mount.querySelector("#gqProgress");
  const allWrap = mount.querySelector("#gqAllQuestions");
  const resultsBtn = mount.querySelector("#gqResults");
  const modal = mount.querySelector("#gqModal");
  const scoreText = mount.querySelector("#gqScoreText");
  const reviewBtn = mount.querySelector("#gqReview");
  const restartBtn = mount.querySelector("#gqRestart");

  function updateProgress() {
    const answered = userAnswers.filter(Boolean).length;
    progressEl.textContent = `${answered} / ${QUESTIONS.length}`;
    resultsBtn.disabled = answered !== QUESTIONS.length;
  }

  function renderAll() {
    const cardTemplate = document.getElementById("glaucomaQuizCardTemplate");
    const optionTemplate = document.getElementById(
      "glaucomaQuizOptionTemplate",
    );
    if (!cardTemplate || !optionTemplate) return;

    allWrap.textContent = "";

    QUESTIONS.forEach((q, qi) => {
      const opts = optionsCache[qi];
      const name = `gq_${qi}`;
      const chosen = userAnswers[qi];

      const card = cardTemplate.content
        .querySelector(".quiz-card")
        .cloneNode(true);
      card.dataset.qwrap = String(qi);

      const cardProgress = card.querySelector(".quiz-card-progress");
      if (cardProgress) cardProgress.textContent = `Case ${qi + 1}`;

      const source = card.querySelector("source");
      if (source) source.src = q.video;

      const optionsWrap = card.querySelector(".options");
      if (optionsWrap) {
        optionsWrap.dataset.qopts = String(qi);
        opts.forEach((optLabel, oi) => {
          const id = `${name}_${oi}`;
          const opt = optionTemplate.content
            .querySelector(".opt")
            .cloneNode(true);
          opt.setAttribute("for", id);
          opt.dataset.q = String(qi);
          opt.dataset.value = optLabel;

          const input = opt.querySelector("input");
          if (input) {
            input.id = id;
            input.type = "radio";
            input.name = name;
            input.value = optLabel;
            input.checked = chosen === optLabel;
          }

          const labelSpan = opt.querySelector(".opt-label");
          if (labelSpan) labelSpan.textContent = optLabel;

          optionsWrap.appendChild(opt);
        });
      }

      allWrap.appendChild(card);
    });

    // 라디오 change 바인딩
    allWrap.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const name = e.target.name; // gq_0 같은 형태
        const idxStr = name.replace("gq_", "");
        const qi = Number(idxStr);

        userAnswers[qi] = e.target.value;
        updateProgress();
      });
    });

    updateProgress();
    // --- Reverse loop playback (ping-pong loop) ---
    allWrap.querySelectorAll("video.quiz-video").forEach((video) => {
      // 초기 상태: 정방향
      video.dataset.direction = "forward";
      video.playbackRate = 1;

      // 메타데이터 로드 후 duration 확보
      video.addEventListener("loadedmetadata", () => {
        // 아주 짧은 영상에서 끝 튐 방지
        video.currentTime = 0;
      });

      video.addEventListener("timeupdate", () => {
        if (!video.duration || isNaN(video.duration)) return;

        const epsilon = 0.05; // 경계 오차 방지용 (50ms)

        // ▶ 정방향 → 끝 도달 시 역방향
        if (
          video.dataset.direction === "forward" &&
          video.currentTime >= video.duration - epsilon
        ) {
          video.dataset.direction = "backward";
          video.playbackRate = -1;
        }

        // ◀ 역방향 → 처음 도달 시 정방향
        if (
          video.dataset.direction === "backward" &&
          video.currentTime <= epsilon
        ) {
          video.dataset.direction = "forward";
          video.playbackRate = 1;
        }
      });
    });
  }

  function openModal() {
    const total = QUESTIONS.length;
    const score = userAnswers.reduce((acc, ans, i) => {
      return acc + (ans === QUESTIONS[i].answer ? 1 : 0);
    }, 0);

    scoreText.textContent = `You got ${score} out of ${total} correct.`;
    modal.style.display = "flex";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  function highlightAll() {
    // 모든 문항의 모든 옵션 라벨을 돌면서 correct/wrong 클래스 부여
    for (let qi = 0; qi < QUESTIONS.length; qi++) {
      const correct = QUESTIONS[qi].answer;
      const chosen = userAnswers[qi];

      const optsWrap = allWrap.querySelector(`[data-qopts="${qi}"]`);
      if (!optsWrap) continue;

      const labels = optsWrap.querySelectorAll(".opt");
      labels.forEach((lab) => {
        const val = lab.getAttribute("data-value");
        lab.classList.remove("correct", "wrong");

        if (val === correct) lab.classList.add("correct");
        if (chosen && val === chosen && chosen !== correct)
          lab.classList.add("wrong");
      });
    }

    // 리뷰 클릭 시 사용자가 바로 확인할 수 있게 결과 버튼/모달 닫기
    closeModal();
  }

  resultsBtn.addEventListener("click", () => {
    openModal();
  });

  reviewBtn.addEventListener("click", () => {
    highlightAll();
  });

  restartBtn.addEventListener("click", () => {
    userAnswers.fill(null);
    closeModal();
    renderAll();
    // Restart 후에는 정답/오답 색을 제거해야 하므로, renderAll이 새로 그린 상태가 됨
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  renderAll();
}
