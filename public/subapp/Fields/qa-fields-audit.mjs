import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_REPORT_FILE = "report.txt";
const SOURCE_FILES = [
  "src/state.js",
  "src/rules/helpers.js",
  "src/rules/anterior.js",
  "src/rules/chiasmal.js",
  "src/rules/posterior.js",
  "src/rules.js",
  "src/summary.js",
];
const CODES = ["R", "?", "W"];

// Priority order mirrors summary.js keyRank.
const FAMILY_SPECS = [
  {
    priority: 1,
    fnKey: "checkBinocularTotalLoss",
    label: "BinocularTotalLoss",
    hints: ["Binocular Blindness"],
    description: "Both eyes show global field loss across all 5 points.",
  },
  {
    priority: 2,
    fnKey: "checkMonocularTotalLoss",
    label: "MonocularTotalLoss",
    hints: ["Monocular Blind Eye"],
    description: "One eye globally down; fellow eye not globally down.",
  },
  {
    priority: 3,
    fnKey: "checkHomonymousHemianopia",
    label: "HomonymousHemianopia",
    hints: ["Homonymous Hemianopia"],
    description: "Post-chiasmal right/left hemi pattern with clean constraints.",
  },
  {
    priority: 4,
    fnKey: "checkHomonymousQuadrantanopiaTemporal",
    label: "HomonymousQuadrantanopiaTemporal",
    hints: ["Superior Quadrantanopia"],
    description: "Homonymous superior quadrantanopia family.",
  },
  {
    priority: 5,
    fnKey: "checkHomonymousQuadrantanopiaParietal",
    label: "HomonymousQuadrantanopiaParietal",
    hints: ["Inferior Quadrantanopia"],
    description: "Homonymous inferior quadrantanopia family.",
  },
  {
    priority: 6,
    fnKey: "checkBitemporalHemianopia",
    label: "BitemporalHemianopia",
    hints: ["Bitemporal Hemianopia"],
    description: "Classic bitemporal hemi with strict nasal/central sparing constraints.",
  },
  {
    priority: 7,
    fnKey: "checkBitemporalQuadrantanopia",
    label: "BitemporalQuadrantanopia",
    hints: ["Bitemporal Quadrantanopia"],
    description: "Bitemporal superior/inferior quadrantanopia pattern.",
  },
  {
    priority: 8,
    fnKey: "checkAltitudinalHemianopia",
    label: "AltitudinalHemianopia",
    hints: ["Altitudinal"],
    description: "Superior or inferior hemifield loss pattern.",
  },
  {
    priority: 9,
    fnKey: "checkTunnelVision",
    label: "TunnelVision",
    hints: ["Tunnel Vision"],
    description: "Peripheral constriction with central sparing (uni/bilateral).",
  },
  {
    priority: 10,
    fnKey: "checkMonocularCentralScotoma",
    label: "MonocularCentralScotoma",
    hints: ["Monocular Central Scotoma"],
    description: "Pure central single-eye defect with normal peripheral quadrants.",
  },
  {
    priority: 11,
    fnKey: "checkBilateralCentralScotoma",
    label: "BilateralCentralScotoma",
    hints: ["Bilateral Central Scotoma"],
    description: "Pure central bilateral defect with normal quadrants.",
  },
  {
    priority: 12,
    fnKey: "checkJunctional",
    label: "JunctionalScotoma",
    hints: ["Junctional Scotoma"],
    description: "Classic junctional center+contralateral ST pattern.",
  },
  {
    priority: 13,
    fnKey: "checkMonocularCecocentralLike",
    label: "MonocularCecocentralLike",
    hints: ["Monocular Cecocentral-like Defect"],
    description: "Single-eye central plus temporal involvement (coarse cecocentral proxy).",
  },
  {
    priority: 14,
    fnKey: "checkMonocularTemporalHemianopia",
    label: "MonocularTemporalHemianopia",
    hints: ["Monocular Temporal Hemianopia"],
    description: "Single-eye temporal hemi pattern.",
  },
  {
    priority: 15,
    fnKey: "checkMonocularNasalHemianopia",
    label: "MonocularNasalHemianopia",
    hints: ["Monocular Nasal Hemianopia"],
    description: "Single-eye nasal hemi pattern.",
  },
  {
    priority: 16,
    fnKey: "checkGlaucomaSimple",
    label: "GlaucomaSimple",
    hints: ["Glaucoma-like Changes"],
    description: "Nasal-predominant change with central sparing in simplified model.",
  },
  {
    priority: 17,
    fnKey: "checkBinasal",
    label: "BinasalHemianopia",
    hints: ["Binasal Hemianopia"],
    description: "Binasal hemi family (strict + controlled fuzzy variant).",
  },
  {
    priority: 18,
    fnKey: "checkMonocularOtherDefect",
    label: "MonocularOtherDefect",
    hints: [
      "Monocular 4-Quadrant Defect",
      "Monocular Large Defect",
      "Monocular Partial Defect",
      "Monocular Superior Temporal Quadrantanopia",
      "Monocular Superior Nasal Quadrantanopia",
      "Monocular Inferior Temporal Quadrantanopia",
      "Monocular Inferior Nasal Quadrantanopia",
    ],
    description: "Fallback monocular non-specific defect family.",
  },
];

