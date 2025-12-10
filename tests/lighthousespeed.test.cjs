/** @jest-environment node */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom"); // Required for HTML parsing in node environment tests

describe("Performance budgets: payload sizes", () => {
  const PUBLIC = path.join(__dirname, "..", "public");

  const budget = {
    htmlKb: 200, // adjust for your app
    cssKb: 150,
    jsKb: 400,
    swKb: 80,
  };

  function kb(bytes) {
    return bytes / 1024;
  }

  test("index.html stays under budget", () => {
    const p = path.join(PUBLIC, "index.html");
    const size = fs.statSync(p).size;
    expect(kb(size)).toBeLessThan(budget.htmlKb);
  }); // put each html files here

  test("main CSS stays under budget", () => {
    const files = [
      "style/base.css",
      "style/components.css",
      "style/pages.css",
      "style/responsive.css",
    ];

    const totalBytes = files.reduce((sum, f) => {
      const p = path.join(PUBLIC, f);
      return sum + fs.statSync(p).size;
    }, 0);

    expect(kb(totalBytes)).toBeLessThan(budget.cssKb);
  });

  test("core JS bundle stays under budget", () => {
    const files = [
      "js/main.js",
      "js/navigation.js",
      "js/dashboard.js",
      "js/quiz-launcher.js",
      "js/i18n.js",
      "js/language-picker.js",
      "js/menu.js",
      "js/pwa.js",
      "js/video.js",
      "js/location-service.js",
      // add other critical startup scripts
    ];

    const totalBytes = files.reduce((sum, f) => {
      const p = path.join(PUBLIC, f);
      return sum + fs.statSync(p).size;
    }, 0);

    expect(kb(totalBytes)).toBeLessThan(budget.jsKb);
  });

  test("service worker stays under budget", () => {
    const p = path.join(PUBLIC, "sw.js");
    const size = fs.statSync(p).size;
    expect(kb(size)).toBeLessThan(budget.swKb);
  });
});
