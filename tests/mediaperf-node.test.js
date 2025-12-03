/** @jest-environment node */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const { ROUTES } = require("../public/js/config.js"); // Import ROUTES

describe("Media preload guards", () => {
  test("no video/audio preload on non-media pages", () => {
    // Dynamically generate nonMediaPages from ROUTES, excluding known media pages
    const nonMediaPages = Object.keys(ROUTES)
      .filter((routeName) => routeName !== "videos") // Exclude the \'videos\' page
      .map((routeName) => ROUTES[routeName]);

    for (const f of nonMediaPages) {
      const html = fs.readFileSync(
        path.join(__dirname, "..", "public", f),
        "utf8",
      );
      const dom = new JSDOM(html);
      const preloads = [
        ...dom.window.document.querySelectorAll("link[rel=\'preload\"]"),
      ];

      const bad = preloads.filter((l) => {
        const as = (l.getAttribute("as") || "").toLowerCase();
        return as === "video" || as === "audio";
      });

      expect(bad).toHaveLength(0);
    }
  });
});
