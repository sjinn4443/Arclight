/**
 * @fileoverview This file manages the language selection and PWA installation process. Handles language preference persistence, custom dropdown UI, and triggers the PWA install prompt.
 */

import { loadPage } from "./navigation.js";
import { initializePWA, canInstall, promptInstall } from "./pwa.js";
import { setLanguage, getLanguage, translateLiteral } from "./i18n.js";
import { saveProfile, bumpRefresh } from "./telemetry.js"; // Import bumpRefresh

const CHILDHOOD_EYE_SCREENING_PILOT_SUBTITLE_TARGETS = [
  {
    path: "app-videos/assessingVisualFunctionPage",
  },
  {
    path: "app-videos/binocularIndirectOphthalmoscopyVideoPage",
  },
  {
    path: "app-videos/diabeticCausesOfVisionLossVideoPage",
  },
  {
    path: "app-videos/diabeticSimpleSafeScalableVideoPage",
  },
  {
    path: "app-videos/directOphthalmoscopyVideoPage",
  },
  {
    path: "app-videos/feFullAnteriorSegmentPage",
  },
  {
    path: "app-videos/fePecAnteriorSegmentPage",
  },
  {
    path: "app-videos/fundalExamPage",
  },
  {
    path: "app-videos/fundalRealPage",
  },
  {
    path: "app-videos/fundalStillPage",
  },
  {
    path: "app-videos/glaucomaACAGCaseWorkshopVideoPage",
  },
  {
    path: "app-videos/glaucomaAnteriorChamberDepthVideoPage",
  },
  {
    path: "app-videos/glaucomaDirectOphthalmoscopyDiscsAnnotatedVideoPage",
  },
  {
    path: "app-videos/glaucomaDiscCuppingVideoPage",
  },
  {
    path: "app-videos/glaucomaFundalReflexDiseaseVideoPage",
  },
  {
    path: "app-videos/glaucomaMarginVideoPage",
  },
  {
    path: "app-videos/glaucomaOpticDiscAnatomyVideoPage",
  },
  {
    path: "app-videos/glaucomaOtherOpticNerveDiseasesVideoPage",
  },
  {
    path: "app-videos/glaucomaPupilReactionsVideoPage",
  },
  {
    path: "app-videos/glaucomaSignsOfGlaucomaVideoPage",
  },
  {
    path: "app-videos/images-pdf-workshop-childhood-causesvippts-03-cce3d3c0",
  },
  {
    path: "app-videos/images-pdf-workshop-childhood-causesvippts-05-f9ebb50d",
  },
  {
    path: "app-videos/images-pdf-workshop-childhood-causesvippts-07-6e064ca4",
  },
  {
    path: "app-videos/images-pdf-workshop-childhood-causesvippts-09-615c3920",
  },
  {
    path: "app-videos/images-pdf-workshop-childhood-signsvippts-01-2cfda65f",
  },
  {
    path: "app-videos/images-pdf-workshop-childhood-signsvippts-04-5bb0c29e",
  },
  {
    path: "app-videos/images-pdf-workshop-childhood-signsvippts-05-043c2e2f",
  },
  {
    path: "app-videos/images-pdf-workshop-childhood-signsvippts-06-419c7e4c",
  },
  {
    path: "app-videos/images-pdf-workshop-childhood-signsvippts-07-99098e9f",
  },
  {
    path: "app-videos/images-pdf-workshop-childhood-signsvippts-08-64b1565e",
  },
  {
    path: "app-videos/images-pdf-workshop-childhood-visualdevelopment-01-b30c649f",
  },
  {
    path: "app-videos/phoneAttachmentVideoPage",
  },
  {
    path: "app-videos/pupilExamPECPage",
  },
  {
    path: "app-videos/rapdTestVideoPage",
  },
  {
    path: "app-videos/vaNearVisionPage",
  },
  {
    path: "app-videos/vaWhoPage",
  },
  {
    path: "app-videos/videos-cataract-cataract-identification-pec-20mb-83b65eb3",
  },
  {
    path: "app-videos/videos-core-pupils-pupils-full-ec671d76",
  },
  {
    path: "app-videos/videos-intro-gifquiz-comp-11741e5d",
  },
  {
    path: "app-videos/videos-intro-gifrecommended-comp-f7b8b3f3",
  },
  {
    path: "app-videos/videos-intro-gifvideo-comp-51de8d7c",
  },
  {
    path: "app-videos/videos-otoscopy-otoscopy-instructional-video-051124-4bc3f9e9",
  },
  {
    path: "app-videos/videos-tools-mobilephoneattachment-4be1e646",
  },
  {
    path: "app-videos/videos-ure-arclight-eyeglasses-3dce0666",
  },
  {
    path: "app-videos/videos-ure-ure-refractive-error-groups-by-va-testing-ppp-slides-for-video-b1b87654",
  },
  {
    path: "app-videos/videos-usaid-assessmentvision-c7ce5026",
  },
  {
    path: "app-videos/videos-usaid-childhood-eye-screening-2-assessment-of-eyes-and-vision-english-hd-5e7af5c6",
  },
  {
    path: "app-videos/videos-usaid-childhood-eye-screening-3-fundal-reflex-examination-swahili-hd-ac3cd66d",
  },
  {
    path: "app-videos/videos-usaid-childhood-eye-screening-5-usaid-tz-arclight-clip-to-camera-short-607d592b",
  },
  {
    path: "app-videos/videos-usaid-childhood-eye-screening-5-usaid-tz-arclight-clip-to-camera-short-720p-4867698b",
  },
  {
    path: "app-videos/videos-workshop-diabetic-10-frt-for-dr-356f6098",
  },
  {
    path: "app-videos/videos-workshop-diabetic-11-direct-ophthalmoscopy-short-ca98a960",
  },
  {
    path: "app-videos/videos-workshop-diabetic-12-direct-ophthalmoscopy-traditional-arclight-osce-11741446",
  },
  {
    path: "app-videos/videos-workshop-diabetic-13-drs-pdr-signs-64c6203c",
  },
  {
    path: "app-videos/videos-workshop-diabetic-14-drs-non-pdr-signs-79d0b7ca",
  },
  {
    path: "app-videos/videos-workshop-diabetic-15-do-dr-maculopathy-copy-7f98f54e",
  },
  {
    path: "app-videos/videos-workshop-diabetic-2-dodrmaculopathy-4b3a4343",
  },
  {
    path: "app-videos/videos-workshop-diabetic-5-1-visual-acuity-near-distance-9c02e9ae",
  },
  {
    path: "app-videos/videos-workshop-diabetic-5-2-near-visual-acuity-dispense-glasses-pec-be1a72ad",
  },
  {
    path: "app-videos/videos-workshop-diabetic-6-pupil-exam-pec-080525-af7ae232",
  },
  {
    path: "app-videos/videos-workshop-diabetic-7-pupil-response-good-to-bad-f03f3fa4",
  },
  {
    path: "app-videos/videos-workshop-diabetic-8-anterior-segment-full-2026-level-2-glaucoma-f0851d4c",
  },
  {
    path: "app-videos/videos-workshop-diabetic-9-front-of-eye-dr-e648cde9",
  },
  {
    path: "app-videos/videos-workshop-glaucoma-a2-videos-norm-v-abnorm-103f9d6b",
  },
  {
    path: "app-videos/videos-workshop-glaucoma-normalabnormal-case1-f654edd8",
  },
  {
    path: "app-videos/videos-workshop-glaucoma-normalabnormal-case10-3f2a191f",
  },
  {
    path: "app-videos/videos-workshop-glaucoma-normalabnormal-case11-bb39a66c",
  },
  {
    path: "app-videos/videos-workshop-glaucoma-normalabnormal-case12-093105ad",
  },
  {
    path: "app-videos/videos-workshop-glaucoma-normalabnormal-case2-eac7e6fc",
  },
  {
    path: "app-videos/videos-workshop-glaucoma-normalabnormal-case3-4ed80c80",
  },
  {
    path: "app-videos/videos-workshop-glaucoma-normalabnormal-case4-041c9121",
  },
  {
    path: "app-videos/videos-workshop-glaucoma-normalabnormal-case5-5d1031f9",
  },
  {
    path: "app-videos/videos-workshop-glaucoma-normalabnormal-case6-3d049649",
  },
  {
    path: "app-videos/videos-workshop-glaucoma-normalabnormal-case7-25d31f89",
  },
  {
    path: "app-videos/videos-workshop-glaucoma-normalabnormal-case8-d7bc580f",
  },
  {
    path: "app-videos/videos-workshop-glaucoma-normalabnormal-case9-23bfd4bb",
  },
  {
    path: "childhood-eye-screening/assessmentVisionPage",
  },
  {
    path: "childhood-eye-screening/mumVisionPage",
  },
  {
    path: "childhood-eye-screening/usaidFundalReflexExamPage",
  },
  {
    path: "childhood-eye-screening/usaidHowToUseArclightPage",
  },
  {
    path: "childhood-eye-screening/usaidNormalAbnormalPage",
  },
  {
    path: "diabetic-retinopathy-workshop/diabeticIntroductionToArclightVideoPage",
  },
];
const CHILDHOOD_EYE_SCREENING_PILOT_VIDEO_URLS = [
  "/images/pdf/Workshop/Childhood/CausesVIppts/03.mp4",
  "/images/pdf/Workshop/Childhood/CausesVIppts/05.mp4",
  "/images/pdf/Workshop/Childhood/CausesVIppts/07.mp4",
  "/images/pdf/Workshop/Childhood/CausesVIppts/09.mp4",
  "/images/pdf/Workshop/Childhood/SignsVIppts/01.mp4",
  "/images/pdf/Workshop/Childhood/SignsVIppts/04.mp4",
  "/images/pdf/Workshop/Childhood/SignsVIppts/05.mp4",
  "/images/pdf/Workshop/Childhood/SignsVIppts/06.mp4",
  "/images/pdf/Workshop/Childhood/SignsVIppts/07.mp4",
  "/images/pdf/Workshop/Childhood/SignsVIppts/08.mp4",
  "/images/pdf/Workshop/Childhood/VisualDevelopment/01.mp4",
  "/images/pdf/Workshop/Childhood/VisualDevelopment/01_ios.mp4",
  "/videos/Arclight/PhoneAttach.mp4",
  "/videos/Cataract/Cataract Identification PEC 20MB.mp4",
  "/videos/Core/FrontofEye/FE_Full_220p.mp4",
  "/videos/Core/FrontofEye/FE_Full_720p.mp4",
  "/videos/Core/FrontofEye/FE_PEC_220p.mp4",
  "/videos/Core/FrontofEye/FE_PEC_720p.mp4",
  "/videos/Core/FundalReflex/FRT Testing Tools/FR_SREN_220p.mp4",
  "/videos/Core/FundalReflex/FRT Testing Tools/FR_SREN_720p.mp4",
  "/videos/Core/FundalReflex/FRT Testing Tools/FR_Stillimg_220p.mp4",
  "/videos/Core/FundalReflex/FRT Testing Tools/FR_Stillimg_720p.mp4",
  "/videos/Core/FundalReflex/FR_Scotland_220p.mp4",
  "/videos/Core/FundalReflex/FR_Scotland_720p.mp4",
  "/videos/Core/Intro/1. How to use the Arclight - ENGLISH - HD_720p.mp4",
  "/videos/Core/Ophthalmoscopy/DirectOphth_220p.mp4",
  "/videos/Core/Ophthalmoscopy/DirectOphth_720p.mp4",
  "/videos/Core/Pupils/Pupils_Full_220p.mp4",
  "/videos/Core/Pupils/Pupils_Full_720p.mp4",
  "/videos/Core/Pupils/Pupils_PEC_220p.mp4",
  "/videos/Core/Pupils/Pupils_PEC_720p.mp4",
  "/videos/Core/Pupils/Pupils_RAPD24_220p.mp4",
  "/videos/Core/Pupils/Pupils_RAPD24_720p.mp4",
  "/videos/Core/VisualAcuity/VA_Assessment_220p.mp4",
  "/videos/Core/VisualAcuity/VA_Assessment_720p.mp4",
  "/videos/Core/VisualAcuity/VA_Mum_220p.mp4",
  "/videos/Core/VisualAcuity/VA_Mum_720p.mp4",
  "/videos/Core/VisualAcuity/VA_NearDIst_220p.mp4",
  "/videos/Core/VisualAcuity/VA_NearDIst_720p.mp4",
  "/videos/Core/VisualAcuity/VA_PEC1_220p.mp4",
  "/videos/Core/VisualAcuity/VA_PEC1_720p.mp4",
  "/videos/Intro/GIFQuiz_Comp.mp4",
  "/videos/Intro/GIFRecommended_Comp.mp4",
  "/videos/Intro/GIFVideo_Comp.mp4",
  "/videos/Otoscopy/Otoscopy_Instructional_Video_051124_720p.mp4",
  "/videos/Tools/BIOvideo_220p.mp4",
  "/videos/Tools/BIOvideo_720p.mp4",
  "/videos/Tools/MobilePhoneAttachment_720p.mp4",
  "/videos/URE/Arclight & Eyeglasses_720p.mp4",
  "/videos/URE/URE - Refractive Error Groups by VA testing PPP slides for video_720p.mp4",
  "/videos/USAID Childhood eye screening/1. How to use the Arclight - ENGLISH - HD_220p.mp4",
  "/videos/USAID Childhood eye screening/1. How to use the Arclight - ENGLISH - HD_720p.mp4",
  "/videos/USAID Childhood eye screening/2. Assessment of eyes and vision ENGLISH - HD_220p.mp4",
  "/videos/USAID Childhood eye screening/2. Assessment of eyes and vision ENGLISH - HD_720p.mp4",
  "/videos/USAID Childhood eye screening/3. Fundal Reflex examination SWAHILI - HD_220p.mp4",
  "/videos/USAID Childhood eye screening/3. Fundal Reflex examination SWAHILI - HD_720p.mp4",
  "/videos/USAID Childhood eye screening/3. USAID FRT How to Perform Short_720p.mp4",
  "/videos/USAID Childhood eye screening/3. USAID FRT How to Perform Short_720p_220p.mp4",
  "/videos/USAID Childhood eye screening/4. Normal and Abnormal findings - ENGLISH - HD_220p.mp4",
  "/videos/USAID Childhood eye screening/4. Normal and Abnormal findings - ENGLISH - HD_720p.mp4",
  "/videos/USAID Childhood eye screening/5. USAID TZ Arclight clip to Camera SHORT_720p.mp4",
  "/videos/USAID Childhood eye screening/5. USAID TZ Arclight clip to Camera SHORT_720p_220p.mp4",
  "/videos/USAID Childhood eye screening/FundalReflexUSAID_220p.mp4",
  "/videos/USAID Childhood eye screening/FundalReflexUSAID_720p.mp4",
  "/videos/USAID/AssessmentVision.mp4",
  "/videos/USAID/FundalReflexUSAID.mp4",
  "/videos/USAID/HowtoArclight.mp4",
  "/videos/USAID/NormalAbnormal.mp4",
  "/videos/Workshop/Diabetic/1.ArclightIntroduction_eyesOnly_220p.mp4",
  "/videos/Workshop/Diabetic/1.ArclightIntroduction_eyesOnly_720p.mp4",
  "/videos/Workshop/Diabetic/10. FRT for DR _220p.mp4",
  "/videos/Workshop/Diabetic/11. Direct Ophthalmoscopy Short Low Resolution_220p.mp4",
  "/videos/Workshop/Diabetic/12. Direct Ophthalmoscopy Traditional + Arclight OSCE_220p.mp4",
  "/videos/Workshop/Diabetic/13. DRS PDR Signs_220p.mp4",
  "/videos/Workshop/Diabetic/14. DRS non PDR signs_220p.mp4",
  "/videos/Workshop/Diabetic/15. DO DR Maculopathy copy_220p.mp4",
  "/videos/Workshop/Diabetic/2.DODRMaculopathy.mp4",
  "/videos/Workshop/Diabetic/3.DR_LossofVisionCause_220p.mp4",
  "/videos/Workshop/Diabetic/3.DR_LossofVisionCause_720p.mp4",
  "/videos/Workshop/Diabetic/4.DRSinNCDClinicflow_220p.mp4",
  "/videos/Workshop/Diabetic/4.DRSinNCDClinicflow_720p.mp4",
  "/videos/Workshop/Diabetic/5.1 Visual Acuity Near + Distance_220p.mp4",
  "/videos/Workshop/Diabetic/5.2 Near Visual Acuity + Dispense Glasses - PEC_220p.mp4",
  "/videos/Workshop/Diabetic/6. Pupil Exam PEC 080525_220p.mp4",
  "/videos/Workshop/Diabetic/7. Pupil response good to bad_220p.mp4",
  "/videos/Workshop/Diabetic/8. Anterior Segment FULL 2026 - level 2 + glaucoma_220p.mp4",
  "/videos/Workshop/Diabetic/9. Front of eye DR_220p.mp4",
  "/videos/Workshop/Glaucoma/A2 - VIDEOS - Norm v Abnorm.mp4",
  "/videos/Workshop/Glaucoma/BE_Margin_220p.mp4",
  "/videos/Workshop/Glaucoma/BE_Margin_720p.mp4",
  "/videos/Workshop/Glaucoma/BE_disccuppingonly_220p.mp4",
  "/videos/Workshop/Glaucoma/BE_disccuppingonly_720p.mp4",
  "/videos/Workshop/Glaucoma/BE_opticdiscanatomy_220p.mp4",
  "/videos/Workshop/Glaucoma/BE_opticdiscanatomy_720p.mp4",
  "/videos/Workshop/Glaucoma/DO_discsannotated_220p.mp4",
  "/videos/Workshop/Glaucoma/DO_discsannotated_720p.mp4",
  "/videos/Workshop/Glaucoma/FRACAG_220p.mp4",
  "/videos/Workshop/Glaucoma/FRACAG_720p.mp4",
  "/videos/Workshop/Glaucoma/FRACD_220p.mp4",
  "/videos/Workshop/Glaucoma/FRACD_720p.mp4",
  "/videos/Workshop/Glaucoma/FRDisease_220p.mp4",
  "/videos/Workshop/Glaucoma/FRDisease_720p.mp4",
  "/videos/Workshop/Glaucoma/FRsignsglaucoma_220p.mp4",
  "/videos/Workshop/Glaucoma/FRsignsglaucoma_720p.mp4",
  "/videos/Workshop/Glaucoma/NormalAbnormal/case10_720p.mp4",
  "/videos/Workshop/Glaucoma/NormalAbnormal/case11_720p.mp4",
  "/videos/Workshop/Glaucoma/NormalAbnormal/case12_720p.mp4",
  "/videos/Workshop/Glaucoma/NormalAbnormal/case1_720p.mp4",
  "/videos/Workshop/Glaucoma/NormalAbnormal/case2_720p.mp4",
  "/videos/Workshop/Glaucoma/NormalAbnormal/case3_720p.mp4",
  "/videos/Workshop/Glaucoma/NormalAbnormal/case4_720p.mp4",
  "/videos/Workshop/Glaucoma/NormalAbnormal/case5_720p.mp4",
  "/videos/Workshop/Glaucoma/NormalAbnormal/case6_720p.mp4",
  "/videos/Workshop/Glaucoma/NormalAbnormal/case7_720p.mp4",
  "/videos/Workshop/Glaucoma/NormalAbnormal/case8_720p.mp4",
  "/videos/Workshop/Glaucoma/NormalAbnormal/case9_720p.mp4",
  "/videos/Workshop/Glaucoma/opticdiseases_220p.mp4",
  "/videos/Workshop/Glaucoma/opticdiseases_720p.mp4",
  "/videos/Workshop/Glaucoma/pupilreaction_220p.mp4",
  "/videos/Workshop/Glaucoma/pupilreaction_720p.mp4",
];
const CHILDHOOD_EYE_SCREENING_SUBTITLE_LANGUAGES = new Set([
  "en",
  "am",
  "ar",
  "bn",
  "ne",
  "ny",
  "zh",
  "fr",
  "ha",
  "hi",
  "ig",
  "id",
  "rw",
  "ko",
  "ln",
  "fa",
  "pt",
  "sn",
  "es",
  "sw",
  "te",
  "ur",
  "yo",
  "zu",
]);
const ENGLISH_LANGUAGE_LABELS = {
  en: "English",
  am: "Amharic",
  ar: "Arabic",
  bn: "Bangla",
  ne: "Nepali",
  ny: "Nyanja",
  zh: "Chinese",
  fr: "French",
  ha: "Hausa",
  hi: "Hindi",
  ig: "Igbo",
  id: "Indonesian",
  rw: "Kinyarwanda",
  ko: "Korean",
  te: "Telugu",
  ln: "Lingala",
  fa: "Persian",
  pt: "Portuguese",
  sn: "Shona",
  es: "Spanish",
  sw: "Swahili",
  ur: "Urdu",
  yo: "Yoruba",
  zu: "Zulu",
};

