import { translateLiteral } from "./i18n.js";

const KEY = "arclight:practice-reminders:v1";
const DEFAULTS = {
  enabled: false,
  reminderTime: "18:00",
  lastPracticedAt: 0,
  url: "/#/mylearning",
};
let config;
let registration;
let initialized = false;
let syncing = false;
let lastSync = 0;
let lastUserActivity = 0;
let activeSeconds = 0;
let lastTick = 0;
let offerShown = false;
const mediaPositions = new WeakMap();
const watchedFrames = new WeakSet();
let mutationQueue = Promise.resolve();
let mediaSeconds = 0;
const copy = (text) => translateLiteral(text, text);
function unavailableMessage() {
  if (config?.reason === "disabled")
    return "Practice reminders are turned off on the server.";
  if (config?.reason === "configuration_invalid")
    return "The notification server configuration needs attention. Please contact support.";
  if (config?.reason === "storage_unavailable")
    return "The notification server could not connect to its database. Please try again later.";
  return "Practice reminders are not available yet. Please try again later.";
}

export function readReminderState() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return { ...DEFAULTS };
  }
}
function save(patch) {
  const next = { ...readReminderState(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("arclight:reminders-changed"));
  return next;
}
function supportMessage() {
  const ios =
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (/Mac/.test(navigator.platform) && navigator.maxTouchPoints > 1);
  if (
    ios &&
    !window.matchMedia?.("(display-mode: standalone)").matches &&
    !navigator.standalone
  )
    return "Add Arclight to your Home Screen and open it there to enable reminders.";
  if (
    !window.isSecureContext ||
    !("Notification" in window) ||
    !("PushManager" in window) ||
    !("serviceWorker" in navigator)
  )
    return "Practice reminders are not supported by this browser.";
  if (Notification.permission === "denied")
    return "Notifications are blocked. Allow Arclight notifications in your browser or phone settings.";
  return "";
}
async function loadConfig() {
  try {
    const response = await fetch("/api/reminders/config", {
      cache: "no-store",
      credentials: "same-origin",
    });
    config = response.ok ? await response.json() : { available: false };
  } catch {
    config = { available: false };
  }
  renderReminderSettings();
}
function request(method, path, state, body) {
  const operation = mutationQueue.then(async () => {
    const response = await fetch(`/api/reminders${path}`, {
      method,
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok)
      throw new Error(
        "Could not save reminders. Connect to the internet and try again.",
      );
  });
  mutationQueue = operation.catch(() => {});
  return operation;
}
function timezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}
function bytes(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(
    atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4)),
    (c) => c.charCodeAt(0),
  );
}
function deviceToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (v) =>
    v.toString(16).padStart(2, "0"),
  ).join("");
}
async function worker() {
  registration ||= await navigator.serviceWorker.getRegistration("/");
  if (!registration?.active)
    throw new Error("Arclight is still setting up. Reload and try again.");
  return registration;
}
async function upload(state, subscription, { enabling = false } = {}) {
  const current = readReminderState();
  if (current.pendingDisable || (!enabling && !current.enabled))
    throw new Error("Practice reminders are off.");
  if (!subscription)
    throw new Error(
      "Enable practice reminders again to renew notifications on this device.",
    );
  await request("PUT", "/subscription", state, {
    subscription: subscription.toJSON(),
    timezone: timezone(),
    reminderTime: state.reminderTime,
    lastPracticedAt: state.lastPracticedAt,
    url: state.url,
  });
}
export async function enablePracticeReminders() {
  const unsupported = supportMessage();
  if (unsupported) throw new Error(unsupported);
  if (!config?.available) throw new Error(unavailableMessage());
  // Call before any await: iOS requires permission requests in a user gesture.
  const permission =
    Notification.permission === "granted"
      ? "granted"
      : Notification.requestPermission();
  if ((await permission) !== "granted")
    throw new Error(
      "Reminders were not enabled. You can enable them later in Settings.",
    );
  const state = save({
    token: readReminderState().token || deviceToken(),
    pendingDisable: false,
  });
  const reg = await worker();
  let subscription = await reg.pushManager.getSubscription();
  const created = !subscription;
  try {
    subscription ||= await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: bytes(config.publicKey),
    });
    await upload(state, subscription, { enabling: true });
    save({ enabled: true, pendingDisable: false, offered: true });
    document.getElementById("practiceReminderOffer")?.remove();
    setStatus(
      "Practice reminders are on. They pause after the one-month reminder until you practise again.",
    );
  } catch (error) {
    if (created && subscription)
      await subscription.unsubscribe().catch(() => {});
    throw error;
  }
}
export async function disablePracticeReminders() {
  const state = save({ enabled: false, pendingDisable: true, offered: true });
  document.getElementById("practiceReminderOffer")?.remove();
  try {
    const reg = await navigator.serviceWorker?.getRegistration("/");
    const subscription = await reg?.pushManager.getSubscription();
    if (subscription) await subscription.unsubscribe();
  } catch {
    /* Server deletion is also attempted below. */
  }
  if (state.token) await request("DELETE", "/subscription", state);
  save({ pendingDisable: false });
  setStatus("Practice reminders are off.");
}
export async function syncPracticeReminders() {
  if (syncing || !navigator.onLine) return;
  const state = readReminderState();
  if (!state.token) return;
  syncing = true;
  try {
    if (
      state.pendingDisable ||
      (state.enabled &&
        "Notification" in window &&
        Notification.permission !== "granted")
    ) {
      await request("DELETE", "/subscription", state);
      save({ enabled: false, pendingDisable: false });
    } else if (state.enabled && config?.available) {
      const subscription = await (await worker()).pushManager.getSubscription();
      if (subscription) await upload(state, subscription);
      else save({ enabled: false });
    }
    lastSync = Date.now();
  } catch {
    /* Keep the latest offline practice and retry on reconnect/resume. */
  } finally {
    syncing = false;
    renderReminderSettings();
  }
}
function setStatus(message) {
  const status = document.getElementById("practiceReminderStatus");
  if (status) status.textContent = copy(message);
}
export function renderReminderSettings() {
  const toggle = document.getElementById("settingsNotificationsToggle");
  if (!toggle) return;
  const state = readReminderState();
  const on =
    state.enabled &&
    "Notification" in window &&
    Notification.permission === "granted";
  toggle.classList.toggle("is-on", on);
  toggle.setAttribute("aria-pressed", String(Boolean(on)));
  const time = document.getElementById("practiceReminderTime");
  if (time && document.activeElement !== time) time.value = state.reminderTime;
  setStatus(
    state.pendingDisable
      ? "Reminders are off on this device. Reconnect to finish turning them off on the server."
      : supportMessage() ||
          (config?.available === false
            ? unavailableMessage()
            : on
              ? "Reminders after 1, 3, 7 and 30 days without practice, at your local time. Then they pause until you practise again."
              : "Choose gentle reminders after 1, 3, 7 and 30 days without practice."),
  );
}
export function initializeReminderSettings() {
  const toggle = document.getElementById("settingsNotificationsToggle");
  if (!toggle || toggle.dataset.remindersWired) return;
  toggle.dataset.remindersWired = "1";
  toggle.addEventListener("click", async () => {
    toggle.disabled = true;
    try {
      if (readReminderState().enabled) await disablePracticeReminders();
      else await enablePracticeReminders();
      renderReminderSettings();
    } catch (error) {
      renderReminderSettings();
      setStatus(error.message);
    } finally {
      toggle.disabled = false;
    }
  });
  document
    .getElementById("practiceReminderTime")
    ?.addEventListener("change", async (event) => {
      const time = event.target;
      if (!time.validity.valid || !time.value) return;
      const old = readReminderState();
      time.disabled = true;
      try {
        const next = { ...old, reminderTime: time.value };
        if (next.enabled)
          await upload(
            next,
            await (await worker()).pushManager.getSubscription(),
          );
        save({ reminderTime: next.reminderTime });
        setStatus("Reminder time saved in your local timezone.");
      } catch (error) {
        time.value = old.reminderTime;
        setStatus(error.message);
      } finally {
        time.disabled = false;
      }
    });
  renderReminderSettings();
  void loadConfig();
}
function offerReminders() {
  const state = readReminderState();
  if (
    offerShown ||
    state.offered ||
    state.enabled ||
    !config?.available ||
    supportMessage() ||
    document.getElementById("practiceReminderOffer")
  )
    return;
  offerShown = true;
  const offer = document.createElement("aside");
  offer.id = "practiceReminderOffer";
  offer.setAttribute("aria-labelledby", "practiceReminderOfferTitle");
  offer.innerHTML =
    '<strong id="practiceReminderOfferTitle"></strong><p></p><div><button type="button" data-reminder-enable></button><button type="button" data-reminder-dismiss></button></div><p role="status" data-reminder-status></p>';
  offer.querySelector("strong").textContent = copy(
    "Would you like gentle practice reminders?",
  );
  offer.querySelector("p").textContent = copy(
    "A little encouragement after 1, 3, 7 and 30 days away. You can turn reminders off in Settings.",
  );
  const enable = offer.querySelector("[data-reminder-enable]");
  enable.textContent = copy("Enable reminders");
  enable.addEventListener("click", async () => {
    enable.disabled = true;
    try {
      await enablePracticeReminders();
    } catch (error) {
      offer.querySelector("[data-reminder-status]").textContent = copy(
        error.message,
      );
    } finally {
      enable.disabled = false;
    }
  });
  const dismiss = offer.querySelector("[data-reminder-dismiss]");
  dismiss.textContent = copy("Maybe later");
  dismiss.addEventListener("click", () => {
    save({ offered: true });
    offer.remove();
  });
  document.body.appendChild(offer);
}

