/** @jest-environment jsdom */
import { jest, test, expect, afterEach } from "@jest/globals";
import { initializePdfDownloads } from "../public/js/pdfDownloads.js";

initializePdfDownloads();
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
function start() {
  document.body.innerHTML = '<a download href="/lesson.pdf">Download PDF</a>';
  const link = document.querySelector("a");
  const event = new MouseEvent("click", { bubbles: true, cancelable: true });
  link.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(true);
  return link;
}
afterEach(() => {
  document.querySelector(".pdf-download-close")?.click();
  jest.restoreAllMocks();
  delete navigator.share;
  delete navigator.canShare;
});
test("PDF export uses file sharing and remains closable after cancellation", async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    blob: async () => ({
      size: 12,
      slice: () => ({ text: async () => "%PDF-" }),
    }),
  });
  navigator.canShare = jest.fn(() => true);
  navigator.share = jest
    .fn()
    .mockRejectedValue(new DOMException("Cancelled", "AbortError"));
  const link = start();
  await settle();
  const save = document.querySelector(
    ".pdf-download-actions button:last-child",
  );
  expect(save.disabled).toBe(false);
  save.click();
  await settle();
  expect(navigator.share).toHaveBeenCalledWith({ files: [expect.any(File)] });
  expect(document.querySelector("#pdfDownloadDialog")).not.toBeNull();
  expect(save.disabled).toBe(false);
  document.querySelector(".pdf-download-close").click();
  expect(document.querySelector("#pdfDownloadDialog")).toBeNull();
  expect(document.activeElement).toBe(link);
});
test("a missing offline PDF shows an error with a working exit", async () => {
  global.fetch = jest.fn().mockRejectedValue(new TypeError("Offline"));
  start();
  await settle();
  expect(document.querySelector("#pdfDownloadStatus").textContent).toContain(
    "PDF unavailable",
  );
  document.querySelector(".pdf-download-close").click();
  expect(document.querySelector("#pdfDownloadDialog")).toBeNull();
});
test("Close stays available while a PDF request is pending and aborts the request", () => {
  global.fetch = jest.fn(() => new Promise(() => {}));
  start();
  const signal = fetch.mock.calls[0][1].signal;
  document.querySelector(".pdf-download-close").click();
  expect(signal.aborted).toBe(true);
  expect(document.querySelector("#pdfDownloadDialog")).toBeNull();
});
