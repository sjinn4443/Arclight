/**
 * @jest-environment jsdom
 */

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

const SVG_NS = "http://www.w3.org/2000/svg";
let initializeChildhoodFundalReflexScrollPage;

function flushAsyncWork() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe("childhood fundal route revisit restore", () => {
  let originalGetBoundingClientRect;
  let animations;

  beforeEach(() => {
    localStorage.clear();
    animations = [];

    window.__ARCLIGHT_E2E__ = {};
    window.scrollTo = jest.fn();
    window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
    window.cancelAnimationFrame = (id) => clearTimeout(id);

    originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
      if (this.id === "page-content") {
        return {
          top: 0,
          left: 0,
          right: 480,
          bottom: 900,
          width: 480,
          height: 900,
          x: 0,
          y: 0,
        };
      }

      const fileIndex = Number(this.dataset?.fileIndex || 0);
      const top = 80 + fileIndex * 260;
      return {
        top,
        left: 0,
        right: 360,
        bottom: top + 220,
        width: 360,
        height: 220,
        x: 0,
        y: top,
      };
    };

    global.fetch = jest.fn(async (url) => ({
      ok: true,
      json: async () =>
        String(url || "").includes("/translation/") ? {} : { assets: [] },
    }));

    window.lottie = {
      loadAnimation: jest.fn(({ container }) => {
        const svg = document.createElementNS(SVG_NS, "svg");
        const rect = document.createElementNS(SVG_NS, "rect");
        rect.setAttribute("width", "100");
        rect.setAttribute("height", "100");
        svg.appendChild(rect);
        container.appendChild(svg);

        const listeners = new Map();
        const anim = {
          animationData: { op: 500 },
          totalFrames: 500,
          currentFrame: 0,
          renderer: { svgElement: svg },
          addEventListener: jest.fn((event, handler) => {
            listeners.set(event, handler);
            if (event === "DOMLoaded") {
              queueMicrotask(() => handler());
            }
          }),
          removeEventListener: jest.fn((event, handler) => {
            if (listeners.get(event) === handler) {
              listeners.delete(event);
            }
          }),
          pause: jest.fn(),
          goToAndStop: jest.fn((frame) => {
            anim.currentFrame = Number(frame) || 0;
          }),
          goToAndPlay: jest.fn((frame) => {
            anim.currentFrame = Number(frame) || 0;
          }),
          playSegments: jest.fn(),
          destroy: jest.fn(),
        };

        animations.push(anim);
        return anim;
      }),
    };

    document.body.innerHTML = `
      <div id="page-content" style="height: 900px; overflow: auto;"></div>
      <div id="childhoodFundalPreparationPage" class="page">
        <div class="eyes-topbar">
          <div class="eyes-topbar__title">Preparation</div>
          <div class="eyes-topbar__icons"></div>
        </div>
        <div class="childhood-fundal-prep-list"></div>
      </div>
    `;

    const pageContent = document.getElementById("page-content");
    pageContent.scrollTo = jest.fn(({ top }) => {
      pageContent.scrollTop = top;
    });
    pageContent.scrollTop = 0;
    Object.defineProperty(pageContent, "clientHeight", {
      configurable: true,
      value: 900,
    });
    Object.defineProperty(pageContent, "scrollHeight", {
      configurable: true,
      value: 1800,
    });

    localStorage.setItem(
      "childhoodWorkshop:progress:childhoodFundalPreparationPage",
      JSON.stringify({
        percent: 100,
        updatedAt: Date.UTC(2026, 2, 13, 12, 0, 0),
      }),
    );
  });

  beforeEach(async () => {
    if (!initializeChildhoodFundalReflexScrollPage) {
      ({ initializeChildhoodFundalReflexScrollPage } =
        await import("../public/js/childhoodFundalPreparation.js"));
    }
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    delete window.lottie;
    delete window.__ARCLIGHT_E2E__;
  });

  it("restores completed stages instead of autoplaying on revisit", async () => {
    await initializeChildhoodFundalReflexScrollPage(
      "childhoodFundalPreparation",
    );
    await flushAsyncWork();
    await flushAsyncWork();

    const runtime = window.__ARCLIGHT_E2E__?.fundal;
    expect(runtime).toBeTruthy();

    const stage0 = runtime.getStageState("childhoodFundalPreparation", 0);
    const stage1 = runtime.getStageState("childhoodFundalPreparation", 1);
    const stage2 = runtime.getStageState("childhoodFundalPreparation", 2);

    expect(stage0?.completed).toBe(true);
    expect(stage1?.completed).toBe(true);
    expect(stage2?.completed).toBe(true);
    expect(stage0?.playing).toBe(false);
    expect(stage0?.replayVisible).toBe(true);
    expect(stage1?.replayVisible).toBe(true);
    expect(stage2?.replayVisible).toBe(true);

    animations.forEach((anim) => {
      expect(anim.playSegments).not.toHaveBeenCalled();
    });
  });
});
