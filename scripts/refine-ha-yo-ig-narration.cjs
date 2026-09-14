// Fundal-reflex narration with the same clinical sequence and silent titles.
const fs = require("node:fs");
const file = "public/narration/fundal-reflex/full-animation/script.json";
const s = JSON.parse(fs.readFileSync(file, "utf8"));
const texts = {
  ha: [
    "Wanke hannuwanka, ka sa kayan kariya.",
    "A ɗaki mai shiru da duhu, zaɓi haske mafi ƙarfi na Arclight. Tura maƙallan ruwan tabarau biyu sama gaba ɗaya.",
    "Kawo ramin dubawa kusa da idonka.",
    "Kada ka haska idonka, ko ka riƙe na’urar a kwance.",
    "A naɗe jariri cikin zane lafiya.",
    "Iyaye su riƙe jariri mai ɗan girma.",
    "Yaron da ke iya zama da kyau zai iya zama shi kaɗai.",
    "Fara daga nisan tsawon hannu.",
    "Matsa kaɗan daga gefe zuwa gefe. Matso kusa idan kana buƙatar gani dalla-dalla.",
    "Daga nisan hannu, ka sa yaron ya dube ka. Duba idanu biyu tare. Yanayin hasken zai bambanta da nisa da kuma inda yaron yake kallo.",
    "Launi da ƙarfin hasken da ke dawowa daga idanu biyu su zama iri ɗaya. Bambanci ko rashin hasken ba al’ada ba ne. Tura yaron don ƙarin bincike.",
    "Launin haske ya danganta da launin retina. Yana iya zama fari-rawaya, shuɗi, ja-lemo, ko rawaya-lemo.",
    "Waɗannan duk yanayi ne na lafiya ga yaran nan.",
    "Iyaye su riƙe jaririn da aka naɗe lafiya, hannuwansa suna cikin zane.",
    "Idan idanu suna buɗe, duba hasken da ke dawowa daga idanu biyu tare, ba tare da taɓa jaririn ba.",
    "Idan jariri yana barci, kada ka tashe shi.",
    "Naɗe shi, hannuwansa a ciki.",
    "Buɗe ido ɗaya a hankali ka duba, sannan ɗayan. Ka yi hakan cikin natsuwa, tausasawa da haƙuri.",
    "Launi da haske iri ɗaya alama ce mai kyau.",
    "Ɗan karkacewar ido na lokaci-lokaci yakan faru a watan farko, ya daina kafin wata uku. Idan ya ci gaba bayan wata uku, tura yaron ga ƙwararre.",
    "Bambancin launi ko rashin wani ɓangare na hasken, ko dukansa, ba al’ada ba ne. Ana buƙatar ƙarin bincike.",
    "Idan sakamakon bai bayyana ba, bi matakai uku nan.",
    "Da farko, kwatanta hasken jariri da na iyayensa. Ya kamata su yi kama.",
    "Idan kana shakka, nemi ra’ayin abokin aiki.",
    "Idan babu abokin aiki, nemi yardar iyaye.",
    "Haɗa Arclight da kyamarar waya, ka ɗauki bidiyon hasken ido.",
    "Aika bidiyon cikin tsaro don neman wani ra’ayi.",
    "Gode wa iyaye. Bayyana sakamako da mataki na gaba.",
    "Sake wanke hannu. An gama gwajin jan hasken ido.",
  ],
  yo: [
    "Fọ ọwọ́ rẹ, kí o sì wọ ohun èlò ààbò.",
    "Mú Arclight sílẹ̀ ní yàrá tó dákẹ́, tí ìmọ́lẹ̀ rẹ̀ kéré. Yan ìmọ́lẹ̀ tó lágbára jù, kí o sì gbé àwọn àgbékalẹ̀ lẹ́ńsì méjèèjì sókè pátápátá.",
    "Mú ihò ìwòran sún mọ́ ojú rẹ.",
    "Má tan ìmọ́lẹ̀ sí ojú ara rẹ. Má sì di ẹ̀rọ náà ní ẹ̀gbẹ́.",
    "Fi aṣọ di ọmọ tuntun ní àìléwu.",
    "Jẹ́ kí òbí gbé ọmọ tó ti dàgbà díẹ̀.",
    "Ọmọ tó lè jókòó dáadáa lè jókòó fúnra rẹ̀.",
    "Bẹ̀rẹ̀ láti ìjìnnà gígùn apá.",
    "Rìn díẹ̀ sí ẹ̀gbẹ́ méjèèjì. Sún mọ́ ọn bí o bá nílò láti rí dáadáa sí i.",
    "Ní ìjìnnà gígùn apá, sọ fún ọmọ láti wò ọ́. Ṣàyẹ̀wò ojú méjèèjì lẹ́ẹ̀kan náà. Ìrísí yóò yàtọ̀ gẹ́gẹ́ bí ìjìnnà àti ibi tí ọmọ ń wò.",
    "Àwọ̀ àti ìmọ́lẹ̀ ìtànṣán láti ojú méjèèjì gbọ́dọ̀ jọra. Ìyàtọ̀ tàbí àìsí ìtànṣán kò bójú mu. Rán ọmọ lọ fún àyẹ̀wò síwájú.",
    "Àwọ̀ ìtànṣán déédéé sinmi lórí àwọ̀ retina. Ó lè jẹ́ ofeefee-funfun, búlúù, ọsàn-pupa, tàbí ọsàn-ofeefee.",
    "Gbogbo ìrísí wọ̀nyí dára fún àwọn ọmọ wọ̀nyí.",
    "Sọ fún òbí kí ó gbé ọmọ tuntun dáadáa, pẹ̀lú aṣọ yí i ká àti apá méjèèjì nínú rẹ̀.",
    "Bí ojú bá ṣí, wo ìtànṣán láti ojú méjèèjì lẹ́ẹ̀kan náà láìfọwọ́ kan ọmọ.",
    "Bí ọmọ bá ń sùn, má jí i.",
    "Fi aṣọ yí i ká, kí apá wà nínú rẹ̀.",
    "Ṣí ojú kan díẹ̀díẹ̀ kí o ṣàyẹ̀wò rẹ̀, lẹ́yìn náà èkejì. Ṣe é pẹ̀lẹ́pẹ̀lẹ́, pẹ̀lú ìfarabalẹ̀ àti sùúrù.",
    "Àwọ̀ àti ìmọ́lẹ̀ tó jọra ń fúnni ní ìdánilójú.",
    "Ojú lè yí padà fún ìgbà díẹ̀ ní oṣù àkọ́kọ́. Ó sábà máa ń dáwọ́ dúró kí oṣù mẹ́ta tó pé. Bí ó bá tẹ̀síwájú, rán ọmọ lọ sí ọ̀dọ̀ onímọ̀.",
    "Ìyàtọ̀ àwọ̀, tàbí àìsí apá kan tàbí gbogbo ìtànṣán, kò bójú mu. Ó nílò àyẹ̀wò síwájú.",
    "Bí àbájáde kò bá ṣe kedere, tẹ̀lé ìgbésẹ̀ mẹ́ta yìí.",
    "Àkọ́kọ́, fi ìtànṣán ọmọ wé ti òbí. Wọ́n gbọ́dọ̀ jọra.",
    "Bí o bá ṣì ń ṣiyèméjì, béèrè èrò ẹlẹgbẹ́ rẹ.",
    "Bí ẹlẹgbẹ́ kò bá sí, gba ìyọ̀ǹda òbí.",
    "So Arclight mọ́ kámẹ́rà fóònù, kí o ya fídíò ìtànṣán ojú.",
    "Fi fídíò ránṣẹ́ ní ààbò láti gba èrò kejì.",
    "Dúpẹ́ lọ́wọ́ òbí. Ṣàlàyé àbájáde àti ìgbésẹ̀ tó kàn.",
    "Fọ ọwọ́ lẹ́ẹ̀kan sí i. Àyẹ̀wò ìtànṣán pupa ti parí.",
  ],
  ig: [
    "Saa aka gị, yirikwa ngwa nchebe.",
    "Kwadebe Arclight n’ụlọ dị jụụ, ìhè ya pere mpe. Họrọ ìhè kacha ike, bugokwa ihe njide lens abụọ elu kpamkpam.",
    "Weta oghere nlele nso anya gị.",
    "Atụnyela ìhè n’anya gị. Ejikwala ngwaọrụ ahụ n’akụkụ.",
    "Kechie nwa amụrụ ọhụrụ n’ákwà n’enweghị nsogbu.",
    "Gwa nne ma ọ bụ nna ka o jide nwa toro ntakịrị.",
    "Nwa nwere ike ịnọdụ nke ọma nwere ike ịnọdụ naanị ya.",
    "Malite n’ebe dị ka ogologo aka.",
    "Gaa ntakịrị n’akụkụ abụọ. Bịaruo nso ma ọ bụrụ na ị chọrọ ịhụ nke ọma.",
    "N’ebe dị ka ogologo aka, gwa nwa ka o lee gị anya. Nyochaa anya abụọ ọnụ. Ihe ị na-ahụ na-agbanwe dabere n’ebe ị nọ na ebe nwa na-ele.",
    "Agba na ike ìhè na-alọghachi n’anya abụọ kwesịrị ịdị otu. Ọdịiche ma ọ bụ enweghị ìhè abụghị ihe nkịtị. Ziga nwa maka nyocha ọzọ.",
    "Agba ìhè nkịtị dabere n’agba retina. Ọ nwere ike ịbụ odo-ọcha, anụnụ anụnụ, oroma-uhie, ma ọ bụ oroma-odo.",
    "Ihe ndị a niile bụ ihe nkịtị n’ụmụaka ndị a.",
    "Gwa nne ma ọ bụ nna ka o jide nwa ọhụrụ nke ọma, kechie ya n’ákwà ka aka ya dị n’ime.",
    "Ọ bụrụ na anya mepere emepe, lee ìhè na-alọghachi n’anya abụọ ọnụ, emetụghị nwa ahụ aka.",
    "Ọ bụrụ na nwa na-ehi ụra, akpọtela ya.",
    "Kechie ya, ka aka ya dị n’ime.",
    "Mepee otu anya nwayọọ ka ị nyochaa ya, mesịa nke ọzọ. Dị nwayọọ, nwee ndidi na obi jụụ.",
    "Agba na ike ìhè yiri ibe ha bụ ihe na-enye obi ike.",
    "Anya nwere ike ịgbagọ obere oge n’ọnwa mbụ. Nke a na-akwụsịkarị tupu ọnwa atọ. Ọ bụrụ na ọ gara n’ihu mgbe ọnwa atọ gasịrị, ziga nwa n’aka ọkachamara.",
    "Ọdịiche agba ma ọ bụ enweghị akụkụ ìhè, ma ọ bụ ìhè niile, abụghị ihe nkịtị. Ọ chọrọ nyocha ọzọ.",
    "Ọ bụrụ na ihe ị hụrụ edoghị anya, soro usoro atọ ndị a.",
    "Mbụ, tụnyere ìhè anya nwa na nke nne ma ọ bụ nna. Ha kwesịrị ịdị ka ibe ha.",
    "Ọ bụrụ na ị ka na-enwe obi abụọ, jụọ onye ọrụ ibe gị.",
    "Ọ bụrụ na onye ọrụ ibe gị anọghị, nweta nkwenye nne ma ọ bụ nna.",
    "Tinye Arclight na igwefoto ekwentị, dekọọ ìhè anya na vidio.",
    "Ziga vidio ahụ n’enweghị nsogbu ka ị nweta echiche ọzọ.",
    "Kelee nne ma ọ bụ nna. Kọwaa ihe ị hụrụ na ihe ọzọ a ga-eme.",
    "Saa aka ọzọ. Nyocha ìhè uhie anya agwụla.",
  ],
};
const titles = {
  ha: [
    "Shiri",
    "Bincike",
    "Jariri — idanu a buɗe",
    "Jariri — idanu a rufe",
    "Abubuwan da za a iya gani",
    "Sakamako marar tabbas",
    "Bayan bincike",
  ],
  yo: [
    "Ìmúrasílẹ̀",
    "Àyẹ̀wò",
    "Ọmọ tuntun — ojú ṣí",
    "Ọmọ tuntun — ojú pa",
    "Àwọn àbájáde tó ṣeé rí",
    "Àbájáde tí kò ṣe kedere",
    "Lẹ́yìn àyẹ̀wò",
  ],
  ig: [
    "Nkwadebe",
    "Nyocha",
    "Nwa ọhụrụ — anya mepere emepe",
    "Nwa ọhụrụ — anya mechiri emechi",
    "Ihe a pụrụ ịhụ",
    "Ihe edoghị anya",
    "Mgbe nyocha gasịrị",
  ],
};
for (const [code, lines] of Object.entries(texts)) {
  if (lines.length !== s.timedCues.en.length) throw Error("Cue count " + code);
  const spoken = s.timedCues.en.map((c, i) => ({ ...c, text: lines[i] }));
  s.timedCues[code] = [
    ...spoken,
    ...s.timedCues["es-419"]
      .filter((c) => c.id.startsWith("section-"))
      .map((c, i) => ({ ...c, text: titles[code][i] })),
  ].sort((a, b) => a.start - b.start);
  s.timedAudioCues[code] = spoken.map((c) => ({ ...c }));
  if (code === "ig") {
    // All three positioning captions share one scrolly clip and continuous scene.
    const at = s.timedAudioCues[code].findIndex(
      (c) => c.id === "preparation-04a",
    );
    const group = s.timedAudioCues[code].splice(at, 3);
    s.timedAudioCues[code].splice(at, 0, {
      id: "preparation-04",
      start: group[0].start,
      end: group[2].end,
      text: group.map((c) => c.text).join(" "),
    });
  }
  // Adjacent closing captions are read as a continuous closing statement.
  const last = s.timedAudioCues[code].splice(-2);
  s.timedAudioCues[code].push({
    id: "after-examination",
    start: last[0].start,
    end: last[1].end,
    text: last.map((c) => c.text).join(" "),
  });
  for (const c of s.cues) {
    const group = spoken.filter((t) => t.id === c.id || t.id.startsWith(c.id));
    if (group.length) c[code] = group.map((t) => t.text).join(" ");
  }
  s.languages[code] = {
    label: { ha: "Hausa", yo: "Yorùbá", ig: "Igbo" }[code],
    locale: code + "-NG",
    voice: {
      ha: "facebook/mms-tts-hau",
      yo: "facebook/mms-tts-yor",
      ig: "Shinzmann/soro-tts-ibo",
    }[code],
    provider: "Meta MMS (local)",
    modelLicense: "CC-BY-NC-4.0",
    style: "Calm medical educator",
  };
  if (code === "ig") s.languages[code].trimEdgeSilenceDb = -50;
}
fs.writeFileSync(file, JSON.stringify(s, null, 2) + "\n");
