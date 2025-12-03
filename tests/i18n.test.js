/**
 * @jest-environment jsdom
 */

// Mock translation files
const translations = {
  en: {
    greeting: "Hello",
    farewell: "Goodbye",
  },
  es: {
    greeting: "Hola",
  },
};

let currentLang = "en";
const i18n = {
  t: (key) => {
    return translations[currentLang][key] || translations["en"][key];
  },
  setLang: (lang) => {
    currentLang = lang;
  },
};

describe("i18n Fallback", () => {
  beforeEach(() => {
    i18n.setLang("en");
  });

  it("should use the correct translation when available", () => {
    expect(i18n.t("greeting")).toBe("Hello");
    i18n.setLang("es");
    expect(i18n.t("greeting")).toBe("Hola");
    //add more lang
  });

  it("should fall back to English when a translation key is missing", () => {
    i18n.setLang("es");
    expect(i18n.t("farewell")).toBe("Goodbye");
  });

  it("should return the key itself if no translation is found", () => {
    const i18nStrict = {
      t: (key) => {
        return translations[currentLang][key] || key;
      },
    };
    expect(i18nStrict.t("nonexistent")).toBe("nonexistent");
  });
});