const CHECK_KEYS = FAMILY_SPECS.map((item) => item.fnKey);
const CHECK_LABELS = Object.fromEntries(FAMILY_SPECS.map((item) => [item.fnKey, item.label]));

function loadEngine() {
  const context = { console };
  vm.createContext(context);

  for (const relFile of SOURCE_FILES) {
    const absFile = path.join(__dirname, relFile);
    const code = fs.readFileSync(absFile, "utf8");
    vm.runInContext(code, context, { filename: relFile });
  }

  for (const fnName of CHECK_KEYS) {
    if (typeof context[fnName] !== "function") {
      throw new Error(`Missing check function: ${fnName}`);
    }
  }
  if (typeof context.summarizeCondition !== "function") {
    throw new Error("Missing summarizeCondition function");
  }

  return context;
}

function makeEyeState(index) {
  // Base-3 mapping for 5 positions: st, sn, it, in, c
  const st = CODES[Math.floor(index / 81) % 3];
  const sn = CODES[Math.floor(index / 27) % 3];
  const it = CODES[Math.floor(index / 9) % 3];
  const inn = CODES[Math.floor(index / 3) % 3];
  const c = CODES[index % 3];
  return { st, sn, it, in: inn, c };
}

function hasAnyAbnormal(eye) {
  return eye.st !== "R" || eye.sn !== "R" || eye.it !== "R" || eye.in !== "R" || eye.c !== "R";
}

function checkIssue(list, severity, code, message, sample) {
  list.push({ severity, code, message, sample });
}

function parseAlsoConsider(summaryText) {
  const markers = ["<small>Also: ", "<small>Also consider: "];
  let from = -1;
  for (const marker of markers) {
    const start = summaryText.indexOf(marker);
    if (start >= 0) {
      from = start + marker.length;
      break;
    }
  }
  if (from < 0) return "";
  const end = summaryText.indexOf("</small>", from);
  if (end < 0) return summaryText.slice(from).trim();
  return summaryText.slice(from, end).trim();
}

function parsePrimaryText(summaryText) {
  const markerIdx = summaryText.indexOf("<br><small>Also:");
  const fallbackIdx = summaryText.indexOf("<br><small>Also consider:");
  const idx = markerIdx >= 0 ? markerIdx : fallbackIdx;
  return idx >= 0 ? summaryText.slice(0, idx).trim() : summaryText.trim();
}

function detectPrimaryFamilyLabel(primaryText) {
  if (primaryText === "Condition not identified") return "ConditionNotIdentified";
  if (primaryText.includes("Full Fields of Vision")) return "FullFieldsNormal";
  if (primaryText.includes("Mixed/Unclassified Field Defect")) return "MixedUnclassified";

  for (const spec of FAMILY_SPECS) {
    if (spec.hints.some((hint) => primaryText.includes(hint))) {
      return spec.label;
    }
  }
  return "UnknownPrimary";
}

