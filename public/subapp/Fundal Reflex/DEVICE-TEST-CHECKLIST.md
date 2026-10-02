# Constrained-device checklist

Target viewport: 360 × 740. Date: 23 July 2026.

- [x] Local HTTP runtime returned successfully.
- [x] Isolated Chrome/CDP checks completed at exactly 360 × 740 over HTTP and direct-file routes.
- [x] Core runtime uses local scripts, styles and fonts.
- [x] Keyboard and modal semantics retained from the established implementation.
- [x] Two-step session reset added with live status text.
- [x] Exact 360 CSS-pixel untouched, dense, completed, transient, armed-reset and completed-reset states captured with no horizontal overflow or runtime errors.
- [x] Fresh eye-engine HTTP review at exactly `360 x 740` confirmed RE/LE names, dense-cataract salience and no browser warnings or errors.
- [x] Seven focused contracts passed after the final bundle rebuild.
- [ ] Physical low-end Android device check.
- [ ] Installed-PWA cold-start and offline case-image review on a physical device.

Physical-device status: **not completed**. This remains an external release gate.

## MCQ follow-up — 26 July 2026

- [x] Automated source contracts cover all 68 question IDs, answers, rationales, sources and review statuses.
- [x] Answer rows have a 44px minimum target.
- [x] Isolated 360 x 740 browser review of unanswered guard, five marked explanations, New set, Escape focus return, 360px document width and empty error log. Evidence: `output/playwright/fundal-mcq6-mcq-review-360x740.png`.
- [ ] Physical-device MCQ touch, large-text and screen-reader review.

Automated viewport review does not set or prove retained Codex browser-toolbar dimensions.
