function B(e) {
  return ["ar", "fa", "ur"].includes(
    e.toLowerCase().replaceAll("_", "-").split("-")[0],
  )
    ? "rtl"
    : "ltr";
}
function L(e) {
  ((document.documentElement.lang = e), (document.documentElement.dir = B(e)));
}
function F(e) {
  return (
    e &&
    typeof e.hasAttribute == "function" &&
    !e.hasAttribute("controls") &&
    e.hasAttribute("autoplay") &&
    e.hasAttribute("muted") &&
    e.hasAttribute("loop")
  );
}
function z(e) {
  return !!(
    e.getAttribute("aria-label") ||
    e.getAttribute("aria-labelledby") ||
    e.getAttribute("title")
  );
}
function U(e, t = "media-label") {
  if (e.id) return e.id;
  let a = Math.random().toString(36).slice(2, 10);
  return ((e.id = `${t}-${a}`), e.id);
}
function C(e) {
  let t = e.closest(
      ".video-container, .pdf-container, .intro-hero-frame, figure, .card, .lesson-card, .container",
    ),
    a = [
      t?.previousElementSibling,
      t,
      e.parentElement?.previousElementSibling,
      e.parentElement,
      e.closest(".page"),
    ].filter(Boolean);
  for (let i of a) {
    let l = i.querySelector?.(
      "[data-a11y-media-label], figcaption, h1, h2, h3, h4, h5, h6, .video-title, .page-title, .eyes-topbar__title, .pupils-subtitle",
    );
    if (l && (l.textContent || "").trim()) return l;
  }
  let n = e.ownerDocument?.querySelector?.(
    "[data-a11y-media-label], h1, h2, h3, .page-title, .eyes-topbar__title",
  );
  return n && (n.textContent || "").trim() ? n : null;
}
function G(e, t) {
  if (z(e)) return;
  let a = C(e);
  if (a) {
    e.setAttribute("aria-labelledby", U(a, t));
    return;
  }
  e.tagName === "VIDEO" &&
    F(e) &&
    (e.setAttribute("aria-hidden", "true"), e.setAttribute("tabindex", "-1"));
}
function H(e) {
  if (e.hasAttribute("alt") || e.hasAttribute("aria-label")) return;
  let t = C(e);
  if (t) {
    let a = (t.textContent || "").replace(/\s+/g, " ").trim();
    a && e.setAttribute("alt", a);
  }
}
function N(e = document) {
  !e ||
    typeof e.querySelectorAll != "function" ||
    (e.querySelectorAll("video, iframe").forEach((t) => {
      G(t, "media-heading");
    }),
    e.querySelectorAll("img").forEach((t) => {
      H(t);
    }));
}
var x = {
    en: "english",
    am: "amharic",
    ar: "arabic",
    bn: "bangla",
    ny: "chichewa",
    zh: "chinese",
    fr: "french",
    ha: "hausa",
    hi: "hindi",
    ne: "nepali",
    ig: "igbo",
    id: "indonesian",
    rw: "kinyarwanda",
    ko: "korean",
    lo: "lao",
    te: "telugu",
    ln: "lingala",
    lg: "luganda",
    fa: "persian",
    pt: "portuguese",
    sn: "shona",
    es: "spanish",
    sw: "swahili",
    ur: "urdu",
    yo: "yoruba",
    zu: "zulu",
  },
  r = {
    lang: null,
    dict: {},
    fallbackDict: {},
    fetched: new Map(),
    literalIndex: new Map(),
    loading: null,
  },
  j = [80, 220],
  m = !1,
  A = !1,
  P = !1,
  y = null,
  $ = Object.freeze({
    Menu: ["i18nExtra.menu_aria_label"],
    Close: ["languageInstall.closeButton"],
    Language: ["menu.language_item"],
    Search: [
      "menu.search_placeholder",
      "searchPlaceholder",
      "dashboard.search_placeholder",
    ],
    "Search menu contents": ["menu.search_placeholder"],
    "Search contents": ["dashboard.search_placeholder", "searchPlaceholder"],
    "Search for contents": [
      "searchPlaceholder",
      "dashboard.search_placeholder",
    ],
    "Search my learning contents": [
      "searchPlaceholder",
      "dashboard.search_placeholder",
    ],
    "Core Examination": ["eyes.core_examination_title"],
    Conditions: ["eyes.disease_title"],
    Workshops: ["eyes.primary_eye_care_procedures_title"],
    "Extended Examination": ["eyes.extended_examination_title"],
    "Tools and Kits": ["eyes.tools_title"],
    "Medical Students": ["eyes.card_label.medical_students"],
    Interactive: ["eyes.tag_interactive"],
    PDF: ["eyes.tag_pdf"],
  });
