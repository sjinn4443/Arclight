# System Patterns

## Incomplete assessment safety — 30 September 2026

Do not discard independently recorded positive concerns when core inputs are missing. Keep the result `Not assessed`, preserve urgent precedence and render recorded concern notes. Missing safety checks make a phenotype `Possible`, not definite. White reflex with positive posterior findings is reachable; only white plus normal back-of-eye is a normalised duplicate. The three-note cap may trim a lower-priority consistency note, but its flag and VA/reflex recheck fields must survive.

<!-- APP-DOC-STATUS:START -->

## Historical Memory Status (26/7/2026)

- Release: `v1.1`; state reset, transient UI, offline and assessment-safety patterns documented.
- Static packaging: direct-file basic use plus HTTP/HTTPS installable offline support.
- Mobile target: `360 x 740`, using one document scroll and no internal card scrolling.
- Shared appbar: `54px` high; `Quicksand` `25px`/`700` title; `44 x 44` burger and info buttons set `12px` from the edges.
- Burger glyph: shared CSS three-bar mark, `18px` wide with `2px` strokes, so no app depends on a bold font glyph.
- Shared side menu: left drawer under the appbar; `min(76vw, 284px)` width; `16px` padding; pale `#f8fbff` surface; blue-grey border; card-style actions with small level dots.
- Appbar content colour: orange `#ff8a00` on a black appbar.
- Favicon: current black-square app favicon with the app letter or letters centred.
- Keep safety-relevant routing in the pure engine and rebuild the generated bundle from source.
<!-- APP-DOC-STATUS:END -->

## Architecture Pattern

- One-page static UI (`index.html`, `style.css`).
- Module entrypoint (`script.js`) boots `src/app.js`.
- Controllers by concern:
  - `cataract-controller` for clinical form state + rendering,
  - `mcq-controller` for 3-level MCQ flow,
  - `info-popup-controller` and `image-preview-controller` for focused UI behavior.
- Pure rule engine:
  - `cataract-engine` takes plain inputs and returns deterministic decision payloads.

## Assessment Access Pattern — September 2026

1. Fundal findings can be entered before history and VA are complete.
2. A completed assessment requires `onset + eyes + age + distanceVA`.
3. Back section unlock only after Fundal selection.
4. Dense defaults only a blank Back entry to `poor view`; explicit findings stay editable.
5. Urgent partial assessments can show advice without a cataract diagnosis. Incomplete history must not erase observed findings.

Blank pain, pupil, front-eye and afferent controls remain unassessed. Recorded `No` is a separate deliberate state.

Lock state is applied through:

- section dim class,
- `aria-disabled`,
- disabling controls inside locked sections.

## Completed-Assessment Decision Precedence Pattern

1. Required-input gate.
2. White/back normalization without erasing explicit posterior findings.
3. Posterior disease precedence while retaining a possible coexisting cataract phenotype.
4. Fundal pathway (normal vs cataract-pattern).
5. Distance-VA severity modulation.
6. Age modifiers.
7. Exam/history safety modifiers.
8. Consistency/re-check warnings.
9. Urgency escalation, including same-day routing for every sudden visual loss.
10. Note policy and final output shaping.

## Consistency/Anomaly Pattern

- Contradictions add:
  - note codes,
  - `requires_recheck` flag,
  - `recheckFieldKeys` for targeted flashes.
- Current anomaly families include:
  - dense reflex with relatively good distance,
  - abnormal reflex with 6/6,
  - fix/follow in non-child age,
  - distance/near mismatch checks.

## Result Rendering Pattern

- Core action line (`Next Step`) is singular and short.
- Supporting `Check` notes are:
  - deduplicated against main action text,
  - capped by action colour severity.

## Assessment Reset Pattern

- `New assessment` lives in the drawer so the main one-page workflow remains unchanged.
- The first activation changes the action to `Clear assessment?` for ten seconds.
- The second activation resets the form, image selections, result, re-check styles and progressive locks.
- MCQ progress and the cup achievement are user-level learning state and remain intact.

## Transient UI Pattern

- Quick guide and MCQ modal move focus to their close controls.
- Escape closes transient interfaces and returns focus to the originating control.
- Long-press image enlargement persists until explicit close, outside interaction or Escape.

## Offline Pattern

- `pwa-register.js` registers only over HTTP or HTTPS.
- `service-worker.js` uses the `arclight-cataract-` cache prefix.
- Activation deletes only older Cataract caches.
- The complete runtime shell and active local images are pre-cached.

## Refactor protection — 26 July 2026

- Build `src/app.js` with pinned esbuild through `npm run build`.
- Use `npm run build:check` as the non-writing source-to-bundle parity gate.
- Current release contract: align `RELEASE_VERSION` in `service-worker.js` with the stylesheet query. The clinical bundle retains its separate `20260929-logic1` token.
- Do not restore unused copy accessors unless a real caller and test require them.
