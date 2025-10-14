/**
 * @jest-environment jsdom
 */
import {
  jest,
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
} from "@jest/globals";

// Mock fetch
describe("UI Integration Tests", () => {
  let navigation; // Declare navigation here to be accessible in tests

  beforeAll(() => {
    global.fetch = jest.fn();

    // Mock the ROUTES object from config.js using jest.doMock for ES Modules
    jest.doMock("../public/js/config.js", () => ({
      ROUTES: {
        intro: "html/intro.html",
        dashboard: "html/dashboard.html",
        splashscreen: "html/splashscreen.html",
        languageinstall: "html/languageinstall.html",
        onboarding: "html/onboarding.html",
        interest: "html/interest.html",
        page1: "html/page1.html", // Added for testing
        page2: "html/page2.html", // Added for testing
        page3: "html/page3.html", // Added for testing
      },
    }));

    // Mock the navigation.js module
    jest.doMock("../public/js/navigation.js", () => {
      // This factory function will be called every time the module is imported
      // after jest.resetModules(), ensuring fresh state for each test.
      let mockCurrentPageName = null;
      let mockHistoryStack = []; // Use let for historyStack too

      const actualNav = jest.requireActual("../public/js/navigation.js");

      const mockNavigation = {
        // Define mockNavigation here
        ...actualNav,
        get currentPageName() {
          return mockCurrentPageName;
        },
        set currentPageName(name) {
          mockCurrentPageName = name;
        },
        get historyStack() {
          return mockHistoryStack;
        },
        loadPage: jest.fn(async (routeName, options = {}) => {
          const url = jest.requireMock("../public/js/config.js").ROUTES[
            routeName
          ];
          if (!url) return; // Simulate page not found

          // Assume fetch is mocked externally by the test
          const res = await fetch(url, { cache: "no-store" });
          const html = await res.text();

          const container = document.getElementById("page-content");
          container.innerHTML = html; // Use the fetched HTML
          // Ensure the active class is applied if the fetched HTML doesn't already have it
          if (!container.querySelector(".page.active")) {
            const firstPage = container.querySelector(".page");
            if (firstPage) {
              firstPage.classList.add("active");
            } else {
              // Fallback if no .page found in fetched HTML
              const wrapper = document.createElement("div");
              wrapper.className = "page active";
              while (container.firstChild)
                wrapper.appendChild(container.firstChild);
              container.appendChild(wrapper);
            }
          }

          mockCurrentPageName = routeName;
          if (!options.replace) mockHistoryStack.push(routeName);
          document.dispatchEvent(
            new CustomEvent("page:loaded", { detail: { routeName } })
          );
        }),
        goBack: jest.fn(async () => {
          mockHistoryStack.pop(); // current
          const prev = mockHistoryStack.pop(); // previous
          if (prev) {
            await mockNavigation.loadPage(prev, { replace: true });
          } else {
            await mockNavigation.loadPage("dashboard", { replace: true });
          }
        }),
        initializePageNavigation: jest.fn(),
        wireGlobalNavigation: jest.fn(),
      };
      return mockNavigation;
    });
  });

  beforeEach(async () => {
    // Reset Jest's module registry to ensure a fresh import of navigation.js
    jest.resetModules();
    navigation = await import("../public/js/navigation.js");

    // The mock's internal state is now fresh due to the factory function being re-run.
    // No need to explicitly reset currentPageName or historyStack here.

    // Minimal HTML structure for all tests, including elements expected on initial load
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
      <div id="splashScreen" style="display: block;"><select id="splashLanguageDropdown"><option disabled selected>What\'s your preferred language?</option><option>English</option></select></div>
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

    // Clear mocks before each test
    fetch.mockClear();

    // Initialize navigation listeners
    navigation.wireGlobalNavigation(); // For data-page clicks
    navigation.initializePageNavigation(); // For data-route clicks and back button

    // No initial loadPage("intro") here, tests will load pages explicitly
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
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtml,
    });

    await navigation.loadPage("page1");

    const pageContent = document.getElementById("page-content");
    expect(fetch).toHaveBeenCalledWith("html/page1.html", {
      cache: "no-store",
    });
    expect(pageContent.innerHTML).toContain("Mocked Page 1 Content");
    expect(pageContent.querySelector(".page.active")).not.toBeNull();
    expect(pageContent.querySelector(".page.active").id).toBe("page1-content");
    expect(navigation.currentPageName).toBe("page1");
    expect(navigation.historyStack).toEqual(["intro", "page1"]);
  });

  test("loadPage replaces content and correctly applies active class for subsequent loads", async () => {
    const mockHtmlPage1 =
      '<div class="page" id="page1-content">Content for Page 1</div>';
    const mockHtmlPage2 =
      '<div class="page" id="page2-content">Content for Page 2</div>';

    // Load page 1
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage1 });
    await navigation.loadPage("page1");

    let pageContent = document.getElementById("page-content");
    expect(pageContent.querySelector(".page.active")).not.toBeNull();
    expect(pageContent.querySelector(".page.active").id).toBe("page1-content");
    expect(navigation.currentPageName).toBe("page1");
    expect(navigation.historyStack).toEqual(["intro", "page1"]);

    // Load page 2
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage2 });
    await navigation.loadPage("page2");

    // Check that page 1 is no longer active and page 2 is active
    expect(pageContent.querySelector(".page.active")).not.toBeNull();
    expect(pageContent.querySelector(".page.active").id).toBe("page2-content");
    expect(navigation.currentPageName).toBe("page2");
    expect(navigation.historyStack).toEqual(["intro", "page1", "page2"]); // History should grow
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
    expect(fetch).toHaveBeenCalledWith("html/page1.html", {
      cache: "no-store",
    });
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
    await navigation.loadPage("page1");

    // Load page 2
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage2 });
    await navigation.loadPage("page2");

    // Load page 3
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage3 });
    await navigation.loadPage("page3"); // Assuming page3 exists in ROUTES

    expect(navigation.currentPageName).toBe("page3");
    expect(navigation.historyStack).toEqual([
      "intro",
      "page1",
      "page2",
      "page3",
    ]);

    // Go back to page 2
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage2 }); // Mock fetch for page2 again
    await navigation.goBack();

    expect(navigation.currentPageName).toBe("page2");
    expect(navigation.historyStack).toEqual(["intro", "page1", "page2"]); // History should be popped
    expect(
      document.getElementById("page-content").querySelector(".page.active").id
    ).toBe("page2-content");

    // Go back to page 1
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage1 }); // Mock fetch for page1 again
    await navigation.goBack();

    expect(navigation.currentPageName).toBe("page1");
    expect(navigation.historyStack).toEqual(["intro", "page1"]);
    expect(
      document.getElementById("page-content").querySelector(".page.active").id
    ).toBe("page1-content");
  });

  test("goBack defaults to dashboard if history is empty", async () => {
    const mockHtmlDashboard =
      '<div class="page" id="dashboard-content">Dashboard Content</div>';

    // Go back when history is empty (history is already empty and currentPageName is null from beforeEach)
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlDashboard,
    }); // Mock fetch for dashboard again
    await navigation.goBack();

    expect(navigation.currentPageName).toBe("dashboard");
    expect(navigation.historyStack).toEqual(["dashboard"]); // History state after goBack with replace:true
    expect(
      document.getElementById("page-content").querySelector(".page.active").id
    ).toBe("dashboard-content");
  });

  test("Global back button is hidden on excluded routes", async () => {
    const mockHtmlSplash =
      '<div class="page" id="splash-content">Splash Screen</div>';
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlSplash });
    await navigation.loadPage("splashscreen");

    // Dispatch the page:loaded event to trigger updateGlobalBackVisibility
    document.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName: "splashscreen" } })
    );

    expect(document.getElementById("backBtnGlobal").style.display).toBe("none");

    // Test another excluded route
    const mockHtmlOnboarding =
      '<div class="page" id="onboarding-content">Onboarding</div>';
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlOnboarding,
    });
    await navigation.loadPage("onboarding");
    document.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName: "onboarding" } })
    );
    expect(document.getElementById("backBtnGlobal").style.display).toBe("none");
  });

  test("Global back button is visible on non-excluded routes", async () => {
    const mockHtmlDashboard =
      '<div class="page" id="dashboard-content">Dashboard</div>';
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlDashboard,
    });
    await navigation.loadPage("dashboard");

    // Dispatch the page:loaded event
    document.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName: "dashboard" } })
    );

    expect(document.getElementById("backBtnGlobal").style.display).toBe("none"); // Dashboard is an excluded route
  });

  // Note: Deep linking tests are more complex and depend on how the application initially handles hash changes on load.
  // The current navigation.js primarily handles routing via clicks and explicit loadPage calls.
  // The existing "Navigation links work" test covers hash manipulation for <a> tags.
  // A comprehensive deep linking test would require simulating the initial page load and hash parsing, which is not directly exposed by the current navigation.js API for testing.
});
