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

  // UI 주입
  mount.innerHTML = `
    <div class="quiz-header">
      <h3>Choose the correct diagnosis</h3>
      <div class="quiz-progress" id="gqProgress">0 / ${QUESTIONS.length}</div>
    </div>

    <div id="gqAllQuestions"></div>

    <div class="quiz-actions" style="margin-top: 16px;">
      <button class="btn primary" id="gqResults" type="button" disabled>See results</button>
    </div>

    <div class="modal-backdrop" id="gqModal">
      <div class="modal">
        <h3 id="gqScoreTitle">Results</h3>
        <p id="gqScoreText"></p>
        <div class="quiz-actions">
          <button class="btn secondary" id="gqReview" type="button">Review</button>
          <button class="btn primary" id="gqRestart" type="button">Restart</button>
        </div>
      </div>
    </div>
  `;

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
    allWrap.innerHTML = QUESTIONS.map((q, qi) => {
      const opts = optionsCache[qi];
      const name = `gq_${qi}`;
      const chosen = userAnswers[qi];

      const optionsHtml = opts
        .map((label, oi) => {
          const id = `${name}_${oi}`;
          const checked = chosen === label ? "checked" : "";
          return `
            <label class="opt" for="${id}" data-q="${qi}" data-value="${label}">
              <input id="${id}" type="radio" name="${name}" value="${label}" ${checked}/>
              <span>${label}</span>
            </label>
          `;
        })
        .join("");

      return `
        <div class="quiz-card" data-qwrap="${qi}" style="margin-bottom: 14px;">
          <div class="quiz-progress" style="margin-bottom: 10px; opacity: 0.75; font-weight: 700;
    --font-color: #000;
    font-size: 14px;">Case ${qi + 1}</div>

          <video
            class="quiz-video"
            autoplay
            muted
            playsinline
            preload="metadata"
          >

            <source src="${q.video}" type="video/mp4"/>
          </video>

          <div class="options" data-qopts="${qi}">
            ${optionsHtml}
          </div>
        </div>
      `;
    }).join("");

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
