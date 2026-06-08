/**
 * @jest-environment jsdom
 */

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import fs from "fs";
import path from "path";

const VIDEOS_HTML = fs.readFileSync(
  path.join(process.cwd(), "public", "html", "videos.html"),
  "utf8",
);

function buildTemplates() {
  return `
    <template id="quizLauncherLayoutTemplate">
      <div class="quiz-container">
        <div class="quiz-header small">
          <div class="quiz-header-row centered">
            <button id="backToVideoBtn" class="back-icon" title="Go back"></button>
            <h2>Quiz</h2>
          </div>
        </div>
        <div class="quiz-scroll"><form id="quizForm"></form></div>
        <div class="quiz-footer">
          <button type="submit" form="quizForm" class="start-btn">Check Answer</button>
        </div>
        <div id="quizModal" class="quiz-modal hidden">
          <div class="quiz-modal-content">
            <p id="quizScoreText"></p>
            <button id="seeWhyBtn">Check Answer</button>
          </div>
        </div>
      </div>
    </template>
    <template id="quizLauncherBlockTemplate">
      <div class="quiz-block">
        <div class="quiz-question-heading">
          <span class="quiz-question-badge" aria-hidden="true"></span>
          <p class="quiz-question"></p>
        </div>
        <div class="quiz-options"></div>
        <p class="answer" style="display: none"></p>
      </div>
    </template>
    <template id="quizLauncherOptionTemplate">
      <label class="radio-label">
        <input type="radio" />
        <span class="quiz-option-text"></span>
      </label>
    </template>
  `;
}

