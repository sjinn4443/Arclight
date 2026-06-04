//========================================================================
// DATA MODEL
//========================================================================

const VISUAL_SYSTEM = "Metric (6/6)";

const acuityMap = {
  [VISUAL_SYSTEM]: [
    { name: "NPL", value: 60, tableValues: [73, 17, 7, 2, 1] },
    { name: "PL or HM", value: 70, tableValues: [28, 26, 18, 13, 15] },
    { name: "1/60 to < 6/60", value: 80, tableValues: [2, 11, 15, 28, 44] },
    { name: "6/60 to 6/15", value: 90, tableValues: [1, 2, 2, 21, 74] },
    { name: "≥ 6/12", value: 100, tableValues: [0, 1, 2, 5, 92] },
  ],
};

const optionalFields = [
  {
    letter: "B",
    value: -23,
    name: "Globe Rupture",
    photoUrl: "assets/images/globe.webp",
    description:
      "Globe rupture occurs by blunt or penetrating inside-out trauma. It is severe, the eye often deflates and urgent surgery is required.",
  },
  {
    letter: "C",
    value: -17,
    name: "Endophthalmitis",
    photoUrl: "assets/images/hypo.webp",
    description:
      "Endophthalmitis is a severe intraocular infection after surgery or injury. Urgent treatment is needed to preserve sight.",
  },
  {
    letter: "D",
    value: -14,
    name: "Perforating Injury",
    photoUrl: "assets/images/hook.webp",
    description:
      "A perforating injury has both entrance and exit wounds and can be missed if small.",
  },
  {
    letter: "E",
    value: -11,
    name: "Retinal Detachment",
    photoUrl: "assets/images/retd.webp",
    description:
      "Retinal detachment occurs when neuroretina separates from the retinal pigment epithelium. Urgent surgery is usually required.",
  },
  {
    letter: "F",
    value: -10,
    name: "RAPD",
    photoUrl: "assets/images/rapd.webp",
    description:
      "Relative afferent pupillary defect indicates reduced afferent response in the affected eye.",
  },
];

const CATEGORY_BANDS = [
  { max: 44, category: 1, rule: "Score ≤ 44" },
  { max: 65, category: 2, rule: "45-65" },
  { max: 80, category: 3, rule: "66-80" },
  { max: 91, category: 4, rule: "81-91" },
  { max: Number.POSITIVE_INFINITY, category: 5, rule: "≥ 92" },
];

const OUTCOME_LABELS = [
  "NPL",
  "PL or HM",
  "1/60 to <6/60",
  "6/60 to 6/15",
  "≥ 6/12",
];
const CATEGORY_DESCRIPTIONS = [
  {
    category: 1,
    text: "Very poor prognosis. Severe visual loss is most likely.",
  },
  {
    category: 2,
    text: "Poor prognosis. Significant long-term vision limitation is likely.",
  },
  { category: 3, text: "Guarded prognosis. Outcomes are mixed and uncertain." },
  {
    category: 4,
    text: "Fair prognosis. Useful vision is achievable in many cases.",
  },
  {
    category: 5,
    text: "Good prognosis. Better functional vision is most likely.",
  },
];

