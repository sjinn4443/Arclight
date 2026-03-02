#!/usr/bin/env node
const fs = require("fs");

const cfg = fs.readFileSync("public/js/config.js", "utf8");
const files = [...cfg.matchAll(/"html\/([^"]+\.html)"/g)].map(
  (m) => `public/html/${m[1]}`,
);
const dict = JSON.parse(
  fs.readFileSync("public/translation/english.json", "utf8"),
);

function get(obj, path) {
  return path
    .split(".")
    .reduce((acc, k) => (acc && k in acc ? acc[k] : undefined), obj);
}

const missing = [];

for (const file of [...new Set(files)]) {
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file, "utf8");
  for (const m of src.matchAll(/data-i18n="([^"]+)"/g)) {
    const spec = m[1];
    const key = spec.split(":")[0];
    if (get(dict, key) == null) {
      missing.push({ file, key });
    }
  }
}

console.log(`Missing keys: ${missing.length}`);
if (missing.length) {
  missing.slice(0, 120).forEach((m) => console.log(`${m.file} -> ${m.key}`));
}
