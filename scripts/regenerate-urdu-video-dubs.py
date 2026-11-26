"""Regenerate Urdu catalogue dubs with the Pupils PEC voice and existing VTT."""

import argparse
import array
import asyncio
import hashlib
import json
import re
import shutil
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
CATALOGUES = ("app-video-subtitles", "childhood-eye-screening")
SAMPLE_RATE = 24000
PADDING = 0.12
# Existing shortened spoken cues retain the full wording in their subtitles.
SPOKEN_OVERRIDES = {
    ("ur-5b8665b7590f73abd1.m4a", 123.55): "دوبارہ ہاتھ صاف کریں۔ مزید آرک لائٹ ویڈیوز دیکھیں۔",
    ("ur-f615a222b340506d4c.m4a", 133.24): "سینٹ اینڈریوز کی مزید آرک لائٹ ویڈیوز دیکھیں۔",
}


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def catalogue_jobs(catalogues):
    jobs = {}
    for catalogue in catalogues.values():
        for entry in catalogue.values():
            variant = entry.get("audioVariants", {}).get("ur", {})
            if not variant.get("src", "").startswith("/video-subtitles/"):
                continue
            audio = variant["src"]
            caption = entry["subtitles"]["ur"]
            jobs.setdefault(audio, set()).add(caption)
    return {
        audio: min(
            captions,
            key=lambda path: (Path(path).parent != Path(audio).parent, path),
        )
        for audio, captions in jobs.items()
    }


def seconds(timestamp):
    value = 0
    for component in timestamp.split(":"):
        value = value * 60 + float(component)
    return value


def read_cues(path, duration):
    cues = []
    for block in re.split(r"\n[ \t]*\n", path.read_text(encoding="utf-8-sig")):
        lines = block.splitlines()
        for index, line in enumerate(lines[:2]):
            if " --> " not in line:
                continue
            first, last = line.split(" --> ", 1)
            start = seconds(first)
            end = min(duration, seconds(last.split()[0]))
            text = unescape(re.sub(r"<[^>]+>", "", " ".join(lines[index + 1:])))
            text = " ".join(text.split())
            if text and end - start >= PADDING:
                cues.append((start, end, text))
            break

    # Join adjacent caption fragments on the same clock, as in the original dubs.
    merged = []
    for start, end, text in sorted(cues):
        if merged and end - merged[-1][0] <= 12 and start - merged[-1][1] < 0.55:
            previous_start, previous_end, previous_text = merged[-1]
            separator = " " if previous_text[-1] in ".!?۔؟" else ", "
            merged[-1] = (previous_start, max(previous_end, end), previous_text + separator + text)
        else:
            merged.append((start, end, text))
    return merged


def run_ffmpeg(ffmpeg, *args, data=None):
    return subprocess.run(
        [str(ffmpeg), "-nostdin", "-hide_banner", "-loglevel", "error",
         "-threads", "1", "-filter_threads", "1", *map(str, args)],
        input=data, stdout=subprocess.PIPE, check=True,
    ).stdout


def duration_of(ffmpeg, path):
    result = subprocess.run(
        [str(ffmpeg), "-hide_banner", "-i", str(path)],
        capture_output=True, text=True, encoding="utf-8", errors="replace",
    )
    duration = re.search(r"Duration: (\d+:\d+:\d+\.\d+)", result.stderr)
    if duration is None:
        raise ValueError(f"Could not determine the audio duration for {path}")
    return seconds(duration[1])


def trim_padding(pcm):
    samples = array.array("h", pcm)
    # Inspect the decoded utterance in 10 ms windows. Keep quiet word endings.
    step = SAMPLE_RATE // 100
    active = [
        index for index in range(0, len(samples), step)
        if any(abs(sample) > 96 for sample in samples[index:index + step])
    ]
    if not active:
        raise ValueError("Synthesised cue contains no speech")
    first = max(0, active[0] - step * 4)
    last = active[-1] + step + round(PADDING * SAMPLE_RATE)
    return samples[first:last].tobytes()


