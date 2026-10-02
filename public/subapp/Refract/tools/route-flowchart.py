"""Presentation-only routing of the editable prescribing overview."""
from pathlib import Path
import xml.etree.ElementTree as ET

path = Path(__file__).resolve().parents[1] / 'Refract-integrated-flowchart.drawio'
tree = ET.parse(path)
model = tree.find('.//mxGraphModel')
model.set('grid', '0')
model.set('background', '#ffffff')
root = model.find('root')
nodes = {c.get('id'): c for c in root if c.get('vertex') == '1'}
edges = [c for c in root if c.get('edge') == '1']
original = [(e.get('source'), e.get('target'), e.get('value')) for e in edges]

def box(key):
    g = nodes[key].find('mxGeometry')
    return tuple(float(g.get(k)) for k in ('x', 'y', 'width', 'height'))

def circle(key, label, x, y):
    c = ET.SubElement(root, 'mxCell', id=key, value=label, vertex='1', parent='1',
        style='ellipse;whiteSpace=wrap;html=0;fillColor=#ffffff;strokeColor=#526171;strokeWidth=2;fontSize=18;fontStyle=1;fontColor=#172635;')
    ET.SubElement(c, 'mxGeometry', x=str(x), y=str(y), width='44', height='44', attrib={'as':'geometry'})
    nodes[key] = c

def route(e):
    sx,sy,sw,sh = box(e.get('source'))
    tx,ty,tw,th = box(e.get('target'))
    cx,cy = sx+sw/2,sy+sh/2
    dx,dy = tx+tw/2,ty+th/2
    if abs(cx-dx)<2:
        ports='exitX=0.5;exitY=1;entryX=0.5;entryY=0;'
    elif abs(cy-dy)<100:
        ports=('exitX=1;exitY=0.5;entryX=0;entryY=0.5;' if dx>cx else 'exitX=0;exitY=0.5;entryX=1;entryY=0.5;')
    else:
        ports='exitX=0.5;exitY=1;entryX=0.5;entryY=0;'
    e.set('style','edgeStyle=orthogonalEdgeStyle;rounded=0;html=0;endArrow=block;endFill=1;strokeColor=#526171;strokeWidth=2;fontColor=#172635;fontSize=18;fontStyle=1;labelBackgroundColor=#ffffff;labelBorderColor=#ffffff;jettySize=24;'+ports)
    g=e.find('mxGeometry')
    for child in list(g): g.remove(child)
    if e.get('value'):
        g.set('x','-0.65')
        g.set('y','18')

# Long bypasses use conventional paired on-page connectors, not crossing wires.
long_edges=[]
for e in edges:
    sx,sy,sw,sh=box(e.get('source')); tx,ty,tw,th=box(e.get('target'))
    if abs(ty-sy)>500 or ty<sy:
        long_edges.append(e)

for i,e in enumerate(long_edges):
    label=chr(65+i)
    source,target=e.get('source'),e.get('target')
    sx,sy,sw,sh=box(source)
    tx,ty,tw,th=box(target)
    out_id='route-out-'+label; in_id='route-in-'+label
    circle(out_id,label,sx+sw/2-22,sy+sh+50)
    # Separate receiving connectors across the destination's upper approach.
    peers=[p for p in long_edges[:i] if p.get('data-original-target')==target]
    px=tx-110-80*len(peers) if sx<tx else tx+tw+70+80*len(peers)
    circle(in_id,label,px,ty+th/2-22)
    e.set('data-original-target',target)
    e.set('target',out_id)
    new=ET.SubElement(root,'mxCell',id='route-return-'+label,value='',edge='1',parent='1',source=in_id,target=target)
    ET.SubElement(new,'mxGeometry',relative='1',attrib={'as':'geometry'})
    route(new)

for e in edges: route(e)
legend=nodes['LEGEND']
legend.set('value',legend.get('value')+'\nMatching letter circles continue the same path without crossing wires.')
legend.find('mxGeometry').set('height','260')
assert len(edges)==len(original)
for e,(s,t,v) in zip(edges,original):
    assert e.get('source')==s and e.get('value')==v
    assert e.get('data-original-target',e.get('target'))==t
ET.indent(tree)
tree.write(path,encoding='utf-8',xml_declaration=True)
print(f'Preserved {len(edges)} logical connections; replaced {len(long_edges)} long crossing wires with paired connectors.')
