import { expect, test } from "@playwright/test";

async function expectCloseAtRight(heading) {
  const gap = await heading.evaluate((element) => {
    const titleRight = element.getBoundingClientRect().right;
    const closeRight = element
      .querySelector(".see-all-toggle")
      .getBoundingClientRect().right;
    return titleRight - closeRight;
  });
  expect(gap).toBeGreaterThanOrEqual(0);
  expect(gap).toBeLessThan(32);
}

async function expectPecBottomSpacing(workshop) {
  const gap = await workshop.evaluate((element) => {
    const cardBottom = element
      .querySelector(".pupil-level")
      .getBoundingClientRect().bottom;
    const visibleRows = [...element.querySelectorAll(".lesson-row")].filter(
      (row) => row.getBoundingClientRect().height > 0,
    );
    return cardBottom - visibleRows.at(-1).getBoundingClientRect().bottom;
  });
  expect(gap).toBeGreaterThanOrEqual(30);
  expect(gap).toBeLessThanOrEqual(40);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
  });
});

test("Eyes workshops start with PEC and BIO lessons belong to Intermediate", async ({
  page,
}) => {
  await page.goto("/#eyes", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#pecCarousel .eyes-card").first()).toHaveAttribute(
    "data-label",
    "PEC",
  );
  await page.goto("/#videos/directOphthalmoscopy", {
    waitUntil: "domcontentloaded",
  });
  const module = page.locator("#directOphthalmoscopy");
  await expect(module).toBeVisible();
  for (const [target, thumb] of [
    ["binocularIndirectOphthalmoscopyScrollPage", "intermediate_scrollytell"],
    [
      "binocularIndirectOphthalmoscopyFullAnimationVideoPage",
      "intermediate_video",
    ],
  ]) {
    await expect(
      module.locator(`.pupil-level--primary [data-target="${target}"]`),
    ).toHaveCount(0);
    const row = module.locator(
      `.pupil-level--intermediate [data-target="${target}"]`,
    );
    await expect(row).toBeVisible();
    await expect(row.locator(".thumb")).toHaveCSS(
      "background-image",
      new RegExp(thumb),
    );
  }
});

test("History Taking case studies load the renamed rectangular images", async ({
  page,
}) => {
  for (const [card, root, selector] of [
    [
      "caseStudyPrimaryCard",
      "caseStudyChatPagePrimary",
      ".casechat-imggrid img",
    ],
    ["caseStudyIntermediateCard", "caseStudyChatPage", ".casechat-img"],
  ]) {
    await page.goto("/#casestudy", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#casestudyPage")).toHaveAttribute(
      "data-primary-inited",
      "1",
    );
    await expect(page.locator("#casestudyPage")).toHaveAttribute(
      "data-intermediate-inited",
      "1",
    );
    await page.locator(`#${card} .lesson-row`).first().click();
    const chat = page.locator(`#${root}`);
    await expect(chat).toBeVisible();
    await chat.locator('.casechat-modal [data-action="ok"]').last().click();
    const image = chat.locator(selector).first();
    await expect(image).toHaveAttribute("src", /\/case\d+_eyes\.webp$/);
    await expect
      .poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0))
      .toBe(true);
    await expect(image).not.toHaveAttribute("srcset", /.+/);
    if (root === "caseStudyChatPagePrimary") {
      await expect(chat.locator(".casechat-bubble--bot")).not.toHaveCount(0);
      await chat.locator("[data-case-num]").first().click();
      if (!(await chat.locator(".casechat-nextcase").count())) {
        await chat.locator("[data-case-num]").nth(1).click();
      }
      await expect(chat.locator(".casechat-nextcase")).toBeVisible();
      const gap = await chat.evaluate((el) => {
        const bubbles = [...el.querySelectorAll(".casechat-bubble--bot")];
        return (
          el.querySelector(".casechat-nextcase").getBoundingClientRect().top -
          Math.max(
            ...bubbles.map((bubble) => bubble.getBoundingClientRect().bottom),
          )
        );
      });
      expect(gap).toBeGreaterThanOrEqual(12);
    }
  }
});

