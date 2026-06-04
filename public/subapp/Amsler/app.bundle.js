"use strict";
(() => {
  // js/constants.js
  var GRID_MARGIN = 20;
  var EYES = Object.freeze(["RE", "LE"]);
  var TOOL_STYLES = Object.freeze({
    pen: { strokeStyle: "black", lineWidth: 2 },
    erase: { strokeStyle: "white", lineWidth: 8 },
    haemorrhage: { strokeStyle: "red", lineWidth: 8 },
  });

  // js/canvas.js
  function createCanvasController(app2) {
    const { canvas, ctx } = app2.elements;
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
      const bgColor = app2.state.redMode ? "black" : "white";
      const lineColor = app2.state.redMode ? "red" : "black";
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
      if (app2.state.diagMode) {
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
      if (app2.state.flashDot && !app2.state.dotVisible) {
        return;
      }
      const dotRadius = 10;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.save();
      ctx.fillStyle = app2.state.redMode ? "red" : "black";
      ctx.beginPath();
      ctx.arc(centerX, centerY, dotRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }
    function getStrokeLineWidth(tool) {
      var _a;
      if (tool === "pen") {
        return (_a = app2.state.penLineWidth) != null
          ? _a
          : TOOL_STYLES.pen.lineWidth;
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
      ctx.lineWidth = lineWidth != null ? lineWidth : style.lineWidth;
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
      app2.state.strokes[app2.state.currentEye].forEach((strokeObj) => {
        drawStroke(strokeObj.points, strokeObj.tool, strokeObj.lineWidth);
      });
      if (app2.state.currentStroke) {
        const currentLineWidth = getStrokeLineWidth(app2.state.currentTool);
        drawStroke(
          app2.state.currentStroke,
          app2.state.currentTool,
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
      app2.state.isDrawing = true;
      app2.state.currentStroke = [getPointerPos(event)];
      event.preventDefault();
    }
    function draw(event) {
      if (!app2.state.isDrawing) {
        return;
      }
      app2.state.currentStroke.push(getPointerPos(event));
      redraw();
      event.preventDefault();
    }
    function endDrawing(event) {
      if (app2.state.isDrawing) {
        const lineWidth = getStrokeLineWidth(app2.state.currentTool);
        app2.state.strokes[app2.state.currentEye].push({
          points: app2.state.currentStroke,
          tool: app2.state.currentTool,
          lineWidth,
        });
        app2.markAnalysisDirty();
        app2.state.currentStroke = null;
        app2.state.isDrawing = false;
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

  // js/analysis.js
  function createAnalysisController(app2) {
    const { canvas, ctx, resultText } = app2.elements;
    const PEN_DARK_BBOX_DENSITY_THRESHOLD = 0.3;
    const PEN_DARK_HULL_FILL_THRESHOLD = 0.38;
    const PEN_WAVY_ASPECT_RATIO_THRESHOLD = 4;
    const PEN_ENCLOSED_HULL_FILL_THRESHOLD = 0.58;
    const PEN_ENCLOSED_ASPECT_RATIO_MAX = 2.8;
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
    function boxesOverlap(box1, box2) {
      return !(
        box1.maxX < box2.minX ||
        box1.minX > box2.maxX ||
        box1.maxY < box2.minY ||
        box1.minY > box2.maxY
      );
    }
    function cross(origin, a, b) {
      return (
        (a.x - origin.x) * (b.y - origin.y) -
        (a.y - origin.y) * (b.x - origin.x)
      );
    }
    function convexHull(points) {
      if (points.length <= 1) {
        return points.slice();
      }
      const sortedPoints = points
        .slice()
        .sort((a, b) => a.x - b.x || a.y - b.y);
      const lower = [];
      const upper = [];
      sortedPoints.forEach((point) => {
        while (
          lower.length >= 2 &&
          cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0
        ) {
          lower.pop();
        }
        lower.push(point);
      });
      for (let index = sortedPoints.length - 1; index >= 0; index -= 1) {
        const point = sortedPoints[index];
        while (
          upper.length >= 2 &&
          cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0
        ) {
          upper.pop();
        }
        upper.push(point);
      }
      lower.pop();
      upper.pop();
      return lower.concat(upper);
    }
    function mergeDefectData(defect1, defect2) {
      var _a, _b, _c, _d;
      const allPoints = defect1.points.concat(defect2.points);
      return {
        points: allPoints,
        hull: convexHull(allPoints),
        drawnArea:
          ((_a = defect1.drawnArea) != null ? _a : 0) +
          ((_b = defect2.drawnArea) != null ? _b : 0),
        pathLength:
          ((_c = defect1.pathLength) != null ? _c : 0) +
          ((_d = defect2.pathLength) != null ? _d : 0),
      };
    }
    function mergeDefects(defects) {
      let merged = [];
      defects.forEach((defect) => {
        let mergedFlag = false;
        merged.forEach((existing) => {
          if (mergedFlag) {
            return;
          }
          const box1 = boundingBox(existing.hull);
          const box2 = boundingBox(defect.hull);
          if (boxesOverlap(box1, box2)) {
            const mergedDefect = mergeDefectData(existing, defect);
            existing.hull = mergedDefect.hull;
            existing.points = mergedDefect.points;
            existing.drawnArea = mergedDefect.drawnArea;
            existing.pathLength = mergedDefect.pathLength;
            mergedFlag = true;
          }
        });
        if (!mergedFlag) {
          merged.push(defect);
        }
      });
      let changed = true;
      while (changed) {
        changed = false;
        const nextMerged = [];
        merged.forEach((defect) => {
          let target = null;
          nextMerged.forEach((candidate) => {
            if (target) {
              return;
            }
            const box1 = boundingBox(candidate.hull);
            const box2 = boundingBox(defect.hull);
            if (boxesOverlap(box1, box2)) {
              const mergedDefect = mergeDefectData(candidate, defect);
              candidate.hull = mergedDefect.hull;
              candidate.points = mergedDefect.points;
              candidate.drawnArea = mergedDefect.drawnArea;
              candidate.pathLength = mergedDefect.pathLength;
              target = candidate;
              changed = true;
            }
          });
          if (!target) {
            nextMerged.push(defect);
          }
        });
        merged = nextMerged;
      }
      return merged;
    }
    function polygonArea(points) {
      if (points.length < 3) {
        return 0;
      }
      let area = 0;
      for (let index = 0; index < points.length; index += 1) {
        const nextIndex = (index + 1) % points.length;
        area +=
          points[index].x * points[nextIndex].y -
          points[nextIndex].x * points[index].y;
      }
      return Math.abs(area) / 2;
    }
    function polygonCentroid(points) {
      let signedArea = 0;
      let cx = 0;
      let cy = 0;
      for (let index = 0; index < points.length; index += 1) {
        const nextIndex = (index + 1) % points.length;
        const crossValue =
          points[index].x * points[nextIndex].y -
          points[nextIndex].x * points[index].y;
        signedArea += crossValue;
        cx += (points[index].x + points[nextIndex].x) * crossValue;
        cy += (points[index].y + points[nextIndex].y) * crossValue;
      }
      signedArea /= 2;
      if (Math.abs(signedArea) < 1e-10) {
        let sumX = 0;
        let sumY = 0;
        points.forEach((point) => {
          sumX += point.x;
          sumY += point.y;
        });
        return { x: sumX / points.length, y: sumY / points.length };
      }
      return {
        x: cx / (6 * signedArea),
        y: cy / (6 * signedArea),
      };
    }
    function approximateStrokeLength(points) {
      let totalLength = 0;
      for (let index = 1; index < points.length; index += 1) {
        const dx = points[index].x - points[index - 1].x;
        const dy = points[index].y - points[index - 1].y;
        totalLength += Math.sqrt(dx * dx + dy * dy);
      }
      return totalLength;
    }
    function approximateStrokeArea(points, lineWidth) {
      const totalLength = approximateStrokeLength(points);
      return totalLength * lineWidth;
    }
    function getReferenceLocation(centroid, eye) {
      const gridWidth = canvas.width - 2 * GRID_MARGIN;
      const gridHeight = canvas.height - 2 * GRID_MARGIN;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const dx = centroid.x - centerX;
      const dy = centerY - centroid.y;
      const cellWidth = gridWidth / 10;
      const cellHeight = gridHeight / 10;
      let vertical = "";
      let horizontal = "";
      if (Math.abs(dy) >= cellHeight * 0.5) {
        vertical = dy > 0 ? "S" : "I";
      }
      if (Math.abs(dx) >= cellWidth * 0.5) {
        if (eye === "RE") {
          horizontal = dx > 0 ? "T" : "N";
        } else {
          horizontal = dx > 0 ? "N" : "T";
        }
      }
      if (vertical === "" && horizontal === "") {
        return "C";
      }
      return vertical + horizontal;
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
    function drawStrokeOnMask(maskCtx, strokeObj) {
      var _a;
      const absPoints = strokeObj.points.map((point) =>
        app2.canvasController.toAbs(point),
      );
      if (absPoints.length < 2) {
        return;
      }
      maskCtx.save();
      maskCtx.strokeStyle = "#000";
      maskCtx.lineWidth =
        (_a = strokeObj.lineWidth) != null
          ? _a
          : TOOL_STYLES[strokeObj.tool].lineWidth;
      maskCtx.lineCap = "round";
      maskCtx.lineJoin = "round";
      maskCtx.beginPath();
      absPoints.forEach((point, index) => {
        if (index === 0) {
          maskCtx.moveTo(point.x, point.y);
        } else {
          maskCtx.lineTo(point.x, point.y);
        }
      });
      maskCtx.stroke();
      maskCtx.restore();
    }
    function getMaskAreaStats(eye) {
      const gridWidth = canvas.width - 2 * GRID_MARGIN;
      const gridHeight = canvas.height - 2 * GRID_MARGIN;
      const gridPixelWidth = Math.max(0, Math.floor(gridWidth));
      const gridPixelHeight = Math.max(0, Math.floor(gridHeight));
      if (gridPixelWidth === 0 || gridPixelHeight === 0) {
        return { totalPct: 0, centralPct: 0, peripheralPct: 0 };
      }
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      const maskCtx = maskCanvas.getContext("2d");
      app2.state.strokes[eye].forEach((strokeObj) => {
        drawStrokeOnMask(maskCtx, strokeObj);
      });
      const centralRect = getCentralZoneRect();
      const imageData = maskCtx.getImageData(
        GRID_MARGIN,
        GRID_MARGIN,
        gridPixelWidth,
        gridPixelHeight,
      ).data;
      let totalArea = 0;
      let centralArea = 0;
      for (let y = 0; y < gridPixelHeight; y += 1) {
        const canvasY = GRID_MARGIN + y + 0.5;
        for (let x = 0; x < gridPixelWidth; x += 1) {
          const alpha = imageData[(y * gridPixelWidth + x) * 4 + 3];
          if (alpha === 0) {
            continue;
          }
          const areaWeight = alpha / 255;
          const canvasX = GRID_MARGIN + x + 0.5;
          totalArea += areaWeight;
          if (pointInRect({ x: canvasX, y: canvasY }, centralRect)) {
            centralArea += areaWeight;
          }
        }
      }
      const gridArea = gridPixelWidth * gridPixelHeight;
      const peripheralArea = Math.max(0, totalArea - centralArea);
      return {
        totalPct: (totalArea / gridArea) * 100,
        centralPct: (centralArea / gridArea) * 100,
        peripheralPct: (peripheralArea / gridArea) * 100,
      };
    }
    function pointInRect(point, rect) {
      return (
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom
      );
    }
    function pointInPolygon(point, polygon) {
      let inside = false;
      for (
        let i = 0, j = polygon.length - 1;
        i < polygon.length;
        j = i, i += 1
      ) {
        const xi = polygon[i].x;
        const yi = polygon[i].y;
        const xj = polygon[j].x;
        const yj = polygon[j].y;
        const intersects =
          yi > point.y !== yj > point.y &&
          point.x <
            ((xj - xi) * (point.y - yi)) / Math.max(yj - yi, 1e-12) + xi;
        if (intersects) {
          inside = !inside;
        }
      }
      return inside;
    }
    function orientation(a, b, c) {
      return (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
    }
    function onSegment(a, b, c) {
      return (
        Math.min(a.x, c.x) <= b.x &&
        b.x <= Math.max(a.x, c.x) &&
        Math.min(a.y, c.y) <= b.y &&
        b.y <= Math.max(a.y, c.y)
      );
    }
    function segmentsIntersect(p1, p2, q1, q2) {
      const o1 = orientation(p1, p2, q1);
      const o2 = orientation(p1, p2, q2);
      const o3 = orientation(q1, q2, p1);
      const o4 = orientation(q1, q2, p2);
      if (o1 * o2 < 0 && o3 * o4 < 0) {
        return true;
      }
      if (Math.abs(o1) < 1e-12 && onSegment(p1, q1, p2)) return true;
      if (Math.abs(o2) < 1e-12 && onSegment(p1, q2, p2)) return true;
      if (Math.abs(o3) < 1e-12 && onSegment(q1, p1, q2)) return true;
      if (Math.abs(o4) < 1e-12 && onSegment(q1, p2, q2)) return true;
      return false;
    }
    function polygonIntersectsRect(polygon, rect) {
      if (polygon.some((point) => pointInRect(point, rect))) {
        return true;
      }
      const rectCorners = [
        { x: rect.left, y: rect.top },
        { x: rect.right, y: rect.top },
        { x: rect.right, y: rect.bottom },
        { x: rect.left, y: rect.bottom },
      ];
      if (rectCorners.some((corner) => pointInPolygon(corner, polygon))) {
        return true;
      }
      const rectEdges = [
        [rectCorners[0], rectCorners[1]],
        [rectCorners[1], rectCorners[2]],
        [rectCorners[2], rectCorners[3]],
        [rectCorners[3], rectCorners[0]],
      ];
      for (let i = 0; i < polygon.length; i += 1) {
        const next = (i + 1) % polygon.length;
        for (let edgeIndex = 0; edgeIndex < rectEdges.length; edgeIndex += 1) {
          const [edgeStart, edgeEnd] = rectEdges[edgeIndex];
          if (
            segmentsIntersect(polygon[i], polygon[next], edgeStart, edgeEnd)
          ) {
            return true;
          }
        }
      }
      return false;
    }
    function intersectWithVerticalLine(start, end, xValue) {
      const dx = end.x - start.x;
      if (Math.abs(dx) < 1e-12) {
        return { x: xValue, y: start.y };
      }
      const t = (xValue - start.x) / dx;
      return {
        x: xValue,
        y: start.y + t * (end.y - start.y),
      };
    }
    function intersectWithHorizontalLine(start, end, yValue) {
      const dy = end.y - start.y;
      if (Math.abs(dy) < 1e-12) {
        return { x: start.x, y: yValue };
      }
      const t = (yValue - start.y) / dy;
      return {
        x: start.x + t * (end.x - start.x),
        y: yValue,
      };
    }
    function clipPolygonAgainstBoundary(points, isInside, intersect) {
      if (!points || points.length === 0) {
        return [];
      }
      const output = [];
      let previousPoint = points[points.length - 1];
      let previousInside = isInside(previousPoint);
      points.forEach((currentPoint) => {
        const currentInside = isInside(currentPoint);
        if (currentInside) {
          if (!previousInside) {
            output.push(intersect(previousPoint, currentPoint));
          }
          output.push(currentPoint);
        } else if (previousInside) {
          output.push(intersect(previousPoint, currentPoint));
        }
        previousPoint = currentPoint;
        previousInside = currentInside;
      });
      return output;
    }
    function clipPolygonToRect(points, rect) {
      let clipped = points.slice();
      clipped = clipPolygonAgainstBoundary(
        clipped,
        (point) => point.x >= rect.left,
        (start, end) => intersectWithVerticalLine(start, end, rect.left),
      );
      clipped = clipPolygonAgainstBoundary(
        clipped,
        (point) => point.x <= rect.right,
        (start, end) => intersectWithVerticalLine(start, end, rect.right),
      );
      clipped = clipPolygonAgainstBoundary(
        clipped,
        (point) => point.y >= rect.top,
        (start, end) => intersectWithHorizontalLine(start, end, rect.top),
      );
      clipped = clipPolygonAgainstBoundary(
        clipped,
        (point) => point.y <= rect.bottom,
        (start, end) => intersectWithHorizontalLine(start, end, rect.bottom),
      );
      return clipped;
    }
    function getZone(defect) {
      const centralRect = getCentralZoneRect();
      return polygonIntersectsRect(defect.hull, centralRect)
        ? "central"
        : "peripheral";
    }
    function getPenShapeStats(defect, hullArea) {
      var _a, _b;
      const box = boundingBox(defect.points);
      const boxWidth = Math.max(0, box.maxX - box.minX);
      const boxHeight = Math.max(0, box.maxY - box.minY);
      const drawnArea = (_a = defect.drawnArea) != null ? _a : 0;
      const pathLength = Math.max(
        (_b = defect.pathLength) != null ? _b : 0,
        1e-6,
      );
      const effectiveLineWidth = Math.max(drawnArea / pathLength, 1);
      const expandedWidth = boxWidth + effectiveLineWidth;
      const expandedHeight = boxHeight + effectiveLineWidth;
      const boxArea = Math.max(1e-6, expandedWidth * expandedHeight);
      const minDimension = Math.max(
        1e-6,
        Math.min(expandedWidth, expandedHeight),
      );
      const maxDimension = Math.max(expandedWidth, expandedHeight);
      return {
        densityByBox: drawnArea / boxArea,
        hullFill: hullArea / boxArea,
        aspectRatio: maxDimension / minDimension,
      };
    }
    function getDefectType(defect, hullArea = polygonArea(defect.hull)) {
      if (defect.tool === "pen") {
        const stats = getPenShapeStats(defect, Math.max(hullArea, 0));
        const isEnclosedArea =
          stats.hullFill >= PEN_ENCLOSED_HULL_FILL_THRESHOLD &&
          stats.aspectRatio <= PEN_ENCLOSED_ASPECT_RATIO_MAX;
        if (isEnclosedArea) {
          return "dark";
        }
        if (stats.aspectRatio >= PEN_WAVY_ASPECT_RATIO_THRESHOLD) {
          return "wavy";
        }
        const isDark =
          stats.densityByBox >= PEN_DARK_BBOX_DENSITY_THRESHOLD &&
          stats.hullFill >= PEN_DARK_HULL_FILL_THRESHOLD;
        return isDark ? "dark" : "wavy";
      }
      if (defect.tool === "haemorrhage") {
        return "haem";
      }
      if (defect.tool === "erase") {
        return "missing";
      }
      return "";
    }
    function drawHull(hull, tool, defectType) {
      if (hull.length < 2) {
        return;
      }
      let fillColor = "rgba(0,0,0,0)";
      if (tool === "pen") {
        fillColor =
          defectType === "dark" ? "rgba(255,0,0,0.2)" : "rgba(0,255,0,0.2)";
      } else if (tool === "erase") {
        fillColor = "rgba(128,128,128,0.2)";
      } else if (tool === "haemorrhage") {
        fillColor = "rgba(255,0,0,0.2)";
      }
      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.moveTo(hull[0].x, hull[0].y);
      for (let index = 1; index < hull.length; index += 1) {
        ctx.lineTo(hull[index].x, hull[index].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 7;
      ctx.stroke();
      ctx.restore();
    }
    function drawBoundingBoxes(defects) {
      const padding = 5;
      const boxColor = app2.state.redMode
        ? "rgba(125,255,125,0.95)"
        : "#1c9a34";
      defects.forEach((defect, index) => {
        const box = boundingBox(defect.hull);
        ctx.save();
        ctx.strokeStyle = boxColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(
          box.minX - padding,
          box.minY - padding,
          box.maxX - box.minX + 2 * padding,
          box.maxY - box.minY + 2 * padding,
        );
        ctx.fillStyle = boxColor;
        ctx.font = "bold 20px Calibri";
        ctx.fillText(
          String(index + 1),
          box.minX - padding + 12,
          box.minY - padding - 12,
        );
        ctx.restore();
      });
    }
    function drawZoneHighlights() {
      const gridLeft = GRID_MARGIN;
      const gridTop = GRID_MARGIN;
      const gridWidth = canvas.width - 2 * GRID_MARGIN;
      const gridHeight = canvas.height - 2 * GRID_MARGIN;
      const centralRect = getCentralZoneRect();
      const centralWidth = centralRect.right - centralRect.left;
      const centralHeight = centralRect.bottom - centralRect.top;
      const peripheralFill = app2.state.redMode
        ? "rgba(255,175,90,0.18)"
        : "rgba(255,160,70,0.14)";
      const centralFill = app2.state.redMode
        ? "rgba(255,120,35,0.28)"
        : "rgba(240,130,35,0.24)";
      const centralBorder = app2.state.redMode
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
    function collectMergedDefectsForEye(eye) {
      const groups = {
        pen: [],
        erase: [],
        haemorrhage: [],
      };
      app2.state.strokes[eye].forEach((strokeObj) => {
        var _a;
        const absPoints = strokeObj.points.map((point) =>
          app2.canvasController.toAbs(point),
        );
        if (absPoints.length < 2) {
          return;
        }
        const lineWidth =
          (_a = strokeObj.lineWidth) != null
            ? _a
            : TOOL_STYLES[strokeObj.tool].lineWidth;
        const pathLength = approximateStrokeLength(absPoints);
        groups[strokeObj.tool].push({
          hull: convexHull(absPoints),
          tool: strokeObj.tool,
          points: absPoints,
          drawnArea: approximateStrokeArea(absPoints, lineWidth),
          pathLength,
        });
      });
      const mergedDefects = [];
      Object.keys(groups).forEach((tool) => {
        mergedDefects.push(...mergeDefects(groups[tool]));
      });
      return mergedDefects;
    }
    function analyzeAll() {
      function formatPct(value) {
        if (value <= 0) {
          return "0%";
        }
        let rounded = Math.round(value * 10) / 10;
        if (rounded === 0) {
          rounded = 0.1;
        }
        return Number.isInteger(rounded)
          ? `${rounded.toFixed(0)}%`
          : `${rounded.toFixed(1)}%`;
      }
      const gridArea =
        (canvas.width - 2 * GRID_MARGIN) * (canvas.height - 2 * GRID_MARGIN);
      if (gridArea <= 0) {
        return {
          RE: { text: "<b>RE:</b> Nil", defects: [] },
          LE: { text: "<b>LE:</b> Nil", defects: [] },
        };
      }
      const results = {};
      EYES.forEach((eye) => {
        const mergedDefects = collectMergedDefectsForEye(eye);
        const maskStats = getMaskAreaStats(eye);
        const hasDefect = maskStats.totalPct > 0;
        if (hasDefect) {
          results[eye] = {
            text: `<b>${eye}:</b> ${formatPct(maskStats.totalPct)} total, ${formatPct(maskStats.centralPct)} central, ${formatPct(maskStats.peripheralPct)} peripheral`,
            defects: mergedDefects,
          };
        } else {
          results[eye] = {
            text: `<b>${eye}:</b> Nil`,
            defects: mergedDefects,
          };
        }
      });
      return results;
    }
    function drawMergedDefects() {
      const mergedDefects = collectMergedDefectsForEye(app2.state.currentEye);
      drawZoneHighlights();
      mergedDefects.forEach((defect) => {
        const defectType = getDefectType(defect);
        drawHull(defect.hull, defect.tool, defectType);
      });
      drawBoundingBoxes(mergedDefects);
    }
    function analyzeDrawing() {
      app2.state.lastAnalysisResults = analyzeAll();
      app2.state.analysisDirty = false;
      app2.setReportButtonEnabled(true);
      resultText.innerHTML = `${app2.state.lastAnalysisResults.RE.text}<br>${app2.state.lastAnalysisResults.LE.text}`;
      app2.canvasController.redraw();
      drawMergedDefects();
    }
    return {
      analyzeDrawing,
      drawMergedDefects,
    };
  }

  // js/report.js
  function createReportController(app2) {
    const { canvas, patientName, patientDate, reportSection } = app2.elements;
    const REPORT_IMAGE_NAME = "amsler-report.webp";
    const REPORT_IMAGE_TYPE = "image/webp";
    function captureSnapshot(eye) {
      const originalEye = app2.state.currentEye;
      app2.state.currentEye = eye;
      app2.canvasController.redraw();
      app2.analysisController.drawMergedDefects();
      const dataURL = canvas.toDataURL(REPORT_IMAGE_TYPE, 0.92);
      app2.state.currentEye = originalEye;
      app2.canvasController.redraw();
      return dataURL;
    }
    function formatBritishDate(dateStr) {
      if (!dateStr) {
        return "Unknown";
      }
      const parts = dateStr.split("-");
      if (parts.length !== 3) {
        return dateStr;
      }
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    async function captureReportCanvas() {
      var _a;
      if (!window.html2canvas) {
        return null;
      }
      const footer = reportSection.querySelector(".amsler-report-footer");
      const previousDisplay =
        (_a = footer == null ? void 0 : footer.style.display) != null ? _a : "";
      if (footer) {
        footer.style.display = "none";
      }
      try {
        return await window.html2canvas(reportSection, {
          backgroundColor: "#ffffff",
        });
      } finally {
        if (footer) {
          footer.style.display = previousDisplay;
        }
      }
    }
    function downloadReportCanvas(reportCanvas) {
      const link = document.createElement("a");
      link.download = REPORT_IMAGE_NAME;
      link.href = reportCanvas.toDataURL(REPORT_IMAGE_TYPE, 0.92);
      link.click();
    }
    function canvasToBlob(reportCanvas) {
      return new Promise((resolve) => {
        reportCanvas.toBlob(resolve, REPORT_IMAGE_TYPE, 0.92);
      });
    }
    async function downloadReportScreenshot() {
      const reportCanvas = await captureReportCanvas();
      if (reportCanvas) {
        downloadReportCanvas(reportCanvas);
      }
    }
    async function shareReportScreenshot(statusElement) {
      const reportCanvas = await captureReportCanvas();
      if (!reportCanvas) {
        statusElement.textContent = "Screenshot is not available here.";
        return;
      }
      if (!navigator.share || !navigator.canShare || !window.File) {
        statusElement.textContent =
          "Sharing is not available here. Use download.";
        return;
      }
      const blob = await canvasToBlob(reportCanvas);
      if (!blob) {
        statusElement.textContent = "Sharing failed here. Use download.";
        return;
      }
      const file = new File([blob], REPORT_IMAGE_NAME, {
        type: REPORT_IMAGE_TYPE,
      });
      if (!navigator.canShare({ files: [file] })) {
        statusElement.textContent =
          "Sharing is not available here. Use download.";
        return;
      }
      try {
        await navigator.share({
          files: [file],
          title: "Amsler report",
        });
        statusElement.textContent = "Share sheet opened.";
      } catch (error) {
        statusElement.textContent =
          (error == null ? void 0 : error.name) === "AbortError"
            ? "Share cancelled."
            : "Sharing failed here. Use download.";
      }
    }
    function attachReportActionHandlers() {
      const downloadButton = document.getElementById("downloadReportBtn");
      const shareButton = document.getElementById("shareReportBtn");
      const statusElement = document.getElementById("reportShareStatus");
      downloadButton == null
        ? void 0
        : downloadButton.addEventListener("click", () => {
            if (statusElement) {
              statusElement.textContent = "";
            }
            downloadReportScreenshot();
          });
      shareButton == null
        ? void 0
        : shareButton.addEventListener("click", () => {
            if (statusElement) {
              statusElement.textContent = "";
              shareReportScreenshot(statusElement);
            }
          });
    }
    function createMetaItem(label, value) {
      const item = document.createElement("div");
      item.className = "amsler-meta-item";
      const labelElement = document.createElement("span");
      labelElement.className = "amsler-meta-label";
      labelElement.textContent = label;
      const valueElement = document.createElement("span");
      valueElement.className = "amsler-meta-value";
      valueElement.textContent = value;
      item.append(labelElement, valueElement);
      return item;
    }
    function createSummaryLine(eye) {
      const line = document.createElement("p");
      const eyeLabel = document.createElement("strong");
      const plainText = app2.state.lastAnalysisResults[eye].text.replace(
        /<[^>]*>/g,
        "",
      );
      const summaryText = plainText.replace(`${eye}:`, "").trim();
      eyeLabel.textContent = `${eye}:`;
      line.append(eyeLabel, ` ${summaryText}`);
      return line;
    }
    function createEyeFigure(eye, snapshot) {
      const figure = document.createElement("figure");
      figure.className = "amsler-report-eye";
      const caption = document.createElement("figcaption");
      caption.textContent = eye;
      const image = document.createElement("img");
      image.src = snapshot;
      image.alt = `${eye} Amsler grid snapshot`;
      figure.append(caption, image);
      return figure;
    }
    function createReportActionButton(id, iconClass, label, action) {
      const button = document.createElement("button");
      button.id = id;
      button.className = "amsler-report-action-btn";
      button.type = "button";
      button.dataset.resourceAction = action;
      const icon = document.createElement("i");
      icon.className = iconClass;
      icon.setAttribute("aria-hidden", "true");
      const text = document.createElement("span");
      text.textContent = label;
      button.append(icon, text);
      return button;
    }
    function generateReport() {
      if (!app2.state.lastAnalysisResults || app2.state.analysisDirty) {
        return;
      }
      const name = patientName.value || "Unknown";
      const date = formatBritishDate(patientDate.value);
      const reSnapshot = captureSnapshot("RE");
      const leSnapshot = captureSnapshot("LE");
      const card = document.createElement("section");
      card.className = "amsler-report-card";
      const header = document.createElement("header");
      header.className = "amsler-report-header";
      const heading = document.createElement("h2");
      heading.textContent = "Amsler Report";
      const meta = document.createElement("div");
      meta.className = "amsler-report-meta";
      meta.append(createMetaItem("Name", name), createMetaItem("Date", date));
      header.append(heading, meta);
      const summary = document.createElement("div");
      summary.className = "amsler-report-summary";
      summary.append(createSummaryLine("RE"), createSummaryLine("LE"));
      const images = document.createElement("div");
      images.className = "amsler-report-images";
      images.append(
        createEyeFigure("RE", reSnapshot),
        createEyeFigure("LE", leSnapshot),
      );
      const footer = document.createElement("div");
      footer.className = "amsler-report-footer";
      const downloadButton = createReportActionButton(
        "downloadReportBtn",
        "fas fa-download",
        "Download",
        "download",
      );
      const shareButton = createReportActionButton(
        "shareReportBtn",
        "fas fa-share-alt",
        "Share",
        "share",
      );
      const shareStatus = document.createElement("p");
      shareStatus.id = "reportShareStatus";
      shareStatus.className = "amsler-report-share-status";
      shareStatus.setAttribute("aria-live", "polite");
      footer.append(downloadButton, shareButton, shareStatus);
      card.append(header, summary, images, footer);
      reportSection.replaceChildren(card);
      reportSection.hidden = false;
      attachReportActionHandlers();
    }
    return {
      generateReport,
    };
  }

  // js/mcq-data.js
  var MCQ_LEVELS = Object.freeze([
    {
      id: "primary",
      label: "Primary",
      questionCount: 6,
      questions: [
        {
          prompt: "What is the main purpose of an Amsler grid test?",
          options: [
            "To check central vision changes from the macula",
            "To measure blood pressure in the eye",
            "To replace full peripheral field testing",
            "To check colour vision only",
          ],
          answerIndex: 0,
          explanation:
            "Amsler is mainly for central vision symptoms linked to the macula, such as distortion or missing patches.",
        },
        {
          prompt: "How should the patient fixate during the test?",
          options: [
            "Keep looking at the central dot",
            "Look around all corners continuously",
            "Close both eyes between each line",
            "Look only at the edge of the grid",
          ],
          answerIndex: 0,
          explanation:
            "Fixation on the central dot is key. If gaze drifts, findings become less reliable.",
        },
        {
          prompt: "What does a wavy line on the grid usually suggest?",
          options: [
            "Possible metamorphopsia from macular change",
            "A normal finding in everyone",
            "Only lens dryness",
            "Peripheral retinal tear",
          ],
          answerIndex: 0,
          explanation:
            "Waviness can reflect metamorphopsia, often from macular pathology.",
        },
        {
          prompt: "Why might red mode help some users?",
          options: [
            "It can improve contrast for subtle central changes",
            "It guarantees a diagnosis",
            "It tests eye pressure directly",
            "It removes all fixation errors",
          ],
          answerIndex: 0,
          explanation:
            "Red mode is a contrast aid only. It can make subtle abnormalities easier to notice for some patients.",
        },
        {
          prompt:
            "Which area of the retina is mainly being assessed in Amsler testing?",
          options: [
            "Macula",
            "Ora serrata",
            "Optic cup only",
            "Peripheral far retina only",
          ],
          answerIndex: 0,
          explanation:
            "Amsler testing is centred on macular function and central visual perception.",
        },
        {
          prompt: "Why should each eye be tested separately?",
          options: [
            "One eye can hide the other eye's central defect",
            "It makes the pupil larger",
            "It replaces refraction",
            "It removes the need for fixation",
          ],
          answerIndex: 0,
          explanation:
            "Binocular viewing can mask a monocular problem. Testing one eye at a time gives a clearer result.",
        },
        {
          prompt:
            "What should the patient wear if they normally need near correction?",
          options: [
            "Their usual reading correction",
            "Distance glasses only in every case",
            "No correction at all",
            "Sunglasses to reduce the grid",
          ],
          answerIndex: 0,
          explanation:
            "The grid is a near task, so good near correction helps the patient inspect the lines accurately.",
        },
        {
          prompt: "What can a dark or missing patch on the grid represent?",
          options: [
            "A possible scotoma or missing area",
            "A normal blind spot in every central test",
            "A direct pressure reading",
            "A lid-position measurement",
          ],
          answerIndex: 0,
          explanation:
            "A dark or missing region can represent a perceived central scotoma and should be documented.",
        },
        {
          prompt: "When should a new Amsler change be escalated?",
          options: [
            "When it is new, worsening or affecting central vision",
            "Only after a year",
            "Only if both eyes are perfect",
            "Never, because Amsler is only a drawing task",
          ],
          answerIndex: 0,
          explanation:
            "New or progressive central distortion or missing vision needs timely clinical assessment.",
        },
        {
          prompt: "What do the diagonal lines help with?",
          options: [
            "Maintaining fixation when central loss makes the dot harder to use",
            "Measuring intraocular pressure",
            "Testing far peripheral field only",
            "Making all results diagnostic",
          ],
          answerIndex: 0,
          explanation:
            "Diagonals can help some patients keep oriented toward the centre when central vision is reduced.",
        },
        {
          prompt: "Which tool is best for marking haemorrhage-like red areas?",
          options: [
            "The red haemorrhage tool",
            "The erase tool",
            "The patient details button",
            "The report button",
          ],
          answerIndex: 0,
          explanation:
            "The red tool is intended for red or blood-like marks while black is for dark or wavy marks.",
        },
        {
          prompt: "What does Nil mean in the result area?",
          options: [
            "No drawn defect has been detected for that eye",
            "The eye has perfect macular health",
            "The test is invalid",
            "The patient has no need for glasses",
          ],
          answerIndex: 0,
          explanation:
            "Nil means the app has not found a drawn defect for that eye. It is not a clinical all-clear by itself.",
        },
      ],
    },
    {
      id: "intermediate",
      label: "Intermediate",
      questionCount: 8,
      questions: [
        {
          prompt:
            "Amsler abnormalities are most sensitive for dysfunction in which pathway segment?",
          options: [
            "Central macular visual processing",
            "Vestibular pathways",
            "Auditory cortex",
            "Extraocular muscle tendon reflexes",
          ],
          answerIndex: 0,
          explanation:
            "The tool targets central visual perception linked to macular function.",
        },
        {
          prompt: "Why test one eye at a time with correction?",
          options: [
            "To avoid binocular compensation masking monocular defects",
            "Because binocular testing is always invalid",
            "To increase pupil size",
            "To reduce retinal blood-flow artefact",
          ],
          answerIndex: 0,
          explanation:
            "Binocular viewing can conceal unilateral deficits, while monocular testing improves detection.",
        },
        {
          prompt:
            "Which symptom pattern should raise concern for possible active wet AMD?",
          options: [
            "Recent-onset central distortion with progression over days to weeks",
            "Stable mild blur unchanged for years",
            "Transient itch after eye drops",
            "Peripheral flashes only with no central complaints",
          ],
          answerIndex: 0,
          explanation:
            "Rapidly changing central distortion is a key red flag and needs timely assessment.",
        },
        {
          prompt:
            "In diabetic retinopathy follow-up, Amsler changes are most useful as:",
          options: [
            "A patient-facing functional symptom tracker between visits",
            "A replacement for retinal imaging",
            "A pressure measurement substitute",
            "A complete staging system",
          ],
          answerIndex: 0,
          explanation:
            "It supports symptom monitoring but does not replace structural clinical assessment.",
        },
        {
          prompt:
            "What is a practical reason to compare standard and red mode findings?",
          options: [
            "Concordant defects across modes increase confidence in a true perceptual change",
            "One mode should always be ignored",
            "Red mode should replace standard mode completely",
            "Only standard mode can detect central loss",
          ],
          answerIndex: 0,
          explanation:
            "Cross-mode consistency can reduce noise from attention or contrast preference effects.",
        },
        {
          prompt: "Which history detail best supports urgency stratification?",
          options: [
            "Exact onset trend: sudden, stepwise or slowly progressive",
            "Favourite television channel",
            "Dominant foot",
            "Usual coffee order",
          ],
          answerIndex: 0,
          explanation: "Temporal pattern helps estimate risk and urgency.",
        },
        {
          prompt: "Amsler reports can underestimate defects when:",
          options: [
            "Fixation is unstable or the patient scans rather than fixates",
            "Lighting is moderate",
            "The chart is square",
            "The patient is seated",
          ],
          answerIndex: 0,
          explanation:
            "Scanning behaviour can blur local distortions and reduce mapping accuracy.",
        },
        {
          prompt: "Best wording to ask about subtle change is:",
          options: [
            "Are any lines less clear, bent, faded or missing compared with your usual view?",
            "You have no changes, right?",
            "Is everything perfect?",
            "Do you only see red lines?",
          ],
          answerIndex: 0,
          explanation:
            "Neutral, descriptive prompts reduce leading bias and improve symptom capture.",
        },
        {
          prompt: "Why document which eye was tested?",
          options: [
            "Macular symptoms and drawings can be very different between eyes",
            "The right eye is always worse",
            "Left-eye findings cannot matter clinically",
            "Eye labels only change the report colour",
          ],
          answerIndex: 0,
          explanation:
            "Eye-specific documentation helps compare symptoms and avoids losing unilateral changes.",
        },
        {
          prompt:
            "What does a central percentage in the result aim to summarise?",
          options: [
            "How much of the defect overlaps the central zone",
            "The patient's visual acuity",
            "The intraocular pressure",
            "The size of the optic disc",
          ],
          answerIndex: 0,
          explanation:
            "The central value estimates how much drawn defect burden lies in the central grid region.",
        },
        {
          prompt:
            "What is the safest interpretation of a normal-looking Amsler test?",
          options: [
            "No defect was reported or drawn during this test",
            "Macular disease is impossible",
            "OCT is unnecessary forever",
            "Peripheral retina is fully normal",
          ],
          answerIndex: 0,
          explanation:
            "A normal Amsler result can be reassuring but does not exclude all macular or retinal disease.",
        },
        {
          prompt: "Which patient instruction reduces false reassurance?",
          options: [
            "Keep looking at the dot and report if lines disappear rather than chasing them",
            "Follow every wavy line with your eyes",
            "Blink only after the test is finished",
            "Ignore missing areas if they move",
          ],
          answerIndex: 0,
          explanation:
            "Patients may compensate by scanning; fixation instructions help keep the test meaningful.",
        },
        {
          prompt:
            "What does a newly enlarged central missing patch suggest in follow-up?",
          options: [
            "Possible progression needing clinical review",
            "Improved central vision",
            "A better lighting condition only",
            "A normal learning effect",
          ],
          answerIndex: 0,
          explanation:
            "Increasing central involvement is a meaningful change and should be correlated clinically.",
        },
        {
          prompt: "Why does the app store drawings separately for RE and LE?",
          options: [
            "To preserve monocular findings for comparison",
            "To make the report longer",
            "To force both eyes to look identical",
            "To hide left-eye defects",
          ],
          answerIndex: 0,
          explanation:
            "Separate stroke stores keep each eye's perceived defects distinct.",
        },
        {
          prompt: "Which symptom is most aligned with metamorphopsia?",
          options: [
            "Straight grid lines appearing bent or warped",
            "A gritty lid sensation only",
            "A headache without visual change",
            "A brief sneeze during testing",
          ],
          answerIndex: 0,
          explanation:
            "Metamorphopsia is perceived distortion, often described as bending or warping of straight lines.",
        },
        {
          prompt: "Why might poor near correction reduce test quality?",
          options: [
            "Blur can make grid detail harder to judge",
            "It changes the macula's anatomy",
            "It improves fixation reliability",
            "It makes colour testing unnecessary",
          ],
          answerIndex: 0,
          explanation:
            "Uncorrected near blur can make subtle distortion or missing areas harder to report.",
        },
        {
          prompt: "What does a report screenshot mainly provide?",
          options: [
            "A record of the drawn defects and computed summary",
            "A definitive diagnosis",
            "A replacement for visual acuity",
            "A guarantee that fixation was perfect",
          ],
          answerIndex: 0,
          explanation:
            "The screenshot is documentation of the app session, not a diagnostic endpoint.",
        },
        {
          prompt: "Which defect description is most useful in notes?",
          options: [
            "New central waviness in RE, worse than last week",
            "Looks odd",
            "Patient unsure, no eye recorded",
            "Amsler done",
          ],
          answerIndex: 0,
          explanation:
            "Eye, location, symptom type and time course make the note more actionable.",
        },
      ],
    },
    {
      id: "advanced",
      label: "Advanced",
      questionCount: 8,
      questions: [
        {
          prompt:
            "For longitudinal monitoring, which parameter is most clinically useful from this app output?",
          options: [
            "Trend in central involvement percentage over serial tests",
            "Single-session screenshot colour tone",
            "Screen brightness at time of test only",
            "Whether the patient used left or right hand",
          ],
          answerIndex: 0,
          explanation:
            "Serial trend in central burden can support progression assessment alongside exam findings.",
        },
        {
          prompt:
            "Why should Amsler findings be integrated with history rather than interpreted in isolation?",
          options: [
            "Perceptual reports are subjective and influenced by fixation, cognition and contrast conditions",
            "Amsler is objective enough to replace all retinal workup",
            "History does not alter risk interpretation",
            "Only OCT is subjective",
          ],
          answerIndex: 0,
          explanation:
            "Amsler is symptom-driven, so contextual history is essential for meaningful interpretation.",
        },
        {
          prompt:
            "A patient reports subtle new central metamorphopsia over 48 hours. Most appropriate next step is:",
          options: [
            "Escalate for timely retinal assessment and document progression details",
            "Reassure and defer for 12 months",
            "Repeat Amsler only and avoid referral",
            "Switch to peripheral-only testing",
          ],
          answerIndex: 0,
          explanation:
            "Rapid central change requires prompt clinical correlation and triage.",
        },
        {
          prompt:
            "Which question best differentiates stable chronic from active evolving macular symptoms?",
          options: [
            "Has the distortion changed in size or intensity since it first appeared, and over what interval?",
            "Do you prefer dark mode?",
            "Have you had recent dental work?",
            "Is one eye dominant?",
          ],
          answerIndex: 0,
          explanation: "Progression trajectory is central to risk assessment.",
        },
        {
          prompt:
            "In structured follow-up, what improves reproducibility the most?",
          options: [
            "Consistent test distance, correction, fixation instruction and monocular sequence",
            "Changing chart size each visit",
            "Alternating random viewing angles",
            "Testing only after prolonged dark adaptation",
          ],
          answerIndex: 0,
          explanation:
            "Protocol consistency reduces measurement noise and improves comparability.",
        },
        {
          prompt:
            "Why can a central lesion be under-represented by purely centroid-based labelling?",
          options: [
            "A straddling defect may have centroid outside fixation while still involving central retina",
            "Centroids always overestimate central involvement",
            "Centroids cannot be computed for polygons",
            "Centroids only work in 3D retinal maps",
          ],
          answerIndex: 0,
          explanation:
            "Overlap-based zone analysis better captures central involvement for irregular shapes.",
        },
        {
          prompt: "Which statement about red-grid mode is most defensible?",
          options: [
            "It is an adjunctive perceptual contrast strategy, not a diagnostic endpoint",
            "It confirms wet AMD when lines look curved",
            "It invalidates standard mode findings",
            "It is only useful for glaucoma staging",
          ],
          answerIndex: 0,
          explanation:
            "Red mode can aid detection but does not independently diagnose cause.",
        },
        {
          prompt:
            "For diabetic macular risk discussions, what phrasing is most useful?",
          options: [
            "Ask for new central blur or distortion, progression pace and effect on reading or faces",
            "Ask only if pain is severe",
            "Ask only about floaters",
            "Avoid discussing functional impact",
          ],
          answerIndex: 0,
          explanation:
            "Function-focused symptom history supports triage and patient-centred decision making.",
        },
        {
          prompt:
            "Why is convex-hull area only an approximation of Amsler defect burden?",
          options: [
            "It encloses the drawn shape and may include space the patient did not mark",
            "It measures photoreceptor density directly",
            "It excludes every central defect",
            "It cannot use two-dimensional points",
          ],
          answerIndex: 0,
          explanation:
            "Hull methods are fast and useful for summaries but can overestimate irregular or crescent-shaped marks.",
        },
        {
          prompt: "Which scenario most risks a false negative Amsler result?",
          options: [
            "A patient with poor fixation scans across the grid to find missing areas",
            "A patient uses near correction",
            "Each eye is covered in turn",
            "The patient reports new distortion",
          ],
          answerIndex: 0,
          explanation:
            "Scanning can compensate for a defect and make the grid seem more complete than it is.",
        },
        {
          prompt: "Which documentation best supports clinical handover?",
          options: [
            "Eye, onset, progression, defect location and screenshot",
            "Only the button colour used",
            "Only whether the app opened",
            "Only the patient's device type",
          ],
          answerIndex: 0,
          explanation:
            "Handover is stronger when the symptom, time course and mapped defect are all recorded.",
        },
        {
          prompt: "What is the main limitation of using percentage area alone?",
          options: [
            "Small central defects can matter more than larger peripheral marks",
            "Percentages cannot be displayed",
            "Percentages always identify the diagnosis",
            "Peripheral marks are always urgent",
          ],
          answerIndex: 0,
          explanation:
            "Location and symptom context matter; central involvement can carry high functional significance.",
        },
        {
          prompt:
            "When comparing serial tests, which change is most concerning?",
          options: [
            "A new or enlarging central defect with matching symptoms",
            "A different random option order in MCQs",
            "A report generated on a different weekday",
            "A patient using the same near glasses",
          ],
          answerIndex: 0,
          explanation:
            "A reproducible central change with symptoms is more clinically meaningful than app-session details.",
        },
        {
          prompt:
            "Why should clinical advice avoid saying the app has diagnosed wet AMD?",
          options: [
            "Amsler suggests functional change but cannot establish the cause",
            "Wet AMD never causes distortion",
            "Only colour mode can diagnose it",
            "Amsler results are unrelated to the macula",
          ],
          answerIndex: 0,
          explanation:
            "The app can flag concerning symptoms but diagnosis requires clinical examination and imaging where appropriate.",
        },
        {
          prompt:
            "Which factor can reduce comparability between two Amsler sessions?",
          options: [
            "Different viewing distance or correction",
            "Recording the eye label",
            "Using the same fixation instruction",
            "Testing in the same sequence",
          ],
          answerIndex: 0,
          explanation:
            "Changes in distance or correction can alter perceived grid size and clarity.",
        },
        {
          prompt:
            "What is the safest use of the app's central and peripheral split?",
          options: [
            "As a structured documentation aid alongside clinical judgement",
            "As a stand-alone referral rule for every patient",
            "As a replacement for symptoms",
            "As proof that peripheral retina has been fully examined",
          ],
          answerIndex: 0,
          explanation:
            "The split helps organise findings but should be interpreted with symptoms and examination.",
        },
        {
          prompt: "Which patient group may need extra care with instructions?",
          options: [
            "Patients with cognitive, fixation or communication difficulty",
            "Patients who can read the chart clearly",
            "Patients tested one eye at a time",
            "Patients using their usual near correction",
          ],
          answerIndex: 0,
          explanation:
            "The test depends on understanding, steady fixation and accurate symptom reporting.",
        },
        {
          prompt:
            "Which finding is most consistent with metamorphopsia rather than a pure absolute scotoma?",
          options: [
            "Lines bend around a region but remain visible",
            "The entire grid is absent",
            "Only eye pressure is high",
            "The peripheral far field is missing with no central symptom",
          ],
          answerIndex: 0,
          explanation:
            "Metamorphopsia is distortion of visible structure, while a scotoma is a missing or dark area.",
        },
      ],
    },
  ]);

  // js/mcq.js
  function shuffleItems(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  function shuffleQuestionOptions(question) {
    const options = shuffleItems(
      question.options.map((text, index) => ({
        text,
        isCorrect: index === question.answerIndex,
      })),
    );
    return {
      ...question,
      options: options.map((option) => option.text),
      answerIndex: options.findIndex((option) => option.isCorrect),
    };
  }
  function sampleLevelQuestions(level) {
    var _a;
    const questionCount = Math.min(
      (_a = level.questionCount) != null ? _a : level.questions.length,
      level.questions.length,
    );
    return shuffleItems(level.questions)
      .slice(0, questionCount)
      .map(shuffleQuestionOptions);
  }
  function setFeedbackText(container, label, text) {
    container.replaceChildren();
    const strong = document.createElement("strong");
    strong.textContent = label;
    container.append(strong, ` ${text}`);
  }
  function createMcqController(app2) {
    const {
      sideMenu,
      sideMenuBackdrop,
      mcqModal,
      mcqTitle,
      mcqProgress,
      mcqList,
      mcqFeedback,
      mcqSubmitBtn,
      mcqRestartBtn,
    } = app2.elements;
    let activeLevel = null;
    let questions = [];
    let isSubmitted = false;
    function setSideMenuOpen(isOpen) {
      sideMenu.classList.toggle("open", isOpen);
      sideMenuBackdrop.hidden = !isOpen;
    }
    function toggleSideMenu() {
      setSideMenuOpen(!sideMenu.classList.contains("open"));
    }
    function openModal() {
      mcqModal.style.display = "block";
    }
    function closeModal() {
      mcqModal.style.display = "none";
    }
    function renderQuestionList() {
      if (!activeLevel || questions.length === 0) {
        return;
      }
      isSubmitted = false;
      mcqTitle.textContent = `${activeLevel.label} MCQs`;
      mcqProgress.textContent = `${questions.length} questions`;
      mcqFeedback.textContent = "";
      mcqSubmitBtn.disabled = false;
      mcqSubmitBtn.hidden = false;
      mcqRestartBtn.hidden = true;
      mcqList.replaceChildren();
      questions.forEach((question, questionIndex) => {
        const fieldset = document.createElement("fieldset");
        fieldset.className = "mcq-item";
        fieldset.dataset.questionIndex = String(questionIndex);
        const legend = document.createElement("legend");
        legend.textContent = `${questionIndex + 1}. ${question.prompt}`;
        fieldset.appendChild(legend);
        const optionsWrap = document.createElement("div");
        optionsWrap.className = "mcq-item-options";
        question.options.forEach((optionText, optionIndex) => {
          const optionLabel = document.createElement("label");
          optionLabel.className = "mcq-option-label";
          optionLabel.dataset.optionIndex = String(optionIndex);
          const input = document.createElement("input");
          input.type = "radio";
          input.name = `mcq-q-${questionIndex}`;
          input.value = String(optionIndex);
          const textSpan = document.createElement("span");
          textSpan.textContent = optionText;
          optionLabel.appendChild(input);
          optionLabel.appendChild(textSpan);
          optionsWrap.appendChild(optionLabel);
        });
        const itemFeedback = document.createElement("p");
        itemFeedback.className = "mcq-item-feedback";
        itemFeedback.hidden = true;
        fieldset.appendChild(optionsWrap);
        fieldset.appendChild(itemFeedback);
        mcqList.appendChild(fieldset);
      });
    }
    function startLevel(levelId) {
      const selectedLevel = MCQ_LEVELS.find((level) => level.id === levelId);
      if (!selectedLevel) {
        return;
      }
      activeLevel = selectedLevel;
      questions = sampleLevelQuestions(selectedLevel);
      isSubmitted = false;
      setSideMenuOpen(false);
      openModal();
      renderQuestionList();
    }
    function submitLevel() {
      if (!activeLevel || isSubmitted) {
        return;
      }
      let score = 0;
      let unansweredCount = 0;
      const fieldsets = Array.from(mcqList.querySelectorAll(".mcq-item"));
      fieldsets.forEach((fieldset, questionIndex) => {
        const question = questions[questionIndex];
        const selectedInput = fieldset.querySelector("input:checked");
        const selectedIndex = selectedInput
          ? Number.parseInt(selectedInput.value, 10)
          : -1;
        const isCorrect = selectedIndex === question.answerIndex;
        if (isCorrect) {
          score += 1;
        }
        if (selectedIndex < 0) {
          unansweredCount += 1;
        }
        const optionLabels = Array.from(
          fieldset.querySelectorAll(".mcq-option-label"),
        );
        optionLabels.forEach((label) => {
          const optionIndex = Number.parseInt(label.dataset.optionIndex, 10);
          const input = label.querySelector("input");
          if (input) {
            input.disabled = true;
          }
          if (optionIndex === question.answerIndex) {
            label.classList.add("correct");
          } else if (optionIndex === selectedIndex) {
            label.classList.add("incorrect");
          }
        });
        const itemFeedback = fieldset.querySelector(".mcq-item-feedback");
        if (itemFeedback) {
          const resultWord = isCorrect ? "Correct." : "Incorrect.";
          itemFeedback.hidden = false;
          setFeedbackText(itemFeedback, resultWord, question.explanation);
        }
      });
      const total = questions.length;
      const scorePct = total > 0 ? Math.round((score / total) * 100) : 0;
      const unansweredText =
        unansweredCount > 0 ? ` Unanswered: ${unansweredCount}.` : "";
      setFeedbackText(
        mcqFeedback,
        "Score:",
        `${score}/${total} (${scorePct}%).${unansweredText}`,
      );
      mcqProgress.textContent = `${activeLevel.label} complete`;
      mcqSubmitBtn.disabled = true;
      mcqRestartBtn.hidden = false;
      isSubmitted = true;
    }
    function restartLevel() {
      if (!activeLevel) {
        return;
      }
      startLevel(activeLevel.id);
    }
    function handleBackdropClick(event) {
      if (event.target === sideMenuBackdrop) {
        setSideMenuOpen(false);
      }
    }
    function handleModalBackdropClick(event) {
      if (event.target === mcqModal) {
        closeModal();
      }
    }
    function handleEscape() {
      if (mcqModal.style.display === "block") {
        closeModal();
        return;
      }
      if (sideMenu.classList.contains("open")) {
        setSideMenuOpen(false);
      }
    }
    return {
      startLevel,
      closeModal,
      toggleSideMenu,
      setSideMenuOpen,
      submitLevel,
      restartLevel,
      handleBackdropClick,
      handleModalBackdropClick,
      handleEscape,
    };
  }

  // js/state.js
  function createInitialState() {
    return {
      flashDot: false,
      dotVisible: true,
      dotInterval: null,
      redMode: false,
      diagMode: false,
      strokes: {
        RE: [],
        LE: [],
      },
      currentStroke: null,
      isDrawing: false,
      currentEye: "RE",
      currentTool: "pen",
      penLineWidth: TOOL_STYLES.pen.lineWidth,
      lastAnalysisResults: null,
      analysisDirty: true,
    };
  }
  function markAnalysisDirty(app2) {
    app2.state.analysisDirty = true;
    app2.state.lastAnalysisResults = null;
    app2.setReportButtonEnabled(false);
  }

  // js/ui.js
  function wireUiEvents(app2) {
    const {
      canvas,
      reTab,
      leTab,
      flashToggleBtn,
      redToggleBtn,
      diagToggleBtn,
      burgerIcon,
      sideMenu,
      sideMenuBackdrop,
      mcqPrimaryBtn,
      mcqIntermediateBtn,
      mcqAdvancedBtn,
      mcqModal,
      closeMcqModal,
      mcqSubmitBtn,
      mcqRestartBtn,
      toolPen,
      toolErase,
      toolHaemorrhage,
      strokeSettingsToggle,
      strokeSettingsPanel,
      penWidthSlider,
      penWidthValue,
      analyzeBtn,
      reportBtn,
      infoIcon,
      infoModal,
      closeInfoModal,
      patientInfoToggle,
      patientInfoModal,
      closePatientInfo,
      savePatientInfo,
    } = app2.elements;
    const toolButtons = {
      pen: toolPen,
      erase: toolErase,
      haemorrhage: toolHaemorrhage,
    };
    function setToggleButtonState(button, isActive) {
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    }
    function setActiveTool(tool) {
      app2.state.currentTool = tool;
      Object.keys(toolButtons).forEach((name) => {
        const isActive = name === tool;
        toolButtons[name].classList.toggle("active", isActive);
        toolButtons[name].setAttribute("aria-pressed", String(isActive));
      });
    }
    function openModal(modalElement) {
      modalElement.style.display = "block";
    }
    function closeModal(modalElement) {
      modalElement.style.display = "none";
    }
    function toggleModal(modalElement) {
      modalElement.style.display =
        modalElement.style.display === "block" ? "none" : "block";
    }
    function setStrokeSettingsOpen(isOpen) {
      strokeSettingsPanel.hidden = !isOpen;
      strokeSettingsToggle.classList.toggle("active", isOpen);
      strokeSettingsToggle.setAttribute("aria-expanded", String(isOpen));
    }
    function syncPenWidthUi() {
      const penWidth = app2.state.penLineWidth;
      penWidthSlider.value = String(penWidth);
      penWidthValue.textContent = `${penWidth}px`;
    }
    canvas.addEventListener("mousedown", app2.canvasController.startDrawing);
    canvas.addEventListener("touchstart", app2.canvasController.startDrawing);
    canvas.addEventListener("mousemove", app2.canvasController.draw);
    canvas.addEventListener("touchmove", app2.canvasController.draw);
    canvas.addEventListener("mouseup", app2.canvasController.endDrawing);
    canvas.addEventListener("touchend", app2.canvasController.endDrawing);
    flashToggleBtn.addEventListener("click", () => {
      app2.state.flashDot = !app2.state.flashDot;
      setToggleButtonState(flashToggleBtn, app2.state.flashDot);
      if (app2.state.flashDot) {
        app2.state.dotInterval = window.setInterval(() => {
          app2.state.dotVisible = !app2.state.dotVisible;
          app2.canvasController.redraw();
        }, 100);
      } else {
        window.clearInterval(app2.state.dotInterval);
        app2.state.dotInterval = null;
        app2.state.dotVisible = true;
        app2.canvasController.redraw();
      }
    });
    redToggleBtn.addEventListener("click", () => {
      app2.state.redMode = !app2.state.redMode;
      setToggleButtonState(redToggleBtn, app2.state.redMode);
      app2.canvasController.redraw();
    });
    diagToggleBtn.addEventListener("click", () => {
      app2.state.diagMode = !app2.state.diagMode;
      setToggleButtonState(diagToggleBtn, app2.state.diagMode);
      app2.canvasController.redraw();
    });
    reTab.addEventListener("click", () => {
      app2.state.currentEye = "RE";
      reTab.classList.add("active");
      leTab.classList.remove("active");
      app2.canvasController.redraw();
    });
    leTab.addEventListener("click", () => {
      app2.state.currentEye = "LE";
      leTab.classList.add("active");
      reTab.classList.remove("active");
      app2.canvasController.redraw();
    });
    infoIcon.addEventListener("click", () => {
      toggleModal(infoModal);
    });
    burgerIcon.addEventListener("click", (event) => {
      event.stopPropagation();
      app2.mcqController.toggleSideMenu();
    });
    sideMenu.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    sideMenuBackdrop.addEventListener(
      "click",
      app2.mcqController.handleBackdropClick,
    );
    mcqPrimaryBtn.addEventListener("click", () => {
      app2.mcqController.startLevel("primary");
    });
    mcqIntermediateBtn.addEventListener("click", () => {
      app2.mcqController.startLevel("intermediate");
    });
    mcqAdvancedBtn.addEventListener("click", () => {
      app2.mcqController.startLevel("advanced");
    });
    closeMcqModal.addEventListener("click", app2.mcqController.closeModal);
    mcqSubmitBtn.addEventListener("click", app2.mcqController.submitLevel);
    mcqRestartBtn.addEventListener("click", app2.mcqController.restartLevel);
    strokeSettingsToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      setStrokeSettingsOpen(strokeSettingsPanel.hidden);
    });
    strokeSettingsPanel.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    penWidthSlider.addEventListener("input", (event) => {
      const nextWidth = Number.parseInt(event.target.value, 10);
      if (Number.isNaN(nextWidth)) {
        return;
      }
      app2.state.penLineWidth = nextWidth;
      penWidthValue.textContent = `${nextWidth}px`;
      app2.canvasController.redraw();
    });
    closeInfoModal.addEventListener("click", () => {
      closeModal(infoModal);
    });
    patientInfoToggle.addEventListener("click", () => {
      openModal(patientInfoModal);
    });
    closePatientInfo.addEventListener("click", () => {
      closeModal(patientInfoModal);
    });
    savePatientInfo.addEventListener("click", () => {
      closeModal(patientInfoModal);
    });
    window.addEventListener("click", (event) => {
      if (event.target === infoModal) {
        closeModal(infoModal);
      }
      if (event.target === patientInfoModal) {
        closeModal(patientInfoModal);
      }
      app2.mcqController.handleModalBackdropClick(event);
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        app2.mcqController.handleEscape();
      }
    });
    toolPen.addEventListener("click", () => setActiveTool("pen"));
    toolErase.addEventListener("click", () => setActiveTool("erase"));
    toolHaemorrhage.addEventListener("click", () =>
      setActiveTool("haemorrhage"),
    );
    analyzeBtn.addEventListener(
      "click",
      app2.analysisController.analyzeDrawing,
    );
    reportBtn.addEventListener("click", app2.reportController.generateReport);
    window.addEventListener("resize", app2.canvasController.resizeCanvas);
    setToggleButtonState(flashToggleBtn, app2.state.flashDot);
    setToggleButtonState(redToggleBtn, app2.state.redMode);
    setToggleButtonState(diagToggleBtn, app2.state.diagMode);
    app2.mcqController.setSideMenuOpen(false);
    setStrokeSettingsOpen(false);
    syncPenWidthUi();
    setActiveTool(app2.state.currentTool);
    app2.setReportButtonEnabled(false);
    app2.canvasController.resizeCanvas();
  }

  // script.js
  function getRequiredElements() {
    const canvas = document.getElementById("gridCanvas");
    const ctx = canvas.getContext("2d");
    return {
      canvas,
      ctx,
      analyzeBtn: document.getElementById("analyzeBtn"),
      reportBtn: document.getElementById("reportBtn"),
      resultText: document.querySelector(".results p"),
      flashToggleBtn: document.getElementById("flashToggle"),
      redToggleBtn: document.getElementById("redToggle"),
      diagToggleBtn: document.getElementById("diagToggle"),
      burgerIcon: document.getElementById("burger-icon"),
      sideMenu: document.getElementById("sideMenu"),
      sideMenuBackdrop: document.getElementById("sideMenuBackdrop"),
      mcqPrimaryBtn: document.getElementById("mcqPrimaryBtn"),
      mcqIntermediateBtn: document.getElementById("mcqIntermediateBtn"),
      mcqAdvancedBtn: document.getElementById("mcqAdvancedBtn"),
      mcqModal: document.getElementById("mcqModal"),
      closeMcqModal: document.getElementById("closeMcqModal"),
      mcqTitle: document.getElementById("mcqTitle"),
      mcqProgress: document.getElementById("mcqProgress"),
      mcqList: document.getElementById("mcqList"),
      mcqFeedback: document.getElementById("mcqFeedback"),
      mcqSubmitBtn: document.getElementById("mcqSubmitBtn"),
      mcqRestartBtn: document.getElementById("mcqRestartBtn"),
      reTab: document.getElementById("reTab"),
      leTab: document.getElementById("leTab"),
      infoIcon: document.getElementById("info-icon"),
      infoModal: document.getElementById("infoModal"),
      closeInfoModal: document.getElementById("closeModal"),
      patientInfoToggle: document.getElementById("patientInfoToggle"),
      patientInfoModal: document.getElementById("patientInfoModal"),
      closePatientInfo: document.getElementById("closePatientInfo"),
      savePatientInfo: document.getElementById("savePatientInfo"),
      toolPen: document.getElementById("toolPen"),
      toolErase: document.getElementById("toolErase"),
      toolHaemorrhage: document.getElementById("toolHaemorrhage"),
      strokeSettingsToggle: document.getElementById("strokeSettingsToggle"),
      strokeSettingsPanel: document.getElementById("strokeSettingsPanel"),
      penWidthSlider: document.getElementById("penWidthSlider"),
      penWidthValue: document.getElementById("penWidthValue"),
      patientName: document.getElementById("patientName"),
      patientDate: document.getElementById("patientDate"),
      reportSection: document.getElementById("reportSection"),
    };
  }
  function createApp() {
    const app2 = {
      elements: getRequiredElements(),
      state: createInitialState(),
    };
    app2.setReportButtonEnabled = (isEnabled) => {
      app2.elements.reportBtn.disabled = !isEnabled;
    };
    app2.markAnalysisDirty = () => {
      markAnalysisDirty(app2);
    };
    app2.canvasController = createCanvasController(app2);
    app2.analysisController = createAnalysisController(app2);
    app2.reportController = createReportController(app2);
    app2.mcqController = createMcqController(app2);
    return app2;
  }
  var app = createApp();
  wireUiEvents(app);
})();
