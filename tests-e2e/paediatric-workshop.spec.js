import { test, expect } from "@playwright/test";
import {
  PAEDIATRIC_ROUTE as ROUTE,
  PAEDIATRIC_PAGE as PAGE,
  PAEDIATRIC_LESSONS as LESSONS,
} from "../public/js/paediatricWorkshopData.js";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    for (const key of [
      "arclight:onboarded",
      "onboardingSeen",
      "arclightOnboardingComplete",
    ])
      localStorage.setItem(key, "1");
    localStorage.setItem("onboardingComplete", "true");
    localStorage.setItem("selectedInterest", "Eyes");
    localStorage.setItem("prefLang", "en");
    localStorage.setItem("arclight:eyes:carousel-guide-seen:v2", "1");
  });
});
async function workshop(page) {
  await page.goto(`/#/${ROUTE}`);
  const home = page.locator(`#${PAGE}`);
  await expect(home).toHaveAttribute("data-inited", "1");
  return home;
}
async function openEntry(page, home, id) {
  const entry = LESSONS.find((item) => item.id === id);
  for (const selector of [
    ".pec-nested-section-card:visible > h3 button",
    ".pec-section-card:visible > h3 button",
  ]) {
    const close = home.locator(selector);
    while (await close.count()) await close.first().click();
  }
  const folder = home.locator(`[data-folder="${entry.folder}"]`);
  if (await folder.isVisible()) await folder.click();
  if (entry.nested) {
    const nested = home.locator(`[data-nested-folder="${entry.nested}"]`);
    if (await nested.isVisible()) await nested.click();
  }
  await home.locator(`[data-paediatric-lesson="${id}"]`).click();
  const lesson = page.locator(`#${entry.target}`);
  await expect(lesson).toBeVisible();
  await expect(lesson.locator(".paediatric-flow-nav")).toHaveCount(1);
  return lesson;
}

test("Eyes workshop carousel opens the new curriculum and saved card", async ({
  page,
}, testInfo) => {
  await page.goto("/#/eyes");
  const card = page.locator(
    '#pecCarousel .eyes-card[data-target="paediatricSurgicalEyeEarWorkshop"]',
  );
  await expect(card).toBeVisible();
  await expect(card.locator(".eyes-card__title")).toHaveText(
    "Paediatric Surgical Eye & Ear",
  );
  expect(await card.locator(".eyes-card__title").textContent()).toBe(
    "Paediatric Surgical\nEye & Ear",
  );
  await expect(card.locator(".eyes-card__title")).toHaveCSS(
    "white-space",
    "pre-line",
  );
  await expect(page.locator("#pecCarousel .eyes-card").first()).toHaveAttribute(
    "data-target",
    ROUTE,
  );
  await expect(card.locator(".eyes-card__bg")).toHaveAttribute(
    "src",
    /car_paediatric.webp/,
  );
  await expect(card.locator(".eyes-card__bg")).toBeVisible();
  await card.screenshot({ path: testInfo.outputPath("workshop-carousel.png") });
  await card.locator(".heart-btn").click();
  await card.locator(".eyes-card__open").click();
  await expect(page.locator(`#${PAGE}`)).toHaveAttribute("data-inited", "1");
  await expect(page.locator(`#${PAGE} [data-folder]`)).toHaveCount(5);
  await page.goto("/#/mylearning");
  const saved = page.locator(
    '.ml-card[data-target="paediatricSurgicalEyeEarWorkshop"]',
  );
  await expect(saved).toBeVisible();
  await saved.click();
  await expect(page.locator(`#${PAGE}`)).toBeVisible();
});

