import * as CATARACT_MCQ_DATA from "../subapp/Cataract/src/mcq-data.js";
import * as GLAUCOMA_MCQ_DATA from "../subapp/Glaucoma/src/mcq-data.js";
import * as FUNDAL_MCQ_DATA from "../subapp/Fundal Reflex/src/mcq-bank.js";
import "../subapp/Squint/src/mcq-data.js";

const LEVEL_KEYS = ["primary", "intermediate", "advanced"];
const LEVEL_LABELS = {
  primary: "Primary",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const TOPIC_TITLES = {
  cataract: "Cataract",
  glaucoma: "Glaucoma",
  fundalReflex: "Fundal Reflex",
  squint: "Squint / Palsy",
};

function getModuleExport(namespace, key, fallback) {
  if (namespace && Object.prototype.hasOwnProperty.call(namespace, key)) {
    return namespace[key];
  }
  const defaultExport = namespace?.default;
  if (
    defaultExport &&
    Object.prototype.hasOwnProperty.call(defaultExport, key)
  ) {
    return defaultExport[key];
  }
  return fallback;
}

function capitalize(value) {
  const safe = String(value || "");
  return `${safe.charAt(0).toUpperCase()}${safe.slice(1)}`;
}

function normalizeQuestion(question) {
  return {
    prompt: question.prompt || question.question || "",
    options: Array.isArray(question.options) ? question.options.slice() : [],
    answerIndex: Number.isInteger(question.answerIndex)
      ? question.answerIndex
      : Number.isInteger(question.answer)
        ? question.answer
        : -1,
    explanation: question.explanation || "",
  };
}

function normalizeLevelQuestions(questions, count) {
  const normalized = (questions || []).map(normalizeQuestion);
  const safeCount = Number(count);
  if (!Number.isFinite(safeCount) || safeCount <= 0) return normalized;
  return normalized.slice(0, Math.min(normalized.length, safeCount));
}

function normalizeIndexedLevelTopic(topicKey, levels) {
  return levels.reduce((acc, level, index) => {
    const levelKey =
      LEVEL_KEYS[index] ||
      String(level.name || "")
        .trim()
        .toLowerCase();
    if (!levelKey) return acc;

    const pageId = `${topicKey}${capitalize(levelKey)}QuizPage`;
    acc[pageId] = {
      pageId,
      topicKey,
      topicTitle: TOPIC_TITLES[topicKey],
      levelKey,
      levelTitle: LEVEL_LABELS[levelKey] || level.name || capitalize(levelKey),
      returnPageId:
        topicKey === "glaucoma" ? "glaucomaInteractivePage" : `${topicKey}Page`,
      questions: normalizeLevelQuestions(level.questions, level.totalQuestions),
    };
    return acc;
  }, {});
}

function normalizeBankTopic(topicKey, bank, metaByLevel = {}) {
  return LEVEL_KEYS.reduce((acc, levelKey) => {
    const meta = metaByLevel[levelKey] || {};
    const pageId = `${topicKey}${capitalize(levelKey)}QuizPage`;
    acc[pageId] = {
      pageId,
      topicKey,
      topicTitle: TOPIC_TITLES[topicKey],
      levelKey,
      levelTitle: meta.title || LEVEL_LABELS[levelKey],
      returnPageId:
        topicKey === "fundalReflex"
          ? "fundalReflexInteractivePage"
          : `${topicKey}PalsyPage`,
      questions: normalizeLevelQuestions(bank[levelKey], meta.questionCount),
    };
    return acc;
  }, {});
}

const SQUINT_MCQ_BANK = globalThis.McqData?.MCQ_BANK || {};
const CATARACT_MCQ_LEVELS = getModuleExport(
  CATARACT_MCQ_DATA,
  "MCQ_LEVELS",
  [],
);
const GLAUCOMA_MCQ_LEVELS = getModuleExport(
  GLAUCOMA_MCQ_DATA,
  "MCQ_LEVELS",
  [],
);
const FUNDAL_MCQ_BANK = getModuleExport(FUNDAL_MCQ_DATA, "MCQ_BANK", {});
const FUNDAL_MCQ_LEVEL_META = getModuleExport(
  FUNDAL_MCQ_DATA,
  "MCQ_LEVEL_META",
  {},
);

export const INTERACTIVE_LEARNING_QUIZZES = Object.freeze({
  ...normalizeIndexedLevelTopic("cataract", CATARACT_MCQ_LEVELS),
  ...normalizeIndexedLevelTopic("glaucoma", GLAUCOMA_MCQ_LEVELS),
  ...normalizeBankTopic("fundalReflex", FUNDAL_MCQ_BANK, FUNDAL_MCQ_LEVEL_META),
  ...normalizeBankTopic("squint", SQUINT_MCQ_BANK),
});

export function getInteractiveLearningQuiz(pageId) {
  return INTERACTIVE_LEARNING_QUIZZES[String(pageId || "").trim()] || null;
}

export function getInteractiveLearningQuizPageIds() {
  return Object.keys(INTERACTIVE_LEARNING_QUIZZES);
}
