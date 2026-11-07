import { a as C, b as L, c as b, e as S } from "./chunk-5O6BKJQI.js";
import { l as u, s as y } from "./chunk-C3DWFWW5.js";
import "./chunk-P2HPNKQY.js";
import "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
function v(t) {
  for (let [o, l] of Object.entries(b)) {
    let f = t.querySelector(`#${o}`);
    f.replaceChildren();
    for (let i of l) {
      let s = L[i],
        c = s
          ? S(i)
          : window.I18N?.t?.("ears.pecWorkshopTitle", "PEC workshop") ||
            "PEC workshop",
        e = document.createElement("div");
      ((e.className = "eyes-card eyes-card--blank-black"),
        (e.dataset.target = i),
        (e.dataset.label = c));
      let a = document.createElement("button");
      ((a.type = "button"),
        (a.className = "eyes-card__open"),
        a.setAttribute("aria-label", c),
        (a.dataset.i18n = `${s ? `ears.content.${i}` : "ears.pecWorkshopTitle"}:aria-label`),
        a.addEventListener("click", () => y(i)));
      let r = document.createElement("span");
      if (
        ((r.className = "eyes-card__title"),
        (r.dataset.i18n = s ? `ears.content.${i}` : "ears.pecWorkshopTitle"),
        (r.textContent = c),
        s?.image)
      ) {
        let n = document.createElement("img");
        ((n.className = "ear-card-art"),
          (n.src = s.image),
          (n.alt = ""),
          (n.loading = "lazy"),
          e.append(n));
      }
      let p = document.createElement("div");
      p.className = "tag-row";
      let d = (
        s
          ? [
              ...new Set(
                s.groups.flatMap((n) => n.lessons).map((n) => C[n].type),
              ),
            ]
          : ["scroll"]
      ).map((n) =>
        n === "pdf"
          ? "PDF"
          : n === "video"
            ? "Video"
            : n === "download"
              ? "Slides"
              : "Scroll",
      );
      ([...new Set(d)].slice(0, 3).forEach((n) => {
        let g = document.createElement("span");
        ((g.className = "tag"),
          (g.textContent = n),
          n !== "Slides" && (g.dataset.i18n = `eyes.tag_${n.toLowerCase()}`),
          p.append(g));
      }),
        e.append(a, r, p),
        f.append(e));
    }
  }
}
function w(t) {
  let o = Array.from(t.querySelectorAll(".eyes-card"));
  if (o.length < 2) return;
  let l = document.createElement("span");
  ((l.className = "carousel-dots"),
    o.forEach((e, a) => {
      let r = document.createElement("button");
      ((r.type = "button"), (r.className = "dot"));
      let p = window.I18N?.t?.("i18nExtra.eyes_go_to_item") || "Go to item";
      (r.setAttribute("aria-label", `${p} ${a + 1}`),
        r.addEventListener("click", () => {
          let m = getComputedStyle(t).direction === "rtl",
            d = t.scrollWidth - t.clientWidth,
            n =
              a === 0
                ? 0
                : a === o.length - 1
                  ? m
                    ? -d
                    : d
                  : t.scrollLeft +
                    e.getBoundingClientRect().left -
                    t.getBoundingClientRect().left -
                    (t.clientWidth - e.offsetWidth) / 2;
          t.scrollTo({ left: n, behavior: "smooth" });
        }),
        l.appendChild(r));
    }),
    t.previousElementSibling.appendChild(l));
  let f = () => {
    let e = t.scrollWidth - t.clientWidth,
      a = Math.abs(t.scrollLeft),
      r = t.getBoundingClientRect(),
      p = r.left + r.width / 2,
      m = 0;
    if (a >= e - 2 && e > 0) m = o.length - 1;
    else if (a > 2) {
      let d = 1 / 0;
      o.forEach((n, g) => {
        let E = n.getBoundingClientRect(),
          h = Math.abs(E.left + E.width / 2 - p);
        h < d && ((d = h), (m = g));
      });
    }
    Array.from(l.children).forEach((d, n) => {
      (d.classList.toggle("active", n === m),
        d.setAttribute("aria-pressed", String(n === m)));
    });
  };
  (t.addEventListener(
    "scroll",
    () => {
      f();
      try {
        sessionStorage.setItem(`ears:carousel:${t.id}`, String(t.scrollLeft));
      } catch {}
    },
    { passive: !0 },
  ),
    f(),
    requestAnimationFrame(() => {
      try {
        t.scrollLeft =
          Number(sessionStorage.getItem(`ears:carousel:${t.id}`)) || 0;
      } catch {}
      f();
    }));
  let i = null,
    s = !1;
  (t.addEventListener(
    "click",
    (e) => {
      s && ((s = !1), e.preventDefault(), e.stopImmediatePropagation());
    },
    { capture: !0 },
  ),
    t.addEventListener("pointerdown", (e) => {
      e.pointerType !== "mouse" ||
        e.button !== 0 ||
        ((s = !1), (i = { id: e.pointerId, x: e.clientX, left: t.scrollLeft }));
    }),
    t.addEventListener("pointermove", (e) => {
      if (!i || i.id !== e.pointerId) return;
      let a = e.clientX - i.x;
      (Math.abs(a) < 5 && !t.hasPointerCapture(i.id)) ||
        (t.setPointerCapture(i.id),
        (s = !0),
        t.classList.add("is-pointer-dragging"),
        (t.scrollLeft = i.left - a),
        e.preventDefault());
    }));
  let c = () => {
    (i && t.hasPointerCapture(i.id) && t.releasePointerCapture(i.id),
      (i = null),
      t.classList.remove("is-pointer-dragging"));
  };
  (t.addEventListener("pointerup", c),
    t.addEventListener("pointercancel", c),
    t.addEventListener("lostpointercapture", c),
    t.addEventListener("pointerleave", () => {
      i && !t.hasPointerCapture(i.id) && c();
    }));
}
function N() {
  let t = document.getElementById("earsCatalogPage");
  if (!t || t.dataset.earsInitialized === "true") return;
  ((t.dataset.earsInitialized = "true"), v(t));
  let o = t.querySelector(".menuBtn");
  (o?.addEventListener("click", () => u()),
    o?.addEventListener("keydown", (l) => {
      (l.key !== "Enter" && l.key !== " ") || (l.preventDefault(), u());
    }),
    t.querySelectorAll(".eyes-carousel").forEach(w),
    window.I18N?.applyTranslations?.(t));
}
export { N as initializeEars };
