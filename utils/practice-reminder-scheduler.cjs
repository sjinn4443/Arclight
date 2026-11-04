const { getReminderStore } = require("../storage/reminder-store.cjs");
const { resolvePushConfig } = require("./web-push-config.cjs");
const {
  deliverNotification,
  sendPush,
} = require("./notification-delivery.cjs");
const { dueMilestone } = require("./practice-reminder-policy.cjs");
const {
  NOTI04_CAMPAIGN,
  eligibleForCampaign,
} = require("./noti04-campaign.cjs");

async function dispatchPracticeReminders({
  store,
  send,
  now = Date.now(),
  campaign = null,
}) {
  let sent = 0;
  for (const id of await store.ids({ campaign })) {
    await store.mutate(id, async (record) => {
      if (!record?.subscription) return record;
      if (!record.welcomeSentAt) {
        const next = await deliverNotification(record, { send, now });
        if (next.welcomeSentAt) {
          sent += 1;
          // One welcome satisfies the broadcast too; don't send two at once.
          if (eligibleForCampaign(record, campaign))
            next.campaigns = { ...next.campaigns, [campaign.id]: now };
        }
        return next;
      }
      if (eligibleForCampaign(record, campaign)) {
        const next = await deliverNotification(record, {
          send,
          now,
          campaignId: campaign.id,
        });
        if (next.campaigns?.[campaign.id]) sent += 1;
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
  let startupLogged = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      const store = getReminderStore();
      const config = await resolvePushConfig({ store });
      if (!config) return;
      const sent = await dispatchPracticeReminders({
        store,
        campaign: NOTI04_CAMPAIGN,
        send: (subscription, payload) =>
          sendPush(subscription, payload, config),
      });
      if (sent || !startupLogged)
        console.warn(
          `[reminders] provider accepted ${sent} notification(s); campaign=${NOTI04_CAMPAIGN.id}`,
        );
      startupLogged = true;
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
