/** @jest-environment node */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  APPLY_EYE_PAD_SHIELD_SCROLL_CONFIG as cfg,
  APPLY_EYE_PAD_SHIELD_STAGES as stages,
  APPLY_EYE_PAD_SHIELD_TIMING as timing,
} from "../public/js/applyEyePadShieldScroll.js";
import { frameAtNarrationTime } from "../public/js/examinationScrollTiming.js";

test("all Lottie textures resolve and motion and narration end at the same frame", () => {
  for (const [i, url] of cfg.paths.entries()) {
    const file = path.join("public", url),
      data = JSON.parse(fs.readFileSync(file));
    expect([data.w, data.h]).toEqual([1169, 1280]);
    expect(data.op).toBe(stages[i].seconds * data.fr);
    expect(
      frameAtNarrationTime(timing.stages[i], cfg.narrationClipsByFile[i].end),
    ).toBe(cfg.completionHoldFrameByFile[i]);
    for (const a of data.assets) {
      expect(a.u.startsWith("/")).toBe(false);
      expect(
        fs.statSync(path.join(path.dirname(file), a.u, a.p)).size,
      ).toBeGreaterThan(0);
    }
    for (const l of data.layers)
      if (l.refId) expect(data.assets.some((a) => a.id === l.refId)).toBe(true);
  }
});

test("delivered bilingual audio hashes, scripts and VTT retain the eight teaching cues", () => {
  const dir = "public/narration/apply-eye-pad-shield/full-animation";
  const script = JSON.parse(fs.readFileSync(`${dir}/script.json`));
  const manifest = JSON.parse(fs.readFileSync(`${dir}/manifest.json`));
  expect(script.durationSeconds).toBe(cfg.narrationClipsByFile.at(-1).end);
  for (const lang of ["en", "ko"]) {
    const bytes = fs.readFileSync(`${dir}/${lang}.m4a`);
    expect(crypto.createHash("sha256").update(bytes).digest("hex")).toBe(
      manifest.tracks[lang].sha256,
    );
    const vtt = fs.readFileSync(`${dir}/${lang}.vtt`, "utf8");
    expect((vtt.match(/-->/g) || []).length).toBe(8);
    stages.forEach((stage, i) => {
      expect(vtt).toContain(stage[lang]);
      expect(script.cues[i][lang]).toBe(stage[lang]);
    });
  }
});
