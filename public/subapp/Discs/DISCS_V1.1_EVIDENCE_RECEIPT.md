# Discs v1.1 evidence receipt

Date: 23 July 2026

## Preserved

- Black app bar and white Discs identity
- Accepted mobile viewer and Exam arrangement
- All 20 teaching cases and source assets
- Clinical thresholds, priorities, action and referral wording
- Existing viewer and recorded-dilation coupling
- Copied internal identifiers

## Implemented

- Operational-only two-step New assessment reset
- Modal focus trap and opener restoration
- Drawer and Quick guide focus restoration
- Finding-tab keyboard semantics
- Enlarged invisible hit areas without layout movement
- Local manifest and uniquely scoped shell-first/runtime service worker
- Pinned esbuild build and Node built-in regression contracts
- Corrective UI polish separates `12px` mode and case-set groups from the `16px` viewer and image stage and `18px` Exam shell, strengthens the Exam heading and removes misleading italics from changing viewer values
- Swollen Discs edge alignment at `360 x 740`: the stage and Exam shell now share `10px` screen margins and `340px` width. The stage uses the shared `16px` radius and shadow while Exam retains the quieter `18px` panel radius.

## Automated evidence

- `npm test`: 20/20 tests pass
- `npm run build`: pass, bundle rebuilt from `script.js`
- `node --check` for source JavaScript and service worker: pass
- Static contracts confirm 60 configured local case assets, unique HTML IDs, valid ARIA references, no runtime CDN and scoped PWA files

## Browser evidence

- Untouched Viewer and collapsed Exam fit `360 x 740` at `360px` width with local fonts loaded and no horizontal overflow.
- Expanded Exam remained usable through the intended 77px body scroll. Both Findings controls and Action were reachable without changing panel order.
- Real bilateral VA, view and explicit no-signs interaction produced `Routine disc check`.
- Two-step reset cleared examination state, returned `Record both eyes`, collapsed Exam and retained the active teaching case.
- Quick guide, drawer and Primary MCQ focus entry and return passed. Primary displayed five questions.
- Offline reload returned HTTP `200` from the controlling service worker while a deliberately uncached probe failed with `TypeError`.
- A settled final capture confirmed all local-font labels. Fresh online session: zero console errors and zero warnings.
- Final rendered-style check loaded `styles.css?v=20260723-v12-ui`, confirmed the `12px` control-group hierarchy, upright dynamic values and a `360px` document without horizontal overflow. A clean follow-up comparison measured the stage at `x=10`, `width=340`, `radius=16px` and the Exam shell at `x=10`, `width=340`, `radius=18px`.
- Direct-file architecture remains intact but direct-file launch was not counted as physical-device evidence.

## External status

- Independent clinical sign-off: pending
- Physical-device acceptance: pending

## MCQ clinical-quality evidence — 26 July 2026

- Preserved banks: Primary 16, Intermediate 24 and Advanced 24. Preserved attempts: 5, 6 and 8 with unchanged pass marks.
- Added stable IDs, concise rationales, source IDs and pending-review metadata to every question.
- Removed app-mechanics teaching, narrowed isolated-sign conclusions and separated repetitive limited-view, drusen, context and physiological-cup prompts into distinct progressive decisions.
- Added fail-safe unanswered handling, first-missing focus, correct and selected-wrong review, result hierarchy and fresh New attempt sampling.
- Submit and New attempt are mutually exclusive. Result and action flex items cannot overlap. The drawer completes its close transition before the MCQ opens.
- Runtime and app-scoped cache token: `20260726-mcq2`.
- Automated result: `npm test` passed 20/20 and `npm run build:check` confirmed exact bundle parity.
- Isolated Playwright at `360 x 740`: no page or modal horizontal overflow, no answers revealed on incomplete submit, 5/5 rationales shown after completion, no result/action overlap, retry focused its first input, Escape returned focus to `menuButton` and console/page errors were zero.
- Screenshots: `output/playwright/mcq-quality/discs-mcq-unanswered-360x740.png`, `output/playwright/mcq-quality/discs-mcq-review-360x740.png` and `output/playwright/mcq-quality/discs-mcq-retry-360x740.png`.
- Desktop emulation does not complete independent clinical or physical-device acceptance.
