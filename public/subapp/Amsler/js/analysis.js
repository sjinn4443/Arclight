import { EYES, GRID_MARGIN } from "./constants.js";
import {
  analyseEyes,
  formatEyeResult,
  getNormalisedStrokeWidth,
  isClosedRegionStroke,
} from "./amsler-engine.js";

export function createAnalysisController(app) {
  const { canvas, ctx, resultText } = app.elements;
  function boundingBox(points) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    points.forEach((point) => {
      if (point.x < minX) {
        minX = point.x;
      }
      if (point.x > maxX) {
        maxX = point.x;
      }
      if (point.y < minY) {
        minY = point.y;
      }
      if (point.y > maxY) {
        maxY = point.y;
      }
    });

    return { minX, maxX, minY, maxY };
  }

  function getCentralZoneRect() {
    const gridWidth = canvas.width - 2 * GRID_MARGIN;
    const gridHeight = canvas.height - 2 * GRID_MARGIN;
    return {
      left: GRID_MARGIN + 0.3 * gridWidth,
      right: GRID_MARGIN + 0.7 * gridWidth,
      top: GRID_MARGIN + 0.3 * gridHeight,
      bottom: GRID_MARGIN + 0.7 * gridHeight,
    };
  }

  function drawZoneHighlights() {
    const gridLeft = GRID_MARGIN;
    const gridTop = GRID_MARGIN;
    const gridWidth = canvas.width - 2 * GRID_MARGIN;
    const gridHeight = canvas.height - 2 * GRID_MARGIN;
    const centralRect = getCentralZoneRect();
    const centralWidth = centralRect.right - centralRect.left;
    const centralHeight = centralRect.bottom - centralRect.top;

    const peripheralFill = app.state.redMode
      ? "rgba(255,175,90,0.18)"
      : "rgba(255,160,70,0.14)";
    const centralFill = app.state.redMode
      ? "rgba(255,120,35,0.28)"
      : "rgba(240,130,35,0.24)";
    const centralBorder = app.state.redMode
      ? "rgba(255,190,110,0.58)"
      : "rgba(198,96,14,0.52)";

    ctx.save();
    ctx.fillStyle = peripheralFill;
    ctx.fillRect(gridLeft, gridTop, gridWidth, gridHeight);

    ctx.fillStyle = centralFill;
    ctx.fillRect(
      centralRect.left,
      centralRect.top,
      centralWidth,
      centralHeight,
    );

    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = centralBorder;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(
      centralRect.left,
      centralRect.top,
      centralWidth,
      centralHeight,
    );
    ctx.restore();
  }

  function analyzeAll() {
    const analysis = analyseEyes(app.state.strokes, app.state.assessedEyes);
    return Object.fromEntries(
      EYES.map((eye) => [
        eye,
        {
          ...analysis[eye],
          text: formatEyeResult(eye, analysis[eye]),
        },
      ]),
    );
  }

  function drawRecordedRegion(strokeObj) {
    if (!isClosedRegionStroke(strokeObj)) {
      return;
    }

    const points = strokeObj.points.map((point) =>
      app.canvasController.toAbs(point),
    );
    if (points.length < 3) {
      return;
    }

    const fillColor =
      strokeObj.tool === "haemorrhage"
        ? "rgba(255,0,0,0.2)"
        : "rgba(128,128,128,0.2)";

    ctx.save();
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeObj.tool === "haemorrhage" ? "#b31218" : "#667085";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let index = 1; index < points.length; index += 1) {
      ctx.lineTo(points[index].x, points[index].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawRecordedMarkBoxes(strokes) {
    const padding = 5;
    const boxColor = app.state.redMode ? "rgba(125,255,125,0.95)" : "#1c9a34";
    const gridSize = Math.max(
      1,
      Math.min(canvas.width - 2 * GRID_MARGIN, canvas.height - 2 * GRID_MARGIN),
    );

    strokes.forEach((strokeObj, index) => {
      const points = strokeObj.points.map((point) =>
        app.canvasController.toAbs(point),
      );
      if (points.length === 0) {
        return;
      }

      const box = boundingBox(points);
      const halfLineWidth =
        (getNormalisedStrokeWidth(strokeObj) * gridSize) / 2;
      const left = box.minX - halfLineWidth - padding;
      const top = box.minY - halfLineWidth - padding;
      const width = Math.max(
        10,
        box.maxX - box.minX + 2 * (halfLineWidth + padding),
      );
      const height = Math.max(
        10,
        box.maxY - box.minY + 2 * (halfLineWidth + padding),
      );

      ctx.save();
      ctx.strokeStyle = boxColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(left, top, width, height);
      ctx.fillStyle = boxColor;
      ctx.font = "bold 20px Inter, Segoe UI, sans-serif";
      ctx.fillText(String(index + 1), left + 12, top - 7);
      ctx.restore();
    });
  }

  function drawMergedDefects() {
    const strokes = app.state.strokes[app.state.currentEye];
    drawZoneHighlights();
    strokes.forEach(drawRecordedRegion);
    drawRecordedMarkBoxes(strokes);
  }

  function analyzeDrawing() {
    if (app.state.isDrawing) return;
    app.invalidateReport();
    app.state.assessedEyes[app.state.currentEye] = true;
    app.state.lastAnalysisResults = analyzeAll();
    app.state.analysisDirty = false;
    app.setReportButtonEnabled(true);

    resultText.innerHTML =
      `${app.state.lastAnalysisResults.RE.text}<br>` +
      `${app.state.lastAnalysisResults.LE.text}`;

    app.canvasController.redraw();
  }

  return {
    analyzeDrawing,
    drawMergedDefects,
  };
}