test("orange curriculum uses skill names, ordered formats and unwrapped single tests", async ({
  page,
}) => {
  const home = await workshop(page);
  await expect(home.locator(".pupil-level--intermediate")).toHaveCount(1);
  for (const [section, prefix, skill] of [
    ["front", "Front", "Front of Eye Examination"],
    ["fundal", "Fundal", "Fundal Reflex Examination"],
    ["direct", "Direct", "Direct Ophthalmoscopy"],
  ]) {
    const rows = home.locator(
      `[data-nested-section="${section}-how"] [data-paediatric-lesson]`,
    );
    expect(
      await rows.evaluateAll((nodes) =>
        nodes.map((node) => node.dataset.paediatricLesson),
      ),
    ).toEqual([
      `paediatric${prefix}Scroll`,
      `paediatric${prefix}Animation`,
      `paediatric${prefix}Pdf`,
      `paediatric${prefix}Video`,
    ]);
    await expect(rows.locator(".lesson-type")).toHaveText([
      skill,
      `${skill} Animation`,
      `${skill} PDF`,
      `${skill} (videos)`,
    ]);
  }
  await expect(
    home.locator(
      '[data-nested-folder="fundal-train"], [data-nested-folder="direct-train"]',
    ),
  ).toHaveCount(0);
  await expect(
    home.locator(
      '[data-section="fundal"] > [data-paediatric-lesson="paediatricFundalTest"]',
    ),
  ).toHaveCount(1);
  await expect(
    home.locator(
      '[data-section="direct"] > [data-paediatric-lesson="paediatricDirectTest"]',
    ),
  ).toHaveCount(1);
  await expect(
    home.locator(
      '[data-nested-section="front-train"] [data-paediatric-lesson]',
    ),
  ).toHaveCount(2);
  await expect(home).not.toContainText(/cartoon|Intermediate/);
  await expect(
    home.locator(
      '[data-paediatric-lesson="paediatricIntermediateCases"] .lesson-type',
    ),
  ).toHaveText("Case Study");
});

test("workshop structure uses unboxed bullet points", async ({ page }) => {
  const home = await workshop(page);
  const lesson = await openEntry(page, home, "paediatricOverviewPage");
  const list = lesson.locator(".paediatric-structure-list");
  await expect(list.locator("li")).toHaveCount(5);
  await expect(list).toHaveCSS("list-style-type", "disc");
  await expect(list.locator("li").first()).toHaveCSS("border-top-width", "0px");
});

test("source objectives, keyboard folders and scrolly progress survive reload", async ({
  page,
}, testInfo) => {
  const home = await workshop(page);
  const folder = home.locator('[data-folder="front"]');
  await folder.focus();
  await folder.press("Enter");
  await expect(home.locator('[data-section="front"]')).toBeVisible();
  await home
    .locator('[data-paediatric-lesson="paediatricFrontObjectivesPage"]')
    .click();
  const lesson = page.locator("#paediatricFrontObjectivesPage");
  await expect(lesson).toContainText("infective and allergic conjunctivitis");
  await expect(lesson).toContainText("corneal ulcer and foreign body");
  await expect(lesson).toContainText("penetrating injury and ruptured globe");
  await expect(lesson.locator(".diabetic-screening-panel")).toHaveCount(3);
  await expect(lesson.locator(".diabetic-screening-panel img")).toHaveCount(0);
  await expect(lesson.locator(".diabetic-screening-panel").first()).toHaveCSS(
    "min-height",
    "0px",
  );
  const frontPanel = await lesson
    .locator(".diabetic-screening-panel")
    .first()
    .boundingBox();
  expect(frontPanel.height).toBeLessThan(350);
  await lesson.locator(".paediatric-flow-nav").scrollIntoViewIfNeeded();
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(
            localStorage.getItem(
              "lessonProgress:paediatricFrontObjectivesPage",
            ),
          )?.percent,
      ),
    )
    .toBe(100);
  await page.reload();
  await expect(lesson).toBeVisible();
  await expect(lesson.locator(".paediatric-flow-nav")).toHaveCount(1);
  await page.locator("#backBtnGlobal").click();
  await expect(home.locator('[data-section="front"]')).toBeVisible();
  await expect(
    home.locator(
      '[data-paediatric-lesson="paediatricFrontObjectivesPage"] [role="progressbar"]',
    ),
  ).toHaveAttribute("aria-valuenow", "100");
  await page.screenshot({ path: testInfo.outputPath("workshop-folders.png") });
});

