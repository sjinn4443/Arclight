import { offlineText } from "./offlineExperience.js";

let initialized = false;

// iOS Home Screen apps can replace their only window with a native PDF viewer.
// Prepare a file in-app, then export it from a fresh user gesture instead.
export function initializePdfDownloads() {
  if (initialized) return;
  initialized = true;
  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[download][href]");
    if (!link || event.defaultPrevented) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !/\.pdf$/i.test(url.pathname)) return;
    event.preventDefault();
    void preparePdf(link, url);
  });
}

async function preparePdf(link, url) {
  if (document.getElementById("pdfDownloadDialog")) return;
  const dialog = document.createElement("dialog");
  dialog.id = "pdfDownloadDialog";
  dialog.setAttribute("aria-labelledby", "pdfDownloadTitle");
  dialog.setAttribute("aria-describedby", "pdfDownloadStatus");
  const title = document.createElement("h2");
  title.id = "pdfDownloadTitle";
  title.textContent = offlineText("Save PDF", "PDF 저장");
  const status = document.createElement("p");
  status.id = "pdfDownloadStatus";
  status.setAttribute("role", "status");
  status.textContent = offlineText(
    "Preparing PDF…",
    "PDF를 준비하는 중입니다…",
  );
  const actions = document.createElement("div");
  actions.className = "pdf-download-actions";
  const close = document.createElement("button");
  close.type = "button";
  close.className = "pdf-download-close";
  close.textContent = offlineText("Close", "닫기");
  const save = document.createElement("button");
  save.type = "button";
  save.textContent = title.textContent;
  save.disabled = true;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  let objectUrl;
  const dismiss = () => {
    controller.abort();
    clearTimeout(timer);
    dialog.remove();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    if (link.isConnected) link.focus();
  };
  close.addEventListener("click", dismiss);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    dismiss();
  });
  actions.append(close, save);
  dialog.append(title, status, actions);
  document.body.append(dialog);
  window.I18N?.applyTranslations?.(dialog);
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
  close.focus();
  try {
    const response = await fetch(url.href, { signal: controller.signal });
    if (!response.ok) throw new Error("PDF unavailable");
    const blob = await response.blob();
    if (!blob.size || (await blob.slice(0, 5).text()) !== "%PDF-")
      throw new Error("Invalid PDF response");
    if (!dialog.isConnected) return;
    const filename =
      link.download || decodeURIComponent(url.pathname.split("/").pop());
    const file = new File([blob], filename, { type: "application/pdf" });
    let canShare = false;
    try {
      canShare = Boolean(
        navigator.share && navigator.canShare?.({ files: [file] }),
      );
    } catch {
      /* Use a separate download context if sharing is unavailable. */
    }
    if (!canShare) objectUrl = URL.createObjectURL(file);
    const ready = offlineText(
      "Save a copy, then close this window to return to the lesson.",
      "사본을 저장한 뒤 이 창을 닫으면 학습으로 돌아갑니다.",
    );
    status.textContent = ready;
    save.disabled = false;
    save.addEventListener("click", async () => {
      save.disabled = true;
      try {
        if (canShare) {
          await navigator.share({ files: [file] });
        } else {
          const exportLink = document.createElement("a");
          exportLink.href = objectUrl;
          exportLink.download = filename;
          // Preserve the app window even if the browser previews the PDF.
          exportLink.target = "_blank";
          exportLink.rel = "noopener";
          document.body.append(exportLink);
          exportLink.click();
          exportLink.remove();
        }
        status.textContent = ready;
      } catch (error) {
        if (error.name !== "AbortError")
          status.textContent = offlineText(
            "Could not save PDF. Try again or close to return to the lesson.",
            "PDF를 저장하지 못했습니다. 다시 시도하거나 닫기를 눌러 학습으로 돌아가세요.",
          );
      } finally {
        save.disabled = false;
      }
    });
  } catch {
    if (dialog.isConnected)
      status.textContent = offlineText(
        "PDF unavailable. Connect to the internet and download this content first.",
        "PDF를 사용할 수 없습니다. 인터넷에 연결해 먼저 콘텐츠를 다운로드해 주세요.",
      );
  } finally {
    clearTimeout(timer);
  }
}
