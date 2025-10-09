/**
 * Lightweight i18n helper.
 * Usage in HTML: add data-i18n="section.key[:target]"
 *   - target (optional) is one of: text (default), html, placeholder, value, aria-label, title
 * Example: <h1 data-i18n="onboarding.title"></h1>
 *          <input data-i18n="onboarding.username_placeholder:placeholder" />
 */

const LANG_ALIAS = {
  en: "english",
  fr: "french",
  ko: "korean",
  pt: "portuguese",
  es: "spanish",
  sw: "swahili",
};

const CACHE = {
  lang: null,
  dict: null,
};

export function getLanguage() {
  return localStorage.getItem("prefLang") || "en";
}

export async function setLanguage(lang) {
  localStorage.setItem("prefLang", lang);
  await loadTranslations(lang);
  applyTranslations(document);
}

export async function loadTranslations(lang = getLanguage()) {
  const alias = LANG_ALIAS[lang] || lang;
  // English is our default hard-coded UI; no file needed.
  if (alias === "english") {
    CACHE.lang = "en";
    CACHE.dict = null;
    return;
  }
  const res = await fetch(`translation/${alias}.json`, { cache: "reload" });
  if (!res.ok) {
    console.warn("[i18n] Failed to load translation file:", alias);
    CACHE.lang = "en";
    CACHE.dict = null;
    return;
  }
  CACHE.lang = lang;
  CACHE.dict = await res.json();
}

// Get nested value like "onboarding.title"
function get(dict, path) {
  return path
    .split(".")
    .reduce((a, k) => (a && a[k] != null ? a[k] : undefined), dict);
}

export function applyTranslations(root = document) {
  // Nothing to do if we’re “English” (no dict)
  if (!CACHE.dict) return;

  const nodes = root.querySelectorAll("[data-i18n]");
  nodes.forEach((el) => {
    const raw = el.getAttribute("data-i18n").trim();
    if (!raw) return;

    // Supports "section.key:target" (target is optional)
    const [path, target = "text"] = raw.split(":");
    const val = get(CACHE.dict, path);
    if (val == null) return;

    switch (target) {
      case "html":
        el.innerHTML = val;
        break;
      case "placeholder":
        el.setAttribute("placeholder", val);
        break;
      case "value":
        el.setAttribute("value", val);
        break;
      case "aria-label":
        el.setAttribute("aria-label", val);
        break;
      case "title":
        el.setAttribute("title", val);
        break;
      default:
        // "text"
        el.textContent = val;
    }
  });
}

// Boot: load saved language, then translate initial and future pages
(async () => {
  const lang = getLanguage();
  await loadTranslations(lang);
  applyTranslations(document);

  // Re-apply on every page show (navigation.js fires this)
  document.addEventListener("page:shown", () => applyTranslations(document));
})();
