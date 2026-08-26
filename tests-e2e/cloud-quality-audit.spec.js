import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const distDir = process.env.PLAYWRIGHT_DIST_DIR || "dist";

function listHtmlFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? listHtmlFiles(absolute) : [absolute];
  });
}

function routeFromHtml(file) {
  const relative = path.relative(distDir, file).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) {
    return \`/${relative.slice(0, -"/index.html".length)}/\`;
  }
  return \`/${relative}\`;
}

const routes = [...new Set(listHtmlFiles(distDir)
  .filter((file) => file.endsWith(".html"))
  .map(routeFromHtml))]
  .sort();

test.beforeAll(() => {
  expect(routes.length, "The production build must contain at least one HTML route").toBeGreaterThan(0);
});

for (const route of routes) {
  test(\`route ${route} has a usable responsive and accessible shell\`, async ({ page }) => {
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response, \`No response for ${route}\`).not.toBeNull();
    expect(response.ok(), \`HTTP failure for ${route}\`).toBeTruthy();

    await page.waitForLoadState("networkidle").catch(() => undefined);
    await page.evaluate(() => document.fonts?.ready).catch(() => undefined);

    const audit = await page.evaluate(() => {
      const labelledByText = (element) => {
        const ids = (element.getAttribute("aria-labelledby") || "")
          .split(/\s+/)
          .filter(Boolean);
        return ids.map((id) => document.getElementById(id)?.textContent || "").join(" ").trim();
      };

      const interactive = [
        ...document.querySelectorAll(
          "button, a[href], input:not([type='hidden']), select, textarea, [role='button'], [role='link'], [role='checkbox'], [role='radio'], [role='switch']",
        ),
      ];

      const missingNames = interactive
        .filter((element) => {
          if (element.getAttribute("aria-hidden") === "true") return false;
          const name = [
            element.getAttribute("aria-label"),
            labelledByText(element),
            element.getAttribute("title"),
            element.getAttribute("alt"),
            element.getAttribute("placeholder"),
            element.getAttribute("value"),
            element.textContent,
          ]
            .filter(Boolean)
            .join(" ")
            .trim();
          return !name;
        })
        .map((element) => element.outerHTML.slice(0, 240));

      const ids = [...document.querySelectorAll("[id]")].map((element) => element.id);
      const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];

      return {
        horizontalOverflow:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1,
        missingNames,
        duplicateIds,
        bodyText: document.body?.innerText?.trim() || "",
      };
    });

    expect(audit.bodyText, \`Empty document body for ${route}\`).not.toBe("");
    expect(audit.horizontalOverflow, \`Horizontal overflow for ${route}\`).toBeFalsy();
    expect(audit.missingNames, \`Unlabelled interactive elements for ${route}\`).toEqual([]);
    expect(audit.duplicateIds, \`Duplicate IDs for ${route}\`).toEqual([]);
    expect(pageErrors, \`Uncaught page errors for ${route}\`).toEqual([]);
  });
}

test("the production shell remains available offline through its service worker", async ({
  context,
  page,
}) => {
  const response = await page.goto("/", { waitUntil: "networkidle" });
  expect(response?.ok()).toBeTruthy();

  const serviceWorkerReady = await page.evaluate(async () => {
    if (!("serviceWorker" in navigator)) return false;
    const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 10_000));
    const registration = await Promise.race([navigator.serviceWorker.ready, timeout]);
    return Boolean(
      registration &&
        (registration.active || registration.waiting || registration.installing),
    );
  });
  expect(serviceWorkerReady, "No active production service worker").toBeTruthy();

  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded", timeout: 20_000 }).catch(() => undefined);
  const offlineBody = (await page.locator("body").innerText()).trim();
  expect(offlineBody, "The offline shell rendered no content").not.toBe("");
  await context.setOffline(false);
});
