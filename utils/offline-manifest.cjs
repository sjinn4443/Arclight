const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const OFFLINE_MANIFEST_FILENAME = "offline-assets.json";
const EXCLUDED_FILENAMES = new Set([
  ".DS_Store",
  "Thumbs.db",
  OFFLINE_MANIFEST_FILENAME,
  "shell-assets.json",
]);
const EXCLUDED_DIRECTORIES = new Set(["audit-reports"]);

/** @typedef {{assets: {bytes: number, url: string}[], bytes: number, count: number, urls: string[]}} OfflineManifest */
/** @param {string} rawUrl */
function isSensitiveManifestUrl(rawUrl) {
  const url = String(rawUrl || "").toLowerCase();
  return (
    url.startsWith("/api/") ||
    url === "/track" ||
    url.startsWith("/track?") ||
    url === "/healthz" ||
    url.startsWith("/healthz?") ||
    url.includes("reports")
  );
}

/** @param {string} rootDir @param {string} filePath */
function toStaticAssetUrl(rootDir, filePath) {
  const relativePath = path.relative(rootDir, filePath);
  if (
    !relativePath ||
    relativePath.startsWith("..") ||
    path.isAbsolute(relativePath)
  ) {
    return null;
  }

  return `/${relativePath
    .split(path.sep)
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

/** @param {string} rootDir @returns {Promise<OfflineManifest>} */
async function collectOfflineAssetManifest(rootDir) {
  const resolvedRoot = path.resolve(rootDir);
  /** @type {OfflineManifest['assets']} */
  const assets = [];
  /** @type {string[]} */
  const urls = [];
  let bytes = 0;

  /** @param {string} dir */
  async function walk(dir) {
    const entries = (
      await fs.promises.readdir(dir, { withFileTypes: true })
    ).sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      if (
        EXCLUDED_FILENAMES.has(entry.name) ||
        entry.name.startsWith("._") ||
        /\.(?:map|md|py|bak)$/i.test(entry.name)
      )
        continue;

      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (EXCLUDED_DIRECTORIES.has(entry.name.toLowerCase())) continue;
        await walk(entryPath);
        continue;
      }
      if (!entry.isFile()) continue;

      const url = toStaticAssetUrl(resolvedRoot, entryPath);
      if (!url || isSensitiveManifestUrl(url)) continue;

      const stat = await fs.promises.stat(entryPath);
      bytes += stat.size;
      assets.push({ bytes: stat.size, url });
      urls.push(url);
    }
  }

  await walk(resolvedRoot);
  return { assets, bytes, count: urls.length, urls };
}

/** @param {unknown} value @returns {OfflineManifest | null} */
function validateManifest(value) {
  if (!value || typeof value !== "object") return null;
  if (
    !("assets" in value) ||
    !("urls" in value) ||
    !("count" in value) ||
    !("bytes" in value)
  )
    return null;
  if (!Array.isArray(value.assets) || !Array.isArray(value.urls)) return null;
  if (typeof value.count !== "number" || typeof value.bytes !== "number")
    return null;
  if (
    !value.urls.every(
      (url) =>
        typeof url === "string" &&
        url.startsWith("/") &&
        !isSensitiveManifestUrl(url),
    )
  )
    return null;
  if (
    !value.assets.every(
      (asset) =>
        asset &&
        typeof asset.url === "string" &&
        Number.isSafeInteger(asset.bytes) &&
        asset.bytes >= 0,
    )
  )
    return null;
  const urls = value.urls;
  if (
    value.assets.length !== urls.length ||
    value.assets.some((asset, index) => asset.url !== urls[index])
  )
    return null;
  if (!Number.isSafeInteger(value.count) || value.count !== value.urls.length) {
    return null;
  }
  if (!Number.isSafeInteger(value.bytes) || value.bytes < 0) return null;
  return /** @type {OfflineManifest} */ (value);
}

/** @param {string} rootDir */
async function readOfflineAssetManifest(rootDir) {
  const manifestPath = path.join(rootDir, OFFLINE_MANIFEST_FILENAME);
  const payload = JSON.parse(await fs.promises.readFile(manifestPath, "utf8"));
  const validated = validateManifest(payload);
  if (!validated) throw new Error("Invalid offline asset manifest");
  return validated;
}

/** @param {string} rootDir @param {OfflineManifest} manifest */
async function writeOfflineAssetManifest(rootDir, manifest) {
  const validated = validateManifest(manifest);
  if (!validated) throw new Error("Invalid offline asset manifest");
  const manifestPath = path.join(rootDir, OFFLINE_MANIFEST_FILENAME);
  await fs.promises.writeFile(manifestPath, JSON.stringify(validated), "utf8");
  return manifestPath;
}

/** @param {OfflineManifest} manifest */
function createManifestState(manifest) {
  const serialized = JSON.stringify(manifest);
  const digest = crypto
    .createHash("sha256")
    .update(serialized)
    .digest("base64url");
  return {
    etag: `"${digest}"`,
    manifest,
    serialized,
  };
}

module.exports = {
  OFFLINE_MANIFEST_FILENAME,
  collectOfflineAssetManifest,
  createManifestState,
  isSensitiveManifestUrl,
  readOfflineAssetManifest,
  writeOfflineAssetManifest,
};
