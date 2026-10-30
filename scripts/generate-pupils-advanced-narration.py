"""Record Advanced English/Korean tracks with the existing bounded-speed pipeline."""
import asyncio
import hashlib
import importlib.util
import json
import sys
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / "tmp/fundal-narration-tools"))
spec = importlib.util.spec_from_file_location("fundal_narration", ROOT / "scripts/generate-fundal-narration.py")
pipeline = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pipeline)


async def record_word_boundaries(script, language, cue, work):
    """Keep word timing for the pupil response described by the narration."""
    import edge_tts
    text, voice = cue["ttsText"], script["languages"][language]["voice"]
    signature = hashlib.sha256(json.dumps({"pitch": "+0Hz", "rate": "-8%", "text": text,
        "voice": voice, "volume": "+0%"}, ensure_ascii=False, sort_keys=True).encode("utf-8")).hexdigest()
    signature_file = work / f"{cue['id']}.sha256"
    metadata = work / f"{cue['id']}.boundaries.jsonl"
    if metadata.exists() and signature_file.exists() and signature_file.read_text().strip() == signature:
        return
    await edge_tts.Communicate(text, voice, rate="-8%", boundary="WordBoundary").save(
        str(work / f"{cue['id']}.mp3"), str(metadata))
    signature_file.write_text(signature + "\n", encoding="ascii")


async def main():
    folder = ROOT / "public/narration/pupils-advanced/full-animation"
    script = json.loads((folder / "script.json").read_text(encoding="utf-8"))
    ffmpeg = pipeline.find_ffmpeg(None, ROOT / "tmp/fundal-narration-tools")
    tracks = {}
    for language, voice in script["languages"].items():
        cues = pipeline.resolve_language_cues(script, language, "timedAudioCues")
        shared_ids = {cue["id"] for cue in script["cues"] if cue.get("source") == "pupils-pec"}
        owned_cues = [cue for cue in cues if cue["id"] not in shared_ids]
        work = ROOT / "tmp/pupils-advanced/narration" / language
        work.mkdir(parents=True, exist_ok=True)
        for cue_id in ["reflex-output", "swing-rapd"]:
            await record_word_boundaries(script, language, next(c for c in owned_cues if c["id"] == cue_id), work)
        await pipeline.generate_tts_cues(script, language, owned_cues, work)
        owned_master = work / "owned.wav"
        qa = pipeline.mix_language(ffmpeg, script, language, owned_cues, work, owned_master)
        master = work / "master.wav"
        reuse = script["reusedAudio"]
        source = ROOT / "public/narration/pupils-pec/full-animation" / f"{language}.m4a"
        # Decode the shipped PEC track once; preserve its exact 101-second block,
        # including every inter-cue pause. Do not synthesize replacement speech.
        pipeline.run([str(ffmpeg), "-y", "-hide_banner", "-loglevel", "warning",
                      "-i", str(owned_master), "-ss", str(reuse["sourceStart"]),
                      "-t", str(reuse["sourceEnd"]-reuse["sourceStart"]), "-i", str(source),
                      "-filter_complex", f"[1:a]aresample=48000,adelay={round(reuse['targetStart']*1000)}:all=1[pec];[0:a][pec]amix=inputs=2:duration=first:normalize=0[out]",
                      "-map", "[out]", "-c:a", "pcm_s16le", "-ar", "48000", "-ac", "1", str(master)])
        track = folder / f"{language}.m4a"
        pipeline.encode_m4a(ffmpeg, master, track)
        pipeline.write_vtt(cues, folder / f"{language}.vtt")
        duration = pipeline.probe_duration(ffmpeg, track)
        if abs(duration - script["durationSeconds"]) > 0.25:
            raise RuntimeError(f"{language}: narration duration mismatch")
        tracks[language] = {"src": track.name, "label": voice["label"], "voice": voice["voice"], "bytes": track.stat().st_size, "sha256": hashlib.sha256(track.read_bytes()).hexdigest(), "durationSeconds": duration, "reusedPecSha256":hashlib.sha256(source.read_bytes()).hexdigest()}
        (work / "qa.json").write_text(json.dumps(qa, indent=2), encoding="utf-8")
    (folder / "manifest.json").write_text(json.dumps({"schemaVersion": 1, "durationSeconds": script["durationSeconds"], "tracks": tracks}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    subprocess.run(["node", str(ROOT / "scripts/lib/pupils-caption-authoring.cjs")], check=True, cwd=ROOT)
    # Rebuild with measured word timing after the audio and its QA are saved.
    subprocess.run(["node", str(ROOT / "scripts/build-pupils-advanced-scroll.cjs")], check=True, cwd=ROOT)


if __name__ == "__main__":
    asyncio.run(main())
