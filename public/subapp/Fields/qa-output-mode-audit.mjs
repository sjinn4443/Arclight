import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_FILES = [
  "src/field-core.js",
  "src/state.js",
  "src/rules/helpers.js",
  "src/rules/anterior.js",
  "src/rules/chiasmal.js",
  "src/rules/posterior.js",
  "src/rules.js",
  "src/summary.js",
  "src/output-text-rules.js",
  "src/output-lesion-map.js",
  "src/output.js",
];

const CODES = ["R", "?", "W"];
const RAPD_STATES = ["none", "right", "left"];
const ONSETS = ["none", "gradual", "sudden"];
const BOOLEAN_FLAGS = [
  "neuroFlags",
  "knownOldDefect",
  "nightVisionPoor",
  "flashesCurtain",
  "colourFade",
];
const MAX_SAMPLES_PER_GROUP = 8;

function loadEngine() {
  const context = { console };
  context.window = context;
  context.globalThis = context;
  vm.createContext(context);

  for (const relFile of SOURCE_FILES) {
    const absFile = path.join(__dirname, relFile);
    const code = fs.readFileSync(absFile, "utf8");
    vm.runInContext(code, context, { filename: relFile });
  }

  [
    "summarizeCondition",
    "mapConditionToLesionCore",
    "classifySourceAssessment",
    "applyClinicalModifierNotes",
    "buildCentralQualifierNote",
    "buildAdvancedLocationHint",
    "buildAdvancedEtiologyHint",
    "buildAdvancedSourceHint",
    "compactOutputWording",
    "toSimpleCondition",
    "toSimpleLesion",
    "detectResultSeverity",
    "isSingleEyePattern",
  ].forEach((fnName) => {
    if (typeof context[fnName] !== "function") {
      throw new Error(`Missing function: ${fnName}`);
    }
  });

  return context;
}

function makeEyeState(index) {
  return {
    st: CODES[Math.floor(index / 81) % 3],
    sn: CODES[Math.floor(index / 27) % 3],
    it: CODES[Math.floor(index / 9) % 3],
    in: CODES[Math.floor(index / 3) % 3],
    c: CODES[index % 3],
  };
}

