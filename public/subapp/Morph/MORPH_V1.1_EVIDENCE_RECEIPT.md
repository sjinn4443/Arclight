# Morph v1.1 evidence receipt

Fleet edge follow-up, 23 July 2026: the former `7px` override is corrected. At `360 x 740`, controls and the black stage measure `x=10`, `width=340` with no horizontal overflow. Simulator geometry and logic are unchanged.

Date: 23 July 2026

## Changed files

- Runtime and UI: `index.html`, `styles.css`, `manifest.webmanifest`, `service-worker.js`
- Test tooling: `package.json`, `package-lock.json`, `.gitignore`, `tests/contracts.test.mjs`, `tests/browser-smoke.mjs`
- Governance: `README.md`, all six `memory-bank/*.md` files, engineering and UI gap lists, `CLINICAL_REVIEW.md`, `DEVICE-TEST-CHECKLIST.md` and this receipt

## Automated evidence

- `npm test`: PASS, 6 tests, 0 failures
- `node --check service-worker.js`: PASS
- `node --check cup-achievement.js`: PASS
- `npm audit` during dependency installation: 0 vulnerabilities

## Browser evidence

Isolated installed Chrome, viewport 360 x 740:

- Untouched state: PASS
- Dense state using cataract level 3, 45-degree field and CRVO: PASS
- Fully opened drawer: PASS
- Horizontal overflow: none
- Two-press reset and default reload: PASS
- Service-worker-controlled offline reload: PASS
- Direct-file launch with title and canvas present: PASS
- Console and page errors: none

Screenshots are generated under `output/playwright/` and intentionally excluded from version control.

## Preserved contracts

The app remains a teaching simulator with its inline viewer engine, six original WebP assets, viewer scale 1.2, field radii 38/48/68/92/114/136, Rx symbols and scale mappings, control order, IDs, white app bar, black title and cartoon accent unchanged.

## Remaining gates

- Independent clinical content review: pending, no approval inferred
- Physical-device checks: pending external device access
- Recovery: Morph is not an independent Git repository, so the parent workspace's recovery arrangements apply

## MCQ exclusion and Cup receipt — 26 July 2026

- MCQ count: zero by design.
- Reason: Morph is an optical-view simulator with no clinical action or referral workflow. Adding a quiz would invent a new workflow outside the approved scope.
- Cup target: five unique condition buttons — Normal, Swollen disc, Cupped disc, CRVO and AMD.
- Final automated result: 11/11 tests and syntax checks passed, including conditions-mode Cup and no-MCQ assertions.
- Final isolated browser result: exact `360 x 740`, all five conditions visited, Cup unlocked, 24 controls observed, four screenshots, offline reload, reset reload and direct-file launch passed without overflow or console errors.
- Browser evidence: `output/playwright/morph-cup-unlocked-360x740.png`.
- Clinical gate: condition imagery and teaching wording remain pending independent review.
