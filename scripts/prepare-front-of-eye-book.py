"""Square the four eversion panels in a temporary copy of the source PDF.

Only the rounded outer panel paths are changed. Original vector artwork and
internal anatomical clipping paths are retained; the source PDF stays intact.
Requires pypdf (set BOOK_PYTHON when invoking the asset builder if needed).
"""
import sys
from pypdf import PdfWriter
from pypdf.generic import ContentStream, FloatObject

writer = PdfWriter(clone_from=sys.argv[1])
page = writer.pages[0]
stream = ContentStream(page.get_contents(), writer)
targets = [
    (368.122, 108.793, 461.506, 173.586),
    (461.506, 108.793, 554.889, 173.586),
    (368.122, 44.0, 461.154, 108.528),
    (461.506, 44.0, 554.889, 108.793),
    (368.122, 44.0, 554.889, 173.586),
]
matrix = (1, 0, 0, 1, 0, 0)
stack = []
path_start = 0
points = []
curves = False
replacements = []

for i, (args, op) in enumerate(stream.operations):
    if op == b"q":
        stack.append(matrix)
    elif op == b"Q":
        matrix = stack.pop()
    elif op == b"cm":
        A, B, C, D, E, F = map(float, args)
        a, b, c, d, e, f = matrix
        matrix = (a*A+c*B, b*A+d*B, a*C+c*D, b*C+d*D, a*E+c*F+e, b*E+d*F+f)
    elif op in (b"m", b"l", b"c", b"v", b"y", b"re"):
        if not points:
            path_start = i
        values = list(map(float, args))
        if op == b"re":
            x, y, w, h = values
            values = [x, y, x+w, y+h]
        points.extend(zip(values[::2], values[1::2]))
        curves = curves or op in (b"c", b"v", b"y")
    elif op in (b"W", b"W*", b"n", b"f", b"f*", b"S", b"s", b"B", b"B*", b"b", b"b*"):
        if points and curves and i-path_start <= 15:
            a, b, c, d, e, f = matrix
            transformed = [(a*x+c*y+e, b*x+d*y+f) for x, y in points]
            bounds = (min(x for x,y in transformed), min(y for x,y in transformed),
                      max(x for x,y in transformed), max(y for x,y in transformed))
            if any(all(abs(v-t) < 0.015 for v,t in zip(bounds, target)) for target in targets):
                x0, y0 = min(x for x,y in points), min(y for x,y in points)
                x1, y1 = max(x for x,y in points), max(y for x,y in points)
                replacements.append((path_start, i, ([FloatObject(v) for v in (x0,y0,x1-x0,y1-y0)], b"re")))
        if op not in (b"W", b"W*"):
            points = []
            curves = False
        else:
            # The following n only terminates this same clipping path.
            points = []
            curves = False

if len(replacements) < 20:
    raise RuntimeError(f"Expected rounded eversion paths; found only {len(replacements)}")
for start, end, rect in reversed(replacements):
    stream.operations[start:end] = [rect]
page.replace_contents(stream)
with open(sys.argv[2], "wb") as output:
    writer.write(output)
print(f"Squared {len(replacements)} vector panel paths.")