test("front of eye follows animation, PDF and video navigation", async ({
  page,
  request,
  isMobile,
}) => {
  test.setTimeout(180_000);
  // Format ordering and guide returns are checked separately. Timed Lottie
  // playback remains covered by the shared examination's dedicated suite.
  const home = await workshop(page);
  let lesson = await openEntry(page, home, "paediatricFrontAnimation");
  const nextLesson = async () => {
    const next = lesson.locator(".paediatric-flow-nav .pec-flow-next");
    if (isMobile) {
      // Windows WebKit's moving media layout makes pointer targeting unstable.
      // Activate the same accessible control while retaining the real runtime.
      await next.focus();
      await next.press("Enter");
    } else await next.click();
  };
  await expect(lesson.locator(".paediatric-flow-nav .pec-flow-next")).toHaveCSS(
    "background-color",
    "rgb(242, 86, 0)",
  );
  await expect(lesson.locator("video source").first()).toHaveAttribute(
    "src",
    /FullAnim\/FrontofEyeFullAnim_timed_220p/,
  );
  await nextLesson();
  lesson = page.locator("#frontOfEyePdfPage");
  await expect(lesson).toBeVisible();
  await expect(lesson.locator(".paediatric-flow-nav")).toHaveCount(1);
  const download = lesson.locator("a[download]");
  await expect(download).toHaveAttribute("href", /\.pdf$/);
  expect(
    (await request.head(await download.getAttribute("href"))).ok(),
  ).toBeTruthy();
  await page.reload();
  await expect(lesson.locator(".paediatric-flow-nav")).toHaveCount(1);
  await nextLesson();
  lesson = page.locator("#feFullAnteriorSegmentPage");
  await expect(lesson).toBeVisible();
  await expect(lesson.locator("video source").first()).toHaveAttribute(
    "src",
    /Core\/FrontofEye\/FE_Full_220p/,
  );
  await page.locator("#backBtnGlobal").click();
  await expect(home.locator('[data-nested-section="front-how"]')).toBeVisible();
});

test("fundal and direct folders target existing PDFs, animations and training", async ({
  page,
  request,
}) => {
  // This round trip loads four shared media pages on mobile WebKit.
  test.setTimeout(180_000);
  const home = await workshop(page);
  for (const id of [
    "paediatricFundalPdf",
    "paediatricDirectPdf",
    "paediatricFundalAnimation",
    "paediatricDirectAnimation",
  ]) {
    const lesson = await openEntry(page, home, id);
    if (id.endsWith("Pdf")) {
      const download = lesson.locator("a[download]");
      expect(
        (await request.head(await download.getAttribute("href"))).ok(),
      ).toBeTruthy();
    }
    if (id.endsWith("Animation"))
      await expect(lesson.locator("video")).toHaveCount(1);
    if (await lesson.locator("iframe").count()) {
      const notice = page.getByRole("button", {
        name: "Understood",
        exact: true,
      });
      if (await notice.isVisible()) await notice.click();
      await lesson
        .frameLocator("iframe")
        .locator("#arclightEmbeddedBackButton")
        .click();
    } else await page.locator("#backBtnGlobal").click();
    await expect(home).toBeVisible();
  }
});

for (const id of [
  "paediatricFrontScroll",
  "paediatricFundalScroll",
  "paediatricDirectScroll",
]) {
  test(`shared examination scrolly returns to its folder: ${id}`, async ({
    page,
  }) => {
    const home = await workshop(page);
    await openEntry(page, home, id);
    await page.locator("#backBtnGlobal").click();
    await expect(home).toBeVisible();
    const entry = LESSONS.find((item) => item.id === id);
    await expect(
      home.locator(`[data-nested-section="${entry.nested}"]`),
    ).toBeVisible();
  });
}

