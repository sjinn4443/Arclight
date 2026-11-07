var g = "arclight:profile-updated",
  o = Object.freeze({
    avatar: "profileAvatarDataUrl",
    interests: "userField",
    name: "username",
    practiceByRole: "practiceByRole",
    roles: "userJob",
    studentYears: "studentYears",
  }),
  d = Object.freeze([
    "lessonProgress:",
    "videoProgress:",
    "childhoodWorkshop:progress:",
    "diabeticWorkshop:progress:",
    "glaucomaWorkshop:progress:",
  ]);
function l(e) {
  return Array.from(
    new Set(
      String(e || "")
        .split("|")
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  );
}
function v(e) {
  return String(e || "")
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .replace(/([0-9])([A-Za-z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (t) => t.toUpperCase());
}
function I() {
  return (localStorage.getItem(o.name) || "").trim();
}
function E(e) {
  let t = String(e || "").trim();
  (t ? localStorage.setItem(o.name, t) : localStorage.removeItem(o.name), s());
}
function m() {
  return l(localStorage.getItem(o.interests));
}
function R(e) {
  let t = l(Array.isArray(e) ? e.join("|") : e);
  (t.length
    ? localStorage.setItem(o.interests, t.join("|"))
    : localStorage.removeItem(o.interests),
    s());
}
function w(e = "eyes") {
  let [t] = m();
  return t || e;
}
function b() {
  return l(localStorage.getItem(o.roles));
}
function L(e) {
  let t = l(Array.isArray(e) ? e.join("|") : e);
  (t.length
    ? localStorage.setItem(o.roles, t.join("|"))
    : localStorage.removeItem(o.roles),
    s());
}
function O() {
  try {
    let e = JSON.parse(localStorage.getItem(o.practiceByRole) || "{}");
    return e && typeof e == "object" ? e : {};
  } catch {
    return {};
  }
}
function M(e) {
  let t = e && typeof e == "object" ? e : {};
  (Object.keys(t).length
    ? localStorage.setItem(o.practiceByRole, JSON.stringify(t))
    : localStorage.removeItem(o.practiceByRole),
    s());
}
function f() {
  return localStorage.getItem(o.avatar) || "";
}
function U(e) {
  (e ? localStorage.setItem(o.avatar, e) : localStorage.removeItem(o.avatar),
    s());
}
function j(e) {
  if (!e) return;
  let t = f();
  ((e.style.backgroundImage = t ? `url("${t}")` : ""),
    e.classList.toggle("has-profile-avatar", !!t));
}
function s(e = {}) {
  document.dispatchEvent(new CustomEvent(g, { detail: e }));
}
async function B(e, t = 320) {
  if (!e || !String(e.type || "").startsWith("image/"))
    throw new Error("Please choose an image file.");
  let a = await h(e),
    r = await S(a),
    n = document.createElement("canvas"),
    i = n.getContext("2d");
  if (!i) return a;
  ((n.width = t), (n.height = t));
  let c = Math.min(r.naturalWidth || r.width, r.naturalHeight || r.height),
    u = Math.max(0, ((r.naturalWidth || r.width) - c) / 2),
    p = Math.max(0, ((r.naturalHeight || r.height) - c) / 2);
  return (
    i.drawImage(r, u, p, c, c, 0, 0, t, t),
    n.toDataURL("image/jpeg", 0.86)
  );
}
function h(e) {
  return new Promise((t, a) => {
    let r = new FileReader();
    (r.addEventListener("load", () => t(String(r.result || ""))),
      r.addEventListener("error", () => a(r.error)),
      r.readAsDataURL(e));
  });
}
function S(e) {
  return new Promise((t, a) => {
    let r = new Image();
    (r.addEventListener("load", () => t(r)),
      r.addEventListener("error", () => a(new Error("Could not read image."))),
      (r.src = e));
  });
}
function x(e) {
  let t = Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.min(100, t)) : 0;
}
function y(e) {
  let t = Number(e);
  return !Number.isFinite(t) || t <= 0 ? 0 : Math.round(t);
}
function P(e) {
  try {
    let t = JSON.parse(localStorage.getItem(e) || "null");
    return { percent: x(t?.percent), updatedAt: y(t?.updatedAt) };
  } catch {
    return { percent: 0, updatedAt: 0 };
  }
}
function A() {
  let e = new Map();
  for (let t = 0; t < localStorage.length; t += 1) {
    let a = localStorage.key(t) || "",
      r = d.find((u) => a.startsWith(u));
    if (!r) continue;
    let n = a.slice(r.length);
    if (!n) continue;
    let i = P(a),
      c = e.get(n) || { percent: 0, updatedAt: 0 };
    (i.percent > c.percent ||
      (i.percent === c.percent && i.updatedAt > c.updatedAt)) &&
      e.set(n, { target: n, ...i });
  }
  return Array.from(e.values())
    .filter((t) => t.percent >= 99.5)
    .sort(
      (t, a) => a.updatedAt - t.updatedAt || t.target.localeCompare(a.target),
    );
}
function D() {
  let t = A().length;
  return Array.from({ length: Math.floor(t / 10) }, (a, r) => {
    let n = (r + 1) * 10;
    return {
      id: `completed-${n}`,
      earned: !0,
      milestone: n,
      title: `${n}`,
      label: `${n} modules complete`,
      ringText: "MODULES COMPLETE",
      stamp: "COMPLETE",
      theme: "red",
    };
  });
}
export {
  g as a,
  o as b,
  v as c,
  I as d,
  E as e,
  m as f,
  R as g,
  w as h,
  b as i,
  L as j,
  O as k,
  M as l,
  U as m,
  j as n,
  s as o,
  B as p,
  D as q,
};
