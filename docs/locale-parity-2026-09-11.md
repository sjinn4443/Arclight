# Spanish coverage parity: Nepali, French and Luganda

Baseline: Spanish dictionary commit `f4f64a9c` (`spanish01`) and the current
Fundal Reflex narration timeline. Luganda (`lg`) is newly added at the user's
request; Lingala (`ln`) remains a separate existing language.

| Language | Dictionary work                                                                   | General video subtitles                          | Fundal Reflex narration    |
| -------- | --------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------- |
| Nepali   | 4,548 missing/English entries translated; malformed “Time is up” value repaired   | Existing 82 files checked against Spanish timing | New M4A and 36-caption VTT |
| French   | 4,655 missing/English entries translated                                          | Existing 82 files checked against Spanish timing | New M4A and 36-caption VTT |
| Luganda  | New dictionary with all 10,491 Spanish-baseline leaf entries, plus language label | 82 new VTT files, registered in catalogs         | New M4A and 36-caption VTT |

English source text was translated directly where available, using Spanish
as the coverage baseline. Existing translations were retained except English
carry-overs and the malformed Nepali value. Repeated source strings reused
existing locale translations. Google Translate supplied the bulk translation;
placeholders and markup were protected. Narration received a separate wording
and timing pass. Quiz arrays retain their original structure.

Integration includes language selection, app dictionaries, anterior-segment
and Fundal quizzes, shared interactive subapps, video subtitle catalogs,
full-animation and scrolly narration, and offline downloads. Offline narration
selects the requested language where present and English for videos that
have no translated track.

## Verification

- Complete Spanish dictionary leaf coverage and quiz array shapes in all three languages.
- No lost English-source template variables.
- All 82 general subtitle files per language have Spanish-identical cue timing.
- Narration hashes, file sizes, catalog links and seven silent section titles verified.
- Audio durations: 274.270 seconds; maximum cue playback speeds: Nepali 1.044×,
  French 1.045135×, Luganda 1.055× (limit 1.08×).
- Strict translation QA: no missing keys, missing literal keys, damaged strings,
  unexpected exact-English UI values, or configured medical-homonym violations.

Bulk translations and Luganda pronunciation have not been approved by a native
clinical reviewer. Automated verification does not establish clinical accuracy.
The [narration README](../public/narration/fundal-reflex/full-animation/README.md)
records synthetic voice providers and the Luganda model's noncommercial license.

## Reproduction

The translation script is resumable using `tmp/locale-parity` caches. It calls
the Google Translate endpoint and therefore requires network access. Run the
refinement scripts after bulk generation to restore the reviewed narration.

```sh
node scripts/update-ne-fr-lg-translations.cjs
node scripts/refine-parity-dictionaries.cjs
node scripts/refine-parity-narration.cjs
python scripts/generate-fundal-narration.py --languages ne fr lg --skip-review-video
node scripts/connect-parity-locales.cjs
node scripts/check-translations.cjs --strict-english
```

No commit or deployment was made.
