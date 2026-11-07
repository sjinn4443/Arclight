import { b as z } from "./chunk-5O6BKJQI.js";
import {
  d as E,
  e as W,
  f as V,
  g as A,
  h as O,
  l as R,
  s as w,
} from "./chunk-C3DWFWW5.js";
import { h as B } from "./chunk-P2HPNKQY.js";
import { a as I, b as x, c as T } from "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
var N = new WeakSet(),
  k = {},
  F = null,
  D = 0,
  H = ["eyes", "ears", "skin"];
function J(e, t = {}) {
  return String(e || "").replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (a, s) =>
    String(t[s] ?? ""),
  );
}
async function G() {
  let e = x();
  (F === e && k) || ((k = await T(e)), (F = e));
}
async function X(e, t, a = {}, s = []) {
  await G();
  let d = I(k, e),
    r = s.map((i) => I(k, i)).find((i) => i != null);
  return J(d ?? r ?? t, a);
}
async function ee(e = []) {
  return e.length
    ? (await G(), e.map(({ path: t, fallback: a }) => I(k, t) ?? a).join(" | "))
    : "";
}
async function te() {
  let {
    cacheOfflineUrls: e,
    fetchAllOfflineAssetUrls: t,
    resolveOfflineDownloadSelection: a,
    showDownloadAppModal: s,
    showDownloadErrorModal: d,
  } = await import("./languageinstall-W7N72ZJU.js");
  try {
    let r = await t(),
      i = await s(r);
    if (!i) return;
    let n = a(r, i);
    (await navigator.serviceWorker.ready, await e(n));
  } catch (r) {
    (console.warn("[dashboard] could not download offline content:", r), d(r));
  }
}
function he() {
  let e = document.getElementById("unifiedDashboard");
  if (!e || N.has(e)) return;
  (N.add(e),
    ae(e),
    window.matchMedia?.("(pointer: coarse)")?.matches &&
      e.addEventListener("contextmenu", (l) => {
        let c = l.target;
        c instanceof Element &&
          c.closest(".category-card, .module-card") &&
          l.preventDefault();
      }));
  let t = e.querySelector(".hello"),
    a = (localStorage.getItem("username") || "").trim(),
    s = "dashboard_greeting_load_count",
    r = Number(localStorage.getItem(s) || "0") + 1;
  if ((localStorage.setItem(s, String(r)), t)) {
    ((t.textContent = ""), (t.innerHTML = ""));
    let l = async () => {
      let c = !!a,
        p = "",
        h = "";
      (r === 1
        ? ((p = c
            ? "dashboard.greeting_hello_name"
            : "dashboard.greeting_hello_generic"),
          (h = c ? `Hello ${a}!` : "Hello!"))
        : r === 2
          ? ((p = c
              ? "dashboard.greeting_welcome_back_name"
              : "dashboard.greeting_welcome_back_generic"),
            (h = c ? `Welcome back ${a}!` : "Welcome back!"))
          : r === 3 &&
            ((p = c
              ? "dashboard.greeting_nice_to_see_again_name"
              : "dashboard.greeting_nice_to_see_again_generic"),
            (h = c ? `Nice to see you again ${a}!` : "Nice to see you again!")),
        p &&
          (t.textContent = await X(p, h, { name: a }, ["dashboard.greeting"])));
    };
    if (r === 1) l();
    else if (r === 2) l();
    else if (r === 3) l();
    else {
      let c = document.createElement("img");
      ((c.src = "images/logo/pwainstall.png"),
        (c.alt = "PWA install"),
        (c.decoding = "async"),
        (c.className = "dashboard-greeting__install-mark"),
        t.appendChild(c));
    }
    window.addEventListener("i18n:languageChanged", () => {
      r >= 1 && r <= 3 && l();
    });
  }
  let i = e.querySelector(".menuBtn");
  i &&
    i.addEventListener("click", (l) => {
      (l.preventDefault(), R());
    });
  let n = e.querySelector(".search-wrap--compact"),
    g = e.querySelector("#dashboardSearchToggle"),
    o = e.querySelector("#dashboardSearchInput"),
    u = e.querySelector("#dashboardSearchPanel");
  (n &&
    g &&
    g.addEventListener("click", () => {
      n.classList.contains("search-collapsed")
        ? (n.classList.remove("search-collapsed"),
          n.classList.add("search-expanded"),
          o?.focus(),
          v(o, u))
        : (n.classList.remove("search-expanded"),
          n.classList.add("search-collapsed"),
          u && (u.hidden = !0),
          o?.blur());
    }),
    o &&
      u &&
      (o.addEventListener("input", () => {
        v(o, u);
      }),
      o.addEventListener("focus", () => {
        v(o, u);
      }),
      o.addEventListener("keydown", (l) => {
        l.key === "Escape" && ((u.hidden = !0), o.blur());
      }),
      e.addEventListener("click", (l) => {
        l.target.closest?.(".search-wrap--compact") || (u.hidden = !0);
      }),
      window.addEventListener("i18n:languageChanged", () => {
        u.hidden || v(o, u);
      })));
  let K = {
      eyesModules: "eyes",
      earsModules: "ears",
      skinModules: "videos",
      teachModules: "videos",
      eyesCatalogPage: "eyes",
      earsLearningModules: "ears",
      earsCatalogPage: "ears",
    },
    M = new Set(["skinModules", "teachModules"]);
  e.querySelectorAll(".category-card").forEach((l) => {
    let c = l.getAttribute("data-target") || "";
    (M.has(c) &&
      (l.classList.add("category-card--disabled"),
      l.removeAttribute("data-route"),
      l.removeAttribute("data-page")),
      l.addEventListener("click", (p) => {
        if (M.has(c)) {
          (p.preventDefault(), p.stopPropagation());
          return;
        }
        let h = K[c] || c;
        h && w(h);
      }));
  });
  let m = e.querySelector("#categoryCarousel"),
    P = Array.from(e.querySelectorAll("#carouselDots .dot"));
  if (m && P.length) {
    let l = () => Array.from(m.querySelectorAll(".category-card")),
      c = () => {
        let f = l();
        if (!f.length) return 0;
        let y = m.scrollLeft + m.offsetWidth / 2,
          b = 0,
          _ = 1 / 0;
        return (
          f.forEach((S, Y) => {
            let Z = S.offsetLeft + S.offsetWidth / 2,
              q = Math.abs(Z - y);
            q < _ && ((_ = q), (b = Y));
          }),
          b
        );
      },
      p = (f) => {
        P.forEach((y, b) => y.classList.toggle("active", b === f));
      },
      h = (f) => {
        let y = l();
        if (!y.length) return;
        let b = Math.max(0, Math.min(f, y.length - 1)),
          _ = y[b],
          S = _.offsetLeft - m.offsetWidth / 2 + _.offsetWidth / 2;
        m.scrollTo({ left: S, behavior: "smooth" });
      },
      L = null,
      U = () => {
        L ||
          (L = requestAnimationFrame(() => {
            ((L = null), p(c()));
          }));
      };
    (m.addEventListener("scroll", U, { passive: !0 }),
      P.forEach((f, y) => f.addEventListener("click", () => h(y))),
      requestAnimationFrame(() => p(c())));
  }
  e.querySelectorAll(".quick-actions .pill").forEach((l) => {
    let c = (l.getAttribute("data-action") || "").trim();
    c === "atomscard"
      ? l.addEventListener("click", () => w("atomscard"))
      : c === "offline" &&
        l.addEventListener("click", () => {
          te();
        });
  });
  let C = document.getElementById("recommendedPlaceholder");
  C &&
    ($(C),
    window.addEventListener("i18n:languageChanged", () => {
      $(C);
    }));
}
function ae(e) {
  let t = B("eyes"),
    a = [t, ...H.filter((r) => r !== t)].filter((r) => H.includes(r)),
    s = e.querySelector("#categoryCarousel");
  if (s) {
    let r = new Map(
      Array.from(s.querySelectorAll(".category-card")).map((i) => [
        i.dataset.category,
        i,
      ]),
    );
    (a.forEach((i) => {
      let n = r.get(i);
      n && s.appendChild(n);
    }),
      (s.scrollLeft = 0));
  }
  let d = e.querySelector("#carouselDots");
  if (d) {
    let r = new Map(
      Array.from(d.querySelectorAll(".dot")).map((i) => [
        i.dataset.category,
        i,
      ]),
    );
    a.forEach((i, n) => {
      let g = r.get(i);
      g && (g.classList.toggle("active", n === 0), d.appendChild(g));
    });
  }
}
function se(e) {
  let t = e.slice();
  for (let a = t.length - 1; a > 0; a--) {
    let s = Math.floor(Math.random() * (a + 1));
    [t[a], t[s]] = [t[s], t[a]];
  }
  return t;
}
function re(e) {
  e &&
    ((window.__videosPendingTarget = e),
    (window.__videosSuppressFlash = !0),
    w("videos"));
}
function Q() {
  return [
    ...Object.entries(z).map(([e, t]) => ({
      title: t.title,
      titleI18n: `ears.content.${e}`,
      route: e,
      img: t.image,
      subtitle: "Ears",
      subtitleParts: [{ path: "ears.earsCatalogTitle", fallback: "Ears" }],
      keywords: ["ears", "ear", t.category, t.title],
      progress: 0,
    })),
    {
      title: "Ophthalmoscopy",
      titleI18n: "eyes.card_label.ophthalmoscopy",
      page: "directOphthalmoscopy",
      img: "images/icon/eyes/core/ophth.webp",
      subtitle: "Video | Quiz",
      subtitleParts: [
        { path: "eyes.tag_video", fallback: "Video" },
        { path: "eyes.tag_quiz", fallback: "Quiz" },
      ],
      keywords: ["direct ophthalmoscopy", "fundoscopy", "optic disc", "do"],
      progress: 0,
    },
    {
      title: "Visual Acuity",
      titleI18n: "eyes.card_label.visual_acuity",
      page: "visualAcuityPage",
      img: "images/icon/eyes/core/visualacuity.webp",
      subtitle: "Video",
      subtitleParts: [{ path: "eyes.tag_video", fallback: "Video" }],
      keywords: ["vision", "va", "acuity", "visual"],
      progress: 0,
    },
    {
      title: "Pupils",
      titleI18n: "eyes.card_label.pupils",
      page: "pupilsPage",
      img: "images/icon/eyes/core/pupils.webp",
      subtitle: "Video | Quiz",
      subtitleParts: [
        { path: "eyes.tag_video", fallback: "Video" },
        { path: "eyes.tag_quiz", fallback: "Quiz" },
      ],
      keywords: ["rapd", "pupil", "swinging flashlight"],
      progress: 0,
    },
    {
      title: "Front of Eye",
      titleI18n: "eyes.card_label.front_of_eye",
      page: "anteriorSegmentVideoPage",
      img: "images/icon/eyes/core/frontofeye.webp",
      subtitle: "Video | Case Study",
      subtitleParts: [
        { path: "eyes.tag_video", fallback: "Video" },
        { path: "eyes.tag_case_study", fallback: "Case Study" },
      ],
      keywords: ["anterior segment", "cornea", "red eye"],
      progress: 0,
    },
    {
      title: "Fundal Reflex",
      titleI18n: "eyes.card_label.fundal_reflex",
      page: "fundalReflexPage",
      img: "images/icon/eyes/core/car_fundalreflex.webp",
      subtitle: "Video | PDF | Scrollytelling",
      subtitleParts: [
        { path: "eyes.tag_video", fallback: "Video" },
        { path: "eyes.tag_pdf", fallback: "PDF" },
        { path: "i18nLiteral.Scrollytelling", fallback: "Scrollytelling" },
      ],
      subtitleSearchI18n: ["eyes.tag_video"],
      keywords: ["red reflex", "media opacity", "childhood screening"],
      progress: 0,
    },
    {
      title: "Interactive Learning",
      titleI18n: "eyes.card_label.interactive_learning",
      page: "interactiveLearningPage",
      img: "images/icon/eyes/core/miniapp.webp",
      subtitle: "Mini Apps",
      subtitleParts: [{ path: "eyes.tag_mini_apps", fallback: "Mini Apps" }],
      keywords: ["mini apps", "simulation", "interactive"],
      progress: 0,
    },
    {
      title: "Arclight Overview",
      titleI18n: "eyes.card_label.arclight_overview",
      page: "arclightPage",
      img: "images/icon/eyes/tools/car_arclight.webp",
      subtitle: "Tools and kits",
      subtitleParts: [{ path: "eyes.tools_title", fallback: "Tools and Kits" }],
      subtitleSearchI18n: ["eyes.tools_title"],
      keywords: ["how to use arclight", "phone attachment", "device"],
      progress: 0,
    },
    {
      title: "Holo Overview",
      titleI18n: "eyes.card_label.holo_overview",
      page: "holoOverviewPage",
      img: "images/icon/eyes/tools/car_holo.webp",
      subtitle: "Tools and kits",
      subtitleParts: [{ path: "eyes.tools_title", fallback: "Tools and Kits" }],
      subtitleSearchI18n: ["eyes.tools_title"],
      keywords: ["binocular indirect ophthalmoscopy", "bio", "holo"],
      progress: 0,
    },
    {
      title: "Childhood Eye Screening",
      titleI18n: "eyes.card_label.childhood_eye_screening",
      route: "childhoodEyeScreeningWorkshop",
      img: "images/icon/eyes/disease/car_childhood.webp",
      subtitle: "Workshop",
      subtitleParts: [
        {
          path: "eyes.primary_eye_care_procedures_title",
          fallback: "Workshops",
        },
      ],
      subtitleSearchI18n: ["eyes.primary_eye_care_procedures_title"],
      keywords: ["children", "screening", "fundal reflex"],
      progress: 0,
    },
    {
      title: "Glaucoma",
      titleI18n: "eyes.card_label.glaucoma",
      route: "glaucomaWorkshop",
      img: "images/icon/eyes/disease/car_glaucoma.webp",
      subtitle: "Workshop",
      subtitleParts: [
        {
          path: "eyes.primary_eye_care_procedures_title",
          fallback: "Workshops",
        },
      ],
      subtitleSearchI18n: ["eyes.primary_eye_care_procedures_title"],
      keywords: ["optic nerve", "cup disc", "iop"],
      progress: 0,
    },
    {
      title: "Diabetic Retinopathy",
      titleI18n: "eyes.card_label.diabetic_retinopathy",
      route: "diabeticRetinopathyWorkshop",
      img: "images/icon/eyes/disease/car_diabetic.webp",
      subtitle: "Workshop",
      subtitleParts: [
        {
          path: "eyes.primary_eye_care_procedures_title",
          fallback: "Workshops",
        },
      ],
      subtitleSearchI18n: ["eyes.primary_eye_care_procedures_title"],
      keywords: ["diabetes", "retina", "screening"],
      progress: 0,
    },
    {
      title: "Cataract",
      titleI18n: "eyes.card_label.cataract",
      page: "cataractPage",
      img: "images/icon/eyes/disease/car_cataract.webp",
      subtitle: "Mini App",
      subtitleParts: [{ path: "eyes.tag_mini_app", fallback: "Mini App" }],
      keywords: ["lens", "opacity", "simulation"],
      progress: 0,
    },
    {
      title: "Mires",
      titleI18n: "menu.mires_checkbox",
      page: "miresPage",
      img: "images/icon/eyes/core/miniapp.webp",
      subtitle: "Mini App",
      subtitleParts: [{ path: "eyes.tag_mini_app", fallback: "Mini App" }],
      keywords: ["keratometry", "cornea"],
      progress: 0,
    },
    {
      title: "Morph",
      titleI18n: "menu.morph_checkbox",
      page: "morphPage",
      img: "images/icon/eyes/core/miniapp.webp",
      subtitle: "Mini App",
      subtitleParts: [{ path: "eyes.tag_mini_app", fallback: "Mini App" }],
      keywords: ["face", "simulation"],
      progress: 0,
    },
    {
      title: "Squint / Palsy",
      titleI18n: "eyes.card_label.eye_movements/squint",
      page: "squintPalsyPage",
      img: "images/icon/eyes/extended/car_squint.webp",
      subtitle: "Mini App",
      subtitleParts: [{ path: "eyes.tag_mini_app", fallback: "Mini App" }],
      keywords: ["eye movements", "palsy", "strabismus"],
      progress: 0,
    },
  ];
}
function oe(e, t) {
  let a = A(e.titleI18n, t, e.title),
    s = [
      e.subtitle,
      ...(e.subtitleParts || []).flatMap(({ path: d, fallback: r }) =>
        A(d, t, r),
      ),
      ...(e.subtitleSearchI18n || []).flatMap((d) => A(d, t)),
    ];
  return {
    titleValues: a,
    keywordValues: e.keywords || [],
    haystack: W([a, s, e.keywords || [], e.page, e.route]),
  };
}
function ie(e, t, a) {
  let s = E(t);
  if (!s) return 0;
  let { titleValues: d, keywordValues: r, haystack: i } = oe(e, a),
    n = d.map(E).filter(Boolean),
    g = r.map(E).filter(Boolean);
  return n.some((o) => o === s)
    ? 120
    : n.some((o) => o.startsWith(s))
      ? 100
      : n.some((o) => o.split(" ").some((u) => u.startsWith(s)))
        ? 82
        : n.some((o) => o.includes(s))
          ? 70
          : g.some((o) => o.startsWith(s))
            ? 62
            : i.includes(s)
              ? 45
              : 0;
}
function ne(e, t) {
  return Q()
    .map((a) => ({ item: a, score: ie(a, e, t) }))
    .filter((a) => a.score > 0)
    .sort(
      (a, s) => s.score - a.score || a.item.title.localeCompare(s.item.title),
    )
    .map((a) => a.item);
}
async function j(e, t) {
  let a = e.content.querySelector(".module-card").cloneNode(!0);
  (t.route && a.setAttribute("data-route", t.route),
    t.page && a.setAttribute("data-page", t.page));
  let s = a.querySelector("img");
  s &&
    ((s.src = t.img),
    (s.alt = t.title),
    t.titleI18n && s.setAttribute("data-i18n", `${t.titleI18n}:alt`));
  let d = a.querySelector(".module-title");
  d &&
    ((d.textContent = t.title),
    t.titleI18n && d.setAttribute("data-i18n", t.titleI18n));
  let r = a.querySelector(".module-subtitle");
  r &&
    (t.subtitle
      ? (r.textContent = t.subtitleParts?.length
          ? await ee(t.subtitleParts)
          : t.subtitle)
      : r.remove());
  let i = a.querySelector(".progress");
  return (
    i && (i.style.width = `${t.progress || 0}%`),
    a.addEventListener("click", () => {
      let n = a.getAttribute("data-page"),
        g = a.getAttribute("data-route");
      if (n) {
        re(n);
        return;
      }
      g && w(g);
    }),
    a
  );
}
async function v(e, t) {
  if (!e || !t) return;
  let a = e.value.trim();
  if (!a) {
    t.hidden = !0;
    return;
  }
  let s = ++D,
    d = await V();
  if (s !== D) return;
  let r = document.getElementById("dashboardRecommendedCardTemplate");
  if (!r) return;
  let i = t.querySelector(".dashboard-search-suggestions"),
    n = t.querySelector(".dashboard-search-results");
  if (!i || !n) return;
  let g = ne(a, d);
  if (
    (i.replaceChildren(),
    n.replaceChildren(),
    g.slice(0, 4).forEach((o) => {
      let u = document.createElement("button");
      ((u.type = "button"),
        (u.className = "dashboard-search-suggestion"),
        (u.textContent = O(o.titleI18n, d, o.title)),
        u.addEventListener("click", () => {
          ((e.value = u.textContent), v(e, t));
        }),
        i.appendChild(u));
    }),
    !g.length)
  ) {
    let o = document.createElement("div");
    ((o.className = "dashboard-search-empty"),
      (o.textContent = "No matching content"),
      n.appendChild(o),
      (t.hidden = !1));
    return;
  }
  for (let o of g.slice(0, 5)) {
    let u = await j(r, o);
    if (s !== D) return;
    (u.classList.add("dashboard-search-result-card"), n.appendChild(u));
  }
  try {
    window.I18N?.applyTranslations?.(t);
  } catch {}
  t.hidden = !1;
}
async function $(e) {
  let t = se(Q()).slice(0, 2),
    a = document.getElementById("dashboardRecommendedCardTemplate");
  if (a) {
    e.textContent = "";
    for (let s of t) {
      let d = await j(a, s);
      e.appendChild(d);
    }
    try {
      window.I18N?.applyTranslations?.(e);
    } catch {}
  }
}
export { he as initializeDashboard };
