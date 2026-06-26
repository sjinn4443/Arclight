const COMPLETE_TICK_CLASS = "lesson-complete-tick";
const COMPLETE_LABEL_CLASS = "lesson-complete-label";
const FOLDER_LEVEL_COLOURS = Object.freeze({
  primary: "#15e115",
  intermediate: "#f25600",
  advanced: "#e41e26",
});
const COMPLETE_TICK_MARKUP = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" stroke-width="2.2"></circle>
    <path d="M7.4 12.2l3.1 3.1 6.2-6.7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>
`;

let lessonCompletionTickObserver = null;
let lessonCompletionTickScanQueued = false;

function hasUsableColour(value) {
  return (
    value &&
    value !== "transparent" &&
    value !== "rgba(0, 0, 0, 0)" &&
    value !== "rgba(0,0,0,0)"
  );
}

function resolveProgressColour(row, explicitColour = "") {
  if (hasUsableColour(explicitColour)) return explicitColour;

  const fill =
    row?.querySelector?.(".lesson-progress__fill") ||
    row?.querySelector?.(".progress-fill");
  if (!fill) return "";

  const computed = getComputedStyle(fill);
  return hasUsableColour(computed.backgroundColor)
    ? computed.backgroundColor
    : "";
}

function getFolderThumbBackgroundText(row) {
  const thumb = row?.querySelector?.(".thumb");
  if (!thumb) return "";

  let computedBackground = "";
  try {
    computedBackground = getComputedStyle(thumb).backgroundImage;
  } catch {
    computedBackground = "";
  }

  return [
    thumb.style?.backgroundImage,
    thumb.getAttribute?.("style"),
    computedBackground,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function readFolderLevelFromRow(row) {
  const explicitLevel = String(row?.dataset?.level || "").toLowerCase();
  if (FOLDER_LEVEL_COLOURS[explicitLevel]) return explicitLevel;

  const backgroundText = getFolderThumbBackgroundText(row);
  if (backgroundText.includes("advanced_folder")) return "advanced";
  if (backgroundText.includes("intermediate_folder")) return "intermediate";
  if (backgroundText.includes("primary_folder")) return "primary";

  const levelEl = row?.closest?.(
    ".pupil-level--primary, .pupil-level--intermediate, .pupil-level--advanced",
  );
  if (levelEl?.classList?.contains("pupil-level--advanced")) {
    return "advanced";
  }
  if (levelEl?.classList?.contains("pupil-level--intermediate")) {
    return "intermediate";
  }
  if (levelEl?.classList?.contains("pupil-level--primary")) return "primary";

  return "";
}

export function getFolderCompletionColourForRow(row, fallbackColour = "") {
  const level = readFolderLevelFromRow(row);
  return FOLDER_LEVEL_COLOURS[level] || fallbackColour;
}

function parseProgressPercent(value) {
  const match = String(value || "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;

  const percent = Number(match[0]);
  if (!Number.isFinite(percent)) return null;

  return Math.max(0, Math.min(100, percent));
}

function parseInlineWidthPercent(value) {
  const text = String(value || "");
  return text.includes("%") ? parseProgressPercent(text) : null;
}

function readProgressPercentFromRow(row) {
  if (!row) return 0;

  const fill =
    row.querySelector(".lesson-progress__fill") ||
    row.querySelector(".progress-fill");
  const progressbar = row.querySelector('[role="progressbar"]');

  const ariaPercent =
    parseProgressPercent(fill?.getAttribute("aria-valuenow")) ??
    parseProgressPercent(progressbar?.getAttribute("aria-valuenow"));
  if (ariaPercent != null) return ariaPercent;

  const inlineWidth = parseInlineWidthPercent(fill?.style?.width);
  if (inlineWidth != null) return inlineWidth;

  if (fill) {
    const fillRect = fill.getBoundingClientRect?.();
    const trackRect = (
      progressbar || fill.parentElement
    )?.getBoundingClientRect?.();
    if (fillRect?.width > 0 && trackRect?.width > 0) {
      return Math.max(
        0,
        Math.min(100, (fillRect.width / trackRect.width) * 100),
      );
    }
  }

  if (
    row.classList?.contains("is-progress-complete") ||
    row.classList?.contains("is-complete")
  ) {
    return 100;
  }

  return 0;
}

function rowHasLessonProgress(row) {
  return Boolean(
    row?.querySelector?.(".lesson-progress__fill, .progress-fill") ||
    row?.querySelector?.('[role="progressbar"]') ||
    row?.classList?.contains("is-progress-complete") ||
    row?.classList?.contains("is-complete"),
  );
}

function restoreTitleContent(title) {
  const label = title?.querySelector?.(`:scope > .${COMPLETE_LABEL_CLASS}`);
  if (!label) return;

  const tick = title.querySelector(`:scope > .${COMPLETE_TICK_CLASS}`);
  const nodes = Array.from(label.childNodes);
  nodes.forEach((node) => title.insertBefore(node, tick || label));
  label.remove();
}

function trimTrailingWhitespaceTextNodes(title) {
  while (
    title.lastChild &&
    title.lastChild.nodeType === Node.TEXT_NODE &&
    !title.lastChild.textContent.trim()
  ) {
    title.lastChild.remove();
  }
}

function prepareCompleteTitleContent(title) {
  const existingLabel = title.querySelector(
    `:scope > .${COMPLETE_LABEL_CLASS}`,
  );
  if (existingLabel) return existingLabel;

  const label = document.createElement("span");
  label.className = COMPLETE_LABEL_CLASS;

  const nodes = Array.from(title.childNodes).filter(
    (node) =>
      !(
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList?.contains(COMPLETE_TICK_CLASS)
      ),
  );

  nodes.forEach((node) => label.appendChild(node));
  trimTrailingWhitespaceTextNodes(label);
  title.insertBefore(label, title.querySelector(`.${COMPLETE_TICK_CLASS}`));

  return label;
}

function resetCompletionTickPosition(title, tick) {
  tick.style.removeProperty("position");
  tick.style.removeProperty("left");
  tick.style.removeProperty("top");
  tick.style.removeProperty("margin-left");
  title?.style?.removeProperty("position");
}

export function syncLessonCompletionTick(row, percent, colour = "") {
  if (!row) return;

  const safePercent = Number(percent);
  const isComplete = Number.isFinite(safePercent) && safePercent >= 99.5;
  const title = row.querySelector(".lesson-type");
  row.classList.toggle("is-progress-complete", isComplete);

  if (!title) return;

  let tick = title.querySelector(`.${COMPLETE_TICK_CLASS}`);
  if (!isComplete) {
    tick?.remove();
    restoreTitleContent(title);
    title.style.removeProperty("position");
    row.style.removeProperty("--lesson-complete-color");
    return;
  }

  prepareCompleteTitleContent(title);
  if (!tick) {
    tick = document.createElement("span");
    tick.className = COMPLETE_TICK_CLASS;
    tick.setAttribute("aria-label", "Complete");
    tick.setAttribute("title", "Complete");
    tick.setAttribute(
      "data-i18n",
      "auto.videos.complete:aria-label;auto.videos.complete:title",
    );
    tick.innerHTML = COMPLETE_TICK_MARKUP;
    title.appendChild(tick);
    window.I18N?.applyTranslations?.(tick);
  }

  resetCompletionTickPosition(title, tick);

  const resolvedColour = resolveProgressColour(row, colour);
  if (resolvedColour) {
    row.style.setProperty("--lesson-complete-color", resolvedColour);
  }
}

export function syncVisibleLessonCompletionTicks(root = document) {
  root?.querySelectorAll?.(".lesson-row").forEach((row) => {
    if (!rowHasLessonProgress(row)) return;
    syncLessonCompletionTick(row, readProgressPercentFromRow(row));
  });
}

function scheduleLessonCompletionTickScan(root = document) {
  if (lessonCompletionTickScanQueued) return;
  lessonCompletionTickScanQueued = true;

  requestAnimationFrame(() => {
    lessonCompletionTickScanQueued = false;
    syncVisibleLessonCompletionTicks(root);
  });
}

export function initializeLessonCompletionTickObserver(root = document) {
  if (lessonCompletionTickObserver) {
    syncVisibleLessonCompletionTicks(root);
    return;
  }

  syncVisibleLessonCompletionTicks(root);

  const observerRoot = root?.documentElement || root?.body || root;
  if (!observerRoot || typeof MutationObserver === "undefined") return;

  lessonCompletionTickObserver = new MutationObserver((mutations) => {
    const shouldScan = mutations.some((mutation) => {
      if (mutation.type === "childList") {
        const target = mutation.target;
        if (
          target?.closest?.(".lesson-row") &&
          (target.matches?.(".lesson-type") || target.closest?.(".lesson-type"))
        ) {
          return true;
        }

        return Array.from(mutation.addedNodes).some(
          (node) =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches?.(".lesson-row") ||
              node.querySelector?.(
                ".lesson-row, .lesson-progress__fill, .progress-fill",
              )),
        );
      }

      if (mutation.type !== "attributes") return false;

      const target = mutation.target;
      return Boolean(
        target?.closest?.(".lesson-row") &&
        (target.matches?.(
          ".lesson-progress__fill, .progress-fill, [role='progressbar']",
        ) ||
          target.classList?.contains("lesson-row")),
      );
    });

    if (shouldScan) scheduleLessonCompletionTickScan(root);
  });

  lessonCompletionTickObserver.observe(observerRoot, {
    attributes: true,
    attributeFilter: ["aria-valuenow", "class", "style"],
    childList: true,
    subtree: true,
  });

  window.addEventListener(
    "page:loaded",
    () => scheduleLessonCompletionTickScan(root),
    { passive: true },
  );
  document.addEventListener(
    "page:shown",
    () => scheduleLessonCompletionTickScan(root),
    { passive: true },
  );
}
