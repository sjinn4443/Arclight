from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "images" / "discs" / "Pys_disc"
IMAGE_DIR = ROOT / "assets" / "images" / "discs"
CHECK_DIR = ROOT / "tools" / "generated-checks"
CONTACT_SHEET = CHECK_DIR / "phys-disc-case-contact-sheet.png"
TARGET_SIZE = (2915, 2834)
THUMB_SIZE = (480, 360)
CASE_IMAGE_SCALE = 0.52
BORDER_SAMPLE_PX = 36
EDGE_FEATHER_PX = 32
BACKGROUND_BLUR_PX = 58
BACKGROUND_TEXTURE_BLEND = 0.42


PHYS_DISC_CASES = [
    ("01", "phys-01", "01.png", "01_d.png"),
    ("03", "phys-03", "03.png", "03_d.png"),
    ("05", "phys-05", "05.png", "05_d.png"),
    ("07", "phys-07", "07.png", "07_d.png"),
    ("a", "phys-a", "a.png", "a_d.png"),
    ("b", "phys-b", "b.png", "b_d.png"),
    ("c", "phys-c", "c.png", "c_d.png"),
    ("d", "phys-d", "d.png", "d_d.png"),
    ("e", "phys-e", "e.png", "e_d.png"),
    ("f", "phys-f", "f.png", "f_d.png"),
    ("tilt", "phys-tilt", "tilt.png", "tild_d.png"),
]


def resize_to_cover(image: Image.Image, target_size: tuple[int, int]) -> Image.Image:
    image = image.convert("RGB")
    target_width, target_height = target_size
    scale = max(target_width / image.width, target_height / image.height)
    resized_size = (
        max(1, round(image.width * scale)),
        max(1, round(image.height * scale)),
    )
    image = image.resize(resized_size, Image.Resampling.LANCZOS)
    left = (image.width - target_width) // 2
    top = (image.height - target_height) // 2
    return image.crop((left, top, left + target_width, top + target_height))


