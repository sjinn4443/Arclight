import { EYES, GRID_MARGIN, TOOL_STYLES } from "./constants.js";

export function createAnalysisController(app) {
  const { canvas, ctx, resultText } = app.elements;
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
      (a.x - origin.x) * (b.y - origin.y) - (a.y - origin.y) * (b.x - origin.x)
    );
  }

  function convexHull(points) {
    if (points.length <= 1) {
      return points.slice();
    }

    const sortedPoints = points.slice().sort((a, b) => a.x - b.x || a.y - b.y);
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
    const allPoints = defect1.points.concat(defect2.points);
    return {
      points: allPoints,
      hull: convexHull(allPoints),
      drawnArea: (defect1.drawnArea ?? 0) + (defect2.drawnArea ?? 0),
      pathLength: (defect1.pathLength ?? 0) + (defect2.pathLength ?? 0),
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
    const absPoints = strokeObj.points.map((point) =>
      app.canvasController.toAbs(point),
    );
    if (absPoints.length < 2) {
      return;
    }

    maskCtx.save();
    maskCtx.strokeStyle = "#000";
    maskCtx.lineWidth =
      strokeObj.lineWidth ?? TOOL_STYLES[strokeObj.tool].lineWidth;
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
    app.state.strokes[eye].forEach((strokeObj) => {
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
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
      const xi = polygon[i].x;
      const yi = polygon[i].y;
      const xj = polygon[j].x;
      const yj = polygon[j].y;
      const intersects =
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / Math.max(yj - yi, 1e-12) + xi;
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
        if (segmentsIntersect(polygon[i], polygon[next], edgeStart, edgeEnd)) {
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
    const box = boundingBox(defect.points);
    const boxWidth = Math.max(0, box.maxX - box.minX);
    const boxHeight = Math.max(0, box.maxY - box.minY);
    const drawnArea = defect.drawnArea ?? 0;
    const pathLength = Math.max(defect.pathLength ?? 0, 1e-6);
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
    const boxColor = app.state.redMode ? "rgba(125,255,125,0.95)" : "#1c9a34";
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

  function collectMergedDefectsForEye(eye) {
    const groups = {
      pen: [],
      erase: [],
      haemorrhage: [],
    };

    app.state.strokes[eye].forEach((strokeObj) => {
      const absPoints = strokeObj.points.map((point) =>
        app.canvasController.toAbs(point),
      );
      if (absPoints.length < 2) {
        return;
      }
      const lineWidth =
        strokeObj.lineWidth ?? TOOL_STYLES[strokeObj.tool].lineWidth;
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
          text:
            `<b>${eye}:</b> ${formatPct(maskStats.totalPct)} total, ` +
            `${formatPct(maskStats.centralPct)} central, ${formatPct(maskStats.peripheralPct)} peripheral`,
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
    const mergedDefects = collectMergedDefectsForEye(app.state.currentEye);
    drawZoneHighlights();
    mergedDefects.forEach((defect) => {
      const defectType = getDefectType(defect);
      drawHull(defect.hull, defect.tool, defectType);
    });
    drawBoundingBoxes(mergedDefects);
  }

  function analyzeDrawing() {
    app.state.lastAnalysisResults = analyzeAll();
    app.state.analysisDirty = false;
    app.setReportButtonEnabled(true);

    resultText.innerHTML =
      `${app.state.lastAnalysisResults.RE.text}<br>` +
      `${app.state.lastAnalysisResults.LE.text}`;

    app.canvasController.redraw();
    drawMergedDefects();
  }

  return {
    analyzeDrawing,
    drawMergedDefects,
  };
}
