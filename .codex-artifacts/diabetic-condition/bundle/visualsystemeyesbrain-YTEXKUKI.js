import { a as L, b as j, c as et } from "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
function v(t, n = 0, i = 1) {
  return Math.min(i, Math.max(n, t));
}
function o(t, n, i) {
  return t + (n - t) * i;
}
function c(t, n, i, r = (d) => d) {
  return i <= n ? (t >= i ? 1 : 0) : r(v((t - n) / (i - n)));
}
function A(t) {
  return 1 - (1 - t) ** 3;
}
function E(t) {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}
function _t(t, n = !1) {
  let i = v(t),
    r = n ? 0.4 : 0.4424,
    d = n ? 0.53 : 0.5878,
    h = 0.86,
    u = 0.932;
  return i <= r
    ? (i / r) * h
    : i <= d
      ? h + ((i - r) / (d - r)) * (u - h)
      : u + ((i - d) / (1 - d)) * (1 - u);
}
function At(t, n) {
  return t <= 0 ? 0 : t >= 1 ? 1 : Math.floor(t * n) / n;
}
function it(t) {
  let n = t?.parentElement ?? null;
  for (; n && n !== document.body; ) {
    let i = window.getComputedStyle(n),
      r = i.overflowY || i.overflow;
    if (/(auto|scroll|overlay)/.test(r)) return n;
    n = n.parentElement;
  }
  return window;
}
function rt(t) {
  if (t === window)
    return {
      top: 0,
      height: window.innerHeight || document.documentElement.clientHeight || 1,
    };
  let n = t.getBoundingClientRect();
  return { top: n.top, height: t.clientHeight || n.height || 1 };
}
function x(t) {
  return Number.isFinite(t) ? t.toFixed(4) : "0";
}
function l(
  t,
  {
    opacity: n = 0,
    x: i = 0,
    y: r = 0,
    scale: d = 1,
    rotate: h = 0,
    leftPercent: u = null,
    topPercent: I = null,
    clipTop: e = null,
    clipBottom: q = null,
  } = {},
) {
  if (!t) return;
  let O = n > 0.001;
  (t.style.setProperty("--opacity", x(v(n))),
    t.style.setProperty("--x", `${x(i)}px`),
    t.style.setProperty("--y", `${x(r)}px`),
    t.style.setProperty("--scale", x(d)),
    t.style.setProperty("--rotate", `${x(h)}deg`),
    u == null
      ? t.style.removeProperty("--left")
      : t.style.setProperty("--left", `${x(u)}%`),
    I == null
      ? t.style.removeProperty("--top")
      : t.style.setProperty("--top", `${x(I)}%`),
    e == null
      ? t.style.removeProperty("--clip-top")
      : t.style.setProperty("--clip-top", `${x(v(e, 0, 100))}%`),
    q == null
      ? t.style.removeProperty("--clip-bottom")
      : t.style.setProperty("--clip-bottom", `${x(v(q, 0, 100))}%`),
    (t.style.visibility = O ? "visible" : "hidden"));
}
function H(t, { opacity: n = 0, x: i = 0, y: r = 0 } = {}) {
  if (!t) return;
  let d = n > 0.001;
  (t.style.setProperty("--opacity", x(v(n))),
    t.style.setProperty("--x", `${x(i)}px`),
    t.style.setProperty("--y", `${x(r)}px`),
    (t.style.visibility = d ? "visible" : "hidden"));
}
function X(t, n) {
  t && t.textContent !== n && (t.textContent = n);
}
var at = "Eyes collect light and turn it into signals for the brain",
  st = "Cornea and lens focus light onto the back of the eye",
  ct = `At the back of the eye
is the retina`,
  lt =
    "This is like a sensor or film in a camera which turns the light into electrical signals",
  ut = "They are passed to the brain down the optic nerve",
  dt = "The brain then creates vision from these signals",
  yt =
    "The retina works like a camera sensor. It changes light into electrical signals that travel through the optic nerve to the brain. The brain creates vision from these signals.",
  Tt = 430;
