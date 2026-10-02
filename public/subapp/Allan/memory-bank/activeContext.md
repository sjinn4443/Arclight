# Active Context

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Targeted loading improvements — 30 September 2026

Menu imagery now uses 120 px WebP thumbnails loaded when the drawer opens. Full teaching cards load the untouched original images only when opened, with light and dark skin variants retained. Rebuild thumbnails with `py -3 tools/build-teaching-thumbnails.py`. Initial resource-body bytes: 1,180,801 → 402,935 (65.9% less). Mobile Lighthouse: 71 → 82/100 in separate same-day lab runs.

All nine main-page views at 360 x 740, 768 x 1024 and 1366 x 900 have no horizontal overflow or captured runtime errors. Targeted workflows pass over HTTP, direct-file and installed offline use. Amsler exports with patient/date metadata and a drawn grid mark pass first/repeated Download and mocked native Share; a deliberately failed library fetch recovers on retry. Allan full teaching-card variants and drawer thumbnails pass; Refract simple/advanced fields and completed output pass. These checks preserve functionality but do not claim exhaustive workflow or physical-device acceptance.

Full images and the export library remain precached for offline use, so the startup savings do not describe total offline installation traffic. Local asset queries and app-scoped caches were bumped. Browser tests use temporary viewports. The three retained preview tabs were each verified through real browser chrome at 360 x 740 after switching away and back; their intended loadingFix=20260930 URLs were re-read. Each started at 843 x 1192. Refract is the final selected preview. See [the scoped evidence receipt](../../LOADING_IMPROVEMENTS_20260930.md). This section supersedes the earlier three loading priorities, not the historical clinical review.

## Performance review — 30 September 2026

Runtime source retained. Image delivery is the main remaining load-time opportunity; hidden teaching imagery must keep its existing behaviour. Mobile Lighthouse performance: 70 → 71/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Larger dermoscopy-example controls with clearer line spacing; compact clinical arrangement retained.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## Current implementation — 29 September 2026

Approved audit fixes implemented: incomplete rash reassurance guard, decoded-photo validation with reset cancellation and transactional replacement, denied-storage fallback, modal focus containment and report focus return, explicit unrecorded/teaching report context, navigation-independent report photo requirements, reference loading/error status, readable route tabs and non-scrolling safety-preserving guide disclosures. SCC wording and the Advanced NICE MCQ corrected. Clinical concern overrides the prompt; do not turn the ABCDEFG teaching total into a new referral score. Photos retain original metadata with a visible privacy warning.

29 unit/contract tests, six browser tests and 17 focused assertions pass. All MCQ tiers exercise unanswered, failed, passed and fresh retry paths. Review evidence: `output/playwright/allan-fixes-20260929.json` and `allan-fix-regressions-20260929.json`. Clinical sign-off and physical-device acceptance remain pending. Browser asset/cache key: `20260929-audit2`.

Fleet edge follow-up, 23 July 2026: principal mobile shells measure `x=10`, `width=340` at `360 x 740`; internal logic and workflow are unchanged.

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (21/7/2026)

- Static packaging: open `index.html` directly, or use HTTP for installable offline support and service-worker testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: purple `#a855f7` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

_Last updated: 21/7/2026_

## Current State

Allan is a static app in:

`C:\Users\William\Desktop\Arclight App\Allan`

Current cache-busted review URL:

`http://127.0.0.1:8877/index.html?v=20260721-1`

The app has been iterated in the Codex in-app browser, not Chrome.

## Latest UI Decisions

