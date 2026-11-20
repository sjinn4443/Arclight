import { test, expect } from "@playwright/test";
import sharp from "sharp";

test("search expands and collapses while the shared notification bell works on every route", async ({
  page,
}, testInfo) => {
  const search = page.locator("#dashboardSearchInput");
  const toggle = page.locator("#dashboardSearchToggle");
  await expect(search).toBeHidden();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  for (const width of [1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1100 });
    const alignment = await page.locator(".dw-top-actions").evaluate((el) => {
      const controls = [
        ...el.children,
        el.querySelector("#dashboardSearchToggle"),
      ];
      const rects = controls.map((control) => control.getBoundingClientRect());
      const logo = document.querySelector(".dw-brand").getBoundingClientRect();
      const icon = document
        .querySelector(".dw-nav svg")
        .getBoundingClientRect();
      return {
        heights: rects.map((r) => r.height),
        centers: [
          ...rects,
          ...Array.from(
            el.querySelectorAll(
              "svg,img,[data-dashboard-language-name],[data-dashboard-avatar]",
            ),
            (icon) => icon.getBoundingClientRect(),
          ),
        ].map((r) => r.y + r.height / 2),
        logoX: logo.left - icon.left,
        logoHeight: document
          .querySelector(".dw-brand .topbar-home-logo__image")
          .getBoundingClientRect().height,
        bellFill: getComputedStyle(el.querySelector(".dw-notifications svg"))
          .fill,
      };
    });
    expect(alignment.heights.every((height) => height === 36)).toBe(true);
    expect(
      Math.max(...alignment.centers) - Math.min(...alignment.centers),
    ).toBeLessThan(1);
    expect(Math.abs(alignment.logoX)).toBeLessThan(1);
    expect(alignment.logoHeight).toBe(67);
    expect(alignment.bellFill).toBe("rgb(255, 255, 255)");
  }
  await page.setViewportSize({ width: 1440, height: 1100 });
  await expect(toggle.locator("svg")).toHaveCSS("width", "24px");
  await expect(page.locator(".dw-notifications svg")).toHaveCSS(
    "height",
    "30px",
  );
  await expect(page.locator(".dw-account [data-dashboard-avatar]")).toHaveCSS(
    "height",
    "30px",
  );
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(search).toBeFocused();
  await expect(page.locator(".dw-top-actions")).toBeVisible();
  await search.fill("visual acuity");
  await expect(
    page.locator("#dashboardSearchPanel .module-card").first(),
  ).toContainText("Visual Acuity");
  await page.keyboard.press("Escape");
  await expect(search).toBeHidden();
  await expect(toggle).toBeFocused();
  await page.keyboard.press("/");
  await expect(search).toBeFocused();
  await expect(search).toHaveValue("visual acuity");
  await toggle.click();
  await expect(search).toBeHidden();
  for (const route of [
    "dashboard",
    "mylearning",
    "atomscard",
    "eyes",
    "ears",
    "myprofile",
    "settings",
  ]) {
    if (route !== "dashboard")
      await page.locator(`.dw-nav[data-dashboard-route="${route}"]`).click();
    const bell = page.locator(".dw-notifications");
    await expect(bell).toBeVisible();
    const layout = await bell.evaluate((el) => {
      const avatar = document
          .querySelector(".dw-account")
          .getBoundingClientRect(),
        b = el.getBoundingClientRect();
      return {
        gap: b.left - avatar.right,
        color: getComputedStyle(el).color,
        bg: getComputedStyle(el).backgroundColor,
        bar: getComputedStyle(el.closest(".dw-topbar")).backgroundColor,
      };
    });
    expect(layout.gap).toBeGreaterThanOrEqual(0);
    expect(layout.gap).toBeLessThanOrEqual(12);
    expect(layout.color).toBe("rgb(255, 255, 255)");
    expect(layout.bg).toBe(layout.bar);
    await bell.click();
    const inbox = page.locator("dialog.notification-inbox");
    await expect(inbox).toBeVisible();
    // A route can finish initializing just after the shared bell is clicked.
    await page.evaluate(() =>
      window.dispatchEvent(
        new CustomEvent("page:loaded", {
          detail: { routeName: document.body.dataset.currentRoute },
        }),
      ),
    );
    await expect(inbox).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(inbox).toBeHidden();
    await expect(bell).toBeFocused();
  }
  await page.locator('.dw-nav[data-dashboard-route="dashboard"]').click();
  await expect(page.locator("[data-dashboard-greeting]")).toBeVisible();
  const logo = await sharp(await page.locator(".dw-brand").screenshot())
    .removeAlpha()
    .raw()
    .toBuffer();
  let white = 0,
    red = 0;
  for (let i = 0; i < logo.length; i += 3) {
    if (logo[i] > 230 && logo[i + 1] > 230 && logo[i + 2] > 230) white++;
    if (logo[i] > 140 && logo[i + 1] < 90 && logo[i + 2] < 90) red++;
  }
  expect(white).toBeGreaterThan(200);
  expect(red).toBeGreaterThan(30);
  expect(
    await page
      .locator(".dw-brand")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgba(0, 0, 0, 0)");
  await page
    .locator(".dashboard-desktop")
    .screenshot({ path: testInfo.outputPath("workspace-header-refined.png") });
});

