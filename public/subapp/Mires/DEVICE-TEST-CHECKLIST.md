# Mires constrained-device checklist

Status: physical-device testing pending.

- [x] Automated `360 x 740` untouched, completed Newton, dense controls, MCQ modal, reset and offline states pass with no horizontal overflow or runtime errors
- [x] Direct-file layout and functionality pass; Chromium uses a system-font fallback because local WOFF2 requests are blocked on `file://`
- [ ] Touch drag and pinch on intended handset
- [ ] Keyboard controls and focus paths
- [ ] Variable and Newton dense states
- [ ] Two-step session reset
- [ ] Installed offline launch and cache update
- [ ] Large text, magnification and screen reader
- [ ] Older WebView performance

Desktop emulation is not physical-device acceptance.

## MCQ follow-up — 26 July 2026

- [x] Automated contracts cover all 30 question IDs, answers, rationales, sources and review statuses.
- [x] Regression assertions protect the corrected `p4` excess-fluorescein under-reading and `p5` insufficient-fluorescein over-reading directions.
- [x] Answer rows now have a 44px minimum target.
- [x] Isolated 360 x 740 browser review of unanswered guard, five marked explanations, New set, Escape focus return, overflow and empty error log. Evidence: `output/playwright/mires-mcq-review-360x740.png`.
- [ ] Physical-device MCQ touch, timer, large-text and screen-reader review.

Automated viewport review does not set or prove retained Codex browser-toolbar dimensions.
