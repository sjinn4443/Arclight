# Front of Eye full-animation narration

The player uses `New_FrontofEyeFullAnim_timed.mp4`. Its visual holds are encoded
into the video rather than scheduled by runtime timers. Video, captions and
narration use one absolute media timeline, including after seek, replay or reload.
The original `New_FrontofEyeFullAnim.mp4` is retained as the editing source.

| Original video | Hold length | Timed video freeze  |
| -------------- | ----------- | ------------------- |
| 00:06          | 4 seconds   | 00:06–00:10         |
| 00:16          | 5.5 seconds | 00:20–00:25.500     |
| 00:40.500      | 5 seconds   | 00:50–00:55         |
| 01:12.500      | 7 seconds   | 01:27–01:34         |
| 01:17          | 4 seconds   | 01:38.500–01:42.500 |
| 01:23.500      | 4 seconds   | 01:49–01:53         |
| 01:27.500      | 3.1 seconds | 01:57–02:00.100     |
| 01:43.400      | 7.5 seconds | 02:16–02:23.500     |
| 01:53.900      | 1.1 seconds | 02:34–02:35.100     |
| 02:01          | 3 seconds   | 02:42.200–02:45.200 |

The right/left gaze cue plays at 00:27–00:30.500 without an additional hold.
The up/down cue plays at 00:38–00:46.800. The first structure group plays
at 00:50–00:55 while the video holds, clearing before motion resumes.
The conditions cue plays during the 01:27–01:34 photo hold. The anterior chamber definition follows
at 01:42, then temporal-light narration at 01:46.850–01:53. The matching
frame holds at 01:49–01:53. Subsequent cues include the additional seven-second photo hold.
The nasal-shadow frame holds at 01:57–02:00.100 until its narration clears.
Fluorescein application narration starts at 02:04; subsequent inspection cues
move 3.1 seconds with the added shadow hold.
The stained-cornea examples hold at 02:16–02:23.500 throughout the epithelial-loss
explanation. Later lid-eversion cues move 7.5 seconds with this additional hold.
The eyelash-grip cue starts at 02:31 and ends at 02:36.700. A 1.1-second
hold at 02:34 prevents overlap with the cotton-bud narration; later cues
move together by 1.1 seconds.
The single-dose dropper terminology follows the [Minims fluorescein product information](https://www.medicines.org.uk/emc/product/1178/smpc).

## Rebuild

Run `node scripts/build-front-of-eye-timed-video.cjs` first. It uses
`FFMPEG_PATH` or the temporary imageio-ffmpeg installation under
`tmp/fundal-narration-tools`. It retains original resolution, produces
30 fps H.264 with one-second keyframes, and excludes the original soundtrack.

Then run the shared narration generator:

```powershell
python scripts/generate-fundal-narration.py --script public/narration/front-of-eye/full-animation/script.json --work-dir tmp/front-of-eye-narration --artifacts-dir .codex-artifacts/front-of-eye-narration --public-dir public/narration/front-of-eye/full-animation --asset-stem front-of-eye-full-animation --languages en
```

`script.json` is the caption and speech source of truth; `en.m4a` and
`en.vtt` are delivery assets. The audio is 171.46 seconds; the 30 fps video
rounds that duration by less than one frame. Review assets remain outside
`public`.
