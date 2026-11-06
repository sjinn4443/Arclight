/** @jest-environment jsdom */
const fs = require("node:fs");
const path = require("node:path");

const read = (file) =>
  fs.readFileSync(path.join(__dirname, "..", file), "utf8");

describe("Diabetic condition lesson reuse", () => {
  test("all 22 targets exist in their owner fragments with unique accessible labels", async () => {
    const { ROUTES } = await import("../public/js/config.js");
    document.body.innerHTML = read("public/html/videos.html");
    const topic = document.getElementById("diabeticRetinopathyPage");
    const rows = topic.querySelectorAll(".lesson-row[data-target]");
    expect(rows).toHaveLength(22);
    const en = JSON.parse(read("public/translation/english.json"));
    const ko = JSON.parse(read("public/translation/korean.json"));
    for (const row of rows) {
      const route = row.dataset.route || "videos";
      const fragment = document.createElement("div");
      fragment.innerHTML = read(`public/${ROUTES[route]}`);
      expect(fragment.querySelector(`#${row.dataset.target}`)).not.toBeNull();
      const title = row.querySelector(".lesson-type");
      expect(document.querySelectorAll(`[id="${title.id}"]`)).toHaveLength(1);
      expect(
        row
          .querySelector('[role="progressbar"]')
          .getAttribute("aria-labelledby"),
      ).toBe(title.id);
      expect(en.diabeticCondition[row.dataset.target]).toBeTruthy();
      expect(ko.diabeticCondition[row.dataset.target]).toBeTruthy();
    }
    // Keep neighbouring condition cards and page boundaries intact.
    expect(
      document.querySelectorAll("#diseasesPage .module-card"),
    ).toHaveLength(7);
    expect(
      document
        .querySelector("#childhoodEyeScreeningPage")
        .closest("#diseasesPage"),
    ).toBeNull();
  });

  test("downloading the condition includes shared DO/BIO assets", async () => {
    const { matchesOfflineCatalog } =
      await import("../public/js/languageinstall.js");
    for (const url of [
      "/images/learning/Diabetic/Diabetes/1.Intro/diabetesnoeyecheck.webp",
      "/videos/Workshop/Diabetic/2.DODRMaculopathy.mp4",
      "/images/PDF/Workshop/DO/01.webp",
      "/images/PDF/Workshop/BIO/01.webp",
      "/scrolly/coreexam/ophths/BIO/02FundoscopySitting/3/images/img_2.png",
      "/scrolly/coreexam/ophths/DO/01Observation/1/data.json",
      "/narration/direct-ophthalmoscopy/full-animation/en.m4a",
      "/images/quiz/workshop/DR/Cases/9.png",
      "/images/learning/000.png",
    ])
      expect(matchesOfflineCatalog(url, "condition-diabetic")).toBe(true);
    expect(
      matchesOfflineCatalog("/subapp/Squint/index.html", "condition-diabetic"),
    ).toBe(false);
  });

  test("caller context expires when another route or lesson is opened", async () => {
    const context = await import("../public/js/diabeticConditionContext.js");
    sessionStorage.clear();
    document.body.innerHTML =
      '<div id="diabeticRetinopathyPage"><div class="lesson-row" data-route="diabeticRetinopathyWorkshop" data-target="diabeticWhatIsRetinopathyPage"></div></div>';
    context.rememberDiabeticConditionLesson(
      document.querySelector(".lesson-row"),
    );
    expect(
      context.isDiabeticConditionLesson(
        "diabeticWhatIsRetinopathyPage",
        "diabeticRetinopathyWorkshop",
      ),
    ).toBe(true);
    context.clearDiabeticConditionContextUnless(
      "diabeticRetinopathyWorkshop",
      "diabeticWhatIsRetinopathyPage",
    );
    expect(
      context.isDiabeticConditionLesson("diabeticWhatIsRetinopathyPage"),
    ).toBe(true);
    context.clearDiabeticConditionContextUnless(
      "diabeticRetinopathyWorkshop",
      null,
    );
    expect(
      context.isDiabeticConditionLesson("diabeticWhatIsRetinopathyPage"),
    ).toBe(false);
  });
});
