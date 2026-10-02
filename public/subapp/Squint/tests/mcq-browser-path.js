async (page) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(
    "http://127.0.0.1:8090/Squint/index.html?mcqquality=20260726",
    {
      waitUntil: "networkidle",
    },
  );
  await page.setViewportSize({ width: 360, height: 740 });
  await page.click("#sidebar-toggle");
  await page.click("#open-mcq-btn");
  await page.click("#mcq-submit");

  const unanswered = {
    message: await page.locator("#mcq-result").innerText(),
    focusName: await page.evaluate(
      () => document.activeElement?.getAttribute("name") || "",
    ),
    revealedReviews: await page
      .locator(".mcq-item-review:not([hidden])")
      .count(),
  };
  await page.locator("#mcq-result").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: "Squint/output/playwright/mcq-unanswered-360x740.png",
  });

  const questions = page.locator("#mcq-form fieldset");
  for (let index = 0; index < (await questions.count()); index += 1) {
    await questions.nth(index).locator('input[type="radio"]').first().check();
  }
  await page.click("#mcq-submit");
  await page.locator("#mcq-result").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: "Squint/output/playwright/mcq-result-review-360x740.png",
  });

  const result = {
    message: await page.locator("#mcq-result").innerText(),
    rationaleCount: await page
      .locator(".mcq-item-review:not([hidden]) .mcq-item-feedback")
      .count(),
    sourceCount: await page
      .locator(".mcq-item-review:not([hidden]) .mcq-item-source")
      .count(),
    retryLabel: await page.locator("#mcq-restart").innerText(),
  };
  await page.click("#mcq-restart");

  const geometry = await page.evaluate(() => {
    const modal = document.querySelector(".mcq-overlay-panel");
    const optionHeights = [
      ...document.querySelectorAll("#mcq-form .mcq-option"),
    ].map((option) => option.getBoundingClientRect().height);
    const rect = modal.getBoundingClientRect();
    return {
      viewport: [window.innerWidth, window.innerHeight],
      documentClientWidth: document.documentElement.clientWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      modal: {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
      },
      minimumOptionHeight: optionHeights.length
        ? Math.min(...optionHeights)
        : null,
    };
  });

  return {
    app: "Squint",
    unanswered,
    result,
    retryCleared: (await page.locator("#mcq-result").innerText()) === "",
    retryScrollTop: await page
      .locator("#mcq-card")
      .evaluate((card) => card.scrollTop),
    geometry,
    consoleErrors,
    pageErrors,
  };
};
