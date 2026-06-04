import {
  FINDING_GROUPS,
  MODE_LABELS,
  VA_OPTIONS,
} from "./src/findings.js?v=20260518-findingdropdown";
import {
  createInitialState,
  setDilation,
  setDistanceVA,
  setEyeField,
  setFinding,
  setMode,
  setSystemicCheck,
} from "./src/state.js?v=20260518-findingdropdown";
import { evaluateTriage } from "./src/triage.js?v=20260518-findingdropdown";
import { buildReferralNote } from "./src/referral-note.js?v=20260518-findingdropdown";
import { PRACTICE_CASES } from "./src/practice-cases.js?v=20260518-findingdropdown";
import {
  createMcqController,
  validateMcqBanks,
} from "./src/mcq.js?v=20260518-findingdropdown";
import {
  closeModal,
  openModal,
  setupDrawer,
  setupInfoPopup,
  setupTabs,
} from "./src/ui-shell.js?v=20260518-findingdropdown";

const state = createInitialState();
let currentTriage = evaluateTriage(state);
let actionExpanded = false;
let openFindingsEye = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const elements = {
  dilationSwitch: $(".diabetic-dilation-switch"),
  dilationToggle: $("#dilationToggle"),
  rightDistanceVA: $("#rightDistanceVA"),
  leftDistanceVA: $("#leftDistanceVA"),
  rightViewStatusSelect: $("#rightViewStatusSelect"),
  leftViewStatusSelect: $("#leftViewStatusSelect"),
  findingsContainer: $("#findingsContainer"),
  actionPanel: $(".action-panel"),
  actionDetails: $("#actionDetails"),
  actionToggle: $("#actionToggle"),
  actionCard: $("#actionCard"),
  actionTone: $("#actionTone"),
  actionTitle: $("#actionTitle"),
  actionReasons: $("#actionReasons"),
  actionLimitations: $("#actionLimitations"),
  actionNext: $("#actionNext"),
  actionSafety: $("#actionSafety"),
  referralModal: $("#referralModal"),
  referralModalContent: $("#referralModalContent"),
  referralText: $("#referralText"),
  copyStatus: $("#copyStatus"),
  practiceModal: $("#practiceModal"),
  practiceModalContent: $("#practiceModalContent"),
  practiceCases: $("#practiceCases"),
  guideModal: $("#guideModal"),
  guideModalContent: $("#guideModalContent"),
  guideTitle: $("#guideTitle"),
  guideContent: $("#guideContent"),
};

const guideText = {
  dilation: [
    "Record dilation as Yes or No.",
    "Yes means the retinal view was obtained after dilation.",
    "No means the Action panel and referral note will state that the view was not dilated.",
  ],
  arclight: [
    "Use Arclight (DO) to inspect the posterior pole, disc and macula where possible.",
    "Do not imply a complete peripheral assessment from a limited direct view.",
    "Record limited glimpses when the view is brief or incomplete.",
  ],
  holo: [
    "Holo (BIO) should prompt dilation before recording the view.",
    "Four-quadrant sweep belongs to Holo (BIO), not Arclight (DO).",
    "Record only what was actually seen.",
  ],
  lesions: [
    "DR signs: microaneurysms, dot/blot haemorrhages, cotton-wool spots and venous beading.",
    "Macula risk: hard exudates near macula, possible foveal involvement or reduced VA with DR signs.",
    "Red flags: NVD, NVE, preretinal haemorrhage or vitreous haemorrhage.",
  ],
  referral: [
    "Routine referral when possible: DR signs without macula-risk or proliferative signs.",
    "Refer soon (2 weeks): possible maculopathy, reduced VA with DR context or concerning DR signs.",
    "Urgent today: NVD, NVE, preretinal haemorrhage or vitreous haemorrhage.",
  ],
  about: [
    "Default referral wording is deliberately simple and should follow local pathways.",
    "Systemic checks support diabetes/medical review, but do not change retinal urgency.",
    "This app is a teaching and triage aid, not a formal screening replacement.",
  ],
};

