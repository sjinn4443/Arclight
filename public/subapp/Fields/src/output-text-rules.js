const SIMPLE_CONDITION_RULES = [
  [/Mixed\/Unclassified Field Defect/g, "Mixed pattern"],
  [/Mixed Altitudinal/g, "Mixed upper/lower-half pattern"],
  [/Additional left-eye defect/g, "extra left-eye change"],
  [/Additional right-eye defect/g, "extra right-eye change"],
  [
    /Bilateral Advanced Glaucoma \/ Retinitis Pigmentosa \(Tunnel Vision\)/g,
    "Tunnel vision in both eyes",
  ],
  [/Right Advanced Glaucoma \(Tunnel Vision\)/g, "Tunnel vision in right eye"],
  [/Left Advanced Glaucoma \(Tunnel Vision\)/g, "Tunnel vision in left eye"],
  [
    /Glaucoma-like Changes:\s*(?:<\/strong>\s*)?Right\(([^)]+)\)\s*&\s*Left\(([^)]+)\)/g,
    "Inner-side pattern: right ($1), left ($2)",
  ],
  [
    /Glaucoma-like Changes:\s*Right\(([^)]+)\)\s*&\s*Left\(([^)]+)\)/g,
    "Nasal-side pattern: right ($1), left ($2)",
  ],
  [/Glaucoma-like Changes Both Eyes/g, "Nasal-side pattern in both eyes"],
  [/Glaucoma-like Changes \(Right Eye\)/g, "Nasal-side pattern in right eye"],
  [/Glaucoma-like Changes \(Left Eye\)/g, "Nasal-side pattern in left eye"],
  [/Nasal-side pattern/g, "Inner-side pattern"],
  [/Glaucoma-like Changes/g, "Inner-side pattern"],
  [/Bilateral Central Scotoma/g, "Central blind spot in both eyes"],
  [/Monocular Central Scotoma/g, "Central blind spot in one eye"],
  [/Monocular Cecocentral-like Defect/g, "Central + side loss in one eye"],
  [/Monocular Temporal Hemianopia/g, "Outer-half loss in one eye"],
  [/Monocular Nasal Hemianopia/g, "Inner-half loss in one eye"],
  [/Binasal Hemianopia/g, "Inner-half loss in both eyes"],
  [/Bitemporal Hemianopia/g, "Outer-half loss in both eyes"],
  [
    /Superior Bitemporal Quadrantanopia/g,
    "Upper outer-quarter loss in both eyes",
  ],
  [
    /Inferior Bitemporal Quadrantanopia/g,
    "Lower outer-quarter loss in both eyes",
  ],
  [/Homonymous Hemianopia \(Incongruous\)/g, "Same-side half loss (uneven)"],
  [/Homonymous Hemianopia/g, "Same-side half loss"],
  [/Binocular Blindness/g, "Total loss in both eyes"],
  [/Monocular Blind Eye/g, "Total loss in one eye"],
  [/Junctional Scotoma/g, "Junction pattern"],
  [/Junction pattern \([^)]+\)/g, "Junction pattern"],
  [/Monocular 4-Quadrant Defect/g, "Wide loss"],
  [/Monocular Large Defect/g, "Large loss"],
  [/Monocular Partial Defect/g, "Patchy loss"],
  [/Binocular Superior Altitudinal/g, "Upper-half loss in both eyes"],
  [/Binocular Inferior Altitudinal/g, "Lower-half loss in both eyes"],
  [/Superior Altitudinal/g, "Upper-half loss"],
  [/Inferior Altitudinal/g, "Lower-half loss"],
  [/Quadrantanopia/g, "quarter loss"],
  [/Hemianopia/g, "half loss"],
  [/\bSuperior\b/gi, "Upper"],
  [/\bInferior\b/gi, "Lower"],
  [/\bTemporal\b/gi, "Outer"],
  [/\bNasal\b/gi, "Inner"],
  [/\b(Left|Right)\s+Monocular\b/g, "$1"],
  [/\bMonocular\b/g, "one-eye"],
  [/\bST\b/g, "upper outer"],
  [/\bSN\b/g, "upper inner"],
  [/\bIT\b/g, "lower outer"],
  [/\bIN\b/g, "lower inner"],
  [/\s*\(with partial central loss\)/g, " (central blur)"],
  [/\s*\(with definite central loss\)/g, " (central)"],
  [/Full Fields of Vision/g, "Full visual fields"],
];