const MCQ_LEVELS = [
  {
    key: "primary",
    name: "Primary",
    intro: "Core OTS use and simple category meaning.",
    questionCount: 5,
    passCount: 3,
    questions: [
      {
        prompt: "Which step should you do first when using this calculator?",
        choices: [
          "Select presenting VA",
          "Read the outcome table",
          "Add all risk factors",
          "Open the info screen",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "If RAPD is present, what does this calculator do to the score?",
        choices: [
          "Adds 10 points",
          "Subtracts 10 points",
          "No score change",
          "Sets Category 5 automatically",
        ],
        answerIndex: 1,
      },
      {
        prompt: "Which one below is one of the listed trauma risk factors?",
        choices: ["Pinguecula", "Dry eye", "Retinal detachment", "Blepharitis"],
        answerIndex: 2,
      },
      {
        prompt: "With no risk factors and VA ≥ 6/12, what is the base score?",
        choices: ["90", "80", "100", "70"],
        answerIndex: 2,
      },
      {
        prompt: "A lower final score usually means:",
        choices: [
          "Worse expected vision outcome",
          "Better expected vision outcome",
          "No change in prognosis",
          "Only age matters",
        ],
        answerIndex: 0,
      },
      {
        prompt: "A final score of 90 is in which category?",
        choices: ["Category 5", "Category 4", "Category 3", "Category 2"],
        answerIndex: 1,
      },
      {
        prompt: "Which VA option gives the highest base score?",
        choices: ["NPL", "PL or HM", "6/60 to 6/15", "≥ 6/12"],
        answerIndex: 3,
      },
      {
        prompt: "What does the category number summarise?",
        choices: [
          "Estimated visual outcome group",
          "Eye pressure only",
          "Age group",
          "Injury location only",
        ],
        answerIndex: 0,
      },
      {
        prompt:
          "If no risk factors are selected, what happens to the base score?",
        choices: [
          "It stays unchanged",
          "It is halved",
          "It becomes Category 1",
          "It adds 23 points",
        ],
        answerIndex: 0,
      },
      {
        prompt: "What does the outcome table show?",
        choices: [
          "Estimated 6-month VA probabilities",
          "A list of treatments",
          "A diagnosis checklist",
          "A surgical consent form",
        ],
        answerIndex: 0,
      },
    ],
  },
  {
    key: "intermediate",
    name: "Intermediate",
    intro: "Applied scoring and threshold interpretation.",
    questionCount: 6,
    passCount: 4,
    questions: [
      {
        prompt:
          "Base score 80 with Globe Rupture (-23) and RAPD (-10) gives what final score?",
        choices: ["47", "57", "67", "37"],
        answerIndex: 0,
      },
      {
        prompt: "A final score of 66 maps to which category?",
        choices: ["Category 2", "Category 3", "Category 4", "Category 5"],
        answerIndex: 1,
      },
      {
        prompt:
          "Which single risk factor carries the largest penalty in this app?",
        choices: [
          "RAPD (-10)",
          "Perforating Injury (-14)",
          "Endophthalmitis (-17)",
          "Globe Rupture (-23)",
        ],
        answerIndex: 3,
      },
      {
        prompt:
          "Base 90 with Retinal Detachment (-11) and Perforating Injury (-14) gives category:",
        choices: ["Category 1", "Category 2", "Category 3", "Category 4"],
        answerIndex: 1,
      },
      {
        prompt:
          "In the Category 1 row, which outcome column has the highest percentage?",
        choices: ["NPL", "PL or HM", "1/60 to <6/60", "≥ 6/12"],
        answerIndex: 0,
      },
      {
        prompt: "Which category is assigned to a final score of 92?",
        choices: ["Category 3", "Category 4", "Category 5", "Category 2"],
        answerIndex: 2,
      },
      {
        prompt: "Base 100 with Endophthalmitis (-17) gives which category?",
        choices: ["Category 3", "Category 4", "Category 5", "Category 2"],
        answerIndex: 1,
      },
      {
        prompt: "Base 70 with Perforating Injury (-14) gives what final score?",
        choices: ["56", "66", "84", "44"],
        answerIndex: 0,
      },
      {
        prompt: "Which score range maps to Category 4?",
        choices: ["45-65", "66-80", "81-91", "≥ 92"],
        answerIndex: 2,
      },
      {
        prompt: "Base 90 with RAPD (-10) gives which category?",
        choices: ["Category 2", "Category 3", "Category 4", "Category 5"],
        answerIndex: 2,
      },
      {
        prompt: "Which pair gives a total penalty of -27?",
        choices: [
          "Endophthalmitis and RAPD",
          "Globe Rupture and RAPD",
          "Retinal Detachment and RAPD",
          "Perforating Injury and Retinal Detachment",
        ],
        answerIndex: 0,
      },
      {
        prompt: "A final score of 44 maps to which category?",
        choices: ["Category 1", "Category 2", "Category 3", "Category 4"],
        answerIndex: 0,
      },
      {
        prompt: "A final score of 45 maps to which category?",
        choices: ["Category 1", "Category 2", "Category 3", "Category 4"],
        answerIndex: 1,
      },
    ],
  },
  {
    key: "advanced",
    name: "Advanced",
    intro: "Scenario-based prognostic reasoning with boundary logic.",
    questionCount: 8,
    passCount: 6,
    questions: [
      {
        prompt:
          "Patient A final score is 59; Patient B final score is 83. Which statement is most accurate?",
        choices: [
          "Patient A has the better prognosis",
          "Patient B has the better prognosis",
          "Both have identical category risk",
          "Scores cannot be compared clinically",
        ],
        answerIndex: 1,
      },
      {
        prompt:
          "From a base of 100, the minimum penalty needed to enter Category 3 or worse (≤80) is:",
        choices: ["-9", "-15", "-20", "-25"],
        answerIndex: 2,
      },
      {
        prompt:
          "Base 70 with Globe Rupture (-23), Endophthalmitis (-17) and RAPD (-10) gives which category?",
        choices: ["Category 1", "Category 2", "Category 3", "Category 4"],
        answerIndex: 0,
      },
      {
        prompt: "Which use best fits this tool?",
        choices: [
          "Definitive diagnosis and treatment mandate",
          "Adjunct prognostic stratification for counselling and planning",
          "Replacement for full trauma examination",
          "Standalone legal-medical decision engine",
        ],
        answerIndex: 1,
      },
      {
        prompt: "A final score exactly equal to 65 falls into:",
        choices: ["Category 1", "Category 2", "Category 3", "Category 4"],
        answerIndex: 1,
      },
      {
        prompt:
          "In this app table, Category 2 shows approximately what chance of ≥ 6/12?",
        choices: ["5%", "15%", "28%", "44%"],
        answerIndex: 1,
      },
      {
        prompt:
          "When two additional risk factors shift a case from Category 4 to Category 2, the direct driver is:",
        choices: [
          "An increase in base VA",
          "A reduction in penalty burden",
          "A larger cumulative negative penalty",
          "Automatic category escalation rule",
        ],
        answerIndex: 2,
      },
      {
        prompt:
          "Base 100 with Globe Rupture (-23), Retinal Detachment (-11) and RAPD (-10) gives which category?",
        choices: ["Category 1", "Category 2", "Category 3", "Category 4"],
        answerIndex: 1,
      },
      {
        prompt:
          "A case with VA 6/60 to 6/15 and Endophthalmitis plus RAPD has which final score?",
        choices: ["63", "73", "53", "80"],
        answerIndex: 0,
      },
      {
        prompt: "What is the smallest single listed risk penalty?",
        choices: [
          "RAPD (-10)",
          "Retinal Detachment (-11)",
          "Perforating Injury (-14)",
          "Endophthalmitis (-17)",
        ],
        answerIndex: 0,
      },
      {
        prompt: "Which statement best describes OTS category boundaries?",
        choices: [
          "They are score ranges with inclusive endpoints",
          "They are selected by the user",
          "They depend only on retinal detachment",
          "They ignore presenting VA",
        ],
        answerIndex: 0,
      },
      {
        prompt: "Base 60 with no risk factors remains in which category?",
        choices: ["Category 1", "Category 2", "Category 3", "Category 4"],
        answerIndex: 1,
      },
      {
        prompt:
          "Base 80 with all listed risk factors selected gives which final score?",
        choices: ["5", "15", "25", "-5"],
        answerIndex: 0,
      },
      {
        prompt:
          "Why should the exported result summary still be interpreted carefully?",
        choices: [
          "OTS is prognostic support, not a diagnosis",
          "The score ignores all risk factors",
          "The category is randomised",
          "The table always predicts perfect vision",
        ],
        answerIndex: 0,
      },
    ],
  },
];

//========================================================================
// DOM REFERENCES
//========================================================================

const acuitySelect = document.getElementById("acuitySelect");
const optionalFieldsDiv = document.getElementById("optionalFields");
const resultScore = document.getElementById("scoreDisplay");
const outcomeDetails = document.getElementById("outcomeDetails");
const calculationToggle = document.getElementById("calculationToggle");
const calculationContent = document.getElementById("calculationContent");
const calculationActions = document.getElementById("calculationActions");
const copyResultButton = document.getElementById("copyResultButton");
const exportResultButton = document.getElementById("exportResultButton");
const resultActionStatus = document.getElementById("resultActionStatus");
const appSidebar = document.getElementById("sidebar");
const appMenuBackdrop = document.getElementById("menu-backdrop");
const mcqLevelButtons = document.querySelectorAll(".mcq-level-button");
const mcqModal = document.getElementById("mcqModal");
const mcqModalTitle = document.getElementById("mcqModalTitle");
const mcqModalIntro = document.getElementById("mcqModalIntro");
const closeMcqModalButton = document.getElementById("closeMcqModal");
const mcqForm = document.getElementById("mcqForm");
const submitMcqButton = document.getElementById("submitMcqButton");
const newMcqButton = document.getElementById("newMcqButton");
const mcqResult = document.getElementById("mcqResult");

let calculationCollapsed = true;
let latestResult = null;
let actionStatusTimeoutId = null;
let activeMcqLevelIndex = null;
let activeMcqQuestions = [];

const rootStyle = getComputedStyle(document.documentElement);
const categoryColours = {
  1: rootStyle.getPropertyValue("--category-colour-1").trim(),
  2: rootStyle.getPropertyValue("--category-colour-2").trim(),
  3: rootStyle.getPropertyValue("--category-colour-3").trim(),
  4: rootStyle.getPropertyValue("--category-colour-4").trim(),
  5: rootStyle.getPropertyValue("--category-colour-5").trim(),
};

//========================================================================
// MCQ HELPERS
//========================================================================

function shuffleArray(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]];
  }
  return shuffled;
}

