export const MEDICAL_ANTERIOR_CASES = Object.freeze([
  {
    id: 1,
    patient: ["6 month old baby", "Mum says right eye ‘looks funny’"],
    signs: ["White Pupil"],
    diagnosis: ["Cataract", "Retinoblastoma"],
    action: ["Refer Investigations and Surgery"],
  },
  {
    id: 2,
    patient: ["6 month old baby", "Mum says right eye ‘looks funny’"],
    signs: ["White/Pink Pupil and Blood Vessels"],
    diagnosis: ["Retinoblastoma"],
    action: ["Refer Investigations and Surgery/Chemotherapy"],
  },
  {
    id: 3,
    patient: [
      "2 week old baby",
      "Mum says eye sticky and red",
      "First one eye, now both",
    ],
    signs: ["Red Eye", "Sticky discharge"],
    diagnosis: ["Ophthalmia Neonatorum", "Gonococcus", "Chlamydia"],
    action: ["Refer Baby and Parents need Antibiotics - GUM"],
  },
  {
    id: 4,
    patient: [
      "34 year old man",
      "Painful gritty eye",
      "Blurred Vision",
      "6 months",
      "Getting worse",
    ],
    signs: ["Red Eye", "Lashes on cornea", "Cornea looks rough"],
    diagnosis: ["Trachoma"],
    action: ["Refer Surgery and Antibiotics"],
  },
  {
    id: 5,
    patient: [
      "34 year old man",
      "Painful gritty eye",
      "Blurred Vision",
      "Started after he scratched it on a tree",
      "Getting worse",
    ],
    signs: ["Red Eye", "Opacified Cornea", "Yellow Fluid Level", "Hypopyon"],
    diagnosis: ["Corneal Ulcer", "Bacterial +/- Fungi"],
    action: ["Refer Intensive Antibiotcs"],
  },
  {
    id: 6,
    patient: [
      "22 year old woman",
      "Painful gritty eye",
      "Watery",
      "Blurred Vision",
    ],
    signs: ["Dendritic Ulcer", "Staining with fluoresceine dye"],
    diagnosis: ["Herpes Simplex Keratitis"],
    action: ["Refer Anti-Viral Tx"],
  },
  {
    id: 7,
    patient: [
      "54 year old woman",
      "Photophobia",
      "Watery",
      "Blurred Vision",
      "",
      "Joint Problems – especially neck",
    ],
    signs: [
      "Red Eye especially limbus",
      "White patches on cornea",
      "Irregular Pupil",
    ],
    diagnosis: ["Anterior Uveitis"],
    action: ["Refer Steroids and Dilation"],
  },
  {
    id: 8,
    patient: [
      "74 year old man",
      "Gritty Eye",
      "Mild Blurred Vision",
      "",
      "Worked in fields all his life",
    ],
    signs: ["Pink fleshy lesion", "Extends from conjunctiva to cornea"],
    diagnosis: ["Pterygium"],
    action: ["Lubricants"],
  },
  {
    id: 9,
    patient: [
      "24 year old man",
      "Gritty Eye",
      "Watery",
      "",
      "Works as a mechanic",
    ],
    signs: ["Pink Eye", "Round brown lesion", "Surrounding yellow circle"],
    diagnosis: ["Foreign Body Metallic", "Infiltrate – early infection"],
    action: ["Remove + antibiotics"],
  },
  {
    id: 10,
    patient: [
      "24 year old man",
      "Loss of Vision",
      "Pain",
      "",
      "Drunk in a fight",
    ],
    signs: ["Red fluid level", "Misshapen Pupil", "Pink eye"],
    diagnosis: ["Blunt Trauma", "Hyphaema"],
    action: ["Shield + Analgesia", "Refer"],
  },
  {
    id: 11,
    patient: [
      "14 year old boy",
      "Loss of Vision",
      "Pain",
      "",
      "Playing with friends: ‘sticks and stones’",
    ],
    signs: ["Misshapen Pupil", "Brown ‘blob’ at limbus", "Yellow fluid level"],
    diagnosis: ["Penetrating injury", "Corneal Laceration", "Iris Prolapse"],
    action: ["Analgesia, shield, refer"],
  },
  {
    id: 12,
    patient: [
      "12 year old boy",
      "Loss of Vision",
      "Pain",
      "",
      "Playing with friends: ‘sticks and stones’",
    ],
    signs: ["White Pupil", "Corneal line"],
    diagnosis: [
      "Penetrating injury",
      "Corneal Laceration",
      "Traumatic Cataract",
    ],
    action: ["Analgesia, shield, refer"],
  },
]);

const TOTAL_CASES = MEDICAL_ANTERIOR_CASES.length;

function appendLines(container, lines) {
  lines.forEach((line, index) => {
    if (index > 0) container.appendChild(document.createElement("br"));
    container.appendChild(document.createTextNode(line));
  });
}

