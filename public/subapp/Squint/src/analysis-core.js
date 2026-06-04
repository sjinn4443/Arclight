/*
 * Pure analysis helper functions (no DOM rendering).
 */

(function attachAnalysisCore(globalObj) {
  function splitTokens(content) {
    return String(content || "")
      .split("|")
      .flatMap((segment) => segment.split(" and "))
      .map((token) => token.trim().toLowerCase())
      .filter(Boolean);
  }

  function extractHint(content) {
    const match = String(content || "")
      .toLowerCase()
      .match(/\bhint:([a-z0-9_]+)/);
    return match ? match[1] : "";
  }

  function getHintCondition(content) {
    const hint = extractHint(content);
    if (!hint) return "";

    switch (hint) {
      case "pupil_sparing_3rd":
        return "<span style='color:red;'>probable pupil-sparing 3rd nerve palsy</span>; acute diplopia with ptosis";
      case "partial_6th_small":
        return "<span style='color:red;'>possible partial 6th nerve palsy</span>; mild abduction deficit";
      case "partial_6th_medium":
        return "<span style='color:red;'>probable partial 6th nerve palsy</span>; moderate abduction deficit";
      case "exophoria_small":
        return "possible small exophoria; latent, seen on cover test";
      case "esophoria_small":
        return "possible small esophoria; latent, seen on cover test";
      case "exophoria_decomp":
        return "probable decompensating exophoria; larger on repeated cover/uncover";
      case "esophoria_decomp":
        return "probable decompensating esophoria; larger on repeated cover/uncover";
      case "hyperphoria_decomp":
        return "probable decompensating hyperphoria; larger on repeated cover/uncover";
      case "hypophoria_decomp":
        return "probable decompensating hypophoria; larger on repeated cover/uncover";
      case "right_hyperphoria":
        return "possible right hyperphoria; latent vertical deviation on cover test";
      case "left_hyperphoria":
        return "possible left hyperphoria; latent vertical deviation on cover test";
      case "myasthenia":
        return "possible ocular myasthenia; variable ptosis/motility, pupil sparing";
      case "thyroid_restrictive":
        return "possible thyroid restrictive change; restrictive motility";
      case "ino":
        return "possible INO; adduction deficit with pupil sparing";
      case "latent_nystagmus":
        return "possible latent nystagmus-like pattern; often paediatric binocular pathway related";
      case "gaze_evoked_nystagmus":
        return "<span style='color:red;'>possible gaze-evoked nystagmus-like pattern</span>; consider central/drug causes";
      case "a_pattern_eso":
        return "possible A-pattern esotropia";
      case "v_pattern_eso":
        return "possible V-pattern esotropia";
      case "a_pattern_exo":
        return "possible A-pattern exotropia";
      case "v_pattern_exo":
        return "possible V-pattern exotropia";
      case "brown_syndrome":
        return "possible Brown syndrome-like pattern; elevation in adduction limited";
      case "duane_type1":
        return "possible Duane type I-like pattern; abduction limited with esotropic tendency";
      case "dvd_like":
        return "possible DVD-like pattern; dissociated upward drift";
      case "compressive_3rd":
        return "<span style='color:red;'>probable compressive 3rd nerve palsy</span>; pupil involving";
      case "acute_angle_closure":
        return "<span style='color:red;'>probable acute angle-closure glaucoma</span>; mid-dilated oval sluggish pupil";
      case "adie":
        return "possible Adie's pupil; large tonic pupil with poor light reaction";
      case "argyll_robertson":
        return "possible Argyll Robertson pupils; small, light-near dissociation pattern";
      case "pharmacological_mydriasis":
        return "possible pharmacological mydriasis; large fixed pupil pattern";
      case "pharmacological_miosis":
        return "possible pharmacological miosis; bilateral small sluggish pupils";
      case "rapd_re_subtle":
        return "subtle RE RAPD; swing torch to confirm";
      case "rapd_re_marked":
        return "<span style='color:red;'>marked RE RAPD</span>; swing torch confirms";
      case "rapd_le_subtle":
        return "subtle LE RAPD; swing torch to confirm";
      case "rapd_le_marked":
        return "<span style='color:red;'>marked LE RAPD</span>; swing torch confirms";
      case "traumatic_mydriasis":
        return "<span style='color:red;'>probable traumatic mydriasis</span>; large semi-fixed pupil";
      case "traumatic_miotic":
        return "possible traumatic miosis; small sluggish pupil";
      case "traumatic_peaked":
        return "<span style='color:red;'>probable traumatic peaked pupil</span>; urgent globe-injury assessment";
      default:
        return "";
    }
  }

  function getPupilScore(text) {
    const content = String(text || "").toLowerCase();
    if (content.includes("dilated pupil")) return 3;
    if (content.includes("larger pupil"))
      return content.includes("slightly larger pupil") ? 1 : 2;
    if (content.includes("pinhole pupil")) return -3;
    if (content.includes("slightly smaller pupil")) return -1;
    if (content.includes("smaller pupil")) return -2;
    return 0;
  }

  function extractModifierState(rightText, leftText) {
    const combined = `${String(rightText || "").toLowerCase()} | ${String(leftText || "").toLowerCase()}`;
    let headTilt = "none";
    if (combined.includes("headtilt:right")) headTilt = "right";
    else if (combined.includes("headtilt:left")) headTilt = "left";

    return {
      sudden: combined.includes("sudden"),
      pain: combined.includes("pain"),
      trauma: combined.includes("trauma"),
      fatigable: combined.includes("fatigable"),
      diplopia: combined.includes("diplopia"),
      cyclo: combined.includes("cyclo:"),
      nystagmus: combined.includes("nyst:"),
      headTilt,
    };
  }

  function buildModifierSummary(modifiers) {
    const items = [];
    if (modifiers.sudden) items.push("Sudden");
    if (modifiers.pain) items.push("Pain/HA");
    if (modifiers.trauma) items.push("Trauma");
    if (modifiers.fatigable) items.push("Fatigable");
    if (modifiers.diplopia) items.push("Diplopia");
    if (modifiers.cyclo) items.push("Cyclo");
    if (modifiers.nystagmus) items.push("Nystagmus");
    if (modifiers.headTilt === "right") items.push("Head tilt R");
    if (modifiers.headTilt === "left") items.push("Head tilt L");
    return items.join(", ");
  }

  function buildModifierGuidance(modifiers, conditionRight, conditionLeft) {
    const combinedCondition =
      `${conditionRight || ""} ${conditionLeft || ""}`.toLowerCase();
    const notes = [];

    if (modifiers.sudden) {
      notes.push("Sudden onset: acute review.");
    }

    if (modifiers.fatigable) {
      if (combinedCondition.includes("myasthenia"))
        notes.push("Fatigable history supports myasthenia.");
      else notes.push("Fatigable history: consider ocular myasthenia.");
    }

    if (modifiers.headTilt !== "none") {
      if (combinedCondition.includes("4th nerve palsy"))
        notes.push("Head tilt supports 4th nerve pattern.");
      else
        notes.push("Head tilt suggests vertical muscle/4th nerve involvement.");
    }

    if (modifiers.cyclo) {
      notes.push("Cyclo sign: consider torsional/4th nerve involvement.");
    }

    if (modifiers.pain) {
      if (combinedCondition.includes("3rd nerve palsy")) {
        notes.push(
          "<span style='color:red;'>Pain/headache with 3rd nerve signs: urgent neurology review.</span>",
        );
      } else if (combinedCondition.includes("6th nerve palsy")) {
        notes.push(
          "<span style='color:red;'>Pain/headache with acute diplopia: urgent review.</span>",
        );
      } else {
        notes.push("Pain/headache: assess for an acute neurological cause.");
      }
    }

    if (modifiers.trauma) {
      notes.push("Recent trauma: traumatic palsy or orbital injury possible.");
    }

    if (modifiers.diplopia) {
      if (
        combinedCondition.includes("3rd nerve palsy") ||
        combinedCondition.includes("4th nerve palsy") ||
        combinedCondition.includes("6th nerve palsy") ||
        combinedCondition.includes("myasthenia") ||
        combinedCondition.includes("thyroid restrictive")
      ) {
        notes.push("Diplopia supports a binocular alignment cause.");
      } else {
        notes.push("Diplopia present: re-check alignment and fusion.");
      }
    }

    if (modifiers.nystagmus) {
      notes.push(
        "Nystagmus present: classify axis, waveform, and rate clinically.",
      );
    }

    return notes.join(" ");
  }

  globalObj.AnalysisCore = {
    splitTokens,
    extractHint,
    getHintCondition,
    getPupilScore,
    extractModifierState,
    buildModifierSummary,
    buildModifierGuidance,
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
