const fs = require("node:fs/promises");
const path = require("node:path");
const {
  collectOfflineAssetManifest,
  writeOfflineAssetManifest,
} = require("../utils/offline-manifest.cjs");

// Keep original URLs across the shell and the separately deployable content tree.
function isPackAsset(url) {
  return (
    /^\/(?:videos|video-hls|narration|subapp|scrolly|scrolls)\//.test(url) ||
    /^\/images\/(?!icon\/|icons_pic\/|atoms\/)/.test(url) ||
    /^\/html\/.*\.json$/.test(url)
  );
}

async function packageDistribution(root) {
  const mediaRoot = `${root}-media`;
  const mapsRoot = `${root}-sourcemaps`;
  // The build owns these sibling output directories; never accept a source path.
  for (const target of [mediaRoot, mapsRoot]) {
    const resolved = path.resolve(target);
    if (!resolved.startsWith(path.resolve(root) + "-"))
      throw new Error("Invalid output path");
    await fs.rm(resolved, { recursive: true, force: true });
    await fs.mkdir(resolved, { recursive: true });
  }
  async function move(relative, target) {
    const dest = path.join(target, relative);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.rename(path.join(root, relative), dest);
  }
  async function walk(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(file);
      else {
        const relative = path.relative(root, file);
        const url =
          "/" + relative.split(path.sep).map(encodeURIComponent).join("/");
        if (entry.name.endsWith(".map")) await move(relative, mapsRoot);
        else if (isPackAsset(url)) await move(relative, mediaRoot);
      }
    }
  }
  await walk(root);
  const shell = await collectOfflineAssetManifest(root);
  const media = await collectOfflineAssetManifest(mediaRoot);
  const precache = shell.assets.filter(
    (a) => !/\/sw\.js$|version\.json$/.test(a.url),
  );
  const manifest = {
    assets: [...shell.assets, ...media.assets],
    bytes: shell.bytes + media.bytes,
    count: shell.count + media.count,
    urls: [...shell.urls, ...media.urls],
  };
  await writeOfflineAssetManifest(root, manifest);
  await fs.writeFile(
    path.join(root, "shell-assets.json"),
    JSON.stringify({
      urls: precache.map((a) => a.url),
      bytes: precache.reduce((n, a) => n + a.bytes, 0),
    }),
  );
  const report = {
    shellBytes: shell.bytes,
    mediaBytes: media.bytes,
    shellLimitBytes: 60_000_000,
    mediaLimitBytes: 2_000_000_000,
  };
  await fs.writeFile(
    `${root}-size-report.json`,
    JSON.stringify(report, null, 2) + "\n",
  );
  if (
    report.shellBytes > report.shellLimitBytes ||
    report.mediaBytes > report.mediaLimitBytes
  )
    throw new Error(`Distribution budget exceeded: ${JSON.stringify(report)}`);
  console.log("[build] distribution budgets", report);
}
module.exports = { packageDistribution, isPackAsset };
