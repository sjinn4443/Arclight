# Fleet UI alignment

## Current fleet UI refinement receipt — 30 September 2026

Bounded scrollable quiz panel; regular answer text; independent wider-screen input/output columns.

App-local versioned `fleet-ui-refinements.css` aligns quiz typography, answer rows, focus outlines and rounding where compatible. Information footers show `v1 · 30/9/2026`. Clinical engines, simulator geometry, authored questions, scoring and progression are unchanged. Earlier dated entries below are historical.

Fleet evidence: 24/24 regression jobs, 45 main-page views, 15/15 HTTP information/drawer reviews, 15/15 direct-file information/drawer reviews and 18/18 selected expanded/completed-state checks. All 14 Primary quiz workflows pass individually; Cataract passed its isolated recheck after one transient connection warning. Automated viewports are temporary. Real Codex retained-toolbar verification remains blocked by the unavailable visible tab; physical-device acceptance and independent clinical sign-off remain pending. See the [full change and verification receipt](../../FLEET_UI_REFINEMENTS_2026-09-30.md).

## 28 September 2026

- Information card: `16px` radius and `44 x 44px` close target.
- Comparable card headings: `15px/700/1.2`. Compact control labels retain their established hierarchy.
- Clean Chromium evidence at `360 x 740`: no overflow, no internal card scrolling, Escape focus return and zero console errors.
- Cover-test, pupil and gaze logic were not changed. Physical-device acceptance remains pending.
