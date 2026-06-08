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
});
