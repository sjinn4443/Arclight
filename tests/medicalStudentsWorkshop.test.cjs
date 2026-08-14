const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const repoRoot = path.resolve(__dirname, "..");

describe("Medical Students workshop", () => {
  const html = fs.readFileSync(
    path.join(repoRoot, "public/html/medicalStudentsWorkshop.html"),
    "utf8",
  );
  const document = new JSDOM(html).window.document;

  test("exposes the four requested folders in order", () => {
    const labels = Array.from(
      document.querySelectorAll("#medicalStudentsWorkshopFolders .lesson-type"),
      (element) => element.textContent.trim(),
    );

    expect(labels).toEqual([
      "1. Introduction",
      "2. Examine each Other",
      "3. Train on Sim Tools",
      "4. Test",
    ]);
  });

  test("uses the requested lesson-row types", () => {
    expect(
      document.querySelectorAll(
        '[data-section="introduction"] .lesson-row--scroll',
      ),
    ).toHaveLength(4);
    expect(
      document.querySelectorAll(
        '[data-section="examineEachOther"] .medical-nested-folder-row',
      ),
    ).toHaveLength(3);
    expect(
      document.querySelectorAll(
        '[data-section="trainOnSimTools"] .lesson-row--interactive',
      ),
    ).toHaveLength(5);
    expect(
      document.querySelectorAll('[data-section="test"] .lesson-row--quiz'),
    ).toHaveLength(6);
  });

  test("reuses the existing PDF, Pupil App, and diabetic case quiz targets", () => {
    const routes = Array.from(
      document.querySelectorAll(
        '[data-section="examineEachOther"] .lesson-row--pdf',
      ),
      (row) => row.dataset.route,
    );
    expect(routes).toEqual([
      "visualAcuityPdf",
      "pupilsPecPdf",
      "pupilsAdvancedPdf",
      "frontOfEyePdf",
      "fundalReflexPdf",
      "directOphthalmoscopyPdf",
    ]);

    expect(
      document.querySelector('[data-rapd-launch-mode="practice"]')?.dataset
        .target,
    ).toBe("glaucomaRAPDFullSwingInteractive");
    expect(
      document.querySelector('[data-rapd-launch-mode="test"]')?.dataset.target,
    ).toBe("glaucomaRAPDFullSwingInteractive");
    expect(
      document.querySelector('[data-target="diabeticCaseQuizPage"]')?.dataset
        .route,
    ).toBe("videos");
  });

  test("uses a blank black Eyes card and preserves the RAPD return origin", () => {
    const eyesSource = fs.readFileSync(
      path.join(repoRoot, "public/js/eyes.js"),
      "utf8",
    );
    const workshopSource = fs.readFileSync(
      path.join(repoRoot, "public/js/medicalStudentsWorkshop.js"),
      "utf8",
    );
    const navigationSource = fs.readFileSync(
      path.join(repoRoot, "public/js/navigation.js"),
      "utf8",
    );

    expect(eyesSource).toContain('"eyes-card--blank-black"');
    expect(eyesSource).not.toContain(
      '"Medical Students": "images/icon/eyes/workshop/',
    );
    expect(workshopSource).toContain(
      'target.dataset.medicalStudentsReturn = "true"',
    );
    expect(navigationSource).toContain('loadPage("medicalStudentsWorkshop", {');
  });
});