async def synthesise(voice, texts, work, parallelism):
    import edge_tts
    from edge_tts.exceptions import NoAudioReceived

    speech = work / "speech"
    speech.mkdir(parents=True, exist_ok=True)
    paths = {
        text: speech / (hashlib.sha256(f"{voice}|-8%|{text}".encode()).hexdigest() + ".mp3")
        for text in texts
    }
    queue = asyncio.Queue()
    for text, path in paths.items():
        if not path.is_file() or not path.stat().st_size:
            queue.put_nowait((text, path))
    remaining = queue.qsize()
    failed = {}
    print(f"Synthesising {remaining} of {len(texts)} distinct cues with {voice}", flush=True)

    async def worker():
        nonlocal remaining
        while not queue.empty():
            text, target = queue.get_nowait()
            temporary = target.with_suffix(".part")
            spoken = text
            for attempt in range(4):
                try:
                    request = edge_tts.Communicate(spoken, voice, rate="-8%", receive_timeout=20)
                    await request.save(str(temporary))
                    if temporary.stat().st_size == 0:
                        raise ValueError("Speech service returned empty audio")
                    temporary.replace(target)
                    break
                except Exception as error:
                    if isinstance(error, NoAudioReceived):
                        # Punctuation variants let the service retry the same words.
                        spoken = text.rstrip(" .،,۔") + ("۔", ".", "؟", "")[attempt]
                    if attempt == 3:
                        failed[text] = str(error)
                    else:
                        await asyncio.sleep(2 ** attempt)
            remaining -= 1
            if remaining % 50 == 0:
                print(f"{remaining} synthesis cues remaining", flush=True)

    async with asyncio.TaskGroup() as workers:
        for _ in range(parallelism):
            workers.create_task(worker())
    if failed:
        log = work / "failed-cues.json"
        log.write_text(json.dumps(failed, ensure_ascii=False, indent=2), encoding="utf-8")
        raise RuntimeError(f"Speech synthesis failed for {len(failed)} cues. See {log}")
    return paths


