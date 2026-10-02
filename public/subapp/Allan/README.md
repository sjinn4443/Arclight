# Allan

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Targeted loading improvements — 30 September 2026

Menu imagery now uses 120 px WebP thumbnails loaded when the drawer opens. Full teaching cards load the untouched original images only when opened, with light and dark skin variants retained. Rebuild thumbnails with `py -3 tools/build-teaching-thumbnails.py`. Initial resource-body bytes: 1,180,801 → 402,935 (65.9% less). Mobile Lighthouse: 71 → 82/100 in separate same-day lab runs.

All nine main-page views at 360 x 740, 768 x 1024 and 1366 x 900 have no horizontal overflow or captured runtime errors. Targeted workflows pass over HTTP, direct-file and installed offline use. Amsler exports with patient/date metadata and a drawn grid mark pass first/repeated Download and mocked native Share; a deliberately failed library fetch recovers on retry. Allan full teaching-card variants and drawer thumbnails pass; Refract simple/advanced fields and completed output pass. These checks preserve functionality but do not claim exhaustive workflow or physical-device acceptance.

Full images and the export library remain precached for offline use, so the startup savings do not describe total offline installation traffic. Local asset queries and app-scoped caches were bumped. Browser tests use temporary viewports. The three retained preview tabs were each verified through real browser chrome at 360 x 740 after switching away and back; their intended loadingFix=20260930 URLs were re-read. Each started at 843 x 1192. Refract is the final selected preview. See [the scoped evidence receipt](../LOADING_IMPROVEMENTS_20260930.md). This section supersedes the earlier three loading priorities, not the historical clinical review.

## Performance review — 30 September 2026

Runtime source retained. Image delivery is the main remaining load-time opportunity; hidden teaching imagery must keep its existing behaviour. Mobile Lighthouse performance: 70 → 71/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Larger dermoscopy-example controls with clearer line spacing; compact clinical arrangement retained.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

## Audit fixes — 29 September 2026

Implemented the approved findings in `AUDIT_2026-09-29.md`. Incomplete low-risk rash entries show **Check red flags**, while recorded urgent findings still win. Photos must decode before readiness or replacement, empty/corrupt images are rejected and pending loads cannot survive New. Reports distinguish unrecorded location and teaching skin tone from patient findings and no longer change photo requirements merely on navigation. Storage denial is tolerated, modal focus stays inside and report closure restores focus. Reference loading/failure is explicit. All four tabs are readable and guide disclosures retain purpose, emergency advice and privacy.

Clinical wording now identifies concerning SCC rather than scale alone, exposes the unwell non-blanching emergency example and provides a visible clinical-concern override for lesion findings. The Advanced weighted-checklist MCQ now matches NICE NG12 1.7.1. No new clinical score or referral timing was introduced. Original photo metadata is retained and disclosed.

Verification: 29 unit/contract tests, six existing browser tests and 17 focused regression assertions pass. All-tier unanswered/fail/pass/retry/progression checks pass. HTTP, direct-file and offline shell checks pass in isolated Chrome. Screenshots and JSON evidence are under `output/playwright/allan-fixes-*` and `allan-fix-regressions-20260929.json`. Untouched and selected states plus both guide disclosures fit 360 x 740. Independent clinical sign-off and physical-device acceptance remain pending.

Fleet edge follow-up, 23 July 2026: the principal mobile shells now use exact `10px` outer margins and `340px` width at `360 x 740`. Internal capture, assessment and referral logic is unchanged.

Report-control follow-up, 24 July 2026: the compact result-bar Report button now uses the same red circular `R` badge as Amsler. Versioned shell assets refresh from the network before falling back to their offline copy. Report generation and referral logic are unchanged.

<!-- APP-DOC-STATUS:START -->

## Current Status (24/7/2026)

