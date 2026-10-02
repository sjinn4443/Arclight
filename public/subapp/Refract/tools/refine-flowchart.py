"""Narrow presentation refinement; node IDs and decision connections stay intact."""
from pathlib import Path
import xml.etree.ElementTree as ET
from html import escape

p = Path(__file__).resolve().parents[1] / 'Refract-integrated-flowchart.drawio'
t = ET.parse(p)
r = t.find('.//root')
cells = {c.get('id'): c for c in r}
copy = {
'START': 'Patient assessment',
'INPUT': 'Both eyes: current Rx + measured refraction\nAge · health · reliability · wearer preferences\nCurrent VA · current/measured add',
'VALID': 'Cylinder and axis\nentries valid?',
'INVALID': 'Complete entries\nNo Rx yet',
'NORMAL': 'Convert to minus cylinder\nCheck discrepancy before Simple conversion',
'MODE': 'Simple or Advanced?',
'SE': 'Simple: S + C/2\nRound to 0.25 D',
'FULL': 'Advanced: retain S / C / axis',
'BIG': 'Large Rx discrepancy\nin either eye?',
'HOLDPAIR': 'Keep both current Rx\nReview: should one eye hold both?',
'EYE': 'Apply the same patient context to each eye',
'OBJECTIVE': 'Measured sphere\navailable?',
'RETAIN': 'Keep current Rx\nOtherwise leave blank',
'CURRENT': 'Current glasses?',
'PRECISE': 'Precise / demanding\nwearer?',
'FIRSTCAUTIOUS': 'Reduce |S| and |C| by 0.25 D\nReview: personality alone?',
'FIRST': 'Use measured Rx\nProvisional if unconfirmed',
'RELIABLE': 'Measurement\nconfirmed?',
'VA': 'Good current VA?',
'VAHOLD': 'Keep current Rx\nReview: absolute hold?',
'WEIGHT': 'Weight the change\nPrecise wearer → favour current Rx\nReliable measurement → favour change',
'SPHERE': 'Weighted sphere change\nCap: precise 0.25 D · flexible 0.50 D',
'YOUNG': 'Age <40 and\nS gap ≥0.50 D?',
'YSTEP': 'Halfway towards measured S\nRound 0.25 D; cap 0.50 D\nEither |S| ≥6 D: cap 0.25 D\nReview: age cut-off',
'CYL': 'Weighted cylinder change\nConfirmed C: retain target; otherwise soften 0.25 D\nStep cap: 0.75 D',
'NEWCYL': 'Age <40; current C = 0;\nmeasured |C| ≥0.50 D;\nstill no C introduced?',
'INTRO': 'Trial −0.25 D cylinder\nMeasured axis rounded to 5°',
'AXIS': 'Compromise on axis\nUse angular gap, |C| and corroboration',
'HIGH': 'Current |C| ≥1.75 D;\nC retained; axis gap ≤5°?',
'KEEPAXIS': 'Keep current axis exactly',
'DISTANCE': 'Combine RE + LE distance Rx\nCarry forward review flags',
'OLDADD': 'Current add entered?',
'KEEPADD': 'Keep current add\nReview: priority over measured add?',
'MEASURED': 'Measured add entered?',
'USEADD': 'Use measured add',
'AGE': 'Age known and ≥46?',
'BLANKADD': 'Leave add blank',
'AGEADD': 'Age-based add (D)\n46–51: 1.25 · 52–55: 1.50 · 56–59: 1.75\n60–68: 2.25 · 69–77: 2.50 · 78+: 2.75',
'HEALTH': 'Frailty modifier?',
'EXTRA': 'Add +0.25 D to estimate\nHeuristic: review',
'COMBINE': 'Proposed prescription\nRE + LE: S / C / axis · reading add\nApplied rules + review flags',
'END': 'Prescriber reviews the whole Rx',
'LEGEND': 'REFRACT — RULE REVIEW\n30 September 2026 · editable working chart\nAmber: decision · blue: action · red: review · green: result\nMatching letters continue the same path.\nS: sphere · C: cylinder · Rx: prescription\nNot a clinically approved protocol or a live link to the app.'
}
for key, value in copy.items():
    c=cells[key]
    lines=value.split('\n')
    c.set('value','<b>'+escape(lines[0])+'</b>'+''.join('<br>'+('<i>'+escape(x)+'</i>' if x.startswith(('Review:','Heuristic:','Provisional','Not a ')) else escape(x)) for x in lines[1:]))
    style=c.get('style').replace('html=0','html=1')
    c.set('style',style+'strokeWidth=2.5;')

# Side branches must meet at the same height: no tiny orthogonal steps.
for e in list(r):
    if e.get('edge')!='1': continue
    s,d=cells[e.get('source')],cells[e.get('target')]
    sg,dg=s.find('mxGeometry'),d.find('mxGeometry')
    if 'rhombus' in s.get('style','') and 'exitY=0.5' in e.get('style',''):
        dg.set('y',str(float(sg.get('y'))+float(sg.get('height'))/2-float(dg.get('height'))/2))
    style=e.get('style')
    if e.get('value'):
        # Put the label above the stroke instead of masking a section of it.
        style=style.replace('labelBorderColor=#ffffff;','')
        g=e.find('mxGeometry'); g.set('x','-0.5'); g.set('y','0')
        for child in list(g):
            if child.get('as')=='offset': g.remove(child)
        horizontal='exitY=0.5' in style
        ET.SubElement(g,'mxPoint',x='0' if horizontal else '24',y='-18' if horizontal else '0',attrib={'as':'offset'})
    e.set('style',style)
ET.indent(t)
t.write(p,encoding='utf-8',xml_declaration=True)
print('Shortened 43 labels, strengthened outlines and aligned side branches. Connections unchanged.')
