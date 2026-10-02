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
  DISC_CASE_SETS,
  DIABETIC_IMAGE_CASES,
  VIEWER_EXPLANATION_TEMPLATES,
} from "./src/viewer-config.js?v=20260519-viewer";
import {
  createInitialState,
  resetOperationalState,
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
  lockPageScroll,
  openModal,
  setupDrawer,
  setupInfoPopup,
  setupTabs,
  unlockPageScroll,
} from "./src/ui-shell.js?v=20260518-findingdropdown";

const state = createInitialState();
let currentTriage = evaluateTriage(state);
let actionExpanded = false;
let examExpanded = false;
let openFindingsEye = null;
let openFindingDetailKey = null;
let activeFindingMode = "general";
let resetConfirmationTimerId = 0;

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
  caseSetButtons: $$(".case-set-button"),
  guideModal: $("#guideModal"),
  guideModalContent: $("#guideModalContent"),
  guideTitle: $("#guideTitle"),
  guideContent: $("#guideContent"),
  findingModeTabs: $$(".finding-mode-tab"),
};

function resetOperationalAssessment() {
  resetOperationalState(state);
  actionExpanded = false;
  examExpanded = false;
  openFindingsEye = null;
  openFindingDetailKey = null;
  elements.referralText.value = "";
  elements.copyStatus.textContent = "";
  $$("[data-systemic]").forEach((input) => {
    input.checked = false;
  });
  unlockPageScroll("action-panel");
  render();
}

let activeViewerCaseIndex = 0;
let activeViewerCaseSetId = DISC_CASE_SETS[0]?.id || "neurology";
let gazeMoveIntervalId = null;
let caseDescriptionOpen = false;
const preloadedViewerImages = new Map();
const allViewerCaseIndices = DIABETIC_IMAGE_CASES.map((_, index) => index);
const caseIdToIndex = new Map(
  DIABETIC_IMAGE_CASES.map((item, index) => [item.id, index]),
);

function getViewerCaseImageSrc(caseItem) {
  return state.viewer.pigmentation === "dark"
    ? caseItem.darkSrc || caseItem.src
    : caseItem.src;
}

function getViewerCaseImageScale(caseItem) {
  return Number.isFinite(caseItem.viewScale) ? caseItem.viewScale : 1;
}

function getCaseSetById(caseSetId) {
  return (
    DISC_CASE_SETS.find((set) => set.id === caseSetId) || DISC_CASE_SETS[0]
  );
}

function getCaseSetIndices(caseSetId = activeViewerCaseSetId) {
  const caseSet = getCaseSetById(caseSetId);
  const indices = (caseSet?.caseIds || [])
    .map((caseId) => caseIdToIndex.get(caseId))
    .filter(Number.isInteger);
  return indices.length ? indices : allViewerCaseIndices;
}

function getActiveCaseSet() {
  return getCaseSetById(activeViewerCaseSetId);
}

function getActiveCaseSetIndices() {
  return getCaseSetIndices(activeViewerCaseSetId);
}

function getActiveCaseSetPosition() {
  const indices = getActiveCaseSetIndices();
  const position = indices.indexOf(activeViewerCaseIndex);
  return position >= 0 ? position : 0;
}

function getCaseSetForCaseIndex(caseIndex) {
  return (
    DISC_CASE_SETS.find((caseSet) =>
      getCaseSetIndices(caseSet.id).includes(caseIndex),
    ) || getActiveCaseSet()
  );
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
    elements.viewerDilationToggle.checked = isDilated;
  },
});

