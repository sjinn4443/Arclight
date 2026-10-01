import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
});

async function openQuiz(page) {
  await page.goto("/#fundalReflexQuiz", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".frq-card")).toHaveCount(5);
}

async function fillAnswers(page, { normalSign = 0, wrong = false } = {}) {
  const signs = [2, normalSign, 1, 3, 1];
  for (let i = 0; i < 5; i++) {
    const normal = i === 1 ? 0 : 1;
    await page
      .locator(`#frq-${i}-normal-${wrong && i === 0 ? 0 : normal}`)
      .click();
    await page
      .locator(`#frq-${i}-sign-${wrong && i === 4 ? 2 : signs[i]}`)
      .click();
    if (i === 0 || i === 3) await page.locator(`#frq-${i}-sign-1`).click();
  }
}

test("PEC Test row follows interpretation and returns to that folder", async ({
  page,
}) => {
  await page.goto("/#pecWorkshop", { waitUntil: "domcontentloaded" });
  const workshop = page.locator("#pecWorkshopPage");
  await expect(workshop).toHaveAttribute("data-inited", "1");
  await workshop.locator('[data-folder="eyeExamination"]').click();
  await workshop.locator('[data-nested-folder="fundalReflex"]').click();
  const rows = workshop.locator(
    '[data-nested-section="fundalReflex"] .lesson-row',
  );
  await expect(rows).toHaveCount(10);
  const testRow = workshop.locator(
    '[data-pec-lesson="fundalInterpretation"] + .lesson-row',
  );
  await expect(testRow).toHaveClass(/lesson-row--quiz/);
  await expect(testRow.locator(".lesson-type")).toHaveText("Test");
  await testRow.click();
  await expect(page.locator("#fundalReflexQuizPage")).toBeVisible();
  await expect(page.locator("#fundalReflexQuizPage .pec-flow-prev")).toHaveCSS(
    "color",
    "rgb(0, 217, 0)",
  );
  await expect(page.locator("#fundalReflexQuizPage .pec-flow-prev")).toHaveCSS(
    "border-radius",
    "14px",
  );
  await expect(page.locator("#fundalReflexQuizPage .pec-flow-next")).toHaveCSS(
    "border-radius",
    "14px",
  );
  await expect(page.locator("#fundalReflexQuizPage h1")).toHaveText(
    "Fundal 'Red' Reflex Image Interpretation",
  );
  await expect(page.locator(".frq-image").first()).toHaveJSProperty(
    "naturalWidth",
    287,
  );
  await page.locator("#backBtnGlobal").click();
  await expect(
    workshop.locator('[data-nested-section="fundalReflex"]'),
  ).toBeVisible();
});

test("answers can be replaced; mixed results reveal individual chips and looping explanations", async ({
  page,
}) => {
  await openQuiz(page);
  await expect(page.locator("#frqSubmit")).toBeDisabled();
  await page.locator("#frq-0-normal-1").focus();
  await page.keyboard.press("Enter");
  await expect(
    page
      .locator(".frq-card")
      .first()
      .locator('[data-field="normal"].frq-zone .frq-chip'),
  ).toHaveText("No");
  await fillAnswers(page, { wrong: true });
  await expect(page.locator("#frqProgress")).toHaveText("5 / 5 answered");
  await expect(page.locator(".frq-zone .frq-chip")).toHaveCount(12);
  await expect(page.locator(".frq-explanation:visible")).toHaveCount(0);
  await page.locator("#frqSubmit").click();
  await expect(page.locator("#frqResults")).toBeVisible();
  await expect(page.locator("#frqScore")).toHaveText(
    "3 correct · 2 incorrect out of 5 questions.",
  );
  await page.locator("#frqSeeWhy").click();
  await expect(page.locator("#frqResults")).not.toBeVisible();
  await expect(page.locator(".frq-chip.is-correct")).toHaveCount(10);
  await expect(page.locator(".frq-chip.is-incorrect")).toHaveCount(2);
  await expect(page.locator(".frq-explanation:visible")).toHaveCount(5);
  for (let i = 0; i < 5; i++) {
    const image = page.locator(".frq-image").nth(i);
    await expect(image).toHaveAttribute(
      "src",
      `/images/quiz/fundal-reflex/case-${i + 1}-explanation.gif`,
    );
    await expect(image).toHaveJSProperty("naturalWidth", 640);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `test-results/fundal-review-${test.info().project.name}.png`,
  });
  await page.locator("#frqRestart").click();
  await expect(page.locator(".frq-zone .frq-chip")).toHaveCount(0);
  await expect(page.locator("#frqSubmit")).toBeDisabled();
  await expect(page.locator(".frq-image").first()).toHaveAttribute(
    "src",
    /case-1.webp$/,
  );
  await expect(page.locator(".frq-bank .frq-chip")).toHaveCount(35);
});

