import test from "node:test";
import assert from "node:assert/strict";
import { createInitialState } from "../js/state.js";
import { MCQ_LEVELS, MCQ_SOURCE_REGISTRY } from "../js/mcq-data.js";

test("new examination state is neutral and report-ineligible", () => {
  const state = createInitialState();
  assert.deepEqual(state.strokes, { RE: [], LE: [] });
  assert.deepEqual(state.assessedEyes, { RE: false, LE: false });
  assert.equal(state.currentEye, "RE");
  assert.equal(state.lastAnalysisResults, null);
  assert.equal(state.analysisDirty, true);
});

test("MCQ levels and authored banks remain intact", () => {
  assert.deepEqual(
    MCQ_LEVELS.map((level) => level.id),
    ["primary", "intermediate", "advanced"],
  );
  for (const level of MCQ_LEVELS) {
    assert.ok(level.questions.length >= level.questionCount);
    const ids = level.questions.map((question) => question.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(
      level.questions.every((question) => question.options.length === 4),
    );
    assert.ok(
      level.questions.every((question) => new Set(question.options).size === 4),
    );
    assert.ok(
      level.questions.every((question) =>
        Number.isInteger(question.answerIndex),
      ),
    );
    assert.ok(
      level.questions.every(
        (question) => question.answerIndex >= 0 && question.answerIndex < 4,
      ),
    );
    assert.ok(
      level.questions.every((question) => question.explanation.length >= 30),
    );
    assert.ok(
      level.questions.every((question) => question.sourceIds.length >= 1),
    );
    assert.ok(
      level.questions.every((question) =>
        question.sourceIds.every((sourceId) => MCQ_SOURCE_REGISTRY[sourceId]),
      ),
    );
    assert.ok(
      level.questions.every(
        (question) =>
          question.reviewStatus === "Independent clinical sign-off pending",
      ),
    );
  }
});

test("MCQ bank contains clinical teaching rather than app mechanics", () => {
  const authoredText = MCQ_LEVELS.flatMap((level) =>
    level.questions.flatMap((question) => [
      question.prompt,
      ...question.options,
    ]),
  ).join(" ");
  assert.doesNotMatch(
    authoredText,
    /\b(?:app|button|screenshot|MCQ|percentage|result area|mark tool)\b/i,
  );
});
