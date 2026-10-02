# Discs constrained-device checklist

Status: physical-device testing pending

- [ ] Intended Android device and older WebView launch
- [ ] `360 x 740` portrait workflow and text scaling
- [ ] Viewer drag, gaze, skin, dilation and cataract controls
- [ ] Exam entry, findings and Action expansion
- [ ] Two-step New assessment reset
- [ ] Drawer, Quick guide, Practice, referral and MCQ focus behaviour
- [ ] Local font rendering without persistent blank labels
- [ ] First online launch and installed offline relaunch
- [ ] Large case images under constrained memory and storage
- [ ] Screen-reader names and keyboard or switch navigation where available

Desktop browser emulation does not complete this checklist.

## Automated MCQ emulation — 26 July 2026

- [x] Isolated browser viewport measured exactly `360 x 740`.
- [x] Drawer settled closed before the modal became visible.
- [x] Incomplete Submit stayed ungraded, revealed no answers and focused the first unanswered question.
- [x] Completed review showed correct and selected-wrong states with a rationale for all five sampled questions.
- [x] New attempt cleared review, enabled inputs and focused the first option.
- [x] Result and New attempt did not overlap.
- [x] Escape closed the modal and returned focus to `menuButton`.
- [x] No page or modal horizontal overflow, console errors or page errors.

Evidence: `output/playwright/mcq-quality/discs-mcq-unanswered-360x740.png`, `discs-mcq-review-360x740.png` and `discs-mcq-retry-360x740.png`.

Physical-device status remains pending.