function createNode(tagName, className, textContent) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (textContent !== undefined) {
    element.textContent = textContent;
  }
  return element;
}

function prepareMcqQuestion(question) {
  const choices = question.choices.map((choice, index) => ({
    text: choice,
    isCorrect: index === question.answerIndex,
  }));
  const shuffledChoices = shuffleArray(choices);

  return {
    prompt: question.prompt,
    choices: shuffledChoices.map((choice) => choice.text),
    answerIndex: shuffledChoices.findIndex((choice) => choice.isCorrect),
  };
}

function closeMcqModal() {
  mcqModal.style.display = "none";
}

function openMcqModal(levelIndex) {
  const levelConfig = MCQ_LEVELS[levelIndex];
  if (!levelConfig) {
    return;
  }

  activeMcqLevelIndex = levelIndex;
  activeMcqQuestions = shuffleArray(levelConfig.questions)
    .slice(0, levelConfig.questionCount)
    .map(prepareMcqQuestion);

  mcqModalTitle.textContent = `${levelConfig.name} MCQ`;
  mcqModalIntro.textContent = `${levelConfig.intro} ${levelConfig.questionCount} questions. Pass mark: ${levelConfig.passCount}/${levelConfig.questionCount}.`;
  mcqModal.dataset.level = levelConfig.key;

  const questionNodes = activeMcqQuestions.map((question, questionIndex) => {
    const fieldset = createNode("fieldset", "mcq-question");
    const legend = document.createElement("legend");
    legend.textContent = `${questionIndex + 1}. ${question.prompt}`;
    const options = createNode("div", "mcq-options");

    question.choices.forEach((choice, choiceIndex) => {
      const inputId = `mcq_q${questionIndex}_c${choiceIndex}`;
      const label = createNode("label", "mcq-option");
      label.setAttribute("for", inputId);

      const input = document.createElement("input");
      input.id = inputId;
      input.type = "radio";
      input.name = `mcq_q_${questionIndex}`;
      input.value = String(choiceIndex);

      const text = document.createElement("span");
      text.textContent = choice;

      label.append(input, text);
      options.appendChild(label);
    });

    fieldset.append(legend, options);
    return fieldset;
  });

  mcqForm.replaceChildren(...questionNodes);

  mcqResult.className = "mcq-result";
  mcqResult.textContent = "";
  submitMcqButton.disabled = false;
  newMcqButton.hidden = true;

  appSidebar.classList.remove("is-open");
  appSidebar.inert = true;
  appMenuBackdrop.hidden = true;

  mcqModal.style.display = "block";
}