const VIEW_STATUS_OPTIONS = {
  "arclight-do": [
    { value: "", label: "", viewQuality: "", areaSeen: "" },
    {
      value: "disc-macula-clear",
      label: "Disc+mac",
      viewQuality: "clear",
      areaSeen: "disc-macula",
    },
    {
      value: "posterior-pole-clear",
      label: "Post pole",
      viewQuality: "clear",
      areaSeen: "posterior-pole",
    },
    {
      value: "limited",
      label: "Limited",
      viewQuality: "partial",
      areaSeen: "limited",
    },
    { value: "hazy", label: "Hazy", viewQuality: "hazy", areaSeen: "limited" },
    {
      value: "ungradable",
      label: "Ungradable",
      viewQuality: "ungradable",
      areaSeen: "limited",
    },
  ],
  "holo-bio": [
    { value: "", label: "", viewQuality: "", areaSeen: "" },
    {
      value: "four-quadrants-clear",
      label: "4 quad",
      viewQuality: "clear",
      areaSeen: "four-quadrants",
    },
    {
      value: "disc-macula-clear",
      label: "Disc+mac",
      viewQuality: "clear",
      areaSeen: "disc-macula",
    },
    {
      value: "posterior-pole-clear",
      label: "Post pole",
      viewQuality: "clear",
      areaSeen: "posterior-pole",
    },
    {
      value: "limited",
      label: "Limited",
      viewQuality: "partial",
      areaSeen: "limited",
    },
    { value: "hazy", label: "Hazy", viewQuality: "hazy", areaSeen: "limited" },
    {
      value: "ungradable",
      label: "Ungradable",
      viewQuality: "ungradable",
      areaSeen: "limited",
    },
  ],
};

function getViewStatusOptions(mode) {
  return VIEW_STATUS_OPTIONS[mode] || VIEW_STATUS_OPTIONS["arclight-do"];
}

function getViewStatusValue(mode, eye) {
  const options = getViewStatusOptions(mode);
  const exact = options.find(
    (option) =>
      option.viewQuality === eye.viewQuality &&
      option.areaSeen === eye.areaSeen,
  );
  if (exact) return exact.value;
  if (eye.viewQuality === "ungradable") return "ungradable";
  if (eye.viewQuality === "hazy") return "hazy";
  if (eye.viewQuality === "partial" || eye.areaSeen === "limited")
    return "limited";
  return "";
}

function applyViewStatus(eyeKey, value) {
  const option =
    getViewStatusOptions(state.mode).find((item) => item.value === value) ||
    getViewStatusOptions(state.mode)[0];
  setEyeField(state, eyeKey, "viewQuality", option.viewQuality);
  setEyeField(state, eyeKey, "areaSeen", option.areaSeen);
}

function getFindingSummary(eyeKey) {
  const findings = state.eyes[eyeKey].findings;
  const selected = FINDING_GROUPS.flatMap((group) => group.findings).filter(
    (finding) => Boolean(findings[finding.key]),
  );

  if (findings.noReferableSignsSeen) {
    return "No signs";
  }
  if (selected.length === 0) {
    return "Not recorded";
  }
  if (selected.length <= 2) {
    return selected
      .map((finding) => finding.shortLabel || finding.label)
      .join(", ");
  }
  return `${selected
    .slice(0, 2)
    .map((finding) => finding.shortLabel || finding.label)
    .join(", ")} +${selected.length - 2}`;
}

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function populateVaSelect(select) {
  select.replaceChildren(
    ...VA_OPTIONS.map((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      return optionElement;
    }),
  );
}

function populateSelect(select, options, selectedValue) {
  select.replaceChildren(
    ...options.map((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option.value;
      optionElement.textContent = option.shortLabel || option.label;
      optionElement.title = option.label;
      return optionElement;
    }),
  );
  select.value = selectedValue || "";
}

function renderOptionGroup(container, options, value, name, onChange) {
  const controls = options.map((option) => {
    const label = makeElement("label", "option-button");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = option.value;
    input.checked = value === option.value;
    label.classList.toggle("is-selected", input.checked);
    label.title = option.label;
    input.addEventListener("change", () => onChange(option.value));
    label.append(
      input,
      makeElement("span", "", option.shortLabel || option.label),
    );
    return label;
  });
  container.replaceChildren(...controls);
}

