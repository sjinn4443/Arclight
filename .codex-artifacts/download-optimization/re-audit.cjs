// Run with node --experimental-vm-modules; evaluates the real selection code.
const fs = require("node:fs");
const vm = require("node:vm");
const {
  collectOfflineAssetManifest,
} = require("../../utils/offline-manifest.cjs");
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

  const sum = (a) => a.reduce((s, a) => s + a.bytes, 0);
  const group = (assets, depth = 2) => {
    const groups = {};
    for (const a of assets) {
      const key = decodeURIComponent(a.url)
        .split("/")
        .slice(1, depth + 1)
        .join("/");
      groups[key] = (groups[key] || 0) + a.bytes;
    }
    return Object.entries(groups).sort((a, b) => b[1] - a[1]);
  };
  const byUrl = new Map(manifest.assets.map((a) => [a.url, a]));
  const shell = manifest.assets.filter((a) =>
    mod.namespace.isAppShellAsset(a.url),
  );
  const shellMedia = shell.filter(
    (a) =>
      !/^\/(?:js|style|html|translation|vendor|favicons|video-localization)\//.test(
        a.url,
      ),
  );
  const rows = {};
  for (const catalogId of [
    null,
    ...mod.namespace.OFFLINE_CATALOG_OPTIONS.map((a) => a.id),
  ]) {
    const selections = {};
    for (const videoQuality of ["low", "high"])
      selections[videoQuality] = mod.namespace.resolveOfflineDownloadSelection(
        manifest,
        {
          mode: catalogId ? "select" : "full",
          catalogId,
          videoQuality,
          language: "en",
        },
      );
    const low = new Set(selections.low.urls),
      high = new Set(selections.high.urls);
    const common = manifest.assets.filter(
      (a) => low.has(a.url) && high.has(a.url),
    );
    const content = common.filter((a) => !mod.namespace.isAppShellAsset(a.url));
    rows[catalogId || "full"] = {
      lowBytes: selections.low.bytes,
      highBytes: selections.high.bytes,
      commonBytes: sum(common),
      commonGroups: group(content),
      topCommon: content.sort((a, b) => b.bytes - a.bytes).slice(0, 18),
      urls: selections.low.urls,
    };
  }
  const report = {
    root,
    manifestBytes: manifest.bytes,
    shellBytes: sum(shell),
    shellGroups: group(shell),
    topShell: shell.sort((a, b) => b.bytes - a.bytes).slice(0, 35),
    shellMedia: group(shellMedia),
    sourceMasters: manifest.assets.filter((a) =>
      /new(?:%20| )folder/i.test(a.url),
    ),
    rows,
  };
  fs.writeFileSync(
    ".codex-artifacts/download-optimization/re-audit-" +
      (root === "public" ? "source" : "build") +
      ".json",
    JSON.stringify(report, null, 2),
  );
  console.log(
    JSON.stringify(
      {
        ...report,
        rows: Object.fromEntries(
          Object.entries(rows).map(([k, v]) => [
            k,
            {
              ...v,
              urls: undefined,
              topCommon: v.topCommon.slice(0, 4),
              commonGroups: v.commonGroups.slice(0, 8),
            },
          ]),
        ),
      },
      null,
      2,
    ),
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
