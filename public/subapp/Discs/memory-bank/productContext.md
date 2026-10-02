# Product Context

## v1.1 safety boundary (22/7/2026)

Discs remains mixed: the viewer, image cases and MCQs are teaching surfaces while RE/LE recording, Action and the referral note are operational support. Untouched operational fields remain unassessed. `New assessment` clears only recorded examination state and transient referral output, retaining teaching viewer state and achievement. The existing Dilation control remains intentionally coupled to viewer and recorded dilation pending any later authorised workflow review.

<!-- APP-DOC-STATUS:START -->

## Historical Memory Status (31/5/2026)

- Product is **Discs**, not Diabetic.
- Current app URL: `http://localhost:8081/Discs/`.
- The app is for general optic disc assessment with a specific glaucoma disc strand.
- Current case library has 20 light and dark cases split into General discs, Normal cups and Glaucoma.
- Practice thumbnails are clean crops, not reduced versions of the blended full-size images.
<!-- APP-DOC-STATUS:END -->

Last updated: 30/9/2026

## Users

Primary users:

- LMIC primary-care clinicians.
- GPs.
- nurses or clinical officers doing eye checks.
- Arclight users with limited retinal training.
- trainees learning optic disc signs.

Secondary users:

- eye-care trainers.
- outreach programmes.
- supervisors reviewing referral quality.

## Use Environment

The app may be used:

- offline or from a simple local static server.
- on a small phone.
- in a busy clinic.
- with Arclight (DO).
- with Holo (BIO) where available.
- with variable dilation, cataract and fundus pigmentation.

The interface must assume time pressure and imperfect examination conditions.

## Clinical Position

Discs is a triage and teaching support app. It should improve the quality of looking, recording and referring.

The app should be deliberately cautious:

- it records what was seen.
- it records right and left eyes separately.
- it flags risk.
- it advises referral urgency.
- it does not over-diagnose.
- it does not promise exclusion of disease from a limited view.
- it does not replace IOP, fields, OCT, formal optic nerve assessment or urgent review for true disc swelling.

## Case Set

Current practice cases:

- Normal disc.
- Disc swelling.
- Diffuse atrophy.
- Cupped disc.
- Temporal atrophy.
- Disc drusen.
- Hypoplasia.
- Morning glory.
- Myelination.
- C/D 0.1, 0.3, 0.5 and 0.7 examples.
- Physiological cup variants.
- Large and very large cup/disc examples.
- Tilted disc.

## Disc Content Backbone

General disc signs:

- swelling.
- pallor.
- drusen.
- anomalous discs.
- myelination.
- suspicious vessels.

Glaucoma disc signs:

- cup/disc ratio.
- disc size.
- thin rim.
- rim notch.
- splinter haemorrhage.
- vessel changes.

Red flags:

- swollen disc with symptoms.
- acute visual loss.
- abnormal pupils.
- severe cupping, rim notch or disc haemorrhage needing fast glaucoma review.

## User Experience Promise

The app should make the user feel:

- guided, not examined.
- clearer about what counts as a disc sign.
- safer about when to refer.
- aware when the view is not good enough.
- able to separate general disc appearances from glaucoma-pattern signs.

It should not make the user feel they have produced a definitive specialist diagnosis.

## Tone

- concise.
- practical.
- plain clinical English.
- cautious where uncertainty matters.
- no long manual text on the main screen.

## MCQ experience — 26 July 2026

The quiz should present one compact mobile task: answer every item, review every rationale, then choose a single New attempt action. It should teach disc anatomy, signs, view quality and wider assessment without claiming that an isolated image establishes diagnosis. The modal must not open beneath a still-visible drawer or allow the result to overlap its action.
