import { h as O } from "./chunk-7FFUJP4M.js";
import { s as T } from "./chunk-C3DWFWW5.js";
import "./chunk-P2HPNKQY.js";
import "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
function G(u) {
  let f = () => (u === "dashboard" ? O() : T(u)),
    s = document.getElementById("splashScreenContainer"),
    n = document.getElementById("page-content");
  if (!s) {
    f();
    return;
  }
  (s.classList.remove("fade-out"),
    (s.innerHTML = ""),
    fetch("html/splashscreen_mid.html")
      .then((c) => c.text())
      .then((c) => {
        ((s.innerHTML = c),
          n && (n.style.display = "none"),
          s.classList.add("splash-full-screen"),
          s.classList.add("active"));
        let a =
            s.querySelector(".logo-one.mid-only") ||
            s.querySelector(".logo-one"),
          r = 220,
          d = 140,
          l = 2600 + r,
          y = !1;
        function i() {
          y ||
            ((y = !0),
            s.classList.add("fade-out"),
            setTimeout(() => {
              f()
                .catch((h) => console.error(`Failed to load ${u}:`, h))
                .finally(() => {
                  (n && (n.style.display = ""),
                    s.classList.remove("active", "fade-out"),
                    (s.innerHTML = ""));
                });
            }, d));
        }
        let E = setTimeout(i, l);
        function m(h) {
          h.animationName === "midHold" &&
            (clearTimeout(E), a.removeEventListener("animationend", m), i());
        }
        a ? a.addEventListener("animationend", m) : (clearTimeout(E), i());
      })
      .catch(() => {
        (n && (n.style.display = ""), f());
      }));
}
function ee() {
  let u = document.getElementById("introPage");
  if (!u || u.dataset.bound) return;
  u.dataset.bound = "true";
  let f = document.getElementById("seeWhatBtn"),
    s = document.getElementById("skipBtn"),
    n = (c) => {
      (c?.preventDefault?.(), c?.stopImmediatePropagation?.(), G("dashboard"));
    };
  (f && f.addEventListener("click", n),
    s && s.addEventListener("click", n),
    J());
}
function J() {
  let u = "exploreBtn";
  function f(n) {
    document.readyState !== "loading"
      ? n()
      : document.addEventListener("DOMContentLoaded", n);
  }
  function s(n) {
    (n.preventDefault(), n?.stopImmediatePropagation?.(), G("dashboard"));
  }
  f(() => {
    let n = document.querySelector("#introPage .intro-arrow-right"),
      c = document.querySelector("#introPage .intro-arrow-left"),
      a = document.getElementById("skipBtn"),
      r = document.querySelector(
        "#introPage .intro-hero-frame video.intro-hero",
      ),
      d = document.querySelector("#introPage .intro-title"),
      l = document.querySelector("#introPage .intro-sub"),
      y = Array.from(
        document.querySelectorAll("#introPage .intro-progress__seg"),
      ),
      i = "original",
      E = y.map((e) => e.querySelector(".intro-progress__fill")),
      m = [0, 0, 0, 0];
    function h(e) {
      return e < 0 ? 0 : e > 1 ? 1 : e;
    }
    function p() {
      return i === "original"
        ? 0
        : i === "recommended"
          ? 1
          : i === "pickup"
            ? 2
            : 3;
    }
    function C() {
      if (!y.length) return;
      let e = p();
      y.forEach((t, o) => {
        t.classList.toggle("is-active", o <= e);
        let v = E[o];
        if (!v) return;
        let k = o < e ? 1 : o === e ? m[o] : 0;
        v.style.width = `${k * 100}%`;
      });
    }
    function b(e) {
      for (let t = 0; t < e; t++) m[t] = 1;
      for (let t = e; t < m.length; t++) m[t] = 0;
      C();
    }
    function R() {
      let e = p(),
        t = r?.duration;
      if (!t || !isFinite(t)) return;
      let o = h(r.currentTime / t);
      ((m[e] = Math.max(m[e], o)), C());
    }
    function S(e) {
      a &&
        (e
          ? (a.classList.remove("btn-outline", "intro-outline"),
            a.classList.add("onb-cta", "intro-primary"),
            a.removeAttribute("data-i18n"),
            (a.textContent = "Start Exploring"))
          : (a.classList.remove("onb-cta", "intro-primary"),
            a.classList.add("btn-outline", "intro-outline"),
            N && a.setAttribute("data-i18n", N),
            (a.textContent = "Skip and Start")),
        L());
    }
    function B(e, { loop: t = !0, onEnded: o = null } = {}) {
      if (!r) return;
      let v = r.querySelector("source");
      (v && v.setAttribute("src", e),
        (r.loop = t),
        (r.onended = null),
        typeof o == "function" && (r.onended = o),
        r.load(),
        (r.currentTime = 0),
        r.play().catch(() => {}));
    }
    let z = d ? Array.from(d.childNodes).map((e) => e.cloneNode(!0)) : [],
      W = l ? Array.from(l.childNodes).map((e) => e.cloneNode(!0)) : [],
      P = d?.getAttribute("data-i18n") || null,
      _ = l?.getAttribute("data-i18n") || null,
      N = a?.getAttribute("data-i18n") || null,
      V = "Tailored for You",
      Q = [
        "On your first visit, we will recommend content",
        "that suits your interests and role",
      ];
    function X(e, t) {
      (Array.isArray(t) ? t : [t]).forEach((v, k) => {
        (k > 0 && e.appendChild(document.createElement("br")),
          e.appendChild(document.createTextNode(String(v))));
      });
    }
    function w(e, t) {
      e && (e.textContent = t);
    }
    function A(e, t) {
      e && ((e.textContent = ""), X(e, t));
    }
    function L() {
      try {
        let e = document.getElementById("introPage") || document;
        window.I18N?.applyTranslations?.(e);
      } catch {}
    }
    function q(e, t) {
      e &&
        ((e.textContent = ""),
        t.forEach((o) => e.appendChild(o.cloneNode(!0))));
    }
    function I(e) {
      (d &&
        (e
          ? d.removeAttribute("data-i18n")
          : P && d.setAttribute("data-i18n", P)),
        l &&
          (e
            ? l.removeAttribute("data-i18n")
            : _ && l.setAttribute("data-i18n", _)));
    }
    function x() {
      ((i = "recommended"),
        (g.recommended = !1),
        I(!0),
        w(d, V),
        A(l, Q),
        S(!1),
        B("videos/Intro/GIFRecommended_Comp.mp4", { loop: !0 }),
        n?.classList.add("intro-arrow--visible"),
        c?.classList.add("intro-arrow--visible"),
        b(p()),
        L());
    }
    function D() {
      ((i = "original"),
        (g.original = !1),
        I(!1),
        q(d, z),
        q(l, W),
        S(!1),
        B("videos/Intro/GIFRecommended_Comp.mp4", { loop: !0 }),
        c?.classList.remove("intro-arrow--visible"),
        b(p()),
        L());
    }
    function F() {
      ((i = "pickup"),
        (g.pickup = !1),
        I(!0),
        w(d, "Pick Up Anytime"),
        A(l, [
          "We remember what you've completed,",
          "making it easy to continue where you left off",
        ]),
        B("videos/Intro/GIFVideo_Comp.mp4", { loop: !0 }),
        n?.classList.add("intro-arrow--visible"),
        c?.classList.add("intro-arrow--visible"),
        b(p()),
        L());
    }
    function H() {
      ((i = "quiz"),
        I(!0),
        w(d, "Strengthen Your Learning"),
        A(l, [
          "Follow each lesson with a quick quiz to review",
          "concepts and identify areas to revisit.",
        ]),
        S(!1),
        B("videos/Intro/GIFQuiz_Comp.mp4", {
          loop: !1,
          onEnded: () => {
            S(!0);
          },
        }),
        c?.classList.add("intro-arrow--visible"),
        n?.classList.remove("intro-arrow--visible"),
        b(p()),
        L());
    }
    function Y(e) {
      (e.preventDefault(),
        i === "original" ? x() : i === "recommended" ? F() : H());
    }
    function $(e) {
      (e.preventDefault(), i === "quiz" ? F() : i === "pickup" ? x() : D());
    }
    let g = { original: !1, recommended: !1, pickup: !1 };
    function M(e) {
      n &&
        (n.classList.remove("intro-arrow--pop", "intro-arrow--pop-appear"),
        n.offsetWidth,
        n.classList.add(e));
    }
    (r &&
      n &&
      ((r.loop = !0),
      r.addEventListener("timeupdate", () => {
        let t = r.duration;
        if (!t || !isFinite(t)) return;
        let o = r.currentTime / t;
        if (i === "original") {
          o >= 0.9 &&
            !g.original &&
            ((g.original = !0),
            n.classList.add("intro-arrow--visible"),
            M("intro-arrow--pop-appear"));
          return;
        }
        (i === "recommended" || i === "pickup") &&
          o >= 0.9 &&
          (g[i] || ((g[i] = !0), M("intro-arrow--pop")));
      })),
      r && r.addEventListener("timeupdate", R),
      b(p()));
    function U() {
      return localStorage.getItem("guestMode") === "true";
    }
    function j() {
      let e = document.getElementById("skipBtn");
      if (!e) return;
      if (!U()) {
        (document.getElementById("createAccountBtn")?.remove(),
          document.getElementById("continueAsGuestBtn")?.remove(),
          document.getElementById(u)?.remove());
        return;
      }
      if (
        (document.getElementById(u)?.remove(),
        document.getElementById("createAccountBtn"))
      )
        return;
      let t = document.createElement("button");
      ((t.id = "createAccountBtn"),
        (t.className = "onb-cta intro-primary"),
        t.setAttribute("data-i18n", "onboarding.title"),
        (t.textContent = "Create Account"),
        t.addEventListener("click", () => {
          (localStorage.setItem("cameFromSkipPath", "true"), T("onboarding"));
        }));
      let o = document.createElement("button");
      ((o.id = "continueAsGuestBtn"),
        (o.className = "btn-outline intro-outline"),
        o.setAttribute("data-i18n", "onboarding.continue_as_guest_button"),
        (o.textContent = "Continue as Guest"),
        o.addEventListener("click", s, { passive: !1 }),
        e.parentNode.insertBefore(t, e),
        e.parentNode.insertBefore(o, e));
    }
    (j(),
      n && n.addEventListener("click", Y, { passive: !1 }),
      c && c.addEventListener("click", $, { passive: !1 }));
  });
}
export { ee as initializeIntro };
