/** @jest-environment jsdom */
import { jest, beforeEach, afterEach, test, expect } from "@jest/globals";
import fs from "node:fs";
import {
  CATARACT_QUIZ_CASES,
  CATARACT_QUIZ_IMAGES,
  getCataractQuizEyeFindings,
  getCataractQuizRetinalView,
  CATARACT_QUIZ_BACK_SOURCE_EYES,
} from "../public/js/cataractCaseQuizData.js";
import {
  initializeCataractCaseQuiz,
  syncCataractCaseQuiz,
} from "../public/js/cataractCaseQuiz.js";

const html = fs.readFileSync("public/html/videos.html", "utf8");
let activeQuizId = "cataractCaseQuizPage";
const quiz = () => document.getElementById(activeQuizId);
const click = (text) => {
  const target = [...quiz().querySelectorAll("button")].find(
    (b) => b.textContent === text,
  );
  expect(target).toBeTruthy();
  target.click();
};
const start = (pageId = "cataractCaseQuizPage") => {
  activeQuizId = pageId;
  initializeCataractCaseQuiz();
  syncCataractCaseQuiz(pageId);
  click("Next");
  click("Next");
  click("Start");
};

beforeEach(() => {
  activeQuizId = "cataractCaseQuizPage";
  jest.spyOn(Math, "random").mockReturnValue(0.999999);
  jest.useFakeTimers();
  localStorage.clear();
  document.body.innerHTML = html;
  Element.prototype.scrollIntoView = jest.fn();
  window.I18N = { applyTranslations: jest.fn() };
});
afterEach(() => {
  syncCataractCaseQuiz("interactiveLearningPage");
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test("cataract folder holds the original simulator target and the case quiz", () => {
  const folder = document.getElementById("interactiveCataractInline");
  expect(
    [...folder.querySelectorAll(".lesson-type")].map((n) =>
      n.textContent.trim(),
    ),
  ).toEqual([
    "Facilitators Material",
    "Quiz · Primary",
    "Quiz · Intermediate",
    "Quiz · Advanced",
  ]);
  expect(folder.querySelector(".lesson-row--interactive").dataset.target).toBe(
    "cataractSimulatorPage",
  );
  expect(
    document.querySelector("#cataractSimulatorPage iframe").dataset.src,
  ).toBe("subapp/Cataract/index.html");
});

test("cases preserve simulator clinical actions and use existing images", () => {
  expect(CATARACT_QUIZ_CASES.map((c) => c.result.actionCode)).toEqual([
    "child_white_reflex_urgent",
    "cataract_early_referral_reduced_va",
    "cataract_early_review_mild_va",
    "cataract_early_referral_reduced_va",
    "cataract_priority_white",
    "retinal_same_day",
    "posterior_disease_first",
    "posterior_disease_first",
  ]);
  for (const item of CATARACT_QUIZ_CASES) {
    expect(new Set([item.answer, ...item.distractors]).size).toBe(4);
    for (const [kind, selection] of [
      ["fundal", item.findings.fundalSelection],
      ["back", item.findings.backSelection],
    ]) {
      expect(
        fs.existsSync(`public${CATARACT_QUIZ_IMAGES[kind][selection]}`),
      ).toBe(true);
    }
  }
});

test("shuffles all eight cases on first start and restart, preserving navigation", () => {
  Math.random.mockReturnValue(0);
  start();
  const ids = [];
  for (let i = 0; i < CATARACT_QUIZ_CASES.length; i++) {
    ids.push(quiz().dataset.caseId);
    jest.advanceTimersByTime(9000);
    click("Submit Answer");
    click(
      CATARACT_QUIZ_CASES.find((item) => item.id === quiz().dataset.caseId)
        .answer,
    );
    click("Next >");
  }
  expect(new Set(ids).size).toBe(8);
  expect(ids).not.toEqual(CATARACT_QUIZ_CASES.map((item) => item.id));
  Math.random.mockReturnValue(0.999999);
  click("Restart");
  expect(quiz().dataset.caseId).toBe(CATARACT_QUIZ_CASES[0].id);
});

test("pairs findings for each eye and presents histories in the third person", () => {
  for (const item of CATARACT_QUIZ_CASES) {
    const eyes = getCataractQuizEyeFindings(item);
    expect(eyes.right).toEqual({
      fundal: item.findings.fundalSelection,
      back: item.findings.backSelection,
    });
    expect(eyes.left).toEqual(
      item.findings.eyes === "one"
        ? { fundal: "normal", back: "normal" }
        : eyes.right,
    );
    expect(item.lines.join(" ")).not.toMatch(/\b(I|My|my)\b/);
  }
  start();
  const panels = quiz().querySelectorAll(".cataract-quiz-exam");
  expect(panels).toHaveLength(2);
  for (const panel of panels) {
    expect(panel.querySelectorAll(".cataract-quiz-eye")).toHaveLength(2);
    expect(panel.textContent).toContain("R.E.");
    expect(panel.textContent).toContain("L.E.");
  }
  jest.advanceTimersByTime(9000);
  click("Submit Answer");
  expect(quiz().querySelector(".casechat-modal__dxHint").textContent).toBe(
    "You only get 2 attempts",
  );
});

test("allows an answer immediately and reveals the remaining history after grading", () => {
  start();
  expect(quiz().querySelector(".cataract-quiz-submit").disabled).toBe(false);
  expect(quiz().querySelectorAll(".casechat-bubble--pending")).toHaveLength(5);
  click("Submit Answer");
  click(CATARACT_QUIZ_CASES[0].answer);
  expect(quiz().querySelectorAll(".casechat-bubble--pending")).toHaveLength(0);
  expect(
    quiz().querySelector(".cataract-quiz-answer-feedback").textContent,
  ).toContain("Correct answer:");
});

test("clinical views preserve the fellow eye and distinguish haze from retinal disease", () => {
  for (const item of CATARACT_QUIZ_CASES) {
    for (const side of ["right", "left"]) {
      expect(["clear", "mild", "diffuse", "central", "obscured"]).toContain(
        getCataractQuizRetinalView(item, side),
      );
    }
    if (item.findings.eyes === "one")
      expect(getCataractQuizRetinalView(item, "left")).toBe("clear");
  }
  expect(
    getCataractQuizRetinalView(
      CATARACT_QUIZ_CASES.find((c) => c.id === "nuclear"),
      "right",
    ),
  ).toBe("diffuse");
  const mature = CATARACT_QUIZ_CASES.find((c) => c.id === "mature");
  expect(mature.retinalViews).toEqual({ right: "obscured", left: "obscured" });
  const pdr = CATARACT_QUIZ_CASES.find((c) => c.id === "retinal-disease");
  expect(pdr.answer).toContain("urgent retinal assessment");
  expect(pdr.nextStep).toContain("urgent");
  expect(CATARACT_QUIZ_BACK_SOURCE_EYES.detached).toBe("right");
  start();
  expect(quiz().querySelectorAll(".cataract-quiz-eye-note")).toHaveLength(0);
  expect(
    quiz().querySelector(
      '.cataract-quiz-exam--back [data-eye="right"] .cataract-quiz-eye-view',
    ).dataset.clarity,
  ).toBe("obscured");
});

test.each([390, 767, 768, 1440])(
  "follows newly revealed history only on mobile at %ipx",
  (width) => {
    jest.replaceProperty(window, "innerWidth", width);
    start();
    Element.prototype.scrollIntoView.mockClear();
    jest.advanceTimersByTime(1000);
    const history = quiz().querySelectorAll(".casechat-bubble--bot");
    if (width <= 767) {
      expect(Element.prototype.scrollIntoView.mock.contexts).toEqual([
        history[0],
      ]);
      jest.advanceTimersByTime(2000);
      expect(Element.prototype.scrollIntoView.mock.contexts).toEqual([
        history[0],
        history[1],
      ]);
    } else {
      jest.advanceTimersByTime(2000);
      expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    }
  },
);

test("revealing the remaining history for feedback does not scroll behind the dialog", () => {
  jest.replaceProperty(window, "innerWidth", 390);
  start();
  Element.prototype.scrollIntoView.mockClear();
  click("Submit Answer");
  click(CATARACT_QUIZ_CASES[0].answer);
  expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
});

test("reveals history sequentially, permits two attempts and records progress", () => {
  start();
  expect(
    quiz().querySelectorAll(
      ".casechat-bubble--bot:not(.casechat-bubble--pending)",
    ),
  ).toHaveLength(0);
  jest.advanceTimersByTime(1000);
  expect(
    quiz().querySelectorAll(
      ".casechat-bubble--bot:not(.casechat-bubble--pending)",
    ),
  ).toHaveLength(1);
  jest.advanceTimersByTime(8000);
  expect(
    quiz().querySelectorAll(
      ".casechat-bubble--bot:not(.casechat-bubble--pending)",
    ),
  ).toHaveLength(5);
  click("Submit Answer");
  click(CATARACT_QUIZ_CASES[0].distractors[0]);
  expect(
    quiz().querySelector(".cataract-quiz-answer-feedback").textContent,
  ).toContain("Try again");
  click(CATARACT_QUIZ_CASES[0].answer);
  expect(
    quiz().querySelector(".cataract-quiz-answer-feedback").textContent,
  ).toContain("Correct answer:");
  expect(
    JSON.parse(localStorage.getItem("lessonProgress:cataractCaseQuizPage"))
      .percent,
  ).toBe(12.5);
  click("Next >");
  expect(
    quiz().querySelector(".cataract-quiz-case-heading").textContent,
  ).toContain("Case 2");
});

test("pauses on exit and handles timeout, completion, review and restart", () => {
  start();
  jest.advanceTimersByTime(2000);
  syncCataractCaseQuiz("interactiveLearningPage");
  jest.advanceTimersByTime(100000);
  expect(quiz().querySelector(".caseTimer text").textContent).toBe("88");
  syncCataractCaseQuiz("cataractCaseQuizPage");
  jest.advanceTimersByTime(88000);
  expect(quiz().textContent).toContain("Time is up.");
  for (let i = 1; i < CATARACT_QUIZ_CASES.length; i++) {
    click("Next >");
    jest.advanceTimersByTime(9000);
    click("Submit Answer");
    click(CATARACT_QUIZ_CASES[i].answer);
  }
  click("Next >");
  expect(quiz().querySelector(".casechat-modalCard").textContent).toContain(
    "7 out of 8",
  );
  click("Review");
  expect(quiz().querySelectorAll(".cataract-quiz-review")).toHaveLength(8);
  click("Restart");
  expect(quiz().querySelectorAll(".cataract-quiz-review")).toHaveLength(0);
  expect(quiz().querySelector(".caseTimer text").textContent).toBe("90");
  expect(
    JSON.parse(localStorage.getItem("lessonProgress:cataractCaseQuizPage"))
      .percent,
  ).toBe(100);
});

test("answer feedback stays in the dialog and previous/next preserves scores", () => {
  start();
  jest.advanceTimersByTime(9000);
  click("Submit Answer");
  const modal = quiz().querySelector(".casechat-modal");
  expect(modal.hidden).toBe(false);
  expect(modal.querySelectorAll(".casechat-radio")).toHaveLength(4);
  expect(
    modal.querySelector(".cataract-quiz-answer-feedback").textContent,
  ).toBe("");
  expect(
    [...modal.querySelectorAll("button")].some((b) =>
      ["No", "Cancel"].includes(b.textContent),
    ),
  ).toBe(false);
  click(CATARACT_QUIZ_CASES[0].distractors[0]);
  expect(modal.hidden).toBe(false);
  expect(modal.textContent).toContain("Try again");
  expect(modal.textContent).not.toContain("Correct answer:");
  click(CATARACT_QUIZ_CASES[0].answer);
  expect(modal.hidden).toBe(false);
  expect(modal.textContent).toContain(CATARACT_QUIZ_CASES[0].explanation);
  expect(quiz().querySelector(".casechat-log").textContent).not.toContain(
    "Correct answer:",
  );
  click("Next >");
  jest.advanceTimersByTime(9000);
  click("Submit Answer");
  click(CATARACT_QUIZ_CASES[1].answer);
  click("< Previous");
  expect(
    quiz().querySelector(".cataract-quiz-case-heading").textContent,
  ).toContain("Case 1");
  expect(modal.textContent).toContain("Correct answer:");
  click("Next >");
  expect(
    quiz().querySelector(".cataract-quiz-case-heading").textContent,
  ).toContain("Case 2");
  expect(
    JSON.parse(localStorage.getItem("lessonProgress:cataractCaseQuizPage"))
      .percent,
  ).toBe(25);
});

test("closing the dialog preserves attempts and two wrong answers still allow the next case", () => {
  start();
  jest.advanceTimersByTime(9000);
  click("Submit Answer");
  click(CATARACT_QUIZ_CASES[0].distractors[0]);
  quiz().querySelector('[aria-label="Close"]').click();
  click("Submit Answer");
  expect(quiz().querySelector(".casechat-modal").textContent).toContain(
    "Attempts left: 1",
  );
  click(CATARACT_QUIZ_CASES[0].distractors[1]);
  expect(
    quiz().querySelector(".cataract-quiz-answer-feedback").textContent,
  ).toContain("Correct answer:");
  expect(
    quiz().querySelector(".cataract-quiz-answer-feedback").textContent,
  ).toContain(CATARACT_QUIZ_CASES[0].explanation);
  click("Next >");
  expect(
    quiz().querySelector(".cataract-quiz-case-heading").textContent,
  ).toContain("Case 2");
});

test("answer summaries are bold and only urgent or referral terms are marked", () => {
  start();
  click("Submit Answer");
  click(CATARACT_QUIZ_CASES[0].answer);
  const feedback = quiz().querySelector(".cataract-quiz-answer-feedback");
  const summaries = [
    ...feedback.querySelectorAll(".cataract-quiz-feedback-summary"),
  ];
  expect(summaries).toHaveLength(2);
  expect(summaries[0].querySelector("strong").textContent).toBe(
    `Correct answer: ${CATARACT_QUIZ_CASES[0].answer}.`,
  );
  expect(summaries[1].querySelector("strong").textContent).toBe(
    `Next step: ${CATARACT_QUIZ_CASES[0].nextStep}`,
  );
  const terms = [...feedback.querySelectorAll(".cataract-quiz-urgent-term")];
  expect(terms.map((node) => node.textContent)).toContain("urgent review");
  for (const node of terms) {
    expect(node.textContent).toMatch(
      /^(urgent review|urgent|referrals?|refer(?:red|ring)?|same-day)$/i,
    );
    expect(node.textContent.length).toBeLessThan(
      node.closest("p").textContent.length,
    );
  }
  expect(feedback.textContent).toContain(CATARACT_QUIZ_CASES[0].explanation);
});

test("finished answers hide the attempt hint and status, with equally unselected wrong options", () => {
  start();
  click("Submit Answer");
  expect(quiz().querySelector(".casechat-modal__title").textContent).toBe(
    "Answer",
  );
  click(CATARACT_QUIZ_CASES[0].distractors[0]);
  expect(quiz().querySelector(".casechat-modal__dxHint").textContent).toContain(
    "1",
  );
  click(CATARACT_QUIZ_CASES[0].distractors[1]);
  expect(quiz().querySelector(".casechat-modal__dxHint")).toBeNull();
  expect(
    quiz().querySelector(".casechat-resultOk, .casechat-tryagain"),
  ).toBeNull();
  const wrong = quiz().querySelectorAll(".casechat-dxitem.is-wrong");
  expect(wrong).toHaveLength(2);
  for (const choice of wrong) {
    expect(choice.getAttribute("aria-checked")).toBe("false");
    expect(choice.classList.contains("is-selected")).toBe(false);
  }
  expect(
    quiz().querySelector(".cataract-quiz-next-step").textContent,
  ).toContain("Next step:");
  click("Next >");
  click("Submit Answer");
  click(CATARACT_QUIZ_CASES[1].answer);
  expect(quiz().querySelector(".casechat-modal__dxHint")).toBeNull();
});

test("Primary reveals inline choices after history and only grades on Submit Answer without a timeout", () => {
  start("cataractCaseQuizPrimaryPage");
  expect(quiz().querySelector(".caseTimer").hidden).toBe(true);
  expect(quiz().querySelector(".cataract-quiz-eye-note").textContent).toBe(
    "Poor view",
  );
  expect(quiz().querySelector(".cataract-quiz-inline-choices").hidden).toBe(
    true,
  );
  expect(quiz().querySelector(".cataract-quiz-submit").disabled).toBe(true);
  jest.advanceTimersByTime(9000);
  expect(quiz().querySelector(".cataract-quiz-inline-choices").hidden).toBe(
    false,
  );
  expect(
    quiz().querySelectorAll('.cataract-quiz-inline-choices [role="radio"]'),
  ).toHaveLength(4);
  jest.advanceTimersByTime(180000);
  expect(quiz().querySelector(".casechat-modal").hidden).toBe(true);
  click(CATARACT_QUIZ_CASES[0].distractors[0]);
  expect(
    localStorage.getItem("lessonProgress:cataractCaseQuizPrimaryPage"),
  ).toBeNull();
  click("Submit Answer");
  expect(quiz().querySelector(".casechat-modal").hidden).toBe(true);
  expect(quiz().querySelectorAll(".casechat-dxitem.is-wrong")).toHaveLength(1);
  expect(quiz().querySelector(".cataract-quiz-submit").disabled).toBe(true);
  click(CATARACT_QUIZ_CASES[0].answer);
  click("Submit Answer");
  expect(quiz().querySelector(".casechat-modal").hidden).toBe(true);
  expect(
    quiz().querySelector(".cataract-quiz-inline-feedback").textContent,
  ).toContain(CATARACT_QUIZ_CASES[0].explanation);
  expect(quiz().querySelector(".cataract-quiz-submit")).toBeNull();
  expect(quiz().querySelector(".cataract-quiz-footer").textContent).toContain(
    "Next >",
  );
  expect(
    JSON.parse(
      localStorage.getItem("lessonProgress:cataractCaseQuizPrimaryPage"),
    ).percent,
  ).toBe(12.5);
  expect(
    localStorage.getItem("lessonProgress:cataractCaseQuizPage"),
  ).toBeNull();
});

test("Advanced explains its viewing window, abbreviates eyes, allows keyboard exploration and expires at 30 seconds", () => {
  activeQuizId = "cataractCaseQuizAdvancedPage";
  initializeCataractCaseQuiz();
  syncCataractCaseQuiz(activeQuizId);
  expect(
    quiz().querySelector(".cataract-quiz-intro-hint").textContent,
  ).toContain("Drag");
  click("Next");
  click("Next");
  expect(
    quiz().querySelector(".cataract-quiz-intro-hint").textContent,
  ).toContain("30 seconds");
  click("Start");
  expect(quiz().querySelector(".caseTimer text").textContent).toBe("30");
  expect(quiz().querySelectorAll(".casechat-bubble--pending")).toHaveLength(0);
  expect(quiz().querySelectorAll(".cataract-quiz-viewing-window")).toHaveLength(
    2,
  );
  const mask = quiz().querySelector(".cataract-quiz-viewing-window");
  mask.dispatchEvent(
    new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
  );
  expect(mask.style.getPropertyValue("--view-x")).toBe("55%");
  jest.advanceTimersByTime(9000);
  expect(quiz().querySelector(".casechat-log").textContent).toContain("R.E.");
  expect(quiz().querySelector(".casechat-log").textContent).not.toMatch(
    /right eye|left eye/i,
  );
  jest.advanceTimersByTime(20750);
  expect(quiz().querySelector(".casechat-modal").hidden).toBe(true);
  jest.advanceTimersByTime(250);
  expect(quiz().querySelector(".casechat-modal").textContent).toContain(
    "Time is up.",
  );
  expect(
    JSON.parse(
      localStorage.getItem("lessonProgress:cataractCaseQuizAdvancedPage"),
    ).percent,
  ).toBe(12.5);
});

test("switching levels pauses the inactive timer and keeps answers separate", () => {
  start();
  jest.advanceTimersByTime(2000);
  start("cataractCaseQuizAdvancedPage");
  jest.advanceTimersByTime(5000);
  expect(
    document.querySelector("#cataractCaseQuizPage .caseTimer text").textContent,
  ).toBe("88");
  syncCataractCaseQuiz("cataractCaseQuizPage");
  jest.advanceTimersByTime(1000);
  expect(
    document.querySelector("#cataractCaseQuizPage .caseTimer text").textContent,
  ).toBe("87");
  expect(quiz().querySelector(".caseTimer text").textContent).toBe("25");
});

test.each([
  "cataractCaseQuizPrimaryPage",
  "cataractCaseQuizPage",
  "cataractCaseQuizAdvancedPage",
])(
  "%s completes, reviews separated history and answers, and restores graded cases",
  (pageId) => {
    start(pageId);
    const primary = pageId === "cataractCaseQuizPrimaryPage";
    for (let i = 0; i < CATARACT_QUIZ_CASES.length; i++) {
      const item = CATARACT_QUIZ_CASES[i];
      if (primary) {
        jest.advanceTimersByTime(9000);
        click(item.answer);
        click("Submit Answer");
        if (i === 1) {
          click("< Previous");
          expect(quiz().querySelector(".casechat-modal").hidden).toBe(true);
          expect(
            quiz().querySelector(".cataract-quiz-inline-feedback").textContent,
          ).toContain(CATARACT_QUIZ_CASES[0].explanation);
          click("Next >");
        }
      } else {
        click("Submit Answer");
        click(item.answer);
      }
      click("Next >");
    }
    expect(
      quiz().querySelector(".cataract-quiz-score-correct").textContent,
    ).toBe("8 out of 8 correct.");
    const actions = quiz().querySelector(".cataract-quiz-completion-actions");
    expect(
      [...actions.querySelectorAll("button")].map((node) => node.textContent),
    ).toEqual(["Review", "Restart", "Quit"]);
    click("Review");
    expect(
      quiz().querySelectorAll(
        ".cataract-quiz-review-history .casechat-bubble--bot",
      ),
    ).toHaveLength(40);
    expect(
      quiz().querySelectorAll(".cataract-quiz-review-response"),
    ).toHaveLength(8);
    expect(
      quiz().querySelectorAll(
        ".cataract-quiz-review-explanation .cataract-quiz-next-step",
      ),
    ).toHaveLength(8);
    expect(
      quiz().querySelectorAll(".cataract-quiz-viewing-window"),
    ).toHaveLength(0);
    click("Restart");
    expect(quiz().querySelectorAll(".cataract-quiz-review")).toHaveLength(0);
  },
);
