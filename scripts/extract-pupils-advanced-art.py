"""Separate the two-page Advanced handout into original-art animation layers.

SVGs and measured geometry are authoring intermediates; only local WebP/PNG
assets are shipped. The PDF-compatible Illustrator master is preserved beside
the PDF. Requires the same PyMuPDF 2.0 authoring environment as Pupils PEC.
"""
import copy
import hashlib
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
SOURCE = ROOT / "public/pdfbasedanims/Pupils Advanced_110826.pdf"
OUT = ROOT / "tmp/pupils-advanced/layers"
OUT.mkdir(parents=True, exist_ok=True)
document = pymupdf.open(SOURCE)
assert len(document) == 2 and round(document[0].rect.width) == 595
roots = [ET.fromstring(page.get_svg_image()) for page in document]
NUMBER = r"[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?"
NODE_MATRICES = {}


def multiply(a, b):
    return (a[0]*b[0]+a[2]*b[1], a[1]*b[0]+a[3]*b[1],
            a[0]*b[2]+a[2]*b[3], a[1]*b[2]+a[3]*b[3],
            a[0]*b[4]+a[2]*b[5]+a[4], a[1]*b[4]+a[3]*b[5]+a[5])


def transform(value):
    result = (1, 0, 0, 1, 0, 0)
    for command, args in re.findall(r"(matrix|translate|scale)\(([^)]+)\)", value):
        v = list(map(float, re.findall(NUMBER, args)))
        if command == "matrix": matrix = tuple(v)
        elif command == "translate": matrix = (1, 0, 0, 1, v[0], v[1] if len(v)>1 else 0)
        else: matrix = (v[0], 0, 0, v[-1], 0, 0)
        result = multiply(result, matrix)
    return result


def path_points(value):
    tokens = re.findall(r"[A-Za-z]|" + NUMBER, value)
    x = y = 0
    points = []
    command = "M"
    while tokens:
        if tokens[0].isalpha(): command = tokens.pop(0)
        if command.upper() == "Z":
            if not tokens: break
            command = "M"
            continue
        count = {"M": 2, "L": 2, "C": 6, "Q": 4, "H": 1, "V": 1}.get(command.upper())
        if count is None: raise ValueError(f"Unexpected SVG command {command}")
        values = [float(tokens.pop(0)) for _ in range(count)]
        relative = command.islower()
        if command.upper() == "H":
            x = values[0] + (x if relative else 0)
            points.append((x, y))
        elif command.upper() == "V":
            y = values[0] + (y if relative else 0)
            points.append((x, y))
        else:
            pairs = [(values[i] + (x if relative else 0), values[i+1] + (y if relative else 0)) for i in range(0, count, 2)]
            points.extend(pairs)
            x, y = pairs[-1]
    return points


def paint(root):
    result = []
    def walk(element, matrix=(1,0,0,1,0,0), in_defs=False):
        matrix = multiply(matrix, transform(element.get("transform", "")))
        kind = element.tag.split("}")[-1]
        in_defs = in_defs or kind in {"defs", "clipPath", "mask", "pattern"}
        if not in_defs and kind in {"path", "use", "image"}:
            if kind == "path": points = path_points(element.get("d", ""))
            elif kind == "image":
                x,y,w,h=[float(element.get(key,"0")) for key in ("x","y","width","height")]
                points=[(x,y),(x+w,y),(x+w,y+h),(x,y+h)]
            else: points=[(0,0)]
            mapped = [(matrix[0]*x+matrix[2]*y+matrix[4], matrix[1]*x+matrix[3]*y+matrix[5]) for x,y in points]
            bounds = [min(p[0] for p in mapped), min(p[1] for p in mapped), max(p[0] for p in mapped), max(p[1] for p in mapped)] if mapped else [0]*4
            result.append((element, bounds))
            NODE_MATRICES[id(element)] = matrix
        for child in element: walk(child, matrix, in_defs)
    walk(root)
    return result


