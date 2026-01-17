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

function correctDiagnosisForPrimary({ caseNum }) {
  if (caseNum === 1) return "Senile cataract";
  if (caseNum === 2) return "Retinoblastoma";
  if (caseNum === 3) return "Gonococcal/Chlamydial conjunctivitis";
  if (caseNum === 4) return "Trachomatous trichiasis with corneal scarring";
  if (caseNum === 5) return "Bacterial / fungal corneal ulcer (traumatic)";
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
      problem: "I can’t really see anything anymore.",
      when: "It started over a year ago.",
      how: "There was no injury, it just came on slowly.",
      eye: "It started in one eye, but now both eyes are affected.",
      pain: "No, there’s no pain or itchiness.",
      redness: "The eye looks white and there’s no discharge.",
      vision: "I can only see shadows now.",
      course: "It’s been gradually getting worse.",
      treatment: "No, I haven’t had any treatment yet.",
      other: "No.",
    };
  }

  if (caseNum === 2 && variant === "progressive") {
    return {
      problem: "I noticed my child’s pupil looking white.",
      when: "It started when my child was around six months old.",
      how: "There was no injury, it just came on slowly.",
      eye: "It started in one eye and now both eyes are affected.",
      pain: "No, there’s no pain or itchiness.",
      redness: "The eyes look white and there’s no discharge.",
      vision: "My child has lost interest in looking around.",
      course: "It’s getting worse.",
      treatment: "No, we haven’t had any treatment yet.",
      other: "An older sibling had a similar problem and sadly passed away.",
    };
  }

  if (caseNum === 2 && variant === "congenital") {
    return {
      problem: "I noticed my child’s pupils looking white.",
      when: "It’s been there since birth.",
      how: "It was present from birth.",
      eye: "Both eyes are affected.",
      pain: "No, there’s no pain or itchiness.",
      redness: "The eyes look white with no discharge.",
      vision: "My child has never really shown any visual interest.",
      course: "It seems to be staying the same.",
      treatment: "No, we haven’t had any treatment yet.",
      other: "The eyes sometimes seem to shimmer and wobble.",
    };
  }

  if (caseNum === 3 && variant === "adult") {
    return {
      problem: "My eye feels sticky.",
      when: "It started about a week ago.",
      how: "It came on gradually over one to two days.",
      eye: "It started in one eye and then affected both.",
      pain: "It’s itchy and sometimes feels gritty.",
      redness: "The eye is pink with yellow discharge.",
      vision: "My vision is blurry.",
      course: "It’s getting worse.",
      treatment: "No, I haven’t had any treatment yet.",
      other: "No.",
    };
  }

  if (caseNum === 3 && variant === "neonate") {
    return {
      problem: "My baby’s eyes look sticky.",
      when: "It started about a week ago.",
      how: "It came on gradually over one to two days.",
      eye: "It started in one eye and then both.",
      pain: "It’s hard to tell.",
      redness: "The eyes are pink with thick yellow discharge.",
      vision: "My baby keeps their eyes shut most of the time.",
      course: "It’s getting worse.",
      treatment: "No, there hasn’t been any treatment yet.",
      other:
        "I’ve been treated for sexually transmitted infections in the past.",
    };
  }

  if (caseNum === 4) {
    return {
      problem: "My eyes feel painful and gritty.",
      when: "It started many months ago.",
      how: "It came on gradually.",
      eye: "Both eyes are affected.",
      pain: "Sometimes they feel itchy.",
      redness: "They’re red and watery.",
      vision: "My vision is blurry.",
      course: "It’s getting worse.",
      treatment: "No, I haven’t had any treatment yet.",
      other: "No.",
    };
  }

  if (caseNum === 5) {
    return {
      problem: "My eye is very painful.",
      when: "It started about two weeks ago.",
      how: "It began after I scratched my eye on a bush.",
      eye: "Only one eye is affected.",
      pain: "It was gritty at first, then became very painful.",
      redness: "The eye is red with sticky yellow discharge.",
      vision: "I can only see shadows now.",
      course: "It’s getting worse.",
      treatment: "No, I haven’t had any treatment yet.",
      other: "No.",
    };
  }

  if (caseNum === 6) {
    return {
      problem: "My eye feels gritty.",
      when: "It started about a week ago.",
      how: "It came on gradually over two to three days.",
      eye: "Only one eye is affected.",
      pain: "Bright light is painful.",
      redness: "The eye looks pink and watery.",
      vision: "My vision is blurry.",
      course: "It’s gradually getting worse.",
      treatment: "No, I haven’t had any treatment yet.",
      other:
        "I had a painful patch of broken skin on my lip about a week before this started.",
    };
  }

  if (caseNum === 7) {
    return {
      problem: "Bright light really hurts my eye.",
      when: "It started about a week ago.",
      how: "It came on gradually over one to two days.",
      eye: "Only one eye is affected.",
      pain: "Light is painful but there’s no itch.",
      redness: "The eye is pink and watery.",
      vision: "My vision is slightly blurred.",
      course: "It’s getting worse.",
      treatment: "No, I haven’t had any treatment yet.",
      other: "I’ve had several episodes like this before.",
    };
  }

  if (caseNum === 8) {
    return {
      problem: "I noticed a pink patch on my eye.",
      when: "It started many months ago.",
      how: "It came on slowly and there was no injury.",
      eye: "Only one eye is affected.",
      pain: "It feels a bit gritty.",
      redness: "The eye looks mostly white but a bit watery.",
      vision: "My vision seems normal.",
      course: "It’s slowly getting worse.",
      treatment: "No, I haven’t had any treatment yet.",
      other: "I work outdoors in the fields every day.",
    };
  }

  if (caseNum === 9) {
    return {
      problem: "My eye feels gritty.",
      when: "It started about a week ago.",
      how: "It began after working under my car.",
      eye: "Only one eye is affected.",
      pain: "Bright light feels uncomfortable.",
      redness: "The eye is a little bit pink.",
      vision: "My vision is slightly blurred.",
      course: "It’s getting worse.",
      treatment: "No, I haven’t had any treatment yet.",
      other: "No.",
    };
  }

  if (caseNum === 10) {
    return {
      problem: "I’ve lost vision in my eye.",
      when: "It started about four days ago.",
      how: "It happened after I was punched.",
      eye: "Only one eye is affected.",
      pain: "It’s painful and watery.",
      redness: "The eye is red.",
      vision: "I can only see shadows.",
      course: "It seems to be staying the same.",
      treatment: "No, I haven’t had any treatment yet.",
      other: "No.",
    };
  }

  if (caseNum === 11) {
    return {
      problem: "My eye is painful.",
      when: "It started about three days ago.",
      how: "It happened after I was hit in the face with a stick.",
      eye: "Only one eye is affected.",
      pain: "It feels gritty but not itchy.",
      redness: "The eye is pink and watery.",
      vision: "My vision is blurry.",
      course: "It’s getting worse.",
      treatment: "No, I haven’t had any treatment yet.",
      other: "No.",
    };
  }

  if (caseNum === 12) {
    return {
      problem: "I’ve suddenly lost vision in my eye.",
      when: "It started yesterday.",
      how: "It happened after I was hit in the eye with a stick.",
      eye: "Only one eye is affected.",
      pain: "It’s painful.",
      redness: "The eye is red and watery.",
      vision: "I can only see shadows.",
      course: "It’s getting worse.",
      treatment: "No, I haven’t had any treatment yet.",
      other: "No.",
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
    ? "What is the diagnosis?"
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
  if (!listPage || !chatPage) return;

  const log = chatPage.querySelector("#casePrimaryChatLog");
  const timerText = chatPage.querySelector("#casePrimaryTimerText");
  const timerFg = chatPage.querySelector("#casePrimaryTimerFg");

  if (!log || !timerText || !timerFg) return;

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

    // circle progress (stroke-dasharray)
    // 100% = 100, 0% = 0 (간단히 비율로 표시)
    const pct = Math.max(0, Math.min(1, timerLeft / TIMER_TOTAL));
    const dash = (pct * 100).toFixed(1);
    timerFg.setAttribute("stroke-dasharray", `${dash}, 100`);
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

  // ---- UI helpers ----
  function appendSystem(text) {
    const div = document.createElement("div");
    div.className = "casechat-bubble casechat-bubble--system";
    div.innerHTML = `<div class="casechat-system">${text}</div>`;
    log.appendChild(div);
  }

  function appendBot(text) {
    const div = document.createElement("div");
    div.className = "casechat-bubble casechat-bubble--bot";
    div.innerHTML = `<div class="casechat-text">${text}</div>`;
    log.appendChild(div);
    div.scrollIntoView({ block: "end", behavior: "smooth" });
  }

  function renderImageGrid(correctCaseNum) {
    const options = (() => {
      const others = [];
      for (let n = 1; n <= TOTAL_CASES; n++) {
        if (n !== correctCaseNum) others.push(n);
      }
      const distractors = shuffle(others).slice(0, 3);
      return shuffle([correctCaseNum, ...distractors]);
    })();

    const grid = document.createElement("div");
    grid.className = "casechat-imggrid";

    options.forEach((caseNum) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "casechat-imgbtn";
      btn.setAttribute("aria-label", `Image option ${caseNum}`);
      btn.dataset.caseNum = String(caseNum);

      btn.innerHTML = `<img class="casechat-imgopt" src="${imgPathForCase(
        caseNum,
      )}" alt="Diagnosis option image" />`;

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
    btn.textContent = "Next case";
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
      b.classList.remove("is-wrong", "is-correct");
    });
  }

  function setFeedbackTryAgain() {
    if (!currentFeedbackEl) return;
    currentFeedbackEl.innerHTML = `<div class="casechat-tryagain">Try again</div>`;
  }

  function setFeedbackCorrect(diagnosisName) {
    if (!currentFeedbackEl) return;
    currentFeedbackEl.innerHTML = `
    <div class="casechat-resultOk">Correct.</div>
    <div class="casechat-resultWhy">In this case, the diagnosis is <b>${diagnosisName}</b>.</div>
  `;
  }

  function setFeedbackIncorrectOutOfAttempts() {
    if (!currentFeedbackEl) return;
    currentFeedbackEl.innerHTML = `<div class="casechat-tryagain">Incorrect.</div>`;
  }

  function setFeedbackTimeUp() {
    if (!currentFeedbackEl) return;
    currentFeedbackEl.innerHTML = `<div class="casechat-tryagain">Time is up.</div>`;
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
    log.innerHTML = "";
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

    modal.innerHTML = `
    <div class="casechat-modalCard">
      <div class="casechat-modalTop">
        <div class="casechat-modalTitle">Case study</div>
          </div>

      <div class="casechat-resultWhy">
        Listen to what the patient says and tap<br />the image that best matches the diagnosis.
        </div>

      <div class="casechat-confirm__actions">
        <button type="button" class="casechat-confirm__btn is-ok" data-action="ok">OK</button>
      </div>
    </div>
  `;

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

    modal.innerHTML = `
      <div class="casechat-modalCard">
    <div class="casechat-modalTop">
      <div class="casechat-modalTitle">All cases completed</div>
         </div>

    <div class="casechat-resultWhy">
      You got <b>${correctCount}</b> out of <b>${TOTAL_CASES}</b> correct.
    </div>

    <div class="casechat-confirm__actions">
      <button type="button" class="casechat-confirm__btn is-ok" data-action="restart">Restart</button>
      <button type="button" class="casechat-confirm__btn is-cancel" data-action="back">Back to history taking</button>
    </div>
  </div>
    `;

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
      why.innerHTML = `You got <b>${correctCount}</b> out of <b>${TOTAL_CASES}</b> correct.`;
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
    appendSystem(`
  <div class="casechat-caseblock">
    <div class="casechat-caseindex">
      Case ${caseIndex}
      <span class="casechat-casecount">(${caseIndex}/${TOTAL_CASES})</span>
    </div>
  </div>
`);

    appendSystem(
      "Listen to what the patient says and tap the image that best matches the diagnosis.",
    );
    appendSystem(
      `<span class="casechat-attemptsNote">You only get 2 attempts.</span>`,
    );

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
  listPage.addEventListener(
    "click",
    (e) => {
      const hit =
        e.target.closest("#caseStudyPrimaryCard") ||
        e.target.closest('.lesson-row[data-level="primary"]');
      if (!hit) return;

      e.preventDefault();
      onCaseStudyClick("primary");
    },
    true, // ✅ CAPTURE 단계로 강제
  );

  listPage.addEventListener(
    "keydown",
    (e) => {
      if (!isEnterOrSpace(e)) return;

      const hit =
        e.target.closest("#caseStudyPrimaryCard") ||
        e.target.closest('.lesson-row[data-level="primary"]');
      if (!hit) return;

      e.preventDefault();
      onCaseStudyClick("primary");
    },
    true, // ✅ CAPTURE
  );

  // ⬅️ 뒤로가기 버튼이 Primary 페이지에 없다면, 일단 ESC 등으로 나가는 로직은 나중에 추가 가능
  // 지금 단계 목표는 “Primary가 계획대로 동작”이니까 showList는 다음 단계에서 UI에 연결해도 됨.
}
