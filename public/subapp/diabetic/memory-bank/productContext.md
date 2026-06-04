# Product Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: red `#f04444` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Last updated: 18/5/2026

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

- offline.
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

Practice should feel clearly educational and live in the side drawer. Arclight (DO) and Holo (BIO) should feel like clinical recording routes with shared per-eye findings and mode-specific view options.

## Tone

- concise.
- practical.
- plain clinical English.
- cautious where uncertainty matters.
- no long manual text on the main screen.
