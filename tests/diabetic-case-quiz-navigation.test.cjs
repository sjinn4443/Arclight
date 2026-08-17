const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const repoRoot = path.resolve(__dirname, "..");

describe("Diabetic case quiz navigation", () => {
  const videosHtml = fs.readFileSync(
    path.join(repoRoot, "public/html/videos.html"),
    "utf8",
  );
  const workshopSource = fs.readFileSync(
    path.join(repoRoot, "public/js/diabeticRetinopathyWorkshop.js"),
    "utf8",
  );
  const nextFlowSource = fs.readFileSync(
    path.join(repoRoot, "public/js/diabeticWorkshopNextFlow.js"),
    "utf8",
  );
  const pagesCss = fs.readFileSync(
    path.join(repoRoot, "public/style/pages.css"),
    "utf8",
  );
  const document = new JSDOM(videosHtml).window.document;

  test("shows three direct question buttons instead of previous and next", () => {
    const buttons = Array.from(
      document.querySelectorAll(
        "#diabeticCaseQuizPage [data-diabetic-case-question]",
      ),
    );

    expect(buttons).toHaveLength(3);
    expect(buttons.map((button) => button.textContent.trim())).toEqual([
      "1A",
      "1B",
      "1C",
    ]);
    expect(document.querySelector("#diabeticCaseQuizPrevious")).toBeNull();
    expect(document.querySelector("#diabeticCaseQuizNext")).toBeNull();
  });

  test("updates the case number and selects a question directly", () => {
    expect(workshopSource).toContain(
      "const label = `${state.caseIndex + 1}${questionLetter}`",
    );
    expect(workshopSource).toContain("state.questionIndex = index");
  });

  test("places the quiz count in the question label position without a progress bar", () => {
    const page = document.querySelector("#diabeticCaseQuizPage");

    expect(page.querySelector("#diabeticCaseQuizProgress")).toBeNull();
    expect(page.querySelector("#diabeticCaseQuizQuestionLabel")).toBeNull();
    expect(
      page.querySelector("#diabeticCaseQuizProgressLabel")?.textContent.trim(),
    ).toBe("Quiz 1 of 3");
  });

  test("does not mark answered question buttons for green highlighting", () => {
    expect(pagesCss).not.toContain(
      ".diabetic-case-quiz__nav-button.is-answered",
    );
  });

  test("lets shared navigation history handle the quiz back button", () => {
    expect(nextFlowSource).toContain(
      'if (visibleId === "diabeticCaseQuizPage") return false;',
    );
  });
});
