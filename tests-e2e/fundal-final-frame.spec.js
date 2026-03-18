import { expect, test } from "@playwright/test";

const FUNDAL_ROUTES = [
  { routeName: "childhoodFundalPreparation", stageCount: 4 },
  { routeName: "childhoodFundalExamination", stageCount: 5 },
  { routeName: "childhoodFundalNewbornEyesOpen", stageCount: 3 },
  { routeName: "childhoodFundalNewbornEyesClosed", stageCount: 2 },
  { routeName: "childhoodFundalUnclearFindings", stageCount: 4 },
  { routeName: "childhoodFundalPossibleFinding", stageCount: 2 },
  { routeName: "childhoodFundalAfterExamination", stageCount: 2 },
];

const E2E_FUNDAL_PLAYBACK_RATE = 8;
const ROUTE_READY_TIMEOUT_MS = 30_000;
const STAGE_COMPLETE_TIMEOUT_MS = 20_000;
const HOLD_SAMPLE_DELAYS_MS = [0, 350, 900];
const SVG_MIN_AREA_RATIO = 0.045;
const CANVAS_MIN_VISIBLE_RATIO = 0.04;
const CANVAS_MIN_NON_WHITE_RATIO = 0.012;
const CANVAS_MIN_NON_WHITE_VISIBLE_RATIO = 0.03;

test.describe("Fundal Reflex Final Frame Hold", () => {
  for (const route of FUNDAL_ROUTES) {
    test(`${route.routeName} holds non-empty final frames`, async ({
      page,
    }, testInfo) => {
      test.setTimeout(90_000);

      await page.addInitScript((playbackRate) => {
        window.__ARCLIGHT_E2E__ = {
          ...(window.__ARCLIGHT_E2E__ || {}),
          fundalPlaybackRate: playbackRate,
        };
        try {
          localStorage.setItem("arclight:onboarded", "1");
        } catch {
          // Ignore storage failures in constrained browser contexts.
        }
      }, E2E_FUNDAL_PLAYBACK_RATE);

      await page.goto(`/#${route.routeName}`, {
        waitUntil: "domcontentloaded",
        timeout: ROUTE_READY_TIMEOUT_MS,
      });

      const stages = page.locator(".childhood-fundal-prep-stage");
      await expect(stages).toHaveCount(route.stageCount, {
        timeout: ROUTE_READY_TIMEOUT_MS,
      });
      await expect(stages.first()).toBeVisible({
        timeout: ROUTE_READY_TIMEOUT_MS,
      });

      for (let index = 0; index < route.stageCount; index += 1) {
        const stage = stages.nth(index);
        await test.step(`stage ${index + 1}`, async () => {
          await centerStageInViewport(page, stage);
          await waitForStageCompletion(stage);

          const samples = [];
          let elapsedDelay = 0;
          for (const delayMs of HOLD_SAMPLE_DELAYS_MS) {
            const waitMs = Math.max(0, delayMs - elapsedDelay);
            if (waitMs > 0) {
              await page.waitForTimeout(waitMs);
            }
            elapsedDelay = delayMs;
            samples.push({
              delayMs,
              metrics: await collectStageMetrics(stage),
            });
          }

          const failures = samples.filter(
            (sample) => !sample.metrics.passesHold,
          );
          if (failures.length > 0) {
            const screenshotPath = testInfo.outputPath(
              `${route.routeName}-stage-${index + 1}.png`,
            );
            await stage.screenshot({ path: screenshotPath });
            await testInfo.attach(
              `${route.routeName}-stage-${index + 1}-metrics`,
              {
                body: JSON.stringify(samples, null, 2),
                contentType: "application/json",
              },
            );
            await testInfo.attach(
              `${route.routeName}-stage-${index + 1}-screenshot`,
              {
                path: screenshotPath,
                contentType: "image/png",
              },
            );
          }

          expect(
            failures,
            buildFailureMessage(route.routeName, index, samples),
          ).toEqual([]);
        });
      }
    });
  }
});

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
  await page.waitForTimeout(350);
}

async function waitForStageCompletion(stage) {
  const replayButton = stage.locator(".childhood-fundal-stage-replay-btn");
  await expect(replayButton).toBeVisible({
    timeout: STAGE_COMPLETE_TIMEOUT_MS,
  });
}