function submitMcqAnswers() {
  if (activeMcqLevelIndex === null || activeMcqQuestions.length === 0) {
    return;
  }

  const levelConfig = MCQ_LEVELS[activeMcqLevelIndex];
  const answerDetails = activeMcqQuestions.map((question, questionIndex) => {
    const checkedInput = mcqForm.querySelector(
      `input[name="mcq_q_${questionIndex}"]:checked`,
    );
    if (!checkedInput) {
      return {
        questionIndex,
        answered: false,
        correct: false,
        selectedIndex: null,
      };
    }

    const selectedIndex = Number(checkedInput.value);
    return {
      questionIndex,
      answered: true,
      correct: selectedIndex === question.answerIndex,
      selectedIndex,
    };
  });

  const unansweredCount = answerDetails.filter(
    (detail) => !detail.answered,
  ).length;
  if (unansweredCount > 0) {
    mcqResult.className = "mcq-result is-error";
    mcqResult.textContent = `Please answer all questions. ${unansweredCount} remaining.`;
    return;
  }

  const correctCount = answerDetails.filter((detail) => detail.correct).length;
  const totalCount = activeMcqQuestions.length;
  const percentScore = Math.round((correctCount / totalCount) * 100);
  const passed = correctCount >= levelConfig.passCount;

  mcqResult.className = `mcq-result ${passed ? "is-pass" : "is-fail"}`;
  const resultSummary = createNode(
    "p",
    "mcq-result-summary",
    `${levelConfig.name}: ${correctCount}/${totalCount} (${percentScore}%). ${passed ? "Pass" : "Not yet pass"}.`,
  );
  const incorrectDetails = answerDetails.filter((detail) => !detail.correct);

  if (incorrectDetails.length) {
    const feedbackList = createNode("ul", "mcq-feedback-list");
    incorrectDetails.forEach((detail) => {
      const question = activeMcqQuestions[detail.questionIndex];
      const correctAnswer = question.choices[question.answerIndex];
      feedbackList.appendChild(
        createNode(
          "li",
          "",
          `Q${detail.questionIndex + 1}: correct answer is "${correctAnswer}"`,
        ),
      );
    });
    mcqResult.replaceChildren(resultSummary, feedbackList);
  } else {
    mcqResult.replaceChildren(
      resultSummary,
      createNode("p", "mcq-feedback-good", "Excellent. All answers correct."),
    );
  }

  submitMcqButton.disabled = true;
  newMcqButton.hidden = false;
}