function t(text, fallback = text) {
  return translateLiteral(text, fallback);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const ESTIMATED_DOWNLOAD_BYTES_PER_MINUTE = 120 * 1000 * 1000;
const MAX_FAILED_FILES_DISPLAY = 12;
const VIDEO_ASSET_EXTENSIONS = new Set([
  ".m3u8",
  ".m4s",
  ".m4v",
  ".mov",
  ".mp4",
  ".mpd",
  ".srt",
  ".ts",
  ".vtt",
  ".webm",
]);
const CONTENT_ASSET_PREFIXES = [
  "/images/learning/",
  "/images/pdf/",
  "/images/quiz/",
  "/scrolly/",
  "/scrolls/",
  "/subapp/",
  "/video-hls/",
  "/video-localization/",
  "/video-subtitles/",
  "/videos/",
];
export const OFFLINE_CATALOG_OPTIONS = [
  {
    id: "core",
    label: "Core Examination",
    description:
      "Includes History Taking, Visual Acuity, Pupils, Front of Eye, Fundal Reflex, Ophthalmoscopy and Interactive Learning.",
  },
  {
    id: "core-history",
    label: "History Taking",
    description: "Downloads history taking case studies and related images.",
  },
  {
    id: "core-visual-acuity",
    label: "Visual Acuity",
    description: "Downloads visual acuity videos and supporting content.",
  },
  {
    id: "core-pupils",
    label: "Pupils",
    description: "Downloads pupil examination and RAPD content.",
  },
  {
    id: "core-front-of-eye",
    label: "Front of Eye",
    description: "Downloads front of eye and anterior segment content.",
  },
  {
    id: "core-fundal-reflex",
    label: "Fundal Reflex",
    description: "Downloads fundal reflex videos, images and handouts.",
  },
  {
    id: "core-ophthalmoscopy",
    label: "Ophthalmoscopy",
    description: "Downloads direct ophthalmoscopy videos and PDF content.",
  },
  {
    id: "core-interactive-learning",
    label: "Interactive Learning",
    description: "Downloads mini apps and interactive learning assets.",
  },
  {
    id: "conditions",
    label: "Conditions",
    description:
      "Includes Uncorrected Refractive Error, Cataract, Glaucoma, Diabetic Retinopathy, Corneal Disease, Childhood Eye Screening, Retinopathy of Prematurity, Retinal Disease and Optic Nerve Disease.",
  },
  {
    id: "workshops",
    label: "Workshops",
    description:
      "Includes Childhood Eye Screening, Glaucoma, Diabetic Retinopathy and WHO PEC workshop content.",
  },
  {
    id: "extended",
    label: "Extended Examination",
    description:
      "Includes Ptosis, Proptosis, Eye Movements/Squint and Cranial Nerve Examination.",
  },
  {
    id: "tools",
    label: "Tools and Kits",
    description: "Includes Arclight Overview and Holo Overview.",
  },
];
const VIDEO_QUALITY_OPTIONS = [
  {
    id: "both",
    label: "Low and high resolution",
    description: "Downloads both versions where the app provides them.",
  },
  {
    id: "low",
    label: "Low resolution only",
    description: "Smaller download; videos use the lower-resolution files.",
  },
  {
    id: "high",
    label: "High resolution only",
    description: "Larger download; videos use the higher-resolution files.",
  },
];

initializePWA();

export async function fetchAllOfflineAssetUrls() {
  const res = await fetch("/api/app/offline-assets", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Offline asset manifest failed: ${res.status}`);
  }

  const manifest = await res.json();
  const urls = Array.isArray(manifest?.urls) ? manifest.urls : [];
  if (!urls.length) {
    throw new Error("Offline asset manifest is empty");
  }

  const assets = Array.isArray(manifest?.assets)
    ? manifest.assets
        .map((asset) => ({
          bytes: Number(asset?.bytes) || 0,
          url: typeof asset?.url === "string" ? asset.url : "",
        }))
        .filter((asset) => asset.url)
    : urls.map((url) => ({ bytes: 0, url }));

  return {
    assets,
    bytes: Number(manifest.bytes) || 0,
    count: Number(manifest.count) || urls.length,
    urls,
  };
}

function getAssetPath(url) {
  try {
    return decodeURI(new URL(url, window.location.origin).pathname)
      .split(/[?#]/)[0]
      .toLowerCase();
  } catch {
    return decodeURI(String(url || ""))
      .split(/[?#]/)[0]
      .toLowerCase();
  }
}

function getDisplayAssetPath(url) {
  try {
    return decodeURI(new URL(url, window.location.origin).pathname).split(
      /[?#]/,
    )[0];
  } catch {
    return decodeURI(String(url || "")).split(/[?#]/)[0];
  }
}

function getAssetExtension(assetPath) {
  const lastSegment = assetPath.split("/").pop() || "";
  const dotIndex = lastSegment.lastIndexOf(".");
  return dotIndex >= 0 ? lastSegment.slice(dotIndex) : "";
}

function isVideoAssetUrl(url) {
  const assetPath = getAssetPath(url);
  return (
    VIDEO_ASSET_EXTENSIONS.has(getAssetExtension(assetPath)) ||
    assetPath.startsWith("/video-hls/") ||
    assetPath.startsWith("/video-localization/") ||
    assetPath.startsWith("/video-subtitles/")
  );
}

function getVideoResolutionTier(url) {
  const assetPath = getAssetPath(url);
  const matches = Array.from(
    assetPath.matchAll(/(?:^|[_/-])(\d{3,4})p(?=[_./-]|$)/gi),
  );
  const match = matches[matches.length - 1];
  if (!match) return null;

  const resolution = Number(match[1]);
  if (!Number.isFinite(resolution)) return null;
  return resolution <= 360 ? "low" : "high";
}

function getAlternateVideoQualityUrl(url, videoQuality) {
  const sourcePattern =
    videoQuality === "high" ? /_220p(?=\.mp4$)/i : /_720p(?=\.mp4$)/i;
  const replacement = videoQuality === "high" ? "_720p" : "_220p";
  const urlString = String(url || "");
  return sourcePattern.test(urlString)
    ? urlString.replace(sourcePattern, replacement)
    : null;
}

function shouldIncludeVideoQuality(url, videoQuality, availableUrls) {
  if (videoQuality === "both" || !isVideoAssetUrl(url)) return true;

  const tier = getVideoResolutionTier(url);
  if (!tier || tier === videoQuality) return true;

  const alternateUrl = getAlternateVideoQualityUrl(url, videoQuality);
  return !alternateUrl || !availableUrls.has(alternateUrl);
}

function isAppShellAsset(url) {
  const assetPath = getAssetPath(url);
  if (isVideoAssetUrl(assetPath)) return false;
  return !CONTENT_ASSET_PREFIXES.some((prefix) => assetPath.startsWith(prefix));
}

export function matchesOfflineCatalog(url, catalogId) {
  const assetPath = getAssetPath(url);

  if (catalogId === "core-history") {
    return (
      assetPath.includes("history") ||
      assetPath.includes("casestudy") ||
      assetPath.includes("case-study") ||
      assetPath.includes("case_study")
    );
  }

  if (catalogId === "core-visual-acuity") {
    return (
      assetPath.startsWith("/videos/core/visualacuity/") ||
      assetPath.includes("visualacuity") ||
      assetPath.includes("visual-acuity") ||
      assetPath.includes("visual_acuity") ||
      assetPath.includes("/va_")
    );
  }

  if (catalogId === "core-pupils") {
    return assetPath.includes("pupil") || assetPath.includes("rapd");
  }

  if (catalogId === "core-front-of-eye") {
    return (
      assetPath.includes("frontofeye") ||
      assetPath.includes("front-of-eye") ||
      assetPath.includes("front_of_eye") ||
      assetPath.includes("anteriorsegment") ||
      assetPath.includes("anterior-segment")
    );
  }

  if (catalogId === "core-fundal-reflex") {
    return (
      assetPath.includes("fundalreflex") ||
      assetPath.includes("fundal-reflex") ||
      assetPath.includes("fundal_reflex") ||
      assetPath.includes("/fundal/")
    );
  }

  if (catalogId === "core-ophthalmoscopy") {
    return (
      assetPath.includes("ophthalmoscopy") ||
      assetPath === "/videos/do_220p.mp4" ||
      assetPath.startsWith("/images/pdf/workshop/do/") ||
      assetPath.startsWith("/images/pdf/workshop/bio/")
    );
  }

  if (catalogId === "core-interactive-learning") {
    return (
      assetPath.startsWith("/subapp/") ||
      assetPath.includes("interactive") ||
      assetPath.includes("miniapp")
    );
  }

  if (catalogId === "core") {
    return (
      assetPath.startsWith("/videos/core/") ||
      assetPath === "/videos/do_220p.mp4" ||
      assetPath.startsWith("/subapp/mires/") ||
      assetPath.startsWith("/subapp/morph/") ||
      assetPath.startsWith("/images/icon/eyes/core/") ||
      (assetPath.startsWith("/images/learning/") &&
        !assetPath.startsWith("/images/learning/diabetic/") &&
        !assetPath.startsWith("/images/learning/glaucoma"))
    );
  }

  if (catalogId === "conditions") {
    return (
      assetPath.startsWith("/subapp/cataract/") ||
      assetPath.startsWith("/videos/usaid/") ||
      assetPath.startsWith("/videos/usaid childhood eye screening/") ||
      assetPath.startsWith("/video-hls/childhood-eye-screening/") ||
      assetPath.startsWith("/video-localization/childhood-eye-screening") ||
      assetPath.startsWith("/video-subtitles/childhood-eye-screening/") ||
      assetPath.startsWith("/images/icon/eyes/disease/") ||
      assetPath.includes("cataract") ||
      assetPath.includes("childhood-eye-screening")
    );
  }

  if (catalogId === "workshops") {
    return (
      assetPath.startsWith("/videos/workshop/") ||
      assetPath.startsWith("/images/pdf/workshop/") ||
      assetPath.startsWith("/images/learning/diabetic/") ||
      assetPath.startsWith("/images/learning/glaucoma") ||
      assetPath.startsWith("/images/quiz/workshop/") ||
      assetPath.startsWith("/scrolly/workshop/") ||
      assetPath.startsWith("/scrolls/workshop/") ||
      assetPath.startsWith("/html/glaucoma") ||
      assetPath.startsWith("/html/diabetic") ||
      assetPath.startsWith("/html/childhoodeyescreeningworkshop") ||
      assetPath.startsWith("/js/glaucoma") ||
      assetPath.startsWith("/js/diabetic") ||
      assetPath.startsWith("/js/childhood") ||
      assetPath.startsWith("/images/icon/eyes/workshop/")
    );
  }

  if (catalogId === "extended") {
    return (
      assetPath.startsWith("/subapp/squint/") ||
      assetPath.startsWith("/images/icon/eyes/extended/")
    );
  }

  if (catalogId === "tools") {
    return (
      assetPath.startsWith("/videos/tools/") ||
      assetPath.startsWith("/videos/arclight/") ||
      assetPath.startsWith("/images/icon/eyes/tools/") ||
      assetPath.includes("arclight_device")
    );
  }

  return false;
}

export function getOfflineManifestAssets(manifest) {
  if (Array.isArray(manifest?.assets) && manifest.assets.length) {
    return manifest.assets;
  }

  return (Array.isArray(manifest?.urls) ? manifest.urls : []).map((url) => ({
    bytes: 0,
    url,
  }));
}

function dedupeOfflineAssets(assets) {
  const seen = new Set();
  const deduped = [];

  assets.forEach((asset) => {
    if (!asset?.url || seen.has(asset.url)) return;
    seen.add(asset.url);
    deduped.push(asset);
  });

  return deduped;
}

export function formatDownloadSize(bytes) {
  if (!bytes) return t("size will be calculated during download");
  if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(1)} GB`;
  if (bytes >= 1000000) return `${Math.ceil(bytes / 1000000)} MB`;
  return `${Math.ceil(bytes / 1000)} KB`;
}

function formatEstimatedDownloadTime(bytes) {
  if (!bytes) return t("Estimated time: under 1 minute.");

  const minutes = Math.max(
    1,
    Math.ceil(bytes / ESTIMATED_DOWNLOAD_BYTES_PER_MINUTE),
  );
  const unit = t(minutes === 1 ? "minute" : "minutes");
  return `${t("Estimated time: about")} ${minutes} ${unit}.`;
}

function getCatalogLabel(catalogId) {
  const label =
    OFFLINE_CATALOG_OPTIONS.find((option) => option.id === catalogId)?.label ||
    OFFLINE_CATALOG_OPTIONS[0].label;
  return t(label);
}

function getVideoQualityLabel(videoQuality) {
  const label =
    VIDEO_QUALITY_OPTIONS.find((option) => option.id === videoQuality)?.label ||
    VIDEO_QUALITY_OPTIONS[0].label;
  return t(label);
}

function getDownloadChoiceLabel(choice) {
  if (choice?.mode === "app-only") return t("Exclude videos");
  if (choice?.mode === "select") return getCatalogLabel(choice.catalogId);
  return t("Full content");
}

function getVideoQualitySummary(videoQuality) {
  if (videoQuality === "low") return t("in low resolution");
  if (videoQuality === "high") return t("in high resolution");
  return t("in low and high resolution");
}

function getSelectedContentSummary(downloadSelection) {
  if (!downloadSelection || Array.isArray(downloadSelection)) {
    return t("selected downloaded content");
  }

  if (downloadSelection.mode === "app-only") {
    return t("app pages, text, images and other non-video content");
  }

  const qualitySummary = getVideoQualitySummary(downloadSelection.videoQuality);
  if (downloadSelection.mode === "select") {
    const catalogSummaries = {
      core: "core examination videos and interactive content",
      "core-history": "history taking case studies and related content",
      "core-visual-acuity": "visual acuity videos and related content",
      "core-pupils": "pupils and RAPD content",
      "core-front-of-eye": "front of eye and anterior segment content",
      "core-fundal-reflex": "fundal reflex videos, images and handouts",
      "core-ophthalmoscopy": "ophthalmoscopy videos and PDF content",
      "core-interactive-learning": "interactive learning mini app content",
      conditions: "condition videos, images and mini apps",
      workshops: "workshop videos, images, quizzes and pages",
      extended: "extended examination content and mini apps",
      tools: "tool overview videos and related assets",
    };
    return `${t(
      catalogSummaries[downloadSelection.catalogId] || "selected content",
    )} ${qualitySummary}`;
  }

  return `${t("videos, images, animations and app pages")} ${qualitySummary}`;
}

function getNormallyAvailableItems(downloadSelection) {
  const items = [t("App quizzes")];
  const selectedContentSummary = getSelectedContentSummary(downloadSelection);
  if (selectedContentSummary) items.push(selectedContentSummary);
  return items;
}

function formatFailedAssetName(url) {
  const path = getDisplayAssetPath(url).replace(/^\/+/, "");
  return path || String(url || "Unknown file");
}

export function resolveOfflineDownloadSelection(manifest, choice = {}) {
  const allAssets = getOfflineManifestAssets(manifest);
  const availableUrls = new Set(allAssets.map((asset) => asset.url));
  const mode = choice.mode || "full";
  const catalogId = choice.catalogId || OFFLINE_CATALOG_OPTIONS[0].id;
  const videoQuality = choice.videoQuality || VIDEO_QUALITY_OPTIONS[0].id;
  let assets;

  if (mode === "app-only") {
    assets = allAssets.filter((asset) => !isVideoAssetUrl(asset.url));
  } else if (mode === "select") {
    assets = allAssets.filter(
      (asset) =>
        isAppShellAsset(asset.url) ||
        matchesOfflineCatalog(asset.url, catalogId),
    );
  } else {
    assets = allAssets;
  }

  if (mode !== "app-only") {
    assets = assets.filter((asset) =>
      shouldIncludeVideoQuality(asset.url, videoQuality, availableUrls),
    );
  }

  assets = dedupeOfflineAssets(assets);

  const bytes = assets.reduce(
    (sum, asset) => sum + (Number(asset.bytes) || 0),
    0,
  );
  const fallbackBytes =
    mode === "full" && !bytes ? Number(manifest?.bytes) || 0 : 0;

  return {
    bytes: bytes || fallbackBytes,
    catalogId,
    count: assets.length,
    label:
      mode === "app-only"
        ? getDownloadChoiceLabel({ mode, catalogId })
        : `${getDownloadChoiceLabel({ mode, catalogId })} - ${getVideoQualityLabel(videoQuality)}`,
    mode,
    urls: assets.map((asset) => asset.url),
    videoQuality,
  };
}

function renderDownloadEstimate(target, selection) {
  target.replaceChildren();

  const timeEl = document.createElement("span");
  timeEl.className = "download-estimate__highlight";
  timeEl.textContent = formatEstimatedDownloadTime(selection.bytes);

  const networkNoteEl = document.createElement("span");
  networkNoteEl.className = "download-estimate__note";
  networkNoteEl.textContent = t(
    "* Actual download speed may vary depending on network conditions.",
  );

  const sizeEl = document.createElement("span");
  sizeEl.className = "download-estimate__highlight";
  sizeEl.textContent = `${t("Download size:")} ${formatDownloadSize(
    selection.bytes,
  )}.`;

  target.append(timeEl, networkNoteEl, sizeEl);
}

function ensureDownloadAppModal() {
  let modal = document.getElementById("downloadAppModal");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "downloadAppModal";
  modal.className = "modal-overlay hidden";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "downloadAppTitle");
  modal.innerHTML = `
    <div class="modal-box download-modal">
      <div class="modal-header">
        <span id="downloadAppTitle" data-i18n="languageInstall.download_app_title">Download options</span>
        <button
          type="button"
          class="modal-close"
          id="closeDownloadAppModalBtn"
          aria-label="Close"
          data-i18n="languageInstall.closeButton:aria-label"
        >&times;</button>
      </div>
      <div class="modal-content"></div>
      <div class="modal-footer">
        <button type="button" id="notNowBtn" data-i18n="languageInstall.not_now_button">Not Now</button>
        <button type="button" id="downloadAllBtn" data-i18n="languageInstall.download_now_button">Download Now</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  try {
    window.I18N?.applyTranslations?.(modal);
  } catch {
    void 0;
  }
  return modal;
}

export function showDownloadAppModal(manifest) {
  return new Promise((resolve) => {
    const modal = ensureDownloadAppModal();
    if (!modal) {
      resolve({
        catalogId: OFFLINE_CATALOG_OPTIONS[0].id,
        mode: "full",
        videoQuality: VIDEO_QUALITY_OPTIONS[0].id,
      });
      return;
    }

    const closeBtn = document.getElementById("closeDownloadAppModalBtn");
    const notNowBtn = document.getElementById("notNowBtn");
    const downloadBtn = document.getElementById("downloadAllBtn");
    const titleEl = document.getElementById("downloadAppTitle");
    const content = modal.querySelector(".modal-content");

    if (titleEl) {
      titleEl.setAttribute("data-i18n", "languageInstall.download_app_title");
      titleEl.textContent = t("Download options");
    }
    if (content) {
      content.innerHTML = `
        <fieldset class="download-options" aria-label="${escapeHtml(
          t("Offline download options"),
        )}">
          <label class="download-option">
            <input type="radio" name="offlineDownloadMode" value="full" checked />
            <span>
              <span class="download-option__title">${escapeHtml(t("Download full content"))}</span>
              <span class="download-option__description">${escapeHtml(t("Includes all app features, videos and images."))}</span>
            </span>
          </label>
          <label class="download-option">
            <input type="radio" name="offlineDownloadMode" value="select" />
            <span>
              <span class="download-option__title">${escapeHtml(t("Select content"))}</span>
              <span class="download-option__description">${escapeHtml(t("Choose which content to download for offline use."))}</span>
            </span>
          </label>
          <div class="download-select-panel" hidden>
            <label for="offlineCatalogSelect">${escapeHtml(t("Content section"))}</label>
            <select id="offlineCatalogSelect">
              ${OFFLINE_CATALOG_OPTIONS.map(
                (option) =>
                  `<option value="${escapeHtml(option.id)}">${escapeHtml(
                    t(option.label),
                  )}</option>`,
              ).join("")}
            </select>
            <p id="offlineCatalogDescription"></p>
          </div>
          <div class="download-select-panel download-video-quality-panel">
            <label for="offlineVideoQualitySelect">${escapeHtml(t("Video quality"))}</label>
            <select id="offlineVideoQualitySelect">
              ${VIDEO_QUALITY_OPTIONS.map(
                (option) =>
                  `<option value="${escapeHtml(option.id)}">${escapeHtml(
                    t(option.label),
                  )}</option>`,
              ).join("")}
            </select>
            <p id="offlineVideoQualityDescription"></p>
          </div>
          <label class="download-option">
            <input type="radio" name="offlineDownloadMode" value="app-only" />
            <span>
              <span class="download-option__title">${escapeHtml(t("Exclude videos"))}</span>
              <span class="download-option__description">${escapeHtml(t("Downloads app pages, images, quizzes and other non-video content."))}</span>
            </span>
          </label>
        </fieldset>
        <p id="downloadEstimateText" class="download-estimate"></p>
        <p data-i18n="languageInstall.downloadStorageNotice">
          Full content requires about 1 GB of storage.
        </p>
      `;
    }

    closeBtn?.removeAttribute("hidden");
    notNowBtn?.removeAttribute("hidden");
    if (closeBtn) closeBtn.onclick = null;
    if (notNowBtn) {
      notNowBtn.setAttribute("data-i18n", "languageInstall.not_now_button");
      notNowBtn.textContent = t("Not Now");
    }
    if (downloadBtn) {
      downloadBtn.onclick = null;
      downloadBtn.removeAttribute("hidden");
      downloadBtn.disabled = false;
      downloadBtn.setAttribute(
        "data-i18n",
        "languageInstall.download_now_button",
      );
      downloadBtn.textContent = t("Download Now");
    }

    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      modal.classList.add("hidden");
      closeBtn?.removeEventListener("click", cancel);
      notNowBtn?.removeEventListener("click", cancel);
      downloadBtn?.removeEventListener("click", confirm);
      modal.removeEventListener("click", onOverlayClick);
      resolve(value);
    };

    const getChoice = () => {
      const mode =
        content?.querySelector('input[name="offlineDownloadMode"]:checked')
          ?.value || "full";
      const catalogId =
        content?.querySelector("#offlineCatalogSelect")?.value ||
        OFFLINE_CATALOG_OPTIONS[0].id;
      const videoQuality =
        content?.querySelector("#offlineVideoQualitySelect")?.value ||
        VIDEO_QUALITY_OPTIONS[0].id;
      return { catalogId, mode, videoQuality };
    };
    const updateChoiceDetails = () => {
      const choice = getChoice();
      const selection = resolveOfflineDownloadSelection(manifest, choice);
      const selectPanel = content?.querySelector(".download-select-panel");
      const videoQualityPanel = content?.querySelector(
        ".download-video-quality-panel",
      );
      const description = content?.querySelector("#offlineCatalogDescription");
      const videoQualityDescription = content?.querySelector(
        "#offlineVideoQualityDescription",
      );
      const estimate = content?.querySelector("#downloadEstimateText");
      const selectedCatalog = OFFLINE_CATALOG_OPTIONS.find(
        (option) => option.id === choice.catalogId,
      );
      const selectedVideoQuality = VIDEO_QUALITY_OPTIONS.find(
        (option) => option.id === choice.videoQuality,
      );

      if (selectPanel) selectPanel.hidden = choice.mode !== "select";
      if (videoQualityPanel)
        videoQualityPanel.hidden = choice.mode === "app-only";
      if (description)
        description.textContent = t(selectedCatalog?.description || "");
      if (videoQualityDescription) {
        videoQualityDescription.textContent = t(
          selectedVideoQuality?.description || "",
        );
      }
      if (estimate) renderDownloadEstimate(estimate, selection);
    };

    const cancel = () => finish(null);
    const confirm = () => finish(getChoice());
    const onOverlayClick = (event) => {
      if (event.target === modal) cancel();
    };

    closeBtn?.addEventListener("click", cancel);
    notNowBtn?.addEventListener("click", cancel);
    downloadBtn?.addEventListener("click", confirm);
    modal.addEventListener("click", onOverlayClick);
    content
      ?.querySelectorAll('input[name="offlineDownloadMode"]')
      .forEach((input) =>
        input.addEventListener("change", updateChoiceDetails),
      );
    content
      ?.querySelector("#offlineCatalogSelect")
      ?.addEventListener("change", updateChoiceDetails);
    content
      ?.querySelector("#offlineVideoQualitySelect")
      ?.addEventListener("change", updateChoiceDetails);
    window.I18N?.applyTranslations?.(modal);
    updateChoiceDetails();
    modal.classList.remove("hidden");
  });
}

function setDownloadModalBusy({ title, message, detail }) {
  const modal = document.getElementById("downloadAppModal");
  const titleEl = document.getElementById("downloadAppTitle");
  const content = modal?.querySelector(".modal-content");
  const closeBtn = document.getElementById("closeDownloadAppModalBtn");
  const notNowBtn = document.getElementById("notNowBtn");
  const downloadBtn = document.getElementById("downloadAllBtn");

  if (!modal || !titleEl || !content) return;

  titleEl.removeAttribute("data-i18n");
  titleEl.textContent = t(title);
  content.innerHTML = "";

  const messageEl = document.createElement("p");
  messageEl.textContent = t(message);
  content.appendChild(messageEl);

  const detailEl = document.createElement("p");
  detailEl.id = "downloadProgressText";
  detailEl.textContent = detail;
  content.appendChild(detailEl);

  closeBtn?.setAttribute("hidden", "");
  notNowBtn?.setAttribute("hidden", "");
  if (downloadBtn) {
    downloadBtn.disabled = true;
    downloadBtn.removeAttribute("data-i18n");
    downloadBtn.textContent = t("Downloading...");
  }

  modal.classList.remove("hidden");
}

function updateDownloadProgress(processed, total, failed = 0) {
  const progress = document.getElementById("downloadProgressText");
  if (!progress) return;

  const failureText = failed ? ` (${failed} ${t("failed")})` : "";
  progress.textContent = `${t("Downloaded")} ${processed} ${t(
    "of",
  )} ${total} ${t("files")}${failureText}.`;
}

export function showDownloadErrorModal(error) {
  const modal = ensureDownloadAppModal();
  const titleEl = document.getElementById("downloadAppTitle");
  const content = modal?.querySelector(".modal-content");
  const closeBtn = document.getElementById("closeDownloadAppModalBtn");
  const notNowBtn = document.getElementById("notNowBtn");
  const downloadBtn = document.getElementById("downloadAllBtn");

  if (!modal || !titleEl || !content) return;

  titleEl.removeAttribute("data-i18n");
  titleEl.textContent = t("Download incomplete");
  content.innerHTML = "";

  const messageEl = document.createElement("p");
  messageEl.textContent = t(
    "Some app content could not be downloaded. The items below may not work offline until you try again.",
  );
  content.appendChild(messageEl);

  const failedUrls = Array.isArray(error?.failedUrls) ? error.failedUrls : [];
  if (failedUrls.length) {
    const failedTitle = document.createElement("p");
    failedTitle.className = "download-failure-summary";
    failedTitle.textContent = t("Failed files:");
    content.appendChild(failedTitle);

    const failedList = document.createElement("ul");
    failedList.className = "download-failed-list";
    failedUrls.slice(0, MAX_FAILED_FILES_DISPLAY).forEach((url) => {
      const item = document.createElement("li");
      item.textContent = formatFailedAssetName(url);
      failedList.appendChild(item);
    });

    if (failedUrls.length > MAX_FAILED_FILES_DISPLAY) {
      const item = document.createElement("li");
      item.textContent = `${t("and")} ${
        failedUrls.length - MAX_FAILED_FILES_DISPLAY
      } ${t("more files")}`;
      failedList.appendChild(item);
    }

    content.appendChild(failedList);
  } else {
    const detailEl = document.createElement("p");
    detailEl.textContent = String(error?.message || error || "");
    content.appendChild(detailEl);
  }

  if (error?.downloadSelection) {
    const availableIntro = document.createElement("p");
    availableIntro.textContent = t(
      "Aside from those failed files, these are ready to use normally:",
    );
    content.appendChild(availableIntro);

    const availableList = document.createElement("ul");
    availableList.className = "download-available-list";
    getNormallyAvailableItems(error.downloadSelection).forEach((label) => {
      const item = document.createElement("li");
      item.textContent = label;
      availableList.appendChild(item);
    });
    content.appendChild(availableList);
  }

  closeBtn?.removeAttribute("hidden");
  notNowBtn?.removeAttribute("hidden");
  if (notNowBtn) {
    notNowBtn.removeAttribute("data-i18n");
    notNowBtn.textContent = t("Close");
    notNowBtn.onclick = () => hideDownloadAppModal();
  }
  if (closeBtn) {
    closeBtn.onclick = () => hideDownloadAppModal();
  }
  if (downloadBtn) {
    downloadBtn.setAttribute("hidden", "");
  }

  modal.classList.remove("hidden");
}

function hideDownloadAppModal() {
  document.getElementById("downloadAppModal")?.classList.add("hidden");
}

async function sendUrlsToServiceWorker(urls, onProgress) {
  const registration = await navigator.serviceWorker.ready;
  const worker = registration.active || navigator.serviceWorker.controller;
  if (!worker) {
    throw new Error("Service worker is not active yet.");
  }

  return await new Promise((resolve, reject) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = (event) => {
      const message = event.data || {};
      if (message.type === "CACHE_PROGRESS") {
        onProgress?.(message);
        return;
      }

      if (message.type === "CACHE_DONE") {
        if (message.failed?.length) {
          const downloadError = new Error(
            `${message.failed.length} files failed to download for offline use.`,
          );
          downloadError.cached = message.cached;
          downloadError.failedUrls = message.failed;
          downloadError.total = message.total;
          reject(downloadError);
          return;
        }
        resolve(message);
        return;
      }

      if (message.type === "CACHE_ERROR") {
        reject(new Error(message.error || "Offline download failed."));
      }
    };

    worker.postMessage({ type: "CACHE_URLS", payload: urls }, [channel.port2]);
  });
}

export async function cacheOfflineUrls(downloadSelection, totalBytes = 0) {
  const urlsToCache = Array.isArray(downloadSelection)
    ? downloadSelection
    : downloadSelection.urls;
  const selectedBytes = Array.isArray(downloadSelection)
    ? totalBytes
    : downloadSelection.bytes;
  const selectedLabel = Array.isArray(downloadSelection)
    ? "Selected content"
    : downloadSelection.label;
  const sizeText = formatDownloadSize(selectedBytes);

  setDownloadModalBusy({
    title: "Downloading app content",
    message: "Please keep the app open until the download is finished.",
    detail: `${t("Downloaded")} 0 ${t("of")} ${urlsToCache.length} ${t(
      "files",
    )}. ${t(selectedLabel)}: ${sizeText}.`,
  });

  try {
    await sendUrlsToServiceWorker(
      urlsToCache,
      ({ processed, total, failed }) => {
        updateDownloadProgress(processed, total, failed);
      },
    );
  } catch (error) {
    const downloadError =
      error instanceof Error
        ? error
        : new Error(String(error || "Offline download failed."));
    if (downloadSelection && !Array.isArray(downloadSelection)) {
      downloadError.downloadSelection = downloadSelection;
    }
    throw downloadError;
  }

  hideDownloadAppModal();
}

function normalizeChildhoodPilotSubtitleCacheLanguage(lang) {
  const normalized = String(lang || "")
    .trim()
    .toLowerCase();
  return CHILDHOOD_EYE_SCREENING_SUBTITLE_LANGUAGES.has(normalized)
    ? normalized
    : "en";
}

export function buildChildhoodEyeScreeningPilotCacheUrls(lang = "en") {
  const chosenLang = normalizeChildhoodPilotSubtitleCacheLanguage(lang);
  const subtitleLangs = Array.from(new Set(["en", chosenLang]));
  const subtitleUrls = [];

  CHILDHOOD_EYE_SCREENING_PILOT_SUBTITLE_TARGETS.forEach((target) => {
    const targetLangs = target.languages
      ? subtitleLangs.filter((subtitleLang) =>
          target.languages.has(subtitleLang),
        )
      : subtitleLangs;

    targetLangs.forEach((subtitleLang) => {
      subtitleUrls.push(`/video-subtitles/${target.path}/${subtitleLang}.vtt`);
    });
  });

  return Array.from(
    new Set([
      "/video-localization/childhood-eye-screening.json",
      "/video-localization/app-video-subtitles.json",
      ...CHILDHOOD_EYE_SCREENING_PILOT_VIDEO_URLS,
      ...subtitleUrls,
    ]),
  );
}

/**
 * Initializes the language installation page.
 * Sets up language preference handling, builds a custom language selection dropdown,
 * and configures event listeners for the 'Install App' and 'Use Online' buttons.
 */
export function initializeLanguageInstall() {
  const installBtn = document.getElementById("installAppBtn");
  const useOnlineBtn = document.getElementById("useOnlineBtn");
  const langSelect = document.getElementById("prefLang"); // matches HTML

  // ——— keep English as default unless previously chosen ———
  if (langSelect) {
    const saved = localStorage.getItem("prefLang");

    if (
      saved &&
      Array.from(langSelect.options).some((o) => o.value === saved)
    ) {
      // user had chosen before → restore it
      langSelect.value = saved;
    } else {
      // first run (no saved pref) → force English
      langSelect.value = "en";
      localStorage.setItem("prefLang", "en"); // baseline default
    }

    // Persist future user choices
    langSelect.addEventListener("change", async () => {
      localStorage.setItem("prefLang", langSelect.value);
      try {
        await saveProfile({ language: langSelect.value });
        // Tell the rest of the app immediately (Dev Dashboard can listen to this)
        document.dispatchEvent(
          new CustomEvent("language:updated", {
            detail: { code: langSelect.value },
          }),
        );

        // Best effort: ping backend to speed up visibility server-side.
        // But don't block the UI if the server 500s.
        try {
          await bumpRefresh();
          document.dispatchEvent(new CustomEvent("telemetry:refreshed"));
        } catch (err) {
          console.warn("bumpRefresh failed after language update:", err);
        }
      } catch {
        void 0;
      }
    });
  }

  // ——— build custom dropdown UI inside .lang-install__select-wrap ———
  if (langSelect && langSelect.closest(".lang-install__select-wrap")) {
    buildCustomLangSelect(langSelect);

    const refreshCustomLangSelect = () => {
      buildCustomLangSelect(langSelect);
    };

    window.addEventListener("i18n:languageChanged", refreshCustomLangSelect);
    document.addEventListener("language:updated", refreshCustomLangSelect);
  }

  // Set initial select value from saved pref
  if (langSelect) {
    const saved = getLanguage();
    if (saved) langSelect.value = saved;
    // Update app language immediately when changed
    langSelect.addEventListener("change", async (e) => {
      await setLanguage(e.target.value);
    });
  }

  function isIOS() {
    const ua = navigator.userAgent || "";
    const iOSDevice = /iPad|iPhone|iPod/.test(ua);
    const iPadOS13Plus = /Macintosh/.test(ua) && "ontouchend" in document;
    return iOSDevice || iPadOS13Plus;
  }

  function isAndroid() {
    const ua = navigator.userAgent || "";
    return /Android/.test(ua);
  }

  function getInstallHelpTemplateId() {
    if (isIOS()) {
      return "languageInstallHelpIos";
    }
    if (isAndroid()) {
      return "languageInstallHelpAndroid";
    }
    return "languageInstallHelpDefault";
  }
  // Install flow
  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      try {
        if (!canInstall()) {
          const isStandalone =
            window.matchMedia?.("(display-mode: standalone)")?.matches ||
            window.navigator.standalone === true;
          if (isStandalone) {
            try {
              const manifest = await fetchAllOfflineAssetUrls();
              const downloadChoice = await showDownloadAppModal(manifest);
              if (!downloadChoice) return;

              const downloadSelection = resolveOfflineDownloadSelection(
                manifest,
                downloadChoice,
              );
              await cacheOfflineUrls(downloadSelection);
            } catch (err) {
              console.warn("[install] could not cache standalone app:", err);
              showDownloadErrorModal(err);
              return;
            }

            loadPage("onboarding");
            return;
          }

          showLanguageHintModal(getInstallHelpTemplateId());
          return; // stay on language page
        }

        let downloadSelection = null;
        try {
          const offlineAssetManifest = await fetchAllOfflineAssetUrls();
          const downloadChoice =
            await showDownloadAppModal(offlineAssetManifest);
          if (!downloadChoice) return;
          downloadSelection = resolveOfflineDownloadSelection(
            offlineAssetManifest,
            downloadChoice,
          );
        } catch (manifestErr) {
          console.warn(
            "[install] could not load offline asset manifest:",
            manifestErr,
          );
          showDownloadErrorModal(manifestErr);
          return;
        }

        // Show native install prompt
        const result = await promptInstall();

        // promptInstall() in pwa.js returns a string: 'accepted' | 'dismissed'
        const accepted =
          result === true ||
          result === "accepted" ||
          (typeof result === "object" &&
            result &&
            result.outcome === "accepted");

        if (!accepted) {
          // User cancelled → stay on language page
          console.warn(
            "[install] user dismissed install prompt; staying on page",
          );
          return;
        }

        // Accepted → warm cache (best-effort) then advance
        try {
          await navigator.serviceWorker.ready;
          await cacheOfflineUrls(downloadSelection);
          console.warn(
            "[install] cached app assets:",
            downloadSelection.urls.length,
          );
        } catch (err) {
          console.warn("[install] could not warm cache:", err);
          showDownloadErrorModal(err);
          return;
        }

        try {
          const chosen =
            (langSelect && langSelect.value) || getLanguage() || "en";
          await saveProfile({ language: chosen });
          // Tell the rest of the app immediately (Dev Dashboard can listen to this)
          document.dispatchEvent(
            new CustomEvent("language:updated", {
              detail: { code: chosen },
            }),
          );

          // Best effort: ping backend to speed up visibility server-side.
          // But don't block the UI if the server 500s.
          try {
            await bumpRefresh();
            document.dispatchEvent(new CustomEvent("telemetry:refreshed"));
          } catch (err) {
            console.warn("bumpRefresh failed after language update:", err);
          }
        } catch {
          void 0;
        }
        loadPage("onboarding");
        return;
      } catch (e) {
        console.warn("Install prompt failed or not available:", e);

        // Fallback: if we’re already installed, proceed to onboarding
        const isStandalone =
          window.matchMedia?.("(display-mode: standalone)")?.matches ||
          window.navigator.standalone === true;
        if (isStandalone) {
          loadPage("onboarding");
          return;
        }

        // Otherwise, stay on this page
        return;
      }
    });
  }
  if (useOnlineBtn) {
    useOnlineBtn.addEventListener("click", async () => {
      try {
        const chosen =
          (langSelect && langSelect.value) || getLanguage() || "en";
        await saveProfile({ language: chosen });
        // Tell the rest of the app immediately (Dev Dashboard can listen to this)
        document.dispatchEvent(
          new CustomEvent("language:updated", {
            detail: { code: chosen },
          }),
        );

        // Best effort: ping backend to speed up visibility server-side.
        // But don't block the UI if the server 500s.
        try {
          await bumpRefresh();
          document.dispatchEvent(new CustomEvent("telemetry:refreshed"));
        } catch (err) {
          console.warn("bumpRefresh failed after language update:", err);
        }
      } catch {
        void 0;
      }
      loadPage("onboarding");
    });
  }

  // --- Info buttons for offline vs online hint text ---
  const offlineInfoBtn = document.getElementById("offlineInfoBtn");
  const onlineInfoBtn = document.getElementById("onlineInfoBtn");

  if (offlineInfoBtn) {
    offlineInfoBtn.addEventListener("click", () => {
      showLanguageHintModal(getInstallHelpTemplateId());
    });
  }

  if (onlineInfoBtn) {
    onlineInfoBtn.addEventListener("click", () => {
      showLanguageHintModal("languageInstallHintOnline");
    });
  }
}

/**
 * Shows a small info modal explaining the selected language install option.
 * Reuses the guest modal look and feel.
 * @param {string} templateId - Template id to render inside the modal body.
 */
function showLanguageHintModal(templateId) {
  // Prevent duplicates
  if (document.getElementById("hintModalOverlay")) return;

  const modalTemplate = document.getElementById(
    "languageInstallHintModalTemplate",
  );
  if (!modalTemplate) return;

  const modal = modalTemplate.content
    .querySelector("#hintModalOverlay")
    ?.cloneNode(true);

  if (!modal) return;

  const messageHost = modal.querySelector(".guest-modal__text");
  const messageTemplate = document.getElementById(templateId);
  if (messageHost && messageTemplate) {
    messageHost.appendChild(messageTemplate.content.cloneNode(true));
  }

  document.body.appendChild(modal);
  window.I18N?.applyTranslations?.(modal);

  const titleEl = modal.querySelector(".guest-modal__title");
  if (titleEl && !titleEl.textContent.trim()) {
    titleEl.hidden = true;
  }

  const close = () => {
    modal.classList.add("fade-out");
    setTimeout(() => modal.remove(), 250);
  };

  modal.querySelector(".guest-modal__close")?.addEventListener("click", close);
  modal.querySelector(".guest-modal__cta")?.addEventListener("click", close);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
}

/**
 * Builds a custom styled dropdown UI for language selection, replacing the native <select> element.
 * The native <select> is hidden but kept in the DOM for accessibility and form value handling.
 * @param {HTMLSelectElement} selectEl - The native <select> element to be replaced by the custom UI.
 */
function buildCustomLangSelect(selectEl) {
  const wrap = selectEl.closest(".lang-install__select-wrap");
  if (!wrap) return;

  wrap
    .querySelectorAll("[data-custom-lang-select]")
    .forEach((el) => el.remove());

  // Hide native select but keep it in the DOM as the source of truth.
  selectEl.classList.add("ui-source-control");

  // Control (closed state)
  const ctrl = document.createElement("button");
  ctrl.className = "lang-install__custom-select";
  ctrl.type = "button";
  ctrl.setAttribute("aria-haspopup", "listbox");
  ctrl.setAttribute("aria-expanded", "false");
  ctrl.setAttribute("data-custom-lang-select", "true");

  // Chevron
  const caret = document.createElement("span");
  caret.className = "lang-install__custom-select-caret";
  caret.textContent = "\u25BE";

  // Label (two-column inside the "select" box)
  const label = document.createElement("div");
  label.className = "lang-install__custom-select-label";

  // Dropdown list
  const list = document.createElement("ul");
  list.className = "lang-install__list lang-install__dropdown";
  list.setAttribute("role", "listbox");
  list.setAttribute("data-custom-lang-select", "true");
  list.hidden = true;

  // Build options (li)
  Array.from(selectEl.options).forEach((opt) => {
    const li = document.createElement("li");
    li.className = "lang-install__item";
    li.setAttribute("role", "option");
    li.dataset.value = opt.value;

    const rawEnglish = (opt.textContent || "")
      .replace(/\s*\(.*\)\s*/g, "")
      .trim();
    const english = ENGLISH_LANGUAGE_LABELS[opt.value] || rawEnglish;
    const native = opt.getAttribute("data-native") || english;

    const left = document.createElement("span");
    left.className = "lang-install__item-en";
    left.textContent = english;

    if (opt.value === "en") {
      li.appendChild(left);
    } else {
      const right = document.createElement("span");
      right.className = "lang-install__item-native";
      right.textContent = native;
      li.appendChild(left);
      li.appendChild(right);
    }

    li.addEventListener("click", () => {
      selectEl.value = opt.value;
      updateLabel();
      list.hidden = true;
      ctrl.classList.remove("is-open");
      ctrl.setAttribute("aria-expanded", "false");
      selectEl.dispatchEvent(new Event("change", { bubbles: true }));
    });

    list.appendChild(li);
  });

  /**
   * Updates the displayed label of the custom language select control
   * to reflect the currently selected language, showing both English and native names.
   */
  function updateLabel() {
    const current = selectEl.options[selectEl.selectedIndex];
    const rawEnglish = (current.textContent || "")
      .replace(/\s*\(.*\)\s*/g, "")
      .trim();
    const english = ENGLISH_LANGUAGE_LABELS[current.value] || rawEnglish;
    const native = current.getAttribute("data-native") || english;

    label.textContent = "";
    const left = document.createElement("span");
    left.className = "lang-install__item-en";
    left.textContent = english;
    label.appendChild(left);

    if (current.value !== "en") {
      const right = document.createElement("span");
      right.className = "lang-install__item-native";
      right.textContent = native;
      label.appendChild(right);
    }
  }

  ctrl.addEventListener("click", () => {
    const open = !list.hidden;
    list.hidden = open;
    ctrl.classList.toggle("is-open", !open);
    ctrl.setAttribute("aria-expanded", String(!open));
  });

  // Click-away to close
  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) {
      list.hidden = true;
      ctrl.classList.remove("is-open");
      ctrl.setAttribute("aria-expanded", "false");
    }
  });

  updateLabel();
  ctrl.appendChild(label);
  ctrl.appendChild(caret);
  wrap.appendChild(ctrl);
  wrap.appendChild(list);
}
