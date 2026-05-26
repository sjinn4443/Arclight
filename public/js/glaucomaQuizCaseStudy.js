// public/js/glaucomaQuizCaseStudy.js
import {
  initializeGlaucomaWorkshopProgressInfra,
  setGlaucomaLessonProgress,
} from "./glaucomaWorkshopProgress.js";
import { setDiabeticLessonProgress } from "./diabeticWorkshopProgress.js";

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

function setCaseLabel(target, index) {
  if (!target) return;
  target.textContent = "";
  target.appendChild(document.createTextNode("Case"));
  target.appendChild(document.createTextNode(` ${index}`));
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

function setNotQuiteSummary(target, correct, total) {
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
    target.appendChild(document.createTextNode(" मात्रै सही भयो।"));
    return;
  }
  target.appendChild(document.createTextNode("Not quite:"));
  target.appendChild(document.createTextNode(" "));
  const correctValue = document.createElement("b");
  correctValue.textContent = String(correct);
  target.appendChild(correctValue);
  target.appendChild(document.createTextNode(" / "));
  const totalValue = document.createElement("b");
  totalValue.textContent = String(total);
  target.appendChild(totalValue);
  target.appendChild(document.createTextNode(" "));
  target.appendChild(document.createTextNode("correct."));
}

export function initializeGlaucomaQuizCaseStudy() {
  const page = document.getElementById("glaucomaQuizCaseStudy");
  if (!page) return;

  initializeGlaucomaWorkshopProgressInfra();
  initGlaucomaSecondaryCauseDragQuiz();

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
    const inProgressPercent = (answered / QUESTIONS.length) * 90;
    setGlaucomaLessonProgress("glaucomaQuizCaseStudy", inProgressPercent);
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

      const cardNumber = card.querySelector(".quiz-card-number");
      if (cardNumber) cardNumber.textContent = String(qi + 1).padStart(2, "0");

      const cardProgress = card.querySelector(".quiz-card-progress");
      if (cardProgress) setCaseLabel(cardProgress, qi + 1);

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
      translateNode(card);
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

    setScoreSummary(scoreText, score, total);
    translateNode(scoreText);
    modal.style.display = "flex";
    setGlaucomaLessonProgress("glaucomaQuizCaseStudy", 100);
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
  translateNode(page);
}

