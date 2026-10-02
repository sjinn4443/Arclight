from pathlib import Path
import xml.etree.ElementTree as E
p=Path(__file__).resolve().parents[1]/'Refract-integrated-flowchart.drawio'
t=E.parse(p);r=t.find('.//root');c={x.get('id'):x for x in r}
def box(k):
    g=c[k].find('mxGeometry');return [float(g.get(a)) for a in ('x','y','width','height')]
def path(eid,target,ports,points):
    e=c[eid];e.set('target',target);e.attrib.pop('data-original-target',None)
    e.set('style','edgeStyle=none;noEdgeStyle=1;rounded=0;endArrow=block;endFill=1;endSize=14;strokeColor=#526171;strokeWidth=2;fontColor=#172635;fontSize=18;fontStyle=1;labelBackgroundColor=#ffffff;'+ports)
    g=e.find('mxGeometry')
    for v in list(g):g.remove(v)
    g.set('x','-0.8');g.set('y','0')
    a=E.SubElement(g,'Array',attrib={'as':'points'})
    for x,y in points:E.SubElement(a,'mxPoint',x=str(x),y=str(y))
    E.SubElement(g,'mxPoint',x='0',y='-18',attrib={'as':'offset'})
sx,sy,sw,sh=box('INVALID');tx,ty,tw,th=box('INPUT')
path('edge-3','INPUT','exitX=1;exitY=0.5;entryX=1;entryY=0.5;',[(2800,sy+sh/2),(2800,ty+th/2)])
sx,sy,sw,sh=box('RELIABLE');tx,ty,tw,th=box('RETAIN')
path('edge-19','RETAIN','exitX=0;exitY=0.5;entryX=0.5;entryY=1;',[(700,sy+sh/2),(700,ty+th+65),(tx+tw/2,ty+th+65)])
for k in ('A','B'):
    for prefix in ('route-out-','route-in-','route-return-'):
        if prefix+k in c:r.remove(c[prefix+k])
c['LEGEND'].set('value',c['LEGEND'].get('value').replace('A: correct entries and return. B: keep current Rx.','Follow continuous arrows; no lettered jumps.'))
E.indent(t);t.write(p,encoding='utf-8',xml_declaration=True)
