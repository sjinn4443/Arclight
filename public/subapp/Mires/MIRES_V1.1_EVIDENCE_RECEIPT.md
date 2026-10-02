# Mires v1.1 evidence receipt

UI hierarchy follow-up, 26 July 2026: at `360 x 740`, equal `159 x 44px` mode launchers use a `10px` gap, matching neutral surfaces and `12px` radii. Both open mobile drawers measure `x=10`, `width=340`, `radius=16px` and the quieter Controls dock measures `x=16`, `width=328`, `radius=16px`. The original game area remains exactly `x=10`, `y=74`, `340 x 656`. Goldmann/Newton geometry, scoring and controls are unchanged.

Date: 26 July 2026

Implemented: local fonts, session reset, overlay accessibility, scoped PWA, pinned build, contracts and restrained hierarchy polish. The final presentation pass also removed unnecessary italics from estimate controls and corrected `Variable IOPs` punctuation. Preserved: all simulator logic, thresholds, sampling, workflow, IDs and accent.

Automated checks: `npm run check` passed 9/9 contracts and exact source/bundle parity. `npm run test:browser` passed the full hierarchy, untouched, completed, dense, transient, reset, offline and direct-file suite. No JavaScript source or generated bundle changed in this UI-only follow-up.

Browser evidence: isolated headless Chrome at exactly `360 x 740` passed hierarchy geometry, untouched, completed Newton, dense controls, MCQ modal, reset confirmation and offline reload states with no console or page errors. Direct-file layout and functionality also passed at `360 x 740`; Chromium blocked the local WOFF2 requests under `file://` and used the documented system-font fallback. Screenshots are in `output/playwright/`. The document width equalled the viewport width. Drawer screenshots are captured only after the slide transition settles.

The real retained Codex browser tab also read `360x740` before setting, immediately after setting and after switching to Trauma and back. The closed launcher state, Newton panel and Variable IOP panel were inspected visually without collision or horizontal overflow.

Newton touch-target follow-up, 26 July 2026: the close control, 20/25/30 buttons, all nine estimate choices and New Case/Submit now measure `44px` high, with a `44 x 44px` close target. The estimate pills fill their grid columns, untouched and completed states require no internal scrolling and the retained Codex tab remained at `360 x 740`. The Newton-point row uses stronger colour-matched `2px` borders and subtle inset depth, while estimate buttons retain `1px` borders. Cache and stylesheet version: `20260726-point1`.

The transient screenshot deliberately combines the open side drawer and the MCQ modal to verify layered focus and overlay behaviour. The pale strip at the left is the visible drawer behind the modal, not a clipped panel.

Clinical sign-off and physical-device acceptance remain pending.

## MCQ quality receipt — 26 July 2026

- Questions audited: 30 total — 10 Primary, 10 Intermediate and 10 Advanced.
- Attempt sizes preserved: 5, 6 and 7.
- Source metadata: Haag-Streit AT 900 instructions primary-source-reviewed, EGS GAT guidance guideline-source-reviewed and simulator scope internal-engineering-review.
- Exact EGS source: European Glaucoma Society Terminology and Guidelines for Glaucoma, 4th Edition — Part 1, https://pmc.ncbi.nlm.nih.gov/articles/PMC5583682/
- Corrected question IDs: `p4` excess fluorescein changed from possible over-reading to possible under-reading. `p5` insufficient fluorescein changed from possible under-reading to possible over-reading.
- UI: explanatory correct and wrong review, unanswered and timeout fail-safe, fresh **New set**, result focus and 44px rows.
- Final automated result: 11/11 source and logic tests passed, generated bundle rebuilt and exact source/bundle parity passed.
- Final isolated browser result: the complete exact `360 x 740` hierarchy, untouched, completed, dense, transient, reset, offline and direct-file suite passed. The MCQ review covered the unanswered guard, five explanations, 44px rows, result focus, New set focus, Escape focus return, overflow and console errors.
- Browser evidence: `output/playwright/mires-mcq-review-360x740.png`.
- Clinical gate: independent sign-off remains pending.
