from pathlib import Path
import xml.etree.ElementTree as ET

p=Path(__file__).resolve().parents[1]/'Refract-integrated-flowchart.drawio'
t=ET.parse(p); root=t.find('.//root')
cells={c.get('id'):c for c in root}
def rect(k):
    g=cells[k].find('mxGeometry')
    return [float(g.get(a)) for a in ('x','y','width','height')]
def route(e,ports,points=()):
    e.set('style','edgeStyle=none;noEdgeStyle=1;rounded=0;html=0;endArrow=block;endFill=1;endSize=14;strokeColor=#526171;strokeWidth=2;fontColor=#172635;fontSize=18;fontStyle=1;labelBackgroundColor=#ffffff;'+ports)
    g=e.find('mxGeometry')
    for c in list(g):g.remove(c)
    if points:
        a=ET.SubElement(g,'Array',attrib={'as':'points'})
        for x,y in points:ET.SubElement(a,'mxPoint',x=str(x),y=str(y))
    if e.get('value'):
        g.set('x','-0.65');g.set('y','0')
        ET.SubElement(g,'mxPoint',x='0',y='-22',attrib={'as':'offset'})

# Retain only A (correct entries) and B (return to current Rx).
# All distance/add bypasses become continuous outside paths.
groups={}
for e in list(root):
    target=e.get('data-original-target')
    if target not in ('DISTANCE','COMBINE'):continue
    groups.setdefault(target,[]).append(e)
for target,edges in groups.items():
    tx,ty,tw,th=rect(target)
    merge_id='merge-'+target
    merge_y=ty-35
    m=ET.SubElement(root,'mxCell',id=merge_id,value='',vertex='1',parent='1',style='ellipse;fillColor=#526171;strokeColor=#526171;')
    ET.SubElement(m,'mxGeometry',x=str(tx+tw/2-5),y=str(merge_y-5),width='10',height='10',attrib={'as':'geometry'})
    for i,e in enumerate(edges):
        old=e.get('target');letter=old.removeprefix('route-out-')
        for k in (old,'route-in-'+letter,'route-return-'+letter):
            if k in cells:root.remove(cells[k])
        sx,sy,sw,sh=rect(e.get('source'))
        left=sx<tx
        lane=-160-i*65 if left else 2850+i*65
        startx=sx if left else sx+sw
        # Separate approach levels keep the convergence legible.
        approach=merge_y-15-i*9
        e.set('target',merge_id)
        e.attrib.pop('data-original-target',None)
        route(e,('exitX=0;' if left else 'exitX=1;')+'exitY=0.5;entryX=0.5;entryY=0;',[(lane,sy+sh/2),(lane,approach),(tx+tw/2,approach)])
    e=ET.SubElement(root,'mxCell',id='merged-'+target,value='',edge='1',parent='1',source=merge_id,target=target)
    ET.SubElement(e,'mxGeometry',relative='1',attrib={'as':'geometry'})
    route(e,'exitX=0.5;exitY=1;entryX=0.5;entryY=0;')

# More room for Correct before continuation A.
sx,sy,sw,sh=rect('INVALID')
cells['route-out-A'].find('mxGeometry').set('y',str(sy+sh+110))
route(cells['edge-3'],'exitX=0.5;exitY=1;entryX=0.5;entryY=0;')
cells['edge-3'].find('mxGeometry').find('mxPoint').set('x','48')
cells['edge-3'].find('mxGeometry').find('mxPoint').set('y','0')
# Yes leaves right; No leaves downward, each in one straight segment.
sx,sy,sw,sh=rect('PRECISE')
g=cells['FIRSTCAUTIOUS'].find('mxGeometry');g.set('y',str(sy+sh/2-float(g.get('height'))/2))
g=cells['FIRST'].find('mxGeometry');g.set('x',str(sx+sw/2-float(g.get('width'))/2))
route(cells['edge-16'],'exitX=1;exitY=0.5;entryX=0;entryY=0.5;')
route(cells['edge-17'],'exitX=0.5;exitY=1;entryX=0.5;entryY=0;')
off=cells['edge-17'].find('mxGeometry').find('mxPoint');off.set('x','25');off.set('y','0')
legend=cells['LEGEND'];legend.set('value',legend.get('value').replace('Matching letters continue the same path.','A: correct entries and return. B: keep current Rx.'))
ET.indent(t);t.write(p,encoding='utf-8',xml_declaration=True)
print('Removed eight continuation pairs; added two explicit merge points. A/B only remain.')
