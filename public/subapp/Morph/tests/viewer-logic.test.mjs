import test from 'node:test';
import assert from 'node:assert/strict';

await import('../viewer-logic.js');
const {
  CATARACT_PRESETS,
  FOV_RADIUS_BY_DEGREE,
  createAnimationLoop,
  getApertureRadius,
  getCataractPreset,
  getCataractPresetIndex,
  getImageGeometry,
  stepCornealJitter
} = globalThis.MorphViewerLogic;

test('viewer geometry preserves field radius limits and image cover scaling', () => {
  assert.equal(getApertureRadius({
    selectedDegree: 45,
    canvasWidth: 360,
    canvasHeight: 300,
    radiusByDegree: FOV_RADIUS_BY_DEGREE
  }), 129);
  const geometry = getImageGeometry({
    naturalWidth: 200,
    naturalHeight: 100,
    canvasWidth: 300,
    canvasHeight: 300,
    imageScale: 1,
    baseScale: 1.2,
    patientOffsetX: 5,
    patientOffsetY: -5
  });
  assert.ok(Math.abs(geometry.x + 205) < 1e-9);
  assert.ok(Math.abs(geometry.y + 35) < 1e-9);
  assert.ok(Math.abs(geometry.width - 720) < 1e-9);
  assert.ok(Math.abs(geometry.height - 360) < 1e-9);
});

test('cataract presets retain four bounded teaching states', () => {
  assert.equal(CATARACT_PRESETS.length, 4);
  assert.deepEqual(CATARACT_PRESETS.map((preset) => preset.label), [
    'None',
    'Slight',
    'Medium',
    'Dense'
  ]);
  assert.equal(getCataractPresetIndex(-20), 0);
  assert.equal(getCataractPresetIndex(20), 3);
  assert.equal(getCataractPreset(2).blurPx, 1.65);
});

test('corneal jitter state advances without scheduling a second draw loop', () => {
  assert.deepEqual(stepCornealJitter({
    offset: { x: 0, y: 0 },
    isDragging: true,
    random: () => 1
  }), { x: 5, y: 5 });
  assert.deepEqual(stepCornealJitter({
    offset: { x: 5, y: -5 },
    isDragging: false
  }), { x: 4.5, y: -4.5 });
});

test('animation loop is idempotent and maintains one queued frame', () => {
  let queued = null;
  let requests = 0;
  let cancelled = null;
  const frames = [];
  const loop = createAnimationLoop({
    onFrame: (now) => frames.push(now),
    requestFrame: (callback) => {
      requests += 1;
      queued = callback;
      return requests;
    },
    cancelFrame: (id) => { cancelled = id; }
  });

  loop.start();
  loop.start();
  assert.equal(requests, 1);
  queued(16);
  assert.deepEqual(frames, [16]);
  assert.equal(requests, 2);
  loop.stop();
  assert.equal(cancelled, 2);
  assert.equal(loop.isRunning(), false);
});
