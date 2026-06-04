function randomIntInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloatInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function smallestCircularDifference(aDeg, bDeg) {
  const delta = Math.abs(aDeg - bDeg) % 360;
  return delta > 180 ? 360 - delta : delta;
}

export function normalizeTo180(angleDeg) {
  const normalized = angleDeg % 180;
  return normalized < 0 ? normalized + 180 : normalized;
}

export function smallestAxisDifference(aDeg, bDeg) {
  const delta = Math.abs(aDeg - bDeg) % 180;
  return delta > 90 ? 180 - delta : delta;
}

export function createCorticalCataractPattern(isLarge) {
  const wedgeCount = isLarge ? randomIntInRange(4, 5) : randomIntInRange(4, 4);
  const minSeparationDeg = isLarge ? 22 : 26;
  const wedgeAngles = [];
  let guard = 0;

  while (wedgeAngles.length < wedgeCount && guard < 500) {
    const candidate = randomIntInRange(0, 359);
    const hasCollision = wedgeAngles.some(
      (existingAngle) =>
        smallestCircularDifference(existingAngle, candidate) < minSeparationDeg,
    );
    if (!hasCollision) {
      wedgeAngles.push(candidate);
    }
    guard += 1;
  }

  while (wedgeAngles.length < wedgeCount) {
    wedgeAngles.push(randomIntInRange(0, 359));
  }

  return {
    wedges: wedgeAngles.map((angleDeg) => ({
      angleDeg,
      opacity: isLarge
        ? randomFloatInRange(0.86, 0.96)
        : randomFloatInRange(0.8, 0.9),
      widthDeg: isLarge
        ? randomFloatInRange(32, 44)
        : randomFloatInRange(24, 34),
    })),
  };
}

function normalizeTo360(angleDeg) {
  const normalized = angleDeg % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export function buildCorticalCataractOverlay(pattern) {
  return pattern.wedges
    .map((wedge) => {
      const startDeg = normalizeTo360(wedge.angleDeg - wedge.widthDeg * 0.5);
      const spanDeg = wedge.widthDeg.toFixed(1);
      const opacity = wedge.opacity.toFixed(2);
      return `
      conic-gradient(
        from ${startDeg.toFixed(1)}deg at 50% 50%,
        rgba(0, 0, 0, ${opacity}) 0deg,
        rgba(0, 0, 0, ${opacity}) ${spanDeg}deg,
        rgba(0, 0, 0, 0) ${spanDeg}deg,
        rgba(0, 0, 0, 0) 360deg
      )`;
    })
    .join(",\n");
}

export function randomCylinderAxisDeg() {
  const weightedRanges = [
    { min: 20, max: 70, weight: 4 },
    { min: 110, max: 160, weight: 4 },
    { min: 0, max: 19, weight: 1 },
    { min: 71, max: 109, weight: 1 },
    { min: 161, max: 179, weight: 1 },
  ];

  const totalWeight = weightedRanges.reduce(
    (sum, range) => sum + range.weight,
    0,
  );
  let roll = Math.random() * totalWeight;

  for (const range of weightedRanges) {
    roll -= range.weight;
    if (roll <= 0) {
      return randomIntInRange(range.min, range.max);
    }
  }

  return randomIntInRange(20, 70);
}