function renderFindings() {
  const dropdowns = makeElement("div", "findings-dropdowns");

  ["right", "left"].forEach((eyeKey) => {
    const details = makeElement("details", "finding-dropdown");
    details.dataset.eye = eyeKey;
    details.open = openFindingsEye === eyeKey;

    const summary = makeElement("summary", "finding-dropdown-summary");
    summary.append(
      makeElement(
        "span",
        "finding-dropdown-title",
        eyeKey === "right" ? "Right findings" : "Left findings",
      ),
      makeElement("span", "finding-dropdown-value", getFindingSummary(eyeKey)),
    );

    const menu = makeElement("div", "finding-dropdown-menu");
    FINDING_GROUPS.forEach((group) => {
      const groupWrap = makeElement(
        "section",
        `finding-dropdown-group finding-dropdown-group--${group.tone}`,
      );
      groupWrap.append(makeElement("h3", "", group.title));
      const options = makeElement("div", "finding-dropdown-options");
      group.findings.forEach((finding) => {
        const label = makeElement("label", "finding-dropdown-option");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.name = `finding-${eyeKey}`;
        input.value = finding.key;
        input.setAttribute(
          "aria-label",
          `${eyeKey === "right" ? "Right" : "Left"} ${finding.label}`,
        );
        input.checked = Boolean(state.eyes[eyeKey].findings[finding.key]);
        label.title = finding.label;
        label.classList.toggle("is-selected", input.checked);
        input.addEventListener("change", () => {
          setFinding(state, eyeKey, finding.key, input.checked);
          openFindingsEye = eyeKey;
          render();
        });
        label.append(
          input,
          makeElement("span", "", finding.shortLabel || finding.label),
        );
        options.append(label);
      });
      groupWrap.append(options);
      menu.append(groupWrap);
    });

    details.addEventListener("toggle", () => {
      if (details.open) {
        openFindingsEye = eyeKey;
        dropdowns
          .querySelectorAll(".finding-dropdown[open]")
          .forEach((item) => {
            if (item !== details) item.open = false;
          });
      } else if (openFindingsEye === eyeKey) {
        openFindingsEye = null;
      }
    });

    details.append(summary, menu);
    dropdowns.append(details);
  });

  elements.findingsContainer.replaceChildren(dropdowns);
}

function renderViewControls() {
  populateSelect(
    elements.rightViewStatusSelect,
    getViewStatusOptions(state.mode),
    getViewStatusValue(state.mode, state.eyes.right),
  );
  populateSelect(
    elements.leftViewStatusSelect,
    getViewStatusOptions(state.mode),
    getViewStatusValue(state.mode, state.eyes.left),
  );
}

function renderActionList(container, items) {
  const paragraphs =
    items.length > 0
      ? items.map((item) => makeElement("p", "", item))
      : [makeElement("p", "", "No reason recorded yet.")];
  container.replaceChildren(...paragraphs);
}

function renderAction() {
  currentTriage = evaluateTriage(state);
  elements.actionTitle.textContent = currentTriage.title;
  elements.actionTone.textContent = currentTriage.title;
  elements.actionCard.className = `action-card tone-${currentTriage.tone}`;
  elements.actionPanel.classList.toggle("is-collapsed", !actionExpanded);
  elements.actionPanel.classList.toggle("is-expanded", actionExpanded);
  elements.actionDetails.hidden = !actionExpanded;
  elements.actionDetails.setAttribute("aria-hidden", String(!actionExpanded));
  elements.actionToggle.textContent = actionExpanded ? "Hide" : "More";
  elements.actionToggle.setAttribute("aria-expanded", String(actionExpanded));
  renderActionList(elements.actionReasons, currentTriage.reasons);
  renderActionList(elements.actionLimitations, currentTriage.limitations);
  elements.actionNext.textContent = currentTriage.next;
  elements.actionSafety.textContent = currentTriage.safety.join(" ");
}

function renderDilation() {
  elements.dilationToggle.checked = state.dilation === "yes";
}

function renderVa() {
  elements.rightDistanceVA.value = state.eyes.right.distanceVA;
  elements.leftDistanceVA.value = state.eyes.left.distanceVA;
}

function render() {
  renderDilation();
  renderVa();
  renderViewControls();
  renderFindings();
  renderAction();
}

function openGuide(key) {
  const title =
    {
      dilation: "Dilation",
      arclight: "Arclight (DO) sweep",
      holo: "Holo (BIO) sweep",
      lesions: "Lesion guide",
      referral: "Referral wording",
      about: "About local wording",
    }[key] || "Guide";

  elements.guideTitle.textContent = title;
  elements.guideContent.replaceChildren(
    ...(guideText[key] || []).map((line) => makeElement("p", "", line)),
  );
  openModal(elements.guideModal, elements.guideModalContent);
}

function renderPracticeCases() {
  const cards = PRACTICE_CASES.map((item) => {
    const card = makeElement("article", "practice-card");
    const placeholder = makeElement("figure", "placeholder-image");
    const image = document.createElement("img");
    image.src = item.imageSrc || "./assets/placeholders/fundus-placeholder.svg";
    image.alt = "";
    image.loading = "eager";
    placeholder.append(image, makeElement("figcaption", "", item.imageLabel));
    const content = makeElement("div", "practice-card-copy");
    content.append(
      makeElement("h3", "", item.title),
      makeElement("p", "", item.prompt),
      makeElement("p", "", item.answer),
    );
    card.append(placeholder, content);
    return card;
  });
  elements.practiceCases.replaceChildren(...cards);
}

