from pathlib import Path
import xml.etree.ElementTree as E
p=Path(__file__).resolve().parents[1]/'Refract-integrated-flowchart.drawio'
t=E.parse(p);c={n.get('id'):n for n in t.find('.//root')}
for k in ('edge-27','edge-31'):
    e=c[k];s=c[e.get('source')].find('mxGeometry');d=c[e.get('target')].find('mxGeometry')
    sx=float(s.get('x'))+float(s.get('width'))/2
    dx=float(d.get('x'))+float(d.get('width'))*.8
    level=(float(s.get('y'))+float(s.get('height'))+float(d.get('y')))/2
    e.set('style','edgeStyle=none;noEdgeStyle=1;rounded=0;endArrow=block;endFill=1;endSize=14;strokeColor=#526171;strokeWidth=2;exitX=0.5;exitY=1;entryX=0.8;entryY=0;')
    g=e.find('mxGeometry')
    for n in list(g):g.remove(n)
    a=E.SubElement(g,'Array',attrib={'as':'points'})
    for x,y in [(sx,level),(dx,level)]:E.SubElement(a,'mxPoint',x=str(x),y=str(y))
E.indent(t);t.write(p,encoding='utf-8',xml_declaration=True)
assert not any(k.startswith('route-') for k in c)
assert not any(k.startswith('merge') for k in c)
assert all(e.get('source') in c and e.get('target') in c for e in c.values() if e.get('edge')=='1')
print('No lettered continuations or shared merge edges; all edge endpoints valid.')
