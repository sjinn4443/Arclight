# Hausa, Yoruba and Igbo translation parity

Updated against the Spanish coverage on 2026-09-11. The requested “Igbu” is
implemented as the existing Igbo locale (`ig`).

| Locale        | Dictionary entries updated | Existing subtitle files checked | New Fundal Reflex captions |
| ------------- | -------------------------: | ------------------------------: | -------------------------: |
| Hausa (`ha`)  |                      4,665 |                              82 |                         36 |
| Yoruba (`yo`) |                      4,696 |                              82 |                         36 |
| Igbo (`ig`)   |                      4,669 |                              82 |                         36 |

Dictionary updates include missing keys and English carry-overs. Existing subtitle
files already covered Spanish's general video catalog; their cue timings were
checked. Fundal Reflex full-animation titles and narration controls are localized.
The screening subapp and anterior-segment case-study controls also use these locales.

Each language now has a 274.27-second Fundal Reflex narration track, used by both
the full animation and its scrolly sections, with translated VTT captions. Narration
defaults to the app language. As of the 2026-09-14 follow-up, choosing a language
in the narration menu also selects that language's subtitles. Selecting Auto
restores the app language for both. Offline language downloads include the new tracks.

| Track  |     Bytes | Maximum timing speed adjustment |
| ------ | --------: | ------------------------------: |
| Hausa  | 1,146,420 |                          1.038× |
| Yoruba |   863,623 |                          1.000× |
| Igbo   | 1,124,955 |                          1.000× |

Validation: eight relevant Jest suites, 93 tests passed. Strict translation QA
reported zero missing keys, missing literal keys, damaged strings, exact-English
carry-overs and configured medical-homonym violations. These are structural and
automated checks, not native-speaker validation of translation or speech quality.
The isolated production build also completed successfully. On 2026-09-14, its
offline manifest, dictionary entries and narration catalog links were verified
for all three locales; built M4A/VTT files match the source assets byte for byte.

The translations and synthetic narration still need native clinical review,
especially Igbo pronunciation. Model attribution, pinned provenance and the
CC-BY-NC-4.0 noncommercial license are recorded in
[the narration README](../public/narration/fundal-reflex/full-animation/README.md).
No deployment is included in this change.
