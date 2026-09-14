// Adaptations of the existing timed English script, in its original cue order.
// Synthetic speech and translations require native clinical review.
const fs = require("node:fs");
const source =
  "public/narration/direct-ophthalmoscopy/full-animation/script.json";
const script = JSON.parse(fs.readFileSync(source, "utf8"));
const voices = JSON.parse(
  fs.readFileSync(
    "public/narration/fundal-reflex/full-animation/script.json",
    "utf8",
  ),
).languages;
const translations = {
  "es-419": [
    "Comience con la higiene de manos.",
    "Observe el contorno de los ojos, los párpados y los ojos. Busque anomalías.",
    "Seleccione la luz más intensa del Arclight y suba ambos soportes de lentes hasta el tope. Use una habitación tranquila y con poca luz.",
    "Coloque el orificio de observación cerca de su ojo.",
    "No dirija la luz hacia su propio ojo.",
    "No coloque el Arclight de lado.",
    "A un brazo de distancia, pida mirar la luz y observe ambos ojos.",
    "Reflejos de igual brillo y color similar. La asimetría es anormal.",
    "Pida al paciente fijar la mirada en un objeto lejano. No debe mirarlo a usted ni mirar la luz.",
    "Use la mano y el ojo derechos para el ojo derecho del paciente, y los izquierdos para el izquierdo.",
    "Con los pies cerca del paciente, inclínese hacia atrás. Siga el reflejo hacia dentro, en un plano horizontal, a diez o quince grados del lado temporal de la pupila.",
    "Al acercarse, verá el disco óptico. Acérquese más para ampliar y estabilizar la imagen.",
    "Alinee el Arclight sin subirlo ni bajarlo. Si pierde el disco, siga una rama vascular principal hasta él.",
    "En el disco óptico, evalúe la nitidez de sus bordes.",
    "Evalúe el color del anillo neurorretiniano y la relación excavación-disco.",
    "Un disco sano tiene bordes claros y un anillo. Derive si hay hinchazón, palidez o aumento de la excavación.",
    "Antes de examinar la fóvea, dilate la pupila. Mirar la luz sin dilatación la contrae y dificulta la visión.",
    "Comience en el disco óptico.",
    "Siga las cuatro ramas principales de los vasos retinianos. Desde el disco óptico, siga una rama, vuelva al disco y siga la siguiente. Repita con las cuatro ramas.",
    "Termine en la mácula y la fóvea. Repita el examen en el otro ojo.",
  ],
  ko: [
    "먼저 손 위생을 실시합니다.",
    "눈 주위와 눈꺼풀, 눈을 관찰하고 이상 소견을 확인합니다.",
    "아크라이트 밝기를 최대로 맞추고 두 렌즈 거치대를 끝까지 올립니다. 조용하고 어두운 방에서 검사합니다.",
    "관찰 구멍을 검사자의 눈 가까이에 댑니다.",
    "자신의 눈에 빛을 비추지 마세요.",
    "아크라이트를 옆으로 들지 마세요.",
    "팔 길이에서 빛을 보게 하고 두 눈을 함께 봅니다.",
    "밝기는 같고 색은 비슷해야 합니다. 다르면 비정상입니다.",
    "환자에게 먼 곳의 목표물을 보게 합니다. 검사자나 빛 자체를 보지 않도록 합니다.",
    "환자의 오른눈은 오른손과 오른눈으로, 왼눈은 왼손과 왼눈으로 검사합니다.",
    "발을 환자 가까이 두고 몸을 뒤로 기울입니다. 안저 반사를 찾아 동공의 귀 쪽으로 십 도에서 십오 도 각도의 수평 경로를 따라 접근합니다.",
    "가까이 가면 시신경유두가 보입니다. 더 가까이 다가가 시야를 넓히고 안정시킵니다.",
    "아크라이트를 환자의 눈에 맞춰 위아래로 움직이지 않습니다. 유두를 놓치면 굵은 혈관 가지를 따라 돌아갑니다.",
    "시신경유두 경계가 얼마나 선명한지 평가합니다.",
    "신경망막테의 색과 유두함몰비를 평가합니다.",
    "정상 유두는 경계와 테가 뚜렷합니다. 부종, 창백함이나 함몰 증가가 있으면 의뢰합니다.",
    "중심와 검사 전에 산동합니다. 안 하면 빛을 볼 때 동공이 수축해 관찰이 어렵습니다.",
    "시신경유두에서 시작합니다.",
    "망막 혈관의 주요 가지 네 개를 따라갑니다. 유두에서 한 가지를 따라간 뒤 유두로 돌아와 다음 가지를 관찰합니다. 네 가지 모두 반복합니다.",
    "황반과 중심와를 마지막으로 보고 반대쪽 눈도 검사합니다.",
  ],
  ne: [
    "पहिले हात सफा गर्नुहोस्।",
    "आँखा वरिपरि, पलक र आँखामा कुनै असामान्यता छ कि हेर्नुहोस्।",
    "आर्कलाइटको उज्यालो अधिकतम राख्नुहोस् र दुवै लेन्स र्‍याक पूरै माथि सार्नुहोस्। शान्त, मधुरो कोठामा जाँच गर्नुहोस्।",
    "हेर्ने प्वाल आफ्नो आँखाको नजिक राख्नुहोस्।",
    "आफ्नै आँखामा प्रकाश नपार्नुहोस्।",
    "आर्कलाइटलाई छड्के नसमात्नुहोस्।",
    "हातको दूरीबाट प्रकाश हेर्न लगाई दुवै आँखा हेर्नुहोस्।",
    "प्रतिबिम्बको चमक र रङ समान हुनुपर्छ। फरक हुनु असामान्य हो।",
    "बिरामीलाई टाढाको वस्तुमा नजर स्थिर राख्न भन्नुहोस्। तपाईं वा प्रकाशलाई नहेरून्।",
    "बिरामीको दायाँ आँखा आफ्नो दायाँ हात र आँखाले, बायाँ आँखा बायाँ हात र आँखाले जाँच्नुहोस्।",
    "खुट्टा बिरामीको नजिक राखी पछाडि ढल्कनुहोस्। रातो प्रतिबिम्ब पछ्याउँदै नानीको कानपट्टि दसदेखि पन्ध्र डिग्रीको तेर्सो बाटोमा नजिकिनुहोस्।",
    "नजिकिँदा दृष्टि स्नायुको डिस्क देखिन्छ। फराकिलो र स्थिर दृश्यका लागि अझ नजिक जानुहोस्।",
    "आर्कलाइट आँखासँग सीधा राख्नुहोस्, तलमाथि नचलाउनुहोस्। डिस्क हराए ठूलो रक्तनलीको हाँगा पछ्याउँदै फर्कनुहोस्।",
    "दृष्टि स्नायुको डिस्कको किनारा कति स्पष्ट छ, मूल्याङ्कन गर्नुहोस्।",
    "न्युरोरेटिनल रिमको रङ र कप–डिस्क अनुपात मूल्याङ्कन गर्नुहोस्।",
    "स्वस्थ डिस्कको किनारा र रिम स्पष्ट हुन्छ। सुन्निएको, फिक्का वा खाल्डो बढेको भए रेफर गर्नुहोस्।",
    "फोभिया जाँच्नुअघि नानी फैलाउनुहोस्। नत्र प्रकाश हेर्दा नानी खुम्चिन्छ र दृश्य छेकिन्छ।",
    "दृष्टि स्नायुको डिस्कबाट सुरु गर्नुहोस्।",
    "रेटिनाका चार मुख्य रक्तनलीका हाँगा पछ्याउनुहोस्। डिस्कबाट एउटा हाँगा हेरेर फेरि डिस्कमा फर्कनुहोस्, अनि अर्को हेर्नुहोस्। चारै हाँगामा दोहोर्‍याउनुहोस्।",
    "म्याकुला र फोभिया हेरेपछि अर्को आँखामा जाँच दोहोर्‍याउनुहोस्।",
  ],
  fr: [
    "Commencez par l’hygiène des mains.",
    "Observez le pourtour des yeux, les paupières et les yeux. Notez toute anomalie.",
    "Réglez l’Arclight au maximum et remontez complètement les deux supports de lentilles. Utilisez une pièce calme et peu éclairée.",
    "Placez l’orifice de visée près de votre œil.",
    "N’éclairez pas votre propre œil.",
    "Ne tenez pas l’Arclight de côté.",
    "À bout de bras, faites regarder la lumière et observez les deux yeux.",
    "Reflets de même éclat et de couleur similaire. L’asymétrie est anormale.",
    "Demandez au patient de fixer une cible éloignée, sans vous regarder ni regarder la lumière.",
    "Utilisez la main et l’œil droits pour son œil droit, et la main et l’œil gauches pour son œil gauche.",
    "Les pieds près du patient, penchez-vous en arrière. Suivez le reflet rouge horizontalement, à dix à quinze degrés du côté temporal de la pupille.",
    "En approchant, la papille apparaît. Rapprochez-vous pour élargir et stabiliser la vue.",
    "Gardez l’Arclight aligné, sans mouvement vertical. Retrouvez la papille en suivant une branche vasculaire principale.",
    "Évaluez la netteté des bords de la papille.",
    "Évaluez la couleur de l’anneau neurorétinien et le rapport excavation sur papille.",
    "Une papille saine a des bords nets et un anneau. Orientez en cas d’œdème, de pâleur ou d’excavation accrue.",
    "Dilatez la pupille avant d’examiner la fovéa. Sinon, fixer la lumière la rétrécit et gêne la vue.",
    "Commencez à la papille.",
    "Suivez les quatre branches vasculaires rétiniennes principales. Depuis la papille, suivez une branche, revenez à la papille, puis suivez la suivante. Répétez pour les quatre branches.",
    "Terminez par la macula et la fovéa, puis examinez l’autre œil.",
  ],
  lg: [
    "Tandika n’okunaaba engalo.",
    "Kebera okwetooloola amaaso, ebikowe n’amaaso, olabe oba waliwo ekitali kya bulijjo.",
    "Arclight eteeke ku kitangaala ekisinga; ebikwata endabirwamu byombi waggulu ddala. Ekisenge kibe kisirifu, ekitangaala kitono.",
    "Teeka ekituli eky’okulabiramu kumpi n’eriiso lyo.",
    "Towakira kitangaala mu liiso lyo.",
    "Tokwata Arclight ng’egalamidde ku ludda.",
    "Ku bbanga ly’omukono, alabe ekitangaala; laba amaaso gombi.",
    "Ebitangaala byenkane amaanyi ne langi. Enjawulo si ya bulijjo.",
    "Gamba omulwadde atunuulire ekintu eky’ewala. Takutunuuliranga era tatunuuliranga kitangaala.",
    "Kozesa omukono n’eriiso erya ddyo ku liiso lye erya ddyo; ebya kkono ku lya kkono.",
    "Ebigere kumpi n’omulwadde, weesigame emabega. Sembera ng’ogoberera ekitangaala ekimyufu mu bugalamivu, diguli kkumi ku kkumi na ttaano ku ludda lw’okutu.",
    "Bw’osembera, omutwe gw’omusuwa gw’eriiso gulabika. Sembera okufuna ekifaananyi ekigazi era ekitebenkevu.",
    "Arclight ku layini y’eriiso, si waggulu na wansi. Disiki bw’ebula, goberera ettabi ly’omusaayi eddene oddeyo.",
    "Kebera oba ensalo z’omutwe gw’omusuwa gw’eriiso zirabika bulungi.",
    "Kebera langi y’olukugiro, n’obunene bw’ekinnya bw’ogeraageranya ne disiki yonna.",
    "Ensalo n’olukugiro birabike. Enzimbu, enseeguufu, ekinnya ekigazi: sindika eri omukugu.",
    "Gaziya akatuli nga tonnakebera fovea. Okutunuulira ekitangaala kukafunza ne kuziyiza okulaba.",
    "Tandikira ku mutwe gw’omusuwa gw’eriiso.",
    "Goberera amatabi ana amakulu ag’emisuwa gy’omusaayi ku retina. Tandika ku mutwe gw’omusuwa, ogoberere ettabi limu, oddeyo ku mutwe, olyoke ogoberere eddala. Kola bw’otyo ku gonna ana.",
    "Maliriza ku macula ne fovea, oluvannyuma oddemu okukebera eriiso eddala.",
  ],
  ha: [
    "Fara da wanke hannu.",
    "Duba kewayen idanu, fatar ido da idanu. Lura da duk abin da ba na al’ada ba.",
    "Haske mafi ƙarfi na Arclight; maƙallan ruwan tabarau biyu sama gaba ɗaya. Ɗakin ya yi shiru da duhu.",
    "Sanya ramin dubawa kusa da idonka.",
    "Kada ka haska idonka.",
    "Kada ka riƙe Arclight a kaikaice.",
    "Nisan hannu: ya kalli haske, ka duba idanu biyu.",
    "Hasken ya daidaita a ƙarfi da launi. Bambanci ba na al’ada ba ne.",
    "Mara lafiya ya kalli abu mai nisa. Kada ya kalle ka ko hasken da kansa.",
    "Yi amfani da hannunka da idonka na dama ga idonsa na dama; na hagu ga idonsa na hagu.",
    "Sanya ƙafafunka kusa da mara lafiya, ka jingina baya. Bi jan hasken cikin ido a kwance, digiri goma zuwa goma sha biyar wajen kunne daga ƙwayar baƙin ido.",
    "Da ka matsa kusa, kan jijiyar gani zai bayyana. Ƙara matsowa domin gani mai faɗi da kwanciyar hankali.",
    "Arclight daidai da ido, ba sama ko ƙasa ba. Idan kan ya ɓace, bi babban reshen jini ka koma.",
    "Duba yadda iyakar kan jijiyar gani take bayyana.",
    "Duba launin gefen kan jijiyar gani da girman ramin tsakiya idan aka kwatanta da dukkan kan.",
    "Kan lafiya: iyaka da gefe a bayyane. Kumburi, kodadde, ko rami ya ƙaru: tura mara lafiya.",
    "Faɗaɗa ƙwayar baƙin ido kafin fovea. In ba haka ba, haske ya ƙuntata ta ya hana gani.",
    "Fara daga kan jijiyar gani.",
    "Bi manyan rassan jijiyoyin jini huɗu na retina. Fara daga kan jijiyar gani, bi reshe ɗaya, koma kan, sannan bi na gaba. Maimaita ga rassan huɗu.",
    "Ƙare da macula da fovea. Sannan maimaita gwajin a ɗayan idon.",
  ],
  yo: [
    "Bẹ̀rẹ̀ pẹ̀lú fífọ ọwọ́.",
    "Ṣàyẹ̀wò àyíká ojú, ìpéǹpéjú àti ojú. Kíyè sí ohun tí kò bójú mu.",
    "Yan ìmọ́lẹ̀ Arclight tó lágbára jù. Gbé àwọn ohun tó di lẹ́ńsì méjèèjì sókè pátápátá. Lo yàrá tó dákẹ́, tí ìmọ́lẹ̀ rẹ̀ kéré.",
    "Fi ihò ìwò sún mọ́ ojú rẹ.",
    "Má tan ìmọ́lẹ̀ sínú ojú ara rẹ.",
    "Má di Arclight ní ẹ̀gbẹ́.",
    "Ní gígùn apá, kí aláìsàn wo ìmọ́lẹ̀. Wo ojú méjèèjì pọ̀.",
    "Ìtànṣán méjèèjì gbọ́dọ̀ dọ́gba ní ìmọ́lẹ̀ àti àwọ̀. Ìyàtọ̀ kò bójú mu.",
    "Kí aláìsàn tẹjú mọ́ ohun tó jìnnà. Kò gbọdọ̀ wo ìwọ tàbí ìmọ́lẹ̀ náà.",
    "Lo ọwọ́ ọ̀tún àti ojú ọ̀tún fún ojú ọ̀tún aláìsàn; lo ọwọ́ àti ojú òsì fún ojú òsì.",
    "Fi ẹsẹ̀ sún mọ́ aláìsàn, tẹ ara sẹ́yìn. Tẹ̀lé ìtànṣán pupa ní pẹ̀tẹ́lẹ̀, ní ìwọ̀n mẹ́wàá sí mẹ́ẹ̀ẹ́dógún dígírì sí ẹ̀gbẹ́ etí láti ihò dúdú ojú.",
    "Bí o ṣe sún mọ́ ọn, orí iṣan ìríran yóò hàn. Sún mọ́ ọn sí i kí ìwò gbòòrò, kí ó sì dúró ṣinṣin.",
    "Mú Arclight dúró ní ìlà ojú; má gbé e sókè tàbí sísàlẹ̀. Bí orí iṣan ìríran bá sọnù, tẹ̀lé ẹ̀ka iṣan ẹ̀jẹ̀ ńlá padà sí i.",
    "Ṣàyẹ̀wò bí ààlà orí iṣan ìríran ṣe hàn kedere.",
    "Ṣàyẹ̀wò àwọ̀ etí orí iṣan ìríran àti ìpín ihò àárín sí gbogbo orí náà.",
    "Orí iṣan tó dára ní ààlà tó mọ́ àti etí. Tọ́ aláìsàn sí amọ̀ja fún wíwú, àwọ̀ fífẹ́ tàbí ihò àárín tó pọ̀ sí i.",
    "Mú ihò dúdú ojú gbòòrò kí o tó wo fovea. Bí bẹ́ẹ̀ kọ́, wíwo ìmọ́lẹ̀ á mú un kéré, á sì dí ìwò lọ́wọ́.",
    "Bẹ̀rẹ̀ ní orí iṣan ìríran.",
    "Tẹ̀lé ẹ̀ka iṣan ẹ̀jẹ̀ ńlá mẹ́rin lórí retina. Láti orí iṣan ìríran, tẹ̀lé ẹ̀ka kan, padà sí orí náà, kí o sì tẹ̀lé èkejì. Ṣe bẹ́ẹ̀ fún mẹ́rẹ̀ẹ̀rin.",
    "Parí ní macula àti fovea, kí o sì tún àyẹ̀wò ṣe ní ojú kejì.",
  ],
  ig: [
    "Malite site n’ịsa aka.",
    "Lelee gburugburu anya, mkpuchi anya na anya. Chọpụta ihe ọ bụla na-adịghị mma.",
    "Họrọ ìhè Arclight kacha ike. Bulie ihe abụọ na-ejide lens ruo n’elu. Jiri ụlọ dị jụụ nke ìhè ya dị ntakịrị.",
    "Debe oghere nlele nso anya gị.",
    "Atụnyela ìhè n’anya nke gị.",
    "Ejidela Arclight n’akụkụ.",
    "N’ogologo aka, ọ lee ìhè; lelee anya abụọ ọnụ.",
    "Ìhè na-alọghachi kwesịrị ịdị otu n’ike na agba. Ọdịiche adịghị mma.",
    "Gwa onye ọrịa ka ọ lee ihe dị anya. Ọ gaghị ele gị ma ọ bụ ìhè ahụ.",
    "Jiri aka nri na anya nri maka anya nri onye ọrịa; jiri aka ekpe na anya ekpe maka anya ekpe ya.",
    "Debe ụkwụ nso onye ọrịa, dabere azụ. Soro ìhè uhie banye n’ahịrị larịị, ogo iri ruo iri na ise n’akụkụ ntị site n’oghere ojii anya.",
    "Mgbe ị bịaruru nso, isi akwara ịhụ ụzọ ga-apụta. Bịakwuo nso ka ihe ị na-ahụ gbasaa ma kwụsie ike.",
    "Debe Arclight n’ahịrị anya, ọ bụghị elu ma ọ bụ ala. Ọ bụrụ na isi efuo, soro alaka ọbara ukwu laghachi.",
    "Lelee otú oke isi akwara ịhụ ụzọ si doo anya.",
    "Lelee agba mgbanaka isi akwara na nha olulu etiti ma e jiri ya tụnyere isi ahụ dum.",
    "Isi dị mma: oke doro anya na mgbanaka. Ọzịza, agba chachara, olulu toro: zigara ọkachamara.",
    "Meghee oghere ojii anya tupu ị lelee fovea. Ma ọ bụghị ya, ile ìhè ga-eme ka ọ dị ntakịrị ma gbochie nlele.",
    "Malite n’isi akwara ịhụ ụzọ.",
    "Soro alaka anọ bụ isi nke akwara ọbara retina. Malite n’isi akwara ịhụ ụzọ, soro otu alaka, laghachi n’isi ahụ, soro alaka ọzọ. Mee nke a n’alaka anọ niile.",
    "Mechie na macula na fovea. Tinyegharịa nyocha n’anya nke ọzọ.",
  ],
};
for (const [language, lines] of Object.entries(translations)) {
  if (lines.length !== script.cues.length)
    throw new Error(`${language}: cue count mismatch`);
  script.languages[language] = voices[language];
  script.cues.forEach((cue, index) => {
    cue[language] = lines[index];
  });
}
fs.writeFileSync(source, JSON.stringify(script, null, 2) + "\n");
console.log(
  `Updated ${script.cues.length} cues in ${Object.keys(translations).length} languages.`,
);
if (process.argv.includes("--connect")) {
  const catalogPath = "public/video-localization/childhood-eye-screening.json";
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const entry = catalog.directOphthalmoscopyFullAnimationVideoPage;
  const base = "/narration/direct-ophthalmoscopy/full-animation/";
  for (const language of Object.keys(script.languages)) {
    for (const ext of ["m4a", "vtt"]) {
      if (!fs.existsSync("public" + base + language + "." + ext))
        throw new Error(
          `Missing ${language}.${ext}; generate audio before connecting.`,
        );
    }
    const subtitleLanguage = language === "es-419" ? "es" : language;
    entry.subtitles[subtitleLanguage] = base + language + ".vtt";
    entry.audioVariants[language] = {
      label: script.languages[language].label,
      src: base + language + ".m4a",
    };
  }
  entry.iosHls.subtitleLanguages = Object.keys(entry.subtitles);
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
}
