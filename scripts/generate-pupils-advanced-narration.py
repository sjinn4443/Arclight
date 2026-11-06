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
    if metadata.exists() and metadata.stat().st_size and signature_file.exists() and signature_file.read_text().strip() == signature:
        return
    # A failed network request must never truncate a reusable recording.
    pending_audio = work / f"{cue['id']}.pending.mp3"
    pending_metadata = work / f"{cue['id']}.pending.jsonl"
    await edge_tts.Communicate(text, voice, rate="-8%", boundary="WordBoundary").save(
        str(pending_audio), str(pending_metadata))
    pending_audio.replace(work / f"{cue['id']}.mp3")
    pending_metadata.replace(metadata)
    signature_file.write_text(signature + "\n", encoding="ascii")


def pace_afferent_narration(ffmpeg, script, language, work, owned_master, qa):
    """Keep the voice, slowing the anatomy list to the original visual clock."""
    pacing = script.get("afferentPacing")
    if language != "en" or not pacing:
        return
    cue = next(c for c in script["cues"] if c["id"] == "afferent-brain")
    stage_start = cue["start"] - 5.6
    # The cached utterance is never changed. Every build starts from that source.
    source = work / "afferent-brain.mp3"
    outputs = []
    filters = [f"[0:a]volume=0:enable='between(t,{cue['start']},{cue['end']})'[base]"]
    segments = pacing["segments"]
    filters.append(f"[1:a]asplit={len(segments)}" + "".join(f"[s{i}]" for i in range(len(segments))))
    for i, segment in enumerate(segments):
        delay = round((stage_start + segment["at"]) * 1000)
        filters.append(f"[s{i}]atrim=start={segment['from']}:end={segment['to']},asetpts=PTS-STARTPTS,"
                       f"atempo={pacing['speed']},aresample=48000,adelay={delay}:all=1[p{i}]")
        outputs.append(f"[p{i}]")
    filters.append("[base]" + "".join(outputs) + f"amix=inputs={len(outputs)+1}:duration=first:normalize=0[out]")
    paced = work / "owned-paced.wav"
    pipeline.run([str(ffmpeg), "-y", "-hide_banner", "-loglevel", "warning", "-i", str(owned_master),
                  "-i", str(source), "-filter_complex", ";".join(filters), "-map", "[out]",
                  "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", str(paced)])
    paced.replace(owned_master)
    ending = stage_start + max(s["at"] + (s["to"]-s["from"]) / pacing["speed"] for s in segments)
    info = next(c for c in qa if c["id"] == "afferent-brain")
    info.update(renderedEnd=round(ending, 3), endMargin=round(cue["end"]-ending, 3),
                anatomyPlaybackSpeed=pacing["speed"])


async def main():
    folder = ROOT / "public/narration/pupils-advanced/full-animation"
    script = json.loads((folder / "script.json").read_text(encoding="utf-8"))
    ffmpeg = pipeline.find_ffmpeg(None, ROOT / "tmp/fundal-narration-tools")
    manifest_file = folder / "manifest.json"
    tracks = json.loads(manifest_file.read_text(encoding="utf-8"))["tracks"] if manifest_file.exists() else {}
    selected_language = sys.argv[sys.argv.index("--language") + 1] if "--language" in sys.argv else None
    for language, voice in script["languages"].items():
        if selected_language and language != selected_language:
            continue
        cues = pipeline.resolve_language_cues(script, language, "timedAudioCues")
        overrides = [cue for cue in script["cues"] if language in cue.get("narrationOverrideLanguages", [])]
        shared_ids = {cue["id"] for cue in script["cues"] if cue.get("source") == "pupils-pec" and cue not in overrides}
        owned_cues = [cue for cue in cues if cue["id"] not in shared_ids]
        work = ROOT / "tmp/pupils-advanced/narration" / language
        work.mkdir(parents=True, exist_ok=True)
        for cue_id in ["reflex-output", "swing-rapd", "third-nerve", "near-abnormal"]:
            await record_word_boundaries(script, language, next(c for c in owned_cues if c["id"] == cue_id), work)
        await pipeline.generate_tts_cues(script, language, owned_cues, work)
        owned_master = work / "owned.wav"
        qa = pipeline.mix_language(ffmpeg, script, language, owned_cues, work, owned_master)
        pace_afferent_narration(ffmpeg, script, language, work, owned_master, qa)
        master = work / "master.wav"
        reuse = script["reusedAudio"]
        source = ROOT / "public/narration/pupils-pec/full-animation" / f"{language}.m4a"
        # Reuse PEC speech except for explicitly reviewed Advanced-only overrides.
        muted_slots = "+".join(f"between(t,{c['start']-reuse['targetStart']},{c['end']-reuse['targetStart']})" for c in overrides)
        # Per-sample muting prevents fragments of the old voice at slot edges.
        mute = f",aeval=exprs='if({muted_slots},0,val(0))'" if muted_slots else ""
        pipeline.run([str(ffmpeg), "-y", "-hide_banner", "-loglevel", "warning",
                      "-i", str(owned_master), "-ss", str(reuse["sourceStart"]),
                      "-t", str(reuse["sourceEnd"]-reuse["sourceStart"]), "-i", str(source),
                      "-filter_complex", f"[1:a]aresample=48000{mute},adelay={round(reuse['targetStart']*1000)}:all=1[pec];[0:a][pec]amix=inputs=2:duration=first:normalize=0[out]",
                      "-map", "[out]", "-c:a", "pcm_s16le", "-ar", "48000", "-ac", "1", str(master)])
        track = folder / f"{language}.m4a"
        pipeline.encode_m4a(ffmpeg, master, track)
        pipeline.write_vtt(cues, folder / f"{language}.vtt")
        duration = pipeline.probe_duration(ffmpeg, track)
        if abs(duration - script["durationSeconds"]) > 0.25:
            raise RuntimeError(f"{language}: narration duration mismatch")
        tracks[language] = {"src": track.name, "label": voice["label"], "voice": voice["voice"], "bytes": track.stat().st_size, "sha256": hashlib.sha256(track.read_bytes()).hexdigest(), "durationSeconds": duration, "reusedPecSha256":hashlib.sha256(source.read_bytes()).hexdigest()}
        tracks[language]["overriddenPecCueIds"] = [c["id"] for c in overrides]
        (work / "qa.json").write_text(json.dumps(qa, indent=2), encoding="utf-8")
    (folder / "manifest.json").write_text(json.dumps({"schemaVersion": 1, "durationSeconds": script["durationSeconds"], "tracks": tracks}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    # Only publish this lesson's captions; other narration jobs may run alongside it.
    subprocess.run(["node", "-e",
                    "const fs=require('fs');const path=require('path');const folder=process.argv[1];"
                    "require(process.argv[2]).writeCaptions(JSON.parse(fs.readFileSync(path.join(folder,'script.json'))),folder);",
                    str(folder), str(ROOT / "scripts/lib/pupils-caption-authoring.cjs")], check=True, cwd=ROOT)
    # Rebuild with measured word timing after the audio and its QA are saved.
    subprocess.run(["node", str(ROOT / "scripts/build-pupils-advanced-scroll.cjs")], check=True, cwd=ROOT)


if __name__ == "__main__":
    asyncio.run(main())
