import assert from 'node:assert/strict';
import fs from 'node:fs';
import { transposePrescription } from '../src/prescription-logic.js';
import { computePrescriptionCase } from '../src/prescription-engine.js';
import { MCQ_LEVELS, MCQ_SOURCE_REFERENCES } from '../src/mcq-data.js';

const input = { age: 50, context: { health: false, precise: false, vaGood: false, accurate: false }, currentRightEye: { sph: 1, cyl: -0.5, axis: 90 }, currentLeftEye: { sph: 1, cyl: -0.5, axis: 90 }, objectiveRightEye: { sph: 1.5, cyl: -0.75, axis: 95 }, objectiveLeftEye: { sph: 1.5, cyl: -0.75, axis: 95 }, currentAdd: 1.5, objectiveAdd: null };
const first = computePrescriptionCase(input);
assert.deepEqual(computePrescriptionCase(input), first, 'live heuristic must remain deterministic');
assert.deepEqual(transposePrescription({ sph: 1, cyl: -2, axis: 180 }), { sph: -1, cyl: 2, axis: 90 });
const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const headerStyles = fs.readFileSync(new URL('../styles/header.css', import.meta.url), 'utf8');
assert.doesNotMatch(index, /https?:\/\//i, 'runtime must not use a CDN');
assert.doesNotMatch(index, /user-scalable=no|maximum-scale/i, 'viewport zoom must remain available');
assert.match(index, /rel="manifest"/);
assert.match(index, /id="new-case-button"/);
assert.match(index, /id="mcqModal"/);
assert.match(index, /<script src="mcq\.bundle\.js\?v=20261002-host1"><\/script>/);
assert.doesNotMatch(index, /<script[^>]*type="module"/, 'direct-file MCQs must use the generated classic bundle');
assert.match(index, /id="sideMenu"[^>]*aria-hidden="true"[^>]*inert/);
assert.match(headerStyles, /\.appbar-glyph-info\s*\{[\s\S]*?font-size:\s*21px;/);
assert.doesNotMatch(headerStyles, /\.appbar-glyph-info\s*\{[\s\S]*?border:\s*1\.6px\s+solid/);
assert.match(headerStyles, /#info-icon\s*\{[\s\S]*?color:\s*var\(--appbar-accent\);/);
assert.deepEqual(MCQ_LEVELS.map((level) => level.name), ['Primary', 'Intermediate', 'Advanced']);
const mcqIds = [];
MCQ_LEVELS.forEach((level) => {
  assert.ok(level.questions.length > level.questionCount, `${level.name} needs retry variation`);
  assert.ok(level.passScore > level.questionCount / 2, `${level.name} pass mark must require a majority`);
  level.questions.forEach((question) => {
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, question.options.length);
    assert.ok(question.answerIndex >= 0 && question.answerIndex < question.options.length);
    assert.match(question.id, /^refract-(primary|intermediate|advanced)-\d{2}$/);
    assert.ok(question.explanation.length >= 40);
    assert.ok(MCQ_SOURCE_REFERENCES[question.source]);
    assert.equal(question.reviewStatus, MCQ_SOURCE_REFERENCES[question.source].status);
    mcqIds.push(question.id);
  });
});
assert.equal(new Set(mcqIds).size, mcqIds.length);
assert.equal(MCQ_LEVELS[0].questions[2].id, 'refract-primary-03');
assert.equal(MCQ_LEVELS[0].questions[2].source, 'refract-optics-contract-v1');
assert.equal(MCQ_LEVELS[0].questions[8].id, 'refract-primary-09');
assert.equal(MCQ_LEVELS[0].questions[8].source, 'college-routine-eye-examination');
assert.equal(MCQ_LEVELS[2].questions[15].id, 'refract-advanced-16');
assert.equal(MCQ_LEVELS[2].questions[15].source, 'college-routine-eye-examination');
assert.doesNotMatch(
  MCQ_LEVELS.flatMap((level) => level.questions).map((question) => question.prompt).join('\n'),
  /An untouched result should be read as|The output fields are intended to show|The safest interpretation of the Refract output/
);
const mcqController = fs.readFileSync(new URL('../src/mcq-controller.js', import.meta.url), 'utf8');
const shellControls = fs.readFileSync(new URL('../src/ui/shell-controls.js', import.meta.url), 'utf8');
assert.match(shellControls, /sideMenu\.inert = !isOpen/);
assert.match(shellControls, /const focusWasInside = sideMenu\.contains\(document\.activeElement\)/);
assert.match(mcqController, /Why: \$\{question\.explanation\}/);
assert.match(mcqController, /Source: \$\{sourceMeta\?\.label/);
assert.match(mcqController, /retryButton\.textContent = passed \? 'New attempt' : 'Try again'/);
assert.match(mcqController, /firstUnansweredIndex/);
assert.match(mcqController, /modal\.scrollTop = 0/);
assert.ok(index.indexOf('id="mcqResult"') < index.indexOf('id="submitMcqButton"'));
assert.doesNotMatch(
  MCQ_LEVELS.flatMap((level) => level.questions).map((question) => question.prompt).join('\n'),
  /Advanced mode reveals|Exact context setting|Accurate context setting/
);
console.log('MCQ and app contracts passed');
