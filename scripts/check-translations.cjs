#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const {
  IGNORED_DATA_I18N_KEYS,
  ALLOWED_EXACT_ENGLISH_KEYS,
  ALLOWED_EXACT_ENGLISH_PATTERNS,
  LOCALE_SPECIFIC_ALLOWED_EXACT_ENGLISH_KEYS,
  MEDICAL_HOMONYM_RULES,
} = require("./i18n-qa-rules.cjs");

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const TRANSLATION_DIR = path.join(PUBLIC_DIR, "translation");
const STRICT_ENGLISH = process.argv.includes("--strict-english");

function walk(dir, exts, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, exts, out);
    else if (exts.some((ext) => entry.name.endsWith(ext))) out.push(full);
  }
  return out;
}

function get(obj, dottedPath) {
  if (!obj || !dottedPath) return undefined;

  const parts = String(dottedPath).split(".");
  let current = obj;

  for (let i = 0; i < parts.length; i += 1) {
    if (!current || typeof current !== "object") return undefined;

    const segment = parts[i];
    if (Object.prototype.hasOwnProperty.call(current, segment)) {
      current = current[segment];
      continue;
    }

    let matched = false;
    for (let j = parts.length - 1; j > i; j -= 1) {
      const merged = parts.slice(i, j + 1).join(".");
      if (Object.prototype.hasOwnProperty.call(current, merged)) {
        current = current[merged];
        i = j;
        matched = true;
        break;
      }
    }

    if (!matched) return undefined;
  }

  return current;
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function collectUsedI18nKeys() {
  const files = walk(PUBLIC_DIR, [".html", ".js"]);
  const used = new Set();

  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");

    for (const match of src.matchAll(/data-i18n\s*=\s*["']([^"']+)["']/g)) {
      used.add(match[1].split(":")[0]);
    }

    for (const match of src.matchAll(
      /setAttribute\(\s*["']data-i18n["']\s*,\s*["']([^"']+)["']\s*\)/g,
    )) {
      used.add(match[1].split(":")[0]);
    }
  }

  IGNORED_DATA_I18N_KEYS.forEach((key) => used.delete(key));
  return [...used].sort();
}

function isDamagedString(value) {
  const text = String(value ?? "");
  return (
    text.includes("???") || text.includes("\uFFFD") || text.includes("ï¿½")
  );
}

function isAllowedExactEnglish(locale, key, value) {
  const localeRules = LOCALE_SPECIFIC_ALLOWED_EXACT_ENGLISH_KEYS[locale] || [];
  return (
    ALLOWED_EXACT_ENGLISH_KEYS.some((pattern) => pattern.test(key)) ||
    localeRules.some((pattern) => pattern.test(key)) ||
    ALLOWED_EXACT_ENGLISH_PATTERNS.some((pattern) => pattern.test(value))
  );
}

function findMedicalHomonymRules(sourceText) {
  const lower = String(sourceText || "").toLowerCase();
  return MEDICAL_HOMONYM_RULES.filter((rule) => lower.includes(rule.term));
}

function main() {
  const englishPath = path.join(TRANSLATION_DIR, "english.json");
  const englishDict = loadJson(englishPath);
  const usedKeys = collectUsedI18nKeys();
  const localeFiles = fs
    .readdirSync(TRANSLATION_DIR)
    .filter(
      (fileName) => fileName.endsWith(".json") && fileName !== "english.json",
    )
    .sort();

  const results = [];

  for (const fileName of localeFiles) {
    const locale = fileName.replace(/\.json$/i, "");
    const dict = loadJson(path.join(TRANSLATION_DIR, fileName));
    const missing = [];
    const damaged = [];
    const exactEnglish = [];

    for (const key of usedKeys) {
      const englishValue = get(englishDict, key);
      const localeValue = get(dict, key);

      if (localeValue === undefined) {
        missing.push(key);
        continue;
      }

      if (typeof localeValue === "string" && isDamagedString(localeValue)) {
        damaged.push({ key, value: localeValue });
      }

      if (
        typeof englishValue === "string" &&
        typeof localeValue === "string" &&
        englishValue.trim() === localeValue.trim() &&
        !isAllowedExactEnglish(locale, key, localeValue)
      ) {
        exactEnglish.push({
          key,
          value: localeValue,
          homonymRules: findMedicalHomonymRules(englishValue),
        });
      }
    }

    results.push({ fileName, locale, missing, damaged, exactEnglish });
  }

  const missingCount = results.reduce(
    (sum, item) => sum + item.missing.length,
    0,
  );
  const damagedCount = results.reduce(
    (sum, item) => sum + item.damaged.length,
    0,
  );
  const exactEnglishCount = results.reduce(
    (sum, item) => sum + item.exactEnglish.length,
    0,
  );

  console.log("Translation QA summary");
  console.log(`Used i18n keys scanned: ${usedKeys.length}`);
  console.log(`Missing keys: ${missingCount}`);
  console.log(`Damaged strings: ${damagedCount}`);
  console.log(`Exact English carry-overs: ${exactEnglishCount}`);
  console.log("");
  console.log("Medical homonym rules");
  for (const rule of MEDICAL_HOMONYM_RULES) {
    console.log(`- ${rule.term}: ${rule.guidance}`);
  }

  for (const result of results) {
    if (
      result.missing.length === 0 &&
      result.damaged.length === 0 &&
      result.exactEnglish.length === 0
    ) {
      continue;
    }

    console.log("");
    console.log(`## ${result.fileName}`);

    if (result.missing.length) {
      console.log(`Missing (${result.missing.length})`);
      result.missing.slice(0, 40).forEach((key) => console.log(`- ${key}`));
    }

    if (result.damaged.length) {
      console.log(`Damaged (${result.damaged.length})`);
      result.damaged
        .slice(0, 20)
        .forEach((entry) =>
          console.log(`- ${entry.key}: ${JSON.stringify(entry.value)}`),
        );
    }

    if (result.exactEnglish.length) {
      console.log(`Exact English (${result.exactEnglish.length})`);
      result.exactEnglish.slice(0, 40).forEach((entry) => {
        console.log(`- ${entry.key}: ${JSON.stringify(entry.value)}`);
        entry.homonymRules.forEach((rule) => {
          console.log(`  rule: ${rule.guidance}`);
        });
      });
    }
  }

  if (
    missingCount > 0 ||
    damagedCount > 0 ||
    (STRICT_ENGLISH && exactEnglishCount > 0)
  ) {
    process.exitCode = 1;
  }
}

main();
