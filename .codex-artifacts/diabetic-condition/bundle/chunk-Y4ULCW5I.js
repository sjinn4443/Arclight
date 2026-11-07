import { b as h, c as x } from "./chunk-KIQ7J7XB.js";
import { b as A } from "./chunk-VKQVMSQC.js";
var R = "#15e115",
  N = "#f25600",
  y = "primaryWorkshop:activeLesson",
  m = {
    pecWorkshop: "pecWorkshopPage",
    primaryEarCareWorkshop: "primaryEarCareWorkshopPage",
    paediatricSurgicalEyeEarWorkshop: "paediatricSurgicalEyeEarWorkshopPage",
  },
  T = !1,
  W = null,
  f = (e, s) => {
    try {
      return JSON.parse(e.getItem(s) || "null");
    } catch {
      return null;
    }
  },
  E = (e, s, r) => {
    try {
      e.setItem(s, JSON.stringify(r));
    } catch {}
  },
  L = (e, s) => `primaryWorkshop:progress:${e}:${s}`,
  S = (e) => Math.max(0, Math.min(100, Number(e) || 0)),
  o = f(sessionStorage, y);
function b(e, s) {
  return e === "paediatricSurgicalEyeEarWorkshop" ||
    (e === "pecWorkshop" && s.dataset.pecTarget === "fundalReflexQuizPage")
    ? N
    : R;
}
function p(e, s) {
  let r = L(e.workshop, e.key),
    t = S(f(localStorage, r)?.percent),
    n = Math.max(t, S(s));
  (n !== t && E(localStorage, r, { percent: n, updatedAt: Date.now() }),
    e.progressTarget &&
      n > h(e.progressTarget).percent &&
      x(e.progressTarget, n),
    g());
}
function B(e) {
  (H(), (o = e), E(sessionStorage, y, o));
}
function C(e, s) {
  let r = S(f(localStorage, L(e, s.dataset.lesson))?.percent),
    t = s.dataset.primaryProgressTarget;
  return Math.max(r, t ? h(t).percent : 0);
}
function g() {
  Object.entries(m).forEach(([e, s]) => {
    let r = document.getElementById(s);
    r &&
      (r.querySelectorAll(".lesson-row[data-lesson]").forEach((t) => {
        let n = C(e, t),
          l = b(e, t),
          a = t.querySelector(".lesson-progress");
        if (a) {
          a.setAttribute("aria-valuenow", String(Math.round(n)));
          let c = a.querySelector(".lesson-progress__fill");
          ((c.style.width = `${n}%`), (c.style.backgroundColor = l));
        }
        A(t, n, l);
      }),
      r
        .querySelectorAll(".pec-folder-row, .pec-nested-folder-row")
        .forEach((t) => {
          let n = t.dataset.nestedFolder
              ? r.querySelector(
                  `[data-nested-section="${t.dataset.nestedFolder}"]`,
                )
              : r.querySelector(`[data-section="${t.dataset.folder}"]`),
            l = Array.from(
              n?.querySelectorAll(".lesson-row[data-lesson]") || [],
            ),
            a = l.length > 0 && l.every((c) => C(e, c) >= 100);
          (t
            .querySelectorAll(".pec-folder-complete")
            .forEach((c) => c.remove()),
            n?.querySelector(":scope > h3 .pec-folder-complete")?.remove(),
            t.classList.toggle("is-pec-complete", a),
            A(t, a ? 100 : 0, b(e, t)));
        }));
  });
}
function U(e) {
  H();
  let s = document.getElementById(m[e]);
  if (f(sessionStorage, `${e}:resetFolders`)) {
    O(e, !1);
    try {
      sessionStorage.removeItem(`${e}:resetFolders`);
    } catch {}
  }
  (s?.querySelectorAll(".lesson-row[data-lesson]").forEach((r) => {
    if (r.querySelector(".lesson-progress")) return;
    let t = document.createElement("div");
    ((t.className = "lesson-progress"),
      t.setAttribute("role", "progressbar"),
      t.setAttribute(
        "aria-label",
        r.querySelector(".lesson-type")?.textContent || "Lesson progress",
      ),
      t.setAttribute("aria-valuemin", "0"),
      t.setAttribute("aria-valuemax", "100"));
    let n = document.createElement("div");
    ((n.className = "lesson-progress__fill"),
      (n.style.backgroundColor = b(e, r)),
      t.append(n),
      r.querySelector(".lesson-main")?.append(t));
  }),
    g(),
    $());
}
function _() {
  if (!o || document.body.dataset.currentRoute !== o.route) return null;
  let e = document.getElementById(o.target);
  return e && getComputedStyle(e).display !== "none" ? e : null;
}
function $() {
  let e = _();
  if (!e) return;
  let s = o.externalTarget;
  if ((s && p(o, h(s).percent), o.type === "pdf")) {
    p(o, 100);
    return;
  }
  if (o.type === "video") {
    let u = Array.from(e.querySelectorAll("video"));
    if (!u.length) return;
    let q = u.map((i) => {
      let v = (
          i.querySelector("source")?.getAttribute("src") ||
          i.getAttribute("src") ||
          ""
        ).replace(/_(220p|720p)/, ""),
        P = `${L(o.workshop, o.key)}:media:${v}`,
        I = S(f(localStorage, P)?.percent),
        F = i.ended
          ? 100
          : i.duration > 0
            ? Math.min(99, (i.currentTime / i.duration) * 100)
            : 0,
        k = Math.max(I, F);
      return (k !== I && E(localStorage, P, { percent: k }), k);
    });
    p(o, q.reduce((i, v) => i + v, 0) / q.length);
    return;
  }
  if (o.type === "quiz" || o.type === "interactive") return;
  let r = document.scrollingElement || document.documentElement,
    t = document.getElementById("page-content"),
    n =
      t &&
      t.scrollHeight > t.clientHeight + 1 &&
      r.scrollHeight <= innerHeight + 1,
    l = n ? t.scrollTop : window.scrollY,
    a = n ? t.scrollHeight : r.scrollHeight,
    c = n ? t.clientHeight : innerHeight;
  if (a <= 0 || c <= 0) return;
  let M = Array.from(e.querySelectorAll("img")).every(
    (u) => u.complete && u.naturalWidth > 0,
  );
  p(o, l + c >= a - 8 && M ? 100 : Math.min(99, ((l + c) / a) * 100));
}
function d() {
  W === null &&
    (W = requestAnimationFrame(() => {
      ((W = null), $());
    }));
}
function O(e, s = !0) {
  s && E(sessionStorage, `${e}:resetFolders`, !0);
  try {
    sessionStorage.removeItem(`${e}:restore`);
  } catch {}
  let r = document.getElementById(m[e]);
  (r
    ?.querySelectorAll(".pec-section-card, .pec-nested-section-card")
    .forEach((t) => {
      ((t.hidden = !0), t.classList.remove("pec-nested-folder-open"));
    }),
    r
      ?.querySelectorAll(".pec-folder-row, .pec-nested-folder-row")
      .forEach((t) => {
        ((t.hidden = !1), t.setAttribute("aria-expanded", "false"));
      }),
    r?.classList.remove("pec-folder-open"));
}
function H() {
  T ||
    ((T = !0),
    window.addEventListener("page:loaded", (e) => {
      let s = e.detail?.routeName;
      if (
        (Object.keys(m).forEach((r) => {
          s !== r && !(o?.workshop === r && s === o.route) && O(r);
        }),
        o && s !== o.workshop && s !== o.route)
      ) {
        o = null;
        try {
          sessionStorage.removeItem(y);
        } catch {}
      }
      d();
    }),
    document.addEventListener("page:shown", (e) => {
      if (o && e.detail?.id === m[o.workshop]) {
        o = null;
        try {
          sessionStorage.removeItem(y);
        } catch {}
        g();
      }
      d();
    }),
    ["scroll", "resize"].forEach((e) =>
      window.addEventListener(e, d, { passive: !0 }),
    ),
    document.addEventListener("scroll", d, { passive: !0, capture: !0 }),
    ["timeupdate", "ended", "loadedmetadata", "change", "load"].forEach((e) =>
      document.addEventListener(e, d, !0),
    ),
    [
      "arclight:lesson-progress-changed",
      "medicalStudentsWorkshop:progress-changed",
      "glaucomaWorkshop:progress-changed",
      "diabeticWorkshop:progress-changed",
      "childhoodWorkshop:route-complete",
    ].forEach((e) =>
      document.addEventListener(e, () => {
        (g(), d());
      }),
    ),
    document.addEventListener("primaryWorkshop:worksheet-saved", (e) => {
      o?.workshop === "pecWorkshop" &&
        o.key === "pec-fundal-interpretation-test" &&
        p(o, e.detail?.percent);
    }),
    window.addEventListener("storage", () => {
      (g(), d());
    }));
}
export { B as a, g as b, U as c, $ as d };