//========================================================================
// RENDER HELPERS
//========================================================================

function populateAcuityOptions() {
  const options = acuityMap[VISUAL_SYSTEM].map((item, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = item.name;
    return option;
  });
  acuitySelect.replaceChildren(...options);
  acuitySelect.selectedIndex = 4;
}

function closeOpenRiskTooltips() {
  optionalFieldsDiv
    .querySelectorAll(".tooltip.is-open")
    .forEach((tooltipElement) => {
      tooltipElement.classList.remove("is-open");
    });

  optionalFieldsDiv
    .querySelectorAll('.tooltip-trigger[aria-expanded="true"]')
    .forEach((triggerElement) => {
      triggerElement.setAttribute("aria-expanded", "false");
    });
}

function createRiskFactorToggle(field, index) {
  const container = document.createElement("div");
  container.className = "toggle-container";

  const labelWrapper = document.createElement("div");
  labelWrapper.className = "label-wrapper";

  const labelText = document.createElement("button");
  labelText.type = "button";
  labelText.className = "toggle-label tooltip-trigger";
  labelText.setAttribute("aria-expanded", "false");
  labelText.setAttribute("aria-controls", `tooltip_${index}`);

  const cueIcon = document.createElement("span");
  cueIcon.className = "risk-info-cue";
  cueIcon.setAttribute("aria-hidden", "true");

  const cueLabel = document.createElement("span");
  cueLabel.textContent = field.name;

  labelText.append(cueIcon, cueLabel);

  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.id = `tooltip_${index}`;

  const tooltipClose = document.createElement("button");
  tooltipClose.type = "button";
  tooltipClose.className = "tooltip-close";
  tooltipClose.setAttribute("aria-label", `Close ${field.name} image`);
  tooltipClose.textContent = "X";
  tooltip.appendChild(tooltipClose);

  const tooltipImg = document.createElement("img");
  tooltipImg.src = field.photoUrl;
  tooltipImg.alt = field.name;
  tooltip.appendChild(tooltipImg);

  const tooltipText = document.createElement("p");
  tooltipText.textContent = field.description;
  tooltip.appendChild(tooltipText);

  labelWrapper.appendChild(labelText);
  labelWrapper.appendChild(tooltip);

  const openTooltip = () => {
    closeOpenRiskTooltips();
    tooltip.classList.add("is-open");
    labelText.setAttribute("aria-expanded", "true");
  };

  const closeTooltip = () => {
    tooltip.classList.remove("is-open");
    labelText.setAttribute("aria-expanded", "false");
  };

  labelText.addEventListener("click", (event) => {
    event.stopPropagation();
    if (tooltip.classList.contains("is-open")) {
      closeTooltip();
      return;
    }
    openTooltip();
  });

  tooltipClose.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeTooltip();
  });

  const switchLabel = document.createElement("label");
  switchLabel.className = "switch";

  const toggleInput = document.createElement("input");
  toggleInput.type = "checkbox";
  toggleInput.id = `optional_${index}`;
  toggleInput.value = String(field.value);
  toggleInput.setAttribute("aria-label", field.name);
  toggleInput.addEventListener("change", calculateOTS);

  const sliderSpan = document.createElement("span");
  sliderSpan.className = "slider";

  switchLabel.appendChild(toggleInput);
  switchLabel.appendChild(sliderSpan);

  container.appendChild(labelWrapper);
  container.appendChild(switchLabel);

  return container;
}