for (const normalSign of [0, 4]) {
  test(`all correct with normal description ${normalSign}; Escape opens review`, async ({
    page,
  }) => {
    await openQuiz(page);
    await fillAnswers(page, { normalSign });
    await page.locator("#frqSubmit").click();
    await expect(page.locator("#frqScore")).toHaveText(
      "5 correct · 0 incorrect out of 5 questions.",
    );
    await page.keyboard.press("Escape");
    await expect(page.locator(".frq-chip.is-correct")).toHaveCount(12);
  });
}

test("dragging validates the chart column and question; touch drag and cancel work", async ({
  page,
}, testInfo) => {
  await openQuiz(page);
  const card = page.locator(".frq-card").first();
  if (testInfo.project.name === "chromium-desktop") {
    await page
      .locator("#frq-0-normal-1")
      .dragTo(card.locator('.frq-zone[data-field="sign"]'));
    await expect(page.locator(".frq-zone .frq-chip")).toHaveCount(0);
    await page
      .locator("#frq-0-normal-1")
      .dragTo(
        page
          .locator(".frq-card")
          .nth(1)
          .locator('.frq-zone[data-field="normal"]'),
      );
    await expect(page.locator(".frq-zone .frq-chip")).toHaveCount(0);
    await page
      .locator("#frq-0-normal-1")
      .dragTo(card.locator('.frq-zone[data-field="normal"]'));
    await expect(
      card.locator('.frq-zone[data-field="normal"] .frq-chip'),
    ).toHaveText("No");
  }
  // Synthetic pointer events exercise the touch path on both browser engines.
  // Native mouse drag is covered above; ordinary mobile taps are covered by fillAnswers.
  await card.scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const chip = document.querySelector("#frq-0-sign-2");
    chip.setPointerCapture = () => {};
    const from = chip.getBoundingClientRect();
    const to = document
      .querySelector('.frq-zone[data-field="sign"]')
      .getBoundingClientRect();
    const send = (type, x, y) =>
      chip.dispatchEvent(
        new PointerEvent(type, {
          bubbles: true,
          pointerId: 22,
          pointerType: "touch",
          isPrimary: true,
          clientX: x,
          clientY: y,
        }),
      );
    send("pointerdown", from.x + 10, from.y + 10);
    send("pointermove", to.x + 10, to.y + 10);
    send("pointercancel", to.x + 10, to.y + 10);
    send("pointerdown", from.x + 10, from.y + 10);
    send("pointermove", to.x + 10, to.y + 10);
    send("pointerup", to.x + 10, to.y + 10);
  });
  await expect(
    card.locator('.frq-zone[data-field="sign"] .frq-chip'),
  ).toHaveText("loss of reflex");
  await expect(page.locator(".frq-ghost")).toHaveCount(0);
  if (testInfo.project.name === "chromium-desktop") {
    await page
      .locator("#frq-0-sign-3")
      .dragTo(card.locator('.frq-zone[data-field="sign"]'));
    await expect(
      card.locator('.frq-zone[data-field="sign"] .frq-chip'),
    ).toHaveCount(2);
    const from = await page.locator("#frq-0-sign-2").boundingBox();
    const outside = await card.locator(".frq-card-heading").boundingBox();
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(from.x + from.width / 2, from.y - 15, { steps: 4 });
    await page.mouse.move(
      outside.x + outside.width / 2,
      outside.y + outside.height / 2,
      { steps: 8 },
    );
    await page.mouse.up();
    await expect(
      card.locator('.frq-bank[data-field="sign"] .frq-chip'),
    ).toHaveText([
      "symmetrical brightness in colour",
      "asymmetrical. difference in colours and the brightness",
      "loss of reflex",
      "healthy reflex",
    ]);
  }
  // Touch drag out returns to the original bank; cancelling keeps the answer.
  const selected =
    testInfo.project.name === "chromium-desktop"
      ? "#frq-0-sign-3"
      : "#frq-0-sign-2";
  await card.locator(".frq-chart").scrollIntoViewIfNeeded();
  await page.evaluate((selector) => {
    const chip = document.querySelector(selector);
    chip.setPointerCapture = () => {};
    const from = chip.getBoundingClientRect();
    const to = chip
      .closest(".frq-card")
      .querySelector(".frq-banks")
      .getBoundingClientRect();
    const send = (type, x, y) =>
      chip.dispatchEvent(
        new PointerEvent(type, {
          bubbles: true,
          pointerId: 23,
          pointerType: "touch",
          isPrimary: true,
          clientX: x,
          clientY: y,
        }),
      );
    send("pointerdown", from.x + 10, from.y + 10);
    send("pointermove", to.x + 5, to.y + 5);
    send("pointercancel", to.x + 5, to.y + 5);
    if (!chip.closest(".frq-zone"))
      throw new Error("Cancelled drag removed an answer");
    send("pointerdown", from.x + 10, from.y + 10);
    send("pointermove", to.x + 5, to.y + 5);
    send("pointerup", to.x + 5, to.y + 5);
  }, selected);
  await expect(
    card.locator('.frq-zone[data-field="sign"] .frq-chip'),
  ).toHaveCount(0);
  await expect(
    card.locator('.frq-bank[data-field="sign"] .frq-chip'),
  ).toHaveCount(5);
  await page.screenshot({
    path: `test-results/fundal-question-${testInfo.project.name}.png`,
  });
});

