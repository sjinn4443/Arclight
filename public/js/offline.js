/**
 * @fileoverview This file manages the offline content download modal, allowing users to select and cache specific assets for offline use.
 */

import {
  fetchAllOfflineAssetUrls,
  cacheOfflineUrls,
} from "./languageinstall.js";

function announce(message, failed = false) {
  let status = document.getElementById("offlineDownloadStatus");
  if (!status) {
    status = document.createElement("p");
    status.id = "offlineDownloadStatus";
    document
      .querySelector("#offlineContentModal .modal-content")
      ?.append(status);
  }
  status.setAttribute("role", failed ? "alert" : "status");
  status.textContent = t(message);
}

export function initializeOffline() {
  wireOfflineModal();
  showOfflineContentModal();
}

export function showOfflineContentModal() {
  const el = document.getElementById("offlineContentModal");
  if (el) el.style.display = "flex";
}
export function closeOfflineContentModal() {
  const el = document.getElementById("offlineContentModal");
  if (el) el.style.display = "none";
}

function t(rawText, fallback = rawText) {
  return window.I18N?.translateLiteral?.(rawText, fallback) || fallback;
}

export async function downloadSelectedAssets() {
  const selected = Array.from(
    document.querySelectorAll("#offlineContentModal input:checked"),
  ).map((cb) => cb.value);
  const patterns = {
    cataract: /cataract/i,
    visualAcuity: /visual.?acuity|near.?vision|\/va\//i,
    directOphthalmoscopy: /ophthalmoscopy|\/do[_/]/i,
    frontOfEye: /front.?of.?eye|anterior/i,
    interactiveLearning: /\/subapp\/|interactive|\/quiz\//i,
    atomsCard: /atoms?card|\/atoms\//i,
    pupils: /pupil/i,
    fundalReflex: /fundal/i,
    rapd: /rapd|pupil/i,
    childhoodEyeScreening: /childhood|usaid/i,
    howToUseArclight: /arclight|howtouse/i,
    mobilePhoneAttachment: /phone|attachment/i,
    mires: /mires/i,
    morph: /morph/i,
    squintPalsy: /squint|palsy/i,
    caseBasedLearning: /case.?study|case.?based/i,
    anteriorSegmentVideo: /anterior|front.?of.?eye/i,
  };
  if (!selected.length) {
    announce("No assets selected for download.");
    return;
  }
  const button = document.getElementById("downloadSelectedAssetsBtn");
  if (button) button.disabled = true;
  try {
    announce("Preparing download…");
    const [manifest, response] = await Promise.all([
      fetchAllOfflineAssetUrls(),
      fetch("/shell-assets.json"),
    ]);
    if (!response.ok) throw new Error("Shell manifest unavailable");
    const shell = new Set((await response.json()).urls);
    const assets = manifest.assets.filter(
      (asset) =>
        shell.has(asset.url) ||
        selected.some((key) =>
          patterns[key]?.test(decodeURIComponent(asset.url)),
        ),
    );
    await cacheOfflineUrls({
      urls: assets.map((asset) => asset.url),
      bytes: assets.reduce((n, asset) => n + asset.bytes, 0),
      label: "Selected content",
    });
    announce("Download complete. Content is ready offline.");
  } catch (err) {
    console.error(err);
    announce("Download incomplete. Reconnect and try again to resume.", true);
  } finally {
    if (button) button.disabled = false;
  }
}

function wireOfflineModal() {
  document
    .getElementById("closeOfflineContentModalBtn")
    ?.addEventListener("click", closeOfflineContentModal);
  document
    .getElementById("downloadSelectedAssetsBtn")
    ?.addEventListener("click", downloadSelectedAssets);
  document.querySelectorAll(".showOfflineContentModalBtn").forEach((btn) => {
    btn.addEventListener("click", showOfflineContentModal);
  });
}
