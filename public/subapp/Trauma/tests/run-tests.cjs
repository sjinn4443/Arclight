const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const engine = require("../scoring-engine.js");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const scriptSource = read("script.js");

function readMcqData() {
  const start = scriptSource.indexOf("const MCQ_SOURCE_REFERENCES = ");
  const end = scriptSource.indexOf("// DOM REFERENCES");
  assert.ok(
    start >= 0 && end > start,
    "MCQ bank must remain readable by the contract test",
  );
  return Function(
    `"use strict"; ${scriptSource.slice(start, end)}; return { MCQ_LEVELS, MCQ_SOURCE_REFERENCES };`,
  )();
}

const defaultScore = engine.calculateScore(4, []);
assert.equal(defaultScore.finalScore, 100);
assert.equal(defaultScore.category, 5);
assert.deepEqual(defaultScore.outcomes, [0, 1, 2, 5, 92]);
assert.equal(engine.calculateScore(2, [0, 4]).finalScore, 47);
assert.equal(engine.calculateScore(2, [0, 4]).category, 2);
for (const [score, category] of [
  [44, 1],
  [45, 2],
  [65, 2],
  [66, 3],
  [80, 3],
  [81, 4],
  [91, 4],
  [92, 5],
])
  assert.equal(engine.getCategoryInfo(score).category, category);

const html = read("index.html");
const shellSource = read("shell-controller.js");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length);
const refs = [
  ...html.matchAll(
    /\b(?:aria-controls|aria-labelledby|aria-describedby)="([^"]+)"/g,
  ),
].flatMap((match) => match[1].split(/\s+/));
assert.deepEqual(
  refs.filter((reference) => !ids.includes(reference)),
  [],
);
assert.doesNotMatch(html, /fonts\.googleapis|fonts\.gstatic|font-awesome/i);
for (const field of engine.optionalFields)
  assert.ok(fs.existsSync(path.join(root, field.photoUrl)));
assert.match(read("sw.js"), /arclight-trauma-/);
assert.match(read("sw.js"), /\.\/shell-controller\.js\?v=20260726-refactor1/);
assert.match(
  html,
  /<script src="shell-controller\.js\?v=20260726-refactor1"><\/script>/,
);
assert.doesNotMatch(html, /function setModalState|function setSidebarState/);
assert.match(shellSource, /function setModalState/);
assert.match(shellSource, /function setSidebarState/);
assert.match(shellSource, /event\.key === 'Escape'/);
assert.match(shellSource, /event\.key !== 'Tab'/);
assert.match(read("script.js"), /TraumaScoring\.calculateScore/);
assert.match(read("script.js"), /placeholder\.textContent = 'Select'/);
assert.match(read("script.js"), /Choose a VA category to calculate\./);
assert.doesNotMatch(
  read("script.js"),
  /Select presenting VA to calculate a result\./,
);
assert.match(read("script.js"), /renderUnassessedState/);
assert.match(read("script.js"), /classList\.add\('is-unassessed'\)/);
assert.match(read("script.js"), /classList\.remove\('is-unassessed'\)/);
assert.match(read("styles.css"), /#scoreDisplay\.is-unassessed/);
assert.doesNotMatch(read("script.js"), /acuitySelect\.selectedIndex = 4/);
assert.match(html, /resetCaseButton/);
const { MCQ_LEVELS: mcqLevels, MCQ_SOURCE_REFERENCES: mcqSources } =
  readMcqData();
assert.deepEqual(
  mcqLevels.map((level) => level.name),
  ["Primary", "Intermediate", "Advanced"],
);
const mcqIds = [];
for (const level of mcqLevels) {
  assert.ok(
    level.questions.length > level.questionCount,
    `${level.name} needs retry variation`,
  );
  assert.ok(
    level.passCount > level.questionCount / 2,
    `${level.name} pass mark must require a majority`,
  );
  const prompts = level.questions.map((question) =>
    question.prompt.trim().toLowerCase(),
  );
  assert.equal(
    new Set(prompts).size,
    prompts.length,
    `${level.name} contains a duplicate prompt`,
  );
  for (const question of level.questions) {
    assert.equal(
      question.choices.length,
      4,
      `${level.name}: ${question.prompt}`,
    );
    assert.equal(
      new Set(question.choices).size,
      question.choices.length,
      `${level.name}: duplicate option`,
    );
    assert.ok(
      question.answerIndex >= 0 &&
        question.answerIndex < question.choices.length,
      `${level.name}: invalid answer`,
    );
    assert.match(question.id, /^trauma-(primary|intermediate|advanced)-\d{2}$/);
    assert.ok(
      question.explanation.length >= 40,
      `${question.id}: short explanation`,
    );
    assert.ok(mcqSources[question.source], `${question.id}: unknown source`);
    assert.equal(question.reviewStatus, mcqSources[question.source].status);
    mcqIds.push(question.id);
  }
}
assert.equal(new Set(mcqIds).size, mcqIds.length);
assert.match(scriptSource, /Why: \$\{question\.explanation\}/);
assert.match(scriptSource, /Source: \$\{sourceMeta\?\.label/);
assert.match(
  scriptSource,
  /newMcqButton\.textContent = passed \? 'New attempt' : 'Try again'/,
);
assert.match(scriptSource, /firstUnanswered/);
assert.doesNotMatch(scriptSource, /Open the info screen/);
assert.ok(
  html.indexOf('id="mcqResult"') < html.indexOf('id="submitMcqButton"'),
);
assert.match(html, /styles\.css\?v=20260928-ui1/);
assert.match(html, /script\.js\?v=20260929-ots1/);
assert.equal(engine.acuityMap[engine.VISUAL_SYSTEM][2].name, "0.3/60 to <6/60");
assert.equal(engine.OUTCOME_LABELS[2], "0.3/60 to <6/60");
assert.doesNotMatch(scriptSource, /blunt or penetrating|['"]1\/60 to/);
assert.match(html, /does not determine treatment urgency/);
for (let va = 0; va < 5; va += 1) {
  for (let mask = 0; mask < 32; mask += 1) {
    const selected = [0, 1, 2, 3, 4].filter((i) => mask & (1 << i));
    const result = engine.calculateScore(va, selected);
    assert.equal(
      result.finalScore,
      60 +
        va * 10 +
        selected.reduce((sum, i) => sum + [-23, -17, -14, -11, -10][i], 0),
    );
    assert.equal(
      result.outcomes.reduce((sum, value) => sum + value, 0),
      100,
    );
  }
}
console.log("All tests passed.");