function runRegressionChecks(ctx) {
  const findings = [];
  const cases = [
    {
      id: "R1",
      name: "Right homonymous should not also report quadrantanopia/glaucoma",
      right: { st: "W", sn: "R", it: "W", in: "R", c: "R" },
      left: { st: "R", sn: "W", it: "R", in: "W", c: "R" },
      assert: (text) =>
        text.includes("Right Homonymous Hemianopia") &&
        !text.includes("Quadrantanopia") &&
        !text.includes("Glaucoma-like"),
    },
    {
      id: "R2",
      name: "Pure monocular inferior altitudinal should stay altitudinal-only",
      right: { st: "R", sn: "R", it: "R", in: "R", c: "R" },
      left: { st: "R", sn: "R", it: "W", in: "W", c: "R" },
      assert: (text) =>
        text.includes("Left Inferior Altitudinal") &&
        !text.includes("Glaucoma-like") &&
        !text.includes("Monocular Partial"),
    },
    {
      id: "R3",
      name: "Single definite nasal defect should not be graded Possible",
      right: { st: "R", sn: "W", it: "R", in: "R", c: "R" },
      left: { st: "R", sn: "R", it: "R", in: "R", c: "R" },
      assert: (text) =>
        text.includes("Glaucoma-like Changes (Right Eye)") &&
        !text.includes("<em>Possible</em>"),
    },
    {
      id: "R4",
      name: "Monocular temporal hemianopia gets specific label",
      right: { st: "W", sn: "R", it: "W", in: "R", c: "R" },
      left: { st: "R", sn: "R", it: "R", in: "R", c: "R" },
      assert: (text) =>
        text.includes("Right Monocular Temporal Hemianopia") &&
        !text.includes("Monocular Partial"),
    },
    {
      id: "R5",
      name: "Monocular nasal hemianopia stays separate from glaucoma label (pure strong pattern)",
      right: { st: "R", sn: "W", it: "R", in: "W", c: "R" },
      left: { st: "R", sn: "R", it: "R", in: "R", c: "R" },
      assert: (text) =>
        text.includes("Right Monocular Nasal Hemianopia") &&
        !text.includes("Glaucoma-like"),
    },
    {
      id: "R6",
      name: "Cecocentral-like pattern gets specific label",
      right: { st: "W", sn: "R", it: "R", in: "R", c: "W" },
      left: { st: "R", sn: "R", it: "R", in: "R", c: "R" },
      assert: (text) =>
        text.includes("Right Monocular Cecocentral-like Defect") &&
        !text.includes("Monocular Partial"),
    },
    {
      id: "R7",
      name: "Monocular temporal hemianopia should persist despite minor contralateral noise",
      right: { st: "W", sn: "R", it: "W", in: "R", c: "R" },
      left: { st: "R", sn: "R", it: "R", in: "?", c: "R" },
      assert: (text) => text.includes("Right Monocular Temporal Hemianopia"),
    },
    {
      id: "R8",
      name: "Mixed homonymous-plus-extra pattern should not be labelled classic homonymous hemianopia",
      right: { st: "R", sn: "?", it: "R", in: "?", c: "R" },
      left: { st: "?", sn: "R", it: "?", in: "?", c: "R" },
      assert: (text) => !text.includes("Homonymous Hemianopia"),
    },
    {
      id: "R9",
      name: "Bitemporal hemianopia requires clean nasal/central sparing",
      right: { st: "?", sn: "R", it: "?", in: "R", c: "R" },
      left: { st: "?", sn: "R", it: "?", in: "R", c: "?" },
      assert: (text) => !text.includes("Bitemporal Hemianopia"),
    },
    {
      id: "R10",
      name: "Monocular total loss should remain primary with contralateral tunnel note",
      right: { st: "W", sn: "W", it: "W", in: "W", c: "W" },
      left: { st: "?", sn: "?", it: "?", in: "?", c: "R" },
      assert: (text) =>
        text.includes("Right Monocular Blind Eye") &&
        text.includes("Also:") &&
        text.includes("Tunnel Vision"),
    },
    {
      id: "R11",
      name: "Left total-loss with right abnormalities should still expose a right-eye family",
      right: { st: "R", sn: "?", it: "R", in: "W", c: "?" },
      left: { st: "W", sn: "?", it: "?", in: "W", c: "?" },
      assert: (text) =>
        text.includes("Left Monocular Blind Eye") &&
        text.includes("Also:") &&
        text.includes("Right Monocular Nasal Hemianopia"),
    },
    {
      id: "R12",
      name: "Central-involved nasal pattern should avoid glaucoma-like and pick specific monocular family",
      right: { st: "?", sn: "?", it: "?", in: "R", c: "?" },
      left: { st: "R", sn: "?", it: "R", in: "?", c: "?" },
      assert: (text) =>
        !text.includes("Glaucoma-like") &&
        text.includes("Left Monocular Nasal Hemianopia"),
    },
    {
      id: "R13",
      name: "With central/temporal contamination, favor monocular nasal over binasal",
      right: { st: "R", sn: "W", it: "R", in: "W", c: "?" },
      left: { st: "?", sn: "W", it: "R", in: "W", c: "R" },
      assert: (text) =>
        text.includes("Right Monocular Nasal Hemianopia") &&
        !text.includes("Binasal Hemianopia"),
    },
    {
      id: "R14",
      name: "Single monocular quadrant loss should use quadrantanopia label, not generic partial defect",
      right: { st: "R", sn: "R", it: "R", in: "R", c: "R" },
      left: { st: "W", sn: "R", it: "R", in: "R", c: "R" },
      assert: (text) =>
        text.includes("Left Monocular Superior Temporal Quadrantanopia") &&
        !text.includes("Monocular Partial"),
    },
    {
      id: "R15",
      name: "Bilateral all-partial nasal-only pattern should stay glaucoma-like (not binasal)",
      right: { st: "R", sn: "?", it: "R", in: "?", c: "R" },
      left: { st: "R", sn: "?", it: "R", in: "?", c: "R" },
      assert: (text) =>
        text.includes("Glaucoma-like Changes Both Eyes") &&
        !text.includes("Binasal Hemianopia"),
    },
  ];

  for (const item of cases) {
    const summaryText = ctx.summarizeCondition({ right: item.right, left: item.left });
    if (!item.assert(summaryText)) {
      checkIssue(
        findings,
        "P1",
        item.id,
        `Regression check failed: ${item.name}`,
        { right: item.right, left: item.left, summary: summaryText }
      );
    }
  }

  return { findings, totalCases: cases.length };
}

