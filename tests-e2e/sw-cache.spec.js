const { test, expect } = require("@playwright/test");

test("Service worker installs and caches required assets", async ({ page }) => {
  // First load registers SW
  await page.goto("/index.html", { waitUntil: "load" });

  // Wait until SW is ready
  await page.waitForFunction(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return reg && reg.active;
  });

  // Read actual Cache Storage contents inside the browser
  const cachedUrls = await page.evaluate(async () => {
    const names = await caches.keys();
    const all = [];
    for (const name of names) {
      const cache = await caches.open(name);
      const reqs = await cache.keys();
      reqs.forEach((r) => all.push(r.url));
    }
    return all;
  });

  /**
   * ADJUST THIS to your real required precache list.
   * Keep it to the “must-have for offline shell”.
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
    expect(
      cachedUrls.some((u) => u.includes(asset)),
      `${asset} not found in any cache`,
    ).toBeTruthy();
  }
});
