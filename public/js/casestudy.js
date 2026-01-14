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
    { caseNum: 1, variant: "infant" },
    { caseNum: 1, variant: "elderly" },
  ];

  for (let i = 2; i <= 12; i++) {
    pool.push({ caseNum: i, variant: null });
  }

  return shuffle(pool);
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
  { id: "age", label: "age", ui: "How old are you?" },
  {
    id: "onset",
    label: "onset",
    ui: "When did it start and how did it begin?",
  },
  { id: "pain", label: "pain/itch", ui: "Do you have any pain or itchiness?" },
  { id: "treatment", label: "treatment", ui: "Have you taken any treatment?" },

  {
    id: "redness",
    label: "redness/discharge",
    ui: "Have you noticed any redness/discharge?",
  },
  {
    id: "loss",
    label: "vision/hearing loss",
    ui: "Have you had any loss of vision/hearing?",
  },
  {
    id: "balance",
    label: "balance",
    ui: "Any balance problems or wobbly vision?",
  },
  {
    id: "course",
    label: "worse or better",
    ui: "Is it getting worse or better?",
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
  const nm = "No.";

  if (caseNum === 1 && variant === "elderly") {
    return {
      age: "78 years old.",
      onset:
        "It has been gradually getting worse over several months. It started in one eye then affected both.",
      pain: "No pain and no discharge.",
      redness: "The eye looks white.",
      loss: "Vision was blurry at first but now I cannot see anything.",
      balance: nm,
      course: "It has been getting worse.",
      treatment: "No treatment yet.",
      other: nm,
    };
  }

  if (caseNum === 1 && variant === "infant") {
    return {
      age: "6 months old.",
      onset: "Present at birth and affecting both eyes.",
      pain: "No pain and no discharge.",
      redness: "The eye looks white.",
      loss: "The child has never been able to see.",
      balance: nm,
      course: nm,
      treatment: "No treatment yet.",
      other: nm,
    };
  }

  if (caseNum === 2) {
    return {
      age: "12 months old.",
      onset:
        "It started around 6 months and has been gradually getting worse. Both eyes are affected.",
      pain: "No pain and no discharge.",
      redness: "The eye looks white.",
      loss: "The child has lost interest in looking around.",
      balance: nm,
      course: "Getting worse.",
      treatment: "No treatment yet.",
      other: nm,
    };
  }

  if (caseNum === 3) {
    return {
      age: "18 years old.",
      onset:
        "It started one week ago and worsened over 1 to 2 days. It started in one eye then both.",
      pain: "It is sticky with yellow discharge and the eye is pink.",
      redness: "Pink eye with yellow discharge.",
      loss: "Vision is blurry too.",
      balance: nm,
      course: "Getting worse.",
      treatment: "No treatment yet.",
      other: nm,
    };
  }

  if (caseNum === 4) {
    return {
      age: "38 years old.",
      onset: "It started many months ago and both eyes are affected.",
      pain: "It is painful and gritty.",
      redness: "Red eye.",
      loss: "Blurred vision.",
      balance: nm,
      course: "Getting worse.",
      treatment: "No treatment yet.",
      other: nm,
    };
  }

  if (caseNum === 5) {
    return {
      age: "29 years old.",
      onset: "It started 2 weeks ago after I scratched my eye on a bush.",
      pain: "It was gritty and watery at first. Now it is very painful.",
      redness: "Red eye.",
      loss: "I have lost vision in that eye.",
      balance: nm,
      course: "Gradually worse.",
      treatment: "No treatment yet.",
      other: "It began after the scratch injury.",
    };
  }

  if (caseNum === 6) {
    return {
      age: "21 years old.",
      onset: "It started one week ago. Only one eye is affected.",
      pain: "Gritty and watery.",
      redness: nm,
      loss: "Blurred vision.",
      balance: nm,
      course: "Gradually getting worse.",
      treatment: "No treatment yet.",
      other:
        "I had a small patch of painful broken skin on my lip one week before the eye symptoms started.",
    };
  }

  if (caseNum === 7) {
    return {
      age: "21 years old.",
      onset: "It started one week ago. Only one eye is affected.",
      pain: "Bright lights are painful and the eye is watery.",
      redness: nm,
      loss: "Slightly blurred vision.",
      balance: nm,
      course: "Gradually getting worse.",
      treatment: "No treatment yet.",
      other: nm,
    };
  }

  if (caseNum === 8) {
    return {
      age: "69 years old.",
      onset: "It started many months ago. Only one eye is affected.",
      pain: "Slightly gritty and watery.",
      redness: nm,
      loss: "Slightly blurred vision.",
      balance: nm,
      course: "Gradually getting worse.",
      treatment: "No treatment yet.",
      other: nm,
    };
  }

  if (caseNum === 9) {
    return {
      age: "21 years old.",
      onset: "It started after working under my car. Only one eye is affected.",
      pain: "Gritty and watery.",
      redness: "A little bit pink.",
      loss: "Slightly blurred vision.",
      balance: nm,
      course: "Gradually getting worse.",
      treatment: "No treatment yet.",
      other: nm,
    };
  }

  if (caseNum === 10) {
    return {
      age: "32 years old.",
      onset:
        "It started after being hit in the face in a fight. Only one eye is affected.",
      pain: "Painful and watering.",
      redness: "Red eye.",
      loss: "Very poor vision.",
      balance: nm,
      course: "Gradually getting worse.",
      treatment: "No treatment yet.",
      other: nm,
    };
  }

  if (caseNum === 11) {
    return {
      age: "8 years old.",
      onset:
        "It started 3 days ago after being hit by a stick while play fighting. Only one eye is affected.",
      pain: "Painful and watering.",
      redness: "Red eye.",
      loss: "Blurred vision.",
      balance: nm,
      course: "Gradually getting worse.",
      treatment: "No treatment yet.",
      other: nm,
    };
  }

  if (caseNum === 12) {
    return {
      age: "8 years old.",
      onset:
        "It started today after being hit by a stick while play fighting. Only one eye is affected.",
      pain: "Painful and watering.",
      redness: "Red eye.",
      loss: "Very poor vision.",
      balance: nm,
      course: "Gradually getting worse.",
      treatment: "No treatment yet.",
      other: nm,
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
export function initializeCaseStudy() {
  const listPage = document.getElementById("casestudyPage");
  const chatPage = document.getElementById("caseStudyChatPage");
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

  const resultModal = chatPage.querySelector("#caseResultModal");
  const resultBody = chatPage.querySelector("#caseResultBody");
  const resultClose = chatPage.querySelector("#caseResultCloseBtn");
  const nextBtn = chatPage.querySelector("#caseNextBtn");
  const resultTitle = chatPage.querySelector("#caseResultTitle");

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

  let pending = null;

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
      html += `<img class="casechat-img" src="${maybeImgSrc}" alt="Case image" />`;
    }

    // ✅ 텍스트가 있을 때만 말풍선 생성
    if (text && text.trim() !== "") {
      html += `<div class="casechat-text">${text}</div>`;
    }

    html += `</div>`;

    appendBubble("bot", html);
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

  function openDxModal() {
    if (!state?.asked || state.asked.size === 0) {
      appendSystem("Please ask at least one question before submitting.");
      return;
    }

    if (!state.current) return;

    // 모달 강제 닫힘 상태 정리
    if (dxCard) dxCard.innerHTML = "";
    dxLocked = false;

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
      appendSystem(
        `<span class="casechat-caseindex">All cases completed</span>`,
      );

      return;
    }

    state.current = casePool.shift();

    state.answeredImageShown = false;
    state.asked = new Set();

    log.innerHTML = "";
    caseIndex += 1;
    const ord = ordinalWord(caseIndex);

    if (caseIndex === 1) {
      appendSystem(`
        <span class="casechat-caseindex">First case</span>
        <span class="casechat-firstprompt">What is the first question you would ask?</span>
      `);
    } else {
      appendSystem(`${ord} case`);
    }

    appendBot("", imgPathForCase(state.current.caseNum));
    state.answeredImageShown = true;

    renderChoices();
    if (submitBtn) submitBtn.disabled = true;
  }

  function onAsk(q) {
    if (state.asked.has(q.id)) return;
    state.asked.add(q.id);
    renderChoices();
    if (submitBtn) submitBtn.disabled = false;

    appendUser(q.ui);

    const answers = caseAnswers(state.current);
    const reply = answers?.[q.id] || "No.";

    appendBot(reply);
  }

  function closeDxModal() {
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

  let dxLocked = false;

  function onPickDiagnosis(name, pickedBtn) {
    const correct = correctDiagnosisForCase(state.current);

    // 기존 피드백 지우기
    if (dxCard) dxCard.innerHTML = "";

    // 오답
    if (name !== correct) {
      pickedBtn.classList.add("is-selected");
      pickedBtn.classList.add("is-wrong");
      pickedBtn.setAttribute("aria-checked", "true");

      const hint = document.createElement("div");
      hint.className = "casechat-tryagain";
      hint.textContent = "Try again";
      dxCard.appendChild(hint);

      return;
    }

    // 정답이면 더 이상 선택 못 하게 잠금
    dxLocked = true;

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
    msg.innerHTML = `
    <div class="casechat-resultOk">Correct.</div>
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

  // list -> chat (일단 intermediate만)
  const onCaseStudyClick = (level) => {
    if (level !== "intermediate") return;
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
