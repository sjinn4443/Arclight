import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("arclight:onboarded", "1");
    localStorage.setItem("prefLang", "en");
    localStorage.setItem("username", "Sujin");
    localStorage.setItem("userField", "eyes");
    localStorage.setItem("arclight:download-suggestion-shown", "1");
  });
  await page.goto("/#/dashboard");
  await expect(
    page.locator("#dashboardWorkspaceRecommendations .module-card"),
  ).toHaveCount(4);
});

test("desktop matches the bento hierarchy without clipped controls at four widths", async ({
  page,
}, testInfo) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1100 });
    const workspace = page.locator(".dashboard-desktop");
    await expect(workspace).toBeVisible();
    await expect(
      page.locator(".dw-topbar #dashboardSearchInput"),
    ).toBeVisible();
    await expect(workspace.locator(".dw-profile")).toContainText("Sujin");
    await expect(workspace.locator(".dw-skin")).toBeDisabled();
    expect(
      await workspace.evaluate((root) => {
        const box = root.getBoundingClientRect();
        return Array.from(root.querySelectorAll("button,h1,h2,p,.dw-panel"))
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            return (
              rect.width > 0 &&
              (rect.left < box.left - 1 ||
                rect.right > box.right + 1 ||
                el.scrollWidth > el.clientWidth + 2)
            );
          })
          .map((el) => el.className);
      }),
    ).toEqual([]);
    expect(
      await workspace
        .locator("img")
        .evaluateAll((images) =>
          images.every((img) => img.complete && img.naturalWidth > 0),
        ),
    ).toBe(true);
    await workspace.screenshot({
      path: testInfo.outputPath(`dashboard-${width}.png`),
    });
  }
  expect(errors).toEqual([]);
});

test("search, lesson routing, profile updates and Notes retain their real targets", async ({
  page,
}) => {
  await page.keyboard.press("/");
  const search = page.locator("#dashboardSearchInput");
  await expect(search).toBeFocused();
  await search.fill("visual acuity");
  const result = page.locator("#dashboardSearchPanel .module-card").first();
  await expect(result).toContainText("Visual Acuity");
  await result.click();
  await expect(page.locator("#visualAcuityPage")).toBeVisible();
  await page.goto("/#/dashboard");
  await expect(page.locator(".dw-profile")).toContainText("Sujin");
  await page.evaluate(async () => {
    const { setProfileName } = await import("/js/profileData.js");
    setProfileName("Mina");
  });
  await expect(page.locator(".dw-profile")).toContainText("Mina");
  await expect(page.locator("[data-dashboard-greeting]")).toContainText("Mina");
  await page.locator("[data-dashboard-notes]").click();
  await expect(page).toHaveURL(/#\/mylearning/);
  await expect(page.locator('.ml-tab[data-ml-tab="notes"]')).toHaveClass(
    /active/,
  );
});

test("category, profile, settings and tour links navigate; language picker stays local", async ({
  page,
}) => {
  for (const [selector, route] of [
    [".dw-eyes", "eyes"],
    [".dw-ears", "ears"],
    [".dw-profile", "myprofile"],
    ['.dw-nav[data-dashboard-route="settings"]', "settings"],
    [".dw-tour button", "intro"],
  ]) {
    await page.locator(selector).click();
    await expect(page).toHaveURL(new RegExp("#/" + route + "$"));
    await page.goto("/#/dashboard");
    await expect(page.locator(".dw-profile")).toBeVisible();
  }
  await page.locator("[data-dashboard-language]").click();
  await expect(page.locator("#languagePickerOverlay")).toBeVisible();
  await expect(page).toHaveURL(/#\/dashboard$/);
});

test("mobile keeps the category carousel and shares search when resizing to desktop", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".dashboard-desktop")).toBeHidden();
  await expect(page.locator("#categoryCarousel")).toBeVisible();
  await expect(
    page.locator("#recommendedPlaceholder .module-card"),
  ).toHaveCount(2);
  await page.locator("#dashboardSearchToggle").click();
  const search = page.locator("#dashboardSearchInput");
  await search.fill("pupils");
  await expect(page.locator("#dashboardSearchPanel")).toBeVisible();
  await search.press("Escape");
  // Escape clears a native search field in Chrome; retain a live query on resize.
  await search.fill("pupils");
  await page.locator(".hello-wrap").click();
  await page.screenshot({
    path: testInfo.outputPath("dashboard-mobile.png"),
    fullPage: true,
  });
  await page.setViewportSize({ width: 1280, height: 1000 });
  await expect(page.locator(".dw-topbar #dashboardSearchInput")).toHaveValue(
    "pupils",
  );
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(page.locator(".unified-top #dashboardSearchInput")).toHaveCount(
    1,
  );
  await expect(page.locator("#categoryCarousel")).toBeVisible();
});

test("Korean and RTL layouts translate headings without duplicated recommendations", async ({
  page,
}) => {
  for (const lang of ["ko", "ar"]) {
    await page.evaluate(async (lang) => {
      await (await import("/js/i18n.js")).setLanguage(lang);
    }, lang);
    await expect(page.locator(".dw-heading .dw-eyebrow")).not.toHaveText(
      "Your learning space",
    );
    await expect(
      page.locator("#dashboardWorkspaceRecommendations .module-card"),
    ).toHaveCount(4);
    expect(
      await page
        .locator(".dashboard-desktop")
        .evaluate((root) => root.scrollWidth <= root.clientWidth + 1),
    ).toBe(true);
  }
});

test("Download opens the existing offline selection dialog", async ({
  page,
}) => {
  await page.route("**/api/app/offline-assets", (route) =>
    route.fulfill({
      json: {
        urls: ["/js/main.js"],
        assets: [{ url: "/js/main.js", bytes: 1000 }],
      },
    }),
  );
  await page.locator("[data-dashboard-download]").click();
  await expect(
    page.getByRole("dialog", { name: "Download options", exact: true }),
  ).toBeVisible();
});
