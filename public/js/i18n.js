import { applyMediaA11y } from "./mediaA11y.js";

/**
 * Ultra-safe i18n:
 * - Only changes visible text/labels.
 * - Never rewrites innerHTML of SELECT/OPTGROUP/OPTION/INPUT/TEXTAREA/BUTTON.
 * - Never changes <option> .value or the current selection.
 * - Supports targets: text (default), placeholder, value (buttons only), aria-label, title, label (for <optgroup>).
 * - For SELECT placeholder, updates the first empty/disabled option's text.
 */

const LANG_ALIAS = {
  en: "english",
  am: "amharic",
  ar: "arabic",
  bn: "bangla",
  ny: "chichewa",
  zh: "chinese",
  fr: "french",
  ha: "hausa",
  hi: "hindi",
  ne: "nepali",
  ig: "igbo",
  id: "indonesian",
  rw: "kinyarwanda",
  ko: "korean",
  lo: "lao",
  te: "telugu",
  ln: "lingala",
  fa: "persian",
  pt: "portuguese",
  sn: "shona",
  es: "spanish",
  sw: "swahili",
  ur: "urdu",
  yo: "yoruba",
  zu: "zulu",
};

const CACHE = {
  lang: null,
  dict: {},
  fallbackDict: {},
  fetched: new Map(),
  literalIndex: new Map(),
  loading: null,
};

const GLOBAL_TRANSLATION_PASS_DELAYS_MS = [80, 220];
let translationPassInFlight = false;
let translationPassQueued = false;
let mutationObserverBound = false;
let mutationTranslationTimer = null;
const COMMON_LITERAL_FALLBACKS = Object.freeze({
  Menu: ["i18nExtra.menu_aria_label"],
  Close: ["languageInstall.closeButton"],
  Language: ["menu.language_item"],
  Search: [
    "menu.search_placeholder",
    "searchPlaceholder",
    "dashboard.search_placeholder",
  ],
  "Search menu contents": ["menu.search_placeholder"],
  "Search contents": ["dashboard.search_placeholder", "searchPlaceholder"],
  "Search for contents": ["searchPlaceholder", "dashboard.search_placeholder"],
  "Search my learning contents": [
    "searchPlaceholder",
    "dashboard.search_placeholder",
  ],
  "Core Examination": ["eyes.core_examination_title"],
  Conditions: ["eyes.disease_title"],
  Workshops: ["eyes.primary_eye_care_procedures_title"],
  "Extended Examination": ["eyes.extended_examination_title"],
  "Tools and Kits": ["eyes.tools_title"],
  "Medical Students": ["eyes.card_label.medical_students"],
  Interactive: ["eyes.tag_interactive"],
  PDF: ["eyes.tag_pdf"],
});

