"""Convert the supplied Ears archive into local, source-faithful learning assets.

Run with the bundled Python (Pillow and pypdfium2), --source <extracted folder>,
--output public, and optionally --ffmpeg <binary>. Source documents are data.
"""
import argparse
import base64
import hashlib
import io
import json
from pathlib import Path
import re
import shutil
import subprocess
import textwrap
import xml.etree.ElementTree as ET
import zipfile

import pypdfium2 as pdfium
from PIL import Image


PDF_IDS = {
    "1. Ear Health and Deafness 2024.pdf": "ear-health",
    "3. Otoscope Handout 2026.pdf": "otoscope-handout",
    "4.Otoscopy ENT Poster.pdf": "otoscopy-poster",
    "5. External Ears Teaching Poster 2024.pdf": "external-ear-poster",
    "1. WHO PRIMARY EAR AND HEARING CARE TRAINER’S HANDBOOK.pdf": "who-trainer",
    "2. WHO Training Manual.pdf": "who-manual",
    "3. WHO-ENT Manual Resources.pdf": "who-resources",
    "4. WHO-ENT Manual ANNEX.pdf": "who-annex",
    "A.factsheet-health-professional-ear-care.pdf": "health-workers",
    "B-hearing-loss-adults-flyer.pdf": "hearing-adults",
    "C-hearing-loss-in-children-flyer.pdf": "hearing-children",
    "D.Unsafe noise-flyer.pdf": "safe-listening",
    "E.-tips-for-healthy-ears-flyer.pdf": "healthy-ears",
    "F.-tips-for-hearing-aid-users-flyer.pdf": "hearing-aids",
    "G.-care-of-discharging-ears.pdf": "discharging-ears",
    "WHO Assembly on ENT Care.pdf": "who-resolution",
    "1. Madagascar Arclight 2026 - FRONT.pdf": "field-handout-front",
    "2. Madagascar handout 2026 - BACK.pdf": "field-handout-back",
}
NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}


def export_image(raw, destination):
    with Image.open(io.BytesIO(raw)) as im:
        im.thumbnail((2400, 2400))
        im.save(destination, "WEBP", quality=92, method=5)


