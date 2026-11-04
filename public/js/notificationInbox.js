import { translateLiteral } from "./i18n.js";

const BELL = "#myProfilePage .profile-topbar__icons .icon-btn:not(.menuBtn)";
const CACHE = "arclight:notification-history:v1";
const SEEN = "arclight:notification-history-seen:v1";
const text = (value) => translateLiteral(value, value);
let initialized = false;

export function initializeNotificationInbox({ readState, request }) {
  if (initialized) return;
  initialized = true;
  let items = [];
  let owner = "";
  let refreshing = false;
  let dialog;
  let opener;

  function cached() {
    const token = readState().token || "";
    if (owner === token) return;
    owner = token;
    items = [];
    try {
      const saved = JSON.parse(localStorage.getItem(CACHE) || "null");
      if (saved?.owner === owner && Array.isArray(saved.items))
        items = saved.items;
    } catch {
      /* History remains usable when local storage is unavailable. */
    }
  }
  function seen() {
    try {
      const saved = JSON.parse(localStorage.getItem(SEEN) || "null");
      return saved?.owner === owner ? Number(saved.at) || 0 : 0;
    } catch {
      return 0;
    }
  }
  function badge() {
    const bell = document.querySelector(BELL);
    const dot = bell?.querySelector(".notif-dot");
    const unread = items.some((item) => item.sentAt > seen());
    if (dot) dot.hidden = !unread;
    if (bell) bell.setAttribute("aria-haspopup", "dialog");
  }
  function markSeen() {
    try {
      localStorage.setItem(
        SEEN,
        JSON.stringify({
          owner,
          at: Math.max(seen(), ...items.map((item) => item.sentAt), 0),
        }),
      );
    } catch {
      /* Read status is optional. */
    }
    badge();
  }
  function render() {
    badge();
    if (!dialog?.open) return;
    const list = dialog.querySelector("[data-inbox-list]");
    list.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("p");
      empty.textContent = text("No notifications yet.");
      list.appendChild(empty);
    }
    for (const item of items) {
      const row = document.createElement("a");
      row.className = "notification-inbox__item";
      row.href = /^\/#\/[a-zA-Z0-9_/-]+$/.test(item.url)
        ? item.url
        : "/#/mylearning";
      const title = document.createElement("strong");
      title.textContent = item.title;
      const body = document.createElement("p");
      body.textContent = item.body;
      const date = document.createElement("time");
      date.dateTime = new Date(item.sentAt).toISOString();
      date.textContent = `${text("Sent")} · ${new Date(item.sentAt).toLocaleString()}`;
      row.append(title, body, date);
      row.addEventListener("click", (event) => {
        event.preventDefault();
        dialog.close();
        location.hash = new URL(row.href, location.origin).hash;
      });
      list.appendChild(row);
    }
    markSeen();
  }
  async function refresh() {
    if (refreshing) return;
    cached();
    badge();
    render();
    if (!readState().token) {
      if (dialog?.open)
        dialog.querySelector("[data-inbox-status]").textContent = text(
          "Enable practice reminders in Settings to receive notifications.",
        );
      return;
    }
    refreshing = true;
    try {
      const state = readState();
      const result = await request("GET", "/history", state);
      if (readState().token !== state.token) return;
      if (Array.isArray(result?.notifications)) {
        items = result.notifications
          .filter(
            (item) =>
              typeof item.id === "string" &&
              typeof item.title === "string" &&
              typeof item.body === "string" &&
              Number.isFinite(item.sentAt) &&
              item.sentAt > 0,
          )
          .slice(0, 100);
        try {
          localStorage.setItem(CACHE, JSON.stringify({ owner, items }));
        } catch {
          /* Server history remains available. */
        }
      }
      if (dialog?.open)
        dialog.querySelector("[data-inbox-status]").textContent = "";
      render();
    } catch {
      if (dialog?.open)
        dialog.querySelector("[data-inbox-status]").textContent = text(
          "Connect to the internet to update your notifications.",
        );
    } finally {
      refreshing = false;
    }
  }
  function open(bell) {
    opener = bell;
    if (!dialog?.isConnected) {
      dialog = document.createElement("dialog");
      dialog.className = "notification-inbox";
      dialog.setAttribute("aria-labelledby", "notificationInboxTitle");
      dialog.innerHTML =
        '<header><h2 id="notificationInboxTitle"></h2><button type="button" data-inbox-close></button></header><p role="status" data-inbox-status></p><div data-inbox-list></div><button type="button" data-inbox-settings></button>';
      dialog.querySelector("h2").textContent = text("Notifications");
      const close = dialog.querySelector("[data-inbox-close]");
      close.textContent = "×";
      close.setAttribute("aria-label", text("Close notifications"));
      close.addEventListener("click", () => dialog.close());
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
      dialog.addEventListener("close", () => {
        if (opener?.isConnected) opener.focus();
      });
      const settings = dialog.querySelector("[data-inbox-settings]");
      settings.textContent = text("Practice reminder settings");
      settings.addEventListener("click", () => {
        dialog.close();
        location.hash = "#/settings";
      });
      document.body.appendChild(dialog);
    }
    if (!dialog.open) dialog.showModal();
    dialog.querySelector("[data-inbox-status]").textContent = text(
      "Loading notifications…",
    );
    void refresh();
  }
  document.addEventListener("click", (event) => {
    const bell = event.target.closest?.(BELL);
    if (bell) {
      event.preventDefault();
      open(bell);
    }
  });
  window.addEventListener("page:loaded", (event) => {
    if (event.detail?.routeName === "myprofile") void refresh();
    else if (dialog?.open) dialog.close();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && document.querySelector(BELL))
      void refresh();
  });
  window.addEventListener("arclight:reminders-changed", () => {
    if (document.querySelector(BELL)) void refresh();
  });
  setInterval(() => {
    if (document.visibilityState === "visible" && document.querySelector(BELL))
      void refresh();
  }, 60000);
}
