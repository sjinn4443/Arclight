export function initSimulatorReset(
  dom,
  reload = () => window.location.reload(),
) {
  const button = dom.resetSimulatorButton;
  const status = dom.resetSimulatorStatus;
  if (!button || !status) return;

  let confirmationExpiresAt = 0;
  button.addEventListener("click", () => {
    const now = Date.now();
    if (now <= confirmationExpiresAt) {
      reload();
      return;
    }

    confirmationExpiresAt = now + 8000;
    button.textContent = "Confirm reset";
    status.textContent =
      "Press again within 8 seconds to restore the starting simulator state.";
    window.setTimeout(() => {
      if (Date.now() <= confirmationExpiresAt) return;
      confirmationExpiresAt = 0;
      button.textContent = "Reset simulator";
      status.textContent = "";
    }, 8100);
  });
}
