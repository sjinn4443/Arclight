const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const root = path.resolve("public/narration/fundal-reflex/full-animation");
const script = JSON.parse(
  fs.readFileSync(path.join(root, "script.json"), "utf8"),
);
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "manifest.json"), "utf8"),
);
const reviewPath = path.resolve("clinical-review/fundal-es-ko.json");
const review = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
const digest = (data) => crypto.createHash("sha256").update(data).digest("hex");
const rules = {
  "es-419": {
    "preparation-01": [
      /Lávese las manos/i,
      /póngase el equipo de protección personal/i,
    ],
    "preparation-03b": [
      /No dirija la luz hacia su propio ojo/i,
      /ni sostenga el dispositivo de lado/i,
    ],
    "possible-findings-01": [
      /Si persisten después de los tres meses, derive al niño/i,
    ],
  },
  ko: {
    "preparation-01": [/손을 씻고/, /개인보호구를 착용/],
    "preparation-03b": [
      /빛을 자신의 눈에 비추거나/,
      /기기를 옆으로 들지 마세요/,
    ],
    "possible-findings-01": [/3개월 후에도 지속되면 의뢰/],
  },
};
for (const [language, cues] of Object.entries(rules)) {
  const vtt = fs.readFileSync(path.join(root, `${language}.vtt`), "utf8");
  for (const [id, patterns] of Object.entries(cues)) {
    const caption = script.timedCues[language].find((c) => c.id === id);
    const audio = script.timedAudioCues[language].find((c) => c.id === id);
    const outline = script.cues.find(
      (c) => c.id === (id === "preparation-03b" ? "preparation-03" : id),
    );
    for (const pattern of patterns) {
      for (const text of [
        caption?.text,
        audio?.ttsText || audio?.text,
        outline?.[language],
      ])
        assert.match(
          text || "",
          pattern,
          `${language}/${id}: safety meaning missing`,
        );
    }
    assert.ok(vtt.includes(caption.text), `${language}/${id}: stale VTT`);
  }
  const audioBytes = fs.readFileSync(path.join(root, `${language}.m4a`));
  assert.equal(
    digest(audioBytes),
    manifest.tracks[language].sha256,
    `${language}: stale audio manifest`,
  );
  const revision = digest(
    Buffer.concat([
      Buffer.from(
        JSON.stringify({
          captions: script.timedCues[language],
          speech: script.timedAudioCues[language],
          outline: script.cues.map((c) => c[language]),
        }),
      ),
      Buffer.from(vtt),
      audioBytes,
    ]),
  );
  console.log(
    `${language} safety assertions passed; review revision ${revision}`,
  );
  if (process.argv.includes("--require-approval")) {
    const approval = review.languages[language];
    assert.equal(
      approval?.revision,
      revision,
      `${language}: approval must match current script, VTT and audio`,
    );
    assert.equal(
      approval?.status,
      "approved",
      `${language}: bilingual clinical approval required`,
    );
    assert.ok(
      approval?.reviewer?.trim() &&
        approval?.qualifications?.trim() &&
        approval?.reviewedAt &&
        approval?.evidence,
      `${language}: reviewer identity and evidence required`,
    );
  }
}