test("branding, centered Profile and flush Atoms topic panel", async ({
  page,
}, testInfo) => {
  await expect(
    page.locator(".dw-brand .topbar-home-logo__image"),
  ).toHaveAttribute("src", "/images/logo/2.webp");
  expect(
    await page
      .locator(".dw-breadcrumb")
      .evaluate((el) => getComputedStyle(el).fontSize),
  ).toBe("16px");
  expect((await page.locator(".dw-topbar").boundingBox()).height).toBeLessThan(
    66,
  );
  await page.locator('.dw-nav[data-dashboard-route="myprofile"]').click();
  for (const width of [1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1100 });
    const profile = await page
      .locator("#myProfilePage .profile-workspace")
      .evaluate((el) => {
        const b = el.getBoundingClientRect(),
          main = el.closest(".dw-main").getBoundingClientRect();
        return {
          width: b.width,
          center: b.left + b.width / 2 - main.left - main.width / 2,
          columns: getComputedStyle(
            el.querySelector(".profile-main-grid"),
          ).gridTemplateColumns.split(" ").length,
        };
      });
    expect(profile.width).toBeLessThanOrEqual(680);
    expect(Math.abs(profile.center)).toBeLessThan(1);
    expect(profile.columns).toBe(1);
  }
  await page.locator('.dw-nav[data-dashboard-route="atomscard"]').click();
  await expect(page.locator("#atomsCardPage")).toHaveClass(
    /atoms-layout-ready/,
  );
  await page.locator('#tocList li[data-topic="Vision Changes"]').click();
  await expect(page.locator("#atomsImageContainer img")).toHaveAttribute(
    "src",
    /VisionChanges.webp/,
  );
  for (const width of [1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1100 });
    const panel = await page.locator("#tocDropdown").evaluate((el) => {
      const b = el.getBoundingClientRect();
      const bar = document.querySelector(".dw-topbar").getBoundingClientRect();
      const work = document.querySelector(".dw-work").getBoundingClientRect();
      return {
        top: b.top - bar.bottom,
        right: work.right - b.right,
        bottom: work.bottom - b.bottom,
        radius: getComputedStyle(el).borderRadius,
      };
    });
    expect(Math.abs(panel.top)).toBeLessThan(1);
    expect(Math.abs(panel.right)).toBeLessThan(1);
    expect(Math.abs(panel.bottom)).toBeLessThan(1);
    expect(panel.radius).toBe("0px");
  }
  await expect(page.locator("#tocInlineCloseBtn")).toBeHidden();
  await expect(page.locator(".atoms-toc-heading")).toHaveCount(0);
  for (const arrow of await page.locator(".atoms-card-nav").all())
    await expect(arrow).toBeHidden();
  await page
    .locator(".dashboard-desktop")
    .screenshot({ path: testInfo.outputPath("atoms-right-panel.png") });
});

test("shared red topbar owns real page titles and restores them on mobile", async ({
  page,
}) => {
  await page.locator('.dw-nav[data-dashboard-route="mylearning"]').click();
  await expect(page.locator(".dw-topbar .ml-topbar")).toBeVisible();
  await expect(page.locator(".dw-main .ml-topbar")).toHaveCount(0);
  expect(
    await page
      .locator(".dw-topbar")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(180, 52, 42)");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("#likedPage .ml-topbar")).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 1100 });
  await expect(page.locator(".dw-topbar .ml-topbar")).toBeVisible();
  await page.locator('.dw-nav[data-dashboard-route="atomscard"]').click();
  await page
    .locator('#tocList li[data-topic="How to Check for Eyeglasses"]')
    .click();
  await expect(page.locator(".dw-topbar .atoms-title-bar")).toContainText(
    "How to Check for Eyeglasses",
  );
  for (const width of [1024, 1280, 1920]) {
    await page.setViewportSize({ width, height: 1100 });
    const layout = await page.locator(".dw-topbar").evaluate((el) => {
      const title = el.querySelector(".dw-route-title").getBoundingClientRect(),
        tools = el.querySelector(".dw-top-actions").getBoundingClientRect();
      return {
        overlap: title.right - tools.left,
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    });
    expect(layout.overlap).toBeLessThanOrEqual(0);
    expect(layout.overflow).toBeLessThanOrEqual(1);
  }
});

test("Atoms clips the exterior matte, hides card arrows and keeps Profile panels white", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1920, height: 1100 });
  await page.locator('.dw-nav[data-dashboard-route="atomscard"]').click();
  await page.locator('#tocList li[data-topic="Vision Changes"]').click();
  const image = page.locator("#atomsImageContainer img");
  await expect(image).toBeVisible();
  await image.evaluate((img) => img.decode());
  for (const arrow of await page.locator(".atoms-card-nav").all())
    await expect(arrow).toBeHidden();
  const shot = await image.screenshot(),
    { data, info } = await sharp(shot)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
  const pixel = (x, y) =>
    Array.from(
      data.subarray((y * info.width + x) * 3, (y * info.width + x) * 3 + 3),
    );
  expect(pixel(2, 2)).toEqual([242, 242, 247]);
  expect(
    pixel(Math.floor(info.width * 0.5), Math.floor(info.height * 0.25)),
  ).toEqual([255, 255, 255]);
  await page
    .locator(".dashboard-desktop")
    .screenshot({ path: testInfo.outputPath("atoms-integrated-header.png") });
  await page.locator('.dw-nav[data-dashboard-route="myprofile"]').click();
  for (const selector of [
    ".profile-header",
    ".profile-card__identity",
    ".profile-achievements-panel",
    ".settings-list",
  ]) {
    expect(
      await page
        .locator(`#myProfilePage ${selector}`)
        .evaluate((el) => getComputedStyle(el).backgroundColor),
    ).toBe("rgb(255, 255, 255)");
  }
});