describe("Interactive Learning topic quiz pages", () => {
  beforeEach(() => {
    jest.resetModules();
    localStorage.clear();
    sessionStorage.clear();
    window.I18N = { applyTranslations: jest.fn() };
  });

  it("renders topic hubs with simulator and quiz lesson rows", () => {
    document.body.innerHTML = VIDEOS_HTML;

    const topics = [
      {
        hub: "cataractPage",
        simulator: "cataractSimulatorPage",
        quizzes: [
          "cataractPrimaryQuizPage",
          "cataractIntermediateQuizPage",
          "cataractAdvancedQuizPage",
        ],
      },
      {
        hub: "glaucomaInteractivePage",
        simulator: "glaucomaSimulatorPage",
        quizzes: [
          "glaucomaPrimaryQuizPage",
          "glaucomaIntermediateQuizPage",
          "glaucomaAdvancedQuizPage",
        ],
      },
      {
        hub: "fundalReflexInteractivePage",
        simulator: "fundalReflexSimulatorPage",
        quizzes: [
          "fundalReflexPrimaryQuizPage",
          "fundalReflexIntermediateQuizPage",
          "fundalReflexAdvancedQuizPage",
        ],
      },
      {
        hub: "squintPalsyPage",
        simulator: "squintPalsySimulatorPage",
        quizzes: [
          "squintPrimaryQuizPage",
          "squintIntermediateQuizPage",
          "squintAdvancedQuizPage",
        ],
      },
      {
        hub: "morphPage",
        simulator: "morphSimulatorPage",
        quizzes: [],
      },
    ];

    topics.forEach(({ hub, simulator, quizzes }) => {
      const hubPage = document.getElementById(hub);
      expect(hubPage).not.toBeNull();
      expect(hubPage.classList.contains("interactive-topic-page")).toBe(true);
      expect(hubPage.classList.contains("has-eyes-topbar")).toBe(true);
      const simulatorRow = hubPage.querySelector(
        `.lesson-row--interactive[data-target="${simulator}"]`,
      );
      expect(simulatorRow).not.toBeNull();
      expect(
        simulatorRow.querySelector(".lesson-type").textContent.trim(),
      ).toBe("Simulator");
      expect(document.getElementById(simulator)).not.toBeNull();

      quizzes.forEach((quizPageId) => {
        const quizRow = hubPage.querySelector(
          `.lesson-row--quiz[data-target="${quizPageId}"]`,
        );
        expect(quizRow).not.toBeNull();
        expect(quizRow.querySelector(".lesson-type").textContent.trim()).toBe(
          "Quiz",
        );
      });
    });

    const fundalPrimaryTargets = Array.from(
      document.querySelectorAll(
        "#fundalReflexInteractivePage .pupil-level--primary .lesson-row",
      ),
    ).map((row) => row.getAttribute("data-target"));
    expect(fundalPrimaryTargets).toEqual([
      "fundalExamPage",
      "fundalReflexExaminationScrollPage",
      "fundalReflexPdfPage",
      "fundalStillPage",
      "fundalRealPage",
      "fundalReflexSimulatorPage",
      "fundalReflexPrimaryQuizPage",
    ]);

    const ophthalmoscopyPrimaryTargets = Array.from(
      document.querySelectorAll(
        "#directOphthalmoscopy .pupil-level--primary .lesson-row",
      ),
    ).map((row) => row.getAttribute("data-target"));
    expect(ophthalmoscopyPrimaryTargets).toEqual([
      "directOphthalmoscopyVideoPage",
      "directOphthalmoscopyQuizPage",
      "directOphthalmoscopyPdfPage",
    ]);
    const ophthalmoscopyIntermediateTargets = Array.from(
      document.querySelectorAll(
        "#directOphthalmoscopy .pupil-level--intermediate .lesson-row",
      ),
    ).map((row) => row.getAttribute("data-target"));
    expect(ophthalmoscopyIntermediateTargets).toEqual(["morphSimulatorPage"]);
    expect(
      document
        .querySelector(
          '#directOphthalmoscopy .lesson-row[data-target="morphSimulatorPage"] .lesson-type',
        )
        .textContent.trim(),
    ).toBe("Morph");
    expect(
      document.querySelectorAll("#directOphthalmoscopy .pupils-dots"),
    ).toHaveLength(1);

    const interactiveLearningTargets = {
      Cataract: "cataractSimulatorPage",
      Glaucoma: "glaucomaSimulatorPage",
      "Fundal Reflex": "fundalReflexSimulatorPage",
      "Back of the Eye": "morphSimulatorPage",
    };
    Object.entries(interactiveLearningTargets).forEach(([title, target]) => {
      const row = Array.from(
        document.querySelectorAll("#interactiveLearningPage .lesson-row"),
      ).find(
        (candidate) =>
          candidate.querySelector(".lesson-type")?.textContent.trim() === title,
      );
      expect(row).not.toBeNull();
      expect(row.getAttribute("data-target")).toBe(target);
      expect(row.closest(".module-card")?.getAttribute("data-page")).toBe(
        target,
      );
    });

    const glaucomaCard = document.querySelector("#diseasesPage #glaucomaCard");
    expect(glaucomaCard).not.toBeNull();
    expect(glaucomaCard.dataset.page).toBe("glaucomaInteractivePage");
    expect(glaucomaCard.classList.contains("module-card--coming-soon")).toBe(
      false,
    );
    expect(glaucomaCard.querySelector(".status")).toBeNull();
  });

  it("maps Eyes carousel cards to the topic hubs", async () => {
    const { EYES_INDEX } = await import("../public/js/catalog-index.js");

    expect(EYES_INDEX["Fundal Reflex"]).toBe("fundalReflexInteractivePage");
    expect(EYES_INDEX.Glaucoma).toBe("glaucomaInteractivePage");
  });

  it("builds native quiz pages, marks answers, and writes lesson progress", async () => {
    document.body.innerHTML = `<div id="videos"></div>${buildTemplates()}`;

    const {
      getInteractiveLearningQuiz,
      initializeInteractiveLearningTopicQuizzes,
    } = await import("../public/js/interactiveLearningTopicQuizzes.js");

    const shownPages = [];
    initializeInteractiveLearningTopicQuizzes({
      showPage: (pageId) => shownPages.push(pageId),
    });

    const config = getInteractiveLearningQuiz("cataractPrimaryQuizPage");
    const page = document.getElementById("cataractPrimaryQuizPage");
    expect(page).not.toBeNull();
    expect(page.querySelector(".eyes-topbar")).not.toBeNull();
    expect(page.querySelector(".quiz-header")).toBeNull();
    expect(page.dataset.quizLevel).toBe("primary");
    expect(page.querySelectorAll(".quiz-block")).toHaveLength(
      config.questions.length,
    );
    expect(page.querySelector(".quiz-question-badge").textContent).toBe("01");

    config.questions.forEach((question, index) => {
      const input = page.querySelector(
        `input[name="q${index}"][value="${question.answerIndex}"]`,
      );
      input.checked = true;
    });

    page
      .querySelector("form")
      .dispatchEvent(new Event("change", { bubbles: true }));
    expect(
      JSON.parse(localStorage.getItem("lessonProgress:cataractPrimaryQuizPage"))
        .percent,
    ).toBe(95);

    page
      .querySelector("form")
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    const stored = JSON.parse(
      localStorage.getItem("lessonProgress:cataractPrimaryQuizPage"),
    );
    expect(stored.percent).toBe(100);
    expect(page.querySelector(".quiz-modal").classList.contains("hidden")).toBe(
      false,
    );
    expect(page.querySelector(".quiz-modal-content p").textContent).toContain(
      `You got ${config.questions.length} out of ${config.questions.length} correct.`,
    );
    expect(page.querySelectorAll("label.correct")).toHaveLength(
      config.questions.length,
    );

    page.querySelector(".quiz-modal-content button").click();
    expect(page.querySelector(".answer").style.display).toBe("block");

    expect(shownPages).toEqual([]);
  });
});
