const DEFAULT_PASS_RATIO = 0.7;

export function shuffleArray(items, randomFn = Math.random) {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(randomFn() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function pickTierOptions(optionEntries, correctKey, optionCount, randomFn) {
  if (!Number.isInteger(optionCount) || optionCount <= 0 || optionCount >= optionEntries.length) {
    return shuffleArray(optionEntries, randomFn);
  }

  const correctEntry = optionEntries.find(([optionKey]) => optionKey === correctKey);
  if (!correctEntry) {
    return shuffleArray(optionEntries, randomFn).slice(0, optionCount);
  }

  const distractors = optionEntries.filter(([optionKey]) => optionKey !== correctKey);
  const selectedDistractors = shuffleArray(distractors, randomFn).slice(
    0,
    Math.max(0, optionCount - 1)
  );
  return shuffleArray([correctEntry, ...selectedDistractors], randomFn);
}

export function buildMcqTest(
  questionBank,
  questionCount = 7,
  randomFn = Math.random,
  optionCount = null
) {
  if (!Array.isArray(questionBank) || questionBank.length === 0) {
    return [];
  }

  const remainingQuestions = [...questionBank];
  const totalQuestions = Math.max(0, Math.min(questionCount, remainingQuestions.length));
  const hasOptionCount = optionCount !== null && optionCount !== undefined;
  const normalizedOptionCount = hasOptionCount
    ? Number.isInteger(optionCount)
      ? Math.max(2, optionCount)
      : Number.isFinite(Number(optionCount))
        ? Math.max(2, Math.floor(Number(optionCount)))
        : null
    : null;
  const pickedQuestions = [];

  for (let i = 0; i < totalQuestions; i += 1) {
    const randomIndex = Math.floor(randomFn() * remainingQuestions.length);
    pickedQuestions.push(remainingQuestions.splice(randomIndex, 1)[0]);
  }

  return pickedQuestions.map((sourceQuestion, questionIndex) => {
    const optionEntries = Object.entries(sourceQuestion.options || {});
    const shuffledOptionEntries = pickTierOptions(
      optionEntries,
      sourceQuestion.correct,
      normalizedOptionCount,
      randomFn
    );

    const choices = shuffledOptionEntries.map(([sourceKey, text], optionIndex) => {
      return {
        id: `q${questionIndex}o${optionIndex}${sourceKey}`,
        text
      };
    });

    const correctChoice = shuffledOptionEntries.find(([sourceKey]) => {
      return sourceKey === sourceQuestion.correct;
    });

    const correctChoiceIndex = correctChoice
      ? shuffledOptionEntries.findIndex(([sourceKey]) => sourceKey === sourceQuestion.correct)
      : -1;

    return {
      id: `q${questionIndex}`,
      prompt: sourceQuestion.question,
      choices,
      correctChoiceId:
        correctChoice && correctChoiceIndex >= 0 ? choices[correctChoiceIndex].id : null
    };
  });
}

export function evaluateMcqSubmission(
  testQuestions,
  selectedChoiceIds,
  passRatio = DEFAULT_PASS_RATIO
) {
  const questions = Array.isArray(testQuestions) ? testQuestions : [];
  const selected = Array.isArray(selectedChoiceIds) ? selectedChoiceIds : [];
  let score = 0;

  const details = questions.map((question, index) => {
    const selectedChoiceId = selected[index] || null;
    const selectedChoice =
      question.choices.find((choice) => choice.id === selectedChoiceId) || null;
    const correctChoice =
      question.choices.find((choice) => choice.id === question.correctChoiceId) || null;
    const isCorrect = selectedChoiceId !== null && selectedChoiceId === question.correctChoiceId;

    if (isCorrect) {
      score += 1;
    }

    return {
      index,
      prompt: question.prompt,
      selectedChoiceId,
      selectedChoiceText: selectedChoice ? selectedChoice.text : null,
      correctChoiceId: question.correctChoiceId,
      correctChoiceText: correctChoice ? correctChoice.text : null,
      isCorrect
    };
  });

  const maxScore = questions.length;
  const passThreshold = maxScore === 0 ? 0 : Math.max(1, Math.ceil(maxScore * passRatio));
  const passed = maxScore > 0 && score >= passThreshold;

  return {
    score,
    maxScore,
    passThreshold,
    passed,
    details
  };
}

export function generatePassCode(length = 8, randomFn = Math.random) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(randomFn() * chars.length);
    result += chars.charAt(randomIndex);
  }

  return result;
}

export function formatMcqResultText(result) {
  if (!result) {
    return '';
  }

  const lines = [];
  const completedAt = result.completedAt || new Date().toISOString();
  const takenAtLocal = new Date(completedAt);
  const takenAtLine = Number.isNaN(takenAtLocal.valueOf())
    ? completedAt
    : takenAtLocal.toLocaleString();

  lines.push('Swollen Discs - MCQ Test Result');
  lines.push(`Taken: ${takenAtLine}`);
  lines.push(`Score: ${result.score}/${result.maxScore}`);
  lines.push(`Result: ${result.passed ? 'PASS' : 'FAIL'}`);
  lines.push(`Pass threshold: ${result.passThreshold}/${result.maxScore}`);
  if (typeof result.tierName === 'string' && result.tierName.length > 0) {
    lines.push(`Level: ${result.tierName}`);
  }
  if (result.timed) {
    lines.push(`Timed: ${result.timedOut ? 'Yes (time expired)' : 'Yes'}`);
  } else {
    lines.push('Timed: No');
  }

  if (result.passCode) {
    lines.push(`Code: ${result.passCode}`);
  }

  lines.push('');
  lines.push('Question breakdown:');

  result.details.forEach((detail) => {
    const selectedText = detail.selectedChoiceText || 'No answer selected';
    const correctText = detail.correctChoiceText || 'Unknown';

    lines.push(`${detail.index + 1}. ${detail.prompt}`);
    lines.push(`Your answer: ${selectedText}`);
    lines.push(`Correct answer: ${correctText}`);
    lines.push(`Status: ${detail.isCorrect ? 'Correct' : 'Incorrect'}`);
    lines.push('');
  });

  return lines.join('\n').trimEnd();
}
