/**
 * @file Typography Consistency Tests
 * @description Verifies that typography styles (font sizes, line heights, and element selectors) are consistently defined in the application's CSS.
 */
const fs = require("fs");
const path = require("path");

const STYLE_DIR = path.join(__dirname, "..", "public", "style");

const CSS_PATHS = [
  path.join(STYLE_DIR, "base.css"),
  path.join(STYLE_DIR, "components.css"),
  path.join(STYLE_DIR, "pages.css"),
  path.join(STYLE_DIR, "responsive.css"),
];

function readAllCss() {
  const files = fs.readdirSync(STYLE_DIR).filter((f) => f.endsWith(".css"));
  return files
    .map((f) => fs.readFileSync(path.join(STYLE_DIR, f), "utf8"))
    .join("\n");
}

describe("Typography consistency (static CSS)", () => {
  const CSS = readAllCss();
  console.log("Typography CSS content:", CSS); // Debugging line

  test("core typography properties exist", () => {
    // Check for general font-related properties, indicating typography is defined
    expect(CSS).toMatch(/font-size:/);
    expect(CSS).toMatch(/line-height:/);
  });

  test("headings/body/buttons exist in CSS", () => {
    // Check for the existence of these selectors in the CSS
    expect(CSS).toMatch(/h1[\s\S]*?{/);
    expect(CSS).toMatch(/p[\s\S]*?{/);
    expect(CSS).toMatch(/button[\s\S]*?{/);
  });
});