- Release: `v1.2`; implementation and documentation re-audited 21 July 2026 with a report-control UI follow-up on 24 July 2026; independent clinical sign-off remains pending.
- Static packaging: open `index.html` directly, or use HTTP for installable offline support.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: purple `#a855f7` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Mobile-first dermatology teaching and referral-aide app for Arclight image capture, visual comparison and structured rash or lesion triage.

The working review size is `360 x 740`. The app is a static browser page and is currently reviewed through the Codex in-app browser at a local static-server URL.

All runtime fonts and icons are bundled locally. The app makes no CDN request during normal use. A manifest and service worker pre-cache the complete app shell and all active reference images when Allan is served over HTTP or HTTPS.

## Purpose

Allan helps a GP or learner collect a useful image set and compare the current case with compact illustrative reference images. These are AI-generated teaching images rather than real patient photographs. It supports clinical pattern recognition and referral urgency. It is not a final diagnosis tool.

## Core Workflow

1. Capture or upload the image set:
   - `Location`: wider anatomical context image
   - `Close`: close-up clinical image
   - `Dermoscopy`: dermoscopy image
2. Choose context:
   - anatomical location
   - skin type context: `Light` or `Dark`
3. Choose the relevant tab:
   - `Lesion`
   - `Dermoscopy`
   - `Rash`
   - `Wood's lamp`
4. Compare the left illustrative reference image with the right user image.
5. Tick or select the closest findings.
6. Use the referral panel as a rough guide.

## Current Feature Set

- Fundal Reflex style app shell:
  - black app bar
  - purple centred `Allan` title
  - left burger menu
  - right quick guide icon
  - compact white panels over a soft page background
- Top capture row:
  - `Location`
  - `Close`
  - `Dermoscopy`
  - active capture source highlighted by the selected tab
  - JPEG, PNG and WebP validation with a `12 MB` limit for picker and drag-and-drop uploads
  - original `File` objects are retained for sharing while object URLs drive previews, avoiding base64 expansion on low-memory devices
- Quick guide includes photo expectations:
  - `Area/limb`: site plus nearby skin
  - `Close-up`: fill frame and keep in focus
  - `Dermoscopy`: glare-free detail
- Context row:
  - custom location picker with small icons beside each site option
  - hidden native `#lesionLocation` select kept in sync
  - Arrow Up/Down, Home, End, Enter and Escape keyboard support
  - skin type toggle with explicit `Skin type` caption and `Light` / `Dark` label
- Tab order:
  - `Lesion`
  - `Dermoscopy`
  - `Rash`
  - `Wood's lamp`
  - subtle route divider between the lesion checks and right-hand rash/Wood's lamp pair
  - route controls use real tab semantics and arrow-key navigation
  - visual treatment uses a shared tab rail with flatter inactive tabs and a raised active tab
- Side menu:
  - `Photo capture`
  - `Illustrative refs`
  - `Primary MCQ`
  - `Intermediate MCQ`
  - `Advanced MCQ`
  - `Report`
  - compact Dermoscopy examples under `Illustrative refs`; tapping one switches to Dermoscopy and swaps the illustrative ref
  - MCQ modal uses the Fundal Reflex level-button look, compact question cards and pass/fail feedback
  - MCQ banks: Primary `15`, Intermediate `18`, Advanced `20`
  - Swollen Discs style level awards: passing a level adds a star, unlocks the next MCQ level and completing Advanced unlocks the Allan cup with a local saveable certificate code
- Comparison stage:
  - fixed image stage size across tabs
  - left side shows the current illustrative reference image
  - right side shows the relevant uploaded image
  - right side uses a muted dark camera placeholder when empty
  - expand icon opens a persistent enlarged comparison with an `X` close control
  - expanded `Lesion` and `Dermoscopy` illustrative references have an optional `Teaching` toggle
  - teaching legends are clickable and reuse the same explanation pop-up pattern
