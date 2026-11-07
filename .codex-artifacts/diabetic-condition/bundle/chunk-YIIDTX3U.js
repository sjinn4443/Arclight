var g = "experimentalMiniAppNotice:ack",
  F = new Set(["videos", "glaucomaScrollImages"]),
  x = new Set([]),
  G = new Set([
    "fundalReflexSimulatorPage",
    "morphSimulatorPage",
    "traumaInteractivePage",
    "glaucomaACDInteractive",
    "amslerInteractivePage",
    "miresPage",
    "glaucomaSimulatorPage",
    "glaucoma3DInteractivePage",
    "fieldsInteractivePage",
    "refractInteractivePage",
    "sauronInteractivePage",
    "discsInteractivePage",
    "swollenDiscsInteractivePage",
    "glaucomaRAPDFullSwingInteractive",
    "squintPalsySimulatorPage",
    "cataractSimulatorPage",
  ]),
  U = new Set([...x, ...G]),
  y = "experimentalMiniAppNoticeOverlay",
  A = "data-experimental-miniapp-notice-open",
  m = "glaucomaRAPDFullSwingInteractive",
  E = "rapdOrientationNoticeOverlay",
  w = "data-rapd-mobile-layout",
  I = "data-rapd-orientation-notice-open",
  S = !1,
  p = null,
  n = null,
  l = null,
  u = null,
  r = null,
  s = null,
  v = !1,
  i = null;
