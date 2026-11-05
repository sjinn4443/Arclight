/** @jest-environment node */
const crypto = require("node:crypto");
const express = require("express");
const request = require("supertest");
const {
  createReminderRouter,
  validSubscription,
  readPushConfig,
} = require("../security/reminder-api.cjs");
const { createMemoryReminderStore } = require("../storage/reminder-store.cjs");
const {
  dueMilestone,
  DAY,
  safePracticeUrl,
} = require("../utils/practice-reminder-policy.cjs");
const {
  dispatchPracticeReminders,
} = require("../utils/practice-reminder-scheduler.cjs");

const NOW = Date.parse("2026-11-04T09:05:00Z");
const token = "a".repeat(64);
const id = crypto.createHash("sha256").update(token).digest("hex");
function subscription(
  endpoint = "https://fcm.googleapis.com/fcm/send/example",
) {
  const ecdh = crypto.createECDH("prime256v1");
  return {
    endpoint,
    keys: {
      p256dh: ecdh.generateKeys().toString("base64url"),
      auth: crypto.randomBytes(16).toString("base64url"),
    },
  };
}
const base = () => ({
  welcomeSentAt: NOW - 2 * DAY,
  subscription: subscription(),
  endpointHash: "endpoint",
  timezone: "Asia/Seoul",
  reminderTime: "18:00",
  lastPracticedAt: NOW - DAY,
  sentMilestone: 0,
  retryAfter: 0,
  url: "/#/videos/pupilsPage",
});

describe("Practice reminder delivery", () => {
  test("only the latest reached milestone is sent, then pauses at day 30", async () => {
    const store = createMemoryReminderStore();
    const send = jest.fn(async () => {});
    await store.mutate(id, () => ({
      ...base(),
      lastPracticedAt: NOW - 8 * DAY,
    }));
    expect(await dispatchPracticeReminders({ store, send, now: NOW })).toBe(1);
    expect(JSON.parse(send.mock.calls[0][1]).body).toContain("refresher");
    await dispatchPracticeReminders({ store, send, now: NOW });
    expect(send).toHaveBeenCalledTimes(1);
    await dispatchPracticeReminders({ store, send, now: NOW + 22 * DAY });
    await dispatchPracticeReminders({ store, send, now: NOW + 70 * DAY });
    expect(send).toHaveBeenCalledTimes(2);
  });
  test.each([1, 3, 7, 30])(
    "day %i requires the full elapsed threshold",
    (day) => {
      const row = { ...base(), lastPracticedAt: NOW - day * DAY };
      expect(dueMilestone(row, NOW)).toBe(day);
      expect(dueMilestone({ ...row, sentMilestone: day }, NOW)).toBeNull();
      if (day === 1)
        expect(
          dueMilestone(
            { ...row, lastPracticedAt: row.lastPracticedAt + 1 },
            NOW,
          ),
        ).toBeNull();
    },
  );
  test("respects local time, midnight windows, DST and retry delay", () => {
    expect(dueMilestone({ ...base(), reminderTime: "12:00" }, NOW)).toBeNull();
    expect(dueMilestone({ ...base(), retryAfter: NOW + 1 }, NOW)).toBeNull();
    const midnight = Date.parse("2026-11-04T15:05:00Z");
    expect(dueMilestone({ ...base(), reminderTime: "23:30" }, midnight)).toBe(
      1,
    );
    const afterDst = Date.parse("2026-11-04T23:05:00Z");
    expect(
      dueMilestone({ ...base(), timezone: "America/New_York" }, afterDst),
    ).toBe(1);
    expect(dueMilestone({ ...base(), lastPracticedAt: 0 }, NOW)).toBeNull();
  });
  test("concurrent workers do not duplicate a milestone", async () => {
    const store = createMemoryReminderStore();
    await store.mutate(id, base);
    const send = jest.fn(async () => {});
    await Promise.all(
      [1, 2].map(() => dispatchPracticeReminders({ store, send, now: NOW })),
    );
    expect(send).toHaveBeenCalledTimes(1);
  });
  test("expired subscriptions are deleted, temporary failures back off", async () => {
    const store = createMemoryReminderStore();
    await store.mutate(id, base);
    await dispatchPracticeReminders({
      store,
      now: NOW,
      send: async () => {
        throw { statusCode: 410 };
      },
    });
    expect(await store.ids()).toEqual([]);
    await store.mutate(id, base);
    const send = jest.fn(async () => {
      throw { statusCode: 503 };
    });
    await dispatchPracticeReminders({ store, send, now: NOW });
    await dispatchPracticeReminders({ store, send, now: NOW + 5 * 60000 });
    expect(send).toHaveBeenCalledTimes(1);
    let saved;
    await store.mutate(id, (row) => {
      saved = row;
      return row;
    });
    expect(saved.sentMilestone).toBe(0);
    expect(saved.retryAfter).toBe(NOW + 3600000);
  });
});

