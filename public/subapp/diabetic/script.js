import {
  FINDING_GROUPS,
  MODE_LABELS,
  VA_OPTIONS,
} from "./src/findings.js?v=20260518-findingdropdown";
import { createViewer } from "./src/viewer.js?v=20260519-viewer";
import {
  CATARACT_OCCLUSION_SPOTS,
  CATARACT_PRESETS,
  DEFAULT_VIEWER_IMAGE_SRC,
  DIABETIC_IMAGE_CASES,
  VIEWER_EXPLANATION_TEMPLATES,
} from "./src/viewer-config.js?v=20260519-viewer";
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
let examExpanded = false;
let openFindingsEye = null;
let openFindingDetailKey = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const elements = {
  canvas: $("#fundusCanvas"),
  fovToggle: $("#fovToggle"),
  fovLabelSmall: $("#fovLabelSmall"),
  fovLabelLeft: $("#fovLabelLeft"),
  fovLabelRight: $("#fovLabelRight"),
  eyeToggle: $("#eyeToggle"),
  eyeLabelRight: $("#eyeLabelRight"),
  eyeLabelLeft: $("#eyeLabelLeft"),
  cataractSlider: $("#cataractSlider"),
  cataractStops: $$(".cataract-stop"),
  viewerDilationToggle: $("#viewerDilationToggle"),
  gazeMoveToggle: $("#gazeMoveToggle"),
  viewerPigmentationToggle: $("#viewerPigmentationToggle"),
  viewerPigmentationText: $("#viewerPigmentationText"),
  viewerExplanation: $("#viewerExplanation"),
  previousCaseButton: $("#previousCaseButton"),
  nextCaseButton: $("#nextCaseButton"),
  viewerCaseLabel: $("#viewerCaseLabel"),
  viewerCaseShortLabel: $("#viewerCaseShortLabel"),
  viewerCaseSummaryToggle: $("#viewerCaseSummaryToggle"),
  viewerCaseDescription: $("#viewerCaseDescription"),
  viewerCaseDescriptionTitle: $("#viewerCaseDescriptionTitle"),
  viewerCaseDescriptionBody: $("#viewerCaseDescriptionBody"),
  rightDistanceVA: $("#rightDistanceVA"),
  leftDistanceVA: $("#leftDistanceVA"),
  rightViewStatusSelect: $("#rightViewStatusSelect"),
  leftViewStatusSelect: $("#leftViewStatusSelect"),
  findingsContainer: $("#findingsContainer"),
  recordingSystemPanel: $(".recording-system-panel"),
  recordingSystemContent: $("#recordingSystemContent"),
  recordingSystemToggle: $("#recordingSystemToggle"),
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
  shareReferralButton: $("#shareReferralButton"),
  practiceModal: $("#practiceModal"),
  practiceModalContent: $("#practiceModalContent"),
  practiceCases: $("#practiceCases"),
  guideModal: $("#guideModal"),
  guideModalContent: $("#guideModalContent"),
  guideTitle: $("#guideTitle"),
  guideContent: $("#guideContent"),
};

let isSyncingViewerDilation = false;
let activeViewerCaseIndex = 0;
let gazeMoveIntervalId = null;
let caseDescriptionOpen = false;
const preloadedViewerImages = new Map();

function getViewerCaseImageSrc(caseItem) {
  return state.viewer.pigmentation === "dark"
    ? caseItem.darkSrc || caseItem.src
    : caseItem.src;
}

function getViewerCaseImageScale(caseItem) {
  return Number.isFinite(caseItem.viewScale) ? caseItem.viewScale : 1;
}