function W(e) {
  return U.has(String(e || "").trim());
}
function z(e) {
  return x.has(String(e || "").trim());
}
function Y() {
  try {
    return sessionStorage.getItem(g) === "1";
  } catch {
    return !1;
  }
}
function L(e) {
  try {
    e ? sessionStorage.setItem(g, "1") : sessionStorage.removeItem(g);
  } catch {}
}
function V() {
  let e = String(window.I18N?.getLanguage?.() || "").trim();
  if (e) return e.toLowerCase();
  let t = String(localStorage.getItem("prefLang") || "").trim();
  return t
    ? t.toLowerCase()
    : String(document.documentElement.getAttribute("lang") || "")
        .trim()
        .toLowerCase() || "en";
}
function o(e, t) {
  return window.I18N?.t?.(`i18nExtra.${e}`, t) || t;
}
function X(e) {
  let t = V(),
    a = t === "ko" || t === "korean",
    c = z(e),
    d = !1;
  if (e === m)
    try {
      d = sessionStorage.getItem("rapdExperience:launchMode") === "test";
    } catch {
      d = !1;
    }
  return d
    ? {
        title: o("interactive_notice_rapd_title", "Pupil App Test"),
        body: o(
          "interactive_notice_rapd_body",
          `Perform the 'swinging light' test to look for an RAPD.

Choose No RAPD or the patient's Left/Right side, select the severity, then press Submit answer.`,
        ),
        button: o("interactive_notice_start_test", "Start test"),
        demo: !0,
      }
    : a
      ? c
        ? {
            title: "\uC778\uD130\uB799\uD2F0\uBE0C \uD559\uC2B5 \uC548\uB0B4",
            body: `\uC774 \uC778\uD130\uB799\uD2F0\uBE0C \uBBF8\uB2C8\uC571\uB4E4\uC740 \uC2E4\uD5D8\uC6A9\uC774\uBA70 \uD559\uC2B5 \uBAA9\uC801\uC73C\uB85C\uB9CC \uC0AC\uC6A9\uB41C\uB2E4\uB294 \uC810\uC744 \uC774\uD574\uD569\uB2C8\uB2E4.
\uC2E4\uC81C \uC9C4\uB2E8\uC774\uB098 \uC9C4\uB2E8 \uD655\uC778 \uBAA9\uC801\uC73C\uB85C \uC0AC\uC6A9\uD558\uBA74 \uC548 \uB429\uB2C8\uB2E4.`,
            button: "\uC774\uD574\uD588\uC2B5\uB2C8\uB2E4. \uACC4\uC18D",
          }
        : {
            title: "\uC778\uD130\uB799\uD2F0\uBE0C \uD559\uC2B5 \uC548\uB0B4",
            body: `\uC774 \uC778\uD130\uB799\uD2F0\uBE0C \uBBF8\uB2C8\uC571\uC740 \uC2E4\uD5D8\uC6A9\uC774\uBA70 \uD559\uC2B5 \uBAA9\uC801\uC73C\uB85C\uB9CC \uC0AC\uC6A9\uB41C\uB2E4\uB294 \uC810\uC744 \uC774\uD574\uD569\uB2C8\uB2E4.
\uC2E4\uC81C \uC9C4\uB2E8\uC774\uB098 \uC9C4\uB2E8 \uD655\uC778 \uBAA9\uC801\uC73C\uB85C \uC0AC\uC6A9\uD558\uBA74 \uC548 \uB429\uB2C8\uB2E4.`,
            button: "\uC774\uD574\uD588\uC2B5\uB2C8\uB2E4. \uACC4\uC18D",
          }
      : {
          title: o("interactive_notice_title", "Interactive learning notice"),
          body: c
            ? o(
                "interactive_notice_plural_body",
                `I understand these interactive mini apps are experimental and for learning only.

They must not be used to make or confirm a diagnosis.`,
              )
            : o(
                "interactive_notice_single_body",
                `I understand this interactive mini app is experimental and for learning only.

It must not be used to make or confirm a diagnosis.`,
              ),
          button: o("interactive_notice_understood", "Understood"),
        };
}
function R(e) {
  document.body &&
    (e
      ? document.body.setAttribute(A, "true")
      : document.body.removeAttribute(A));
}
function M(e) {
  try {
    return window.matchMedia?.(e)?.matches === !0;
  } catch {
    return !1;
  }
}
function K() {
  let e = Number(window.innerWidth) || 0,
    t = Number(window.screen?.width) || e,
    a = Number(window.screen?.height) || Number(window.innerHeight),
    c = Math.min(t, a);
  return e <= 600 || (M("(pointer: coarse)") && c <= 600);
}
function Q() {
  return M("(orientation: portrait)")
    ? !0
    : (Number(window.innerHeight) || 0) > (Number(window.innerWidth) || 0);
}
function _(e) {
  ((v = e),
    document.body &&
      (e
        ? document.body.setAttribute(w, "true")
        : document.body.removeAttribute(w)));
}
function $() {
  if (
    (i && document.body?.contains(i)) ||
    ((i = document.getElementById(E)), i || !document.body)
  )
    return i;
  ((i = document.createElement("div")),
    (i.id = E),
    (i.hidden = !0),
    i.setAttribute("role", "dialog"),
    i.setAttribute("aria-modal", "true"),
    i.setAttribute("aria-label", ""));
  let e = document.createElement("div");
  e.className = "rapd-orientation-notice";
  let t = document.createElement("div");
  ((t.className = "rapd-orientation-notice__animation"),
    t.setAttribute("aria-hidden", "true"));
  let a = document.createElement("span");
  a.className = "rapd-orientation-notice__phone";
  let c = document.createElement("span");
  c.className = "rapd-orientation-notice__arrow";
  let d = document.createElement("p");
  return (
    (d.className = "rapd-orientation-notice__text"),
    (d.textContent = ""),
    t.append(a, c),
    e.append(t, d),
    i.appendChild(e),
    document.body.appendChild(i),
    i
  );
}
function j() {
  let e = $();
  if (!e) return;
  let t = o(
    "interactive_notice_rotate_landscape",
    "Rotate your device to landscape",
  );
  e.setAttribute("aria-label", t);
  let a = e.querySelector(".rapd-orientation-notice__text");
  (a && (a.textContent = t),
    f(),
    (e.hidden = !1),
    document.body?.setAttribute(I, "true"));
}
function b() {
  (i && (i.hidden = !0), document.body?.removeAttribute(I));
}
function O() {
  if (n && document.body?.contains(n)) return n;
  if (((n = document.getElementById(y)), n))
    return (
      (l = n.querySelector("[data-experimental-miniapp-title]")),
      (u = n.querySelector("[data-experimental-miniapp-body]")),
      (r = n.querySelector("[data-rapd-test-notice-demo]")),
      (s = n.querySelector("[data-experimental-miniapp-ok]")),
      n
    );
  if (!document.body) return null;
  ((n = document.createElement("div")),
    (n.id = y),
    (n.hidden = !0),
    n.setAttribute("role", "dialog"),
    n.setAttribute("aria-modal", "true"),
    n.setAttribute("aria-labelledby", "experimentalMiniAppNoticeTitle"),
    n.setAttribute("aria-describedby", "experimentalMiniAppNoticeBody"));
  let e = document.createElement("div");
  return (
    (e.className = "guest-modal experimental-miniapp-modal"),
    (l = document.createElement("h2")),
    (l.id = "experimentalMiniAppNoticeTitle"),
    (l.className = "guest-modal__title experimental-miniapp-modal__title"),
    l.setAttribute("data-experimental-miniapp-title", ""),
    (u = document.createElement("p")),
    (u.id = "experimentalMiniAppNoticeBody"),
    (u.className = "guest-modal__text experimental-miniapp-modal__text"),
    u.setAttribute("data-experimental-miniapp-body", ""),
    (r = document.createElement("div")),
    (r.className = "rapd-test-notice-demo"),
    r.setAttribute("data-rapd-test-notice-demo", ""),
    r.setAttribute("aria-hidden", "true"),
    (r.innerHTML = `
    <div class="rapd-test-notice-demo__stage">
      <strong>Question 1 of 10</strong>
      <div class="rapd-test-notice-demo__side">
        <span data-rapd-demo="no-rapd">No RAPD</span><span data-rapd-demo="left">Left</span><span data-rapd-demo="right">Right</span>
      </div>
      <div class="rapd-test-notice-demo__severity">
        <small data-rapd-demo="mild">Mild</small><span>1</span><span>2</span><span>3</span><small data-rapd-demo="severe">Severe</small>
      </div>
      <div class="rapd-test-notice-demo__scene" aria-hidden="true">
        <img class="rapd-test-notice-demo__eyes" src="/images/learning/GlaucomaRAPD/eyes.webp" alt="" />
        <img class="rapd-test-notice-demo__torch" src="/images/learning/GlaucomaRAPD/arclight.webp" alt="" />
      </div>
      <button type="button" tabindex="-1" data-rapd-demo="submit">Submit answer</button>
      <i class="rapd-test-notice-demo__pointer"></i>
    </div>`),
    (s = document.createElement("button")),
    (s.type = "button"),
    (s.className =
      "guest-modal__cta btn-primary experimental-miniapp-modal__cta"),
    s.setAttribute("data-experimental-miniapp-ok", ""),
    s.addEventListener("click", () => {
      (L(!0), f());
    }),
    e.appendChild(l),
    e.appendChild(u),
    e.appendChild(r),
    e.appendChild(s),
    n.appendChild(e),
    document.body.appendChild(n),
    n
  );
}
function T(e) {
  if (!O() || !l || !u || !s) return;
  let a = X(e);
  if (
    ((l.textContent = a.title),
    (u.textContent = a.body),
    r && (r.hidden = a.demo !== !0),
    (s.textContent = a.button),
    r && a.demo === !0)
  ) {
    let c = {
      "no-rapd": o("interactive_notice_no_rapd", "No RAPD"),
      left: o("interactive_notice_left", "Left"),
      right: o("interactive_notice_right", "Right"),
      mild: o("interactive_notice_mild", "Mild"),
      severe: o("interactive_notice_severe", "Severe"),
      submit: o("interactive_notice_submit_answer", "Submit answer"),
    };
    Object.entries(c).forEach(([B, H]) => {
      let h = r.querySelector(`[data-rapd-demo="${B}"]`);
      h && (h.textContent = H);
    });
    let d = r.querySelector("strong");
    d &&
      (d.textContent = o(
        "interactive_notice_question_progress",
        "Question 1 of 10",
      ));
  }
}
function P(e) {
  let t = O();
  t && ((p = e), T(e), (t.hidden = !1), R(!0), s?.focus?.());
}
function f() {
  let e = n;
  e && ((e.hidden = !0), R(!1));
}
function C() {
  ((p = null), b(), _(!1), L(!1), f());
}
function D(e) {
  if (e === m)
    try {
      if (sessionStorage.getItem("rapdExperience:launchMode") === "test") {
        P(e);
        return;
      }
    } catch {}
  if (Y()) {
    f();
    return;
  }
  P(e);
}
function k() {
  if (!(p !== m || !v)) {
    if (Q()) {
      j();
      return;
    }
    (b(), D(m));
  }
}
function q(e) {
  if (e) {
    if (!W(e)) {
      C();
      return;
    }
    if ((e !== m ? (b(), _(!1)) : p !== m && _(K()), (p = e), e === m && v)) {
      k();
      return;
    }
    D(e);
  }
}
function J(e) {
  e && (F.has(e) || C());
}
function Z(e) {
  q(String(e?.detail?.id || "").trim());
}
function ee(e) {
  J(String(e?.detail?.routeName || "").trim());
}
function te() {
  !p || n?.hidden !== !1 || T(p);
}
function N() {
  k();
}
function ne() {
  S ||
    ((S = !0),
    document.addEventListener("page:shown", Z),
    window.addEventListener("page:loaded", ee),
    document.addEventListener("language:updated", te),
    window.addEventListener("resize", N, { passive: !0 }),
    window.addEventListener("orientationchange", N, { passive: !0 }));
}
function ie(e) {
  q(String(e || "").trim());
}
export { ne as a, ie as b };
