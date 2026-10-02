"use strict";
(() => {
  function Je({
    step: u,
    intervalMs: l = 100,
    requestFrame: c = (m) => window.requestAnimationFrame(m),
    cancelFrame: p = (m) => window.cancelAnimationFrame(m),
    isPaused: h = () => document.hidden,
  }) {
    let m = null,
      y = null,
      g = !1;
    function M(v) {
      g &&
        (h()
          ? (y = null)
          : y === null
            ? (y = v)
            : v - y >= l && (u(l), (y = v - ((v - y) % l))),
        (m = c(M)));
    }
    return {
      start() {
        g || ((g = !0), (y = null), (m = c(M)));
      },
      stop() {
        ((g = !1), (y = null), m !== null && p(m), (m = null));
      },
      resetClock() {
        y = null;
      },
      isRunning() {
        return g;
      },
    };
  }
  var vt = Object.freeze({ correctToleranceMmHg: 2, closeToleranceMmHg: 3 }),
    we = Object.freeze([
      { id: "very_below_20", label: "<16", min: 10, max: 15 },
      { id: "just_below_20", label: "16-19", min: 16, max: 19 },
      { id: "exactly_20", label: "20", min: 20, max: 20 },
      { id: "range_21_24", label: "21-24", min: 21, max: 24 },
      { id: "exactly_25", label: "25", min: 25, max: 25 },
      { id: "range_26_29", label: "26-29", min: 26, max: 29 },
      { id: "exactly_30", label: "30", min: 30, max: 30 },
      { id: "above_30_bit", label: "31-34", min: 31, max: 34 },
      { id: "well_above", label: "35+", min: 35, max: 50 },
    ]);
  function Me(u, l, c) {
    let p = Math.max(1, Math.floor(c)),
      h = l - u + 1,
      m = Math.floor(h / p),
      y = h % p,
      g = u,
      M = [];
    for (let v = 0; v < p; v += 1) {
      let G = m + (y > 0 ? 1 : 0),
        A = g,
        $ = g + G - 1;
      (M.push({ min: A, max: $ }), (g = $ + 1), y > 0 && (y -= 1));
    }
    return M;
  }
  function Re(u, l = Math.random) {
    let c = Math.min(...u),
      p = [];
    return (
      u.forEach((h, m) => {
        h === c && p.push(m);
      }),
      p[Math.floor(l() * p.length)]
    );
  }
  function Fe(u, l, c = Math.random) {
    let p = u.max - u.min + 1,
      h = u.min + Math.floor(c() * p);
    if (p <= 1) return h;
    for (let m = 0; m < 4 && h === l; m += 1) h = u.min + Math.floor(c() * p);
    return h;
  }
  function Ze(u, l = we) {
    var c;
    return (c = l.find((p) => u >= p.min && u <= p.max)) != null
      ? c
      : l[l.length - 1];
  }
  function It(u, l = we) {
    var c;
    return (c = l.find((p) => p.id === u)) != null ? c : null;
  }
  function bt(u, l, c = we) {
    let p = It(l, c);
    return p ? (u < p.min ? p.min - u : u > p.max ? u - p.max : 0) : null;
  }
  function et(u, l, c = vt, p = we) {
    let h = bt(u, l, p);
    return {
      errorMmHg: h,
      isCorrect: typeof h == "number" && h <= c.correctToleranceMmHg,
      isClose: typeof h == "number" && h === c.closeToleranceMmHg,
    };
  }
  function tt({
    isCentered: u,
    isInnerEdgeTouching: l,
    hasUserAdjusted: c,
    lockMs: p,
    requiredLockMs: h,
    lockDecayFactor: m,
    centerError: y,
    centerTolerancePx: g,
    centerToleranceHoldMultiplier: M,
    edgeError: v,
    innerEdgeTolerancePx: G,
    innerEdgeHoldMultiplier: A,
    dtMs: $,
  }) {
    let Q = g * M,
      L = G * A,
      S = u ? y <= Q : y <= g,
      T = l ? v <= L : v <= G,
      N = S && T,
      k = p,
      O = !1;
    if (!c) k = 0;
    else if (N) ((k += $), k >= h && ((k = h), (O = !0)));
    else {
      let F = y <= Q * 1.25 && v <= L * 1.25;
      k = k > 0 && F ? Math.max(0, k - $ * m) : 0;
    }
    return { isCentered: S, isInnerEdgeTouching: T, isRevealed: O, lockMs: k };
  }
  function nt() {
    let u = document.getElementById("mires"),
      l = document.getElementById("blueCircle"),
      c = document.getElementById("toggleButton"),
      p = document.querySelector(".semi-circle.top"),
      h = document.querySelector(".semi-circle.bottom"),
      m = document.getElementById("jitterSlider"),
      y = document.getElementById("jitterValue"),
      g = document.getElementById("suddenSlider"),
      M = document.getElementById("suddenValue"),
      v = document.getElementById("driftSlider"),
      G = document.getElementById("driftValue"),
      A = document.getElementById("thicknessSlider"),
      $ = document.getElementById("thicknessValue"),
      Q = document.getElementById("separationControlRow"),
      L = document.getElementById("separationSlider"),
      S = document.getElementById("zoomSlider"),
      T = document.getElementById("resetControlsButton"),
      N = document.getElementById("appBar"),
      k = document.getElementById("gameArea"),
      O = document.getElementById("controlDock"),
      F = document.getElementById("advancedControls"),
      U = document.getElementById("advancedMotionButton"),
      r = document.getElementById("newtonPanelToggle"),
      J = document.getElementById("newtonPanelClose"),
      b = document.getElementById("newtonPanel"),
      H = document.getElementById("newtonStatus"),
      oe = document.getElementById("newtonResult"),
      Z = Array.from(document.querySelectorAll("[data-newton-point]")),
      V = Array.from(document.querySelectorAll("[data-newton-guess]")),
      ge = document.getElementById("newtonNewCaseButton"),
      se = document.getElementById("newtonSubmitButton"),
      P = document.getElementById("casePanelToggle"),
      ee = document.getElementById("casePanelClose"),
      E = document.getElementById("casePanel"),
      q = document.getElementById("iopValue"),
      te = document.getElementById("caseStatus"),
      ne = document.getElementById("centerStatus"),
      z = document.getElementById("edgeStatus"),
      xe = document.getElementById("caseTierGroup"),
      ye = document.getElementById("caseRangeHint"),
      ve = Array.from(document.querySelectorAll("[data-case-tier]")),
      ue = document.getElementById("newCaseButton");
    if (
      !u ||
      !l ||
      !c ||
      !p ||
      !h ||
      !m ||
      !y ||
      !g ||
      !M ||
      !v ||
      !G ||
      !A ||
      !$ ||
      !k ||
      !L ||
      !S ||
      !T
    )
      return;
    let f = Object.freeze({
        positionTop: 0,
        positionLeft: 0,
        separation: parseFloat(L.value),
        minSeparation: parseFloat(L.min),
        maxSeparation: parseFloat(L.max),
        isBlueLightOn: !0,
        scale: parseFloat(S.value),
        jitterFactor: parseFloat(m.value),
        suddenFactor: parseFloat(g.value),
        driftFactor: parseFloat(v.value),
        thickness: parseFloat(A.value),
      }),
      t = {
        miresPosition: { top: f.positionTop, left: f.positionLeft },
        separation: f.separation,
        minSeparation: f.minSeparation,
        maxSeparation: f.maxSeparation,
        isBlueLightOn: f.isBlueLightOn,
        scale: f.scale,
        jitterFactor: f.jitterFactor,
        suddenFactor: f.suddenFactor,
        driftFactor: f.driftFactor,
      },
      n = Object.freeze({ VARIABLE: "variable", NEWTON: "newton" }),
      s = n.VARIABLE,
      i = {
        activeTier: "primary",
        targetIop: 20,
        isRevealed: !1,
        isCentered: !1,
        isInnerEdgeTouching: !1,
        hasUserAdjusted: !1,
        pendingRevealFlash: !1,
        lockMs: 0,
        requiredLockMs: 700,
        centerToleranceRatio: 0.15,
        centerToleranceHoldMultiplier: 1.35,
        innerEdgeTolerancePx: 3.2,
        innerEdgeHoldMultiplier: 1.35,
        pxPerMmHg: 1.15,
        mireDiameterPx: 100,
        lockDecayFactor: 0.45,
      },
      a = {
        minIop: 10,
        maxIop: 50,
        targetIop: 23,
        selectedPoint: 20,
        selectedGuess: null,
        isRevealed: !1,
        lastErrorMmHg: null,
        lastIsCorrect: null,
        lastIsClose: null,
        pxPerMmHg: 2.05,
      },
      x = Object.freeze({
        primary: { label: "Primary", minIop: 10, maxIop: 30 },
        intermediate: { label: "Intermediate", minIop: 8, maxIop: 40 },
        advanced: { label: "Advanced", minIop: 8, maxIop: 60 },
      }),
      I = {
        caseUsageByTier: {
          primary: [0, 0, 0],
          intermediate: [0, 0, 0],
          advanced: [0, 0, 0],
        },
        lastCaseIopByTier: {
          primary: null,
          intermediate: null,
          advanced: null,
        },
        newtonUsage: [0, 0, 0, 0],
        lastNewtonIop: null,
      };
    function C() {
      var e;
      return (e = x[i.activeTier]) != null ? e : x.primary;
    }
    function R() {
      var de;
      let e = i.activeTier,
        o = C(),
        d = (de = I.caseUsageByTier[e]) != null ? de : [0, 0, 0],
        w = Me(o.minIop, o.maxIop, d.length),
        B = Re(d),
        j = w[B],
        W = Fe(j, I.lastCaseIopByTier[e]);
      return (
        (d[B] += 1),
        (I.caseUsageByTier[e] = d),
        (I.lastCaseIopByTier[e] = W),
        W
      );
    }
    function _() {
      let e = I.newtonUsage,
        o = Me(a.minIop, a.maxIop, e.length),
        d = Re(e),
        w = o[d],
        B = Fe(w, I.lastNewtonIop);
      return ((e[d] += 1), (I.newtonUsage = e), (I.lastNewtonIop = B), B);
    }
    function Y() {
      return s === n.NEWTON ? a.targetIop : i.targetIop;
    }
    function K() {
      return s === n.NEWTON ? a.selectedPoint : t.separation;
    }
    function Se() {
      let e = parseFloat(A.value) || f.thickness;
      return (i.mireDiameterPx - e) / 2;
    }
    function Ne() {
      let e = K() - Y(),
        o = s === n.NEWTON ? a.pxPerMmHg : i.pxPerMmHg;
      return Se() + e * o;
    }
    function ae(e, o) {
      e && e.textContent !== o && (e.textContent = o);
    }
    function qe() {
      if (!(!E || !q || !te)) {
        if (
          (E.classList.toggle("is-revealed", i.isRevealed), ke(), i.isRevealed)
        ) {
          ((q.textContent = `IOP: ${i.targetIop} mmHg`),
            i.pendingRevealFlash && (ct(), (i.pendingRevealFlash = !1)),
            ne && z
              ? (ae(ne, "Case completed"),
                ae(z, "IOP shown \u2014 New Case to retry"))
              : ae(te, "Solved. Tap New Case."));
          return;
        }
        if (((q.textContent = "IOP: Hidden"), ne && z)) {
          let e = i.isCentered ? "Centre OK" : "Centre adjust",
            o = i.isInnerEdgeTouching ? "Touch OK" : "Touch: adjust separation";
          (i.lockMs > 0 &&
            i.isCentered &&
            i.isInnerEdgeTouching &&
            (o = "Touch steady, hold"),
            ae(ne, e),
            ae(z, o));
          return;
        }
        ae(te, "Centre + touch inner edges.");
      }
    }
    function ke() {
      let e = C();
      (ye && (ye.textContent = `${e.minIop}-${e.maxIop} mmHg`),
        xe && (xe.dataset.activeTier = i.activeTier),
        ve.forEach((o) => {
          let d = o.dataset.caseTier === i.activeTier;
          (o.classList.toggle("is-active", d),
            o.setAttribute("aria-pressed", String(d)));
        }));
    }
    function at(e) {
      x[e] && ((i.activeTier = e), ke(), Te());
    }
    function Le(e) {
      s = e;
      let o = s === n.NEWTON;
      (Q && (Q.hidden = o), (L.disabled = o), D());
    }
    function me() {
      if (
        (Z.forEach((e) => {
          let d = Number(e.dataset.newtonPoint || 20) === a.selectedPoint;
          (e.classList.toggle("is-active", d),
            e.setAttribute("aria-pressed", String(d)),
            (e.disabled = a.isRevealed),
            e.setAttribute("aria-disabled", String(a.isRevealed)));
        }),
        V.forEach((e) => {
          let d = (e.dataset.newtonGuess || "") === a.selectedGuess;
          (e.classList.toggle("is-active", d),
            e.setAttribute("aria-pressed", String(d)),
            (e.disabled = a.isRevealed),
            e.setAttribute("aria-disabled", String(a.isRevealed)));
        }),
        se && (se.disabled = a.isRevealed || !a.selectedGuess),
        H && (H.textContent = "Estimate closest IOP."),
        oe)
      )
        if (a.isRevealed) {
          let e = Ze(a.targetIop),
            o = "Recheck",
            d = "is-recheck";
          a.lastIsCorrect
            ? ((o = a.lastErrorMmHg === 0 ? "Correct" : "Within tolerance"),
              (d = "is-correct"))
            : a.lastIsClose && ((o = "Close"), (d = "is-close"));
          let w = document.createElement("span");
          ((w.className = `newton-outcome${d ? ` ${d}` : ""}`),
            (w.textContent = o));
          let B = document.createElement("span");
          ((B.className = "newton-result-detail"),
            (B.textContent = `Actual: ${a.targetIop} mmHg (${e.label})`),
            oe.replaceChildren(w, B));
        } else oe.replaceChildren();
    }
    function je() {
      ((a.targetIop = _()),
        (a.selectedGuess = null),
        (a.isRevealed = !1),
        (a.lastErrorMmHg = null),
        (a.lastIsCorrect = null),
        (a.lastIsClose = null),
        me(),
        D());
    }
    function rt() {
      if (a.isRevealed || !a.selectedGuess || !oe) return;
      let e = et(a.targetIop, a.selectedGuess);
      ((a.isRevealed = !0),
        (a.lastErrorMmHg = e.errorMmHg),
        (a.lastIsCorrect = e.isCorrect),
        (a.lastIsClose = e.isClose),
        me());
    }
    function ct() {
      q &&
        (q.classList.remove("flash-reveal"),
        q.offsetWidth,
        q.classList.add("flash-reveal"),
        q.addEventListener(
          "animationend",
          () => {
            q.classList.remove("flash-reveal");
          },
          { once: !0 },
        ));
    }
    function Te(e = null) {
      let o = C();
      (typeof e == "number"
        ? (i.targetIop = Math.max(o.minIop, Math.min(o.maxIop, Math.round(e))))
        : (i.targetIop = R()),
        (i.isRevealed = !1),
        (i.isCentered = !1),
        (i.isInnerEdgeTouching = !1),
        (i.hasUserAdjusted = !1),
        (i.pendingRevealFlash = !1),
        (i.lockMs = 0),
        q && q.classList.remove("flash-reveal"),
        D(),
        qe());
    }
    function lt() {
      let e = l.getBoundingClientRect(),
        o = Math.min(e.width, e.height) / 2;
      return Math.max(10, o * i.centerToleranceRatio);
    }
    function dt() {
      let e = Ne(),
        o = i.mireDiameterPx - 2 * Math.abs(e),
        d = parseFloat(A.value) || f.thickness;
      return o - d;
    }
    function $e(e) {
      if (s !== n.VARIABLE || i.isRevealed) return;
      let o = lt(),
        d = Math.max(
          Math.abs(t.miresPosition.left),
          Math.abs(t.miresPosition.top),
        ),
        w = dt(),
        B = Math.abs(w),
        j = tt({
          isCentered: i.isCentered,
          isInnerEdgeTouching: i.isInnerEdgeTouching,
          hasUserAdjusted: i.hasUserAdjusted,
          lockMs: i.lockMs,
          requiredLockMs: i.requiredLockMs,
          lockDecayFactor: i.lockDecayFactor,
          centerError: d,
          centerTolerancePx: o,
          centerToleranceHoldMultiplier: i.centerToleranceHoldMultiplier,
          edgeError: B,
          innerEdgeTolerancePx: i.innerEdgeTolerancePx,
          innerEdgeHoldMultiplier: i.innerEdgeHoldMultiplier,
          dtMs: e,
        });
      ((i.isCentered = j.isCentered),
        (i.isInnerEdgeTouching = j.isInnerEdgeTouching),
        (i.lockMs = j.lockMs),
        j.isRevealed && ((i.isRevealed = !0), (i.pendingRevealFlash = !0)),
        qe());
    }
    function re() {
      u.style.transform = `translate(${t.miresPosition.left}px, ${t.miresPosition.top}px) scale(${t.scale})`;
    }
    function X() {
      s === n.VARIABLE && (i.hasUserAdjusted = !0);
    }
    function Ie(e) {
      E &&
        (e && (pe(!1), Le(n.VARIABLE)),
        E.classList.toggle("is-open", e),
        P &&
          (P.classList.toggle("is-panel-open", e),
          P.setAttribute("aria-expanded", String(e))),
        Oe(),
        (E.inert = !e),
        e
          ? ee == null || ee.focus({ preventScroll: !0 })
          : E.contains(document.activeElement) &&
            (P == null || P.focus({ preventScroll: !0 })),
        window.requestAnimationFrame(ce));
    }
    function pe(e) {
      b &&
        (e
          ? (E && (E.classList.remove("is-open"), (E.inert = !0)),
            P &&
              (P.classList.remove("is-panel-open"),
              P.setAttribute("aria-expanded", "false")),
            Le(n.NEWTON))
          : Le(n.VARIABLE),
        b.classList.toggle("is-open", e),
        r &&
          (r.classList.toggle("is-panel-open", e),
          r.setAttribute("aria-expanded", String(e))),
        Oe(),
        (b.inert = !e),
        e
          ? J == null || J.focus({ preventScroll: !0 })
          : b.contains(document.activeElement) &&
            (r == null || r.focus({ preventScroll: !0 })),
        window.requestAnimationFrame(ce));
    }
    function Oe() {
      var d, w;
      let e =
          (d = E == null ? void 0 : E.classList.contains("is-open")) != null
            ? d
            : !1,
        o =
          (w = b == null ? void 0 : b.classList.contains("is-open")) != null
            ? w
            : !1;
      (P && P.classList.toggle("is-hidden-for-other-open", o),
        r && r.classList.toggle("is-hidden-for-other-open", e));
    }
    function Ge(e) {
      !F ||
        !U ||
        ((F.hidden = !e),
        U.setAttribute("aria-expanded", String(e)),
        window.requestAnimationFrame(ce));
    }
    function ce() {
      var Ke, Xe;
      if (!N || !k || !O) return;
      let e = N.getBoundingClientRect(),
        o = k.getBoundingClientRect(),
        d = O.getBoundingClientRect(),
        w =
          (Ke = E == null ? void 0 : E.classList.contains("is-open")) != null
            ? Ke
            : !1,
        B =
          (Xe = b == null ? void 0 : b.classList.contains("is-open")) != null
            ? Xe
            : !1,
        j = e.bottom + 30;
      (w && E && (j = Math.max(j, E.getBoundingClientRect().bottom + 14)),
        B && b && (j = Math.max(j, b.getBoundingClientRect().bottom + 14)));
      let W = (j + d.top) / 2,
        de = o.top + o.height / 2,
        Be = W - de,
        Ae = Math.max(-260, Math.min(w || B ? 220 : 80, Be));
      k.style.setProperty("--field-offset-y", `${Ae.toFixed(1)}px`);
    }
    function fe() {
      S.value = String(t.scale);
    }
    function He() {
      let e = parseFloat(A.value);
      (($.textContent = e.toFixed(0)),
        document.querySelectorAll(".semi-circle").forEach((o) => {
          o.style.strokeWidth = String(A.value);
        }));
    }
    function _e() {
      if (t.isBlueLightOn) {
        ((l.style.backgroundColor = "blue"),
          (l.style.border = "5px solid rgb(47, 255, 47)"),
          document.querySelectorAll(".semi-circle").forEach((e) => {
            ((e.style.stroke = "rgb(3, 228, 3)"),
              (e.style.fill = "rgba(3, 228, 3, 0.2)"),
              (e.style.filter = "drop-shadow(0 0 10px rgb(23, 127, 19))"));
          }),
          c.classList.remove("off"),
          c.classList.add("on"),
          (c.textContent = "Blue light + NaFl"));
        return;
      }
      ((l.style.backgroundColor = "white"),
        (l.style.border = "none"),
        document.querySelectorAll(".semi-circle").forEach((e) => {
          ((e.style.stroke = "lightgrey"),
            (e.style.fill = "rgba(211, 211, 211, 0.3)"),
            (e.style.filter = "none"));
        }),
        c.classList.remove("on"),
        c.classList.add("off"),
        (c.textContent = "Blue light + NaFl"));
    }
    function De() {
      ((t.miresPosition.top = f.positionTop),
        (t.miresPosition.left = f.positionLeft),
        (t.separation = f.separation),
        (t.scale = f.scale),
        (t.jitterFactor = f.jitterFactor),
        (t.suddenFactor = f.suddenFactor),
        (t.driftFactor = f.driftFactor),
        (t.isBlueLightOn = f.isBlueLightOn),
        (m.value = String(f.jitterFactor)),
        (g.value = String(f.suddenFactor)),
        (v.value = String(f.driftFactor)),
        (A.value = String(f.thickness)),
        (L.value = String(f.separation)),
        (S.value = String(f.scale)),
        (y.textContent = f.jitterFactor.toFixed(1)),
        (M.textContent = f.suddenFactor.toFixed(1)),
        (G.textContent = f.driftFactor.toFixed(1)),
        ($.textContent = f.thickness.toFixed(0)),
        (ie = null),
        (le = !1),
        _e(),
        He(),
        D(),
        be(),
        re(),
        fe(),
        ce());
    }
    function D() {
      let e = Ne();
      (p.setAttribute("transform", `translate(${e}, 0)`),
        h.setAttribute("transform", `translate(${-e}, 0)`),
        (L.value = String(t.separation)));
    }
    function be() {
      let e = l.getBoundingClientRect(),
        o = Math.min(e.width, e.height) / 2,
        d = Math.hypot(t.miresPosition.left, t.miresPosition.top);
      d > o &&
        ((t.miresPosition.left *= o / d), (t.miresPosition.top *= o / d));
    }
    function ut(e = 100) {
      s === n.VARIABLE &&
        ((t.separation += t.driftFactor * 0.2),
        t.separation > t.maxSeparation && (t.separation = t.maxSeparation),
        t.separation < t.minSeparation && (t.separation = t.minSeparation),
        D());
      let o = l.getBoundingClientRect(),
        d = Math.hypot(t.miresPosition.left, t.miresPosition.top),
        w = Math.max(1, o.width / 2),
        B = 5,
        W = B + (10 - B) * (d / w),
        de = (Math.random() - 0.5) * W * t.jitterFactor,
        Be = (Math.random() - 0.5) * W * t.jitterFactor;
      if (
        ((t.miresPosition.left += de),
        (t.miresPosition.top += Be),
        Math.random() < 0.1)
      ) {
        let Ye = (Math.random() - 0.5) * W * t.suddenFactor,
          Ae = (Math.random() - 0.5) * W * t.suddenFactor;
        ((t.miresPosition.left += Ye), (t.miresPosition.top += Ae));
      }
      (be(), re(), $e(e));
    }
    function mt(e) {
      var d;
      let o = e.target;
      return o instanceof Element
        ? !!(
            document.body.classList.contains("modal-open") ||
            ((d = document.getElementById("sideMenu")) != null &&
              d.classList.contains("open")) ||
            o.closest("input") ||
            o.closest("button") ||
            o.closest("textarea") ||
            o.closest("select") ||
            o.closest('[contenteditable="true"]')
          )
        : !1;
    }
    function pt(e) {
      var w;
      if (
        e.key === "Escape" &&
        !document.body.classList.contains("modal-open") &&
        !(
          (w = document.getElementById("sideMenu")) != null &&
          w.classList.contains("open")
        )
      ) {
        b != null && b.classList.contains("is-open")
          ? pe(!1)
          : E != null && E.classList.contains("is-open") && Ie(!1);
        return;
      }
      if (mt(e)) return;
      let o = e.key.toLowerCase(),
        d = 20;
      if (e.altKey)
        switch (o) {
          case "arrowup":
            ((t.jitterFactor += 0.1),
              t.jitterFactor > parseFloat(m.max) &&
                (t.jitterFactor = parseFloat(m.max)),
              (m.value = String(t.jitterFactor)),
              (y.textContent = t.jitterFactor.toFixed(1)));
            return;
          case "arrowdown":
            ((t.jitterFactor -= 0.1),
              t.jitterFactor < parseFloat(m.min) &&
                (t.jitterFactor = parseFloat(m.min)),
              (m.value = String(t.jitterFactor)),
              (y.textContent = t.jitterFactor.toFixed(1)));
            return;
          case "arrowright":
            ((t.suddenFactor += 0.1),
              t.suddenFactor > parseFloat(g.max) &&
                (t.suddenFactor = parseFloat(g.max)),
              (g.value = String(t.suddenFactor)),
              (M.textContent = t.suddenFactor.toFixed(1)));
            return;
          case "arrowleft":
            ((t.suddenFactor -= 0.1),
              t.suddenFactor < parseFloat(g.min) &&
                (t.suddenFactor = parseFloat(g.min)),
              (g.value = String(t.suddenFactor)),
              (M.textContent = t.suddenFactor.toFixed(1)));
            return;
          default:
            break;
        }
      switch (o) {
        case "arrowup":
          (X(), (t.miresPosition.top -= d));
          break;
        case "arrowdown":
          (X(), (t.miresPosition.top += d));
          break;
        case "arrowleft":
          (X(), (t.miresPosition.left -= d));
          break;
        case "arrowright":
          (X(), (t.miresPosition.left += d));
          break;
        case "r":
          if (s !== n.VARIABLE) break;
          (X(),
            (t.separation += 5),
            t.separation > t.maxSeparation && (t.separation = t.maxSeparation),
            D());
          break;
        case "f":
          if (s !== n.VARIABLE) break;
          (X(),
            (t.separation -= 5),
            t.separation < t.minSeparation && (t.separation = t.minSeparation),
            D());
          break;
        case "z":
          ((t.scale += 0.1),
            t.scale > parseFloat(S.max) && (t.scale = parseFloat(S.max)),
            fe());
          break;
        case "x":
          ((t.scale -= 0.1),
            t.scale < parseFloat(S.min) && (t.scale = parseFloat(S.min)),
            fe());
          break;
        default:
          return;
      }
      (be(), re());
    }
    (m.addEventListener("input", () => {
      ((t.jitterFactor = parseFloat(m.value)),
        (y.textContent = t.jitterFactor.toFixed(1)));
    }),
      g.addEventListener("input", () => {
        ((t.suddenFactor = parseFloat(g.value)),
          (M.textContent = t.suddenFactor.toFixed(1)));
      }),
      v.addEventListener("input", () => {
        ((t.driftFactor = parseFloat(v.value)),
          (G.textContent = t.driftFactor.toFixed(1)));
      }),
      A.addEventListener("input", () => {
        (He(), D(), $e(0));
      }),
      L.addEventListener("input", () => {
        (X(), (t.separation = parseFloat(L.value)), D());
      }),
      S.addEventListener("input", () => {
        ((t.scale = parseFloat(S.value)), fe(), re());
      }),
      c.addEventListener("click", () => {
        ((t.isBlueLightOn = !t.isBlueLightOn), _e());
      }));
    let ie = null,
      Ue = t.scale,
      Ee = 0,
      Ce = 0,
      le = !1;
    function We(e, o) {
      return Math.hypot(e.pageX - o.pageX, e.pageY - o.pageY);
    }
    function ft(e) {
      let o = e.target;
      return !!(
        !(o instanceof Element) ||
        document.body.classList.contains("modal-open") ||
        !k.contains(o) ||
        o.closest("#controlDock") ||
        o.closest("#casePanel") ||
        o.closest("#newtonPanel") ||
        o.closest("#sideMenu") ||
        o.closest("input") ||
        o.closest("button") ||
        o.closest("textarea") ||
        o.closest("select") ||
        o.closest('[contenteditable="true"]')
      );
    }
    function ht(e) {
      if (ft(e)) {
        ((le = !1), (ie = null));
        return;
      }
      if (((le = !0), e.touches.length === 2)) {
        ((ie = We(e.touches[0], e.touches[1])), (Ue = t.scale));
        return;
      }
      e.touches.length === 1 &&
        ((Ee = e.touches[0].pageX), (Ce = e.touches[0].pageY));
    }
    function gt(e) {
      if (le) {
        if (e.touches.length === 2 && ie !== null) {
          let d = We(e.touches[0], e.touches[1]) - ie;
          ((t.scale = Ue + d * 0.01),
            t.scale < parseFloat(S.min) && (t.scale = parseFloat(S.min)),
            t.scale > parseFloat(S.max) && (t.scale = parseFloat(S.max)),
            fe(),
            re());
          return;
        }
        if (e.touches.length === 1) {
          let o = e.touches[0].pageX,
            d = e.touches[0].pageY,
            w = o - Ee,
            B = d - Ce;
          (X(),
            (t.miresPosition.left += w),
            (t.miresPosition.top += B),
            (Ee = o),
            (Ce = d),
            be(),
            re());
        }
      }
    }
    function xt(e) {
      (e.touches.length < 2 && (ie = null),
        e.touches.length === 1 &&
          ((Ee = e.touches[0].pageX), (Ce = e.touches[0].pageY)),
        e.touches.length === 0 && (le = !1));
    }
    function yt() {
      ((ie = null), (le = !1));
    }
    if (
      (T.addEventListener("click", De),
      ue &&
        ue.addEventListener("click", () => {
          Te();
        }),
      P &&
        P.addEventListener("click", () => {
          let e = E == null ? void 0 : E.classList.contains("is-open");
          Ie(!e);
        }),
      ee &&
        ee.addEventListener("click", () => {
          Ie(!1);
        }),
      r &&
        r.addEventListener("click", () => {
          let e = b == null ? void 0 : b.classList.contains("is-open");
          pe(!e);
        }),
      J &&
        J.addEventListener("click", () => {
          pe(!1);
        }),
      Z.forEach((e) => {
        e.addEventListener("click", () => {
          let o = Number(e.dataset.newtonPoint || 20);
          Number.isFinite(o) && ((a.selectedPoint = o), me(), D());
        });
      }),
      V.forEach((e) => {
        e.addEventListener("click", () => {
          ((a.selectedGuess = e.dataset.newtonGuess || null), me());
        });
      }),
      ge &&
        ge.addEventListener("click", () => {
          je();
        }),
      se &&
        se.addEventListener("click", () => {
          rt();
        }),
      ve.forEach((e) => {
        e.addEventListener("click", () => {
          at(e.dataset.caseTier || "primary");
        });
      }),
      U &&
        U.addEventListener("click", () => {
          let e = U.getAttribute("aria-expanded") === "true";
          Ge(!e);
        }),
      typeof ResizeObserver == "function")
    ) {
      let e = new ResizeObserver(() => {
        ce();
      });
      (N && e.observe(N), k && e.observe(k), O && e.observe(O));
    }
    (document.addEventListener("keydown", pt),
      document.addEventListener("touchstart", ht, { passive: !0 }),
      document.addEventListener("touchmove", gt, { passive: !0 }),
      document.addEventListener("touchend", xt, { passive: !0 }),
      document.addEventListener("touchcancel", yt, { passive: !0 }),
      window.addEventListener("resize", ce));
    let he = Je({ step: ut, intervalMs: 100 }),
      Qe = () => he.resetClock(),
      Ve = () => he.stop(),
      ze = () => he.start();
    return (
      document.addEventListener("visibilitychange", Qe),
      window.addEventListener("pagehide", Ve),
      window.addEventListener("pageshow", ze),
      Ge(!1),
      Ie(!1),
      pe(!1),
      De(),
      ke(),
      me(),
      je(),
      Te(),
      he.start(),
      {
        destroy() {
          (he.stop(),
            document.removeEventListener("visibilitychange", Qe),
            window.removeEventListener("pagehide", Ve),
            window.removeEventListener("pageshow", ze));
        },
      }
    );
  }
  function Pe(u) {
    let l = [...u];
    for (let c = l.length - 1; c > 0; c -= 1) {
      let p = Math.floor(Math.random() * (c + 1));
      [l[c], l[p]] = [l[p], l[c]];
    }
    return l;
  }
  function Et(u) {
    let l = Math.max(0, Number(u) || 0),
      c = Math.floor(l / 60)
        .toString()
        .padStart(2, "0"),
      p = Math.floor(l % 60)
        .toString()
        .padStart(2, "0");
    return `${c}:${p}`;
  }
  function Ct() {
    (document.querySelectorAll(".modal.is-open").forEach((u) => {
      (u.classList.remove("is-open"), u.setAttribute("aria-hidden", "true"));
    }),
      document.body.classList.remove("modal-open"));
  }
  function it({ questionBank: u, tiers: l }) {
    let c = null,
      p = 0;
    if (
      !Array.isArray(u) ||
      u.length === 0 ||
      !Array.isArray(l) ||
      l.length === 0
    )
      return;
    let h = document.getElementById("burger-icon"),
      m = document.getElementById("sideMenu"),
      y = document.getElementById("sideMenuClose"),
      g = document.getElementById("menuBackdrop"),
      M = document.getElementById("info-icon"),
      v = document.getElementById("infoModal"),
      G = document.getElementById("closeInfoModal"),
      A = document.getElementById("testModal"),
      $ = document.getElementById("closeTestModal"),
      Q = document.getElementById("testModalTitle"),
      L = document.getElementById("mcqTimer"),
      S = document.getElementById("mcqQuestionProgress"),
      T = document.getElementById("testContainer"),
      N = document.getElementById("submitTestButton"),
      k = document.getElementById("retryTestButton"),
      O = document.getElementById("saveResultButton"),
      F = document.getElementById("testResult"),
      U = Array.from(document.querySelectorAll(".mcq-level-button"));
    if (
      !h ||
      !m ||
      !y ||
      !g ||
      !M ||
      !v ||
      !G ||
      !A ||
      !$ ||
      !Q ||
      !L ||
      !S ||
      !T ||
      !N ||
      !k ||
      !O ||
      !F ||
      U.length === 0
    )
      return;
    let r = {
      activeTierIndex: 0,
      selectedQuestions: [],
      lastResult: null,
      timerId: null,
      secondsRemaining: 0,
    };
    function J() {
      let n = !!document.querySelector(".modal.is-open");
      document.body.classList.toggle("modal-open", n);
    }
    function b(n, s) {
      var i, a;
      if (s && !n.classList.contains("is-open")) {
        let x = document.activeElement;
        c = x instanceof Element && m.contains(x) ? h : x;
      }
      (s && (H(!1), Ct()),
        n.classList.toggle("is-open", s),
        n.setAttribute("aria-hidden", s ? "false" : "true"),
        n === v && M.setAttribute("aria-expanded", String(s)),
        s && ((i = n.querySelector(".modal-content")) == null || i.focus()),
        s || (a = c == null ? void 0 : c.focus) == null || a.call(c),
        J());
    }
    function H(n) {
      var i;
      let s = m.classList.contains("open");
      (n && (c = document.activeElement),
        m.classList.toggle("open", n),
        m.setAttribute("aria-hidden", n ? "false" : "true"),
        h.setAttribute("aria-expanded", n ? "true" : "false"),
        (g.hidden = !n),
        g.classList.toggle("is-visible", n),
        m.toggleAttribute("inert", !n),
        n && y.focus(),
        !n && s && ((i = c == null ? void 0 : c.focus) == null || i.call(c)));
    }
    function oe() {
      U.forEach((n) => {
        let s = Number(n.dataset.levelIndex),
          i = l[s];
        ((n.textContent = i.name),
          n.removeAttribute("data-locked"),
          n.setAttribute("aria-disabled", "false"),
          (n.disabled = !1));
      });
    }
    function Z() {
      r.timerId !== null &&
        (window.clearInterval(r.timerId), (r.timerId = null));
    }
    function V() {
      let n = l[r.activeTierIndex];
      if (!n || n.timeLimitSeconds <= 0 || r.lastResult) {
        ((L.hidden = !0),
          L.classList.remove("is-warning"),
          (L.textContent = ""));
        return;
      }
      ((L.hidden = !1),
        (L.textContent = `Time left: ${Et(r.secondsRemaining)}`),
        L.classList.toggle("is-warning", r.secondsRemaining <= 20));
    }
    function ge() {
      Z();
      let n = l[r.activeTierIndex];
      ((r.secondsRemaining = Math.max(0, Number(n.timeLimitSeconds) || 0)),
        V(),
        !(r.secondsRemaining <= 0) &&
          (r.timerId = window.setInterval(() => {
            ((r.secondsRemaining -= 1),
              V(),
              !(r.secondsRemaining > 0) && (Z(), ue({ autoSubmitted: !0 })));
          }, 1e3)));
    }
    function se(n) {
      let s = new Set(Array.isArray(n.questionIds) ? n.questionIds : []);
      return u.filter((a) => s.has(a.id));
    }
    function P(n) {
      let s = se(n);
      if (s.length === 0) return [];
      let i = Math.min(n.questionCount, s.length);
      return Pe(s)
        .slice(0, i)
        .map((a) => {
          let x = Math.min(n.optionCount, a.choices.length),
            I = Pe(a.choices).slice(0, x);
          if (!I.some((C) => C.id === a.correctId)) {
            let C = a.choices.find((R) => R.id === a.correctId);
            C && (I[I.length - 1] = C);
          }
          return { ...a, choices: Pe(I) };
        });
    }
    function ee() {
      (T.replaceChildren(),
        r.selectedQuestions.forEach((n, s) => {
          let i = document.createElement("fieldset");
          ((i.className = "question"), (i.dataset.questionId = n.id));
          let a = document.createElement("legend");
          ((a.textContent = `${s + 1}. ${n.prompt}`), i.appendChild(a));
          let x = document.createElement("div");
          ((x.className = "options"),
            n.choices.forEach((I) => {
              let C = document.createElement("label"),
                R = document.createElement("input"),
                _ = document.createElement("span");
              ((R.type = "radio"),
                (R.name = `question-${s}`),
                (R.value = I.id),
                R.addEventListener("change", te),
                (_.textContent = I.text),
                C.appendChild(R),
                C.appendChild(_),
                x.appendChild(C));
            }),
            i.appendChild(x),
            T.appendChild(i));
        }));
    }
    function E() {
      return r.selectedQuestions.reduce((n, s, i) => {
        let a = T.querySelector(`input[name="question-${i}"]:checked`);
        return n + (a ? 1 : 0);
      }, 0);
    }
    function q() {
      return (
        r.selectedQuestions.length > 0 && E() === r.selectedQuestions.length
      );
    }
    function te() {
      let n = r.selectedQuestions.length,
        s = l[r.activeTierIndex],
        i = s ? Math.ceil(n * s.passRatio) : 0;
      ((S.textContent = `${n} questions. Pass mark ${i}.`),
        r.lastResult ||
          ((N.disabled = n === 0), (F.textContent = ""), (F.style.color = "")));
    }
    function ne(n) {
      if (n < 0 || n >= l.length) return;
      let s = l[n];
      ((r.activeTierIndex = n),
        (r.selectedQuestions = P(s)),
        (r.lastResult = null),
        (Q.textContent = `${s.name} MCQ`),
        (F.textContent = ""),
        (F.style.color = ""),
        (N.hidden = !1),
        (N.disabled = !1),
        (k.hidden = !0),
        (O.hidden = !0),
        ee(),
        te(),
        ge(),
        b(A, !0));
      let i = T.querySelector('input[type="radio"]');
      i instanceof HTMLInputElement && i.focus();
    }
    function z() {
      (Z(),
        b(A, !1),
        T.replaceChildren(),
        (r.selectedQuestions = []),
        (r.lastResult = null),
        (S.textContent = "0 questions."),
        V());
    }
    function xe() {
      let n = r.selectedQuestions.map((C, R) => {
          let _ = T.querySelector(`input[name="question-${R}"]:checked`),
            Y = _ ? _.value : null,
            K = Y === C.correctId;
          return {
            index: R,
            selectedChoiceId: Y,
            correctChoiceId: C.correctId,
            isCorrect: K,
          };
        }),
        s = n.filter((C) => C.isCorrect).length,
        i = r.selectedQuestions.length,
        a = l[r.activeTierIndex],
        x = Math.ceil(i * a.passRatio),
        I = s >= x;
      return { score: s, maxScore: i, passThreshold: x, passed: I, details: n };
    }
    function ye(n) {
      (n.details.forEach((s) => {
        var C, R, _;
        let i = r.selectedQuestions[s.index],
          a = T.children[s.index],
          x =
            s.selectedChoiceId &&
            ((C = T.querySelector(
              `input[name="question-${s.index}"][value="${s.selectedChoiceId}"]`,
            )) == null
              ? void 0
              : C.parentElement),
          I =
            (R = T.querySelector(
              `input[name="question-${s.index}"][value="${s.correctChoiceId}"]`,
            )) == null
              ? void 0
              : R.parentElement;
        if (
          (x && !s.isCorrect && x.classList.add("wrong-answer-label"),
          I && I.classList.add("correct-answer-label"),
          a instanceof HTMLElement)
        ) {
          let Y =
              ((_ = i.choices.find((Se) => Se.id === s.correctChoiceId)) == null
                ? void 0
                : _.text) || "",
            K = document.createElement("p");
          ((K.className = `question-feedback ${s.isCorrect ? "is-correct" : "is-incorrect"}`),
            s.isCorrect
              ? (K.textContent = `Correct. Why: ${i.explanation}`)
              : (K.textContent = `Incorrect. Correct answer: ${Y}. Why: ${i.explanation}`),
            a.appendChild(K));
        }
      }),
        T.querySelectorAll('input[type="radio"]').forEach((s) => {
          s.disabled = !0;
        }));
    }
    function ve(n) {
      return n ? "Pass recorded." : "Review the feedback and try again.";
    }
    function ue({ autoSubmitted: n = !1 } = {}) {
      var C;
      if (r.selectedQuestions.length === 0 || r.lastResult) return;
      if (!n && !q()) {
        ((F.textContent = "Please answer all questions before submitting."),
          (F.style.color = "#c4171d"));
        let R = r.selectedQuestions.findIndex(
          (_, Y) => !T.querySelector(`input[name="question-${Y}"]:checked`),
        );
        (C = T.querySelector(`input[name="question-${R}"]`)) == null ||
          C.focus();
        return;
      }
      let s = xe();
      (ye(s), Z());
      let i = l[r.activeTierIndex],
        a = ve(s.passed);
      ((r.lastResult = {
        ...s,
        tierName: i.name,
        tierIndex: r.activeTierIndex,
        completedAt: new Date().toISOString(),
        timedOut: n,
      }),
        (N.hidden = !0),
        (k.hidden = !1),
        (O.hidden = !1));
      let x = document.createElement("p");
      x.className = "result-summary";
      let I = `Level ${r.lastResult.tierIndex + 1} (${r.lastResult.tierName}): ${r.lastResult.score}/${r.lastResult.maxScore}. `;
      ((I += r.lastResult.passed ? "Pass. " : "Fail. "),
        r.lastResult.timedOut && (I += "Time expired. "),
        (I += a),
        (x.textContent = I),
        (F.style.color = r.lastResult.passed ? "#0f9644" : "#c4171d"),
        F.replaceChildren(x),
        F.focus({ preventScroll: !0 }),
        te(),
        V());
    }
    function f() {
      if (!r.lastResult) return;
      let n = [
          "Newton MCQ Result",
          `Tier: ${r.lastResult.tierName}`,
          `Score: ${r.lastResult.score}/${r.lastResult.maxScore}`,
          `Pass Mark: ${r.lastResult.passThreshold}`,
          `Outcome: ${r.lastResult.passed ? "Pass" : "Fail"}`,
          `Completed: ${new Date(r.lastResult.completedAt).toLocaleString()}`,
          r.lastResult.timedOut ? "Timed Out: Yes" : "Timed Out: No",
        ],
        s = new Blob(
          [
            n.join(`
`),
          ],
          { type: "text/plain" },
        ),
        i = document.createElement("a"),
        a = URL.createObjectURL(s),
        x = r.lastResult.tierName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      ((i.href = a),
        (i.download = `newton_mcq_${x}_${Date.now()}.txt`),
        document.body.appendChild(i),
        i.click(),
        document.body.removeChild(i),
        URL.revokeObjectURL(a));
    }
    (h.addEventListener("click", () => {
      H(!m.classList.contains("open"));
    }),
      y.addEventListener("click", () => {
        H(!1);
      }));
    let t = document.getElementById("newSessionButton");
    (t == null ||
      t.addEventListener("click", () => {
        if (t.dataset.confirm !== "true") {
          ((t.dataset.confirm = "true"),
            (t.textContent = "Press again to reset"),
            clearTimeout(p),
            (p = setTimeout(() => {
              (delete t.dataset.confirm,
                (t.textContent = "New training session"));
            }, 5e3)));
          return;
        }
        location.reload();
      }),
      document.addEventListener("keydown", (n) => {
        if (n.key !== "Tab") return;
        let s = document.querySelector(
          ".modal.is-open .modal-content, .side-menu.open",
        );
        if (!s) return;
        let i = [
          ...s.querySelectorAll(
            'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ];
        if (!i.length) return;
        let a = i[0],
          x = i[i.length - 1];
        n.shiftKey && document.activeElement === a
          ? (n.preventDefault(), x.focus())
          : !n.shiftKey &&
            document.activeElement === x &&
            (n.preventDefault(), a.focus());
      }),
      g.addEventListener("click", () => {
        H(!1);
      }),
      M.addEventListener("click", () => {
        (H(!1), b(v, !v.classList.contains("is-open")));
      }),
      G.addEventListener("click", () => {
        b(v, !1);
      }),
      $.addEventListener("click", z),
      N.addEventListener("click", () => ue({ autoSubmitted: !1 })),
      k.addEventListener("click", () => {
        var n;
        (ne(r.activeTierIndex),
          (n = T.querySelector('input[type="radio"]')) == null ||
            n.focus({ preventScroll: !0 }));
      }),
      O.addEventListener("click", f),
      U.forEach((n) => {
        n.addEventListener("click", () => {
          let s = Number(n.dataset.levelIndex);
          ne(s);
        });
      }),
      document.addEventListener("click", (n) => {
        let s = n.target;
        s instanceof Element &&
          (m.classList.contains("open") &&
            !m.contains(s) &&
            !h.contains(s) &&
            H(!1),
          s === v && b(v, !1),
          s === A && z());
      }),
      document.addEventListener("keydown", (n) => {
        if (n.key === "Escape") {
          if (A.classList.contains("is-open")) {
            z();
            return;
          }
          if (v.classList.contains("is-open")) {
            b(v, !1);
            return;
          }
          m.classList.contains("open") && H(!1);
        }
      }),
      oe(),
      H(!1),
      V());
  }
  var ot = [
      {
        name: "Primary",
        questionCount: 5,
        optionCount: 4,
        passRatio: 0.7,
        timeLimitSeconds: 0,
        questionIds: [
          "p1",
          "p2",
          "p3",
          "p4",
          "p5",
          "p6",
          "p7",
          "p8",
          "p9",
          "p10",
        ],
      },
      {
        name: "Intermediate",
        questionCount: 6,
        optionCount: 4,
        passRatio: 0.75,
        timeLimitSeconds: 0,
        questionIds: [
          "i1",
          "i2",
          "i3",
          "i4",
          "i5",
          "i6",
          "i7",
          "i8",
          "i9",
          "i10",
        ],
      },
      {
        name: "Advanced",
        questionCount: 7,
        optionCount: 5,
        passRatio: 0.8,
        timeLimitSeconds: 150,
        questionIds: [
          "a1",
          "a2",
          "a3",
          "a4",
          "a5",
          "a6",
          "a7",
          "a8",
          "a9",
          "a10",
        ],
      },
    ],
    wt = {
      "haag-streit-at900-2025": {
        title: "Haag-Streit AT 900 instructions for use",
        url: "https://haag-streit.com/2%20Products/General%20diagnostics/Tonometers/Tonometer%20AT%20900/Instructions%20for%20use/1500%207006000%2004270_IFU_AT_900_01_en_web.pdf",
        reviewed: "2026-07-26",
        status: "primary-source-reviewed",
      },
      "egs-gat-guidance-2017": {
        title:
          "European Glaucoma Society terminology and guidelines: Goldmann applanation tonometry",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5583682/",
        reviewed: "2026-07-26",
        status: "guideline-source-reviewed",
      },
      "mires-training-scope-v1": {
        title: "Mires v1 simulator scope and Newton practice rules",
        url: null,
        reviewed: "2026-07-26",
        status: "internal-engineering-review",
      },
    },
    St = [
      {
        id: "p1",
        prompt: "Goldmann applanation tonometry mainly estimates:",
        choices: [
          { id: "a", text: "Corneal curvature only" },
          { id: "b", text: "IOP from force needed to flatten cornea" },
          { id: "c", text: "Axial length" },
          { id: "d", text: "Retinal thickness" },
        ],
        correctId: "b",
      },
      {
        id: "p2",
        prompt: "The standard Goldmann applanation diameter is:",
        choices: [
          { id: "a", text: "2.0 mm" },
          { id: "b", text: "2.5 mm" },
          { id: "c", text: "3.06 mm" },
          { id: "d", text: "4.0 mm" },
        ],
        correctId: "c",
      },
      {
        id: "p3",
        prompt: "Before Goldmann applanation, the usual setup is:",
        choices: [
          { id: "a", text: "No drops are needed" },
          { id: "b", text: "Cycloplegic only" },
          {
            id: "c",
            text: "Topical anaesthetic and a small amount of fluorescein",
          },
          { id: "d", text: "Topical steroid and antibiotic ointment" },
        ],
        correctId: "c",
      },
      {
        id: "p4",
        prompt: "Excess fluorescein can make the mires:",
        choices: [
          { id: "a", text: "Thin and faint" },
          { id: "b", text: "No change to mire appearance" },
          { id: "c", text: "Too wide for a reliable endpoint" },
          { id: "d", text: "Immediate corneal oedema" },
        ],
        correctId: "c",
      },
      {
        id: "p5",
        prompt: "Mires become too narrow as the tear film dries. What next?",
        choices: [
          { id: "a", text: "Withdraw, let the patient blink then repeat" },
          { id: "b", text: "Accept the reading without repeating" },
          { id: "c", text: "No need for anaesthetic" },
          { id: "d", text: "An exact reading despite a poor endpoint" },
        ],
        correctId: "a",
      },
      {
        id: "p6",
        prompt: "At correct endpoint, the inner edges of the two mires should:",
        choices: [
          { id: "a", text: "Stay clearly apart" },
          { id: "b", text: "Just touch" },
          { id: "c", text: "Overlap by half a ring width" },
          { id: "d", text: "Disappear completely" },
        ],
        correctId: "b",
      },
      {
        id: "p7",
        prompt:
          "If the eyelids are squeezing during applanation, the best immediate action is:",
        choices: [
          { id: "a", text: "Press harder on the lid to stabilise the eye" },
          {
            id: "b",
            text: "Ask the patient to relax and hold lids gently without globe pressure",
          },
          { id: "c", text: "Increase fluorescein until rings are very thick" },
          { id: "d", text: "Ignore it and take the reading anyway" },
        ],
        correctId: "b",
      },
      {
        id: "i1",
        prompt:
          "If the mires pulsate with the ocular pulse, the reading should be taken at:",
        choices: [
          { id: "a", text: "The maximum inward overlap" },
          { id: "b", text: "The maximum outward separation" },
          { id: "c", text: "The midpoint of pulsation" },
          { id: "d", text: "Any point, it makes no difference" },
        ],
        correctId: "c",
      },
      {
        id: "i2",
        prompt:
          "For routine Goldmann technique, the prism should applanate on:",
        choices: [
          { id: "a", text: "The central cornea with the prism perpendicular" },
          { id: "b", text: "The limbus to avoid the pupil" },
          { id: "c", text: "The superior conjunctiva" },
          { id: "d", text: "The cornea through a soft contact lens" },
        ],
        correctId: "a",
      },
      {
        id: "i3",
        prompt:
          "Pressure on the globe from lids or fingers during applanation usually causes:",
        choices: [
          { id: "a", text: "Falsely low IOP readings" },
          { id: "b", text: "No change to IOP readings" },
          { id: "c", text: "Only mire colour change" },
          { id: "d", text: "Falsely high IOP readings" },
        ],
        correctId: "d",
      },
      {
        id: "i4",
        prompt:
          "Markedly irregular or distorted mires are commonly associated with:",
        choices: [
          { id: "a", text: "A smooth healthy tear film" },
          { id: "b", text: "Corneal surface disease or scarring" },
          { id: "c", text: "A perfectly aligned prism" },
          { id: "d", text: "A naturally low IOP" },
        ],
        correctId: "b",
      },
      {
        id: "i5",
        prompt:
          "If a single Goldmann reading looks inconsistent, best practice is to:",
        choices: [
          { id: "a", text: "Accept it without repeating" },
          { id: "b", text: "Repeat and average consistent readings" },
          { id: "c", text: "Round to the nearest 5 mmHg" },
          { id: "d", text: "Switch immediately to another instrument" },
        ],
        correctId: "b",
      },
      {
        id: "i6",
        prompt: "Before Goldmann applanation, you should:",
        choices: [
          { id: "a", text: "Leave contact lenses in place for stability" },
          { id: "b", text: "Remove contact lenses first" },
          { id: "c", text: "Instill mydriatic in all cases" },
          { id: "d", text: "Avoid fluorescein to reduce artefacts" },
        ],
        correctId: "b",
      },
      {
        id: "i7",
        prompt: "After each patient, the Goldmann prism should be:",
        choices: [
          { id: "a", text: "Reused immediately if the cornea looked clear" },
          {
            id: "b",
            text: "Disinfected per local protocol, then rinsed if required",
          },
          { id: "c", text: "Wiped only with dry tissue" },
          { id: "d", text: "Flamed briefly and cooled" },
        ],
        correctId: "b",
      },
      {
        id: "a1",
        prompt: "Why is 3.06 mm used in Goldmann applanation?",
        choices: [
          { id: "a", text: "It maximises slit-lamp magnification" },
          {
            id: "b",
            text: "At this diameter, corneal rigidity and tear surface tension roughly cancel",
          },
          { id: "c", text: "It removes the need for anaesthetic" },
          { id: "d", text: "It corrects all corneal thickness errors" },
          { id: "e", text: "It converts readings directly to Pascal units" },
        ],
        correctId: "b",
      },
      {
        id: "a2",
        prompt:
          "Compared with average corneal thickness, a thicker cornea tends to make Goldmann readings:",
        choices: [
          { id: "a", text: "Falsely lower" },
          { id: "b", text: "Unchanged in all cases" },
          { id: "c", text: "Falsely higher" },
          { id: "d", text: "Random without pattern" },
          { id: "e", text: "Exactly corrected by fluorescein amount" },
        ],
        correctId: "c",
      },
      {
        id: "a3",
        prompt: "After myopic corneal refractive surgery, Goldmann often:",
        choices: [
          { id: "a", text: "Overestimates IOP markedly" },
          { id: "b", text: "Underestimates true IOP in many cases" },
          { id: "c", text: "Becomes unaffected by corneal biomechanics" },
          { id: "d", text: "Cannot be performed at all" },
          { id: "e", text: "Always reads exactly 20 mmHg" },
        ],
        correctId: "b",
      },
      {
        id: "a4",
        prompt:
          "With regular astigmatism greater than about 3D, a recommended approach is to:",
        choices: [
          { id: "a", text: "Ignore astigmatism and read as normal" },
          { id: "b", text: "Subtract a fixed 3 mmHg from every reading" },
          {
            id: "c",
            text: "Rotate prism appropriately (commonly about 43 deg) or average principal meridians",
          },
          { id: "d", text: "Use only non-contact tonometry" },
          { id: "e", text: "Increase fluorescein until rings overlap" },
        ],
        correctId: "c",
      },
      {
        id: "a5",
        prompt:
          "Which statement about fluorescein effect on mire appearance is correct?",
        choices: [
          { id: "a", text: "Excess fluorescein makes mires thinner" },
          { id: "b", text: "Deficiency makes mires thicker and broader" },
          {
            id: "c",
            text: "Excess gives thicker mires; deficiency gives thinner mires",
          },
          {
            id: "d",
            text: "Fluorescein changes colour only, not interpretation",
          },
          { id: "e", text: "Mire width is unrelated to fluorescein amount" },
        ],
        correctId: "c",
      },
      {
        id: "a6",
        prompt:
          "When lifting lids for a difficult view, safest technique is to:",
        choices: [
          { id: "a", text: "Press directly on the superior globe" },
          { id: "b", text: "Ask the patient to squeeze eyelids harder" },
          {
            id: "c",
            text: "Support lids/lashes against orbital rim and avoid globe pressure",
          },
          { id: "d", text: "Use no anaesthetic to preserve reflexes" },
          { id: "e", text: "Keep moving the prism while adjusting lids" },
        ],
        correctId: "c",
      },
      {
        id: "a7",
        prompt:
          "Which scenario is a caution for contact applanation with a Goldmann prism?",
        choices: [
          { id: "a", text: "Active corneal abrasion or infectious keratitis" },
          { id: "b", text: "Stable pseudophakia" },
          { id: "c", text: "Mild hyperopia" },
          { id: "d", text: "Physiological anisocoria" },
          { id: "e", text: "History of presbyopia" },
        ],
        correctId: "a",
      },
      {
        id: "a8",
        prompt:
          "If repeated Goldmann readings vary by more than about 4 mmHg, best next step is to:",
        choices: [
          { id: "a", text: "Record only the lowest value" },
          { id: "b", text: "Average all values regardless of quality" },
          {
            id: "c",
            text: "Re-check technique and ocular surface, then repeat carefully",
          },
          { id: "d", text: "Stop measurement and accept first reading" },
          { id: "e", text: "Increase fluorescein and read immediately" },
        ],
        correctId: "c",
      },
      {
        id: "p8",
        prompt: "Goldmann intraocular pressure is recorded in:",
        choices: [
          { id: "a", text: "Millimetres of mercury (mmHg)" },
          { id: "b", text: "Dioptres" },
          { id: "c", text: "Millimetres of corneal diameter" },
          { id: "d", text: "Degrees of prism rotation" },
        ],
        correctId: "a",
      },
      {
        id: "p9",
        prompt:
          "A reading taken while the patient is squeezing should usually be:",
        choices: [
          { id: "a", text: "Repeated after the patient relaxes" },
          { id: "b", text: "Recorded as the lowest possible value" },
          { id: "c", text: "Accepted without comment" },
          { id: "d", text: "Corrected by adding a fixed amount" },
        ],
        correctId: "a",
      },
      {
        id: "p10",
        prompt: "A training score should be understood as:",
        choices: [
          { id: "a", text: "Practice feedback" },
          { id: "b", text: "A patient diagnosis" },
          { id: "c", text: "A calibrated pressure measurement" },
          { id: "d", text: "A treatment decision" },
        ],
        correctId: "a",
      },
      {
        id: "i8",
        prompt:
          "Before judging horizontal mire overlap, a large vertical offset should be:",
        choices: [
          { id: "a", text: "Corrected" },
          { id: "b", text: "Ignored" },
          { id: "c", text: "Made larger" },
          { id: "d", text: "Recorded as a pressure value" },
        ],
        correctId: "a",
      },
      {
        id: "i9",
        prompt:
          "Broken or irregular fluorescein semicircles most strongly suggest:",
        choices: [
          {
            id: "a",
            text: "An unstable tear film or irregular corneal surface",
          },
          { id: "b", text: "A perfectly aligned prism" },
          { id: "c", text: "A definitive low IOP" },
          { id: "d", text: "An exact endpoint" },
        ],
        correctId: "a",
      },
      {
        id: "i10",
        prompt:
          "When repeated Goldmann readings are inconsistent, the most useful response is to:",
        choices: [
          {
            id: "a",
            text: "Review alignment, tear film and lid pressure, then repeat",
          },
          { id: "b", text: "Keep only the most favourable value" },
          { id: "c", text: "Average every value regardless of quality" },
          { id: "d", text: "Skip the endpoint check" },
        ],
        correctId: "a",
      },
      {
        id: "a9",
        prompt:
          "Why must a good simulator result not be treated as a patient measurement?",
        choices: [
          {
            id: "a",
            text: "The trainer does not include calibration, ocular surface and patient factors",
          },
          { id: "b", text: "The mires are always perfectly aligned" },
          { id: "c", text: "The pressure scale is a prescription scale" },
          { id: "d", text: "The Cup code is a clinical identifier" },
          { id: "e", text: "The timer changes corneal thickness" },
        ],
        correctId: "a",
      },
      {
        id: "a10",
        prompt: "Which sequence best supports reliable Goldmann applanation?",
        choices: [
          {
            id: "a",
            text: "Centre, correct vertical offset, judge overlap, then record",
          },
          { id: "b", text: "Confirm first, then move the mires" },
          { id: "c", text: "Ignore centring and use the timer alone" },
          { id: "d", text: "Maximise overlap regardless of endpoint" },
          { id: "e", text: "Use only the first visible ring position" },
        ],
        correctId: "a",
      },
    ],
    kt = {
      principle: {
        explanation:
          "Goldmann applanation estimates IOP from the force needed to flatten a 3.06 mm corneal area, where tear-film and corneal forces approximately balance.",
        source: "haag-streit-at900-2025",
      },
      setup: {
        explanation:
          "Goldmann applanation uses an anaesthetised central cornea, fluorescein in the tear film and a correctly aligned measuring prism.",
        source: "haag-streit-at900-2025",
      },
      fluorescein: {
        explanation:
          "Wide or narrow fluorescein bands make the endpoint unreliable. Correct excess fluid or drying before repeating; let the patient blink when the tear film has dried.",
        source: "haag-streit-at900-2025",
      },
      endpoint: {
        explanation:
          "At the Goldmann endpoint the inner edges of the fluorescein semicircles just touch, judged after the mires are centred and vertically aligned.",
        source: "haag-streit-at900-2025",
      },
      lids: {
        explanation:
          "Squeezing or pressure on the globe can raise the measured IOP. Support the lids without pressing on the eye and repeat a compromised reading.",
        source: "egs-gat-guidance-2017",
      },
      recording: {
        explanation:
          "Intraocular pressure is recorded in millimetres of mercury. A simulator display or training score is not a patient measurement.",
        source: "mires-training-scope-v1",
      },
      scope: {
        explanation:
          "The simulator provides practice feedback only. It does not include the patient, calibration and ocular-surface factors needed for a clinical measurement.",
        source: "mires-training-scope-v1",
      },
      surface: {
        explanation:
          "An unstable tear film, corneal surface disease or scarring can break or distort the fluorescein semicircles and make the endpoint unreliable.",
        source: "egs-gat-guidance-2017",
      },
      repeat: {
        explanation:
          "Inconsistent readings need a technique and surface check followed by careful repeat measurements rather than selective or uncritical averaging.",
        source: "egs-gat-guidance-2017",
      },
      hygiene: {
        explanation:
          "The measuring prism must be disinfected between patients in accordance with the manufacturer and local infection-control procedure.",
        source: "haag-streit-at900-2025",
      },
      cornea: {
        explanation:
          "Corneal thickness and biomechanics affect Goldmann readings. Thick corneas tend to read higher while myopic corneal refractive surgery often biases readings lower.",
        source: "egs-gat-guidance-2017",
      },
      astigmatism: {
        explanation:
          "Marked regular astigmatism changes the applanation geometry, so prism orientation or averaged principal-meridian readings may be required.",
        source: "haag-streit-at900-2025",
      },
      contraindications: {
        explanation:
          "Active corneal epithelial injury or infection is a reason to avoid or defer contact applanation and use an appropriate local alternative.",
        source: "haag-streit-at900-2025",
      },
    },
    Lt = {
      p1: "principle",
      p2: "principle",
      p3: "setup",
      p4: "fluorescein",
      p5: "fluorescein",
      p6: "endpoint",
      p7: "lids",
      p8: "recording",
      p9: "lids",
      p10: "scope",
      i1: "endpoint",
      i2: "setup",
      i3: "lids",
      i4: "surface",
      i5: "repeat",
      i6: "setup",
      i7: "hygiene",
      i8: "endpoint",
      i9: "surface",
      i10: "repeat",
      a1: "principle",
      a2: "cornea",
      a3: "cornea",
      a4: "astigmatism",
      a5: "fluorescein",
      a6: "lids",
      a7: "contraindications",
      a8: "repeat",
      a9: "scope",
      a10: "endpoint",
    },
    st = St.map((u) => {
      let l = Lt[u.id],
        c = kt[l];
      return { ...u, topic: l, ...c, reviewStatus: wt[c.source].status };
    });
  nt();
  it({ questionBank: st, tiers: ot });
  (location.protocol === "http:" || location.protocol === "https:") &&
    window.addEventListener("load", () => {
      var u;
      return (u = navigator.serviceWorker) == null
        ? void 0
        : u.register("./service-worker.js");
    });
})();
