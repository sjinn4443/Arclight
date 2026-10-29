// Shared across separately bundled entry points.
const state = (window.__arclightConnectivity ||= {
  offline: navigator.onLine === false,
  pending: null,
  checked: 0,
});
export const isOffline = () => navigator.onLine === false || state.offline;
export const offlineText = (english, korean) =>
  window.I18N?.getLanguage?.() === "ko"
    ? korean
    : window.I18N?.translateLiteral?.(english, english) || english;

export async function checkConnectivity(force = false) {
  if (navigator.onLine === false) {
    update(true);
    return false;
  }
  if (state.pending) return state.pending;
  if (!force && Date.now() - state.checked < 10000) return !state.offline;
  state.pending = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    try {
      const response = await fetch("/healthz", {
        method: "HEAD",
        cache: "no-store",
        signal: controller.signal,
      });
      update(!response.ok);
    } catch {
      update(true);
    } finally {
      clearTimeout(timer);
      state.checked = Date.now();
      state.pending = null;
    }
    return !state.offline;
  })();
  return state.pending;
}
function update(offline) {
  const changed = state.offline !== offline;
  state.offline = offline;
  if (changed) window.dispatchEvent(new CustomEvent("arclight:connectivity"));
}

export function initializeOfflineNotice() {
  if (state.wired) return;
  state.wired = true;
  let shown = false;
  function show() {
    if (!isOffline()) {
      shown = false;
      document.getElementById("offlineAccessNotice")?.remove();
      return;
    }
    if (shown || !document.body) return;
    shown = true;
    const previous = document.activeElement;
    const dialog = document.createElement("dialog");
    dialog.id = "offlineAccessNotice";
    dialog.setAttribute("aria-labelledby", "offlineAccessTitle");
    dialog.setAttribute("aria-describedby", "offlineAccessMessage");
    const heading = document.createElement("h2");
    heading.id = "offlineAccessTitle";
    heading.textContent = offlineText("You're offline", "오프라인 상태입니다");
    const message = document.createElement("p");
    message.id = "offlineAccessMessage";
    message.textContent = offlineText(
      "Without an internet connection, only downloaded content and some app features are available. Connect to the internet to access other content or download it for offline use.",
      "인터넷 연결이 없으면 다운로드한 콘텐츠와 일부 앱 기능만 사용할 수 있습니다. 다른 콘텐츠를 이용하거나 오프라인용으로 다운로드하려면 인터넷에 연결해 주세요.",
    );
    const close = document.createElement("button");
    close.type = "button";
    close.textContent = offlineText("Continue", "계속하기");
    close.addEventListener("click", () => {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.remove();
    });
    dialog.addEventListener("close", () => {
      dialog.remove();
      if (previous?.isConnected) previous.focus();
    });
    dialog.append(heading, message, close);
    document.body.append(dialog);
    window.I18N?.applyTranslations?.(dialog);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else {
      dialog.setAttribute("open", "");
      dialog.setAttribute("role", "dialog");
    }
  }
  const refresh = () => {
    show();
    void checkConnectivity(true).then(show);
  };
  window.addEventListener("offline", () => {
    update(true);
    show();
  });
  window.addEventListener("online", refresh);
  window.addEventListener("pageshow", refresh);
  window.addEventListener("arclight:connectivity", show);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refresh();
  });
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", refresh, { once: true });
  else refresh();
}

export async function hasDownloadedVideo(source) {
  if (!source || !("caches" in window)) return false;
  try {
    const url = new URL(source, location.href);
    url.search = "";
    url.hash = "";
    for (const name of await caches.keys()) {
      if (name !== "arclight-packs-v1" && !name.startsWith("arclight-static-"))
        continue;
      const response = await (await caches.open(name)).match(url.href);
      if (
        response?.status === 200 &&
        !/text\/html|application\/json/i.test(
          response.headers.get("Content-Type") || "",
        )
      )
        return true;
    }
  } catch {
    /* Treat unavailable storage as unavailable content. */
  }
  return false;
}

export async function updateOfflineVideoControls(page, sources) {
  const toggle = page.querySelector(".tri-toggle");
  if (!toggle) return null;
  let note = page.querySelector(".video-offline-note");
  if (!note) {
    note = document.createElement("p");
    note.className = "video-offline-note";
    note.setAttribute("role", "status");
    toggle.after(note);
  }
  const offline = isOffline();
  const [low, high] = offline
    ? await Promise.all([
        hasDownloadedVideo(sources.low),
        hasDownloadedVideo(sources.high),
      ])
    : [true, true];
  if (!page.isConnected) return null;
  for (const button of toggle.querySelectorAll("[data-mode]")) {
    button.disabled =
      offline &&
      (button.dataset.mode === "online" ||
        (button.dataset.mode === "high" && !high));
  }
  note.hidden = !offline;
  note.textContent = offlineText(
    "You're currently offline. Only downloaded content is available. Connect to the internet or download content for offline use.",
    "현재 오프라인입니다. 다운로드한 콘텐츠만 사용할 수 있습니다. 인터넷에 연결하거나 오프라인용 콘텐츠를 다운로드해 주세요.",
  );
  if (offline && !high)
    note.textContent += offlineText(
      " High resolution requires an internet connection or a high-resolution download.",
      " 고화질을 이용하려면 인터넷에 연결하거나 고화질 영상을 다운로드해 주세요.",
    );
  window.I18N?.applyTranslations?.(note);
  return { offline, low, high };
}

export function wireVideoFeedback(page) {
  for (const video of page.querySelectorAll("video")) {
    if (video.dataset.offlineFeedback) continue;
    video.dataset.offlineFeedback = "1";
    video.playsInline = true;
    video.preload = "metadata";
    const message = document.createElement("p");
    message.className = "video-load-status";
    message.setAttribute("role", "status");
    message.hidden = true;
    video.after(message);
    const loading = () => {
      message.textContent = offlineText(
        "Loading video…",
        "영상을 불러오는 중입니다…",
      );
      message.hidden = false;
    };
    for (const event of ["loadstart", "waiting"])
      video.addEventListener(event, loading);
    for (const event of ["loadedmetadata", "canplay", "playing"])
      video.addEventListener(event, () => {
        message.hidden = true;
      });
    video.addEventListener("error", () => {
      message.textContent = offlineText(
        "Video unavailable. Connect to the internet and download this video for offline use.",
        "영상을 재생할 수 없습니다. 인터넷에 연결해 이 영상을 오프라인용으로 다운로드해 주세요.",
      );
      message.hidden = false;
    });
  }
}
