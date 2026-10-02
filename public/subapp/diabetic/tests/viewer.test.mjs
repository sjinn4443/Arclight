import assert from 'node:assert/strict';
import test from 'node:test';
import {
  clampCircleToBounds,
  computeDrawGeometry,
  computeReflexOpacity,
  computeViewerBounds
} from '../src/viewer-math.js';

test('viewer draw geometry preserves scaling, offsets and eye mirroring', () => {
  const base = {
    canvasWidth: 360,
    canvasHeight: 360,
    imageNaturalWidth: 1000,
    imageNaturalHeight: 1000,
    imageScale: 1,
    zoomFactor: 2,
    bgOffsetX: 5,
    bgOffsetY: -4,
    circleRadius: 100,
    circleX: 120
  };
  const right = computeDrawGeometry({ ...base, isRightEye: true });
  const left = computeDrawGeometry({ ...base, isRightEye: false });
  assert.equal(right.scaleFactor, 0.36);
  assert.equal(right.offsetXPos, -175);
  assert.equal(right.offsetYPos, -184);
  assert.equal(right.effectiveCircleRadius, 72);
  assert.equal(right.flippedCircleX, 120);
  assert.equal(left.flippedCircleX, 240);
});

test('viewer bounds, bounce clamping and dense-cataract opacity remain stable', () => {
  const bounds = computeViewerBounds({
    canvasWidth: 360,
    canvasHeight: 360,
    imageNaturalWidth: 1000,
    imageNaturalHeight: 1000,
    imageScale: 1,
    circleRadius: 100,
    zoomFactor: 2
  });
  assert.deepEqual(bounds, { minX: -108, maxX: 468, minY: -108, maxY: 468 });
  assert.deepEqual(
    clampCircleToBounds({
      circleX: -200,
      circleY: 500,
      velocityX: 10,
      velocityY: -8,
      bounds
    }),
    { circleX: -108, circleY: 468, velocityX: -5, velocityY: 4 }
  );
  assert.equal(computeReflexOpacity({ cataractLevel: 3, darkTint: 0.5, yellowTint: 0 }), 0.3);
});
