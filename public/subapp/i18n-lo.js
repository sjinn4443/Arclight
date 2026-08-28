(function initializeSubappLao() {
  const language = String(localStorage.getItem("prefLang") || "")
    .trim()
    .toLowerCase();
  if (language !== "lo" && language !== "lao") return;

  document.documentElement.lang = "lo";

  const fallbackTranslations = {
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

  const translations = new Map(Object.entries(fallbackTranslations));
  const translatedAttributes = ["aria-label", "title", "placeholder", "alt"];
  let translating = false;

  function translateValue(value) {
    const original = String(value || "");
    const normalized = original.replace(/\s+/g, " ").trim();
    if (!normalized) return original;
    const translated = translations.get(normalized);
    if (!translated) return original;
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    return `${leading}${translated}${trailing}`;
  }

  function translateElement(element) {
    if (!(element instanceof Element)) return;
    translatedAttributes.forEach((attribute) => {
      const current = element.getAttribute(attribute);
      if (!current) return;
      const translated = translateValue(current);
      if (translated !== current) element.setAttribute(attribute, translated);
    });
  }

  function translateTree(root) {
    if (root.nodeType === Node.TEXT_NODE) {
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

  fetch("/translation/lao.json")
    .then((response) => {
      if (!response.ok)
        throw new Error(`Lao locale request failed: ${response.status}`);
      return response.json();
    })
    .then((locale) => {
      Object.entries(locale?.i18nLiteral || {}).forEach(([english, lao]) => {
        if (typeof lao === "string" && lao.trim())
          translations.set(english, lao);
      });
      translateTree(document);
    })
    .catch(() => {
      translateTree(document);
    });
})();
