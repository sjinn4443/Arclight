import {
  getOfflineInventory,
  invalidateOfflineInventory,
  offlineAssetPath,
  summarizeOfflineContent,
  offlineContentState,
} from "./offlineDownloadState.js";

let snapshot;
let request;
let manifest;
let manifestTime = 0;
let backgroundStarted = false;
let returnFocus;
let previousInventory;
let previousManifest;
let previousLanguage;

const t = (text) => window.I18N?.translateLiteral?.(text, text) || text;
const escape = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );

function ensureModal() {
  let modal = document.getElementById("downloadedContentsModal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "downloadedContentsModal";
  modal.className = "modal-overlay hidden";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "downloadedContentsTitle");
  modal.innerHTML = `<div class="modal-box download-modal">
    <div class="modal-header"><span id="downloadedContentsTitle"></span>
      <button type="button" class="modal-close" id="closeDownloadedContentsModalBtn">&times;</button></div>
    <div class="modal-content"></div>
    <div class="modal-footer"><button type="button" id="downloadedContentsCloseBtn"></button></div></div>`;
  const close = () => {
    modal.classList.add("hidden");
    if (returnFocus?.isConnected) returnFocus.focus();
  };
  modal
    .querySelectorAll("button")
    .forEach((button) => button.addEventListener("click", close));
  modal.addEventListener("click", (event) => {
    if (event.target === modal) close();
  });
  modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
    if (event.key !== "Tab") return;
    const elements = [...modal.querySelectorAll("button, summary")].filter(
      (el) => el.getClientRects().length,
    );
    const first = elements[0];
    const last = elements.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  document.body.append(modal);
  return modal;
}

function progress(summary) {
  const state = offlineContentState(summary);
  return `<span class="content-download-count content-download-count--${state}">${summary.completed}/${summary.total}</span>
    <progress class="content-download-progress content-download-progress--${state}" max="${Math.max(1, summary.total)}" value="${summary.completed}" aria-label="${escape(t("Downloaded contents"))}">${summary.completed}/${summary.total}</progress>`;
}

function displaySnapshot() {
  const modal = ensureModal();
  const content = modal.querySelector(".modal-content");
  const expanded = new Set(
    [...content.querySelectorAll("details[open]")].map(
      (el) => el.dataset.contentGroup,
    ),
  );
  const visible = snapshot.groups.filter((group) => group.started);
  content.innerHTML = `<p>${escape(t("Downloaded contents"))}</p>
    ${progress(snapshot.overall)}
    ${
      visible.length
        ? `<ul class="downloaded-content-list">${visible
            .map(
              (group) => `
      <li class="downloaded-content-item"><details data-content-group="${escape(group.id)}">
        <summary><span class="downloaded-content-item__title">${escape(t(group.label))}</span>${progress(group)}</summary>
        <ul class="downloaded-content-details"></ul></details></li>`,
            )
            .join("")}</ul>`
        : `<p>${escape(t("No downloaded contents found."))}</p>`
    }
    <p class="downloaded-content-size">${escape(t("Approx. cached size: {{size}}.").replace("{{size}}", snapshot.size))}</p>`;
  content.querySelectorAll("details").forEach((details) => {
    const populate = () => {
      if (!details.open || details.dataset.loaded) return;
      const group = snapshot.groups.find(
        (item) => item.id === details.dataset.contentGroup,
      );
      details.querySelector("ul").innerHTML = group.items
        .map((item) => {
          const state = item.complete
            ? "complete"
            : item.started
              ? "partial"
              : "empty";
          const label = item.complete
            ? "Downloaded"
            : item.started
              ? "Download incomplete"
              : "Not downloaded";
          return `<li><span>${escape(item.label)}</span><span class="content-download-count content-download-count--${state}">${escape(t(label))}</span></li>`;
        })
        .join("");
      details.dataset.loaded = "1";
    };
    details.addEventListener("toggle", populate);
    if (expanded.has(details.dataset.contentGroup)) {
      details.open = true;
      populate();
    }
  });
  window.I18N?.applyTranslations?.(content);
}

