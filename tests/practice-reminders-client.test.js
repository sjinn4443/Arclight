/** @jest-environment jsdom */
import {
  beforeAll,
  beforeEach,
  afterAll,
  describe,
  test,
  expect,
  jest,
} from "@jest/globals";

jest.unstable_mockModule("../public/js/i18n.js", () => ({
  translateLiteral: (text) => text,
}));
const reminders = await import("../public/js/practiceReminders.js");
const KEY = "arclight:practice-reminders:v1";
let subscription;
let registration;
let notification;
const flush = async () => {
  for (let i = 0; i < 30; i++) await Promise.resolve();
};
const settings = () => {
  document.body.innerHTML =
    '<button id="settingsNotificationsToggle"></button><input id="practiceReminderTime" type="time"><p id="practiceReminderStatus"></p>';
  reminders.initializeReminderSettings();
};

describe("Practice reminder permissions and offline state", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    Object.defineProperty(window, "isSecureContext", {
      configurable: true,
      value: true,
    });
    Object.defineProperty(window, "PushManager", {
      configurable: true,
      value: function () {},
    });
    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      get: () => true,
    });
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
    window.matchMedia = () => ({ matches: true });
  });
  beforeEach(async () => {
    localStorage.clear();
    subscription = {
      toJSON: () => ({
        endpoint: "https://fcm.googleapis.com/token",
        keys: {},
      }),
      unsubscribe: jest.fn(async () => true),
    };
    registration ||= { active: {} };
    registration.pushManager = {
      getSubscription: jest.fn(async () => subscription),
      subscribe: jest.fn(async () => subscription),
    };
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: { getRegistration: jest.fn(async () => registration) },
    });
    notification = {
      permission: "default",
      requestPermission: jest.fn(async () => "granted"),
    };
    Object.defineProperty(window, "Notification", {
      configurable: true,
      value: notification,
    });
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ available: true, publicKey: "AQID" }),
    }));
    settings();
    await flush();
  });
  afterAll(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("the existing local notification preference does not grant consent", () => {
    localStorage.setItem("settings:notifications", "true");
    reminders.renderReminderSettings();
    expect(
      document
        .getElementById("settingsNotificationsToggle")
        .getAttribute("aria-pressed"),
    ).toBe("false");
    expect(notification.requestPermission).not.toHaveBeenCalled();
  });
  test("permission is requested synchronously from enable and never on initialisation", async () => {
    expect(notification.requestPermission).not.toHaveBeenCalled();
    const task = reminders.enablePracticeReminders();
    expect(notification.requestPermission).toHaveBeenCalledTimes(1);
    await task;
    expect(reminders.readReminderState().enabled).toBe(true);
    const put = global.fetch.mock.calls.find(
      ([, options]) => options.method === "PUT",
    );
    expect(JSON.parse(put[1].body).reminderTime).toBe("18:00");
    expect(put[1].headers.Authorization).toMatch(/^Bearer [a-f0-9]{64}$/);
  });
  test("explicit re-enabling requests a fresh immediate push, while sync does not", async () => {
    await reminders.enablePracticeReminders();
    const first = reminders.readReminderState().enableRequestId;
    expect(first).toMatch(/^[a-f0-9]{64}$/);
    await reminders.syncPracticeReminders();
    const puts = global.fetch.mock.calls.filter(
      ([, options]) => options.method === "PUT",
    );
    expect(JSON.parse(puts.at(-1)[1].body).enableRequestId).toBeUndefined();
    await reminders.disablePracticeReminders();
    await reminders.enablePracticeReminders();
    expect(reminders.readReminderState().enableRequestId).not.toBe(first);
  });
  test("a subscription bound to an obsolete signing key is renewed before enabling", async () => {
    subscription.options = {
      applicationServerKey: new Uint8Array([9, 9, 9]).buffer,
    };
    await reminders.enablePracticeReminders();
    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1);
    expect(registration.pushManager.subscribe).toHaveBeenCalledTimes(1);
    expect(reminders.readReminderState().enabled).toBe(true);
  });
  test("iOS keeps a confirmed subscription green while the permission property is temporarily default", async () => {
    await reminders.enablePracticeReminders();
    expect(notification.permission).toBe("default");
    reminders.renderReminderSettings();
    expect(
      document
        .getElementById("settingsNotificationsToggle")
        .getAttribute("aria-pressed"),
    ).toBe("true");
    await reminders.syncPracticeReminders();
    expect(reminders.readReminderState().enabled).toBe(true);
    expect(
      global.fetch.mock.calls.some(
        ([, options]) => options.method === "DELETE",
      ),
    ).toBe(false);
    notification.permission = "denied";
    reminders.renderReminderSettings();
    expect(
      document
        .getElementById("settingsNotificationsToggle")
        .getAttribute("aria-pressed"),
    ).toBe("false");
  });
  test("blocked permission and disabled server do not request permission", async () => {
    notification.permission = "denied";
    await expect(reminders.enablePracticeReminders()).rejects.toThrow(
      "blocked",
    );
    expect(notification.requestPermission).not.toHaveBeenCalled();
    notification.permission = "default";
    global.fetch.mockImplementation(async () => ({
      ok: true,
      json: async () => ({ available: false }),
    }));
    settings();
    await flush();
    await expect(reminders.enablePracticeReminders()).rejects.toThrow(
      "not available",
    );
    expect(notification.requestPermission).not.toHaveBeenCalled();
  });
  test("failed subscription upload never turns reminders on", async () => {
    registration.pushManager.getSubscription.mockResolvedValue(null);
    global.fetch.mockImplementation(async (_url, options) => ({
      ok: options.method !== "PUT",
    }));
    await expect(reminders.enablePracticeReminders()).rejects.toThrow(
      "Please try again",
    );
    expect(reminders.readReminderState().enabled).toBe(false);
    expect(subscription.unsubscribe).toHaveBeenCalled();
    registration.pushManager.getSubscription.mockResolvedValue(subscription);
  });
  test("database unavailability is explained before asking for phone permission", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ available: false, reason: "storage_unavailable" }),
    });
    settings();
    await flush();
    await expect(reminders.enablePracticeReminders()).rejects.toThrow(
      "database",
    );
    expect(
      document.getElementById("practiceReminderStatus").textContent,
    ).toContain("database");
    expect(notification.requestPermission).not.toHaveBeenCalled();
  });
  test("offline opt-out is persisted and deletes the server record on reconnect", async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ enabled: true, token: "a".repeat(64) }),
    );
    global.fetch.mockRejectedValue(new Error("offline"));
    await expect(reminders.disablePracticeReminders()).rejects.toThrow(
      "offline",
    );
    expect(subscription.unsubscribe).toHaveBeenCalled();
    expect(reminders.readReminderState()).toMatchObject({
      enabled: false,
      pendingDisable: true,
    });
    global.fetch.mockResolvedValue({ ok: true });
    await reminders.syncPracticeReminders();
    expect(global.fetch.mock.calls.at(-1)[1].method).toBe("DELETE");
    expect(reminders.readReminderState().pendingDisable).toBe(false);
  });
  test("offline practice survives and uploads on reconnect without resetting on hydration", async () => {
    history.replaceState(null, "", "/#/videos/pupilsPecFullAnimationVideoPage");
    localStorage.setItem(
      KEY,
      JSON.stringify({ enabled: true, token: "a".repeat(64) }),
    );
    notification.permission = "granted";
    global.fetch.mockRejectedValue(new Error("offline"));
    reminders.recordPractice();
    await flush();
    const practiced = reminders.readReminderState().lastPracticedAt;
    expect(practiced).toBe(Date.now());
    document.dispatchEvent(
      new CustomEvent("arclight:lesson-progress-changed", {
        detail: { advanced: false, percent: 100 },
      }),
    );
    expect(reminders.readReminderState().lastPracticedAt).toBe(practiced);
    global.fetch.mockResolvedValue({ ok: true });
    await reminders.syncPracticeReminders();
    const put = global.fetch.mock.calls.at(-1)[1];
    expect(JSON.parse(put.body)).toMatchObject({
      lastPracticedAt: practiced,
      url: "/#/videos/pupilsPecFullAnimationVideoPage",
    });
  });
  test("home-page visits and background time do not count as practice", async () => {
    history.replaceState(null, "", "/#/dashboard");
    reminders.initializePracticeReminders();
    await flush();
    jest.advanceTimersByTime(120000);
    expect(reminders.readReminderState().lastPracticedAt).toBe(0);
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });
    reminders.recordPractice();
    expect(reminders.readReminderState().lastPracticedAt).toBe(0);
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
  });
  test("a granted but failed registration resumes, while explicit opt-out stays off", async () => {
    notification.permission = "granted";
    localStorage.setItem(
      KEY,
      JSON.stringify({
        enabled: false,
        token: "a".repeat(64),
        pendingEnable: true,
      }),
    );
    global.fetch.mockImplementation(async (_url, options) => ({
      ok: true,
      headers: { get: () => "application/json" },
      json: async () =>
        options.method === "PUT"
          ? { enabled: true, delivery: "accepted" }
          : { enabled: false, notifications: [] },
    }));
    await reminders.syncPracticeReminders();
    expect(reminders.readReminderState().enabled).toBe(true);
    expect(
      global.fetch.mock.calls.some(([, options]) => options.method === "PUT"),
    ).toBe(true);
    localStorage.setItem(
      KEY,
      JSON.stringify({
        enabled: false,
        token: "a".repeat(64),
        pendingEnable: false,
        offered: true,
      }),
    );
    global.fetch.mockClear();
    await reminders.syncPracticeReminders();
    expect(reminders.readReminderState().enabled).toBe(false);
    expect(
      global.fetch.mock.calls.some(([, options]) => options.method === "PUT"),
    ).toBe(false);
  });
});
