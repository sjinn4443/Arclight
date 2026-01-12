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
    ui: "Have you noticed any redness or discharge?",
  },
  {
    id: "loss",
    label: "vision/hearing loss",
    ui: "Have you had any loss of vision or hearing?",
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

  // 강제 초기 상태 (✅ “들어가자마자 Result 모달 떠있음” 방지)
  function forceCloseModals() {
    if (dxModal) dxModal.hidden = true;
    if (resultModal) resultModal.hidden = true;
    if (resultBody) resultBody.innerHTML = "";
    if (resultTitle) resultTitle.textContent = "Result";
  }

  let state = { current: null, answeredImageShown: false, asked: new Set() };
  let pending = null;

  function appendBubble(kind, html) {
    const wrap = document.createElement("div");
    wrap.className = `casechat-bubble casechat-bubble--${kind}`;
    wrap.innerHTML = html;
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
  }
  function appendSystem(text) {
    appendBubble("system", `<div class="casechat-system">${text}</div>`);
  }
  function appendUser(text) {
    appendBubble("user", `<div class="casechat-text">${text}</div>`);
  }
  function appendBot(text, maybeImgSrc) {
    const imgHtml = maybeImgSrc
      ? `<img class="casechat-img" src="${maybeImgSrc}" alt="Case image" />`
      : "";

    appendBubble(
      "bot",
      `<div class="casechat-botstack">
       ${imgHtml}
       <div class="casechat-text">${text}</div>
     </div>`,
    );
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

        if (draftEl) draftEl.textContent = q.ui;
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

    // 모달 강제 닫힘 상태 정리(이미 있는 forceCloseModals는 startNewCase에서만 쓰니까 여기서도 최소정리)
    if (dxCard) dxCard.textContent = "";

    // Dx 리스트 채우기 (랜덤 순서)
    if (dxList) {
      dxList.innerHTML = "";
      const options = shuffle(DIAGNOSES);

      options.forEach((name) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "casechat-dxitem";
        btn.textContent = name;

        btn.addEventListener("click", () => {
          // 여기엔 네 기존 “정답 체크/결과 모달” 로직을 그대로 옮기면 돼
          // (이미 파일에 correctDiagnosisForCase, explanationForCase가 있음) :contentReference[oaicite:9]{index=9}
          onPickDiagnosis(name);
        });

        dxList.appendChild(btn);
      });
    }

    if (dxModal) dxModal.hidden = false;
  }

  function startNewCase() {
    forceCloseModals();

    state.current = pickRandomCase();
    state.answeredImageShown = false;
    state.asked = new Set();

    log.innerHTML = "";
    appendSystem("New case started");
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

    if (!state.answeredImageShown) {
      state.answeredImageShown = true;
      appendBot(reply, imgPathForCase(state.current.caseNum));
    } else {
      appendBot(reply);
    }
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

  function onPickDiagnosis(name) {
    const correct = correctDiagnosisForCase(state.current);

    if (name === correct) {
      closeDxModal();
      openResultModal(
        "Correct",
        `<div class="casechat-resultOk">Correct</div>
         <div class="casechat-resultWhy">${explanationForCase(state.current)}</div>`,
      );
      return;
    }

    // Wrong: Try again + shake
    shake(dxCard);
    const hint = document.createElement("div");
    hint.className = "casechat-tryagain";
    hint.textContent = "Try again";
    dxCard.appendChild(hint);
    setTimeout(() => hint.remove(), 900);
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

    if (draftEl) draftEl.textContent = "Select a question above";
    if (sendBtn) sendBtn.disabled = true;

    renderChoices();
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
