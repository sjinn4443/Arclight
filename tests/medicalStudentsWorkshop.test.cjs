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

    const testFolder = document.querySelector(
      '#medicalStudentsWorkshopFolders [data-folder="test"]',
    );
    expect(testFolder?.hasAttribute("aria-disabled")).toBe(false);
    expect(testFolder?.getAttribute("tabindex")).toBe("0");
    expect(testFolder?.querySelector(".lesson-cta")?.textContent.trim()).toBe(
      "See all >",
    );
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
    ).toHaveLength(3);
  });

  test("adds the three clickable test lessons with quiz thumbnails", () => {
    const rows = Array.from(
      document.querySelectorAll('[data-section="test"] .lesson-row--quiz'),
    );

    expect(
      rows.map((row) => row.querySelector(".lesson-type")?.textContent.trim()),
    ).toEqual(["Visual Acuity", "Pupils", "Fundal Reflex"]);
    expect(rows.map((row) => row.dataset.target)).toEqual([
      "medicalVisualAcuityTestPage",
      "medicalPupilsTestPage",
      "medicalFundalReflexTestPage",
    ]);
    rows.forEach((row) => {
      expect(row.getAttribute("role")).toBe("button");
      expect(row.getAttribute("tabindex")).toBe("0");
      expect(row.querySelector(".thumb")).not.toBeNull();
    });
  });

  test("provides one text-only quiz page for each test lesson", () => {
    [
      "medicalVisualAcuityTestPage",
      "medicalPupilsTestPage",
      "medicalFundalReflexTestPage",
    ].forEach((pageId) => {
      const quizPage = document.getElementById(pageId);
      expect(quizPage).not.toBeNull();
      expect(quizPage?.classList.contains("medical-test-quiz-page")).toBe(true);
      expect(quizPage?.querySelector("img, video, picture, source")).toBeNull();
      expect(
        quizPage?.querySelector(".medical-test-quiz-mount"),
      ).not.toBeNull();
    });
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

  test("keeps Previous and Next active for scroll and reused video pages", () => {
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
    expect(workshopSource).toContain("function isMedicalNextReady() {");
    expect(workshopSource).toMatch(
      /function isMedicalNextReady\(\) \{\s*return true;\s*\}/,
    );
    expect(workshopSource).not.toContain("VIDEO_GATED_TARGETS");
    expect(workshopSource).not.toContain("readMedicalVideoProgress");
  });

  test("uses iPhone-compatible H.264 sources for How to Use Arclight", () => {
    const videosHtml = fs.readFileSync(
      path.join(repoRoot, "public/html/videos.html"),
      "utf8",
    );
    const videosSource = fs.readFileSync(
      path.join(repoRoot, "public/js/videos.js"),
      "utf8",
    );
    const lowSource =
      "videos/USAID Childhood eye screening/1. How to use the Arclight - ENGLISH - HD_220p.mp4";
    const lowVideo = fs.readFileSync(path.join(repoRoot, "public", lowSource));

    expect(videosHtml).toMatch(
      /id="howToUseArclightVideoPage"[\s\S]*?USAID Childhood eye screening\/1\. How to use the Arclight - ENGLISH - HD_220p\.mp4/,
    );
    const sourceConfig = videosSource.match(
      /howToUseArclightVideoPage:[\s\S]*?phoneAttachmentVideoPage:/,
    )?.[0];
    expect(sourceConfig?.split(lowSource)).toHaveLength(3);
    expect(lowVideo.includes(Buffer.from("avc1"))).toBe(true);
    expect(lowVideo.includes(Buffer.from("hev1"))).toBe(false);
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
    expect(styles).toContain(".medical-growth-diagram__series--services");
    expect(styles).toContain("left: 100%");
    expect(styles).toContain("--medical-growth-angle: -38deg");
    expect(styles).toContain("width: 84%");
    expect(styles).toMatch(
      /#medicalBlindnessPage \.medical-inverse-care-links \{[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/,
    );
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
    const diagnosis = document.getElementById("medicalDiagnosisEyeDiseasePage");
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
    expect(blindness.querySelectorAll("figcaption")).toHaveLength(1);
    expect(blindness.querySelector("figcaption")?.textContent.trim()).toBe(
      "Julian Tudor-Harts’s original model from Lancet in 1971",
    );
    expect(diagnosis.querySelectorAll("figcaption")).toHaveLength(0);
    blindness.querySelectorAll(".medical-cause-pie").forEach((pie) => {
      expect(pie.textContent.trim()).toBe("");
    });
    expect(
      blindness.querySelectorAll(".medical-growth-diagram__line"),
    ).toHaveLength(3);
    blindness
      .querySelectorAll(".medical-growth-diagram__series")
      .forEach((series) => {
        expect(
          series.querySelector(".medical-growth-diagram__line"),
        ).not.toBeNull();
        expect(
          series.querySelector(
            ".medical-growth-diagram__services, .medical-growth-diagram__population, .medical-growth-diagram__blindness",
          ),
        ).not.toBeNull();
      });

    const journeyPanels = journey.querySelectorAll(".diabetic-screening-panel");
    expect(
      Array.from(
        journeyPanels[1].querySelectorAll(".medical-flow span.is-active"),
        (step) => step.textContent.trim(),
      ),
    ).toEqual(["Accessing healthcare", "Diagnosis"]);
    expect(
      Array.from(
        journeyPanels[2].querySelectorAll(".medical-flow span.is-active"),
        (step) => step.textContent.trim(),
      ),
    ).toEqual(["Referral", "Treatment"]);

    const inverseLinks = Array.from(
      blindness.querySelectorAll(".medical-inverse-care-links a"),
    );
    expect(inverseLinks).toHaveLength(2);
    expect(inverseLinks[0].href).toBe(
      "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736%2821%2900505-5/fulltext",
    );
    expect(inverseLinks[1].href).toBe(
      "https://www.viewsoftheworld.net/?p=4616",
    );
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

    const distanceDemo = document.querySelector(
      "#medicalVisualAcuityPracticePage .medical-distance-demo",
    );
    expect(
      distanceDemo?.querySelector(".medical-distance-demo__image--3m")?.src,
    ).toContain("/images/learning/MedicalStudents/Training/3m.webp");
    expect(
      distanceDemo?.querySelector(".medical-distance-demo__image--6m")?.src,
    ).toContain("/images/learning/MedicalStudents/Training/6m.webp");
    expect(
      distanceDemo?.querySelector(".medical-distance-demo__badge--3m")
        ?.textContent,
    ).toBe("3m");
    expect(
      distanceDemo?.querySelector(".medical-distance-demo__badge--6m")
        ?.textContent,
    ).toBe("6m");

    const styles = fs.readFileSync(
      path.join(repoRoot, "public/style/pages.css"),
      "utf8",
    );
    expect(styles).toMatch(
      /\.is-current \.medical-distance-demo__image--6m[\s\S]*?medical-distance-demo-6m 16s linear infinite/,
    );
    expect(styles).toMatch(
      /\.medical-distance-demo__badge \{[\s\S]*?width: 48px;[\s\S]*?border-radius: 12px;[\s\S]*?background: #f25600;[\s\S]*?color: #ffffff;/,
    );
    expect(styles).toMatch(
      /@media \(max-width: 47\.98em\) \{[\s\S]*?\.medical-distance-demo__badge \{[\s\S]*?top: auto;[\s\S]*?bottom: 10px;[\s\S]*?width: 32px;[\s\S]*?font-size: 11px;/,
    );
    expect(styles).toContain("@keyframes medical-distance-demo-3m");
    expect(styles).toContain("@keyframes medical-distance-demo-6m");

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

  test("uses the Anterior Segment case-chat layout without timers or inputs", () => {
    const anteriorPage = document.getElementById("medicalAnteriorSegmentPage");
    expect(anteriorPage?.classList.contains("core-examination-pdf-page")).toBe(
      false,
    );
    expect(
      anteriorPage?.querySelector("#medicalAnteriorCaseChatLog.casechat-log"),
    ).not.toBeNull();
    expect(
      anteriorPage
        ?.querySelector("#medicalAnteriorAnswerBtn")
        ?.textContent.trim(),
    ).toBe("See all");
    expect(
      Array.from(
        anteriorPage?.querySelectorAll("[data-medical-answer-section]") || [],
        ({ textContent }) => textContent.trim(),
      ),
    ).toEqual(["Signs", "Diagnosis", "Action"]);
    expect(
      anteriorPage?.querySelector(
        ".caseTimer, #caseChatChoices, #caseChatDraft, .casechat-composer",
      ),
    ).toBeNull();

    const caseStudySource = fs.readFileSync(
      path.join(repoRoot, "public/js/medicalAnteriorSegmentCaseStudy.js"),
      "utf8",
    );
    expect(caseStudySource).toContain('prefix: "SIGNS: Look for "');
    expect(caseStudySource).toContain(
      'prefix: "DIAGNOSIS: Make a differential "',
    );
    expect(caseStudySource).toContain('prefix: "ACTION: Decide on an "');
    expect(caseStudySource).toContain(
      "`/images/casestudy/case${caseData.id}_eye.webp`",
    );
    expect(caseStudySource).not.toContain("Math.random");
    expect(caseStudySource).not.toContain("setInterval");
    expect(caseStudySource).not.toContain("setTimeout");

    const workshopSource = fs.readFileSync(
      path.join(repoRoot, "public/js/medicalStudentsWorkshop.js"),
      "utf8",
    );
    expect(workshopSource).toContain(
      "initializeMedicalAnteriorSegmentCaseStudy();",
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

  test("keeps the completed Test folder interactive", () => {
    const testLabels = Array.from(
      document.querySelectorAll('[data-section="test"] .lesson-type'),
      (element) => element.textContent.trim(),
    );
    expect(testLabels).toEqual(["Visual Acuity", "Pupils", "Fundal Reflex"]);

    const workshopSource = fs.readFileSync(
      path.join(repoRoot, "public/js/medicalStudentsWorkshop.js"),
      "utf8",
    );
    expect(workshopSource).toContain('"medicalVisualAcuityTestPage"');
    expect(workshopSource).toContain('"medicalPupilsTestPage"');
    expect(workshopSource).toContain('"medicalFundalReflexTestPage"');
    expect(workshopSource).toContain("home: FOCUS.test");
  });

  test("anchors the pickup bubble to the Arclight and shows it in Test mode", () => {
    const rapdHtml = fs.readFileSync(
      path.join(repoRoot, "public/html/glaucomascrollImages.html"),
      "utf8",
    );
    const glaucomaSource = fs.readFileSync(
      path.join(repoRoot, "public/js/glaucomaWorkshop.js"),
      "utf8",
    );
    const responsiveStyles = fs.readFileSync(
      path.join(repoRoot, "public/style/responsive.css"),
      "utf8",
    );

    expect(rapdHtml.match(/GlaucomaRAPD\/arclight\.webp/g)).toHaveLength(2);
    expect(rapdHtml).not.toContain("GlaucomaRAPD/flashlight.webp");
    expect(glaucomaSource).toContain('if (bubble) bubble.style.display = "";');
    expect(glaucomaSource).not.toContain(
      'bubble.style.display = isTestMode ? "none" : ""',
    );
    expect(responsiveStyles).toMatch(
      /#glaucomaRAPDFullSwingInteractive #rapdBubble \{[\s\S]*?left: calc\(95% \+ 19px\) !important;[\s\S]*?translate\(-100%, -50%\)[\s\S]*?z-index: 7 !important/,
    );
    expect(responsiveStyles).toContain(
      "width: clamp(44px, 4.5vw, 54px) !important;",
    );
    expect(responsiveStyles).toContain(
      "transform: translate(-50%, -50%) !important;",
    );
    expect(responsiveStyles).not.toContain("scale(1.6, 1.18)");
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
