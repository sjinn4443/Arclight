#!/usr/bin/env python3
"""Generate timed Fundal Reflex narration assets from the bilingual cue sheet.

The script deliberately keeps WAV masters and review MP4s outside ``public``.
Only the small M4A delivery tracks and WebVTT cue files are written into the app.
"""

from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SCRIPT = ROOT / "public/narration/fundal-reflex/full-animation/script.json"
DEFAULT_TOOLS = ROOT / "tmp/fundal-narration-tools"
DEFAULT_WORK = ROOT / "tmp/fundal-narration"
DEFAULT_ARTIFACTS = ROOT / ".codex-artifacts/fundal-reflex-narration"
DEFAULT_PUBLIC = ROOT / "public/narration/fundal-reflex/full-animation"
MAX_PLAYBACK_SPEED = 1.08
SYNC_TOLERANCE_SECONDS = 0.25
NARRATION_LANGUAGES = ("en", "es-419", "ko")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--script", type=Path, default=DEFAULT_SCRIPT)
    parser.add_argument("--tools-dir", type=Path, default=DEFAULT_TOOLS)
    parser.add_argument("--work-dir", type=Path, default=DEFAULT_WORK)
    parser.add_argument("--artifacts-dir", type=Path, default=DEFAULT_ARTIFACTS)
    parser.add_argument("--public-dir", type=Path, default=DEFAULT_PUBLIC)
    parser.add_argument(
        "--asset-stem",
        default="fundal-reflex-full-animation",
        help="Filename stem for WAV masters and review MP4s.",
    )
    parser.add_argument("--ffmpeg", type=Path)
    parser.add_argument("--skip-tts", action="store_true")
    parser.add_argument("--skip-review-video", action="store_true")
    parser.add_argument(
        "--languages",
        nargs="+",
        choices=NARRATION_LANGUAGES,
        help="Only rebuild the selected language tracks (defaults to all languages).",
    )
    return parser.parse_args()


def find_ffmpeg(explicit: Path | None, tools_dir: Path) -> Path:
    if explicit:
        return explicit.resolve()

    system = shutil.which("ffmpeg")
    if system:
        return Path(system)

    candidates = sorted(tools_dir.glob("imageio_ffmpeg/binaries/ffmpeg*"))
    if candidates:
        return candidates[0]

    raise FileNotFoundError(
        "ffmpeg was not found. Pass --ffmpeg or install imageio-ffmpeg in --tools-dir."
    )


