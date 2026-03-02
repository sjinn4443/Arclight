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
  ig: "igbo",
  id: "indonesian",
  rw: "kinyarwanda",
  ko: "korean",
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
  fetched: new Map(),
  literalIndex: new Map(),
};

export function get(obj, path) {
  return path
    .split(".")
    .reduce((o, k) => (o && k in o ? o[k] : undefined), obj);
}

function langToPath(lang) {
  const alias = LANG_ALIAS[lang] || LANG_ALIAS.en;
  return `/translation/${alias}.json`;
}

export function getLanguage() {
  const fromStorage = localStorage.getItem("prefLang");
  if (fromStorage) return fromStorage;
  const htmlLang = (document.documentElement.getAttribute("lang") || "").trim();
  return htmlLang || "en";
}

// New function to fetch a specific language dictionary without affecting global CACHE
export async function fetchDictionary(lang) {
  if (CACHE.fetched.has(lang)) {
    return CACHE.fetched.get(lang);
  }

  const p = (async () => {
    const path = langToPath(lang);
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) {
        if (lang === "en") return {};
        throw new Error(`Fetch failed: ${res.status}`);
      }
      return await res.json();
    } catch (e) {
      console.warn(`[i18n] Failed to load ${path}:`, e);
      return {};
    }
  })();

  CACHE.fetched.set(lang, p);
  return p;
}

async function loadTranslations(lang) {
  CACHE.dict = await fetchDictionary(lang);
  rebuildLiteralIndex();
  CACHE.lang = lang;
}

function normalizeLiteralText(value) {
  return String(value == null ? "" : value)
    .replace(/\r\n?/g, "\n")
    .replace(/\s+/g, " ")
    .trim();
}

function rebuildLiteralIndex() {
  CACHE.literalIndex = new Map();
  const literal = CACHE.dict?.i18nLiteral;
  if (!literal || typeof literal !== "object") return;

  Object.entries(literal).forEach(([rawKey, rawVal]) => {
    const key = normalizeLiteralText(rawKey);
    if (!key) return;
    CACHE.literalIndex.set(key, String(rawVal));
  });
}

function literalTranslate(rawText) {
  const key = normalizeLiteralText(rawText);
  if (!key) return null;
  return CACHE.literalIndex.get(key) ?? null;
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
    if (
      parent &&
      !parent.closest("[data-i18n]") &&
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
    const target = spec.split(":")[1]?.toLowerCase() || "text";

    attrNames.forEach((attr) => {
      if (spec && target === attr.toLowerCase()) return;
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

  const nodes = root.querySelectorAll("[data-i18n]");
  nodes.forEach((el) => {
    const spec = (el.getAttribute("data-i18n") || "").trim();
    if (!spec) return;
    // Do not translate inside regions explicitly marked to be skipped
    if (el.closest("[data-i18n-skip]")) return;

    const [path, rawTarget = "text"] = spec.split(":");
    const target = (rawTarget || "text").toLowerCase();
    const val = get(CACHE.dict, path);
    if (val == null) return;

    const tag = el.tagName.toUpperCase();
    const isFormContainer =
      /^(SELECT|OPTGROUP|OPTION|INPUT|TEXTAREA|BUTTON)$/i.test(tag);

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
          // Don’t touch children; set header label only
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
      case "title": {
        el.setAttribute(target, val);
        break;
      }

      default: {
        // Unknown target → safe text behavior
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

  applyLiteralTranslations(root);
}

/** Change language and re-translate the live DOM */
export async function setLanguage(lang) {
  const next = lang || getLanguage();
  if (next === CACHE.lang) {
    localStorage.setItem("prefLang", next);
    return;
  }
  localStorage.setItem("prefLang", next);
  await loadTranslations(next);
  applyTranslations(document);
  window.dispatchEvent(
    new CustomEvent("i18n:languageChanged", { detail: { lang: next } }),
  );
  document.dispatchEvent(
    new CustomEvent("language:updated", { detail: { lang: next } }),
  );

  try {
    window.ARCLIGHT?.saveProfile?.({ language: next });
  } catch {}
}

/** Boot */
(async () => {
  const lang = getLanguage();
  await loadTranslations(lang);
  applyTranslations(document);

  // Re-apply whenever a new page fragment is inserted or shown
  window.addEventListener("page:loaded", () => applyTranslations(document));
  document.addEventListener("page:shown", () => applyTranslations(document));
})();

// i18n.js (near bottom; only if you don't already expose these)
window.I18N = window.I18N || {};
window.I18N.setLanguage = window.I18N.setLanguage || setLanguage; // your existing function
window.I18N.applyTranslations =
  window.I18N.applyTranslations || applyTranslations; // your existing function