test("PEC folders use the workshop's dark layout and close at both levels", async ({
  page,
}) => {
  await page.goto("/#pecWorkshop", { waitUntil: "domcontentloaded" });

  const workshop = page.locator("#pecWorkshopPage");
  await expect(workshop.locator(".pupil-level")).toBeVisible();
  await expect(workshop.locator(".pec-folder-row .lesson-type")).toHaveText([
    "1. Introduction",
    "2. Eye Examination",
    "3. Primary Eye Care Procedures",
  ]);
  await expect(
    workshop.locator(".pec-nested-folder-row .lesson-type"),
  ).toHaveText([
    "Getting Started",
    "Eye Disease & Blindness: High v Low Resource Settings",
    "Anterior Segment & Pupils",
    "History Taking",
    "Visual Acuity",
    "Fundal Reflex",
    "Fundoscopy",
    "Lid Hygeine",
  ]);
  await expectPecBottomSpacing(workshop);
  const closedTopGap = await workshop.evaluate(
    (root) =>
      root.querySelector('[data-folder="introduction"]').getBoundingClientRect()
        .top -
      root.querySelector(".pupil-level__cap").getBoundingClientRect().bottom,
  );
  await expect(
    workshop.locator('[data-folder="introduction"] .lesson-cta'),
  ).toHaveCSS("color", "rgb(21, 225, 21)");
  await workshop.locator('[data-folder="introduction"]').click();

  const section = workshop.locator('[data-section="introduction"]');
  await expect(section).toBeVisible();
  const openTopGap = await workshop.evaluate(
    (root) =>
      root
        .querySelector('[data-section="introduction"] > h3 > span')
        .getBoundingClientRect().top -
      root.querySelector(".pupil-level__cap").getBoundingClientRect().bottom,
  );
  expect(Math.abs(openTopGap - closedTopGap)).toBeLessThan(2);
  await expectPecBottomSpacing(workshop);
  await expect(section).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(section.locator("[data-close-section]")).toBeVisible();
  await expect(section.locator("[data-close-section]")).toHaveCSS(
    "color",
    "rgb(21, 225, 21)",
  );
  const nestedFolderGap = await section.evaluate((element) => {
    const folders = [...element.querySelectorAll(".pec-nested-folder-row")];
    return (
      folders[1].getBoundingClientRect().top -
      folders[0].getBoundingClientRect().bottom
    );
  });
  expect(nestedFolderGap).toBeGreaterThanOrEqual(14);
  expect(nestedFolderGap).toBeLessThanOrEqual(20);
  await expectCloseAtRight(section.locator(":scope > h3"));
  await section.locator('[data-nested-folder="gettingStarted"]').click();

  const nested = section.locator('[data-nested-section="gettingStarted"]');
  await expect(nested).toBeVisible();
  await expect(nested.locator("[data-close-nested]")).toBeVisible();
  await expectCloseAtRight(nested.locator(":scope > h3"));
  const lessonGaps = await nested.evaluate((element) => {
    const rows = [...element.querySelectorAll(":scope > .lesson-row")];
    return rows
      .slice(1)
      .map(
        (row, index) =>
          row.getBoundingClientRect().top -
          rows[index].getBoundingClientRect().bottom,
      );
  });
  expect(lessonGaps).toHaveLength(2);
  for (const gap of lessonGaps) {
    expect(gap).toBeGreaterThanOrEqual(16);
    expect(gap).toBeLessThanOrEqual(22);
  }
  await nested.locator("[data-close-nested]").click();
  await expect(
    section.locator('[data-nested-folder="gettingStarted"]'),
  ).toBeVisible();
  await section.locator("[data-close-section]").click();
  await expect(workshop.locator('[data-folder="introduction"]')).toBeVisible();
});

