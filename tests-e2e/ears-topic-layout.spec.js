import { expect, test } from "@playwright/test";
import { EAR_TOPICS } from "../public/js/earsContentData.js";

test("every Ears topic matches Eyes lesson dimensions and level separators", async ({
  page,
}) => {
  await page.route("**/healthz", (route) => route.fulfill({ status: 200 }));
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    sessionStorage.setItem("arclight:account:nudge-dismissed", "1");
  });
  await page.goto("/#/videos/pupilsPage");
  const referenceRow = page.locator("#pupilsPage .lesson-row").first();
  await expect(referenceRow).toBeVisible();
  const reference = await referenceRow.evaluate((row) => {
    const box = row.getBoundingClientRect();
    const icon = row.querySelector(".thumb").getBoundingClientRect();
    const cta = getComputedStyle(row.querySelector(".lesson-cta"));
    return {
      width: box.width,
      height: box.height,
      iconWidth: icon.width,
      iconHeight: icon.height,
      ctaColor: cta.color,
      ctaFont: cta.fontSize,
      barHeight: row.querySelector(".lesson-progress").getBoundingClientRect()
        .height,
    };
  });
  for (const [route, topic] of Object.entries(EAR_TOPICS)) {
    await page.goto(`/#/${route}`);
    const root = page.locator(
      `#earsContentPage[data-ear-ready="true"][data-ear-route="${route}"]`,
    );
    await expect(root).toBeVisible();
    const rows = root.locator(".lesson-row");
    await expect(rows).toHaveCount(
      topic.groups.flatMap((group) => group.lessons).length,
    );
    // The fragment stylesheet can finish after its DOM has been inserted.
    await expect
      .poll(() =>
        rows
          .first()
          .evaluate((row) => Math.round(row.getBoundingClientRect().width)),
      )
      .toBe(Math.round(reference.width));
    for (const row of await rows.all()) {
      const actual = await row.evaluate((row) => {
        const box = row.getBoundingClientRect(),
          icon = row.querySelector(".thumb").getBoundingClientRect(),
          title = row.querySelector(".lesson-type").getBoundingClientRect(),
          bar = row.querySelector(".lesson-progress").getBoundingClientRect(),
          cta = row.querySelector(".lesson-cta"),
          ctaBox = cta.getBoundingClientRect(),
          style = getComputedStyle(cta);
        return {
          width: box.width,
          height: box.height,
          iconWidth: icon.width,
          iconHeight: icon.height,
          barHeight: bar.height,
          ctaColor: style.color,
          ctaFont: style.fontSize,
          ctaInside:
            ctaBox.top >= box.top &&
            ctaBox.bottom <= box.bottom &&
            ctaBox.right <= box.right,
          titleAboveProgress: title.bottom <= bar.top + 1,
        };
      });
      for (const key of [
        "width",
        "height",
        "iconWidth",
        "iconHeight",
        "barHeight",
      ])
        expect(
          Math.abs(actual[key] - reference[key]),
          `${route}: ${key}`,
        ).toBeLessThan(1);
      expect(actual.ctaColor, route).toBe(reference.ctaColor);
      expect(actual.ctaFont, route).toBe(reference.ctaFont);
      expect(actual.ctaInside, route).toBe(true);
      expect(actual.titleAboveProgress, route).toBe(true);
    }
    const separators = root.locator(".pupils-levels > .pupils-dots");
    await expect(separators).toHaveCount(topic.groups.length - 1);
    for (const separator of await separators.all()) {
      await expect(separator.locator("span")).toHaveCount(2);
      expect(
        await separator.evaluate(
          (el) =>
            el.nextElementSibling.getBoundingClientRect().top -
            el.previousElementSibling.getBoundingClientRect().bottom,
        ),
      ).toBe(62);
    }
    // The icon identifies the format; only a video's duration sits beside its title.
    for (const meta of await root.locator(".lesson-meta").all())
      await expect(meta).toHaveText(/^\| \d\d:\d\d$/);
  }
});
