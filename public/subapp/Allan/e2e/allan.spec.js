import { test, expect } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

test.use({ viewport: { width: 360, height: 740 } });

test("compact shell, photo readiness and location keyboard controls work", async ({
  page,
}) => {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/index.html?v=e2e");
  await expect(page.getByRole("heading", { name: "Allan" })).toBeVisible();
  await expect(page.locator("#photoReadiness")).toHaveText("Photos 0/3");

  await page.locator("#locationPickerButton").focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(page.locator("#locationPickerLabel")).toHaveText("Other");

  await page.getByRole("tab", { name: "Rash" }).click();
  await expect(page.locator("#photoReadiness")).toHaveText("Photos 0/2");
  expect(errors).toEqual([]);
});

test("main assessment routes fit the 360 x 740 viewport without document scrolling", async ({
  page,
}) => {
  await page.goto("/index.html?v=e2e-fit");

  const overflows = [];
  for (const tabName of ["Lesion", "Dermoscopy", "Rash", "Wood's"]) {
    await page.getByRole("tab", { name: tabName }).click();
    const measurement = await page.evaluate(() => ({
      viewportHeight: window.innerHeight,
      documentHeight: Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      ),
    }));
    const overflowPx = measurement.documentHeight - measurement.viewportHeight;
    if (overflowPx > 0) {
      overflows.push({ tabName, overflowPx, ...measurement });
    }
  }

  expect(overflows).toEqual([]);
});

test("direct-file Lesion route fits the 360 x 740 viewport", async ({
  page,
}) => {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(pathToFileURL(resolve("index.html")).href);
  await expect(page.getByRole("heading", { name: "Allan" })).toBeVisible();

  const measurement = await page.evaluate(() => ({
    viewportHeight: window.innerHeight,
    documentHeight: Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
    ),
  }));

  expect(measurement.documentHeight).toBeLessThanOrEqual(
    measurement.viewportHeight,
  );
  expect(errors).toEqual([]);
});

test("New assessment removes photos and clinical selections but leaves the app usable", async ({
  page,
}) => {
  await page.goto("/index.html?v=e2e-reset");
  await page.locator("#closeInput").setInputFiles({
    name: "clinical-close.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await page.getByRole("checkbox", { name: "Asymmetry" }).check();
  await expect(page.locator("#photoReadiness")).toHaveText("Photos 1/3");

  await page.locator("#newAssessmentButton").click();
  await expect(page.locator("#newAssessmentButton")).toHaveText("Clear?");
  await page.locator("#newAssessmentButton").click();

  await expect(
    page.getByRole("checkbox", { name: "Asymmetry" }),
  ).not.toBeChecked();
  await expect(page.locator("#closePreview")).toBeHidden();
  await expect(page.locator("#actionText")).toHaveText("Not assessed yet");
  await expect(page.locator("#photoReadiness")).toHaveText("Photos 0/3");
});

test("Primary MCQ has complete-answer guard, review feedback and a real retry", async ({
  page,
}) => {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/index.html?v=e2e-mcq-quality");
  await page.locator("#burger-icon").click();
  await page.getByRole("button", { name: "Primary MCQ" }).click();
  await expect(page.locator("#mcqTitle")).toHaveText("Primary MCQ");
  await expect(page.locator("#mcqIntro")).toContainText("pass mark 3");
  await expect(page.locator("#mcqContainer .question")).toHaveCount(5);

  await page.locator("#submitMcqButton").click();
  await expect(page.locator("#mcqResult")).toHaveText(
    "Answer every question before submitting.",
  );

  await page.locator("#mcqContainer .question").evaluateAll((fieldsets) => {
    fieldsets.forEach((fieldset) => {
      const correctAnswer = fieldset.dataset.correctAnswer;
      const option = [...fieldset.querySelectorAll("input")].find(
        (input) => input.value === correctAnswer,
      );
      if (option) option.click();
    });
  });
  await page.locator("#submitMcqButton").click();
  await expect(page.locator("#mcqResult")).toContainText("Score 5/5 - Pass.");
  await expect(page.locator(".mcq-explanation:visible")).toHaveCount(5);
  await expect(page.locator("#retryMcqButton")).toBeVisible();
  await page.screenshot({
    path: "output/playwright/allan-mcq-primary-review-360x740.png",
    fullPage: false,
  });

  await page.locator("#retryMcqButton").click();
  await expect(page.locator("#mcqContainer input:checked")).toHaveCount(0);
  await expect(page.locator("#submitMcqButton")).toBeVisible();
  await expect(page.locator("#retryMcqButton")).toBeHidden();
  expect(
    await page
      .locator(".question .options label")
      .first()
      .evaluate((element) => element.getBoundingClientRect().height),
  ).toBeGreaterThanOrEqual(44);
  expect(errors).toEqual([]);
});

test("installed app shell reloads while offline", async ({ page, context }) => {
  await page.goto("/index.html?v=e2e-offline");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Allan" })).toBeVisible();
});
