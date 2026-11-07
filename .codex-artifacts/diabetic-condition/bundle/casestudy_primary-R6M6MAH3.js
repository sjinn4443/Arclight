import { c as Ae, d as Qe } from "./chunk-KIQ7J7XB.js";
import "./chunk-VKQVMSQC.js";
import "./chunk-WOT6VMZA.js";
var Ht = "caseStudyChatPagePrimary",
  Dt = "caseStudyFlashcardPagePrimary";
function $e() {
  let n = document.getElementById("casestudyPage");
  n && Qe(n);
}
function Ze(n) {
  (Ae(Ht, n), $e());
}
function et(n) {
  (Ae(Dt, n), $e());
}
function We(n) {
  let l = [...n];
  for (let v = l.length - 1; v > 0; v--) {
    let M = Math.floor(Math.random() * (v + 1));
    [l[v], l[M]] = [l[M], l[v]];
  }
  return l;
}
function tt(n, l) {
  (Array.isArray(l) ? l : [l]).forEach((M, C) => {
    (C > 0 && n.appendChild(document.createElement("br")),
      n.appendChild(document.createTextNode(String(M))));
  });
}
function k(n) {
  try {
    window.I18N?.applyTranslations?.(n);
  } catch {}
}
function Ut() {
  try {
    return window.I18N?.getLanguage?.() === "ne";
  } catch {
    return document.documentElement?.getAttribute?.("lang") === "ne";
  }
}
function nt(n, l, v) {
  if (!n) return;
  if (((n.textContent = ""), Ut())) {
    let S = document.createElement("b");
    ((S.textContent = String(v)),
      n.appendChild(S),
      n.appendChild(
        document.createTextNode(" \u092E\u0927\u094D\u092F\u0947 "),
      ));
    let h = document.createElement("b");
    ((h.textContent = String(l)),
      n.appendChild(h),
      n.appendChild(
        document.createTextNode(
          " \u0938\u0939\u0940 \u0917\u0930\u094D\u0928\u0941\u092D\u092F\u094B\u0964",
        ),
      ));
    return;
  }
  (n.appendChild(document.createTextNode("You got")),
    n.appendChild(document.createTextNode(" ")));
  let M = document.createElement("b");
  ((M.textContent = String(l)),
    n.appendChild(M),
    n.appendChild(document.createTextNode(" ")),
    n.appendChild(document.createTextNode("out of")),
    n.appendChild(document.createTextNode(" ")));
  let C = document.createElement("b");
  ((C.textContent = String(v)),
    n.appendChild(C),
    n.appendChild(document.createTextNode(" ")),
    n.appendChild(document.createTextNode("correct.")));
}
function qe({ caseNum: n }) {
  return n === 1
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
function Yt({ caseNum: n, variant: l }) {
  return n === 1
    ? [
        "Vision became worse slowly over many months, with no pain.",
        "No red eye or discharge suggests cataract, not an eye infection.",
      ]
    : n === 2
      ? [
          "A white pupil in a baby is a key danger sign for retinoblastoma.",
          "Poor visual attention supports this diagnosis and needs urgent referral.",
        ]
      : n === 3
        ? [
            "Thick yellow discharge and pink eyes suggest bacterial conjunctivitis.",
            l === "neonate"
              ? "Newborn age and maternal STI history support gonococcal/chlamydial conjunctivitis."
              : "This sticky red-eye pattern can be due to gonococcal/chlamydial infection.",
          ]
        : n === 4
          ? [
              "Long-term gritty pain with blurry vision suggests chronic surface damage.",
              "This pattern fits trachomatous trichiasis with corneal scarring.",
            ]
          : n === 5
            ? [
                "Severe pain and red eye after a scratch from a bush suggest corneal ulcer.",
                "Discharge and very poor vision support bacterial/fungal corneal infection.",
              ]
            : n === 6
              ? [
                  "One painful light-sensitive eye with watery redness suggests keratitis.",
                  "Recent painful lip sores support herpes simplex keratitis.",
                ]
              : n === 7
                ? [
                    "Photophobia, pain, and blurred vision in one eye suggest uveitis.",
                    "Repeated similar episodes support anterior uveitis.",
                  ]
                : n === 8
                  ? [
                      "A slow-growing pink patch with mild grit sensation suggests pterygium.",
                      "Good vision and long outdoor work make this diagnosis more likely.",
                    ]
                  : n === 9
                    ? [
                        "Gritty painful eye after metal work suggests a corneal foreign body.",
                        "Light sensitivity and blurred vision suggest early infection is starting.",
                      ]
                    : n === 10
                      ? [
                          "Sudden vision loss after blunt trauma is typical for traumatic hyphaema.",
                          "A painful red watering eye with shadow vision supports this diagnosis.",
                        ]
                      : n === 11
                        ? [
                            "Stick injury with worsening pain and blur suggests open-globe trauma.",
                            "This pattern fits penetrating corneal laceration with iris prolapse.",
                          ]
                        : n === 12
                          ? [
                              "Severe vision loss after stick trauma suggests a penetrating eye injury.",
                              "Painful red eye with fast decline supports traumatic cataract.",
                            ]
                          : [
                              "The history pattern supports this diagnosis.",
                              "Clinical signs are consistent with this case label.",
                            ];
}
function re(n = !1) {
  let l = [
    { caseNum: 1, variant: "default" },
    { caseNum: 2, variant: Math.random() < 0.5 ? "progressive" : "congenital" },
    { caseNum: 3, variant: Math.random() < 0.5 ? "adult" : "neonate" },
    { caseNum: 4, variant: "default" },
    { caseNum: 5, variant: "default" },
    { caseNum: 6, variant: "default" },
    { caseNum: 7, variant: "default" },
    { caseNum: 8, variant: "default" },
    { caseNum: 9, variant: "default" },
    { caseNum: 10, variant: "default" },
    { caseNum: 11, variant: "default" },
    { caseNum: 12, variant: "default" },
  ];
  return n ? l : We(l);
}
function jt(n) {
  let v =
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((M) => M !== n)[0] || 1;
  return v === 2
    ? { caseNum: 2, variant: "progressive" }
    : v === 3
      ? { caseNum: 3, variant: "adult" }
      : { caseNum: v, variant: "default" };
}
function Re(n) {
  return `/images/casestudy/case${n}_eyes.webp`;
}
function Xt({ caseNum: n, variant: l }) {
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
    : n === 2 && l === "progressive"
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
      : n === 2 && l === "congenital"
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
        : n === 3 && l === "adult"
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
          : n === 3 && l === "neonate"
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
function j(n) {
  return n
    .filter((l) => typeof l == "string" && l.trim() !== "")
    .map((l) => l.trim().replace(/\s+/g, " "))
    .join(" ");
}
function Vt(n) {
  let l = (n || "").trim().toLowerCase();
  return l === "no." || l === "no" || l === "none." || l === "none";
}
function zt(n) {
  let { caseNum: l, variant: v } = n,
    C =
      {
        1: "78 years old",
        2: "12 months old",
        3: v === "neonate" ? "2 weeks old" : "18 years old",
        4: "38 years old",
        5: "29 years old",
        6: "21 years old",
        7: "21 years old",
        8: "69 years old",
        9: "21 years old",
        10: "32 years old",
        11: "8 years old",
        12: "8 years old",
      }[l] || "unknown age",
    h =
      /weeks|months/.test(C) || (C.includes("years") && parseInt(C, 10) < 16)
        ? `My child is ${C}.`
        : `I'm ${C}.`,
    E = Xt(n) || {},
    I = j([E.when, E.problem]),
    xe = j([E.how]),
    ae = j([E.eye, E.pain]),
    X = j([E.redness]),
    V = j([E.vision, E.course]),
    ie = j([E.treatment]),
    _ = E.other || "",
    H = Vt(_);
  H && (_ = "I think that's about it.");
  let A = j([_]);
  return [
    h,
    I,
    xe,
    ae,
    X,
    V,
    ie,
    A,
    H ? "What is the problem?" : "I think that's about it.",
  ].filter((z) => typeof z == "string" && z.trim() !== "");
}
function Kt(n, l) {
  return n === l;
}
function nn() {
  let n = null,
    l = null,
    v = 0,
    M = null,
    C = document.getElementById("casestudyPage"),
    S = document.getElementById("caseStudyChatPagePrimary"),
    h = document.getElementById("caseStudyFlashcardPagePrimary");
  if (!C || !S || !h || C.dataset.primaryInited === "1") return;
  C.dataset.primaryInited = "1";
  let E = (() => {
    try {
      return (
        JSON.parse(sessionStorage.getItem("pecWorkshop:activeEntry") || "null")
          ?.caseStudy === "primary"
      );
    } catch {
      return !1;
    }
  })();
  $e();
  let I = S.querySelector("#casePrimaryChatLog"),
    xe = S.querySelector("#casePrimaryTimerBtn"),
    ae = S.querySelector("#casePrimaryTimerText"),
    X = S.querySelector("#casePrimaryTimerFg");
  if (!I || !xe || !ae || !X) return;
  let V = 12,
    ie = 90;
  function _() {
    Ze((A / V) * 100);
  }
  let H = re(E),
    A = 0,
    $ = ie,
    se = null,
    z = [],
    K = 2,
    O = !1;
  function J() {
    (z.forEach((e) => clearTimeout(e)), (z = []));
  }
  function G() {
    se && (clearInterval(se), (se = null));
  }
  function ke() {
    ae.textContent = String($);
    let e = Math.max(0, Math.min(1, $ / ie));
    ((X.style.strokeDasharray = "100 100"),
      (X.style.strokeDashoffset = String(100 * (1 - e))));
    let a = $ <= 10 ? "#e41e26" : "#777";
    ((X.style.stroke = a), (ae.style.fill = a));
  }
  function rt() {
    (G(),
      ($ = ie),
      ke(),
      (se = setInterval(() => {
        (($ -= 1),
          ke(),
          $ <= 0 && (($ = 0), ke(), G(), (O = !0), Ct(), _(), Z()));
      }, 1e3)));
  }
  let Se = 30,
    L = re(),
    B = 0,
    D = Se,
    de = null,
    ue = 0,
    oe = [],
    le = null,
    at = !1,
    he = !1,
    Ee = 0;
  function it() {
    he ||
      ((he = !0),
      (Ee = window.scrollY || 0),
      (document.documentElement.style.overflow = "hidden"),
      (document.body.style.overflow = "hidden"),
      (document.body.style.position = "fixed"),
      (document.body.style.top = `-${Ee}px`),
      (document.body.style.left = "0"),
      (document.body.style.right = "0"),
      (document.body.style.width = "100%"));
  }
  function st() {
    he &&
      ((he = !1),
      (document.documentElement.style.overflow = ""),
      (document.body.style.overflow = ""),
      (document.body.style.position = ""),
      (document.body.style.top = ""),
      (document.body.style.left = ""),
      (document.body.style.right = ""),
      (document.body.style.width = ""),
      window.scrollTo(0, Ee));
  }
  function ot() {
    if (le) return le;
    let e = document.createElement("div");
    ((e.className = "casechat-modal"), (e.hidden = !0));
    let t = document.createElement("div");
    ((t.className = "casechat-modalCard"),
      (t.style.maxHeight = "80vh"),
      (t.style.overflow = "auto"));
    let a = document.createElement("div");
    a.className = "casechat-modalTop";
    let c = document.createElement("div");
    ((c.className = "casechat-modalTitle"),
      (c.textContent = "All cards completed"),
      a.appendChild(c));
    let i = document.createElement("div");
    ((i.className = "casechat-resultWhy"), (i.id = "flashScoreText"));
    let o = document.createElement("div");
    ((o.id = "flashWrongList"), (o.className = "flash-wrong-list"));
    let s = document.createElement("div");
    s.className = "casechat-confirm__actions flash-result-actions";
    let m = document.createElement("button");
    ((m.type = "button"),
      (m.className = "casechat-confirm__btn is-ok"),
      (m.dataset.action = "restart"),
      (m.textContent = "Restart"));
    let g = document.createElement("button");
    return (
      (g.type = "button"),
      (g.className = "casechat-confirm__btn is-exit"),
      (g.dataset.action = "back"),
      (g.textContent = "Exit"),
      s.appendChild(m),
      s.appendChild(g),
      t.appendChild(a),
      t.appendChild(i),
      t.appendChild(o),
      t.appendChild(s),
      e.appendChild(t),
      e.addEventListener("click", (y) => {
        if (y.target.closest('[data-action="restart"]')) {
          ((e.hidden = !0), (L = re()), (B = 0), (ue = 0), (oe = []), me());
          return;
        }
        if (y.target.closest('[data-action="back"]')) {
          ((e.hidden = !0), Ne());
          return;
        }
      }),
      h.appendChild(e),
      k(e),
      (le = e),
      e
    );
  }
  function lt() {
    let e = ot();
    et(100);
    let t = e.querySelector("#flashScoreText");
    t && nt(t, ue, L.length);
    let a = e.querySelector("#flashWrongList");
    if (a)
      if (((a.textContent = ""), oe.length === 0)) {
        let c = document.createElement("div");
        ((c.className = "casechat-resultWhy"),
          (c.textContent = "No wrong answers."),
          a.appendChild(c));
      } else
        oe.forEach(({ caseObj: c, correctIsUrgent: i }) => {
          let o = Re(c.caseNum),
            s = qe(c),
            m = i ? "Urgent Referral" : "Not urgent",
            g = i ? "is-urgent" : "is-not-urgent",
            y = document.createElement("div");
          y.className = "flash-wrong-row";
          let u = document.createElement("img");
          ((u.className = "flash-wrong-thumb"),
            (u.src = o),
            (u.alt = "Case image"));
          let F = document.createElement("div");
          F.className = "flash-wrong-main";
          let f = document.createElement("div");
          ((f.className = "flash-wrong-dx"), (f.textContent = s));
          let b = document.createElement("div");
          ((b.className = `flash-wrong-label ${g}`),
            (b.textContent = m),
            F.appendChild(f),
            F.appendChild(b),
            y.appendChild(u),
            y.appendChild(F),
            a.appendChild(y));
        });
    (k(e), (e.hidden = !1));
  }
  function ct(e) {
    return [2, 3, 5, 6, 7, 9, 10, 11, 12].includes(e);
  }
  function Q() {
    de && (clearInterval(de), (de = null));
  }
  let Jt = null;
  function Te() {
    let e = h?.querySelector("#primaryFlashTimerFg"),
      t = h?.querySelector("#primaryFlashTimerText");
    if (!e || !t) return;
    t.textContent = String(D);
    let a = Math.max(0, Math.min(1, D / Se));
    ((e.style.strokeDasharray = "100 100"),
      (e.style.strokeDashoffset = String(100 * (1 - a))));
    let i = D <= 5 ? "#e41e26" : "#777";
    ((e.style.stroke = i), (t.style.fill = i));
  }
  function dt(e) {
    (Q(),
      (D = Se),
      Te(),
      (de = setInterval(() => {
        ((D -= 1),
          Te(),
          D <= 0 && ((D = 0), Te(), Q(), typeof e == "function" && e()));
      }, 1e3)));
  }
  function ut() {
    ((C.style.display = "none"),
      (S.style.display = "none"),
      (h.style.display = "block"),
      it(),
      Q(),
      (L = re()),
      (B = 0),
      (ue = 0),
      (oe = []),
      le && (le.hidden = !0));
    let e = h.querySelector("#primaryFlashBackBtn");
    e && (e.onclick = () => Ne());
    let t = h.querySelector("#primaryFlashUrgentBtn"),
      a = h.querySelector("#primaryFlashNotUrgentBtn");
    (t && (t.onclick = () => R(!0)), a && (a.onclick = () => R(!1)), He());
    let c = h.querySelector("#primaryFlashTour"),
      i = h.querySelector("#primaryFlashTourSpot"),
      o = h.querySelector("#primaryFlashTourSpotCard"),
      s = h.querySelector("#primaryFlashTourBubble"),
      m = h.querySelector("#primaryFlashTourTitle"),
      g = h.querySelector("#primaryFlashTourText"),
      y = h.querySelector("#primaryFlashTourNext"),
      u = h.querySelector("#primaryFlashTourHint"),
      F = "primaryFlashcardGuideSeen",
      f = () => {
        me();
      },
      b = [
        {
          title: "Referral Flashcard",
          text: "Look at the cases and decide if the patient needs urgent referral or not.",
          target: null,
          hint: null,
          nextLabel: "Next",
          nextI18n: "i18nExtra.next",
        },
        {
          title: "Flip the card",
          text: "You can check diagnosis by tapping the card.",
          target: "#primaryFlashCard",
          hint: "tap",
          nextLabel: "Next",
          nextI18n: "i18nExtra.next",
        },
        {
          title: "Not urgent",
          text: "Swipe the flashcard to the left or press the button.",
          target: "#primaryFlashNotUrgentBtn",
          hint: "left",
          nextLabel: "Next",
          nextI18n: "i18nExtra.next",
        },
        {
          title: "Urgent referral",
          text: "Swipe the flashcard to the right or press the button.",
          target: "#primaryFlashUrgentBtn",
          hint: "right",
          nextLabel: "Start",
          nextI18n: null,
        },
      ],
      x = 0,
      N = null,
      Y = [];
    function ne(r, d) {
      let p = setTimeout(() => {
        ((Y = Y.filter((w) => w !== p)), r());
      }, d);
      Y.push(p);
    }
    function Ft() {
      (Y.forEach((r) => clearTimeout(r)), (Y = []));
    }
    function Mt() {
      u &&
        (u.classList.remove("is-animating"),
        u.offsetWidth,
        u.classList.add("is-animating"),
        ne(() => u.classList.remove("is-animating"), 1500));
    }
    function Me() {
      let r = h.querySelector("#primaryFlashCardWrap");
      r &&
        ((r.style.transition = ""),
        (r.style.transform = "translateX(0px) rotate(0deg)"));
    }
    function fe() {
      (N && (clearInterval(N), (N = null)), Ft());
      let r = h.querySelector("#primaryFlashCard");
      (r && r.classList.remove("is-flipped"), Me());
    }
    function Xe() {
      let r = h.querySelector("#primaryFlashCard");
      r &&
        (Me(),
        r.classList.remove("is-flipped"),
        ne(() => r.classList.add("is-flipped"), 420),
        ne(() => r.classList.remove("is-flipped"), 1640));
    }
    function Bt() {
      (fe(), Xe(), (N = setInterval(Xe, 2460)));
    }
    function Ve(r) {
      let d = h.querySelector("#primaryFlashCardWrap"),
        p = h.querySelector("#primaryFlashCard");
      if (!d || !p) return;
      (Me(), p.classList.remove("is-flipped"), Mt());
      let w = r * 118,
        T = r * 8;
      (ne(() => {
        ((d.style.transition =
          "transform 620ms cubic-bezier(0.22, 1, 0.36, 1)"),
          (d.style.transform = `translateX(${w}px) rotate(${T}deg)`));
      }, 0),
        ne(() => {
          ((d.style.transition =
            "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)"),
            (d.style.transform = "translateX(0px) rotate(0deg)"));
        }, 760),
        ne(() => {
          d.style.transition = "";
        }, 1340));
    }
    function ze(r) {
      (fe(), Ve(r), (N = setInterval(() => Ve(r), 2200)));
    }
    function ye(r) {
      c && c.classList.toggle("has-spotlight", !!r);
    }
    function Ke() {
      (fe(),
        Be(),
        Je(null),
        ge(),
        ce(),
        ye(!1),
        c && (c.style.display = "none"));
    }
    function Pt() {
      c && (c.style.display = "block");
    }
    function Be() {
      u &&
        ((u.style.display = "none"),
        (u.style.left = ""),
        (u.style.top = ""),
        (u.style.width = ""),
        (u.style.height = ""),
        (u.style.transform = ""),
        u.classList.remove(
          "is-up",
          "is-left",
          "is-right",
          "is-animating",
          "is-over-card",
          "is-tap",
        ));
    }
    function Je(r) {
      let d = h.querySelector("#primaryFlashUrgentBtn"),
        p = h.querySelector("#primaryFlashNotUrgentBtn");
      [d, p].forEach((w) => {
        w &&
          w.classList.remove(
            "is-tour-muted",
            "is-tour-active",
            "is-tour-raised",
          );
      });
    }
    function It(r) {
      u &&
        (Be(),
        r &&
          ((u.style.display = "block"),
          r === "tap" && u.classList.add("is-tap", "is-over-card"),
          r === "left" && u.classList.add("is-left", "is-over-card"),
          r === "right" && u.classList.add("is-right", "is-over-card")));
    }
    function At() {
      if (!u) return;
      let r = h.querySelector("#primaryFlashCard");
      if (!r) return;
      let d = r.getBoundingClientRect();
      ((u.style.position = "fixed"),
        (u.style.left = `${Math.round(d.left + d.width / 2)}px`),
        (u.style.top = `${Math.round(d.top + d.height / 2)}px`),
        (u.style.transform = "translate(-50%, -50%)"),
        (u.style.zIndex = "10000"));
    }
    function qt() {
      u &&
        u.style.display !== "none" &&
        ((u.style.position = "fixed"),
        (u.style.left = "50%"),
        (u.style.top = "50%"),
        (u.style.transform = "translate(-50%, -50%)"),
        (u.style.zIndex = "10000"));
    }
    function Rt() {
      if (!u || u.style.display === "none") return;
      qt();
    }
    function ge() {
      i &&
        ((i.style.width = "0px"),
        (i.style.height = "0px"),
        (i.style.left = "0px"),
        (i.style.top = "0px"),
        (i.style.display = "none"));
    }
    function we(r) {
      if (!i) return;
      let d = r.getBoundingClientRect(),
        p = 10,
        w = Math.max(8, d.left - p),
        T = Math.max(8, d.top - p),
        q = Math.min(window.innerWidth - w - 8, d.width + p * 2),
        P = Math.min(window.innerHeight - T - 8, d.height + p * 2);
      ((i.style.display = "block"),
        (i.style.left = `${w}px`),
        (i.style.top = `${T}px`),
        (i.style.width = `${q}px`),
        (i.style.height = `${P}px`));
    }
    function ce() {
      o &&
        (o.classList.remove("is-mask"),
        (o.style.width = "0px"),
        (o.style.height = "0px"),
        (o.style.left = "0px"),
        (o.style.top = "0px"),
        (o.style.display = "none"));
    }
    function Wt(r) {
      if (!o) return;
      o.classList.remove("is-mask");
      let d = r.getBoundingClientRect(),
        p = 10,
        w = Math.max(8, d.left - p),
        T = Math.max(8, d.top - p),
        q = Math.min(window.innerWidth - w - 8, d.width + p * 2),
        P = Math.min(window.innerHeight - T - 8, d.height + p * 2);
      ((o.style.display = "block"),
        (o.style.left = `${w}px`),
        (o.style.top = `${T}px`),
        (o.style.width = `${q}px`),
        (o.style.height = `${P}px`));
    }
    function en(r) {
      if (!i) return;
      let d = r.filter(Boolean).map((W) => W.getBoundingClientRect());
      if (!d.length) {
        ge();
        return;
      }
      let p = Math.min(...d.map((W) => W.left)),
        w = Math.min(...d.map((W) => W.top)),
        T = Math.max(...d.map((W) => W.right)),
        q = Math.max(...d.map((W) => W.bottom)),
        P = 10,
        be = Math.max(8, p - P),
        ve = Math.max(8, w - P),
        Ie = Math.min(window.innerWidth - be - 8, T - p + P * 2),
        _t = Math.min(window.innerHeight - ve - 8, q - w + P * 2);
      ((i.style.display = "block"),
        (i.style.left = `${be}px`),
        (i.style.top = `${ve}px`),
        (i.style.width = `${Ie}px`),
        (i.style.height = `${_t}px`));
    }
    function Ce(r) {
      if (!s) return;
      let d = 12,
        p = Math.round((window.innerWidth - s.offsetWidth) / 2),
        w = Math.round((window.innerHeight - s.offsetHeight) / 2);
      if (!r) {
        ((s.style.left = `${Math.max(12, Math.min(p, window.innerWidth - s.offsetWidth - 12))}px`),
          (s.style.top = `${Math.max(12, Math.min(w, window.innerHeight - s.offsetHeight - 12))}px`));
        return;
      }
      let T = r.getBoundingClientRect(),
        q = T.bottom + d,
        P = T.top - d - s.offsetHeight;
      (q + s.offsetHeight <= window.innerHeight - 12
        ? (w = q)
        : P >= 12 && (w = P),
        (p = Math.round(T.left + T.width / 2 - s.offsetWidth / 2)),
        (s.style.left = `${Math.max(12, Math.min(p, window.innerWidth - s.offsetWidth - 12))}px`),
        (s.style.top = `${Math.max(12, Math.min(w, window.innerHeight - s.offsetHeight - 12))}px`));
    }
    function $t(r) {
      if (!s || !r) return;
      let d = r.getBoundingClientRect(),
        p = Math.round(d.left + d.width / 2 - s.offsetWidth / 2),
        w = Math.round(d.bottom - s.offsetHeight + 8);
      ((s.style.left = `${Math.max(12, Math.min(p, window.innerWidth - s.offsetWidth - 12))}px`),
        (s.style.top = `${Math.max(12, Math.min(w, window.innerHeight - s.offsetHeight - 12))}px`));
    }
    function Pe() {
      let r = b[x];
      if (!r) return;
      if (
        (fe(),
        Be(),
        m && (m.textContent = r.title),
        g && (g.textContent = r.text),
        y &&
          (r.nextI18n
            ? y.setAttribute("data-i18n", r.nextI18n)
            : y.removeAttribute("data-i18n"),
          (y.textContent = r.nextLabel),
          r.nextLabel === "Start"
            ? y.classList.add("is-start")
            : y.classList.remove("is-start")),
        s && k(s),
        It(r.hint),
        Je(r.target),
        r.hint === "tap" && requestAnimationFrame(() => At()),
        (r.hint === "left" || r.hint === "right") &&
          requestAnimationFrame(() => Rt()),
        !r.target)
      ) {
        (ye(!1), ge(), ce(), requestAnimationFrame(() => Ce(null)));
        return;
      }
      let d = h.querySelector(r.target);
      if (!d) {
        (ye(!1), ge(), ce(), requestAnimationFrame(() => Ce(null)));
        return;
      }
      let p = h.querySelector("#primaryFlashCard");
      if (
        (ye(!0),
        r.target === "#primaryFlashNotUrgentBtn" ||
          r.target === "#primaryFlashUrgentBtn")
      ) {
        (we(p || d),
          ce(),
          d.classList.add("is-tour-raised"),
          requestAnimationFrame(() => Ce(d)),
          r.hint === "left" ? ze(-1) : r.hint === "right" && ze(1));
        return;
      }
      (r.target === "#primaryFlashNotUrgentBtn" ||
      r.target === "#primaryFlashUrgentBtn"
        ? (we(d), p && Wt(p))
        : (we(d), ce()),
        requestAnimationFrame(() => {
          r.hint === "tap" ? $t(d) : Ce(d);
        }),
        r.hint === "tap" && Bt());
    }
    function Ot() {
      if (x < b.length - 1) {
        ((x += 1), Pe());
        return;
      }
      (Ke(), sessionStorage.setItem(F, "1"), f());
    }
    function Gt() {
      let r = L?.[0]?.caseNum,
        d = jt(r);
      (me({ caseObjOverride: d, skipTimer: !0, labelOverride: "Example" }),
        (x = 0),
        Pt(),
        Pe());
    }
    c && i && s && y
      ? ((y.onclick = () => Ot()),
        sessionStorage.getItem(F) ? (Ke(), f()) : Gt(),
        window.addEventListener("resize", () => {
          !c || c.style.display === "none" || Pe();
        }))
      : f();
  }
  let Oe = h.querySelector("#primaryFlashBackBtn");
  Oe && (Oe.onclick = () => Ne());
  let Ge = h.querySelector("#primaryFlashUrgentBtn"),
    _e = h.querySelector("#primaryFlashNotUrgentBtn");
  (Ge && (Ge.onclick = () => R(!0)), _e && (_e.onclick = () => R(!1)), He());
  function Ne() {
    (Q(),
      st(),
      (h.style.display = "none"),
      (S.style.display = "none"),
      (C.style.display = "block"));
  }
  function ht(e) {
    let { caseNum: t, variant: a } = e || {};
    return t === 1
      ? [
          "started slowly over more than a year.",
          "no pain or itch.",
          "no redness or discharge.",
          "vision now only sees shadows.",
        ]
      : t === 2
        ? [
            "white pupil noticed in a very young child.",
            "poor visual interest for age.",
            "can involve one eye then both eyes.",
            "urgent red-flag pattern for intraocular tumor.",
          ]
        : t === 3 && a === "neonate"
          ? [
              "newborn with pink eyes and thick yellow sticky discharge.",
              "started in one eye then both eyes.",
              "eyes often kept shut due to irritation.",
              "maternal STI history increases suspicion.",
            ]
          : t === 3
            ? [
                "pink eyes with thick yellow sticky discharge.",
                "started in one eye then both eyes.",
                "blurry vision and symptoms getting worse.",
                "pattern fits severe bacterial/STI-related conjunctivitis.",
              ]
            : t === 4
              ? [
                  "long history of gritty painful eyes.",
                  "both eyes affected with redness and watering.",
                  "blurred vision and slowly worsening course.",
                  "chronic surface damage pattern (trichiasis/scarring).",
                ]
              : t === 5
                ? [
                    "after scratch from bush.",
                    "one eye gritty then very painful.",
                    "red eye with sticky yellow discharge.",
                    "only sees shadows.",
                  ]
                : t === 6
                  ? [
                      "painful broken skin on lip one week before eye symptoms.",
                      "blurry vision gradually getting worse.",
                      "pink eye with watery discharge.",
                      "bright light is painful.",
                    ]
                  : t === 7
                    ? [
                        "one painful eye with pink watery redness.",
                        "bright light is painful.",
                        "vision is slightly blurred.",
                        "similar episodes happened before.",
                      ]
                    : t === 8
                      ? [
                          "slowly growing pink patch on one eye.",
                          "gritty feeling with mild watering.",
                          "vision mostly unaffected.",
                          "long outdoor UV exposure history.",
                        ]
                      : t === 9
                        ? [
                            "started after working under a car.",
                            "one gritty eye with light sensitivity.",
                            "slightly red eye with gradual blur.",
                            "worsening course suggests early infection.",
                          ]
                        : t === 10
                          ? [
                              "sudden vision loss after being punched.",
                              "painful red watery eye.",
                              "vision reduced to only shadows.",
                              "blunt-trauma pattern fits hyphaema.",
                            ]
                          : t === 11
                            ? [
                                "hit in the eye with a stick.",
                                "one eye gritty painful and getting worse.",
                                "pink watering eye with blurred vision.",
                                "penetrating-injury pattern (possible open globe).",
                              ]
                            : t === 12
                              ? [
                                  "recent stick injury to the eye.",
                                  "painful red eye with watering.",
                                  "vision dropped to shadows and worsening.",
                                  "penetrating trauma can cause traumatic cataract.",
                                ]
                              : [
                                  "onset and course of symptoms.",
                                  "pain/redness/discharge pattern.",
                                  "vision impact.",
                                  "important risk history.",
                                ];
  }
  function me(e = {}) {
    let {
      caseObjOverride: t = null,
      skipTimer: a = !1,
      labelOverride: c = null,
    } = e;
    if (
      (console.log("[flash] renderFlashCard", {
        flashIndex: B,
        poolLen: L?.length,
        override: !!t,
        skipTimer: a,
      }),
      !t && B >= L.length)
    ) {
      (Q(), lt());
      return;
    }
    let i = t || L[B],
      o = h.querySelector("#primaryFlashCaseLabel");
    if (o) {
      if (((o.textContent = ""), c != null)) o.textContent = c;
      else {
        let x = document.createElement("span");
        ((x.textContent = "Case"),
          o.appendChild(x),
          o.appendChild(document.createTextNode(` (${B + 1}/${L.length})`)));
      }
      k(o);
    }
    let s = h.querySelector("#primaryFlashImg"),
      m = h.querySelector("#primaryFlashDx"),
      g = h.querySelector("#primaryFlashBullets"),
      y = h.querySelector("#primaryFlashDxRationale");
    if (!s || !m || !g) return;
    let u = qe(i),
      F = Re(i.caseNum);
    ((s.src = F),
      (m.textContent = u),
      y &&
        ((y.textContent = ""),
        Yt(i)
          .slice(0, 2)
          .forEach((x) => {
            let N = document.createElement("li");
            ((N.textContent = x), y.appendChild(N));
          })));
    let f = h.querySelector("#primaryFlashCardWrap"),
      b = h.querySelector("#primaryFlashCard");
    (b && b.classList.remove("is-flipped"),
      f &&
        ((f.style.transition = ""),
        (f.style.transform = "translateX(0px) rotate(0deg)")),
      (g.textContent = ""),
      ht(i).forEach((x) => {
        let N = document.createElement("li");
        ((N.textContent = x), g.appendChild(N));
      }),
      k(h),
      !a &&
        dt(() => {
          R(null);
        }));
  }
  function R(e) {
    if (
      (console.log("[flash] submitFlashAnswer called", {
        userSaysUrgent: e,
        flashIndex: B,
        poolLen: L?.length,
      }),
      B >= L.length)
    ) {
      console.warn("[flash] submit ignored because flashIndex >= poolLen");
      return;
    }
    let t = L[B],
      a = ct(t.caseNum);
    (e === a ? (ue += 1) : oe.push({ caseObj: t, correctIsUrgent: a }),
      Q(),
      (B += 1),
      et((B / L.length) * 100),
      console.log("[flash] after increment", {
        flashIndex: B,
        poolLen: L?.length,
        willComplete: B >= (L?.length || 0),
      }),
      me());
  }
  function He() {
    let e = h.querySelector("#primaryFlashCardWrap"),
      t = h.querySelector("#primaryFlashCard");
    if (!e || !t || t.__flashSwipeBound) return;
    t.__flashSwipeBound = !0;
    let a = 0,
      c = 0,
      i = 0,
      o = 0,
      s = !1,
      m = !1;
    t.addEventListener("click", () => {
      (console.log("[flash] card click"),
        !m && t.classList.toggle("is-flipped"));
    });
    let g = () => {
        ((e.style.transition = "transform 180ms ease"),
          (e.style.transform = "translateX(0px) rotate(0deg)"),
          setTimeout(() => {
            e.style.transition = "";
          }, 200));
      },
      y = (f, b) => {
        let x = f * Math.max(320, window.innerWidth);
        ((e.style.transition = "transform 180ms ease"),
          (e.style.transform = `translateX(${x}px) rotate(${f * 10}deg)`),
          setTimeout(() => {
            ((e.style.transition = ""),
              (e.style.transform = "translateX(0px) rotate(0deg)"),
              typeof b == "function" && b());
          }, 190));
      };
    (t.addEventListener(
      "touchstart",
      (f) => {
        let b = f.touches?.[0];
        b &&
          ((s = !0),
          (a = b.clientX),
          (c = b.clientY),
          (i = 0),
          (o = 0),
          (m = !1),
          (e.style.transition = ""));
      },
      { passive: !1 },
    ),
      t.addEventListener(
        "touchmove",
        (f) => {
          if (!s) return;
          f.preventDefault();
          let b = f.touches?.[0];
          if (!b) return;
          let x = b.clientX - a,
            N = b.clientY - c;
          if (
            ((Math.abs(x) > 8 || Math.abs(N) > 8) && (m = !0),
            (i = x),
            (o = N),
            Math.abs(x) >= Math.abs(N))
          ) {
            let Y = Math.max(-12, Math.min(12, x / 18));
            e.style.transform = `translateX(${x}px) rotate(${Y}deg)`;
          }
        },
        { passive: !1 },
      ),
      t.addEventListener("touchend", () => {
        if (!s) return;
        if (((s = !1), setTimeout(() => (m = !1), 250), o < -90)) {
          (t.classList.toggle("is-flipped"), g());
          return;
        }
        if (i > 90) {
          y(1, () => R(!0));
          return;
        }
        if (i < -90) {
          y(-1, () => R(!1));
          return;
        }
        g();
      }));
    let u = null;
    (t.addEventListener("pointerdown", (f) => {
      f.pointerType === "touch" ||
        f.button !== 0 ||
        ((u = f.pointerId),
        (s = !0),
        (a = f.clientX),
        (c = f.clientY),
        (i = 0),
        (o = 0),
        (m = !1),
        (e.style.transition = ""),
        t.setPointerCapture?.(u));
    }),
      t.addEventListener("pointermove", (f) => {
        if (
          !(!s || f.pointerId !== u) &&
          ((i = f.clientX - a),
          (o = f.clientY - c),
          (Math.abs(i) > 8 || Math.abs(o) > 8) && (m = !0),
          Math.abs(i) >= Math.abs(o))
        ) {
          f.preventDefault();
          let b = Math.max(-12, Math.min(12, i / 18));
          e.style.transform = `translateX(${i}px) rotate(${b}deg)`;
        }
      }));
    let F = (f) => {
      !s ||
        f.pointerId !== u ||
        ((s = !1),
        t.releasePointerCapture?.(u),
        (u = null),
        setTimeout(() => (m = !1), 250),
        o < -90
          ? (t.classList.toggle("is-flipped"), g())
          : i > 90
            ? y(1, () => R(!0))
            : i < -90
              ? y(-1, () => R(!1))
              : g());
    };
    (t.addEventListener("pointerup", F),
      t.addEventListener("pointercancel", F),
      (at = !0));
  }
  function De(e, t) {
    if (t != null) {
      if (Array.isArray(t)) {
        t.forEach((a) => De(e, a));
        return;
      }
      if (typeof t == "string") {
        e.appendChild(document.createTextNode(t));
        return;
      }
      e.appendChild(t);
    }
  }
  function U(e) {
    let t = document.createElement("div");
    t.className = "casechat-bubble casechat-bubble--system";
    let a = document.createElement("div");
    ((a.className = "casechat-system"),
      De(a, e),
      t.appendChild(a),
      I.appendChild(t),
      k(t));
  }
  function mt(e) {
    let t = document.createElement("div");
    t.className = "casechat-bubble casechat-bubble--bot";
    let a = document.createElement("div");
    ((a.className = "casechat-text"),
      (a.textContent = e),
      t.appendChild(a),
      I.appendChild(t),
      k(t),
      E
        ? I.scrollTo({ top: I.scrollHeight, behavior: "smooth" })
        : t.scrollIntoView({ block: "end", behavior: "smooth" }));
  }
  function pt(e) {
    let t = [11, 12],
      a = (() => {
        let o = [];
        for (let m = 1; m <= V; m++) m !== e && o.push(m);
        t.includes(e) && (o = o.filter((m) => !t.includes(m)));
        let s = We(o).slice(0, 3);
        return We([e, ...s]);
      })(),
      c = document.createElement("div");
    ((c.className = "casechat-imggrid"),
      a.forEach((o) => {
        let s = document.createElement("button");
        ((s.type = "button"),
          (s.className = "casechat-imgbtn"),
          (s.dataset.caseNum = String(o)));
        let m = document.createElement("img");
        ((m.className = "casechat-imgopt"),
          (m.src = Re(o)),
          (m.alt = "Diagnosis option image"),
          s.appendChild(m),
          s.addEventListener("click", () => {
            O || bt(o, s);
          }),
          c.appendChild(s));
      }));
    let i = document.createElement("div");
    ((i.className = "casechat-imgfeedback"),
      i.setAttribute("aria-live", "polite"),
      I.appendChild(c),
      I.appendChild(i),
      k(c),
      k(i),
      (n = c),
      (l = i));
  }
  function Z() {
    let e = document.createElement("button");
    ((e.type = "button"),
      (e.className = "casechat-nextcase"),
      (e.textContent = "Next case >"),
      e.addEventListener("click", () => pe()),
      I.appendChild(e),
      k(e),
      e.scrollIntoView({ block: "end", behavior: "smooth" }));
  }
  function Qt(e, t = !1) {
    if (((O = !0), G(), J(), t)) {
      (U("Time is up."), Z());
      return;
    }
    if (e) {
      (U("Correct."), Z());
      return;
    }
    if (((K -= 1), K > 0)) {
      (U("Not quite. Try again."), (O = !1));
      return;
    }
    (U("Incorrect."), Z());
  }
  function ft() {
    n &&
      n.querySelectorAll(".casechat-imgbtn").forEach((e) => {
        if (e.dataset.lockedWrong === "1") {
          e.classList.remove("is-correct");
          return;
        }
        e.classList.remove("is-wrong", "is-correct");
      });
  }
  function yt() {
    if (!l) return;
    l.textContent = "";
    let e = document.createElement("div");
    ((e.className = "casechat-tryagain"),
      (e.textContent = "Try again"),
      l.appendChild(e),
      k(l));
  }
  function gt(e) {
    if (!l) return;
    l.textContent = "";
    let t = document.createElement("div");
    ((t.className = "casechat-resultOk"), (t.textContent = "Correct."));
    let a = document.createElement("div");
    ((a.className = "casechat-resultWhy"),
      a.appendChild(document.createTextNode("In this case, the diagnosis is")),
      a.appendChild(document.createTextNode(" ")));
    let c = document.createElement("b");
    ((c.textContent = e),
      a.appendChild(c),
      a.appendChild(document.createTextNode(".")),
      l.appendChild(t),
      l.appendChild(a),
      k(l));
  }
  function wt() {
    if (!l) return;
    l.textContent = "";
    let e = document.createElement("div");
    ((e.className = "casechat-tryagain"),
      (e.textContent = "Incorrect."),
      l.appendChild(e),
      k(l));
  }
  function Ct() {
    if (!l) return;
    l.textContent = "";
    let e = document.createElement("div");
    ((e.className = "casechat-tryagain"),
      (e.textContent = "Time is up."),
      l.appendChild(e),
      k(l));
  }
  function bt(e, t) {
    let a = M;
    if (!a) return;
    let c = a.caseNum,
      i = Kt(e, c);
    if ((ft(), i)) {
      ((v += 1), t.classList.add("is-correct"), (O = !0), G(), J());
      let o = qe(a);
      (gt(o), _(), Z());
      return;
    }
    if (
      (t.classList.add("is-wrong"),
      (K -= 1),
      K === 1 && (t.dataset.lockedWrong = "1"),
      K > 0)
    ) {
      (yt(), (O = !1));
      return;
    }
    ((O = !0), G(), J(), wt(), _(), Z());
  }
  function vt(e) {
    let t = zt(e);
    !Array.isArray(t) ||
      t.length === 0 ||
      t.forEach((a, c) => {
        let i = setTimeout(() => mt(a), 1e3 + c * 2e3);
        z.push(i);
      });
  }
  function Le() {
    ((I.textContent = ""), (O = !1), (K = 2), (n = null), (l = null));
  }
  function xt() {
    (E && C.classList.remove("pec-primary-chat-open"),
      S.classList.remove("active"),
      C.classList.add("active"),
      (S.style.display = "none"),
      (C.style.display = ""),
      G(),
      J());
  }
  function Ue() {
    if (
      (E && C.classList.add("pec-primary-chat-open"),
      C.classList.remove("active"),
      S.classList.add("active"),
      (C.style.display = "none"),
      (S.style.display = ""),
      (A = 0),
      (v = 0),
      (H = re(E)),
      Le(),
      !Ye)
    ) {
      St();
      return;
    }
    pe();
  }
  let ee = null,
    Ye = !1;
  function kt() {
    if (ee) return ee;
    let e = document.createElement("div");
    ((e.className = "casechat-modal"), (e.hidden = !0));
    let t = document.createElement("div");
    t.className = "casechat-modalCard";
    let a = document.createElement("div");
    a.className = "casechat-modalTop";
    let c = document.createElement("div");
    ((c.className = "casechat-modalTitle"),
      (c.textContent = "Case study"),
      a.appendChild(c));
    let i = document.createElement("div");
    ((i.className = "casechat-resultWhy"),
      tt(
        i,
        "Listen to what the patient says and tap the image that best matches the diagnosis.",
      ));
    let o = document.createElement("div");
    o.className = "casechat-confirm__actions";
    let s = document.createElement("button");
    return (
      (s.type = "button"),
      (s.className = "casechat-confirm__btn is-ok"),
      (s.dataset.action = "ok"),
      (s.textContent = "OK"),
      o.appendChild(s),
      t.appendChild(a),
      t.appendChild(i),
      t.appendChild(o),
      e.appendChild(t),
      e.addEventListener("click", (m) => {
        let g = m.target.closest(".casechat-modalClose"),
          y = m.target.closest('[data-action="ok"]');
        (g || y) && ((Ye = !0), Et(), pe());
      }),
      S.appendChild(e),
      k(e),
      (ee = e),
      ee
    );
  }
  function St() {
    let e = kt();
    (k(e), (e.hidden = !1));
  }
  function Et() {
    ee && (ee.hidden = !0);
  }
  let te = null;
  function Tt() {
    if (te) return te;
    let e = document.createElement("div");
    ((e.className = "casechat-modal"), (e.hidden = !0));
    let t = document.createElement("div");
    t.className = "casechat-modalCard";
    let a = document.createElement("div");
    a.className = "casechat-modalTop";
    let c = document.createElement("div");
    ((c.className = "casechat-modalTitle"),
      (c.textContent = "All cases completed"),
      a.appendChild(c));
    let i = document.createElement("div");
    i.className = "casechat-resultWhy";
    let o = document.createElement("div");
    o.className = "casechat-confirm__actions";
    let s = document.createElement("button");
    ((s.type = "button"),
      (s.className = "casechat-confirm__btn is-ok"),
      (s.dataset.action = "restart"),
      (s.textContent = "Restart"));
    let m = document.createElement("button");
    return (
      (m.type = "button"),
      (m.className = "casechat-confirm__btn is-cancel"),
      (m.dataset.action = "back"),
      tt(m, ["Back to", "History taking"]),
      o.appendChild(s),
      o.appendChild(m),
      t.appendChild(a),
      t.appendChild(i),
      t.appendChild(o),
      e.appendChild(t),
      e.addEventListener("click", (g) => {
        if (g.target.closest(".casechat-modalClose")) {
          Fe();
          return;
        }
        if (g.target.closest('[data-action="restart"]')) {
          (Fe(), (A = 0), (v = 0), (H = re(E)), pe());
          return;
        }
        if (g.target.closest('[data-action="back"]')) {
          (Fe(), xt());
          return;
        }
      }),
      S.appendChild(e),
      k(e),
      (te = e),
      te
    );
  }
  function Nt() {
    let e = Tt();
    Ze(100);
    let t = e.querySelector(".casechat-resultWhy");
    (t && nt(t, v, V), k(e), (e.hidden = !1));
  }
  function Fe() {
    te && (te.hidden = !0);
  }
  function pe() {
    if ((G(), J(), A >= H.length)) {
      (G(), J(), Le(), Nt());
      return;
    }
    let e = H[A];
    ((A += 1), (M = e), Le());
    let t = document.createElement("div");
    t.className = "casechat-caseblock";
    let a = document.createElement("div");
    a.className = "casechat-caseindex";
    let c = document.createElement("span");
    ((c.textContent = "Case"),
      a.appendChild(c),
      a.appendChild(document.createTextNode(` ${A}`)));
    let i = document.createElement("span");
    ((i.className = "casechat-casecount"),
      (i.textContent = `(${A}/${V})`),
      a.appendChild(i),
      t.appendChild(a),
      U(t),
      U(
        "Listen to what the patient says and tap the image that best matches the diagnosis.",
      ));
    let o = document.createElement("span");
    ((o.className = "casechat-attemptsNote"),
      (o.textContent = "You only get 2 attempts."),
      U(o),
      pt(e.caseNum),
      rt(),
      vt(e));
  }
  let Zt = (e) => {
    e === "primary" && Ue();
  };
  function Lt(e) {
    return e.key === "Enter" || e.key === " ";
  }
  function je(e) {
    if (e === "primary") {
      Ue();
      return;
    }
    if (e === "primary-flashcard") {
      ut();
      return;
    }
  }
  (C.addEventListener(
    "click",
    (e) => {
      let t = e.target.closest(".lesson-row");
      if (!e.target.closest("#caseStudyPrimaryCard")) return;
      e.preventDefault();
      let c = t?.dataset?.level || "primary";
      je(c);
    },
    !0,
  ),
    C.addEventListener(
      "keydown",
      (e) => {
        if (!Lt(e)) return;
        let t = e.target.closest(".lesson-row");
        if (!e.target.closest("#caseStudyPrimaryCard")) return;
        e.preventDefault();
        let c = t?.dataset?.level || "primary";
        je(c);
      },
      !0,
    ));
}
export { nn as initializeCaseStudyPrimary };
