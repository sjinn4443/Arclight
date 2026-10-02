from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "tools" / "disc-image-sources"
IMAGE_DIR = ROOT / "assets" / "images" / "discs"
CHECK_DIR = ROOT / "tools" / "generated-checks"
CONTACT_SHEET = CHECK_DIR / "numbered-disc-case-contact-sheet.png"
TARGET_SIZE = (2915, 2834)
THUMB_SIZE = (480, 360)
EDGE_FEATHER_PX = 48
CASE_IMAGE_SCALE = 1.75


FLIP_TO_RIGHT_EYE_STEMS = {
    "1d",
    "1d_dark",
    "2d",
    "2d_dark",
    "4d",
    "4d_dark",
    "5d",
    "5d_dark",
    "6d",
    "6d_dark",
    "9d",
    "9d_dark",
}


def numbered_sources() -> list[Path]:
    return sorted(SOURCE_DIR.glob("[1-9]d*.png"), key=lambda p: (int(p.name[0]), "_dark" in p.stem))


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


def feather_mask(size: tuple[int, int], feather_px: int) -> Image.Image:
    width, height = size
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    inset = max(1, feather_px)
    draw.rectangle((inset, inset, width - inset - 1, height - inset - 1), fill=255)
    return mask.filter(ImageFilter.GaussianBlur(feather_px / 2))


def extend_on_retina_background(image: Image.Image) -> Image.Image:
    image = image.convert("RGB")
    background = resize_to_cover(image, TARGET_SIZE).filter(ImageFilter.GaussianBlur(28))
    background = background.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
    image = image.resize(
        (
            max(1, round(image.width * CASE_IMAGE_SCALE)),
            max(1, round(image.height * CASE_IMAGE_SCALE)),
        ),
        Image.Resampling.LANCZOS,
    )
    paste_xy = (
        (TARGET_SIZE[0] - image.width) // 2,
        (TARGET_SIZE[1] - image.height) // 2,
    )
    background.paste(image, paste_xy, feather_mask(image.size, EDGE_FEATHER_PX))
    return background


def case_output_path(source: Path) -> Path:
    case_number = int(source.name[0])
    suffix = "_dark" if source.stem.endswith("_dark") else ""
    return IMAGE_DIR / f"case-{case_number:02d}{suffix}.webp"


def save_thumb(image: Image.Image, output: Path) -> None:
    thumb = resize_to_cover(image, THUMB_SIZE)
    thumb.save(output, "WEBP", quality=86, method=6)


def save_contact_sheet(images: list[tuple[str, Image.Image]]) -> None:
    CHECK_DIR.mkdir(parents=True, exist_ok=True)
    columns = 4
    tile_width = 160
    tile_height = 156
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
        preview = image.copy()
        preview.thumbnail((tile_width, tile_height), Image.Resampling.LANCZOS)
        sheet.paste(preview, (x + (tile_width - preview.width) // 2, y + (tile_height - preview.height) // 2))
        draw.text((x, y + tile_height + 5), name, fill=(0, 0, 0))

    sheet.save(CONTACT_SHEET)


def main() -> None:
    converted: list[tuple[str, Image.Image]] = []

    for source in numbered_sources():
        image = Image.open(source).convert("RGB")
        flipped = source.stem in FLIP_TO_RIGHT_EYE_STEMS
        if flipped:
            image = image.transpose(Image.Transpose.FLIP_LEFT_RIGHT)

        thumb_source = image.copy()
        output = extend_on_retina_background(image)
        output_path = case_output_path(source)
        output.save(output_path, "WEBP", quality=94, method=6)
        if not output_path.stem.endswith("_dark"):
            save_thumb(thumb_source, output_path.with_name(f"{output_path.stem}_thumb.webp"))
        converted.append((output_path.name, output))
        print(f"{source.name} -> {output_path.name}: {output.size}, flipped={flipped}")

    save_contact_sheet(converted)
    print(f"contact sheet -> {CONTACT_SHEET}")


if __name__ == "__main__":
    main()