- Illustrative reference image behaviour:
  - `Lesion` uses `assets/images/abcde-su_light.webp` or `assets/images/abcde-su_dark.webp`
  - `Lesion` contains the melanoma-like ABCDEFG checklist plus JFK close-up signs
  - `Dermoscopy` uses `assets/images/chaos_light.webp` or `assets/images/chaos_dark.webp`
  - Dermoscopy side-menu examples live in `dermoscopy-examples/chaos-clues-01_light.webp` through `chaos-clues-05_dark.webp`
  - `Rash` switches reference image by pattern and skin type
  - `Wood's lamp` uses `assets/images/uv-reference.webp` as a combined fluorescence reference
  - failed assets use a route and skin-tone appropriate base reference rather than an unrelated lesion image
- User image behaviour:
  - `Lesion`: compares against `Close`
  - `Dermoscopy`: compares against `Dermoscopy`
  - `Rash`: compares against `Close`
  - `Wood's lamp`: compares against `Close`
- Low-key info buttons:
  - added beside lesion, dermoscopy, rash and Wood's lamp entries
  - plain GP-level explanations
  - British English clinical wording
  - pop-ups do not repeat the row title
  - tap away, Escape, tab change, scroll or resize closes them
- Referral panel:
  - compact `Referral` result with green / amber / orange / red dot
  - inline `Logic + sources` info button beside `Referral`
  - low-key `Report` button with the shared compact red circular `R` badge
  - route-aware `Photos 0/3`, `Photos 0/2` and ready status
  - two-step `New` action clears patient photos and assessment selections without clearing MCQ achievements
  - Fundal Reflex style report pop-out with `Copy note` and `Share note + photos` actions
- report modal builds a compact mini referral note from current selections
  - untouched prompt sections show `not assessed` rather than a default score
  - share action attaches uploaded area/limb, close-up and dermoscopy photos where browser support allows
  - fresh load and fully cleared findings show `Not assessed yet`, not routine
  - expected photo set follows the recorded route
  - Wood's lamp use follows its explicit assessment selector rather than the active tab
- Privacy and release safety:
  - Quick Guide states that photos remain in the browser session unless Share is chosen
  - New revokes object URLs and clears the current case before the next patient
  - direct clinical-source links and review status are visible in the Quick Guide
  - independent clinical sign-off is recorded as pending in `CLINICAL_REVIEW.md`
- Rash red flag control:
  - same-day and emergency selections receive restrained red/orange styling
  - dropdown labels spell out the same-day and emergency triggers
  - Dermoscopy now uses Chaos + Clues rather than the old internal BVPDS teaching prompt
  - `DPIC-R` is documented as a dermatology teaching prompt, not a recognised formal score

## Clinical Content

### Lesion

ABCDEFG checklist:

- Asymmetry
- Border irregular
- Colour variation
- Dark
- Evolution / recent change
- Funny-looking / ugly duckling
- _Gives: itch, bleed, ooze, crust_

JFK close-up signs inside `Lesion`:

- J: rolled/pearly sore that will not heal
- F: fine surface vessels
- K: keratinised, scaly or tender
- Rapid growth, persistent ulcer or bleeding as an additional SCC concern

Current teaching score and routing:

- Asymmetry, border irregular, colour variation and evolution/recent change score `2`
- Dark, funny-looking / ugly duckling and gives symptoms score `1`
- size is handled under evolution/recent change when a lesion is getting bigger
- the score is an internal teaching prompt, not the NICE weighted 7-point checklist
- any recorded ABCDEFG concern maps to `Photo + Review`; the teaching total does not set a cancer-pathway referral
- BCC features map to routine referral
- SCC signs map to Susp cancer pathway (2 week wait)

Expanded teaching mode:

- image callouts mark visible image features only
- gives symptoms is listed as a separate clickable note because symptoms are usually history or visible crusting, not a reliable marker on the image
- each legend item opens the relevant explanation pop-up

### Dermoscopy