function g(e, t) {
  if (!e || !t) return;
  let a = String(t).split("."),
    n = e;
  for (let i = 0; i < a.length; i += 1) {
    if (!n || typeof n != "object") return;
    let l = a[i];
    if (l in n) {
      n = n[l];
      continue;
    }
    let s = !1;
    for (let c = a.length - 1; c > i; c -= 1) {
      let u = a.slice(i, c + 1).join(".");
      if (u in n) {
        ((n = n[u]), (i = c), (s = !0));
        break;
      }
    }
    if (!s) return;
  }
  return n;
}
function d(e) {
  let t = String(e || "")
    .trim()
    .toLowerCase();
  return x[t] ? t : "en";
}
function W(e) {
  return `/translation/${x[d(e)] || x.en}.json`;
}
function w() {
  let e = localStorage.getItem("prefLang");
  if (e) return d(e);
  let t = (document.documentElement.getAttribute("lang") || "").trim();
  return d(t || "en");
}
async function v(e) {
  let t = d(e);
  if (r.fetched.has(t)) return r.fetched.get(t);
  let a = (async () => {
    let n = W(t);
    try {
      let i = await fetch(n, { cache: "no-store" });
      if (!i.ok) {
        if (t === "en") return {};
        throw new Error(`Fetch failed: ${i.status}`);
      }
      return await i.json();
    } catch (i) {
      return (console.warn(`[i18n] Failed to load ${n}:`, i), {});
    }
  })();
  return (r.fetched.set(t, a), a);
}
async function D(e) {
  let t = d(e);
  if (r.loading?.lang === t) return r.loading.promise;
  let a = (async () => {
    let n = await v("en"),
      i = t === "en" ? n : await v(t);
    return (
      (r.fallbackDict = n || {}),
      (r.dict = i || {}),
      (r.lang = t),
      L(t),
      V(),
      r.dict
    );
  })().finally(() => {
    r.loading?.promise === a && (r.loading = null);
  });
  return ((r.loading = { lang: t, promise: a }), a);
}
async function M(e = w()) {
  let t = d(e);
  return r.loading?.lang === t
    ? (await r.loading.promise, r.dict)
    : ((r.lang !== t || !r.lang) && (await D(t)), r.dict);
}
function q(e) {
  return String(e ?? "")
    .replace(
      /\r\n?/g,
      `
`,
    )
    .replace(/\s+/g, " ")
    .trim();
}
var X = [
  [
    "Pain/Redness:",
    "\u0EAD\u0EB2\u0E81\u0EB2\u0E99\u0EC0\u0E88\u0EB1\u0E9A/\u0EC1\u0E94\u0E87:",
  ],
  [
    "DR/Scar",
    "\u0EC0\u0E9A\u0EBB\u0EB2\u0EAB\u0EA7\u0EB2\u0E99\u0E82\u0EB6\u0EC9\u0E99\u0E88\u0ECD\u0E95\u0EB2/\u0EAE\u0EAD\u0E8D\u0EC1\u0E9B\u0EC9\u0EA7",
  ],
  ["swinging light", "\u0EC1\u0EAA\u0E87\u0EC1\u0E81\u0EA7\u0EC8\u0E87"],
  [
    "direct ophthalmoscope",
    "\u0EC0\u0E84\u0EB7\u0EC8\u0EAD\u0E87\u0EAA\u0EC8\u0EAD\u0E87\u0E81\u0EBB\u0EC9\u0E99\u0E95\u0EB2\u0EC2\u0E94\u0E8D\u0E81\u0EBB\u0E87",
  ],
  ["Conditions", "\u0E9E\u0EB0\u0E8D\u0EB2\u0E94"],
  ["Condition", "\u0E9E\u0EB0\u0E8D\u0EB2\u0E94"],
  ["Eyes", "\u0E95\u0EB2"],
  [
    "Cataract",
    "\u0E9E\u0EB0\u0E8D\u0EB2\u0E94\u0E95\u0ECD\u0EC9\u0E81\u0EB0\u0E88\u0EBB\u0E81",
  ],
  [
    "cataract",
    "\u0E9E\u0EB0\u0E8D\u0EB2\u0E94\u0E95\u0ECD\u0EC9\u0E81\u0EB0\u0E88\u0EBB\u0E81",
  ],
  [
    "Cupped",
    "\u0E82\u0EBB\u0EC9\u0EA7\u0E9B\u0EB0\u0EAA\u0EB2\u0E94\u0E95\u0EB2\u0E9A\u0EB8\u0ECB\u0EA1",
  ],
  [
    "Detached",
    "\u0E88\u0ECD\u0E95\u0EB2\u0EAB\u0EBC\u0EB8\u0E94\u0EA5\u0EAD\u0E81",
  ],
  [
    "pupillary",
    "\u0E82\u0EAD\u0E87\u0EAE\u0EB9\u0EA1\u0EC8\u0EB2\u0E99\u0E95\u0EB2",
  ],
  ["pupils", "\u0EAE\u0EB9\u0EA1\u0EC8\u0EB2\u0E99\u0E95\u0EB2"],
  ["pupil", "\u0EAE\u0EB9\u0EA1\u0EC8\u0EB2\u0E99\u0E95\u0EB2"],
  ["fundus", "\u0E81\u0EBB\u0EC9\u0E99\u0E95\u0EB2"],
  ["retina", "\u0E88\u0ECD\u0E95\u0EB2"],
  ["refractive", "\u0E81\u0EB2\u0E99\u0EAB\u0EB1\u0E81\u0EC1\u0EAA\u0E87"],
  ["Reflex", "\u0E81\u0EB2\u0E99\u0EAA\u0EB0\u0E97\u0EC9\u0EAD\u0E99"],
  ["mths", "\u0EC0\u0E94\u0EB7\u0EAD\u0E99"],
  ["days", "\u0EA1\u0EB7\u0EC9"],
  ["deg", "\u0EAD\u0EBB\u0E87\u0EAA\u0EB2"],
];
function O(e) {
  if (d(r.lang) !== "lo") return e;
  let t = String(e);
  return (
    X.forEach(([a, n]) => {
      t = t.replaceAll(a, n);
    }),
    t
  );
}
function V() {
  r.literalIndex = new Map();
  let e = (t) => {
    !t ||
      typeof t != "object" ||
      Object.entries(t).forEach(([a, n]) => {
        let i = q(a);
        i && r.literalIndex.set(i, String(n));
      });
  };
  (e(r.fallbackDict?.i18nLiteral), e(r.dict?.i18nLiteral));
}
function S(e) {
  let t = q(e);
  if (!t) return null;
  let a = r.literalIndex.get(t);
  if (a != null) return O(a);
  let n = $[t] || [];
  for (let i of n) {
    let l = g(r.dict, i) ?? g(r.fallbackDict, i);
    if (l != null) return O(String(l));
  }
  return null;
}
function K(e, t = e) {
  let a = S(e);
  return a ?? t;
}
function Y(e, t = {}) {
  return String(e).replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (a, n) =>
    String(t[n] ?? ""),
  );
}
function Q(e, t = e, a = {}) {
  let n = g(r.dict, e) ?? g(r.fallbackDict, e);
  return Y(n ?? t, a);
}
function _(e) {
  return String(e || "")
    .split(";")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => {
      let [a, n = "text"] = t.split(":");
      return {
        path: String(a || "").trim(),
        target:
          String(n || "text")
            .trim()
            .toLowerCase() || "text",
      };
    })
    .filter((t) => t.path);
}
function Z(e = document) {
  if (!e || !r.literalIndex?.size) return;
  let t = e.ownerDocument || document,
    a = (e.nodeType === 9 && (e.body || e.documentElement)) || e;
  if (!a) return;
  let n = t.createTreeWalker(a, NodeFilter.SHOW_TEXT, null),
    i = n.nextNode();
  for (; i; ) {
    let s = i.parentElement,
      c = s?.closest("[data-i18n]"),
      u = c
        ? _(c.getAttribute("data-i18n") || "").some(({ target: o }) =>
            ["text", "html", "value"].includes(o),
          )
        : !1;
    if (
      s &&
      !u &&
      !s.closest("[data-i18n-skip]") &&
      !/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/i.test(s.tagName || "")
    ) {
      let o = S(i.textContent);
      o != null && i.textContent !== o && (i.textContent = o);
    }
    i = n.nextNode();
  }
  let l = ["aria-label", "title", "placeholder", "alt"];
  a.querySelectorAll("*").forEach((s) => {
    if (s.closest("[data-i18n-skip]")) return;
    let c = (s.getAttribute("data-i18n") || "").trim(),
      u = new Set(_(c).map((o) => o.target));
    l.forEach((o) => {
      if (u.has(o.toLowerCase())) return;
      let h = s.getAttribute(o);
      if (!h) return;
      let E = S(h);
      E != null && h !== E && s.setAttribute(o, E);
    });
  });
}
function f(e, t) {
  let a = String(t);
  e.textContent !== a && (e.textContent = a);
}
function p(e, t, a) {
  let n = String(a);
  e.getAttribute(t) !== n && e.setAttribute(t, n);
}
var k = new WeakMap();
function J(e, t) {
  let a = String(t),
    n = k.get(e),
    i = e.innerHTML;
  i !== a &&
    ((n?.text === a && n.html === i) ||
      ((e.innerHTML = a), k.set(e, { text: a, html: e.innerHTML })));
}
function T(e, t) {
  let a =
    e.querySelector('option[value=""]') ||
    e.querySelector("option[disabled]") ||
    e.options?.[0];
  a && f(a, t);
}
function I(e = document) {
  if (!e) return;
  let t = (n) => g(r.dict, n) ?? g(r.fallbackDict, n),
    a = [];
  (e.nodeType === 1 && e.matches?.("[data-i18n]") && a.push(e),
    typeof e.querySelectorAll == "function" &&
      a.push(...e.querySelectorAll("[data-i18n]")),
    a.forEach((n) => {
      let i = (n.getAttribute("data-i18n") || "").trim();
      if (!i || n.closest("[data-i18n-skip]")) return;
      let l = n.tagName.toUpperCase(),
        s = /^(SELECT|OPTGROUP|OPTION|INPUT|TEXTAREA|BUTTON)$/i.test(l);
      _(i).forEach(({ path: c, target: u }) => {
        let o = t(c);
        if (o != null)
          switch (u) {
            case "html": {
              s ? l === "SELECT" && T(n, o) : J(n, o);
              break;
            }
            case "text": {
              l === "SELECT"
                ? T(n, o)
                : l === "OPTGROUP"
                  ? p(n, "label", o)
                  : f(n, o);
              break;
            }
            case "placeholder": {
              l === "INPUT" || l === "TEXTAREA"
                ? p(n, "placeholder", o)
                : l === "SELECT" && T(n, o);
              break;
            }
            case "value": {
              if (l === "INPUT") {
                let h = (n.getAttribute("type") || "").toLowerCase();
                ["button", "submit", "reset"].includes(h) && p(n, "value", o);
              } else (l === "BUTTON" || l === "OPTION") && f(n, o);
              break;
            }
            case "label": {
              p(n, "label", o);
              break;
            }
            case "aria-label":
            case "title":
            case "alt": {
              p(n, u, o);
              break;
            }
            default:
              l === "SELECT"
                ? T(n, o)
                : l === "OPTGROUP"
                  ? p(n, "label", o)
                  : f(n, o);
          }
      });
    }),
    Z(e),
    N(e));
}
async function R() {
  if (((A = !0), !m)) {
    m = !0;
    try {
      for (; A; ) ((A = !1), await M(w()), I(document));
    } catch (e) {
      console.error("[i18n] translation pass failed", e);
    } finally {
      m = !1;
    }
  }
}
function b() {
  let e = () => {
    R();
  };
  (e(),
    typeof window.requestAnimationFrame == "function" &&
      (window.requestAnimationFrame(e),
      window.requestAnimationFrame(() => window.requestAnimationFrame(e))),
    j.forEach((t) => {
      window.setTimeout(e, t);
    }));
}
function ee() {
  m ||
    (y && window.clearTimeout(y),
    (y = window.setTimeout(() => {
      ((y = null), R());
    }, 60)));
}
function te() {
  if (P || typeof MutationObserver != "function") return;
  let e = document.body || document.documentElement;
  if (!e) return;
  ((P = !0),
    new MutationObserver((a) => {
      if (m) return;
      a.some((i) =>
        i.type === "characterData"
          ? !0
          : Array.from(i.addedNodes || []).some((l) =>
              l.nodeType === Node.TEXT_NODE
                ? !0
                : l.nodeType === Node.ELEMENT_NODE,
            ),
      ) && ee();
    }).observe(e, { childList: !0, characterData: !0, subtree: !0 }));
}
async function ne(e) {
  let t = d(e || w()),
    a = r.lang;
  if (
    (localStorage.setItem("prefLang", t),
    await D(t),
    I(document),
    L(t),
    a !== t)
  ) {
    let n = { lang: t, previousLang: a };
    (window.dispatchEvent(
      new CustomEvent("i18n:languageChanged", { detail: n }),
    ),
      document.dispatchEvent(
        new CustomEvent("language:updated", { detail: n }),
      ));
  }
  b();
  try {
    window.ARCLIGHT?.saveProfile?.({ language: t });
  } catch {}
}
window.__arclightI18nLifecycleBound ||
  ((window.__arclightI18nLifecycleBound = !0),
  window.addEventListener("page:loaded", b),
  document.addEventListener("page:shown", b),
  window.addEventListener("i18n:languageChanged", b));
(async () => (await M(w()), te(), b()))();
window.I18N = window.I18N || {};
window.I18N.setLanguage = window.I18N.setLanguage || ne;
window.I18N.applyTranslations = window.I18N.applyTranslations || I;
window.I18N.getLanguage = window.I18N.getLanguage || w;
window.I18N.translateLiteral = window.I18N.translateLiteral || K;
window.I18N.t = window.I18N.t || Q;
export { g as a, w as b, v as c, K as d, Q as e, ne as f };
