import { expect, test } from "@playwright/test";
import {
  CATARACT_QUIZ_CASES,
  CATARACT_QUIZ_BACK_SOURCE_EYES,
  getCataractQuizEyeFindings,
  getCataractQuizRetinalView,
} from "../public/js/cataractCaseQuizData.js";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
});

test("cataract folder preserves the simulator and restores on return", async ({
  page,
}) => {
  await page.goto("/#videos/interactiveLearningPage");
  const folder = page.locator(
    '#interactiveLearningPage [data-folder="cataract"]',
  );
  await expect(folder).toHaveAttribute("data-interactive-folder-wired", "1");
  await expect(folder).toBeVisible();
  const widths = await page.evaluate(() => {
    const folder = document
      .querySelector('#interactiveLearningPage [data-folder="cataract"]')
      .getBoundingClientRect();
    const sibling = document
      .querySelector(
        '#interactiveLearningPage [data-target="glaucomaSimulatorPage"]',
      )
      .getBoundingClientRect();
    return {
      width: Math.abs(folder.width - sibling.width),
      left: Math.abs(folder.left - sibling.left),
    };
  });
  expect(widths.width).toBeLessThan(1);
  expect(widths.left).toBeLessThan(1);
  const titleAlignment = await folder.evaluate((row) => {
    const icon = row.querySelector(".thumb").getBoundingClientRect();
    const title = row.querySelector(".lesson-type").getBoundingClientRect();
    return Math.abs(
      (icon.top + icon.bottom) / 2 - (title.top + title.bottom) / 2,
    );
  });
  expect(titleAlignment).toBeLessThan(2);
  expect(
    await folder.evaluate((row) => {
      const icon = row.querySelector(".thumb").getBoundingClientRect();
      const title = row.querySelector(".lesson-type").getBoundingClientRect();
      return title.left >= icon.right + 4;
    }),
  ).toBe(true);
  await folder.focus();
  await page.keyboard.press("Enter");
  const panel = page.locator("#interactiveCataractInline");
  await expect(panel).toBeVisible();
  await expect(
    page.locator(
      '#interactiveLearningPage [data-page="glaucomaSimulatorPage"]',
    ),
  ).toHaveCSS("opacity", "0.72");
  await expect(panel.locator(".lesson-type")).toHaveText([
    "Facilitators Material",
    "Quiz",
  ]);
  const bounds = await panel.evaluate((el) => {
    const p = el.getBoundingClientRect();
    const row = el.querySelector(".lesson-row").getBoundingClientRect();
    const close = el.querySelector(".see-all-toggle").getBoundingClientRect();
    return {
      inset: row.left - p.left,
      right: close.right <= p.right,
      headingHeight: el.querySelector("h3").getBoundingClientRect().height,
    };
  });
  expect(bounds.inset).toBeGreaterThan(15);
  expect(bounds.right).toBe(true);
  expect(bounds.headingHeight).toBeLessThan(40);
  await panel.screenshot({
    path: test.info().outputPath("cataract-folder.png"),
  });
  await panel.locator('[data-target="cataractSimulatorPage"]').click();
  await expect(page.locator("#cataractSimulatorPage")).toBeVisible();
  await page.locator("[data-experimental-miniapp-ok]").click();
  const frame = page.frameLocator("#cataractSimulatorPage iframe");
  await expect(frame.locator("#fundal-section")).toBeAttached();
  await frame.locator("#arclightEmbeddedBackButton").click();
  await expect(panel).toBeVisible();
  await panel.locator(".see-all-toggle").click();
  await expect(folder).toBeFocused();
  await expect(folder).toHaveAttribute("aria-expanded", "false");
});

