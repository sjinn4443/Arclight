import { test, expect } from "@playwright/test";

async function checkVideo(video, request, browserName) {
  expect(
    (
      await request.head(await video.locator("source").getAttribute("src"))
    ).ok(),
  ).toBeTruthy();
  // Windows Playwright WebKit advertises H.264 but cannot decode MP4s.
  // Check delivery there; Chromium checks decoding and playback as well.
  if (browserName !== "webkit") {
    await expect
      .poll(() => video.evaluate((node) => node.readyState))
      .toBeGreaterThan(0);
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("prefLang", "en");
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("onboardingComplete", "true");
    localStorage.setItem("onboardingSeen", "1");
    localStorage.setItem("selectedInterest", "Eyes");
    localStorage.setItem("arclightOnboardingComplete", "1");
  });
});

test("PEC includes the third real case, source guide and interpretation worksheet", async ({
  page,
  request,
  browserName,
}, testInfo) => {
  await page.goto("/#pecWorkshop");
  const workshop = page.locator("#pecWorkshopPage");
  await expect(workshop).toHaveAttribute("data-inited", "1");
  await workshop.locator('[data-folder="eyeExamination"]').click();
  await workshop.locator('[data-nested-folder="fundalReflex"]').click();
  await workshop.locator('[data-pec-lesson="realCases"]').click();
  const lesson = page.locator("#pecEyeLessonPage");
  await expect(lesson.locator("video")).toHaveCount(3);
  await expect(lesson.locator("video source").last()).toHaveAttribute(
    "src",
    /Realcase3.mp4$/,
  );
  await lesson.locator("video").last().scrollIntoViewIfNeeded();
  await checkVideo(lesson.locator("video").last(), request, browserName);
  await page.locator("#backBtnGlobal").click();
  await workshop.locator('[data-pec-lesson="fundalSourceGuide"]').click();
  await expect(lesson.locator('img[src$="image57.png"]')).toBeVisible();
  await page.locator("#backBtnGlobal").click();
  await workshop.locator('[data-pec-lesson="fundalInterpretation"]').click();
  await expect(lesson.locator(".pec-response-form input")).toHaveCount(15);
  const first = lesson.locator(".pec-response-form input").first();
  await expect(lesson.locator("video")).toHaveCount(2);
  await expect(lesson.locator('img[src$="image65.png"]')).toHaveCount(0);
  await expect(lesson).not.toContainText(
    "Fundal red reflex image interpretation",
  );
  await expect(lesson.locator(".workshop-source-portrait")).toHaveCount(1);
  await lesson.locator(".workshop-source-portrait").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: testInfo.outputPath("portrait-interpretation.png"),
  });
  const portrait = await lesson
    .locator(".workshop-source-portrait img")
    .boundingBox();
  expect(portrait.height).toBeGreaterThan(portrait.width);
  const firstVideo = lesson.locator("video").first();
  const lastVideo = lesson.locator("video").last();
  await checkVideo(firstVideo, request, browserName);
  await checkVideo(lastVideo, request, browserName);
  if (browserName !== "webkit") {
    expect(await firstVideo.evaluate((v) => v.duration)).toBeCloseTo(119, 1);
    expect(await lastVideo.evaluate((v) => v.duration)).toBeCloseTo(125.372, 1);
  }
  expect(
    await lesson
      .locator(".diabetic-screening-stack")
      .evaluate(
        (node) => node.lastElementChild.querySelector("video") !== null,
      ),
  ).toBe(true);
  await first.fill("Dull reflex");
  await lesson.getByRole("button", { name: "Save", exact: true }).click();
  await expect(lesson.getByRole("status")).toHaveText("Saved");
  await page.evaluate(() => {
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith("pecWorkshop:worksheet:"))
      .forEach((k) => sessionStorage.removeItem(k));
  });
  await page.reload();
  await expect(lesson.locator(".pec-response-form input").first()).toHaveValue(
    "Dull reflex",
  );
  await page.locator("#backBtnGlobal").click();
  await expect(
    workshop.locator('[data-nested-section="fundalReflex"]'),
  ).toBeVisible();
});

