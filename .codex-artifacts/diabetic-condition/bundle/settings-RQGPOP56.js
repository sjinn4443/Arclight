import { a as h } from "./chunk-O2SRWS2B.js";
import { a as g, d as f, g as p, j as v, m as y } from "./chunk-7FFUJP4M.js";
import { s as m } from "./chunk-C3DWFWW5.js";
import { b as d, o as u } from "./chunk-P2HPNKQY.js";
import { b as i, d as c } from "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
var I = Object.freeze({ dataConsent: "settings:dataConsent" }),
  w = Object.freeze([
    "lessonProgress:",
    "videoProgress:",
    "childhoodWorkshop:progress:",
    "diabeticWorkshop:progress:",
    "glaucomaWorkshop:progress:",
  ]),
  _ = Object.freeze({
    am: "Amharic",
    ar: "Arabic",
    bn: "Bangla",
    en: "English",
    fr: "French",
    ha: "Hausa",
    hi: "Hindi",
    id: "Indonesian",
    ig: "Igbo",
    ne: "Nepali",
    ny: "Chichewa",
    pt: "Portuguese",
    rw: "Kinyarwanda",
    sw: "Swahili",
    ur: "Urdu",
    yo: "Yoruba",
    zh: "Chinese",
  });
function E(e) {
  let t = document.getElementById("settingsStatus");
  t && (t.textContent = c(e, e));
}
function S() {
  let e = document.getElementById("settingsLanguageLabel");
  if (!e) return;
  let t = i();
  e.textContent = _[t] || t.toUpperCase();
}
function C(e) {
  let t = String(e ?? "").trim();
  if (!/^\d+$/.test(t)) return null;
  let o = Number(t);
  return Number.isSafeInteger(o) && o > 0 ? o : null;
}
function k(e) {
  let t = typeof e?.versionDate == "string" ? e.versionDate.slice(0, 10) : "";
  return /^\d{4}-\d{2}-\d{2}$/.test(t)
    ? {
        versionDateIso: t,
        versionSequence:
          C(e?.versionSequence ?? e?.pushNumber ?? e?.buildNumber) || 1,
      }
    : null;
}
function L(e) {
  let t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e?.versionDateIso || "");
  return t
    ? `ver ${t[3]}.${t[2]}.${t[1]}.${e.versionSequence}`
    : "ver --.--.----";
}
async function A() {
  let e = ["/api/app/version", "/version.json"],
    t = null,
    o = Date.now();
  for (let n of e) {
    let s = n.includes("?") ? "&" : "?";
    try {
      let a = await fetch(`${n}${s}vts=${o}`, {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!a.ok) continue;
      let r = k(await a.json());
      if (!r) continue;
      if (!t || r.versionDateIso > t.versionDateIso) {
        t = r;
        continue;
      }
      r.versionDateIso === t.versionDateIso &&
        r.versionSequence > t.versionSequence &&
        (t = r);
    } catch {}
  }
  return t;
}
async function P() {
  let e = document.getElementById("settingsAppVersion");
  e && (e.textContent = L(await A()));
}
async function B() {
  let e = document.getElementById("privacyTermsModalTemplate");
  if (e) return e.content.cloneNode(!0);
  try {
    let t = await fetch("html/onboarding.html", {
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!t.ok) return null;
    let o = await t.text();
    return (
      new DOMParser()
        .parseFromString(o, "text/html")
        .getElementById("privacyTermsModalTemplate")
        ?.content?.cloneNode(!0) || null
    );
  } catch {
    return null;
  }
}
async function x() {
  if (document.getElementById("infoModalOverlay")) return;
  let e = document.createElement("div");
  ((e.id = "infoModalOverlay"),
    e.setAttribute("role", "dialog"),
    e.setAttribute("aria-modal", "true"));
  let t = await B();
  (t
    ? e.appendChild(t)
    : (e.innerHTML = `
      <div class="guest-modal">
        <button class="guest-modal__close" aria-label="Close">&times;</button>
        <div class="guest-modal__text privacyterms__text">
          <p>Only information needed to run and improve the service is collected.</p>
          <p>Personal data is never sold. You can ask to see, update or delete information held about you.</p>
        </div>
      </div>
    `),
    document.body.appendChild(e),
    window.I18N?.applyTranslations?.(e));
  let o = () => {
    (e.classList.add("fade-out"), setTimeout(() => e.remove(), 250));
  };
  (e.querySelector(".guest-modal__close")?.addEventListener("click", o),
    e.addEventListener("click", (n) => {
      n.target === e && o();
    }));
}
async function O() {
  try {
    let { openDownloadedContentsModal: e } = await import("./menu-AZX3HKAZ.js");
    await e();
  } catch (e) {
    (console.warn("[settings] downloaded contents modal failed", e),
      E("Could not open downloaded contents."));
  }
}
function D(e) {
  for (let t = localStorage.length - 1; t >= 0; t -= 1) {
    let o = localStorage.key(t) || "";
    e.some((n) => o.startsWith(n)) && localStorage.removeItem(o);
  }
}
function T() {
  (Object.values(d).forEach((e) => localStorage.removeItem(e)),
    Object.values(I).forEach((e) => localStorage.removeItem(e)),
    D(w),
    localStorage.removeItem("guestClicks"),
    localStorage.removeItem("guestMode"),
    localStorage.removeItem("cameFromSkipPath"),
    u({ source: "settings:delete-account" }));
}
function l(e, t) {
  let o = c(e, e);
  return o !== e ? o : i() === "lo" ? t : e;
}
function b(e, t) {
  return new Promise((o) => {
    document.getElementById("settingsConfirmOverlay")?.remove();
    let n = document.createElement("div");
    ((n.id = "settingsConfirmOverlay"),
      n.setAttribute("role", "dialog"),
      n.setAttribute("aria-modal", "true"),
      (n.innerHTML = `
      <div class="guest-modal settings-confirm-modal">
        <p class="guest-modal__text settings-confirm-modal__message"></p>
        <div class="settings-confirm-modal__actions">
          <button type="button" class="guest-modal__cta settings-confirm-modal__cancel" data-confirm="cancel"></button>
          <button type="button" class="guest-modal__cta" data-confirm="ok"></button>
        </div>
      </div>`),
      (n.querySelector(".settings-confirm-modal__message").textContent = l(
        e,
        t,
      )),
      (n.querySelector('[data-confirm="cancel"]').textContent = l(
        "Cancel",
        "\u0E8D\u0EBB\u0E81\u0EC0\u0EA5\u0EB5\u0E81",
      )),
      (n.querySelector('[data-confirm="ok"]').textContent = l(
        "OK",
        "\u0E95\u0EBB\u0E81\u0EA5\u0EBB\u0E87",
      )));
    let s = (a) => {
      (n.remove(), o(a));
    };
    (n.addEventListener("click", (a) => {
      let r = a.target.closest("[data-confirm]")?.dataset.confirm;
      r ? s(r === "ok") : a.target === n && s(!1);
    }),
      document.body.appendChild(n),
      n.querySelector('[data-confirm="cancel"]')?.focus());
  });
}
function q() {
  (document
    .getElementById("settingsPrivacyBtn")
    ?.addEventListener("click", () => {
      x();
    }),
    document
      .getElementById("settingsDownloadedContentsBtn")
      ?.addEventListener("click", () => {
        O();
      }),
    document
      .getElementById("settingsLogoutBtn")
      ?.addEventListener("click", async () => {
        if (
          await b(
            "Log out and return to the start screen?",
            "\u0EAD\u0EAD\u0E81\u0E88\u0EB2\u0E81\u0EA5\u0EB0\u0E9A\u0EBB\u0E9A \u0EC1\u0EA5\u0EB0 \u0E81\u0EB1\u0E9A\u0EC4\u0E9B\u0EDC\u0EC9\u0EB2\u0EC0\u0EA5\u0EB5\u0EC8\u0EA1\u0E95\u0EBB\u0EC9\u0E99\u0E9A\u0ECD?",
          )
        )
          try {
            await y();
          } catch (t) {
            E(p(t));
          }
      }),
    document
      .getElementById("settingsDeleteAccountBtn")
      ?.addEventListener("click", async () => {
        if (g().owner) {
          await v("delete");
          return;
        }
        (await b(
          "Delete this local account profile and learning progress?",
          "\u0EA5\u0EB6\u0E9A\u0EC2\u0E9B\u0EA3\u0EC4\u0E9F\u0EA5\u0ECC\u0E9A\u0EB1\u0E99\u0E8A\u0EB5\u0EC3\u0E99\u0EAD\u0EB8\u0E9B\u0EB0\u0E81\u0EAD\u0E99\u0E99\u0EB5\u0EC9 \u0EC1\u0EA5\u0EB0 \u0E84\u0EA7\u0EB2\u0EA1\u0E84\u0EB7\u0E9A\u0EDC\u0EC9\u0EB2\u0E81\u0EB2\u0E99\u0EAE\u0EBD\u0E99\u0E9A\u0ECD?",
        )) && (f(), T(), m("onboarding"));
      }));
}
function R() {
  (S(),
    h(),
    q(),
    P(),
    document.addEventListener("language:updated", S, { once: !0 }));
}
export { R as initializeSettings };
