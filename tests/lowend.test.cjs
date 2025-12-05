/** @jest-environment jsdom */
import { jest } from "@jest/globals";
import { loadPage } from "../public/js/navigation.js";

global.fetch = jest.fn(async () => ({
  ok: true,
  text: async () => `<div class="page">ok</div>`,
}));

function busyWait(ms) {
  const start = performance.now();
  while (performance.now() - start < ms) {}
}

describe("Low-end perceived perf proxy", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="page-content"></div>`;
  });

  test("core flow does not stutter under heavy JS load", async () => {
    const pages = ["dashboard", "page1", "page2", "page3"];

    const start = performance.now();
    for (const p of pages) {
      busyWait(10); // simulate CPU contention
      await loadPage(p);
    }
    const end = performance.now();

    expect(end - start).toBeLessThan(800); // tune for stability
  });
});
