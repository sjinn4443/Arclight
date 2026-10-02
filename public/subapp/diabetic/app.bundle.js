"use strict";
(() => {
  var pi = { right: "RE", left: "LE" },
    hi = { "arclight-do": "Arclight (DO)", "holo-bio": "Holo (BIO)" },
    It = {
      "arclight-do": [
        {
          value: "posterior-pole",
          label: "Posterior pole",
          shortLabel: "Post pole",
        },
        {
          value: "disc-macula",
          label: "Disc and macula",
          shortLabel: "Disc+mac",
        },
        {
          value: "limited",
          label: "Limited glimpses only",
          shortLabel: "Limited",
        },
      ],
      "holo-bio": [
        {
          value: "posterior-pole",
          label: "Posterior pole",
          shortLabel: "Post pole",
        },
        {
          value: "disc-macula",
          label: "Disc and macula",
          shortLabel: "Disc+mac",
        },
        {
          value: "four-quadrants",
          label: "Four-quadrant sweep",
          shortLabel: "4 quad",
        },
        {
          value: "limited",
          label: "Limited glimpses only",
          shortLabel: "Limited",
        },
      ],
    };
  var kt = [
    { value: "", label: "" },
    { value: "6/6", label: "6/6" },
    { value: "6/12", label: "6/12" },
    { value: "6/36", label: "6/36" },
    { value: "6/60", label: "6/60" },
    { value: "HM", label: "HM" },
    { value: "unable_test", label: "No test" },
    { value: "fix_follow_good", label: "Fix/follow" },
    { value: "fix_follow_poor", label: "No fix" },
  ];
  var fi = [
      { key: "bp", label: "BP checked", note: "optimise BP" },
      { key: "lipids", label: "Lipids checked", note: "optimise lipids" },
      {
        key: "hba1c",
        label: "HbA1c checked",
        note: "optimise glucose control",
      },
    ],
    ut = [
      {
        key: "clear",
        title: "No referable signs",
        tone: "neutral",
        findings: [
          {
            key: "noReferableSignsSeen",
            label: "No referable signs seen in view obtained",
            shortLabel: "No signs",
            group: "clear",
            detail:
              "Use only when no referable signs are seen in the view obtained. It does not replace routine diabetic eye screening.",
          },
        ],
      },
      {
        key: "npdr",
        title: "DR signs",
        tone: "green",
        findings: [
          {
            key: "microaneurysms",
            label: "Microaneurysms",
            shortLabel: "MA",
            group: "npdr",
            detail:
              "Tiny red dots, often the earliest visible diabetic retinopathy sign. Mark when small round red lesions are seen.",
          },
          {
            key: "dotBlotHaemorrhages",
            label: "Dot/blot haemorrhages",
            shortLabel: "D/B",
            group: "npdr",
            detail:
              "Intraretinal haemorrhages that look like red dots or blotches. Record when clearly seen away from the disc.",
          },
          {
            key: "cottonWoolSpots",
            label: "Cotton-wool spots",
            shortLabel: "CWS",
            group: "npdr",
            detail:
              "Soft-edged pale white patches from nerve fibre layer ischaemia. They suggest more active retinopathy.",
          },
          {
            key: "venousBeading",
            label: "Venous beading",
            shortLabel: "VB",
            group: "npdr",
            detail:
              "Irregular venous calibre or beading. This is a more severe ischaemic diabetic retinopathy sign.",
          },
        ],
      },
      {
        key: "macula",
        title: "Macula risk",
        tone: "orange",
        findings: [
          {
            key: "maculaHardExudates",
            label: "Hard exudates near macula",
            shortLabel: "Macula HE",
            group: "macula",
            detail:
              "Yellow hard exudates close to the macula. Circinate exudates or exudates near fixation are macula risk.",
          },
          {
            key: "fovealRisk",
            label: "Possible foveal involvement",
            shortLabel: "Fovea risk",
            group: "macula",
            detail:
              "Use when signs may involve the fovea, or reduced VA fits possible macular involvement. This needs prompt eye review.",
          },
        ],
      },
      {
        key: "pdr",
        title: "Proliferative signs",
        tone: "red",
        findings: [
          {
            key: "nvd",
            label: "New vessels at disc",
            shortLabel: "NVD",
            group: "pdr",
            detail:
              "Fine new vessels on or within one disc diameter of the disc. Treat as proliferative diabetic retinopathy.",
          },
          {
            key: "nve",
            label: "New vessels elsewhere",
            shortLabel: "NVE",
            group: "pdr",
            detail:
              "Fine new vessels away from the disc, often at vascular arcades or an ischaemic border. Treat as proliferative diabetic retinopathy.",
          },
          {
            key: "preretinalHaemorrhage",
            label: "Preretinal haemorrhage",
            shortLabel: "PR-H",
            group: "pdr",
            detail:
              "Superficial or boat-shaped blood in front of the retina. This is an urgent proliferative sign.",
          },
          {
            key: "vitreousHaemorrhage",
            label: "Vitreous haemorrhage",
            shortLabel: "Vit H",
            group: "pdr",
            detail:
              "Blood or dark haze in the vitreous with reduced retinal view. Treat as urgent until specialist assessment.",
          },
        ],
      },
    ],
    qe = ut.flatMap((e) => e.findings),
    Tt = Object.fromEntries(qe.map((e) => [e.key, e])),
    mi = qe.map((e) => e.key),
    gi = mi.filter((e) => e !== "noReferableSignsSeen"),
    bi = qe.filter((e) => e.group === "npdr").map((e) => e.key),
    wi = qe.filter((e) => e.group === "macula").map((e) => e.key),
    vi = qe.filter((e) => e.group === "pdr").map((e) => e.key);
  function yi() {
    return Object.fromEntries(mi.map((e) => [e, !1]));
  }
  function pt(e) {
    return qe.filter((t) => !!e[t.key]).map((t) => t.label);
  }
  function Si(e, t) {
    var n, r;
    return (
      ((r = (n = It[e]) == null ? void 0 : n.find((l) => l.value === t)) == null
        ? void 0
        : r.label) || "Not recorded"
    );
  }
  function je(e) {
    var t;
    return (
      ((t = kt.find((n) => n.value === e)) == null ? void 0 : t.label) ||
      "Not recorded"
    );
  }
  function Ai({
    canvasWidth: e,
    canvasHeight: t,
    imageNaturalWidth: n,
    imageNaturalHeight: r,
    imageScale: l,
    zoomFactor: u,
    bgOffsetX: f,
    bgOffsetY: h,
    circleRadius: v,
    circleX: m,
    isRightEye: g,
  }) {
    let b = t / r,
      E = n * b,
      L = t,
      D = (e - E) / 2,
      k = 0,
      C = l * u,
      T = E * C,
      q = L * C,
      $ = D + (E - T) / 2 + f,
      o = k + (L - q) / 2 + h,
      we = u,
      ve = v * we * b,
      Fe = g ? m : e - m;
    return {
      scaleFactor: b,
      drawnImageWidth: E,
      imageDrawOffsetX: D,
      scaledWidth: T,
      scaledHeight: q,
      offsetXPos: $,
      offsetYPos: o,
      windowScale: we,
      effectiveCircleRadius: ve,
      flippedCircleX: Fe,
    };
  }
  function xi(e, t) {
    if (e <= t) return { min: e, max: t };
    let n = (e + t) / 2;
    return { min: n, max: n };
  }
  function Ei({
    canvasWidth: e,
    canvasHeight: t,
    imageNaturalWidth: n,
    imageNaturalHeight: r,
    imageScale: l = 1,
    circleRadius: u,
    zoomFactor: f,
  }) {
    let h = t / r,
      v = n * h,
      m = (e - v) / 2,
      g = 0,
      b = l * f,
      E = v * b,
      L = t * b,
      D = m + (v - E) / 2,
      k = g + (t - L) / 2,
      C = u * f * h,
      T = D + C,
      q = D + E - C,
      $ = k + C,
      o = k + L - C,
      we = xi(T, q),
      ve = xi($, o);
    return { minX: we.min, maxX: we.max, minY: ve.min, maxY: ve.max };
  }
  function Ci({
    circleX: e,
    circleY: t,
    velocityX: n,
    velocityY: r,
    bounds: l,
  }) {
    let u = e,
      f = t,
      h = n,
      v = r;
    return (
      u < l.minX && ((u = l.minX), (h *= -0.5)),
      u > l.maxX && ((u = l.maxX), (h *= -0.5)),
      f < l.minY && ((f = l.minY), (v *= -0.5)),
      f > l.maxY && ((f = l.maxY), (v *= -0.5)),
      { circleX: u, circleY: f, velocityX: h, velocityY: v }
    );
  }
  function Mi({ cataractLevel: e, darkTint: t, yellowTint: n }) {
    let r = e === 3 ? 0.3 : 0.55,
      l = 1 - t * 2.8 - n * 1.2;
    return Math.max(r, l);
  }
  var ie = Object.freeze({
      rotateDegrees: 0,
      scale: 1,
      panXRatio: 0,
      panYRatio: 0,
      brightness: 1,
      contrast: 1,
      saturation: 1,
      flipVertical: !1,
    }),
    Y = Object.freeze({
      rotateDegrees: { min: -7, max: 7 },
      scale: { min: 0.85, max: 1.2 },
      panRatio: { min: -0.08, max: 0.08 },
      brightness: { min: 0.78, max: 1.22 },
      contrast: { min: 0.78, max: 1.22 },
      saturation: { min: 0.78, max: 1.22 },
    }),
    Oe = Object.freeze({
      jitterMultiplier: 1,
      shiftDistanceMultiplier: 1,
      shiftDurationMs: 600,
    }),
    me = Object.freeze({
      jitterMultiplier: { min: 1, max: 4 },
      shiftDistanceMultiplier: { min: 1, max: 3.2 },
      shiftDurationMs: { min: 250, max: 2500 },
    }),
    ma = Object.freeze(["horizontal", "vertical", "mixed"]),
    Ri = Object.freeze({ slow: 1.05, med: 1.75, fast: 2.45 }),
    Li = Object.freeze({ enabled: !1, direction: "horizontal", rate: "slow" });
  function ga() {
    let e = typeof window != "undefined",
      t =
        e && typeof window.matchMedia == "function"
          ? window.matchMedia("(pointer: coarse)").matches
          : !1,
      n = e ? Math.max(window.innerWidth || 0, window.innerHeight || 0) : 0,
      r = t || n <= 1100;
    return {
      isMobileLike: r,
      canvasScale: r ? 0.5 : 1,
      cataractBlurScale: r ? 0.42 : 1,
      occlusionSpotRatio: 1,
      occlusionBlurScale: r ? 0.45 : 1,
      baseJitterIntervalMs: r ? 24 : 16,
      cataractJitterIntervalMs: r ? 72 : 16,
    };
  }
  function Di(e) {
    return typeof e != "string" || e.length === 0
      ? ""
      : e.split("?")[0].split("/").pop() || "";
  }
  function Ii(e) {
    return null;
  }
  function ba(e, t) {
    return typeof e != "string" ? "" : (t && Ii(e)) || e;
  }
  function K(e, t, n, r) {
    let l = Number(e);
    return Number.isFinite(l) ? Math.max(t, Math.min(n, l)) : r;
  }
  function wa(e) {
    let t = e && typeof e == "object" ? e : {};
    return {
      rotateDegrees: K(
        t.rotateDegrees,
        Y.rotateDegrees.min,
        Y.rotateDegrees.max,
        ie.rotateDegrees,
      ),
      scale: K(t.scale, Y.scale.min, Y.scale.max, ie.scale),
      panXRatio: K(t.panXRatio, Y.panRatio.min, Y.panRatio.max, ie.panXRatio),
      panYRatio: K(t.panYRatio, Y.panRatio.min, Y.panRatio.max, ie.panYRatio),
      brightness: K(
        t.brightness,
        Y.brightness.min,
        Y.brightness.max,
        ie.brightness,
      ),
      contrast: K(t.contrast, Y.contrast.min, Y.contrast.max, ie.contrast),
      saturation: K(
        t.saturation,
        Y.saturation.min,
        Y.saturation.max,
        ie.saturation,
      ),
      flipVertical: !!t.flipVertical,
    };
  }
  function va(e) {
    let t = e && typeof e == "object" ? e : {};
    return {
      jitterMultiplier: K(
        t.jitterMultiplier,
        me.jitterMultiplier.min,
        me.jitterMultiplier.max,
        Oe.jitterMultiplier,
      ),
      shiftDistanceMultiplier: K(
        t.shiftDistanceMultiplier,
        me.shiftDistanceMultiplier.min,
        me.shiftDistanceMultiplier.max,
        Oe.shiftDistanceMultiplier,
      ),
      shiftDurationMs: K(
        t.shiftDurationMs,
        me.shiftDurationMs.min,
        me.shiftDurationMs.max,
        Oe.shiftDurationMs,
      ),
    };
  }
  function ki({
    state: e,
    canvas: t,
    fovToggleCheckbox: n,
    fovLabelSmall: r,
    fovLabelLeft: l,
    fovLabelRight: u,
    eyeToggleCheckbox: f,
    eyeLabelRight: h,
    eyeLabelLeft: v,
    cataractSlider: m,
    cataractStops: g,
    viewSummary: b,
    explanation: E,
    conditionButtons: L,
    defaultImageSrc: D,
    explanationTemplates: k,
    cataractPresets: C,
    cataractOcclusionSpots: T,
    onDilationChange: q = null,
    onViewerCaseChange: $ = null,
  }) {
    let o = t.getContext("2d"),
      we = 5,
      ve = 80,
      Fe = Object.freeze({
        "arclight-do": Object.freeze({
          levels: Object.freeze([4, 8, 15]),
          defaultIndex: 1,
          undilatedDegrees: 8,
          dilatedDegrees: 15,
          showCornealReflex: !0,
          backgroundImageScale: 1,
          labels: Object.freeze({
            4: "Small (4\xB0)",
            8: "Normal (8\xB0)",
            15: "Dilated (15\xB0)",
          }),
        }),
        "holo-bio": Object.freeze({
          levels: Object.freeze([15, 25]),
          defaultIndex: 0,
          undilatedDegrees: 15,
          dilatedDegrees: 25,
          showCornealReflex: !1,
          backgroundImageScale: 0.72,
          labels: Object.freeze({
            15: "Undilated (15\xB0)",
            25: "Dilated (25\xB0)",
          }),
        }),
      }),
      Je = "arclight-do",
      Te = (8 / 5) * ve,
      pe = Je,
      U = 0,
      z = 0,
      Ne = 0,
      Ve = 0,
      se = !1,
      Ze = null,
      Z = 0,
      ee = 0,
      ye = { x: 0, y: 0 },
      et = { x: 0, y: 0 },
      J = null,
      Se = 0,
      bt = 0,
      gn = 1,
      $e = 3,
      W = ga(),
      _ = { ...ie },
      xe = { ...Oe },
      bn = 400,
      he = null,
      X = null,
      le = null,
      Ht = 0,
      Ut = 0,
      Ae = null,
      ce = { x: 0, y: 0 },
      Ee = 0,
      wn = 2,
      Ce = new Map(),
      Me = new Map(),
      Pe = new Map(),
      We = 640,
      zt = [],
      Xt = !1,
      I = new Image();
    ((I.onload = () => {
      (st(), X === null && (X = requestAnimationFrame(He)));
    }),
      (I.onerror = () => {
        let i = Ii(e.viewer.activeImageSrc);
        !i ||
          i === e.viewer.activeImageSrc ||
          ((Xt = !0),
          e.viewer.conditionImageSrc === e.viewer.activeImageSrc &&
            (e.viewer.conditionImageSrc = i),
          (e.viewer.activeImageSrc = i),
          (I.src = i));
      }));
    function G(i, a, c, d) {
      (i.addEventListener(a, c, d),
        zt.push(() => {
          i.removeEventListener(a, c, d);
        }));
    }
    function P() {
      le === null &&
        (le = requestAnimationFrame((i) => {
          le = null;
          let a = W.isMobileLike && e.viewer.cataractLevel > 0 ? 34 : 0,
            c =
              typeof i == "number"
                ? i
                : typeof window != "undefined" && window.performance
                  ? window.performance.now()
                  : Date.now();
          if (a > 0 && c - Ut < a) {
            P();
            return;
          }
          ((Ut = c), Yn());
        }));
    }
    function jt(i, a, c = 0.25) {
      if (pe !== "holo-bio") return;
      let d = Math.hypot(i, a);
      d > 0.5 && (bt = Math.atan2(a, i));
      let w = Math.min(1, d / 70),
        y = Math.min(1, c * 0.35 + w * 0.8);
      Se = Math.max(Se * 0.7, y);
    }
    function vn() {
      Se <= 0 ||
        ((Se *= e.viewer.shiftInProgress ? 0.9 : 0.84), Se < 0.025 && (Se = 0));
    }
    function yn() {
      var a;
      let i =
        ((a = L[0]) == null ? void 0 : a.getAttribute("data-condition")) ||
        e.viewer.activeCondition ||
        "normal";
      ((e.viewer.activeImageSrc = D),
        (e.viewer.conditionImageSrc = D),
        (e.viewer.activeCondition = i),
        (e.viewer.isRightEye = !0),
        (e.viewer.isDiscVisible = !0),
        (e.viewer.cataractLevel = 0),
        (e.viewer.nystagmusEnabled = !!e.viewer.nystagmusEnabled),
        (e.viewer.nystagmusDirection = nt(e.viewer.nystagmusDirection)),
        (e.viewer.nystagmusRate = at(e.viewer.nystagmusRate)),
        (e.viewer.shiftInProgress = !1),
        (pe = e.mode || Je),
        (_ = { ...ie }),
        (xe = { ...Oe }),
        Kt(),
        (n.value = String(F().defaultIndex)),
        (Te = ti(Re())),
        wt(i),
        vt(i),
        it(D),
        Zt(),
        xt(),
        At(),
        Sn(),
        xn());
    }
    function Sn() {
      let i = () => {
        ii(St());
      };
      (G(n, "input", i),
        G(n, "change", i),
        G(f, "change", () => {
          ((e.viewer.isRightEye = !f.checked), st(), xt());
        }),
        G(m, "input", () => {
          ((e.viewer.cataractLevel = Number(m.value)), At(), P());
        }),
        L.forEach((d) => {
          G(d, "click", () => {
            if (d.disabled) return;
            let y = d.getAttribute("data-condition") || "normal",
              x = d.getAttribute("data-image") || D;
            (wt(y),
              (e.viewer.activeCondition = y),
              (e.viewer.conditionImageSrc = x),
              (e.viewer.isDiscVisible = !0),
              it(x),
              vt(y),
              $ == null || $({ condition: y, imagePath: x }));
          });
        }));
    }
    function wt(i) {
      L.forEach((a) => {
        let d = (a.getAttribute("data-condition") || "normal") === i;
        (a.classList.toggle("active", d),
          a.setAttribute("aria-pressed", d ? "true" : "false"));
      });
    }
    function xn() {
      (G(t, "pointerdown", En),
        G(t, "pointermove", Cn),
        G(t, "pointerup", tt),
        G(t, "pointercancel", tt),
        G(t, "pointerleave", (a) => {
          a.pointerType === "mouse" && tt(a);
        }),
        G(window, "pointerup", tt),
        typeof document != "undefined" && G(document, "visibilitychange", An));
    }
    function An() {
      if (typeof document != "undefined") {
        if (document.hidden) {
          (X !== null && (cancelAnimationFrame(X), (X = null)),
            le !== null && (cancelAnimationFrame(le), (le = null)),
            J !== null && (cancelAnimationFrame(J), (J = null)));
          return;
        }
        (I.complete && X === null && (X = requestAnimationFrame(He)), P());
      }
    }
    function En(i) {
      (i.button !== void 0 && i.button !== 0) ||
        ((se = !0),
        (Ze = i.pointerId),
        (Z = 0),
        (ee = 0),
        t.setPointerCapture(i.pointerId),
        (t.style.cursor = "none"),
        Qt(i),
        $n());
    }
    function Cn(i) {
      !se || i.pointerId !== Ze || Qt(i);
    }
    function tt(i) {
      se &&
        ((typeof i.pointerId == "number" && i.pointerId !== Ze) ||
          (typeof i.pointerId == "number" &&
            t.hasPointerCapture(i.pointerId) &&
            t.releasePointerCapture(i.pointerId),
          (se = !1),
          (Ze = null),
          (t.style.cursor = "crosshair"),
          Wn()));
    }
    function Qt(i) {
      let a = t.getBoundingClientRect();
      if (a.width === 0 || a.height === 0) return;
      let c = t.width / a.width,
        d = t.height / a.height,
        w = (i.clientX - a.left) * c,
        y = (i.clientY - a.top) * d,
        x = Mn(),
        M = Math.max(18, Math.min(64, x * 0.12)),
        A = U,
        V = z;
      ((U = w), (z = y - x - M), jt(U - A, z - V, 0.55), Ue(), P());
    }
    function Mn() {
      if (!I.naturalHeight || t.height <= 0) return Te * $e;
      let i = t.height / I.naturalHeight;
      return Te * $e * i;
    }
    function it(i) {
      let a = ba(i, Xt);
      e.viewer.activeImageSrc = a;
      let c = Di(I.src),
        d = Di(a);
      if (I.complete && c === d) {
        st();
        return;
      }
      I.src = a;
    }
    function Rn({ condition: i, imagePath: a, imageScale: c } = {}) {
      let d = i || e.viewer.activeCondition || "normal",
        w = a || D,
        y = Number(c);
      (wt(d),
        (e.viewer.activeCondition = d),
        (e.viewer.conditionImageSrc = w),
        (e.viewer.caseImageScale = Number.isFinite(y) && y > 0 ? y : 1),
        (e.viewer.isDiscVisible = !0),
        it(w),
        vt(d),
        $ == null ||
          $({
            condition: d,
            imagePath: w,
            imageScale: e.viewer.caseImageScale,
          }));
    }
    function Ln(i) {
      let a = _.panXRatio * i.scaledWidth,
        c = _.panYRatio * i.scaledHeight,
        d = i.offsetXPos + a,
        w = i.offsetYPos + c;
      return {
        offsetXPos: d,
        offsetYPos: w,
        scaledWidth: i.scaledWidth,
        scaledHeight: i.scaledHeight,
        centreX: d + i.scaledWidth / 2,
        centreY: w + i.scaledHeight / 2,
      };
    }
    function Gt(i) {
      let a = (_.rotateDegrees * Math.PI) / 180,
        c = _.flipVertical === !0;
      if (!(a === 0 && _.scale === 1 && !c)) {
        if (
          (o.translate(i.centreX, i.centreY),
          a !== 0 && o.rotate(a),
          _.scale !== 1 || c)
        ) {
          let d = c ? _.scale * -1 : _.scale;
          o.scale(_.scale, d);
        }
        o.translate(-i.centreX, -i.centreY);
      }
    }
    function Dn(i) {
      let a = i.brightness * _.brightness,
        c = i.contrast * _.contrast,
        d = i.saturation * _.saturation;
      return `blur(${Math.max(0, Math.min(6, i.blurPx))}px) brightness(${a}) contrast(${c}) saturate(${d})`;
    }
    function In(i) {
      _ = wa(i);
    }
    function kn() {
      _ = { ...ie };
    }
    function Tn(i) {
      xe = va(i);
    }
    function Nn() {
      xe = { ...Oe };
    }
    function vt(i) {
      E && (E.innerHTML = k[i] || k.normal);
    }
    function F() {
      return Fe[pe] || Fe[Je];
    }
    function Kt() {
      let i = F().levels;
      ((n.min = "0"),
        (n.max = String(Math.max(0, i.length - 1))),
        (n.step = "1"));
    }
    function yt() {
      return F().dilatedDegrees;
    }
    function Ye() {
      return F().undilatedDegrees;
    }
    function Jt() {
      let i = Number.isFinite(e.viewer.caseImageScale)
        ? e.viewer.caseImageScale
        : 1;
      return gn * i * (F().backgroundImageScale || 1);
    }
    function nt(i) {
      return ma.includes(i) ? i : Li.direction;
    }
    function at(i) {
      return Object.prototype.hasOwnProperty.call(Ri, i) ? i : Li.rate;
    }
    function Zt() {
      let i = St(),
        a = F().levels;
      (r &&
        (r.classList.toggle("active", i === 0),
        (r.textContent = a.length > 2 ? "Small" : "")),
        (l.textContent = a.length > 2 ? "Norm" : "Undilated"),
        (u.textContent = "Dilated"),
        l.classList.toggle("active", a.length > 2 ? i === 1 : i === 0),
        u.classList.toggle("active", a.length > 2 ? i === 2 : i === 1),
        n.setAttribute("aria-valuetext", `${Re()} degrees`),
        Et());
    }
    function ei(i) {
      let a = F().levels,
        c = Number(i);
      return Number.isFinite(c)
        ? Math.max(0, Math.min(a.length - 1, Math.round(c)))
        : F().defaultIndex;
    }
    function St() {
      return ei(n.value);
    }
    function Re() {
      let i = F();
      return i.levels[St()] || i.undilatedDegrees;
    }
    function Vn(i) {
      let a = Number(i);
      if (!Number.isFinite(a)) return F().defaultIndex;
      let c = F().defaultIndex,
        d = 1 / 0;
      return (
        F().levels.forEach((w, y) => {
          let x = Math.abs(w - a);
          x < d && ((d = x), (c = y));
        }),
        c
      );
    }
    function ti(i) {
      return (i / we) * ve;
    }
    function ii(i) {
      let a = ei(i),
        c = F().levels[a] || Ye();
      ((n.value = String(a)),
        (Te = ti(c)),
        Ue(),
        P(),
        Zt(),
        q == null || q(lt(), Re()));
    }
    function rt(i) {
      ii(Vn(i));
    }
    function Pn() {
      return Re();
    }
    function xt() {
      (h.classList.toggle("active", e.viewer.isRightEye),
        v.classList.toggle("active", !e.viewer.isRightEye),
        Et());
    }
    function At() {
      let i = C.length - 1,
        a = Math.max(0, Math.min(i, Number(m.value) || 0));
      ((e.viewer.cataractLevel = a), (m.value = String(a)));
      let c = C[e.viewer.cataractLevel];
      (m.setAttribute("aria-valuetext", c.label),
        g.forEach((d, w) => {
          d.classList.toggle("active", w === a);
        }),
        Et());
    }
    function Et() {
      if (!b) return;
      let i = e.viewer.isRightEye ? "RE" : "LE",
        a = Re(),
        c = F().labels[a] || `${a} degrees`,
        d = C[e.viewer.cataractLevel] || C[0],
        w = d.label === "None" ? "No cataract" : d.label,
        y = `${i} - ${c} - ${w}`;
      ((b.textContent = y),
        b.setAttribute("aria-label", `Current viewing setup: ${y}`));
    }
    function Ct(i, a) {
      let c = i === 3,
        d = i === 3 ? 2 : i,
        w = T[d];
      if (!w || w.length === 0) return null;
      let y = Math.max(0.2, Math.min(1, W.occlusionSpotRatio)),
        x = Math.max(1, Math.round(w.length * y)),
        M = y >= 1 ? w : w.slice(0, x);
      return {
        isDenseLevel: c,
        patchProfileLevel: d,
        spotsToRender: M,
        minDimension: a,
        levelBoost: [1, 1.3, 1.75][d] || 1,
        blurMultiplier: [1, 1, 0.68][d] || 1,
        blurCap: [14, 14, 11][d] || 14,
        outerAlphaCap: [0.72, 0.76, 0.8][d] || 0.72,
        coreAlphaCap: [0.8, 0.84, 0.88][d] || 0.8,
        coreBoost: [1.7, 1.9, 2.25][d] || 1.7,
        hardCoreStrengthBase: [0, 0, 0.36][d] || 0,
        hardCoreRadiusX: [0, 0, 0.3][d] || 0,
        hardCoreRadiusY: [0, 0, 0.2][d] || 0,
        coreBlurMultiplier: [0.45, 0.45, 0.28][d] || 0.45,
      };
    }
    function Mt(i, a, c, d, w, y) {
      let x = a.radiusBoost || 1,
        M =
          typeof a.occlusionBlurScaleOverride == "number"
            ? a.occlusionBlurScaleOverride
            : W.occlusionBlurScale;
      a.spotsToRender.forEach((A) => {
        let V = c + (0.5 + A.x * 0.5) * w,
          j = d + (0.5 + A.y * 0.5) * y,
          te = a.isDenseLevel ? 2 : 1,
          O = A.r * a.minDimension * 0.3 * te * x,
          ct = A.stretchX || 1,
          Lt = A.stretchY || 1,
          Dt = A.angle || 0,
          ze = A.blur * (a.minDimension / 900) * a.blurMultiplier * M,
          Xe = Math.max(0.45, Math.min(a.blurCap, ze)),
          de = Math.min(a.outerAlphaCap, A.alpha * a.levelBoost),
          fe = Math.min(
            a.coreAlphaCap,
            A.coreAlpha * a.levelBoost * a.coreBoost,
          );
        (i.save(),
          i.translate(V, j),
          i.rotate(Dt),
          i.scale(ct, Lt),
          (i.filter = `blur(${Xe}px)`));
        let B = i.createRadialGradient(0, 0, 0, 0, 0, O);
        if (
          (B.addColorStop(0, `rgba(4, 3, 2, ${de})`),
          B.addColorStop(0.55, `rgba(8, 6, 4, ${de * 0.82})`),
          B.addColorStop(1, "rgba(12, 8, 5, 0)"),
          (i.fillStyle = B),
          i.beginPath(),
          i.arc(0, 0, O, 0, 2 * Math.PI),
          i.fill(),
          fe > 0)
        ) {
          let N = i.createRadialGradient(0, 0, 0, 0, 0, O * 0.46);
          (N.addColorStop(0, `rgba(0, 0, 0, ${fe})`),
            N.addColorStop(0.8, `rgba(6, 4, 2, ${fe * 0.46})`),
            N.addColorStop(1, "rgba(8, 5, 2, 0)"),
            (i.fillStyle = N),
            i.beginPath(),
            i.arc(0, 0, O * 0.46, 0, 2 * Math.PI),
            i.fill(),
            (i.filter = `blur(${Math.max(0.1, Xe * a.coreBlurMultiplier)}px)`),
            (i.fillStyle = `rgba(0, 0, 0, ${Math.min(0.88, fe * 0.95)})`),
            i.beginPath(),
            i.ellipse(0, 0, O * 0.26, O * 0.16, 0, 0, 2 * Math.PI),
            i.fill());
          let Le = W.isMobileLike
            ? a.hardCoreStrengthBase * 0.55
            : a.hardCoreStrengthBase;
          Le > 0 &&
            ((i.filter = "none"),
            (i.fillStyle = `rgba(0, 0, 0, ${Math.min(Le, fe * 1.4)})`),
            i.beginPath(),
            i.ellipse(
              0,
              0,
              O * a.hardCoreRadiusX,
              O * a.hardCoreRadiusY,
              0,
              0,
              2 * Math.PI,
            ),
            i.fill());
        }
        i.restore();
      });
    }
    function qn(i) {
      if (!W.isMobileLike || i <= 0) return null;
      if (Ce.has(i)) return Ce.get(i);
      if (
        typeof document == "undefined" ||
        typeof document.createElement != "function"
      )
        return (Ce.set(i, null), null);
      let a = Ct(i, We);
      if (!a) return (Ce.set(i, null), null);
      let c = document.createElement("canvas");
      ((c.width = We), (c.height = We));
      let d = c.getContext("2d");
      return d
        ? (d.save(),
          (d.globalCompositeOperation = "source-over"),
          Mt(d, a, 0, 0, We, We),
          (d.filter = "none"),
          d.restore(),
          Ce.set(i, c),
          c)
        : (Ce.set(i, null), null);
    }
    function On(i, a) {
      if (!W.isMobileLike || i <= 0 || t.width <= 0 || t.height <= 0)
        return null;
      let c = `${i}:${t.width}x${t.height}`;
      if (Me.has(c)) return Me.get(c);
      if (
        typeof document == "undefined" ||
        typeof document.createElement != "function"
      )
        return (Me.set(c, null), null);
      let d = document.createElement("canvas");
      ((d.width = t.width), (d.height = t.height));
      let w = d.getContext("2d");
      if (!w) return (Me.set(c, null), null);
      (a.yellowTint > 0 &&
        ((w.fillStyle = `rgba(226, 188, 92, ${a.yellowTint})`),
        w.fillRect(0, 0, d.width, d.height)),
        a.darkTint > 0 &&
          ((w.fillStyle = `rgba(35, 24, 5, ${a.darkTint})`),
          w.fillRect(0, 0, d.width, d.height)),
        a.hazeTint > 0 &&
          ((w.fillStyle = `rgba(250, 236, 208, ${a.hazeTint})`),
          w.fillRect(0, 0, d.width, d.height)));
      let y = $e * 1.12,
        x = d.width * y,
        M = d.height * y,
        A = (d.width - x) / 2,
        V = (d.height - M) / 2,
        j = Ct(i, Math.max(1, Math.min(x, M)));
      return (
        j &&
          ((j.radiusBoost = 1.08),
          (j.occlusionBlurScaleOverride = 0.92),
          Mt(w, j, A, V, x, M),
          (w.filter = "none")),
        Me.set(c, d),
        d
      );
    }
    function Bn(i, a) {
      let c = On(i, a);
      c &&
        (o.save(),
        (o.globalCompositeOperation = "source-over"),
        o.drawImage(c, 0, 0, t.width, t.height),
        o.restore());
    }
    function _n(i, a, c, d, w) {
      let y = qn(w);
      if (y) {
        (o.save(),
          (o.globalCompositeOperation = "source-over"),
          o.drawImage(y, i, a, c, d),
          o.restore());
        return;
      }
      let x = Math.min(c, d),
        M = Ct(w, x);
      M &&
        (o.save(),
        (o.globalCompositeOperation = "source-over"),
        Mt(o, M, i, a, c, d),
        (o.filter = "none"),
        o.restore());
    }
    function ot() {
      return ce.x === 0 && ce.y === 0 ? !1 : ((ce = { x: 0, y: 0 }), !0);
    }
    function ni(i) {
      if (!e.viewer.nystagmusEnabled) return ((Ee = 0), ot());
      Ee === 0 && (Ee = i);
      let a = nt(e.viewer.nystagmusDirection),
        c = at(e.viewer.nystagmusRate),
        w = (((i - Ee) / 1e3) * Ri[c]) % 1,
        y = Math.max(10, Math.min(42, t.width * 0.018)),
        x = y * 0.55,
        M =
          w < 0.75
            ? -y + (w / 0.75) * (2 * y)
            : y - ((w - 0.75) / 0.25) * (2 * y),
        A = {
          x: a === "vertical" ? 0 : M,
          y: a === "horizontal" ? 0 : a === "vertical" ? M : M >= 0 ? x : -x,
        };
      return Math.abs(ce.x - A.x) < 0.02 && Math.abs(ce.y - A.y) < 0.02
        ? !1
        : ((ce = {
            x: parseFloat(A.x.toFixed(2)),
            y: parseFloat(A.y.toFixed(2)),
          }),
          !0);
    }
    function ai() {
      if (Ae !== null) return;
      let i = (a) => {
        if (((Ae = null), !e.viewer.nystagmusEnabled)) {
          ot() && P();
          return;
        }
        (ni(a), P(), (Ae = requestAnimationFrame(i)));
      };
      Ae = requestAnimationFrame(i);
    }
    function ri() {
      Ae !== null && (cancelAnimationFrame(Ae), (Ae = null));
    }
    function He(i) {
      let a =
          typeof i == "number"
            ? i
            : typeof window != "undefined" && window.performance
              ? window.performance.now()
              : Date.now(),
        c = W.isMobileLike && e.viewer.cataractLevel > 0,
        d = c ? W.cataractJitterIntervalMs : W.baseJitterIntervalMs;
      if (c && se) {
        X = requestAnimationFrame(He);
        return;
      }
      if (a - Ht < d) {
        X = requestAnimationFrame(He);
        return;
      }
      Ht = a;
      let w = c ? 0.58 : 1,
        y = wn * xe.jitterMultiplier * w,
        x = Math.max(0.72, 0.85 - (xe.jitterMultiplier - 1) * 0.04),
        M = (Math.random() - 0.5) * y,
        A = (Math.random() - 0.5) * y;
      ((Z += M),
        (ee += A),
        (Z *= x),
        (ee *= x),
        (Ne += Z),
        (Ve += ee),
        ni(a),
        Ue(),
        P(),
        (X = requestAnimationFrame(He)));
    }
    function Fn(i = {}) {
      e.viewer.shiftInProgress = !0;
      let a = se,
        c = Z,
        d = ee;
      ((se = !1), (Z = 0), (ee = 0));
      let w = Ne,
        y = Ve,
        x = K(i.distanceMultiplier, 0.25, 4, 1) * xe.shiftDistanceMultiplier,
        M = bn * x,
        A = K(
          i.returnDelayMs,
          me.shiftDurationMs.min,
          me.shiftDurationMs.max,
          xe.shiftDurationMs,
        ),
        V = Math.random() * 2 * Math.PI;
      ((Ne += M * Math.cos(V)),
        (Ve += M * Math.sin(V)),
        jt(Math.cos(V), Math.sin(V), 0.7),
        Ue(),
        P(),
        he !== null && (clearTimeout(he), (he = null)),
        (he = setTimeout(() => {
          ((Ne = w),
            (Ve = y),
            Ue(),
            P(),
            (se = a),
            (Z = c),
            (ee = d),
            (e.viewer.shiftInProgress = !1),
            (he = null));
        }, A)));
    }
    function $n() {
      if (W.isMobileLike || J !== null) return;
      let i = () => {
        (se
          ? (et = {
              x: (Math.random() - 0.5) * 100,
              y: (Math.random() - 0.5) * 100,
            })
          : (et = { x: 0, y: 0 }),
          (ye.x += (et.x - ye.x) * 0.1),
          (ye.y += (et.y - ye.y) * 0.1),
          P(),
          (J = requestAnimationFrame(i)));
      };
      i();
    }
    function Wn() {
      (J !== null && (cancelAnimationFrame(J), (J = null)),
        (ye = { x: 0, y: 0 }),
        P());
    }
    function st() {
      if (!I.naturalWidth || !I.naturalHeight) return;
      let i = Math.max(0.45, Math.min(1, W.canvasScale));
      ((t.width = Math.max(1, Math.round(I.naturalWidth * i))),
        (t.height = Math.max(1, Math.round(I.naturalHeight * i))),
        (o.imageSmoothingEnabled = !0),
        (o.imageSmoothingQuality = W.isMobileLike ? "medium" : "high"),
        (U = t.width / 2),
        (z = t.height / 2),
        (Z = 0),
        (ee = 0),
        (Ne = 0),
        (Ve = 0),
        (ce = { x: 0, y: 0 }),
        (Ee = 0),
        Me.clear(),
        Pe.clear(),
        P());
    }
    function Yn() {
      if (!I.naturalWidth || !I.naturalHeight) return;
      o.clearRect(0, 0, t.width, t.height);
      let i = Ai({
          canvasWidth: t.width,
          canvasHeight: t.height,
          imageNaturalWidth: I.naturalWidth,
          imageNaturalHeight: I.naturalHeight,
          imageScale: Jt(),
          zoomFactor: $e,
          bgOffsetX: Ne + ce.x,
          bgOffsetY: Ve + ce.y,
          circleRadius: Te,
          circleX: U,
          isRightEye: e.viewer.isRightEye,
        }),
        a = C[e.viewer.cataractLevel] || C[0];
      (Hn(i, a), jn(i), zn(i, a), Gn(i), Kn(), vn());
    }
    function Rt(i, a, c) {
      (o.beginPath(),
        o.arc(i, a, c, 0, 2 * Math.PI, !0),
        o.closePath(),
        o.clip());
    }
    function Hn(i, a) {
      if (
        (o.save(),
        e.viewer.isRightEye || (o.translate(t.width, 0), o.scale(-1, 1)),
        Rt(i.flippedCircleX, z, i.effectiveCircleRadius),
        e.viewer.isDiscVisible)
      ) {
        let c = Ln(i);
        (o.save(),
          pe === "holo-bio" &&
            (o.translate(c.centreX, c.centreY),
            o.rotate(Math.PI),
            o.translate(-c.centreX, -c.centreY)),
          Gt(c),
          (o.filter = Dn(a)),
          o.drawImage(
            I,
            0,
            0,
            I.naturalWidth,
            I.naturalHeight,
            c.offsetXPos,
            c.offsetYPos,
            c.scaledWidth,
            c.scaledHeight,
          ),
          (o.filter = "none"),
          o.restore(),
          W.isMobileLike && e.viewer.cataractLevel > 0
            ? Bn(e.viewer.cataractLevel, a)
            : (Un(a),
              o.save(),
              Gt(c),
              _n(
                c.offsetXPos,
                c.offsetYPos,
                c.scaledWidth,
                c.scaledHeight,
                e.viewer.cataractLevel,
              ),
              o.restore()));
      } else ((o.fillStyle = "black"), o.fillRect(0, 0, t.width, t.height));
      o.restore();
    }
    function Un(i) {
      (i.yellowTint > 0 &&
        ((o.fillStyle = `rgba(226, 188, 92, ${i.yellowTint})`),
        o.fillRect(0, 0, t.width, t.height)),
        i.darkTint > 0 &&
          ((o.fillStyle = `rgba(35, 24, 5, ${i.darkTint})`),
          o.fillRect(0, 0, t.width, t.height)),
        i.hazeTint > 0 &&
          ((o.fillStyle = `rgba(250, 236, 208, ${i.hazeTint})`),
          o.fillRect(0, 0, t.width, t.height)));
    }
    function zn(i, a) {
      F().showCornealReflex &&
        (o.save(),
        Rt(U, z, i.effectiveCircleRadius),
        e.viewer.isDiscVisible && Xn(i.effectiveCircleRadius, a),
        o.restore());
    }
    function Xn(i, a) {
      let c = Mi({
          cataractLevel: e.viewer.cataractLevel,
          darkTint: a.darkTint,
          yellowTint: a.yellowTint,
        }),
        w =
          375 *
          (I.naturalHeight > 0
            ? Math.max(0.45, Math.min(1, t.height / I.naturalHeight))
            : 1),
        y = 1.3,
        x = 0.6 * w * y,
        M = 0.5 * w * y,
        A = 0.7,
        V = x * A,
        j = M * A,
        te = U + ye.x,
        O = z + 0.3 * i + ye.y;
      (o.save(),
        o.translate(te, O),
        o.scale(1, -1),
        o.translate(-te, -O),
        oi(te, O, x, M, 0.5 * c),
        oi(te, O, V, j, c),
        o.restore());
    }
    function oi(i, a, c, d, w) {
      let y = c / 2,
        x = d / 2,
        M = x * 0.6;
      (o.beginPath(),
        o.ellipse(i, a, y, x, 0, Math.PI, 2 * Math.PI, !1),
        o.ellipse(i, a, y, M, 0, 0, Math.PI, !1),
        o.closePath(),
        (o.fillStyle = `rgba(255,255,255,${w})`),
        o.fill());
    }
    function jn(i) {
      if (pe !== "holo-bio" || !e.viewer.isDiscVisible) return;
      let a = Math.max(0.45, 1 - e.viewer.cataractLevel * 0.16),
        c = Math.min(0.96, Se * 1.25 * a);
      if (c < 0.03) return;
      let d = i.effectiveCircleRadius,
        w = U,
        y = z,
        x = Math.max(-0.06, Math.min(0.06, Math.sin(bt) * 0.06)),
        M =
          typeof window != "undefined" && window.performance
            ? window.performance.now()
            : Date.now(),
        A = 0.88 + 0.16 * Math.sin(M * 0.011 + bt * 2),
        V = Qn(d);
      V &&
        (o.save(),
        Rt(w, y, d),
        (o.globalCompositeOperation = "source-over"),
        (o.globalAlpha = Math.max(0, Math.min(0.96, c * A))),
        o.translate(w, y),
        o.rotate(x),
        o.drawImage(V.canvas, -V.centre, -V.centre),
        o.restore());
    }
    function Qn(i) {
      if (typeof document == "undefined") return null;
      let a = Math.max(1, Math.round(i)),
        c = W.isMobileLike,
        d = `${c ? "m" : "d"}-${a}`;
      if (Pe.has(d)) return Pe.get(d);
      let w = Math.ceil(a * 0.38),
        y = a + w,
        x = Math.ceil(y * 2),
        M = document.createElement("canvas");
      ((M.width = x), (M.height = x));
      let A = M.getContext("2d");
      if (!A) return (Pe.set(d, null), null);
      let V = -0.78,
        j = 1.22,
        te = V + Math.PI,
        O = j + Math.PI,
        ct = a * 0.87,
        Lt = Math.max(14, a * 0.38),
        Dt = Math.max(5, a * 0.13),
        ze = c ? 40 : 28,
        Xe = c ? 0.018 : 0.012,
        de = ({
          arcRadius: B,
          lineWidth: N,
          start: Le,
          end: si,
          colourAt: pa,
        }) => {
          for (let dt = 0; dt < ze; dt += 1) {
            let li = dt / ze,
              ci = (dt + 1) / ze,
              di = (li + ci) / 2,
              ui = Math.pow(Math.sin(Math.PI * di), 1.15);
            if (ui <= 0) continue;
            let ha = Le + (si - Le) * Math.max(0, li - Xe),
              fa = Le + (si - Le) * Math.min(1, ci + Xe);
            ((A.strokeStyle = pa(di, ui)),
              (A.lineWidth = N),
              A.beginPath(),
              A.arc(y, y, B, ha, fa),
              A.stroke());
          }
        };
      ((A.imageSmoothingEnabled = !0),
        (A.imageSmoothingQuality = c ? "medium" : "high"),
        (A.globalCompositeOperation = "source-over"),
        (A.filter = c ? "none" : `blur(${Math.max(1.8, a * 0.014)}px)`),
        (A.lineCap = "round"),
        (A.lineJoin = "round"),
        de({
          arcRadius: ct,
          lineWidth: Lt,
          start: V,
          end: j,
          colourAt: (B, N) =>
            B > 0.76
              ? `rgba(91, 207, 255, ${0.62 * N})`
              : B > 0.58
                ? `rgba(255, 172, 52, ${0.76 * N})`
                : `rgba(255, 223, 112, ${0.98 * N})`,
        }),
        de({
          arcRadius: a * 0.94,
          lineWidth: Math.max(7, a * 0.16),
          start: 0.08,
          end: j,
          colourAt: (B, N) =>
            B < 0.28
              ? "rgba(255, 255, 255, 0)"
              : `rgba(43, 124, 255, ${0.76 * N})`,
        }),
        de({
          arcRadius: ct,
          lineWidth: Dt,
          start: te,
          end: O,
          colourAt: (B, N) =>
            B > 0.7
              ? `rgba(87, 196, 255, ${0.25 * N})`
              : B > 0.52
                ? `rgba(255, 177, 58, ${0.24 * N})`
                : `rgba(255, 228, 128, ${0.32 * N})`,
        }),
        de({
          arcRadius: a * 0.94,
          lineWidth: Math.max(2, a * 0.042),
          start: te + 0.18,
          end: O - 0.08,
          colourAt: (B, N) => `rgba(78, 163, 255, ${0.2 * N})`,
        }),
        (A.filter = "none"),
        de({
          arcRadius: a * 0.985,
          lineWidth: Math.max(1, a * 0.012),
          start: V + 0.08,
          end: j - 0.08,
          colourAt: (B, N) => `rgba(255, 255, 255, ${0.22 * N})`,
        }),
        de({
          arcRadius: a * 0.985,
          lineWidth: Math.max(1, a * 0.007),
          start: te + 0.16,
          end: O - 0.16,
          colourAt: (B, N) => `rgba(255, 255, 255, ${0.08 * N})`,
        }));
      let fe = { canvas: M, centre: y };
      return (Pe.set(d, fe), fe);
    }
    function Gn(i) {
      let a = 18 * i.windowScale * i.scaleFactor;
      (o.save(),
        o.beginPath(),
        o.arc(U, z, i.effectiveCircleRadius, 0, 2 * Math.PI, !0),
        (o.strokeStyle = "rgba(255, 255, 255, 0.24)"),
        (o.lineWidth = a * 2),
        o.stroke(),
        o.beginPath(),
        o.arc(U, z, i.effectiveCircleRadius, 0, 2 * Math.PI, !0),
        (o.strokeStyle = "rgba(255, 255, 255, 0.66)"),
        (o.lineWidth = a),
        o.stroke(),
        o.beginPath(),
        o.arc(U, z, i.effectiveCircleRadius, 0, 2 * Math.PI, !0),
        (o.strokeStyle = "rgba(255, 255, 255, 0.92)"),
        (o.lineWidth = Math.max(2, a * 0.5)),
        o.stroke(),
        o.restore());
    }
    function Kn() {
      let i = Math.max(1, t.clientWidth || t.width),
        a = Math.max(1, t.clientHeight || t.height),
        c = t.width / i,
        d = t.height / a,
        w = Math.max(10, Math.min(16, i * 0.02)),
        y = Math.max(10, Math.min(13, i * 0.011)),
        x = w * c,
        M = a * 0.5 * d,
        A = y * c;
      (o.save(),
        (o.fillStyle = "rgba(148, 163, 184, 0.82)"),
        (o.font = `600 ${A}px 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`),
        (o.textAlign = "center"),
        (o.textBaseline = "middle"),
        e.viewer.isRightEye !== (pe === "holo-bio")
          ? (o.save(),
            o.translate(x, M),
            o.rotate(-Math.PI / 2),
            o.fillText("Temporal", 0, 0),
            o.restore(),
            o.save(),
            o.translate(t.width - x, M),
            o.rotate(Math.PI / 2),
            o.fillText("Nasal", 0, 0),
            o.restore())
          : (o.save(),
            o.translate(x, M),
            o.rotate(-Math.PI / 2),
            o.fillText("Nasal", 0, 0),
            o.restore(),
            o.save(),
            o.translate(t.width - x, M),
            o.rotate(Math.PI / 2),
            o.fillText("Temporal", 0, 0),
            o.restore()),
        o.restore());
    }
    function Ue() {
      if (!I.naturalWidth || !I.naturalHeight) return;
      let i = Ei({
          canvasWidth: t.width,
          canvasHeight: t.height,
          imageNaturalWidth: I.naturalWidth,
          imageNaturalHeight: I.naturalHeight,
          imageScale: Jt(),
          circleRadius: Te,
          zoomFactor: $e,
        }),
        a = Ci({
          circleX: U,
          circleY: z,
          velocityX: Z,
          velocityY: ee,
          bounds: i,
        });
      ((U = a.circleX), (z = a.circleY), (Z = a.velocityX), (ee = a.velocityY));
    }
    function Jn() {
      Re() !== Ye() && rt(Ye());
    }
    function Zn(i) {
      let a = !!i;
      lt() !== a && rt(a ? yt() : Ye());
    }
    function lt() {
      return Re() === yt();
    }
    function ea(i) {
      let a = Fe[i] ? i : Je;
      if (pe === a) return;
      let c = lt();
      ((pe = a), Kt(), rt(c ? yt() : Ye()), P());
    }
    function ta(i) {
      let a = !!i;
      e.viewer.isRightEye !== a &&
        ((f.checked = !a), (e.viewer.isRightEye = a), st(), xt());
    }
    function ia() {
      return e.viewer.isRightEye;
    }
    function na(i) {
      let a = C.length - 1,
        c = Math.max(0, Math.min(a, Number(i) || 0));
      Number(m.value) !== c && ((m.value = String(c)), At(), P());
    }
    function aa() {
      return Number(m.value) || 0;
    }
    function ra(i) {
      let a = !!i;
      e.viewer.nystagmusEnabled !== a &&
        ((e.viewer.nystagmusEnabled = a),
        (Ee = 0),
        a ? ai() : (ri(), ot()),
        P());
    }
    function oa({ direction: i, rate: a } = {}) {
      ((e.viewer.nystagmusDirection = nt(i || e.viewer.nystagmusDirection)),
        (e.viewer.nystagmusRate = at(a || e.viewer.nystagmusRate)),
        (Ee = 0),
        e.viewer.nystagmusEnabled && ai(),
        P());
    }
    function sa() {
      return {
        enabled: !!e.viewer.nystagmusEnabled,
        direction: nt(e.viewer.nystagmusDirection),
        rate: at(e.viewer.nystagmusRate),
      };
    }
    function la(i) {
      ((e.viewer.isDiscVisible = i), P());
    }
    function ca(i) {
      (L.forEach((a) => {
        a.disabled = i;
      }),
        (n.disabled = i),
        (f.disabled = i),
        (m.disabled = i));
    }
    function da() {
      return e.viewer.conditionImageSrc || D;
    }
    function ua() {
      (zt.splice(0).forEach((i) => {
        i();
      }),
        X !== null && (cancelAnimationFrame(X), (X = null)),
        le !== null && (cancelAnimationFrame(le), (le = null)),
        J !== null && (cancelAnimationFrame(J), (J = null)),
        he !== null && (clearTimeout(he), (he = null)),
        ri(),
        ot(),
        (e.viewer.shiftInProgress = !1),
        Ce.clear(),
        Me.clear(),
        Pe.clear());
    }
    return {
      initialize: yn,
      doGazeShift: Fn,
      setDiscVisible: la,
      setImageSource: it,
      setViewerCase: Rn,
      setViewerMode: ea,
      setViewerControlsDisabled: ca,
      ensureUndilated: Jn,
      setDilated: Zn,
      getIsDilated: lt,
      setRightEye: ta,
      getIsRightEye: ia,
      setCataractLevel: na,
      getCataractLevel: aa,
      setNystagmusEnabled: ra,
      setNystagmusConfig: oa,
      getNystagmusConfig: sa,
      setTimedAugmentation: In,
      clearTimedAugmentation: kn,
      setTimedMotionProfile: Tn,
      clearTimedMotionProfile: Nn,
      setFovDegrees: rt,
      getFovDegrees: Pn,
      getActiveConditionImagePath: da,
      destroy: ua,
    };
  }
  var Q = Object.freeze([
      {
        id: "case-01",
        label: "1",
        title: "Case 1",
        summary: "Normal eye",
        description: [
          "Normal retinal image for comparison.",
          "No diabetic retinopathy signs are visible.",
          "Record the view and findings for each eye.",
        ],
        src: "assets/images/diabetic/case-01.webp?v=20260520-expanded2",
        thumbSrc: "assets/images/diabetic/case-01_thumb.webp?v=20260520-thumbs",
        darkSrc:
          "assets/images/diabetic/case-01_dark.webp?v=20260520-darkcases",
      },
      {
        id: "case-02",
        label: "2",
        title: "Case 2",
        viewScale: 0.86,
        summary: "Small NVD",
        description: [
          "Small new vessels at the disc.",
          "No definite new vessels elsewhere in this image.",
          "This is a proliferative DR sign.",
          "Urgent referral for laser panretinal photocoagulation (PRP).",
        ],
        src: "assets/images/diabetic/case-02.webp?v=20260520-expanded2",
        thumbSrc: "assets/images/diabetic/case-02_thumb.webp?v=20260520-thumbs",
        darkSrc:
          "assets/images/diabetic/case-02_dark.webp?v=20260520-darkcases",
      },
      {
        id: "case-03",
        label: "3",
        title: "Case 3",
        viewScale: 0.86,
        summary: "NVD + NVE",
        description: [
          "New vessels at the disc and elsewhere.",
          "This is proliferative diabetic retinopathy.",
          "Red-flag new vessels drive urgent action.",
        ],
        src: "assets/images/diabetic/case-03.webp?v=20260520-expanded2",
        thumbSrc: "assets/images/diabetic/case-03_thumb.webp?v=20260520-thumbs",
        darkSrc:
          "assets/images/diabetic/case-03_dark.webp?v=20260520-darkcases",
      },
      {
        id: "case-04",
        label: "4",
        title: "Case 4",
        viewScale: 0.86,
        summary: "NVE + maculopathy",
        description: [
          "New vessels elsewhere are present.",
          "There are macular changes as well.",
          "This is a mixed proliferative and macula-risk case.",
        ],
        src: "assets/images/diabetic/case-04.webp?v=20260520-expanded2",
        thumbSrc: "assets/images/diabetic/case-04_thumb.webp?v=20260520-thumbs",
        darkSrc:
          "assets/images/diabetic/case-04_dark.webp?v=20260520-darkcases",
      },
      {
        id: "case-05",
        label: "5",
        title: "Case 5",
        viewScale: 0.86,
        summary: "NVD + NVE + small PRH",
        description: [
          "New vessels are seen at the disc and elsewhere.",
          "There is also a small pre-retinal haemorrhage.",
          "This is proliferative DR with haemorrhage.",
        ],
        src: "assets/images/diabetic/case-05.webp?v=20260520-expanded2",
        thumbSrc: "assets/images/diabetic/case-05_thumb.webp?v=20260520-thumbs",
        darkSrc:
          "assets/images/diabetic/case-05_dark.webp?v=20260520-darkcases",
      },
      {
        id: "case-06",
        label: "6",
        title: "Case 6",
        viewScale: 0.86,
        summary: "Small inferior PRH",
        description: [
          "Small pre-retinal haemorrhage inferiorly.",
          "The rest of the view is easier to assess.",
          "The pre-retinal blood is the key finding.",
        ],
        src: "assets/images/diabetic/case-06.webp?v=20260520-expanded2",
        thumbSrc: "assets/images/diabetic/case-06_thumb.webp?v=20260520-thumbs",
        darkSrc:
          "assets/images/diabetic/case-06_dark.webp?v=20260520-darkcases",
      },
      {
        id: "case-07",
        label: "7",
        title: "Case 7",
        viewScale: 0.86,
        summary: "Medium PRH",
        description: [
          "Medium pre-retinal haemorrhage.",
          "Blood is sitting in front of the retina.",
          "Treat this as an urgent proliferative-risk sign.",
        ],
        src: "assets/images/diabetic/case-07.webp?v=20260520-expanded2",
        thumbSrc: "assets/images/diabetic/case-07_thumb.webp?v=20260520-thumbs",
        darkSrc:
          "assets/images/diabetic/case-07_dark.webp?v=20260520-darkcases",
      },
      {
        id: "case-08",
        label: "8",
        title: "Case 8",
        viewScale: 0.86,
        summary: "Vitreous haemorrhage",
        description: [
          "Very large vitreous or total haemorrhage.",
          "The retina cannot be assessed.",
          "This is an urgent same-day finding.",
        ],
        src: "assets/images/diabetic/case-08.webp?v=20260520-expanded2",
        thumbSrc: "assets/images/diabetic/case-08_thumb.webp?v=20260520-thumbs",
        darkSrc: "assets/images/diabetic/case-08.webp?v=20260520-expanded2",
      },
      {
        id: "case-09",
        label: "9",
        title: "Case 9",
        viewScale: 0.86,
        summary: "Mild mixed maculopathy",
        description: [
          "Mild macular changes are present.",
          "There are a few scattered diabetic changes.",
          "Macula risk is the main feature to notice.",
        ],
        src: "assets/images/diabetic/case-09.webp?v=20260520-expanded2",
        thumbSrc: "assets/images/diabetic/case-09_thumb.webp?v=20260520-thumbs",
        darkSrc:
          "assets/images/diabetic/case-09_dark.webp?v=20260520-darkcases",
      },
      {
        id: "case-10",
        label: "10",
        title: "Case 10",
        viewScale: 0.86,
        summary: "Extensive mixed maculopathy",
        description: [
          "More extensive macular changes.",
          "There are scattered haemorrhages as well.",
          "This is a mixed maculopathy case.",
        ],
        src: "assets/images/diabetic/case-10.webp?v=20260520-expanded2",
        thumbSrc: "assets/images/diabetic/case-10_thumb.webp?v=20260520-thumbs",
        darkSrc:
          "assets/images/diabetic/case-10_dark.webp?v=20260520-darkcases",
      },
    ]),
    Ti = Q[0].src,
    Ni = Object.freeze({
      "case-01":
        "<p>Use the viewing window to scan the image, then record View and Findings.</p>",
      normal:
        "<p>Use the viewing window to scan the image, then record View and Findings.</p>",
    }),
    Vi = [
      {
        label: "None",
        blurPx: 0,
        brightness: 1,
        contrast: 1,
        saturation: 1,
        yellowTint: 0,
        darkTint: 0,
        hazeTint: 0,
      },
      {
        label: "Slight",
        blurPx: 0.45,
        brightness: 0.92,
        contrast: 0.95,
        saturation: 0.9,
        yellowTint: 0.05,
        darkTint: 0.06,
        hazeTint: 0.015,
      },
      {
        label: "Med",
        blurPx: 1.65,
        brightness: 0.7,
        contrast: 0.76,
        saturation: 0.58,
        yellowTint: 0.2,
        darkTint: 0.24,
        hazeTint: 0.05,
      },
      {
        label: "Dense",
        blurPx: 3.2,
        brightness: 0.56,
        contrast: 0.66,
        saturation: 0.46,
        yellowTint: 0.34,
        darkTint: 0.4,
        hazeTint: 0.14,
      },
    ],
    Pi = [
      [],
      [
        {
          x: -0.34,
          y: -0.2,
          r: 0.2,
          alpha: 0.13,
          blur: 0.95,
          coreAlpha: 0.05,
          stretchX: 1.45,
          stretchY: 0.8,
          angle: -0.45,
        },
        {
          x: 0.4,
          y: 0.22,
          r: 0.16,
          alpha: 0.11,
          blur: 0.9,
          coreAlpha: 0.04,
          stretchX: 1.35,
          stretchY: 0.82,
          angle: 0.35,
        },
        {
          x: 0.06,
          y: 0.34,
          r: 0.13,
          alpha: 0.09,
          blur: 0.82,
          coreAlpha: 0.03,
          stretchX: 1.3,
          stretchY: 0.9,
          angle: -0.1,
        },
      ],
      [
        {
          x: -0.46,
          y: -0.3,
          r: 0.28,
          alpha: 0.26,
          blur: 1.2,
          coreAlpha: 0.1,
          stretchX: 1.75,
          stretchY: 0.74,
          angle: -0.62,
        },
        {
          x: 0.4,
          y: -0.16,
          r: 0.24,
          alpha: 0.23,
          blur: 1.12,
          coreAlpha: 0.09,
          stretchX: 1.6,
          stretchY: 0.78,
          angle: 0.52,
        },
        {
          x: 0.08,
          y: 0.34,
          r: 0.22,
          alpha: 0.21,
          blur: 1.08,
          coreAlpha: 0.08,
          stretchX: 1.55,
          stretchY: 0.8,
          angle: -0.22,
        },
        {
          x: -0.18,
          y: 0.02,
          r: 0.19,
          alpha: 0.18,
          blur: 1,
          coreAlpha: 0.07,
          stretchX: 1.5,
          stretchY: 0.85,
          angle: 0.12,
        },
        {
          x: 0.26,
          y: 0.1,
          r: 0.16,
          alpha: 0.16,
          blur: 0.94,
          coreAlpha: 0.06,
          stretchX: 1.4,
          stretchY: 0.88,
          angle: -0.35,
        },
      ],
      [
        {
          x: -0.5,
          y: -0.34,
          r: 0.34,
          alpha: 0.42,
          blur: 1.55,
          coreAlpha: 0.18,
          stretchX: 2,
          stretchY: 0.66,
          angle: -0.72,
        },
        {
          x: 0.42,
          y: -0.22,
          r: 0.31,
          alpha: 0.39,
          blur: 1.46,
          coreAlpha: 0.17,
          stretchX: 1.9,
          stretchY: 0.68,
          angle: 0.58,
        },
        {
          x: 0.14,
          y: 0.4,
          r: 0.29,
          alpha: 0.37,
          blur: 1.4,
          coreAlpha: 0.16,
          stretchX: 1.82,
          stretchY: 0.7,
          angle: -0.26,
        },
        {
          x: -0.1,
          y: 0.04,
          r: 0.27,
          alpha: 0.34,
          blur: 1.34,
          coreAlpha: 0.15,
          stretchX: 1.75,
          stretchY: 0.74,
          angle: 0.08,
        },
        {
          x: 0.32,
          y: 0.18,
          r: 0.24,
          alpha: 0.31,
          blur: 1.28,
          coreAlpha: 0.14,
          stretchX: 1.7,
          stretchY: 0.78,
          angle: -0.42,
        },
        {
          x: -0.3,
          y: 0.24,
          r: 0.21,
          alpha: 0.28,
          blur: 1.2,
          coreAlpha: 0.12,
          stretchX: 1.62,
          stretchY: 0.82,
          angle: 0.44,
        },
      ],
    ];
  function qi() {
    return { distanceVA: "", viewQuality: "", areaSeen: "", findings: yi() };
  }
  function Nt() {
    return {
      mode: "arclight-do",
      dilation: "",
      systemicChecks: { bp: !1, lipids: !1, hba1c: !1 },
      viewer: {
        activeImageSrc: "",
        conditionImageSrc: "",
        activeCondition: "case-01",
        pigmentation: "light",
        isRightEye: !0,
        isDiscVisible: !0,
        cataractLevel: 0,
        caseImageScale: 1,
        nystagmusEnabled: !1,
        nystagmusDirection: "horizontal",
        nystagmusRate: "slow",
        shiftInProgress: !1,
      },
      eyes: { right: qi(), left: qi() },
    };
  }
  function Oi(e) {
    let t = Nt();
    return (
      (e.mode = t.mode),
      (e.dilation = t.dilation),
      (e.systemicChecks = t.systemicChecks),
      (e.eyes = t.eyes),
      e
    );
  }
  function Bi(e, t) {
    ((e.mode = t),
      Object.keys(e.eyes).forEach((n) => {
        let r = e.eyes[n];
        It[t].some((l) => l.value === r.areaSeen) || (r.areaSeen = "");
      }));
  }
  function _i(e, t) {
    e.dilation = t;
  }
  function Fi(e, t, n) {
    e.systemicChecks[t] = n;
  }
  function Vt(e, t, n) {
    e.eyes[t].distanceVA = n;
  }
  function Pt(e, t, n, r) {
    e.eyes[t][n] = r;
  }
  function $i(e, t, n, r) {
    let l = e.eyes[t].findings;
    if (n === "noReferableSignsSeen") {
      ((l.noReferableSignsSeen = r),
        r &&
          gi.forEach((u) => {
            l[u] = !1;
          }));
      return;
    }
    ((l[n] = r), r && (l.noReferableSignsSeen = !1));
  }
  var H = {
      incomplete: 0,
      routineScreen: 1,
      ungradable: 2,
      routineReferral: 3,
      referSoon: 4,
      urgent: 5,
    },
    ht = {
      incomplete: {
        title: "Record both eyes",
        next: "Complete R/L VA, view and findings.",
        tone: "neutral",
      },
      routineScreen: {
        title: "Routine (screening)",
        next: "Continue local screening pathway.",
        tone: "green",
      },
      ungradable: {
        title: "Ungradable (repeat)",
        next: "Repeat dilated view/photo; refer if still poor.",
        tone: "orange",
      },
      routineReferral: {
        title: "Routine (weeks)",
        next: "Refer routinely when possible.",
        tone: "green",
      },
      referSoon: {
        title: "Soon (days)",
        next: "Refer within days.",
        tone: "orange",
      },
      urgent: {
        title: "Urgent (today)",
        next: "Same-day eye referral.",
        tone: "red",
      },
    },
    ya = new Set(["6/36", "6/60", "HM", "fix_follow_poor"]),
    Sa = new Set(["unable_test"]),
    xa = new Set(["6/12", "fix_follow_good"]);
  function qt(e, t) {
    return t.filter((n) => !!e[n]);
  }
  function Ot(e) {
    return e
      .map((t) => {
        var n, r;
        return (
          ((n = Tt[t]) == null ? void 0 : n.shortLabel) ||
          ((r = Tt[t]) == null ? void 0 : r.label)
        );
      })
      .filter(Boolean);
  }
  function Aa(e) {
    return ya.has(e)
      ? "reduced"
      : Sa.has(e)
        ? "untestable"
        : xa.has(e)
          ? "mild"
          : "none";
  }
  function Ea(e) {
    return e.viewQuality === "clear" && e.areaSeen && e.areaSeen !== "limited";
  }
  function Ca(e) {
    return (
      e.viewQuality === "ungradable" ||
      e.viewQuality === "partial" ||
      e.viewQuality === "hazy" ||
      e.areaSeen === "limited"
    );
  }
  function Ma(e) {
    return !!(
      e.distanceVA ||
      e.viewQuality ||
      e.areaSeen ||
      Object.values(e.findings).some(Boolean)
    );
  }
  function Ra(e, t, n) {
    let r = pi[e],
      l = t.findings,
      u = qt(l, vi),
      f = qt(l, wi),
      h = qt(l, bi),
      m = [...u, ...f, ...h].length > 0,
      g = Aa(t.distanceVA),
      b = g === "reduced" || g === "untestable",
      E = f.length > 0 || (b && m),
      L = Ca(t),
      D = Ea(t),
      k = Ma(t),
      C = {
        eyeKey: e,
        eyeLabel: r,
        viewAdequate: D,
        viewLimited: L,
        selectedFindings: pt(l),
        vaRisk: g,
        priority: H.incomplete,
        actionKey: "incomplete",
        reasons: [],
        limitations: [],
        summary: "Not recorded",
      };
    if (u.length > 0)
      return {
        ...C,
        priority: H.urgent,
        actionKey: "urgent",
        reasons: Ot(u),
        limitations: L ? ["limited view"] : [],
        summary: "Urgent",
      };
    if (E) {
      let T = Ot(f);
      return (
        b &&
          T.push(
            `${je(t.distanceVA)} VA${f.length === 0 ? " with DR signs" : ""}`,
          ),
        {
          ...C,
          priority: H.referSoon,
          actionKey: "referSoon",
          reasons: T,
          limitations: L ? ["limited view"] : [],
          summary: "Refer soon",
        }
      );
    }
    return h.length > 0
      ? {
          ...C,
          priority: H.routineReferral,
          actionKey: "routineReferral",
          reasons: Ot(h),
          limitations: L ? ["limited view"] : [],
          summary: "Routine referral",
        }
      : L
        ? {
            ...C,
            priority: H.ungradable,
            actionKey: "ungradable",
            reasons: [
              t.viewQuality === "ungradable"
                ? "Ungradable view"
                : "Limited view",
            ],
            limitations: ["not reassuring"],
            summary: "Ungradable",
          }
        : b
          ? {
              ...C,
              priority: H.routineReferral,
              actionKey: "routineReferral",
              reasons: [`${je(t.distanceVA)} VA without DR signs`],
              summary: "Review VA",
            }
          : t.distanceVA && D && l.noReferableSignsSeen
            ? {
                ...C,
                priority: H.routineScreen,
                actionKey: "routineScreen",
                reasons: ["No signs in view"],
                summary: "No referable signs",
              }
            : k
              ? {
                  ...C,
                  reasons: [
                    t.distanceVA ? "Complete view and findings" : "Record VA",
                  ],
                  summary: "Incomplete",
                }
              : C;
  }
  function La(e, t) {
    return e.priority !== t.priority
      ? t.priority - e.priority
      : e.eyeKey === "right"
        ? -1
        : t.eyeKey === "right"
          ? 1
          : 0;
  }
  function Da(e) {
    let t = [];
    return (
      e.dilation === "no" && t.push("Not dilated."),
      e.dilation || t.push("Dilation not recorded."),
      e.mode === "holo-bio" &&
        e.dilation !== "yes" &&
        t.push("Holo view limited without dilation."),
      t
    );
  }
  function Ia(e) {
    let t = [],
      n = [];
    return (
      Object.entries(e.systemicChecks).forEach(([r, l]) => {
        let u = r === "hba1c" ? "HbA1c" : r === "bp" ? "BP" : "lipids";
        l ? t.push(u) : n.push(u);
      }),
      { checked: t, unchecked: n }
    );
  }
  function Wi(e) {
    let t = ["Screening required. View only."];
    return (e.unchecked.length > 0 && t.push("Medical review if possible."), t);
  }
  function Bt(e) {
    let t = Object.entries(e.eyes).map(([b, E]) => Ra(b, E, e)),
      n = [...t].sort(La),
      r = n[0],
      l = ht[r.actionKey],
      u = Da(e),
      f = Ia(e),
      h = t.filter((b) => b.actionKey === "incomplete"),
      v = t.filter((b) => b.viewLimited),
      m = [],
      g = [];
    if (r.priority === H.incomplete) m.push("R/L recording incomplete.");
    else if (r.priority === H.routineScreen)
      if (t.every((E) => E.actionKey === "routineScreen"))
        m.push(
          "Both eyes have adequate views and no referable signs selected.",
        );
      else {
        if (t.find((D) => D.viewLimited)) return ka(e, t, u, f);
        if (t.find((D) => D.actionKey === "incomplete")) return Ta(t, u, f);
      }
    else
      n.filter(
        (E) => E.priority === r.priority && E.priority > H.incomplete,
      ).forEach((E) => {
        m.push(
          `${E.eyeLabel}: ${E.reasons.join(", ") || ht[E.actionKey].title}.`,
        );
      });
    return (
      v.forEach((b) =>
        g.push(`${b.eyeLabel}: limited view; other findings may be missed.`),
      ),
      t.forEach((b) => {
        (!e.eyes[b.eyeKey].distanceVA &&
          b.priority > H.incomplete &&
          g.push(`${b.eyeLabel}: VA not recorded.`),
          e.eyes[b.eyeKey].findings.venousBeading &&
            g.push(
              `${b.eyeLabel}: assess extent; severity cannot be graded here.`,
            ));
      }),
      h
        .filter((b) => r.priority > H.incomplete)
        .forEach((b) => g.push(`${b.eyeLabel}: incomplete.`)),
      u.forEach((b) => g.push(b)),
      {
        actionKey: r.actionKey,
        priority: r.priority,
        title: l.title,
        tone: l.tone,
        reasons: m,
        limitations: g,
        next: l.next,
        safety: Wi(f),
        systemic: f,
        eyes: t,
      }
    );
  }
  function ka(e, t, n, r) {
    let l = ht.ungradable,
      u = [];
    return (
      t
        .filter((f) => f.viewLimited)
        .forEach((f) =>
          u.push(`${f.eyeLabel}: ${f.reasons.join(", ") || "not assessable"}.`),
        ),
      n.forEach((f) => u.push(f)),
      {
        actionKey: "ungradable",
        priority: H.ungradable,
        title: l.title,
        tone: l.tone,
        reasons: ["One eye not assessable."],
        limitations: u,
        next: l.next,
        safety: [
          "Repeat dilated view/photo if possible.",
          "Screening still required.",
        ],
        systemic: r,
        eyes: t,
      }
    );
  }
  function Ta(e, t, n) {
    let r = ht.incomplete,
      l = [];
    return (
      e
        .filter((u) => u.actionKey === "incomplete")
        .forEach((u) => l.push(`${u.eyeLabel}: incomplete.`)),
      t.forEach((u) => l.push(u)),
      {
        actionKey: "incomplete",
        priority: H.incomplete,
        title: r.title,
        tone: r.tone,
        reasons: ["R/L recording incomplete."],
        limitations: l,
        next: r.next,
        safety: Wi(n),
        systemic: n,
        eyes: e,
      }
    );
  }
  function Na(e) {
    let t = pt(e.findings);
    return t.length > 0 ? t.join(", ") : "not recorded";
  }
  function Va(e) {
    let t = { bp: "BP", lipids: "lipids", hba1c: "HbA1c" },
      n = fi
        .filter((r) => e.systemicChecks[r.key])
        .map((r) => t[r.key] || r.label.replace(/\s+checked$/i, ""));
    return n.length > 0 ? n.join(", ") : "none recorded";
  }
  function Yi(e, t, n) {
    let r = [
        `VA ${je(t.distanceVA)}`,
        `view ${t.viewQuality || "not recorded"}`,
        `findings: ${Na(t)}`,
      ],
      l = Si(n, t.areaSeen);
    return (
      l !== "Not recorded" && r.splice(2, 0, l),
      `${e}: ${r.join("; ")}.`
    );
  }
  function Hi(e, t) {
    let n = [];
    (n.push(`Diabetic retinal triage: ${t.title}.`),
      n.push(`Mode: ${hi[e.mode]}. Dilated: ${e.dilation || "not recorded"}.`),
      n.push(Yi("RE", e.eyes.right, e.mode)),
      n.push(Yi("LE", e.eyes.left, e.mode)));
    let r = [...t.reasons, ...t.limitations];
    return (
      r.length > 0 && n.push(`Reason: ${r.join(" ")}`),
      n.push(`Plan: ${t.next}`),
      n.push(`Systemic: ${Va(e)}.`),
      n.push("Screening still required."),
      n.join(`
`)
    );
  }
  var Ui = Q.map((e, t) => ({
    id: e.id,
    level: t === 0 ? "primary" : t < 4 ? "intermediate" : "advanced",
    title: `Case ${t + 1}`,
    imageLabel: `${t + 1}/10`,
    imageSrc: e.thumbSrc || e.src,
    prompt: e.summary,
    answer: e.description || [],
  }));
  var _t = {
      primary: {
        title: "Primary",
        passMark: 3,
        questionCount: 5,
        targetBankSize: 16,
      },
      intermediate: {
        title: "Intermediate",
        passMark: 4,
        questionCount: 6,
        targetBankSize: 26,
      },
      advanced: {
        title: "Advanced",
        passMark: 6,
        questionCount: 8,
        targetBankSize: 26,
      },
    },
    zi = {
      "nhs-des-grading-2025": {
        title: "NHS Diabetic Eye Screening Programme grading definitions",
        url: "https://www.gov.uk/government/publications/diabetic-eye-screening-retinal-image-grading-criteria/nhs-diabetic-eye-screening-programme-grading-definitions-for-referable-disease-start-date-october-01",
        reviewed: "2026-07-26",
      },
      "diabetic-app-scope-v1": {
        title: "Diabetic app v1 scope and recording workflow",
        url: null,
        reviewed: "2026-07-26",
      },
      "diabetic-app-triage-v1": {
        title: "Diabetic app v1 LMIC-oriented triage rules",
        url: null,
        reviewed: "2026-07-26",
        status: "Pending independent clinical sign-off",
      },
    },
    Pa = {
      primary: [
        {
          question: "What does an ungradable view mean?",
          options: [
            "Normal retina",
            "Cannot assess safely",
            "No screening needed",
            "Only BP review",
          ],
          answer: 1,
          topic: "view-quality",
        },
        {
          question:
            "What is the safest wording after a partial clear view with no lesions seen?",
          options: [
            "Normal",
            "No referable signs seen in the view obtained",
            "No DR ever",
            "Discharge forever",
          ],
          answer: 1,
          topic: "safety-copy",
        },
        {
          question:
            "Which finding is the earliest visible sign of diabetic retinopathy?",
          options: [
            "Microaneurysms",
            "New vessels at the disc",
            "Vitreous haemorrhage",
            "Preretinal haemorrhage",
          ],
          answer: 0,
          topic: "npdr",
        },
        {
          question: "Which finding is a red flag?",
          options: ["CWS", "Dot/blot haemorrhage", "NVE", "Microaneurysm"],
          answer: 2,
          topic: "pdr",
        },
        {
          question: "What should Holo (BIO) prompt before recording the view?",
          options: [
            "Local dilation check",
            "Anti-VEGF choice",
            "Laser choice",
            "Spectacle prescription",
          ],
          answer: 0,
          topic: "dilation",
        },
        {
          question: "Which action fits possible vitreous haemorrhage?",
          options: [
            "Routine screening only",
            "Urgent today",
            "Ignore if VA is good",
            "Medical review only",
          ],
          answer: 1,
          topic: "urgent",
        },
        {
          question:
            "What does Distance VA 6/36 suggest when DR signs are present?",
          options: [
            "Possible macula risk",
            "No concern",
            "Confirmed DMO",
            "Confirmed proliferative DR",
          ],
          answer: 0,
          topic: "va",
        },
        {
          question: "Which measure reflects longer-term glycaemic control?",
          options: [
            "HbA1c",
            "A single random glucose",
            "Blood pressure",
            "Serum cholesterol",
          ],
          answer: 0,
          topic: "systemic",
        },
        {
          question: "What should the app record for eyes?",
          options: [
            "Right and left eyes",
            "Only the better eye",
            "Only the first eye seen",
            "No eye label",
          ],
          answer: 0,
          topic: "both-eyes",
        },
        {
          question: "Which option belongs to Arclight (DO) area seen?",
          options: [
            "Limited glimpses only",
            "Four-quadrant sweep",
            "OCT cube",
            "Fluorescein frame",
          ],
          answer: 0,
          topic: "mode",
        },
        {
          question: "Which option belongs to Holo (BIO)?",
          options: [
            "Four-quadrant sweep",
            "Spectacle axis",
            "Near add",
            "K reading",
          ],
          answer: 0,
          topic: "mode",
        },
        {
          question: "What does no referable signs mean?",
          options: [
            "No referable signs seen in the view obtained",
            "No diabetes",
            "Full normal retina",
            "Discharge from screening",
          ],
          answer: 0,
          topic: "safety-copy",
        },
        {
          question: "What is the app mainly for?",
          options: [
            "DR triage and teaching",
            "OCT diagnosis",
            "Treatment selection",
            "AI grading",
          ],
          answer: 0,
          topic: "scope",
        },
        {
          question: "Which is a macula-risk clue?",
          options: [
            "Hard exudates near macula",
            "Normal disc colour",
            "No diabetes history",
            "Clear lens",
          ],
          answer: 0,
          topic: "macula",
        },
        {
          question:
            "If both eyes are adequate with no referable signs, what remains required?",
          options: [
            "Routine diabetic screening",
            "No future screening",
            "Laser today",
            "Ignore diabetes",
          ],
          answer: 0,
          topic: "safety-copy",
        },
        {
          question: "Which sign suggests proliferative DR?",
          options: [
            "New vessels",
            "Microaneurysms",
            "Cotton-wool spots",
            "Hard exudates",
          ],
          answer: 0,
          topic: "pdr",
        },
      ],
      intermediate: [
        {
          question:
            "A few microaneurysms and dot/blot haemorrhages are seen, without macular or proliferative signs. Which app action applies?",
          options: [
            "Routine (weeks)",
            "Urgent today",
            "No screening required",
            "Choose laser",
          ],
          answer: 0,
          topic: "npdr",
        },
        {
          question:
            "Hard exudates near macula with 6/36 VA should usually trigger:",
          options: [
            "Soon (days)",
            "Routine screening only",
            "No action",
            "Confirmed DMO treatment",
          ],
          answer: 0,
          topic: "macula",
        },
        {
          question:
            "Which VA value is a documented reduced-VA trigger when DR context is present?",
          options: ["6/36", "6/6", "Blank", "Fix/follow"],
          answer: 0,
          topic: "va",
        },
        {
          question: "Which VA value is mild and should not escalate by itself?",
          options: ["6/12", "6/60", "HM", "No fix"],
          answer: 0,
          topic: "va",
        },
        {
          question: "One eye is clear, the other ungradable. Best output?",
          options: [
            "Ungradable or limited, not reassuring",
            "Routine screening only",
            "Normal",
            "Urgent laser",
          ],
          answer: 0,
          topic: "view-quality",
        },
        {
          question: "NVE in one eye and ungradable fellow eye should trigger:",
          options: [
            "Urgent today",
            "Ungradable only",
            "Routine screening",
            "No referral",
          ],
          answer: 0,
          topic: "priority",
        },
        {
          question:
            "What should ungradable fellow-eye information become when proliferative signs are seen in the other eye?",
          options: [
            "Limitation note",
            "Main action overriding proliferative signs",
            "Deleted",
            "Treatment choice",
          ],
          answer: 0,
          topic: "priority",
        },
        {
          question:
            "Which finding is macula risk rather than proliferative disease?",
          options: [
            "Hard exudates near macula",
            "NVD",
            "NVE",
            "Vitreous haemorrhage",
          ],
          answer: 0,
          topic: "macula",
        },
        {
          question: "Which finding is proliferative?",
          options: [
            "New vessels at disc",
            "Cotton-wool spots",
            "Microaneurysms",
            "Hard exudates",
          ],
          answer: 0,
          topic: "pdr",
        },
        {
          question:
            "A brief Arclight (DO) glimpse should usually be recorded as:",
          options: [
            "Limited unless disc and macula are clearly seen",
            "Full four-quadrant view",
            "Confirmed normal retina",
            "Confirmed no maculopathy",
          ],
          answer: 0,
          topic: "mode",
        },
        {
          question: "BP, lipids and HbA1c tick-boxes should:",
          options: [
            "Support medical review without changing retinal urgency",
            "Always make urgent",
            "Replace eye findings",
            "Confirm DMO",
          ],
          answer: 0,
          topic: "systemic",
        },
        {
          question:
            "If a cotton-wool spot is seen, what is the safest next step?",
          options: [
            "Record it and look carefully for other DR features",
            "Call no referable signs",
            "Ignore it",
            "Record a normal retina",
          ],
          answer: 0,
          topic: "npdr",
        },
        {
          question:
            "If lesions are visible, no referable signs is unsafe because:",
          options: [
            "A finding has been seen",
            "VA is always normal",
            "Dilation is impossible",
            "Macula is always clear",
          ],
          answer: 0,
          topic: "safety-copy",
        },
        {
          question:
            "What is a safe Action-panel phrase after no lesions in partial view?",
          options: [
            "No referable signs seen in the view obtained",
            "Normal retina",
            "No DR in either eye",
            "Discharge",
          ],
          answer: 0,
          topic: "safety-copy",
        },
        {
          question: "What should the referral note include?",
          options: [
            "Right and left eye sections",
            "Only one combined eye",
            "Treatment dose",
            "Laser plan",
          ],
          answer: 0,
          topic: "referral-note",
        },
        {
          question: "Reduced VA with hard exudates near the macula suggests:",
          options: [
            "Macula risk needing soon referral",
            "Confirmed PDR",
            "No retinal concern",
            "Systemic review only",
          ],
          answer: 0,
          topic: "macula",
        },
        {
          question: "Which sign belongs in proliferative signs?",
          options: ["NVE", "CWS", "Microaneurysm", "Hard exudate"],
          answer: 0,
          topic: "pdr",
        },
        {
          question: "Which wording is safest for suspected maculopathy?",
          options: [
            "Possible maculopathy or macula risk",
            "Confirmed DMO",
            "No DR",
            "Laser required",
          ],
          answer: 0,
          topic: "macula",
        },
        {
          question:
            "In this app, what action applies to DR signs without macular or proliferative features?",
          options: [
            "Routine (weeks)",
            "Urgent today",
            "No follow-up ever",
            "Anti-VEGF decision",
          ],
          answer: 0,
          topic: "npdr",
        },
        {
          question: "What should suspected foveal involvement trigger?",
          options: ["Soon (days)", "Routine only", "Ignore", "Confirmed DMO"],
          answer: 0,
          topic: "macula",
        },
        {
          question: "What does No test VA mean?",
          options: [
            "A limitation",
            "Perfect vision",
            "Confirmed proliferative DR",
            "No referral possible",
          ],
          answer: 0,
          topic: "va",
        },
        {
          question:
            "Which viewing method usually needs dilation for wider assessment?",
          options: [
            "Holo (BIO)",
            "Referral note",
            "VA line",
            "Systemic checks",
          ],
          answer: 0,
          topic: "dilation",
        },
        {
          question:
            "The teaching viewer is dilated but the patient was not. What should the examination record say?",
          options: [
            "Dilated: No",
            "Dilated: Yes",
            "Leave both eye findings blank",
            "Change the recorded VA",
          ],
          answer: 0,
          topic: "dilation",
        },
        {
          question: "What wins in mixed-risk findings?",
          options: [
            "Highest-risk sign",
            "First ticked sign",
            "Lowest-risk sign",
            "Drawer order",
          ],
          answer: 0,
          topic: "priority",
        },
        {
          question: "What should the app avoid?",
          options: [
            "Treatment selection",
            "Referral note",
            "Both-eye recording",
            "VA recording",
          ],
          answer: 0,
          topic: "scope",
        },
        {
          question: "Which DR sign makes a routine case more concerning?",
          options: [
            "Venous beading",
            "Normal disc colour",
            "Clear lens",
            "Equal pupils",
          ],
          answer: 0,
          topic: "npdr",
        },
      ],
      advanced: [
        {
          question: "Right eye NVD, left eye ungradable. Overall action?",
          options: [
            "Urgent today, with left-eye limitation note",
            "Ungradable only",
            "Routine referral",
            "Routine screening",
          ],
          answer: 0,
          topic: "priority",
        },
        {
          question:
            "Right eye clear adequate, left eye ungradable. Overall action?",
          options: [
            "Ungradable or limited view",
            "Routine screening still required only",
            "Urgent today",
            "No note needed",
          ],
          answer: 0,
          topic: "priority",
        },
        {
          question:
            "Both views are adequate with no signs selected but one VA is blank. What is appropriate?",
          options: [
            "Complete the missing VA before routine screening output",
            "Assume the missing VA is 6/6",
            "Diagnose macular oedema",
            "Treat the clear view as a VA test",
          ],
          answer: 0,
          topic: "routine",
          explanation:
            "A clear retinal view does not measure vision. Complete the missing VA before issuing a reassuring routine result.",
        },
        {
          question:
            "A patient reports sudden visual loss but the limited view shows no DR. How should this tool be used?",
          options: [
            "Assess the acute complaint separately; this screening tool cannot clear it",
            "Use the no-signs result to exclude urgent disease",
            "Assume cataract without further assessment",
            "Wait for the next screening visit",
          ],
          answer: 0,
          topic: "scope",
        },
        {
          question: "6/36 VA plus dot/blot haemorrhages should support:",
          options: [
            "Soon (days)",
            "No action",
            "Confirmed proliferative DR",
            "Treatment choice",
          ],
          answer: 0,
          topic: "va",
        },
        {
          question:
            "A patient fixes and follows but cannot complete a chart test. Which interpretation is justified?",
          options: [
            "Record the observation without assigning a Snellen equivalent",
            "Record 6/6",
            "Exclude macular disease",
            "Omit the retinal examination",
          ],
          answer: 0,
          topic: "va",
        },
        {
          question: "No fix with DR signs should be treated as:",
          options: [
            "Reduced VA supporting Soon (days)",
            "Normal VA",
            "Confirmed proliferative DR",
            "No test needed",
          ],
          answer: 0,
          topic: "va",
        },
        {
          question: "No test VA with DR signs should:",
          options: [
            "Prevent reassuring wording and support Soon (days)",
            "Confirm normal vision",
            "Delete DR signs",
            "Choose laser",
          ],
          answer: 0,
          topic: "va",
        },
        {
          question:
            "Which finding should never be downgraded by ungradable fellow-eye view?",
          options: ["NVE", "Microaneurysm only", "No signs", "Blank VA"],
          answer: 0,
          topic: "priority",
        },
        {
          question: "Which combination is macula risk?",
          options: [
            "Hard exudates near macula plus reduced VA",
            "Clear view plus 6/6",
            "No signs plus blank VA",
            "BP checked only",
          ],
          answer: 0,
          topic: "macula",
        },
        {
          question: "Why avoid confirmed DMO wording?",
          options: [
            "OCT or stereo assessment is needed",
            "VA is never relevant",
            "DR cannot affect macula",
            "Referral notes cannot mention macula",
          ],
          answer: 0,
          topic: "macula",
        },
        {
          question:
            "Fine abnormal vessels cross the disc surface despite good VA. What drives the next step?",
          options: [
            "Suspected NVD warrants urgent assessment despite good VA",
            "Good VA excludes proliferative disease",
            "Wait until central vision falls",
            "Record no signs if the macula looks clear",
          ],
          answer: 0,
          topic: "pdr",
        },
        {
          question:
            "If one eye has no signs and the fellow eye has NVE, overall action is:",
          options: [
            "Urgent today",
            "Routine screening only",
            "No referral",
            "Medical review only",
          ],
          answer: 0,
          topic: "priority",
        },
        {
          question:
            "Arclight (DO) cannot see the far periphery well. The key limitation is:",
          options: [
            "Peripheral disease may be missed",
            "Macula is always invisible",
            "VA cannot be recorded",
            "Dilation is irrelevant",
          ],
          answer: 0,
          topic: "mode",
        },
        {
          question:
            "NVD is visible through a hazy view in the same eye. What should the referral include?",
          options: [
            "Urgent findings and the limited view",
            "Only the NVD because urgency removes limitations",
            "Only the haze until the view improves",
            "A normal peripheral examination",
          ],
          answer: 0,
          topic: "referral-note",
        },
        {
          question: "Which systemic action is sensible in LMIC settings?",
          options: [
            "Arrange diabetes/medical review when possible",
            "Ignore BP",
            "Let HbA1c change retinal urgency",
            "Use lipids as proliferative sign",
          ],
          answer: 0,
          topic: "systemic",
        },
        {
          question:
            "Which output should be avoided for limited Arclight (DO) view?",
          options: [
            "Normal retina",
            "Limitation note",
            "Routine screening reminder",
            "Referral note",
          ],
          answer: 0,
          topic: "safety-copy",
        },
        {
          question:
            "Which finding is enough for same-day referral even if VA is not recorded?",
          options: [
            "NVD",
            "Microaneurysm only",
            "Mild hard exudate",
            "No signs",
          ],
          answer: 0,
          topic: "urgent",
        },
        {
          question:
            "Suspected vitreous blood obscures the fundus and the patient cannot perform VA testing. Which response is safest?",
          options: [
            "Retain urgent referral and record both assessment limitations",
            "Wait for measurable VA before referring",
            "Treat the obscured fundus as no DR",
            "Use the fellow-eye VA for this eye",
          ],
          answer: 0,
          topic: "urgent",
        },
        {
          question: "What should an urgent proliferative output emphasise?",
          options: [
            "Same-day eye referral",
            "Routine annual screening only",
            "Spectacle prescription",
            "No follow-up",
          ],
          answer: 0,
          topic: "urgent",
        },
        {
          question: "When R/L findings conflict, triage should use:",
          options: [
            "The highest-risk eye finding",
            "The better eye only",
            "The first completed field",
            "VA alone",
          ],
          answer: 0,
          topic: "priority",
        },
        {
          question:
            "Venous beading is recorded without its extent. What can this app conclude?",
          options: [
            "DR is present but full severity cannot be graded",
            "Severe NPDR is excluded",
            "PDR is confirmed",
            "Macular oedema is confirmed",
          ],
          answer: 0,
          topic: "npdr",
        },
        {
          question:
            "Venous beading is seen. What is the safest interpretation?",
          options: [
            "Record it and assess extent plus other ischaemic signs",
            "Call it proliferative disease by itself",
            "Treat it as a normal vessel",
            "Confirm diabetic macular oedema",
          ],
          answer: 0,
          topic: "npdr",
        },
        {
          question: "Which statement about Holo (BIO) is safest?",
          options: [
            "It can record four-quadrant sweep but only reports selected findings",
            "It confirms no DR if clear",
            "It replaces screening forever",
            "It chooses treatment",
          ],
          answer: 0,
          topic: "mode",
        },
        {
          question: "Which statement about Arclight (DO) is safest?",
          options: [
            "It should not imply a complete peripheral assessment",
            "It always sees four quadrants",
            "It confirms no maculopathy",
            "It replaces referral",
          ],
          answer: 0,
          topic: "mode",
        },
        {
          question:
            "Ungradable view with suspected vitreous blood should be treated as:",
          options: [
            "Urgent today",
            "Routine screening only",
            "No DR",
            "Confirmed DMO",
          ],
          answer: 0,
          topic: "urgent",
        },
      ],
    },
    qa = {
      "view-quality": {
        explanation:
          "An inadequate view cannot exclude retinal disease. Record the limitation rather than describing the retina as normal.",
        source: "diabetic-app-scope-v1",
      },
      "safety-copy": {
        explanation:
          "Use wording that describes only what was actually seen and does not turn a limited view into reassurance.",
        source: "diabetic-app-scope-v1",
      },
      npdr: {
        explanation:
          "Microaneurysms and retinal haemorrhages are non-proliferative signs. Venous beading or IRMA can indicate more severe pre-proliferative disease and require fuller assessment.",
        source: "nhs-des-grading-2025",
      },
      pdr: {
        explanation:
          "New vessels, pre-retinal haemorrhage and vitreous haemorrhage are proliferative or potentially sight-threatening findings.",
        source: "nhs-des-grading-2025",
      },
      dilation: {
        explanation:
          "A wider retinal examination commonly needs dilation, but local contraindications and the reason for non-dilation must be recorded.",
        source: "diabetic-app-scope-v1",
      },
      urgent: {
        explanation:
          "The app uses its urgent action for active proliferative signs or suspected vitreous blood. The local referral pathway still requires clinical approval.",
        source: "diabetic-app-triage-v1",
      },
      va: {
        explanation:
          "Reduced or unmeasured visual acuity adds concern in the presence of retinal findings but does not diagnose macular oedema by itself.",
        source: "diabetic-app-triage-v1",
      },
      systemic: {
        explanation:
          "Blood pressure, glycaemic control and lipids support wider diabetes care but do not replace the retinal finding that determines eye urgency.",
        source: "diabetic-app-triage-v1",
      },
      "both-eyes": {
        explanation:
          "Record each eye separately because disease severity, image quality and referral drivers can differ between eyes.",
        source: "diabetic-app-scope-v1",
      },
      mode: {
        explanation:
          "The viewing method describes the examination obtained. It must not imply that unseen peripheral retina was assessed.",
        source: "diabetic-app-scope-v1",
      },
      scope: {
        explanation:
          "This app supports recording, triage prompts and teaching. It does not make a diagnosis or select treatment.",
        source: "diabetic-app-scope-v1",
      },
      macula: {
        explanation:
          "Hard exudates near the macula with reduced vision can support concern for maculopathy, but confirmation needs an appropriate macular assessment.",
        source: "nhs-des-grading-2025",
      },
      priority: {
        explanation:
          "The highest-risk recorded eye finding drives the overall action. A poor view in the fellow eye remains an important limitation.",
        source: "diabetic-app-triage-v1",
      },
      "referral-note": {
        explanation:
          "A useful referral note records each eye, visual acuity, view quality, dilation status, findings and the action driver.",
        source: "diabetic-app-scope-v1",
      },
      routine: {
        explanation:
          "No referable signs in an adequate recorded view does not end future diabetic eye screening.",
        source: "diabetic-app-triage-v1",
      },
    },
    Ft = Object.fromEntries(
      Object.entries(Pa).map(([e, t]) => [
        e,
        t.map((n, r) => ({
          id: `diabetic-${e}-${String(r + 1).padStart(2, "0")}`,
          ...qa[n.topic],
          ...n,
        })),
      ]),
    );
  function Xi(e) {
    let t = [...e];
    for (let n = t.length - 1; n > 0; n -= 1) {
      let r = Math.floor(Math.random() * (n + 1));
      [t[n], t[r]] = [t[r], t[n]];
    }
    return t;
  }
  function Oa(e) {
    let t = e.options.map((r, l) => ({ label: r, originalIndex: l })),
      n = Xi(t);
    return {
      ...e,
      options: n,
      answer: n.findIndex((r) => r.originalIndex === e.answer),
    };
  }
  function Be(e, t, n) {
    let r = document.createElement(e);
    return (t && (r.className = t), n && (r.textContent = n), r);
  }
  function ji() {
    let e = new Set(),
      t = new Set();
    return Object.entries(_t).map(([n, r]) => {
      let l = Ft[n] || [],
        u = l.filter(
          (h) =>
            !Array.isArray(h.options) ||
            h.answer < 0 ||
            h.answer >= h.options.length,
        ),
        f = l.filter((h) => {
          var b;
          let v = h.question.trim().toLocaleLowerCase(),
            m = h.options.map((E) => E.trim().toLocaleLowerCase()),
            g =
              !h.id ||
              e.has(h.id) ||
              !h.question.trim() ||
              t.has(v) ||
              new Set(m).size !== m.length ||
              !((b = h.explanation) != null && b.trim()) ||
              !zi[h.source];
          return (e.add(h.id), t.add(v), g);
        });
      return {
        level: n,
        expected: r.targetBankSize,
        actual: l.length,
        invalidAnswers: u.length,
        invalidQuestions: f.length,
      };
    });
  }
  function Ba(e, t, n) {
    let r = Array.isArray(t) ? t : [],
      l = e.length > 0 && r.length === e.length && r.every(Number.isInteger),
      u = e.reduce((f, h, v) => f + (r[v] === h.answer ? 1 : 0), 0);
    return {
      isComplete: l,
      score: u,
      passed: l && u >= n,
      missedTopics: e.filter((f, h) => r[h] !== f.answer).map((f) => f.topic),
    };
  }
  function Qi(e) {
    let t = [],
      n = null,
      r = null,
      l = !1;
    function u() {
      e.closeModal(e.modal);
    }
    function f(m, g) {
      let b = Be("fieldset", "mcq-question");
      b.dataset.questionId = m.id;
      let E = Be("legend", "mcq-question-title", `${g + 1}. ${m.question}`);
      (b.append(E),
        m.options.forEach((D, k) => {
          let C = Be("label", "mcq-option"),
            T = document.createElement("input");
          ((T.type = "radio"), (T.name = `mcq_${g}`), (T.value = String(k)));
          let q = Be("span", "", D.label);
          (C.append(T, q), b.append(C));
        }));
      let L = Be("p", "mcq-explanation");
      return (
        (L.hidden = !0),
        L.setAttribute("aria-live", "polite"),
        b.append(L),
        b
      );
    }
    function h(m) {
      let g = _t[m],
        b = Ft[m];
      !g ||
        !b ||
        ((r = m),
        (n = g),
        (l = !1),
        (t = Xi(b).slice(0, g.questionCount).map(Oa)),
        (e.title.textContent = `${g.title} MCQ`),
        (e.intro.textContent = `${g.questionCount} questions. Pass mark ${g.passMark}.`),
        (e.result.textContent = ""),
        (e.result.className = "mcq-result"),
        (e.submit.textContent = "Submit"),
        (e.submit.disabled = !1),
        e.container.replaceChildren(...t.map(f)),
        e.openModal(e.modal, e.modalContent, e.returnFocus));
    }
    function v() {
      var b;
      if (!n) return;
      if (l) {
        h(r);
        return;
      }
      let m = t.map((E, L) => {
          let D = e.container.querySelector(`input[name="mcq_${L}"]:checked`);
          return D ? Number(D.value) : null;
        }),
        g = Ba(t, m, n.passMark);
      if (!g.isComplete) {
        ((e.result.textContent =
          "Please answer all questions before submitting."),
          (e.result.className = "mcq-result is-review"));
        let E = m.findIndex((L) => !Number.isInteger(L));
        (b = e.container.querySelector(`input[name="mcq_${E}"]`)) == null ||
          b.focus();
        return;
      }
      if (
        (t.forEach((E, L) => {
          let D = m[L],
            k = e.container.querySelector(`[data-question-id="${E.id}"]`);
          e.container
            .querySelectorAll(`input[name="mcq_${L}"]`)
            .forEach((q) => {
              q.disabled = !0;
              let $ = q.closest(".mcq-option");
              $.classList.remove("is-correct", "is-wrong");
              let o = Number(q.value);
              (o === E.answer && $.classList.add("is-correct"),
                o === D && o !== E.answer && $.classList.add("is-wrong"));
            });
          let T = k == null ? void 0 : k.querySelector(".mcq-explanation");
          T && ((T.textContent = `Why: ${E.explanation}`), (T.hidden = !1));
        }),
        (e.result.textContent = `Score ${g.score}/${n.questionCount}. ${g.passed ? "Pass." : "Review and retry."}`),
        g.missedTopics.length > 0)
      ) {
        let E = Be(
          "p",
          "mcq-topics",
          `Review: ${[...new Set(g.missedTopics)].join(", ")}.`,
        );
        e.result.append(E);
      }
      (e.result.classList.toggle("is-pass", g.passed),
        e.result.classList.toggle("is-review", !g.passed),
        (l = !0),
        (e.submit.textContent = g.passed ? "New attempt" : "Try again"),
        (e.submit.disabled = !1));
    }
    return (
      e.close.addEventListener("click", u),
      e.submit.addEventListener("click", v),
      { open: h, close: u }
    );
  }
  function Gi({ menuButton: e, closeButton: t, drawer: n, overlay: r }) {
    let l = null;
    function u() {
      return [
        ...n.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ];
    }
    function f() {
      ((l = document.activeElement),
        (r.hidden = !1),
        n.classList.add("is-open"),
        r.classList.add("is-visible"),
        (n.inert = !1),
        n.removeAttribute("inert"),
        n.setAttribute("aria-hidden", "false"),
        e.setAttribute("aria-expanded", "true"),
        t.focus());
    }
    function h() {
      (n.classList.remove("is-open"),
        r.classList.remove("is-visible"),
        (r.hidden = !0),
        (n.inert = !0),
        n.setAttribute("inert", ""),
        n.setAttribute("aria-hidden", "true"),
        e.setAttribute("aria-expanded", "false"),
        l instanceof HTMLElement && l.focus(),
        (l = null));
    }
    return (
      e.addEventListener("click", f),
      t.addEventListener("click", h),
      r.addEventListener("click", h),
      document.addEventListener("keydown", (v) => {
        if (!n.classList.contains("is-open")) return;
        if (v.key === "Escape") {
          (v.preventDefault(), h());
          return;
        }
        if (v.key !== "Tab") return;
        let m = u();
        if (m.length === 0) return;
        let g = m[0],
          b = m[m.length - 1];
        v.shiftKey && document.activeElement === g
          ? (v.preventDefault(), b.focus())
          : !v.shiftKey &&
            document.activeElement === b &&
            (v.preventDefault(), g.focus());
      }),
      { open: f, close: h }
    );
  }
  function Ki({ button: e, popup: t, closeButton: n }) {
    function r() {
      ((t.hidden = !1),
        t.setAttribute("aria-hidden", "false"),
        e.setAttribute("aria-expanded", "true"),
        t.focus());
    }
    function l() {
      t.hidden ||
        ((t.hidden = !0),
        t.setAttribute("aria-hidden", "true"),
        e.setAttribute("aria-expanded", "false"),
        e.focus());
    }
    return (
      e.addEventListener("click", () => {
        t.hidden ? r() : l();
      }),
      n.addEventListener("click", l),
      document.addEventListener("keydown", (u) => {
        u.key === "Escape" && l();
      }),
      { open: r, close: l }
    );
  }
  function Ji({ tabs: e, panels: t = [], onChange: n }) {
    let r = [...e],
      l = [...t];
    function u(h) {
      let v = h.dataset.tabTarget;
      (r.forEach((m) => {
        let g = m === h;
        (m.classList.toggle("active", g),
          m.getAttribute("role") === "radio"
            ? m.setAttribute("aria-checked", String(g))
            : m.setAttribute("aria-selected", String(g)),
          (m.tabIndex = g ? 0 : -1));
      }),
        l.forEach((m) => {
          let g = m.id === v;
          (m.classList.toggle("active", g), (m.hidden = !g));
        }),
        n == null || n(h.dataset.mode));
    }
    function f(h) {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(h.key)) return;
      h.preventDefault();
      let m = r.indexOf(h.currentTarget),
        g = m;
      (h.key === "ArrowRight"
        ? (g = (m + 1) % r.length)
        : h.key === "ArrowLeft"
          ? (g = (m - 1 + r.length) % r.length)
          : h.key === "Home"
            ? (g = 0)
            : h.key === "End" && (g = r.length - 1),
        r[g].focus(),
        u(r[g]));
    }
    r.forEach((h) => {
      (h.addEventListener("click", () => u(h)),
        h.addEventListener("keydown", f));
    });
  }
  var $t = new WeakMap();
  function _a(e) {
    return [
      ...e.querySelectorAll(
        'button:not([disabled]):not([hidden]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ].filter((t) => !t.closest("[hidden]"));
  }
  function Qe(e, t, n = document.activeElement) {
    let r = n,
      l = (u) => {
        if (u.key === "Escape") {
          (u.preventDefault(), ge(e));
          return;
        }
        if (u.key !== "Tab") return;
        let f = _a(e);
        if (f.length === 0) {
          (u.preventDefault(), t == null || t.focus());
          return;
        }
        let h = f[0],
          v = f[f.length - 1];
        u.shiftKey && document.activeElement === h
          ? (u.preventDefault(), v.focus())
          : !u.shiftKey &&
            document.activeElement === v &&
            (u.preventDefault(), h.focus());
      };
    ($t.set(e, { opener: r, handleKeydown: l }),
      (e.hidden = !1),
      e.setAttribute("aria-hidden", "false"),
      document.addEventListener("keydown", l),
      t == null || t.focus());
  }
  function ge(e) {
    if (e.hidden) return;
    ((e.hidden = !0), e.setAttribute("aria-hidden", "true"));
    let t = $t.get(e);
    t &&
      (document.removeEventListener("keydown", t.handleKeydown),
      t.opener instanceof HTMLElement && t.opener.focus(),
      $t.delete(e));
  }
  function Fa(e = window.location, t = navigator) {
    return (
      "serviceWorker" in t &&
      (e.protocol === "http:" || e.protocol === "https:")
    );
  }
  function Zi() {
    Fa() &&
      window.addEventListener(
        "load",
        () => {
          navigator.serviceWorker
            .register("./sw.js", { scope: "./" })
            .catch((e) => {
              console.warn("Diabetic offline support could not start.", e);
            });
        },
        { once: !0 },
      );
  }
  var R = Nt(),
    ne = Bt(R),
    ae = !1,
    ue = !1,
    De = null,
    Ge = null,
    p = (e) => document.querySelector(e),
    _e = (e) => Array.from(document.querySelectorAll(e)),
    s = {
      canvas: p("#fundusCanvas"),
      fovToggle: p("#fovToggle"),
      fovLabelSmall: p("#fovLabelSmall"),
      fovLabelLeft: p("#fovLabelLeft"),
      fovLabelRight: p("#fovLabelRight"),
      eyeToggle: p("#eyeToggle"),
      eyeLabelRight: p("#eyeLabelRight"),
      eyeLabelLeft: p("#eyeLabelLeft"),
      cataractSlider: p("#cataractSlider"),
      cataractStops: _e(".cataract-stop"),
      viewerDilationToggle: p("#viewerDilationToggle"),
      gazeMoveToggle: p("#gazeMoveToggle"),
      viewerPigmentationToggle: p("#viewerPigmentationToggle"),
      viewerPigmentationText: p("#viewerPigmentationText"),
      viewerExplanation: p("#viewerExplanation"),
      previousCaseButton: p("#previousCaseButton"),
      nextCaseButton: p("#nextCaseButton"),
      viewerCaseLabel: p("#viewerCaseLabel"),
      viewerCaseShortLabel: p("#viewerCaseShortLabel"),
      viewerCaseSummaryToggle: p("#viewerCaseSummaryToggle"),
      viewerCaseDescription: p("#viewerCaseDescription"),
      viewerCaseDescriptionTitle: p("#viewerCaseDescriptionTitle"),
      viewerCaseDescriptionBody: p("#viewerCaseDescriptionBody"),
      rightDistanceVA: p("#rightDistanceVA"),
      leftDistanceVA: p("#leftDistanceVA"),
      rightViewStatusSelect: p("#rightViewStatusSelect"),
      leftViewStatusSelect: p("#leftViewStatusSelect"),
      findingsContainer: p("#findingsContainer"),
      recordingSystemPanel: p(".recording-system-panel"),
      recordingSystemContent: p("#recordingSystemContent"),
      recordingSystemToggle: p("#recordingSystemToggle"),
      actionPanel: p(".action-panel"),
      actionDetails: p("#actionDetails"),
      actionToggle: p("#actionToggle"),
      actionCard: p("#actionCard"),
      actionTone: p("#actionTone"),
      actionTitle: p("#actionTitle"),
      actionReasons: p("#actionReasons"),
      actionLimitations: p("#actionLimitations"),
      actionNext: p("#actionNext"),
      actionSafety: p("#actionSafety"),
      referralModal: p("#referralModal"),
      referralModalContent: p("#referralModalContent"),
      referralText: p("#referralText"),
      copyStatus: p("#copyStatus"),
      shareReferralButton: p("#shareReferralButton"),
      practiceModal: p("#practiceModal"),
      practiceModalContent: p("#practiceModalContent"),
      practiceCases: p("#practiceCases"),
      guideModal: p("#guideModal"),
      guideModalContent: p("#guideModalContent"),
      guideTitle: p("#guideTitle"),
      guideContent: p("#guideContent"),
      newAssessmentButton: p("#newAssessmentButton"),
      newAssessmentStatus: p("#newAssessmentStatus"),
    },
    oe = 0,
    ft = null,
    be = !1,
    mt = !1,
    Ie = null,
    en = new Map();
  function Yt(e) {
    return (R.viewer.pigmentation === "dark" && e.darkSrc) || e.src;
  }
  function un(e) {
    return Number.isFinite(e.viewScale) ? e.viewScale : 1;
  }
  var ke = ki({
      state: R,
      canvas: s.canvas,
      fovToggleCheckbox: s.fovToggle,
      fovLabelSmall: s.fovLabelSmall,
      fovLabelLeft: s.fovLabelLeft,
      fovLabelRight: s.fovLabelRight,
      eyeToggleCheckbox: s.eyeToggle,
      eyeLabelRight: s.eyeLabelRight,
      eyeLabelLeft: s.eyeLabelLeft,
      cataractSlider: s.cataractSlider,
      cataractStops: s.cataractStops,
      explanation: s.viewerExplanation,
      conditionButtons: [],
      defaultImageSrc: Ti,
      explanationTemplates: Ni,
      cataractPresets: Vi,
      cataractOcclusionSpots: Pi,
      onDilationChange: (e) => {
        s.viewerDilationToggle.checked = e;
      },
    }),
    tn = {
      cases: {
        label: "Practice cases",
        intro:
          "Use the 10 retinal images as recognition practice, then record the clinical exam below.",
        cues: [
          ["Cases", "< / > changes case"],
          ["Skin", "light or dark retina"],
          ["Eye", "R/L orientation"],
        ],
        detailTitle: "How to use",
        details: [
          ["Cases", "Use < and > to move through the 10 image cases."],
          [
            "Skin",
            "Switches between light and dark pigmentation versions of the same case.",
          ],
          [
            "R/L",
            "Changes viewing orientation only. Record RE and LE separately below.",
          ],
        ],
        footer: [
          "The image case is practice material. The Exam box is the record.",
        ],
      },
      viewing: {
        label: "Viewing controls",
        intro:
          "Choose the viewing method, then make the simulated view match what was actually seen.",
        cues: [
          ["DO", "small direct view"],
          ["BIO", "wider lens view"],
          ["Cat", "cataract blur"],
        ],
        detailTitle: "Controls",
        details: [
          ["Arclight", "Small direct view for disc and macula glimpses."],
          [
            "Holo",
            "Wider BIO-style lens view. Dilated increases the field when dilation is recorded.",
          ],
          [
            "Gaze",
            "Moves the viewing window. Cataract adds slight, medium or full blur.",
          ],
        ],
        footer: [
          "The controls are for viewing difficulty, not for changing the clinical finding.",
        ],
      },
      recording: {
        label: "Recording",
        intro:
          "Record each eye separately before relying on the Action wording.",
        cues: [
          ["VA", "vision level"],
          ["View", "quality and area"],
          ["Findings", "signs by eye"],
        ],
        detailTitle: "Exam fields",
        details: [
          ["VA", "Record VA separately for RE and LE."],
          [
            "View",
            "Use Disc+mac, Post pole, Limited, Hazy or Ungradable to describe the view.",
          ],
          [
            "Findings",
            "Record findings by eye. Complete both eyes where possible.",
          ],
        ],
        footer: [
          "Blank fields mean incomplete recording, not a normal result.",
        ],
      },
      findings: {
        label: "Findings",
        intro:
          "Use the finding groups to separate background DR, macula risk and proliferative red flags.",
        cues: [
          ["DR signs", "MA, D/B, CWS, VB"],
          ["Macula", "HE or fovea risk"],
          ["Urgent", "NVD, NVE, PR-H, Vit H"],
        ],
        detailTitle: "Finding groups",
        details: [
          [
            "DR signs",
            "Microaneurysm, dot/blot haemorrhage, cotton-wool spot or venous beading.",
          ],
          [
            "Macula risk",
            "Hard exudates near the macula, fovea risk or reduced VA with DR signs.",
          ],
          [
            "Urgent",
            "NVD, NVE, preretinal haemorrhage or vitreous haemorrhage means urgent today.",
          ],
        ],
        footer: [
          "Use the small chevrons beside each finding for short explanations.",
        ],
      },
      action: {
        label: "Action",
        intro:
          "Action combines the highest-risk finding with view quality, VA and whether both eyes are recorded.",
        cues: [
          ["Routine", "weeks"],
          ["Soon", "days"],
          ["Urgent", "today"],
        ],
        detailTitle: "Priority rules",
        details: [
          ["Routine", "DR signs without macula-risk or proliferative signs."],
          ["Soon", "Possible macula risk or reduced VA with DR signs."],
          [
            "Urgent",
            "NVD, NVE, preretinal haemorrhage or vitreous haemorrhage overrides other wording.",
          ],
        ],
        footer: [
          "Ungradable or incomplete fellow-eye recording is kept as a limitation.",
        ],
      },
      about: {
        label: "Safety",
        intro:
          "This app supports teaching and triage. It does not replace formal diabetic eye screening.",
        cues: [
          ["Scope", "teaching aid"],
          ["No signs", "view obtained only"],
          ["Pathway", "local rules"],
        ],
        detailTitle: "Safety wording",
        details: [
          [
            "Scope",
            "Use as a teaching and triage aid, not as a formal screening replacement.",
          ],
          [
            "No signs",
            "Means no referable signs were seen in the view obtained.",
          ],
          [
            "Referral",
            "Adapt referral wording to local pathways and clinical judgement.",
          ],
        ],
        footer: ["Routine diabetic eye screening is still required."],
      },
    },
    nn = {
      "arclight-do": [
        { value: "", label: "", viewQuality: "", areaSeen: "" },
        {
          value: "disc-macula-clear",
          label: "Disc+mac",
          viewQuality: "clear",
          areaSeen: "disc-macula",
        },
        {
          value: "posterior-pole-clear",
          label: "Post pole",
          viewQuality: "clear",
          areaSeen: "posterior-pole",
        },
        {
          value: "limited",
          label: "Limited",
          viewQuality: "partial",
          areaSeen: "limited",
        },
        {
          value: "hazy",
          label: "Hazy",
          viewQuality: "hazy",
          areaSeen: "limited",
        },
        {
          value: "ungradable",
          label: "Ungradable",
          viewQuality: "ungradable",
          areaSeen: "limited",
        },
      ],
      "holo-bio": [
        { value: "", label: "", viewQuality: "", areaSeen: "" },
        {
          value: "four-quadrants-clear",
          label: "4 quad",
          viewQuality: "clear",
          areaSeen: "four-quadrants",
        },
        {
          value: "disc-macula-clear",
          label: "Disc+mac",
          viewQuality: "clear",
          areaSeen: "disc-macula",
        },
        {
          value: "posterior-pole-clear",
          label: "Post pole",
          viewQuality: "clear",
          areaSeen: "posterior-pole",
        },
        {
          value: "limited",
          label: "Limited",
          viewQuality: "partial",
          areaSeen: "limited",
        },
        {
          value: "hazy",
          label: "Hazy",
          viewQuality: "hazy",
          areaSeen: "limited",
        },
        {
          value: "ungradable",
          label: "Ungradable",
          viewQuality: "ungradable",
          areaSeen: "limited",
        },
      ],
    };
  function Ke(e) {
    return nn[e] || nn["arclight-do"];
  }
  function an(e, t) {
    let r = Ke(e).find(
      (l) => l.viewQuality === t.viewQuality && l.areaSeen === t.areaSeen,
    );
    return r
      ? r.value
      : t.viewQuality === "ungradable"
        ? "ungradable"
        : t.viewQuality === "hazy"
          ? "hazy"
          : t.viewQuality === "partial" || t.areaSeen === "limited"
            ? "limited"
            : "";
  }
  function rn(e, t) {
    let n = Ke(R.mode).find((r) => r.value === t) || Ke(R.mode)[0];
    (Pt(R, e, "viewQuality", n.viewQuality), Pt(R, e, "areaSeen", n.areaSeen));
  }
  function $a(e) {
    let t = R.eyes[e].findings,
      n = ut.flatMap((r) => r.findings).filter((r) => !!t[r.key]);
    return t.noReferableSignsSeen
      ? "No signs"
      : n.length === 0
        ? "Not recorded"
        : n.length <= 2
          ? n.map((r) => r.shortLabel || r.label).join(", ")
          : `${n
              .slice(0, 2)
              .map((r) => r.shortLabel || r.label)
              .join(", ")} +${n.length - 2}`;
  }
  function S(e, t, n) {
    let r = document.createElement(e);
    return (t && (r.className = t), n !== void 0 && (r.textContent = n), r);
  }
  function on(e) {
    e.replaceChildren(
      ...kt.map((t) => {
        let n = document.createElement("option");
        return ((n.value = t.value), (n.textContent = t.label), n);
      }),
    );
  }
  function sn(e, t, n) {
    (e.replaceChildren(
      ...t.map((r) => {
        let l = document.createElement("option");
        return (
          (l.value = r.value),
          (l.textContent = r.shortLabel || r.label),
          (l.title = r.label),
          l
        );
      }),
    ),
      (e.value = n || ""));
  }
  function ln(e, t) {
    let n = document.getElementById(e.getAttribute("aria-controls") || ""),
      r = e.closest(".finding-detail-item"),
      l = e.dataset.findingLabel || "finding";
    (e.setAttribute("aria-expanded", String(t)),
      e.setAttribute("aria-label", `${t ? "Hide" : "Show"} ${l} explanation`),
      n == null || n.toggleAttribute("hidden", !t),
      r == null || r.classList.toggle("is-open", t));
  }
  function Wa(e, t) {
    let n = Ge !== t;
    (s.findingsContainer
      .querySelectorAll('.finding-detail-toggle[aria-expanded="true"]')
      .forEach((r) => {
        r !== e && ln(r, !1);
      }),
      (Ge = n ? t : null),
      ln(e, n));
  }
  function Ya() {
    let e = S("div", "findings-dropdowns");
    (["right", "left"].forEach((t) => {
      let n = S("details", "finding-dropdown");
      ((n.dataset.eye = t), (n.open = De === t));
      let r = S("summary", "finding-dropdown-summary");
      r.append(
        S("span", "finding-dropdown-title", "Findings"),
        S("span", "finding-dropdown-value", $a(t)),
      );
      let l = S("div", "finding-dropdown-menu");
      (ut.forEach((u) => {
        let f = S(
          "section",
          `finding-dropdown-group finding-dropdown-group--${u.tone}`,
        );
        f.append(S("h3", "", u.title));
        let h = S("div", "finding-dropdown-options");
        (u.findings.forEach((v) => {
          let m = `${t}:${v.key}`,
            g = `findingDetail-${t}-${v.key}`,
            b = Ge === m,
            E = S("div", `finding-detail-item${b ? " is-open" : ""}`),
            L = S("div", "finding-detail-summary"),
            D = S("label", "finding-dropdown-option"),
            k = document.createElement("input");
          ((k.type = "checkbox"),
            (k.name = `finding-${t}`),
            (k.value = v.key),
            k.setAttribute(
              "aria-label",
              `${t === "right" ? "Right" : "Left"} ${v.label}`,
            ),
            (k.checked = !!R.eyes[t].findings[v.key]),
            (D.title = v.label),
            D.classList.toggle("is-selected", k.checked),
            k.addEventListener("change", () => {
              ($i(R, t, v.key, k.checked), (De = t), re());
            }),
            D.append(k, S("span", "", v.shortLabel || v.label)));
          let C = S("button", "finding-detail-toggle");
          ((C.type = "button"),
            (C.dataset.findingLabel = v.shortLabel || v.label),
            C.setAttribute("aria-expanded", String(b)),
            C.setAttribute("aria-controls", g),
            C.setAttribute(
              "aria-label",
              `${b ? "Hide" : "Show"} ${v.shortLabel || v.label} explanation`,
            ),
            C.append(S("span", "finding-detail-toggle-icon", "\u2304")),
            C.addEventListener("click", () => {
              ((De = t), Wa(C, m));
            }));
          let T = S("div", "finding-detail-panel");
          ((T.id = g), (T.hidden = !b));
          let q = S("p");
          (q.append(S("strong", "", `${v.label}.`), ` ${v.detail || v.label}`),
            T.append(q),
            L.append(D, C),
            E.append(L, T),
            h.append(E));
        }),
          f.append(h),
          l.append(f));
      }),
        n.addEventListener("toggle", () => {
          n.open
            ? ((De = t),
              e.querySelectorAll(".finding-dropdown[open]").forEach((u) => {
                u !== n && (u.open = !1);
              }))
            : De === t &&
              ((De = null),
              (Ge = null),
              n
                .querySelectorAll(
                  '.finding-detail-toggle[aria-expanded="true"]',
                )
                .forEach((u) => {
                  var h;
                  let f = document.getElementById(
                    u.getAttribute("aria-controls") || "",
                  );
                  (u.setAttribute("aria-expanded", "false"),
                    f == null || f.setAttribute("hidden", ""),
                    (h = u.closest(".finding-detail-item")) == null ||
                      h.classList.remove("is-open"));
                }));
        }),
        n.append(r, l),
        e.append(n));
    }),
      s.findingsContainer.replaceChildren(e));
  }
  function Ha() {
    (sn(s.rightViewStatusSelect, Ke(R.mode), an(R.mode, R.eyes.right)),
      sn(s.leftViewStatusSelect, Ke(R.mode), an(R.mode, R.eyes.left)));
  }
  function cn(e, t) {
    let n =
      t.length > 0
        ? t.map((r) => S("p", "", r))
        : [S("p", "", "No reason recorded yet.")];
    e.replaceChildren(...n);
  }
  function pn() {
    ((ne = Bt(R)),
      (s.actionTitle.textContent = ne.title),
      (s.actionTone.textContent = ne.title),
      (s.actionTone.className = `action-tone tone-${ne.tone}`),
      (s.actionCard.className = `action-card tone-${ne.tone}`),
      s.actionPanel.classList.toggle("is-collapsed", !ae),
      s.actionPanel.classList.toggle("is-expanded", ae),
      (s.actionDetails.hidden = !ae),
      s.actionDetails.setAttribute("aria-hidden", String(!ae)),
      (s.actionToggle.textContent = ae ? "\xD7" : "+"),
      s.actionToggle.setAttribute(
        "aria-label",
        ae ? "Close action details" : "Show action details",
      ),
      s.actionToggle.setAttribute("aria-expanded", String(ae)),
      cn(s.actionReasons, ne.reasons),
      cn(s.actionLimitations, ne.limitations),
      (s.actionNext.textContent = ne.next),
      (s.actionSafety.textContent = ne.safety.join(" ")));
  }
  function hn() {
    (s.recordingSystemPanel.classList.toggle("is-collapsed", !ue),
      (s.recordingSystemContent.hidden = !ue),
      s.recordingSystemContent.setAttribute("aria-hidden", String(!ue)),
      (s.recordingSystemToggle.textContent = ue ? "-" : "+"),
      s.recordingSystemToggle.setAttribute("aria-expanded", String(ue)),
      s.recordingSystemToggle.setAttribute(
        "aria-label",
        ue ? "Collapse Exam" : "Expand Exam",
      ));
  }
  function gt() {
    let e = oe + 1,
      t = Q[oe],
      n = t.summary || `Case ${e}`,
      r = t.description || [];
    ((s.viewerCaseLabel.textContent = `${e}/${Q.length}`),
      s.viewerCaseLabel.setAttribute("aria-label", `Case ${e} of ${Q.length}`),
      (s.viewerCaseShortLabel.textContent = "Case information"),
      s.viewerCaseSummaryToggle.setAttribute("aria-expanded", String(be)),
      s.viewerCaseSummaryToggle.setAttribute(
        "aria-label",
        be
          ? `Info: hide case ${e} description, ${n}`
          : `Info: show case ${e} description`,
      ),
      (s.viewerCaseDescription.hidden = !be),
      s.viewerCaseDescription.setAttribute("aria-hidden", String(!be)),
      (s.viewerCaseDescriptionTitle.textContent = `${e}/${Q.length}: ${n}`),
      s.viewerCaseDescriptionBody.replaceChildren(
        ...r.map((l) => S("p", "", l)),
      ));
  }
  function Wt(e) {
    let t = Q.length;
    ((oe = (e + t) % t), (be = !1));
    let n = Q[oe];
    (ke.setViewerCase({ condition: n.id, imagePath: Yt(n), imageScale: un(n) }),
      gt(),
      mn());
  }
  function Ua(e) {
    (ft !== null && (window.clearInterval(ft), (ft = null)),
      (s.gazeMoveToggle.checked = !!e),
      e &&
        (ke.doGazeShift(),
        (ft = window.setInterval(() => {
          R.viewer.shiftInProgress || ke.doGazeShift();
        }, 3600))));
  }
  function za() {
    ((p("#clinicalDilation").value = R.dilation),
      (p("#clinicalMode").value = R.mode));
  }
  function fn() {
    let e = R.viewer.pigmentation === "dark";
    ((s.viewerPigmentationToggle.disabled = !1),
      (s.viewerPigmentationToggle.checked = e),
      (s.viewerPigmentationText.textContent = e ? "Dark" : "Light"));
  }
  function Xa() {
    ((s.rightDistanceVA.value = R.eyes.right.distanceVA),
      (s.leftDistanceVA.value = R.eyes.left.distanceVA));
  }
  function ja() {
    _e("[data-systemic]").forEach((e) => {
      e.checked = !!R.systemicChecks[e.dataset.systemic];
    });
  }
  function re() {
    (za(), fn(), Xa(), ja(), Ha(), Ya(), pn(), hn());
  }
  function Qa() {
    ((mt = !1),
      Ie !== null && (window.clearTimeout(Ie), (Ie = null)),
      (s.newAssessmentButton.querySelector("span:last-child").textContent =
        "New assessment"),
      (s.newAssessmentStatus.textContent = ""));
  }
  function Ga() {
    (Oi(R),
      (ae = !1),
      (ue = !1),
      (De = null),
      (Ge = null),
      (s.referralText.value = ""),
      (s.copyStatus.textContent = ""),
      re(),
      (s.newAssessmentStatus.textContent =
        "Assessment cleared. Practice case retained."),
      (s.newAssessmentButton.querySelector("span:last-child").textContent =
        "New assessment"),
      (mt = !1));
  }
  function Ka() {
    if (mt) {
      (Ie !== null && window.clearTimeout(Ie), (Ie = null), Ga());
      return;
    }
    ((mt = !0),
      (s.newAssessmentButton.querySelector("span:last-child").textContent =
        "Confirm new assessment"),
      (s.newAssessmentStatus.textContent =
        "Press again to clear the recorded exam."),
      (Ie = window.setTimeout(Qa, 8e3)));
  }
  function Ja([e, t]) {
    let n = S("span", "info-basics-cue");
    return (n.append(S("strong", "", e), S("small", "", t)), n);
  }
  function Za([e, t]) {
    let n = S("p");
    return (n.append(S("strong", "", `${e}:`), ` ${t}`), n);
  }
  function er(e) {
    let t = S("section", "info-guide-definition");
    t.append(S("p", "info-look-title", e.label), S("p", "", e.intro));
    let n = document.createElement("hr"),
      r = S("div", "info-look-guide"),
      l = S("section", "info-look-section info-look-section--basics");
    (l.append(
      S("p", "info-look-title", "Basics"),
      S("div", "info-basics-grid"),
    ),
      l.lastElementChild.append(...e.cues.map(Ja)));
    let u = S("section", "info-look-section info-look-section--detail");
    (u.append(S("p", "info-look-title", e.detailTitle), ...e.details.map(Za)),
      r.append(l, u));
    let f = document.createElement("hr"),
      h = S("div", "info-points");
    return (h.append(...e.footer.map((v) => S("p", "", v))), [t, n, r, f, h]);
  }
  function tr(e) {
    let t =
        {
          cases: "Cases and skin",
          viewing: "Viewing controls",
          recording: "Record RE/LE",
          findings: "Findings guide",
          action: "Action wording",
          about: "Safety and local pathways",
        }[e] || "Guide",
      n = tn[e] || tn.about;
    ((s.guideTitle.textContent = t),
      s.guideContent.replaceChildren(...er(n)),
      Qe(s.guideModal, s.guideModalContent));
  }
  function ir() {
    let e = Ui.map((t, n) => {
      let r = S("article", "practice-card");
      ((r.tabIndex = 0),
        r.setAttribute("role", "button"),
        r.setAttribute("aria-label", `Open ${t.title}: ${t.prompt}`),
        (r.dataset.caseIndex = String(n)));
      let l = S("figure", "practice-image"),
        u = document.createElement("img");
      ((u.src = t.imageSrc),
        (u.alt = ""),
        (u.loading = "lazy"),
        (u.decoding = "async"),
        l.append(u, S("figcaption", "", t.imageLabel)));
      let f = S("div", "practice-card-copy"),
        h = Array.isArray(t.answer) ? t.answer : [t.answer];
      return (
        f.append(
          S("h3", "", t.title),
          S("p", "practice-card-summary", t.prompt),
          ...h.map((v) => S("p", "", v)),
          S("span", "practice-card-action", "Open case >"),
        ),
        r.append(l, f),
        r
      );
    });
    s.practiceCases.replaceChildren(...e);
  }
  function dn(e) {
    (Wt(e), ge(s.practiceModal));
  }
  function nr() {
    ((s.referralText.value = Hi(R, ne)),
      (s.copyStatus.textContent = ""),
      (s.shareReferralButton.hidden = !navigator.share),
      Qe(s.referralModal, s.referralModalContent));
  }
  async function ar() {
    s.referralText.select();
    try {
      (await navigator.clipboard.writeText(s.referralText.value),
        (s.copyStatus.textContent = "Copied."));
    } catch (e) {
      (document.execCommand("copy"), (s.copyStatus.textContent = "Copied."));
    }
  }
  async function rr() {
    if (!navigator.share) {
      s.copyStatus.textContent = "Sharing is not available here.";
      return;
    }
    try {
      (await navigator.share({
        title: "Diabetic referral note",
        text: s.referralText.value,
      }),
        (s.copyStatus.textContent = "Shared."));
    } catch (e) {
      (e == null ? void 0 : e.name) !== "AbortError" &&
        (s.copyStatus.textContent = "Share failed.");
    }
  }
  function mn() {
    if (typeof window == "undefined" || typeof Image == "undefined") return;
    let e = Q.length,
      t = [oe, (oe + e - 1) % e, (oe + 1) % e],
      n = new Set(t.map((l) => Yt(Q[l])).filter(Boolean)),
      r = () => {
        n.forEach((l) => {
          if (en.has(l)) return;
          let u = new Image();
          ((u.decoding = "async"), en.set(l, u), (u.src = l));
        });
      };
    typeof window.requestIdleCallback == "function"
      ? window.requestIdleCallback(r, { timeout: 1200 })
      : window.setTimeout(r, 220);
  }
  function or() {
    let e = Gi({
      menuButton: p("#menuButton"),
      closeButton: p("#closeDrawerButton"),
      drawer: p("#sideMenu"),
      overlay: p("#drawerOverlay"),
    });
    (Ki({
      button: p("#infoButton"),
      popup: p("#infoPopup"),
      closeButton: p("#closeInfoButton"),
    }),
      Ji({
        tabs: _e(".tab-btn[data-mode]"),
        onChange: (n) => {
          ke.setViewerMode(n);
        },
      }),
      s.viewerDilationToggle.addEventListener("change", () => {
        ke.setDilated(s.viewerDilationToggle.checked);
      }),
      p("#clinicalDilation").addEventListener("change", (n) => {
        (_i(R, n.target.value), re());
      }),
      p("#clinicalMode").addEventListener("change", (n) => {
        (Bi(R, n.target.value), re());
      }),
      s.gazeMoveToggle.addEventListener("change", () => {
        Ua(s.gazeMoveToggle.checked);
      }),
      s.viewerPigmentationToggle.addEventListener("change", () => {
        R.viewer.pigmentation = s.viewerPigmentationToggle.checked
          ? "dark"
          : "light";
        let n = Q[oe];
        (ke.setViewerCase({
          condition: n.id,
          imagePath: Yt(n),
          imageScale: un(n),
        }),
          fn(),
          mn());
      }),
      s.previousCaseButton.addEventListener("click", () => {
        Wt(oe - 1);
      }),
      s.nextCaseButton.addEventListener("click", () => {
        Wt(oe + 1);
      }),
      s.viewerCaseSummaryToggle.addEventListener("click", () => {
        ((be = !be), gt());
      }),
      s.rightDistanceVA.addEventListener("change", () => {
        (Vt(R, "right", s.rightDistanceVA.value), re());
      }),
      s.leftDistanceVA.addEventListener("change", () => {
        (Vt(R, "left", s.leftDistanceVA.value), re());
      }),
      s.rightViewStatusSelect.addEventListener("change", () => {
        (rn("right", s.rightViewStatusSelect.value), re());
      }),
      s.leftViewStatusSelect.addEventListener("change", () => {
        (rn("left", s.leftViewStatusSelect.value), re());
      }),
      _e("[data-systemic]").forEach((n) => {
        n.addEventListener("change", () => {
          (Fi(R, n.dataset.systemic, n.checked), re());
        });
      }),
      s.actionToggle.addEventListener("click", () => {
        ((ae = !ae), pn());
      }),
      s.newAssessmentButton.addEventListener("click", Ka),
      s.recordingSystemToggle.addEventListener("click", () => {
        ((ue = !ue), hn());
      }),
      p("#referralNoteButton").addEventListener("click", nr),
      p("#closeReferralButton").addEventListener("click", () =>
        ge(s.referralModal),
      ),
      p("#copyReferralButton").addEventListener("click", ar),
      s.shareReferralButton.addEventListener("click", rr),
      p("#closePracticeButton").addEventListener("click", () =>
        ge(s.practiceModal),
      ),
      p("#closeGuideButton").addEventListener("click", () => ge(s.guideModal)),
      p("[data-practice-open]").addEventListener("click", () => {
        (e.close(), ir(), Qe(s.practiceModal, s.practiceModalContent));
      }),
      s.practiceCases.addEventListener("click", (n) => {
        let r = n.target.closest(".practice-card");
        !r ||
          !s.practiceCases.contains(r) ||
          dn(Number(r.dataset.caseIndex || 0));
      }),
      s.practiceCases.addEventListener("keydown", (n) => {
        if (n.key !== "Enter" && n.key !== " ") return;
        let r = n.target.closest(".practice-card");
        !r ||
          !s.practiceCases.contains(r) ||
          (n.preventDefault(), dn(Number(r.dataset.caseIndex || 0)));
      }),
      _e("[data-guide]").forEach((n) => {
        n.addEventListener("click", () => {
          (e.close(), tr(n.dataset.guide));
        });
      }));
    let t = Qi({
      modal: p("#mcqModal"),
      modalContent: p("#mcqModalContent"),
      title: p("#mcqTitle"),
      intro: p("#mcqIntro"),
      container: p("#mcqContainer"),
      submit: p("#submitMcqButton"),
      result: p("#mcqResult"),
      close: p("#closeMcqButton"),
      returnFocus: p("#menuButton"),
      openModal: Qe,
      closeModal: ge,
    });
    (_e("[data-mcq-level]").forEach((n) => {
      n.addEventListener("click", () => {
        (e.close(), t.open(n.dataset.mcqLevel));
      });
    }),
      document.addEventListener("keydown", (n) => {
        n.key === "Escape" &&
          ((be = !1),
          gt(),
          [
            s.referralModal,
            s.practiceModal,
            s.guideModal,
            p("#mcqModal"),
          ].forEach((r) => ge(r)));
      }));
  }
  function sr() {
    (on(s.rightDistanceVA), on(s.leftDistanceVA));
    try {
      (ke.initialize(), gt());
    } catch (t) {
      console.error("Viewer initialisation failed", t);
    }
    (or(),
      ji().forEach((t) => {
        (t.actual !== t.expected ||
          t.invalidAnswers > 0 ||
          t.invalidQuestions > 0) &&
          console.warn("MCQ validation issue", t);
      }),
      re(),
      Zi());
  }
  sr();
})();
