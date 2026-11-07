import {
  a as le,
  c as ce,
  e as ae,
  f as F,
  g as de,
  h as ue,
  i as me,
} from "./chunk-7FFUJP4M.js";
import { d as se } from "./chunk-UEXRDOY7.js";
import { s as Z } from "./chunk-C3DWFWW5.js";
import "./chunk-P2HPNKQY.js";
import "./chunk-BGCC32GM.js";
import "./chunk-WOT6VMZA.js";
function Ne() {
  let c = document.getElementById("username"),
    L = document.getElementById("usernameTooltip"),
    r = document.getElementById("interestSelect"),
    f = document.getElementById("interestSelectDisplay"),
    O = document.getElementById("interestSelectText"),
    v = document.getElementById("interestSelectPanel"),
    G = document.getElementById("interestSelectUi"),
    xe = document.getElementById("interestError"),
    s = document.getElementById("jobSelect"),
    h = document.getElementById("jobSelectDisplay"),
    D = document.getElementById("jobSelectText"),
    m = document.getElementById("jobSelectPanel"),
    K = document.getElementById("jobSelectUi"),
    J = null,
    E = document.getElementById("practiceYearsSelect"),
    S = document.getElementById("practiceMonthsSelect"),
    A = document.getElementById("practiceRangeHint"),
    k = document.getElementById("practiceLevelRange"),
    g = document.getElementById("experienceByRole"),
    Q = document.getElementById("practiceLevelTemplate"),
    C = document.getElementById("studentYearField"),
    p = document.getElementById("studentYearSelect"),
    x = document.getElementById("practiceLevelField"),
    T = document.getElementById("completeOnboardingBtn"),
    w = !1,
    X = document.getElementById("onboardingCredentials"),
    R = document.getElementById("onboardingAccountError"),
    fe = document.getElementById("onboardingLoginId"),
    H = document.getElementById("onboardingPassword");
  (H && (H.pattern = ae),
    F(fe, document.getElementById("onboardingIdHint")),
    F(H, document.getElementById("onboardingPasswordHint")),
    F(document.getElementById("onboardingEmail")));
  let Y = null;
  function ge(e) {
    return e <= 24 ? "0-2" : e <= 60 ? "2-5" : e <= 120 ? "5-10" : "10+";
  }
  function pe(e) {
    if (e === "10+") return "Selected band: 10+ years";
    let [t, n] = e.split("-");
    return `Selected band: ${t}\u2013${n} years`;
  }
  function ve() {
    if (!E || !S) return;
    let e = E.value,
      t = S.value;
    if (e === "" || t === "") {
      (A && (A.hidden = !0), k && (k.value = ""));
      return;
    }
    let n = parseInt(e, 10),
      i = parseInt(t, 10),
      o = n * 12 + i,
      a = ge(o);
    (k && (k.value = a), A && ((A.textContent = pe(a)), (A.hidden = !1)));
  }
  let Te = () => {
    (he(), ve(), d());
  };
  function he() {
    if (!E || !S) return;
    let e = parseInt(E.value || "0", 10),
      t = parseInt(S.value || "0", 10),
      n = Number.isFinite(e) && e >= 0 ? e : 0,
      i = Number.isFinite(t) && t >= 0 ? t : 0;
    (i > 11 && (i = 11),
      E.value !== "" && String(n) !== E.value && (E.value = String(n)),
      S.value !== "" && String(i) !== S.value && (S.value = String(i)));
  }
  let ee = document.getElementById("onboardingInfoBtn");
  ee &&
    ee.addEventListener("click", () => {
      Ce();
    });
  function U(e) {
    return e
      ? Array.from(e.options || [])
          .filter((t) => t.selected)
          .map((t) => t.value)
          .filter((t) => t && t !== "")
      : [];
  }
  function te(e) {
    return e
      ? Array.from(e.options || [])
          .filter((t) => t.selected && t.value)
          .map((t) => (t.textContent || "").trim())
          .filter(Boolean)
      : [];
  }
  function P(e, t, n, i) {
    if (e) {
      if (!t.length) {
        (e.removeAttribute("data-i18n-skip"),
          e.setAttribute("data-i18n", n),
          (e.textContent = i));
        return;
      }
      (e.removeAttribute("data-i18n"),
        e.setAttribute("data-i18n-skip", ""),
        (e.textContent = t.join(", ")));
    }
  }
  function q(e, t = "Select") {
    return (
      (e &&
        (
          (
            e.querySelector('option[value=""]') ||
            e.querySelector("option[disabled]") ||
            e.options?.[0]
          )?.textContent || ""
        ).trim()) ||
      t
    );
  }
  function ne() {
    !r ||
      !v ||
      ((v.innerHTML = ""),
      Array.from(r.querySelectorAll("option")).forEach((e) => {
        if (!e.value) return;
        let n = (e.textContent || "").trim(),
          i = document.createElement("div");
        ((i.className = "multi-select__option"),
          i.setAttribute("role", "option"));
        let o = document.createElement("span");
        ((o.className = "multi-select__tick"), (o.textContent = "\u2713"));
        let a = document.createElement("span");
        ((a.className = "multi-select__label"),
          (a.textContent = n),
          i.appendChild(o),
          i.appendChild(a));
        let l = () => {
          i.setAttribute("aria-selected", e.selected ? "true" : "false");
        };
        (i.addEventListener("click", () => {
          ((e.selected = !e.selected),
            l(),
            N(),
            W(),
            d(),
            r.dispatchEvent(new Event("change")),
            Y && clearTimeout(Y),
            (Y = setTimeout(() => {
              $();
            }, 600)));
        }),
          l(),
          v.appendChild(i));
      }));
  }
  function N() {
    if (!O || !r) return;
    if (!b().length) {
      P(O, [], "onboarding.field_placeholder", q(r, "Select"));
      return;
    }
    P(O, te(r), "onboarding.field_placeholder", q(r, "Select"));
  }
  function ye() {
    !v ||
      !f ||
      (ne(),
      N(),
      v.classList.remove("hidden"),
      f.setAttribute("aria-expanded", "true"));
  }
  function $() {
    !v ||
      !f ||
      (v.classList.add("hidden"), f.setAttribute("aria-expanded", "false"));
  }
  (f?.addEventListener("click", () => {
    v && !v.classList.contains("hidden") ? $() : ye();
  }),
    document.addEventListener("click", (e) => {
      G && (G.contains(e.target) || $());
    }));
  function y() {
    return s ? U(s) : [];
  }
  function Ee() {
    s &&
      Array.from(s.options).forEach((e) => {
        e.selected = !1;
      });
  }
  function j() {
    if (!s || !m || !r) return;
    m.innerHTML = "";
    let e = b(),
      t = e.includes("generalist") ? ["eyes", "ears", "skin"] : e;
    if (!t.length) {
      let n = document.createElement("div");
      ((n.className = "multi-select__group-title"),
        n.setAttribute("data-i18n", "onboarding.select_interest_first"),
        (n.textContent = "Select an interest first"),
        m.appendChild(n),
        window.I18N?.applyTranslations?.(m));
      return;
    }
    t.forEach((n) => {
      let i = s.querySelector(`optgroup[data-field="${n}"]`);
      if (!i) return;
      let o = document.createElement("div");
      o.className = "multi-select__group-title";
      let a =
        document
          .querySelector('label[for="jobSelectDisplay"]')
          ?.textContent?.trim() || "Roles";
      ((o.textContent = i.getAttribute("label") || a),
        m.appendChild(o),
        Array.from(i.querySelectorAll("option")).forEach((l) => {
          let I = (l.textContent || "").trim(),
            u = document.createElement("div");
          ((u.className = "multi-select__option"),
            u.setAttribute("role", "option"));
          let M = document.createElement("span");
          ((M.className = "multi-select__tick"), (M.textContent = "\u2713"));
          let _ = document.createElement("span");
          ((_.className = "multi-select__label"),
            (_.textContent = I),
            u.appendChild(M),
            u.appendChild(_));
          let re = () => {
            u.setAttribute("aria-selected", l.selected ? "true" : "false");
          };
          (u.addEventListener("click", () => {
            ((l.selected = !l.selected),
              re(),
              B(),
              z(),
              d(),
              s.dispatchEvent(new Event("change")),
              J && clearTimeout(J),
              (J = setTimeout(() => {
                V();
              }, 600)));
          }),
            re(),
            m.appendChild(u));
        }));
    });
  }
  (h?.addEventListener("click", () => {
    m && !m.classList.contains("hidden") ? V() : Se();
  }),
    document.addEventListener("click", (e) => {
      K && (K.contains(e.target) || V());
    }));
  function B() {
    if (!D) return;
    if (!y().length) {
      P(D, [], "onboarding.job_role_placeholder", q(s, "Select"));
      return;
    }
    P(D, te(s), "onboarding.job_role_placeholder", q(s, "Select"));
  }
  function Se() {
    !m ||
      !h ||
      (j(),
      B(),
      m.classList.remove("hidden"),
      h.setAttribute("aria-expanded", "true"));
  }
  function V() {
    !m ||
      !h ||
      (m.classList.add("hidden"), h.setAttribute("aria-expanded", "false"));
  }
  function z() {
    let e = y(),
      t = e.includes("medical_student"),
      n = e.filter((i) => i && i !== "medical_student");
    if (
      (C &&
        (C.classList.toggle("hidden", !t),
        !t && p && (p.value = ""),
        p?.dispatchEvent(new Event("change"))),
      x)
    ) {
      let i = n.length > 0;
      (x.classList.toggle("hidden", !i),
        i
          ? ie(n)
          : g &&
            g.querySelectorAll(".role-exp-block").forEach((o) => {
              o.remove();
            }));
    }
  }
  function be(e) {
    return (
      s?.querySelector(`option[value="${CSS.escape(e)}"]`)?.textContent || e
    ).trim();
  }
  function _e(e, t, n) {
    let i = parseInt(e, 10);
    return Number.isFinite(i) ? String(Math.min(n, Math.max(t, i))) : "";
  }
  function ke(e) {
    e &&
      (e.value && String(e.value).trim() !== ""
        ? e.classList.add("filled")
        : e.classList.remove("filled"));
  }
  function ie(e) {
    if (!g) return;
    let t = {};
    (g.querySelectorAll("[data-role]").forEach((n) => {
      let i = n.getAttribute("data-role"),
        o = n.querySelector('select[data-kind="practiceLevel"]')?.value || "";
      i && (t[i] = { range: o });
    }),
      (g.innerHTML = ""),
      e.forEach((n) => {
        let i = be(n);
        if (!Q) return;
        let o = Q.content.firstElementChild?.cloneNode(!0);
        if (!o) return;
        o.setAttribute("data-role", n);
        let a = o.querySelector(".role-exp-label");
        a && (a.textContent = i);
        let l = o.querySelector('select[data-kind="practiceLevel"]');
        l && (l.value = t[n]?.range || "");
        let I = () => {
          l &&
            (l.classList.toggle("has-value", !!l.value),
            l.classList.toggle("filled", !!l.value),
            d());
        };
        (l?.addEventListener("change", I), I(), g.appendChild(o));
      }));
    try {
      window.I18N?.applyTranslations?.(g);
    } catch {}
  }
  if (c && L) {
    let e = (n) => n.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, ""),
      t = () => {
        let n = e(c.value);
        n !== c.value && (c.value = n);
        let o = n.replace(/\s+/g, "").length < 2;
        n === "" ? L.classList.add("hidden") : L.classList.toggle("hidden", !o);
      };
    (c.addEventListener("input", t), t());
  }
  if (
    ([c, r, p].forEach((e) => {
      if (!e) return;
      let t = () => {
        e.value && e.value.trim() !== ""
          ? e.classList.add("filled")
          : e.classList.remove("filled");
      };
      (t(), e.addEventListener("input", t), e.addEventListener("change", t));
    }),
    r)
  ) {
    let e = () => {
      let t = b();
      f &&
        (f.classList.toggle("filled", t.length > 0),
        f.classList.toggle("has-value", t.length > 0));
    };
    (e(), r.addEventListener("change", e), r.addEventListener("change", N));
  }
  if (s) {
    let e = () => {
      let t = y();
      h &&
        (h.classList.toggle("filled", t.length > 0),
        h.classList.toggle("has-value", t.length > 0));
    };
    (e(), s.addEventListener("change", e), s.addEventListener("change", B));
  }
  [p].forEach((e) => {
    if (!e) return;
    let t = () => {
      e.value ? e.classList.add("has-value") : e.classList.remove("has-value");
    };
    (t(), e.addEventListener("change", t));
  });
  function b() {
    return r ? U(r) : [];
  }
  function W() {
    if (!r || !s) return;
    let e = b(),
      t = e.length > 0,
      n = e.includes("generalist") ? ["eyes", "ears", "skin"] : e;
    if (
      (s.querySelectorAll("optgroup").forEach((o) => {
        o.hidden = !0;
      }),
      n.forEach((o) => {
        let a = s.querySelector(`optgroup[data-field="${o}"]`);
        a && (a.hidden = !1);
      }),
      !t)
    ) {
      (Ee(),
        p && (p.value = ""),
        C?.classList.add("hidden"),
        x?.classList.add("hidden"),
        s.dispatchEvent(new Event("change")),
        j(),
        B(),
        d());
      return;
    }
    let i = new Set(n);
    (Array.from(s.querySelectorAll("option")).forEach((o) => {
      let l = o.closest("optgroup")?.getAttribute("data-field");
      l && (i.has(l) || (o.selected = !1));
    }),
      s.dispatchEvent(new Event("change")),
      j(),
      B(),
      d());
  }
  r && s && (r.addEventListener("change", W), W());
  function oe() {
    (ne(), N(), j(), B());
    let t = y().filter((n) => n && n !== "medical_student");
    t.length && ie(t);
  }
  (window.addEventListener("i18n:languageChanged", oe),
    document.addEventListener("language:updated", oe),
    s?.addEventListener("change", () => {
      (z(), d());
    }));
  function Ie() {
    let e = (c?.value || "").trim();
    if (e === "") return !1;
    let t = e.replace(/\s+/g, "").length < 2,
      n = /[0-9]/.test(e),
      i = /[^A-Za-zÀ-ÖØ-öø-ÿ\s]/.test(e);
    return !(t || n || i);
  }
  function Le() {
    return b().length > 0;
  }
  function Be() {
    return y().length > 0;
  }
  function Ae() {
    let e = y(),
      t = e.includes("medical_student"),
      n = e.filter((i) => i && i !== "medical_student");
    if (t && !p?.value) return !1;
    if (n.length > 0) {
      if (!g) return !1;
      for (let i of n) {
        let a =
          g
            .querySelector(`[data-role="${CSS.escape(i)}"]`)
            ?.querySelector('select[data-kind="practiceLevel"]')?.value || "";
        if (String(a).trim() === "") return !1;
      }
    }
    return !0;
  }
  function d() {
    let e =
      Ie() &&
      Le() &&
      Be() &&
      Ae() &&
      Array.from(X?.querySelectorAll("input") || []).every(
        (t) => t.validity.valid,
      ) &&
      !w;
    return (T && (T.disabled = !e), e);
  }
  (c?.addEventListener("input", d),
    r?.addEventListener("change", d),
    s?.addEventListener("change", d),
    p?.addEventListener("change", d),
    X?.addEventListener("input", d),
    z(),
    d(),
    T?.addEventListener("click", async (e) => {
      if (!d()) {
        e.preventDefault();
        return;
      }
      ((w = !0), (T.disabled = !0), R && (R.textContent = ""));
      let n = y().join("|"),
        o = b().join("|");
      try {
        await se({
          name: (c?.value || "").trim(),
          aims: null,
          interest: o || null,
          experience: n || null,
          contact: null,
          language:
            document.documentElement.getAttribute("lang") ||
            localStorage.getItem("prefLang") ||
            "en",
        });
      } catch {}
      let a = {
        username: c?.value?.trim() || null,
        userField: o || null,
        userJob: n,
        studentYears:
          (C && !C.classList.contains("hidden") && p?.value) || null,
        practiceByRole: null,
      };
      if (x && !x.classList.contains("hidden")) {
        let l = y().filter((u) => u && u !== "medical_student"),
          I = {};
        (l.forEach((u) => {
          let _ =
            g
              ?.querySelector(`[data-role="${CSS.escape(u)}"]`)
              ?.querySelector('select[data-kind="practiceLevel"]')?.value || "";
          I[u] = { range: _ };
        }),
          (a.practiceByRole = JSON.stringify(I)));
      }
      try {
        (await ce(
          {
            loginId: document.getElementById("onboardingLoginId").value,
            email: document.getElementById("onboardingEmail").value,
            password: document.getElementById("onboardingPassword").value,
          },
          a,
        ),
          (document.getElementById("onboardingPassword").value = ""),
          localStorage.setItem("arclight:onboarded", "1"),
          T.isConnected && (await Z("interest")));
      } catch (l) {
        R && (R.textContent = de(l));
      } finally {
        ((w = !1), d());
      }
    }),
    document
      .getElementById("skipContinueBtn")
      ?.addEventListener("click", async () => {
        w ||
          (localStorage.setItem("arclight:onboarded", "1"),
          localStorage.setItem("guestMode", le().owner ? "false" : "true"),
          localStorage.removeItem("guestClicks"),
          sessionStorage.setItem("arclight:account:nudge-dismissed", "1"),
          me() ? await ue() : await Z("intro"));
      }));
}
function Ce() {
  if (document.getElementById("infoModalOverlay")) return;
  let c = document.createElement("div");
  ((c.id = "infoModalOverlay"),
    c.setAttribute("role", "dialog"),
    c.setAttribute("aria-modal", "true"));
  let L = document.getElementById("privacyTermsModalTemplate");
  (L && c.appendChild(L.content.cloneNode(!0)), document.body.appendChild(c));
  let r = () => {
    (c.classList.add("fade-out"), setTimeout(() => c.remove(), 250));
  };
  (c.querySelector(".guest-modal__close")?.addEventListener("click", r),
    c.querySelector(".guest-modal__cta")?.addEventListener("click", r),
    c.addEventListener("click", (f) => {
      f.target === c && r();
    }));
}
export { Ne as initializeOnboarding };
