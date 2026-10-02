import questionBank, { MCQ_SOURCE_REFERENCES } from './questions.js';
import { MCQ_TIER_CONFIGS } from './app-constants.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function normalizeText(value) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function run() {
  assert(Array.isArray(questionBank), 'Question bank must be an array.');
  assert(
    questionBank.length === 30,
    `Expected exactly 30 questions, found ${questionBank.length}.`
  );

  const questionTextMap = new Map();
  const questionIds = new Set();
  const duplicateQuestions = [];
  const answerDistribution = new Map();
  let hasOptionKeyE = false;

  questionBank.forEach((question, index) => {
    const prefix = `Question #${index + 1}`;

    assert(
      typeof question.id === 'string' && /^swollen-discs-q\d{2}$/.test(question.id),
      `${prefix} must have a stable app-scoped id.`
    );
    assert(!questionIds.has(question.id), `${prefix} duplicates question id "${question.id}".`);
    questionIds.add(question.id);
    assert(
      question.clinicalSignOff === 'pending-independent-review',
      `${prefix} must declare clinical sign-off status.`
    );

    assert(
      typeof question.question === 'string' && question.question.trim().length > 0,
      `${prefix} has an invalid "question" value.`
    );
    assert(
      question.options && typeof question.options === 'object',
      `${prefix} is missing "options".`
    );
    assert(typeof question.correct === 'string', `${prefix} has an invalid "correct" value.`);
    assert(
      typeof question.explanation === 'string' && question.explanation.trim().length >= 40,
      `${prefix} must have a concise explanatory rationale.`
    );
    assert(
      typeof question.source === 'string' && Object.hasOwn(MCQ_SOURCE_REFERENCES, question.source),
      `${prefix} must reference a known source.`
    );
    assert(
      question.reviewStatus === MCQ_SOURCE_REFERENCES[question.source].status,
      `${prefix} has inconsistent source-review status.`
    );

    const normalizedQuestion = normalizeText(question.question);
    if (questionTextMap.has(normalizedQuestion)) {
      duplicateQuestions.push({
        first: questionTextMap.get(normalizedQuestion),
        duplicate: index + 1
      });
    } else {
      questionTextMap.set(normalizedQuestion, index + 1);
    }

    const optionEntries = Object.entries(question.options);
    assert(optionEntries.length >= 3, `${prefix} has fewer than 3 options.`);

    const optionKeys = optionEntries.map(([key]) => key);
    hasOptionKeyE = hasOptionKeyE || optionKeys.includes('e');
    assert(
      optionKeys.includes(question.correct),
      `${prefix} has "correct" key "${question.correct}" not present in options.`
    );

    const normalizedOptionTextMap = new Map();
    optionEntries.forEach(([key, value]) => {
      assert(
        typeof value === 'string' && value.trim().length > 0,
        `${prefix} option "${key}" is empty or invalid.`
      );

      const normalizedOptionText = normalizeText(value);
      if (normalizedOptionTextMap.has(normalizedOptionText)) {
        throw new Error(
          `${prefix} has duplicate option text in "${normalizedOptionTextMap.get(
            normalizedOptionText
          )}" and "${key}".`
        );
      }
      normalizedOptionTextMap.set(normalizedOptionText, key);
    });

    answerDistribution.set(question.correct, (answerDistribution.get(question.correct) || 0) + 1);
  });

  if (duplicateQuestions.length > 0) {
    const message = duplicateQuestions
      .slice(0, 5)
      .map((item) => `#${item.duplicate} duplicates #${item.first}`)
      .join(', ');
    throw new Error(`Duplicate question prompts found: ${message}`);
  }

  MCQ_TIER_CONFIGS.forEach((tier) => {
    const configuredIds = Array.isArray(tier.questionIds) ? tier.questionIds : [];
    configuredIds.forEach((questionId) => {
      assert(
        questionIds.has(questionId),
        `MCQ tier "${tier.name}" references missing question id "${questionId}".`
      );
    });

    assert(
      configuredIds.length >= tier.questionCount,
      `MCQ tier "${tier.name}" has fewer configured ids than required questions.`
    );
  });

  const configuredTierIds = MCQ_TIER_CONFIGS.flatMap((tier) => tier.questionIds || []);
  assert(
    configuredTierIds.length === questionBank.length,
    'Every question must belong to exactly one MCQ tier.'
  );
  assert(
    new Set(configuredTierIds).size === configuredTierIds.length,
    'A question must not appear in more than one MCQ tier.'
  );
  assert(
    questionBank.every((question) => configuredTierIds.includes(question.id)),
    'Every question must be reachable from an MCQ tier.'
  );

  const promptCorpus = questionBank.map((question) => question.question).join(' ');
  assert(
    !/\b(?:button|menu|screen|click|tap)\b/i.test(promptCorpus),
    'Clinical MCQs must not test app-interface mechanics.'
  );
  assert(
    !/\b(?:all|none) of the above\b/i.test(promptCorpus),
    'MCQs must use one best answer rather than all/none-of-the-above shortcuts.'
  );

  Object.entries(MCQ_SOURCE_REFERENCES).forEach(([sourceId, source]) => {
    assert(source.title && source.status, `Source "${sourceId}" is missing review metadata.`);
    assert(
      source.url === null || /^https:\/\//.test(source.url),
      `Source "${sourceId}" must use an HTTPS URL or an explicit local null.`
    );
  });

  const totalQuestions = questionBank.length;
  const uniqueAnswerKeys = answerDistribution.size;
  assert(
    uniqueAnswerKeys >= 3,
    `Answer key spread is too narrow: only ${uniqueAnswerKeys} unique correct-option keys.`
  );
  if (hasOptionKeyE) {
    assert(
      uniqueAnswerKeys >= 4,
      `Question bank includes "e" options but uses only ${uniqueAnswerKeys} unique correct keys.`
    );
    assert(
      (answerDistribution.get('e') || 0) > 0,
      'Question bank includes option key "e" but none are used as correct answers.'
    );
  }

  const distributionCounts = [...answerDistribution.values()];
  const maxCount = Math.max(...distributionCounts);
  const maxShare = maxCount / totalQuestions;
  assert(
    maxShare <= 0.6,
    `Answer key distribution too skewed: top option appears in ${(maxShare * 100).toFixed(
      1
    )}% of questions.`
  );

  const distributionSummary = [...answerDistribution.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => `${key}:${count}`)
    .join(' ');

  console.log('Question bank QA passed.');
  console.log(`Questions: ${totalQuestions}`);
  console.log(`Answer distribution: ${distributionSummary}`);
}

try {
  run();
} catch (error) {
  console.error(`Question bank QA failed: ${error.message}`);
  process.exit(1);
}
