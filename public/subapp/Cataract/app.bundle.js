"use strict";
(() => {
  function r(e, t = document) {
    return t.querySelector(e);
  }
  function te(e, t = document) {
    return Array.from(t.querySelectorAll(e));
  }
  var rt = {
      incomplete_input: "",
      posterior_disease_first: "Assess posterior disease first.",
      retinal_same_day: "Same-day retinal assessment.",
      normal_reflex_very_poor_va_early: "Early specialist assessment.",
      normal_reflex_untestable_va_early: "Specialist assessment advised.",
      normal_reflex_reduced_va_recheck: "Check non-cataract causes.",
      normal_reflex_mild_review: "Review vision and other causes.",
      normal_reflex_no_referral: "No cataract referral now.",
      normal_reflex_non_cataract_reframe: "Check non-cataract causes.",
      cataract_priority_white: "Prompt cataract assessment.",
      white_reflex_prompt_review: "Prompt eye assessment.",
      white_reflex_recheck: "Confirm white reflex promptly.",
      cataract_poor_view_assessment: "Further eye assessment needed.",
      cataract_routine: "Cataract assessment advised.",
      cataract_priority_very_poor_va: "Prompt cataract assessment.",
      cataract_untestable_va_assess: "Assess before cataract referral.",
      cataract_early_referral_reduced_va: "Early cataract assessment.",
      cataract_early_review_mild_va: "Cataract assessment advised.",
      cataract_early_review_va_6_6: "Review if function affected.",
      child_cataract_prompt_referral: "Paediatric eye review.",
      child_white_reflex_urgent: "Urgent paediatric eye review.",
      child_reduced_vision_early_assessment: "Early paediatric eye review.",
      rapd_non_cataract_first: "Check retinal or nerve cause.",
      recheck_investigate_first: "Re-check key findings.",
      complete_missing_checks: "Complete missing checks.",
      urgent_same_day_investigation: "Same-day eye assessment.",
    },
    Te = {
      fix_follow_with_non_child_age: "Re-check age or VA method.",
      normal_reflex_with_reduced_va: "Reduced VA needs another cause.",
      white_reflex_with_relatively_good_va: "VA and white reflex mismatch.",
      abnormal_reflex_with_va_6_6: "VA and reflex mismatch.",
      near_poor_with_good_distance: "Re-check near VA or refraction.",
      near_good_with_poor_distance: "Re-check VA method or refraction.",
      sudden_onset_with_cataract_pattern: "Sudden loss suggests another cause.",
      pain_with_cataract_pattern: "Pain/redness suggests another cause.",
      normal_reflex_with_poor_back_view: "Reflex and back view mismatch.",
      pain_without_eye_count: "Record one or two eyes.",
    },
    st = {
      child_case_posterior_review:
        "Paediatric review after posterior assessment.",
      child_cataract_delay_risk: "Avoid delay: visual development risk.",
      child_reduced_vision_early_review: "Avoid delay: amblyopia risk.",
      child_white_reflex_causes: "Exclude other white-reflex causes.",
      age_unknown_caution: "Age affects urgency.",
      younger_age_secondary_causes:
        "Ask about trauma, steroids, diabetes and eye inflammation.",
      posterior_detached_same_day: "Same-day retinal assessment.",
      posterior_diabetic_first: "Retinal disease may limit outcome.",
      posterior_cupping_glaucoma: "Possible glaucoma: assess.",
      near_va_n8: "Near VA slightly reduced.",
      near_va_n12: "Near VA reduced.",
      near_va_n18: "Near VA poor.",
      near_va_n36: "Near VA very poor.",
      pupil_abnormal_review: "Abnormal pupil: prompt review.",
      front_abnormal_prognosis_limited: "Scar may limit visual outcome.",
      neuro_red_flags: "Possible retinal or nerve cause.",
      urgency_note_urgent: "Same-day eye assessment.",
      urgency_note_early: "Early review advised.",
      urgent_trigger_painful_one_or_sudden: "Sudden visual loss.",
      urgent_features_history_exam: "Urgent examination features.",
      assessment_incomplete_record_fields: "Complete missing checks.",
    },
    we = {
      posterior_detached_same_day: 0,
      posterior_diabetic_first: 1,
      posterior_cupping_glaucoma: 2,
      child_cataract_delay_risk: 3,
      child_white_reflex_causes: 4,
      child_reduced_vision_early_review: 5,
      child_case_posterior_review: 6,
      age_unknown_caution: 7,
      urgent_trigger_painful_one_or_sudden: 6,
      urgency_note_urgent: 7,
      fix_follow_with_non_child_age: 8,
      normal_reflex_with_reduced_va: 8,
      white_reflex_with_relatively_good_va: 8,
      abnormal_reflex_with_va_6_6: 8,
      near_poor_with_good_distance: 9,
      near_good_with_poor_distance: 9,
      sudden_onset_with_cataract_pattern: 8,
      pain_with_cataract_pattern: 8,
      normal_reflex_with_poor_back_view: 8,
      urgency_note_early: 9,
      pain_without_eye_count: 10,
      assessment_incomplete_record_fields: 10,
      neuro_red_flags: -2,
      pupil_abnormal_review: -1,
      front_abnormal_prognosis_limited: 13,
      younger_age_secondary_causes: 14,
      near_va_n8: 15,
      near_va_n12: 15,
      near_va_n18: 15,
      near_va_n36: 15,
      urgent_features_history_exam: 16,
    },
    Oe = {
      Nuclear:
        "<p>Nuclear: central lens opacity causing blur, usually age-related. Surgery usually helps.</p>",
      Cortical:
        "<p>Cortical: spoke-like peripheral opacities causing blur and glare. Surgery usually helps.</p>",
      Subcapsular:
        "<p>Subcapsular: posterior opacities causing glare and near blur. Surgery usually helps.</p>",
      Mature:
        "<p>Probable mature cataract: dense lens opacity with severe visual loss.</p>",
      "White reflex":
        "<p>White reflex: dense cataract or another cause. Prompt assessment is needed.</p>",
    },
    Me = {
      cupping:
        "<p>Disc cupping may indicate glaucoma. Confirm with appropriate assessment.</p>",
      diabetic: "<p>Retinal disease or scarring may limit visual outcome.</p>",
      "poor view":
        "<p>Poor view may have lens, retinal or vitreous causes.</p>",
      detached:
        "<p>Suspected retinal detachment needs same-day assessment.</p>",
    };
  function Ce(e) {
    return rt[e] || "";
  }
  function ye(e) {
    return st[e] || Te[e] || "";
  }
  function ot(e) {
    return (e || "").trim().toUpperCase();
  }
  var xe = { black: 0, green: 1, orange: 2, red: 3 },
    De = {
      observed: 0,
      definite: 0,
      probable: 1,
      possible_incomplete: 1.5,
      possible_pupil: 2,
      possible_competing: 3,
    },
    it = new Set([
      "cataract_routine",
      "cataract_early_review_va_6_6",
      "cataract_early_review_mild_va",
      "normal_reflex_mild_review",
      "normal_reflex_no_referral",
    ]),
    ct = { black: 0, green: 2, orange: 3, red: 3 },
    Ve = ["onset", "eyes", "age", "distanceVA", "fundal", "back"],
    lt = {
      pain: "pain/redness",
      pupil: "pupil",
      front: "front eye",
      afferent: "RAPD/light response",
    };
  function ce(e, t) {
    var _, h;
    let a = (_ = xe[e]) != null ? _ : 0;
    return ((h = xe[t]) != null ? h : a) > a ? t : e;
  }
  function dt(e) {
    return e === "normal"
      ? "Normal"
      : e === "white"
        ? "White reflex"
        : e === "dark"
          ? "Nuclear"
          : e === "patches"
            ? "Cortical"
            : e === "spots"
              ? "Subcapsular"
              : "";
  }
  function _t(e) {
    switch (e) {
      case "N8":
        return "near_va_n8";
      case "N12":
        return "near_va_n12";
      case "N18":
        return "near_va_n18";
      case "N36":
        return "near_va_n36";
      default:
        return "";
    }
  }
  function ut(e, t) {
    return e === "Nil"
      ? "Nil"
      : e === "White reflex"
        ? "White reflex"
        : t === "probable"
          ? `Probable ${e}`
          : t === "possible_pupil" || t === "possible_incomplete"
            ? `Possible ${e}`
            : t === "possible_competing"
              ? `Possible ${e}`
              : e;
  }
  function pt(e, t) {
    var _;
    let a = (_ = ct[t]) != null ? _ : 3,
      s = [...e];
    return (
      t === "red" && (s = s.filter((h) => !h.startsWith("near_va_"))),
      a <= 0 ? [] : s.slice(0, a)
    );
  }
  function ft(e) {
    return e.length <= 1
      ? e[0] || ""
      : e.length === 2
        ? `${e[0]} and ${e[1]}`
        : `${e.slice(0, -1).join(", ")} and ${e[e.length - 1]}`;
  }
  function mt(e) {
    let t = e.map((a) => lt[a]).filter(Boolean);
    return t.length === 0
      ? ye("assessment_incomplete_record_fields")
      : `Missing: ${ft(t)}.`;
  }
  function ht({
    onsetValue: e,
    eyes: t,
    painYes: a,
    normalizedNearVa: s,
    isPresbyopicAge: _,
    hasNonPaediatricAgeBand: h,
    hasFixFollowDistanceVa: f,
    hasAbnormalFundal: u,
    hasWhiteFundal: p,
    hasPosteriorPriorityDisease: v,
    hasPoorView: b,
    hasMildDistanceLoss: q,
    hasModerateDistanceLoss: L,
    hasSevereDistanceLoss: M,
    hasGoodDistanceVision: R,
    hasPainfulSuddenUnilateral: B,
  }) {
    let S = [],
      I = new Set();
    function A(N, D) {
      (S.push(N), D.forEach((J) => I.add(J)));
    }
    (h && f && A("fix_follow_with_non_child_age", ["distanceVA", "age"]),
      !u &&
        (L || M) &&
        A("normal_reflex_with_reduced_va", ["distanceVA", "fundal"]),
      p &&
        (R || q) &&
        A("white_reflex_with_relatively_good_va", ["distanceVA", "fundal"]));
    let $ = !!s,
      F = s === "N5" || s === "N8";
    ($ &&
      R &&
      (s === "N18" || s === "N36") &&
      !_ &&
      A("near_poor_with_good_distance", ["distanceVA", "near"]),
      $ &&
        F &&
        (M || L) &&
        A("near_good_with_poor_distance", ["distanceVA", "near"]),
      e === "sudden" &&
        u &&
        !v &&
        !B &&
        A("sudden_onset_with_cataract_pattern", ["onset"]),
      a && u && !v && !B && A("pain_with_cataract_pattern", ["pain", "fundal"]),
      !u && b && A("normal_reflex_with_poor_back_view", ["fundal", "back"]),
      a && !t && !v && A("pain_without_eye_count", ["eyes", "pain"]));
    let Y = {
        pain_without_eye_count: 0,
        fix_follow_with_non_child_age: 1,
        normal_reflex_with_reduced_va: 2,
        normal_reflex_with_poor_back_view: 3,
        white_reflex_with_relatively_good_va: 4,
        abnormal_reflex_with_va_6_6: 5,
        near_poor_with_good_distance: 6,
        near_good_with_poor_distance: 6,
        sudden_onset_with_cataract_pattern: 7,
        pain_with_cataract_pattern: 8,
      },
      G = [...S]
        .sort((N, D) => {
          var U, m;
          let J = (U = Y[N]) != null ? U : 99,
            Z = (m = Y[D]) != null ? m : 99;
          return J - Z;
        })
        .slice(0, 2);
    return {
      messages: G.map((N) => Te[N]).filter(Boolean),
      codes: S,
      displayCodes: G,
      fields: [...I],
    };
  }
  function gt(e) {
    return {
      hasResult: !1,
      actionCode: "incomplete_input",
      actionTextCode: "incomplete_input",
      severityRank: xe.black,
      flags: ["incomplete_input"],
      ruleTrace: ["input:incomplete"],
      missingFields: e,
      requiredInputKeys: Ve,
      cataractType: "",
      cataractPhenotype: "",
      cataractConfidenceLabel: "",
      actionText: "",
      actionNotes: [],
      actionNoteCodes: [],
      actionColour: "black",
      recheckFieldKeys: [],
      urgencyNote: "",
      urgencyNoteColour: "",
      explanations: { cataract: "", back: "" },
    };
  }
  function yt(e, t) {
    let a = Oe[e] || "",
      s = Me[t] || "";
    return { cataract: a, back: s };
  }
  function qe({
    onsetValue: e,
    ageBand: t,
    distanceVA: a,
    nearVAValue: s,
    eyes: _,
    painYes: h,
    painRecorded: f,
    pupilSelected: u,
    pupilRecorded: p,
    pupilAbnormal: v,
    frontPresent: b,
    frontRecorded: q,
    afferentConcern: L,
    afferentRecorded: M,
    rapdPresent: R,
    rapdRecorded: B,
    directionLightPoor: S,
    lightRecorded: I,
    fundalSelection: A,
    backSelection: $,
  }) {
    var Be;
    let F = [];
    if (
      (e || F.push("onset"),
      _ || F.push("eyes"),
      t || F.push("age"),
      a || F.push("distanceVA"),
      A || F.push("fundal"),
      $ || F.push("back"),
      F.length > 0)
    ) {
      let g = gt(F),
        V =
          $ === "detached"
            ? "retinal_same_day"
            : e === "sudden"
              ? "urgent_same_day_investigation"
              : ["baby", "child", "adolescent", "teenager"].includes(t) &&
                  A === "white"
                ? "child_white_reflex_urgent"
                : A === "white"
                  ? "white_reflex_prompt_review"
                  : "";
      V &&
        (Object.assign(g, {
          actionCode: V,
          actionTextCode: V,
          actionText: Ce(V),
          actionColour: "red",
          severityRank: 3,
        }),
        g.flags.push("urgent_signal"));
      let oe = typeof L == "boolean" ? L : !!R || !!S,
        ae = ["cupping", "diabetic"].includes($);
      if (!V && (h || v || b || oe || ae)) {
        let Ne = ae
          ? "posterior_disease_first"
          : oe
            ? "rapd_non_cataract_first"
            : "recheck_investigate_first";
        Object.assign(g, {
          actionCode: Ne,
          actionTextCode: Ne,
          actionText: Ce(Ne),
          actionColour: "orange",
          severityRank: 2,
        });
      }
      let ne = [];
      return (
        oe && ne.push("neuro_red_flags"),
        v && ne.push("pupil_abnormal_review"),
        h &&
          (ne.push("pain_with_cataract_pattern"),
          V || ne.push("urgency_note_early")),
        b && ne.push("front_abnormal_prognosis_limited"),
        ae &&
          ne.push(
            $ === "cupping"
              ? "posterior_cupping_glaucoma"
              : "posterior_diabetic_first",
          ),
        (g.actionNoteCodes = ne),
        (g.actionNotes = ne.map(ye).filter(Boolean)),
        ne.length &&
          g.ruleTrace.push("safety:recorded_concerns_incomplete_input"),
        g
      );
    }
    let j = t === "teenager" ? "adolescent" : t,
      Y = A === "white" && $ === "normal" ? "poor view" : $,
      ie = Y !== $,
      G = typeof f == "boolean" ? f : !0,
      N = !!v || (typeof p == "boolean" ? p : !0),
      D = typeof q == "boolean" ? q : !0,
      J =
        typeof M == "boolean"
          ? M
          : typeof B == "boolean" || typeof I == "boolean"
            ? !!B && !!I
            : !0,
      Z = typeof L == "boolean" ? L : !!R || !!S,
      U = [];
    (G || U.push("pain"),
      N || U.push("pupil"),
      D || U.push("front"),
      J || U.push("afferent"));
    let m = new Set(),
      o = ["input:complete"];
    ie &&
      (m.add("normalized_white_back_forced_poor_view"),
      o.push("input:normalized_white_back"));
    let P = "",
      X = "",
      W = dt(A),
      se = A === "white" ? "observed" : "definite",
      n = ["cupping", "diabetic", "detached"].includes(Y),
      d = A === "white",
      C = A !== "normal",
      w = Y === "poor view",
      Q = a === "unable_test",
      z = a === "fix_follow_good" || a === "fix_follow_poor",
      ee = a === "HM" || a === "6/60" || a === "fix_follow_poor" || Q,
      re = a === "6/36",
      i = a === "6/12",
      c = a === "fix_follow_good",
      l = a === "6/6",
      y = ["baby", "child", "adolescent"].includes(j),
      x = j === "unknown",
      T = !!j && !y && !x,
      le = ["middle_aged", "elderly", "very_elderly"].includes(j),
      ke = ["young_adult", "adult"].includes(j),
      he =
        d &&
        e === "gradual" &&
        T &&
        (a === "6/60" || a === "HM") &&
        G &&
        !h &&
        N &&
        !v &&
        D &&
        !b &&
        J &&
        !Z &&
        !n;
    (A === "normal"
      ? ((W = "Nil"), o.push("phenotype:normal_reflex"))
      : o.push("phenotype:abnormal_reflex"),
      he &&
        ((W = "Mature"),
        (se = "probable"),
        o.push("phenotype:probable_mature_pattern")));
    let k = "black",
      H = [],
      K = new Map();
    function E(g, V) {
      ((P = g), (X = g), V && (k = V));
    }
    function O(g) {
      g && !H.includes(g) && H.push(g);
    }
    if (n) {
      let g = Y === "detached" ? "red" : "orange";
      (E(Y === "detached" ? "retinal_same_day" : "posterior_disease_first", g),
        m.add("posterior_priority"),
        W !== "Nil" &&
          W !== "White reflex" &&
          ((se = "possible_competing"), m.add("competing_pathology")),
        g === "red" && m.add("urgent_signal"),
        o.push("core:posterior_override"));
    } else
      C
        ? (o.push("core:abnormal_reflex_pathway"),
          d
            ? (E(
                he ? "cataract_priority_white" : "white_reflex_prompt_review",
                "red",
              ),
              m.add("urgent_signal"),
              o.push("reflex:white"))
            : w
              ? (E("cataract_poor_view_assessment", "orange"),
                o.push("reflex:poor_view"))
              : (E("cataract_routine", "green"),
                o.push("reflex:non_white_abnormal")),
          d ||
            (Q
              ? (E("cataract_untestable_va_assess", "orange"),
                o.push("va:untestable"))
              : ee
                ? (E("cataract_priority_very_poor_va", "orange"),
                  o.push("va:severe_loss"))
                : re && !w
                  ? (E("cataract_early_referral_reduced_va", "orange"),
                    o.push("va:moderate_loss"))
                  : i && !w
                    ? (E("cataract_early_review_mild_va", "orange"),
                      o.push("va:mild_loss"))
                    : l &&
                      !w &&
                      (E("cataract_early_review_va_6_6", "orange"),
                      o.push("va:good"))))
        : (o.push("core:normal_reflex_pathway"),
          Q
            ? (E("normal_reflex_untestable_va_early", "orange"),
              m.add("non_cataract_consideration"),
              o.push("va:untestable"))
            : ee
              ? (E("normal_reflex_very_poor_va_early", "orange"),
                m.add("non_cataract_consideration"),
                o.push("va:severe_loss"))
              : re
                ? (E("normal_reflex_reduced_va_recheck", "orange"),
                  m.add("non_cataract_consideration"),
                  o.push("va:moderate_loss"))
                : i
                  ? (E("normal_reflex_mild_review", "orange"),
                    o.push("va:mild_loss"))
                  : (E("normal_reflex_no_referral", "black"),
                    o.push("va:good")));
    let pe = ot(s);
    if (
      (y
        ? (m.add("age_child"),
          o.push("age:child"),
          n
            ? (O("child_case_posterior_review"),
              d &&
                (O("child_white_reflex_causes"),
                Y !== "detached" && E("child_white_reflex_urgent", "red")),
              o.push("age:child_posterior_note"))
            : C
              ? ((k = ce(k, d ? "red" : "orange")),
                P !== "urgent_same_day_investigation" &&
                  E(
                    d
                      ? "child_white_reflex_urgent"
                      : "child_cataract_prompt_referral",
                    k,
                  ),
                O(
                  d ? "child_white_reflex_causes" : "child_cataract_delay_risk",
                ),
                o.push("age:child_cataract_adjustment"))
              : !l &&
                !c &&
                ((k = ce(k, "orange")),
                P !== "urgent_same_day_investigation" &&
                  E("child_reduced_vision_early_assessment", k),
                O("child_reduced_vision_early_review"),
                o.push("age:child_reduced_vision_adjustment")))
        : ke &&
          C &&
          !n &&
          (O("younger_age_secondary_causes"),
          m.add("age_younger_atypical"),
          o.push("age:younger_atypical_note")),
      x &&
        (C || !l) &&
        (O("age_unknown_caution"),
        m.add("age_unknown"),
        o.push("age:unknown_caution")),
      n &&
        (Y === "detached"
          ? O("posterior_detached_same_day")
          : Y === "diabetic"
            ? O("posterior_diabetic_first")
            : Y === "cupping" && O("posterior_cupping_glaucoma")),
      pe && pe !== "N5")
    ) {
      let g = _t(pe);
      g && (O(g), m.add("near_va_modifier"), o.push("near_va:modifier_added"));
    }
    function de(g) {
      var ae, ne;
      let V = (ae = De[se]) != null ? ae : 0;
      ((ne = De[g]) != null ? ne : V) > V && (se = g);
    }
    let ve = _ === "one" && e === "sudden" && !!h;
    (ve &&
      ((k = ce(k, "red")),
      m.add("urgent_signal"),
      m.add("painful_sudden_unilateral"),
      o.push("safety:painful_sudden_unilateral"),
      W !== "Nil" && (de("possible_competing"), m.add("competing_pathology"))),
      N
        ? v &&
          (O("pupil_abnormal_review"),
          (k = ce(k, "orange")),
          m.add("pupil_abnormal"),
          m.add("urgent_signal"),
          o.push("pupil:abnormal"),
          W !== "Nil" && de("possible_pupil"))
        : C &&
          W !== "Nil" &&
          (m.add("pupil_not_recorded"), o.push("pupil:not_recorded")),
      b &&
        (O("front_abnormal_prognosis_limited"),
        (k = ce(k, "orange")),
        m.add("front_abnormal"),
        o.push("front:abnormal")));
    let ge = Z;
    ge &&
      (O("neuro_red_flags"),
      (k = ce(k, "orange")),
      m.add("neuro_red_flags"),
      m.add("afferent_concern"),
      o.push("neuro:red_flags"),
      !n &&
        !d &&
        P !== "urgent_same_day_investigation" &&
        (E("rapd_non_cataract_first", k), o.push("neuro:main_action_override")),
      W !== "Nil" &&
        !n &&
        (de("possible_competing"),
        m.add("competing_pathology"),
        o.push("neuro:competing_confidence")));
    let fe = ht({
      onsetValue: e,
      eyes: _,
      painYes: h,
      normalizedNearVa: pe,
      isPresbyopicAge: le,
      hasNonPaediatricAgeBand: T,
      hasFixFollowDistanceVa: z,
      hasAbnormalFundal: C,
      hasWhiteFundal: d,
      hasPosteriorPriorityDisease: n,
      hasPoorView: w,
      hasMildDistanceLoss: i,
      hasModerateDistanceLoss: re,
      hasSevereDistanceLoss: ee,
      hasGoodDistanceVision: l,
      hasPainfulSuddenUnilateral: ve,
    });
    (fe.displayCodes.length > 0 &&
      (fe.displayCodes.forEach((g) => O(g)),
      (k = ce(k, "orange")),
      m.add("consistency_warning"),
      m.add("requires_recheck"),
      fe.codes.forEach((g) => m.add(`consistency:${g}`)),
      o.push("consistency:warnings_added")),
      fe.codes.includes("white_reflex_with_relatively_good_va") &&
        ["white_reflex_prompt_review", "cataract_priority_white"].includes(P) &&
        e === "gradual" &&
        !h &&
        !v &&
        !b &&
        !ge &&
        !y &&
        (E("white_reflex_recheck", "red"),
        m.add("white_relatively_good_va_recheck_override"),
        m.add("recheck_override"),
        o.push("consistency:white_relatively_good_va_override")));
    let Pe = new Set(fe.fields);
    if (U.length > 0) {
      (W !== "Nil" &&
        W !== "White reflex" &&
        (de("possible_incomplete"),
        o.push("phenotype:provisional_missing_checks")),
        m.add("incomplete_assessment"),
        U.forEach((V) => {
          m.add(`missing_assessment:${V}`);
        }),
        o.push("assessment:incomplete"),
        m.add("requires_recheck"),
        K.set("assessment_incomplete_record_fields", mt(U)),
        O("assessment_incomplete_record_fields"),
        U.forEach((V) => Pe.add(V)),
        o.push("assessment:note_added"));
      let g = [
        "posterior_disease_first",
        "rapd_non_cataract_first",
        "child_cataract_prompt_referral",
        "child_reduced_vision_early_assessment",
      ].includes(P);
      k !== "red" &&
        !g &&
        (E("complete_missing_checks", "orange"),
        o.push("assessment:main_action_override"));
    }
    let Ze = e === "sudden" || !!h || !!v || !!b || Z;
    m.has("requires_recheck") &&
      Ze &&
      it.has(P) &&
      (E("recheck_investigate_first", k),
      (k = ce(k, "orange")),
      m.add("recheck_override"),
      o.push("consistency:high_risk_override"));
    let _e = "",
      Ee = "",
      ue = "";
    (e === "sudden"
      ? ((_e = "urgency_note_urgent"),
        (Ee = ye(_e)),
        (ue = "red"),
        m.add("urgent_signal"),
        m.add("urgency_note"),
        o.push("urgency:urgent_note"))
      : h &&
        ((_e = "urgency_note_early"),
        (Ee = ye(_e)),
        (ue = "orange"),
        m.add("urgency_note"),
        o.push("urgency:early_note")),
      (ue === "orange" || ue === "red") &&
        ((k = ce(k, ue)), o.push("urgency:colour_escalation")),
      ue === "red" &&
        P !== "urgent_same_day_investigation" &&
        P !== "retinal_same_day" &&
        (E("urgent_same_day_investigation", "red"),
        m.add("urgent_main_action"),
        o.push("urgency:main_action_override")),
      P === "urgent_same_day_investigation" &&
        W !== "Nil" &&
        !n &&
        (de("possible_competing"),
        m.add("competing_pathology"),
        o.push("urgency:competing_confidence")),
      P === "normal_reflex_no_referral" &&
        k !== "black" &&
        ((X = "normal_reflex_non_cataract_reframe"),
        o.push("core:normal_reflex_non_cataract_reframe")),
      _e &&
        ue &&
        !(
          _e === "urgency_note_urgent" && P === "urgent_same_day_investigation"
        ) &&
        !H.includes(_e) &&
        (O(_e), o.push("urgency:note_added_to_checks")),
      P === "urgent_same_day_investigation" &&
        !H.includes("urgent_trigger_painful_one_or_sudden") &&
        (O("urgent_trigger_painful_one_or_sudden"),
        o.push("urgency:trigger_note_added")),
      k === "red" && m.add("urgent_signal"),
      H.sort((g, V) => {
        var oe, ae;
        return (
          ((oe = we[g]) != null ? oe : 99) - ((ae = we[V]) != null ? ae : 99)
        );
      }),
      P === "urgent_same_day_investigation" &&
        H.length === 0 &&
        O("urgent_features_history_exam"),
      H.sort((g, V) => {
        var oe, ae;
        return (
          ((oe = we[g]) != null ? oe : 99) - ((ae = we[V]) != null ? ae : 99)
        );
      }));
    let et = H.length;
    ((H = pt(H, k)),
      H.length < et &&
        (m.add("notes_trimmed"), o.push("notes:policy_trimmed")));
    let tt = Ce(X || P),
      at = H.map((g) => K.get(g) || ye(g)).filter(Boolean),
      nt = ut(W, se);
    return {
      hasResult: !0,
      actionCode: P,
      actionTextCode: X || P,
      severityRank: (Be = xe[k]) != null ? Be : xe.black,
      flags: [...m].sort(),
      ruleTrace: o,
      missingFields: [],
      requiredInputKeys: Ve,
      cataractType: nt,
      cataractPhenotype: W,
      cataractConfidenceLabel: se,
      actionText: tt,
      actionNotes: at,
      actionNoteCodes: H,
      actionColour: k,
      recheckFieldKeys: [...Pe],
      urgencyNote: Ee,
      urgencyNoteColour: ue,
      explanations: yt(W, Y),
    };
  }
  var be = {
    result: {
      cataractTypeLabel: "Cataract Type",
      nextStepLabel: "Next Step",
      checkLabel: "Check",
    },
    fundalHint: "Dilate pupils for best view",
    infoPopup: {
      intro:
        "Use this while examining the patient: you enter the history, VA, safety findings, fundal reflex and back-of-eye view. It suggests a cataract pattern and next step; it does not make a final diagnosis.",
      bullets: [
        "History + VA: onset, one or two eyes, age and affected or worse-eye VA.",
        "Safety checks: pain/redness, pupils, front eye and RAPD/light response.",
        "Reflex: Normal, Dull, Patches, Spots or Dense.",
        "Back: Normal, Cupped, DR/Scar, Detached or Poor view.",
        "Result: cataract type, next step and short re-checks.",
      ],
      outro:
        "Teaching aid, not final diagnosis. Look for non-cataract disease when features are atypical or urgent.",
    },
  };
  var Le = "#ccc",
    vt = {
      normal: "green",
      dark: "orange",
      patches: "orange",
      spots: "orange",
      white: "red",
    },
    $e = {
      normal: "green",
      detached: "red",
      cupping: "orange",
      diabetic: "orange",
      "poor view": "orange",
    },
    wt = 3,
    xt = new Set([
      "a",
      "an",
      "and",
      "are",
      "as",
      "at",
      "be",
      "before",
      "both",
      "by",
      "can",
      "consider",
      "for",
      "first",
      "from",
      "in",
      "is",
      "it",
      "key",
      "needed",
      "no",
      "not",
      "now",
      "of",
      "on",
      "or",
      "re",
      "review",
      "same",
      "step",
      "the",
      "to",
      "up",
      "with",
    ]);
  function We(e) {
    return String(e || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }
  function bt(e) {
    return String(e || "").trim();
  }
  function Ie(e) {
    let t = String(e || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(" ")
      .map((a) => a.trim())
      .filter((a) => a.length >= 3 && !xt.has(a));
    return new Set(t);
  }
  function kt(e, t, a) {
    let s = Ie(e),
      _ = a || Ie(t);
    if (s.size < 2 || _.size < 2) return !1;
    let h = 0;
    s.forEach((p) => {
      _.has(p) && (h += 1);
    });
    let f = h / s.size,
      u = h / _.size;
    return f >= 0.67 || (f >= 0.5 && u >= 0.5);
  }
  function Ct(e) {
    let t = Array.isArray(e.actionNotes) ? e.actionNotes : [];
    if (t.length === 0) return [];
    let a = We(e.actionText),
      s = Ie(e.actionText),
      _ = Array.isArray(e.actionNoteCodes) ? e.actionNoteCodes : [],
      h = [],
      f = new Set(),
      u = new Set();
    for (let p = 0; p < t.length; p += 1) {
      let v = t[p],
        b = _[p] || "",
        q = bt(v),
        L = We(q);
      if (
        L &&
        L !== a &&
        !kt(q, e.actionText, s) &&
        !(b && f.has(b)) &&
        !u.has(L) &&
        (b && f.add(b), u.add(L), h.push(q), h.length >= wt)
      )
        break;
    }
    return h;
  }
  function Ye() {
    let e = r("#cataractForm"),
      t = r("#fundal-section"),
      a = r("#back-section"),
      s = r("#result-section"),
      _ = r("#result"),
      h = r("#ageBand"),
      f = r("#distanceVA"),
      u = r("#distance-va-label"),
      p = te('#top-section input[name="onset"]'),
      v = te('#top-section input[name="eyes"]'),
      b = r("#pain-label"),
      q = r("#pupil-label"),
      L = r("#front-label"),
      M = r("#neuro-label"),
      R = r("#painStatus"),
      B = r("#pupilStatus"),
      S = r("#frontStatus"),
      I = r("#afferentStatus"),
      A = te(".fundal-btn"),
      $ = te(".back-btn"),
      F = te("#top-section input, #top-section select"),
      j = r("#nearVA"),
      Y = r("#fundal-lock-hint"),
      ie = r("#back-lock-hint"),
      G = r("#result-lock-hint"),
      N = r("#new-assessment-button"),
      D = r("#case-reset-status"),
      J = !1,
      Z = null;
    function U(i, c, l) {
      var x;
      (i.forEach((T) => {
        (T.classList.remove("selected"),
          (T.style.borderColor = Le),
          T.setAttribute("aria-pressed", "false"));
      }),
        c.classList.add("selected"));
      let y = (x = c.getAttribute("data-value")) == null ? void 0 : x.trim();
      ((c.style.borderColor = l[y] || Le),
        c.setAttribute("aria-pressed", "true"));
    }
    function m() {
      var x, T;
      let i = r('#top-section input[name="onset"]:checked'),
        c = (x = r("#distanceVA")) == null ? void 0 : x.value,
        l = r('#top-section input[name="eyes"]:checked'),
        y = (T = r("#ageBand")) == null ? void 0 : T.value;
      return !!(i && y !== "" && c !== "" && l);
    }
    function o() {
      var c;
      if (!u) return;
      let i =
        ((c = r('#top-section input[name="eyes"]:checked')) == null
          ? void 0
          : c.value) || "";
      u.textContent =
        i === "one" ? "Affected VA:" : i === "two" ? "Worse VA:" : "Eye VA:";
    }
    function P(i) {
      i.forEach((c) => {
        (c.classList.remove("selected"),
          (c.style.borderColor = Le),
          c.setAttribute("aria-pressed", "false"));
      });
    }
    function X(i, c, l, y = "") {
      i &&
        (i.classList.toggle("disabled", c),
        i.setAttribute("aria-disabled", c ? "true" : "false"),
        te("button, input, select, textarea", i).forEach((x) => {
          "disabled" in x && (x.disabled = c);
        }),
        l && ((l.textContent = c ? y : ""), (l.hidden = !c)));
    }
    function W() {
      let i = te('#top-section input[type="radio"]');
      i.length !== 0 &&
        i.forEach((c) => {
          let l = () => {
            c.dataset.wasChecked = c.checked ? "1" : "0";
          };
          (c.addEventListener("pointerdown", l),
            c.addEventListener("mousedown", l),
            c.addEventListener(
              "touchstart",
              () => {
                l();
              },
              { passive: !0 },
            ));
          let y = c.closest("label");
          (y &&
            (y.addEventListener("pointerdown", l),
            y.addEventListener("mousedown", l),
            y.addEventListener(
              "touchstart",
              () => {
                l();
              },
              { passive: !0 },
            )),
            c.addEventListener("keydown", (x) => {
              (x.key === " " || x.key === "Spacebar" || x.key === "Enter") &&
                c.checked &&
                (c.dataset.wasChecked = "1");
            }),
            c.addEventListener("click", (x) => {
              let T = c.dataset.wasChecked === "1";
              ((c.dataset.wasChecked = "0"),
                T &&
                  (x.stopPropagation(),
                  window.requestAnimationFrame(() => {
                    ((c.checked = !1),
                      c.dispatchEvent(new Event("change", { bubbles: !0 })));
                  })));
            }));
        });
    }
    function se() {
      let i = t == null ? void 0 : t.querySelector("h2");
      if (!i || i.querySelector("#fundal-message")) return;
      let l = document.createElement("span");
      ((l.textContent = be.fundalHint),
        (l.style.color = "black"),
        (l.style.fontSize = "14px"),
        (l.style.marginLeft = "20px"),
        (l.style.display = "inline-block"),
        (l.id = "fundal-message"),
        (l.style.animation = "zoomAnimation 4s forwards"),
        i.appendChild(l),
        window.setTimeout(() => {
          l.remove();
        }, 4e3));
    }
    function n() {
      te(".recheck-flash").forEach((i) => {
        i.classList.remove("recheck-flash");
      });
    }
    function d(i) {
      if ((n(), !Array.isArray(i) || i.length === 0)) return;
      let c = {
          age: [h],
          distanceVA: [f],
          near: [j],
          fundal: [t],
          back: [a],
          onset: p.map((y) => y.parentElement),
          eyes: v.map((y) => y.parentElement),
          pain: [b, R],
          pupil: [q, B],
          front: [L, S],
          afferent: [M, I],
          rapd: [M, I],
          light: [M, I],
        },
        l = new Set();
      (i.forEach((y) => {
        (c[y] || []).forEach((T) => {
          T && l.add(T);
        });
      }),
        l.forEach((y) => {
          (y.classList.remove("recheck-flash"),
            y.offsetWidth,
            y.classList.add("recheck-flash"));
        }));
    }
    function C() {
      var pe, de, ve;
      let i = r('#top-section input[name="onset"]:checked');
      if (!_) return (_ && (_.innerHTML = ""), n(), !1);
      let c = r(".fundal-btn.selected"),
        l = r(".back-btn.selected"),
        y = (c == null ? void 0 : c.getAttribute("data-value")) || "",
        x = (l == null ? void 0 : l.getAttribute("data-value")) || "",
        T = r('#top-section input[name="eyes"]:checked'),
        le = T ? T.value : "",
        ke = (R == null ? void 0 : R.value) || "",
        he = (B == null ? void 0 : B.value) || "",
        k = (S == null ? void 0 : S.value) || "",
        H = (I == null ? void 0 : I.value) || "",
        K = qe({
          onsetValue: (i == null ? void 0 : i.value) || "",
          ageBand: ((pe = r("#ageBand")) == null ? void 0 : pe.value) || "",
          distanceVA:
            ((de = r("#distanceVA")) == null ? void 0 : de.value) || "",
          nearVAValue: ((ve = r("#nearVA")) == null ? void 0 : ve.value) || "",
          eyes: le,
          painYes: ke === "yes",
          painRecorded: !!ke,
          pupilSelected: !!he,
          pupilRecorded: !!he,
          pupilAbnormal: he === "abnormal",
          frontPresent: k === "present",
          frontRecorded: !!k,
          afferentConcern: H === "concern",
          afferentRecorded: !!H,
          fundalSelection: y,
          backSelection: x,
        });
      if (!K.hasResult)
        return (
          (_.innerHTML = K.actionText
            ? `<div class="result-detail-block"><p class="result-label">Not assessed</p><p class="action-text action-${K.actionColour}">${K.actionText}</p>${K.actionNotes.map((ge) => `<p class="action-note-line">${ge}</p>`).join("")}</div>`
            : ""),
          n(),
          !!K.actionText
        );
      let E = '<div class="result-summary result-summary--compact">';
      ((E += `
      <div class="result-card result-pattern">
        <p class="result-label">${be.result.cataractTypeLabel}</p>
        <p class="result-value">${K.cataractType}</p>
      </div>
    `),
        (E += `
      <div class="result-card result-action">
        <p class="result-label">${be.result.nextStepLabel}</p>
        <p class="result-value action-text action-${K.actionColour}">${K.actionText}</p>
      </div>
    `),
        (E += "</div>"));
      let O = Ct(K);
      if (O.length > 0) {
        let ge = O.map((fe) => `<p class="action-note-line">${fe}</p>`).join(
          "",
        );
        E += `
        <div class="result-detail-block result-note-block checks-${K.actionColour}">
          <p class="result-label">${be.result.checkLabel}</p>
          <div class="action-notes">${ge}</div>
        </div>
      `;
      }
      return ((_.innerHTML = E), d(K.recheckFieldKeys), !0);
    }
    function w() {
      var T;
      let i = !!(t != null && t.classList.contains("disabled"));
      (X(t, !1, Y), i && !J && (se(), (J = !0)));
      let c = r(".fundal-btn.selected");
      if (!c) {
        (P($),
          n(),
          X(a, !0, ie, "Select one fundal reflex to unlock."),
          X(s, !C(), G, "Select fundal reflex and back of eye."));
        return;
      }
      if (
        ((T = c.getAttribute("data-value")) == null ? void 0 : T.trim()) ===
        "white"
      ) {
        let le = r('.back-btn[data-value="poor view"]');
        (le && !r(".back-btn.selected") && U($, le, $e), X(a, !1, ie));
      } else X(a, !1, ie);
      if (C()) {
        X(s, !1, G);
        return;
      }
      let x = !!r(".back-btn.selected");
      X(
        s,
        !0,
        G,
        x
          ? "Complete required fields to show result."
          : "Select one back-of-eye finding.",
      );
    }
    function Q() {
      let i = r("#onset-sudden");
      if (i) {
        let l = i.parentElement;
        i.checked
          ? l == null || l.classList.add("serious")
          : l == null || l.classList.remove("serious");
      }
      [
        {
          select: R,
          label: b,
          concern: (R == null ? void 0 : R.value) === "yes",
          recorded: !!(R != null && R.value),
          className: "serious",
        },
        {
          select: B,
          label: q,
          concern: (B == null ? void 0 : B.value) === "abnormal",
          recorded: !!(B != null && B.value),
          className: "serious",
        },
        {
          select: S,
          label: L,
          concern: (S == null ? void 0 : S.value) === "present",
          recorded: !!(S != null && S.value),
          className: "warning",
        },
        {
          select: I,
          label: M,
          concern: (I == null ? void 0 : I.value) === "concern",
          recorded: !!(I != null && I.value),
          className: "serious",
        },
      ].forEach(
        ({ select: l, label: y, concern: x, recorded: T, className: le }) => {
          (l == null || l.classList.toggle("is-recorded-concern", x),
            l == null || l.classList.toggle("is-recorded-normal", T && !x),
            y == null || y.classList.toggle(le, x));
        },
      );
    }
    function z() {
      (Z !== null && (window.clearTimeout(Z), (Z = null)),
        N &&
          ((N.dataset.confirming = "false"),
          N.classList.remove("is-confirming"),
          (N.textContent = "New assessment")));
    }
    function ee() {
      N &&
        ((N.dataset.confirming = "true"),
        N.classList.add("is-confirming"),
        (N.textContent = "Clear assessment?"),
        D && (D.textContent = "Press again to clear the current assessment."),
        (Z = window.setTimeout(() => {
          (z(), D && (D.textContent = "Clear cancelled."));
        }, 1e4)));
    }
    function re() {
      (e == null || e.reset(),
        P(A),
        P($),
        F.forEach((i) => {
          delete i.dataset.wasChecked;
        }),
        (J = !1),
        (_.innerHTML = ""),
        n(),
        Q(),
        o(),
        w(),
        z(),
        D && (D.textContent = "Assessment cleared."));
    }
    (F.forEach((i) => {
      i.addEventListener("change", () => {
        (o(), Q(), w());
      });
    }),
      A.forEach((i) => {
        i.addEventListener("click", () => {
          (U(A, i, vt), w());
        });
      }),
      $.forEach((i) => {
        i.addEventListener("click", () => {
          (a != null && a.classList.contains("disabled")) || (U($, i, $e), w());
        });
      }),
      j && j.addEventListener("change", w),
      N == null ||
        N.addEventListener("click", () => {
          if (N.dataset.confirming === "true") {
            re();
            return;
          }
          ee();
        }),
      document.addEventListener("keydown", (i) => {
        i.key === "Escape" &&
          (N == null ? void 0 : N.dataset.confirming) === "true" &&
          (z(), D && (D.textContent = "Clear cancelled."));
      }),
      W(),
      o(),
      Q(),
      w());
  }
  var Ue = 500;
  function He() {
    let e,
      t = null,
      a = !1;
    function s(f) {
      let u = document.getElementById("image-popup");
      (u ||
        ((u = document.createElement("div")),
        (u.id = "image-popup"),
        (u.className = "image-preview-dialog"),
        u.setAttribute("role", "dialog"),
        u.setAttribute("aria-modal", "true"),
        u.setAttribute("aria-label", "Enlarged illustrative image"),
        (u.hidden = !0),
        u.addEventListener("contextmenu", (b) => {
          b.preventDefault();
        }),
        u.addEventListener("click", (b) => {
          b.target === u && _();
        }),
        document.body.appendChild(u)),
        (u.innerHTML = ""));
      let p = document.createElement("button");
      ((p.type = "button"),
        (p.className = "image-preview-close"),
        p.setAttribute("aria-label", "Close enlarged image"),
        (p.textContent = "\xD7"),
        p.addEventListener("click", _),
        u.appendChild(p));
      let v = f.querySelector("img");
      if (v) {
        let b = v.cloneNode(!0);
        ((b.draggable = !1),
          b.addEventListener("contextmenu", (q) => q.preventDefault()),
          (b.className = "image-preview-image"),
          u.appendChild(b),
          (u.hidden = !1),
          document.body.classList.add("modal-open"),
          (t = f),
          (a = !0),
          p.focus());
      }
    }
    function _() {
      clearTimeout(e);
      let f = document.getElementById("image-popup");
      (f &&
        !f.hidden &&
        ((f.hidden = !0),
        document.body.classList.remove("modal-open"),
        t == null || t.focus()),
        (t = null));
    }
    (te(".button-item button").forEach((f) => {
      (f.addEventListener("contextmenu", (u) => {
        u.preventDefault();
      }),
        f.addEventListener("mousedown", () => {
          e = setTimeout(() => s(f), Ue);
        }),
        f.addEventListener("mouseup", () => clearTimeout(e)),
        f.addEventListener("mouseleave", () => clearTimeout(e)),
        f.addEventListener(
          "touchstart",
          () => {
            e = setTimeout(() => s(f), Ue);
          },
          { passive: !0 },
        ),
        f.addEventListener("touchend", () => clearTimeout(e)),
        f.addEventListener("touchcancel", () => clearTimeout(e)),
        f.addEventListener(
          "click",
          (u) => {
            a && ((a = !1), u.preventDefault(), u.stopImmediatePropagation());
          },
          !0,
        ));
    }),
      document.addEventListener("keydown", (f) => {
        f.key === "Escape" && _();
      }));
  }
  var Ae = {
    result: {
      cataractTypeLabel: "Cataract Type",
      nextStepLabel: "Next Step",
      checkLabel: "Check",
    },
    fundalHint: "Dilate pupils for best view",
    infoPopup: {
      intro:
        "Use this while examining the patient: you enter the history, VA, safety findings, fundal reflex and back-of-eye view. It suggests a cataract pattern and next step; it does not make a final diagnosis.",
      bullets: [
        "History + VA: onset, one or two eyes, age and affected or worse-eye VA.",
        "Safety checks: pain/redness, pupils, front eye and RAPD/light response.",
        "Reflex: Normal, Dull, Patches, Spots or Dense.",
        "Back: Normal, Cupped, DR/Scar, Detached or Poor view.",
        "Result: cataract type, next step and short re-checks.",
      ],
      outro:
        "Teaching aid, not final diagnosis. Look for non-cataract disease when features are atypical or urgent.",
    },
  };
  function Fe() {
    let e = r("#info-icon"),
      t = r("#info-popup"),
      a = r("#info-close"),
      s = r("#sideMenu"),
      _ = r("#burger-icon"),
      h = !1;
    function f() {
      let p = r("#info-copy-intro"),
        v = r("#info-copy-outro"),
        b = [
          r("#info-copy-bullet-1"),
          r("#info-copy-bullet-2"),
          r("#info-copy-bullet-3"),
          r("#info-copy-bullet-4"),
          r("#info-copy-bullet-5"),
        ];
      (p && (p.textContent = Ae.infoPopup.intro),
        Ae.infoPopup.bullets.forEach((q, L) => {
          let M = b[L];
          M && (M.textContent = q);
        }),
        v && (v.textContent = Ae.infoPopup.outro));
    }
    function u(p, v = {}) {
      if (t) {
        if (
          (p &&
            s &&
            (s.classList.remove("open"),
            s.setAttribute("aria-hidden", "true"),
            s.setAttribute("inert", ""),
            _ && _.setAttribute("aria-expanded", "false")),
          (t.hidden = !p),
          e && e.setAttribute("aria-expanded", p ? "true" : "false"),
          p)
        ) {
          ((h = !0),
            window.requestAnimationFrame(() =>
              a == null ? void 0 : a.focus(),
            ));
          return;
        }
        h && v.restoreFocus !== !1
          ? ((h = !1), e == null || e.focus())
          : p || (h = !1);
      }
    }
    return (
      e &&
        t &&
        e.addEventListener("click", (p) => {
          (p.preventDefault(), p.stopPropagation(), u(t.hidden));
        }),
      a &&
        a.addEventListener("click", () => {
          u(!1);
        }),
      document.addEventListener("click", (p) => {
        if (!t || t.hidden) return;
        let v = t.contains(p.target),
          b = e && e.contains(p.target);
        !v && !b && u(!1);
      }),
      document.addEventListener("keydown", (p) => {
        p.key === "Escape" && u(!1);
      }),
      f(),
      { close: () => u(!1) }
    );
  }
  var Re = "cataract_mcq_progress_v1",
    Ge = {
      "nhs-adult-cataract-2025": {
        label: "NHS cataracts in adults",
        url: "https://www.nhs.uk/conditions/cataracts/",
        status: "current-authoritative",
      },
      "nhs-childhood-cataract": {
        label: "NHS childhood cataracts",
        url: "https://www.nhs.uk/conditions/childhood-cataracts/",
        status: "current-authoritative",
      },
      "cataract-app-scope-v1": {
        label: "Cataract app scope and recording contract",
        url: null,
        status: "internal-engineering-contract",
      },
      "cataract-app-triage-v1": {
        label: "Cataract app triage and referral wording",
        url: null,
        status: "pending-independent-clinical-sign-off",
      },
    },
    At = [
      {
        name: "Primary",
        totalQuestions: 5,
        passScore: 4,
        timeSeconds: 90,
        questions: [
          {
            prompt:
              "What is the safest interpretation of a white pupil reflex?",
            options: [
              "An abnormal sign needing eye assessment",
              "Proof of mature cataract",
              "Normal ageing",
              "No action if painless",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "If fundal reflex is normal and VA is 6/6, the most likely action is:",
            options: [
              "Urgent surgery",
              "Routine surgery",
              "No cataract referral needed",
              "Immediate retinal referral",
            ],
            answerIndex: 2,
          },
          {
            prompt: "Best first step before deciding cataract referral is to:",
            options: [
              "Only inspect lens colour",
              "Check history and vision carefully",
              "Skip back-of-eye check",
              "Refer everyone with blur",
            ],
            answerIndex: 1,
          },
          {
            prompt:
              "Which VA indicates the poorest distance vision in this tool?",
            options: ["6/12", "6/36", "6/60", "HM"],
            answerIndex: 3,
          },
          {
            prompt: "Pain/red eye with sudden one-eye loss should trigger:",
            options: [
              "Routine cataract pathway",
              "No action",
              "Urgent investigation for other pathology",
              "Yearly review only",
            ],
            answerIndex: 2,
          },
          {
            prompt:
              "Which history is least typical of simple age-related cataract?",
            options: [
              "Gradual painless blur",
              "Glare and faded colours",
              "Sudden painful loss",
              "Slowly worsening distance vision",
            ],
            answerIndex: 2,
          },
          {
            prompt: "What does the Back of Eye section check for?",
            options: [
              "Only lens colour",
              "Other disease behind the lens",
              "Phone brightness",
              "Age band only",
            ],
            answerIndex: 1,
          },
          {
            prompt: "A normal fundal reflex usually means the pupil glow is:",
            options: [
              "Bright and clear",
              "Always white",
              "Always black",
              "Hidden by default",
            ],
            answerIndex: 0,
          },
          {
            prompt: "Which choice is a Back of Eye finding in this app?",
            options: ["Spots", "Patches", "Cupped", "Dense"],
            answerIndex: 2,
          },
          {
            prompt: "Which choice is a Fundal Reflex finding in this app?",
            options: ["Detached", "DR/Scar", "Patches", "Cupped"],
            answerIndex: 2,
          },
          {
            prompt: "Why does the app ask for Dist VA?",
            options: [
              "To judge vision severity",
              "To change the title",
              "To unlock the menu",
              "To replace all examination",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "If the result asks for re-checks, the safest response is to:",
            options: [
              "Ignore them",
              "Re-check the highlighted findings",
              "Clear the browser",
              "Choose the fastest referral only",
            ],
            answerIndex: 1,
          },
        ],
      },
      {
        name: "Intermediate",
        totalQuestions: 5,
        passScore: 4,
        timeSeconds: 80,
        questions: [
          {
            prompt: "White reflex with a poor back view means:",
            options: [
              "Posterior disease cannot be excluded",
              "Dense cataract is confirmed",
              "No eye assessment is needed",
              "The retina is normal",
            ],
            answerIndex: 0,
          },
          {
            prompt: "Back-of-eye finding of detached retina should usually be:",
            options: [
              "Routine cataract surgery",
              "No referral",
              "Managed as non-cataract urgent retinal disease",
              "Observed yearly",
            ],
            answerIndex: 2,
          },
          {
            prompt: "Near VA deterioration (e.g. N18/N36) in this app:",
            options: [
              "Is ignored completely",
              "Adds context to referral wording",
              "Cancels distance VA",
              "Always means no cataract",
            ],
            answerIndex: 1,
          },
          {
            prompt: "Abnormal pupils in this workflow are treated as:",
            options: [
              "Simple cataract only",
              "Possible non-cataract pathology",
              "Always normal",
              "Not relevant to triage",
            ],
            answerIndex: 1,
          },
          {
            prompt: "Front-of-eye scar/distortion should lead to:",
            options: [
              "Guarded outcome warning",
              "Automatic discharge",
              "No change",
              "Primary care only",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "If the reflex is white and the fundus cannot be seen, the safest record is:",
            options: [
              "Poor view; posterior disease not excluded",
              "Normal back of eye",
              "Definite mature cataract only",
              "No further assessment required",
            ],
            answerIndex: 0,
          },
          {
            prompt: "A dense reflex with relatively good VA should make you:",
            options: [
              "Ignore the mismatch",
              "Re-check reflex and VA",
              "Always discharge",
              "Skip Back of Eye",
            ],
            answerIndex: 1,
          },
          {
            prompt: "Distance poor but near good usually means:",
            options: [
              "The result is automatically normal",
              "VA method or refraction should be re-checked",
              "Cataract is impossible",
              "Age band should be deleted",
            ],
            answerIndex: 1,
          },
          {
            prompt: "A normal reflex with very poor VA should prompt:",
            options: [
              "No further thought",
              "Early specialist review for another cause",
              "Routine cataract surgery only",
              "Ignore the back view",
            ],
            answerIndex: 1,
          },
          {
            prompt: "Deep cupping in Back of Eye points towards:",
            options: [
              "Glaucoma review first",
              "Mature cataract only",
              "Normal result",
              "Near-vision testing only",
            ],
            answerIndex: 0,
          },
          {
            prompt: "DR/Scar in Back of Eye means:",
            options: [
              "Retinal disease may limit cataract benefit",
              "The lens is definitely clear",
              "No referral can be needed",
              "The result must be green",
            ],
            answerIndex: 0,
          },
          {
            prompt: "A child with cataract-pattern signs should usually get:",
            options: [
              "Yearly adult review",
              "Prompt paediatric referral",
              "No action until age 18",
              "Reading glasses only",
            ],
            answerIndex: 1,
          },
        ],
      },
      {
        name: "Advanced",
        totalQuestions: 5,
        passScore: 4,
        timeSeconds: 75,
        questions: [
          {
            prompt: "Most safety-critical trap in cataract triage is:",
            options: [
              "Over-documenting history",
              "Assuming all blur is cataract",
              "Checking pupils",
              "Using fundal images",
            ],
            answerIndex: 1,
          },
          {
            prompt:
              "If back-of-eye shows diabetic/retinal pathology, cataract surgery in this app is:",
            options: [
              "Always urgent",
              "Usually not the primary immediate pathway",
              "Guaranteed to restore vision",
              "Always first-line",
            ],
            answerIndex: 1,
          },
          {
            prompt: "Sudden + painful visual loss should bias toward:",
            options: [
              "Elective cataract list",
              "Urgent diagnostic escalation",
              "Annual follow-up only",
              "Reassure and discharge",
            ],
            answerIndex: 1,
          },
          {
            prompt: "The main role of this tool is to:",
            options: [
              "Replace specialist diagnosis",
              "Support rapid triage and safe signposting",
              "Provide final surgical booking",
              "Assess refractive error only",
            ],
            answerIndex: 1,
          },
          {
            prompt: "Best interpretation of poor Back of Eye view is:",
            options: [
              "Definitely simple cataract only",
              "Needs further assessment for alternate pathology",
              "Always normal",
              "Ignore if near VA is good",
            ],
            answerIndex: 1,
          },
          {
            prompt:
              "When two findings conflict (e.g. cataract-like reflex but retinal red flags), priority should be:",
            options: [
              "The least severe interpretation",
              "Safety-first escalation for red flags",
              "Ignore retinal signs",
              "Wait 12 months",
            ],
            answerIndex: 1,
          },
          {
            prompt:
              "RAPD or poor light direction should make the app consider:",
            options: [
              "Optic nerve or retinal disease first",
              "Only routine cataract",
              "No vision problem",
              "Near VA only",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "Why does the engine keep posterior override ahead of cataract type?",
            options: [
              "Posterior disease can be urgent or vision-limiting",
              "It makes the MCQ shorter",
              "It hides all cataract signs",
              "It avoids taking history",
            ],
            answerIndex: 0,
          },
          {
            prompt: "Sudden painful white reflex is handled as:",
            options: [
              "Routine cataract only",
              "Urgent same-day investigation",
              "No cataract pathway",
              "Back section hidden forever",
            ],
            answerIndex: 1,
          },
          {
            prompt: "Which wording is safest for a red-flag result?",
            options: [
              "Urgent action, brief reason and next step",
              "A long differential with no action",
              "Definite cataract diagnosis",
              "Reassurance before referral",
            ],
            answerIndex: 0,
          },
          {
            prompt:
              "If abnormal reflex and VA 6/6 appear together, the app should:",
            options: [
              "Show a re-check warning",
              "Force urgent surgery",
              "Delete the reflex choice",
              "Ignore VA",
            ],
            answerIndex: 0,
          },
          {
            prompt: "A non-cataract-first pathway should avoid:",
            options: [
              "Over-stating cataract as the definite cause",
              "Mentioning safety",
              "Checking the back of eye",
              "Using plain language",
            ],
            answerIndex: 0,
          },
        ],
      },
    ],
    Et = {
      Primary: [
        "white-reflex",
        "routine",
        "assessment",
        "va",
        "acute-loss",
        "acute-loss",
        "posterior-view",
        "red-reflex",
        "posterior-view",
        "reflex-pattern",
        "va",
        "recheck",
      ],
      Intermediate: [
        "white-reflex",
        "retinal-red-flag",
        "near-va",
        "pupils",
        "cornea",
        "posterior-view",
        "recheck",
        "refraction",
        "posterior-view",
        "cupping",
        "retinal-comorbidity",
        "paediatric",
      ],
      Advanced: [
        "safety-scope",
        "retinal-comorbidity",
        "acute-loss",
        "safety-scope",
        "posterior-view",
        "retinal-red-flag",
        "rapd",
        "posterior-view",
        "acute-loss",
        "urgent-wording",
        "recheck",
        "safety-scope",
      ],
    },
    Nt = {
      "white-reflex": {
        explanation:
          "A white reflex is abnormal but does not prove mature cataract. Record the visual context and arrange eye assessment because posterior causes must not be missed.",
        source: "cataract-app-triage-v1",
      },
      routine: {
        explanation:
          "Cataract usually causes gradual visual difficulty. A normal reflex with good acuity does not by itself justify a cataract referral, though symptoms and daily function still matter.",
        source: "nhs-adult-cataract-2025",
      },
      assessment: {
        explanation:
          "History, visual acuity, anterior findings and the available posterior view must be considered together before choosing a pathway.",
        source: "cataract-app-scope-v1",
      },
      va: {
        explanation:
          "Visual acuity records functional severity and helps expose a mismatch between the reported vision and the observed reflex.",
        source: "cataract-app-scope-v1",
      },
      "acute-loss": {
        explanation:
          "Age-related cataract is usually gradual and painless. Sudden loss, pain or redness needs assessment for another cause rather than a routine cataract assumption.",
        source: "nhs-adult-cataract-2025",
      },
      "posterior-view": {
        explanation:
          "A limited or absent posterior view is a limitation, not a normal retinal finding. Cataract and posterior disease can coexist.",
        source: "cataract-app-triage-v1",
      },
      "red-reflex": {
        explanation:
          "A bright clear red reflex is the comparison pattern in this teaching app. It must still be interpreted with visual acuity and the rest of the examination.",
        source: "cataract-app-scope-v1",
      },
      "reflex-pattern": {
        explanation:
          "Patches are an anterior reflex pattern in this app. Back-of-eye choices are recorded separately to avoid mixing lens and posterior findings.",
        source: "cataract-app-scope-v1",
      },
      recheck: {
        explanation:
          "Conflicting visual acuity and examination findings should be rechecked before a referral conclusion is recorded.",
        source: "cataract-app-scope-v1",
      },
      "retinal-red-flag": {
        explanation:
          "A retinal red flag overrides a cataract-like reflex because delay could miss urgent or vision-limiting posterior disease.",
        source: "cataract-app-triage-v1",
      },
      "near-va": {
        explanation:
          "Near acuity adds functional context but does not replace distance acuity or the eye examination.",
        source: "cataract-app-scope-v1",
      },
      pupils: {
        explanation:
          "An abnormal pupil or light response is not explained safely by simple cataract alone and should prompt assessment for another cause.",
        source: "cataract-app-triage-v1",
      },
      cornea: {
        explanation:
          "Corneal scar or distortion can limit the expected visual outcome and should be recorded alongside any cataract finding.",
        source: "cataract-app-triage-v1",
      },
      refraction: {
        explanation:
          "A mismatch between distance and near acuity can reflect test method or refractive error, so the measurements should be checked before escalation.",
        source: "cataract-app-scope-v1",
      },
      cupping: {
        explanation:
          "Marked disc cupping suggests a possible glaucoma pathway and should not be explained by cataract alone.",
        source: "cataract-app-triage-v1",
      },
      "retinal-comorbidity": {
        explanation:
          "Retinal disease can coexist with cataract, alter urgency and limit the likely visual benefit from cataract surgery.",
        source: "cataract-app-triage-v1",
      },
      paediatric: {
        explanation:
          "A cataract affecting a child can impair visual development. Prompt paediatric eye assessment is important when vision may be affected.",
        source: "nhs-childhood-cataract",
      },
      "safety-scope": {
        explanation:
          "The app supports structured triage and signposting. It does not replace specialist diagnosis or prove that cataract is the cause of visual loss.",
        source: "cataract-app-scope-v1",
      },
      rapd: {
        explanation:
          "RAPD or an abnormal light response suggests retinal or optic-nerve dysfunction and should not be attributed to routine cataract without assessment.",
        source: "cataract-app-triage-v1",
      },
      "urgent-wording": {
        explanation:
          "Urgent results should put the action first, then give a brief reason and practical next step.",
        source: "cataract-app-triage-v1",
      },
    },
    me = At.map((e) => ({
      ...e,
      questions: e.questions.map((t, a) => {
        let s = Et[e.name][a],
          _ = Nt[s];
        return {
          ...t,
          id: `cataract-${e.name.toLowerCase()}-${String(a + 1).padStart(2, "0")}`,
          topic: s,
          explanation: _.explanation,
          source: _.source,
        };
      }),
    }));
  function Se(e) {
    let t = e.slice();
    for (let a = t.length - 1; a > 0; a -= 1) {
      let s = Math.floor(Math.random() * (a + 1)),
        _ = t[a];
      ((t[a] = t[s]), (t[s] = _));
    }
    return t;
  }
  function Xe(e, t) {
    if (!e || typeof e != "object")
      return { unlockedLevelIndex: 0, completedLevels: [] };
    let a = Number.isInteger(e.unlockedLevelIndex)
        ? Math.max(0, Math.min(t - 1, e.unlockedLevelIndex))
        : 0,
      s = Array.isArray(e.completedLevels)
        ? e.completedLevels
            .filter((_) => Number.isInteger(_) && _ >= 0 && _ < t)
            .filter((_, h, f) => f.indexOf(_) === h)
        : [];
    return { unlockedLevelIndex: a, completedLevels: s };
  }
  function Qe(e, t, a) {
    let s = 0,
      _ = 0;
    for (let h = 0; h < e.length; h += 1) {
      let f = t[h];
      if (f == null) {
        if (!a)
          return {
            isComplete: !1,
            score: 0,
            total: e.length,
            unansweredCount: 1,
          };
        continue;
      }
      ((_ += 1), Number(f) === e[h].answerIndex && (s += 1));
    }
    return {
      isComplete: !0,
      score: s,
      total: e.length,
      unansweredCount: e.length - _,
    };
  }
  function Ke(e, t) {
    try {
      let a = window.localStorage.getItem(e);
      return a ? JSON.parse(a) : t;
    } catch (a) {
      return t;
    }
  }
  function ze(e, t) {
    try {
      window.localStorage.setItem(e, JSON.stringify(t));
    } catch (a) {}
  }
  var Tt = { unlockedLevelIndex: 0, completedLevels: [] };
  function Lt(e) {
    let t = Se(e.options.map((a, s) => ({ label: a, originalIndex: s })));
    return {
      ...e,
      options: t.map((a) => a.label),
      answerIndex: t.findIndex((a) => a.originalIndex === e.answerIndex),
    };
  }
  function je() {
    let e = r("#burger-icon"),
      t = r("#sideMenu"),
      a = te(".mcq-level-button"),
      s = r("#mcqModal"),
      _ = r("#closeMcqModal"),
      h = r("#mcqTitle"),
      f = r("#mcqTimer"),
      u = r("#mcqContainer"),
      p = r("#submitMcqButton"),
      v = r("#mcqResult"),
      b = r("#info-popup"),
      q = r("#info-icon"),
      L = Xe(Ke(Re, Tt), me.length),
      M = null,
      R = [],
      B = null,
      S = 0,
      I = null,
      A = !1;
    function $() {
      return s
        ? Array.from(
            s.querySelectorAll(
              'button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])',
            ),
          ).filter((n) => !n.hidden && n.getClientRects().length > 0)
        : [];
    }
    function F() {
      ze(Re, L);
    }
    function j(n) {
      return n <= L.unlockedLevelIndex;
    }
    function Y(n) {
      return L.completedLevels.includes(n);
    }
    function ie() {
      a.forEach((n) => {
        let d = Number(n.dataset.levelIndex),
          C = j(d),
          w = Y(d);
        ((n.disabled = !C), n.classList.toggle("is-complete", w));
      });
    }
    function G(n) {
      var d;
      t &&
        (n &&
          b &&
          ((b.hidden = !0), q && q.setAttribute("aria-expanded", "false")),
        t.classList.toggle("open", n),
        t.setAttribute("aria-hidden", n ? "false" : "true"),
        n
          ? (t.removeAttribute("inert"),
            (d = t.querySelector("button:not([disabled])")) == null ||
              d.focus({ preventScroll: !0 }))
          : t.setAttribute("inert", ""),
        e &&
          (e.setAttribute("aria-expanded", n ? "true" : "false"),
          e.setAttribute("aria-label", n ? "Close menu" : "Open menu")));
    }
    function N() {
      t && G(!t.classList.contains("open"));
    }
    function D() {
      B !== null && (clearInterval(B), (B = null));
    }
    function J() {
      if (!f) return;
      let n = Math.floor(S / 60),
        d = S % 60,
        C = me[M],
        w = C ? `Pass ${C.passScore}/${C.totalQuestions}` : "";
      f.textContent = `${w} \xB7 ${String(n).padStart(2, "0")}:${String(d).padStart(2, "0")}`;
    }
    function Z(n = !1) {
      var z;
      let d = me[M];
      if (!d || !v) return;
      if (A) {
        X(M);
        return;
      }
      let C = W(),
        w = Qe(R, C, !!n);
      if (!w.isComplete) {
        ((v.textContent = "Please answer all questions before submitting."),
          (v.className = "mcq-result is-review"));
        let ee = C.findIndex((re) => !Number.isInteger(re));
        (z =
          u == null ? void 0 : u.querySelector(`input[name="mcq_q_${ee}"]`)) ==
          null || z.focus();
        return;
      }
      D();
      let Q = w.unansweredCount === 0 && w.score >= d.passScore;
      (Q && (se(M), ie()),
        (v.textContent = `${d.name}: ${w.score}/${w.total}. ${Q ? "Pass." : "Review and retry."}`),
        (v.className = `mcq-result ${Q ? "is-pass" : "is-review"}`),
        R.forEach((ee, re) => {
          let i = C[re],
            c =
              u == null
                ? void 0
                : u.querySelector(`[data-question-id="${ee.id}"]`);
          c == null ||
            c.querySelectorAll('input[type="radio"]').forEach((y) => {
              y.disabled = !0;
              let x = y.closest(".mcq-option"),
                T = Number(y.value);
              (x == null ||
                x.classList.toggle("is-correct", T === ee.answerIndex),
                x == null ||
                  x.classList.toggle(
                    "is-wrong",
                    T === i && T !== ee.answerIndex,
                  ));
            });
          let l = c == null ? void 0 : c.querySelector(".mcq-explanation");
          l && (l.hidden = !1);
        }),
        (A = !0),
        p &&
          ((p.disabled = !1),
          (p.textContent = Q ? "New attempt" : "Try again")));
    }
    function U(n) {
      if ((D(), !f)) return;
      let d = Number(n.timeSeconds) || 0;
      if (d <= 0) {
        ((f.hidden = !0), (f.textContent = ""));
        return;
      }
      ((S = d),
        (f.hidden = !1),
        J(),
        (B = setInterval(() => {
          ((S -= 1), J(), S <= 0 && (D(), Z(!0)));
        }, 1e3)));
    }
    function m() {
      s &&
        ((I = e),
        s.classList.add("open"),
        s.setAttribute("aria-hidden", "false"),
        document.body.classList.add("modal-open"),
        window.requestAnimationFrame(() => (_ == null ? void 0 : _.focus())));
    }
    function o() {
      s &&
        (D(),
        s.classList.remove("open"),
        s.setAttribute("aria-hidden", "true"),
        document.body.classList.remove("modal-open"),
        (M = null),
        (R = []),
        (A = !1),
        p && ((p.textContent = "Submit"), (p.disabled = !1)),
        I == null || I.focus(),
        (I = null));
    }
    function P(n) {
      u &&
        ((u.innerHTML = ""),
        n.forEach((d, C) => {
          let w = document.createElement("fieldset");
          ((w.className = "mcq-question"), (w.dataset.questionId = d.id));
          let Q = document.createElement("legend");
          ((Q.textContent = `${C + 1}. ${d.prompt}`),
            w.appendChild(Q),
            d.options.forEach((ee, re) => {
              let i = document.createElement("label");
              i.className = "mcq-option";
              let c = document.createElement("input");
              ((c.type = "radio"),
                (c.name = `mcq_q_${C}`),
                (c.value = String(re)));
              let l = document.createElement("span");
              ((l.textContent = ee),
                i.appendChild(c),
                i.appendChild(l),
                w.appendChild(i));
            }));
          let z = document.createElement("p");
          ((z.className = "mcq-explanation"),
            (z.textContent = `Why: ${d.explanation}`),
            (z.hidden = !0),
            z.setAttribute("aria-live", "polite"),
            w.appendChild(z),
            u.appendChild(w));
        }));
    }
    function X(n) {
      let d = me[n];
      d &&
        ((M = n),
        (A = !1),
        (R = Se(d.questions).slice(0, d.totalQuestions).map(Lt)),
        h && (h.textContent = `${d.name} MCQ`),
        v && ((v.textContent = ""), (v.className = "mcq-result")),
        p && ((p.textContent = "Submit"), (p.disabled = !1)),
        P(R),
        m(),
        U(d));
    }
    function W() {
      return R.map((n, d) => {
        let C = document.querySelector(`input[name="mcq_q_${d}"]:checked`);
        return C ? Number(C.value) : null;
      });
    }
    function se(n) {
      (L.completedLevels.includes(n) || L.completedLevels.push(n),
        (L.unlockedLevelIndex = Math.max(
          L.unlockedLevelIndex,
          Math.min(me.length - 1, n + 1),
        )),
        F());
    }
    return (
      e &&
        e.addEventListener("click", (n) => {
          (n.preventDefault(), n.stopPropagation(), N());
        }),
      a.forEach((n) => {
        n.addEventListener("click", () => {
          let d = Number(n.dataset.levelIndex);
          j(d) && (G(!1), X(d));
        });
      }),
      p &&
        p.addEventListener("click", () => {
          Z(!1);
        }),
      _ && _.addEventListener("click", o),
      document.addEventListener("keydown", (n) => {
        if (n.key === "Tab" && s != null && s.classList.contains("open")) {
          let d = $(),
            C = d[0],
            w = d[d.length - 1];
          if (C && w) {
            if (n.shiftKey && document.activeElement === C) {
              (n.preventDefault(), w.focus());
              return;
            }
            if (!n.shiftKey && document.activeElement === w) {
              (n.preventDefault(), C.focus());
              return;
            }
          }
        }
        if (n.key === "Escape") {
          if (s && s.classList.contains("open")) {
            o();
            return;
          }
          t &&
            t.classList.contains("open") &&
            (G(!1), e == null || e.focus({ preventScroll: !0 }));
        }
      }),
      document.addEventListener("click", (n) => {
        if (t && t.classList.contains("open")) {
          let d = t.contains(n.target),
            C = e && e.contains(n.target);
          !d && !C && G(!1);
        }
        s && s.classList.contains("open") && n.target === s && o();
      }),
      ie(),
      me.forEach((n) => {
        n.questions.forEach((d) => {
          (!d.id || !d.explanation || !Ge[d.source]) &&
            console.warn(`Invalid MCQ metadata: ${d.id || d.prompt}`);
        });
      }),
      { closeMcqModal: o, setSideMenuOpen: G }
    );
  }
  function Je() {
    (Fe(), je(), Ye(), He());
  }
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", Je, { once: !0 })
    : Je();
})();