test("Medical Students keeps its Close buttons after translation updates", async ({
  page,
}) => {
  await page.goto("/#medicalStudentsWorkshop", {
    waitUntil: "domcontentloaded",
  });

  const workshop = page.locator("#medicalStudentsWorkshopPage");
  await expect(workshop.locator(".pupil-level")).toBeVisible();
  await workshop.locator('[data-folder="introduction"]').click();

  const section = workshop.locator('[data-section="introduction"]');
  const closeSection = section.locator(":scope > h3 .see-all-toggle");
  await expect(closeSection).toBeVisible();
  await expectCloseAtRight(section.locator(":scope > h3"));
  await page.evaluate(() => window.I18N?.applyTranslations?.(document));
  await expect(closeSection).toBeVisible();

  await section.locator('[data-nested-folder="introductionOverview"]').click();
  const nested = section.locator(
    '[data-nested-section="introductionOverview"]',
  );
  const closeNested = nested.locator(":scope > h3 .see-all-toggle");
  await expect(closeNested).toBeVisible();
  await expectCloseAtRight(nested.locator(":scope > h3"));
  await page.evaluate(() => window.I18N?.applyTranslations?.(document));
  await expect(closeNested).toBeVisible();
  await closeNested.click();
  await expect(
    section.locator('[data-nested-folder="introductionOverview"]'),
  ).toBeVisible();
  await closeSection.click();
  await expect(workshop.locator('[data-folder="introduction"]')).toBeVisible();
});

test("PEC opens slide-based eye lessons and reuses Medical Students content in green", async ({
  page,
}) => {
  await page.goto("/#pecWorkshop", { waitUntil: "domcontentloaded" });
  const workshop = page.locator("#pecWorkshopPage");
  await expect(workshop).toBeVisible();
  await workshop.locator('[data-folder="introduction"]').click();
  await workshop.locator('[data-nested-folder="gettingStarted"]').click();
  await workshop.locator('[data-pec-lesson="objectives"]').click();
  const lesson = page.locator("#pecEyeLessonPage");
  await expect(lesson).toBeVisible();
  await expect(lesson.locator(".diabetic-screening-hero h2")).toHaveText(
    "Objectives",
  );
  await expect(lesson).toContainText("Primary eye care procedures");
  await expect(lesson).toContainText(
    "Understand how to Examine Eyes (and Ears)",
  );
  await expect(lesson.locator(".diabetic-screening-step").first()).toHaveCSS(
    "color",
    "rgb(255, 255, 255)",
  );
  await expect(lesson.locator(".pec-eye-lesson-back")).toHaveCount(0);
  await lesson.locator(".pec-flow-next").click();
  await expect(lesson.locator(".diabetic-screening-hero h2")).toHaveText("Aim");
  await lesson.locator(".pec-flow-prev").click();
  await expect(lesson.locator(".diabetic-screening-hero h2")).toHaveText(
    "Objectives",
  );
  await page.locator("#backBtnGlobal").click();
  await expect(
    workshop.locator('[data-nested-section="gettingStarted"]'),
  ).toBeVisible();

  await workshop.locator('[data-pec-lesson="aim"]').click();
  await expect(lesson).toContainText(
    "Knowledge + skills + equipment = impact.",
  );
  await page.locator("#backBtnGlobal").click();
  await expect(
    workshop.locator('[data-nested-section="gettingStarted"]'),
  ).toBeVisible();

  await workshop
    .locator('[data-medical-target="medicalArclightScrollPage"]')
    .click();
  const arclight = page.locator("#medicalArclightScrollPage");
  await expect(arclight).toBeVisible();
  await expect(arclight).toContainText("ophthalmoscope aperture");
  await expect(arclight).not.toContainText("otoscope end");
  await expect(
    arclight.locator('video source[src$="WhatisArclight.mp4"]'),
  ).toHaveCount(1);
  await expect(arclight.locator("article:has(video) h3")).toHaveCount(0);
  await expect(arclight.locator(".pec-flow-nav")).toBeVisible();
  await page.locator("#backBtnGlobal").click();
  await expect(
    workshop.locator('[data-nested-section="gettingStarted"]'),
  ).toBeVisible();

  await workshop.locator("[data-close-nested]").first().click();
  await workshop.locator('[data-nested-folder="eyeDiseaseBlindness"]').click();
  const disease = workshop.locator(
    '[data-nested-section="eyeDiseaseBlindness"]',
  );
  await expect(disease.locator(":scope > .lesson-row .lesson-type")).toHaveText(
    ["Patient Journey", "Barriers", "Diagnosis of Eye Disease", "Blindness"],
  );
  await disease.locator('[data-medical-target="medicalBlindnessPage"]').click();
  const blindness = page.locator("#medicalBlindnessPage");
  await expect(blindness).toBeVisible();
  await expect(
    blindness.locator(".medical-external-link-copy small"),
  ).toHaveText(["External link", "External link"]);
  await expect(blindness.locator(".pec-flow-nav")).toBeVisible();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(blindness).toBeVisible();
  await expect(blindness.locator(".pec-flow-nav")).toBeVisible();
  await expect(blindness.locator(".topbar-home-logo")).toBeVisible();
  await expect(blindness.locator(".medical-students-screening-page")).toHaveCSS(
    "--medical-orange",
    "#00d900",
  );
  await expect(
    blindness.locator(".diabetic-screening-eyebrow").first(),
  ).toHaveCSS("color", "rgb(8, 125, 8)");
  await page.locator("#backBtnGlobal").click();
  await expect(
    workshop.locator('[data-nested-section="eyeDiseaseBlindness"]'),
  ).toBeVisible();
});

