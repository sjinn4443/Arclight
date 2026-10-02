from pathlib import Path
import xml.etree.ElementTree as ET

p = Path(__file__).resolve().parents[1] / 'Refract-integrated-flowchart.drawio'
t = ET.parse(p)
cells = {c.get('id'): c for c in t.find('.//root')}
for c in cells.values():
    if not c.get('target', '').startswith('merge-'):
        continue
    source = cells[c.get('source')].find('mxGeometry')
    points = c.find('mxGeometry/Array')
    points[0].set('y', str(float(source.get('y')) + float(source.get('height')) / 2))
    # Continuous merge paths need only the single arrow after the junction.
    c.set('style', c.get('style').replace('endArrow=block;', 'endArrow=none;'))
ET.indent(t)
t.write(p, encoding='utf-8', xml_declaration=True)
