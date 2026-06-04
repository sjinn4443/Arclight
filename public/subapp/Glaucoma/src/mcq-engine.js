import { clamp } from "./dom-utils.js";

export function shuffleArray(items, randomFn = Math.random) {
  const nextItems = [...items];
  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const randomValue = Number(randomFn());
    const maxRandom = 1 - Number.EPSILON;
    const boundedRandom = Number.isFinite(randomValue)
      ? clamp(randomValue, 0, maxRandom)
      : 0;
    const swapIndex = Math.floor(boundedRandom * (index + 1));
    const currentValue = nextItems[index];
    nextItems[index] = nextItems[swapIndex];
    nextItems[swapIndex] = currentValue;
  }
  return nextItems;
}

function normaliseSelectedOptionIndex(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  const numericValue = Number(value);
  return Number.isInteger(numericValue) && numericValue >= 0
    ? numericValue
    : null;
}

export function evaluateMcqAnswers({
  questions,
  selectedAnswers,
  allowUnanswered = false,
}) {
  if (!Array.isArray(questions) || !Array.isArray(selectedAnswers)) {
    return { isComplete: false, score: 0, total: 0 };
  }

  let score = 0;
  for (
    let questionIndex = 0;
    questionIndex < questions.length;
    questionIndex += 1
  ) {
    const selectedOptionIndex = normaliseSelectedOptionIndex(
      selectedAnswers[questionIndex],
    );
    if (selectedOptionIndex === null || selectedOptionIndex === undefined) {
      if (!allowUnanswered) {
        return { isComplete: false, score: 0, total: questions.length };
      }
      continue;
    }
    if (selectedOptionIndex === questions[questionIndex].answerIndex) {
      score += 1;
    }
  }

  return { isComplete: true, score, total: questions.length };
}

export function normalizeProgress(rawProgress, levelCount) {
  const safeLevelCount = Math.max(1, Number(levelCount) || 1);

  if (!rawProgress || typeof rawProgress !== "object") {
    return {
      unlockedLevelIndex: 0,
      completedLevels: [],
    };
  }

  const unlockedLevelIndex = Number.isInteger(rawProgress.unlockedLevelIndex)
    ? clamp(rawProgress.unlockedLevelIndex, 0, safeLevelCount - 1)
    : 0;

  const completedLevels = Array.isArray(rawProgress.completedLevels)
    ? rawProgress.completedLevels
        .filter(
          (index) =>
            Number.isInteger(index) && index >= 0 && index < safeLevelCount,
        )
        .filter((value, index, arr) => arr.indexOf(value) === index)
    : [];

  return {
    unlockedLevelIndex,
    completedLevels,
  };
}

export function markLevelComplete(progress, levelIndex, levelCount) {
  const next = normalizeProgress(progress, levelCount);
  const safeLevelCount = Math.max(1, Number(levelCount) || 1);
  if (
    !Number.isInteger(levelIndex) ||
    levelIndex < 0 ||
    levelIndex >= safeLevelCount
  ) {
    return next;
  }

  if (!next.completedLevels.includes(levelIndex)) {
    next.completedLevels.push(levelIndex);
  }

  next.unlockedLevelIndex = Math.max(
    next.unlockedLevelIndex,
    clamp(levelIndex + 1, 0, Math.max(0, safeLevelCount - 1)),
  );

  return next;
}
