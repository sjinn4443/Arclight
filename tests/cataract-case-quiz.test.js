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
const quiz = () => document.getElementById("cataractCaseQuizPage");
const click = (text) => {
  const target = [...quiz().querySelectorAll("button")].find(
    (b) => b.textContent === text,
  );
  expect(target).toBeTruthy();
  target.click();
};
const start = () => {
  initializeCataractCaseQuiz();
  syncCataractCaseQuiz("cataractCaseQuizPage");
  click("Next");
  click("Next");
  click("Start");
};

beforeEach(() => {
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
  ).toEqual(["Facilitators Material", "Quiz"]);
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
    click("Next Case");
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
    expect(panel.textContent).toContain("Right eye");
    expect(panel.textContent).toContain("Left eye");
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
  ).toContain("Correct.");
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
  ).toContain("Correct.");
  expect(
    JSON.parse(localStorage.getItem("lessonProgress:cataractCaseQuizPage"))
      .percent,
  ).toBe(12.5);
  click("Next Case");
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
    click("Next Case");
    jest.advanceTimersByTime(9000);
    click("Submit Answer");
    click(CATARACT_QUIZ_CASES[i].answer);
  }
  click("Next Case");
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
  click("Next Case");
  jest.advanceTimersByTime(9000);
  click("Submit Answer");
  click(CATARACT_QUIZ_CASES[1].answer);
  click("Previous Case");
  expect(
    quiz().querySelector(".cataract-quiz-case-heading").textContent,
  ).toContain("Case 1");
  expect(modal.textContent).toContain("Correct.");
  click("Next Case");
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
  ).toContain("Incorrect.");
  expect(
    quiz().querySelector(".cataract-quiz-answer-feedback").textContent,
  ).toContain(CATARACT_QUIZ_CASES[0].explanation);
  click("Next Case");
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
