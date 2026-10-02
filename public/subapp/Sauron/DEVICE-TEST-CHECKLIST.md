# Constrained-device Checklist

_Updated: 25 July 2026_

## Completed browser emulation

- [x] Exact `360 x 740` viewport
- [x] Main simulator has no horizontal overflow
- [x] Default case and eye state are visible
- [x] Advanced controls open without horizontal overflow
- [x] Case picker remains within the viewport and receives focus
- [x] Reset confirmation is readable and does not immediately discard work
- [x] Second reset press restores the starting simulator state over HTTP and direct-file routes
- [x] Local fonts load and no uncaught browser errors are recorded
- [x] Fresh eye-engine HTTP review confirmed final RE/LE control names and dense-cataract salience at `360 x 740`
- [x] Final source build, contracts and 28-file syntax check pass
- [x] Case picker reports Primary `5`, Intermediate `10` and Advanced `13`
- [x] Warning controls appear only for ACG, leucocoria, vitreous haemorrhage and partial retinal detachment
- [x] Case titles and warning markers do not overlap
- [x] Safety dialog fits without internal scrolling, focuses its close control and returns focus after Escape
- [x] Selected warning case shows one triangle and no duplicate red tier dot
- [x] Direct-file case interaction works without horizontal overflow
- [x] Baby mode timed rounds contain only Baby-compatible test cases and continue to exclude anisometropia
- [x] Axis-dependent timed case retained an `18°` visible starting streak while revealing a distinct `51°` hidden axis
- [x] Safety dialog makes the underlying case dialog hidden and inert, then restores it and focus after Escape
- [x] Exaggerated ACG oval remains present and its warning identifies it as stylised
- [x] Logic-follow-up build, tests and 28-file syntax check pass with no browser errors at `360 x 740`

Direct-file note: Chromium blocks the local WOFF2 requests on `file://`, so the app remains functional but local font loading cannot be confirmed on that route. Service workers do not run on `file://`.

## Physical device gate

- [ ] Test sweep and rotate handles with touch input
- [ ] Test all modifier switches and advanced sliders
- [ ] Test case picker scrolling and MCQ completion
- [ ] Tap each of the four warning controls and confirm the wording with a qualified reviewer
- [ ] Confirm the selected-case warning marker remains clear on the target physical device
- [x] Test timed mode through reveal and next-round transitions in isolated browser emulation
- [ ] Repeat timed-mode reveal and next-round transitions with touch input on a physical device
- [ ] Install from the manifest and confirm a cold offline reload
- [ ] Confirm safe-area behaviour on a notched device

Physical-device status: **pending**.

## MCQ quality follow-up — 26 July 2026

- [x] Automated contracts cover all 26 stable question IDs, rationales, sources and review states.
- [x] Isolated HTTP browser path at `360 x 740` verified the unanswered guard, result review, 44px option rows, source display, retry, no horizontal overflow and no browser errors.
- [ ] Verify the unanswered guard and first-unanswered focus on a physical device.
- [ ] Confirm rationales and source text remain readable after a completed attempt at `360 x 740`.
- [ ] Verify `Try again` after failure and `New attempt` after a pass using touch.

Physical-device MCQ status: **pending**. Isolated browser automation is not physical-device acceptance.