function learningRoute() {
  const [route, subpage] = location.hash.slice(2).split("/");
  if (["videos", "eyes", "ears", "casestudy"].includes(route) && !subpage)
    return false;
  return /^#\/(videos|eyes|ears|casestudy|quizzes|behavioursquiz|fundalReflex|directOphthalmoscopy|binocularIndirect|visualAcuity|visualsystemeyesbrain|pupils|frontOfEye|atoms|eyeCare|makeEye|glaucomaHistoryCaseStudy|childhood|diabetic|glaucoma|medical|paediatric|pecWorkshop|primaryEarCareWorkshop)/i.test(
    location.hash,
  );
}

function watchPracticeFrame(frame) {
  if (!frame?.matches?.(".interactive-subapp-container iframe")) return;
  try {
    const content = frame.contentDocument;
    if (!content || watchedFrames.has(content)) return;
    watchedFrames.add(content);
    for (const name of ["pointerdown", "keydown", "scroll", "change"])
      content.addEventListener(
        name,
        (event) => {
          if (
            !event.isTrusted ||
            !learningRoute() ||
            document.visibilityState !== "visible" ||
            !frame.getClientRects().length
          )
            return;
          lastUserActivity = Date.now();
          if (
            name === "change" &&
            event.target.matches?.(
              'input[type="radio"], input[type="checkbox"]',
            )
          )
            recordPractice();
        },
        { capture: true, passive: true },
      );
  } catch {
    /* External embedded lessons cannot expose their interaction events. */
  }
}
export function recordPractice() {
  if (document.visibilityState !== "visible") return;
  const timestamp = Date.now();
  const state = readReminderState();
  if (timestamp - state.lastPracticedAt < 60000) return;
  try {
    save({
      lastPracticedAt: timestamp,
      url: /^#\/[a-zA-Z0-9_/-]+$/.test(location.hash)
        ? `/${location.hash}`
        : "/#/mylearning",
    });
  } catch {
    return;
  }
  if (timestamp - lastSync >= 60000) void syncPracticeReminders();
  offerReminders();
}

