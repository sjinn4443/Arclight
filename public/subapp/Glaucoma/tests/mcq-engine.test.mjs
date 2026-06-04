import assert from 'node:assert/strict'

import {
  evaluateMcqAnswers,
  markLevelComplete,
  normalizeProgress,
  shuffleArray
} from '../src/mcq-engine.js'

const demoQuestions = [
  { answerIndex: 1 },
  { answerIndex: 0 },
  { answerIndex: 2 }
]

function runMcqEngineTests() {
  const incomplete = evaluateMcqAnswers({
    questions: demoQuestions,
    selectedAnswers: [1, null, 2],
    allowUnanswered: false
  })
  assert.equal(incomplete.isComplete, false)

  const complete = evaluateMcqAnswers({
    questions: demoQuestions,
    selectedAnswers: [1, 0, 1],
    allowUnanswered: false
  })
  assert.equal(complete.isComplete, true)
  assert.equal(complete.score, 2)
  assert.equal(complete.total, 3)

  const emptyStringAnswer = evaluateMcqAnswers({
    questions: demoQuestions,
    selectedAnswers: [1, '', 2],
    allowUnanswered: false
  })
  assert.equal(emptyStringAnswer.isComplete, false)

  const timedSubmission = evaluateMcqAnswers({
    questions: demoQuestions,
    selectedAnswers: [1, null, 2],
    allowUnanswered: true
  })
  assert.equal(timedSubmission.isComplete, true)
  assert.equal(timedSubmission.score, 2)

  const normalized = normalizeProgress(
    { unlockedLevelIndex: 22, completedLevels: [0, 2, 2, -1, 9] },
    3
  )
  assert.deepEqual(normalized, { unlockedLevelIndex: 2, completedLevels: [0, 2] })

  const progressed = markLevelComplete(
    { unlockedLevelIndex: 0, completedLevels: [] },
    0,
    3
  )
  assert.deepEqual(progressed, { unlockedLevelIndex: 1, completedLevels: [0] })

  const shuffled = shuffleArray([1, 2, 3, 4], () => 0.5)
  assert.equal(shuffled.length, 4)
  assert.deepEqual([...shuffled].sort((a, b) => a - b), [1, 2, 3, 4])

  const boundedShuffle = shuffleArray([1, 2, 3], () => 1)
  assert.equal(boundedShuffle.length, 3)
  assert.deepEqual([...boundedShuffle].sort((a, b) => a - b), [1, 2, 3])

  const badLevelCountProgress = markLevelComplete(
    { unlockedLevelIndex: 0, completedLevels: [] },
    0,
    undefined
  )
  assert.deepEqual(badLevelCountProgress, { unlockedLevelIndex: 0, completedLevels: [0] })
}

export { runMcqEngineTests }
