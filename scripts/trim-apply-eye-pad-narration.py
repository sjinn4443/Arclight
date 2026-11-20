"""Remove TTS leading/trailing silence before the Apply lesson mixer."""
import array
import subprocess
import wave
from pathlib import Path

root = Path(__file__).resolve().parent.parent
ffmpeg = root / "tmp/fundal-narration-tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe"
for language in ("en", "ko"):
    for index in range(1, 9):
        file = root / f"tmp/apply-eye-pad-narration/cues/{language}/apply-{index}.wav"
        with wave.open(str(file)) as audio:
            params = audio.getparams()
            samples = array.array("h", audio.readframes(audio.getnframes()))
        step = max(1, int(params.framerate * params.nchannels * .01))
        active = [i for i in range(0, len(samples), step) if max(map(abs, samples[i:i+step]), default=0) > 250]
        if not active:
            raise ValueError(f"No speech in {file}")
        trimmed = samples[max(0, active[0]-4*step):min(len(samples), active[-1]+9*step)]
        with wave.open(str(file), "wb") as audio:
            audio.setparams(params)
            audio.writeframes(trimmed.tobytes())
        subprocess.run([str(ffmpeg), "-v", "error", "-y", "-i", str(file), str(file.with_suffix(".mp3"))], check=True)
