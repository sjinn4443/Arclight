# Tech Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: red `#f04444` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Last updated: 18/5/2026

## Runtime

- Static browser app.
- HTML, CSS and vanilla JavaScript.
- No build step required for the MVP.
- No backend.
- Offline-friendly once assets are local.

## Local Run

From `C:\Users\William\Desktop\Arclight App`:

```powershell
python -m http.server 8080
```

Open:

```text
http://127.0.0.1:8080/Diabetic/index.html
```

## Base Viewport

Primary review size:

```text
360 x 740
```

Also spot-check:

- narrow mobile around `360px`.
- tablet around `768 x 1024`.
- laptop width.

## Planned Files

- `index.html`: semantic page shell, appbar, drawer, popup and panel mount points.
- `styles.css`: tokens, layout, appbar, drawer, popup, panels, cards and responsive rules.
- `script.js`: entrypoint and controller wiring.
- `src/state.js`: default state and update helpers.
- `src/findings.js`: finding definitions and display metadata.
- `src/triage.js`: pure triage logic.
- `src/referral-note.js`: referral text builder.
- `src/practice-cases.js`: drawer practice image-case metadata.
- `src/mcq-data.js`: MCQ level metadata and question banks.
- `src/mcq.js`: MCQ rendering, sampling, shuffling and scoring.
- `src/ui-shell.js`: appbar, drawer, popup and Allan-style clinical mode-tab behaviour.

## Suggested Checks After Build

Syntax:

```powershell
node --check script.js
node --check src/state.js
node --check src/findings.js
node --check src/triage.js
node --check src/referral-note.js
node --check src/practice-cases.js
node --check src/mcq-data.js
node --check src/mcq.js
node --check src/ui-shell.js
```

Manual browser checks:

1. app loads without console errors.
2. appbar matches the black/red Arclight style.
3. side drawer opens and closes.
4. quick guide opens and closes.
5. Arclight (DO)/Holo (BIO) switching works.
6. mode tabs expose `tablist`, `tab` and `tabpanel` semantics.
7. mode tabs support `ArrowLeft`, `ArrowRight`, `Home` and `End`.
8. Right/Left eye switcher stores per-eye view, VA and findings.
9. right-eye and left-eye view dropdowns update without expanding the layout.
10. Holo (BIO) `four-quadrants` does not persist as an invalid Arclight (DO) state for either eye.
11. Proliferative signs in one eye plus ungradable fellow eye still trigger `Urgent (today)`.
12. one adequate clear eye plus one ungradable eye does not produce routine reassuring output.
13. dilation check status, dilation status and reason if not dilated are visible in the View panel, Action panel and referral note.
14. Cataract-style right and left distance VA dropdowns display selected values clearly.
15. VA thresholds behave as documented.
16. `No referable signs seen` clears lesion findings and lesion findings clear it.
17. reduced or untestable VA contributes to macula-risk wording without diagnosing DMO.
18. BP, lipids and HbA1c tick-boxes appear in the Action panel and referral note without changing urgency.
19. ungradable state is not reassuring.
20. Proliferative signs trigger `Urgent (today)`.
21. macula-risk signs trigger `Refer soon (2 weeks)`.
22. routine DR signs trigger `Routine referral when possible`.
23. referral note includes right-eye and left-eye sections.
24. drawer image practice opens without mutating clinical state.
25. MCQ modal opens for Primary, Intermediate and Advanced from the drawer.
26. MCQ bank counts are Primary `16`, Intermediate `26` and Advanced `26`.
27. MCQ answer indexes are valid.
28. MCQ sampled rounds use `5`, `6` and `8` questions.
29. MCQ pass marks are `3`, `4` and `6`.
30. no horizontal overflow at `360 x 740`.

## Asset Rules

- Placeholder assets live under `assets/placeholders/`.
- Use local images only.
- Keep image card aspect ratio stable, preferably `4:3`.
- Final assets should replace placeholders by filename or by metadata update.
- Do not add external image dependencies.