test("reused Medical Students pages return to this workshop without duplicate controls", async ({
  page,
}) => {
  const home = await workshop(page);
  const lesson = await openEntry(page, home, "paediatricFrontCases");
  await expect(lesson.locator(".medical-next-wrap")).not.toBeVisible();
  await page.reload();
  await expect(lesson.locator(".paediatric-flow-nav")).toHaveCount(1);
  await page.locator("#backBtnGlobal").click();
  await expect(
    home.locator('[data-nested-section="front-train"]'),
  ).toBeVisible();
  await home
    .locator('[data-paediatric-lesson="paediatricIntermediateCases"]')
    .click();
  const chat = page.locator("#caseStudyChatPage");
  await expect(chat).toBeVisible();
  await expect(chat).toHaveClass(/pec-case-study-unlimited/);
  await expect(chat.locator("#caseTimerBtn")).not.toBeVisible();
  await expect(chat.locator(".casechat-imgwrap.is-revealed")).toHaveCount(1);
  await expect(
    chat.locator('.casechat-modal [data-action="ok"]'),
  ).not.toBeVisible();
  await expect(chat.locator("#caseChatSubmitBtn")).toHaveCSS(
    "background-color",
    "rgb(242, 86, 0)",
  );
  await expect(chat.locator(".paediatric-flow-nav")).toHaveCount(1);
  await page.reload();
  await expect(chat).toBeVisible();
  await expect(chat.locator(".paediatric-flow-nav")).toHaveCount(1);
  await expect(chat).toHaveClass(/pec-case-study-unlimited/);
  await expect(chat.locator("#caseTimerBtn")).not.toBeVisible();
  await expect(chat.locator(".casechat-imgwrap.is-revealed")).toHaveCount(1);
  await page.locator("#backBtnGlobal").click();
  await expect(
    home.locator('[data-nested-section="front-train"]'),
  ).toBeVisible();
  await page.goto("/#/casestudy");
  await expect(page.locator("#caseStudyIntermediateCard")).toBeVisible();
  await page.locator("#caseStudyIntermediateCard").click();
  await expect(chat).not.toHaveClass(/pec-case-study-unlimited/);
  await expect(
    chat.locator('.casechat-modal [data-action="ok"]'),
  ).toBeVisible();
});