- First capture button now reads `Location`, not `Limb`.
- The underlying variable and input path still use `limb` naming to avoid unnecessary code churn.
- Location picker is custom rather than a native dropdown so each option can have an icon.
- The repeated `Location` label in the context row was removed; the capture button already provides that wording.
- Pin icon beside the old Location label was rejected and removed.
- The location picker menu was narrowed to `156px`.
- `Your image` uses a dark muted camera empty state until a user image is present.
- Expand controls are hidden for empty user-image state.
- Illustrative reference and user images use a tap expand button that opens a persistent enlarged comparison with an `X` close control.
- Main comparison-stage labels are visually hidden to save vertical space; expanded image comparison labels the AI-generated side as `Illustrative ref` and the user's side as `Your image`.
- Visible route tabs use plain workflow names: the ABCDEFG checklist is shown under `Lesion` and `DPIC-R` is shown as `Rash`.
- Route controls are now a real compact tab strip with `role="tablist"`, `role="tab"`, `role="tabpanel"`, selected state and arrow-key navigation.
- The route strip uses a shared tab rail, flatter inactive tabs and a raised active tab so it reads less like four action buttons.
- The route strip deliberately gives Lesion and Dermoscopy the main left-hand space; Rash and Wood's are a smaller right-hand secondary pair, separated by a gap.
- The active route tab uses its raised shape, border and a subtle inset blue accent to carry the selected state.
- The skin type switch uses the original compact width. The site picker is capped narrower so the context row has more breathing space around the skin-type control.
- The shell remains phone-first and is capped at `430px` on larger screens; expanded modal surfaces may reach `520px`.
- Location picker menu icons are slightly larger than the closed-picker icon for easier scanning. The menu is tall enough for the current options without normal scrolling.
- Arm and Leg use custom CSS anatomy marks; Foot retains the locally bundled Font Awesome shoe-print icon.
- Expanded `Lesion` and `Dermoscopy` references have an optional `Teaching` toggle.
- The Lesion reference has a small previous/next carousel with arrows only. It cycles through the base image and five paired light/dark variation images without randomising on load.
- ABCDEFG teaching mode has visible image callouts for image-visible features and a separate symptoms note because symptoms are usually history.
- Dermoscopy now uses a Chaos + Clues teaching compression: chaos, four clue rows and a separate exception row.
- Dermoscopy grouping is visually separated by blue Chaos, teal Clues and red Exception fills without extra left accent bars on the rows.
- Dermoscopy teaching mode keeps four image-visible callouts and leaves vessel / special site and exception as written checks so the reference image does not get crowded.
- Lesion, Rash and Wood's lamp row explanations now use the same inline chevron/dropdown pattern as Dermoscopy.
- Dermoscopy checklist rows use subtle colour accents instead of repeated mini section headings.
- The Dermoscopy reference now has the same small previous/next carousel as Lesion. It cycles through the base image and the five paired light/dark example images from `dermoscopy-examples/chaos-clues-01_light.webp` through `chaos-clues-05_dark.webp`.
- The side menu labels teaching cards by content: `ABCDEFG card` and `Chaos + Clues card`. They open the paired light/dark card images full-screen and use the current skin type setting.
- Wood's lamp colour swatches are short fluorescent gradient rectangles matched to the composite reference image. `Bright blue-white` stays icy blue-white and the final `White` swatch is kept genuinely white.
- Wood's lamp includes a compact technique caveat about using a blacked out room and false fluorescence from products or lint.
- Wood's lamp rows use tighter spacing to reduce scrolling on a 350x740 layout.
- Dermoscopy bucket rows use chevron inline expanders instead of small `i` popovers; only one bucket detail should be open at a time.
- Expanded row details use short GP-facing clinical reminders and avoid repeated formal clue lists.
- Row detail copy avoids checkbox-style phrasing where the row already makes the action clear.
- The chaos detail explains half-to-half comparison of dermoscopy colour and internal pattern; an odd outline alone is not counted as chaos.
- Teaching legend items are clickable and reuse the shared explanation pop-up.
- Info icons are small, muted and low-key.
- Info pop-ups do not repeat the row title.
- Quick Guide and referral-source pop-ups explicitly state that ABCDEFG and DPIC-R totals are teaching only, summarise the explicit pathway triggers and identify airway swelling or breathing difficulty as an emergency.
- The referral-source pop-up is viewport-capped and scrollable so the full wording remains usable at `360 x 740`.
- Report opens a Fundal Reflex style pop-out with `Copy note` and `Share note + photos` actions.
- Report sharing attaches uploaded photos where browser support allows.
- Report route wording follows recorded findings rather than whichever tab is open when Report is pressed.
- Wood's lamp has an explicit assessment selector. Opening its tab alone does not record use; a selected finding is retained in the report even after changing tabs.
- Rash fields start at `Not selected`. Selecting a benign zero-value answer marks the section assessed but does not create concern or inherit another field's default score.
- Referral ties use an explicit action rank rather than route order. Equal-level lesion and rash concerns consistently resolve to `Photo + Review`.
- Photo expectations are route-aware: lesion assessments expect Location, Close and Dermoscopy while rash or Wood's lamp routes expect Location and Close.
- Image uploads accept JPEG, PNG and WebP up to `12 MB`, including drag-and-drop validation and an accessible error status.
- Reference-image failures use a route and skin-tone appropriate base image. If no valid route fallback loads, the misleading image is hidden.
- Fresh load and fully cleared criteria show `Not assessed yet`, not routine. Untouched report sections show `not assessed`, not a default prompt score.

## Current Clinical Copy Decisions

