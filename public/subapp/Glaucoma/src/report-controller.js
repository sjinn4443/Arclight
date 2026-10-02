import { $ } from "./dom-utils.js";
import { buildGlaucomaReport } from "./report.js";

function copyWithFallback(text, root) {
  const doc = root.ownerDocument ?? root;
  const textarea = doc.createElement("textarea");
  try {
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    doc.body.appendChild(textarea);
    textarea.select();
    return Boolean(doc.execCommand("copy"));
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

export function initReportController(riskController, root = document) {
  const reportButton = $("#reportButton", root);
  const reportModal = $("#reportModal", root);
  const closeButton = $("#closeReportModal", root);
  const copyButton = $("#copyReportButton", root);
  const reportText = $("#reportText", root);
  const copyStatus = $("#reportCopyStatus", root);

  if (!riskController || !reportButton || !reportModal || !reportText) {
    return;
  }

  let returnFocus = null;

  function closeReport() {
    reportModal.classList.remove("open");
    reportModal.setAttribute("aria-hidden", "true");
    if (copyStatus) copyStatus.textContent = "";
    if (returnFocus instanceof HTMLElement) returnFocus.focus();
    returnFocus = null;
  }

  function openReport() {
    const reportData = riskController.getReportData();
    const text = buildGlaucomaReport(reportData ?? {});
    if (!text) {
      return;
    }

    returnFocus = root.activeElement;
    reportText.textContent = text;
    if (copyStatus) copyStatus.textContent = "";
    reportModal.classList.add("open");
    reportModal.setAttribute("aria-hidden", "false");
    reportModal.querySelector(".modal-content")?.focus();
  }

  async function copyReport() {
    const text = reportText.textContent;
    if (!text) return;

    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        copied = true;
      } else {
        copied = copyWithFallback(text, root);
      }
    } catch {
      copied = copyWithFallback(text, root);
    }

    if (copyStatus)
      copyStatus.textContent = copied ? "Copied." : "Copy unavailable.";
  }

  reportButton.addEventListener("click", openReport);
  closeButton?.addEventListener("click", closeReport);
  copyButton?.addEventListener("click", copyReport);

  reportModal.addEventListener("click", (event) => {
    if (event.target === reportModal) closeReport();
  });

  root.addEventListener("keydown", (event) => {
    if (!reportModal.classList.contains("open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeReport();
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = [
      ...reportModal.querySelectorAll(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && root.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && root.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
}