test("hover keeps the original eye outline thickness and emits the small ear ripple first", async ({
  page,
}) => {
  const eye = page.locator(".dw-eyes");
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(1, 1);
  const region = await eye.evaluate((el) => {
    const b = el.getBoundingClientRect(),
      m = el.querySelector(".dw-eye-rest").getScreenCTM();
    const first = new DOMPoint(236, 140).matrixTransform(m),
      // Stay left of the full-size moving iris, which reaches x=330.
      last = new DOMPoint(320, 333).matrixTransform(m);
    return {
      left: Math.ceil(first.x - b.x),
      top: Math.ceil(first.y - b.y),
      width: Math.floor(last.x - first.x) - 2,
      height: Math.floor(last.y - first.y) - 2,
    };
  });
  const beforeImage = await eye.screenshot();
  const before = await sharp(beforeImage).extract(region).raw().toBuffer();
  await eye.hover();
  await eye.evaluate((el) =>
    el.getAnimations({ subtree: true }).forEach((a) => {
      a.pause();
      a.currentTime = 800;
    }),
  );
  const leftImage = await eye.screenshot();
  const after = await sharp(leftImage).extract(region).raw().toBuffer();
  // Compositing the blink layer can change edge antialiasing by a shade;
  // compare the painted outline area rather than requiring identical PNG bytes.
  const whiteArea = (pixels) => {
    let count = 0;
    for (let i = 0; i < pixels.length; i += 3)
      if (pixels[i] > 128 && pixels[i + 1] > 128 && pixels[i + 2] > 128)
        count++;
    return count;
  };
  expect(
    Math.abs(whiteArea(after) - whiteArea(before)) / whiteArea(before),
  ).toBeLessThan(0.02);
  const irisEdge = async (png, sourceX) => {
    const point = await eye.evaluate((el, x) => {
      const b = el.getBoundingClientRect();
      const p = new DOMPoint(x, 235).matrixTransform(
        el.querySelector(".dw-eye-rest").getScreenCTM(),
      );
      return { x: Math.round(p.x - b.x), y: Math.round(p.y - b.y) };
    }, sourceX);
    const { data, info } = await sharp(png)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    return data[(point.y * info.width + point.x) * 3];
  };
  const irisWidth = async (png) => {
    const basis = await eye.evaluate((el) => {
      const b = el.getBoundingClientRect(),
        m = el.querySelector(".dw-eye-rest").getScreenCTM();
      return {
        a: m.a,
        e: m.e - b.x,
        y: Math.round(new DOMPoint(440, 235).matrixTransform(m).y - b.y),
      };
    });
    const { data, info } = await sharp(png)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const painted = [];
    for (let x = 280; x < 574; x++)
      if (
        data[(basis.y * info.width + Math.round(x * basis.a + basis.e)) * 3] >
        200
      )
        painted.push(x);
    return painted.at(-1) - painted[0] + 1;
  };
  const originalWidth = await irisWidth(beforeImage);
  expect(
    Math.abs((await irisWidth(leftImage)) - originalWidth),
  ).toBeLessThanOrEqual(2);
  expect(await irisEdge(beforeImage, 340)).toBeLessThan(20);
  expect(await irisEdge(leftImage, 340)).toBeGreaterThan(240);
  await eye.evaluate((el) =>
    el.getAnimations({ subtree: true }).forEach((a) => {
      a.pause();
      a.currentTime = 1720;
    }),
  );
  const rightImage = await eye.screenshot();
  expect(await irisEdge(rightImage, 540)).toBeGreaterThan(240);
  expect(
    Math.abs((await irisWidth(rightImage)) - originalWidth),
  ).toBeLessThanOrEqual(2);
  const ear = page.locator(".dw-ears");
  await ear.hover();
  const rings = [];
  for (const phase of [0.16, 0.34, 0.43]) {
    await ear.evaluate(
      (el, phase) =>
        el.getAnimations({ subtree: true }).forEach((a) => {
          a.pause();
          a.currentTime = 3200 * phase;
        }),
      phase,
    );
    rings.push(
      await ear.evaluate((el) =>
        ["inner", "middle", "outer"].map((which) =>
          Number(
            getComputedStyle(el.querySelector(`.dw-ear-ripple-${which}`))
              .opacity,
          ),
        ),
      ),
    );
  }
  expect(rings[0][0]).toBeGreaterThan(0.9);
  expect(rings[0][1]).toBeLessThan(0.1);
  expect(rings[0][2]).toBeLessThan(0.1);
  expect(rings[1][1]).toBeGreaterThan(0.9);
  expect(rings[1][2]).toBeLessThan(0.1);
  expect(rings[2][2]).toBeGreaterThan(0.9);
});

test("My Learning restores bounded original cards and clickable progress rows", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1920, height: 1100 });
  await page.evaluate(() => {
    localStorage.setItem(
      "glaucomaWorkshop:progress:glaucomaWhatIs",
      JSON.stringify({ percent: 71, updatedAt: Date.now() }),
    );
    localStorage.setItem("myLearningActiveTab", "inProgress");
    sessionStorage.setItem("myLearningActiveTab", "inProgress");
  });
  await page.locator('.dw-nav[data-dashboard-route="mylearning"]').click();
  const card = page
    .locator(".ml-progress-card")
    .filter({ hasText: "Glaucoma Workshop" });
  await expect(card).toBeVisible();
  expect((await card.boundingBox()).width).toBeLessThanOrEqual(454);
  await expect(card.locator(".ml-card-bg")).toHaveAttribute(
    "src",
    /car_glaucoma.webp/,
  );
  const summary = card.locator(".ml-progress-card__summary");
  await expect(summary).toHaveAttribute("aria-expanded", "false");
  await summary.click();
  await expect(card.locator(".ml-progress-item__percent")).toHaveText("71%");
  await expect(card.locator(".ml-progress-item")).toBeVisible();
  await page.locator(".dashboard-desktop").screenshot({
    path: testInfo.outputPath("my-learning-progress-restored.png"),
  });
  await summary.click();
  await expect(card.locator(".ml-progress-items")).toBeHidden();
  await summary.click();
  await card.locator(".ml-progress-item").click();
  await expect(page).not.toHaveURL(/#\/mylearning$/);
});

