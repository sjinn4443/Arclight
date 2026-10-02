# Refract v1.1 evidence receipt

Date: 23 July 2026

## Baseline preservation

- `node tools/audit-allan-rx.mjs --sheet-inputs`: 24/60 full cases, 39/60 RE, 33/60 LE and 52/60 Add.
- `node tools/audit-allan-rx.mjs --benchmark`: 60/60 full cases, RE, LE and Add.
- No file in `src/prescription-logic.js`, `src/prescription-engine.js`, `src/prescription-config.js`, `src/workbook-benchmark-engine.js` or `src/workbook-calibration.js` was edited.

## Changed files

- Runtime: `index.html`, `scripts.js`, `src/ui/case-reset.js`, `src/ui/shell-controls.js`, `src/pwa.js`, `app.bundle.js`.
- Presentation: `styles/layout.css`, `styles/forms.css`, `styles/overlays.css`.
- Offline/build/tests: `manifest.webmanifest`, `service-worker.js`, `package.json`, `tests/run-tests.mjs`, `tests/browser-review.mjs`.
- Documentation: README, relevant memory-bank files, engineering/UI gap lists, clinical status, device checklist and this receipt.

## Verification

- Local esbuild 0.25.5 binary rebuilt `app.bundle.js` from source.
- `node tests/run-tests.mjs`: 5/5 contracts passed.
- Local HTTP: 200 at `/Refract/index.html`.
- Exact isolated Chrome/CDP review passed over HTTP and direct-file routes at `360 x 740`. Untouched, dense Advanced mode, completed prescription, transpose, Quick guide, drawer, armed reset and completed reset states were captured in `output/playwright/`. Document width remained `360px`, local fonts loaded and no runtime errors were recorded.
- The untouched output is blank. The exercised case produced bilateral `+1.25 / -0.50 x 90` with `+1.50` Add, transpose produced `+0.50 / +0.50 x 180` for the current RE and the two-step reset cleared inputs and outputs.
- Quick guide focus now moves to its close control and returns to its trigger. The drawer also receives contained keyboard focus and returns focus when closed.

## Remaining gates

Independent clinical sign-off, physical-device review and installed offline review remain outstanding. The app folder has no Git repository; recovery relies on the fleet backup arrangements.

## MCQ quality receipt — 26 July 2026

- Scope: 38 questions across Primary, Intermediate and Advanced, with existing attempt sizes and pass marks preserved.
- Data evidence: stable IDs, one keyed answer, rationales, source keys and explicit review status are enforced by `tests/run-tests.mjs`.
- Interaction evidence: unanswered fail-safe, focus movement, result-first hierarchy, answer explanations, source display and retry labels are protected by contract.
- Clinical boundary: prescription calculations, thresholds, attempt scoring and Cup unlocking were not changed. Independent clinical sign-off remains pending.
- Runtime evidence: `npm run build` completed and `npm test` passed, including exact bundle parity.
- Browser-visible assets: `20260726-mcqquality2`; app-scoped cache bumped to the same review token after the retry-scroll correction.
- Remaining gates at that stage were physical-device review and installed offline review; isolated browser evidence is recorded below.

Content spot-check evidence: `refract-primary-03`, `refract-primary-09` and `refract-advanced-16` retain their stable IDs but now cover plano notation, visual-acuity verification and binocular acceptance respectively. Their source keys are `refract-optics-contract-v1`, `college-routine-eye-examination` and `college-routine-eye-examination`. Bank sizes remain 10, 12 and 16.

### Isolated MCQ browser evidence

The reproducible path is `tests/mcq-browser-path.js`. Temporary Playwright automation at `360 x 740` recorded a `360px` client and scroll width, 44px minimum option rows, first-unanswered focus with no answer review revealed, four rationales and four source records after grading, retry cleared state and a reset-to-top modal. Console and page-error collections were empty. Screenshots are `output/playwright/mcq-unanswered-360x740.png` and `output/playwright/mcq-result-review-360x740.png`.

This MCQ path was rerun over HTTP only. Earlier direct-file evidence remains recorded, but service workers do not operate on `file://`. Retained Codex browser toolbar state was not changed. Remaining gates are physical-device review, installed offline review and independent clinical sign-off.
