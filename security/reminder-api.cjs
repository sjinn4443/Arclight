const express = require("express");
const crypto = require("node:crypto");
const rateLimit = require("express-rate-limit");
const { getReminderStore } = require("../storage/reminder-store.cjs");
const {
  readPushConfig,
  resolvePushConfig,
} = require("../utils/web-push-config.cjs");
const {
  validTimezone,
  safePracticeUrl,
} = require("../utils/practice-reminder-policy.cjs");

const digest = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");
function validSubscription(input) {
  if (
    !input ||
    typeof input.endpoint !== "string" ||
    input.endpoint.length > 2048
  )
    return false;
  try {
    const url = new URL(input.endpoint);
    const host = url.hostname;
    const allowed =
      host === "fcm.googleapis.com" ||
      host === "updates.push.services.mozilla.com" ||
      host.endsWith(".push.services.mozilla.com") ||
      host.endsWith(".push.apple.com") ||
      host.endsWith(".notify.windows.com");
    if (
      url.protocol !== "https:" ||
      url.port ||
      url.username ||
      url.password ||
      url.hash ||
      !allowed
    )
      return false;
    if (
      !/^[A-Za-z0-9_-]{87}$/.test(input.keys?.p256dh || "") ||
      !/^[A-Za-z0-9_-]{22}$/.test(input.keys?.auth || "")
    )
      return false;
    crypto.ECDH.convertKey(
      Buffer.from(input.keys.p256dh, "base64url"),
      "prime256v1",
    );
    return true;
  } catch {
    return false;
  }
}
function sameOrigin(req) {
  try {
    return (
      (!req.get("sec-fetch-site") ||
        req.get("sec-fetch-site") === "same-origin") &&
      new URL(req.get("origin")).origin ===
        `${req.protocol}://${req.get("host")}`
    );
  } catch {
    return false;
  }
}
function createReminderRouter({ store: providedStore, config } = {}) {
  const router = express.Router();
  const store = () => providedStore || getReminderStore();
  const configuration = () =>
    config ? config() : resolvePushConfig({ store: providedStore });
  const limit = rateLimit({
    windowMs: 15 * 60000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
  });
  router.use((req, res, next) => {
    res.set("Cache-Control", "no-store, private");
    next();
  });
  router.get("/config", async (_req, res) => {
    try {
      const details = await configuration();
      if (!details) return res.json({ available: false, reason: "disabled" });
      await store().ready();
      return res.json({ available: true, publicKey: details.publicKey });
    } catch (error) {
      return res.json({
        available: false,
        reason: error.reason || "storage_unavailable",
      });
    }
  });
  router.use(limit);
  router.use((req, res, next) => {
    if (!sameOrigin(req))
      return res.status(403).json({ error: "same_origin_required" });
    const token = /^Bearer ([a-f0-9]{64})$/.exec(
      req.get("authorization") || "",
    )?.[1];
    if (!token) return res.status(401).json({ error: "device_token_required" });
    req.reminderId = digest(token);
    next();
  });
  router.use(express.json({ limit: "6kb" }));
  const action = (fn) => async (req, res) => {
    try {
      await fn(req, res);
    } catch (error) {
      res.status(error.status || 503).json({
        error: error.status ? error.message : "reminders_unavailable",
      });
    }
  };
  router.put(
    "/subscription",
    action(async (req, res) => {
      if (!(await configuration()))
        return res.status(503).json({ error: "reminders_unavailable" });
      const { subscription, timezone, reminderTime, lastPracticedAt } =
        req.body;
      if (
        !validSubscription(subscription) ||
        !validTimezone(timezone) ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(reminderTime || "") ||
        !Number.isSafeInteger(lastPracticedAt) ||
        lastPracticedAt < 0 ||
        lastPracticedAt > Date.now() + 60000
      )
        return res.status(400).json({ error: "invalid_subscription" });
      const timestamp = Math.min(lastPracticedAt, Date.now());
      await store().mutate(req.reminderId, (old) => {
        const latest = Math.max(old?.lastPracticedAt || 0, timestamp);
        return {
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              auth: subscription.keys.auth,
              p256dh: subscription.keys.p256dh,
            },
          },
          endpointHash: digest(subscription.endpoint),
          timezone,
          reminderTime,
          lastPracticedAt: latest,
          url:
            timestamp >= (old?.lastPracticedAt || 0)
              ? safePracticeUrl(req.body.url)
              : old.url,
          sentMilestone:
            latest > (old?.lastPracticedAt || 0) ? 0 : old?.sentMilestone || 0,
          retryAfter: 0,
        };
      });
      res.status(204).end();
    }),
  );
  router.post(
    "/practice",
    action(async (req, res) => {
      const timestamp = req.body.lastPracticedAt;
      if (
        !Number.isSafeInteger(timestamp) ||
        timestamp <= 0 ||
        timestamp > Date.now() + 60000
      )
        return res.status(400).json({ error: "invalid_practice" });
      let found = false;
      await store().mutate(req.reminderId, (old) => {
        found = Boolean(old);
        if (!old || timestamp <= old.lastPracticedAt) return old;
        return {
          ...old,
          lastPracticedAt: Math.min(timestamp, Date.now()),
          url: safePracticeUrl(req.body.url),
          sentMilestone: 0,
          retryAfter: 0,
        };
      });
      res.status(found ? 204 : 404).end();
    }),
  );
  router.delete(
    "/subscription",
    action(async (req, res) => {
      await store().mutate(req.reminderId, () => null);
      res.status(204).end();
    }),
  );
  return router;
}
module.exports = { createReminderRouter, readPushConfig, validSubscription };
