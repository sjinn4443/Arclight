import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const SOURCE_FILES = [
    "src/field-core.js",
    "src/rules/helpers.js",
    "src/rules/anterior.js",
    "src/rules/chiasmal.js",
    "src/rules/posterior.js",
    "src/rules.js",
    "src/summary.js",
    "src/output-text-rules.js",
    "src/output-lesion-map.js",
    "src/output.js",
    "src/pathway.js",
];

const MCQ_DATA_FILES = [
    "src/mcq-data/core.js",
    "src/mcq-data/library.js",
    "src/mcq-data/sets.js",
    "src/mcq-data.js",
];

const BASE_MODIFIERS = {
    onset: "none",
    neuroFlags: "no",
    knownOldDefect: "no",
    nightVisionPoor: "no",
    flashesCurtain: "no",
    colourFade: "no",
};

function makeContext() {
    const context = {
        console,
        window: {},
        globalThis: null,
        document: {},
        localStorage: {
            getItem() {
                return null;
            },
            setItem() {
                // no-op for QA context
            },
        },
    };
    context.globalThis = context;
    context.window = context;
    return vm.createContext(context);
}

function loadIntoContext(context, relFile) {
    const source = fs.readFileSync(path.join(process.cwd(), relFile), "utf8");
    vm.runInContext(source, context, { filename: relFile });
}

function loadEngine() {
    const context = makeContext();
    SOURCE_FILES.forEach((file) => loadIntoContext(context, file));

    [
        "summarizeCondition",
        "mapConditionToLesionCore",
        "classifySourceAssessment",
        "applyClinicalModifierNotes",
        "detectResultSeverity",
        "isSingleEyePattern",
        "buildRetinaPriorityCondition",
        "getPathwayTargetIds",
    ].forEach((fnName) => {
        if (typeof context[fnName] !== "function") {
            throw new Error(`Missing function: ${fnName}`);
        }
    });

    return context;
}

function loadMcqData() {
    const context = makeContext();
    MCQ_DATA_FILES.forEach((file) => loadIntoContext(context, file));
    if (!context.MCQ_DATA || !context.MCQ_DATA.PATTERNS) {
        throw new Error("MCQ patterns not loaded.");
    }
    return context.MCQ_DATA;
}

function newEye() {
    return { st: "R", sn: "R", it: "R", in: "R", c: "R" };
}

function applyPatternToEye(eye, side, pattern) {
    const losses = pattern[side] || [];
    const suspects = pattern[`${side}Suspect`] || [];

    losses.forEach((point) => {
        eye[point] = "W";
    });
    suspects.forEach((point) => {
        if (eye[point] !== "W") {
            eye[point] = "?";
        }
    });

    const centerState = pattern.center && pattern.center[side];
    if (centerState === "loss") {
        eye.c = "W";
    } else if (centerState === "suspect") {
        eye.c = "?";
    }
}

function buildStateFromPattern(pattern) {
    const right = newEye();
    const left = newEye();
    applyPatternToEye(right, "right", pattern);
    applyPatternToEye(left, "left", pattern);
    return { right, left };
}

