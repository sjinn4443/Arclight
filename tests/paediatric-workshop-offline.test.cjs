/** @jest-environment jsdom */
import { beforeEach, expect, it, jest } from "@jest/globals";

let downloads;
beforeEach(async () => {
  jest.resetModules();
  localStorage.clear();
  window.I18N = { getLanguage: () => "en", translateLiteral: (text) => text };
  await jest.isolateModulesAsync(async () => {
    downloads = await import("../public/js/languageinstall.js");
  });
});

it("selective paediatric downloads include reused media, source images and English narration", () => {
  const expected = [
    "/html/paediatricSurgicalEyeEarWorkshop.html",
    "/images/learning/PaediatricSurgicalEyeEar/normal.webp",
    "/images/learning/PaediatricSurgicalEyeEar/ome.webp",
    "/videos/Core/FrontofEye/FE_Full_220p.mp4",
    "/videos/Core/FundalReflex/FundalReflex_220p.mp4",
    "/videos/FullAnim/FrontofEyeFullAnim_timed_220p.mp4",
    "/videos/FullAnim/FundalReflexFullAnim_220p.mp4",
    "/videos/FullAnim/DOFullAnim_220p.mp4",
    "/videos/USAID Childhood eye screening/1. How to use the Arclight - ENGLISH - HD_220p.mp4",
    "/videos/Otoscopy/Otoscopy_Instructional_Video_051124_720p.mp4",
    "/images/pdf/Workshop/ENT/Otoscope/Otoscope.pdf",
    "/images/pdf/Workshop/DO/DO.pdf",
    "/scrolly/coreexam/frontofeye/01Preparation/1/data.json",
    "/scrolly/coreexam/ophths/DO/prep/1/images/img_1.png",
    "/narration/direct-ophthalmoscopy/full-animation/en.m4a",
    "/narration/front-of-eye/full-animation/en.vtt",
    "/images/icon/eyes/workshop/car_paediatric.webp",
    "/images/casestudy/case12_eyes.webp",
    "/subapp/Discs/assets/images/discs/case-01.webp",
    "/subapp/Discs/assets/images/discs/case-02.webp",
    "/subapp/Discs/assets/images/discs/case-03.webp",
    "/images/quiz/workshop/DR/Cases/1.png",
  ];
  const excluded = [
    "/videos/FullAnim/FrontofEyeFullAnim_timed_720p.mp4",
    "/videos/FullAnim/VisualAcuityFullAnim_220p.mp4",
    "/narration/front-of-eye/full-animation/ko.vtt",
    "/videos/Workshop/Diabetic/unrelated_220p.mp4",
  ];
  const selection = downloads.resolveOfflineDownloadSelection(
    { assets: [...expected, ...excluded].map((url) => ({ url, bytes: 1000 })) },
    {
      language: "en",
      mode: "select",
      catalogId: "workshop-paediatric-surgical",
      videoQuality: "low",
    },
  );
  expect(selection.urls).toEqual(expect.arrayContaining(expected));
  for (const url of excluded) expect(selection.urls).not.toContain(url);
});

it("download-all-workshops includes the new workshop's source assets", () => {
  expect(
    downloads.OFFLINE_CATALOG_GROUPS.find((group) => group.id === "workshops")
      .sections,
  ).toContain("workshop-paediatric-surgical");
  expect(
    downloads.matchesOfflineCatalog(
      "/images/learning/PaediatricSurgicalEyeEar/hole.webp",
      "workshops",
    ),
  ).toBe(true);
});
