/**
 * @jest-environment jsdom
 */

import {
  jest,
  describe,
  beforeAll,
  beforeEach,
  it,
  expect,
} from "@jest/globals";

// Mock navigation module
let mockLoadPage = jest.fn();
let mockGoBack = jest.fn();
let mockGoForward = jest.fn();
let historyStack = [];
let currentIndex = -1;

// Mock file system access for JSDOM
const mockHtmlFiles = {
  "html/page1.html": "<html><body>Page 1 Content</body></html>",
  "html/page2.html": "<html><body>Page 2 Content</body></html>",
  "html/page3.html": "<html><body>Page 3 Content</body></html>",
};

describe("Navigation Flow Tests", () => {
  let fetchSpy;

  beforeEach(() => {
    // Reset mocks and state before each test
    jest.clearAllMocks();

    // Mock global.fetch for this test suite
    fetchSpy = jest.spyOn(global, "fetch").mockImplementation((url) => {
      if (mockHtmlFiles[url]) {
        return Promise.resolve({
          ok: true,
          text: async () => mockHtmlFiles[url],
        });
      } else {
        return Promise.reject(new Error("Network error: File not found"));
      }
    });

    historyStack = ["html/page1.html", "html/page2.html", "html/page3.html"];
    currentIndex = 2;

    document.body.innerHTML = '<div id="page-content"></div>';

    mockLoadPage.mockImplementation(async (url) => {
      const container = document.getElementById("page-content");
      try {
        const res = await fetch(url);
        const html = await res.text();
        container.innerHTML = html;
      } catch (error) {
        container.innerHTML = `<p>Failed to load page: ${url}</p>`;
      }
    });

    mockGoBack.mockImplementation(async () => {
      if (currentIndex > 0) {
        currentIndex--;
        await mockLoadPage(historyStack[currentIndex]);
      }
    });

    mockGoForward.mockImplementation(async () => {
      if (currentIndex < historyStack.length - 1) {
        currentIndex++;
        await mockLoadPage(historyStack[currentIndex]);
      }
    });
  });

  afterEach(() => {
    fetchSpy.mockRestore(); // Restore original fetch after each test
  });

  it("should navigate back and forward correctly", async () => {
    // Initial state
    await mockLoadPage(historyStack[currentIndex]);
    expect(document.getElementById("page-content").innerHTML).toContain(
      "Page 3 Content",
    );

    // Go back
    await mockGoBack();
    expect(document.getElementById("page-content").innerHTML).toContain(
      "Page 2 Content",
    );
    expect(currentIndex).toBe(1);

    // Go back again
    await mockGoBack();
    expect(document.getElementById("page-content").innerHTML).toContain(
      "Page 1 Content",
    );
    expect(currentIndex).toBe(0);

    // Go forward
    await mockGoForward();
    expect(document.getElementById("page-content").innerHTML).toContain(
      "Page 2 Content",
    );
    expect(currentIndex).toBe(1);

    // Go forward again
    await mockGoForward();
    expect(document.getElementById("page-content").innerHTML).toContain(
      "Page 3 Content",
    );
    expect(currentIndex).toBe(2);
  });

  it("should not go back past the beginning of the history", async () => {
    currentIndex = 0;
    await mockLoadPage(historyStack[currentIndex]);
    expect(document.getElementById("page-content").innerHTML).toContain(
      "Page 1 Content",
    );

    // Try to go back
    await mockGoBack();
    expect(document.getElementById("page-content").innerHTML).toContain(
      "Page 1 Content",
    );
    expect(currentIndex).toBe(0);
  });

  it("should not go forward past the end of the history", async () => {
    currentIndex = 2;
    await mockLoadPage(historyStack[currentIndex]);
    expect(document.getElementById("page-content").innerHTML).toContain(
      "Page 3 Content",
    );

    // Try to go forward
    await mockGoForward();
    expect(document.getElementById("page-content").innerHTML).toContain(
      "Page 3 Content",
    );
    expect(currentIndex).toBe(2);
  });
});