function stripHtml(value) {
    return String(value || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function uniqueSorted(values) {
    return [...new Set(values)].sort();
}

function sameSet(actual, expected) {
    const left = uniqueSorted(actual);
    const right = uniqueSorted(expected);
    return left.length === right.length && left.every((value, index) => value === right[index]);
}

function hasAll(actual, expected) {
    const actualSet = new Set(actual);
    return expected.every((id) => actualSet.has(id));
}

function evaluate(ctx, patterns, patternKey, overrides = {}, rapdState = "none") {
    const pattern = patterns[patternKey];
    if (!pattern && patternKey !== "normal") {
        throw new Error(`Missing pattern: ${patternKey}`);
    }

    const modifiers = { ...BASE_MODIFIERS, ...overrides };
    const state =
        patternKey === "normal"
            ? { right: newEye(), left: newEye() }
            : buildStateFromPattern(pattern);
    const conditionHtmlRaw = ctx.summarizeCondition(state);
    const conditionHtml =
        conditionHtmlRaw === "Condition not identified"
            ? "<em>Normal</em> <strong>Full Fields of Vision</strong>"
            : conditionHtmlRaw;
    const primaryCondition = String(conditionHtml).split("<br")[0];
    const sourceAssessment = ctx.classifySourceAssessment(
        primaryCondition,
        rapdState,
        modifiers
    );
    const baseLesion = ctx.mapConditionToLesionCore(primaryCondition, rapdState);
    let lesionSeed = baseLesion;
    if (
        sourceAssessment.category === "retina_likely" &&
        ctx.isSingleEyePattern(primaryCondition)
    ) {
        lesionSeed = "Likely retinal source.";
    }
    const lesionText = ctx.applyClinicalModifierNotes(lesionSeed, modifiers, primaryCondition);
    const severity = ctx.detectResultSeverity(primaryCondition, lesionText, modifiers);
    const targetIds = ctx.getPathwayTargetIds(
        primaryCondition,
        lesionText,
        rapdState,
        sourceAssessment
    );
    const retinaPriorityHeadline =
        modifiers.flashesCurtain === "yes" &&
        sourceAssessment.category === "retina_likely" &&
        ctx.isSingleEyePattern(primaryCondition);
    const displayCondition = retinaPriorityHeadline
        ? ctx.buildRetinaPriorityCondition(conditionHtml, "advanced")
        : conditionHtml;

    return {
        patternKey,
        modifiers,
        rapdState,
        primary: stripHtml(primaryCondition),
        display: stripHtml(displayCondition),
        lesion: stripHtml(lesionText),
        severity,
        source: sourceAssessment,
        targets: uniqueSorted(targetIds),
    };
}

function assertCase(issues, rows, name, actual, checks) {
    const failures = [];

    if (checks.severity && actual.severity !== checks.severity) {
        failures.push(`severity expected ${checks.severity}, got ${actual.severity}`);
    }
    if (checks.category && actual.source.category !== checks.category) {
        failures.push(`source expected ${checks.category}, got ${actual.source.category}`);
    }
    if (checks.side && actual.source.side !== checks.side) {
        failures.push(`side expected ${checks.side}, got ${actual.source.side}`);
    }
    if (checks.targets && !sameSet(actual.targets, checks.targets)) {
        failures.push(`targets expected ${checks.targets.join(",")}, got ${actual.targets.join(",")}`);
    }
    if (checks.hasTargets && !hasAll(actual.targets, checks.hasTargets)) {
        failures.push(
            `targets missing ${checks.hasTargets.join(",")} from ${actual.targets.join(",")}`
        );
    }
    if (checks.sameTargetsAs && !sameSet(actual.targets, checks.sameTargetsAs.targets)) {
        failures.push(
            `targets changed from ${checks.sameTargetsAs.targets.join(",")} to ${actual.targets.join(",")}`
        );
    }
    if (checks.includes && !checks.includes.every((text) => actual.lesion.includes(text))) {
        const missing = checks.includes.filter((text) => !actual.lesion.includes(text));
        failures.push(`lesion missing text: ${missing.join(" | ")}`);
    }
    if (checks.displayIncludes && !actual.display.includes(checks.displayIncludes)) {
        failures.push(`display missing text: ${checks.displayIncludes}`);
    }
    if (checks.displayExcludes && actual.display.includes(checks.displayExcludes)) {
        failures.push(`display should not include: ${checks.displayExcludes}`);
    }

    rows.push({
        name,
        ok: failures.length === 0,
        pattern: actual.patternKey,
        rapd: actual.rapdState,
        modifiers: Object.entries(actual.modifiers)
            .filter(([, value]) => value !== "no" && value !== "none")
            .map(([key, value]) => `${key}=${value}`)
            .join(", ") || "base",
        primary: actual.primary,
        display: actual.display,
        lesion: actual.lesion,
        source: `${actual.source.category}/${actual.source.side}/${actual.source.confidence}`,
        severity: actual.severity,
        targets: actual.targets.join(", "),
        failures,
    });

    failures.forEach((failure) => issues.push(`[${name}] ${failure}`));
}

function runAudit() {
    const ctx = loadEngine();
    const data = loadMcqData();
    const patterns = data.PATTERNS;
    const issues = [];
    const rows = [];

    const leftHomBase = evaluate(ctx, patterns, "leftHom");
    const biTempBase = evaluate(ctx, patterns, "biTemp");

    const cases = [
        {
            name: "stroke/HA raises urgency without moving posterior pattern",
            actual: evaluate(ctx, patterns, "leftHom", { neuroFlags: "yes" }),
            checks: {
                severity: "urgent",
                category: "posterior",
                sameTargetsAs: leftHomBase,
                includes: ["Neuro red flags"],
            },
        },
        {
            name: "flash/curtain raises urgency without moving posterior pattern",
            actual: evaluate(ctx, patterns, "leftHom", { flashesCurtain: "yes" }),
            checks: {
                severity: "urgent",
                category: "posterior",
                sameTargetsAs: leftHomBase,
                includes: ["Flashes/curtain"],
                displayExcludes: "retinal detachment",
            },
        },
        {
            name: "old known adds record note without changing pathway",
            actual: evaluate(ctx, patterns, "leftHom", { knownOldDefect: "yes" }),
            checks: {
                severity: "caution",
                category: "posterior",
                sameTargetsAs: leftHomBase,
                includes: ["Old known defect"],
            },
        },
        {
            name: "gradual adds history note without changing pathway",
            actual: evaluate(ctx, patterns, "leftHom", { onset: "gradual" }),
            checks: {
                severity: "caution",
                category: "posterior",
                sameTargetsAs: leftHomBase,
                includes: ["Gradual onset"],
            },
        },
        {
            name: "sudden monocular loss without RAPD points to retina",
            actual: evaluate(ctx, patterns, "monoR", { onset: "sudden" }),
            checks: {
                severity: "urgent",
                category: "retina_likely",
                side: "right",
                targets: ["part-retina-right"],
                includes: ["Sudden onset"],
            },
        },
        {
            name: "sudden monocular loss with matching RAPD points to optic nerve",
            actual: evaluate(ctx, patterns, "monoR", { onset: "sudden" }, "right"),
            checks: {
                severity: "urgent",
                category: "optic_nerve_likely",
                side: "right",
                targets: ["part-nerve-right"],
                includes: ["Sudden onset"],
            },
        },
        {
            name: "flash/curtain single-eye pattern becomes retinal-detachment headline",
            actual: evaluate(ctx, patterns, "monoR", { flashesCurtain: "yes" }),
            checks: {
                severity: "urgent",
                category: "retina_likely",
                side: "right",
                targets: ["part-retina-right"],
                includes: ["Flashes/curtain"],
                displayIncludes: "Right eye retinal detachment",
            },
        },
        {
            name: "colour fade central scotoma points to optic nerve",
            actual: evaluate(ctx, patterns, "teachMonocularCentralScotoma", { colourFade: "yes" }),
            checks: {
                severity: "caution",
                category: "optic_nerve_likely",
                side: "right",
                targets: ["part-nerve-right"],
                includes: ["Colour fade"],
            },
        },
        {
            name: "night vision in tunnel pattern points to retinal degeneration",
            actual: evaluate(ctx, patterns, "teachTunnelVision", { nightVisionPoor: "yes" }),
            checks: {
                severity: "caution",
                category: "retina_likely",
                targets: ["part-retina-right", "part-retina-left"],
                includes: ["Night vision poor"],
            },
        },
        {
            name: "colour fade in tunnel pattern points to optic nerve",
            actual: evaluate(ctx, patterns, "teachTunnelVision", { colourFade: "yes" }),
            checks: {
                severity: "caution",
                category: "optic_nerve_likely",
                targets: ["part-nerve-right", "part-nerve-left"],
                includes: ["Colour fade"],
            },
        },
        {
            name: "RAPD mismatch keeps anterior source mixed",
            actual: evaluate(ctx, patterns, "monoR", {}, "left"),
            checks: {
                severity: "caution",
                category: "anterior_mixed",
                side: "right",
                targets: ["part-nerve-right", "part-retina-right"],
            },
        },
        {
            name: "RAPD support in homonymous pattern narrows to tract",
            actual: evaluate(ctx, patterns, "leftHom", {}, "left"),
            checks: {
                severity: "caution",
                category: "posterior",
                side: "left",
                targets: ["part-tract-right"],
            },
        },
        {
            name: "chiasmal pattern resists colour-fade relocalisation",
            actual: evaluate(ctx, patterns, "biTemp", { colourFade: "yes" }),
            checks: {
                severity: "caution",
                category: "chiasmal",
                sameTargetsAs: biTempBase,
                includes: ["Colour fade"],
            },
        },
        {
            name: "normal fields with flash/curtain still show urgent context",
            actual: evaluate(ctx, patterns, "normal", { flashesCurtain: "yes" }),
            checks: {
                severity: "urgent",
                category: "unknown",
                targets: [],
                includes: ["Flashes/curtain"],
                displayIncludes: "Full Fields of Vision",
            },
        },
    ];

    cases.forEach((testCase) => {
        assertCase(issues, rows, testCase.name, testCase.actual, testCase.checks);
    });

    const lines = [];
    lines.push("Context Modifier QA Report");
    lines.push("==========================");
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push("");
    lines.push("Scope");
    lines.push("-----");
    lines.push("- Checks that onset, stroke/HA, old known, night vision, flash/curtain and colour fade alter only the intended output layer.");
    lines.push("- Verifies severity, likely source category and visual pathway target IDs for representative anterior, chiasmal, posterior and normal-field cases.");
    lines.push("");
    lines.push("Result");
    lines.push("------");
    lines.push(`- Cases: ${rows.length}`);
    lines.push(`- Issues: ${issues.length}`);
    lines.push(`- Overall: ${issues.length === 0 ? "PASS" : "FAIL"}`);
    lines.push("");
    lines.push("Matrix");
    lines.push("------");
    rows.forEach((row) => {
        lines.push(`- ${row.ok ? "OK" : "FAIL"} | ${row.name}`);
        lines.push(`  Pattern: ${row.pattern} | RAPD: ${row.rapd} | Modifiers: ${row.modifiers}`);
        lines.push(`  Primary: ${row.primary}`);
        lines.push(`  Display: ${row.display}`);
        lines.push(`  Source: ${row.source} | Severity: ${row.severity}`);
        lines.push(`  Targets: ${row.targets || "(none)"}`);
        if (row.failures.length) {
            lines.push(`  Failures: ${row.failures.join("; ")}`);
        }
    });

    if (issues.length) {
        lines.push("");
        lines.push("Issues");
        lines.push("------");
        issues.forEach((issue) => lines.push(`- ${issue}`));
    }

    fs.writeFileSync(
        path.join(process.cwd(), "context-modifier-audit-report.txt"),
        `${lines.join("\n")}\n`,
        "utf8"
    );

    return { issues: issues.length };
}

const result = runAudit();
if (result.issues > 0) {
    process.exitCode = 1;
}
