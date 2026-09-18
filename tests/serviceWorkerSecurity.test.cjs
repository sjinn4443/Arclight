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
    keys: jest.fn().mockResolvedValue([]),
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
  // sw.js is the single source of truth; version bumps need no test edits.
  const { cacheName, packCacheName } = vm.runInContext(
    "({ cacheName: CACHE_NAME, packCacheName: PACK_CACHE })",
    context,
  );
  return { cache, cacheName, caches, handlers, packCacheName, self };
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

  test("installs the shell into the current cache", async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ urls: ["/index.html"] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const { cache, cacheName, caches, handlers, self } =
      loadServiceWorker(fetchImpl);
    let work;
    handlers.install({
      waitUntil: (promise) => {
        work = promise;
      },
    });
    await work;

    expect(caches.open).toHaveBeenCalledWith(cacheName);
    expect(cache.addAll).toHaveBeenCalledWith([
      "https://app.example.com/index.html",
    ]);
    expect(self.skipWaiting).toHaveBeenCalledTimes(1);
  });

  test("rejects an incomplete shell installation and cleans its partial cache", async () => {
    const { cache, cacheName, caches, handlers, self } = loadServiceWorker(
      jest
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ urls: ["/index.html"] })),
        ),
    );
    cache.addAll.mockRejectedValue(new Error("Missing route asset"));
    let work;
    handlers.install({
      waitUntil: (promise) => {
        work = promise;
      },
    });
    await expect(work).rejects.toThrow("Missing route asset");
    expect(caches.delete).toHaveBeenCalledWith(cacheName);
    expect(self.skipWaiting).not.toHaveBeenCalled();
  });

  test("removes old shell caches but preserves the current cache, packs and unrelated caches", async () => {
    const { cacheName, caches, handlers, packCacheName, self } =
      loadServiceWorker(jest.fn());
    const oldCacheNames = ["arclight-static-v0", "arclight-static-v66"];
    const unrelatedCacheName = "another-app-v1";
    caches.keys.mockResolvedValue([
      ...oldCacheNames,
      cacheName,
      packCacheName,
      unrelatedCacheName,
    ]);
    let work;
    handlers.activate({
      waitUntil: (promise) => {
        work = promise;
      },
    });
    await work;

    expect(caches.delete).toHaveBeenCalledTimes(oldCacheNames.length);
    for (const oldCacheName of oldCacheNames) {
      expect(caches.delete).toHaveBeenCalledWith(oldCacheName);
    }
    expect(caches.delete).not.toHaveBeenCalledWith(cacheName);
    expect(caches.delete).not.toHaveBeenCalledWith(packCacheName);
    expect(caches.delete).not.toHaveBeenCalledWith(unrelatedCacheName);
    expect(self.clients.claim).toHaveBeenCalledTimes(1);
  });

  test("serves byte ranges from a cached M4A narration track", async () => {
    const fetchImpl = jest.fn();
    const { cache, handlers } = loadServiceWorker(fetchImpl);
    cache.match.mockImplementation((request) =>
      request === "/shell-assets.json"
        ? Promise.resolve(undefined)
        : Promise.resolve(
            new Response("0123456789", {
              status: 200,
              headers: { "Content-Type": "audio/mp4" },
            }),
          ),
    );
    let responsePromise;
    handlers.fetch({
      request: new Request(
        "https://app.example.com/narration/fundal-reflex/full-animation/en.m4a",
        { headers: { Range: "bytes=2-5" } },
      ),
      respondWith: (promise) => {
        responsePromise = promise;
      },
    });

    const response = await responsePromise;
    expect(response.status).toBe(206);
    expect(response.headers.get("Content-Range")).toBe("bytes 2-5/10");
    expect(await response.text()).toBe("2345");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  test.each(["current", "old"])(
    "resumes %s media by revision without reusing changed content",
    async (revision) => {
      const fetchImpl = jest.fn().mockResolvedValue(new Response("new media"));
      const { cache, handlers } = loadServiceWorker(fetchImpl);
      cache.match.mockImplementation(async (request) =>
        request === "/shell-assets.json"
          ? new Response(
              JSON.stringify({ revisions: { "/clip.m4a": "current" } }),
            )
          : new Response("stored media", {
              headers: { "X-Arclight-Revision": revision },
            }),
      );
      const messages = [];
      let work;
      handlers.message({
        data: { type: "CACHE_URLS", payload: ["/clip.m4a"] },
        ports: [{ postMessage: (value) => messages.push(value) }],
        waitUntil: (promise) => {
          work = promise;
        },
      });
      await work;
      expect(messages.at(-1)).toMatchObject({
        type: "CACHE_DONE",
        cached: 1,
        failed: [],
      });
      expect(fetchImpl).toHaveBeenCalledTimes(revision === "current" ? 0 : 1);
      if (revision === "old")
        expect(
          cache.put.mock.calls[0][1].headers.get("X-Arclight-Revision"),
        ).toBe("current");
    },
  );

  test("offline subapp navigation returns its downloaded document", async () => {
    const { caches, handlers, packCacheName } = loadServiceWorker(
      jest.fn().mockRejectedValue(new Error("offline")),
    );
    const url = "https://app.example.com/subapp/lesson/index.html";
    const shell = {
      match: jest.fn(async (key) =>
        key === "/shell-assets.json"
          ? new Response(
              JSON.stringify({
                revisions: { "/subapp/lesson/index.html": "current" },
              }),
            )
          : key === "/index.html"
            ? new Response("app shell")
            : undefined,
      ),
    };
    const packs = {
      match: jest.fn(
        async () =>
          new Response("downloaded lesson", {
            headers: { "X-Arclight-Revision": "current" },
          }),
      ),
    };
    caches.open.mockImplementation(async (name) =>
      name === packCacheName ? packs : shell,
    );
    let response;
    handlers.fetch({
      request: { url, method: "GET", mode: "navigate", headers: new Headers() },
      respondWith: (promise) => {
        response = promise;
      },
    });
    expect(await (await response).text()).toBe("downloaded lesson");
  });
});