GREEN = {"#06fe01", "#00ff00", "#00fe00", "#00ff01", "#08ff00"}
RED = {"#fe0300", "#ff0000", "#fe0000", "#ff0100", "#ff6e00"}
SIGNALS = {"#00fffa", "#0b00ff", "#db00ff"}
manifest = {}
geometry = {}
statuses = {}
paints = [paint(root) for root in roots]
status_glyphs = []
for page_nodes in paints:
    # Inline colour access here because the helper is defined below.
    circles = [b for node,b in page_nodes if {node.get("fill",""),node.get("stroke","")}.intersection(GREEN|RED) and 10<b[2]-b[0]<25 and abs((b[2]-b[0])-(b[3]-b[1]))<0.5]
    status_glyphs.append({i for i,(node,b) in enumerate(page_nodes) if {node.get("fill",""),node.get("stroke","")}.intersection({"#ffffff"}) and any(b[0]>=c[0] and b[1]>=c[1] and b[2]<=c[2] and b[3]<=c[3] for c in circles)})


def centre_inside(bounds, box):
    x,y,w,h = box
    return x <= (bounds[0]+bounds[2])/2 <= x+w and y <= (bounds[1]+bounds[3])/2 <= y+h


def colour(node):
    return {node.get("fill", "").lower(), node.get("stroke", "").lower()}


def export(name, page, box, *, only=None, remove=(), clean=(), offsets=None, unclip=False, resolution=4):
    root = copy.deepcopy(roots[page])
    nodes = paint(root)
    parents = {c:p for p in root.iter() for c in p}
    for index,(node,_) in enumerate(nodes):
        if offsets and index in offsets:
            dx,dy=offsets[index]
            node.set("transform",f"translate({dx} {dy}) "+node.get("transform",""))
        if (only is not None and index not in only) or index in remove or colour(node).intersection(clean) or (clean and index in status_glyphs[page]):
            parents[node].remove(node)
    x,y,w,h = box
    if unclip:
        for node in root.iter(): node.attrib.pop("clip-path", None)
    factor = min(resolution, 1500 / max(w,h))
    root.set("viewBox", f"{x} {y} {w} {h}")
    root.set("width", str(round(w*factor)))
    root.set("height", str(round(h*factor)))
    ET.ElementTree(root).write(OUT / f"{name}.svg", encoding="utf-8", xml_declaration=True)
    manifest[name] = {"page":page+1, "box":box, "width":round(w*factor), "height":round(h*factor)}


def coloured(name, page, box, colours):
    selected = {i for i,(node,bounds) in enumerate(paints[page]) if colour(node).intersection(colours) and centre_inside(bounds,box)}
    if colours.intersection(GREEN|RED):
        circles = [(i,b) for i,(node,b) in enumerate(paints[page]) if i in selected and colour(node).intersection(colours) and 10<b[2]-b[0]<25 and abs((b[2]-b[0])-(b[3]-b[1]))<0.5]
        statuses[name] = []
        for circle,b in circles:
            glyphs = {i for i in status_glyphs[page] if (lambda p: p[0]>=b[0] and p[1]>=b[1] and p[2]<=b[2] and p[3]<=b[3])(paints[page][i][1])}
            symbol = {circle}|glyphs
            asset = f"{name}-symbol-{len(statuses[name])}"
            crop = [b[0],b[1],b[2]-b[0],b[3]-b[1]]
            export(asset,page,crop,only=symbol)
            statuses[name].append({"asset":asset,"centre":[(b[0]+b[2])/2,(b[1]+b[3])/2],"box":box})
            selected -= symbol
    export(name,page,box,only=selected)
    return selected


# Bounds are in PDF points, measured against both complete rendered pages.
for name,box in [("afferent",[44,136,180,216]),("parasympathetic",[233,136,160,216]),("sympathetic",[394,136,160,216])]:
    colours=SIGNALS|{"#3a005a"} if name=="sympathetic" else SIGNALS
    coloured(name+"-signals",0,box,colours)
    export(name+"-base",0,box,clean=colours)

box = [304,402,251,201]
coloured("reflex-afferent",0,box,{"#00fffa","#0b00ff"})
coloured("reflex-efferent",0,box,{"#db00ff"})
export("reflex-base",0,box,clean=SIGNALS)

for i in range(4):
    box = [44+i*128,652,128,154]
    coloured(f"observation-{i}-status",0,box,GREEN|RED)
    export(f"observation-{i}",0,box,clean=GREEN|RED)

box=[44,87,272,201]
coloured("direct-setup-green",1,box,GREEN)
coloured("direct-setup-red",1,box,RED)
export("direct-setup",1,box,clean=GREEN|RED)

