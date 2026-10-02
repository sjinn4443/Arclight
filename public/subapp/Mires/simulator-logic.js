export const NEWTON_SCORING = Object.freeze({
  correctToleranceMmHg: 2,
  closeToleranceMmHg: 3,
});

export const NEWTON_BANDS = Object.freeze([
  { id: "very_below_20", label: "<16", min: 10, max: 15 },
  { id: "just_below_20", label: "16-19", min: 16, max: 19 },
  { id: "exactly_20", label: "20", min: 20, max: 20 },
  { id: "range_21_24", label: "21-24", min: 21, max: 24 },
  { id: "exactly_25", label: "25", min: 25, max: 25 },
  { id: "range_26_29", label: "26-29", min: 26, max: 29 },
  { id: "exactly_30", label: "30", min: 30, max: 30 },
  { id: "above_30_bit", label: "31-34", min: 31, max: 34 },
  { id: "well_above", label: "35+", min: 35, max: 50 },
]);

export function buildIopBuckets(minIop, maxIop, bucketCount) {
  const safeCount = Math.max(1, Math.floor(bucketCount));
  const total = maxIop - minIop + 1;
  const baseSize = Math.floor(total / safeCount);
  let remainder = total % safeCount;
  let cursor = minIop;
  const buckets = [];

  for (let index = 0; index < safeCount; index += 1) {
    const size = baseSize + (remainder > 0 ? 1 : 0);
    const bucketMin = cursor;
    const bucketMax = cursor + size - 1;
    buckets.push({ min: bucketMin, max: bucketMax });
    cursor = bucketMax + 1;
    if (remainder > 0) remainder -= 1;
  }

  return buckets;
}

export function pickLeastUsedBucket(usage, random = Math.random) {
  const minUsage = Math.min(...usage);
  const candidates = [];
  usage.forEach((count, index) => {
    if (count === minUsage) candidates.push(index);
  });
  return candidates[Math.floor(random() * candidates.length)];
}

export function sampleBucketValue(bucket, lastValue, random = Math.random) {
  const span = bucket.max - bucket.min + 1;
  let value = bucket.min + Math.floor(random() * span);
  if (span <= 1) return value;

  for (let attempt = 0; attempt < 4 && value === lastValue; attempt += 1) {
    value = bucket.min + Math.floor(random() * span);
  }
  return value;
}

export function classifyNewtonBand(iop, bands = NEWTON_BANDS) {
  return (
    bands.find((band) => iop >= band.min && iop <= band.max) ??
    bands[bands.length - 1]
  );
}

export function getNewtonBandById(id, bands = NEWTON_BANDS) {
  return bands.find((band) => band.id === id) ?? null;
}

export function getNewtonGuessErrorMmHg(
  actualIop,
  guessId,
  bands = NEWTON_BANDS,
) {
  const guessBand = getNewtonBandById(guessId, bands);
  if (!guessBand) return null;
  if (actualIop < guessBand.min) return guessBand.min - actualIop;
  if (actualIop > guessBand.max) return actualIop - guessBand.max;
  return 0;
}

export function evaluateNewtonSubmission(
  actualIop,
  selectedGuess,
  scoring = NEWTON_SCORING,
  bands = NEWTON_BANDS,
) {
  const errorMmHg = getNewtonGuessErrorMmHg(actualIop, selectedGuess, bands);
  return {
    errorMmHg,
    isCorrect:
      typeof errorMmHg === "number" &&
      errorMmHg <= scoring.correctToleranceMmHg,
    isClose:
      typeof errorMmHg === "number" && errorMmHg === scoring.closeToleranceMmHg,
  };
}

export function advanceTrainingLock({
  isCentered,
  isInnerEdgeTouching,
  hasUserAdjusted,
  lockMs,
  requiredLockMs,
  lockDecayFactor,
  centerError,
  centerTolerancePx,
  centerToleranceHoldMultiplier,
  edgeError,
  innerEdgeTolerancePx,
  innerEdgeHoldMultiplier,
  dtMs,
}) {
  const centerHoldThreshold = centerTolerancePx * centerToleranceHoldMultiplier;
  const edgeHoldThreshold = innerEdgeTolerancePx * innerEdgeHoldMultiplier;
  const nextCentered = isCentered
    ? centerError <= centerHoldThreshold
    : centerError <= centerTolerancePx;
  const nextInnerEdgeTouching = isInnerEdgeTouching
    ? edgeError <= edgeHoldThreshold
    : edgeError <= innerEdgeTolerancePx;
  const isAligned = nextCentered && nextInnerEdgeTouching;
  let nextLockMs = lockMs;
  let isRevealed = false;

  if (!hasUserAdjusted) {
    nextLockMs = 0;
  } else if (isAligned) {
    nextLockMs += dtMs;
    if (nextLockMs >= requiredLockMs) {
      nextLockMs = requiredLockMs;
      isRevealed = true;
    }
  } else {
    const isNearTarget =
      centerError <= centerHoldThreshold * 1.25 &&
      edgeError <= edgeHoldThreshold * 1.25;
    nextLockMs =
      nextLockMs > 0 && isNearTarget
        ? Math.max(0, nextLockMs - dtMs * lockDecayFactor)
        : 0;
  }

  return {
    isCentered: nextCentered,
    isInnerEdgeTouching: nextInnerEdgeTouching,
    isRevealed,
    lockMs: nextLockMs,
  };
}
