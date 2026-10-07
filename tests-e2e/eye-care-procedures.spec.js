import { expect, test } from "@playwright/test";

const procedures = [
  [
    "Lid Hygeine",
    "lidHygiene",
    ["clean_eye", "warm_compress"],
    ["1.Cleananeye", "2.Warmcompress"],
  ],
  ["Eye Irrigation", "eyeIrrigation", ["irrigate_eye"], ["3.Irrigateaneye"]],
  [
    "Eyelash Removal",
    "eyelashRemoval",
    ["remove_eyelashes"],
    ["5.RemoveEyeLash"],
  ],
  [
    "Foreign Body Removal",
    "foreignBodyRemoval",
    ["remove_foreign_body"],
    ["4.ForeignBodyRemoval"],
  ],
  [
    "Drops & Ointment",
    "dropsOintment",
    ["instil_medication"],
    ["6.InstileyedropsNointment"],
  ],
  [
    "Eye Pad / Shield",
    "eyePadShield",
    ["make_eye_pad", "apply_eye_pad"],
    ["7.MakepadNshield", "8.Applypadandshield"],
  ],
  [
    "Sight Loss Guidance",
    "sightLossGuidance",
    ["guide_sight_loss"],
    ["11.GuideBlindPerson"],
  ],
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    localStorage.setItem("arclight:eyes:carousel-guide-seen:v2", "1");
  });
});

test("all procedure cards open their PEC lessons and playable videos", async ({
  page,
}, testInfo) => {
  const mp4Support = await page.evaluate(() =>
    document
      .createElement("video")
      .canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'),
  );
  // Windows WebKit reports MP4 support but stays at NETWORK_NO_SOURCE for
  // both the original PEC player and these pages. Exercise decoding in Chromium.
  const exercisePlayback =
    mp4Support &&
    !(
      process.platform === "win32" &&
      testInfo.project.use.browserName === "webkit"
    );
  if (!exercisePlayback) {
    testInfo.annotations.push({
      type: "media",
      description:
        "MP4 playback unavailable in this runtime; media URLs, quality controls, and navigation are verified.",
    });
    console.log(
      `${testInfo.project.name}: verifying media URLs and controls; playback unavailable in this runtime`,
    );
  }
  for (const [label, route, keys, files] of procedures) {
    await page.goto("/#/eyes");
    const card = page.locator(`#procedureCarousel [data-label="${label}"]`);
    await expect(card.locator(".tag")).toHaveText("Video");
    await expect(card.locator(".eyes-card__open")).toBeEnabled();
    // Centre a carousel card before clicking to avoid dragging the carousel.
    await card.evaluate((el) =>
      el.scrollIntoView({ block: "center", inline: "center" }),
    );
    await card.locator(".eyes-card__open").click();
    const detail = page.locator(`#${route}`);
    await expect(detail).toBeVisible();
    await page.evaluate(() =>
      document.getElementById("pwa-install-error")?.remove(),
    );
    await expect(detail.locator("h1")).toHaveText(label);
    await expect(detail.locator(".eye-care-procedure-box")).toHaveCSS(
      "background-color",
      "rgb(8, 8, 8)",
    );
    await expect(detail.locator("h1")).toHaveCSS(
      "background-color",
      "rgb(0, 217, 0)",
    );
    if (route === "lidHygiene") {
      const folder = detail.locator(".lesson-row--folder");
      await expect(folder).toHaveAttribute("aria-expanded", "false");
      await folder.press("Enter");
      await expect(
        detail.locator(".eye-care-procedure-folder-content"),
      ).toBeVisible();
      await detail.locator(".see-all-toggle").click();
      await expect(folder).toBeFocused();
      await folder.click();
    }
    await expect(detail.locator(".lesson-row--video")).toHaveCount(keys.length);
    if (route === "eyePadShield") {
      await page.screenshot({
        path: testInfo.outputPath("eye-pad-shield.png"),
      });
    }
    for (let i = 0; i < keys.length; i++) {
      await detail.locator(`[data-pec-video="${keys[i]}"]`).click();
      const videoPage = page.locator(`#eyeCareVideo-${keys[i]}`);
      await expect(videoPage).toBeVisible();
      await expect(videoPage.locator("source")).toHaveAttribute(
        "src",
        `/videos/Workshop/PEC/${files[i]}_220p.mp4`,
      );
      if (exercisePlayback) {
        await videoPage.locator("video").evaluate(async (video) => {
          video.muted = true;
          await video.play();
        });
        await expect
          .poll(() => videoPage.locator("video").evaluate((v) => v.currentTime))
          .toBeGreaterThan(0);
        await videoPage.locator("video").evaluate((video) => video.pause());
      }
      await videoPage.locator('[data-mode="high"]').click();
      await expect(videoPage.locator("source")).toHaveAttribute(
        "src",
        `/videos/Workshop/PEC/${files[i]}_720p.mp4`,
      );
      const media = await page.request.get(
        `/videos/Workshop/PEC/${files[i]}_720p.mp4`,
        { headers: { Range: "bytes=0-100" } },
      );
      expect(media.ok()).toBe(true);
      await page.locator("#backBtnGlobal").click();
      await expect(detail).toBeVisible();
      if (route === "lidHygiene")
        await detail.locator(".lesson-row--folder").click();
    }
    const bounds = await detail
      .locator(".eye-care-procedure-box")
      .boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(
      page.viewportSize().width,
    );
    await page.locator("#backBtnGlobal").click();
    await expect(page.locator("#eyesCatalogPage")).toBeVisible();
  }
});

test("a procedure video deep link survives refresh and returns to its folder", async ({
  page,
}) => {
  await page.goto("/#/lidHygiene/eyeCareVideo-warm_compress");
  const video = page.locator("#eyeCareVideo-warm_compress");
  await expect(video).toBeVisible();
  await expect(video.locator("source")).toHaveAttribute(
    "src",
    /2\.Warmcompress_220p\.mp4$/,
  );
  await page.reload();
  await expect(video).toBeVisible();
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator("#lidHygiene")).toBeVisible();
  await page.locator("#lidHygiene .lesson-row--folder").click();
  await expect(
    page.locator("#lidHygiene .lesson-row--video").first(),
  ).toBeVisible();
});
