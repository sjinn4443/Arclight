// Shared lessons keep their original content/progress; only their caller changes.
export const DIABETIC_CONDITION_PAGE = "diabeticRetinopathyPage";
const CONTEXT_KEY = "diabeticCondition:lessonOrigin";

function readContext() {
  try {
    return JSON.parse(sessionStorage.getItem(CONTEXT_KEY) || "null");
  } catch {
    return null;
  }
}

export function rememberDiabeticConditionLesson(row) {
  if (!row?.closest(`#${DIABETIC_CONDITION_PAGE}`)) return;
  try {
    sessionStorage.setItem(
      CONTEXT_KEY,
      JSON.stringify({
        routeName: row.dataset.route || "videos",
        target: row.dataset.target,
      }),
    );
    sessionStorage.removeItem("diabeticWorkshop:nextFlowEnabled");
    sessionStorage.removeItem("interactiveLearning:returnTarget");
  } catch {
    /* Learning remains available when session storage is unavailable. */
  }
}

export function isDiabeticConditionLesson(target, routeName) {
  const context = readContext();
  return Boolean(
    target &&
    context?.target === target &&
    (!routeName || context.routeName === routeName),
  );
}

export function clearDiabeticConditionContextUnless(routeName, target) {
  const context = readContext();
  if (!context) return;
  if (context.routeName === routeName && context.target === target) return;
  try {
    sessionStorage.removeItem(CONTEXT_KEY);
  } catch {
    /* Ignore storage failures. */
  }
}
