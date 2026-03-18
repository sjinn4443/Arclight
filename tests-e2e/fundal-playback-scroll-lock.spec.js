import { expect, test } from "@playwright/test";

const ROUTE_NAME = "childhoodFundalPreparation";
const PLAYBACK_RATE = 3;
const ROUTE_READY_TIMEOUT_MS = 30_000;
const STAGE_COMPLETE_TIMEOUT_MS = 25_000;
const SECOND_STAGE_START_TIMEOUT_MS = 10_000;
const MIN_UPWARD_SCROLL_PX = 60;
const MIN_RETURN_DOWNWARD_SCROLL_PX = 60;
const RETURN_TO_LOCK_TOLERANCE_PX = 40;
const DOWNWARD_TOLERANCE_PX = 8;
const MIN_UNLOCKED_DOWNWARD_SCROLL_PX = 80;

test.describe("Fundal autoplay scroll lock", () => {
  test("allows upward scroll during playback but keeps forward scroll locked until completion", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium-desktop",
      "This check uses wheel scrolling on the desktop project.",
    );

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
    }, PLAYBACK_RATE);

    await page.goto(`/#${ROUTE_NAME}`, {
      waitUntil: "domcontentloaded",
      timeout: ROUTE_READY_TIMEOUT_MS,
    });

    const stages = page.locator(".childhood-fundal-prep-stage");
    await expect(stages).toHaveCount(4, {
      timeout: ROUTE_READY_TIMEOUT_MS,
    });

    const firstStage = stages.nth(0);
    const secondStage = stages.nth(1);

    await expect(firstStage).toBeVisible({
      timeout: ROUTE_READY_TIMEOUT_MS,
    });
    await waitForStageCompletion(firstStage);

    await centerStageInViewport(page, secondStage);
    await waitForStagePlaybackStart(secondStage);

    const secondReplayButton = secondStage.locator(
      ".childhood-fundal-stage-replay-btn",
    );
    await expect(secondReplayButton).toBeHidden();

    const lockedTop = await getScrollTop(page);

    await page.mouse.wheel(0, -1200);
    await page.waitForTimeout(250);

    const upwardTop = await getScrollTop(page);
    expect(upwardTop).toBeLessThan(lockedTop - MIN_UPWARD_SCROLL_PX);

    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(250);

    const returnTop = await getScrollTop(page);
    expect(returnTop).toBeGreaterThan(
      upwardTop + MIN_RETURN_DOWNWARD_SCROLL_PX,
    );
    expect(returnTop).toBeGreaterThanOrEqual(
      lockedTop - RETURN_TO_LOCK_TOLERANCE_PX,
    );
    expect(returnTop).toBeLessThanOrEqual(lockedTop + DOWNWARD_TOLERANCE_PX);

    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(250);

    const blockedForwardTop = await getScrollTop(page);
    expect(blockedForwardTop).toBeLessThanOrEqual(
      lockedTop + DOWNWARD_TOLERANCE_PX,
    );

    await waitForStageCompletion(secondStage);

    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(250);

    const unlockedForwardTop = await getScrollTop(page);
    expect(unlockedForwardTop).toBeGreaterThan(
      lockedTop + MIN_UNLOCKED_DOWNWARD_SCROLL_PX,
    );
  });
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

async function waitForStagePlaybackStart(stage) {
  const textLocator = stage
    .locator("xpath=..")
    .locator(".childhood-fundal-segment-text");

  await expect
    .poll(
      async () => {
        const replayVisible = await stage
          .locator(".childhood-fundal-stage-replay-btn")
          .isVisible()
          .catch(() => false);
        if (replayVisible) return false;
        const text = (await textLocator.textContent()) || "";
        return text.trim().length > 0;
      },
      {
        timeout: SECOND_STAGE_START_TIMEOUT_MS,
      },
    )
    .toBe(true);
}

async function waitForStageCompletion(stage) {
  await expect(stage.locator(".childhood-fundal-stage-replay-btn")).toBeVisible(
    {
      timeout: STAGE_COMPLETE_TIMEOUT_MS,
    },
  );
}

async function getScrollTop(page) {
  return page.evaluate(
    () =>
      window.scrollY ??
      window.pageYOffset ??
      document.documentElement?.scrollTop ??
      document.body?.scrollTop ??
      0,
  );
}
