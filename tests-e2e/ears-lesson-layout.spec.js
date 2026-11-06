import { expect, test } from "@playwright/test";
import { EAR_LESSONS } from "../public/js/earsContentData.js";

test.beforeEach(async ({ page }) => {
  await page.route("**/healthz", (route) => route.fulfill({ status: 200 }));
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    sessionStorage.setItem("arclight:account:nudge-dismissed", "1");
  });
});

const cardStyle = (panel) => {
  const style = getComputedStyle(panel);
  const heading = getComputedStyle(panel.querySelector("h3"));
  const copy = getComputedStyle(panel.querySelector("p"));
  // Eyes briefly scales cards during their scroll reveal; compare settled CSS sizes.
  const badge = getComputedStyle(
    panel.querySelector(".diabetic-screening-step"),
  );
  return {
    width: style.width,
    padding: style.padding,
    radius: style.borderRadius,
    heading: [
      heading.fontSize,
      heading.fontWeight,
      heading.lineHeight,
      heading.letterSpacing,
    ],
    copy: [copy.fontSize, copy.fontWeight, copy.lineHeight, copy.color],
    badge: [badge.width, badge.height],
  };
};

test("Ears scroll cards use the Eyes typography, spacing and images", async ({
  page,
}) => {
  await page.goto("/#/medicalStudentsWorkshop/medicalArclightScrollPage");
  const reference = page
    .locator("#medicalArclightScrollPage .diabetic-screening-panel")
    .last();
  await expect(reference).toBeVisible();
  const eyes = await reference.evaluate(cardStyle);
  await page.goto("/#/earsHowWeHear");
  const panels = page.locator(".ear-learning-panel");
  await expect(panels).toHaveCount(3);
  for (const panel of await panels.all()) {
    expect(await panel.evaluate(cardStyle)).toEqual(eyes);
    const image = panel.locator("img");
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0))
      .toBe(true);
    expect(
      await image.evaluate((img) =>
        Math.abs(
          img.clientWidth / img.clientHeight -
            img.naturalWidth / img.naturalHeight,
        ),
      ),
    ).toBeLessThan(0.02);
  }
  const flow = page.locator(".ear-flow");
  await expect(flow.getByRole("button")).toHaveCount(2);
  await expect(flow.getByRole("button").first()).toHaveText("< Previous");
  await expect(flow.getByRole("button").last()).toHaveText("Next >");
  await flow.getByRole("button").first().click();
  await expect(page).toHaveURL(/#\/earsAnatomy$/);
});

test("every Ears lesson fits its viewport and retains its two-button navigation", async ({
  page,
}) => {
  for (const [route, lesson] of Object.entries(EAR_LESSONS)) {
    await page.goto(`/#/${route}`);
    const root = page.locator(
      `#earsContentPage[data-ear-ready="true"][data-ear-route="${route}"]`,
    );
    await expect(root).toBeVisible();
    await expect(root.locator(".ear-load-error")).toHaveCount(0);
    await expect(root.locator(".ear-flow button")).toHaveCount(2);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      route,
    ).toBe(true);
    if (lesson.type === "video") {
      await expect(root.locator("video")).toHaveAttribute("controls", "");
      await expect(root.getByRole("radiogroup")).toBeVisible();
      await expect(root.getByRole("radio")).toHaveCount(2);
      const video = root.locator("video");
      await expect
        .poll(() => video.evaluate((v) => v.readyState), { message: route })
        .toBeGreaterThan(0);
      const box = await video.boundingBox();
      expect(box.width).toBeGreaterThan(250);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize().width);
    }
  }
});

test("Ears videos match the Eyes PEC player width, heading and header toggle", async ({
  page,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem(
      "pecWorkshop:procedureVideo",
      "pupil_presentation_video",
    ),
  );
  await page.goto("/#/pecWorkshop/pecProcedureVideoPage");
  const reference = page.locator(
    "#pecProcedureVideoPage[data-pec-rendered-video]",
  );
  await expect(reference).toBeVisible();
  const geometry = (page) => {
    const player = page
      .querySelector(".video-container")
      .getBoundingClientRect();
    const toggle = page.querySelector(".tri-toggle").getBoundingClientRect();
    return {
      width: player.width,
      top: player.top - page.getBoundingClientRect().top,
      font: getComputedStyle(page.querySelector(".video-header h3")).font,
      toggleWidth: toggle.width,
      toggleHeight: toggle.height,
      toggleTop: toggle.top,
    };
  };
  const eyes = await reference.evaluate(geometry);
  await page.goto("/#/earsOtoscopyVideo");
  const ears = page.locator('#earsContentPage[data-ear-ready="true"]');
  await expect(ears).toBeVisible();
  expect(await ears.evaluate(geometry)).toEqual(eyes);
});

test("video quality uses the Eyes toggle with keyboard control and preserves playback", async ({
  page,
}) => {
  await page.goto("/#/earsOtoscopyVideo");
  const video = page.locator("#earsContentPage video");
  await expect
    .poll(() => video.evaluate((v) => v.readyState))
    .toBeGreaterThan(0);
  await video.evaluate((v) => {
    v.currentTime = 20;
  });
  const low = page.getByRole("radio", { name: "low", exact: true });
  const high = page.getByRole("radio", { name: "high", exact: true });
  await expect(low).toHaveAttribute("aria-checked", "true");
  await low.focus();
  await page.keyboard.press("ArrowRight");
  await expect(high).toBeFocused();
  await expect(high).toHaveAttribute("aria-checked", "true");
  await expect(video).toHaveAttribute("src", /_720p.mp4$/);
  await expect
    .poll(() => video.evaluate((v) => v.currentTime))
    .toBeGreaterThan(19);
  await page.locator(".ear-flow").getByRole("button").first().click();
  await expect(video).toHaveCount(0);
});
