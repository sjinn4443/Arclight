import { chromium, devices, expect, test, webkit } from "@playwright/test";
import sharp from "sharp";

const ROUTE_READY_TIMEOUT_MS = 30_000;
const MOBILE_VIEWPORT = { width: 390, height: 844 };
const COMP_WIDTH = 1169;
const COMP_HEIGHT = 1280;
const ROI_NORMALIZED_WIDTH = 24;
const ROI_NORMALIZED_HEIGHT = 24;
const ROI_DIFF_PIXEL_THRESHOLD = 18;
const MAX_ROI_MEAN_DIFF = 0.18;
const MAX_ROI_CHANGED_PIXEL_RATIO = 0.38;
const MIN_ROI_CORRELATION = 0.42;

const CASES = [
  {
    routeName: "childhoodFundalPreparation",
    stageCount: 3,
    stageIndex: 1,
    label: "prep-3-masked-scene",
    checkpoints: [
      {
        frame: 40,
        label: "scene-1",
        roiCompRect: { left: 252, top: 76, right: 612, bottom: 342 },
      },
      {
        frame: 112,
        label: "scene-2",
        roiCompRect: { left: 267, top: 328, right: 581, bottom: 577 },
      },
      {
        frame: 228,
        label: "scene-3",
        roiCompRect: { left: 263, top: 574, right: 625, bottom: 820 },
      },
      {
        frame: 400,
        label: "scene-4",
        roiCompRect: { left: 284, top: 813, right: 602, bottom: 1061 },
      },
    ],
  },
];

test.describe("Fundal iOS visual parity", () => {
  for (const testCase of CASES) {
    test(`${testCase.routeName} stage ${testCase.stageIndex + 1} matches chromium structure on iOS`, async ({}, testInfo) => {
      test.skip(
        testInfo.project.name !== "chromium-desktop",
        "This suite launches Chromium and WebKit directly for parity checks.",
      );
      test.setTimeout(120_000);

      const baseURL =
        String(testInfo.project.use?.baseURL || "").trim() ||
        "http://localhost:4173";

      const [chromiumBrowser, webkitBrowser] = await Promise.all([
        chromium.launch(),
        webkit.launch(),
      ]);

      let chromiumContext = null;
      let webkitContext = null;

      try {
        chromiumContext = await chromiumBrowser.newContext({
          viewport: MOBILE_VIEWPORT,
          deviceScaleFactor: 1,
          hasTouch: true,
          isMobile: true,
          locale: "en-US",
          serviceWorkers: "block",
        });
        webkitContext = await webkitBrowser.newContext({
          ...devices["iPhone 13"],
          viewport: MOBILE_VIEWPORT,
          deviceScaleFactor: 1,
          locale: "en-US",
          serviceWorkers: "block",
        });

        const chromiumPage = await chromiumContext.newPage();
        const webkitPage = await webkitContext.newPage();

        await Promise.all([
          prepareFundalPage(chromiumPage, baseURL, testCase),
          prepareFundalPage(webkitPage, baseURL, testCase),
        ]);

        const chromiumStage = chromiumPage
          .locator(".childhood-fundal-prep-stage")
          .nth(testCase.stageIndex);
        const webkitStage = webkitPage
          .locator(".childhood-fundal-prep-stage")
          .nth(testCase.stageIndex);

        const comparisons = [];
        for (const checkpoint of testCase.checkpoints) {
          const [chromiumState, webkitState] = await Promise.all([
            seekFundalStage(
              chromiumPage,
              testCase.routeName,
              testCase.stageIndex,
              checkpoint.frame,
            ),
            seekFundalStage(
              webkitPage,
              testCase.routeName,
              testCase.stageIndex,
              checkpoint.frame,
            ),
          ]);

          await Promise.all([
            centerStageInViewport(chromiumPage, chromiumStage),
            centerStageInViewport(webkitPage, webkitStage),
          ]);

          const chromiumRender = resolveRenderLocator(
            chromiumStage,
            chromiumState,
          );
          const webkitRender = resolveRenderLocator(webkitStage, webkitState);

          const [chromiumBuffer, webkitBuffer] = await Promise.all([
            chromiumRender.screenshot({
              animations: "disabled",
              scale: "css",
            }),
            webkitRender.screenshot({
              animations: "disabled",
              scale: "css",
            }),
          ]);

          const comparison = await compareStageScreenshots(
            chromiumBuffer,
            webkitBuffer,
            checkpoint.roiCompRect,
          );

          comparisons.push({
            checkpoint,
            chromiumState,
            webkitState,
            comparison,
            chromiumBuffer,
            webkitBuffer,
          });
        }

        const failures = comparisons.filter(
          (entry) => !entry.comparison.passes,
        );
        if (failures.length > 0) {
          await testInfo.attach(`${testCase.label}-metrics`, {
            body: JSON.stringify(
              comparisons.map((entry) => ({
                checkpoint: entry.checkpoint,
                chromiumState: entry.chromiumState,
                webkitState: entry.webkitState,
                comparison: entry.comparison,
              })),
              null,
              2,
            ),
            contentType: "application/json",
          });

          for (const failure of failures) {
            await testInfo.attach(
              `${testCase.label}-${failure.checkpoint.label}-chromium`,
              {
                body: failure.chromiumBuffer,
                contentType: "image/png",
              },
            );
            await testInfo.attach(
              `${testCase.label}-${failure.checkpoint.label}-webkit`,
              {
                body: failure.webkitBuffer,
                contentType: "image/png",
              },
            );
          }
        }

        expect(
          failures.length,
          buildParityFailureMessage(testCase, comparisons),
        ).toBe(0);
      } finally {
        await Promise.allSettled([
          chromiumContext?.close(),
          webkitContext?.close(),
        ]);
        await Promise.allSettled([
          chromiumBrowser.close(),
          webkitBrowser.close(),
        ]);
      }
    });
  }
});

