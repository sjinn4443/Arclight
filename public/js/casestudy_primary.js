// FILE: public/js/casestudy_primary.js

// ✅ casestudy.js에 있는 case pool 로직을 그대로 가져오기 (필요 최소)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function appendLines(target, lines) {
  const parts = Array.isArray(lines) ? lines : [lines];
  parts.forEach((part, index) => {
    if (index > 0) target.appendChild(document.createElement("br"));
    target.appendChild(document.createTextNode(String(part)));
  });
}

function correctDiagnosisForPrimary({ caseNum }) {
  if (caseNum === 1) return "Cataract";
  if (caseNum === 2) return "Retinoblastoma";
  if (caseNum === 3) return "Gonococcal/Chlamydial conjunctivitis";
  if (caseNum === 4) return "Trachomatous trichiasis with corneal scarring";
  if (caseNum === 5) return "Bacterial / fungal corneal ulcer";
  if (caseNum === 6) return "Herpes simplex keratitis";
  if (caseNum === 7) return "Anterior Uveitis";
  if (caseNum === 8) return "Pterygium";
  if (caseNum === 9) return "Corneal foreign body with early infection";
  if (caseNum === 10) return "Traumatic hyphaema";
  if (caseNum === 11)
    return "Penetrating corneal laceration with iris prolapse";
  if (caseNum === 12) return "Penetrating injury causing traumatic cataract";
  return "";
}

function flashRationaleLinesForCase({ caseNum, variant }) {
  if (caseNum === 1) {
    return [
      "Vision became worse slowly over many months, with no pain.",
      "No red eye or discharge suggests cataract, not an eye infection.",
    ];
  }

  if (caseNum === 2) {
    return [
      "A white pupil in a baby is a key danger sign for retinoblastoma.",
      "Poor visual attention supports this diagnosis and needs urgent referral.",
    ];
  }

  if (caseNum === 3) {
    const riskLine =
      variant === "neonate"
        ? "Newborn age and maternal STI history support gonococcal/chlamydial conjunctivitis."
        : "This sticky red-eye pattern can be due to gonococcal/chlamydial infection.";
    return [
      "Thick yellow discharge and pink eyes suggest bacterial conjunctivitis.",
      riskLine,
    ];
  }

  if (caseNum === 4) {
    return [
      "Long-term gritty pain with blurry vision suggests chronic surface damage.",
      "This pattern fits trachomatous trichiasis with corneal scarring.",
    ];
  }

  if (caseNum === 5) {
    return [
      "Severe pain and red eye after a scratch from a bush suggest corneal ulcer.",
      "Discharge and very poor vision support bacterial/fungal corneal infection.",
    ];
  }

  if (caseNum === 6) {
    return [
      "One painful light-sensitive eye with watery redness suggests keratitis.",
      "Recent painful lip sores support herpes simplex keratitis.",
    ];
  }

  if (caseNum === 7) {
    return [
      "Photophobia, pain, and blurred vision in one eye suggest uveitis.",
      "Repeated similar episodes support anterior uveitis.",
    ];
  }

  if (caseNum === 8) {
    return [
      "A slow-growing pink patch with mild grit sensation suggests pterygium.",
      "Good vision and long outdoor work make this diagnosis more likely.",
    ];
  }

  if (caseNum === 9) {
    return [
      "Gritty painful eye after metal work suggests a corneal foreign body.",
      "Light sensitivity and blurred vision suggest early infection is starting.",
    ];
  }

  if (caseNum === 10) {
    return [
      "Sudden vision loss after blunt trauma is typical for traumatic hyphaema.",
      "A painful red watering eye with shadow vision supports this diagnosis.",
    ];
  }

  if (caseNum === 11) {
    return [
      "Stick injury with worsening pain and blur suggests open-globe trauma.",
      "This pattern fits penetrating corneal laceration with iris prolapse.",
    ];
  }

  if (caseNum === 12) {
    return [
      "Severe vision loss after stick trauma suggests a penetrating eye injury.",
      "Painful red eye with fast decline supports traumatic cataract.",
    ];
  }

  return [
    "The history pattern supports this diagnosis.",
    "Clinical signs are consistent with this case label.",
  ];
}

function buildCasePool() {
  const pool = [
    { caseNum: 1, variant: "default" },
    { caseNum: 2, variant: Math.random() < 0.5 ? "progressive" : "congenital" },
    { caseNum: 3, variant: Math.random() < 0.5 ? "adult" : "neonate" },
    { caseNum: 4, variant: "default" },
    { caseNum: 5, variant: "default" },
    { caseNum: 6, variant: "default" },
    { caseNum: 7, variant: "default" },
    { caseNum: 8, variant: "default" },
    { caseNum: 9, variant: "default" },
    { caseNum: 10, variant: "default" },
    { caseNum: 11, variant: "default" },
    { caseNum: 12, variant: "default" },
  ];

  return shuffle(pool);
}

function buildTourPreviewCase(excludeCaseNum) {
  // 1..12 중에서 excludeCaseNum과 다른 가장 앞 번호를 선택 (결과가 항상 고정되도록)
  const all = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(
    (n) => n !== excludeCaseNum,
  );

  const caseNum = all[0] || 1;

  // case 2/3은 variant가 필요하므로 Tour 미리보기에서는 고정 variant로 넣는다
  if (caseNum === 2) return { caseNum: 2, variant: "progressive" };
  if (caseNum === 3) return { caseNum: 3, variant: "adult" };

  return { caseNum, variant: "default" };
}

// ✅ 이미지 경로는 기존과 동일하게 사용
function imgPathForCase(caseNum) {
  return `/images/casestudy/case${caseNum}_eye.webp`;
}

/**
 * ✅ Primary는 “환자가 말하는 것(대사)”만 자동으로 보여주면 됨
 * - 나이는 상단이 아니라 대사 안에서 말하게
 */
const PRIMARY_ANSWER_ORDER = [
  "problem",
  "when",
  "how",
  "eye",
  "pain",
  "redness",
  "vision",
  "course",
  "treatment",
  "other",
];

