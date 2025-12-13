/** @jest-environment jsdom */
import { jest } from "@jest/globals";
import { loadPage } from "../public/js/navigation.js";

global.fetch = jest.fn(async () => ({
  ok: true,
  text: async () => `<div class="page">ok</div>`,
}));

describe("Performance budgets: route load time", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="page-content"></div>`;
  });

  test("loadPage('dashboard') completes quickly", async () => {
    const start = performance.now();
    await loadPage("dashboard");
    const end = performance.now();

    // NOTE: This is a lightweight proxy budget and is sensitive to CI/host variability.
    // Keep it modest but stable across environments.
    expect(end - start).toBeLessThan(200);
  });
});