async function prepareFundalPage(page, baseURL, testCase) {
  await page.addInitScript(() => {
    window.__ARCLIGHT_E2E__ = {
      ...(window.__ARCLIGHT_E2E__ || {}),
      disableFundalAutoplay: true,
    };
    try {
      localStorage.setItem("arclight:onboarded", "1");
    } catch {
      // Ignore storage failures in constrained browser contexts.
    }
  });

  await page.goto(`${baseURL}/#${testCase.routeName}`, {
    waitUntil: "domcontentloaded",
    timeout: ROUTE_READY_TIMEOUT_MS,
  });

  const stages = page.locator(".childhood-fundal-prep-stage");
  await expect(stages).toHaveCount(testCase.stageCount, {
    timeout: ROUTE_READY_TIMEOUT_MS,
  });

  const stage = stages.nth(testCase.stageIndex);
  await expect(stage).toBeVisible({
    timeout: ROUTE_READY_TIMEOUT_MS,
  });
  await centerStageInViewport(page, stage);

  await page.waitForFunction(
    ({ routeName, stageIndex }) => {
      const fundal = window.__ARCLIGHT_E2E__?.fundal;
      if (!fundal || typeof fundal.getStageState !== "function") return false;
      const state = fundal.getStageState(routeName, stageIndex);
      return state?.ready === true && state?.failed !== true;
    },
    {
      routeName: testCase.routeName,
      stageIndex: testCase.stageIndex,
    },
    { timeout: ROUTE_READY_TIMEOUT_MS },
  );
}

