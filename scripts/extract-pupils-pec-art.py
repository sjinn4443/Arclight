"""Separate the supplied PDF's original vector artwork into animation layers.

Requires PyMuPDF 2.0 (the local authoring install may live in tmp/pupils-pec/pdf-tools).
No AI-generated or replacement illustration is used. SVGs are authoring intermediates.
"""
import copy
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tmp/pupils-pec/pdf-tools"))
import pymupdf

NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", NS)
ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")
SOURCE = ROOT / "public/pdfbasedanims/Pupils PEC_110826.pdf"
OUT = ROOT / "tmp/pupils-pec/layers"
OUT.mkdir(parents=True, exist_ok=True)
page = pymupdf.open(SOURCE)[0]
source = ET.fromstring(page.get_svg_image())


def paint_nodes(root):
    result = []
    def walk(element, in_defs=False):
        in_defs = in_defs or element.tag == f"{{{NS}}}defs"
        if not in_defs and element.tag.split("}")[-1] in {"path", "use", "image"}:
            result.append(element)
        for child in element:
            walk(child, in_defs)
    walk(root)
    return result


nodes = paint_nodes(source)
# These paint ranges refer to this PDF's MuPDF SVG export. Fail explicitly on a
# changed exporter/source instead of accidentally assigning a face to a device.
assert nodes[205].tag.endswith("image") and nodes[270].get("fill") == "#d0c9b5"
assert nodes[956].get("d", "").startswith("M0 0") and nodes[1315].get("fill") == "#06fe01"
scale = page.rect.height / 1800
manifest = {}
geometry = {}


def accent(node):
    return any(node.get(key) in {"#06fe01", "#00ff00", "#fe0300"} for key in ("fill", "stroke"))


def export(name, box, *, only=None, exclude=(), clean=False, colour=None, unclip_frame=None, unclip=False, smooth_pool=None):
    root = copy.deepcopy(source)
    elements = paint_nodes(root)
    parents = {child: parent for parent in root.iter() for child in parent}
    if unclip:
        for node in root.iter():
            node.attrib.pop("clip-path", None)
    if unclip_frame:
        clips = {n.get("id") for n in root.iter() if n.tag.endswith("}clipPath")
                 and any(p.get("d") == unclip_frame for p in n)}
        for n in root.iter():
            if n.get("clip-path", "")[5:-1] in clips:
                n.attrib.pop("clip-path", None)
    only = None if only is None else set(only)
    excluded = set(exclude)
    for index, element in enumerate(elements):
        if index == smooth_pool:
            # The PDF contains a tiny 30 x 56 image and a quantised luminance
            # mask here. Preserve its native light contour, but shade it with
            # one continuous soft halo instead of magnifying those pixel ridges.
            parent = parents[element]
            parent.attrib.pop("mask", None)
            clip = parents[parent].get("clip-path")[5:-1]
            contour = next(n for n in root.iter() if n.get("id") == clip)[0]
            defs = ET.SubElement(root, f"{{{NS}}}defs")
            blur = ET.SubElement(defs, f"{{{NS}}}filter", {
                "id": "smooth-pool", "x": "-100%", "y": "-50%",
                "width": "300%", "height": "200%", "color-interpolation-filters": "sRGB"})
            ET.SubElement(blur, f"{{{NS}}}feGaussianBlur", {"stdDeviation": "2.1"})
            halo = copy.deepcopy(contour)
            halo.set("fill", "none")
            halo.set("stroke", "white")
            # Keep the side-view halo softer than the right-hand circular pool;
            # its narrower contour otherwise makes the white rim look stronger.
            halo.set("stroke-opacity", ".50")
            halo.set("stroke-width", "8")
            halo.set("filter", "url(#smooth-pool)")
            parent.remove(element)
            parent.append(halo)
            continue
        if (only is not None and index not in only) or index in excluded or (clean and accent(element)):
            parents[element].remove(element)
        elif colour:
            if element.get("fill") != "none":
                element.set("fill", colour)
            if element.get("stroke") not in {None, "none"}:
                element.set("stroke", colour)
        # Source outlines contain acute joins. Keep the contour, without miter spikes.
        element.set("stroke-linejoin", "round")
        element.set("stroke-linecap", "round")
    x, y, w, h = box
    root.set("viewBox", " ".join(str(v * scale) for v in box))
    factor = min(3, 1500 / max(w, h))
    root.set("width", str(round(w * factor)))
    root.set("height", str(round(h * factor)))
    ET.ElementTree(root).write(OUT / f"{name}.svg", encoding="utf-8", xml_declaration=True)
    manifest[name] = {"box": box, "width": round(w * factor), "height": round(h * factor)}


for index in range(4):
    box = [95 + index * 274, 248, 272, 249]
    export(f"observation-{index}", box, exclude=range(398, 409))

# Use the transparent-window face of the source instrument. The actual thumb,
# supporting grip, button and light remain independent original-art layers.
switch_box = [36, 684, 424, 464]
export("switch-grip", switch_box, only=range(71, 74))
export("switch-device", switch_box, only=range(75, 123), exclude=[79, 80, 81])
export("switch-lens-light", switch_box, only=[146])
export("switch-thumb", switch_box, only=range(134, 146))
export("switch-beam", switch_box, only=[74])
export("switch-button", switch_box, only=[79], colour="#dddddd")

