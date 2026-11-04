/** @jest-environment node */
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

function worker() {
  const events = {};
  const self = {
    location: { origin: "https://arclight.example" },
    registration: { showNotification: jest.fn(async () => {}) },
    clients: {
      matchAll: jest.fn(async () => []),
      openWindow: jest.fn(async () => {}),
    },
    addEventListener: (name, fn) => {
      events[name] = fn;
    },
  };
  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, "../public/sw.js"), "utf8"),
    { self, URL, console },
  );
  return { self, events };
}
test("push displays a notification and sanitizes external deep links", async () => {
  const { self, events } = worker();
  let work;
  events.push({
    data: {
      json: () => ({ body: "Time to practise", url: "https://evil.example" }),
    },
    waitUntil: (task) => {
      work = task;
    },
  });
  await work;
  expect(self.registration.showNotification).toHaveBeenCalledWith(
    "Arclight practice",
    expect.objectContaining({
      tag: "arclight-practice",
      data: { url: "/#/mylearning" },
    }),
  );
});
test("notification tap opens the app route, or focuses an existing app window", async () => {
  const { self, events } = worker();
  const event = {
    notification: {
      tag: "arclight-practice",
      close: jest.fn(),
      data: { url: "/#/videos/pupilsPage" },
    },
    waitUntil: (task) => {
      event.work = task;
    },
  };
  events.notificationclick(event);
  await event.work;
  expect(self.clients.openWindow).toHaveBeenCalledWith(
    "https://arclight.example/#/videos/pupilsPage",
  );
  const focus = jest.fn();
  const client = {
    url: "https://arclight.example/",
    navigate: jest.fn(async () => ({ focus })),
  };
  self.clients.matchAll.mockResolvedValue([client]);
  events.notificationclick(event);
  await event.work;
  expect(client.navigate).toHaveBeenCalledWith(
    "https://arclight.example/#/videos/pupilsPage",
  );
  expect(focus).toHaveBeenCalled();
});
