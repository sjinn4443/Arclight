export const ANALYSIS_RESOLUTION = 400;

export const CENTRAL_ZONE = Object.freeze({
  left: 0.3,
  right: 0.7,
  top: 0.3,
  bottom: 0.7,
});

const DEFAULT_NORMALISED_LINE_WIDTH = 2 / 284;
const MIN_NORMALISED_LINE_WIDTH = 1 / 2000;
const MAX_NORMALISED_LINE_WIDTH = 0.2;

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function isFiniteNumber(value) {
  return Number.isFinite(value);
}

function sanitisePoints(points) {
  if (!Array.isArray(points)) {
    return [];
  }

  return points
    .filter((point) => isFiniteNumber(point?.x) && isFiniteNumber(point?.y))
    .map((point) => ({
      x: clamp(point.x, 0, 1),
      y: clamp(point.y, 0, 1),
    }));
}

export function normaliseStrokeWidth(lineWidth, gridSize) {
  if (
    !isFiniteNumber(lineWidth) ||
    !isFiniteNumber(gridSize) ||
    lineWidth <= 0 ||
    gridSize <= 0
  ) {
    return DEFAULT_NORMALISED_LINE_WIDTH;
  }

  return clamp(
    lineWidth / gridSize,
    MIN_NORMALISED_LINE_WIDTH,
    MAX_NORMALISED_LINE_WIDTH,
  );
}

export function getNormalisedStrokeWidth(stroke) {
  if (
    isFiniteNumber(stroke?.normalisedLineWidth) &&
    stroke.normalisedLineWidth > 0
  ) {
    return clamp(
      stroke.normalisedLineWidth,
      MIN_NORMALISED_LINE_WIDTH,
      MAX_NORMALISED_LINE_WIDTH,
    );
  }

  if (
    isFiniteNumber(stroke?.lineWidth) &&
    isFiniteNumber(stroke?.gridSizeAtCapture)
  ) {
    return normaliseStrokeWidth(stroke.lineWidth, stroke.gridSizeAtCapture);
  }

  return DEFAULT_NORMALISED_LINE_WIDTH;
}

function polygonArea(points) {
  if (points.length < 3) {
    return 0;
  }

  let area = 0;
  for (let index = 0; index < points.length; index += 1) {
    const nextIndex = (index + 1) % points.length;
    area += points[index].x * points[nextIndex].y;
    area -= points[nextIndex].x * points[index].y;
  }
  return Math.abs(area) / 2;
}

function distance(pointA, pointB) {
  return Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y);
}

export function isClosedRegionStroke(stroke) {
  if (stroke?.tool === "pen") {
    return false;
  }

  const points = sanitisePoints(stroke?.points);
  if (points.length < 4) {
    return false;
  }

  const closureDistance = Math.max(
    getNormalisedStrokeWidth(stroke) * 1.75,
    0.03,
  );
  return (
    distance(points[0], points[points.length - 1]) <= closureDistance &&
    polygonArea(points) >= 0.0001
  );
}

function pointSegmentDistance(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared <= 1e-12) {
    return distance(point, start);
  }

  const projection = clamp(
    ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared,
    0,
    1,
  );

  return Math.hypot(
    point.x - (start.x + projection * dx),
    point.y - (start.y + projection * dy),
  );
}

function pointInPolygon(point, polygon) {
  let inside = false;

  for (
    let currentIndex = 0, previousIndex = polygon.length - 1;
    currentIndex < polygon.length;
    previousIndex = currentIndex, currentIndex += 1
  ) {
    const current = polygon[currentIndex];
    const previous = polygon[previousIndex];
    const crossesY = current.y > point.y !== previous.y > point.y;

    if (!crossesY) {
      continue;
    }

    const crossingX =
      ((previous.x - current.x) * (point.y - current.y)) /
        (previous.y - current.y) +
      current.x;

    if (point.x < crossingX) {
      inside = !inside;
    }
  }

  return inside;
}

function markDisc(mask, resolution, centre, radius) {
  const minX = clamp(
    Math.floor((centre.x - radius) * resolution),
    0,
    resolution - 1,
  );
  const maxX = clamp(
    Math.ceil((centre.x + radius) * resolution),
    0,
    resolution - 1,
  );
  const minY = clamp(
    Math.floor((centre.y - radius) * resolution),
    0,
    resolution - 1,
  );
  const maxY = clamp(
    Math.ceil((centre.y + radius) * resolution),
    0,
    resolution - 1,
  );

  for (let y = minY; y <= maxY; y += 1) {
    const sampleY = (y + 0.5) / resolution;
    for (let x = minX; x <= maxX; x += 1) {
      const sampleX = (x + 0.5) / resolution;
      if (Math.hypot(sampleX - centre.x, sampleY - centre.y) <= radius) {
        mask[y * resolution + x] = 1;
      }
    }
  }
}

