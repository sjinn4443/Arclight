# Constrained-device checklist

Target: 360 × 740. Date: 23 July 2026.

- [x] Local HTTP runtime returned 200.
- [x] Browser zoom restriction removed.
- [x] Local fonts and icon treatment verified by source contract.
- [x] Untouched, completed, transpose and reset behaviours covered by calculation or DOM contracts.
- [x] Automated `360 x 740` screenshots for untouched, dense, completed, transpose, Quick guide, drawer and reset states over HTTP and direct-file routes, with no horizontal overflow or runtime errors.
- [ ] Physical-device review.
- [ ] Installed-PWA offline cold-start review.

Physical-device status: **not completed**.

## MCQ quality follow-up — 26 July 2026

- [x] Automated contracts cover all 38 stable question IDs, rationales, sources and review states.
- [x] Isolated HTTP browser path at `360 x 740` verified the unanswered guard, result review, 44px option rows, source display, retry scroll reset, no horizontal overflow and no browser errors.
- [ ] Verify the unanswered guard and first-unanswered focus on a physical device.
- [ ] Complete a failed attempt and confirm `Try again`, answer review and source text are readable with touch and a screen reader.
- [ ] Complete a passed attempt and confirm `New attempt` preserves the tier and draws a fresh attempt.

Physical-device MCQ status: **pending**. Isolated browser automation is not physical-device acceptance.
