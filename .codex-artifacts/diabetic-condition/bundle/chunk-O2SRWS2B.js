import { d as q } from "./chunk-BGCC32GM.js";
var x = "#myProfilePage .profile-topbar__icons .icon-btn:not(.menuBtn)",
  H = "arclight:notification-history:v1",
  j = "arclight:notification-history-seen:v1",
  m = (e) => q(e, e),
  F = !1;
function V({ readState: e, request: t }) {
  if (F) return;
  F = !0;
  let n = [],
    a = "",
    r = !1,
    i,
    v;
  function u() {
    let s = e().token || "";
    if (a !== s) {
      ((a = s), (n = []));
      try {
        let o = JSON.parse(localStorage.getItem(H) || "null");
        o?.owner === a && Array.isArray(o.items) && (n = o.items);
      } catch {}
    }
  }
  function w() {
    try {
      let s = JSON.parse(localStorage.getItem(j) || "null");
      return (s?.owner === a && Number(s.at)) || 0;
    } catch {
      return 0;
    }
  }
  function E() {
    let s = document.querySelector(x),
      o = s?.querySelector(".notif-dot"),
      c = n.some((b) => b.sentAt > w());
    (o && (o.hidden = !c), s && s.setAttribute("aria-haspopup", "dialog"));
  }
  function O() {
    try {
      localStorage.setItem(
        j,
        JSON.stringify({
          owner: a,
          at: Math.max(w(), ...n.map((s) => s.sentAt), 0),
        }),
      );
    } catch {}
    E();
  }
  function U() {
    if ((E(), !i?.open)) return;
    let s = i.querySelector("[data-inbox-list]");
    if ((s.replaceChildren(), !n.length)) {
      let o = document.createElement("p");
      ((o.textContent = m("No notifications yet.")), s.appendChild(o));
    }
    for (let o of n) {
      let c = document.createElement("a");
      ((c.className = "notification-inbox__item"),
        (c.href = /^\/#\/[a-zA-Z0-9_/-]+$/.test(o.url)
          ? o.url
          : "/#/mylearning"));
      let b = document.createElement("strong");
      b.textContent = o.title;
      let $ = document.createElement("p");
      $.textContent = o.body;
      let z = document.createElement("time");
      ((z.dateTime = new Date(o.sentAt).toISOString()),
        (z.textContent = `${m("Sent")} \xB7 ${new Date(o.sentAt).toLocaleString()}`),
        c.append(b, $, z),
        c.addEventListener("click", (oe) => {
          (oe.preventDefault(),
            i.close(),
            (location.hash = new URL(c.href, location.origin).hash));
        }),
        s.appendChild(c));
    }
    O();
  }
  async function S() {
    if (!r) {
      if ((u(), E(), U(), !e().token)) {
        i?.open &&
          (i.querySelector("[data-inbox-status]").textContent = m(
            "Enable practice reminders in Settings to receive notifications.",
          ));
        return;
      }
      r = !0;
      try {
        let s = e(),
          o = await t("GET", "/history", s);
        if (e().token !== s.token) return;
        if (Array.isArray(o?.notifications)) {
          n = o.notifications
            .filter(
              (c) =>
                typeof c.id == "string" &&
                typeof c.title == "string" &&
                typeof c.body == "string" &&
                Number.isFinite(c.sentAt) &&
                c.sentAt > 0,
            )
            .slice(0, 100);
          try {
            localStorage.setItem(H, JSON.stringify({ owner: a, items: n }));
          } catch {}
        }
        (i?.open && (i.querySelector("[data-inbox-status]").textContent = ""),
          U());
      } catch {
        i?.open &&
          (i.querySelector("[data-inbox-status]").textContent = m(
            "Connect to the internet to update your notifications.",
          ));
      } finally {
        r = !1;
      }
    }
  }
  function re(s) {
    if (((v = s), !i?.isConnected)) {
      ((i = document.createElement("dialog")),
        (i.className = "notification-inbox"),
        i.setAttribute("aria-labelledby", "notificationInboxTitle"),
        (i.innerHTML =
          '<header><h2 id="notificationInboxTitle"></h2><button type="button" data-inbox-close></button></header><p role="status" data-inbox-status></p><div data-inbox-list></div><button type="button" data-inbox-settings></button>'),
        (i.querySelector("h2").textContent = m("Notifications")));
      let o = i.querySelector("[data-inbox-close]");
      ((o.textContent = "\xD7"),
        o.setAttribute("aria-label", m("Close notifications")),
        o.addEventListener("click", () => i.close()),
        i.addEventListener("click", (b) => {
          b.target === i && i.close();
        }),
        i.addEventListener("close", () => {
          v?.isConnected && v.focus();
        }));
      let c = i.querySelector("[data-inbox-settings]");
      ((c.textContent = m("Practice reminder settings")),
        c.addEventListener("click", () => {
          (i.close(), (location.hash = "#/settings"));
        }),
        document.body.appendChild(i));
    }
    (i.open || i.showModal(),
      (i.querySelector("[data-inbox-status]").textContent = m(
        "Loading notifications\u2026",
      )),
      S());
  }
  (document.addEventListener("click", (s) => {
    let o = s.target.closest?.(x);
    o && (s.preventDefault(), re(o));
  }),
    window.addEventListener("page:loaded", (s) => {
      s.detail?.routeName === "myprofile" ? S() : i?.open && i.close();
    }),
    document.addEventListener("visibilitychange", () => {
      document.visibilityState === "visible" &&
        document.querySelector(x) &&
        S();
    }),
    window.addEventListener("arclight:reminders-changed", () => {
      document.querySelector(x) && S();
    }),
    setInterval(() => {
      document.visibilityState === "visible" &&
        document.querySelector(x) &&
        S();
    }, 6e4));
}
var ie = "arclight:practice-reminders:v1",
  Y = {
    enabled: !1,
    reminderTime: "18:00",
    lastPracticedAt: 0,
    url: "/#/mylearning",
  },
  d,
  P,
  Z = !1,
  M = !1,
  _ = 0,
  g = 0,
  T = 0,
  N = 0,
  G = !1,
  Q = new WeakMap(),
  X = new WeakSet(),
  ee = Promise.resolve(),
  A = 0,
  h = (e) => q(e, e);
