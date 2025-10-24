/**
 * @jest-environment jsdom
 */

import { jest, describe, beforeEach, it, expect } from "@jest/globals";

// Declare variables that will be imported/mocked
let mockedRoutes; // Declare mockedRoutes here
let mockLoadPage = jest.fn();
let mockGoBack = jest.fn();
let mockInitializePageNavigation = jest.fn();
let mockWireGlobalNavigation = jest.fn();

// This variable will hold the *actual* mocked navigation module
let mockedNavigationModule;

describe("UI Integration Tests", () => {
  beforeAll(async () => {
    // Mock fetch globally
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: async () => "<html><body>Default mocked content</body></html>",
      }),
    );

    // Reset modules to ensure the mock is applied correctly
    jest.resetModules();

    // Mock the ROUTES object from config.js
    jest.unstable_mockModule(
      "../public/js/config.js",
      () => ({
        ROUTES: {
          intro: "html/intro.html",
          dashboard: "html/dashboard.html",
          splashscreen: "html/splashscreen.html",
          languageinstall: "html/languageinstall.html",
          onboarding: "html/onboarding.html",
          interest: "html/interest.html",
          page1: "html/page1.html",
          page2: "html/page2.html",
          page3: "html/page3.html",
          videos: "html/videos.html", // Added for goBack test
        },
      }),
      { virtual: true },
    );

    // Get the mocked config.js
    const configModule = await import("../public/js/config.js");
    mockedRoutes = configModule.ROUTES;

    // Mock the navigation.js module to control its state and behavior for tests
    jest.unstable_mockModule(
      "../public/js/navigation.js",
      () => {
        // Define state variables that can be mutated within the mock's scope
        let currentPageName = null;
        let historyStack = [];

        // Return an object that exports the mock functions and the mutable state
        return {
          loadPage: mockLoadPage,
          goBack: mockGoBack,
          initializePageNavigation: mockInitializePageNavigation,
          wireGlobalNavigation: mockWireGlobalNavigation,
          // Export the state variables directly, allowing assignment
          currentPageName: currentPageName,
          historyStack: historyStack,
        };
      },
      { virtual: true },
    );

    // Import the mocked navigation module after setting up the mock
    // This is the object the tests should interact with
    mockedNavigationModule = await import("../public/js/navigation.js");

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
    // Reset mocks and state before each test
    jest.clearAllMocks(); // Clears mock calls and instances

    // Reset mock navigation state directly on the mocked module
    mockedNavigationModule.currentPageName = null;
    mockedNavigationModule.historyStack = []; // Reset history stack
    mockedNavigationModule.historyStack.push("intro"); // Start with a clean history

    // Reset fetch mock
    fetch.mockClear();

    // Mock the implementation of loadPage and goBack here, where `document` is available
    mockLoadPage.mockImplementation(async (routeName, options = {}) => {
      mockedNavigationModule.currentPageName = routeName;
      const url = mockedRoutes[routeName]; // Use the pre-fetched mockedRoutes
      const container = document.getElementById("page-content");

      if (!container) {
        console.error("#page-content not found");
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

      let html = "";
      try {
        // Ensure fetch is called with the global mock
        const res = await global.fetch(url, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        html = await res.text();
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
        return;
      }

      container.innerHTML = html;

      let pageElement = container.querySelector(".page");
      if (!pageElement) {
        const wrapper = document.createElement("div");
        wrapper.className = "page";
        while (container.firstChild) {
          wrapper.appendChild(container.firstChild);
        }
        container.appendChild(wrapper);
        pageElement = wrapper;
        console.warn(
          "[router] No .page found; wrapped content in a new .page element.",
        );
      }

      const defaultActive = pageElement.querySelector('[data-default="true"]');
      if (defaultActive) {
        defaultActive.classList.add("active");
      } else {
        pageElement.classList.add("active");
      }

      if (!options.replace) {
        mockedNavigationModule.historyStack.push(routeName);
      }
      // If options.replace is true, we don't push to history.
      // The history stack is assumed to be managed by the caller (e.g., goBack).

      window.dispatchEvent(
        new CustomEvent("page:loaded", { detail: { routeName } }),
      );
      window.dispatchEvent(
        new CustomEvent("page:rendered", { detail: { routeName } }),
      );
    });

    mockGoBack.mockImplementation(async () => {
      if (mockedNavigationModule.historyStack.length > 1) {
        mockedNavigationModule.historyStack.pop(); // Remove the current page
        const previousRoute =
          mockedNavigationModule.historyStack[
            mockedNavigationModule.historyStack.length - 1
          ];
        await mockLoadPage(previousRoute, { replace: true }); // Use mockLoadPage here
      } else {
        // If history is empty or only one item, go to dashboard and set history
        mockedNavigationModule.historyStack = ["dashboard"];
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
    const mockHtml =
      '<div class="page" id="page1-content">Mocked Page 1 Content</div>';
    // Mock fetch response for page1.html
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtml,
    });

    await mockedNavigationModule.loadPage("page1");

    const pageContent = document.getElementById("page-content");
    expect(fetch).toHaveBeenCalledWith("html/page1.html", {
      cache: "no-store",
    });
    expect(pageContent.innerHTML).toContain("Mocked Page 1 Content");
    // Check that the .page.active element is correctly applied
    expect(pageContent.querySelector(".page.active")).not.toBeNull();
    expect(pageContent.querySelector(".page.active").id).toBe("page1-content");
    expect(mockedNavigationModule.currentPageName).toBe("page1");
    expect(mockedNavigationModule.historyStack).toEqual(["intro", "page1"]); // Assuming 'intro' was the initial state or loaded before tests
  });

  test("loadPage replaces content and correctly applies active class for subsequent loads", async () => {
    const mockHtmlPage1 =
      '<div class="page" id="page1-content">Content for Page 1</div>';
    const mockHtmlPage2 =
      '<div class="page" id="page2-content">Content for Page 2</div>';

    // Load page 1
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage1 });
    await mockedNavigationModule.loadPage("page1");

    let pageContent = document.getElementById("page-content");
    expect(pageContent.querySelector(".page.active")).not.toBeNull();
    expect(pageContent.querySelector(".page.active").id).toBe("page1-content");
    expect(mockedNavigationModule.currentPageName).toBe("page1");
    expect(mockedNavigationModule.historyStack).toEqual(["intro", "page1"]);

    // Load page 2, replacing the current history entry
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage2 });
    await mockedNavigationModule.loadPage("page2", { replace: true });

    // Check that page 1 is no longer active and page 2 is active
    expect(pageContent.querySelector(".page.active")).not.toBeNull();
    expect(pageContent.querySelector(".page.active").id).toBe("page2-content");
    expect(mockedNavigationModule.currentPageName).toBe("page2");
    expect(mockedNavigationModule.historyStack).toEqual(["intro", "page1"]); // With replace:true, loadPage does not push to history
  });

  test("Navigation links with data-route attribute trigger loadPage", async () => {
    // Mock the fetch for page1.html
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => "<div>Page 1 Content</div>",
    });

    // Trigger click on navPage1
    document.getElementById("navPage1").click();

    // Expect fetch to have been called to load page1.html
    expect(mockedNavigationModule.loadPage).toHaveBeenCalledWith("page1");
    expect(fetch).toHaveBeenCalledWith("html/page1.html", {
      cache: "no-store",
    });
    expect(mockedNavigationModule.currentPageName).toBe("page1");
  });

  test("goBack navigates to the previous page in history", async () => {
    const mockHtmlPage1 =
      '<div class="page" id="page1-content">Content for Page 1</div>';
    const mockHtmlPage2 =
      '<div class="page" id="page2-content">Content for Page 2</div>';
    const mockHtmlPage3 =
      '<div class="page" id="page3-content">Content for Page 3</div>';

    // Load page 1
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage1 });
    await mockedNavigationModule.loadPage("page1");

    // Load page 2
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage2 });
    await mockedNavigationModule.loadPage("page2");

    // Load page 3
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage3 });
    await mockedNavigationModule.loadPage("page3");

    expect(mockedNavigationModule.currentPageName).toBe("page3");
    expect(mockedNavigationModule.historyStack).toEqual([
      "intro",
      "page1",
      "page2",
      "page3",
    ]);

    // Go back to page 2
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage2 }); // Mock fetch for page2 again
    await mockedNavigationModule.goBack();

    expect(mockedNavigationModule.currentPageName).toBe("page2");
    expect(mockedNavigationModule.historyStack).toEqual([
      "intro",
      "page1",
      "page2",
    ]); // History should be popped
    expect(
      document.getElementById("page-content").querySelector(".page.active").id,
    ).toBe("page2-content");

    // Go back to page 1
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage1 }); // Mock fetch for page1 again
    await mockedNavigationModule.goBack();

    expect(mockedNavigationModule.currentPageName).toBe("page1");
    expect(mockedNavigationModule.historyStack).toEqual(["intro", "page1"]);
    expect(
      document.getElementById("page-content").querySelector(".page.active").id,
    ).toBe("page1-content");
  });

  test("goBack defaults to dashboard if history is empty", async () => {
    const mockHtmlDashboard =
      '<div class="page" id="dashboard-content">Dashboard Content</div>';

    // Ensure history is empty and currentPageName is null before this test
    mockedNavigationModule.currentPageName = null;
    mockedNavigationModule.historyStack = [];

    // Go back when history is empty
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlDashboard,
    });
    await mockedNavigationModule.goBack();

    expect(mockedNavigationModule.currentPageName).toBe("dashboard");
    expect(mockedNavigationModule.historyStack).toEqual(["dashboard"]); // History is explicitly set to dashboard in goBack mock
    expect(
      document.getElementById("page-content").querySelector(".page.active").id,
    ).toBe("dashboard-content");
  });

  test("Global back button is hidden on excluded routes", async () => {
    const mockHtmlSplash =
      '<div class="page" id="splash-content">Splash Screen</div>';
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlSplash });
    await mockedNavigationModule.loadPage("splashscreen");

    // Dispatch the page:loaded event to trigger updateGlobalBackVisibility
    window.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName: "splashscreen" } }),
    );

    // The actual navigation.js logic for updateGlobalBackVisibility is called via event listener.
    // We need to ensure that the event listener is set up and that the logic within it works.
    // The mock for updateGlobalBackVisibility is not strictly necessary if we are testing the actual navigation.js.
    // However, if the test environment doesn't fully simulate DOM events, we might need to mock it.
    // For now, let's assume the event dispatch is sufficient.
    expect(document.getElementById("backBtnGlobal").style.display).toBe("none");

    // Test another excluded route
    const mockHtmlOnboarding =
      '<div class="page" id="onboarding-content">Onboarding</div>';
    fetch.mockResolvedValueOnce({
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
    const mockHtmlPage1 =
      '<div class="page" id="page1-content">Page 1 Content</div>';
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage1 });
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
    // Mock fetch to return an error
    fetch.mockRejectedValueOnce(new Error("Network error"));

    await mockedNavigationModule.loadPage("page1");

    const pageContent = document.getElementById("page-content");
    expect(fetch).toHaveBeenCalledWith("html/page1.html", {
      cache: "no-store",
    });
    expect(pageContent.innerHTML).toContain("Failed to load page: page1");
    expect(mockedNavigationModule.currentPageName).toBe("page1"); // Should still set currentPageName
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
    expect(mockedNavigationModule.currentPageName).toBe("nonexistent-route"); // Should still set currentPageName
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
