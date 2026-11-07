import { b as p } from "./chunk-VKQVMSQC.js";
var l = "lessonProgress:",
  f = "arclight:lesson-progress-changed",
  m = [
    l,
    "videoProgress:",
    "childhoodWorkshop:progress:",
    "diabeticWorkshop:progress:",
    "glaucomaWorkshop:progress:",
  ];
function u(e) {
  let t = Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.min(100, t)) : 0;
}
function S(e) {
  let t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? 0 : Math.round(t);
}
function d(e) {
  try {
    return JSON.parse(localStorage.getItem(e) || "null");
  } catch {
    return null;
  }
}
function P(e, t) {
  try {
    localStorage.setItem(e, JSON.stringify(t));
  } catch {}
}
function g(e) {
  return { percent: u(e?.percent), updatedAt: S(e?.updatedAt) };
}
function h(e) {
  return e.reduce(
    (t, r) =>
      r.percent > t.percent
        ? r
        : r.percent < t.percent
          ? t
          : {
              percent: t.percent,
              updatedAt: Math.max(t.updatedAt, r.updatedAt),
            },
    { percent: 0, updatedAt: 0 },
  );
}
function y(e, t = m) {
  return e ? h(t.map((r) => g(d(`${r}${e}`)))) : { percent: 0, updatedAt: 0 };
}
function A(e, t, { mode: r = "max", prefix: c = l } = {}) {
  if (!e) return 0;
  let s = `${c}${e}`,
    n = d(s) || {},
    o = g(n),
    i = u(t),
    a = r === "replace" ? i : Math.max(o.percent, i);
  return (
    (a !== o.percent || !Number.isFinite(Number(n.percent)) || a >= 100) &&
      P(s, { percent: a, updatedAt: Date.now() }),
    document.dispatchEvent(
      new CustomEvent(f, {
        detail: { target: e, percent: a, advanced: i > o.percent },
      }),
    ),
    a
  );
}
function v(e) {
  let t = e?.closest?.(".pupil-level");
  if (!t) return "";
  let r = getComputedStyle(t),
    c = r.getPropertyValue("--cap-from").trim(),
    s = r.getPropertyValue("--accent").trim();
  if (t.classList?.contains("pupil-level--primary")) return c || "#15e115";
  let n = t.querySelector(".pupil-level__cap");
  if (!n) return s;
  let o = getComputedStyle(n).backgroundColor;
  return !o || o === "rgba(0, 0, 0, 0)" || o === "transparent" ? s : o;
}
function E(e, t, r = "") {
  if (!e) return;
  let c = u(t),
    s = Math.round(c),
    n = e.querySelector(".lesson-progress__fill, .progress-fill"),
    o = e.querySelector('.lesson-progress[role="progressbar"]');
  (n &&
    ((n.style.width = `${c}%`),
    r && (n.style.backgroundColor = r),
    n.setAttribute("aria-valuenow", String(s)),
    (n.title = `${s}% complete`)),
    o && o.setAttribute("aria-valuenow", String(s)),
    p(e, c, r));
}
function N(
  e = document,
  { selector: t = ".lesson-row[data-target]", colourResolver: r = v } = {},
) {
  e?.querySelectorAll?.(t).forEach((c) => {
    let s = c.getAttribute("data-target");
    if (!s) return;
    let n = y(s).percent,
      o = r?.(c) || "";
    E(c, n, o);
  });
}
export { f as a, y as b, A as c, N as d };
