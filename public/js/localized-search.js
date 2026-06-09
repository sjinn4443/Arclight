import { fetchDictionary, get, getLanguage } from "./i18n.js";

const COMBINING_MARKS_RE = /[\u0300-\u036f]/g;
let nonSearchCharactersRe = null;

function getNonSearchCharactersRe() {
  if (nonSearchCharactersRe) return nonSearchCharactersRe;

  try {
    nonSearchCharactersRe = new RegExp("[^\\p{L}\\p{N}]+", "gu");
  } catch {
    nonSearchCharactersRe = /[^a-z0-9]+/gi;
  }

  return nonSearchCharactersRe;
}

function addUniqueText(values, seen, value) {
  const text = String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text || seen.has(text)) return;
  seen.add(text);
  values.push(text);
}

function flattenSearchParts(parts, values = []) {
  parts.forEach((part) => {
    if (Array.isArray(part)) {
      flattenSearchParts(part, values);
    } else if (part != null) {
      values.push(part);
    }
  });
  return values;
}

export function normalizeSearchText(value) {
  return String(value || "")
    .normalize("NFKD")
    .toLocaleLowerCase()
    .replace(COMBINING_MARKS_RE, "")
    .replace(getNonSearchCharactersRe(), " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSearchText(parts = []) {
  return normalizeSearchText(flattenSearchParts(parts).join(" "));
}

export function parseI18nSearchSpecs(rawSpec) {
  return String(rawSpec || "")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => entry.split(":")[0]?.trim())
    .filter(Boolean);
}

export async function getActiveSearchDictionaries() {
  const currentLang = getLanguage();
  const langs = currentLang === "en" ? ["en"] : ["en", currentLang];

  return Promise.all(
    langs.map(async (lang) => ({
      lang,
      dict: (await fetchDictionary(lang)) || {},
    })),
  );
}

export function getLocalizedPathValues(path, dictionaries = [], fallback = "") {
  const values = [];
  const seen = new Set();

  addUniqueText(values, seen, fallback);
  if (!path) return values;

  dictionaries.forEach(({ dict }) => {
    addUniqueText(values, seen, get(dict, path));
  });

  return values;
}

export function getLocalizedDisplayValue(
  path,
  dictionaries = [],
  fallback = "",
) {
  if (!path) return String(fallback || "");

  const currentLang = getLanguage();
  const currentEntry = dictionaries.find((entry) => entry.lang === currentLang);
  const currentValue = get(currentEntry?.dict, path);
  if (currentValue != null) return String(currentValue);

  const englishValue = get(
    dictionaries.find((entry) => entry.lang === "en")?.dict,
    path,
  );
  return englishValue != null ? String(englishValue) : String(fallback || "");
}

export function getLocalizedSpecValues(rawSpec, dictionaries = []) {
  const values = [];
  const seen = new Set();

  parseI18nSearchSpecs(rawSpec).forEach((path) => {
    getLocalizedPathValues(path, dictionaries).forEach((value) => {
      addUniqueText(values, seen, value);
    });
  });

  return values;
}

export function getElementLocalizedSearchValues(element, dictionaries = []) {
  if (!element) return [];

  const values = [];
  const seen = new Set();
  const nodes = [];

  if (element.matches?.("[data-i18n]")) nodes.push(element);
  if (typeof element.querySelectorAll === "function") {
    nodes.push(...element.querySelectorAll("[data-i18n]"));
  }

  nodes.forEach((node) => {
    getLocalizedSpecValues(
      node.getAttribute("data-i18n"),
      dictionaries,
    ).forEach((value) => {
      addUniqueText(values, seen, value);
    });
  });

  return values;
}