test("PEC eye examination folders contain relevant lessons and front of eye cases", async ({
  page,
}) => {
  await page.goto("/#pecWorkshop", { waitUntil: "domcontentloaded" });
  const workshop = page.locator("#pecWorkshopPage");
  await expect(workshop).toBeVisible();
  await workshop.locator('[data-folder="eyeExamination"]').click();
  for (const folder of [
    "pupilsAnterior",
    "historyTaking",
    "visualAcuity",
    "fundalReflex",
    "fundoscopy",
  ]) {
    await workshop.locator(`[data-nested-folder="${folder}"]`).click();
    const nested = workshop.locator(`[data-nested-section="${folder}"]`);
    await expect(nested).toBeVisible();
    expect(
      await nested.locator(":scope > .lesson-row").count(),
    ).toBeGreaterThan(0);
    await nested.locator("[data-close-nested]").click();
  }
  await workshop.locator('[data-nested-folder="pupilsAnterior"]').click();
  await workshop
    .locator('[data-medical-target="medicalPupilsAnteriorPracticePage"]')
    .click();
  const practice = page.locator("#medicalPupilsAnteriorPracticePage");
  await expect(practice.locator(".pec-practice-closeup img")).toHaveCount(3);
  await expect(
    practice.locator(".medical-practice-poster figcaption").first(),
  ).toHaveCSS("background-color", "rgb(0, 217, 0)");
  await page.locator("#backBtnGlobal").click();
  await expect(
    workshop.locator('[data-nested-section="pupilsAnterior"]'),
  ).toBeVisible();
  await workshop
    .locator('[data-medical-target="medicalAnteriorSegmentPage"]')
    .click();
  await expect(page.locator("#medicalAnteriorSegmentPage")).toBeVisible();
});

test("PEC opens existing eye examination media and returns to the same folder", async ({
  page,
}) => {
  await page.goto("/#pecWorkshop", { waitUntil: "domcontentloaded" });
  const workshop = page.locator("#pecWorkshopPage");
  await expect(workshop).toBeVisible();
  await workshop.locator('[data-folder="eyeExamination"]').click();
  await workshop.locator('[data-nested-folder="pupilsAnterior"]').click();
  await workshop.locator('[data-pec-target="pupilsPecPdfPage"]').click();
  await expect(page.locator("#pupilsPecPdfPage")).toBeVisible();
  await expect(page.locator("#pupilsPecPdfPage .pec-flow-nav")).toBeVisible();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#pupilsPecPdfPage")).toBeVisible();
  await expect(page.locator("#pupilsPecPdfPage .pec-flow-nav")).toBeVisible();
  await page.locator("#backBtnGlobal").click();
  await expect(
    workshop.locator('[data-nested-section="pupilsAnterior"]'),
  ).toBeVisible();
  await workshop.locator('[data-pec-target="pupilFullExamPage"]').click();
  await expect(page.locator("#pupilFullExamPage")).toBeVisible();
  await expect(page.locator("#pupilFullExamPage .pec-flow-nav")).toBeVisible();
  await page.locator("#backBtnGlobal").click();
  await expect(
    workshop.locator('[data-nested-section="pupilsAnterior"]'),
  ).toBeVisible();
});

