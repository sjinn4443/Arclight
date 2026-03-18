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
    expect(overlay).not.toBeNull();
    expect(overlay.hidden).toBe(false);
    expect(overlay.textContent).toContain("Interactive learning notice");

    overlay.querySelector("[data-experimental-miniapp-ok]").click();
    expect(overlay.hidden).toBe(true);

    showPage("glaucomaACDInteractive");
    expect(overlay.hidden).toBe(true);

    showPage("diseasesPage");
    showPage("cataractPage");
    expect(overlay.hidden).toBe(false);
  });

  it("clears the acknowledgement after a non-experimental route load", () => {
    showPage("interactiveLearningPage");

    const overlay = document.getElementById("experimentalMiniAppNoticeOverlay");
    overlay.querySelector("[data-experimental-miniapp-ok]").click();
    expect(overlay.hidden).toBe(true);

    loadRoute("eyes");
    showPage("glaucomaACDInteractive");

    expect(overlay.hidden).toBe(false);
  });
});
