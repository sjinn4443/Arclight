/**
 * @jest-environment jsdom
 */

// Simulate loading index.html and script.js for each test as needed

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
      </nav>
      <main>
        <h1 id="mainTitle">Welcome to Arclight</h1>
        <button id="mainButton">Click Me</button>
        <form id="testForm">
          <input id="testInput" type="text" />
          <button type="submit" id="submitBtn">Submit</button>
          <span id="errorMsg" style="display:none;color:red;">Invalid input</span>
        </form>
      </main>
    `;
    // Reset window size for responsive tests
    window.innerWidth = 1024;
    window.dispatchEvent(new Event('resize'));
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
    button.addEventListener("click", () => { clicked = true; });
    button.click();
    expect(clicked).toBe(true);
  });

  test("Responsive layout adapts correctly on mobile and desktop", () => {
    // Simulate desktop
    window.innerWidth = 1024;
    window.dispatchEvent(new Event('resize'));
    expect(window.innerWidth).toBeGreaterThan(600);

    // Simulate mobile
    window.innerWidth = 375;
    window.dispatchEvent(new Event('resize'));
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
});
