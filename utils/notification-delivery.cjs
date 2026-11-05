const { MESSAGES, safePracticeUrl } = require("./practice-reminder-policy.cjs");

// Never log provider response bodies: they can contain subscription details.
const PROVIDER_REASONS = new Set([
  "BadTtl",
  "BadUrgency",
  "BadWebPushRequest",
  "BadWebPushToken",
  "BadWebPushTopic",
  "VapidPkHashMismatch",
  "IdleTimeout",
  "BadAuthorizationHeader",
  "BadJwtToken",
  "BadVapidPublicKey",
  "BadPath",
  "MethodNotAllowed",
  "PayloadTooLarge",
  "TooManyRequests",
  "InternalServerError",
  "ServiceUnavailable",
  "Shutdown",
]);
function deliveryFailure(error, now) {
  let reason = "unclassified";
  try {
    const candidate = JSON.parse(
      String(error.body || "").slice(0, 2048),
    ).reason;
    if (PROVIDER_REASONS.has(candidate)) reason = candidate;
  } catch {
    /* Keep raw provider text private. */
  }
  return {
    at: now,
    status: Number.isInteger(error.statusCode) ? error.statusCode : null,
    reason,
  };
}

function pushOptions(payload, config) {
  const regular = JSON.parse(payload).id.startsWith("practice:");
  return {
    vapidDetails: config,
    contentEncoding: "aes128gcm",
    TTL: regular ? 3600 : 86400,
    urgency: "high",
    // Topic is optional. Distinct app notifications already have stable IDs;
    // omit provider coalescing so it cannot reject or replace a test alert.
    timeout: 10000,
  };
}

async function deliverNotification(
  record,
  { send, now = Date.now(), milestone = 0, campaignId = "" } = {},
) {
  if (!record?.subscription) return record;
  const activationId = record.pendingActivationId;
  if (campaignId && record.campaigns?.[campaignId]) return record;
  if (
    record.retryAfter > now &&
    (activationId
      ? record.activationAttemptId === activationId
      : campaignId
        ? record.campaignAttempts?.[campaignId]
        : milestone || record.welcomeAttemptedAt)
  )
    return record;
  if (!activationId && !campaignId && !milestone && record.welcomeSentAt)
    return record;
  const notification = {
    id:
      (activationId && `enabled:${activationId}`) ||
      campaignId ||
      (milestone
        ? `practice:${record.lastPracticedAt}:${milestone}`
        : "welcome-v1"),
    title: "Arclight practice",
    body: MESSAGES[milestone || 1],
    url: safePracticeUrl(record.url),
    sentAt: now,
  };
  try {
    await send(record.subscription, JSON.stringify(notification));
    return {
      ...record,
      retryAfter: 0,
      lastDeliveryFailure: null,
      lastNotificationAt: now,
      ...(activationId
        ? {
            pendingActivationId: null,
            activationSentId: activationId,
            welcomeSentAt: record.welcomeSentAt || now,
          }
        : campaignId
          ? { campaigns: { ...record.campaigns, [campaignId]: now } }
          : milestone
            ? { sentMilestone: milestone }
            : { welcomeSentAt: now }),
      history: [
        notification,
        ...(record.history || []).filter((item) => item.id !== notification.id),
      ].slice(0, 100),
    };
  } catch (error) {
    const failure = deliveryFailure(error, now);
    console.warn(
      `[reminders] provider rejected notification; status=${failure.status || "transport"}; reason=${failure.reason}`,
    );
    if (
      [404, 410].includes(error.statusCode) ||
      ([400, 403].includes(error.statusCode) &&
        ["BadWebPushToken", "VapidPkHashMismatch"].includes(failure.reason))
    )
      return { ...record, subscription: null, lastDeliveryFailure: failure };
    return {
      ...record,
      lastDeliveryFailure: failure,
      ...(activationId
        ? { activationAttemptId: activationId }
        : campaignId
          ? {
              campaignAttempts: {
                ...record.campaignAttempts,
                [campaignId]: now,
              },
            }
          : !milestone
            ? { welcomeAttemptedAt: now }
            : {}),
      retryAfter: now + (milestone ? 3600000 : 60000),
    };
  }
}

function sendPush(subscription, payload, config) {
  return require("web-push").sendNotification(
    subscription,
    payload,
    pushOptions(payload, config),
  );
}
module.exports = { deliverNotification, sendPush, pushOptions };
