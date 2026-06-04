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
  "src/pathway.js",
  "src/output-text-rules.js",
  "src/output-lesion-map.js",
  "src/output.js",
];

const CODES = ["R", "?", "W"];
const RAPD_STATES = ["none", "right", "left"];
const MODIFIER_SCENARIOS = [
  {
    name: "base",
    modifiers: {
      onset: "none",
      neuroFlags: "no",
      knownOldDefect: "no",
      nightVisionPoor: "no",
      flashesCurtain: "no",
      colourFade: "no",
    },
  },
  {
    name: "gradual",
    modifiers: {
      onset: "gradual",
      neuroFlags: "no",
      knownOldDefect: "no",
      nightVisionPoor: "no",
      flashesCurtain: "no",
      colourFade: "no",
    },
  },
  {
    name: "sudden",
    modifiers: {
      onset: "sudden",
      neuroFlags: "no",
      knownOldDefect: "no",
      nightVisionPoor: "no",
      flashesCurtain: "no",
      colourFade: "no",
    },
  },
  {
    name: "flashes",
    modifiers: {
      onset: "none",
      neuroFlags: "no",
      knownOldDefect: "no",
      nightVisionPoor: "no",
      flashesCurtain: "yes",
      colourFade: "no",
    },
  },
  {
    name: "night-vision",
    modifiers: {
      onset: "none",
      neuroFlags: "no",
      knownOldDefect: "no",
      nightVisionPoor: "yes",
      flashesCurtain: "no",
      colourFade: "no",
    },
  },
  {
    name: "colour-fade",
    modifiers: {
      onset: "none",
      neuroFlags: "no",
      knownOldDefect: "no",
      nightVisionPoor: "no",
      flashesCurtain: "no",
      colourFade: "yes",
    },
  },
];

const EXPECTED_TARGET_IDS = [
  "part-retina-right",
  "part-retina-left",
  "part-nerve-right",
  "part-nerve-left",
  "part-chiasm-a",
  "part-chiasm-b",
  "part-chiasm-lateral-right",
  "part-chiasm-lateral-left",
  "part-chiasm",
  "part-tract-left",
  "part-tract-right",
  "part-lgn-left",
  "part-lgn-right",
  "part-radiation-left-a",
  "part-radiation-left-b",
  "part-radiation-right-a",
  "part-radiation-right-b",
  "part-occipital-left",
  "part-occipital-right",
  "part-v1-left",
  "part-v1-right",
  "part-calcarine-fissure-left",
  "part-calcarine-fissure-right",
  "part-calcarine-upper-left",
  "part-calcarine-upper-right",
  "part-calcarine-lower-left",
  "part-calcarine-lower-right",
  "part-occipital-pole-left",
  "part-occipital-pole-right",
];

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

  const required = [
    "summarizeCondition",
    "mapConditionToLesionCore",
    "classifySourceAssessment",
    "applyClinicalModifierNotes",
    "buildCentralQualifierNote",
    "getPathwayTargetIds",
  ];
  for (const fnName of required) {
    if (typeof context[fnName] !== "function") {
      throw new Error(`Missing function: ${fnName}`);
    }
  }

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

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalise(value) {
  return stripHtml(value).toLowerCase();
}

function primaryCondition(conditionHtml) {
  return String(conditionHtml || "").split("<br")[0];
}

function dedupe(ids) {
  return [...new Set(ids)];
}

function sortIds(ids) {
  return dedupe(ids).sort();
}

function sameSet(actual, expected) {
  const a = sortIds(actual);
  const e = sortIds(expected);
  return a.length === e.length && a.every((id, index) => id === e[index]);
}

function retina(side) {
  if (side === "right") return ["part-retina-right"];
  if (side === "left") return ["part-retina-left"];
  return ["part-retina-right", "part-retina-left"];
}

function nerve(side) {
  if (side === "right") return ["part-nerve-right"];
  if (side === "left") return ["part-nerve-left"];
  return ["part-nerve-right", "part-nerve-left"];
}

function preChiasmal(side) {
  return [...retina(side), ...nerve(side)];
}

function chiasm() {
  return ["part-chiasm-a", "part-chiasm-b", "part-chiasm"];
}

function lateralChiasm() {
  return ["part-chiasm-lateral-right", "part-chiasm-lateral-left"];
}

function broadCentralPathway() {
  return [
    "part-nerve-right",
    "part-nerve-left",
    "part-chiasm-a",
    "part-chiasm-b",
    "part-tract-left",
    "part-tract-right",
    "part-lgn-left",
    "part-lgn-right",
  ];
}