function populateOptionalFields() {
  optionalFieldsDiv.replaceChildren(
    ...optionalFields.map((field, index) =>
      createRiskFactorToggle(field, index),
    ),
  );
}

function getSelectedAcuity() {
  const acuityIndex = Number(acuitySelect.value);
  return acuityMap[VISUAL_SYSTEM][acuityIndex];
}

function getPenaltyState() {
  const appliedPenalties = [];
  let penaltySum = 0;

  const checkboxes = optionalFieldsDiv.querySelectorAll(
    'input[type="checkbox"]',
  );
  checkboxes.forEach((checkbox, index) => {
    if (!checkbox.checked) {
      return;
    }

    const penaltyValue = Number(checkbox.value);
    penaltySum += penaltyValue;
    appliedPenalties.push({
      name: optionalFields[index].name,
      value: penaltyValue,
    });
  });

  return { penaltySum, appliedPenalties };
}

function getCategoryInfo(finalScore) {
  return CATEGORY_BANDS.find((band) => finalScore <= band.max);
}

function renderScoreHeader(finalScore, category) {
  const label = createNode("span", "static-text", "Estimated VA at 6 months");
  const resultCluster = createNode("span", "result-score-cluster");
  const scoreBox = createNode("span", "score-box", String(finalScore));
  scoreBox.id = "scoreValue";
  scoreBox.setAttribute("aria-label", `Score ${finalScore}`);

  const categoryBox = createNode("span", "category-box", String(category));
  categoryBox.id = "scoreCategory";
  categoryBox.setAttribute("aria-label", `Category ${category}`);
  categoryBox.style.backgroundColor = categoryColours[category];
  resultCluster.append(scoreBox, categoryBox);

  resultScore.replaceChildren(label, resultCluster);
}

