(function initializeFundalReflexLao() {
  const language = String(localStorage.getItem("prefLang") || "")
    .trim()
    .toLowerCase();
  if (language !== "lo" && language !== "lao") return;

  document.documentElement.lang = "lo";
  document.title = "ການສະທ້ອນແສງຈາກກົ້ນຕາ";

  const translations = new Map(
    Object.entries({
      "Fundal Reflex": "ການສະທ້ອນແສງຈາກກົ້ນຕາ",
      Menu: "ເມນູ",
      "Open menu": "ເປີດເມນູ",
      "Main menu": "ເມນູຫຼັກ",
      "Open instructions": "ເປີດຄຳແນະນຳ",
      "Close instructions": "ປິດຄຳແນະນຳ",
      Learn: "ຮຽນຮູ້",
      "Primary MCQ": "ຄຳຖາມເລືອກຕອບຂັ້ນພື້ນຖານ",
      "Intermediate MCQ": "ຄຳຖາມເລືອກຕອບຂັ້ນກາງ",
      "Advanced MCQ": "ຄຳຖາມເລືອກຕອບຂັ້ນສູງ",
      "Cup locked: complete Advanced MCQ":
        "ຖ້ວຍລາງວັນຍັງຖືກລັອກ: ເຮັດຄຳຖາມຂັ້ນສູງໃຫ້ສຳເລັດ",
      Save: "ບັນທຶກ",
      "Test me": "ທົດສອບຂ້ອຍ",
      "test me": "ທົດສອບຂ້ອຍ",
      "stop test": "ຢຸດການທົດສອບ",
      "Quick guide": "ຄູ່ມືດ່ວນ",
      "Fundal reflex": "ການສະທ້ອນແສງຈາກກົ້ນຕາ",
      fundal: "ກົ້ນຕາ",
      red: "ສີແດງ",
      "The fundal reflex is the glow in the pupil from the fundus, seen with Arclight at arm's length. We use fundal reflex rather than red reflex. In those with darker pigmentation, a normal reflex may look orange-yellow or blue-white. Bright, equal and round is reassuring. Null, milky or black means the back is not being seen.":
        "ການສະທ້ອນແສງຈາກກົ້ນຕາແມ່ນແສງທີ່ສ່ອງອອກຈາກກົ້ນຕາຜ່ານຮູມ່ານຕາ ເມື່ອໃຊ້ Arclight ກວດໃນໄລຍະແຂນ. ພວກເຮົາໃຊ້ຄຳວ່າການສະທ້ອນແສງຈາກກົ້ນຕາ ແທນການສະທ້ອນສີແດງ. ໃນຜູ້ທີ່ມີເມັດສີເຂັ້ມ ການສະທ້ອນປົກກະຕິອາດເປັນສີສົ້ມ-ເຫຼືອງ ຫຼື ຟ້າ-ຂາວ. ການສະທ້ອນທີ່ສະຫວ່າງ, ເທົ່າກັນ ແລະ ກົມເປັນສັນຍານທີ່ດີ. ຖ້າບໍ່ມີແສງ, ຂາວຂຸ່ນ ຫຼື ດຳ ໝາຍເຖິງມອງບໍ່ເຫັນສ່ວນຫຼັງຂອງຕາ.",
      "Dim light, calm patient. Compare both eyes for brightness, colour and shape. Move side to side, then closer.":
        "ຫຼຸດແສງໃນຫ້ອງ ແລະ ໃຫ້ຜູ້ປ່ວຍຜ່ອນຄາຍ. ປຽບທຽບຄວາມສະຫວ່າງ, ສີ ແລະ ຮູບຮ່າງຂອງຕາທັງສອງ. ເຄື່ອນໄປຊ້າຍ-ຂວາ ແລ້ວຈຶ່ງເຂົ້າໃກ້.",
      Basics: "ພື້ນຖານ",
      Match: "ກົງກັນ",
      "same both sides?": "ທັງສອງຂ້າງຄືກັນບໍ?",
      Bright: "ສະຫວ່າງ",
      "clear reflex?": "ການສະທ້ອນຊັດເຈນບໍ?",
      Straight: "ຕາຢູ່ຊື່",
      "eyes aligned?": "ຕາທັງສອງຢູ່ແນວດຽວກັນບໍ?",
      "More detail": "ລາຍລະອຽດເພີ່ມເຕີມ",
      "Light + colour:": "ແສງ + ສີ:",
      "Shape + crescent:": "ຮູບຮ່າງ + ຮູບຈັນສ້ຽວ:",
      "Cornea + compare:": "ກະຈົກຕາ + ປຽບທຽບ:",
      "Use Cases to practise. Use Learn for the visual handout.":
        "ໃຊ້ ‘ກໍລະນີ’ ເພື່ອຝຶກ ແລະ ໃຊ້ ‘ຮຽນຮູ້’ ເພື່ອເບິ່ງໃບຄູ່ມືຮູບພາບ.",
      "Teaching aid, not final diagnosis.":
        "ເປັນສື່ຊ່ວຍສອນ ບໍ່ແມ່ນການວິນິດໄຊສຸດທ້າຍ.",
      "Learn from the handout": "ຮຽນຮູ້ຈາກໃບຄູ່ມື",
      "Visual handout": "ໃບຄູ່ມືຮູບພາບ",
      "Get a good view": "ເຮັດໃຫ້ເຫັນຊັດ",
      "Dim light. Calm or swaddle. Start at arm's length, then move side to side and closer.":
        "ຫຼຸດແສງ ແລະ ໃຫ້ເດັກສະຫງົບ ຫຼື ຫໍ່ຕົວ. ເລີ່ມຈາກໄລຍະແຂນ ແລ້ວເຄື່ອນໄປຊ້າຍ-ຂວາ ແລະ ເຂົ້າໃກ້.",
      "Looking away": "ເບິ່ງໄປທາງອື່ນ",
      "If the child is not looking, adjust and repeat before judging.":
        "ຖ້າເດັກບໍ່ໄດ້ເບິ່ງກົງ ໃຫ້ປັບທ່າ ແລະ ກວດຊ້ຳກ່ອນປະເມີນ.",
      "Lids blocking": "ໜັງຕາບັງ",
      "If the pupil is partly covered, open gently and repeat.":
        "ຖ້າຮູມ່ານຕາຖືກບັງບາງສ່ວນ ໃຫ້ເປີດໜັງຕາຢ່າງນຸ່ມນວນ ແລະ ກວດຊ້ຳ.",
      "Normal can vary": "ລັກສະນະປົກກະຕິອາດແຕກຕ່າງ",
      "In those with darker pigmentation, a normal reflex may look orange-yellow or blue-white. Bright, equal and round is reassuring.":
        "ໃນຜູ້ທີ່ມີເມັດສີເຂັ້ມ ການສະທ້ອນປົກກະຕິອາດເປັນສີສົ້ມ-ເຫຼືອງ ຫຼື ຟ້າ-ຂາວ. ຖ້າສະຫວ່າງ, ເທົ່າກັນ ແລະ ກົມ ຖືວ່າເປັນສັນຍານທີ່ດີ.",
      "Unclear is active": "ຖ້າບໍ່ຊັດ ໃຫ້ດຳເນີນການ",
      "Do not guess. Improve the view, repeat or ask for help.":
        "ຢ່າຄາດເດົາ. ປັບໃຫ້ເຫັນຊັດຂຶ້ນ, ກວດຊ້ຳ ຫຼື ຂໍຄວາມຊ່ວຍເຫຼືອ.",
      "Ask for help": "ຂໍຄວາມຊ່ວຍເຫຼືອ",
      "A photo or another trained person can help decide repeat or refer.":
        "ຮູບຖ່າຍ ຫຼື ຜູ້ທີ່ຜ່ານການຝຶກອົບຮົມອີກຄົນໜຶ່ງ ສາມາດຊ່ວຍຕັດສິນວ່າຄວນກວດຊ້ຳ ຫຼື ສົ່ງຕໍ່.",
      "Refer when abnormal": "ສົ່ງຕໍ່ເມື່ອພົບຄວາມຜິດປົກກະຕິ",
      "White, dull, absent, black or very unequal reflexes may mean scar, cataract or haemorrhage.":
        "ການສະທ້ອນທີ່ຂາວ, ມົວ, ບໍ່ມີ, ດຳ ຫຼື ບໍ່ເທົ່າກັນຫຼາຍ ອາດໝາຍເຖິງຮອຍແປ້ວ, ຕໍ້ກະຈົກ ຫຼື ເລືອດອອກ.",
      "Try case 3": "ລອງກໍລະນີ 3",
      "Try case 4": "ລອງກໍລະນີ 4",
      "Try case 5": "ລອງກໍລະນີ 5",
      "Try case 7": "ລອງກໍລະນີ 7",
      "Try case 8": "ລອງກໍລະນີ 8",
      "Case 1": "ກໍລະນີ 1",
      "Case 2": "ກໍລະນີ 2",
      "Close learn": "ປິດໜ້າຮຽນຮູ້",
      "Learn sections": "ພາກສ່ວນການຮຽນຮູ້",
      Handout: "ໃບຄູ່ມື",
      Explain: "ຄຳອະທິບາຍ",
      "The one-page sheet is the shared visual reference. It is almost word-free so it can work across languages.":
        "ໃບຄູ່ມືໜຶ່ງໜ້ານີ້ເປັນເອກະສານອ້າງອີງຮູບພາບຮ່ວມກັນ. ມີຂໍ້ຄວາມໜ້ອຍ ເພື່ອໃຫ້ໃຊ້ໄດ້ໃນຫຼາຍພາສາ.",
      "One-page fundal reflex visual handout":
        "ໃບຄູ່ມືຮູບພາບການສະທ້ອນແສງຈາກກົ້ນຕາໜຶ່ງໜ້າ",
      "Short notes for the pictures. Use the buttons to try the same idea in the app.":
        "ຄຳອະທິບາຍສັ້ນສຳລັບຮູບພາບ. ໃຊ້ປຸ່ມເພື່ອລອງແນວຄິດດຽວກັນໃນແອັບ.",
      "PDF for print. Image for sharing.": "PDF ສຳລັບພິມ. ຮູບພາບສຳລັບແບ່ງປັນ.",
      "Download PDF": "ດາວໂຫຼດ PDF",
      "Share image": "ແບ່ງປັນຮູບພາບ",
      "Close MCQ": "ປິດຄຳຖາມເລືອກຕອບ",
      "MCQ Test": "ການທົດສອບແບບເລືອກຕອບ",
      "Submit Test": "ສົ່ງຄຳຕອບ",
      Cases: "ກໍລະນີ",
      "Close cases": "ປິດກໍລະນີ",
      "Pick closest match. Camera icon = photo.":
        "ເລືອກອັນທີ່ໃກ້ຄຽງທີ່ສຸດ. ໄອຄອນກ້ອງ = ຮູບພາບ.",
      "Similar cases": "ກໍລະນີຄ້າຍຄື",
      "Case teaching cards": "ບັດການສອນກໍລະນີ",
      "Reference photo": "ຮູບອ້າງອີງ",
      "Case photo": "ຮູບກໍລະນີ",
      "Close reference photo": "ປິດຮູບອ້າງອີງ",
      Colour: "ສີ",
      "Reflex Colour": "ສີຂອງການສະທ້ອນ",
      Blue: "ຟ້າ",
      Red: "ແດງ",
      Gaze: "ທິດທາງການເບິ່ງ",
      Dilated: "ຮູມ່ານຕາຂະຫຍາຍ",
      Baby: "ເດັກນ້ອຍ",
      "Open advanced controls": "ເປີດຕົວຄວບຄຸມຂັ້ນສູງ",
      "Close advanced controls": "ປິດຕົວຄວບຄຸມຂັ້ນສູງ",
      Adv: "ຂັ້ນສູງ",
      squint: "ຕາເຫຼ່",
      "drag eyes": "ລາກຕາ",
      iris: "ມ່ານຕາ",
      "Iris colour": "ສີມ່ານຕາ",
      dark: "ເຂັ້ມ",
      brown: "ນ້ຳຕານ",
      green: "ຂຽວ",
      blue: "ຟ້າ",
      context: "ບໍລິບົດ",
      pupil: "ຮູມ່ານຕາ",
      lid: "ໜັງຕາ",
      cataract: "ຕໍ້ກະຈົກ",
      nystagmus: "ຕາສັ່ນ",
      on: "ເປີດ",
      dir: "ທິດ",
      wave: "ຮູບແບບ",
      rate: "ຄວາມໄວ",
      Mixed: "ປະສົມ",
      Jerk: "ກະຕຸກ",
      Pendular: "ແກວ່ງ",
      Slow: "ຊ້າ",
      Med: "ປານກາງ",
      Fast: "ໄວ",
      "Test mode": "ໂໝດທົດສອບ",
      Next: "ຕໍ່ໄປ",
      "Observation guide": "ຄູ່ມືການສັງເກດ",
      "Close observation guide": "ປິດຄູ່ມືການສັງເກດ",
      "Open observation guide": "ເປີດຄູ່ມືການສັງເກດ",
      "Observation guide cues": "ຈຸດແນະນຳການສັງເກດ",
      "Compare cue": "ຈຸດແນະນຳການປຽບທຽບ",
      "Reflex cue": "ຈຸດແນະນຳການສະທ້ອນ",
      "Alignment cue": "ຈຸດແນະນຳແນວຕາ",
      Reflex: "ການສະທ້ອນ",
      Light: "ແສງ",
      Geometry: "ຮູບຊົງ",
      Shape: "ຮູບຮ່າງ",
      Crescent: "ຮູບຈັນສ້ຽວ",
      Surface: "ພື້ນຜິວ",
      Cornea: "ກະຈົກຕາ",
      Check: "ກວດສອບ",
      Compare: "ປຽບທຽບ",
      "Previous case": "ກໍລະນີກ່ອນໜ້າ",
      "Next case": "ກໍລະນີຕໍ່ໄປ",
      "Move light patch left, right, up or down":
        "ເຄື່ອນຈຸດແສງໄປຊ້າຍ, ຂວາ, ຂຶ້ນ ຫຼື ລົງ",
      "Drag light patch": "ລາກຈຸດແສງ",
      Interpretation: "ການແປຜົນ",
      "Referral: not calculated yet": "ການສົ່ງຕໍ່: ຍັງບໍ່ໄດ້ຄຳນວນ",
      "Why: not calculated yet": "ເຫດຜົນ: ຍັງບໍ່ໄດ້ຄຳນວນ",
      "Site: not calculated yet": "ຕຳແໜ່ງ: ຍັງບໍ່ໄດ້ຄຳນວນ",
      "Likely: select the closest case and modifiers.":
        "ຄາດວ່າ: ເລືອກກໍລະນີ ແລະ ຕົວປັບທີ່ໃກ້ຄຽງທີ່ສຸດ.",
      "Action: Reassuring": "ການດຳເນີນການ: ສາມາດວາງໃຈໄດ້",
      "Why: both eyes match in brightness, shape and crescent position":
        "ເຫດຜົນ: ຕາທັງສອງຂ້າງມີຄວາມສະຫວ່າງ, ຮູບຮ່າງ ແລະ ຕຳແໜ່ງຮູບຈັນສ້ຽວກົງກັນ",
      "Site: Normal / refractive": "ຕຳແໜ່ງ: ປົກກະຕິ / ສາຍຕາຜິດປົກກະຕິ",
      "Likely: Normal reflexes R & L":
        "ຄາດວ່າ: ການສະທ້ອນປົກກະຕິຂອງຕາຂວາ ແລະ ຊ້າຍ",
      "? Action: Repeat view / ask for help":
        "? ການດຳເນີນການ: ກວດເບິ່ງຊ້ຳ / ຂໍຄວາມຊ່ວຍເຫຼືອ",
      "? Action: Routine review": "? ການດຳເນີນການ: ກວດຕິດຕາມຕາມປົກກະຕິ",
      "! Action: Refer soon": "! ການດຳເນີນການ: ສົ່ງຕໍ່ໂດຍໄວ",
      "! Action: Urgent today": "! ການດຳເນີນການ: ສົ່ງຕໍ່ດ່ວນມື້ນີ້",
      "1. Normal (orange-red) R & L": "1. ປົກກະຕິ (ສົ້ມ-ແດງ) ຂວາ ແລະ ຊ້າຍ",
      "2. Normal (blue) R & L": "2. ປົກກະຕິ (ຟ້າ) ຂວາ ແລະ ຊ້າຍ",
      "3. Poor view: looking away": "3. ເບິ່ງບໍ່ຊັດ: ເບິ່ງໄປທາງອື່ນ",
      "4. Poor view: upper lid blocking": "4. ເບິ່ງບໍ່ຊັດ: ໜັງຕາເທິງບັງ",
      "5. R normal, L large esotropia": "5. ຂວາປົກກະຕິ, ຊ້າຍຕາເຂຂະໜາດໃຫຍ່",
      "6. R large exotropia, L scar": "6. ຂວາຕາເຫຼ່ອອກຫຼາຍ, ຊ້າຍມີຮອຍແປ້ວ",
      "7. R retinoblastoma, L normal": "7. ຂວາມີມະເຮັງຈໍຕາ, ຊ້າຍປົກກະຕິ",
      "8. R normal, L dark": "8. ຂວາປົກກະຕິ, ຊ້າຍມືດ",
      "9. High hypermetropia R & L": "9. ສາຍຕາຍາວຫຼາຍ ຂວາ ແລະ ຊ້າຍ",
      "10. Myopia R & L": "10. ສາຍຕາສັ້ນ ຂວາ ແລະ ຊ້າຍ",
      "11. R hypermetropia, L myopia": "11. ຂວາສາຍຕາຍາວ, ຊ້າຍສາຍຕາສັ້ນ",
      "12. Poor tear film R & L": "12. ຟິມນ້ຳຕາບໍ່ດີ ຂວາ ແລະ ຊ້າຍ",
      "13. Small pupils R & L": "13. ຮູມ່ານຕານ້ອຍ ຂວາ ແລະ ຊ້າຍ",
      "14. R normal, L smaller pupil": "14. ຂວາປົກກະຕິ, ຮູມ່ານຕາຊ້າຍນ້ອຍກວ່າ",
      "15. Dull corneal reflex R & L":
        "15. ການສະທ້ອນຈາກກະຈົກຕາມົວ ຂວາ ແລະ ຊ້າຍ",
      "16. Dense cataract R & L": "16. ຕໍ້ກະຈົກໜາແໜ້ນ ຂວາ ແລະ ຊ້າຍ",
      "17. R normal, L corneal opacity": "17. ຂວາປົກກະຕິ, ກະຈົກຕາຊ້າຍຂຸ່ນ",
      "18. R hypermetropia, L posterior pole":
        "18. ຂວາສາຍຕາຍາວ, ຊ້າຍມີຕໍ້ທີ່ຂົ້ວຫຼັງເລັນ",
      "19. R coloboma, L normal": "19. ຂວາມີຮອຍແຫວ່ງແຕ່ກຳເນີດ, ຊ້າຍປົກກະຕິ",
      "20. Aniridia R & L": "20. ບໍ່ມີມ່ານຕາ ຂວາ ແລະ ຊ້າຍ",
      "21. R transillumination, L normal": "21. ແສງຜ່ານມ່ານຕາຂວາ, ຊ້າຍປົກກະຕິ",
      "22. R normal, L subluxated lens":
        "22. ຂວາປົກກະຕິ, ເລັນຕາຊ້າຍເຄື່ອນບາງສ່ວນ",
      "23. R floaters, L normal": "23. ຂວາມີຈຸດລອຍ, ຊ້າຍປົກກະຕິ",
      "24. R large cortical, L slight cortical":
        "24. ຕໍ້ຊັ້ນນອກຂວາຫຼາຍ, ຊ້າຍເລັກນ້ອຍ",
      "25. Subcapsular cataract R & L": "25. ຕໍ້ໃຕ້ຖົງເລັນ ຂວາ ແລະ ຊ້າຍ",
      "26. R IOL, L capsular thickening": "26. ຂວາມີເລັນທຽມ, ຖົງເລັນຊ້າຍໜາ",
      "27. R aphakia, L normal": "27. ຂວາບໍ່ມີເລັນຕາ, ຊ້າຍປົກກະຕິ",
      "28. Keratoconus R & L": "28. ກະຈົກຕາຮູບຈວຍ ຂວາ ແລະ ຊ້າຍ",
      "29. R iridocyclitis, L normal":
        "29. ຂວາມ່ານຕາແລະກ້າມເນື້ອຊີລຽຣີອັກເສບ, ຊ້າຍປົກກະຕິ",
      "30. R angle closure, L normal": "30. ຂວາມຸມຕາປິດ, ຊ້າຍປົກກະຕິ",
      "31. R vitreous haemorrhage, L normal":
        "31. ຂວາມີເລືອດອອກໃນວຸ້ນຕາ, ຊ້າຍປົກກະຕິ",
      "32. R retinal detachment, L normal": "32. ຂວາຈໍຕາຫຼຸດລອກ, ຊ້າຍປົກກະຕິ",
      "Primary cases (8)": "ກໍລະນີຂັ້ນພື້ນຖານ (8)",
      "Intermediate cases (14)": "ກໍລະນີຂັ້ນກາງ (14)",
      "Advanced cases (10)": "ກໍລະນີຂັ້ນສູງ (10)",
      Gradual: "ຄ່ອຍໆເກີດ",
      Sudden: "ເກີດກະທັນຫັນ",
      Glare: "ແສງຈ້າລົບກວນ",
      "Glare on": "ເປີດແສງຈ້າລົບກວນ",
      H: "ແນວນອນ",
      V: "ແນວຕັ້ງ",
      Primary: "ຂັ້ນພື້ນຖານ",
      Intermediate: "ຂັ້ນກາງ",
      Advanced: "ຂັ້ນສູງ",
      "Primary case:": "ກໍລະນີຂັ້ນພື້ນຖານ:",
      "Intermediate case:": "ກໍລະນີຂັ້ນກາງ:",
      "Advanced case:": "ກໍລະນີຂັ້ນສູງ:",
    }),
  );

  // The case picker omits the numeric prefix that appears in the main case
  // selector, so expose both forms from the same vetted translations.
  [...translations.entries()].forEach(([english, lao]) => {
    if (!/^\d+\./.test(english)) return;
    translations.set(
      english.replace(/^\d+\.\s*/, ""),
      lao.replace(/^\d+\.\s*/, ""),
    );
  });

  // Only replace phrases that are intentionally embedded in longer dynamic
  // labels. Replacing every dictionary key here would corrupt English words
  // that happen to contain short control labels such as "on" or "dir".
  const embeddedKeys = [
    "Primary case:",
    "Intermediate case:",
    "Advanced case:",
    ...[...translations.keys()].filter((key) => /^\d+\./.test(key)),
  ];
  const embeddedReplacements = embeddedKeys
    .map((key) => [key, translations.get(key)])
    .sort((a, b) => b[0].length - a[0].length);

  function translateValue(value) {
    const original = String(value || "");
    const trimmed = original.replace(/\s+/g, " ").trim();
    if (!trimmed) return original;
    const direct = translations.get(trimmed);
    if (direct) {
      const leading = original.match(/^\s*/)?.[0] || "";
      const trailing = original.match(/\s*$/)?.[0] || "";
      return `${leading}${direct}${trailing}`;
    }

    let result = original;
    for (const [english, lao] of embeddedReplacements) {
      if (result.includes(english)) result = result.replaceAll(english, lao);
    }
    return result;
  }

  function translateElement(element) {
    if (!(element instanceof Element)) return;
    ["aria-label", "title", "placeholder", "alt"].forEach((attribute) => {
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

  translateTree(document);

  let translating = false;
  const observer = new MutationObserver((records) => {
    if (translating) return;
    translating = true;
    try {
      records.forEach((record) => {
        if (record.type === "characterData") {
          translateTree(record.target);
          return;
        }
        if (record.type === "attributes") {
          translateElement(record.target);
          return;
        }
        record.addedNodes.forEach(translateTree);
      });
    } finally {
      translating = false;
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["aria-label", "title", "placeholder", "alt"],
    characterData: true,
    childList: true,
    subtree: true,
  });
})();
