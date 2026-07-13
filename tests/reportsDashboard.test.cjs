/**
 * @jest-environment node
 */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

describe("reports dashboard assets", () => {
  test.each(["public/reports.html", "public/html/reports.html"])(
    "%s exposes the map and real profile metric charts",
    (relativePath) => {
      const html = fs.readFileSync(path.join(ROOT, relativePath), "utf8");

      expect(html).toContain('id="worldMap"');
      expect(html).toContain('id="statsAims"');
      expect(html).toContain('id="statsInterest"');
      expect(html).toContain('id="statsExperience"');
    },
  );

  test("dashboard loads protected IP locations and does not inject demo users", () => {
    const script = fs.readFileSync(
      path.join(ROOT, "public/js/reports.js"),
      "utf8",
    );

    expect(script).toContain('fetch("/api/dev/ip-locations"');
    expect(script).toContain('_metricValues(users, "aims")');
    expect(script).not.toContain("demoUsers");
  });
});