const viewer = createViewer({
  state,
  canvas: elements.canvas,
  fovToggleCheckbox: elements.fovToggle,
  fovLabelSmall: elements.fovLabelSmall,
  fovLabelLeft: elements.fovLabelLeft,
  fovLabelRight: elements.fovLabelRight,
  eyeToggleCheckbox: elements.eyeToggle,
  eyeLabelRight: elements.eyeLabelRight,
  eyeLabelLeft: elements.eyeLabelLeft,
  cataractSlider: elements.cataractSlider,
  cataractStops: elements.cataractStops,
  explanation: elements.viewerExplanation,
  conditionButtons: [],
  defaultImageSrc: DEFAULT_VIEWER_IMAGE_SRC,
  explanationTemplates: VIEWER_EXPLANATION_TEMPLATES,
  cataractPresets: CATARACT_PRESETS,
  cataractOcclusionSpots: CATARACT_OCCLUSION_SPOTS,
  onDilationChange: (isDilated) => {
    if (isSyncingViewerDilation) return;
    setClinicalDilation(isDilated, { syncViewer: false });
  },
});

const guideText = {
  cases: {
    label: "Practice cases",
    intro:
      "Use the 10 retinal images as recognition practice, then record the clinical exam below.",
    cues: [
      ["Cases", "< / > changes case"],
      ["Skin", "light or dark retina"],
      ["Eye", "R/L orientation"],
    ],
    detailTitle: "How to use",
    details: [
      ["Cases", "Use < and > to move through the 10 image cases."],
      [
        "Skin",
        "Switches between light and dark pigmentation versions of the same case.",
      ],
      [
        "R/L",
        "Changes viewing orientation only. Record RE and LE separately below.",
      ],
    ],
    footer: [
      "The image case is practice material. The Exam box is the record.",
    ],
  },
  viewing: {
    label: "Viewing controls",
    intro:
      "Choose the viewing method, then make the simulated view match what was actually seen.",
    cues: [
      ["DO", "small direct view"],
      ["BIO", "wider lens view"],
      ["Cat", "cataract blur"],
    ],
    detailTitle: "Controls",
    details: [
      ["Arclight", "Small direct view for disc and macula glimpses."],
      [
        "Holo",
        "Wider BIO-style lens view. Dilated increases the field when dilation is recorded.",
      ],
      [
        "Gaze",
        "Moves the viewing window. Cataract adds slight, medium or full blur.",
      ],
    ],
    footer: [
      "The controls are for viewing difficulty, not for changing the clinical finding.",
    ],
  },
  recording: {
    label: "Recording",
    intro: "Record each eye separately before relying on the Action wording.",
    cues: [
      ["VA", "vision level"],
      ["View", "quality and area"],
      ["Findings", "signs by eye"],
    ],
    detailTitle: "Exam fields",
    details: [
      ["VA", "Record VA separately for RE and LE."],
      [
        "View",
        "Use Disc+mac, Post pole, Limited, Hazy or Ungradable to describe the view.",
      ],
      [
        "Findings",
        "Record findings by eye. Complete both eyes where possible.",
      ],
    ],
    footer: ["Blank fields mean incomplete recording, not a normal result."],
  },
  findings: {
    label: "Findings",
    intro:
      "Use the finding groups to separate background DR, macula risk and proliferative red flags.",
    cues: [
      ["DR signs", "MA, D/B, CWS, VB"],
      ["Macula", "HE or fovea risk"],
      ["Urgent", "NVD, NVE, PR-H, Vit H"],
    ],
    detailTitle: "Finding groups",
    details: [
      [
        "DR signs",
        "Microaneurysm, dot/blot haemorrhage, cotton-wool spot or venous beading.",
      ],
      [
        "Macula risk",
        "Hard exudates near the macula, fovea risk or reduced VA with DR signs.",
      ],
      [
        "Urgent",
        "NVD, NVE, preretinal haemorrhage or vitreous haemorrhage means urgent today.",
      ],
    ],
    footer: [
      "Use the small chevrons beside each finding for short explanations.",
    ],
  },
  action: {
    label: "Action",
    intro:
      "Action combines the highest-risk finding with view quality, VA and whether both eyes are recorded.",
    cues: [
      ["Routine", "weeks"],
      ["Soon", "days"],
      ["Urgent", "today"],
    ],
    detailTitle: "Priority rules",
    details: [
      ["Routine", "DR signs without macula-risk or proliferative signs."],
      ["Soon", "Possible macula risk or reduced VA with DR signs."],
      [
        "Urgent",
        "NVD, NVE, preretinal haemorrhage or vitreous haemorrhage overrides other wording.",
      ],
    ],
    footer: [
      "Ungradable or incomplete fellow-eye recording is kept as a limitation.",
    ],
  },
  about: {
    label: "Safety",
    intro:
      "This app supports teaching and triage. It does not replace formal diabetic eye screening.",
    cues: [
      ["Scope", "teaching aid"],
      ["No signs", "view obtained only"],
      ["Pathway", "local rules"],
    ],
    detailTitle: "Safety wording",
    details: [
      [
        "Scope",
        "Use as a teaching and triage aid, not as a formal screening replacement.",
      ],
      ["No signs", "Means no referable signs were seen in the view obtained."],
      [
        "Referral",
        "Adapt referral wording to local pathways and clinical judgement.",
      ],
    ],
    footer: ["Routine diabetic eye screening is still required."],
  },
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
      makeElement("span", "finding-dropdown-title", "Findings"),
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
        const detailKey = `${eyeKey}:${finding.key}`;
        const detailId = `findingDetail-${eyeKey}-${finding.key}`;
        const isDetailOpen = openFindingDetailKey === detailKey;
        const optionWrap = makeElement(
          "div",
          `finding-detail-item${isDetailOpen ? " is-open" : ""}`,
        );
        const optionSummary = makeElement("div", "finding-detail-summary");
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

        const detailToggle = makeElement("button", "finding-detail-toggle");
        detailToggle.type = "button";
        detailToggle.setAttribute("aria-expanded", String(isDetailOpen));
        detailToggle.setAttribute("aria-controls", detailId);
        detailToggle.setAttribute(
          "aria-label",
          `${isDetailOpen ? "Hide" : "Show"} ${finding.shortLabel || finding.label} explanation`,
        );
        detailToggle.append(
          makeElement("span", "finding-detail-toggle-icon", "⌄"),
        );
        detailToggle.addEventListener("click", () => {
          openFindingsEye = eyeKey;
          openFindingDetailKey = isDetailOpen ? null : detailKey;
          render();
        });

        const detail = makeElement("div", "finding-detail-panel");
        detail.id = detailId;
        detail.hidden = !isDetailOpen;
        const detailText = makeElement("p");
        detailText.append(
          makeElement("strong", "", `${finding.label}.`),
          ` ${finding.detail || finding.label}`,
        );
        detail.append(detailText);

        optionSummary.append(label, detailToggle);
        optionWrap.append(optionSummary, detail);
        options.append(optionWrap);
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
        openFindingDetailKey = null;
        details
          .querySelectorAll('.finding-detail-toggle[aria-expanded="true"]')
          .forEach((button) => {
            const detail = document.getElementById(
              button.getAttribute("aria-controls") || "",
            );
            button.setAttribute("aria-expanded", "false");
            detail?.setAttribute("hidden", "");
            button.closest(".finding-detail-item")?.classList.remove("is-open");
          });
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
  elements.actionTone.className = `action-tone tone-${currentTriage.tone}`;
  elements.actionCard.className = `action-card tone-${currentTriage.tone}`;
  elements.actionPanel.classList.toggle("is-collapsed", !actionExpanded);
  elements.actionPanel.classList.toggle("is-expanded", actionExpanded);
  elements.actionDetails.hidden = !actionExpanded;
  elements.actionDetails.setAttribute("aria-hidden", String(!actionExpanded));
  elements.actionToggle.textContent = actionExpanded ? "×" : "+";
  elements.actionToggle.setAttribute(
    "aria-label",
    actionExpanded ? "Close action details" : "Show action details",
  );
  elements.actionToggle.setAttribute("aria-expanded", String(actionExpanded));
  renderActionList(elements.actionReasons, currentTriage.reasons);
  renderActionList(elements.actionLimitations, currentTriage.limitations);
  elements.actionNext.textContent = currentTriage.next;
  elements.actionSafety.textContent = currentTriage.safety.join(" ");
}

