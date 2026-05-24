import fs from "node:fs";
import { expect, test } from "@playwright/test";
import sharp from "sharp";

const ROUTE_READY_TIMEOUT_MS = 30_000;
const STAGE_COMPLETE_TIMEOUT_MS = 45_000;

const DIABETIC_FUNDAL_ROUTES = [
  "diabeticObservationFundalReflex",
  "diabeticPositioningFlightPath",
  "diabeticHowToExamine",
  "diabeticBioPreparation",
  "diabeticBioFundoscopySitting",
  "diabeticBioFundoscopyIndentation",
];

async function prepareRoute(page, routeName, runtimeOptions = {}) {
  await page.addInitScript(
    (runtimeConfig) => {
      window.__ARCLIGHT_E2E__ = {
        ...(window.__ARCLIGHT_E2E__ || {}),
        ...runtimeConfig,
      };
      try {
        localStorage.setItem("arclight:onboarded", "1");
      } catch {
        // Ignore storage failures in constrained browser contexts.
      }
    },
    {
      fundalPlaybackRate: 12,
      ...runtimeOptions,
    },
  );

  await page.goto(`/#${routeName}`, {
    waitUntil: "domcontentloaded",
    timeout: ROUTE_READY_TIMEOUT_MS,
  });
}

async function waitForFundalStageReady(page, routeName, stageIndex) {
  await page.waitForFunction(
    ({ targetRouteName, targetStageIndex }) => {
      const fundal = window.__ARCLIGHT_E2E__?.fundal;
      if (!fundal || typeof fundal.getStageState !== "function") return false;
      const state = fundal.getStageState(targetRouteName, targetStageIndex);
      return state?.ready === true && state?.failed !== true;
    },
    { targetRouteName: routeName, targetStageIndex: stageIndex },
    { timeout: ROUTE_READY_TIMEOUT_MS },
  );
}

async function getFundalStageState(page, routeName, stageIndex) {
  return page.evaluate(
    ({ targetRouteName, targetStageIndex }) =>
      window.__ARCLIGHT_E2E__?.fundal?.getStageState?.(
        targetRouteName,
        targetStageIndex,
      ) || null,
    { targetRouteName: routeName, targetStageIndex: stageIndex },
  );
}

async function seekFundalStage(page, routeName, stageIndex, frame) {
  return page.evaluate(
    async ({ targetRouteName, targetStageIndex, targetFrame }) =>
      window.__ARCLIGHT_E2E__?.fundal?.seekStage?.(
        targetRouteName,
        targetStageIndex,
        targetFrame,
      ) || null,
    {
      targetRouteName: routeName,
      targetStageIndex: stageIndex,
      targetFrame: frame,
    },
  );
}

async function getStagePixelStats(stageLocator) {
  const screenshot = await stageLocator.screenshot();
  const { data, info } = await sharp(screenshot)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, info };
}

async function getNonWhitePixelRatio(stageLocator) {
  const { data, info } = await getStagePixelStats(stageLocator);
  let nonWhitePixels = 0;
  let totalPixels = 0;

  for (let i = 0; i < data.length; i += info.channels) {
    const alpha = data[i + 3] ?? 255;
    if (alpha < 20) continue;
    totalPixels += 1;

    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];
    if (red <= 245 || green <= 245 || blue <= 245) {
      nonWhitePixels += 1;
    }
  }

  return totalPixels > 0 ? nonWhitePixels / totalPixels : 0;
}

async function getRightRedPixelRatio(stageLocator) {
  const { data, info } = await getStagePixelStats(stageLocator);
  const startX = Math.floor(info.width * 0.62);
  const endX = Math.floor(info.width * 0.98);
  const startY = Math.floor(info.height * 0.38);
  const endY = Math.floor(info.height * 0.8);
  let redPixels = 0;
  let totalPixels = 0;

  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      const index = (y * info.width + x) * info.channels;
      const alpha = data[index + 3] ?? 255;
      if (alpha < 20) continue;
      totalPixels += 1;

      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      if (
        red > 150 &&
        green < 135 &&
        blue < 135 &&
        red > green * 1.25 &&
        red > blue * 1.25
      ) {
        redPixels += 1;
      }
    }
  }

  return totalPixels > 0 ? redPixels / totalPixels : 0;
}

