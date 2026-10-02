# Trauma Repo

## Receiving host integration — 2 October 2026

Host routes and locale hooks are retained. Service-worker reads remain app-scoped and shared locale assets are precached. Development material is excluded from deployment and offline manifests.

Current receiving-host evidence is in [the integration report](../../../docs/miniapps/20260930/INTEGRATION_REPORT.md). Earlier receipts below remain upstream historical evidence.

## Performance review — 30 September 2026

Runtime source retained. Separate scoring, shell, progression and PWA scripts remain intentional. Mobile Lighthouse performance: 96 → 96/100 in one paired lab run, not a physical-device speed guarantee.

Shared verification: 24/24 regression jobs, all 15 HTTP and direct-file information/drawer reviews, all 14 Primary quiz workflows and 45 main-page responsive views passed. Selected completed states were also checked. No clinical rules or approved layout were deliberately changed. App-specific asset queries and caches were bumped only where shipped bundles changed. Direct-file checks do not test service workers. Full dead-code elimination, every workflow, offline cache migration and physical-device acceptance are not claimed. The retained Glaucoma tab's real toolbar was verified at 360 x 740 after switching away and back; this does not establish sibling-tab sizes or physical-device acceptance.

[Evidence and remaining priorities](../FLEET_PERFORMANCE_REVIEW_20260930.md). This entry supersedes older performance figures only; earlier clinical and feature history remains below.

## Current fleet UI refinement receipt — 30 September 2026

Independent input/results columns on wider screens; mobile sequence and assessment logic retained.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../FLEET_UI_REFINEMENTS_2026-09-30.md).

## Fleet repair receipt — 30 September 2026

Removed direct-file font preload CORS errors. Corrected stale app-bar documentation; OTS arithmetic and clinical copy are unchanged. Current information footer: `v1 · 30/9/2026`. Runtime HTML changes use an updated app-scoped cache; internal engine/package versions are retained.

Information-panel and drawer checks pass over HTTP and direct-file routes at temporary `360 x 740`. Available popup checks and the Primary quiz state checks pass. Scoped automated test commands pass. See [fleet repair evidence](../FLEET_FIXES_2026-09-30.md) for exact coverage and exclusions. Service workers do not run on `file://`; offline migration, physical-device acceptance and independent clinical sign-off are not established by this repair. The retained Codex flowchart tab was not changed.

Older dated sections below are historical evidence. This receipt supersedes their release-date and verification-status claims, not their recorded clinical decisions.

## Documentation refresh — 29 September 2026

Current visible information footer: `v1 · 29/9/2026`, bottom right in the existing information popup. This entry records a documentation and popup-date synchronisation, not a new clinical audit. App behaviour and the previously recorded verification limits are unchanged. Older dated entries below are historical records, not the current popup date. Independent clinical sign-off and physical-device acceptance are not implied by this date.

Untouched-state follow-up, 25 July 2026: the safer unassessed result now uses two clean lines at `360 x 740`. The browser review has been corrected to expect the presenting-VA placeholder, a null score and a null category before assessment and after reset. Scoring logic is unchanged.

Fleet edge follow-up, 23 July 2026: the calculator and result shells now use exact `10px` outer margins and `340px` width at `360 x 740`. Scoring logic and calculator state are unchanged.

<!-- APP-DOC-STATUS:START -->

## Historical UI snapshot (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: black `#000000` on a red appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Static web app for calculating Ocular Trauma Score (OTS) style outcomes from presenting visual acuity and selected risk factors.

## v1.1 Fleet Upgrade

The calculator now uses a pure tested scoring module, local fonts, a confirmed case reset and scoped PWA/offline packaging. Drawer, dialog, MCQ and tooltip state have clearer accessibility signalling. The OTS-style maths, prognosis tables, outputs, initial calculator presentation, copy/export workflow, assets, IDs and red identity remain unchanged. Clinical sign-off and physical-device testing remain pending; see `TRAUMA_V1.1_EVIDENCE_RECEIPT.md`.

## What This App Does

