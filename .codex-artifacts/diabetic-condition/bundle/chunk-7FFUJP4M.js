import { q as L, s as h } from "./chunk-C3DWFWW5.js";
import { e as re } from "./chunk-BGCC32GM.js";
var B = [
    "username",
    "userField",
    "userJob",
    "studentYears",
    "practiceByRole",
    "profileAvatarDataUrl",
  ],
  he = [
    "lessonProgress:",
    "videoProgress:",
    "childhoodWorkshop:progress:",
    "diabeticWorkshop:progress:",
    "glaucomaWorkshop:progress:",
    "primaryWorkshop:progress:",
  ],
  pe = [
    "likedItems",
    "likedEyes_v1",
    "eyesLikes",
    "liked",
    "pecWorkshop:fundalInterpretationAnswers",
    "paediatricSurgicalEyeEarWorkshop:earQuiz:v1",
  ];
function J(e) {
  return he.some((t) => e.startsWith(t));
}
function x(e) {
  return (
    typeof e == "string" &&
    e.length <= 240 &&
    (B.includes(e) || pe.includes(e) || J(e))
  );
}
function m(e = {}, t = {}) {
  let r = { ...e };
  for (let [n, o] of Object.entries(t)) {
    let a = r[n];
    if (!a) {
      r[n] = o;
      continue;
    }
    let l = o.modifiedAt > a.modifiedAt ? o : a;
    if (J(n) && a.value !== null && o.value !== null)
      try {
        let i = JSON.parse(a.value),
          s = JSON.parse(o.value),
          S = JSON.parse(l.value),
          _ = Math.max(Number(i.percent) || 0, Number(s.percent) || 0),
          I = {
            ...S,
            percent: Math.min(100, Math.max(0, _)),
            updatedAt: Math.max(
              Number(i.updatedAt) || 0,
              Number(s.updatedAt) || 0,
            ),
          };
        (("maxTime" in i || "maxTime" in s) &&
          (I.maxTime = Math.max(
            Number(i.maxTime) || 0,
            Number(s.maxTime) || 0,
          )),
          (r[n] = {
            value: JSON.stringify(I),
            modifiedAt: Math.max(a.modifiedAt, o.modifiedAt),
          }));
        continue;
      } catch {
        try {
          let i = JSON.parse(a.value);
          if (i && typeof i == "object" && !Array.isArray(i)) {
            r[n] = a;
            continue;
          }
        } catch {}
        try {
          let i = JSON.parse(o.value);
          if (i && typeof i == "object" && !Array.isArray(i)) {
            r[n] = o;
            continue;
          }
        } catch {}
      }
    r[n] = l;
  }
  return r;
}
var M = "arclight:account:state",
  O = "arclight:account:guest",
  q = "arclight:account:cache:",
  c = C(M) || { owner: null, account: null, records: {} },
  b = !1,
  K = c.owner ? "offline" : "local",
  ae = !1,
  d = !1,
  g = null,
  ce,
  ie = 0,
  Y = "",
  se = !1;