test("new source video supports both qualities and returns to the same PEC folder", async ({
  page,
  request,
  browserName,
}) => {
  await page.goto("/#pecWorkshop");
  const workshop = page.locator("#pecWorkshopPage");
  await expect(workshop).toHaveAttribute("data-inited", "1");
  await workshop.locator('[data-folder="eyeExamination"]').click();
  await workshop.locator('[data-nested-folder="fundoscopy"]').click();
  await workshop.locator('[data-pec-video="cup_to_disc_video"]').click();
  const lesson = page.locator("#pecProcedureVideoPage");
  await expect(lesson).toBeVisible();
  await expect(lesson.locator("video source")).toHaveAttribute(
    "src",
    /CupToDiscAssessment_220p.mp4$/,
  );
  await checkVideo(lesson.locator("video"), request, browserName);
  await lesson.locator('[data-mode="high"]').click();
  await expect(lesson.locator("video source")).toHaveAttribute(
    "src",
    /CupToDiscAssessment_720p.mp4$/,
  );
  const src = await lesson.locator("video source").getAttribute("src");
  expect((await request.head(src)).ok()).toBeTruthy();
  await page.locator("#backBtnGlobal").click();
  await expect(
    workshop.locator('[data-nested-section="fundoscopy"]'),
  ).toBeVisible();
});