# Keep the original eye geometry. Remove only pupil ellipses, then animate an
# ellipse of the same centre/colour above the source iris and below illumination.
def response(name,box,centres,status=True):
    pupils=[]
    for cx,cy in centres:
        matches=[]
        for i,(node,b) in enumerate(paints[1]):
            width,height=b[2]-b[0],b[3]-b[1]
            if node.tag.endswith("}path") and node.get("fill", "#000000").lower() in {"#000000","#010101","#020202","#030302"} and 1<width<18 and 1<height<18 and abs(width-height)<0.3 and abs((b[0]+b[2])/2-cx)<4 and abs((b[1]+b[3])/2-cy)<4:
                matches.append((i,b))
        if not matches:
            raise ValueError(f"{name}: missing original pupil near {(cx,cy)}")
        best = min(matches,key=lambda m: abs((m[1][0]+m[1][2])/2-cx)+abs((m[1][1]+m[1][3])/2-cy))
        pupils.append({"indices":[m[0] for m in matches],"bounds":best[1]})
    geometry[name]={"pupils":pupils,"box":box}
    removed={i for p in pupils for i in p["indices"]}
    export(name+"-base",1,box,remove=removed,clean=GREEN|RED)
    if status: coloured(name+"-marks",1,box,GREEN|RED)

# The three direct-response pairs and their matching fundus images remain rows.
for row,y in enumerate([102,164,225]):
    response(f"direct-{row}",[326,y-7,229,62],[(389, y+27),(444,y+27)])

response("consensual-left",[44,337,164,99],[(90,391),(164,391)])
response("consensual-right",[44,437,164,101],[(90,490),(164,490)])
response("swing",[217,337,165,201],[(264,426),(338,426)],False)
# These source paint groups are the two complete instruments, including their
# controls. Guard their geometry before separating a single moving instrument.
assert 220 < paints[1][668][1][0] < 230 and 350 < paints[1][714][1][0] < 360
export("swing-device",1,[222,408,26,96],only=set(range(668,714)))
coloured("swing-arrows",1,[217,337,165,201],GREEN)
removed={i for p in geometry["swing"]["pupils"] for i in p["indices"]}|set(range(668,760))
export("swing-base",1,[217,337,165,201],remove=removed,clean=GREEN|RED)
response("swing-normal",[391,337,164,101],[(438,391),(512,391)])
response("swing-rapd",[391,439,164,99],[(438,474),(512,475)])

for name,box in [("near-distance",[44,588,251,100]),("near-target",[44,689,251,99])]:
    export(name+"-base",1,box,clean=GREEN|RED)
    coloured(name+"-marks",1,box,GREEN|RED)
for row,y in enumerate([631,698]):
    response(f"near-result-{row}",[304,y,251,52],[(336,y+30),(388,y+30),(447 if row==0 else 444,y+30),(494 if row==0 else 497,y+30)])

# Revision layers: separate illumination, device, path and foreground ownership.
# Curves retain original PDF control points; the builder animates trim/direction.
def curves(node):
    tokens=re.findall(r"[A-Za-z]|"+NUMBER,node.get("d","")); result=[]; current=None
    x=y=0; command="M"; matrix=NODE_MATRICES[id(node)]
    def mapped(p):
        return [matrix[0]*p[0]+matrix[2]*p[1]+matrix[4],matrix[1]*p[0]+matrix[3]*p[1]+matrix[5]]
    def add(p,inc=(0,0)):
        current["v"].append(mapped(p));current["i"].append(list(inc));current["o"].append([0,0])
    while tokens:
        if tokens[0].isalpha(): command=tokens.pop(0)
        upper=command.upper();relative=command.islower()
        if upper=="Z":
            current["c"]=True
            if len(current["v"])>1 and all(abs(current["v"][0][k]-current["v"][-1][k])<1e-5 for k in [0,1]):
                current["i"][0]=current["i"].pop();current["v"].pop();current["o"].pop()
            if not tokens: break
            command="M";continue
        n={"M":2,"L":2,"C":6,"H":1,"V":1}[upper]
        a=[float(tokens.pop(0)) for _ in range(n)]
        if upper=="H": p=[a[0]+(x if relative else 0),y]
        elif upper=="V":p=[x,a[0]+(y if relative else 0)]
        else:p=[a[-2]+(x if relative else 0),a[-1]+(y if relative else 0)]
        if upper=="M":
            current={"c":False,"v":[],"i":[],"o":[]};result.append(current);add(p);command="l" if relative else "L"
        elif upper=="C":
            c1=mapped([a[0]+(x if relative else 0),a[1]+(y if relative else 0)])
            c2=mapped([a[2]+(x if relative else 0),a[3]+(y if relative else 0)])
            last=current["v"][-1];current["o"][-1]=[c1[k]-last[k] for k in [0,1]]
            dest=mapped(p);add(p,[c2[k]-dest[k] for k in [0,1]])
        else:add(p)
        x,y=p
    return [c for c in result if c["v"]]


