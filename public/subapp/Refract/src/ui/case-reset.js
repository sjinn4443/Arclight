const CONFIRMATION_WINDOW_MS = 5000;

export function initCaseReset({
  reload = () => window.location.reload(),
  timeoutMs = CONFIRMATION_WINDOW_MS,
} = {}) {
  const button = document.getElementById("new-case-button");
  const status = document.getElementById("new-case-status");
  if (!button || !status) return null;
  let timer = null;

  function disarm() {
    window.clearTimeout(timer);
    button.dataset.armed = "false";
    button.textContent = "New case";
    status.textContent = "";
  }

  button.addEventListener("click", () => {
    if (button.dataset.armed === "true") {
      window.clearTimeout(timer);
      reload();
      return;
    }
    button.dataset.armed = "true";
    button.textContent = "Clear case?";
    status.textContent =
      "Press again to clear all entered prescription values and context.";
    timer = window.setTimeout(disarm, timeoutMs);
  });
  return { disarm };
}
