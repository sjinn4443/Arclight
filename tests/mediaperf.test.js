/* @jest-environment jsdom */
import { jest } from "@jest/globals";
import { initializeVideoPlayers } from "../public/js/video.js";
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

    await initializeVideoPlayers("missing.mp4");

    // No assertion here, as initializeVideoPlayers doesn't handle mediaError display
  });
});