def vectors(page, indices):
    return [{"index":i,"curves":curves(n),"fill":n.get("fill"),"stroke":n.get("stroke"),"width":float(n.get("stroke-width","1")),"bounds":b}
            for i,(n,b) in enumerate(paints[page]) if i in indices and n.tag.endswith("}path")]


def chosen(page,box,colours):
    return {i for i,(n,b) in enumerate(paints[page]) if centre_inside(b,box) and colour(n).intersection(colours)}


art={"version":2,"flow":{},"neural":{},"faces":{},"near":{}}
for name,box,lights,lens in [("afferent",[44,136,180,216],{265,295,296},315),("reflex",[304,402,251,201],{976,1005,1042},1061)]:
    signals=chosen(0,box,SIGNALS)
    labels=set(range(1013,1029)) if name=="reflex" else set()
    pupils={966,1004} if name=="reflex" else set()
    offsets={}
    if name=="reflex":
        for i,(n,b) in enumerate(paints[0]):
            if n.tag.endswith('}use') and 410<b[1]<435 and 304<b[0]<555:
                if b[0]<370:offsets[i]=[23,-12]
                elif b[0]>490:offsets[i]=[-25,-12]
    export(name+"-unlit",0,box,remove=signals|lights|labels|pupils,offsets=offsets)
    export(name+"-illumination",0,box,only=lights)
    pool,shaft,retina = (296,295,265) if name=="afferent" else (1042,1005,976)
    for suffix,index in [("pool",pool),("shaft",shaft),("retina",retina)]:
        export(name+"-"+suffix,0,box,only={index})
    export(name+"-lens-off",0,box,only={lens})
    file=OUT/(name+"-lens-off.svg")
    file.write_text(file.read_text(encoding='utf-8').replace('fill="#ffffff"','fill="#242424"'),encoding='utf-8')
    art["neural"][name]={"box":box,"shaftBounds":paints[0][shaft][1],"signals":vectors(0,signals),"pupils":[{"bounds":paints[0][i][1]} for i in sorted(pupils)]}
export("reflex-direct-label",0,[304,402,251,201],only=set(range(1013,1019)))
export("reflex-consensual-label",0,[304,402,251,201],only=set(range(1019,1029)))

for name,x,blocks,left,right in [
    ("parasympathetic",233,[[259.875,165.048,106.993,20.272],[259.875,189.553,106.993,20.272],[259.875,214.058,106.993,20.272],[313.372,238.612,72.754,21.383]],[240.032,264.887,68.616,79.631],[313.825,264.858,72.754,79.660]),
    ("sympathetic",394,[[422.421,164.715,106.993,20.272],[422.421,189.220,106.993,20.272],[422.421,214.725,106.993,20.272],[422.099,239.300,106.993,20.272]],[401.727,264.769,68.616,79.631],[474.346,264.732,72.754,79.660])]:
    colours=SIGNALS|{"#3a005a"}
    export(name+"-heading",0,[x,136,160,22])
    for i,box in enumerate(blocks):export(f"{name}-box-{i}",0,box,clean=colours)
    export(name+"-motor",0,left,clean=colours)
    export(name+"-iris",0,right,clean=colours)
    radialbox=[right[0],274,right[2],48]
    art["flow"][name]={"boxes":blocks,"left":left,"right":right,"radial":vectors(0,chosen(0,radialbox,colours))}

