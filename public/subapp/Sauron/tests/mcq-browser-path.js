async (page) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(
    "http://127.0.0.1:8090/Sauron/index.html?mcqquality=20260726",
    {
      waitUntil: "networkidle",
    },
  );
  await page.setViewportSize({ width: 360, height: 740 });
  await page.click("#burger-icon");
  await page.click('.mcq-level-button[data-level="primary"]');
  await page.click("#submitMcqButton");

  const unanswered = {
    message: await page.locator("#mcqResult").innerText(),
    focusName: await page.evaluate(
      () => document.activeElement?.getAttribute("name") || "",
    ),
    revealedReviews: await page
      .locator(".mcq-item-review:not([hidden])")
      .count(),
  };
  await page.screenshot({
    path: "Sauron/output/playwright/mcq-unanswered-360x740.png",
  });

  const questions = page.locator("#mcqContainer fieldset.question");
  for (let index = 0; index < (await questions.count()); index += 1) {
    await questions.nth(index).locator('input[type="radio"]').first().check();
  }
  await page.click("#submitMcqButton");
  await page.locator("#mcqResult").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: "Sauron/output/playwright/mcq-result-review-360x740.png",
  });

  const result = {
    message: await page.locator("#mcqResult").innerText(),
    rationaleCount: await page
      .locator(".mcq-item-review:not([hidden]) .mcq-item-feedback")
      .count(),
    sourceCount: await page
      .locator(".mcq-item-review:not([hidden]) .mcq-item-source")
      .count(),
    retryLabel: await page.locator("#submitMcqButton").innerText(),
  };
  await page.click("#submitMcqButton");

  const geometry = await page.evaluate(() => {
    const modal = document.querySelector("#mcqModalContent");
    const optionHeights = [
      ...document.querySelectorAll("#mcqContainer .options label"),
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
    app: "Sauron",
    unanswered,
    result,
    retryCleared: (await page.locator("#mcqResult").innerText()) === "",
    geometry,
    consoleErrors,
    pageErrors,
  };
};
