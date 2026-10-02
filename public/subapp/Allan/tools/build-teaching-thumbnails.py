"""Create small menu derivatives. Full-quality teaching assets remain untouched."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
destination = root / 'assets' / 'thumbnails'
destination.mkdir(exist_ok=True)
sources = ['abcde-su-preview', 'abcde-su-card', 'chaos', 'chaos-card', 'dpic-r_raised-bumps']
paths = [root / 'assets' / 'images' / f'{name}_{tone}.webp'
         for name in sources for tone in ('light', 'dark')]
paths += [root / 'dermoscopy-examples' / f'chaos-clues-{number:02}_{tone}.webp'
          for number in range(1, 6) for tone in ('light', 'dark')]
paths.append(root / 'assets' / 'images' / 'uv-reference.webp')
for source in paths:
    with Image.open(source) as image:
        image.thumbnail((120, 120), Image.Resampling.LANCZOS)
        image.save(destination / source.name, 'WEBP', quality=82, method=6)
print(f'Built {len(paths)} menu thumbnails; originals unchanged.')
