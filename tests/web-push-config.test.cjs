/** @jest-environment node */
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const express = require("express");
const request = require("supertest");
const webpush = require("web-push");
const { resolvePushConfig } = require("../utils/web-push-config.cjs");
const { createMemoryReminderStore } = require("../storage/reminder-store.cjs");
const { createReminderRouter } = require("../security/reminder-api.cjs");

test("missing manual settings bootstrap one stable key pair across concurrent requests", async () => {
  const store = createMemoryReminderStore();
  const configs = await Promise.all(
    Array.from({ length: 8 }, () => resolvePushConfig({ store, env: {} })),
  );
  expect(new Set(configs.map((c) => c.publicKey)).size).toBe(1);
  expect(configs[0].publicKey).toHaveLength(87);
  expect(configs[0].privateKey).toHaveLength(43);
  expect(await store.ids()).toEqual([]);
});
test("stored keys survive restart and device unsubscribe without regeneration", async () => {
  const dir = await fs.mkdtemp(
    path.join(os.tmpdir(), "arclight-push-config-test-"),
  );
  const file = path.join(dir, "reminders.enc");
  const { encrypt, decrypt } = require("../reports/security/encrypt.cjs");
  try {
    const first = createMemoryReminderStore({ file, encrypt, decrypt });
    const config = await resolvePushConfig({ store: first, env: {} });
    await first.mutate("device", () => ({ endpointHash: "endpoint" }));
    await first.mutate("device", () => null);
    const second = createMemoryReminderStore({ file, encrypt, decrypt });
    expect(await resolvePushConfig({ store: second, env: {} })).toEqual(config);
    expect(await second.ids()).toEqual([]);
    expect(await fs.readFile(file, "utf8")).not.toContain(config.privateKey);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});
test.each(["false", "0", "off"])(
  "explicit disable %s does not generate keys",
  async (value) => {
    const store = { getOrCreatePushConfig: jest.fn() };
    expect(
      await resolvePushConfig({ store, env: { WEB_PUSH_ENABLED: value } }),
    ).toBeNull();
    expect(store.getOrCreatePushConfig).not.toHaveBeenCalled();
  },
);
test("manual keys take precedence; incomplete or invalid keys are not silently replaced", async () => {
  const store = { getOrCreatePushConfig: jest.fn() };
  const keys = webpush.generateVAPIDKeys();
  const env = {
    WEB_PUSH_PUBLIC_KEY: keys.publicKey,
    WEB_PUSH_PRIVATE_KEY: keys.privateKey,
    WEB_PUSH_SUBJECT: "mailto:test@example.com",
  };
  expect(await resolvePushConfig({ store, env })).toEqual({
    ...keys,
    subject: env.WEB_PUSH_SUBJECT,
  });
  await expect(
    resolvePushConfig({ store, env: { WEB_PUSH_PUBLIC_KEY: keys.publicKey } }),
  ).rejects.toMatchObject({ reason: "configuration_invalid" });
  expect(store.getOrCreatePushConfig).not.toHaveBeenCalled();
});
test("public config bootstraps a real server key and never exposes private credentials", async () => {
  const store = createMemoryReminderStore();
  const app = express();
  app.use(
    createReminderRouter({
      store,
      config: () => resolvePushConfig({ store, env: {} }),
    }),
  );
  const first = await request(app).get("/config");
  const second = await request(app).get("/config");
  expect(first.body).toEqual({
    available: true,
    publicKey: second.body.publicKey,
  });
  expect(first.body.publicKey).toHaveLength(87);
  const secret = await resolvePushConfig({ store, env: {} });
  expect(first.text).not.toContain(secret.privateKey);
  expect(first.body).not.toHaveProperty("privateKey");
  expect(first.headers["cache-control"]).toContain("no-store");
});
test("database failures return a safe actionable reason", async () => {
  const app = express();
  app.use(
    createReminderRouter({
      config: async () => {
        throw new Error("postgres://private-credentials");
      },
    }),
  );
  const response = await request(app).get("/config");
  expect(response.body).toEqual({
    available: false,
    reason: "storage_unavailable",
  });
  expect(response.text).not.toContain("credentials");
});

test("contact updates do not rotate persisted keys", async () => {
  const store = createMemoryReminderStore();
  const first = await resolvePushConfig({ store, env: {} });
  const next = await resolvePushConfig({
    store,
    env: { WEB_PUSH_SUBJECT: "mailto:updated@example.com" },
  });
  expect(next.publicKey).toBe(first.publicKey);
  expect(next.subject).toBe("mailto:updated@example.com");
});
