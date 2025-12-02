/** @jest-environment jsdom 
import { loadPage } from "../public/js/navigation.js";

global.fetch = jest.fn(async () => ({
  ok: true,
  text: async () => `<div class="page">ok</div>`,
}));

describe("Memory leak proxy", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="page-content"></div>`;
  });

  test("memory does not grow dramatically after many page loads", async () => {
    if (global.gc) global.gc();
    const before = process.memoryUsage().heapUsed;

    for (let i = 0; i < 80; i++) {
      await loadPage("dashboard");
      await loadPage("page1");
    }

    if (global.gc) global.gc();
    const after = process.memoryUsage().heapUsed;

    const growthMb = (after - before) / (1024 * 1024);
    expect(growthMb).toBeLessThan(15); // proxy budget, tune per your app
  });
}); */
