import { a as He, h as Fe } from "./chunk-5FZC2BK5.js";
import { c as Ne, d as Ge } from "./chunk-KIQ7J7XB.js";
import "./chunk-VKQVMSQC.js";
import "./chunk-WOT6VMZA.js";
var dt = "caseStudyChatPage";
function We() {
  let n = document.getElementById("casestudyPage");
  n && Ge(n);
}
function he(n) {
  (Ne(dt, n), We());
}
function fe(n) {
  let i = [...n];
  for (let c = i.length - 1; c > 0; c--) {
    let u = Math.floor(Math.random() * (c + 1));
    [i[c], i[u]] = [i[u], i[c]];
  }
  return i;
}
function ut(n = !1) {
  let i = [
      { caseNum: 1, variant: "elderly" },
      { caseNum: 2, variant: "progressive" },
      { caseNum: 2, variant: "congenital" },
      { caseNum: 3, variant: "adult" },
      { caseNum: 3, variant: "neonate" },
      { caseNum: 4, variant: null },
      { caseNum: 5, variant: null },
      { caseNum: 6, variant: null },
      { caseNum: 7, variant: null },
      { caseNum: 8, variant: null },
      { caseNum: 9, variant: null },
      { caseNum: 10, variant: null },
      { caseNum: 11, variant: null },
      { caseNum: 12, variant: null },
    ],
    c = {};
  i.forEach((s) => {
    (c[s.caseNum] || (c[s.caseNum] = []), c[s.caseNum].push(s));
  });
  let u = Object.values(c).map((s) => s[Math.floor(Math.random() * s.length)]);
  return n ? u : fe(u);
}
function ht({ caseNum: n, variant: i }) {
  return n === 1
    ? "This patient is 78 years old"
    : (n === 2 && i === "progressive") || (n === 2 && i === "congenital")
      ? "This patient is 12 months old"
      : n === 3 && i === "adult"
        ? "This patient is 18 years old"
        : n === 3 && i === "neonate"
          ? "This patient is 2 weeks old"
          : n === 4
            ? "This patient is 38 years old"
            : n === 5
              ? "This patient is 29 years old"
              : n === 6 || n === 7
                ? "This patient is 21 years old"
                : n === 8
                  ? "This patient is 69 years old"
                  : n === 9
                    ? "This patient is 21 years old"
                    : n === 10
                      ? "This patient is 32 years old"
                      : n === 11 || n === 12
                        ? "This patient is 8 years old"
                        : "";
}
function $e(n) {
  return `/images/casestudy/case${n}_eyes.webp`;
}
var ft = [
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
  ],
  yt = [
    "Congenital cataract",
    "Cataract",
    "Retinoblastoma",
    "Gonococcal/Chlamydial conjunctivitis",
    "Trachomatous trichiasis with corneal scarring",
    "Bacterial / fungal corneal ulcer",
    "Herpes simplex keratitis",
    "Anterior Uveitis",
    "Pterygium",
    "Corneal foreign body with early infection",
    "Traumatic hyphaema",
    "Penetrating corneal laceration with iris prolapse",
    "Penetrating injury causing traumatic cataract",
  ];