function makeModifierScenarios() {
  const scenarios = [];
  for (const onset of ONSETS) {
    for (let mask = 0; mask < 2 ** BOOLEAN_FLAGS.length; mask += 1) {
      const modifiers = { onset };
      BOOLEAN_FLAGS.forEach((flag, index) => {
        modifiers[flag] = mask & (1 << index) ? "yes" : "no";
      });
      const active = [
        onset !== "none" ? onset : "",
        ...BOOLEAN_FLAGS.filter((flag) => modifiers[flag] === "yes"),
      ].filter(Boolean);
      scenarios.push({
        name: active.length ? active.join("+") : "base",
        modifiers,
      });
    }
  }
  return scenarios;
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalise(value) {
  return stripHtml(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function wordCount(value) {
  const words = stripHtml(value).match(/[a-z0-9]+(?:[-/][a-z0-9]+)*/gi);
  return words ? words.length : 0;
}

function cleanConditionHtml(ctx, conditionHtml, mode, sourceAssessment, modifiers) {
  const primaryCondition = String(conditionHtml || "").split("<br")[0];
  const retinaPriorityHeadline =
    modifiers.flashesCurtain === "yes" &&
    sourceAssessment.category === "retina_likely" &&
    ctx.isSingleEyePattern(primaryCondition);
  if (!retinaPriorityHeadline) {
    return mode === "simple" ? ctx.toSimpleCondition(conditionHtml) : conditionHtml;
  }

  const primary = String(conditionHtml || "").split("<br")[0];
  const levelMatch = primary.match(/<em>([^<]+)<\/em>/i);
  const levelWord = levelMatch && levelMatch[1] ? levelMatch[1] : "Probable";
  const stripped = stripHtml(primary);
  const sideLabel = stripped.includes("Right")
    ? "Right eye"
    : stripped.includes("Left")
      ? "Left eye"
      : "One eye";
  const patternRaw = mode === "simple" ? ctx.toSimpleCondition(primary) : primary;
  const patternText = stripHtml(patternRaw);
  return `<em>${levelWord}</em> <strong>${sideLabel} retinal detachment</strong><br><small>Pattern: ${patternText}</small>`;
}

function buildStateContext(ctx, right, left) {
  const inputState = {
    right,
    left,
  };
  let conditionHtml = ctx.summarizeCondition({ right, left });
  if (conditionHtml === "Condition not identified") {
    conditionHtml = "<em>Normal</em> <strong>Full Fields of Vision</strong>";
  }
  const primaryCondition = String(conditionHtml).split("<br")[0];
  const centralQualifier = ctx.buildCentralQualifierNote(primaryCondition, inputState);

  return {
    right,
    left,
    conditionHtml,
    primaryCondition,
    centralQualifier,
    family: getFamily(primaryCondition),
  };
}

function renderOutputFromState(ctx, stateContext, rapdState, scenario, mode) {
  const inputState = {
    right: stateContext.right,
    left: stateContext.left,
    rapd: rapdState,
    ...scenario.modifiers,
  };
  const conditionHtml = stateContext.conditionHtml;
  const primaryCondition = stateContext.primaryCondition;
  const baseLesionText = ctx.mapConditionToLesionCore(primaryCondition, rapdState);
  const sourceAssessment = ctx.classifySourceAssessment(
    primaryCondition,
    rapdState,
    scenario.modifiers
  );
  let lesionSeedText = baseLesionText;
  if (
    sourceAssessment.category === "retina_likely" &&
    ctx.isSingleEyePattern(primaryCondition)
  ) {
    lesionSeedText = "Likely retinal source.";
  }
  let lesionSiteText = ctx.applyClinicalModifierNotes(
    lesionSeedText,
    scenario.modifiers,
    primaryCondition
  );
  if (stateContext.centralQualifier) {
    lesionSiteText = `${lesionSiteText} ${stateContext.centralQualifier}`;
  }

  const conditionForDisplay = cleanConditionHtml(
    ctx,
    conditionHtml,
    mode,
    sourceAssessment,
    scenario.modifiers
  );
  const advancedLocationHint =
    mode === "advanced"
      ? ctx.buildAdvancedLocationHint(primaryCondition, lesionSiteText, rapdState, inputState)
      : "";
  const advancedEtiologyHint =
    mode === "advanced"
      ? ctx.buildAdvancedEtiologyHint(primaryCondition, scenario.modifiers)
      : "";
  const advancedSourceHint =
    mode === "advanced"
      ? ctx.buildAdvancedSourceHint(primaryCondition, rapdState, scenario.modifiers)
      : "";
  const baseLesionForDisplay =
    mode === "simple" ? ctx.toSimpleLesion(lesionSiteText) : lesionSiteText;
  const retinaPriorityHeadline =
    scenario.modifiers.flashesCurtain === "yes" &&
    sourceAssessment.category === "retina_likely" &&
    ctx.isSingleEyePattern(primaryCondition);
  const includeAdvancedSourceHint =
    mode === "advanced" &&
    !retinaPriorityHeadline &&
    (sourceAssessment.category === "anterior_mixed" ||
      sourceAssessment.category === "unknown");
  const advancedHints = [
    advancedLocationHint,
    advancedEtiologyHint,
    includeAdvancedSourceHint ? advancedSourceHint : "",
  ]
    .filter(Boolean)
    .join(" ");
  const lesionForDisplayRaw = advancedHints
    ? `${baseLesionForDisplay} ${advancedHints}`.trim()
    : baseLesionForDisplay;
  const lesionForDisplay = ctx.compactOutputWording(lesionForDisplayRaw);
  const severity = ctx.detectResultSeverity(
    primaryCondition,
    lesionSiteText,
    scenario.modifiers
  );

  return {
    conditionHtml,
    primaryCondition,
    conditionForDisplay,
    lesionForDisplay,
    severity,
    sourceAssessment,
    text: `${stripHtml(conditionForDisplay)} ${stripHtml(lesionForDisplay)}`.trim(),
  };
}

function getFamily(primaryCondition) {
  const text = stripHtml(primaryCondition);
  const families = [
    "Full Fields of Vision",
    "Binocular Blindness",
    "Monocular Blind Eye",
    "Homonymous Hemianopia",
    "Quadrantanopia",
    "Bitemporal Hemianopia",
    "Bitemporal Quadrantanopia",
    "Altitudinal",
    "Tunnel Vision",
    "Monocular Central Scotoma",
    "Bilateral Central Scotoma",
    "Junctional Scotoma",
    "Cecocentral-like Defect",
    "Monocular Temporal Hemianopia",
    "Monocular Nasal Hemianopia",
    "Glaucoma-like Changes",
    "Binasal Hemianopia",
    "Monocular 4-Quadrant Defect",
    "Monocular Large Defect",
    "Monocular Partial Defect",
    "Mixed/Unclassified Field Defect",
  ];
  return families.find((family) => text.includes(family)) || "Other";
}

function addSample(samples, key, sample) {
  if (!samples.has(key)) samples.set(key, []);
  const list = samples.get(key);
  if (list.length < MAX_SAMPLES_PER_GROUP) {
    list.push(sample);
  }
}

function compareOutputs(simple, advanced) {
  const simpleKey = normalise(simple.text);
  const advancedKey = normalise(advanced.text);
  const sameText = simpleKey === advancedKey;
  const simpleWords = wordCount(simple.text);
  const advancedWords = wordCount(advanced.text);
  return {
    sameText,
    simpleWords,
    advancedWords,
    wordDelta: advancedWords - simpleWords,
    conditionChanged:
      normalise(simple.conditionForDisplay) !== normalise(advanced.conditionForDisplay),
    lesionChanged:
      normalise(simple.lesionForDisplay) !== normalise(advanced.lesionForDisplay),
  };
}

function runAudit() {
  const ctx = loadEngine();
  const eyeStates = Array.from({ length: 243 }, (_, index) => makeEyeState(index));
  const modifierScenarios = makeModifierScenarios();
  const totals = {
    combinations: 0,
    identical: 0,
    different: 0,
    conditionChanged: 0,
    lesionChanged: 0,
    advancedShorter: 0,
    advancedSameLengthDifferentWords: 0,
    advancedLongerByAtLeastFive: 0,
    simpleLongerThanAdvancedByAtLeastFive: 0,
    simpleMoreTechnicalThanAdvanced: 0,
  };
  const byFamily = new Map();
  const samples = new Map();
  const technicalTerms = [
    "pre-chiasmal",
    "post-chiasmal",
    "hemianopia",
    "quadrantanopia",
    "cecocentral",
    "altitudinal",
    "papillomacular",
    "radiations",
    "calcarine",
    "occipital",
    "aion",
    "naion",
    "demyelination",
  ];

  const renderCache = new Map();
  const stateContexts = [];
  for (const right of eyeStates) {
    for (const left of eyeStates) {
      stateContexts.push(buildStateContext(ctx, right, left));
    }
  }

  function getRenderedPair(stateContext, rapdState, scenario) {
    const cacheKey = [
      stateContext.conditionHtml,
      stateContext.centralQualifier,
      rapdState,
      scenario.name,
    ].join("\u001f");
    if (!renderCache.has(cacheKey)) {
      const simple = renderOutputFromState(ctx, stateContext, rapdState, scenario, "simple");
      const advanced = renderOutputFromState(ctx, stateContext, rapdState, scenario, "advanced");
      renderCache.set(cacheKey, {
        simple,
        advanced,
        comparison: compareOutputs(simple, advanced),
      });
    }
    return renderCache.get(cacheKey);
  }

  for (const stateContext of stateContexts) {
      for (const rapdState of RAPD_STATES) {
        for (const scenario of modifierScenarios) {
          const { simple, advanced, comparison } = getRenderedPair(
            stateContext,
            rapdState,
            scenario
          );
          const family = stateContext.family;

          if (!byFamily.has(family)) {
            byFamily.set(family, {
              family,
              combinations: 0,
              identical: 0,
              different: 0,
              conditionChanged: 0,
              lesionChanged: 0,
              wordDeltaTotal: 0,
              minDelta: Infinity,
              maxDelta: -Infinity,
            });
          }
          const familyStats = byFamily.get(family);
          totals.combinations += 1;
          familyStats.combinations += 1;

          if (comparison.sameText) {
            totals.identical += 1;
            familyStats.identical += 1;
            addSample(samples, "identical", {
              family,
              rapd: rapdState,
              scenario: scenario.name,
              right: stateContext.right,
              left: stateContext.left,
              text: simple.text,
            });
          } else {
            totals.different += 1;
            familyStats.different += 1;
          }

          if (comparison.conditionChanged) {
            totals.conditionChanged += 1;
            familyStats.conditionChanged += 1;
          }
          if (comparison.lesionChanged) {
            totals.lesionChanged += 1;
            familyStats.lesionChanged += 1;
          }
          if (comparison.wordDelta < 0) {
            totals.advancedShorter += 1;
            addSample(samples, "advanced-shorter", {
              family,
              rapd: rapdState,
              scenario: scenario.name,
              simple: simple.text,
              advanced: advanced.text,
            });
          }
          if (!comparison.sameText && comparison.wordDelta === 0) {
            totals.advancedSameLengthDifferentWords += 1;
          }
          if (comparison.wordDelta >= 5) {
            totals.advancedLongerByAtLeastFive += 1;
          }
          if (comparison.wordDelta <= -5) {
            totals.simpleLongerThanAdvancedByAtLeastFive += 1;
          }

          const simpleNormal = normalise(simple.text);
          const advancedNormal = normalise(advanced.text);
          const simpleTechnical = technicalTerms.filter((term) => simpleNormal.includes(term));
          const advancedTechnical = technicalTerms.filter((term) => advancedNormal.includes(term));
          const simpleOnlyTechnical = simpleTechnical.filter(
            (term) => !advancedTechnical.includes(term)
          );
          if (simpleOnlyTechnical.length) {
            totals.simpleMoreTechnicalThanAdvanced += 1;
            addSample(samples, "simple-technical", {
              family,
              rapd: rapdState,
              scenario: scenario.name,
              simpleOnlyTechnical,
              simple: simple.text,
              advanced: advanced.text,
            });
          }

          familyStats.wordDeltaTotal += comparison.wordDelta;
          familyStats.minDelta = Math.min(familyStats.minDelta, comparison.wordDelta);
          familyStats.maxDelta = Math.max(familyStats.maxDelta, comparison.wordDelta);
        }
      }
  }

  const familyRows = [...byFamily.values()]
    .map((row) => ({
      ...row,
      identicalPct: row.identical / row.combinations,
      differentPct: row.different / row.combinations,
      avgWordDelta: row.wordDeltaTotal / row.combinations,
    }))
    .sort((a, b) => b.combinations - a.combinations || a.family.localeCompare(b.family));

  return {
    modifierScenarioCount: modifierScenarios.length,
    rapdStateCount: RAPD_STATES.length,
    eyeStateCount: eyeStates.length ** 2,
    uniqueRenderContexts: renderCache.size,
    totals,
    familyRows,
    samples: Object.fromEntries(samples.entries()),
  };
}

function pct(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function formatReport(result) {
  const { totals } = result;
  const lines = [];
  lines.push("Fields Output Mode Audit");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("Scope");
  lines.push("-----");
  lines.push(`Eye states: ${result.eyeStateCount} (3^10)`);
  lines.push(`RAPD states: ${result.rapdStateCount}`);
  lines.push(`Modifier scenarios: ${result.modifierScenarioCount} (all onset/flag combinations)`);
  lines.push(`Cached render contexts: ${result.uniqueRenderContexts}`);
  lines.push(`Total simple-vs-advanced comparisons: ${totals.combinations}`);
  lines.push("");
  lines.push("Mode Difference Summary");
  lines.push("-----------------------");
  lines.push(`Different output: ${totals.different} (${pct(totals.different / totals.combinations)})`);
  lines.push(`Identical output: ${totals.identical} (${pct(totals.identical / totals.combinations)})`);
  lines.push(`Condition/headline differs: ${totals.conditionChanged} (${pct(totals.conditionChanged / totals.combinations)})`);
  lines.push(`Lesion/explanation differs: ${totals.lesionChanged} (${pct(totals.lesionChanged / totals.combinations)})`);
  lines.push(`Advanced at least 5 words longer: ${totals.advancedLongerByAtLeastFive} (${pct(totals.advancedLongerByAtLeastFive / totals.combinations)})`);
  lines.push(`Advanced shorter than simple: ${totals.advancedShorter} (${pct(totals.advancedShorter / totals.combinations)})`);
  lines.push(`Simple at least 5 words longer: ${totals.simpleLongerThanAdvancedByAtLeastFive} (${pct(totals.simpleLongerThanAdvancedByAtLeastFive / totals.combinations)})`);
  lines.push(`Simple contains technical term absent from advanced: ${totals.simpleMoreTechnicalThanAdvanced} (${pct(totals.simpleMoreTechnicalThanAdvanced / totals.combinations)})`);
  lines.push("");
  lines.push("Family Breakdown");
  lines.push("----------------");
  for (const row of result.familyRows) {
    lines.push(
      `${row.family}: ${row.combinations} comparisons, ` +
        `different ${pct(row.differentPct)}, ` +
        `avg advanced word delta ${row.avgWordDelta.toFixed(2)}, ` +
        `range ${row.minDelta}..${row.maxDelta}`
    );
  }
  lines.push("");
  lines.push("Sample Identical Outputs");
  lines.push("------------------------");
  const identicalSamples = result.samples.identical || [];
  if (!identicalSamples.length) {
    lines.push("None.");
  } else {
    identicalSamples.forEach((sample, index) => {
      lines.push(`${index + 1}. ${JSON.stringify(sample)}`);
    });
  }
  lines.push("");
  lines.push("Sample Cases Where Advanced Is Shorter");
  lines.push("--------------------------------------");
  const shorterSamples = result.samples["advanced-shorter"] || [];
  if (!shorterSamples.length) {
    lines.push("None.");
  } else {
    shorterSamples.forEach((sample, index) => {
      lines.push(`${index + 1}. ${JSON.stringify(sample)}`);
    });
  }
  lines.push("");
  lines.push("Sample Simple-Technical Cases");
  lines.push("-----------------------------");
  const technicalSamples = result.samples["simple-technical"] || [];
  if (!technicalSamples.length) {
    lines.push("None.");
  } else {
    technicalSamples.forEach((sample, index) => {
      lines.push(`${index + 1}. ${JSON.stringify(sample)}`);
    });
  }
  lines.push("");
  lines.push("Interpretation");
  lines.push("--------------");
  if (totals.identical > 0) {
    lines.push("Some simple and advanced outputs are identical, mostly where the same clear safety note is already appropriate in both modes.");
  } else {
    lines.push("Simple and advanced outputs differ for every audited combination.");
  }
  if (totals.advancedShorter > 0 && totals.simpleMoreTechnicalThanAdvanced > 0) {
    lines.push("The modes are not fully separated: simple is occasionally longer and occasionally more technical than advanced.");
  } else if (totals.advancedShorter > 0) {
    lines.push("The modes are not fully separated by length: simple is occasionally longer, although it is still plainer.");
  } else if (totals.simpleMoreTechnicalThanAdvanced > 0) {
    lines.push("The modes are not fully separated by terminology: simple is occasionally more technical than advanced.");
  } else {
    lines.push("No cases were found where simple is more technical than advanced or substantially longer.");
  }

  return lines.join("\n");
}

const result = runAudit();
const report = formatReport(result);
fs.writeFileSync(path.join(__dirname, "output-mode-audit-report.txt"), `${report}\n`, "utf8");
console.log(report);
