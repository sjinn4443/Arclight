import "./chunk-WOT6VMZA.js";
function q(e, t = 0, r = 1) {
  return Math.min(r, Math.max(t, e));
}
function f(e, t, r) {
  return e + (t - e) * r;
}
function C(e) {
  return 1 - (1 - e) ** 3;
}
function x(e) {
  return e < 0.5 ? 4 * e ** 3 : 1 - (-2 * e + 2) ** 3 / 2;
}
function L(e, t, r, n = (o) => o) {
  return r <= t ? (e >= r ? 1 : 0) : n(q((e - t) / (r - t)));
}
function I(e) {
  let t = e?.parentElement ?? null;
  for (; t && t !== document.body; ) {
    let r = window.getComputedStyle(t),
      n = r.overflowY || r.overflow;
    if (/(auto|scroll|overlay)/.test(n)) return t;
    t = t.parentElement;
  }
  return window;
}
function N(e) {
  if (e === window)
    return {
      top: 0,
      height: window.innerHeight || document.documentElement.clientHeight || 1,
    };
  let t = e.getBoundingClientRect();
  return { top: t.top, height: e.clientHeight || t.height || 1 };
}
function m(e) {
  return Number.isFinite(e) ? e.toFixed(4) : "0";
}
function A(e) {
  let t = Number(e?.duration);
  return !Number.isFinite(t) || t <= 0.2
    ? null
    : t > 1.2
      ? Math.min(1, t - 0.1)
      : Math.min(Math.max(t * 0.35, 0.18), t - 0.08);
}
function O(e) {
  let t = Math.max(1, Math.floor(e.videoWidth || 0)),
    r = Math.max(1, Math.floor(e.videoHeight || 0));
  if (!t || !r) return !1;
  let n = document.createElement("canvas");
  ((n.width = t), (n.height = r));
  let o = n.getContext("2d");
  if (!o) return !1;
  try {
    return (
      o.drawImage(e, 0, 0, t, r),
      e.setAttribute("poster", n.toDataURL("image/jpeg", 0.86)),
      !0
    );
  } catch {
    return !1;
  }
}
function T(e) {
  if (
    !e ||
    e.dataset.posterPrepared === "1" ||
    e.dataset.posterPreparing === "1"
  )
    return;
  let t = A(e);
  if (t == null) return;
  if ((e.readyState ?? 0) < 2) {
    let d = () => {
      (e.removeEventListener("loadeddata", d), T(e));
    };
    e.addEventListener("loadeddata", d, { once: !0 });
    try {
      e.load?.();
    } catch {}
    return;
  }
  e.dataset.posterPreparing = "1";
  let r = "preview",
    n = () => {
      (e.removeEventListener("seeked", o), delete e.dataset.posterPreparing);
    },
    o = () => {
      if (r === "preview") {
        (O(e), (e.dataset.posterPrepared = "1"), (r = "reset"));
        try {
          (e.pause(), (e.currentTime = 0));
        } catch {
          n();
        }
        return;
      }
      n();
    };
  e.addEventListener("seeked", o);
  try {
    e.currentTime = t;
  } catch {
    n();
  }
}
function b(
  e,
  {
    opacity: t = 0,
    x: r = 0,
    y: n = 0,
    scale: o = 1,
    leftPercent: d = null,
    topPercent: p = null,
  } = {},
) {
  if (!e) return;
  let c = t > 0.001;
  (e.style.setProperty("--opacity", m(q(t))),
    e.style.setProperty("--x", `${m(r)}px`),
    e.style.setProperty("--y", `${m(n)}px`),
    e.style.setProperty("--scale", m(o)),
    d == null
      ? e.style.removeProperty("--left")
      : e.style.setProperty("--left", `${m(d)}%`),
    p == null
      ? e.style.removeProperty("--top")
      : e.style.setProperty("--top", `${m(p)}%`),
    (e.style.visibility = c ? "visible" : "hidden"));
}
function P(e, t, r) {
  let n = r ? Math.round(t * 16) / 16 : t,
    o = L(n, 0.48, 0.66, x),
    d = L(n, 0.008, 0.05, C),
    c = window.matchMedia("(min-width: 768px)").matches ? 0.86 : 0.58;
  (b(e.scrollCue, { opacity: 1 - d }),
    [
      {
        element: e.nodeLight,
        start: 0.06,
        end: 0.18,
        initialLeft: 50,
        initialTop: 27,
        finalLeft: 30,
        finalTop: 19.5,
        finalScale: c,
      },
      {
        element: e.nodeRetina,
        start: 0.18,
        end: 0.3,
        initialLeft: 50,
        initialTop: 52,
        finalLeft: 30,
        finalTop: 47,
        finalScale: c,
      },
      {
        element: e.nodeBrain,
        start: 0.3,
        end: 0.42,
        initialLeft: 50,
        initialTop: 78,
        finalLeft: 30,
        finalTop: 74.5,
        finalScale: c,
      },
    ].forEach((i) => {
      let l = L(n, i.start, i.end, C),
        v = f(0.72, 1, l);
      b(i.element, {
        opacity: l,
        leftPercent: f(i.initialLeft, i.finalLeft, o),
        topPercent: f(i.initialTop, i.finalTop, o),
        y: f(42, 0, l),
        scale: f(v, i.finalScale, o),
      });
    }),
    [
      {
        element: e.cardCataract,
        link: e.linkCataract,
        start: 0.58,
        end: 0.65,
        cardLeft: 72.5,
        cardTop: 13,
        linkLeft: 51.5,
        linkTop: 14.4,
        linkScale: 1,
      },
      {
        element: e.cardNeedGlasses,
        link: e.linkNeedGlasses,
        start: 0.64,
        end: 0.71,
        cardLeft: 72.5,
        cardTop: 24,
        linkLeft: 54.5,
        linkTop: 24.2,
        linkScale: 1.4,
      },
      {
        element: e.cardCornealScar,
        link: e.linkCornealScar,
        start: 0.7,
        end: 0.77,
        cardLeft: 72.5,
        cardTop: 35,
        linkLeft: 55,
        linkTop: 34,
        linkScale: 1.2,
      },
      {
        element: e.cardRetinoblastoma,
        link: e.linkRetinoblastoma,
        start: 0.76,
        end: 0.83,
        cardLeft: 72.5,
        cardTop: 46,
        linkLeft: 54,
        linkTop: 46.5,
        linkScale: 1,
      },
      {
        element: e.cardRop,
        link: e.linkRop,
        start: 0.82,
        end: 0.89,
        cardLeft: 72.5,
        cardTop: 57,
        linkLeft: 51.5,
        linkTop: 56.7,
        linkScale: 1.4,
      },
      {
        element: e.cardMalnourishment,
        link: e.linkMalnourishment,
        start: 0.88,
        end: 0.95,
        cardLeft: 72.5,
        cardTop: 68,
        linkLeft: 53,
        linkTop: 67.3,
        linkScale: 1.3,
      },
      {
        element: e.cardProblems,
        link: e.linkProblems,
        start: 0.94,
        end: 1,
        cardLeft: 72.5,
        cardTop: 83,
        linkLeft: 53,
        linkTop: 82.6,
        linkScale: 1,
      },
    ].forEach((i) => {
      let l = L(n, i.start, i.end, C);
      (b(i.element, {
        opacity: l,
        leftPercent: i.cardLeft,
        topPercent: i.cardTop,
        x: f(46, 0, l),
        y: f(12, 0, l),
        scale: f(0.92, 1, l),
      }),
        b(i.link, {
          opacity: l,
          leftPercent: i.linkLeft,
          topPercent: i.linkTop,
          x: f(20, 0, l),
          scale: f(0.96, i.linkScale ?? 1, l),
        }));
    }));
}
function G() {
  let e = document.getElementById("visualImpairmentPage");
  if (!e) return;
  typeof e._viCleanup == "function" && e._viCleanup();
  let t = e.querySelector(".vi-story");
  if (!t) return;
  let r = e.classList.contains("childhood-scrolly-page"),
    n = {
      scrollCue: e.querySelector('[data-vi="scrollCue"]'),
      nodeLight: e.querySelector('[data-vi="nodeLight"]'),
      nodeRetina: e.querySelector('[data-vi="nodeRetina"]'),
      nodeBrain: e.querySelector('[data-vi="nodeBrain"]'),
      cardCataract: e.querySelector('[data-vi="cardCataract"]'),
      cardNeedGlasses: e.querySelector('[data-vi="cardNeedGlasses"]'),
      cardCornealScar: e.querySelector('[data-vi="cardCornealScar"]'),
      cardRetinoblastoma: e.querySelector('[data-vi="cardRetinoblastoma"]'),
      cardRop: e.querySelector('[data-vi="cardRop"]'),
      cardMalnourishment: e.querySelector('[data-vi="cardMalnourishment"]'),
      cardProblems: e.querySelector('[data-vi="cardProblems"]'),
      linkCataract: e.querySelector('[data-vi="linkCataract"]'),
      linkNeedGlasses: e.querySelector('[data-vi="linkNeedGlasses"]'),
      linkCornealScar: e.querySelector('[data-vi="linkCornealScar"]'),
      linkRetinoblastoma: e.querySelector('[data-vi="linkRetinoblastoma"]'),
      linkRop: e.querySelector('[data-vi="linkRop"]'),
      linkMalnourishment: e.querySelector('[data-vi="linkMalnourishment"]'),
      linkProblems: e.querySelector('[data-vi="linkProblems"]'),
    },
    o = new AbortController(),
    { signal: d } = o,
    p = I(e),
    c = window.matchMedia("(prefers-reduced-motion: reduce)"),
    h = 0,
    w = -1,
    i = () => {},
    l = null,
    v = null;
  function u() {
    h ||
      (h = window.requestAnimationFrame(() => {
        if (((h = 0), r)) {
          (P(n, 1, c.matches), (w = 1));
          return;
        }
        let a = N(p),
          s = t.getBoundingClientRect(),
          k = Math.max(s.height - a.height, 1),
          S = q((a.top - s.top) / k);
        Math.abs(S - w) < 5e-4 || ((w = S), P(n, S, c.matches));
      }));
  }
  let y = (a, s, k, S = {}) => {
    a?.addEventListener && a.addEventListener(s, k, { ...S, signal: d });
  };
  (r ||
    (p === window
      ? y(window, "scroll", u, { passive: !0 })
      : y(p, "scroll", u, { passive: !0 })),
    y(window, "resize", u, { passive: !0 }),
    y(window, "orientationchange", u, { passive: !0 }),
    typeof c.addEventListener == "function"
      ? c.addEventListener("change", u, { signal: d })
      : typeof c.addListener == "function" &&
        (c.addListener(u), (i = () => c.removeListener(u))),
    e
      .querySelectorAll(".vi-node img, .vi-card img, .vi-link img")
      .forEach((a) => {
        a.complete || y(a, "load", u, { once: !0 });
      }));
  let g = e.querySelectorAll("video");
  g.forEach((a) => {
    a.readyState >= 2
      ? T(a)
      : y(
          a,
          "loadeddata",
          () => {
            T(a);
          },
          { once: !0 },
        );
  });
  let M = p === window ? null : p,
    R = e.querySelectorAll("[data-vi-reveal]"),
    E = e.querySelectorAll(".vi-detail-panel");
  ("IntersectionObserver" in window && E.length
    ? ((l = new IntersectionObserver(
        (a) => {
          a.forEach((s) => {
            s.isIntersecting &&
              (s.target
                .querySelectorAll("[data-vi-reveal]")
                .forEach((k) => k.classList.add("is-visible")),
              l?.unobserve(s.target));
          });
        },
        { root: M, threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
      )),
      E.forEach((a) => l.observe(a)))
    : R.forEach((a) => a.classList.add("is-visible")),
    "IntersectionObserver" in window &&
      g.length &&
      ((v = new IntersectionObserver(
        (a) => {
          a.forEach((s) => {
            s.isIntersecting || s.target.pause();
          });
        },
        { root: M, threshold: 0.12 },
      )),
      g.forEach((a) => v.observe(a))),
    (e._viCleanup = () => {
      (o.abort(),
        i(),
        l?.disconnect(),
        v?.disconnect(),
        h && (window.cancelAnimationFrame(h), (h = 0)),
        delete e._viCleanup);
    }),
    P(n, r ? 1 : 0, c.matches),
    u(),
    r || window.requestAnimationFrame(u));
}
export { G as initializeVisualImpairment };
