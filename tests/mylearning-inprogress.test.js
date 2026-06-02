/**
 * @jest-environment jsdom
 */

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

function setProgress(target, percent) {
  localStorage.setItem(
    `childhoodWorkshop:progress:${target}`,
    JSON.stringify({ percent, updatedAt: Date.now() }),
  );
}

function setStoredProgress(prefix, target, percent) {
  localStorage.setItem(
    `${prefix}${target}`,
    JSON.stringify({ percent, updatedAt: Date.now() }),
  );
}

function buildMyLearningShell() {
  document.body.innerHTML = `
    <div class="page active" id="likedPage">
      <div class="ml-tabs">
        <button class="ml-tab" data-ml-tab="inProgress">In progress</button>
        <button class="ml-tab active" data-ml-tab="liked">Liked</button>
        <button class="ml-tab" data-ml-tab="notes">Notes</button>
      </div>
      <input id="mlSearch" type="search" />
      <div class="ml-chip-row">
        <button class="ml-chip active" data-filter="eyes">Eyes</button>
      </div>
      <div id="likedMasonry" class="ml-masonry"></div>
      <template id="mlCardTemplate">
        <button type="button" class="ml-card">
          <img class="ml-card-bg" alt="" />
          <div class="ml-card-header"><h4></h4><span class="ml-heart"></span></div>
          <div class="ml-badges"></div>
        </button>
      </template>
    </div>
  `;
}

function buildChildhoodWorkshopHtml() {
  return `
    <div id="childhoodEyeScreeningWorkshopPage">
      <div class="childhood-section-card" data-section="childhoodEyeScreening">
        <h3>Childhood eye screening workshop</h3>
        <div class="lesson-row lesson-row--pdf" data-target="fundalReflexPdfPage">
          <span class="lesson-type">Fundal reflex PDF</span>
        </div>
        <div
          class="lesson-row lesson-row--folder"
          aria-controls="fundalReflexSubRows"
        >
          <span class="lesson-type">Fundal reflex</span>
        </div>
        <div id="fundalReflexSubRows">
          <div
            class="lesson-row lesson-row--scroll"
            data-target="childhoodFundalPreparationPage"
          >
            <span class="lesson-type">Fundal reflex scrolly</span>
          </div>
          <div class="lesson-row lesson-row--video" data-target="notStartedVideo">
            <span class="lesson-type">Not started video</span>
          </div>
          <div class="lesson-row lesson-row--quiz" data-target="completedQuiz">
            <span class="lesson-type">Completed quiz</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function waitForRender() {
  for (let i = 0; i < 10; i += 1) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    if (document.querySelector(".ml-progress-card")) return;
  }
}

describe("My Learning in-progress tab", () => {
  beforeEach(() => {
    jest.resetModules();
    localStorage.clear();
    sessionStorage.clear();
    buildMyLearningShell();
    localStorage.setItem("myLearningActiveTab", "inProgress");
    setProgress("fundalReflexPdfPage", 25);
    setProgress("childhoodFundalPreparationPage", 60);
    setProgress("notStartedVideo", 0);
    setProgress("completedQuiz", 100);
    setStoredProgress(
      "diabeticWorkshop:progress:",
      "diabeticWhatIsDiabetesPage",
      42,
    );
    setStoredProgress("videoProgress:", "diabeticWhatIsRetinopathyPage", 55);
    window.I18N = { applyTranslations: jest.fn() };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("groups partial progress under the workshop and hides lesson rows until opened", async () => {
    jest.spyOn(global, "fetch").mockImplementation(async (url) => ({
      ok: true,
      text: async () =>
        String(url).includes("childhoodEyeScreeningWorkshop")
          ? buildChildhoodWorkshopHtml()
          : "<div></div>",
    }));

    const { initializeMyLearning } = await import("../public/js/mylearning.js");
    initializeMyLearning();
    await waitForRender();

    const card = document.querySelector(".ml-progress-card");
    expect(card).not.toBeNull();
    expect(document.querySelectorAll(".ml-progress-card")).toHaveLength(2);
    expect(card.querySelector("h4")?.textContent).toBe(
      "Childhood Eye Screening Workshop",
    );
    expect(card.querySelector(".ml-progress-card__meta")?.textContent).toBe(
      "2 in progress",
    );
    expect(card.querySelector(".ml-progress-card__percent")).toBeNull();

    const items = card.querySelector(".ml-progress-items");
    expect(items.hidden).toBe(true);
    expect(card.querySelectorAll(".ml-progress-item")).toHaveLength(2);
    expect(card.textContent).toContain("Fundal reflex PDF");
    expect(card.textContent).toContain("Fundal reflex scrolly");
    expect(card.textContent).not.toContain("Not started video");
    expect(card.textContent).not.toContain("Completed quiz");

    card.querySelector(".ml-progress-card__summary").click();
    expect(items.hidden).toBe(false);

    const diabeticCard = Array.from(
      document.querySelectorAll(".ml-progress-card"),
    ).find((candidate) =>
      candidate.textContent.includes("Diabetic Retinopathy Workshop"),
    );
    expect(diabeticCard).not.toBeNull();
    expect(
      diabeticCard.querySelector(".ml-progress-card__meta")?.textContent,
    ).toBe("2 in progress");
    expect(diabeticCard.querySelector(".ml-progress-card__percent")).toBeNull();
    expect(diabeticCard.textContent).toContain("Diabetic What Is Diabetes");
    expect(diabeticCard.textContent).toContain("Diabetic What Is Retinopathy");
    expect(diabeticCard.textContent).toContain("42%");
    expect(diabeticCard.textContent).toContain("55%");

    const diabeticItems = diabeticCard.querySelectorAll(".ml-progress-item");
    expect(diabeticItems[0].dataset.route).toBe("diabeticRetinopathyWorkshop");
    expect(diabeticItems[0].dataset.subPageId).toBe(
      "diabeticWhatIsDiabetesPage",
    );
  });
});
