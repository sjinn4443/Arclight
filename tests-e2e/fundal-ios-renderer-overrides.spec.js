import { expect, test } from "@playwright/test";

const ROUTE_READY_TIMEOUT_MS = 30_000;

const CASES = [
  {
    routeName: "childhoodFundalAfterExamination",
    svgStageIndexes: [0],
    canvasStageIndexes: [1],
  },
  {
    routeName: "childhoodFundalExamination",
    svgStageIndexes: [4],
    canvasStageIndexes: [0, 1, 2, 3],
  },
  {
    routeName: "childhoodFundalNewbornEyesClosed",
    svgStageIndexes: [0, 1],
    canvasStageIndexes: [],
  },
];

test.describe("Fundal iOS renderer overrides", () => {
  for (const testCase of CASES) {
    test(`${testCase.routeName} uses svg on masked iOS files`, async ({
      page,
    }, testInfo) => {
      test.skip(
        testInfo.project.name !== "webkit-iphone",
        "This check is specific to iOS WebKit renderer selection.",
      );

      await page.addInitScript(() => {
        try {
          localStorage.setItem("arclight:onboarded", "1");
        } catch {
          // Ignore storage failures in constrained browser contexts.
        }
      });

      await page.goto(`/#${testCase.routeName}`, {
        waitUntil: "domcontentloaded",
        timeout: ROUTE_READY_TIMEOUT_MS,
      });

      const stages = page.locator(".childhood-fundal-prep-stage");
      await expect(stages).toHaveCount(
        testCase.svgStageIndexes.length + testCase.canvasStageIndexes.length,
        {
          timeout: ROUTE_READY_TIMEOUT_MS,
        },
      );

      for (const index of testCase.svgStageIndexes) {
        const stage = stages.nth(index);
        await expect
          .poll(
            async () =>
              stage.evaluate((stageEl) => ({
                hasSvg: !!stageEl.querySelector("svg"),
                hasCanvas: !!stageEl.querySelector("canvas"),
              })),
            { timeout: ROUTE_READY_TIMEOUT_MS },
          )
          .toEqual({ hasSvg: true, hasCanvas: false });
      }

      for (const index of testCase.canvasStageIndexes) {
        const stage = stages.nth(index);
        await expect
          .poll(
            async () =>
              stage.evaluate((stageEl) => ({
                hasSvg: !!stageEl.querySelector("svg"),
                hasCanvas: !!stageEl.querySelector("canvas"),
              })),
            { timeout: ROUTE_READY_TIMEOUT_MS },
          )
          .toEqual({ hasSvg: false, hasCanvas: true });
      }
    });
  }
});