export async function refreshDownloadedContents() {
  if (request) return request;
  request = (async () => {
    const app = await import("./languageinstall.js");
    if (!manifest || Date.now() - manifestTime > 300000) {
      try {
        manifest = await app.fetchAllOfflineAssetUrls({
          preferCached: !manifest,
        });
        manifestTime = Date.now();
      } catch (error) {
        if (!manifest) throw error;
      }
    }
    const inventory = await getOfflineInventory();
    if (inventory === null) throw new Error(t("Download status unavailable"));
    const language =
      window.I18N?.getLanguage?.() || localStorage.getItem("prefLang");
    if (
      snapshot &&
      previousInventory === inventory &&
      previousManifest === manifest &&
      previousLanguage === language
    )
      return snapshot;
    const selection = app.resolveOfflineDownloadSelection(manifest, {
      mode: "full",
    });
    const urls = selection.urls.filter((url) => !app.isAppShellAsset(url));
    const summarize = (list) =>
      summarizeOfflineContent(list, inventory, { anyVideoQuality: true });
    const groups = app.OFFLINE_CATALOG_GROUPS.map((group) => ({
      ...summarize(
        urls.filter((url) => app.matchesOfflineCatalog(url, group.id)),
      ),
      id: group.id,
      label: group.label,
    }));
    const ungrouped = urls.filter(
      (url) =>
        !app.OFFLINE_CATALOG_GROUPS.some((group) =>
          app.matchesOfflineCatalog(url, group.id),
        ),
    );
    if (ungrouped.length)
      groups.push({
        ...summarize(ungrouped),
        id: "other",
        label: "Other content",
      });
    const cachedBytes = app
      .getOfflineManifestAssets(manifest)
      .filter((asset) => inventory.has(offlineAssetPath(asset.url)))
      .reduce((sum, asset) => sum + (Number(asset.bytes) || 0), 0);
    snapshot = {
      groups,
      overall: summarize(urls),
      size: app.formatDownloadSize(cachedBytes),
    };
    previousInventory = inventory;
    previousManifest = manifest;
    previousLanguage = language;
    const modal = document.getElementById("downloadedContentsModal");
    if (modal && !modal.classList.contains("hidden")) displaySnapshot();
    return snapshot;
  })();
  try {
    return await request;
  } finally {
    request = null;
  }
}

export function initializeOfflineContentsBackground() {
  if (backgroundStarted) return;
  backgroundStarted = true;
  let timer;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (document.visibilityState !== "hidden")
        void refreshDownloadedContents().catch(() => {});
    }, 1000);
  };
  schedule();
  setInterval(schedule, 60000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") schedule();
  });
  document.addEventListener("offline:contents-changed", schedule);
  window.addEventListener("online", schedule);
  navigator.serviceWorker?.addEventListener?.("message", (event) => {
    if (event.data?.type === "CACHE_CONTENTS_CHANGED")
      invalidateOfflineInventory();
  });
}

export async function showDownloadedContents() {
  returnFocus = document.activeElement;
  const modal = ensureModal();
  modal.querySelector("#downloadedContentsTitle").textContent = t(
    "Downloaded Contents",
  );
  modal.querySelector("#downloadedContentsCloseBtn").textContent = t("Close");
  modal.querySelector(".modal-close").setAttribute("aria-label", t("Close"));
  window.I18N?.applyTranslations?.(modal);
  modal.classList.remove("hidden");
  modal.querySelector(".modal-close").focus();
  if (snapshot) {
    displaySnapshot();
    return;
  }
  modal.querySelector(".modal-content").innerHTML =
    `<div class="downloaded-content-loading" role="status"><span class="downloaded-content-spinner" aria-hidden="true"></span><span>${escape(t("Checking downloaded contents..."))}</span></div>`;
  try {
    await refreshDownloadedContents();
  } catch (error) {
    if (!modal.classList.contains("hidden"))
      modal.querySelector(".modal-content").innerHTML =
        `<p role="alert">${escape(t("Could not check downloaded contents."))}</p>`;
    console.warn("[menu] could not inspect downloaded contents:", error);
  }
}
