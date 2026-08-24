const fs = require("fs");
const path = require("path");
const repoRoot = path.resolve(__dirname, "..");

describe("Medical Students test quizzes", () => {
  let quizModule;
  let testDocument;
  let testWindow;

  beforeEach(async () => {
    const html = fs.readFileSync(
      path.join(repoRoot, "public/html/medicalStudentsWorkshop.html"),
      "utf8",
    );
    testDocument = global.document;
    testWindow = global.window;
    testDocument.body.innerHTML = html;
    testWindow.localStorage.clear();
    testWindow.alert = jest.fn();

    await jest.isolateModulesAsync(async () => {
      quizModule = await import("../public/js/medicalStudentsTestQuiz.js");
    });
  });

  afterEach(() => {
    testDocument.body.innerHTML = "";
    testWindow.localStorage.clear();
  });

  test("renders all three five-question text-only quizzes from the deck", () => {
    quizModule.initializeMedicalStudentsTestQuizzes();

    const pages = Array.from(
      testDocument.querySelectorAll(".medical-test-quiz-page"),
    );
    expect(pages).toHaveLength(3);
    pages.forEach((page) => {
      expect(page.querySelectorAll(".quiz-card")).toHaveLength(5);
      expect(page.querySelector("img, video, picture, source")).toBeNull();
      expect(page.querySelectorAll('.opt input[type="radio"]')).toHaveLength(
        20,
      );
      expect(page.querySelectorAll(".quiz-explanation[hidden]")).toHaveLength(
        5,
      );
    });

    expect(
      testDocument.querySelector("#medicalVisualAcuityTestPage .quiz-question")
        ?.textContent,
    ).toContain("6/60");
    expect(
      testDocument.querySelector("#medicalPupilsTestPage .quiz-question")
        ?.textContent,
    ).toContain("RAPD");
    expect(
      testDocument.querySelector("#medicalFundalReflexTestPage .quiz-question")
        ?.textContent,
    ).toContain("newborn baby");
    expect(
      quizModule.MEDICAL_STUDENTS_TEST_QUIZZES.visualAcuity.questions[3]
        .explanation,
    ).toContain("visual acuity of 3/6");
    expect(
      testDocument.querySelector(
        "#medicalVisualAcuityTestPage .quiz-explanation-answer",
      )?.textContent,
    ).toBe("C. 6 metres");
    expect(
      testDocument.querySelector(
        "#medicalVisualAcuityTestPage .quiz-explanation",
      )?.textContent,
    ).not.toContain("Why:");
    Object.values(quizModule.MEDICAL_STUDENTS_TEST_QUIZZES).forEach((quiz) => {
      quiz.questions.forEach((question) => {
        expect(question.explanation.length).toBeGreaterThan(40);
      });
    });
  });

  test("blocks incomplete submission, scores, reviews and restarts like the glaucoma quiz", () => {
    quizModule.initializeMedicalStudentsTestQuizzes();

    const page = testDocument.getElementById("medicalVisualAcuityTestPage");
    const results = page.querySelector(".medical-test-quiz-results");
    results.click();
    expect(testWindow.alert).toHaveBeenCalledWith(
      "Please answer all 5 questions before submitting.",
    );

    const quiz = quizModule.MEDICAL_STUDENTS_TEST_QUIZZES.visualAcuity;
    quiz.questions.forEach((question, questionIndex) => {
      const input = page.querySelector(
        `input[name="medicalVisualAcuityTestPage-q${questionIndex}"][value="${question.answerIndex}"]`,
      );
      input.checked = true;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(page.querySelector(".medical-test-quiz-progress")?.textContent).toBe(
      "5 / 5",
    );
    results.click();
    expect(page.querySelector(".medical-test-quiz-modal")?.style.display).toBe(
      "flex",
    );
    expect(page.querySelector(".medical-test-quiz-score")?.textContent).toBe(
      "You got 5 out of 5 correct.",
    );
    expect(
      page.querySelector(".medical-test-quiz-review")?.textContent.trim(),
    ).toBe("Review");
    expect(
      JSON.parse(
        testWindow.localStorage.getItem(
          "lessonProgress:medicalVisualAcuityTestPage",
        ),
      ).percent,
    ).toBe(100);

    page.querySelector(".medical-test-quiz-review").click();
    expect(page.querySelectorAll(".opt.correct")).toHaveLength(5);
    expect(page.querySelectorAll(".opt.wrong")).toHaveLength(0);
    expect(
      page.querySelectorAll(".quiz-explanation:not([hidden])"),
    ).toHaveLength(5);

    page.querySelector(".medical-test-quiz-restart").click();
    expect(page.querySelectorAll('input[type="radio"]:checked')).toHaveLength(
      0,
    );
    expect(page.querySelectorAll(".opt.correct, .opt.wrong")).toHaveLength(0);
    expect(page.querySelectorAll(".quiz-explanation[hidden]")).toHaveLength(5);
  });

  test("uses See why when any answer is wrong and reveals the notes explanations", () => {
    quizModule.initializeMedicalStudentsTestQuizzes();

    const page = testDocument.getElementById("medicalPupilsTestPage");
    const quiz = quizModule.MEDICAL_STUDENTS_TEST_QUIZZES.pupils;

    quiz.questions.forEach((question, questionIndex) => {
      const selectedIndex =
        questionIndex === 0
          ? (question.answerIndex + 1) % question.options.length
          : question.answerIndex;
      const input = page.querySelector(
        `input[name="medicalPupilsTestPage-q${questionIndex}"][value="${selectedIndex}"]`,
      );
      input.checked = true;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });

    page.querySelector(".medical-test-quiz-results").click();
    expect(page.querySelector(".medical-test-quiz-score")?.textContent).toBe(
      "You got 4 out of 5 correct.",
    );
    const seeWhy = page.querySelector(".medical-test-quiz-review");
    expect(seeWhy.textContent.trim()).toBe("See why");

    seeWhy.click();
    expect(page.querySelectorAll(".opt.correct")).toHaveLength(5);
    expect(page.querySelectorAll(".opt.wrong")).toHaveLength(1);
    expect(
      page.querySelectorAll(".quiz-explanation:not([hidden])"),
    ).toHaveLength(5);
    expect(page.querySelector(".quiz-explanation")?.textContent).toContain(
      "three ways to test the pupil light response",
    );
  });
});