function renderExamCollapse() {
  elements.recordingSystemPanel.classList.toggle("is-collapsed", !examExpanded);
  elements.recordingSystemContent.hidden = !examExpanded;
  elements.recordingSystemContent.setAttribute(
    "aria-hidden",
    String(!examExpanded),
  );
  elements.recordingSystemToggle.textContent = examExpanded ? "-" : "+";
  elements.recordingSystemToggle.setAttribute(
    "aria-expanded",
    String(examExpanded),
  );
  elements.recordingSystemToggle.setAttribute(
    "aria-label",
    examExpanded ? "Collapse Exam" : "Expand Exam",
  );
}

function renderViewerCaseNavigation() {
  const caseNumber = activeViewerCaseIndex + 1;
  const caseItem = DIABETIC_IMAGE_CASES[activeViewerCaseIndex];
  const summary = caseItem.summary || `Case ${caseNumber}`;
  const descriptionLines = caseItem.description || [];
  elements.viewerCaseLabel.textContent = `${caseNumber}/${DIABETIC_IMAGE_CASES.length}`;
  elements.viewerCaseLabel.setAttribute(
    "aria-label",
    `Case ${caseNumber} of ${DIABETIC_IMAGE_CASES.length}`,
  );
  elements.viewerCaseShortLabel.textContent = "Case information";
  elements.viewerCaseSummaryToggle.setAttribute(
    "aria-expanded",
    String(caseDescriptionOpen),
  );
  elements.viewerCaseSummaryToggle.setAttribute(
    "aria-label",
    caseDescriptionOpen
      ? `Info: hide case ${caseNumber} description, ${summary}`
      : `Info: show case ${caseNumber} description`,
  );
  elements.viewerCaseDescription.hidden = !caseDescriptionOpen;
  elements.viewerCaseDescription.setAttribute(
    "aria-hidden",
    String(!caseDescriptionOpen),
  );
  elements.viewerCaseDescriptionTitle.textContent = `${caseNumber}/${DIABETIC_IMAGE_CASES.length}: ${summary}`;
  elements.viewerCaseDescriptionBody.replaceChildren(
    ...descriptionLines.map((line) => makeElement("p", "", line)),
  );
}

