# Cataract Constrained-device Test Checklist

## Status

- Simulated viewport review at `360 x 740`: **Completed 26 July 2026**
- Simulated visual-system review: **Untouched, missing-check, mature, sudden, paediatric and detached-retina states passed with no horizontal overflow or console errors**
- Compact History controls: **Original single-line arrangement retained with no rendered intersections from 360 x 740 through 566 x 1280**
- Physical low-memory Android handset: **Pending**
- Android Go or equivalent: **Pending**
- Installed offline launch on a physical device: **Pending**
- Fresh direct-file manual smoke check after the 26 July safety pass: **Pending; automated harness blocks `file://`**

Desktop browser simulation does not count as physical-device acceptance.

Record the device model, OS version, browser version, available memory, test date and evidence location for every physical run.

## Installation and Offline Use

- [ ] Load Cataract over HTTPS or local HTTP and wait for service-worker installation.
- [ ] Add Cataract to the home screen and launch it in standalone mode.
- [ ] Enable aeroplane mode, relaunch the app and complete a basic assessment.
- [ ] Confirm an updated cache replaces the previous Cataract cache only.
- [ ] Confirm sibling Arclight app caches remain untouched on a shared origin.

## Main Workflow

- [ ] Complete gradual and sudden history paths.
- [ ] Confirm sudden painless visual loss shows same-day assessment.
- [ ] Confirm blank safety controls remain unassessed and request completion.
- [ ] Confirm one eye shows affected-eye VA and two eyes shows worse-eye VA.
- [ ] Confirm paediatric white reflex shows urgent paediatric review.
- [ ] Test every distance-VA and child-friendly VA option.
- [ ] Confirm Fundal Reflex and Back of Eye unlock in the documented order.
- [ ] Confirm Dense reflex forces Poor view.
- [ ] Confirm selected findings survive ordinary menu and quick-guide use.
- [ ] Confirm `New assessment` then `Clear assessment?` removes the complete case.
- [ ] Confirm MCQ achievements remain after clearing the assessment.

## Interaction and Accessibility

- [ ] Check controls at the largest system font setting.
- [ ] Check touch targets and accidental activation.
- [ ] Check long-press image enlargement and its visible close control.
- [ ] Check menu, quick-guide and MCQ focus handling with a screen reader.
- [ ] Check browser bars, display cut-outs and on-screen keyboard overlap.
- [ ] Check portrait and landscape orientations.

## Evidence

- Device:
- OS:
- Browser:
- Available memory:
- Test date:
- Tester:
- Evidence location:
- Result and limitations:
