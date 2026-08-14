/**
 * @jest-environment jsdom
 */

import { beforeEach, describe, expect, it, jest } from "@jest/globals";

let pdfModule;

function buildPdfDom() {
  document.body.innerHTML = `
    <div id="page-content">
      <div
        id="directOphthalmoscopyPdfPage"
        class="page"
        data-pdf-title="Direct Ophthalmoscopy"
      >
        <div id="directOphthalmoscopyPdfViewer"></div>
      </div>
      <div
        id="binocularIndirectOphthalmoscopyPdfPage"
        class="page"
        data-pdf-title="Binocular Indirect Ophthalmoscopy"
      >
        <div id="binocularIndirectOphthalmoscopyPdfViewer"></div>
      </div>
      <div id="visualAcuityPdfPage" class="page" data-pdf-title="Visual Acuity">
        <div id="visualAcuityPdfViewer"></div>
      </div>
      <div id="pupilsPecPdfPage" class="page" data-pdf-title="Pupils PEC">
        <div id="pupilsPecPdfViewer"></div>
      </div>
      <div id="pupilsAdvancedPdfPage" class="page" data-pdf-title="Pupils Advanced">
        <div id="pupilsAdvancedPdfViewer"></div>
      </div>
      <div id="frontOfEyePdfPage" class="page" data-pdf-title="Front of Eye">
        <div id="frontOfEyePdfViewer"></div>
      </div>
    </div>
  `;
}

describe("fundal reflex PDF progress", () => {
  beforeEach(async () => {
    jest.resetModules();
    localStorage.clear();
    buildPdfDom();

    window.matchMedia = jest.fn().mockReturnValue({ matches: true });

    await jest.isolateModulesAsync(async () => {
      pdfModule = await import("../public/js/fundalReflexPdf.js");
    });
  });

  it("marks Direct Ophthalmoscopy PDF complete for Arclight and workshop rows", () => {
    const events = [];
    document.addEventListener("arclight:lesson-progress-changed", (event) => {
      events.push(event.detail);
    });

    pdfModule.initializeDirectOphthalmoscopyPdf();

    expect(
      JSON.parse(
        localStorage.getItem("lessonProgress:directOphthalmoscopyPdfPage"),
      ).percent,
    ).toBe(100);
    expect(
      JSON.parse(
        localStorage.getItem(
          "diabeticWorkshop:progress:directOphthalmoscopyPdfPage",
        ),
      ).percent,
    ).toBe(100);
    expect(events).toContainEqual({
      target: "directOphthalmoscopyPdfPage",
      percent: 100,
    });
  });

  it("marks Binocular Indirect Ophthalmoscopy PDF complete for Holo and workshop rows", () => {
    pdfModule.initializeBinocularIndirectOphthalmoscopyPdf();

    expect(
      JSON.parse(
        localStorage.getItem(
          "lessonProgress:binocularIndirectOphthalmoscopyPdfPage",
        ),
      ).percent,
    ).toBe(100);
    expect(
      JSON.parse(
        localStorage.getItem(
          "diabeticWorkshop:progress:binocularIndirectOphthalmoscopyPdfPage",
        ),
      ).percent,
    ).toBe(100);
  });

  it.each([
    [
      "initializeVisualAcuityPdf",
      "visualAcuityPdfPage",
      ["VisualAcuity-1.png", "VisualAcuity-2.png"],
    ],
    ["initializePupilsPecPdf", "pupilsPecPdfPage", ["PupilsPEC-1.png"]],
    [
      "initializePupilsAdvancedPdf",
      "pupilsAdvancedPdfPage",
      ["PupilsAdvanced-1.png", "PupilsAdvanced-2.png"],
    ],
    ["initializeFrontOfEyePdf", "frontOfEyePdfPage", ["FrontofEye-1.png"]],
  ])(
    "initializes %s with the Fundal-style image viewer",
    (initializer, pageId, fileNames) => {
      pdfModule[initializer]();

      expect(
        JSON.parse(localStorage.getItem(`lessonProgress:${pageId}`)).percent,
      ).toBe(100);
      expect(document.querySelector(`#${pageId} iframe`)).toBeNull();
      expect(
        Array.from(document.querySelectorAll(`#${pageId} img`)).map(
          (image) => image.src,
        ),
      ).toEqual(fileNames.map((fileName) => expect.stringContaining(fileName)));
      expect(
        document.getElementById(pageId)?.classList.contains("active"),
      ).toBe(true);
    },
  );
});
