import { expect, test } from "@playwright/test";

const ROUTE_READY_TIMEOUT_MS = 30_000;
const NAVIGATION_TIMEOUT_MS = 12_000;
const PLAYBACK_RATE = 20;

test.describe("Fundal page-to-page navigation", () => {
  test("navigates across fundal pages only at the intended scroll boundaries", async ({
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
        localStorage.setItem(
          "childhoodWorkshop:progress:childhoodFundalPreparationPage",
          JSON.stringify({ percent: 100, updatedAt: Date.now() }),
        );
      } catch {
        // Ignore storage failures in constrained browser contexts.
      }
    }, PLAYBACK_RATE);

    await page.goto("/#childhoodFundalPreparation", {
      waitUntil: "domcontentloaded",
      timeout: ROUTE_READY_TIMEOUT_MS,
    });

    const nextPageArrow = page.locator(
      '.childhood-fundal-scroll-down-arrow[data-fundal-advance-mode="page"]',
    );
    await page.evaluate(() => {
      const maxScrollTop =
        Math.max(
          document.documentElement?.scrollHeight || 0,
          document.body?.scrollHeight || 0,
        ) - window.innerHeight;
      window.scrollTo({
        top: Math.max(0, maxScrollTop),
        behavior: "auto",
      });
    });
    await page.waitForTimeout(300);

    await expect(nextPageArrow).toBeVisible({
      timeout: NAVIGATION_TIMEOUT_MS,
    });

    await page.evaluate(() => {
      const maxScrollTop =
        Math.max(
          document.documentElement?.scrollHeight || 0,
          document.body?.scrollHeight || 0,
        ) - window.innerHeight;
      window.scrollTo({
        top: Math.max(0, maxScrollTop),
        behavior: "auto",
      });
    });
    await page.waitForTimeout(300);

    await dispatchWheelEvent(page, 1200);

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
    await page.waitForTimeout(500);

    await dispatchWheelEvent(page, -1200);

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

  test("requires reaching the fully visible next-page pill before the next downward wheel navigates", async ({
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
        localStorage.setItem(
          "childhoodWorkshop:progress:childhoodFundalPreparationPage",
          JSON.stringify({ percent: 100, updatedAt: Date.now() }),
        );
      } catch {
        // Ignore storage failures in constrained browser contexts.
      }
    }, PLAYBACK_RATE);

    await page.goto("/#childhoodFundalPreparation", {
      waitUntil: "domcontentloaded",
      timeout: ROUTE_READY_TIMEOUT_MS,
    });

    await page.setViewportSize({ width: 494, height: 715 });
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const maxScrollTop =
        Math.max(
          document.documentElement?.scrollHeight || 0,
          document.body?.scrollHeight || 0,
        ) - window.innerHeight;
      window.scrollTo({
        top: Math.max(0, maxScrollTop - 220),
        behavior: "auto",
      });
    });
    await page.waitForTimeout(300);

    await dispatchWheelEvent(page, 700);
    await page.waitForTimeout(300);

    await expect
      .poll(async () => page.evaluate(() => window.location.hash), {
        timeout: NAVIGATION_TIMEOUT_MS,
      })
      .toContain("childhoodFundalPreparation");

    await page.evaluate(() => {
      const maxScrollTop =
        Math.max(
          document.documentElement?.scrollHeight || 0,
          document.body?.scrollHeight || 0,
        ) - window.innerHeight;
      window.scrollTo({
        top: Math.max(0, maxScrollTop),
        behavior: "auto",
      });
    });
    await page.waitForTimeout(300);

    const nextPageArrow = page.locator(
      '.childhood-fundal-scroll-down-arrow[data-fundal-advance-mode="page"]',
    );
    await expect(nextPageArrow).toBeVisible({
      timeout: NAVIGATION_TIMEOUT_MS,
    });

    const revealedBox = await nextPageArrow.boundingBox();
    const viewport = page.viewportSize();
    expect(revealedBox).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(revealedBox.y).toBeGreaterThanOrEqual(0);
    expect(revealedBox.y + revealedBox.height).toBeLessThanOrEqual(
      viewport.height,
    );

    await dispatchWheelEvent(page, 700);

    await expect
      .poll(async () => page.evaluate(() => window.location.hash), {
        timeout: NAVIGATION_TIMEOUT_MS,
      })
      .toContain("childhoodFundalExamination");
  });

  test("does not skip backward across multiple fundal pages from a single strong upward gesture", async ({
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

    await dispatchWheelEvent(page, -1200);

    await expect
      .poll(async () => page.evaluate(() => window.location.hash), {
        timeout: NAVIGATION_TIMEOUT_MS,
      })
      .toContain("childhoodFundalUnclearFindings");

    await dispatchWheelEvent(page, -1200);
    await page.waitForTimeout(300);

    await expect
      .poll(async () => page.evaluate(() => window.location.hash), {
        timeout: NAVIGATION_TIMEOUT_MS,
      })
      .toContain("childhoodFundalUnclearFindings");

    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    });
    await page.waitForTimeout(300);

    await dispatchWheelEvent(page, -1200);

    await expect
      .poll(async () => page.evaluate(() => window.location.hash), {
        timeout: NAVIGATION_TIMEOUT_MS,
      })
      .toContain("childhoodFundalNewbornEyesClosed");
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

async function dispatchWheelEvent(page, deltaY) {
  await page.evaluate((nextDeltaY) => {
    window.dispatchEvent(
      new WheelEvent("wheel", {
        deltaY: nextDeltaY,
        bubbles: true,
        cancelable: true,
      }),
    );
  }, deltaY);
}