function ae() {
  return d?.reason === "disabled"
    ? "Practice reminders are turned off on the server."
    : d?.reason === "configuration_invalid"
      ? "The notification server configuration needs attention. Please contact support."
      : d?.reason === "storage_unavailable"
        ? "The notification server could not connect to its database. Please try again later."
        : "Practice reminders are not available yet. Please try again later.";
}
function l() {
  try {
    return { ...Y, ...JSON.parse(localStorage.getItem(ie) || "{}") };
  } catch {
    return { ...Y };
  }
}
function f(e) {
  let t = { ...l(), ...e };
  return (
    localStorage.setItem(ie, JSON.stringify(t)),
    window.dispatchEvent(new Event("arclight:reminders-changed")),
    t
  );
}
function J() {
  return (/iP(hone|ad|od)/.test(navigator.userAgent) ||
    (/Mac/.test(navigator.platform) && navigator.maxTouchPoints > 1)) &&
    !window.matchMedia?.("(display-mode: standalone)").matches &&
    !navigator.standalone
    ? "Add Arclight to your Home Screen and open it there to enable reminders."
    : !window.isSecureContext ||
        !("Notification" in window) ||
        !("PushManager" in window) ||
        !("serviceWorker" in navigator)
      ? "Practice reminders are not supported by this browser."
      : Notification.permission === "denied"
        ? "Notifications are blocked. Allow Arclight notifications in your browser or phone settings."
        : "";
}
async function W() {
  try {
    let e = await fetch("/api/reminders/config", {
      cache: "no-store",
      credentials: "same-origin",
    });
    d = e.ok ? await e.json() : { available: !1 };
  } catch {
    d = { available: !1 };
  }
  y();
}
function L(e, t, n, a) {
  let r = ee.then(async () => {
    let i = await fetch(`/api/reminders${t}`, {
      method: e,
      cache: "no-store",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${n.token}`,
      },
      body: a ? JSON.stringify(a) : void 0,
    });
    if (!i.ok)
      throw i.status === 403
        ? new Error(
            "Arclight rejected this app's request. Close and reopen the Home Screen app, then try again. Your internet connection is not the cause.",
          )
        : new Error(
            `Could not save reminders (HTTP ${i.status || "error"}). Please try again later.`,
          );
    return i.headers?.get("content-type")?.includes("application/json")
      ? i.json()
      : null;
  });
  return ((ee = r.catch(() => {})), r);
}
function se() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}
function B(e) {
  let t = e.replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(t + "=".repeat((4 - (t.length % 4)) % 4)), (n) =>
    n.charCodeAt(0),
  );
}
function te() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)), (e) =>
    e.toString(16).padStart(2, "0"),
  ).join("");
}
async function D() {
  if (((P ||= await navigator.serviceWorker.getRegistration("/")), !P?.active))
    throw new Error("Arclight is still setting up. Reload and try again.");
  return P;
}
async function I(e, t, { enabling: n = !1 } = {}) {
  let a = l();
  if (a.pendingDisable || (n ? !a.pendingEnable : !a.enabled))
    throw new Error("Practice reminders are off.");
  if (!t)
    throw new Error(
      "Enable practice reminders again to renew notifications on this device.",
    );
  return L("PUT", "/subscription", e, {
    ...(n ? { enableRequestId: e.enableRequestId } : {}),
    subscription: t.toJSON(),
    timezone: se(),
    reminderTime: e.reminderTime,
    lastPracticedAt: e.lastPracticedAt,
    url: e.url,
  });
}
async function K() {
  let e = J();
  if (e) throw new Error(e);
  if (!d?.available) throw new Error(ae());
  if (
    (await (Notification.permission === "granted"
      ? "granted"
      : Notification.requestPermission())) !== "granted"
  )
    throw new Error(
      "Reminders were not enabled. You can enable them later in Settings.",
    );
  p("Connecting this device to practice reminders\u2026");
  let n = f({
      token: l().token || te(),
      pendingDisable: !1,
      pendingEnable: !0,
      enableRequestId: (l().pendingEnable && l().enableRequestId) || te(),
    }),
    a = await D(),
    r = await a.pushManager.getSubscription(),
    i = r?.options?.applicationServerKey;
  if (i) {
    let u = new Uint8Array(i),
      w = B(d.publicKey);
    (u.length !== w.length || u.some((E, O) => E !== w[O])) &&
      (await r.unsubscribe(), (r = null));
  }
  let v = !r;
  try {
    r ||= await a.pushManager.subscribe({
      userVisibleOnly: !0,
      applicationServerKey: B(d.publicKey),
    });
    let u = await I(n, r, { enabling: !0 });
    if (
      (u?.enabled === !1 &&
        (await r.unsubscribe().catch(() => {}),
        (r = await a.pushManager.subscribe({
          userVisibleOnly: !0,
          applicationServerKey: B(d.publicKey),
        })),
        (u = await I(n, r, { enabling: !0 }))),
      u?.enabled === !1)
    )
      throw (
        await r.unsubscribe().catch(() => {}),
        (r = null),
        new Error(
          "This phone's push subscription has expired. Turn reminders on again to reconnect.",
        )
      );
    (f({
      enabled: !0,
      pendingDisable: !1,
      pendingEnable: !1,
      offered: !0,
      testDelivery: u?.delivery || "requested",
    }),
      document.getElementById("practiceReminderOffer")?.remove(),
      p(
        "Practice reminders are on. They pause after the one-month reminder until you practise again.",
      ));
  } catch (u) {
    throw (v && r && (await r.unsubscribe().catch(() => {})), u);
  }
}
async function ce() {
  let e = f({
    enabled: !1,
    pendingDisable: !0,
    pendingEnable: !1,
    offered: !0,
  });
  document.getElementById("practiceReminderOffer")?.remove();
  try {
    let n = await (
      await navigator.serviceWorker?.getRegistration("/")
    )?.pushManager.getSubscription();
    n && (await n.unsubscribe());
  } catch {}
  (e.token && (await L("DELETE", "/subscription", e)),
    f({ pendingDisable: !1 }),
    p("Practice reminders are off."));
}
async function k() {
  if (M || !navigator.onLine) return;
  let e = l();
  if (e.token) {
    M = !0;
    try {
      if (
        e.pendingDisable ||
        (e.enabled &&
          "Notification" in window &&
          Notification.permission === "denied")
      )
        (await L("DELETE", "/subscription", e),
          f({ enabled: !1, pendingDisable: !1 }));
      else if (e.enabled && d?.available) {
        let t = await (await D()).pushManager.getSubscription();
        t
          ? await I(e, t)
          : p(
              "Reconnect and enable reminders again to renew this device's subscription.",
            );
      } else
        !e.enabled &&
          d?.available &&
          "Notification" in window &&
          Notification.permission !== "denied" &&
          ((await L("GET", "/history", e))?.enabled &&
          (await (await D()).pushManager.getSubscription())
            ? f({ enabled: !0 })
            : Notification.permission === "granted" &&
              (e.pendingEnable || (!e.offered && !e.pendingDisable)) &&
              (await K()));
      _ = Date.now();
    } catch {
    } finally {
      ((M = !1), y());
    }
  }
}
function p(e) {
  let t = document.getElementById("practiceReminderStatus");
  t && (t.textContent = h(e));
}
function y() {
  let e = document.getElementById("settingsNotificationsToggle");
  if (!e) return;
  let t = l(),
    n =
      t.enabled &&
      "Notification" in window &&
      Notification.permission !== "denied";
  (e.classList.toggle("is-on", n), e.setAttribute("aria-pressed", String(!!n)));
  let a = document.getElementById("practiceReminderTime");
  (a && document.activeElement !== a && (a.value = t.reminderTime),
    p(
      t.pendingDisable
        ? "Reminders are off on this device. Reconnect to finish turning them off on the server."
        : J() ||
            (d?.available === !1
              ? ae()
              : n
                ? (t.testDelivery === "pending"
                    ? "Reminders are on. The test notification is queued; we will retry shortly. "
                    : t.testDelivery === "accepted"
                      ? "Reminders are on. A test notification was sent to this phone. "
                      : "") +
                  "Reminders after 1, 3, 7 and 30 days without practice, at your local time. Then they pause until you practise again."
                : "Choose gentle reminders after 1, 3, 7 and 30 days without practice."),
    ));
}
function pe() {
  let e = document.getElementById("settingsNotificationsToggle");
  !e ||
    e.dataset.remindersWired ||
    ((e.dataset.remindersWired = "1"),
    e.addEventListener("click", async () => {
      e.disabled = !0;
      try {
        (l().enabled ? await ce() : await K(), y());
      } catch (t) {
        (y(), p(t.message));
      } finally {
        e.disabled = !1;
      }
    }),
    document
      .getElementById("practiceReminderTime")
      ?.addEventListener("change", async (t) => {
        let n = t.target;
        if (!n.validity.valid || !n.value) return;
        let a = l();
        n.disabled = !0;
        try {
          let r = { ...a, reminderTime: n.value };
          (r.enabled &&
            (await I(r, await (await D()).pushManager.getSubscription())),
            f({ reminderTime: r.reminderTime }),
            p("Reminder time saved in your local timezone."));
        } catch (r) {
          ((n.value = a.reminderTime), p(r.message));
        } finally {
          n.disabled = !1;
        }
      }),
    y(),
    W());
}
function de() {
  let e = l();
  if (
    G ||
    e.offered ||
    e.enabled ||
    !d?.available ||
    J() ||
    document.getElementById("practiceReminderOffer")
  )
    return;
  G = !0;
  let t = document.createElement("aside");
  ((t.id = "practiceReminderOffer"),
    t.setAttribute("aria-labelledby", "practiceReminderOfferTitle"),
    (t.innerHTML =
      '<strong id="practiceReminderOfferTitle"></strong><p></p><div><button type="button" data-reminder-enable></button><button type="button" data-reminder-dismiss></button></div><p role="status" data-reminder-status></p>'),
    (t.querySelector("strong").textContent = h(
      "Would you like gentle practice reminders?",
    )),
    (t.querySelector("p").textContent = h(
      "A little encouragement after 1, 3, 7 and 30 days away. You can turn reminders off in Settings.",
    )));
  let n = t.querySelector("[data-reminder-enable]");
  ((n.textContent = h("Enable reminders")),
    n.addEventListener("click", async () => {
      n.disabled = !0;
      try {
        await K();
      } catch (r) {
        t.querySelector("[data-reminder-status]").textContent = h(r.message);
      } finally {
        n.disabled = !1;
      }
    }));
  let a = t.querySelector("[data-reminder-dismiss]");
  ((a.textContent = h("Maybe later")),
    a.addEventListener("click", () => {
      (f({ offered: !0 }), t.remove());
    }),
    document.body.appendChild(t));
}
function C() {
  let [e, t] = location.hash.slice(2).split("/");
  return ["videos", "eyes", "ears", "casestudy"].includes(e) && !t
    ? !1
    : /^#\/(videos|eyes|ears|casestudy|quizzes|behavioursquiz|fundalReflex|directOphthalmoscopy|binocularIndirect|visualAcuity|visualsystemeyesbrain|pupils|frontOfEye|atoms|eyeCare|makeEye|glaucomaHistoryCaseStudy|childhood|diabetic|glaucoma|medical|paediatric|pecWorkshop|primaryEarCareWorkshop)/i.test(
        location.hash,
      );
}
function ne(e) {
  if (e?.matches?.(".interactive-subapp-container iframe"))
    try {
      let t = e.contentDocument;
      if (!t || X.has(t)) return;
      X.add(t);
      for (let n of ["pointerdown", "keydown", "scroll", "change"])
        t.addEventListener(
          n,
          (a) => {
            !a.isTrusted ||
              !C() ||
              document.visibilityState !== "visible" ||
              !e.getClientRects().length ||
              ((g = Date.now()),
              n === "change" &&
                a.target.matches?.(
                  'input[type="radio"], input[type="checkbox"]',
                ) &&
                R());
          },
          { capture: !0, passive: !0 },
        );
    } catch {}
}
function R() {
  if (document.visibilityState !== "visible") return;
  let e = Date.now(),
    t = l();
  if (!(e - t.lastPracticedAt < 6e4)) {
    try {
      f({
        lastPracticedAt: e,
        url: /^#\/[a-zA-Z0-9_/-]+$/.test(location.hash)
          ? `/${location.hash}`
          : "/#/mylearning",
      });
    } catch {
      return;
    }
    (e - _ >= 6e4 && k(), de());
  }
}
function ge() {
  if (!Z) {
    ((Z = !0),
      V({ readState: l, request: L }),
      W().then(k),
      "serviceWorker" in navigator &&
        navigator.serviceWorker
          .getRegistration("/")
          .then((e) => {
            P = e;
          })
          .catch(() => {}),
      window.addEventListener("arclight:reminders-changed", y),
      window.addEventListener("page:loaded", () => {
        ((T = 0),
          (A = 0),
          (g = 0),
          document
            .querySelectorAll(".interactive-subapp-container iframe")
            .forEach(ne));
      }),
      document.addEventListener("load", (e) => ne(e.target), !0),
      window.addEventListener("hashchange", () => {
        ((T = 0), (A = 0), (g = 0));
      }));
    for (let e of ["pointerdown", "keydown", "scroll", "change"])
      document.addEventListener(
        e,
        (t) => {
          t.isTrusted &&
            C() &&
            document.visibilityState === "visible" &&
            ((g = Date.now()),
            e === "change" &&
              t.target.matches?.(
                'input[type="radio"], input[type="checkbox"]',
              ) &&
              t.target.closest(
                ".quiz-card, .quiz-container, .question-block, [data-quiz-page-id], .medical-test-quiz-mount",
              ) &&
              R());
        },
        { capture: !0, passive: !0 },
      );
    (document.addEventListener("arclight:lesson-progress-changed", (e) => {
      e.detail?.advanced && C() && Date.now() - g < 1e4 && R();
    }),
      document.addEventListener(
        "timeupdate",
        (e) => {
          let t = e.target;
          if (t.tagName !== "VIDEO") return;
          let n = Q.get(t);
          Q.set(t, t.currentTime);
          let a = t.currentTime - n;
          C() &&
            document.visibilityState === "visible" &&
            !t.paused &&
            a > 0 &&
            a < 2 &&
            ((A += a), A >= 30 && (R(), (A = 0)));
        },
        !0,
      ),
      (N = Date.now()),
      setInterval(() => {
        let e = Date.now(),
          t = Math.min(5, (e - N) / 1e3);
        ((N = e),
          C() &&
            document.visibilityState === "visible" &&
            e - g <= 65e3 &&
            ((T += t), T >= 60 && (R(), (T = 0))),
          l().enabled && e - _ > 5 * 6e4 && k());
      }, 5e3),
      window.addEventListener("online", () => {
        W().then(k);
      }),
      document.addEventListener("visibilitychange", () => {
        document.visibilityState === "visible"
          ? k()
          : ((g = 0), (N = Date.now()));
      }));
  }
}
export { pe as a, ge as b };
