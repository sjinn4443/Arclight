import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("language", "en");
    localStorage.setItem("settings:notifications", "true");
    window.__reminderRequests = 0;
    let permission = JSON.parse(
      localStorage.getItem("arclight:practice-reminders:v1") || "{}",
    ).enabled
      ? "granted"
      : "default";
    Object.defineProperty(window, "Notification", {
      configurable: true,
      value: {
        get permission() {
          return permission;
        },
        requestPermission: async () => {
          window.__reminderRequests += 1;
          permission = "granted";
          return permission;
        },
      },
    });
    Object.defineProperty(window, "PushManager", {
      configurable: true,
      value: function () {},
    });
    const subscription = {
      toJSON: () => ({
        endpoint: "https://fcm.googleapis.com/example",
        keys: {},
      }),
      unsubscribe: async () => true,
    };
    const reg = {
      active: {},
      pushManager: {
        getSubscription: async () => subscription,
        subscribe: async () => subscription,
      },
    };
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: {
        getRegistration: async () => reg,
        register: async () => ({
          ...reg,
          addEventListener() {},
          update: async () => {},
        }),
        addEventListener() {},
      },
    });
  });
});

test("settings opt in, save local time, persist across reload, and opt out", async ({
  page,
}, testInfo) => {
  const writes = [];
  await page.route("**/api/reminders/**", async (route) => {
    if (route.request().method() === "GET")
      return route.fulfill({ json: { available: true, publicKey: "AQID" } });
    writes.push({
      method: route.request().method(),
      body: route.request().postDataJSON(),
    });
    return route.fulfill({ status: 204 });
  });
  await page.goto("/#/settings");
  const toggle = page.locator("#settingsNotificationsToggle");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  expect(await page.evaluate(() => window.__reminderRequests)).toBe(0);
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await page.locator("#practiceReminderTime").fill("19:30");
  await page.locator("#practiceReminderTime").blur();
  await expect
    .poll(() => writes.some((item) => item.body?.reminderTime === "19:30"))
    .toBe(true);
  await page.screenshot({
    path: testInfo.outputPath("reminder-settings.png"),
    fullPage: true,
  });
  await page.reload();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#practiceReminderTime")).toHaveValue("19:30");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect
    .poll(() => writes.some((item) => item.method === "DELETE"))
    .toBe(true);
});

test("unconfigured push does not request permission or enable the toggle", async ({
  page,
}) => {
  await page.route("**/api/reminders/config", (route) =>
    route.fulfill({ json: { available: false } }),
  );
  await page.goto("/#/settings");
  await expect(page.locator("#practiceReminderStatus")).toContainText(
    "not available",
  );
  await page.locator("#settingsNotificationsToggle").click();
  await expect(page.locator("#settingsNotificationsToggle")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  expect(await page.evaluate(() => window.__reminderRequests)).toBe(0);
});

test("a quiz practice advance offers reminders once and dismisses without permission", async ({
  page,
}) => {
  await page.route("**/api/reminders/config", (route) =>
    route.fulfill({ json: { available: true, publicKey: "AQID" } }),
  );
  await page.goto("/#/videos/pupilsPage");
  await expect(page.locator("#pupilsPage")).toBeVisible();
  await page.evaluate(() => {
    const quiz = document.createElement("div");
    quiz.className = "quiz-card";
    quiz.innerHTML =
      '<label><input type="radio" id="reminderQuizAnswer">Practice answer</label>';
    document.getElementById("pupilsPage").appendChild(quiz);
  });
  await page.locator("#reminderQuizAnswer").check();
  await expect(page.locator("#practiceReminderOffer")).toBeVisible();
  await page.getByRole("button", { name: "Maybe later" }).click();
  await expect(page.locator("#practiceReminderOffer")).toHaveCount(0);
  expect(await page.evaluate(() => window.__reminderRequests)).toBe(0);
  await page.reload();
  await page.evaluate(async () =>
    (await import("/js/practiceReminders.js")).recordPractice(),
  );
  await expect(page.locator("#practiceReminderOffer")).toHaveCount(0);
});

test("practice in an embedded simulator resets the reminder clock", async ({
  page,
}) => {
  await page.route("**/api/reminders/config", (route) =>
    route.fulfill({ json: { available: true, publicKey: "AQID" } }),
  );
  await page.goto("/#/videos/pupilsPage");
  await expect(page.locator("#pupilsPage")).toBeVisible();
  await page.evaluate(() => {
    const wrapper = document.createElement("div");
    wrapper.className = "interactive-subapp-container";
    const frame = document.createElement("iframe");
    frame.title = "Simulator practice test";
    frame.srcdoc = '<label><input type="radio">Simulator answer</label>';
    wrapper.appendChild(frame);
    document.getElementById("pupilsPage").appendChild(wrapper);
  });
  await page
    .frameLocator('iframe[title="Simulator practice test"]')
    .getByRole("radio")
    .check();
  await expect(page.locator("#practiceReminderOffer")).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("arclight:practice-reminders:v1"))
          .lastPracticedAt,
    ),
  ).toBeGreaterThan(0);
});
