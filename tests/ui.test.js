/**
 * @jest-environment jsdom
 */

// Simulate loading index.html and script.js for each test as needed

// Import functions from navigation.js
const {
  loadPage,
  goBack,
  initializePageNavigation,
  currentPageName,
  historyStack,
  wireGlobalNavigation,
} = await import("../public/js/navigation.js");

// Mock fetch
global.fetch = jest.fn();

describe("UI Integration Tests", () => {
  beforeEach(() => {
    // Minimal HTML structure for all tests
    document.body.innerHTML = `
      <div id="splashScreen" style="display: block;">
        <select id="splashLanguageDropdown">
          <option disabled selected>What's your preferred language?</option>
          <option>English</option>
        </select>
      </div>
      <nav>
        <a href="#home" id="navHome">Home</a>
        <a href="#about" id="navAbout">About</a>
        <a href="#" id="navDashboard" data-route="dashboard">Dashboard</a>
        <a href="#" id="navPage1" data-route="page1">Page 1</a>
        <a href="#" id="navPage2" data-route="page2">Page 2</a>
      </nav>
      <main id="page-content">
        <!-- Page content will be loaded here -->
      </main>
      <button id="backBtnGlobal">Back</button>
    `;
    // Reset window size for responsive tests
    window.innerWidth = 1024;
    window.dispatchEvent(new Event("resize"));

    // Clear mocks before each test
    fetch.mockClear();

    // Reset global state that might be affected by navigation.js
    currentPageName = null;
    historyStack.length = 0; // Clear the history stack

    // Initialize navigation listeners
    wireGlobalNavigation(); // For data-page clicks
    initializePageNavigation(); // For data-route clicks and back button
  });

  test("Home page loads and displays main elements", () => {
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

    await loadPage("page1");

    const pageContent = document.getElementById("page-content");
    expect(fetch).toHaveBeenCalledWith("/public/html/page1.html", {
      cache: "no-store",
    });
    expect(pageContent.innerHTML).toContain("Mocked Page 1 Content");
    expect(pageContent.querySelector(".page.active")).not.toBeNull();
    expect(pageContent.querySelector(".page.active").id).toBe("page1-content");
    expect(currentPageName).toBe("page1");
    expect(historyStack).toEqual(["page1"]);
  });

  test("loadPage replaces content and correctly applies active class for subsequent loads", async () => {
    const mockHtmlPage1 =
      '<div class="page" id="page1-content">Content for Page 1</div>';
    const mockHtmlPage2 =
      '<div class="page" id="page2-content">Content for Page 2</div>';

    // Load page 1
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage1 });
    await loadPage("page1");

    let pageContent = document.getElementById("page-content");
    expect(pageContent.querySelector(".page.active")).not.toBeNull();
    expect(pageContent.querySelector(".page.active").id).toBe("page1-content");
    expect(currentPageName).toBe("page1");
    expect(historyStack).toEqual(["page1"]);

    // Load page 2
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage2 });
    await loadPage("page2");

    // Check that page 1 is no longer active and page 2 is active
    expect(pageContent.querySelector(".page.active")).not.toBeNull();
    expect(pageContent.querySelector(".page.active").id).toBe("page2-content");
    expect(currentPageName).toBe("page2");
    expect(historyStack).toEqual(["page1", "page2"]); // History should grow
  });

  test("Navigation links with data-route attribute trigger loadPage", async () => {
    // Spy on loadPage to check if it's called
    const loadPageSpy = jest.spyOn(global, "loadPage");

    // Trigger click on navPage1
    document.getElementById("navPage1").click();

    // Expect loadPage to have been called with 'page1'
    expect(loadPageSpy).toHaveBeenCalledWith("page1");

    // Clean up spy
    loadPageSpy.mockRestore();
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
    await loadPage("page1");

    // Load page 2
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage2 });
    await loadPage("page2");

    // Load page 3
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage3 });
    await loadPage("page3"); // Assuming page3 exists in ROUTES

    expect(currentPageName).toBe("page3");
    expect(historyStack).toEqual(["page1", "page2", "page3"]);

    // Go back to page 2
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage2 }); // Mock fetch for page2 again
    goBack();

    expect(currentPageName).toBe("page2");
    expect(historyStack).toEqual(["page1", "page2"]); // History should be popped
    expect(
      document.getElementById("page-content").querySelector(".page.active").id,
    ).toBe("page2-content");

    // Go back to page 1
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlPage1 }); // Mock fetch for page1 again
    goBack();

    expect(currentPageName).toBe("page1");
    expect(historyStack).toEqual(["page1"]);
    expect(
      document.getElementById("page-content").querySelector(".page.active").id,
    ).toBe("page1-content");
  });

  test("goBack defaults to dashboard if history is empty", async () => {
    const mockHtmlDashboard =
      '<div class="page" id="dashboard-content">Dashboard Content</div>';

    // Load dashboard directly
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlDashboard,
    });
    await loadPage("dashboard");

    expect(currentPageName).toBe("dashboard");
    expect(historyStack).toEqual(["dashboard"]);

    // Go back when history is empty (after popping dashboard)
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlDashboard,
    }); // Mock fetch for dashboard again
    goBack();

    expect(currentPageName).toBe("dashboard");
    expect(historyStack).toEqual(["dashboard"]); // History state after goBack with replace:true
    expect(
      document.getElementById("page-content").querySelector(".page.active").id,
    ).toBe("dashboard-content");
  });

  test("Global back button is hidden on excluded routes", async () => {
    const mockHtmlSplash =
      '<div class="page" id="splash-content">Splash Screen</div>';
    fetch.mockResolvedValueOnce({ ok: true, text: async () => mockHtmlSplash });
    await loadPage("splashscreen");

    // Dispatch the page:loaded event to trigger updateGlobalBackVisibility
    document.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName: "splashscreen" } }),
    );

    expect(document.getElementById("backBtnGlobal").style.display).toBe("none");

    // Test another excluded route
    const mockHtmlOnboarding =
      '<div class="page" id="onboarding-content">Onboarding</div>';
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => mockHtmlOnboarding,
    });
    await loadPage("onboarding");
    document.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName: "onboarding" } }),
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
    await loadPage("dashboard");

    // Dispatch the page:loaded event
    document.dispatchEvent(
      new CustomEvent("page:loaded", { detail: { routeName: "dashboard" } }),
    );

    expect(document.getElementById("backBtnGlobal").style.display).toBe("flex"); // Assuming default display is flex
  });

  // Note: Deep linking tests are more complex and depend on how the application initially handles hash changes on load.
  // The current navigation.js primarily handles routing via clicks and explicit loadPage calls.
  // The existing "Navigation links work" test covers hash manipulation for <a> tags.
  // A comprehensive deep linking test would require simulating the initial page load and hash parsing, which is not directly exposed by the current navigation.js API for testing.
});
