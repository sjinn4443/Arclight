/** @jest-environment node */
const { deliverNotification } = require("../utils/notification-delivery.cjs");
const {
  dispatchPracticeReminders,
} = require("../utils/practice-reminder-scheduler.cjs");
const { createMemoryReminderStore } = require("../storage/reminder-store.cjs");
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
