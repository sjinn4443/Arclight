import { GRID_MARGIN, TOOL_STYLES } from "./constants.js";

export function createCanvasController(app) {
  const { canvas, ctx } = app.elements;

  function toAbs(point) {
    return {
      x: GRID_MARGIN + point.x * (canvas.width - 2 * GRID_MARGIN),
      y: GRID_MARGIN + point.y * (canvas.height - 2 * GRID_MARGIN),
    };
  }

  function drawMarkers() {
    ctx.save();
    ctx.fillStyle = "grey";
    ctx.font = "10px Inter, Segoe UI, sans-serif";
    ctx.fillText("SN", GRID_MARGIN - 15, GRID_MARGIN - 5);
    ctx.fillText("ST", canvas.width - GRID_MARGIN + 5, GRID_MARGIN - 5);
    ctx.fillText("IN", GRID_MARGIN - 15, canvas.height - GRID_MARGIN + 15);
    ctx.fillText(
      "IT",
      canvas.width - GRID_MARGIN + 7,
      canvas.height - GRID_MARGIN + 15,
    );
    ctx.restore();
  }

  function drawGrid() {
    const bgColor = app.state.redMode ? "black" : "white";
    const lineColor = app.state.redMode ? "red" : "black";

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(
      GRID_MARGIN,
      GRID_MARGIN,
      canvas.width - 2 * GRID_MARGIN,
      canvas.height - 2 * GRID_MARGIN,
    );

    const cellWidth = (canvas.width - 2 * GRID_MARGIN) / 10;
    const cellHeight = (canvas.height - 2 * GRID_MARGIN) / 10;

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;
    for (let i = 0; i <= 10; i += 1) {
      ctx.beginPath();
      ctx.moveTo(GRID_MARGIN + i * cellWidth, GRID_MARGIN);
      ctx.lineTo(GRID_MARGIN + i * cellWidth, canvas.height - GRID_MARGIN);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(GRID_MARGIN, GRID_MARGIN + i * cellHeight);
      ctx.lineTo(canvas.width - GRID_MARGIN, GRID_MARGIN + i * cellHeight);
      ctx.stroke();
    }

    ctx.lineWidth = 4;
    ctx.strokeRect(
      GRID_MARGIN,
      GRID_MARGIN,
      canvas.width - 2 * GRID_MARGIN,
      canvas.height - 2 * GRID_MARGIN,
    );

    if (app.state.diagMode) {
      ctx.beginPath();
      ctx.moveTo(GRID_MARGIN, GRID_MARGIN);
      ctx.lineTo(canvas.width - GRID_MARGIN, canvas.height - GRID_MARGIN);
      ctx.moveTo(canvas.width - GRID_MARGIN, GRID_MARGIN);
      ctx.lineTo(GRID_MARGIN, canvas.height - GRID_MARGIN);
      ctx.lineWidth = 3;
      ctx.strokeStyle = lineColor;
      ctx.stroke();
    }
  }

  function drawFixationDot() {
    if (app.state.flashDot && !app.state.dotVisible) {
      return;
    }

    const dotRadius = 10;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.save();
    ctx.fillStyle = app.state.redMode ? "red" : "black";
    ctx.beginPath();
    ctx.arc(centerX, centerY, dotRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  function getStrokeLineWidth(tool) {
    if (tool === "pen") {
      return app.state.penLineWidth ?? TOOL_STYLES.pen.lineWidth;
    }
    return TOOL_STYLES[tool].lineWidth;
  }

  function drawStroke(points, tool, lineWidth) {
    if (!points || points.length === 0) {
      return;
    }

    const style = TOOL_STYLES[tool];
    ctx.save();
    ctx.strokeStyle = style.strokeStyle;
    ctx.lineWidth = lineWidth ?? style.lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();

    points.forEach((point, index) => {
      const absPoint = toAbs(point);
      if (index === 0) {
        ctx.moveTo(absPoint.x, absPoint.y);
      } else {
        ctx.lineTo(absPoint.x, absPoint.y);
      }
    });

    ctx.stroke();
    ctx.restore();
  }

  function redraw() {
    drawGrid();

    app.state.strokes[app.state.currentEye].forEach((strokeObj) => {
      drawStroke(strokeObj.points, strokeObj.tool, strokeObj.lineWidth);
    });

    if (app.state.currentStroke) {
      const currentLineWidth = getStrokeLineWidth(app.state.currentTool);
      drawStroke(
        app.state.currentStroke,
        app.state.currentTool,
        currentLineWidth,
      );
    }

    drawFixationDot();
    drawMarkers();
  }

  function getPointerPos(event) {
    const rect = canvas.getBoundingClientRect();
    let x;
    let y;

    if (event.touches && event.touches.length > 0) {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    } else {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    }

    const scaleX = rect.width > 0 ? canvas.width / rect.width : 1;
    const scaleY = rect.height > 0 ? canvas.height / rect.height : 1;
    x *= scaleX;
    y *= scaleY;

    let nx = (x - GRID_MARGIN) / (canvas.width - 2 * GRID_MARGIN);
    let ny = (y - GRID_MARGIN) / (canvas.height - 2 * GRID_MARGIN);
    nx = Math.max(0, Math.min(1, nx));
    ny = Math.max(0, Math.min(1, ny));

    return { x: nx, y: ny };
  }

  function startDrawing(event) {
    app.state.isDrawing = true;
    app.state.currentStroke = [getPointerPos(event)];
    event.preventDefault();
  }

  function draw(event) {
    if (!app.state.isDrawing) {
      return;
    }

    app.state.currentStroke.push(getPointerPos(event));
    redraw();
    event.preventDefault();
  }

  function endDrawing(event) {
    if (app.state.isDrawing) {
      const lineWidth = getStrokeLineWidth(app.state.currentTool);
      app.state.strokes[app.state.currentEye].push({
        points: app.state.currentStroke,
        tool: app.state.currentTool,
        lineWidth,
      });
      app.markAnalysisDirty();
      app.state.currentStroke = null;
      app.state.isDrawing = false;
      redraw();
    }
    event.preventDefault();
  }

  function resizeCanvas() {
    const size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.6);
    canvas.width = size;
    canvas.height = size;
    redraw();
  }

  return {
    toAbs,
    redraw,
    startDrawing,
    draw,
    endDrawing,
    resizeCanvas,
  };
}
