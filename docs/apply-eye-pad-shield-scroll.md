# Apply an Eye Pad and Eye Shield

The scrolly at `#/eyePadShield/applyEyePadShieldScrollPage` follows the linked PEC demonstration at `#/eyePadShield/eyeCareVideo-apply_eye_pad`. Six scenes share eleven caption and speech cues. English follows the original spoken wording. English, Korean and Urdu use the Pupils PEC voices Sonia, SunHi and Uzma. Chichewa uses the same MMS voice as the corresponding real-life video dub.

| Scene                    | Demonstration                                                                                                                                                                          |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preparation              | Start with the equipment list. A white packet holds five thin tan Steri-Strips between the eye pad and the adhesive tape roll.                                                         |
| Explain the procedure    | Explain the procedure and obtain consent. The inset shows the Steri-Strips, placement and taping of the pad, then placement and taping of the shield.                                  |
| Tape the eyelid          | Ask the patient to gently close both eyes and demonstrate positioning the strips from the upper lid down to the lower lid and cheek.                                                   |
| Prepare the pad          | Lay one length of adhesive tape across the pad.                                                                                                                                        |
| Place and secure the pad | Place the taped pad directly over the closed eyelid and add securing strips.                                                                                                           |
| Apply the shield         | Tape the visible side of the cone, position the shield over the pad, then bring the second strip in from a distance and attach it around the far side. The shield is 262.2 units wide. |

The caption changes with each spoken cue. Scene playback and replay use the same absolute media clock for all four languages. When each scene finishes, its complete captions appear together. The seated patient and equipment reuse the original illustrations recorded in `provenance.json`.

## Rebuild

Run `node scripts/build-apply-eye-pad-shield-scroll.cjs` to rebuild the Lottie scenes and caption script. On Windows, run `scripts/generate-apply-eye-pad-shield-narration.ps1 -Python <python>` to publish the AAC audio and WebVTT captions. The FFmpeg mixer reuses matching Chichewa lines and generates revised lines with the local MMS model. Pass `-ChichewaDub` to use a different M4A with its matching VTT file alongside it.