describe("Practice reminder API", () => {
  let app, store, body, pushSend;
  const mutate = (method, path, data, secret = token) =>
    request(app)
      [method](`/api/reminders${path}`)
      .set("Host", "127.0.0.1")
      .set("Origin", "http://127.0.0.1")
      .set("Authorization", `Bearer ${secret}`)
      .send(data);
  beforeEach(() => {
    store = createMemoryReminderStore();
    pushSend = jest.fn(async () => {});
    app = express();
    app.use(
      "/api/reminders",
      createReminderRouter({
        store,
        config: () => ({ publicKey: "public-only" }),
        sendNotification: pushSend,
      }),
    );
    body = {
      subscription: subscription(),
      timezone: "Asia/Seoul",
      reminderTime: "18:00",
      lastPracticedAt: Date.now() - DAY,
      url: "/#/videos/pupilsPage",
    };
  });
  test("configuration exposes only the public key and disabled configuration fails closed", async () => {
    const response = await request(app).get("/api/reminders/config");
    expect(response.body).toEqual({
      available: true,
      publicKey: "public-only",
    });
    expect(response.headers["cache-control"]).toContain("no-store");
    const disabled = express();
    disabled.use(createReminderRouter({ store, config: () => null }));
    expect((await request(disabled).get("/config")).body).toEqual({
      available: false,
      reason: "disabled",
    });
    const keys = require("web-push").generateVAPIDKeys();
    const savedEnv = { ...process.env };
    try {
      Object.assign(process.env, {
        WEB_PUSH_ENABLED: "true",
        WEB_PUSH_PUBLIC_KEY: keys.publicKey,
        WEB_PUSH_PRIVATE_KEY: keys.privateKey,
        WEB_PUSH_SUBJECT: "mailto:test@example.com",
      });
      expect(readPushConfig()).toEqual({
        ...keys,
        subject: "mailto:test@example.com",
      });
      process.env.WEB_PUSH_PRIVATE_KEY = "invalid";
      expect(readPushConfig()).toBeNull();
    } finally {
      process.env = savedEnv;
    }
  });
  test("requires same-origin requests and an unguessable device token", async () => {
    expect(
      (await request(app).put("/api/reminders/subscription").send(body)).status,
    ).toBe(403);
    expect((await mutate("put", "/subscription", body, "bad")).status).toBe(
      401,
    );
    expect(
      (
        await mutate("put", "/subscription", body).set(
          "Origin",
          "https://evil.example",
        )
      ).status,
    ).toBe(403);
  });
  test.each(["same-origin", "same-site", "none"])(
    "accepts the public HTTPS app behind an HTTP proxy (%s)",
    async (site) => {
      const result = await request(app)
        .put("/api/reminders/subscription")
        .set("Host", "www.arclightproject.app")
        .set("Origin", "https://www.arclightproject.app")
        .set("Sec-Fetch-Site", site)
        .set("Authorization", `Bearer ${token}`)
        .send(body);
      expect(result.status).toBe(204);
    },
  );
  test("public alias is allowed but insecure origins, spoofed proxy headers and cross-site requests are rejected", async () => {
    const send = (
      origin,
      host = "www.arclightproject.app",
      site = "same-origin",
    ) =>
      request(app)
        .put("/api/reminders/subscription")
        .set("Host", host)
        .set("Origin", origin)
        .set("Sec-Fetch-Site", site)
        .set("X-Forwarded-Host", "www.arclightproject.app")
        .set("X-Forwarded-Proto", "https")
        .set("Authorization", `Bearer ${token}`)
        .send(body);
    expect((await send("https://arclightproject.app")).status).toBe(204);
    for (const origin of [
      "null",
      "http://www.arclightproject.app",
      "https://www.arclightproject.app.evil.example",
      "https://evil.example",
      "https://www.arclightproject.app:444",
    ])
      expect((await send(origin)).status).toBe(403);
    expect(
      (await send("https://www.arclightproject.app", "evil.example")).status,
    ).toBe(403);
    expect(
      (
        await send(
          "https://www.arclightproject.app",
          "www.arclightproject.app",
          "cross-site",
        )
      ).status,
    ).toBe(403);
  });
  test("practice advances monotonically and resets delivery only on new practice", async () => {
    expect((await mutate("put", "/subscription", body)).status).toBe(204);
    await store.mutate(id, (row) => ({ ...row, sentMilestone: 7 }));
    await mutate("put", "/subscription", body);
    let saved;
    await store.mutate(id, (row) => {
      saved = row;
      return row;
    });
    expect(saved.sentMilestone).toBe(7);
    await mutate("post", "/practice", {
      lastPracticedAt: Date.now(),
      url: "https://evil.example/",
    });
    await store.mutate(id, (row) => {
      saved = row;
      return row;
    });
    expect(saved.sentMilestone).toBe(0);
    expect(saved.url).toBe("/#/mylearning");
    const latest = saved.lastPracticedAt;
    await mutate("post", "/practice", { lastPracticedAt: latest - DAY });
    await store.mutate(id, (row) => {
      expect(row.lastPracticedAt).toBe(latest);
      return row;
    });
    expect((await mutate("delete", "/subscription")).status).toBe(204);
    expect(await store.ids()).toEqual([]);
  });
  test("another token cannot take an endpoint or delete its subscription", async () => {
    await mutate("put", "/subscription", body);
    expect(
      (await mutate("put", "/subscription", body, "b".repeat(64))).status,
    ).toBe(409);
    await mutate("delete", "/subscription", undefined, "b".repeat(64));
    expect(await store.ids()).toEqual([id]);
    expect(pushSend).toHaveBeenCalledTimes(1);
  });
  test("subscribing sends the first notification immediately once, with no practice timestamp", async () => {
    const payload = { ...body, lastPracticedAt: 0 };
    expect((await mutate("put", "/subscription", payload)).status).toBe(204);
    expect(pushSend).toHaveBeenCalledTimes(1);
    expect(JSON.parse(pushSend.mock.calls[0][1])).toMatchObject({
      id: "welcome-v1",
      body: "Ready for a little practice? Continue where you left off.",
    });
    await mutate("put", "/subscription", payload);
    await mutate("delete", "/subscription");
    const off = await request(app)
      .get("/api/reminders/history")
      .set("Authorization", `Bearer ${token}`);
    expect(off.body.enabled).toBe(false);
    expect(off.body.notifications).toHaveLength(1);
    await mutate("put", "/subscription", payload);
    expect(pushSend).toHaveBeenCalledTimes(1);
    const response = await request(app)
      .get("/api/reminders/history")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.notifications).toHaveLength(1);
    expect(response.body.enabled).toBe(true);
    expect(response.text).not.toContain(payload.subscription.endpoint);
    expect((await request(app).get("/api/reminders/history")).status).toBe(401);
  });
  test("explicit enabling sends immediately each time, but retries and ordinary sync never duplicate it", async () => {
    await mutate("put", "/subscription", body);
    const first = { ...body, enableRequestId: "c".repeat(64) };
    const response = await mutate("put", "/subscription", first);
    expect(response.body).toEqual({ enabled: true, delivery: "accepted" });
    await Promise.all([
      mutate("put", "/subscription", first),
      mutate("put", "/subscription", body),
    ]);
    expect(pushSend).toHaveBeenCalledTimes(2);
    await mutate("delete", "/subscription");
    await mutate("put", "/subscription", {
      ...body,
      enableRequestId: "d".repeat(64),
    });
    expect(pushSend).toHaveBeenCalledTimes(3);
    expect(JSON.parse(pushSend.mock.calls[2][1]).id).toBe(
      `enabled:${"d".repeat(64)}`,
    );
  });
  test("an immediate delivery failure is reported and the scheduler retries even after day 30", async () => {
    await mutate("put", "/subscription", body);
    pushSend.mockRejectedValueOnce({ statusCode: 503 });
    const response = await mutate("put", "/subscription", {
      ...body,
      enableRequestId: "e".repeat(64),
    });
    expect(response.body).toEqual({ enabled: true, delivery: "pending" });
    await store.mutate(id, (row) => ({ ...row, sentMilestone: 30 }));
    await dispatchPracticeReminders({
      store,
      send: pushSend,
      now: Date.now() + 61000,
    });
    expect(pushSend).toHaveBeenCalledTimes(3);
    await store.mutate(id, (row) => {
      expect(row.pendingActivationId).toBeNull();
      expect(row.activationSentId).toBe("e".repeat(64));
      return row;
    });
  });
  test("accepts padded Safari subscription keys and normalizes them", async () => {
    const padded = {
      ...body,
      subscription: {
        ...body.subscription,
        keys: {
          auth: body.subscription.keys.auth + "==",
          p256dh: body.subscription.keys.p256dh + "=",
        },
      },
    };
    expect((await mutate("put", "/subscription", padded)).status).toBe(204);
    expect(pushSend.mock.calls[0][0].keys).toEqual(body.subscription.keys);
  });
  test("rejects malformed times, zones, timestamps and endpoints", async () => {
    for (const patch of [
      { reminderTime: "25:00" },
      { timezone: "invalid" },
      { lastPracticedAt: Date.now() + DAY },
      { subscription: subscription("https://127.0.0.1/internal") },
    ])
      expect(
        (await mutate("put", "/subscription", { ...body, ...patch })).status,
      ).toBe(400);
    for (const endpoint of [
      "http://fcm.googleapis.com/a",
      "https://fcm.googleapis.com.evil.example/a",
      "https://user:pass@fcm.googleapis.com/a",
      "https://fcm.googleapis.com:444/a",
      "https://localhost/a",
    ])
      expect(validSubscription(subscription(endpoint))).toBe(false);
    expect(
      validSubscription(subscription("https://web.push.apple.com/token")),
    ).toBe(true);
    expect(safePracticeUrl("//evil.example")).toBe("/#/mylearning");
  });
});