test("original catalog proportions, vertical Atoms contents and centered white Settings panels", async ({
  page,
}) => {
  await page.locator('.dw-nav[data-dashboard-route="eyes"]').click();
  const card = page.locator("#coreCarousel .eyes-card").first();
  await expect(card).toBeVisible();
  const box = await card.boundingBox();
  expect(box.width).toBe(224);
  expect(box.height).toBe(148);
  await page.locator('.dw-nav[data-dashboard-route="atomscard"]').click();
  await expect(page.locator("#tocList li")).toHaveCount(16);
  const layout = await page.locator("#tocDropdown").evaluate((el) => {
    const b = el.getBoundingClientRect();
    const rows = el.querySelectorAll("li"),
      first = rows[0].getBoundingClientRect(),
      second = rows[1].getBoundingClientRect();
    return {
      width: b.width,
      gap:
        b.left -
        el
          .closest("#atomsCardPage")
          .querySelector("#atomsImageContainer")
          .getBoundingClientRect().right,
      vertical: second.y >= first.bottom,
      sameLeft: Math.abs(second.x - first.x),
      closeDisplay: getComputedStyle(el.querySelector("#tocInlineCloseBtn"))
        .display,
    };
  });
  expect(layout.width).toBeLessThanOrEqual(280);
  expect(layout.width).toBeGreaterThanOrEqual(240);
  expect(Math.abs(layout.gap)).toBeLessThan(1);
  expect(layout.vertical).toBe(true);
  expect(layout.sameLeft).toBeLessThan(1);
  expect(layout.closeDisplay).toBe("none");
  await page.locator('.dw-nav[data-dashboard-route="settings"]').click();
  const settings = await page
    .locator(".settings-page__content")
    .evaluate((el) => {
      const b = el.getBoundingClientRect(),
        main = el.closest(".dw-main").getBoundingClientRect();
      return {
        center: b.x + b.width / 2 - main.x - main.width / 2,
        width: b.width,
        background: getComputedStyle(el.querySelector(".settings-section"))
          .backgroundColor,
        bg: getComputedStyle(el.closest("#settingsPage")).backgroundColor,
      };
    });
  expect(Math.abs(settings.center)).toBeLessThan(1);
  expect(settings.width).toBeLessThanOrEqual(680);
  expect(settings.background).toBe("rgb(255, 255, 255)");
  expect(settings.bg).toBe("rgb(242, 242, 247)");
});

test("all requested desktop pages retain the sidebar and the workspace background", async ({
  page,
}, testInfo) => {
  await page.evaluate(() => {
    window.savedWorkspaceSidebar = document.querySelector(".dw-sidebar");
  });
  for (const [route, id] of [
    ["eyes", "eyesCatalogPage"],
    ["ears", "earsCatalogPage"],
    ["myprofile", "myProfilePage"],
    ["settings", "settingsPage"],
    ["mylearning", "likedPage"],
    ["atomscard", "atomsCardPage"],
  ]) {
    await page.locator(`.dw-nav[data-dashboard-route="${route}"]`).click();
    await expect(page.locator(`.dw-main #${id}`)).toBeVisible();
    await expect(
      page.locator(`.dw-nav[data-dashboard-route="${route}"]`),
    ).toHaveAttribute("aria-current", "page");
    expect(
      await page.evaluate(
        () =>
          window.savedWorkspaceSidebar ===
          document.querySelector(".dw-sidebar"),
      ),
    ).toBe(true);
    for (const width of [1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1100 });
      const layout = await page.locator(`#${id}`).evaluate((el) => {
        const main = el.closest(".dw-main").getBoundingClientRect();
        const bar = el
          .closest("#unifiedDashboard")
          .querySelector(".dw-route-title")
          .getBoundingClientRect();
        return {
          bg: getComputedStyle(el).backgroundColor,
          overflow: document.documentElement.scrollWidth - innerWidth,
          barInside: bar.left >= main.left - 1 && bar.right <= main.right + 1,
        };
      });
      expect(layout.bg).toBe("rgb(242, 242, 247)");
      expect(layout.overflow).toBeLessThanOrEqual(1);
      expect(layout.barInside).toBe(true);
    }
    await page
      .locator(".dashboard-desktop")
      .screenshot({ path: testInfo.outputPath(`workspace-${route}.png`) });
  }
});

test("desktop Atoms contents stay open without a toggle and retain keyboard topic selection", async ({
  page,
}) => {
  await page.locator('.dw-nav[data-dashboard-route="atomscard"]').click();
  const toc = page.locator("#tocDropdown");
  await expect(toc).toBeVisible();
  await expect(page.locator("#tocToggleBtn")).toBeHidden();
  await page.locator('#tocList li[data-topic="Red Eye"]').click();
  await page.locator("#earsTab").click();
  await expect(page.locator("#tocList li")).toHaveCount(8);
  await page.locator('#tocList li[data-topic="Ear Drum"]').focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#atomsImageContainer img")).toHaveAttribute(
    "src",
    /Drum.webp/,
  );
  await page.keyboard.press("Escape");
  await expect(toc).toBeVisible();
  await page
    .locator('#tocList li[data-topic="Childhood Hearing Development"]')
    .click();
  await expect(page.locator("#atomsImageContainer img")).toHaveAttribute(
    "src",
    /EarChildDevelopment.webp/,
  );
});

test("Eyes looks both ways before blinking and Skin fills the lower right corner", async ({
  page,
}, testInfo) => {
  await page.locator(".dw-eyes").hover();
  const poses = [];
  for (const phase of [0.2, 0.43, 0.78]) {
    await page.locator(".dw-eyes").evaluate(
      (el, phase) =>
        el.getAnimations({ subtree: true }).forEach((animation) => {
          animation.pause();
          animation.currentTime = 4000 * phase;
        }),
      phase,
    );
    poses.push(
      await page
        .locator(".dw-eye-gaze")
        .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).e),
    );
    if (phase === 0.78)
      expect(
        await page
          .locator(".dw-eye-shape")
          .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).d),
      ).toBeLessThan(0.15);
    await page
      .locator(".dw-eyes")
      .screenshot({ path: testInfo.outputPath(`eye-${phase}.png`) });
  }
  expect(poses[0]).toBeLessThan(-10);
  expect(poses[1]).toBeGreaterThan(10);
  await page.mouse.move(1, 1);
  const shot = await page.locator(".dw-skin").screenshot();
  const { data, info } = await sharp(shot)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixel = (x, y) =>
    Array.from(
      data.subarray(
        (y * info.width + x) * info.channels,
        (y * info.width + x) * info.channels + 3,
      ),
    );
  expect(pixel(info.width - 12, info.height - 12)).toEqual(
    pixel(info.width - 35, info.height - 25),
  );
});

