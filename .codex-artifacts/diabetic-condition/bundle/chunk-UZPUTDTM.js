import { c as D } from "./chunk-KIQ7J7XB.js";
var k = [
    "symmetrical brightness in colour",
    "asymmetrical. difference in colours and the brightness",
    "loss of reflex",
    "partial loss of reflex in on eye",
    "healthy reflex",
  ],
  c = [
    {
      normal: "No",
      signs: [1, 2],
      requireAllSigns: !0,
      explanation:
        "The reflex is absent in one eye, making the two reflexes asymmetrical. Select both asymmetry and loss of reflex for full credit; either finding alone earns half credit.",
    },
    {
      normal: "Yes",
      signs: [0, 4],
      explanation:
        "Both eyes show symmetrical colour and brightness: a healthy reflex. Both \u2018symmetrical brightness in colour\u2019 and \u2018healthy reflex\u2019 are accepted.",
    },
    {
      normal: "No",
      signs: [1],
      explanation:
        "The two reflexes differ in colour and brightness. The matching video labels this asymmetry as abnormal.",
    },
    {
      normal: "No",
      signs: [1, 3],
      requireAllSigns: !0,
      explanation:
        "The reflex is largely absent in one eye, with only a small residual reflex visible. Select both asymmetry and partial loss of reflex for full credit; either finding alone earns half credit.",
    },
    {
      normal: "No",
      signs: [1],
      explanation:
        "One reflex is red and brighter; the other is a different colour and brightness. The video shows this asymmetry as an abnormal finding.",
    },
  ];