Dermoscopy checklist using the Chaos + Clues route:

- Chaos: uneven colour or structure
- Colour
- Structure
- Edge growth
- Vessels / nail
- Exception

The visible checklist is a frontline teaching compression. Info pop-ups map the buckets back to the formal clues:

- Colour: grey, blue or white areas/lines, or black dots/clods at the lesion edge
- Structure: off-centre blank-looking area, thick dark network or thick branched lines
- Edge growth: one-sided streaks or pseudopods at the edge
- Vessels / nail: mixed vessel patterns or chaotic nail pigment
- Exception: changing pigmented lesion in an adult, pigmented nodule, grey on the head/neck or palm/sole ridge pigment

Current logic:

- chaos plus any clue maps to Susp cancer pathway (2 week wait)
- any exception maps to Susp cancer pathway (2 week wait)
- clue rows are greyed and cannot be ticked until chaos is selected
- unticking chaos clears the clue rows so stale dermoscopy scoring cannot remain
- chaos alone prompts the user to check dermoscopy clues before relying on the route
- clue recorded without chaos remains a defensive fallback in logic rather than the normal UI path

Expanded teaching mode:

- four image-visible Chaos + Clues callouts
- no outline oval in the Dermoscopy teaching overlay
- each legend item opens the relevant explanation pop-up
- main Dermoscopy bucket rows use inline expandable detail; only one row is intended to be open at a time

### Rash

Rash triage fields using the DPIC-R teaching prompt:

- Duration: `New or worsening` or `Long-standing or stable`
- Pattern: `Blisters or pustules`, `Raised bumps`, `Flat patches`, `Eczema / dermatitis-type` or `Psoriasis-type plaques`
- Itch: `Severe itch` or `Mild or none`
- Colour: `Redness or swelling` on light skin context or `Darkening, purple-grey change or swelling` on dark skin context
- Red flags: `None`, `Same-day concern` or `Emergency signs`

Current routing:

- explicit red flags override the teaching prompt and set urgency directly
- `Same-day concern` maps to `Same day`
- `Emergency signs` maps to `Emergency (now)`
- without explicit red flags, any clinically concerning rash selection maps to `Photo + Review`; benign selections remain routine
- the DPIC-R total remains visible as a teaching prompt but does not set operational urgency
- each field starts at `Not selected`, so untouched defaults cannot affect the total or referral state

Rash reference assets:

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

### Wood's lamp

Wood's lamp guide:

- Blue-green - `M. tinea capitis`
- Yellow-orange - `Pityriasis versicolor`
- Coral-red - `Erythrasma`
- Bright blue-white - `Vitiligo`
- Orange-red - `Acne porphyrins`
- White - head lice nits
- an explicit assessment selector records whether the lamp was performed and the observed fluorescence
- merely opening the Wood's lamp tab does not add it to the report
- reference asset: `assets/images/uv-reference.webp`

## Run Locally

1. Open a terminal in this folder.
2. Start a static server:
   `python -m http.server 8877`
3. Open:
   `http://127.0.0.1:8877/index.html?v=20260721-1`

The query string is only for cache busting during review.

## Files

