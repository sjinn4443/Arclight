import test from "node:test";
import assert from "node:assert/strict";

globalThis.window = globalThis;
await import("../mcq-bank.js");

const bank = globalThis.ALLAN_MCQ_BANK;
const expectedCounts = {
  primary: 15,
  intermediate: 18,
  advanced: 20,
};

test("MCQ bank exposes the expected tiers and question counts", () => {
  assert.deepEqual(Object.keys(bank), Object.keys(expectedCounts));
  Object.entries(expectedCounts).forEach(([tier, count]) => {
    assert.equal(bank[tier].length, count, `${tier} question count`);
  });
});

test("every MCQ has one answer present once among four distinct options", () => {
  const ids = new Set();
  Object.entries(bank).forEach(([tier, questions]) => {
    questions.forEach((question, index) => {
      const label = `${tier} question ${index + 1}`;
      assert.equal(
        question.id,
        `allan-${tier}-${String(index + 1).padStart(2, "0")}`,
        `${label} stable id`,
      );
      assert.equal(ids.has(question.id), false, `${label} unique id`);
      ids.add(question.id);
      assert.equal(typeof question.question, "string", `${label} prompt`);
      assert.equal(question.options.length, 4, `${label} option count`);
      assert.equal(
        new Set(question.options).size,
        4,
        `${label} distinct options`,
      );
      assert.equal(
        question.options.filter((option) => option === question.answer).length,
        1,
        `${label} answer membership`,
      );
      assert.ok(question.explanation?.trim(), `${label} explanation`);
      assert.ok(question.reference?.trim(), `${label} reference`);
      assert.match(
        question.reviewStatus,
        /clinical sign-off pending/i,
        `${label} review status`,
      );
    });
  });
});

test("question prompts are unique across all tiers", () => {
  const prompts = Object.values(bank)
    .flat()
    .map((question) => question.question);
  assert.equal(new Set(prompts).size, prompts.length);
});
