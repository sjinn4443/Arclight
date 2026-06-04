import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

function nowIso() {
    return new Date().toISOString();
}

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
    const filePath = path.join(process.cwd(), relFile);
    const source = fs.readFileSync(filePath, "utf8");
    vm.runInContext(source, context, { filename: relFile });
}

function stripHtml(input) {
    return String(input || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function canonicalLabel(label) {
    return String(label || "")
        .replace(/^Possible\s+/i, "")
        .replace(/^Probable\s+/i, "")
        .replace(/^Definite\s+/i, "")
        .replace(/\s+\(Incongruous\)/i, "")
        .trim()
        .toLowerCase();
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

function collectSvgPartIds() {
    const html = fs.readFileSync(path.join(process.cwd(), "home.html"), "utf8");
    return new Set(
        [...html.matchAll(/\sid="(part-[^"]+)"/g)].map((match) => match[1])
    );
}

function getTeachingPathwayMarks(D, siteKey) {
    const baseMarks = (D.SITES[siteKey] && D.SITES[siteKey].marks) || [];
    const marks = new Set(baseMarks);

    if (siteKey === "leftMeyer") {
        marks.add("part-occipital-left");
        marks.add("part-v1-left");
        marks.add("part-calcarine-lower-left");
    } else if (siteKey === "rightMeyer") {
        marks.add("part-occipital-right");
        marks.add("part-v1-right");
        marks.add("part-calcarine-lower-right");
    } else if (siteKey === "leftParietal") {
        marks.add("part-occipital-left");
        marks.add("part-v1-left");
        marks.add("part-calcarine-upper-left");
    } else if (siteKey === "rightParietal") {
        marks.add("part-occipital-right");
        marks.add("part-v1-right");
        marks.add("part-calcarine-upper-right");
    }

    return [...marks];
}

function runAudit() {
    const dataCtx = makeContext();
    [
        "src/mcq-data/core.js",
        "src/mcq-data/library.js",
        "src/mcq-data/sets.js",
        "src/mcq-data.js",
    ].forEach((f) => loadIntoContext(dataCtx, f));
    const D = dataCtx.window.MCQ_DATA;

    if (!D) {
        throw new Error("MCQ_DATA not found. Ensure src/mcq-data/*.js and src/mcq-data.js are valid and loaded.");
    }

    const engineCtx = makeContext();
    [
        "src/field-core.js",
        "src/rules/helpers.js",
        "src/rules/anterior.js",
        "src/rules/chiasmal.js",
        "src/rules/posterior.js",
        "src/rules.js",
        "src/summary.js",
    ].forEach((f) =>
        loadIntoContext(engineCtx, f)
    );

    const patternKeys = new Set(Object.keys(D.PATTERNS || {}));
    const siteKeys = new Set(Object.keys(D.SITES || {}));
    const svgPartIds = collectSvgPartIds();
    const issues = [];
    let pathwayMarksChecked = 0;

    function checkPathwayMarks(scope, marks) {
        (marks || []).forEach((id) => {
            pathwayMarksChecked += 1;
            if (!svgPartIds.has(id)) {
                issues.push(`[${scope}] pathway SVG part missing: ${id}`);
            }
        });
    }

    function checkTextSet(name, set) {
        const seen = new Set();
        (set || []).forEach((q) => {
            if (seen.has(q.id)) {
                issues.push(`[${name}] duplicate id: ${q.id}`);
            }
            seen.add(q.id);

            const options = q.options || [];
            const optionKeys = new Set(options.map((o) => o.key));
            if (options.length !== 4) {
                issues.push(`[${name}:${q.id}] options count is ${options.length}, expected 4`);
            }
            if (!optionKeys.has(q.answer)) {
                issues.push(`[${name}:${q.id}] answer key '${q.answer}' missing from options`);
            }
        });
    }

    function checkFieldSet(name, set) {
        const seen = new Set();
        (set || []).forEach((q) => {
            if (seen.has(q.id)) {
                issues.push(`[${name}] duplicate id: ${q.id}`);
            }
            seen.add(q.id);

            if (!patternKeys.has(q.stem)) {
                issues.push(`[${name}:${q.id}] stem pattern missing: ${q.stem}`);
            }
            if (!patternKeys.has(q.answer)) {
                issues.push(`[${name}:${q.id}] answer pattern missing: ${q.answer}`);
            }
            if (!Array.isArray(q.opts) || q.opts.length !== 4) {
                issues.push(`[${name}:${q.id}] opts count is ${(q.opts || []).length}, expected 4`);
            }
            (q.opts || []).forEach((opt) => {
                if (!patternKeys.has(opt)) {
                    issues.push(`[${name}:${q.id}] option pattern missing: ${opt}`);
                }
            });
            if (!Array.isArray(q.opts) || !q.opts.includes(q.answer)) {
                issues.push(`[${name}:${q.id}] answer '${q.answer}' is not in opts`);
            }
        });
    }

    function checkPathwaySet(name, set) {
        const seen = new Set();
        (set || []).forEach((q) => {
            if (seen.has(q.id)) {
                issues.push(`[${name}] duplicate id: ${q.id}`);
            }
            seen.add(q.id);

            if (!q.stem || !q.stem.kind || !q.stem.key) {
                issues.push(`[${name}:${q.id}] invalid stem`);
                return;
            }

            if (q.stem.kind === "pattern" && !patternKeys.has(q.stem.key)) {
                issues.push(`[${name}:${q.id}] missing stem pattern: ${q.stem.key}`);
            }
            if (q.stem.kind === "pathway" && !siteKeys.has(q.stem.key)) {
                issues.push(`[${name}:${q.id}] missing stem site: ${q.stem.key}`);
            }

            if (!Array.isArray(q.opts) || q.opts.length !== 4) {
                issues.push(`[${name}:${q.id}] opts count is ${(q.opts || []).length}, expected 4`);
            }

            if (q.optionKind === "pattern") {
                if (!patternKeys.has(q.answer)) {
                    issues.push(`[${name}:${q.id}] missing answer pattern: ${q.answer}`);
                }
                (q.opts || []).forEach((opt) => {
                    if (!patternKeys.has(opt)) {
                        issues.push(`[${name}:${q.id}] missing option pattern: ${opt}`);
                    }
                });
            } else if (q.optionKind === "pathway") {
                if (!siteKeys.has(q.answer)) {
                    issues.push(`[${name}:${q.id}] missing answer site: ${q.answer}`);
                }
                (q.opts || []).forEach((opt) => {
                    if (!siteKeys.has(opt)) {
                        issues.push(`[${name}:${q.id}] missing option site: ${opt}`);
                    }
                });
            } else {
                issues.push(`[${name}:${q.id}] unknown optionKind: ${q.optionKind}`);
            }

            if (!Array.isArray(q.opts) || !q.opts.includes(q.answer)) {
                issues.push(`[${name}:${q.id}] answer '${q.answer}' is not in opts`);
            }
        });
    }

    checkTextSet("TEXT_PRIMARY", D.TEXT_BANK.primary);
    checkTextSet("TEXT_INTERMEDIATE", D.TEXT_BANK.intermediate);
    checkTextSet("TEXT_ADVANCED", D.TEXT_BANK.advanced);

    checkFieldSet("FIELD_PRIMARY", D.FIELD_SPECS_PRIMARY);
    checkFieldSet("FIELD_HIGHER", D.FIELD_SPECS_HIGHER);
    checkFieldSet("FIELD_ADVANCED_EXTRA", D.FIELD_SPECS_ADVANCED_EXTRA);

    checkPathwaySet("PATHWAY_PRIMARY", D.PATHWAY_SPECS_PRIMARY);
    checkPathwaySet("PATHWAY_HIGHER", D.PATHWAY_SPECS_HIGHER);
    checkPathwaySet("PATHWAY_ADVANCED_EXTRA", D.PATHWAY_SPECS_ADVANCED_EXTRA);

    const teachingNumbers = new Set();
    (D.TEACHING_CASES || []).forEach((card) => {
        if (teachingNumbers.has(card.number)) {
            issues.push(`[TEACHING] duplicate card number: ${card.number}`);
        }
        teachingNumbers.add(card.number);

        if (!patternKeys.has(card.pattern)) {
            issues.push(`[TEACHING:${card.number}] missing pattern: ${card.pattern}`);
        }
        if (!siteKeys.has(card.site)) {
            issues.push(`[TEACHING:${card.number}] missing site: ${card.site}`);
        }
    });
    for (let n = 1; n <= 18; n += 1) {
        if (!teachingNumbers.has(n)) {
            issues.push(`[TEACHING] missing card number: ${n}`);
        }
    }

    Object.entries(D.SITES || {}).forEach(([siteKey, site]) => {
        checkPathwayMarks(`SITE:${siteKey}`, site.marks);
    });

    (D.TEACHING_CASES || []).forEach((card) => {
        checkPathwayMarks(
            `TEACHING:${card.number}:${card.site}`,
            getTeachingPathwayMarks(D, card.site)
        );
    });

    // Semantic checks for used pattern stems/answers.
    const patternsToCheck = new Set();
    [
        ...(D.FIELD_SPECS_PRIMARY || []),
        ...(D.FIELD_SPECS_HIGHER || []),
        ...(D.FIELD_SPECS_ADVANCED_EXTRA || []),
    ].forEach((q) => patternsToCheck.add(q.stem));
    [
        ...(D.PATHWAY_SPECS_PRIMARY || []),
        ...(D.PATHWAY_SPECS_HIGHER || []),
        ...(D.PATHWAY_SPECS_ADVANCED_EXTRA || []),
    ].forEach((q) => {
        if (q.stem?.kind === "pattern") {
            patternsToCheck.add(q.stem.key);
        }
        if (q.optionKind === "pattern") {
            patternsToCheck.add(q.answer);
        }
    });
    (D.TEACHING_CASES || []).forEach((card) => patternsToCheck.add(card.pattern));

    const semanticRows = [];
    let semanticMismatchCount = 0;
    [...patternsToCheck].forEach((patternKey) => {
        const pattern = D.PATTERNS[patternKey];
        if (!pattern) return;

        const state = buildStateFromPattern(pattern);
        const summaryHtml = engineCtx.summarizeCondition(state);
        const primary = stripHtml(String(summaryHtml).split("<br")[0]);
        const expected = stripHtml(pattern.names.advanced || patternKey);
        const ok = canonicalLabel(primary).includes(canonicalLabel(expected));
        if (!ok) {
            semanticMismatchCount += 1;
            issues.push(
                `[SEMANTIC:${patternKey}] expected '${expected}', got '${primary}'`
            );
        }
        semanticRows.push({ patternKey, expected, primary, ok });
    });

    const lines = [];
    lines.push("MCQ QA Report");
    lines.push("=============");
    lines.push(`Generated: ${nowIso()}`);
    lines.push("");
    lines.push("Scope");
    lines.push("-----");
    lines.push("- Source: src/mcq-data/core.js, src/mcq-data/library.js, src/mcq-data/sets.js, src/mcq-data.js, home.html");
    lines.push("- Engine sanity: src/field-core.js, src/rules/helpers.js, src/rules/anterior.js, src/rules/chiasmal.js, src/rules/posterior.js, src/rules.js, src/summary.js");
    lines.push("- Checks: structure integrity + semantic pattern classification + pathway SVG mark resolution");
    lines.push("");
    lines.push("Counts");
    lines.push("------");
    lines.push(`- Patterns: ${patternKeys.size}`);
    lines.push(`- Sites: ${siteKeys.size}`);
    lines.push(`- Text MCQs: ${(D.TEXT_BANK.primary || []).length + (D.TEXT_BANK.intermediate || []).length + (D.TEXT_BANK.advanced || []).length}`);
    lines.push(`- Field-loss MCQs: ${(D.FIELD_SPECS_PRIMARY || []).length + (D.FIELD_SPECS_HIGHER || []).length + (D.FIELD_SPECS_ADVANCED_EXTRA || []).length}`);
    lines.push(`- Pathway MCQs: ${(D.PATHWAY_SPECS_PRIMARY || []).length + (D.PATHWAY_SPECS_HIGHER || []).length + (D.PATHWAY_SPECS_ADVANCED_EXTRA || []).length}`);
    lines.push(`- Teaching cards: ${(D.TEACHING_CASES || []).length}`);
    lines.push(`- Semantic patterns audited: ${patternsToCheck.size}`);
    lines.push(`- Pathway SVG IDs: ${svgPartIds.size}`);
    lines.push(`- Pathway marks checked: ${pathwayMarksChecked}`);
    lines.push("");
    lines.push("Result");
    lines.push("------");
    lines.push(`- Total issues: ${issues.length}`);
    lines.push(`- Semantic mismatches: ${semanticMismatchCount}`);
    lines.push(`- Overall: ${issues.length === 0 ? "PASS" : "FAIL"}`);
    lines.push("");
    lines.push("Semantic Matrix");
    lines.push("---------------");
    semanticRows
        .sort((a, b) => a.patternKey.localeCompare(b.patternKey))
        .forEach((row) => {
            lines.push(
                `- ${row.patternKey}: ${row.ok ? "OK" : "MISMATCH"} | expected='${row.expected}' | got='${row.primary}'`
            );
        });

    if (issues.length) {
        lines.push("");
        lines.push("Issues");
        lines.push("------");
        issues.forEach((issue) => lines.push(`- ${issue}`));
    }

    const reportText = `${lines.join("\n")}\n`;
    fs.writeFileSync(path.join(process.cwd(), "mcq-qa-report.txt"), reportText, "utf8");

    return { issues: issues.length, semanticMismatches: semanticMismatchCount };
}

const result = runAudit();
if (result.issues > 0) {
    process.exitCode = 1;
}
