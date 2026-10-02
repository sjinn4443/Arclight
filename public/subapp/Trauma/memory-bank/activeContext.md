# Active Context

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Runtime source retained. Separate scoring, shell, progression and PWA scripts remain intentional. Mobile Lighthouse performance: 96 → 96/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Independent input/results columns on wider screens; mobile sequence and assessment logic retained.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Fleet repair receipt — 30 September 2026

Removed direct-file font preload CORS errors. Corrected stale app-bar documentation; OTS arithmetic and clinical copy are unchanged. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

29 September 2026: approved OTS copy corrections implemented in engine and UI. Rupture definition is blunt-trauma specific; numerical VA lower bound is now 0.3/60 (equivalent to original 1/200) in input, outcomes and matching MCQ option. Purpose states prognosis, not treatment urgency. Arithmetic unchanged. All tests including 160 combinations pass. Cache/assets: 20260929-ots1. Existing lint environment errors for module/globalThis remain. Real local-file tab toolbar passed 360 x 740 switch-away/back verification; refreshed rendering and direct-file interactions were not verified. Clinical sign-off remains pending. See README for sources.

Untouched-state follow-up, 25 July 2026: the Result card now stacks `Not assessed` above its guidance without collision at `360 x 740`. Browser review expects the presenting-VA placeholder and no score or category before assessment and after reset. Cache token: `20260725-unassessed1`.

Fleet edge follow-up, 23 July 2026: calculator and result shells measure `x=10`, `width=340` at `360 x 740`; scoring logic and state are unchanged.

## Fleet upgrade, 23 July 2026

Trauma v1.1 has a pure tested scoring engine, restored local lint tooling, confirmed case reset, local fonts, accessibility state improvements and scoped offline packaging. The safer initial unassessed presentation is retained. Clinical and physical-device review remain pending.

<!-- APP-DOC-STATUS:START -->

## Historical memory snapshot (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: black `#000000` on a red appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

## Current UI State

- App bar:
  - black background
  - title text red
  - title size 25px
  - Quicksand title font
  - height 54px
- Current UI pass has copied the Fundal Reflex layout discipline while preserving the Trauma app bar identity:
  - compact mobile-first panels around the 360x740 review size
  - light clinical card surfaces with blue-grey borders
  - light side menu with small Primary, Intermediate and Advanced level dots
  - softer outer panels, medium action controls and tighter nested MCQ rows
  - compact info popup with basics first and detail second
- MCQ modal now follows the Fundal-style hierarchy:
  - contained modal scroll
  - medium question cards
  - tighter option rows
  - green submit action
  - level-specific modal border tint
- Current MCQ bank rules:
  - Primary samples 5 from 10 and passes at 3/5
  - Intermediate samples 6 from 13 and passes at 4/6
  - Advanced samples 8 from 14 and passes at 6/8
- Input card is split into two visual sections:
  - Presenting VA
  - Risk Factors
- Risk rows are compact and no longer rendered as bordered "pill" blocks.
- Result headline row is tuned to stay on one line in narrow mobile widths.
- Sidebar now shows tiered MCQ entry buttons:
  - Primary
  - Intermediate
  - Advanced

## Current Result/Explanation State

- Result area includes:
  - estimated score and category badge
  - outcome probability table
  - active plain-language prognosis line
  - collapsible calculation panel describing formula inputs and category mapping
  - compact copy/export controls
- MCQ modal includes:
  - level intro and pass mark
  - random question subset
  - submit + pass/fail feedback
  - retry set

## Recent Interaction Focus

- Mobile layout refinement (Chrome phone viewport baseline 360x740).
- Spacing and readability balancing for score row and risk controls.

## Guardrails For Next Changes

- Preserve one-line behaviour for the "Estimated VA at 6 months" row on mobile.
- Keep touch targets for selects/toggles usable even when compacting layout.
- Keep MCQ complexity/language progression clear between levels.
- Preserve the black app bar, red Quicksand title and 54px app bar height.

## MCQ consistency status — 23 July 2026

Visible levels use Primary, Intermediate and Advanced. Existing question content, option shuffling, attempt sizes and pass marks remain unchanged. Cup unlocking requires explicit Advanced pass evidence. OTS-style calculation logic is unaffected.

## Maintenance refactor — 26 July 2026

The information-modal and sidebar shell lifecycle is now authored in `shell-controller.js` rather than inline HTML. The local classic-script order and direct-file workflow are preserved. Scoring, MCQs and clinical wording were not changed. Clinical and physical-device gates remain open.

## Presenting-VA prompt — 26 July 2026

- Kept `Presenting VA` as the single section heading.
- Shortened the dropdown prompt to `Select`.
- Shortened untouched guidance to `Choose a VA category to calculate.`
- Preserved every VA option and all scoring, threshold and outcome logic.
- Versioned the main script and Trauma-only cache as `20260726-copy2`.

## MCQ quality pass — 26 July 2026

All 37 questions now use stable IDs, rationales, named sources and explicit review status. The interface-mechanics item now tests the presenting-VA prerequisite. Incomplete attempts focus the first unanswered item. Completed attempts mark all responses and show explanations and source status before retry. OTS-style scoring, attempt sizes, pass marks and Cup unlocking remain unchanged.
