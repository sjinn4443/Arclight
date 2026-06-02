import { syncLessonCompletionTick } from "./lessonCompletionTick.js";

export const LESSON_PROGRESS_PREFIX = "lessonProgress:";
export const LESSON_PROGRESS_EVENT = "arclight:lesson-progress-changed";

const DEFAULT_PROGRESS_PREFIXES = [
  LESSON_PROGRESS_PREFIX,
  "videoProgress:",
  "childhoodWorkshop:progress:",
  "diabeticWorkshop:progress:",
  "glaucomaWorkshop:progress:",
];

function clampProgressPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

function clampProgressTimestamp(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n);
}

function readJSON(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    void 0;
  }
}

function normalizeProgressRecord(record) {
  return {
    percent: clampProgressPercent(record?.percent),
    updatedAt: clampProgressTimestamp(record?.updatedAt),
  };
}

function getBestProgressRecord(records) {
  return records.reduce(
    (best, current) => {
      if (current.percent > best.percent) return current;
      if (current.percent < best.percent) return best;

      return {
        percent: best.percent,
        updatedAt: Math.max(best.updatedAt, current.updatedAt),
      };
    },
    { percent: 0, updatedAt: 0 },
  );
}

export function readLessonProgress(
  target,
  prefixes = DEFAULT_PROGRESS_PREFIXES,
) {
  if (!target) return { percent: 0, updatedAt: 0 };

  return getBestProgressRecord(
    prefixes.map((prefix) =>
      normalizeProgressRecord(readJSON(`${prefix}${target}`)),
    ),
  );
}

export function setLessonProgress(
  target,
  percent,
  { mode = "max", prefix = LESSON_PROGRESS_PREFIX } = {},
) {
  if (!target) return 0;

  const key = `${prefix}${target}`;
  const previousRaw = readJSON(key) || {};
  const previous = normalizeProgressRecord(previousRaw);
  const next = clampProgressPercent(percent);
  const finalPercent =
    mode === "replace" ? next : Math.max(previous.percent, next);

  if (
    finalPercent !== previous.percent ||
    !Number.isFinite(Number(previousRaw.percent)) ||
    finalPercent >= 100
  ) {
    writeJSON(key, {
      percent: finalPercent,
      updatedAt: Date.now(),
    });
  }

  document.dispatchEvent(
    new CustomEvent(LESSON_PROGRESS_EVENT, {
      detail: { target, percent: finalPercent },
    }),
  );

  return finalPercent;
}

export function getLevelColourForRow(row) {
  const level = row?.closest?.(".pupil-level");
  if (!level) return "";

  const cap = level.querySelector(".pupil-level__cap");
  if (!cap) return "";

  const bg = getComputedStyle(cap).backgroundColor;
  if (!bg || bg === "rgba(0, 0, 0, 0)" || bg === "transparent") return "";
  return bg;
}

export function setLessonRowProgressUI(row, percent, colour = "") {
  if (!row) return;

  const safe = clampProgressPercent(percent);
  const rounded = Math.round(safe);
  const fill = row.querySelector(".lesson-progress__fill, .progress-fill");
  const bar = row.querySelector('.lesson-progress[role="progressbar"]');

  if (fill) {
    fill.style.width = `${safe}%`;
    if (colour) fill.style.backgroundColor = colour;
    fill.setAttribute("aria-valuenow", String(rounded));
    fill.title = `${rounded}% complete`;
  }

  if (bar) {
    bar.setAttribute("aria-valuenow", String(rounded));
  }

  syncLessonCompletionTick(row, safe, colour);
}

export function updateLessonProgressRows(
  root = document,
  {
    selector = ".lesson-row[data-target]",
    colourResolver = getLevelColourForRow,
  } = {},
) {
  root?.querySelectorAll?.(selector).forEach((row) => {
    const target = row.getAttribute("data-target");
    if (!target) return;

    const progress = readLessonProgress(target).percent;
    const colour = colourResolver?.(row) || "";
    setLessonRowProgressUI(row, progress, colour);
  });
}