test("otoscopy reuses the existing video and two-page PDF, and marks missing animation", async ({
  page,
  request,
}) => {
  const home = await workshop(page);
  const lesson = await openEntry(page, home, "paediatricOtoscopyPdf");
  await expect(lesson.locator("#primaryEarCarePdfViewer img")).toHaveCount(2);
  const download = lesson.locator("a[download]");
  expect(
    (await request.head(await download.getAttribute("href"))).ok(),
  ).toBeTruthy();
  await page.reload();
  await expect(lesson.locator("#primaryEarCarePdfViewer img")).toHaveCount(2);
  await expect(lesson.locator(".paediatric-flow-nav")).toHaveCount(1);
  await expect(lesson.locator(".pec-flow-nav:visible")).toHaveCount(1);
  await lesson.locator(".paediatric-flow-nav .pec-flow-next").click();
  await expect(lesson.locator("video source")).toHaveAttribute(
    "src",
    /Otoscopy_Instructional_Video_051124_720p.mp4/,
  );
  await page.locator("#backBtnGlobal").click();
  const unavailable = home.locator(
    '[data-paediatric-lesson="paediatricOtoscopyAnimation"]',
  );
  await expect(unavailable).toHaveAttribute("aria-disabled", "true");
  await expect(unavailable.locator(".paediatric-coming-soon")).toHaveText(
    "Coming Soon",
  );
  await expect(unavailable.locator(".paediatric-coming-soon")).toHaveCSS(
    "color",
    "rgb(255, 255, 255)",
  );
  await expect(unavailable.locator(".paediatric-coming-soon")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
  await expect(unavailable.locator(".lesson-type")).toHaveCSS(
    "color",
    "rgb(0, 0, 0)",
  );
  await expect(unavailable).toHaveCSS("background-color", "rgb(184, 184, 184)");
  await expect(
    home.locator(
      '[data-paediatric-lesson="paediatricOtoscopyVideo"] .lesson-type',
    ),
  ).toHaveText("Otoscopy (videos)");
  await expect(unavailable.locator(".lesson-meta")).toHaveCount(0);
  const unavailableBox = await unavailable.boundingBox();
  const availableBox = await home
    .locator('[data-paediatric-lesson="paediatricOtoscopyVideo"]')
    .boundingBox();
  expect(Math.abs(unavailableBox.height - availableBox.height)).toBeLessThan(2);
  await expect(unavailable).not.toHaveAttribute("data-lesson");
  await expect(
    home.locator('[data-nested-section="otoscopy-how"]'),
  ).toBeVisible();
});

test("ear image MCQs score, review, persist, restart, and fit mobile", async ({
  page,
  request,
}, testInfo) => {
  const home = await workshop(page);
  const lesson = await openEntry(page, home, "paediatricEarImagePracticePage");
  const images = lesson.locator("img[src*='PaediatricSurgicalEyeEar']");
  await expect(images).toHaveCount(5);
  for (const img of await images.all())
    expect(
      (await request.head(await img.getAttribute("src"))).ok(),
    ).toBeTruthy();
  await expect(lesson.locator("[data-diabetic-scroll-lesson]")).toHaveCount(0);
  await expect(lesson.locator("fieldset")).toHaveCount(5);
  const order = await lesson.locator("fieldset").evaluateAll((cards) =>
    cards.map((card) => ({
      id: card.dataset.earQuestion,
      choices: [...card.querySelectorAll(".opt input")].map(
        (input) => input.value,
      ),
    })),
  );
  expect(order.map((card) => card.id)).not.toEqual([
    "normal",
    "hole",
    "csom",
    "csom-hole",
    "ome",
  ]);
  const positions = order.map((card) => card.choices.indexOf(card.id));
  expect(positions).not.toEqual([0, 1, 2, 3, 4]);
  await expect(lesson.locator(".quiz-question").first()).toHaveText(
    "Which option best describes this image?",
  );
  await expect(lesson.locator(".paediatric-quiz-heading h2")).toHaveText(
    "Choose the correct answer",
  );
  await expect(lesson.locator(".paediatric-quiz-heading h2")).toHaveCSS(
    "font-size",
    "18px",
  );
  await expect(lesson.locator(".paediatric-quiz-heading")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
  await lesson.locator("[data-ear-quiz-submit]").click();
  await expect(lesson.locator("[data-ear-quiz-status]")).toContainText(
    "Answer all five",
  );
  await lesson.locator('input[name="ear-normal"][value="hole"]').check();
  await page.reload();
  await expect(
    lesson.locator('input[name="ear-normal"][value="hole"]'),
  ).toBeChecked();
  expect(
    await lesson.locator("fieldset").evaluateAll((cards) =>
      cards.map((card) => ({
        id: card.dataset.earQuestion,
        choices: [...card.querySelectorAll(".opt input")].map(
          (input) => input.value,
        ),
      })),
    ),
  ).toEqual(order);
  for (const id of ["hole", "csom", "csom-hole", "ome"])
    await lesson.locator(`input[name="ear-${id}"][value="${id}"]`).check();
  await lesson.locator("[data-ear-quiz-submit]").click();
  await expect(lesson.locator("dialog")).toBeVisible();
  await expect(lesson.locator("[data-ear-quiz-score]")).toHaveText("4 / 5");
  await lesson.locator("[data-ear-quiz-review]").click();
  await expect(lesson.locator(".opt.correct")).toHaveCount(5);
  await expect(lesson.locator(".opt.wrong")).toHaveCount(1);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(
            localStorage.getItem(
              "lessonProgress:paediatricEarImagePracticePage",
            ),
          )?.percent,
      ),
    )
    .toBe(100);
  await page.reload();
  await expect(lesson.locator('input[type="radio"]:disabled')).toHaveCount(25);
  await lesson.locator("[data-ear-quiz-submit]").click();
  await lesson.locator("[data-ear-quiz-restart]").click();
  await expect(lesson.locator("input:checked")).toHaveCount(0);
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await lesson.locator("fieldset").first().scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBeTruthy();
    await page.screenshot({
      path: testInfo.outputPath(`ear-quiz-${width}.png`),
    });
  }
  await page.locator("#backBtnGlobal").click();
  await expect(
    home.locator(
      '[data-paediatric-lesson="paediatricEarImagePracticePage"] [role="progressbar"]',
    ),
  ).toHaveAttribute("aria-valuenow", "100");
  await home
    .locator('[data-paediatric-lesson="paediatricTympanicMembranesPage"]')
    .click();
  const gallery = page.locator("#paediatricTympanicMembranesPage");
  await expect(
    gallery.locator("img[src*='PaediatricSurgicalEyeEar']"),
  ).toHaveCount(6);
  await expect(
    gallery.locator(".paediatric-image-panel figcaption"),
  ).toHaveCount(0);
  await expect(
    gallery.locator(
      ".paediatric-image-panel .diabetic-screening-panel__text p",
    ),
  ).toHaveText([
    "Normal",
    "Hole",
    "Chronic Suppurative Otitis Media (CSOM)",
    "CSOM & Hole",
    "Otitis Media with Effusion (OME)",
  ]);
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await gallery
      .locator(".paediatric-image-panel")
      .first()
      .scrollIntoViewIfNeeded();
    const galleryText = await gallery
      .locator(".paediatric-image-panel .diabetic-screening-panel__text")
      .first()
      .boundingBox();
    const galleryImage = await gallery
      .locator(".paediatric-image-panel img")
      .first()
      .boundingBox();
    expect(galleryImage.x).toBeGreaterThan(galleryText.x + galleryText.width);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBeTruthy();
    await page.screenshot({
      path: testInfo.outputPath(`ear-gallery-${width}.png`),
    });
  }
});

