var a = (window.__arclightConnectivity ||= {
    offline: navigator.onLine === !1,
    pending: null,
    checked: 0,
  }),
  h = () => navigator.onLine === !1 || a.offline,
  c = (n, e) =>
    window.I18N?.getLanguage?.() === "ko"
      ? e
      : window.I18N?.translateLiteral?.(n, n) || n;
async function w(n = !1) {
  return navigator.onLine === !1
    ? (l(!0), !1)
    : a.pending
      ? a.pending
      : !n && Date.now() - a.checked < 1e4
        ? !a.offline
        : ((a.pending = (async () => {
            let e = new AbortController(),
              t = setTimeout(() => e.abort(), 2e3);
            try {
              let i = await fetch("/healthz", {
                method: "HEAD",
                cache: "no-store",
                signal: e.signal,
              });
              l(!i.ok);
            } catch {
              l(!0);
            } finally {
              (clearTimeout(t), (a.checked = Date.now()), (a.pending = null));
            }
            return !a.offline;
          })()),
          a.pending);
}
function l(n) {
  let e = a.offline !== n;
  ((a.offline = n),
    e && window.dispatchEvent(new CustomEvent("arclight:connectivity")));
}
function p() {
  if (a.wired) return;
  a.wired = !0;
  let n = !1;
  function e() {
    if (!h()) {
      ((n = !1), document.getElementById("offlineAccessNotice")?.remove());
      return;
    }
    if (n || !document.body) return;
    n = !0;
    let i = document.activeElement,
      o = document.createElement("dialog");
    ((o.id = "offlineAccessNotice"),
      o.setAttribute("aria-labelledby", "offlineAccessTitle"),
      o.setAttribute("aria-describedby", "offlineAccessMessage"));
    let s = document.createElement("h2");
    ((s.id = "offlineAccessTitle"),
      (s.textContent = c(
        "You're offline",
        "\uC624\uD504\uB77C\uC778 \uC0C1\uD0DC\uC785\uB2C8\uB2E4",
      )));
    let d = document.createElement("p");
    ((d.id = "offlineAccessMessage"),
      (d.textContent = c(
        "Without an internet connection, only downloaded content and some app features are available. Connect to the internet to access other content or download it for offline use.",
        "\uC778\uD130\uB137 \uC5F0\uACB0\uC774 \uC5C6\uC73C\uBA74 \uB2E4\uC6B4\uB85C\uB4DC\uD55C \uCF58\uD150\uCE20\uC640 \uC77C\uBD80 \uC571 \uAE30\uB2A5\uB9CC \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. \uB2E4\uB978 \uCF58\uD150\uCE20\uB97C \uC774\uC6A9\uD558\uAC70\uB098 \uC624\uD504\uB77C\uC778\uC6A9\uC73C\uB85C \uB2E4\uC6B4\uB85C\uB4DC\uD558\uB824\uBA74 \uC778\uD130\uB137\uC5D0 \uC5F0\uACB0\uD574 \uC8FC\uC138\uC694.",
      )));
    let r = document.createElement("button");
    ((r.type = "button"),
      (r.textContent = c("Continue", "\uACC4\uC18D\uD558\uAE30")),
      r.addEventListener("click", () => {
        typeof o.close == "function" ? o.close() : o.remove();
      }),
      o.addEventListener("close", () => {
        (o.remove(), i?.isConnected && i.focus());
      }),
      o.append(s, d, r),
      document.body.append(o),
      window.I18N?.applyTranslations?.(o),
      typeof o.showModal == "function"
        ? o.showModal()
        : (o.setAttribute("open", ""), o.setAttribute("role", "dialog")));
  }
  let t = () => {
    (e(), w(!0).then(e));
  };
  (window.addEventListener("offline", () => {
    (l(!0), e());
  }),
    window.addEventListener("online", t),
    window.addEventListener("pageshow", t),
    window.addEventListener("arclight:connectivity", e),
    document.addEventListener("visibilitychange", () => {
      document.hidden || t();
    }),
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", t, { once: !0 })
      : t());
}
async function u(n) {
  if (!n || !("caches" in window)) return !1;
  try {
    let e = new URL(n, location.href);
    ((e.search = ""), (e.hash = ""));
    for (let t of await caches.keys()) {
      if (t !== "arclight-packs-v1" && !t.startsWith("arclight-static-"))
        continue;
      let i = await (await caches.open(t)).match(e.href);
      if (
        i?.status === 200 &&
        !/text\/html|application\/json/i.test(
          i.headers.get("Content-Type") || "",
        )
      )
        return !0;
    }
  } catch {}
  return !1;
}
async function m(n, e) {
  let t = n.querySelector(".tri-toggle");
  if (!t) return null;
  let i = n.querySelector(".video-offline-note");
  (i ||
    ((i = document.createElement("p")),
    (i.className = "video-offline-note"),
    i.setAttribute("role", "status")),
    (t.closest(".video-page-actions") || t).after(i));
  let s = h(),
    [d, r] = s ? await Promise.all([u(e.low), u(e.high)]) : [!0, !0];
  if (!n.isConnected) return null;
  for (let f of t.querySelectorAll("[data-mode]"))
    f.disabled =
      s && (f.dataset.mode === "online" || (f.dataset.mode === "high" && !r));
  return (
    (i.hidden = !s),
    (i.textContent = r
      ? c(
          "Offline \xB7 Downloaded videos only.",
          "\uC624\uD504\uB77C\uC778 \xB7 \uB2E4\uC6B4\uB85C\uB4DC\uD55C \uC601\uC0C1\uB9CC \uC7AC\uC0DD\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
        )
      : c(
          "Offline \xB7 High resolution needs a download or internet.",
          "\uC624\uD504\uB77C\uC778 \xB7 \uACE0\uD654\uC9C8\uC740 \uB2E4\uC6B4\uB85C\uB4DC \uB610\uB294 \uC778\uD130\uB137 \uC5F0\uACB0\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.",
        )),
    window.I18N?.applyTranslations?.(i),
    { offline: s, low: d, high: r }
  );
}
function g(n) {
  for (let e of n.querySelectorAll("video")) {
    if (e.dataset.offlineFeedback) continue;
    ((e.dataset.offlineFeedback = "1"),
      (e.playsInline = !0),
      (e.preload = "metadata"));
    let t = document.createElement("p");
    ((t.className = "video-load-status"),
      t.setAttribute("role", "status"),
      (t.hidden = !0),
      e.after(t));
    let i = () => {
      ((t.textContent = c(
        "Loading video\u2026",
        "\uC601\uC0C1\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4\u2026",
      )),
        (t.hidden = !1));
    };
    for (let o of ["loadstart", "waiting"]) e.addEventListener(o, i);
    for (let o of ["loadedmetadata", "canplay", "playing"])
      e.addEventListener(o, () => {
        t.hidden = !0;
      });
    e.addEventListener("error", () => {
      ((t.textContent = c(
        "Video unavailable. Connect to the internet and download this video for offline use.",
        "\uC601\uC0C1\uC744 \uC7AC\uC0DD\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC778\uD130\uB137\uC5D0 \uC5F0\uACB0\uD574 \uC774 \uC601\uC0C1\uC744 \uC624\uD504\uB77C\uC778\uC6A9\uC73C\uB85C \uB2E4\uC6B4\uB85C\uB4DC\uD574 \uC8FC\uC138\uC694.",
      )),
        (t.hidden = !1));
    });
  }
}
export { h as a, c as b, w as c, p as d, m as e, g as f };
