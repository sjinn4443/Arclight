/** @jest-environment node */
const { isSubappDevelopmentAsset } = require("../utils/subapp-assets.cjs");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

test.each([
  "/subapp/Refract/tools/allan-rx-full.csv",
  "/subapp/Refract/outputs/weighted-20260930/candidate.mjs",
  "/subapp/Refract/tests/weighted-rules.mjs",
  "/subapp/Swollen%20Discs/memory-bank/progress.md",
  "/subapp/Refract/prescribing-flowchart.drawio",
  "subapp\\Refract\\tools\\allan-rx-full.csv",
  "/subapp/Refract/%74ools/allan-rx-full.csv?download=1",
  "/subapp/Refract/package-lock.json",
])("excludes development data: %s", (url) => {
  expect(isSubappDevelopmentAsset(url)).toBe(true);
});

test.each([
  "/subapp/Refract/index.html",
  "/subapp/Refract/app.bundle.js?v=20260930",
  "/subapp/Refract/src/prescription-config.js",
  "/subapp/Swollen%20Discs/mcq-engine.mjs",
  "/subapp/gallery/apps.json",
  "/subapp/Fields/home.html",
  "/subapp/i18n-lo.js?v=20260901-2",
  "/translation/english.json",
])("keeps runtime assets: %s", (url) => {
  expect(isSubappDevelopmentAsset(url)).toBe(false);
});

const apps = JSON.parse(
  fs.readFileSync(path.resolve("public/subapp/gallery/apps.json")),
).apps;
test.each(apps.map((app) => app.folder))(
  "%s worker prefers its own cache and leaves sibling caches alone",
  async (app) => {
    const dir = path.resolve("public/subapp", app);
    const worker = ["sw.js", "service-worker.js"].find((file) =>
      fs.existsSync(path.join(dir, file)),
    );
    const location = new URL(
      `https://arclight.test/subapp/${encodeURIComponent(app)}/${worker}`,
    );
    const listeners = {};
    const caches = {
      match: jest.fn(async () => ({ tag: "stale-host" })),
      open: jest.fn(async () => ({
        match: async () => ({ tag: "current-app" }),
      })),
      keys: async () => ["arclight-static-old", "unrelated-sibling-cache"],
      delete: jest.fn(),
    };
    vm.runInNewContext(fs.readFileSync(path.join(dir, worker), "utf8"), {
      URL,
      Response,
      caches,
      console,
      fetch: async () => {
        throw new Error("offline");
      },
      self: {
        location,
        registration: { scope: new URL("./", location).href },
        addEventListener: (name, fn) => {
          listeners[name] = fn;
        },
        clients: { claim() {} },
      },
    });
    let response;
    listeners.fetch({
      request: {
        url: new URL("app.bundle.js?v=current", location).href,
        method: "GET",
        mode: "cors",
      },
      respondWith: (value) => {
        response = value;
      },
    });
    expect((await response).tag).toBe("current-app");
    expect(caches.match).not.toHaveBeenCalled();
    const respondWith = jest.fn();
    listeners.fetch({
      request: {
        url: "https://arclight.test/subapp/Unrelated/index.html",
        method: "GET",
        mode: "navigate",
      },
      respondWith,
    });
    expect(respondWith).not.toHaveBeenCalled();
    let activated;
    listeners.activate({
      waitUntil: (value) => {
        activated = value;
      },
    });
    await activated;
    expect(caches.delete).not.toHaveBeenCalled();
  },
);