function C(e) {
  try {
    return JSON.parse(localStorage.getItem(e) || "null");
  } catch {
    return null;
  }
}
function X() {
  localStorage.setItem(M, JSON.stringify(c));
}
function P() {
  document.dispatchEvent(
    new CustomEvent("arclight:account-changed", { detail: k() }),
  );
}
function y(e) {
  K !== e && ((K = e), P());
}
function k() {
  return {
    account: c.account,
    owner: c.owner,
    authenticated: b,
    status: K,
    checked: se,
  };
}
function G({ includeProfile: e = !0 } = {}) {
  return Object.entries(f()).some(([t, r]) => {
    if (r.value === null || r.value.trim() === "") return !1;
    if (B.includes(t)) return e;
    try {
      let n = JSON.parse(r.value);
      return J(t)
        ? Number(n?.percent) > 0 || Number(n?.maxTime) > 0
        : Array.isArray(n)
          ? n.length > 0
          : n?.submitted === !0 ||
            Object.values(n?.answers || {}).some((o) => o != null && o !== "");
    } catch {
      return !1;
    }
  });
}
function f() {
  let e = { ...(c.records || {}) },
    t = new Set(Object.keys(e));
  for (let n = 0; n < localStorage.length; n += 1) {
    let o = localStorage.key(n);
    x(o) && t.add(o);
  }
  let r = !1;
  for (let n of t) {
    if (!x(n)) continue;
    let o = localStorage.getItem(n);
    e[n]?.value !== o &&
      ((e[n] = {
        value: o,
        modifiedAt: Math.max(Date.now(), (e[n]?.modifiedAt || 0) + 1),
      }),
      (r = !0));
  }
  return (r && ((c.records = e), X()), e);
}
function D(e) {
  let t = [],
    r = new Set(Object.keys(e));
  for (let n = 0; n < localStorage.length; n += 1) {
    let o = localStorage.key(n);
    x(o) && r.add(o);
  }
  for (let n of r) {
    if (!x(n)) continue;
    let o = localStorage.getItem(n),
      a = e[n]?.value ?? null;
    o !== a &&
      (a === null ? localStorage.removeItem(n) : localStorage.setItem(n, a),
      t.push({ key: n, oldValue: o, newValue: a }));
  }
  ((c.records = e), X());
  for (let n of t)
    window.dispatchEvent(
      new StorageEvent("storage", { ...n, storageArea: localStorage }),
    );
  (document.dispatchEvent(new CustomEvent("arclight:profile-updated")),
    document.dispatchEvent(new CustomEvent("arclight:lesson-progress-changed")),
    window.dispatchEvent(new CustomEvent("likes:changed")));
}
async function v(e, t, r = t === void 0 ? "GET" : "POST", n = {}) {
  let o;
  try {
    o = await fetch(`/api/account${e}`, {
      method: r,
      credentials: "same-origin",
      cache: "no-store",
      ...(t === void 0
        ? {}
        : {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(t),
          }),
      signal:
        typeof AbortSignal.timeout == "function"
          ? AbortSignal.timeout(2e4)
          : void 0,
      ...n,
    });
  } catch {
    throw Object.assign(new Error("offline"), { code: "offline" });
  }
  let a = await o.json().catch(() => ({}));
  if (!o.ok)
    throw Object.assign(new Error(a.error || "service_unavailable"), {
      code: a.error,
      status: o.status,
    });
  return a;
}
function $() {
  (f(),
    c.owner
      ? (X(), localStorage.setItem(`${q}${c.owner}`, JSON.stringify(c)))
      : localStorage.setItem(O, JSON.stringify(c.records)));
}
function j(e, t) {
  ((c = { owner: e.id, account: e, records: t }),
    (b = !0),
    localStorage.setItem("arclight:onboarded", "1"),
    localStorage.setItem("guestMode", "false"),
    localStorage.removeItem("guestClicks"),
    D(t),
    (Y = ""),
    y("syncing"),
    P());
}
async function _e({ loginId: e, email: t, password: r }, n = {}) {
  d = !0;
  try {
    (await g, $());
    let o = c.owner ? {} : { ...f() },
      a = {};
    for (let s of B)
      Object.prototype.hasOwnProperty.call(n, s) &&
        (a[s] = {
          value: n[s],
          modifiedAt: Math.max(Date.now(), (o[s]?.modifiedAt || 0) + 1),
        });
    let l = await v("/register", {
        loginId: e,
        email: t,
        password: r,
        records: { ...o, ...a },
      }),
      i = c.owner ? {} : f();
    (j(l.account, m(l.records, i)), localStorage.removeItem(O));
  } finally {
    d = !1;
  }
  await p();
}
async function le(e, t) {
  d = !0;
  try {
    (await g, $());
    let r = c.owner,
      n = await v("/login", e),
      o = n.records,
      a = C(`${q}${n.account.id}`);
    if (
      (a?.owner === n.account.id && (o = m(o, a.records)), r === n.account.id)
    )
      o = m(o, f());
    else if (!r && G({ includeProfile: !1 }) && (await t())) {
      let i = Object.fromEntries(
        Object.entries(f()).filter(([s]) => !B.includes(s)),
      );
      ((o = m(o, i)), localStorage.removeItem(O));
    }
    j(n.account, o);
  } finally {
    d = !1;
  }
  await p();
}
async function p({ keepalive: e = !1 } = {}) {
  if (d || !b || !c.owner) return;
  if (g) return g;
  let t = c.owner,
    r = f();
  if (JSON.stringify(r) === Y && Date.now() - ie < 3e4) return;
  let n = { accountId: t, records: r };
  if (!(e && JSON.stringify(n).length > 5e4))
    return (
      y("syncing"),
      (g = (async () => {
        try {
          let o = await v("/sync", n, "POST", { keepalive: e });
          if (c.owner !== t) return;
          let a = f();
          ((Y = JSON.stringify(o.records)),
            D(m(o.records, a)),
            (ie = Date.now()),
            y("synced"));
        } catch (o) {
          o.status === 401 || o.code === "account_changed"
            ? ((b = !1), y("signin_required"))
            : y(o.code === "invalid_records" ? "sync_error" : "offline");
        } finally {
          g = null;
        }
      })()),
      g
    );
}
async function F() {
  if (d) return;
  let e = c.owner;
  try {
    let t = await v("/session");
    if (d || e !== c.owner) return;
    if (!t.account) {
      ((b = !1), y(c.owner ? "signin_required" : "local"));
      return;
    }
    let r = f();
    if (c.owner === t.account.id) j(t.account, m(t.records, r));
    else {
      $();
      let n = C(`${q}${t.account.id}`);
      j(t.account, m(t.records, n?.records || {}));
    }
    await p();
  } catch {
    y(c.owner ? "offline" : "local");
  } finally {
    ((se = !0), P());
  }
}
function Ie() {
  c.owner || (localStorage.removeItem(O), (c.records = {}), D({}));
}
async function Z() {
  (await p(), (d = !0));
  try {
    (await g,
      $(),
      await v("/logout", {}),
      (c = { owner: null, account: null, records: C(O) || {} }),
      (b = !1),
      D(c.records),
      y("local"),
      P());
  } finally {
    d = !1;
  }
}
async function ue(e) {
  d = !0;
  try {
    (await g,
      await v("/", { password: e }, "DELETE"),
      localStorage.removeItem(`${q}${c.owner}`),
      (c = { owner: null, account: null, records: C(O) || {} }),
      (b = !1),
      D(c.records),
      y("local"),
      P());
  } finally {
    d = !1;
  }
}
function de() {
  if (ae) return;
  ((ae = !0), f(), F());
  let e = () => {
    d || (clearTimeout(ce), (ce = setTimeout(() => void p(), 800)));
  };
  for (let t of [
    "arclight:lesson-progress-changed",
    "arclight:profile-updated",
    "childhoodWorkshop:progress-changed",
    "diabeticWorkshop:progress-changed",
    "glaucomaWorkshop:progress-changed",
  ])
    document.addEventListener(t, e);
  (window.addEventListener("likes:changed", e),
    window.addEventListener("online", () => void F()),
    document.addEventListener("visibilitychange", () => {
      document.hidden ? p({ keepalive: !0 }) : F();
    }),
    window.addEventListener("pagehide", () => void p({ keepalive: !0 })),
    window.addEventListener("storage", (t) => {
      if (t.key === M && t.storageArea === localStorage) {
        let r = C(M);
        if (r?.owner !== c.owner) {
          window.location.reload();
          return;
        }
        r && (c.records = m(c.records, r.records));
      }
      x(t.key) && e();
    }),
    setInterval(() => {
      !document.hidden && !d && (f(), p());
    }, 5e3));
}
var U = "arclight:account:return",
  Q = "arclight:account:mode",
  te = new Set([
    "account",
    "onboarding",
    "languageinstall",
    "splashscreen",
    "intro",
    "interest",
  ]),
  fe = !1,
  w = null,
  ge = !1,
  z = (e) => re(`account.${e}`),
  we = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\\s])[\\s\\S]{12,128}";
