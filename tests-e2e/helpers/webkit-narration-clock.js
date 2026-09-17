// Windows Playwright WebKit cannot decode AAC or even a PCM WAV on this host
// (MEDIA_ERR_SRC_NOT_SUPPORTED). Mock only narration media, retaining the real
// WebKit DOM, Lottie renderer and interactions. Chromium tests use real AAC.
export async function useWebKitNarrationClock(page, browserName) {
  if (browserName !== "webkit") return;
  await page.addInitScript(() => {
    const proto = HTMLMediaElement.prototype;
    const values = new WeakMap();
    const isNarration = (el) =>
      (el.getAttribute("src") || "").includes("/narration/");
    const state = (el) => {
      if (!values.has(el))
        values.set(el, {
          time: 0,
          paused: true,
          at: performance.now(),
          timer: null,
        });
      return values.get(el);
    };
    const time = (el) => {
      const s = state(el);
      return (
        s.time +
        (s.paused ? 0 : ((performance.now() - s.at) * el.playbackRate) / 1000)
      );
    };
    for (const [key, read] of Object.entries({
      readyState: () => 4,
      paused: (el) => state(el).paused,
      currentTime: time,
      duration: () => 200,
      error: () => null,
    })) {
      const original = Object.getOwnPropertyDescriptor(proto, key);
      Object.defineProperty(proto, key, {
        configurable: true,
        get() {
          return isNarration(this) ? read(this) : original.get.call(this);
        },
        ...(key === "currentTime"
          ? {
              set(value) {
                if (!isNarration(this)) return original.set.call(this, value);
                Object.assign(state(this), {
                  time: Number(value),
                  at: performance.now(),
                });
              },
            }
          : {}),
      });
    }
    for (const key of ["play", "pause", "load"]) {
      const original = proto[key];
      proto[key] = function (...args) {
        if (!isNarration(this)) return original.apply(this, args);
        const s = state(this);
        s.time = time(this);
        s.at = performance.now();
        clearInterval(s.timer);
        s.paused = key !== "play";
        if (key === "load") {
          s.time = 0;
          setTimeout(() => this.dispatchEvent(new Event("loadedmetadata")), 0);
        }
        if (key === "play") {
          s.timer = setInterval(
            () => this.dispatchEvent(new Event("timeupdate")),
            50,
          );
          return Promise.resolve();
        }
      };
    }
  });
}
