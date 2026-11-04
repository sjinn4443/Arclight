const { getReminderStore } = require("../storage/reminder-store.cjs");
const { readPushConfig } = require("../security/reminder-api.cjs");
const {
  dueMilestone,
  MESSAGES,
  safePracticeUrl,
} = require("./practice-reminder-policy.cjs");

async function dispatchPracticeReminders({ store, send, now = Date.now() }) {
  let sent = 0;
  for (const id of await store.ids()) {
    await store.mutate(id, async (record) => {
      if (!record) return null;
      const milestone = dueMilestone(record, now);
      if (!milestone) return record;
      try {
        await send(
          record.subscription,
          JSON.stringify({
            title: "Arclight practice",
            body: MESSAGES[milestone],
            url: safePracticeUrl(record.url),
            sentAt: now,
          }),
        );
        sent += 1;
        return { ...record, sentMilestone: milestone, retryAfter: 0 };
      } catch (error) {
        if ([404, 410].includes(error.statusCode)) return null;
        // Retry during a later delivery window, never in a tight loop.
        return { ...record, retryAfter: now + 3600000 };
      }
    });
  }
  return sent;
}

function startPracticeReminderScheduler() {
  const config = readPushConfig();
  if (!config) return () => {};
  const webpush = require("web-push");
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      await dispatchPracticeReminders({
        store: getReminderStore(),
        send: (subscription, payload) =>
          webpush.sendNotification(subscription, payload, {
            vapidDetails: config,
            TTL: 3600,
            urgency: "normal",
            topic: "arclight-practice",
            timeout: 10000,
          }),
      });
    } catch {
      console.warn(
        "[reminders] delivery unavailable; retrying on next scheduled check",
      );
    } finally {
      running = false;
    }
  };
  const timer = setInterval(tick, 5 * 60000);
  timer.unref();
  void tick();
  return () => clearInterval(timer);
}
module.exports = { dispatchPracticeReminders, startPracticeReminderScheduler };
