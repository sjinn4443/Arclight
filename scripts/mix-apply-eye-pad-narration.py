"""Mix the PEC scroll lesson's four dubs onto its existing cue timeline."""
import argparse
import array
import hashlib
import json
import re
import runpy
import subprocess
import tempfile
from pathlib import Path


shared = runpy.run_path(str(Path(__file__).with_name("generate-fundal-narration.py")))
root = shared["ROOT"]
delivery = root / "public/narration/apply-eye-pad-shield/full-animation"
rate = 24000


def ffmpeg(*args, pcm=None):
    return subprocess.run([str(binary), "-v", "error", "-y", *map(str, args)],
                          input=pcm, stdout=subprocess.PIPE, check=True).stdout


def seconds(timestamp):
    hours, minutes, value = timestamp.split(":")
    return int(hours) * 3600 + int(minutes) * 60 + float(value)


def chichewa_segments(track, cues):
    captions = track.with_suffix(".vtt").read_text(encoding="utf-8-sig")
    entries = re.findall(r"([\d:.]+) --> ([\d:.]+)\n([^\n]+)", captions)
    by_text = {line.strip(): (seconds(start), seconds(end)) for start, end, line in entries}
    # Reuse the original dub wherever the script still matches it verbatim.
    changed = [dict(cue, ttsText=cue["ny"]) for cue in cues if cue["ny"] not in by_text]
    cue_dir = args.neural_cues / "ny"
    if changed:
        model = (args.dub_models / "speech-ny").resolve(strict=True)
        cue_dir.mkdir(parents=True, exist_ok=True)
        shared["generate_mms_cues"](
            {"languages": {"ny": {"voice": str(model), "trimEdgeSilenceDb": -42}}},
            "ny", changed, cue_dir,
        )
    for cue in cues:
        if cue["ny"] in by_text:
            start, end = by_text[cue["ny"]]
            yield ["-ss", start, "-t", end - start, "-i", track]
        else:
            yield ["-i", cue_dir / (cue["id"] + ".mp3")]


def trim_silence(pcm):
    samples = array.array("h")
    samples.frombytes(pcm)
    # Keep 75 ms of room tone on either edge and all pauses inside the sentence.
    voiced = [i for i in range(0, len(samples), 240)
              if max(map(abs, samples[i:i + 240]), default=0) > 120]
    if not voiced:
        raise ValueError("Empty speech cue")
    return samples[max(0, voiced[0] - 1800):voiced[-1] + 2040].tobytes()


def mix(segments, cues, target):
    out = bytearray(round(cues[-1]["end"] * rate) * 2)
    fmt = ["-f", "s16le", "-ar", rate, "-ac", 1]
    for source, cue in zip(segments, cues, strict=True):
        speech = trim_silence(ffmpeg(*source, *fmt, "pipe:1"))
        start = round(cue["start"] * rate) * 2
        available = round(cue["end"] * rate) * 2 - start
        if len(speech) > available:
            if cue["id"] == "apply-5":
                raise ValueError("Extend the patient instruction slot to preserve its normal speaking speed")
            speed = len(speech) / (available - int(rate * .10) * 2)
            if speed > 1.3:
                raise ValueError(f"{cue['id']} needs shorter speech ({speed:.2f}x)")
            speech = ffmpeg(*fmt, "-i", "pipe:0", "-af", f"atempo={speed}", *fmt, "pipe:1", pcm=speech)
        if len(speech) > available:
            raise ValueError(f"{cue['id']} exceeds its slot")
        out[start:start + len(speech)] = speech
    ffmpeg(*fmt, "-i", "pipe:0", "-c:a", "aac", "-b:a", "64k", "-movflags", "+faststart", target, pcm=out)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ("neural-cues", "chichewa"):
        parser.add_argument("--" + name, required=True, type=Path)
    parser.add_argument("--dub-models", type=Path, default=root / "tmp/media-locales")
    parser.add_argument("--languages", nargs="+", choices=("en", "ko", "ur", "ny"))
    parser.add_argument("--delivery", type=Path, default=delivery)
    args = parser.parse_args()
    binary = shared["find_ffmpeg"](None, shared["DEFAULT_TOOLS"])
    delivery = args.delivery
    script = json.loads((delivery / "script.json").read_text(encoding="utf-8"))
    cues = script["cues"]
    manifest = {"schemaVersion": 1, "durationSeconds": script["durationSeconds"], "script": "script.json", "tracks": {}}
    manifest_path = delivery / "manifest.json"
    if args.languages and manifest_path.exists():
        manifest["tracks"] = json.loads(manifest_path.read_text(encoding="utf-8"))["tracks"]
    scratch = root / "tmp/apply-eye-pad-narration"
    scratch.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=scratch) as temp:
        work = Path(temp)
        for lang in args.languages or script["languages"]:
            voice = script["languages"][lang]
            audio = work / f"{lang}.m4a"
            if lang in ("en", "ko", "ur"):
                mix((["-i", args.neural_cues / lang / (cue["id"] + ".mp3")] for cue in cues), cues, audio)
            else:
                mix(chichewa_segments(args.chichewa, cues), cues, audio)
            vtt = work / f"{lang}.vtt"
            shared["write_vtt"](script["timedCues"][lang], vtt)
            manifest["tracks"][lang] = {
                "src": audio.name, "captions": vtt.name, "voice": voice["voice"],
                "bytes": audio.stat().st_size, "sha256": hashlib.sha256(audio.read_bytes()).hexdigest(),
                **({"modelLicense": "CC-BY-NC-4.0"} if lang == "ny" else {}),
            }
        for file in work.iterdir():
            file.replace(delivery / file.name)
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
