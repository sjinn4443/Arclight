/** @jest-environment node */
const path = require("node:path");
const {
  collectOfflineAssetManifest,
} = require("../utils/offline-manifest.cjs");

test("offline downloads include the app but exclude unused legacy demo pages and images", async () => {
  const manifest = await collectOfflineAssetManifest(
    path.join(__dirname, "fixtures", "offline-root"),
  );
  expect(manifest.urls).toContain("/index.html");
  expect(manifest.urls).toContain("/app.js");
  expect(manifest.urls.some((url) => url.startsWith("/html/demo/"))).toBe(
    false,
  );
});
