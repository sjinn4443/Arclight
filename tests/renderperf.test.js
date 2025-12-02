/** @jest-environment node 
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

describe("Rendering guards: CSS is present early", () => {
  test("index.html links main stylesheet in head", () => {
    const html = fs.readFileSync(
      path.join(__dirname, "..", "public", "index.html"),
      "utf8",
    );
    const dom = new JSDOM(html);
    const { document } = dom.window;

    const headLinks = [
      ...document.head.querySelectorAll("link[rel='stylesheet']"),
    ];
    expect(headLinks.length).toBeGreaterThan(0);

    const hrefs = headLinks.map((l) => l.getAttribute("href"));
    expect(hrefs.some((h) => h.includes("style.css"))).toBe(true);
  });
});

describe("Rendering guards: images optimised", () => {
  test("no <img> uses huge unoptimised formats unless explicit", () => {
    const htmlFiles = [
      "index.html",
      "html/dashboard.html",
      "html/intro.html",
      "html/eyes.html", // Added Eyes page as per project brief
      "html/ears.html", // Added Ears page as per project brief
      "html/quizzes.html", // Added Quizzes page as per project brief
      "html/mylearning.html", // Added My Learning page as per project brief
      // add other key pages
    ];

    for (const f of htmlFiles) {
      const html = fs.readFileSync(
        path.join(__dirname, "..", "public", f),
        "utf8",
      );
      const dom = new JSDOM(html);
      const imgs = [...dom.window.document.querySelectorAll("img")];

      for (const img of imgs) {
        const src = img.getAttribute("src") || "";
        const ext = src.split(".").pop().toLowerCase();

        // Allow svg/png only if you want; tune rules to your project
        const allowed = ["webp", "svg", "png", "jpg", "jpeg"];
        expect(allowed).toContain(ext);

        // Prefer webp for photos
        if (["jpg", "jpeg"].includes(ext)) {
          // allow if explicitly marked
          const allowJpeg = img.hasAttribute("data-allow-jpeg");
          expect(allowJpeg).toBe(true);
        }

        // width/height present to reduce layout shifts
        expect(img.getAttribute("width")).toBeTruthy();
        expect(img.getAttribute("height")).toBeTruthy();
      }
    }
  });
});
 */