test("PEC procedure rows, video lessons and ear link are available", async ({
  page,
}) => {
  await page.goto("/#pecWorkshop", { waitUntil: "domcontentloaded" });
  const workshop = page.locator("#pecWorkshopPage");
  await expect(workshop.locator(".pec-ear-care-link")).toHaveAttribute(
    "href",
    "#/ears",
  );
  await expect(workshop.locator(".pec-ear-care-link__copy small")).toHaveText(
    "Direct to",
  );
  const widths = await workshop.evaluate((element) => [
    element.querySelector(".pupil-level").getBoundingClientRect().width,
    element.querySelector(".pec-ear-care-link").getBoundingClientRect().width,
  ]);
  expect(Math.abs(widths[0] - widths[1])).toBeLessThan(2);
  await workshop.locator('[data-folder="procedures"]').click();
  const procedures = workshop.locator('[data-section="procedures"]');
  await expect(
    procedures.locator('[data-nested-folder="lidHygiene"] .lesson-type'),
  ).toHaveText("Lid Hygeine");
  await expect(
    procedures.locator(".pec-procedure-rows .lesson-row--video .lesson-type"),
  ).toHaveText([
    "Irrigate an eye",
    "Remove eye lashes",
    "Remove a foreign body",
    "Instil drops and ointment",
    "Make an eye pad and eye shield",
    "Apply an eye pad and eye shield",
    "Visual Acuity",
    "Assess Near Vision & Dispense Glasses",
    "Guide someone with sight loss",
  ]);
  await procedures.locator('[data-nested-folder="lidHygiene"]').click();
  await expect(procedures.locator(".pec-procedure-rows")).toBeVisible();
  await expect(procedures.locator(".pec-procedure-rows")).toHaveCSS(
    "opacity",
    "0.72",
  );
  await expect(
    procedures.locator('[data-nested-section="lidHygiene"] .lesson-type'),
  ).toHaveText(["Clean an Eye", "Warm Compress"]);
  await procedures.locator('[data-pec-video="clean_eye"]').click();
  const procedureVideo = page.locator("#pecProcedureVideoPage");
  await expect(procedureVideo).toBeVisible();
  await expect(procedureVideo.locator(".tri-toggle")).toHaveCSS(
    "width",
    "128px",
  );
  const videoLayout = await procedureVideo.evaluate((root) => {
    const toggle = root.querySelector(".tri-toggle").getBoundingClientRect();
    const bar = root.querySelector(".eyes-topbar").getBoundingClientRect();
    const title = root.querySelector(".video-header").getBoundingClientRect();
    const video = root
      .querySelector(".video-container")
      .getBoundingClientRect();
    return {
      toggleInBar: toggle.top >= bar.top && toggle.bottom <= bar.bottom,
      videoBelowTitle: video.top >= title.bottom,
    };
  });
  expect(videoLayout.toggleInBar).toBe(true);
  expect(videoLayout.videoBelowTitle).toBe(true);
  await expect(procedureVideo.locator("video source")).toHaveAttribute(
    "src",
    /1\.Cleananeye_220p\.mp4$/,
  );
  await procedureVideo.locator('[data-mode="high"]').click();
  await expect(procedureVideo.locator("video source")).toHaveAttribute(
    "src",
    /1\.Cleananeye_720p\.mp4$/,
  );
  await page.locator("#backBtnGlobal").click();
  await expect(
    procedures.locator('[data-nested-section="lidHygiene"]'),
  ).toBeVisible();
  await procedures.locator("[data-close-nested]").click();
  await procedures.locator('[data-pec-video="assess_near_vision"]').click();
  await expect(procedureVideo.locator("video source")).toHaveAttribute(
    "src",
    /10\.AssessNearVisionNDispenseGlasses_220p\.mp4$/,
  );
  await page.locator("#backBtnGlobal").click();

  await procedures.locator("[data-close-section]").click();
  await workshop.locator('[data-folder="eyeExamination"]').click();
  await workshop.locator('[data-nested-folder="fundoscopy"]').click();
  await workshop.locator('[data-pec-lesson="realCases"]').click();
  await expect(page.locator("#pecEyeLessonPage video")).toHaveCount(2);
  await expect(
    page.locator("#pecEyeLessonPage video source").first(),
  ).toHaveAttribute("src", /Realcase1\.mp4$/);
});

