# Project Brief

## Current repair status — 30 September 2026

The clinical engine and 20-case teaching bank are unchanged by this repair. Drawer Escape now returns focus to the visible menu control. The runtime bundle token is `20260929-engine1-ui20260930`; the service-worker version is `v1.1-20260929-engine1-info-20260929-ui20260930`. The information footer is `v1 · 30/9/2026`. Current verification and remaining clinical/device gates are recorded in [the fleet repair receipt](../../FLEET_FIXES_2026-09-30.md). Dated entries below are historical snapshots.

## v1.1 update (22/7/2026)

The mixed teaching and triage workflow is preserved. v1.1 adds an operational-only two-step assessment reset, keyboard and focus improvements, app-scoped offline support and Node built-in regression contracts. The accepted viewer layout, white-on-black identity, clinical wording, thresholds, 20 cases and existing dilation coupling remain unchanged. Clinical sign-off and physical-device review are pending.

<!-- APP-DOC-STATUS:START -->

## Historical memory snapshot (31/5/2026)

- Discs is the Desktop Arclight app at `C:\Users\William\Desktop\Arclight App\Discs`.
- Current local browser target: `http://localhost:8081/Discs/`.
- The app was copied from Diabetic but now targets optic disc assessment.
- Appbar is black with white title text and white icons.
- Main target size is `360 x 740`.
- The live case set is 20 optic disc cases split into General discs, Normal cups and Glaucoma.
- Live images are in `assets/images/discs`.
- Live image folder contains 60 live case WebPs: 20 light, 20 dark and 20 cropped thumbnails.
- Full-size light and dark images are `2915 x 2834`.
- Practice thumbnails are `480 x 360` clean crops from the source fundus images.
- Raw source PNGs are in `tools/disc-image-sources`.
- Physiological/glaucoma source PNGs are in `assets/images/discs/Pys_disc`.
- May asset token is `20260531-casesets`.
- May app bundle/cache token is `20260531-reviewfix`.
- Triage separates cup/size context, fast glaucoma review and urgent disc swelling.
- 360 x 740 scroll handling locks the page behind popup, modal, drawer and expanded Action surfaces.
- Compact Action UI now suppresses empty limitations and uses shorter safety copy.
- Whole-app review fixes route severe reduced VA to `Soon` and hide the locked cup achievement card.
<!-- APP-DOC-STATUS:END -->

Last updated: 30/9/2026

## Purpose

Build **Discs**, a mobile-first Arclight mini app for optic disc teaching, recognition practice and triage-style recording.

The app supports users examining the optic disc with Arclight (DO) or Holo (BIO). It helps them record view quality, recognise disc signs and choose safe referral wording.

This is not a diagnostic grading calculator, a diagnostic glaucoma calculator or a replacement for formal eye assessment, IOP, fields, OCT or urgent review for true disc swelling.

## Core Questions

The app should answer:

1. Can I see enough?
2. What disc signs are present?
3. Is there an urgent red flag?
4. Is this more general disc pathology or glaucoma-pattern disc change?

## Product Goals

- Keep the first screen useful at `360 x 740`.
- Preserve the shared Arclight UI language from Fundal Reflex, Diabetic and Glaucoma.
- Support Arclight (DO) and Holo (BIO) workflows.
- Record right and left eyes separately.
- Provide general disc and glaucoma disc finding tabs.
- Keep glaucoma disc prompts specific: cup/disc ratio, disc size, thin rim, rim notch, splinter haemorrhage and vessel changes.
- Keep C/D 0.3 and disc size as context unless other concerning glaucoma signs are present.
- Keep true disc swelling urgent and high-risk glaucoma signs as fast glaucoma review.
- Provide 20 optic disc practice cases with light and dark versions.
- Keep the practice thumbnails cosmetic and crop-based.
- Generate short referral wording.
- Keep uncertainty explicit.

## Non-Goals

- No definitive diagnosis.
- No OCT interpretation.
- No treatment selection.
- No AI or image grading.
- No claim that a limited Arclight view excludes disease.
- No diabetic retinopathy scope in this app.

## Deliverables

- Black appbar with white `Discs` title and white icon text.
- Fundal-style side drawer.
- Compact quick guide popup for optic disc assessment.
- Arclight (DO) and Holo (BIO) tab system.
- Case-set viewer with next and previous controls scoped to the selected set.
- Light and dark fundus versions through the Skin control.
- Practice modal using cropped thumbnails.
- General disc findings tab.
- Glaucoma disc findings tab.
- Referral note generator.
- Primary, Intermediate and Advanced MCQs with larger Diabetic-style item banks.
- Current image conversion script and clean image folder.
- Memory bank and README kept current.

## Success Criteria

- User can practise and record disc findings on a slim phone.
- The app never implies that a poor view is normal.
- Image cases load without missing files or console errors.
- Practice thumbnails do not show the blended edge from the full-size images.
- Case labels read by selected set: General discs `1/9`, Normal cups `1/5` and Glaucoma `1/6`.
- General disc signs and glaucoma disc signs remain separate.
- Red flags remain easy to find.
- README and memory bank describe Discs, not the copied Diabetic source.

## MCQ quality boundary — 26 July 2026

- Preserve 16/24/24 bank sizes, 5/6/8 attempt sizes and existing pass marks.
- Keep teaching separate from recorded examination, triage, referral and viewer state.
- Require stable identities, one best answer, a concise rationale, source metadata and genuinely progressive tier decisions.
- Engineering consistency does not provide clinical sign-off.