test("case quiz reveals symptoms, grades answers, reviews and restarts", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#videos/interactiveLearningPage");
  await expect(
    page.locator('#interactiveLearningPage [data-folder="cataract"]'),
  ).toHaveAttribute("data-interactive-folder-wired", "1");
  await page
    .locator('#interactiveLearningPage [data-folder="cataract"]')
    .click();
  await page
    .locator('#interactiveCataractInline [data-target="cataractCaseQuizPage"]')
    .click();
  const quiz = page.locator("#cataractCaseQuizPage");
  await expect(quiz).toBeVisible();
  await page.clock.install();
  await expect(quiz.locator(".cataract-quiz-onboarding")).toHaveAttribute(
    "data-step",
    "1",
  );
  await expect(
    quiz.getByRole("button", { name: "Next", exact: true }),
  ).toHaveCSS("background-color", "rgb(21, 225, 21)");
  await quiz.getByRole("button", { name: "Next", exact: true }).click();
  await expect(quiz.locator(".cataract-quiz-onboarding")).toHaveAttribute(
    "data-step",
    "2",
  );
  for (const bubble of await quiz
    .locator(".cataract-quiz-intro-bubble")
    .all()) {
    await expect(bubble).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(bubble).toHaveCSS("align-self", "flex-start");
  }
  await quiz.getByRole("button", { name: "Back", exact: true }).click();
  await expect(quiz.locator(".cataract-quiz-onboarding")).toHaveAttribute(
    "data-step",
    "1",
  );
  await quiz.getByRole("button", { name: "Next", exact: true }).click();
  await quiz.getByRole("button", { name: "Next", exact: true }).click();
  await expect(
    quiz.locator(".cataract-quiz-intro-options .casechat-dxitem"),
  ).toHaveCount(3);
  await expect(quiz.locator(".is-demo-selected")).toHaveCSS(
    "animation-name",
    "cataract-demo-choice",
  );
  await quiz.getByRole("button", { name: "Start", exact: true }).click();
  const submitInitial = quiz.getByRole("button", {
    name: "Submit Answer",
    exact: true,
  });
  await expect(submitInitial).toBeEnabled();
  const finalPosition = await submitInitial.evaluate(
    (button) => button.offsetTop,
  );
  // Submit is usable even before the first history line appears.
  await submitInitial.click();
  await expect(quiz.getByRole("dialog")).toBeVisible();
  await quiz.getByRole("button", { name: "Close", exact: true }).click();
  await page.clock.runFor(1000);
  await expect(
    quiz.locator(".casechat-bubble--bot:not(.casechat-bubble--pending)"),
  ).toHaveCount(1);
  await page.clock.runFor(8000);
  await expect(
    quiz.locator(".casechat-bubble--bot:not(.casechat-bubble--pending)"),
  ).toHaveCount(5);
  expect(await submitInitial.evaluate((button) => button.offsetTop)).toBe(
    finalPosition,
  );
  const submit = quiz.getByRole("button", {
    name: "Submit Answer",
    exact: true,
  });
  await expect(submit).toHaveCSS("font-size", "14px");
  expect(
    await submit.evaluate((button) => {
      const lastBubble = document
        .querySelector("#cataractCaseQuizPage .casechat-bubble:last-child")
        .getBoundingClientRect();
      return button.getBoundingClientRect().top >= lastBubble.bottom;
    }),
  ).toBe(true);
  for (const img of await quiz.locator(".cataract-quiz-findings img").all()) {
    await expect
      .poll(() => img.evaluate((el) => el.complete && el.naturalWidth > 0))
      .toBe(true);
  }
  await quiz.screenshot({
    path: test.info().outputPath("cataract-quiz.png"),
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  const seen = new Set();
  for (let i = 0; i < CATARACT_QUIZ_CASES.length; i++) {
    if (i > 0) await page.clock.runFor(9000);
    const currentCaseId = await quiz.getAttribute("data-case-id");
    seen.add(currentCaseId);
    const item = CATARACT_QUIZ_CASES.find((item) => item.id === currentCaseId);
    await expect(quiz.locator(".cataract-quiz-eye")).toHaveCount(4);
    expect(await quiz.locator(".cataract-quiz-eye-note").count()).toBe(0);
    for (const eye of await quiz.locator(".cataract-quiz-eye").all()) {
      expect(
        await eye.evaluate((el) => {
          const label = el
            .querySelector(".cataract-quiz-eye-label")
            .getBoundingClientRect();
          const view = el
            .querySelector(".cataract-quiz-eye-view")
            .getBoundingClientRect();
          return label.bottom <= view.top + 1;
        }),
      ).toBe(true);
      await expect(eye.locator(".cataract-quiz-eye-label")).toHaveCSS(
        "color",
        "rgb(17, 17, 17)",
      );
      await expect(eye.locator(".cataract-quiz-eye-label")).toHaveCSS(
        "font-weight",
        "600",
      );
    }
    const eyeFindings = getCataractQuizEyeFindings(item);
    for (const side of ["right", "left"]) {
      const view = quiz.locator(
        `.cataract-quiz-exam--back [data-eye="${side}"] .cataract-quiz-eye-view`,
      );
      const clarity = getCataractQuizRetinalView(item, side);
      await expect(view).toHaveAttribute("data-clarity", clarity);
      if (clarity === "obscured")
        await expect(view.locator("img")).toHaveCSS("visibility", "hidden");
      const scale = await view
        .locator("img")
        .evaluate((img) => new DOMMatrix(getComputedStyle(img).transform).a);
      expect(scale < 0).toBe(
        side !== CATARACT_QUIZ_BACK_SOURCE_EYES[eyeFindings[side].back],
      );
    }
    for (const img of await quiz.locator(".cataract-quiz-findings img").all()) {
      await expect
        .poll(() => img.evaluate((el) => el.complete && el.naturalWidth > 0))
        .toBe(true);
    }
    await quiz
      .getByRole("button", { name: "Submit Answer", exact: true })
      .click();
    if (i === 0) {
      const modal = quiz.getByRole("dialog");
      await expect(modal.locator(".casechat-modal__dxHint")).toHaveText(
        "You only get 2 attempts",
      );
      await expect(modal.locator(".casechat-modal__dxHint")).toHaveCSS(
        "text-align",
        "left",
      );
      await expect(modal.getByRole("radio")).toHaveCount(4);
      await expect(modal.locator(".casechat-radio").first()).toBeVisible();
      await expect(modal.locator(".cataract-quiz-answer-feedback")).toBeEmpty();
      await expect(
        modal.getByRole("button", { name: /^(No|Cancel)$/ }),
      ).toHaveCount(0);
      await modal.locator(".casechat-modalCard").screenshot({
        path: test.info().outputPath("cataract-answer.png"),
      });
      await modal
        .getByRole("radio", {
          name: item.distractors[0],
          exact: true,
        })
        .click();
      await expect(modal).toContainText("Try again");
      await expect(modal).not.toContainText("Correct answer:");
    }
    await quiz.getByRole("radio", { name: item.answer, exact: true }).click();
    await expect(quiz.locator(".cataract-quiz-answer-feedback")).toContainText(
      "Correct.",
    );
    await expect(quiz.getByRole("dialog")).toBeVisible();
    await expect(
      quiz.getByRole("button", { name: "Next Case", exact: true }),
    ).toHaveCSS("font-size", "14px");
    if (i === 0)
      await quiz.locator(".casechat-modalCard").screenshot({
        path: test.info().outputPath("cataract-correct.png"),
      });
    await expect(quiz.locator(".casechat-log")).not.toContainText(
      "Correct answer:",
    );
    if (i === 1) {
      await quiz
        .getByRole("button", { name: "Previous Case", exact: true })
        .click();
      await expect(quiz.locator(".cataract-quiz-case-heading")).toContainText(
        "Case 1",
      );
      await expect(
        quiz.locator(".cataract-quiz-answer-feedback"),
      ).toContainText("Correct.");
      await quiz
        .getByRole("button", { name: "Next Case", exact: true })
        .click();
      await expect(quiz.locator(".cataract-quiz-case-heading")).toContainText(
        "Case 2",
      );
    }
    await quiz
      .getByRole("button", {
        name: "Next Case",
        exact: true,
      })
      .click();
  }
  expect(seen.size).toBe(8);
  await expect(quiz.locator(".casechat-modalCard")).toContainText("8 out of 8");
  await quiz.getByRole("button", { name: "Review", exact: true }).click();
  await expect(quiz.locator(".cataract-quiz-review")).toHaveCount(8);
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("lessonProgress:cataractCaseQuizPage"))
          .percent,
    ),
  ).toBe(100);
  await quiz.getByRole("button", { name: "Restart", exact: true }).click();
  await expect(quiz.locator(".cataract-quiz-case-heading")).toContainText(
    "Case 1",
  );
  expect(errors).toEqual([]);
});

