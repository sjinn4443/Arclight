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
    ({
      FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_CLIPS,
      FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_TRACKS,
      initializeFundalStageNarration,
    } = await import("../public/js/childhoodFundalPreparation.js"));
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
    const controller = initializeFundalStageNarration(
      "fundalReflexExaminationScroll",
      {
        pageId: "fundalReflexExaminationScrollPage",
        narrationTracks: FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_TRACKS,
        narrationClipsByFile: FUNDAL_REFLEX_EXAMINATION_SCROLL_NARRATION_CLIPS,
      },
      page,
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

    controller.playForStage(4);
    await Promise.resolve();
    expect(audio.currentTime).toBeCloseTo(55.8, 3);
    expect(playSpy).toHaveBeenCalledTimes(1);

    select.value = "es-419";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    expect(audio.getAttribute("src")).toBe(
      "/narration/fundal-reflex/full-animation/es-419.m4a",
    );
    expect(
      localStorage.getItem(
        "videoNarrationLanguage:fundalReflexExaminationScrollPage",
      ),
    ).toBe("es-419");

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
});
