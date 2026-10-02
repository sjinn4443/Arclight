import { expect, test } from "@playwright/test";

async function openGuide(page) {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    sessionStorage.setItem("pecWorkshop:lesson", "fundalSourceGuide");
  });
  await page.goto("/#pecWorkshop/pecEyeLessonPage");
  await expect(page.locator(".pec-reflex-panel")).toHaveCount(4);
  await expect(page.locator(".pec-reflex-replay:disabled")).toHaveCount(0);
}

async function frame(stage, time) {
  return stage.evaluate(async (element, currentTime) => {
    element.getAnimations({ subtree: true }).forEach((animation) => {
      animation.pause();
      animation.currentTime = currentTime;
    });
    await new Promise(requestAnimationFrame);
    const styles = {};
    for (const name of ["light", "incoming", "outgoing", "reflex"]) {
      const layer = element.querySelector(`.pec-reflex-layer--${name}`);
      if (layer) {
        const computed = getComputedStyle(layer);
        styles[name] = {
          clip: computed.clipPath,
          opacity: Number(computed.opacity),
        };
      }
    }
    return styles;
  }, time);
}

test("fundal guide reveals and wipes stationary layers in the requested order", async ({
  page,
  isMobile,
}, testInfo) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await openGuide(page);
  await expect(
    page.locator('.pec-eye-lesson-content img[src*="/learning/PEC/"]'),
  ).toHaveCount(0);
  await expect(page.locator(".pec-eye-lesson-content")).not.toContainText(
    /baby/i,
  );
  for (const name of ["normal", "cataract", "retinoblastoma"]) {
    const card = page.locator(`[data-reflex-case="${name}"]`);
    const stage = card.locator(".pec-reflex-stage");
    await stage.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        stage.evaluate((element) => element.getBoundingClientRect().width),
      )
      .toBeGreaterThan(200);
    const initial = await frame(stage, 0);
    expect(initial.light.clip).toBe("inset(0px 100% 0px 0px)");
    expect(initial.incoming.clip).toBe("inset(0px 100% 0px 0px)");
    expect(initial.outgoing.clip).toBe("inset(0px 0px 0px 100%)");
    const beamOnly = await frame(stage, 799);
    expect(beamOnly.light.clip).not.toBe(initial.light.clip);
    expect(beamOnly.incoming.clip).toBe(initial.incoming.clip);
    const incoming = await frame(stage, 1800);
    expect(incoming.incoming.clip).toBe("inset(0px)");
    await stage.screenshot({
      path: testInfo.outputPath(`${name}-incoming.png`),
    });
    const midpoint = await frame(stage, 2900);
    expect(midpoint.incoming.clip).toBe("inset(0px 0px 0px 100%)");
    expect(midpoint.outgoing.clip).toBe("inset(0px 0px 0px 50%)");
    if (name !== "cataract") {
      expect(midpoint.reflex.opacity).toBe(0);
      expect((await frame(stage, 3100)).reflex.opacity).toBeCloseTo(0.5);
    } else expect(midpoint.reflex).toBeUndefined();
    const final = await frame(stage, 4200);
    expect(final.outgoing.clip).toBe("inset(0px)");
    await stage.screenshot({ path: testInfo.outputPath(`${name}-return.png`) });
    const replay = card.getByRole("button", { name: "Replay animation" });
    // Sample in the browser: a mobile tap can return after much of the short
    // animation has already played on a busy WebKit runner.
    await replay.evaluate((button) => {
      button.addEventListener(
        "click",
        () => {
          const stage = button
            .closest("article")
            .querySelector(".pec-reflex-stage");
          const animation = stage.getAnimations({ subtree: true })[0];
          button.dataset.replayStartTime = String(animation.currentTime);
          button.dataset.replayState = animation.playState;
        },
        { once: true },
      );
    });
    if (isMobile) await replay.tap();
    else await replay.click();
    await expect
      .poll(() =>
        replay.evaluate((button) => Number(button.dataset.replayStartTime)),
      )
      .toBe(0);
    await expect(replay).toHaveAttribute("data-replay-state", "running");
  }
  const variations = page.locator(".pec-reflex-variations");
  await variations.scrollIntoViewIfNeeded();
  await expect(variations.locator("svg")).toBeVisible();
  await expect(variations.locator("svg image").first()).toHaveAttribute(
    "href",
    /exam\/5\/images/,
  );
  expect(
    await page
      .locator("body")
      .evaluate((body) => body.scrollWidth <= window.innerWidth),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("reduced motion shows the final reflex and leaving pauses the lesson", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openGuide(page);
  const stage = page.locator('[data-reflex-case="normal"] .pec-reflex-stage');
  await stage.scrollIntoViewIfNeeded();
  await expect(stage.locator(".pec-reflex-layer--reflex")).toHaveCSS(
    "opacity",
    "1",
  );
  await page.goto("/#eyes");
  await expect(page.locator(".pec-reflex-stage:visible")).toHaveCount(0);
  expect(
    await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter(
            (animation) =>
              animation.effect?.target?.classList.contains(
                "pec-reflex-layer",
              ) && animation.playState === "running",
          ).length,
    ),
  ).toBe(0);
});
