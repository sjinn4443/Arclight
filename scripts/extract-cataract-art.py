"""Extract original Cataract_Edit5 PDF artwork into independently timed layers.

Authoring masters are read-only. SVG intermediates stay under tmp/; the builder
ships only the selected raster components, not the PDF/Illustrator masters.
"""
import copy
import hashlib
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tmp/pupils-pec/pdf-tools"))
import pymupdf

SOURCE = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("D:/Arclight/ScrollVisualsforApp/Disease/Cataract/Cataract_Edit5.pdf")
OUT = Path(os.environ.get("CATARACT_WORK_DIR", ROOT / "tmp/cataract")) / "layers"
OUT.mkdir(parents=True, exist_ok=True)
doc = pymupdf.open(SOURCE)
assert len(doc) == 1 and round(doc[0].rect.width) == 595
NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", NS)
ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")
source = ET.fromstring(doc[0].get_svg_image())
NUMBER = r"[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?"


def multiply(a, b):
    return (a[0]*b[0]+a[2]*b[1], a[1]*b[0]+a[3]*b[1], a[0]*b[2]+a[2]*b[3], a[1]*b[2]+a[3]*b[3], a[0]*b[4]+a[2]*b[5]+a[4], a[1]*b[4]+a[3]*b[5]+a[5])


def transform(value):
    result = (1, 0, 0, 1, 0, 0)
    for command, args in re.findall(r"(matrix|translate|scale)\(([^)]+)\)", value):
        v = list(map(float, re.findall(NUMBER, args)))
        matrix = tuple(v) if command == "matrix" else (1, 0, 0, 1, v[0], v[1] if len(v)>1 else 0) if command == "translate" else (v[0], 0, 0, v[-1], 0, 0)
        result = multiply(result, matrix)
    return result


def points(value):
    tokens = re.findall(r"[A-Za-z]|" + NUMBER, value)
    x = y = 0
    result = []
    command = "M"
    while tokens:
        if tokens[0].isalpha(): command = tokens.pop(0)
        if command.upper() == "Z": continue
        count = {"M":2,"L":2,"C":6,"Q":4,"H":1,"V":1}[command.upper()]
        v = [float(tokens.pop(0)) for _ in range(count)]
        relative = command.islower()
        if command.upper() == "H": x = v[0] + (x if relative else 0); result.append((x,y))
        elif command.upper() == "V": y = v[0] + (y if relative else 0); result.append((x,y))
        else:
            pairs = [(v[i]+(x if relative else 0),v[i+1]+(y if relative else 0)) for i in range(0,count,2)]
            result.extend(pairs); x,y = pairs[-1]
    return result


def paint(root):
    result = []
    def walk(node, matrix=(1,0,0,1,0,0), defs=False):
        matrix = multiply(matrix, transform(node.get("transform", "")))
        kind = node.tag.split("}")[-1]
        defs = defs or kind in {"defs","clipPath","mask","pattern"}
        if not defs and kind in {"path","image","use","text"}:
            if kind == "path": p = points(node.get("d", ""))
            elif kind == "image":
                x,y,w,h = [float(node.get(k,"0")) for k in ("x","y","width","height")]; p=[(x,y),(x+w,y+h)]
            else: p=[(0,0)]
            mapped = [(matrix[0]*x+matrix[2]*y+matrix[4],matrix[1]*x+matrix[3]*y+matrix[5]) for x,y in p]
            bounds = [min(p[0] for p in mapped),min(p[1] for p in mapped),max(p[0] for p in mapped),max(p[1] for p in mapped)] if mapped else [0]*4
            result.append((node,bounds))
        for child in node: walk(child,matrix,defs)
    walk(root)
    return result


nodes = paint(source)
EXPORT_PREFIX = os.environ.get("CATARACT_ART_PREFIX", "")
manifest = json.loads((OUT / "manifest.json").read_text(encoding="utf-8")) if EXPORT_PREFIX and (OUT / "manifest.json").exists() else {}


def inside(bounds, box):
    x,y,w,h = box
    return x <= (bounds[0]+bounds[2])/2 <= x+w and y <= (bounds[1]+bounds[3])/2 <= y+h


def export(name, box, only=None, remove=()):
    if EXPORT_PREFIX and not name.startswith(EXPORT_PREFIX):
        return
    root = copy.deepcopy(source)
    parents = {child:parent for parent in root.iter() for child in parent}
    for i,(node,_) in enumerate(paint(root)):
        if (only is not None and i not in only) or i in remove: parents[node].remove(node)
    x,y,w,h = box
    factor = min(80 if max(w,h) < 5 else 7, 1600/max(w,h))
    root.set("viewBox",f"{x} {y} {w} {h}")
    root.set("width",str(round(w*factor))); root.set("height",str(round(h*factor)))
    ET.ElementTree(root).write(OUT / f"{name}.svg",encoding="utf-8",xml_declaration=True)
    manifest[name] = {"box":box,"width":round(w*factor),"height":round(h*factor)}


# Measured against the complete source page; omit column borders and row numbers.
rows = [(129,96),(230,120),(355,120),(480,121),(606,106),(717,106)]
for section,(top,height) in enumerate(rows,1):
    export(f"method-{section}",[69,top,170,height])
    for column,left in [("cataract",273),("refer",413)]:
        export(f"{column}-{section}",[left,top,131,height])

