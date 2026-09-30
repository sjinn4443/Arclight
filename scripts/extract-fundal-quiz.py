"""Extract the PEC quiz assets from the supplied PPTX (Pillow and ffmpeg required).

Usage: python scripts/extract-fundal-quiz.py "path/to/PEEC for App 230926.pptx"
The original presentation and full video are not copied into the application.
"""
import json
import pathlib
import subprocess
import sys
import tempfile
import zipfile

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/images/quiz/fundal-reflex"
# Coordinates in slide 98's image64.png after its 90-degree clockwise rotation.
BOXES = [(25, 56, 312, 149), (25, 171, 312, 264),
         (25, 287, 312, 380), (25, 402, 312, 495), (26, 515, 313, 606)]
# Visually matched to slide 100's embedded video, including its answer overlays.
CLIPS = [(163.10, 167.70), (136.10, 140.60), (200.10, 204.70),
         (189.60, 194.00), (206.10, 209.78)]


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as temp, zipfile.ZipFile(sys.argv[1]) as deck:
        video = pathlib.Path(temp) / "media8.mp4"
        video.write_bytes(deck.read("ppt/media/media8.mp4"))
        with deck.open("ppt/media/image64.png") as source:
            card = Image.open(source).convert("RGB").transpose(Image.Transpose.ROTATE_270)
        for index, (box, (start, end)) in enumerate(zip(BOXES, CLIPS), 1):
            card.crop(box).save(OUTPUT / f"case-{index}.webp", quality=95)
            subprocess.run([
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                "-ss", str(start), "-i", str(video), "-t", str(end - start),
                "-filter_complex",
                "fps=12,scale=640:-1:flags=lanczos,split[a][b];"
                "[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a",
                "-loop", "0", str(OUTPUT / f"case-{index}-explanation.gif"),
            ], check=True)
        (OUTPUT / "sources.json").write_text(json.dumps({
            "presentation": pathlib.Path(sys.argv[1]).name,
            "imageSlide": 98, "imagePart": "ppt/media/image64.png",
            "videoSlide": 100, "videoPart": "ppt/media/media8.mp4",
            "notes": "Original orientation preserved for each source. The video mirrors some card images. "
                     "Cases 3 and 5 both show asymmetry. Case 2 accepts both synonymous normal signs.",
            "cases": [{"id": i, "crop": box, "startSeconds": start, "endSeconds": end}
                      for i, (box, (start, end)) in enumerate(zip(BOXES, CLIPS), 1)]
        }, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
