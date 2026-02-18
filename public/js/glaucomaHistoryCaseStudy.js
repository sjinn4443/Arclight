// public/js/glaucomaHistoryCaseStudy.js
import {
  initializeGlaucomaWorkshopProgressInfra,
  setGlaucomaLessonProgress,
} from "./glaucomaWorkshopProgress.js";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- data (chips) ----
// casestudy.js의 QUESTIONS를 그대로 유지 + ethnicity만 추가
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

  // ✅ 추가 칩
  {
    id: "ethnicity",
    label: "ethnicity",
    ui: "What is your background?",
  },
];

// ---- cases ----
const CASES = [{ key: "POAG" }, { key: "ACAG" }];

const DIAGNOSES = ["POAG", "ACAG"];

function ageIntroForCase(caseKey) {
  if (caseKey === "POAG") return "This patient is 52 years old";
  if (caseKey === "ACAG") return "This patient is 68 years old";
  return "";
}

function correctDiagnosisForCase(caseKey) {
  return caseKey;
}

function explanationForCase(caseKey) {
  if (caseKey === "POAG") {
    return "Slow, painless vision loss over months to years with a white eye and higher risk with African background, family history, age over 40 and short sightedness fits POAG.";
  }
  if (caseKey === "ACAG") {
    return "Fast vision loss over hours to days with a painful red eye and halos around lights with higher risk with Asian background, older age and cataract fits ACAG.";
  }
  return "";
}

function caseAnswers(caseKey) {
  if (caseKey === "POAG") {
    return {
      problem:
        "My vision is not as good as it used to be. It has been changing very gradually.",
      when: "It started a long time ago, maybe months to years.",
      how: "It came on slowly. There was no injury or sudden event.",
      eye: "It feels like both eyes are affected.",
      pain: "No, there is no pain or itchiness.",
      redness: "No redness and no discharge. The eye looks white.",
      vision: "Yes, the vision has been getting worse, but very slowly.",
      course: "It is gradually getting worse over time.",
      treatment: "No treatment so far.",
      other:
        "I am short sighted and I wear glasses for distance. My father had glaucoma. I am over 40.",
      ethnicity: "I have an African background.",
    };
  }

  if (caseKey === "ACAG") {
    return {
      problem: "My vision suddenly became blurry and my eye is very painful.",
      when: "It started suddenly, within the last few hours.",
      how: "It came on quickly without any injury.",
      eye: "It is affecting one eye.",
      pain: "Yes, it is very painful.",
      redness: "Yes, the eye is red. There is no discharge.",
      vision: "Yes, the vision got worse quickly over hours.",
      course: "It is getting worse.",
      treatment: "No treatment so far.",
      other:
        "I see halos around lights. I have had a similar attack before that went away. I am long sighted and I need glasses for near vision. I have been told I have cataracts.",
      ethnicity: "I have an Asian background.",
    };
  }

  return null;
}