test("PEC history case study and acuity animation open their destinations", async ({
  page,
}) => {
  await page.goto("/#pecWorkshop", { waitUntil: "domcontentloaded" });
  const workshop = page.locator("#pecWorkshopPage");
  await workshop.locator('[data-folder="eyeExamination"]').click();
  await workshop.locator('[data-nested-folder="historyTaking"]').click();
  await workshop
    .locator('[data-medical-target="medicalHistoryTakingPage"]')
    .click();
  const historyPage = page.locator("#medicalHistoryTakingPage");
  await expect(historyPage).toBeVisible();
  await expect
    .poll(() =>
      historyPage
        .locator(".diabetic-screening-checklist li")
        .first()
        .evaluate((li) => getComputedStyle(li, "::before").backgroundColor),
    )
    .toBe("rgb(0, 217, 0)");
  await page.locator("#backBtnGlobal").click();
  await expect(
    workshop
      .locator('[data-nested-section="historyTaking"] .lesson-type')
      .last(),
  ).toHaveText("Case Study");
  await expect(
    workshop.locator('[data-pec-case-study="primary"] .pec-case-study-level'),
  ).toHaveText("Primary");
  await expect(
    workshop.locator(
      '[data-pec-case-study="intermediate"] .pec-case-study-level',
    ),
  ).toHaveText("Intermediate");
  const caseRows = await workshop
    .locator("[data-pec-case-study]")
    .evaluateAll((rows) =>
      rows.map((row) => {
        const card = row.getBoundingClientRect();
        const level = row
          .querySelector(".pec-case-study-level")
          .getBoundingClientRect();
        const title = row.querySelector(".lesson-type").getBoundingClientRect();
        const thumb = row.querySelector(".thumb").getBoundingClientRect();
        return {
          inside:
            level.top >= card.top &&
            title.bottom <= card.bottom &&
            level.left >= thumb.right,
          twoLines: level.bottom <= title.top,
        };
      }),
    );
  expect(caseRows.every((row) => row.inside && row.twoLines)).toBe(true);
  await expect(
    workshop.locator('[data-pec-case-study="intermediate"] .thumb'),
  ).toHaveCSS("background-image", /intermediate_interactive/);
  await workshop.locator('[data-pec-case-study="primary"]').click();
  await expect(page.locator("#caseStudyChatPagePrimary")).toBeVisible();
  await page
    .locator('#caseStudyChatPagePrimary .casechat-modal [data-action="ok"]')
    .last()
    .click();
  const imageLeft = await page
    .locator("#caseStudyChatPagePrimary .casechat-imggrid")
    .evaluate((el) => el.getBoundingClientRect().left);
  await expect(
    page.locator("#caseStudyChatPagePrimary .casechat-bubble--bot"),
  ).not.toHaveCount(0);
  const imageLeftAfter = await page
    .locator("#caseStudyChatPagePrimary .casechat-imggrid")
    .evaluate((el) => el.getBoundingClientRect().left);
  expect(Math.abs(imageLeftAfter - imageLeft)).toBeLessThan(2);
  const primaryStartGap = await page
    .locator("#caseStudyChatPagePrimary")
    .evaluate(
      (root) =>
        root.querySelector("#casePrimaryChatLog").getBoundingClientRect().top -
        root.getBoundingClientRect().top -
        62,
    );
  expect(primaryStartGap).toBeLessThan(70);
  await page.locator('#caseStudyChatPagePrimary [data-case-num="1"]').click();
  const nextCaseGap = await page
    .locator("#caseStudyChatPagePrimary")
    .evaluate((el) => {
      const bubbles = [...el.querySelectorAll(".casechat-bubble--bot")];
      return (
        el.querySelector(".casechat-nextcase").getBoundingClientRect().top -
        Math.max(
          ...bubbles.map((bubble) => bubble.getBoundingClientRect().bottom),
        )
      );
    });
  expect(nextCaseGap).toBeGreaterThanOrEqual(12);
  await page.locator("#caseStudyChatPagePrimary .casechat-nextcase").click();
  await expect(
    page.locator("#caseStudyChatPagePrimary .casechat-caseindex"),
  ).toContainText("Case 2");
  await expect(
    page.locator('#caseStudyChatPagePrimary [data-case-num="2"] img'),
  ).toHaveAttribute("src", "/images/casestudy/case2_eyes.webp");
  await page.goto("/#pecWorkshop", { waitUntil: "domcontentloaded" });
  await workshop.locator('[data-pec-case-study="intermediate"]').click();
  await expect(page.locator("#caseStudyChatPage")).toBeVisible();
  await expect(page.locator("#caseStudyChatPage .pec-flow-nav")).toBeVisible();
  await expect(page.locator("#caseStudyChatPage #caseTimerBtn")).toBeHidden();
  await expect(page.locator("#caseStudyChatPage #caseDxTimerBtn")).toBeHidden();
  await expect(
    page.locator("#caseStudyChatPage .casechat-imgwrap .casechat-img"),
  ).toBeVisible();
  await expect(
    page.locator("#caseStudyChatPage .casechat-img"),
  ).toHaveAttribute("src", "/images/casestudy/case1_eyes.webp");
  await expect(page.locator("#caseStudyChatPage .casechat-imgwrap")).toHaveCSS(
    "border-radius",
    "23px",
  );
  await expect
    .poll(() =>
      page
        .locator("#caseStudyChatPage .casechat-img")
        .evaluate(
          (img) =>
            img.complete &&
            img.naturalWidth > 0 &&
            img.currentSrc.endsWith("/case1_eyes.webp"),
        ),
    )
    .toBe(true);
  await expect(
    page.locator("#caseStudyChatPage .casechat-imgcover"),
  ).toHaveCount(0);
  const chatLayout = await page
    .locator("#caseStudyChatPage")
    .evaluate((root) => {
      const log = root.querySelector("#caseChatLog");
      const composer = root.querySelector(".casechat-composer");
      const nav = root.querySelector(".pec-flow-nav");
      const image = root.querySelector(".casechat-imgwrap");
      const imageRect = image.getBoundingClientRect();
      const logRect = log.getBoundingClientRect();
      const submit = root.querySelector("#caseChatSubmitBtn");
      const choicesRect = root
        .querySelector("#caseChatChoices")
        .getBoundingClientRect();
      const composerRect = composer.getBoundingClientRect();
      return {
        excess: log.scrollWidth - log.clientWidth,
        imageCenterOffset: Math.abs(
          imageRect.left +
            imageRect.width / 2 -
            (logRect.left + logRect.width / 2),
        ),
        submitBottomGap: Math.abs(
          window.innerHeight - submit.getBoundingClientRect().bottom,
        ),
        submitBottomCorners: [
          getComputedStyle(submit).borderBottomLeftRadius,
          getComputedStyle(submit).borderBottomRightRadius,
        ],
        questionEdges: [
          Math.abs(choicesRect.left - composerRect.left),
          Math.abs(choicesRect.right - composerRect.right),
          Math.abs(choicesRect.bottom - composerRect.top),
        ],
        navBottomGap: window.innerHeight - nav.getBoundingClientRect().bottom,
        actionTopDifference: Math.abs(
          submit.getBoundingClientRect().top -
            nav.querySelector("button").getBoundingClientRect().top,
        ),
        mobile: window.innerWidth < 1024,
        navBelowDraft:
          nav.getBoundingClientRect().top >=
          composer.getBoundingClientRect().bottom - 2,
      };
    });
  expect(chatLayout.excess).toBeLessThanOrEqual(1);
  expect(chatLayout.navBelowDraft).toBe(true);
  expect(chatLayout.imageCenterOffset).toBeLessThan(2);
  expect(chatLayout.submitBottomGap).toBeLessThan(2);
  expect(chatLayout.submitBottomCorners).toEqual(["0px", "0px"]);
  expect(chatLayout.questionEdges.every((gap) => gap < 2)).toBe(true);
  if (chatLayout.mobile) {
    expect(chatLayout.navBottomGap).toBeGreaterThanOrEqual(10);
    expect(chatLayout.actionTopDifference).toBeLessThan(2);
  }
  await page
    .locator("#caseStudyChatPage #caseChatChoices button")
    .first()
    .click();
  await expect(
    page.locator("#caseStudyChatPage #caseChatChoices"),
  ).toBeHidden();
  await expect(
    page.locator("#caseStudyChatPage #caseChatChoices"),
  ).toBeVisible();
  await page.locator("#caseStudyChatPage #caseChatSubmitBtn").click();
  await page
    .locator("#caseStudyChatPage")
    .getByRole("radio", { name: "Cataract", exact: true })
    .click();
  await page
    .locator("#caseStudyChatPage .casechat-nextcase")
    .filter({ hasText: /^Next case$/ })
    .click();
  await expect(
    page.locator("#caseStudyChatPage .casechat-img"),
  ).toHaveAttribute("src", "/images/casestudy/case2_eyes.webp");
  await page.goto("/#pecWorkshop", { waitUntil: "domcontentloaded" });
  await expect(
    workshop.locator('[data-section="eyeExamination"]'),
  ).toBeVisible();
  const history = workshop.locator('[data-nested-section="historyTaking"]');
  if (await history.isVisible())
    await history.locator("[data-close-nested]").click();
  await workshop.locator('[data-nested-folder="visualAcuity"]').click();
  await workshop
    .locator('[data-pec-target="visualAcuityFullAnimationVideoPage"]')
    .click();
  await expect(
    page.locator("#visualAcuityFullAnimationVideoPage"),
  ).toBeVisible();
  await expect(
    page.locator("#visualAcuityFullAnimationVideoPage .pec-flow-nav"),
  ).toBeVisible();
});

