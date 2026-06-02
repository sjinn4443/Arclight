/**
 * @jest-environment jsdom
 */

import { beforeEach, describe, expect, it, jest } from "@jest/globals";

function buildRow({ percent = 0, title = "Lesson" } = {}) {
  return `
    <div class="lesson-row">
      <div class="lesson-main">
        <div class="lesson-top">
          <span class="lesson-type">${title}</span>
          <span class="lesson-meta"></span>
        </div>
        <div class="lesson-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
          <div class="lesson-progress__fill" style="width: ${percent}%"></div>
        </div>
      </div>
    </div>
  `;
}

async function importTickModule() {
  jest.resetModules();
  return import("../public/js/lessonCompletionTick.js");
}

describe("lesson completion tick", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("adds the diabetic-style tick beside completed lesson titles", async () => {
    document.body.innerHTML = `
      ${buildRow({ percent: 100, title: "Complete lesson" })}
      ${buildRow({ percent: 80, title: "Incomplete lesson" })}
    `;

    const { syncVisibleLessonCompletionTicks } = await importTickModule();
    syncVisibleLessonCompletionTicks();

    const rows = document.querySelectorAll(".lesson-row");
    expect(rows[0].classList.contains("is-progress-complete")).toBe(true);
    expect(
      rows[0].querySelector(".lesson-type > .lesson-complete-tick"),
    ).not.toBeNull();
    expect(
      rows[0].querySelector(".lesson-type > .lesson-complete-label")
        ?.textContent,
    ).toBe("Complete lesson");
    expect(rows[1].classList.contains("is-progress-complete")).toBe(false);
    expect(rows[1].querySelector(".lesson-complete-tick")).toBeNull();
  });

  it("updates ticks when progress reaches 100 after the row is rendered", async () => {
    document.body.innerHTML = buildRow({ percent: 0 });
    const originalRaf = global.requestAnimationFrame;
    global.requestAnimationFrame = (callback) => setTimeout(callback, 0);

    try {
      const { initializeLessonCompletionTickObserver } =
        await importTickModule();
      initializeLessonCompletionTickObserver();

      const row = document.querySelector(".lesson-row");
      const bar = row.querySelector(".lesson-progress");
      const fill = row.querySelector(".lesson-progress__fill");

      fill.style.width = "100%";
      bar.setAttribute("aria-valuenow", "100");
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(row.classList.contains("is-progress-complete")).toBe(true);
      expect(
        row.querySelector(".lesson-type > .lesson-complete-tick"),
      ).not.toBeNull();
    } finally {
      global.requestAnimationFrame = originalRaf;
    }
  });

  it("resolves folder completion colour from folder icon level", async () => {
    document.body.innerHTML = `
      <div class="lesson-row" id="primaryFolder">
        <div class="thumb" style="background-image: url('/images/icon/eyes/moduleicons/primary_folder.webp')"></div>
      </div>
      <div class="lesson-row" id="intermediateFolder">
        <div class="thumb" style="background-image: url('/images/icon/eyes/moduleicons/intermediate_folder.webp')"></div>
      </div>
      <div class="lesson-row" id="advancedFolder">
        <div class="thumb" style="background-image: url('/images/icon/eyes/moduleicons/advanced_folder.webp')"></div>
      </div>
    `;

    const { getFolderCompletionColourForRow } = await importTickModule();

    expect(
      getFolderCompletionColourForRow(document.getElementById("primaryFolder")),
    ).toBe("#15e115");
    expect(
      getFolderCompletionColourForRow(
        document.getElementById("intermediateFolder"),
      ),
    ).toBe("#f25600");
    expect(
      getFolderCompletionColourForRow(
        document.getElementById("advancedFolder"),
      ),
    ).toBe("#e41e26");
  });
});
