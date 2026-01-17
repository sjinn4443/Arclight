// public/js/casestudy.js

// ---------- utilities ----------
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCasePool() {
  const pool = [
    { caseNum: 1, variant: "elderly" },

    // case 2 variants
    { caseNum: 2, variant: "progressive" },
    { caseNum: 2, variant: "congenital" },

    // case 3 variants
    { caseNum: 3, variant: "adult" },
    { caseNum: 3, variant: "neonate" },

    // remaining single cases
    { caseNum: 4, variant: null },
    { caseNum: 5, variant: null },
    { caseNum: 6, variant: null },
    { caseNum: 7, variant: null },
    { caseNum: 8, variant: null },
    { caseNum: 9, variant: null },
    { caseNum: 10, variant: null },
    { caseNum: 11, variant: null },
    { caseNum: 12, variant: null },
  ];

  // group by caseNum and randomly pick one variant per case
  const grouped = {};
  pool.forEach((c) => {
    if (!grouped[c.caseNum]) grouped[c.caseNum] = [];
    grouped[c.caseNum].push(c);
  });

  return shuffle(
    Object.values(grouped).map(
      (arr) => arr[Math.floor(Math.random() * arr.length)],
    ),
  );
}

function ageIntroForCase({ caseNum, variant }) {
  if (caseNum === 1) return "This patient is 78 years old";

  if (caseNum === 2 && variant === "progressive")
    return "This patient is 12 months old";
  if (caseNum === 2 && variant === "congenital")
    return "This patient is 12 months old";

  if (caseNum === 3 && variant === "adult")
    return "This patient is 18 years old";
  if (caseNum === 3 && variant === "neonate")
    return "This patient is 2 weeks old";

  if (caseNum === 4) return "This patient is 38 years old";
  if (caseNum === 5) return "This patient is 29 years old";
  if (caseNum === 6) return "This patient is 21 years old";
  if (caseNum === 7) return "This patient is 21 years old";
  if (caseNum === 8) return "This patient is 69 years old";
  if (caseNum === 9) return "This patient is 21 years old";
  if (caseNum === 10) return "This patient is 32 years old";
  if (caseNum === 11) return "This patient is 8 years old";
  if (caseNum === 12) return "This patient is 8 years old";

  return "";
}

function pickRandomCase() {
  const caseNum = 1 + Math.floor(Math.random() * 12);
  if (caseNum === 1) {
    const variant = Math.random() < 0.5 ? "infant" : "elderly";
    return { caseNum, variant };
  }
  return { caseNum, variant: null };
}

function imgPathForCase(caseNum) {
  return `/images/casestudy/case${caseNum}_eye.webp`;
}

// ---------- data ----------
const QUESTIONS = [
  { id: "problem", label: "problem", ui: "What seems to be the main problem?" },
  { id: "when", label: "when", ui: "When did it start?" },
  { id: "how", label: "how", ui: "How did it start?" },
  { id: "eye", label: "one/both", ui: "Is it affecting one eye or both eyes?" },
  { id: "pain", label: "pain/itch", ui: "Do you have any pain or itchiness?" },
  {
    id: "redness",
    label: "redness/discharge",
    ui: "Have you noticed any redness or discharge?",
  },
  {
    id: "vision",
    label: "vision",
    ui: "Have you noticed any loss of vision?",
  },
  {
    id: "course",
    label: "worse/better",
    ui: "Is it getting worse or better?",
  },
  {
    id: "treatment",
    label: "treatment",
    ui: "Have you had any treatment so far?",
  },
  {
    id: "other",
    label: "anything else",
    ui: "Is there anything else you want to tell me?",
  },
];

const DIAGNOSES = [
  "Congenital cataract",
  "Senile cataract",
  "Retinoblastoma",
  "Gonococcal/Chlamydial conjunctivitis",
  "Trachomatous trichiasis with corneal scarring",
  "Bacterial / fungal corneal ulcer (traumatic)",
  "Herpes simplex keratitis",
  "Anterior Uveitis",
  "Pterygium",
  "Corneal foreign body with early infection",
  "Traumatic hyphaema",
  "Penetrating corneal laceration with iris prolapse",
  "Penetrating injury causing traumatic cataract",
];

