import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = await readFile(resolve(appRoot, "src/output.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(
    `${source}
globalThis.__buildIncomplete = buildIncompleteAssessmentPresentation;
globalThis.__buildUnavailable = buildUnavailableResultPresentation;`,
    context
);

const buildIncomplete = context.__buildIncomplete;
const buildUnavailable = context.__buildUnavailable;

test("incomplete fields remain explicitly unassessed without urgent context", () => {
    const result = buildIncomplete({});
    assert.equal(result.analysisText, "Not assessed");
    assert.equal(result.siteText, "Complete the visual field entry to show a result.");
    assert.equal(result.urgent, false);
});

test("incomplete fields retain every existing urgent context warning", () => {
    const result = buildIncomplete({
        neuroFlags: "yes",
        flashesCurtain: "yes",
        onset: "sudden",
    });
    assert.equal(result.analysisText, "Not assessed");
    assert.equal(result.urgent, true);
    assert.match(result.siteText, /Neuro red flags: urgent neuro review\./);
    assert.match(result.siteText, /Flashes\/curtain: urgent retina review\./);
    assert.match(result.siteText, /Sudden onset: same-day review\./);
});

test("unresolved parsing fails closed instead of producing a normal result", () => {
    const result = buildUnavailable({});
    assert.equal(result.analysisText, "Unable to interpret");
    assert.equal(result.siteText, "Check the field entries and try again.");
    assert.equal(result.urgent, false);
    assert.doesNotMatch(`${result.analysisText} ${result.siteText}`, /normal|full fields/i);
});

test("unresolved parsing still retains urgent context", () => {
    const result = buildUnavailable({ flashesCurtain: "yes" });
    assert.equal(result.analysisText, "Unable to interpret");
    assert.equal(result.urgent, true);
    assert.match(result.siteText, /Flashes\/curtain: urgent retina review\./);
});
