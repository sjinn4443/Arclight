/**
 * Service Worker lifecycle unit test
 * Verifies that install event caches required assets.
 *
 * This runs in Node using service-worker-mock.
 */

const makeServiceWorkerEnv = require("service-worker-mock");
const fs = require("fs");
const path = require("path");

// ADJUST if your sw file path differs
const SW_PATH = path.join(__dirname, "..", "public", "sw.js");

// Helper: load & execute your sw.js inside mocked SW env
function loadServiceWorkerScript() {
  const swCode = fs.readFileSync(SW_PATH, "utf8");
  // eslint-disable-next-line no-eval
  eval(swCode);
}

describe("Service Worker Lifecycle - install caching", () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  test("caches required core assets during install", async () => {
    loadServiceWorkerScript();

    // Trigger install lifecycle
    const installEvent = new Event("install");
    self.dispatchEvent(installEvent);

    // Wait for any install promises
    await Promise.resolve();

    const cacheNames = await caches.keys();
    expect(cacheNames.length).toBeGreaterThan(0);

    // Pick the newest/only cache
    const cache = await caches.open(cacheNames[0]);
    const requests = await cache.keys();
    const cachedUrls = requests.map((r) => r.url);

    /**
     * ADJUST THIS LIST to match your "required assets" list in sw.js.
     * The goal is to ensure these must be present after install.
     */
    const REQUIRED = [
      "/index.html",
      "/style.css",
      "/js/main.js",
      "/js/navigation.js",
      "/js/onboarding.js",
      "/js/dashboard.js",
      "/js/toc.js",
      "/js/video.js",
      "/js/quiz.js",
      "/js/mylearning.js",
      "/js/catalog.js",
      "/js/pwa.js",
      "/html/interest.html",
      "/js/interest.js",
      "/favicons/favicon-32x32.png",
      "/favicons/favicon-16x16.png",
      "/favicons/site.webmanifest",
      "/favicons/apple-touch-icon.png",
      "/favicons/android-chrome-192x192.png",
      "/favicons/android-chrome-512x512.png",
      "/favicons/favicon.ico",
      "/favicons/pwa-install-narrow.png",
      "/favicons/pwa-install-wide.png",
    ];

    for (const asset of REQUIRED) {
      const found = cachedUrls.some((u) => u.endsWith(asset));
      expect(found).toBe(true);
    }
  });
});
