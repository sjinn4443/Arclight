const { getReminderStore } = require("../storage/reminder-store.cjs");
const { resolvePushConfig } = require("./web-push-config.cjs");
const {
  deliverNotification,
  sendPush,
} = require("./notification-delivery.cjs");
const { dueMilestone } = require("./practice-reminder-policy.cjs");

async function dispatchPracticeReminders({ store, send, now = Date.now() }) {
  let sent = 0;
  for (const id of await store.ids()) {
    await store.mutate(id, async (record) => {
      if (!record?.subscription) return record;
      if (!record.welcomeSentAt) {
        const next = await deliverNotification(record, { send, now });
        if (next.welcomeSentAt) sent += 1;
        return next;
      }
      if (now - (record.lastNotificationAt || 0) < 86400000) return record;
      const milestone = dueMilestone(record, now);
      if (!milestone) return record;
      const next = await deliverNotification(record, { send, now, milestone });
      if (next.sentMilestone === milestone) sent += 1;
      return next;
    });
  }
  return sent;
}

function startPracticeReminderScheduler() {
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      const store = getReminderStore();
      const config = await resolvePushConfig({ store });
      if (!config) return;
      await dispatchPracticeReminders({
        store,
        send: (subscription, payload) =>
          sendPush(subscription, payload, config),
      });
    } catch {
      console.warn(
        "[reminders] delivery unavailable; retrying on next scheduled check",
      );
    } finally {
      running = false;
    }
  };
  const timer = setInterval(tick, 60000);
  timer.unref();
  void tick();
  return () => clearInterval(timer);
}
module.exports = { dispatchPracticeReminders, startPracticeReminderScheduler };
