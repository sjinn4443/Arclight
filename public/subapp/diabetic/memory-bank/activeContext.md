# Active Context

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests. The receiving repository uses the lowercase diabetic route; Gallery links and metadata match it.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Production bundle minified from its canonical source. Shipped JavaScript: 167,895 → 89,861 bytes. Mobile Lighthouse performance: 85 → 92/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Viewer navigation and recording controls enlarged; collapsed desktop recording state remains a compact centred column.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Fleet repair receipt — 30 September 2026

Removed direct-file font preload CORS errors while retaining and verifying both local font families. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## 29 September 2026 — shared optical-engine follow-up

Do not restore the mobile brightness-only cataract shortcut: mobile now retains blur, contrast and saturation like desktop. Keep only the selected cataract level visible in the compact control, with accessible slider value unchanged. BIO and clinical logic are unchanged. All 23 tests and bundle parity pass. Cross-app browser evidence: `../../Discs/output/engine-20260929.json`. Physical-device performance is not certified.

## 29 September 2026 — assessment and BIO corrections

Top viewer mode/dilation must not write the patient record. Clinical mode/dilation now live inside Exam; untouched dilation is blank. Reset clears clinical mode/dilation but preserves the teaching viewer. Routine screening requires recorded VA, adequate views and explicit no-signs findings in both eyes. Urgent findings still win with missing data. Preserve same-eye view limitations and distinguish empty findings from recorded no signs.

BIO rotates fundus artwork 180 degrees and swaps edge labels independently of RE/LE reflection. Do not rotate the UI or corneal overlays. Cataract control is full-width beneath the two teaching switches.

23 tests, bundle parity and isolated 360 x 740 browser regressions passed. Browser evidence is under output/playwright/diabetic-fixed-\*.png. Direct-file controls work but local fonts encounter Chromium CORS; HTTP console is clean. Timings remain unchanged and clinical/device approval is pending. Nine MCQs revised without changing stable IDs, counts or scoring. Cache/assets 20260929-audit2.

## v1.1 Engineering and UI Update (23/7/2026)

- Preserve the red `#f04444` identity and Viewer-to-collapsed-Exam geometry.
- A two-step `New assessment` action clears operational examination state while retaining the teaching viewer case and achievement.
- Viewing mode is now a truthful accessible radiogroup. Drawer, popup and modal focus behaviour has been strengthened.
- Local manifest and app-scoped service worker support HTTP(S) installation while `file://` remains usable without a worker.
- `npm run check` passes 20 tests plus bundle parity. Lead desktop-browser review passed at 360 x 740 for initial, expanded, routine, referral, reset, focus, offline and MCQ states. Independent clinical sign-off and physical-device testing remain pending.
- Corrective UI review establishes `12px` grouped controls, a `16px` viewer and image stage and an `18px` Exam shell, with a stronger Exam heading and upright dynamic viewer values without changing the Viewer-to-Exam order.
- The fleet-alignment follow-up uses Swollen Discs as the mobile edge reference. At `360 x 740`, the black stage and Exam shell share `10px` outer margins and `340px` width. The stage uses the shared `16px` radius and shadow while Exam remains an `18px` secondary panel. No clinical, viewer or assessment logic changed.

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
- MCQs use Primary, Intermediate and Advanced banks with IDs, explanations and source-status metadata. Engineering review is complete but independent clinical sign-off remains pending.
- Final UI polish: equal-width VA/View selects, lighter select text and muted mid-grey Temporal/Nasal canvas labels.
- Responsive checks completed at `360 x 740`, `768 x 1024`, `1024 x 768` and `1366 x 768`.
- Latest Lighthouse: mobile `90 / 100 / 100 / 100`; desktop `100 / 100 / 100 / 100`.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Favicon: black square with a centred red `D`.
<!-- APP-DOC-STATUS:END -->

Last updated: 21/5/2026

## Current Focus

The project is at v1 review state. The working app has been built, image cases are wired and the final sweep on 21/5/26 found no console errors. Current focus is now polish, clinical wording review and future local-pathway customisation rather than initial build planning.

## Accepted Product Decisions

