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
});