function renderOutcomeTable(outcomes, activeCategory) {
  const activeCategoryDescription = CATEGORY_DESCRIPTIONS.find(
    (item) => item.category === activeCategory,
  );
  const categoryText = activeCategoryDescription
    ? activeCategoryDescription.text
    : "Category description unavailable.";
  const table = createNode("table", "outcome-table");
  const headRow = document.createElement("tr");
  OUTCOME_LABELS.forEach((label) => {
    headRow.appendChild(createNode("th", "", label));
  });

  const valueRow = document.createElement("tr");
  outcomes.forEach((outcome) => {
    valueRow.appendChild(createNode("td", "", `${outcome}%`));
  });
  table.append(headRow, valueRow);

  const categoryGuide = createNode("section", "category-guide");
  categoryGuide.setAttribute("aria-label", "Category guide");
  const categoryLine = createNode("p", "category-guide-current", categoryText);
  categoryLine.style.color = categoryColours[activeCategory];
  categoryGuide.appendChild(categoryLine);

  outcomeDetails.replaceChildren(table, categoryGuide);
}

function renderCalculationPanel(
  acuityName,
  baseScore,
  penaltySum,
  appliedPenalties,
  finalScore,
  categoryRule,
  category,
) {
  const penaltiesText = appliedPenalties.length
    ? appliedPenalties.map((item) => `${item.name} (${item.value})`).join(", ")
    : "None selected (0)";

  const list = createNode("dl", "calculation-list");
  [
    ["Base VA", `${acuityName} = ${baseScore}`],
    ["Risk penalties", penaltiesText],
    ["Total penalties", String(penaltySum)],
    ["Final score", `${baseScore} + (${penaltySum}) = ${finalScore}`],
    ["Category rule", `${categoryRule} -> Category ${category}`],
  ].forEach(([label, value]) => {
    list.append(createNode("dt", "", label), createNode("dd", "", value));
  });

  calculationContent.replaceChildren(list);
}

function setCalculationCollapsed(collapsed) {
  calculationCollapsed = collapsed;
  calculationContent.hidden = collapsed;
  calculationActions.hidden = collapsed;
  calculationToggle.setAttribute("aria-expanded", String(!collapsed));
  calculationToggle.textContent = collapsed
    ? "Show calculation"
    : "Hide calculation";
}

function setResultActionStatus(message, isError = false) {
  resultActionStatus.textContent = message;
  resultActionStatus.classList.toggle("is-error", isError);

  if (actionStatusTimeoutId) {
    window.clearTimeout(actionStatusTimeoutId);
  }

  actionStatusTimeoutId = window.setTimeout(() => {
    resultActionStatus.textContent = "";
    resultActionStatus.classList.remove("is-error");
  }, 2500);
}

function buildResultSummary() {
  if (!latestResult) {
    return "";
  }

  const penaltiesText = latestResult.appliedPenalties.length
    ? latestResult.appliedPenalties
        .map((item) => `${item.name} (${item.value})`)
        .join(", ")
    : "None selected (0)";

  const outcomeLines = OUTCOME_LABELS.map(
    (label, index) => `${label}: ${latestResult.outcomes[index]}%`,
  );

  return [
    "Trauma OTS Calculator Summary",
    `Generated: ${new Date().toLocaleString()}`,
    "",
    `Presenting VA: ${latestResult.acuityName}`,
    `Base score: ${latestResult.baseScore}`,
    `Risk penalties: ${penaltiesText}`,
    `Total penalties: ${latestResult.penaltySum}`,
    `Final score: ${latestResult.finalScore}`,
    `Category: ${latestResult.category} (${latestResult.categoryRule})`,
    "",
    "Estimated VA outcomes at 6 months:",
    ...outcomeLines,
    "",
    "Note: This is a calculator, not a diagnosis.",
  ].join("\n");
}

