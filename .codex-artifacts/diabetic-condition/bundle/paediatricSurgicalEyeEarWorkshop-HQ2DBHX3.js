import {
  a as u,
  b as A,
  d as R,
  e as C,
  f as _,
  g as B,
  h as $,
} from "./chunk-5FZC2BK5.js";
import { a as O, b as H, c as Z, d as ee } from "./chunk-Y4ULCW5I.js";
import { a as X } from "./chunk-6WVU3F6C.js";
import "./chunk-KOQD3NIP.js";
import { c as U } from "./chunk-KIQ7J7XB.js";
import "./chunk-724JZPMA.js";
import "./chunk-VKQVMSQC.js";
import { l as K, s as b } from "./chunk-C3DWFWW5.js";
import "./chunk-P2HPNKQY.js";
import "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
var te = "paediatricSurgicalEyeEarWorkshop:earQuiz:v1",
  z = (e, t) => window.I18N?.t?.(`medicalStudentsWorkshop.quizUi.${e}`, t) || t;
function D(e) {
  let t = [...e];
  for (let n = t.length - 1; n > 0; n--) {
    let s = Math.floor(Math.random() * (n + 1));
    [t[n], t[s]] = [t[s], t[n]];
  }
  let r = e.indexOf(t[0]);
  return (
    t.every((n, s) => n === e[(s + r) % e.length]) &&
      ([t[0], t[1]] = [t[1], t[0]]),
    t
  );
}
function re(e) {
  if (!e || e.dataset.earQuizWired === "1") return;
  e.dataset.earQuizWired = "1";
  let t = e.querySelector("[data-ear-quiz-form]"),
    r = e.querySelector("[data-ear-quiz-submit]"),
    n = e.querySelector("dialog"),
    s = e.querySelector("[data-ear-quiz-review]"),
    d = e.querySelector("[data-ear-quiz-restart]"),
    l = e.querySelector("[data-ear-quiz-progress]"),
    y = e.querySelector("[data-ear-quiz-status]"),
    i = B.map((o) => o.id),
    g;
  try {
    g = JSON.parse(localStorage.getItem(te) || "null");
  } catch {}
  let E = Object.fromEntries(
      i.map((o) => [o, i.includes(g?.answers?.[o]) ? g.answers[o] : null]),
    ),
    S = g?.submitted === !0 && i.every((o) => E[o]),
    q = S && g?.reviewing === !0,
    j = (o) =>
      Array.isArray(o) &&
      o.length === i.length &&
      new Set(o).size === i.length &&
      o.every((a) => i.includes(a)),
    I,
    P;
  function Q() {
    I = D(i);
    let o = D(i.map((a, c) => c));
    P = Object.fromEntries(
      I.map((a, c) => {
        let f = D(i),
          x = f.indexOf(a),
          k = o[c];
        return (([f[x], f[k]] = [f[k], f[x]]), [a, f]);
      }),
    );
  }
  function V() {
    let o = t.querySelector(".medical-test-quiz-questions");
    I.forEach((a, c) => {
      let f = t.querySelector(`[data-ear-question="${a}"]`);
      ((f.querySelector(".quiz-card-number").textContent = String(
        c + 1,
      ).padStart(2, "0")),
        (f.querySelector("img").alt = `${C.image_case} ${c + 1}`));
      let x = f.querySelector(".options");
      (P[a].forEach((k, Ee) => {
        let J = f.querySelector(`input[value="${k}"]`).closest(".opt");
        ((J.querySelector(".opt-prefix").textContent =
          `${String.fromCharCode(65 + Ee)}.`),
          x.append(J));
      }),
        o.append(f));
    });
  }
  (j(g?.questionOrder) && i.every((o) => j(g?.optionOrders?.[o]))
    ? ((I = g.questionOrder), (P = g.optionOrders))
    : Q(),
    V());
  function ge() {
    try {
      localStorage.setItem(
        te,
        JSON.stringify({
          answers: E,
          submitted: S,
          reviewing: q,
          questionOrder: I,
          optionOrders: P,
        }),
      );
    } catch {}
  }
  function L() {
    let o = i.filter((a) => E[a]).length;
    ((l.textContent = `${o} / ${i.length}`),
      (r.textContent = z(
        S ? "seeResults" : "submitAnswers",
        S ? "See Results" : "Submit Answers",
      )),
      U(e.id, S ? 100 : (o / i.length) * 90),
      t.querySelectorAll("input[type=radio]").forEach((a) => {
        ((a.checked = E[a.name.slice(4)] === a.value),
          (a.disabled = S),
          a
            .closest(".opt")
            .classList.toggle("correct", q && a.value === a.name.slice(4)),
          a
            .closest(".opt")
            .classList.toggle(
              "wrong",
              q && a.checked && a.value !== a.name.slice(4),
            ));
      }),
      B.forEach((a) => {
        let c = t.querySelector(
          `[data-ear-question="${a.id}"] .quiz-explanation`,
        );
        ((c.hidden = !q), (c.textContent = `Source label: ${C[a.label]}`));
      }),
      ge());
  }
  function Se() {
    let o = i.filter((a) => E[a] === a).length;
    ((e.querySelector("[data-ear-quiz-score]").textContent =
      `${o} / ${i.length}`),
      (s.textContent = z(
        o === i.length ? "review" : "seeWhy",
        o === i.length ? "Review" : "See why",
      )),
      (d.textContent = z("restart", "Restart")),
      n.open || n.showModal());
  }
  (t.addEventListener("change", () => {
    if (!S) {
      for (let o of i)
        E[o] = t.querySelector(`input[name="ear-${o}"]:checked`)?.value || null;
      ((y.textContent = ""), L());
    }
  }),
    t.addEventListener("submit", (o) => {
      o.preventDefault();
      let a = I.find((c) => !E[c]);
      if (a) {
        y.textContent = "Answer all five questions before submitting.";
        let c = t.querySelector(`[data-ear-question="${a}"]`);
        (c.scrollIntoView({ block: "center" }),
          c.querySelector("input").focus({ preventScroll: !0 }));
        return;
      }
      ((S = !0), L(), Se());
    }),
    s.addEventListener("click", () => {
      ((q = !0),
        n.close(),
        L(),
        t.querySelector("fieldset").scrollIntoView({ block: "start" }));
    }),
    d.addEventListener("click", () => {
      ((E = Object.fromEntries(i.map((o) => [o, null]))),
        (S = !1),
        (q = !1),
        n.close(),
        (y.textContent = ""),
        Q(),
        V(),
        L(),
        t.querySelector("input").focus());
    }),
    (e.querySelector("#paediatric-quiz-results-title").textContent = z(
      "results",
      "Results",
    )),
    window.addEventListener("page:loaded", () => n.open && n.close()),
    L());
}
var T = `${u}:activeLesson`,
  w = `${u}:restore`,
  ne = !1,
  m = !1,
  F = !1;
