/** @jest-environment node */
import fs from "node:fs";
import { PUPILS_ADVANCED_STAGES } from "../public/js/pupilsAdvancedScroll.js";
const cues = PUPILS_ADVANCED_STAGES.flatMap((s) => s.cues);
const cue = (id) => cues.find((c) => c.id === id).en;

test("Advanced English uses British spelling and omits serial commas", () => {
  expect(cues).toHaveLength(35);
  for (const c of cues) {
    expect(c.en).not.toMatch(
      /\b(color|colors|colored|gray|center|inward|analyze)\b/i,
    );
    // No comma before the final conjunction in a three-item list.
    expect(c.en).not.toMatch(/\b\w+(?: \w+)?, \w+(?: \w+)?, (?:and|or) \w+/);
  }
  expect(cue("afferent-brain")).toContain("coloured");
  expect(cue("pupil-colour")).toContain("grey");
});

test("clinical distinctions survive the wording polish", () => {
  expect(cue("third-nerve")).toContain("most eye movements");
  expect(cue("third-nerve")).toContain("facial nerve controls blinking");
  expect(cue("dilator")).toContain("Müller's muscle");
  expect(cue("swing-rapd")).toContain("weaker light signal than the other");
  expect(cue("swing-method")).toContain("two to three seconds");
  expect(cue("near-normal")).toMatch(
    /convergence.*pupil constriction and lens accommodation/,
  );
  expect(cue("corresponding-examples")).toContain("does not identify");
});

test("both subtitle clocks contain the reviewed English wording", () => {
  const base = "public/narration/pupils-advanced/full-animation/";
  for (const suffix of ["", "video/"]) {
    const script = JSON.parse(fs.readFileSync(base + suffix + "script.json"));
    const vtt = fs.readFileSync(base + suffix + "en.vtt", "utf8");
    for (const c of cues) {
      expect(script.cues.find((s) => s.id === c.id).en).toBe(c.en);
      const caption = c.caption?.en ?? c.en;
      if (caption) expect(vtt).toContain(caption);
    }
  }
});
