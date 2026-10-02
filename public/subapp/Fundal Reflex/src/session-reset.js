const RESET_WINDOW_MS = 5000;

export function initSessionReset({
  reload = () => window.location.reload(),
  timeoutMs = RESET_WINDOW_MS,
} = {}) {
  const button = document.getElementById("new-session-button");
  const status = document.getElementById("new-session-status");
  if (!button || !status) return null;

  let resetTimer = null;

  function disarm() {
    window.clearTimeout(resetTimer);
    resetTimer = null;
    button.dataset.armed = "false";
    button.textContent = "New session";
    status.textContent = "";
  }

  button.addEventListener("click", () => {
    if (button.dataset.armed === "true") {
      window.clearTimeout(resetTimer);
      reload();
      return;
    }

    button.dataset.armed = "true";
    button.textContent = "Clear session?";
    status.textContent = "Press again to restore the starting teaching case.";
    resetTimer = window.setTimeout(disarm, timeoutMs);
  });

  return { disarm };
}