export function get(obj, path) {
  if (!obj || !path) return undefined;

  const parts = String(path).split(".");
  let current = obj;

  for (let i = 0; i < parts.length; i += 1) {
    if (!current || typeof current !== "object") return undefined;

    const segment = parts[i];
    if (segment in current) {
      current = current[segment];
      continue;
    }

    // Support dictionaries that use dot-separated keys as a single property,
    // e.g. "card_label.history_taking" under "eyes".
    let matched = false;
    for (let j = parts.length - 1; j > i; j -= 1) {
      const merged = parts.slice(i, j + 1).join(".");
      if (merged in current) {
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

function normalizeLanguage(lang) {
  const normalized = String(lang || "")
    .trim()
    .toLowerCase();
  return LANG_ALIAS[normalized] ? normalized : "en";
}

function langToPath(lang) {
  const alias = LANG_ALIAS[normalizeLanguage(lang)] || LANG_ALIAS.en;
  return `/translation/${alias}.json`;
}

export function getLanguage() {
  const fromStorage = localStorage.getItem("prefLang");
  if (fromStorage) return normalizeLanguage(fromStorage);
  const htmlLang = (document.documentElement.getAttribute("lang") || "").trim();
  return normalizeLanguage(htmlLang || "en");
}

// New function to fetch a specific language dictionary without affecting global CACHE
export async function fetchDictionary(lang) {
  const normalized = normalizeLanguage(lang);
  if (CACHE.fetched.has(normalized)) {
    return CACHE.fetched.get(normalized);
  }

  const p = (async () => {
    const path = langToPath(normalized);
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) {
        if (normalized === "en") return {};
        throw new Error(`Fetch failed: ${res.status}`);
      }
      return await res.json();
    } catch (e) {
      console.warn(`[i18n] Failed to load ${path}:`, e);
      return {};
    }
  })();

  CACHE.fetched.set(normalized, p);
  return p;
}

async function loadTranslations(lang) {
  const next = normalizeLanguage(lang);
  if (CACHE.loading?.lang === next) {
    return CACHE.loading.promise;
  }

  const promise = (async () => {
    const fallbackDict = await fetchDictionary("en");
    const dict = next === "en" ? fallbackDict : await fetchDictionary(next);

    CACHE.fallbackDict = fallbackDict || {};
    CACHE.dict = dict || {};
    CACHE.lang = next;
    document.documentElement.setAttribute("lang", next);
    rebuildLiteralIndex();
    return CACHE.dict;
  })().finally(() => {
    if (CACHE.loading?.promise === promise) {
      CACHE.loading = null;
    }
  });

  CACHE.loading = { lang: next, promise };
  return promise;
}

async function ensureTranslationsReady(lang = getLanguage()) {
  const next = normalizeLanguage(lang);
  if (CACHE.loading?.lang === next) {
    await CACHE.loading.promise;
    return CACHE.dict;
  }
  if (CACHE.lang !== next || !CACHE.lang) {
    await loadTranslations(next);
  }
  return CACHE.dict;
}

function normalizeLiteralText(value) {
  return String(value == null ? "" : value)
    .replace(/\r\n?/g, "\n")
    .replace(/\s+/g, " ")
    .trim();
}

const LAO_EMBEDDED_CLINICAL_TERMS = [
  ["Pain/Redness:", "ອາການເຈັບ/ແດງ:"],
  ["DR/Scar", "ເບົາຫວານຂຶ້ນຈໍຕາ/ຮອຍແປ້ວ"],
  ["swinging light", "ແສງແກວ່ງ"],
  ["direct ophthalmoscope", "ເຄື່ອງສ່ອງກົ້ນຕາໂດຍກົງ"],
  ["Conditions", "ພະຍາດ"],
  ["Condition", "ພະຍາດ"],
  ["Eyes", "ຕາ"],
  ["Cataract", "ພະຍາດຕໍ້ກະຈົກ"],
  ["cataract", "ພະຍາດຕໍ້ກະຈົກ"],
  ["Cupped", "ຂົ້ວປະສາດຕາບຸ໋ມ"],
  ["Detached", "ຈໍຕາຫຼຸດລອກ"],
  ["pupillary", "ຂອງຮູມ່ານຕາ"],
  ["pupils", "ຮູມ່ານຕາ"],
  ["pupil", "ຮູມ່ານຕາ"],
  ["fundus", "ກົ້ນຕາ"],
  ["retina", "ຈໍຕາ"],
  ["refractive", "ການຫັກແສງ"],
  ["Reflex", "ການສະທ້ອນ"],
  ["mths", "ເດືອນ"],
  ["days", "ມື້"],
  ["deg", "ອົງສາ"],
];

function cleanupLaoLiteral(value) {
  if (normalizeLanguage(CACHE.lang) !== "lo") return value;
  let result = String(value);
  LAO_EMBEDDED_CLINICAL_TERMS.forEach(([english, lao]) => {
    result = result.replaceAll(english, lao);
  });
  return result;
}

function rebuildLiteralIndex() {
  CACHE.literalIndex = new Map();
  const mergeLiteralEntries = (source) => {
    if (!source || typeof source !== "object") return;
    Object.entries(source).forEach(([rawKey, rawVal]) => {
      const key = normalizeLiteralText(rawKey);
      if (!key) return;
      CACHE.literalIndex.set(key, String(rawVal));
    });
  };

  mergeLiteralEntries(CACHE.fallbackDict?.i18nLiteral);
  mergeLiteralEntries(CACHE.dict?.i18nLiteral);
}

function literalTranslate(rawText) {
  const key = normalizeLiteralText(rawText);
  if (!key) return null;
  const direct = CACHE.literalIndex.get(key);
  if (direct != null) return cleanupLaoLiteral(direct);

  const fallbackPaths = COMMON_LITERAL_FALLBACKS[key] || [];
  for (const path of fallbackPaths) {
    const translated = get(CACHE.dict, path) ?? get(CACHE.fallbackDict, path);
    if (translated != null) return cleanupLaoLiteral(String(translated));
  }

  return null;
}

export function translateLiteral(rawText, fallback = rawText) {
  const translated = literalTranslate(rawText);
  return translated == null ? fallback : translated;
}

function interpolate(value, variables = {}) {
  return String(value).replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) =>
    String(variables[key] ?? ""),
  );
}

export function translate(path, fallback = path, variables = {}) {
  const value = get(CACHE.dict, path) ?? get(CACHE.fallbackDict, path);
  return interpolate(value == null ? fallback : value, variables);
}

