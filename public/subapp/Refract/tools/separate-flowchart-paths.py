"""Give bypasses distinct lanes and distinct destination ports, never shared edges."""
from pathlib import Path
import xml.etree.ElementTree as E
p=Path(__file__).resolve().parents[1]/'Refract-integrated-flowchart.drawio'
t=E.parse(p); root=t.find('.//root'); cells={c.get('id'):c for c in root}
def box(k):
    g=cells[k].find('mxGeometry')
    return tuple(float(g.get(a)) for a in ('x','y','width','height'))
def route(e,target,lane,level,port):
    sx,sy,sw,sh=box(e.get('source')); tx,ty,tw,th=box(target)
    e.set('target',target)
    e.set('style',f'edgeStyle=none;noEdgeStyle=1;rounded=0;endArrow=block;endFill=1;endSize=14;strokeColor=#526171;strokeWidth=2;exitX={0 if lane<sx else 1};exitY=0.5;entryX={port};entryY=0;')
    g=e.find('mxGeometry')
    for item in list(g):g.remove(item)
    a=E.SubElement(g,'Array',attrib={'as':'points'})
    for x,y in [(lane,sy+sh/2),(lane,level),(tx+tw*port,level)]:
        E.SubElement(a,'mxPoint',x=str(x),y=str(y))
if cells['DISTANCE'].find('mxGeometry').get('y')=='3690':
    # Open a dedicated routing band without squeezing the existing decisions.
    for c in root:
        g=c.find('mxGeometry')
        if c.get('vertex')=='1' and float(g.get('y','0'))>=3690:
            g.set('y',str(float(g.get('y'))+220))
        elif c.get('edge')=='1':
            for q in g.findall('Array/mxPoint'):
                if float(q.get('y','0'))>=3690:q.set('y',str(float(q.get('y'))+220))
for target in ('DISTANCE','COMBINE'):
    tx,ty,tw,th=box(target)
    edges=[e for e in root if e.get('target')=='merge-'+target]
    for left in (True,False):
        group=sorted([e for e in edges if (box(e.get('source'))[0]<tx)==left],key=lambda e:box(e.get('source'))[1])
        for i,e in enumerate(group):
            # Earlier paths wrap outside later paths. Landing ports never coincide.
            lane=(-240+100*i) if left else (3050-100*i)
            port=(0.10+0.13*i) if left else (0.90-0.13*i)
            route(e,target,lane,ty-45-50*i,port)
    for k in ('merge-'+target,'merged-'+target):
        if k in cells:root.remove(cells[k])
# Short side branches get their own inner port, clear of the outside bypasses.
for eid,target in [('edge-35','DISTANCE'),('edge-54','COMBINE')]:
    e=cells[eid]; sx,sy,sw,sh=box(e.get('source'));tx,ty,tw,th=box(target)
    e.set('target',target)
    e.set('style','edgeStyle=none;noEdgeStyle=1;rounded=0;endArrow=block;endFill=1;endSize=14;strokeColor=#526171;strokeWidth=2;exitX=0.5;exitY=1;entryX=0.64;entryY=0;')
    g=e.find('mxGeometry')
    for item in list(g):g.remove(item)
    a=E.SubElement(g,'Array',attrib={'as':'points'})
    level=ty-(85 if target=='COMBINE' else 190)
    for x,y in [(sx+sw/2,level),(tx+tw*.64,level)]:E.SubElement(a,'mxPoint',x=str(x),y=str(y))
E.indent(t);t.write(p,encoding='utf-8',xml_declaration=True)
print('Separated bypass lanes and top-entry ports; removed shared merge segments.')
