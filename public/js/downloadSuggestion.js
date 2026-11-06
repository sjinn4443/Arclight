let initialized = false;
const COUNT_KEY = "arclight:download-suggestion-clicks";
const SHOWN_KEY = "arclight:download-suggestion-shown";
const t = (text) => window.I18N?.translateLiteral?.(text, text) || text;
const ENTRY_ROUTES = new Set([
  "splashscreen",
  "languageinstall",
  "onboarding",
  "account",
  "interest",
  "intro",
]);
function inAccountFlow() {
  const route = String(window.location.hash || "")
    .replace(/^#\/?/, "")
    .split("/")[0];
  return ENTRY_ROUTES.has(document.body.dataset.currentRoute || route);
}

function ineligible() {
  return (
    localStorage.getItem(SHOWN_KEY) === "1" ||
    localStorage.getItem("arclight:download-started") === "1" ||
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    navigator.standalone === true
  );
}

export function initializeDownloadSuggestion(onDownload) {
  if (initialized) return;
  initialized = true;
  try {
    if (ineligible()) return;
  } catch {
    return;
  }
  let legacyDownload = false;
  // Older installations predate the explicit download-started preference.
  const legacyCheck = (async () => {
    try {
      if (!("caches" in window)) return;
      const names = (await caches.keys()).filter((name) =>
        name.startsWith("arclight-packs-"),
      );
      for (const name of names) {
        if ((await (await caches.open(name)).keys()).length) {
          legacyDownload = true;
          break;
        }
      }
    } catch {
      /* The invitation still works when storage is unavailable. */
    }
  })();
  let pending = false;
  document.addEventListener("click", async (event) => {
    if (
      !(event.target instanceof Element) ||
      event.target.closest(".modal-overlay")
    )
      return;
    try {
      if (ineligible() || legacyDownload || inAccountFlow()) return;
      const count = Math.min(
        15,
        (Number(localStorage.getItem(COUNT_KEY)) || 0) + 1,
      );
      localStorage.setItem(COUNT_KEY, String(count));
      if (count < 15 || pending) return;
      pending = true;
      await legacyCheck;
      // Allow the triggering navigation/action to finish before displaying a dialog.
      setTimeout(() => {
        pending = false;
        if (
          ineligible() ||
          inAccountFlow() ||
          legacyDownload ||
          navigator.onLine === false ||
          [...document.querySelectorAll(".modal-overlay:not(.hidden)")].some(
            (el) => el.getClientRects().length,
          )
        )
          return;
        localStorage.setItem(SHOWN_KEY, "1");
        showSuggestion(onDownload);
      }, 0);
    } catch {
      pending = false;
    }
  });
}

function showSuggestion(onDownload) {
  const previous = document.activeElement;
  const modal = document.createElement("div");
  modal.id = "downloadSuggestionModal";
  modal.className = "modal-overlay";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "downloadSuggestionTitle");
  modal.setAttribute("aria-describedby", "downloadSuggestionMessage");
  modal.innerHTML = `<div class="modal-box download-modal">
    <div class="modal-header"><span id="downloadSuggestionTitle"></span></div>
    <div class="modal-content"><p id="downloadSuggestionMessage"></p></div>
    <div class="modal-footer"><button type="button" id="downloadSuggestionLater"></button><button type="button" id="downloadSuggestionStart"></button></div></div>`;
  modal.querySelector("#downloadSuggestionTitle").textContent = t(
    "Download content for offline use?",
  );
  modal.querySelector("#downloadSuggestionMessage").textContent = t(
    "Keep learning without an internet connection. Choose the content you would like to download.",
  );
  const later = modal.querySelector("#downloadSuggestionLater");
  const start = modal.querySelector("#downloadSuggestionStart");
  later.textContent = t("Not now");
  start.textContent = t("Choose downloads");
  const close = () => {
    modal.remove();
    if (previous?.isConnected) previous.focus();
  };
  later.addEventListener("click", close);
  start.addEventListener("click", () => {
    close();
    void onDownload();
  });
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });
  modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
    if (event.key === "Tab") {
      event.preventDefault();
      (document.activeElement === later ? start : later).focus();
    }
  });
  document.body.append(modal);
  window.I18N?.applyTranslations?.(modal);
  start.focus();
}