test("mobile Atoms contents retain the original overlay and reopen consistently", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/atomscard");
  const toc = page.locator("#tocDropdown"),
    toggle = page.locator("#tocToggleBtn");
  await expect(toc).toBeVisible();
  await page.locator('#tocList li[data-topic="Red Eye"]').click();
  await expect(toc).toBeHidden();
  await toggle.click();
  await page.locator("#tocInlineCloseBtn").click();
  await expect(toc).toBeHidden();
  await toggle.click();
  await page.waitForTimeout(350);
  await expect(toc).toBeVisible();
  await expect(page.locator(".dw-sidebar")).toHaveCount(0);
  await page.locator("#tocInlineCloseBtn").click();
  await expect(toc).toBeHidden();
  await page.setViewportSize({ width: 1440, height: 1100 });
  await expect(page.locator(".dw-sidebar")).toBeVisible();
  await expect(toc).toBeVisible();
  await expect(toggle).toBeHidden();
  await page.keyboard.press("Escape");
  await expect(toc).toBeVisible();
});

test("sidebar stays mounted while real My Learning and Atoms Card routes switch", async ({
  page,
}, testInfo) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.evaluate(() => {
    window.savedWorkspaceSidebar = document.querySelector(".dw-sidebar");
  });
  await page.locator('.dw-nav[data-dashboard-route="mylearning"]').click();
  await expect(page.locator(".dw-main #likedPage")).toBeVisible();
  await expect(
    page.locator('.dw-nav[data-dashboard-route="mylearning"]'),
  ).toHaveAttribute("aria-current", "page");
  const notes = page.locator('.ml-tab[data-ml-tab="notes"]');
  await expect(notes).toHaveAttribute("data-ml-bound", "1");
  await notes.click();
  await expect(notes).toHaveClass(/active/);
  await page.screenshot({
    path: testInfo.outputPath("workspace-my-learning.png"),
    fullPage: true,
  });
  await page.locator('.dw-nav[data-dashboard-route="atomscard"]').click();
  await expect(page.locator(".dw-main #atomsCardPage")).toBeVisible();
  await expect(page.locator("#tocList li")).toHaveCount(16);
  const zoomIcons = await page
    .locator(".atoms-card-zoom-controls svg")
    .evaluateAll((icons) =>
      icons.map((icon) => {
        const { y, height } = icon.getBoundingClientRect();
        return {
          center: y + height / 2,
          height,
          stroke: getComputedStyle(icon).strokeWidth,
        };
      }),
    );
  expect(zoomIcons).toHaveLength(3);
  expect(zoomIcons).toEqual(
    Array(3).fill({ center: zoomIcons[0].center, height: 22, stroke: "2.6px" }),
  );
  const controls = await page.locator("#atomsZoomInBtn").boundingBox();
  const main = await page.locator(".dw-main").boundingBox();
  expect(controls.x).toBeGreaterThanOrEqual(main.x);
  expect(controls.y).toBeGreaterThan(main.y);
  expect(
    await page.evaluate(
      () =>
        window.savedWorkspaceSidebar === document.querySelector(".dw-sidebar"),
    ),
  ).toBe(true);
  await page.locator('#tocList li[data-topic="Red Eye"]').click();
  await expect(page.locator("#atomsImageContainer img")).toHaveAttribute(
    "src",
    /RedEye.webp/,
  );
  for (const width of [1024, 1280, 1920, 1440]) {
    await page.setViewportSize({ width, height: 1100 });
    const layout = await page.locator("#atomsCardPage").evaluate((root) => {
      const main = root.closest(".dw-main").getBoundingClientRect();
      const tools = root
        .querySelector(".top-right-icons")
        .getBoundingClientRect();
      const image = root
        .querySelector("#atomsImageContainer")
        .getBoundingClientRect();
      return {
        toolsInside: tools.left >= main.left && tools.right <= main.right,
        imageGap: image.top - tools.bottom,
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    });
    expect(layout.toolsInside).toBe(true);
    expect(layout.imageGap).toBeLessThan(40);
    expect(layout.overflow).toBeLessThanOrEqual(1);
  }
  await page.locator("#atomsZoomInBtn").click();
  expect(
    await page
      .locator(".atoms-card-image-frame")
      .evaluate((el) => parseFloat(el.style.width)),
  ).toBeGreaterThan(100);
  await page.screenshot({
    path: testInfo.outputPath("workspace-atoms-card.png"),
    fullPage: true,
  });
  await page.goBack();
  await expect(page.locator(".dw-main #likedPage")).toBeVisible();
  await expect(page.locator('.ml-tab[data-ml-tab="notes"]')).toHaveClass(
    /active/,
  );
  await page.goForward();
  await expect(page.locator(".dw-main #atomsCardPage")).toBeVisible();
  await page.reload();
  await expect(page.locator(".dw-main #atomsCardPage")).toBeVisible();
  await expect(page.locator(".dw-sidebar")).toBeVisible();
  expect(errors).toEqual([]);
});

