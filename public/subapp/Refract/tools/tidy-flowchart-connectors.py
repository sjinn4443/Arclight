from pathlib import Path
import xml.etree.ElementTree as ET

p=Path(__file__).resolve().parents[1]/'Refract-integrated-flowchart.drawio'
t=ET.parse(p)
cells={c.get('id'):c for c in t.findall('.//mxCell')}
for c in cells.values():
    if c.get('edge')=='1':
        c.set('style',c.get('style')+'endSize=14;')
# B leaves the left of the decision, not the Yes path below it.
g=cells['RELIABLE'].find('mxGeometry')
b=cells['route-out-B'].find('mxGeometry')
b.set('x',str(float(g.get('x'))-130))
b.set('y',str(float(g.get('y'))+float(g.get('height'))/2-22))
c=cells['edge-19']
c.set('style',c.get('style')+'exitX=0;exitY=0.5;entryX=1;entryY=0.5;jettySize=0;')
# Receiving B approaches from above, clear of the other incoming branch.
g=cells['RETAIN'].find('mxGeometry')
b=cells['route-in-B'].find('mxGeometry')
b.set('x',str(float(g.get('x'))+float(g.get('width'))/2-22))
b.set('y',str(float(g.get('y'))-90))
c=cells['route-return-B']
c.set('style',c.get('style')+'exitX=0.5;exitY=1;entryX=0.5;entryY=0;jettySize=0;')
ET.indent(t)
t.write(p,encoding='utf-8',xml_declaration=True)
print('B branches separated; arrowheads enlarged. No logical changes.')
