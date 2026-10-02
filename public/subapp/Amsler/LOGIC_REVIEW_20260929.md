# Amsler interaction corrections — 29 September 2026

All five approved findings addressed without altering the descriptive coverage engine.

- Compute clears an older report. Editing patient name/date or changing report display modes also clears it; Generate report recreates it from current values.
- Patient-view nasal/temporal labels swap between RE and LE. Marks themselves are not mirrored.
- Pointer capture replaces canvas-only mouse/touch events. Release outside the canvas, cancellation and lost capture finish the recorded portion once. Secondary pointers are ignored and strokes retain their starting eye/tool. Canvas touch scrolling is disabled only within the drawing surface.
- Red-mode distortion lines are white and Missing marks match the black background. Coverage semantics are unchanged.
- Every redraw restores current computed overlays once, including eye switches, display changes, flashing and resizing. Report snapshots use a visible fixation dot and restore the previous display state.

## Verification

22 tests pass, including four new interaction regressions. Generated bundle parity and JavaScript syntax check pass. HTTP browser review at 360 × 740 confirmed stale-report invalidation after fellow-eye Compute, patient-name invalidation, Red-mode visible drawing, outside-canvas release, computed overlays, eye switching and reset. No captured console warnings/errors. Test examination cleared before hand-off. Release token: 20260929-logic1.

Browser checks initially ran before app load completed; waiting for load resolved the premature interaction. Temporary cache bypass was restored before successful checks.

Direct-file runtime, physical touch devices, installed-offline behaviour and independent clinical sign-off remain unverified. Cancellation is covered by the shared controller path and unit tests, not a physical-device test. No diagnostic thresholds or clinical severity claims added.
