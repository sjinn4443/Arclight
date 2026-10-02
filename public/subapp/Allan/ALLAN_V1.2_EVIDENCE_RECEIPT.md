# Allan v1.2 MCQ quality evidence receipt

Date: 26 July 2026

## Scope

Conservative audit of Allan's existing MCQ content and interaction against the fleet MCQ contract. The clinical question text, answers, tiers, sample sizes, pass marks, progression and cup logic were preserved.

## Evidence-backed review

- Current NICE NG12 skin-cancer referral recommendations checked for melanoma, dermoscopy, SCC and BCC items.
- NICE CG183 drug-allergy features and timing checked for SJS/TEN, DRESS and AGEP items.
- NHS England teledermatology guidance checked for image-set and inadequate-image items.
- No concrete clinical-content defect was identified.
- Independent clinical sign-off remains pending.

## Changed files

- `mcq-bank.js`
- `index.html`
- `script.js`
- `styles.css`
- `service-worker.js`
- `tests/mcq-bank.test.js`
- `e2e/allan.spec.js`
- `README.md`
- `CLINICAL_REVIEW.md`
- `DEVICE-TEST-CHECKLIST.md`
- all six files in `memory-bank/`

## Checks

- `node --check script.js`: pass
- `node --check mcq-bank.js`: pass
- `npm test`: 26/26 pass
- `npm run test:ui`: 6/6 pass in isolated Chrome
- Targeted Primary MCQ browser check: pass at `360 x 740`
- Unanswered guard, marked feedback, five explanations, fresh retry, focus behaviour and `44px` answer rows: pass
- Console errors: none
- Direct-file main-route check: pass
- Installed offline reload: pass

## Visual evidence

- `output/playwright/allan-mcq-primary-review-360x740.png`

The Playwright viewport is temporary automated verification. It is not evidence that a retained Codex browser tab has persistent `360 x 740` device-toolbar values.

## External gates

- Independent clinical sign-off: pending
- Named physical constrained-device acceptance: pending
- Local pathway and information-governance approval: pending
