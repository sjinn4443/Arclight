import { b as l, d as D } from "./chunk-W6GCFL5V.js";
var E = !1;
function C() {
  E ||
    ((E = !0),
    document.addEventListener("click", (e) => {
      let o = e.target.closest?.("a[download][href]");
      if (!o || e.defaultPrevented) return;
      let t = new URL(o.href, location.href);
      t.origin !== location.origin ||
        !/\.pdf$/i.test(t.pathname) ||
        (e.preventDefault(), L(o, t));
    }));
}
async function L(e, o) {
  if (document.getElementById("pdfDownloadDialog")) return;
  let t = document.createElement("dialog");
  ((t.id = "pdfDownloadDialog"),
    t.setAttribute("aria-labelledby", "pdfDownloadTitle"),
    t.setAttribute("aria-describedby", "pdfDownloadStatus"));
  let n = document.createElement("h2");
  ((n.id = "pdfDownloadTitle"),
    (n.textContent = l("Save PDF", "PDF \uC800\uC7A5")));
  let a = document.createElement("p");
  ((a.id = "pdfDownloadStatus"),
    a.setAttribute("role", "status"),
    (a.textContent = l(
      "Preparing PDF\u2026",
      "PDF\uB97C \uC900\uBE44\uD558\uB294 \uC911\uC785\uB2C8\uB2E4\u2026",
    )));
  let p = document.createElement("div");
  p.className = "pdf-download-actions";
  let s = document.createElement("button");
  ((s.type = "button"),
    (s.className = "pdf-download-close"),
    (s.textContent = l("Close", "\uB2EB\uAE30")));
  let r = document.createElement("button");
  ((r.type = "button"), (r.textContent = n.textContent), (r.disabled = !0));
  let u = new AbortController(),
    b = setTimeout(() => u.abort(), 15e3),
    d,
    v = () => {
      (u.abort(),
        clearTimeout(b),
        t.remove(),
        d && URL.revokeObjectURL(d),
        e.isConnected && e.focus());
    };
  (s.addEventListener("click", v),
    t.addEventListener("cancel", (f) => {
      (f.preventDefault(), v());
    }),
    p.append(s, r),
    t.append(n, a, p),
    document.body.append(t),
    window.I18N?.applyTranslations?.(t),
    typeof t.showModal == "function"
      ? t.showModal()
      : t.setAttribute("open", ""),
    s.focus());
  try {
    let f = await fetch(o.href, { signal: u.signal });
    if (!f.ok) throw new Error("PDF unavailable");
    let w = await f.blob();
    if (!w.size || (await w.slice(0, 5).text()) !== "%PDF-")
      throw new Error("Invalid PDF response");
    if (!t.isConnected) return;
    let g = e.download || decodeURIComponent(o.pathname.split("/").pop()),
      m = new File([w], g, { type: "application/pdf" }),
      h = !1;
    try {
      h = !!(navigator.share && navigator.canShare?.({ files: [m] }));
    } catch {}
    h || (d = URL.createObjectURL(m));
    let y = l(
      "Save a copy, then close this window to return to the lesson.",
      "\uC0AC\uBCF8\uC744 \uC800\uC7A5\uD55C \uB4A4 \uC774 \uCC3D\uC744 \uB2EB\uC73C\uBA74 \uD559\uC2B5\uC73C\uB85C \uB3CC\uC544\uAC11\uB2C8\uB2E4.",
    );
    ((a.textContent = y),
      (r.disabled = !1),
      r.addEventListener("click", async () => {
        r.disabled = !0;
        try {
          if (h) await navigator.share({ files: [m] });
          else {
            let i = document.createElement("a");
            ((i.href = d),
              (i.download = g),
              (i.target = "_blank"),
              (i.rel = "noopener"),
              document.body.append(i),
              i.click(),
              i.remove());
          }
          a.textContent = y;
        } catch (i) {
          i.name !== "AbortError" &&
            (a.textContent = l(
              "Could not save PDF. Try again or close to return to the lesson.",
              "PDF\uB97C \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uAC70\uB098 \uB2EB\uAE30\uB97C \uB20C\uB7EC \uD559\uC2B5\uC73C\uB85C \uB3CC\uC544\uAC00\uC138\uC694.",
            ));
        } finally {
          r.disabled = !1;
        }
      }));
  } catch {
    t.isConnected &&
      (a.textContent = l(
        "PDF unavailable. Connect to the internet and download this content first.",
        "PDF\uB97C \uC0AC\uC6A9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC778\uD130\uB137\uC5D0 \uC5F0\uACB0\uD574 \uBA3C\uC800 \uCF58\uD150\uCE20\uB97C \uB2E4\uC6B4\uB85C\uB4DC\uD574 \uC8FC\uC138\uC694.",
      ));
  } finally {
    clearTimeout(b);
  }
}
var c = null,
  P = !1;
function x() {
  let e = document.getElementById("pwa-install-error");
  e ||
    ((e = document.createElement("p")),
    (e.id = "pwa-install-error"),
    e.setAttribute("role", "alert"),
    document.body.prepend(e));
  let o = "Offline setup failed. Reconnect and reload to try again.";
  e.textContent = window.I18N?.translateLiteral?.(o, o) || o;
}
function T() {
  P ||
    ((P = !0),
    D(),
    C(),
    window.addEventListener("beforeinstallprompt", (e) => {
      (e.preventDefault(),
        (c = e),
        console.warn("[pwa] beforeinstallprompt captured"));
    }),
    "serviceWorker" in navigator &&
      (location.protocol === "https:" ||
        location.hostname === "localhost" ||
        location.hostname === "127.0.0.1") &&
      navigator.serviceWorker
        .register("sw.js")
        .then(async (e) => {
          console.warn("[pwa] SW registered", e.scope);
          let o = (n) => {
            if (!n) return;
            let a = n.state === "activated";
            n.addEventListener("statechange", () => {
              (n.state === "activated" && (a = !0),
                n.state === "redundant" && !a && x());
            });
          };
          (o(e.installing),
            e.addEventListener("updatefound", () => o(e.installing)));
          try {
            await e.update();
          } catch (n) {
            console.warn("[pwa] SW update() failed", n);
          }
          if (e.waiting) {
            let n = new MessageChannel();
            e.waiting.postMessage({ type: "SKIP_WAITING" }, [n.port2]);
          }
          let t = !1;
          (navigator.serviceWorker.addEventListener("controllerchange", () => {
            t || ((t = !0), window.location.reload());
          }),
            e.addEventListener("updatefound", () => {
              let n = e.installing;
              n &&
                n.addEventListener("statechange", () => {
                  if (n.state === "installed" && e.waiting) {
                    let a = new MessageChannel();
                    e.waiting.postMessage({ type: "SKIP_WAITING" }, [a.port2]);
                  }
                });
            }));
        })
        .catch((e) => {
          (console.warn("[pwa] SW register failed", e), x());
        }));
}
function W() {
  return !!c;
}
async function z() {
  if (!c) throw new Error("Install prompt not available");
  c.prompt();
  try {
    let { outcome: e } = await c.userChoice;
    return (console.warn("[pwa] userChoice:", e), e);
  } finally {
    c = null;
  }
}
export { T as a, W as b, z as c };
