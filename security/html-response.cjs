const fs = require("fs");
const path = require("path");
const { TELEMETRY_META_NAME } = require("./telemetry-guard.cjs");

const INLINE_SCRIPT_OPEN_TAG_RE =
  /<script(?![^>]*\bsrc=)(?![^>]*\bnonce=)([^>]*)>/gi;
const INLINE_STYLE_OPEN_TAG_RE = /<style(?![^>]*\bnonce=)([^>]*)>/gi;

function injectNonceIntoHtml(html, nonce) {
  if (!nonce || typeof html !== "string") return html;

  const nonceAttr = ` nonce="${String(nonce).replace(/"/g, "&quot;")}"`;
  return html
    .replace(INLINE_SCRIPT_OPEN_TAG_RE, `<script${nonceAttr}$1>`)
    .replace(INLINE_STYLE_OPEN_TAG_RE, `<style${nonceAttr}$1>`);
}

function escapeAttribute(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function injectTelemetryMetaIntoHtml(html, telemetryToken) {
  if (!telemetryToken || typeof html !== "string") return html;
  if (
    new RegExp(
      `<meta\\s+name=["']${TELEMETRY_META_NAME.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`,
      "i",
    ).test(html)
  ) {
    return html;
  }

  const metaTag = `<meta name="${TELEMETRY_META_NAME}" content="${escapeAttribute(telemetryToken)}">`;
  if (/<\/head>/i.test(html))
    return html.replace(/<\/head>/i, `${metaTag}\n</head>`);
  return `${metaTag}\n${html}`;
}

function resolveStaticHtmlFile(staticRoot, requestPath) {
  const normalizedRequestPath = String(requestPath || "").split("?")[0] || "/";
  const relativePath =
    normalizedRequestPath === "/"
      ? "index.html"
      : normalizedRequestPath.replace(/^\/+/, "");

  if (!relativePath.toLowerCase().endsWith(".html")) return null;

  const rootPath = path.resolve(staticRoot);
  const resolvedPath = path.resolve(rootPath, relativePath);
  if (
    resolvedPath !== rootPath &&
    !resolvedPath.startsWith(`${rootPath}${path.sep}`)
  ) {
    return null;
  }

  return resolvedPath;
}

function sendHtmlFileWithNonce(req, res, filePath, statusCode = 200) {
  const rawHtml = fs.readFileSync(filePath, "utf8");
  const html = injectTelemetryMetaIntoHtml(
    injectNonceIntoHtml(rawHtml, res.locals?.cspNonce),
    res.locals?.telemetryToken,
  );

  res.status(statusCode);
  res.type("html");
  if (req.method === "HEAD") return res.end();
  return res.send(html);
}

module.exports = {
  injectNonceIntoHtml,
  injectTelemetryMetaIntoHtml,
  resolveStaticHtmlFile,
  sendHtmlFileWithNonce,
};
