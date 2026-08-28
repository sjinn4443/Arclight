import fs from "fs";
import path from "path";
import { describe, expect, it } from "@jest/globals";

const TRANSLATION_DIR = path.join(process.cwd(), "public", "translation");
const REQUIRED_PATHS = [
  "auto.childhoodeyescreeningworkshop",
  "auto.visualsystemeyesbrain",
  "auto.childhoodassessment",
  "auto.behavioursquiz",
  "auto.fundalreflexpdf",
  "auto.visualimpairment",
  "auto.signsvicases",
  "auto.childhoodrefer",
  "auto.childhoodeyebrainimages",
  "auto.glaucomaworkshop",
  "auto.glaucomaquizcasestudy",
  "auto.glaucomascrollimages",
  "auto.glaucomahistorycasestudy",
  "medicalStudentsWorkshop.content",
  "medicalStudentsWorkshop.quiz",
  "i18nExtra.interactive_notice_title",
  "i18nExtra.location_precise_disclosure",
];

function getByPath(object, dottedPath) {
  return dottedPath
    .split(".")
    .reduce((current, segment) => current?.[segment], object);
}

describe("translation completeness", () => {
  it("includes the newly added workshop translation sections in every locale", () => {
    const files = fs
      .readdirSync(TRANSLATION_DIR)
      .filter((fileName) => fileName.endsWith(".json"))
      .sort();
    const missing = [];

    for (const fileName of files) {
      const filePath = path.join(TRANSLATION_DIR, fileName);
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

      for (const dottedPath of REQUIRED_PATHS) {
        if (getByPath(data, dottedPath) === undefined) {
          missing.push(`${fileName}: ${dottedPath}`);
        }
      }

      if (data.i18nLiteral?.["Close ^"] === undefined) {
        missing.push(`${fileName}: i18nLiteral.Close ^`);
      }
    }

    expect(missing).toEqual([]);
  });

  it("registers Lao and keeps a timing-identical Lao VTT beside every English VTT", () => {
    const languageInstall = fs.readFileSync(
      path.join(process.cwd(), "public", "html", "languageinstall.html"),
      "utf8",
    );
    expect(languageInstall).toContain('value="lo"');
    expect(languageInstall).toContain('data-native="ລາວ"');

    const subtitleRoot = path.join(process.cwd(), "public", "video-subtitles");
    const englishVtts = [];
    const visit = (directory) => {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const absolute = path.join(directory, entry.name);
        if (entry.isDirectory()) visit(absolute);
        else if (entry.name === "en.vtt") englishVtts.push(absolute);
      }
    };
    visit(subtitleRoot);

    expect(englishVtts.length).toBeGreaterThan(0);
    for (const englishPath of englishVtts) {
      const laoPath = path.join(path.dirname(englishPath), "lo.vtt");
      expect(fs.existsSync(laoPath)).toBe(true);
      const timings = (filePath) =>
        fs
          .readFileSync(filePath, "utf8")
          .replace(/\r/g, "")
          .split("\n")
          .filter((line) => line.includes("-->"));
      expect(timings(laoPath)).toEqual(timings(englishPath));
    }

    for (const catalogName of [
      "app-video-subtitles.json",
      "childhood-eye-screening.json",
    ]) {
      const catalog = JSON.parse(
        fs.readFileSync(
          path.join(process.cwd(), "public", "video-localization", catalogName),
          "utf8",
        ),
      );
      for (const entry of Object.values(catalog)) {
        if (entry.subtitles?.en) expect(entry.subtitles.lo).toBeDefined();
      }
    }
  });
});