const SIMPLE_LESION_RULES = [
  [/No clear field defect on screening\./g, "No clear field loss seen."],
  [
    /Likely bilateral severe pre-chiasmal disease\. RAPD is unilateral with this bilateral\/chiasmal pattern; possible mixed lesion or test inconsistency\./g,
    "Severe bilateral pattern with unilateral RAPD; possible mixed lesion or test inconsistency.",
  ],
  [
    /Likely bilateral severe pre-chiasmal disease\./g,
    "Likely problem before the chiasm in both eyes.",
  ],
  [
    /Likely pre-chiasmal \(retina\/optic nerve\)\. RAPD supports optic nerve involvement\. High-confidence anterior pattern; urgent referral\./g,
    "Likely severe optic nerve problem (RAPD supports this); urgent referral.",
  ],
  [
    /Likely pre-chiasmal \(retina\/optic nerve\)\. RAPD supports optic nerve involvement\./g,
    "Likely optic nerve problem (RAPD supports this).",
  ],
  [
    /Likely pre-chiasmal \(retina\/optic nerve\)\. RAPD side does not match field pattern; re-check\./g,
    "RAPD side does not match this pattern; re-check.",
  ],
  [
    /Likely pre-chiasmal \(retina\/optic nerve\)\./g,
    "Likely retina/optic nerve problem.",
  ],
  [
    /Likely pre-chiasmal \(retina\/optic nerve\) in that eye\. RAPD supports optic nerve involvement\. High-confidence anterior pattern; urgent referral\./g,
    "Likely severe optic nerve problem (RAPD supports this); urgent referral.",
  ],
  [
    /Likely pre-chiasmal \(retina\/optic nerve\) in that eye\. RAPD supports optic nerve involvement\./g,
    "Likely optic nerve problem (RAPD supports this).",
  ],
  [
    /Likely pre-chiasmal \(retina\/optic nerve\) in that eye\. RAPD side does not match field pattern; re-check\./g,
    "RAPD side does not match this pattern; re-check.",
  ],
  [
    /Likely pre-chiasmal \(retina\/optic nerve\) in that eye\./g,
    "Likely retina/optic nerve problem.",
  ],
  [
    /Likely pre-chiasmal \(temporal side\)\. RAPD supports optic nerve involvement\./g,
    "Likely optic nerve problem on the outer side (RAPD supports this).",
  ],
  [
    /Likely pre-chiasmal \(temporal side\)\. RAPD side does not match field pattern; re-check\./g,
    "Outer-side pattern but RAPD side mismatch; re-check.",
  ],
  [
    /Likely pre-chiasmal \(temporal side\)\./g,
    "Likely retina/optic nerve problem on the outer side.",
  ],
  [
    /Likely pre-chiasmal in that eye \(temporal side\)\. RAPD supports optic nerve involvement\./g,
    "Likely optic nerve problem on the outer side (RAPD supports this).",
  ],
  [
    /Likely pre-chiasmal in that eye \(temporal side\)\. RAPD side does not match field pattern; re-check\./g,
    "Outer-side pattern but RAPD side mismatch; re-check.",
  ],
  [
    /Likely pre-chiasmal in that eye \(temporal side\)\./g,
    "Likely retina/optic nerve problem on the outer side.",
  ],
  [
    /Likely pre-chiasmal \(nasal side\)\. RAPD supports optic nerve involvement\./g,
    "Likely optic nerve problem on the inner side (RAPD supports this).",
  ],
  [
    /Likely pre-chiasmal \(nasal side\)\. RAPD side does not match field pattern; re-check\./g,
    "Inner-side pattern but RAPD side mismatch; re-check.",
  ],
  [
    /Likely pre-chiasmal \(nasal side\)\./g,
    "Likely retina/optic nerve problem on the inner side.",
  ],
  [
    /Likely pre-chiasmal in that eye \(nasal side\)\. RAPD supports optic nerve involvement\./g,
    "Likely optic nerve problem on the inner side (RAPD supports this).",
  ],
  [
    /Likely pre-chiasmal in that eye \(nasal side\)\. RAPD side does not match field pattern; re-check\./g,
    "Inner-side pattern but RAPD side mismatch; re-check.",
  ],
  [
    /Likely pre-chiasmal in that eye \(nasal side\)\./g,
    "Likely retina/optic nerve problem on the inner side.",
  ],
  [
    /Likely focal pre-chiasmal defect\. RAPD supports optic nerve involvement\./g,
    "Likely local optic nerve problem (RAPD supports this).",
  ],
  [
    /Likely focal pre-chiasmal defect\. RAPD side does not match field pattern; re-check\./g,
    "Focal one-eye pattern but RAPD side mismatch; re-check.",
  ],
  [
    /Likely focal pre-chiasmal defect\./g,
    "Likely local retina/optic nerve problem.",
  ],
  [
    /Likely focal pre-chiasmal defect in that eye\. RAPD supports optic nerve involvement\./g,
    "Likely local optic nerve problem (RAPD supports this).",
  ],
  [
    /Likely focal pre-chiasmal defect in that eye\. RAPD side does not match field pattern; re-check\./g,
    "Focal one-eye pattern but RAPD side mismatch; re-check.",
  ],
  [
    /Likely focal pre-chiasmal defect in that eye\./g,
    "Likely local retina/optic nerve problem.",
  ],
  [
    /Likely macular cause \(haemorrhage\/hole\/fluid\) or optic nerve\. RAPD supports optic nerve involvement\./g,
    "Likely central optic nerve bundle problem (RAPD supports this).",
  ],
  [
    /Likely macular cause \(haemorrhage\/hole\/fluid\) or optic nerve\. RAPD side does not match field pattern; re-check\./g,
    "Central one-eye pattern but RAPD side mismatch; re-check.",
  ],
  [
    /Likely macular cause \(haemorrhage\/hole\/fluid\) or optic nerve\./g,
    "Likely central retina/optic nerve bundle problem.",
  ],
  [
    /Likely macula\/papillomacular pathway in that eye\. RAPD supports optic nerve involvement\./g,
    "Likely central optic nerve bundle problem (RAPD supports this).",
  ],
  [
    /Likely macula\/papillomacular pathway in that eye\. RAPD side does not match field pattern; re-check\./g,
    "Central one-eye pattern but RAPD side mismatch; re-check.",
  ],
  [
    /Likely macula\/papillomacular pathway in that eye\./g,
    "Likely central retina/optic nerve bundle problem.",
  ],
  [
    /Likely central retina\/optic nerve involvement\. RAPD supports optic nerve involvement\./g,
    "Likely central optic nerve bundle problem (RAPD supports this).",
  ],
  [
    /Likely central retina\/optic nerve involvement\. RAPD side does not match field pattern; re-check\./g,
    "Central+side one-eye pattern but RAPD side mismatch; re-check.",
  ],
  [
    /Likely central retina\/optic nerve involvement\./g,
    "Likely central retina/optic nerve bundle problem.",
  ],
  [
    /Likely papillomacular involvement in that eye\. RAPD supports optic nerve involvement\./g,
    "Likely central optic nerve bundle problem (RAPD supports this).",
  ],
  [
    /Likely papillomacular involvement in that eye\. RAPD side does not match field pattern; re-check\./g,
    "Central+side one-eye pattern but RAPD side mismatch; re-check.",
  ],
  [
    /Likely papillomacular involvement in that eye\./g,
    "Likely central retina/optic nerve bundle problem.",
  ],
  [
    /Likely bilateral macular or toxic\/nutritional optic neuropathy\. RAPD is unilateral with this bilateral\/chiasmal pattern; possible mixed lesion or test inconsistency\./g,
    "Bilateral pattern with unilateral RAPD; possible mixed lesion or test inconsistency.",
  ],
  [
    /Likely bilateral macular or toxic\/nutritional optic neuropathy\./g,
    "Likely central pathway problem in both eyes.",
  ],
  [
    /Likely optic nerve\/retinal perfusion defect of the inferior half\./g,
    "Likely optic nerve/retina problem (lower-half pattern).",
  ],
  [
    /Likely optic nerve\/retinal perfusion defect of the superior half\./g,
    "Likely optic nerve/retina problem (upper-half pattern).",
  ],
  [
    /Likely optic nerve head\/retinal vascular pattern\./g,
    "Likely optic nerve/retina pattern.",
  ],
  [
    /Likely peripheral retinal or advanced optic nerve disease\./g,
    "Likely peripheral retina or optic nerve disease.",
  ],
  [
    /Likely advanced optic nerve disease\./g,
    "Likely advanced optic nerve disease.",
  ],
  [
    /Likely chiasmal compression of crossing nasal fibres\. RAPD is unilateral with this bilateral\/chiasmal pattern; possible mixed lesion or test inconsistency\./g,
    "Likely chiasm problem; unilateral RAPD suggests mixed lesion or test inconsistency.",
  ],
  [
    /Likely chiasmal compression of crossing nasal fibres\./g,
    "Likely chiasm problem.",
  ],
  [
    /Likely partial chiasmal compression\. RAPD is unilateral with this bilateral\/chiasmal pattern; possible mixed lesion or test inconsistency\./g,
    "Likely partial chiasm problem; unilateral RAPD suggests mixed lesion or test inconsistency.",
  ],
  [/Likely partial chiasmal compression\./g, "Likely partial chiasm problem."],
  [
    /Uncommon bilateral pattern: optic nerve\/ocular or lateral chiasm\. RAPD is unilateral with this bilateral\/chiasmal pattern; possible mixed lesion or test inconsistency\./g,
    "Uncommon bilateral pattern with unilateral RAPD; re-check and refer.",
  ],
  [
    /Uncommon bilateral pattern: optic nerve\/ocular or lateral chiasm\./g,
    "Uncommon mixed pattern; re-check and refer.",
  ],
  [
    /Uncommon: consider bilateral ocular\/optic-nerve causes or lateral chiasmal compression\. RAPD is unilateral with this bilateral\/chiasmal pattern; possible mixed lesion or test inconsistency\./g,
    "Uncommon bilateral pattern with unilateral RAPD; re-check and refer.",
  ],
  [
    /Uncommon: consider bilateral ocular\/optic-nerve causes or lateral chiasmal compression\./g,
    "Uncommon mixed pattern; re-check and refer.",
  ],
  [
    /Likely optic tract lesion \(post-chiasmal\)\. RAPD side does not match homonymous pattern; re-check\./g,
    "Likely tract lesion, but RAPD side mismatch; re-check.",
  ],
  [
    /Likely optic tract lesion \(post-chiasmal\); RAPD supports tract localisation\./g,
    "Likely optic tract problem (RAPD supports this).",
  ],
  [
    /Likely optic tract lesion \(post-chiasmal\); RAPD supports tract localization\./g,
    "Likely optic tract problem (RAPD supports this).",
  ],
  [
    /Likely optic tract lesion \(post-chiasmal\)\./g,
    "Likely deep pathway problem after the chiasm.",
  ],
  [
    /Likely left post-chiasmal lesion; RAPD suggests left optic tract involvement\./g,
    "Likely left optic tract problem (RAPD supports this).",
  ],
  [
    /Likely right post-chiasmal lesion; RAPD suggests right optic tract involvement\./g,
    "Likely right optic tract problem (RAPD supports this).",
  ],
  [
    /Likely left post-chiasmal lesion, probably radiations\/occipital cortex\. RAPD side does not match homonymous pattern; re-check\./g,
    "Likely left brain-pathway pattern, but RAPD side mismatch; re-check.",
  ],
  [
    /Likely left post-chiasmal lesion, probably radiations\/occipital cortex\./g,
    "Likely left brain-pathway problem.",
  ],
  [
    /Likely right post-chiasmal lesion, probably radiations\/occipital cortex\. RAPD side does not match homonymous pattern; re-check\./g,
    "Likely right brain-pathway pattern, but RAPD side mismatch; re-check.",
  ],
  [
    /Likely right post-chiasmal lesion, probably radiations\/occipital cortex\./g,
    "Likely right brain-pathway problem.",
  ],
  [
    /Likely left post-chiasmal \(radiations\/occipital\)\. RAPD side mismatch; re-check\./g,
    "Likely left brain-pathway pattern, but RAPD side mismatch; re-check.",
  ],
  [
    /Likely left post-chiasmal \(radiations\/occipital\)\./g,
    "Likely left brain-pathway problem.",
  ],
  [
    /Likely right post-chiasmal \(radiations\/occipital\)\. RAPD side mismatch; re-check\./g,
    "Likely right brain-pathway pattern, but RAPD side mismatch; re-check.",
  ],
  [
    /Likely right post-chiasmal \(radiations\/occipital\)\./g,
    "Likely right brain-pathway problem.",
  ],
  [/Likely post-chiasmal lesion\./g, "Likely brain pathway after crossing."],
  [
    /Likely temporal \(Meyer's loop\) or lower calcarine lesion\./g,
    "Likely outer radiation pathway.",
  ],
  [
    /Likely parietal radiations or upper calcarine lesion\./g,
    "Likely inner radiation pathway.",
  ],
  [
    /Likely optic nerve-chiasm junction lesion\./g,
    "Likely optic nerve/chiasm junction problem.",
  ],
  [/Likely chiasm problem\./g, "Likely crossing-point problem."],
  [
    /Likely partial chiasm problem\./g,
    "Likely partial crossing-point problem.",
  ],
  [
    /Likely optic nerve\/chiasm junction problem\./g,
    "Likely optic nerve/crossing-point junction problem.",
  ],
  [
    /Nasal-predominant change with central sparing\./g,
    "Inner-side pattern with centre spared.",
  ],
  [
    /Single-eye patch\/multi-quadrant loss\. RAPD supports optic nerve involvement\./g,
    "Patchy one-eye loss; RAPD supports optic nerve involvement.",
  ],
  [
    /Single-eye patch\/multi-quadrant loss\. RAPD side does not match field pattern; re-check\./g,
    "Patchy one-eye loss with RAPD side mismatch; re-check.",
  ],
  [/Single-eye patch\/multi-quadrant loss\./g, "Patchy one-eye loss."],
  [
    /Mixed pattern\. Repeat fields and reassess\./g,
    "Mixed pattern; repeat and re-check.",
  ],
  [/Sudden onset: same-day review\./g, "Sudden onset: urgent review."],
  [/Gradual onset: compare history\./g, "Gradual onset: compare history."],
  [/Neuro flags: urgent neuro review\./g, "Neuro flags: urgent referral."],
  [
    /Flashes\/curtain: urgent retina review\./g,
    "Flashes/curtain: urgent retina referral.",
  ],
  [
    /Colour fade: optic nerve more likely\./g,
    "Colour fade: optic nerve likely.",
  ],
  [
    /Night vision poor: consider retinal degeneration\./g,
    "Night vision poor: retinal degeneration possible.",
  ],
  [
    /Known old defect: compare prior records\./g,
    "Known old defect: compare old records.",
  ],
  [
    /Sudden onset: prioritize same-day review\./g,
    "Sudden onset: urgent review.",
  ],
  [
    /Gradual onset: often chronic; compare history and prior pattern\./g,
    "Gradual onset: compare history.",
  ],
  [
    /Neuro red flags present: urgent neurological assessment\./g,
    "Neuro flags: urgent referral.",
  ],
  [
    /Known old defect: if stable, compare with prior records\./g,
    "Known old defect: compare old records.",
  ],
  [/\bchiasm\b/gi, "crossing point"],
  [/\bchiasmal\b/gi, "crossing-point"],
];

window.OUTPUT_TEXT_RULES = {
  simpleCondition: SIMPLE_CONDITION_RULES,
  simpleLesion: SIMPLE_LESION_RULES,
};