test("illustrated objectives pair clinical images with aligned captions", async ({
  page,
  request,
}, testInfo) => {
  const home = await workshop(page);
  for (const [id, count] of [
    ["paediatricFundalObjectivesPage", 3],
    ["paediatricDirectObjectivesPage", 4],
    ["paediatricOtoscopyObjectivesPage", 4],
  ]) {
    const lesson = await openEntry(page, home, id);
    const images = lesson.locator(".paediatric-objective-figure img");
    await expect(images).toHaveCount(count);
    for (const image of await images.all()) {
      expect((await request.head(await image.getAttribute("src"))).ok()).toBe(
        true,
      );
      await image.scrollIntoViewIfNeeded();
      const figure = image.locator("..");
      const caption = figure.locator("figcaption");
      await expect(caption).toHaveCSS("text-transform", "uppercase");
      await expect(caption).toHaveCSS("background-color", "rgb(242, 86, 0)");
      await expect(image).toHaveCSS("max-height", "none");
      await expect
        .poll(() =>
          image.evaluate((node) => node.complete && node.naturalWidth > 0),
        )
        .toBe(true);
      await expect
        .poll(() =>
          image.evaluate((node) => {
            const box = node.getBoundingClientRect();
            return Math.abs(
              box.height / box.width - node.naturalHeight / node.naturalWidth,
            );
          }),
        )
        .toBeLessThan(0.01);
      await expect(image.locator("xpath=ancestor::article")).toHaveCSS(
        "min-height",
        "0px",
      );
      await expect
        .poll(async () => {
          const imageBox = await image.boundingBox();
          const captionBox = await caption.boundingBox();
          return Math.max(
            Math.abs(imageBox.width - captionBox.width),
            Math.abs(imageBox.y + imageBox.height - captionBox.y),
          );
        })
        .toBeLessThan(2);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBeTruthy();
    await page.screenshot({
      path: testInfo.outputPath(`${id}.png`),
      fullPage: true,
    });
    await page.locator("#backBtnGlobal").click();
    const entry = LESSONS.find((item) => item.id === id);
    await expect(
      home.locator(`[data-section="${entry.folder}"]`),
    ).toBeVisible();
  }
});

test("single fundal and direct tests open the requested shared quizzes and return", async ({
  page,
}) => {
  const home = await workshop(page);
  const fundal = await openEntry(page, home, "paediatricFundalTest");
  await expect(fundal).toHaveAttribute("id", "fundalReflexQuizPage");
  await page.locator("#backBtnGlobal").click();
  await expect(home.locator('[data-section="fundal"]')).toBeVisible();
  const direct = await openEntry(page, home, "paediatricDirectTest");
  await expect(direct).toHaveAttribute("id", "diabeticCaseQuizPage");
  await direct
    .locator("#diabeticCaseQuizIntroModal .casechat-confirm__btn")
    .click();
  await expect(direct.locator("#diabeticCaseQuizSubmit")).toHaveCSS(
    "background-color",
    "rgb(242, 86, 0)",
  );
  await expect(
    direct.locator(".diabetic-case-quiz__nav-button.is-active"),
  ).toHaveCSS("background-color", "rgb(242, 86, 0)");
  await expect(direct.locator(".diabetic-next-wrap")).not.toBeVisible();
  await page.locator("#backBtnGlobal").click();
  await expect(home.locator('[data-section="direct"]')).toBeVisible();
});

test("reused hearing, ear examination and otoscopy practice have one orange navigation pair", async ({
  page,
}) => {
  const home = await workshop(page);
  for (const id of [
    "paediatricEarHearing",
    "paediatricEarExamination",
    "paediatricOtoscopyPractice",
  ]) {
    const lesson = await openEntry(page, home, id);
    await expect(lesson.locator(".diabetic-screening-step").first()).toHaveCSS(
      "background-color",
      "rgb(242, 86, 0)",
    );
    await expect(
      lesson.locator(".diabetic-screening-eyebrow").first(),
    ).toHaveCSS("color", "rgb(242, 86, 0)");
    await expect(lesson.locator(".medical-overview-list li").first()).toHaveCSS(
      "border-top-color",
      "rgba(242, 86, 0, 0.35)",
    );
    await expect(lesson.locator(".pec-flow-nav:visible")).toHaveCount(1);
    await expect(
      lesson.locator(".paediatric-flow-nav .pec-flow-prev"),
    ).toHaveCSS("color", "rgb(242, 86, 0)");
    await expect(
      lesson.locator(".paediatric-flow-nav .pec-flow-next"),
    ).toHaveCSS("background-color", "rgb(242, 86, 0)");
    await page.locator("#backBtnGlobal").click();
    await expect(home).toBeVisible();
  }
  await page.goto("/#/primaryEarCareWorkshop");
  const earHome = page.locator("#primaryEarCareWorkshopPage");
  await expect(earHome).toHaveAttribute("data-inited", "1");
  await earHome.locator('[data-folder="earExamination"]').click();
  await earHome.locator('[data-nested-folder="otoscopy"]').click();
  await earHome.locator('[data-ear-lesson="examination"]').click();
  const ear = page.locator("#primaryEarCareLessonPage");
  await expect(ear).not.toHaveClass(/paediatric-flow-target/);
  await expect(ear.locator(".diabetic-screening-step").first()).toHaveCSS(
    "background-color",
    "rgb(0, 201, 0)",
  );
});

test("My Learning resumes local lessons under the new workshop without duplicating shared pages", async ({
  page,
}) => {
  await page.addInitScript(() => {
    for (const target of [
      "paediatricFrontObjectivesPage",
      "frontOfEyeExaminationScrollPage",
    ])
      localStorage.setItem(
        `lessonProgress:${target}`,
        JSON.stringify({ percent: 35, updatedAt: Date.now() }),
      );
  });
  await page.goto("/#/mylearning");
  await expect(page.locator('[data-ml-tab="inProgress"]')).toHaveAttribute(
    "data-ml-bound",
    "1",
  );
  await page.locator('[data-ml-tab="inProgress"]').click();
  const item = page.locator(
    '.ml-progress-item[data-sub-page-id="paediatricFrontObjectivesPage"]',
  );
  await expect(item).toHaveCount(1);
  const group = item.locator("../..");
  await expect(group).toContainText("Paediatric Surgical Eye & Ear");
  await expect(
    group.locator(
      '.ml-progress-item[data-sub-page-id="frontOfEyeExaminationScrollPage"]',
    ),
  ).toHaveCount(0);
  await group.locator(".ml-progress-card__summary").click();
  await item.click();
  await expect(page.locator("#paediatricFrontObjectivesPage")).toBeVisible();
  await expect(page).toHaveURL(
    new RegExp(`#/${ROUTE}/paediatricFrontObjectivesPage$`),
  );
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator(`#${PAGE} [data-section="front"]`)).toBeVisible();
});

test("all source objectives support direct links and leaving the workshop clears return context", async ({
  page,
}) => {
  await page.goto(`/#/${ROUTE}/paediatricDirectObjectivesPage`);
  const lesson = page.locator("#paediatricDirectObjectivesPage");
  await expect(lesson).toContainText("raised intracranial pressure");
  await expect(lesson.locator(".paediatric-flow-nav")).toHaveCount(1);
  await page.locator("#backBtnGlobal").click();
  await expect(page.locator(`#${PAGE} [data-section="direct"]`)).toBeVisible();
  await page.goto("/#/eyes");
  await page
    .locator(
      '#pecCarousel [data-target="paediatricSurgicalEyeEarWorkshop"] .eyes-card__open',
    )
    .click();
  await expect(page.locator(`#${PAGE} .pec-section-card:visible`)).toHaveCount(
    0,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`/#/${ROUTE}/paediatricOtoscopyObjectivesPage`);
  await expect(page.locator("#paediatricOtoscopyObjectivesPage")).toContainText(
    "range of ages of children",
  );
});
