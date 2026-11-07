import "./chunk-WOT6VMZA.js";
function g(l) {
  let e = l?.parentElement ?? null;
  for (; e && e !== document.body; ) {
    let o = window.getComputedStyle(e),
      c = o.overflowY || o.overflow;
    if (/(auto|scroll|overlay)/.test(c)) return e;
    e = e.parentElement;
  }
  return window;
}
function v(l) {
  if (l === window)
    return {
      top: 0,
      height: window.innerHeight || document.documentElement.clientHeight || 1,
    };
  let e = l.getBoundingClientRect();
  return { top: e.top, height: l.clientHeight || e.height || 1 };
}
function S(l) {
  let e = l;
  for (; e; ) {
    let o = window.getComputedStyle(e);
    if (o.display === "none" || o.visibility === "hidden") return !1;
    e = e.parentElement;
  }
  return !0;
}
function C(l) {
  let e = [
    ".childhood-scrolly-hero",
    ".childhood-visual-dev-panel",
    ".childhood-normal-visual-dev-section",
    "#childhoodReferPage .childhood-refer",
    "#visualImpairmentPage .vi-scroll-wrap",
    "#visualImpairmentPage .vi-detail-panel",
    "#signsVICasesPage .childhood-signs-vi-panel",
  ];
  return Array.from(l.querySelectorAll(e.join(","))).filter(
    (o) => !o.closest("[aria-hidden='true']"),
  );
}
function A() {
  document
    .querySelectorAll(
      ".childhood-scrolly-page, #visualImpairmentPage, #childhoodReferPage",
    )
    .forEach((e) => {
      typeof e._childhoodScrollyCleanup == "function" &&
        e._childhoodScrollyCleanup();
      let o = C(e);
      if (!o.length) return;
      o.forEach((t) => t.classList.add("childhood-scrolly-step"));
      let c = new AbortController(),
        { signal: w } = c,
        h = g(e),
        s = 0,
        m = () => {
          if (((s = 0), !S(e))) return;
          let t = v(h),
            i = t.top + t.height * 0.12,
            a = t.top + t.height * 0.84,
            d = !1;
          o.forEach((u, y) => {
            let f = u.getBoundingClientRect(),
              p = f.top < a && f.bottom > i;
            ((p || (y === 0 && f.top < a)) && u.classList.add("is-visible"),
              p && !d
                ? (u.classList.add("is-current"), (d = !0))
                : u.classList.remove("is-current"));
          });
        },
        r = () => {
          s || (s = window.requestAnimationFrame(m));
        },
        n = (t, i, a, d = {}) => {
          t?.addEventListener && t.addEventListener(i, a, { ...d, signal: w });
        };
      (e.id === "signsVICasesPage" &&
        e.querySelectorAll("video.childhood-signs-vi-media").forEach((t) => {
          ((t.loop = !0),
            (t.muted = !0),
            (t.autoplay = !0),
            (t.playsInline = !0),
            (t.controls = !1));
          let i = () => {
            t.play?.().catch(() => {});
          };
          (n(t, "loadedmetadata", i), n(t, "canplay", i), i());
        }),
        h === window
          ? n(window, "scroll", r, { passive: !0 })
          : n(h, "scroll", r, { passive: !0 }),
        n(window, "resize", r, { passive: !0 }),
        n(window, "orientationchange", r, { passive: !0 }),
        e.querySelectorAll("img, video").forEach((t) => {
          t.complete ||
            t.readyState >= 2 ||
            (n(t, "load", r, { once: !0 }),
            n(t, "loadeddata", r, { once: !0 }));
        }),
        (e._childhoodScrollyCleanup = () => {
          (c.abort(),
            s && window.cancelAnimationFrame(s),
            delete e._childhoodScrollyCleanup);
        }),
        window.requestAnimationFrame(r));
    });
}
export { A as initializeChildhoodScrollyPages };
