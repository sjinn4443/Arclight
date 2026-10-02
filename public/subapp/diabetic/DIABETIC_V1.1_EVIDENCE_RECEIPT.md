# Diabetic v1.1 Evidence Receipt

**Date:** 26 July 2026  
**Browser review:** Complete at `360 x 740` in desktop Chromium  
**Clinical sign-off:** Pending  
**Physical-device status:** Pending

## Delivered

- Operational-only confirmed assessment reset with teaching-state retention.
- Focus-managed drawer, quick guide and modal infrastructure.
- Truthful viewing-mode radiogroup semantics.
- Geometry-preserving expanded hit regions and corrected bundled close glyph.
- Local manifest, Diabetic-scoped service worker and HTTP(S)-only registration.
- Reproducible source-to-bundle build and Node regression/contracts suite.
- Corrective UI polish separates `12px` grouped controls from the `16px` viewer and image stage and `18px` Exam shell, strengthens the Exam heading and removes misleading italics from changing viewer values.
- Swollen Discs edge alignment at `360 x 740`: the stage and Exam shell now share `10px` screen margins and `340px` width. The stage uses the shared `16px` radius and shadow while Exam retains the quieter `18px` panel radius.
- MCQ quality pass with corrected one-answer wording, stable IDs, explanations, source-status metadata, touch-safe answer rows and working retry/new-attempt behaviour.

## Preserved Behaviour

No clinical threshold, priority, action label, referral timescale or referral wording was changed. All ten image cases, viewer behaviour, red accent and Viewer-to-collapsed-Exam geometry were retained. MCQ wording changed only where an item was malformed, ambiguous or overbroad.

## Automated Evidence

```text
npm run build  PASS
npm run check  PASS
syntax         PASS for source, bundle, service worker and supporting scripts
tests          20 passed, 0 failed
bundle parity  PASS
```

Covered outcomes include untouched incomplete state, completed routine screening, ungradable fellow eye, urgent PDR precedence, macula-risk and NPDR priorities, finding exclusivity, Holo-to-DO state coercion, reset separation, referral-note honesty, MCQ data, duplicate IDs, ARIA targets, local runtime, service-worker protocol guard and bundle markers.

## Browser Evidence

- Untouched Viewer and collapsed Exam fit one `360 x 740` viewport at `360px` width with local fonts loaded and no horizontal overflow.
- Expanded Exam also fit the working viewport. A real bilateral VA, view and explicit no-signs workflow produced `Routine (screening)`.
- The referral note recorded both eyes, preserved `Not dilated` and screening safety wording and restored focus on Escape.
- Two-step reset cleared both-eye examination state, returned `Record both eyes` and retained the active teaching case.
- Quick guide, drawer and Primary MCQ focus entry and return passed. Primary displayed five questions.
- Offline reload returned HTTP `200` from the controlling service worker while a deliberately uncached probe failed with `TypeError`.
- Fresh online session: zero console errors and zero warnings.
- Final rendered-style check loaded `styles.css?v=20260723-v1.1-ui2`, confirmed the `12px` control-group hierarchy, upright dynamic values and a `360px` document without horizontal overflow. A clean follow-up comparison measured the stage at `x=10`, `width=340`, `radius=16px` and the Exam shell at `x=10`, `width=340`, `radius=18px`.
- Final MCQ check at `360 x 740` passed unanswered-submit guarding, failed-attempt grading, explanation display, visible result text, `Try again`, fresh-attempt reset, Escape close and focus return to `Open menu`. The document measured `360px` wide with no horizontal overflow and the console contained zero errors or warnings.
- Screenshot: `output/playwright/mcq-primary-review-360x740.png`.

Independent clinical review and physical-device acceptance remain external gates. Direct-file support is retained by contract but was not counted as physical-device evidence.