test("two wrong answers reveal a bright green correct answer", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0.999999;
  });
  await page.goto("/#videos/interactiveLearningPage");
  await page
    .locator('[data-folder="cataract"][data-interactive-folder-wired="1"]')
    .click();
  await page
    .locator('#interactiveCataractInline [data-target="cataractCaseQuizPage"]')
    .click();
  const quiz = page.locator("#cataractCaseQuizPage");
  await quiz.getByRole("button", { name: "Next", exact: true }).click();
  await quiz.getByRole("button", { name: "Next", exact: true }).click();
  await quiz.getByRole("button", { name: "Start", exact: true }).click();
  const currentId = await quiz.getAttribute("data-case-id");
  const item = CATARACT_QUIZ_CASES.find((item) => item.id === currentId);
  await quiz
    .getByRole("button", { name: "Submit Answer", exact: true })
    .click();
  for (const answer of item.distractors.slice(0, 2))
    await quiz.getByRole("radio", { name: answer, exact: true }).click();
  const correct = quiz.getByRole("radio", { name: item.answer, exact: true });
  await expect(correct).toHaveClass(/is-correct/);
  await expect(correct).toBeDisabled();
  await expect(correct).toHaveCSS("border-top-color", "rgb(21, 225, 21)");
  await expect(correct).toHaveCSS("background-color", "rgb(232, 255, 232)");
  await expect(correct).toHaveCSS("opacity", "1");
  await expect(correct.locator(".casechat-radio")).toHaveCSS(
    "border-top-color",
    "rgb(21, 225, 21)",
  );
  expect(
    await correct
      .locator(".casechat-radio")
      .evaluate((el) => getComputedStyle(el, "::after").backgroundColor),
  ).toBe("rgb(21, 225, 21)");
  await expect(quiz.locator(".cataract-quiz-answer-feedback")).toContainText(
    "Incorrect.",
  );
  const feedback = quiz.locator(".cataract-quiz-answer-feedback");
  await expect(
    feedback.locator(".cataract-quiz-feedback-summary strong"),
  ).toHaveCount(2);
  for (const summary of await feedback
    .locator(".cataract-quiz-feedback-summary strong")
    .all())
    await expect(summary).toHaveCSS("font-weight", "700");
  for (const term of await feedback
    .locator(".cataract-quiz-urgent-term")
    .all()) {
    await expect(term).toHaveCSS("color", "rgb(228, 30, 38)");
    await expect(term).toHaveText(
      /^(urgent review|urgent|referrals?|refer(?:red|ring)?|same-day)$/i,
    );
  }
  await quiz
    .locator(".casechat-modalCard")
    .screenshot({ path: test.info().outputPath("two-wrong-answers.png") });
});
