import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
});

async function acknowledgeNotice(page) {
  const notice = page.locator("#experimentalMiniAppNoticeOverlay");
  await expect(notice).toBeVisible();
  await expect(notice).toContainText("Interactive learning notice");
  await notice.locator("[data-experimental-miniapp-ok]").click();
  await expect(notice).toBeHidden();
}

test("Discs opens from Interactive Learning with the existing notice, controls and return flow", async ({
  page,
}) => {
  await page.goto("/#videos/interactiveLearningPage");
  const hub = page.locator("#interactiveLearningPage");
  await expect(hub).toBeVisible();
  await expect(
    hub.locator('.eyes-topbar__title a[aria-label="Go to dashboard"]'),
  ).toBeVisible();
  await expect(hub.locator(".eyes-topbar .menuBtn")).toBeVisible();
  const card = hub.locator('[data-page="discsInteractivePage"]');
  await expect(card.locator(".lesson-type")).toHaveText("Discs");
  await card.locator(".lesson-row").click();
  await expect(page.locator("#discsInteractivePage")).toBeVisible();
  await acknowledgeNotice(page);

  const frame = page.frameLocator("#discsInteractivePage iframe");
  await expect(frame.locator(".app-bar h1")).toHaveText("Discs");
  await frame.locator("#infoButton").click();
  await expect(frame.locator("#infoPopup")).toBeVisible();
  await frame.locator("#closeInfoButton").click();
  await frame.locator("#menuButton").click();
  await expect(frame.locator("#sideMenu")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await frame.locator("#closeDrawerButton").click();
  await frame.locator("#arclightEmbeddedBackButton").click();
  await expect(hub).toBeVisible();
  await expect(hub.locator(".eyes-topbar .menuBtn")).toBeVisible();
  await expect(page.locator("body")).not.toHaveAttribute(
    "data-interactive-subapp-open",
    "true",
  );
  await card.locator(".lesson-row").focus();
  await page.keyboard.press("Enter");
  await acknowledgeNotice(page);
});

const embeddedPages = [
  "miresPage",
  "fundalReflexSimulatorPage",
  "morphSimulatorPage",
  "traumaInteractivePage",
  "amslerInteractivePage",
  "glaucomaSimulatorPage",
  "fieldsInteractivePage",
  "refractInteractivePage",
  "sauronInteractivePage",
  "discsInteractivePage",
  "swollenDiscsInteractivePage",
  "squintPalsySimulatorPage",
  "cataractSimulatorPage",
];

for (const id of embeddedPages) {
  test(`${id} preserves the embedded Eyes top bar and notice`, async ({
    page,
  }) => {
    await page.goto(`/#videos/${id}`);
    await expect(page.locator(`#${id}`)).toBeVisible();
    await acknowledgeNotice(page);
    await expect(page.locator("body")).toHaveAttribute(
      "data-interactive-subapp-open",
      "true",
    );
    const frame = page.frameLocator(`#${id} iframe`);
    const back = frame.locator("#arclightEmbeddedBackButton");
    const info = frame.locator('[data-arclight-embedded-info-button="true"]');
    const menu = frame.locator('[data-arclight-embedded-menu-button="true"]');
    await expect(back).toBeVisible();
    await expect(info).toBeVisible();
    await expect(menu).toBeVisible();
    const desktop = page.viewportSize().width >= 1024;
    const size = desktop ? 36 : 44;
    if (
      [
        "fundalReflexSimulatorPage",
        "glaucomaSimulatorPage",
        "refractInteractivePage",
      ].includes(id)
    ) {
      await expect(frame.locator("body")).toHaveCSS("font-family", /Inter/);
    }
    for (const control of [back, info, menu]) {
      await expect(control).toHaveCSS("width", `${size}px`);
      await expect(control).toHaveCSS("height", `${size}px`);
    }
    const chrome = await back.evaluate((button) => {
      const doc = button.ownerDocument;
      const bar = button.parentElement;
      const rect = bar.getBoundingClientRect();
      const style = doc.getElementById("arclightEmbeddedSubappChromeStyle");
      return {
        height: rect.height,
        nonce: style.nonce,
        expectedNonce: doc.querySelector("script[nonce]")?.nonce,
        overflow:
          doc.documentElement.scrollWidth > doc.documentElement.clientWidth + 1,
      };
    });
    expect(chrome.height).toBe(desktop ? 62 : 58);
    expect(chrome.nonce).toBeTruthy();
    expect(chrome.nonce).toBe(chrome.expectedNonce);
    expect(chrome.overflow).toBe(false);
    const colours = await back.evaluate((button) => {
      const doc = button.ownerDocument;
      const bar = button.parentElement;
      const computed = (element) => doc.defaultView.getComputedStyle(element);
      const after = doc.defaultView.getComputedStyle(bar, "::after");
      const infoButton = bar.querySelector(
        '[data-arclight-embedded-info-button="true"]',
      );
      const titleColour =
        after.content && !["none", "normal", '""', "''"].includes(after.content)
          ? after.color
          : computed(bar.querySelector("h1")).color;
      return {
        title: titleColour,
        back: computed(button).color,
        arrow: computed(button.querySelector(".arclight-embedded-back-icon"))
          .backgroundColor,
        info: computed(infoButton).color,
        infoGlyph: computed(infoButton.firstElementChild || infoButton).color,
        menu: computed(
          bar.querySelector('[data-arclight-embedded-menu-button="true"]'),
        ).color,
        menuGlyph: computed(bar.querySelector(".arclight-embedded-menu-icon"))
          .color,
      };
    });
    for (const colour of [
      colours.back,
      colours.arrow,
      colours.info,
      colours.infoGlyph,
      colours.menu,
      colours.menuGlyph,
    ]) {
      expect(colour).toBe(colours.title);
    }
    await back.click();
    await expect(page.locator("#interactiveLearningPage")).toBeVisible();
  });
}