test("multiple signs are graded individually, drag-out restores eligibility, and result colours match", async ({
  page,
}, testInfo) => {
  await openQuiz(page);
  await expect(page.locator(".frq-title")).toHaveCSS(
    "color",
    "rgb(242, 86, 0)",
  );
  await expect(page.locator(".frq-chart").first()).toHaveCSS(
    "border-radius",
    "12px",
  );
  await expect(page.locator("#frqSubmit")).toHaveCSS("border-radius", "14px");
  await page
    .locator(".frq-media")
    .first()
    .screenshot({
      path: `test-results/fundal-masked-image-${testInfo.project.name}.png`,
    });
  await fillAnswers(page);
  await expect(page.locator("#frqStatus")).toBeHidden();
  await page.locator("#frq-1-sign-4").click();
  await expect(
    page
      .locator(".frq-card")
      .nth(1)
      .locator('.frq-zone[data-field="sign"] .frq-chip'),
  ).toHaveCount(2);
  await page.locator("#frq-0-sign-2").click();
  await page.locator("#frq-0-sign-1").click();
  await expect(page.locator("#frqSubmit")).toBeDisabled();
  await expect(page.locator("#frqProgress")).toHaveText("4 / 5 answered");
  await page.locator("#frq-0-sign-2").click();
  await page.locator("#frq-0-sign-1").click();
  await page.locator("#frq-0-sign-4").click();
  await expect(page.locator("#frqSubmit")).toBeEnabled();
  await expect(page.locator("#frqSubmit")).toHaveCSS(
    "background-color",
    "rgb(242, 86, 0)",
  );
  await page.locator("#frqSubmit").click();
  await expect(page.locator("#frqScore")).toHaveText(
    "4 correct · 1 incorrect out of 5 questions.",
  );
  await expect(page.locator("#frqResultsTitle")).toHaveText("Results");
  await expect(page.locator("#frqScore .is-correct")).toHaveCSS(
    "color",
    "rgb(34, 131, 68)",
  );
  await expect(page.locator("#frqScore .is-incorrect")).toHaveCSS(
    "color",
    "rgb(188, 52, 52)",
  );
  await page.locator("#frqSeeWhy").click();
  await expect(page.locator(".frq-chip.is-correct")).toHaveCount(13);
  await expect(page.locator(".frq-chip.is-incorrect")).toHaveCount(1);
  await expect(page.locator(".frq-result.is-incorrect")).toHaveCSS(
    "color",
    "rgb(188, 52, 52)",
  );
  await expect(page.locator(".frq-explanation strong.is-incorrect")).toHaveCSS(
    "color",
    "rgb(188, 52, 52)",
  );
  await expect(page.locator(".frq-result.is-correct").first()).toHaveCSS(
    "color",
    "rgb(34, 131, 68)",
  );
  await expect(
    page.locator(".frq-explanation strong.is-correct").first(),
  ).toHaveCSS("color", "rgb(34, 131, 68)");
  await expect(page.locator("#frqStatus")).toBeHidden();
  for (const label of await page
    .locator(".frq-explanation .frq-answer-label")
    .all()) {
    await expect(label).toHaveCSS("color", "rgb(0, 0, 0)");
  }
  await page.screenshot({
    path: `test-results/fundal-multiple-review-${testInfo.project.name}.png`,
  });
  await page.locator("#frqRestart").click();
  await expect(page.locator(".frq-result.is-incorrect")).toHaveCount(0);
  await expect(page.locator(".frq-zone .frq-chip")).toHaveCount(0);
  await expect(
    page
      .locator(".frq-card")
      .nth(1)
      .locator('.frq-bank[data-field="sign"] .frq-chip'),
  ).toHaveText([
    "symmetrical brightness in colour",
    "asymmetrical. difference in colours and the brightness",
    "loss of reflex",
    "partial loss of reflex in on eye",
    "healthy reflex",
  ]);
});