def export_landmark_slides(archive, prefix, root):
    """Preserve the source picture, label positions and connector endpoints."""
    presentation = ET.fromstring(archive.read("ppt/presentation.xml"))
    size = presentation.find("p:sldSz", NS)
    width, height = int(size.get("cx")), int(size.get("cy"))
    factor = 1200 / width
    files = []
    slides = sorted(
        (n for n in archive.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)),
        key=lambda n: int(re.search(r"(\d+)\.xml", n).group(1)),
    )
    for number, name in enumerate(slides, 1):
        slide = ET.fromstring(archive.read(name))
        if not slide.findall(".//p:pic", NS):
            continue
        rels = ET.fromstring(archive.read(name.replace("slides/", "slides/_rels/") + ".rels"))
        targets = {r.get("Id"): r.get("Target") for r in rels}
        svg = ET.Element("svg", xmlns="http://www.w3.org/2000/svg", viewBox=f"0 0 1200 {height * factor}")
        ET.SubElement(svg, "rect", width="100%", height="100%", fill="white")
        defs = ET.SubElement(svg, "defs")
        marker = ET.SubElement(defs, "marker", id="arrow", viewBox="0 0 10 10", refX="9", refY="5", markerWidth="7", markerHeight="7", orient="auto-start-reverse")
        ET.SubElement(marker, "path", d="M0 0L10 5L0 10Z", fill="black")
        for picture in slide.findall(".//p:pic", NS):
            xfrm = picture.find("p:spPr/a:xfrm", NS)
            blip = picture.find(".//a:blip", NS)
            if xfrm is None or blip is None:
                continue
            off, ext = xfrm.find("a:off", NS), xfrm.find("a:ext", NS)
            target = targets[blip.get("{" + NS["r"] + "}embed")].replace("../", "ppt/")
            buffer = io.BytesIO()
            with Image.open(io.BytesIO(archive.read(target))) as image:
                image.save(buffer, "WEBP", quality=94)
            ET.SubElement(svg, "image", x=str(int(off.get("x")) * factor), y=str(int(off.get("y")) * factor), width=str(int(ext.get("cx")) * factor), height=str(int(ext.get("cy")) * factor), href="data:image/webp;base64," + base64.b64encode(buffer.getvalue()).decode())
        for connector in slide.findall(".//p:cxnSp", NS):
            xfrm = connector.find("p:spPr/a:xfrm", NS)
            if xfrm is None:
                continue
            off, ext = xfrm.find("a:off", NS), xfrm.find("a:ext", NS)
            x, y, w, h = [int(v) * factor for v in [off.get("x"), off.get("y"), ext.get("cx"), ext.get("cy")]]
            attrs = dict(x1=str(x + w if xfrm.get("flipH") == "1" else x), x2=str(x if xfrm.get("flipH") == "1" else x + w), y1=str(y + h if xfrm.get("flipV") == "1" else y), y2=str(y if xfrm.get("flipV") == "1" else y + h), stroke="black")
            attrs["stroke-width"] = "3"
            for end, attr in [("headEnd", "marker-start"), ("tailEnd", "marker-end")]:
                arrow = connector.find("p:spPr/a:ln/a:" + end, NS)
                if arrow is not None and arrow.get("type", "none") != "none":
                    attrs[attr] = "url(#arrow)"
            ET.SubElement(svg, "line", attrs)
        for shape in slide.findall(".//p:sp", NS):
            xfrm = shape.find("p:spPr/a:xfrm", NS)
            paragraphs = shape.findall("p:txBody/a:p", NS)
            if xfrm is None or not paragraphs:
                continue
            off, ext = xfrm.find("a:off", NS), xfrm.find("a:ext", NS)
            rows = []
            for p in paragraphs:
                rows.extend("".join(t.text or "" for t in run.findall("a:t", NS)) for run in p.findall("a:r", NS))
            text = " ".join(rows).strip()
            if not text:
                continue
            run_style = shape.find(".//a:rPr", NS)
            font = float(run_style.get("sz", "2200")) / 100 * 12700 * factor if run_style is not None else 28
            font = min(font, 42)
            lines = []
            for paragraph in paragraphs:
                content = "".join((el.text or "") if el.tag.endswith("}t") else "\n" if el.tag.endswith("}br") else "" for el in paragraph.iter())
                columns = max(6, int(int(ext.get("cx")) * factor / (font * .54)))
                for line in content.splitlines():
                    lines.extend(textwrap.wrap(line, width=columns, break_long_words=False))
            x = (int(off.get("x")) + int(ext.get("cx")) / 2) * factor
            y = int(off.get("y")) * factor + font
            node = ET.SubElement(svg, "text", x=str(x), y=str(y), fill="black", **{"font-family": "Arial, sans-serif", "font-size": str(font), "font-weight": "700", "text-anchor": "middle"})
            for i, line in enumerate(lines):
                ET.SubElement(node, "tspan", x=str(x), dy="0" if i == 0 else str(font * 1.1)).text = line
        destination = root / "images/learning/Ears/diagrams" / f"{prefix}-{number}.svg"
        destination.parent.mkdir(parents=True, exist_ok=True)
        ET.ElementTree(svg).write(destination, encoding="utf-8", xml_declaration=True)
        files.append("/" + destination.relative_to(root).as_posix())
    return files


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--output", type=Path, default=Path("public"))
    parser.add_argument("--ffmpeg", type=Path)
    args = parser.parse_args()
    root = args.output.resolve()
    documents = root / "documents/ears"
    documents.mkdir(parents=True, exist_ok=True)
    manifest = {"documents": {}, "decks": {}, "videos": {}, "sources": []}
    seen = {}
    for source in sorted(args.source.rglob("*")):
        if not source.is_file():
            continue
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        record = {"file": source.name, "sha256": digest}
        if digest in seen:
            record["duplicateOf"] = seen[digest]
            manifest["sources"].append(record)
            continue
        seen[digest] = source.name
        if source.name in PDF_IDS:
            key = PDF_IDS[source.name]
            shutil.copyfile(source, documents / f"{key}.pdf")
            pdf = pdfium.PdfDocument(str(source))
            directory = root / "images/learning/Ears/documents" / key
            directory.mkdir(parents=True, exist_ok=True)
            pages = []
            for i, page in enumerate(pdf):
                width = 2400 if len(pdf) < 3 else 1440
                bitmap = page.render(scale=width / page.get_width())
                image = bitmap.to_pil()
                filename = f"page-{i + 1:03}.webp"
                image.save(directory / filename, "WEBP", quality=88, method=4)
                pages.append("/" + (directory / filename).relative_to(root).as_posix())
                image.close()
                bitmap.close()
                page.close()
            pdf.close()
            manifest["documents"][key] = {"pdf": f"/documents/ears/{key}.pdf", "pages": pages, "source": source.name}
            print(f"PDF {key}: {len(pages)} pages", flush=True)
        elif source.suffix.lower() in [".pptx", ".docx"]:
            key = "ears" if source.name == "Ears Only.pptx" else "website" if source.suffix == ".docx" else "tm-simple" if "Simplified" in source.name else "tm-detailed"
            directory = root / "images/learning/Ears" / key
            directory.mkdir(parents=True, exist_ok=True)
            with zipfile.ZipFile(source) as archive:
                for name in archive.namelist():
                    if "/media/" in name and Path(name).suffix.lower() in [".png", ".jpg", ".jpeg"]:
                        export_image(archive.read(name), directory / (Path(name).stem + ".webp"))
                if key.startswith("tm-"):
                    manifest["decks"][key] = export_landmark_slides(archive, key, root)
            if source.suffix == ".pptx":
                shutil.copyfile(source, documents / f"{key}.pptx")
            else:
                shutil.copyfile(source, documents / "website-ent.docx")
            print(f"Artwork {key}", flush=True)
        elif source.suffix.lower() == ".mp4" and args.ffmpeg:
            key = "otoscopy-arclight" if "2026 App" in source.name else "otoscopy-signs" if "Short" in source.name else "otoscopy-osce"
            directory = root / "videos/Ears"
            directory.mkdir(parents=True, exist_ok=True)
            manifest["videos"][key] = {}
            for tier, height in [("low", 220), ("high", 720 if key == "otoscopy-arclight" else 540)]:
                destination = directory / f"{key}_{height}p.mp4"
                if not destination.exists():
                    subprocess.run([str(args.ffmpeg), "-hide_banner", "-loglevel", "error", "-i", str(source), "-map", "0:v:0", "-map", "0:a:0?", "-vf", f"scale=-2:{height}", "-c:v", "libx264", "-preset", "fast", "-crf", "24", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "80k", "-movflags", "+faststart", str(destination)], check=True)
                manifest["videos"][key][tier] = "/" + destination.relative_to(root).as_posix()
                print(f"Video {key} {tier}: {destination.stat().st_size} bytes", flush=True)
        manifest["sources"].append(record)
    (root / "data").mkdir(exist_ok=True)
    (root / "data/ears-assets.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Ears asset manifest written", flush=True)


if __name__ == "__main__":
    main()
