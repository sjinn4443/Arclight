"""Build packaged English/Korean AAC and VTT using the existing narration pipeline.

Run after build-pupils-pec-scroll.cjs. Cue masters stay in ignored tmp/.
"""
import asyncio
import hashlib
import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / "tmp/fundal-narration-tools"))
spec = importlib.util.spec_from_file_location("fundal_narration", ROOT / "scripts/generate-fundal-narration.py")
pipeline = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pipeline)


async def main():
    folder = ROOT / "public/narration/pupils-pec/full-animation"
    script = json.loads((folder / "script.json").read_text(encoding="utf-8"))
    ffmpeg = pipeline.find_ffmpeg(None, ROOT / "tmp/fundal-narration-tools")
    tracks = {}
    for language, voice in script["languages"].items():
        cues = pipeline.resolve_language_cues(script, language, "timedAudioCues")
        work = ROOT / "tmp/pupils-pec/narration" / language
        work.mkdir(parents=True, exist_ok=True)
        await pipeline.generate_tts_cues(script, language, cues, work)
        master = work / "master.wav"
        qa = pipeline.mix_language(ffmpeg, script, language, cues, work, master)
        track = folder / f"{language}.m4a"
        pipeline.encode_m4a(ffmpeg, master, track)
        pipeline.write_vtt(cues, folder / f"{language}.vtt")
        duration = pipeline.probe_duration(ffmpeg, track)
        if abs(duration - script["durationSeconds"]) > 0.25:
            raise RuntimeError(f"{language}: narration duration mismatch")
        tracks[language] = {"src": track.name, "label": voice["label"], "voice": voice["voice"], "bytes": track.stat().st_size, "sha256": hashlib.sha256(track.read_bytes()).hexdigest(), "durationSeconds": duration}
        (work / "qa.json").write_text(json.dumps(qa, indent=2), encoding="utf-8")
    (folder / "manifest.json").write_text(json.dumps({"schemaVersion": 1, "durationSeconds": script["durationSeconds"], "tracks": tracks}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    asyncio.run(main())
