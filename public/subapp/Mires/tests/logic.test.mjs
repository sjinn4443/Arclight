import test from 'node:test';
import assert from 'node:assert/strict';
import { createFixedStepRafScheduler } from '../frame-scheduler.js';
import {
  advanceTrainingLock,
  buildIopBuckets,
  classifyNewtonBand,
  evaluateNewtonSubmission,
  pickLeastUsedBucket,
  sampleBucketValue
} from '../simulator-logic.js';

test('IOP buckets cover the requested range without gaps', () => {
  assert.deepEqual(buildIopBuckets(10, 20, 3), [
    { min: 10, max: 13 },
    { min: 14, max: 17 },
    { min: 18, max: 20 }
  ]);
  assert.equal(pickLeastUsedBucket([2, 0, 1], () => 0.5), 1);
  assert.equal(sampleBucketValue({ min: 20, max: 20 }, 20, () => 0), 20);
});

test('Newton band classification and tolerance scoring remain unchanged', () => {
  assert.equal(classifyNewtonBand(24).id, 'range_21_24');
  assert.deepEqual(evaluateNewtonSubmission(23, 'range_21_24'), {
    errorMmHg: 0,
    isCorrect: true,
    isClose: false
  });
  assert.deepEqual(evaluateNewtonSubmission(23, 'exactly_20'), {
    errorMmHg: 3,
    isCorrect: false,
    isClose: true
  });
});

test('training lock acquires, reveals and decays with the established thresholds', () => {
  const base = {
    isCentered: false,
    isInnerEdgeTouching: false,
    hasUserAdjusted: true,
    lockMs: 650,
    requiredLockMs: 700,
    lockDecayFactor: 0.45,
    centerTolerancePx: 10,
    centerToleranceHoldMultiplier: 1.35,
    innerEdgeTolerancePx: 3.2,
    innerEdgeHoldMultiplier: 1.35,
    dtMs: 100
  };
  assert.deepEqual(advanceTrainingLock({
    ...base,
    centerError: 4,
    edgeError: 1
  }), {
    isCentered: true,
    isInnerEdgeTouching: true,
    isRevealed: true,
    lockMs: 700
  });
  assert.equal(advanceTrainingLock({
    ...base,
    centerError: 14,
    edgeError: 5
  }).lockMs, 605);
});

test('RAF scheduler steps at 100 ms, pauses while hidden and cleans up', () => {
  let queuedFrame = null;
  let cancelled = null;
  let hidden = false;
  const steps = [];
  const scheduler = createFixedStepRafScheduler({
    step: (dt) => steps.push(dt),
    intervalMs: 100,
    requestFrame: (callback) => {
      queuedFrame = callback;
      return 7;
    },
    cancelFrame: (id) => { cancelled = id; },
    isPaused: () => hidden
  });

  scheduler.start();
  queuedFrame(0);
  queuedFrame(50);
  queuedFrame(100);
  assert.deepEqual(steps, [100]);
  hidden = true;
  queuedFrame(250);
  assert.deepEqual(steps, [100]);
  hidden = false;
  queuedFrame(300);
  queuedFrame(400);
  assert.deepEqual(steps, [100, 100]);
  scheduler.stop();
  assert.equal(cancelled, 7);
  assert.equal(scheduler.isRunning(), false);
});