- `Blue-green - M. tinea capitis` is used as the compact Wood's lamp row label; the detail text still spells out Microsporum tinea capitis.
- `Yellow-orange - Pityriasis versicolor`, not yellow-green.
- ABCDE asymmetry includes shape or colour.
- The visible lesion checklist follows A, B, C, D, E, F and G, with `Funny-looking / ugly duckling` before `Gives symptoms`.
- The D item is `Dark`, not `Diameter`, to keep the quick lesion screen focused on dark, different or changing lesions. Size is covered through evolution/recent change if the lesion is growing.
- The Symptoms item is italicised because it is partly history/surface-change rather than the same type of visual morphology check as A, B, C, D, E and U.
- Border help wording uses uneven, blurred, notched or ragged.
- Dermoscopy uses the Chaos + Clues route: first look for chaos, then `If chaos: check clues` colour, structure, edge growth and vessels/nail, with a separate exception row that escalates even without chaos.
- The four clue rows are disabled and greyed until chaos is ticked; unticking chaos clears any clue ticks to avoid stale scoring.
- Palm/sole ridge pigment belongs in the exception row because the Rosendahl Chaos + Clues paper lists parallel ridge pattern as an exception even without chaos.
- Chaos plus any clue, or a dermoscopy exception, maps to `Susp cancer pathway (2 week wait)`.
- Rash red flags specify widespread or painful blistering.
- Rash duration says new or worsening rashes are more concerning than stable long-standing rashes.
- Cancer pathway wording is `Susp cancer pathway (2 week wait)`.
- ABCDEFG is an internal teaching prompt, not the NICE weighted 7-point checklist. Any recorded ABCDEFG concern maps to `Photo + Review`; its total never sets a cancer-pathway referral.
- `DPIC-R` is an Allan teaching prompt, not a recognised formal score.
- DPIC-R totals never set operational urgency. Explicit red flags alone set same-day or emergency urgency; other clinically concerning rash selections map to `Photo + Review` and benign selections remain routine.
- ABCDEFG and dermoscopy are separate pigmented lesion checks; the app uses highest urgency, not an added total.
- BCC-like rolled or pearly non-healing sores remain routine referral prompts. Keratinised/tender lesions or explicit rapid growth, persistent ulceration or bleeding are SCC concerns and map to the suspected cancer pathway.
- Wood's lamp is supportive for rash-route fluorescence clues, is recorded only from its assessment selector and does not change urgency by itself.

## Current Assets

All active WebP assets are now `960 x 960`. The 39-file image payload was reduced by approximately `3.51 MiB` after numerical and side-by-side visual checks.

- `assets/images/abcde-su_light.webp`
- `assets/images/abcde-su_dark.webp`
- `assets/images/abcde-su-card_light.webp`
- `assets/images/abcde-su-card_dark.webp`
- `variations/abcde-su-variation-01_light.webp` through `variations/abcde-su-variation-05_dark.webp`
- `assets/images/chaos_light.webp`
- `assets/images/chaos_dark.webp`
- `assets/images/chaos-card_light.webp`
- `assets/images/chaos-card_dark.webp`
- `assets/images/dpic-r_raised-bumps_light.webp`
- `assets/images/dpic-r_raised-bumps_dark.webp`
- `assets/images/dpic-r_blisters-pustules_light.webp`
- `assets/images/dpic-r_blisters-pustules_dark.webp`
- `assets/images/dpic-r_flat-patches_light.webp`
- `assets/images/dpic-r_flat-patches_dark.webp`
- `assets/images/dpic-r_eczema-dermatitis_light.webp`
- `assets/images/dpic-r_eczema-dermatitis_dark.webp`
- `assets/images/dpic-r_psoriasis-plaques_light.webp`
- `assets/images/dpic-r_psoriasis-plaques_dark.webp`
- `assets/images/uv-reference.webp`

The old `celt` reference asset is no longer part of the active reference flow. It should not be used for the `Your image` empty state.

## Verification So Far

- `node --check script.js` passes after current changes.
- `node --check mcq-bank.js` passes after current changes.
- `node --check referral-logic.js` passes after current changes.
- `npm test` passes all 20 referral, MCQ and app-contract checks.
- `npm run test:ui` passes all three Chrome smoke tests for the compact shell, reset flow and offline reload.
- In-app browser checks confirmed:
  - empty user image state
  - location picker open and option select
  - info pop-ups across tabs
  - Rash pattern reference switching
  - skin type reference switching
  - report blank state and report generation
  - ABCDEFG teaching overlay
  - dermoscopy teaching overlay
  - high ABCDEFG teaching totals remain `Photo + Review`
  - explicit SCC findings map to the suspected cancer pathway
  - benign rash selections remain routine and concerning patterns map to `Photo + Review`
  - explicit rash red flags map to same-day or emergency urgency
  - fully cleared rash fields return to `Not assessed yet`
  - Wood's lamp is absent when not performed and persists in the report when explicitly recorded
  - equal-priority lesion and rash findings resolve consistently
  - compact Wood's lamp assessment layout at `360 x 740`
  - no console errors in recent checks