function setViewerCase(index) {
  const totalCases = DIABETIC_IMAGE_CASES.length;
  activeViewerCaseIndex = (index + totalCases) % totalCases;
  caseDescriptionOpen = false;
  const caseItem = DIABETIC_IMAGE_CASES[activeViewerCaseIndex];
  viewer.setViewerCase({
    condition: caseItem.id,
    imagePath: getViewerCaseImageSrc(caseItem),
    imageScale: getViewerCaseImageScale(caseItem),
  });
  renderViewerCaseNavigation();
  prefetchViewerImages();
}

function setGazeMoveEnabled(enabled) {
  if (gazeMoveIntervalId !== null) {
    window.clearInterval(gazeMoveIntervalId);
    gazeMoveIntervalId = null;
  }

  elements.gazeMoveToggle.checked = Boolean(enabled);
  if (!enabled) return;

  viewer.doGazeShift();
  gazeMoveIntervalId = window.setInterval(() => {
    if (!state.viewer.shiftInProgress) {
      viewer.doGazeShift();
    }
  }, 3600);
}

function setClinicalDilation(isDilated, options = {}) {
  const nextValue = isDilated ? "yes" : "no";
  const syncViewer = options.syncViewer !== false;
  const hasChanged = state.dilation !== nextValue;

  setDilation(state, nextValue);

  if (syncViewer) {
    isSyncingViewerDilation = true;
    viewer.setDilated(isDilated);
    isSyncingViewerDilation = false;
  }

  if (hasChanged) {
    render();
  } else {
    renderDilation();
  }
}

function renderDilation() {
  const isDilated = state.dilation === "yes";
  elements.viewerDilationToggle.checked = isDilated;
}

