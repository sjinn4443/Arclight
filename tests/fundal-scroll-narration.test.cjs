/**
 * @jest-environment jsdom
 */

import fs from "node:fs";
import path from "node:path";

import {
  afterEach,
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

const narrationRoot = path.resolve(
  "public/narration/fundal-reflex/full-animation",
);
const script = JSON.parse(
  fs.readFileSync(path.join(narrationRoot, "script.json"), "utf8"),
);

describe("Fundal Reflex examination scroll narration", () => {
  let FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_CLIPS;
  let FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_TRACKS;
  let initializeFundalStageNarration;
  let narrationModule;
  let loadSpy;
  let pauseSpy;
  let playSpy;
  let readyStateDescriptor;
  const originalFetch = global.fetch;

  beforeAll(async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({}),
    }));
    narrationModule =
      await import("../public/js/childhoodFundalPreparation.js");
    ({
      FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_CLIPS,
      FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_TRACKS,
      initializeFundalStageNarration,
    } = narrationModule);
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("prefLang", "ko");
    document.body.innerHTML = `
      <div id="fundalReflexExaminationScrollPage">
        <div data-fundal-scroll-narration-controls>
          <select data-fundal-scroll-narration-language></select>
          <button type="button" data-fundal-scroll-narration-toggle></button>
        </div>
      </div>
    `;

    readyStateDescriptor = Object.getOwnPropertyDescriptor(
      HTMLMediaElement.prototype,
      "readyState",
    );
    Object.defineProperty(HTMLMediaElement.prototype, "readyState", {
      configurable: true,
      get: () => 1,
    });
    loadSpy = jest
      .spyOn(HTMLMediaElement.prototype, "load")
      .mockImplementation(() => {});
    pauseSpy = jest
      .spyOn(HTMLMediaElement.prototype, "pause")
      .mockImplementation(() => {});
    playSpy = jest
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    loadSpy.mockRestore();
    pauseSpy.mockRestore();
    playSpy.mockRestore();
    if (readyStateDescriptor) {
      Object.defineProperty(
        HTMLMediaElement.prototype,
        "readyState",
        readyStateDescriptor,
      );
    }
    jest.clearAllTimers();
  });

  it("maps all 22 Lottie stages to the matching full-animation cue bounds", () => {
    const cues = new Map(script.timedCues.en.map((cue) => [cue.id, cue]));

    expect(FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_CLIPS).toHaveLength(22);
    FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_CLIPS.forEach((clip) => {
      const matched = clip.cueIds.map((cueId) => cues.get(cueId));
      expect(matched.every(Boolean)).toBe(true);
      expect(clip.start).toBeCloseTo(
        Math.min(...matched.map((cue) => cue.start)),
        3,
      );
      expect(clip.end).toBeCloseTo(
        Math.max(...matched.map((cue) => cue.end)),
        3,
      );
    });
  });

  it("plays the matching clip, changes language, and persists on/off", async () => {
    const page = document.getElementById("fundalReflexExaminationScrollPage");
    const refreshText = jest.fn();
    const controller = initializeFundalStageNarration(
      "fundalReflexExaminationScroll",
      {
        pageId: "fundalReflexExaminationScrollPage",
        narrationTracks: FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_TRACKS,
        narrationClipsByFile: FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_CLIPS,
      },
      page,
      refreshText,
    );
    const audio = page.querySelector("[data-fundal-scroll-narration-audio]");
    const select = page.querySelector(
      "[data-fundal-scroll-narration-language]",
    );
    const toggle = page.querySelector("[data-fundal-scroll-narration-toggle]");

    expect(audio.getAttribute("src")).toBe(
      "/narration/fundal-reflex/full-animation/ko.m4a",
    );
    expect(select.value).toBe("auto");
    expect(controller.getLanguage()).toBe("ko");

    controller.playForStage(4);
    await Promise.resolve();
    expect(audio.currentTime).toBeCloseTo(55.8, 3);
    expect(playSpy).toHaveBeenCalledTimes(1);

    select.value = "es-419";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    expect(refreshText).toHaveBeenCalledTimes(1);
    expect(controller.getLanguage()).toBe("es-419");
    expect(audio.getAttribute("src")).toBe(
      "/narration/fundal-reflex/full-animation/es-419.m4a",
    );
    expect(
      localStorage.getItem(
        "videoNarrationLanguage:fundalReflexExaminationScrollPage",
      ),
    ).toBe("es-419");

    localStorage.setItem("prefLang", "ne");
    controller.refreshLanguage();
    expect(audio.getAttribute("src")).toBe(
      "/narration/fundal-reflex/full-animation/ne.m4a",
    );
    expect(select.value).toBe("auto");

    toggle.click();
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    expect(
      localStorage.getItem("videoNarration:fundalReflexExaminationScrollPage"),
    ).toBe("off");
    expect(pauseSpy).toHaveBeenCalled();

    controller.destroy();
    expect(
      page.querySelector("[data-fundal-scroll-narration-audio]"),
    ).toBeNull();
  });

  it.each([
    [
      "DIRECT_OPHTHALMOSCOPY",
      "direct-ophthalmoscopy",
      "directOphthalmoscopyScroll",
    ],
    [
      "BINOCULAR_INDIRECT_OPHTHALMOSCOPY",
      "binocular-indirect-ophthalmoscopy",
      "binocularIndirectOphthalmoscopyScroll",
    ],
  ])(
    "maps and plays all 13 %s stages using existing localized tracks",
    (prefix, folder, route) => {
      const tracks = narrationModule[`${prefix}_SCROLL_NARRATION_TRACKS`];
      const clips = narrationModule[`${prefix}_SCROLL_NARRATION_CLIPS`];
      const script = JSON.parse(
        fs.readFileSync(
          path.resolve(`public/narration/${folder}/full-animation/script.json`),
          "utf8",
        ),
      );
      expect(clips).toHaveLength(13);
      for (const [language, track] of Object.entries(tracks)) {
        expect(fs.existsSync(path.resolve(`public${track.src}`))).toBe(true);
        const cues = new Map(script.cues.map((cue) => [cue.id, cue]));
        for (const clip of clips) {
          const matched = clip.cueIds.map((id) => cues.get(id));
          expect(matched.every(Boolean)).toBe(true);
          expect(clip.start).toBeCloseTo(
            Math.min(...matched.map((cue) => cue.start)),
            3,
          );
          expect(clip.end).toBeCloseTo(
            Math.max(...matched.map((cue) => cue.end)),
            3,
          );
        }
      }
      const page = document.getElementById("fundalReflexExaminationScrollPage");
      page.id = `${route}Page`;
      const controller = initializeFundalStageNarration(
        route,
        {
          pageId: page.id,
          narrationTracks: tracks,
          narrationClipsByFile: clips,
        },
        page,
      );
      expect(controller).not.toBeNull();
      const audio = page.querySelector("audio");
      expect(audio.getAttribute("src")).toBe(tracks.ko.src);
      for (let index = 0; index < clips.length; index++) {
        controller.playForStage(index);
        expect(audio.currentTime).toBeCloseTo(clips[index].start, 3);
        audio.currentTime = clips[index].end;
        audio.dispatchEvent(new Event("timeupdate"));
        expect(pauseSpy).toHaveBeenCalled();
      }
      controller.destroy();
      expect(page.querySelector("audio")).toBeNull();
    },
  );

  it.each(["ha", "yo", "ig"])(
    "uses %s app language for scrolly narration",
    (language) => {
      localStorage.setItem("prefLang", language);
      const page = document.getElementById("fundalReflexExaminationScrollPage");
      const controller = initializeFundalStageNarration(
        "fundalReflexExaminationScroll",
        {
          pageId: "fundalReflexExaminationScrollPage",
          narrationTracks: FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_TRACKS,
          narrationClipsByFile:
            FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_CLIPS,
        },
        page,
      );
      const audio = page.querySelector("[data-fundal-scroll-narration-audio]");
      expect(audio.getAttribute("src")).toBe(
        `/narration/fundal-reflex/full-animation/${language}.m4a`,
      );
      expect(
        page.querySelector("[data-fundal-scroll-narration-language]").value,
      ).toBe("auto");
      localStorage.setItem("prefLang", "ne");
      controller.refreshLanguage();
      expect(audio.getAttribute("src")).toBe(
        "/narration/fundal-reflex/full-animation/ne.m4a",
      );
      controller.destroy();
    },
  );

  it("holds synchronized completion during stalled audio and resumes muted playback at the same position", async () => {
    const page = document.getElementById("fundalReflexExaminationScrollPage");
    page.id = "frontOfEyeExaminationScrollPage";
    let now = 0;
    const clock = jest.spyOn(performance, "now").mockImplementation(() => now);
    const controller = initializeFundalStageNarration(
      "frontOfEyeExaminationScroll",
      {
        pageId: page.id,
        narrationTimeline: [
          [
            [3, 0],
            [6, 90],
            [12, 90],
          ],
        ],
        narrationTracks: FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_TRACKS,
        narrationClipsByFile: [{ start: 3, end: 12 }],
      },
      page,
    );
    const audio = page.querySelector("audio");
    const toggle = page.querySelector("button");
    controller.playForStage(0);
    await Promise.resolve();
    audio.currentTime = 6;
    expect(controller.getPosition()).toMatchObject({
      time: 6,
      finished: false,
    });
    now = 60_000;
    expect(controller.getPosition()).toMatchObject({
      time: 6,
      finished: false,
    });
    toggle.click();
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    now += 1000;
    expect(controller.getPosition()).toMatchObject({
      time: 7,
      finished: false,
    });
    toggle.click();
    expect(audio.currentTime).toBe(7);
    audio.currentTime = 11.99;
    audio.dispatchEvent(new Event("timeupdate"));
    expect(controller.getPosition().finished).toBe(false);
    audio.currentTime = 12;
    expect(controller.getPosition().finished).toBe(true);
    controller.playForStage(0);
    expect(controller.getPosition()).toMatchObject({
      time: 3,
      finished: false,
    });
    controller.destroy();
    clock.mockRestore();
  });

  it("the first synchronized sound-button click mutes even when autoplay was blocked", async () => {
    const page = document.getElementById("fundalReflexExaminationScrollPage");
    page.id = "frontOfEyeExaminationScrollPage";
    playSpy.mockRejectedValue(
      new DOMException("gesture required", "NotAllowedError"),
    );
    const controller = initializeFundalStageNarration(
      "frontOfEyeExaminationScroll",
      {
        pageId: page.id,
        narrationTimeline: [
          [
            [3, 0],
            [12, 90],
          ],
        ],
        narrationTracks: FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_TRACKS,
        narrationClipsByFile: [{ start: 3, end: 12 }],
      },
      page,
    );
    controller.playForStage(0);
    await Promise.resolve();
    await Promise.resolve();
    const toggle = page.querySelector("button");
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    expect(controller.getPosition().finished).toBe(false);
    toggle.click();
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    expect(playSpy).toHaveBeenCalledTimes(1);
    controller.destroy();
  });
});
