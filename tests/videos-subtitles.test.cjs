/**
 * @jest-environment jsdom
 */

import fs from "node:fs";

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
    iosHls: {
      masterManifest:
        "/video-hls/childhood-eye-screening/assessmentVisionPage/master.m3u8",
      preferredMode: "online",
      offlineFallbackMode: "low",
      subtitleLanguages: ["en", "ko"],
    },
    localSources: {
      low: "videos/Core/VisualAcuity/VA_Assessment_220p.mp4",
      high: "videos/Core/VisualAcuity/VA_Assessment_720p.mp4",
    },
  },
  fundalReflexFullAnimationVideoPage: {
    subtitles: {
      en: "/narration/fundal-reflex/full-animation/en.vtt",
      es: "/narration/fundal-reflex/full-animation/es-419.vtt",
    },
    audioVariants: {
      en: {
        label: "English",
        src: "/narration/fundal-reflex/full-animation/en.m4a",
      },
      "es-419": {
        label: "Español (Latinoamérica)",
        src: "/narration/fundal-reflex/full-animation/es-419.m4a",
      },
    },
    defaultSubtitleLang: "en",
    defaultAudioLang: "en",
    iosHls: {
      masterManifest: "",
      preferredMode: "low",
      offlineFallbackMode: "low",
      subtitleLanguages: ["en", "es"],
    },
    localSources: {
      low: "videos/FullAnim/FundalReflex_Full Animation_720p.mp4",
      high: "videos/FullAnim/FundalReflex_Full Animation.mp4",
    },
  },
};
const PILOT_SUBTITLE_VTT = `WEBVTT

00:00:00.000 --> 00:00:05.000
Subtitle cue
`;

function setDefaultChromiumUserAgent() {
  Object.defineProperty(window.navigator, "userAgent", {
    configurable: true,
    value:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  });
  Object.defineProperty(window.navigator, "platform", {
    configurable: true,
    value: "Win32",
  });
  Object.defineProperty(window.navigator, "maxTouchPoints", {
    configurable: true,
    value: 0,
  });
}

function setIPhoneWebKitUserAgent() {
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
}

function setDesktopSafariUserAgent() {
  Object.defineProperty(window.navigator, "userAgent", {
    configurable: true,
    value:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
  });
  Object.defineProperty(window.navigator, "platform", {
    configurable: true,
    value: "MacIntel",
  });
  Object.defineProperty(window.navigator, "maxTouchPoints", {
    configurable: true,
    value: 0,
  });
}

