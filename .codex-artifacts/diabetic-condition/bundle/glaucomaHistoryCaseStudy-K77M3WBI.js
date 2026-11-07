import { c as U, f as he } from "./chunk-6B6F2TRH.js";
import "./chunk-VKQVMSQC.js";
import "./chunk-WOT6VMZA.js";
function Ne(t) {
  let r = [...t];
  for (let i = r.length - 1; i > 0; i--) {
    let m = Math.floor(Math.random() * (i + 1));
    [r[i], r[m]] = [r[m], r[i]];
  }
  return r;
}
var fe = [
    {
      id: "problem",
      label: "problem",
      ui: "What seems to be the main problem?",
    },
    { id: "when", label: "when", ui: "When did it start?" },
    { id: "how", label: "how", ui: "How did it start?" },
    {
      id: "eye",
      label: "one/both",
      ui: "Is it affecting one eye or both eyes?",
    },
    {
      id: "pain",
      label: "pain/itch",
      ui: "Do you have any pain or itchiness?",
    },
    {
      id: "redness",
      label: "redness/discharge",
      ui: "Have you noticed any redness or discharge?",
    },
    {
      id: "vision",
      label: "vision",
      ui: "Have you noticed any loss of vision?",
    },
    {
      id: "course",
      label: "worse/better",
      ui: "Is it getting worse or better?",
    },
    {
      id: "treatment",
      label: "treatment",
      ui: "Have you had any treatment so far?",
    },
    {
      id: "other",
      label: "anything else",
      ui: "Is there anything else you want to tell me?",
    },
    { id: "ethnicity", label: "ethnicity", ui: "What is your background?" },
  ],
  Fe = [{ key: "POAG" }, { key: "ACAG" }],
  Pe = ["POAG", "ACAG"];
