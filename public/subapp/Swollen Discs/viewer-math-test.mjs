import assert from 'node:assert/strict';

import {
  clampCircleToBounds,
  computeDrawGeometry,
  computeReflexOpacity,
  computeViewerBounds
} from './viewer-math.js';

function approxEqual(actual, expected, epsilon = 1e-6) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `Expected ${actual} to be within ${epsilon} of ${expected}`
  );
}

function runDrawGeometryTest() {
  const geometry = computeDrawGeometry({
    canvasWidth: 1000,
    canvasHeight: 500,
    imageNaturalWidth: 1000,
    imageNaturalHeight: 500,
    imageScale: 1,
    zoomFactor: 3,
    bgOffsetX: 20,
    bgOffsetY: -10,
    circleRadius: 120,
    circleX: 350,
    isRightEye: false
  });

  approxEqual(geometry.scaleFactor, 1);
  approxEqual(geometry.drawnImageWidth, 1000);
  approxEqual(geometry.scaledWidth, 3000);
  approxEqual(geometry.scaledHeight, 1500);
  approxEqual(geometry.offsetXPos, -980);
  approxEqual(geometry.offsetYPos, -510);
  approxEqual(geometry.effectiveCircleRadius, 360);
  approxEqual(geometry.flippedCircleX, 650);
}

function runBoundsAndClampTest() {
  const bounds = computeViewerBounds({
    canvasWidth: 1000,
    canvasHeight: 500,
    imageNaturalWidth: 1000,
    imageNaturalHeight: 500,
    circleRadius: 120,
    zoomFactor: 3
  });

  approxEqual(bounds.minX, 360);
  approxEqual(bounds.maxX, 640);
  approxEqual(bounds.minY, 250);
  approxEqual(bounds.maxY, 250);

  const clamped = clampCircleToBounds({
    circleX: 100,
    circleY: 600,
    velocityX: 12,
    velocityY: -6,
    bounds
  });

  approxEqual(clamped.circleX, 360);
  approxEqual(clamped.circleY, 250);
  approxEqual(clamped.velocityX, -6);
  approxEqual(clamped.velocityY, 3);
}

function runOversizedWindowBoundsTest() {
  const bounds = computeViewerBounds({
    canvasWidth: 1000,
    canvasHeight: 500,
    imageNaturalWidth: 1000,
    imageNaturalHeight: 500,
    circleRadius: 240,
    zoomFactor: 3
  });

  approxEqual(bounds.minX, 500);
  approxEqual(bounds.maxX, 500);
  approxEqual(bounds.minY, 250);
  approxEqual(bounds.maxY, 250);

  const clamped = clampCircleToBounds({
    circleX: 500,
    circleY: 250,
    velocityX: 0,
    velocityY: 0,
    bounds
  });

  approxEqual(clamped.circleX, 500);
  approxEqual(clamped.circleY, 250);
}

function runReflexOpacityTest() {
  const clearMediaOpacity = computeReflexOpacity({
    cataractLevel: 0,
    darkTint: 0,
    yellowTint: 0
  });
  approxEqual(clearMediaOpacity, 1);

  const denseOpacity = computeReflexOpacity({
    cataractLevel: 3,
    darkTint: 0.45,
    yellowTint: 0.4
  });
  approxEqual(denseOpacity, 0.3);

  const midOpacity = computeReflexOpacity({
    cataractLevel: 2,
    darkTint: 0.1,
    yellowTint: 0.1
  });
  approxEqual(midOpacity, 0.6);
}

try {
  runDrawGeometryTest();
  runBoundsAndClampTest();
  runOversizedWindowBoundsTest();
  runReflexOpacityTest();
  console.log('Viewer math unit tests passed.');
} catch (error) {
  console.error(`Viewer math unit tests failed: ${error.message}`);
  process.exit(1);
}
