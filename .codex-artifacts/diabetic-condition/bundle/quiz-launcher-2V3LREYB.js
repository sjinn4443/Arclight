function g(e) {
  try {
    window.I18N?.applyTranslations?.(e);
  } catch {}
}
var v = "directOphthalmoscopyQuizPage",
  T = "lessonProgress:",
  L = "arclight:lesson-progress-changed";
function w(e) {
  let t = Number(e);
  return Number.isFinite(t) ? Math.max(0, Math.min(100, t)) : 0;
}
function A(e) {
  try {
    return JSON.parse(localStorage.getItem(e) || "null");
  } catch {
    return null;
  }
}
function N(e, { mode: t = "max" } = {}) {
  let o = v,
    n = `${T}${o}`,
    i = w(e),
    q = A(n) || {},
    h = w(q.percent),
    d = t === "replace" ? i : Math.max(h, i);
  if (d !== h || !Number.isFinite(Number(q.percent)) || d >= 100)
    try {
      localStorage.setItem(
        n,
        JSON.stringify({ percent: d, updatedAt: Date.now() }),
      );
    } catch {}
  document.dispatchEvent(
    new CustomEvent(L, { detail: { target: o, percent: d } }),
  );
}
function I(e, t) {
  if (!e || !t) return;
  let o = 0;
  for (let n = 0; n < t; n += 1)
    e.querySelector(`input[name="q${n}"]:checked`) && (o += 1);
  N((o / t) * 95);
}
function S(e) {
  if (!e || e.querySelector(".direct-quiz-topbar")) return;
  e.classList.add("has-eyes-topbar");
  let t = document.createElement("div");
  ((t.className = "eyes-topbar direct-quiz-topbar"),
    (t.style.display = "none"),
    (t.innerHTML = `
    <div class="eyes-topbar__title" data-i18n="auto.quizzes.quiz">Quiz</div>
    <div class="eyes-topbar__icons">
      <span
        class="icon menuBtn"
        aria-label="Menu"
        data-i18n="i18nExtra.menu_aria_label:aria-label"
      >\u2630</span>
    </div>
  `),
    e.prepend(t));
}
var P =
  /^\s*[\d\uff10-\uff19\u0660-\u0669\u06f0-\u06f9\u0966-\u096f\u09e6-\u09ef\u0c66-\u0c6f]+(?:[.)\u0964\u06d4\uff0e\u3001:])?\s*/;
