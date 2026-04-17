#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import { applyMediaA11y } from "../public/js/mediaA11y.js";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");

function walk(dir, exts, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, exts, out);
    else if (exts.some((ext) => entry.name.endsWith(ext))) out.push(full);
  }
  return out;
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function hasButtonName(button) {
  if (button.getAttribute("aria-label") || button.getAttribute("title"))
    return true;
  if (normalizeText(button.textContent)) return true;
  const imageWithAlt = [...button.querySelectorAll("img")].some((img) =>
    normalizeText(img.getAttribute("alt")),
  );
  return imageWithAlt;
}

function isDecorativeImage(img) {
  return (
    img.getAttribute("alt") === "" ||
    img.getAttribute("aria-hidden") === "true" ||
    img.getAttribute("role") === "presentation"
  );
}

function isHiddenMedia(el) {
  return el.getAttribute("aria-hidden") === "true";
}

const htmlFiles = walk(PUBLIC_DIR, [".html"]);
const findings = [];

for (const file of htmlFiles) {
  const src = fs.readFileSync(file, "utf8");
  const dom = new JSDOM(src);
  const doc = dom.window.document;

  applyMediaA11y(doc);

  doc.querySelectorAll("img").forEach((img) => {
    if (isDecorativeImage(img)) return;
    if (img.getAttribute("alt") || img.getAttribute("aria-label")) return;
    findings.push({
      file,
      type: "img-missing-name",
      snippet: img.outerHTML.slice(0, 160),
    });
  });

  doc.querySelectorAll("video").forEach((video) => {
    if (isHiddenMedia(video)) return;
    if (
      video.getAttribute("aria-label") ||
      video.getAttribute("aria-labelledby") ||
      video.getAttribute("title")
    ) {
      return;
    }
    findings.push({
      file,
      type: "video-missing-name",
      snippet: video.outerHTML.slice(0, 160),
    });
  });

  doc.querySelectorAll("iframe").forEach((iframe) => {
    if (
      iframe.getAttribute("aria-label") ||
      iframe.getAttribute("aria-labelledby") ||
      iframe.getAttribute("title")
    ) {
      return;
    }
    findings.push({
      file,
      type: "iframe-missing-name",
      snippet: iframe.outerHTML.slice(0, 160),
    });
  });

  doc.querySelectorAll("button").forEach((button) => {
    if (hasButtonName(button)) return;
    findings.push({
      file,
      type: "button-missing-name",
      snippet: button.outerHTML.slice(0, 160),
    });
  });
}

if (findings.length) {
  console.log("Accessibility audit failed");
  findings.forEach((finding) => {
    console.log(`${finding.type}: ${path.relative(ROOT, finding.file)}`);
    console.log(`  ${finding.snippet}`);
  });
  process.exit(1);
}

console.log(`Accessibility audit passed for ${htmlFiles.length} HTML files.`);