function initGlaucomaSecondaryCauseDragQuiz() {
  const page = document.getElementById("glaucomaSecondaryCauseQuizPage");
  if (!page) return;

  initializeGlaucomaWorkshopProgressInfra();

  if (page.dataset.wired === "1") return;
  page.dataset.wired = "1";

  const mount = page.querySelector("#glaucomaSecondaryQuizMount");
  const tpl = page.querySelector("#glaucomaSecondaryQuizTemplate");
  if (!mount || !tpl) return;

  const ITEMS = [
    { id: "lens", label: "Lens dislocation", zone: "secondary" },
    { id: "hyphaema", label: "Hyphaema", zone: "secondary" },
    { id: "uveitis", label: "Anterior uveitis", zone: "secondary" },
    { id: "irisBombe", label: "Iris bombe", zone: "secondary" },
    { id: "pigment", label: "Pigment dispersion", zone: "secondary" },
    { id: "pxf", label: "Pseudo-exfoliation", zone: "secondary" },
    { id: "shallow", label: "Shallow chamber", zone: "secondary" },
    { id: "irisNV", label: "Iris new vessels", zone: "secondary" },
    { id: "deep", label: "Deep chamber", zone: "not" },
    { id: "normalIris", label: "Normal iris", zone: "not" },
    { id: "cupping", label: "Optic disc cupping", zone: "not" },
    { id: "largeCDR", label: "Large cup-disc ratio", zone: "not" },
  ];

  mount.textContent = "";
  const ui = tpl.content.cloneNode(true);
  mount.appendChild(ui);

  const zones = Array.from(mount.querySelectorAll(".gsec-zone"));
  const bank = mount.querySelector(".gsec-bank");
  const submitBtn = mount.querySelector("#gsecSubmit");
  const feedback = mount.querySelector("#gsecFeedback");

  if (!bank || !submitBtn || !feedback || zones.length !== 2) return;

  const state = new Map();
  ITEMS.forEach((it) => state.set(it.id, "bank"));

  function updateSecondaryProgress() {
    const placed = ITEMS.filter((it) => state.get(it.id) !== "bank").length;
    const inProgressPercent = (placed / ITEMS.length) * 90;
    setGlaucomaLessonProgress(
      "glaucomaSecondaryCauseQuizPage",
      inProgressPercent,
    );
    setDiabeticLessonProgress(
      "glaucomaSecondaryCauseQuizPage",
      inProgressPercent,
    );
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function makeChip(item) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "gsec-chip";
    el.textContent = item.label;
    el.setAttribute("draggable", "true");
    el.dataset.itemId = item.id;
    el.dataset.correctZone = item.zone;

    el.addEventListener("dragstart", (e) => {
      if (submitBtn.disabled) return;
      e.dataTransfer?.setData("text/plain", item.id);
      e.dataTransfer?.setDragImage?.(el, 10, 10);
    });

    let dragging = false;

    el.addEventListener("pointerdown", (e) => {
      if (submitBtn.disabled) return;
      dragging = true;
      el.setPointerCapture(e.pointerId);

      el.style.position = "relative";
      el.style.zIndex = "5";
      el.dataset.dx = "0";
      el.dataset.dy = "0";
    });

    el.addEventListener("pointermove", (e) => {
      if (!dragging || submitBtn.disabled) return;

      const dx = parseFloat(el.dataset.dx || "0") + e.movementX || 0;
      const dy = parseFloat(el.dataset.dy || "0") + e.movementY || 0;
      el.dataset.dx = String(dx);
      el.dataset.dy = String(dy);

      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    el.addEventListener("pointerup", (e) => {
      if (!dragging) return;
      dragging = false;

      const ptX = e.clientX;
      const ptY = e.clientY;

      const hit = zones
        .map((z) => {
          const body = z.querySelector(".gsec-zone__body");
          if (!body) return null;
          const r = body.getBoundingClientRect();
          const inside =
            ptX >= r.left && ptX <= r.right && ptY >= r.top && ptY <= r.bottom;
          return inside ? z : null;
        })
        .find(Boolean);

      el.style.transform = "";
      el.style.zIndex = "";
      el.dataset.dx = "0";
      el.dataset.dy = "0";

      if (hit) {
        const zoneKey = hit.getAttribute("data-zone");
        if (zoneKey === "secondary" || zoneKey === "not") {
          moveChipTo(el, zoneKey);
        }
      }
    });

    translateNode(el);
    return el;
  }

  function moveChipTo(chipEl, where) {
    const id = chipEl.dataset.itemId;
    if (!id) return;

    if (where === "bank") {
      bank.appendChild(chipEl);
      state.set(id, "bank");
      updateSecondaryProgress();
      return;
    }

    const zoneEl = zones.find((z) => z.getAttribute("data-zone") === where);
    const body = zoneEl?.querySelector(".gsec-zone__body");
    if (!body) return;

    body.appendChild(chipEl);
    state.set(id, where);
    updateSecondaryProgress();
  }

  shuffle(ITEMS).forEach((item) => bank.appendChild(makeChip(item)));
  updateSecondaryProgress();

  function wireDropTarget(el, where) {
    el.addEventListener("dragover", (e) => {
      if (submitBtn.disabled) return;
      e.preventDefault();
    });
    el.addEventListener("drop", (e) => {
      if (submitBtn.disabled) return;
      e.preventDefault();
      const id = e.dataTransfer?.getData("text/plain");
      if (!id) return;
      const chip = mount.querySelector(`.gsec-chip[data-item-id="${id}"]`);
      if (!chip) return;
      moveChipTo(chip, where);
    });
  }

  zones.forEach((z) => {
    const body = z.querySelector(".gsec-zone__body");
    if (!body) return;

    wireDropTarget(body, z.getAttribute("data-zone"));

    body.addEventListener("dragenter", () => z.classList.add("is-over"));
    body.addEventListener("dragleave", () => z.classList.remove("is-over"));
    body.addEventListener("drop", () => z.classList.remove("is-over"));
  });

  wireDropTarget(bank, "bank");

  submitBtn.addEventListener("click", () => {
    const unplaced = ITEMS.filter((it) => state.get(it.id) === "bank");
    if (unplaced.length > 0) {
      feedback.textContent = "Place all findings before submitting.";
      translateNode(feedback);
      return;
    }

    submitBtn.disabled = true;
    updateSecondaryProgress();
    setGlaucomaLessonProgress("glaucomaSecondaryCauseQuizPage", 100);
    setDiabeticLessonProgress("glaucomaSecondaryCauseQuizPage", 100);

    let correct = 0;
    ITEMS.forEach((it) => {
      const chip = mount.querySelector(`.gsec-chip[data-item-id="${it.id}"]`);
      if (!chip) return;

      chip.classList.remove("is-correct", "is-wrong");
      const placed = state.get(it.id);
      const ok = placed === it.zone;
      if (ok) {
        correct += 1;
        chip.classList.add("is-correct");
      } else {
        chip.classList.add("is-wrong");
      }
    });

    if (correct === ITEMS.length) {
      feedback.textContent = "Correct!";
    } else {
      setNotQuiteSummary(feedback, correct, ITEMS.length);
    }
    translateNode(feedback);
  });

  translateNode(page);
}
