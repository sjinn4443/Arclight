(function initSessionReset() {
  const button = document.getElementById("new-session-button");
  const status = document.getElementById("new-session-status");
  if (!button || !status) return;
  let timer = null;

  function disarm() {
    window.clearTimeout(timer);
    button.dataset.armed = "false";
    button.textContent = "New session";
    status.textContent = "";
  }

  button.addEventListener("click", () => {
    if (button.dataset.armed === "true") {
      window.clearTimeout(timer);
      window.location.reload();
      return;
    }
    button.dataset.armed = "true";
    button.textContent = "Clear session?";
    status.textContent = "Press again to restore the normal teaching scene.";
    timer = window.setTimeout(disarm, 5000);
  });
})();
