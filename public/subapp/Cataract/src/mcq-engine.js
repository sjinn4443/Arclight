export function shuffleArray(items) {
  const nextItems = items.slice();
  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const currentValue = nextItems[index];
    nextItems[index] = nextItems[swapIndex];
    nextItems[swapIndex] = currentValue;
  }
  return nextItems;
}

export function normalizeProgress(rawProgress, levelCount) {
  if (!rawProgress || typeof rawProgress !== "object") {
    return { unlockedLevelIndex: 0, completedLevels: [] };
  }

  const unlockedLevelIndex = Number.isInteger(rawProgress.unlockedLevelIndex)
    ? Math.max(0, Math.min(levelCount - 1, rawProgress.unlockedLevelIndex))
    : 0;

  const completedLevels = Array.isArray(rawProgress.completedLevels)
    ? rawProgress.completedLevels
        .filter(
          (index) =>
            Number.isInteger(index) && index >= 0 && index < levelCount,
        )
        .filter((value, index, arr) => arr.indexOf(value) === index)
    : [];

  return { unlockedLevelIndex, completedLevels };
}

export function evaluateMcqAnswers(
  questions,
  selectedAnswers,
  allowUnanswered,
) {
  let score = 0;
  for (
    let questionIndex = 0;
    questionIndex < questions.length;
    questionIndex += 1
  ) {
    const selectedOptionIndex = selectedAnswers[questionIndex];
    if (selectedOptionIndex === null || selectedOptionIndex === undefined) {
      if (!allowUnanswered) {
        return { isComplete: false, score: 0, total: questions.length };
      }
      continue;
    }
    if (Number(selectedOptionIndex) === questions[questionIndex].answerIndex) {
      score += 1;
    }
  }
  return { isComplete: true, score, total: questions.length };
}