- `index.html`: app markup, quick guide, capture row, location picker, tabs, MCQ modal and info pop-up shell
- `styles.css`: app-shell styling, responsive compact layout, comparison stage, teaching overlays, full-screen teaching card, location picker, empty image state, MCQ modal, report pop-out and pop-ups
- `referral-logic.js`: pure referral evaluator, canonical action labels and shared clinical explanation copy
- `photo-file-store.js`: tested original-`File` and revocable object-URL lifecycle for the three patient-photo slots
- `script.js`: DOM state reading, reference switching, image capture, teaching overlays, location picker, MCQ UI, pop-ups, report sharing and app-shell events
- `mcq-bank.js`: MCQ question banks loaded before the main script
- `tests/referral-logic.test.js`: Node regression tests for referral priorities, ties and red flags
- `tests/mcq-bank.test.js`: MCQ structure, answer-membership and uniqueness tests
- `tests/photo-file-store.test.js`: original-file retention, object-URL replacement, reset and validation tests
- `tests/app-contract.test.js`: DOM, runtime asset, object-URL, release-status and offline-cache contracts
- `e2e/allan.spec.js`: Chrome smoke tests for the compact shell, keyboard picker, reset and offline reload
- `manifest.webmanifest` and `service-worker.js`: installable offline app shell and complete reference-asset cache
- `CLINICAL_REVIEW.md`: source set, deployment status and human clinical sign-off record
- `DEVICE-TEST-CHECKLIST.md`: constrained-device acceptance checklist and physical-test status
- `ALLAN_V1.2_SPRINT_UPGRADE_PLAYBOOK.md`: standalone cross-app hand-off for applying the sprint's reusable patterns to sibling Arclight apps
- `abcde-su_*.webp`: ABCDEFG reference images
- `abcde-su-card_*.webp`: full-screen ABCDEFG teaching card images shown from the side menu
- `variations/abcde-su-variation-*_*.webp`: flick-through Lesion reference variations
- `chaos_*.webp`: Dermoscopy Chaos + Clues reference images
- `chaos-card_*.webp`: full-screen Chaos + Clues teaching card images shown from the side menu
- `dpic-r_*.webp`: rash pattern reference images
- `assets/fonts/`: bundled Inter, Quicksand and Font Awesome solid fonts plus the Font Awesome licence
- `memory-bank/*.md`: continuity notes

All active WebP assets are `960 x 960`. This keeps sufficient detail for the expanded phone view while reducing the image payload by about `3.51 MiB`.

## Quick Checks

- Syntax:
  - `node --check referral-logic.js`
  - `node --check mcq-bank.js`
  - `node --check photo-file-store.js`
  - `node --check script.js`
- Logic tests:
  - `npm test`
- Browser regression tests:
  - `npm install`
  - `npm run test:ui`
- Browser review:
  - use the Codex in-app browser
  - target `360 x 740`
  - verify no console errors
  - verify the page still fits after changing text or image sizes

## Design Rules

- Use British English in visible text.
- Avoid Oxford commas.
- Keep GP-level wording: plain, practical and clinical.
- Do not make the tool feel like a landing page.
- Keep controls compact, muted and touch-friendly.
- Preserve the Fundal Reflex look:
  - black app bar with purple title and icons
  - soft white panels
  - dark clinical image stage
  - restrained blue-grey borders
  - low-key info icons
- Illustrative reference images should be visually useful, not decorative.
- Missing user image should show an empty state, not a clinical placeholder.
- Clinical copy should use caution words such as `can support`, `may` and `not a stand-alone diagnosis` where appropriate.

## Information popup consistency — 23 July 2026

The Quick Guide now receives keyboard focus when opened, returns focus to the app-bar information button when closed and keeps a compact visible close control with an effective `44 x 44px` target. Its existing content, version and clinical boundaries are unchanged.

## Information-card typography and fit — 23 July 2026

The guide now uses the fleet scale of `14px` title, `12.5px` body, `11px` section labels and `10.5px` version text. Secondary route detail and clinical sources remain available through native disclosures. The initial card measured `590.7px`, expanded route detail `378.7px` and expanded sources `296.3px` at `360 x 740`; none required internal scrolling. Its simple visible `v1` label and current `23/7/2026` date now occupy the shared bottom-right footer position.

## Main-page typography review — 23 July 2026

The four assessment tabs now share the same `10.88px` type size so selection is conveyed by weight, colour and border rather than a size jump. Skin-type, lesion-check, result and photo-readiness labels now use a legible `10–10.4px` tertiary scale. The clinical workflow, tab order and Allan identity are unchanged.

## Sidebar consistency — 23 July 2026

