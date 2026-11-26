"""Trim trailing TTS silence while keeping the original synthesis cache."""
import argparse
import re
import subprocess
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ffmpeg", required=True)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    for language in ("en", "ko"):
        for index in range(1, 9):
            relative_path = Path("cues", language, f"apply-{index}.mp3")
            source = args.source / relative_path
            destination = args.output / relative_path
            destination.parent.mkdir(parents=True, exist_ok=True)

            # Reverse detection measures only silence at the end of the cue.
            # Keep 120 ms after the detected speech and preserve internal pauses.
            result = subprocess.run(
                [args.ffmpeg, "-hide_banner", "-i", str(source), "-af",
                 "areverse,silencedetect=noise=-50dB:d=0.12", "-f", "null", "-"],
                capture_output=True, text=True, check=True,
            )
            silence = re.search(
                r"silence_start: 0\s*\n[^\n]*silence_end: ([\d.]+)", result.stderr
            )
            trim_filter = []
            if silence:
                trim_start = float(silence[1]) - 0.12
                trim_filter = ["-af", f"areverse,atrim=start={trim_start:.6f},areverse"]

            # The shared mixer probes the contents of these cue files.
            subprocess.run(
                [args.ffmpeg, "-v", "error", "-y", "-i", str(source),
                 *trim_filter, "-c:a", "pcm_s16le", "-f", "wav", str(destination)],
                check=True,
            )


if __name__ == "__main__":
    main()