function H(e, t, r = () => !0) {
  if (!e) return () => {};
  let n = () => {
    e.classList.toggle("filled", !!e.value);
    let o = r() && !e.validity.valid;
    e.setAttribute("aria-invalid", String(!!e.value && o));
    let a = t?.hasAttribute("data-password-checklist");
    if (a) {
      let l = {
        letters: /[a-z]/.test(e.value) && /[A-Z]/.test(e.value),
        symbols: /[0-9]/.test(e.value) && /[^A-Za-z0-9\s]/.test(e.value),
        length: e.value.length >= 12,
      };
      for (let i of t.querySelectorAll("[data-password-rule]")) {
        let s = l[i.dataset.passwordRule];
        i.dataset.satisfied = String(s);
        let S = i.querySelector("[data-password-marker]");
        ((S.textContent = s ? "\u2713" : "\xD7"),
          (S.dataset.i18n = `account.${s ? "rule_met" : "rule_unmet"}:aria-label`),
          S.setAttribute("aria-label", z(s ? "rule_met" : "rule_unmet")));
      }
    }
    t?.classList.toggle(
      "hidden",
      !(r() && (a || o) && document.activeElement === e),
    );
  };
  for (let o of ["input", "change", "focus", "blur"]) e.addEventListener(o, n);
  return (n(), n);
}
function ye(e) {
  let t =
    {
      offline: "offline",
      invalid_credentials: "invalid_credentials",
      account_unavailable: "unavailable",
      invalid_recovery: "invalid_recovery",
      mail_unavailable: "mail_unavailable",
      rate_limited: "rate_limited",
      busy: "rate_limited",
      invalid_registration: "invalid_registration",
      invalid_records: "sync_error",
      service_unavailable: "error",
    }[e?.code] || "error";
  return z(t);
}
function ve() {
  let e = L();
  e && !te.has(e.routeName) && sessionStorage.setItem(U, JSON.stringify(e));
}
async function ee(e = "dashboard") {
  let t;
  try {
    t = JSON.parse(sessionStorage.getItem(U) || "null");
  } catch {}
  return (
    sessionStorage.removeItem(U),
    t && !te.has(t.routeName)
      ? h(t.routeName, { subPageId: t.subPageId })
      : h(e)
  );
}
function ke() {
  return !!sessionStorage.getItem(U);
}
async function Ee(e = "login") {
  (ve(), sessionStorage.setItem(Q, e), await h("account", { force: !0 }));
}
function E(e, t) {
  e && ((e.dataset.i18n = `account.${t}`), (e.textContent = z(t)));
}
function V() {
  let { account: e, owner: t, status: r, authenticated: n } = k();
  for (let o of document.querySelectorAll("[data-account-status]")) E(o, r);
  for (let o of document.querySelectorAll("[data-account-identity]"))
    o.textContent = e?.loginId || "";
  for (let o of document.querySelectorAll("[data-account-guest]"))
    o.hidden = !!(t && k().authenticated);
  for (let o of document.querySelectorAll("[data-account-member]"))
    o.hidden = !t;
  for (let o of document.querySelectorAll("[data-account-authenticated]"))
    o.hidden = !n;
  t && document.getElementById("accountEntryNudge")?.remove();
}
function Se() {
  return (
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    navigator.standalone === !0
  );
}
function me() {
  let e = L();
  if (
    !w ||
    !ge ||
    e?.routeName !== w.routeName ||
    !k().checked ||
    !e ||
    te.has(e.routeName) ||
    Se() ||
    k().owner ||
    G() ||
    sessionStorage.getItem("arclight:account:nudge-dismissed") ||
    document.getElementById("accountEntryNudge")
  )
    return;
  let t = document.createElement("aside");
  ((t.id = "accountEntryNudge"),
    (t.className = "account-nudge"),
    t.setAttribute("aria-labelledby", "accountEntryMessage"));
  let r = document.createElement("p");
  (E(r, "nudge"), (r.id = "accountEntryMessage"));
  let n = document.createElement("div");
  n.className = "account-nudge__actions";
  for (let [o, a] of [
    ["login", "sign_in"],
    ["dismiss", "continue"],
  ]) {
    let l = document.createElement("button");
    ((l.type = "button"),
      (l.className = "account-link"),
      (l.dataset.accountAction = o),
      E(l, a),
      n.append(l));
  }
  (t.append(r, n), document.body.append(t));
}
function Te() {
  fe ||
    ((fe = !0),
    (w = L()),
    w &&
      ["settings", "myprofile", "editProfile"].includes(w.routeName) &&
      (w = null),
    de(),
    document.addEventListener("arclight:account-ui-ready", V),
    document.addEventListener("arclight:account-changed", () => {
      (V(), me());
    }),
    window.addEventListener("page:rendered", () => {
      ((ge = !0),
        L()?.routeName !== w?.routeName && (w = null),
        document.getElementById("accountEntryNudge")?.remove(),
        V(),
        me());
    }),
    document.addEventListener("click", async (e) => {
      let t = e.target.closest("[data-account-action]");
      if (!t) return;
      e.preventDefault();
      let r = t.dataset.accountAction;
      if (r === "dismiss") {
        (sessionStorage.setItem("arclight:account:nudge-dismissed", "1"),
          document.getElementById("accountEntryNudge")?.remove());
        return;
      }
      if (r === "cancel") {
        await ee();
        return;
      }
      if (r === "logout") {
        if (t.disabled) return;
        t.disabled = !0;
        let n = document.getElementById("menuAccountError");
        n && (n.textContent = "");
        try {
          (await h("dashboard"), await Z());
          let { closeMenu: o } = await import("./menu-AZX3HKAZ.js");
          (o(), await h("dashboard", { force: !0 }));
        } catch (o) {
          n && (n.textContent = ye(o));
        } finally {
          t.disabled = !1;
        }
        return;
      }
      if (r === "create") {
        (ve(), await h("onboarding"));
        return;
      }
      await Ee(r === "recover" ? "recover" : "login");
    }));
}
function Re() {
  let e = document.getElementById("accountForm");
  if (!e || e.dataset.bound) return;
  e.dataset.bound = "true";
  let t = sessionStorage.getItem(Q) || "login";
  sessionStorage.removeItem(Q);
  let r = document.getElementById("accountLoginId"),
    n = document.getElementById("accountEmail"),
    o = document.getElementById("accountCode"),
    a = document.getElementById("accountPassword"),
    l = document.getElementById("accountSubmit"),
    i = document.getElementById("accountError"),
    s = document.getElementById("accountResult");
  (H(r), H(n));
  let S = H(
      a,
      document.getElementById("accountPasswordHint"),
      () => t === "code",
    ),
    _ = (N, u, A = u) => {
      let T = e.querySelector(`[data-account-field="${N}"]`);
      T.hidden = !u;
      let R = T.querySelector("input");
      ((R.disabled = !u), (R.required = A));
    };
  function I() {
    let N = t === "recover" || t === "code";
    (_("login", t === "login"),
      _("email", N),
      _("code", t === "code"),
      _("password", t !== "recover", t !== "code"),
      (a.autocomplete = t === "code" ? "new-password" : "current-password"),
      (a.minLength = t === "code" ? 12 : 1),
      t === "code" ? (a.pattern = we) : a.removeAttribute("pattern"),
      S(),
      E(
        document.getElementById("accountTitle"),
        t === "delete" ? "delete_account" : N ? "recover" : "sign_in",
      ),
      E(
        l,
        t === "recover"
          ? "send_code"
          : t === "code"
            ? "recover_submit"
            : t === "delete"
              ? "delete_account"
              : "sign_in",
      ));
    let u = document.getElementById("accountDescription");
    (t === "code"
      ? E(u, "recovery_hint")
      : t === "delete"
        ? E(u, "delete_hint")
        : (u.removeAttribute("data-i18n"), (u.textContent = "")),
      (document.getElementById("accountRecover").hidden = t !== "login"),
      (document.getElementById("accountCreateRow").hidden = t !== "login"));
  }
  (I(),
    e.addEventListener("submit", async (N) => {
      if ((N.preventDefault(), !(!e.reportValidity() || l.disabled))) {
        ((l.disabled = !0), (i.textContent = ""), (s.textContent = ""));
        try {
          if (t === "login")
            (await le(
              { loginId: r.value, password: a.value },
              () =>
                new Promise((u) => {
                  e.hidden = !0;
                  let A = document.getElementById("accountMerge");
                  ((A.hidden = !1),
                    A.querySelector('[data-merge="no"]').focus());
                  let T = (W) => {
                      (window.removeEventListener("page:loaded", R),
                        A.removeEventListener("click", ne),
                        (A.hidden = !0),
                        (e.hidden = !1),
                        u(W));
                    },
                    R = () => {
                      e.isConnected || T(!1);
                    },
                    ne = (W) => {
                      let oe = W.target.closest("[data-merge]");
                      oe && T(oe.dataset.merge === "yes");
                    };
                  (A.addEventListener("click", ne),
                    window.addEventListener("page:loaded", R));
                }),
            ),
              (a.value = ""),
              e.isConnected && (await ee()));
          else if (t === "recover")
            (await v("/recovery/request", { email: n.value }),
              (t = "code"),
              I(),
              E(s, "sent"),
              o.focus());
          else if (t === "code") {
            let u = await v("/recovery/complete", {
              email: n.value,
              code: o.value,
              password: a.value || void 0,
            });
            ((a.value = ""),
              (o.value = ""),
              (t = "login"),
              I(),
              s.removeAttribute("data-i18n"),
              (s.textContent = `${z("recovered")} ${u.loginId}`),
              (r.value = u.loginId),
              a.focus());
          } else
            t === "delete" && (await ue(a.value), (a.value = ""), await ee());
        } catch (u) {
          i.textContent = ye(u);
        } finally {
          l.disabled = !1;
        }
      }
    }));
}
async function Le() {
  (await Z(), await h("dashboard", { force: !0 }));
}
export {
  k as a,
  G as b,
  _e as c,
  Ie as d,
  we as e,
  H as f,
  ye as g,
  ee as h,
  ke as i,
  Ee as j,
  Te as k,
  Re as l,
  Le as m,
};
