var c = "lesson-complete-tick",
  d = "lesson-complete-label",
  g = Object.freeze({
    primary: "#15e115",
    intermediate: "#f25600",
    advanced: "#e41e26",
  }),
  b = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" stroke-width="2.2"></circle>
    <path d="M7.4 12.2l3.1 3.1 6.2-6.7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>
`,
  a = null,
  u = !1;
function y(e) {
  return (
    e &&
    e !== "transparent" &&
    e !== "rgba(0, 0, 0, 0)" &&
    e !== "rgba(0,0,0,0)"
  );
}
function h(e, t = "") {
  if (y(t)) return t;
  let r =
    e?.querySelector?.(".lesson-progress__fill") ||
    e?.querySelector?.(".progress-fill");
  if (!r) return "";
  let n = getComputedStyle(r);
  return y(n.backgroundColor) ? n.backgroundColor : "";
}
function v(e) {
  let t = e?.querySelector?.(".thumb");
  if (!t) return "";
  let r = "";
  try {
    r = getComputedStyle(t).backgroundImage;
  } catch {
    r = "";
  }
  return [t.style?.backgroundImage, t.getAttribute?.("style"), r]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
function C(e) {
  let t = String(e?.dataset?.level || "").toLowerCase();
  if (g[t]) return t;
  let r = v(e);
  if (r.includes("advanced_folder")) return "advanced";
  if (r.includes("intermediate_folder")) return "intermediate";
  if (r.includes("primary_folder")) return "primary";
  let n = e?.closest?.(
    ".pupil-level--primary, .pupil-level--intermediate, .pupil-level--advanced",
  );
  return n?.classList?.contains("pupil-level--advanced")
    ? "advanced"
    : n?.classList?.contains("pupil-level--intermediate")
      ? "intermediate"
      : n?.classList?.contains("pupil-level--primary")
        ? "primary"
        : "";
}
function q(e, t = "") {
  let r = C(e);
  return g[r] || t;
}
function f(e) {
  let t = String(e || "").match(/-?\d+(?:\.\d+)?/);
  if (!t) return null;
  let r = Number(t[0]);
  return Number.isFinite(r) ? Math.max(0, Math.min(100, r)) : null;
}
function L(e) {
  let t = String(e || "");
  return t.includes("%") ? f(t) : null;
}
function E(e) {
  if (!e) return 0;
  let t =
      e.querySelector(".lesson-progress__fill") ||
      e.querySelector(".progress-fill"),
    r = e.querySelector('[role="progressbar"]'),
    n =
      f(t?.getAttribute("aria-valuenow")) ??
      f(r?.getAttribute("aria-valuenow"));
  if (n != null) return n;
  let s = L(t?.style?.width);
  if (s != null) return s;
  if (t) {
    let l = t.getBoundingClientRect?.(),
      o = (r || t.parentElement)?.getBoundingClientRect?.();
    if (l?.width > 0 && o?.width > 0)
      return Math.max(0, Math.min(100, (l.width / o.width) * 100));
  }
  return e.classList?.contains("is-progress-complete") ||
    e.classList?.contains("is-complete")
    ? 100
    : 0;
}
function S(e) {
  return !!(
    e?.querySelector?.(".lesson-progress__fill, .progress-fill") ||
    e?.querySelector?.('[role="progressbar"]') ||
    e?.classList?.contains("is-progress-complete") ||
    e?.classList?.contains("is-complete")
  );
}
function T(e) {
  let t = e?.querySelector?.(`:scope > .${d}`);
  if (!t) return;
  let r = e.querySelector(`:scope > .${c}`);
  (Array.from(t.childNodes).forEach((s) => e.insertBefore(s, r || t)),
    t.remove());
}
function _(e) {
  for (
    ;
    e.lastChild &&
    e.lastChild.nodeType === Node.TEXT_NODE &&
    !e.lastChild.textContent.trim();
  )
    e.lastChild.remove();
}
function P(e) {
  let t = e.querySelector(`:scope > .${d}`);
  if (t) return t;
  let r = document.createElement("span");
  return (
    (r.className = d),
    Array.from(e.childNodes)
      .filter(
        (s) => !(s.nodeType === Node.ELEMENT_NODE && s.classList?.contains(c)),
      )
      .forEach((s) => r.appendChild(s)),
    _(r),
    e.insertBefore(r, e.querySelector(`.${c}`)),
    r
  );
}
function k(e, t) {
  (t.style.removeProperty("position"),
    t.style.removeProperty("left"),
    t.style.removeProperty("top"),
    t.style.removeProperty("margin-left"),
    e?.style?.removeProperty("position"));
}
function N(e, t, r = "") {
  if (!e) return;
  let n = Number(t),
    s = Number.isFinite(n) && n >= 99.5,
    l = e.querySelector(".lesson-type");
  if ((e.classList.toggle("is-progress-complete", s), !l)) return;
  let o = l.querySelector(`.${c}`);
  if (!s) {
    (o?.remove(),
      T(l),
      l.style.removeProperty("position"),
      e.style.removeProperty("--lesson-complete-color"));
    return;
  }
  (P(l),
    o ||
      ((o = document.createElement("span")),
      (o.className = c),
      o.setAttribute("aria-label", "Complete"),
      o.setAttribute("title", "Complete"),
      o.setAttribute(
        "data-i18n",
        "auto.videos.complete:aria-label;auto.videos.complete:title",
      ),
      (o.innerHTML = b),
      l.appendChild(o),
      window.I18N?.applyTranslations?.(o)),
    k(l, o));
  let i = h(e, r);
  i && e.style.setProperty("--lesson-complete-color", i);
}
function m(e = document) {
  e?.querySelectorAll?.(".lesson-row").forEach((t) => {
    S(t) && N(t, E(t));
  });
}
function p(e = document) {
  u ||
    ((u = !0),
    requestAnimationFrame(() => {
      ((u = !1), m(e));
    }));
}
function A(e = document) {
  if (a) {
    m(e);
    return;
  }
  m(e);
  let t = e?.documentElement || e?.body || e;
  !t ||
    typeof MutationObserver > "u" ||
    ((a = new MutationObserver((r) => {
      r.some((s) => {
        if (s.type === "childList") {
          let o = s.target;
          return o?.closest?.(".lesson-row") &&
            (o.matches?.(".lesson-type") || o.closest?.(".lesson-type"))
            ? !0
            : Array.from(s.addedNodes).some(
                (i) =>
                  i.nodeType === Node.ELEMENT_NODE &&
                  (i.matches?.(".lesson-row") ||
                    i.querySelector?.(
                      ".lesson-row, .lesson-progress__fill, .progress-fill",
                    )),
              );
        }
        if (s.type !== "attributes") return !1;
        let l = s.target;
        return !!(
          l?.closest?.(".lesson-row") &&
          (l.matches?.(
            ".lesson-progress__fill, .progress-fill, [role='progressbar']",
          ) ||
            l.classList?.contains("lesson-row"))
        );
      }) && p(e);
    })),
    a.observe(t, {
      attributes: !0,
      attributeFilter: ["aria-valuenow", "class", "style"],
      childList: !0,
      subtree: !0,
    }),
    window.addEventListener("page:loaded", () => p(e), { passive: !0 }),
    document.addEventListener("page:shown", () => p(e), { passive: !0 }));
}
export { q as a, N as b, A as c };
