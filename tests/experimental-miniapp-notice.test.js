/**
 * @jest-environment jsdom
 */

import {
  initializeExperimentalMiniAppNotice,
  resetExperimentalMiniAppNoticeForTests,
} from "../public/js/experimentalMiniAppNotice.js";

function showPage(id) {
  document.dispatchEvent(new CustomEvent("page:shown", { detail: { id } }));
}

function loadRoute(routeName) {
  window.dispatchEvent(
    new CustomEvent("page:loaded", { detail: { routeName } }),
  );
}

describe("experimental mini app notice", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    sessionStorage.clear();
    localStorage.clear();
    localStorage.setItem("prefLang", "en");
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 768,
    });
    resetExperimentalMiniAppNoticeForTests();
    initializeExperimentalMiniAppNotice();
  });

  afterEach(() => {
    resetExperimentalMiniAppNoticeForTests();
    document.body.innerHTML = "";
    sessionStorage.clear();
    localStorage.clear();
  });

  it("shows once for an interactive learning flow and reopens after leaving that flow", () => {
    showPage("interactiveLearningPage");

    const overlay = document.getElementById("experimentalMiniAppNoticeOverlay");
    expect(overlay).toBeNull();

    showPage("cataractPage");
    expect(
      document.getElementById("experimentalMiniAppNoticeOverlay"),
    ).toBeNull();

    showPage("cataractSimulatorPage");
    const simulatorOverlay = document.getElementById(
      "experimentalMiniAppNoticeOverlay",
    );
    expect(simulatorOverlay).not.toBeNull();
    expect(simulatorOverlay.hidden).toBe(false);
    expect(simulatorOverlay.textContent).toContain(
      "Interactive learning notice",
    );

    simulatorOverlay.querySelector("[data-experimental-miniapp-ok]").click();
    expect(simulatorOverlay.hidden).toBe(true);

    showPage("glaucomaACDInteractive");
    expect(simulatorOverlay.hidden).toBe(true);

    showPage("diseasesPage");
    showPage("cataractSimulatorPage");
    expect(simulatorOverlay.hidden).toBe(false);
  });

  it("clears the acknowledgement after a non-experimental route load", () => {
    showPage("cataractSimulatorPage");

    const overlay = document.getElementById("experimentalMiniAppNoticeOverlay");
    overlay.querySelector("[data-experimental-miniapp-ok]").click();
    expect(overlay.hidden).toBe(true);

    loadRoute("eyes");
    showPage("glaucomaACDInteractive");

    expect(overlay.hidden).toBe(false);
  });

  it("shows the RAPD rotate prompt before the learning notice on a portrait phone", () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 390,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 844,
    });

    showPage("glaucomaRAPDFullSwingInteractive");

    const orientationOverlay = document.getElementById(
      "rapdOrientationNoticeOverlay",
    );
    expect(orientationOverlay).not.toBeNull();
    expect(orientationOverlay.hidden).toBe(false);
    expect(orientationOverlay.textContent).toContain(
      "Rotate your device to landscape",
    );
    expect(
      document.getElementById("experimentalMiniAppNoticeOverlay"),
    ).toBeNull();
    expect(document.body.dataset.rapdMobileLayout).toBe("true");

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 844,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 390,
    });
    window.dispatchEvent(new Event("resize"));

    expect(orientationOverlay.hidden).toBe(true);
    const learningOverlay = document.getElementById(
      "experimentalMiniAppNoticeOverlay",
    );
    expect(learningOverlay).not.toBeNull();
    expect(learningOverlay.hidden).toBe(false);
    expect(learningOverlay.textContent).toContain(
      "Interactive learning notice",
    );
  });

  it("uses the test instructions instead of the generic learning notice", () => {
    sessionStorage.setItem("rapdExperience:launchMode", "test");
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1024,
    });

    showPage("glaucomaRAPDFullSwingInteractive");

    expect(
      document.querySelector("[data-experimental-miniapp-title]")?.textContent,
    ).toBe("Pupil App Test");
    expect(
      document.querySelector("[data-experimental-miniapp-body]")?.textContent,
    ).toContain("press Submit answer");
    expect(
      document.querySelector("[data-experimental-miniapp-ok]")?.textContent,
    ).toBe("Start test");
  });
});