function parseI18nSpecs(rawSpec) {
  return String(rawSpec || "")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [path, rawTarget = "text"] = entry.split(":");
      return {
        path: String(path || "").trim(),
        target:
          String(rawTarget || "text")
            .trim()
            .toLowerCase() || "text",
      };
    })
    .filter((entry) => entry.path);
}

function applyLiteralTranslations(root = document) {
  if (!root || !CACHE.literalIndex?.size) return;

  const doc = root.ownerDocument || document;
  const scope =
    root.nodeType === 9 ? root.body || root.documentElement || root : root;
  if (!scope) return;

  const textWalker = doc.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);

  let textNode = textWalker.nextNode();
  while (textNode) {
    const parent = textNode.parentElement;
    const explicitOwner = parent?.closest("[data-i18n]");
    const isInsideExplicitTextTranslation = explicitOwner
      ? parseI18nSpecs(explicitOwner.getAttribute("data-i18n") || "").some(
          ({ target }) => ["text", "html", "value"].includes(target),
        )
      : false;
    if (
      parent &&
      !isInsideExplicitTextTranslation &&
      !parent.closest("[data-i18n-skip]") &&
      !/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/i.test(parent.tagName || "")
    ) {
      const translated = literalTranslate(textNode.textContent);
      if (translated != null) {
        textNode.textContent = translated;
      }
    }
    textNode = textWalker.nextNode();
  }

  const attrNames = ["aria-label", "title", "placeholder", "alt"];
  scope.querySelectorAll("*").forEach((el) => {
    if (el.closest("[data-i18n-skip]")) return;
    const spec = (el.getAttribute("data-i18n") || "").trim();
    const explicitTargets = new Set(
      parseI18nSpecs(spec).map((entry) => entry.target),
    );

    attrNames.forEach((attr) => {
      if (explicitTargets.has(attr.toLowerCase())) return;
      const current = el.getAttribute(attr);
      if (!current) return;
      const translated = literalTranslate(current);
      if (translated != null) {
        el.setAttribute(attr, translated);
      }
    });
  });
}

/** SELECT placeholder helper: first empty/disabled option’s text */
function setSelectPlaceholder(selectEl, text) {
  const opt =
    selectEl.querySelector('option[value=""]') ||
    selectEl.querySelector("option[disabled]") ||
    selectEl.options?.[0];
  if (opt) opt.textContent = text;
}

/** Main translator (ULTRA SAFE) */
export function applyTranslations(root = document) {
  if (!root) return;

  const getTranslationValue = (path) =>
    get(CACHE.dict, path) ?? get(CACHE.fallbackDict, path);

  const scopedNodes = [];
  if (root.nodeType === 1 && root.matches?.("[data-i18n]")) {
    scopedNodes.push(root);
  }
  if (typeof root.querySelectorAll === "function") {
    scopedNodes.push(...root.querySelectorAll("[data-i18n]"));
  }

  scopedNodes.forEach((el) => {
    const spec = (el.getAttribute("data-i18n") || "").trim();
    if (!spec) return;
    // Do not translate inside regions explicitly marked to be skipped
    if (el.closest("[data-i18n-skip]")) return;

    const tag = el.tagName.toUpperCase();
    const isFormContainer =
      /^(SELECT|OPTGROUP|OPTION|INPUT|TEXTAREA|BUTTON)$/i.test(tag);

    parseI18nSpecs(spec).forEach(({ path, target }) => {
      const val = getTranslationValue(path);
      if (val == null) return;

      switch (target) {
        case "html": {
          // NEVER rewrite innerHTML of any form element (keeps options intact).
          if (isFormContainer) {
            if (tag === "SELECT") setSelectPlaceholder(el, val); // redirect to safe placeholder text
            // otherwise ignore :html on form controls
          } else {
            el.innerHTML = val;
          }
          break;
        }

        case "text": {
          if (tag === "SELECT") {
            setSelectPlaceholder(el, val);
          } else if (tag === "OPTGROUP") {
            // Do not touch children; set header label only
            el.setAttribute("label", val);
          } else if (tag === "OPTION") {
            // Only change visible label; never change .value
            el.textContent = val;
          } else {
            el.textContent = val;
          }
          break;
        }

        case "placeholder": {
          if (tag === "INPUT" || tag === "TEXTAREA") {
            el.setAttribute("placeholder", val);
          } else if (tag === "SELECT") {
            setSelectPlaceholder(el, val);
          }
          break;
        }

        case "value": {
          // Only safe for button-like inputs; never change user-entered values.
          if (tag === "INPUT") {
            const type = (el.getAttribute("type") || "").toLowerCase();
            if (["button", "submit", "reset"].includes(type)) {
              el.setAttribute("value", val);
            }
          } else if (tag === "BUTTON") {
            el.textContent = val;
          } else if (tag === "OPTION") {
            // Still do NOT change option.value; only text should change
            el.textContent = val;
          }
          break;
        }

        case "label": {
          // For <optgroup label="..."> etc.
          el.setAttribute("label", val);
          break;
        }

        case "aria-label":
        case "title":
        case "alt": {
          el.setAttribute(target, val);
          break;
        }

        default: {
          // Unknown target -> safe text behavior
          if (tag === "SELECT") {
            setSelectPlaceholder(el, val);
          } else if (tag === "OPTGROUP") {
            el.setAttribute("label", val);
          } else if (tag === "OPTION") {
            el.textContent = val;
          } else {
            el.textContent = val;
          }
        }
      }
    });
  });

  applyLiteralTranslations(root);
  applyMediaA11y(root);
}