function posterior(side) {
  function sideIds(singleSide) {
    const suffix = singleSide === "left" ? "left" : "right";
    return [
      `part-radiation-${suffix}-a`,
      `part-radiation-${suffix}-b`,
      `part-occipital-${suffix}`,
      `part-v1-${suffix}`,
      `part-calcarine-fissure-${suffix}`,
      `part-calcarine-upper-${suffix}`,
      `part-calcarine-lower-${suffix}`,
      `part-occipital-pole-${suffix}`,
    ];
  }
  if (side === "left") return sideIds("left");
  if (side === "right") return sideIds("right");
  return [...sideIds("left"), ...sideIds("right")];
}

function postChiasmal(side, mode = "hemi") {
  function sideIds(singleSide) {
    const suffix = singleSide === "left" ? "left" : "right";
    if (mode === "superior") {
      return [
        `part-radiation-${suffix}-b`,
        `part-occipital-${suffix}`,
        `part-v1-${suffix}`,
        `part-calcarine-lower-${suffix}`,
      ];
    }
    if (mode === "inferior") {
      return [
        `part-radiation-${suffix}-a`,
        `part-occipital-${suffix}`,
        `part-v1-${suffix}`,
        `part-calcarine-upper-${suffix}`,
      ];
    }
    return [
      `part-tract-${suffix}`,
      `part-lgn-${suffix}`,
      `part-radiation-${suffix}-a`,
      `part-radiation-${suffix}-b`,
      `part-occipital-${suffix}`,
      `part-v1-${suffix}`,
      `part-calcarine-fissure-${suffix}`,
      `part-calcarine-upper-${suffix}`,
      `part-calcarine-lower-${suffix}`,
      `part-occipital-pole-${suffix}`,
    ];
  }
  if (side === "left") return sideIds("left");
  if (side === "right") return sideIds("right");
  return [...sideIds("left"), ...sideIds("right")];
}

function conditionSide(text) {
  const hasRight = text.includes("right");
  const hasLeft = text.includes("left");
  if (hasRight && !hasLeft) return "right";
  if (hasLeft && !hasRight) return "left";
  return "both";
}

function homonymousPathwaySide(text) {
  if (
    text.includes("right homonymous") ||
    text.includes("right superior quadrantanopia") ||
    text.includes("right inferior quadrantanopia")
  ) {
    return "left";
  }
  if (
    text.includes("left homonymous") ||
    text.includes("left superior quadrantanopia") ||
    text.includes("left inferior quadrantanopia")
  ) {
    return "right";
  }
  return "both";
}

function junctionalNerveTargets(text) {
  const targets = [];
  if (text.includes("right centre") || text.includes("right center")) {
    targets.push("part-nerve-right");
  }
  if (text.includes("left centre") || text.includes("left center")) {
    targets.push("part-nerve-left");
  }
  return targets.length ? targets : nerve("both");
}

function sourceNarrowedAnteriorTargets(conditionText, sourceAssessment) {
  const source = sourceAssessment && typeof sourceAssessment === "object" ? sourceAssessment : null;
  const side = source && source.side ? source.side : conditionSide(conditionText);
  if (source && source.category === "retina_likely") {
    return retina(side);
  }
  if (source && source.category === "optic_nerve_likely") {
    return nerve(side);
  }
  if (source && source.category === "anterior_mixed") {
    return preChiasmal(side);
  }
  return preChiasmal(conditionSide(conditionText));
}

function rapdSupportsTract(conditionText, lesionText, rapdState) {
  if (
    lesionText.includes("rapd supports tract localisation") ||
    lesionText.includes("rapd supports tract localization") ||
    lesionText.includes("optic tract involvement")
  ) {
    return true;
  }
  if (rapdState !== "left" && rapdState !== "right") return false;
  if (conditionText.includes("left homonymous")) return rapdState === "left";
  if (conditionText.includes("right homonymous")) return rapdState === "right";
  return false;
}