function openReferralNote() {
  elements.referralText.value = buildReferralNote(state, currentTriage);
  elements.copyStatus.textContent = "";
  openModal(elements.referralModal, elements.referralModalContent);
}

async function copyReferralNote() {
  elements.referralText.select();
  try {
    await navigator.clipboard.writeText(elements.referralText.value);
    elements.copyStatus.textContent = "Copied.";
  } catch {
    document.execCommand("copy");
    elements.copyStatus.textContent = "Copied.";
  }
}

function setupEventHandlers() {
  const drawerController = setupDrawer({
    menuButton: $("#menuButton"),
    closeButton: $("#closeDrawerButton"),
    drawer: $("#sideMenu"),
    overlay: $("#drawerOverlay"),
  });

  setupInfoPopup({
    button: $("#infoButton"),
    popup: $("#infoPopup"),
    closeButton: $("#closeInfoButton"),
  });

  setupTabs({
    tabs: $$(".tab-btn[data-tab-target]"),
    panels: $$(".mode-panel"),
    onChange: (mode) => {
      setMode(state, mode);
      render();
    },
  });

  elements.dilationSwitch.addEventListener("click", (event) => {
    event.preventDefault();
    setDilation(state, state.dilation === "yes" ? "no" : "yes");
    render();
  });
  elements.dilationToggle.addEventListener("change", () => {
    setDilation(state, elements.dilationToggle.checked ? "yes" : "no");
    render();
  });
  elements.rightDistanceVA.addEventListener("change", () => {
    setDistanceVA(state, "right", elements.rightDistanceVA.value);
    render();
  });
  elements.leftDistanceVA.addEventListener("change", () => {
    setDistanceVA(state, "left", elements.leftDistanceVA.value);
    render();
  });
  elements.rightViewStatusSelect.addEventListener("change", () => {
    applyViewStatus("right", elements.rightViewStatusSelect.value);
    render();
  });
  elements.leftViewStatusSelect.addEventListener("change", () => {
    applyViewStatus("left", elements.leftViewStatusSelect.value);
    render();
  });
  $$("[data-systemic]").forEach((input) => {
    input.addEventListener("change", () => {
      setSystemicCheck(state, input.dataset.systemic, input.checked);
      render();
    });
  });
  elements.actionToggle.addEventListener("click", () => {
    actionExpanded = !actionExpanded;
    renderAction();
  });
  $("#referralNoteButton").addEventListener("click", openReferralNote);
  $("#closeReferralButton").addEventListener("click", () =>
    closeModal(elements.referralModal),
  );
  $("#copyReferralButton").addEventListener("click", copyReferralNote);
  $("#closePracticeButton").addEventListener("click", () =>
    closeModal(elements.practiceModal),
  );
  $("#closeGuideButton").addEventListener("click", () =>
    closeModal(elements.guideModal),
  );

  $("[data-practice-open]").addEventListener("click", () => {
    drawerController.close();
    renderPracticeCases();
    openModal(elements.practiceModal, elements.practiceModalContent);
  });

  $$("[data-guide]").forEach((button) => {
    button.addEventListener("click", () => {
      drawerController.close();
      openGuide(button.dataset.guide);
    });
  });

  const mcqController = createMcqController({
    modal: $("#mcqModal"),
    modalContent: $("#mcqModalContent"),
    title: $("#mcqTitle"),
    intro: $("#mcqIntro"),
    container: $("#mcqContainer"),
    submit: $("#submitMcqButton"),
    result: $("#mcqResult"),
    close: $("#closeMcqButton"),
  });

  $$("[data-mcq-level]").forEach((button) => {
    button.addEventListener("click", () => {
      drawerController.close();
      mcqController.open(button.dataset.mcqLevel);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    [
      elements.referralModal,
      elements.practiceModal,
      elements.guideModal,
      $("#mcqModal"),
    ].forEach((modal) => closeModal(modal));
  });
}

function init() {
  populateVaSelect(elements.rightDistanceVA);
  populateVaSelect(elements.leftDistanceVA);
  setupEventHandlers();
  const mcqValidation = validateMcqBanks();
  mcqValidation.forEach((result) => {
    if (result.actual !== result.expected || result.invalidAnswers > 0) {
      console.warn("MCQ validation issue", result);
    }
  });
  render();
}

init();