# Continue the PDF beam's two straight sides beyond the stage, dropping only the
# handout panel's distant rounded end. Near-window vertices remain source-native.
beam = ET.Element(f"{{{NS}}}svg", {"viewBox": " ".join(str(v * scale) for v in switch_box),
                                  "width": "1272", "height": "1392"})
defs = ET.SubElement(beam, f"{{{NS}}}defs")
gradient = ET.SubElement(defs, f"{{{NS}}}linearGradient", {"id": "light", "gradientUnits": "userSpaceOnUse",
    "x1": "110", "y1": "380", "x2": "320", "y2": "130"})
for offset, opacity in [("0", ".95"), ("1", ".12")]:
    ET.SubElement(gradient, f"{{{NS}}}stop", {"offset": offset, "stop-color": "white", "stop-opacity": opacity})
ET.SubElement(beam, f"{{{NS}}}path", {"d": "M101.467 372.621 142.705 61.071 547.546 131.69 115.756 392.21Z", "fill": "url(#light)"})
ET.ElementTree(beam).write(OUT / "switch-beam-extended.svg", encoding="utf-8", xml_declaration=True)
manifest["switch-beam-extended"] = {"box": switch_box, "width": 1272, "height": 1392}

# Canonical symbols are tightly cropped and normalised by the scene builder.
export("icon-tick", [999, 1227, 77, 77], only=[1315, 1316])
export("icon-alert-orange", [1001, 1362, 77, 77], only=[1317, 1318])
export("icon-alert-red", [1001, 1503, 77, 77], only=[1319, 1320])
export("icon-cross", [736, 853, 46, 46], only=[654, 655, 656])

# All three scenes are present initially, without coloured marks or symbols.
for name, box in [("fixation-base", [422, 686, 373, 150]), ("blocked-base", [422, 842, 373, 147]), ("device-base", [422, 996, 373, 151])]:
    export(name, box, clean=True, exclude=range(652, 660))

# Only original accent paths remain; their native clip/opacity groups survive.
accent_indices = [index for index, element in enumerate(nodes) if accent(element)]
export("target-highlight", [449, 740, 29, 50], only=accent_indices)
export("person-highlight", [422, 842, 373, 147], only=[581, 583])
export("device-highlight", [422, 996, 373, 151], only=[641])
export("device-highlight-fill", [422, 996, 373, 151], only=[638])
export("device-body-highlight", [422, 996, 373, 151], only=[639], colour="#fe0300")
export("fixation-arrow", [422, 686, 373, 150], only=[512, 513])

# Side approach: the moving hand, instrument and projected light are actual PDF
# components, with a separate foreground face, insert and dashed highlight.
side_box = [815, 686, 373, 462]
moving = list(range(205, 238))
foreground = [259, 260, *range(262, 270)]
insert = list(range(270, 295))
export("approach-base", side_box, exclude=moving + [248, 249, 250, 251, 252, 258, 261] + insert)
export("approach-moving", side_box, only=range(206, 236))
export("approach-back-body", side_box, only=[206, 207, 208, 209, 235])
export("approach-sleeve", [723, 686, 373, 462], only=[255, 257], unclip=True)
export("approach-light", side_box, only=[205])
export("approach-occluder", side_box, only=[177, 179, 181, 182, *range(194, 203), 259, 260, *range(262, 270)])
export("approach-hand", side_box, only=[236, 237])
export("approach-arm-left", [815, 686, 100.5, 462], only=[236])
export("approach-hand-right", [914.5, 686, 273.5, 462], only=[236, 237])
export("approach-face-front", side_box, only=foreground)
export("approach-arrow", [985, 775, 92, 58], only=[258, 261])
export("approach-insert", [815, 945, 215, 203], only=[i for i in insert if i not in {292, 293}])
export("approach-dashes", [815, 945, 215, 203], only=[292, 293])

cases = {
    "clear": [(956, 962, 966, 993), (847, 853, 857, 884), (742, 748, 752, 779)],
    "cataract": [(1275, 1281, 1285, 1312), (1166, 1172, 1176, 1203), (1061, 1067, 1071, 1098)],
}


def matrix(node):
    values = re.findall(r"[-+]?(?:\d*\.\d+|\d+)", node.get("transform", ""))
    assert len(values) == 6
    a, b, c, d, e, f = map(float, values)
    return lambda x, y: [a * x + c * y + e, b * x + d * y + f]


