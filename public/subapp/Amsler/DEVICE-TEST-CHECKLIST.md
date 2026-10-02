# Amsler Constrained-device Checklist

Date: 24 July 2026

Physical-device status: pending.

## Required physical-device checks

- [ ] Launch over HTTP on a 360 x 740 or comparable phone.
- [ ] Confirm the app bar, control row, grid and Compute area remain usable without horizontal overflow.
- [ ] Draw, switch eyes and draw again without pointer offset or lost strokes.
- [ ] Verify Flash, Red, Diag, all three tools and pen width.
- [ ] Compute selected RE only and confirm RE is `No marks recorded` while untouched LE remains `Not assessed`; then deliberately compute LE.
- [ ] Draw after Compute and confirm the old result is replaced by `Changes not computed`, the report is removed and Report is disabled.
- [ ] Compute marked RE and LE states and inspect whole-grid, central-zone and outer-zone coverage.
- [ ] Rotate or resize after Compute and confirm the unchanged mark retains the same percentages.
- [ ] Draw closed Missing and Red mark regions, then confirm their actual interiors are represented without convex-hull expansion.
- [ ] Open, close and keyboard-test instructions, patient information, drawer and MCQ where a hardware keyboard is available.
- [ ] Generate and download the WebP report.
- [ ] Try Web Share where supported and confirm the download fallback where it is not.
- [ ] Arm then cancel the reset by waiting. Arm then confirm it and verify patient and examination state clear while MCQ achievement remains.
- [ ] Install from HTTP, reload offline and confirm the cached app and report export work.
- [ ] Confirm direct-file launch still works without service-worker installation.
- [ ] Check reduced-motion behaviour and text scaling.
- [ ] Record browser, operating system, device, viewport, console findings and any physical limitations.

Desktop emulation evidence must be recorded separately and does not complete this checklist.

## Automated MCQ emulation — 26 July 2026

- [x] Isolated browser viewport measured exactly `360 x 740`.
- [x] Incomplete Submit stayed ungraded, revealed no answers and focused the first unanswered question.
- [x] Completed review showed correct and selected-wrong states with a rationale for all six sampled questions.
- [x] New attempt cleared result and review state, enabled inputs and focused the first option.
- [x] Escape closed the modal and returned focus to the app-bar menu trigger.
- [x] No page or modal horizontal overflow, result/action overlap, console errors or page errors.

Evidence: `output/playwright/mcq-quality/amsler-mcq-unanswered-360x740.png`, `amsler-mcq-review-360x740.png` and `amsler-mcq-retry-360x740.png`.

Physical-device status remains pending.
