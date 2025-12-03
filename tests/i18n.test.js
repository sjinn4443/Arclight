/**
 * @jest-environment jsdom
 *
 * Improved i18n test:
 * - Tests ALL supported languages from your language list
 * - Tests that changing language updates every i18n-bound element in the UI
 * - Preserves fallback behaviour checks
 */

// 1) Try to pull your real supported language list.
//    If this path isn’t right for your repo, change it to wherever your
//    supported languages live, eg:
//      "../src/i18n/languages"
//      "../src/i18n/config"
//      "../src/constants/languages"
let supportedLanguages;
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  supportedLanguages = require("../src/i18n/languages").supportedLanguages;
} catch (e) {
  // Fallback for the test-only zip.
  // Replace this with your real list if you don’t have an export to import.
  supportedLanguages = [
    "en",
    "es",
    "fr",
    "pt",
    "sw",
    "ar",
    "hi",
    "bn",
    "zh",
    "ko",
  ];
}

// 2) Mock translations for every language in supportedLanguages.
//    We auto-generate simple per-language strings so the test is scalable.
//    In your real app tests, you can instead import actual locale JSONs.
const baseKeys = ["greeting", "farewell", "cta_start", "cta_next"];
const translations = Object.fromEntries(
  supportedLanguages.map((lang) => [
    lang,
    {
      greeting: lang === "en" ? "Hello" : `[${lang}] Hello`,
      farewell: lang === "en" ? "Goodbye" : `[${lang}] Goodbye`,
      cta_start: lang === "en" ? "Start" : `[${lang}] Start`,
      cta_next: lang === "en" ? "Next" : `[${lang}] Next`,
    },
  ]),
);

// 2a) Deliberately remove one key from one non-English language
//     so we can still validate fallback-to-English.
const nonEnglish = supportedLanguages.find((l) => l !== "en");
if (nonEnglish) delete translations[nonEnglish].farewell;

// Simple i18n object mirroring your original test.
let currentLang = "en";
const i18n = {
  t: (key) => {
    const inLang = translations[currentLang] && translations[currentLang][key];
    const inEn = translations.en && translations.en[key];
    return inLang || inEn || key;
  },
  setLang: (lang) => {
    currentLang = lang;
  },
};

// Helper that applies translations to any element with data-i18n-key
function applyTranslations(root = document) {
  const nodes = root.querySelectorAll("[data-i18n-key]");
  nodes.forEach((el) => {
    const key = el.getAttribute("data-i18n-key");
    el.textContent = i18n.t(key);
  });
}

describe("i18n – full language coverage + UI update on language change", () => {
  beforeEach(() => {
    i18n.setLang("en");
    document.body.innerHTML = `
      <main>
        <h1 id="greeting" data-i18n-key="greeting"></h1>
        <p id="farewell" data-i18n-key="farewell"></p>
        <button id="start" data-i18n-key="cta_start"></button>
        <button id="next" data-i18n-key="cta_next"></button>
      </main>
    `;
    applyTranslations();
  });

  it("tests every supported language returns correct translations when present", () => {
    supportedLanguages.forEach((lang) => {
      i18n.setLang(lang);
      applyTranslations();

      baseKeys.forEach((key) => {
        const expected =
          (translations[lang] && translations[lang][key]) ||
          (translations.en && translations.en[key]) ||
          key;

        const el = document.querySelector(`[data-i18n-key="${key}"]`);
        expect(el).not.toBeNull();
        expect(el.textContent).toBe(expected);
      });
    });
  });

  it("updates all i18n-bound UI strings when user changes language", () => {
    // Start in English
    i18n.setLang("en");
    applyTranslations();

    const snapshotEn = baseKeys.map((k) => i18n.t(k));
    const domEn = baseKeys.map(
      (k) => document.querySelector(`[data-i18n-key="${k}"]`).textContent,
    );

    expect(domEn).toEqual(snapshotEn);

    // Switch to each other language and make sure *every* element updates
    supportedLanguages
      .filter((lang) => lang !== "en")
      .forEach((lang) => {
        i18n.setLang(lang);
        applyTranslations();

        baseKeys.forEach((key, idx) => {
          const expected =
            (translations[lang] && translations[lang][key]) ||
            translations.en[key] ||
            key;

          const el = document.querySelector(`[data-i18n-key="${key}"]`);
          expect(el.textContent).toBe(expected);

          // And it should no longer match the English snapshot unless fallback
          if (translations[lang] && translations[lang][key]) {
            expect(el.textContent).not.toBe(snapshotEn[idx]);
          }
        });
      });
  });

  it("falls back to English when a key is missing in current language", () => {
    if (!nonEnglish) return;

    i18n.setLang(nonEnglish);
    applyTranslations();

    // We removed farewell from nonEnglish above.
    expect(i18n.t("farewell")).toBe(translations.en.farewell);

    const farewellEl = document.querySelector(`[data-i18n-key="farewell"]`);
    expect(farewellEl.textContent).toBe(translations.en.farewell);
  });

  it("returns the key itself if no translation exists anywhere", () => {
    i18n.setLang("en");
    applyTranslations();

    expect(i18n.t("nonexistent_key")).toBe("nonexistent_key");
  });
});