def pool_path(node, box):
    # Convert the PDF's existing inner pool contour, not a substitute ellipse.
    first = node.get("d").split("M")[1]
    nums = list(map(float, re.findall(r"[-+]?(?:\d*\.\d+|\d+)", first)))
    convert = matrix(node)
    def point(x, y):
        px, py = convert(x, y)
        return [(px / scale - box[0]) * 3, (py / scale - box[1]) * 3]
    start = point(*nums[:2])
    triples = [[point(*nums[i+j:i+j+2]) for j in (0, 2, 4)] for i in range(2, len(nums), 6)]
    vertices = [start] + [segment[2] for segment in triples[:-1]]
    incoming, outgoing = [], []
    for i, vertex in enumerate(vertices):
        incoming.append([triples[i-1][1][k] - vertex[k] for k in (0, 1)])
        outgoing.append([triples[i][0][k] - vertex[k] for k in (0, 1)])
    return {"c": True, "v": vertices, "i": incoming, "o": outgoing}


def frame_path(node, box):
    """Retain the PDF cell's fixed square-left / rounded-right outline."""
    tokens = re.findall(r"[MHVCZ]|[-+]?(?:\d*\.\d+|\d+)", node.get("d"))
    convert = matrix(node)
    def point(x, y):
        px, py = convert(x, y)
        return [(px / scale - box[0]) * 3, (py / scale - box[1]) * 3]
    vertices, incoming, outgoing = [], [], []
    x = y = 0
    while tokens:
        command = tokens.pop(0)
        if command == "Z": break
        if command in {"M", "C"}:
            values = [float(tokens.pop(0)) for _ in range(2 if command == "M" else 6)]
            x, y = values[-2:]
        elif command == "H": x = float(tokens.pop(0))
        elif command == "V": y = float(tokens.pop(0))
        vertex = point(x, y)
        if command == "C":
            a, b = point(*values[:2]), point(*values[2:4])
            outgoing[-1] = [a[k] - vertices[-1][k] for k in (0, 1)]
            inc = [b[k] - vertex[k] for k in (0, 1)]
        else: inc = [0, 0]
        vertices.append(vertex); incoming.append(inc); outgoing.append([0, 0])
    if vertices[-1] == vertices[0]:
        incoming[0] = incoming.pop(); vertices.pop(); outgoing.pop()
    return {"c": True, "v": vertices, "i": incoming, "o": outgoing}


for kind, entries in cases.items():
    for row, (pupil, beam, device_start, device_end) in enumerate(entries):
        y = [1199, 1339, 1481][row]
        before = [206, y, 137, 126] if kind == "clear" else [545, y, 137, 126]
        after = [365, y, 140, 126] if kind == "clear" else [703, y, 140, 126]
        before_pupil = {"clear": [902, 795, 690], "cataract": [1221, 1114, 1009]}[kind][row]
        before_devices = {"clear": [(913, 940), (806, 833), (701, 728)], "cataract": [(1232, 1259), (1125, 1152), (1020, 1047)]}
        before_start, before_end = before_devices[kind][row]
        assert nodes[before_pupil + 8].tag.endswith("image")
        export(f"{kind}-{row}-before", before, clean=True, smooth_pool=before_pupil + 8)
        export(f"{kind}-{row}-instrument-before", before, only=range(before_start, before_end + 1))
        parents = {c: n for n in source.iter() for c in n}
        ancestor = nodes[pupil - 1]
        while not ancestor.get("clip-path"):
            ancestor = parents[ancestor]
        clip_id = ancestor.get("clip-path")[5:-1]
        frame = next(n for n in source.iter() if n.get("id") == clip_id)[0]
        export(f"{kind}-{row}-base", [after[0] - 24, after[1] - 24, after[2] + 48, after[3] + 48], exclude=[pupil, *range(beam, device_end + 1)], clean=True, unclip_frame=frame.get("d"))
        iris = matrix(nodes[pupil - 1])(6.578, 0)
        iris_numbers = list(map(float, re.findall(r"[-+]?(?:\d*\.\d+|\d+)", nodes[before_pupil - 1].get("d"))))
        before_iris = matrix(nodes[before_pupil - 1])(iris_numbers[6], 0)
        geometry[f"{kind}-{row}"] = {"iris": [v / scale for v in iris], "beforeIris": [v / scale for v in before_iris], "pool": pool_path(nodes[beam + 1], after), "frame": frame_path(frame, after)}
        # Keep the source's dark face vignette fixed. The white illumination image
        # and instrument are independent; the vignette never travels with them.
        export(f"{kind}-{row}-shadow", after, only=[beam + 1])
        export(f"{kind}-{row}-beam", after, only=[beam])
        export(f"{kind}-{row}-instrument", [after[0] - 64, after[1] - 64, after[2] + 128, after[3] + 128], only=range(device_start, device_end + 1), unclip_frame=frame.get("d"))
        arrow_nodes = {"clear": [(994, 995), (885, 886), (780, 781)], "cataract": [(1313, 1314), (1204, 1205), (1099, 1100)]}
        arrow_box = [330 if kind == "clear" else 668, y, 75, 126]
        export(f"{kind}-{row}-arrow", arrow_box, only=arrow_nodes[kind][row], colour="#ff6e00" if row == 1 else None)
        export(f"fundus-{row}", [856, y, 119, 127])
        export(f"status-{row}", [1001, y + 25, 77, 80])

(OUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
(OUT / "geometry.json").write_text(json.dumps(geometry, indent=2), encoding="utf-8")
print(f"Separated {len(manifest)} original-art layers.")