test("03 uses silent animation with guidance on the right in Medical Students and PEC", async ({
  page,
}, testInfo) => {
  const audioRequests = [];
  page.on("request", (request) => {
    if (/\.(m4a|mp3|wav)(\?|$)/.test(request.url()))
      audioRequests.push(request.url());
  });
  await page.goto(
    "/#medicalStudentsWorkshop/medicalPupilsAnteriorPracticePage",
  );
  const lesson = page.locator("#medicalPupilsAnteriorPracticePage");
  await expect(lesson).toBeVisible();
  const panel = lesson.locator(".medical-front-of-eye-panel");
  await expect(panel.locator("h3")).toHaveText(
    "Examine each structure in turn",
  );
  await expect(panel.locator(".medical-front-of-eye-stage")).toHaveCount(5);
  const stage = panel.locator(".medical-front-of-eye-stage").nth(3);
  await stage.locator(".medical-front-of-eye-animation").evaluate((node) => {
    const r = node.getBoundingClientRect();
    window.scrollBy({ top: r.top - (innerHeight - 100), behavior: "instant" });
  });
  await expect(
    stage.locator(".medical-front-of-eye-animation"),
  ).toHaveAttribute("data-playback", "paused");
  await stage.locator(".medical-front-of-eye-animation").evaluate((node) => {
    const r = node.getBoundingClientRect();
    window.scrollBy({
      top: r.top + r.height / 2 - innerHeight / 2,
      behavior: "instant",
    });
  });
  await expect(
    stage.locator(".medical-front-of-eye-animation[data-ready='1'] svg"),
  ).toBeVisible();
  await expect(stage.locator(".medical-front-of-eye-copy")).toContainText(
    "upper and lower eyelashes",
  );
  const bounds = await stage.evaluate((node) => {
    const visual = node
      .querySelector(".medical-front-of-eye-visual")
      .getBoundingClientRect();
    const copy = node
      .querySelector(".medical-front-of-eye-copy")
      .getBoundingClientRect();
    return {
      visualRight: visual.right,
      copyLeft: copy.left,
      copyTop: copy.top,
      visualBottom: visual.bottom,
      mobile: innerWidth <= 600,
      buttonCenter:
        node.querySelector("button").getBoundingClientRect().left +
        node.querySelector("button").getBoundingClientRect().width / 2,
      visualCenter: visual.left + visual.width / 2,
      overflow: node.scrollWidth > node.clientWidth + 1,
    };
  });
  if (bounds.mobile)
    expect(bounds.copyTop).toBeGreaterThanOrEqual(bounds.visualBottom);
  else expect(bounds.copyLeft).toBeGreaterThanOrEqual(bounds.visualRight);
  expect(bounds.buttonCenter).toBeCloseTo(bounds.visualCenter, 0);
  expect(bounds.overflow).toBe(false);
  await expect(
    panel.locator(".medical-front-of-eye-copy").last(),
  ).toContainText("These are pictures of different conditions");
  await expect(panel).not.toContainText("The anterior chamber is the space");
  await expect(
    stage.locator("button svg .medical-animation-pause-icon"),
  ).toBeVisible();
  await expect(stage.locator("button")).toHaveText("");
  await expect(stage.locator("button")).toHaveCSS("border-radius", "50%");
  const canvas = stage.locator(".medical-front-of-eye-animation");
  await canvas.evaluate((node) => {
    const animation = window.lottie
      .getRegisteredAnimations()
      .find((a) => a.wrapper === node);
    animation.goToAndPlay(animation.totalFrames - 2, true);
  });
  await expect(canvas).toHaveAttribute("data-playback", "holding");
  const finalFrame = await canvas.evaluate(
    (node) =>
      window.lottie.getRegisteredAnimations().find((a) => a.wrapper === node)
        .currentFrame,
  );
  await page.waitForTimeout(1000);
  await expect(canvas).toHaveAttribute("data-playback", "holding");
  expect(
    await canvas.evaluate(
      (node) =>
        window.lottie.getRegisteredAnimations().find((a) => a.wrapper === node)
          .currentFrame,
    ),
  ).toBe(finalFrame);
  await expect(canvas).toHaveAttribute("data-playback", "playing");
  await stage.locator("button").click();
  await expect(stage.locator("button")).toHaveAttribute("aria-pressed", "true");
  await expect(
    stage.locator("button svg .medical-animation-play-icon"),
  ).toBeVisible();
  await expect(
    stage.locator("button svg .medical-animation-pause-icon"),
  ).toBeHidden();
  await stage.locator("button").click();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(canvas).toHaveAttribute("data-playback", "paused");
  await canvas.evaluate((node) => {
    const r = node.getBoundingClientRect();
    window.scrollBy({
      top: r.top + r.height / 2 - innerHeight / 2,
      behavior: "instant",
    });
  });
  await expect(canvas).toHaveAttribute("data-playback", "playing");
  await expect(
    lesson.locator("audio, [data-fundal-scroll-narration-controls]"),
  ).toHaveCount(0);
  expect(audioRequests).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath("silent-front-of-eye.png"),
  });

  await page.goto("/#pecWorkshop");
  const workshop = page.locator("#pecWorkshopPage");
  await expect(workshop).toHaveAttribute("data-inited", "1");
  await workshop.locator('[data-folder="eyeExamination"]').click();
  await workshop.locator('[data-nested-folder="pupilsAnterior"]').click();
  await workshop
    .locator('[data-medical-target="medicalPupilsAnteriorPracticePage"]')
    .click();
  await expect(lesson.locator(".medical-front-of-eye-stage")).toHaveCount(5);
  await expect(lesson.locator(".pec-practice-closeup")).toHaveCount(0);
});

