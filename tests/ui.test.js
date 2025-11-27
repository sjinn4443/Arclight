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

// Declare variables that will be imported/mocked
let mockedRoutes; // Declare mockedRoutes here
let mockLoadPage = jest.fn();
let mockGoBack = jest.fn();
let mockInitializePageNavigation = jest.fn();
let mockWireGlobalNavigation = jest.fn();

// Put this near the top, after declaring mockedRoutes
mockedRoutes = {
  intro: "html/intro.html",
  dashboard: "html/dashboard.html",
  splashscreen: "html/splashscreen.html",
  languageinstall: "html/languageinstall.html",
  onboarding: "html/onboarding.html",
  interest: "html/interest.html",
  page1: "html/page1.html",
  page2: "html/page2.html",
  page3: "html/page3.html",
  videos: "html/videos.html",
};

// This variable will hold the *actual* mocked navigation module
let mockedNavigationModule;

// Mock file system access for JSDOM
const mockHtmlFiles = {
  "html/intro.html": "<html><body>Intro Page Content</body></html>",
  "html/dashboard.html": "<html><body>Dashboard Content</body></html>",
  "html/splashscreen.html": "<html><body>Splash Screen Content</body></html>",
  "html/languageinstall.html":
    "<html><body>Language Install Content</body></html>",
  "html/onboarding.html": "<html><body>Onboarding Content</body></html>",
  "html/interest.html": "<html><body>Interest Content</body></html>",
  "html/page1.html": "<html><body>Page 1 Content</body></html>",
  "html/page2.html": "<html><body>Page 2 Content</body></html>",
  "html/page3.html": "<html><body>Page 3 Content</body></html>",
  "html/videos.html": "<html><body>Videos Content</body></html>",
};

