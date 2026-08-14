/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { readFileSync } from "node:fs";

const navigationSource = readFileSync("public/js/navigation.js", "utf8");
const videosHtml = readFileSync("public/html/videos.html", "utf8");
const componentsCss = readFileSync("public/style/components.css", "utf8");

describe("Core Examination PDF wiring", () => {
  it.each([
    ["visualAcuityPdf", "visualAcuityPage"],
    ["pupilsPecPdf", "pupilsPage"],
    ["pupilsAdvancedPdf", "pupilsPage"],
    ["frontOfEyePdf", "frontOfEyePage"],
  ])("returns %s to its owning Videos page", (route, subPageId) => {
    expect(navigationSource).toContain(
      `${route}: { routeName: "videos", subPageId: "${subPageId}" }`,
    );

    const historyFirstRoutes = navigationSource.match(
      /const HISTORY_FIRST_BACK_ROUTES = new Set\(\[([\s\S]*?)\]\);/,
    )?.[1];
    expect(historyFirstRoutes).toBeDefined();
    expect(historyFirstRoutes).not.toContain(`"${route}"`);
  });

  it.each(["visualAcuityPage", "pupilsPage", "frontOfEyePage"])(
    "returns %s to the Eyes page",
    (subPageId) => {
      expect(navigationSource).toContain(`${subPageId}: { routeName: "eyes" }`);
    },
  );

  it("replaces the current history entry during structural back navigation", () => {
    expect(navigationSource).toContain(
      "replaceHistoryWithStructuralTarget(structuralTarget);",
    );
  });

  it("uses advanced_pdf.webp for the Pupils Advanced PDF row", () => {
    expect(videosHtml).toMatch(
      /data-target="pupilsAdvancedPdfPage"[\s\S]*?class="thumb thumb--advanced-pdf"/,
    );
    expect(componentsCss).toContain(
      'background-image: url("/images/icon/eyes/moduleicons/advanced_pdf.webp")',
    );
  });
});
