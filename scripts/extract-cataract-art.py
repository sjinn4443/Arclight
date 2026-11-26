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


def export(name, box, only=None, remove=(), unclip=False, backdrop=None, underlay=None):
    if EXPORT_PREFIX and not any(name.startswith(p) for p in EXPORT_PREFIX.split(",")):
        return
    root = copy.deepcopy(source)
    if unclip:
        for node in root.iter(): node.attrib.pop("clip-path", None)
    parents = {child:parent for parent in root.iter() for child in parent}
    for i,(node,_) in enumerate(paint(root)):
        if (only is not None and i not in only) or i in remove: parents[node].remove(node)
        elif backdrop and node.get("fill") in {"#e8e3d4","#cfc9b7"}:
            # The poster paints over hidden limbs with its wall/floor colours.
            # Retain those occlusions against the recomposed scene's backdrop.
            node.set("fill",backdrop)
    if underlay is not None:
        root.insert(0, ET.Element(f"{{{NS}}}path", underlay))
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

# Keep the short pointer, lettering and symbols together at the PDF aspect ratio.
for name,box in {
    "examiner-time":[79,138,72,33], "examiner-symptoms":[79,174,72,33],
    "patient-time":[345,139,53,32], "patient-eyes":[345,174,53,32],
}.items():
    selected = {i for i,(_,b) in enumerate(nodes) if inside(b,box) and b[2]-b[0]<100 and b[3]-b[1]<50}
    export("bubble-"+name,box,only=selected)
export("bubble-patient-sudden",[465,130,84,42],only={4155}|set(range(4157,4167))|set(range(5752,5781)))
export("bubble-patient-pain",[465,170,78,37],only={4156}|set(range(4167,4173))|set(range(5734,5748)))

# Source column headers, including their coloured rims and the red diagonal.
export("badge-cataract",[269,84,47,47],only=range(43,50))
export("badge-other-cause",[408,84,47,47],only=range(50,59))

# Put the original examiner and patient in one room. Extract actors separately
# from the source backgrounds so there is no column border or white gutter.
arm = {64,66,79,81,89}
examiner_box = [155,139,80,156]
export("history-examiner",examiner_box,only=set(range(60,92))-arm,unclip=True)
export("history-examiner-arm",examiner_box,only=arm,unclip=True)
export("history-patient",[257,159,87,136],only=range(2604,2640),unclip=True)

# These five original outlines are closed cubic chains. Keep their handles in
# PDF coordinates so the builder can bend the wrist without moving the cuff.
gesture = []
for index in sorted(arm):
    node = nodes[index][0]
    path = node.attrib["d"]
    assert re.fullmatch(r"M[^A-Za-z]+C[^A-Za-z]+", path)
    matrix = transform(node.attrib["transform"])
    coords = points(path)
    curve = [[round(matrix[0]*x + matrix[2]*y + matrix[4],4),
              round(matrix[1]*x + matrix[3]*y + matrix[5],4)] for x,y in coords]
    assert curve[0] == curve[-1]
    gesture.append({"fill":node.attrib["fill"], "curve":curve})
(OUT / "history-gesture.json").write_text(json.dumps(gesture),encoding="utf-8")

# One visual size for every teaching glyph, independent of its PDF crop.
glyphs = {
 "calendar":[83,146,15,16], "question":[100,146,8,16],
 "clock":[114,146,15,16], "pain-eye":[82,182,17,17],
 "eyes":[362,185,27,11], "sudden":[474,144,30,18],
 "front-eye":[518,174,20,22], "back-eye":[531,134,18,21],
 "down":[358,250,28,28], "no-gain":[358,288,28,29],
 "up":[495,277,28,28], "glasses":[521,281,23,24],
}
for name,box in glyphs.items():
    selected={i for i,(_,b) in enumerate(nodes) if inside(b,box) and b[2]-b[0]<35 and b[3]-b[1]<35}
    export("symbol-"+name,box,only=selected)

