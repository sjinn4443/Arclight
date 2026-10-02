# Amsler v1.1 Engineering Evidence Receipt

Fleet edge follow-up, 23 July 2026: at `360 x 740`, controls, canvas and result/report shells measure `x=10`, `width=340` with no horizontal overflow. Drawing and reporting behaviour are unchanged.

Compute safety follow-up, 24 July 2026: per-eye assessment state, descriptive zone coverage and a fixed-resolution normalised engine replace the previous viewport-dependent canvas-pixel calculation. The patient icon and app-bar information glyph now use the agreed fleet treatments.

Date: 24 July 2026

## Outcome

The engineering pass and lead desktop-browser review are complete. Independent clinical sign-off and physical-device testing remain pending.

## Preserved scope

- Red app identity and compact mobile geometry.
- RE and LE drawing, visual modes and responsive square grid.
- Compute as the explicit selected-eye action.
- Report layout and generated WebP workflow.
- MCQ levels, scoring and achievement.

## Implemented evidence

- Local Inter and Quicksand fonts are used with no runtime Google Fonts request.
- Local html2canvas 1.4.1 and licence replace the CDN script.
- CSS and native text marks replace Font Awesome runtime use.
- Dialog and drawer semantics, Escape handling, focus entry, focus containment and focus restoration are implemented.
- Two-step `New assessment` reset clears examination state and retains teaching state.
- Manifest and Amsler-scoped service worker provide HTTP offline support without affecting file:// launch.
- `tools/build-bundle.mjs` rebuilds `app.bundle.js` from modular sources.
- Corrective UI polish now applies a clear `12px` toolbar-shell, `8-10px` control and `18px` result/report radius hierarchy without changing the grid or workflow.
- `js/amsler-engine.js` analyses normalised marks at a fixed resolution, counts overlaps once and uses separate whole-grid, central-zone and outer-zone denominators.
- An untouched eye remains `Not assessed`; a selected eye deliberately computed without a mark reports `No marks recorded`.
- Drawing invalidates the visible result, clears any generated report and disables Report until Compute is used again.
- Closed Missing and Red mark outlines count their actual polygon interior. Open marks count their strokes. Runtime no longer infers `wavy` or `dark` from geometry.
- Line width is stored relative to grid size so responsive canvas changes preserve both the visible mark and its percentage.
- The patient control now uses a local head-and-shoulders silhouette. The app-bar information control uses the shared bare accent-coloured `i`.

## Automated verification

- `npm test`: PASS, 18 tests passed, 0 failed.
- `npm run build:check`: PASS, generated bundle matches modular sources.
- Seven engine tests cover assessment-state separation, capture-size invariance, analysis-resolution stability, zone denominators, explicit closed regions, overlap union and malformed input.
- Runtime CDN scan across HTML, CSS, bundle, worker and manifest: PASS with no matches.

## Browser evidence

- Untouched page fits `360 x 740` at `360px` document width with local fonts loaded and no horizontal overflow.
- Instructions and patient dialogs focus their close controls and restore focus to their opener.
- Computing untouched RE produced `RE: No marks recorded` and `LE: Not assessed`. Computing selected LE then produced two deliberate no-mark states.
- After drawing, the old result was replaced by `Changes not computed`, Report became disabled and any stale report was removed.
- An unchanged line produced `0.1%` whole-grid and `0.9%` central-zone coverage before and after changing the isolated viewport from a `324px` to `444px` backing canvas.
- The revised report reproduced the descriptive per-eye wording and remained at `360px` document width with no horizontal overflow.
- The generated two-eye report remained readable at `360px` width.
- Two-step reset restored neutral `Results:`, disabled Report, removed the generated report and retained teaching state.
- Primary MCQ opened with six sampled questions and restored focus on Escape.
- Offline reload returned HTTP `200` from the controlling service worker while a deliberately uncached probe failed with `TypeError`.
- Fresh online session: zero console errors and zero warnings.
- The revised guide measured `340 x 384.1px`; `scrollHeight` equalled `clientHeight` and the close control remained collision-free.
- Final HTTP captures are `output/playwright/amsler-compute-fix-initial-360x740.png`, `amsler-compute-fix-info-360x740.png` and `amsler-compute-fix-report-360x740.png`.
- Isolated Chrome confirmed the generated classic bundle and local assets load through `file://`. Its command-line minimum layout viewport prevented an honest `360 x 740` direct-file claim, so that capture is recorded only as `amsler-compute-fix-direct-file-load.png`.

## External gates

- Independent clinical sign-off: pending.
- Physical-device review: pending.

## MCQ clinical-quality evidence — 26 July 2026

- Preserved banks: Primary 12, Intermediate 18 and Advanced 18. Preserved attempts: 6, 8 and 8 with unchanged pass marks.
- Replaced app-mechanics content and removed repeated higher-tier decisions without changing drawing, Compute, report, reset or referral behaviour.
- Added stable `amsler-{tier}-{number}` IDs, concise rationales, source IDs and `Independent clinical sign-off pending` metadata to every authored question.
- Added fail-safe unanswered handling, first-missing focus, correct and selected-wrong review, a focused result hierarchy and a genuine fresh New attempt.
- Submit and New attempt are mutually exclusive. Option rows retain a 44px minimum touch height.
- Runtime and app-scoped cache token: `20260726-mcq2`.
- Automated result: `npm test` passed 18/18 and `app.bundle.js` exactly matches modular source.
- Isolated Playwright at `360 x 740`: no page or modal horizontal overflow, no answers revealed on incomplete submit, 6/6 rationales shown after completion, retry cleared review and focused its first input, Escape returned focus to `burger-icon` and console/page errors were zero.
- Screenshots: `output/playwright/mcq-quality/amsler-mcq-unanswered-360x740.png`, `output/playwright/mcq-quality/amsler-mcq-review-360x740.png` and `output/playwright/mcq-quality/amsler-mcq-retry-360x740.png`.
- This is desktop emulation only. Independent clinical sign-off and physical-device acceptance remain pending.
