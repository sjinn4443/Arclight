# Constrained-device Checklist

_Updated: 25 July 2026_

## Browser emulation

- [x] Exact `360 x 740` viewport and horizontal overflow measurement
- [x] Untouched placeholder and unassessed presentation with no text collision
- [x] Changed VA plus multiple risk-factor state
- [x] Risk tooltip visibility and close-focus behaviour
- [x] Reset confirmation in the mobile drawer
- [x] Reset restores the placeholder and collision-free unassessed state
- [x] Local font load and browser error capture

## Physical-device gate

- [ ] Test every toggle and tooltip with touch
- [ ] Verify copy result on secure and fallback browser paths
- [ ] Verify exported summary filename and content
- [ ] Complete each MCQ tier using a screen reader and touch
- [ ] Install the PWA and cold-reload it offline
- [ ] Verify safe-area behaviour on a notched device

Physical-device status: **pending**.

## MCQ quality follow-up — 26 July 2026

- [x] Automated contracts cover all 37 stable question IDs, rationales, sources and review states.
- [x] Isolated HTTP browser path at `360 x 740` verified the unanswered guard, result review, 44px option rows, source display, retry, no horizontal overflow and no browser errors.
- [ ] Verify the unanswered guard and first-unanswered focus on a physical device.
- [ ] Confirm every answer receives a readable explanation and source after grading at `360 x 740`.
- [ ] Verify `Try again` after failure and `New attempt` after a pass using touch.

Physical-device MCQ status: **pending**. Isolated browser automation is not physical-device acceptance.