test("ear workshop folders, playback, reload, navigation and Direct to PEC work", async ({
  page,
  request,
  browserName,
}, testInfo) => {
  await page.goto("/#pecWorkshop");
  await page.locator(".pec-ear-care-link").click();
  const workshop = page.locator("#primaryEarCareWorkshopPage");
  await expect(workshop).toBeVisible();
  await expect(workshop.locator(".pec-folder-row .lesson-type")).toHaveText([
    "1. Introduction",
    "2. Ear Examination",
    "3. Primary Ear Care Procedures",
  ]);
  await expect(workshop.locator("[data-ear-lesson]")).toHaveCount(17);
  await page.screenshot({ path: testInfo.outputPath("ear-workshop.png") });
  await workshop.locator('[data-folder="introduction"]').click();
  await workshop.locator('[data-nested-folder="gettingStarted"]').click();
  await workshop.locator('[data-ear-lesson="objectives"]').click();
  const lesson = page.locator("#primaryEarCareLessonPage");
  await expect(lesson).toContainText("Ear washout and irrigation");
  await lesson.locator(".pec-flow-next").click();
  await expect(lesson.locator("h2")).toHaveText("Aim");
  await page.reload();
  await expect(lesson.locator("h2")).toHaveText("Aim");
  await page.locator("#backBtnGlobal").click();
  await expect(
    workshop.locator('[data-nested-section="gettingStarted"]'),
  ).toBeVisible();
  await workshop.locator('[data-section="introduction"] > h3 button').click();
  await workshop.locator('[data-folder="earExamination"]').click();
  await workshop.locator('[data-nested-folder="otoscopy"]').click();
  await workshop.locator('[data-ear-lesson="otoscopyVideo"]').click();
  await lesson.locator("video").scrollIntoViewIfNeeded();
  await checkVideo(lesson.locator("video"), request, browserName);
  if (browserName !== "webkit")
    await lesson.locator("video").evaluate((video) => video.play());
  await page.locator("#backBtnGlobal").click();
  await expect(
    workshop.locator('[data-nested-section="otoscopy"]'),
  ).toBeVisible();
  await expect
    .poll(() => lesson.locator("video").evaluate((video) => video.paused))
    .toBe(true);
  await workshop.locator(".pec-ear-care-link").click();
  await expect(page.locator("#pecWorkshopPage")).toBeVisible();
});

test("Optic Nerve opens the existing quiz and returns to PEC Fundoscopy", async ({
  page,
}) => {
  await page.goto("/#pecWorkshop");
  const workshop = page.locator("#pecWorkshopPage");
  await expect(workshop).toHaveAttribute("data-inited", "1");
  await workshop.locator('[data-folder="eyeExamination"]').click();
  await workshop.locator('[data-nested-folder="fundoscopy"]').click();
  await expect(
    workshop.locator('[data-pec-video="optic_disc_cases_video"]'),
  ).toHaveCount(0);
  const row = workshop.locator('[data-pec-route="glaucomaQuizCaseStudy"]');
  await expect(row).toHaveClass(/lesson-row--quiz/);
  await expect(row.locator(".lesson-type")).toHaveText("Optic Nerve");
  await row.click();
  await expect(page.locator("#glaucomaQuizCaseStudy")).toBeVisible();
  await expect(
    page.locator("#gqAllQuestions .quiz-card").first(),
  ).toBeVisible();
  await expect(
    page.locator("#glaucomaQuizCaseStudy .quiz-card-number").first(),
  ).toHaveCSS("background-color", "rgb(0, 201, 0)");
  await expect(page.locator("#gqResults")).toHaveCSS(
    "background-color",
    "rgb(0, 201, 0)",
  );
  await page.reload();
  await expect(
    page.locator("#glaucomaQuizCaseStudy .quiz-card-number").first(),
  ).toHaveCSS("background-color", "rgb(0, 201, 0)");
  await page.locator("#backBtnGlobal").click();
  await expect(
    workshop.locator('[data-nested-section="fundoscopy"]'),
  ).toBeVisible();
  await page.goto("/#glaucomaQuizCaseStudy");
  await expect(
    page.locator("#glaucomaQuizCaseStudy .quiz-card-number").first(),
  ).toHaveCSS("background-color", "rgb(242, 86, 0)");
});