const guideText = {
  cases: {
    label: "Practice cases",
    intro:
      "Use the 20 disc cases for recognition practice, then record the clinical exam below.",
    cues: [
      ["Set", "choose the teaching group"],
      ["Cases", "< / > changes case"],
      ["Skin", "light or dark fundus"],
      ["Eye", "R/L orientation"],
    ],
    detailTitle: "How to use",
    details: [
      [
        "Sets",
        "General shows disc swelling, pallor and variants. Normal cups shows healthy cupping range. Glaucoma shows baseline to end-stage progression.",
      ],
      ["Cases", "Use < and > to move through the selected image set."],
      [
        "Skin",
        "Switches between light and dark pigmentation versions of each case.",
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
      "Choose the viewing method, then make the simulated view match what was obtained.",
    cues: [
      ["DO", "small direct view"],
      ["BIO", "wider lens view"],
      ["Cat", "cataract blur"],
    ],
    detailTitle: "Controls",
    details: [
      ["Arclight", "Small direct view for disc and posterior pole glimpses."],
      [
        "Holo",
        "Wider BIO-style lens view. Dilated increases the field when dilation is recorded.",
      ],
      [
        "Gaze",
        "Moves the viewing window. Cataract adds slight, medium or dense blur.",
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
      "Use the finding groups to separate general disc appearances, cup context, glaucoma-pattern signs and urgent swelling.",
    cues: [
      ["General", "swollen, pale, drusen"],
      ["Context", "C/D and disc size"],
      ["Fast", "notch, haem or C/D 0.9"],
    ],
    detailTitle: "Finding groups",
    details: [
      [
        "General discs",
        "Disc swelling, pallor, drusen, anomalous discs, myelination and peripapillary change.",
      ],
      [
        "Cup context",
        "C/D 0.3 and disc size help interpret the disc but should not trigger referral by themselves.",
      ],
      [
        "Glaucoma discs",
        "Thin rim, rim notch, splinter haemorrhage, visible lamina, C/D 0.9 and vessel changes need fast glaucoma review.",
      ],
      [
        "Urgent swelling",
        "True disc swelling, acute visual loss or abnormal pupils should trigger urgent review.",
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
      ["Routine", "local pathway"],
      ["Soon", "disc concern"],
      ["Fast", "glaucoma signs"],
    ],
    detailTitle: "Priority rules",
    details: [
      [
        "Routine",
        "No referable signs, normal cup context or stable disc variants without other concerning features.",
      ],
      [
        "Soon",
        "Disc pallor, suspicious C/D 0.6 or thin rim without immediate red flags.",
      ],
      [
        "Fast glaucoma",
        "C/D 0.9, rim notch, splinter haemorrhage, exposed lamina or bayoneting need rapid glaucoma or eye review.",
      ],
      [
        "Urgent",
        "True disc swelling with symptoms, acute visual loss or abnormal pupils is urgent.",
      ],
    ],
    footer: [
      "Limited, ungradable or incomplete fellow-eye recording is kept as a limitation.",
    ],
  },
  about: {
    label: "Safety",
    intro:
      "This app supports teaching and triage. It does not replace clinical eye assessment.",
    cues: [
      ["Scope", "teaching aid"],
      ["No signs", "view obtained only"],
      ["Pathway", "local rules"],
    ],
    detailTitle: "Safety wording",
    details: [
      [
        "Scope",
        "Use as a teaching and triage aid, not as a clinical assessment replacement.",
      ],
      [
        "No signs",
        "Means no referable disc signs were seen in the view obtained.",
      ],
      [
        "Referral",
        "Adapt referral wording to local pathways and clinical judgement.",
      ],
    ],
    footer: ["Symptoms, pupils, fields, IOP and local pathways still matter."],
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

function setFindingDetailPresentation(button, isOpen) {
  const detail = document.getElementById(
    button.getAttribute("aria-controls") || "",
  );
  const item = button.closest(".finding-detail-item");
  const label = button.dataset.findingLabel || "finding";
  button.setAttribute("aria-expanded", String(isOpen));
  button.setAttribute(
    "aria-label",
    `${isOpen ? "Hide" : "Show"} ${label} explanation`,
  );
  detail?.toggleAttribute("hidden", !isOpen);
  item?.classList.toggle("is-open", isOpen);
}

function toggleFindingDetail(button, detailKey) {
  const shouldOpen = openFindingDetailKey !== detailKey;
  elements.findingsContainer
    .querySelectorAll('.finding-detail-toggle[aria-expanded="true"]')
    .forEach((openButton) => {
      if (openButton !== button)
        setFindingDetailPresentation(openButton, false);
    });
  openFindingDetailKey = shouldOpen ? detailKey : null;
  setFindingDetailPresentation(button, shouldOpen);
}

function renderFindings() {
  const dropdowns = makeElement("div", "findings-dropdowns");
  const visibleGroups = FINDING_GROUPS.filter(
    (group) => !group.modes || group.modes.includes(activeFindingMode),
  )
    .map((group) => ({
      ...group,
      findings: group.findings.filter(
        (finding) =>
          !finding.modes || finding.modes.includes(activeFindingMode),
      ),
    }))
    .filter((group) => group.findings.length > 0);

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
    visibleGroups.forEach((group) => {
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
        detailToggle.dataset.findingLabel = finding.shortLabel || finding.label;
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
          toggleFindingDetail(detailToggle, detailKey);
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

function renderActionList(container, items, emptyText = "") {
  const paragraphs =
    items.length > 0
      ? items.map((item) => makeElement("p", "", item))
      : emptyText
        ? [makeElement("p", "", emptyText)]
        : [];
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
  renderActionList(
    elements.actionReasons,
    currentTriage.reasons,
    "No reason recorded yet.",
  );
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

function renderCaseSetControls() {
  elements.caseSetButtons.forEach((button) => {
    const isActive = button.dataset.caseSet === activeViewerCaseSetId;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderViewerCaseNavigation() {
  const activeCaseSet = getActiveCaseSet();
  const caseSetIndices = getActiveCaseSetIndices();
  const caseNumber = getActiveCaseSetPosition() + 1;
  const caseTotal = caseSetIndices.length;
  const caseItem = DIABETIC_IMAGE_CASES[activeViewerCaseIndex];
  const summary = caseItem.summary || `Case ${caseNumber}`;
  const descriptionLines = caseItem.description || [];
  elements.viewerCaseLabel.textContent = `${caseNumber}/${caseTotal}`;
  elements.viewerCaseLabel.setAttribute(
    "aria-label",
    `${activeCaseSet.label} case ${caseNumber} of ${caseTotal}`,
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
  elements.viewerCaseDescriptionTitle.textContent = `${activeCaseSet.shortLabel || activeCaseSet.label} ${caseNumber}/${caseTotal}: ${summary}`;
  if (descriptionLines.length) {
    const descriptionList = makeElement("ul", "viewer-case-description-list");
    descriptionList.append(
      ...descriptionLines.map((line) => makeElement("li", "", line)),
    );
    elements.viewerCaseDescriptionBody.replaceChildren(descriptionList);
  } else {
    elements.viewerCaseDescriptionBody.replaceChildren();
  }
}

function setViewerCase(index, options = {}) {
  const totalCases = DIABETIC_IMAGE_CASES.length;
  activeViewerCaseIndex = (index + totalCases) % totalCases;
  const nextCaseSet = options.caseSetId
    ? getCaseSetById(options.caseSetId)
    : getCaseSetForCaseIndex(activeViewerCaseIndex);
  activeViewerCaseSetId = nextCaseSet.id;
  caseDescriptionOpen = false;
  const caseItem = DIABETIC_IMAGE_CASES[activeViewerCaseIndex];
  viewer.setViewerCase({
    condition: caseItem.id,
    imagePath: getViewerCaseImageSrc(caseItem),
    imageScale: getViewerCaseImageScale(caseItem),
  });
  renderCaseSetControls();
  renderViewerCaseNavigation();
  if (elements.practiceModal && !elements.practiceModal.hidden) {
    renderPracticeCases();
  }
  prefetchViewerImages();
}

function setViewerCaseInActiveSet(position) {
  const indices = getActiveCaseSetIndices();
  const totalCases = indices.length;
  if (!totalCases) return;
  const nextPosition = (position + totalCases) % totalCases;
  setViewerCase(indices[nextPosition], { caseSetId: activeViewerCaseSetId });
}

function setActiveCaseSet(caseSetId) {
  const caseSet = getCaseSetById(caseSetId);
  if (!caseSet) return;
  const indices = getCaseSetIndices(caseSet.id);
  activeViewerCaseSetId = caseSet.id;
  renderCaseSetControls();
  if (elements.practiceModal && !elements.practiceModal.hidden) {
    renderPracticeCases();
  }
  if (indices.includes(activeViewerCaseIndex)) {
    renderViewerCaseNavigation();
    prefetchViewerImages();
    return;
  }
  setViewerCase(indices[0] || 0, { caseSetId: caseSet.id });
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

function renderDilation() {
  $("#clinicalDilation").value = state.dilation;
  $("#clinicalMode").value = state.mode;
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
  const activeCaseSet = getActiveCaseSet();
  const caseSetIndices = getActiveCaseSetIndices();
  const cards = caseSetIndices.map((caseIndex, setIndex) => {
    const item = PRACTICE_CASES[caseIndex];
    const card = makeElement("article", "practice-card");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-label",
      `Open ${activeCaseSet.label} case ${setIndex + 1}: ${item.prompt}`,
    );
    card.dataset.caseIndex = String(caseIndex);
    card.dataset.caseSet = activeCaseSet.id;
    const preview = makeElement("figure", "practice-image");
    const image = document.createElement("img");
    image.src = item.imageSrc;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    preview.append(
      image,
      makeElement("figcaption", "", `${setIndex + 1}/${caseSetIndices.length}`),
    );
    const content = makeElement("div", "practice-card-copy");
    const answerLines = Array.isArray(item.answer)
      ? item.answer
      : [item.answer];
    content.append(
      makeElement("h3", "", `Case ${setIndex + 1}`),
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
  const caseSet = getCaseSetForCaseIndex(caseIndex);
  setViewerCase(caseIndex, { caseSetId: caseSet.id });
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
      title: "Discs referral note",
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
  const caseSetIndices = getActiveCaseSetIndices();
  const activePosition = getActiveCaseSetPosition();
  const totalCases = caseSetIndices.length;
  if (!totalCases) return;
  const indices = [
    caseSetIndices[activePosition],
    caseSetIndices[(activePosition + totalCases - 1) % totalCases],
    caseSetIndices[(activePosition + 1) % totalCases],
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
      viewer.setViewerMode(mode);
      render();
    },
  });

  elements.findingModeTabs.forEach((tab) => {
    const activateFindingTab = () => {
      activeFindingMode = tab.dataset.findingMode || "general";
      elements.findingModeTabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-selected", String(isActive));
        item.tabIndex = isActive ? 0 : -1;
      });
      elements.findingsContainer.setAttribute("aria-labelledby", tab.id);
      openFindingsEye = null;
      openFindingDetailKey = null;
      renderFindings();
    };
    tab.addEventListener("click", activateFindingTab);
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
        return;
      event.preventDefault();
      const current = elements.findingModeTabs.indexOf(tab);
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? elements.findingModeTabs.length - 1
            : (current +
                (event.key === "ArrowRight" ? 1 : -1) +
                elements.findingModeTabs.length) %
              elements.findingModeTabs.length;
      elements.findingModeTabs[next].focus();
      elements.findingModeTabs[next].click();
    });
  });

  elements.viewerDilationToggle.addEventListener("change", () => {
    viewer.setDilated(elements.viewerDilationToggle.checked);
  });
  $("#clinicalDilation").addEventListener("change", (event) => {
    setDilation(state, event.target.value);
    render();
  });
  $("#clinicalMode").addEventListener("change", (event) => {
    setMode(state, event.target.value);
    render();
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
  elements.caseSetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveCaseSet(button.dataset.caseSet);
    });
  });
  elements.previousCaseButton.addEventListener("click", () => {
    setViewerCaseInActiveSet(getActiveCaseSetPosition() - 1);
  });
  elements.nextCaseButton.addEventListener("click", () => {
    setViewerCaseInActiveSet(getActiveCaseSetPosition() + 1);
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
    if (actionExpanded) {
      lockPageScroll("action-panel");
    } else {
      unlockPageScroll("action-panel");
    }
    renderAction();
  });
  const newAssessmentButton = $("#newAssessmentButton");
  newAssessmentButton.addEventListener("click", () => {
    if (newAssessmentButton.dataset.confirm !== "true") {
      newAssessmentButton.dataset.confirm = "true";
      newAssessmentButton.querySelector("span:last-child").textContent =
        "Press again to clear";
      window.clearTimeout(resetConfirmationTimerId);
      resetConfirmationTimerId = window.setTimeout(() => {
        delete newAssessmentButton.dataset.confirm;
        newAssessmentButton.querySelector("span:last-child").textContent =
          "New assessment";
      }, 5000);
      return;
    }
    window.clearTimeout(resetConfirmationTimerId);
    delete newAssessmentButton.dataset.confirm;
    newAssessmentButton.querySelector("span:last-child").textContent =
      "New assessment";
    resetOperationalAssessment();
    drawerController.close();
  });
  elements.recordingSystemToggle.addEventListener("click", () => {
    examExpanded = !examExpanded;
    if (!examExpanded && actionExpanded) {
      actionExpanded = false;
      unlockPageScroll("action-panel");
      renderAction();
    }
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
    restart: $("#restartMcqButton"),
    result: $("#mcqResult"),
    close: $("#closeMcqButton"),
  });

  $$("[data-mcq-level]").forEach((button) => {
    button.addEventListener("click", () => {
      const level = button.dataset.mcqLevel;
      drawerController.close();
      window.setTimeout(() => mcqController.open(level), 190);
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
    renderCaseSetControls();
    renderViewerCaseNavigation();
    prefetchViewerImages();
  } catch (error) {
    console.error("Viewer initialisation failed", error);
  }
  setupEventHandlers();
  if (location.protocol === "http:" || location.protocol === "https:") {
    window.addEventListener("load", () =>
      navigator.serviceWorker?.register("./service-worker.js"),
    );
  }
  const mcqValidation = validateMcqBanks();
  mcqValidation.forEach((result) => {
    if (
      result.actual !== result.expected ||
      result.invalidAnswers > 0 ||
      result.invalidMetadata > 0
    ) {
      console.warn("MCQ validation issue", result);
    }
  });
  render();
}

init();