- Runtime fonts and the 18 used Font Awesome solid icons are bundled locally; no runtime CDN URL remains.
- Arm and leg location choices now use bespoke monochrome anatomy marks rather than a fist or whole-person symbol.
- The additional SCC warning is compacted to `Fast growth, non-healing ulcer or bleed`, with the full clinical explanation retained in its detail panel; it fits on one line at `360 x 740`.
- Capture previews use object URLs while original `File` objects are retained for neutral-name sharing; base64 conversion is no longer used.
- `New` provides a two-step patient-data reset and leaves MCQ achievements intact.
- Route-aware photo readiness is visible beside the referral result.
- The location listbox supports Arrow Up/Down, Home, End, Enter, Space and Escape, and internal menu scrolling no longer closes it.
- `manifest.webmanifest` and `service-worker.js` pre-cache the complete app and reference set for offline use over HTTP or HTTPS.
- Allan is `v1.2`; implementation and documentation were re-audited on 21 July 2026 and external clinical sign-off remains pending in `CLINICAL_REVIEW.md`.
- DOM and asset-contract checks show no duplicate IDs, missing controlled targets or missing referenced files.
- `ALLAN_V1.2_SPRINT_UPGRADE_PLAYBOOK.md` is the standalone hand-off for upgrading sibling Arclight apps without copying Allan-specific clinical rules blindly.

## Open Work

- Consider whether rash morphology images should ever get teaching overlays; avoid diagnostic overlays for red flags.
- Complete independent clinical sign-off before field deployment.
- Complete `DEVICE-TEST-CHECKLIST.md` on a physical constrained Android handset.

## MCQ consistency status — 23 July 2026

Allan remains the clinical and engineering reference. Visible level names are Primary, Intermediate and Advanced. Its dermatology questions, scoring, progression and clinical content were not changed. Independent clinical sign-off and physical-device acceptance remain pending.

## Report icon follow-up — 24 July 2026

- The result-bar Report button now carries the complete red circular `R` badge used by Amsler.
- The change is presentation-only. New-assessment, report generation and referral behaviour are unchanged.
- The browser-visible stylesheet and service-worker cache use `20260724-report5`.
- The circular badge is a local inline SVG, so its circle and `R` remain visible while an older stylesheet cache is being replaced.
- The SVG uses a fresh class name so stale CSS cannot add a second outer ring.
- Versioned shell assets now use network-first refresh with an offline cache fallback, preventing an older service worker from masking updated CSS after activation.
- All 21 contract, cache, MCQ and referral tests pass.
- Isolated Chrome review at `360 x 740` measured no horizontal overflow and no console errors.

## 26 July 2026 — refactor hardening

- Fixed service-worker activation so cache deletion is restricted to the `allan-` prefix.
- Extracted patient-photo `File` and object-URL ownership to `photo-file-store.js`.
- Added direct tests for replacement URL revocation, deliberate clearing and established JPEG/PNG/WebP plus 12 MB validation.
- Kept referral logic, report wording, MCQ content, UI layout and clinical sign-off status unchanged.

## 26 July 2026 — 360 x 740 scrollbar correction

- A permanent browser regression check measured all four main routes at the configured `360 x 740` viewport.
- The Lesion route was `744px` high, giving 4px of document overflow. The other three routes already fitted.
- On short screens, only the five Lesion outer-shell gaps change from `4px` to `3px`.
- No content is hidden. Referral logic, report behaviour, assessment state, controls and the other routes are unchanged.
- Versioned shell assets and the app cache use `20260726-fit1`.
- All 26 Node checks and all five Playwright checks pass, including HTTP, direct-file, reset and offline coverage.

## 26 July 2026 — MCQ clinical-quality audit

- Retained Allan's 53 questions, tiering, sample sizes, pass marks, progression and clinical wording after a current source review found no concrete defect.
- Added stable IDs and explicit pending clinical-sign-off metadata to the bank.
- Added `44px` answer rows, result-first actions and a real fresh-question retry while preserving focus return and cup progress.
- Browser-visible MCQ assets and the app cache use `20260726-mcqquality1`.
- All 26 Node checks and six Playwright checks pass at `360 x 740`.

## 27 July 2026 - Lighthouse remediation

- The initial ABCDEFG reference uses `abcde-su-preview_light.webp` or its dark partner at `480 x 480`; the expand action retains the original `960 x 960` source through `data-full-src`.
- The route-tab wrapper is now a compatible `div[role="tablist"]`.
- Meaningful compact labels use a `12px` floor. The measured main page remains `360px` wide with no capture-control collision.
- Lighthouse now reports `76 / 100 / 100 / 100`, `99.07%` legible text and about `124 KiB` less initial transfer than the fleet baseline.
- All 28 Node checks pass. Referral, report and patient-photo logic remain unchanged.
