import { DIABETIC_IMAGE_CASES } from "./viewer-config.js?v=20260519-viewer";

export const PRACTICE_CASES = DIABETIC_IMAGE_CASES.map((item, index) => ({
  id: item.id,
  level: index === 0 ? "primary" : index < 4 ? "intermediate" : "advanced",
  title: `Case ${index + 1}`,
  imageLabel: `${index + 1}/10`,
  imageSrc: item.thumbSrc || item.src,
  prompt: item.summary,
  answer: item.description || [],
}));