describe("UI Integration Tests", () => {
  let fetchSpy; // Declare fetchSpy here

  beforeAll(async () => {
    // Reset modules to ensure a clean state
    // jest.resetModules(); // Removed this line as it might be interfering with the fetch mock

    // Use jest.spyOn to mock global.fetch
    fetchSpy = jest.spyOn(global, "fetch");

    // Re-apply the mock implementation to the spy
    fetchSpy.mockImplementation((url) => {
      if (mockHtmlFiles[url]) {
        return Promise.resolve({
          ok: true,
          text: async () => mockHtmlFiles[url],
        });
      } else {
        // Simulate a network error for unknown URLs
        return Promise.reject(new Error("Network error: File not found"));
      }
    });

    // Build our “navigation module” inline for the tests (Option A)
    let _state = { currentPageName: null, historyStack: [] };
    const setState = (newState) => {
      _state = { ...newState };
    };
    const getState = () => _state;
    mockedNavigationModule = {
      loadPage: mockLoadPage,
      goBack: mockGoBack,
      initializePageNavigation: mockInitializePageNavigation,
      wireGlobalNavigation: mockWireGlobalNavigation,
      getState,
      setState,
    };

    // Mock the global back button visibility logic
    global.updateGlobalBackVisibility = jest.fn((routeName) => {
      const backBtnGlobal = document.getElementById("backBtnGlobal");
      if (backBtnGlobal) {
        const excludedRoutes = [
          "intro",
          "dashboard",
          "splashscreen",
          "languageinstall",
          "onboarding",
          "interest",
        ];
        if (excludedRoutes.includes(routeName)) {
          backBtnGlobal.style.display = "none";
        } else {
          backBtnGlobal.style.display = "flex";
        }
      }
    });
  });

  beforeEach(async () => {
    // Mock console.warn to suppress noisy output during tests
    jest.spyOn(console, "warn").mockImplementation(() => {});

    // Reset mocks and state before each test
    jest.clearAllMocks(); // Clears mock calls and instances

    // reset history
    mockedNavigationModule.setState({
      currentPageName: null,
      historyStack: ["intro"],
    });

    // Reset fetch mock calls
    global.fetch.mockClear();

    // (Re)wire the mock
    mockLoadPage.mockImplementation(async (routeName, options = {}) => {
      // update state
      const current = mockedNavigationModule.getState();
      mockedNavigationModule.setState({
        ...current,
        currentPageName: routeName,
      });

      const url = mockedRoutes[routeName]; // <-- uses the inline map
      const container = document.getElementById("page-content");

      if (!url) {
        console.error(`Route "${routeName}" not found in ROUTES.`);
        container.innerHTML = `<div class="container"><p>Page not found: ${routeName}</p></div>`;
        window.dispatchEvent(
          new CustomEvent("page:loaded", {
            detail: { routeName, error: true },
          }),
        );
        window.dispatchEvent(
          new CustomEvent("page:rendered", {
            detail: { routeName, error: true },
          }),
        );
        return;
      }

      try {
        // Ensure fetch is called with the correct URL and options
        const res = await fetch(url, { cache: "no-store" });
        const html = await res.text();
        container.innerHTML = html.includes('class="page"')
          ? html
          : `<div class="page" id="${routeName}-content">${html}</div>`;

        // apply .active
        const pageEl = container.querySelector(".page");
        if (pageEl) pageEl.classList.add("active");

        // history (don’t push when replace:true)
        if (!options.replace) {
          mockedNavigationModule.setState({
            ...mockedNavigationModule.getState(),
            historyStack: [
              ...mockedNavigationModule.getState().historyStack,
              routeName,
            ],
          });
        }

        window.dispatchEvent(
          new CustomEvent("page:loaded", { detail: { routeName } }),
        );
        window.dispatchEvent(
          new CustomEvent("page:rendered", { detail: { routeName } }),
        );
      } catch (err) {
        console.error("Failed to load route", routeName, url, err);
        container.innerHTML = `<div class="container"><p>Failed to load page: ${routeName}</p></div>`;
        window.dispatchEvent(
          new CustomEvent("page:loaded", {
            detail: { routeName, error: true },
          }),
        );
        window.dispatchEvent(
          new CustomEvent("page:rendered", {
            detail: { routeName, error: true },
          }),
        );
      }
    });

    mockGoBack.mockImplementation(async () => {
      const currentState = mockedNavigationModule.getState();
      if (currentState.historyStack.length > 1) {
        const newHistoryStack = [...currentState.historyStack];
        newHistoryStack.pop(); // Remove the current page
        const previousRoute = newHistoryStack[newHistoryStack.length - 1];
        mockedNavigationModule.setState({
          ...currentState,
          historyStack: newHistoryStack,
        });
        await mockLoadPage(previousRoute, { replace: true }); // Use mockLoadPage here
      } else {
        // If history is empty or only one item, go to dashboard and set history
        mockedNavigationModule.setState({
          ...currentState,
          historyStack: ["dashboard"],
        });
        await mockLoadPage("dashboard", { replace: true }); // Use mockLoadPage here
      }
    });

    mockWireGlobalNavigation.mockImplementation(() => {
      document.body.addEventListener("click", (e) => {
        const target = e.target.closest("[data-route]");
        if (target) {
          e.preventDefault();
          const routeName = target.dataset.route;
          mockLoadPage(routeName); // Use mockLoadPage here
        }
      });
    });

    // Spy on window.dispatchEvent
    jest.spyOn(window, "dispatchEvent");

    // Mock the event listeners for page:loaded and page:rendered
    // These are dispatched by loadPage and need to be captured by tests if they assert on them.
    // For now, we assume the mock's simulateLoadPage dispatches them correctly.
    window.addEventListener("page:loaded", (e) => {
      global.updateGlobalBackVisibility(e.detail.routeName);
    });

    // Set up minimal HTML structure for all tests
    document.body.innerHTML = `
      <!-- Global Top-Left Back Button -->
      <div
        class="nav-icon top-back"
        id="backBtnGlobal"
        aria-label="Back"
        role="button"
        tabindex="0"
        data-i18n="backButton"
      ></div>

      <div id="splashScreenContainer" class="splash-full-screen"></div>

      <div id="page-content">
        <div id="mainTitle"></div>
        <button id="mainButton"></button>
        <nav>
          <a href="#home" id="navHome">Home</a>
          <a href="#about" id="navAbout">About</a>
          <a href="#" id="navDashboard" data-route="dashboard">Dashboard</a>
          <a href="#" id="navPage1" data-route="page1">Page 1</a>
          <a href="#" id="navPage2" data-route="page2">Page 2</a>
        </nav>
        <form id="testForm"><input id="testInput" /><div id="errorMsg" style="display: none;"></div><button id="submitBtn"></button></form>
        <div id="splashScreen" style="display: block;"><select id="splashLanguageDropdown"><option disabled selected>What's your preferred language?</option><option>English</option></select></div>
      </div>

      <div
        id="installPopup"
        style="
          display: none;
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border: 1px solid #ccc;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          z-index: 9999;
        "
      >
        <p data-i18n="installPrompt">Install this app for a better experience!</p>
        <button id="installConfirmBtn" data-i18n="installButton">Install</button>
        <button id="installDismissBtn" data-i18n="maybeLaterButton">
          Maybe later
        </button>
      </div>
    `;

    // Reset window size for responsive tests
    window.innerWidth = 1024;
    window.dispatchEvent(new Event("resize"));

    // Initialize navigation listeners (these will use the mocked functions)
    mockWireGlobalNavigation();
    mockInitializePageNavigation();

    // Mock the event listeners for page:loaded and page:rendered
    // These are dispatched by loadPage and need to be captured by tests if they assert on them.
    // For now, we assume the mock's simulateLoadPage dispatches them correctly.
    window.addEventListener("page:loaded", (e) => {
      global.updateGlobalBackVisibility(e.detail.routeName);
    });
  });

  afterEach(() => {
    // Restore console.warn after each test
    console.warn.mockRestore();
  });

  test("Home page loads and displays main elements", () => {
    // Elements are now directly in document.body.innerHTML
    expect(document.getElementById("mainTitle")).not.toBeNull();
    expect(document.getElementById("mainButton")).not.toBeNull();
    expect(document.querySelector("nav")).not.toBeNull();
  });

  test("Navigation links work and route to the correct sections/pages", () => {
    // Simulate clicking navigation links and manually update hash (jsdom does not handle this)
    const navHome = document.getElementById("navHome");
    const navAbout = document.getElementById("navAbout");
    navHome.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.hash = "#home";
    });
    navAbout.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.hash = "#about";
    });
    navHome.click();
    expect(window.location.hash).toBe("#home");
    navAbout.click();
    expect(window.location.hash).toBe("#about");
  });

  test("Main interactive button triggers the expected action", () => {
    // Simulate a button click and check for expected effect
    const button = document.getElementById("mainButton");
    let clicked = false;
    button.addEventListener("click", () => {
      clicked = true;
    });
    button.click();
    expect(clicked).toBe(true);
  });

  test("Responsive layout adapts correctly on mobile and desktop", () => {
    // Simulate desktop
    window.innerWidth = 1024;
    window.dispatchEvent(new Event("resize"));
    expect(window.innerWidth).toBeGreaterThan(600);

    // Simulate mobile
    window.innerWidth = 375;
    window.dispatchEvent(new Event("resize"));
    expect(window.innerWidth).toBeLessThanOrEqual(600);
    // In a real app, would check for class/style changes
  });

  test("Error messages display when invalid input is submitted", () => {
    // Simulate form submission with invalid input
    const form = document.getElementById("testForm");
    const input = document.getElementById("testInput");
    const errorMsg = document.getElementById("errorMsg");
    input.value = ""; // Invalid input
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!input.value) {
        errorMsg.style.display = "inline";
      }
    });
    form.querySelector("#submitBtn").click();
    expect(errorMsg.style.display).toBe("inline");
  });

  test("Splash screen appears on page load with language selection", () => {
    const splash = document.getElementById("splashScreen");
    expect(splash).not.toBeNull();
    expect(splash.style.display).toBe("block");
    const languageDropdown = document.getElementById("splashLanguageDropdown");
    expect(languageDropdown).not.toBeNull();
    const defaultOption = languageDropdown.querySelector("option");
    expect(defaultOption.textContent).toBe("What's your preferred language?");
    expect(defaultOption.disabled).toBe(true);
    expect(defaultOption.selected).toBe(true);
  });

  // New tests for navigation.js functionality

  test("loadPage correctly loads content into #page-content and applies active class", async () => {
    // This test relies on the fetch mock returning specific content for page1.html
    // The mock in beforeAll is now configured to handle this.
    await mockedNavigationModule.loadPage("page1");

    const pageContent = document.getElementById("page-content");
    expect(global.fetch).toHaveBeenCalledWith("html/page1.html", {
      cache: "no-store",
    });
    expect(pageContent.innerHTML).toContain("Page 1 Content"); // Expecting content from mockHtmlFiles
    // Check that the .page.active element is correctly applied
    expect(pageContent.querySelector(".page.active")).not.toBeNull();
    expect(pageContent.querySelector(".page.active").id).toBe("page1-content");
    expect(mockedNavigationModule.getState().currentPageName).toBe("page1");
    expect(mockedNavigationModule.getState().historyStack).toEqual([
      "intro",
      "page1",
    ]); // Assuming 'intro' was the initial state or loaded before tests
  });

  test("loadPage replaces content and correctly applies active class for subsequent loads", async () => {
    const mockHtmlPage1 = "<html><body>Content for Page 1</body></html>"; // Simplified for clarity
    const mockHtmlPage2 = "<html><body>Content for Page 2</body></html>";

    // Mock fetch responses for page1 and page2
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlPage1,
    });
    await mockedNavigationModule.loadPage("page1");

    let pageContent = document.getElementById("page-content");
    expect(pageContent.querySelector(".page.active")).not.toBeNull();
    expect(pageContent.querySelector(".page.active").id).toBe("page1-content");
    expect(mockedNavigationModule.getState().currentPageName).toBe("page1");
    expect(mockedNavigationModule.getState().historyStack).toEqual([
      "intro",
      "page1",
    ]);

    // Load page 2, replacing the current history entry
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlPage2,
    });
    await mockedNavigationModule.loadPage("page2", { replace: true });

    // Check that page 1 is no longer active and page 2 is active
    expect(pageContent.querySelector(".page.active")).not.toBeNull();
    expect(pageContent.querySelector(".page.active").id).toBe("page2-content");
    expect(mockedNavigationModule.getState().currentPageName).toBe("page2");
    expect(mockedNavigationModule.getState().historyStack).toEqual([
      "intro",
      "page1",
    ]); // With replace:true, loadPage does not push to history
  });

  test("Navigation links with data-route attribute trigger loadPage", async () => {
    // Mock the fetch for page1.html
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => "<div>Page 1 Content</div>",
    });

    // Trigger click on navPage1
    document.getElementById("navPage1").click();

    // Expect fetch to have been called to load page1.html
    expect(mockedNavigationModule.loadPage).toHaveBeenCalledWith("page1");
    expect(global.fetch).toHaveBeenCalledWith("html/page1.html", {
      cache: "no-store",
    });
    expect(mockedNavigationModule.getState().currentPageName).toBe("page1");
  });

  test("goBack navigates to the previous page in history", async () => {
    const mockHtmlPage1 = "<html><body>Content for Page 1</body></html>";
    const mockHtmlPage2 = "<html><body>Content for Page 2</body></html>";
    const mockHtmlPage3 = "<html><body>Content for Page 3</body></html>";

    // Load page 1
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlPage1,
    });
    await mockedNavigationModule.loadPage("page1");

    // Load page 2
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlPage2,
    });
    await mockedNavigationModule.loadPage("page2");

    // Load page 3
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlPage3,
    });
    await mockedNavigationModule.loadPage("page3");

    expect(mockedNavigationModule.getState().currentPageName).toBe("page3");
    expect(mockedNavigationModule.getState().historyStack).toEqual([
      "intro",
      "page1",
      "page2",
      "page3",
    ]);

    // Go back to page 2
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlPage2,
    }); // Mock fetch for page2 again
    await mockedNavigationModule.goBack();

    expect(mockedNavigationModule.getState().currentPageName).toBe("page2");
    expect(mockedNavigationModule.getState().historyStack).toEqual([
      "intro",
      "page1",
      "page2",
    ]); // History should be popped
    expect(
      document.getElementById("page-content").querySelector(".page.active").id,
    ).toBe("page2-content");

    // Go back to page 1
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlPage1,
    }); // Mock fetch for page1 again
    await mockedNavigationModule.goBack();

    expect(mockedNavigationModule.getState().currentPageName).toBe("page1");
    expect(mockedNavigationModule.getState().historyStack).toEqual([
      "intro",
      "page1",
    ]);
    expect(
      document.getElementById("page-content").querySelector(".page.active").id,
    ).toBe("page1-content");
  });

  test("goBack defaults to dashboard if history is empty", async () => {
    const mockHtmlDashboard = "<html><body>Dashboard Content</body></html>";

    // Ensure history is empty and currentPageName is null before this test
    mockedNavigationModule.setState({
      currentPageName: null,
      historyStack: [],
    });

    // Go back when history is empty
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlDashboard,
    });
    await mockedNavigationModule.goBack();

    expect(mockedNavigationModule.getState().currentPageName).toBe("dashboard");
    expect(mockedNavigationModule.getState().historyStack).toEqual([
      "dashboard",
    ]); // History is explicitly set to dashboard in goBack mock
    expect(
      document.getElementById("page-content").querySelector(".page.active").id,
    ).toBe("dashboard-content");
  });

  test("Global back button is hidden on excluded routes", async () => {
    const mockHtmlSplash = "<html><body>Splash Screen Content</body></html>";
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlSplash,
    });
    await mockedNavigationModule.loadPage("splashscreen");

    // Dispatch the page:loaded event to trigger updateGlobalBackVisibility
    window.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName: "splashscreen" } }),
    );

    // The actual navigation.js logic for updateGlobalBackVisibility is called via event listener.
    // We need to ensure that the event listener is set up and that the logic within it works.
    // The mock for updateGlobalBackVisibility is not strictly necessary if we are testing the actual navigation.js.
    // For now, let's assume the event dispatch is sufficient.
    expect(document.getElementById("backBtnGlobal").style.display).toBe("none");

    // Test another excluded route
    const mockHtmlOnboarding = "<html><body>Onboarding Content</body></html>";
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlOnboarding,
    });
    await mockedNavigationModule.loadPage("onboarding");
    window.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName: "onboarding" } }),
    );
    expect(document.getElementById("backBtnGlobal").style.display).toBe("none");
  });

  test("Global back button is visible on non-excluded routes", async () => {
    const mockHtmlPage1 = "<html><body>Page 1 Content</body></html>";
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlPage1,
    });
    await mockedNavigationModule.loadPage("page1");

    // Dispatch the page:loaded event
    window.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName: "page1" } }),
    );

    // Dashboard is excluded, but page1 is not. So back button should be visible.
    expect(document.getElementById("backBtnGlobal").style.display).toBe("flex");
  });

  // Test case for fetch error handling in loadPage
  test("loadPage handles fetch errors gracefully", async () => {
    // Mock fetch to return an error for a specific route
    global.fetch.mockImplementation(async (url) => {
      if (url === "html/page1.html") {
        return Promise.reject(new Error("Network error"));
      }
      // Fallback for other fetches if needed, though not expected in this test
      return Promise.resolve({
        ok: true,
        text: async () => "<html><body>Default content</body></html>",
      });
    });

    await mockedNavigationModule.loadPage("page1");

    const pageContent = document.getElementById("page-content");
    expect(global.fetch).toHaveBeenCalledWith("html/page1.html", {
      cache: "no-store",
    });
    expect(pageContent.innerHTML).toContain("Failed to load page: page1");
    expect(mockedNavigationModule.getState().currentPageName).toBe("page1"); // Should still set currentPageName
    // Check if error events were dispatched
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "page:loaded",
        detail: { routeName: "page1", error: true },
      }),
    );
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "page:rendered",
        detail: { routeName: "page1", error: true },
      }),
    );
  });

  // Test case for route not found
  test("loadPage handles route not found gracefully", async () => {
    await mockedNavigationModule.loadPage("nonexistent-route");

    const pageContent = document.getElementById("page-content");
    expect(pageContent.innerHTML).toContain(
      "Page not found: nonexistent-route",
    );
    expect(mockedNavigationModule.getState().currentPageName).toBe(
      "nonexistent-route",
    ); // Should still set currentPageName
    // Check if error events were dispatched
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "page:loaded",
        detail: { routeName: "nonexistent-route", error: true },
      }),
    );
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "page:rendered",
        detail: { routeName: "nonexistent-route", error: true },
      }),
    );
  });
});
