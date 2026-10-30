const fs = require("node:fs");
const path = require("node:path");

const LOCAL_ONLY_ASSETS = ["local-only"];

function isLocalOnlyLessonAsset(assetPath) {
  let normalized;
  try {
    normalized = decodeURIComponent(String(assetPath || "").split("?")[0])
      .replaceAll("\\", "/")
      .replace(/^\/+/, "")
      .toLowerCase();
  } catch {
    return true;
  }
  return LOCAL_ONLY_ASSETS.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
}

function canServeLocalLessons(
  req,
  { production = false, serveDist = false } = {},
) {
  if (production || serveDist) return false;
  let hostname;
  try {
    hostname = new URL(`http://${req.headers.host || ""}`).hostname;
  } catch {
    return false;
  }
  const loopback = new Set(["localhost", "127.0.0.1", "[::1]"]);
  const address = req.socket?.remoteAddress;
  return (
    loopback.has(hostname) &&
    ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(address)
  );
}

function renderLocalLessonHtml(html, publicRoot, enabled = false) {
  const available =
    enabled &&
    fs.existsSync(path.join(publicRoot, "js/pupilsAdvancedScroll.js"));
  return html.replace(
    /<!-- LOCAL_ONLY_PUPILS_ADVANCED_(PAGE|LESSON) -->/g,
    (_, part) => {
      if (!available) return "";
      const fragment = path.join(
        publicRoot,
        "local-only",
        `pupils-advanced-${part.toLowerCase()}.html`,
      );
      return fs.existsSync(fragment) ? fs.readFileSync(fragment, "utf8") : "";
    },
  );
}

module.exports = {
  isLocalOnlyLessonAsset,
  canServeLocalLessons,
  renderLocalLessonHtml,
};
