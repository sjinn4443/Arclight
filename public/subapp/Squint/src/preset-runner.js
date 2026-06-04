/*
 * Preset execution helper for Squint.
 * Keeps the preset case-map out of main controller code.
 */

(function attachPresetRunner(globalObj) {
  function runPresetCase(key, api) {
    switch (key) {
      case "3rd nerve palsy":
        api.enableSudden();
        api.setEyeTransform("right", 30, 30);
        api.setPtosis("right", 20);
        api.setPupil("right", 45);
        api.setPupilReactivity("right", 0);
        return true;

      case "4th nerve palsy":
        api.setEyeTransform("right", 16, -8);
        return true;

      case "6th nerve palsy":
        api.enableSudden();
        api.setEyeTransform("right", -30, 0);
        return true;

      case "partial 6th nerve palsy (medium)":
        api.enableSudden();
        api.setEyeTransform("right", -20, 0);
        api.setDiagnosticHint("right", "partial_6th_medium");
        return true;

      case "partial 6th nerve palsy (small)":
        api.enableSudden();
        api.setEyeTransform("right", -10, 0);
        api.setDiagnosticHint("right", "partial_6th_small");
        return true;

      case "exophoria (small)":
        // Latent horizontal exo drift appears with dissociation.
        api.setDiagnosticHint("left", "exophoria_small");
        return true;

      case "esophoria (small)":
        // Latent horizontal eso drift appears with dissociation.
        api.setDiagnosticHint("left", "esophoria_small");
        return true;

      case "exophoria (decompensating)":
        // Becomes larger with repeated cover/uncover.
        api.setDiagnosticHint("left", "exophoria_decomp");
        return true;

      case "esophoria (decompensating)":
        // Becomes larger with repeated cover/uncover.
        api.setDiagnosticHint("left", "esophoria_decomp");
        return true;

      case "hyperphoria (decompensating)":
        // Vertical latent drift that increases with repeated dissociation.
        api.setDiagnosticHint("left", "hyperphoria_decomp");
        return true;

      case "hypophoria (decompensating)":
        // Vertical latent drift that increases with repeated dissociation.
        api.setDiagnosticHint("left", "hypophoria_decomp");
        return true;

      case "right hyperphoria":
        // Patient-facing RE is DOM left eye.
        api.setDiagnosticHint("left", "right_hyperphoria");
        return true;

      case "left hyperphoria":
        // Patient-facing LE is DOM right eye.
        api.setDiagnosticHint("right", "left_hyperphoria");
        return true;

      case "horner's syndrome":
        api.setFaded("right", true);
        api.setPtosis("right", 20);
        api.setPupil("right", 25);
        api.setPupilModel("right", "horner");
        return true;

      case "compressive 3rd nerve palsy":
        api.enableSudden();
        api.enablePain();
        api.setEyeTransform("right", 30, 30);
        api.setPtosis("right", 20);
        api.setPupil("right", 48);
        api.setPupilReactivity("right", 0.06);
        api.setDiagnosticHint("right", "compressive_3rd");
        return true;

      case "acute angle-closure pupil":
        api.enableSudden();
        api.enablePain();
        // Mid-dilated, sluggish, vertically oval pupil with ciliary injection.
        api.setPupil("right", 38);
        api.setPupilReactivity("right", 0.12);
        api.setPupilModel("right", "acute-angle-closure");
        api.setDiagnosticHint("right", "acute_angle_closure");
        return true;

      case "argyll robertson pupils":
        api.setPupil("right", 22);
        api.setPupil("left", 22);
        api.setPupilReactivity("right", 0.08);
        api.setPupilReactivity("left", 0.08);
        api.setPupilModel("right", "argyll-robertson");
        api.setPupilModel("left", "argyll-robertson");
        api.setDiagnosticHint("right", "argyll_robertson");
        api.setDiagnosticHint("left", "argyll_robertson");
        return true;

      case "pharmacological mydriasis":
        api.setPupil("right", 52);
        api.setPupilReactivity("right", 0);
        api.setPupilModel("right", "pharmacological-mydriasis");
        api.setDiagnosticHint("right", "pharmacological_mydriasis");
        return true;

      case "pharmacological miosis":
        api.setPupil("right", 16);
        api.setPupil("left", 16);
        api.setPupilReactivity("right", 0.1);
        api.setPupilReactivity("left", 0.1);
        api.setPupilModel("right", "pharmacological-miosis");
        api.setPupilModel("left", "pharmacological-miosis");
        api.setDiagnosticHint("right", "pharmacological_miosis");
        api.setDiagnosticHint("left", "pharmacological_miosis");
        return true;

      case "rapd (re subtle)":
        api.setRapdValue(25);
        // Patient-facing mapping: RE is DOM left eye line.
        api.setDiagnosticHint("left", "rapd_re_subtle");
        return true;

      case "rapd (re marked)":
        api.setRapdValue(70);
        // Patient-facing mapping: RE is DOM left eye line.
        api.setDiagnosticHint("left", "rapd_re_marked");
        return true;

      case "rapd (le subtle)":
        api.setRapdValue(-25);
        // Patient-facing mapping: LE is DOM right eye line.
        api.setDiagnosticHint("right", "rapd_le_subtle");
        return true;

      case "rapd (le marked)":
        api.setRapdValue(-70);
        // Patient-facing mapping: LE is DOM right eye line.
        api.setDiagnosticHint("right", "rapd_le_marked");
        return true;

      case "traumatic mydriasis":
        api.enableSudden();
        api.enableTrauma();
        api.setPupil("right", 50);
        // Semi-fixed: very weak light response rather than fully fixed.
        api.setPupilReactivity("right", 0.1);
        api.setPupilModel("right", "traumatic-mydriasis");
        api.setDiagnosticHint("right", "traumatic_mydriasis");
        return true;

      case "traumatic miotic pupil":
        api.enableSudden();
        api.enableTrauma();
        api.setPupil("right", 20);
        api.setPupilReactivity("right", 0.32);
        api.setPupilModel("right", "traumatic-miotic");
        api.setDiagnosticHint("right", "traumatic_miotic");
        return true;

      case "traumatic peaked pupil":
        api.enableSudden();
        api.enableTrauma();
        api.setPupil("right", 32);
        api.setPupilReactivity("right", 0.3);
        api.setPupilModel("right", "peaked");
        api.setDiagnosticHint("right", "traumatic_peaked");
        return true;

      case "pupil-sparing 3rd nerve palsy":
        api.enableSudden();
        api.setEyeTransform("right", 28, 28);
        api.setPtosis("right", 20);
        api.setPupil("right", 32);
        api.setDiagnosticHint("right", "pupil_sparing_3rd");
        return true;

      case "mixed squint":
        api.setEyeTransform("left", 10, 5);
        api.setEyeTransform("right", -10, -5);
        return true;

      case "myasthenic pattern":
        api.setEyeTransform("right", 14, 10);
        api.setPtosis("right", 12);
        api.setPupil("right", 32);
        api.setPupil("left", 32);
        api.setDiagnosticHint("right", "myasthenia");
        return true;

      case "thyroid restrictive pattern":
        api.setEyeTransform("right", 0, 18);
        api.setPupil("right", 32);
        api.setPupil("left", 32);
        api.setDiagnosticHint("right", "thyroid_restrictive");
        return true;

      case "ino-like pattern":
        api.setEyeTransform("right", 18, 0);
        api.setPupil("right", 32);
        api.setPupil("left", 32);
        api.setDiagnosticHint("right", "ino");
        return true;

      case "cyclo pattern (re in)":
      case "cyclo pattern (re up)":
        api.setCyclo("right", "in");
        api.setCyclo("left", "none");
        return true;

      case "cyclo pattern (re out)":
        api.setCyclo("right", "out");
        api.setCyclo("left", "none");
        return true;

      case "cyclo pattern (le in)":
        api.setCyclo("left", "in");
        api.setCyclo("right", "none");
        return true;

      case "cyclo pattern (le out)":
        api.setCyclo("left", "out");
        api.setCyclo("right", "none");
        return true;

      case "nystagmus (h jerk)":
        api.setNystagmus(true, "horizontal", "jerk", "slow");
        return true;

      case "nystagmus (h pendular)":
        api.setNystagmus(true, "horizontal", "pendular", "slow");
        return true;

      case "nystagmus (h jerk fast)":
        api.setNystagmus(true, "horizontal", "jerk", "fast");
        return true;

      case "nystagmus (v jerk)":
        api.setNystagmus(true, "vertical", "jerk", "slow");
        return true;

      case "nystagmus (mixed pendular)":
        api.setNystagmus(true, "mixed", "pendular", "slow");
        return true;

      case "latent nystagmus-like":
        api.setNystagmus(true, "horizontal", "jerk", "slow");
        api.setDiagnosticHint("right", "latent_nystagmus");
        api.setDiagnosticHint("left", "latent_nystagmus");
        return true;

      case "gaze-evoked nystagmus-like":
        api.setNystagmus(true, "horizontal", "jerk", "fast");
        api.setDiagnosticHint("right", "gaze_evoked_nystagmus");
        api.setDiagnosticHint("left", "gaze_evoked_nystagmus");
        return true;

      case "a-pattern esotropia":
        api.setEyeTransform("right", -8, 0);
        api.setDiagnosticHint("right", "a_pattern_eso");
        return true;

      case "v-pattern esotropia":
        api.setEyeTransform("right", -8, 0);
        api.setDiagnosticHint("right", "v_pattern_eso");
        return true;

      case "a-pattern exotropia":
        api.setEyeTransform("right", 8, 0);
        api.setDiagnosticHint("right", "a_pattern_exo");
        return true;

      case "v-pattern exotropia":
        api.setEyeTransform("right", 8, 0);
        api.setDiagnosticHint("right", "v_pattern_exo");
        return true;

      case "brown syndrome-like":
        api.setEyeTransform("right", 0, 6);
        api.setDiagnosticHint("right", "brown_syndrome");
        return true;

      case "duane type i-like":
        api.setEyeTransform("right", -8, 0);
        api.setDiagnosticHint("right", "duane_type1");
        return true;

      case "dvd-like pattern":
        api.setEyeTransform("right", 0, -10);
        api.setDiagnosticHint("right", "dvd_like");
        return true;

      case "exotropia (small)":
        api.setEyeTransform("right", 10, 0);
        return true;
      case "exotropia (medium)":
        api.setEyeTransform("right", 20, 0);
        return true;
      case "exotropia (large)":
        api.setEyeTransform("right", 30, 0);
        return true;

      case "esotropia (small)":
        api.setEyeTransform("right", -10, 0);
        return true;
      case "esotropia (medium)":
        api.setEyeTransform("right", -20, 0);
        return true;
      case "esotropia (large)":
        api.setEyeTransform("right", -30, 0);
        return true;

      case "hypertropia (small)":
        api.setEyeTransform("right", 0, -10);
        return true;
      case "hypertropia (medium)":
        api.setEyeTransform("right", 0, -20);
        return true;

      case "hypotropia (small)":
        api.setEyeTransform("right", 0, 10);
        return true;
      case "hypotropia (medium)":
        api.setEyeTransform("right", 0, 20);
        return true;

      case "ptosis (slight)":
        api.setPtosis("right", 5);
        return true;
      case "ptosis (moderate)":
        api.setPtosis("right", 15);
        return true;
      case "ptosis (severe)":
        api.setPtosis("right", 25);
        return true;

      case "benign anisocoria":
        api.setPupil("right", 38);
        api.setPupil("left", 32);
        return true;

      case "adie's pupil":
        api.setPupil("right", 45);
        // Adie: tonic large pupil with poor (not absent) light reaction.
        api.setPupilReactivity("right", 0.22);
        api.setPupilModel("right", "adie");
        api.setDiagnosticHint("right", "adie");
        return true;

      case "unilateral dilated pupil":
        api.setPupil("right", 50);
        return true;

      case "bilateral dilated pupils":
        api.setPupil("right", 50);
        api.setPupil("left", 50);
        return true;

      case "unilateral constricted pupil":
        api.setPupil("right", 20);
        return true;

      case "bilateral constricted pupils":
        api.setPupil("right", 20);
        api.setPupil("left", 20);
        return true;

      default:
        return false;
    }
  }

  globalObj.PresetRunner = { runPresetCase };
})(typeof globalThis !== "undefined" ? globalThis : window);