function Oe(t) {
  return t === "POAG"
    ? "This patient is 52 years old"
    : t === "ACAG"
      ? "This patient is 68 years old"
      : "";
}
function me(t) {
  return t === "POAG"
    ? "Slow, painless vision loss over months to years with a white eye and higher risk with African background, family history, age over 40 and short sightedness fits POAG."
    : t === "ACAG"
      ? "Fast vision loss over hours to days with a painful red eye and halos around lights with higher risk with Asian background, older age and cataract fits ACAG."
      : "";
}
function Re(t) {
  return t === "POAG"
    ? {
        problem:
          "My vision is not as good as it used to be. It has been changing very gradually.",
        when: "It started a long time ago, maybe months to years.",
        how: "It came on slowly. There was no injury or sudden event.",
        eye: "It feels like both eyes are affected.",
        pain: "No, there is no pain or itchiness.",
        redness: "No redness and no discharge. The eye looks white.",
        vision: "Yes, the vision has been getting worse, but very slowly.",
        course: "It is gradually getting worse over time.",
        treatment: "No treatment so far.",
        other:
          "I am short sighted and I wear glasses for distance. My father had glaucoma. I am over 40.",
        ethnicity: "I have an African background.",
      }
    : t === "ACAG"
      ? {
          problem:
            "My vision suddenly became blurry and my eye is very painful.",
          when: "It started suddenly, within the last few hours.",
          how: "It came on quickly without any injury.",
          eye: "It is affecting one eye.",
          pain: "Yes, it is very painful.",
          redness: "Yes, the eye is red. There is no discharge.",
          vision: "Yes, the vision got worse quickly over hours.",
          course: "It is getting worse.",
          treatment: "No treatment so far.",
          other:
            "I see halos around lights. I have had a similar attack before that went away. I am long sighted and I need glasses for near vision. I have been told I have cataracts.",
          ethnicity: "I have an Asian background.",
        }
      : null;
}
function _e() {
  let t = document.getElementById("glaucomaHistoryCaseStudy");
  if (!t) return;
  he();
  let r = t.querySelector("#caseChatLog"),
    i = t.querySelector("#caseChatChoices"),
    m = t.querySelector("#caseChatSubmitBtn"),
    y = t.querySelector("#caseChatDraft"),
    L = t.querySelector("#caseChatSendBtn"),
    l = t.querySelector("#caseChatToggleBtn"),
    p = t.querySelector(".casechat-footer, .caseChatFooter"),
    b = t.querySelector("#caseDxModal"),
    u = t.querySelector("#caseDxCard"),
    x = t.querySelector("#caseDxList"),
    ye = t.querySelector("#caseDxCloseBtn"),
    V = t.querySelector("#caseDxTimerText"),
    M = t.querySelector("#caseDxTimerFg"),
    I = t.querySelector("#caseTimerBtn"),
    J = t.querySelector("#caseTimerText"),
    R = t.querySelector(".caseTimer__fg"),
    g = t.querySelector("#caseFinalModal"),
    $ = t.querySelector("#caseFinalBody"),
    pe = t.querySelector("#caseFinalCloseBtn"),
    ge = t.querySelector("#caseFinalOkBtn"),
    v = t.querySelector("#caseResultModal"),
    Z = t.querySelector("#caseResultBody"),
    ve = t.querySelector("#caseResultCloseBtn"),
    be = t.querySelector("#caseNextBtn"),
    ee = t.querySelector("#caseResultTitle");
  if (!r || !i) {
    console.warn(
      "[glaucomaHistoryCaseStudy] missing #caseChatLog or #caseChatChoices",
    );
    return;
  }
  ((i.hidden = !0),
    t.style.setProperty("--casechat-log-pad", "140px"),
    p?.classList.add("is-collapsed"));
  let xe = "Click here to select a question",
    Ce = "Click here to select a question";
  function S() {
    y &&
      (y.classList.add("is-placeholder"),
      (y.textContent = i?.hidden ? Ce : xe),
      h(y));
  }
  (l && (l.textContent = "^"), S());
  function h(e) {
    try {
      window.I18N?.applyTranslations?.(e);
    } catch {}
  }
  function G() {
    (b && (b.hidden = !0),
      v && (v.hidden = !0),
      Z && (Z.innerHTML = ""),
      ee && (ee.textContent = "Result"),
      g && (g.hidden = !0));
  }
  let o = { currentKey: null, asked: new Set() },
    w = 0,
    te = 0,
    _ = 0,
    se = Ne(Fe.map((e) => e.key)),
    ae = 2,
    W = fe.length;
  function ne() {
    let e = Math.max(0, w - 1),
      s = Math.min(W, o?.asked?.size || 0),
      n = ae * W,
      a = (Math.min(n, e * W + s) / n) * 95;
    U("glaucomaHistoryCaseStudy", a);
  }
  let T = null,
    ie = !1;
  function ke() {
    if (T) return T;
    let e = document.createElement("div");
    return (
      (e.className = "casechat-modal"),
      (e.hidden = !0),
      (e.innerHTML = `
      <div class="casechat-modalCard">
        <div class="casechat-modalTop">
          <div class="casechat-modalTitle">Case study</div>
        </div>

        <div class="casechat-resultWhy">
          Ask questions to patient <br />and work out the diagnosis.<br /><br />
          <span style="font-weight: 700; color: #e41e26">You only get 60 seconds.</span>
        </div>

        <div class="casechat-confirm__actions">
          <button type="button" class="casechat-confirm__btn is-ok" data-action="ok">OK</button>
        </div>
      </div>
    `),
      e.addEventListener("click", (s) => {
        s.target.closest('[data-action="ok"]') && ((ie = !0), Le(), O());
      }),
      t.appendChild(e),
      h(e),
      (T = e),
      T
    );
  }
  function Te() {
    let e = ke();
    e.hidden = !1;
  }
  function Le() {
    T && (T.hidden = !0);
  }
  let D = 60,
    C = D,
    q = null,
    K = 10,
    k = K,
    B = null,
    H = !1,
    A = !1;
  function Q() {
    q && (clearInterval(q), (q = null));
  }
  function oe() {
    J && (J.textContent = String(C));
    let e = Math.max(0, Math.min(1, C / D));
    (R &&
      ((R.style.strokeDasharray = "100 100"),
      (R.style.strokeDashoffset = String(100 * (1 - e)))),
      I && I.classList.toggle("is-danger", C <= 5));
  }
  function Me(e) {
    ((C = Math.max(0, Math.min(D, e))), oe(), C === 0 && (Q(), le(!0)));
  }
  function Se() {
    (Q(),
      (C = D),
      I && I.classList.remove("is-danger"),
      oe(),
      (q = setInterval(() => {
        Me(C - 1);
      }, 1e3)));
  }
  function N() {
    B && (clearInterval(B), (B = null));
  }
  function z() {
    V && (V.textContent = String(k));
    let e = Math.max(0, Math.min(1, k / K));
    (M &&
      ((M.style.strokeDasharray = "100 100"),
      (M.style.strokeDashoffset = String(100 * (1 - e)))),
      M?.closest(".caseTimer")?.classList.toggle("is-danger", k <= 5));
  }
  function re(e, s = {}) {
    if (
      ((H = !0),
      N(),
      (x?.querySelectorAll(".casechat-dxitem") || []).forEach((c) => {
        ((c.disabled = !0), c.classList.add("is-disabled"));
      }),
      A || ((_ += 1), (A = !0)),
      u)
    ) {
      u.innerHTML = "";
      let c = document.createElement("div");
      ((c.className =
        s.variant === "rich" ? "casechat-correctmsg" : "casechat-tryagain"),
        (c.innerHTML = e),
        u.appendChild(c));
      let a = document.createElement("button");
      ((a.type = "button"),
        (a.className = "casechat-nextcase"),
        (a.textContent = "Next case"),
        a.addEventListener("click", () => {
          (P(), O());
        }),
        u.appendChild(a),
        h(u));
    }
  }
  function we() {
    (N(),
      (k = K),
      M?.closest(".caseTimer")?.classList.remove("is-danger"),
      z(),
      (B = setInterval(() => {
        ((k -= 1),
          z(),
          k <= 0 &&
            ((k = 0), z(), re("Time is up<br />Move on to the next case")));
      }, 1e3)));
  }
  function E() {
    let e = r.lastElementChild;
    if (!e) return;
    let s = r.getBoundingClientRect(),
      n = p?.getBoundingClientRect(),
      a = (n ? Math.min(s.bottom, n.top) : s.bottom) - 16,
      d = e.getBoundingClientRect();
    if (d.bottom > a) {
      let f = d.bottom - a;
      r.scrollTo({ top: r.scrollTop + f, behavior: "smooth" });
    }
  }
  function Y(e, s) {
    let n = document.createElement("div");
    ((n.className = `casechat-bubble casechat-bubble--${e}`),
      (n.innerHTML = s),
      r.appendChild(n),
      h(n),
      requestAnimationFrame(E));
  }
  function X(e) {
    Y("system", `<div class="casechat-system">${e}</div>`);
  }
  function Ae(e) {
    Y("user", `<div class="casechat-text">${e}</div>`);
  }
  function $e(e) {
    Y("bot", `<div class="casechat-text">${e}</div>`);
  }
  function Ee(e = "...") {
    let s = document.createElement("div");
    return (
      (s.className =
        "casechat-bubble casechat-bubble--bot casechat-bubble--typing is-typing"),
      (s.innerHTML = `<div class="casechat-text">${e}</div>`),
      r.appendChild(s),
      h(s),
      requestAnimationFrame(E),
      s
    );
  }
  function Ie(e) {
    let s = (e || "").trim().length,
      n = 350,
      c = 1800,
      a = n + Math.min(1450, Math.floor(s * 18));
    return Math.max(n, Math.min(c, a));
  }
  let F = null;
  function ce() {
    ((i.innerHTML = ""),
      fe.forEach((e) => {
        let s = document.createElement("button");
        ((s.type = "button"),
          (s.className = "casechat-chip"),
          (s.textContent = e.label),
          (s.disabled = o.asked.has(e.id)),
          F?.id === e.id && s.classList.add("is-selected"),
          s.addEventListener("click", () => {
            o.asked.has(e.id) || de(e);
          }),
          i.appendChild(s));
      }),
      h(i));
  }
  function De(e) {
    if (o.asked.has(e.id)) return;
    (o.asked.add(e.id), ne(), ce(), m && (m.disabled = !1), Ae(e.ui));
    let n = Re(o.currentKey)?.[e.id] || "No.",
      c = (n || "").trim().length,
      a = Math.max(3, Math.min(7, 3 + Math.floor(c / 40))),
      d = ".".repeat(a),
      f = Ee(d),
      He = Ie(n);
    setTimeout(() => {
      let ue = f?.querySelector(".casechat-text");
      (ue && (ue.textContent = n),
        f?.classList.remove("casechat-bubble--typing", "is-typing"),
        h(f),
        requestAnimationFrame(E));
    }, He);
  }
  function P() {
    (N(), b && (b.hidden = !0));
  }
  function le(e = !1) {
    if (!e && (!o?.asked || o.asked.size === 0)) {
      X("Please ask at least one question before submitting.");
      return;
    }
    if (o.currentKey) {
      if ((u && (u.innerHTML = ""), (H = !1), we(), x)) {
        x.innerHTML = "";
        let s = o.currentKey;
        (Pe.forEach((c) => {
          let a = document.createElement("button");
          ((a.type = "button"),
            (a.className = "casechat-dxitem"),
            a.setAttribute("role", "radio"),
            a.setAttribute("aria-checked", "false"),
            (a.innerHTML = `
          <span class="casechat-radio"></span>
          <span class="casechat-dxlabel">${c}</span>
        `),
            a.addEventListener("click", () => {
              H ||
                (x.querySelectorAll(".casechat-dxitem").forEach((d) => {
                  (d.classList.remove("is-selected", "is-wrong", "is-correct"),
                    d.setAttribute("aria-checked", "false"));
                }),
                a.classList.add("is-selected"),
                a.setAttribute("aria-checked", "true"),
                qe(c, a, s));
            }),
            x.appendChild(a));
        }),
          h(x));
      }
      (b && (b.hidden = !1), Q());
    }
  }
  function qe(e, s, n) {
    if ((u && (u.innerHTML = ""), e !== n)) {
      (s.classList.add("is-selected", "is-wrong"),
        s.setAttribute("aria-checked", "true"));
      let f =
        w === 1
          ? '<div class="casechat-resultBad" style="margin-top:8px">Move onto the next case.</div>'
          : "";
      re(
        `
        <div class="casechat-resultBad">Incorrect.</div>
        <div class="casechat-resultWhy">In this case, the diagnosis is <span class="casechat-resultBadDx">${n}</span>.</div>
        <div class="casechat-resultWhy" style="margin-top:8px">${me(o.currentKey)}</div>
        ${f}
      `,
        { variant: "rich" },
      );
      return;
    }
    ((H = !0),
      N(),
      A || ((te += 1), (_ += 1), (A = !0)),
      s.classList.add("is-selected", "is-correct"),
      s.setAttribute("aria-checked", "true"),
      (x?.querySelectorAll(".casechat-dxitem") || []).forEach((f) => {
        f !== s && ((f.disabled = !0), f.classList.add("is-disabled"));
      }));
    let a = document.createElement("div");
    ((a.className = "casechat-correctmsg"),
      (a.innerHTML = `
      <div class="casechat-resultOk">Correct.</div>
      <div class="casechat-resultWhy">In this case, the diagnosis is <b>${n}</b>.</div>
      <div class="casechat-resultWhy" style="margin-top:8px">${me(o.currentKey)}</div>
    `),
      u.appendChild(a));
    let d = document.createElement("button");
    ((d.type = "button"),
      (d.className = "casechat-nextcase"),
      (d.textContent = "Next case"),
      d.addEventListener("click", () => {
        (P(), O());
      }),
      u.appendChild(d),
      h(u));
  }
  function Be() {
    ($ &&
      ($.innerHTML = `
        <div class="casechat-resultWhy">Final score: <b>${te}/${_}</b></div>
      `),
      g && (g.hidden = !1),
      h(g || $));
  }
  function j() {
    g && (g.hidden = !0);
  }
  (pe?.addEventListener("click", j), ge?.addEventListener("click", j));
  function O() {
    if ((G(), se.length === 0)) {
      ((r.innerHTML = ""),
        m && (m.disabled = !0),
        i && ((i.hidden = !0), (i.innerHTML = "")),
        S(),
        L && (L.disabled = !0),
        l && (l.textContent = "^"),
        p?.classList.add("is-collapsed"),
        U("glaucomaHistoryCaseStudy", 100),
        Be());
      return;
    }
    ((o.currentKey = se.shift()),
      (o.asked = new Set()),
      (A = !1),
      (r.innerHTML = ""),
      (w += 1),
      ne());
    let e = Oe(o.currentKey);
    (X(`
      <div class="casechat-caseblock">
        <div class="casechat-caseindex">
          Case ${w}
          <span class="casechat-casecount">(${w}/${ae})</span>
        </div>
        ${e ? `<div class="casechat-caseindex">${e}</div>` : ""}
      </div>
      <span class="casechat-firstprompt">Take a history to work out what is wrong</span>
    `),
      ce(),
      (i.hidden = !1),
      p?.classList.remove("is-collapsed"),
      p?.classList.add("is-expanded"),
      t.style.setProperty("--casechat-log-pad", "280px"),
      S(),
      l && (l.textContent = "-"),
      m && (m.disabled = !0),
      Se());
  }
  function de(e) {
    e &&
      (De(e),
      (F = null),
      L && (L.disabled = !0),
      i && (i.hidden = !0),
      S(),
      p?.classList.add("is-collapsed"),
      p?.classList.remove("is-expanded"),
      t.style.setProperty("--casechat-log-pad", "140px"),
      l && (l.textContent = "^"),
      requestAnimationFrame(E));
  }
  (m?.addEventListener("click", () => {
    if (!o?.asked || o.asked.size === 0) {
      X("Please ask at least one question before submitting.");
      return;
    }
    le(!1);
  }),
    ye?.addEventListener("click", (e) => {
      (e.preventDefault(), P());
    }),
    ve?.addEventListener("click", () => {
      v && (v.hidden = !0);
    }),
    be?.addEventListener("click", () => {
      v && (v.hidden = !0);
    }),
    L?.addEventListener("click", () => {
      F && de(F);
    }),
    l?.addEventListener("click", () => {
      let e = !!i?.hidden;
      (i && (i.hidden = !e),
        p?.classList.toggle("is-collapsed", !e),
        p?.classList.toggle("is-expanded", e),
        t.style.setProperty("--casechat-log-pad", e ? "280px" : "140px"),
        S(),
        l && (l.textContent = e ? "-" : "^"),
        requestAnimationFrame(E));
    }),
    y?.addEventListener("click", (e) => {
      (e.preventDefault(), l?.click());
    }),
    y?.addEventListener("keydown", (e) => {
      (e.key !== "Enter" && e.key !== " ") || (e.preventDefault(), l?.click());
    }),
    y && (y.setAttribute("role", "button"), y.setAttribute("tabindex", "0")),
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (b && b.hidden === !1) {
          (e.preventDefault(), P());
          return;
        }
        if (v && v.hidden === !1) {
          (e.preventDefault(), (v.hidden = !0));
          return;
        }
        if (g && g.hidden === !1) {
          (e.preventDefault(), j());
          return;
        }
      }
    }),
    G(),
    ie ? O() : Te(),
    window.addEventListener("i18n:languageChanged", () => {
      h(t);
    }),
    requestAnimationFrame(() => {
      G();
    }));
}
export { _e as initializeGlaucomaHistoryCaseStudy };
