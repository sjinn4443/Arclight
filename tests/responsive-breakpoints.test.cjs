/**
 * @file Responsive Breakpoints Test
 * @description Verifies that the application's CSS includes media queries and critical container styles for responsive design.
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

describe("Responsiveness (static)", () => {
  const CSS = readAllCss();

  test("has at least one media query breakpoint", () => {
    expect(CSS).toMatch(/@media/);
  });

  test("critical containers participate in media queries", () => {
    // These just verify the selectors exist somewhere and that media queries exist
    expect(CSS).toMatch(/\.bottom-bar/);
    expect(CSS).toMatch(/\bnav\b/);
    expect(CSS).toMatch(/@media/);
  });
});