function expectedTargets(primaryHtml, lesionHtml, rapdState, sourceAssessment) {
  const conditionText = normalise(primaryHtml);
  const lesionText = normalise(lesionHtml);

  if (!conditionText || conditionText.includes("full fields of vision")) {
    return [];
  }

  if (lesionText.includes("rapd supports optic nerve involvement")) {
    return nerve(conditionSide(conditionText || lesionText));
  }

  if (conditionText.includes("mixed/unclassified")) {
    return broadCentralPathway();
  }

  if (conditionText.includes("binocular blindness")) {
    return preChiasmal("both");
  }

  if (conditionText.includes("junctional scotoma")) {
    return [...junctionalNerveTargets(conditionText), ...chiasm()];
  }

  if (conditionText.includes("bitemporal")) {
    return chiasm();
  }

  if (conditionText.includes("binasal")) {
    return [...nerve("both"), ...lateralChiasm()];
  }

  if (conditionText.includes("homonymous hemianopia")) {
    const side = homonymousPathwaySide(conditionText);
    if (conditionText.includes("incongruous") || rapdSupportsTract(conditionText, lesionText, rapdState)) {
      if (side === "left") return ["part-tract-left"];
      if (side === "right") return ["part-tract-right"];
      return ["part-tract-left", "part-tract-right"];
    }
    return posterior(side);
  }

  if (conditionText.includes("quadrantanopia") && !conditionText.includes("monocular")) {
    const side = homonymousPathwaySide(conditionText);
    if (conditionText.includes("superior quadrantanopia") || lesionText.includes("meyer")) {
      return postChiasmal(side, "superior");
    }
    if (conditionText.includes("inferior quadrantanopia") || lesionText.includes("parietal")) {
      return postChiasmal(side, "inferior");
    }
    return postChiasmal(side);
  }

  if (conditionText.includes("bilateral central scotoma")) {
    return preChiasmal("both");
  }

  const anteriorByCondition =
    conditionText.includes("monocular blind eye") ||
    conditionText.includes("monocular central scotoma") ||
    conditionText.includes("monocular temporal hemianopia") ||
    conditionText.includes("monocular nasal hemianopia") ||
    conditionText.includes("cecocentral-like defect") ||
    conditionText.includes("glaucoma-like") ||
    conditionText.includes("altitudinal") ||
    conditionText.includes("tunnel vision") ||
    conditionText.includes("monocular partial") ||
    conditionText.includes("monocular large defect") ||
    (conditionText.includes("monocular") && conditionText.includes("quadrantanopia"));

  if (anteriorByCondition) {
    return sourceNarrowedAnteriorTargets(conditionText, sourceAssessment);
  }

  if (lesionText.includes("optic nerve-chiasm junction")) {
    return [...nerve("both"), ...chiasm()];
  }
  if (lesionText.includes("chiasmal")) {
    return chiasm();
  }
  if (lesionText.includes("post-chiasmal") || lesionText.includes("radiations") || lesionText.includes("occipital")) {
    return postChiasmal(conditionSide(conditionText || lesionText));
  }
  if (lesionText.includes("retina") || lesionText.includes("optic nerve")) {
    return preChiasmal(conditionSide(conditionText || lesionText));
  }

  return ["part-chiasm-a", "part-chiasm-b", "part-chiasm", "part-tract-left", "part-tract-right"];
}

function getSvgPartIds() {
  const html = fs.readFileSync(path.join(__dirname, "home.html"), "utf8");
  const ids = new Set();
  const pattern = /id="(part-[^"]+)"/g;
  let match = pattern.exec(html);
  while (match) {
    ids.add(match[1]);
    match = pattern.exec(html);
  }
  return ids;
}

function addIssue(groups, code, message, sample) {
  if (!groups.has(code)) {
    groups.set(code, { code, message, count: 0, samples: [] });
  }
  const group = groups.get(code);
  group.count += 1;
  if (group.samples.length < 8) {
    group.samples.push(sample);
  }
}

function mismatchCode(primaryHtml) {
  const text = normalise(primaryHtml);
  if (text.includes("junctional scotoma")) return "TARGET-MISMATCH-JUNCTIONAL";
  if (text.includes("binocular blindness")) return "TARGET-MISMATCH-BINOCULAR-BLINDNESS";
  if (text.includes("tunnel vision")) return "TARGET-MISMATCH-TUNNEL";
  if (text.includes("homonymous")) return "TARGET-MISMATCH-HOMONYMOUS";
  if (text.includes("quadrantanopia")) return "TARGET-MISMATCH-QUADRANTANOPIA";
  if (text.includes("bitemporal")) return "TARGET-MISMATCH-BITEMPORAL";
  if (text.includes("binasal")) return "TARGET-MISMATCH-BINASAL";
  if (text.includes("glaucoma-like")) return "TARGET-MISMATCH-GLAUCOMA";
  if (text.includes("altitudinal")) return "TARGET-MISMATCH-ALTITUDINAL";
  if (text.includes("monocular")) return "TARGET-MISMATCH-MONOCULAR";
  return "TARGET-MISMATCH-OTHER";
}

function addSourceSideChecks(issues, primaryHtml, sourceAssessment, rapdState, scenario) {
  const text = normalise(primaryHtml);
  const side = conditionSide(text);
  const sourceSide = sourceAssessment && sourceAssessment.side ? sourceAssessment.side : "both";
  if (
    text.includes("tunnel vision") &&
    (side === "right" || side === "left") &&
    (sourceAssessment.category === "retina_likely" || sourceAssessment.category === "optic_nerve_likely") &&
    sourceSide !== side
  ) {
    addIssue(
      issues,
      "SOURCE-SIDE-TUNNEL",
      "Unilateral tunnel vision source narrowing must stay on the affected eye.",
      {
        primary: stripHtml(primaryHtml),
        source: sourceAssessment,
        expectedSide: side,
        rapd: rapdState,
        scenario: scenario.name,
      }
    );
  }
}