test("PEC Previous and Next stay within a folder and mark it complete", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.goto("/#pecWorkshop", { waitUntil: "domcontentloaded" });
  const workshop = page.locator("#pecWorkshopPage");
  await workshop.locator('[data-folder="introduction"]').click();
  await workshop.locator('[data-nested-folder="gettingStarted"]').click();
  await workshop.locator('[data-pec-lesson="objectives"]').click();
  await page.locator("#pecEyeLessonPage .pec-flow-next").click();
  await expect(
    page.locator("#pecEyeLessonPage .diabetic-screening-hero h2"),
  ).toHaveText("Aim");
  await page.locator("#pecEyeLessonPage .pec-flow-next").click();
  await expect(page.locator("#medicalArclightScrollPage")).toBeVisible();
  await page.locator("#medicalArclightScrollPage .pec-flow-next").click();
  await expect(workshop).toBeVisible();
  await expect(
    workshop.locator('[data-nested-section="gettingStarted"]'),
  ).toBeVisible();
  await expect(
    workshop.locator(
      '[data-nested-section="gettingStarted"] > h3 .pec-folder-complete',
    ),
  ).toBeVisible();
  await workshop.locator("[data-close-nested]").first().click();
  await expect(
    workshop.locator(
      '[data-nested-folder="gettingStarted"] .pec-folder-complete',
    ),
  ).toBeVisible();
  await workshop.locator('[data-nested-folder="eyeDiseaseBlindness"]').click();
  await workshop
    .locator('[data-medical-target="medicalPatientJourneyPage"]')
    .click();
  await page.locator("#medicalPatientJourneyPage .pec-flow-prev").click();
  await expect(
    workshop.locator('[data-nested-section="eyeDiseaseBlindness"]'),
  ).toBeVisible();
});
