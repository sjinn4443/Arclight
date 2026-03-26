/**
 * @jest-environment jsdom
 */

import {
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

const PILOT_CATALOG = {
  assessmentVisionPage: {
    subtitles: {
      en: "/video-subtitles/childhood-eye-screening/assessmentVisionPage/en.vtt",
      ko: "/video-subtitles/childhood-eye-screening/assessmentVisionPage/ko.vtt",
    },
    audioVariants: {},
    defaultSubtitleLang: "en",
    defaultAudioLang: "en",
    localSources: {
      low: "videos/Core/VisualAcuity/VA_Assessment_220p.mp4",
      high: "videos/Core/VisualAcuity/VA_Assessment_720p.mp4",
    },
  },
};
const IOS_OVERLAY_VTT = `WEBVTT

00:00:00.000 --> 00:00:05.000
Fallback subtitle line
`;

describe("childhood eye screening subtitle pilot", () => {
  let fetchSpy;
  let videos;

  beforeEach(async () => {
    jest.resetModules();
    localStorage.clear();
    document.documentElement.lang = "en";
    document.body.innerHTML = `
      <div id="videos">
        <div id="assessmentVisionPage" class="page" style="display:block">
          <div class="tri-toggle" role="radiogroup" aria-label="Video mode">
            <button
              class="tri-toggle__btn"
              type="button"
              role="radio"
              aria-checked="false"
              data-mode="low"
            >
              low
            </button>
            <button
              class="tri-toggle__btn"
              type="button"
              role="radio"
              aria-checked="false"
              data-mode="high"
            >
              high
            </button>
            <button
              class="tri-toggle__btn tri-toggle__btn--icon"
              type="button"
              role="radio"
              aria-checked="false"
              data-mode="online"
              aria-label="online"
            >
              <span class="tri-toggle__wifi" aria-hidden="true"></span>
            </button>
            <div class="tri-toggle__knob" aria-hidden="true"></div>
          </div>
          <div class="video-header"><h3>Assessment</h3></div>
          <div class="video-container" id="assessmentVisionContainer">
            <video id="assessmentVisionVideo" controls>
              <source src="videos/Core/VisualAcuity/VA_Assessment_220p.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <div id="fundalExamPage" class="page" style="display:block">
          <div class="video-header"><h3>Fundal</h3></div>
          <div class="video-container" id="fundalExamContainer">
            <video id="fundalExamVideo" controls>
              <source src="videos/Core/FundalReflex/FR_Scotland_220p.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    `;

    window.__videosGlobalBound = true;
    window.I18N = {
      getLanguage: () => localStorage.getItem("prefLang") || "en",
      applyTranslations: () => {},
    };
    window.scrollTo = jest.fn();

    Object.defineProperty(HTMLMediaElement.prototype, "load", {
      configurable: true,
      value: jest.fn(),
    });
    Object.defineProperty(HTMLMediaElement.prototype, "pause", {
      configurable: true,
      value: jest.fn(),
    });

    fetchSpy = jest.spyOn(global, "fetch").mockImplementation(async (url) => {
      if (
        String(url).endsWith("/video-localization/childhood-eye-screening.json")
      ) {
        return {
          ok: true,
          async json() {
            return PILOT_CATALOG;
          },
        };
      }

      if (String(url).endsWith("/assessmentVisionPage/ko.vtt")) {
        return {
          ok: true,
          async text() {
            return IOS_OVERLAY_VTT;
          },
        };
      }

      throw new Error(`Unexpected fetch in test: ${String(url)}`);
    });

    await jest.isolateModulesAsync(async () => {
      videos = await import("../public/js/videos.js");
    });
    videos.resetChildhoodPilotSubtitleCatalogForTests();
  });

  afterEach(() => {
    fetchSpy?.mockRestore();
  });

  it("filters the subtitle catalog to the five audio pilot page ids", () => {
    const sanitized = videos.sanitizeChildhoodEyeScreeningSubtitleCatalog({
      assessmentVisionPage: PILOT_CATALOG.assessmentVisionPage,
      assessingVisualFunctionPage: {
        subtitles: {
          en: "/video-subtitles/childhood-eye-screening/assessingVisualFunctionPage/en.vtt",
        },
      },
      fundalExamPage: {
        subtitles: {
          en: "/video-subtitles/childhood-eye-screening/fundalExamPage/en.vtt",
        },
      },
    });

    expect(Object.keys(sanitized)).toEqual(["assessmentVisionPage"]);
    expect(
      videos.isChildhoodEyeScreeningSubtitlePilotPage(
        "assessingVisualFunctionPage",
      ),
    ).toBe(false);
    expect(
      videos.isChildhoodEyeScreeningSubtitlePilotPage("fundalExamPage"),
    ).toBe(false);
  });

  it("prefers the selected app language and falls back to English", () => {
    expect(
      videos.resolveChildhoodPilotSubtitleLanguage(["en", "ko"], {
        prefLang: "ko",
        defaultLang: "en",
      }),
    ).toBe("ko");

    expect(
      videos.resolveChildhoodPilotSubtitleLanguage(["en"], {
        prefLang: "ko",
        defaultLang: "en",
      }),
    ).toBe("en");
  });

  it("treats long videos as complete when only the last seconds remain", () => {
    expect(videos.calculateVideoProgressPercent(108, 120)).toBe(100);
    expect(videos.calculateVideoProgressPercent(92, 120)).toBeLessThan(100);
  });

  it("keeps short videos from completing too early", () => {
    expect(videos.calculateVideoProgressPercent(8, 10)).toBe(100);
    expect(videos.calculateVideoProgressPercent(6, 10)).toBeLessThan(100);
  });

  it("injects an app-language subtitle track for pilot pages without a selector", async () => {
    localStorage.setItem("prefLang", "ko");

    await videos.ensureChildhoodPilotSubtitleControlsForPage(
      "assessmentVisionPage",
    );

    const page = document.getElementById("assessmentVisionPage");
    const video = page.querySelector("video");
    const trackEl = page.querySelector(
      "track[data-childhood-pilot-subtitle='true']",
    );

    expect(
      page.querySelector("[data-childhood-pilot-subtitles='true']"),
    ).toBeNull();
    expect(trackEl).not.toBeNull();
    expect(trackEl.getAttribute("src")).toBe(
      "/video-subtitles/childhood-eye-screening/assessmentVisionPage/ko.vtt",
    );
    expect(trackEl.getAttribute("kind")).toBe("captions");
    expect(trackEl.hasAttribute("default")).toBe(true);
    expect(video.getAttribute("playsinline")).toBe("");
    expect(video.getAttribute("webkit-playsinline")).toBe("");
    expect(video.getAttribute("crossorigin")).toBe("anonymous");
  });

  it("updates visible subtitles when the app language changes", async () => {
    localStorage.setItem("prefLang", "en");

    await videos.ensureChildhoodPilotSubtitleControlsForPage(
      "assessmentVisionPage",
    );

    localStorage.setItem("prefLang", "ko");
    await videos.refreshChildhoodPilotSubtitlesForLanguageChange();

    const page = document.getElementById("assessmentVisionPage");
    const trackEl = page.querySelector(
      "track[data-childhood-pilot-subtitle='true']",
    );

    expect(trackEl.getAttribute("src")).toBe(
      "/video-subtitles/childhood-eye-screening/assessmentVisionPage/ko.vtt",
    );
  });

  it("renders an iOS overlay fallback when Safari does not draw native cues", async () => {
    Object.defineProperty(window.navigator, "userAgent", {
      configurable: true,
      value:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });
    Object.defineProperty(window.navigator, "platform", {
      configurable: true,
      value: "iPhone",
    });
    Object.defineProperty(window.navigator, "maxTouchPoints", {
      configurable: true,
      value: 5,
    });

    localStorage.setItem("prefLang", "ko");

    const page = document.getElementById("assessmentVisionPage");
    const video = page.querySelector("video");
    video.currentTime = 1;

    await videos.ensureChildhoodPilotSubtitleControlsForPage(
      "assessmentVisionPage",
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    video.dispatchEvent(new Event("timeupdate"));

    const overlay = page.querySelector(
      "[data-childhood-pilot-subtitle-overlay='true']",
    );

    expect(overlay).not.toBeNull();
    expect(overlay.hidden).toBe(false);
    expect(overlay.textContent).toContain("Fallback subtitle line");
    expect(video.dataset.preventAutoFullscreen).toBe("true");
  });

  it("adds a menu button next to the video mode toggle", () => {
    videos.ensureVideoPageMenuButtonForPage("assessmentVisionPage");

    const page = document.getElementById("assessmentVisionPage");
    const actionRow = page.querySelector("[data-video-page-actions='true']");
    const toggle = actionRow.querySelector(".tri-toggle");
    const menuBtn = actionRow.querySelector(".menuBtn");

    expect(actionRow).not.toBeNull();
    expect(toggle).not.toBeNull();
    expect(menuBtn).not.toBeNull();
    expect(menuBtn.textContent).toBe("☰");
  });
});