test.describe("Diabetic fundal scrollytelling regressions", () => {
  for (const routeName of DIABETIC_FUNDAL_ROUTES) {
    test(`${routeName} global back returns to diabetic workshop`, async ({
      page,
    }) => {
      await prepareRoute(page, routeName);
      await expect(
        page.locator(".childhood-fundal-prep-stage").first(),
      ).toBeVisible({
        timeout: ROUTE_READY_TIMEOUT_MS,
      });

      await page.locator("#backBtnGlobal").click();
      await expect(
        page.locator("#diabeticRetinopathyWorkshopPage"),
      ).toBeVisible({
        timeout: ROUTE_READY_TIMEOUT_MS,
      });
    });
  }

  test("Observation stage 2 down arrow anchors under findings text", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium-desktop",
      "Desktop geometry regression is covered once.",
    );

    await prepareRoute(page, "diabeticObservationFundalReflex");
    const stages = page.locator(".childhood-fundal-prep-stage");
    await expect(stages).toHaveCount(5, { timeout: ROUTE_READY_TIMEOUT_MS });

    await expect(
      stages.nth(0).locator(".childhood-fundal-stage-replay-btn"),
    ).toBeVisible({
      timeout: STAGE_COMPLETE_TIMEOUT_MS,
    });
    await page
      .locator(
        '.childhood-fundal-prep-item[data-file-index="0"] [data-fundal-stage-next-btn="1"]',
      )
      .click({ force: true });

    await expect(
      stages.nth(1).locator(".childhood-fundal-stage-replay-btn"),
    ).toBeVisible({
      timeout: STAGE_COMPLETE_TIMEOUT_MS,
    });

    const geometry = await page.evaluate(() => {
      const item = document.querySelector(
        '.childhood-fundal-prep-item[data-file-index="1"]',
      );
      const arrow = item?.querySelector(
        ".childhood-fundal-scroll-down-arrow.is-visible",
      );
      const paragraphs = item?.querySelectorAll(
        ".childhood-fundal-segment-text__paragraph",
      );
      const arrowRect = arrow?.getBoundingClientRect?.();
      const p2Rect = paragraphs?.[1]?.getBoundingClientRect?.();
      const p3Rect = paragraphs?.[2]?.getBoundingClientRect?.();
      return {
        arrowTop: arrowRect?.top ?? null,
        arrowBottom: arrowRect?.bottom ?? null,
        p2Bottom: p2Rect?.bottom ?? null,
        p3Top: p3Rect?.top ?? null,
      };
    });

    expect(geometry.arrowTop).toBeGreaterThan(geometry.p2Bottom);
    expect(geometry.arrowBottom).toBeLessThan(geometry.p3Top);
  });

  test("How to Examine stage 2 text triggers before final left arrow asset", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium-desktop",
      "JSON and frame trigger regression is browser independent.",
    );

    await prepareRoute(page, "diabeticHowToExamine");
    await waitForFundalStageReady(page, "diabeticHowToExamine", 1);

    const itemText = page.locator(
      '.childhood-fundal-prep-item[data-file-index="1"] .childhood-fundal-segment-text',
    );

    await seekFundalStage(page, "diabeticHowToExamine", 1, 97);
    await expect(itemText).not.toContainText("Follow the four main branches");

    await seekFundalStage(page, "diabeticHowToExamine", 1, 98);
    await expect(itemText).toContainText("Follow the four main branches");

    await seekFundalStage(page, "diabeticHowToExamine", 1, 628);
    await expect(itemText).not.toContainText("Finally, ask the patient");

    await seekFundalStage(page, "diabeticHowToExamine", 1, 629);
    await expect(itemText).toContainText("Finally, ask the patient");

    const data = JSON.parse(
      fs.readFileSync(
        "public/scrolly/coreexam/ophths/DO/03HowtoExamine/2/data.json",
        "utf8",
      ),
    );
    expect(data.layers?.[0]?.hd).not.toBe(true);
  });

  test("Positioning stage 4 hides masked fundus until the late iOS WebKit reveal", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "webkit-iphone",
      "This regression targets an iOS/WebKit canvas mask timing issue.",
    );

    await prepareRoute(page, "diabeticPositioningFlightPath", {
      disableFundalAutoplay: true,
    });
    await waitForFundalStageReady(page, "diabeticPositioningFlightPath", 3);

    const stage = page.locator(
      '.childhood-fundal-prep-item[data-file-index="3"] .childhood-fundal-prep-stage',
    );
    await stage.scrollIntoViewIfNeeded();

    await seekFundalStage(page, "diabeticPositioningFlightPath", 3, 0);
    await page.waitForTimeout(300);
    const earlyRedRatio = await getRightRedPixelRatio(stage);

    await seekFundalStage(page, "diabeticPositioningFlightPath", 3, 525);
    await page.waitForTimeout(300);
    const lateRedRatio = await getRightRedPixelRatio(stage);

    expect(
      await getFundalStageState(page, "diabeticPositioningFlightPath", 3),
    ).toMatchObject({ renderType: "svg" });
    expect(earlyRedRatio).toBeLessThan(0.01);
    expect(lateRedRatio).toBeGreaterThan(0.05);
  });

  test("Preparation stage 3 avoids iOS WebKit blank frames around segment pauses", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "webkit-iphone",
      "This regression targets an iOS/WebKit SVG paint drop at pause frames.",
    );

    await prepareRoute(page, "diabeticBioPreparation", {
      disableFundalAutoplay: true,
    });
    await waitForFundalStageReady(page, "diabeticBioPreparation", 2);

    const stage = page.locator(
      '.childhood-fundal-prep-item[data-file-index="2"] .childhood-fundal-prep-stage',
    );
    await stage.scrollIntoViewIfNeeded();

    expect(
      await getFundalStageState(page, "diabeticBioPreparation", 2),
    ).toMatchObject({ renderType: "canvas" });

    for (const frame of [183, 184, 271, 272, 340, 341, 404]) {
      await seekFundalStage(page, "diabeticBioPreparation", 2, frame);
      await page.waitForTimeout(120);
      expect(await getNonWhitePixelRatio(stage)).toBeGreaterThan(0.2);
    }
  });

  test("Fundoscopy Sitting advances on iOS WebKit and holds exact final frames", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "webkit-iphone",
      "This regression targets iOS/WebKit masking and blank-frame behavior.",
    );

    await prepareRoute(page, "diabeticBioFundoscopySitting");
    const stages = page.locator(".childhood-fundal-prep-stage");
    await expect(stages).toHaveCount(5, { timeout: ROUTE_READY_TIMEOUT_MS });

    await expect(
      stages.nth(0).locator(".childhood-fundal-stage-replay-btn"),
    ).toBeVisible({
      timeout: STAGE_COMPLETE_TIMEOUT_MS,
    });
    await expect
      .poll(() => getFundalStageState(page, "diabeticBioFundoscopySitting", 0))
      .toMatchObject({ completed: true, currentFrame: 224 });

    await page
      .locator(
        '.childhood-fundal-prep-item[data-file-index="0"] [data-fundal-stage-next-btn="1"]',
      )
      .click({ force: true });

    await expect(
      stages.nth(1).locator(".childhood-fundal-stage-replay-btn"),
    ).toBeVisible({
      timeout: STAGE_COMPLETE_TIMEOUT_MS,
    });
    await expect
      .poll(() => getFundalStageState(page, "diabeticBioFundoscopySitting", 1))
      .toMatchObject({
        completed: true,
        currentFrame: 224,
        renderType: "canvas",
      });
    await expect(
      page.locator(
        '.childhood-fundal-prep-item[data-file-index="1"] .childhood-fundal-recovery-overlay img',
      ),
    ).toHaveAttribute(
      "src",
      /\/scrolly\/coreexam\/ophths\/BIO\/02FundoscopySitting\/2\/final_frame\.png$/,
    );

    await page
      .locator(
        '.childhood-fundal-prep-item[data-file-index="1"] [data-fundal-stage-next-btn="1"]',
      )
      .click({ force: true });

    await expect(
      stages.nth(2).locator(".childhood-fundal-stage-replay-btn"),
    ).toBeVisible({
      timeout: STAGE_COMPLETE_TIMEOUT_MS,
    });
    await expect
      .poll(() => getFundalStageState(page, "diabeticBioFundoscopySitting", 2))
      .toMatchObject({
        completed: true,
        currentFrame: 224,
        renderType: "canvas",
      });
    await expect(
      page.locator(
        '.childhood-fundal-prep-item[data-file-index="2"] .childhood-fundal-segment-text',
      ),
    ).toContainText("If you see shadows");

    await page
      .locator(
        '.childhood-fundal-prep-item[data-file-index="2"] [data-fundal-stage-next-btn="1"]',
      )
      .click({ force: true });

    await expect(
      stages.nth(3).locator(".childhood-fundal-stage-replay-btn"),
    ).toBeVisible({
      timeout: STAGE_COMPLETE_TIMEOUT_MS,
    });
    await expect
      .poll(() => getFundalStageState(page, "diabeticBioFundoscopySitting", 3))
      .toMatchObject({
        completed: true,
        currentFrame: 270,
        renderType: "canvas",
      });

    await page
      .locator(
        '.childhood-fundal-prep-item[data-file-index="3"] [data-fundal-stage-next-btn="1"]',
      )
      .click({ force: true });

    await expect(
      stages.nth(4).locator(".childhood-fundal-stage-replay-btn"),
    ).toBeVisible({
      timeout: STAGE_COMPLETE_TIMEOUT_MS,
    });
    await expect
      .poll(() => getFundalStageState(page, "diabeticBioFundoscopySitting", 4))
      .toMatchObject({
        completed: true,
        currentFrame: 164,
        renderType: "canvas",
      });
  });

  test("Fundoscopy with Indentation holds final frames and pupil-up ask segment", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium-desktop",
      "Segment timing regression is browser independent.",
    );

    await prepareRoute(page, "diabeticBioFundoscopyIndentation");
    const stages = page.locator(".childhood-fundal-prep-stage");
    await expect(stages).toHaveCount(4, { timeout: ROUTE_READY_TIMEOUT_MS });

    await expect(
      stages.nth(0).locator(".childhood-fundal-stage-replay-btn"),
    ).toBeVisible({
      timeout: STAGE_COMPLETE_TIMEOUT_MS,
    });
    await expect
      .poll(() =>
        getFundalStageState(page, "diabeticBioFundoscopyIndentation", 0),
      )
      .toMatchObject({ completed: true, currentFrame: 104 });
    await expect(
      page.locator(
        '.childhood-fundal-prep-item[data-file-index="0"] .childhood-fundal-recovery-overlay img',
      ),
    ).toHaveAttribute(
      "src",
      /\/scrolly\/coreexam\/ophths\/BIO\/03FundoscopywithIndentation\/1\/final_frame\.png$/,
    );

    await waitForFundalStageReady(page, "diabeticBioFundoscopyIndentation", 1);
    await expect
      .poll(() =>
        getFundalStageState(page, "diabeticBioFundoscopyIndentation", 1),
      )
      .toMatchObject({
        playbackSegments: [
          { from: 0, to: 59 },
          { from: 60, to: 87 },
          { from: 88, to: 104 },
        ],
        playbackSegmentRates: [1, 0.5, 0.5],
      });

    await page
      .locator(
        '.childhood-fundal-prep-item[data-file-index="0"] [data-fundal-stage-next-btn="1"]',
      )
      .click({ force: true });
    await page
      .locator('.childhood-fundal-prep-item[data-file-index="1"]')
      .evaluate((item) => item.scrollIntoView({ block: "center" }));
    await expect(
      stages.nth(1).locator(".childhood-fundal-stage-replay-btn"),
    ).toBeVisible({
      timeout: STAGE_COMPLETE_TIMEOUT_MS,
    });
    await expect
      .poll(() =>
        getFundalStageState(page, "diabeticBioFundoscopyIndentation", 1),
      )
      .toMatchObject({
        completed: true,
        currentFrame: 104,
        recoveryOverlayVisible: true,
        recoveryOverlayImageSrc: expect.stringMatching(
          /\/scrolly\/coreexam\/ophths\/BIO\/03FundoscopywithIndentation\/2\/final_frame\.png$/,
        ),
      });

    const stageText = page.locator(
      '.childhood-fundal-prep-item[data-file-index="1"] .childhood-fundal-segment-text',
    );

    await seekFundalStage(page, "diabeticBioFundoscopyIndentation", 1, 60);
    await expect(stageText).not.toContainText(
      "Ask the patient to look towards the area being examined",
    );

    await seekFundalStage(page, "diabeticBioFundoscopyIndentation", 1, 61);
    await expect(stageText).toContainText(
      "Ask the patient to look towards the area being examined",
    );

    const seekResult = await seekFundalStage(
      page,
      "diabeticBioFundoscopyIndentation",
      1,
      104,
    );
    await expect(stageText).toContainText(
      "Ask the patient to look towards the area being examined",
    );
    await expect(stageText).not.toContainText(
      "This example shows the examination of the superior retina",
    );
    expect(seekResult).toMatchObject({ currentFrame: 104 });
  });
});
