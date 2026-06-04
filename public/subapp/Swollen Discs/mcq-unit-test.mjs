import assert from 'node:assert/strict';

import {
  buildMcqTest,
  evaluateMcqSubmission,
  generatePassCode,
  formatMcqResultText
} from './mcq-engine.mjs';

function sequenceRandom(values) {
  let index = 0;
  return () => {
    const value = values[index % values.length];
    index += 1;
    return value;
  };
}

const sampleBank = [
  {
    question: 'Question one?',
    options: { a: 'One A', b: 'One B', c: 'One C' },
    correct: 'b'
  },
  {
    question: 'Question two?',
    options: { a: 'Two A', b: 'Two B', c: 'Two C' },
    correct: 'c'
  },
  {
    question: 'Question three?',
    options: { a: 'Three A', b: 'Three B', c: 'Three C' },
    correct: 'a'
  }
];

function runBuildTest() {
  const random = sequenceRandom([0.8, 0.1, 0.6, 0.2, 0.9, 0.4, 0.3, 0.7]);
  const built = buildMcqTest(sampleBank, 2, random);

  assert.equal(built.length, 2);
  assert.notEqual(built[0].prompt, built[1].prompt);

  built.forEach((question) => {
    assert.ok(question.correctChoiceId);
    assert.equal(question.choices.length, 3);
    assert.ok(question.choices.some((choice) => choice.id === question.correctChoiceId));
  });

  const easyBuilt = buildMcqTest(sampleBank, 2, random, 2);
  easyBuilt.forEach((question) => {
    assert.equal(question.choices.length, 2);
    assert.ok(question.choices.some((choice) => choice.id === question.correctChoiceId));
  });
}

function runEvaluationTest() {
  const built = buildMcqTest(sampleBank, 2, sequenceRandom([0, 0, 0, 0, 0, 0]));
  const firstQuestion = built[0];
  const secondQuestion = built[1];
  const wrongOnFirst = firstQuestion.choices.find(
    (choice) => choice.id !== firstQuestion.correctChoiceId
  );

  const result = evaluateMcqSubmission(built, [wrongOnFirst.id, secondQuestion.correctChoiceId]);

  assert.equal(result.score, 1);
  assert.equal(result.maxScore, 2);
  assert.equal(result.passThreshold, 2);
  assert.equal(result.passed, false);
  assert.equal(result.details[0].isCorrect, false);
  assert.equal(result.details[1].isCorrect, true);

  const unansweredResult = evaluateMcqSubmission(built, [null, null]);
  assert.equal(unansweredResult.score, 0);
  assert.equal(unansweredResult.details[0].selectedChoiceText, null);
  assert.equal(unansweredResult.details[1].selectedChoiceText, null);
}

function runExportTest() {
  const passCode = generatePassCode(4, () => 0);
  assert.equal(passCode, 'AAAA');

  const text = formatMcqResultText({
    score: 2,
    maxScore: 2,
    passThreshold: 2,
    passed: true,
    passCode,
    completedAt: '2026-02-23T12:30:00.000Z',
    details: [
      {
        index: 0,
        prompt: 'Question one?',
        selectedChoiceText: 'One B',
        correctChoiceText: 'One B',
        isCorrect: true
      }
    ]
  });

  assert.match(text, /Swollen Discs - MCQ Test Result/);
  assert.match(text, /Result: PASS/);
  assert.match(text, /Code: AAAA/);
  assert.match(text, /Question breakdown:/);
  assert.match(text, /Status: Correct/);
}

try {
  runBuildTest();
  runEvaluationTest();
  runExportTest();
  console.log('MCQ unit tests passed.');
} catch (error) {
  console.error(`MCQ unit tests failed: ${error.message}`);
  process.exit(1);
}