test("anterior cases change See all to Next after either reveal path", async ({
  page,
}) => {
  await page.goto("/#medicalStudentsWorkshop/medicalAnteriorSegmentPage");
  const lesson = page.locator("#medicalAnteriorSegmentPage");
  const button = lesson.locator("#medicalAnteriorAnswerBtn");
  await expect(lesson).toHaveAttribute("data-current-case", "1");
  await expect(button).toHaveText("See all");
  await expect(button).toHaveCSS("color", "rgb(255, 255, 255)");
  await button.click();
  await expect(button).toHaveText("Next >");
  await page.evaluate(() => window.I18N.applyTranslations(document));
  await expect(button).toHaveText("Next >");
  await button.click();
  await expect(lesson).toHaveAttribute("data-current-case", "2");
  await expect(button).toHaveText("See all");
  await lesson.locator('[data-medical-answer-section="signs"]').click();
  await lesson.locator('[data-medical-answer-section="diagnosis"]').click();
  await expect(button).toHaveText("See all");
  await lesson.locator('[data-medical-answer-section="action"]').click();
  await expect(button).toHaveText("Next >");
  for (let id = 3; id <= 12; id++) {
    await button.click();
    await expect(lesson).toHaveAttribute("data-current-case", String(id));
    await button.click();
    await expect(button).toHaveText(id === 12 ? "Finish" : "Next >");
  }
  await button.click();
  await expect(button).toHaveText("Restart");
  await page.goto("/#pecWorkshop");
  const workshop = page.locator("#pecWorkshopPage");
  await expect(workshop).toHaveAttribute("data-inited", "1");
  await workshop.locator('[data-folder="eyeExamination"]').click();
  await workshop.locator('[data-nested-folder="pupilsAnterior"]').click();
  await workshop
    .locator('[data-medical-target="medicalAnteriorSegmentPage"]')
    .click();
  await expect(button).toHaveText("See all");
  await expect(button).toHaveCSS("color", "rgb(255, 255, 255)");
  await button.click();
  await expect(button).toHaveText("Next >");
  await expect(button).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("dashboard Ears opens the workshop and Otoscope uses the shared PDF viewer", async ({
  page,
  request,
}, testInfo) => {
  await page.goto("/#dashboard");
  const ears = page.locator('.category-card[data-category="ears"]');
  await expect(ears).not.toHaveClass(/category-card--disabled/);
  await ears.click();
  const workshop = page.locator("#primaryEarCareWorkshopPage");
  await expect(workshop).toBeVisible();
  await expect(workshop.locator(".pec-ear-care-link i")).toHaveText(">");
  await workshop.locator('[data-folder="earExamination"]').click();
  await workshop.locator('[data-nested-folder="otoscopy"]').click();
  const row = workshop.locator('[data-ear-lesson="otoscopyGuide"]');
  await expect(row).toHaveClass(/lesson-row--pdf/);
  await expect(
    workshop
      .locator('[data-nested-section="otoscopy"] [data-ear-lesson]')
      .first(),
  ).toHaveAttribute("data-ear-lesson", "otoscopyGuide");
  await expect(row.locator(".lesson-type")).toHaveText(
    "How to Use the Arclight Otoscope",
  );
  await row.click();
  const lesson = page.locator("#primaryEarCareLessonPage");
  await expect(lesson).toHaveClass(/core-examination-pdf-page/);
  const images = lesson.locator("#primaryEarCarePdfViewer img");
  await expect(images).toHaveCount(2);
  await expect
    .poll(() =>
      images.first().evaluate((n) => n.complete && n.naturalWidth > 0),
    )
    .toBe(true);
  await expect
    .poll(() => images.last().evaluate((n) => n.complete && n.naturalWidth > 0))
    .toBe(true);
  const download = lesson.locator(".primary-ear-pdf-download");
  await expect(download).toBeVisible();
  await expect(download).toHaveAttribute(
    "href",
    "/images/pdf/Workshop/ENT/Otoscope/Otoscope.pdf",
  );
  expect((await request.head(await download.getAttribute("href"))).ok()).toBe(
    true,
  );
  const stage = lesson.locator(".workshop-pdf-stage");
  const before = await stage.evaluate((n) => n.style.transform);
  await images
    .first()
    .dispatchEvent("wheel", { deltaY: -100, clientX: 200, clientY: 300 });
  await expect
    .poll(() => stage.evaluate((n) => n.style.transform))
    .not.toBe(before);
  await page.screenshot({ path: testInfo.outputPath("otoscope-pdf.png") });
  await page.reload();
  await expect(lesson.locator("#primaryEarCarePdfViewer img")).toHaveCount(2);
  await page.locator("#backBtnGlobal").click();
  await expect(workshop).toBeVisible();
  await expect(
    workshop.locator('[data-nested-section="otoscopy"]'),
  ).toBeVisible();
  await row.click();
  await lesson.locator(".pec-flow-next").click();
  await expect(lesson).not.toHaveClass(/core-examination-pdf-page/);
  await expect(lesson.locator(".primary-ear-pdf-download")).toBeHidden();
  await expect(lesson.locator("h2")).toHaveText(
    "Examination: Observe, palpate and otoscopy",
  );
});

test("primary workshop folders restore internally and close after external navigation", async ({
  page,
}) => {
  for (const [route, folder, nested, row] of [
    [
      "pecWorkshop",
      "eyeExamination",
      "fundalReflex",
      '[data-pec-lesson="fundalSourceGuide"]',
    ],
    [
      "primaryEarCareWorkshop",
      "earExamination",
      "otoscopy",
      '[data-ear-lesson="otoscopyGuide"]',
    ],
  ]) {
    await page.goto(`/#${route}`);
    const workshop = page.locator(
      route === "pecWorkshop"
        ? "#pecWorkshopPage"
        : "#primaryEarCareWorkshopPage",
    );
    await expect(workshop).toHaveAttribute("data-inited", "1");
    await workshop.locator(`[data-folder="${folder}"]`).click();
    await workshop.locator(`[data-nested-folder="${nested}"]`).click();
    await workshop.locator(row).click();
    await page.locator("#backBtnGlobal").click();
    await expect(
      workshop.locator(`[data-nested-section="${nested}"]`),
    ).toBeVisible();
    // Navigate without a hard reload, so the cached workshop DOM is covered too.
    await page.evaluate(async () => {
      const { loadPage } = await import("/js/navigation.js");
      await loadPage("dashboard");
    });
    await expect(page.locator(".category-card").first()).toBeVisible();
    await page.evaluate(async (route) => {
      const { loadPage } = await import("/js/navigation.js");
      await loadPage(route);
    }, route);
    await expect(workshop).toBeVisible();
    await expect(workshop.locator(".pec-folder-row").first()).toBeVisible();
    await expect(
      workshop.locator(".pec-section-card:not([hidden])"),
    ).toHaveCount(0);
    await expect(
      workshop.locator(".pec-nested-section-card:not([hidden])"),
    ).toHaveCount(0);
  }
});

test("primary progress bars persist PDF completion and reuse quiz progress", async ({
  page,
}) => {
  await page.goto("/#primaryEarCareWorkshop");
  const ear = page.locator("#primaryEarCareWorkshopPage");
  await expect(ear).toHaveAttribute("data-inited", "1");
  await expect(
    ear.locator('[data-ear-lesson] [role="progressbar"]'),
  ).toHaveCount(17);
  await ear.locator('[data-folder="earExamination"]').click();
  await ear.locator('[data-nested-folder="otoscopy"]').click();
  const pdf = ear.locator('[data-ear-lesson="otoscopyGuide"]');
  await pdf.click();
  await expect(page.locator("#primaryEarCarePdfViewer img")).toHaveCount(2);
  await page.locator("#backBtnGlobal").click();
  await expect(pdf.locator('[role="progressbar"]')).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
  await expect(pdf.locator(".lesson-complete-tick")).toHaveCount(1);
  await expect(pdf.locator(".lesson-progress__fill")).toHaveCSS(
    "background-color",
    "rgb(21, 225, 21)",
  );
  await page.reload();
  await expect(pdf.locator('[role="progressbar"]')).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
  await page.goto("/#pecWorkshop");
  const pec = page.locator("#pecWorkshopPage");
  await expect(pec).toHaveAttribute("data-inited", "1");
  const leaves = pec.locator(".lesson-row[data-lesson]");
  expect(await leaves.count()).toBeGreaterThan(30);
  await expect(
    pec.locator('.lesson-row[data-lesson] [role="progressbar"]'),
  ).toHaveCount(await leaves.count());
  await pec.locator('[data-folder="eyeExamination"]').click();
  await pec.locator('[data-nested-folder="fundoscopy"]').click();
  const quiz = pec.locator('[data-pec-route="glaucomaQuizCaseStudy"]');
  await quiz.click();
  await page.evaluate(async () => {
    const { setGlaucomaLessonProgress } =
      await import("/js/glaucomaWorkshopProgress.js");
    setGlaucomaLessonProgress("glaucomaQuizCaseStudy", 45);
  });
  await page.locator("#backBtnGlobal").click();
  await expect(quiz.locator('[role="progressbar"]')).toHaveAttribute(
    "aria-valuenow",
    "45",
  );
  await expect(quiz.locator(".lesson-complete-tick")).toHaveCount(0);
  await quiz.click();
  await page.evaluate(async () => {
    const { setGlaucomaLessonProgress } =
      await import("/js/glaucomaWorkshopProgress.js");
    setGlaucomaLessonProgress("glaucomaQuizCaseStudy", 100);
  });
  await page.locator("#backBtnGlobal").click();
  await expect(quiz.locator('[role="progressbar"]')).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
  await expect(quiz.locator(".lesson-complete-tick")).toHaveCount(1);
});

test("primary scroll completion completes its folder and survives closing it", async ({
  page,
}) => {
  await page.goto("/#primaryEarCareWorkshop");
  const workshop = page.locator("#primaryEarCareWorkshopPage");
  await expect(workshop).toHaveAttribute("data-inited", "1");
  await workshop.locator('[data-folder="earExamination"]').click();
  await workshop.locator('[data-nested-folder="history"]').click();
  const row = workshop.locator('[data-ear-lesson="history"]');
  await row.click();
  const lesson = page.locator("#primaryEarCareLessonPage");
  await expect
    .poll(() =>
      lesson
        .locator("img")
        .evaluateAll((nodes) =>
          nodes.every((n) => n.complete && n.naturalWidth > 0),
        ),
    )
    .toBe(true);
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await page.locator("#backBtnGlobal").click();
  await expect(row.locator('[role="progressbar"]')).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
  await expect(row.locator(".lesson-complete-tick")).toHaveCount(1);
  await workshop.locator('[data-nested-section="history"] > h3 button').click();
  await expect(
    workshop.locator('[data-nested-folder="history"] .lesson-complete-tick'),
  ).toHaveCount(1);
});

test("PEC source video records partial viewing and completion", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === "webkit",
    "Windows WebKit does not decode these H.264 files.",
  );
  await page.goto("/#pecWorkshop");
  const workshop = page.locator("#pecWorkshopPage");
  await expect(workshop).toHaveAttribute("data-inited", "1");
  await workshop.locator('[data-folder="eyeExamination"]').click();
  await workshop.locator('[data-nested-folder="fundalReflex"]').click();
  const row = workshop.locator('[data-pec-video="fundal_demonstration_video"]');
  await row.click();
  const video = page.locator("#pecProcedureVideoPage video");
  await expect.poll(() => video.evaluate((v) => v.duration)).toBeGreaterThan(0);
  await video.evaluate((v) => {
    v.currentTime = v.duration / 2;
    v.dispatchEvent(new Event("timeupdate"));
  });
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(
            localStorage.getItem(
              "primaryWorkshop:progress:pecWorkshop:pec-fundal-demonstration-video",
            ) || "{}",
          ).percent || 0,
      ),
    )
    .toBeGreaterThan(40);
  await page.locator("#backBtnGlobal").click();
  await expect(row.locator('[role="progressbar"]')).toHaveAttribute(
    "aria-valuenow",
    "50",
  );
  await expect(row.locator(".lesson-complete-tick")).toHaveCount(0);
  await row.click();
  await expect.poll(() => video.evaluate((v) => v.duration)).toBeGreaterThan(0);
  await video.evaluate(async (v) => {
    v.currentTime = v.duration - 0.15;
    await v.play();
  });
  await expect.poll(() => video.evaluate((v) => v.ended)).toBe(true);
  await page.locator("#backBtnGlobal").click();
  await expect(row.locator('[role="progressbar"]')).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
  await expect(row.locator(".lesson-complete-tick")).toHaveCount(1);
  await page.reload();
  await expect(row.locator('[role="progressbar"]')).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
});