def run(command: list[str], *, check: bool = True) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(
        command,
        cwd=ROOT,
        check=False,
        text=True,
        encoding="utf-8",
        errors="replace",
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    if check and result.returncode:
        raise RuntimeError(f"Command failed ({result.returncode}): {' '.join(command)}\n{result.stdout}")
    return result


def probe_duration(ffmpeg: Path, media_path: Path) -> float:
    result = run([str(ffmpeg), "-hide_banner", "-i", str(media_path)], check=False)
    match = re.search(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)", result.stdout)
    if not match:
        raise RuntimeError(f"Could not read duration from {media_path}:\n{result.stdout}")
    hours, minutes, seconds = match.groups()
    return int(hours) * 3600 + int(minutes) * 60 + float(seconds)


def format_vtt_time(seconds: float) -> str:
    milliseconds = round(seconds * 1000)
    hours, milliseconds = divmod(milliseconds, 3_600_000)
    minutes, milliseconds = divmod(milliseconds, 60_000)
    secs, milliseconds = divmod(milliseconds, 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}.{milliseconds:03d}"


def resolve_language_cues(
    script: dict, language: str, timed_cue_key: str = "timedCues"
) -> list[dict]:
    timed_cues = script.get(timed_cue_key, {}).get(language)
    if timed_cues:
        return [
            {
                "id": cue["id"],
                "start": cue["start"],
                "end": cue["end"],
                "text": cue["text"],
                "ttsText": cue.get("ttsText", cue["text"]),
            }
            for cue in timed_cues
        ]

    return [
        {
            "id": cue["id"],
            "start": cue["start"],
            "end": cue["end"],
            "text": cue[language],
            "ttsText": cue.get("ttsText", {}).get(language) or cue[language],
        }
        for cue in script["cues"]
    ]


def write_vtt(cues: list[dict], destination: Path) -> None:
    lines = ["WEBVTT", ""]
    for cue in cues:
        lines.extend(
            [
                cue["id"],
                f"{format_vtt_time(cue['start'])} --> {format_vtt_time(cue['end'])}",
                cue["text"],
                "",
            ]
        )
    with destination.open("w", encoding="utf-8", newline="\n") as handle:
        handle.write("\n".join(lines))


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


async def generate_tts_cues(
    script: dict, language: str, cues: list[dict], cue_dir: Path
) -> None:
    import edge_tts

    voice = script["languages"][language]["voice"]
    semaphore = asyncio.Semaphore(3)

    async def generate(cue: dict) -> None:
        destination = cue_dir / f"{cue['id']}.mp3"
        signature_path = cue_dir / f"{cue['id']}.sha256"
        text = cue["ttsText"]
        signature = hashlib.sha256(
            json.dumps(
                {
                    "pitch": "+0Hz",
                    "rate": "-8%",
                    "text": text,
                    "voice": voice,
                    "volume": "+0%",
                },
                ensure_ascii=False,
                sort_keys=True,
            ).encode("utf-8")
        ).hexdigest()
        if (
            destination.exists()
            and destination.stat().st_size > 0
            and signature_path.exists()
            and signature_path.read_text(encoding="ascii").strip() == signature
        ):
            print(f"[{language}] reuse {cue['id']}", flush=True)
            return

        async with semaphore:
            communicator = edge_tts.Communicate(
                text=text,
                voice=voice,
                rate="-8%",
                pitch="+0Hz",
                volume="+0%",
            )
            await communicator.save(str(destination))
            signature_path.write_text(signature + "\n", encoding="ascii")
        print(f"[{language}] generated {cue['id']}", flush=True)

    await asyncio.gather(*(generate(cue) for cue in cues))


def mix_language(
    ffmpeg: Path,
    script: dict,
    language: str,
    cues: list[dict],
    cue_dir: Path,
    wav_path: Path,
) -> list[dict]:
    duration = float(script["durationSeconds"])
    command = [
        str(ffmpeg),
        "-y",
        "-hide_banner",
        "-loglevel",
        "warning",
        "-f",
        "lavfi",
        "-t",
        f"{duration:.6f}",
        "-i",
        "anullsrc=r=48000:cl=mono",
    ]
    qa_cues: list[dict] = []
    filters: list[str] = []
    mix_inputs = ["[0:a]"]

    for index, cue in enumerate(cues, start=1):
        cue_path = cue_dir / f"{cue['id']}.mp3"
        if not cue_path.exists():
            raise FileNotFoundError(f"Missing TTS cue: {cue_path}")
        command.extend(["-i", str(cue_path)])

        source_duration = probe_duration(ffmpeg, cue_path)
        slot_duration = float(cue["end"]) - float(cue["start"])
        required_speed = max(1.0, source_duration / slot_duration)
        if required_speed > MAX_PLAYBACK_SPEED:
            raise RuntimeError(
                f"{language} cue {cue['id']} is {source_duration:.3f}s for a "
                f"{slot_duration:.3f}s slot (needs {required_speed:.3f}x; maximum is "
                f"{MAX_PLAYBACK_SPEED:.2f}x). Shorten the script instead of speeding it up."
            )

        rendered_duration = source_duration / required_speed
        chain = f"[{index}:a]aresample=48000,aformat=channel_layouts=mono"
        if required_speed > 1.0005:
            chain += f",atempo={required_speed:.6f}"
        delay_ms = round(float(cue["start"]) * 1000)
        chain += f",adelay={delay_ms}:all=1[c{index}]"
        filters.append(chain)
        mix_inputs.append(f"[c{index}]")
        qa_cues.append(
            {
                "id": cue["id"],
                "slotStart": cue["start"],
                "slotEnd": cue["end"],
                "sourceDuration": round(source_duration, 3),
                "playbackSpeed": round(required_speed, 6),
                "renderedEnd": round(float(cue["start"]) + rendered_duration, 3),
                "endMargin": round(slot_duration - rendered_duration, 3),
            }
        )

    filters.append(
        "".join(mix_inputs)
        + f"amix=inputs={len(mix_inputs)}:duration=first:dropout_transition=0:normalize=0,"
        + "alimiter=limit=0.95[mix]"
    )
    command.extend(
        [
            "-filter_complex",
            ";".join(filters),
            "-map",
            "[mix]",
            "-t",
            f"{duration:.6f}",
            "-ar",
            "48000",
            "-ac",
            "1",
            "-c:a",
            "pcm_s16le",
            str(wav_path),
        ]
    )
    run(command)
    return qa_cues


def encode_m4a(ffmpeg: Path, wav_path: Path, destination: Path) -> None:
    run(
        [
            str(ffmpeg),
            "-y",
            "-hide_banner",
            "-loglevel",
            "warning",
            "-i",
            str(wav_path),
            "-map",
            "0:a:0",
            "-c:a",
            "aac",
            "-b:a",
            "48k",
            "-ar",
            "48000",
            "-ac",
            "1",
            "-movflags",
            "+faststart",
            str(destination),
        ]
    )


def make_review_mp4(
    ffmpeg: Path,
    video_path: Path,
    m4a_path: Path,
    destination: Path,
    language: str,
    duration: float,
) -> None:
    language_code = {"en": "eng", "es-419": "spa", "ko": "kor"}[language]
    run(
        [
            str(ffmpeg),
            "-y",
            "-hide_banner",
            "-loglevel",
            "warning",
            "-i",
            str(video_path),
            "-i",
            str(m4a_path),
            "-map",
            "0:v:0",
            "-map",
            "1:a:0",
            "-c:v",
            "copy",
            "-c:a",
            "copy",
            "-metadata:s:a:0",
            f"language={language_code}",
            "-t",
            f"{duration:.6f}",
            "-movflags",
            "+faststart",
            str(destination),
        ]
    )


def main() -> None:
    args = parse_args()
    asset_stem = str(args.asset_stem).strip()
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", asset_stem):
        raise ValueError("--asset-stem must be a lowercase hyphenated filename stem")
    args.tools_dir = args.tools_dir.resolve()
    sys.path.insert(0, str(args.tools_dir))

    script_path = args.script.resolve()
    script = json.loads(script_path.read_text(encoding="utf-8"))
    ffmpeg = find_ffmpeg(args.ffmpeg, args.tools_dir)
    work_dir = args.work_dir.resolve()
    artifacts_dir = args.artifacts_dir.resolve()
    public_dir = args.public_dir.resolve()
    work_dir.mkdir(parents=True, exist_ok=True)
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    public_dir.mkdir(parents=True, exist_ok=True)

    video_path = (ROOT / "public" / script["sourceVideo"].lstrip("/")).resolve()
    if not video_path.exists():
        raise FileNotFoundError(video_path)

    qa: dict = {
        "schemaVersion": 1,
        "sourceVideo": str(video_path.relative_to(ROOT)).replace("\\", "/"),
        "sourceVideoDuration": round(probe_duration(ffmpeg, video_path), 6),
        "targetDuration": script["durationSeconds"],
        "syncToleranceSeconds": SYNC_TOLERANCE_SECONDS,
        "maxPlaybackSpeed": MAX_PLAYBACK_SPEED,
        "tracks": {},
    }

    selected_languages = tuple(args.languages or NARRATION_LANGUAGES)
    for language in selected_languages:
        caption_cues = resolve_language_cues(script, language)
        audio_cues = resolve_language_cues(script, language, "timedAudioCues")
        cue_dir = work_dir / "cues" / language
        cue_dir.mkdir(parents=True, exist_ok=True)
        if not args.skip_tts:
            asyncio.run(generate_tts_cues(script, language, audio_cues, cue_dir))

        wav_path = artifacts_dir / f"{asset_stem}.{language}.master.wav"
        m4a_path = public_dir / f"{language}.m4a"
        vtt_path = public_dir / f"{language}.vtt"
        review_path = artifacts_dir / f"{asset_stem}.{language}.review.mp4"

        cue_qa = mix_language(
            ffmpeg, script, language, audio_cues, cue_dir, wav_path
        )
        encode_m4a(ffmpeg, wav_path, m4a_path)
        write_vtt(caption_cues, vtt_path)
        if not args.skip_review_video:
            make_review_mp4(
                ffmpeg,
                video_path,
                m4a_path,
                review_path,
                language,
                float(script["durationSeconds"]),
            )

        track_duration = probe_duration(ffmpeg, m4a_path)
        track_bytes = m4a_path.stat().st_size
        if track_bytes > 2_000_000:
            raise RuntimeError(f"{language} delivery track exceeds 2 MB: {track_bytes} bytes")
        if abs(track_duration - float(script["durationSeconds"])) > SYNC_TOLERANCE_SECONDS:
            raise RuntimeError(
                f"{language} duration differs from the source by more than "
                f"{SYNC_TOLERANCE_SECONDS:.3f}s: {track_duration:.3f}s"
            )

        qa["tracks"][language] = {
            "voice": script["languages"][language]["voice"],
            "delivery": {
                "path": str(m4a_path.relative_to(ROOT)).replace("\\", "/"),
                "bytes": track_bytes,
                "duration": round(track_duration, 6),
                "sha256": sha256(m4a_path),
                "format": "mono AAC in M4A, 48 kbps, 48 kHz",
            },
            "master": {
                "path": str(wav_path.relative_to(ROOT)).replace("\\", "/"),
                "bytes": wav_path.stat().st_size,
                "duration": round(probe_duration(ffmpeg, wav_path), 6),
                "format": "mono PCM WAV, 16-bit, 48 kHz",
            },
            "reviewVideo": None
            if args.skip_review_video
            else {
                "path": str(review_path.relative_to(ROOT)).replace("\\", "/"),
                "bytes": review_path.stat().st_size,
                "duration": round(probe_duration(ffmpeg, review_path), 6),
            },
            "cues": cue_qa,
        }
        print(
            f"[{language}] delivery={track_bytes / 1_000_000:.2f} MB, "
            f"duration={track_duration:.3f}s",
            flush=True,
        )

    qa_path = artifacts_dir / "qa-report.json"
    with qa_path.open("w", encoding="utf-8", newline="\n") as handle:
        handle.write(json.dumps(qa, ensure_ascii=False, indent=2) + "\n")

    manifest_path = public_dir / "manifest.json"
    previous_manifest = (
        json.loads(manifest_path.read_text(encoding="utf-8"))
        if manifest_path.exists()
        else {"tracks": {}}
    )
    manifest_tracks = dict(previous_manifest.get("tracks", {}))
    manifest_tracks.update(
        {
            language: {
                "src": f"{language}.m4a",
                "captions": f"{language}.vtt",
                "bytes": qa["tracks"][language]["delivery"]["bytes"],
                "sha256": qa["tracks"][language]["delivery"]["sha256"],
            }
            for language in selected_languages
        }
    )
    public_manifest = {
        "schemaVersion": 1,
        "durationSeconds": script["durationSeconds"],
        "script": "script.json",
        "tracks": manifest_tracks,
    }
    with manifest_path.open("w", encoding="utf-8", newline="\n") as handle:
        handle.write(json.dumps(public_manifest, ensure_ascii=False, indent=2) + "\n")
    print(f"QA report: {qa_path}", flush=True)


if __name__ == "__main__":
    main()
