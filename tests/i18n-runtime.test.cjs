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
  onboarding: {
    practice_level_placeholder: "Years of experience",
    help: "Your &#39;experience&#39;<br />Choose a range",
  },
  auto: {
    childhoodeyescreeningworkshop: {
      childhood_eye_screening: "Childhood Eye Screening",
    },
  },
  i18nExtra: {
    menu_aria_label: "Menu",
  },
  i18nLiteral: {
    "Close ^": "Close ^",
  },
};

const KOREAN_DICT = {
  onboarding: {
    practice_level_placeholder: "경력 연수",
  },
  i18nExtra: {
    menu_aria_label: "메뉴",
  },
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
      <button id="legacyMenuBtn" aria-label="Menu">☰</button>
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

  it("applies common fallback translations for legacy aria labels", async () => {
    localStorage.setItem("prefLang", "ko");

    let i18n;
    await jest.isolateModulesAsync(async () => {
      i18n = await import("../public/js/i18n.js");
    });

    await i18n.setLanguage("ko");
    i18n.applyTranslations(document);

    expect(
      document.getElementById("legacyMenuBtn").getAttribute("aria-label"),
    ).toBe("메뉴");
  });

  it("leaves translated experience options and literal text untouched on repeated passes", async () => {
    const i18n = await import("../public/js/i18n.js");
    document.body.innerHTML = `
      <select id="experience">
        <option value="" data-i18n="onboarding.practice_level_placeholder">Years of experience</option>
        <option value="0-2">0-2</option>
        <option value="2-5">2-5</option>
      </select>
      <span>Close ^</span>
      <div data-i18n="onboarding.help:html"></div>
      <button data-i18n="i18nExtra.menu_aria_label:aria-label">Menu</button>
      <select data-i18n="onboarding.practice_level_placeholder:placeholder">
        <option value="">Choose</option>
      </select>`;
    await i18n.setLanguage("en");
    const select = document.getElementById("experience");
    select.value = "2-5";
    select.focus();
    const placeholderText = select.options[0].firstChild;
    const observer = new MutationObserver(() => {});
    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true,
    });
    try {
      for (let pass = 0; pass < 3; pass += 1) {
        i18n.applyTranslations(document);
      }
      expect(observer.takeRecords()).toHaveLength(0);
      expect(select.options[0].firstChild).toBe(placeholderText);
      expect(select.value).toBe("2-5");
      expect(document.activeElement).toBe(select);
    } finally {
      observer.disconnect();
    }

    await i18n.setLanguage("ko");
    expect(select.options[0].textContent).toBe("경력 연수");
    expect(select.value).toBe("2-5");

    const newLabel = document.createElement("span");
    newLabel.setAttribute("data-i18n", "onboarding.practice_level_placeholder");
    document.body.appendChild(newLabel);
    i18n.applyTranslations(newLabel);
    expect(newLabel.textContent).toBe("경력 연수");
  });
});
