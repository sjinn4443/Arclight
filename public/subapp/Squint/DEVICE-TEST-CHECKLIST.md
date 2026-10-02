# Constrained-device checklist

Condition-logic re-audit: 24 July 2026.

- [x] Direction, Waveform and Rate are disabled, dimmed and removed from keyboard focus until Nystagmus is enabled.
- [x] Switching Nystagmus on restores all three controls and preset-driven nystagmus cases retain their values.
- [x] Guide distinguishes direct iris drag from Gaze tracker and still requires no internal scrolling.
- [x] Neutral observation reads `No urgency modifiers selected.`.
- [x] Preset search measures 44px high and filters all 68 existing buttons without reordering the catalogue.
- [x] `duane` returns one existing result and Escape restores all 68 buttons while retaining the open drawer.
- [x] `Pain / headache` and `Pupils, iris and lids` remain readable at `360 x 740`.
- [x] Cache `squint-v1-1-20260724-squint9` and matching browser-visible assets are present.
- [ ] Repeat iris drag, cover, torch, Advanced sliders and preset search on a physical touch device.

- [x] Untouched result reads `No alignment pattern detected.` and separates Pattern from Observations.
- [x] A later non-primary gaze action clears the released `Uncover:` observation when neither eye is covered.
- [x] Information guide explains examiner-facing RE/LE orientation and SR, IR, MR, LR, SO and IO without internal scrolling at `360 x 740`.
- [x] Advanced Context, Movement and Pupils / lids section labels render at `10.88px`; control labels render at `12.48px`.
- [x] Direction, Waveform, Rate and RE/LE torsion labels remain fully visible with no clipped labels or horizontal overflow.
- [x] Upper-lid controls visibly identify RE and LE.
- [x] Retained Squint tab refreshed twice and its real device toolbar remained `360 x 740` after switching to Allan and back.

- [x] `Gaze tracker` title and Primary/live-direction status fit on one line at `360 x 740`.
- [x] The 22px target is aligned to the app’s primary-gaze neutral point and remains inside the tracker in active gaze.
- [x] Graded muscle activation is visible in the Squint yellow accent while RE remains left and LE remains right.
- [x] Top ambient-light switch uses a downward-facing ceiling-light bulb symbol, retains a `44 x 44px` target and exposes the accessible name `Ambient light`.
- [x] Tap and keyboard torch actions traverse the full track in about 700ms, transfer the active side at the midpoint and return smoothly to centre.
- [x] Direct-drag glow measures about `0.05` just beyond centre, `0.55` midway towards an eye and `0.86` at the end.
- [x] Direct torch dragging remains pointer-attached.
- [x] Holding `Near` constricts both pupils and converges the irises 4px inward without changing primary-alignment diagnosis.
- [x] Physiological pupil side transfer retains its `460–880ms` range.
- [x] Cover drift is absent before the `1080ms` cover-settle point and present afterwards for a phoria preset.
- [x] Cover-uncover, alternate-cover, under-cover and uncover observations are emitted.
- [x] A manual pupil-size edit clears preset pupil models, reactivity, RAPD and diagnostic hints.
- [x] Near is centred directly below the torch track with a `0px` centre delta at `360 x 740`.
- [x] The active cover is circular, visibly edged, contained in the stage and clear of the light controls.
- [x] All 68 preset rows passed over HTTP at exactly `360 x 740`.
- [x] All 68 preset rows passed through direct-file launch at exactly `360 x 740`.
- [x] No horizontal overflow and no runtime errors on either route.
- [x] Dynamic checks passed for the cranial-nerve, A/V, myasthenic, nystagmus, INO, Duane, DVD and near-response behaviours.
- [ ] Repeat the named dynamic checks on a physical touch device.
- [ ] Complete an installed-PWA cold-start and offline check.

Additional engineering review: 24 July 2026.

- [x] Automated `360 x 740` review confirms untouched trackpad gaze stays normal in all eight named directions while the muscle readout responds.
- [x] Automated review confirms direct outward and down-and-out alignment plus Brown, Duane and A-pattern motility behaviour.
- [ ] On a physical device, repeat normal trackpad gaze and the Brown, Duane and A/V-pattern checks.

Target: 360 × 740. Date: 23 July 2026.

- [x] Local HTTP runtime returned 200.
- [x] Runtime locality, initial teaching-state and accessibility contracts passed.
- [x] Existing source parity harness passed.
- [x] Untouched, dense, completed, information, drawer, armed-reset and completed-reset screenshots pass over HTTP and direct-file routes at exactly `360 x 740`, with no horizontal overflow or runtime errors.
- [x] Updated shell returned HTTP 200 with the `20260724-ui4` stylesheet version.
- [x] Fresh HTTP review at exactly `360 x 740` confirmed RE-left and LE-right gaze order, correct advanced-control names, neutral resting torch, working fade pressed state and no browser warnings or errors.
- [x] Retained Squint tab reloaded and reverified through the real device toolbar at `360 x 740` after switching away and back.
- [ ] Physical-device review.
- [ ] Installed-PWA cold-start and offline review.

Physical-device status: **not completed**.

## MCQ quality follow-up — 26 July 2026

- [x] Automated contracts cover all 47 stable question IDs, rationales, sources and review states.
- [x] Isolated HTTP browser path at `360 x 740` verified atomic unanswered handling, result review, 44px option rows, source display, retry scroll reset, no horizontal overflow and no browser errors.
- [ ] Verify the unanswered guard reveals no partial grading and focuses the first missing item on a physical device.
- [ ] Confirm the revised cover-uncover prompt and post-result explanations remain readable at `360 x 740`.
- [ ] Verify `Try again` after failure and `New attempt` after a pass with touch and a screen reader.

Physical-device MCQ status: **pending**. Isolated browser automation is not physical-device acceptance.
