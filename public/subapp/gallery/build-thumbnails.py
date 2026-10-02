"""Resize fresh browser captures to the established contact-sheet thumbnail size."""
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
captures = root / 'output/playwright/gallery-handover-20260930'
manifest = json.loads((root / 'gallery/apps.json').read_text(encoding='utf-8'))
for app in manifest['apps']:
    with Image.open(captures / (app['slug'] + '.png')) as image:
        assert image.size == (360, 740), (app['title'], image.size)
        image.convert('RGB').resize((180, 370), Image.Resampling.LANCZOS).save(
            root / 'gallery' / app['thumbnail'], 'WEBP', quality=85, method=6)
print('Refreshed all 15 WebP thumbnails at 180 x 370.')