for (const keepAsymmetry of [true, false]) {
  test(`questions 1 and 4 award half credit for either single finding (${keepAsymmetry})`, async ({
    page,
  }, testInfo) => {
    await openQuiz(page);
    await page
      .locator(".frq-media")
      .nth(3)
      .screenshot({
        path: `test-results/fundal-case4-mask-${testInfo.project.name}.png`,
      });
    await fillAnswers(page);
    await page.locator(`#frq-0-sign-${keepAsymmetry ? 2 : 1}`).click();
    await page.locator(`#frq-3-sign-${keepAsymmetry ? 3 : 1}`).click();
    await page.locator("#frqSubmit").click();
    await expect(page.locator("#frqScore")).toHaveText(
      "3 correct · 2 partly correct · 0 incorrect out of 5 questions.",
    );
    await expect(page.locator("#frqPoints")).toHaveText("Score: 4 / 5");
    await expect(page.locator("#frqScore .is-partial")).toHaveCSS(
      "color",
      "rgb(242, 86, 0)",
    );
    await page.screenshot({
      path: `test-results/fundal-partial-results-${testInfo.project.name}.png`,
    });
    await page.locator("#frqSeeWhy").click();
    await expect(page.locator(".frq-result.is-partial")).toHaveCount(2);
    for (const index of [0, 3]) {
      const card = page.locator(".frq-card").nth(index);
      await expect(card.locator(".frq-result")).toHaveText(
        "△ Partly correct (½)",
      );
      await expect(card.locator(".frq-result")).toHaveCSS(
        "color",
        "rgb(242, 86, 0)",
      );
      await expect(card.locator(".frq-answer-value.is-partial")).toHaveCSS(
        "color",
        "rgb(242, 86, 0)",
      );
      await expect(card.locator(".frq-answer-label").first()).toHaveCSS(
        "color",
        "rgb(0, 0, 0)",
      );
    }
    await page.locator("#frqRestart").click();
    await expect(page.locator(".frq-result.is-partial")).toHaveCount(0);
    await expect(page.locator("#frqSubmit")).toBeDisabled();
  });
}

test("wrong Normal or extra wrong signs cannot receive partial credit", async ({
  page,
}) => {
  await openQuiz(page);
  await fillAnswers(page);
  await page.locator("#frq-0-sign-1").click();
  await page.locator("#frq-0-normal-0").click();
  await page.locator("#frq-3-sign-3").click();
  await page.locator("#frq-3-sign-4").click();
  await page.locator("#frqSubmit").click();
  await expect(page.locator("#frqScore")).toHaveText(
    "3 correct · 2 incorrect out of 5 questions.",
  );
  await expect(page.locator("#frqPoints")).toHaveText("Score: 3 / 5");
});

test("PEC shared Previous and Next styles also apply outside the quiz", async ({
  page,
}) => {
  await page.goto("/#pecWorkshop", { waitUntil: "domcontentloaded" });
  const workshop = page.locator("#pecWorkshopPage");
  await workshop.locator('[data-folder="introduction"]').click();
  await workshop.locator('[data-nested-folder="gettingStarted"]').click();
  await workshop.locator('[data-pec-lesson="objectives"]').click();
  await expect(page.locator("#pecEyeLessonPage .pec-flow-prev")).toHaveCSS(
    "color",
    "rgb(0, 217, 0)",
  );
  for (const selector of [".pec-flow-prev", ".pec-flow-next"]) {
    await expect(page.locator(`#pecEyeLessonPage ${selector}`)).toHaveCSS(
      "border-radius",
      "14px",
    );
  }
});
