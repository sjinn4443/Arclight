import { expect, test } from "@playwright/test";

test("Glaucoma 3D opens from Intermediate with Eyes controls and working orange 3D playback", async ({
  page,
}, testInfo) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    window.addEventListener("securitypolicyviolation", (event) => {
      throw new Error(
        `CSP violation: ${event.violatedDirective} ${event.blockedURI}`,
      );
    });
  });
  await page.goto("/#videos/interactiveLearningPage");
  const hub = page.locator("#interactiveLearningPage");
  const lesson = hub.locator(
    '.pupil-level--intermediate [data-target="glaucoma3DInteractivePage"]',
  );
  await expect(lesson.locator(".lesson-type")).toHaveText("Glaucoma 3D");
  await expect(hub.locator(".pupil-level--intermediate")).toHaveCSS(
    "--accent",
    "#f25600",
  );
  await expect(
    page.locator("#glaucoma3DInteractivePage iframe"),
  ).not.toHaveAttribute("src");
  await lesson.click();
  const host = page.locator("#glaucoma3DInteractivePage");
  await expect(host).toBeVisible();
  const notice = page.locator("#experimentalMiniAppNoticeOverlay");
  await expect(notice).toBeVisible();
  await notice.locator("[data-experimental-miniapp-ok]").click();
  await expect(host.locator(".eyes-topbar__title a")).toBeVisible();
  await expect(host.locator(".eyes-topbar .menuBtn")).toBeVisible();
  await expect(page.locator("#backBtnGlobal")).toBeVisible();

  const frame = page.frameLocator("#glaucoma3DInteractivePage iframe");
  await expect(frame.locator("#play")).toBeEnabled({ timeout: 45_000 });
  await expect(frame.locator("#loading")).toBeHidden();
  await expect(frame.locator("#play")).toHaveCSS(
    "background-color",
    "rgb(242, 86, 0)",
  );
  await expect(frame.locator("#canvas")).toBeVisible();
  const layout = await host.evaluate((node) => {
    const bar = node.querySelector(".eyes-topbar").getBoundingClientRect();
    const iframe = node.querySelector("iframe");
    const rect = iframe.getBoundingClientRect();
    const doc = iframe.contentDocument;
    const bounds = node.getBoundingClientRect();
    return {
      left: bounds.left,
      right: bounds.right,
      width: window.innerWidth,
      barBottom: bar.bottom,
      frameTop: rect.top,
      frameBottom: rect.bottom,
      height: window.innerHeight,
      hostOverflow:
        document.documentElement.scrollWidth > window.innerWidth + 1,
      frameOverflow:
        doc.documentElement.scrollWidth > doc.documentElement.clientWidth + 1,
      scrollOverflow:
        doc.documentElement.scrollHeight > doc.documentElement.clientHeight + 1,
    };
  });
  expect(layout.left).toBe(0);
  expect(layout.right).toBe(layout.width);
  expect(layout.frameTop).toBeGreaterThanOrEqual(layout.barBottom);
  expect(layout.frameBottom).toBeLessThanOrEqual(layout.height + 1);
  expect(layout.hostOverflow).toBe(false);
  expect(layout.frameOverflow).toBe(false);
  expect(layout.scrollOverflow).toBe(false);
  await page.screenshot({ path: testInfo.outputPath("anatomy.png") });

  await frame.locator("#play").click();
  await expect(frame.locator("body")).toHaveAttribute(
    "data-mode",
    "progression",
  );
  await frame.locator('[data-stage="1"]').click();
  await expect(frame.locator('[data-stage="1"]')).toHaveClass(/active/);
  await expect(frame.locator('[data-stage="1"]')).toHaveCSS(
    "background-color",
    "rgb(242, 86, 0)",
  );
  await page.screenshot({ path: testInfo.outputPath("progression.png") });
  await host.locator(".eyes-topbar .menuBtn").click();
  await expect(page.locator("#menuOverlay")).toBeVisible();
  await page.locator("#closeMenuBtn").click();
  await expect(page.locator("#menuOverlay")).toBeHidden();
  await page.locator("#backBtnGlobal").click();
  await expect(hub).toBeVisible();
  await lesson.focus();
  await page.keyboard.press("Enter");
  await expect(host).toBeVisible();
  expect(errors).toEqual([]);
});
