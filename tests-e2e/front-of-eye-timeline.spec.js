import { test, expect } from "@playwright/test";
import sharp from "sharp";

test("Front of Eye has repeatable frames, captions and narration after seeking and reload", async ({
  page,
  browserName,
}) => {
  await page.route("**/__front-eye-timeline", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<html><head><base href="/"></head><body><main id="fixture"></main></body></html>',
    }),
  );
  if (browserName === "webkit") {
    await page.goto("/__front-eye-timeline");
    const originalUnsupported = await page.evaluate(async () => {
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      document.body.append(video);
      return new Promise((resolve) => {
        video.addEventListener("loadeddata", () => resolve(false), {
          once: true,
        });
        video.addEventListener(
          "error",
          () => resolve(video.error?.code === 4),
          { once: true },
        );
        video.src = "/videos/FullAnim/New_FrontofEyeFullAnim.mp4";
        video.load();
      });
    });
    test.skip(
      originalUnsupported,
      "This WebKit host cannot decode even the unchanged original MP4.",
    );
  }
  async function setup() {
    await page.goto("/__front-eye-timeline");
    await page.evaluate(async () => {
      const html = await (await fetch("/html/videos.html")).text();
      const parsed = new DOMParser().parseFromString(html, "text/html");
      document
        .getElementById("fixture")
        .append(parsed.getElementById("frontOfEyeFullAnimationVideoPage"));
      const videos = await import("/js/videos.js");
      videos.showVideosPageById("frontOfEyeFullAnimationVideoPage");
      await videos.ensureChildhoodPilotSubtitleControlsForPage(
        "frontOfEyeFullAnimationVideoPage",
      );
    });
    await expect
      .poll(() =>
        page
          .locator("#frontOfEyeFullAnimationVideo")
          .evaluate((v) => v.readyState),
      )
      .toBeGreaterThanOrEqual(2);
  }
  async function sample(time) {
    return page.evaluate(async (time) => {
      const video = document.getElementById("frontOfEyeFullAnimationVideo");
      const page = document.getElementById("frontOfEyeFullAnimationVideoPage");
      const audio = page.querySelector("audio");
      video.pause();
      if (Math.abs(video.currentTime - time) > 0.001) {
        await new Promise((resolve) => {
          video.addEventListener("seeked", resolve, { once: true });
          video.currentTime = time;
        });
      }
      video.dispatchEvent(new Event("timeupdate"));
      const canvas = document.createElement("canvas");
      canvas.width = 180;
      canvas.height = 200;
      canvas.getContext("2d").drawImage(video, 0, 0, 180, 200);
      return {
        frame: canvas.toDataURL(),
        text: page.querySelector("[data-childhood-pilot-subtitle-panel]")
          .textContent,
        audioTime: audio.currentTime,
        source: video.currentSrc,
        lead: video.dataset.timedNarrationLeadActive,
      };
    }, time);
  }
  await setup();
  const baseline = await sample(27.5);
  expect(baseline.source).toContain("New_FrontofEyeFullAnim_timed.mp4");
  expect(baseline.text).toContain("Ask the patient to look right, then left.");
  expect(baseline.audioTime).toBeCloseTo(27.5, 1);
  expect(baseline.lead).toBeUndefined();
  const examiner = await sample(23);
  expect(examiner.frame).not.toBe(baseline.frame);
  expect(examiner.text).toContain("Hold the device close");
  for (const time of [120, 57, 0, 145, 20]) {
    await sample(time);
    const again = await sample(27.5);
    expect(again).toEqual(baseline);
  }
  const still = await sample(24);
  // H.264 may encode identical held input frames with tiny pixel differences.
  const decode = (frame) =>
    sharp(Buffer.from(frame.split(",")[1], "base64"))
      .raw()
      .toBuffer();
  const [firstPixels, heldPixels] = await Promise.all([
    decode(examiner.frame),
    decode(still.frame),
  ]);
  const meanDifference =
    firstPixels.reduce(
      (total, value, i) => total + Math.abs(value - heldPixels[i]),
      0,
    ) / firstPixels.length;
  expect(meanDifference).toBeLessThan(1);
  expect((await sample(38)).text).toContain("look up and down");
  const groupStart = await sample(50.1);
  const groupEnd = await sample(54.9);
  expect(groupStart.text).toContain("The first group includes");
  expect(groupEnd.text).toBe(groupStart.text);
  const [groupFirstPixels, groupLastPixels] = await Promise.all([
    decode(groupStart.frame),
    decode(groupEnd.frame),
  ]);
  expect(
    groupFirstPixels.reduce(
      (sum, value, i) => sum + Math.abs(value - groupLastPixels[i]),
      0,
    ) / groupFirstPixels.length,
  ).toBeLessThan(1);
  expect((await sample(55)).text).toBe("");
  expect((await sample(87)).text).toContain("pictures of different conditions");
  const photosStart = await sample(87.1);
  const photosEnd = await sample(93.9);
  expect(photosEnd.text).toBe(photosStart.text);
  const [photoFirst, photoLast] = await Promise.all([
    decode(photosStart.frame),
    decode(photosEnd.frame),
  ]);
  expect(
    photoFirst.reduce(
      (sum, value, i) => sum + Math.abs(value - photoLast[i]),
      0,
    ) / photoFirst.length,
  ).toBeLessThan(1);
  expect((await sample(94)).text).toBe("");
  const temporalStart = await sample(109.1);
  const temporalEnd = await sample(112.9);
  expect(temporalStart.text).toContain(
    "By shining the light from the temporal side",
  );
  expect(temporalEnd.text).toBe(temporalStart.text);
  const [temporalFirst, temporalLast] = await Promise.all([
    decode(temporalStart.frame),
    decode(temporalEnd.frame),
  ]);
  expect(
    temporalFirst.reduce(
      (sum, value, i) => sum + Math.abs(value - temporalLast[i]),
      0,
    ) / temporalFirst.length,
  ).toBeLessThan(1);
  expect((await sample(113)).text).toBe("");
  const shadowStart = await sample(117.1);
  const shadowEnd = await sample(120);
  expect(shadowStart.text).toContain("A nasal shadow");
  expect(shadowEnd.text).toBe(shadowStart.text);
  const [shadowFirst, shadowLast] = await Promise.all([
    decode(shadowStart.frame),
    decode(shadowEnd.frame),
  ]);
  expect(
    shadowFirst.reduce(
      (sum, value, i) => sum + Math.abs(value - shadowLast[i]),
      0,
    ) / shadowFirst.length,
  ).toBeLessThan(1);
  expect((await sample(120.1)).text).toBe("");
  expect((await sample(124)).text).toContain(
    "Use a fluorescein strip or a Minims dropper",
  );
  const epithelialStart = await sample(136.1);
  const epithelialEnd = await sample(143.4);
  expect(epithelialStart.text).toContain("Areas of epithelial loss");
  expect(epithelialEnd.text).toBe(epithelialStart.text);
  const [epithelialFirst, epithelialLast] = await Promise.all([
    decode(epithelialStart.frame),
    decode(epithelialEnd.frame),
  ]);
  expect(
    epithelialFirst.reduce(
      (sum, value, i) => sum + Math.abs(value - epithelialLast[i]),
      0,
    ) / epithelialFirst.length,
  ).toBeLessThan(1);
  expect((await sample(143.5)).text).toBe("");
  expect((await sample(151)).text).toContain(
    "Gently pinch and hold the eyelashes",
  );
  expect((await sample(156.6)).text).toContain(
    "Gently pinch and hold the eyelashes",
  );
  expect((await sample(156.7)).text).toContain("Place a cotton bud");
  expect((await sample(34)).text).toBe("");
  await setup(); // Fresh document and player state, as with a reload.
  expect(await sample(27.5)).toEqual(baseline);
  await page.locator("#frontOfEyeFullAnimationVideo").evaluate(async (v) => {
    v.playbackRate = 1.5;
    await v.play();
  });
  await expect
    .poll(() =>
      page
        .locator("#frontOfEyeFullAnimationVideo")
        .evaluate((v) => v.currentTime),
    )
    .toBeGreaterThan(28);
  await page
    .locator("#frontOfEyeFullAnimationVideo")
    .evaluate((v) => v.pause());
  const paused = await page
    .locator("#frontOfEyeFullAnimationVideoPage")
    .evaluate((p) => ({
      video: p.querySelector("video").currentTime,
      audio: p.querySelector("audio").currentTime,
      paused: p.querySelector("audio").paused,
    }));
  expect(paused.paused).toBe(true);
  expect(Math.abs(paused.video - paused.audio)).toBeLessThan(0.4);
});
