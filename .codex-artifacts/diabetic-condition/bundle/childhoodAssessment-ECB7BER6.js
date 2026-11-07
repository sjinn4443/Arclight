import { b as y, d as L } from "./chunk-YXB63DKV.js";
import "./chunk-VKQVMSQC.js";
import "./chunk-WOT6VMZA.js";
function S(e) {
  try {
    window.I18N?.applyTranslations?.(e);
  } catch {}
}
function N(e) {
  let t = e
    .querySelector(":scope > .container.pupils-container .eyes-topbar")
    ?.cloneNode(!0);
  return (
    t?.classList.add("quiz-desktop-topbar"),
    t && (t.style.display = "none"),
    t?.querySelectorAll(".menuBtn").forEach((i) => (i.textContent = "\u2630")),
    t
  );
}
var T =
  /^\s*[\d\uff10-\uff19\u0660-\u0669\u06f0-\u06f9\u0966-\u096f\u09e6-\u09ef\u0c66-\u0c6f]+(?:[.)\u0964\u06d4\uff0e\u3001:])?\s*/;
function z(e, t) {
  let i = e?.querySelector?.(".quiz-question-badge");
  i && (i.textContent = String(t + 1).padStart(2, "0"));
}
function k(e) {
  e && (e.textContent = e.textContent.replace(T, ""));
}
function A(e) {
  e?.querySelectorAll?.(".quiz-question").forEach((t) => k(t));
}
function v() {
  try {
    return window.I18N?.getLanguage?.() === "ne";
  } catch {
    return document.documentElement?.getAttribute?.("lang") === "ne";
  }
}
function R(e, t, i) {
  e &&
    ((e.textContent = ""),
    e.appendChild(document.createTextNode("Correct answer:")),
    e.appendChild(document.createTextNode(" ")),
    e.appendChild(document.createTextNode(`${t}. `)),
    e.appendChild(document.createTextNode(i)));
}
function B(e, t, i) {
  if (!e) return;
  if (((e.textContent = ""), v())) {
    let g = document.createElement("b");
    ((g.textContent = String(i)),
      e.appendChild(g),
      e.appendChild(
        document.createTextNode(" \u092E\u0927\u094D\u092F\u0947 "),
      ));
    let f = document.createElement("b");
    ((f.textContent = String(t)),
      e.appendChild(f),
      e.appendChild(
        document.createTextNode(
          " \u0938\u0939\u0940 \u0917\u0930\u094D\u0928\u0941\u092D\u092F\u094B\u0964",
        ),
      ));
    return;
  }
  (e.appendChild(document.createTextNode("You got")),
    e.appendChild(document.createTextNode(" ")));
  let h = document.createElement("b");
  ((h.textContent = String(t)),
    e.appendChild(h),
    e.appendChild(document.createTextNode(" ")),
    e.appendChild(document.createTextNode("out of")),
    e.appendChild(document.createTextNode(" ")));
  let m = document.createElement("b");
  ((m.textContent = String(i)),
    e.appendChild(m),
    e.appendChild(document.createTextNode(" ")),
    e.appendChild(document.createTextNode("correct.")));
}
function Q() {
  let e = document.getElementById("childhoodAssessmentQuizPage");
  if (!e || (L(), e.dataset.built === "1")) return;
  e.dataset.built = "1";
  let t = ["A", "B", "C", "D"],
    i = [
      {
        q: "1. What structure(s) is the yellow arrow pointing at",
        img: "/images/quiz/workshop/childhood/01.png",
        options: [
          "Lens & Cornea",
          "Retina",
          "Pupil & Cornea",
          "Conjunctiva & Sclera",
        ],
        answer: 3,
      },
      {
        q: "2. What structure is the yellow arrow pointing at?",
        img: "/images/quiz/workshop/childhood/02.png",
        options: ["Cornea", "Sclera", "Lens", "Conjunctiva"],
        answer: 2,
      },
      {
        q: "3. What structure is the yellow arrow pointing at?",
        img: "/images/quiz/workshop/childhood/03.png",
        options: ["Optic Nerve", "Retina", "Brain", "Conjunctiva"],
        answer: 0,
      },
      {
        q: "4. This is an Arclight device. The yellow arrow is pointing at one end of the device. What is the function of that end?",
        img: "/images/quiz/workshop/childhood/04.png",
        options: [
          "Direct Ophthalmoscope",
          "Anterior Segment Loupe",
          "Otoscope",
          "Pupillometer",
        ],
        answer: 0,
      },
      {
        q: "5. Describe the squint in the photograph",
        img: "/images/quiz/workshop/childhood/05.png",
        options: [
          "Right outward turning (exotropia)",
          "Left outward turning (exotropia)",
          "Left inward turning (esotropia)",
          "Right inward turning (esotropia)",
        ],
        answer: 2,
      },
      {
        q: "6. Describe the squint in the photograph",
        img: "/images/quiz/workshop/childhood/06.png",
        options: [
          "Right inward turning (esotropia)",
          "Right outward turning (exotropia)",
          "Left outward turning (exotropia)",
          "Left inward turning (esotropia)",
        ],
        answer: 0,
      },
      {
        q: "7. Describe the squint in the photograph",
        img: "/images/quiz/workshop/childhood/07.png",
        options: [
          "Right outward turning (exotropia)",
          "Right inward turning (esotropia)",
          "Left outward turning (exotropia)",
          "Left inward turning (esotropia)",
        ],
        answer: 1,
      },
      {
        q: "8. Describe the squint in the photograph",
        img: "/images/quiz/workshop/childhood/08.png",
        options: [
          "Right outward turning (exotropia)",
          "Right inward turning (esotropia)",
          "Left outward turning (exotropia)",
          "Left inward turning (esotropia)",
        ],
        answer: 3,
      },
      {
        q: "9. Describe the squint in the photograph",
        img: "/images/quiz/workshop/childhood/09.png",
        options: [
          "Right outward turning (exotropia)",
          "Right inward turning (esotropia)",
          "Left outward turning (exotropia)",
          "Left inward turning (esotropia)",
        ],
        answer: 2,
      },
    ],
    h = document.getElementById("childhoodAssessmentLayoutTemplate"),
    m = document.getElementById("childhoodAssessmentBlockTemplate"),
    g = document.getElementById("childhoodAssessmentOptionTemplate");
  if (!h || !m || !g) return;
  let f = N(e);
  ((e.textContent = ""),
    f && e.appendChild(f),
    e.appendChild(h.content.cloneNode(!0)));
  let u = e.querySelector("#childhoodQuizForm");
  if (!u) return;
  let b = (o, { mode: s = "max" } = {}) => {
      (y("childhoodAssessmentPage", o, { mode: s }),
        y("childhoodAssessmentQuizPage", o, { mode: s }));
    },
    E = () => {
      let s =
        (i.reduce((n, c, a) => {
          let d = u.querySelector(`input[name="q${a}"]:checked`);
          return n + (d ? 1 : 0);
        }, 0) /
          i.length) *
        90;
      b(s);
    };
  (i.forEach((o, s) => {
    let n = m.content.querySelector(".quiz-block").cloneNode(!0),
      c = t[o.answer] || "";
    z(n, s);
    let a = n.querySelector(".quiz-question");
    a && (a.textContent = o.q);
    let d = n.querySelector(".quiz-image");
    d && (d.src = o.img);
    let l = n.querySelector(".quiz-options");
    l &&
      o.options.forEach((q, r) => {
        let p = g.content.querySelector(".radio-label").cloneNode(!0),
          C = p.querySelector("input");
        C && ((C.type = "radio"), (C.name = `q${s}`), (C.value = String(r)));
        let x = p.querySelector(".quiz-option-text");
        (x &&
          ((x.textContent = ""),
          x.appendChild(document.createTextNode(`${t[r]}. `)),
          x.appendChild(document.createTextNode(q))),
          l.appendChild(p));
      });
    let w = n.querySelector(".answer");
    (w && R(w, c, o.options[o.answer]), u.appendChild(n), S(n));
  }),
    u.addEventListener("change", (o) => {
      o.target instanceof HTMLInputElement && o.target.type === "radio" && E();
    }),
    u.addEventListener("submit", (o) => {
      o.preventDefault();
      let s = 0;
      i.forEach((c, a) => {
        let d = u.querySelectorAll(`input[name="q${a}"]`),
          l = null;
        d.forEach((r) => {
          ((r.disabled = !0), r.checked && (l = Number(r.value)));
        });
        let w = d[0]?.closest(".quiz-block");
        if (!w) return;
        let q = w.querySelectorAll("label");
        (q.forEach((r) => r.classList.remove("correct", "wrong")),
          q.forEach((r) => {
            let p = Number(r.querySelector("input")?.value);
            p === c.answer
              ? r.classList.add("correct")
              : p === l && r.classList.add("wrong");
          }),
          l === c.answer && (s += 1));
      });
      let n = e.querySelector("#childhoodQuizScoreText");
      if (n) {
        n.textContent = "";
        let c = document.createElement("span");
        (B(c, s, i.length),
          n.appendChild(c),
          n.appendChild(document.createElement("br")));
        let a = document.createElement("small");
        ((a.textContent = "Answers are highlighted in green."),
          n.appendChild(a),
          S(n));
      }
      (b(100),
        e.querySelector("#childhoodQuizModal").classList.remove("hidden"));
    }),
    e.querySelector("#childhoodSeeWhyBtn").addEventListener("click", () => {
      (e.querySelector("#childhoodQuizModal").classList.add("hidden"),
        e
          .querySelectorAll(".answer")
          .forEach((o) => (o.style.display = "block")));
    }),
    S(e),
    A(e));
}
export { Q as initializeChildhoodAssessment };
