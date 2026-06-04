# Trauma Repo

<!-- APP-DOC-STATUS:START -->

## Current Status (18/5/2026)

- Static packaging: open `index.html` directly; a local HTTP server is optional for testing.
- Mobile target: `360 x 740`, with the main page kept free of required vertical scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: black `#000000` on a red appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
<!-- APP-DOC-STATUS:END -->

Static web app for calculating Ocular Trauma Score (OTS) style outcomes from presenting visual acuity and selected risk factors.

## What This App Does

- Lets the user select presenting VA.
- Lets the user toggle OTS risk factors.
- Calculates:
  - base score
  - penalty sum
  - final score
  - OTS category
- Shows estimated 6-month VA outcome table.
- Shows a plain-language prognosis line based on active category.
- Shows a collapsible "Calculation" panel explaining how the score was produced.
- Supports quick actions:
  - copy result summary
  - export result summary as text file
- Includes sidebar MCQ levels with tiered tests:
  - Primary: 5 questions from a 10-question bank, pass mark 3/5
  - Intermediate: 6 questions from a 13-question bank, pass mark 4/6
  - Advanced: 8 questions from a 14-question bank, pass mark 6/8

## Current UI Direction

The interface now follows the reusable Fundal Reflex clinical style while preserving the Trauma app bar identity:

- red app bar with black Quicksand title and compact icon controls
- mobile-first layout checked around `360 x 740`
- off-white panels with blue-grey borders and soft shallow shadows
- restrained red accents for identity and priority cues
- light side menu with card-style MCQ actions and small level dots
- soft outer panels, medium action bars, tighter question cards and tight option rows
- MCQ modal uses contained scrolling, Fundal-style question cards, tight option rows and level-specific bank sizes
- compact information popup with short basics first and detail second
- DOM/text rendering for dynamic UI rather than HTML string injection

## Run Locally

This project has no build step.

1. Open [index.html](/c:/Users/William/Desktop/Arclight%20App/Trauma/index.html) directly in a browser.
2. Or serve it with a local static server, for example:

```powershell
python -m http.server 8080
```

Then open `http://127.0.0.1:8080/index.html`.

## Linting

Install dependencies once:

```powershell
npm install
```

Run all linters:

```powershell
npm run lint
```

Individual commands:

- `npm run lint:js`
- `npm run lint:css`
- `npm run lint:html`

## Key Files

- [index.html](/c:/Users/William/Desktop/Arclight%20App/Trauma/index.html): App layout, modal, menu shell.
- [styles.css](/c:/Users/William/Desktop/Arclight%20App/Trauma/styles.css): UI styling and responsive behavior.
- [script.js](/c:/Users/William/Desktop/Arclight%20App/Trauma/script.js): Scoring logic, MCQ logic, dynamic rendering.
- [package.json](/c:/Users/William/Desktop/Arclight%20App/Trauma/package.json): Lint scripts and dev tooling.
- Image assets: `assets/images/globe.webp`, `assets/images/hypo.webp`, `assets/images/hook.webp`, `assets/images/retd.webp`, `assets/images/rapd.webp`.

## Scoring Logic Summary

- Base score comes from selected presenting VA.
- Each checked risk factor contributes a negative penalty.
- Final score = base score + sum(penalties).
- Category bands:
  - `<= 44` -> 1
  - `45-65` -> 2
  - `66-80` -> 3
  - `81-91` -> 4
  - `>= 92` -> 5
- Outcome percentages are selected from the category table in `acuityMap`.

## Memory Bank

Project memory documents are in `memory-bank/`:

- [projectbrief.md](/c:/Users/William/Desktop/Arclight%20App/Trauma/memory-bank/projectbrief.md)
- [productContext.md](/c:/Users/William/Desktop/Arclight%20App/Trauma/memory-bank/productContext.md)
- [systemPatterns.md](/c:/Users/William/Desktop/Arclight%20App/Trauma/memory-bank/systemPatterns.md)
- [techContext.md](/c:/Users/William/Desktop/Arclight%20App/Trauma/memory-bank/techContext.md)
- [activeContext.md](/c:/Users/William/Desktop/Arclight%20App/Trauma/memory-bank/activeContext.md)
- [progress.md](/c:/Users/William/Desktop/Arclight%20App/Trauma/memory-bank/progress.md)
