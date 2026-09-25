import { expect, test } from "@playwright/test";

const GUIDE_SEEN_KEY = "arclight:eyes:carousel-guide-seen:v2";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
});

test("Eyes demonstrates the first carousel once without changing its resting position", async ({
  page,
}) => {
  await page.goto("/#/eyes", { waitUntil: "domcontentloaded" });

  const carousel = page.locator("#coreCarousel");
  const guide = page.locator(".eyes-carousel-guide");
  const pill = guide.locator(".eyes-carousel-guide__pill");
  const spotlight = page.locator(".eyes-carousel-guide-spotlight");
  await expect(guide).toBeVisible();
  await expect(pill).toBeVisible();
  await expect(pill.locator(".eyes-carousel-guide__label")).toHaveCount(2);
  const gesture = pill.locator(".eyes-carousel-guide__gesture");
  await expect(gesture.locator(".eyes-carousel-guide__hand")).toHaveAttribute(
    "src",
    "/scrolly/workshop/childhood/eyesbrain/hand.png",
  );
  await expect(gesture.locator(".eyes-carousel-guide__arrows")).toHaveCount(2);
  await expect(gesture.locator(".eyes-carousel-guide__chev")).toHaveCount(6);
  await expect(
    gesture
      .locator(".eyes-carousel-guide__arrows--left .eyes-carousel-guide__chev")
      .first(),
  ).toHaveCSS("animation-delay", "0.4s");
  await expect(
    gesture
      .locator(".eyes-carousel-guide__arrows--right .eyes-carousel-guide__chev")
      .last(),
  ).toHaveCSS("animation-delay", "0.4s");
  await expect(gesture.locator(".eyes-carousel-guide__chev").first()).toHaveCSS(
    "animation-name",
    "vsArrowGrayShift",
  );
  await expect(
    gesture
      .locator(".eyes-carousel-guide__arrows--left .eyes-carousel-guide__chev")
      .first(),
  ).toHaveCSS(
    "transform",
    "matrix(-0.707107, 0.707107, -0.707107, -0.707107, 0, 0)",
  );
  await expect(
    gesture
      .locator(".eyes-carousel-guide__arrows--right .eyes-carousel-guide__chev")
      .first(),
  ).toHaveCSS(
    "transform",
    "matrix(0.707107, -0.707107, 0.707107, 0.707107, 0, 0)",
  );
  await expect(pill).toHaveCSS("backdrop-filter", "none");
  await expect(pill).toHaveCSS("background-color", /rgba\(85, 85, 85, 0\.85\)/);
  await expect(pill).toHaveCSS("border-top-width", "0px");
  await expect(pill).toHaveCSS("border-top-left-radius", "999px");
  await expect(spotlight).toBeVisible();
  await expect(spotlight).toHaveCSS("box-shadow", /rgba\(24, 24, 24, 0\.72\)/);
  await expect
    .poll(async () => {
      const carouselBounds = await carousel.boundingBox();
      const guideBounds = await guide.boundingBox();
      return Math.max(
        Math.abs(guideBounds.x - carouselBounds.x),
        Math.abs(guideBounds.y - carouselBounds.y),
        Math.abs(guideBounds.width - carouselBounds.width),
      );
    })
    .toBeLessThan(2);
  await expect
    .poll(() => carousel.evaluate((element) => Math.abs(element.scrollLeft)))
    .toBeGreaterThan(20);
  const completedSwipes = await carousel.evaluate(
    (element) =>
      new Promise((resolve) => {
        let movedAway = Math.abs(element.scrollLeft) > 20;
        let completed = 0;
        const onScroll = () => {
          const offset = Math.abs(element.scrollLeft);
          if (offset > 20) movedAway = true;
          if (movedAway && offset < 5) {
            completed += 1;
            movedAway = false;
          }
        };
        element.addEventListener("scroll", onScroll);
        const observer = new MutationObserver(() => {
          if (document.querySelector(".eyes-carousel-guide")) return;
          element.removeEventListener("scroll", onScroll);
          observer.disconnect();
          resolve(completed);
        });
        observer.observe(document.body, { childList: true });
      }),
  );
  expect(completedSwipes).toBe(3);
  await expect(guide).toHaveCount(0);
  await expect(spotlight).toHaveCount(0);
  await expect
    .poll(() => carousel.evaluate((element) => Math.abs(element.scrollLeft)))
    .toBeLessThan(2);
  await expect
    .poll(() =>
      page.evaluate((key) => localStorage.getItem(key), GUIDE_SEEN_KEY),
    )
    .toBe("1");

  await page.reload();
  await expect(carousel.locator(".eyes-card")).toHaveCount(9);
  await expect(guide).toHaveCount(0);
});

test("reduced motion shows a still hint and leaves the carousel in place", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/eyes", { waitUntil: "domcontentloaded" });

  const carousel = page.locator("#coreCarousel");
  const guide = page.locator(".eyes-carousel-guide");
  await expect(guide).toBeVisible();
  await page.waitForTimeout(1000);
  expect(await carousel.evaluate((element) => element.scrollLeft)).toBe(0);
  await expect(guide).toHaveCount(0);
});

test("a user gesture cancels the demonstration immediately", async ({
  page,
}) => {
  await page.goto("/#/eyes", { waitUntil: "domcontentloaded" });
  const guide = page.locator(".eyes-carousel-guide");
  await expect(guide).toBeVisible();
  await page.locator("#coreCarousel").dispatchEvent("pointerdown");
  await expect(guide).toHaveCount(0);
  await expect(page.locator("#coreCarousel")).not.toHaveClass(
    /is-demo-scrolling/,
  );
});

test("the demonstration follows the carousel's right-to-left direction", async ({
  page,
}) => {
  await page.goto("/#/dashboard", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    document.documentElement.dir = "rtl";
  });
  await page.evaluate(() => window.loadPage("eyes"));

  const carousel = page.locator("#coreCarousel");
  const guide = page.locator(".eyes-carousel-guide");
  await expect(guide).toHaveAttribute("data-direction", "rtl");
  await expect
    .poll(() => carousel.evaluate((element) => element.scrollLeft))
    .toBeLessThan(-20);
  await expect(guide).toHaveCount(0);
  await expect
    .poll(() => carousel.evaluate((element) => Math.abs(element.scrollLeft)))
    .toBeLessThan(2);
});
