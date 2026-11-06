import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("username", "Lion");
    localStorage.setItem("userField", "eyes");
    localStorage.setItem("userJob", "medical_student");
    localStorage.setItem("studentYears", "1");
  });
  await page.goto("/#/myprofile");
  await expect(page.locator("#profileName")).toHaveText("Lion");
});

test("cancel discards name, interests and uploaded photo; focus returns to the pencil", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Edit Profile", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Edit Profile" });
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(/#\/myprofile$/);
  await dialog
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Tiger");
  await dialog.getByRole("checkbox", { name: "Ears", exact: true }).check();
  await page
    .locator("#editProfileAvatarInput")
    .setInputFiles("public/images/icon/base/language_b.webp");
  await expect(page.locator("#editProfileAvatar")).toHaveClass(
    /has-profile-avatar/,
  );
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("#profileName")).toHaveText("Lion");
  await expect(page.locator("#profileInterests")).toHaveText("Eyes");
  expect(
    await page.evaluate(() => localStorage.getItem("profileAvatarDataUrl")),
  ).toBeNull();
  await expect(page.locator("#profileEditBtn")).toBeFocused();
  await page.getByRole("button", { name: "Edit Profile", exact: true }).click();
  await page
    .locator("#editProfileAvatarInput")
    .setInputFiles("public/images/icon/base/language_b.webp");
  await expect(page.locator("#editProfileAvatar")).toHaveClass(
    /has-profile-avatar/,
  );
  expect(
    await page.evaluate(() => localStorage.getItem("profileAvatarDataUrl")),
  ).toBeNull();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.locator("#profileAvatar")).toHaveClass(
    /has-profile-avatar/,
  );
  expect(
    await page.evaluate(() => localStorage.getItem("profileAvatarDataUrl")),
  ).toMatch(/^data:image\/jpeg/);
});

test("role changes retain drafted experience and save the compact summary", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Edit Profile", exact: true }).click();
  await page.locator("#editProfileStudentYears").selectOption("2");
  await page.locator("#editProfileRolesSummary").click();
  await page
    .getByRole("checkbox", { name: "General Practitioner", exact: true })
    .check();
  await page
    .locator("#editProfileExperience select[data-role='general_practitioner']")
    .selectOption("2-5");
  await page
    .getByRole("checkbox", { name: "Medical Student", exact: true })
    .uncheck();
  await page
    .getByRole("checkbox", { name: "Medical Student", exact: true })
    .check();
  await expect(page.locator("#editProfileStudentYears")).toHaveValue("2");
  await expect(
    page.locator(
      "#editProfileExperience select[data-role='general_practitioner']",
    ),
  ).toHaveValue("2-5");
  await page.locator("#editProfileRolesSummary").click();
  await page.getByRole("checkbox", { name: "Ears", exact: true }).check();
  await page.locator("#editProfileDeviceUse").selectOption("regularly");
  await page.getByRole("checkbox", { name: "Studying", exact: true }).check();
  await page.getByRole("checkbox", { name: "Teaching", exact: true }).check();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("#profileRole")).toContainText(
    "General Practitioner",
  );
  await expect(page.locator("#profileInterests")).toHaveText("Eyes · Ears");
  await expect(page.locator("#profileDeviceUse")).toHaveText("Regularly");
  await expect(page.locator("#profilePurposes")).toHaveText(
    "Studying · Teaching",
  );
  await expect(page.locator("#profileClinicalExperience")).toContainText(
    "Final Year / Senior Medical Student",
  );
  await expect(page.locator("#profileClinicalExperience")).toContainText(
    "General Practitioner: 2-5 years",
  );
  await expect(
    page.locator("[data-profile-interest], #profileExperience, #profileRoles"),
  ).toHaveCount(0);
  expect(
    await page.evaluate(() => ({
      years: localStorage.getItem("studentYears"),
      practice: JSON.parse(localStorage.getItem("practiceByRole")),
    })),
  ).toEqual({
    years: "2",
    practice: { general_practitioner: { range: "2-5" } },
  });
});

test("Escape closes editing, Settings owns language, and the direct edit route still works", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Edit Profile", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Name", exact: true })
    .press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("#profileEditBtn")).toBeFocused();
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await expect(page).toHaveURL(/#\/settings$/);
  await expect(
    page.getByRole("button", { name: "Language English", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Downloads", exact: true }),
  ).toBeVisible();
  await page.goto("/#/editProfile");
  await expect(page.locator("#editProfileForm")).toHaveAttribute(
    "data-bound",
    "true",
  );
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page).toHaveURL(/#\/myprofile$/);
});
