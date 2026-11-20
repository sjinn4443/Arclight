# Apply an Eye Pad and Eye Shield — latest revision

Route: `#/eyePadShield/applyEyePadShieldScrollPage`. Every step follows the
linked `#/eyePadShield/eyeCareVideo-apply_eye_pad` video and the user's pose,
reel and forehead-contact references.

Seven visual scenes retain eight speech cues, now mixed on a 62.45s clock.
Cached speech is trimmed by `scripts/trim-apply-eye-pad-narration.py`; clip ends
are localized to the later of speech and movement. Replay/Next wait 0.7s.
The shared player is unchanged. The merged placement/securing scene retains an
explicit timing point at the second cue boundary.

- Equipment has larger scissors and smaller, separated pad/shield pieces.
- The original patient uses a supported chair back and resting forearms/lap.
  The smaller rounded explanation bubble stops after bringing the pad up.
- Larger cotton approaches from the left, follows the periocular surface and
  passes behind the original nose.
- Pale source-paper tape leaves a rotating roll. Enlarged original scissor
  layers retain their screw anchors; operator skin is removed from those layers.
- Prepared tape is spread across the pad. Long strips arrive with the pad;
  securing adds separate diagonal strips anchored on forehead and cheek,
  rather than extending the original strips.
- The shield retains full pad coverage with a left-facing apex and an oblique
  rim. New tape follows the shield and forehead contours, with contact shadows.
- The final bilingual cue ends with completing eye-shield application. It no
  longer refers the learner to the video.

Rebuild artwork with `node scripts/build-apply-eye-pad-shield-scroll.cjs`.
Regenerate speech with `scripts/generate-apply-eye-pad-shield-narration.ps1` and
its Python argument. This trims cached utterances before the existing mixer.
Original PDF paths and Make lesson materials remain the artwork sources;
`provenance.json` records the source hashes.

Validation: 19 unit checks and four production Chromium/iPhone WebKit cases
pass, including the localized audio clock, 0.7s controls, merged captions,
replay/progress/Back and revised illustration contact frames. Build budgets,
ESLint and offline delivery pass: seven scenes, 65 image references and both
new narration tracks. Windows WebKit uses the existing simulated media clock;
Chromium plays the actual AAC. Physical iOS is not tested.

Latest composition revision: equipment is lifted 105px; the seated pose uses
separate resting hands with the full arm outlines retained. The two adults move
closer together. The procedure bubble zooms out and centres on the treated eye.
Single-patient scenes share a rightward, enlarged camera parent. Their pad is
projected to the temple rather than hanging beyond the face edge. The foreground uses the original nose line and its interior, leaving both
brows intact. The gauze weave compresses around the temple and its shadow
follows the projected silhouette. The seated pose reuses the Cataract history
patient from the collar down.

The reel keeps its barrel, axle and elliptical projection stationary while its
source-paper face rotates inside a precomposition. Tape leaves the rim tangentially.
Both complete scissor halves are cut from the equipment asset, with identical
full-length blades and one shared screw; they remain in place for all three
cuts. The lower half renders behind the tape and the upper half in front.
Prepared tapes have left, gentle-centre and opposing-right curvature. Shield
placement begins immediately with the secured pad already present, reuses the
native equipment cone pixels/shading, and includes an outer-side securing strip.

Current verification: 22 focused Apply/Make unit checks, four production
Chromium/iPhone WebKit cases, ESLint, formatting and the production build pass.
All seven scenes and 69 texture references match offline delivery, and the
current bilingual narration bytes are unchanged. The fixed-axis projection,
three-cut single scissor visit, lower-blade ordering and full pad coverage have
explicit regressions. Windows WebKit uses the existing simulated audio clock.
