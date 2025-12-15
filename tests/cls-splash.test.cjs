const fs = require("fs");

/**
 * Regression guard: prevent re-introducing CLS from animating layout properties
 * in the splash animation.
 */
describe("CLS guards", () => {
  test("shiftRight keyframes should not animate 'left'", () => {
    const css = fs.readFileSync("public/style/base.css", "utf8");

    const start = css.indexOf("@keyframes shiftRight");
    expect(start).toBeGreaterThanOrEqual(0);

    const block = css.slice(start, start + 400);
    expect(block).not.toMatch(/\bleft\s*:/);
    expect(block).toMatch(/transform\s*:/);
  });
});