test("embedded routes preserve their live controls when crossing the desktop breakpoint", async ({
  page,
}) => {
  await page.locator('.dw-nav[data-dashboard-route="mylearning"]').click();
  await expect(page.locator(".dw-main #likedPage")).toBeVisible();
  await page.locator('.ml-tab[data-ml-tab="notes"]').click();
  await page.locator("#mlSearch").fill("pupils");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".dw-sidebar")).toHaveCount(0);
  await expect(page.locator("#likedPage")).toBeVisible();
  await expect(page.locator("#mlSearch")).toHaveValue("pupils");
  await page.setViewportSize({ width: 1440, height: 1100 });
  await expect(page.locator(".dw-main #likedPage")).toBeVisible();
  await expect(page.locator("#mlSearch")).toHaveValue("pupils");
  await expect(page.locator('.ml-tab[data-ml-tab="notes"]')).toHaveClass(
    /active/,
  );
  await page.locator('.dw-nav[data-dashboard-route="dashboard"]').click();
  await expect(page.locator(".dw-bento")).toBeVisible();
});

test("a delayed previous tab cannot overwrite the latest workspace route", async ({
  page,
}) => {
  await page.route("**/html/mylearning.html", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    await route.continue();
  });
  await page.locator('.dw-nav[data-dashboard-route="mylearning"]').click();
  await page.locator('.dw-nav[data-dashboard-route="atomscard"]').click();
  await expect(page.locator(".dw-main #atomsCardPage")).toBeVisible();
  await page.waitForTimeout(500);
  await expect(page.locator(".dw-main #atomsCardPage")).toBeVisible();
  await expect(page).toHaveURL(/#\/atomscard$/);
});

test("card copy, flush edges, listening waves and hair growth follow the requested layout", async ({
  page,
}, testInfo) => {
  for (const width of [1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1100 });
    const layout = await page.locator(".dw-specialties").evaluate((root) => {
      const eye = root.querySelector(".dw-eyes"),
        ear = root.querySelector(".dw-ears"),
        skin = root.querySelector(".dw-skin");
      const edge = (card, x, y) =>
        new DOMPoint(x, y).matrixTransform(
          card.querySelector("[data-source-art] image").getScreenCTM(),
        );
      const copy = eye
          .querySelector(".dw-specialty-copy")
          .getBoundingClientRect(),
        kicker = eye
          .querySelector(".dw-specialty-kicker")
          .getBoundingClientRect();
      return {
        copyBelow: copy.top > kicker.bottom,
        copyTop: copy.top - eye.getBoundingClientRect().top,
        earBottom: ear.getBoundingClientRect().bottom - edge(ear, 430, 391).y,
        skinRight: skin.getBoundingClientRect().right - edge(skin, 570, 330).x,
        skinBottom:
          skin.getBoundingClientRect().bottom - edge(skin, 300, 393).y,
      };
    });
    expect(layout.copyBelow).toBe(true);
    expect(layout.copyTop).toBeLessThan(60);
    expect(Math.abs(layout.earBottom)).toBeLessThan(1);
    expect(Math.abs(layout.skinBottom)).toBeLessThan(1);
    expect(Math.abs(layout.skinRight)).toBeLessThan(1);
  }
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.locator(".dw-ears").hover();
  await page.locator(".dw-ears").evaluate((el) =>
    el.getAnimations({ subtree: true }).forEach((animation) => {
      animation.pause();
      animation.currentTime = 3200 * 0.43;
    }),
  );
  expect(
    await page
      .locator(".dw-ear-waves")
      .evaluate((el) => Number(getComputedStyle(el).opacity)),
  ).toBeGreaterThan(0.5);
  const waveImage = await page
    .locator(".dw-ears")
    .screenshot({ path: testInfo.outputPath("ears-waves.png") });
  const waveRow = await page.locator(".dw-ears").evaluate((el) => {
    const point = new DOMPoint(300, 225).matrixTransform(
      el.querySelector(".dw-specialty-art").getScreenCTM(),
    );
    return Math.round(point.y - el.getBoundingClientRect().top);
  });
  const { data: wavePixels, info: waveInfo } = await sharp(waveImage)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const redRuns = [];
  for (let x = 0; x < waveInfo.width; x++) {
    const offset = (waveRow * waveInfo.width + x) * 3;
    if (
      wavePixels[offset] > 150 &&
      wavePixels[offset + 1] < 80 &&
      wavePixels[offset + 2] < 80
    ) {
      const last = redRuns.at(-1);
      if (last && last.end === x - 1) last.end = x;
      else redRuns.push({ start: x, end: x });
    }
  }
  expect(redRuns).toHaveLength(3);
  const weights = redRuns.map(({ start, end }) => end - start + 1);
  expect(Math.max(...weights) - Math.min(...weights)).toBeLessThanOrEqual(1);
  expect(redRuns[1].start - redRuns[0].end).toBeGreaterThan(8);
  expect(redRuns[2].start - redRuns[1].end).toBeGreaterThan(8);
  await page.locator(".dw-skin").hover();
  const growth = [];
  for (const phase of [0.36, 0.58]) {
    await page.locator(".dw-skin-hair").evaluate(
      (el, phase) =>
        el.getAnimations().forEach((animation) => {
          animation.pause();
          animation.currentTime = 3200 * phase;
        }),
      phase,
    );
    growth.push(
      await page
        .locator(".dw-skin-hair")
        .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).d),
    );
    await page
      .locator(".dw-skin")
      .screenshot({ path: testInfo.outputPath(`skin-growth-${phase}.png`) });
  }
  expect(growth[1]).toBeGreaterThan(growth[0] + 0.2);
});

function clippedArtwork(root) {
  return Array.from(root.querySelectorAll(".dw-specialty")).flatMap((card) => {
    const frame = card.getBoundingClientRect();
    const copy = card
      .querySelector(".dw-specialty-copy")
      .getBoundingClientRect();
    const regions = {
      eyes: [[236, 132, 574, 339]],
      ears: [[320, 84, 545, 391]],
      skin: [
        [420, 69, 483, 285],
        [240, 198, 570, 214],
        [240, 253, 570, 393],
      ],
    };
    const image = card.querySelector("[data-source-art] image");
    const matrix = image.getScreenCTM();
    return regions[card.dataset.category].flatMap(
      ([left, top, right, bottom]) => {
        const first = new DOMPoint(left, top).matrixTransform(matrix),
          last = new DOMPoint(right, bottom).matrixTransform(matrix);
        const box = {
          left: first.x,
          top: first.y,
          right: last.x,
          bottom: last.y,
        };
        const clipped =
          box.left < frame.left - 1 ||
          box.right > frame.right + 1 ||
          box.top < frame.top - 1 ||
          box.bottom > frame.bottom + 1;
        // A source path can combine the hair and lower skin surface. Test the
        // painted area rather than treating the empty space between them as ink.
        const overlaps =
          box.left < copy.right &&
          box.right > copy.left &&
          box.top < copy.bottom &&
          box.bottom > copy.top;
        return clipped || overlaps
          ? [{ subject: card.dataset.category, clipped, overlaps }]
          : [];
      },
    );
  });
}

