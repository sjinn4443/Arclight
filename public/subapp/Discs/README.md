# Discs

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Production bundle minified from its canonical source. Shipped JavaScript: 189,016 → 104,056 bytes. Mobile Lighthouse performance: 87 → 93/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Viewer navigation and recording controls enlarged; collapsed desktop recording state remains a compact centred column.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Fleet repair receipt — 30 September 2026

Prevented inactive information-panel Escape handling from stealing focus after the drawer closes. Rebuilt the UI bundle. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## Audit corrections — 29 September 2026

- DO stays upright. BIO rotates retinal imagery 180 degrees with mode-aware nasal/temporal labels; RE/LE mirroring remains separate.
- Teaching mode and dilation no longer write the patient examination. Record these in Exam. New assessment clears clinical context, not the viewer.
- Missing VA or disc-size-only context cannot produce routine reassurance. Urgent signs retain priority and poor-view limitations. Drusen uncertainty and lamina qualifications remain visible in results.
- Untouched dilation and findings are reported as not recorded. Failed images have visible retry feedback, not silent blank or stale imagery.
- Mobile cataract rendering retains blur, contrast and saturation. The compact control shows its selected level only.
- Checks: 24 unit/contract tests and exact bundle parity. Browser evidence and limits are in `AUDIT_2026-09-29.md`. Independent clinical sign-off and physical-device acceptance remain pending.

## v1.1 engineering and UI status (23/7/2026)

- The accepted black app bar, white title, 20 teaching cases and compact `360 x 740` viewer/Exam geometry are preserved.
- Untouched RE and LE examination state remains incomplete and `Not recorded`.
- `New assessment` is a two-step drawer action. It clears recorded eye findings, VA, view, clinical mode, dilation, context and transient referral text while retaining the teaching viewer and quiz achievement.
- Dialogs now trap keyboard focus and restore it to their opener. The drawer and Quick guide restore focus and the finding tabs support arrow, Home and End keys.
- Runtime fonts and assets are local. `manifest.webmanifest` and an app-scoped service worker provide installable HTTP(S) offline support with shell-first caching and runtime caching for the large case images.
- Direct-file use remains available for the static app but service-worker installation and offline caching require HTTP(S).
- Lead desktop-browser review passed at `360 x 740`, including expanded Exam scroll, routine action, reset, focus and offline reload.
- Corrective visual pass uses `12px` grouped controls, a `16px` viewer and image stage and an `18px` Exam shell, with a stronger Exam heading and non-italic changing viewer values.
- Fleet-alignment follow-up uses Swollen Discs as the shared mobile edge reference: at `360 x 740` the black stage and Exam shell are both `340px` wide with `10px` outer margins. The stage keeps a `16px` radius and shared shadow while Exam keeps the quieter `18px` panel radius.
- Independent clinical sign-off and physical-device acceptance remain pending.

<!-- APP-DOC-STATUS:START -->

## Historical UI snapshot (31/5/2026)

- Discs is a static Arclight mini app for optic disc teaching and triage prompts.
- The app was copied from Diabetic but now uses Disc-specific copy, findings, practice cases and image assets.
- May review browser target: `http://localhost:8081/Discs/`.
- Main mobile target remains `360 x 740`.
- Appbar is black with white title text and white icon text.
- Viewer modes: `Arclight (DO)` and `Holo (BIO)`.
- Viewer controls: case navigation, R/L orientation, Gaze, Dilation, Skin and Adv cataract controls.
- Viewer and Practice modal use three case sets: General discs, Normal cups and Glaucoma.
- Quick guide popup is updated for optic disc assessment and shows `v3 31/5/26`.
- MCQ banks now use Diabetic-style variation: 16 Primary, 24 Intermediate and 24 Advanced items.
- Live image folder contains the 9 general disc cases and 11 physiological/glaucoma disc cases.
- Each case has light, dark and thumbnail assets.
- Light and dark case images are `2915 x 2834` WebP.
- Thumbnails are cropped from the original source fundus images at `480 x 360` WebP.
- Raw numbered PNG sources are kept in `tools/disc-image-sources`.
- Physiological disc PNG sources are kept in `assets/images/discs/Pys_disc`.
- User-provided named general-disc sources are retained in `discs/` and are not loaded by the app directly.
- Dead generated contact sheets, old unused WebPs and obsolete green-background tooling have been removed.
- May cache token: `20260531-reviewfix`.
- Triage now separates cup/size context, fast glaucoma signs and urgent true disc swelling.
- Overlay-style panels lock the background page scroll on the 360 x 740 layout so only one vertical scrollbar is visible.
- Arclight actions no longer show `Not dilated` when the recorded disc view is clear; Holo/BIO still warns when undilated.
- The compact Action sheet removes empty limitation text and uses shorter safety wording.
- Severe reduced VA without selected disc signs now routes to orange `Soon` rather than green routine wording.
- The Advanced quiz cup only unlocks after a passing/completion result and the locked cup block is hidden from the drawer.
- Browser verification on `31/5/26`: all 60 live case image files are present with the expected dimensions.
<!-- APP-DOC-STATUS:END -->