function mt({ caseNum: n, variant: i }) {
  return n === 1
    ? {
        problem: "Cannot see anything",
        when: "Started over a year ago",
        how: "No trauma, started slowly",
        eye: "At first one eye, then both eyes",
        pain: "No pain or itch",
        redness: "White eye with no discharge",
        vision: "Only sees shadows",
        course: "Gradually getting worse",
        treatment: "No treatment yet",
        other: "No",
      }
    : n === 2 && i === "progressive"
      ? {
          problem: "Mum noticed pupil looked white",
          when: "Started around 6 months of age",
          how: "No trauma, started slowly",
          eye: "One eye first, then both eyes",
          pain: "No pain or itch",
          redness: "White eye with no discharge",
          vision: "Child has lost interest in looking around",
          course: "Getting worse",
          treatment: "No treatment yet",
          other: "Older sibling had similar condition and is now deceased",
        }
      : n === 2 && i === "congenital"
        ? {
            problem: "Mum noticed pupil looked white",
            when: "Present from birth",
            how: "Present from birth",
            eye: "Both eyes",
            pain: "No pain or itch",
            redness: "White eye with no discharge",
            vision: "Child has never shown visual interest",
            course: "Staying the same",
            treatment: "No treatment yet",
            other: "Eyes shimmer and wobble",
          }
        : n === 3 && i === "adult"
          ? {
              problem: "Sticky eye",
              when: "Started 1 week ago",
              how: "Gradual over 1 to 2 days",
              eye: "At first one eye, then both eyes",
              pain: "Itchy and gritty at times",
              redness: "Pink eye with yellow discharge",
              vision: "Blurry vision",
              course: "Getting worse",
              treatment: "No treatment yet",
              other: "No",
            }
          : n === 3 && i === "neonate"
            ? {
                problem: "Sticky eye",
                when: "Started 1 week ago",
                how: "Gradual over 1 to 2 days",
                eye: "At first one eye, then both eyes",
                pain: "Hard to assess",
                redness: "Pink eye with thick yellow discharge",
                vision: "Keeping eyes shut",
                course: "Getting worse",
                treatment: "No treatment yet",
                other: "Mother has been treated for STDs in the past",
              }
            : n === 4
              ? {
                  problem: "Painful and gritty eyes",
                  when: "Started many months ago",
                  how: "Gradual onset",
                  eye: "Both eyes affected",
                  pain: "Sometimes itchy",
                  redness: "Red eye with watery discharge",
                  vision: "Blurry vision",
                  course: "Getting worse",
                  treatment: "No treatment yet",
                  other: "No",
                }
              : n === 5
                ? {
                    problem: "Painful eye",
                    when: "Started 2 weeks ago",
                    how: "After scratch from bush",
                    eye: "One eye",
                    pain: "Gritty then very painful",
                    redness: "Red eye with sticky yellow discharge",
                    vision: "Only sees shadows",
                    course: "Getting worse",
                    treatment: "No treatment yet",
                    other: "No",
                  }
                : n === 6
                  ? {
                      problem: "Gritty eye",
                      when: "Started 1 week ago",
                      how: "Gradual onset over 2 to 3 days",
                      eye: "One eye",
                      pain: "Bright light is painful",
                      redness: "Pink eye with watery discharge",
                      vision: "Blurry vision",
                      course: "Gradually getting worse",
                      treatment: "No treatment yet",
                      other:
                        "Painful broken skin on lip one week before eye symptoms",
                    }
                  : n === 7
                    ? {
                        problem: "Bright light is painful",
                        when: "Started 1 week ago",
                        how: "Gradual over 1 to 2 days",
                        eye: "One eye",
                        pain: "Bright light painful, no itch",
                        redness: "Pink watery eye",
                        vision: "Slightly blurred vision",
                        course: "Gradually getting worse",
                        treatment: "No treatment yet",
                        other: "Several previous episodes",
                      }
                    : n === 8
                      ? {
                          problem: "Pink patch on eye",
                          when: "Started many months ago",
                          how: "Slow onset, no trauma",
                          eye: "One eye",
                          pain: "Gritty sensation",
                          redness: "White eye with slight watering",
                          vision: "Vision unaffected",
                          course: "Slowly getting worse",
                          treatment: "No treatment yet",
                          other: "Works outdoors daily",
                        }
                      : n === 9
                        ? {
                            problem: "Gritty eye",
                            when: "Started 1 week ago",
                            how: "After working under a car",
                            eye: "One eye",
                            pain: "Bright light uncomfortable",
                            redness: "Slightly pink eye",
                            vision: "Slightly blurred vision",
                            course: "Gradually getting worse",
                            treatment: "No treatment yet",
                            other: "No",
                          }
                        : n === 10
                          ? {
                              problem: "Loss of vision",
                              when: "Started 4 days ago",
                              how: "After being punched",
                              eye: "One eye",
                              pain: "Painful with watering",
                              redness: "Red eye",
                              vision: "Only sees shadows",
                              course: "Staying the same",
                              treatment: "No treatment yet",
                              other: "No",
                            }
                          : n === 11
                            ? {
                                problem: "Painful eye",
                                when: "Started 3 days ago",
                                how: "After being hit in the face with a stick",
                                eye: "One eye",
                                pain: "Gritty, no itch",
                                redness: "Pink eye with watering",
                                vision: "Blurry vision",
                                course: "Gradually getting worse",
                                treatment: "No treatment yet",
                                other: "No",
                              }
                            : n === 12
                              ? {
                                  problem: "Loss of vision",
                                  when: "Started 1 day ago",
                                  how: "After being hit in the eye with a stick",
                                  eye: "One eye",
                                  pain: "Painful",
                                  redness: "Red eye with watering",
                                  vision: "Only sees shadows",
                                  course: "Getting worse",
                                  treatment: "No treatment yet",
                                  other: "No",
                                }
                              : null;
}
function _e({ caseNum: n, variant: i }) {
  return n === 1 && i === "infant"
    ? "Congenital cataract"
    : n === 1 && i === "elderly"
      ? "Cataract"
      : n === 2
        ? "Retinoblastoma"
        : n === 3
          ? "Gonococcal/Chlamydial conjunctivitis"
          : n === 4
            ? "Trachomatous trichiasis with corneal scarring"
            : n === 5
              ? "Bacterial / fungal corneal ulcer"
              : n === 6
                ? "Herpes simplex keratitis"
                : n === 7
                  ? "Anterior Uveitis"
                  : n === 8
                    ? "Pterygium"
                    : n === 9
                      ? "Corneal foreign body with early infection"
                      : n === 10
                        ? "Traumatic hyphaema"
                        : n === 11
                          ? "Penetrating corneal laceration with iris prolapse"
                          : n === 12
                            ? "Penetrating injury causing traumatic cataract"
                            : "";
}
function Ct() {
  let n = document.getElementById("casestudyPage"),
    i = document.getElementById("caseStudyChatPage");
  if (!n || !i) return;
  let c = (() => {
    try {
      let e = JSON.parse(
        sessionStorage.getItem(`${He}:activeLesson`) || "null",
      );
      return (
        JSON.parse(sessionStorage.getItem("pecWorkshop:activeEntry") || "null")
          ?.caseStudy === "intermediate" ||
        Fe.some((t) => t.id === e?.id && t.caseStudy === "intermediate")
      );
    } catch {
      return !1;
    }
  })();
  if (
    (i.classList.toggle("pec-case-study-unlimited", c),
    n.dataset.intermediateInited === "1")
  )
    return;
  ((n.dataset.intermediateInited = "1"),
    We(),
    n.querySelectorAll(".level-card .level-header").forEach((e) => {
      e.addEventListener("click", () => {
        let t = e.closest(".level-card"),
          a = t?.querySelector(".level-body"),
          l = t?.querySelector(".level-chevron");
        if (!a) return;
        let p = a.hasAttribute("hidden");
        (n
          .querySelectorAll(".level-card .level-body")
          .forEach((h) => h.setAttribute("hidden", "")),
          n
            .querySelectorAll(".level-card .level-chevron")
            .forEach((h) => (h.textContent = "\u203A")),
          p && (a.removeAttribute("hidden"), l && (l.textContent = "\u2304")));
      });
    }));
  let u = i.querySelector("#caseChatLog"),
    s = i.querySelector("#caseChatChoices"),
    k = i.querySelector("#caseChatSubmitBtn"),
    ye = i.querySelector("#caseChatBackBtn"),
    f = i.querySelector("#caseChatDraft"),
    P = i.querySelector("#caseChatSendBtn"),
    y = i.querySelector("#caseChatToggleBtn"),
    d = i.querySelector(".casechat-footer"),
    me = d?.querySelector(".casechat-composer"),
    S = d?.querySelector(".casechat-question-panel");
  c && d && s && me && !S
    ? ((S = document.createElement("div")),
      (S.className = "casechat-question-panel"),
      d.insertBefore(S, s),
      S.append(s, me))
    : !c && S && S.replaceWith(...S.childNodes);
  let b = i.querySelector("#caseDxModal"),
    g = i.querySelector("#caseDxCard"),
    C = i.querySelector("#caseDxList"),
    pe = i.querySelector("#caseDxCloseBtn"),
    ge = i.querySelector("#caseDxTimerText"),
    J = i.querySelector("#caseDxTrialText"),
    A = i.querySelector("#caseDxTimerFg"),
    G = i.querySelector("#caseTimerBtn"),
    ve = i.querySelector("#caseTimerText"),
    K = i.querySelector(".caseTimer__fg"),
    X = i.querySelector("#caseImgPenaltyModal"),
    we = i.querySelector("#caseImgPenaltyCloseBtn"),
    be = i.querySelector("#caseImgPenaltyCancelBtn"),
    ke = i.querySelector("#caseImgPenaltyOkBtn"),
    q = i.querySelector("#caseFinalModal"),
    Z = i.querySelector("#caseFinalBody"),
    je = i.querySelector("#caseFinalCloseBtn"),
    Ue = i.querySelector("#caseFinalOkBtn"),
    T = i.querySelector("#caseResultModal"),
    ee = i.querySelector("#caseResultBody"),
    pt = i.querySelector("#caseResultCloseBtn"),
    gt = i.querySelector("#caseNextBtn"),
    te = i.querySelector("#caseResultTitle"),
    ne = null;
  function Qe() {
    if (c) return;
    let e = u.querySelector(".casechat-imgwrap");
    e && e.classList.remove("is-revealed");
  }
  function ze() {
    let e = u.querySelector(".casechat-imgwrap");
    e &&
      (e.classList.add("is-revealed"),
      ne && clearTimeout(ne),
      (ne = setTimeout(() => {
        e.classList.remove("is-revealed");
      }, 2e3)));
  }
  function Ye(e) {
    let t = e.target;
    return t instanceof Element ? t.closest(".casechat-imgcover") : null;
  }
  async function Se(e) {
    !Ye(e) ||
      (e.preventDefault(), e.stopPropagation(), !(await Je())) ||
      (Ae(w - 10), w > 0 && ze());
  }
  function Ve() {
    (he(100),
      Z &&
        (Z.innerHTML = `
      <div class="casechat-resultWhy">Final score: <b>${Te}/${I}</b></div>
    `),
      q && (q.hidden = !1),
      m(q || Z));
  }
  function Ce() {
    q && (q.hidden = !0);
  }
  (je?.addEventListener("click", Ce), Ue?.addEventListener("click", Ce));
  function Je() {
    return new Promise((e) => {
      if (!X) return e(!1);
      let t = (h) => {
          ((X.hidden = !0), p(), e(h));
        },
        a = () => t(!0),
        l = () => t(!1),
        p = () => {
          (ke?.removeEventListener("click", a),
            be?.removeEventListener("click", l),
            we?.removeEventListener("click", l));
        };
      ((X.hidden = !1),
        ke?.addEventListener("click", a),
        be?.addEventListener("click", l),
        we?.addEventListener("click", l));
    });
  }
  if (!u || !s) {
    console.warn(
      "[casestudy] chatPage missing #caseChatLog or #caseChatChoices",
    );
    return;
  }
  (u.addEventListener("click", Se),
    u.addEventListener("pointerup", Se),
    s && (s.hidden = !0),
    i.style.setProperty("--casechat-log-pad", "140px"),
    d && d.classList.add("is-collapsed"),
    y && (y.textContent = "Q"),
    f && f.classList.add("is-placeholder"));
  function H() {
    (b && (b.hidden = !0),
      T && (T.hidden = !0),
      ee && (ee.innerHTML = ""),
      te && (te.textContent = "Result"));
  }
  let r = { current: null, answeredImageShown: !1, asked: new Set() },
    F = 0,
    Te = 0,
    I = 0,
    Le = ut(c),
    B = [],
    v = -1,
    ie = new Set(),
    E = null,
    xe = !1;
  function Ke() {
    if (E) return E;
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
        <span style="font-weight: 700; color: #e41e26">You only get 40 seconds.</span>
      </div>

      <div class="casechat-confirm__actions">
        <button type="button" class="casechat-confirm__btn is-ok" data-action="ok">OK</button>
      </div>
    </div>
  `),
      e.addEventListener("click", (t) => {
        t.target.closest('[data-action="ok"]') && ((xe = !0), Ee(), Q());
      }),
      i.appendChild(e),
      m(e),
      (E = e),
      E
    );
  }
  function Xe() {
    let e = Ke();
    e.hidden = !1;
  }
  function Ee() {
    E && (E.hidden = !0);
  }
  function vt(e) {
    return (
      [
        "First",
        "Second",
        "Third",
        "Fourth",
        "Fifth",
        "Sixth",
        "Seventh",
        "Eighth",
        "Ninth",
        "Tenth",
        "Eleventh",
        "Twelfth",
        "Thirteenth",
      ][e - 1] || `${e}th`
    );
  }
  let ae = 12,
    M = null,
    $ = !1,
    D = 40,
    w = D,
    _ = null,
    se = 10,
    L = se,
    W = null,
    O = 2,
    R = !1;
  function j() {
    W && (clearInterval(W), (W = null));
  }
  function re() {
    ge && (ge.textContent = String(L));
    let e = Math.max(0, Math.min(1, L / se));
    (A &&
      ((A.style.strokeDasharray = "100 100"),
      (A.style.strokeDashoffset = String(100 * (1 - e)))),
      A?.closest(".caseTimer")?.classList.toggle("is-danger", L <= 5));
  }
  function Me() {
    if (J) {
      J.textContent =
        O === 2 ? "You only get 2 attempts." : `Attempts left: ${O}`;
      try {
        window.I18N?.applyTranslations?.(J);
      } catch {}
    }
  }
  function Pe(e) {
    if (
      (($ = !0),
      j(),
      (C?.querySelectorAll(".casechat-dxitem") || []).forEach((a) => {
        ((a.disabled = !0), a.classList.add("is-disabled"));
      }),
      R || ((I += 1), (R = !0), ie.add(r.current?.caseNum), he((I / ae) * 100)),
      g)
    ) {
      g.innerHTML = "";
      let a = document.createElement("div");
      ((a.className = "casechat-tryagain"),
        (a.innerHTML = e),
        g.appendChild(a),
        Be(g),
        m(g));
    }
  }
  function Ze() {
    (j(),
      !c &&
        ((L = se),
        A?.closest(".caseTimer")?.classList.remove("is-danger"),
        re(),
        (W = setInterval(() => {
          ((L -= 1),
            re(),
            L <= 0 &&
              ((L = 0), re(), Pe("Time is up<br />Move on to the next case")));
        }, 1e3))));
  }
  function oe() {
    _ && (clearInterval(_), (_ = null));
  }
  function ce() {
    ve && (ve.textContent = String(w));
    let e = Math.max(0, Math.min(1, w / D));
    (K &&
      ((K.style.strokeDasharray = "100 100"),
      (K.style.strokeDashoffset = String(100 * (1 - e)))),
      G && G.classList.toggle("is-danger", w <= 10));
  }
  function Ae(e) {
    ((w = Math.max(0, Math.min(D, e))), ce(), w === 0 && (oe(), de(!0)));
  }
  function et() {
    (oe(),
      !c &&
        ((w = D),
        (w = D),
        G && G.classList.remove("is-danger"),
        ce(),
        ce(),
        (_ = setInterval(() => {
          Ae(w - 1);
        }, 1e3))));
  }
  function m(e) {
    try {
      window.I18N?.applyTranslations?.(e);
    } catch {}
  }
  function le(e, t) {
    let a = document.createElement("div");
    ((a.className = `casechat-bubble casechat-bubble--${e}`),
      (a.innerHTML = t),
      u.appendChild(a),
      m(a),
      requestAnimationFrame(x));
  }
  function x() {
    let e = u.lastElementChild;
    if (!e) return;
    let t = u.getBoundingClientRect(),
      a = d?.getBoundingClientRect(),
      p = (a ? Math.min(t.bottom, a.top) : t.bottom) - 16,
      h = e.getBoundingClientRect();
    if (h.bottom > p) {
      let o = h.bottom - p;
      u.scrollTo({ top: u.scrollTop + o, behavior: "smooth" });
    }
  }
  function U(e) {
    le("system", `<div class="casechat-system">${e}</div>`);
  }
  function tt(e) {
    le("user", `<div class="casechat-text">${e}</div>`);
  }
  function qe(e, t) {
    let a = '<div class="casechat-botstack">';
    (t &&
      (a += `
    <div class="casechat-imgwrap${c ? " is-revealed" : ""}" data-imgsrc="${t}">
      <img class="casechat-img" src="${t}" alt="Case image" />
      ${
        c
          ? ""
          : `<button type="button" class="casechat-imgcover" aria-label="View case image for 2 seconds">
        <div class="casechat-imgcover__text">Tap to view the case image<br />for 3 seconds</div>
      </button>`
      }
    </div>
  `),
      e && e.trim() !== "" && (a += `<div class="casechat-text">${e}</div>`),
      (a += "</div>"),
      le("bot", a));
  }
  function nt(e = "...") {
    let t = document.getElementById("caseChatLog");
    if (!t) return null;
    let a = document.createElement("div");
    return (
      (a.className =
        "casechat-bubble casechat-bubble--bot casechat-bubble--typing is-typing"),
      (a.innerHTML = `<div class="casechat-text">${e}</div>`),
      t.appendChild(a),
      m(a),
      requestAnimationFrame(x),
      a
    );
  }
  function it(e) {
    let t = (e || "").trim().length,
      a = 350,
      l = 1800,
      p = a + Math.min(1450, Math.floor(t * 18));
    return Math.max(a, Math.min(l, p));
  }
  function Ie() {
    ((s.innerHTML = ""),
      ft.forEach((e) => {
        let t = document.createElement("button");
        ((t.type = "button"),
          (t.className = "casechat-chip"),
          (t.textContent = e.label),
          (t.disabled = r.asked.has(e.id)),
          M?.id === e.id && t.classList.add("is-selected"),
          t.addEventListener("click", () => {
            r.asked.has(e.id) || De(e);
          }),
          s.appendChild(t));
      }),
      m(s));
  }
  function de(e = !1) {
    if (!e && (!r?.asked || r.asked.size === 0)) {
      U("Please ask at least one question before submitting.");
      return;
    }
    if (r.current) {
      if ((g && (g.innerHTML = ""), ($ = !1), (O = 2), Me(), Ze(), C)) {
        C.innerHTML = "";
        let t = _e(r.current),
          a = yt.filter((h) => h !== t),
          l = fe(a).slice(0, 4);
        (fe([t, ...l]).forEach((h) => {
          let o = document.createElement("button");
          ((o.type = "button"),
            (o.className = "casechat-dxitem"),
            o.setAttribute("role", "radio"),
            o.setAttribute("aria-checked", "false"),
            (o.innerHTML = `
      <span class="casechat-radio"></span>
      <span class="casechat-dxlabel">${h}</span>
    `),
            o.addEventListener("click", () => {
              $ ||
                (C.querySelectorAll(".casechat-dxitem").forEach((V) => {
                  (V.classList.remove("is-selected", "is-wrong", "is-correct"),
                    V.setAttribute("aria-checked", "false"));
                }),
                o.classList.add("is-selected"),
                o.setAttribute("aria-checked", "true"),
                rt(h, o));
            }),
            C.appendChild(o));
        }),
          m(C));
      }
      (b && (b.hidden = !1), oe());
    }
  }
  function Q(e = "next") {
    H();
    let t = null;
    if (
      (e === "previous" && v > 0
        ? ((v -= 1), (t = B[v]))
        : e === "next" && v >= 0 && v < B.length - 1
          ? ((v += 1), (t = B[v]))
          : e === "next" &&
            Le.length &&
            ((t = Le.shift()), B.push(t), (v = B.length - 1)),
      !t)
    ) {
      ((u.innerHTML = ""),
        H(),
        (M = null),
        k && (k.disabled = !0),
        s && ((s.hidden = !0), (s.innerHTML = "")),
        f &&
          ((f.textContent = "- Click here to select a question"),
          f.classList.add("is-placeholder"),
          m(f)),
        P && (P.disabled = !0),
        y && (y.textContent = "Q"),
        d && d.classList.add("is-collapsed"),
        Ve());
      return;
    }
    ((r.current = t),
      (r.answeredImageShown = !1),
      (r.asked = new Set()),
      (R = ie.has(r.current.caseNum)),
      (u.innerHTML = ""),
      (F = v + 1));
    let a = ht(r.current);
    (U(`
  <div class="casechat-caseblock">
    <div class="casechat-caseindex">
      Case ${F}
      <span class="casechat-casecount">(${F}/${ae})</span>
    </div>
    ${a ? `<div class="casechat-caseindex">${a}</div>` : ""}
  </div>
  <span class="casechat-firstprompt">Take a history to work out what is wrong</span>
`),
      qe("", $e(r.current.caseNum)),
      (r.answeredImageShown = !0),
      Qe(),
      Ie(),
      s && (s.hidden = !1),
      d && (d.classList.remove("is-collapsed"), d.classList.add("is-expanded")),
      i.style.setProperty("--casechat-log-pad", "280px"),
      y && (y.textContent = "-"),
      k && (k.disabled = !0),
      et());
  }
  function at(e) {
    if (r.asked.has(e.id)) return;
    (r.asked.add(e.id), Ie(), k && (k.disabled = !1), tt(e.ui));
    let a = mt(r.current)?.[e.id] || "No.",
      l = (a || "").trim().length,
      p = Math.max(3, Math.min(7, 3 + Math.floor(l / 40))),
      h = ".".repeat(p),
      o = nt(h),
      V = it(a),
      lt = r.current,
      Oe = () => {
        c &&
          setTimeout(() => {
            r.current !== lt ||
              i.style.display === "none" ||
              !b?.hidden ||
              ((s.hidden = !1),
              d?.classList.remove("is-collapsed"),
              d?.classList.add("is-expanded"),
              i.style.setProperty("--casechat-log-pad", "280px"),
              y && (y.textContent = "-"));
          }, 800);
      };
    setTimeout(() => {
      if (!o) {
        (qe(a), Oe());
        return;
      }
      let Re = o.querySelector(".casechat-text");
      (Re && (Re.textContent = a),
        o.classList.remove("casechat-bubble--typing", "is-typing"),
        m(o),
        requestAnimationFrame(x),
        Oe());
    }, V);
  }
  function N() {
    (j(), b && (b.hidden = !0));
  }
  function wt(e, t) {
    ((te.textContent = e), (ee.innerHTML = t), (T.hidden = !1), m(T));
  }
  function st() {
    T.hidden = !0;
  }
  function bt(e) {
    (e.classList.remove("shake"), e.offsetWidth, e.classList.add("shake"));
  }
  function rt(e, t) {
    let a = _e(r.current);
    if ((g && (g.innerHTML = ""), e !== a)) {
      if (
        (t.classList.add("is-selected"),
        t.classList.add("is-wrong"),
        t.setAttribute("aria-checked", "true"),
        (O -= 1),
        Me(),
        O > 0)
      ) {
        let o = document.createElement("div");
        ((o.className = "casechat-tryagain"),
          (o.textContent = "Try again"),
          g.appendChild(o),
          m(g));
        return;
      }
      Pe("You have used both attempts. Moving to the next case.");
      return;
    }
    (($ = !0),
      j(),
      R ||
        ((Te += 1),
        (I += 1),
        (R = !0),
        ie.add(r.current?.caseNum),
        he((I / ae) * 100)),
      t.classList.add("is-selected"),
      t.classList.add("is-correct"),
      t.setAttribute("aria-checked", "true"),
      (C?.querySelectorAll(".casechat-dxitem") || []).forEach((o) => {
        o !== t && ((o.disabled = !0), o.classList.add("is-disabled"));
      }));
    let p = document.createElement("div");
    p.className = "casechat-correctmsg";
    let h = $e(r.current.caseNum);
    ((p.innerHTML = `
  <div class="casechat-resultOk">Correct.</div>
  <img class="casechat-resultimg" src="${h}" alt="Case image" />
  <div class="casechat-resultWhy">In this case, the diagnosis is <b>${a}</b>.</div>
`),
      g.appendChild(p),
      Be(g),
      m(g));
  }
  function Be(e) {
    let t = document.createElement("div");
    t.className = "casechat-case-navigation";
    let a = document.createElement("button");
    ((a.type = "button"),
      (a.className = "casechat-nextcase casechat-previouscase"),
      (a.textContent = "Previous case"),
      (a.disabled = v <= 0),
      a.addEventListener("click", () => {
        (N(), Q("previous"));
      }));
    let l = document.createElement("button");
    ((l.type = "button"),
      (l.className = "casechat-nextcase"),
      (l.textContent = "Next case"),
      l.addEventListener("click", () => {
        (N(), Q("next"));
      }),
      t.append(a, l),
      e.appendChild(t));
  }
  function z() {
    (H(),
      Ee(),
      i.classList.remove("active"),
      n.classList.add("active"),
      (i.style.display = "none"),
      (n.style.display = ""));
  }
  function ot() {
    if (
      (n.classList.remove("active"),
      i.classList.add("active"),
      (n.style.display = "none"),
      (i.style.display = ""),
      (F = 0),
      H(),
      !xe && !c)
    ) {
      Xe();
      return;
    }
    Q();
  }
  let Y = (e) => {
      e === "intermediate" && ot();
    },
    ue = n.querySelector("#caseStudyIntermediateCard");
  (ue &&
    (ue.addEventListener("click", () => Y("intermediate")),
    ue.addEventListener("keydown", (e) => {
      (e.key !== "Enter" && e.key !== " ") ||
        (e.preventDefault(), Y("intermediate"));
    })),
    n.querySelectorAll(".lesson-row[data-level]").forEach((e) => {
      (e.addEventListener("click", (t) => {
        e.dataset.level === "intermediate" &&
          (t.preventDefault(), t.stopPropagation(), Y("intermediate"));
      }),
        e.addEventListener("keydown", (t) => {
          (t.key !== "Enter" && t.key !== " ") ||
            (e.dataset.level === "intermediate" &&
              (t.preventDefault(), t.stopPropagation(), Y("intermediate")));
        }));
    }),
    k?.addEventListener("click", () => {
      if (!r?.asked || r.asked.size === 0) {
        U("Please ask at least one question before submitting.");
        return;
      }
      de();
    }));
  function De(e) {
    e &&
      (at(e),
      (M = null),
      f &&
        ((f.textContent = "Select a question above"),
        f.classList.add("is-placeholder"),
        m(f)),
      P && (P.disabled = !0),
      s && (s.hidden = !0),
      d && (d.classList.add("is-collapsed"), d.classList.remove("is-expanded")),
      i.style.setProperty("--casechat-log-pad", "140px"),
      y && (y.textContent = "Q"),
      requestAnimationFrame(() => {
        typeof x == "function" && x();
      }));
  }
  (P?.addEventListener("click", () => {
    (console.log("[casechat] send clicked, pending =", M), M && De(M));
  }),
    y?.addEventListener("click", () => {
      let e = !!s?.hidden;
      (s && (s.hidden = !e),
        d &&
          (d.classList.toggle("is-collapsed", !e),
          d.classList.toggle("is-expanded", e)),
        i.style.setProperty("--casechat-log-pad", e ? "280px" : "140px"),
        y && (y.textContent = e ? "-" : "^"),
        requestAnimationFrame(() => {
          typeof x == "function" && x();
        }));
    }),
    f?.addEventListener("click", (e) => {
      (e.preventDefault(), y?.click());
    }),
    f?.addEventListener("keydown", (e) => {
      (e.key !== "Enter" && e.key !== " ") || (e.preventDefault(), y?.click());
    }),
    f && (f.setAttribute("role", "button"), f.setAttribute("tabindex", "0")),
    pe?.addEventListener("click", (e) => {
      (e.preventDefault(), N());
    }),
    pe?.addEventListener("keydown", (e) => {
      (e.key === "Enter" || e.key === " " || e.key === "Spacebar") &&
        (e.preventDefault(), N());
    }));
  function ct(e) {
    return e.key === "Enter" || e.key === " ";
  }
  (ye?.addEventListener("click", z),
    ye?.addEventListener("keydown", (e) => {
      (e.key !== "Enter" && e.key !== " ") ||
        (e.preventDefault(), e.stopPropagation(), z());
    }),
    k?.addEventListener("keydown", (e) => {
      if (ct(e)) {
        if (
          (e.preventDefault(),
          e.stopPropagation(),
          !r?.asked || r.asked.size === 0)
        ) {
          U("Please ask at least one question before submitting.");
          return;
        }
        de();
      }
    }),
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (b && b.hidden === !1) {
          (e.preventDefault(), N());
          return;
        }
        if (T && T.hidden === !1) {
          (e.preventDefault(), st());
          return;
        }
      }
    }),
    z(),
    window.addEventListener("i18n:languageChanged", () => {
      (m(n), m(i));
    }),
    requestAnimationFrame(() => {
      z();
    }));
}
export { Ct as initializeCaseStudy };