function W(e, t, r = null) {
  try {
    return JSON.parse(e.getItem(t) || "null") ?? r;
  } catch {
    return r;
  }
}
function p(e, t, r) {
  try {
    r == null ? e.removeItem(t) : e.setItem(t, JSON.stringify(r));
  } catch {}
}
function oe(e) {
  return window.I18N?.t?.(`${R}.${e}`, C[e] || e) || C[e] || e;
}
function ae(e, t, r) {
  let n = document.createElement(e);
  return (
    (n.dataset.i18n =
      t === "previous" ? "i18nLiteral.Previous" : "i18nLiteral.Next"),
    (n.textContent = window.I18N?.t?.(n.dataset.i18n, r) || r),
    n
  );
}
function se(e) {
  (e.querySelectorAll("[data-paediatric-common]").forEach((t) => {
    t.dataset.i18n = `primaryEarCareWorkshop.${t.dataset.paediatricCommon}`;
  }),
    e.querySelectorAll("[data-paediatric-copy]").forEach((t) => {
      ((t.dataset.i18n = `${R}.${t.dataset.paediatricCopy}`),
        (t.textContent = oe(t.dataset.paediatricCopy)));
    }),
    e.querySelectorAll("[data-paediatric-alt]").forEach((t) => {
      ((t.dataset.i18n = `${R}.${t.dataset.paediatricAlt}:alt`),
        (t.alt = oe(t.dataset.paediatricAlt)));
    }),
    window.I18N?.applyTranslations?.(e));
}
function M(e) {
  return (
    e?.isConnected &&
    getComputedStyle(e).display !== "none" &&
    getComputedStyle(e).visibility !== "hidden"
  );
}
function ce(e) {
  return $.find((t) => t.id === e && !t.unavailable);
}
function v() {
  return ce(W(sessionStorage, T)?.id);
}
function N(e, t = {}) {
  if (!e) return;
  (e
    .querySelectorAll(".pec-section-card, .pec-nested-section-card")
    .forEach((l) => {
      ((l.hidden = !0), l.classList.remove("pec-nested-folder-open"));
    }),
    e
      .querySelectorAll(".pec-folder-row, .pec-nested-folder-row")
      .forEach((l) => {
        ((l.hidden = !1), l.setAttribute("aria-expanded", "false"));
      }),
    e.classList.remove("pec-folder-open"));
  let r = e.querySelector(`[data-folder="${t.section}"]`),
    n = e.querySelector(`[data-section="${t.section}"]`);
  if (!r || !n) return;
  ((r.hidden = !0),
    r.setAttribute("aria-expanded", "true"),
    (n.hidden = !1),
    e.classList.add("pec-folder-open"));
  let s = n.querySelector(`[data-nested-folder="${t.nested}"]`),
    d = n.querySelector(`[data-nested-section="${t.nested}"]`);
  s &&
    d &&
    ((s.hidden = !0),
    s.setAttribute("aria-expanded", "true"),
    (d.hidden = !1),
    n.classList.add("pec-nested-folder-open"));
}
function de() {
  (document.querySelectorAll(".paediatric-flow-nav").forEach((e) => e.remove()),
    document
      .querySelectorAll(".paediatric-flow-target")
      .forEach((e) => e.classList.remove("paediatric-flow-target")));
}
function Y() {
  (p(sessionStorage, T, null),
    W(sessionStorage, "interactiveLearning:returnTarget")?.routeName === u &&
      p(sessionStorage, "interactiveLearning:returnTarget", null),
    de());
}
function le() {
  let e = v();
  (e && document.getElementById(e.target))
    ?.querySelectorAll("video, audio")
    .forEach((r) => r.pause());
}
async function ue() {
  if (m) return;
  m = !0;
  let e = v(),
    t = e ? { section: e.folder, nested: e.nested } : W(sessionStorage, w, {});
  (le(), Y());
  try {
    (await b(u, { subPageId: A, replace: !0, recordHistory: !1 }), ye());
    let r = document.getElementById(A);
    (p(sessionStorage, w, t), N(r, t));
    let n = e && r?.querySelector(`[data-paediatric-lesson="${e.id}"]`);
    (n?.focus({ preventScroll: !0 }), n?.scrollIntoView({ block: "nearest" }));
  } finally {
    ((m = !1), h());
  }
}
function G(e) {
  return {
    workshop: u,
    key: e.id,
    route: e.route,
    target: e.target,
    type: e.type,
    externalTarget: e.earLesson ? null : e.target,
    progressTarget: e.route === u ? e.target : null,
  };
}
async function fe(e) {
  let { initializeCaseStudy: t } = await import("./casestudy-C2EPXCSL.js");
  (t(),
    await new Promise((n) => requestAnimationFrame(n)),
    document.getElementById("caseStudyIntermediateCard")?.click(),
    await b("casestudy", { subPageId: e.target }));
  let r = document.getElementById(e.target);
  r && (r.dataset.paediatricCaseOpened = "1");
}
async function ve(e) {
  if (!m) {
    m = !0;
    try {
      await fe(e);
    } finally {
      ((m = !1), h());
    }
  }
}
async function pe(e) {
  let t = ce(e);
  if (!(!t || m)) {
    ((m = !0),
      le(),
      de(),
      p(sessionStorage, T, { id: e }),
      p(sessionStorage, w, { section: t.folder, nested: t.nested }),
      [
        "pecWorkshop:activeEntry",
        "pecWorkshop:externalReuse",
        "pecWorkshop:medicalReuse",
        "medicalStudentsWorkshop:nextFlowEnabled",
        "videos:contextualReturn:v1",
        "interactiveLearning:returnTarget",
      ].forEach((r) => {
        p(sessionStorage, r, null);
      }),
      O(G(t)),
      t.route === "videos" &&
        t.type === "interactive" &&
        p(sessionStorage, "interactiveLearning:returnTarget", {
          routeName: u,
          subPageId: A,
        }));
    try {
      if (t.earLesson) {
        let { openPrimaryEarCareSharedLesson: r } =
          await import("./primaryEarCareWorkshop-M6B6XZX3.js");
        await r(t.earLesson);
      } else if (t.caseStudy)
        (await b("casestudy", { subPageId: "casestudyPage" }), await fe(t));
      else {
        let r =
          t.route === "videos" &&
          document.body.dataset.currentRoute === "videos";
        if ((await b(t.route, { subPageId: t.target }), r)) {
          let { showVideosPageById: n } = await import("./videos-YJRPAZ42.js");
          n(t.target);
        }
      }
      (t.route === u && ye(), me(), window.scrollTo(0, 0), ee());
    } finally {
      ((m = !1), h());
    }
  }
}
async function ie(e, t) {
  let r = $.filter(
      (s) => !s.unavailable && s.folder === e.folder && s.nested === e.nested,
    ),
    n = r[r.findIndex((s) => s.id === e.id) + t];
  n ? await pe(n.id) : await ue();
}
function me() {
  let e = v(),
    t = document.body.dataset.currentRoute;
  if (
    (!e &&
      t === u &&
      ((e = $.find(
        (i) => i.route === u && M(document.getElementById(i.target)),
      )),
      e &&
        (p(sessionStorage, T, { id: e.id }),
        p(sessionStorage, w, { section: e.folder, nested: e.nested }),
        O(G(e)))),
    !e || t !== e.route)
  )
    return;
  let r = document.getElementById(e.target);
  if (e.caseStudy && r && r.dataset.paediatricCaseOpened !== "1") {
    ve(e);
    return;
  }
  if (!M(r)) return;
  r.classList.add("paediatric-flow-target");
  let n =
      r.querySelector(".container.pupils-container") ||
      r.querySelector(".container") ||
      r,
    s = n.querySelector(".paediatric-flow-nav");
  if (s?.dataset.lesson === e.id) return;
  s?.remove();
  let d = document.createElement("nav");
  ((d.className = "pec-flow-nav paediatric-flow-nav"),
    (d.dataset.lesson = e.id),
    d.setAttribute(
      "aria-label",
      window.I18N?.t?.(
        "primaryEarCareWorkshop.lesson_navigation",
        "Lesson navigation",
      ) || "Lesson navigation",
    ));
  let l = document.createElement("button");
  ((l.type = "button"),
    (l.className = "pec-flow-prev"),
    l.append(document.createTextNode("< "), ae("span", "previous", "Previous")),
    l.addEventListener("click", () => void ie(e, -1)));
  let y = document.createElement("button");
  ((y.type = "button"),
    (y.className = "pec-flow-next"),
    y.append(ae("span", "next", "Next"), document.createTextNode(" >")),
    y.addEventListener("click", () => void ie(e, 1)),
    d.append(l, y),
    n.append(d),
    window.I18N?.applyTranslations?.(d));
}
function h() {
  F ||
    ((F = !0),
    requestAnimationFrame(() => {
      ((F = !1), m || me());
    }));
}
function he() {
  if (ne) return;
  ((ne = !0),
    window.addEventListener(
      "click",
      (t) => {
        if (!t.target.closest?.("#backBtnGlobal, #caseChatBackBtn")) return;
        let r = v();
        r &&
          document.body.dataset.currentRoute === r.route &&
          M(document.getElementById(r.target)) &&
          (t.preventDefault(), t.stopImmediatePropagation(), ue());
      },
      !0,
    ),
    window.addEventListener("page:loaded", (t) => {
      let r = t.detail?.routeName;
      if (r && r !== document.body.dataset.currentRoute) return;
      let n = v();
      (!m && r !== u && r !== n?.route && (Y(), p(sessionStorage, w, null)),
        h());
    }),
    document.addEventListener("page:shown", (t) => {
      (t.detail?.id === A && Y(), h());
    }));
  let e = document.getElementById("page-content");
  (e &&
    new MutationObserver(() => {
      v() && h();
    }).observe(e, { childList: !0, subtree: !0 }),
    v() && O(G(v())),
    h());
}
function ye() {
  he();
  let e = document.getElementById(A);
  e &&
    (e.dataset.inited !== "1" &&
      ((e.dataset.inited = "1"),
      e.querySelectorAll("[data-folder], [data-nested-folder]").forEach((t) => {
        let r = () => {
          let s = {
            section:
              t.dataset.folder || t.closest("[data-section]").dataset.section,
            nested: t.dataset.nestedFolder || null,
          };
          (p(sessionStorage, w, s),
            N(e, s),
            document
              .getElementById(t.getAttribute("aria-controls"))
              ?.querySelector(".see-all-toggle")
              ?.focus({ preventScroll: !0 }));
        };
        (t.addEventListener("click", r),
          t.addEventListener("keydown", (n) => {
            (n.key === "Enter" || n.key === " ") && (n.preventDefault(), r());
          }));
      }),
      e.querySelectorAll("[data-paediatric-close]").forEach((t) => {
        t.addEventListener("click", () => {
          let r = t.closest("[data-nested-section], [data-section]"),
            n = r.dataset.nestedSection,
            s = n
              ? { section: r.closest("[data-section]").dataset.section }
              : {};
          (p(sessionStorage, w, s),
            N(e, s),
            e
              .querySelector(
                n
                  ? `[data-nested-folder="${n}"]`
                  : `[data-folder="${r.dataset.section}"]`,
              )
              ?.focus({ preventScroll: !0 }));
        });
      }),
      e
        .querySelectorAll("[data-paediatric-lesson]:not([aria-disabled])")
        .forEach((t) => {
          let r = () => void pe(t.dataset.paediatricLesson);
          (t.addEventListener("click", r),
            t.addEventListener("keydown", (n) => {
              (n.key === "Enter" || n.key === " ") && (n.preventDefault(), r());
            }));
        })),
    se(e),
    Object.keys(_).forEach((t) => {
      let r = document.getElementById(t);
      r &&
        (se(r),
        r.dataset.inited !== "1" &&
          ((r.dataset.inited = "1"), _[t].quiz && re(r)));
    }),
    document
      .querySelectorAll(
        ".paediatric-workshop-page .menuBtn, .paediatric-scrolly-page .menuBtn, .paediatric-quiz-page .menuBtn",
      )
      .forEach((t) => {
        t.dataset.paediatricMenuWired ||
          ((t.dataset.paediatricMenuWired = "1"),
          t.addEventListener("keydown", (r) => {
            (r.key === "Enter" || r.key === " ") && (r.preventDefault(), K());
          }));
      }),
    Z(u),
    N(e, W(sessionStorage, w, {})),
    X(),
    H(),
    h());
}
export {
  ye as initializePaediatricSurgicalEyeEarWorkshop,
  he as initializePaediatricWorkshopFlowInfra,
};