# Each eye-response panel is kept whole so its original curved mask, iris,
# device, arrows and referral symbols remain registered. Recompose vertically.
panel_boxes = {
    "front-cataract-1":[286,363,109,46],"front-cataract-2":[286,418,109,46],
    "front-refer-1":[425,358,119,52],"front-refer-2":[425,416,119,49],
    "pupil-cataract-1":[285,491,110,42],"pupil-cataract-2":[285,541,110,44],
    "pupil-refer-1":[423,486,114,48],"pupil-refer-2":[423,538,114,47],
    "reflex-cataract-1":[290,616,48,39],"reflex-cataract-2":[340,616,45,39],
    "reflex-cataract-3":[290,663,48,39],"reflex-cataract-4":[340,663,45,39],
    "reflex-refer-1":[424,608,119,47],"reflex-refer-2":[424,659,119,45],
    "fundus-cataract-1":[286,727,109,41],"fundus-cataract-2":[286,774,109,41],
    "fundus-refer-1":[420,720,124,98],
}
panel_removed = {}
for name,box in panel_boxes.items():
    removed=set(); symbols=[]
    arrow_index={"pupil-cataract-1":2996,"pupil-cataract-2":3039,"pupil-refer-1":5368,"pupil-refer-2":5409}.get(name)
    arrows=[]
    if arrow_index is not None:
        b=nodes[arrow_index][1];label="symbol-"+name+"-arrow"
        export(label,[b[0],b[1],b[2]-b[0],b[3]-b[1]],only={arrow_index})
        removed.add(arrow_index);arrows.append(label)
    for index,(node,b) in enumerate(nodes):
        w,h=b[2]-b[0],b[3]-b[1]
        if not inside(b,box) or not 14.5<w<16 or abs(w-h)>.3 or node.get("fill") not in {"#c3c3c3","#d7654a","#606060"}: continue
        start=index-1
        # Each supplied badge starts with its own 21-point raster shadow.
        stop=index+1
        # An SVG <use> can be a reused shadow with zero measured bounds.
        # Stop at the badge's final stroked rim, even for overlapping badges.
        while stop<len(nodes) and stop<index+35:
            n,q=nodes[stop]
            stop+=1
            if n.get("fill")=="none" and all(abs(u-v)<1 for u,v in zip(b,q)): break
        selected=set(range(start,stop))
        label=f"symbol-{name}-{len(symbols)}"
        export(label,[b[0]-2,b[1]-2,w+4,h+4],only=selected)
        removed |= selected;symbols.append(label)
        # Illustrator also retains duplicate shadow/rim paint below some
        # badges. Remove that whole small footprint, not just the top group.
        footprint=[b[0]-2,b[1]-2,w+4,h+4]
        removed |= {i for i,(_,q) in enumerate(nodes) if inside(q,footprint) and q[2]-q[0]<30 and q[3]-q[1]<30}
    export(name,box,remove=removed)
    manifest[name]["symbols"]=symbols
    manifest[name]["arrows"]=arrows
    panel_removed[name]=removed

# Separate the two original aperture circles for actual constriction motion.
for name,index in [("pupil-cataract-1",2886),("pupil-cataract-2",3013)]:
    b = nodes[index][1]
    assert nodes[index][0].tag.endswith("}path") and b[2]-b[0] < 2
    export(name + "-pupil",[b[0],b[1],b[2]-b[0],b[3]-b[1]],only={index})
    symbols=manifest[name].get("symbols",[])
    arrows=manifest[name].get("arrows",[])
    export(name,panel_boxes[name],remove={index}|panel_removed.get(name,set()))
    manifest[name]["symbols"]=symbols
    manifest[name]["arrows"]=arrows

# Identify white translucent illumination paths in the technique panels. These
# source polygons fade in synchrony with the narrated examination, not the face.
for section in range(3,7):
    top,height = rows[section-1]; box = [69,top,170,height]
    # These are the source's translucent raster light pools, not face pixels.
    beam = {3: {132}, 4: {2463}, 5: {5472}, 6: {5593}}[section]
    assert all(nodes[i][0].tag.endswith("}image") for i in beam)
    export(f"method-{section}-base",box,remove=beam)
    export(f"method-{section}-light",box,only=beam)

# Isolate complete groups before removing the row clip. This restores chair
# legs, feet and the pinhole cord without admitting the neighbouring figures.
export("acuity-method-distance",[75,235,62,123],only=set(range(163,986))|{2409,2410},unclip=True,backdrop="#cfc9b7")
export("acuity-method-pinhole",[133,233,51,29],only=range(1088,1296))
export("acuity-method-near",[186,267,71,95],only=range(1296,1392),unclip=True,backdrop="#cfc9b7")
export("acuity-cataract-pinhole",[289,292,56,25],only=range(4018,4080))
export("acuity-refer-distance",[421,249,45,56],only=range(4257,4335))
# Above the row clip this patient covers his eye. Below it the illustrator
# left empty hand silhouettes and finger lines from an earlier hands-on-lap
# pose. Complete the trouser fabric behind the original hem, knees and shoes.
lap = {"fill":nodes[5134][0].attrib["fill"],
       "d":"M467 305.6 Q465.5 308 462.7 311 Q461.3 312.6 461.7 316.5 L470.4 318.5 Q476 314.7 482 318.5 L490.8 316.5 Q491.7 312.9 489.6 309.7 L487.9 305.6Z"}
patient = set(range(5131,5233)) - {5132,5155,5156,5231,5232} - set(range(5157,5165))
export("acuity-refer-patient",[451,253,47,98],only=patient,unclip=True,backdrop="#7b776c",underlay=lap)

for name,box in {
    "acuity-method-cover":[134,267,57,78],
    "acuity-cataract-distance":[287,238,47,53],
    "acuity-cataract-near":[288,319,48,25],
    "acuity-cataract-down-1":[359,251,27,29],
    "acuity-cataract-no-gain":[359,294,27,23],
    "acuity-cataract-down-2":[359,318,27,29],
    "acuity-refer-near":[424,304,39,23],
    "acuity-refer-up":[497,279,46,25],
}.items(): export(name,box)

(OUT / "manifest.json").write_text(json.dumps(manifest,indent=2),encoding="utf-8")
(OUT / "nodes.json").write_text(json.dumps([{"i":i,"fill":n.get("fill"),"opacity":n.get("fill-opacity"),"box":b} for i,(n,b) in enumerate(nodes)],indent=2),encoding="utf-8")
(OUT / "provenance.json").write_text(json.dumps({"sourceDocument":SOURCE.name,"pdfSha256":hashlib.sha256(SOURCE.read_bytes()).hexdigest(),"pageCount":len(doc),"artwork":"Original source PDF components; no replacement illustrations.","assets":manifest},indent=2),encoding="utf-8")
print(f"Extracted {len(manifest)} original-art layers from {SOURCE.name} ({len(nodes)} paint objects).")