function renderPigmentationControl() {
  const isDark = state.viewer.pigmentation === "dark";
  elements.viewerPigmentationToggle.disabled = false;
  elements.viewerPigmentationToggle.checked = isDark;
  elements.viewerPigmentationText.textContent = isDark ? "Dark" : "Light";
}

function renderVa() {
  elements.rightDistanceVA.value = state.eyes.right.distanceVA;
  elements.leftDistanceVA.value = state.eyes.left.distanceVA;
}

function render() {
  renderDilation();
  renderPigmentationControl();
  renderVa();
  renderViewControls();
  renderFindings();
  renderAction();
  renderExamCollapse();
}

function makeGuideCue([label, detail]) {
  const cue = makeElement("span", "info-basics-cue");
  cue.append(
    makeElement("strong", "", label),
    makeElement("small", "", detail),
  );
  return cue;
}

function makeGuideDetail([label, detail]) {
  const paragraph = makeElement("p");
  paragraph.append(makeElement("strong", "", `${label}:`), ` ${detail}`);
  return paragraph;
}

function renderGuideContent(guide) {
  const definition = makeElement("section", "info-guide-definition");
  definition.append(
    makeElement("p", "info-look-title", guide.label),
    makeElement("p", "", guide.intro),
  );

  const dividerTop = document.createElement("hr");
  const guideWrap = makeElement("div", "info-look-guide");

  const basics = makeElement(
    "section",
    "info-look-section info-look-section--basics",
  );
  basics.append(
    makeElement("p", "info-look-title", "Basics"),
    makeElement("div", "info-basics-grid"),
  );
  basics.lastElementChild.append(...guide.cues.map(makeGuideCue));

  const detail = makeElement(
    "section",
    "info-look-section info-look-section--detail",
  );
  detail.append(
    makeElement("p", "info-look-title", guide.detailTitle),
    ...guide.details.map(makeGuideDetail),
  );

  guideWrap.append(basics, detail);

  const dividerBottom = document.createElement("hr");
  const footer = makeElement("div", "info-points");
  footer.append(...guide.footer.map((line) => makeElement("p", "", line)));

  return [definition, dividerTop, guideWrap, dividerBottom, footer];
}

function openGuide(key) {
  const title =
    {
      cases: "Cases and skin",
      viewing: "Viewing controls",
      recording: "Record RE/LE",
      findings: "Findings guide",
      action: "Action wording",
      about: "Safety and local pathways",
    }[key] || "Guide";
  const guide = guideText[key] || guideText.about;

  elements.guideTitle.textContent = title;
  elements.guideContent.replaceChildren(...renderGuideContent(guide));
  openModal(elements.guideModal, elements.guideModalContent);
}

