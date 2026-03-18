import { expect, test } from "@playwright/test";

const ROUTE_READY_TIMEOUT_MS = 30_000;
const NAVIGATION_TIMEOUT_MS = 12_000;
const PLAYBACK_RATE = 20;

test.describe("Fundal page-to-page navigation", () => {
  test("scrolls forward from the final next-page pill and backward from the first stage", async ({
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

    await page.goto("/#childhoodFundalPreparation", {
      waitUntil: "domcontentloaded",
      timeout: ROUTE_READY_TIMEOUT_MS,
    });

    const stages = page.locator(".childhood-fundal-prep-stage");
    await expect(stages).toHaveCount(4, {
      timeout: ROUTE_READY_TIMEOUT_MS,
    });

    await waitForReplayVisible(stages.nth(0));
    await clickBottomVisibleAdvanceControl(page);
    await waitForReplayVisible(stages.nth(1));
    await clickBottomVisibleAdvanceControl(page);
    await waitForReplayVisible(stages.nth(2));
    await clickBottomVisibleAdvanceControl(page);
    await waitForReplayVisible(stages.nth(3));

    const nextPageArrow = page.locator(
      '.childhood-fundal-scroll-down-arrow[data-fundal-advance-mode="page"]',
    );
    await expect(nextPageArrow).toBeVisible({
      timeout: NAVIGATION_TIMEOUT_MS,
    });

    await page.mouse.wheel(0, 1200);

    await expect
      .poll(async () => page.evaluate(() => window.location.hash), {
        timeout: NAVIGATION_TIMEOUT_MS,
      })
      .toContain("childhoodFundalExamination");

    await expect(page.locator(".eyes-topbar__title")).toHaveText(
      "Examination",
      {
        timeout: NAVIGATION_TIMEOUT_MS,
      },
    );

    await page.goto("/#childhoodFundalPossibleFinding", {
      waitUntil: "domcontentloaded",
      timeout: ROUTE_READY_TIMEOUT_MS,
    });

    await expect(page.locator(".eyes-topbar__title")).toHaveText(
      "Possible Findings",
      {
        timeout: ROUTE_READY_TIMEOUT_MS,
      },
    );

    await page.mouse.wheel(0, -1200);

    await expect
      .poll(async () => page.evaluate(() => window.location.hash), {
        timeout: NAVIGATION_TIMEOUT_MS,
      })
      .toContain("childhoodFundalUnclearFindings");

    await expect(page.locator(".eyes-topbar__title")).toHaveText(
      "Unclear Findings",
      {
        timeout: NAVIGATION_TIMEOUT_MS,
      },
    );

    await expect
      .poll(
        async () =>
          page.evaluate(
            () =>
              window.scrollY ??
              window.pageYOffset ??
              document.documentElement?.scrollTop ??
              document.body?.scrollTop ??
              0,
          ),
        {
          timeout: NAVIGATION_TIMEOUT_MS,
        },
      )
      .toBeGreaterThan(1000);
  });
});

async function waitForReplayVisible(stage) {
  await expect(stage.locator(".childhood-fundal-stage-replay-btn")).toBeVisible(
    {
      timeout: NAVIGATION_TIMEOUT_MS,
    },
  );
}

async function clickBottomVisibleAdvanceControl(page) {
  const index = await page.evaluate(() => {
    const buttons = Array.from(
      document.querySelectorAll(".childhood-fundal-scroll-down-arrow"),
    )
      .map((el, i) => ({
        i,
        disabled: el.disabled,
        top: el.getBoundingClientRect().top,
        bottom: el.getBoundingClientRect().bottom,
      }))
      .filter(
        (entry) =>
          !entry.disabled && entry.bottom > 0 && entry.top < window.innerHeight,
      );

    if (!buttons.length) return -1;
    buttons.sort((a, b) => b.top - a.top);
    return buttons[0].i;
  });

  expect(index).toBeGreaterThanOrEqual(0);
  await page
    .locator(".childhood-fundal-scroll-down-arrow")
    .nth(index)
    .click({ force: true });
}
