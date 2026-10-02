import test from "node:test";
import assert from "node:assert/strict";
import {
  analyseEye,
  analyseEyes,
  formatEyeResult,
  isClosedRegionStroke,
  normaliseStrokeWidth,
} from "../js/amsler-engine.js";

const centralLine = {
  tool: "pen",
  points: [
    { x: 0.4, y: 0.5 },
    { x: 0.6, y: 0.5 },
  ],
  normalisedLineWidth: 0.01,
};

const centralMissingRegion = {
  tool: "erase",
  points: [
    { x: 0.4, y: 0.4 },
    { x: 0.6, y: 0.4 },
    { x: 0.6, y: 0.6 },
    { x: 0.4, y: 0.6 },
    { x: 0.4, y: 0.4 },
  ],
  normalisedLineWidth: 0.01,
};

test("unassessed and deliberately clear eyes remain distinct", () => {
  assert.equal(analyseEye([], false).status, "not-assessed");
  assert.equal(analyseEye([], true).status, "clear");

  const results = analyseEyes({ RE: [], LE: [] }, { RE: true, LE: false });
  assert.match(formatEyeResult("RE", results.RE), /No marks recorded/);
  assert.match(formatEyeResult("LE", results.LE), /Not assessed/);
});

test("normalised width is independent of canvas capture size", () => {
  assert.equal(normaliseStrokeWidth(2, 284), normaliseStrokeWidth(4, 568));

  const smallCanvasStroke = {
    ...centralLine,
    normalisedLineWidth: undefined,
    lineWidth: 2,
    gridSizeAtCapture: 284,
  };
  const largeCanvasStroke = {
    ...centralLine,
    normalisedLineWidth: undefined,
    lineWidth: 4,
    gridSizeAtCapture: 568,
  };

  assert.deepEqual(
    analyseEye([smallCanvasStroke], true),
    analyseEye([largeCanvasStroke], true),
  );
});

test("analysis is stable across fixed raster resolutions", () => {
  const lowResolution = analyseEye([centralMissingRegion], true, 200);
  const highResolution = analyseEye([centralMissingRegion], true, 400);

  assert.ok(Math.abs(lowResolution.totalPct - highResolution.totalPct) < 0.25);
  assert.ok(
    Math.abs(lowResolution.centralZonePct - highResolution.centralZonePct) <
      0.5,
  );
  assert.equal(lowResolution.outerZonePct, 0);
  assert.equal(highResolution.outerZonePct, 0);
});

test("central and outer percentages use their own zone denominators", () => {
  const result = analyseEye([centralMissingRegion], true);

  assert.equal(result.status, "marked");
  assert.ok(result.totalPct > 3.5 && result.totalPct < 5);
  assert.ok(result.centralZonePct > 20 && result.centralZonePct < 30);
  assert.equal(result.outerZonePct, 0);
});

test("only explicit closed Missing or Red mark outlines fill their interior", () => {
  assert.equal(isClosedRegionStroke(centralMissingRegion), true);
  assert.equal(
    isClosedRegionStroke({ ...centralMissingRegion, tool: "haemorrhage" }),
    true,
  );
  assert.equal(
    isClosedRegionStroke({ ...centralMissingRegion, tool: "pen" }),
    false,
  );

  const regionResult = analyseEye([centralMissingRegion], true);
  const lineResult = analyseEye(
    [{ ...centralMissingRegion, tool: "pen" }],
    true,
  );
  assert.ok(regionResult.totalPct > lineResult.totalPct * 3);
});

test("overlapping marks are counted once", () => {
  const once = analyseEye([centralLine], true);
  const twice = analyseEye([centralLine, centralLine], true);

  assert.equal(once.totalPct, twice.totalPct);
  assert.equal(once.centralZonePct, twice.centralZonePct);
  assert.equal(once.outerZonePct, twice.outerZonePct);
});

test("malformed marks fail closed without producing a routine result", () => {
  const malformed = analyseEye(
    [{ tool: "erase", points: [{ x: Number.NaN, y: 0.5 }] }],
    false,
  );

  assert.equal(malformed.status, "not-assessed");
  assert.equal(malformed.totalPct, 0);
});
