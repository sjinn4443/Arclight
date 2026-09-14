/** @jest-environment node */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const spanish = read("public/translation/spanish.json");
const english = read("public/translation/english.json");
test("Nepali animation titles contain no English Fundal Reflex text", () => {
  const ne = read("public/translation/nepali.json");
  expect(ne.auto.videos.fundal_reflex_full_animation).toBe(
    "फन्डल रिफ्लेक्स पूर्ण एनिमेसन",
  );
  expect(ne.i18nLiteral["Fundal Reflex Full Animation"]).toBe(
    "फन्डल रिफ्लेक्स पूर्ण एनिमेसन",
  );
});
test.each(["hausa", "yoruba", "igbo"])(
  "%s animation title is localized consistently",
  (name) => {
    const locale = read(`public/translation/${name}.json`);
    const title = locale.auto.videos.fundal_reflex_full_animation;
    expect(title).toBe(locale.i18nLiteral["Fundal Reflex Full Animation"]);
    expect(title).not.toMatch(/Fundal|Full Animation/i);
  },
);
const walk = (p) =>
  fs
    .readdirSync(p, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(p, e.name)) : [path.join(p, e.name)],
    );

test.each(["nepali", "french", "luganda", "hausa", "yoruba", "igbo"])(
  "%s matches Spanish dictionary coverage and quiz array shapes",
  (name) => {
    const target = read(`public/translation/${name}.json`),
      failures = [];
    function compare(s, t, p = "") {
      if (Array.isArray(s) && (!Array.isArray(t) || s.length !== t.length))
        failures.push(p + " array");
      if (s && typeof s === "object") {
        for (const [k, v] of Object.entries(s)) compare(v, t?.[k], p + "." + k);
      } else if (
        typeof t !== typeof s ||
        (typeof s === "string" &&
          s.trim() &&
          (!t.trim() || /ZXQ|ZXLINE|\uFFFD/.test(t)))
      )
        failures.push(p);
    }
    compare(spanish, target);
    expect(failures).toEqual([]);
    const tokenFailures = [];
    const tokens = (s) =>
      (String(s).match(/\{\{[^}]+\}\}|\$\{[^}]+\}/g) || []).sort();
    function checkTokens(s, t, p = "") {
      for (const [k, v] of Object.entries(s)) {
        if (v && typeof v === "object") checkTokens(v, t?.[k], p + "." + k);
        else if (
          typeof v === "string" &&
          JSON.stringify(tokens(v)) !== JSON.stringify(tokens(t?.[k] || ""))
        )
          tokenFailures.push(p + "." + k);
      }
    }
    checkTokens(english, target);
    expect(tokenFailures).toEqual([]);
  },
);

test.each(["ne", "fr", "lg", "ha", "yo", "ig"])(
  "%s ships every Spanish subtitle with identical cue timing",
  (code) => {
    const failures = [];
    for (const p of walk("public/video-subtitles").filter(
      (p) => path.basename(p) === "es.vtt",
    )) {
      const target = path.join(path.dirname(p), code + ".vtt");
      if (!fs.existsSync(target)) {
        failures.push(target);
        continue;
      }
      const timing = (p) =>
        fs
          .readFileSync(p, "utf8")
          .split(/\r?\n/)
          .filter((l) => l.includes("-->"));
      if (JSON.stringify(timing(p)) !== JSON.stringify(timing(target)))
        failures.push(target + " timing");
    }
    expect(failures).toEqual([]);
  },
);

test.each(["ne", "fr", "lg", "ha", "yo", "ig"])(
  "%s narration is connected, intact and includes silent section titles",
  (code) => {
    const root = "public/narration/fundal-reflex/full-animation";
    const manifest = read(root + "/manifest.json");
    const script = read(root + "/script.json");
    const catalog = read(
      "public/video-localization/childhood-eye-screening.json",
    ).fundalReflexFullAnimationVideoPage;
    const audio = fs.readFileSync(root + "/" + code + ".m4a");
    expect(crypto.createHash("sha256").update(audio).digest("hex")).toBe(
      manifest.tracks[code].sha256,
    );
    expect(audio.length).toBe(manifest.tracks[code].bytes);
    expect(catalog.audioVariants[code].src).toBe(
      "/narration/fundal-reflex/full-animation/" + code + ".m4a",
    );
    expect(catalog.subtitles[code]).toBe(
      "/narration/fundal-reflex/full-animation/" + code + ".vtt",
    );
    expect(
      script.timedCues[code]
        .filter((c) => c.id.startsWith("section-"))
        .map((c) => [c.id, c.start, c.end]),
    ).toEqual(
      script.timedCues["es-419"]
        .filter((c) => c.id.startsWith("section-"))
        .map((c) => [c.id, c.start, c.end]),
    );
    expect(
      script.timedAudioCues[code].some((c) => c.id.startsWith("section-")),
    ).toBe(false);
  },
);
