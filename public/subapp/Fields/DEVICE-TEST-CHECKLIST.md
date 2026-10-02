# Fields Constrained-device Checklist

Last updated: 23 July 2026

Desktop browser emulation at `360 x 740` has passed. The items below require a real target device and remain unchecked.

## Automated MCQ emulation — 26 July 2026

- [x] Isolated browser viewport measured exactly `360 x 740`.
- [x] Incomplete Submit stayed ungraded, revealed no answers and focused the first unanswered question.
- [x] Completed review showed correct and selected-wrong states with a rationale for all five sampled questions.
- [x] Submit and New Set were mutually exclusive.
- [x] New Set cleared review, enabled inputs and focused the first option.
- [x] Escape closed the modal and returned focus to `menu-icon`.
- [x] No page or modal horizontal overflow, result/action overlap, console errors or page errors.

Evidence: `output/playwright/mcq-quality/fields-mcq-unanswered-360x740.png`, `fields-mcq-review-360x740.png` and `fields-mcq-retry-360x740.png`.

This remains desktop emulation and does not complete any physical-device item below.

## Installation and Offline

- [ ] Install Fields from an HTTP(S) origin.
- [ ] Launch from the installed icon while online.
- [ ] Enable aeroplane mode, close the app and confirm a fresh launch still loads.
- [ ] Confirm direct-file `index.html` remains usable where local-file launch is part of deployment.

## Core Assessment

- [ ] Confirm untouched points and result clearly read as unassessed.
- [ ] Tap one point through seen, suspect, absent and back to seen.
- [ ] Confirm `Mark all seen` records a completed normal screen.
- [ ] Mark one point seen, then confirm `Mark rest seen` fills only the untouched points.
- [ ] Mark one point suspect, then confirm the untouched remainder becomes seen and the established result appears immediately.
- [ ] Select sudden onset, stroke/HA or flash/curtain before completing the field and confirm `Not assessed` remains visible with the urgent context warning beneath it.
- [ ] Check RAPD and each context modifier with the relevant expected output.
- [ ] Tap `New`, then `Clear?`, and confirm all examination selections clear.
- [ ] Confirm MCQ achievement and stored preferences remain after examination reset.

## Layout and Interaction

- [ ] Review at the device's smallest supported viewport, including `360 x 740` where available.
- [ ] Confirm no control collision, clipped result or unintended horizontal scroll.
- [ ] Confirm the field circles remain easy to target despite the intentionally compact visual size.
- [ ] Open and close Context, Calc, the pathway image, the guide, the drawer and an MCQ.
- [ ] Check on-screen keyboard and zoom behaviour if accessibility zoom is used.
- [ ] Check with reduced-motion enabled.

## Accessibility

- [ ] Navigate the full workflow with a hardware keyboard or switch input.
- [ ] Confirm Escape closes the guide, drawer, MCQ and pathway image as expected.
- [ ] Confirm focus returns to the control which opened each transient surface.
- [ ] Check point names and state announcements with the device screen reader.

## Sign-off

- Device and OS:
- Browser or WebView:
- Tester:
- Date:
- Result:
- Notes:
