# Product Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (21/5/2026)

- v1 app review completed on `21/5/26`.
- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Main screen: image-led diabetic case practice viewer using the Swollen Discs draggable circular viewing engine.
- Case assets: ten expanded WebP diabetic cases in `assets/images/diabetic/`, with thumbnails plus light and dark pigmentation support.
- Viewer controls: `<` / `>` case navigation, icon-only case information, R/L orientation, Gaze, Dilated, Skin and full-width Adv controls for cataract blur and nystagmus.
- Arclight (DO): compact direct-view simulation.
- Holo (BIO): wider lens-style view; corneal reflection is hidden; field is `15 deg` undilated and `25 deg` dilated, and switching to Holo does not automatically switch Dilated on.
- Exam system: RE and LE VA, View, Findings and Action live in one separate compact Exam box below or beside the viewer.
- Findings: paired per-eye dropdowns are both labelled `Findings` and group no referable signs, DR signs, macula risk and proliferative signs with mini explanations.
- Action logic: outputs `Routine (weeks)`, `Soon (days)`, `Urgent (today)`, `Ungradable (repeat)` or `Record both eyes` using green, orange, red and neutral chips, with a compact `+` expander for details.
- Quick guide, side drawer, practice cases, findings guide and referral note follow the Fundal Reflex compact UI pattern.
- Quick guide popup shows `v1 21/5/26` at bottom right.
- MCQs are clinically audited across Primary, Intermediate and Advanced and use the Fundal-style modal with the scrolling question list and fixed `Submit Test` button.
- Final UI polish: equal-width VA/View selects, lighter select text and muted mid-grey Temporal/Nasal canvas labels.
- Responsive checks completed at `360 x 740`, `768 x 1024`, `1024 x 768` and `1366 x 768`.
- Latest Lighthouse: mobile `90 / 100 / 100 / 100`; desktop `100 / 100 / 100 / 100`.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Favicon: black square with a centred red `D`.
<!-- APP-DOC-STATUS:END -->

Last updated: 21/5/2026

## Users

Primary users:

- LMIC primary-care clinicians.
- GPs.
- nurses or clinical officers doing diabetes checks.
- Arclight users with limited retinal training.
- trainees learning diabetic retinal signs.

Secondary users:

- eye-care trainers.
- outreach programmes.
- supervisors reviewing referral quality.

## Use Environment

The app may be used:

- offline or from a simple local static server.
- on a small phone.
- in a busy clinic.
- with limited retinal imaging access.
- with Arclight (DO).
- after local dilation where appropriate.
- with Holo (BIO) where available.

The interface must assume time pressure and imperfect examination conditions.

## Clinical Position

Diabetic is a triage and teaching support app. It should improve the quality of looking, recording and referring.

The app should be deliberately humble:

- it records what was seen.
- it records right and left eyes separately.
- it flags risk.
- it advises referral.
- it does not over-grade disease.
- it does not promise exclusion of disease from a limited view.

## DR Content Backbone

Use the diabetic retinopathy strand from the Fundus 1 card:

- screen with Holo (BIO) or Arclight (DO).
- DR signs: MA, dot/blot haemorrhage, CWS and venous beading.
- macula risk: hard exudates near macula, possible foveal involvement and reduced or untestable distance VA.
- proliferative signs: NVD, NVE, preretinal haemorrhage and vitreous haemorrhage.
- systemic tick-boxes: BP, lipids and HbA1c.
- broad health advice: sleep, eat, move, think and sun.

Ignore the rest of the card for this app:

- swollen disc.
- cupped disc.
- pale disc.
- arterial occlusion.
- vein occlusion.
- glaucoma warnings.

## User Experience Promise

The app should make the user feel:

- guided, not examined.
- safer about when to refer.
- clearer about what counts as a red flag.
- aware when the view is not good enough.
- confident that switching Arclight (DO)/Holo (BIO) changes equipment route without losing clinical context unexpectedly.
- prompted to complete a dilation check, because an undilated view can be a major limitation.

It should not make the user feel they have produced a definitive specialist diagnosis.

Practice should feel clearly educational, use the ten image cases and live in the side drawer. Arclight (DO) and Holo (BIO) should feel like clinical recording routes with shared per-eye findings and mode-specific view options.

## Tone

- concise.
- practical.
- plain clinical English.
- cautious where uncertainty matters.
- no long manual text on the main screen.
