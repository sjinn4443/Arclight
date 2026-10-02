# Morph constrained and physical-device checklist

Status date: 23 July 2026

## Automated constrained browser — complete

- [x] Untouched state at 360 x 740
- [x] Dense state with cataract level 3, 45-degree field and CRVO
- [x] Fully opened drawer transient state
- [x] No horizontal document overflow
- [x] Two-press full-session reset reloads the defaults
- [x] Offline reload succeeds after service-worker installation
- [x] Direct-file launch retains the Morph title and fundus canvas
- [x] No console or page errors

## Physical devices — pending external access

- [ ] iPhone-class Safari: drag target, touch offset, controls and drawer
- [ ] Android-class Chrome: drag target, touch offset, controls and drawer
- [ ] Standalone installed mode from each supported platform
- [ ] Offline cold start after a confirmed online load
- [ ] Screen reader naming and focus order on a physical mobile device

Physical-device status must remain **pending** until a named tester records the device, operating-system version, browser version, result and date.

## Condition-Cup follow-up — 26 July 2026

- [x] Contract confirms there are exactly five unique condition targets.
- [x] Contract confirms the Cup uses `conditions` mode and no MCQ controls exist.
- [x] Isolated 360 x 740 browser check confirmed that visiting all five conditions unlocks the Cup without overflow or console errors. Evidence: `output/playwright/morph-cup-unlocked-360x740.png`.
- [ ] Physical-device condition and Cup completion check.

Automated viewport review does not set or prove retained Codex browser-toolbar dimensions.
