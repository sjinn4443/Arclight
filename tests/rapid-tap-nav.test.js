/**
 * @file Rapid Tap Navigation Tests
 * @description Ensures the navigation system handles rapid user interactions without duplicating history entries or causing unexpected behavior.
 */
const { loadPage, historyStack } = require("../public/js/navigation.js");

// mock fetch so loadPage works
global.fetch = jest.fn(async (url) => ({
  ok: true,
  text: async () => `<div id="page-content" class="page active">${url}</div>`, // Ensure page-content exists
}));

describe("Rapid tap navigation guard", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="page-content"></div>
      <button id="backBtnGlobal"></button>
    `;
    historyStack.length = 0; // Clear the actual history stack
  });

  afterEach(() => {
    // No need to restore history.pushState if not spied on.
  });

  test("multiple rapid loadPage calls only push history once for same route", async () => {
    await loadPage("dashboard");
    await loadPage("dashboard");
    await loadPage("dashboard");

    // Given the currentRoute guard, only one push to historyStack is expected for the same route.
    expect(historyStack.filter((r) => r === "dashboard").length).toBe(1);
    expect(historyStack.length).toBe(1); // Ensure total stack size is 1
  });
});
