/**
 * @jest-environment jsdom
 */

import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  jest,
} from "@jest/globals";

const ENGLISH_DICT = {
  auto: {
    childhoodeyescreeningworkshop: {
      childhood_eye_screening: "Childhood Eye Screening",
    },
  },
  i18nLiteral: {
    "Close ^": "Close ^",
  },
};

const KOREAN_DICT = {
  i18nLiteral: {
    "Close ^": "닫기 ^",
  },
};

describe("i18n runtime regressions", () => {
  let fetchSpy;

  beforeEach(() => {
    jest.resetModules();
    delete window.I18N;
    delete window.__arclightI18nLifecycleBound;

    localStorage.clear();
    document.documentElement.lang = "en";
    document.body.innerHTML = `
      <div
        id="workshopTitle"
        data-i18n="auto.childhoodeyescreeningworkshop.childhood_eye_screening"
      >
        Childhood Eye Screening
      </div>
      <span id="closeToggle">Close ^</span>
    `;

    fetchSpy = jest.spyOn(global, "fetch").mockImplementation(async (url) => {
      const href = String(url);
      if (href.endsWith("/translation/english.json")) {
        return {
          ok: true,
          async json() {
            return ENGLISH_DICT;
          },
        };
      }

      if (href.endsWith("/translation/korean.json")) {
        return {
          ok: true,
          async json() {
            return KOREAN_DICT;
          },
        };
      }

      throw new Error(`Unexpected fetch in test: ${href}`);
    });
  });

  afterEach(() => {
    fetchSpy?.mockRestore();
  });

  it("falls back to English when the selected language is missing a page key", async () => {
    localStorage.setItem("prefLang", "ko");

    let i18n;
    await jest.isolateModulesAsync(async () => {
      i18n = await import("../public/js/i18n.js");
    });

    await i18n.setLanguage("ko");

    expect(document.documentElement.lang).toBe("ko");
    expect(document.getElementById("workshopTitle").textContent).toBe(
      "Childhood Eye Screening",
    );
  });

  it("applies literal translations for dynamically rendered text in the current language", async () => {
    localStorage.setItem("prefLang", "ko");

    let i18n;
    await jest.isolateModulesAsync(async () => {
      i18n = await import("../public/js/i18n.js");
    });

    await i18n.setLanguage("ko");
    i18n.applyTranslations(document);

    expect(document.getElementById("closeToggle").textContent).toBe("닫기 ^");
  });
});
