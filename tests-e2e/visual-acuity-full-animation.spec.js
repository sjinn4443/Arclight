import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { Buffer } from "node:buffer";
import sharp from "sharp";

const script = JSON.parse(
  fs.readFileSync(
    "public/narration/visual-acuity/full-animation/script.json",
    "utf8",
  ),
);

test("Visual Acuity Full Animation opens below the scroll lesson and synchronises English media in both qualities", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
  await page.goto("/#/videos/visualAcuityPage");
  await page.waitForFunction(
    () => document.getElementById("videos")?.style.visibility === "visible",
  );
  const row = page.locator(
    '#visualAcuityPage [data-target="visualAcuityFullAnimationVideoPage"]',
  );
  await expect(row).toBeVisible();
  expect(
    await row.evaluate((el) => el.previousElementSibling.dataset.target),
  ).toBe("visualAcuityExaminationScrollPage");
  await expect(row.locator(".lesson-type")).toHaveText("Full Animation");
  await row.click();
  const player = page.locator("#visualAcuityFullAnimationVideoPage");
  const video = player.locator("video");
  const practice = script.cues.find((cue) => cue.id === "va-02");
  const lighting = script.cues.find((cue) => cue.id === "va-03");
  expect(practice.end).toBeCloseTo(18.6, 3);
  expect(lighting.start).toBeCloseTo(21.6, 3);
  expect(script.cues.find((cue) => cue.id === "va-13").en).toBe(
    "If vision improves with pinholes or glasses, it means they need glasses.",
  );
  expect(script.cues.find((cue) => cue.id === "va-16").en).toMatch(
    /^If fingers cannot be counted, move your hand/,
  );
  expect(script.cues.find((cue) => cue.id === "va-17").en).toMatch(
    /^If movement cannot be seen, test light perception/,
  );
  expect(script.cues.find((cue) => cue.id === "va-24").en).toBe(
    "If the vision improves, it means they need glasses",
  );
  await expect(player).toBeVisible();
  await expect
    .poll(() => video.evaluate((v) => v.readyState >= 2 || Boolean(v.error)))
    .toBe(true);
  test.skip(
    await video.evaluate((v) => v.error?.code === 4),
    "This browser host cannot decode the Full Animation MP4.",
  );
  await expect(player.locator('[data-mode="online"]')).toHaveCount(0);
  await expect(player.locator("audio")).toHaveAttribute(
    "src",
    /visual-acuity\/full-animation\/en.m4a/,
  );

  for (const [mode, resolution] of [
    ["low", "220p"],
    ["high", "720p"],
  ]) {
    await player.locator(`[data-mode="${mode}"]`).click();
    await expect
      .poll(() => video.evaluate((v) => v.currentSrc))
      .toContain(`VisualAcuityFullAnim_${resolution}.mp4`);
    await expect
      .poll(() => video.evaluate((v) => v.readyState))
      .toBeGreaterThanOrEqual(2);
    for (const cue of script.cues) {
      const time = cue.start + 0.1;
      const text = cue.en;
      await video.evaluate(async (v, time) => {
        v.pause();
        await new Promise((resolve) => {
          v.addEventListener("seeked", resolve, { once: true });
          v.currentTime = time;
        });
        v.dispatchEvent(new Event("timeupdate"));
      }, time);
      await expect(
        player.locator("[data-childhood-pilot-subtitle-panel]"),
      ).toContainText(text);
      await expect
        .poll(() => player.locator("audio").evaluate((a) => a.currentTime))
        .toBeCloseTo(time, 1);
    }

    // Verify that holds freeze the image while captions keep the same cue,
    // then that the next cue starts on its own mapped scene clock.
    let offset = 0;
    for (const hold of script.encodedHolds) {
      const start = hold.at + offset;
      offset += hold.seconds;
      if (hold.cueId === "va-02") {
        expect(start).toBeCloseTo(13, 3);
        expect(hold.atFrame).toBe(126);
        expect(hold.seconds).toBeCloseTo(5.6, 3);
      }
      if (hold.seconds < 0.5) continue;
      const frames = [];
      for (const time of [start + 0.15, start + hold.seconds - 0.15]) {
        frames.push(
          await video.evaluate(async (v, time) => {
            await new Promise((resolve) => {
              v.addEventListener("seeked", resolve, { once: true });
              v.currentTime = time;
            });
            v.dispatchEvent(new Event("timeupdate"));
            const canvas = document.createElement("canvas");
            canvas.width = 180;
            canvas.height = 200;
            canvas.getContext("2d").drawImage(v, 0, 0, 180, 200);
            return canvas.toDataURL();
          }, time),
        );
        await expect(
          player.locator("[data-childhood-pilot-subtitle-panel]"),
        ).toContainText(script.cues.find((c) => c.id === hold.cueId).en);
      }
      const [a, b] = await Promise.all(
        frames.map((frame) =>
          sharp(Buffer.from(frame.split(",")[1], "base64"))
            .raw()
            .toBuffer(),
        ),
      );
      const meanDifference =
        a.reduce((sum, value, i) => sum + Math.abs(value - b[i]), 0) / a.length;
      expect(meanDifference).toBeLessThan(1);
    }
  }
  // Play through a real hold: the picture stays fixed but audio and captions
  // advance on the same media clock. Pausing must stop both immediately.
  await video.evaluate((v) => {
    v.currentTime = 13.1;
  });
  await video.evaluate((v) => v.play());
  await expect
    .poll(() => player.locator("audio").evaluate((a) => a.paused))
    .toBe(false);
  await expect
    .poll(() => video.evaluate((v) => v.currentTime))
    .toBeGreaterThan(18.7);
  await expect(
    player.locator("[data-childhood-pilot-subtitle-panel]"),
  ).toBeEmpty();
  const drift = await player.evaluate((p) =>
    Math.abs(
      p.querySelector("video").currentTime -
        p.querySelector("audio").currentTime,
    ),
  );
  expect(drift).toBeLessThan(0.4);
  await video.evaluate((v) => v.pause());
  await expect
    .poll(() => player.locator("audio").evaluate((a) => a.paused))
    .toBe(true);
});