function caseAnswers({ caseNum, variant }) {
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

function correctDiagnosisForCase({ caseNum, variant }) {
  if (caseNum === 1 && variant === "infant") return "Congenital cataract";
  if (caseNum === 1 && variant === "elderly") return "Senile cataract";
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

function explanationForCase({ caseNum, variant }) {
  if (caseNum === 1 && variant === "infant")
    return "A white pupil present from birth, with poor vision, fits congenital cataract.";
  if (caseNum === 1 && variant === "elderly")
    return "Gradual, painless worsening vision over months in an older adult fits senile cataract.";
  if (caseNum === 2)
    return "A white pupil in a young child with reduced visual engagement is concerning for retinoblastoma.";
  if (caseNum === 3)
    return "Acute onset, pink eye, yellow discharge and worsening symptoms fit severe conjunctivitis.";
  if (caseNum === 4)
    return "Long-term irritation with painful gritty sensation, red eye and blurred vision fits trichiasis with scarring.";
  if (caseNum === 5)
    return "Corneal trauma followed by increasing pain, redness and vision loss suggests a corneal ulcer.";
  if (caseNum === 6)
    return "Unilateral gritty watery eye with a recent lip lesion fits herpes simplex keratitis.";
  if (caseNum === 7)
    return "Photophobia with watery eye and blurred vision suggests anterior uveitis.";
  if (caseNum === 8)
    return "Slowly progressive irritation and blur in an older person, often one eye, fits pterygium.";
  if (caseNum === 9)
    return "Foreign body exposure (working under a car) with gritty, worsening symptoms suggests a retained foreign body with early infection.";
  if (caseNum === 10)
    return "Blunt trauma with red eye and very poor vision suggests hyphaema.";
  if (caseNum === 11)
    return "Stick injury with pain, red eye and worsening vision can indicate a penetrating corneal laceration.";
  if (caseNum === 12)
    return "Stick injury with very poor vision and red eye can indicate penetrating injury causing traumatic cataract.";
  return "";
}

// ---------- init ----------
export function initializeCaseStudyPrimary() {
  const listPage = document.getElementById("casestudyPage");
  const chatPage = document.getElementById("caseStudyChatPagePrimary");
  if (!listPage || !chatPage) return;

  // ---------- list accordion ----------
  listPage.querySelectorAll(".level-card .level-header").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".level-card");
      const body = card?.querySelector(".level-body");
      const chevron = card?.querySelector(".level-chevron");
      if (!body) return;

      const willOpen = body.hasAttribute("hidden");

      // close all
      listPage
        .querySelectorAll(".level-card .level-body")
        .forEach((b) => b.setAttribute("hidden", ""));
      listPage
        .querySelectorAll(".level-card .level-chevron")
        .forEach((c) => (c.textContent = "›"));

      if (willOpen) {
        body.removeAttribute("hidden");
        if (chevron) chevron.textContent = "⌄";
      }
    });
  });

  // ---------- chat UI wiring ----------
  const log = chatPage.querySelector("#caseChatLog");
  const choices = chatPage.querySelector("#caseChatChoices");
  const submitBtn = chatPage.querySelector("#caseChatSubmitBtn");
  const backBtn = chatPage.querySelector("#caseChatBackBtn");
  const draftEl = chatPage.querySelector("#caseChatDraft");
  const sendBtn = chatPage.querySelector("#caseChatSendBtn");
  const toggleBtn = chatPage.querySelector("#caseChatToggleBtn");
  const footer = chatPage.querySelector(".casechat-footer");

  const dxModal = chatPage.querySelector("#caseDxModal");
  const dxCard = chatPage.querySelector("#caseDxCard");
  const dxList = chatPage.querySelector("#caseDxList");
  const dxClose = chatPage.querySelector("#caseDxCloseBtn");

  const dxTimerText = chatPage.querySelector("#caseDxTimerText");
  const dxTrialText = chatPage.querySelector("#caseDxTrialText");
  const dxTimerFg = chatPage.querySelector("#caseDxTimerFg");

  const timerBtn = chatPage.querySelector("#caseTimerBtn");
  const timerText = chatPage.querySelector("#caseTimerText");
  const timerFg = chatPage.querySelector(".caseTimer__fg");

  const imgPenaltyModal = chatPage.querySelector("#caseImgPenaltyModal");
  const imgPenaltyClose = chatPage.querySelector("#caseImgPenaltyCloseBtn");
  const imgPenaltyCancel = chatPage.querySelector("#caseImgPenaltyCancelBtn");
  const imgPenaltyOk = chatPage.querySelector("#caseImgPenaltyOkBtn");

  const finalModal = chatPage.querySelector("#caseFinalModal");
  const finalBody = chatPage.querySelector("#caseFinalBody");
  const finalClose = chatPage.querySelector("#caseFinalCloseBtn");
  const finalOk = chatPage.querySelector("#caseFinalOkBtn");

  const resultModal = chatPage.querySelector("#caseResultModal");
  const resultBody = chatPage.querySelector("#caseResultBody");
  const resultClose = chatPage.querySelector("#caseResultCloseBtn");
  const nextBtn = chatPage.querySelector("#caseNextBtn");
  const resultTitle = chatPage.querySelector("#caseResultTitle");

  let revealTimeout = null;

  function hideCaseImage() {
    const wrap = log.querySelector(".casechat-imgwrap");
    if (!wrap) return;
    wrap.classList.remove("is-revealed");
  }

  function revealCaseImageFor2s() {
    const wrap = log.querySelector(".casechat-imgwrap");
    if (!wrap) return;

    wrap.classList.add("is-revealed");

    if (revealTimeout) clearTimeout(revealTimeout);
    revealTimeout = setTimeout(() => {
      wrap.classList.remove("is-revealed");
    }, 2000);
  }

  function isTapOnImageCover(e) {
    const target = e.target;
    if (!(target instanceof Element)) return null;
    return target.closest(".casechat-imgcover");
  }

  async function handleImageCoverTap(e) {
    const btn = isTapOnImageCover(e);
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const ok = await confirmImagePenalty();
    if (!ok) return;

    // 10s penalty
    setTimerLeft(timerLeft - 10);

    // if penalty hits 0, setTimerLeft will open diagnosis automatically
    if (timerLeft > 0) revealCaseImageFor2s();
  }

  function openFinalModal() {
    if (finalBody) {
      finalBody.innerHTML = `
      <div class="casechat-resultWhy">Final score: <b>${scoreCorrect}/${scoreTotal}</b></div>
    `;
    }
    if (finalModal) finalModal.hidden = false;
  }
  function closeFinalModal() {
    if (finalModal) finalModal.hidden = true;
  }
  finalClose?.addEventListener("click", closeFinalModal);
  finalOk?.addEventListener("click", closeFinalModal);

  // ✅ 모바일에서 click이 안 잡히는 경우가 있어서 pointerup도 같이 받음
  log.addEventListener("click", handleImageCoverTap);
  log.addEventListener("pointerup", handleImageCoverTap);

  function confirmImagePenalty() {
    return new Promise((resolve) => {
      if (!imgPenaltyModal) return resolve(false);

      const close = (val) => {
        imgPenaltyModal.hidden = true;
        cleanup();
        resolve(val);
      };

      const onOk = () => close(true);
      const onCancel = () => close(false);

      const cleanup = () => {
        imgPenaltyOk?.removeEventListener("click", onOk);
        imgPenaltyCancel?.removeEventListener("click", onCancel);
        imgPenaltyClose?.removeEventListener("click", onCancel);
      };

      imgPenaltyModal.hidden = false;

      imgPenaltyOk?.addEventListener("click", onOk);
      imgPenaltyCancel?.addEventListener("click", onCancel);
      imgPenaltyClose?.addEventListener("click", onCancel);
    });
  }

  if (!log || !choices) {
    console.warn(
      "[casestudy] chatPage missing #caseChatLog or #caseChatChoices",
    );
    return;
  }

  // initial chips state: hidden
  if (choices) choices.hidden = true;
  chatPage.style.setProperty("--casechat-log-pad", "140px");
  if (footer) footer.classList.add("is-collapsed"); // ✅ footer 닫힘 모드

  if (toggleBtn) toggleBtn.textContent = "Q";
  if (draftEl) draftEl.classList.add("is-placeholder");

  // 강제 초기 상태 (✅ “들어가자마자 Result 모달 떠있음” 방지)
  function forceCloseModals() {
    if (dxModal) dxModal.hidden = true;
    if (resultModal) resultModal.hidden = true;
    if (resultBody) resultBody.innerHTML = "";
    if (resultTitle) resultTitle.textContent = "Result";
  }

  let state = { current: null, answeredImageShown: false, asked: new Set() };
  let caseIndex = 0;
  let scoreCorrect = 0; // initial answer correct count
  let scoreTotal = 0; // how many cases have been scored

  let casePool = buildCasePool();

  function ordinalWord(n) {
    const words = [
      "First",
      "Second",
      "Third",
      "Fourth",
      "Fifth",
      "Sixth",
      "Seventh",
      "Eighth",
      "Ninth",
      "Tenth",
      "Eleventh",
      "Twelfth",
      "Thirteenth",
    ];
    return words[n - 1] || `${n}th`;
  }

  const TOTAL_CASES = 12;

  let pending = null;
  let dxLocked = false;

  const TIMER_TOTAL = 40;
  let timerLeft = TIMER_TOTAL;
  let timerInterval = null;

  // ---- Dx modal timer & trials ----
  const DX_TIMER_TOTAL = 10;
  let dxTimerLeft = DX_TIMER_TOTAL;
  let dxTimerInterval = null;
  let dxAttemptsLeft = 2;
  let caseScored = false; // ✅ 한 케이스를 1번만 채점하기 위한 플래그

  function stopDxTimer() {
    if (dxTimerInterval) {
      clearInterval(dxTimerInterval);
      dxTimerInterval = null;
    }
  }

  function renderDxTimer() {
    if (dxTimerText) dxTimerText.textContent = String(dxTimerLeft);

    const pct = Math.max(0, Math.min(1, dxTimerLeft / DX_TIMER_TOTAL));
    if (dxTimerFg) {
      dxTimerFg.style.strokeDasharray = "100 100";
      dxTimerFg.style.strokeDashoffset = String(100 * (1 - pct));
    }
  }

  function renderDxTrials() {
    if (!dxTrialText) return;
    // 문구는 요청대로 비슷하게
    dxTrialText.textContent =
      dxAttemptsLeft === 2
        ? "You only get 2 attempts."
        : `Attempts left: ${dxAttemptsLeft}`;
  }

  function failDxAndMoveOn(reasonText) {
    dxLocked = true;
    stopDxTimer();

    // 선택지 비활성화
    const all = dxList?.querySelectorAll(".casechat-dxitem") || [];
    all.forEach((b) => {
      b.disabled = true;
      b.classList.add("is-disabled");
    });

    // 점수 처리(틀린 것으로 확정)
    if (!caseScored) {
      scoreTotal += 1;
      caseScored = true;
    }

    // 안내 + Next case 버튼
    if (dxCard) {
      dxCard.innerHTML = "";

      const msg = document.createElement("div");
      msg.className = "casechat-tryagain";
      msg.innerHTML = reasonText;
      dxCard.appendChild(msg);

      const next = document.createElement("button");
      next.type = "button";
      next.className = "casechat-nextcase";
      next.textContent = "Next case";
      next.addEventListener("click", () => {
        closeDxModal();
        startNewCase();
      });
      dxCard.appendChild(next);
    }
  }

  function startDxTimer() {
    stopDxTimer();
    dxTimerLeft = DX_TIMER_TOTAL;
    renderDxTimer();

    dxTimerInterval = setInterval(() => {
      dxTimerLeft -= 1;
      renderDxTimer();

      if (dxTimerLeft <= 0) {
        dxTimerLeft = 0;
        renderDxTimer();
        // 10초 끝나면 자동 실패 처리
        failDxAndMoveOn("Time is up<br />Move on to the next case");
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function renderTimer() {
    if (timerText) timerText.textContent = String(timerLeft);

    // SVG ring progress (0..100)
    const pct = Math.max(0, Math.min(1, timerLeft / TIMER_TOTAL));
    // pathLength is treated as 100 via stroke-dasharray below
    if (timerFg) {
      timerFg.style.strokeDasharray = "100 100";
      timerFg.style.strokeDashoffset = String(100 * (1 - pct));
    }
  }

  function setTimerLeft(next) {
    timerLeft = Math.max(0, Math.min(TIMER_TOTAL, next));
    renderTimer();

    if (timerLeft === 0) {
      // time up: force diagnosis modal
      stopTimer();
      openDxModal(true); // <-- 아래에서 openDxModal을 force 지원하도록 바꿀 거야
    }
  }

  function startTimer() {
    stopTimer();
    timerLeft = TIMER_TOTAL;
    renderTimer();

    timerInterval = setInterval(() => {
      setTimerLeft(timerLeft - 1);
    }, 1000);
  }

  function appendBubble(kind, html) {
    const wrap = document.createElement("div");
    wrap.className = `casechat-bubble casechat-bubble--${kind}`;
    wrap.innerHTML = html;
    log.appendChild(wrap);

    requestAnimationFrame(keepLastMessageVisible);
  }

  function keepLastMessageVisible() {
    const last = log.lastElementChild;
    if (!last) return;

    // log와 footer의 위치(뷰포트 기준)
    const logRect = log.getBoundingClientRect();
    const footerRect = footer?.getBoundingClientRect();

    // log 영역 안에서 "실제로 보이는 바닥"을 안전선으로 잡기
    // footer가 log 위를 덮으면 footer.top이 시각적 바닥이 됨
    const visualBottom = footerRect
      ? Math.min(logRect.bottom, footerRect.top)
      : logRect.bottom;

    const safeBottom = visualBottom - 16; // 여유값(원하면 12~24 사이로 조절)

    const lastRect = last.getBoundingClientRect();

    // 마지막 버블이 안전선 아래로 내려가 가려지면, log 자체를 올린다
    if (lastRect.bottom > safeBottom) {
      const delta = lastRect.bottom - safeBottom;

      log.scrollTo({
        top: log.scrollTop + delta,
        behavior: "smooth",
      });
    }
  }

  function appendSystem(text) {
    appendBubble("system", `<div class="casechat-system">${text}</div>`);
  }
  function appendUser(text) {
    appendBubble("user", `<div class="casechat-text">${text}</div>`);
  }
  function appendBot(text, maybeImgSrc) {
    let html = `<div class="casechat-botstack">`;

    if (maybeImgSrc) {
      html += `
    <div class="casechat-imgwrap" data-imgsrc="${maybeImgSrc}">
      <img class="casechat-img" src="${maybeImgSrc}" alt="Case image" />
      <button type="button" class="casechat-imgcover" aria-label="View case image for 2 seconds">
        <div class="casechat-imgcover__text">Tap to view the case image<br />for 2 seconds</div>
      </button>
    </div>
  `;
    }

    // ✅ 텍스트가 있을 때만 말풍선 생성
    if (text && text.trim() !== "") {
      html += `<div class="casechat-text">${text}</div>`;
    }

    html += `</div>`;

    appendBubble("bot", html);
  }

  function appendBotTyping(dots = "...") {
    const log = document.getElementById("caseChatLog");
    if (!log) return null;

    const bubble = document.createElement("div");
    bubble.className =
      "casechat-bubble casechat-bubble--bot casechat-bubble--typing is-typing";

    // ✅ 나중에 querySelector(".casechat-text")로 교체 가능하게 구조 맞춤
    bubble.innerHTML = `<div class="casechat-text">${dots}</div>`;
    log.appendChild(bubble);

    requestAnimationFrame(keepLastMessageVisible);
    return bubble;
  }

  function calcTypingDelay(answerText) {
    // ✅ 답변 길이 기반으로 표시 시간 가변 (너가 원한 behaviour)
    const len = (answerText || "").trim().length;

    // 350ms ~ 1800ms 범위로 clamp
    const min = 350;
    const max = 1800;

    // 글자 수에 비례해 늘리되 너무 길면 cap
    const ms = min + Math.min(1450, Math.floor(len * 18));
    return Math.max(min, Math.min(max, ms));
  }

  function renderChoices() {
    choices.innerHTML = "";

    QUESTIONS.forEach((q) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "casechat-chip";
      btn.textContent = q.label;

      // 이미 보낸 질문은 비활성화
      btn.disabled = state.asked.has(q.id);

      // pending 선택 표시(선택된 칩 스타일용)
      if (pending?.id === q.id) btn.classList.add("is-selected");

      btn.addEventListener("click", () => {
        if (state.asked.has(q.id)) return;

        pending = q;

        if (draftEl) {
          draftEl.textContent = q.ui;
          draftEl.classList.remove("is-placeholder");
        }

        if (sendBtn) sendBtn.disabled = false;

        // 선택 표시 업데이트
        renderChoices();
      });

      choices.appendChild(btn);
    });
  }

  function openDxModal(force = false) {
    if (!force && (!state?.asked || state.asked.size === 0)) {
      appendSystem("Please ask at least one question before submitting.");
      return;
    }

    if (!state.current) return;

    // 모달 강제 닫힘 상태 정리
    if (dxCard) dxCard.innerHTML = "";
    dxLocked = false;

    dxAttemptsLeft = 2;
    renderDxTrials();
    startDxTimer();

    // Dx 리스트 채우기 (랜덤 순서)
    if (dxList) {
      dxList.innerHTML = "";

      const correct = correctDiagnosisForCase(state.current);
      const others = DIAGNOSES.filter((d) => d !== correct);
      const sampled = shuffle(others).slice(0, 4);
      const options = shuffle([correct, ...sampled]);

      options.forEach((name) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "casechat-dxitem";
        btn.setAttribute("role", "radio");
        btn.setAttribute("aria-checked", "false");

        // 사진 1처럼: 라디오(동그라미) + 라벨
        btn.innerHTML = `
      <span class="casechat-radio"></span>
      <span class="casechat-dxlabel">${name}</span>
    `;

        btn.addEventListener("click", () => {
          if (dxLocked) return;

          // 선택 상태 정리
          dxList.querySelectorAll(".casechat-dxitem").forEach((b) => {
            b.classList.remove("is-selected", "is-wrong", "is-correct");
            b.setAttribute("aria-checked", "false");
          });

          // 지금 누른 것만 선택 표시
          btn.classList.add("is-selected");
          btn.setAttribute("aria-checked", "true");

          // 정답 체크
          onPickDiagnosis(name, btn);
        });

        dxList.appendChild(btn);
      });
    }

    if (dxModal) dxModal.hidden = false;

    stopTimer();
  }

  function startNewCase() {
    forceCloseModals();

    if (casePool.length === 0) {
      // 1) 화면 내용 전부 제거 (기존 채팅, img 포함)
      log.innerHTML = "";

      // 2) 모달/선택 상태 정리
      forceCloseModals();
      pending = null;

      // 3) footer UI는 비활성화 (원하면 유지 가능)
      if (submitBtn) submitBtn.disabled = true;
      if (choices) {
        choices.hidden = true;
        choices.innerHTML = "";
      }

      if (draftEl) {
        draftEl.textContent = "- Click here to select a question";
        draftEl.classList.add("is-placeholder");
      }
      if (sendBtn) sendBtn.disabled = true;
      if (toggleBtn) toggleBtn.textContent = "Q";

      // footer는 반투명 유지하되 접어두기
      if (footer) footer.classList.add("is-collapsed");

      // 4) ✅ “First case, Second case” 뜨는 자리(= system bubble)에 표시
      openFinalModal();
      return;

      return;
    }

    state.current = casePool.shift();

    state.answeredImageShown = false;
    state.asked = new Set();

    caseScored = false;

    log.innerHTML = "";
    caseIndex += 1;

    const ageIntro = ageIntroForCase(state.current);

    appendSystem(`
  <div class="casechat-caseblock">
    <div class="casechat-caseindex">
      Case ${caseIndex}
      <span class="casechat-casecount">(${caseIndex}/${TOTAL_CASES})</span>
    </div>
    ${ageIntro ? `<div class="casechat-caseindex">${ageIntro}</div>` : ""}
  </div>
  <span class="casechat-firstprompt">Take a history to work out what is wrong</span>
`);

    appendBot("", imgPathForCase(state.current.caseNum));
    state.answeredImageShown = true;

    hideCaseImage();

    renderChoices();
    if (submitBtn) submitBtn.disabled = true;

    startTimer();
  }

  function onAsk(q) {
    if (state.asked.has(q.id)) return;
    state.asked.add(q.id);
    renderChoices();
    if (submitBtn) submitBtn.disabled = false;

    appendUser(q.ui);

    const answers = caseAnswers(state.current);
    const reply = answers?.[q.id] || "No.";

    // 1) 답변 길이에 따라 dots(… 개수)도 가변
    const len = (reply || "").trim().length;
    const dotsCount = Math.max(3, Math.min(7, 3 + Math.floor(len / 40)));
    const dots = ".".repeat(dotsCount);

    // 2) 먼저 typing 말풍선을 띄움
    const typingBubble = appendBotTyping(dots);

    // 3) 답변 길이에 따라 typing 표시 시간 결정
    const delay = calcTypingDelay(reply);

    // 4) delay 후에 typingBubble을 실제 답변으로 교체
    setTimeout(() => {
      if (!typingBubble) {
        appendBot(reply);
        return;
      }

      const textEl = typingBubble.querySelector(".casechat-text");
      if (textEl) textEl.textContent = reply;

      // typing 스타일 제거
      typingBubble.classList.remove("casechat-bubble--typing", "is-typing");

      requestAnimationFrame(keepLastMessageVisible);
    }, delay);
  }

  function closeDxModal() {
    stopDxTimer();
    if (dxModal) dxModal.hidden = true;
  }

  function openResultModal(title, html) {
    resultTitle.textContent = title;
    resultBody.innerHTML = html;
    resultModal.hidden = false;
  }

  function closeResultModal() {
    resultModal.hidden = true;
  }

  function shake(el) {
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  }

  function onPickDiagnosis(name, pickedBtn) {
    const correct = correctDiagnosisForCase(state.current);

    // 기존 피드백 지우기
    if (dxCard) dxCard.innerHTML = "";

    // 오답
    if (name !== correct) {
      pickedBtn.classList.add("is-selected");
      pickedBtn.classList.add("is-wrong");
      pickedBtn.setAttribute("aria-checked", "true");

      dxAttemptsLeft -= 1;
      renderDxTrials();

      if (dxAttemptsLeft > 0) {
        const hint = document.createElement("div");
        hint.className = "casechat-tryagain";
        hint.textContent = "Try again";
        dxCard.appendChild(hint);
        return;
      }

      // ✅ 2번 다 틀렸으면 다음 케이스로
      failDxAndMoveOn("You have used both attempts. Moving to the next case.");
      return;
    }

    // 정답이면 더 이상 선택 못 하게 잠금
    dxLocked = true;
    stopDxTimer();

    if (!caseScored) {
      scoreCorrect += 1;
      scoreTotal += 1;
      caseScored = true;
    }

    // 정답
    pickedBtn.classList.add("is-selected");
    pickedBtn.classList.add("is-correct");
    pickedBtn.setAttribute("aria-checked", "true");

    // 다른 선택지 비활성화 (원하면 유지)
    const all = dxList?.querySelectorAll(".casechat-dxitem") || [];
    all.forEach((b) => {
      if (b !== pickedBtn) {
        b.disabled = true;
        b.classList.add("is-disabled");
      }
    });

    // 사진 2처럼: Correct + 설명 + Next case 버튼
    const msg = document.createElement("div");
    msg.className = "casechat-correctmsg";
    const imgSrc = imgPathForCase(state.current.caseNum);

    msg.innerHTML = `
  <div class="casechat-resultOk">Correct.</div>
  <img class="casechat-resultimg" src="${imgSrc}" alt="Case image" />
  <div class="casechat-resultWhy">In this case, the diagnosis is <b>${correct}</b>.</div>
`;

    dxCard.appendChild(msg);

    const next = document.createElement("button");
    next.type = "button";
    next.className = "casechat-nextcase";
    next.textContent = "Next case";
    next.addEventListener("click", () => {
      closeDxModal();
      startNewCase(); // 이미 파일 안에 있는 함수
    });
    dxCard.appendChild(next);
  }

  function showList() {
    forceCloseModals();
    chatPage.classList.remove("active");
    listPage.classList.add("active");

    chatPage.style.display = "none";
    listPage.style.display = "";
  }

  function showChat() {
    listPage.classList.remove("active");
    chatPage.classList.add("active");

    listPage.style.display = "none";
    chatPage.style.display = "";

    caseIndex = 0;
    startNewCase(); // enter 할 때마다 random + “New case started”
  }

  // list -> chat (intermediate + advanced 허용)
  const onCaseStudyClick = (level) => {
    if (level !== "primary") return;
    showChat();
  };

  const primary = listPage.querySelector("#caseStudyPrimaryCard");
  const inter = listPage.querySelector("#caseStudyIntermediateCard");

  if (primary) {
    primary.addEventListener("click", () => onCaseStudyClick("primary"));
    primary.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      onCaseStudyClick("primary");
    });
  }

  if (inter) {
    inter.addEventListener("click", () => onCaseStudyClick("intermediate"));
    inter.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      onCaseStudyClick("intermediate");
    });
  }

  // ✅ 카드 안의 .lesson-row(tabindex=0)에서도 Enter/Space로 동작시키기
  listPage.querySelectorAll(".lesson-row[data-level]").forEach((row) => {
    row.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      onCaseStudyClick(row.dataset.level);
    });

    row.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      onCaseStudyClick(row.dataset.level);
    });
  });

  // chat controls
  submitBtn?.addEventListener("click", () => {
    if (!state?.asked || state.asked.size === 0) {
      appendSystem("Please ask at least one question before submitting.");
      return;
    }
    openDxModal();
  });

  sendBtn?.addEventListener("click", () => {
    console.log("[casechat] send clicked, pending =", pending); // ✅ 확인용
    if (!pending) return;

    onAsk(pending); // 여기서 “실제 전송”
    pending = null;

    if (draftEl) {
      draftEl.textContent = "Select a question above";
      draftEl.classList.add("is-placeholder");
    }
    if (sendBtn) sendBtn.disabled = true;

    renderChoices();
  });

  // toggle chips panel (^ <-> v)
  toggleBtn?.addEventListener("click", () => {
    const willOpen = !!choices?.hidden; // hidden이면 열기

    if (choices) choices.hidden = !willOpen;

    if (footer) {
      footer.classList.toggle("is-collapsed", !willOpen);
      footer.classList.toggle("is-expanded", willOpen);
    }

    // log bottom padding: bigger when chips open, smaller when closed
    chatPage.style.setProperty(
      "--casechat-log-pad",
      willOpen ? "280px" : "140px",
    );

    if (toggleBtn) toggleBtn.textContent = willOpen ? "-" : "^";
    requestAnimationFrame(() => {
      if (typeof keepLastMessageVisible === "function")
        keepLastMessageVisible();
    });
  });

  draftEl?.addEventListener("click", (e) => {
    e.preventDefault();
    toggleBtn?.click();
  });

  draftEl?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    toggleBtn?.click();
  });

  // 접근성: div를 클릭 가능하게 보이도록(선택)
  if (draftEl) {
    draftEl.setAttribute("role", "button");
    draftEl.setAttribute("tabindex", "0");
  }

  // --- Dx modal close button wiring ---
  dxClose?.addEventListener("click", (e) => {
    e.preventDefault();
    closeDxModal();
  });

  // (선택) 키보드 접근성까지 확실히
  dxClose?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      closeDxModal();
    }
  });

  // ✅ Enter/Space가 라우터/브라우저 기본 동작으로 새지 않게 막고,
  // 버튼을 '키보드로도' 확실히 동작시키기
  function isEnterOrSpace(e) {
    return e.key === "Enter" || e.key === " ";
  }

  backBtn?.addEventListener("click", showList);
  backBtn?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    e.stopPropagation();
    showList();
  });

  submitBtn?.addEventListener("keydown", (e) => {
    if (!isEnterOrSpace(e)) return;
    e.preventDefault();
    e.stopPropagation();

    if (!state?.asked || state.asked.size === 0) {
      appendSystem("Please ask at least one question before submitting.");
      return;
    }
    openDxModal();
  });

  // ✅ ESC로 모달 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;

    if (dxModal && dxModal.hidden === false) {
      e.preventDefault();
      closeDxModal();
      return;
    }
    if (resultModal && resultModal.hidden === false) {
      e.preventDefault();
      closeResultModal();
      return;
    }
  });

  // initial view
  showList();

  // ✅ 라우터가 page:loaded 이후에 display를 다시 만지는 경우까지 방어
  requestAnimationFrame(() => {
    showList();
  });
}
