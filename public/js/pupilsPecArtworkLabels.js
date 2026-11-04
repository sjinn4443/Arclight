export const PUPILS_PEC_OBSERVATION_LABELS = {
  en: [
    "Normal",
    "Abnormal colour / shape",
    "Left 3rd CNP",
    "Right Sympathetic Palsy",
  ],
  "es-419": [
    "Normal",
    "Color / forma anormal",
    "Parálisis del III par izquierdo",
    "Parálisis simpática derecha",
  ],
  ko: [
    "정상",
    "비정상 색 / 모양",
    "왼쪽 제3뇌신경 마비",
    "오른쪽 교감신경 마비",
  ],
  ne: [
    "सामान्य",
    "असामान्य रङ / आकृति",
    "बायाँ तेस्रो कपाल स्नायु पक्षाघात",
    "दायाँ सिम्प्याथेटिक पक्षाघात",
  ],
  fr: [
    "Normal",
    "Couleur / forme anormale",
    "Paralysie du III gauche",
    "Paralysie sympathique droite",
  ],
  lg: [
    "Kya bulijjo",
    "Langi / enkula etali ya bulijjo",
    "Obusannyalavu bwa navi eyokusatu ku kkono",
    "Obusannyalavu bwa navi ya simpatetiki ku ddyo",
  ],
  ha: [
    "Na al’ada",
    "Launi / siffa ba daidai ba",
    "Shanyewar jijiyar kai ta uku a hagu",
    "Shanyewar jijiyar simpatetik a dama",
  ],
  yo: [
    "Déédéé",
    "Àwọ̀ / ìrísí tí kò bójú mu",
    "Àìṣiṣẹ́ iṣan ara orí kẹta òsì",
    "Àìṣiṣẹ́ iṣan simpatetiki ọ̀tún",
  ],
  ig: [
    "Dị mma",
    "Agba / ọdịdị na-adịghị mma",
    "Mkpọnwụ akwara isi nke atọ n’aka ekpe",
    "Mkpọnwụ akwara simpatetik n’aka nri",
  ],
};

// Cover only the four raster label bands. Faces, dividers and symbols stay original.
export function renderPupilsPecArtworkLabels(state, frame, language) {
  if (state.fileIndex !== 0 || !state.stage) return;
  let overlay = state.stage.querySelector(".pupils-pec-artwork-labels");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "pupils-pec-artwork-labels";
    for (let i = 0; i < 4; i++) {
      const band = document.createElement("div");
      band.className = "pupils-pec-artwork-label";
      const text = document.createElement("span");
      band.appendChild(text);
      overlay.appendChild(band);
    }
    state.stage.appendChild(overlay);
  }
  const selected = PUPILS_PEC_OBSERVATION_LABELS[language] ? language : "en";
  if (overlay.lang !== selected) {
    overlay.lang = selected;
    PUPILS_PEC_OBSERVATION_LABELS[selected].forEach((text, i) => {
      overlay.children[i].firstChild.textContent = text;
    });
  }
  const opacity = Math.max(0, Math.min(1, (Number(frame) - 420) / 45));
  overlay.style.setProperty("--label-opacity", String(opacity));
  overlay.setAttribute("aria-hidden", opacity === 0 ? "true" : "false");
}