function runAudit() {
  const ctx = loadEngine();
  const checks = CHECK_KEYS.map((key) => ({ key, fn: ctx[key], label: CHECK_LABELS[key] || key }));
  const eyeStates = Array.from({ length: 243 }, (_, i) => makeEyeState(i));

  const summary = {
    totalStates: 0,
    statesWithAnyAbnormalInput: 0,
    rawNoMatch: 0,
    rawNoMatchWithAbnormalInput: 0,
    rawSingleMatch: 0,
    rawMultiMatch: 0,
    rawGt2Matches: 0,
    rawMaxMatches: 0,
    summaryNoMatch: 0,
    summaryNoMatchWithAbnormalInput: 0,
    summaryMixedUnclassifiedPrimary: 0,
    summaryFullFieldsPrimary: 0,
    summaryUnknownPrimary: 0,
    summaryWithAlsoConsider: 0,
  };

  const familyStats = Object.fromEntries(
    FAMILY_SPECS.map((spec) => [
      spec.label,
      {
        priority: spec.priority,
        fnKey: spec.fnKey,
        label: spec.label,
        description: spec.description,
        rawMatches: 0,
        primaryMatches: 0,
        summaryMentions: 0,
      },
    ])
  );

  const overlapPairCounts = new Map();
  const issues = [];

  const pushPair = (a, b) => {
    const key = `${a}|${b}`;
    overlapPairCounts.set(key, (overlapPairCounts.get(key) || 0) + 1);
  };

  for (const right of eyeStates) {
    for (const left of eyeStates) {
      summary.totalStates += 1;
      const abnormal = hasAnyAbnormal(right) || hasAnyAbnormal(left);
      if (abnormal) summary.statesWithAnyAbnormalInput += 1;

      const matchedChecks = [];
      for (const check of checks) {
        const result = check.fn(right, left);
        if (result) {
          matchedChecks.push(check);
          if (familyStats[check.label]) {
            familyStats[check.label].rawMatches += 1;
          }
        }
      }

      const rawCount = matchedChecks.length;
      if (rawCount === 0) {
        summary.rawNoMatch += 1;
        if (abnormal) summary.rawNoMatchWithAbnormalInput += 1;
      } else if (rawCount === 1) {
        summary.rawSingleMatch += 1;
      } else {
        summary.rawMultiMatch += 1;
      }
      if (rawCount > 2) summary.rawGt2Matches += 1;
      if (rawCount > summary.rawMaxMatches) summary.rawMaxMatches = rawCount;

      for (let i = 0; i < matchedChecks.length; i += 1) {
        for (let j = i + 1; j < matchedChecks.length; j += 1) {
          const a = matchedChecks[i].label;
          const b = matchedChecks[j].label;
          const [x, y] = a < b ? [a, b] : [b, a];
          pushPair(x, y);
        }
      }

      const rendered = ctx.summarizeCondition({ right, left });
      if (rendered === "Condition not identified") {
        summary.summaryNoMatch += 1;
        if (abnormal) summary.summaryNoMatchWithAbnormalInput += 1;
      }
      if (rendered.includes("Also:") || rendered.includes("Also consider:")) {
        summary.summaryWithAlsoConsider += 1;
      }

      const primaryText = parsePrimaryText(rendered);
      const primaryLabel = detectPrimaryFamilyLabel(primaryText);
      if (familyStats[primaryLabel]) {
        familyStats[primaryLabel].primaryMatches += 1;
      } else if (primaryLabel === "FullFieldsNormal") {
        summary.summaryFullFieldsPrimary += 1;
      } else if (primaryLabel === "MixedUnclassified") {
        summary.summaryMixedUnclassifiedPrimary += 1;
      } else if (primaryLabel !== "ConditionNotIdentified") {
        summary.summaryUnknownPrimary += 1;
      }

      for (const spec of FAMILY_SPECS) {
        if (spec.hints.some((hint) => rendered.includes(hint))) {
          familyStats[spec.label].summaryMentions += 1;
        }
      }

      const also = parseAlsoConsider(rendered);
      const allowAltitudinalGlaucomaOverlap = (() => {
        const score = (code) => (code === "W" ? 2 : code === "?" ? 1 : 0);
        const isEyeNormalLocal = (eye) =>
          eye.st === "R" && eye.sn === "R" && eye.it === "R" && eye.in === "R" && eye.c === "R";
        const isNasalWeightedSuperiorAlt = (eye) => {
          const st = score(eye.st);
          const sn = score(eye.sn);
          const it = score(eye.it);
          const inn = score(eye.in);
          const c = score(eye.c);
          return c === 0 && st >= 1 && sn >= 1 && it === 0 && inn === 0 && sn >= st && sn === 2;
        };
        return (
          (isNasalWeightedSuperiorAlt(right) && isEyeNormalLocal(left)) ||
          (isNasalWeightedSuperiorAlt(left) && isEyeNormalLocal(right)) ||
          (isNasalWeightedSuperiorAlt(right) && isNasalWeightedSuperiorAlt(left))
        );
      })();
      if (rendered.includes("Homonymous Hemianopia") && also.includes("Quadrantanopia")) {
        checkIssue(
          issues,
          "P1",
          "CROSS-HEMI-QUAD",
          "Homonymous hemianopia still reports quadrantanopia as a differential.",
          { right, left, rendered }
        );
      }
      if (
        rendered.includes("Altitudinal") &&
        rendered.includes("Glaucoma-like") &&
        !allowAltitudinalGlaucomaOverlap
      ) {
        checkIssue(
          issues,
          "P2",
          "ALT-GLAUCOMA-OVERLAP",
          "Altitudinal defect still overlaps glaucoma wording in summary output.",
          { right, left, rendered }
        );
      }
      if (
        rendered.includes("Monocular Central Scotoma") &&
        (rendered.includes("Monocular Partial") || rendered.includes("Monocular Large"))
      ) {
        checkIssue(
          issues,
          "P2",
          "CENTRAL-FALLBACK-OVERLAP",
          "Specific central scotoma output overlaps with generic monocular fallback.",
          { right, left, rendered }
        );
      }
      if (also.includes("Also consider:") || also.includes("Also:")) {
        checkIssue(
          issues,
          "P3",
          "NESTED-ALSO-CONSIDER",
          "Summary text contains nested 'Also consider' wording.",
          { right, left, rendered }
        );
      }

      // Classic hemi labels should only appear for clean patterns.
      if (rendered.includes("Homonymous Hemianopia")) {
        const rightToLeft =
          (right.st !== "R" || right.it !== "R" || left.sn !== "R" || left.in !== "R") &&
          (right.sn !== "R" || right.in !== "R" || left.st !== "R" || left.it !== "R");
        if (rightToLeft) {
          checkIssue(
            issues,
            "P1",
            "HOMONYM-OVERCALL",
            "Homonymous hemianopia label appears on mixed/non-clean pattern.",
            { right, left, rendered }
          );
        }
      }
      if (rendered.includes("Bitemporal Hemianopia")) {
        const nonClean =
          right.sn !== "R" ||
          right.in !== "R" ||
          left.sn !== "R" ||
          left.in !== "R" ||
          right.c !== "R" ||
          left.c !== "R";
        if (nonClean) {
          checkIssue(
            issues,
            "P1",
            "BITEMPORAL-OVERCALL",
            "Bitemporal hemianopia label appears despite nasal/central contamination.",
            { right, left, rendered }
          );
        }
      }
      if (rendered.includes("Binasal Hemianopia")) {
        const temporalNoise =
          (right.st === "R" ? 0 : right.st === "?" ? 1 : 2) +
          (right.it === "R" ? 0 : right.it === "?" ? 1 : 2) +
          (left.st === "R" ? 0 : left.st === "?" ? 1 : 2) +
          (left.it === "R" ? 0 : left.it === "?" ? 1 : 2);
        const hasDefiniteCentralLoss = right.c === "W" || left.c === "W";
        if (hasDefiniteCentralLoss || temporalNoise > 2) {
          checkIssue(
            issues,
            "P1",
            "BINASAL-OVERCALL",
            "Binasal hemianopia label appears on heavily contaminated non-binasal pattern.",
            { right, left, rendered }
          );
        }
      }
    }
  }

  const regression = runRegressionChecks(ctx);
  issues.push(...regression.findings);

  const severityCounts = { P0: 0, P1: 0, P2: 0, P3: 0 };
  for (const issue of issues) severityCounts[issue.severity] += 1;

  const topPairs = [...overlapPairCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([pair, count]) => ({ pair, count }));

  const familyRows = Object.values(familyStats).sort((a, b) => a.priority - b.priority);
  const topPrimaryFamilies = [...familyRows]
    .sort((a, b) => b.primaryMatches - a.primaryMatches)
    .slice(0, 10);

  return {
    summary,
    familyRows,
    topPrimaryFamilies,
    topPairs,
    issues,
    severityCounts,
    regression,
  };
}

