const fs = require("node:fs/promises");
const path = require("node:path");
const { createReadStream } = require("node:fs");
const { createHash } = require("node:crypto");
const { gzipSync } = require("node:zlib");
const {
  collectOfflineAssetManifest,
  writeOfflineAssetManifest,
} = require("../utils/offline-manifest.cjs");

// Keep original URLs across the shell and the separately deployable content tree.
/** @param {string} url */
function isPackAsset(url) {
  return (
    /^\/(?:videos|video-hls|video-subtitles|narration|subapp|scrolly|scrolls|AnteriorSegmentQuiz)\//.test(
      url,
    ) ||
    /^\/translation\/(?!english\.json$)/.test(url) ||
    /^\/images\/(?!icon\/|icons_pic\/|atoms\/)/.test(url) ||
    /^\/html\/.*\.json$/.test(url)
  );
}

/** @param {string} root */
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
  /** @param {string} relative @param {string} target */
  async function move(relative, target) {
    const dest = path.join(target, relative);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.rename(path.join(root, relative), dest);
  }
  /** @param {string} dir */
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
  /** @type {Record<string, string>} */
  const revisions = {};
  for (const asset of media.assets) {
    const hash = createHash("sha256");
    for await (const chunk of createReadStream(
      path.join(mediaRoot, decodeURIComponent(asset.url)),
    ))
      hash.update(chunk);
    revisions[asset.url] = hash.digest("hex");
  }
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
      revisions,
      urls: precache.map((a) => a.url),
      bytes: precache.reduce((n, a) => n + a.bytes, 0),
    }),
  );
  const report = {
    shellBytes: 0,
    mediaBytes: 0,
    shellLimitBytes: 20_000_000,
    mediaLimitBytes: 2_000_000_000,
    shellGzipBytes: 0,
    shellGzipLimitBytes: 12_000_000,
  };
  // Budget the complete upload, including generated manifests and files which
  // deliberately do not belong in an offline cache.
  /** @param {string} dir @param {boolean} gzip */
  async function measureTree(dir, gzip) {
    let bytes = 0;
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) bytes += await measureTree(file, gzip);
      else if (entry.isFile()) {
        bytes += (await fs.stat(file)).size;
        if (gzip)
          report.shellGzipBytes += gzipSync(await fs.readFile(file)).length;
      }
    }
    return bytes;
  }
  report.shellBytes = await measureTree(root, true);
  report.mediaBytes = await measureTree(mediaRoot, false);
  await fs.writeFile(
    `${root}-size-report.json`,
    JSON.stringify(report, null, 2) + "\n",
  );
  if (
    report.shellBytes > report.shellLimitBytes ||
    report.mediaBytes > report.mediaLimitBytes ||
    report.shellGzipBytes > report.shellGzipLimitBytes
  )
    throw new Error(`Distribution budget exceeded: ${JSON.stringify(report)}`);
  console.log("[build] distribution budgets", report);
}
module.exports = { packageDistribution, isPackAsset };
