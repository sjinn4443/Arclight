/**
 * @jest-environment node
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadServiceWorker(fetchImpl) {
  const handlers = {};
  const cache = {
    addAll: jest.fn().mockResolvedValue(undefined),
    match: jest.fn().mockResolvedValue(undefined),
    put: jest.fn().mockResolvedValue(undefined),
  };
  const caches = {
    delete: jest.fn().mockResolvedValue(true),
    keys: jest
      .fn()
      .mockResolvedValue(["arclight-static-v21", "arclight-static-v22"]),
    open: jest.fn().mockResolvedValue(cache),
  };
  const location = new URL("https://app.example.com/sw.js");
  const self = {
    clients: { claim: jest.fn().mockResolvedValue(undefined) },
    location,
    skipWaiting: jest.fn(),
    addEventListener: jest.fn((type, handler) => {
      handlers[type] = handler;
    }),
  };
  const context = vm.createContext({
    Blob,
    Headers,
    Request,
    Response,
    URL,
    caches,
    fetch: fetchImpl,
    location,
    self,
    setTimeout,
    clearTimeout,
  });
  const source = fs.readFileSync(
    path.join(__dirname, "..", "public", "sw.js"),
    "utf8",
  );
  vm.runInContext(source, context, { filename: "sw.js" });
  return { cache, caches, handlers, self };
}

describe("service worker sensitive-cache policy", () => {
  test.each([
    "/api/location/ip",
    "/api/app/version",
    "/api/dev/users",
    "/track",
    "/healthz",
    "/reports.html",
    "/html/reports.html",
  ])("bypasses %s", (pathname) => {
    const { handlers } = loadServiceWorker(jest.fn());
    const event = {
      request: new Request(`https://app.example.com${pathname}`),
      respondWith: jest.fn(),
    };

    handlers.fetch(event);
    expect(event.respondWith).not.toHaveBeenCalled();
  });

  test("rejects sensitive and cross-origin cache messages and honors no-store", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      new Response("static", {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }),
    );
    const { cache, handlers } = loadServiceWorker(fetchImpl);
    const messages = [];
    let work;
    handlers.message({
      data: {
        type: "CACHE_URLS",
        payload: [
          "/images/icon.png",
          "/api/location/ip",
          "https://evil.example/payload.js",
        ],
      },
      ports: [{ postMessage: (message) => messages.push(message) }],
      waitUntil: (promise) => {
        work = promise;
      },
    });
    await work;

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl.mock.calls[0][0].url).toBe(
      "https://app.example.com/images/icon.png",
    );
    expect(cache.put).not.toHaveBeenCalled();
    expect(messages.at(-1)).toMatchObject({
      type: "CACHE_DONE",
      cached: 0,
      total: 3,
    });
    expect(messages.at(-1).failed).toHaveLength(3);
  });

  test("removes the previous cache version during activation", async () => {
    const { caches, handlers, self } = loadServiceWorker(jest.fn());
    let work;
    handlers.activate({
      waitUntil: (promise) => {
        work = promise;
      },
    });
    await work;

    expect(caches.delete).toHaveBeenCalledWith("arclight-static-v21");
    expect(caches.delete).not.toHaveBeenCalledWith("arclight-static-v22");
    expect(self.clients.claim).toHaveBeenCalledTimes(1);
  });
});