function pct(part, total) {
  if (!total) return "0.00%";
  return `${((part / total) * 100).toFixed(2)}%`;
}

function formatReport(results) {
  const { summary, familyRows, topPrimaryFamilies, topPairs, issues, severityCounts, regression } = results;
  const now = new Date();
  const lines = [];
  const statesWithAnyRawMatch = summary.totalStates - summary.rawNoMatch;

  lines.push("Fields Logic Audit Report");
  lines.push(`Generated: ${now.toISOString()}`);
  lines.push("");

  lines.push("Run Details");
  lines.push("-----------");
  lines.push("Command: node qa-fields-audit.mjs");
  lines.push("Audit script: qa-fields-audit.mjs");
  lines.push("Source files: src/state.js, src/rules/helpers.js, src/rules/anterior.js, src/rules/chiasmal.js, src/rules/posterior.js, src/rules.js, src/summary.js");
  lines.push("Scanned state-space: 3^10 = 59,049 (both eyes, 5 points each, R/?/W)");
  lines.push("");

  lines.push("Coverage");
  lines.push("--------");
  lines.push(`Total states audited: ${summary.totalStates}`);
  lines.push(`States with any abnormal input: ${summary.statesWithAnyAbnormalInput} (${pct(summary.statesWithAnyAbnormalInput, summary.totalStates)})`);
  lines.push(`Raw no-match states: ${summary.rawNoMatch} (${pct(summary.rawNoMatch, summary.totalStates)})`);
  lines.push(`Raw no-match + abnormal input: ${summary.rawNoMatchWithAbnormalInput} (${pct(summary.rawNoMatchWithAbnormalInput, summary.totalStates)})`);
  lines.push(`Raw single-match states: ${summary.rawSingleMatch} (${pct(summary.rawSingleMatch, summary.totalStates)})`);
  lines.push(`Raw multi-match states: ${summary.rawMultiMatch} (${pct(summary.rawMultiMatch, summary.totalStates)})`);
  lines.push(`Raw >2-match states: ${summary.rawGt2Matches} (${pct(summary.rawGt2Matches, summary.totalStates)})`);
  lines.push(`Raw max simultaneous matches: ${summary.rawMaxMatches}`);
  lines.push(`Summary "Condition not identified" states: ${summary.summaryNoMatch}`);
  lines.push(`Summary "Condition not identified" + abnormal input: ${summary.summaryNoMatchWithAbnormalInput}`);
  lines.push(`Summary "Mixed/Unclassified" primary states: ${summary.summaryMixedUnclassifiedPrimary}`);
  lines.push(`Summary "Full Fields of Vision" primary states: ${summary.summaryFullFieldsPrimary}`);
  lines.push(`Summary unknown primary states: ${summary.summaryUnknownPrimary}`);
  lines.push(`Summary with "Also" states: ${summary.summaryWithAlsoConsider} (${pct(summary.summaryWithAlsoConsider, summary.totalStates)})`);
  lines.push("");

  lines.push("Rule Families (18) - Priority Order");
  lines.push("-----------------------------------");
  for (const row of familyRows) {
    const id = String(row.priority).padStart(2, "0");
    lines.push(`${id}. ${row.label} (${row.fnKey})`);
    lines.push(`    ${row.description}`);
  }
  lines.push("");

  lines.push("Family Metrics");
  lines.push("--------------");
  lines.push("Columns: RawMatches (rule-level), PrimaryMatches (final top output), SummaryMentions (main or secondary)");
  for (const row of familyRows) {
    lines.push(
      `${String(row.priority).padStart(2, "0")}. ${row.label}: ` +
        `Raw=${row.rawMatches} (${pct(row.rawMatches, summary.totalStates)}), ` +
        `Primary=${row.primaryMatches} (${pct(row.primaryMatches, summary.totalStates)}), ` +
        `Shown=${row.summaryMentions} (${pct(row.summaryMentions, summary.totalStates)})`
    );
  }
  lines.push("");

  lines.push("Top Primary Families");
  lines.push("--------------------");
  for (const row of topPrimaryFamilies) {
    lines.push(
      `- ${row.label}: ${row.primaryMatches} primary states ` +
        `(${pct(row.primaryMatches, summary.totalStates)} of all, ${pct(row.primaryMatches, statesWithAnyRawMatch)} of states with any rule match)`
    );
  }
  lines.push("");

  lines.push("Top Raw Rule Overlaps");
  lines.push("---------------------");
  if (!topPairs.length) {
    lines.push("No overlap pairs found.");
  } else {
    for (const item of topPairs) {
      lines.push(`- ${item.pair}: ${item.count}`);
    }
  }
  lines.push("");

  lines.push("Regression Suite");
  lines.push("----------------");
  lines.push(`Total regression scenarios: ${regression.totalCases}`);
  lines.push(`Passed: ${regression.totalCases - regression.findings.length}`);
  lines.push(`Failed: ${regression.findings.length}`);
  lines.push("");

  lines.push("Issue Totals By Severity");
  lines.push("------------------------");
  lines.push(`P0: ${severityCounts.P0}`);
  lines.push(`P1: ${severityCounts.P1}`);
  lines.push(`P2: ${severityCounts.P2}`);
  lines.push(`P3: ${severityCounts.P3}`);
  lines.push("");

  lines.push("Issue Breakdown");
  lines.push("---------------");
  if (!issues.length) {
    lines.push("No policy findings detected.");
  } else {
    const maxPrinted = 40;
    const printable = issues.slice(0, maxPrinted);
    for (let i = 0; i < printable.length; i += 1) {
      const issue = printable[i];
      lines.push(`${i + 1}. [${issue.severity}] ${issue.code}: ${issue.message}`);
      if (issue.sample) {
        lines.push(`   sample: ${JSON.stringify(issue.sample)}`);
      }
    }
    if (issues.length > maxPrinted) {
      lines.push(`... ${issues.length - maxPrinted} more issues not printed.`);
    }
  }
  lines.push("");

  lines.push("Recommendations");
  lines.push("---------------");
  if (severityCounts.P1 || severityCounts.P0) {
    lines.push("1. Resolve all P1/P0 findings before locking this ruleset.");
  } else {
    lines.push("1. No high-severity blockers detected in this run.");
  }
  lines.push("2. Keep FAMILY_SPECS as single-source ordering/definition for all 18 families.");
  lines.push("3. Add one regression case for every newly fixed clinical edge-case before future releases.");
  lines.push("4. Re-run this audit after any change in src/rules/*.js or src/summary.js.");

  return lines.join("\n");
}

function main() {
  const results = runAudit();
  const report = formatReport(results);
  fs.writeFileSync(path.join(__dirname, OUTPUT_REPORT_FILE), `${report}\n`, "utf8");
  console.log(report);
}

main();
