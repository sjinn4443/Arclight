/** @jest-environment node */

import fs from "node:fs";
import { expect, test } from "@jest/globals";

const catalogs = ["app-video-subtitles", "childhood-eye-screening"];
const languages = ["ny", "ur"];
const pupilsVoices = JSON.parse(
  fs.readFileSync(
    "public/narration/pupils-pec/full-animation/script.json",
    "utf8",
  ),
).languages;

test.each(catalogs)(
  "%s delivers Chichewa and Urdu captions and narration",
  (name) => {
    const catalog = JSON.parse(
      fs.readFileSync(`public/video-localization/${name}.json`, "utf8"),
    );
    const missing = [];
    const checked = new Map();

    for (const [id, entry] of Object.entries(catalog)) {
      for (const language of languages) {
        const subtitle = entry.subtitles[language];
        const narration = entry.audioVariants?.[language]?.src;
        if (!checked.has(subtitle)) {
          checked.set(
            subtitle,
            Boolean(
              subtitle &&
              fs.existsSync(`public${subtitle}`) &&
              fs.readFileSync(`public${subtitle}`, "utf8").includes("-->"),
            ),
          );
        }
        if (!checked.has(narration)) {
          checked.set(
            narration,
            Boolean(
              narration &&
              fs.existsSync(`public${narration}`) &&
              fs.statSync(`public${narration}`).size > 0,
            ),
          );
        }
        if (!checked.get(subtitle)) missing.push(`${id} ${language} subtitles`);
        if (!checked.get(narration))
          missing.push(`${id} ${language} narration`);
      }
    }

    expect(missing).toEqual([]);
  },
);

test.each(catalogs)(
  "%s uses the Pupils PEC voice for each synthetic dub",
  (name) => {
    const catalog = JSON.parse(
      fs.readFileSync(`public/video-localization/${name}.json`, "utf8"),
    );
    const mismatches = [];
    for (const [id, entry] of Object.entries(catalog)) {
      for (const [language, variant] of Object.entries(
        entry.audioVariants ?? {},
      )) {
        const scriptPath = variant.src.replace(/\/[^/]+\.m4a$/, "/script.json");
        const voice = variant.src.startsWith("/narration/")
          ? JSON.parse(fs.readFileSync(`public${scriptPath}`, "utf8"))
              .languages[language]?.voice
          : variant.voice;
        if (!voice || voice !== pupilsVoices[language]?.voice) {
          mismatches.push([id, language, voice]);
        }
      }
    }
    expect(mismatches).toEqual([]);
  },
);
