# Allan constrained-device test checklist

## Status

- Simulated viewport review at `360 x 740`: completed in the Codex in-app browser
- Physical low-memory Android handset: **Pending**
- Android Go or equivalent: **Pending**
- Offline installed-app test: **Pending on physical device**

Record the device model, Android version, browser version, available memory and test date for every run.

## Installation and offline use

- [ ] Load Allan once while online and confirm the service worker finishes installing.
- [ ] Add Allan to the home screen and launch it in standalone mode.
- [ ] Enable aeroplane mode, relaunch Allan and open every route and illustrative reference.
- [ ] Confirm external clinical links fail gracefully while offline and work again when connected.
- [ ] Confirm an app update replaces the old cache without losing MCQ achievements.

## Camera, memory and files

- [ ] Capture area, close-up and dermoscopy images using the device camera.
- [ ] Repeat with gallery images in JPEG, PNG and WebP formats.
- [ ] Replace each image several times and confirm memory remains stable.
- [ ] Try a file over `12 MB` and an unsupported file type and confirm a clear rejection message.
- [ ] Open the enlarged comparison after all three photos are attached.
- [ ] Tap New twice and confirm photos disappear, object URLs are released and all clinical selections reset.
- [ ] Confirm MCQ progress remains after New.

## Referral and reporting

- [ ] Verify lesion, dermoscopy, rash and Wood lamp routes against the clinical acceptance cases.
- [ ] Confirm `Photos 0/3`, `Photos 0/2` and the ready state update correctly.
- [ ] Copy a report into the device notes app.
- [ ] Share a report with one, two and three photos and confirm neutral attachment filenames.
- [ ] Cancel the share sheet and confirm Allan remains usable.

## Interaction and accessibility

- [ ] Complete all controls using touch without accidental activation.
- [ ] Use a Bluetooth keyboard to navigate tabs and the location listbox with arrow keys, Home, End, Enter and Escape.
- [ ] Test Android screen magnification and the largest system font setting.
- [ ] Test TalkBack announcements for tabs, referral state, photo readiness and modal close controls.
- [ ] Confirm no important control is obscured by browser bars, display cut-outs or the on-screen keyboard.

## Pass record

- Device and browser:
- Tester:
- Date:
- Result:
- Issues found:
- Evidence location:

## Automated MCQ preflight — 26 July 2026

- [x] Primary MCQ opened and rendered five questions in isolated Chrome at `360 x 740`.
- [x] Unanswered submission was blocked and focus moved to the first missing answer.
- [x] Correct and incorrect review styles, explanations and source labels rendered after marking.
- [x] `Try fresh questions` cleared the previous answers and started a new attempt.
- [x] Answer rows measured at least `44px` high.
- [x] No console error was observed.
- [ ] Repeat these checks on a named physical constrained device.

Automated screenshot: `output/playwright/allan-mcq-primary-review-360x740.png`.