function markSegment(mask, resolution, start, end, radius) {
  const minX = clamp(
    Math.floor((Math.min(start.x, end.x) - radius) * resolution),
    0,
    resolution - 1,
  );
  const maxX = clamp(
    Math.ceil((Math.max(start.x, end.x) + radius) * resolution),
    0,
    resolution - 1,
  );
  const minY = clamp(
    Math.floor((Math.min(start.y, end.y) - radius) * resolution),
    0,
    resolution - 1,
  );
  const maxY = clamp(
    Math.ceil((Math.max(start.y, end.y) + radius) * resolution),
    0,
    resolution - 1,
  );

  for (let y = minY; y <= maxY; y += 1) {
    const sampleY = (y + 0.5) / resolution;
    for (let x = minX; x <= maxX; x += 1) {
      const sample = { x: (x + 0.5) / resolution, y: sampleY };
      if (pointSegmentDistance(sample, start, end) <= radius) {
        mask[y * resolution + x] = 1;
      }
    }
  }
}

function markPolyline(mask, resolution, points, width) {
  const radius = Math.max(width / 2, 0.5 / resolution);

  if (points.length === 1) {
    markDisc(mask, resolution, points[0], radius);
    return;
  }

  for (let index = 1; index < points.length; index += 1) {
    markSegment(mask, resolution, points[index - 1], points[index], radius);
  }
}

function markPolygon(mask, resolution, points) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = clamp(
    Math.floor(Math.min(...xs) * resolution),
    0,
    resolution - 1,
  );
  const maxX = clamp(
    Math.ceil(Math.max(...xs) * resolution),
    0,
    resolution - 1,
  );
  const minY = clamp(
    Math.floor(Math.min(...ys) * resolution),
    0,
    resolution - 1,
  );
  const maxY = clamp(
    Math.ceil(Math.max(...ys) * resolution),
    0,
    resolution - 1,
  );

  for (let y = minY; y <= maxY; y += 1) {
    const sampleY = (y + 0.5) / resolution;
    for (let x = minX; x <= maxX; x += 1) {
      const sample = { x: (x + 0.5) / resolution, y: sampleY };
      if (pointInPolygon(sample, points)) {
        mask[y * resolution + x] = 1;
      }
    }
  }
}

function createMarkMask(strokes, resolution) {
  const mask = new Uint8Array(resolution * resolution);
  let recordedMarkCount = 0;

  for (const stroke of Array.isArray(strokes) ? strokes : []) {
    const points = sanitisePoints(stroke?.points);
    if (points.length === 0) {
      continue;
    }

    recordedMarkCount += 1;
    const width = getNormalisedStrokeWidth(stroke);
    if (isClosedRegionStroke(stroke)) {
      markPolygon(mask, resolution, points);
    }
    markPolyline(mask, resolution, points, width);
  }

  return { mask, recordedMarkCount };
}

function percentage(part, whole) {
  return whole > 0 ? (part / whole) * 100 : 0;
}

export function analyseEye(
  strokes,
  assessed = false,
  resolution = ANALYSIS_RESOLUTION,
) {
  const safeResolution =
    Number.isInteger(resolution) && resolution >= 50
      ? resolution
      : ANALYSIS_RESOLUTION;
  const { mask, recordedMarkCount } = createMarkMask(strokes, safeResolution);
  const effectiveAssessed = assessed || recordedMarkCount > 0;

  if (!effectiveAssessed) {
    return {
      status: "not-assessed",
      totalPct: 0,
      centralZonePct: 0,
      outerZonePct: 0,
      recordedMarkCount: 0,
    };
  }

  let totalMarked = 0;
  let centralMarked = 0;
  let centralCells = 0;

  for (let y = 0; y < safeResolution; y += 1) {
    const normalisedY = (y + 0.5) / safeResolution;
    for (let x = 0; x < safeResolution; x += 1) {
      const normalisedX = (x + 0.5) / safeResolution;
      const isCentral =
        normalisedX >= CENTRAL_ZONE.left &&
        normalisedX <= CENTRAL_ZONE.right &&
        normalisedY >= CENTRAL_ZONE.top &&
        normalisedY <= CENTRAL_ZONE.bottom;

      if (isCentral) {
        centralCells += 1;
      }

      if (mask[y * safeResolution + x] === 0) {
        continue;
      }

      totalMarked += 1;
      if (isCentral) {
        centralMarked += 1;
      }
    }
  }

  const totalCells = safeResolution * safeResolution;
  const outerCells = totalCells - centralCells;
  const outerMarked = totalMarked - centralMarked;

  return {
    status: totalMarked > 0 ? "marked" : "clear",
    totalPct: percentage(totalMarked, totalCells),
    centralZonePct: percentage(centralMarked, centralCells),
    outerZonePct: percentage(outerMarked, outerCells),
    recordedMarkCount,
  };
}

export function analyseEyes(
  strokesByEye,
  assessedEyes,
  resolution = ANALYSIS_RESOLUTION,
) {
  return {
    RE: analyseEye(strokesByEye?.RE, assessedEyes?.RE, resolution),
    LE: analyseEye(strokesByEye?.LE, assessedEyes?.LE, resolution),
  };
}

export function formatPercentage(value) {
  if (!isFiniteNumber(value) || value <= 0) {
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

export function formatEyeResult(eye, result) {
  if (result.status === "not-assessed") {
    return `<b>${eye}:</b> Not assessed`;
  }

  if (result.status === "clear") {
    return `<b>${eye}:</b> No marks recorded`;
  }

  return (
    `<b>${eye}:</b> ${formatPercentage(result.totalPct)} of grid marked, ` +
    `${formatPercentage(result.centralZonePct)} of central zone, ` +
    `${formatPercentage(result.outerZonePct)} of outer zone`
  );
}
