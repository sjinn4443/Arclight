// Run with node --experimental-vm-modules; evaluates the real selection code.
const fs = require("node:fs");
const vm = require("node:vm");
const {
  collectOfflineAssetManifest,
} = require("../utils/offline-manifest.cjs");
(async () => {
  const context = vm.createContext({
    URL,
    window: {
      location: { origin: "http://localhost" },
      I18N: { translateLiteral: (t) => t },
    },
  });
  const quality = "public/video-localization/video-quality.js";
  if (fs.existsSync(quality))
    vm.runInContext(fs.readFileSync(quality, "utf8"), context);
  const code = fs.readFileSync("public/js/languageinstall.js", "utf8");
  const mod = new vm.SourceTextModule(code, { context });
  await mod.link(async (spec) => {
    const names = [
      ...code.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']([^"']+)["']/g),
    ]
      .filter((m) => m[2] === spec)
      .flatMap((m) =>
        m[1]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      );
    return new vm.SyntheticModule(
      names,
      function () {
        for (const n of names)
          this.setExport(
            n,
            n === "getLanguage"
              ? () => "en"
              : n === "translateLiteral"
                ? (t) => t
                : () => {},
          );
      },
      { context },
    );
  });
  await mod.evaluate();
  const root = process.argv[2] || "public";
  const manifest = fs.existsSync(`${root}/offline-assets.json`)
    ? JSON.parse(fs.readFileSync(`${root}/offline-assets.json`, "utf8"))
    : await collectOfflineAssetManifest(root);
  const report = {};
  for (const catalogId of [
    null,
    "core-front-of-eye",
    "tools",
    "ears-materials",
  ]) {
    report[catalogId || "full"] = {};
    for (const videoQuality of ["low", "high", "both"]) {
      const s = mod.namespace.resolveOfflineDownloadSelection(manifest, {
        mode: catalogId ? "select" : "full",
        catalogId,
        videoQuality,
        language: "en",
      });
      report[catalogId || "full"][videoQuality] = {
        bytes: s.bytes,
        count: s.count,
      };
    }
  }
  console.log(JSON.stringify(report, null, 2));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