# Each face has a stable device texture. The white pool and the illuminated
# face patch are independent, so neither the device nor the whole panel flashes.
specs=[
 ("consensual-left",[44,337,164,99],set(range(514,558)),{511,512,513},513,[64,395],[90.45,391.26],[163.29,392.36]),
 ("consensual-right",[44,437,164,101],set(range(586,630)),{583,584,585},585,[193,492],[161.06,489.83],[88.23,488.73]),
 ("swing",[217,337,165,201],set(range(668,713))|set(range(714,759)),{666,667,713},667,[235.5,428],[263.33,427.03],[336.16,428.13]),
 ("swing-normal",[391,337,164,101],set(range(792,836)),{789,790,791},791,[410,394],[436.88,391.51],[509.53,392.29]),
 ("swing-rapd",[391,439,164,99],set(range(864,908)),{861,862,863},863,[410,476],[438.5,473.8],[511.3,474.9])]
for name,box,devices,lights,pool,window,lit,other in specs:
    pupil_indices={i for p in geometry[name]["pupils"] for i in p["indices"]}
    extra={759,760,761,762} if name=="swing" else {913,914,920,921} if name.startswith("swing-") else set()
    export(name+"-face",1,box,remove=devices|lights|pupil_indices|extra,clean=GREEN|RED)
    device=set(range(668,713)) if name=="swing" else devices
    export(name+"-device",1,box,only=device)
    if name.startswith("consensual"):
        export(name+"-circle",1,box,only={i for i,(n,b) in enumerate(paints[1]) if n.get("stroke") in GREEN and centre_inside(b,box)})
    export(name+"-pool",1,[box[0]-35,box[1]-30,box[2]+70,box[3]+60],only={pool},unclip=True)
    art["faces"][name]={"box":box,"window":window,"lit":lit,"other":other,"poolBounds":paints[1][pool][1],"pupils":geometry[name]["pupils"]}
for name,box,ids in [("swing-arrow-right",[217,337,165,201],{759,760}),("swing-arrow-left",[217,337,165,201],{761,762}),("swing-normal-arrow",[391,337,164,101],{920,921}),("swing-rapd-arrow",[391,439,164,99],{913,914})]:
    export(name,1,box,only=ids)

top=[44,588,251,100];bottom=[44,689,251,99]
original_bottle={i for i,(n,b) in enumerate(paints[1]) if centre_inside(b,[67,626,15,26]) and b[2]-b[0]<20 and b[3]-b[1]<30}
export("near-distance-scene",1,top,remove={318,319,320,321}|original_bottle)
export("near-distance-bottle",1,top,only=original_bottle-{318,319})
export("near-distance-object",1,top,only={318,319})
export("near-distance-arrow",1,top,only={320,321})
hand=set(range(365,371))
export("near-target-scene",1,bottom,remove={478,479,480,481,482,483}|hand)
export("near-target-hand",1,bottom,only=hand)
export("near-target-highlight",1,bottom,only={478})
export("near-target-arrow-0",1,bottom,only={480,481})
export("near-target-arrow-1",1,bottom,only={482,483})
art["near"]["top"]={"box":top};art["near"]["bottom"]={"box":bottom}
for row,basey,white,iris,pupil_ids,target_iris,target_pupils in [
    (0,631,[99,100],[101,103],[102,104],[125,127],[126,128]),
    (1,698,[145,146],[147,149],[148,150],[169,171],[170,172])]:
    box=[313,basey,98,52]
    export(f"near-single-{row}",1,box,remove=set(iris+pupil_ids),clean=GREEN|RED,resolution=12)
    art["near"][str(row)]={"box":box,"eyes":[{"sclera":curves(paints[1][white[i]][0]),"iris":paints[1][iris[i]][1],"pupil":paints[1][pupil_ids[i]][1],"targetIris":[v-(108.027 if k%2==0 else 0) for k,v in enumerate(paints[1][target_iris[i]][1])],"targetPupil":paints[1][target_pupils[i]][1]} for i in range(2)]}
(OUT/"animation.json").write_text(json.dumps(art,indent=2),encoding="utf-8")
(OUT/"manifest.json").write_text(json.dumps(manifest,indent=2),encoding="utf-8")
(OUT/"geometry.json").write_text(json.dumps(geometry,indent=2),encoding="utf-8")
(OUT/"statuses.json").write_text(json.dumps(statuses,indent=2),encoding="utf-8")
(OUT/"source.json").write_text(json.dumps({"pdfSha256":hashlib.sha256(SOURCE.read_bytes()).hexdigest(),"pages":2,"paintCounts":[len(p) for p in paints]},indent=2),encoding="utf-8")
print(f"Separated {len(manifest)} Advanced artwork layers.")