describe("childhood eye screening subtitle pilot", () => {
  let fetchSpy;
  let videos;

  beforeEach(async () => {
    jest.resetModules();
    localStorage.clear();
    document.documentElement.lang = "en";
    setDefaultChromiumUserAgent();
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
        <div id="fundalReflexFullAnimationVideoPage" class="page" style="display:block">
          <div class="tri-toggle" role="radiogroup" aria-label="Video mode">
            <button class="tri-toggle__btn" data-mode="low">low</button>
            <button class="tri-toggle__btn" data-mode="high">high</button>
          </div>
          <div class="video-container" id="fundalReflexFullAnimationVideoContainer">
            <video id="fundalReflexFullAnimationVideo" controls>
              <source src="videos/FullAnim/FundalReflex_Full Animation_720p.mp4" type="video/mp4" />
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
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value: jest.fn(() => Promise.resolve()),
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

      if (
        String(url).includes(
          "/video-subtitles/childhood-eye-screening/assessmentVisionPage/",
        )
      ) {
        return {
          ok: true,
          async text() {
            return PILOT_SUBTITLE_VTT;
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

  it("keeps subtitle catalog entries for video page sources", () => {
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

    expect(Object.keys(sanitized)).toEqual([
      "assessmentVisionPage",
      "assessingVisualFunctionPage",
      "fundalExamPage",
    ]);
    expect(
      videos.isChildhoodEyeScreeningSubtitlePilotPage(
        "assessingVisualFunctionPage",
      ),
    ).toBe(true);
    expect(
      videos.isChildhoodEyeScreeningSubtitlePilotPage("fundalExamPage"),
    ).toBe(true);
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

  it("maps the Spanish app language to the neutral Latin American narration", () => {
    expect(
      videos.resolveVideoNarrationLanguage(["en", "es-419"], {
        prefLang: "es",
        defaultLang: "en",
      }),
    ).toBe("es-419");

    expect(
      videos.resolveVideoNarrationLanguage(["en", "es-419"], {
        prefLang: "ko",
        defaultLang: "en",
      }),
    ).toBe("en");
  });

  it("attaches the selected narration as a separate synchronised audio track", () => {
    localStorage.setItem("prefLang", "es");

    const language = videos.syncVideoNarrationForPage(
      "fundalReflexFullAnimationVideoPage",
      PILOT_CATALOG.fundalReflexFullAnimationVideoPage,
      { preferredLang: "es" },
    );
    const page = document.getElementById("fundalReflexFullAnimationVideoPage");
    const audio = page.querySelector("[data-video-narration-audio='true']");
    const toggle = page.querySelector("[data-video-narration-toggle='true']");

    expect(language).toBe("es-419");
    expect(audio.getAttribute("src")).toBe(
      "/narration/fundal-reflex/full-animation/es-419.m4a",
    );
    expect(toggle.textContent).toContain("Narración");
    expect(toggle.getAttribute("aria-pressed")).toBe("true");

    toggle.click();
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    expect(
      localStorage.getItem("videoNarration:fundalReflexFullAnimationVideoPage"),
    ).toBe("off");
  });

  it("corrects narration drift above 200 milliseconds", () => {
    const video = document.createElement("video");
    const audio = document.createElement("audio");
    Object.defineProperty(video, "currentTime", {
      configurable: true,
      writable: true,
      value: 12,
    });
    Object.defineProperty(audio, "currentTime", {
      configurable: true,
      writable: true,
      value: 11.7,
    });

    videos.setVideoNarrationAudioTime(video, audio);
    expect(audio.currentTime).toBe(12);

    audio.currentTime = 11.85;
    videos.setVideoNarrationAudioTime(video, audio);
    expect(audio.currentTime).toBe(11.85);
  });

  it("treats long videos as complete when only the last seconds remain", () => {
    expect(videos.calculateVideoProgressPercent(108, 120)).toBe(100);
    expect(videos.calculateVideoProgressPercent(92, 120)).toBeLessThan(100);
  });

  it("omits wvtt from iOS HLS manifest codecs for subtitle compatibility", () => {
    const masterManifest = fs.readFileSync(
      "public/video-hls/childhood-eye-screening/assessmentVisionPage/master.m3u8",
      "utf8",
    );

    expect(masterManifest).toContain('CODECS="avc1.42E01E,mp4a.40.2"');
    expect(masterManifest).not.toContain("wvtt");
  });

  it("keeps short videos from completing too early", () => {
    expect(videos.calculateVideoProgressPercent(8, 10)).toBe(100);
    expect(videos.calculateVideoProgressPercent(6, 10)).toBeLessThan(100);
  });

  it("tracks Arclight Overview video progress rows", () => {
    document.body.innerHTML = `
      <div id="videos">
        <section id="arclightPage" class="page pupils-like" style="display:block">
          <section class="pupil-level pupil-level--primary">
            <div class="pupil-level__cap" style="background-color:#1e8d1e">Primary</div>
            <div class="lesson-row lesson-row--video" data-target="howToUseArclightVideoPage">
              <div class="lesson-main">
                <div class="lesson-top"><span class="lesson-type">How to Use Arclight</span></div>
                <div class="lesson-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                  <div class="lesson-progress__fill"></div>
                </div>
              </div>
            </div>
            <div class="lesson-row lesson-row--video" data-target="phoneAttachmentVideoPage">
              <div class="lesson-main">
                <div class="lesson-top"><span class="lesson-type">Mobile Phone Attachment</span></div>
                <div class="lesson-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                  <div class="lesson-progress__fill"></div>
                </div>
              </div>
            </div>
          </section>
        </section>
        <div id="howToUseArclightVideoPage" class="page" style="display:none">
          <div class="video-container">
            <video id="howToUseArclightVideo"><source src="videos/USAID/HowtoArclight.mp4" /></video>
          </div>
        </div>
        <div id="phoneAttachmentVideoPage" class="page" style="display:none">
          <div class="video-container">
            <video id="phoneAttachmentVideo"><source src="videos/Arclight/PhoneAttach.mp4" /></video>
          </div>
        </div>
      </div>
    `;

    const cases = [
      {
        pageId: "howToUseArclightVideoPage",
        videoId: "howToUseArclightVideo",
        currentTime: 50,
        expectedPercent: 50,
      },
      {
        pageId: "phoneAttachmentVideoPage",
        videoId: "phoneAttachmentVideo",
        currentTime: 25,
        expectedPercent: 25,
      },
    ];

    cases.forEach(({ pageId, videoId, currentTime, expectedPercent }) => {
      videos.goToVideosSection(pageId);
      const video = document.getElementById(videoId);
      Object.defineProperty(video, "duration", {
        configurable: true,
        value: 100,
      });
      Object.defineProperty(video, "currentTime", {
        configurable: true,
        value: currentTime,
      });

      video.dispatchEvent(new Event("timeupdate"));

      const stored = JSON.parse(
        localStorage.getItem(`videoProgress:${pageId}`),
      );
      expect(Math.round(stored.percent)).toBe(expectedPercent);
      expect(
        document.querySelector(
          `.lesson-row[data-target="${pageId}"] .lesson-progress__fill`,
        ).style.width,
      ).toBe(`${expectedPercent}%`);
    });
  });

  it("uses the intermediate scrollytelling icon for the Holo guide row", () => {
    const html = fs.readFileSync("public/html/videos.html", "utf8");
    const css = fs.readFileSync("public/style/components.css", "utf8");

    expect(html).toContain(
      'class="lesson-row lesson-row--scroll lesson-row--scrollytelling"',
    );
    expect(css).toContain("lesson-row--scrollytelling");
    expect(css).toContain("intermediate_scrollytell.webp");
    expect(css).toContain("#holoOverviewPage .lesson-progress__fill");
    expect(css).toContain("#holoOverviewPage .lesson-row.is-progress-complete");
    expect(css).toContain("--lesson-complete-color: #f25600");
  });

  it("adds the merged Direct Ophthalmoscopy scrollytelling guide to Arclight Overview", () => {
    const html = fs.readFileSync("public/html/videos.html", "utf8");
    const videosJs = fs.readFileSync("public/js/videos.js", "utf8");
    const scrollyJs = fs.readFileSync(
      "public/js/childhoodFundalPreparation.js",
      "utf8",
    );
    const css = fs.readFileSync("public/style/pages.css", "utf8");

    expect(html).toContain('data-target="directOphthalmoscopyScrollPage"');
    expect(html).toContain('id="directOphthalmoscopyScrollPage"');
    expect(html).toContain("Direct Ophthalmoscopy Guide");
    expect(videosJs).toContain(
      'const DIRECT_OPHTHALMOSCOPY_SCROLL_PAGE_ID = "directOphthalmoscopyScrollPage"',
    );
    expect(scrollyJs).toContain(
      'const DIRECT_OPHTHALMOSCOPY_SCROLL_ROUTE = "directOphthalmoscopyScroll"',
    );
    expect(scrollyJs).toContain('routeName: "diabeticObservationFundalReflex"');
    expect(scrollyJs).toContain('routeName: "diabeticPositioningFlightPath"');
    expect(scrollyJs).toContain('routeName: "diabeticHowToExamine"');
    expect(css).toContain("#directOphthalmoscopyScrollPage");
    expect(css).toContain("fundal-reflex-section-divider__title");
  });

  it("renders an iPhone WebKit subtitle overlay that updates cue text over time", async () => {
    setIPhoneWebKitUserAgent();
    localStorage.setItem("prefLang", "ko");

    await videos.ensureChildhoodPilotSubtitleControlsForPage(
      "assessmentVisionPage",
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    const page = document.getElementById("assessmentVisionPage");
    const video = page.querySelector("video");
    const overlay = page.querySelector(
      "[data-childhood-pilot-subtitle-overlay='true']",
    );

    Object.defineProperty(video, "currentTime", {
      configurable: true,
      writable: true,
      value: 1,
    });
    video.dispatchEvent(new Event("timeupdate"));

    expect(overlay).not.toBeNull();
    expect(overlay.textContent).toContain("Subtitle cue");
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

  it("defaults iOS pilot pages to HLS online playback and hides high only", async () => {
    setIPhoneWebKitUserAgent();

    localStorage.setItem("prefLang", "ko");
    localStorage.setItem("videoMode:assessmentVisionPage", "high");

    const page = document.getElementById("assessmentVisionPage");
    const video = page.querySelector("video");
    const loadCalls = [];

    Object.defineProperty(HTMLMediaElement.prototype, "load", {
      configurable: true,
      value: jest.fn(function () {
        loadCalls.push({
          src: this.querySelector("source")?.getAttribute("src") || "",
          trackSrc:
            this.querySelector(
              "track[data-childhood-pilot-subtitle='true']",
            )?.getAttribute("src") || "",
          trackKind:
            this.querySelector(
              "track[data-childhood-pilot-subtitle='true']",
            )?.getAttribute("kind") || "",
        });
      }),
    });

    videos.showVideosPageById("assessmentVisionPage");
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
    await videos.ensureChildhoodPilotSubtitleControlsForPage(
      "assessmentVisionPage",
    );

    const trackEl = page.querySelector(
      "track[data-childhood-pilot-subtitle='true']",
    );
    const highBtn = page.querySelector('.tri-toggle__btn[data-mode="high"]');
    const onlineBtn = page.querySelector(
      '.tri-toggle__btn[data-mode="online"]',
    );

    expect(trackEl).toBeNull();
    expect(video.dataset.preventAutoFullscreen).toBe("true");
    expect(video.dataset.preferContainerFullscreen).toBe("true");
    expect(
      page.querySelector("[data-childhood-pilot-subtitle-overlay='true']"),
    ).not.toBeNull();
    expect(video.querySelector("source").getAttribute("src")).toBe(
      "/video-hls/childhood-eye-screening/assessmentVisionPage/master.m3u8",
    );
    expect(highBtn.hidden).toBe(true);
    expect(onlineBtn.hidden).toBe(false);
    expect(loadCalls[loadCalls.length - 1]).toEqual({
      src: "/video-hls/childhood-eye-screening/assessmentVisionPage/master.m3u8",
      trackSrc: "",
      trackKind: "",
    });
  });

  it("falls back to low mp4 when iOS HLS playback errors", async () => {
    setIPhoneWebKitUserAgent();
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    });

    const page = document.getElementById("assessmentVisionPage");
    const video = page.querySelector("video");

    videos.showVideosPageById("assessmentVisionPage");
    await new Promise((resolve) => setTimeout(resolve, 0));
    video.dispatchEvent(new Event("error"));
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
    await videos.ensureChildhoodPilotSubtitleControlsForPage(
      "assessmentVisionPage",
    );

    expect(video.querySelector("source").getAttribute("src")).toBe(
      "videos/Core/VisualAcuity/VA_Assessment_220p.mp4",
    );
    expect(
      page.querySelector("[data-childhood-pilot-subtitle-overlay='true']"),
    ).not.toBeNull();
    expect(page.dataset.currentVideoMode).toBe("low");
  });

  it("uses the subtitle panel for desktop Safari local playback", async () => {
    setDesktopSafariUserAgent();

    await videos.ensureChildhoodPilotSubtitleControlsForPage(
      "assessmentVisionPage",
    );

    const page = document.getElementById("assessmentVisionPage");

    expect(
      page.querySelector("[data-childhood-pilot-subtitle-panel='true']"),
    ).not.toBeNull();
    expect(
      page.querySelector("track[data-childhood-pilot-subtitle='true']"),
    ).toBeNull();
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
