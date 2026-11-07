var L = null;
function g(t, n) {
  if (!t) return;
  let i = document.getElementById(n);
  i && t.replaceChildren(i.content.cloneNode(!0));
}
async function H() {
  if (typeof window.launchQuiz == "function") return window.launchQuiz();
  try {
    await import("./quiz-launcher-2V3LREYB.js");
  } catch (t) {
    console.warn("Failed to import quiz launcher:", t);
  }
  if (typeof window.launchQuiz == "function") return window.launchQuiz();
  try {
    (typeof loadPage == "function" && (await loadPage("quizzes")),
      typeof window.showPage == "function"
        ? window.showPage("directOphthalmoscopyQuizPage")
        : typeof minimalShowPage == "function" &&
          minimalShowPage("directOphthalmoscopyQuizPage"));
  } catch (t) {
    console.error("Failed to launch quiz:", t);
  }
}
function G(t) {
  let n = document.getElementById("customVideo");
  n && ((n.currentTime = t), n.play(), (L = null));
}
function le() {
  let t = !1,
    n = "",
    i = () => {
      let e =
          window.matchMedia && window.matchMedia("(pointer: coarse)").matches,
        c = navigator.maxTouchPoints || 0,
        o = Math.min(window.innerWidth, window.innerHeight) < 1024;
      return (e || c > 0) && o;
    },
    a = async () => {
      try {
        screen.orientation &&
          typeof screen.orientation.lock == "function" &&
          (await screen.orientation.lock("landscape"));
      } catch {}
    },
    l = async () => {
      try {
        screen.orientation &&
          typeof screen.orientation.unlock == "function" &&
          screen.orientation.unlock();
      } catch {}
    },
    u = async (e) => {
      let c = e;
      if (c.requestFullscreen) return c.requestFullscreen();
      if (c.webkitRequestFullscreen) return c.webkitRequestFullscreen();
      if (c.msRequestFullscreen) return c.msRequestFullscreen();
    },
    S = async () => {
      let e = document;
      if (e.exitFullscreen) return e.exitFullscreen();
      if (e.webkitExitFullscreen) return e.webkitExitFullscreen();
      if (e.msExitFullscreen) return e.msExitFullscreen();
    },
    h = () =>
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement ||
      null,
    b = (e) => {
      n = e?.closest?.(".page")?.id || "";
    },
    A = () => {
      n &&
        window.dispatchEvent(
          new CustomEvent("arclight:video-fullscreen-exit", {
            detail: { pageId: n },
          }),
        );
    },
    U = async (e) => {
      if (!i()) return;
      let c = e?.dataset?.preferContainerFullscreen === "true";
      if (!(e?.dataset?.preventAutoFullscreen === "true" && !c) && !h()) {
        if (
          ((t = !0), b(e), !c && typeof e.webkitEnterFullscreen == "function")
        )
          try {
            e.webkitEnterFullscreen();
          } catch {}
        if (!h()) {
          let o = (c && e.closest(".video-container")) || e;
          await u(o);
        }
        (await a(),
          setTimeout(() => {
            a();
          }, 250));
      }
    },
    T = async () => {
      t && ((t = !1), await l(), A());
    },
    B = async () => {
      h() || (await T());
    };
  (document.addEventListener("fullscreenchange", B),
    document.addEventListener("webkitfullscreenchange", B),
    document.addEventListener("MSFullscreenChange", B));
  let w = document.getElementById("customVideo");
  w &&
    !w.__wiredTimeupdate &&
    ((w.__wiredTimeupdate = !0), w.addEventListener("timeupdate", J));
  let x = document.querySelectorAll("video");
  x.forEach((e) => {
    e.__wiredPlayOnce ||
      ((e.__wiredPlayOnce = !0),
      e.addEventListener("play", () => {
        (e.__wiredIosFsEvents ||
          ((e.__wiredIosFsEvents = !0),
          e.addEventListener("webkitbeginfullscreen", async () => {
            i() && ((t = !0), b(e), await a());
          }),
          e.addEventListener("webkitendfullscreen", async () => {
            await T();
          })),
          x.forEach((c) => {
            c !== e && c.pause();
          }),
          U(e));
      }));
  });
  let F = Array.from(document.querySelectorAll("[data-video-share-btn]"));
  if (!F.length) return;
  let j = "https://arclightprojectshop.co.uk/",
    N = (e) => {
      if (!e) return "";
      try {
        return new URL(e, window.location.href).href;
      } catch {
        return String(e);
      }
    },
    R = (e) => {
      let c = e.getAttribute("data-video-share-url");
      if (c && c.trim()) return c.trim();
      let o = e.closest(".video-container"),
        r = o ? o.querySelector("video") : null;
      if (r && r.currentSrc) return r.currentSrc;
      if (r) {
        let s = r.querySelector("source"),
          d = (s && s.getAttribute("src")) || r.getAttribute("src") || "",
          f = N(d);
        if (f) return f;
      }
      return window.location.href;
    },
    z = async (e) => {
      try {
        return (await navigator.clipboard.writeText(e), !0);
      } catch {
        let o = document.createElement("textarea");
        ((o.value = e),
          o.setAttribute("readonly", ""),
          (o.style.position = "fixed"),
          (o.style.left = "-9999px"),
          document.body.appendChild(o),
          o.select());
        let r = document.execCommand("copy");
        return (document.body.removeChild(o), r);
      }
    },
    D = () => {
      let e = document.getElementById("videoShareMenu");
      if (e) return e;
      if (
        ((e = document
          .getElementById("videoShareMenuTemplate")
          ?.content.firstElementChild?.cloneNode(!0)),
        !e)
      ) {
        ((e = document.createElement("div")),
          (e.className = "video-share-menu"));
        let o = document.createElement("button");
        ((o.type = "button"),
          (o.className = "video-share-menu__item"),
          o.setAttribute("data-video-share-action", "share-video"),
          (o.textContent = "Share video"));
        let r = document.createElement("button");
        ((r.type = "button"),
          (r.className = "video-share-menu__item"),
          r.setAttribute("data-video-share-action", "shop"),
          (r.textContent = "Arclight Shop"),
          e.appendChild(o),
          e.appendChild(r));
      }
      if (
        ((e.id = "videoShareMenu"),
        (e.hidden = !0),
        (e.dataset.videoUrl = ""),
        (e.dataset.anchorBtnId = ""),
        document.body.appendChild(e),
        !e.__wiredClose)
      ) {
        e.__wiredClose = !0;
        let o = () => {
          ((e.hidden = !0),
            (e.dataset.videoUrl = ""),
            (e.dataset.anchorBtnId = ""));
        };
        (document.addEventListener("mousedown", (r) => {
          if (e.hidden) return;
          let s = r.target;
          if (!(s instanceof Element)) return;
          let d = e.dataset.anchorBtnId,
            f = d ? document.getElementById(d) : null,
            m = e.contains(s),
            y = f ? f.contains(s) : !1;
          !m && !y && o();
        }),
          document.addEventListener("page:shown", o),
          window.addEventListener("page:loaded", o),
          window.addEventListener("scroll", o, { passive: !0 }),
          window.addEventListener("resize", o),
          e.addEventListener("click", async (r) => {
            let s = r.target.closest("[data-video-share-action]");
            if (!s) return;
            let d = s.getAttribute("data-video-share-action"),
              f = e.dataset.videoUrl || window.location.href;
            if (d === "shop") {
              window.location.href = j;
              return;
            }
            if (d === "share-video") {
              if (navigator && typeof navigator.share == "function")
                try {
                  await navigator.share({
                    title: document.title || "Arclight video",
                    url: f,
                  });
                } catch {
                  await z(f);
                }
              else await z(f);
              o();
            }
          }));
      }
      return e;
    },
    Q = (e, c) => {
      e.style.position = "fixed";
      let o = e.hidden;
      (o && (e.hidden = !1), (e.style.visibility = "hidden"));
      let r = c.getBoundingClientRect(),
        s = e.getBoundingClientRect(),
        d = r.bottom + 8,
        f = r.left,
        m = 8,
        y = window.innerWidth,
        $ = window.innerHeight;
      (f + s.width > y - m && (f = Math.max(m, y - m - s.width)),
        d + s.height > $ - m && (d = Math.max(m, r.top - 8 - s.height)),
        (e.style.left = `${f}px`),
        (e.style.top = `${d}px`),
        (e.style.visibility = ""),
        o && (e.hidden = !0));
    };
  F.forEach((e, c) => {
    (e.id || (e.id = `videoShareBtn_${c}`),
      !e.__wiredShareMenuOpen &&
        ((e.__wiredShareMenuOpen = !0),
        e.addEventListener("click", (o) => {
          (o.preventDefault(),
            o.stopPropagation(),
            o.stopImmediatePropagation());
          let r = D(),
            s = r.dataset.anchorBtnId === e.id;
          if (!r.hidden && s) {
            ((r.hidden = !0),
              (r.dataset.videoUrl = ""),
              (r.dataset.anchorBtnId = ""));
            return;
          }
          let d = R(e);
          ((r.dataset.videoUrl = d),
            (r.dataset.anchorBtnId = e.id),
            Q(r, e),
            (r.hidden = !1));
        })));
  });
}
var C = !1;
function se() {
  if (C) return;
  C = !0;
  let t = { timestampBtn: W, noteBtn: K, folderBtn: Y, infoBtn: Z, quizBtn: H };
  for (let [n, i] of Object.entries(t)) {
    let a = document.getElementById(n);
    a &&
      !a.__wired &&
      ((a.__wired = !0),
      a.addEventListener("click", (l) => {
        l.preventDefault();
        let u = document.getElementById("customVideo");
        (u && u.pause(), i());
      }));
  }
}
function W() {
  E("timestampBtn");
  let t = document.getElementById("contentBox");
  t &&
    (g(t, "videoTimestampsTemplate"),
    t.querySelectorAll("[data-ts]").forEach((n) => {
      n.addEventListener("click", (i) => {
        i.preventDefault();
        let a = parseInt(n.getAttribute("data-ts"), 10) || 0;
        G(a);
      });
    }));
}
function K() {
  E("noteBtn");
  let t = document.getElementById("contentBox");
  t && g(t, "videoNoteTemplate");
}
function Y() {
  E("folderBtn");
  let t = document.getElementById("contentBox");
  t && g(t, "videoFilesTemplate");
}
function Z() {
  E("infoBtn");
  let t = document.getElementById("contentBox");
  t && g(t, "videoInfoTemplate");
}
function E(t) {
  document
    .querySelectorAll(".toolbar button")
    .forEach((i) => i.classList.remove("active"));
  let n = document.getElementById(t);
  n && n.classList.add("active");
}
function J() {
  let t = document.getElementById("customVideo");
  if (!t) return;
  let n = Math.floor(t.currentTime),
    i = document.getElementById("contentBox"),
    a = {
      22: {
        id: "eye-info",
        handler: () => {
          g(i, "videoEyeAnatomyTemplate");
        },
      },
      32: {
        id: "device-info",
        handler: () => {
          g(i, "videoDeviceOverviewTemplate");
        },
      },
    };
  a[n] &&
    L !== a[n].id &&
    ((L = a[n].id), t.pause(), a[n].handler(), setTimeout(() => t.play(), 5e3));
}
var X = "/video-localization/app-video-subtitles.json",
  O = {
    en: { label: "English" },
    am: { label: "Amharic" },
    ar: { label: "Arabic" },
    bn: { label: "Bangla" },
    ne: { label: "Nepali" },
    ny: { label: "Chichewa" },
    zh: { label: "Chinese" },
    fr: { label: "French" },
    ha: { label: "Hausa" },
    hi: { label: "Hindi" },
    ig: { label: "Igbo" },
    id: { label: "Indonesian" },
    rw: { label: "Kinyarwanda" },
    ko: { label: "Korean" },
    ln: { label: "Lingala" },
    lg: { label: "Luganda" },
    fa: { label: "Persian" },
    pt: { label: "Portuguese" },
    sn: { label: "Shona" },
    es: { label: "Spanish" },
    sw: { label: "Swahili" },
    te: { label: "Telugu" },
    ur: { label: "Urdu" },
    yo: { label: "Yoruba" },
    zu: { label: "Zulu" },
    lo: { label: "Lao" },
  },
  ee = Object.freeze({
    english: "en",
    amharic: "am",
    arabic: "ar",
    bangla: "bn",
    chichewa: "ny",
    chinese: "zh",
    french: "fr",
    hausa: "ha",
    hindi: "hi",
    nepali: "ne",
    igbo: "ig",
    indonesian: "id",
    kinyarwanda: "rw",
    korean: "ko",
    telugu: "te",
    lingala: "ln",
    luganda: "lg",
    persian: "fa",
    portuguese: "pt",
    shona: "sn",
    spanish: "es",
    swahili: "sw",
    urdu: "ur",
    yoruba: "yo",
    zulu: "zu",
    lao: "lo",
  }),
  k = null,
  P = !1,
  V = 0;