## Purpose

Discs supports recognition practice and triage-style recording for general optic disc issues.

It covers common disc appearances such as swelling, pallor, drusen, anomalous discs, myelination and glaucoma-pattern disc signs. It is a teaching aid and prompt, not a diagnosis.

## Scope Lock

Discs is a recognition and triage support tool, not a diagnostic glaucoma calculator or a formal optic nerve assessment replacement.

Keep in scope:

- optic disc recognition practice across general disc signs, normal cups and glaucoma-pattern cupping.
- view quality, field coverage and whether the disc view is adequate.
- RE and LE recording of VA, view and disc findings.
- safe action wording and referral-note support.
- teaching that physiological cupping can be normal and cup size alone is not a diagnosis.
- triage wording that keeps C/D 0.3 and disc size as context unless other concerning signs are present.

Keep out of scope:

- confirming glaucoma without clinical examination, IOP, fields, OCT or follow-up context.
- replacing urgent assessment of suspected true disc swelling.
- choosing treatment, drops, laser or surgery.
- implying a limited or ungradable view is normal.

## Current Case Sets

The app uses 20 image cases split into 3 teaching sets.

General discs:

1. Normal disc
2. Disc swelling
3. Diffuse atrophy
4. Cupped disc
5. Temporal atrophy
6. Disc drusen
7. Hypoplasia
8. Morning glory
9. Myelination

Normal cups:

1. C/D 0.1 disc
2. C/D 0.3 disc
3. C/D 0.5 disc
4. C/D 0.7 disc
5. Tilted normal disc

Glaucoma sequence:

1. Normal baseline: small cup, broad rim and visible nerve fibre layer.
2. Early cupping: temporal cup enlargement and first lamina dots.
3. Moderate asymmetric glaucoma: notch, focal nerve fibre loss and splinter haemorrhage.
4. Advanced glaucoma loss: deep cup, two fibre defects, exposed lamina and nasalised vessels.
5. Very advanced cupping: giant cup, nasal nerve fibre layer only and temporal atrophy.
6. End-stage cupping: near-total excavation, no visible nerve fibre layer and severe vessel displacement.

## Image Asset Contract

Live WebP assets live in:

```text
assets/images/discs/
```

The live WebP set should contain only:

```text
case-01.webp ... case-09.webp
case-01_dark.webp ... case-09_dark.webp
case-01_thumb.webp ... case-09_thumb.webp
phys-01.webp ... phys-tilt.webp
phys-01_dark.webp ... phys-tilt_dark.webp
phys-01_thumb.webp ... phys-tilt_thumb.webp
```

Rules:

- `case-XX.webp`: light version, `2915 x 2834`.
- `case-XX_dark.webp`: dark version, `2915 x 2834`.
- `case-XX_thumb.webp`: clean cropped thumbnail, `480 x 360`.
- Thumbnails should come from the original source fundus image, not the extended blended full-size case image.
- Full-size images use the extended retina background system and keep the app's right-eye convention.
- Do not put raw source PNGs or older unused WebPs back into the live image folder.
- The only source folder intentionally kept alongside the live WebPs is `assets/images/discs/Pys_disc`, because the physiological/glaucoma converter reads from it.

The general disc conversion script is:

```text
tools/convert-numbered-disc-assets.py
```

It reads source files from:

```text
tools/disc-image-sources/
```

The physiological disc conversion script is:

```text
tools/convert-phys-disc-assets.py
```

It generates the physiological/glaucoma full-size frames using a low-strength blended edge extension with a small feather so the wide Holo view avoids a hard edge without duplicating the disc.

Both conversion scripts write diagnostic contact sheets to `tools/generated-checks` when rerun. Those files are scratch outputs and do not need to stay in the app root.

## Run Locally

From `C:\Users\William\Desktop\Arclight App`:

```powershell
python -m http.server 8081
```

Open:

```text
http://localhost:8081/Discs/
```

The app is static HTML, CSS and JavaScript. `index.html` loads the built bundle:

```text
  app.bundle.js?v=20260722-v11
```

## Rebuild

From `C:\Users\William\Desktop\Arclight App\Discs`, install the pinned build tool once and rebuild:

```powershell
npm install
npm run build
```

Run the built-in contracts:

```powershell
npm test
```

Regenerate the current disc assets:

```powershell
python tools\convert-numbered-disc-assets.py
python tools\convert-phys-disc-assets.py
```

## Important Files

- `index.html`: app shell, quick guide popup and modal markup.
- `styles.css`: mobile-first layout and visual styling.
- `script.js`: app bootstrap and shared UI wiring.
- `src/viewer-config.js`: 20 case records and image paths.
- `src/practice-cases.js`: practice modal card metadata.
- `src/findings.js`: general disc and glaucoma findings.
- `src/triage.js`: action wording.
- `discs/`: user-provided named source images, retained for reference.
- `tools/convert-numbered-disc-assets.py`: current image conversion pipeline.
- `tools/convert-phys-disc-assets.py`: physiological and glaucoma sequence conversion pipeline.
- `memory-bank/`: project memory files.

## Safety And Copy Principles

