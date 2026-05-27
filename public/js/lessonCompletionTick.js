const COMPLETE_TICK_CLASS = "lesson-complete-tick";
const COMPLETE_TICK_MARKUP = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" stroke-width="2.2"></circle>
    <path d="M7.4 12.2l3.1 3.1 6.2-6.7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>
`;

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
    row.style.removeProperty("--lesson-complete-color");
    return;
  }

  if (!tick) {
    tick = document.createElement("span");
    tick.className = COMPLETE_TICK_CLASS;
    tick.setAttribute("aria-label", "Complete");
    tick.setAttribute("title", "Complete");
    tick.innerHTML = COMPLETE_TICK_MARKUP;
    title.appendChild(tick);
  }

  const resolvedColour = resolveProgressColour(row, colour);
  if (resolvedColour) {
    row.style.setProperty("--lesson-complete-color", resolvedColour);
  }
}
