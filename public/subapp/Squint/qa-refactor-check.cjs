/*
 * Refactor parity harness for Squint.
 *
 * Usage:
 *   node qa-refactor-check.cjs baseline
 *   node qa-refactor-check.cjs check
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = __dirname;
const BASELINE_JSON = path.join(ROOT, "qa-refactor-baseline.json");
const BASELINE_REPORT = path.join(ROOT, "report-refactor-baseline.txt");

function createDomStub() {
  return {
    addEventListener() {},
    removeEventListener() {},
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    getElementById() {
      return null;
    },
    body: {
      classList: {
        contains() {
          return false;
        },
        add() {},
        remove() {},
        toggle() {},
      },
    },
    documentElement: {},
  };
}

function createContext() {
  return vm.createContext({
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Math,
    Date,
    Array,
    Object,
    String,
    Number,
    Boolean,
    parseInt,
    parseFloat,
    document: createDomStub(),
    window: {},
    getComputedStyle() {
      return {
        getPropertyValue() {
          return "";
        },
      };
    },
    globalThis: {},
  });
}

function evaluateWithExports(filePath, exportSnippet) {
  const src = fs.readFileSync(filePath, "utf8");
  const context = createContext();
  const wrapped = `${src}\n${exportSnippet}\n`;
  vm.runInContext(wrapped, context, { filename: filePath });
  return context.globalThis;
}

function evaluateBundleWithExports(filePaths, exportSnippet) {
  const context = createContext();
  filePaths.forEach((filePath) => {
    const src = fs.readFileSync(filePath, "utf8");
    vm.runInContext(src, context, { filename: filePath });
  });
  vm.runInContext(exportSnippet, context);
  return context.globalThis;
}

function collectSnapshot() {
  const scriptExports = evaluateBundleWithExports(
    [path.join(ROOT, "src", "sim-core.js"), path.join(ROOT, "src", "state.js")],
    "globalThis.__scriptExports = { CONDITION_LIBRARY: globalThis.AppState.CONDITION_LIBRARY };",
  ).__scriptExports;

  const analysisExports = evaluateBundleWithExports(
    [
      path.join(ROOT, "src", "analysis-core.js"),
      path.join(ROOT, "analysis.js"),
    ],
    [
      "globalThis.__analysisExports = {",
      "  determineCondition,",
      "  transformOutput,",
      "  determinePupilCondition,",
      "  extractModifierState,",
      "  buildModifierSummary,",
      "  buildModifierGuidance",
      "};",
    ].join("\n"),
  ).__analysisExports;

  const mcqExports = evaluateWithExports(
    path.join(ROOT, "src", "mcq-data.js"),
    "globalThis.__mcqExports = { MCQ_BANK: globalThis.McqData.MCQ_BANK };",
  ).__mcqExports;

  const presetCounts = Object.fromEntries(
    Object.entries(scriptExports.CONDITION_LIBRARY).map(([level, items]) => [
      level,
      items.length,
    ]),
  );

  const mcqCounts = Object.fromEntries(
    Object.entries(mcqExports.MCQ_BANK).map(([level, items]) => [
      level,
      items.length,
    ]),
  );

  const scenarios = [
    {
      id: "third_definite",
      right:
        "RE: large out and large down | large ptosis | dilated pupil | SUDDEN",
      left: "LE: normal",
    },
    {
      id: "third_pupil_sparing_hint",
      right:
        "RE: large out and large down | med ptosis | SUDDEN | hint:pupil_sparing_3rd",
      left: "LE: normal",
    },
    {
      id: "sixth_partial_medium_hint",
      right: "RE: medium in | SUDDEN | hint:partial_6th_medium",
      left: "LE: normal",
    },
    {
      id: "fourth_pattern",
      right: "RE: medium out and medium up",
      left: "LE: normal",
    },
    {
      id: "horner_like",
      right: "RE: smaller pupil | med ptosis | faded",
      left: "LE: normal",
    },
    {
      id: "myasthenia_hint",
      right: "RE: medium out and med down | med ptosis | hint:myasthenia",
      left: "LE: normal",
    },
    {
      id: "thyroid_hint",
      right: "RE: medium down | hint:thyroid_restrictive",
      left: "LE: normal",
    },
    {
      id: "ino_hint",
      right: "RE: medium in | hint:ino",
      left: "LE: normal",
    },
    {
      id: "modifier_bundle",
      right:
        "RE: large out and large down | large ptosis | dilated pupil | SUDDEN | PAIN | TRAUMA",
      left: "LE: normal | PAIN | TRAUMA",
    },
    {
      id: "fatigable_headtilt",
      right:
        "RE: medium out and med down | med ptosis | FATIGABLE | HEADTILT:RIGHT",
      left: "LE: normal | FATIGABLE | HEADTILT:RIGHT",
    },
  ];

  const scenarioResults = scenarios.map((scenario) => {
    const rightCond = analysisExports.determineCondition(scenario.right);
    const leftCond = analysisExports.determineCondition(scenario.left);
    const modifiers = analysisExports.extractModifierState(
      scenario.right,
      scenario.left,
    );
    return {
      id: scenario.id,
      rightCondition: rightCond,
      leftCondition: leftCond,
      pupilCondition: analysisExports.determinePupilCondition(
        scenario.right,
        scenario.left,
      ),
      rightTransformed: analysisExports.transformOutput(scenario.right, "RE"),
      leftTransformed: analysisExports.transformOutput(scenario.left, "LE"),
      modifierSummary: analysisExports.buildModifierSummary(modifiers),
      modifierGuidance: analysisExports.buildModifierGuidance(
        modifiers,
        rightCond,
        leftCond,
      ),
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    presetCounts,
    presetTotal: Object.values(presetCounts).reduce((sum, n) => sum + n, 0),
    mcqCounts,
    mcqTotal: Object.values(mcqCounts).reduce((sum, n) => sum + n, 0),
    scenarios: scenarioResults,
  };
}

function writeBaseline(snapshot) {
  fs.writeFileSync(
    BASELINE_JSON,
    JSON.stringify(snapshot, null, 2) + "\n",
    "utf8",
  );

  const lines = [];
  lines.push("Squint Refactor Baseline");
  lines.push("=======================");
  lines.push(`Generated: ${snapshot.generatedAt}`);
  lines.push("");
  lines.push("Preset Counts");
  lines.push("-------------");
  Object.entries(snapshot.presetCounts).forEach(([level, count]) => {
    lines.push(`- ${level}: ${count}`);
  });
  lines.push(`- total: ${snapshot.presetTotal}`);
  lines.push("");
  lines.push("MCQ Counts");
  lines.push("----------");
  Object.entries(snapshot.mcqCounts).forEach(([level, count]) => {
    lines.push(`- ${level}: ${count}`);
  });
  lines.push(`- total: ${snapshot.mcqTotal}`);
  lines.push("");
  lines.push("Scenario Outputs");
  lines.push("----------------");
  snapshot.scenarios.forEach((scenario) => {
    lines.push(`- ${scenario.id}`);
    lines.push(`  rightCondition: ${scenario.rightCondition}`);
    lines.push(`  leftCondition: ${scenario.leftCondition}`);
    lines.push(`  pupilCondition: ${scenario.pupilCondition}`);
    lines.push(`  modifierSummary: ${scenario.modifierSummary}`);
    lines.push(`  modifierGuidance: ${scenario.modifierGuidance}`);
  });
  lines.push("");
  fs.writeFileSync(BASELINE_REPORT, lines.join("\n"), "utf8");
}

function compareSnapshots(actual, expected) {
  const differences = [];

  function walk(a, b, pathPrefix) {
    const aIsObj = a && typeof a === "object";
    const bIsObj = b && typeof b === "object";
    if (!aIsObj || !bIsObj) {
      if (a !== b)
        differences.push(
          `${pathPrefix}: expected=${JSON.stringify(b)} actual=${JSON.stringify(a)}`,
        );
      return;
    }

    if (Array.isArray(a) || Array.isArray(b)) {
      const aArr = Array.isArray(a) ? a : [];
      const bArr = Array.isArray(b) ? b : [];
      if (aArr.length !== bArr.length) {
        differences.push(
          `${pathPrefix}.length: expected=${bArr.length} actual=${aArr.length}`,
        );
      }
      const len = Math.min(aArr.length, bArr.length);
      for (let i = 0; i < len; i += 1) {
        walk(aArr[i], bArr[i], `${pathPrefix}[${i}]`);
      }
      return;
    }

    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    keys.forEach((key) => {
      if (key === "generatedAt") return;
      if (!(key in a)) {
        differences.push(`${pathPrefix}.${key}: missing in actual`);
      } else if (!(key in b)) {
        differences.push(`${pathPrefix}.${key}: extra in actual`);
      } else {
        walk(a[key], b[key], `${pathPrefix}.${key}`);
      }
    });
  }

  walk(actual, expected, "snapshot");
  return differences;
}

function main() {
  const mode = (process.argv[2] || "check").toLowerCase();
  const snapshot = collectSnapshot();

  if (mode === "baseline") {
    writeBaseline(snapshot);
    console.log(
      `Baseline written: ${path.basename(BASELINE_JSON)} + ${path.basename(BASELINE_REPORT)}`,
    );
    return;
  }

  if (!fs.existsSync(BASELINE_JSON)) {
    console.error(`Missing baseline file: ${BASELINE_JSON}`);
    process.exit(1);
  }

  const expected = JSON.parse(fs.readFileSync(BASELINE_JSON, "utf8"));
  const diffs = compareSnapshots(snapshot, expected);
  if (diffs.length) {
    console.error("Refactor parity check FAILED");
    diffs.slice(0, 50).forEach((d) => console.error(`- ${d}`));
    process.exit(1);
  }
  console.log("Refactor parity check PASSED");
}

main();