- Lets the user select presenting VA.
- Lets the user toggle OTS risk factors.
- Calculates:
  - base score
  - penalty sum
  - final score
  - OTS category
- Shows estimated 6-month VA outcome table.
- Shows a plain-language prognosis line based on active category.
- Shows a collapsible "Calculation" panel explaining how the score was produced.
- Supports quick actions:
  - copy result summary
  - export result summary as text file
- Includes sidebar MCQ levels with tiered tests:
  - Primary: 5 questions from a 10-question bank, pass mark 3/5
  - Intermediate: 6 questions from a 13-question bank, pass mark 4/6
  - Advanced: 8 questions from a 14-question bank, pass mark 6/8

## Current UI Direction

The interface now follows the reusable Fundal Reflex clinical style while preserving the Trauma app bar identity:

- black app bar with red Quicksand title and red icon controls
- mobile-first layout checked around `360 x 740`
- off-white panels with blue-grey borders and soft shallow shadows
- restrained red accents for identity and priority cues
- light side menu with card-style MCQ actions and small level dots
- soft outer panels, medium action bars, tighter question cards and tight option rows
- MCQ modal uses contained scrolling, Fundal-style question cards, tight option rows and level-specific bank sizes
- compact information popup with short basics first and detail second
- DOM/text rendering for dynamic UI rather than HTML string injection

## Run Locally

This project has no production build step.

1. Open [index.html](/c:/Users/William/Desktop/Arclight%20App/Trauma/index.html) directly in a browser.
2. Or serve it with a local static server, for example:

```powershell
python -m http.server 8080
```

Then open `http://127.0.0.1:8080/index.html`.

## Linting

Install dependencies once:

```powershell
npm install
```

Run all linters:

```powershell
npm run lint
npm test
```

Individual commands:

- `npm run lint:js`
- `npm run lint:css`
- `npm run lint:html`

## Key Files

- [index.html](/c:/Users/William/Desktop/Arclight%20App/Trauma/index.html): App layout, modal, menu shell.
- [styles.css](/c:/Users/William/Desktop/Arclight%20App/Trauma/styles.css): UI styling and responsive behavior.
- [script.js](/c:/Users/William/Desktop/Arclight%20App/Trauma/script.js): Scoring logic, MCQ logic, dynamic rendering.
- [package.json](/c:/Users/William/Desktop/Arclight%20App/Trauma/package.json): Lint scripts and dev tooling.
- Image assets: `assets/images/globe.webp`, `assets/images/hypo.webp`, `assets/images/hook.webp`, `assets/images/retd.webp`, `assets/images/rapd.webp`.

## Scoring Logic Summary

- Base score comes from selected presenting VA.
- Each checked risk factor contributes a negative penalty.
- Final score = base score + sum(penalties).
- Category bands:
  - `<= 44` -> 1
  - `45-65` -> 2
  - `66-80` -> 3
  - `81-91` -> 4
  - `>= 92` -> 5
- Outcome percentages are selected from the category table in `acuityMap`.

## Memory Bank

Project memory documents are in `memory-bank/`:

- [projectbrief.md](/c:/Users/William/Desktop/Arclight%20App/Trauma/memory-bank/projectbrief.md)
- [productContext.md](/c:/Users/William/Desktop/Arclight%20App/Trauma/memory-bank/productContext.md)
- [systemPatterns.md](/c:/Users/William/Desktop/Arclight%20App/Trauma/memory-bank/systemPatterns.md)
- [techContext.md](/c:/Users/William/Desktop/Arclight%20App/Trauma/memory-bank/techContext.md)
- [activeContext.md](/c:/Users/William/Desktop/Arclight%20App/Trauma/memory-bank/activeContext.md)
- [progress.md](/c:/Users/William/Desktop/Arclight%20App/Trauma/memory-bank/progress.md)

## Information popup consistency — 23 July 2026

The information modal retains every existing sentence but groups it under Purpose, Use and Reference for faster scanning. The visible close control now has an effective `44 x 44px` target and the version line uses the shared presentation. Ocular Trauma Score calculations and outcome tables are unchanged.

