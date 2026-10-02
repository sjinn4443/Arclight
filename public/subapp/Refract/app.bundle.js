"use strict";
(() => {
  var Ut = [
      { min: 40, max: 43, add: 0.75 },
      { min: 44, max: 47, add: 1.25 },
      { min: 48, max: 51, add: 1.25 },
      { min: 52, max: 55, add: 1.5 },
      { min: 56, max: 59, add: 1.75 },
      { min: 60, max: 63, add: 2.25 },
      { min: 64, max: 68, add: 2.25 },
      { min: 69, max: 77, add: 2.5 },
      { min: 78, max: Number.POSITIVE_INFINITY, add: 2.75 },
    ],
    V = {
      confidence: {
        currentBase: 1,
        currentPrecise: 2,
        currentVaGood: 0.75,
        objectiveBase: 1,
        objectiveAccurate: 1.5,
        objectiveNoCurrent: 2.5,
      },
      sphere: {
        objectiveBias: 0.25,
        pullOffset: 1,
        pullScale: 4,
        quarterPull: 0.2,
        maxStep: 0.25,
      },
      cylinder: {
        objectiveReduction: 0.25,
        pullOffset: 1,
        pullScale: 2.6,
        quarterPull: 0.2,
        maxStep: 0.75,
        dropMagnitude: 0.25,
        introduceMagnitude: 0.25,
        tokenCurrentDrop: 0.25,
        corroboratedKeepGap: 8,
        corroboratedBlendGap: 20,
        lowCylHoldGap: 10,
      },
      axis: {
        lowCylRounding: 5,
        highCylCutoff: 1.75,
        pullOffset: 0,
        pullScale: 3,
        compromisePull: 0.3,
        objectiveFollowRatio: 0.5,
        nonPreciseFollowGap: 15,
      },
      add: { bands: Ut, healthBoost: 0.25, ageGate: 46 },
    };
  function j(e = {}) {
    var t, n;
    return {
      confidence: { ...V.confidence, ...e.confidence },
      sphere: { ...V.sphere, ...e.sphere },
      cylinder: { ...V.cylinder, ...e.cylinder },
      axis: { ...V.axis, ...e.axis },
      add: {
        ...V.add,
        ...e.add,
        bands:
          (n = (t = e.add) == null ? void 0 : t.bands) != null
            ? n
            : V.add.bands,
      },
    };
  }
  function he(e) {
    return typeof e == "number" && Number.isFinite(e) && e > -0.5 && e < 0.75;
  }
  function Z(e) {
    if ([e.sph, e.cyl, e.axis].some((r) => Number.isNaN(r))) return e;
    let n = e.axis + 90;
    return (
      n > 180 && (n -= 180),
      { sph: e.sph + e.cyl, cyl: -e.cyl, axis: n }
    );
  }
  var P = 0.25,
    ke = 0.5,
    _ = 0.001;
  function Ue(e, t, n) {
    return Math.min(n, Math.max(t, e));
  }
  function jt(e, t) {
    let n = Math.round(e / t) * t;
    return n < 1 || n > 180 ? 180 : n;
  }
  function v(e) {
    return Math.round(e / P) * P;
  }
  function B(e, t, n) {
    let i = Math.abs(t) < n.axis.highCylCutoff ? n.axis.lowCylRounding : 1;
    return jt(e, i);
  }
  function zt(e, t) {
    return e === null || t === null
      ? e === t
      : Number.isNaN(e) || Number.isNaN(t)
        ? !1
        : Math.abs(e - t) < _;
  }
  function je(e, t) {
    if (Number.isNaN(e)) return Number.NaN;
    let n = Math.abs(e),
      r = Math.max(0, n - t);
    return Math.sign(e) * r;
  }
  function $t(e, t) {
    let n = Math.abs(e - t);
    return (n > 90 && (n = 180 - n), n);
  }
  function W(e) {
    return e === 180 ? 0 : e;
  }
  function ze(e) {
    let t = e;
    for (; t <= 0; ) t += 180;
    for (; t > 180; ) t -= 180;
    return Math.abs(t) < _ ? 180 : t;
  }
  function z(e, t) {
    let n = W(e),
      r = W(t);
    return (n <= 15 && r >= 165) || (r <= 15 && n >= 165);
  }
  function Ye(e, t) {
    let n = W(e),
      i = W(t) - n;
    return (i > 90 && (i -= 180), i < -90 && (i += 180), ze(n + i / 2));
  }
  function Xt(e, t, n) {
    let r = W(e),
      a = W(t) - r;
    return (a > 90 && (a -= 180), a < -90 && (a += 180), ze(r + a * n));
  }
  function Qt(e, t, n, r, i) {
    let a = Number.isNaN(e.sph),
      o =
        i.confidence.currentBase +
        (n ? i.confidence.currentPrecise : 0) +
        (t ? i.confidence.currentVaGood : 0),
      c =
        i.confidence.objectiveBase +
        (r ? i.confidence.objectiveAccurate : 0) +
        (a ? i.confidence.objectiveNoCurrent : 0);
    return { current: o, objective: c, signal: c - o, noCurrent: a };
  }
  function me(e, t) {
    return Ue((e + t.pullOffset) / t.pullScale, 0, 1);
  }
  function Kt(e, t, n) {
    let r = Math.abs(e);
    if (r < _) return 0;
    let i = v(r * t);
    return (
      i < P && r >= P && t >= n.quarterPull && (i = P),
      n.maxStep != null && (i = Math.min(i, n.maxStep)),
      Math.min(i, r)
    );
  }
  function R(e, t, n, r) {
    if (Number.isNaN(e)) return Number.isNaN(t) ? Number.NaN : v(t);
    if (Number.isNaN(t)) return v(e);
    let i = t - e,
      a = Kt(i, n, r);
    return a < _ ? v(e) : v(e + Math.sign(i) * a);
  }
  function Jt(e, t, n) {
    let r = !Number.isNaN(e.cyl) && !Number.isNaN(t.cyl) && zt(e.cyl, t.cyl),
      i = Number.isNaN(t.sph)
        ? Number.NaN
        : v(
            t.sph -
              Math.sign(t.sph) *
                Math.min(Math.abs(t.sph), n.sphere.objectiveBias),
          ),
      a = r ? t.cyl : je(t.cyl, n.cylinder.objectiveReduction),
      o = Number.isNaN(a) ? Number.NaN : v(a),
      c =
        Number.isNaN(t.axis) || Number.isNaN(o) || Math.abs(o) < _
          ? Number.NaN
          : B(t.axis, o, n);
    return { sphere: i, cyl: o, axis: c, corroboratedCylinder: r };
  }
  function ee(e, t, n, r, i, a) {
    let o = j(a),
      c = Qt(e, n, r, i, o),
      d = Jt(e, t, o),
      m = me(c.signal, o.sphere),
      N = me(c.signal, o.cylinder),
      S = me(c.signal, o.axis),
      l = { sph: null, cyl: null, axis: null },
      E = !Number.isNaN(t.cyl) && Math.abs(t.cyl) < _;
    if (c.noCurrent)
      return (
        (l.sph = d.sphere),
        Number.isNaN(d.cyl) || Math.abs(d.cyl) < o.cylinder.dropMagnitude
          ? ((l.cyl = null), (l.axis = null), l)
          : ((l.cyl = d.cyl), (l.axis = d.axis), l)
      );
    if (((l.sph = R(e.sph, d.sphere, m, o.sphere)), Number.isNaN(e.cyl))) {
      let b = R(0, d.cyl, N, o.cylinder);
      return Number.isNaN(d.cyl) || Math.abs(b) < o.cylinder.introduceMagnitude
        ? ((l.cyl = null), (l.axis = null), l)
        : ((l.cyl = b), (l.axis = d.axis), l);
    }
    if (i && !n && E && Math.abs(e.cyl) <= o.cylinder.tokenCurrentDrop)
      return (
        (l.sph = R(
          e.sph,
          d.sphere,
          Math.max(m, o.sphere.quarterPull),
          o.sphere,
        )),
        (l.cyl = null),
        (l.axis = null),
        l
      );
    l.cyl = R(e.cyl, d.cyl, N, o.cylinder);
    let u =
        Number.isNaN(e.sph) || Number.isNaN(t.sph)
          ? Number.POSITIVE_INFINITY
          : Math.abs(e.sph - t.sph),
      s =
        Number.isNaN(e.axis) || Number.isNaN(t.axis)
          ? Number.POSITIVE_INFINITY
          : $t(e.axis, t.axis),
      f =
        i &&
        r &&
        d.corroboratedCylinder &&
        u <= P &&
        s < o.cylinder.corroboratedKeepGap,
      p =
        i &&
        r &&
        d.corroboratedCylinder &&
        u <= P &&
        s >= o.cylinder.corroboratedKeepGap &&
        s <= o.cylinder.corroboratedBlendGap;
    if (
      (u < _ && (l.sph = e.sph),
      f
        ? (l.cyl = e.cyl)
        : p &&
          (l.cyl =
            Math.abs(e.cyl) >= 0.75 && Math.abs(e.cyl) < 1
              ? je(e.cyl, o.cylinder.objectiveReduction)
              : e.cyl),
      l.cyl !== null &&
        !Number.isNaN(l.cyl) &&
        Math.abs(l.cyl) < o.cylinder.dropMagnitude)
    )
      return ((l.cyl = null), (l.axis = null), l);
    if (Number.isNaN(e.axis)) return ((l.axis = d.axis), l);
    if (Number.isNaN(d.axis)) return ((l.axis = e.axis), l);
    if (f) return ((l.axis = s < _ ? e.axis : B(e.axis, l.cyl, o)), l);
    if (p)
      return !z(e.axis, t.axis) &&
        Math.abs(l.cyl) <= ke &&
        s >= o.cylinder.lowCylHoldGap
        ? ((l.axis = e.axis), l)
        : ((l.axis = z(e.axis, t.axis)
            ? B(t.axis, l.cyl, o)
            : B(Ye(e.axis, t.axis), l.cyl, o)),
          l);
    let h = d.axis,
      y =
        Number.isNaN(d.cyl) || Number.isNaN(e.cyl)
          ? 0
          : Math.abs(d.cyl - e.cyl),
      x =
        l.cyl === null || Number.isNaN(l.cyl)
          ? Math.abs(e.cyl)
          : Math.abs(l.cyl - e.cyl),
      M = y < _ ? 0 : Ue(x / y, 0, 1);
    if (
      !z(e.axis, t.axis) &&
      Math.abs(l.cyl) <= ke &&
      s >= o.cylinder.lowCylHoldGap &&
      M < o.axis.objectiveFollowRatio
    )
      return ((l.axis = e.axis), l);
    if (
      M >= o.axis.objectiveFollowRatio ||
      (!r && i && s <= o.axis.nonPreciseFollowGap)
    ) {
      let b = Math.max(S, M),
        O = z(e.axis, t.axis) ? t.axis : Xt(e.axis, h, b);
      return ((l.axis = B(O, l.cyl, o)), l);
    }
    if (S >= o.axis.compromisePull && s <= o.cylinder.corroboratedBlendGap) {
      let b = z(e.axis, t.axis) ? t.axis : Ye(e.axis, h);
      return ((l.axis = B(b, l.cyl, o)), l);
    }
    return ((l.axis = e.axis), l);
  }
  function Zt(e, t, n) {
    let r = j(n),
      i = Math.floor(parseFloat(e));
    if (!Number.isFinite(i) || i < r.add.ageGate) return Number.NaN;
    let a = r.add.bands.find((o) => i >= o.min && i <= o.max);
    return a ? a.add + (t ? r.add.healthBoost : 0) : null;
  }
  function ye(e, t, n, r, i) {
    return typeof n == "number" && Number.isFinite(n)
      ? n
      : typeof r == "number" && Number.isFinite(r)
        ? r
        : Zt(e, t, i);
  }
  function $e(e) {
    if ([e.sph, e.cyl, e.axis].some((r) => Number.isNaN(r))) return e;
    let n = e.axis + 90;
    return (
      n > 180 && (n -= 180),
      { sph: e.sph + e.cyl, cyl: -e.cyl, axis: n }
    );
  }
  var L = Object.freeze({
    youngerAge: 40,
    meaningfulSphereGap: 0.5,
    youngerPull: 0.5,
    ordinarySphereStep: 0.5,
    highSphere: 6,
    highSphereStep: 0.25,
    highCylinder: 1.75,
    smallAxisGap: 5,
    discordantSphere: 3,
    discordantCylinder: 2,
    discordantAxis: 60,
  });
  var Rt = () => ({ sph: null, cyl: null, axis: null }),
    Ne = (e) => typeof e == "number" && Number.isFinite(e);
  function Xe(e = {}) {
    if (!Ne(e.sph)) return Rt();
    let t = Ne(e.cyl) ? e.cyl : 0;
    if (Math.abs(t) < 0.001)
      return { sph: e.sph, cyl: e.cyl === 0 ? 0 : null, axis: null };
    if (!Ne(e.axis) || e.axis < 0 || e.axis > 180) return null;
    let n = { sph: e.sph, cyl: t, axis: e.axis === 0 ? 180 : e.axis };
    return t > 0 ? $e(n) : n;
  }
  var Ze = Object.freeze({
      qualityFloor: 5,
      qualityCeiling: 8,
      unknownQuality: 0.25,
      preciseResistance: 0.2,
      calmBonus: 0.04,
      newPatientPenalty: 0.05,
      returningBonus: 0.025,
      frailtyPenalty: 0.05,
      olderPenalty: 0.05,
      basePull: 0.4,
      qualityPull: 0.5,
      largeChangeBonus: 0.2,
      smallChangeDeadband: 0.25,
      largeChangeStart: 1.25,
      largeStepRamp: 1,
      maxSphereStep: 1.5,
      highSphereStep: 0.25,
      cylinderSignalScale: 1.5,
      cylinderPreciseResistance: 2,
      repeatEnabled: !0,
      firstSphereBias: 0.25,
      firstCylinderReduction: 0.25,
      cylinderQuarterPull: 0.25,
    }),
    en = Object.freeze(
      [
        [
          "W0_VALIDATE",
          "Validate sphere and non-zero cylinder axis before any weighting",
        ],
        [
          "W1_LARGE_DISCREPANCY",
          "Retain both current eyes and request measurement review for a large discrepancy",
        ],
        [
          "W2_SIMPLE",
          "Project to spherical equivalent when simple mode is explicitly selected",
        ],
        [
          "W3_NO_OBJECTIVE",
          "Retain a recorded current eye when objective sphere is absent",
        ],
        [
          "W4_NO_ANCHOR",
          "With no recorded prior Rx use the existing seed provisionally, not a plano anchor",
        ],
        ["W5_GOOD_VA", "Explicit good VA retains the current eye"],
        [
          "W6_LOW_CONFIDENCE",
          "Quality at or below the floor retains an existing current eye",
        ],
        [
          "W7_WEIGHTED_COMPONENTS",
          "Grade the established sphere, cylinder and axis component policy by confidence and adaptation modifiers",
        ],
        [
          "W8_SMALL_SPHERE",
          "Retain sphere for objective changes of 0.25 D or less",
        ],
        [
          "W9_LARGE_SPHERE",
          "Above 1.25 D progressively enlarge the ordinary sphere-step allowance by the excess gap",
        ],
        [
          "W10_YOUNGER_SPHERE",
          "Otherwise retain the younger half-change seed with bounded adaptation weighting",
        ],
        [
          "W11_YOUNGER_CYLINDER",
          "Retain the established cautious younger cylinder introduction seed",
        ],
        [
          "W12_HIGH_CYLINDER_AXIS",
          "Hold a small axis change when the established high cylinder is unchanged",
        ],
        [
          "WA_ADD",
          "Entered current add precedes measured add, then existing age estimate and frailty increment",
        ],
      ].map(([e, t]) => Object.freeze({ id: e, description: t })),
    ),
    tn = {
      W0_VALIDATE:
        "Non-zero cylinder requires a finite axis within 0\u2013180\xB0; plus cylinder is transposed",
      W1_LARGE_DISCREPANCY:
        "Either eye: sphere gap \u22653 D, cylinder gap \u22652 D or axis gap \u226560\xB0 with both cylinders \u22651 D",
      W2_SIMPLE: "Simple mode explicitly selected, after the discrepancy check",
      W3_NO_OBJECTIVE: "Objective sphere missing",
      W4_NO_ANCHOR: "Current sphere missing, objective sphere recorded",
      W5_GOOD_VA:
        "Current prescription present and good VA explicitly selected",
      W6_LOW_CONFIDENCE: "Current prescription present and confidence q=0",
      W7_WEIGHTED_COMPONENTS:
        "Current and objective present, q>0; signal includes bounded adaptation modifiers",
      W8_SMALL_SPHERE: "Absolute measured sphere difference \u22640.25 D",
      W9_LARGE_SPHERE:
        "Absolute measured sphere difference \u22651.25 D; cap = ordinary step + excess above 1.25 D, subject to 1.5 D maximum",
      W10_YOUNGER_SPHERE:
        "Age <40 and sphere gap \u22650.5 D, unless the large-change branch applies",
      W11_YOUNGER_CYLINDER:
        "Age <40, no current cylinder, measured cylinder magnitude \u22650.5 D and seed omits cylinder",
      W12_HIGH_CYLINDER_AXIS:
        "Current cylinder magnitude \u22651.75 D, cylinder unchanged and axis gap \u22645\xB0",
      WA_ADD:
        "Finite current add, otherwise finite measured add, otherwise existing age bands",
    },
    be = Object.freeze([
      ...en.map((e) =>
        Object.freeze([
          e.id,
          tn[e.id],
          e.description,
          e.id === "WA_ADD"
            ? "Age-only addition is a provisional estimate; near tasks and working distance remain unmeasured."
            : "Provisional decision support. Coefficients and thresholds require independent clinical review.",
        ]),
      ),
      Object.freeze([
        "RETAIN_ENTERED_ADD",
        "Finite current add supplied, including zero",
        "Retain the entered current addition.",
        "An explicit zero is not missing. Age and frailty do not override an entered addition.",
      ]),
      Object.freeze([
        "MEASURED_ADD",
        "No current add and a finite objective add supplied",
        "Use the measured objective addition.",
        "Current-add precedence is retained from the established engine.",
      ]),
      Object.freeze([
        "AGE_ESTIMATE",
        "Neither current nor objective add supplied",
        "Use the existing age bands; below the age gate leave the addition blank.",
        "Age alone cannot establish working distance, near demand or the need for a near prescription.",
      ]),
      Object.freeze([
        "FRAILTY_INCREMENT",
        "A non-blank age-derived addition and the health modifier selected",
        "Apply the existing +0.25 D frailty increment.",
        "This is an authored heuristic pending independent clinical review, not an override of a supplied addition.",
      ]),
    ]),
    A = (e) => typeof e == "number" && Number.isFinite(e),
    ne = (e, t, n) => Math.max(t, Math.min(n, e)),
    T = (e) => Math.round(e * 4) / 4,
    ge = () => ({ sph: null, cyl: null, axis: null }),
    Re = (e, t) => Math.min(Math.abs(e - t), 180 - Math.abs(e - t)),
    te = (e) =>
      Object.fromEntries(
        Object.entries(e).map(([t, n]) => [t, n === null ? NaN : n]),
      ),
    q = (e) => (e === !0 || e === 1 ? !0 : e === !1 || e === 0 ? !1 : null);
  function Qe(e, t, n = Ze) {
    var u, s, f, p, h, y, x;
    let r = (u = e.context) != null ? u : {},
      i =
        (s = r[`${t}Quality`]) != null
          ? s
          : e[`quality${t === "right" ? "Right" : "Left"}`],
      a,
      o;
    if (A(i) && i >= 0 && i <= 10)
      ((a = ne(
        (i - n.qualityFloor) / (n.qualityCeiling - n.qualityFloor),
        0,
        1,
      )),
        (o = "recorded quality"));
    else {
      let M = (f = r[`${t}Accurate`]) != null ? f : r.accurate;
      ((a = M === !0 ? 1 : M === !1 ? 0 : n.unknownQuality),
        (o =
          M === !0 || M === !1 ? "accuracy flag fallback" : "quality missing"));
    }
    let c = q((p = r.precise) != null ? p : e.precise),
      d = q((h = r.calm) != null ? h : e.calm),
      m = q((y = r.health) != null ? y : e.health),
      N = q((x = r.repeat) != null ? x : e.repeat),
      S = e.age === "" || e.age == null ? NaN : Number(e.age),
      l =
        (d === !0 ? n.calmBonus : 0) -
        (m === !0 ? n.frailtyPenalty : 0) -
        (A(S) && S >= 65 ? n.olderPenalty : 0) +
        (n.repeatEnabled
          ? N === !0
            ? n.returningBonus
            : N === !1
              ? -n.newPatientPenalty
              : 0
          : 0),
      E = ne(
        n.basePull +
          a * n.qualityPull -
          (c === !0 ? n.preciseResistance : 0) +
          l,
        0,
        1,
      );
    return {
      rawQuality: A(i) ? i : null,
      quality: a,
      basis: o,
      precise: c,
      calm: d,
      health: m,
      repeat: N,
      age: S,
      modifier: l,
      pull: E,
    };
  }
  function Ke(e, t) {
    var n, r, i, a;
    return !A(e.sph) || !A(t.sph)
      ? !1
      : Math.abs(e.sph - t.sph) >= L.discordantSphere ||
          Math.abs(
            ((n = e.cyl) != null ? n : 0) - ((r = t.cyl) != null ? r : 0),
          ) >= L.discordantCylinder ||
          (Math.min(
            Math.abs((i = e.cyl) != null ? i : 0),
            Math.abs((a = t.cyl) != null ? a : 0),
          ) >= 1 &&
            Re(e.axis, t.axis) >= L.discordantAxis);
  }
  function Je(e, t, n, r, i, a, o = {}) {
    var m, N, S, l, E, u, s, f, p, h, y;
    if (!A(t.sph)) return (a.push("W3_NO_OBJECTIVE"), { ...e });
    if (!A(e.sph))
      return (
        a.push("W4_NO_ANCHOR"),
        n.precise !== !0
          ? { ...t, sph: T(t.sph), cyl: t.cyl === null ? null : T(t.cyl) }
          : ee(te(e), te(t), !1, !0, n.quality > 0, {
              ...o,
              sphere: { objectiveBias: i.firstSphereBias, ...o.sphere },
              cylinder: {
                objectiveReduction: i.firstCylinderReduction,
                ...o.cylinder,
              },
            })
      );
    if (r.vaGood === !0) return (a.push("W5_GOOD_VA"), { ...e });
    if (n.quality <= 0) return (a.push("W6_LOW_CONFIDENCE"), { ...e });
    a.push("W7_WEIGHTED_COMPONENTS");
    let c = ee(te(e), te(t), !1, n.precise === !0, !0, {
        ...o,
        confidence: {
          ...o.confidence,
          objectiveAccurate:
            ((N = (m = o.confidence) == null ? void 0 : m.objectiveAccurate) !=
            null
              ? N
              : i.cylinderSignalScale) *
              n.quality +
            n.modifier,
          currentPrecise:
            (l = (S = o.confidence) == null ? void 0 : S.currentPrecise) != null
              ? l
              : i.cylinderPreciseResistance,
        },
        sphere: { maxStep: n.precise === !0 ? 0.25 : 0.5, ...o.sphere },
        cylinder: { quarterPull: i.cylinderQuarterPull, ...o.cylinder },
      }),
      d = t.sph - e.sph;
    if (Math.abs(d) <= i.smallChangeDeadband)
      ((c.sph = e.sph), a.push("W8_SMALL_SPHERE"));
    else if (Math.abs(d) >= i.largeChangeStart) {
      let x = ne((n.pull + i.largeChangeBonus) * n.quality, 0, 1),
        M = n.age < 40 || n.precise !== !0 ? 0.5 : 0.25,
        K = Math.min(
          i.maxSphereStep,
          M + Math.max(0, Math.abs(d) - i.largeChangeStart) * i.largeStepRamp,
        ),
        b =
          (u = (E = o.sphere) == null ? void 0 : E.maxStep) != null
            ? u
            : Math.max(Math.abs(e.sph), Math.abs(t.sph)) >= L.highSphere
              ? i.highSphereStep
              : K,
        O = Math.min(Math.abs(d), b, T(Math.abs(d) * x));
      ((c.sph = T(e.sph + Math.sign(d) * O)), a.push("W9_LARGE_SPHERE"));
    } else if (n.age < 40 && Math.abs(d) >= 0.5) {
      let x =
        (f = (s = o.sphere) == null ? void 0 : s.maxStep) != null
          ? f
          : Math.max(Math.abs(e.sph), Math.abs(t.sph)) >= L.highSphere
            ? i.highSphereStep
            : 0.5;
      ((c.sph = T(
        e.sph +
          Math.sign(d) *
            Math.min(
              x,
              T(Math.abs(d) * 0.5 * n.quality * ne(1 + n.modifier, 0, 1.2)),
            ),
      )),
        a.push("W10_YOUNGER_SPHERE"));
    }
    return (
      n.age < 40 &&
        e.cyl === null &&
        Math.abs((p = t.cyl) != null ? p : 0) >= 0.5 &&
        c.cyl === null &&
        ((c.cyl = -0.25),
        (c.axis = Math.round(t.axis / 5) * 5 || 180),
        a.push("W11_YOUNGER_CYLINDER")),
      Math.abs((h = e.cyl) != null ? h : 0) >= L.highCylinder &&
        Math.abs(((y = c.cyl) != null ? y : 0) - e.cyl) < 0.001 &&
        A(t.axis) &&
        Re(e.axis, t.axis) <= L.smallAxisGap &&
        ((c.axis = e.axis), a.push("W12_HIGH_CYLINDER_AXIS")),
      c
    );
  }
  function et(e, t = {}) {
    var f, p, h;
    let n = { ...Ze, ...t },
      r = (f = e.context) != null ? f : {},
      i = { right: ["W0_VALIDATE"], left: ["W0_VALIDATE"], add: [] },
      a = [],
      o = [
        "currentRightEye",
        "currentLeftEye",
        "objectiveRightEye",
        "objectiveLeftEye",
      ].map((y) => Xe(e[y]));
    if (o.some((y) => y === null))
      return {
        rightEye: ge(),
        leftEye: ge(),
        readingAdd: null,
        trace: i,
        review: ["Invalid non-zero cylinder axis."],
      };
    let [c, d, m, N] = o,
      S = Ke(c, m) || Ke(d, N);
    if (r.simple === !0) {
      let y = (x) => {
        var M;
        return A(x.sph)
          ? {
              sph: T(x.sph + ((M = x.cyl) != null ? M : 0) / 2),
              cyl: null,
              axis: null,
            }
          : ge();
      };
      (([c, d, m, N] = [c, d, m, N].map(y)),
        i.right.push("W2_SIMPLE"),
        i.left.push("W2_SIMPLE"));
    }
    let l = { right: Qe(e, "right", n), left: Qe(e, "left", n) },
      E,
      u;
    S
      ? ((E = { ...c }),
        (u = { ...d }),
        i.right.push("W1_LARGE_DISCREPANCY"),
        i.left.push("W1_LARGE_DISCREPANCY"),
        a.push(
          "Large change: verify measurements before changing the current prescription.",
        ))
      : ((E = Je(c, m, l.right, r, n, i.right, e.config)),
        (u = Je(d, N, l.left, r, n, i.left, e.config)));
    let s = ye(
      e.age,
      q((p = r.health) != null ? p : e.health) === !0,
      e.currentAdd,
      e.objectiveAdd,
      e.config,
    );
    return (
      A(s) || (s = null),
      i.add.push(
        "WA_ADD",
        A(e.currentAdd)
          ? "RETAIN_ENTERED_ADD"
          : A(e.objectiveAdd)
            ? "MEASURED_ADD"
            : "AGE_ESTIMATE",
      ),
      !A(e.currentAdd) &&
        !A(e.objectiveAdd) &&
        s !== null &&
        q((h = r.health) != null ? h : e.health) === !0 &&
        i.add.push("FRAILTY_INCREMENT"),
      l.right.age < 18 &&
        a.push(
          "Child: confirm the refraction and clinical context before prescribing.",
        ),
      (l.right.quality < 1 || l.left.quality < 1) &&
        a.push("Unconfirmed measurement: provisional suggestion only."),
      ((!A(c.sph) && A(m.sph)) || (!A(d.sph) && A(N.sph))) &&
        a.push(
          "No current prescription recorded: provisional suggestion without an established prescription anchor.",
        ),
      {
        rightEye: E,
        leftEye: u,
        readingAdd: s,
        trace: i,
        review: a,
        confidence: l,
      }
    );
  }
  function tt({
    age: e,
    context: t,
    currentRightEye: n,
    currentLeftEye: r,
    objectiveRightEye: i,
    objectiveLeftEye: a,
    currentAdd: o,
    objectiveAdd: c,
    config: d,
  }) {
    return et({
      age: e,
      context: t,
      currentRightEye: n,
      currentLeftEye: r,
      objectiveRightEye: i,
      objectiveLeftEye: a,
      currentAdd: o,
      objectiveAdd: c,
      config: d,
    });
  }
  function Ee(e, t) {
    return e.toFixed(t);
  }
  var H = "+",
    F = "-";
  function ie(e) {
    return ((e == null ? void 0 : e.placeholder) || "").trim().toLowerCase();
  }
  function xe(e) {
    return ((e == null ? void 0 : e.id) || "").trim().toLowerCase();
  }
  function w(e) {
    return parseFloat(e.getAttribute("step")) || 0.25;
  }
  function Ae(e) {
    let t = ie(e),
      n = xe(e);
    return t === "axis" || n.includes("axis");
  }
  function Se(e) {
    return xe(e) === "age";
  }
  function Me(e) {
    let t = ie(e),
      n = xe(e);
    return t === "add" || n.includes("add");
  }
  function Ie(e) {
    return ie(e) === "cyl";
  }
  function _e(e) {
    return ie(e) === "sph";
  }
  function I(e, t) {
    let n = parseFloat(e) || 0,
      r = Math.round(n / t) * t;
    return t < 1 ? r.toFixed(2) : String(Math.round(r));
  }
  function Ce(e) {
    return e.closest(".results-section")
      ? "1.5px solid #2c3038"
      : "1.5px solid var(--input-border)";
  }
  function nn(e) {
    var t;
    return (t = e == null ? void 0 : e.closest(".spinner-container")) != null
      ? t
      : null;
  }
  function nt(e) {
    return ((e == null ? void 0 : e.getAttribute("placeholder")) || "").trim();
  }
  function g(e) {
    let t = nn(e),
      n = nt(e);
    !t ||
      !n ||
      (t.classList.add("has-visual-placeholder"),
      (t.dataset.placeholder = n),
      (t.dataset.empty = e.value.trim() === "" ? "true" : "false"));
  }
  function it(e) {
    nt(e) &&
      (g(e),
      e.addEventListener("input", () => {
        g(e);
      }),
      e.addEventListener("change", () => {
        g(e);
      }));
  }
  var st = ".field-sign";
  function at(e) {
    return typeof HTMLElement != "undefined" && e instanceof HTMLElement;
  }
  function Le(e, t) {
    t && e.dispatchEvent(new Event("change"));
  }
  function re(e) {
    return typeof e == "string" ? document.getElementById(e) : at(e) ? e : null;
  }
  function Fe(e) {
    var n;
    if (at(e) && e.classList.contains("spinner-container")) return e;
    let t = re(e);
    return (n = t == null ? void 0 : t.closest(".spinner-container")) != null
      ? n
      : null;
  }
  function ot(e) {
    return e === F || e === H ? e : "";
  }
  function rn(e) {
    let t = Fe(e);
    if (!t) return null;
    let n = t.querySelector(st);
    return (
      n ||
      ((n = document.createElement("span")),
      n.classList.add("field-sign"),
      n.setAttribute("aria-hidden", "true"),
      t.insertBefore(n, t.firstChild),
      n)
    );
  }
  function sn(e) {
    let t = Fe(e);
    return ot((t == null ? void 0 : t.dataset.sign) || "");
  }
  function rt(e, t) {
    let n = Fe(e);
    if (!n) return;
    let r = ot(t),
      i = n.querySelector(st);
    (r
      ? ((n.dataset.sign = r), (i = i != null ? i : rn(n)))
      : delete n.dataset.sign,
      i && (i.textContent = r));
  }
  function lt(e, t, n = {}) {
    let { unsigned: r = !1 } = n;
    if (r || t === null || Number.isNaN(t) || t === 0) {
      rt(e, "");
      return;
    }
    rt(e, t > 0 ? H : F);
  }
  function an(e, t = {}) {
    let { unsigned: n = !1 } = t,
      r = re(e);
    if (!r || !r.value.trim()) return Number.NaN;
    let i = parseFloat(r.value);
    return Number.isNaN(i) || n ? i : i * (sn(r) === F ? -1 : 1);
  }
  function on(e, t = {}) {
    let { dispatch: n = !0, unsigned: r = !1 } = t,
      i = re(e);
    i && ((i.value = ""), lt(i, 0, { unsigned: r }), g(i), Le(i, n));
  }
  function ct(e, t, n = {}) {
    let { dispatch: r = !0, step: i, unsigned: a = !1, formatMagnitude: o } = n,
      c = re(e);
    if (!c) return;
    if (t === null || Number.isNaN(t)) {
      on(c, { dispatch: r, unsigned: a });
      return;
    }
    let d = typeof o == "function" ? o : (m) => I(m, i != null ? i : w(c));
    ((c.value = d(Math.abs(t))), lt(c, t, { unsigned: a }), g(c), Le(c, r));
  }
  function $(e) {
    return an(e);
  }
  function se(e, t, n = {}) {
    ct(e, t, n);
  }
  function k(e, t, n = 2) {
    ct(e, t, { dispatch: !1, formatMagnitude: (r) => Ee(r, n) });
  }
  function ut(e) {
    let t = document.getElementById(e),
      n = t == null ? void 0 : t.value.trim();
    return n ? parseFloat(n) : Number.NaN;
  }
  function dt(e, t, n = {}) {
    let { dispatch: r = !0 } = n,
      i = document.getElementById(e);
    i &&
      ((i.value = t === null || Number.isNaN(t) ? "" : String(Math.round(t))),
      g(i),
      Le(i, r));
  }
  var ve = ["current", "objective"],
    ft = ["re", "le"];
  function ln(e, t = be) {
    return e
      .map((n) => {
        let r = t.find((a) => a[0] === n),
          i = (r ? r[2] : n).trim();
        return /[.!?]$/.test(i) ? i : `${i}.`;
      })
      .join(" ");
  }
  function cn(e = document) {
    return JSON.stringify(
      [...e.querySelectorAll("main input:not([readonly]), main select")].map(
        (t) => {
          var n, r;
          return [
            t.id,
            t.value,
            !!t.checked,
            (r =
              (n = t.closest(".spinner-container")) == null
                ? void 0
                : n.dataset.sign) != null
              ? r
              : "",
          ];
        },
      ),
    );
  }
  function un(e = document) {
    let t = (i) => {
        var a;
        return !!((a = e.getElementById(i)) != null && a.checked);
      },
      n = (i) => {
        var o;
        let a = (o = e.getElementById(i)) == null ? void 0 : o.value;
        return a === "1" ? !0 : a === "0" ? !1 : null;
      },
      r = (i) => {
        var c;
        let a = (c = e.getElementById(i)) == null ? void 0 : c.value;
        if (a === "" || a === void 0 || a === null) return null;
        let o = Number(a);
        return Number.isInteger(o) && o >= 0 && o <= 10 ? o : null;
      };
    return {
      simple: !t("toggle-simple"),
      vaGood: t("toggle-va-good"),
      precise: t("toggle-precise"),
      accurate: t("toggle-accurate"),
      health: t("toggle-health"),
      repeat: n("context-repeat"),
      calm: n("context-calm"),
      rightQuality: r("quality-right"),
      leftQuality: r("quality-left"),
    };
  }
  function pt() {
    let e = new Map(),
      t = null;
    function n() {
      (r(), i(), N());
    }
    function r() {
      document.querySelectorAll("input, select").forEach((u) => {
        (u.tagName !== "SELECT" && u.addEventListener("input", N),
          u.addEventListener("change", N));
      });
    }
    function i() {
      let u = document.getElementById("transpose-btn");
      u &&
        u.addEventListener("click", () => {
          a();
        });
    }
    function a() {
      (ve.forEach((u) => {
        ft.forEach((s) => {
          o(u, s);
        });
      }),
        ve.forEach((u) => {
          c(u);
        }),
        N());
    }
    function o(u, s) {
      let f = m(u, s);
      if ([f.sph, f.cyl, f.axis].some((h) => Number.isNaN(h))) return;
      let p = Z(f);
      d(u, s, p);
    }
    function c(u) {
      let s = m(u, "re"),
        f = m(u, "le");
      if (Number.isNaN(s.cyl) || Number.isNaN(f.cyl) || s.cyl * f.cyl >= 0)
        return;
      let p = s.cyl > 0 ? Z(s) : s,
        h = f.cyl > 0 ? Z(f) : f;
      (d(u, "re", p), d(u, "le", h));
    }
    function d(u, s, f) {
      (se(`${u}-${s}-sph`, f.sph, { dispatch: !1 }),
        se(`${u}-${s}-cyl`, f.cyl, { dispatch: !1 }),
        dt(`${u}-${s}-axis`, f.axis, { dispatch: !1 }));
    }
    function m(u, s) {
      return {
        sph: $(`${u}-${s}-sph`),
        cyl: $(`${u}-${s}-cyl`),
        axis: ut(`${u}-${s}-axis`),
      };
    }
    function N() {
      var We, qe, He;
      let u = cn();
      if (u === t) return;
      t = u;
      let s = un(),
        f = document.getElementById("measurement-quality-state");
      f &&
        (f.textContent =
          s.rightQuality === null && s.leftQuality === null
            ? ""
            : `RE ${(We = s.rightQuality) != null ? We : "switch"} \xB7 LE ${(qe = s.leftQuality) != null ? qe : "switch"}`);
      let p = (G, pe) => {
          let U = m(G, pe);
          return s.simple ? { sph: U.sph, cyl: NaN, axis: NaN } : U;
        },
        h = p("current", "re"),
        y = p("current", "le"),
        x = p("objective", "re"),
        M = p("objective", "le"),
        K = (He = document.getElementById("age")) == null ? void 0 : He.value,
        b = tt({
          age: K,
          context: s,
          currentRightEye: h,
          currentLeftEye: y,
          objectiveRightEye: x,
          objectiveLeftEye: M,
          currentAdd: $("current-le-add"),
          objectiveAdd: $("objective-le-add"),
        });
      (k("output-re-sph", b.rightEye.sph),
        k("output-re-cyl", b.rightEye.cyl),
        k("output-le-sph", b.leftEye.sph),
        k("output-le-cyl", b.leftEye.cyl),
        k("output-le-add", b.readingAdd),
        S("output-re-axis", b.rightEye.axis),
        S("output-le-axis", b.leftEye.axis),
        l(b.rightEye.sph, b.leftEye.sph, s.precise));
      let O = [h, y, x, M].some((G) => Number.isFinite(G.sph)),
        J = document.getElementById("prescribing-review");
      J &&
        ((J.textContent = O ? b.review.join(" ") : ""),
        (J.hidden = !J.textContent));
      let Be = document.getElementById("prescribing-rules"),
        fe = document.getElementById("prescribing-rule-list");
      if (Be && fe) {
        ((Be.hidden = !O), fe.replaceChildren());
        for (let [G, pe] of Object.entries(b.trace)) {
          let U = document.createElement("p");
          ((U.textContent = `${G === "right" ? "RE" : G === "left" ? "LE" : "Add"}: ${ln(pe)}`),
            fe.append(U));
        }
      }
    }
    function S(u, s) {
      let f = document.getElementById(u);
      f &&
        ((f.value = s === null || Number.isNaN(s) ? "" : String(Math.round(s))),
        g(f));
    }
    function l(u, s, f) {
      let p = document.querySelectorAll(".results-section input[readonly]"),
        h = !f && he(u) && he(s);
      p.forEach((y) => {
        y.classList.toggle("orange-bg", h);
      });
    }
    function E(u) {
      (ve.forEach((s) => {
        ft.forEach((f) => {
          let p = `${s}-${f}`,
            h = m(s, f);
          if (u) {
            if (e.has(p)) {
              let y = e.get(p),
                x = Object.is(h.sph, y.projected) || h.sph === y.projected;
              (d(s, f, x ? y.rx : { sph: h.sph, cyl: NaN, axis: NaN }),
                e.delete(p));
            }
          } else {
            let y = Number.isFinite(h.sph)
              ? Math.round(
                  (h.sph + (Number.isFinite(h.cyl) ? h.cyl / 2 : 0)) * 4,
                ) / 4
              : NaN;
            (e.set(p, { rx: h, projected: y }),
              se(`${p}-sph`, y, { dispatch: !1 }));
          }
        });
      }),
        N());
    }
    return { init: n, recalcPrescription: N, changeEntryMode: E };
  }
  function ht() {
    let e = document.getElementById("info-icon"),
      t = document.getElementById("info-popup"),
      n = document.getElementById("close-popup"),
      r = document.getElementById("burger-icon"),
      i = document.getElementById("sideMenu"),
      a = document.getElementById("sidebar-backdrop"),
      o = document.querySelectorAll(".mcq-level-button"),
      c =
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      d = null,
      m = null;
    function N(s, f) {
      window.requestAnimationFrame(() => {
        var p;
        (p = f || (s == null ? void 0 : s.querySelector(c))) == null ||
          p.focus();
      });
    }
    function S(s) {
      s != null &&
        s.isConnected &&
        window.requestAnimationFrame(() => s.focus());
    }
    function l(s, f) {
      if (s.key !== "Tab" || !f) return;
      let p = [...f.querySelectorAll(c)].filter((x) => x.offsetParent !== null);
      if (!p.length) return;
      let h = p[0],
        y = p[p.length - 1];
      s.shiftKey && document.activeElement === h
        ? (s.preventDefault(), y.focus())
        : !s.shiftKey &&
          document.activeElement === y &&
          (s.preventDefault(), h.focus());
    }
    function E(s) {
      t &&
        (t.classList.toggle("active", s),
        t.setAttribute("aria-hidden", String(!s)),
        e && e.setAttribute("aria-expanded", String(s)),
        s
          ? ((d = document.activeElement), N(t, n))
          : d && t.contains(document.activeElement) && (S(d), (d = null)));
    }
    function u(s) {
      if (!i || !a || !r) return;
      let f = i.contains(document.activeElement);
      (i.classList.toggle("open", s),
        i.setAttribute("aria-hidden", String(!s)),
        (i.inert = !s),
        a.classList.toggle("open", s),
        r.setAttribute("aria-expanded", String(s)),
        document.body.classList.toggle("menu-open", s),
        s
          ? ((m = document.activeElement), N(i))
          : m && f && (S(m), (m = null)));
    }
    (e == null ||
      e.addEventListener("click", (s) => {
        (s.stopPropagation(),
          u(!1),
          E(!(t != null && t.classList.contains("active"))));
      }),
      n == null ||
        n.addEventListener("click", (s) => {
          (s.stopPropagation(), E(!1));
        }),
      t == null ||
        t.addEventListener("click", (s) => {
          s.stopPropagation();
        }),
      r == null ||
        r.addEventListener("click", (s) => {
          (s.stopPropagation(),
            E(!1),
            u(!(i != null && i.classList.contains("open"))));
        }),
      i == null ||
        i.addEventListener("click", (s) => {
          s.stopPropagation();
        }),
      a == null ||
        a.addEventListener("click", () => {
          u(!1);
        }),
      o.forEach((s) => {
        s.addEventListener("click", () => {
          u(!1);
        });
      }),
      document.addEventListener("click", () => {
        E(!1);
      }),
      document.addEventListener("keydown", (s) => {
        (t != null && t.classList.contains("active")
          ? l(s, t)
          : i != null && i.classList.contains("open") && l(s, i),
          s.key === "Escape" && (E(!1), u(!1)));
      }),
      u(!1),
      E(!1));
  }
  function mt(e) {
    let t = e.parentElement;
    if (t != null && t.classList.contains("spinner-container")) return t;
    let n = document.createElement("div");
    return (
      n.classList.add("spinner-container"),
      e.parentNode.insertBefore(n, e),
      n.appendChild(e),
      n
    );
  }
  function yt(e) {
    let t = e.querySelector(".spinner-buttons");
    if (!t) {
      ((t = document.createElement("div")), t.classList.add("spinner-buttons"));
      let n = document.createElement("button");
      ((n.type = "button"),
        n.classList.add("spinner-btn", "spinner-up"),
        (n.textContent = "+"));
      let r = document.createElement("button");
      ((r.type = "button"),
        r.classList.add("spinner-btn", "spinner-down"),
        (r.textContent = "-"),
        t.appendChild(n),
        t.appendChild(r),
        e.appendChild(t));
    }
    return {
      container: t,
      upButton: t.querySelector(".spinner-up"),
      downButton: t.querySelector(".spinner-down"),
    };
  }
  function Nt(e) {
    e.addEventListener("keydown", (t) => {
      t.preventDefault();
    });
  }
  function gt(e) {
    let t = null;
    return function () {
      (document.querySelectorAll(".spinner-buttons").forEach((r) => {
        r !== e && (r.style.display = "none");
      }),
        (e.style.display = "flex"),
        t && window.clearTimeout(t),
        (t = window.setTimeout(() => {
          e.style.display = "none";
        }, 1500)));
    };
  }
  function bt(e, t, n) {
    (e.addEventListener("focusin", n),
      e.addEventListener("mousedown", n),
      e.addEventListener("touchstart", n),
      t.addEventListener("click", n));
  }
  var xt = ".field-sign";
  function At(e) {
    return typeof HTMLElement != "undefined" && e instanceof HTMLElement;
  }
  function St(e, t) {
    t && e.dispatchEvent(new Event("change"));
  }
  function ae(e) {
    return typeof e == "string" ? document.getElementById(e) : At(e) ? e : null;
  }
  function Pe(e) {
    var n;
    if (At(e) && e.classList.contains("spinner-container")) return e;
    let t = ae(e);
    return (n = t == null ? void 0 : t.closest(".spinner-container")) != null
      ? n
      : null;
  }
  function Mt(e) {
    return e === F || e === H ? e : "";
  }
  function Te(e) {
    let t = Pe(e);
    if (!t) return null;
    let n = t.querySelector(xt);
    return (
      n ||
      ((n = document.createElement("span")),
      n.classList.add("field-sign"),
      n.setAttribute("aria-hidden", "true"),
      t.insertBefore(n, t.firstChild),
      n)
    );
  }
  function fn(e) {
    let t = Pe(e);
    return Mt((t == null ? void 0 : t.dataset.sign) || "");
  }
  function Et(e, t) {
    let n = Pe(e);
    if (!n) return;
    let r = Mt(t),
      i = n.querySelector(xt);
    (r
      ? ((n.dataset.sign = r), (i = i != null ? i : Te(n)))
      : delete n.dataset.sign,
      i && (i.textContent = r));
  }
  function C(e, t, n = {}) {
    let { unsigned: r = !1 } = n;
    if (r || t === null || Number.isNaN(t) || t === 0) {
      Et(e, "");
      return;
    }
    Et(e, t > 0 ? H : F);
  }
  function oe(e, t = {}) {
    let { unsigned: n = !1 } = t,
      r = ae(e);
    if (!r || !r.value.trim()) return Number.NaN;
    let i = parseFloat(r.value);
    return Number.isNaN(i) || n ? i : i * (fn(r) === F ? -1 : 1);
  }
  function le(e, t = {}) {
    let { dispatch: n = !0, unsigned: r = !1 } = t,
      i = ae(e);
    i && ((i.value = ""), C(i, 0, { unsigned: r }), g(i), St(i, n));
  }
  function we(e, t, n = {}) {
    let { dispatch: r = !0, step: i, unsigned: a = !1, formatMagnitude: o } = n,
      c = ae(e);
    if (!c) return;
    if (t === null || Number.isNaN(t)) {
      le(c, { dispatch: r, unsigned: a });
      return;
    }
    let d = typeof o == "function" ? o : (m) => I(m, i != null ? i : w(c));
    ((c.value = d(Math.abs(t))), C(c, t, { unsigned: a }), g(c), St(c, r));
  }
  function Ge(e, t) {
    let n = parseFloat(e.value) || 0;
    if (t.isAxis || t.isAge) return n;
    let r = oe(e);
    return Number.isNaN(r) ? n : r;
  }
  function _t(e, t, n, r = {}) {
    we(e, n, { ...r, step: t.step, unsigned: t.isAxis || t.isAge });
  }
  function X(e, t) {
    return (((parseFloat(e.value) || 0) - 1 + t + 180) % 180) + 1;
  }
  function Q(e, t) {
    let n = parseFloat(e.value) || 0;
    return Math.max(1, Math.min(130, n + t));
  }
  function Ft(e, t, n, r) {
    let i = (a) => {
      (_t(e, t, a, { dispatch: !0 }), r());
    };
    if (t.isAxis) {
      (Y(
        n.upButton,
        () => {
          i(X(e, 1));
        },
        () => {
          i(X(e, 5));
        },
      ),
        Y(
          n.downButton,
          () => {
            i(X(e, -1));
          },
          () => {
            i(X(e, -5));
          },
        ));
      return;
    }
    if (t.isAge) {
      (Y(
        n.upButton,
        () => {
          i(Q(e, 1));
        },
        () => {
          i(Q(e, 5));
        },
      ),
        Y(
          n.downButton,
          () => {
            i(Q(e, -1));
          },
          () => {
            i(Q(e, -5));
          },
        ));
      return;
    }
    (Y(n.upButton, () => {
      i(Ge(e, t) + t.step);
    }),
      Y(n.downButton, () => {
        let a = Ge(e, t) - t.step;
        (t.isAdd && a < 0 && (a = 0), i(a));
      }));
  }
  function Y(e, t, n = t) {
    let r = null,
      i = null,
      a = () => {
        (r && (window.clearTimeout(r), (r = null)),
          i && (window.clearInterval(i), (i = null)));
      },
      o = (c) => {
        (c.preventDefault(),
          t(),
          (r = window.setTimeout(() => {
            (n(), (i = window.setInterval(n, 100)));
          }, 500)));
      };
    (e.addEventListener("mousedown", o),
      e.addEventListener("touchstart", o),
      e.addEventListener("mouseup", a),
      e.addEventListener("mouseleave", a),
      e.addEventListener("touchend", a),
      e.addEventListener("touchcancel", a));
  }
  function vt(e) {
    return ((e == null ? void 0 : e.placeholder) || "").trim().toLowerCase();
  }
  function mn(e) {
    return ((e == null ? void 0 : e.id) || "").trim().toLowerCase();
  }
  function Pt(e) {
    let t = vt(e),
      n = mn(e);
    return t === "axis" || n.includes("axis");
  }
  function Tt(e) {
    return vt(e) === "cyl";
  }
  function Dt(e) {
    let t = document.getElementById("toggle-simple");
    t &&
      ((t.checked = !1),
      wt(t.checked),
      t.addEventListener("change", () => {
        (wt(t.checked), typeof e == "function" && e(t.checked));
      }));
  }
  function wt(e) {
    document.body.classList.toggle("advanced-mode", e);
    let t = document.getElementById("transpose-btn");
    (t && (t.disabled = !e),
      document.querySelectorAll('input[type="number"]').forEach((n) => {
        if (!Pt(n) && !Tt(n)) return;
        let r = n.closest(".spinner-container");
        r && (r.style.display = e ? "inline-flex" : "none");
      }));
  }
  function Ot(e) {
    return {
      step: w(e),
      isAxis: Ae(e),
      isAge: Se(e),
      isAdd: Me(e),
      isCylinder: Ie(e),
      isSphere: _e(e),
    };
  }
  function yn(e, t) {
    let n = parseFloat(e.value) || 0;
    if (t.isAxis || t.isAge) return n;
    let r = oe(e);
    return Number.isNaN(r) ? n : r;
  }
  function ue(e, t, n = {}) {
    le(e, { ...n, unsigned: t.isAxis || t.isAge });
  }
  function Gt(e, t) {
    let n = parseFloat(e.value) || 0;
    if (t.isAxis) {
      ((e.value = I(Math.max(1, Math.min(180, n)), t.step)),
        C(e, 0, { unsigned: !0 }),
        g(e));
      return;
    }
    if (t.isAge) {
      ((e.value = I(Math.max(1, Math.min(130, n)), t.step)),
        C(e, 0, { unsigned: !0 }),
        g(e));
      return;
    }
    if (t.isAdd) {
      if (n < 0.25) {
        ue(e, t);
        return;
      }
      ((e.value = I(n, t.step)), C(e, n), g(e));
      return;
    }
    let r = yn(e, t);
    ((e.value = I(Math.abs(r), t.step)), C(e, r), g(e));
  }
  function Vt(e, t, n) {
    C(e, n, { unsigned: t.isAxis || t.isAge });
  }
  function Wt(e, t) {
    let n = null,
      r = () => e.closest(".form-row");
    (e.addEventListener("blur", () => {
      (Gt(e, t),
        t.isCylinder && parseFloat(e.value) === 0 && i(),
        t.isAxis && Bt(r(), e),
        (t.isSphere || t.isCylinder || t.isAxis) && de(r()),
        Ve(r()));
    }),
      t.isCylinder &&
        e.addEventListener("input", () => {
          (parseFloat(e.value) === 0 ? i() : n && window.clearTimeout(n),
            de(r()),
            Ve(r()));
        }),
      t.isAxis &&
        e.addEventListener("input", () => {
          (Bt(r(), e), de(r()), Ve(r()));
        }),
      t.isAdd &&
        e.addEventListener("input", () => {
          (parseFloat(e.value) || 0) < 0.25 && ue(e, t);
        }),
      t.isSphere &&
        e.addEventListener("blur", () => {
          de(r());
        }));
    function i() {
      (n && window.clearTimeout(n),
        (n = window.setTimeout(() => {
          parseFloat(e.value) === 0 && gn(r(), e, t);
        }, 1e3)));
    }
  }
  function Bt(e, t) {
    if (!e || !t) return;
    let n = D(e, "cyl");
    qt(n) || ((t.value = ""), g(t), t.dispatchEvent(new Event("change")));
  }
  function gn(e, t, n) {
    ue(t, n, { dispatch: !1 });
    let r = D(e, "axis");
    (r &&
      ((r.value = ""),
      (r.style.border = Ce(r)),
      g(r),
      r.dispatchEvent(new Event("change"))),
      t.dispatchEvent(new Event("change")));
  }
  function Ve(e) {
    if (!e) return;
    let t = D(e, "cyl"),
      n = D(e, "axis");
    if (!t || !n) return;
    let r = n.value.trim() !== "";
    n.style.border = qt(t) !== r ? "2px solid red" : Ce(n);
  }
  function de(e) {
    if (!e) return;
    let t = D(e, "sph"),
      n = D(e, "cyl"),
      r = D(e, "axis");
    !t ||
      !n ||
      !r ||
      (t.value.trim() === "" &&
        n.value.trim() !== "" &&
        r.value.trim() !== "" &&
        ((t.value = "0.00"), g(t), t.dispatchEvent(new Event("change"))));
  }
  function qt(e) {
    return !!(e != null && e.value.trim()) && parseFloat(e.value) >= 0.25;
  }
  function D(e, t) {
    return e.querySelector(`input[placeholder="${t}"]`);
  }
  function Ht(e = {}) {
    let { onModeChange: t } = e,
      n = document.querySelectorAll('input[type="number"]:not([readonly])'),
      r = document.querySelectorAll('input[type="number"]');
    (n.forEach((i) => {
      bn(i);
    }),
      r.forEach((i) => {
        it(i);
      }),
      Dt(t));
  }
  function bn(e) {
    let t = Ot(e),
      n = mt(e),
      r = yt(n),
      i = gt(r.container);
    (!t.isAxis && !t.isAge && Te(e),
      Nt(e),
      Vt(e, t, 0),
      Ft(e, t, r, i),
      Wt(e, t),
      bt(n, r.container, i));
  }
  function kt({
    reload: e = () => window.location.reload(),
    timeoutMs: t = 5e3,
  } = {}) {
    let n = document.getElementById("new-case-button"),
      r = document.getElementById("new-case-status");
    if (!n || !r) return null;
    let i = null;
    function a() {
      (window.clearTimeout(i),
        (n.dataset.armed = "false"),
        (n.textContent = "New case"),
        (r.textContent = ""));
    }
    return (
      n.addEventListener("click", () => {
        if (n.dataset.armed === "true") {
          (window.clearTimeout(i), e());
          return;
        }
        ((n.dataset.armed = "true"),
          (n.textContent = "Clear case?"),
          (r.textContent =
            "Press again to clear all entered prescription values and context."),
          (i = window.setTimeout(a, t)));
      }),
      { disarm: a }
    );
  }
  function Yt() {
    !("serviceWorker" in navigator) ||
      !/^https?:$/.test(window.location.protocol) ||
      window.addEventListener(
        "load",
        () =>
          navigator.serviceWorker
            .register("./service-worker.js")
            .catch(() => {}),
        { once: !0 },
      );
  }
  function En() {
    let e = pt();
    (Ht({ onModeChange: e.changeEntryMode }), e.init(), ht(), kt(), Yt());
  }
  document.addEventListener("DOMContentLoaded", En);
})();