# Speech bubbles are original source paths, revealed one at a time.
for mode, boxes in {
    "method":[[79,139,73,31],[79,174,73,32]],
    "cataract":[[345,139,53,32],[345,174,53,32]],
    "refer":[[462,135,90,37],[462,173,90,34]],
}.items():
    removed = set()
    for i,box in enumerate(boxes):
        selected = {n for n,(_,b) in enumerate(nodes) if inside(b,box) and b[2]-b[0]<100 and b[3]-b[1]<50}
        removed |= selected
        export(f"history-{mode}-bubble-{i+1}",box,only=selected)
    left,width = (69,170) if mode == "method" else (273,131) if mode == "cataract" else (413,141)
    if mode == "refer":
        # Widen the view for the eye symbols without bringing the original red
        # column frame into the animation. Large source backgrounds/frames are
        # replaced by the shared stage background; keep the patient and chair.
        removed |= {i for i,(_,b) in enumerate(nodes) if b[2]-b[0]>100 or b[3]-b[1]>120}
    export(f"history-{mode}-base",[left,129,width,96],remove=removed)

# Put the original examiner and patient in one room. Extract actors separately
# from the source backgrounds so there is no column border or white gutter.
for name,box in {"history-examiner":[155,139,80,86], "history-patient":[283,162,61,63]}.items():
    selected = {i for i,(_,b) in enumerate(nodes) if inside(b,box) and b[2]-b[0]<90 and b[3]-b[1]<100}
    if name == "history-patient":
        # The chair extends below the PDF row and is clipped by that row.
        # Keep its original path even though its centre lies outside the crop.
        selected.add(2608)
    export(name,box,only=selected)

# Each eye-response panel is kept whole so its original curved mask, iris,
# device, arrows and referral symbols remain registered. Recompose vertically.
panel_boxes = {
    "front-cataract-1":[286,363,109,46],"front-cataract-2":[286,418,109,46],
    "front-refer-1":[425,358,119,52],"front-refer-2":[425,416,119,49],
    "pupil-cataract-1":[285,491,110,42],"pupil-cataract-2":[285,541,110,44],
    "pupil-refer-1":[423,486,114,48],"pupil-refer-2":[423,538,114,47],
    "reflex-cataract-1":[290,616,48,39],"reflex-cataract-2":[340,616,45,39],
    "reflex-cataract-3":[290,663,48,39],"reflex-cataract-4":[340,663,45,39],
    "reflex-refer-1":[426,610,118,44],"reflex-refer-2":[426,665,118,39],
    "fundus-cataract-1":[286,727,109,41],"fundus-cataract-2":[286,774,109,41],
    "fundus-refer-1":[420,720,124,98],
}
for name,box in panel_boxes.items(): export(name,box)

# Separate the two original aperture circles for actual constriction motion.
for name,index in [("pupil-cataract-1",2886),("pupil-cataract-2",3013)]:
    b = nodes[index][1]
    assert nodes[index][0].tag.endswith("}path") and b[2]-b[0] < 2
    export(name + "-pupil",[b[0],b[1],b[2]-b[0],b[3]-b[1]],only={index})
    export(name,panel_boxes[name],remove={index})

# Identify white translucent illumination paths in the technique panels. These
# source polygons fade in synchrony with the narrated examination, not the face.
for section in range(3,7):
    top,height = rows[section-1]; box = [69,top,170,height]
    # These are the source's translucent raster light pools, not face pixels.
    beam = {3: {132}, 4: {2463}, 5: {5472}, 6: {5593}}[section]
    assert all(nodes[i][0].tag.endswith("}image") for i in beam)
    export(f"method-{section}-base",box,remove=beam)
    export(f"method-{section}-light",box,only=beam)

# VA source panels are presented at readable size instead of one tiny collage.
for name,box in {
    "acuity-method-distance":[75,232,57,113],
    "acuity-method-cover":[134,267,57,78],
    "acuity-method-pinhole":[137,237,42,21],
    "acuity-method-near":[180,232,57,114],
    "acuity-cataract-distance":[288,239,36,50],
    "acuity-cataract-pinhole":[290,295,35,19],
    "acuity-cataract-near":[288,319,40,24],
    "acuity-cataract-down-1":[359,251,27,29],
    "acuity-cataract-no-gain":[359,294,27,23],
    "acuity-cataract-down-2":[359,318,27,29],
    "acuity-refer-distance":[423,251,72,51],
    "acuity-refer-near":[424,304,39,23],
    "acuity-refer-up":[497,279,46,25],
}.items(): export(name,box)

(OUT / "manifest.json").write_text(json.dumps(manifest,indent=2),encoding="utf-8")
(OUT / "nodes.json").write_text(json.dumps([{"i":i,"fill":n.get("fill"),"opacity":n.get("fill-opacity"),"box":b} for i,(n,b) in enumerate(nodes)],indent=2),encoding="utf-8")
(OUT / "provenance.json").write_text(json.dumps({"sourceDocument":SOURCE.name,"pdfSha256":hashlib.sha256(SOURCE.read_bytes()).hexdigest(),"pageCount":len(doc),"artwork":"Original source PDF components; no replacement illustrations.","assets":manifest},indent=2),encoding="utf-8")
print(f"Extracted {len(manifest)} original-art layers from {SOURCE.name} ({len(nodes)} paint objects).")
