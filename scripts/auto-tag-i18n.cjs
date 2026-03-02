#!/usr/bin/env node
/**
 * Auto-tag visible text in route HTML files with data-i18n and append keys to
 * english.json under `auto.<file>.<key>`.
 *
 * Scope:
 * - Files listed in public/js/config.js ROUTES (`html/*.html`).
 * - Single-line elements with direct text child: <tag>Text</tag>
 * - input/textarea placeholder attributes
 *
 * Notes:
 * - This script is intentionally conservative to reduce breakage.
 * - It skips script/style blocks and lines already containing data-i18n.
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, "public", "js", "config.js");
const ENGLISH_PATH = path.join(ROOT, "public", "translation", "english.json");
const WRITE = process.argv.includes("--write");

function readText(p) {
  return fs.readFileSync(p, "utf8");
}

function writeText(p, s) {
  fs.writeFileSync(p, s, "utf8");
}

function routeHtmlFiles() {
  const src = readText(CONFIG_PATH);
  const out = new Set();
  const re = /"html\/([^"]+\.html)"/g;
  let m;
  while ((m = re.exec(src))) {
    out.add(path.join(ROOT, "public", "html", m[1]));
  }
  return Array.from(out).filter((p) => fs.existsSync(p));
}

function sanitizeSegment(s) {
  return String(s)
    .toLowerCase()
    .replace(/&[a-z]+;/gi, " ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

function fileKey(filePath) {
  return (
    sanitizeSegment(path.basename(filePath, path.extname(filePath))) || "page"
  );
}

function slugFromText(text) {
  const normalized = String(text)
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();
  const slug = sanitizeSegment(normalized).slice(0, 64);
  return slug || "text";
}

function hasLetters(text) {
  return /[A-Za-z]/.test(text || "");
}

function decodeHtmlEntities(input) {
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    times: "×",
  };
  return String(input)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#([0-9]+);/g, (_, dec) =>
      String.fromCodePoint(parseInt(dec, 10)),
    )
    .replace(/&([a-z]+);/gi, (m, n) => named[n.toLowerCase()] ?? m);
}

function getPath(obj, pathStr) {
  return pathStr
    .split(".")
    .reduce((acc, k) => (acc && k in acc ? acc[k] : undefined), obj);
}

function setPath(obj, pathStr, value) {
  const parts = pathStr.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const p = parts[i];
    if (!cur[p] || typeof cur[p] !== "object" || Array.isArray(cur[p]))
      cur[p] = {};
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

function nextKey(dict, basePath, textValue) {
  let candidate = basePath;
  let n = 2;
  while (true) {
    const existing = getPath(dict, candidate);
    if (existing == null || existing === textValue) return candidate;
    candidate = `${basePath}_${n}`;
    n += 1;
  }
}

function addDataI18nToTag(tagOpen, spec) {
  if (/data-i18n\s*=/.test(tagOpen)) return tagOpen;
  return tagOpen.replace(/>$/, ` data-i18n="${spec}">`);
}

function processFile(filePath, englishDict) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, "/");
  const keyPrefix = `auto.${fileKey(filePath)}`;
  const src = readText(filePath);
  const lines = src.split(/\r?\n/);
  let changed = false;
  let added = 0;
  let inScript = false;
  let inStyle = false;
  let inComment = false;

  for (let i = 0; i < lines.length; i += 1) {
    let line = lines[i];
    const original = line;

    if (/<script\b/i.test(line)) inScript = true;
    if (/<style\b/i.test(line)) inStyle = true;
    if (/<!--/.test(line) && !/-->/.test(line)) inComment = true;

    if (!inScript && !inStyle && !inComment) {
      // Placeholder attributes (input/textarea)
      line = line.replace(
        /<(input|textarea)([^>]*?)\splaceholder="([^"]*?[A-Za-z][^"]*?)"([^>]*)>/gi,
        (full, tag, a, placeholder, b) => {
          if (/data-i18n\s*=/.test(full)) return full;
          const cleaned = decodeHtmlEntities(placeholder).trim();
          if (!hasLetters(cleaned)) return full;
          const slug = slugFromText(cleaned);
          const basePath = `${keyPrefix}.${slug}`;
          const keyPath = nextKey(englishDict, basePath, cleaned);
          setPath(englishDict, keyPath, cleaned);
          const spec = `${keyPath}:placeholder`;
          added += 1;
          changed = true;
          return `<${tag}${a} placeholder="${placeholder}"${b} data-i18n="${spec}">`;
        },
      );

      // Direct text nodes (<tag ...>Text</tag>) on one line
      line = line.replace(
        /<([a-z][a-z0-9:-]*)([^>]*)>([^<>]*[A-Za-z][^<>]*)<\/\1>/gi,
        (full, tag, attrs, text) => {
          const tagLower = String(tag).toLowerCase();
          if (["script", "style"].includes(tagLower)) return full;
          if (/data-i18n\s*=/.test(attrs)) return full;
          if (/^\s*<!--/.test(full)) return full;
          const cleaned = decodeHtmlEntities(text).replace(/\s+/g, " ").trim();
          if (!hasLetters(cleaned)) return full;
          const slug = slugFromText(cleaned);
          const basePath = `${keyPrefix}.${slug}`;
          const keyPath = nextKey(englishDict, basePath, cleaned);
          setPath(englishDict, keyPath, cleaned);
          const spec = keyPath;
          const open = `<${tag}${attrs}>`;
          const newOpen = addDataI18nToTag(open, spec);
          if (newOpen === open) return full;
          added += 1;
          changed = true;
          return `${newOpen}${text}</${tag}>`;
        },
      );
    }

    if (/<\/script>/i.test(original)) inScript = false;
    if (/<\/style>/i.test(original)) inStyle = false;
    if (/-->/.test(original)) inComment = false;
    lines[i] = line;
  }

  if (WRITE && changed) {
    writeText(filePath, lines.join("\n"));
  }

  return { file: rel, changed, added };
}

function main() {
  const englishDict = JSON.parse(readText(ENGLISH_PATH));
  if (!englishDict.auto || typeof englishDict.auto !== "object") {
    englishDict.auto = {};
  }

  const files = routeHtmlFiles();
  const results = files.map((f) => processFile(f, englishDict));
  const changedFiles = results.filter((r) => r.changed);
  const totalAdded = results.reduce((sum, r) => sum + r.added, 0);

  if (WRITE) {
    writeText(ENGLISH_PATH, `${JSON.stringify(englishDict, null, 2)}\n`);
  }

  console.log(`Scanned files: ${files.length}`);
  console.log(`Changed files: ${changedFiles.length}`);
  console.log(`Added bindings: ${totalAdded}`);
  changedFiles.forEach((r) => {
    console.log(` - ${r.file} (+${r.added})`);
  });
}

main();