async function copyResultSummary() {
  if (!latestResult) {
    setResultActionStatus("No result to copy yet.", true);
    return;
  }

  const summary = buildResultSummary();

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(summary);
      setResultActionStatus("Result copied.");
      return;
    }

    const temporaryArea = document.createElement("textarea");
    temporaryArea.value = summary;
    temporaryArea.setAttribute("readonly", "");
    temporaryArea.style.position = "fixed";
    temporaryArea.style.opacity = "0";
    document.body.appendChild(temporaryArea);
    temporaryArea.focus();
    temporaryArea.select();

    const copied = document.execCommand("copy");
    document.body.removeChild(temporaryArea);

    if (!copied) {
      throw new Error("Copy command was not successful.");
    }

    setResultActionStatus("Result copied.");
  } catch {
    setResultActionStatus("Copy failed on this browser.", true);
  }
}

function exportResultSummary() {
  if (!latestResult) {
    setResultActionStatus("No result to export yet.", true);
    return;
  }

  const summary = buildResultSummary();
  const timestamp = new Date().toISOString().replace(/[:]/g, "-").slice(0, 19);
  const fileName = `trauma-summary-${timestamp}.txt`;
  const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = objectUrl;
  downloadLink.download = fileName;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(objectUrl);

  setResultActionStatus("Summary exported.");
}

//========================================================================
// MAIN CALCULATION
//========================================================================

function calculateOTS() {
  const selectedAcuity = getSelectedAcuity();
  const baseScore = selectedAcuity.value;

  const { penaltySum, appliedPenalties } = getPenaltyState();
  const finalScore = baseScore + penaltySum;

  const { category, rule } = getCategoryInfo(finalScore);
  const outcomes = acuityMap[VISUAL_SYSTEM][category - 1].tableValues;

  renderScoreHeader(finalScore, category);
  renderOutcomeTable(outcomes, category);
  renderCalculationPanel(
    selectedAcuity.name,
    baseScore,
    penaltySum,
    appliedPenalties,
    finalScore,
    rule,
    category,
  );

  latestResult = {
    acuityName: selectedAcuity.name,
    baseScore,
    penaltySum,
    appliedPenalties,
    finalScore,
    category,
    categoryRule: rule,
    outcomes,
  };
}

//========================================================================
// INITIALIZE
//========================================================================

populateAcuityOptions();
populateOptionalFields();
acuitySelect.addEventListener("change", calculateOTS);

calculationToggle.addEventListener("click", () => {
  setCalculationCollapsed(!calculationCollapsed);
});
copyResultButton.addEventListener("click", copyResultSummary);
exportResultButton.addEventListener("click", exportResultSummary);
mcqLevelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openMcqModal(Number(button.dataset.levelIndex));
  });
});
closeMcqModalButton.addEventListener("click", closeMcqModal);
submitMcqButton.addEventListener("click", submitMcqAnswers);
newMcqButton.addEventListener("click", () => {
  if (activeMcqLevelIndex !== null) {
    openMcqModal(activeMcqLevelIndex);
  }
});
window.addEventListener("click", (event) => {
  if (
    !(event.target instanceof Element) ||
    !event.target.closest(".label-wrapper")
  ) {
    closeOpenRiskTooltips();
  }

  if (event.target === mcqModal) {
    closeMcqModal();
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeOpenRiskTooltips();
  }

  if (event.key === "Escape" && mcqModal.style.display === "block") {
    closeMcqModal();
  }
});
setCalculationCollapsed(true);
calculateOTS();
