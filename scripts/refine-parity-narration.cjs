// Concise clinical narration, retaining the existing scene boundaries.
const fs = require("node:fs");
const file = "public/narration/fundal-reflex/full-animation/script.json";
const s = JSON.parse(fs.readFileSync(file, "utf8"));
const texts = {
  ne: [
    "हात धुनुहोस् र व्यक्तिगत सुरक्षा सामग्री लगाउनुहोस्।",
    "शान्त, मधुरो कोठामा आर्कलाइट तयार गर्नुहोस्। सबैभन्दा चहकिलो बत्ती छान्नुहोस् र दुवै लेन्स र्‍याक पूरै माथि सार्नुहोस्।",
    "हेर्ने प्वाल आफ्नो आँखानजिक ल्याउनुहोस्।",
    "आफ्नै आँखामा बत्ती नपार्नुहोस्। उपकरण तेर्सो नसमात्नुहोस्।",
    "नवजात शिशुलाई सुरक्षित रूपमा कपडामा बेर्नुहोस्।",
    "अलि ठूलो शिशुलाई अभिभावकले समातून्।",
    "राम्ररी बस्न सक्ने बच्चा एक्लै बस्न सक्छ।",
    "एक हात जति दूरीबाट सुरु गर्नुहोस्।",
    "अलिकति दायाँबायाँ सर्नुहोस्। थप स्पष्ट हेर्नुपरे नजिक जानुहोस्।",
    "एक हातको दूरीबाट बच्चालाई आफूतिर हेर्न भन्नुहोस्। दुवै आँखा एकैसाथ जाँच्नुहोस्। दूरी र बच्चाले हेरेको दिशाअनुसार प्रतिबिम्बको रूप फरक हुन्छ।",
    "दुवै आँखाको रातो प्रतिबिम्बको रङ र चमक समान हुनुपर्छ। रङ वा चमक फरक भए वा प्रतिबिम्ब नदेखिए, थप जाँचका लागि पठाउनुहोस्।",
    "रेटिनाको वर्णकअनुसार सामान्य प्रतिबिम्ब पहेँलो-सेतो, नीलो, सुन्तला-रातो वा सुन्तला-पहेँलो हुन सक्छ।",
    "यी सबै यी बच्चाहरूका सामान्य, स्वस्थ रूप हुन्।",
    "शिशुको हात भित्र राखेर कपडामा बेर्नुहोस् र अभिभावकलाई सुरक्षित समात्न भन्नुहोस्।",
    "आँखा खुला भए, शिशुलाई नछोई दुवै आँखाको प्रतिबिम्ब एकैसाथ हेर्नुहोस्।",
    "शिशु सुतेको छ भने नब्युँझाउनुहोस्।",
    "हात भित्र राखेर कपडामा बेर्नुहोस्।",
    "बिस्तारै एउटा आँखा खोलेर जाँच्नुहोस्, अनि अर्को। शान्त, कोमल र धैर्यशील हुनुहोस्।",
    "समान रङ र चमक आश्वस्त पार्ने संकेत हुन्।",
    "पहिलो महिनामा कहिलेकाहीँ केहीबेर आँखा बाङ्गिन सक्छ। प्रायः तीन महिनाभित्र हट्छ। त्यसपछि पनि रहे थप जाँचका लागि पठाउनुहोस्।",
    "रङ फरक हुनु वा प्रतिबिम्ब आंशिक वा पूरै नदेखिनु असामान्य हो। थप मूल्याङ्कन चाहिन्छ।",
    "नतिजा स्पष्ट नभए यी तीन चरण अपनाउनुहोस्।",
    "पहिले शिशु र अभिभावकको प्रतिबिम्ब तुलना गर्नुहोस्। ती उस्तै देखिनुपर्छ।",
    "अझै शंका भए सहकर्मीको राय लिनुहोस्।",
    "सहकर्मी उपलब्ध नभए अभिभावकको सहमति लिनुहोस्।",
    "आर्कलाइट फोनको क्यामेरामा जोडेर प्रतिबिम्बको भिडियो खिच्नुहोस्।",
    "अर्को राय लिन भिडियो सुरक्षित रूपमा पठाउनुहोस्।",
    "धन्यवाद दिनुहोस्, नतिजा र अर्को कदम बताउनुहोस्।",
    "फेरि हात धुनुहोस्। रातो प्रतिबिम्बको जाँच सकियो।",
  ],
  fr: [
    "Lavez-vous les mains et mettez votre équipement de protection.",
    "Dans une pièce calme et sombre, réglez l’Arclight au plus fort et remontez les deux supports de lentilles.",
    "Rapprochez le trou de visée de votre œil.",
    "Ne dirigez pas la lumière vers votre œil et ne tenez pas l’appareil de côté.",
    "Emmaillotez le nouveau-né en toute sécurité.",
    "Faites tenir le bébé plus âgé par un parent.",
    "Un enfant assis sans aide peut rester seul.",
    "Commencez à une longueur de bras.",
    "Déplacez-vous légèrement de côté. Rapprochez-vous pour voir plus de détails.",
    "À une longueur de bras, demandez à l’enfant de vous regarder. Examinez les deux yeux ensemble. L’aspect varie avec la distance et la direction du regard.",
    "Les deux reflets doivent avoir la même couleur et luminosité. Une différence ou un reflet absent est anormal et nécessite une orientation.",
    "Selon la pigmentation rétinienne, le reflet normal peut être blanc-jaune, bleuté, rouge-orangé ou jaune-orangé.",
    "Ces aspects sont tous normaux chez ces enfants.",
    "Demandez au parent de tenir le nouveau-né en sécurité, emmailloté avec les bras à l’intérieur.",
    "Si les yeux sont ouverts, observez les deux reflets ensemble, sans toucher le bébé.",
    "Si le bébé dort, évitez de le réveiller.",
    "Emmaillotez-le, les bras à l’intérieur.",
    "Ouvrez doucement un œil, puis l’autre, pour les examiner. Restez calme, doux et patient.",
    "Une couleur et une luminosité semblables rassurent.",
    "Un bref strabisme intermittent est fréquent le premier mois et disparaît souvent avant trois mois. Au-delà, adressez l’enfant à un spécialiste.",
    "Une différence de couleur ou un reflet partiellement ou totalement absent est anormal et nécessite un examen complémentaire.",
    "Si le résultat reste incertain, suivez ces trois étapes.",
    "D’abord, comparez le reflet du bébé à celui du parent. Ils devraient se ressembler.",
    "En cas de doute, demandez l’avis d’un collègue.",
    "Sans collègue disponible, obtenez le consentement du parent.",
    "Fixez l’Arclight à la caméra du téléphone et filmez le reflet.",
    "Partagez la vidéo de façon sécurisée pour un second avis.",
    "Remerciez le parent. Expliquez le résultat et la suite.",
    "Lavez-vous les mains. L’examen du reflet rouge est terminé.",
  ],
  lg: [
    "Naaba mu ngalo, oyambale eby’okwekuuma.",
    "Mu kisenge ekisirifu ekirimu ekitangaala ekitono, tegeka Arclight. Teeka ettaala ku maanyi agasinga, osindike lenzi zombi waggulu.",
    "Leeta akatuli k’okutunuliramu okumpi n’eriiso lyo.",
    "Totunuza ttaala mu liiso lyo. Tokwata Arclight nga yeesulise ku bbali.",
    "Zinga omwana omuwere mu lugoye mu ngeri ey’obukuumi.",
    "Saba omuzadde akwatirire omwana akuzeeko.",
    "Omwana atuula obulungi ayinza okutuula yekka.",
    "Tandikira ku bbanga ly’omukono ogugoloddwa.",
    "Senguka katono ku ludda n’olulala. Semberera bw’oba weetaaga okulaba obulungi.",
    "Ku bbanga ly’omukono, saba omwana akutunuulire. Kebera amaaso gombi wamu. Endabika ekyuka okusinziira ku bbanga n’omwana gy’atunudde.",
    "Langi n’amaanyi g’ekitangaala ekidda mu maaso gombi birina okufaanagana. Bwe byawukana oba nga tekirabika, sindika omwana eri omukugu.",
    "Okusinziira ku langi ya retina, ekitangaala kiyinza okuba ekyenvu-ekyeru, bbululu, kakyungwa-akamyufu, oba kakyungwa-akyenvu.",
    "Endabika zino zonna za bulijjo.",
    "Saba omuzadde akwatirire omuwere azingiddwa mu lugoye, ng’emikono giri munda.",
    "Amaaso bwe gaba maggule, tunuulira ekitangaala ekidda mu maaso gombi wamu nga tokwata ku mwana.",
    "Omwana bw’aba yeebase, tosomooza tulo twe.",
    "Muzinge, emikono ng’eri munda.",
    "Ggulawo eriiso limu mpola olikebere, oluvannyuma eddala. Ba mukkakkamu, mugonvu era mugumiikiriza.",
    "Langi n’amaanyi ebifaanagana bigumya.",
    "Mu mwezi ogusooka, amaaso gayinza okukyama akaseera katono. Kino kitera okuggwaawo mu myezi esatu. Bwe kisigala, sindika omwana eri omukugu.",
    "Enjawulo mu langi, oba ekitangaala ekibulawo ekitundu oba kyonna, si kya bulijjo. Kyetaaga okwongera okwekebejjebwa.",
    "Bw’oba totegedde bulungi, goberera emitendera gino esatu.",
    "Sooka ogeraageranye ekitangaala ekidda mu liiso ly’omwana n’ery’omuzadde. Birina okufaanagana.",
    "Bw’oba okyabuusabuusa, saba munno endowooza.",
    "Munno bw’aba taliiwo, saba omuzadde akukkirize.",
    "Teeka Arclight ku kkamera y’essimu, okwate ekitangaala ekidda mu liiso ku katambi.",
    "Weereza akatambi mu bukuumi okufuna endowooza endala.",
    "Weebaze omuzadde. Nnyonnyola ebizuuliddwa n’ekiddako.",
    "Ddamu okunaaba mu ngalo. Okukebera ekitangaala ekidda mu liiso kuwedde.",
  ],
};
for (const [code, lines] of Object.entries(texts)) {
  if (lines.length !== s.timedCues.en.length) throw Error(code + " cue count");
  s.timedCues[code] = s.timedCues.en.map((c, i) => ({ ...c, text: lines[i] }));
  s.timedAudioCues[code] = s.timedCues[code].map((c) => ({ ...c }));
  // One continuous spoken closing sentence spans the two final captions.
  const closing = s.timedAudioCues[code].splice(-2);
  s.timedAudioCues[code].push({
    id: "after-examination",
    start: closing[0].start,
    end: closing[1].end,
    text: closing.map((c) => c.text).join(" "),
  });
  if (code === "lg") {
    const at = s.timedAudioCues[code].findIndex(
      (c) => c.id === "examination-05a",
    );
    const pair = s.timedAudioCues[code].splice(at, 2);
    s.timedAudioCues[code].splice(at, 0, {
      id: "examination-05",
      start: pair[0].start,
      end: pair[1].end,
      text: pair.map((c) => c.text).join(" "),
    });
  }
  const titles = {
    ne: [
      "तयारी",
      "जाँच",
      "नवजात शिशु — आँखा खुला",
      "नवजात शिशु — आँखा बन्द",
      "सम्भावित नतिजा",
      "अस्पष्ट नतिजा",
      "जाँचपछि",
    ],
    fr: [
      "Préparation",
      "Examen",
      "Nouveau-né — yeux ouverts",
      "Nouveau-né — yeux fermés",
      "Résultats possibles",
      "Résultats incertains",
      "Après l’examen",
    ],
    lg: [
      "Okwetegeka",
      "Okukebera",
      "Omuwere — amaaso maggule",
      "Omuwere — amaaso mazibe",
      "Ebiyinza okuzuulibwa",
      "Ebizuuliddwa ebitali bitegeerekeka",
      "Oluvannyuma lw’okukebera",
    ],
  };
  s.timedCues[code].push(
    ...s.timedCues["es-419"]
      .filter((c) => c.id.startsWith("section-"))
      .map((c, i) => ({ ...c, text: titles[code][i] })),
  );
  s.timedCues[code].sort((a, b) => a.start - b.start);
  // The original coarse cue sheet groups some of the more precise delivery cues.
  for (const c of s.cues) {
    const matching = s.timedCues[code].filter(
      (t) => t.id === c.id || t.id.startsWith(c.id),
    );
    if (matching.length) c[code] = matching.map((t) => t.text).join(" ");
  }
}
s.languages.lg.voice = "facebook/mms-tts-lug";
s.languages.lg.provider = "Meta MMS (local)";
s.languages.lg.modelLicense = "CC-BY-NC-4.0";
fs.writeFileSync(file, JSON.stringify(s, null, 2) + "\n");
