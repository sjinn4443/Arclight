function resolveWrapper(input) {
  return input?.closest(".spinner-container") ?? null;
}

function getPlaceholderText(input) {
  return (input?.getAttribute("placeholder") || "").trim();
}

export function syncVisualPlaceholder(input) {
  const wrapper = resolveWrapper(input);
  const placeholder = getPlaceholderText(input);
  if (!wrapper || !placeholder) {
    return;
  }

  wrapper.classList.add("has-visual-placeholder");
  wrapper.dataset.placeholder = placeholder;
  wrapper.dataset.empty = input.value.trim() === "" ? "true" : "false";
}

export function initVisualPlaceholder(input) {
  const placeholder = getPlaceholderText(input);
  if (!placeholder) {
    return;
  }

  syncVisualPlaceholder(input);
  input.addEventListener("input", () => {
    syncVisualPlaceholder(input);
  });
  input.addEventListener("change", () => {
    syncVisualPlaceholder(input);
  });
}