function R(e) {
  e && (e.textContent = e.textContent.replace(P, ""));
}
function k(e) {
  e?.querySelectorAll?.(".quiz-question").forEach((t) => R(t));
}
function B(e) {
  let t = e.querySelector(".quiz-question-heading"),
    o = e.querySelector(".quiz-question-badge"),
    n = e.querySelector(".quiz-question");
  return (
    n || ((n = document.createElement("p")), (n.className = "quiz-question")),
    t ||
      ((t = document.createElement("div")),
      (t.className = "quiz-question-heading"),
      n.parentElement === e ? e.insertBefore(t, n) : e.prepend(t)),
    o ||
      ((o = document.createElement("span")),
      (o.className = "quiz-question-badge"),
      o.setAttribute("aria-hidden", "true")),
    t.contains(o) || t.prepend(o),
    t.contains(n) || t.appendChild(n),
    { badge: o, question: n }
  );
}
function _() {
  try {
    return window.I18N?.getLanguage?.() === "ne";
  } catch {
    return document.documentElement?.getAttribute?.("lang") === "ne";
  }
}
function O(e, t) {
  e &&
    ((e.textContent = ""),
    e.appendChild(document.createTextNode("Correct answer:")),
    e.appendChild(document.createTextNode(" ")),
    e.appendChild(document.createTextNode(t)));
}
function Q(e, t, o) {
  if (!e) return;
  if (((e.textContent = ""), _())) {
    let q = document.createElement("b");
    ((q.textContent = String(o)),
      e.appendChild(q),
      e.appendChild(
        document.createTextNode(" \u092E\u0927\u094D\u092F\u0947 "),
      ));
    let h = document.createElement("b");
    ((h.textContent = String(t)),
      e.appendChild(h),
      e.appendChild(
        document.createTextNode(
          " \u0938\u0939\u0940 \u0917\u0930\u094D\u0928\u0941\u092D\u092F\u094B\u0964",
        ),
      ));
    return;
  }
  (e.appendChild(document.createTextNode("You got")),
    e.appendChild(document.createTextNode(" ")));
  let n = document.createElement("b");
  ((n.textContent = String(t)),
    e.appendChild(n),
    e.appendChild(document.createTextNode(" ")),
    e.appendChild(document.createTextNode("out of")),
    e.appendChild(document.createTextNode(" ")));
  let i = document.createElement("b");
  ((i.textContent = String(o)),
    e.appendChild(i),
    e.appendChild(document.createTextNode(" ")),
    e.appendChild(document.createTextNode("correct.")));
}
function M() {
  let e = document.querySelector(".page.active")?.id || "dashboard",
    t = "directOphthalmoscopyQuizPage",
    o = (a) => {
      if (typeof window.showPage == "function") return window.showPage(a);
      if (typeof window.minimalShowPage == "function")
        return window.minimalShowPage(a);
      document
        .querySelectorAll(".page")
        .forEach((c) => (c.style.display = "none"));
      let u = document.getElementById(a);
      u && (u.style.display = "block");
    },
    n = document.getElementById(t);
  if (n && n.querySelector?.(".quiz-container")) {
    (S(n), o(t), g(n));
    return;
  }
  let i = n || document.createElement("div");
  ((i.id = t), (i.className = "page has-eyes-topbar"));
  let q = document.getElementById("quizLauncherLayoutTemplate");
  if (q) i.replaceChildren(q.content.cloneNode(!0));
  else {
    let a = document.createElement("div");
    a.className = "quiz-container";
    let u = document.createElement("div");
    u.className = "quiz-header small";
    let c = document.createElement("div");
    c.className = "quiz-header-row centered";
    let p = document.createElement("button");
    ((p.id = "backToVideoBtn"),
      (p.className = "back-icon"),
      (p.title = "Go back"),
      p.setAttribute("data-i18n", "i18nLiteral.Go back:title"));
    let C = document.createElement("h2");
    ((C.textContent = "Quiz"),
      C.setAttribute("data-i18n", "auto.quizzes.quiz"),
      c.appendChild(p),
      c.appendChild(C),
      u.appendChild(c));
    let m = document.createElement("div");
    m.className = "quiz-scroll";
    let l = document.createElement("form");
    ((l.id = "quizForm"), m.appendChild(l));
    let f = document.createElement("div");
    f.className = "quiz-footer";
    let y = document.createElement("button");
    ((y.type = "submit"),
      y.setAttribute("form", "quizForm"),
      (y.className = "start-btn"),
      (y.textContent = "See Results"),
      y.setAttribute("data-i18n", "i18nExtra.see_results"),
      f.appendChild(y));
    let s = document.createElement("div");
    ((s.id = "quizModal"), (s.className = "quiz-modal hidden"));
    let r = document.createElement("div");
    r.className = "quiz-modal-content";
    let E = document.createElement("p");
    E.id = "quizScoreText";
    let b = document.createElement("button");
    ((b.id = "seeWhyBtn"),
      (b.textContent = "Check Answer"),
      b.setAttribute("data-i18n", "i18nLiteral.Check Answer"),
      r.appendChild(E),
      r.appendChild(b),
      s.appendChild(r),
      a.appendChild(u),
      a.appendChild(m),
      a.appendChild(f),
      a.appendChild(s),
      i.replaceChildren(a));
  }
  (S(i), n || document.getElementById("appRoot")?.appendChild(i));
  let h = [
      {
        q: "1. When starting direct ophthalmoscopy, what is the ideal distance between the examiner and the patient?",
        options: ["5 cm", "10 cm", "15 cm", "Arm's length"],
        answer: 3,
      },
      {
        q: "2. Which of the options describe the best condition to get the view of the retina?",
        options: [
          "Outdoors with bright sunlight, dilated pupil",
          "Dim room with dilated pupil",
          "Indoors with bright light, dilated pupil",
          "Dim room with constricted pupil",
        ],
        answer: 1,
      },
      {
        q: "3. Which eye should you use to examine the patient's right eye?",
        options: ["Left eye", "Either eye", "Right eye", "Dominant eye"],
        answer: 2,
      },
      {
        q: "4. During ophthalmoscopy, which part of the back of the eye should you identify first?",
        options: ["Macula", "Optic disc", "Retinal periphery", "Fovea"],
        answer: 1,
      },
      {
        q: "5. What is the name given to pale optic disc?",
        options: [
          "Normal finding",
          "Cataract",
          "Optic atrophy",
          "Raised intraocular pressure",
        ],
        answer: 2,
      },
      {
        q: "6. Which lighting condition is recommended for performing ophthalmoscopy with the Arclight?",
        options: [
          "Bright daylight",
          "Dim or darkened room",
          "Bright room",
          "Ambient light",
        ],
        answer: 1,
      },
      {
        q: "7. What does a cup-to-disc ratio (CDR) of 0.7 or greater typically suggest on fundus examination?",
        options: [
          "Glaucoma",
          "Macular degeneration",
          "Diabetic retinopathy",
          "Retinal detachment",
        ],
        answer: 0,
      },
    ],
    d = i.querySelector("#quizForm"),
    z = document.getElementById("quizLauncherBlockTemplate"),
    x = document.getElementById("quizLauncherOptionTemplate");
  d &&
    ((d.textContent = ""),
    h.forEach((a, u) => {
      let c =
        z?.content.firstElementChild?.cloneNode(!0) ||
        document.createElement("div");
      c.classList.add("quiz-block");
      let { badge: p, question: C } = B(c);
      ((p.textContent = String(u + 1).padStart(2, "0")), (C.textContent = a.q));
      let m = c.querySelector(".quiz-options");
      (m ||
        ((m = document.createElement("div")),
        (m.className = "quiz-options"),
        c.appendChild(m)),
        a.options.forEach((f, y) => {
          let s =
            x?.content.firstElementChild?.cloneNode(!0) ||
            document.createElement("label");
          s.classList.add("radio-label");
          let r = s.querySelector("input") || document.createElement("input");
          ((r.type = "radio"), (r.name = `q${u}`), (r.value = String(y)));
          let E =
            s.querySelector(".quiz-option-text") ||
            s.querySelector("span") ||
            document.createElement("span");
          ((E.textContent = f),
            s.contains(r) || s.prepend(r),
            s.contains(E) || s.appendChild(E),
            m.appendChild(s));
        }));
      let l = c.querySelector(".answer");
      (l ||
        ((l = document.createElement("p")),
        (l.className = "answer"),
        (l.style.display = "none"),
        (l.style.marginTop = "5px"),
        (l.style.fontStyle = "italic"),
        c.appendChild(l)),
        O(l, a.options[a.answer]),
        d.appendChild(c));
    }),
    g(i),
    g(d),
    k(d),
    d.dataset.progressWired !== "1" &&
      ((d.dataset.progressWired = "1"),
      d.addEventListener("change", () => {
        I(d, h.length);
      })),
    (d.onsubmit = (a) => {
      a.preventDefault();
      let u = 0;
      h.forEach((p, C) => {
        let m = d.querySelectorAll(`input[name="q${C}"]`),
          l = p.answer,
          f = null;
        (m.forEach((r) => {
          ((r.disabled = !0), r.checked && (f = Number.parseInt(r.value, 10)));
        }),
          (
            m[0]?.closest(".quiz-block")?.querySelectorAll("label") || []
          ).forEach((r, E) => {
            E === l
              ? r.classList.add("correct")
              : Number.parseInt(r.querySelector("input")?.value || "", 10) ===
                  f && r.classList.add("wrong");
          }),
          f === l && (u += 1));
      });
      let c = i.querySelector("#quizScoreText");
      if (c) {
        (Q(c, u, h.length), c.appendChild(document.createElement("br")));
        let p = document.createElement("small");
        ((p.textContent = "Answers are highlighted in green."),
          c.appendChild(p),
          g(c));
      }
      (i.querySelector("#quizModal")?.classList.remove("hidden"), N(100));
    }),
    i.querySelector("#seeWhyBtn")?.addEventListener("click", () => {
      (i.querySelector("#quizModal")?.classList.add("hidden"),
        i
          .querySelectorAll(".answer")
          .forEach((a) => (a.style.display = "block")));
    }),
    i.querySelector("#backToVideoBtn")?.addEventListener("click", () => {
      o(e);
    }),
    o(t));
}
window.launchQuiz = M;
