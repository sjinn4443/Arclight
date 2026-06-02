/**
 * @jest-environment jsdom
 */

import { beforeEach, describe, expect, it, jest } from "@jest/globals";

let initializeDiabeticWorkshopProgressInfra;
let updateDiabeticWorkshopProgressBars;

function setProgress(target, percent, updatedAt = Date.now()) {
  localStorage.setItem(
    `diabeticWorkshop:progress:${target}`,
    JSON.stringify({ percent, updatedAt }),
  );
}

function buildLessonRow(target) {
  return `
    <div class="lesson-row" data-target="${target}">
      <div class="lesson-main">
        <div class="lesson-top">
          <span class="lesson-type">${target}</span>
          <span class="lesson-meta"></span>
        </div>
        <div class="lesson-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
          <div class="lesson-progress__fill" style="width: 0%"></div>
        </div>
      </div>
    </div>
  `;
}

describe("diabetic workshop folder completion", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <div id="diabeticRetinopathyWorkshopPage">
        <div id="diabeticWorkshopFolders">
          <div class="lesson-row lesson-row--folder diabetic-folder-row" id="topFolder" data-folder="introduction">
            <div class="thumb" style="background-image: url('/images/icon/eyes/moduleicons/intermediate_folder.webp')"></div>
            <div class="lesson-main">
              <div class="lesson-top">
                <span class="lesson-type">Introduction</span>
                <span class="lesson-meta"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="diabetic-section-card" data-section="introduction">
          ${buildLessonRow("diabeticIntroOne")}
          ${buildLessonRow("diabeticIntroTwo")}

          <div class="lesson-row lesson-row--folder diabetic-nested-folder-row" id="nestedFolder" data-nested-folder="direct">
            <div class="thumb" style="background-image: url('/images/icon/eyes/moduleicons/advanced_folder.webp')"></div>
            <div class="lesson-main">
              <div class="lesson-top">
                <span class="lesson-type">Direct Ophthalmoscopy</span>
                <span class="lesson-meta"></span>
              </div>
            </div>
          </div>
          <div class="diabetic-nested-section-card" data-nested-section="direct">
            ${buildLessonRow("diabeticDirectOne")}
            ${buildLessonRow("diabeticDirectTwo")}
          </div>
        </div>
      </div>
    `;
  });

  beforeEach(async () => {
    jest.resetModules();
    await jest.isolateModulesAsync(async () => {
      ({
        initializeDiabeticWorkshopProgressInfra,
        updateDiabeticWorkshopProgressBars,
      } = await import("../public/js/diabeticWorkshopProgress.js"));
    });
  });

  it("shows title ticks on completed top-level and nested folders", () => {
    setProgress("diabeticIntroOne", 100, 1);
    setProgress("diabeticDirectOne", 100, 1);

    updateDiabeticWorkshopProgressBars();

    expect(
      document.getElementById("topFolder").classList.contains("is-complete"),
    ).toBe(false);
    expect(
      document.getElementById("nestedFolder").classList.contains("is-complete"),
    ).toBe(false);

    setProgress("diabeticIntroTwo", 100, 2);
    setProgress("diabeticDirectTwo", 100, 2);

    updateDiabeticWorkshopProgressBars();

    expect(
      document.getElementById("topFolder").classList.contains("is-complete"),
    ).toBe(true);
    expect(
      document.querySelector("#topFolder .lesson-type > .lesson-complete-tick"),
    ).not.toBeNull();
    expect(
      document
        .getElementById("topFolder")
        .style.getPropertyValue("--lesson-complete-color"),
    ).toBe("#f25600");
    expect(
      document.getElementById("nestedFolder").classList.contains("is-complete"),
    ).toBe(true);
    expect(
      document.querySelector(
        "#nestedFolder .lesson-type > .lesson-complete-tick",
      ),
    ).not.toBeNull();
    expect(
      document
        .getElementById("nestedFolder")
        .style.getPropertyValue("--lesson-complete-color"),
    ).toBe("#e41e26");
  });

  it("stores partial progress for scroll lessons before the bottom is reached", () => {
    const originalRaf = global.requestAnimationFrame;
    global.requestAnimationFrame = (callback) => {
      callback();
      return 1;
    };

    const pageContent = document.createElement("div");
    pageContent.id = "page-content";
    Object.defineProperty(pageContent, "scrollTop", {
      configurable: true,
      value: 500,
    });
    Object.defineProperty(pageContent, "clientHeight", {
      configurable: true,
      value: 500,
    });
    Object.defineProperty(pageContent, "scrollHeight", {
      configurable: true,
      value: 2000,
    });
    document.body.appendChild(pageContent);

    try {
      initializeDiabeticWorkshopProgressInfra();
      document.dispatchEvent(
        new CustomEvent("page:shown", {
          detail: { id: "diabeticWhatIsDiabetesPage" },
        }),
      );

      expect(
        JSON.parse(
          localStorage.getItem(
            "diabeticWorkshop:progress:diabeticWhatIsDiabetesPage",
          ),
        ).percent,
      ).toBe(50);
    } finally {
      global.requestAnimationFrame = originalRaf;
    }
  });
});