// ✅ intermediate의 caseAnswers를 primary에서도 그대로 재사용 (문구 일관성)
function caseAnswersPrimary({ caseNum, variant }) {
  if (caseNum === 1) {
    return {
      problem: "Cannot see anything",
      when: "Started over a year ago",
      how: "No trauma, started slowly",
      eye: "At first one eye, then both eyes",
      pain: "No pain or itch",
      redness: "White eye with no discharge",
      vision: "Only sees shadows",
      course: "Gradually getting worse",
      treatment: "No treatment yet",
      other: "No",
    };
  }

  if (caseNum === 2 && variant === "progressive") {
    return {
      problem: "Mum noticed pupil looked white",
      when: "Present from birth",
      how: "Present from birth",
      eye: "Both eyes",
      pain: "No pain or itch",
      redness: "White eye with no discharge",
      vision: "Child has never shown visual interest",
      course: "Staying the same",
      treatment: "No treatment yet",
      other: "Eyes shimmer and wobble",
    };
  }

  if (caseNum === 2 && variant === "congenital") {
    return {
      problem: "Mum noticed pupil looked white",
      when: "Started around 6 months of age",
      how: "No trauma, started slowly",
      eye: "One eye first, then both eyes",
      pain: "No pain or itch",
      redness: "White eye with no discharge",
      vision: "Child has lost interest in looking around",
      course: "Getting worse",
      treatment: "No treatment yet",
      other: "Older sibling had similar condition and is now deceased",
    };
  }

  if (caseNum === 3 && variant === "adult") {
    return {
      problem: "Sticky eye",
      when: "Started 1 week ago",
      how: "Gradual over 1 to 2 days",
      eye: "At first one eye, then both eyes",
      pain: "Itchy and gritty at times",
      redness: "Pink eye with yellow discharge",
      vision: "Blurry vision",
      course: "Getting worse",
      treatment: "No treatment yet",
      other: "No",
    };
  }

  if (caseNum === 3 && variant === "neonate") {
    return {
      problem: "Sticky eye",
      when: "Started 1 week ago",
      how: "Gradual over 1 to 2 days",
      eye: "At first one eye, then both eyes",
      pain: "Hard to assess",
      redness: "Pink eye with thick yellow discharge",
      vision: "Keeping eyes shut",
      course: "Getting worse",
      treatment: "No treatment yet",
      other: "Mother has been treated for STDs in the past",
    };
  }

  if (caseNum === 4) {
    return {
      problem: "Painful and gritty eyes",
      when: "Started many months ago",
      how: "Gradual onset",
      eye: "Both eyes affected",
      pain: "Sometimes itchy",
      redness: "Red eye with watery discharge",
      vision: "Blurry vision",
      course: "Getting worse",
      treatment: "No treatment yet",
      other: "No",
    };
  }

  if (caseNum === 5) {
    return {
      problem: "Painful eye",
      when: "Started 2 weeks ago",
      how: "After scratch from bush",
      eye: "One eye",
      pain: "Gritty then very painful",
      redness: "Red eye with sticky yellow discharge",
      vision: "Only sees shadows",
      course: "Getting worse",
      treatment: "No treatment yet",
      other: "No",
    };
  }

  if (caseNum === 6) {
    return {
      problem: "Gritty eye",
      when: "Started 1 week ago",
      how: "Gradual onset over 2 to 3 days",
      eye: "One eye",
      pain: "Bright light is painful",
      redness: "Pink eye with watery discharge",
      vision: "Blurry vision",
      course: "Gradually getting worse",
      treatment: "No treatment yet",
      other: "Painful broken skin on lip one week before eye symptoms",
    };
  }

  if (caseNum === 7) {
    return {
      problem: "Bright light is painful",
      when: "Started 1 week ago",
      how: "Gradual over 1 to 2 days",
      eye: "One eye",
      pain: "Bright light painful, no itch",
      redness: "Pink watery eye",
      vision: "Slightly blurred vision",
      course: "Gradually getting worse",
      treatment: "No treatment yet",
      other: "Several previous episodes",
    };
  }

  if (caseNum === 8) {
    return {
      problem: "Pink patch on eye",
      when: "Started many months ago",
      how: "Slow onset, no trauma",
      eye: "One eye",
      pain: "Gritty sensation",
      redness: "White eye with slight watering",
      vision: "Vision unaffected",
      course: "Slowly getting worse",
      treatment: "No treatment yet",
      other: "Works outdoors daily",
    };
  }

  if (caseNum === 9) {
    return {
      problem: "Gritty eye",
      when: "Started 1 week ago",
      how: "After working under a car",
      eye: "One eye",
      pain: "Bright light uncomfortable",
      redness: "Slightly pink eye",
      vision: "Slightly blurred vision",
      course: "Gradually getting worse",
      treatment: "No treatment yet",
      other: "No",
    };
  }

  if (caseNum === 10) {
    return {
      problem: "Loss of vision",
      when: "Started 4 days ago",
      how: "After being punched",
      eye: "One eye",
      pain: "Painful with watering",
      redness: "Red eye",
      vision: "Only sees shadows",
      course: "Staying the same",
      treatment: "No treatment yet",
      other: "No",
    };
  }

  if (caseNum === 11) {
    return {
      problem: "Painful eye",
      when: "Started 3 days ago",
      how: "After being hit in the face with a stick",
      eye: "One eye",
      pain: "Gritty, no itch",
      redness: "Pink eye with watering",
      vision: "Blurry vision",
      course: "Gradually getting worse",
      treatment: "No treatment yet",
      other: "No",
    };
  }

  if (caseNum === 12) {
    return {
      problem: "Loss of vision",
      when: "Started 1 day ago",
      how: "After being hit in the eye with a stick",
      eye: "One eye",
      pain: "Painful",
      redness: "Red eye with watering",
      vision: "Only sees shadows",
      course: "Getting worse",
      treatment: "No treatment yet",
      other: "No",
    };
  }

  return null;
}
function joinClean(parts) {
  return parts
    .filter((x) => typeof x === "string" && x.trim() !== "")
    .map((s) => s.trim().replace(/\s+/g, " "))
    .join(" ");
}

function isNoLike(s) {
  const t = (s || "").trim().toLowerCase();
  return t === "no." || t === "no" || t === "none." || t === "none";
}

function primaryLinesForCase(caseObj) {
  const { caseNum, variant } = caseObj;

  const ageTextByCase = {
    1: "78 years old",
    2: "12 months old",
    3: variant === "neonate" ? "2 weeks old" : "18 years old",
    4: "38 years old",
    5: "29 years old",
    6: "21 years old",
    7: "21 years old",
    8: "69 years old",
    9: "21 years old",
    10: "32 years old",
    11: "8 years old",
    12: "8 years old",
  };

  const ageText = ageTextByCase[caseNum] || "unknown age";
  const isChild =
    /weeks|months/.test(ageText) ||
    (ageText.includes("years") && parseInt(ageText, 10) < 16);

  const ageSentence = isChild ? `My child is ${ageText}.` : `I'm ${ageText}.`;

  const a = caseAnswersPrimary(caseObj) || {};

  // ✅ 묶음 규칙:
  // Problem-when / how / eye-pain / redness / vision-course / treatment / other
  const lineProblemWhen = joinClean([a.when, a.problem]); // 예시처럼 when + problem 순서
  const lineHow = joinClean([a.how]);
  const lineEyePain = joinClean([a.eye, a.pain]);
  const lineRedness = joinClean([a.redness]);
  const lineVisionCourse = joinClean([a.vision, a.course]);
  const lineTreatment = joinClean([a.treatment]);

  let otherText = a.other || "";

  const wasOtherNo = isNoLike(otherText);
  if (wasOtherNo) otherText = "I think that's about it.";

  const lineOther = joinClean([otherText]);

  // ✅ 끝맺음 규칙
  // - other가 원래 No였으면: "... I think that's about it." 다음에 "What is the diagnosis?"
  // - other가 No가 아니면: 마지막은 항상 "I think that's about it."
  const endingLine = wasOtherNo
    ? "What is the problem?"
    : "I think that's about it.";

  const grouped = [
    ageSentence,
    lineProblemWhen,
    lineHow,
    lineEyePain,
    lineRedness,
    lineVisionCourse,
    lineTreatment,
    lineOther,
    endingLine,
  ].filter((x) => typeof x === "string" && x.trim() !== "");

  return grouped;
}

/**
 * ✅ “정답 이미지”를 caseNum 기반으로 결정하는 함수는
 *    지금은 단순히 “정답 = 현재 caseNum 이미지”로 두고,
 *    나중에 advanced/진단 로직과 합칠 때 매핑을 고도화하면 됨.
 */
function isCorrectImageChoice(clickedCaseNum, currentCaseNum) {
  return clickedCaseNum === currentCaseNum;
}