async function seekFundalStage(page, routeName, stageIndex, frame) {
  const stageState = await page.evaluate(
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

  expect(stageState).not.toBeNull();
  expect(stageState?.ready).toBe(true);
  expect(stageState?.failed).toBe(false);
  return stageState;
}

async function centerStageInViewport(page, stage) {
  await stage.evaluate((stageEl) => {
    const rect = stageEl.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement?.clientHeight || 0;
    const currentTop = window.scrollY || window.pageYOffset || 0;
    const targetTop =
      currentTop +
      rect.top -
      Math.max(0, (viewportHeight - Math.min(rect.height, viewportHeight)) / 2);
    window.scrollTo({
      top: Math.max(0, Math.floor(targetTop)),
      behavior: "auto",
    });
  });
  await page.waitForTimeout(180);
}

function resolveRenderLocator(stage, stageState) {
  if (stageState?.hasSvg) return stage.locator("svg").first();
  if (stageState?.hasCanvas) return stage.locator("canvas").first();
  return stage;
}

async function compareStageScreenshots(
  chromiumBuffer,
  webkitBuffer,
  roiCompRect,
) {
  const [chromiumProfile, webkitProfile] = await Promise.all([
    extractImageProfile(chromiumBuffer, roiCompRect),
    extractImageProfile(webkitBuffer, roiCompRect),
  ]);

  let diffSum = 0;
  let changedPixels = 0;

  for (let i = 0; i < chromiumProfile.values.length; i += 1) {
    const diff = Math.abs(chromiumProfile.values[i] - webkitProfile.values[i]);
    diffSum += diff;
    if (diff >= ROI_DIFF_PIXEL_THRESHOLD) changedPixels += 1;
  }

  const totalPixels = chromiumProfile.values.length || 1;
  const meanAbsDiff = diffSum / (255 * totalPixels);
  const changedPixelRatio = changedPixels / totalPixels;
  const correlation = computeCorrelation(
    chromiumProfile.values,
    webkitProfile.values,
  );

  return {
    roiCompRect,
    chromiumPixelRect: chromiumProfile.pixelRect,
    webkitPixelRect: webkitProfile.pixelRect,
    meanAbsDiff: round(meanAbsDiff),
    changedPixelRatio: round(changedPixelRatio),
    correlation: round(correlation),
    passes:
      meanAbsDiff <= MAX_ROI_MEAN_DIFF &&
      changedPixelRatio <= MAX_ROI_CHANGED_PIXEL_RATIO &&
      correlation >= MIN_ROI_CORRELATION,
  };
}

async function extractImageProfile(buffer, roiCompRect) {
  const image = sharp(buffer).flatten({ background: "#ffffff" });
  const metadata = await image.metadata();
  const pixelRect = scaleCompRectToPixels(
    roiCompRect,
    metadata.width,
    metadata.height,
  );
  const { data } = await image
    .extract(pixelRect)
    .greyscale()
    .normalize()
    .resize(ROI_NORMALIZED_WIDTH, ROI_NORMALIZED_HEIGHT, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  return {
    pixelRect,
    values: Array.from(data),
  };
}

function scaleCompRectToPixels(compRect, imageWidth, imageHeight) {
  const left = Math.max(
    0,
    Math.floor((Number(compRect?.left) / COMP_WIDTH) * imageWidth),
  );
  const top = Math.max(
    0,
    Math.floor((Number(compRect?.top) / COMP_HEIGHT) * imageHeight),
  );
  const right = Math.min(
    imageWidth,
    Math.ceil((Number(compRect?.right) / COMP_WIDTH) * imageWidth),
  );
  const bottom = Math.min(
    imageHeight,
    Math.ceil((Number(compRect?.bottom) / COMP_HEIGHT) * imageHeight),
  );

  return {
    left,
    top,
    width: Math.max(1, right - left),
    height: Math.max(1, bottom - top),
  };
}

function computeCorrelation(leftValues, rightValues) {
  const total = Math.min(leftValues.length, rightValues.length);
  if (total <= 0) return 0;

  let leftSum = 0;
  let rightSum = 0;
  for (let i = 0; i < total; i += 1) {
    leftSum += leftValues[i];
    rightSum += rightValues[i];
  }
  const leftMean = leftSum / total;
  const rightMean = rightSum / total;

  let numerator = 0;
  let leftVariance = 0;
  let rightVariance = 0;
  for (let i = 0; i < total; i += 1) {
    const leftDelta = leftValues[i] - leftMean;
    const rightDelta = rightValues[i] - rightMean;
    numerator += leftDelta * rightDelta;
    leftVariance += leftDelta * leftDelta;
    rightVariance += rightDelta * rightDelta;
  }

  const denominator = Math.sqrt(leftVariance * rightVariance);
  if (denominator <= 1e-6) {
    return numerator === 0 ? 1 : 0;
  }
  return numerator / denominator;
}

function buildParityFailureMessage(testCase, comparisons) {
  const details = comparisons
    .map((entry) => {
      const { checkpoint, chromiumState, webkitState, comparison } = entry;
      return `frame ${checkpoint.frame} (${checkpoint.label})\nchromium ${JSON.stringify(chromiumState)}\nwebkit ${JSON.stringify(webkitState)}\ncomparison ${JSON.stringify(comparison)}`;
    })
    .join("\n\n");

  return `${testCase.routeName} stage ${testCase.stageIndex + 1} diverged between Chromium and iOS WebKit.\n${details}`;
}

function round(value) {
  return Number.isFinite(value) ? Number(value.toFixed(4)) : null;
}
