import { b as v, d as S } from "./chunk-YXB63DKV.js";
import "./chunk-VKQVMSQC.js";
import "./chunk-WOT6VMZA.js";
function w(e) {
  try {
    window.I18N?.applyTranslations?.(e);
  } catch {}
}
function T(e) {
  let t = e
    .querySelector(":scope > .container.pupils-container .eyes-topbar")
    ?.cloneNode(!0);
  return (
    t?.classList.add("quiz-desktop-topbar"),
    t && (t.style.display = "none"),
    t?.querySelectorAll(".menuBtn").forEach((n) => (n.textContent = "\u2630")),
    t
  );
}
var E =
  /^\s*[\d\uff10-\uff19\u0660-\u0669\u06f0-\u06f9\u0966-\u096f\u09e6-\u09ef\u0c66-\u0c6f]+(?:[.)\u0964\u06d4\uff0e\u3001:])?\s*/;
function N(e, t) {
  let n = e?.querySelector?.(".quiz-question-badge");
  n && (n.textContent = String(t + 1).padStart(2, "0"));
}
function z(e) {
  e && (e.textContent = e.textContent.replace(E, ""));
}
function k(e) {
  e?.querySelectorAll?.(".quiz-question").forEach((t) => z(t));
}
function L() {
  try {
    return window.I18N?.getLanguage?.() === "ne";
  } catch {
    return document.documentElement?.getAttribute?.("lang") === "ne";
  }
}
function B(e, t, n) {
  e &&
    ((e.textContent = ""),
    e.appendChild(document.createTextNode("Correct answer:")),
    e.appendChild(document.createTextNode(" ")),
    e.appendChild(document.createTextNode(`${t}. `)),
    e.appendChild(document.createTextNode(n)));
}
function I(e, t, n) {
  if (!e) return;
  if (((e.textContent = ""), L())) {
    let f = document.createElement("b");
    ((f.textContent = String(n)),
      e.appendChild(f),
      e.appendChild(
        document.createTextNode(" \u092E\u0927\u094D\u092F\u0947 "),
      ));
    let g = document.createElement("b");
    ((g.textContent = String(t)),
      e.appendChild(g),
      e.appendChild(
        document.createTextNode(
          " \u0938\u0939\u0940 \u0917\u0930\u094D\u0928\u0941\u092D\u092F\u094B\u0964",
        ),
      ));
    return;
  }
  (e.appendChild(document.createTextNode("You got")),
    e.appendChild(document.createTextNode(" ")));
  let p = document.createElement("b");
  ((p.textContent = String(t)),
    e.appendChild(p),
    e.appendChild(document.createTextNode(" ")),
    e.appendChild(document.createTextNode("out of")),
    e.appendChild(document.createTextNode(" ")));
  let m = document.createElement("b");
  ((m.textContent = String(n)),
    e.appendChild(m),
    e.appendChild(document.createTextNode(" ")),
    e.appendChild(document.createTextNode("correct.")));
}
function A() {
  let e = document.getElementById("behavioursquizPage");
  if (!e || (S(), e.dataset.built === "1")) return;
  e.dataset.built = "1";
  let t = ["A", "B", "C", "D"],
    n = [
      {
        q: "1. This 2 year old child is visually impaired. What characteristic behaviour of visual impairment is she displaying ?",
        img: "/images/quiz/workshop/childhood/vi1.png",
        options: [
          "Not fixing & following",
          "Light Staring",
          "Eye Poking",
          "Closing rye to bright light",
        ],
        answer: 1,
      },
      {
        q: "2. This 3 year old child is visually impaired. What characteristic behaviour of visual impairment is he displaying ?",
        img: "/images/quiz/workshop/childhood/vi2.png",
        options: [
          "Squeezing eyes to light",
          "Light Staring",
          "Eye Poking",
          "Not fixing & following",
        ],
        answer: 3,
      },
      {
        q: "3. This 2 year old child is visually impaired. What characteristic behaviour of visual impairment is he displaying ?",
        img: "/images/quiz/workshop/childhood/vi3.png",
        options: [
          "Not fixing & following",
          "Light Staring",
          "Eye Poking",
          "Closing Eyes to Bright Light",
        ],
        answer: 2,
      },
      {
        q: "4. This child cannot fix on faces and return a silent smile. Based on your observations what answer below most likely describes the reason for the poor vision?",
        img: "/images/quiz/workshop/childhood/vi4.png",
        options: [
          "Congenital Glaucoma & Cataract",
          "Retinoblastoma & Glaucoma",
          "Cataract & Cerebral Visual Impairment",
          "Refractive error & cataract",
        ],
        answer: 2,
      },
      {
        q: "5. This child cannot fix on faces and return a silent smile. Based on your observations what answer below most likely describes the reason for the poor vision?",
        img: "/images/quiz/workshop/childhood/vi5.png",
        options: [
          "Congenital Glaucoma",
          "Congenital Cataract",
          "Refractive error",
          "Cerebral Visual Impairment",
        ],
        answer: 3,
      },
      {
        q: "6. This is the left eye of a child with Nystagmus and visual impairment. Both eyes are affected in the same way. Based on your observations what answer below most likely describes the reason for the poor vision?",
        img: "/images/quiz/workshop/childhood/vi6.png",
        options: [
          "Congenital Glaucoma & Cataract",
          "Retinoblastoma & Glaucoma",
          "Cataract & Cerebral Visual Impairment",
          "Corneal scar & cataract",
        ],
        answer: 3,
      },
      {
        q: "7. This child has two conditions. Based on your observations what answer below most likely describes the conditions?",
        img: "/images/quiz/workshop/childhood/vi7.jpg",
        options: [
          "Congenital Glaucoma & Cataract",
          "Cataract & Squint",
          "Cataract & Cerebral Visual Impairment",
          "Corneal scar & cataract",
        ],
        answer: 1,
      },
    ],
    p = document.getElementById("behavioursQuizLayoutTemplate"),
    m = document.getElementById("behavioursQuizBlockTemplate"),
    f = document.getElementById("behavioursQuizOptionTemplate");
  if (!p || !m || !f) return;
  let g = T(e);
  ((e.textContent = ""),
    g && e.appendChild(g),
    e.appendChild(p.content.cloneNode(!0)));
  let u = e.querySelector("#behavioursQuizForm");
  if (!u) return;
  let x = () => {
    let c =
      (n.reduce((o, s, r) => {
        let l = u.querySelector(`input[name="q${r}"]:checked`);
        return o + (l ? 1 : 0);
      }, 0) /
        n.length) *
      90;
    v("behavioursquizPage", c);
  };
  (n.forEach((i, c) => {
    let o = m.content.querySelector(".quiz-block").cloneNode(!0),
      s = t[i.answer] || "";
    N(o, c);
    let r = o.querySelector(".quiz-question");
    r && (r.textContent = i.q);
    let l = o.querySelector(".quiz-image");
    l && (l.src = i.img);
    let d = o.querySelector(".quiz-options");
    d &&
      i.options.forEach((C, a) => {
        let h = f.content.querySelector(".radio-label").cloneNode(!0),
          b = h.querySelector("input");
        b && ((b.type = "radio"), (b.name = `q${c}`), (b.value = String(a)));
        let q = h.querySelector(".quiz-option-text");
        (q &&
          ((q.textContent = ""),
          q.appendChild(document.createTextNode(`${t[a]}. `)),
          q.appendChild(document.createTextNode(C))),
          d.appendChild(h));
      });
    let y = o.querySelector(".answer");
    (y && B(y, s, i.options[i.answer]), u.appendChild(o), w(o));
  }),
    u.addEventListener("change", (i) => {
      i.target instanceof HTMLInputElement && i.target.type === "radio" && x();
    }),
    u.addEventListener("submit", (i) => {
      i.preventDefault();
      let c = 0;
      n.forEach((s, r) => {
        let l = u.querySelectorAll(`input[name="q${r}"]`),
          d = null;
        l.forEach((a) => {
          ((a.disabled = !0), a.checked && (d = Number(a.value)));
        });
        let y = l[0]?.closest(".quiz-block");
        if (!y) return;
        let C = y.querySelectorAll("label");
        (C.forEach((a) => a.classList.remove("correct", "wrong")),
          C.forEach((a) => {
            let h = Number(a.querySelector("input")?.value);
            h === s.answer
              ? a.classList.add("correct")
              : h === d && a.classList.add("wrong");
          }),
          d === s.answer && (c += 1));
      });
      let o = e.querySelector("#behavioursQuizScoreText");
      if (o) {
        o.textContent = "";
        let s = document.createElement("span");
        (I(s, c, n.length),
          o.appendChild(s),
          o.appendChild(document.createElement("br")));
        let r = document.createElement("small");
        ((r.className = "quiz-hint"),
          (r.textContent = "Answers are highlighted in green."),
          o.appendChild(r),
          w(o));
      }
      (v("behavioursquizPage", 100),
        e.querySelector("#behavioursQuizModal").classList.remove("hidden"));
    }),
    e.querySelector("#behavioursSeeWhyBtn").addEventListener("click", () => {
      (e.querySelector("#behavioursQuizModal").classList.add("hidden"),
        e
          .querySelectorAll(".answer")
          .forEach((i) => (i.style.display = "block")));
    }),
    w(e),
    k(e));
}
export { A as initializeBehavioursQuiz };
