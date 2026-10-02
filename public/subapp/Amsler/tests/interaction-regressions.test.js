import test from "node:test";
import assert from "node:assert/strict";
import { createCanvasController } from "../js/canvas.js";
import { createAnalysisController } from "../js/analysis.js";
import { createInitialState } from "../js/state.js";

function harness() {
  const labels = [],
    colours = [];
  const ctx = new Proxy(
    {
      fillText: (text) => labels.push(text),
      stroke() {
        colours.push(this.strokeStyle);
      },
    },
    {
      get(target, key) {
        return key in target ? target[key] : () => {};
      },
    },
  );
  let captured = false,
    overlays = 0,
    invalidations = 0;
  const canvas = {
    width: 324,
    height: 324,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 324, height: 324 }),
    setPointerCapture() {
      captured = true;
    },
    hasPointerCapture: () => captured,
    releasePointerCapture() {
      captured = false;
    },
  };
  const app = {
    state: createInitialState(),
    elements: { canvas, ctx, resultText: {} },
    invalidateReport() {
      invalidations++;
    },
    setReportButtonEnabled() {},
    markAnalysisDirty() {
      this.state.analysisDirty = true;
      this.invalidateReport();
    },
    analysisController: {
      drawMergedDefects() {
        overlays++;
      },
    },
  };
  app.canvasController = createCanvasController(app);
  const event = (pointerId = 1) => ({
    pointerId,
    button: 0,
    clientX: 100,
    clientY: 100,
    preventDefault() {},
  });
  return {
    app,
    labels,
    colours,
    event,
    get captured() {
      return captured;
    },
    get overlays() {
      return overlays;
    },
    get invalidations() {
      return invalidations;
    },
  };
}

test("markers swap eye sides and Red mode keeps distortion visible", () => {
  const h = harness();
  h.app.canvasController.redraw();
  assert.deepEqual(h.labels.slice(-4), ["SN", "ST", "IN", "IT"]);
  h.app.state.currentEye = "LE";
  h.app.state.redMode = true;
  h.app.state.strokes.LE = [
    {
      tool: "pen",
      points: [
        { x: 0.2, y: 0.2 },
        { x: 0.3, y: 0.3 },
      ],
      lineWidth: 2,
    },
  ];
  h.app.canvasController.redraw();
  assert.deepEqual(h.labels.slice(-4), ["ST", "SN", "IT", "IN"]);
  assert.equal(h.colours.at(-1), "white");
  h.app.state.strokes.LE[0].tool = "erase";
  h.app.canvasController.redraw();
  assert.equal(h.colours.at(-1), "black");
});

test("captured stroke retains starting eye and ignores other pointers or duplicate endings", () => {
  const h = harness(),
    c = h.app.canvasController;
  c.startDrawing(h.event());
  assert.equal(h.captured, true);
  c.endDrawing(h.event(2));
  assert.equal(h.app.state.isDrawing, true);
  h.app.state.currentEye = "LE";
  c.endDrawing(h.event());
  c.endDrawing(h.event());
  assert.equal(h.app.state.strokes.RE.length, 1);
  assert.equal(h.app.state.strokes.LE.length, 0);
  assert.equal(h.app.state.isDrawing, false);
  assert.equal(h.captured, false);
});

test("redraw restores computed overlays exactly once", () => {
  const h = harness();
  h.app.state.analysisDirty = false;
  h.app.state.lastAnalysisResults = {};
  h.app.canvasController.redraw();
  assert.equal(h.overlays, 1);
});

test("Compute invalidates an older report when the other empty eye is assessed", () => {
  const h = harness();
  const analysis = createAnalysisController(h.app);
  analysis.analyzeDrawing();
  assert.equal(h.app.state.lastAnalysisResults.LE.status, "not-assessed");
  h.app.state.currentEye = "LE";
  analysis.analyzeDrawing();
  assert.equal(h.app.state.lastAnalysisResults.LE.status, "clear");
  assert.equal(h.invalidations, 2);
});
