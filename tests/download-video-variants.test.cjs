/** @jest-environment node */
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const { isSensitiveManifestUrl } = require("../utils/offline-manifest.cjs");

test("authoring masters never enter development or production offline manifests", () => {
  for (const url of [
    "/videos/Workshop/PEC/New%20folder/a.mp4",
    "/videos/Workshop/PEC/New folder/out_dual/a.mp4",
  ]) {
    expect(isSensitiveManifestUrl(url)).toBe(true);
  }
  expect(
    isSensitiveManifestUrl("/videos/Workshop/PEC/1.Cleananeye_220p.mp4"),
  ).toBe(false);
});

test("shared variant registry contains real files and resolves encoded legacy URLs", () => {
  const context = vm.createContext({ URL });
  vm.runInContext(
    fs.readFileSync("public/video-localization/video-quality.js", "utf8"),
    context,
  );
  const quality = context.ArclightVideoQuality;
  for (const pair of quality.pairs) {
    for (const tier of ["low", "high"]) {
      expect(fs.statSync(path.join("public", pair[tier])).size).toBeGreaterThan(
        0,
      );
      for (const source of [pair.low, pair.high]) {
        expect(quality.resolve(encodeURI(source) + "?v=1", tier)).toBe(
          pair[tier],
        );
      }
    }
  }
  expect(quality.resolve("/unregistered.mp4", "low")).toBe("/unregistered.mp4");
});