function renderPracticeCases() {
  const cards = PRACTICE_CASES.map((item, index) => {
    const card = makeElement("article", "practice-card");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open ${item.title}: ${item.prompt}`);
    card.dataset.caseIndex = String(index);
    const preview = makeElement("figure", "practice-image");
    const image = document.createElement("img");
    image.src = item.imageSrc;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    preview.append(image, makeElement("figcaption", "", item.imageLabel));
    const content = makeElement("div", "practice-card-copy");
    const answerLines = Array.isArray(item.answer)
      ? item.answer
      : [item.answer];
    content.append(
      makeElement("h3", "", item.title),
      makeElement("p", "practice-card-summary", item.prompt),
      ...answerLines.map((line) => makeElement("p", "", line)),
      makeElement("span", "practice-card-action", "Open case >"),
    );
    card.append(preview, content);
    return card;
  });
  elements.practiceCases.replaceChildren(...cards);
}

function openPracticeCase(caseIndex) {
  setViewerCase(caseIndex);
  closeModal(elements.practiceModal);
}

function openReferralNote() {
  elements.referralText.value = buildReferralNote(state, currentTriage);
  elements.copyStatus.textContent = "";
  elements.shareReferralButton.hidden = !navigator.share;
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

async function shareReferralNote() {
  if (!navigator.share) {
    elements.copyStatus.textContent = "Sharing is not available here.";
    return;
  }
  try {
    await navigator.share({
      title: "Diabetic referral note",
      text: elements.referralText.value,
    });
    elements.copyStatus.textContent = "Shared.";
  } catch (error) {
    if (error?.name !== "AbortError") {
      elements.copyStatus.textContent = "Share failed.";
    }
  }
}

function prefetchViewerImages() {
  if (typeof window === "undefined" || typeof Image === "undefined") return;
  const totalCases = DIABETIC_IMAGE_CASES.length;
  const indices = [
    activeViewerCaseIndex,
    (activeViewerCaseIndex + totalCases - 1) % totalCases,
    (activeViewerCaseIndex + 1) % totalCases,
  ];
  const sources = new Set(
    indices
      .map((index) => getViewerCaseImageSrc(DIABETIC_IMAGE_CASES[index]))
      .filter(Boolean),
  );
  const preload = () => {
    sources.forEach((src) => {
      if (preloadedViewerImages.has(src)) return;
      const image = new Image();
      image.decoding = "async";
      preloadedViewerImages.set(src, image);
      image.src = src;
    });
  };
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(preload, { timeout: 1200 });
  } else {
    window.setTimeout(preload, 220);
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
    tabs: $$(".tab-btn[data-mode]"),
    onChange: (mode) => {
      setMode(state, mode);
      viewer.setViewerMode(mode);
      render();
    },
  });

  elements.viewerDilationToggle.addEventListener("change", () => {
    setClinicalDilation(elements.viewerDilationToggle.checked);
  });
  elements.gazeMoveToggle.addEventListener("change", () => {
    setGazeMoveEnabled(elements.gazeMoveToggle.checked);
  });
  elements.viewerPigmentationToggle.addEventListener("change", () => {
    state.viewer.pigmentation = elements.viewerPigmentationToggle.checked
      ? "dark"
      : "light";
    const caseItem = DIABETIC_IMAGE_CASES[activeViewerCaseIndex];
    viewer.setViewerCase({
      condition: caseItem.id,
      imagePath: getViewerCaseImageSrc(caseItem),
      imageScale: getViewerCaseImageScale(caseItem),
    });
    renderPigmentationControl();
    prefetchViewerImages();
  });
  elements.previousCaseButton.addEventListener("click", () => {
    setViewerCase(activeViewerCaseIndex - 1);
  });
  elements.nextCaseButton.addEventListener("click", () => {
    setViewerCase(activeViewerCaseIndex + 1);
  });
  elements.viewerCaseSummaryToggle.addEventListener("click", () => {
    caseDescriptionOpen = !caseDescriptionOpen;
    renderViewerCaseNavigation();
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
  elements.recordingSystemToggle.addEventListener("click", () => {
    examExpanded = !examExpanded;
    renderExamCollapse();
  });
  $("#referralNoteButton").addEventListener("click", openReferralNote);
  $("#closeReferralButton").addEventListener("click", () =>
    closeModal(elements.referralModal),
  );
  $("#copyReferralButton").addEventListener("click", copyReferralNote);
  elements.shareReferralButton.addEventListener("click", shareReferralNote);
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
  elements.practiceCases.addEventListener("click", (event) => {
    const card = event.target.closest(".practice-card");
    if (!card || !elements.practiceCases.contains(card)) return;
    openPracticeCase(Number(card.dataset.caseIndex || 0));
  });
  elements.practiceCases.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest(".practice-card");
    if (!card || !elements.practiceCases.contains(card)) return;
    event.preventDefault();
    openPracticeCase(Number(card.dataset.caseIndex || 0));
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
    caseDescriptionOpen = false;
    renderViewerCaseNavigation();
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
  try {
    viewer.initialize();
    renderViewerCaseNavigation();
    prefetchViewerImages();
  } catch (error) {
    console.error("Viewer initialisation failed", error);
  }
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
