/** @jest-environment node */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

describe("Media preload guards", () => {
  test("no video/audio preload on non-media pages", () => {
    const nonMediaPages = [
      "index.html",
      "html/dashboard.html",
      "html/intro.html",
      "html/eyes.html", // Added Eyes page
      "html/ears.html", // Added Ears page
      "html/quizzes.html", // Added Quizzes page
      "html/mylearning.html", // Added My Learning page
      "html/languageinstall.html", // Added language install page
      "html/onboarding.html", // Added onboarding page
      "html/interest.html", // Added interest page
      // Add other key pages that are not primarily media consumption pages
    ];

    for (const f of nonMediaPages) {
      const html = fs.readFileSync(
        path.join(__dirname, "..", "public", f),
        "utf8",
      );
      const dom = new JSDOM(html);
      const preloads = [
        ...dom.window.document.querySelectorAll("link[rel='preload']"),
      ];

      const bad = preloads.filter((l) => {
        const as = (l.getAttribute("as") || "").toLowerCase();
        return as === "video" || as === "audio";
      });

      expect(bad).toHaveLength(0);
    }
  });
});

/* @jest-environment jsdom */
import { initVideoPlayer } from "../public/js/video.js";
// ^ replace with your actual function (assuming video.js exists based on project context)

describe("Media resilience proxy", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="page-content"></div>
      <div id="mediaError" style="display:none"></div>
      <video id="trainingVideo"></video>
    `;
  });

  test("handles 404/codec error gracefully", async () => {
    // Mock fetch used by your media init
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 404,
    }));

    await initVideoPlayer("missing.mp4");

    // Assert your UI shows an error rather than hanging
    expect(document.getElementById("mediaError").style.display).not.toBe(
      "none",
    );
  });
});
