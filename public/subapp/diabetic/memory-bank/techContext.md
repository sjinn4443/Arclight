# Tech Context

<!-- APP-DOC-STATUS:START -->

## Current Memory Status (21/5/2026)

- v1 app review completed on `21/5/26`.
- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Main screen: image-led diabetic case practice viewer using the Swollen Discs draggable circular viewing engine.
- Case assets: ten expanded WebP diabetic cases in `assets/images/diabetic/`, with thumbnails plus light and dark pigmentation support.
- Viewer controls: `<` / `>` case navigation, icon-only case information, R/L orientation, Gaze, Dilated, Skin and full-width Adv controls for cataract blur and nystagmus.
- Arclight (DO): compact direct-view simulation.
- Holo (BIO): wider lens-style view; corneal reflection is hidden; field is `15 deg` undilated and `25 deg` dilated, and switching to Holo does not automatically switch Dilated on.
- Exam system: RE and LE VA, View, Findings and Action live in one separate compact Exam box below or beside the viewer.
- Findings: paired per-eye dropdowns are both labelled `Findings` and group no referable signs, DR signs, macula risk and proliferative signs with mini explanations.
- Action logic: outputs `Routine (weeks)`, `Soon (days)`, `Urgent (today)`, `Ungradable (repeat)` or `Record both eyes` using green, orange, red and neutral chips, with a compact `+` expander for details.
- Quick guide, side drawer, practice cases, findings guide and referral note follow the Fundal Reflex compact UI pattern.
- Quick guide popup shows `v1 21/5/26` at bottom right.
- MCQs are clinically audited across Primary, Intermediate and Advanced and use the Fundal-style modal with the scrolling question list and fixed `Submit Test` button.
- Final UI polish: equal-width VA/View selects, lighter select text and muted mid-grey Temporal/Nasal canvas labels.
- Responsive checks completed at `360 x 740`, `768 x 1024`, `1024 x 768` and `1366 x 768`.
- Latest Lighthouse: mobile `90 / 100 / 100 / 100`; desktop `100 / 100 / 100 / 100`.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Favicon: black square with a centred red `D`.
<!-- APP-DOC-STATUS:END -->

Last updated: 21/5/2026

## Runtime

- Static browser app.
- HTML, CSS and vanilla JavaScript.
- Source modules are bundled to `app.bundle.js` with esbuild for the checked runtime.
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

## Suggested Checks After Changes

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
13. dilation status and reason if not dilated are visible in the main controls, Action panel and referral note.
14. Cataract-style right and left distance VA dropdowns display selected values clearly.
15. VA thresholds behave as documented.
16. `No referable signs seen` clears lesion findings and lesion findings clear it.
17. reduced or untestable VA contributes to macula-risk wording without diagnosing DMO.
18. BP, lipids and HbA1c tick-boxes appear in the Action panel and referral note without changing urgency.
19. ungradable state is not reassuring.
20. Proliferative signs trigger `Urgent (today)`.
21. macula-risk signs trigger `Soon (days)`.
22. routine DR signs trigger `Routine (weeks)`.
23. referral note includes right-eye and left-eye sections.
24. drawer image practice opens without mutating clinical state.
25. MCQ modal opens for Primary, Intermediate and Advanced from the drawer.
26. MCQ bank counts are Primary `16`, Intermediate `26` and Advanced `26`.
27. MCQ answer indexes are valid.
28. MCQ sampled rounds use `5`, `6` and `8` questions.
29. MCQ pass marks are `3`, `4` and `6`.
30. no horizontal overflow at `360 x 740`.
31. responsive layout remains usable at `768 x 1024`, `1024 x 768` and `1366 x 768`.
32. quick guide popup still shows `v1 21/5/26` at bottom right.
33. MCQ question-card borders do not cut through question text.
34. MCQ `Submit Test` stays visible while the question list scrolls.
35. Exam dropdown widths remain balanced at `360 x 740`.

## Asset Rules

- Final diabetic case assets live under `assets/images/diabetic/`.
- Use local images only.
- Keep image card aspect ratio stable, preferably `4:3`.
- Case image metadata is kept in `src/viewer-config.js`.
- Do not add external image dependencies.
