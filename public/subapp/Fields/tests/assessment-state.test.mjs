import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const assessment = require("../src/assessment-state.js");

test("field points start unassessed then follow the established clinical cycle", () => {
    assert.equal(assessment.nextState("unassessed"), "seen");
    assert.equal(assessment.nextState("seen"), "suspect");
    assert.equal(assessment.nextState("suspect"), "absent");
    assert.equal(assessment.nextState("absent"), "seen");
});

test("completion requires all ten points to have an assessed state", () => {
    assert.equal(assessment.isComplete(Array(10).fill("unassessed")), false);
    assert.equal(assessment.isComplete(Array(9).fill("seen")), false);
    assert.equal(assessment.isComplete(Array(10).fill("seen")), true);
    assert.equal(assessment.isComplete(["seen", "suspect", "absent", ...Array(7).fill("seen")]), true);
});

test("completion copy distinguishes untouched and partial assessments", () => {
    assert.equal(assessment.completionLabel(Array(10).fill("unassessed")), "Mark all seen");
    assert.equal(assessment.completionLabel(["suspect", ...Array(9).fill("unassessed")]), "Mark rest seen");
});

test("an abnormal point never completes untested points", () => {
    assert.equal(assessment.shouldCompleteRemaining("unassessed"), false);
    assert.equal(assessment.shouldCompleteRemaining("seen"), false);
    assert.equal(assessment.shouldCompleteRemaining("suspect"), false);
    assert.equal(assessment.shouldCompleteRemaining("absent"), false);
});
