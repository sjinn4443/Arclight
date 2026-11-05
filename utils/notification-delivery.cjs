const { MESSAGES, safePracticeUrl } = require("./practice-reminder-policy.cjs");

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
    console.warn(
      `[reminders] provider rejected notification; status=${Number.isInteger(error.statusCode) ? error.statusCode : "transport"}`,
    );
    if ([404, 410].includes(error.statusCode))
      return { ...record, subscription: null };
    return {
      ...record,
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
  return require("web-push").sendNotification(subscription, payload, {
    vapidDetails: config,
    TTL: JSON.parse(payload).id.startsWith("practice:") ? 3600 : 86400,
    urgency: JSON.parse(payload).id.startsWith("practice:") ? "normal" : "high",
    topic: "arclight-practice",
    timeout: 10000,
  });
}
module.exports = { deliverNotification, sendPush };