export function initializeCaseStudyPrimary() {
  let currentGridEl = null;
  let currentFeedbackEl = null;
  let correctCount = 0;
  let activeCase = null;

  const listPage = document.getElementById("casestudyPage");
  const chatPage = document.getElementById("caseStudyChatPagePrimary");
  const flashPage = document.getElementById("caseStudyFlashcardPagePrimary");

  if (!listPage || !chatPage || !flashPage) return;

  const log = chatPage.querySelector("#casePrimaryChatLog");
  const timerBtn = chatPage.querySelector("#casePrimaryTimerBtn");
  const timerText = chatPage.querySelector("#casePrimaryTimerText");
  const timerFg = chatPage.querySelector("#casePrimaryTimerFg");

  if (!log || !timerBtn || !timerText || !timerFg) return;

  // ---- state ----
  const TOTAL_CASES = 12;
  const TIMER_TOTAL = 90;

  let casePool = buildCasePool();
  let caseIndex = 0;

  let timerLeft = TIMER_TOTAL;
  let timerInterval = null;

  let autoLineTimeouts = [];
  let attemptsLeft = 2;
  let locked = false; // 정답/종료 후 추가 클릭 방지

  function clearAutoLines() {
    autoLineTimeouts.forEach((t) => clearTimeout(t));
    autoLineTimeouts = [];
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function renderTimer() {
    timerText.textContent = String(timerLeft);

    // 남은 비율 (0..1)
    const pct = Math.max(0, Math.min(1, timerLeft / TIMER_TOTAL));

    // ✅ 100 기반 링 진행률 (flash/intermediate와 동일)
    timerFg.style.strokeDasharray = "100 100";
    timerFg.style.strokeDashoffset = String(100 * (1 - pct));

    // ✅ 색상: 시작~11초는 회색, 10초부터 빨강
    const isLastTen = timerLeft <= 10;
    const c = isLastTen ? "#e41e26" : "#777";

    // 링/숫자 색 동기화
    timerFg.style.stroke = c;
    timerText.style.fill = c; // SVG text는 fill로 색이 바뀜
  }

  function startTimer() {
    stopTimer();
    timerLeft = TIMER_TOTAL;
    renderTimer();

    timerInterval = setInterval(() => {
      timerLeft -= 1;
      renderTimer();

      if (timerLeft <= 0) {
        timerLeft = 0;
        renderTimer();
        stopTimer();
        // 시간 끝나면 다음 케이스
        locked = true;
        setFeedbackTimeUp();
        renderNextButton();
      }
    }, 1000);
  }

  // ---------------- Flashcard (Urgent referral) ----------------
  const FLASH_TOTAL = 30;
  let flashPool = buildCasePool();
  let flashIndex = 0;
  let flashTimerLeft = FLASH_TOTAL;
  let flashTimerInt = null;
  let flashCorrectCount = 0;
  let flashWrong = [];
  let flashCompletionModalEl = null;
  let flashSwipeBound = false;

  // ---- scroll lock (Flashcard page only) ----
  let flashScrollLocked = false;
  let flashScrollY = 0;

  function lockFlashPageScroll() {
    if (flashScrollLocked) return;
    flashScrollLocked = true;

    flashScrollY = window.scrollY || 0;

    // Prevent the document from scrolling
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${flashScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }

  function unlockFlashPageScroll() {
    if (!flashScrollLocked) return;
    flashScrollLocked = false;

    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";

    window.scrollTo(0, flashScrollY);
  }

  function ensureFlashCompletionModal() {
    if (flashCompletionModalEl) return flashCompletionModalEl;

    const modal = document.createElement("div");
    modal.className = "casechat-modal";
    modal.hidden = true;

    const card = document.createElement("div");
    card.className = "casechat-modalCard";
    card.style.maxHeight = "80vh";
    card.style.overflow = "auto";

    const top = document.createElement("div");
    top.className = "casechat-modalTop";
    const title = document.createElement("div");
    title.className = "casechat-modalTitle";
    title.textContent = "All cards completed";
    top.appendChild(title);

    const score = document.createElement("div");
    score.className = "casechat-resultWhy";
    score.id = "flashScoreText";

    const wrongList = document.createElement("div");
    wrongList.id = "flashWrongList";
    wrongList.className = "flash-wrong-list";

    const actions = document.createElement("div");
    actions.className = "casechat-confirm__actions flash-result-actions";

    const restartBtn = document.createElement("button");
    restartBtn.type = "button";
    restartBtn.className = "casechat-confirm__btn is-ok";
    restartBtn.dataset.action = "restart";
    restartBtn.textContent = "Restart";

    const exitBtn = document.createElement("button");
    exitBtn.type = "button";
    exitBtn.className = "casechat-confirm__btn is-exit";
    exitBtn.dataset.action = "back";
    exitBtn.textContent = "Exit";

    actions.appendChild(restartBtn);
    actions.appendChild(exitBtn);

    card.appendChild(top);
    card.appendChild(score);
    card.appendChild(wrongList);
    card.appendChild(actions);
    modal.appendChild(card);

    modal.addEventListener("click", (e) => {
      const restartBtn = e.target.closest('[data-action="restart"]');
      if (restartBtn) {
        modal.hidden = true;
        // restart
        flashPool = buildCasePool();
        flashIndex = 0;
        flashCorrectCount = 0;
        flashWrong = [];
        renderFlashCard();
        return;
      }

      const backBtn = e.target.closest('[data-action="back"]');
      if (backBtn) {
        modal.hidden = true;
        showListFromFlash();
        return;
      }
    });

    flashPage.appendChild(modal);
    flashCompletionModalEl = modal;
    return modal;
  }

  function showFlashCompletionModal() {
    const modal = ensureFlashCompletionModal();

    const scoreText = modal.querySelector("#flashScoreText");
    if (scoreText) {
      scoreText.textContent = "";
      scoreText.appendChild(document.createTextNode("You got "));
      const correct = document.createElement("b");
      correct.textContent = String(flashCorrectCount);
      scoreText.appendChild(correct);
      scoreText.appendChild(document.createTextNode(" out of "));
      const total = document.createElement("b");
      total.textContent = String(flashPool.length);
      scoreText.appendChild(total);
      scoreText.appendChild(document.createTextNode(" correct."));
    }

    const list = modal.querySelector("#flashWrongList");
    if (list) {
      list.textContent = "";
      if (flashWrong.length === 0) {
        const empty = document.createElement("div");
        empty.className = "casechat-resultWhy";
        empty.textContent = "No wrong answers.";
        list.appendChild(empty);
      } else {
        flashWrong.forEach(({ caseObj, correctIsUrgent }) => {
          const img = imgPathForCase(caseObj.caseNum);
          const dx = correctDiagnosisForPrimary(caseObj);
          const label = correctIsUrgent ? "Urgent Referral" : "Not urgent";
          const urgencyClass = correctIsUrgent ? "is-urgent" : "is-not-urgent";

          const row = document.createElement("div");
          row.className = "flash-wrong-row";

          const thumb = document.createElement("img");
          thumb.className = "flash-wrong-thumb";
          thumb.src = img;
          thumb.alt = "Case image";

          const main = document.createElement("div");
          main.className = "flash-wrong-main";

          const dxEl = document.createElement("div");
          dxEl.className = "flash-wrong-dx";
          dxEl.textContent = dx;

          const labelEl = document.createElement("div");
          labelEl.className = `flash-wrong-label ${urgencyClass}`;
          labelEl.textContent = label;

          main.appendChild(dxEl);
          main.appendChild(labelEl);
          row.appendChild(thumb);
          row.appendChild(main);
          list.appendChild(row);
        });
      }
    }

    modal.hidden = false;
  }

  // urgent referral mapping (Primary 12 cases)
  function isUrgentReferralCase(caseNum) {
    // urgent: retinoblastoma, neonatal STI conjunctivitis, corneal ulcer, HSV keratitis, anterior uveitis,
    // foreign body + infection, hyphaema, penetrating injuries
    return [2, 3, 5, 6, 7, 9, 10, 11, 12].includes(caseNum);
  }

  function stopFlashTimer() {
    if (flashTimerInt) {
      clearInterval(flashTimerInt);
      flashTimerInt = null;
    }
  }
  // 캐시: svg path 길이 (dash 계산용)
  let flashTimerPathLen = null;

  function renderFlashTimer() {
    const fg = flashPage?.querySelector("#primaryFlashTimerFg");
    const t = flashPage?.querySelector("#primaryFlashTimerText");
    if (!fg || !t) return;

    // 숫자 갱신
    t.textContent = String(flashTimerLeft);

    // 남은 비율 (0..1)
    const pct = Math.max(0, Math.min(1, flashTimerLeft / FLASH_TOTAL));

    // ✅ case study intermediate 방식(100 기반)으로 링 진행률 표시
    fg.style.strokeDasharray = "100 100";
    fg.style.strokeDashoffset = String(100 * (1 - pct));

    // 색상: 첫 25초(#777), 마지막 5초(빨강)
    const isLastFive = flashTimerLeft <= 5;
    const c = isLastFive ? "#e41e26" : "#777";

    // 링/숫자 색 동기화
    fg.style.stroke = c;
    t.style.fill = c; // SVG text는 fill로 색이 바뀜
  }

  function startFlashTimer(onTimeUp) {
    stopFlashTimer();
    flashTimerLeft = FLASH_TOTAL;
    renderFlashTimer();

    flashTimerInt = setInterval(() => {
      flashTimerLeft -= 1;
      renderFlashTimer();

      if (flashTimerLeft <= 0) {
        flashTimerLeft = 0;
        renderFlashTimer();
        stopFlashTimer();
        if (typeof onTimeUp === "function") onTimeUp();
      }
    }, 1000);
  }

  function showPrimaryFlashcard() {
    // hide list/chat, show flash
    listPage.style.display = "none";
    chatPage.style.display = "none";
    flashPage.style.display = "block";
    lockFlashPageScroll();

    // ✅ 항상 새 게임으로 리셋 (재입장 시 꼬임 방지)
    stopFlashTimer();
    flashPool = buildCasePool();
    flashIndex = 0;
    flashCorrectCount = 0;
    flashWrong = [];

    if (flashCompletionModalEl) {
      flashCompletionModalEl.hidden = true;
    }

    // back
    const backBtn = flashPage.querySelector("#primaryFlashBackBtn");
    if (backBtn) backBtn.onclick = () => showListFromFlash();

    // buttons
    const urgentBtn = flashPage.querySelector("#primaryFlashUrgentBtn");
    const notUrgentBtn = flashPage.querySelector("#primaryFlashNotUrgentBtn");
    if (urgentBtn) urgentBtn.onclick = () => submitFlashAnswer(true);
    if (notUrgentBtn) notUrgentBtn.onclick = () => submitFlashAnswer(false);

    // swipe (bind once)
    bindFlashSwipe();

    /*
    const guide = flashPage.querySelector("#primaryFlashGuide");
    const ok = flashPage.querySelector("#primaryFlashGuideOk");
    const key = "primaryFlashcardGuideSeen";

    const startNow = () => {
      // 카드/타이머 시작
      renderFlashCard();
    };

    if (guide && ok) {
      // 이미 본 적 있으면 바로 시작, 아니면 안내 후 시작
      if (sessionStorage.getItem(key)) {
        guide.style.display = "none";
        startNow(); // ✅ 이게 없어서 지금 화면이 비었음
      } else {
        guide.style.display = "block";
        ok.onclick = () => {
          guide.style.display = "none";
          sessionStorage.setItem(key, "1");
          startNow();
        };
      }
    } else {
      // guide DOM이 없으면 그냥 시작
      startNow();
    }
  } */

    // ✅ 4-step tour 처리 (Step 1: 설명만 + Next)
    const tour = flashPage.querySelector("#primaryFlashTour");
    const spot = flashPage.querySelector("#primaryFlashTourSpot");
    const spotCard = flashPage.querySelector("#primaryFlashTourSpotCard");

    const bubble = flashPage.querySelector("#primaryFlashTourBubble");
    const tTitle = flashPage.querySelector("#primaryFlashTourTitle");
    const tText = flashPage.querySelector("#primaryFlashTourText");
    const tNext = flashPage.querySelector("#primaryFlashTourNext");
    const tHint = flashPage.querySelector("#primaryFlashTourHint");

    const key = "primaryFlashcardGuideSeen";

    const startNow = () => {
      renderFlashCard();
    };

    const steps = [
      {
        title: "Referral Flashcard",
        text: "Look at the cases and decide if the patient needs urgent referral or not.",
        target: null,
        hint: null,
        nextLabel: ">",
      },
      {
        title: "Flip the card",
        text: "You can check diagnosis by tapping the card.",
        target: "#primaryFlashCard",
        hint: null,
        nextLabel: ">",
      },
      {
        title: "Not urgent",
        text: "Swipe the flashcard to the left or press the button.",
        target: "#primaryFlashNotUrgentBtn",
        hint: "left",
        nextLabel: ">",
      },
      {
        title: "Urgent referral",
        text: "Swipe the flashcard to the right or press the button.",
        target: "#primaryFlashUrgentBtn",
        hint: "right",
        nextLabel: "Start",
      },
    ];

    let stepIndex = 0;

    function hideTour() {
      if (tour) tour.style.display = "none";
    }

    function showTour() {
      if (tour) tour.style.display = "block";
    }

    function clearHint() {
      if (!tHint) return;
      tHint.style.display = "none";
      tHint.style.left = "";
      tHint.style.top = "";
      tHint.style.width = "";
      tHint.classList.remove("is-up", "is-left", "is-right", "is-over-card");
    }

    function applyHint(kind) {
      if (!tHint) return;
      clearHint();
      if (!kind) return;

      tHint.style.display = "block";

      // Flip 단계는 hint 자체를 안 쓰기로 했으니, 여기서는 left/right만 처리
      if (kind === "left") {
        tHint.classList.add("is-left", "is-over-card");
      }
      if (kind === "right") {
        tHint.classList.add("is-right", "is-over-card");
      }
    }

    function positionHintCenteredOnFlashCard() {
      if (!tHint) return;

      const cardEl = flashPage.querySelector("#primaryFlashCard");
      if (!cardEl) return;

      const r = cardEl.getBoundingClientRect();

      // Hint를 화면 기준 fixed로 card 정중앙에 두기
      tHint.style.position = "fixed";
      tHint.style.left = `50%`;
      tHint.style.top = `${Math.round(r.top + r.height / 2)}px`;
      tHint.style.transform = "translate(-50%, -50%)";
      tHint.style.marginTop = "0";
      tHint.style.zIndex = "10000";
    }

    function positionHintOverFlashCard() {
      if (!tHint) return;
      if (tHint.style.display === "none") return;

      const cardEl = flashPage.querySelector("#primaryFlashCard");
      if (!cardEl) return;

      const r = cardEl.getBoundingClientRect();

      // 힌트 바 너비는 카드보다 작게 고정 범위로 설정
      const w = Math.max(180, Math.min(260, Math.round(r.width - 24)));
      const h = 34; // .pflash-tour__hint height

      // 카드 정중앙에 힌트 바의 정중앙을 맞춤
      const centerX = Math.round(r.left + r.width / 2);
      const centerY = Math.round(r.top + r.height / 2);

      const leftRaw = Math.round(centerX - w / 2);
      const topRaw = Math.round(centerY - h / 2);

      const left = Math.max(12, Math.min(leftRaw, window.innerWidth - w - 12));
      const top = Math.max(12, Math.min(topRaw, window.innerHeight - h - 12));

      tHint.style.left = `${left}px`;
      tHint.style.top = `${top}px`;
      tHint.style.width = `${w}px`;
    }

    function hideSpotlight() {
      if (!spot) return;
      spot.style.width = "0px";
      spot.style.height = "0px";
      spot.style.left = "0px";
      spot.style.top = "0px";
      spot.style.display = "none";
    }

    function positionSpotlightTo(targetEl) {
      if (!spot) return;
      const r = targetEl.getBoundingClientRect();

      // padding around target
      const pad = 10;
      const left = Math.max(8, r.left - pad);
      const top = Math.max(8, r.top - pad);
      const width = Math.min(window.innerWidth - left - 8, r.width + pad * 2);
      const height = Math.min(window.innerHeight - top - 8, r.height + pad * 2);

      spot.style.display = "block";
      spot.style.left = `${left}px`;
      spot.style.top = `${top}px`;
      spot.style.width = `${width}px`;
      spot.style.height = `${height}px`;
    }

    function hideCardSpotlight() {
      if (!spotCard) return;
      spotCard.style.width = "0px";
      spotCard.style.height = "0px";
      spotCard.style.left = "0px";
      spotCard.style.top = "0px";
      spotCard.style.display = "none";
    }

    function positionCardSpotlightTo(targetEl) {
      if (!spotCard) return;
      const r = targetEl.getBoundingClientRect();

      const pad = 10;
      const left = Math.max(8, r.left - pad);
      const top = Math.max(8, r.top - pad);
      const width = Math.min(window.innerWidth - left - 8, r.width + pad * 2);
      const height = Math.min(window.innerHeight - top - 8, r.height + pad * 2);

      spotCard.style.display = "block";
      spotCard.style.left = `${left}px`;
      spotCard.style.top = `${top}px`;
      spotCard.style.width = `${width}px`;
      spotCard.style.height = `${height}px`;
    }

    function positionSpotlightToGroup(els) {
      if (!spot) return;

      const rects = els.filter(Boolean).map((el) => el.getBoundingClientRect());

      if (!rects.length) {
        hideSpotlight();
        return;
      }

      const minLeft = Math.min(...rects.map((r) => r.left));
      const minTop = Math.min(...rects.map((r) => r.top));
      const maxRight = Math.max(...rects.map((r) => r.right));
      const maxBottom = Math.max(...rects.map((r) => r.bottom));

      const pad = 10;
      const left = Math.max(8, minLeft - pad);
      const top = Math.max(8, minTop - pad);
      const width = Math.min(
        window.innerWidth - left - 8,
        maxRight - minLeft + pad * 2,
      );
      const height = Math.min(
        window.innerHeight - top - 8,
        maxBottom - minTop + pad * 2,
      );

      spot.style.display = "block";
      spot.style.left = `${left}px`;
      spot.style.top = `${top}px`;
      spot.style.width = `${width}px`;
      spot.style.height = `${height}px`;
    }

    function positionBubble(targetEl) {
      if (!bubble) return;

      const margin = 12;

      // default: centre bottom-ish
      let x = Math.round((window.innerWidth - bubble.offsetWidth) / 2);
      let y = Math.round(window.innerHeight - bubble.offsetHeight - 24);

      if (!targetEl) {
        bubble.style.left = `${Math.max(12, Math.min(x, window.innerWidth - bubble.offsetWidth - 12))}px`;
        bubble.style.top = `${Math.max(12, Math.min(y, window.innerHeight - bubble.offsetHeight - 12))}px`;
        return;
      }

      const r = targetEl.getBoundingClientRect();

      // prefer below target
      const belowY = r.bottom + margin;
      const aboveY = r.top - margin - bubble.offsetHeight;

      if (belowY + bubble.offsetHeight <= window.innerHeight - 12) {
        y = belowY;
      } else if (aboveY >= 12) {
        y = aboveY;
      }

      // try align with target centre
      x = Math.round(r.left + r.width / 2 - bubble.offsetWidth / 2);

      bubble.style.left = `${Math.max(12, Math.min(x, window.innerWidth - bubble.offsetWidth - 12))}px`;
      bubble.style.top = `${Math.max(12, Math.min(y, window.innerHeight - bubble.offsetHeight - 12))}px`;
    }

    function renderStep() {
      const s = steps[stepIndex];
      if (!s) return;

      if (tTitle) tTitle.textContent = s.title;
      if (tText) tText.textContent = s.text;
      if (tNext) {
        tNext.textContent = s.nextLabel;

        // Start 단계만 너비 60px
        if (s.nextLabel === "Start") {
          tNext.classList.add("is-start");
        } else {
          tNext.classList.remove("is-start");
        }
      }

      applyHint(s.hint);
      // hint가 켜져 있는 단계면 flashcard 정중앙으로 이동
      if (s.hint) {
        requestAnimationFrame(() => positionHintCenteredOnFlashCard());
      }

      if (s.hint === "left" || s.hint === "right") {
        requestAnimationFrame(() => positionHintOverFlashCard());
      }

      // Step 1: 설명만 (spotlight 없음)
      if (!s.target) {
        hideSpotlight();
        hideCardSpotlight();
        requestAnimationFrame(() => positionBubble(null));
        return;
      }

      const targetEl = flashPage.querySelector(s.target);
      if (!targetEl) {
        hideSpotlight();
        hideCardSpotlight();
        requestAnimationFrame(() => positionBubble(null));
        return;
      }

      const cardEl = flashPage.querySelector("#primaryFlashCard");

      // Not urgent / Urgent referral 단계에서는 버튼 spot + 카드 spot을 동시에 표시
      if (
        s.target === "#primaryFlashNotUrgentBtn" ||
        s.target === "#primaryFlashUrgentBtn"
      ) {
        positionSpotlightTo(targetEl); // 버튼 spot (기존 spot)
        if (cardEl) positionCardSpotlightTo(cardEl); // 카드 spot (추가 spotCard)
      } else {
        positionSpotlightTo(targetEl);
        hideCardSpotlight();
      }

      requestAnimationFrame(() => positionBubble(targetEl));
    }

    function advanceTour() {
      if (stepIndex < steps.length - 1) {
        stepIndex += 1;
        renderStep();
        return;
      }

      // finished
      hideTour();
      sessionStorage.setItem(key, "1");
      startNow();
    }

    function beginTour() {
      // Tour가 떠 있는 동안에도 카드 1장을 먼저 렌더
      // 단, Tour 종료 후 실제 첫 케이스(flashPool[0])와 다른 케이스로 강제
      const firstCaseNum = flashPool?.[0]?.caseNum;
      const previewCaseObj = buildTourPreviewCase(firstCaseNum);

      renderFlashCard({
        caseObjOverride: previewCaseObj,
        skipTimer: true,
        labelOverride: "Example",
      });

      stepIndex = 0;
      showTour();
      renderStep();
    }

    if (tour && spot && bubble && tNext) {
      tNext.onclick = () => advanceTour();

      if (sessionStorage.getItem(key)) {
        hideTour();
        startNow();
      } else {
        beginTour();
      }

      // keep spotlight aligned on resize
      window.addEventListener("resize", () => {
        if (!tour || tour.style.display === "none") return;
        renderStep();
      });
    } else {
      startNow();
    }
  }

  // back
  const backBtn = flashPage.querySelector("#primaryFlashBackBtn");
  if (backBtn) backBtn.onclick = () => showListFromFlash();

  // buttons
  const urgentBtn = flashPage.querySelector("#primaryFlashUrgentBtn");
  const notUrgentBtn = flashPage.querySelector("#primaryFlashNotUrgentBtn");
  if (urgentBtn) urgentBtn.onclick = () => submitFlashAnswer(true);
  if (notUrgentBtn) notUrgentBtn.onclick = () => submitFlashAnswer(false);

  // swipe
  bindFlashSwipe();

  function showListFromFlash() {
    stopFlashTimer();
    unlockFlashPageScroll();
    flashPage.style.display = "none";
    chatPage.style.display = "none";
    listPage.style.display = "block";
  }

  function flashBulletsForCase(caseObj) {
    const { caseNum, variant } = caseObj || {};

    if (caseNum === 1) {
      return [
        "started slowly over more than a year.",
        "no pain or itch.",
        "no redness or discharge.",
        "vision now only sees shadows.",
      ];
    }

    if (caseNum === 2) {
      return [
        "white pupil noticed in a very young child.",
        "poor visual interest for age.",
        "can involve one eye then both eyes.",
        "urgent red-flag pattern for intraocular tumor.",
      ];
    }

    if (caseNum === 3 && variant === "neonate") {
      return [
        "newborn with pink eyes and thick yellow sticky discharge.",
        "started in one eye then both eyes.",
        "eyes often kept shut due to irritation.",
        "maternal STI history increases suspicion.",
      ];
    }

    if (caseNum === 3) {
      return [
        "pink eyes with thick yellow sticky discharge.",
        "started in one eye then both eyes.",
        "blurry vision and symptoms getting worse.",
        "pattern fits severe bacterial/STI-related conjunctivitis.",
      ];
    }

    if (caseNum === 4) {
      return [
        "long history of gritty painful eyes.",
        "both eyes affected with redness and watering.",
        "blurred vision and slowly worsening course.",
        "chronic surface damage pattern (trichiasis/scarring).",
      ];
    }

    if (caseNum === 5) {
      return [
        "after scratch from bush.",
        "one eye gritty then very painful.",
        "red eye with sticky yellow discharge.",
        "only sees shadows.",
      ];
    }

    if (caseNum === 6) {
      return [
        "painful broken skin on lip one week before eye symptoms.",
        "blurry vision gradually getting worse.",
        "pink eye with watery discharge.",
        "bright light is painful.",
      ];
    }

    if (caseNum === 7) {
      return [
        "one painful eye with pink watery redness.",
        "bright light is painful.",
        "vision is slightly blurred.",
        "similar episodes happened before.",
      ];
    }

    if (caseNum === 8) {
      return [
        "slowly growing pink patch on one eye.",
        "gritty feeling with mild watering.",
        "vision mostly unaffected.",
        "long outdoor UV exposure history.",
      ];
    }

    if (caseNum === 9) {
      return [
        "started after working under a car.",
        "one gritty eye with light sensitivity.",
        "slightly red eye with gradual blur.",
        "worsening course suggests early infection.",
      ];
    }

    if (caseNum === 10) {
      return [
        "sudden vision loss after being punched.",
        "painful red watery eye.",
        "vision reduced to only shadows.",
        "blunt-trauma pattern fits hyphaema.",
      ];
    }

    if (caseNum === 11) {
      return [
        "hit in the eye with a stick.",
        "one eye gritty painful and getting worse.",
        "pink watering eye with blurred vision.",
        "penetrating-injury pattern (possible open globe).",
      ];
    }

    if (caseNum === 12) {
      return [
        "recent stick injury to the eye.",
        "painful red eye with watering.",
        "vision dropped to shadows and worsening.",
        "penetrating trauma can cause traumatic cataract.",
      ];
    }

    return [
      "onset and course of symptoms.",
      "pain/redness/discharge pattern.",
      "vision impact.",
      "important risk history.",
    ];
  }
  function renderFlashCard(opts = {}) {
    const {
      caseObjOverride = null,
      skipTimer = false,
      labelOverride = null,
    } = opts;

    console.log("[flash] renderFlashCard", {
      flashIndex,
      poolLen: flashPool?.length,
      override: Boolean(caseObjOverride),
      skipTimer,
    });

    // override가 없을 때만 완료 체크
    if (!caseObjOverride && flashIndex >= flashPool.length) {
      stopFlashTimer();
      showFlashCompletionModal();
      return;
    }

    const caseObj = caseObjOverride || flashPool[flashIndex]; // ✅ override 지원
    const caseLabel = flashPage.querySelector("#primaryFlashCaseLabel");
    if (caseLabel) {
      if (labelOverride != null) {
        caseLabel.textContent = labelOverride;
      } else {
        caseLabel.textContent = `Case (${flashIndex + 1}/${flashPool.length})`;
      }
    }

    const img = flashPage.querySelector("#primaryFlashImg");
    const dx = flashPage.querySelector("#primaryFlashDx");
    const ul = flashPage.querySelector("#primaryFlashBullets");
    const backImg = flashPage.querySelector("#primaryFlashBackImg");
    const dxRationale = flashPage.querySelector("#primaryFlashDxRationale");

    if (!img || !dx || !ul) return;

    const diagnosis = correctDiagnosisForPrimary(caseObj);
    const imagePath = imgPathForCase(caseObj.caseNum);
    img.src = imagePath;
    dx.textContent = diagnosis;
    if (backImg) {
      backImg.src = imagePath;
      backImg.alt = `Case image for ${diagnosis || "diagnosis"}`;
    }
    if (dxRationale) {
      dxRationale.textContent = "";
      flashRationaleLinesForCase(caseObj)
        .slice(0, 2)
        .forEach((line) => {
          const li = document.createElement("li");
          li.textContent = line;
          dxRationale.appendChild(li);
        });
    }
    const wrap = flashPage.querySelector("#primaryFlashCardWrap");
    const card = flashPage.querySelector("#primaryFlashCard");
    if (card) card.classList.remove("is-flipped");
    if (wrap) {
      wrap.style.transition = "";
      wrap.style.transform = "translateX(0px) rotate(0deg)";
    }

    ul.textContent = "";
    flashBulletsForCase(caseObj).forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      ul.appendChild(li);
    });

    if (skipTimer) return;

    startFlashTimer(() => {
      // time up => 오답 처리 후 다음 케이스
      submitFlashAnswer(null);
    });
  }

  function submitFlashAnswer(userSaysUrgent) {
    console.log("[flash] submitFlashAnswer called", {
      userSaysUrgent,
      flashIndex,
      poolLen: flashPool?.length,
    });

    if (flashIndex >= flashPool.length) {
      console.warn("[flash] submit ignored because flashIndex >= poolLen");
      return;
    }

    const caseObj = flashPool[flashIndex];

    const correctUrgent = isUrgentReferralCase(caseObj.caseNum);
    const isCorrect = userSaysUrgent === correctUrgent;

    if (isCorrect) {
      flashCorrectCount += 1;
    } else {
      flashWrong.push({ caseObj, correctIsUrgent: correctUrgent });
    }

    stopFlashTimer();

    flashIndex += 1;

    console.log("[flash] after increment", {
      flashIndex,
      poolLen: flashPool?.length,
      willComplete: flashIndex >= (flashPool?.length || 0),
    });

    renderFlashCard();
  }

  function bindFlashSwipe() {
    const wrap = flashPage.querySelector("#primaryFlashCardWrap");
    const card = flashPage.querySelector("#primaryFlashCard");
    if (!wrap || !card) return;
    if (card.__flashSwipeBound) return;
    card.__flashSwipeBound = true;

    let startX = 0;
    let startY = 0;
    let dxLive = 0;
    let dyLive = 0;

    let tracking = false;

    // ✅ swipe로 인한 touch 시퀀스 뒤에 발생하는 click(ghost click) 방지
    let suppressClick = false;

    // ✅ 탭(클릭)으로 앞/뒷면 토글
    card.addEventListener("click", () => {
      console.log("[flash] card click"); // ✅ 임시
      if (suppressClick) return;
      card.classList.toggle("is-flipped");
    });

    const resetCard = () => {
      wrap.style.transition = "transform 180ms ease";
      wrap.style.transform = "translateX(0px) rotate(0deg)";
      setTimeout(() => {
        wrap.style.transition = "";
      }, 200);
    };

    const flyOut = (dir, cb) => {
      // dir: 1 (right), -1 (left)
      const off = dir * Math.max(320, window.innerWidth);
      wrap.style.transition = "transform 180ms ease";
      wrap.style.transform = `translateX(${off}px) rotate(${dir * 10}deg)`;
      setTimeout(() => {
        wrap.style.transition = "";
        wrap.style.transform = "translateX(0px) rotate(0deg)";
        if (typeof cb === "function") cb();
      }, 190);
    };

    card.addEventListener(
      "touchstart",
      (e) => {
        const t = e.touches?.[0];
        if (!t) return;
        tracking = true;
        startX = t.clientX;
        startY = t.clientY;
        dxLive = 0;
        dyLive = 0;

        suppressClick = false;

        wrap.style.transition = "";
      },
      { passive: false },
    );

    card.addEventListener(
      "touchmove",
      (e) => {
        if (!tracking) return;
        e.preventDefault();

        const t = e.touches?.[0];
        if (!t) return;

        const dx = t.clientX - startX;
        const dy = t.clientY - startY;

        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) suppressClick = true;

        dxLive = dx;
        dyLive = dy;

        // 좌/우 드래그 중일 때만 카드가 따라오게
        if (Math.abs(dx) >= Math.abs(dy)) {
          const rot = Math.max(-12, Math.min(12, dx / 18));
          wrap.style.transform = `translateX(${dx}px) rotate(${rot}deg)`;
        }
      },
      { passive: false },
    );

    card.addEventListener("touchend", () => {
      if (!tracking) return;
      tracking = false;

      // touchend 직후 발생할 수 있는 click을 잠깐 막았다가 해제
      const unlockClick = () => (suppressClick = false);
      setTimeout(unlockClick, 250);

      // swipe up -> flip (toggle front/back)
      if (dyLive < -90) {
        card.classList.toggle("is-flipped");
        resetCard();
        return;
      }

      if (dxLive > 90) {
        // swipe right -> urgent
        flyOut(1, () => submitFlashAnswer(true));
        return;
      }
      if (dxLive < -90) {
        // swipe left -> not urgent
        flyOut(-1, () => submitFlashAnswer(false));
        return;
      }

      resetCard();
    });

    flashSwipeBound = true;
  }

  // ---- UI helpers ----
  function appendContent(target, content) {
    if (content == null) return;
    if (Array.isArray(content)) {
      content.forEach((item) => appendContent(target, item));
      return;
    }
    if (typeof content === "string") {
      target.appendChild(document.createTextNode(content));
      return;
    }
    target.appendChild(content);
  }

  function appendSystem(content) {
    const div = document.createElement("div");
    div.className = "casechat-bubble casechat-bubble--system";
    const inner = document.createElement("div");
    inner.className = "casechat-system";
    appendContent(inner, content);
    div.appendChild(inner);
    log.appendChild(div);
  }

  function appendBot(text) {
    const div = document.createElement("div");
    div.className = "casechat-bubble casechat-bubble--bot";
    const inner = document.createElement("div");
    inner.className = "casechat-text";
    inner.textContent = text;
    div.appendChild(inner);
    log.appendChild(div);
    div.scrollIntoView({ block: "end", behavior: "smooth" });
  }
  function renderImageGrid(correctCaseNum) {
    const PENETRATING_CASES = [11, 12];

    const options = (() => {
      // 1️⃣ 기본 후보 (정답 제외)
      let others = [];
      for (let n = 1; n <= TOTAL_CASES; n++) {
        if (n !== correctCaseNum) others.push(n);
      }

      // 2️⃣ 만약 정답이 penetrating이면 → 다른 penetrating 제거
      if (PENETRATING_CASES.includes(correctCaseNum)) {
        others = others.filter((n) => !PENETRATING_CASES.includes(n));
      }

      // 3️⃣ distractor 3개 선택
      const distractors = shuffle(others).slice(0, 3);

      // 4️⃣ 최종 4개 셔플
      return shuffle([correctCaseNum, ...distractors]);
    })();

    const grid = document.createElement("div");
    grid.className = "casechat-imggrid";

    options.forEach((caseNum) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "casechat-imgbtn";
      btn.dataset.caseNum = String(caseNum);

      const img = document.createElement("img");
      img.className = "casechat-imgopt";
      img.src = imgPathForCase(caseNum);
      img.alt = "Diagnosis option image";
      btn.appendChild(img);

      btn.addEventListener("click", () => {
        if (locked) return;
        onPickImage(caseNum, btn);
      });

      grid.appendChild(btn);
    });

    const feedback = document.createElement("div");
    feedback.className = "casechat-imgfeedback";
    feedback.setAttribute("aria-live", "polite");

    log.appendChild(grid);
    log.appendChild(feedback);

    currentGridEl = grid;
    currentFeedbackEl = feedback;
  }

  function renderNextButton() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "casechat-nextcase";
    btn.textContent = "Next case >";
    btn.addEventListener("click", () => startNewCase());

    // ✅ 항상 채팅(로그) 맨 아래로
    log.appendChild(btn);

    btn.scrollIntoView({ block: "end", behavior: "smooth" });
  }

  function showResult(isCorrect, timedOut = false) {
    locked = true;
    stopTimer();
    clearAutoLines();

    if (timedOut) {
      appendSystem("Time is up.");
      renderNextButton();
      return;
    }

    if (isCorrect) {
      appendSystem("Correct.");
      renderNextButton();
      return;
    }

    // incorrect
    attemptsLeft -= 1;

    if (attemptsLeft > 0) {
      appendSystem("Not quite. Try again.");
      locked = false;
      return;
    }

    appendSystem("Incorrect.");
    renderNextButton();
  }

  function clearGridMarks() {
    if (!currentGridEl) return;

    currentGridEl.querySelectorAll(".casechat-imgbtn").forEach((b) => {
      const lockedWrong = b.dataset.lockedWrong === "1";

      // ✅ 첫 오답으로 찍힌 테두리는 유지
      if (lockedWrong) {
        b.classList.remove("is-correct"); // 혹시 모를 상태만 정리
        return;
      }

      b.classList.remove("is-wrong", "is-correct");
    });
  }

  function setFeedbackTryAgain() {
    if (!currentFeedbackEl) return;
    currentFeedbackEl.textContent = "";
    const msg = document.createElement("div");
    msg.className = "casechat-tryagain";
    msg.textContent = "Try again";
    currentFeedbackEl.appendChild(msg);
  }

  function setFeedbackCorrect(diagnosisName) {
    if (!currentFeedbackEl) return;
    currentFeedbackEl.textContent = "";
    const ok = document.createElement("div");
    ok.className = "casechat-resultOk";
    ok.textContent = "Correct.";

    const why = document.createElement("div");
    why.className = "casechat-resultWhy";
    why.appendChild(document.createTextNode("In this case, the diagnosis is "));
    const strong = document.createElement("b");
    strong.textContent = diagnosisName;
    why.appendChild(strong);
    why.appendChild(document.createTextNode("."));

    currentFeedbackEl.appendChild(ok);
    currentFeedbackEl.appendChild(why);
  }

  function setFeedbackIncorrectOutOfAttempts() {
    if (!currentFeedbackEl) return;
    currentFeedbackEl.textContent = "";
    const msg = document.createElement("div");
    msg.className = "casechat-tryagain";
    msg.textContent = "Incorrect.";
    currentFeedbackEl.appendChild(msg);
  }

  function setFeedbackTimeUp() {
    if (!currentFeedbackEl) return;
    currentFeedbackEl.textContent = "";
    const msg = document.createElement("div");
    msg.className = "casechat-tryagain";
    msg.textContent = "Time is up.";
    currentFeedbackEl.appendChild(msg);
  }

  function onPickImage(clickedCaseNum, clickedBtn) {
    const current = activeCase;
    if (!current) return; // 안전장치
    const correctCaseNum = current.caseNum;
    const ok = isCorrectImageChoice(clickedCaseNum, correctCaseNum);

    clearGridMarks();

    if (ok) {
      correctCount += 1;
      clickedBtn.classList.add("is-correct");
      locked = true;
      stopTimer();
      clearAutoLines();

      const dxName = correctDiagnosisForPrimary(current);
      setFeedbackCorrect(dxName);
      renderNextButton();
      return;
    }

    // 오답
    clickedBtn.classList.add("is-wrong");

    attemptsLeft -= 1;

    if (attemptsLeft === 1) clickedBtn.dataset.lockedWrong = "1";

    if (attemptsLeft > 0) {
      // ✅ 1회 남았으면: 빨간 하이라이트 + "Try again"
      setFeedbackTryAgain();
      locked = false;
      return;
    }

    // ✅ 2번 다 틀림: 빨간 하이라이트 유지 + Next case
    locked = true;
    stopTimer();
    clearAutoLines();
    setFeedbackIncorrectOutOfAttempts();
    renderNextButton();
  }

  function startAutoLines(caseObj) {
    const lines = primaryLinesForCase(caseObj);

    if (!Array.isArray(lines) || lines.length === 0) return;

    lines.forEach((line, i) => {
      const t = setTimeout(() => appendBot(line), 1000 + i * 2000);
      autoLineTimeouts.push(t);
    });
  }

  function resetLog() {
    log.textContent = "";
    locked = false;
    attemptsLeft = 2;
    currentGridEl = null;
    currentFeedbackEl = null;
  }

  function showList() {
    chatPage.classList.remove("active");
    listPage.classList.add("active");
    chatPage.style.display = "none";
    listPage.style.display = "";
    stopTimer();
    clearAutoLines();
  }

  function showChat() {
    listPage.classList.remove("active");
    chatPage.classList.add("active");
    listPage.style.display = "none";
    chatPage.style.display = "";

    caseIndex = 0;
    correctCount = 0;

    casePool = buildCasePool();

    resetLog();
    if (!introSeen) {
      showIntroModal();
      return;
    }

    startNewCase();
  }

  // ----- Intro modal (Primary entry) -----
  let introModalEl = null;
  let introSeen = false;

  function ensureIntroModal() {
    if (introModalEl) return introModalEl;

    const modal = document.createElement("div");
    modal.className = "casechat-modal";
    modal.hidden = true;

    const card = document.createElement("div");
    card.className = "casechat-modalCard";

    const top = document.createElement("div");
    top.className = "casechat-modalTop";
    const title = document.createElement("div");
    title.className = "casechat-modalTitle";
    title.textContent = "Case study";
    top.appendChild(title);

    const body = document.createElement("div");
    body.className = "casechat-resultWhy";
    appendLines(body, [
      "Listen to what the patient says and tap",
      "the image that best matches the diagnosis.",
    ]);

    const actions = document.createElement("div");
    actions.className = "casechat-confirm__actions";
    const okBtn = document.createElement("button");
    okBtn.type = "button";
    okBtn.className = "casechat-confirm__btn is-ok";
    okBtn.dataset.action = "ok";
    okBtn.textContent = "OK";
    actions.appendChild(okBtn);

    card.appendChild(top);
    card.appendChild(body);
    card.appendChild(actions);
    modal.appendChild(card);

    modal.addEventListener("click", (e) => {
      const closeBtn = e.target.closest(".casechat-modalClose");
      const okBtn = e.target.closest('[data-action="ok"]');

      if (closeBtn || okBtn) {
        introSeen = true;
        hideIntroModal();
        // ✅ OK 누른 뒤에 케이스 시작
        startNewCase();
      }
    });

    chatPage.appendChild(modal);
    introModalEl = modal;
    return introModalEl;
  }

  function showIntroModal() {
    const modal = ensureIntroModal();
    modal.hidden = false;
  }

  function hideIntroModal() {
    if (!introModalEl) return;
    introModalEl.hidden = true;
  }

  // ----- Completion modal -----
  let completionModalEl = null;

  function ensureCompletionModal() {
    if (completionModalEl) return completionModalEl;

    const modal = document.createElement("div");
    modal.className = "casechat-modal";
    modal.hidden = true;

    const card = document.createElement("div");
    card.className = "casechat-modalCard";

    const top = document.createElement("div");
    top.className = "casechat-modalTop";
    const title = document.createElement("div");
    title.className = "casechat-modalTitle";
    title.textContent = "All cases completed";
    top.appendChild(title);

    const why = document.createElement("div");
    why.className = "casechat-resultWhy";

    const actions = document.createElement("div");
    actions.className = "casechat-confirm__actions";

    const restartBtn = document.createElement("button");
    restartBtn.type = "button";
    restartBtn.className = "casechat-confirm__btn is-ok";
    restartBtn.dataset.action = "restart";
    restartBtn.textContent = "Restart";

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "casechat-confirm__btn is-cancel";
    backBtn.dataset.action = "back";
    appendLines(backBtn, ["Back to", "history taking"]);

    actions.appendChild(restartBtn);
    actions.appendChild(backBtn);

    card.appendChild(top);
    card.appendChild(why);
    card.appendChild(actions);
    modal.appendChild(card);

    modal.addEventListener("click", (e) => {
      const closeBtn = e.target.closest(".casechat-modalClose");
      if (closeBtn) {
        hideCompletionModal();
        return;
      }

      const restartBtn = e.target.closest('[data-action="restart"]');
      if (restartBtn) {
        hideCompletionModal();
        // restart
        caseIndex = 0;
        correctCount = 0;
        casePool = buildCasePool();
        startNewCase();
        return;
      }

      const backBtn = e.target.closest('[data-action="back"]');
      if (backBtn) {
        hideCompletionModal();
        showList();
        return;
      }
    });

    chatPage.appendChild(modal);
    completionModalEl = modal;
    return completionModalEl;
  }

  function showCompletionModal() {
    const modal = ensureCompletionModal();
    // 점수 텍스트 업데이트(동적으로)
    const why = modal.querySelector(".casechat-resultWhy");
    if (why) {
      why.textContent = "";
      why.appendChild(document.createTextNode("You got "));
      const correct = document.createElement("b");
      correct.textContent = String(correctCount);
      why.appendChild(correct);
      why.appendChild(document.createTextNode(" out of "));
      const total = document.createElement("b");
      total.textContent = String(TOTAL_CASES);
      why.appendChild(total);
      why.appendChild(document.createTextNode(" correct."));
    }
    modal.hidden = false;
  }

  function hideCompletionModal() {
    if (!completionModalEl) return;
    completionModalEl.hidden = true;
  }

  function startNewCase() {
    stopTimer();
    clearAutoLines();

    if (caseIndex >= casePool.length) {
      // ✅ 끝: 화면 정리하고 점수 모달 띄우기
      stopTimer();
      clearAutoLines();
      resetLog();
      showCompletionModal();
      return;
    }

    const current = casePool[caseIndex];
    caseIndex += 1;
    activeCase = current;

    resetLog();

    // ✅ Case header 복구
    const caseBlock = document.createElement("div");
    caseBlock.className = "casechat-caseblock";

    const caseIndexEl = document.createElement("div");
    caseIndexEl.className = "casechat-caseindex";
    caseIndexEl.appendChild(document.createTextNode(`Case ${caseIndex}`));

    const caseCount = document.createElement("span");
    caseCount.className = "casechat-casecount";
    caseCount.textContent = `(${caseIndex}/${TOTAL_CASES})`;
    caseIndexEl.appendChild(caseCount);
    caseBlock.appendChild(caseIndexEl);

    appendSystem(caseBlock);

    appendSystem(
      "Listen to what the patient says and tap the image that best matches the diagnosis.",
    );
    const attemptsNote = document.createElement("span");
    attemptsNote.className = "casechat-attemptsNote";
    attemptsNote.textContent = "You only get 2 attempts.";
    appendSystem(attemptsNote);

    renderImageGrid(current.caseNum);
    startTimer();
    startAutoLines(current);
  }

  // ---- click wiring (Primary only) ----
  const onCaseStudyClick = (level) => {
    if (level !== "primary") return;
    showChat();
  };

  function isEnterOrSpace(e) {
    return e.key === "Enter" || e.key === " ";
  }

  // ✅ 어떤 요소를 클릭하든(카드/lesson-row/Start 텍스트 등) 무조건 잡히게
  function routePrimaryEntry(level) {
    if (level === "primary") {
      showChat();
      return;
    }
    if (level === "primary-flashcard") {
      showPrimaryFlashcard();
      return;
    }
  }

  listPage.addEventListener(
    "click",
    (e) => {
      const row = e.target.closest(".lesson-row");
      const inPrimaryCard = e.target.closest("#caseStudyPrimaryCard");
      if (!inPrimaryCard) return;

      e.preventDefault();

      // row가 있으면 row의 data-level로 분기, 없으면 기본(case study)
      const level = row?.dataset?.level || "primary";
      routePrimaryEntry(level);
    },
    true,
  );

  listPage.addEventListener(
    "keydown",
    (e) => {
      if (!isEnterOrSpace(e)) return;

      const row = e.target.closest(".lesson-row");
      const inPrimaryCard = e.target.closest("#caseStudyPrimaryCard");
      if (!inPrimaryCard) return;

      e.preventDefault();

      const level = row?.dataset?.level || "primary";
      routePrimaryEntry(level);
    },
    true,
  );
}
