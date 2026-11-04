const { MESSAGES, safePracticeUrl } = require("./practice-reminder-policy.cjs");

async function deliverNotification(
  record,
  { send, now = Date.now(), milestone = 0 } = {},
) {
  if (!record?.subscription) return record;
  if (record.retryAfter > now && (milestone || record.welcomeAttemptedAt))
    return record;
  if (!milestone && record.welcomeSentAt) return record;
  const notification = {
    id: milestone
      ? `practice:${record.lastPracticedAt}:${milestone}`
      : "welcome-v1",
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
      ...(milestone ? { sentMilestone: milestone } : { welcomeSentAt: now }),
      history: [
        notification,
        ...(record.history || []).filter((item) => item.id !== notification.id),
      ].slice(0, 100),
    };
  } catch (error) {
    if ([404, 410].includes(error.statusCode))
      return { ...record, subscription: null };
    return {
      ...record,
      ...(!milestone ? { welcomeAttemptedAt: now } : {}),
      retryAfter: now + (milestone ? 3600000 : 60000),
    };
  }
}

function sendPush(subscription, payload, config) {
  return require("web-push").sendNotification(subscription, payload, {
    vapidDetails: config,
    TTL: JSON.parse(payload).id === "welcome-v1" ? 86400 : 3600,
    urgency: "normal",
    topic: "arclight-practice",
    timeout: 10000,
  });
}
module.exports = { deliverNotification, sendPush };
