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
      "3. Training",
      "4. Test",
    ]);
  });

  test("uses the requested lesson-row types", () => {
    expect(
      document.querySelectorAll(
        '[data-section="introduction"] .lesson-row--scroll',
      ),
    ).toHaveLength(11);
    expect(
      document.querySelectorAll(
        '[data-section="examineEachOther"] .medical-nested-folder-row',
      ),
    ).toHaveLength(3);
    expect(
      document.querySelectorAll(
        '[data-section="trainOnSimTools"] .lesson-row--interactive',
      ),
    ).toHaveLength(6);
    expect(
      document.querySelectorAll(
        '[data-section="trainOnSimTools"] .medical-nested-folder-row',
      ),
    ).toHaveLength(2);
    expect(
      document.querySelectorAll('[data-section="test"] .lesson-row--quiz'),
    ).toHaveLength(1);
  });

  test("groups the Introduction lessons and keeps history taking as a scroll row", () => {
    const intro = document.querySelector('[data-section="introduction"]');
    const nestedFolderLabels = Array.from(
      intro.querySelectorAll(
        ":scope > .medical-nested-folder-row .lesson-type",
      ),
      (element) => element.textContent.replace(/\s+/g, " ").trim(),
    );

    expect(nestedFolderLabels).toEqual([
      "Introduction",
      "Eye Disease & Blindness: High v Low Resource Settings",
      "Anatomy & Physiology Vision",
      "Examination Tools",
    ]);
    expect(
      intro
        .querySelector(':scope > [data-target="medicalHistoryTakingPage"]')
        ?.classList.contains("lesson-row--scroll"),
    ).toBe(true);
  });

  test("adds every requested Introduction lesson in the requested order", () => {
    const labelsFor = (nestedSection) =>
      Array.from(
        document.querySelectorAll(
          `[data-nested-section="${nestedSection}"] > .lesson-row .lesson-type`,
        ),
        (element) => element.textContent.replace(/\s+/g, " ").trim(),
      );

    expect(labelsFor("introductionOverview")).toEqual([
      "Overview",
      "Objectives",
      "Timetable and Content",
    ]);
    expect(labelsFor("eyeDiseaseBlindness")).toEqual([
      "Patient Journey",
      "Barriers",
      "Diagnosis of Eye Disease",
      "Blindness",
    ]);
    expect(labelsFor("anatomyVision")).toEqual([
      "Visual System",
      "Visual Development",
      "Visual Development",
    ]);
    expect(labelsFor("examinationTools")).toEqual(["Arclight", "Arclight"]);

    expect(
      document.querySelector('[data-target="mumVisionPage"]')?.dataset.route,
    ).toBe("videos");
    expect(
      document.querySelector('[data-target="howToUseArclightVideoPage"]')
        ?.dataset.route,
    ).toBe("videos");
  });

  test("renders the new Introduction lessons in the diabetic scrolly format", () => {
    const pageIds = [
      "medicalOverviewPage",
      "medicalObjectivesPage",
      "medicalTimetableContentPage",
      "medicalPatientJourneyPage",
      "medicalBarriersPage",
      "medicalDiagnosisEyeDiseasePage",
      "medicalBlindnessPage",
      "medicalVisualSystemPage",
      "medicalVisualDevelopmentScrollPage",
      "medicalHistoryTakingPage",
      "medicalArclightScrollPage",
    ];

    pageIds.forEach((pageId) => {
      const page = document.getElementById(pageId);
      expect(page).not.toBeNull();
      expect(
        page.querySelector("[data-diabetic-scroll-lesson]"),
      ).not.toBeNull();
      expect(page.querySelector(".diabetic-screening-hero")).not.toBeNull();
      expect(
        page.querySelectorAll("[data-diabetic-scroll-step]").length,
      ).toBeGreaterThan(1);
    });
  });

  test("uses textual objectives, speaker notes, recreated charts and slide 39 card", () => {
    const objectives = document.getElementById("medicalObjectivesPage");
    const diagnosisText = document
      .getElementById("medicalDiagnosisEyeDiseasePage")
      .textContent.replace(/\s+/g, " ");
    const development = document.getElementById(
      "medicalVisualDevelopmentScrollPage",
    );

    expect(objectives.textContent).toContain("01");
    expect(objectives.textContent).toContain("History and examination");
    expect(objectives.querySelector("img")).toBeNull();
    expect(diagnosisText).toContain("cupped optic disc");
    expect(diagnosisText).toContain("Measuring eye pressure");
    expect(document.querySelector(".medical-blindness-chart")).not.toBeNull();
    expect(document.querySelector(".medical-growth-diagram")).not.toBeNull();
    expect(document.querySelector(".medical-inverse-care-chart")).toBeNull();
    expect(
      document.querySelector(".medical-powerpoint-full-image"),
    ).not.toBeNull();
    expect(
      development.querySelector(
        'img[src$="visual-development-reference-card.png"]',
      ),
    ).not.toBeNull();
  });

  test("wires Previous and Next navigation for scroll and reused video pages", () => {
    const workshopSource = fs.readFileSync(
      path.join(repoRoot, "public/js/medicalStudentsWorkshop.js"),
      "utf8",
    );
    const childhoodFlowSource = fs.readFileSync(
      path.join(repoRoot, "public/js/childhoodWorkshopNextFlow.js"),
      "utf8",
    );

    expect(workshopSource).toContain('previous.textContent = "< Previous"');
    expect(workshopSource).toContain('next.textContent = "Next >"');
    expect(workshopSource).toContain("mumVisionPage: {");
    expect(workshopSource).toContain("howToUseArclightVideoPage: {");
    expect(childhoodFlowSource).toContain("isMedicalStudentsFlowEnabled()");
    expect(workshopSource).toContain("video.currentTime = 13");
    expect(workshopSource).toContain("VIDEO_GATED_TARGETS");
    expect(workshopSource).toContain(
      'targetId === "medicalVisualSystemPage" ? 60 : 100',
    );
    expect(workshopSource).toContain("const PDF_TARGETS = new Set(");
    expect(workshopSource).toContain(
      "if (PDF_TARGETS.has(targetId)) return true;",
    );
  });

  test("uses orange ready navigation and the requested responsive chart layouts", () => {
    const styles = fs.readFileSync(
      path.join(repoRoot, "public/style/pages.css"),
      "utf8",
    );

    expect(styles).toContain("background: var(--medical-orange, #f25600)");
    expect(styles).toMatch(
      /#medicalBlindnessPage[\s\S]*\.diabetic-screening-panel:has\(\.medical-cause-pie\)[\s\S]*grid-template-rows: auto auto;/,
    );
    expect(styles).toContain("grid-row: 1 / span 2;");
    expect(styles).toContain("@keyframes medical-growth-service-line");
    expect(styles).toContain("@keyframes medical-growth-population-line");
    expect(styles).toContain("@keyframes medical-growth-blindness-line");
    expect(styles).toMatch(
      /#medicalHistoryTakingPage \.medical-socrates \{[\s\S]*?column-gap: 59px;/,
    );
    expect(styles).toMatch(
      /@media \(max-width: 47\.98em\)[\s\S]*?#medicalHistoryTakingPage \.medical-socrates \{[\s\S]*?grid-auto-flow: row;[\s\S]*?column-gap: 8px;/,
    );
  });

  test("applies the requested Introduction page refinements", () => {
    const overview = document.getElementById("medicalOverviewPage");
    const timetable = document.getElementById("medicalTimetableContentPage");
    const journey = document.getElementById("medicalPatientJourneyPage");
    const barriers = document.getElementById("medicalBarriersPage");
    const blindness = document.getElementById("medicalBlindnessPage");
    const visualSystem = document.getElementById("medicalVisualSystemPage");
    const visualDevelopment = document.getElementById(
      "medicalVisualDevelopmentScrollPage",
    );
    const arclight = document.getElementById("medicalArclightScrollPage");

    expect(overview.querySelectorAll(".diabetic-screening-panel")).toHaveLength(
      2,
    );
    expect(
      Array.from(
        overview.querySelectorAll(".diabetic-screening-step"),
        (step) => step.textContent.trim(),
      ),
    ).toEqual(["01", "02"]);
    expect(overview.textContent).not.toContain("Follow the patient");
    expect(overview.textContent).toContain("The day combines");
    expect(
      overview.querySelectorAll(".medical-workshop-arc__stage"),
    ).toHaveLength(4);
    expect(timetable.textContent).not.toContain("A structured day");
    expect(timetable.textContent).toContain("Morning session");
    expect(timetable.textContent).toContain("Afternoon session");
    expect(journey.querySelectorAll(".medical-flow--journey")).toHaveLength(3);
    journey.querySelectorAll(".medical-flow--journey").forEach((flow) => {
      expect(flow.querySelectorAll("span")).toHaveLength(6);
    });
    expect(journey.querySelector(".medical-treatment-target")).toBeNull();
    expect(barriers.querySelector(".medical-barrier-grid")).toBeNull();
    expect(barriers.querySelector(".medical-barrier-pair")).toBeNull();
    expect(blindness.querySelectorAll(".medical-cause-pie")).toHaveLength(7);
    blindness.querySelectorAll(".medical-cause-pie").forEach((pie) => {
      expect(pie.textContent.trim()).toBe("");
    });
    expect(
      blindness.querySelectorAll(".medical-growth-diagram__line"),
    ).toHaveLength(3);
    expect(
      visualSystem.querySelector('source[src$="Media1.mp4"]'),
    ).not.toBeNull();
    expect(visualSystem.querySelectorAll("figcaption")).toHaveLength(0);
    expect(
      visualDevelopment
        .querySelector(".medical-visual-reference-panel")
        ?.textContent.trim(),
    ).toBe("");
    expect(
      arclight.querySelector(".diabetic-screening-hero h2")?.textContent,
    ).toBe("Arclight");
  });

  test("keeps every linked Medical Students lesson in its own Previous and Next flow", () => {
    const workshopSource = fs.readFileSync(
      path.join(repoRoot, "public/js/medicalStudentsWorkshop.js"),
      "utf8",
    );
    const mainSource = fs.readFileSync(
      path.join(repoRoot, "public/js/main.js"),
      "utf8",
    );
    const linkedTargets = [
      "visualAcuityPdfPage",
      "pupilsPecPdfPage",
      "pupilFullExamPage",
      "pupilsAdvancedPdfPage",
      "frontOfEyePdfPage",
      "feFullAnteriorSegmentPage",
      "fundalExamPage",
      "fundalReflexPdfPage",
      "directOphthalmoscopyVideoPage",
      "directOphthalmoscopyPdfPage",
      "fundalReflexSimulatorPage",
      "morphSimulatorPage",
      "swollenDiscsInteractivePage",
    ];

    linkedTargets.forEach((target) => {
      expect(workshopSource).toContain(`${target}: {`);
    });
    expect(workshopSource).toContain('else if (step.type === "rapd")');
    expect(workshopSource).toContain(
      'page.dataset.medicalStudentsReturn = "true"',
    );
    expect(workshopSource).toContain("...Object.values(MEDICAL_TARGET_ROUTES)");
    expect(workshopSource).toContain(
      "export function initializeMedicalStudentsWorkshopFlowInfra()",
    );
    expect(mainSource).toContain(
      "m.initializeMedicalStudentsWorkshopFlowInfra?.()",
    );

    const diabeticFlowSource = fs.readFileSync(
      path.join(repoRoot, "public/js/diabeticWorkshopNextFlow.js"),
      "utf8",
    );
    expect(diabeticFlowSource).toContain("isMedicalStudentsFlowEnabled()");
  });

  test("adds the requested Examine each Other practice and video rows in order", () => {
    const labelsFor = (nestedSection) =>
      Array.from(
        document.querySelectorAll(
          `[data-nested-section="${nestedSection}"] > .lesson-row .lesson-type`,
        ),
        (element) => element.textContent.trim(),
      );

    expect(labelsFor("visualAcuity")).toEqual([
      "Visual Acuity PDF",
      "Practice",
    ]);
    expect(labelsFor("pupilsAnterior")).toEqual([
      "Pupils PEC PDF",
      "Pupils Examination",
      "Pupils Advanced PDF",
      "Front of Eye PDF",
      "Front of Eye",
      "Practice",
    ]);
    expect(labelsFor("fundalDirect")).toEqual([
      "Fundal ‘Red’ Reflex for Babies & Infants",
      "Fundal Reflex PDF",
      "Direct Ophthalmoscopy",
      "Direct Ophthalmoscopy PDF",
      "Practice",
    ]);

    expect(
      document.querySelector('[data-target="pupilFullExamPage"]')?.dataset
        .route,
    ).toBe("videos");
    expect(
      document.querySelector('[data-target="feFullAnteriorSegmentPage"]')
        ?.dataset.route,
    ).toBe("videos");
    expect(
      document.querySelector('[data-target="fundalExamPage"]')?.dataset.route,
    ).toBe("videos");
    expect(
      document.querySelector('[data-target="directOphthalmoscopyVideoPage"]')
        ?.dataset.route,
    ).toBe("videos");
  });

  test("renders all three practice lessons in the diabetic scrolly format", () => {
    const pageIds = [
      "medicalVisualAcuityPracticePage",
      "medicalPupilsAnteriorPracticePage",
      "medicalFundalDirectPracticePage",
    ];

    pageIds.forEach((pageId) => {
      const page = document.getElementById(pageId);
      expect(page).not.toBeNull();
      expect(
        page.querySelector("[data-diabetic-scroll-lesson]"),
      ).not.toBeNull();
      expect(page.querySelector(".diabetic-screening-hero")).not.toBeNull();
      expect(
        page.querySelectorAll(
          ".diabetic-screening-panel[data-diabetic-scroll-step]",
        ).length,
      ).toBeGreaterThan(0);
      expect(page.querySelector(".medical-practice-poster img")).not.toBeNull();
    });

    const normalizedText = (pageId) =>
      document.getElementById(pageId).textContent.replace(/\s+/g, " ").trim();

    expect(normalizedText("medicalVisualAcuityPracticePage")).toContain(
      "distance / line seen",
    );
    expect(normalizedText("medicalPupilsAnteriorPracticePage")).toContain(
      "Pupils and Anterior Segment Exam Practice",
    );
    expect(normalizedText("medicalFundalDirectPracticePage")).toContain(
      "main optic nerve head findings, causes and management",
    );
    pageIds.forEach((pageId) => {
      const text = normalizedText(pageId);
      expect(text).not.toContain("Two students to demonstrate");
      expect(text).not.toMatch(/\bstudents? work in pairs\b/i);
    });
    expect(normalizedText("medicalPupilsAnteriorPracticePage")).toContain(
      "based on PDF/handout",
    );
    expect(normalizedText("medicalFundalDirectPracticePage")).toContain(
      "based on PDF/handout",
    );
    expect(
      document
        .querySelector(
          "#medicalFundalDirectPracticePage .medical-practice-poster img",
        )
        ?.getAttribute("src"),
    ).toBe("/images/pdf/Workshop/Childhood/FundalPDF.svg");

    const workshopSource = fs.readFileSync(
      path.join(repoRoot, "public/js/medicalStudentsWorkshop.js"),
      "utf8",
    );
    pageIds.forEach((pageId) =>
      expect(workshopSource).toContain(`"${pageId}"`),
    );
  });

  test("reuses the existing PDF and Pupil App targets", () => {
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
  });

  test("builds the requested Training folders and interactive routes", () => {
    const labelsFor = (nestedSection) =>
      Array.from(
        document.querySelectorAll(
          `[data-nested-section="${nestedSection}"] > .lesson-row .lesson-type`,
        ),
        (element) => element.textContent.trim(),
      );

    expect(labelsFor("pupilApp")).toEqual(["Practice", "Test"]);
    expect(labelsFor("discApp")).toEqual(["Back of the Eye", "Swollen Discs"]);

    const expectedTargets = {
      "Fundal Reflex App": "fundalReflexSimulatorPage",
      "Back of the Eye": "morphSimulatorPage",
      "Swollen Discs": "swollenDiscsInteractivePage",
    };
    Object.entries(expectedTargets).forEach(([label, target]) => {
      const row = Array.from(
        document.querySelectorAll(
          '[data-section="trainOnSimTools"] .lesson-row[data-target]',
        ),
      ).find(
        (candidate) =>
          candidate.querySelector(".lesson-type")?.textContent.trim() === label,
      );
      expect(row?.dataset.target).toBe(target);
      expect(row?.dataset.route).toBe("videos");
    });

    expect(
      document.querySelector(
        '[data-section="trainOnSimTools"] [data-target="medicalAnteriorSegmentPage"]',
      ),
    ).not.toBeNull();
    expect(
      document.querySelector(
        '[data-section="trainOnSimTools"] [data-target="diabeticCaseQuizPage"]',
      ),
    ).toBeNull();
    expect(html).not.toContain("Direct Ophthalmoscopy Macula SIM Eyes");
  });

  test("shows the supplied Anterior Segment image in a PDF-style page", () => {
    const anteriorPage = document.getElementById("medicalAnteriorSegmentPage");
    const image = anteriorPage?.querySelector(
      ".core-examination-pdf-viewer img",
    );

    expect(anteriorPage?.classList.contains("core-examination-pdf-page")).toBe(
      true,
    );
    expect(image?.getAttribute("src")).toBe(
      "/images/learning/MedicalStudents/Training/anterior-segment-reference.png",
    );

    const workshopSource = fs.readFileSync(
      path.join(repoRoot, "public/js/medicalStudentsWorkshop.js"),
      "utf8",
    );
    [
      "medicalAnteriorSegmentPage",
      "fundalReflexSimulatorPage",
      "morphSimulatorPage",
      "swollenDiscsInteractivePage",
    ].forEach((target) =>
      expect(workshopSource).toContain(`${target}: FOCUS.`),
    );
    expect(workshopSource).toContain(
      'const INTERACTIVE_LEARNING_RETURN_KEY = "interactiveLearning:returnTarget"',
    );
    expect(workshopSource).toContain('"fundalReflexSimulatorPage"');
    expect(workshopSource).toContain('"morphSimulatorPage"');
    expect(workshopSource).toContain('"swollenDiscsInteractivePage"');
  });

  test("keeps nested folders visually subordinate and dims sibling rows", () => {
    const workshopSource = fs.readFileSync(
      path.join(repoRoot, "public/js/medicalStudentsWorkshop.js"),
      "utf8",
    );
    const styles = fs.readFileSync(
      path.join(repoRoot, "public/style/pages.css"),
      "utf8",
    );

    expect(workshopSource).toContain(
      'section.classList.add("medical-nested-folder-open")',
    );
    expect(styles).toContain(
      ".medical-section-card.medical-nested-folder-open",
    );
    expect(styles).toContain(
      "#medicalStudentsWorkshopPage .medical-nested-section-card > h3",
    );
    expect(styles).toContain("width: 72%");
  });

  test("uses Medical Students RAPD navigation and restores the global back button", () => {
    const workshopSource = fs.readFileSync(
      path.join(repoRoot, "public/js/medicalStudentsWorkshop.js"),
      "utf8",
    );
    const glaucomaFlowSource = fs.readFileSync(
      path.join(repoRoot, "public/js/glaucomaWorkshopNextFlow.js"),
      "utf8",
    );
    const navigationSource = fs.readFileSync(
      path.join(repoRoot, "public/js/navigation.js"),
      "utf8",
    );

    expect(workshopSource).toContain("renderMedicalRapdNavigation");
    expect(workshopSource).toContain("FOCUS.pupilApp");
    expect(workshopSource).toContain(
      'void navigateToTarget("medicalAnteriorSegmentPage")',
    );
    expect(glaucomaFlowSource).toContain(
      'pageEl.dataset.medicalStudentsReturn === "true"',
    );
    expect(navigationSource).toContain(
      'removeAttribute("data-interactive-subapp-open")',
    );
  });

  test("keeps only the Pupils row in Test", () => {
    const testLabels = Array.from(
      document.querySelectorAll('[data-section="test"] .lesson-type'),
      (element) => element.textContent.trim(),
    );
    expect(testLabels).toEqual(["Pupils"]);
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
