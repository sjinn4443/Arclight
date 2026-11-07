import { a as S, b as L, d as N, e as C } from "./chunk-5O6BKJQI.js";
import { a as M, c as I, d as z } from "./chunk-KIQ7J7XB.js";
import "./chunk-VKQVMSQC.js";
import { s as T } from "./chunk-C3DWFWW5.js";
import "./chunk-P2HPNKQY.js";
import "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
var P,
  R = () => {},
  b = (e, r) => window.I18N?.t?.(e, r) || r,
  q = (e) => window.I18N?.translateLiteral?.(e, e) || e,
  a = (e, r, o) => {
    let i = document.createElement(e);
    return (r && (i.className = r), o && (i.textContent = o), i);
  };
function A(e, r, o) {
  return ((e.dataset.i18n = r), (e.textContent = b(r, o)), e);
}
function B() {
  return (
    P ||
      (P = fetch("/data/ears-assets.json")
        .then((e) => {
          if (!e.ok) throw new Error("Ears materials unavailable");
          return e.json();
        })
        .catch((e) => {
          throw ((P = null), e);
        })),
    P
  );
}
function E(e, r, o = "") {
  let i = a("button", o, e);
  return ((i.type = "button"), i.addEventListener("click", r), i);
}
function W(e, r) {
  let o = a("div", "pupils-levels");
  (L[e].groups.forEach((i, d) => {
    if (d > 0) {
      let n = a("div", "pupils-dots");
      (n.setAttribute("aria-hidden", "true"),
        n.append(a("span"), a("span")),
        o.append(n));
    }
    let u = a("section", `pupil-level pupil-level--${i.level}`),
      c = A(
        a("div", "pupil-level__cap"),
        `auto.videos.${i.level}`,
        i.level === "primary" ? "Primary" : "Intermediate",
      );
    u.setAttribute("aria-label", c.textContent);
    let p = a("div", "ear-lesson-list");
    (i.lessons.forEach((n) => {
      let g = S[n],
        t =
          g.type === "pdf" || g.type === "download"
            ? "pdf"
            : g.type === "video"
              ? "video"
              : "scrollytelling",
        s = E("", () => T(n), `lesson-row lesson-row--${t}`);
      ((s.dataset.target = n), (s.dataset.route = n));
      let m = a("span", "thumb");
      m.setAttribute("aria-hidden", "true");
      let v = a("span", "lesson-main"),
        f = a("span", "lesson-top"),
        h = A(a("span", "lesson-type"), `ears.content.${n}`, g.title);
      ((h.id = `${n}-label`),
        f.append(h),
        g.duration && f.append(a("span", "lesson-meta", `| ${g.duration}`)),
        (s.title = C(n)));
      let l = a("span", "lesson-progress");
      (l.setAttribute("role", "progressbar"),
        l.setAttribute("aria-labelledby", h.id),
        l.setAttribute("aria-valuemin", "0"),
        l.setAttribute("aria-valuemax", "100"),
        l.setAttribute("aria-valuenow", "0"),
        l.append(a("span", "lesson-progress__fill")),
        v.append(f, l));
      let y = A(
        a("span", "lesson-cta"),
        "primaryEarCareWorkshop.start",
        "Start >",
      );
      (s.append(m, v, y), p.append(s));
    }),
      u.append(c, p),
      o.append(u));
  }),
    r.append(o),
    z(r));
}
function Z(e, r) {
  let o = N[e],
    i = L[o]?.groups.flatMap((n) => n.lessons) || [],
    d = i.indexOf(e),
    u = a("nav", "ear-flow medical-next-wrap");
  u.setAttribute(
    "aria-label",
    b("primaryEarCareWorkshop.lesson_navigation", "Lesson navigation"),
  );
  let c = A(
      E("", () => T(i[d - 1] || o), "medical-prev-btn"),
      "i18nLiteral.< Previous",
      "< Previous",
    ),
    p = A(
      E("", () => T(i[d + 1] || o), "medical-next-btn is-ready"),
      "i18nLiteral.Next >",
      "Next >",
    );
  (u.append(c, p), r.append(u));
}
function V(e, r) {
  let o = a("dialog", "ear-image-dialog");
  o.setAttribute("aria-label", e.alt);
  let i = a("div", "ear-image-tools"),
    d = a("div", "ear-image-frame"),
    u = e.cloneNode();
  u.loading = "eager";
  let c = 1,
    p = E("\u2212", () => {
      ((c = Math.max(1, c - 0.5)), (u.style.width = `${100 * c}%`));
    });
  p.setAttribute("aria-label", b("ears.viewer.zoomOut", "Zoom out"));
  let n = E("+", () => {
    ((c = Math.min(4, c + 0.5)), (u.style.width = `${100 * c}%`));
  });
  n.setAttribute("aria-label", b("ears.viewer.zoomIn", "Zoom in"));
  let g = E(b("primaryEarCareWorkshop.close", "Close"), () => o.close()),
    t = () => {
      (o.close(), o.remove());
    };
  (r.addEventListener("abort", t, { once: !0 }),
    o.addEventListener(
      "close",
      () => {
        (r.removeEventListener("abort", t), o.remove());
      },
      { once: !0 },
    ),
    i.append(p, n, g),
    d.append(u),
    o.append(i, d),
    document.body.append(o),
    o.showModal());
}
function D(e, r, o, i) {
  let d = a(
      "section",
      "diabetic-screening-lesson diabetic-screening-lesson--tight-hero",
    ),
    u = a("header", "diabetic-screening-hero"),
    c = N[e];
  u.append(
    A(a("p", "diabetic-screening-eyebrow"), `ears.content.${c}`, L[c].title),
    A(a("h2"), `ears.content.${e}`, S[e].title),
  );
  let p = a("div", "ear-learning-stack diabetic-screening-stack");
  (o.forEach((t, s) => {
    let m = a("article", "ear-learning-panel diabetic-screening-panel"),
      v = a("div", "diabetic-screening-panel__text");
    if (
      (v.append(
        a(
          "span",
          "ear-step diabetic-screening-step",
          String(s + 1).padStart(2, "0"),
        ),
      ),
      t.title && v.append(a("h3", "", q(t.title))),
      t.text && v.append(a("p", "", q(t.text))),
      m.append(v),
      t.image)
    ) {
      let f = a("figure", "medical-learning-image"),
        h = a("img");
      ((h.src = t.image),
        (h.alt = q(t.caption || t.title || S[e].title)),
        (h.loading = s === 0 ? "eager" : "lazy"));
      let l = E("", () => V(h, i), "ear-figure-open");
      (l.setAttribute(
        "aria-label",
        `${b("ears.viewer.zoomIn", "Zoom in")}: ${h.alt}`,
      ),
        l.append(h),
        f.append(l),
        t.caption && f.append(a("figcaption", "", q(t.caption))),
        m.append(f));
    }
    p.append(m);
  }),
    d.append(u, p),
    r.append(d));
  let n = new Set(),
    g = new IntersectionObserver(
      (t) => {
        (t
          .filter((s) => s.isIntersecting)
          .forEach((s) => {
            (n.add(s.target),
              p
                .querySelectorAll(".is-current")
                .forEach((m) => m.classList.remove("is-current")),
              s.target.classList.add("is-current"));
          }),
          I(e, (n.size / o.length) * 100));
      },
      { threshold: 0.35 },
    );
  (p.querySelectorAll("article").forEach((t) => g.observe(t)),
    i.addEventListener("abort", () => g.disconnect(), { once: !0 }));
}
function G(e, r, o, i, d) {
  let u = i.documents[o.asset];
  if (!u) throw new Error("Document unavailable");
  let c = o.pages || u.pages.map((w, $) => $ + 1),
    p = a("section", "ear-reader"),
    n = a("div", "ear-reader-toolbar"),
    g = a("div", "ear-reader-frame");
  ((g.tabIndex = 0),
    g.setAttribute("role", "region"),
    g.setAttribute("aria-label", C(e)));
  let t = a("img");
  t.draggable = !1;
  let s = a("p", "ear-reader-status");
  s.setAttribute("role", "status");
  let m = a("select");
  (m.setAttribute("aria-label", b("ears.viewer.page", "Page")),
    c.forEach((w) => {
      let $ = a("option", "", `${b("ears.viewer.page", "Page")} ${w}`);
      (($.value = String(w)), m.append($));
    }));
  let v = 0,
    f = 1,
    h = new Set();
  try {
    let w = Number(sessionStorage.getItem(`ears:reader:${e}`));
    (c.includes(w) && (v = c.indexOf(w)),
      JSON.parse(localStorage.getItem(`ears:read-pages:${e}`) || "[]").forEach(
        ($) => {
          c.includes($) && h.add($);
        },
      ));
  } catch {}
  let l = () => {
      let w = c[v];
      ((t.alt = `${C(e)} \u2014 ${b("ears.viewer.page", "Page")} ${w}`),
        (t.src = u.pages[w - 1]),
        (t.style.width = `${f * 100}%`),
        (g.scrollTop = 0),
        (g.scrollLeft = 0),
        (m.value = String(w)),
        (y.disabled = v === 0),
        (x.disabled = v === c.length - 1),
        (s.textContent = `${v + 1} / ${c.length} \xB7 ${b("ears.viewer.sourcePage", "Source page")} ${w}`));
      try {
        sessionStorage.setItem(`ears:reader:${e}`, String(w));
      } catch {}
    },
    y = E(b("primaryEarCareWorkshop.previous", "Previous"), () => {
      (v--, l());
    }),
    x = E(b("primaryEarCareWorkshop.next", "Next"), () => {
      (v++, l());
    });
  m.addEventListener("change", () => {
    ((v = c.indexOf(Number(m.value))), l());
  });
  let k = E("\u2212", () => {
    ((f = Math.max(1, f - 0.5)), (t.style.width = `${f * 100}%`));
  });
  k.setAttribute("aria-label", b("ears.viewer.zoomOut", "Zoom out"));
  let _ = E("+", () => {
    ((f = Math.min(4, f + 0.5)), (t.style.width = `${f * 100}%`));
  });
  _.setAttribute("aria-label", b("ears.viewer.zoomIn", "Zoom in"));
  let O = a("a", "", b("ears.viewer.download", "Download original"));
  ((O.href = u.pdf),
    (O.download = ""),
    t.addEventListener("load", () => {
      if (!d.aborted) {
        h.add(c[v]);
        try {
          localStorage.setItem(`ears:read-pages:${e}`, JSON.stringify([...h]));
        } catch {}
        I(e, (h.size / c.length) * 100);
      }
    }),
    t.addEventListener("error", () => {
      s.textContent = b(
        "ears.viewer.unavailable",
        "This page could not be loaded. Try again or download the original.",
      );
    }),
    g.addEventListener("keydown", (w) => {
      (w.key === "ArrowRight" && !x.disabled && (w.preventDefault(), x.click()),
        w.key === "ArrowLeft" &&
          !y.disabled &&
          (w.preventDefault(), y.click()));
    }),
    n.append(y, m, x, k, _, O),
    g.append(t),
    p.append(n, g, s),
    r.append(p),
    l());
}
function j(e, r, o, i, d) {
  let u = i.videos[o.asset];
  if (!u) throw new Error("Video unavailable");
  let c = a("div", "ear-video-wrap"),
    p = a("div", "ear-quality tri-toggle");
  (p.setAttribute("role", "radiogroup"),
    p.setAttribute("aria-label", b("i18nExtra.video_mode", "Video quality")));
  let n = a("video");
  ((n.controls = !0),
    (n.playsInline = !0),
    (n.preload = "metadata"),
    n.setAttribute("aria-label", C(e)));
  let g = a("p", "ear-reader-status");
  g.setAttribute("role", "status");
  let t = "low",
    s = !1;
  try {
    t = localStorage.getItem(`videoMode:${e}`) === "high" ? "high" : "low";
  } catch {}
  let m = (l) => {
    let y = n.currentTime || 0,
      x = !n.paused;
    ((t = l),
      (p.dataset.active = l),
      p.querySelectorAll("button").forEach((k) => {
        let _ = k.dataset.mode === l;
        (k.setAttribute("aria-checked", String(_)), (k.tabIndex = _ ? 0 : -1));
      }),
      n.addEventListener(
        "loadedmetadata",
        () => {
          d.aborted ||
            ((n.currentTime = Math.min(
              y,
              Number.isFinite(n.duration) ? n.duration : y,
            )),
            x && n.play().catch(() => {}));
        },
        { once: !0, signal: d },
      ),
      (n.src = u[l]),
      n.load());
    try {
      localStorage.setItem(`videoMode:${e}`, l);
    } catch {}
  };
  (["low", "high"].forEach((l) => {
    let y = A(
      E(
        "",
        () => {
          ((s = !1), m(l));
        },
        "tri-toggle__btn",
      ),
      `i18nExtra.video_mode_${l}`,
      l,
    );
    ((y.dataset.mode = l), y.setAttribute("role", "radio"), p.append(y));
  }),
    p.append(a("div", "tri-toggle__knob")),
    p.lastElementChild.setAttribute("aria-hidden", "true"),
    p.addEventListener("keydown", (l) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(l.key)) return;
      l.preventDefault();
      let y =
        l.key === "Home"
          ? "low"
          : l.key === "End" || t === "low"
            ? "high"
            : "low";
      (p.querySelector(`[data-mode="${y}"]`).click(),
        p.querySelector(`[data-mode="${y}"]`).focus());
    }),
    n.addEventListener(
      "timeupdate",
      () => {
        n.duration > 0 &&
          I(e, Math.min(99, (n.currentTime / n.duration) * 100));
      },
      { signal: d },
    ),
    n.addEventListener("ended", () => I(e, 100), { signal: d }),
    n.addEventListener(
      "error",
      () => {
        s
          ? (g.textContent = b(
              "ears.viewer.videoUnavailable",
              "This video could not be loaded. Check your connection or downloaded content.",
            ))
          : ((s = !0), m(t === "low" ? "high" : "low"));
      },
      { signal: d },
    ),
    d.addEventListener(
      "abort",
      () => {
        (n.pause(), n.removeAttribute("src"), n.load());
      },
      { once: !0 },
    ));
  let v = r.closest(".page").querySelector(".eyes-topbar__icons");
  (v.insertBefore(p, v.querySelector(".menuBtn")),
    d.addEventListener("abort", () => p.remove(), { once: !0 }));
  let f = a("div", "video-header");
  f.append(A(a("h3"), `ears.content.${e}`, o.title));
  let h = a("div", "video-container");
  (h.append(n), c.append(f, h, g), r.append(c), m(t));
}
async function F(e) {
  R();
  let r = document.getElementById("earsContentPage");
  if (!r || (!L[e] && !S[e])) return;
  let o = new AbortController(),
    { signal: i } = o;
  R = () => o.abort();
  let d = r.querySelector(".ear-content-body");
  r.classList.toggle("ears-topic-page", !!L[e]);
  let u = S[e]?.type,
    c = u === "scroll" || u === "diagram";
  (r.classList.toggle("ears-lesson-page", !!u),
    r.classList.toggle("ears-guide-page", c),
    r.classList.toggle("ears-video-page", u === "video"),
    r.classList.toggle("ears-pdf-page", u === "pdf"));
  let p = r.querySelector(".container.pupils-container");
  (p.classList.toggle("diabetic-screening-page", c),
    p.classList.toggle("medical-students-screening-page", !!u));
  let n = L[N[e]]?.groups.find((t) => t.lessons.includes(e));
  ((r.dataset.earLevel = n?.level || "primary"), delete r.dataset.earReady);
  let g = r.querySelector(".menuBtn");
  if (
    (g?.addEventListener(
      "keydown",
      (t) => {
        (t.key === "Enter" || t.key === " ") && (t.preventDefault(), g.click());
      },
      { signal: i },
    ),
    d.replaceChildren(),
    A(
      r.querySelector(".ear-content-title"),
      `ears.content.${e}`,
      L[e]?.title || S[e]?.title,
    ),
    (r.dataset.earRoute = e),
    L[e])
  )
    W(e, d);
  else {
    let t = S[e];
    try {
      if (t.type === "scroll") D(e, d, t.sections, i);
      else if (t.type === "download") {
        let s = a(
          "a",
          "ear-download",
          b("ears.viewer.download", "Download original"),
        );
        ((s.href = t.asset),
          (s.download = ""),
          s.addEventListener("click", () => I(e, 100)),
          d.append(s));
      } else {
        let s = await B();
        if (i.aborted || !r.isConnected) return;
        if (t.type === "pdf") G(e, d, t, s, i);
        else if (t.type === "video") j(e, d, t, s, i);
        else if (t.type === "diagram") {
          let m = (s.decks[t.asset] || []).map((v, f) => ({
            image: v,
            title: t.captions[f] || t.title,
          }));
          if (!m.length) throw new Error("Diagrams unavailable");
          D(e, d, m, i);
        }
      }
    } catch {
      if (i.aborted) return;
      let s = a("div", "ear-load-error");
      (s.setAttribute("role", "alert"),
        s.append(
          a(
            "p",
            "",
            b(
              "ears.viewer.unavailable",
              "This page could not be loaded. Try again or download the original.",
            ),
          ),
          E(b("ears.viewer.retry", "Try again"), () => F(e)),
        ),
        d.append(s));
    }
    (Z(e, d), d.append(a("p", "ear-source", t.source)));
  }
  (window.I18N?.applyTranslations?.(r), (r.dataset.earReady = "true"));
}
window.addEventListener("page:loaded", () => R());
document.addEventListener(M, () =>
  z(document.getElementById("earsContentPage")),
);
export { F as initializeEarsContent };