function B(t) {
  return String(t ?? "")
    .replace(
      /<br\s*\/?>/gi,
      `
`,
    )
    .replace(/&nbsp;/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(
      /\n{3,}/g,
      `

`,
    )
    .trim();
}
function G({ splitFinal: t = !1 } = {}) {
  let n = { intro: at, worldFocus: st, worldRetina: ct, final: yt };
  return t ? { ...n, finalIntro: lt, finalTract: ut, finalBrain: dt } : n;
}
async function Pt(t = j(), { splitFinal: n = !1 } = {}) {
  let i = await et(t),
    r = {
      intro: B(L(i, "i18nExtra.visualsystem_step0")) || at,
      worldFocus: B(L(i, "i18nExtra.visualsystem_step1")) || st,
      worldRetina: B(L(i, "i18nExtra.visualsystem_step2")) || ct,
      final: B(L(i, "i18nExtra.visualsystem_step3")) || yt,
    };
  return n
    ? {
        ...r,
        finalIntro: B(L(i, "i18nExtra.visualsystem_step3_intro")) || lt,
        finalTract: B(L(i, "i18nExtra.visualsystem_step3_tract")) || ut,
        finalBrain: B(L(i, "i18nExtra.visualsystem_step3_brain")) || dt,
      }
    : r;
}
function Lt(
  t,
  { splitFinal: n = !1, tractProgress: i = 0, tract2Progress: r = 0 } = {},
) {
  return n
    ? r > 0.001
      ? t.finalBrain
      : i > 0.001
        ? t.finalTract
        : t.finalIntro
    : t.final;
}
function Ot(t, n = 0, i = 0) {
  if (!t?.length) return;
  let r = Math.max(0, Math.min(t.length - 1, Math.floor(Number(n) || 0)));
  (t[0]
    ?.closest?.("[data-vs-progress]")
    ?.style.setProperty("--vs-story-progress", x(v(i))),
    t.forEach((h, u) => {
      (h.classList.toggle("is-active", u <= r),
        h.classList.toggle("is-complete", u < r));
    }));
}
function ot(t, n, i, r = !1, d = G(), { splitFinal: h = !1 } = {}) {
  let u = t.scene?.getBoundingClientRect?.().width || 0,
    I = u > 0 ? u / Tt : 1,
    e = (Et) => Et * I;
  t.scene && t.scene.style.setProperty("--vs-scene-scale", x(I));
  let q = _t(n, r),
    s = i ? Math.round(q * 14) / 14 : q,
    y = r ? 0.02 : 0,
    w = c(s, Math.max(0, 0.02 - y), Math.max(0, 0.16 - y), E),
    a = c(s, 0.4, 0.5, A),
    f = c(s, 0.55, 0.66, A),
    g = c(s, 0.7, 0.78, E),
    m = c(s, 0.7, 0.78, E),
    p = c(s, 0.79, 0.85, A),
    b = c(s, 0.885, 0.95, E),
    _ = c(s, 0.855, 0.92, A),
    S = c(s, 0.895, 0.94, E),
    C = c(s, 0.916, 0.961, E),
    T = c(s, 0.966, 1),
    M = c(T, 0.08, 0.48, E),
    F = c(T, 0.55, 0.62, E),
    pt = c(T, 0.72, 0.97, E),
    vt = c(T, h ? 0.94 : 0.985, 1, A),
    J = i ? Math.round(M * 28) / 28 : At(M, 28),
    D = v(pt),
    V = c(D, 0.45, 0.62, E),
    gt = v(1 - g),
    N = v(a * (1 - S)),
    bt = v(f * (1 - m)),
    wt = v(p * (1 - b)),
    mt = v(_),
    R = v(C),
    P = o(0, e(h ? -240 : -140), vt),
    Y = v(c(s, 0.02, 0.5, E) * 0.5 + c(s, 0.5, 0.961, E) * 0.5),
    St = Y >= 0.995 ? 2 : Y >= 0.5 ? 1 : 0;
  Ot(t.progressSteps, St, Y);
  let z = c(s, Math.max(0, 0.18 - y), Math.max(0, 0.24 - y), A),
    W = c(s, Math.max(0, 0.2 - y), Math.max(0, 0.26 - y), A),
    U = c(s, Math.max(0, 0.23 - y), Math.max(0, 0.29 - y), A),
    K = c(s, Math.max(0, 0.245 - y), Math.max(0, 0.305 - y), A),
    $ = v(1 - g),
    qt = c(n, 0.001, 0.018, A),
    Z = c(s, 0.405, 0.47, E),
    Ct = v(1 - Z),
    tt = c(s, 0.56, 0.6, A),
    xt = v(tt * (1 - g)),
    It = R;
  (l(t.scrollCue, { opacity: 1 - qt, y: 0 }),
    X(t.introCaptionText, d.intro),
    l(t.introCaption, { opacity: Ct, y: o(0, e(-12), Z) }),
    l(t.background, { opacity: N, y: o(e(-180), 0, a) + o(0, e(-170), S) }));
  let k = N;
  (l(t.cloud1, {
    opacity: k,
    x: o(e(-96), 0, a) + o(0, e(-96), S),
    y: o(e(-18), 0, a),
    scale: 0.98,
  }),
    l(t.cloud2, {
      opacity: k,
      x: o(e(-64), 0, a) + o(0, e(-64), S),
      y: o(e(-10), 0, a),
      scale: 0.84,
    }),
    l(t.cloud3, {
      opacity: k,
      x: o(e(72), 0, a) + o(0, e(72), S),
      y: o(e(-8), 0, a),
      scale: 0.86,
    }),
    l(t.cloud4, {
      opacity: k,
      x: o(e(112), 0, a) + o(0, e(112), S),
      y: o(e(-16), 0, a),
      scale: 1.02,
    }),
    l(t.cloud5, {
      opacity: k,
      x: o(e(92), 0, a) + o(0, e(92), S),
      y: o(e(-10), 0, a),
      scale: 1.04,
    }),
    l(t.sun, {
      opacity: N,
      y: o(e(-120), 0, a) + o(0, e(-120), S),
      scale: o(0.88, 1, a),
    }),
    l(t.grass1, {
      opacity: N,
      x: o(e(-120), 0, a) + o(0, e(-120), S),
      y: o(e(14), 0, a),
    }),
    l(t.grass2, {
      opacity: N,
      x: o(e(-78), 0, a) + o(0, e(-78), S),
      y: o(e(10), 0, a),
    }),
    l(t.grass3, {
      opacity: N,
      x: o(e(86), 0, a) + o(0, e(86), S),
      y: o(e(12), 0, a),
    }),
    l(t.grass4, {
      opacity: N,
      x: o(e(118), 0, a) + o(0, e(118), S),
      y: o(e(8), 0, a),
    }),
    l(t.worldLight, {
      opacity: bt,
      y: o(e(-12), 0, f),
      scale: 0.8,
      clipBottom: 100 - f * 100,
    }),
    l(t.worldEye, {
      opacity: gt,
      x: 0,
      y: 0,
      scale: o(0.82, 0.98, w),
      rotate: o(-90, 0, w),
    }),
    X(t.worldCaptionText, s < 0.685 ? d.worldFocus : d.worldRetina),
    l(t.worldCaption, { opacity: xt, y: o(e(12), 0, tt) }),
    H(t.corneaLabel, { opacity: z * $, x: o(e(-10), 0, z), y: o(e(16), 0, z) }),
    H(t.lensLabel, { opacity: W * $, x: o(e(-8), 0, W), y: o(e(14), 0, W) }),
    H(t.retinaLabel, { opacity: U * $, x: o(e(-8), 0, U), y: o(e(14), 0, U) }),
    H(t.opticNerveLabel, {
      opacity: K * $,
      x: o(e(8), 0, K),
      y: o(e(14), 0, K),
    }),
    l(t.man, {
      opacity: wt,
      y: o(e(180), 0, p) + o(0, e(-22), b),
      scale: o(0.92, 1, p),
    }),
    l(t.face, {
      opacity: mt,
      y: o(e(16), 0, _) + P,
      leftPercent: o(50, 43.5, C),
      topPercent: o(44, 11, C),
      scale: o(0.86, 1, _),
    }),
    l(t.finalLight, {
      opacity: R,
      y: o(e(-18), 0, C) + P,
      scale: 0.8,
      clipBottom: 100 - C * 100,
    }),
    l(t.finalEye, {
      opacity: R,
      y: o(e(18), 0, C) + P,
      scale: o(0.92, 0.98, C),
      rotate: 0,
    }),
    l(t.brain, {
      opacity: R,
      y: o(e(260), e(-820), C) + P,
      leftPercent: null,
      scale: o(0.92, 1, C),
    }),
    l(t.facebrain, {
      opacity: R * V,
      y: o(e(18), e(h ? -50 : 0), V) + P,
      leftPercent: null,
      scale: o(0.92, 1, V),
    }),
    l(t.tract, { opacity: R * (1 - F), y: P, clipBottom: 100 - J * 100 }),
    X(
      t.finalCaptionText,
      Lt(d, { splitFinal: h, tractProgress: J, tract2Progress: D }),
    ),
    l(t.finalCaption, { opacity: It, y: o(e(10), 0, C) + P }),
    l(t.tract2, {
      opacity: R * (D > 0.001 ? 1 : 0),
      y: P,
      leftPercent: null,
      clipBottom: 100 - D * 100,
    }));
}
function ht(t) {
  if (!t) return;
  typeof t._vsCleanup == "function" && t._vsCleanup();
  let n = t.querySelector(".vs-story");
  if (!n) return;
  let i = {
      scene: t.querySelector(".vs-scene"),
      scrollCue: t.querySelector('[data-vs="scrollCue"]'),
      introCaption: t.querySelector('[data-vs="introCaption"]'),
      introCaptionText: t.querySelector(
        '[data-vs="introCaption"] .vs-caption__body',
      ),
      worldCaption: t.querySelector('[data-vs="worldCaption"]'),
      worldCaptionText: t.querySelector('[data-vs="worldCaptionText"]'),
      finalCaption: t.querySelector('[data-vs="finalCaption"]'),
      finalCaptionText: t.querySelector('[data-vs="finalCaptionText"]'),
      background: t.querySelector('[data-vs="background"]'),
      cloud1: t.querySelector('[data-vs="cloud1"]'),
      cloud2: t.querySelector('[data-vs="cloud2"]'),
      cloud3: t.querySelector('[data-vs="cloud3"]'),
      cloud4: t.querySelector('[data-vs="cloud4"]'),
      cloud5: t.querySelector('[data-vs="cloud5"]'),
      sun: t.querySelector('[data-vs="sun"]'),
      grass1: t.querySelector('[data-vs="grass1"]'),
      grass2: t.querySelector('[data-vs="grass2"]'),
      grass3: t.querySelector('[data-vs="grass3"]'),
      grass4: t.querySelector('[data-vs="grass4"]'),
      worldLight: t.querySelector('[data-vs="worldLight"]'),
      worldEye: t.querySelector('[data-vs="worldEye"]'),
      corneaLabel: t.querySelector('[data-vs="corneaLabel"]'),
      lensLabel: t.querySelector('[data-vs="lensLabel"]'),
      retinaLabel: t.querySelector('[data-vs="retinaLabel"]'),
      opticNerveLabel: t.querySelector('[data-vs="opticNerveLabel"]'),
      man: t.querySelector('[data-vs="man"]'),
      face: t.querySelector('[data-vs="face"]'),
      finalLight: t.querySelector('[data-vs="finalLight"]'),
      finalEye: t.querySelector('[data-vs="finalEye"]'),
      brain: t.querySelector('[data-vs="brain"]'),
      facebrain: t.querySelector('[data-vs="facebrain"]'),
      tract: t.querySelector('[data-vs="tract"]'),
      tract2: t.querySelector('[data-vs="tract2"]'),
      progressSteps: Array.from(t.querySelectorAll("[data-vs-progress-step]")),
    },
    r = new AbortController(),
    { signal: d } = r,
    h = it(t),
    u = window.matchMedia("(prefers-reduced-motion: reduce)"),
    I = window.matchMedia("(max-width: 767px)"),
    e = t.id === "childhoodEyeBrainImagesPage",
    q = 0,
    O = -1,
    s = () => {},
    y = G({ splitFinal: e });
  function w() {
    q ||
      (q = window.requestAnimationFrame(() => {
        q = 0;
        let g = rt(h),
          m = n.getBoundingClientRect(),
          p = Math.max(m.height - g.height, 1),
          b = v((g.top - m.top) / p);
        Math.abs(b - O) < 5e-4 ||
          ((O = b), ot(i, b, u.matches, I.matches, y, { splitFinal: e }));
      }));
  }
  async function a() {
    try {
      y = await Pt(j(), { splitFinal: e });
    } catch {
      y = G({ splitFinal: e });
    }
    w();
  }
  let f = (g, m, p, b = {}) => {
    g?.addEventListener && g.addEventListener(m, p, { ...b, signal: d });
  };
  (h === window
    ? f(window, "scroll", w, { passive: !0 })
    : f(h, "scroll", w, { passive: !0 }),
    f(window, "resize", w, { passive: !0 }),
    f(window, "orientationchange", w, { passive: !0 }),
    f(document, "i18n:languageChanged", () => {
      a();
    }),
    typeof u.addEventListener == "function"
      ? u.addEventListener("change", w, { signal: d })
      : typeof u.addListener == "function" &&
        (u.addListener(w), (s = () => u.removeListener(w))),
    t.querySelectorAll("img").forEach((g) => {
      g.complete || f(g, "load", w, { once: !0 });
    }),
    (t._vsCleanup = () => {
      (r.abort(),
        s(),
        q && (window.cancelAnimationFrame(q), (q = 0)),
        delete t._vsCleanup);
    }),
    ot(i, 0, u.matches, I.matches, y, { splitFinal: e }),
    w(),
    window.requestAnimationFrame(w),
    a());
}
var Q = [
    "Any concerns with vision / appearance of eyes?",
    "Any normal or abnormal visual behaviours?",
    "Red or painful eyes?",
    "Any issues with pregnancy?",
    "Any issues with birth?",
    "Was the child born premature?",
    "Any serious illness?",
    "Any concerns about general development?",
    "Any concerns about hearing or speech?",
    "Any concerns with movement?",
  ],
  Mt = [
    "auto.childhoodeyebrainimages.question_1",
    "auto.childhoodeyebrainimages.question_2",
    "auto.childhoodeyebrainimages.question_3",
    "auto.childhoodeyebrainimages.question_4",
    "auto.childhoodeyebrainimages.question_5",
    "auto.childhoodeyebrainimages.question_6",
    "auto.childhoodeyebrainimages.question_7",
    "auto.childhoodeyebrainimages.question_8",
    "auto.childhoodeyebrainimages.question_9",
    "auto.childhoodeyebrainimages.question_10",
  ];
function ft() {
  let t = document.getElementById("childhoodAskQuestionsObservePage");
  if (!t) return;
  typeof t._childhoodQnoCleanup == "function" && t._childhoodQnoCleanup();
  let n = t.querySelector("[data-childhood-qno-story]"),
    i = Array.from(t.querySelectorAll("[data-qno-step]")),
    r = t.querySelector('[data-qno="scrollCue"]'),
    d = t.querySelector('[data-qno="questionsScene"]'),
    h = t.querySelector('[data-qno="observeScene"]'),
    u = t.querySelector('[data-qno="questionBubble"]'),
    I = t.querySelector('[data-qno="questionText"]'),
    e = Array.from(t.querySelectorAll("[data-qno-observe-item]"));
  if (!n || i.length === 0 || !r || !d || !h || !u || !I || e.length === 0)
    return;
  let q = new AbortController(),
    { signal: O } = q,
    s = it(t),
    y = 0,
    w = -1;
  function a(m) {
    let p = Math.max(0, Math.min(m, i.length - 1)),
      b = p <= Q.length,
      _ = Math.max(0, Math.min(p - 1, Q.length - 1)),
      S = Math.max(0, p - Q.length);
    ((t.dataset.qnoStep = String(p)),
      r.classList.toggle("is-hidden", p > 0),
      d.classList.toggle("is-active", b),
      h.classList.toggle("is-active", !b));
    let C = p > 0 && p <= Q.length;
    (u.classList.toggle("is-visible", C),
      C &&
        (I.setAttribute("data-i18n", Mt[_]),
        X(I, Q[_]),
        window.I18N?.applyTranslations?.(I)),
      e.forEach((T, M) => {
        let F = M < S;
        (T.classList.toggle("is-visible", F),
          T.classList.toggle("is-current", M === S - 1));
      }));
  }
  function f() {
    y ||
      (y = window.requestAnimationFrame(() => {
        y = 0;
        let m = rt(s),
          p = m.top + m.height * 0.48,
          b = 0,
          _ = Number.POSITIVE_INFINITY;
        (i.forEach((S, C) => {
          let T = S.getBoundingClientRect(),
            M = T.top + T.height * 0.5,
            F = Math.abs(M - p);
          F < _ && ((_ = F), (b = C));
        }),
          b !== w && ((w = b), a(b)));
      }));
  }
  let g = (m, p, b, _ = {}) => {
    m?.addEventListener && m.addEventListener(p, b, { ..._, signal: O });
  };
  (s === window
    ? g(window, "scroll", f, { passive: !0 })
    : g(s, "scroll", f, { passive: !0 }),
    g(window, "resize", f, { passive: !0 }),
    g(window, "orientationchange", f, { passive: !0 }),
    t.querySelectorAll("img").forEach((m) => {
      m.complete || g(m, "load", f, { once: !0 });
    }),
    (t._childhoodQnoCleanup = () => {
      (q.abort(),
        y && (window.cancelAnimationFrame(y), (y = 0)),
        delete t._childhoodQnoCleanup);
    }),
    a(0),
    f(),
    window.requestAnimationFrame(f),
    window.requestAnimationFrame(() => window.requestAnimationFrame(f)));
}
var nt = !1;
function Nt() {
  nt ||
    ((nt = !0),
    document.addEventListener("page:shown", (t) => {
      let n = t?.detail?.id;
      (n !== "visualsystemeyesbrainPage" &&
        n !== "childhoodEyeBrainImagesPage" &&
        n !== "childhoodAskQuestionsObservePage") ||
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            (ht(
              document.getElementById("visualsystemeyesbrainPage") ||
                document.getElementById("childhoodEyeBrainImagesPage"),
            ),
              n === "childhoodAskQuestionsObservePage" && ft());
          });
        });
    }));
}
function Bt() {
  (ht(
    document.getElementById("visualsystemeyesbrainPage") ||
      document.getElementById("childhoodEyeBrainImagesPage"),
  ),
    ft(),
    Nt());
}
export { Bt as initializeVisualSystemEyesBrain };
