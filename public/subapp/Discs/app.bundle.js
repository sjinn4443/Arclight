"use strict";
(() => {
  var vt = { right: "RE", left: "LE" },
    Di = { "arclight-do": "Arclight (DO)", "holo-bio": "Holo (BIO)" },
    Wt = {
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
  var zt = [
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
  var Ri = [
      { key: "bp", label: "IOP checked", note: "record IOP if possible" },
      {
        key: "lipids",
        label: "Family history",
        note: "ask about glaucoma family history",
      },
      {
        key: "hba1c",
        label: "High myopia",
        note: "record high myopia if present",
      },
    ],
    St = [
      {
        key: "clear",
        title: "No referable signs",
        tone: "neutral",
        modes: ["general", "glaucoma"],
        findings: [
          {
            key: "noReferableSignsSeen",
            label: "No referable disc signs seen in view obtained",
            shortLabel: "No signs",
            group: "clear",
            detail:
              "Use only when no referable disc signs are seen in the view obtained. It does not replace symptoms, pupils, fields or local review pathways.",
          },
        ],
      },
      {
        key: "npdr",
        title: "General disc variants",
        tone: "green",
        modes: ["general"],
        findings: [
          {
            key: "discDrusen",
            label: "Disc drusen or pseudo-swelling",
            shortLabel: "Drusen",
            group: "npdr",
            detail:
              "Lumpy elevated disc appearance that can mimic true disc swelling. If symptomatic or uncertain, manage as swelling.",
          },
          {
            key: "anomalousTiltedDisc",
            label: "Tilted or anomalous disc",
            shortLabel: "Tilted",
            group: "npdr",
            detail:
              "Congenital tilt, myopic disc shape or unusual vessel entry can distort the cup and margin. Compare with the other eye and previous records.",
          },
          {
            key: "crowdedDisc",
            label: "Small crowded disc",
            shortLabel: "Crowded",
            group: "npdr",
            detail:
              "A small crowded disc may look raised and has little visible cup. Distinguish from true swelling, especially if symptoms are present.",
          },
          {
            key: "peripapillaryAtrophy",
            label: "Peripapillary atrophy or pigment change",
            shortLabel: "PPA",
            group: "npdr",
            detail:
              "Peripapillary atrophy, crescent or pigment change is common in myopia and can alter glaucoma assessment.",
          },
        ],
      },
      {
        key: "macula",
        title: "Concerning disc signs",
        tone: "orange",
        modes: ["general", "glaucoma"],
        findings: [
          {
            key: "opticDiscPallor",
            label: "Optic disc pallor",
            shortLabel: "Pallor",
            group: "macula",
            detail:
              "Pallor may indicate optic nerve damage. Reduced VA, field loss or an abnormal pupil should increase urgency.",
          },
          {
            key: "cupDisc06",
            label: "C/D about 0.6",
            shortLabel: "C/D 0.6",
            group: "macula",
            modes: ["glaucoma"],
            detail:
              "A moderate cup is more suspicious when the rim is thin, the disc is small, the fellow eye differs or fields match.",
          },
          {
            key: "thinRim",
            label: "Thin neuroretinal rim",
            shortLabel: "Thin rim",
            group: "macula",
            modes: ["glaucoma"],
            detail:
              "Diffuse or focal rim thinning makes glaucoma more likely, especially with matching field loss or progression.",
          },
        ],
      },
      {
        key: "context",
        title: "Cup and size context",
        tone: "green",
        modes: ["glaucoma"],
        findings: [
          {
            key: "cupDisc03",
            label: "C/D about 0.3",
            shortLabel: "C/D 0.3",
            group: "context",
            modes: ["glaucoma"],
            detail:
              "A small cup is usually lower risk if the rim is healthy and the disc is not suspicious.",
          },
          {
            key: "smallDisc",
            label: "Small disc",
            shortLabel: "Small",
            group: "context",
            modes: ["glaucoma"],
            detail:
              "Small discs can have small cups. A moderate cup in a small disc is more suspicious.",
          },
          {
            key: "mediumDisc",
            label: "Medium disc",
            shortLabel: "Medium",
            group: "context",
            modes: ["glaucoma"],
            detail:
              "Medium disc size means cup/disc ratio can be interpreted more directly alongside rim health.",
          },
          {
            key: "largeDisc",
            label: "Large disc",
            shortLabel: "Large",
            group: "context",
            modes: ["glaucoma"],
            detail:
              "Large discs may have larger physiological cups. Judge the rim, not the cup alone.",
          },
        ],
      },
      {
        key: "urgent",
        title: "Urgent disc swelling",
        tone: "red",
        modes: ["general", "glaucoma"],
        findings: [
          {
            key: "swollenDisc",
            label: "Swollen disc",
            shortLabel: "Swollen",
            group: "urgent",
            detail:
              "Blurred disc margin, raised nerve head or obscured vessels can indicate papilloedema, optic neuritis, inflammation or vascular disease. True swelling is urgent.",
          },
        ],
      },
      {
        key: "glaucomaHigh",
        title: "Fast glaucoma signs",
        tone: "red",
        modes: ["glaucoma"],
        findings: [
          {
            key: "rimNotch",
            label: "Rim notch",
            shortLabel: "Notch",
            group: "glaucomaHigh",
            modes: ["glaucoma"],
            detail:
              "A focal rim notch is a strong glaucoma-pattern structural sign, especially with local nerve fibre layer loss.",
          },
          {
            key: "splinterHaemorrhage",
            label: "Splinter haemorrhage",
            shortLabel: "Splinter",
            group: "glaucomaHigh",
            modes: ["glaucoma"],
            detail:
              "A splinter or flame haemorrhage at the disc margin can indicate active nerve fibre layer damage or glaucoma progression.",
          },
          {
            key: "cupDisc09",
            label: "C/D about 0.9",
            shortLabel: "C/D 0.9",
            group: "glaucomaHigh",
            modes: ["glaucoma"],
            detail:
              "Very large cup with little remaining rim is high risk for advanced glaucoma, especially with vessel change or field loss.",
          },
          {
            key: "visibleLaminaCribrosa",
            label: "Visible lamina cribrosa",
            shortLabel: "Lam crib",
            group: "glaucomaHigh",
            modes: ["glaucoma"],
            detail:
              "Visible lamina pores suggest deep cupping. Interpret with rim loss, vessel displacement and fields.",
          },
          {
            key: "vesselBayoneting",
            label: "Vessel bayoneting or baring",
            shortLabel: "BV change",
            group: "glaucomaHigh",
            modes: ["glaucoma"],
            detail:
              "Baring of circumlinear vessels or bayoneting suggests rim loss and advanced cupping. Do not overcall simple early bending.",
          },
        ],
      },
    ],
    ve = St.flatMap((e) => e.findings),
    Yt = Object.fromEntries(ve.map((e) => [e.key, e])),
    Ni = ve.map((e) => e.key),
    Pi = Ni.filter((e) => e !== "noReferableSignsSeen"),
    Oi = ve.filter((e) => e.group === "npdr").map((e) => e.key),
    _i = ve.filter((e) => e.group === "macula").map((e) => e.key),
    qi = ve.filter((e) => e.group === "context").map((e) => e.key),
    Gt = ve.filter((e) => e.group === "urgent").map((e) => e.key),
    Ht = ve.filter((e) => e.group === "glaucomaHigh").map((e) => e.key),
    ks = [...Gt, ...Ht];
  function Vi() {
    return Object.fromEntries(Ni.map((e) => [e, !1]));
  }
  function Ct(e) {
    return ve.filter((t) => !!e[t.key]).map((t) => t.label);
  }
  function $i(e, t) {
    var n, a;
    return (
      ((a = (n = Wt[e]) == null ? void 0 : n.find((r) => r.value === t)) == null
        ? void 0
        : a.label) || "Not recorded"
    );
  }
  function tt(e) {
    var t;
    return (
      ((t = zt.find((n) => n.value === e)) == null ? void 0 : t.label) ||
      "Not recorded"
    );
  }
  function Bi({
    canvasWidth: e,
    canvasHeight: t,
    imageNaturalWidth: n,
    imageNaturalHeight: a,
    imageScale: r,
    zoomFactor: d,
    bgOffsetX: p,
    bgOffsetY: h,
    circleRadius: A,
    circleX: g,
    isRightEye: w,
  }) {
    let v = t / a,
      b = n * v,
      T = t,
      L = (e - b) / 2,
      M = 0,
      E = r * d,
      N = b * E,
      k = T * E,
      _ = L + (b - N) / 2 + p,
      l = M + (T - k) / 2 + h,
      ce = d,
      ee = A * ce * v,
      de = w ? g : e - g;
    return {
      scaleFactor: v,
      drawnImageWidth: b,
      imageDrawOffsetX: L,
      scaledWidth: N,
      scaledHeight: k,
      offsetXPos: _,
      offsetYPos: l,
      windowScale: ce,
      effectiveCircleRadius: ee,
      flippedCircleX: de,
    };
  }
  function Fi(e, t) {
    if (e <= t) return { min: e, max: t };
    let n = (e + t) / 2;
    return { min: n, max: n };
  }
  function Wi({
    canvasWidth: e,
    canvasHeight: t,
    imageNaturalWidth: n,
    imageNaturalHeight: a,
    imageScale: r = 1,
    circleRadius: d,
    zoomFactor: p,
  }) {
    let h = t / a,
      A = n * h,
      g = (e - A) / 2,
      w = 0,
      v = r * p,
      b = A * v,
      T = t * v,
      L = g + (A - b) / 2,
      M = w + (t - T) / 2,
      E = d * p * h,
      N = L + E,
      k = L + b - E,
      _ = M + E,
      l = M + T - E,
      ce = Fi(N, k),
      ee = Fi(_, l);
    return { minX: ce.min, maxX: ce.max, minY: ee.min, maxY: ee.max };
  }
  function zi({
    circleX: e,
    circleY: t,
    velocityX: n,
    velocityY: a,
    bounds: r,
  }) {
    let d = e,
      p = t,
      h = n,
      A = a;
    return (
      d < r.minX && ((d = r.minX), (h *= -0.5)),
      d > r.maxX && ((d = r.maxX), (h *= -0.5)),
      p < r.minY && ((p = r.minY), (A *= -0.5)),
      p > r.maxY && ((p = r.maxY), (A *= -0.5)),
      { circleX: d, circleY: p, velocityX: h, velocityY: A }
    );
  }
  function Yi({ cataractLevel: e, darkTint: t, yellowTint: n }) {
    let a = e === 3 ? 0.3 : 0.55,
      r = 1 - t * 2.8 - n * 1.2;
    return Math.max(a, r);
  }
  var re = Object.freeze({
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
    ze = Object.freeze({
      jitterMultiplier: 1,
      shiftDistanceMultiplier: 1,
      shiftDurationMs: 600,
    }),
    Se = Object.freeze({
      jitterMultiplier: { min: 1, max: 4 },
      shiftDistanceMultiplier: { min: 1, max: 3.2 },
      shiftDurationMs: { min: 250, max: 2500 },
    }),
    On = Object.freeze(["horizontal", "vertical", "mixed"]),
    Gi = Object.freeze({ slow: 1.05, med: 1.75, fast: 2.45 }),
    Hi = Object.freeze({ enabled: !1, direction: "horizontal", rate: "slow" });
  function _n() {
    let e = typeof window != "undefined",
      t =
        e && typeof window.matchMedia == "function"
          ? window.matchMedia("(pointer: coarse)").matches
          : !1,
      n = e ? Math.max(window.innerWidth || 0, window.innerHeight || 0) : 0,
      a = t || n <= 1100;
    return {
      isMobileLike: a,
      canvasScale: a ? 0.5 : 1,
      cataractBlurScale: a ? 0.42 : 1,
      occlusionSpotRatio: 1,
      occlusionBlurScale: a ? 0.45 : 1,
      baseJitterIntervalMs: a ? 24 : 16,
      cataractJitterIntervalMs: a ? 72 : 16,
    };
  }
  function Ui(e) {
    return typeof e != "string" || e.length === 0
      ? ""
      : e.split("?")[0].split("/").pop() || "";
  }
  function ji(e) {
    return null;
  }
  function qn(e, t) {
    return typeof e != "string" ? "" : (t && ji(e)) || e;
  }
  function J(e, t, n, a) {
    let r = Number(e);
    return Number.isFinite(r) ? Math.max(t, Math.min(n, r)) : a;
  }
  function Vn(e) {
    let t = e && typeof e == "object" ? e : {};
    return {
      rotateDegrees: J(
        t.rotateDegrees,
        Y.rotateDegrees.min,
        Y.rotateDegrees.max,
        re.rotateDegrees,
      ),
      scale: J(t.scale, Y.scale.min, Y.scale.max, re.scale),
      panXRatio: J(t.panXRatio, Y.panRatio.min, Y.panRatio.max, re.panXRatio),
      panYRatio: J(t.panYRatio, Y.panRatio.min, Y.panRatio.max, re.panYRatio),
      brightness: J(
        t.brightness,
        Y.brightness.min,
        Y.brightness.max,
        re.brightness,
      ),
      contrast: J(t.contrast, Y.contrast.min, Y.contrast.max, re.contrast),
      saturation: J(
        t.saturation,
        Y.saturation.min,
        Y.saturation.max,
        re.saturation,
      ),
      flipVertical: !!t.flipVertical,
    };
  }
  function $n(e) {
    let t = e && typeof e == "object" ? e : {};
    return {
      jitterMultiplier: J(
        t.jitterMultiplier,
        Se.jitterMultiplier.min,
        Se.jitterMultiplier.max,
        ze.jitterMultiplier,
      ),
      shiftDistanceMultiplier: J(
        t.shiftDistanceMultiplier,
        Se.shiftDistanceMultiplier.min,
        Se.shiftDistanceMultiplier.max,
        ze.shiftDistanceMultiplier,
      ),
      shiftDurationMs: J(
        t.shiftDurationMs,
        Se.shiftDurationMs.min,
        Se.shiftDurationMs.max,
        ze.shiftDurationMs,
      ),
    };
  }
  function Xi({
    state: e,
    canvas: t,
    fovToggleCheckbox: n,
    fovLabelSmall: a,
    fovLabelLeft: r,
    fovLabelRight: d,
    eyeToggleCheckbox: p,
    eyeLabelRight: h,
    eyeLabelLeft: A,
    cataractSlider: g,
    cataractStops: w,
    viewSummary: v,
    explanation: b,
    conditionButtons: T,
    defaultImageSrc: L,
    explanationTemplates: M,
    cataractPresets: E,
    cataractOcclusionSpots: N,
    onDilationChange: k = null,
    onViewerCaseChange: _ = null,
  }) {
    let l = t.getContext("2d"),
      ce = 5,
      ee = 80,
      de = Object.freeze({
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
      fe = "arclight-do",
      $e = (8 / 5) * ee,
      ye = fe,
      G = 0,
      H = 0,
      Fe = 0,
      Be = 0,
      ue = !1,
      ct = null,
      ae = 0,
      ne = 0,
      Ie = { x: 0, y: 0 },
      dt = { x: 0, y: 0 },
      te = null,
      Me = 0,
      Lt = 0,
      Oa = 1,
      Ue = 3,
      z = _n(),
      B = { ...re },
      Le = { ...ze },
      _a = 400,
      be = null,
      U = null,
      pe = null,
      ci = 0,
      di = 0,
      ke = null,
      me = { x: 0, y: 0 },
      Te = 0,
      qa = 2,
      De = new Map(),
      Re = new Map(),
      We = new Map(),
      je = 640,
      ui = [],
      pi = !1,
      R = new Image(),
      kt = !0,
      j = document.createElement("button");
    ((j.type = "button"),
      (j.className = "viewer-image-status"),
      (j.textContent = "Loading image\u2026"),
      t.parentElement.append(j),
      j.addEventListener("click", () => Xe(e.viewer.activeImageSrc)),
      (R.onload = () => {
        ((kt = !1),
          (j.hidden = !0),
          ft(),
          U === null && (U = requestAnimationFrame(Ke)));
      }),
      (R.onerror = () => {
        let i = ji(e.viewer.activeImageSrc);
        if (!i || i === e.viewer.activeImageSrc) {
          ((j.textContent = "Image unavailable \u2014 retry"),
            (j.hidden = !1),
            (j.disabled = !1));
          return;
        }
        ((pi = !0),
          e.viewer.conditionImageSrc === e.viewer.activeImageSrc &&
            (e.viewer.conditionImageSrc = i),
          (e.viewer.activeImageSrc = i),
          (R.src = i));
      }));
    function K(i, s, c, u) {
      (i.addEventListener(s, c, u),
        ui.push(() => {
          i.removeEventListener(s, c, u);
        }));
    }
    function q() {
      pe === null &&
        (pe = requestAnimationFrame((i) => {
          pe = null;
          let s = z.isMobileLike && e.viewer.cataractLevel > 0 ? 34 : 0,
            c =
              typeof i == "number"
                ? i
                : typeof window != "undefined" && window.performance
                  ? window.performance.now()
                  : Date.now();
          if (s > 0 && c - di < s) {
            q();
            return;
          }
          ((di = c), cn());
        }));
    }
    function mi(i, s, c = 0.25) {
      if (ye !== "holo-bio") return;
      let u = Math.hypot(i, s);
      u > 0.5 && (Lt = Math.atan2(s, i));
      let f = Math.min(1, u / 70),
        y = Math.min(1, c * 0.35 + f * 0.8);
      Me = Math.max(Me * 0.7, y);
    }
    function Va() {
      Me <= 0 ||
        ((Me *= e.viewer.shiftInProgress ? 0.9 : 0.84), Me < 0.025 && (Me = 0));
    }
    function $a() {
      var s;
      let i =
        ((s = T[0]) == null ? void 0 : s.getAttribute("data-condition")) ||
        e.viewer.activeCondition ||
        "normal";
      ((e.viewer.activeImageSrc = L),
        (e.viewer.conditionImageSrc = L),
        (e.viewer.activeCondition = i),
        (e.viewer.isRightEye = !0),
        (e.viewer.isDiscVisible = !0),
        (e.viewer.cataractLevel = 0),
        (e.viewer.nystagmusEnabled = !!e.viewer.nystagmusEnabled),
        (e.viewer.nystagmusDirection = pt(e.viewer.nystagmusDirection)),
        (e.viewer.nystagmusRate = mt(e.viewer.nystagmusRate)),
        (e.viewer.shiftInProgress = !1),
        (ye = e.mode || fe),
        (B = { ...re }),
        (Le = { ...ze }),
        fi(),
        (n.value = String(W().defaultIndex)),
        ($e = vi(Ne())),
        Tt(i),
        Dt(i),
        Xe(L),
        bi(),
        Pt(),
        Ot(),
        Fa(),
        Ba());
    }
    function Fa() {
      let i = () => {
        Si(Nt());
      };
      (K(n, "input", i),
        K(n, "change", i),
        K(p, "change", () => {
          ((e.viewer.isRightEye = !p.checked), ft(), Pt());
        }),
        K(g, "input", () => {
          ((e.viewer.cataractLevel = Number(g.value)), Ot(), q());
        }),
        T.forEach((u) => {
          K(u, "click", () => {
            if (u.disabled) return;
            let y = u.getAttribute("data-condition") || "normal",
              C = u.getAttribute("data-image") || L;
            (Tt(y),
              (e.viewer.activeCondition = y),
              (e.viewer.conditionImageSrc = C),
              (e.viewer.isDiscVisible = !0),
              Xe(C),
              Dt(y),
              _ == null || _({ condition: y, imagePath: C }));
          });
        }));
    }
    function Tt(i) {
      T.forEach((s) => {
        let u = (s.getAttribute("data-condition") || "normal") === i;
        (s.classList.toggle("active", u),
          s.setAttribute("aria-pressed", u ? "true" : "false"));
      });
    }
    function Ba() {
      (K(t, "pointerdown", za),
        K(t, "pointermove", Ya),
        K(t, "pointerup", ut),
        K(t, "pointercancel", ut),
        K(t, "pointerleave", (s) => {
          s.pointerType === "mouse" && ut(s);
        }),
        K(window, "pointerup", ut),
        typeof document != "undefined" && K(document, "visibilitychange", Wa));
    }
    function Wa() {
      if (typeof document != "undefined") {
        if (document.hidden) {
          (U !== null && (cancelAnimationFrame(U), (U = null)),
            pe !== null && (cancelAnimationFrame(pe), (pe = null)),
            te !== null && (cancelAnimationFrame(te), (te = null)));
          return;
        }
        (R.complete && U === null && (U = requestAnimationFrame(Ke)), q());
      }
    }
    function za(i) {
      (i.button !== void 0 && i.button !== 0) ||
        ((ue = !0),
        (ct = i.pointerId),
        (ae = 0),
        (ne = 0),
        t.setPointerCapture(i.pointerId),
        (t.style.cursor = "none"),
        hi(i),
        on());
    }
    function Ya(i) {
      !ue || i.pointerId !== ct || hi(i);
    }
    function ut(i) {
      ue &&
        ((typeof i.pointerId == "number" && i.pointerId !== ct) ||
          (typeof i.pointerId == "number" &&
            t.hasPointerCapture(i.pointerId) &&
            t.releasePointerCapture(i.pointerId),
          (ue = !1),
          (ct = null),
          (t.style.cursor = "crosshair"),
          ln()));
    }
    function hi(i) {
      let s = t.getBoundingClientRect();
      if (s.width === 0 || s.height === 0) return;
      let c = t.width / s.width,
        u = t.height / s.height,
        f = (i.clientX - s.left) * c,
        y = (i.clientY - s.top) * u,
        C = Ga(),
        I = Math.max(18, Math.min(64, C * 0.12)),
        x = G,
        O = H;
      ((G = f), (H = y - C - I), mi(G - x, H - O, 0.55), Je(), q());
    }
    function Ga() {
      if (!R.naturalHeight || t.height <= 0) return $e * Ue;
      let i = t.height / R.naturalHeight;
      return $e * Ue * i;
    }
    function Xe(i) {
      let s = qn(i, pi);
      e.viewer.activeImageSrc = s;
      let c = Ui(R.src),
        u = Ui(s);
      if (R.complete && R.naturalWidth > 0 && c === u) {
        ft();
        return;
      }
      ((kt = !0),
        (j.hidden = !1),
        (j.disabled = !0),
        (j.textContent = "Loading image\u2026"),
        l.clearRect(0, 0, t.width, t.height),
        (R.src = s));
    }
    function Ha({ condition: i, imagePath: s, imageScale: c } = {}) {
      let u = i || e.viewer.activeCondition || "normal",
        f = s || L,
        y = Number(c);
      (Tt(u),
        (e.viewer.activeCondition = u),
        (e.viewer.conditionImageSrc = f),
        (e.viewer.caseImageScale = Number.isFinite(y) && y > 0 ? y : 1),
        (e.viewer.isDiscVisible = !0),
        Xe(f),
        Dt(u),
        _ == null ||
          _({
            condition: u,
            imagePath: f,
            imageScale: e.viewer.caseImageScale,
          }));
    }
    function Ua(i) {
      let s = B.panXRatio * i.scaledWidth,
        c = B.panYRatio * i.scaledHeight,
        u = i.offsetXPos + s,
        f = i.offsetYPos + c;
      return {
        offsetXPos: u,
        offsetYPos: f,
        scaledWidth: i.scaledWidth,
        scaledHeight: i.scaledHeight,
        centreX: u + i.scaledWidth / 2,
        centreY: f + i.scaledHeight / 2,
      };
    }
    function gi(i) {
      let s = (B.rotateDegrees * Math.PI) / 180,
        c = B.flipVertical === !0;
      if (!(s === 0 && B.scale === 1 && !c)) {
        if (
          (l.translate(i.centreX, i.centreY),
          s !== 0 && l.rotate(s),
          B.scale !== 1 || c)
        ) {
          let u = c ? B.scale * -1 : B.scale;
          l.scale(B.scale, u);
        }
        l.translate(-i.centreX, -i.centreY);
      }
    }
    function ja(i) {
      let s = i.brightness * B.brightness,
        c = i.contrast * B.contrast,
        u = i.saturation * B.saturation;
      return `blur(${Math.max(0, Math.min(6, i.blurPx))}px) brightness(${s}) contrast(${c}) saturate(${u})`;
    }
    function Xa(i) {
      B = Vn(i);
    }
    function Qa() {
      B = { ...re };
    }
    function Ka(i) {
      Le = $n(i);
    }
    function Ja() {
      Le = { ...ze };
    }
    function Dt(i) {
      b && (b.innerHTML = M[i] || M.normal);
    }
    function W() {
      return de[ye] || de[fe];
    }
    function fi() {
      let i = W().levels;
      ((n.min = "0"),
        (n.max = String(Math.max(0, i.length - 1))),
        (n.step = "1"));
    }
    function Rt() {
      return W().dilatedDegrees;
    }
    function Qe() {
      return W().undilatedDegrees;
    }
    function yi() {
      let i = Number.isFinite(e.viewer.caseImageScale)
        ? e.viewer.caseImageScale
        : 1;
      return Oa * i * (W().backgroundImageScale || 1);
    }
    function pt(i) {
      return On.includes(i) ? i : Hi.direction;
    }
    function mt(i) {
      return Object.prototype.hasOwnProperty.call(Gi, i) ? i : Hi.rate;
    }
    function bi() {
      let i = Nt(),
        s = W().levels;
      (a &&
        (a.classList.toggle("active", i === 0),
        (a.textContent = s.length > 2 ? "Small" : "")),
        (r.textContent = s.length > 2 ? "Norm" : "Undilated"),
        (d.textContent = "Dilated"),
        r.classList.toggle("active", s.length > 2 ? i === 1 : i === 0),
        d.classList.toggle("active", s.length > 2 ? i === 2 : i === 1),
        n.setAttribute("aria-valuetext", `${Ne()} degrees`),
        _t());
    }
    function wi(i) {
      let s = W().levels,
        c = Number(i);
      return Number.isFinite(c)
        ? Math.max(0, Math.min(s.length - 1, Math.round(c)))
        : W().defaultIndex;
    }
    function Nt() {
      return wi(n.value);
    }
    function Ne() {
      let i = W();
      return i.levels[Nt()] || i.undilatedDegrees;
    }
    function Za(i) {
      let s = Number(i);
      if (!Number.isFinite(s)) return W().defaultIndex;
      let c = W().defaultIndex,
        u = 1 / 0;
      return (
        W().levels.forEach((f, y) => {
          let C = Math.abs(f - s);
          C < u && ((u = C), (c = y));
        }),
        c
      );
    }
    function vi(i) {
      return (i / ce) * ee;
    }
    function Si(i) {
      let s = wi(i),
        c = W().levels[s] || Qe();
      ((n.value = String(s)),
        ($e = vi(c)),
        Je(),
        q(),
        bi(),
        k == null || k(yt(), Ne()));
    }
    function ht(i) {
      Si(Za(i));
    }
    function en() {
      return Ne();
    }
    function Pt() {
      (h.classList.toggle("active", e.viewer.isRightEye),
        A.classList.toggle("active", !e.viewer.isRightEye),
        _t());
    }
    function Ot() {
      let i = E.length - 1,
        s = Math.max(0, Math.min(i, Number(g.value) || 0));
      ((e.viewer.cataractLevel = s), (g.value = String(s)));
      let c = E[e.viewer.cataractLevel];
      (g.setAttribute("aria-valuetext", c.label),
        w.forEach((u, f) => {
          u.classList.toggle("active", f === s);
        }),
        _t());
    }
    function _t() {
      if (!v) return;
      let i = e.viewer.isRightEye ? "RE" : "LE",
        s = Ne(),
        c = W().labels[s] || `${s} degrees`,
        u = E[e.viewer.cataractLevel] || E[0],
        f = u.label === "None" ? "No cataract" : u.label,
        y = `${i} - ${c} - ${f}`;
      ((v.textContent = y),
        v.setAttribute("aria-label", `Current viewing setup: ${y}`));
    }
    function qt(i, s) {
      let c = i === 3,
        u = i === 3 ? 2 : i,
        f = N[u];
      if (!f || f.length === 0) return null;
      let y = Math.max(0.2, Math.min(1, z.occlusionSpotRatio)),
        C = Math.max(1, Math.round(f.length * y)),
        I = y >= 1 ? f : f.slice(0, C);
      return {
        isDenseLevel: c,
        patchProfileLevel: u,
        spotsToRender: I,
        minDimension: s,
        levelBoost: [1, 1.3, 1.75][u] || 1,
        blurMultiplier: [1, 1, 0.68][u] || 1,
        blurCap: [14, 14, 11][u] || 14,
        outerAlphaCap: [0.72, 0.76, 0.8][u] || 0.72,
        coreAlphaCap: [0.8, 0.84, 0.88][u] || 0.8,
        coreBoost: [1.7, 1.9, 2.25][u] || 1.7,
        hardCoreStrengthBase: [0, 0, 0.36][u] || 0,
        hardCoreRadiusX: [0, 0, 0.3][u] || 0,
        hardCoreRadiusY: [0, 0, 0.2][u] || 0,
        coreBlurMultiplier: [0.45, 0.45, 0.28][u] || 0.45,
      };
    }
    function Vt(i, s, c, u, f, y) {
      let C = s.radiusBoost || 1,
        I =
          typeof s.occlusionBlurScaleOverride == "number"
            ? s.occlusionBlurScaleOverride
            : z.occlusionBlurScale;
      s.spotsToRender.forEach((x) => {
        let O = c + (0.5 + x.x * 0.5) * f,
          X = u + (0.5 + x.y * 0.5) * y,
          se = s.isDenseLevel ? 2 : 1,
          V = x.r * s.minDimension * 0.3 * se * C,
          bt = x.stretchX || 1,
          Ft = x.stretchY || 1,
          Bt = x.angle || 0,
          Ze = x.blur * (s.minDimension / 900) * s.blurMultiplier * I,
          et = Math.max(0.45, Math.min(s.blurCap, Ze)),
          he = Math.min(s.outerAlphaCap, x.alpha * s.levelBoost),
          we = Math.min(
            s.coreAlphaCap,
            x.coreAlpha * s.levelBoost * s.coreBoost,
          );
        (i.save(),
          i.translate(O, X),
          i.rotate(Bt),
          i.scale(bt, Ft),
          (i.filter = `blur(${et}px)`));
        let $ = i.createRadialGradient(0, 0, 0, 0, 0, V);
        if (
          ($.addColorStop(0, `rgba(4, 3, 2, ${he})`),
          $.addColorStop(0.55, `rgba(8, 6, 4, ${he * 0.82})`),
          $.addColorStop(1, "rgba(12, 8, 5, 0)"),
          (i.fillStyle = $),
          i.beginPath(),
          i.arc(0, 0, V, 0, 2 * Math.PI),
          i.fill(),
          we > 0)
        ) {
          let P = i.createRadialGradient(0, 0, 0, 0, 0, V * 0.46);
          (P.addColorStop(0, `rgba(0, 0, 0, ${we})`),
            P.addColorStop(0.8, `rgba(6, 4, 2, ${we * 0.46})`),
            P.addColorStop(1, "rgba(8, 5, 2, 0)"),
            (i.fillStyle = P),
            i.beginPath(),
            i.arc(0, 0, V * 0.46, 0, 2 * Math.PI),
            i.fill(),
            (i.filter = `blur(${Math.max(0.1, et * s.coreBlurMultiplier)}px)`),
            (i.fillStyle = `rgba(0, 0, 0, ${Math.min(0.88, we * 0.95)})`),
            i.beginPath(),
            i.ellipse(0, 0, V * 0.26, V * 0.16, 0, 0, 2 * Math.PI),
            i.fill());
          let Pe = z.isMobileLike
            ? s.hardCoreStrengthBase * 0.55
            : s.hardCoreStrengthBase;
          Pe > 0 &&
            ((i.filter = "none"),
            (i.fillStyle = `rgba(0, 0, 0, ${Math.min(Pe, we * 1.4)})`),
            i.beginPath(),
            i.ellipse(
              0,
              0,
              V * s.hardCoreRadiusX,
              V * s.hardCoreRadiusY,
              0,
              0,
              2 * Math.PI,
            ),
            i.fill());
        }
        i.restore();
      });
    }
    function tn(i) {
      if (!z.isMobileLike || i <= 0) return null;
      if (De.has(i)) return De.get(i);
      if (
        typeof document == "undefined" ||
        typeof document.createElement != "function"
      )
        return (De.set(i, null), null);
      let s = qt(i, je);
      if (!s) return (De.set(i, null), null);
      let c = document.createElement("canvas");
      ((c.width = je), (c.height = je));
      let u = c.getContext("2d");
      return u
        ? (u.save(),
          (u.globalCompositeOperation = "source-over"),
          Vt(u, s, 0, 0, je, je),
          (u.filter = "none"),
          u.restore(),
          De.set(i, c),
          c)
        : (De.set(i, null), null);
    }
    function an(i, s) {
      if (!z.isMobileLike || i <= 0 || t.width <= 0 || t.height <= 0)
        return null;
      let c = `${i}:${t.width}x${t.height}`;
      if (Re.has(c)) return Re.get(c);
      if (
        typeof document == "undefined" ||
        typeof document.createElement != "function"
      )
        return (Re.set(c, null), null);
      let u = document.createElement("canvas");
      ((u.width = t.width), (u.height = t.height));
      let f = u.getContext("2d");
      if (!f) return (Re.set(c, null), null);
      (s.yellowTint > 0 &&
        ((f.fillStyle = `rgba(226, 188, 92, ${s.yellowTint})`),
        f.fillRect(0, 0, u.width, u.height)),
        s.darkTint > 0 &&
          ((f.fillStyle = `rgba(35, 24, 5, ${s.darkTint})`),
          f.fillRect(0, 0, u.width, u.height)),
        s.hazeTint > 0 &&
          ((f.fillStyle = `rgba(250, 236, 208, ${s.hazeTint})`),
          f.fillRect(0, 0, u.width, u.height)));
      let y = Ue * 1.12,
        C = u.width * y,
        I = u.height * y,
        x = (u.width - C) / 2,
        O = (u.height - I) / 2,
        X = qt(i, Math.max(1, Math.min(C, I)));
      return (
        X &&
          ((X.radiusBoost = 1.08),
          (X.occlusionBlurScaleOverride = 0.92),
          Vt(f, X, x, O, C, I),
          (f.filter = "none")),
        Re.set(c, u),
        u
      );
    }
    function nn(i, s) {
      let c = an(i, s);
      c &&
        (l.save(),
        (l.globalCompositeOperation = "source-over"),
        l.drawImage(c, 0, 0, t.width, t.height),
        l.restore());
    }
    function sn(i, s, c, u, f) {
      let y = tn(f);
      if (y) {
        (l.save(),
          (l.globalCompositeOperation = "source-over"),
          l.drawImage(y, i, s, c, u),
          l.restore());
        return;
      }
      let C = Math.min(c, u),
        I = qt(f, C);
      I &&
        (l.save(),
        (l.globalCompositeOperation = "source-over"),
        Vt(l, I, i, s, c, u),
        (l.filter = "none"),
        l.restore());
    }
    function gt() {
      return me.x === 0 && me.y === 0 ? !1 : ((me = { x: 0, y: 0 }), !0);
    }
    function Ci(i) {
      if (!e.viewer.nystagmusEnabled) return ((Te = 0), gt());
      Te === 0 && (Te = i);
      let s = pt(e.viewer.nystagmusDirection),
        c = mt(e.viewer.nystagmusRate),
        f = (((i - Te) / 1e3) * Gi[c]) % 1,
        y = Math.max(10, Math.min(42, t.width * 0.018)),
        C = y * 0.55,
        I =
          f < 0.75
            ? -y + (f / 0.75) * (2 * y)
            : y - ((f - 0.75) / 0.25) * (2 * y),
        x = {
          x: s === "vertical" ? 0 : I,
          y: s === "horizontal" ? 0 : s === "vertical" ? I : I >= 0 ? C : -C,
        };
      return Math.abs(me.x - x.x) < 0.02 && Math.abs(me.y - x.y) < 0.02
        ? !1
        : ((me = {
            x: parseFloat(x.x.toFixed(2)),
            y: parseFloat(x.y.toFixed(2)),
          }),
          !0);
    }
    function xi() {
      if (ke !== null) return;
      let i = (s) => {
        if (((ke = null), !e.viewer.nystagmusEnabled)) {
          gt() && q();
          return;
        }
        (Ci(s), q(), (ke = requestAnimationFrame(i)));
      };
      ke = requestAnimationFrame(i);
    }
    function Ai() {
      ke !== null && (cancelAnimationFrame(ke), (ke = null));
    }
    function Ke(i) {
      let s =
          typeof i == "number"
            ? i
            : typeof window != "undefined" && window.performance
              ? window.performance.now()
              : Date.now(),
        c = z.isMobileLike && e.viewer.cataractLevel > 0,
        u = c ? z.cataractJitterIntervalMs : z.baseJitterIntervalMs;
      if (c && ue) {
        U = requestAnimationFrame(Ke);
        return;
      }
      if (s - ci < u) {
        U = requestAnimationFrame(Ke);
        return;
      }
      ci = s;
      let f = c ? 0.58 : 1,
        y = qa * Le.jitterMultiplier * f,
        C = Math.max(0.72, 0.85 - (Le.jitterMultiplier - 1) * 0.04),
        I = (Math.random() - 0.5) * y,
        x = (Math.random() - 0.5) * y;
      ((ae += I),
        (ne += x),
        (ae *= C),
        (ne *= C),
        (Fe += ae),
        (Be += ne),
        Ci(s),
        Je(),
        q(),
        (U = requestAnimationFrame(Ke)));
    }
    function rn(i = {}) {
      e.viewer.shiftInProgress = !0;
      let s = ue,
        c = ae,
        u = ne;
      ((ue = !1), (ae = 0), (ne = 0));
      let f = Fe,
        y = Be,
        C = J(i.distanceMultiplier, 0.25, 4, 1) * Le.shiftDistanceMultiplier,
        I = _a * C,
        x = J(
          i.returnDelayMs,
          Se.shiftDurationMs.min,
          Se.shiftDurationMs.max,
          Le.shiftDurationMs,
        ),
        O = Math.random() * 2 * Math.PI;
      ((Fe += I * Math.cos(O)),
        (Be += I * Math.sin(O)),
        mi(Math.cos(O), Math.sin(O), 0.7),
        Je(),
        q(),
        be !== null && (clearTimeout(be), (be = null)),
        (be = setTimeout(() => {
          ((Fe = f),
            (Be = y),
            Je(),
            q(),
            (ue = s),
            (ae = c),
            (ne = u),
            (e.viewer.shiftInProgress = !1),
            (be = null));
        }, x)));
    }
    function on() {
      if (z.isMobileLike || te !== null) return;
      let i = () => {
        (ue
          ? (dt = {
              x: (Math.random() - 0.5) * 100,
              y: (Math.random() - 0.5) * 100,
            })
          : (dt = { x: 0, y: 0 }),
          (Ie.x += (dt.x - Ie.x) * 0.1),
          (Ie.y += (dt.y - Ie.y) * 0.1),
          q(),
          (te = requestAnimationFrame(i)));
      };
      i();
    }
    function ln() {
      (te !== null && (cancelAnimationFrame(te), (te = null)),
        (Ie = { x: 0, y: 0 }),
        q());
    }
    function ft() {
      if (!R.naturalWidth || !R.naturalHeight) return;
      let i = Math.max(0.45, Math.min(1, z.canvasScale));
      ((t.width = Math.max(1, Math.round(R.naturalWidth * i))),
        (t.height = Math.max(1, Math.round(R.naturalHeight * i))),
        (l.imageSmoothingEnabled = !0),
        (l.imageSmoothingQuality = z.isMobileLike ? "medium" : "high"),
        (G = t.width / 2),
        (H = t.height / 2),
        (ae = 0),
        (ne = 0),
        (Fe = 0),
        (Be = 0),
        (me = { x: 0, y: 0 }),
        (Te = 0),
        Re.clear(),
        We.clear(),
        q());
    }
    function cn() {
      if (kt || !R.naturalWidth || !R.naturalHeight) return;
      l.clearRect(0, 0, t.width, t.height);
      let i = Bi({
          canvasWidth: t.width,
          canvasHeight: t.height,
          imageNaturalWidth: R.naturalWidth,
          imageNaturalHeight: R.naturalHeight,
          imageScale: yi(),
          zoomFactor: Ue,
          bgOffsetX: Fe + me.x,
          bgOffsetY: Be + me.y,
          circleRadius: $e,
          circleX: G,
          isRightEye: e.viewer.isRightEye,
        }),
        s = E[e.viewer.cataractLevel] || E[0];
      (dn(i, s), hn(i), pn(i, s), fn(i), yn(), Va());
    }
    function $t(i, s, c) {
      (l.beginPath(),
        l.arc(i, s, c, 0, 2 * Math.PI, !0),
        l.closePath(),
        l.clip());
    }
    function dn(i, s) {
      if (
        (l.save(),
        e.viewer.isRightEye || (l.translate(t.width, 0), l.scale(-1, 1)),
        $t(i.flippedCircleX, H, i.effectiveCircleRadius),
        e.viewer.isDiscVisible)
      ) {
        let c = Ua(i);
        (l.save(),
          ye === "holo-bio" &&
            (l.translate(c.centreX, c.centreY),
            l.rotate(Math.PI),
            l.translate(-c.centreX, -c.centreY)),
          gi(c),
          (l.filter = ja(s)),
          l.drawImage(
            R,
            0,
            0,
            R.naturalWidth,
            R.naturalHeight,
            c.offsetXPos,
            c.offsetYPos,
            c.scaledWidth,
            c.scaledHeight,
          ),
          (l.filter = "none"),
          l.restore(),
          z.isMobileLike && e.viewer.cataractLevel > 0
            ? nn(e.viewer.cataractLevel, s)
            : (un(s),
              l.save(),
              gi(c),
              sn(
                c.offsetXPos,
                c.offsetYPos,
                c.scaledWidth,
                c.scaledHeight,
                e.viewer.cataractLevel,
              ),
              l.restore()));
      } else ((l.fillStyle = "black"), l.fillRect(0, 0, t.width, t.height));
      l.restore();
    }
    function un(i) {
      (i.yellowTint > 0 &&
        ((l.fillStyle = `rgba(226, 188, 92, ${i.yellowTint})`),
        l.fillRect(0, 0, t.width, t.height)),
        i.darkTint > 0 &&
          ((l.fillStyle = `rgba(35, 24, 5, ${i.darkTint})`),
          l.fillRect(0, 0, t.width, t.height)),
        i.hazeTint > 0 &&
          ((l.fillStyle = `rgba(250, 236, 208, ${i.hazeTint})`),
          l.fillRect(0, 0, t.width, t.height)));
    }
    function pn(i, s) {
      W().showCornealReflex &&
        (l.save(),
        $t(G, H, i.effectiveCircleRadius),
        e.viewer.isDiscVisible && mn(i.effectiveCircleRadius, s),
        l.restore());
    }
    function mn(i, s) {
      let c = Yi({
          cataractLevel: e.viewer.cataractLevel,
          darkTint: s.darkTint,
          yellowTint: s.yellowTint,
        }),
        f =
          375 *
          (R.naturalHeight > 0
            ? Math.max(0.45, Math.min(1, t.height / R.naturalHeight))
            : 1),
        y = 1.3,
        C = 0.6 * f * y,
        I = 0.5 * f * y,
        x = 0.7,
        O = C * x,
        X = I * x,
        se = G + Ie.x,
        V = H + 0.3 * i + Ie.y;
      (l.save(),
        l.translate(se, V),
        l.scale(1, -1),
        l.translate(-se, -V),
        Ei(se, V, C, I, 0.5 * c),
        Ei(se, V, O, X, c),
        l.restore());
    }
    function Ei(i, s, c, u, f) {
      let y = c / 2,
        C = u / 2,
        I = C * 0.6;
      (l.beginPath(),
        l.ellipse(i, s, y, C, 0, Math.PI, 2 * Math.PI, !1),
        l.ellipse(i, s, y, I, 0, 0, Math.PI, !1),
        l.closePath(),
        (l.fillStyle = `rgba(255,255,255,${f})`),
        l.fill());
    }
    function hn(i) {
      if (ye !== "holo-bio" || !e.viewer.isDiscVisible) return;
      let s = Math.max(0.45, 1 - e.viewer.cataractLevel * 0.16),
        c = Math.min(0.96, Me * 1.25 * s);
      if (c < 0.03) return;
      let u = i.effectiveCircleRadius,
        f = G,
        y = H,
        C = Math.max(-0.06, Math.min(0.06, Math.sin(Lt) * 0.06)),
        I =
          typeof window != "undefined" && window.performance
            ? window.performance.now()
            : Date.now(),
        x = 0.88 + 0.16 * Math.sin(I * 0.011 + Lt * 2),
        O = gn(u);
      O &&
        (l.save(),
        $t(f, y, u),
        (l.globalCompositeOperation = "source-over"),
        (l.globalAlpha = Math.max(0, Math.min(0.96, c * x))),
        l.translate(f, y),
        l.rotate(C),
        l.drawImage(O.canvas, -O.centre, -O.centre),
        l.restore());
    }
    function gn(i) {
      if (typeof document == "undefined") return null;
      let s = Math.max(1, Math.round(i)),
        c = z.isMobileLike,
        u = `${c ? "m" : "d"}-${s}`;
      if (We.has(u)) return We.get(u);
      let f = Math.ceil(s * 0.38),
        y = s + f,
        C = Math.ceil(y * 2),
        I = document.createElement("canvas");
      ((I.width = C), (I.height = C));
      let x = I.getContext("2d");
      if (!x) return (We.set(u, null), null);
      let O = -0.78,
        X = 1.22,
        se = O + Math.PI,
        V = X + Math.PI,
        bt = s * 0.87,
        Ft = Math.max(14, s * 0.38),
        Bt = Math.max(5, s * 0.13),
        Ze = c ? 40 : 28,
        et = c ? 0.018 : 0.012,
        he = ({
          arcRadius: $,
          lineWidth: P,
          start: Pe,
          end: Ii,
          colourAt: Rn,
        }) => {
          for (let wt = 0; wt < Ze; wt += 1) {
            let Mi = wt / Ze,
              Li = (wt + 1) / Ze,
              ki = (Mi + Li) / 2,
              Ti = Math.pow(Math.sin(Math.PI * ki), 1.15);
            if (Ti <= 0) continue;
            let Nn = Pe + (Ii - Pe) * Math.max(0, Mi - et),
              Pn = Pe + (Ii - Pe) * Math.min(1, Li + et);
            ((x.strokeStyle = Rn(ki, Ti)),
              (x.lineWidth = P),
              x.beginPath(),
              x.arc(y, y, $, Nn, Pn),
              x.stroke());
          }
        };
      ((x.imageSmoothingEnabled = !0),
        (x.imageSmoothingQuality = c ? "medium" : "high"),
        (x.globalCompositeOperation = "source-over"),
        (x.filter = c ? "none" : `blur(${Math.max(1.8, s * 0.014)}px)`),
        (x.lineCap = "round"),
        (x.lineJoin = "round"),
        he({
          arcRadius: bt,
          lineWidth: Ft,
          start: O,
          end: X,
          colourAt: ($, P) =>
            $ > 0.76
              ? `rgba(91, 207, 255, ${0.62 * P})`
              : $ > 0.58
                ? `rgba(255, 172, 52, ${0.76 * P})`
                : `rgba(255, 223, 112, ${0.98 * P})`,
        }),
        he({
          arcRadius: s * 0.94,
          lineWidth: Math.max(7, s * 0.16),
          start: 0.08,
          end: X,
          colourAt: ($, P) =>
            $ < 0.28
              ? "rgba(255, 255, 255, 0)"
              : `rgba(43, 124, 255, ${0.76 * P})`,
        }),
        he({
          arcRadius: bt,
          lineWidth: Bt,
          start: se,
          end: V,
          colourAt: ($, P) =>
            $ > 0.7
              ? `rgba(87, 196, 255, ${0.25 * P})`
              : $ > 0.52
                ? `rgba(255, 177, 58, ${0.24 * P})`
                : `rgba(255, 228, 128, ${0.32 * P})`,
        }),
        he({
          arcRadius: s * 0.94,
          lineWidth: Math.max(2, s * 0.042),
          start: se + 0.18,
          end: V - 0.08,
          colourAt: ($, P) => `rgba(78, 163, 255, ${0.2 * P})`,
        }),
        (x.filter = "none"),
        he({
          arcRadius: s * 0.985,
          lineWidth: Math.max(1, s * 0.012),
          start: O + 0.08,
          end: X - 0.08,
          colourAt: ($, P) => `rgba(255, 255, 255, ${0.22 * P})`,
        }),
        he({
          arcRadius: s * 0.985,
          lineWidth: Math.max(1, s * 0.007),
          start: se + 0.16,
          end: V - 0.16,
          colourAt: ($, P) => `rgba(255, 255, 255, ${0.08 * P})`,
        }));
      let we = { canvas: I, centre: y };
      return (We.set(u, we), we);
    }
    function fn(i) {
      let s = 18 * i.windowScale * i.scaleFactor;
      (l.save(),
        l.beginPath(),
        l.arc(G, H, i.effectiveCircleRadius, 0, 2 * Math.PI, !0),
        (l.strokeStyle = "rgba(255, 255, 255, 0.24)"),
        (l.lineWidth = s * 2),
        l.stroke(),
        l.beginPath(),
        l.arc(G, H, i.effectiveCircleRadius, 0, 2 * Math.PI, !0),
        (l.strokeStyle = "rgba(255, 255, 255, 0.66)"),
        (l.lineWidth = s),
        l.stroke(),
        l.beginPath(),
        l.arc(G, H, i.effectiveCircleRadius, 0, 2 * Math.PI, !0),
        (l.strokeStyle = "rgba(255, 255, 255, 0.92)"),
        (l.lineWidth = Math.max(2, s * 0.5)),
        l.stroke(),
        l.restore());
    }
    function yn() {
      let i = Math.max(1, t.clientWidth || t.width),
        s = Math.max(1, t.clientHeight || t.height),
        c = t.width / i,
        u = t.height / s,
        f = Math.max(10, Math.min(16, i * 0.02)),
        y = Math.max(10, Math.min(13, i * 0.011)),
        C = f * c,
        I = s * 0.5 * u,
        x = y * c;
      (l.save(),
        (l.fillStyle = "rgba(148, 163, 184, 0.82)"),
        (l.font = `600 ${x}px 'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`),
        (l.textAlign = "center"),
        (l.textBaseline = "middle"),
        e.viewer.isRightEye !== (ye === "holo-bio")
          ? (l.save(),
            l.translate(C, I),
            l.rotate(-Math.PI / 2),
            l.fillText("Temporal", 0, 0),
            l.restore(),
            l.save(),
            l.translate(t.width - C, I),
            l.rotate(Math.PI / 2),
            l.fillText("Nasal", 0, 0),
            l.restore())
          : (l.save(),
            l.translate(C, I),
            l.rotate(-Math.PI / 2),
            l.fillText("Nasal", 0, 0),
            l.restore(),
            l.save(),
            l.translate(t.width - C, I),
            l.rotate(Math.PI / 2),
            l.fillText("Temporal", 0, 0),
            l.restore()),
        l.restore());
    }
    function Je() {
      if (!R.naturalWidth || !R.naturalHeight) return;
      let i = Wi({
          canvasWidth: t.width,
          canvasHeight: t.height,
          imageNaturalWidth: R.naturalWidth,
          imageNaturalHeight: R.naturalHeight,
          imageScale: yi(),
          circleRadius: $e,
          zoomFactor: Ue,
        }),
        s = zi({
          circleX: G,
          circleY: H,
          velocityX: ae,
          velocityY: ne,
          bounds: i,
        });
      ((G = s.circleX),
        (H = s.circleY),
        (ae = s.velocityX),
        (ne = s.velocityY));
    }
    function bn() {
      Ne() !== Qe() && ht(Qe());
    }
    function wn(i) {
      let s = !!i;
      yt() !== s && ht(s ? Rt() : Qe());
    }
    function yt() {
      return Ne() === Rt();
    }
    function vn(i) {
      let s = de[i] ? i : fe;
      if (ye === s) return;
      let c = yt();
      ((ye = s), fi(), ht(c ? Rt() : Qe()), q());
    }
    function Sn(i) {
      let s = !!i;
      e.viewer.isRightEye !== s &&
        ((p.checked = !s), (e.viewer.isRightEye = s), ft(), Pt());
    }
    function Cn() {
      return e.viewer.isRightEye;
    }
    function xn(i) {
      let s = E.length - 1,
        c = Math.max(0, Math.min(s, Number(i) || 0));
      Number(g.value) !== c && ((g.value = String(c)), Ot(), q());
    }
    function An() {
      return Number(g.value) || 0;
    }
    function En(i) {
      let s = !!i;
      e.viewer.nystagmusEnabled !== s &&
        ((e.viewer.nystagmusEnabled = s),
        (Te = 0),
        s ? xi() : (Ai(), gt()),
        q());
    }
    function In({ direction: i, rate: s } = {}) {
      ((e.viewer.nystagmusDirection = pt(i || e.viewer.nystagmusDirection)),
        (e.viewer.nystagmusRate = mt(s || e.viewer.nystagmusRate)),
        (Te = 0),
        e.viewer.nystagmusEnabled && xi(),
        q());
    }
    function Mn() {
      return {
        enabled: !!e.viewer.nystagmusEnabled,
        direction: pt(e.viewer.nystagmusDirection),
        rate: mt(e.viewer.nystagmusRate),
      };
    }
    function Ln(i) {
      ((e.viewer.isDiscVisible = i), q());
    }
    function kn(i) {
      (T.forEach((s) => {
        s.disabled = i;
      }),
        (n.disabled = i),
        (p.disabled = i),
        (g.disabled = i));
    }
    function Tn() {
      return e.viewer.conditionImageSrc || L;
    }
    function Dn() {
      (j.remove(),
        ui.splice(0).forEach((i) => {
          i();
        }),
        U !== null && (cancelAnimationFrame(U), (U = null)),
        pe !== null && (cancelAnimationFrame(pe), (pe = null)),
        te !== null && (cancelAnimationFrame(te), (te = null)),
        be !== null && (clearTimeout(be), (be = null)),
        Ai(),
        gt(),
        (e.viewer.shiftInProgress = !1),
        De.clear(),
        Re.clear(),
        We.clear());
    }
    return {
      initialize: $a,
      doGazeShift: rn,
      setDiscVisible: Ln,
      setImageSource: Xe,
      setViewerCase: Ha,
      setViewerMode: vn,
      setViewerControlsDisabled: kn,
      ensureUndilated: bn,
      setDilated: wn,
      getIsDilated: yt,
      setRightEye: Sn,
      getIsRightEye: Cn,
      setCataractLevel: xn,
      getCataractLevel: An,
      setNystagmusEnabled: En,
      setNystagmusConfig: In,
      getNystagmusConfig: Mn,
      setTimedAugmentation: Xa,
      clearTimedAugmentation: Qa,
      setTimedMotionProfile: Ka,
      clearTimedMotionProfile: Ja,
      setFovDegrees: ht,
      getFovDegrees: en,
      getActiveConditionImagePath: Tn,
      destroy: Dn,
    };
  }
  var Z = Object.freeze([
      {
        id: "case-01",
        label: "1",
        title: "Case 1",
        summary: "Normal disc",
        description: [
          "Clear margins, healthy rim and small physiological cup.",
          "Fine vessels and nerve fibre layer remain visible around the disc.",
          "Use this as the general comparison image.",
        ],
        src: "assets/images/discs/case-01.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/case-01_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/case-01_dark.webp?v=20260531-casesets",
      },
      {
        id: "case-02",
        label: "2",
        title: "Case 2",
        summary: "Disc swelling",
        description: [
          "Blurred disc margin, raised nerve head or obscured vessels suggest swelling.",
          "Check symptoms, VA, pupils and both discs carefully.",
          "True swelling or uncertainty should trigger urgent clinical review.",
        ],
        src: "assets/images/discs/case-02.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/case-02_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/case-02_dark.webp?v=20260531-casesets",
      },
      {
        id: "case-03",
        label: "3",
        title: "Case 3",
        summary: "Diffuse atrophy",
        description: [
          "Diffuse optic disc pallor or atrophy.",
          "Compare rim colour, vessel calibre and the fellow eye.",
          "Reduced VA, field loss or abnormal pupil increases concern.",
        ],
        src: "assets/images/discs/case-03.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/case-03_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/case-03_dark.webp?v=20260531-casesets",
      },
      {
        id: "case-04",
        label: "4",
        title: "Case 4",
        summary: "Cupped disc",
        description: [
          "Cupped disc for glaucoma-pattern recognition.",
          "Judge rim thickness, disc size, asymmetry and cup/disc ratio together.",
          "Look for notch, splinter haemorrhage, vessel change and field context.",
        ],
        src: "assets/images/discs/case-04.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/case-04_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/case-04_dark.webp?v=20260531-casesets",
      },
      {
        id: "case-05",
        label: "5",
        title: "Case 5",
        summary: "Temporal atrophy",
        description: [
          "Temporal pallor, peripapillary atrophy or tilted-disc pattern.",
          "Compare both eyes, refraction and previous records where available.",
          "Myopia and tilt can make the cup and margin look misleading.",
        ],
        src: "assets/images/discs/case-05.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/case-05_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/case-05_dark.webp?v=20260531-casesets",
      },
      {
        id: "case-06",
        label: "6",
        title: "Case 6",
        summary: "Disc drusen",
        description: [
          "Disc drusen or pseudo-swelling pattern.",
          "Lumpy elevation can mimic true disc swelling.",
          "If symptoms, abnormal pupils or uncertainty are present, manage as swelling.",
        ],
        src: "assets/images/discs/case-06.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/case-06_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/case-06_dark.webp?v=20260531-casesets",
      },
      {
        id: "case-07",
        label: "7",
        title: "Case 7",
        summary: "Hypoplasia",
        description: [
          "Small or hypoplastic disc appearance.",
          "Disc size changes how cup/disc ratio should be interpreted.",
          "Record VA, pupils, field concerns and whether the appearance is longstanding.",
        ],
        src: "assets/images/discs/case-07.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/case-07_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/case-07_dark.webp?v=20260531-casesets",
      },
      {
        id: "case-08",
        label: "8",
        title: "Case 8",
        summary: "Morning glory",
        description: [
          "Congenital anomalous disc appearance such as morning glory.",
          "Look for excavation, radial vessels and surrounding pigment change.",
          "Do not treat as glaucoma cupping; arrange specialist review if new or uncertain.",
        ],
        src: "assets/images/discs/case-08.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/case-08_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/case-08_dark.webp?v=20260531-casesets",
      },
      {
        id: "case-09",
        label: "9",
        title: "Case 9",
        summary: "Myelination",
        description: [
          "Myelinated nerve fibre layer around the disc.",
          "White feathery nerve fibre change can obscure vessels.",
          "Record extent and avoid confusing it with swelling or exudate.",
        ],
        src: "assets/images/discs/case-09.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/case-09_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/case-09_dark.webp?v=20260531-casesets",
      },
      {
        id: "phys-01",
        label: "10",
        title: "Case 10",
        summary: "C/D 0.1 disc",
        description: [
          "Very small physiological cup with broad rim.",
          "Useful calibration image for rim width and cup estimation.",
          "A small cup alone does not exclude other disc disease.",
        ],
        src: "assets/images/discs/phys-01.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/phys-01_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/phys-01_dark.webp?v=20260531-casesets",
      },
      {
        id: "phys-03",
        label: "11",
        title: "Case 11",
        summary: "C/D 0.3 disc",
        description: [
          "Small physiological cup with a continuous rim.",
          "Compare the cup contour with the neuroretinal rim.",
          "Cup estimate should be interpreted with disc size and field context.",
        ],
        src: "assets/images/discs/phys-03.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/phys-03_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/phys-03_dark.webp?v=20260531-casesets",
      },
      {
        id: "phys-05",
        label: "12",
        title: "Case 12",
        summary: "C/D 0.5 disc",
        description: [
          "Moderate physiological cupping example.",
          "Assess rim thickness, symmetry and vessel course.",
          "Compare with the fellow eye and previous records where available.",
        ],
        src: "assets/images/discs/phys-05.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/phys-05_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/phys-05_dark.webp?v=20260531-casesets",
      },
      {
        id: "phys-07",
        label: "13",
        title: "Case 13",
        summary: "C/D 0.7 disc",
        description: [
          "Large physiological cup can still be normal when the rim is healthy.",
          "Check for focal rim thinning, asymmetry, notch or disc haemorrhage.",
          "Disc size, IOP, fields and previous records decide how suspicious this is.",
        ],
        src: "assets/images/discs/phys-07.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/phys-07_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/phys-07_dark.webp?v=20260531-casesets",
      },
      {
        id: "phys-a",
        label: "14",
        title: "Case 14",
        summary: "Normal baseline",
        description: [
          "Small physiological cup with broad continuous rim.",
          "Fine radial nerve fibre layer striations remain visible.",
          "Healthy comparison: no vessel displacement, lamina dots or true peripapillary atrophy.",
        ],
        src: "assets/images/discs/phys-a.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/phys-a_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/phys-a_dark.webp?v=20260531-casesets",
      },
      {
        id: "phys-b",
        label: "15",
        title: "Case 15",
        summary: "Early cupping",
        description: [
          "Temporal cup enlargement with first fine lamina dots.",
          "Rim starts to thin, but no clear nerve fibre defect is seen.",
          "Slight vessel bending only; do not overcall bayoneting.",
        ],
        src: "assets/images/discs/phys-b.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/phys-b_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/phys-b_dark.webp?v=20260531-casesets",
      },
      {
        id: "phys-c",
        label: "16",
        title: "Case 16",
        summary: "Moderate asymmetric glaucoma",
        description: [
          "Asymmetric temporal cup with sectoral rim notch.",
          "Local nerve fibre loss and superotemporal splinter haemorrhage.",
          "Vessels begin to kink; lamina pores become obvious.",
        ],
        src: "assets/images/discs/phys-c.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/phys-c_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/phys-c_dark.webp?v=20260531-casesets",
      },
      {
        id: "phys-d",
        label: "17",
        title: "Case 17",
        summary: "Advanced glaucoma loss",
        description: [
          "Deep steep cup with superior and inferior rim thinning.",
          "Two nerve fibre layer defects match arcuate damage zones.",
          "Exposed lamina and nasalised vessels with clear bayoneting.",
        ],
        src: "assets/images/discs/phys-d.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/phys-d_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/phys-d_dark.webp?v=20260531-casesets",
      },
      {
        id: "phys-e",
        label: "18",
        title: "Case 18",
        summary: "Very advanced cupping",
        description: [
          "Giant cup with severe rim loss, mainly nasal rim left.",
          "Only nasal nerve fibre layer remains clearly visible.",
          "Strong temporal atrophy, pigment crescent and choroidal show-through.",
        ],
        src: "assets/images/discs/phys-e.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/phys-e_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/phys-e_dark.webp?v=20260531-casesets",
      },
      {
        id: "phys-f",
        label: "19",
        title: "Case 19",
        summary: "End-stage cupping",
        description: [
          "Near-total excavation with minimal residual rim.",
          "No meaningful visible nerve fibre layer remains.",
          "Maximal lamina exposure, severe vessel displacement and bayoneting.",
        ],
        src: "assets/images/discs/phys-f.webp?v=20260531-casesets",
        thumbSrc: "assets/images/discs/phys-f_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/phys-f_dark.webp?v=20260531-casesets",
      },
      {
        id: "phys-tilt",
        label: "20",
        title: "Case 20",
        summary: "Tilted normal disc",
        description: [
          "Tilted disc appearance can be a normal variant.",
          "Tilt and peripapillary atrophy can make cup/disc judgement harder.",
          "Compare both eyes and avoid over-calling glaucoma from tilt alone.",
        ],
        src: "assets/images/discs/phys-tilt.webp?v=20260531-casesets",
        thumbSrc:
          "assets/images/discs/phys-tilt_thumb.webp?v=20260531-casesets",
        darkSrc: "assets/images/discs/phys-tilt_dark.webp?v=20260531-casesets",
      },
    ]),
    it = Object.freeze([
      {
        id: "neurology",
        label: "General discs",
        shortLabel: "General",
        caseIds: [
          "case-01",
          "case-02",
          "case-03",
          "case-04",
          "case-05",
          "case-06",
          "case-07",
          "case-08",
          "case-09",
        ],
      },
      {
        id: "normal-cups",
        label: "Normal cups",
        shortLabel: "Normal",
        caseIds: ["phys-01", "phys-03", "phys-05", "phys-07", "phys-tilt"],
      },
      {
        id: "glaucoma-loss",
        label: "Glaucoma sequence",
        shortLabel: "Progression",
        caseIds: ["phys-a", "phys-b", "phys-c", "phys-d", "phys-e", "phys-f"],
      },
    ]),
    Qi = Z[0].src,
    Ki = Object.freeze({
      "case-01":
        "<p>Use the viewing window to scan the image, then record View and Findings.</p>",
      normal:
        "<p>Use the viewing window to scan the image, then record View and Findings.</p>",
    }),
    Ji = [
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
    Zi = [
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
  function ea() {
    return { distanceVA: "", viewQuality: "", areaSeen: "", findings: Vi() };
  }
  function Ut() {
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
      eyes: { right: ea(), left: ea() },
    };
  }
  function ta(e) {
    let t = Ut();
    return (
      (e.eyes = t.eyes),
      (e.systemicChecks = t.systemicChecks),
      (e.dilation = t.dilation),
      (e.mode = t.mode),
      e
    );
  }
  function ia(e, t) {
    ((e.mode = t),
      Object.keys(e.eyes).forEach((n) => {
        let a = e.eyes[n];
        Wt[t].some((r) => r.value === a.areaSeen) || (a.areaSeen = "");
      }));
  }
  function aa(e, t) {
    e.dilation = t;
  }
  function na(e, t, n) {
    e.systemicChecks[t] = n;
  }
  function jt(e, t, n) {
    e.eyes[t].distanceVA = n;
  }
  function Xt(e, t, n, a) {
    e.eyes[t][n] = a;
  }
  function sa(e, t, n, a) {
    let r = e.eyes[t].findings;
    if (n === "noReferableSignsSeen") {
      ((r.noReferableSignsSeen = a),
        a &&
          Pi.forEach((d) => {
            r[d] = !1;
          }));
      return;
    }
    ((r[n] = a), a && (r.noReferableSignsSeen = !1));
  }
  var F = {
      incomplete: 0,
      routineScreen: 1,
      ungradable: 2,
      routineReferral: 3,
      referSoon: 4,
      fastGlaucoma: 5,
      urgent: 6,
    },
    xt = {
      incomplete: {
        title: "Record both eyes",
        next: "Complete R/L VA, view and findings.",
        tone: "neutral",
      },
      routineScreen: {
        title: "Routine disc check",
        next: "Continue local review pathway.",
        tone: "green",
      },
      ungradable: {
        title: "Ungradable (repeat)",
        next: "Repeat dilated view/photo. Refer if still poor.",
        tone: "orange",
      },
      routineReferral: {
        title: "Routine review",
        next: "Refer routinely when possible.",
        tone: "green",
      },
      referSoon: {
        title: "Soon",
        next: "Specialist review soon; escalate if acute symptoms, pupil or field concern.",
        tone: "orange",
      },
      fastGlaucoma: {
        title: "Fast glaucoma review",
        next: "Arrange rapid glaucoma or eye review.",
        tone: "red",
      },
      urgent: {
        title: "Urgent",
        next: "Same-day or rapid eye referral.",
        tone: "red",
      },
    },
    Fn = new Set(["6/36", "6/60", "HM", "fix_follow_poor"]),
    Bn = new Set(["unable_test"]),
    Wn = new Set(["6/12", "fix_follow_good"]);
  function at(e, t) {
    return t.filter((n) => !!e[n]);
  }
  function nt(e) {
    return e
      .map((t) => {
        var n, a;
        return (
          ((n = Yt[t]) == null ? void 0 : n.shortLabel) ||
          ((a = Yt[t]) == null ? void 0 : a.label)
        );
      })
      .filter(Boolean);
  }
  function zn(e) {
    return Fn.has(e)
      ? "reduced"
      : Bn.has(e)
        ? "untestable"
        : Wn.has(e)
          ? "mild"
          : "none";
  }
  function Yn(e) {
    return e.viewQuality === "clear" && e.areaSeen && e.areaSeen !== "limited";
  }
  function Gn(e) {
    return (
      e.viewQuality === "ungradable" ||
      e.viewQuality === "partial" ||
      e.viewQuality === "hazy" ||
      e.areaSeen === "limited"
    );
  }
  function Hn(e) {
    return !!(
      e.distanceVA ||
      e.viewQuality ||
      e.areaSeen ||
      Object.values(e.findings).some(Boolean)
    );
  }
  function Un(e, t, n) {
    let a = vt[e],
      r = t.findings,
      d = at(r, Gt),
      p = at(r, Ht),
      h = at(r, _i),
      A = at(r, Oi),
      g = at(r, qi),
      v = [...d, ...p, ...h, ...A].length > 0,
      b = zn(t.distanceVA),
      T = b === "reduced" || b === "untestable",
      L = h.length > 0 || (T && v),
      M = Gn(t),
      E = Yn(t),
      N = Hn(t),
      k = {
        eyeKey: e,
        eyeLabel: a,
        viewAdequate: E,
        viewLimited: M,
        selectedFindings: Ct(r),
        vaRisk: b,
        priority: F.incomplete,
        actionKey: "incomplete",
        reasons: [],
        limitations: [],
        summary: "Not recorded",
      };
    if (d.length > 0)
      return {
        ...k,
        priority: F.urgent,
        actionKey: "urgent",
        reasons: nt(d),
        limitations: M ? ["limited view"] : [],
        summary: "Urgent",
      };
    if (p.length > 0)
      return {
        ...k,
        priority: F.fastGlaucoma,
        actionKey: "fastGlaucoma",
        reasons: nt(p),
        limitations: M ? ["limited view"] : [],
        summary: "Fast glaucoma review",
      };
    if (L) {
      let _ = nt(h);
      return (
        T &&
          _.push(
            `${tt(t.distanceVA)} VA${h.length === 0 ? " with disc signs" : ""}`,
          ),
        {
          ...k,
          priority: F.referSoon,
          actionKey: "referSoon",
          reasons: _,
          limitations: M ? ["limited view"] : [],
          summary: "Refer soon",
        }
      );
    }
    return A.length > 0
      ? {
          ...k,
          priority: F.routineReferral,
          actionKey: "routineReferral",
          reasons: nt(A),
          limitations: M ? ["limited view"] : [],
          summary: "Routine referral",
        }
      : M
        ? {
            ...k,
            priority: F.ungradable,
            actionKey: "ungradable",
            reasons: [
              t.viewQuality === "ungradable"
                ? "Ungradable view"
                : "Limited view",
            ],
            limitations: ["not reassuring"],
            summary: "Ungradable",
          }
        : T
          ? {
              ...k,
              priority: F.referSoon,
              actionKey: "referSoon",
              reasons: [`${tt(t.distanceVA)} VA without disc signs`],
              summary: "Review VA",
            }
          : r.cupDisc03 && E && t.distanceVA
            ? {
                ...k,
                priority: F.routineScreen,
                actionKey: "routineScreen",
                reasons: nt(g),
                summary: "Cup context only",
              }
            : E && r.noReferableSignsSeen && t.distanceVA
              ? {
                  ...k,
                  priority: F.routineScreen,
                  actionKey: "routineScreen",
                  reasons: ["No disc signs in view"],
                  summary: "No referable signs",
                }
              : N
                ? {
                    ...k,
                    reasons: [
                      t.distanceVA
                        ? "Select no signs or disc findings"
                        : "VA not recorded",
                    ],
                    summary: "Incomplete",
                  }
                : k;
  }
  function jn(e, t) {
    return e.priority !== t.priority
      ? t.priority - e.priority
      : e.eyeKey === "right"
        ? -1
        : t.eyeKey === "right"
          ? 1
          : 0;
  }
  function Xn(e) {
    let t = [];
    return (
      e.mode === "holo-bio" &&
        e.dilation !== "yes" &&
        t.push(
          e.dilation
            ? "Holo view not dilated."
            : "Dilation not recorded for Holo view.",
        ),
      t
    );
  }
  function Qn(e) {
    return e.length <= 1
      ? e[0] || ""
      : `${e.slice(0, -1).join(", ")} and ${e[e.length - 1]}`;
  }
  function Kn(e) {
    let t = [],
      n = [];
    return (
      Object.entries(e.systemicChecks).forEach(([a, r]) => {
        let d =
          a === "hba1c" ? "high myopia" : a === "bp" ? "IOP" : "family history";
        r ? t.push(d) : n.push(d);
      }),
      { checked: t, unchecked: n }
    );
  }
  function ra(e) {
    let t = ["Check symptoms, pupils, fields and local pathway."];
    return (
      e.unchecked.length > 0 && t.push(`Add context: ${Qn(e.unchecked)}.`),
      t
    );
  }
  function Qt(e) {
    let t = Object.entries(e.eyes).map(([v, b]) => Un(v, b, e)),
      n = [...t].sort(jn),
      a = n[0],
      r = xt[a.actionKey],
      d = a.priority === F.incomplete ? [] : Xn(e),
      p = Kn(e),
      h = t.filter((v) => v.actionKey === "incomplete"),
      A = t.filter((v) => v.viewLimited),
      g = [],
      w = [];
    if (
      (Object.entries(e.eyes).forEach(([v, b]) => {
        (b.findings.discDrusen &&
          w.push(`${vt[v]}: if symptomatic or uncertain, manage as swelling.`),
          b.findings.visibleLaminaCribrosa &&
            w.push(`${vt[v]}: interpret lamina with rim loss and fields.`));
      }),
      a.priority === F.incomplete)
    )
      g.push("R/L recording incomplete.");
    else if (a.priority === F.routineScreen)
      if (t.every((b) => b.actionKey === "routineScreen"))
        t.filter((T) => T.reasons.some((L) => L !== "No disc signs in view"))
          .length > 0
          ? t.forEach((T) => {
              let L = T.reasons.some((M) => M !== "No disc signs in view")
                ? T.reasons.join(", ")
                : "no referable disc signs";
              g.push(`${T.eyeLabel}: ${L}.`);
            })
          : g.push(
              "Both eyes have adequate views and no referable signs selected.",
            );
      else {
        if (t.find((L) => L.viewLimited)) return Jn(e, t, d, p);
        if (t.find((L) => L.actionKey === "incomplete")) return Zn(t, d, p);
      }
    else
      n.filter(
        (b) => b.priority === a.priority && b.priority > F.incomplete,
      ).forEach((b) => {
        g.push(
          `${b.eyeLabel}: ${b.reasons.join(", ") || xt[b.actionKey].title}.`,
        );
      });
    return (
      A.forEach((v) => {
        w.push(`${v.eyeLabel}: limited view.`);
      }),
      h
        .filter((v) => a.priority > F.incomplete)
        .forEach((v) => w.push(`${v.eyeLabel}: incomplete.`)),
      d.forEach((v) => w.push(v)),
      {
        actionKey: a.actionKey,
        priority: a.priority,
        title: r.title,
        tone: r.tone,
        reasons: g,
        limitations: w,
        next: r.next,
        safety: ra(p),
        systemic: p,
        eyes: t,
      }
    );
  }
  function Jn(e, t, n, a) {
    let r = xt.ungradable,
      d = [];
    return (
      t
        .filter((p) => p.viewLimited)
        .forEach((p) =>
          d.push(`${p.eyeLabel}: ${p.reasons.join(", ") || "not assessable"}.`),
        ),
      n.forEach((p) => d.push(p)),
      {
        actionKey: "ungradable",
        priority: F.ungradable,
        title: r.title,
        tone: r.tone,
        reasons: ["One eye not assessable."],
        limitations: d,
        next: r.next,
        safety: [
          "Repeat dilated view/photo if possible.",
          "Disc assessment still needs clinical context.",
        ],
        systemic: a,
        eyes: t,
      }
    );
  }
  function Zn(e, t, n) {
    let a = xt.incomplete,
      r = [];
    return (
      e
        .filter((d) => d.actionKey === "incomplete")
        .forEach((d) => r.push(`${d.eyeLabel}: incomplete.`)),
      t.forEach((d) => r.push(d)),
      {
        actionKey: "incomplete",
        priority: F.incomplete,
        title: a.title,
        tone: a.tone,
        reasons: ["R/L recording incomplete."],
        limitations: r,
        next: a.next,
        safety: ra(n),
        systemic: n,
        eyes: e,
      }
    );
  }
  function es(e) {
    let t = Ct(e.findings);
    return t.length > 0 ? t.join(", ") : "not recorded";
  }
  function ts(e) {
    let t = { bp: "IOP", lipids: "family history", hba1c: "high myopia" },
      n = Ri.filter((a) => e.systemicChecks[a.key]).map(
        (a) => t[a.key] || a.label.replace(/\s+checked$/i, ""),
      );
    return n.length > 0 ? n.join(", ") : "none recorded";
  }
  function oa(e, t, n) {
    let a = [
        `VA ${tt(t.distanceVA)}`,
        `view ${t.viewQuality || "not recorded"}`,
        `findings: ${es(t)}`,
      ],
      r = $i(n, t.areaSeen);
    return (
      r !== "Not recorded" && a.splice(2, 0, r),
      `${e}: ${a.join("; ")}.`
    );
  }
  function la(e, t) {
    let n = [];
    (n.push(`Optic disc triage: ${t.title}.`),
      n.push(`Mode: ${Di[e.mode]}. Dilated: ${e.dilation || "not recorded"}.`),
      n.push(oa("RE", e.eyes.right, e.mode)),
      n.push(oa("LE", e.eyes.left, e.mode)));
    let a = [...t.reasons, ...t.limitations];
    return (
      a.length > 0 && n.push(`Reason: ${a.join(" ")}`),
      n.push(`Plan: ${t.next}`),
      n.push(`Context: ${ts(e)}.`),
      n.push("Compare with symptoms, pupils, fields and local pathway."),
      n.join(`
`)
    );
  }
  var is = Z.length,
    ca = Z.map((e, t) => ({
      id: e.id,
      level: t === 0 ? "primary" : t < 4 ? "intermediate" : "advanced",
      title: `Case ${t + 1}`,
      imageLabel: `${t + 1}/${is}`,
      imageSrc: e.thumbSrc || e.src,
      prompt: e.summary,
      answer: e.description || [],
    }));
  var Kt = {
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
        targetBankSize: 24,
      },
      advanced: {
        title: "Advanced",
        passMark: 6,
        questionCount: 8,
        targetBankSize: 24,
      },
    },
    as = {
      primary: [
        {
          question: "What does no referable disc signs mean?",
          options: [
            "No signs seen in the view obtained",
            "No optic nerve disease ever",
            "No need to check pupils",
            "No need to ask symptoms",
          ],
          answer: 0,
          topic: "safety-copy",
        },
        {
          question: "Which finding can mimic papilloedema?",
          options: ["Disc drusen", "Large disc", "Clear rim", "Normal cup"],
          answer: 0,
          topic: "drusen",
        },
        {
          question: "Which sign should raise concern for glaucoma?",
          options: [
            "Thin rim",
            "Clear disc margin",
            "Normal vessels",
            "Symmetric small cups",
          ],
          answer: 0,
          topic: "glaucoma",
        },
        {
          question: "What does a swollen disc need?",
          options: [
            "Urgent clinical review if true or uncertain",
            "Routine discharge",
            "Spectacle change only",
            "Ignore if painless",
          ],
          answer: 0,
          topic: "urgent",
        },
        {
          question: "What is the neuroretinal rim?",
          options: [
            "The neural tissue between the cup and disc margin",
            "The edge of the crystalline lens",
            "The macular reflex",
            "The visible sclera outside the disc",
          ],
          answer: 0,
          topic: "rim-anatomy",
        },
        {
          question: "Why does disc size matter?",
          options: [
            "Large discs can have larger physiological cups",
            "It confirms glaucoma by itself",
            "Small discs are always normal",
            "It replaces field testing",
          ],
          answer: 0,
          topic: "disc-size",
        },
        {
          question: "Which finding is a glaucoma clue?",
          options: [
            "Splinter haemorrhage",
            "Clear macula",
            "Equal red reflex",
            "Normal cornea",
          ],
          answer: 0,
          topic: "glaucoma",
        },
        {
          question: "What context should be recorded where possible?",
          options: [
            "IOP, family history and high myopia",
            "Hair colour",
            "Shoe size",
            "Dominant hand",
          ],
          answer: 0,
          topic: "context",
        },
        {
          question: "What does optic-disc pallor describe?",
          options: [
            "Reduced normal pink colour of the neuroretinal tissue",
            "A larger physiological cup only",
            "A cloudy crystalline lens",
            "A redder macular reflex",
          ],
          answer: 0,
          topic: "pallor",
        },
        {
          question: "What does an ungradable disc view mean?",
          options: [
            "Cannot assess safely",
            "Normal disc",
            "No referral possible",
            "Glaucoma excluded",
          ],
          answer: 0,
          topic: "view-quality",
        },
        {
          question: "Why should the two optic discs be compared?",
          options: [
            "Asymmetry or a unilateral acquired change can add useful context",
            "The right disc is always larger",
            "Only the better-seeing eye matters",
            "Comparison establishes a diagnosis by itself",
          ],
          answer: 0,
          topic: "comparison",
        },
        {
          question:
            "Which symptom context increases concern with disc swelling?",
          options: [
            "Headache or acute visual loss",
            "Hair colour",
            "Old spectacles only",
            "A stable refractive error",
          ],
          answer: 0,
          topic: "urgent",
        },
        {
          question:
            "Which disc-swelling feature can make vessels harder to follow at the margin?",
          options: [
            "Oedematous tissue obscuring vessel segments",
            "A clear physiological cup",
            "A transparent lens",
            "A sharp flat rim",
          ],
          answer: 0,
          topic: "papilloedema-sign",
        },
        {
          question:
            "Why should right-eye and left-eye findings be recorded separately?",
          options: [
            "Disc appearance and acquired abnormalities can differ between eyes",
            "Eye identity only changes the screen colour",
            "The right eye is always at higher risk",
            "A single eye label proves symmetry",
          ],
          answer: 0,
          topic: "comparison",
        },
        {
          question: "Which sign belongs to general disc signs?",
          options: [
            "Myelinated nerve fibre layer",
            "Anti-VEGF plan",
            "Laser scar count",
            "Specular reflex",
          ],
          answer: 0,
          topic: "general-discs",
        },
        {
          question:
            "Which finding suggests a congenital or anatomical variant?",
          options: [
            "Tilted disc",
            "Confirmed glaucoma",
            "Lens opacity",
            "Macula oedema",
          ],
          answer: 0,
          topic: "disc-variant",
        },
      ],
      intermediate: [
        {
          question: "C/D 0.6 in a small disc is:",
          options: [
            "More suspicious than in a large disc",
            "Always normal",
            "Always end-stage",
            "Not a disc finding",
          ],
          answer: 0,
          topic: "cup-disc",
        },
        {
          question: "Disc pallor may suggest:",
          options: [
            "Optic nerve damage",
            "Confirmed cataract",
            "Normal ageing only",
            "No need for VA",
          ],
          answer: 0,
          topic: "pallor",
        },
        {
          question: "A rim notch is important because it suggests:",
          options: [
            "Focal neuroretinal rim loss",
            "Lens opacity",
            "Macula oedema",
            "Retinal detachment",
          ],
          answer: 0,
          topic: "glaucoma",
        },
        {
          question:
            "Which examination assesses whether the anterior chamber angle is open or closed?",
          options: [
            "Gonioscopy",
            "Cup/disc ratio alone",
            "Amsler testing",
            "Colour-vision naming",
          ],
          answer: 0,
          topic: "gonioscopy",
        },
        {
          question: "Which combination should push urgency?",
          options: [
            "Swollen disc and abnormal pupil",
            "Large disc and normal rim",
            "C/D 0.3 alone",
            "Clear view alone",
          ],
          answer: 0,
          topic: "urgent",
        },
        {
          question:
            "Which observation is strongest evidence of structural progression?",
          options: [
            "New focal rim or retinal nerve fibre layer loss on comparable serial assessment",
            "One isolated cup ratio without a baseline",
            "A different camera exposure",
            "A clearer crystalline lens",
          ],
          answer: 0,
          topic: "serial-change",
        },
        {
          question: "Peripapillary atrophy is often linked with:",
          options: [
            "Myopia or disc margin change",
            "Confirmed papilloedema",
            "Acute glaucoma only",
            "Lens opacity",
          ],
          answer: 0,
          topic: "ppa",
        },
        {
          question: "A disc splinter haemorrhage may indicate:",
          options: [
            "A clue associated with glaucomatous damage or progression",
            "A normal vessel crossing",
            "Dense cataract",
            "No need for review",
          ],
          answer: 0,
          topic: "glaucoma",
        },
        {
          question: "When both eyes differ, action should use:",
          options: [
            "The highest-risk eye finding",
            "The better eye only",
            "The first eye seen",
            "VA alone",
          ],
          answer: 0,
          topic: "priority",
        },
        {
          question:
            "Which conclusion should be avoided from an isolated disc photograph?",
          options: [
            "A definitive glaucoma diagnosis without the wider assessment",
            "A description of rim appearance",
            "A record of view quality",
            "Comparison with the fellow eye",
          ],
          answer: 0,
          topic: "scope",
        },
        {
          question: "Why can a tilted disc complicate cup/disc assessment?",
          options: [
            "Oblique insertion can distort the apparent disc margin and cup shape",
            "Tilt confirms glaucoma",
            "Tilt removes all neuroretinal rim tissue",
            "Tilt makes fields unnecessary",
          ],
          answer: 0,
          topic: "disc-variant",
        },
        {
          question:
            "Which feature favours physiological rather than glaucomatous cupping?",
          options: [
            "A continuous rim without focal notch or RNFL defect",
            "A focal inferior rim notch",
            "A matching wedge RNFL defect",
            "Progressive disc haemorrhage",
          ],
          answer: 0,
          topic: "normal-cups",
        },
        {
          question: "Bayoneting should not be overcalled in:",
          options: [
            "Early simple vessel bending",
            "Advanced cupping",
            "Near-total rim loss",
            "Severe nasalisation",
          ],
          answer: 0,
          topic: "glaucoma",
        },
        {
          question:
            "Which approach is most useful when buried optic-disc drusen and true oedema are difficult to distinguish?",
          options: [
            "Multimodal imaging interpreted with the clinical findings",
            "Cup/disc ratio alone",
            "Visual acuity alone",
            "Lens photography alone",
          ],
          answer: 0,
          topic: "drusen-imaging",
        },
        {
          question:
            "Which associated finding makes optic-disc pallor more concerning?",
          options: [
            "A relative afferent pupillary defect",
            "A healthy continuous rim",
            "A clear media view",
            "Symmetric physiological cupping",
          ],
          answer: 0,
          topic: "pallor",
        },
        {
          question: "What remains true after a wide-field fundus view?",
          options: [
            "Only structures adequately seen can be described or excluded",
            "A wide view confirms no optic-nerve disease",
            "It replaces formal visual fields",
            "It removes the need to assess view quality",
          ],
          answer: 0,
          topic: "viewing",
        },
        {
          question:
            "Why is stereoscopic assessment useful when disc elevation is suspected?",
          options: [
            "It helps assess three-dimensional contour and true elevation",
            "It measures intraocular pressure directly",
            "It proves the cause of swelling",
            "It replaces symptom history",
          ],
          answer: 0,
          topic: "viewing",
        },
        {
          question:
            "If a disc looks swollen but drusen is possible, the safe action is:",
          options: [
            "Treat uncertainty as swelling",
            "Ignore symptoms",
            "Discharge",
            "Record no signs",
          ],
          answer: 0,
          topic: "drusen",
        },
        {
          question:
            "Why is central corneal thickness recorded in a glaucoma assessment?",
          options: [
            "It helps interpret applanation IOP and overall risk",
            "It measures the cup directly",
            "It confirms papilloedema",
            "It replaces gonioscopy",
          ],
          answer: 0,
          topic: "cct",
        },
        {
          question: "Which sign suggests nerve fibre layer loss?",
          options: [
            "Wedge-shaped RNFL defect",
            "Clear lens",
            "Equal red reflex",
            "Normal cornea",
          ],
          answer: 0,
          topic: "rnfl",
        },
        {
          question:
            "Which case should not be called glaucoma just because it is tilted?",
          options: [
            "Tilted normal disc",
            "End-stage cupping",
            "Rim notch with haemorrhage",
            "C/D 0.9 with little rim",
          ],
          answer: 0,
          topic: "disc-variant",
        },
        {
          question: "What does a disc haemorrhage near a notch suggest?",
          options: [
            "Possible active glaucoma progression",
            "Normal vessel crossing",
            "Dense cataract",
            "No follow-up",
          ],
          answer: 0,
          topic: "glaucoma",
        },
        {
          question: "Why are dated comparable disc images useful?",
          options: [
            "They can support detection of structural change over time",
            "They replace formal visual fields",
            "They prove the diagnosis from one visit",
            "They remove the need to record image quality",
          ],
          answer: 0,
          topic: "serial-change",
        },
        {
          question:
            "Which finding belongs in fast glaucoma review rather than general normal variation?",
          options: [
            "Severe cupping with little rim",
            "Healthy C/D 0.3",
            "Symmetric small cups",
            "Clear disc margin",
          ],
          answer: 0,
          topic: "glaucoma",
        },
      ],
      advanced: [
        {
          question: "C/D 0.9 with little rim should usually be treated as:",
          options: [
            "High-risk severe cupping",
            "Normal if painless",
            "Disc drusen",
            "A cataract sign",
          ],
          answer: 0,
          topic: "cup-disc",
        },
        {
          question:
            "Which factor can make a cup/disc estimate less dependable from a single two-dimensional image?",
          options: [
            "An obliquely inserted or tilted disc with an uncertain margin",
            "A clearly focused stereoscopic view",
            "A documented disc size",
            "A comparable baseline image",
          ],
          answer: 0,
          topic: "disc-variant",
        },
        {
          question:
            "Which imaging finding is most characteristic of superficial optic-disc drusen?",
          options: [
            "Autofluorescent deposits at the optic nerve head",
            "A clear crystalline lens",
            "Macular hard drusen only",
            "A flat physiological cup",
          ],
          answer: 0,
          topic: "drusen-imaging",
        },
        {
          question:
            "Which finding should not be dismissed because the fellow eye looks normal?",
          options: [
            "Swollen disc",
            "A clear media view",
            "A small symmetric cup",
            "A sharp disc margin",
          ],
          answer: 0,
          topic: "priority",
        },
        {
          question: "Why record VA with disc findings?",
          options: [
            "Reduced VA can increase concern",
            "It confirms disc drusen",
            "It replaces pupil testing",
            "It proves IOP",
          ],
          answer: 0,
          topic: "va",
        },
        {
          question: "Which sign supports advanced cupping?",
          options: [
            "Vessel bayoneting",
            "Normal vessel entry",
            "Clear red reflex",
            "No symptoms",
          ],
          answer: 0,
          topic: "glaucoma",
        },
        {
          question:
            "Swollen disc with headache, acute visual loss or abnormal pupils should trigger:",
          options: [
            "Urgent review",
            "Annual review only",
            "No action",
            "Spectacles only",
          ],
          answer: 0,
          topic: "urgent",
        },
        {
          question:
            "Why should optic-disc contour be assessed stereoscopically where possible?",
          options: [
            "Depth information helps distinguish excavation from elevation",
            "It directly measures visual-field sensitivity",
            "It removes the need for dilation",
            "It confirms the diagnosis without other tests",
          ],
          answer: 0,
          topic: "viewing",
        },
        {
          question: "A C/D 0.6 plus thin rim and field symptoms should be:",
          options: [
            "Referred soon or urgently depending context",
            "Ignored",
            "Called normal",
            "Recorded as cataract",
          ],
          answer: 0,
          topic: "glaucoma",
        },
        {
          question:
            "Why does gonioscopy matter before classifying glaucoma management?",
          options: [
            "Angle configuration separates open-angle from angle-closure mechanisms",
            "It measures the neuroretinal rim",
            "It identifies optic-disc drusen",
            "It replaces IOP and field assessment",
          ],
          answer: 0,
          topic: "gonioscopy",
        },
        {
          question:
            "Which combination supports asymmetric glaucomatous damage?",
          options: [
            "A focal notch with a corresponding nerve fibre layer defect",
            "Symmetric small cups",
            "Clear media only",
            "Normal vessel entry alone",
          ],
          answer: 0,
          topic: "glaucoma",
        },
        {
          question:
            "Which combination is compatible with advanced glaucomatous damage?",
          options: [
            "Deep cupping with marked rim and nerve fibre layer loss",
            "A tiny cup with a broad healthy rim",
            "A clear lens without disc change",
            "Disc swelling alone",
          ],
          answer: 0,
          topic: "glaucoma",
        },
        {
          question:
            "Which finding is most concerning in very advanced cupping?",
          options: [
            "Near-total excavation with little residual rim and vessel bayoneting",
            "A broad continuous rim",
            "No lamina visibility",
            "Lens opacity alone",
          ],
          answer: 0,
          topic: "glaucoma",
        },
        {
          question: "End-stage cupping means:",
          options: [
            "Near-total excavation with minimal rim",
            "Normal baseline cup",
            "Disc drusen only",
            "Mild physiological cupping",
          ],
          answer: 0,
          topic: "glaucoma-sequence",
        },
        {
          question:
            "Which paired findings strengthen concern for focal glaucomatous damage?",
          options: [
            "A splinter haemorrhage with a local rim notch",
            "A clear rim with normal fields",
            "Lens opacity with a large disc",
            "A healthy rim with symmetric cups",
          ],
          answer: 0,
          topic: "glaucoma",
        },
        {
          question:
            "Baring of circumlinear vessels means vessels look exposed because:",
          options: [
            "Rim beneath has been lost",
            "The lens is cloudy",
            "The macula is swollen",
            "Dilation is off",
          ],
          answer: 0,
          topic: "glaucoma",
        },
        {
          question:
            "Which change is compatible with moderate or more advanced glaucomatous damage?",
          options: [
            "An asymmetric cup with a focal rim notch",
            "A broad continuous rim",
            "A stable symmetric small cup",
            "No structural disc change",
          ],
          answer: 0,
          topic: "glaucoma",
        },
        {
          question: "What does loss of the ISNT pattern describe?",
          options: [
            "Rim thickness no longer follows the usual inferior-superior-nasal-temporal order",
            "A detached retina",
            "A definitively normal disc",
            "A diagnosed cataract",
          ],
          answer: 0,
          topic: "glaucoma",
        },
        {
          question:
            "Which longitudinal finding carries more weight than a single cup/disc ratio?",
          options: [
            "Reproducible progressive rim or retinal nerve fibre layer loss",
            "A different flash exposure",
            "A new file name",
            "A one-off larger image scale",
          ],
          answer: 0,
          topic: "serial-change",
        },
        {
          question:
            "Which principle helps avoid over-referral for physiological cupping?",
          options: [
            "Interpret cup size with disc size, rim integrity, symmetry and other findings",
            "Refer every large cup urgently",
            "Use cup size as a diagnosis",
            "Ignore visual fields",
          ],
          answer: 0,
          topic: "normal-cups",
        },
        {
          question:
            "What should happen if one eye is ungradable and the other has high-risk cupping?",
          options: [
            "High-risk eye drives action, fellow eye is a limitation",
            "Ungradable eye cancels the finding",
            "Call both normal",
            "Use the better eye only",
          ],
          answer: 0,
          topic: "priority",
        },
        {
          question:
            "What should happen before two images are used to judge progression?",
          options: [
            "Confirm that view, focus, scale and disc orientation are sufficiently comparable",
            "Assume every apparent difference is biological change",
            "Ignore image quality if the cup is visible",
            "Compare only the file dates",
          ],
          answer: 0,
          topic: "serial-change",
        },
        {
          question:
            "Which wider assessment best complements a suspicious glaucoma-pattern disc?",
          options: [
            "IOP, gonioscopy, central corneal thickness and visual-field testing",
            "Lens colour and near add only",
            "Amsler testing alone",
            "One repeat cup estimate without context",
          ],
          answer: 0,
          topic: "context",
        },
        {
          question:
            "Which examination detail helps the receiving clinician interpret the disc view?",
          options: [
            "Whether the pupils were dilated",
            "Unrelated laser settings",
            "An invented OCT thickness",
            "A treatment dose not prescribed",
          ],
          answer: 0,
          topic: "referral-note",
        },
      ],
    },
    Ys = Object.freeze({
      "NICE-NG81": Object.freeze({
        title: "NICE NG81: Glaucoma diagnosis and management",
        url: "https://www.nice.org.uk/guidance/ng81/chapter/Recommendations",
      }),
      "EGS-5": Object.freeze({
        title:
          "European Glaucoma Society Terminology and Guidelines, fifth edition",
        url: "https://bjo.bmj.com/content/105/Suppl_1/1",
      }),
      "ODD-IMAGING-2021": Object.freeze({
        title:
          "Updates on imaging features of optic disc drusen, papilloedema and optic disc oedema",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7813448/",
      }),
      "IIH-CONSENSUS-2018": Object.freeze({
        title:
          "Idiopathic intracranial hypertension: consensus guidelines on management",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6166610/",
      }),
    }),
    ns = "Independent clinical sign-off pending",
    ss = Object.freeze({
      "safety-copy":
        "Describe only what was seen and the quality of the view; absence of a recorded sign does not exclude optic-nerve disease.",
      drusen:
        "Optic-disc drusen can mimic true swelling, so uncertainty requires clinical correlation and appropriate imaging rather than reassurance from appearance alone.",
      glaucoma:
        "Glaucomatous concern is strengthened by characteristic rim, retinal nerve fibre layer, vessel and visual-field findings rather than cup size alone.",
      urgent:
        "True or uncertain disc swelling can represent sight-threatening or neurological disease and should be assessed promptly in its clinical context.",
      "cup-disc":
        "Cup-to-disc ratio must be interpreted with disc size, rim integrity, symmetry and other structural and functional findings.",
      "disc-size":
        "Large discs may have larger physiological cups while the same ratio in a small disc can be more suspicious.",
      context:
        "Disc interpretation is safer when combined with intraocular pressure, visual fields, family history, refractive context and comparison over time.",
      "view-quality":
        "An inadequate view is a limitation, not a normal result; obtain an adequate assessment or refer according to the clinical context.",
      viewing:
        "A wider view still supports only structures that were adequately visualised and does not replace the wider glaucoma assessment.",
      scope:
        "Optic-disc appearance supports assessment but cannot establish a definitive diagnosis or treatment plan in isolation.",
      "general-discs":
        "Congenital and anatomical disc appearances should be described and distinguished from acquired optic-nerve disease.",
      "disc-variant":
        "Tilt and other anatomical variants can alter apparent disc shape, so diagnosis should not rest on appearance alone.",
      "normal-cups":
        "Physiological cupping is judged from the whole disc and rim pattern, not a single cup ratio.",
      pallor:
        "Disc pallor with reduced visual function or an afferent pupil defect raises concern for optic neuropathy and needs clinical correlation.",
      priority:
        "The highest-risk finding drives action while limitations in the fellow eye remain explicitly recorded.",
      ppa: "Peripapillary atrophy can accompany myopia and disc-margin change but is not diagnostic by itself.",
      rnfl: "A wedge-shaped retinal nerve fibre layer defect is a structural clue that should be correlated with rim and field findings.",
      va: "Visual acuity helps describe optic-nerve function and can increase concern when reduced, but it does not identify the cause alone.",
      "referral-note":
        "Recording examination conditions such as dilation and view quality helps the receiving clinician interpret the observation.",
      "glaucoma-sequence":
        "Increasing rim and nerve fibre loss, excavation and vessel change are compatible with more advanced glaucomatous damage.",
      "rim-anatomy":
        "The neuroretinal rim is the remaining neural tissue between the optic cup and the disc margin; its integrity matters more than a cup number alone.",
      comparison:
        "Comparing separately recorded eyes can reveal asymmetry or unilateral acquired change, but interpretation still needs the wider assessment.",
      "papilloedema-sign":
        "True disc oedema can blur the margin and obscure vessel segments as they cross swollen tissue.",
      gonioscopy:
        "Gonioscopy identifies anterior chamber angle configuration and is part of the wider glaucoma assessment.",
      "serial-change":
        "Progression requires comparable observations; repeatable rim or retinal nerve fibre layer change is more meaningful than image or scale variation.",
      "drusen-imaging":
        "Buried optic-disc drusen and true oedema may overlap in appearance, so multimodal imaging and clinical correlation are safer than inspection alone.",
      cct: "Central corneal thickness contributes to interpretation of applanation intraocular pressure and glaucoma risk.",
    }),
    rs = Object.freeze({
      drusen: ["ODD-IMAGING-2021", "IIH-CONSENSUS-2018"],
      urgent: ["IIH-CONSENSUS-2018"],
      "view-quality": ["NICE-NG81", "IIH-CONSENSUS-2018"],
      pallor: ["IIH-CONSENSUS-2018"],
      scope: ["NICE-NG81"],
      viewing: ["NICE-NG81", "IIH-CONSENSUS-2018"],
      "papilloedema-sign": ["IIH-CONSENSUS-2018"],
      gonioscopy: ["NICE-NG81", "EGS-5"],
      "serial-change": ["NICE-NG81", "EGS-5"],
      "drusen-imaging": ["ODD-IMAGING-2021", "IIH-CONSENSUS-2018"],
      cct: ["NICE-NG81", "EGS-5"],
    }),
    Jt = Object.freeze(
      Object.fromEntries(
        Object.entries(as).map(([e, t]) => [
          e,
          Object.freeze(
            t.map((n, a) =>
              Object.freeze({
                ...n,
                id: `discs-${e}-${String(a + 1).padStart(2, "0")}`,
                explanation:
                  ss[n.topic] ||
                  "Use the best-supported observation and interpret it with the wider clinical assessment.",
                sourceIds: Object.freeze(rs[n.topic] || ["NICE-NG81", "EGS-5"]),
                reviewStatus: ns,
              }),
            ),
          ),
        ]),
      ),
    );
  var Zt = new Set(),
    Ye = new WeakMap(),
    da = new WeakMap();
  function os(e) {
    return [
      ...e.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ].filter((t) => !t.hidden && t.getAttribute("aria-hidden") !== "true");
  }
  function ua() {
    var t;
    let e = Zt.size > 0;
    (document.documentElement.classList.toggle("is-scroll-locked", e),
      (t = document.body) == null || t.classList.toggle("is-scroll-locked", e));
  }
  function st(e) {
    (Zt.add(e), ua());
  }
  function Oe(e) {
    (Zt.delete(e), ua());
  }
  function pa({ menuButton: e, closeButton: t, drawer: n, overlay: a }) {
    function r() {
      (Ye.set(n, document.activeElement),
        (a.hidden = !1),
        n.classList.add("is-open"),
        a.classList.add("is-visible"),
        (n.inert = !1),
        n.removeAttribute("inert"),
        n.setAttribute("aria-hidden", "false"),
        e.setAttribute("aria-expanded", "true"),
        st("drawer"),
        t.focus());
    }
    function d() {
      var p, h;
      n.classList.contains("is-open") &&
        (n.classList.remove("is-open"),
        a.classList.remove("is-visible"),
        (a.hidden = !0),
        (n.inert = !0),
        n.setAttribute("inert", ""),
        n.setAttribute("aria-hidden", "true"),
        e.setAttribute("aria-expanded", "false"),
        Oe("drawer"),
        (h = (p = Ye.get(n)) == null ? void 0 : p.focus) == null || h.call(p));
    }
    return (
      e.addEventListener("click", r),
      t.addEventListener("click", d),
      a.addEventListener("click", d),
      document.addEventListener("keydown", (p) => {
        p.key === "Escape" && d();
      }),
      { open: r, close: d }
    );
  }
  function ma({ button: e, popup: t, closeButton: n }) {
    function a() {
      (Ye.set(t, document.activeElement),
        (t.hidden = !1),
        t.setAttribute("aria-hidden", "false"),
        e.setAttribute("aria-expanded", "true"),
        st("info-popup"),
        t.focus());
    }
    function r() {
      var d, p;
      t.hidden ||
        ((t.hidden = !0),
        t.setAttribute("aria-hidden", "true"),
        e.setAttribute("aria-expanded", "false"),
        Oe("info-popup"),
        (p = (d = Ye.get(t)) == null ? void 0 : d.focus) == null || p.call(d));
    }
    return (
      e.addEventListener("click", () => {
        t.hidden ? a() : r();
      }),
      n.addEventListener("click", r),
      document.addEventListener("pointerdown", (d) => {
        !t.hidden && !t.contains(d.target) && d.target !== e && r();
      }),
      document.addEventListener("keydown", (d) => {
        d.key === "Escape" && r();
      }),
      { open: a, close: r }
    );
  }
  function ha({ tabs: e, panels: t = [], onChange: n }) {
    let a = [...e],
      r = [...t];
    function d(h) {
      let A = h.dataset.tabTarget;
      (a.forEach((g) => {
        let w = g === h;
        (g.classList.toggle("active", w),
          g.setAttribute("aria-selected", String(w)),
          (g.tabIndex = w ? 0 : -1));
      }),
        r.forEach((g) => {
          let w = g.id === A;
          (g.classList.toggle("active", w), (g.hidden = !w));
        }),
        n == null || n(h.dataset.mode));
    }
    function p(h) {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(h.key)) return;
      h.preventDefault();
      let g = a.indexOf(h.currentTarget),
        w = g;
      (h.key === "ArrowRight"
        ? (w = (g + 1) % a.length)
        : h.key === "ArrowLeft"
          ? (w = (g - 1 + a.length) % a.length)
          : h.key === "Home"
            ? (w = 0)
            : h.key === "End" && (w = a.length - 1),
        a[w].focus(),
        d(a[w]));
    }
    a.forEach((h) => {
      (h.addEventListener("click", () => d(h)),
        h.addEventListener("keydown", p));
    });
  }
  function Ge(e, t) {
    (Ye.set(e, document.activeElement),
      (e.hidden = !1),
      e.setAttribute("aria-hidden", "false"),
      st(e.id || "modal"),
      t == null || t.focus());
    let n = (a) => {
      if (a.key !== "Tab") return;
      let r = os(t || e);
      if (!r.length) {
        (a.preventDefault(), t == null || t.focus());
        return;
      }
      let d = r[0],
        p = r[r.length - 1];
      a.shiftKey && document.activeElement === d
        ? (a.preventDefault(), p.focus())
        : !a.shiftKey &&
          document.activeElement === p &&
          (a.preventDefault(), d.focus());
    };
    (da.set(e, n), e.addEventListener("keydown", n));
  }
  function Ce(e) {
    var n, a;
    if (e.hidden) return;
    ((e.hidden = !0),
      e.setAttribute("aria-hidden", "true"),
      Oe(e.id || "modal"));
    let t = da.get(e);
    (t && e.removeEventListener("keydown", t),
      (a = (n = Ye.get(e)) == null ? void 0 : n.focus) == null || a.call(n));
  }
  function ga(e) {
    let t = [...e];
    for (let n = t.length - 1; n > 0; n -= 1) {
      let a = Math.floor(Math.random() * (n + 1));
      [t[n], t[a]] = [t[a], t[n]];
    }
    return t;
  }
  function ls(e) {
    let t = e.options.map((a, r) => ({ label: a, originalIndex: r })),
      n = ga(t);
    return {
      ...e,
      options: n,
      answer: n.findIndex((a) => a.originalIndex === e.answer),
    };
  }
  function ge(e, t, n) {
    let a = document.createElement(e);
    return (t && (a.className = t), n && (a.textContent = n), a);
  }
  function fa() {
    return Object.entries(Kt).map(([e, t]) => {
      let n = Jt[e] || [],
        a = n.filter(
          (d) =>
            !Array.isArray(d.options) ||
            d.answer < 0 ||
            d.answer >= d.options.length,
        ),
        r = n.filter(
          (d) =>
            !d.id ||
            !d.explanation ||
            !Array.isArray(d.sourceIds) ||
            d.sourceIds.length === 0 ||
            !d.reviewStatus,
        );
      return {
        level: e,
        expected: t.targetBankSize,
        actual: n.length,
        invalidAnswers: a.length,
        invalidMetadata: r.length,
      };
    });
  }
  function cs(e, t, n) {
    let a = Array.isArray(t) ? t : [],
      r = e.length > 0 && a.length === e.length && a.every(Number.isInteger),
      d = e.reduce((p, h, A) => p + (a[A] === h.answer ? 1 : 0), 0);
    return {
      isComplete: r,
      score: d,
      passed: r && d >= n,
      missedTopics: e.filter((p, h) => a[h] !== p.answer).map((p) => p.topic),
    };
  }
  function ya(e) {
    let t = [],
      n = null,
      a = null;
    function r() {
      Ce(e.modal);
    }
    function d(w, v) {
      let b = ge("fieldset", "mcq-question");
      b.dataset.questionId = w.id;
      let T = ge("legend", "mcq-question-title", `${v + 1}. ${w.question}`);
      (b.append(T),
        w.options.forEach((M, E) => {
          let N = ge("label", "mcq-option"),
            k = document.createElement("input");
          ((k.type = "radio"), (k.name = `mcq_${w.id}`), (k.value = String(E)));
          let _ = ge("span", "", M.label);
          (N.append(k, _), b.append(N));
        }));
      let L = ge("p", "mcq-question-feedback");
      return ((L.hidden = !0), b.append(L), b);
    }
    function p(w, v = !1) {
      var L;
      let b = Kt[w],
        T = Jt[w];
      !b ||
        !T ||
        ((a = w),
        (n = b),
        (t = ga(T).slice(0, b.questionCount).map(ls)),
        (e.title.textContent = `${b.title} MCQ`),
        (e.intro.textContent = `${b.questionCount} questions. Pass mark ${b.passMark}.`),
        (e.result.textContent = ""),
        (e.result.className = "mcq-result"),
        (e.submit.disabled = !1),
        (e.submit.hidden = !1),
        (e.restart.hidden = !0),
        e.container.replaceChildren(...t.map(d)),
        v && ((L = e.container.querySelector("input")) == null || L.focus()));
    }
    function h(w) {
      (p(w), Ge(e.modal, e.modalContent));
    }
    function A() {
      var L;
      if (!n) return;
      let w = t.map((M) => {
          let E = e.container.querySelector(
            `input[name="mcq_${M.id}"]:checked`,
          );
          return E ? Number(E.value) : null;
        }),
        v = cs(t, w, n.passMark);
      if (!v.isComplete) {
        ((e.result.textContent =
          "Please answer all questions before submitting."),
          (e.result.className = "mcq-result is-review"));
        let M = w.findIndex((E) => !Number.isInteger(E));
        (L = e.container.querySelector(`input[name="mcq_${t[M].id}"]`)) ==
          null || L.focus();
        return;
      }
      t.forEach((M, E) => {
        let N = w[E],
          k = e.container.querySelector(`[data-question-id="${M.id}"]`);
        k.querySelectorAll(`input[name="mcq_${M.id}"]`).forEach((ee) => {
          ee.disabled = !0;
          let de = ee.closest(".mcq-option");
          de.classList.remove("is-correct", "is-wrong");
          let fe = Number(ee.value);
          (fe === M.answer && de.classList.add("is-correct"),
            fe === N && fe !== M.answer && de.classList.add("is-wrong"));
        });
        let l = k.querySelector(".mcq-question-feedback"),
          ce = N === M.answer;
        ((l.hidden = !1),
          l.replaceChildren(
            ge("strong", "", ce ? "Correct. " : "Incorrect. "),
            document.createTextNode(M.explanation),
          ));
      });
      let b = ge(
          "strong",
          "mcq-result-heading",
          v.passed ? "Pass" : "Review and retry",
        ),
        T = ge(
          "span",
          "mcq-result-score",
          `Score ${v.score}/${n.questionCount}.`,
        );
      if ((e.result.replaceChildren(b, T), v.missedTopics.length > 0)) {
        let M = ge(
          "p",
          "mcq-topics",
          `Review: ${[...new Set(v.missedTopics)].join(", ")}.`,
        );
        e.result.append(M);
      }
      (e.result.classList.toggle("is-pass", v.passed),
        e.result.classList.toggle("is-review", !v.passed),
        (e.submit.disabled = !0),
        (e.submit.hidden = !0),
        (e.restart.hidden = !1),
        e.result.focus());
    }
    function g() {
      a && p(a, !0);
    }
    return (
      e.close.addEventListener("click", r),
      e.submit.addEventListener("click", A),
      e.restart.addEventListener("click", g),
      { open: h, close: r, restart: g }
    );
  }
  var D = Ut(),
    oe = Qt(D),
    Q = !1,
    le = !1,
    xe = null,
    He = null,
    ti = "general",
    ei = 0,
    m = (e) => document.querySelector(e),
    Ae = (e) => Array.from(document.querySelectorAll(e)),
    o = {
      canvas: m("#fundusCanvas"),
      fovToggle: m("#fovToggle"),
      fovLabelSmall: m("#fovLabelSmall"),
      fovLabelLeft: m("#fovLabelLeft"),
      fovLabelRight: m("#fovLabelRight"),
      eyeToggle: m("#eyeToggle"),
      eyeLabelRight: m("#eyeLabelRight"),
      eyeLabelLeft: m("#eyeLabelLeft"),
      cataractSlider: m("#cataractSlider"),
      cataractStops: Ae(".cataract-stop"),
      viewerDilationToggle: m("#viewerDilationToggle"),
      gazeMoveToggle: m("#gazeMoveToggle"),
      viewerPigmentationToggle: m("#viewerPigmentationToggle"),
      viewerPigmentationText: m("#viewerPigmentationText"),
      viewerExplanation: m("#viewerExplanation"),
      previousCaseButton: m("#previousCaseButton"),
      nextCaseButton: m("#nextCaseButton"),
      viewerCaseLabel: m("#viewerCaseLabel"),
      viewerCaseShortLabel: m("#viewerCaseShortLabel"),
      viewerCaseSummaryToggle: m("#viewerCaseSummaryToggle"),
      viewerCaseDescription: m("#viewerCaseDescription"),
      viewerCaseDescriptionTitle: m("#viewerCaseDescriptionTitle"),
      viewerCaseDescriptionBody: m("#viewerCaseDescriptionBody"),
      rightDistanceVA: m("#rightDistanceVA"),
      leftDistanceVA: m("#leftDistanceVA"),
      rightViewStatusSelect: m("#rightViewStatusSelect"),
      leftViewStatusSelect: m("#leftViewStatusSelect"),
      findingsContainer: m("#findingsContainer"),
      recordingSystemPanel: m(".recording-system-panel"),
      recordingSystemContent: m("#recordingSystemContent"),
      recordingSystemToggle: m("#recordingSystemToggle"),
      actionPanel: m(".action-panel"),
      actionDetails: m("#actionDetails"),
      actionToggle: m("#actionToggle"),
      actionCard: m("#actionCard"),
      actionTone: m("#actionTone"),
      actionTitle: m("#actionTitle"),
      actionReasons: m("#actionReasons"),
      actionLimitations: m("#actionLimitations"),
      actionNext: m("#actionNext"),
      actionSafety: m("#actionSafety"),
      referralModal: m("#referralModal"),
      referralModalContent: m("#referralModalContent"),
      referralText: m("#referralText"),
      copyStatus: m("#copyStatus"),
      shareReferralButton: m("#shareReferralButton"),
      practiceModal: m("#practiceModal"),
      practiceModalContent: m("#practiceModalContent"),
      practiceCases: m("#practiceCases"),
      caseSetButtons: Ae(".case-set-button"),
      guideModal: m("#guideModal"),
      guideModalContent: m("#guideModalContent"),
      guideTitle: m("#guideTitle"),
      guideContent: m("#guideContent"),
      findingModeTabs: Ae(".finding-mode-tab"),
    };
  function ds() {
    (ta(D),
      (Q = !1),
      (le = !1),
      (xe = null),
      (He = null),
      (o.referralText.value = ""),
      (o.copyStatus.textContent = ""),
      Ae("[data-systemic]").forEach((e) => {
        e.checked = !1;
      }),
      Oe("action-panel"),
      ie());
  }
  var _e = 0,
    ka,
    Ve = ((ka = it[0]) == null ? void 0 : ka.id) || "neurology",
    At = null,
    Ee = !1,
    ba = new Map(),
    us = Z.map((e, t) => t),
    ps = new Map(Z.map((e, t) => [e.id, t]));
  function ai(e) {
    return (D.viewer.pigmentation === "dark" && e.darkSrc) || e.src;
  }
  function Ta(e) {
    return Number.isFinite(e.viewScale) ? e.viewScale : 1;
  }
  function It(e) {
    return it.find((t) => t.id === e) || it[0];
  }
  function ni(e = Ve) {
    let t = It(e),
      n = ((t == null ? void 0 : t.caseIds) || [])
        .map((a) => ps.get(a))
        .filter(Number.isInteger);
    return n.length ? n : us;
  }
  function si() {
    return It(Ve);
  }
  function lt() {
    return ni(Ve);
  }
  function Et() {
    let t = lt().indexOf(_e);
    return t >= 0 ? t : 0;
  }
  function Da(e) {
    return it.find((t) => ni(t.id).includes(e)) || si();
  }
  var qe = Xi({
      state: D,
      canvas: o.canvas,
      fovToggleCheckbox: o.fovToggle,
      fovLabelSmall: o.fovLabelSmall,
      fovLabelLeft: o.fovLabelLeft,
      fovLabelRight: o.fovLabelRight,
      eyeToggleCheckbox: o.eyeToggle,
      eyeLabelRight: o.eyeLabelRight,
      eyeLabelLeft: o.eyeLabelLeft,
      cataractSlider: o.cataractSlider,
      cataractStops: o.cataractStops,
      explanation: o.viewerExplanation,
      conditionButtons: [],
      defaultImageSrc: Qi,
      explanationTemplates: Ki,
      cataractPresets: Ji,
      cataractOcclusionSpots: Zi,
      onDilationChange: (e) => {
        o.viewerDilationToggle.checked = e;
      },
    }),
    wa = {
      cases: {
        label: "Practice cases",
        intro:
          "Use the 20 disc cases for recognition practice, then record the clinical exam below.",
        cues: [
          ["Set", "choose the teaching group"],
          ["Cases", "< / > changes case"],
          ["Skin", "light or dark fundus"],
          ["Eye", "R/L orientation"],
        ],
        detailTitle: "How to use",
        details: [
          [
            "Sets",
            "General shows disc swelling, pallor and variants. Normal cups shows healthy cupping range. Glaucoma shows baseline to end-stage progression.",
          ],
          ["Cases", "Use < and > to move through the selected image set."],
          [
            "Skin",
            "Switches between light and dark pigmentation versions of each case.",
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
          "Choose the viewing method, then make the simulated view match what was obtained.",
        cues: [
          ["DO", "small direct view"],
          ["BIO", "wider lens view"],
          ["Cat", "cataract blur"],
        ],
        detailTitle: "Controls",
        details: [
          [
            "Arclight",
            "Small direct view for disc and posterior pole glimpses.",
          ],
          [
            "Holo",
            "Wider BIO-style lens view. Dilated increases the field when dilation is recorded.",
          ],
          [
            "Gaze",
            "Moves the viewing window. Cataract adds slight, medium or dense blur.",
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
          "Use the finding groups to separate general disc appearances, cup context, glaucoma-pattern signs and urgent swelling.",
        cues: [
          ["General", "swollen, pale, drusen"],
          ["Context", "C/D and disc size"],
          ["Fast", "notch, haem or C/D 0.9"],
        ],
        detailTitle: "Finding groups",
        details: [
          [
            "General discs",
            "Disc swelling, pallor, drusen, anomalous discs, myelination and peripapillary change.",
          ],
          [
            "Cup context",
            "C/D 0.3 and disc size help interpret the disc but should not trigger referral by themselves.",
          ],
          [
            "Glaucoma discs",
            "Thin rim, rim notch, splinter haemorrhage, visible lamina, C/D 0.9 and vessel changes need fast glaucoma review.",
          ],
          [
            "Urgent swelling",
            "True disc swelling, acute visual loss or abnormal pupils should trigger urgent review.",
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
          ["Routine", "local pathway"],
          ["Soon", "disc concern"],
          ["Fast", "glaucoma signs"],
        ],
        detailTitle: "Priority rules",
        details: [
          [
            "Routine",
            "No referable signs, normal cup context or stable disc variants without other concerning features.",
          ],
          [
            "Soon",
            "Disc pallor, suspicious C/D 0.6 or thin rim without immediate red flags.",
          ],
          [
            "Fast glaucoma",
            "C/D 0.9, rim notch, splinter haemorrhage, exposed lamina or bayoneting need rapid glaucoma or eye review.",
          ],
          [
            "Urgent",
            "True disc swelling with symptoms, acute visual loss or abnormal pupils is urgent.",
          ],
        ],
        footer: [
          "Limited, ungradable or incomplete fellow-eye recording is kept as a limitation.",
        ],
      },
      about: {
        label: "Safety",
        intro:
          "This app supports teaching and triage. It does not replace clinical eye assessment.",
        cues: [
          ["Scope", "teaching aid"],
          ["No signs", "view obtained only"],
          ["Pathway", "local rules"],
        ],
        detailTitle: "Safety wording",
        details: [
          [
            "Scope",
            "Use as a teaching and triage aid, not as a clinical assessment replacement.",
          ],
          [
            "No signs",
            "Means no referable disc signs were seen in the view obtained.",
          ],
          [
            "Referral",
            "Adapt referral wording to local pathways and clinical judgement.",
          ],
        ],
        footer: [
          "Symptoms, pupils, fields, IOP and local pathways still matter.",
        ],
      },
    },
    va = {
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
  function rt(e) {
    return va[e] || va["arclight-do"];
  }
  function Sa(e, t) {
    let a = rt(e).find(
      (r) => r.viewQuality === t.viewQuality && r.areaSeen === t.areaSeen,
    );
    return a
      ? a.value
      : t.viewQuality === "ungradable"
        ? "ungradable"
        : t.viewQuality === "hazy"
          ? "hazy"
          : t.viewQuality === "partial" || t.areaSeen === "limited"
            ? "limited"
            : "";
  }
  function Ca(e, t) {
    let n = rt(D.mode).find((a) => a.value === t) || rt(D.mode)[0];
    (Xt(D, e, "viewQuality", n.viewQuality), Xt(D, e, "areaSeen", n.areaSeen));
  }
  function ms(e) {
    let t = D.eyes[e].findings,
      n = St.flatMap((a) => a.findings).filter((a) => !!t[a.key]);
    return t.noReferableSignsSeen
      ? "No signs"
      : n.length === 0
        ? "Not recorded"
        : n.length <= 2
          ? n.map((a) => a.shortLabel || a.label).join(", ")
          : `${n
              .slice(0, 2)
              .map((a) => a.shortLabel || a.label)
              .join(", ")} +${n.length - 2}`;
  }
  function S(e, t, n) {
    let a = document.createElement(e);
    return (t && (a.className = t), n !== void 0 && (a.textContent = n), a);
  }
  function xa(e) {
    e.replaceChildren(
      ...zt.map((t) => {
        let n = document.createElement("option");
        return ((n.value = t.value), (n.textContent = t.label), n);
      }),
    );
  }
  function Aa(e, t, n) {
    (e.replaceChildren(
      ...t.map((a) => {
        let r = document.createElement("option");
        return (
          (r.value = a.value),
          (r.textContent = a.shortLabel || a.label),
          (r.title = a.label),
          r
        );
      }),
    ),
      (e.value = n || ""));
  }
  function Ea(e, t) {
    let n = document.getElementById(e.getAttribute("aria-controls") || ""),
      a = e.closest(".finding-detail-item"),
      r = e.dataset.findingLabel || "finding";
    (e.setAttribute("aria-expanded", String(t)),
      e.setAttribute("aria-label", `${t ? "Hide" : "Show"} ${r} explanation`),
      n == null || n.toggleAttribute("hidden", !t),
      a == null || a.classList.toggle("is-open", t));
  }
  function hs(e, t) {
    let n = He !== t;
    (o.findingsContainer
      .querySelectorAll('.finding-detail-toggle[aria-expanded="true"]')
      .forEach((a) => {
        a !== e && Ea(a, !1);
      }),
      (He = n ? t : null),
      Ea(e, n));
  }
  function Ra() {
    let e = S("div", "findings-dropdowns"),
      t = St.filter((n) => !n.modes || n.modes.includes(ti))
        .map((n) => ({
          ...n,
          findings: n.findings.filter((a) => !a.modes || a.modes.includes(ti)),
        }))
        .filter((n) => n.findings.length > 0);
    (["right", "left"].forEach((n) => {
      let a = S("details", "finding-dropdown");
      ((a.dataset.eye = n), (a.open = xe === n));
      let r = S("summary", "finding-dropdown-summary");
      r.append(
        S("span", "finding-dropdown-title", "Findings"),
        S("span", "finding-dropdown-value", ms(n)),
      );
      let d = S("div", "finding-dropdown-menu");
      (t.forEach((p) => {
        let h = S(
          "section",
          `finding-dropdown-group finding-dropdown-group--${p.tone}`,
        );
        h.append(S("h3", "", p.title));
        let A = S("div", "finding-dropdown-options");
        (p.findings.forEach((g) => {
          let w = `${n}:${g.key}`,
            v = `findingDetail-${n}-${g.key}`,
            b = He === w,
            T = S("div", `finding-detail-item${b ? " is-open" : ""}`),
            L = S("div", "finding-detail-summary"),
            M = S("label", "finding-dropdown-option"),
            E = document.createElement("input");
          ((E.type = "checkbox"),
            (E.name = `finding-${n}`),
            (E.value = g.key),
            E.setAttribute(
              "aria-label",
              `${n === "right" ? "Right" : "Left"} ${g.label}`,
            ),
            (E.checked = !!D.eyes[n].findings[g.key]),
            (M.title = g.label),
            M.classList.toggle("is-selected", E.checked),
            E.addEventListener("change", () => {
              (sa(D, n, g.key, E.checked), (xe = n), ie());
            }),
            M.append(E, S("span", "", g.shortLabel || g.label)));
          let N = S("button", "finding-detail-toggle");
          ((N.type = "button"),
            (N.dataset.findingLabel = g.shortLabel || g.label),
            N.setAttribute("aria-expanded", String(b)),
            N.setAttribute("aria-controls", v),
            N.setAttribute(
              "aria-label",
              `${b ? "Hide" : "Show"} ${g.shortLabel || g.label} explanation`,
            ),
            N.append(S("span", "finding-detail-toggle-icon", "\u2304")),
            N.addEventListener("click", () => {
              ((xe = n), hs(N, w));
            }));
          let k = S("div", "finding-detail-panel");
          ((k.id = v), (k.hidden = !b));
          let _ = S("p");
          (_.append(S("strong", "", `${g.label}.`), ` ${g.detail || g.label}`),
            k.append(_),
            L.append(M, N),
            T.append(L, k),
            A.append(T));
        }),
          h.append(A),
          d.append(h));
      }),
        a.addEventListener("toggle", () => {
          a.open
            ? ((xe = n),
              e.querySelectorAll(".finding-dropdown[open]").forEach((p) => {
                p !== a && (p.open = !1);
              }))
            : xe === n &&
              ((xe = null),
              (He = null),
              a
                .querySelectorAll(
                  '.finding-detail-toggle[aria-expanded="true"]',
                )
                .forEach((p) => {
                  var A;
                  let h = document.getElementById(
                    p.getAttribute("aria-controls") || "",
                  );
                  (p.setAttribute("aria-expanded", "false"),
                    h == null || h.setAttribute("hidden", ""),
                    (A = p.closest(".finding-detail-item")) == null ||
                      A.classList.remove("is-open"));
                }));
        }),
        a.append(r, d),
        e.append(a));
    }),
      o.findingsContainer.replaceChildren(e));
  }
  function gs() {
    (Aa(o.rightViewStatusSelect, rt(D.mode), Sa(D.mode, D.eyes.right)),
      Aa(o.leftViewStatusSelect, rt(D.mode), Sa(D.mode, D.eyes.left)));
  }
  function Ia(e, t, n = "") {
    let a =
      t.length > 0 ? t.map((r) => S("p", "", r)) : n ? [S("p", "", n)] : [];
    e.replaceChildren(...a);
  }
  function ii() {
    ((oe = Qt(D)),
      (o.actionTitle.textContent = oe.title),
      (o.actionTone.textContent = oe.title),
      (o.actionTone.className = `action-tone tone-${oe.tone}`),
      (o.actionCard.className = `action-card tone-${oe.tone}`),
      o.actionPanel.classList.toggle("is-collapsed", !Q),
      o.actionPanel.classList.toggle("is-expanded", Q),
      (o.actionDetails.hidden = !Q),
      o.actionDetails.setAttribute("aria-hidden", String(!Q)),
      (o.actionToggle.textContent = Q ? "\xD7" : "+"),
      o.actionToggle.setAttribute(
        "aria-label",
        Q ? "Close action details" : "Show action details",
      ),
      o.actionToggle.setAttribute("aria-expanded", String(Q)),
      Ia(o.actionReasons, oe.reasons, "No reason recorded yet."),
      Ia(o.actionLimitations, oe.limitations),
      (o.actionNext.textContent = oe.next),
      (o.actionSafety.textContent = oe.safety.join(" ")));
  }
  function Na() {
    (o.recordingSystemPanel.classList.toggle("is-collapsed", !le),
      (o.recordingSystemContent.hidden = !le),
      o.recordingSystemContent.setAttribute("aria-hidden", String(!le)),
      (o.recordingSystemToggle.textContent = le ? "-" : "+"),
      o.recordingSystemToggle.setAttribute("aria-expanded", String(le)),
      o.recordingSystemToggle.setAttribute(
        "aria-label",
        le ? "Collapse Exam" : "Expand Exam",
      ));
  }
  function ri() {
    o.caseSetButtons.forEach((e) => {
      let t = e.dataset.caseSet === Ve;
      (e.classList.toggle("active", t),
        e.setAttribute("aria-pressed", String(t)));
    });
  }
  function ot() {
    let e = si(),
      t = lt(),
      n = Et() + 1,
      a = t.length,
      r = Z[_e],
      d = r.summary || `Case ${n}`,
      p = r.description || [];
    if (
      ((o.viewerCaseLabel.textContent = `${n}/${a}`),
      o.viewerCaseLabel.setAttribute(
        "aria-label",
        `${e.label} case ${n} of ${a}`,
      ),
      (o.viewerCaseShortLabel.textContent = "Case information"),
      o.viewerCaseSummaryToggle.setAttribute("aria-expanded", String(Ee)),
      o.viewerCaseSummaryToggle.setAttribute(
        "aria-label",
        Ee
          ? `Info: hide case ${n} description, ${d}`
          : `Info: show case ${n} description`,
      ),
      (o.viewerCaseDescription.hidden = !Ee),
      o.viewerCaseDescription.setAttribute("aria-hidden", String(!Ee)),
      (o.viewerCaseDescriptionTitle.textContent = `${e.shortLabel || e.label} ${n}/${a}: ${d}`),
      p.length)
    ) {
      let h = S("ul", "viewer-case-description-list");
      (h.append(...p.map((A) => S("li", "", A))),
        o.viewerCaseDescriptionBody.replaceChildren(h));
    } else o.viewerCaseDescriptionBody.replaceChildren();
  }
  function oi(e, t = {}) {
    let n = Z.length;
    ((_e = (e + n) % n),
      (Ve = (t.caseSetId ? It(t.caseSetId) : Da(_e)).id),
      (Ee = !1));
    let r = Z[_e];
    (qe.setViewerCase({ condition: r.id, imagePath: ai(r), imageScale: Ta(r) }),
      ri(),
      ot(),
      o.practiceModal && !o.practiceModal.hidden && li(),
      Mt());
  }
  function Ma(e) {
    let t = lt(),
      n = t.length;
    if (!n) return;
    let a = (e + n) % n;
    oi(t[a], { caseSetId: Ve });
  }
  function fs(e) {
    let t = It(e);
    if (!t) return;
    let n = ni(t.id);
    if (
      ((Ve = t.id),
      ri(),
      o.practiceModal && !o.practiceModal.hidden && li(),
      n.includes(_e))
    ) {
      (ot(), Mt());
      return;
    }
    oi(n[0] || 0, { caseSetId: t.id });
  }
  function ys(e) {
    (At !== null && (window.clearInterval(At), (At = null)),
      (o.gazeMoveToggle.checked = !!e),
      e &&
        (qe.doGazeShift(),
        (At = window.setInterval(() => {
          D.viewer.shiftInProgress || qe.doGazeShift();
        }, 3600))));
  }
  function bs() {
    ((m("#clinicalDilation").value = D.dilation),
      (m("#clinicalMode").value = D.mode));
  }
  function Pa() {
    let e = D.viewer.pigmentation === "dark";
    ((o.viewerPigmentationToggle.disabled = !1),
      (o.viewerPigmentationToggle.checked = e),
      (o.viewerPigmentationText.textContent = e ? "Dark" : "Light"));
  }
  function ws() {
    ((o.rightDistanceVA.value = D.eyes.right.distanceVA),
      (o.leftDistanceVA.value = D.eyes.left.distanceVA));
  }
  function ie() {
    (bs(), Pa(), ws(), gs(), Ra(), ii(), Na());
  }
  function vs([e, t]) {
    let n = S("span", "info-basics-cue");
    return (n.append(S("strong", "", e), S("small", "", t)), n);
  }
  function Ss([e, t]) {
    let n = S("p");
    return (n.append(S("strong", "", `${e}:`), ` ${t}`), n);
  }
  function Cs(e) {
    let t = S("section", "info-guide-definition");
    t.append(S("p", "info-look-title", e.label), S("p", "", e.intro));
    let n = document.createElement("hr"),
      a = S("div", "info-look-guide"),
      r = S("section", "info-look-section info-look-section--basics");
    (r.append(
      S("p", "info-look-title", "Basics"),
      S("div", "info-basics-grid"),
    ),
      r.lastElementChild.append(...e.cues.map(vs)));
    let d = S("section", "info-look-section info-look-section--detail");
    (d.append(S("p", "info-look-title", e.detailTitle), ...e.details.map(Ss)),
      a.append(r, d));
    let p = document.createElement("hr"),
      h = S("div", "info-points");
    return (h.append(...e.footer.map((A) => S("p", "", A))), [t, n, a, p, h]);
  }
  function xs(e) {
    let t =
        {
          cases: "Cases and skin",
          viewing: "Viewing controls",
          recording: "Record RE/LE",
          findings: "Findings guide",
          action: "Action wording",
          about: "Safety and local pathways",
        }[e] || "Guide",
      n = wa[e] || wa.about;
    ((o.guideTitle.textContent = t),
      o.guideContent.replaceChildren(...Cs(n)),
      Ge(o.guideModal, o.guideModalContent));
  }
  function li() {
    let e = si(),
      t = lt(),
      n = t.map((a, r) => {
        let d = ca[a],
          p = S("article", "practice-card");
        ((p.tabIndex = 0),
          p.setAttribute("role", "button"),
          p.setAttribute(
            "aria-label",
            `Open ${e.label} case ${r + 1}: ${d.prompt}`,
          ),
          (p.dataset.caseIndex = String(a)),
          (p.dataset.caseSet = e.id));
        let h = S("figure", "practice-image"),
          A = document.createElement("img");
        ((A.src = d.imageSrc),
          (A.alt = ""),
          (A.loading = "lazy"),
          (A.decoding = "async"),
          h.append(A, S("figcaption", "", `${r + 1}/${t.length}`)));
        let g = S("div", "practice-card-copy"),
          w = Array.isArray(d.answer) ? d.answer : [d.answer];
        return (
          g.append(
            S("h3", "", `Case ${r + 1}`),
            S("p", "practice-card-summary", d.prompt),
            ...w.map((v) => S("p", "", v)),
            S("span", "practice-card-action", "Open case >"),
          ),
          p.append(h, g),
          p
        );
      });
    o.practiceCases.replaceChildren(...n);
  }
  function La(e) {
    let t = Da(e);
    (oi(e, { caseSetId: t.id }), Ce(o.practiceModal));
  }
  function As() {
    ((o.referralText.value = la(D, oe)),
      (o.copyStatus.textContent = ""),
      (o.shareReferralButton.hidden = !navigator.share),
      Ge(o.referralModal, o.referralModalContent));
  }
  async function Es() {
    o.referralText.select();
    try {
      (await navigator.clipboard.writeText(o.referralText.value),
        (o.copyStatus.textContent = "Copied."));
    } catch (e) {
      (document.execCommand("copy"), (o.copyStatus.textContent = "Copied."));
    }
  }
  async function Is() {
    if (!navigator.share) {
      o.copyStatus.textContent = "Sharing is not available here.";
      return;
    }
    try {
      (await navigator.share({
        title: "Discs referral note",
        text: o.referralText.value,
      }),
        (o.copyStatus.textContent = "Shared."));
    } catch (e) {
      (e == null ? void 0 : e.name) !== "AbortError" &&
        (o.copyStatus.textContent = "Share failed.");
    }
  }
  function Mt() {
    if (typeof window == "undefined" || typeof Image == "undefined") return;
    let e = lt(),
      t = Et(),
      n = e.length;
    if (!n) return;
    let a = [e[t], e[(t + n - 1) % n], e[(t + 1) % n]],
      r = new Set(a.map((p) => ai(Z[p])).filter(Boolean)),
      d = () => {
        r.forEach((p) => {
          if (ba.has(p)) return;
          let h = new Image();
          ((h.decoding = "async"), ba.set(p, h), (h.src = p));
        });
      };
    typeof window.requestIdleCallback == "function"
      ? window.requestIdleCallback(d, { timeout: 1200 })
      : window.setTimeout(d, 220);
  }
  function Ms() {
    let e = pa({
      menuButton: m("#menuButton"),
      closeButton: m("#closeDrawerButton"),
      drawer: m("#sideMenu"),
      overlay: m("#drawerOverlay"),
    });
    (ma({
      button: m("#infoButton"),
      popup: m("#infoPopup"),
      closeButton: m("#closeInfoButton"),
    }),
      ha({
        tabs: Ae(".tab-btn[data-mode]"),
        onChange: (a) => {
          (qe.setViewerMode(a), ie());
        },
      }),
      o.findingModeTabs.forEach((a) => {
        let r = () => {
          ((ti = a.dataset.findingMode || "general"),
            o.findingModeTabs.forEach((d) => {
              let p = d === a;
              (d.classList.toggle("active", p),
                d.setAttribute("aria-selected", String(p)),
                (d.tabIndex = p ? 0 : -1));
            }),
            o.findingsContainer.setAttribute("aria-labelledby", a.id),
            (xe = null),
            (He = null),
            Ra());
        };
        (a.addEventListener("click", r),
          a.addEventListener("keydown", (d) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(d.key))
              return;
            d.preventDefault();
            let p = o.findingModeTabs.indexOf(a),
              h =
                d.key === "Home"
                  ? 0
                  : d.key === "End"
                    ? o.findingModeTabs.length - 1
                    : (p +
                        (d.key === "ArrowRight" ? 1 : -1) +
                        o.findingModeTabs.length) %
                      o.findingModeTabs.length;
            (o.findingModeTabs[h].focus(), o.findingModeTabs[h].click());
          }));
      }),
      o.viewerDilationToggle.addEventListener("change", () => {
        qe.setDilated(o.viewerDilationToggle.checked);
      }),
      m("#clinicalDilation").addEventListener("change", (a) => {
        (aa(D, a.target.value), ie());
      }),
      m("#clinicalMode").addEventListener("change", (a) => {
        (ia(D, a.target.value), ie());
      }),
      o.gazeMoveToggle.addEventListener("change", () => {
        ys(o.gazeMoveToggle.checked);
      }),
      o.viewerPigmentationToggle.addEventListener("change", () => {
        D.viewer.pigmentation = o.viewerPigmentationToggle.checked
          ? "dark"
          : "light";
        let a = Z[_e];
        (qe.setViewerCase({
          condition: a.id,
          imagePath: ai(a),
          imageScale: Ta(a),
        }),
          Pa(),
          Mt());
      }),
      o.caseSetButtons.forEach((a) => {
        a.addEventListener("click", () => {
          fs(a.dataset.caseSet);
        });
      }),
      o.previousCaseButton.addEventListener("click", () => {
        Ma(Et() - 1);
      }),
      o.nextCaseButton.addEventListener("click", () => {
        Ma(Et() + 1);
      }),
      o.viewerCaseSummaryToggle.addEventListener("click", () => {
        ((Ee = !Ee), ot());
      }),
      o.rightDistanceVA.addEventListener("change", () => {
        (jt(D, "right", o.rightDistanceVA.value), ie());
      }),
      o.leftDistanceVA.addEventListener("change", () => {
        (jt(D, "left", o.leftDistanceVA.value), ie());
      }),
      o.rightViewStatusSelect.addEventListener("change", () => {
        (Ca("right", o.rightViewStatusSelect.value), ie());
      }),
      o.leftViewStatusSelect.addEventListener("change", () => {
        (Ca("left", o.leftViewStatusSelect.value), ie());
      }),
      Ae("[data-systemic]").forEach((a) => {
        a.addEventListener("change", () => {
          (na(D, a.dataset.systemic, a.checked), ie());
        });
      }),
      o.actionToggle.addEventListener("click", () => {
        ((Q = !Q), Q ? st("action-panel") : Oe("action-panel"), ii());
      }));
    let t = m("#newAssessmentButton");
    (t.addEventListener("click", () => {
      if (t.dataset.confirm !== "true") {
        ((t.dataset.confirm = "true"),
          (t.querySelector("span:last-child").textContent =
            "Press again to clear"),
          window.clearTimeout(ei),
          (ei = window.setTimeout(() => {
            (delete t.dataset.confirm,
              (t.querySelector("span:last-child").textContent =
                "New assessment"));
          }, 5e3)));
        return;
      }
      (window.clearTimeout(ei),
        delete t.dataset.confirm,
        (t.querySelector("span:last-child").textContent = "New assessment"),
        ds(),
        e.close());
    }),
      o.recordingSystemToggle.addEventListener("click", () => {
        ((le = !le), !le && Q && ((Q = !1), Oe("action-panel"), ii()), Na());
      }),
      m("#referralNoteButton").addEventListener("click", As),
      m("#closeReferralButton").addEventListener("click", () =>
        Ce(o.referralModal),
      ),
      m("#copyReferralButton").addEventListener("click", Es),
      o.shareReferralButton.addEventListener("click", Is),
      m("#closePracticeButton").addEventListener("click", () =>
        Ce(o.practiceModal),
      ),
      m("#closeGuideButton").addEventListener("click", () => Ce(o.guideModal)),
      m("[data-practice-open]").addEventListener("click", () => {
        (e.close(), li(), Ge(o.practiceModal, o.practiceModalContent));
      }),
      o.practiceCases.addEventListener("click", (a) => {
        let r = a.target.closest(".practice-card");
        !r ||
          !o.practiceCases.contains(r) ||
          La(Number(r.dataset.caseIndex || 0));
      }),
      o.practiceCases.addEventListener("keydown", (a) => {
        if (a.key !== "Enter" && a.key !== " ") return;
        let r = a.target.closest(".practice-card");
        !r ||
          !o.practiceCases.contains(r) ||
          (a.preventDefault(), La(Number(r.dataset.caseIndex || 0)));
      }),
      Ae("[data-guide]").forEach((a) => {
        a.addEventListener("click", () => {
          (e.close(), xs(a.dataset.guide));
        });
      }));
    let n = ya({
      modal: m("#mcqModal"),
      modalContent: m("#mcqModalContent"),
      title: m("#mcqTitle"),
      intro: m("#mcqIntro"),
      container: m("#mcqContainer"),
      submit: m("#submitMcqButton"),
      restart: m("#restartMcqButton"),
      result: m("#mcqResult"),
      close: m("#closeMcqButton"),
    });
    (Ae("[data-mcq-level]").forEach((a) => {
      a.addEventListener("click", () => {
        let r = a.dataset.mcqLevel;
        (e.close(), window.setTimeout(() => n.open(r), 190));
      });
    }),
      document.addEventListener("keydown", (a) => {
        a.key === "Escape" &&
          ((Ee = !1),
          ot(),
          [
            o.referralModal,
            o.practiceModal,
            o.guideModal,
            m("#mcqModal"),
          ].forEach((r) => Ce(r)));
      }));
  }
  function Ls() {
    (xa(o.rightDistanceVA), xa(o.leftDistanceVA));
    try {
      (qe.initialize(), ri(), ot(), Mt());
    } catch (t) {
      console.error("Viewer initialisation failed", t);
    }
    (Ms(),
      (location.protocol === "http:" || location.protocol === "https:") &&
        window.addEventListener("load", () => {
          var t;
          return (t = navigator.serviceWorker) == null
            ? void 0
            : t.register("./service-worker.js");
        }),
      fa().forEach((t) => {
        (t.actual !== t.expected ||
          t.invalidAnswers > 0 ||
          t.invalidMetadata > 0) &&
          console.warn("MCQ validation issue", t);
      }),
      ie());
  }
  Ls();
})();
