const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const OFFLINE_MANIFEST_FILENAME = "offline-assets.json";
const EXCLUDED_FILENAMES = new Set([
  ".DS_Store",
  "Thumbs.db",
  OFFLINE_MANIFEST_FILENAME,
]);
const EXCLUDED_DIRECTORIES = new Set(["audit-reports"]);

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

async function collectOfflineAssetManifest(rootDir) {
  const resolvedRoot = path.resolve(rootDir);
  const assets = [];
  const urls = [];
  let bytes = 0;

  async function walk(dir) {
    const entries = (
      await fs.promises.readdir(dir, { withFileTypes: true })
    ).sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      if (EXCLUDED_FILENAMES.has(entry.name)) continue;

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

function validateManifest(value) {
  if (!value || typeof value !== "object") return null;
  if (!Array.isArray(value.assets) || !Array.isArray(value.urls)) return null;
  if (!Number.isSafeInteger(value.count) || value.count !== value.urls.length) {
    return null;
  }
  if (!Number.isSafeInteger(value.bytes) || value.bytes < 0) return null;
  return value;
}

async function readOfflineAssetManifest(rootDir) {
  const manifestPath = path.join(rootDir, OFFLINE_MANIFEST_FILENAME);
  const payload = JSON.parse(await fs.promises.readFile(manifestPath, "utf8"));
  const validated = validateManifest(payload);
  if (!validated) throw new Error("Invalid offline asset manifest");
  return validated;
}

async function writeOfflineAssetManifest(rootDir, manifest) {
  const validated = validateManifest(manifest);
  if (!validated) throw new Error("Invalid offline asset manifest");
  const manifestPath = path.join(rootDir, OFFLINE_MANIFEST_FILENAME);
  await fs.promises.writeFile(manifestPath, JSON.stringify(validated), "utf8");
  return manifestPath;
}

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
