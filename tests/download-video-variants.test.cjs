/** @jest-environment node */
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const { isSensitiveManifestUrl } = require("../utils/offline-manifest.cjs");
const {
  collectOfflineAssetManifest,
} = require("../utils/offline-manifest.cjs");
const {
  isOfflineAuthoringAsset,
} = require("../utils/offline-content-policy.cjs");

test("excludes previews but preserves the demo explicitly embedded by the diabetic workshop", () => {
  for (const url of [
    "/scrolly/coreexam/ophths/BIO/01Preparation/1/demo/images/img_0.png",
    "/html/fundal_noback.json",
    "/js/__mocks__/config.js",
  ])
    expect(isOfflineAuthoringAsset(url)).toBe(true);
  for (const url of [
    "/scrolly/coreexam/ophths/DO/03HowtoExamine/1/demo/data.html",
    "/scrolly/coreexam/ophths/DO/03HowtoExamine/1/demo/images/img_0.png",
    "/scrolly/coreexam/ophths/BIO/01Preparation/1/images/img_0.png",
    "/scrolly/coreexam/ophths/BIO/01Preparation/1/final_frame.png",
    "/html/Fundal_prep.json",
  ])
    expect(isOfflineAuthoringAsset(url)).toBe(false);
});

test("retains every external Lottie image and the embedded lesson demo in the real manifest", async () => {
  const manifest = await collectOfflineAssetManifest("public");
  const urls = new Set(
    manifest.urls.map((url) => decodeURIComponent(url).toLowerCase()),
  );
  let checked = 0;
  for (const asset of manifest.assets) {
    if (
      !/^\/scrolly\/coreexam\/(?:ophths|frontofeye)\/.+\/data\.json$/i.test(
        asset.url,
      )
    )
      continue;
    const data = JSON.parse(
      fs.readFileSync(
        path.join("public", decodeURIComponent(asset.url)),
        "utf8",
      ),
    );
    for (const image of data.assets || []) {
      if (image.e === 1 || !image.p || image.p.startsWith("data:")) continue;
      const url = new URL(
        (image.u || "") + image.p,
        "https://app.invalid" + asset.url,
      ).pathname;
      expect(urls.has(decodeURIComponent(url).toLowerCase())).toBe(true);
      checked += 1;
    }
  }
  expect(checked).toBeGreaterThan(50);
  expect(
    urls.has("/scrolly/coreexam/ophths/do/03howtoexamine/1/demo/data.html"),
  ).toBe(true);
});

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
    for (const alias of pair.aliases || []) {
      expect(
        fs
          .readFileSync(path.join("public", alias))
          .equals(fs.readFileSync(path.join("public", pair.high))),
      ).toBe(true);
      expect(quality.resolve(encodeURI(alias), "low")).toBe(pair.low);
      expect(quality.resolve(encodeURI(alias), "high")).toBe(pair.high);
    }
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
