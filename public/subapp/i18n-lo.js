(function initializeSubappLocale() {
  const language = String(localStorage.getItem("prefLang") || "")
    .trim()
    .toLowerCase();
  const isLao = language === "lo" || language === "lao";
  const isSpanish = language === "es" || language === "spanish";
  if (!isLao && !isSpanish) return;

  const localeName = isLao ? "lao" : "spanish";
  document.documentElement.lang = isLao ? "lo" : "es";

  const laoFallbackTranslations = {
    Menu: "ເມນູ",
    Learn: "ຮຽນຮູ້",
    Save: "ບັນທຶກ",
    Close: "ປິດ",
    Next: "ຕໍ່ໄປ",
    Previous: "ກ່ອນໜ້າ",
    Back: "ກັບຄືນ",
    Start: "ເລີ່ມ",
    Stop: "ຢຸດ",
    Test: "ທົດສອບ",
    Practice: "ຝຶກຝົນ",
    Results: "ຜົນໄດ້ຮັບ",
    Reset: "ຕັ້ງຄ່າໃໝ່",
    Submit: "ສົ່ງຄຳຕອບ",
    Primary: "ຂັ້ນພື້ນຖານ",
    Intermediate: "ຂັ້ນກາງ",
    Advanced: "ຂັ້ນສູງ",
    "test me": "ທົດສອບຂ້ອຍ",
    "stop test": "ຢຸດການທົດສອບ",
    "Open menu": "ເປີດເມນູ",
    "Close menu": "ປິດເມນູ",
    "Main menu": "ເມນູຫຼັກ",
    "Open MCQ menu": "ເປີດເມນູຄຳຖາມເລືອກຕອບ",
    "MCQ side menu": "ເມນູຂ້າງຂອງຄຳຖາມເລືອກຕອບ",
    "MCQ Levels": "ລະດັບຄຳຖາມເລືອກຕອບ",
    "Primary has simple language. Advanced is detailed.":
      "ຂັ້ນພື້ນຖານໃຊ້ພາສາງ່າຍ. ຂັ້ນສູງມີລາຍລະອຽດຫຼາຍ.",
    "Primary MCQs": "ຄຳຖາມເລືອກຕອບຂັ້ນພື້ນຖານ",
    "Intermediate MCQs": "ຄຳຖາມເລືອກຕອບຂັ້ນກາງ",
    "Advanced MCQs": "ຄຳຖາມເລືອກຕອບຂັ້ນສູງ",
    "Open instructions": "ເປີດຄຳແນະນຳ",
    "Close instructions": "ປິດຄຳແນະນຳ",
    "Open app info": "ເປີດຂໍ້ມູນແອັບ",
    "Close app info": "ປິດຂໍ້ມູນແອັບ",
    "Primary MCQ": "ຄຳຖາມເລືອກຕອບຂັ້ນພື້ນຖານ",
    "Intermediate MCQ": "ຄຳຖາມເລືອກຕອບຂັ້ນກາງ",
    "Advanced MCQ": "ຄຳຖາມເລືອກຕອບຂັ້ນສູງ",
    "Cup locked: complete Advanced MCQ":
      "ຖ້ວຍລາງວັນຍັງຖືກລັອກ: ເຮັດຄຳຖາມຂັ້ນສູງໃຫ້ສຳເລັດ",
    "Digital palpation": "ການຄຳຄວາມດັນຕາດ້ວຍນິ້ວ",
    Palp: "ຄຳດ້ວຍນິ້ວ",
    Firm: "ແຂງ",
    Rock: "ແຂງຫຼາຍ",
    "Thin rim/notch, Haem, Lam Crib, BV's?":
      "ຂອບບາງ/ຮອຍບາກ, ເລືອດອອກ, lamina cribrosa, ຫຼອດເລືອດ?",
    "Susp Fields?": "ສົງໄສລານສາຍຕາ?",
    "Susp Pupils?": "ສົງໄສຮູມ່ານຕາ?",
    Age: "ອາຍຸ",
    Race: "ເຊື້ອຊາດ",
    "Family Hist": "ປະຫວັດຄອບຄົວ",
    Diabetes: "ເບົາຫວານ",
    RE: "ຕາຂວາ",
    LE: "ຕາຊ້າຍ",
    "Open patient information": "ເປີດຂໍ້ມູນຜູ້ປ່ວຍ",
    Patient: "ຜູ້ປ່ວຍ",
    Flash: "ກະພິບ",
    Red: "ສີແດງ",
    Diag: "ແນວທະແຍງ",
    Pen: "ປາກກາ",
    Erase: "ລຶບ",
    Haemorrhage: "ເລືອດອອກ",
    "Open stroke settings": "ເປີດການຕັ້ງຄ່າເສັ້ນ",
    "Results:": "ຜົນໄດ້ຮັບ:",
    Compute: "ຄຳນວນ",
    "Generate report": "ສ້າງລາຍງານ",
    Report: "ລາຍງານ",
  };

  const fallbackTranslations = isLao ? laoFallbackTranslations : {};

  const translations = new Map(Object.entries(fallbackTranslations));
  const translatedAttributes = ["aria-label", "title", "placeholder", "alt"];
  const laoEmbeddedClinicalTerms = [
    ["Pain/Redness:", "ອາການເຈັບ/ແດງ:"],
    ["DR/Scar", "ເບົາຫວານຂຶ້ນຈໍຕາ/ຮອຍແປ້ວ"],
    ["Conditions", "ພະຍາດ"],
    ["Condition", "ພະຍາດ"],
    ["Eyes", "ຕາ"],
    ["Cataract:", "ຕໍ້ກະຈົກ:"],
    ["cataract", "ຕໍ້ກະຈົກ"],
    ["Cupped", "ຂົ້ວປະສາດຕາບຸ໋ມ"],
    ["Detached", "ຈໍຕາຫຼຸດລອກ"],
    ["refractive", "ການຫັກແສງ"],
    ["pupils", "ຮູມ່ານຕາ"],
    ["pupil", "ຮູມ່ານຕາ"],
    ["fundus", "ກົ້ນຕາ"],
    ["Reflex", "ການສະທ້ອນ"],
    ["Field:", "ລານສາຍຕາ:"],
    ["Child:", "ເດັກ:"],
    ["Eyes:", "ຕາ:"],
    ["Age:", "ອາຍຸ:"],
    ["mths", "ເດືອນ"],
    ["days", "ມື້"],
    ["deg", "ອົງສາ"],
  ];
  const spanishEmbeddedClinicalTerms = [
    ["Pain/Redness:", "Dolor/enrojecimiento:"],
    ["DR/Scar", "RD/cicatriz"],
    ["Conditions", "Enfermedades"],
    ["Condition", "Enfermedad"],
    ["Eyes", "Ojos"],
    ["Cataract:", "Catarata:"],
    ["cataract", "catarata"],
    ["Cupped", "Excavado"],
    ["Detached", "Desprendida"],
    ["refractive", "refractivo"],
    ["pupil", "pupila"],
    ["pupils", "pupilas"],
    ["fundus", "fondo de ojo"],
    ["Reflex", "Reflejo"],
    ["Field:", "Campo visual:"],
    ["Child:", "Niño:"],
    ["Eyes:", "Ojos:"],
    ["Age:", "Edad:"],
    ["mths", "meses"],
    ["days", "días"],
    ["deg", "grados"],
  ];
  const embeddedClinicalTerms = isLao
    ? laoEmbeddedClinicalTerms
    : spanishEmbeddedClinicalTerms;
  let translating = false;

  function translateEmbeddedClinicalTerms(value) {
    let result = value;
    embeddedClinicalTerms.forEach(([english, translated]) => {
      const escaped = english.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const startsWithWord = /^[A-Za-z0-9_]/.test(english);
      const endsWithWord = /[A-Za-z0-9_]$/.test(english);
      const pattern = new RegExp(
        `${startsWithWord ? "\\b" : ""}${escaped}${endsWithWord ? "\\b" : ""}`,
        "g",
      );
      result = result.replace(pattern, translated);
    });
    return result;
  }

  function translateValue(value) {
    const original = String(value || "");
    const normalized = original.replace(/\s+/g, " ").trim();
    if (!normalized) return original;
    let translated = translations.get(normalized);
    if (!translated) {
      const numbered = normalized.match(/^(\d+\.\s*)(.+)$/);
      const translatedQuestion = numbered
        ? translations.get(numbered[2])
        : null;
      if (translatedQuestion)
        translated = `${numbered[1]}${translatedQuestion}`;
    }
    if (!translated) {
      const score = normalized.match(/^(\d+) questions?\. Pass mark (\d+)\.$/i);
      if (score) {
        translated = isLao
          ? `${score[1]} ຄຳຖາມ. ຄະແນນຜ່ານ ${score[2]}.`
          : `${score[1]} preguntas. Nota mínima ${score[2]}.`;
      }
    }
    if (!translated) {
      const embedded = translateEmbeddedClinicalTerms(original);
      return embedded === original ? original : embedded;
    }
    translated = translateEmbeddedClinicalTerms(translated);
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    return `${leading}${translated}${trailing}`;
  }

  function translateElement(element) {
    if (!(element instanceof Element)) return;
    if (element.closest("[data-i18n-skip]")) return;
    translatedAttributes.forEach((attribute) => {
      const current = element.getAttribute(attribute);
      if (!current) return;
      const translated = translateValue(current);
      if (translated !== current) element.setAttribute(attribute, translated);
    });
  }

  function translateTree(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      if (root.parentElement?.closest("[data-i18n-skip]")) return;
      const translated = translateValue(root.textContent);
      if (translated !== root.textContent) root.textContent = translated;
      return;
    }
    if (!(root instanceof Element) && root !== document) return;
    if (root instanceof Element) translateElement(root);
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    );
    let node = walker.nextNode();
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.parentElement?.closest("[data-i18n-skip]")) {
          node = walker.nextNode();
          continue;
        }
        const translated = translateValue(node.textContent);
        if (translated !== node.textContent) node.textContent = translated;
      } else {
        translateElement(node);
      }
      node = walker.nextNode();
    }
  }

  const observer = new MutationObserver((records) => {
    if (translating) return;
    translating = true;
    try {
      records.forEach((record) => {
        if (record.type === "characterData") {
          translateTree(record.target);
        } else if (record.type === "attributes") {
          translateElement(record.target);
        } else {
          record.addedNodes.forEach(translateTree);
        }
      });
    } finally {
      translating = false;
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: translatedAttributes,
    characterData: true,
    childList: true,
    subtree: true,
  });

  fetch(`/translation/${localeName}.json`)
    .then((response) => {
      if (!response.ok)
        throw new Error(
          `${localeName} locale request failed: ${response.status}`,
        );
      return response.json();
    })
    .then((locale) => {
      Object.entries(locale?.i18nLiteral || {}).forEach(
        ([english, translated]) => {
          if (typeof translated === "string" && translated.trim())
            translations.set(english, translated);
        },
      );
      translateTree(document);
    })
    .catch(() => {
      translateTree(document);
    });
})();
