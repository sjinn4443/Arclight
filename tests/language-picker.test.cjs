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

describe("language picker modal", () => {
  let fetchSpy;

  beforeEach(() => {
    jest.resetModules();
    localStorage.clear();
    localStorage.setItem("prefLang", "ko");

    document.body.innerHTML = `
      <div id="languagePickerOverlay" hidden>
        <div class="lang-install__modal">
          <button id="closeLangPickerBtn" type="button">x</button>
          <div class="lang-picker">
            <button id="langPickerToggle" type="button" aria-expanded="false">
              <span id="langPickerCurrent">English</span>
            </button>
            <ul id="languagePickerList" hidden></ul>
          </div>
        </div>
      </div>
      <select id="languagePickerSelect">
        <option value="en" data-native="English">English</option>
        <option value="ko" data-native="한국어">Korean</option>
      </select>
      <button id="openLanguageModal" data-route="languageinstall" type="button">
        Open
      </button>
    `;

    window.I18N = {
      getLanguage: jest.fn(() => "ko"),
      setLanguage: jest.fn(async () => {}),
      applyTranslations: jest.fn(),
    };

    fetchSpy = jest.spyOn(global, "fetch").mockImplementation(async () => {
      throw new Error(
        "languageinstall fetch intentionally unavailable in test",
      );
    });
  });

  afterEach(() => {
    fetchSpy?.mockRestore();
  });

  it("shows the currently selected language in the picker trigger", async () => {
    await jest.isolateModulesAsync(async () => {
      await import("../public/js/language-picker.js");
    });

    document.getElementById("openLanguageModal").click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(document.getElementById("languagePickerOverlay").hidden).toBe(false);
    expect(document.getElementById("languagePickerSelect").value).toBe("ko");
    expect(document.getElementById("langPickerCurrent").textContent).toBe(
      "한국어",
    );
  });
});
