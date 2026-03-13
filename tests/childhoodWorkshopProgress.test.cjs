/**
 * @jest-environment jsdom
 */

import { beforeEach, describe, expect, it, jest } from "@jest/globals";

let updateChildhoodWorkshopProgressBars;

function setProgress(target, percent, updatedAt) {
  localStorage.setItem(
    `childhoodWorkshop:progress:${target}`,
    JSON.stringify({ percent, updatedAt }),
  );
}

function buildLessonRow({
  target = "",
  id = "",
  className = "lesson-row",
  extraAttrs = "",
} = {}) {
  const targetAttr = target ? `data-target="${target}"` : "";
  const idAttr = id ? `id="${id}"` : "";
  return `
    <div class="${className}" ${idAttr} ${targetAttr} ${extraAttrs}>
      <div class="lesson-main">
        <div class="lesson-top">
          <span class="lesson-type">Lesson</span>
          <span class="lesson-meta"></span>
        </div>
        <div class="lesson-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
          <div class="lesson-progress__fill" style="width: 0%"></div>
        </div>
      </div>
    </div>
  `;
}

describe("childhood workshop nested folder completion", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <div id="childhoodEyeScreeningWorkshopPage">
        <div id="childhoodWorkshopFolders">
          <div class="lesson-row childhood-folder-row" data-folder="childhoodEyeScreening">
            <div class="lesson-main">
              <div class="lesson-top">
                <span class="lesson-type">Childhood Eye Screening</span>
                <span class="lesson-meta"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="childhood-section-card" data-section="childhoodEyeScreening">
          ${buildLessonRow({ target: "fundalReflexPdfPage" })}
          ${buildLessonRow({
            className: "lesson-row lesson-row--folder",
            id: "fundalReflexFolderRow",
            extraAttrs:
              'data-folder-progress-key="fundalReflex" aria-controls="fundalReflexSubRows"',
          })}
          <div id="fundalReflexSubRows">
            ${buildLessonRow({ target: "childhoodFundalPreparationPage" })}
            ${buildLessonRow({ target: "childhoodFundalExaminationPage" })}
          </div>
        </div>
      </div>
    `;
  });

  beforeEach(async () => {
    jest.resetModules();
    await jest.isolateModulesAsync(async () => {
      ({ updateChildhoodWorkshopProgressBars } =
        await import("../public/js/childhoodWorkshopProgress.js"));
    });
  });

  it("shows star and completion date for nested folders once every inner lesson is complete", () => {
    setProgress(
      "childhoodFundalPreparationPage",
      100,
      Date.UTC(2026, 2, 12, 12, 0, 0),
    );

    updateChildhoodWorkshopProgressBars();

    const folderRow = document.getElementById("fundalReflexFolderRow");
    expect(folderRow.classList.contains("is-complete")).toBe(false);
    expect(folderRow.querySelector(".lesson-meta").innerHTML).toBe("");
    expect(
      folderRow.querySelector(".childhood-folder-complete-rank-date"),
    ).toBeNull();

    setProgress(
      "childhoodFundalExaminationPage",
      100,
      Date.UTC(2026, 2, 13, 12, 0, 0),
    );

    updateChildhoodWorkshopProgressBars();

    expect(folderRow.classList.contains("is-complete")).toBe(true);
    expect(folderRow.querySelector(".lesson-meta").innerHTML).toContain(
      "childhood-folder-complete-star",
    );
    expect(
      folderRow.querySelector(".childhood-folder-complete-rank-date")
        ?.textContent,
    ).toBe("1st 13.03.2026");

    expect(
      JSON.parse(
        localStorage.getItem(
          "childhoodWorkshop:folderCompletedAt:fundalReflex",
        ),
      ),
    ).toEqual({
      count: 1,
      completedAt: Date.UTC(2026, 2, 13, 12, 0, 0),
    });
  });
});
