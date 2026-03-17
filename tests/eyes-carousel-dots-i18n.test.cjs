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
import { readFileSync } from "fs";
import path from "path";

const ENGLISH_DICT = {
  coreExaminationTitle: "Core Examination",
  diseaseTitle: "Conditions",
  primaryEyeCareProceduresTitle: "Workshops",
  extendedExaminationTitle: "Extended Examination",
  toolsTitle: "Tools and Kits",
  seeAll: "See all >",
};

const KOREAN_DICT = {
  coreExaminationTitle: "핵심 검사",
  diseaseTitle: "질환",
  primaryEyeCareProceduresTitle: "워크숍",
  extendedExaminationTitle: "확장 검사",
  toolsTitle: "도구 및 키트",
  seeAll: "전체 보기 >",
};

describe("Eyes carousel header i18n", () => {
  let fetchSpy;

  beforeEach(() => {
    jest.resetModules();
    delete window.I18N;
    delete window.__arclightI18nLifecycleBound;

    localStorage.clear();
    document.documentElement.lang = "en";

    const htmlPath = path.join(process.cwd(), "public", "html", "eyes.html");
    document.body.innerHTML = readFileSync(htmlPath, "utf8");

    const firstHeader = document.querySelector("#eyesCatalogPage .catalog-h2");
    const dots = document.createElement("span");
    dots.className = "carousel-dots";
    dots.innerHTML = '<button class="dot active" type="button"></button>';
    firstHeader.insertBefore(dots, firstHeader.querySelector(".see-all"));

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

  it("preserves see-all and injected carousel dots across translation passes", async () => {
    localStorage.setItem("prefLang", "ko");

    let i18n;
    await jest.isolateModulesAsync(async () => {
      i18n = await import("../public/js/i18n.js");
    });

    await i18n.setLanguage("ko");
    i18n.applyTranslations(document);

    const firstHeader = document.querySelector("#eyesCatalogPage .catalog-h2");
    const title = firstHeader.querySelector(
      "[data-i18n='coreExaminationTitle']",
    );
    const seeAll = firstHeader.querySelector(".see-all");
    const dots = firstHeader.querySelector(".carousel-dots");

    expect(title?.textContent).toBe("핵심 검사");
    expect(seeAll?.textContent).toBe("전체 보기 >");
    expect(dots).not.toBeNull();
    expect(dots?.querySelector(".dot.active")).not.toBeNull();
  });
});
