# Swollen Discs v1.1 evidence receipt

Date: 26 July 2026

## Changed files

- Runtime and UI: `index.html`, `styles.css`, `script.js`, `mcq-controller.js`, `mcq-engine.mjs`, `questions.js`, `app-constants.js`, `app.bundle.js`, `service-worker.js`
- Tooling: `questions-qa.mjs`, `mcq-unit-test.mjs`, `browser-smoke.mjs`
- Governance: `README.md`, all six `memory-bank/*.md` files, engineering and UI gap lists, `CLINICAL_REVIEW.md`, `DEVICE-TEST-CHECKLIST.md` and this receipt

The generated `app.bundle.js` was rebuilt from the reviewed source. Viewer maths, timed-image recognition, condition images, referral labels, cup achievement and simulator controls were not changed.

## Automated evidence

- `npm test`: PASS — smoke, MCQ unit, viewer maths, 30-question QA, integration and exact bundle-parity suites
- `npm run lint`: PASS
- `npm run format:check`: PASS
- `npm start`: PASS, dependency-free local server listening on `127.0.0.1:8770`
- `node --check service-worker.js`: PASS
- `node --check fleet-enhancements.js`: PASS
- Dependency audit: not rerun in this MCQ pass. The previously recorded five high-severity development-tree advisories remain an external maintenance risk and were not auto-fixed.
- Follow-up consistency pass: `npm test`, `npm run lint`, `npm run format:check` and `npm run test:browser` all pass after the viewer-alignment change
- MCQ QA: PASS — 30 stable IDs, exact tier ownership, one keyed answer, rationale and source status for every question and an exact `a:6 b:6 c:6 d:6 e:6` answer distribution

## Browser evidence

Isolated installed Chrome at 360 x 740:

- Untouched normal teaching state: PASS
- Dense state using swollen, small FOV, dense cataract and left eye: PASS
- Fully opened drawer: PASS
- Two-press reset confirmation and established-default reload: PASS
- Horizontal overflow: none
- Service-worker-controlled offline reload: PASS
- Direct-file launch with title and canvas: PASS
- Console and page errors: none
- Follow-up comparison against Discs, Diabetic and Fundal Reflex: PASS. At `360 x 740`, the condition controls, 16px viewer stage and 18px interpretation card share the same content edges, the full initial state fits without required scrolling and there is no horizontal overflow.
- Primary MCQ review: PASS. The unanswered guard, four answer explanations, correct and incorrect states, fresh retry, result export and Escape focus return all passed at `360 x 740`. Document width remained `360px` and no console or page errors were recorded.

MCQ screenshot: `output/playwright/swollen-discs-mcq-primary-review-360x740.png`.

## Preserved contracts

Adaptive mobile/full image selection, normal/suspicious/swollen catalogue, viewer mathematics, cataract presets, timed practice, safety clamps, exports, cup achievement, original images, workflow IDs and red-on-black identity remain intact. The 30 MCQ IDs remain stable while wording, tier placement, explanations and source metadata were revised. The normal selection remains a teaching state, not a patient assessment.

## Remaining gates

- Independent clinical review of the revised MCQs, images, referral labels and assessment material: pending, no approval inferred
- Named physical-device checks: pending external device access
- Recovery: no independent Git repository, so parent-workspace recovery arrangements apply
