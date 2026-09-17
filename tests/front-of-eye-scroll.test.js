/** @jest-environment node */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, test, jest } from "@jest/globals";
import { FRONT_OF_EYE_EXAMINATION_SCROLL_CONFIG as cfg } from "../public/js/frontOfEyeExaminationScroll.js";

const root = "public/scrolly/coreexam/frontofeye";
const script = JSON.parse(
  fs.readFileSync(
    "public/narration/front-of-eye/full-animation/script.json",
    "utf8",
  ),
);

describe("Front of Eye scroll media contract", () => {
  test("includes every supplied animation in numeric folder order with all image assets", () => {
    function dataFiles(dir) {
      return fs
        .readdirSync(dir, { withFileTypes: true })
        .sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true }),
        )
        .flatMap((entry) =>
          entry.isDirectory()
            ? dataFiles(path.join(dir, entry.name))
            : entry.name === "data.json"
              ? [path.join(dir, entry.name).replaceAll("\\", "/")]
              : [],
        );
    }
    expect(cfg.paths.map((p) => `public${p}`)).toEqual(dataFiles(root));
    for (const [index, file] of cfg.paths.entries()) {
      const data = JSON.parse(fs.readFileSync(`public${file}`, "utf8"));
      expect(cfg.completionHoldFrameByFile[index]).toBe(
        Math.floor(data.op) - 1,
      );
      for (const asset of data.assets || []) {
        if (!asset.p || asset.e) continue;
        expect(
          fs.existsSync(
            path.join("public", path.dirname(file), asset.u || "", asset.p),
          ),
        ).toBe(true);
      }
    }
  });

  test("maps each spoken cue once within its audio interval and reuses all nine translations", async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => script,
    }));
    try {
      await cfg.loadText();
      expect(cfg.narrationClipsByFile.flatMap((clip) => clip.cueIds)).toEqual(
        script.cues.map((cue) => cue.id),
      );
      for (const [index, clip] of cfg.narrationClipsByFile.entries()) {
        const cues = clip.cueIds.map((id) =>
          script.cues.find((cue) => cue.id === id),
        );
        expect(clip.start).toBe(cues[0].start);
        expect(clip.end).toBe(cues.at(-1).end);
        for (const language of [
          "en",
          "ko",
          "es-419",
          "fr",
          "ne",
          "lg",
          "ha",
          "yo",
          "ig",
        ]) {
          expect(cfg.getSegmentStartTexts(index, language)).toEqual(
            cues.map((cue) => cue[language]),
          );
          expect(
            fs.existsSync(
              `public/narration/front-of-eye/full-animation/${language}.m4a`,
            ),
          ).toBe(true);
        }
      }
    } finally {
      global.fetch = originalFetch;
    }
  });
});