export function initializeGlaucomaHistoryCaseStudy() {
  const page = document.getElementById("glaucomaHistoryCaseStudy");
  if (!page) return;
  initializeGlaucomaWorkshopProgressInfra();

  const log = page.querySelector("#caseChatLog");
  const choices = page.querySelector("#caseChatChoices");
  const submitBtn = page.querySelector("#caseChatSubmitBtn");
  const draftEl = page.querySelector("#caseChatDraft");
  const sendBtn = page.querySelector("#caseChatSendBtn");
  const toggleBtn = page.querySelector("#caseChatToggleBtn");
  const footer = page.querySelector(".casechat-footer, .caseChatFooter");

  const dxModal = page.querySelector("#caseDxModal");
  const dxCard = page.querySelector("#caseDxCard");
  const dxList = page.querySelector("#caseDxList");
  const dxClose = page.querySelector("#caseDxCloseBtn");

  const dxTimerText = page.querySelector("#caseDxTimerText");
  const dxTimerFg = page.querySelector("#caseDxTimerFg");

  const timerBtn = page.querySelector("#caseTimerBtn");
  const timerText = page.querySelector("#caseTimerText");
  const timerFg = page.querySelector(".caseTimer__fg");

  const finalModal = page.querySelector("#caseFinalModal");
  const finalBody = page.querySelector("#caseFinalBody");
  const finalClose = page.querySelector("#caseFinalCloseBtn");
  const finalOk = page.querySelector("#caseFinalOkBtn");

  const resultModal = page.querySelector("#caseResultModal");
  const resultBody = page.querySelector("#caseResultBody");
  const resultClose = page.querySelector("#caseResultCloseBtn");
  const nextBtn = page.querySelector("#caseNextBtn");
  const resultTitle = page.querySelector("#caseResultTitle");

  if (!log || !choices) {
    console.warn(
      "[glaucomaHistoryCaseStudy] missing #caseChatLog or #caseChatChoices",
    );
    return;
  }

  // initial chips state: hidden
  choices.hidden = true;
  page.style.setProperty("--casechat-log-pad", "140px");
  footer?.classList.add("is-collapsed");

  const DRAFT_TEXT_EXPANDED = "Click here to select a question";
  const DRAFT_TEXT_COLLAPSED = "Click here to select a question";
  function syncDraftPlaceholder() {
    if (!draftEl) return;
    draftEl.classList.add("is-placeholder");
    draftEl.textContent = choices?.hidden
      ? DRAFT_TEXT_COLLAPSED
      : DRAFT_TEXT_EXPANDED;
  }

  if (toggleBtn) toggleBtn.textContent = "^";
  syncDraftPlaceholder();

  function forceCloseModals() {
    if (dxModal) dxModal.hidden = true;

    if (resultModal) resultModal.hidden = true;
    if (resultBody) resultBody.innerHTML = "";
    if (resultTitle) resultTitle.textContent = "Result";

    if (finalModal) finalModal.hidden = true;
  }

  // ---- state ----
  let state = { currentKey: null, asked: new Set() };
  let caseIndex = 0;

  let scoreCorrect = 0;
  let scoreTotal = 0;

  // exactly 2 cases, random order
  let casePool = shuffle(CASES.map((c) => c.key));

  const TOTAL_CASES = 2;
  const QUESTIONS_PER_CASE = QUESTIONS.length;

  function updateHistoryProgress() {
    const completedCases = Math.max(0, caseIndex - 1);
    const currentCaseAsked = Math.min(
      QUESTIONS_PER_CASE,
      state?.asked?.size || 0,
    );
    const totalQuestions = TOTAL_CASES * QUESTIONS_PER_CASE;
    const doneQuestions = Math.min(
      totalQuestions,
      completedCases * QUESTIONS_PER_CASE + currentCaseAsked,
    );
    const inProgressPercent = (doneQuestions / totalQuestions) * 95;
    setGlaucomaLessonProgress("glaucomaHistoryCaseStudy", inProgressPercent);
  }

  // ---- intro modal ----
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
          Ask questions to patient <br />and work out the diagnosis.<br /><br />
          <span style="font-weight: 700; color: #e41e26">You only get 60 seconds.</span>
        </div>

        <div class="casechat-confirm__actions">
          <button type="button" class="casechat-confirm__btn is-ok" data-action="ok">OK</button>
        </div>
      </div>
    `;

    modal.addEventListener("click", (e) => {
      const okBtn = e.target.closest('[data-action="ok"]');
      if (!okBtn) return;

      introSeen = true;
      hideIntroModal();
      startNewCase();
    });

    page.appendChild(modal);
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

  // ---- timers ----
  const TIMER_TOTAL = 60;
  let timerLeft = TIMER_TOTAL;
  let timerInterval = null;

  const DX_TIMER_TOTAL = 10;
  let dxTimerLeft = DX_TIMER_TOTAL;
  let dxTimerInterval = null;

  let dxLocked = false;
  let caseScored = false;

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function renderTimer() {
    if (timerText) timerText.textContent = String(timerLeft);

    const pct = Math.max(0, Math.min(1, timerLeft / TIMER_TOTAL));
    if (timerFg) {
      timerFg.style.strokeDasharray = "100 100";
      timerFg.style.strokeDashoffset = String(100 * (1 - pct));
    }
    if (timerBtn) timerBtn.classList.toggle("is-danger", timerLeft <= 5);
  }

  function setTimerLeft(next) {
    timerLeft = Math.max(0, Math.min(TIMER_TOTAL, next));
    renderTimer();

    if (timerLeft === 0) {
      stopTimer();
      openDxModal(true);
    }
  }

  function startTimer() {
    stopTimer();
    timerLeft = TIMER_TOTAL;
    if (timerBtn) timerBtn.classList.remove("is-danger");
    renderTimer();

    timerInterval = setInterval(() => {
      setTimerLeft(timerLeft - 1);
    }, 1000);
  }

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

    const dxTimerRoot = dxTimerFg?.closest(".caseTimer");
    dxTimerRoot?.classList.toggle("is-danger", dxTimerLeft <= 5);
  }

  function failDxAndMoveOn(reasonText, options = {}) {
    dxLocked = true;
    stopDxTimer();

    const all = dxList?.querySelectorAll(".casechat-dxitem") || [];
    all.forEach((b) => {
      b.disabled = true;
      b.classList.add("is-disabled");
    });

    if (!caseScored) {
      scoreTotal += 1;
      caseScored = true;
    }

    if (dxCard) {
      dxCard.innerHTML = "";

      const msg = document.createElement("div");
      msg.className =
        options.variant === "rich"
          ? "casechat-correctmsg"
          : "casechat-tryagain";
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
    dxTimerFg?.closest(".caseTimer")?.classList.remove("is-danger");

    renderDxTimer();

    dxTimerInterval = setInterval(() => {
      dxTimerLeft -= 1;
      renderDxTimer();

      if (dxTimerLeft <= 0) {
        dxTimerLeft = 0;
        renderDxTimer();
        failDxAndMoveOn("Time is up<br />Move on to the next case");
      }
    }, 1000);
  }

  // ---- chat rendering ----
  function keepLastMessageVisible() {
    const last = log.lastElementChild;
    if (!last) return;

    const logRect = log.getBoundingClientRect();
    const footerRect = footer?.getBoundingClientRect();

    const visualBottom = footerRect
      ? Math.min(logRect.bottom, footerRect.top)
      : logRect.bottom;

    const safeBottom = visualBottom - 16;
    const lastRect = last.getBoundingClientRect();

    if (lastRect.bottom > safeBottom) {
      const delta = lastRect.bottom - safeBottom;
      log.scrollTo({ top: log.scrollTop + delta, behavior: "smooth" });
    }
  }

  function appendBubble(kind, html) {
    const wrap = document.createElement("div");
    wrap.className = `casechat-bubble casechat-bubble--${kind}`;
    wrap.innerHTML = html;
    log.appendChild(wrap);

    requestAnimationFrame(keepLastMessageVisible);
  }

  function appendSystem(text) {
    appendBubble("system", `<div class="casechat-system">${text}</div>`);
  }
  function appendUser(text) {
    appendBubble("user", `<div class="casechat-text">${text}</div>`);
  }
  function appendBot(text) {
    appendBubble("bot", `<div class="casechat-text">${text}</div>`);
  }

  function appendBotTyping(dots = "...") {
    const bubble = document.createElement("div");
    bubble.className =
      "casechat-bubble casechat-bubble--bot casechat-bubble--typing is-typing";
    bubble.innerHTML = `<div class="casechat-text">${dots}</div>`;
    log.appendChild(bubble);

    requestAnimationFrame(keepLastMessageVisible);
    return bubble;
  }

  function calcTypingDelay(answerText) {
    const len = (answerText || "").trim().length;
    const min = 350;
    const max = 1800;
    const ms = min + Math.min(1450, Math.floor(len * 18));
    return Math.max(min, Math.min(max, ms));
  }

  let pending = null;

  function renderChoices() {
    choices.innerHTML = "";

    QUESTIONS.forEach((q) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "casechat-chip";
      btn.textContent = q.label;

      btn.disabled = state.asked.has(q.id);
      if (pending?.id === q.id) btn.classList.add("is-selected");

      btn.addEventListener("click", () => {
        if (state.asked.has(q.id)) return;
        commitQuestion(q);
      });

      choices.appendChild(btn);
    });
  }

  function onAsk(q) {
    if (state.asked.has(q.id)) return;
    state.asked.add(q.id);
    updateHistoryProgress();
    renderChoices();
    if (submitBtn) submitBtn.disabled = false;

    appendUser(q.ui);

    const answers = caseAnswers(state.currentKey);
    const reply = answers?.[q.id] || "No.";

    const len = (reply || "").trim().length;
    const dotsCount = Math.max(3, Math.min(7, 3 + Math.floor(len / 40)));
    const dots = ".".repeat(dotsCount);

    const typingBubble = appendBotTyping(dots);
    const delay = calcTypingDelay(reply);

    setTimeout(() => {
      const textEl = typingBubble?.querySelector(".casechat-text");
      if (textEl) textEl.textContent = reply;
      typingBubble?.classList.remove("casechat-bubble--typing", "is-typing");
      requestAnimationFrame(keepLastMessageVisible);
    }, delay);
  }

  // ---- diagnosis modal ----
  function closeDxModal() {
    stopDxTimer();
    if (dxModal) dxModal.hidden = true;
  }

  function openDxModal(force = false) {
    if (!force && (!state?.asked || state.asked.size === 0)) {
      appendSystem("Please ask at least one question before submitting.");
      return;
    }

    if (!state.currentKey) return;

    if (dxCard) dxCard.innerHTML = "";
    dxLocked = false;

    startDxTimer();

    if (dxList) {
      dxList.innerHTML = "";

      const correct = correctDiagnosisForCase(state.currentKey);
      const options = DIAGNOSES; // POAG / ACAG only

      options.forEach((name) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "casechat-dxitem";
        btn.setAttribute("role", "radio");
        btn.setAttribute("aria-checked", "false");

        btn.innerHTML = `
          <span class="casechat-radio"></span>
          <span class="casechat-dxlabel">${name}</span>
        `;

        btn.addEventListener("click", () => {
          if (dxLocked) return;

          dxList.querySelectorAll(".casechat-dxitem").forEach((b) => {
            b.classList.remove("is-selected", "is-wrong", "is-correct");
            b.setAttribute("aria-checked", "false");
          });

          btn.classList.add("is-selected");
          btn.setAttribute("aria-checked", "true");

          onPickDiagnosis(name, btn, correct);
        });

        dxList.appendChild(btn);
      });
    }

    if (dxModal) dxModal.hidden = false;
    stopTimer();
  }

  function onPickDiagnosis(name, pickedBtn, correct) {
    if (dxCard) dxCard.innerHTML = "";

    if (name !== correct) {
      pickedBtn.classList.add("is-selected", "is-wrong");
      pickedBtn.setAttribute("aria-checked", "true");

      const moveOnHint =
        caseIndex === 1
          ? `<div class="casechat-resultBad" style="margin-top:8px">Move onto the next case.</div>`
          : "";

      failDxAndMoveOn(
        `
        <div class="casechat-resultBad">Incorrect.</div>
        <div class="casechat-resultWhy">In this case, the diagnosis is <span class="casechat-resultBadDx">${correct}</span>.</div>
        <div class="casechat-resultWhy" style="margin-top:8px">${explanationForCase(
          state.currentKey,
        )}</div>
        ${moveOnHint}
      `,
        { variant: "rich" },
      );
      return;
    }

    dxLocked = true;
    stopDxTimer();

    if (!caseScored) {
      scoreCorrect += 1;
      scoreTotal += 1;
      caseScored = true;
    }

    pickedBtn.classList.add("is-selected", "is-correct");
    pickedBtn.setAttribute("aria-checked", "true");

    const all = dxList?.querySelectorAll(".casechat-dxitem") || [];
    all.forEach((b) => {
      if (b !== pickedBtn) {
        b.disabled = true;
        b.classList.add("is-disabled");
      }
    });

    const msg = document.createElement("div");
    msg.className = "casechat-correctmsg";
    msg.innerHTML = `
      <div class="casechat-resultOk">Correct.</div>
      <div class="casechat-resultWhy">In this case, the diagnosis is <b>${correct}</b>.</div>
      <div class="casechat-resultWhy" style="margin-top:8px">${explanationForCase(
        state.currentKey,
      )}</div>
    `;
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

  // ---- final modal ----
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

  // ---- case flow ----
  function startNewCase() {
    forceCloseModals();

    if (casePool.length === 0) {
      log.innerHTML = "";

      if (submitBtn) submitBtn.disabled = true;
      if (choices) {
        choices.hidden = true;
        choices.innerHTML = "";
      }
      syncDraftPlaceholder();
      if (sendBtn) sendBtn.disabled = true;
      if (toggleBtn) toggleBtn.textContent = "^";
      footer?.classList.add("is-collapsed");

      setGlaucomaLessonProgress("glaucomaHistoryCaseStudy", 100);
      openFinalModal();
      return;
    }

    state.currentKey = casePool.shift();
    state.asked = new Set();
    caseScored = false;

    log.innerHTML = "";
    caseIndex += 1;
    updateHistoryProgress();

    const ageIntro = ageIntroForCase(state.currentKey);

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

    // ✅ image 없음: 첫 bot 메시지는 텍스트로만
    renderChoices();
    choices.hidden = false;

    footer?.classList.remove("is-collapsed");
    footer?.classList.add("is-expanded");
    page.style.setProperty("--casechat-log-pad", "280px");

    syncDraftPlaceholder();
    if (toggleBtn) toggleBtn.textContent = "-";
    if (submitBtn) submitBtn.disabled = true;

    startTimer();
  }

  // ---- controls ----
  function commitQuestion(q) {
    if (!q) return;

    onAsk(q);
    pending = null;

    if (sendBtn) sendBtn.disabled = true;

    if (choices) choices.hidden = true;
    syncDraftPlaceholder();

    footer?.classList.add("is-collapsed");
    footer?.classList.remove("is-expanded");
    page.style.setProperty("--casechat-log-pad", "140px");

    if (toggleBtn) toggleBtn.textContent = "^";

    requestAnimationFrame(keepLastMessageVisible);
  }

  submitBtn?.addEventListener("click", () => {
    if (!state?.asked || state.asked.size === 0) {
      appendSystem("Please ask at least one question before submitting.");
      return;
    }
    openDxModal(false);
  });

  dxClose?.addEventListener("click", (e) => {
    e.preventDefault();
    closeDxModal();
  });

  resultClose?.addEventListener("click", () => {
    if (resultModal) resultModal.hidden = true;
  });
  nextBtn?.addEventListener("click", () => {
    if (resultModal) resultModal.hidden = true;
  });

  sendBtn?.addEventListener("click", () => {
    if (!pending) return;
    commitQuestion(pending);
  });

  toggleBtn?.addEventListener("click", () => {
    const willOpen = !!choices?.hidden;

    if (choices) choices.hidden = !willOpen;

    footer?.classList.toggle("is-collapsed", !willOpen);
    footer?.classList.toggle("is-expanded", willOpen);

    page.style.setProperty("--casechat-log-pad", willOpen ? "280px" : "140px");
    syncDraftPlaceholder();
    if (toggleBtn) toggleBtn.textContent = willOpen ? "-" : "^";

    requestAnimationFrame(keepLastMessageVisible);
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

  if (draftEl) {
    draftEl.setAttribute("role", "button");
    draftEl.setAttribute("tabindex", "0");
  }

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;

    if (dxModal && dxModal.hidden === false) {
      e.preventDefault();
      closeDxModal();
      return;
    }
    if (resultModal && resultModal.hidden === false) {
      e.preventDefault();
      resultModal.hidden = true;
      return;
    }
    if (finalModal && finalModal.hidden === false) {
      e.preventDefault();
      closeFinalModal();
      return;
    }
  });

  // ---- initial entry ----
  forceCloseModals();

  if (!introSeen) {
    showIntroModal();
  } else {
    startNewCase();
  }

  // also harden initial paint
  requestAnimationFrame(() => {
    forceCloseModals();
  });
}