function Y() {
  let i = document.getElementById("fundalReflexQuizPage");
  if (!i || i.dataset.wired === "1") return;
  i.dataset.wired = "1";
  let q = i.querySelector("#frqQuestions"),
    p = i.querySelector("#frqSubmit"),
    L = i.querySelector("#frqRestart"),
    S = i.querySelector("#frqResults"),
    P = i.querySelector("#frqSeeWhy"),
    v = i.querySelector("#frqStatus"),
    h = c.map(() => ({ normal: null, signs: [] })),
    w = !1,
    f = !1,
    d = null;
  function $() {
    let e = h.filter((t) => t.normal !== null && t.signs.length > 0).length;
    ((i.querySelector("#frqProgress").textContent =
      `${e} / ${c.length} answered`),
      (p.disabled = e !== c.length || f),
      (v.textContent =
        e === c.length
          ? ""
          : "Answer both columns in all five questions to submit."),
      (v.hidden = e === c.length));
  }
  function T(e) {
    let t = h[Number(e.dataset.index)];
    ((t.normal =
      e.querySelector('.frq-zone[data-field="normal"] .frq-chip')?.dataset
        .value ?? null),
      (t.signs = [
        ...e.querySelectorAll('.frq-zone[data-field="sign"] .frq-chip'),
      ].map((r) => Number(r.dataset.value))),
      e.querySelectorAll(".frq-zone").forEach((r) => {
        r.querySelector(".frq-placeholder").hidden =
          !!r.querySelector(".frq-chip");
      }),
      $());
  }
  function b(e) {
    if (f) return;
    let t = e.closest(".frq-card"),
      r = t.querySelector(`.frq-bank[data-field="${e.dataset.field}"]`),
      n = [...r.children].find(
        (l) => Number(l.dataset.order) > Number(e.dataset.order),
      );
    (r.insertBefore(e, n || null), T(t));
  }
  function A(e, t) {
    if (
      f ||
      e.dataset.field !== t.dataset.field ||
      e.closest(".frq-card") !== t.closest(".frq-card")
    )
      return;
    let r = t.closest(".frq-card"),
      n = e.dataset.field,
      l = t.querySelector(".frq-chip");
    t.contains(e) ||
      (n === "normal" && l && b(l),
      (t.querySelector(".frq-placeholder").hidden = !0),
      t.append(e),
      T(r));
  }
  function R(e, t) {
    let r = null,
      n = !1,
      l = t.querySelector(`.frq-zone[data-field="${e.dataset.field}"]`);
    (e.addEventListener("click", (s) => {
      if (n && s.detail !== 0) {
        n = !1;
        return;
      }
      l.contains(e) ? b(e) : A(e, l);
    }),
      e.addEventListener("dragstart", (s) => {
        if (f) {
          s.preventDefault();
          return;
        }
        ((d = e),
          s.dataTransfer.setData("text/plain", e.id),
          (s.dataTransfer.effectAllowed = "move"));
      }),
      e.addEventListener("dragend", () => {
        ((d = null),
          i
            .querySelectorAll(".is-over")
            .forEach((s) => s.classList.remove("is-over")));
      }),
      e.addEventListener("pointerdown", (s) => {
        ((n = !1),
          !(f || s.pointerType === "mouse" || !s.isPrimary) &&
            ((r = { id: s.pointerId, x: s.clientX, y: s.clientY, ghost: null }),
            e.setPointerCapture(s.pointerId)));
      }),
      e.addEventListener("pointermove", (s) => {
        !r ||
          r.id !== s.pointerId ||
          (!r.ghost && Math.hypot(s.clientX - r.x, s.clientY - r.y) < 6) ||
          (r.ghost ||
            ((r.ghost = e.cloneNode(!0)),
            r.ghost.removeAttribute("id"),
            r.ghost.setAttribute("aria-hidden", "true"),
            r.ghost.classList.add("frq-ghost"),
            (r.ghost.style.width = `${e.getBoundingClientRect().width}px`),
            i.append(r.ghost)),
          (r.ghost.style.left = `${s.clientX - 30}px`),
          (r.ghost.style.top = `${s.clientY - 20}px`),
          l.classList.toggle(
            "is-over",
            l.contains(document.elementFromPoint(s.clientX, s.clientY)),
          ));
      }));
    function o(s, u = !1) {
      if (!r || r.id !== s.pointerId) return;
      let m = !!r.ghost;
      if (
        (r.ghost?.remove(),
        l.classList.remove("is-over"),
        (r = null),
        e.hasPointerCapture(s.pointerId) &&
          e.releasePointerCapture(s.pointerId),
        m)
      ) {
        n = !0;
        let a = document.elementFromPoint(s.clientX, s.clientY);
        !u && l.contains(a)
          ? A(e, l)
          : !u &&
            a &&
            l.contains(e) &&
            !t.querySelector(".frq-chart").contains(a) &&
            b(e);
      }
    }
    (e.addEventListener("pointerup", (s) => o(s)),
      e.addEventListener("pointercancel", (s) => o(s, !0)),
      e.addEventListener("lostpointercapture", (s) => o(s, !0)));
  }
  c.forEach((e, t) => {
    let r = i
      .querySelector("#frqCardTemplate")
      .content.firstElementChild.cloneNode(!0);
    ((r.dataset.index = String(t)),
      (r.querySelector(".frq-number").textContent = String(t + 1)),
      r
        .querySelector(".frq-number")
        .setAttribute("aria-label", `Question ${t + 1}`),
      (r.querySelector("caption").textContent = `Question ${t + 1} answers`));
    let n = r.querySelector(".frq-image");
    ((n.src = `/images/quiz/fundal-reflex/case-${t + 1}.webp`),
      (n.alt = `Fundal reflex photograph for question ${t + 1}`));
    for (let [l, o] of [
      ["normal", ["Yes", "No"]],
      ["sign", k],
    ]) {
      let s = r.querySelector(`.frq-bank[data-field="${l}"]`);
      o.forEach((u, m) => {
        let a = document.createElement("button");
        ((a.type = "button"),
          (a.className = "frq-chip"),
          (a.id = `frq-${t}-${l}-${m}`),
          (a.dataset.field = l),
          (a.dataset.order = String(m)),
          (a.dataset.value = l === "normal" ? u : String(m)),
          (a.textContent = u),
          (a.draggable = !0),
          R(a, r),
          s.append(a));
      });
    }
    (r.querySelectorAll(".frq-zone").forEach((l) => {
      (l.addEventListener("dragover", (o) => {
        !f &&
          d?.closest(".frq-card") === r &&
          d.dataset.field === l.dataset.field &&
          (o.preventDefault(),
          (o.dataTransfer.dropEffect = "move"),
          l.classList.add("is-over"));
      }),
        l.addEventListener("dragleave", () => l.classList.remove("is-over")),
        l.addEventListener("drop", (o) => {
          (o.preventDefault(),
            l.classList.remove("is-over"),
            d?.closest(".frq-card") === r &&
              d.dataset.field === l.dataset.field &&
              (A(d, l), (d = null)));
        }));
    }),
      q.append(r));
  });
  let E = new AbortController();
  (window.addEventListener(
    "page:loaded",
    () => {
      i.isConnected || E.abort();
    },
    { signal: E.signal },
  ),
    document.addEventListener(
      "dragover",
      (e) => {
        !f && d?.closest(".frq-zone") && e.preventDefault();
      },
      { signal: E.signal },
    ),
    document.addEventListener(
      "drop",
      (e) => {
        if (!d || f) return;
        let t = d.closest(".frq-chart");
        (t && !t.contains(e.target) && (e.preventDefault(), b(d)), (d = null));
      },
      { signal: E.signal },
    ));
  function I(e) {
    let t = c[e],
      r = h[e].signs,
      n = h[e].normal === t.normal,
      o =
        r.length > 0 && r.every((s) => t.signs.includes(s))
          ? t.requireAllSigns
            ? r.length / t.signs.length
            : 1
          : 0;
    return { normal: n, signScore: o, score: n ? o : 0 };
  }
  p.addEventListener("click", () => {
    if (f || h.some((n) => n.normal === null || !n.signs.length)) return;
    ((f = !0), D("fundalReflexQuizPage", 100), (p.disabled = !0));
    let e = c.map((n, l) => I(l).score),
      t = i.querySelector("#frqScore");
    (t.replaceChildren(),
      [
        [e.filter((n) => n === 1).length, "correct", "is-correct"],
        [e.filter((n) => n === 0.5).length, "partly correct", "is-partial"],
        [e.filter((n) => n === 0).length, "incorrect", "is-incorrect"],
      ]
        .filter(([n, , l]) => l !== "is-partial" || n > 0)
        .forEach(([n, l, o], s) => {
          s && t.append(document.createTextNode(" \xB7 "));
          let u = document.createElement("span");
          ((u.className = o), (u.textContent = `${n} ${l}`), t.append(u));
        }),
      t.append(document.createTextNode(` out of ${c.length} questions.`)),
      (i.querySelector("#frqPoints").textContent =
        `Score: ${e.reduce((n, l) => n + l, 0)} / ${c.length}`),
      S.showModal(),
      P.focus());
  });
  function B() {
    if (w || !f) return;
    ((w = !0),
      q.querySelectorAll(".frq-card").forEach((t, r) => {
        let n = I(r),
          l =
            n.score === 1
              ? "is-correct"
              : n.score === 0.5
                ? "is-partial"
                : "is-incorrect";
        (t.querySelector(".frq-result").classList.add(l),
          (t.querySelector(".frq-result").textContent =
            n.score === 1
              ? "\u2713 Correct"
              : n.score === 0.5
                ? "\u25B3 Partly correct (\xBD)"
                : "\u2715 Incorrect"),
          t.querySelectorAll(".frq-chip").forEach((g) => {
            ((g.disabled = !0), (g.draggable = !1));
          }),
          t.querySelectorAll(".frq-zone").forEach((g) => {
            g.querySelectorAll(".frq-chip").forEach((y) => {
              let C =
                g.dataset.field === "normal"
                  ? n.normal
                  : c[r].signs.includes(Number(y.dataset.value));
              (y.classList.add(C ? "is-correct" : "is-incorrect"),
                (y.textContent = `${C ? "\u2713" : "\u2715"} ${y.textContent}`));
            });
          }),
          (t.querySelector(".frq-banks").hidden = !0));
        let o = t.querySelector(".frq-image");
        (o.classList.add("is-explanation"),
          (o.src = `/images/quiz/fundal-reflex/case-${r + 1}-explanation.gif`),
          (o.alt = `Animated explanation for question ${r + 1}: ${c[r].explanation}`));
        let s = t.querySelector(".frq-explanation"),
          u = document.createElement("p"),
          m = document.createElement("strong");
        m.className = l;
        for (let [g, y, C] of [
          [
            "Normal? ",
            `${c[r].normal}. `,
            n.normal ? "is-correct" : "is-incorrect",
          ],
          [
            "Clinical Sign: ",
            `${c[r].signs.map((x) => k[x]).join(c[r].requireAllSigns ? " + " : " / ")}.`,
            n.signScore === 1
              ? "is-correct"
              : n.signScore === 0.5
                ? "is-partial"
                : "is-incorrect",
          ],
        ]) {
          let x = document.createElement("span");
          ((x.className = "frq-answer-label"), (x.textContent = g));
          let N = document.createElement("span");
          ((N.className = `frq-answer-value ${C}`),
            (N.textContent = y),
            m.append(x, N));
        }
        u.append(m);
        let a = document.createElement("p");
        ((a.textContent = c[r].explanation),
          s.replaceChildren(u, a),
          (s.hidden = !1));
      }),
      (p.hidden = !0),
      (L.hidden = !1),
      (v.textContent = ""),
      (v.hidden = !0));
    let e = q.querySelector(".frq-card");
    ((e.tabIndex = -1),
      e.focus({ preventScroll: !0 }),
      e.scrollIntoView({ block: "start" }));
  }
  (P.addEventListener("click", () => S.close()),
    S.addEventListener("close", B),
    S.addEventListener("cancel", (e) => {
      (e.preventDefault(), S.close());
    }),
    L.addEventListener("click", () => {
      (h.forEach((t) => {
        ((t.normal = null), (t.signs = []));
      }),
        (w = !1),
        (f = !1),
        q.querySelectorAll(".frq-card").forEach((t, r) => {
          ((t.querySelector(".frq-result").textContent = ""),
            t
              .querySelector(".frq-result")
              .classList.remove("is-correct", "is-incorrect", "is-partial"),
            t.querySelector(".frq-image").classList.remove("is-explanation"),
            (t.querySelector(".frq-image").src =
              `/images/quiz/fundal-reflex/case-${r + 1}.webp`),
            (t.querySelector(".frq-image").alt =
              `Fundal reflex photograph for question ${r + 1}`),
            (t.querySelector(".frq-explanation").hidden = !0),
            (t.querySelector(".frq-banks").hidden = !1),
            t.querySelectorAll(".frq-chip").forEach((n) => {
              ((n.disabled = !1),
                (n.draggable = !0),
                n.classList.remove("is-correct", "is-incorrect"),
                (n.textContent =
                  n.dataset.field === "normal"
                    ? n.dataset.value
                    : k[Number(n.dataset.value)]),
                b(n));
            }),
            t.querySelectorAll(".frq-placeholder").forEach((n) => {
              n.hidden = !1;
            }));
        }),
        (p.hidden = !1),
        (L.hidden = !0),
        $(),
        q.querySelector(".frq-chip").focus({ preventScroll: !0 }),
        q.scrollIntoView({ block: "start" }));
    }),
    $());
}
export { c as a, Y as b };