function makeAnalysisContext(ctx, right, left, rapdState, scenario) {
  const inputState = {
    right,
    left,
    rapd: rapdState,
    ...scenario.modifiers,
  };
  const conditionHtml = ctx.summarizeCondition({ right, left });
  const primaryHtml = primaryCondition(conditionHtml);
  const baseLesion = ctx.mapConditionToLesionCore(primaryHtml, rapdState);
  const sourceAssessment = ctx.classifySourceAssessment(primaryHtml, rapdState, scenario.modifiers);
  let lesionSeed = baseLesion;
  if (
    sourceAssessment.category === "retina_likely" &&
    typeof ctx.isSingleEyePattern === "function" &&
    ctx.isSingleEyePattern(primaryHtml)
  ) {
    lesionSeed = "Likely retinal source.";
  }
  let lesionHtml = ctx.applyClinicalModifierNotes(lesionSeed, scenario.modifiers, primaryHtml);
  const centralQualifier = ctx.buildCentralQualifierNote(primaryHtml, inputState);
  if (centralQualifier) {
    lesionHtml = `${lesionHtml} ${centralQualifier}`;
  }

  return {
    conditionHtml,
    primaryHtml,
    lesionHtml,
    sourceAssessment,
  };
}

function runAudit() {
  const ctx = loadEngine();
  const svgIds = getSvgPartIds();
  const knownIds = new Set(EXPECTED_TARGET_IDS);
  const issues = new Map();
  const eyeStates = Array.from({ length: 243 }, (_, index) => makeEyeState(index));
  let renderedCombinations = 0;

  for (const id of EXPECTED_TARGET_IDS) {
    if (!svgIds.has(id)) {
      addIssue(issues, "MISSING-SVG-ID", "Expected pathway ID is absent from home.html.", { id });
    }
  }

  for (const right of eyeStates) {
    for (const left of eyeStates) {
      for (const rapdState of RAPD_STATES) {
        for (const scenario of MODIFIER_SCENARIOS) {
          renderedCombinations += 1;
          const analysis = makeAnalysisContext(ctx, right, left, rapdState, scenario);
          const actual = ctx.getPathwayTargetIds(
            analysis.primaryHtml,
            analysis.lesionHtml,
            rapdState,
            analysis.sourceAssessment
          );
          const expected = expectedTargets(
            analysis.primaryHtml,
            analysis.lesionHtml,
            rapdState,
            analysis.sourceAssessment
          );

          addSourceSideChecks(
            issues,
            analysis.primaryHtml,
            analysis.sourceAssessment,
            rapdState,
            scenario
          );

          const unknownActual = actual.filter((id) => !svgIds.has(id) || !knownIds.has(id));
          if (unknownActual.length) {
            addIssue(
              issues,
              "UNKNOWN-TARGET-ID",
              "Pathway logic returned an ID that is not a known SVG target.",
              {
                primary: stripHtml(analysis.primaryHtml),
                lesion: analysis.lesionHtml,
                rapd: rapdState,
                scenario: scenario.name,
                actual: sortIds(actual),
                unknown: sortIds(unknownActual),
              }
            );
          }

          if (!sameSet(actual, expected)) {
            addIssue(
              issues,
              mismatchCode(analysis.primaryHtml),
              "Rendered pathway targets do not align with the selected pattern family and source assessment.",
              {
                primary: stripHtml(analysis.primaryHtml),
                lesion: analysis.lesionHtml,
                source: analysis.sourceAssessment,
                rapd: rapdState,
                scenario: scenario.name,
                actual: sortIds(actual),
                expected: sortIds(expected),
                right,
                left,
              }
            );
          }
        }
      }
    }
  }

  return {
    renderedCombinations,
    svgIdCount: svgIds.size,
    issues: [...issues.values()].sort((a, b) => b.count - a.count || a.code.localeCompare(b.code)),
  };
}

function formatReport(result) {
  const lines = [];
  lines.push("Pathway Diagram Logic Audit");
  lines.push(`Rendered combinations: ${result.renderedCombinations}`);
  lines.push(`SVG pathway part IDs: ${result.svgIdCount}`);
  lines.push("");

  if (!result.issues.length) {
    lines.push("No pathway alignment issues detected.");
    return lines.join("\n");
  }

  lines.push("Issues");
  for (const issue of result.issues) {
    lines.push(`- ${issue.code}: ${issue.count}`);
    lines.push(`  ${issue.message}`);
    issue.samples.forEach((sample, index) => {
      lines.push(`  sample ${index + 1}: ${JSON.stringify(sample)}`);
    });
  }
  return lines.join("\n");
}

const result = runAudit();
const report = formatReport(result);
console.log(report);
if (result.issues.length) {
  process.exitCode = 1;
}