function appendSystemMessage(log, caseNumber) {
  const bubble = document.createElement("div");
  bubble.className = "casechat-bubble casechat-bubble--system";

  const system = document.createElement("div");
  system.className = "casechat-system";

  const caseIndex = document.createElement("div");
  caseIndex.className = "casechat-caseindex";
  caseIndex.appendChild(document.createTextNode(`Case ${caseNumber} `));

  const caseCount = document.createElement("span");
  caseCount.className = "casechat-casecount";
  caseCount.textContent = `(${caseNumber}/${TOTAL_CASES})`;
  caseIndex.appendChild(caseCount);

  const prompt = document.createElement("div");
  prompt.className = "casechat-learning-prompt";
  [
    { prefix: "SIGNS: Look for ", emphasis: "signs" },
    {
      prefix: "DIAGNOSIS: Make a differential ",
      emphasis: "diagnosis",
    },
    {
      prefix: "ACTION: Decide on an ",
      emphasis: "action",
      suffix: " plan",
    },
  ].forEach(({ prefix, emphasis, suffix = "" }) => {
    const line = document.createElement("span");
    line.className = "medical-anterior-prompt-line";
    line.appendChild(document.createTextNode(prefix));

    const strong = document.createElement("strong");
    strong.textContent = emphasis;
    line.appendChild(strong);
    line.appendChild(document.createTextNode(suffix));
    prompt.appendChild(line);
  });

  system.append(caseIndex, prompt);
  bubble.appendChild(system);
  log.appendChild(bubble);
}

function appendPatientBubbles(log, caseData) {
  const imageBubble = document.createElement("div");
  imageBubble.className =
    "casechat-bubble casechat-bubble--bot medical-anterior-image-bubble";
  const stack = document.createElement("div");
  stack.className = "casechat-botstack";
  const imageWrap = document.createElement("div");
  imageWrap.className = "casechat-imgwrap is-revealed";
  const image = document.createElement("img");
  image.className = "casechat-img";
  image.src = `/images/casestudy/case${caseData.id}_eye.webp`;
  image.alt = isLaoLanguage()
    ? `ຮູບກໍລະນີສ່ວນໜ້າຂອງຕາ ${caseData.id}`
    : `Anterior segment case ${caseData.id}`;
  image.decoding = "async";
  imageWrap.appendChild(image);
  stack.appendChild(imageWrap);
  imageBubble.appendChild(stack);
  log.appendChild(imageBubble);

  let startsNewGroup = false;
  caseData.patient.forEach((line) => {
    if (!line) {
      startsNewGroup = true;
      return;
    }

    const bubble = document.createElement("div");
    bubble.className = "casechat-bubble casechat-bubble--bot";
    if (startsNewGroup) {
      bubble.classList.add("medical-anterior-patient-group-start");
      startsNewGroup = false;
    }

    const text = document.createElement("div");
    text.className = "casechat-text";
    text.textContent = line;
    bubble.appendChild(text);
    log.appendChild(bubble);
  });
}

function appendAnswerSection(answer, heading, lines) {
  const section = document.createElement("div");
  section.className = "medical-anterior-answer-section";

  const title = document.createElement("strong");
  title.textContent = heading;
  section.appendChild(title);

  const content = document.createElement("span");
  appendLines(content, lines);
  section.appendChild(content);
  answer.appendChild(section);
}

const ANSWER_SECTION_CONFIG = Object.freeze({
  signs: { heading: "Sign", caseKey: "signs" },
  diagnosis: { heading: "Diagnosis", caseKey: "diagnosis" },
  action: { heading: "Action", caseKey: "action" },
});

const ANSWER_SECTION_ORDER = Object.freeze(["signs", "diagnosis", "action"]);

function isLaoLanguage() {
  const language = String(
    document.documentElement.lang || localStorage.getItem("prefLang") || "",
  ).toLowerCase();
  return language === "lo" || language.startsWith("lo-") || language === "lao";
}

function appendAnswerBubble(log, caseData, sectionIds) {
  const bubble = document.createElement("div");
  bubble.className = "casechat-bubble casechat-bubble--user";

  const answer = document.createElement("div");
  answer.className = "casechat-text medical-anterior-answer";
  sectionIds.forEach((sectionId) => {
    const config = ANSWER_SECTION_CONFIG[sectionId];
    if (!config) return;
    appendAnswerSection(answer, config.heading, caseData[config.caseKey] || []);
  });

  bubble.appendChild(answer);
  log.appendChild(bubble);
}

function appendCompletionMessage(log) {
  const bubble = document.createElement("div");
  bubble.className = "casechat-bubble casechat-bubble--system";

  const message = document.createElement("div");
  message.className = "casechat-system medical-anterior-complete";
  message.textContent = "All cases completed.";

  bubble.appendChild(message);
  log.appendChild(bubble);
}

