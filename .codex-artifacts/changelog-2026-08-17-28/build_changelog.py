from __future__ import annotations

import hashlib
import os
import shutil
import tempfile
import zipfile
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path

from lxml import etree


REFERENCE = Path(r"C:\Users\young\Downloads\15 - 19 June.docx")
OUTPUT = Path(r"D:\Arclight\Arclight_App_NewApp_ChatRefact\Arclight_App\17 - 28 August.docx")
EXPECTED_SHA256 = "0B19F0022172001957D1D9703465646C89E02A3AECA2DB284FFAE95386EC5122"

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
DC_NS = "http://purl.org/dc/elements/1.1/"
DCTERMS_NS = "http://purl.org/dc/terms/"
XML_NS = "http://www.w3.org/XML/1998/namespace"
NS = {"w": W_NS, "dc": DC_NS, "dcterms": DCTERMS_NS}

SECTIONS: list[tuple[str, list[str]]] = [
    (
        "Medical Students Workshop",
        [
            "Added a complete Introduction course with lessons on eye disease, blindness, vision, examination tools and history taking.",
            "Added more workshop images, diagrams and a visual field loss video.",
            "Expanded Training with Pupil App practice and test modes, Fundal Reflex and Disc mini apps.",
            "Added an Anterior Segment case study and three tests for Visual Acuity, Pupils and Fundal Reflex.",
            "Improved review explanations, lesson progress and Previous / Next navigation across workshop pages and videos.",
        ],
    ),
    (
        "Navigation / App Use",
        [
            "Added the Arclight logo to top bars so users can return to the Dashboard more easily.",
            "Replaced Previous / Next controls in the diabetic case quiz with direct 1A, 1B and 1C buttons.",
            "Improved Back behaviour for case quizzes and videos so users return to the page they came from.",
            "Improved the location information pop-up so it clearly explains when precise location data is used.",
        ],
    ),
    (
        "Fundal Reflex Mini App",
        [
            "Fixed an iPhone display problem that could move the irises away from the centre of the eyes.",
        ],
    ),
    (
        "Lao Language Support",
        [
            "Added Lao as a full app language.",
            "Added Lao text across the main app, learning workshops and mini apps.",
            "Added Lao subtitles to app videos and Childhood Eye Screening videos, including versions used for offline viewing.",
            "Improved medical terms, learning progress labels and confirmation pop-ups in Lao.",
        ],
    ),
    (
        "Private Reporting / Reliability",
        [
            "Added a private, read-only reporting service for checking deployments, backups and usage figures without changing app data.",
            "Added Word report generation while keeping personal data out of logs and normal tool messages.",
            "Added guidance for scheduled cloud checks and safer, separate read-only database access.",
            "Fixed cloud restart settings so the reporting service restarts correctly after a failure.",
        ],
    ),
    (
        "Development",
        [
            "Added automated checks for workshop quizzes, navigation, translations, offline files and the iPhone Fundal Reflex display.",
            "Updated project notes and setup instructions for the new workshop and reporting features.",
        ],
    ),
]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def set_paragraph_text(paragraph: etree._Element, text: str) -> etree._Element:
    paragraph = deepcopy(paragraph)
    ppr = paragraph.find(f"{{{W_NS}}}pPr")
    first_run = paragraph.find(f"{{{W_NS}}}r")
    if first_run is None:
        first_run = etree.Element(f"{{{W_NS}}}r")
    else:
        first_run = deepcopy(first_run)

    rpr = first_run.find(f"{{{W_NS}}}rPr")
    for child in list(first_run):
        if child is not rpr:
            first_run.remove(child)
    text_node = etree.SubElement(first_run, f"{{{W_NS}}}t")
    text_node.set(f"{{{XML_NS}}}space", "preserve")
    text_node.text = text

    for child in list(paragraph):
        paragraph.remove(child)
    if ppr is not None:
        paragraph.append(deepcopy(ppr))
    paragraph.append(first_run)
    return paragraph


def build_document_xml(source: bytes) -> bytes:
    parser = etree.XMLParser(remove_blank_text=False)
    root = etree.fromstring(source, parser)
    body = root.find(f"{{{W_NS}}}body")
    if body is None:
        raise RuntimeError("Reference document has no body")

    paragraphs = body.findall(f"{{{W_NS}}}p")
    if len(paragraphs) < 4:
        raise RuntimeError("Reference does not contain the required paragraph patterns")

    title_template = paragraphs[0]
    blank_template = paragraphs[1]
    heading_template = paragraphs[2]
    bullet_template = paragraphs[3]
    sect_pr = body.find(f"{{{W_NS}}}sectPr")
    if sect_pr is None:
        raise RuntimeError("Reference section properties are missing")
    sect_pr = deepcopy(sect_pr)

    for child in list(body):
        body.remove(child)

    body.append(set_paragraph_text(title_template, "Weekly Update (17 - 28 August)"))
    body.append(deepcopy(blank_template))

    for section_index, (heading, items) in enumerate(SECTIONS):
        body.append(set_paragraph_text(heading_template, heading))
        for item in items:
            body.append(set_paragraph_text(bullet_template, item))
        if section_index != len(SECTIONS) - 1:
            body.append(deepcopy(blank_template))

    body.append(sect_pr)
    return etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone="yes")


def update_core_xml(source: bytes) -> bytes:
    parser = etree.XMLParser(remove_blank_text=False)
    root = etree.fromstring(source, parser)
    title = root.find("dc:title", NS)
    if title is not None:
        title.text = "Weekly Update (17 - 28 August)"
    modified = root.find("dcterms:modified", NS)
    if modified is not None:
        modified.text = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    return etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone="yes")


def build() -> None:
    if not REFERENCE.exists():
        raise FileNotFoundError(REFERENCE)
    if sha256(REFERENCE) != EXPECTED_SHA256:
        raise RuntimeError("Reference SHA-256 no longer matches the distilled template")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    temp_handle, temp_name = tempfile.mkstemp(prefix="changelog-", suffix=".docx", dir=OUTPUT.parent)
    os.close(temp_handle)
    temp_path = Path(temp_name)

    try:
        with zipfile.ZipFile(REFERENCE, "r") as source_zip, zipfile.ZipFile(temp_path, "w") as output_zip:
            for info in source_zip.infolist():
                data = source_zip.read(info.filename)
                if info.filename == "word/document.xml":
                    data = build_document_xml(data)
                elif info.filename == "docProps/core.xml":
                    data = update_core_xml(data)
                output_zip.writestr(info, data)
        shutil.move(str(temp_path), OUTPUT)
    finally:
        temp_path.unlink(missing_ok=True)

    if sha256(REFERENCE) != EXPECTED_SHA256:
        raise RuntimeError("Reference changed during authoring")
    print(OUTPUT)


if __name__ == "__main__":
    build()