test("original specialty artwork retains its size and placement at both pixel densities", async ({
  page,
  browser,
}, testInfo) => {
  for (const dpr of [1, 2]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1100 },
      deviceScaleFactor: dpr,
      serviceWorkers: "block",
    });
    const screen = await context.newPage();
    await screen.goto(page.url());
    await expect(screen.locator(".dw-specialty-art")).toHaveCount(3);
    for (const width of [1024, 1280, 1440, 1920]) {
      await screen.setViewportSize({ width, height: 1100 });
      const gaps = await screen.locator(".dw-specialties").evaluate((root) => {
        const right = (category, x, y) => {
          const card = root.querySelector(".dw-" + category);
          const point = new DOMPoint(x, y).matrixTransform(
            card.querySelector("[data-source-art] image").getScreenCTM(),
          );
          return card.getBoundingClientRect().right - point.x;
        };
        return {
          eyes: right("eyes", 574, 235),
          ears: right("ears", 545, 235),
          skin: right("skin", 570, 300),
        };
      });
      expect(Math.abs(gaps.eyes)).toBeLessThan(1);
      expect(gaps.ears).toBeGreaterThan(8);
      expect(gaps.ears).toBeLessThan(36);
      expect(Math.abs(gaps.skin)).toBeLessThan(1);
      expect(
        await screen.locator(".dw-specialties").evaluate(clippedArtwork),
      ).toEqual([]);
      expect(
        await screen
          .locator(".dw-specialty-art")
          .evaluateAll((art) =>
            art.every(
              (svg) =>
                svg
                  .querySelector("[data-source-art] image")
                  .href.baseVal.endsWith(
                    svg.querySelector("[data-source-art]").dataset.sourceArt,
                  ) && getComputedStyle(svg).filter === "none",
            ),
          ),
      ).toBe(true);
      if (width === 1440) {
        const skin = screen.locator(".dw-skin");
        const sample = await skin.evaluate((card) => {
          const rect = card.getBoundingClientRect();
          const point = new DOMPoint(420, 85).matrixTransform(
            card.querySelector("[data-source-art] image").getScreenCTM(),
          );
          return {
            x: point.x - rect.left,
            y: point.y - rect.top,
            color: getComputedStyle(card)
              .backgroundColor.match(/\d+/g)
              .slice(0, 3)
              .map(Number),
          };
        });
        const pixels = await sharp(await skin.screenshot())
          .removeAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true });
        const offset =
          (Math.round(sample.y * dpr) * pixels.info.width +
            Math.round(sample.x * dpr)) *
          pixels.info.channels;
        expect(Array.from(pixels.data.subarray(offset, offset + 3))).toEqual(
          sample.color,
        );
        const dimensions = await screen
          .locator(".dw-ears [data-source-art]")
          .evaluate((el) => el.getBoundingClientRect().toJSON());
        expect(dimensions.width).toBeGreaterThan(110);
        expect(dimensions.height).toBeGreaterThan(150);
        await expect(
          screen.locator(".dw-eyes [data-source-art]"),
        ).toHaveAttribute("data-source-art", "eyes.webp");
        await screen.locator(".dw-specialties").screenshot({
          path: testInfo.outputPath(`specialties-dpr-${dpr}.png`),
        });
      }
    }
    await context.close();
  }
});

test("each subject moves on hover without cropping, resets on exit and honours reduced motion", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const category of ["eyes", "ears", "skin"]) {
    const card = page.locator(".dw-" + category);
    await card.hover();
    expect(
      await card.evaluate((el) => el.getAnimations({ subtree: true }).length),
    ).toBeGreaterThan(0);
    for (const phase of [0, 0.25, 0.42, 0.58, 0.85]) {
      await card.evaluate(
        (el, phase) =>
          el.getAnimations({ subtree: true }).forEach((animation) => {
            animation.pause();
            animation.currentTime = 3200 * phase;
          }),
        phase,
      );
      expect(
        await page.locator(".dw-specialties").evaluate(clippedArtwork),
      ).toEqual([]);
    }
    await card.evaluate((el) =>
      el.getAnimations({ subtree: true }).forEach((animation) => {
        animation.currentTime = 3200 * 0.43;
      }),
    );
    await card.screenshot({
      path: testInfo.outputPath(`hover-${category}.png`),
    });
    await page.mouse.move(1, 1);
    expect(
      await card.evaluate((el) => el.getAnimations({ subtree: true }).length),
    ).toBe(0);
  }
  await expect(page.locator(".dw-skin")).toBeDisabled();
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const category of ["eyes", "ears", "skin"]) {
    const card = page.locator(".dw-" + category);
    await card.hover();
    expect(
      await card.evaluate((el) => el.getAnimations({ subtree: true }).length),
    ).toBe(0);
  }
});

test("touch devices keep static graphics even at desktop dimensions", async ({
  page,
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1000 },
    hasTouch: true,
    serviceWorkers: "block",
  });
  const touch = await context.newPage();
  await touch.goto(page.url());
  await expect(touch.locator(".dw-specialty-art")).toHaveCount(3);
  await touch.locator(".dw-skin").hover();
  expect(
    await touch
      .locator(".dw-specialties")
      .evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);
  await context.close();
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    localStorage.setItem("username", "Sujin");
    localStorage.setItem("userField", "eyes");
    localStorage.setItem("arclight:download-suggestion-shown", "1");
  });
  await page.goto("/#/dashboard");
  await expect(
    page.locator("#dashboardWorkspaceRecommendations .module-card"),
  ).toHaveCount(4);
});