async function collectStageMetrics(stage) {
  return stage.evaluate(
    (stageEl, thresholds) => {
      const round = (value) =>
        Number.isFinite(value) ? Number(value.toFixed(4)) : null;

      const isElementVisible = (element) => {
        if (!element) return false;
        const style = window.getComputedStyle(element);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          Number.parseFloat(style.opacity || "1") <= 0.02
        ) {
          return false;
        }
        const rect = element.getBoundingClientRect();
        return rect.width > 0.5 && rect.height > 0.5;
      };

      const computeOverlapAreaRatio = (targetRect, containerRect) => {
        const overlapLeft = Math.max(targetRect.left, containerRect.left);
        const overlapRight = Math.min(targetRect.right, containerRect.right);
        const overlapTop = Math.max(targetRect.top, containerRect.top);
        const overlapBottom = Math.min(targetRect.bottom, containerRect.bottom);
        const overlapWidth = overlapRight - overlapLeft;
        const overlapHeight = overlapBottom - overlapTop;
        if (overlapWidth <= 0.5 || overlapHeight <= 0.5) return 0;
        const containerArea = Math.max(
          1,
          containerRect.width * containerRect.height,
        );
        return (overlapWidth * overlapHeight) / containerArea;
      };

      const analyzeSvg = (svgEl, containerRect) => {
        const nodes = svgEl.querySelectorAll(
          "image,path,rect,circle,ellipse,polygon,polyline,line,use,text",
        );
        let visibleAreaRatio = 0;
        let visibleNodeCount = 0;

        nodes.forEach((node) => {
          if (!isElementVisible(node)) return;
          const rect = node.getBoundingClientRect();
          const overlapAreaRatio = computeOverlapAreaRatio(rect, containerRect);
          if (overlapAreaRatio <= 0) return;
          visibleAreaRatio += overlapAreaRatio;
          visibleNodeCount += 1;
        });

        return {
          visibleAreaRatio: round(visibleAreaRatio),
          visibleNodeCount,
          isBlank: visibleNodeCount === 0 || visibleAreaRatio <= 0.01,
          passesHold: visibleAreaRatio >= thresholds.svgMinAreaRatio,
        };
      };

      const analyzeCanvas = (canvasEl) => {
        const ctx = canvasEl.getContext("2d", { willReadFrequently: true });
        if (!ctx || canvasEl.width <= 0 || canvasEl.height <= 0) {
          return {
            visibleRatio: 0,
            nonWhiteRatio: 0,
            nonWhiteAmongVisible: 0,
            isBlank: true,
            passesHold: false,
          };
        }

        const sampleSize = 24;
        const stepX = Math.max(1, Math.floor(canvasEl.width / sampleSize));
        const stepY = Math.max(1, Math.floor(canvasEl.height / sampleSize));

        let sampled = 0;
        let visible = 0;
        let nonWhite = 0;

        for (let y = 0; y < canvasEl.height; y += stepY) {
          for (let x = 0; x < canvasEl.width; x += stepX) {
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            sampled += 1;
            const alpha = pixel[3];
            if (alpha <= 16) continue;
            visible += 1;
            const [r, g, b] = pixel;
            if (r < 246 || g < 246 || b < 246) {
              nonWhite += 1;
            }
          }
        }

        const visibleRatio = sampled > 0 ? visible / sampled : 0;
        const nonWhiteRatio = sampled > 0 ? nonWhite / sampled : 0;
        const nonWhiteAmongVisible = visible > 0 ? nonWhite / visible : 0;
        const isBlank =
          visibleRatio <= 0.01 ||
          (visibleRatio <= 0.05 && nonWhiteRatio <= 0.015) ||
          (visibleRatio >= 0.6 && nonWhiteAmongVisible <= 0.012);
        const passesHold =
          !isBlank &&
          visibleRatio >= thresholds.canvasMinVisibleRatio &&
          nonWhiteRatio >= thresholds.canvasMinNonWhiteRatio &&
          nonWhiteAmongVisible >= thresholds.canvasMinNonWhiteVisibleRatio;

        return {
          visibleRatio: round(visibleRatio),
          nonWhiteRatio: round(nonWhiteRatio),
          nonWhiteAmongVisible: round(nonWhiteAmongVisible),
          isBlank,
          passesHold,
        };
      };

      const stageRect = stageEl.getBoundingClientRect();
      const replayButton = stageEl.querySelector(
        ".childhood-fundal-stage-replay-btn",
      );
      const overlay = stageEl.querySelector(
        ".childhood-fundal-recovery-overlay",
      );
      const overlayChild =
        overlay && isElementVisible(overlay) ? overlay.firstElementChild : null;
      const renderElement =
        overlayChild ||
        stageEl.querySelector(
          ":scope > canvas, :scope > svg, :scope > img.childhood-fundal-prep-stage__poster",
        );

      if (!renderElement || !isElementVisible(renderElement)) {
        return {
          renderType: "missing",
          replayVisible: isElementVisible(replayButton),
          isBlank: true,
          passesHold: false,
          stageAreaRatio: 0,
        };
      }

      const tagName = renderElement.tagName.toLowerCase();
      if (tagName === "svg") {
        const svgMetrics = analyzeSvg(renderElement, stageRect);
        return {
          renderType: overlayChild ? "overlay-svg" : "svg",
          replayVisible: isElementVisible(replayButton),
          stageAreaRatio: svgMetrics.visibleAreaRatio,
          ...svgMetrics,
        };
      }

      if (tagName === "canvas") {
        const canvasMetrics = analyzeCanvas(renderElement);
        return {
          renderType: "canvas",
          replayVisible: isElementVisible(replayButton),
          ...canvasMetrics,
        };
      }

      const rect = renderElement.getBoundingClientRect();
      const stageAreaRatio = round(computeOverlapAreaRatio(rect, stageRect));
      return {
        renderType: overlayChild ? "overlay-image" : tagName,
        replayVisible: isElementVisible(replayButton),
        isBlank: stageAreaRatio <= 0.01,
        passesHold: stageAreaRatio >= thresholds.svgMinAreaRatio,
        stageAreaRatio,
      };
    },
    {
      svgMinAreaRatio: SVG_MIN_AREA_RATIO,
      canvasMinVisibleRatio: CANVAS_MIN_VISIBLE_RATIO,
      canvasMinNonWhiteRatio: CANVAS_MIN_NON_WHITE_RATIO,
      canvasMinNonWhiteVisibleRatio: CANVAS_MIN_NON_WHITE_VISIBLE_RATIO,
    },
  );
}

function buildFailureMessage(routeName, stageIndex, samples) {
  const formatted = samples
    .map((sample) => {
      const metrics = sample.metrics;
      return `t+${sample.delayMs}ms ${JSON.stringify(metrics)}`;
    })
    .join("\n");
  return `${routeName} stage ${stageIndex + 1} settled on a blank or sparse final frame.\n${formatted}`;
}