- App name is `Diabetic`.
- Appbar is black.
- Title is red.
- Appbar icons are red.
- Focus is diabetic retinopathy only.
- Use `Arclight (DO)` and `Holo (BIO)` as equipment modes.
- Record dilation separately in the main control strip and make the prompt prominent.
- Record both eyes with per-eye view, VA and findings.
- Record right and left VA plus right and left view directly in the Exam box.
- Keep Practice in the side drawer with image cases and MCQs.
- Implement `Arclight (DO) | Holo (BIO)` as a radiogroup with ARIA state and keyboard navigation.
- Use the ten expanded diabetic WebP case images with light and dark pigmentation support.
- Keep output as referral support, not diagnosis.
- Keep treatment choices out of the app.
- Use concise default urgency labels: `Routine (weeks)`, `Soon (days)`, `Urgent (today)` and `Ungradable (repeat)`.
- Use `Routine (weeks)` for routine DR signs referral wording.
- Add a concise red-flags-win line to the popup.
- Do not duplicate mode switching in the drawer for the MVP.
- Keep local referral wording as constants first, not a visible settings screen.
- Use Fundal-style MCQs: Primary `16` bank / `5` round / `3` pass, Intermediate `26` / `6` / `4` and Advanced `26` / `8` / `6`.
- Keep MCQ content clinical, not app-navigation or implementation focused.
- Use Cataract-style compact right and left distance VA dropdowns, not a simple `VA reduced` tick.
- Use BP, lipids and HbA1c tick-boxes as supportive checks.
- Use explicit VA thresholds for triage.
- Make `No referable signs seen` mutually exclusive with lesion findings per eye.
- Let proliferative signs override an ungradable fellow eye.

## Current Clinical Scope

In scope:

- view quality.
- right-eye and left-eye findings.
- dilation status.
- small dilation yes/no reminder.
- area seen.
- DR signs.
- macula-risk signs.
- proliferative signs.
- referral urgency.
- referral note.
- distance VA.
- systemic tick-boxes for BP, lipids and HbA1c.

Out of scope:

- swollen disc.
- cupped disc.
- pale disc.
- arterial occlusion.
- vein occlusion.
- glaucoma warnings.
- DMO confirmation.
- anti-VEGF versus laser choice.

## Current UI Direction

Borrow from:

- Fundal Reflex: appbar, quick guide, drawer, compact mobile layout and radius hierarchy.
- Swollen Discs: visual comparison cards and dark clinical viewing feel where image cards are used.
- Glaucoma: action panel and simple output style.
- Fields: red-flag override logic and referral note discipline.
- Sauron/Mires: practice/sweep training may borrow moving-exam ideas later.
- Fundal/Sauron: MCQ modal structure, level labels, sampled rounds, pass-mark display, scrolling question list and fixed submit button.
- Allan: real route-tab semantics, arrow-key navigation, shared tab rail, flatter inactive tabs and raised active tab.

Avoid:

- Refract-style numeric output confidence.
- large saturated drawer buttons.
- landing-page layout.
- long manual text in the popup.
- duplicate mode controls in the drawer.

## Next Build Step

Next useful work:

1. Review clinical copy and local pathway wording.
2. Tune image compression if deployment size becomes a real constraint.
3. Re-run the final browser and Lighthouse checks after any clinical or asset changes.
4. Keep the memory bank and README updated with dated decisions.

## MCQ consistency status — 23 July 2026

Visible levels use Primary, Intermediate and Advanced. The existing diabetic-retinopathy bank, attempt sizes and scoring are retained. Cup unlocking now requires explicit Advanced pass evidence. Independent clinical review and physical-device acceptance remain pending.

## Current refactor status — 26 July 2026

Disclosure-only finding help no longer invokes the full assessment render. Dead helpers and orphaned advanced-view styles were removed, geometry tests were added and the rebuilt bundle has exact parity. Shared viewer extraction is deliberately deferred to avoid cross-app runtime or release coupling. Clinical behaviour and clinical review status are unchanged.

## MCQ quality status — 26 July 2026

- Corrected the malformed DR-sign item and clarified cotton-wool spot, venous-beading and app-action wording.
- Every question now has a stable ID, concise explanation and declared source status.
- The compact modal has 44px answer rows, visible result and retry controls, a working fresh-attempt path and explicit focus return to the visible menu button.
- Automated tests, source-to-bundle parity and an isolated `360 x 740` browser pass all succeed. The browser evidence has zero horizontal overflow and zero console messages.
- Clinical sign-off remains pending. NHS grading definitions support the reviewed lesion terminology but the app's LMIC referral timings were not inferred from NHS pathways.

## 27 July 2026 - Lighthouse loading remediation

- Initial viewer setup requests only the displayed case rather than prefetching both neighbours.
- Neighbour prefetch remains available after deliberate case or pigmentation navigation.
- The app-scoped service worker still retains the existing offline case set.
- Clean-load browser evidence requested only `case-01.webp` and retained a `360px` document width.
- Lighthouse transfer fell from about `2.26 MiB` to `483 KiB`; FCP and LCP also improved.
- All 21 tests and exact bundle parity pass. Triage rules and thresholds were not changed.