function p(t) {
  let n = String(t || "")
      .trim()
      .toLowerCase(),
    i = ee[n] || n;
  return Object.prototype.hasOwnProperty.call(O, i) ? i : "en";
}
function te() {
  try {
    let t = window.I18N?.getLanguage?.();
    if (t) return p(t);
  } catch {}
  try {
    let t = localStorage.getItem("prefLang");
    if (t) return p(t);
  } catch {}
  return p(document.documentElement.getAttribute("lang") || "en");
}
function ne(t) {
  return O[p(t)]?.label || "English";
}
function q(t) {
  let n = String(t || "").trim();
  if (!n) return "";
  try {
    n = new URL(n, window.location.href).pathname;
  } catch {
    n = n.split(/[?#]/)[0] || n;
  }
  try {
    n = decodeURIComponent(n);
  } catch {}
  return n
    .replace(/^\/+/, "")
    .replace(/^public\//, "")
    .replace(/[?#].*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}
function ie(t = {}) {
  let n = {};
  return (
    Object.entries(t || {}).forEach(([i, a]) => {
      if (!a || typeof a != "object") return;
      let l = q(i);
      if (!l) return;
      let u = {};
      (Object.entries(a.subtitles || {}).forEach(([S, h]) => {
        typeof h != "string" || !h.trim() || (u[p(S)] = h);
      }),
        Object.keys(u).length &&
          (n[l] = {
            subtitles: u,
            defaultSubtitleLang: p(a.defaultSubtitleLang || "en"),
          }));
    }),
    n
  );
}
async function oe() {
  return (
    k ||
      (k = (async () => {
        try {
          let t = await fetch(X, { cache: "no-store" });
          if (!t.ok)
            throw new Error(`failed to load subtitle catalog: ${t.status}`);
          return ie(await t.json());
        } catch (t) {
          return (console.warn("[videoSubtitles] catalog unavailable", t), {});
        }
      })()),
    k
  );
}
function re(t) {
  return [
    t.currentSrc,
    t.getAttribute("src"),
    ...Array.from(t.querySelectorAll("source")).map((i) =>
      i.getAttribute("src"),
    ),
  ]
    .map(q)
    .filter(Boolean);
}
function ae(t, n) {
  let i = t?.subtitles || {},
    a = p(n);
  return {
    lang:
      i[a] != null
        ? a
        : i[t.defaultSubtitleLang] != null
          ? t.defaultSubtitleLang
          : i.en != null
            ? "en"
            : Object.keys(i)[0] || "en",
    src: i[a] || i[t.defaultSubtitleLang] || i.en || Object.values(i)[0] || "",
  };
}
function I(t) {
  t.querySelectorAll("track[data-localized-video-subtitle='true']").forEach(
    (n) => n.remove(),
  );
}
function _(t, n) {
  try {
    Array.from(t.textTracks || []).forEach((i) => {
      let a = p(i.language || i.srclang || "");
      (i.kind === "captions" || i.kind === "subtitles") &&
        (i.mode = a === n ? "showing" : "disabled");
    });
  } catch {}
}
function ce(t, { lang: n, src: i }) {
  if (!t || !i) return;
  if (t.querySelector("track[data-childhood-pilot-subtitle='true']")) {
    I(t);
    return;
  }
  if (
    t.querySelector(
      `track[data-localized-video-subtitle='true'][srclang='${n}'][src='${i}']`,
    )
  ) {
    _(t, n);
    return;
  }
  I(t);
  try {
    ((t.playsInline = !0),
      t.setAttribute("playsinline", ""),
      t.setAttribute("webkit-playsinline", ""),
      t.getAttribute("crossorigin") ||
        t.setAttribute("crossorigin", "anonymous"));
  } catch {}
  let l = document.createElement("track");
  ((l.kind = "captions"),
    (l.label = ne(n)),
    (l.srclang = n),
    (l.src = i),
    (l.default = !0),
    l.setAttribute("kind", "captions"),
    l.setAttribute("default", ""),
    l.setAttribute("data-localized-video-subtitle", "true"),
    l.addEventListener(
      "load",
      () => {
        _(t, n);
        try {
          l.track && (l.track.mode = "showing");
        } catch {}
      },
      { once: !0 },
    ),
    t.appendChild(l),
    _(t, n));
}
async function M(t = document) {
  let n = await oe();
  if (!Object.keys(n).length) return;
  let i = t?.querySelectorAll ? t : document,
    a = [
      ...(i.matches?.("video") ? [i] : []),
      ...Array.from(i.querySelectorAll?.("video") || []),
    ],
    l = te();
  a.forEach((u) => {
    if (u.querySelector("track[data-childhood-pilot-subtitle='true']")) {
      I(u);
      return;
    }
    let h = re(u).find((A) => n[A]);
    if (!h) return;
    let b = ae(n[h], l);
    ce(u, b);
  });
}
function v(t = document) {
  (window.clearTimeout(V),
    (V = window.setTimeout(() => {
      M(t);
    }, 80)));
}
function de() {
  P ||
    ((P = !0),
    v(document),
    window.addEventListener("page:loaded", () => {
      (v(document), window.setTimeout(() => M(document), 300));
    }),
    document.addEventListener("page:shown", () => {
      v(document);
    }),
    window.addEventListener("i18n:languageChanged", () => {
      v(document);
    }));
}
export { le as a, se as b, M as c, de as d };
