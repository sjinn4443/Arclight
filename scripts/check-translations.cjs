#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const {
  IGNORED_DATA_I18N_KEYS,
  ALLOWED_EXACT_ENGLISH_KEYS,
  ALLOWED_EXACT_ENGLISH_PATTERNS,
  LOCALE_SPECIFIC_ALLOWED_EXACT_ENGLISH_KEYS,
  MEDICAL_HOMONYM_RULES,
  MEDICAL_HOMONYM_FORBIDDEN_TERMS,
} = require("./i18n-qa-rules.cjs");

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const TRANSLATION_DIR = path.join(PUBLIC_DIR, "translation");
const VIDEO_SUBTITLE_DIR = path.join(PUBLIC_DIR, "video-subtitles");
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

function getByParts(obj, parts) {
  let current = obj;
  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = current[part];
  }
  return current;
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function addI18nSpecKeys(spec, used) {
  String(spec || "")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .forEach((entry) => {
      const key = entry.split(":")[0]?.trim();
      if (key) used.add(key);
    });
}

function collectUsedI18nKeys() {
  const files = walk(PUBLIC_DIR, [".html", ".js"]);
  const used = new Set();

  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");

    for (const match of src.matchAll(/data-i18n\s*=\s*["']([^"']+)["']/g)) {
      addI18nSpecKeys(match[1], used);
    }

    for (const match of src.matchAll(
      /setAttribute\(\s*["']data-i18n["']\s*,\s*["']([^"']+)["']\s*\)/g,
    )) {
      addI18nSpecKeys(match[1], used);
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

function collectEnglishStringEntries(node, pathParts = [], out = []) {
  if (typeof node === "string") {
    out.push({
      key: pathParts.join("."),
      pathParts,
      source: node,
    });
    return out;
  }

  if (!node || typeof node !== "object") return out;

  Object.entries(node).forEach(([key, value]) => {
    collectEnglishStringEntries(value, [...pathParts, key], out);
  });
  return out;
}

function findForbiddenMedicalHomonyms(
  locale,
  sourceText,
  translatedText,
  keyPath,
  options = {},
) {
  const findings = [];
  const source = String(sourceText || "");
  const pathText = String(keyPath || "");
  const value = String(translatedText || "");

  for (const [term, rule] of Object.entries(MEDICAL_HOMONYM_FORBIDDEN_TERMS)) {
    const sourceMatches =
      (rule.sourcePattern && rule.sourcePattern.test(source)) ||
      (rule.sourcePathPattern && rule.sourcePathPattern.test(pathText)) ||
      (options.subtitle &&
        rule.subtitleSourcePattern &&
        rule.subtitleSourcePattern.test(source));

    if (!sourceMatches) continue;

    const forbiddenRules = rule.forbiddenByLocale?.[locale] || [];
    for (const forbiddenPattern of forbiddenRules) {
      if (forbiddenPattern.test(value)) {
        findings.push({
          term,
          pattern: forbiddenPattern.toString(),
        });
      }
    }
  }

  return findings;
}

function collectTranslationMedicalHomonymViolations(
  englishDict,
  localeDict,
  locale,
) {
  const violations = [];
  const entries = collectEnglishStringEntries(englishDict);

  for (const entry of entries) {
    const localeValue = getByParts(localeDict, entry.pathParts);
    if (typeof localeValue !== "string") continue;

    const findings = findForbiddenMedicalHomonyms(
      locale,
      entry.source,
      localeValue,
      entry.key,
    );

    findings.forEach((finding) => {
      violations.push({
        key: entry.key,
        source: entry.source,
        value: localeValue,
        ...finding,
      });
    });
  }

  return violations;
}

function parseVttCues(vttText) {
  return String(vttText || "")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n\r?\n/)
    .map((block) => block.split(/\r?\n/).filter(Boolean))
    .filter((lines) => lines.some((line) => line.includes("-->")))
    .map((lines) =>
      lines
        .filter((line) => !/^\d+$/.test(line) && !line.includes("-->"))
        .join(" "),
    );
}

function collectSubtitleMedicalHomonymViolations() {
  if (!fs.existsSync(VIDEO_SUBTITLE_DIR)) return [];

  const violations = [];
  const subtitleFiles = walk(VIDEO_SUBTITLE_DIR, [".vtt"]);
  const englishSubtitleFiles = subtitleFiles.filter(
    (filePath) => path.basename(filePath) === "en.vtt",
  );

  for (const englishSubtitlePath of englishSubtitleFiles) {
    const subtitleDir = path.dirname(englishSubtitlePath);
    const relDir = path.relative(VIDEO_SUBTITLE_DIR, subtitleDir);
    const sourceCues = parseVttCues(
      fs.readFileSync(englishSubtitlePath, "utf8"),
    );

    sourceCues.forEach((cueText, cueIndex) => {
      if (/student-duce/i.test(cueText)) {
        violations.push({
          file: path.relative(ROOT, englishSubtitlePath),
          locale: "en",
          cue: cueIndex + 1,
          source: cueText,
          value: cueText,
          term: "pupil",
          pattern: "/student-duce/i",
        });
      }
    });

    const localeSubtitleFiles = fs
      .readdirSync(subtitleDir)
      .filter((fileName) => fileName.endsWith(".vtt") && fileName !== "en.vtt");

    for (const fileName of localeSubtitleFiles) {
      const locale = fileName.replace(/\.vtt$/i, "");
      const filePath = path.join(subtitleDir, fileName);
      const targetCues = parseVttCues(fs.readFileSync(filePath, "utf8"));

      targetCues.forEach((targetCue, cueIndex) => {
        const sourceCue = sourceCues[cueIndex] || "";
        const findings = findForbiddenMedicalHomonyms(
          locale,
          sourceCue,
          targetCue,
          relDir,
          { subtitle: true },
        );

        findings.forEach((finding) => {
          violations.push({
            file: path.relative(ROOT, filePath),
            locale,
            cue: cueIndex + 1,
            source: sourceCue,
            value: targetCue,
            ...finding,
          });
        });
      });
    }
  }

  return violations;
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
    const medicalHomonym = collectTranslationMedicalHomonymViolations(
      englishDict,
      dict,
      locale,
    );

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

    results.push({
      fileName,
      locale,
      missing,
      damaged,
      exactEnglish,
      medicalHomonym,
    });
  }

  const subtitleMedicalHomonym = collectSubtitleMedicalHomonymViolations();
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
  const medicalHomonymCount = results.reduce(
    (sum, item) => sum + item.medicalHomonym.length,
    0,
  );

  console.log("Translation QA summary");
  console.log(`Used i18n keys scanned: ${usedKeys.length}`);
  console.log(`Missing keys: ${missingCount}`);
  console.log(`Damaged strings: ${damagedCount}`);
  console.log(`Exact English carry-overs: ${exactEnglishCount}`);
  console.log(`Medical homonym violations: ${medicalHomonymCount}`);
  console.log(
    `Subtitle medical homonym violations: ${subtitleMedicalHomonym.length}`,
  );
  console.log("");
  console.log("Medical homonym rules");
  for (const rule of MEDICAL_HOMONYM_RULES) {
    console.log(`- ${rule.term}: ${rule.guidance}`);
  }

  for (const result of results) {
    if (
      result.missing.length === 0 &&
      result.damaged.length === 0 &&
      result.exactEnglish.length === 0 &&
      result.medicalHomonym.length === 0
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

    if (result.medicalHomonym.length) {
      console.log(`Medical homonym (${result.medicalHomonym.length})`);
      result.medicalHomonym.slice(0, 40).forEach((entry) => {
        console.log(`- ${entry.key}: ${JSON.stringify(entry.value)}`);
        console.log(`  source: ${JSON.stringify(entry.source)}`);
        console.log(`  term: ${entry.term}; forbidden: ${entry.pattern}`);
      });
    }
  }

  if (subtitleMedicalHomonym.length) {
    console.log("");
    console.log("## video-subtitles");
    console.log(`Medical homonym (${subtitleMedicalHomonym.length})`);
    subtitleMedicalHomonym.slice(0, 80).forEach((entry) => {
      console.log(
        `- ${entry.file} cue ${entry.cue}: ${JSON.stringify(entry.value)}`,
      );
      console.log(`  source: ${JSON.stringify(entry.source)}`);
      console.log(`  term: ${entry.term}; forbidden: ${entry.pattern}`);
    });
  }

  if (
    missingCount > 0 ||
    damagedCount > 0 ||
    medicalHomonymCount > 0 ||
    subtitleMedicalHomonym.length > 0 ||
    (STRICT_ENGLISH && exactEnglishCount > 0)
  ) {
    process.exitCode = 1;
  }
}

main();
