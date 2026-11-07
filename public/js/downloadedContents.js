import {
  getOfflineInventory,
  invalidateOfflineInventory,
  offlineAssetPath,
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
let earAssets;
let earAssetsRequest;

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
  content.innerHTML = `<p>${escape(t("Downloaded contents"))}</p>
    ${progress(snapshot.overall)}
    <ul class="downloaded-content-list"></ul>
    <p class="downloaded-content-size">${escape(t("Approx. cached size: {{size}}.").replace("{{size}}", snapshot.size))}</p>`;
  const renderBranch = (node, parent) => {
    const row = document.createElement("li");
    row.className = "downloaded-content-item";
    row.innerHTML = `<details data-content-group="${escape(node.id)}">
      <summary><span class="downloaded-content-item__title">${escape(t(node.label))}</span>${progress(node)}</summary>
      <div class="downloaded-content-children"></div></details>`;
    parent.append(row);
    const details = row.querySelector("details");
    const populate = () => {
      if (!details.open || details.dataset.loaded) return;
      details.dataset.loaded = "1";
      const target = row.querySelector(".downloaded-content-children");
      if (node.children?.length) {
        const list = document.createElement("ul");
        list.className =
          "downloaded-content-list downloaded-content-list--nested";
        target.append(list);
        node.children.forEach((child) => renderBranch(child, list));
      } else if (node.items.length) {
        target.innerHTML = `<ul class="downloaded-content-details">${node.items
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
            return `<li><span>${escape(t(item.label))}</span><span class="content-download-count content-download-count--${state}">${escape(t(label))}</span></li>`;
          })
          .join("")}</ul>`;
      } else {
        target.innerHTML = `<p class="downloaded-content-empty">${escape(t("No downloaded contents found."))}</p>`;
      }
      window.I18N?.applyTranslations?.(target);
    };
    details.addEventListener("toggle", populate);
    if (expanded.has(node.id)) {
      details.open = true;
      populate();
    }
  };
  snapshot.groups.forEach((group) =>
    renderBranch(group, content.querySelector(".downloaded-content-list")),
  );
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
    const { buildDownloadedContentsCatalog } =
      await import("./downloadedContentsCatalog.js");
    if (
      urls.some((url) => app.matchesOfflineCatalog(url, "ears")) &&
      !earAssets
    ) {
      if (!earAssetsRequest)
        earAssetsRequest = (async () => {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 5000);
          try {
            const response = await fetch("/data/ears-assets.json", {
              signal: controller.signal,
            });
            if (response.ok) earAssets = await response.json();
          } catch {
            /* Unmapped assets remain visible under Ear learning materials. */
          } finally {
            clearTimeout(timeout);
            earAssetsRequest = null;
          }
        })();
      await earAssetsRequest;
    }
    const groups = buildDownloadedContentsCatalog(
      app,
      urls,
      inventory,
      earAssets,
    );
    const cachedBytes = app
      .getOfflineManifestAssets(manifest)
      .filter((asset) => inventory.has(offlineAssetPath(asset.url)))
      .reduce((sum, asset) => sum + (Number(asset.bytes) || 0), 0);
    snapshot = {
      groups,
      overall: {
        completed: groups.reduce((sum, group) => sum + group.completed, 0),
        total: groups.reduce((sum, group) => sum + group.total, 0),
        started: groups.some((group) => group.started),
      },
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
