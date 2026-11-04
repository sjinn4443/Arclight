/** @jest-environment node */
const { deliverNotification } = require("../utils/notification-delivery.cjs");
const {
  dispatchPracticeReminders,
} = require("../utils/practice-reminder-scheduler.cjs");
const { createMemoryReminderStore } = require("../storage/reminder-store.cjs");
const { NOTI04_CAMPAIGN } = require("../utils/noti04-campaign.cjs");
const record = () => ({
  subscription: { endpoint: "https://fcm.googleapis.com/test" },
  endpointHash: "endpoint",
  lastPracticedAt: 0,
  sentMilestone: 30,
  timezone: "UTC",
  reminderTime: "18:00",
});

test("startup welcomes an existing subscription once regardless of elapsed milestones", async () => {
  const store = createMemoryReminderStore();
  await store.mutate("device", record);
  const send = jest.fn(async () => {});
  await Promise.all(
    [1, 2].map(() =>
      dispatchPracticeReminders({ store, send, now: 100000000 }),
    ),
  );
  expect(send).toHaveBeenCalledTimes(1);
  const payload = JSON.parse(send.mock.calls[0][1]);
  expect(payload.body).toBe(
    "Ready for a little practice? Continue where you left off.",
  );
  await store.mutate("device", (row) => {
    expect(row.history).toHaveLength(1);
    return row;
  });
});
test("first send failures back off and retry without recording a successful send", async () => {
  const send = jest
    .fn()
    .mockRejectedValueOnce({ statusCode: 503 })
    .mockResolvedValue(undefined);
  let row = await deliverNotification(record(), { send, now: 100000 });
  expect(row.welcomeSentAt).toBeUndefined();
  expect(row.history).toBeUndefined();
  row = await deliverNotification(row, { send, now: 100001 });
  expect(send).toHaveBeenCalledTimes(1);
  row = await deliverNotification(row, { send, now: 160000 });
  expect(row.welcomeSentAt).toBe(160000);
  expect(row.history).toHaveLength(1);
});
test("regular notifications preserve the welcome and history and are capped", async () => {
  const send = jest.fn(async () => {});
  let row = await deliverNotification(record(), { send, now: 100000 });
  row.lastPracticedAt = 1;
  row = await deliverNotification(row, { send, now: 200000, milestone: 3 });
  expect(row.welcomeSentAt).toBe(100000);
  expect(row.history.map((n) => n.id)).toEqual(["practice:1:3", "welcome-v1"]);
  row.history = Array.from({ length: 100 }, (_, i) => ({ id: String(i) }));
  row = await deliverNotification(row, { send, now: 300000, milestone: 7 });
  expect(row.history).toHaveLength(100);
});

test("noti04 broadcasts once to existing active devices, including paused regular reminders", async () => {
  const store = createMemoryReminderStore();
  const send = jest.fn(async () => {});
  await store.mutate("existing", () => ({
    ...record(),
    welcomeSentAt: NOTI04_CAMPAIGN.cutoff - 10000,
  }));
  await store.mutate("new", () => ({
    ...record(),
    endpointHash: "endpoint-new",
    welcomeSentAt: NOTI04_CAMPAIGN.cutoff + 1,
    registeredAt: NOTI04_CAMPAIGN.cutoff + 1,
  }));
  const dispatch = () =>
    dispatchPracticeReminders({
      store,
      send,
      now: NOTI04_CAMPAIGN.cutoff + 20000,
      campaign: NOTI04_CAMPAIGN,
    });
  await Promise.all([dispatch(), dispatch()]);
  expect(send).toHaveBeenCalledTimes(1);
  expect(JSON.parse(send.mock.calls[0][1]).id).toBe(NOTI04_CAMPAIGN.id);
  await store.mutate("existing", (old) => ({ ...old, subscription: null }));
  await store.mutate("existing", (old) => ({
    ...old,
    subscription: record().subscription,
  }));
  await dispatch();
  expect(send).toHaveBeenCalledTimes(1);
});
test("a queued welcome satisfies the broadcast without sending two notifications", async () => {
  const store = createMemoryReminderStore();
  await store.mutate("existing", record);
  const send = jest.fn(async () => {});
  const dispatch = () =>
    dispatchPracticeReminders({
      store,
      send,
      now: NOTI04_CAMPAIGN.cutoff + 20000,
      campaign: NOTI04_CAMPAIGN,
    });
  await dispatch();
  await dispatch();
  expect(send).toHaveBeenCalledTimes(1);
  expect(JSON.parse(send.mock.calls[0][1]).id).toBe("welcome-v1");
});