function scrollToLatestMessage(log) {
  const schedule = window.requestAnimationFrame || ((callback) => callback());
  schedule(() => {
    const latest = log.lastElementChild;
    if (typeof latest?.scrollIntoView === "function") {
      latest.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  });
}

function scrollToCaseStart() {
  const schedule = window.requestAnimationFrame || ((callback) => callback());
  schedule(() => {
    if (typeof window.scrollTo === "function") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  });
}

export function initializeMedicalAnteriorSegmentCaseStudy() {
  const page = document.getElementById("medicalAnteriorSegmentPage");
  const log = page?.querySelector("#medicalAnteriorCaseChatLog");
  const answerButton = page?.querySelector("#medicalAnteriorAnswerBtn");
  const sectionButtons = Array.from(
    page?.querySelectorAll("[data-medical-answer-section]") || [],
  );
  if (
    !page ||
    !log ||
    !answerButton ||
    sectionButtons.length !== ANSWER_SECTION_ORDER.length ||
    page.dataset.caseStudyInited === "1"
  ) {
    return;
  }

  page.dataset.caseStudyInited = "1";
  let caseIndex = 0;
  let revealedSections = new Set();

  function configureButton(label, action, ariaLabel = label) {
    answerButton.textContent = label;
    answerButton.dataset.action = action;
    answerButton.setAttribute("aria-label", ariaLabel);
  }

  function configureAdvanceButton(caseData) {
    configureButton(
      caseIndex === TOTAL_CASES - 1 ? "Finish" : "Next case >",
      caseIndex === TOTAL_CASES - 1 ? "finish" : "next",
      caseIndex === TOTAL_CASES - 1
        ? isLaoLanguage()
          ? "ສິ້ນສຸດກໍລະນີສຶກສາ"
          : "Finish case study"
        : isLaoLanguage()
          ? `ໄປຫາກໍລະນີ ${caseData.id + 1}`
          : `Go to case ${caseData.id + 1}`,
    );
  }

  function resetSectionButtons() {
    revealedSections = new Set();
    sectionButtons.forEach((button) => {
      button.disabled = false;
      button.setAttribute("aria-pressed", "false");
    });
  }

  function revealSection(sectionId, button) {
    const caseData = MEDICAL_ANTERIOR_CASES[caseIndex];
    if (
      !caseData ||
      !ANSWER_SECTION_CONFIG[sectionId] ||
      revealedSections.has(sectionId)
    ) {
      return;
    }

    appendAnswerBubble(log, caseData, [sectionId]);
    revealedSections.add(sectionId);
    button.disabled = true;
    button.setAttribute("aria-pressed", "true");

    if (revealedSections.size === ANSWER_SECTION_ORDER.length) {
      configureAdvanceButton(caseData);
    }
    scrollToLatestMessage(log);
  }

  function renderCase() {
    const caseData = MEDICAL_ANTERIOR_CASES[caseIndex];
    if (!caseData) return;

    log.replaceChildren();
    page.dataset.currentCase = String(caseData.id);
    page.dataset.caseComplete = "false";
    appendSystemMessage(log, caseData.id);
    appendPatientBubbles(log, caseData);
    resetSectionButtons();
    configureButton(
      "See all",
      "see-all",
      isLaoLanguage()
        ? `ສະແດງຄຳຕອບທັງໝົດຂອງກໍລະນີ ${caseData.id}`
        : `Show all answers for case ${caseData.id}`,
    );
  }

  sectionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      revealSection(button.dataset.medicalAnswerSection, button);
    });
  });

  answerButton.addEventListener("click", () => {
    const action = answerButton.dataset.action;

    if (action === "see-all") {
      const caseData = MEDICAL_ANTERIOR_CASES[caseIndex];
      if (!caseData) return;
      appendAnswerBubble(log, caseData, ANSWER_SECTION_ORDER);
      ANSWER_SECTION_ORDER.forEach((sectionId) => {
        revealedSections.add(sectionId);
      });
      sectionButtons.forEach((button) => {
        button.disabled = true;
        button.setAttribute("aria-pressed", "true");
      });
      configureAdvanceButton(caseData);
      scrollToLatestMessage(log);
      return;
    }

    if (action === "next") {
      caseIndex += 1;
      renderCase();
      scrollToCaseStart();
      return;
    }

    if (action === "finish") {
      page.dataset.caseComplete = "true";
      appendCompletionMessage(log);
      sectionButtons.forEach((button) => {
        button.disabled = true;
      });
      configureButton("Restart", "restart", "Restart case study");
      scrollToLatestMessage(log);
      return;
    }

    if (action === "restart") {
      caseIndex = 0;
      renderCase();
      scrollToCaseStart();
    }
  });

  renderCase();
}