The existing menu content and purple identity are unchanged. The drawer now follows the fleet role map of `14px` title, `11px` section labels and `12.5px` supporting copy where present. Opening moves focus inside, Escape closes the drawer and focus returns to the menu trigger. Its longer reference content may use deliberate vertical drawer scrolling at `360 x 740`.

## MCQ consistency — 23 July 2026

The level names are now the fleet-standard Primary, Intermediate and Advanced. Allan's established question bank, pass rules and dermatology content are unchanged.

## Refactor hardening — 26 July 2026

Patient-photo file ownership now lives in `photo-file-store.js` rather than the main controller. The store retains each original `File`, revokes replaced object URLs and clears all three capture slots deliberately. Three direct unit tests protect replacement, reset and validation behaviour.

The service worker now deletes only superseded caches whose names begin with `allan-`. It can no longer remove a sibling Arclight app's cache on a shared origin. The clinical referral engine, assessment workflow, report wording, MCQs and visible layout are unchanged.

## 360 x 740 scrollbar correction — 26 July 2026

The Lesion route was measured at `744px` high in a `740px` viewport, producing a 4px document scrollbar. At short screen heights only, its five outer shell gaps are now `3px` rather than `4px`. No content is hidden and no card, control, workflow or clinical rule changed.

The browser-visible shell and app cache use `20260726-fit1`. All 26 Node checks and all five Playwright checks pass. The browser suite now protects every main route against document overflow at `360 x 740` and also checks the Lesion route through `file://`.

## MCQ clinical-quality and interaction audit — 26 July 2026

All 53 source-labelled questions were rechecked against the current NICE skin-cancer referral recommendations, NICE drug-allergy guidance and NHS England teledermatology guidance. No evidence-backed change to Allan's dermatology content, tiering, sampling or pass marks was identified.

The bank now exposes stable question IDs and an explicit pending clinical-sign-off status for repeatable QA. The modal keeps its established progression and cup behaviour while adding `44px` answer rows, a result-first action area and a genuine fresh-question retry after marking. Unanswered submission still returns focus to the first missing answer and closing restores focus to the launcher. Browser-visible MCQ assets and the app cache use `20260726-mcqquality1`.

Verification: `npm test` passes 26 checks and `npm run test:ui` passes six isolated Chrome checks at `360 x 740`, including the new Primary MCQ guard, feedback, rationale, fresh retry and touch-target coverage. Physical-device acceptance and independent clinical sign-off remain pending.

## Information purpose pass — 27 July 2026

The existing `i` panel now says plainly that the user adds the photographs and observed findings, Allan prepares referral prompts and the clinical decision remains with the user. No clinical, referral, image or layout logic changed. The open panel passed the shared non-scrolling `360 x 740` review.

## Lighthouse remediation - 27 July 2026

The initial ABCDEFG reference now uses a visually checked `480 x 480` preview and retains the original `960 x 960` image for the expand action. The route-tab container now uses compatible tab-list semantics. Meaningful compact labels use a measured `12px` floor while badges and icon-only cues remain compact.

The final isolated `360 x 740` review found a `360px` document width, collision-free capture controls and no console errors. Lighthouse improved from `72 / 99 / 96 / 100` to `76 / 100 / 100 / 100`. Initial transfer fell by about `124 KiB` and the legibility audit improved from `50.41%` to `99.07%`. All 28 Node checks pass. Referral logic, clinical wording and image-capture behaviour are unchanged.

## Fleet UI alignment — 28 September 2026

The information card now uses the shared `16px` radius and a measured `44 x 44px` close target. A two-pixel mobile overflow was removed without changing the established first-screen arrangement. Clean Chromium checks at `360 x 740` found an exact `360 x 740` document, no horizontal overflow, no information-card scrolling and no console errors. Clinical and capture logic are unchanged. Physical-device acceptance and independent clinical sign-off remain pending.