- The app records what was seen in the view obtained.
- No signs means no referable disc signs were seen in that view, not no disease.
- Urgent red flags must stay prominent.
- True disc swelling and high-risk glaucoma signs should use different action wording: urgent swelling versus fast glaucoma review.
- Cup/disc ratio and disc size context should not create a referral action by themselves.
- Glaucoma disc signs need a dedicated tab and should include cup/disc ratio, disc size, thin rim, rim notch, splinter haemorrhage and vessel changes.
- General disc signs should include swelling, pallor, drusen, anomalous discs, myelination and suspicious vessels.

## Verification Checklist

After image or UI changes:

- Check `assets/images/discs` still has the 60 live case WebPs.
- Ignore the retained `Pys_disc` source folder when counting live WebPs.
- Check light and dark images are `2915 x 2834`.
- Check thumbnails are `480 x 360` and do not show the blended join.
- Rebuild `app.bundle.js`.
- Reload `http://localhost:8081/Discs/`.
- Open Image cases and confirm labels match the active set: `1/9`, `1/5` or `1/6`.
- Run Primary, Intermediate and Advanced MCQ modals and confirm question counts are `5`, `6` and `8`.
- Check the drawer still says `20 disc cases`.
- Check the browser console for errors.
- Check untouched, partial, routine, limited, fast-glaucoma and urgent states.
- Check the two-step reset does not change the teaching case, viewer preferences, coupled dilation state or achievement.
- Check modal focus trapping and focus restoration.
- Check first load, offline reload and direct-file use separately.
- Confirm local fonts have finished loading before capturing browser evidence.

## Information popup consistency — 23 July 2026

The Quick Guide now has an effective `44 x 44px` close target and the shared `version · date` presentation while retaining its compact visible control and scrollable long-form content. Disc findings, triage and viewer behaviour are unchanged.

## Information-card typography and fit — 23 July 2026

The guide now uses the fleet scale of `14px` title, `12.5px` body, `11px` section labels and `10.5px` version text. The complete long-form reference remains available through a native More detail disclosure. The initial card measured `489.6px` and the expanded detail card `423.3px` at `360 x 740`; neither required internal scrolling. Its simple visible `v1` label and current `23/7/2026` date remain in the shared bottom-right footer position in both states.

## Sidebar consistency — 23 July 2026

The existing actions and optic-disc identity are unchanged. The drawer uses the fleet `14px` title, `11px` section-label and `12.5px` supporting-copy roles where present. Focus entry, Escape closure and trigger-focus return were verified at `360 x 740`; its extensive teaching menu retains deliberate vertical drawer scrolling.

## MCQ consistency — 23 July 2026

Level labels now match the fleet and Cup unlocking requires an explicit Advanced pass. Existing question content, pass marks and optic-disc teaching logic are unchanged.

## Targeted refactor — 26 July 2026

Finding explanations now update only their existing disclosure elements, so teaching-only clicks do not rebuild both eyes or rerun triage. Verified unused helpers and the unreferenced legacy advanced-viewer CSS were removed. Viewer geometry has direct unit protection and `npm run build:check` verifies exact source-to-bundle parity without writing.

The viewer source that is currently identical to Diabetic remains app-local. A parent build-time shared package is deferred until ownership and release handling can be introduced without runtime coupling. Offline and direct-file operation therefore remain independent. Clinical logic, output, wording, layout and optic-disc identity are unchanged. Independent clinical sign-off and physical-device acceptance remain pending.

## MCQ clinical-quality pass — 26 July 2026

The 64-question bank remains 16 Primary, 24 Intermediate and 24 Advanced questions with unchanged 5, 6 and 8-question attempts and existing pass marks. Every question now has a stable ID, concise rationale, source references and an explicit pending-review status. App-mechanics items were replaced, absolute claims about isolated disc signs were narrowed and repeated limited-view, drusen, context and cup-size prompts were diversified into distinct anatomy, gonioscopy, CCT, stereoscopy, multimodal imaging and serial-comparison decisions.

Completed attempts now show correct and selected wrong rows plus a rationale for every item. A real `New attempt` route samples a fresh set, unanswered submission focuses the first missing question and the result has a visible score hierarchy. Submit and New attempt are mutually exclusive, result and action blocks cannot overlap and the drawer settles before the modal opens. MCQ option rows are at least 44px high. Optic-disc triage, referral rules, viewer behaviour and main-page layout were not changed.

## Information purpose pass — 27 July 2026

The existing `i` panel now distinguishes practice cases from patient use: the user records the disc view and signs actually seen for RE and LE. It also states that the output is a triage prompt and does not diagnose the cause. No triage, referral or viewer logic changed. The open panel passed the shared non-scrolling `360 x 740` review.

## Fleet UI alignment — 28 September 2026

The information card now uses a `16px` radius and a measured `44 x 44px` close target. The Exam heading uses the fleet `15px/700/1.2` role. Clean Chromium checks at `360 x 740` found no overflow, no information-card scrolling, correct Escape focus return and no console errors. Triage, referral and viewer logic are unchanged. Physical-device acceptance and independent clinical sign-off remain pending.
