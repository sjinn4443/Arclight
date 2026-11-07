"""Generate packaged English/Korean AAC with the established bounded-speed TTS.

Uses cached per-cue source utterances on rebuild. CATARACT_WORK_DIR can put
large authoring intermediates on a different drive from the app workspace.
"""
import asyncio
import hashlib
import importlib.util
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / "tmp/fundal-narration-tools"))
spec = importlib.util.spec_from_file_location("fundal_narration", ROOT / "scripts/generate-fundal-narration.py")
pipeline = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pipeline)


async def main():
    folder = ROOT / "public/narration/cataract/full-animation"
    script = json.loads((folder / "script.json").read_text(encoding="utf-8"))
    ffmpeg = pipeline.find_ffmpeg(None, ROOT / "tmp/fundal-narration-tools")
    work_root = Path(os.environ.get("CATARACT_WORK_DIR", ROOT / "tmp/cataract"))
    tracks = {}
    selected_ids = {s for s in os.environ.get("CATARACT_CUE_IDS", "").split(",") if s}
    for language, voice in script["languages"].items():
        cues = pipeline.resolve_language_cues(script, language, "timedAudioCues")
        if selected_ids:
            cues = [cue for cue in cues if cue["id"] in selected_ids]
            if {c["id"] for c in cues} != selected_ids:
                raise ValueError("Unknown requested cue IDs")
        work = work_root / "narration" / language
        work.mkdir(parents=True, exist_ok=True)
        await pipeline.generate_tts_cues(script, language, cues, work)
        master = work / "master.wav"
        qa = pipeline.mix_language(ffmpeg, script, language, cues, work, master)
        track = folder / f"{language}.m4a"
        if selected_ids:
            # Preserve the delivered recording outside the requested cue slots.
            # Always rebuild from the same retained source, never a prior mix.
            revision = hashlib.sha256(json.dumps(cues, sort_keys=True, ensure_ascii=False).encode("utf-8")).hexdigest()[:12]
            original = work / f"delivered-before-{revision}.m4a"
            if not original.exists():
                import shutil
                shutil.copyfile(track, original)
            muted = "+".join(f"between(t,{c['start']},{c['end']})" for c in cues)
            revised = work / "revised.wav"
            pipeline.run([str(ffmpeg), "-y", "-hide_banner", "-loglevel", "warning",
                "-i", str(original), "-i", str(master), "-filter_complex",
                f"[0:a]volume=0:enable='{muted}'[base];[base][1:a]amix=inputs=2:duration=first:normalize=0[out]",
                "-map", "[out]", "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", str(revised)])
            pipeline.encode_m4a(ffmpeg, revised, track)
        else:
            pipeline.encode_m4a(ffmpeg, master, track)
        all_cues = pipeline.resolve_language_cues(script, language, "timedAudioCues")
        pipeline.write_vtt(all_cues, folder / f"{language}.vtt")
        duration = pipeline.probe_duration(ffmpeg, track)
        if abs(duration - script["durationSeconds"]) > 0.25:
            raise RuntimeError(f"{language}: duration mismatch")
        tracks[language] = {"src":track.name,"label":voice["label"],"voice":voice["voice"],"bytes":track.stat().st_size,"sha256":hashlib.sha256(track.read_bytes()).hexdigest(),"durationSeconds":duration}
        (work / "qa.json").write_text(json.dumps(qa,indent=2),encoding="utf-8")
    (folder / "manifest.json").write_text(json.dumps({"schemaVersion":1,"durationSeconds":script["durationSeconds"],"tracks":tracks},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")


if __name__ == "__main__":
    asyncio.run(main())
