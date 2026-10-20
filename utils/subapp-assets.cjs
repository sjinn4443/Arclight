// Development fixtures and research material must never become public/offline assets.
/** @param {unknown} assetPath */
function isSubappDevelopmentAsset(assetPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(String(assetPath || "").split("?")[0]);
  } catch {
    return true;
  }
  const parts = decoded
    .replaceAll("\\", "/")
    .replace(/^\/+/, "")
    .toLowerCase()
    .split("/");
  if (parts[0] !== "subapp") return false;
  if (
    parts.some(
      (part) =>
        [
          "tools",
          "tests",
          "outputs",
          "output",
          "memory-bank",
          "node_modules",
          "audit-reports",
          "test-results",
        ].includes(part) || part.startsWith("."),
    )
  )
    return true;
  const filename = parts.at(-1) ?? "";
  if (
    parts[1] === "glaucoma3d" &&
    (parts[2] === "source" ||
      filename === "readme.txt" ||
      /^viewer-.*\.txt$/.test(filename) ||
      /^(?:anatomy(?:-highlight)?-preview|preview-stage-\d+)\.png$/.test(
        filename,
      ))
  )
    return true;
  return (
    /\.(?:md|csv|py|drawio|blend\d*|xlsx?|map|cjs|cmd)$/.test(filename) ||
    (/\.mjs$/.test(filename) && filename !== "mcq-engine.mjs") ||
    /^(?:package(?:-lock)?\.json|jsconfig\.json|qa-|report-|.*\.config\.|.*-baseline\.json)/.test(
      filename,
    )
  );
}

module.exports = { isSubappDevelopmentAsset };