def render(ffmpeg, cues, duration, paths, destination):
    pcm_format = ("-f", "s16le", "-ar", SAMPLE_RATE, "-ac", 1)
    audio = array.array("h", [0]) * round(duration * SAMPLE_RATE)
    peak_speed = 1.0
    for index, (start, end, text) in enumerate(cues):
        next_start = cues[index + 1][0] if index + 1 < len(cues) else duration
        offset = round(start * SAMPLE_RATE)
        capacity = round(min(end, next_start) * SAMPLE_RATE) - offset
        if capacity <= 0:
            raise ValueError(f"Overlapping cue at {start:.2f}s in {destination}")
        raw = trim_padding(run_ffmpeg(ffmpeg, "-i", paths[text], *pcm_format, "pipe:1"))
        speed = len(raw) / (2 * capacity)
        peak_speed = max(speed, peak_speed)
        if speed > 1:
            tempo = (speed * 1.04) ** 0.5
            raw = run_ffmpeg(
                ffmpeg, *pcm_format, "-i", "pipe:0",
                "-af", f"atempo={tempo:.8f},atempo={tempo:.8f}",
                *pcm_format, "pipe:1", data=raw,
            )
        samples = array.array("h", raw)
        if len(samples) > capacity and any(abs(sample) > 96 for sample in samples[capacity:]):
            raise ValueError(f"Cue would cut off at {start:.2f}s in {destination}")
        samples = samples[:capacity]
        audio[offset:offset + len(samples)] = samples

    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix(".part.m4a")
    run_ffmpeg(
        ffmpeg, "-y", *pcm_format, "-i", "pipe:0", "-c:a", "aac",
        "-ar", 16000, "-b:a", "12k", "-movflags", "+faststart", temporary, data=audio.tobytes(),
    )
    if abs(duration_of(ffmpeg, temporary) - duration) > 0.05:
        raise ValueError(f"Duration mismatch for {destination}")
    run_ffmpeg(ffmpeg, "-xerror", "-i", temporary, "-f", "null", "-")
    temporary.replace(destination)
    return round(peak_speed, 3)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--tools-dir", type=Path, default=ROOT / "tmp/fundal-narration-tools")
    parser.add_argument("--work-dir", type=Path, default=ROOT / "tmp/urdu-video-dubs-neural")
    parser.add_argument("--ffmpeg", type=Path, required=True)
    parser.add_argument("--concurrency", type=int, default=12)
    parser.add_argument(
        "--publish", action="store_true",
        help="Install the previously staged audio and update the source catalogues",
    )
    args = parser.parse_args()
    sys.path.insert(0, str(args.tools_dir))

    voice = read_json(PUBLIC / "narration/pupils-pec/full-animation/script.json")["languages"]["ur"]["voice"]
    files = {name: PUBLIC / "video-localization" / f"{name}.json" for name in CATALOGUES}
    catalogues = {name: read_json(path) for name, path in files.items()}
    jobs = catalogue_jobs(catalogues)
    staged = args.work_dir / "delivery"
    report_path = args.work_dir / "qa-report.json"
    if args.publish:
        report = read_json(report_path)
        if report["voice"] != voice or {
            audio: track["caption"] for audio, track in report["tracks"].items()
        } != jobs:
            raise ValueError("Staged narration does not match the current catalogue")
        for audio in jobs:
            relative = audio.lstrip("/")
            source = staged / relative
            track = report["tracks"][audio]
            if hashlib.sha256(source.read_bytes()).hexdigest() != track["sha256"]:
                raise ValueError(f"Staged narration changed for {relative}")
        for audio in jobs:
            relative = audio.lstrip("/")
            target = PUBLIC / relative
            temporary = target.with_suffix(".part.m4a")
            shutil.copyfile(staged / relative, temporary)
            temporary.replace(target)
        for name, catalogue in catalogues.items():
            for entry in catalogue.values():
                variant = entry.get("audioVariants", {}).get("ur", {})
                if variant.get("src") in jobs:
                    variant["voice"] = voice
                    variant.pop("modelLicense", None)
            files[name].write_text(
                json.dumps(catalogue, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8", newline="\n",
            )
        print(f"Published {len(jobs)} verified Urdu dubs with {voice}", flush=True)
        return

    def prepare(item):
        audio, caption = item
        duration = duration_of(args.ffmpeg, PUBLIC / audio.lstrip("/"))
        cues = read_cues(PUBLIC / caption.lstrip("/"), duration)
        if not cues:
            raise ValueError(f"No narration cues in {caption}")
        cues = [
            (start, end, SPOKEN_OVERRIDES.get((Path(audio).name, round(start, 2)), text))
            for start, end, text in cues
        ]
        return audio, (duration, cues)

    with ThreadPoolExecutor(max_workers=4) as threads:
        plan = dict(threads.map(prepare, jobs.items()))
    texts = {text for _, cues in plan.values() for _, _, text in cues}
    paths = asyncio.run(synthesise(voice, sorted(texts), args.work_dir, args.concurrency))

    def render_track(item):
        audio, (duration, cues) = item
        output = staged / audio.lstrip("/")
        speed = render(args.ffmpeg, cues, duration, paths, output)
        print(f"Rendered {Path(audio).name}, peak speed {speed:.2f}x", flush=True)
        return audio, {
            "caption": jobs[audio],
            "seconds": duration,
            "cues": len(cues),
            "peakSpeed": speed,
            "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
        }

    with ThreadPoolExecutor(max_workers=4) as threads:
        report = dict(threads.map(render_track, plan.items()))
    report_path.write_text(
        json.dumps({"voice": voice, "tracks": report}, indent=2) + "\n", encoding="utf-8",
    )


if __name__ == "__main__":
    main()