async function runGlobalTranslationPass() {
  translationPassQueued = true;
  if (translationPassInFlight) return;

  translationPassInFlight = true;
  try {
    while (translationPassQueued) {
      translationPassQueued = false;
      await ensureTranslationsReady(getLanguage());
      applyTranslations(document);
    }
  } catch (err) {
    console.error("[i18n] translation pass failed", err);
  } finally {
    translationPassInFlight = false;
  }
}

function scheduleGlobalTranslationPasses() {
  const queuePass = () => {
    void runGlobalTranslationPass();
  };

  queuePass();

  if (typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(queuePass);
    window.requestAnimationFrame(() => window.requestAnimationFrame(queuePass));
  }

  GLOBAL_TRANSLATION_PASS_DELAYS_MS.forEach((delay) => {
    window.setTimeout(queuePass, delay);
  });
}

function scheduleMutationTranslationPass() {
  if (translationPassInFlight) return;
  if (mutationTranslationTimer) {
    window.clearTimeout(mutationTranslationTimer);
  }
  mutationTranslationTimer = window.setTimeout(() => {
    mutationTranslationTimer = null;
    void runGlobalTranslationPass();
  }, 60);
}

function bindMutationTranslationPasses() {
  if (mutationObserverBound || typeof MutationObserver !== "function") return;
  const target = document.body || document.documentElement;
  if (!target) return;

  mutationObserverBound = true;
  const observer = new MutationObserver((mutations) => {
    if (translationPassInFlight) return;
    const hasTextChange = mutations.some((mutation) => {
      if (mutation.type === "characterData") return true;
      return Array.from(mutation.addedNodes || []).some((node) => {
        if (node.nodeType === Node.TEXT_NODE) return true;
        return node.nodeType === Node.ELEMENT_NODE;
      });
    });
    if (hasTextChange) scheduleMutationTranslationPass();
  });

  observer.observe(target, {
    childList: true,
    characterData: true,
    subtree: true,
  });
}

/** Change language and re-translate the live DOM */
export async function setLanguage(lang) {
  const next = normalizeLanguage(lang || getLanguage());
  const previous = CACHE.lang;
  localStorage.setItem("prefLang", next);
  await loadTranslations(next);
  applyTranslations(document);
  document.documentElement.setAttribute("lang", next);

  if (previous !== next) {
    const detail = { lang: next, previousLang: previous };
    window.dispatchEvent(new CustomEvent("i18n:languageChanged", { detail }));
    document.dispatchEvent(new CustomEvent("language:updated", { detail }));
  }

  scheduleGlobalTranslationPasses();

  try {
    window.ARCLIGHT?.saveProfile?.({ language: next });
  } catch {}
}

/** Boot */
if (!window.__arclightI18nLifecycleBound) {
  window.__arclightI18nLifecycleBound = true;
  window.addEventListener("page:loaded", scheduleGlobalTranslationPasses);
  document.addEventListener("page:shown", scheduleGlobalTranslationPasses);
  window.addEventListener(
    "i18n:languageChanged",
    scheduleGlobalTranslationPasses,
  );
}

(async () => {
  await ensureTranslationsReady(getLanguage());
  bindMutationTranslationPasses();
  scheduleGlobalTranslationPasses();
})();

// i18n.js (near bottom; only if you don't already expose these)
window.I18N = window.I18N || {};
window.I18N.setLanguage = window.I18N.setLanguage || setLanguage; // your existing function
window.I18N.applyTranslations =
  window.I18N.applyTranslations || applyTranslations; // your existing function
window.I18N.getLanguage = window.I18N.getLanguage || getLanguage;
window.I18N.translateLiteral = window.I18N.translateLiteral || translateLiteral;
window.I18N.t = window.I18N.t || translate;
