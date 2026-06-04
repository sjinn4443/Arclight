export function computeDrawGeometry({
  canvasWidth,
  canvasHeight,
  imageNaturalWidth,
  imageNaturalHeight,
  imageScale,
  zoomFactor,
  bgOffsetX,
  bgOffsetY,
  circleRadius,
  circleX,
  isRightEye
}) {
  const scaleFactor = canvasHeight / imageNaturalHeight;
  const drawnImageWidth = imageNaturalWidth * scaleFactor;
  const drawnImageHeight = canvasHeight;
  const imageDrawOffsetX = (canvasWidth - drawnImageWidth) / 2;
  const imageDrawOffsetY = 0;

  const backgroundScale = imageScale * zoomFactor;
  const scaledWidth = drawnImageWidth * backgroundScale;
  const scaledHeight = drawnImageHeight * backgroundScale;

  const offsetXPos = imageDrawOffsetX + (drawnImageWidth - scaledWidth) / 2 + bgOffsetX;
  const offsetYPos = imageDrawOffsetY + (drawnImageHeight - scaledHeight) / 2 + bgOffsetY;

  const windowScale = zoomFactor;
  const effectiveCircleRadius = circleRadius * windowScale * scaleFactor;
  const flippedCircleX = isRightEye ? circleX : canvasWidth - circleX;

  return {
    scaleFactor,
    drawnImageWidth,
    imageDrawOffsetX,
    scaledWidth,
    scaledHeight,
    offsetXPos,
    offsetYPos,
    windowScale,
    effectiveCircleRadius,
    flippedCircleX
  };
}

function normaliseBoundsAxis(min, max) {
  if (min <= max) {
    return { min, max };
  }

  const centre = (min + max) / 2;
  return { min: centre, max: centre };
}

export function computeViewerBounds({
  canvasWidth,
  canvasHeight,
  imageNaturalWidth,
  imageNaturalHeight,
  circleRadius,
  zoomFactor
}) {
  const scaleFactor = canvasHeight / imageNaturalHeight;
  const drawnImageWidth = imageNaturalWidth * scaleFactor;
  const imageDrawOffsetX = (canvasWidth - drawnImageWidth) / 2;
  const effectiveCircleRadius = circleRadius * zoomFactor * scaleFactor;
  const minX = imageDrawOffsetX + effectiveCircleRadius;
  const maxX = imageDrawOffsetX + drawnImageWidth - effectiveCircleRadius;
  const minY = effectiveCircleRadius;
  const maxY = canvasHeight - effectiveCircleRadius;
  const xBounds = normaliseBoundsAxis(minX, maxX);
  const yBounds = normaliseBoundsAxis(minY, maxY);

  return {
    minX: xBounds.min,
    maxX: xBounds.max,
    minY: yBounds.min,
    maxY: yBounds.max
  };
}

export function clampCircleToBounds({ circleX, circleY, velocityX, velocityY, bounds }) {
  let nextX = circleX;
  let nextY = circleY;
  let nextVelocityX = velocityX;
  let nextVelocityY = velocityY;

  if (nextX < bounds.minX) {
    nextX = bounds.minX;
    nextVelocityX *= -0.5;
  }

  if (nextX > bounds.maxX) {
    nextX = bounds.maxX;
    nextVelocityX *= -0.5;
  }

  if (nextY < bounds.minY) {
    nextY = bounds.minY;
    nextVelocityY *= -0.5;
  }

  if (nextY > bounds.maxY) {
    nextY = bounds.maxY;
    nextVelocityY *= -0.5;
  }

  return {
    circleX: nextX,
    circleY: nextY,
    velocityX: nextVelocityX,
    velocityY: nextVelocityY
  };
}

export function computeReflexOpacity({ cataractLevel, darkTint, yellowTint }) {
  const minimumOpacity = cataractLevel === 3 ? 0.3 : 0.55;
  const tintAdjustedOpacity = 1 - darkTint * 2.8 - yellowTint * 1.2;
  return Math.max(minimumOpacity, tintAdjustedOpacity);
}