test("desktop matches the bento hierarchy without clipped controls at four widths", async ({
  page,
}, testInfo) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1100 });
    const workspace = page.locator(".dashboard-desktop");
    await expect(workspace).toBeVisible();
    await expect(
      page.locator(".dw-topbar #dashboardSearchToggle"),
    ).toBeVisible();
    await expect(workspace.locator(".dw-brand + nav")).toBeVisible();
    await expect(workspace.locator(".dw-skin")).toBeDisabled();
    expect(
      await workspace.evaluate((root) => {
        const box = root.getBoundingClientRect();
        return Array.from(root.querySelectorAll("button,h1,h2,p,.dw-panel"))
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            return (
              rect.width > 0 &&
              (rect.left < box.left - 1 ||
                rect.right > box.right + 1 ||
                el.scrollWidth > el.clientWidth + 2)
            );
          })
          .map((el) => el.className);
      }),
    ).toEqual([]);
    expect(
      await workspace
        .locator("img")
        .evaluateAll((images) =>
          images.every((img) => img.complete && img.naturalWidth > 0),
        ),
    ).toBe(true);
    await workspace.screenshot({
      path: testInfo.outputPath(`dashboard-${width}.png`),
    });
  }
  expect(errors).toEqual([]);
});

test("search, lesson routing, profile updates and Notes retain their real targets", async ({
  page,
}) => {
  await page.keyboard.press("/");
  const search = page.locator("#dashboardSearchInput");
  await expect(search).toBeFocused();
  await search.fill("visual acuity");
  const result = page.locator("#dashboardSearchPanel .module-card").first();
  await expect(result).toContainText("Visual Acuity");
  await result.click();
  await expect(page.locator("#visualAcuityPage")).toBeVisible();
  await page.goto("/#/dashboard");
  await expect(page.locator(".dw-account [data-dashboard-avatar]")).toHaveText(
    "S",
  );
  await page.evaluate(() => {
    localStorage.setItem("username", "Mina");
    document.dispatchEvent(new CustomEvent("arclight:profile-updated"));
  });
  await expect(page.locator(".dw-account [data-dashboard-avatar]")).toHaveText(
    "M",
  );
  await expect(page.locator("[data-dashboard-greeting]")).toContainText("Mina");
  await page.locator("[data-dashboard-notes]").click();
  await expect(page).toHaveURL(/#\/mylearning/);
  await expect(page.locator('.ml-tab[data-ml-tab="notes"]')).toHaveClass(
    /active/,
  );
});

test("category, profile, settings and tour links navigate; language picker stays local", async ({
  page,
}) => {
  for (const [selector, route] of [
    [".dw-eyes", "eyes"],
    [".dw-ears", "ears"],
    [".dw-account", "myprofile"],
    ['.dw-nav[data-dashboard-route="settings"]', "settings"],
    [".dw-tour button", "intro"],
  ]) {
    await page.locator(selector).click();
    await expect(page).toHaveURL(new RegExp("#/" + route + "$"));
    await page.goto("/#/dashboard");
    await expect(page.locator(".dw-account")).toBeVisible();
  }
  await page.locator("[data-dashboard-language]").click();
  await expect(page.locator("#languagePickerOverlay")).toBeVisible();
  await expect(page).toHaveURL(/#\/dashboard$/);
});

test("mobile keeps the category carousel and shares search when resizing to desktop", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".dashboard-desktop")).toBeHidden();
  await expect(page.locator("#categoryCarousel")).toBeVisible();
  await expect(
    page.locator("#recommendedPlaceholder .module-card"),
  ).toHaveCount(2);
  await page.locator("#dashboardSearchToggle").click();
  const search = page.locator("#dashboardSearchInput");
  await search.fill("pupils");
  await expect(page.locator("#dashboardSearchPanel")).toBeVisible();
  await search.press("Escape");
  await expect(search).toBeHidden();
  await expect(search).toHaveValue("pupils");
  await page.locator(".hello-wrap").click();
  await page.screenshot({
    path: testInfo.outputPath("dashboard-mobile.png"),
    fullPage: true,
  });
  await page.setViewportSize({ width: 1280, height: 1000 });
  await expect(page.locator(".dw-topbar #dashboardSearchInput")).toHaveValue(
    "pupils",
  );
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page.locator(".unified-top #dashboardSearchInput")).toHaveCount(
    1,
  );
  await expect(page.locator("#categoryCarousel")).toBeVisible();
});

test("Korean and RTL layouts translate headings without duplicated recommendations", async ({
  page,
}) => {
  for (const lang of ["ko", "ar"]) {
    await page.evaluate(async (lang) => {
      await window.I18N.setLanguage(lang);
    }, lang);
    await expect(page.locator(".dw-heading .dw-eyebrow")).not.toHaveText(
      "Your learning space",
    );
    await expect(
      page.locator("#dashboardWorkspaceRecommendations .module-card"),
    ).toHaveCount(4);
    expect(
      await page
        .locator(".dashboard-desktop")
        .evaluate((root) => root.scrollWidth <= root.clientWidth + 1),
    ).toBe(true);
  }
});

test("Download opens the existing offline selection dialog", async ({
  page,
}) => {
  await page.route("**/api/app/offline-assets", (route) =>
    route.fulfill({
      json: {
        urls: ["/js/main.js"],
        assets: [{ url: "/js/main.js", bytes: 1000 }],
      },
    }),
  );
  await page.locator("[data-dashboard-download]").click();
  await expect(
    page.getByRole("dialog", { name: "Download options", exact: true }),
  ).toBeVisible();
});