def edge_extended_background(tile: Image.Image, target_size: tuple[int, int]) -> Image.Image:
    tile = tile.convert("RGB")
    target_width, target_height = target_size
    origin_x = (target_width - tile.width) // 2
    origin_y = (target_height - tile.height) // 2
    background = Image.new("RGB", target_size)
    border = min(BORDER_SAMPLE_PX, tile.width // 2, tile.height // 2)
    right_x = origin_x + tile.width
    bottom_y = origin_y + tile.height

    background.paste(tile, (origin_x, origin_y))

    if origin_x > 0:
        left = tile.crop((0, 0, border, tile.height)).resize((origin_x, tile.height), Image.Resampling.BICUBIC)
        background.paste(left, (0, origin_y))
    if right_x < target_width:
        right = tile.crop((tile.width - border, 0, tile.width, tile.height)).resize(
            (target_width - right_x, tile.height),
            Image.Resampling.BICUBIC,
        )
        background.paste(right, (right_x, origin_y))
    if origin_y > 0:
        top = tile.crop((0, 0, tile.width, border)).resize((tile.width, origin_y), Image.Resampling.BICUBIC)
        background.paste(top, (origin_x, 0))
    if bottom_y < target_height:
        bottom = tile.crop((0, tile.height - border, tile.width, tile.height)).resize(
            (tile.width, target_height - bottom_y),
            Image.Resampling.BICUBIC,
        )
        background.paste(bottom, (origin_x, bottom_y))

    if origin_x > 0 and origin_y > 0:
        corner = tile.crop((0, 0, border, border)).resize((origin_x, origin_y), Image.Resampling.BICUBIC)
        background.paste(corner, (0, 0))
    if right_x < target_width and origin_y > 0:
        corner = tile.crop((tile.width - border, 0, tile.width, border)).resize(
            (target_width - right_x, origin_y),
            Image.Resampling.BICUBIC,
        )
        background.paste(corner, (right_x, 0))
    if origin_x > 0 and bottom_y < target_height:
        corner = tile.crop((0, tile.height - border, border, tile.height)).resize(
            (origin_x, target_height - bottom_y),
            Image.Resampling.BICUBIC,
        )
        background.paste(corner, (0, bottom_y))
    if right_x < target_width and bottom_y < target_height:
        corner = tile.crop((tile.width - border, tile.height - border, tile.width, tile.height)).resize(
            (target_width - right_x, target_height - bottom_y),
            Image.Resampling.BICUBIC,
        )
        background.paste(corner, (right_x, bottom_y))

    return background


def feather_mask(size: tuple[int, int], feather_px: int) -> Image.Image:
    width, height = size
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    inset = max(1, feather_px)
    draw.rectangle((inset, inset, width - inset - 1, height - inset - 1), fill=255)
    return mask.filter(ImageFilter.GaussianBlur(feather_px / 2))


def border_colour(tile: Image.Image) -> tuple[int, int, int]:
    tile = tile.convert("RGB")
    border = min(BORDER_SAMPLE_PX, tile.width // 2, tile.height // 2)
    strips = [
        tile.crop((0, 0, tile.width, border)),
        tile.crop((0, tile.height - border, tile.width, tile.height)),
        tile.crop((0, 0, border, tile.height)),
        tile.crop((tile.width - border, 0, tile.width, tile.height)),
    ]
    pixels: list[tuple[int, int, int]] = []
    for strip in strips:
        pixels.extend(strip.resize((40, 40), Image.Resampling.BOX).getdata())
    return tuple(int(sorted(pixel[channel] for pixel in pixels)[len(pixels) // 2]) for channel in range(3))


def blended_retina_background(tile: Image.Image) -> Image.Image:
    solid = Image.new("RGB", TARGET_SIZE, border_colour(tile))
    texture = edge_extended_background(tile, TARGET_SIZE).filter(ImageFilter.GaussianBlur(BACKGROUND_BLUR_PX))
    return Image.blend(solid, texture, BACKGROUND_TEXTURE_BLEND)


def extend_on_retina_background(image: Image.Image) -> Image.Image:
    image = image.convert("RGB").transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    image = image.resize(
        (
            max(1, round(image.width * CASE_IMAGE_SCALE)),
            max(1, round(image.height * CASE_IMAGE_SCALE)),
        ),
        Image.Resampling.LANCZOS,
    )
    background = blended_retina_background(image)
    paste_xy = (
        (TARGET_SIZE[0] - image.width) // 2,
        (TARGET_SIZE[1] - image.height) // 2,
    )
    background.paste(image, paste_xy, feather_mask(image.size, EDGE_FEATHER_PX))
    return background


def save_thumb(image: Image.Image, output: Path) -> None:
    thumb = image.convert("RGB").transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    thumb = resize_to_cover(thumb, THUMB_SIZE)
    thumb.save(output, "WEBP", quality=86, method=6)


def save_contact_sheet(images: list[tuple[str, Image.Image]]) -> None:
    CHECK_DIR.mkdir(parents=True, exist_ok=True)
    columns = 4
    tile_width = 220
    tile_height = 214
    label_height = 22
    gap = 18
    rows = (len(images) + columns - 1) // columns
    sheet_width = columns * tile_width + (columns + 1) * gap
    sheet_height = rows * (tile_height + label_height) + (rows + 1) * gap
    sheet = Image.new("RGB", (sheet_width, sheet_height), "white")
    draw = ImageDraw.Draw(sheet)

    for index, (name, image) in enumerate(images):
        row, column = divmod(index, columns)
        x = gap + column * (tile_width + gap)
        y = gap + row * (tile_height + label_height + gap)
        preview = resize_to_cover(image, (tile_width, tile_height))
        sheet.paste(preview, (x, y))
        draw.text((x, y + tile_height + 5), name, fill=(0, 0, 0))

    sheet.save(CONTACT_SHEET)


def main() -> None:
    converted: list[tuple[str, Image.Image]] = []

    for _, output_stem, light_name, dark_name in PHYS_DISC_CASES:
        light_source = SOURCE_DIR / light_name
        dark_source = SOURCE_DIR / dark_name
        if not light_source.exists():
            raise FileNotFoundError(light_source)
        if not dark_source.exists():
            raise FileNotFoundError(dark_source)

        light = Image.open(light_source).convert("RGB")
        dark = Image.open(dark_source).convert("RGB")

        light_output = extend_on_retina_background(light)
        dark_output = extend_on_retina_background(dark)

        light_path = IMAGE_DIR / f"{output_stem}.webp"
        dark_path = IMAGE_DIR / f"{output_stem}_dark.webp"
        thumb_path = IMAGE_DIR / f"{output_stem}_thumb.webp"

        light_output.save(light_path, "WEBP", quality=94, method=6)
        dark_output.save(dark_path, "WEBP", quality=94, method=6)
        save_thumb(light, thumb_path)

        converted.append((light_path.name, light_output))
        print(f"{light_name} -> {light_path.name}: {light_output.size}")
        print(f"{dark_name} -> {dark_path.name}: {dark_output.size}")

    save_contact_sheet(converted)
    print(f"contact sheet -> {CONTACT_SHEET}")


if __name__ == "__main__":
    main()