## OTS wording corrections — 29 September 2026

Rupture now means a full-thickness eyewall wound from blunt trauma. The lowest numerical input, outcome and matching MCQ option use `0.3/60 to <6/60`: the lower bound is the metric equivalent of the published OTS `1/200`. Prognosis is explicitly distinguished from treatment urgency. Scores, penalties, category boundaries and percentages are unchanged. Sources: https://cehjournal.org/articles/497/files/65de03ec5f8e7.pdf and https://eyewiki.aao.org/Ruptured_Globe.

Tests pass including all 160 scoring combinations. Asset and app-cache token: `20260929-ots1`. Lint remains blocked by three existing `module`/`globalThis` environment errors. The retained local-file Trauma tab toolbar was verified at 360 x 740 after a switch to Mires and back. This does not establish refreshed page rendering or direct-file interaction acceptance; those and independent clinical sign-off remain pending.

## Information-card typography and fit — 23 July 2026

The guide now uses the fleet role map of Quicksand `14px/700` title, Inter `12.5px/400` body, Inter `11px/800` section labels and Inter `10.5px/700` version text. It measured `394.1px` at `360 x 740` and required no internal scrolling. Operational guidance, scope notes and calculation rows are upright for faster scanning. Its simple visible `v1` label and current `23/7/2026` date now occupy the shared bottom-right footer position.

## Main-page typography review — 23 July 2026

Presenting VA and Risk Factors now share the same `15px` section-heading size. OTS-style scoring, risk inputs and prognosis output are unchanged. The page remains within the `360px` target width.

## Sidebar consistency — 23 July 2026

The red identity and existing menu actions are unchanged. The drawer uses the fleet `14px` title, `11px` section-label and `12.5px` supporting-copy roles where present. Opening moves focus inside and Escape closes the drawer and returns focus to the menu trigger at `360 x 740`.

## MCQ consistency — 23 July 2026

Level labels now match the fleet and Cup unlocking requires explicit Advanced pass evidence. Existing option shuffling, question content, pass marks and OTS-style calculations are unchanged.

## Maintenance refactor — 26 July 2026

Information-modal and sidebar lifecycle code now lives in the local `shell-controller.js` file, which is loaded as a classic script and included in the app-scoped offline shell. Confirmed unused CSS was removed. Direct-file use, OTS-style scoring, MCQ content and the established layout remain unchanged. `npm test` and the complete lint suite pass. Independent clinical sign-off and physical-device acceptance remain open.

## Presenting-VA prompt refinement — 26 July 2026

The section heading remains `Presenting VA`. The dropdown now says simply `Select` and the untouched result says `Choose a VA category to calculate.`, avoiding needless repetition without changing any VA category, score, threshold or outcome. The main script and Trauma-only cache use `20260726-copy2`.

## MCQ quality and review workflow — 26 July 2026

All 37 authored questions now have stable `trauma-{tier}-{NN}` IDs, a concise answer rationale, a named source and an explicit review status. The former information-screen mechanics prompt now asks which information is required before an OTS-style score can be calculated. Existing attempt sizes, pass marks, OTS-style scores, outcome tables and Cup unlocking are unchanged. Unanswered attempts focus the first missing answer. Completed attempts show the result first, mark every response, explain each answer and display source status before offering `Try again` or `New attempt`.

## Information purpose pass — 27 July 2026

The existing `i` panel now tells the user to select the presenting VA and observed risk findings after an eye-injury assessment. It states that the configured OTS-style calculation supports discussion and prioritisation but does not replace trauma management. No score, threshold, category or outcome table changed. The open panel passed the shared non-scrolling `360 x 740` review.

## Fleet UI alignment — 28 September 2026

The information card now uses a `16px` radius and a measured `44 x 44px` close target. Presenting VA and Risk Factors headings use the fleet `15px/700/1.2` role. Clean Chromium checks at `360 x 740` found no overflow, no information-card scrolling, correct Escape focus return and no console errors. Scoring and outcome logic are unchanged. Physical-device acceptance and independent clinical sign-off remain pending.