export function initializePracticeReminders() {
  if (initialized) return;
  initialized = true;
  void loadConfig().then(syncPracticeReminders);
  if ("serviceWorker" in navigator)
    void navigator.serviceWorker
      .getRegistration("/")
      .then((reg) => {
        registration = reg;
      })
      .catch(() => {});
  window.addEventListener("arclight:reminders-changed", renderReminderSettings);
  window.addEventListener("page:loaded", () => {
    activeSeconds = 0;
    mediaSeconds = 0;
    lastUserActivity = 0;
    document
      .querySelectorAll(".interactive-subapp-container iframe")
      .forEach(watchPracticeFrame);
  });
  document.addEventListener(
    "load",
    (event) => watchPracticeFrame(event.target),
    true,
  );
  window.addEventListener("hashchange", () => {
    activeSeconds = 0;
    mediaSeconds = 0;
    lastUserActivity = 0;
  });
  for (const name of ["pointerdown", "keydown", "scroll", "change"])
    document.addEventListener(
      name,
      (event) => {
        if (
          event.isTrusted &&
          learningRoute() &&
          document.visibilityState === "visible"
        ) {
          lastUserActivity = Date.now();
          if (
            name === "change" &&
            event.target.matches?.(
              'input[type="radio"], input[type="checkbox"]',
            ) &&
            event.target.closest(
              ".quiz-card, .quiz-container, .question-block, [data-quiz-page-id], .medical-test-quiz-mount",
            )
          )
            recordPractice();
        }
      },
      { capture: true, passive: true },
    );
  document.addEventListener("arclight:lesson-progress-changed", (event) => {
    if (
      event.detail?.advanced &&
      learningRoute() &&
      Date.now() - lastUserActivity < 10000
    )
      recordPractice();
  });
  document.addEventListener(
    "timeupdate",
    (event) => {
      const video = event.target;
      if (video.tagName !== "VIDEO") return;
      const previous = mediaPositions.get(video);
      mediaPositions.set(video, video.currentTime);
      const delta = video.currentTime - previous;
      if (
        learningRoute() &&
        document.visibilityState === "visible" &&
        !video.paused &&
        delta > 0 &&
        delta < 2
      ) {
        mediaSeconds += delta;
        if (mediaSeconds >= 30) {
          recordPractice();
          mediaSeconds = 0;
        }
      }
    },
    true,
  );
  // Count visible, recently interacted-with learning time; a home-page visit
  // or a hidden/background tab never resets the practice clock.
  lastTick = Date.now();
  setInterval(() => {
    const now = Date.now();
    const elapsed = Math.min(5, (now - lastTick) / 1000);
    lastTick = now;
    if (
      learningRoute() &&
      document.visibilityState === "visible" &&
      now - lastUserActivity <= 65000
    ) {
      activeSeconds += elapsed;
      if (activeSeconds >= 60) {
        recordPractice();
        activeSeconds = 0;
      }
    }
    if (readReminderState().enabled && now - lastSync > 5 * 60000)
      void syncPracticeReminders();
  }, 5000);
  window.addEventListener("online", () => {
    void loadConfig().then(syncPracticeReminders);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void syncPracticeReminders();
    else {
      lastUserActivity = 0;
      lastTick = Date.now();
    }
  });
}
